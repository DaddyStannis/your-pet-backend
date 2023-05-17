import express from "express";
import logger from "morgan";
import cors from "cors";
import "dotenv/config.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json" assert { type: "json" };

import usersRouter from "./routes/api/users.js";
import petsRouter from "./routes/api/pets-routes.js";
import newsRouter from "./routes/api/news.js";
import noticesRouter from "./routes/api/notices-routes.js";
import sponsorsRouter from "./routes/api/sponsors.js";

const app = express();

app.patch("/cors", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Content-Length,Server,Date,access-control-allow-methods,access-control-allow-origin"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "PUT,POST,GET,DELETE,OPTIONS,PATCH"
  );
  res.send("ok");
});

app.options("/*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Content-Length,Server,Date,access-control-allow-methods,access-control-allow-origin"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "PUT,POST,GET,DELETE,OPTIONS,PATCH"
  );
  res.send("send some thing whatever");
});

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/users", usersRouter);
app.use("/pets", petsRouter);
app.use("/news", newsRouter);
app.use("/notices", noticesRouter);
app.use("/sponsors", sponsorsRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server Error" } = err;
  res.status(status).json({ message });
});

export default app;
