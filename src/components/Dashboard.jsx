// src/components/Dashboard.jsx
import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  LocationOn,
  Wc,
  CalendarToday,
} from '@mui/icons-material';

function Dashboard({ user }) {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    // You can fetch additional user details here if needed
    setUserDetails(user);
  }, [user]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Profile Section */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: 'primary.main',
                mb: 2,
              }}
            >
              {userDetails?.firstName?.charAt(0)}
            </Avatar>
            <Typography variant="h5" gutterBottom>
              {`${userDetails?.firstName} ${userDetails?.lastName}`}
            </Typography>
            <Button variant="contained" color="primary" sx={{ mt: 2 }}>
              Edit Profile
            </Button>
          </Paper>
        </Grid>

        {/* User Details Section */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Email />
                </ListItemIcon>
                <ListItemText
                  primary="Email"
                  secondary={userDetails?.email}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <Phone />
                </ListItemIcon>
                <ListItemText
                  primary="Mobile"
                  secondary={userDetails?.mobile}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <LocationOn />
                </ListItemIcon>
                <ListItemText
                  primary="Location"
                  secondary={userDetails?.location}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <Wc />
                </ListItemIcon>
                <ListItemText
                  primary="Gender"
                  secondary={userDetails?.gender}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <CalendarToday />
                </ListItemIcon>
                <ListItemText
                  primary="Date of Birth"
                  secondary={userDetails?.dob ? new Date(userDetails.dob).toLocaleDateString() : 'Not set'}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Activity Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            {/* Add recent activity content here */}
            <Typography color="text.secondary">
              No recent activity to display
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;