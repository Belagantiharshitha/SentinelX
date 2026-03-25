import pyotp

def generate_totp_secret():
    """Generate a new random TOTP secret."""
    return pyotp.random_base32()

def get_totp_uri(secret, email, issuer_name="Novus Bank Institutional"):
    """Generate a provisioning URI for QR codes."""
    totp = pyotp.TOTP(secret)
    return totp.provisioning_uri(name=email, issuer_name=issuer_name)

def verify_totp(secret, code):
    """Verify a TOTP code against a secret."""
    totp = pyotp.TOTP(secret)
    return totp.verify(code)
