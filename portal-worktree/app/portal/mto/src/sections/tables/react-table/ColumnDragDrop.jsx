import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';

// material-ui
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';

// third-party
import { DndContext, closestCenter, useSensor, useSensors, TouchSensor, MouseSensor, KeyboardSensor } from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { arrayMove, horizontalListSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

// project imports
import MainCard from 'components/MainCard';
import LinearWithLabel from 'components/@extended/progress/LinearWithLabel';
import { CSVExport, StatusPill } from 'components/third-party/react-table';
import makeData from 'data/react-table';

// ==============================|| DRAGGABLE HEADER ||============================== //

function DraggableTableHeader({ header }) {
  const { attributes, isDragging, listeners, setNodeRef, transform } = useSortable({
    id: header.column.id
  });

  const style = {
    opacity: isDragging ? 0.7 : 1,
    position: 'relative',
    transform: CSS.Translate.toString(transform),
    transition: 'width transform 0.2s ease-in-out',
    whiteSpace: 'nowrap',
    width: header.column.getSize(),
    zIndex: isDragging ? 1 : 0
  };

  return (
    <TableCell colSpan={header.colSpan} ref={setNodeRef} style={style} {...header.column.columnDef.meta}>
      {header.isPlaceholder ? null : (
        <Box {...attributes} {...listeners} sx={{ width: 'fit-content', cursor: isDragging ? 'grabbing' : 'grab' }}>
          {flexRender(header.column.columnDef.header, header.getContext())}
        </Box>
      )}
    </TableCell>
  );
}

// ==============================|| DRAGGABLE CELL ||============================== //

function DragAlongCell({ cell }) {
  const { isDragging, setNodeRef, transform } = useSortable({
    id: cell.column.id
  });

  const style = {
    opacity: isDragging ? 0.7 : 1,
    position: 'relative',
    transform: CSS.Translate.toString(transform),
    transition: 'width transform 0.2s ease-in-out',
    zIndex: isDragging ? 1 : 0
  };

  return (
    <TableCell style={style} ref={setNodeRef} {...cell.column.columnDef.meta}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  );
}

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ defaultColumns, data }) {
  const [columns] = useState(() => [...defaultColumns]);

  const [columnOrder, setColumnOrder] = useState(
    // must start out with populated columnOrder so we can splice
    columns.map((column) => column.id)
  );

  const table = useReactTable({
    data,
    columns,
    state: { columnOrder },
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true
  });

  const headers = [];
  table.getAllColumns().map((column) => {
    const accessorKey = column.columnDef.accessorKey;
    headers.push({
      label: typeof column.columnDef.header === 'string' ? column.columnDef.header : '#',
      key: accessorKey ?? ''
    });
  });

  const sensors = useSensors(useSensor(MouseSensor, {}), useSensor(TouchSensor, {}), useSensor(KeyboardSensor, {}));

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setColumnOrder((columnOrder) => {
        const oldIndex = columnOrder.indexOf(active.id);
        const newIndex = columnOrder.indexOf(over.id);
        return arrayMove(columnOrder, oldIndex, newIndex);
      });
    }
  }

  return (
    <MainCard
      title="Column Drag & Drop (Ordering)"
      content={false}
      secondary={<CSVExport {...{ data, headers, filename: 'column-dragable.csv' }} />}
    >
      <DndContext collisionDetection={closestCenter} modifiers={[restrictToHorizontalAxis]} onDragEnd={handleDragEnd} sensors={sensors}>
        <TableContainer>
          <Table>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  <SortableContext items={columnOrder} strategy={horizontalListSortingStrategy}>
                    {headerGroup.headers.map((header) => (
                      <DraggableTableHeader key={header.id} header={header} />
                    ))}
                  </SortableContext>
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <SortableContext key={cell.id} items={columnOrder} strategy={horizontalListSortingStrategy}>
                      <DragAlongCell key={cell.id} cell={cell} />
                    </SortableContext>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DndContext>
    </MainCard>
  );
}

// ==============================|| COLUMN - DRAG & DROP ||============================== //

export default function ColumnDragDrop() {
  const data = useMemo(() => makeData(10), []);

  const defaultColumns = [
    { id: 'fullName', header: 'Name', accessorKey: 'fullName', meta: { sx: { whiteSpace: 'nowrap' } } },
    { id: 'email', header: 'Email', accessorKey: 'email' },
    { id: 'age', header: 'Age', accessorKey: 'age', meta: { align: 'right' } },
    { id: 'role', header: 'Role', accessorKey: 'role' },
    { id: 'visits', header: 'Visits', accessorKey: 'visits', meta: { align: 'right' } },
    { id: 'status', header: 'Status', accessorKey: 'status', cell: (cell) => <StatusPill status={cell.getValue()} /> },
    {
      id: 'progress',
      header: 'Profile Progress',
      accessorKey: 'progress',
      cell: (props) => <LinearWithLabel value={props.getValue()} sx={{ minWidth: 75 }} />
    }
  ];

  return <ReactTable {...{ defaultColumns, data }} />;
}

DraggableTableHeader.propTypes = { header: PropTypes.any, unknown: PropTypes.any };

DragAlongCell.propTypes = { cell: PropTypes.any, unknown: PropTypes.any };

ReactTable.propTypes = { defaultColumns: PropTypes.array, data: PropTypes.array };
