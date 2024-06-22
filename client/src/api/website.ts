import { Website } from "../types";
import fetchApi from "./fetchApi";

export const getWebsites = async (): Promise<Website[]> => {
  const query = `{
    websites {
      active
      url
      tags
      regexp
      periodicity
      label
      id
      crawlRecords {
        id
        url
        title
        matchLinksRecordIds
        crawlTime
      }
    }
  }`;

  const res = await fetchApi(query);
  return res.data.websites;
};

export const startTask = async (id: number | string) : Promise<boolean> => {
  const mutation = `mutation {
    startTask(id: ${id})
  }`;

  const res = await fetchApi(mutation);
  return res.data.startTask;
}

export const stopTask = async (id: number | string) : Promise<boolean> => {
  const mutation = `mutation {
    stopTask(id: ${id})
  }`;

  const res = await fetchApi(mutation);
  return res.data.stopTask;
}