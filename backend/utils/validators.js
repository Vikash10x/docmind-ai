/**
 * Input validators for auth and other routes.
 * Returns { valid: boolean, error: string|null }
 */

const validateSignup = (name, email, password) => {
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters.' };
  }
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return { valid: false, error: 'Please provide a valid email address.' };
  }
  if (!password || password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters.' };
  }
  return { valid: true, error: null };
};

const validateSignin = (email, password) => {
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return { valid: false, error: 'Please provide a valid email address.' };
  }
  if (!password) {
    return { valid: false, error: 'Password is required.' };
  }
  return { valid: true, error: null };
};

module.exports = { validateSignup, validateSignin };
