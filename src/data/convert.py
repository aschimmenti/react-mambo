import pandas as pd
import json
from datetime import datetime

# Read the CSV file
df = pd.read_csv('ol_by_gender.csv')

# Initialize the list to store our data
data = []

# Convert each row to the required format
for _, row in df.iterrows():
    # Create date string in YYYY-01-01 format
    date = f"{int(row['year'])}-01-01"
    
    # Add male athletes entry
    data.append({
        "date": date,
        "name": "Male Athletes",
        "category": "Athletes",
        "value": int(row['maleCount'])
    })
    
    # Add female athletes entry
    data.append({
        "date": date,
        "name": "Female Athletes",
        "category": "Athletes",
        "value": int(row['femaleCount'])
    })

# Create the final structure
output = {"data": data}

# Save to JSON file
with open('olympicsData.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, indent=2)

# Print first few entries to verify
print("First few entries of the converted data:")
print(json.dumps({"data": data[:4]}, indent=2))

# Print some statistics
total_entries = len(data)
years_covered = len(df)
print(f"\nTotal entries: {total_entries}")
print(f"Years covered: {years_covered}")
print(f"Entries per year: {total_entries/years_covered}")