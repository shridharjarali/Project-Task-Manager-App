const { pool } = require('../config/db');

/**
 * Generate a random 6-digit OTP code.
 */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Store OTP in the database with an expiry time.
 */
async function storeOTP(email, code) {
  const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES) || 5;

  // Delete any existing OTPs for this email
  await pool.query('DELETE FROM otps WHERE email = $1', [email]);

  // Insert new OTP
  await pool.query(
    'INSERT INTO otps (email, code, expires_at) VALUES ($1, $2, NOW() + $3::interval)',
    [email, code, `${expiryMinutes} minutes`]
  );
}

/**
 * Verify OTP for a given email. Returns true if valid, false otherwise.
 * Deletes the OTP after successful verification (one-time use).
 */
async function verifyOTP(email, code) {
  const result = await pool.query(
    'SELECT id FROM otps WHERE email = $1 AND code = $2 AND expires_at > NOW()',
    [email, code]
  );

  if (result.rows.length === 0) {
    return false;
  }

  // Delete used OTP
  await pool.query('DELETE FROM otps WHERE email = $1', [email]);
  return true;
}

module.exports = { generateOTP, storeOTP, verifyOTP };
