const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reportedByName: { type: String },
  reportedByEmail: { type: String },
  offenderName: { type: String, required: true },
  offenderPlatform: { type: String, required: true },
  incidentDescription: { type: String, required: true },
  harmfulContent: { type: String, required: true },
  detectedWords: [{ type: String }],
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  status: { type: String, enum: ['pending', 'under_review', 'resolved', 'dismissed'], default: 'pending' },
  assignedAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  adminNotes: { type: String, default: '' },
  adminAction: { type: String, default: '' },
  resolvedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

complaintSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);
