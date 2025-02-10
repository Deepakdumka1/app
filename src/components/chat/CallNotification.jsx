import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material';

const CallNotification = ({ open, caller, onAccept, onDecline }) => {
  return (
    <Dialog open={open} maxWidth="xs" fullWidth>
      <DialogTitle>Incoming Call</DialogTitle>
      <DialogContent>
        <Typography>
          {caller} is calling you...
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDecline} color="error">
          Decline
        </Button>
        <Button onClick={onAccept} color="primary" variant="contained">
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CallNotification; 