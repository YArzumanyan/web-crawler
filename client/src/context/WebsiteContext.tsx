import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_WEBSITES } from "../graphql/queries";
import {
  CREATE_WEBSITE,
  UPDATE_WEBSITE,
  DELETE_WEBSITE,
  START_CRAWLING,
  STOP_CRAWLING,
} from "../graphql/mutations";
import { Website, WebsiteInput } from "../types";

interface WebsiteContextType {
  websites: Website[];
  createWebsite: (input: WebsiteInput) => void;
  updateWebsite: (id: string, input: WebsiteInput) => void;
  deleteWebsite: (id: string) => void;
  startCrawling: (id: string) => void;
  stopCrawling: (id: string) => void;
}

export const WebsiteContext = createContext<WebsiteContextType>({
  websites: [],
  createWebsite: () => {},
  updateWebsite: () => {},
  deleteWebsite: () => {},
  startCrawling: () => {},
  stopCrawling: () => {},
});

interface WebsiteProviderProps {
  children: ReactNode;
}

export const WebsiteProvider: React.FC<WebsiteProviderProps> = ({
  children,
}) => {
  const { data, refetch } = useQuery(GET_WEBSITES);
  const [createWebsiteMutation] = useMutation(CREATE_WEBSITE);
  const [updateWebsiteMutation] = useMutation(UPDATE_WEBSITE);
  const [deleteWebsiteMutation] = useMutation(DELETE_WEBSITE);
  const [startCrawlingMutation] = useMutation(START_CRAWLING);
  const [stopCrawlingMutation] = useMutation(STOP_CRAWLING);

  const [websites, setWebsites] = useState<Website[]>([]);

  useEffect(() => {
    if (data) {
      setWebsites(data.websites);
    }
  }, [data]);

  const createWebsite = async (input: WebsiteInput) => {
    await createWebsiteMutation({ variables: { ...input } });
    refetch();
  };

  const updateWebsite = async (id: string, input: WebsiteInput) => {
    await updateWebsiteMutation({ variables: { id, ...input } });
    refetch();
  };

  const deleteWebsite = async (id: string) => {
    await deleteWebsiteMutation({ variables: { id } });
    refetch();
  };

  const startCrawling = async (id: string) => {
    await startCrawlingMutation({ variables: { id } });
    refetch();
  };

  const stopCrawling = async (id: string) => {
    await stopCrawlingMutation({ variables: { id } });
    refetch();
  };

  return (
    <WebsiteContext.Provider
      value={{
        websites,
        createWebsite,
        updateWebsite,
        deleteWebsite,
        startCrawling,
        stopCrawling,
      }}
    >
      {children}
    </WebsiteContext.Provider>
  );
};
