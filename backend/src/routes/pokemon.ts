import { Request, Response, Router } from "express";
import { query } from "../db";
import {
  searchPokemonByName,
  getPokemonByName,
  getSilhouette,
} from "../controllers/pokemonController";
const router = Router();

router.get("/search", searchPokemonByName);
router.get("/daily/silhouette", getSilhouette);
router.get("/:name", getPokemonByName);
export default router;
