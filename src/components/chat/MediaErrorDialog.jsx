import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material';

const MediaErrorDialog = ({ open, onClose, error }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Camera/Microphone Error</DialogTitle>
      <DialogContent>
        <Typography color="error">
          {error || 'Could not access camera or microphone. Please check your permissions.'}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MediaErrorDialog; 