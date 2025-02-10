import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Drawer,
  useTheme,
  useMediaQuery,
  IconButton
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import StudyGroupPanel from './StudyGroupPanel';
import './ChatLayout.css';

const ChatLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setMobileSidebarOpen(false);
  };

  return (
    <Box className="chat-layout">
      {isMobile && (
        <IconButton
          className="mobile-menu-button"
          onClick={() => setMobileSidebarOpen(true)}
        >
          <MenuIcon />
        </IconButton>
      )}

      {isMobile ? (
        <Drawer
          anchor="left"
          open={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
          className="mobile-sidebar"
        >
          <ChatSidebar onChatSelect={handleChatSelect} selectedChat={selectedChat} />
        </Drawer>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Paper className="sidebar-container">
              <ChatSidebar onChatSelect={handleChatSelect} selectedChat={selectedChat} />
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className="chat-container">
              <ChatWindow selectedChat={selectedChat} />
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper className="group-panel-container">
              <StudyGroupPanel selectedChat={selectedChat} />
            </Paper>
          </Grid>
        </Grid>
      )}

      {isMobile && selectedChat && (
        <Box className="mobile-chat-window">
          <ChatWindow selectedChat={selectedChat} />
        </Box>
      )}
    </Box>
  );
};

export default ChatLayout; 