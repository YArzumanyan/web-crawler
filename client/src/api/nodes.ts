import { Node } from "../types";
import fetchApi from "./fetchApi";

export const getWebsiteNodes = async (id: number): Promise<Node[]> => {
  const query = `{
    websiteNodes(id: ${id}) {
        crawlTime
        title
        url
        matchLinksRecordIds
        id
    }
  }`;

  const res = await fetchApi(query);
  return res.data.getWebsiteNodes;
};