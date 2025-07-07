import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { DownloadRounded, VisibilityRounded } from '@mui/icons-material';

interface FileViewerProps {
  open: boolean;
  onClose: () => void;
  files: { name: string; content?: any; type?: string }[];
}

const FileViewer: React.FC<FileViewerProps> = ({ open, onClose, files }) => {
  const handleDownload = (file: any) => {
    const blob = new Blob([file.content], { type: file.type || 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Treatment Files</DialogTitle>
      <DialogContent>
        {files.length === 0 ? (
          <Typography>No files uploaded for this treatment.</Typography>
        ) : (
          <List>
            {files.map((file, index) => (
              <ListItem key={index}>
                <ListItemText primary={file.name} />
                <IconButton onClick={() => handleDownload(file)}>
                <DownloadRounded />
              </IconButton>
              <IconButton
                onClick={() => {
                  const blob = new Blob([file.content], { type: file.type });
                  const url = URL.createObjectURL(blob);
                  window.open(url, '_blank');
                }}
              >
                <VisibilityRounded />
              </IconButton>

              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileViewer;
