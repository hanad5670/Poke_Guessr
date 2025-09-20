import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import healthRoutes from "./routes/health";
import pokemonRoutes from "./routes/pokemon";
import gameRoutes from "./routes/gameData";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api", healthRoutes);

app.use("/pokemon", pokemonRoutes);
app.use("/game", gameRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
