import { gql } from "@apollo/client";

export const CREATE_WEBSITE = gql`
  mutation CreateWebsite(
    $url: String!
    $label: String!
    $boundaryRegExp: String!
    $tags: [String!]!
    $periodicity: Int!
    $active: Boolean!
  ) {
    createTask(
      url: $url
      label: $label
      boundaryRegExp: $boundaryRegExp
      tags: $tags
      periodicity: $periodicity
      active: $active
    ) {
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

export const UPDATE_WEBSITE = gql`
  mutation UpdateWebsite(
    $id: ID!
    $url: String!
    $label: String!
    $boundaryRegExp: String!
    $tags: [String!]!
    $periodicity: Int!
    $active: Boolean!
  ) {
    updateTask(
      id: $id
      url: $url
      label: $label
      boundaryRegExp: $boundaryRegExp
      tags: $tags
      periodicity: $periodicity
      active: $active
    ) {
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

export const DELETE_WEBSITE = gql`
  mutation DeleteWebsite($id: ID!) {
    deleteTask(id: $id)
  }
`;

export const START_CRAWLING = gql`
  mutation StartCrawling($id: ID!) {
    startTask(id: $id)
  }
`;

export const STOP_CRAWLING = gql`
  mutation StopCrawling($id: ID!) {
    stopTask(id: $id)
  }
`;
