const express = require('express');
const cors = require('cors');
const { Mistral } = require('@mistralai/mistralai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Mistral client
const client = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

// Cache for requests to avoid redundant API calls
const cache = new Map();

// Tone adjustment endpoint
app.post('/api/adjust-tone', async (req, res) => {
  try {
    const { text, formalityLevel, friendlinessLevel } = req.body;

    // Enhanced validation
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({ error: 'Text is required and must be a non-empty string' });
    }

    if (text.trim().length < 3) {
      return res.status(400).json({ error: 'Text must be at least 3 characters long' });
    }

    if (text.length > 5000) {
      return res.status(400).json({ error: 'Text must be less than 5000 characters' });
    }

    // Validate tone levels
    if (typeof formalityLevel !== 'number' || formalityLevel < -1 || formalityLevel > 1) {
      return res.status(400).json({ error: 'Formality level must be a number between -1 and 1' });
    }

    if (typeof friendlinessLevel !== 'number' || friendlinessLevel < -1 || friendlinessLevel > 1) {
      return res.status(400).json({ error: 'Friendliness level must be a number between -1 and 1' });
    }

    // Create cache key
    const cacheKey = `${text}-${formalityLevel}-${friendlinessLevel}`;
    
    // Check cache first
    if (cache.has(cacheKey)) {
      console.log('Cache hit for request');
      return res.json({ adjustedText: cache.get(cacheKey) });
    }

    // Map levels to descriptive terms
    const getFormalityDescription = (level) => {
      if (level <= -1) return 'very casual and informal';
      if (level === 0) return 'neutral';
      return 'very formal and professional';
    };

    const getFriendlinessDescription = (level) => {
      if (level <= -1) return 'cold and distant';
      if (level === 0) return 'neutral';
      return 'warm and friendly';
    };

    const formalityDesc = getFormalityDescription(formalityLevel);
    const friendlinessDesc = getFriendlinessDescription(friendlinessLevel);

    // Create the prompt for tone adjustment
    const prompt = `Please rewrite the following text to have a ${formalityDesc} tone and a ${friendlinessDesc} approach. Keep the core meaning and information intact, but adjust the style and tone accordingly. Only return the rewritten text, nothing else.

Original text: "${text}"

Rewritten text:`;

    // Make API call to Mistral
    const chatResponse = await client.chat.complete({
      model: 'mistral-small-latest',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const adjustedText = chatResponse.choices[0]?.message?.content?.trim();

    // Validate API response
    if (!adjustedText || typeof adjustedText !== 'string') {
      throw new Error('Invalid response from AI service');
    }

    if (adjustedText.length === 0) {
      throw new Error('AI service returned empty response');
    }

    // Cache the result
    cache.set(cacheKey, adjustedText);

    res.json({ adjustedText });

  } catch (error) {
    console.error('Error adjusting tone:', error);
    
    // Handle different types of errors with specific status codes
    if (error.message.includes('API key') || error.message.includes('401')) {
      return res.status(401).json({ 
        error: 'API authentication failed. Please check configuration.' 
      });
    }
    
    if (error.message.includes('rate limit') || error.message.includes('429')) {
      return res.status(429).json({ 
        error: 'Service rate limit exceeded. Please wait a moment before trying again.' 
      });
    }

    if (error.message.includes('timeout') || error.message.includes('ECONNRESET')) {
      return res.status(504).json({ 
        error: 'Service timeout. Please try again.' 
      });
    }

    if (error.message.includes('Invalid response') || error.message.includes('empty response')) {
      return res.status(502).json({ 
        error: 'Invalid response from AI service. Please try again.' 
      });
    }

    // Generic server error
    res.status(500).json({ 
      error: 'Failed to adjust tone. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Reset cache endpoint (useful for development)
app.post('/api/cache/clear', (req, res) => {
  cache.clear();
  res.json({ message: 'Cache cleared successfully' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
