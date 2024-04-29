import * as express from "express";
import * as dotenv from "dotenv";
import { Request, Response } from "express";
import "reflect-metadata";
import { errorHandler } from "./middleware/error.middleware";
import { AppDataSource } from "./data-source";
import { Routes } from "./routes/Routes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(errorHandler);

const { PORT = 3000 } = process.env;

app.use("/api/v1", Routes);

app.get("*", (req: Request, res: Response) => {
  res.status(400).json({ message: "Bad Request" }); 
});

AppDataSource.initialize()
  .then(async () => {
    app.listen(PORT, () => {
      console.log("Server is running on http://localhost:" + PORT);
    });
    console.log("Data Source has been initialized!");
  })
  .catch((error) => console.log(error));
