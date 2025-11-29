
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Box
      sx={{
        flexGrow: 1, // Allow the box to grow and fill the space
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Box maxWidth="md">
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          color="primary"
          sx={{ fontSize: { xs: '2.5rem', md: '4rem' }, fontWeight: 700 }}
        >
          Enhance Your Home, Increase Its Value
        </Typography>
        <Typography
          variant="h5"
          component="p"
          gutterBottom
          color="textSecondary"
          sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' }, mb: 4 }}
        >
          Discover ideas and get personalized recommendations to make your home more attractive and valuable.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/recommendations"
          sx={{ py: 1.5, px: 5, fontSize: '1.1rem', borderRadius: '50px' }}
        >
          Get Started
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
