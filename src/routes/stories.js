const router = require('express').Router();
const Story = require('../models/story');
const jwtVerify = require("../middleware/authMiddleware");

router.post('/add',jwtVerify,  async (req, res) => {
  try {
    const userID = req.body.userId || "";
    const { author, slides, category } = req.body;
    const uniqueCategories = new Set(slides.map(slide => slide.category));
    if (uniqueCategories.size > 1) {
      return res.status(400).json({ error: 'All slides must have the same category' });
    }
    if (slides.length < 3 || slides.length > 6) {
      return res.status(400).json({ error: 'The number of slides should be between 3 and 6' });
    }
    const newStory = new Story({ author: userID, slides, category });
    console.log("req.body is : " + JSON.stringify(userID));
    const validationError = newStory.validateSync(); if (validationError) {
      const { errors } = validationError;
      console.log(errors);
      return res.status(400).json({ error: errors.map(err => err.message).join(', ') });
    }

    const savedStory = await newStory.save();
    res.status(201).json(savedStory);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});


router.get('/all', async (req, res) => {
     try {
       const stories = await Story.find().populate('author', 'name');
       res.status(200).json(stories);
     } catch (err) {
       res.status(500).json({ error: 'Something went wrong' });
     }
   });


router.get('/category', async (req, res) => {
     try {
       const stories = await Story.find().populate('author', 'name');
       res.status(200).json(stories);
     } catch (err) {
       res.status(500).json({ error: 'Something went wrong' });
     }
   });

   router.get('/category', async (req, res) => {
    try {
      const { category } = req.query; 
       if (!category) {
        return res.status(400).json({ error: 'Missing required parameter: category' });
      }
  
      const stories = await Story.find({ category }).populate('author', 'name'); // Filter by category
      res.status(200).json(stories);
    } catch (err) {
      console.error("Error fetching stories:", err);
      res.status(500).json({ error: 'Something went wrong' });
    }
  });


   module.exports = router;