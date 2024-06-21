import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLID,
} from "graphql";
import {
  getCrawlRecord,
  newTask,
  removeTask,
  removeTaskById,
  updateTask,
} from "./Node/CrawlerEntry.js";
import { getAllWebsites, getWebsiteById, removeWebsite, saveWebsite } from "./Website/WebsiteEntry.js";
import { CrawlRecord } from "./Node/CrawlRecord.js";
import { WebsiteBuilder } from "./Website/WebsiteBuilder.js";
import Dictionary from "./dictionary.js";
import { run } from "ruru/cli";
import { Website } from "./Website/Website.js";

const runningTasks = Dictionary.getInstance<number, Website>('runningTasks');

const nodeType: GraphQLObjectType = new GraphQLObjectType({
  name: "Node",
  fields: () => ({
    title: { type: GraphQLString },
    url: { type: GraphQLString },
    crawlTime: { type: GraphQLString },
    links: { type: new GraphQLList(nodeType) },
    owner: { type: GraphQLID },
  }),
});

const webPageType = new GraphQLObjectType({
  name: "WebPage",
  fields: () => ({
    id: { type: GraphQLID! },
    label: { type: GraphQLString },
    url: { type: GraphQLString },
    regexp: { type: GraphQLString },
    tags: { type: new GraphQLList(GraphQLString) },
    periodicity: { type: GraphQLInt },
    active: { type: GraphQLBoolean },
  }),
});

const queryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    websites: {
      type: new GraphQLList(webPageType),
      resolve: () => getAllWebsites(),
    },
    nodes: {
      type: new GraphQLList(nodeType),
      args: {
        webPages: { type: new GraphQLList(GraphQLID) },
      },
      resolve: async (root, { webPages }) : Promise<CrawlRecord[]> => {
        const results = await Promise.all(webPages.map(async (webPage: string) => {
          const crawlRecord = await getCrawlRecord(webPage)
          if (crawlRecord) {
            return crawlRecord;
          }
        }));
        
        return results.filter((record: CrawlRecord | null) => record !== null);
      },
    },
    website: {
      type: webPageType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (root, { id }) => {
        const website = await getWebsiteById(id);
        return website;
      },
    },
  },
});

const mutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createTask: {
      type: webPageType,
      args: {
        url: { type: new GraphQLNonNull(GraphQLString) },
        boundaryRegExp: { type: new GraphQLNonNull(GraphQLString) },
        label: { type: new GraphQLNonNull(GraphQLString) },
        tags: { type: new GraphQLList(GraphQLString) },
        periodicity: { type: new GraphQLNonNull(GraphQLInt) },
        active: { type: GraphQLBoolean },
      },
      resolve: async (
        root,
        { url, boundaryRegExp, label, tags, periodicity, active = true }
      ) => {
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

        return website;
      },
    },
    deleteTask: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (root, { id }) => {
        const success = await removeTaskById(id);
        if (!success) {
          return false;
        }

        return await removeWebsite(id);
      },
    },
    stopTask: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (root, { id }) => {
        const website = await getWebsiteById(id);
        if (!website) {
          return false;
        }

        return await removeTask(website);
      },
    },
    startTask: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (root, { id }) => {
        const website = await getWebsiteById(id);
        if (!website) {
          return false;
        }

        website.active = true;
        return await updateTask(website);
      },
    },
    getRunningTasks: {
      type: new GraphQLList(webPageType),
      resolve: () => {
        const tasks = runningTasks.values();
        return tasks;
      },
    },
    updateTask: {
      type: webPageType,
      args: {
        websiteId: { type: new GraphQLNonNull(GraphQLString) },
        url: { type: new GraphQLNonNull(GraphQLString) },
        boundaryRegExp: { type: new GraphQLNonNull(GraphQLString) },
        label: { type: new GraphQLNonNull(GraphQLString) },
        tags: { type: new GraphQLList(GraphQLString) },
        periodicity: { type: new GraphQLNonNull(GraphQLInt) },
        active: { type: new GraphQLNonNull(GraphQLBoolean) },
      },
      resolve: async (
        root,
        { websiteId, url, boundaryRegExp, label, tags, periodicity, active = true }
      ) => {
        const websiteParameters = new WebsiteBuilder()
          .setUrl(url)
          .setBoundaryRegExp(new RegExp(boundaryRegExp))
          .setLabel(label)
          .setTags(tags)
          .setPeriodInMs(periodicity)
          .setIsActive(active)
          .build();

        const website = await saveWebsite(websiteParameters);
        if (!website) {
          return false;
        }

        return await updateTask(website);
      }
    }
  },
});

export const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});
