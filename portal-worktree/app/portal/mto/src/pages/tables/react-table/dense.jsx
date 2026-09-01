import PropTypes from 'prop-types';
import { useMemo } from 'react';

// material-ui
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

// third-party
import { flexRender, useReactTable, getCoreRowModel } from '@tanstack/react-table';

// project imports
import LinearWithLabel from 'components/@extended/progress/LinearWithLabel';
import MainCard from 'components/MainCard';
import { CSVExport, StatusPill } from 'components/third-party/react-table';
import makeData from 'data/react-table';

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data, title }) {
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  const headers = [];

  table.getAllColumns().map((column) => {
    const accessorKey = column.columnDef.accessorKey;
    headers.push({
      label: typeof column.columnDef.header === 'string' ? column.columnDef.header : '#',
      key: accessorKey ?? ''
    });
  });

  return (
    <MainCard content={false} title={title} secondary={<CSVExport {...{ data, headers, filename: 'dense.csv' }} />}>
      <TableContainer>
        <Table sx={{ minWidth: 750 }} size="small">
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell key={header.id} {...header.column.columnDef.meta}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </MainCard>
  );
}

// ==============================|| REACT TABLE - DENSE ||============================== //

export default function DenseTable() {
  const data = makeData(10);

  const columns = useMemo(
    () => [
      { header: 'Name', footer: 'Name', accessorKey: 'fullName', meta: { sx: { whiteSpace: 'nowrap' } } },
      { header: 'Email', footer: 'Email', accessorKey: 'email' },
      { header: 'Age', accessorKey: 'age', meta: { align: 'right' } },
      { header: 'Role', footer: 'Role', accessorKey: 'role' },
      { header: 'Visits', footer: 'Visits', accessorKey: 'visits', meta: { align: 'right' } },
      { header: 'Status', accessorKey: 'status', cell: (cell) => <StatusPill status={cell.getValue()} /> },
      {
        header: 'Profile Progress',
        accessorKey: 'progress',
        cell: (props) => <LinearWithLabel value={props.getValue()} sx={{ minWidth: 75 }} />
      }
    ],
    []
  );

  return <ReactTable {...{ data, columns, title: 'Dense Table' }} />;
}

ReactTable.propTypes = { columns: PropTypes.array, data: PropTypes.array, title: PropTypes.string };
