import PropTypes from 'prop-types';
// material-ui
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';

// project imports
import IconButton from 'components/@extended/IconButton';

// assets
import CloseOutlined from '@ant-design/icons/CloseOutlined';

// ==============================|| VIDEO DIALOG ||============================== //

export default function VideoDialog({ open, onClose, videoId }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="video-dialog-title"
      sx={{ '& .MuiDialog-paper': { bgcolor: 'grey.900', position: 'relative', overflow: 'visible' } }}
    >
      <IconButton
        shape="rounded"
        aria-label="close"
        onClick={onClose}
        size="small"
        sx={{
          position: 'absolute',
          right: -12,
          top: -12,
          color: 'white',
          bgcolor: 'error.main',
          '&:hover': { bgcolor: 'error.dark', color: 'white' },
          zIndex: 1
        }}
      >
        <CloseOutlined />
      </IconButton>
      <DialogContent sx={{ p: 0, lineHeight: 0 }}>
        <Box sx={{ position: 'relative', paddingTop: '56.25%', width: '100%', bgcolor: 'common.black' }}>
          <iframe
            title="Mantis Prompt Explorer Video"
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}

VideoDialog.propTypes = { open: PropTypes.bool, onClose: PropTypes.func, videoId: PropTypes.string };
