// db/queries.js
const pool = require('./pool');

// --- USER MANAGEMENT QUERIES ---

// Create a new user with admin status set explicitly from form payload checkbox
async function createUser(first, last, username, hashedPassword, isAdmin) {
  await pool.query(
    'INSERT INTO users (first_name, last_name, username, password, is_admin) VALUES ($1, $2, $3, $4, $5)',
    [first, last, username, hashedPassword, isAdmin]
  );
}

// Locate user profile by username during authentication checks
async function getUserByUsername(username) {
  const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return rows;
}

// Locate user profile by serialized primary key index inside active session
async function getUserById(id) {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return rows;
}

// Upgrade a user's status to VIP membership privileges
async function updateUserMembership(userId) {
  await pool.query('UPDATE users SET membership_status = true WHERE id = $1', [userId]);
}

// --- MESSAGE QUERIES ---

// Insert a text submission linked to its author
async function createMessage(userId, title, text) {
  await pool.query(
    'INSERT INTO messages (user_id, title, text) VALUES ($1, $2, $3)',
    [userId, title, text]
  );
}

// Fetch all posts joined alongside author details to conditionally obscure metadata
async function getAllMessages() {
  const { rows } = await pool.query(`
    SELECT messages.*, users.first_name, users.last_name, users.username 
    FROM messages 
    JOIN users ON messages.user_id = users.id 
    ORDER BY timestamp DESC
  `);
  return rows;
}

// Delete a targeted message entry from the table
async function deleteMessage(messageId) {
  await pool.query('DELETE FROM messages WHERE id = $1', [messageId]);
}

module.exports = {
  createUser,
  getUserByUsername,
  getUserById,
  updateUserMembership,
  createMessage,
  getAllMessages,
  deleteMessage,
};
