import asyncio
from playwright.async_api import async_playwright
import pyotp

async def test_totp_flow():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        # Attach console listener to see frontend errors
        page.on('console', lambda msg: print(f"BROWSER CONSOLE: {msg.text}"))

        print("Navigating to Novus Bank frontend...")
        await page.goto("http://localhost:5174")

        # 1. Login with credentials
        print("Logging in with standard credentials...")
        try:
            await page.fill('input[type="email"]', 'aaron.wilson.777@gmail.com')
            await page.fill('input[type="password"]', 'password123')
            await page.click('button:has-text("Sign In")')

            # Wait for dashboard to load (defaults to Overview)
            await page.wait_for_selector('text=My Accounts', timeout=10000)
            print("Logged in successfully!")
        except Exception as e:
            print(f"Failed to login: {e}")
            # print(await page.content())
            await page.screenshot(path="login_failed.png")
            await browser.close()
            return

        # 2. Go to Profile and Setup TOTP
        print("Navigating to Profile to setup TOTP...")
        await page.click('.nav-item:has-text("Profile")')
        await page.wait_for_selector('text=Profile Core', timeout=5000)
        
        # Click "Set Up Authenticator App"
        await page.click('button:has-text("Set Up Authenticator App")')

        print("Waiting for QR Code and Setup Key to appear")
        await page.wait_for_selector('img[alt="TOTP QR Code"]')

        # Extract the secret
        secret_element = await page.wait_for_selector('code')
        secret = await secret_element.inner_text()
        print(f"Captured TOTP Secret: {secret}")

        # 3. Generate a code and verify it
        totp = pyotp.TOTP(secret)
        current_code = totp.now()
        print(f"Generated TOTP Code: {current_code}")

        print("Submitting the code to verify setup...")
        # Assuming the input for the code has a placeholder '000000'
        await page.fill('input[placeholder="000000"]', current_code)
        await page.click('button:has-text("Verify")')

        # Wait for success message
        await page.wait_for_selector('text=Authenticator App successfully linked!')
        print("Success! TOTP is now enabled for this account.")
        
        # 4. Test logging out and logging back in with TOTP
        print("Logging out...")
        await page.click('text=Secure Logout')
        await page.wait_for_selector('text=Welcome Back')

        print("Logging in again with standard credentials...")
        await page.fill('input[type="email"]', 'aaron.wilson.777@gmail.com')
        await page.fill('input[type="password"]', 'password123')
        await page.click('button:has-text("Sign In")')

        print("Waiting for TOTP Challenge...")
        await page.wait_for_selector('text=Two-Factor Authentication')
        
        current_code_2 = totp.now()
        print(f"Generating new TOTP Code for Login: {current_code_2}")
        
        await page.fill('input[placeholder="000000"]', current_code_2)
        await page.click('button:has-text("Verify Code")')

        await page.wait_for_selector('text=My Accounts', timeout=10000)
        print("Successfully logged in with TOTP!")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(test_totp_flow())
