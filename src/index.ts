import express from "express";
import { errorMiddleware } from "./error";

const app = express();
const PORT = 5000;

app.use(express.json());

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
