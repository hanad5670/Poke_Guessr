import { Request, Response, Router } from "express";
import { query } from "../db";
import {
  searchPokemonByName,
  getPokemonByName,
  pokemonOfTheDay,
} from "../controllers/pokemonController";
const router = Router();

router.get("/search", searchPokemonByName);
router.get("/daily", pokemonOfTheDay);
router.get("/:name", getPokemonByName);
export default router;
