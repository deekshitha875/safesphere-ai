import os

# 1. Update server/models/User.js - add resetToken fields
user_model = r"""const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
"""

with open('server/models/User.js', 'w', encoding='utf-8', newline='\n') as f:
    f.write(user_model)
print('User.js written')

# 2. Update server/routes/auth.js - add forgot/reset/profile routes
auth_routes = r"""const router = require('express').Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password });
    res.status(201).json({ token: sign(user._id), user: { id: user._id, name: user.name, email: user.email, plan: user.plan, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ token: sign(user._id), user: { id: user._id, name: user.name, email: user.email, plan: user.plan, role: user.role } });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account with this email' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetToken = otp;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background: #0f172a; margin: 0; padding: 0; }
          .container { max-width: 480px; margin: 40px auto; background: #1e293b; border-radius: 16px; overflow: hidden; border: 1px solid rgba(99,102,241,0.2); }
          .header { background: linear-gradient(135deg, #6366f1, #9333ea); padding: 32px 24px; text-align: center; }
          .header h1 { color: #fff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
          .header p { color: rgba(255,255,255,0.8); margin: 6px 0 0; font-size: 13px; }
          .body { padding: 32px 24px; }
          .body p { color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 16px; }
          .otp-box { background: #0f172a; border: 2px solid #6366f1; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
          .otp-code { font-size: 40px; font-weight: 800; letter-spacing: 10px; color: #818cf8; font-family: monospace; }
          .otp-note { color: #64748b; font-size: 12px; margin-top: 8px; }
          .footer { padding: 16px 24px; border-top: 1px solid rgba(255,255,255,0.05); text-align: center; }
          .footer p { color: #475569; font-size: 11px; margin: 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🛡️ SafeSphere AI</h1>
            <p>Password Reset Request</p>
          </div>
          <div class="body">
            <p>Hi there,</p>
            <p>We received a request to reset your SafeSphere AI account password. Use the OTP below to proceed:</p>
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
              <div class="otp-note">Valid for 15 minutes only</div>
            </div>
            <p>If you did not request a password reset, please ignore this email. Your account remains secure.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 SafeSphere AI &mdash; Cybercrime Reporting Platform</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"SafeSphere AI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'SafeSphere AI - Password Reset OTP',
      html: htmlBody,
    });

    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account with this email' });

    if (user.resetToken !== otp || !user.resetTokenExpiry || user.resetTokenExpiry < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name && name.trim()) {
      user.name = name.trim();
    }

    if (oldPassword && newPassword) {
      const valid = await user.comparePassword(oldPassword);
      if (!valid) return res.status(400).json({ message: 'Current password is incorrect' });
      if (newPassword.length < 6) return res.status(400).json({ message: 'New password must be at least 6 characters' });
      user.password = newPassword;
    }

    await user.save();
    res.json({ user: { id: user._id, name: user.name, email: user.email, plan: user.plan, role: user.role } });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
"""

with open('server/routes/auth.js', 'w', encoding='utf-8', newline='\n') as f:
    f.write(auth_routes)
print('auth.js written')

# 3. Append email config to server/.env
env_path = 'server/.env'
with open(env_path, 'r', encoding='utf-8') as f:
    env_content = f.read()

if 'EMAIL_USER' not in env_content:
    with open(env_path, 'a', encoding='utf-8') as f:
        f.write('\nEMAIL_USER=safesphereai.help@gmail.com\nEMAIL_PASS=your_app_password_here\n')
    print('.env updated with email config')
else:
    print('.env already has EMAIL_USER, skipping')

print('All server files done')
