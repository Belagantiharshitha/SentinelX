from app.database.db import SessionLocal
from app.routes.simulate import simulate_transaction_anomaly
import asyncio

async def test():
    db = SessionLocal()
    try:
        print("Testing simulation directly...")
        # Simulate the FastAPI dependency injection
        result = await simulate_transaction_anomaly(account_id=1, db=db)
        print("SUCCESS:", result)
    except Exception as e:
        import traceback
        print("CRASH DETECTED:")
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(test())
