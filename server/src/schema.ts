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
  getCrawlRecords,
  newTask,
  removeTask,
  removeTaskById,
  updateTask,
} from "./Node/CrawlerEntry.js";
import {
  getAllWebsites,
  getWebsiteById,
  removeWebsite,
  saveWebsite,
  updateWebsite,
} from "./Website/WebsiteEntry.js";
import { CrawlRecord } from "./Node/CrawlRecord.js";
import { WebsiteBuilder } from "./Website/WebsiteBuilder.js";
import Dictionary from "./dictionary.js";
import { run } from "ruru/cli";
import { Website } from "./Website/Website.js";

const runningTasks = Dictionary.getInstance<number, Website>("runningTasks");

const nodeType: GraphQLObjectType = new GraphQLObjectType({
  name: "Node",
  fields: () => ({
    title: { type: GraphQLString },
    url: { type: GraphQLString },
    crawlTime: { type: GraphQLString },
    links: { type: new GraphQLList(nodeType) },
    owner: { type: GraphQLID },
    id: { type: GraphQLID },
    matchLinksRecordIds: { type: new GraphQLList(GraphQLString) },
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
    crawlRecords: { type: new GraphQLList(nodeType) },
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
      resolve: (_, { webPages }) => getCrawlRecords(webPages),
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
    runningTasks: {
      type: new GraphQLList(webPageType),
      resolve: () => {
        const tasks = runningTasks.values();
        return tasks;
      },
    },
    websiteNodes: {
      type: new GraphQLList(nodeType),
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (root, { id }) => {
        const nodes = await getCrawlRecords(id);
        return nodes;
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
        const web = await saveWebsite(website);
        return await updateTask(web);
      },
    },
    updateTask: {
      type: webPageType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        url: { type: new GraphQLNonNull(GraphQLString) },
        boundaryRegExp: { type: new GraphQLNonNull(GraphQLString) },
        label: { type: new GraphQLNonNull(GraphQLString) },
        tags: { type: new GraphQLList(GraphQLString) },
        periodicity: { type: new GraphQLNonNull(GraphQLInt) },
        active: { type: new GraphQLNonNull(GraphQLBoolean) },
      },
      resolve: async (
        root,
        { id, url, boundaryRegExp, label, tags, periodicity, active }
      ) => {
        const websiteParameters = new WebsiteBuilder()
          .setUrl(url)
          .setBoundaryRegExp(new RegExp(boundaryRegExp))
          .setLabel(label)
          .setTags(tags)
          .setPeriodInMs(periodicity)
          .setIsActive(active)
          .setId(id)
          .build();

        const website = await updateWebsite(websiteParameters);
        if (!website) {
          return false;
        }

        return await updateTask(website);
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});
