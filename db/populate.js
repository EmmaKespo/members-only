// db/populate.js
const pool = require('./pool');
const bcrypt = require('bcryptjs');

async function main() {
  console.log('Seeding database tables with dummy data...');

  try {
    // 1. Clear out old data if it exists to prevent duplication errors
    await pool.query('DROP TABLE IF EXISTS messages CASCADE;');
    await pool.query('DROP TABLE IF EXISTS users CASCADE;');

    // 2. Re-create tables 
    const createTablesSQL = `
      CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          username VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          membership_status BOOLEAN DEFAULT FALSE,
          is_admin BOOLEAN DEFAULT FALSE
      );

      CREATE TABLE messages (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          text TEXT NOT NULL,
          timestamp TIMESTAMP DEFAULT NOW()
      );
    `;
    await pool.query(createTablesSQL);
    console.log('✓ Tables created successfully.');

    // 3. Generate secure bcrypt hashes for the dummy passwords
    const adminHash = await bcrypt.hash('admin123', 10);
    const memberHash = await bcrypt.hash('member123', 10);
    const guestHash = await bcrypt.hash('guest123', 10);

    // 4. Insert dummy profiles
    const insertUsersSQL = `
      INSERT INTO users (first_name, last_name, username, password, membership_status, is_admin)
      VALUES 
      ('Boss', 'Admin', 'admin@club.com', $1, true, true),
      ('John', 'Member', 'john@club.com', $2, true, false),
      ('Jane', 'Guest', 'jane@club.com', $3, false, false)
      RETURNING id, username;
    `;
    
    const userRes = await pool.query(insertUsersSQL, [adminHash, memberHash, guestHash]);
    console.log('✓ Dummy users registered.');

    // Map database IDs to use for message author references
    const adminId = userRes.rows[0].id;
    const memberId = userRes.rows[1].id;
    const guestId = userRes.rows[2].id;

    // 5. Insert dummy clubhouse messages linked to those users
    const insertMessagesSQL = `
      INSERT INTO messages (user_id, title, text, timestamp)
      VALUES 
      ($1, 'Welcome to the Secret Vault', 'This is an official administrative broadcast. Welcome to our secure network platform.', NOW() - INTERVAL '2 hours'),
      ($2, 'Spotted in the lounge', 'I saw someone drinking coffee out of the director custom mug today. Hilarious.', NOW() - INTERVAL '1 hour'),
      ($3, 'Hoping to join soon!', 'Hello everyone! I just registered my account. Can someone send me the secret passcode?', NOW());
    `;

    await pool.query(insertMessagesSQL, [adminId, memberId, guestId]);
    console.log('✓ Sample messages posted successfully.');
    console.log('\nDatabase seeding finished! You can now log in with:');
    console.log('- admin@club.com (password: admin123)');
    console.log('- john@club.com (password: member123)');
    console.log('- jane@club.com (password: guest123)');

  } catch (err) {
    console.error('Error during database population:', err);
  } finally {
    await pool.end();
  }
}

main();
