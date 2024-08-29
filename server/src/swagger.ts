import swaggerJsdoc, { Options } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Crawler API",
      version: "1.0.0",
      description: "API for managing crawl tasks and websites",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
    ],
    components: {
      schemas: {
        Website: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "The unique identifier of the website",
            },
            label: {
              type: "string",
              description: "The label or name of the website",
            },
            url: {
              type: "string",
              description: "The URL of the website",
            },
            regexp: {
              type: "string",
              description:
                "The regular expression used to define the boundary for crawling",
            },
            tags: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Tags associated with the website",
            },
            periodicity: {
              type: "integer",
              description:
                "The periodicity for crawling the website in milliseconds",
            },
            active: {
              type: "boolean",
              description: "Whether the website is active for crawling",
            },
            crawlRecords: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Node",
              },
              description: "List of crawl records associated with the website",
            },
          },
        },
        Node: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "The unique identifier of the node (crawl record)",
            },
            title: {
              type: "string",
              description: "The title of the node",
            },
            url: {
              type: "string",
              description: "The URL of the node",
            },
            crawlTime: {
              type: "string",
              format: "date-time",
              description: "The time when the node was crawled",
            },
            links: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Node",
              },
              description: "List of links found during crawling",
            },
            owner: {
              type: "string",
              description: "The owner of the node (typically a website ID)",
            },
            matchLinksRecordIds: {
              type: "array",
              items: {
                type: "string",
              },
              description:
                "List of record IDs that matched links during crawling",
            },
          },
        },
        Task: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "The unique identifier of the task",
            },
            website: {
              $ref: "#/components/schemas/Website",
              description: "The website associated with the task",
            },
            active: {
              type: "boolean",
              description: "Whether the task is currently active",
            },
            periodicity: {
              type: "integer",
              description: "The periodicity for the task in milliseconds",
            },
          },
        },
      },
    },
  },
  apis: ["**/routes*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerSetup = (app: Express): void => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default swaggerSetup;
