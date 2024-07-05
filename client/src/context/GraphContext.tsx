import React, {
  createContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import { GET_NODES, GET_WEBSITES } from "../graphql/queries";
import { Website, Node } from "../types";

interface GraphContextType {
  websites: Website[];
  nodes: Node[];
  fetchGraphData: () => void;
  fetchWebsiteNodes: (websiteId: string) => void;
}

const GraphContext = createContext<GraphContextType>({
  websites: [],
  nodes: [],
  fetchGraphData: () => {},
  fetchWebsiteNodes: () => {},
});

const GraphProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data: websiteData } = useQuery(GET_WEBSITES);
  const [fetchNodes, { data: nodeData }] = useLazyQuery(GET_NODES);

  const [websites, setWebsites] = useState<Website[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);

  const fetchGraphData = useCallback(() => {
    if (websiteData) {
      setWebsites(websiteData.websites);
    }
  }, [websiteData]);

  const fetchWebsiteNodes = useCallback(
    (websiteId: string) => {
      fetchNodes({ variables: { webPages: [websiteId] } });
    },
    [fetchNodes]
  );

  useEffect(() => {
    if (nodeData) {
      setNodes(nodeData.nodes);
    }
  }, [nodeData]);

  return (
    <GraphContext.Provider
      value={{ websites, nodes, fetchGraphData, fetchWebsiteNodes }}
    >
      {children}
    </GraphContext.Provider>
  );
};

export { GraphContext, GraphProvider };
