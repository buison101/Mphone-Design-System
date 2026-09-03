// material-ui
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';

// table data
const createData = (sales, product, price, colorClass = '') => ({ sales, product, price, colorClass });

// Hoisted into a function so the sample rows are rebuilt on every render. As a
// module-scope constant this was evaluated once on import, which froze the
// first locale loaded. See docs/15 §4.7.
const getRows = () => [
  createData('2136', 'Head Phone', '$ 926.23'),
  createData('2546', 'Iphone V', '$ 485.85'),
  createData('2681', 'Jacket', '$ 786.4'),
  createData('2756', 'Head Phone', '$ 563.45'),
  createData('8765', 'Sofa', '$ 769.45'),
  createData('3652', 'Iphone X', '$ 754.45'),
  createData('7456', 'Jacket', '$ 743.23'),
  createData('6502', 'T-Shirt', '$ 642.23')
];

// ===========================|| DATA WIDGET - PRODUCT SALES ||=========================== //

export default function ProductSales() {
  const rows = getRows();
  return (
    <MainCard title="Product Sales" content={false}>
      <Stack direction="row" sx={{ justifyContent: 'space-around', alignItems: 'center', p: 2.5 }}>
        <Stack sx={{ gap: 1, alignItems: 'center' }}>
          <Typography variant="subtitle2" sx={{ color: 'secondary.main' }}>
            Earning
          </Typography>
          <Typography variant="h4">20,569$</Typography>
        </Stack>
        <Stack sx={{ gap: 1, alignItems: 'center' }}>
          <Typography variant="subtitle2" sx={{ color: 'secondary.main' }}>
            Yesterday
          </Typography>
          <Typography variant="h4">580$</Typography>
        </Stack>
        <Stack sx={{ gap: 1, alignItems: 'center' }}>
          <Typography variant="subtitle2" sx={{ color: 'secondary.main' }}>
            This Week
          </Typography>
          <Typography variant="h4">5,789$</Typography>
        </Stack>
      </Stack>
      <SimpleBar
        sx={{
          height: 290
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Last Sales</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell align="right">Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow hover key={index}>
                  <TableCell>
                    <span className={row.colorClass}>{row.sales}</span>
                  </TableCell>
                  <TableCell>{row.product}</TableCell>
                  <TableCell align="right">
                    <span>{row.price}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </SimpleBar>
    </MainCard>
  );
}
