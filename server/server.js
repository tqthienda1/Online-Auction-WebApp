import express from "express";
import cors from "cors";
import "dotenv/config";
import passport from "passport";
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("Server is live!"));

app.listen(port, () =>
  console.log(`Server is listening at http://localhost:${port}`)
);
