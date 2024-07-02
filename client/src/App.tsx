import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/common/Navigation";
import { Container, CssBaseline } from "@mui/material";
import "./App.module.scss";
import { GraphProvider } from "./context/GraphContext";
import { WebsiteProvider } from "./context/WebsiteContext";
import Websites from "./pages/Websites";

const App: React.FC = () => {
  return (
    <Router>
      <GraphProvider>
        <WebsiteProvider>
          <CssBaseline />
          <Navigation />
          <Container component="main">
            <Routes>
              <Route path="/" element={<Websites />} />
            </Routes>
          </Container>
        </WebsiteProvider>
      </GraphProvider>
    </Router>
  );
};

export default App;
