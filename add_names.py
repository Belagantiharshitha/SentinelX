import pandas as pd
from faker import Faker

fake = Faker()

# Read your CSV
df = pd.read_csv("users_data (1).csv")

# Generate name based on gender
def generate_name(gender):
    if str(gender).strip().lower() == "male":
        return fake.name_male()
    elif str(gender).strip().lower() == "female":
        return fake.name_female()
    else:
        return fake.name()

# Add new column
df["username"] = df["gender"].apply(generate_name)

# Save updated file
df.to_csv("updated_users_data.csv", index=False)

print("✅ Names added successfully!")