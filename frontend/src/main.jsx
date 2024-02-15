import { BrowserRouter } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import client from "./apollo/client";

import "bootstrap/dist/css/bootstrap.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
