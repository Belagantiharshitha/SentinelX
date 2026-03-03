import csv
import random

# Simple lists of names for demonstration
FIRST_NAMES_MALE = ["John", "Michael", "Bradley", "Stephen", "David", "James", "Robert", "William", "Joseph", "Thomas"]
FIRST_NAMES_FEMALE = ["Jane", "Mary", "Elizabeth", "Jennifer", "Linda", "Barbara", "Susan", "Jessica", "Sarah", "Karen"]
LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"]

def add_names_to_csv(input_file, output_file):
    """
    Reads a CSV file and adds a 'username' column with names based on the 'gender' column.
    """
    try:
        with open(input_file, mode='r', encoding='utf-8') as infile:
            reader = csv.DictReader(infile)
            fieldnames = reader.fieldnames + ['username']
            
            rows = []
            for row in reader:
                gender = row.get('gender', '').lower()
                if gender == 'male':
                    first = random.choice(FIRST_NAMES_MALE)
                elif gender == 'female':
                    first = random.choice(FIRST_NAMES_FEMALE)
                else:
                    first = random.choice(FIRST_NAMES_MALE + FIRST_NAMES_FEMALE)
                
                last = random.choice(LAST_NAMES)
                row['username'] = f"{first} {last}"
                rows.append(row)
                
        with open(output_file, mode='w', encoding='utf-8', newline='') as outfile:
            writer = csv.DictWriter(outfile, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)
            
        print(f"Success! Updated data saved to: {output_file}")
    except FileNotFoundError:
        print(f"Error: The file '{input_file}' was not found.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    # Change 'users_data(1).csv' to your actual input filename
    add_names_to_csv('users_data(1).csv', 'updated_users_data.csv')
