import React, { useState, useEffect, useContext } from "react";
import { WebsiteContext } from "../../context/WebsiteContext";
import { Modal, Box, TextField, Button } from "@mui/material";
import styles from "./WebsiteModal.module.scss";
import { Website } from "../../types";

interface WebsiteModalProps {
  website: Website | null;
  open: boolean;
  onClose: () => void;
}

const WebsiteModal: React.FC<WebsiteModalProps> = ({
  website,
  open,
  onClose,
}) => {
  const { createWebsite, updateWebsite } = useContext(WebsiteContext);

  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [boundaryRegExp, setRegexp] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [periodicity, setPeriodicity] = useState(1000);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (website) {
      setLabel(website.label);
      setUrl(website.url);
      setRegexp(website.regexp);
      setTags(website.tags);
      setPeriodicity(website.periodicity ?? 10000);
      setActive(website.active);
    } else {
      setLabel("");
      setUrl("");
      setRegexp("");
      setTags([]);
      setPeriodicity(10000);
      setActive(false);
    }
  }, [website]);

  const handleSave = () => {
    const input = { label, url, boundaryRegExp, tags, periodicity, active };
    console.log(input);
    if (website) {
      updateWebsite(website.id, input);
    } else {
      createWebsite(input);
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles.modalBox}>
        <TextField
          label="Label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="RegExp"
          value={boundaryRegExp}
          onChange={(e) => setRegexp(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Tags"
          value={tags.join(", ")}
          onChange={(e) =>
            setTags(e.target.value.split(",").map((tag) => tag.trim()))
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Periodicity"
          value={periodicity}
          type="number"
          onChange={(e) => {
            try {
              setPeriodicity(parseInt(e.target.value));
            } catch (e) {
              console.error(e);
            }
          }}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </Box>
    </Modal>
  );
};

export default WebsiteModal;
