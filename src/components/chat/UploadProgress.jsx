import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  LinearProgress,
  Typography,
  Box
} from '@mui/material';

const UploadProgress = ({ open, fileName, progress }) => {
  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>Uploading File</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          {fileName}
        </Typography>
        <Box sx={{ width: '100%', mt: 1 }}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
            {Math.round(progress)}%
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default UploadProgress; 