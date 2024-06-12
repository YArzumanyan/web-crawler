import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInt,
} from "graphql";
import {
  getAllTasks,
  getCrawlRecordById,
  newTask,
  removeTaskById,
} from "./CrawlerEntry.js";
import { CrawlingParametersBuilder } from "./CrawlingParametersBuilder.js";
import { getAllWebsites, getWebsiteById, saveWebsite } from "./WebsiteEntry.js";
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
    id: { type: GraphQLString },
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
        webPages: { type: new GraphQLList(GraphQLString) },
      },
      resolve: async (root, { webPages }) => {
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
        id: { type: new GraphQLNonNull(GraphQLString) },
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
      type: GraphQLString,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (root, { id }) => {
        const success = await removeTaskById(id);
        return success ? "Task deleted successfully" : "Task deletion failed";
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});