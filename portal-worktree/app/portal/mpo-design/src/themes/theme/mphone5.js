// project imports
import Mphone1 from './mphone1';
import Mphone3 from './mphone3';

// ==============================|| PRESET THEME - MPHONE 5 ||============================== //

// Mphone 5 keeps the Mphone 3 color identity and uses the complete Mphone 1
// neutral system for backgrounds, surfaces, borders and neutral content.
export default function Mphone5(colors, mode) {
  const mphone1Color = Mphone1(colors, mode);
  const mphone3Color = Mphone3(colors, mode);

  return {
    ...mphone3Color,
    secondary: mphone1Color.secondary,
    grey: mphone1Color.grey
  };
}
