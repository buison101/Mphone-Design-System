import { useState } from 'react';

// material-ui
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Box from '@mui/material/Box';

import { RMap, RNavigationControl, RGeolocateControl, RFullscreenControl, RScaleControl } from 'maplibre-react-components';

// project imports
import osm_bright from './map-data/osm_bright.json';
import ControlPanel from 'components/third-party/map/ControlPanel';

// Hoisted into a function so the labels are rebuilt on every render. As a
// module-scope constant this was evaluated once on import, which froze the
// first locale loaded. See docs/15 §4.7.
const getInteractionList = () => [
  { key: 'dragPan', label: 'Drag Pan' },
  { key: 'scrollZoom', label: 'Scroll Zoom' },
  { key: 'boxZoom', label: 'Box Zoom' },
  { key: 'dragRotate', label: 'Drag Rotate' },
  { key: 'doubleClickZoom', label: 'Double Click Zoom' },
  { key: 'touchZoomRotate', label: 'Touch Zoom Rotate' },
  { key: 'keyboard', label: 'Keyboard Navigation' }
];

// ==============================|| MAPLIBRE - INTERACTION ||============================== //

export default function InteractionMap() {
  const [interactions, setInteractions] = useState(Object.fromEntries(getInteractionList().map((i) => [i.key, true])));

  const toggle = (key) => {
    setInteractions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Box sx={{ height: 1 }}>
      <RMap initialCenter={[72.8, 21.1]} initialZoom={4} mapStyle={osm_bright} {...interactions}>
        <RGeolocateControl position="top-left" />
        <RFullscreenControl position="top-left" />
        <RNavigationControl position="top-left" />
        <RScaleControl position="bottom-left" />
      </RMap>

      <ControlPanel>
        <FormGroup>
          {getInteractionList().map((item) => (
            <FormControlLabel
              key={item.key}
              control={<Checkbox checked={interactions[item.key]} onChange={() => toggle(item.key)} />}
              label={item.label}
            />
          ))}
        </FormGroup>
      </ControlPanel>
    </Box>
  );
}
