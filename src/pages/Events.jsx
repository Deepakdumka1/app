import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  IconButton,
  Box,
  Dialog,
  TextField,
  MenuItem,
  Chip,
  Badge,
  Tooltip,
  Alert,
  Snackbar,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  Add as AddIcon,
  Notifications as NotificationIcon,
  Event as EventIcon,
  VideoCall as WebinarIcon,
  School as WorkshopIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
  People as AttendeesIcon
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateCalendar, TimePicker } from '@mui/x-date-pickers';
import { format, isSameDay, isAfter, isBefore } from 'date-fns';
import './Events.css';

const EVENT_TYPES = {
  COLLEGE: { label: 'College Event', icon: <EventIcon /> },
  WEBINAR: { label: 'Webinar', icon: <WebinarIcon /> },
  WORKSHOP: { label: 'Workshop', icon: <WorkshopIcon /> }
};

const Events = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    type: 'COLLEGE',
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    location: '',
    capacity: '',
    registrationDeadline: new Date(),
    tags: []
  });

  // Simulated events data
  useEffect(() => {
    setEvents([
      {
        id: 1,
        title: 'Machine Learning Workshop',
        description: 'Learn the basics of ML with hands-on exercises',
        type: 'WORKSHOP',
        date: new Date(),
        startTime: new Date().setHours(10, 0),
        endTime: new Date().setHours(12, 0),
        location: 'Room 101',
        capacity: 30,
        registeredCount: 25,
        tags: ['AI', 'Technology'],
        registrationDeadline: new Date().setDate(new Date().getDate() + 2)
      }
      // Add more events...
    ]);
  }, []);

  // Check for upcoming events and send notifications
  useEffect(() => {
    const checkUpcomingEvents = () => {
      const upcomingEvent = events.find(event => {
        const timeUntilEvent = new Date(event.startTime) - new Date();
        return timeUntilEvent > 0 && timeUntilEvent <= 30 * 60 * 1000; // 30 minutes
      });

      if (upcomingEvent) {
        setNotification({
          message: `Upcoming event: ${upcomingEvent.title} starts in 30 minutes!`,
          severity: 'info'
        });
      }
    };

    const interval = setInterval(checkUpcomingEvents, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [events]);

  const handleCreateEvent = () => {
    setEvents(prev => [...prev, { ...newEvent, id: Date.now() }]);
    setCreateDialogOpen(false);
    setNotification({
      message: 'Event created successfully!',
      severity: 'success'
    });
  };

  const handleRegister = (eventId) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, registeredCount: (event.registeredCount || 0) + 1 }
        : event
    ));
    setNotification({
      message: 'Successfully registered for the event!',
      severity: 'success'
    });
  };

  const getEventsByDate = (date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };

  const renderEventCard = (event) => (
    <Paper key={event.id} className="event-card">
      <Box className="event-header">
        <Box className="event-type-icon">
          {EVENT_TYPES[event.type].icon}
        </Box>
        <Typography variant="h6" className="event-title">
          {event.title}
        </Typography>
        {event.registeredCount < event.capacity && (
          <Chip 
            label="Registration Open" 
            color="success" 
            size="small"
            className="registration-status" 
          />
        )}
      </Box>

      <Typography variant="body2" className="event-description">
        {event.description}
      </Typography>

      <Box className="event-details">
        <Box className="detail-item">
          <TimeIcon fontSize="small" />
          <Typography variant="body2">
            {format(new Date(event.startTime), 'hh:mm a')} - 
            {format(new Date(event.endTime), 'hh:mm a')}
          </Typography>
        </Box>
        <Box className="detail-item">
          <LocationIcon fontSize="small" />
          <Typography variant="body2">{event.location}</Typography>
        </Box>
        <Box className="detail-item">
          <AttendeesIcon fontSize="small" />
          <Typography variant="body2">
            {event.registeredCount || 0}/{event.capacity} registered
          </Typography>
        </Box>
      </Box>

      <Box className="event-tags">
        {event.tags.map(tag => (
          <Chip
            key={tag}
            label={tag}
            size="small"
            className="event-tag"
          />
        ))}
      </Box>

      <Box className="event-actions">
        <Typography variant="caption" color="textSecondary">
          Registration deadline: {format(new Date(event.registrationDeadline), 'MMM dd, yyyy')}
        </Typography>
        <Button
          variant="contained"
          onClick={() => handleRegister(event.id)}
          disabled={
            event.registeredCount >= event.capacity ||
            isAfter(new Date(), new Date(event.registrationDeadline))
          }
          className="register-button"
        >
          Register
        </Button>
      </Box>
    </Paper>
  );

  // Add Create Event Dialog content
  const renderCreateEventDialog = () => (
    <Dialog
      open={createDialogOpen}
      onClose={() => setCreateDialogOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Create New Event</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Event Title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            fullWidth
            required
          />
          <TextField
            label="Description"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            multiline
            rows={3}
            fullWidth
          />
          <TextField
            select
            label="Event Type"
            value={newEvent.type}
            onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
            fullWidth
          >
            {Object.entries(EVENT_TYPES).map(([key, { label }]) => (
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ))}
          </TextField>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateCalendar
              value={newEvent.date}
              onChange={(date) => setNewEvent({ ...newEvent, date })}
            />
            <TimePicker
              label="Start Time"
              value={newEvent.startTime}
              onChange={(time) => setNewEvent({ ...newEvent, startTime: time })}
            />
            <TimePicker
              label="End Time"
              value={newEvent.endTime}
              onChange={(time) => setNewEvent({ ...newEvent, endTime: time })}
            />
          </LocalizationProvider>
          <TextField
            label="Location"
            value={newEvent.location}
            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
            fullWidth
          />
          <TextField
            label="Capacity"
            type="number"
            value={newEvent.capacity}
            onChange={(e) => setNewEvent({ ...newEvent, capacity: e.target.value })}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleCreateEvent}
          className="create-button"
        >
          Create Event
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Container maxWidth="lg" className="events-container">
      <Box className="events-header">
        <Typography variant="h4" className="page-title">
          Event Calendar & Announcements
        </Typography>
        <Box className="header-actions">
          <Tooltip title="Notifications">
            <IconButton onClick={() => setNotificationsOpen(true)}>
              <Badge badgeContent={2} color="error">
                <NotificationIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
            className="create-button"
          >
            Create Event
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper className="calendar-paper">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateCalendar
                value={selectedDate}
                onChange={setSelectedDate}
                renderDay={(day, selectedDates, pickersDayProps) => {
                  const hasEvents = events.some(event => 
                    isSameDay(new Date(event.date), day)
                  );
                  return (
                    <Badge
                      key={day.toString()}
                      overlap="circular"
                      badgeContent={hasEvents ? '•' : undefined}
                      color="primary"
                    >
                      <div {...pickersDayProps} />
                    </Badge>
                  );
                }}
              />
            </LocalizationProvider>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Box className="events-list">
            {getEventsByDate(selectedDate).length > 0 ? (
              getEventsByDate(selectedDate).map(renderEventCard)
            ) : (
              <Paper className="no-events">
                <Typography variant="h6" color="textSecondary">
                  No events scheduled for this date
                </Typography>
              </Paper>
            )}
          </Box>
        </Grid>
      </Grid>

      {renderCreateEventDialog()}

      <Snackbar
        open={!!notification}
        autoHideDuration={6000}
        onClose={() => setNotification(null)}
      >
        <Alert 
          severity={notification?.severity}
          onClose={() => setNotification(null)}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Events; 