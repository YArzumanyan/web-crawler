import React, { useState } from "react";
import { Website } from "../types";
import { Container, Modal } from "@mui/material";
import WebsiteTable from "../components/WebsiteTable/WebsiteTable";
import WebsiteDetail from "../components/WebsiteDetail/WebsiteDetail";
import styles from "./Websites.module.scss";

const Websites: React.FC = () => {
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleOpenDetailModal = (website: Website) => {
    setSelectedWebsite(website);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedWebsite(null);
  };

  return (
    <Container>
      <WebsiteTable onInfoClick={handleOpenDetailModal} />
      <Modal open={isDetailModalOpen} onClose={handleCloseDetailModal}>
        <div className={styles.modalContent}>
          {selectedWebsite && <WebsiteDetail website={selectedWebsite} />}
        </div>
      </Modal>
    </Container>
  );
};

export default Websites;
