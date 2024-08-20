import * as React from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
// import { randomCreatedDate, randomUpdatedDate } from '@mui/x-data-grid-generator';

const initialRows = [
  {
    id: 1,
    name: 'Damien',
    age: 25,
  },
  {
    id: 2,
    name: 'Nicolas',
    age: 36,
  },
  {
    id: 3,
    name: 'Kate',
    age: 19,
  },
];

export default function ColumnTypesGrid() {
  const [rows, setRows] = React.useState(initialRows);

  const deleteUser = React.useCallback(
    (id) => () => {
      setTimeout(() => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      });
    },
    [],
  );

  
  const columns = React.useMemo(
    () => [
      { field: 'name', type: 'string' },
      { field: 'age', type: 'number' }, 
      {
        field: 'actions',
        type: 'actions',
        width: 80,
        getActions: (params) => [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={deleteUser(params.id)}
          />,
        ],
      },
    ],
    [deleteUser],
  );

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid columns={columns} rows={rows} />
    </div>
  );
}
 
 