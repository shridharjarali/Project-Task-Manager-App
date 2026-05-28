const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const { generateOTP, storeOTP, verifyOTP } = require('../utils/otp');

/**
 * POST /api/auth/send-otp
 * Generates and stores an OTP for the given email.
 * In development, logs the OTP to the console.
 */
async function sendOtp(req, res) {
  try {
    const { email } = req.body;
    const code = generateOTP();

    await storeOTP(email, code);

    // In production, you would send this via email (Nodemailer, SendGrid, etc.)
    // For development, we log it to the console
    console.log(`\n📧 OTP for ${email}: ${code}\n`);

    res.json({ message: 'OTP sent successfully. Check console in dev mode.' });
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
  }
}

/**
 * POST /api/auth/verify-otp
 * Verifies the OTP, creates the user if new, and returns a JWT token.
 */
async function verifyOtpHandler(req, res) {
  try {
    const { email, otp } = req.body;

    const isValid = await verifyOTP(email, otp);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid or expired OTP.' });
    }

    // Find or create user
    let userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userResult.rows.length === 0) {
      userResult = await pool.query(
        'INSERT INTO users (email) VALUES ($1) RETURNING *',
        [email]
      );
    }

    const user = userResult.rows[0];

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Authentication successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ error: 'Verification failed. Please try again.' });
  }
}

module.exports = { sendOtp, verifyOtpHandler };
