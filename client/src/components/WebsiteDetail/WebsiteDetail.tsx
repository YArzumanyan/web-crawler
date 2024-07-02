import React, { useContext, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { GraphContext } from "../../context/GraphContext";
import { Website, Node } from "../../types";
import GraphVisualization from "../GraphVisualization/Graph";
import styles from "./WebsiteDetail.module.scss";

interface WebsiteDetailProps {
  website: Website;
}

const WebsiteDetail: React.FC<WebsiteDetailProps> = ({ website }) => {
  const { nodes, fetchGraphData, fetchWebsiteNodes } = useContext(GraphContext);
  const [isGraphMode, setIsGraphMode] = useState(false);
  const [websiteNodes, setWebsiteNodes] = useState<Node[]>([]);

  useEffect(() => {
    fetchGraphData();
    fetchWebsiteNodes(website.id);
  }, [fetchGraphData, fetchWebsiteNodes, website.id]);

  useEffect(() => {
    console.log("websiteNodes", nodes);
    if (nodes && website) {
      setWebsiteNodes(nodes);
    }
  }, [nodes, website]);

  const handleGraphModeToggle = () => {
    setIsGraphMode((prevMode) => !prevMode);
  };

  return (
    <Card className={styles.websiteDetail}>
      <CardContent style={{ maxHeight: "800px", overflowY: "auto" }}>
        <Typography variant="h5">{website.label}</Typography>
        <Typography variant="body1">
          <strong>URL:</strong> {website.url}
        </Typography>
        <Typography variant="body1">
          <strong>RegExp:</strong> {website.regexp}
        </Typography>
        <Typography variant="body1">
          <strong>Tags:</strong> {website.tags.join(", ")}
        </Typography>
        <Typography variant="body1">
          <strong>Periodicity:</strong> {website.periodicity}
        </Typography>
        <Typography variant="body1">
          <strong>Status:</strong> {website.active ? "Active" : "Disabled"}
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={isGraphMode}
              onChange={handleGraphModeToggle}
              name="graphMode"
              color="primary"
            />
          }
          label="Graph Mode"
        />
        {isGraphMode ? (
          <GraphVisualization website={website} />
        ) : (
          <List>
            {websiteNodes.map((node) => (
              <ListItem key={node.url}>
                <ListItemText
                  primary={node.title || node.url}
                  secondary={`Crawl Time: ${node.crawlTime}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default WebsiteDetail;
