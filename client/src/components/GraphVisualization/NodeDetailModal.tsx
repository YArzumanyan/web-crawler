import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { Node } from "../../types";

interface NodeDetailModalProps {
  node: Node | null;
  open: boolean;
  onClose: () => void;
}

const NodeDetailModal: React.FC<NodeDetailModalProps> = ({
  node,
  open,
  onClose,
}) => {
  if (!node) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Node Details</DialogTitle>
      <DialogContent
        style={{
          display: "flex",
          flexDirection: "column",
          wordBreak: "break-word",
        }}
      >
        <Typography variant="h6">Title: {node.title || "N/A"}</Typography>
        <Typography variant="body1">
          URL:{" "}
          <a href={node.url} target="_blank" rel="noreferrer noopener">
            {node.url}
          </a>
        </Typography>
        <Typography variant="body1">
          Crawl Time: {node.crawlTime || "N/A"}
        </Typography>
        <Typography variant="body1">Links:</Typography>
        <ul>
          {node.matchLinksRecordIds.map((link) => (
            <li key={link}>{link}</li>
          ))}
        </ul>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NodeDetailModal;
