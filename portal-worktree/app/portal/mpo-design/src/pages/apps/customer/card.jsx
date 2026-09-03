import { useState, useEffect } from 'react';

// material-ui
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Select from '@mui/material/Select';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import EmptyUserCard from 'components/cards/skeleton/EmptyUserCard';
import { DebouncedInput } from 'components/third-party/react-table';
import CustomerCard from 'sections/apps/customer/CustomerCard';
import CustomerModal from 'sections/apps/customer/CustomerModal';

import usePagination from 'hooks/usePagination';
import { useGetCustomer } from 'api/customer';

// assets
import PlusOutlined from '@ant-design/icons/PlusOutlined';

// ==============================|| CUSTOMER - CARD ||============================== //

// Hoisted so the headers are rebuilt on every render, and each column carries a
// stable `key`. Sorting used to compare the DISPLAY text ('Customer Name'),
// which silently stops matching the moment that text is translated — the same
// defect class as keying chart series by their label. See docs/15 §4.7.
const getAllColumns = () => [
  { id: 1, key: 'default', header: 'Default' },
  { id: 2, key: 'customerName', header: 'Customer Name' },
  { id: 3, key: 'email', header: 'Email' },
  { id: 4, key: 'contact', header: 'Contact' },
  { id: 5, key: 'age', header: 'Age' },
  { id: 6, key: 'country', header: 'Country' },
  { id: 7, key: 'status', header: 'Status' }
];

function dataSort(data, sortBy) {
  return data.sort(function (a, b) {
    if (sortBy === 'customerName') return a.name.localeCompare(b.name);
    if (sortBy === 'email') return a.email.localeCompare(b.email);
    if (sortBy === 'contact') return a.contact.localeCompare(b.contact);
    if (sortBy === 'age') return b.age < a.age ? 1 : -1;
    if (sortBy === 'country') return a.country.localeCompare(b.country);
    if (sortBy === 'status') return a.status.localeCompare(b.status);
    return a;
  });
}

export default function CustomerCardPage() {
  const { customers: lists } = useGetCustomer();

  const allColumns = getAllColumns();
  const [sortBy, setSortBy] = useState('default');
  const [globalFilter, setGlobalFilter] = useState('');
  const [userCard, setUserCard] = useState([]);
  const [page, setPage] = useState(1);
  const [customerLoading, setCustomerLoading] = useState(true);
  const [customerModal, setCustomerModal] = useState(false);

  const handleChange = (event) => {
    setSortBy(event.target.value);
  };

  // search
  useEffect(() => {
    setCustomerLoading(true);
    if (lists && lists.length > 0) {
      const newData = lists.filter((value) => {
        if (globalFilter) {
          return value.name.toLowerCase().includes(globalFilter.toLowerCase());
        } else {
          return value;
        }
      });
      setUserCard(dataSort(newData, sortBy).reverse());
      setCustomerLoading(false);
    }
  }, [globalFilter, lists, sortBy]);

  const PER_PAGE = 6;

  const count = Math.ceil(userCard.length / PER_PAGE);
  const _DATA = usePagination(userCard, PER_PAGE);

  const handleChangePage = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  return (
    <>
      <Box sx={{ position: 'relative', marginBottom: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 1, alignItems: 'center', justifyContent: 'space-between', width: 1 }}>
          <DebouncedInput
            value={globalFilter ?? ''}
            onFilterChange={(value) => setGlobalFilter(String(value))}
            placeholder={`Search ${userCard.length} records...`}
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 1, alignItems: 'center' }}>
            <FormControl sx={{ minWidth: 120 }}>
              <Select
                value={sortBy}
                onChange={handleChange}
                displayEmpty
                slotProps={{ input: { 'aria-label': 'Without label' } }}
                renderValue={(selected) => {
                  if (!selected) {
                    return <Typography variant="subtitle1">Sort By</Typography>;
                  }

                  const column = allColumns.find((item) => item.key === selected);
                  return <Typography variant="subtitle2">Sort by ({column ? column.header : selected})</Typography>;
                }}
              >
                {allColumns.map((column) => {
                  return (
                    <MenuItem key={column.id} value={column.key}>
                      {column.header}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => setCustomerModal(true)}>
              Add Customer
            </Button>
          </Stack>
        </Stack>
      </Box>
      <Grid container spacing={3}>
        {!customerLoading && userCard.length > 0 ? (
          _DATA.currentData().map((user, index) => (
            <Slide key={index} direction="up" in={true} timeout={50}>
              <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                <CustomerCard customer={user} />
              </Grid>
            </Slide>
          ))
        ) : (
          <EmptyUserCard title={customerLoading ? 'Loading...' : 'You have not created any customer yet.'} />
        )}
      </Grid>
      <Stack sx={{ gap: 2, alignItems: 'flex-end', p: 2.5, my: 0.5 }}>
        <Pagination
          count={count}
          size="medium"
          page={page}
          showFirstButton
          showLastButton
          variant="combined"
          color="primary"
          onChange={handleChangePage}
        />
      </Stack>
      <CustomerModal open={customerModal} modalToggler={setCustomerModal} />
    </>
  );
}
