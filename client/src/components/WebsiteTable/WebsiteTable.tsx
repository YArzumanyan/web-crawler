import React, { useContext, useState } from "react";
import { WebsiteContext } from "../../context/WebsiteContext";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
  TableFooter,
  TableSortLabel,
} from "@mui/material";
import WebsiteModal from "./WebsiteModal";
import styles from "./WebsiteTable.module.scss";
import { Website } from "../../types";
import { Chip } from "@mui/joy";
import { Pause, PlayArrow } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import Info from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

interface WebsiteTableProps {
  onInfoClick: (website: Website) => void;
}

type Order = "asc" | "desc";

const WebsiteTable: React.FC<WebsiteTableProps> = ({ onInfoClick }) => {
  const { websites, startCrawling, stopCrawling, deleteWebsite } =
    useContext(WebsiteContext);
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Website>("label");

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Website
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedWebsites = [...websites].sort((a, b) => {
    if (a[orderBy]! < b[orderBy]!) {
      return order === "asc" ? -1 : 1;
    }
    if (a[orderBy]! > b[orderBy]!) {
      return order === "asc" ? 1 : -1;
    }
    return 0;
  });

  const paginatedWebsites = sortedWebsites.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleOpenModal = (website: Website | null) => {
    setSelectedWebsite(website);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWebsite(null);
  };

  return (
    <div className={styles.websitesPage}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenModal(null)}
      >
        Add New Website
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sortDirection={orderBy === "label" ? order : false}>
                <TableSortLabel
                  active={orderBy === "label"}
                  direction={orderBy === "label" ? order : "asc"}
                  onClick={(event) => handleRequestSort(event, "label")}
                >
                  Label
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === "url" ? order : false}>
                <TableSortLabel
                  active={orderBy === "url"}
                  direction={orderBy === "url" ? order : "asc"}
                  onClick={(event) => handleRequestSort(event, "url")}
                >
                  URL
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === "regexp" ? order : false}>
                <TableSortLabel
                  active={orderBy === "regexp"}
                  direction={orderBy === "regexp" ? order : "asc"}
                  onClick={(event) => handleRequestSort(event, "regexp")}
                >
                  RegExp
                </TableSortLabel>
              </TableCell>
              <TableCell>Tags</TableCell>
              <TableCell
                sortDirection={orderBy === "periodicity" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "periodicity"}
                  direction={orderBy === "periodicity" ? order : "asc"}
                  onClick={(event) => handleRequestSort(event, "periodicity")}
                >
                  Periodicity
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === "active" ? order : false}>
                <TableSortLabel
                  active={orderBy === "active"}
                  direction={orderBy === "active" ? order : "asc"}
                  onClick={(event) => handleRequestSort(event, "active")}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedWebsites.map((website) => (
              <TableRow key={website.id}>
                <TableCell>{website.label}</TableCell>
                <TableCell>{website.url}</TableCell>
                <TableCell>{website.regexp}</TableCell>
                <TableCell>{website.tags.join(", ")}</TableCell>
                <TableCell>{website.periodicity}</TableCell>
                <TableCell>
                  <Chip
                    color={website.active ? "success" : "danger"}
                    variant="outlined"
                  >
                    {website.active ? "Active" : "Disabled"}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className={styles.actionCell}>
                    {website.active ? (
                      <Button
                        variant="outlined"
                        color="warning"
                        onClick={() => stopCrawling(website.id)}
                      >
                        <Pause />
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        color="success"
                        onClick={() => startCrawling(website.id)}
                      >
                        <PlayArrow />
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleOpenModal(website)}
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      variant="outlined"
                      color="info"
                      onClick={() => onInfoClick(website)}
                    >
                      <Info />
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => deleteWebsite(website.id)}
                    >
                      <DeleteIcon />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                count={websites.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <WebsiteModal
        website={selectedWebsite}
        open={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default WebsiteTable;
