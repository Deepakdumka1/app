import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton
} from '@mui/material';
import {
  Description as FileIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const FileShareDialog = ({ open, onClose, onShareFiles }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('image')) return <ImageIcon />;
    if (fileType.includes('pdf')) return <PdfIcon />;
    return <FileIcon />;
  };

  const handleShare = () => {
    onShareFiles(selectedFiles);
    setSelectedFiles([]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Share Files</DialogTitle>
      <DialogContent>
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          style={{ marginBottom: '1rem' }}
        />
        <List>
          {selectedFiles.map((file, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton edge="end" onClick={() => handleRemoveFile(index)}>
                  <CloseIcon />
                </IconButton>
              }
            >
              <ListItemIcon>{getFileIcon(file.type)}</ListItemIcon>
              <ListItemText primary={file.name} secondary={`${(file.size / 1024).toFixed(2)} KB`} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleShare}
          variant="contained"
          color="primary"
          disabled={selectedFiles.length === 0}
        >
          Share
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileShareDialog; 