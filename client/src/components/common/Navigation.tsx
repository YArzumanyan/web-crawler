import React from "react";
import { AppBar, Toolbar, Button, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import "./Navigation.module.scss";

const Navigation: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Web Crawler
        </Typography>
        <Button color="inherit" component={RouterLink} to="/">
          Websites
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
