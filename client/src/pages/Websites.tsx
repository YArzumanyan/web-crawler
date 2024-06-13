import { Link, useLoaderData } from "react-router-dom";
import {
  DataGrid,
  GridColDef,
  GridRowId,
  useGridApiRef,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import Info from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import Chip from "@mui/joy/Chip";
import { useEffect, useState } from "react";
import { Container, Stack, Switch, Typography } from "@mui/material";
import { Pause, PlayArrow } from "@mui/icons-material";
import { nodes } from "../temp/nodes";

type Node = {
  id: number;
  title: string;
  crawlTime: number;
  links: any;
  owner: number;
}

type Website = {
  id: number;
  label: string;
  url: string;
  regexp: string;
  tags: string[];
  active: boolean;
};

interface WebsiteWithNodes extends Website {
  nodes: Node[];
}

export const Websites: React.FC = () => {
  // Ideally websites will be passed down with their corresponding nodes
  const [websites, setWebsites] = useState<WebsiteWithNodes[]>((useLoaderData() as Website[]).map(web => ({...web, nodes: []})));
  const [rows, setRows] = useState<Record<number, Website>>({});
  const [graphView, setGraphView] = useState<boolean>(false);
  const apiRef = useGridApiRef();

  // For testing purposes
  useEffect(() => {
    let dict: Record<number, WebsiteWithNodes> = {};
    websites.forEach(web => {
      dict[web.id] = web
    })
    nodes.map(node => dict[node.id] ? dict[node.id].nodes.push(node) : null)
    setRows(dict)
  }, [])

  const handleDeleteRow = (id: GridRowId) => {
    // TODO: await delete

    // then
    apiRef.current.updateRows([{ id, _action: "delete" }]);
  };

  const handleToggleRow = (id: GridRowId, active: boolean) => {
    apiRef.current.updateRows([{ id, active: !active }]);
  };

  const columns: GridColDef[] = [
    //   { field: 'id', headerName: 'ID', width: 50 },
    { field: "label", headerName: "Label", width: 200 },
    { field: "url", headerName: "URL", flex: 1 },
    // { field: 'regexp', headerName: 'RegExp', width: 300 },
    {
      field: "tags",
      headerName: "Tags",
      width: 200,
      // valueFormatter: (value, row) => row.tags.join(", ")
      renderCell: () => (
        <div
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          {["tag1", "tag2"].map((tag) => (
            <Chip key={"chip" + tag} variant="soft">{tag}</Chip>
          ))}
        </div>
      ),
    },
    {
      field: "active",
      headerName: "Active",
      width: 100,
      renderCell: ({ row }) => (
        <Chip color={row.active ? "success" : "danger"} variant="outlined">
          {row.active ? "Active" : "Disabled"}
        </Chip>
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 120,
      getActions: ({ row }) => {
        const toggleIcon: JSX.Element = row.active ? (
          <Typography
            component={Link}
            to=""
            onClick={() => handleToggleRow(row.id, row.active)}
            aria-label="Enable"
            color="inherit"
          >
            <PlayArrow />
          </Typography>
        ) : (
          <Typography
            component={Link}
            to=""
            onClick={() => handleToggleRow(row.id, row.active)}
            aria-label="Disable"
            color="inherit"
          >
            <Pause />
          </Typography>
        );

        return [
          toggleIcon,
          <Typography
            component={Link}
            to={"/websites/" + row.id}
            aria-label="View"
            color="inherit"
          >
            <Info />
          </Typography>,
          <Typography
            component={Link}
            to={"/websites/" + row.id + "/edit"}
            aria-label="Edit"
            color="inherit"
          >
            <EditIcon />
          </Typography>,
          <Typography
            component={Link}
            to=""
            onClick={() => handleDeleteRow(row.id)}
            aria-label="Delete"
            color="inherit"
          >
            <DeleteIcon />
          </Typography>,
        ];
      },
    },
  ];

  return (
    <Container style={{ height: "100%", width: "100%" }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography>Table</Typography>
        <Switch onChange={() => setGraphView((curr) => !curr)} />
        <Typography>Graph</Typography>
      </Stack>
      {graphView ? (
        <>Graph View</>
      ) : (
        <DataGrid
          apiRef={apiRef}
          rows={Object.values(rows)}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 20]}
        />
      )}
    </Container>
  );
};
