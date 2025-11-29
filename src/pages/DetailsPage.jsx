
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Chip,
  Button,
  CardMedia,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { NotificationContext } from '../context/NotificationContext';
import renovatedPropertiesData from '../data/renovatedProperties.json';

// Helper to get cost from project tags
const getCostFromTags = (tags) => {
  if (!tags) return 'N/A';
  const costTag = tags.find(tag => tag.includes('-') || tag.match(/^\d+$/));
  if (!costTag) return 'N/A';
  if (costTag.includes('-')) {
      const [min, max] = costTag.split('-');
      return `$${Number(min).toLocaleString()} - $${Number(max).toLocaleString()}`;
  }
  return `Over $${Number(costTag).toLocaleString()}`;
};

// Placeholder for items needed for projects
const getProjectItems = (title) => {
    if (title.toLowerCase().includes('kitchen')) {
        return ['Modular Cabinets', 'Granite Countertop', 'Chimney', 'Smart Hub'];
    }
    if (title.toLowerCase().includes('living room')) {
        return ['Sofa Set', 'Center Table', 'TV Unit', 'Ambient Lighting'];
    }
    if (title.toLowerCase().includes('bathroom')) {
        return ['Vanity', 'Walk-in Shower Glass', 'Premium Tiles', 'Exhaust Fan'];
    }
    return ['Paint', 'Lighting Fixtures', 'Flooring', 'Decor Accents'];
};


const DetailsPage = () => {
  const { id } = useParams();
  const { showNotification } = useContext(NotificationContext);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      setItem(null); // Reset item state on new fetch
      try {
        // Try fetching from Firestore recommendations first
        const recDocRef = doc(db, 'recommendations', id);
        const recDocSnap = await getDoc(recDocRef);

        if (recDocSnap.exists()) {
          const data = recDocSnap.data();
          setItem({
            id: recDocSnap.id,
            ...data,
            type: 'recommendation',
            items: data.itemsNeeded || ['Item details not available'], // Use itemsNeeded field
          });
        } else {
          // Fallback to local JSON data for projects
          // Using == for type coercion just in case
          const project = renovatedPropertiesData.find(p => p.id == id);
          if (project) {
            setItem({
              ...project,
              type: 'project',
              cost: getCostFromTags(project.tags),
              items: getProjectItems(project.title),
            });
          } else {
            showNotification('The requested item could not be found.', 'error');
          }
        }
      } catch (error) {
        console.error("Error fetching item details: ", error);
        showNotification('There was an error fetching the details.', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItem();
    }
  }, [id, showNotification]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!item) {
    return (
      <Typography variant="h5" align="center" sx={{ mt: 5, color: 'text.secondary' }}>
        Item details are not available.
      </Typography>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              image={item.image || 'https://via.placeholder.com/600x400'}
              alt={item.title}
              sx={{ borderRadius: 2, width: '100%', height: 'auto' }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>{item.title}</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>{item.description || 'No description available.'}</Typography>

            <Typography variant="h5" sx={{ mt: 3, fontWeight: '500' }}><strong>Estimated Cost:</strong> {item.cost}</Typography>
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>Items & Inclusions</Typography>
              <List>
                {item.items && item.items.map((neededItem, index) => (
                  <ListItem key={index} disableGutters>
                    <ListItemIcon sx={{minWidth: '40px'}}>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={neededItem} />
                  </ListItem>
                ))}
              </List>
            </Box>

            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                <Button variant="contained" color="primary" size="large">
                    {item.type === 'recommendation' ? 'Request a Consultation' : 'Enquire Now'}
                </Button>
                 <Button variant="outlined" color="primary" size="large">
                    View Gallery
                </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default DetailsPage;
