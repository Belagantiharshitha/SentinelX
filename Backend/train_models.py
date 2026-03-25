import sys
import os

# Add Backend to path so we can import app components
sys.path.append(os.path.join(os.getcwd()))

from app.services.ml_model import fraud_model
from app.database.db import SessionLocal

def train():
    print("Initializing Hardcore Training Pulse...")
    dataset_path = os.path.join("..", "bank_transactions_data_2_augmented_clean_2.csv")
    if not os.path.exists(dataset_path):
        # Try absolute path based on workspace info
        dataset_path = r"C:\Users\sahit\OneDrive\Desktop\sentinel\SentinelX\bank_transactions_data_2_augmented_clean_2.csv"
        
    if os.path.exists(dataset_path):
        success = fraud_model.train_from_csv(dataset_path)
        if success:
            print("SUCCESS: IsolationForest & PCA Model ready for high-fidelity visualization.")
        else:
            print("ERROR: Training failed. Check ml_model.py logs.")
    else:
        print(f"ERROR: Dataset not found at {dataset_path}")

if __name__ == "__main__":
    train()
