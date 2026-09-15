const crypto = require('crypto');

/**
 * Generates a secure numeric OTP of a specified length.
 * @param {number} length - Number of digits (default: 6)
 * @returns {string} The generated OTP
 */
const generateOTP = (length = 6) => {
  const digits = '0123456789';
  let otp = '';
  const randomBytes = crypto.randomBytes(length);

  for (let i = 0; i < length; i++) {
    otp += digits[randomBytes[i] % 10];
  }

  return otp;
};

module.exports = generateOTP;