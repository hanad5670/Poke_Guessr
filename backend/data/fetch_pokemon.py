import requests
import pandas as pd
import time
import os

BASE_URL = "https://pokeapi.co/api/v2/"
POKEMON_LIMIT = 1025

def get_all_pokemon():
  url = f"{BASE_URL}pokemon?limit={POKEMON_LIMIT}"
  response = requests.get(url)
  response.raise_for_status()
  return response.json()["results"]

def get_pokemon_data(pokemon_url):
  data = {}

  # Get data needed for each Pokemon:
  pokemon = requests.get(pokemon_url).json()
  data["pokedex"] = pokemon["id"]
  data["name"] = pokemon["name"].capitalize()
  data["height"] = pokemon["height"] * 10 # Storing height in cm
  data["weight"] = pokemon["weight"] / 10 # Storing weight in kg
  data["types"] = ", ".join([t["type"]["name"] for t in pokemon["types"]])
  data["total_base_stats"] = sum(stat["base_stat"] for stat in pokemon["stats"])

  # Get the region of the pokemon
  species = requests.get(pokemon["species"]["url"]).json()
  generation = requests.get(species["generation"]["url"]).json()
  data["generation"] = generation["main_region"]["name"].capitalize()

  return data

def all_pokemon_csv():
  all_data = []
  pokemon_list = get_all_pokemon()

  for i, pokemon in enumerate(pokemon_list):
    try:
      print(f"Getting data for {pokemon['name']} ({i + 1}/{len(pokemon_list)})")
      data = get_pokemon_data(pokemon["url"])
      all_data.append(data)
      time.sleep(0.2)
    except Exception as e:
      print(f"Error getting data for {pokemon['name']}: {e}")

  df = pd.DataFrame(all_data)
  df.to_csv("pokemon.csv", index=False)
  print("Saved to pokemon.csv")


if __name__ == "__main__":
  
  # If csv already exists, don't run
  if os.path.exists("pokemon.csv"):
    print("Pokemon csv already exists. Skipping fetch from PokeAPI.")
  else:
    all_pokemon_csv()