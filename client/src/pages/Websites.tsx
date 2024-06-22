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
import { Website, WebsiteWithNodes } from "../types";
import { startTask, stopTask } from "../api/website";

export const Websites: React.FC = () => {
  const [websites] = useState<WebsiteWithNodes[]>((useLoaderData() as WebsiteWithNodes[]));
  const [rows, setRows] = useState<Record<number, Website>>({});
  const [graphView, setGraphView] = useState<boolean>(false);
  const apiRef = useGridApiRef();

  useEffect(() => {
    const dict: Record<number, WebsiteWithNodes> = {};
    websites.forEach(web => {
      dict[web.id] = web
    })
    setRows(dict)
  }, [])

  const handleDeleteRow = (id: GridRowId) => {
    // TODO: await delete

    // then
    apiRef.current.updateRows([{ id, _action: "delete" }]);
  };

  const handleToggleRow = async (id: GridRowId, active: boolean) => {
    if (active) {
      await startTask(id);
    } else {
      await stopTask(id);
    }
    apiRef.current.updateRows([{ id, active }]);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: "label", headerName: "Label", width: 200 },
    { field: "url", headerName: "URL", flex: 1 },
    // { field: 'regexp', headerName: 'RegExp', width: 300 },
    {
      field: "tags",
      headerName: "Tags",
      width: 200,
      valueFormatter: (_, row) => row.tags.join(", ")
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
            onClick={async () => await handleToggleRow(row.id, true)}
            aria-label="Enable"
            color="inherit"
          >
            <PlayArrow />
          </Typography>
        ) : (
          <Typography
            component={Link}
            to=""
            onClick={async () => await handleToggleRow(row.id, false)}
            aria-label="Disable"
            color="inherit"
          >
            <Pause />
          </Typography>
        );

        return [
          toggleIcon,
          <Typography
          key={'view' + row.id}
            component={Link}
            to={"/websites/" + row.id}
            aria-label="View"
            color="inherit"
          >
            <Info />
          </Typography>,
          <Typography
            key={'edit' + row.id}
            component={Link}
            to={"/websites/" + row.id + "/edit"}
            aria-label="Edit"
            color="inherit"
          >
            <EditIcon />
          </Typography>,
          <Typography
            key={'delete' + row.id}
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
