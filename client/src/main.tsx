import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App.tsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/Error.tsx";
import { Websites } from "./pages/Websites.tsx";
import { websites } from "./temp/websites.ts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "websites",
        element: <Websites />,
        loader: async () => {
          return await websites
        }
      },
      {
        path: "websites/:websiteId",
        element: <div>View Configuration</div>,
      },
      {
        path: "websites/create",
        element: <div>Create Configuration</div>,
        loader: async ({ request }) => {
          console.log("create");
          console.log(request);
          return null;
        },
      },
      {
        path: "websites/:websiteId/edit",
        element: <div>Edit Configuration</div>,
        loader: async ({ request, params }) => {
          console.log("edit");
          console.log(request);
          console.log(params);
          return null;
        },
      },
      {
        path: "websites/:websiteId/delete",
        action: async ({ request, params }) => {
          console.log("delete");
          console.log(request);
          console.log(params);
        },
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
