import express from "express";
import cors from "cors";
import { createHandler } from "graphql-http/lib/use/express";
import { schema } from "./schema.js";
import { ruruHTML } from "ruru/server";
import swaggerSetup from "./swagger.js";
import apiRoutes from "./routes/routes.js";

const app = express();
const port = 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

app.all("/graphql", createHandler({ schema }));

app.get("/", (_req, res) => {
  res.type("html");
  res.end(ruruHTML({ endpoint: "/graphql" }));
});

swaggerSetup(app);

app.use("/api", apiRoutes);

app.listen(port);
