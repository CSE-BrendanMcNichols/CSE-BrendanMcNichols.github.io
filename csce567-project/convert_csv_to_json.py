import csv
import json

# Path to your CSV file
csv_file = 'shopping_behavior_updated.csv'
# Path to output JSON file
json_file = 'shopping_data.js'

# Read the CSV file
data = []
with open(csv_file, 'r', encoding='utf-8') as file:
    csv_reader = csv.DictReader(file)
    for row in csv_reader:
        data.append(row)

# Write to JavaScript file with variable assignment
with open(json_file, 'w', encoding='utf-8') as file:
    file.write('// JSON data converted from shopping_behavior_updated.csv\n')
    file.write('const shoppingData = ')
    json.dump(data, file, indent=2)
    file.write(';')

print(f"Conversion complete! {len(data)} records written to {json_file}")
