
import React, { useState, useEffect, useContext } from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  Box,
  IconButton,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { Edit, Delete, Save, Cancel, Add } from '@mui/icons-material';
import { NotificationContext } from '../context/NotificationContext';
import { db } from '../firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  onSnapshot,
} from 'firebase/firestore';

const AdminPanel = () => {
  const { showNotification } = useContext(NotificationContext);
  const [recommendations, setRecommendations] = useState([]);
  const [userSubmissions, setUserSubmissions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedRec, setEditedRec] = useState({});
  const [newRec, setNewRec] = useState({
    title: '',
    description: '',
    image: '',
    cost: '',
    category: '',
    size: '',
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ open: false, id: null });

  useEffect(() => {
    const qRecs = query(collection(db, 'recommendations'));
    const unsubscribeRecs = onSnapshot(
      qRecs,
      (querySnapshot) => {
        const recsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setRecommendations(recsData);
      },
      (error) => {
        console.error('Error fetching recommendations: ', error);
        showNotification('Error fetching recommendations.', 'error');
      }
    );

    const qSubs = query(collection(db, 'userSubmissions'));
    const unsubscribeSubs = onSnapshot(
      qSubs,
      (querySnapshot) => {
        const subsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUserSubmissions(subsData);
      },
      (error) => {
        console.error('Error fetching submissions: ', error);
        showNotification('Error fetching submissions.', 'error');
      }
    );

    return () => {
      unsubscribeRecs();
      unsubscribeSubs();
    };
  }, [showNotification]);

  const handleEdit = (rec) => {
    setEditingId(rec.id);
    setEditedRec({ ...rec });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedRec({});
  };

  const handleSave = async (id) => {
    const recDocRef = doc(db, 'recommendations', id);
    try {
      await updateDoc(recDocRef, editedRec);
      setEditingId(null);
      showNotification('Recommendation saved successfully!');
    } catch (error) {
      console.error('Error updating document: ', error);
      showNotification('Error saving recommendation.', 'error');
    }
  };

  const handleDelete = (id) => {
    setDeleteConfirmation({ open: true, id });
  };

  const confirmDelete = async () => {
    const { id } = deleteConfirmation;
    const recDocRef = doc(db, 'recommendations', id);
    try {
      await deleteDoc(recDocRef);
      showNotification('Recommendation deleted.', 'warning');
    } catch (error) {
      console.error('Error deleting document: ', error);
      showNotification('Error deleting recommendation.', 'error');
    }
    setDeleteConfirmation({ open: false, id: null });
  };

  const handleAddChange = (e) => {
    setNewRec({ ...newRec, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (newRec.title && newRec.description && newRec.cost && newRec.category && newRec.size) {
      try {
        await addDoc(collection(db, 'recommendations'), newRec);
        showNotification('New recommendation added!');
        setNewRec({ title: '', description: '', image: '', cost: '', category: '', size: '' });
        setIsFormVisible(false);
      } catch (error) {
        console.error('Error adding document: ', error);
        showNotification('Error adding recommendation.', 'error');
      }
    } else {
      showNotification('Please fill in all fields.', 'error');
    }
  };

  return (
    <Box sx={{ flexGrow: 1, width: '100%', py: 5, px: 4, backgroundColor: '#f9f9f9' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" color="text.primary">
          Admin Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => setIsFormVisible(!isFormVisible)}
        >
          {isFormVisible ? 'Hide Form' : 'Add Recommendation'}
        </Button>
      </Box>

      {isFormVisible && (
        <Paper sx={{ p: 4, mb: 5, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h5" gutterBottom>Add New Recommendation</Typography>
          <Box component="form" onSubmit={handleAdd}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}><TextField name="title" label="Title" value={newRec.title} onChange={handleAddChange} fullWidth required /></Grid>
                <Grid item xs={12} sm={6}><TextField name="cost" label="Cost (e.g., $500 - $1,000)" value={newRec.cost} onChange={handleAddChange} fullWidth required /></Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                        <InputLabel>Category</InputLabel>
                        <Select name="category" value={newRec.category} onChange={handleAddChange} label="Category">
                            <MenuItem value="Kitchen">Kitchen</MenuItem>
                            <MenuItem value="Living Room">Living Room</MenuItem>
                            <MenuItem value="Bathroom">Bathroom</MenuItem>
                            <MenuItem value="Exterior">Exterior</MenuItem>
                            <MenuItem value="General">General</MenuItem>
                            <MenuItem value="Balcony">Balcony</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                        <InputLabel>Size</InputLabel>
                        <Select name="size" value={newRec.size} onChange={handleAddChange} label="Size">
                            <MenuItem value="Small">Small</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="Large">Large</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}><TextField name="description" label="Description" value={newRec.description} onChange={handleAddChange} fullWidth required multiline rows={4} /></Grid>
                <Grid item xs={12}><TextField name="image" label="Image URL (optional)" value={newRec.image} onChange={handleAddChange} fullWidth /></Grid>
            </Grid>
            <Button type="submit" variant="contained" sx={{ mt: 3 }}>Add Recommendation</Button>
          </Box>
        </Paper>
      )}

      <Typography variant="h5" component="h2" color="text.primary" sx={{ mb: 3 }}>Manage Recommendations</Typography>
      <Grid container spacing={4}>
        {recommendations.map((rec) => (
          <Grid item key={rec.id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2, boxShadow: 3 }}>
                <CardMedia component="img" height="180" image={editingId === rec.id ? editedRec.image : rec.image || 'https://via.placeholder.com/300x180'} alt={rec.title} />
                <CardContent sx={{ flexGrow: 1 }}>
                    {editingId === rec.id ? (
                        <>
                            <TextField label="Title" value={editedRec.title} onChange={(e) => setEditedRec({ ...editedRec, title: e.target.value })} fullWidth margin="dense" />
                            <TextField label="Cost" value={editedRec.cost} onChange={(e) => setEditedRec({ ...editedRec, cost: e.target.value })} fullWidth margin="dense" />
                            <FormControl fullWidth margin="dense">
                                <InputLabel>Category</InputLabel>
                                <Select value={editedRec.category} onChange={(e) => setEditedRec({ ...editedRec, category: e.target.value })} label="Category">
                                    <MenuItem value="Kitchen">Kitchen</MenuItem>
                                    <MenuItem value="Living Room">Living Room</MenuItem>
                                    <MenuItem value="Bathroom">Bathroom</MenuItem>
                                    <MenuItem value="Exterior">Exterior</MenuItem>
                                    <MenuItem value="General">General</MenuItem>
                                    <MenuItem value="Balcony">Balcony</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth margin="dense">
                                <InputLabel>Size</InputLabel>
                                <Select value={editedRec.size} onChange={(e) => setEditedRec({ ...editedRec, size: e.target.value })} label="Size">
                                    <MenuItem value="Small">Small</MenuItem>
                                    <MenuItem value="Medium">Medium</MenuItem>
                                    <MenuItem value="Large">Large</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField label="Description" value={editedRec.description} onChange={(e) => setEditedRec({ ...editedRec, description: e.target.value })} fullWidth margin="dense" multiline rows={4} />
                            <TextField label="Image URL" value={editedRec.image} onChange={(e) => setEditedRec({ ...editedRec, image: e.target.value })} fullWidth margin="dense" />
                        </>
                    ) : (
                        <>
                            <Typography gutterBottom variant="h5">{rec.title}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{rec.description}</Typography>
                            <Box sx={{ p: 1.5, backgroundColor: '#f5f5f5', borderRadius: '8px', mb: 2 }}>
                                <Typography variant="body1" sx={{ mb: 1 }}><strong>Cost:</strong> {rec.cost}</Typography>
                                <Chip label={rec.category} size="small" sx={{ mr: 1, backgroundColor: '#e3f2fd' }} />
                                <Chip label={rec.size} size="small" sx={{ backgroundColor: '#e8f5e9' }} />
                            </Box>
                        </>
                    )}
                </CardContent>
                <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    {editingId === rec.id ? (
                        <>
                            <IconButton onClick={() => handleSave(rec.id)} color="primary"><Save /></IconButton>
                            <IconButton onClick={handleCancel}><Cancel /></IconButton>
                        </>
                    ) : (
                        <>
                            <IconButton onClick={() => handleEdit(rec)} color="primary"><Edit /></IconButton>
                            <IconButton onClick={() => handleDelete(rec.id)} color="error"><Delete /></IconButton>
                        </>
                    )}
                </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={deleteConfirmation.open} onClose={() => setDeleteConfirmation({ open: false, id: null })}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this recommendation? This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmation({ open: false, id: null })}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      <Paper sx={{ p: 4, mt: 5, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom>User Submissions</Typography>
        {userSubmissions.length > 0 ? (
          userSubmissions.map((sub) => (
            <Card key={sub.id} sx={{ mb: 2, p: 2, boxShadow: 1 }}>
              <CardContent>
                <Typography><strong>Property Type:</strong> {sub.propertyType}</Typography>
                <Typography><strong>Area:</strong> {sub.area} sq. ft.</Typography>
                <Typography><strong>Condition:</strong> {sub.condition}</Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography>No user submissions yet.</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default AdminPanel;
