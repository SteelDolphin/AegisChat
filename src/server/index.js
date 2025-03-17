const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const conversationService = require('../services/conversationService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection with error handling
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chat_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Conversation Routes
app.post('/api/conversations', async (req, res) => {
  try {
    const { userId, title } = req.body;
    if (!userId || !title) {
      return res.status(400).json({ error: 'userId and title are required' });
    }
    const conversation = await conversationService.createConversation(userId, title);
    res.json(conversation);
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user conversations - changed route to avoid conflict
app.get('/api/users/:userId/conversations', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    const conversations = await conversationService.getUserConversations(userId);
    res.json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single conversation
app.get('/api/conversations/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    if (!conversationId) {
      return res.status(400).json({ error: 'conversationId is required' });
    }
    const conversation = await conversationService.getConversation(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json(conversation);
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/conversations/:conversationId/messages', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { role, content } = req.body;
    if (!conversationId || !role || !content) {
      return res.status(400).json({ error: 'conversationId, role, and content are required' });
    }
    const conversation = await conversationService.addMessage(
      conversationId,
      role,
      content
    );
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json(conversation);
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/conversations/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    if (!conversationId) {
      return res.status(400).json({ error: 'conversationId is required' });
    }
    const conversation = await conversationService.deleteConversation(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json(conversation);
  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/conversations/:conversationId/title', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { title } = req.body;
    if (!conversationId || !title) {
      return res.status(400).json({ error: 'conversationId and title are required' });
    }
    const conversation = await conversationService.updateTitle(conversationId, title);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json(conversation);
  } catch (error) {
    console.error('Update title error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 