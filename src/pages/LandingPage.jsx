
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import { CheckCircleOutline, Palette, Build, People } from '@mui/icons-material';

const features = [
  {
    icon: <CheckCircleOutline fontSize="large" color="primary" />,
    title: 'Personalized Recommendations',
    description: 'Get project ideas and material suggestions tailored to your home and budget.',
  },
  {
    icon: <Palette fontSize="large" color="primary" />,
    title: 'Visualize Your Project',
    description: 'Use our tools to see how different materials and colors will look in your space.',
  },
  {
    icon: <Build fontSize="large" color="primary" />,
    title: 'Expert Advice',
    description: 'Access a wealth of articles, guides, and tips from renovation experts.',
  },
  {
    icon: <People fontSize="large" color="primary" />,
    title: 'Connect with Professionals',
    description: 'Find and hire top-rated contractors and designers in your area.',
  },
];

const testimonials = [
  {
    name: 'Jordan M.',
    text: 'NextGenHome made our kitchen renovation a breeze! The recommendations were spot on, and we found the perfect contractor through the platform.',
    avatar: 'J',
  },
  {
    name: 'Casey L.',
    text: "I was completely lost on where to start with my bathroom remodel. This app gave me the direction and confidence I needed.",
    avatar: 'C',
  },
  {
    name: 'Alex R.',
    text: "A must-have for any homeowner. The project planning tools are incredibly helpful for staying on budget and on schedule.",
    avatar: 'A',
  },
];

const LandingPage = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          px: 2,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(https://images.pexels.com/photos/276554/pexels-photo-276554.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.4)',
            zIndex: -1,
          }}
        />
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Reimagine Your Home
          </Typography>
          <Typography variant="h5" color="inherit" paragraph sx={{ mb: 4 }}>
            Your ultimate partner in discovering, planning, and executing home renovations.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={Link}
            to="/auth"
            sx={{ 
                py: 1.5, 
                px: 4, 
                fontSize: '1.2rem', 
                borderRadius: '50px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
          >
            Get Started
          </Button>
        </Container>
      </Box>

      {/* Key Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ mb: 6, fontWeight: 'bold' }}>
          Why Choose NextGenHome?
        </Typography>
        <Grid container spacing={5} justifyContent="center">
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index} sx={{ textAlign: 'center' }}>
              <Box sx={{ mb: 2 }}>{feature.icon}</Box>
              <Typography variant="h6" gutterBottom>{feature.title}</Typography>
              <Typography color="text.secondary">{feature.description}</Typography>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ backgroundColor: '#f5f5f5', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" gutterBottom sx={{ mb: 6, fontWeight: 'bold' }}>
            Simple Steps to Your Dream Home
          </Typography>
          <Grid container spacing={4} alignItems="center">
             <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                 <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
                    <Typography variant="h1" color="primary">1</Typography>
                    <Typography variant="h6">Create Your Profile</Typography>
                    <Typography>Tell us about your home, style, and project goals.</Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                 <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
                    <Typography variant="h1" color="primary">2</Typography>
                    <Typography variant="h6">Get Inspired</Typography>
                    <Typography>Browse personalized recommendations and save your favorites.</Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                 <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
                    <Typography variant="h1" color="primary">3</Typography>
                    <Typography variant="h6">Plan & Execute</Typography>
                    <Typography>Use our tools to plan your budget and timeline, then connect with pros.</Typography>
                </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ mb: 6, fontWeight: 'bold' }}>
          What Our Users Say
        </Typography>
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%', p: 2, boxShadow: 3, borderRadius: 2 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, margin: '0 auto 16px' }}>
                    {testimonial.avatar}
                  </Avatar>
                  <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2 }}>
                    "{testimonial.text}"
                  </Typography>
                  <Typography variant="h6" color="text.primary">- {testimonial.name}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

       {/* Call to Action Section */}
        <Box sx={{ backgroundColor: 'primary.main', color: 'white', py: 8, textAlign: 'center' }}>
            <Container maxWidth="md">
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Ready to Start Your Renovation Journey?</Typography>
                <Typography variant="subtitle1" sx={{ mb: 4 }}>Sign up now and take the first step towards a home you'll love even more.</Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    component={Link}
                    to="/auth"
                    sx={{ 
                        py: 1.5, 
                        px: 4, 
                        fontSize: '1.2rem',
                        borderRadius: '50px',
                        color: 'primary.main',
                        fontWeight: 'bold'
                    }}
                >
                    Sign Up for Free
                </Button>
            </Container>
        </Box>
    </Box>
  );
};

export default LandingPage;
