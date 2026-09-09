// material-ui
import { useTheme } from '@mui/material/styles';

// project imports
import { HANDSET_PATH, HANDSET_TRANSFORM, MARK } from './LogoMain';

// ==============================|| LOGO - ICON ||============================== //

/**
 * The mark on its own, for the collapsed rail and anywhere the wordmark will not
 * fit. Geometry and colour rule are shared with `LogoMain`, so the two cannot
 * drift apart.
 */

export default function LogoIcon() {
  const theme = useTheme();

  return (
    <svg width="35" height="23" viewBox="0 0 512 337.33" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mphone">
      <rect
        x={MARK.x}
        y={MARK.y}
        width={MARK.width}
        height={MARK.height}
        rx={MARK.radius}
        ry={MARK.radius}
        fill={theme.vars.palette.primary.main}
      />
      <g transform={HANDSET_TRANSFORM}>
        <path d={HANDSET_PATH} fill={theme.vars.palette.common.white} />
      </g>
    </svg>
  );
}
