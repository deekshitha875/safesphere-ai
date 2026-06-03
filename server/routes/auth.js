const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { Resend } = require('resend');
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

// Google Sign-In
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ message: 'No credential provided' });

    // Verify token with Google
    const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
    if (!googleRes.ok) return res.status(401).json({ message: 'Invalid Google token' });

    const payload = await googleRes.json();
    if (payload.error) return res.status(401).json({ message: 'Google token verification failed: ' + payload.error });
    // payload.aud contains the client ID - token is already verified by Google

    const { email, name, picture } = payload;
    if (!email) return res.status(400).json({ message: 'Email not found in Google token' });

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      // New user via Google - generate a random password they will never use
      const randomPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12) + 'Aa1!';
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        password: randomPassword,
        avatar: picture || '',
        googleId: payload.sub || '',
      });
    } else {
      // Update avatar and googleId if not set
      if (!user.googleId) {
        await User.updateOne({ _id: user._id }, { googleId: payload.sub || '', avatar: picture || user.avatar });
      }
    }

    res.json({ token: sign(user._id), user: { id: user._id, name: user.name, email: user.email, plan: user.plan, role: user.role, avatar: user.avatar } });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(500).json({ message: 'Google sign-in failed' });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account with this email' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await User.updateOne(
      { _id: user._id },
      { resetToken: otp, resetTokenExpiry: Date.now() + 15 * 60 * 1000 }
    );

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'SafeSphere AI <onboarding@resend.dev>',
      to: email,
      subject: 'SafeSphere AI - Password Reset OTP',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:40px auto;background:#1e293b;border-radius:16px;overflow:hidden;border:1px solid rgba(99,102,241,0.2)">
          <div style="background:linear-gradient(135deg,#6366f1,#9333ea);padding:32px 24px;text-align:center">
            <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700">SafeSphere AI</h1>
            <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:13px">Password Reset Request</p>
          </div>
          <div style="padding:32px 24px">
            <p style="color:#94a3b8;font-size:14px;line-height:1.6">Hi there,</p>
            <p style="color:#94a3b8;font-size:14px;line-height:1.6">Use the OTP below to reset your SafeSphere AI password:</p>
            <div style="background:#0f172a;border:2px solid #6366f1;border-radius:12px;padding:20px;text-align:center;margin:24px 0">
              <div style="font-size:40px;font-weight:800;letter-spacing:10px;color:#818cf8;font-family:monospace">${otp}</div>
              <div style="color:#64748b;font-size:12px;margin-top:8px">Valid for 15 minutes only</div>
            </div>
            <p style="color:#94a3b8;font-size:14px">If you did not request this, ignore this email.</p>
          </div>
          <div style="padding:16px 24px;border-top:1px solid rgba(255,255,255,0.05);text-align:center">
            <p style="color:#475569;font-size:11px;margin:0">\u00a9 2025 SafeSphere AI</p>
          </div>
        </div>
      `,
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
