
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { NotificationContext } from '../context/NotificationContext';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import renovatedPropertiesData from '../data/renovatedProperties.json';

const UserPanel = () => {
  const { showNotification } = useContext(NotificationContext);
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [filteredRecs, setFilteredRecs] = useState([]);
  const [renovatedProperties, setRenovatedProperties] = useState([]);
  const [filteredRenovated, setFilteredRenovated] = useState([]);

  const [costFilter, setCostFilter] = useState('');
  const [sqYardFilter, setSqYardFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsubscribeRecs = onSnapshot(
      collection(db, 'recommendations'),
      (snapshot) => {
        const recsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setRecommendations(recsData);
        setFilteredRecs(recsData);
      },
      (error) => {
        console.error('Error fetching recommendations: ', error);
        showNotification('Error fetching recommendations.', 'error');
      }
    );

    setRenovatedProperties(renovatedPropertiesData);
    setFilteredRenovated(renovatedPropertiesData);

    return () => unsubscribeRecs();
  }, [showNotification]);

  useEffect(() => {
    let filtered = recommendations.filter(rec => 
        rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (costFilter) {
      const [min, max] = costFilter.split('-').map(Number);
      filtered = filtered.filter((rec) => {
        if (!rec.cost) return false;
        const costValue = parseInt(rec.cost.replace(/[^0-9]/g, ''));
        return costValue >= min && (max ? costValue <= max : true);
      });
    }
    setFilteredRecs(filtered);

    let filteredRenovatedProps = renovatedProperties.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (sqYardFilter) {
      const [min, max] = sqYardFilter.split('-').map(Number);
      filteredRenovatedProps = filteredRenovatedProps.filter((p) => {
        return p.sq_yard >= min && (max ? p.sq_yard <= max : true);
      });
    }
    setFilteredRenovated(filteredRenovatedProps);
  }, [costFilter, sqYardFilter, searchQuery, recommendations, renovatedProperties]);

  const handleViewDetails = (id) => {
    navigate(`/details/${id}`);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 4, backgroundColor: '#f9f9f9' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" color="text.primary" sx={{ mb: 4 }}>
        User Dashboard
      </Typography>

      <Paper sx={{ p: 3, mb: 5, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>Available Services</Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Search Services"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start"><SearchIcon /></InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Filter by Cost</InputLabel>
              <Select value={costFilter} label="Filter by Cost" onChange={(e) => setCostFilter(e.target.value)}>
                <MenuItem value=""><em>All</em></MenuItem>
                <MenuItem value="0-15000">Under $150</MenuItem>
                <MenuItem value="15000-50000">$150 - $500</MenuItem>
                <MenuItem value="50000-100000">$500 - $1,000</MenuItem>
                <MenuItem value="100000">Over $1,000</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={4}>
          {filteredRecs.map((rec) => (
            <Grid item key={rec.id} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2, boxShadow: 1, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.03)' } }}>
                <CardMedia component="img" height="160" image={rec.image || 'https://via.placeholder.com/300'} alt={rec.title} />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6">{rec.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{rec.description}</Typography>
                  <Chip label={`Cost: ${rec.cost}`} sx={{ mt: 1, backgroundColor: '#e3f2fd' }} />
                </CardContent>
                 <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" color="primary" onClick={() => handleViewDetails(rec.id)}>Get a Quote</Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>Previously Completed Projects</Typography>
        <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
          <InputLabel>Filter by Square Yards</InputLabel>
          <Select value={sqYardFilter} label="Filter by Square Yards" onChange={(e) => setSqYardFilter(e.target.value)}>
            <MenuItem value=""><em>All</em></MenuItem>
            <MenuItem value="0-100">0-100 sq yards</MenuItem>
            <MenuItem value="101-500">101-500 sq yards</MenuItem>
            <MenuItem value="501">501+ sq yards</MenuItem>
          </Select>
        </FormControl>
        <Grid container spacing={4}>
          {filteredRenovated.map((prop) => (
            <Grid item key={prop.id} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2, boxShadow: 1, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.03)' } }}>
                <CardMedia component="img" height="160" image={prop.image} alt={prop.title} />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6">{prop.title}</Typography>
                  <Chip label={`Sq. Yards: ${prop.sq_yard}`} sx={{ mt: 1, backgroundColor: '#e8f5e9' }} />
                </CardContent>
                 <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" onClick={() => handleViewDetails(prop.id)}>View Project</Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default UserPanel;
