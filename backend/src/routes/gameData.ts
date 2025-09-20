import { Request, Response, Router } from "express";
import { getPrevDates } from "../controllers/gameController";

const router = Router();

// GET ROUTES
router.get("/prev", getPrevDates);

export default router;
