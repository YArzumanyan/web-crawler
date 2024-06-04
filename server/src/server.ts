import express from 'express';
import cors from 'cors';
import { createHandler } from 'graphql-http/lib/use/express'
import { schema } from './schema.js';
import { ruruHTML } from "ruru/server"

const app = express();
const port = 3000;

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.all('/graphql', createHandler({ schema }));

app.get("/", (_req, res) => {
    res.type("html")
    res.end(ruruHTML({ endpoint: "/graphql" }))
})

app.listen(port);
