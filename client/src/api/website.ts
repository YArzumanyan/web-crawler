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
    }
  }`;

  const res = await fetchApi(query);
  return res.data;
};
