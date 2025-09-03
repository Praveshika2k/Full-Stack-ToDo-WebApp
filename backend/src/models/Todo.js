import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  category: { type: String, enum: ['Personal', 'Work', 'Study', 'Other'], default: 'Personal' },
  dueDate: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.model('Todo', todoSchema);
