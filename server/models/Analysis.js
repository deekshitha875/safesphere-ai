const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: { type: String, required: true },
  result: {
    label: String,       // safe | toxic | hate | harassment
    confidence: Number,
    sentiment: String,   // positive | neutral | negative | hostile
    threatLevel: String, // low | medium | high
    action: String,
  },
  platform: { type: String, default: 'manual' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Analysis', analysisSchema);
