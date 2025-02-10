import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  List, 
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  TextField,
  Divider,
  IconButton,
  Box
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Videocam as VideocamIcon
} from '@mui/icons-material';
import './Chat.css';
import CreateGroupDialog from '../components/chat/CreateGroupDialog';
import FileShareDialog from '../components/chat/FileShareDialog';
import VideoCall from '../components/chat/VideoCall';
import UploadProgress from '../components/chat/UploadProgress';

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [fileShareOpen, setFileShareOpen] = useState(false);
  const [videoCallOpen, setVideoCallOpen] = useState(false);
  const [socket, setSocket] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingFile, setUploadingFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  
  const [chats, setChats] = useState([
    {
      id: 1,
      name: "Calculus Study Group",
      type: "group",
      lastMessage: "Can someone explain derivatives?",
      unread: 3,
    },
    {
      id: 2,
      name: "John Doe",
      type: "direct",
      lastMessage: "Thanks for the notes!",
      unread: 0,
    }
  ]);

  const [currentUser, setCurrentUser] = useState({
    id: uuidv4(),
    name: "John Doe",
    avatar: "https://via.placeholder.com/50"
  });

  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setSocket(newSocket);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('receive_message', handleReceiveMessage);
      socket.on('user_typing', handleUserTyping);
      socket.on('stop_typing', handleStopTyping);

      return () => {
        socket.off('receive_message');
        socket.off('user_typing');
        socket.off('stop_typing');
      };
    }
  }, [socket]);

  useEffect(() => {
    if (socket && selectedChat) {
      socket.emit('join_room', selectedChat.id);
    }
  }, [selectedChat, socket]);

  const handleReceiveMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const handleUserTyping = (data) => {
    if (data.chatId === selectedChat?.id) {
      setIsTyping(true);
    }
  };

  const handleStopTyping = (data) => {
    if (data.chatId === selectedChat?.id) {
      setIsTyping(false);
    }
  };

  const handleSendMessage = useCallback((e) => {
    e.preventDefault();
    if (message.trim() && selectedChat && socket) {
      const newMessage = {
        id: uuidv4(),
        sender: "John",
        content: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      socket.emit('send_message', {
        roomId: selectedChat.id,
        message: newMessage
      });

      setMessages(prev => [...prev, newMessage]);
      setMessage('');
    }
  }, [message, selectedChat, socket]);

  const handleCreateGroup = (groupData) => {
    const newGroup = {
      id: chats.length + 1,
      name: groupData.groupName,
      type: 'group',
      subject: groupData.subject,
      lastMessage: groupData.description,
      unread: 0
    };
    setChats([...chats, newGroup]);
  };

  const handleShareFiles = async (files) => {
    for (const file of files) {
      setUploadingFile(file.name);
      setUploadProgress(0);
      
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('http://localhost:5000/upload', {
          method: 'POST',
          body: formData,
          onUploadProgress: (progressEvent) => {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            setUploadProgress(progress);
          },
        });

        const data = await response.json();
        
        const newMessage = {
          id: uuidv4(),
          sender: "John",
          content: `Shared file: ${file.name}`,
          fileType: file.type,
          fileName: file.name,
          fileSize: file.size,
          filePath: data.filePath,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        socket.emit('send_message', {
          roomId: selectedChat.id,
          message: newMessage
        });

        setMessages(prev => [...prev, newMessage]);
      } catch (error) {
        console.error('Error uploading file:', error);
      } finally {
        setUploadingFile(null);
        setUploadProgress(0);
      }
    }
  };

  const emitTyping = () => {
    if (socket && selectedChat) {
      socket.emit('typing', {
        chatId: selectedChat.id,
        userId: currentUser.id
      });

      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      setTypingTimeout(
        setTimeout(() => {
          socket.emit('stop_typing', {
            chatId: selectedChat.id,
            userId: currentUser.id
          });
        }, 1000)
      );
    }
  };

  return (
    <Container className="chat-container">
      <Grid container spacing={2}>
        {/* Chat List */}
        <Grid item xs={12} md={4}>
          <Paper className="chat-list">
            <Box className="chat-list-header">
              <Typography variant="h6">Chats & Study Groups</Typography>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => setCreateGroupOpen(true)}
              >
                New Group
              </Button>
            </Box>
            <List>
              {chats.map((chat) => (
                <ListItem 
                  button 
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  selected={selectedChat?.id === chat.id}
                >
                  <ListItemAvatar>
                    <Avatar>{chat.name[0]}</Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={chat.name}
                    secondary={chat.lastMessage}
                  />
                  {chat.unread > 0 && (
                    <div className="unread-badge">{chat.unread}</div>
                  )}
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Chat Messages */}
        <Grid item xs={12} md={8}>
          <Paper className="chat-messages">
            {selectedChat ? (
              <>
                <Box className="chat-header">
                  <Typography variant="h6">{selectedChat.name}</Typography>
                  <IconButton 
                    color="primary"
                    onClick={() => setVideoCallOpen(true)}
                  >
                    <VideocamIcon />
                  </IconButton>
                </Box>
                <Divider />
                <Box className="messages-container">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.sender === 'John' ? 'sent' : 'received'}`}>
                      <Typography variant="subtitle2">{msg.sender}</Typography>
                      <Paper className="message-content">
                        <Typography>{msg.content}</Typography>
                        {msg.fileName && (
                          <Box className="file-attachment">
                            <IconButton size="small">
                              <AttachFileIcon />
                            </IconButton>
                            <Typography variant="body2">
                              {msg.fileName} ({(msg.fileSize / 1024).toFixed(2)} KB)
                            </Typography>
                          </Box>
                        )}
                        <Typography variant="caption" className="timestamp">
                          {msg.timestamp}
                        </Typography>
                      </Paper>
                    </div>
                  ))}
                </Box>
                <Box component="form" className="message-input" onSubmit={handleSendMessage}>
                  <IconButton 
                    color="primary"
                    onClick={() => setFileShareOpen(true)}
                  >
                    <AttachFileIcon />
                  </IconButton>
                  <TextField
                    fullWidth
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <IconButton color="primary" type="submit">
                    <SendIcon />
                  </IconButton>
                </Box>
              </>
            ) : (
              <Box className="no-chat-selected">
                <Typography variant="h6">
                  Select a chat or study group to start messaging
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
      <CreateGroupDialog
        open={createGroupOpen}
        onClose={() => setCreateGroupOpen(false)}
        onCreateGroup={handleCreateGroup}
      />
      <FileShareDialog
        open={fileShareOpen}
        onClose={() => setFileShareOpen(false)}
        onShareFiles={handleShareFiles}
      />
      <VideoCall
        open={videoCallOpen}
        onClose={() => setVideoCallOpen(false)}
        peer={selectedChat}
        socket={socket}
      />
      <UploadProgress 
        open={!!uploadingFile}
        fileName={uploadingFile}
        progress={uploadProgress}
      />
    </Container>
  );
};

export default Chat; 