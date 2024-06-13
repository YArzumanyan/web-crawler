import { Link, useLoaderData } from "react-router-dom";
import { DataGrid, GridColDef, GridRowId, useGridApiRef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import Info from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import Chip from '@mui/joy/Chip';
import { useState } from "react";
import { Container, Typography } from "@mui/material";
import { Pause, PlayArrow } from "@mui/icons-material";

type Website = {
  id: string,
  label: string,
  url: string,
  regexp: string,
  tags: string[],
  active: boolean
}

export const Websites = () => {
  const [rows, setRows] = useState<Website[]>(useLoaderData() as  Website[])
  const apiRef = useGridApiRef();
  console.log(rows);

  const handleDeleteRow = (id: GridRowId) => {
    // TODO: await delete
    
    // then
    apiRef.current.updateRows([{ id, _action: 'delete' }]);
  };

  const handleToggleRow = (id: GridRowId, active: boolean) => {
    apiRef.current.updateRows([{ id, active: !active}]);
  }

  const columns: GridColDef[] = [
  //   { field: 'id', headerName: 'ID', width: 50 },
    { field: 'label', headerName: 'Label', width: 200 },
    { field: 'url', headerName: 'URL', flex: 1 },
    // { field: 'regexp', headerName: 'RegExp', width: 300 },
    { 
      field: 'tags', 
      headerName: 'Tags',
      width: 200,
      // valueFormatter: (value, row) => row.tags.join(", ") 
      renderCell: () => (
        <div style={{height: '100%', display: 'flex', alignItems: 'center', gap: 2}}>
          {["tag1", "tag2"].map(tag => (
            <Chip variant="soft">{tag}</Chip>
          ))}
        </div>
      )
    },
    { 
      field: 'active', 
      headerName: 'Active',
      width: 100,
      renderCell: ({row}) => (
        <Chip 
          color={row.active ? "success" : "danger"} 
          variant="outlined"
          >
            {row.active ? "Active" : "Disabled"}
        </Chip> 
      )
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      cellClassName: 'actions',
      getActions: ({row}) => {
        const toggleIcon: JSX.Element = row.active ? (
          <Typography component={Link} to="" onClick={() => handleToggleRow(row.id, row.active)} aria-label="Enable" color="inherit"><PlayArrow /></Typography>
        ) : (
          <Typography component={Link} to="" onClick={() => handleToggleRow(row.id, row.active)} aria-label="Disable" color="inherit"><Pause /></Typography>
        )
        
        return [
          toggleIcon,
          <Typography component={Link} to={"/websites/" + row.id} aria-label="View" color="inherit"><Info /></Typography>,
          <Typography component={Link} to={"/websites/" + row.id + "/edit"} aria-label="Edit" color="inherit"><EditIcon /></Typography>,
          <Typography component={Link} to="" onClick={() => handleDeleteRow(row.id)} aria-label="Delete" color="inherit"><DeleteIcon /></Typography>,
        ];
      },
    },
  ]

  return (
    <Container style={{height: '100%', width: '100%'}}>
      <DataGrid
        apiRef={apiRef}
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {page: 0, pageSize: 10}
          }
        }}
        pageSizeOptions={[5, 10, 20]}
      />
    </Container>
  );
};
