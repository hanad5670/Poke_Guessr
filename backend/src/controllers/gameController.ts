import { Request, Response } from "express";
import { query } from "../db";

export const getPrevDates = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await query(
      "SELECT date FROM daily_pokemon ORDER BY date DESC LIMIT 365"
    );

    if (result.rows.length == 0) {
      res.status(404).json({ error: "No previous games found" });
    } else {
      res.status(200).json(result.rows);
    }
  } catch (err) {
    console.log("Error finding Pokemon:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
