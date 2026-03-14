from app.database.db import SessionLocal
from app.database.models import MockEmail, Account
import json
import datetime

# Target email to receive the 5 mock alerts
TARGET_EMAIL = "aaron.wilson.777@gmail.com"

def seed_interactive_mails():
    db = SessionLocal()
    account = db.query(Account).filter(Account.email == TARGET_EMAIL).first()
    
    if not account:
        print(f"Error: Account {TARGET_EMAIL} not found.")
        db.close()
        return

    # Delete existing mock emails for this account to keep it clean
    db.query(MockEmail).filter(MockEmail.to_email == TARGET_EMAIL).delete()
    
    locations = ["Moscow, RU", "Beijing, CN", "Lagos, NG", "Berlin, DE", "Pyongyang, KP"]
    devices = ["Unknown Linux Agent", "iPhone 12 / Safari", "Windows PC / Firefox", "Android / Chrome", "Unknown Script"]

    for i in range(5):
        location = locations[i]
        device = devices[i]
        time_str = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")

        # Payloads for the interactive buttons
        approve_payload = json.dumps({"account_id": account.id, "token": "mock-token-123"})
        
        # When clicking 'No, secure account', we want to prompt for a new password
        # Since we can't easily do a prompt inside the raw HTML being injected safely across all browsers perfectly every time,
        # we will use an inline onclick handler to prompt the user, then call the exposed handleMfaAction function.
        deny_action_js = f"""
            const newPassword = prompt('To secure your account, please enter a new password:');
            if (newPassword) {{
                window.handleMfaAction('http://localhost:8000/api/accounts/secure-account', {{ 'account_id': {account.id}, 'token': 'mock-token-123', 'new_password': newPassword }});
            }}
        """

        html_content = f"""
        <html>
          <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <h2 style="color: #0353A4;">SentinelX Security Alert</h2>
            <p>Dear {account.holder_name},</p>
            <p>We detected a new login to your Novus Bank account from an unrecognized device.</p>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Device:</strong> {device}</p>
                <p style="margin: 5px 0;"><strong>Location:</strong> {location}</p>
                <p style="margin: 5px 0;"><strong>Time:</strong> {time_str}</p>
            </div>
            
            <div style="margin: 30px 0; display: flex; gap: 15px; border-top: 1px solid #eee; padding-top: 20px;">
                <button onclick="window.handleMfaAction('http://localhost:8000/api/accounts/acknowledge-login', {approve_payload.replace('"', '&quot;')})" style="background: #10b981; color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
                    Yes, it was me
                </button>
                <button onclick="{deny_action_js.replace(chr(10), '').replace('"', '&quot;')}" style="background: #ef4444; color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
                    No, secure account
                </button>
            </div>
            
            <p style="font-size: 0.8em; color: #777;">This is an automated message from SentinelX.</p>
          </body>
        </html>
        """

        new_mail = MockEmail(
            to_email=TARGET_EMAIL,
            subject=f"Security Alert: Login from {location}",
            html_content=html_content
        )
        db.add(new_mail)

    db.commit()
    db.close()
    print(f"Successfully seeded 5 interactive mock emails for {TARGET_EMAIL}")

if __name__ == "__main__":
    seed_interactive_mails()
