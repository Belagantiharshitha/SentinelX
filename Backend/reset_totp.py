import sqlite3

def reset_totp(email):
    conn = sqlite3.connect('sentinelx_v4.db')
    cursor = conn.cursor()
    cursor.execute("UPDATE accounts SET totp_enabled = 0, totp_secret = NULL WHERE email = ?", (email,))
    conn.commit()
    print(f"Successfully reset TOTP for {email}")
    conn.close()

if __name__ == "__main__":
    reset_totp('aaron.wilson.777@gmail.com')
