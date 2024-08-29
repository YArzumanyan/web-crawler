import express, { Request, Response } from "express";
import {
  getAllWebsites,
  getWebsiteById,
  saveWebsite,
  updateWebsite,
  removeWebsite,
} from "../Website/WebsiteEntry.js";
import { WebsiteBuilder } from "../Website/WebsiteBuilder.js";
import { newTask, updateTask, removeTaskById } from "../Node/CrawlerEntry.js";

const router = express.Router();

/**
 * @swagger
 * /api/websites:
 *   get:
 *     summary: Retrieve all websites
 *     responses:
 *       200:
 *         description: A list of all websites
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Website'
 *       500:
 *         description: Internal server error
 */
router.get("/websites", async (req: Request, res: Response) => {
  try {
    const websites = await getAllWebsites();
    res.json(websites);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

/**
 * @swagger
 * /api/websites/{id}:
 *   get:
 *     summary: Retrieve a specific website by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the website to retrieve
 *     responses:
 *       200:
 *         description: The requested website
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Website'
 *       404:
 *         description: Website not found
 *       500:
 *         description: Internal server error
 */
router.get("/websites/:id", async (req: Request, res: Response) => {
  try {
    const website = await getWebsiteById(req.params.id);
    if (website) {
      res.json(website);
    } else {
      res.status(404).send("Website not found");
    }
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 description: The URL of the website
 *               boundaryRegExp:
 *                 type: string
 *                 description: The boundary regular expression
 *               label:
 *                 type: string
 *                 description: The label for the task
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags for the task
 *               periodicity:
 *                 type: integer
 *                 description: The periodicity of the task in milliseconds
 *               active:
 *                 type: boolean
 *                 description: Whether the task is active
 *     responses:
 *       201:
 *         description: The created task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Website'
 *       500:
 *         description: Internal server error
 */
router.post("/tasks", async (req: Request, res: Response) => {
  try {
    const {
      url,
      boundaryRegExp,
      label,
      tags,
      periodicity,
      active = true,
    } = req.body;
    const websiteParameters = new WebsiteBuilder()
      .setUrl(url)
      .setBoundaryRegExp(new RegExp(boundaryRegExp))
      .setLabel(label)
      .setTags(tags)
      .setPeriodInMs(periodicity)
      .setIsActive(active)
      .build();

    const website = await saveWebsite(websiteParameters);
    if (website.active) {
      await newTask(website);
    }

    res.status(201).json(website);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update an existing task by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 description: The URL of the website
 *               boundaryRegExp:
 *                 type: string
 *                 description: The boundary regular expression
 *               label:
 *                 type: string
 *                 description: The label for the task
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags for the task
 *               periodicity:
 *                 type: integer
 *                 description: The periodicity of the task in milliseconds
 *               active:
 *                 type: boolean
 *                 description: Whether the task is active
 *     responses:
 *       200:
 *         description: The updated task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Website'
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.put("/tasks/:id", async (req: Request, res: Response) => {
  try {
    const { url, boundaryRegExp, label, tags, periodicity, active } = req.body;
    const websiteParameters = new WebsiteBuilder()
      .setUrl(url)
      .setBoundaryRegExp(new RegExp(boundaryRegExp))
      .setLabel(label)
      .setTags(tags)
      .setPeriodInMs(periodicity)
      .setIsActive(active)
      .setId(req.params.id)
      .build();

    const website = await updateWebsite(websiteParameters);
    if (!website) {
      return res.status(404).send("Task not found");
    }

    const updatedTask = await updateTask(website);
    res.json(updatedTask);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task to delete
 *     responses:
 *       204:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.delete("/tasks/:id", async (req: Request, res: Response) => {
  try {
    const success = await removeTaskById(req.params.id);
    if (!success) {
      return res.status(404).send("Task not found");
    }

    await removeWebsite(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

export default router;
