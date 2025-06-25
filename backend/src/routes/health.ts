// src/routes/health.ts

import { Router } from "express";
import { query } from "../db";

const router = Router();

router.get("/health", async (req, res) => {
  try {
    const result = await query(
      "SELECT * FROM pokemon ORDER BY RANDOM() LIMIT 1;"
    );
    console.log("Random Pokémon selected:", result.rows[0]);
    res.json({ status: "ok", time: result.rows[0].now });
  } catch (err) {
    console.error("Database connection failed:", err);
    res
      .status(500)
      .json({ status: "error", message: "Database connection failed" });
  }
});

export default router;
