import { gql } from "@apollo/client";

export const GET_WEBSITES = gql`
  query GetWebsites {
    websites {
      id
      label
      url
      regexp
      tags
      periodicity
      active
    }
  }
`;

export const GET_NODES = gql`
  query GetNodes($webPages: [ID!]) {
    nodes(webPages: $webPages) {
      title
      url
      crawlTime
      id
      matchLinksRecordIds
    }
  }
`;
