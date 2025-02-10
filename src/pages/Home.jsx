import React, { useState } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Button, 
  Box, 
  Card, 
  CardContent,
  CardMedia,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Forum as ForumIcon,
  Group as GroupIcon,
  VideoCall as VideoCallIcon,
  CloudUpload as CloudUploadIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  Search as SearchIcon,
  Tag as TagIcon,
  Code as CodeIcon,
  WebAsset as WebSocketIcon,
  Storage as StorageIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import Navbar from '../components/layout/Navbar';
import ScrollToTop from '../components/common/ScrollToTop';
import AnimatedCounter from '../components/common/AnimatedCounter';
import useStats from '../hooks/useStats';

const features = [
  {
    icon: <ForumIcon fontSize="large" />,
    title: "Real-time Chat & Study Groups",
    description: "One-on-one messaging and group chats with WebSocket integration for real-time updates.",
    techStack: "WebSocket + Socket.io, React",
    key: 'chat'
  },
  {
    icon: <GroupIcon fontSize="large" />,
    title: "Subject-based Groups",
    description: "Create and join study groups organized by subjects or topics with easy categorization.",
    techStack: "React + Redux",
    key: 'groups'
  },
  {
    icon: <CloudUploadIcon fontSize="large" />,
    title: "Resource Sharing",
    description: "Upload and share PDFs, notes, and presentations with document preview functionality.",
    techStack: "AWS S3 / Firebase Storage",
    key: 'resources'
  },
  {
    icon: <VideoCallIcon fontSize="large" />,
    title: "Video Calls",
    description: "Integrated voice and video calls for real-time collaboration and discussions.",
    techStack: "WebRTC + Socket.io",
    key: 'video'
  },
  {
    icon: <SearchIcon fontSize="large" />,
    title: "Smart Search",
    description: "Advanced search functionality for easy access to resources and study materials.",
    techStack: "Django REST API"
  },
  {
    icon: <TagIcon fontSize="large" />,
    title: "Tagging System",
    description: "Organize and find resources with a comprehensive tagging and categorization system.",
    techStack: "Express.js + MongoDB"
  }
];

const Home = () => {
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);
  const stats = useStats();

  const handleFeatureClick = (feature) => {
    if (!showDemo) {
      setShowDemo(true);
    }
    // Navigate to feature demo or show modal
    switch (feature) {
      case 'chat':
        navigate('/chat');
        break;
      case 'video':
        navigate('/video-demo');
        break;
      case 'resources':
        navigate('/resources');
        break;
      default:
        break;
    }
  };

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <>
      <Navbar />
      <div className="home-container">
        {/* Hero Section */}
        <Box className="hero-section">
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h2" className="hero-title" gutterBottom>
                  Connect. Learn.
                  <span className="gradient-text"> Excel.</span>
                </Typography>
                <Typography variant="h5" className="hero-subtitle" paragraph>
                  Your all-in-one platform for collaborative learning and academic success.
                </Typography>
                <Button 
                  variant="contained" 
                  size="large" 
                  className="get-started-btn"
                  onClick={handleGetStarted}
                >
                  Get Started
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box className="hero-image-container">
                  <div className="floating-card card1">
                    <ForumIcon /> Live Discussions
                  </div>
                  <div className="floating-card card2">
                    <VideoCallIcon /> Video Calls
                  </div>
                  <div className="floating-card card3">
                    <CloudUploadIcon /> File Sharing
                  </div>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Features Section with interactive cards */}
        <Container maxWidth="lg" className="features-section">
          <Typography variant="h3" align="center" gutterBottom className="section-title">
            Powerful Features
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  className="feature-card"
                  onClick={() => handleFeatureClick(feature.key)}
                >
                  <CardContent>
                    <IconButton className="feature-icon">
                      {feature.icon}
                    </IconButton>
                    <Typography variant="h6" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {feature.description}
                    </Typography>
                    <Typography variant="caption" className="tech-stack">
                      Tech Stack: {feature.techStack}
                    </Typography>
                    <Button 
                      variant="contained" 
                      color="primary"
                      className="feature-demo-btn"
                    >
                      Try Demo
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Stats Section */}
        <Box className="stats-section">
          <Container maxWidth="lg">
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} sm={4}>
                <Card className="stats-card">
                  <CardContent>
                    <AnimatedCounter 
                      end={stats.users} 
                      suffix="+" 
                    />
                    <Typography variant="h6">
                      Active Users
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card className="stats-card">
                  <CardContent>
                    <AnimatedCounter 
                      end={stats.groups} 
                      suffix="+" 
                    />
                    <Typography variant="h6">
                      Study Groups
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card className="stats-card">
                  <CardContent>
                    <Typography variant="h3" className="gradient-text">
                      {stats.resources}
                    </Typography>
                    <Typography variant="h6">
                      Support
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Technical Overview Section */}
        <Box className="tech-section">
          <Container maxWidth="lg">
            <Typography variant="h3" align="center" gutterBottom className="section-title">
              Technical Overview
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card className="tech-card">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Frontend Stack
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon><CodeIcon /></ListItemIcon>
                        <ListItemText primary="React + Redux/Vue + Vuex" secondary="State management and UI components" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><WebSocketIcon /></ListItemIcon>
                        <ListItemText primary="WebSocket Integration" secondary="Real-time communication" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><StorageIcon /></ListItemIcon>
                        <ListItemText primary="File Handling" secondary="Upload and preview functionality" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card className="tech-card">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Backend Stack
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon><StorageIcon /></ListItemIcon>
                        <ListItemText primary="AWS S3 / Firebase Storage" secondary="Cloud storage for resources" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CodeIcon /></ListItemIcon>
                        <ListItemText primary="Django REST API / Express.js" secondary="Backend API and business logic" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><SecurityIcon /></ListItemIcon>
                        <ListItemText primary="Authentication & Security" secondary="User management and data protection" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </div>
      <ScrollToTop />
    </>
  );
};

export default Home; 