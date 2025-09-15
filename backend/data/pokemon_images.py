import requests
from PIL import Image
import io
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def get_pokemon_sprite(pokemon_name):
    url = f"https://pokeapi.co/api/v2/pokemon/{pokemon_name.lower()}"
    response = requests.get(url)
    if response.status_code != 200:
        print(f"Failed to fetch {pokemon_name}")
        return None

    data = response.json()
    sprite_url = data['sprites']['front_default']
    if not sprite_url:
        print(f"No sprite for {pokemon_name}")
        return None
    
    image_response = requests.get(sprite_url)
    image_bytes = image_response.content
    image_file = io.BytesIO(image_bytes)
    return Image.open(image_file)

def create_silhouette(image):
    image = image.convert("RGBA")
    silhouette = Image.new("RGBA", image.size, (0, 0, 0, 0))
    pixels = image.getdata()
    
    new_pixels = []
    for pixel in pixels:
        r, g, b, a = pixel
        if a == 0:
            new_pixels.append((0, 0, 0, 0))
        else:
            new_pixels.append((0, 0, 0, a))
    
    silhouette.putdata(new_pixels)
    return silhouette

def image_to_bytes(image):
    img_byte_arr = io.BytesIO()
    image.save(img_byte_arr, format='PNG')
    return img_byte_arr.getvalue()


def main():
    
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    with conn.cursor() as cur:
        # Get all pokemon names and their pokedex numbers
        cur.execute("SELECT pokedex_number, name, sprite, silhouette FROM pokemon")
        pokemons = cur.fetchall()

        for pokedex_number, name, sprite, silhouette in pokemons:
            if sprite and silhouette:
                print(f"Sprite and silhouette already exist for pokemon {name}")
                continue

            print(f"Processing {name} (#{pokedex_number})...")
            img = get_pokemon_sprite(name)
            if img is None:
                print(f"Skipping {name} due to missing sprite")
                continue

            silhouette = create_silhouette(img)
            sprite_bytes = image_to_bytes(img)
            silhouette_bytes = image_to_bytes(silhouette)

            cur.execute("""
                UPDATE pokemon
                SET sprite = %s, silhouette = %s
                WHERE pokedex_number = %s
            """, (psycopg2.Binary(sprite_bytes), psycopg2.Binary(silhouette_bytes), pokedex_number))
            conn.commit()
    
    conn.close()
    print("All done!")

if __name__ == "__main__":
    main()

