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
  getAllTasks,
  getCrawlRecordById,
  newTask,
  removeTaskById,
} from "./CrawlerEntry.js";
import { CrawlingParametersBuilder } from "./CrawlingParametersBuilder.js";
import { getAllWebsites, getWebsiteById, removeWebsite, saveWebsite } from "./WebsiteEntry.js";
import { CrawlRecord } from "./CrawlRecord.js";

const nodeType: GraphQLObjectType = new GraphQLObjectType({
  name: "Node",
  fields: () => ({
    title: { type: GraphQLString },
    url: { type: GraphQLString },
    crawlTime: { type: GraphQLString },
    links: { type: new GraphQLList(nodeType) },
    owner: { type: GraphQLString },
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
    active: { type: GraphQLString },
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
          const crawlRecord = await getCrawlRecordById(webPage)
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
        active: { type: new GraphQLNonNull(GraphQLBoolean) },
      },
      resolve: async (
        root,
        { url, boundaryRegExp, label, tags, periodicity, active = true }
      ) => {
        const crawlingParameters = new CrawlingParametersBuilder()
          .setUrl(url)
          .setBoundaryRegExp(new RegExp(boundaryRegExp))
          .setLabel(label)
          .setTags(tags)
          .setPeriodInMs(periodicity)
          .setIsActive(active)
          .build();

        const record = await newTask(crawlingParameters);
        return record?.owner;
      },
    },
    deleteTask: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (root, { id }) => {
        const success = await removeWebsite(id);
        return success;
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
        const crawlingParameters = new CrawlingParametersBuilder()
          .setUrl(url)
          .setBoundaryRegExp(new RegExp(boundaryRegExp))
          .setLabel(label)
          .setTags(tags)
          .setPeriodInMs(periodicity)
          .setIsActive(active)
          .build();

        const website = await getWebsiteById(websiteId);
        if (!website) {
          return false;
        }

        website.updateByCrawlingParameters(crawlingParameters);
        const success = await saveWebsite(website);

        if (website.active) {
          // remove old task
          await removeTaskById(websiteId);
        }

        return success;
      }
    }
  },
});

export const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});
