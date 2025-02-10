import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  IconButton,
  InputBase,
  Badge,
  Tabs,
  Tab,
  Box,
  Tooltip,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Group as GroupIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import CreateGroupDialog from './CreateGroupDialog';
import './ChatSidebar.css';

const ChatSidebar = ({ onChatSelect, selectedChat }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);

  // Sample data - replace with actual data from your backend
  const chats = [
    {
      id: 1,
      name: 'Mathematics Study Group',
      type: 'group',
      unread: 3,
      lastMessage: 'Can someone help with calculus?',
      lastMessageTime: '10:30 AM',
      members: 15,
      avatar: null
    },
    // Add more chat items...
  ];

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (tabValue === 0 || (tabValue === 1 && chat.type === 'group') || (tabValue === 2 && chat.type === 'direct'))
  );

  return (
    <div className="chat-sidebar">
      <Box className="sidebar-header">
        <Box className="search-box">
          <SearchIcon className="search-icon" />
          <InputBase
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </Box>
        <Tooltip title="Create New">
          <IconButton onClick={() => setCreateGroupOpen(true)}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Tabs
        value={tabValue}
        onChange={(e, newValue) => setTabValue(newValue)}
        className="chat-tabs"
      >
        <Tab label="All" />
        <Tab label="Groups" icon={<GroupIcon />} />
        <Tab label="Direct" icon={<PersonIcon />} />
      </Tabs>

      <List className="chat-list">
        {filteredChats.map((chat) => (
          <ListItem
            button
            key={chat.id}
            selected={selectedChat?.id === chat.id}
            onClick={() => onChatSelect(chat)}
            className="chat-list-item"
          >
            <ListItemAvatar>
              <Badge
                badgeContent={chat.unread}
                color="error"
                className="chat-badge"
              >
                <Avatar src={chat.avatar}>
                  {chat.name[0]}
                </Avatar>
              </Badge>
            </ListItemAvatar>
            <ListItemText
              primary={chat.name}
              secondary={
                <Typography
                  variant="body2"
                  color="textSecondary"
                  noWrap
                  className="last-message"
                >
                  {chat.lastMessage}
                </Typography>
              }
            />
            <Box className="chat-meta">
              <Typography variant="caption" className="time">
                {chat.lastMessageTime}
              </Typography>
              {chat.type === 'group' && (
                <Typography variant="caption" className="members">
                  {chat.members} members
                </Typography>
              )}
            </Box>
          </ListItem>
        ))}
      </List>

      <CreateGroupDialog
        open={createGroupOpen}
        onClose={() => setCreateGroupOpen(false)}
      />
    </div>
  );
};

export default ChatSidebar; 