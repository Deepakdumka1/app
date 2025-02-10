import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  useTheme,
  useMediaQuery,
  Badge,
  Tooltip,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  School as SchoolIcon,
  Notifications as NotificationsIcon,
  Mail as MailIcon,
  Group as GroupIcon,
  Book as BookIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Person as PersonIcon,
  Event as EventIcon,
  Chat as ChatIcon,
  Forum as ForumIcon,
  CloudUpload as ResourceIcon,
  Person as ProfileIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = false; // Replace with actual auth state
  const user = null; // Replace with actual user data

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Home', path: '/', icon: <SchoolIcon /> },
    { label: 'Events', path: '/events', icon: <EventIcon /> },
    { label: 'Chat', path: '/chat', icon: <ChatIcon /> },
    { label: 'Forum', path: '/forum', icon: <ForumIcon /> },
    { label: 'Resources', path: '/resources', icon: <ResourceIcon /> },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const notifications = [
    { id: 1, message: 'New event: ML Workshop tomorrow', type: 'event' },
    { id: 2, message: 'New message in Physics group', type: 'chat' },
  ];

  return (
    <AppBar position="fixed" className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {isMobile && (
            <IconButton
              color="inherit"
              onClick={() => setMobileOpen(true)}
              className="menu-button"
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box className="navbar-brand" onClick={() => handleNavigation('/')}>
            <SchoolIcon className="logo-icon" />
            <Typography variant="h6" className="brand-text">
              CampusConnect
            </Typography>
          </Box>

          {!isMobile && (
            <Box className="nav-links">
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`nav-button ${location.pathname === item.path ? 'active' : ''}`}
                  startIcon={item.icon}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ flexGrow: 1 }} />

          <Box className="nav-actions">
            <Tooltip title="Notifications">
              <IconButton
                color="inherit"
                onClick={(e) => setNotificationsAnchor(e.currentTarget)}
              >
                <Badge badgeContent={notifications.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Avatar
              onClick={(e) => setUserMenuAnchor(e.currentTarget)}
              className="user-avatar"
            >
              {user?.name?.[0] || 'U'}
            </Avatar>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        className="mobile-drawer"
      >
        <Box className="drawer-header">
          <Box className="drawer-profile">
            <Avatar className="drawer-avatar">
              {user?.name?.[0] || 'U'}
            </Avatar>
            <Typography variant="h6">{user?.name || 'User'}</Typography>
            <Typography variant="body2" color="textSecondary">
              {user?.email || 'user@example.com'}
            </Typography>
          </Box>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={location.pathname === item.path ? 'active' : ''}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchor}
        open={Boolean(notificationsAnchor)}
        onClose={() => setNotificationsAnchor(null)}
        className="notifications-menu"
      >
        {notifications.map((notification) => (
          <MenuItem
            key={notification.id}
            onClick={() => setNotificationsAnchor(null)}
            className="notification-item"
          >
            {notification.type === 'event' ? <EventIcon /> : <ChatIcon />}
            <Typography variant="body2">{notification.message}</Typography>
          </MenuItem>
        ))}
      </Menu>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={() => setUserMenuAnchor(null)}
        className="user-menu"
      >
        <MenuItem onClick={() => handleNavigation('/profile')}>
          <ListItemIcon><ProfileIcon fontSize="small" /></ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => handleNavigation('/settings')}>
          <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleNavigation('/login')}>
          <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Navbar; 