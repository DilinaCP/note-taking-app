const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const auth = require('../auth');

// Get all notes for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('user', 'name email');
    
    res.json({
      success: true,
      data: notes
    });
  } catch (err) {
    console.error('Error fetching notes:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching notes'
    });
  }
});

// Get single note
router.get('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    }).populate('user', 'name email');
    
    if (!note) {
      return res.status(404).json({ 
        success: false,
        message: 'Note not found' 
      });
    }
    
    res.json({
      success: true,
      data: note
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      message: 'Invalid note ID' 
    });
  }
});

// Create new note
router.post('/', auth, async (req, res) => {
  const { title, content } = req.body;
  
  if (!title || !title.trim()) {
    return res.status(400).json({ 
      success: false,
      message: 'Title is required' 
    });
  }
  
  if (!content || !content.trim()) {
    return res.status(400).json({ 
      success: false,
      message: 'Content is required' 
    });
  }

  try {
    const newNote = await Note.create({ 
      title, 
      content,
      user: req.user.id
    });
    
    const populatedNote = await Note.findById(newNote._id)
      .populate('user', 'name email');
    
    res.status(201).json({
      success: true,
      data: populatedNote
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Error creating note' 
    });
  }
});

// Update note
router.put('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    
    if (!note) {
      return res.status(404).json({ 
        success: false,
        message: 'Note not found' 
      });
    }
    
    note.title = req.body.title || note.title;
    note.content = req.body.content || note.content;
    
    const updatedNote = await note.save();
    const populatedNote = await Note.findById(updatedNote._id)
      .populate('user', 'name email');
    
    res.json({
      success: true,
      data: populatedNote
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      message: 'Error updating note' 
    });
  }
});

// Delete note
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    
    if (!note) {
      return res.status(404).json({ 
        success: false,
        message: 'Note not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      message: 'Error deleting note' 
    });
  }
});

module.exports = router;