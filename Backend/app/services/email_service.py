import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import asyncio
from dotenv import load_dotenv

load_dotenv()

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

async def send_security_alert(user_email: str, user_name: str, device: str, location: str, timestamp: datetime):
    """Asynchronously sends a security alert email for new device logins."""
    subject = "Security Alert: Login from a New Device"
    time_str = timestamp.strftime("%Y-%m-%d %H:%M:%S UTC")
    
    html_content = f"""
    <html>
      <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #0353A4;">SentinelX Security Alert</h2>
        <p>Dear {user_name},</p>
        <p>We detected a new login to your Novus Bank account from an unrecognized device.</p>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Device:</strong> {device}</p>
            <p style="margin: 5px 0;"><strong>Location:</strong> {location}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> {time_str}</p>
        </div>
        <p><strong>If this was you:</strong> You can ignore this email.</p>
        <p><strong>If this wasn't you:</strong> Please secure your account immediately.</p>
        <br/>
        <p style="font-size: 0.8em; color: #777;">This is an automated message from SentinelX.</p>
      </body>
    </html>
    """
    await _dispatch_email(user_email, subject, html_content)

async def send_threat_alert(user_email: str, user_name: str, attack_type: str, severity: str, summary: str):
    """Asynchronously sends a high-priority threat alert for detected attacks."""
    subject = f"URGENT: {attack_type} Attack Detected on Your Account"
    
    html_content = f"""
    <html>
      <body style="font-family: 'Segoe UI', Roboto, sans-serif; color: #1e293b; line-height: 1.6;">
        <div style="background: #ef4444; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">CRITICAL SECURITY ALERT</h1>
        </div>
        <div style="padding: 30px; border: 1px solid #fee2e2; border-top: none; border-radius: 0 0 8px 8px;">
            <p>Dear {user_name},</p>
            <p>Our SentinelX AI Detection Engine has identified a <strong>{severity} severity</strong> threat targeting your account.</p>
            
            <div style="background: #fff1f2; border-left: 4px solid #f43f5e; padding: 15px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Detected Attack:</strong> {attack_type}</p>
                <p style="margin: 5px 0;"><strong>AI Analysis:</strong> {summary}</p>
            </div>
            
            <p>Based on this activity, your account has been placed under <strong>{severity} Alert</strong> status. Our automated response filters have been activated to protect your assets.</p>
            
            <p>Please log in to the portal immediately to review recent activity and secure your credentials.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="#" style="background: #1e293b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Review Security Dashboard</a>
            </div>
            
            <p style="font-size: 13px; color: #64748b; border-top: 1px solid #f1f5f9; paddingTop: 20px;">
                This is a real-time intelligence alert from the SentinelX Advanced Threat Protection system.
            </p>
        </div>
      </body>
    </html>
    """
    await _dispatch_email(user_email, subject, html_content)

async def _dispatch_email(to_email: str, subject: str, html_content: str):
    """Helper to dispatch email to both Mock DB and real SMTP (if configured)."""
    # 1. Save to Mock DB for the frontend mailbox
    from ..database.db import SessionLocal
    from ..database import models
    
    db = SessionLocal()
    try:
        new_mail = models.MockEmail(
            to_email=to_email,
            subject=subject,
            html_content=html_content
        )
        db.add(new_mail)
        db.commit()
    finally:
        db.close()

    # 2. Trigger Real or Mock SMTP logic
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = SMTP_EMAIL or "sentinelx-alerts@noreply.com"
    msg["To"] = to_email
    msg.attach(MIMEText(html_content, "html"))
    
    await asyncio.to_thread(_send_email_sync, to_email, msg.as_string())


def _send_email_sync(to_email: str, msg_str: str):
    if not SMTP_EMAIL or not SMTP_PASSWORD:
        print("\n" + "="*50)
        print(f"MOCK SMTP EVENT: Security Alert Email triggered for {to_email}")
        print("Note: Configure SMTP_EMAIL and SMTP_PASSWORD in .env to send real emails.")
        print(msg_str)
        print("="*50 + "\n")
        return

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        server.sendmail(SMTP_EMAIL, to_email, msg_str)
        server.quit()
        print(f"Real SMTP Event: Sent security email to {to_email}")
    except Exception as e:
        print(f"Failed to send email to {to_email}. Error: {e}")
