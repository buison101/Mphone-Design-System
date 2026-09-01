import PropTypes from 'prop-types';
// material-ui
import { styled } from '@mui/material/styles';
import MuiTooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';

// project imports
import getColors from 'utils/getColors';

function getVariantStyle({ color, theme, labelColor }) {
  const colors = getColors(theme, color);
  const { main, contrastText } = colors;
  const colorValue = color ? color : '';

  if (['primary', 'secondary', 'info', 'success', 'warning', 'error'].includes(colorValue)) {
    return {
      [`& .${tooltipClasses.tooltip}`]: {
        background: main,
        color: labelColor ? labelColor : contrastText
      },
      [`& .${tooltipClasses.arrow}`]: {
        color: main
      }
    };
  } else {
    return {
      [`& .${tooltipClasses.tooltip}`]: {
        background: colorValue,
        color: labelColor ? labelColor : contrastText,
        boxShadow: theme.shadows[1]
      },
      [`& .${tooltipClasses.arrow}`]: {
        color: colorValue
      }
    };
  }
}

const TooltipStyle = styled(({ className, ...props }) => <MuiTooltip {...props} classes={{ popper: className }} />, {
  shouldForwardProp: (prop) => prop !== 'color' && prop !== 'labelColor'
})(({ theme, color, labelColor }) => ({
  variants: [
    {
      props: { color },
      style: getVariantStyle({ color, theme, labelColor })
    }
  ]
}));

export default function CustomTooltip({ children, arrow = true, labelColor = '', ...rest }) {
  return (
    <Stack>
      <TooltipStyle arrow={arrow} labelColor={labelColor} {...rest}>
        {children}
      </TooltipStyle>
    </Stack>
  );
}

getVariantStyle.propTypes = {
  color: PropTypes.oneOfType([PropTypes.any, PropTypes.string]),
  theme: PropTypes.any,
  labelColor: PropTypes.oneOfType([PropTypes.any, PropTypes.string])
};

CustomTooltip.propTypes = {
  children: PropTypes.any,
  arrow: PropTypes.bool,
  labelColor: PropTypes.oneOfType([PropTypes.any, PropTypes.string]),
  rest: PropTypes.any
};
