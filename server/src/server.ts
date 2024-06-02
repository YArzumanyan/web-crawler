import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import { CrawlingParametersBuilder } from './CrawlerExecutor.js';
import { newTask, getAllTasks, getCrawlRecordById, removeTaskById } from './CrawlerEntry.js';
// to avoid circular records
import { stringify } from 'flatted';

const app = express();
const port = 3000;

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req, res) => {
    res.send(process.env.FRONTEND_URL);
});

app.get('/api/tasks', (req, res) => {
    const tasks = getAllTasks();
    res.setHeader('Content-Type', 'application/json');
    res.send(stringify(tasks));
});

app.get('/api/tasks/:id', async (req, res) => {
    const id = req.params.id;
    const record = await getCrawlRecordById(id);
    res.setHeader('Content-Type', 'application/json');
    if (record) {
        res.send(stringify(record));
    } else {
        res.send(null);
    }
});

app.delete('/api/tasks/:id', async (req, res) => {
    const id = req.params.id;
    const record = await removeTaskById(id);
    res.setHeader('Content-Type', 'application/json');
    res.send({ success: record });
});

app.post('/api/tasks', async (req, res) => {
    const crawlingParameters = new CrawlingParametersBuilder()
        .setUrl(req.body.url)
        .setBoundaryRegExp(new RegExp(req.body.boundaryRegExp))
        .setLabel(req.body.label)
        .setTags(req.body.tags)
        .setPeriodInMs(req.body.periodicity)
        .build();
    const record = await newTask(crawlingParameters);
    res.setHeader('Content-Type', 'application/json');
    if (record) {
        res.send({ id: record.id });
    } else {
        res.send({ id: null });
    }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
