import pandas as pd
from datetime import datetime, timedelta

# Load the Excel file
excel_path = '/Users/abdallahkenawy/Projects/Project RDJN/Amicalisme/Amicalisme.xlsx'
sheet_name_or_index = 1
df = pd.read_excel(excel_path, sheet_name=sheet_name_or_index, header=3)

# Combine the 'Prenom' and 'Nom' columns into a 'full_name' column and remove duplicates
df['full_name'] = df['Prenom'].str.strip() + ' ' + df['Nom'].str.strip()
df_cleaned = df.drop_duplicates(subset='full_name', keep='first')

# Rename columns before selecting specific columns
df_cleaned.rename(columns={'Numéro amicaliste': 'Numeroamicaliste', 'Date de fin': 'Datefin'}, inplace=True)

# Select the specific columns
df_selected_columns = df_cleaned[['Numeroamicaliste', 'Nom', 'Prenom', 'Datefin']].copy()

# Convert 'Datefin' to a consistent format (handle numeric timestamps and standard dates)
def convert_date(date):
    if isinstance(date, (int, float)):
        # Convert Excel serial number to a datetime
        start_date = datetime(1899, 12, 30)
        return (start_date + timedelta(days=date)).strftime('%d-%m-%Y')
    else:
        # Handle string dates or other formats
        converted_date = pd.to_datetime(date, errors='coerce', dayfirst=True)
        if pd.isna(converted_date):
            return 'Invalid Date'
        return converted_date.strftime('%d-%m-%Y')

df_selected_columns['Datefin'] = df_selected_columns['Datefin'].apply(convert_date)

# Convert the DataFrame to a JSON-like list of strings
json_records = df_selected_columns.to_json(orient='records', lines=True).splitlines()

# Format as a proper JSON array
formatted_json = "[\n" + ",\n".join(json_records) + "\n]"

# Save the formatted JSON data to a file
output_path = '/Users/abdallahkenawy/Projects/Project RDJN/Amicalisme/output_data.json'
with open(output_path, 'w') as file:
    file.write(formatted_json)
