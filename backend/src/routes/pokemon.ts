import { Request, Response, Router } from "express";
import { query } from "../db";
import {
  searchPokemonByName,
  getPokemonByName,
  getSilhouette,
  getMaxGuesses,
  handlePokemonGuess,
} from "../controllers/pokemonController";
const router = Router();

// GET ROUTES
router.get("/search", searchPokemonByName);
router.get("/daily/silhouette", getSilhouette);
router.get("/guessNum", getMaxGuesses);
router.get("/:name", getPokemonByName);

// POST ROUTES
router.post("/guess", handlePokemonGuess);
export default router;
