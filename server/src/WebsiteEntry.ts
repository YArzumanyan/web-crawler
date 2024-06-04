import { databaseEntry } from './DatabaseEntry.js'; 
import { Website } from './Website.js';

export const getAllWebsites = async () : Promise<Website[] | null> => {
    return await databaseEntry.getWebsites();
}

export const getWebsiteById = async (id: string) : Promise<Website | null> => {
    return await databaseEntry.getWebsiteById(id);
}

export const getWebsiteByURL = async (url: string) : Promise<Website | null> => {
    return await databaseEntry.getWebsiteByURL(url);
}

export const saveWebsite = async (website: Website) : Promise<string> => {
    return await databaseEntry.saveWebsite(website);
}

export const removeWebsite = async (id: string) : Promise<boolean> => {
    return await databaseEntry.removeWebsite(id);
}