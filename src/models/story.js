const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const slideSchema = new mongoose.Schema({
     imageUrl: { type: String, required: true },
     heading: { type: String, required: true },
     description: { type: String, required: true },
     category: { type: String, required: true, enum: ['food', 'health and fitness', 'travel', 'movie', 'education'] }
   });

   
const storySchema  = new mongoose.Schema({
     author: { type: String,  required: true 
    },
    slides: [slideSchema],
    likes: [{ type: String,  ref: 'User' }],
//     category: { type: String, required: true, enum: ['food', 'health and fitness', 'travel', 'movie', 'education'] },
    category: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Story", storySchema);