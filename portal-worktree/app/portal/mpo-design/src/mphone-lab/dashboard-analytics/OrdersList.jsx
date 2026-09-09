import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

// third-party
import { NumericFormat } from 'react-number-format';

// project imports
import Dot from 'components/@extended/Dot';

function createData(tracking_no, name, fat, carbs, protein) {
  return { tracking_no, name, fat, carbs, protein };
}

// Hoisted into a function so the product names are rebuilt on every render. As
// a module-scope constant this was evaluated once on import, which froze the
// first locale loaded. See docs/15 §4.7.
const getRows = () => [
  createData(84564564, 'Camera Lens', 40, 2, 40570),
  createData(98764564, 'Laptop', 300, 0, 180139),
  createData(98756325, 'Mobile', 355, 1, 90989),
  createData(98652366, 'Handset', 50, 1, 10239),
  createData(13286564, 'Computer Accessories', 100, 1, 83348),
  createData(86739658, 'TV', 99, 0, 410780),
  createData(13256498, 'Keyboard', 125, 2, 70999),
  createData(98753263, 'Mouse', 89, 2, 10570),
  createData(98753275, 'Desktop', 185, 1, 98063),
  createData(98753291, 'Chair', 100, 0, 14001)
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = [...array.map((el, index) => [el, index])];
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

// Hoisted into a function so the labels are rebuilt on every render. As a
// module-scope constant this was evaluated once on import, which froze the
// first locale loaded. See docs/15 §4.7.
const getHeadCells = (labels = {}) => [
  {
    id: 'tracking_no',
    align: 'left',
    disablePadding: false,
    label: labels.tracking || 'Tracking No.'
  },
  {
    id: 'name',
    align: 'left',
    disablePadding: true,
    label: labels.name || 'Product Name'
  },
  {
    id: 'fat',
    align: 'right',
    disablePadding: false,
    label: labels.total || 'Total Order'
  },
  {
    id: 'carbs',
    align: 'left',
    disablePadding: false,

    label: labels.status || 'Status'
  },
  {
    id: 'protein',
    align: 'right',
    disablePadding: false,
    label: labels.amount || 'Total Amount'
  }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

function OrderTableHead({ labels, order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {getHeadCells(labels).map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function OrderStatus({ labels = {}, status }) {
  let color;
  let title;

  switch (status) {
    case 0:
      color = 'warning';
      title = labels.pending || 'Pending';
      break;
    case 1:
      color = 'success';
      title = labels.approved || 'Approved';
      break;
    case 2:
      color = 'error';
      title = labels.rejected || 'Rejected';
      break;
    default:
      color = 'primary';
      title = labels.none || 'None';
  }

  return (
    <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}

// ==============================|| ORDER TABLE ||============================== //

export default function OrdersList({ content = {} }) {
  const rows = content.rows || getRows();
  const order = 'asc';
  const orderBy = 'tracking_no';

  return (
    <TableContainer
      sx={{
        width: '100%',
        overflowX: 'auto',
        position: 'relative',
        display: 'block',
        maxWidth: '100%',
        '& td, & th': { whiteSpace: 'nowrap' }
      }}
    >
      <Table aria-labelledby="tableTitle">
        <OrderTableHead labels={content.headings} order={order} orderBy={orderBy} />
        <TableBody>
          {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
            const labelId = `enhanced-table-checkbox-${index}`;

            return (
              <TableRow
                hover
                role="checkbox"
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                tabIndex={-1}
                key={row.tracking_no}
              >
                <TableCell component="th" id={labelId} scope="row">
                  <Link sx={{ color: 'secondary.main' }} component={RouterLink} to="">
                    {row.tracking_no}
                  </Link>
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell align="right">{row.fat}</TableCell>
                <TableCell>
                  <OrderStatus labels={content.statuses} status={row.carbs} />
                </TableCell>
                <TableCell align="right">
                  <NumericFormat
                    value={row.protein}
                    displayType="text"
                    thousandSeparator
                    prefix={content.valuePrefix || '$'}
                    suffix={content.valueSuffix}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

OrderTableHead.propTypes = { labels: PropTypes.object, order: PropTypes.any, orderBy: PropTypes.string };

OrderStatus.propTypes = { labels: PropTypes.object, status: PropTypes.number };

OrdersList.propTypes = { content: PropTypes.object };
