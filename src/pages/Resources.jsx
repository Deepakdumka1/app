import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondary,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  LinearProgress,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Search as SearchIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  Description as DocIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import './Resources.css';

const Resources = () => {
  const [files, setFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('tags', selectedTags);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
          onUploadProgress: (progressEvent) => {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            setUploadProgress(progress);
          },
        });
        const data = await response.json();
        setFiles(prev => [...prev, data]);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
    setUploadDialogOpen(false);
  };

  const handlePreview = (file) => {
    setSelectedFile(file);
    setPreviewDialogOpen(true);
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return <PdfIcon color="error" />;
    if (fileType.includes('image')) return <ImageIcon color="primary" />;
    return <DocIcon color="action" />;
  };

  const filteredFiles = files.filter(file => 
    (file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) &&
    (selectedTags.length === 0 || selectedTags.some(tag => file.tags.includes(tag)))
  );

  return (
    <Container maxWidth="lg" className="resources-container">
      <Box className="resources-header">
        <Typography variant="h4" className="page-title">
          Resource Sharing & Notes
        </Typography>
        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          onClick={() => setUploadDialogOpen(true)}
          className="upload-button"
        >
          Upload Resources
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper className="filters-paper">
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            <Box className="tags-container">
              {['Math', 'Physics', 'Chemistry', 'CS', 'Biology'].map(tag => (
                <Chip
                  key={tag}
                  label={tag}
                  onClick={() => setSelectedTags(prev => [...prev, tag])}
                  onDelete={
                    selectedTags.includes(tag)
                      ? () => setSelectedTags(prev => prev.filter(t => t !== tag))
                      : undefined
                  }
                  className={selectedTags.includes(tag) ? 'selected-tag' : 'tag'}
                />
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={9}>
          <Paper className="resources-paper">
            <TextField
              fullWidth
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              className="search-input"
            />

            <List className="resources-list">
              {filteredFiles.map((file) => (
                <ListItem
                  key={file.id}
                  className="resource-item"
                >
                  <ListItemIcon>
                    {getFileIcon(file.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={file.name}
                    secondary={
                      <Box className="file-meta">
                        <Typography variant="caption">
                          {file.size} • {file.uploadedAt}
                        </Typography>
                        <Box className="file-tags">
                          {file.tags.map(tag => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              className="file-tag"
                            />
                          ))}
                        </Box>
                      </Box>
                    }
                  />
                  <Box className="file-actions">
                    <IconButton onClick={() => handlePreview(file)}>
                      <ViewIcon />
                    </IconButton>
                    <IconButton href={file.downloadUrl}>
                      <DownloadIcon />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upload Resources</DialogTitle>
        <DialogContent>
          <Box className="upload-content">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.png"
              style={{ display: 'none' }}
              id="file-input"
            />
            <label htmlFor="file-input">
              <Button
                variant="outlined"
                component="span"
                startIcon={<UploadIcon />}
                className="upload-button"
              >
                Choose Files
              </Button>
            </label>
            {uploadProgress > 0 && (
              <Box className="upload-progress">
                <LinearProgress variant="determinate" value={uploadProgress} />
                <Typography variant="caption">
                  {Math.round(uploadProgress)}% uploaded
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={previewDialogOpen}
        onClose={() => setPreviewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{selectedFile?.name}</DialogTitle>
        <DialogContent>
          <Box className="preview-container">
            {selectedFile?.type.includes('pdf') ? (
              <iframe
                src={selectedFile.previewUrl}
                width="100%"
                height="500px"
                title="PDF Preview"
              />
            ) : selectedFile?.type.includes('image') ? (
              <img
                src={selectedFile.previewUrl}
                alt={selectedFile.name}
                style={{ maxWidth: '100%' }}
              />
            ) : (
              <Typography>Preview not available</Typography>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Resources; 