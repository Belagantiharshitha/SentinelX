from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from ..database.db import get_db
from ..database import models
from ..schemas.account import AccountResponse, AccountBase, AccountLogin
from pydantic import BaseModel

import uuid
import pyotp
import qrcode
import io
import base64
from datetime import datetime, timedelta
from .totp import generate_totp_secret, get_totp_uri, verify_totp # New import
from ..utils.security import get_password_hash # New import

class LoginRequest(BaseModel):
    email: str
    password: str
    device: str = "Unknown"
    location: str = "Unknown"

class TOTPLoginRequest(BaseModel):
    email: str
    password: str
    totp_code: str

class TOTPSetupResponse(BaseModel):
    secret: str
    qr_code_base64: str

class TOTPEnableRequest(BaseModel):
    code: str

# New model for TOTP verification
class TOTPVerificationRequest(BaseModel):
    code: str

class DeviceAuthResponse(BaseModel):
    status: str
    message: str

# New model for MFA actions
class MfaActionRequest(BaseModel):
    account_id: int
    token: str

router = APIRouter()

@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    account = db.query(models.Account).filter(models.Account.email == request.email).first()
    if not account:
        return {"error": "Account not found"}
    
    if account.password != request.password:
        return {"error": "Invalid password"}

    # 1. Advanced MFA (TOTP)
    if account.totp_enabled:
        return {
            "status": "totp_required",
            "message": "Authenticator code required."
        }
    
    # 2. Basic MFA (Device Check via Email)
    if account.baseline_primary_device and request.device != account.baseline_primary_device:
        # Generate token and request
        auth_token = str(uuid.uuid4())
        
        # Invalidate old pending requests for this account
        db.query(models.DeviceAuthRequest).filter(
            models.DeviceAuthRequest.account_id == account.id,
            models.DeviceAuthRequest.status == "pending"
        ).delete()
        
        auth_request = models.DeviceAuthRequest(
            account_id=account.id,
            device=request.device,
            location=request.location,
            token=auth_token,
            expires_at=datetime.utcnow() + timedelta(minutes=15)
        )
        db.add(auth_request)
        
        # Create Mock Email
        import json
        approve_payload_str = json.dumps({"account_id": account.id, "token": auth_token}).replace('"', '&quot;')
        
        deny_action_js = f"""
            const newPassword = prompt('To secure your account, please enter a new password:');
            if (newPassword) {{
                window.handleMfaAction('http://localhost:8000/api/accounts/secure-account', {{ 'account_id': {account.id}, 'token': '{auth_token}', 'new_password': newPassword }});
            }}
        """.replace(chr(10), '').replace('"', '&quot;')
        
        html_content = f"""
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
            <div style="background-color: #0353A4; padding: 20px; text-align: center;">
                <h2 style="color: white; margin: 0;">SentinelX Security Alert</h2>
            </div>
            <div style="padding: 30px;">
                <p>Hello <strong>{account.holder_name}</strong>,</p>
                <p>We detected a new login attempt to your Novus Bank account from an unrecognized device.</p>
                
                <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
                    <p style="margin: 5px 0; color: #64748b; font-size: 0.9em; text-transform: uppercase;">Device</p>
                    <p style="margin: 0 0 15px 0; font-weight: bold; font-size: 1.1em;">{request.device}</p>
                    
                    <p style="margin: 5px 0; color: #64748b; font-size: 0.9em; text-transform: uppercase;">Location</p>
                    <p style="margin: 0; font-weight: bold; font-size: 1.1em;">{request.location}</p>
                </div>
                
                <h3 style="margin-top: 30px;">Is this you?</h3>
                <p>If you initiated this login, please authorize the device below to proceed.</p>
                
                <div style="margin-top: 20px; display: flex; gap: 15px;">
                    <button onclick="window.handleMfaAction('http://localhost:8000/api/accounts/acknowledge-login', {approve_payload_str})" style="background-color: #10b981; color: white; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
                        Yes, it was me
                    </button>
                    <button onclick="{deny_action_js}" style="background-color: #ef4444; color: white; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
                        No, secure account
                    </button>
                </div>
            </div>
            <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 0.8em; color: #64748b;">
                This is an automated security message from Novus Bank.
            </div>
        </div>
        """
        
        mock_email = models.MockEmail(
            to_email=account.email,
            subject="Security Alert: Authorization Required for New Device",
            html_content=html_content
        )
        db.add(mock_email)
        db.commit()
        
        return {
            "status": "mfa_required",
            "message": "We detected a login from a new device. Please check your email to authorize this login.",
            "auth_token_hint": auth_token # Just for debugging locally if needed
        }

    
    return {
        "status": "success",
        "user": {
            "id": account.id,
            "name": account.holder_name,
            "email": account.email,
            "account_number": account.account_number,
            "baseline_location": account.baseline_primary_location,
            "baseline_device": account.baseline_primary_device
        }
    }

@router.post("/login/totp")
def login_totp(request: TOTPLoginRequest, db: Session = Depends(get_db)):
    account = db.query(models.Account).filter(models.Account.email == request.email).first()
    if not account or account.password != request.password:
        return {"error": "Invalid credentials"}
        
    if not account.totp_enabled or not account.totp_secret:
        return {"error": "TOTP is not enabled for this account"}
        
    totp = pyotp.TOTP(account.totp_secret)
    if not totp.verify(request.totp_code):
        return {"error": "Invalid authenticator code"}
        
    return {
        "status": "success",
        "user": {
            "id": account.id,
            "name": account.holder_name,
            "email": account.email,
            "account_number": account.account_number,
            "baseline_location": account.baseline_primary_location,
            "baseline_device": account.baseline_primary_device
        }
    }

@router.post("/{account_id}/totp/setup", response_model=TOTPSetupResponse)
def setup_totp(account_id: int, db: Session = Depends(get_db)):
    account = db.query(models.Account).filter(models.Account.id == account_id).first()
    if not account:
        return {"error": "Account not found"}
        
    # Generate new secret
    secret = pyotp.random_base32()
    account.totp_secret = secret
    account.totp_enabled = 0  # Require verification to enable
    db.commit()
    
    # Generate provisioning URI
    totp = pyotp.TOTP(secret)
    uri = totp.provisioning_uri(name=account.email, issuer_name="Novus Bank Institutional")
    
    # Generate QR Code image
    qr = qrcode.make(uri)
    buf = io.BytesIO()
    qr.save(buf, format='PNG')
    qr_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
    
    return {
        "secret": secret,
        "qr_code_base64": qr_base64
    }

@router.post("/accounts/{account_id}/totp/enable")
def enable_totp(account_id: int, request: TOTPVerificationRequest, db: Session = Depends(get_db)):
    account = db.query(Account).filter(Account.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
        
    if not account.totp_secret:
        raise HTTPException(status_code=400, detail="TOTP not initialized. Call /setup first.")
        
    is_valid = verify_totp(account.totp_secret, request.code)
    if not is_valid:
        raise HTTPException(status_code=401, detail="Invalid verification code")
        
    # Mark as enabled
    account.totp_enabled = True
    db.commit()
    
    return {"message": "TOTP successfully enabled for this account"}

@router.post("/acknowledge-login")
def acknowledge_login(req: MfaActionRequest, db: Session = Depends(get_db)):
    auth_req = db.query(models.DeviceAuthRequest).filter(
        models.DeviceAuthRequest.token == req.token,
        models.DeviceAuthRequest.account_id == req.account_id,
        models.DeviceAuthRequest.status == "pending"
    ).first()
    
    if not auth_req:
        raise HTTPException(status_code=400, detail="Invalid or expired authorization link.")
        
    auth_req.status = "approved"
    
    account = db.query(models.Account).filter(models.Account.id == req.account_id).first()
    if account:
        account.baseline_primary_device = auth_req.device
        
    db.commit()
    return {"message": "Login approved. Your new device has been trusted."}

class SecureAccountRequest(BaseModel):
    account_id: int
    token: str
    new_password: str

@router.post("/secure-account")
def secure_account(req: SecureAccountRequest, db: Session = Depends(get_db)):
    account = db.query(models.Account).filter(models.Account.id == req.account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
        
    # Update password and lock account for review
    account.password = get_password_hash(req.new_password) # Assuming password_hash is now just 'password'
    account.account_status = "Locked"
    
    # Create an incident to notify SOC team of compromised credentials
    new_incident = models.Incident(
        account_id=account.id,
        attack_type="Compromised Credentials Confirmed",
        severity="Critical",
        action_taken="account_locked_password_reset",
        ai_summary="User explicitly confirmed that a login attempt was unauthorized and initiated an emergency password reset. Account frozen pending review.",
        status="open",
        created_at=datetime.utcnow()
    )
    db.add(new_incident)
    db.commit()
    
    return {"message": "Account secured. Password updated and access frozen."}

@router.post("/approve-device/{token}")
def approve_device(token: str, db: Session = Depends(get_db)):
    auth_request = db.query(models.DeviceAuthRequest).filter(
        models.DeviceAuthRequest.token == token,
        models.DeviceAuthRequest.status == "pending"
    ).first()
    
    if not auth_request:
        return {"error": "Invalid or expired authorization token."}
        
    if datetime.utcnow() > auth_request.expires_at:
        auth_request.status = "expired"
        db.commit()
        return {"error": "Authorization token has expired."}
        
    # Approve device
    auth_request.status = "approved"
    
    # Update user baseline (In a real system, we'd add it to a list of known devices)
    account = db.query(models.Account).filter(models.Account.id == auth_request.account_id).first()
    account.baseline_primary_device = auth_request.device
    
    db.commit()
    return {"status": "success", "message": "Device successfully authorized. You can now log in."}

@router.post("/deny-device/{token}")
def deny_device(token: str, db: Session = Depends(get_db)):
    auth_request = db.query(models.DeviceAuthRequest).filter(
        models.DeviceAuthRequest.token == token,
        models.DeviceAuthRequest.status == "pending"
    ).first()
    
    if not auth_request:
        return {"error": "Invalid or expired authorization token."}
        
    # Deny device and lock account
    auth_request.status = "denied"
    
    account = db.query(models.Account).filter(models.Account.id == auth_request.account_id).first()
    account.account_status = "Locked"
    
    # Log incident
    from datetime import datetime
    new_event = models.Event(
        account_id=account.id,
        event_type="UNAUTHORIZED_ACCESS_ATTEMPT",
        severity="CRITICAL",
        location=auth_request.location,
        device=auth_request.device,
        risk_contribution=100.0,
        description="User denied login attempt from new device. Account locked.",
        timestamp=datetime.utcnow()
    )
    db.add(new_event)
    
    db.commit()
    return {"status": "success", "message": "Access denied. Your account has been secured and locked."}

@router.post("/", response_model=AccountResponse)
def create_account(account: AccountBase, db: Session = Depends(get_db)):

    new_account = models.Account(
        account_number=account.account_number,
        holder_name=account.holder_name,
        email=account.email,
        password=account.password,
        baseline_avg_transaction=account.baseline_avg_transaction,
        baseline_primary_device=account.baseline_primary_device,
        baseline_primary_location=account.baseline_primary_location,
        baseline_login_start_hour=account.baseline_login_start_hour,
        baseline_login_end_hour=account.baseline_login_end_hour,
        risk_score=0,
        risk_level="Safe",
        account_status="Active"
    )

    db.add(new_account)
    db.commit()
    db.refresh(new_account)

    return new_account


@router.get("/", response_model=List[AccountResponse])
def get_accounts(db: Session = Depends(get_db)):
    return db.query(models.Account).all()


@router.get("/search/{name}")
def search_account(name: str, db: Session = Depends(get_db)):
    account = db.query(models.Account).filter(models.Account.holder_name.ilike(f"%{name}%")).first()
    if not account:
        return {"error": "Account not found"}
    return account


@router.get("/{account_id}")
def get_account_details(account_id: int, db: Session = Depends(get_db)):
    account = db.query(models.Account).filter(models.Account.id == account_id).first()
    if not account:
        return {"error": "Account not found"}
    
    events = db.query(models.Event).filter(models.Event.account_id == account_id).order_by(models.Event.timestamp.desc()).limit(10).all()
    incidents = db.query(models.Incident).filter(models.Incident.account_id == account_id).order_by(models.Incident.created_at.desc()).all()
    
    return {
        "account": account,
        "recent_events": events,
        "incident_history": incidents
    }

@router.post("/{account_id}/lockdown")
def lockdown_account(account_id: int, db: Session = Depends(get_db)):
    account = db.query(models.Account).filter(models.Account.id == account_id).first()
    if not account:
        return {"error": "Account not found"}
    
    account.account_status = "Locked"
    
    # Also log a critical event for this lockdown
    from datetime import datetime
    new_event = models.Event(
        account_id=account_id,
        event_type="EMERGENCY_LOCKDOWN",
        severity="CRITICAL",
        location="SYSTEM_OS",
        ip_address="127.0.0.1",
        risk_contribution=50.0,
        description="Manual emergency lockdown triggered by administrator.",
        timestamp=datetime.now()
    )
    db.add(new_event)
    
    # Update risk score as well
    account.risk_score = min(300.0, account.risk_score + 50.0)
    if account.risk_score >= 180:
        account.risk_level = "High"
    if account.risk_score >= 240:
        account.risk_level = "Critical"
        
    db.commit()
    db.refresh(account)
    
    return {"status": "success", "message": f"Account {account.account_number} has been locked.", "account": account}
