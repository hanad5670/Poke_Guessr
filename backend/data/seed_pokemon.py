import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def run_sql_file(conn, filepath):
    # Execute sql command from a file
    with open(filepath, 'r') as f:
        sql = f.read()
    with conn.cursor() as cur:
        try:
            cur.execute(sql)
            conn.commit()
            print(f"Executed SQL from {filepath}")
        except psycopg2.Error as e:
            conn.rollback()
            print(f"Error executing sql from {filepath}: {e}")
    
def import_csv(conn, csv_path):
    # Import CSV data using COPY (fastest method)
    with conn.cursor() as cur:
        with open(csv_path, 'r') as f:
            # Skip header row
            next(f)  
            cur.copy_expert("""
            COPY pokemon (pokedex_number, name, height_cm, weight_kg, types, total_base_stats, generation) FROM STDIN WITH CSV
            """, f)
    conn.commit()
    print(f"Imported data from {csv_path}")

def main():
    # Connect using environment variables
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))

    # Get filepath for schema file
    schema_path = os.path.join("..", "db/schema", "pokemon.sql")

    # Get csv filepath
    csv_path = os.path.join("..", "data", "pokemon.csv")
    
    # Get expected pokemon count:
    expected_count = int(os.getenv("POKEMON_LIMIT"))
    
    try:
        # If the db is completely populated already, don't run this script
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM pokemon")
            pokemon_count = cur.fetchone()[0]
            print(pokemon_count)

            if pokemon_count == expected_count:
                print("Pokemon already exist in db. Skipping seeding from csv.")
                return
        conn.commit()

        # 1. Create table
        run_sql_file(conn, schema_path)

        # 2. Delete data that's already there
        with conn.cursor() as cur:
            cur.execute("TRUNCATE TABLE pokemon RESTART IDENTITY CASCADE;")
        conn.commit()
        
        # 3. Import data
        import_csv(conn, csv_path)
        
        # 4. Quick verification
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM pokemon")
            count = cur.fetchone()[0]
            print(f"\nSuccess! Loaded {count} Pokémon records")
            
            cur.execute("SELECT name FROM pokemon ORDER BY RANDOM() LIMIT 3")
            print("Sample Pokémon:", [r[0] for r in cur.fetchall()])
            
    finally:
        conn.close()

if __name__ == "__main__":
    main()