from app.database.db import SessionLocal
from app.routes.events import create_event
from app.schemas.event import EventCreate
import asyncio

async def test():
    db = SessionLocal()
    event_in = EventCreate(
        account_id=1,
        event_type="transaction",
        ip_address="45.67.89.12",
        device="HackBox 9000",
        location="Mars",
        transaction_amount=9999.0
    )
    try:
        print("Testing create_event directly...")
        result = await create_event(event_in, db)
        print("SUCCESS:", result)
    except Exception as e:
        import traceback
        print("CRASH DETECTED:")
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(test())
