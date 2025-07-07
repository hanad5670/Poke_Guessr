from seed_pokemon import run_sql_file
import os
import psycopg2

def main():
    # Connect using environment variables
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))

    # Get filepath for schema file
    schema_path = os.path.join("..", "db/schema", "daily_pokemon.sql")

    try:
        run_sql_file(conn,schema_path)
    finally:
        conn.close()

    return


if __name__ == "__main__":
    main()