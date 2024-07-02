import React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./App";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { WebsiteProvider } from "./context/WebsiteContext";
import "./index.scss";

const client = new ApolloClient({
  uri: "/graphql",
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <WebsiteProvider>
        <App />
      </WebsiteProvider>
    </ApolloProvider>
    ,
  </React.StrictMode>
);
