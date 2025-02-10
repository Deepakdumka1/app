import React, { useState } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Button, 
  Select, 
  MenuItem, 
  TextField,
  Box 
} from '@mui/material';
import './Forum.css';

const SUBJECTS = ['All', 'Math', 'CS', 'Biology', 'Physics', 'Chemistry'];

const Forum = () => {
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [questions] = useState([
    {
      id: 1,
      title: "How to solve quadratic equations?",
      subject: "Math",
      content: "I'm struggling with quadratic equations. Can someone explain the steps?",
      votes: 15,
      answers: 3,
    },
    {
      id: 2,
      title: "Understanding React Hooks",
      subject: "CS",
      content: "What's the difference between useState and useEffect?",
      votes: 20,
      answers: 5,
    }
  ]);

  return (
    <Container className="forum-container">
      <Typography variant="h4" component="h1" gutterBottom>
        Discussion Forum & Q&A
      </Typography>
      
      <Box className="forum-actions">
        <Button variant="contained" color="primary">
          Ask a Question
        </Button>
        <Select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="subject-select"
        >
          {SUBJECTS.map((subject) => (
            <MenuItem key={subject} value={subject}>
              {subject}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Grid container spacing={3} className="questions-grid">
        {questions
          .filter(q => selectedSubject === 'All' || q.subject === selectedSubject)
          .map((question) => (
            <Grid item xs={12} key={question.id}>
              <Paper className="question-card">
                <Box className="question-votes">
                  <Button>▲</Button>
                  <Typography>{question.votes}</Typography>
                  <Button>▼</Button>
                </Box>
                <Box className="question-content">
                  <Typography variant="h6">{question.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {question.subject} • {question.answers} answers
                  </Typography>
                  <Typography variant="body1">
                    {question.content}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
      </Grid>
    </Container>
  );
};

export default Forum; 