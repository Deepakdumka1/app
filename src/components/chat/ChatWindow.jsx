import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Paper,
  Tooltip,
  Menu,
  MenuItem,
  CircularProgress,
  Badge
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon,
  MoreVert as MoreVertIcon,
  Reply as ReplyIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  VideoCall as VideoCallIcon
} from '@mui/icons-material';
import EmojiPicker from 'emoji-picker-react';
import { format } from 'date-fns';
import './ChatWindow.css';

const ChatWindow = ({ 
  selectedChat, 
  onSendMessage, 
  onStartVideoCall,
  messages = [],
  isTyping,
  currentUser 
}) => {
  const [message, setMessage] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage({
        content: message,
        replyTo: replyingTo,
        editingId: editingMessage?.id
      });
      setMessage('');
      setReplyingTo(null);
      setEditingMessage(null);
    }
  };

  const handleEmojiClick = (emojiData) => {
    setMessage(prev => prev + emojiData.emoji);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    // Handle file upload
  };

  const handleMessageMenu = (e, message) => {
    setAnchorEl(e.currentTarget);
  };

  const handleEdit = (message) => {
    setEditingMessage(message);
    setMessage(message.content);
    setAnchorEl(null);
  };

  const handleReply = (message) => {
    setReplyingTo(message);
    setAnchorEl(null);
  };

  const renderMessage = (msg) => (
    <Box
      key={msg.id}
      className={`message ${msg.sender.id === currentUser.id ? 'sent' : 'received'}`}
    >
      {msg.sender.id !== currentUser.id && (
        <Avatar src={msg.sender.avatar} className="message-avatar">
          {msg.sender.name[0]}
        </Avatar>
      )}
      <Box className="message-content">
        {msg.replyTo && (
          <Paper className="reply-preview">
            <Typography variant="body2" color="textSecondary">
              Replying to {msg.replyTo.sender.name}
            </Typography>
            <Typography variant="body2" noWrap>
              {msg.replyTo.content}
            </Typography>
          </Paper>
        )}
        <Paper className="message-bubble">
          <Typography variant="body1">{msg.content}</Typography>
          {msg.edited && (
            <Typography variant="caption" color="textSecondary">
              (edited)
            </Typography>
          )}
          <Typography variant="caption" className="message-time">
            {format(new Date(msg.timestamp), 'HH:mm')}
          </Typography>
        </Paper>
        <Box className="message-actions">
          <IconButton size="small" onClick={() => handleReply(msg)}>
            <ReplyIcon fontSize="small" />
          </IconButton>
          {msg.sender.id === currentUser.id && (
            <IconButton size="small" onClick={(e) => handleMessageMenu(e, msg)}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box className="chat-window">
      <Box className="chat-header">
        <Box className="chat-header-info">
          <Avatar src={selectedChat?.avatar} className="chat-avatar">
            {selectedChat?.name[0]}
          </Avatar>
          <Box>
            <Typography variant="h6">{selectedChat?.name}</Typography>
            {isTyping && (
              <Typography variant="caption" color="textSecondary">
                typing...
              </Typography>
            )}
          </Box>
        </Box>
        <Box className="chat-header-actions">
          <Tooltip title="Video Call">
            <IconButton onClick={onStartVideoCall}>
              <VideoCallIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box className="messages-container">
        {messages.map(renderMessage)}
        {isTyping && (
          <Box className="typing-indicator">
            <CircularProgress size={20} />
            <Typography variant="body2">Someone is typing...</Typography>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {replyingTo && (
        <Paper className="reply-bar">
          <Typography variant="body2">
            Replying to {replyingTo.sender.name}
          </Typography>
          <IconButton size="small" onClick={() => setReplyingTo(null)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Paper>
      )}

      <Box component="form" onSubmit={handleSend} className="message-input">
        <IconButton onClick={() => fileInputRef.current.click()}>
          <Badge badgeContent={0} color="primary">
            <AttachFileIcon />
          </Badge>
        </IconButton>
        <input
          type="file"
          multiple
          hidden
          ref={fileInputRef}
          onChange={handleFileSelect}
        />
        
        <IconButton onClick={() => setShowEmoji(!showEmoji)}>
          <EmojiIcon />
        </IconButton>
        
        {showEmoji && (
          <Box className="emoji-picker">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </Box>
        )}
        
        <TextField
          fullWidth
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          multiline
          maxRows={4}
          variant="outlined"
        />
        
        <IconButton type="submit" color="primary" disabled={!message.trim()}>
          <SendIcon />
        </IconButton>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => handleEdit(editingMessage)}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => handleReply(editingMessage)}>
          <ReplyIcon fontSize="small" sx={{ mr: 1 }} /> Reply
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ChatWindow; 