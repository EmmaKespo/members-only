#  Exclusive Clubhouse (Members Only)

An exclusive, secure web application where users can share anonymous posts. While the public can read the messages, only verified club members can view author details and timestamps. This platform showcases advanced user authentication, multi-tiered authorization gates, and relational database management.

---

## Business Value

* **Privacy by Design:** User identity metadata is strictly protected and masked at the database join layer for unauthenticated users.
* **Tiered Access Control:** Implements three strict permission levels (Guest, Verified Member, and Content Administrator) to simulate enterprise-grade application security.
* **Ironclad Cryptography:** Passwords are cryptographically salted and hashed at rest, neutralizing data security liabilities.

---

##  Architecture & Tech Stack

* **Backend Engine:** Node.js & Express.js
* **Database Platform:** PostgreSQL (Relational Model)
* **Authentication Framework:** Passport.js (LocalStrategy)
* **Data Protection:** Bcrypt.js (10 Salt Rounds)
* **Form Integrity:** Express-Validator (Sanitization & Custom Validation)
* **View Engine:** EJS (Embedded JavaScript)

---

## 📂 Project Structure

```text
├── db/
│   ├── pool.js          # PostgreSQL connection client configuration
│   ├── populate.js      # Database tables initialization and data seeding script
│   └── queries.js       # Abstracted SQL query transaction functions
├── controllers/
│   ├── authController.js    # Registration, Bcrypt, Login, and VIP processing logic
│   └── messageController.js # Content delivery, creation, and admin deletion logic
├── routes/
│   ├── authRouter.js    # Routing endpoints for account actions
│   └── messageRouter.js # Routing endpoints for user stories and content
├── views/               # Front-end EJS page layout components
└── app.js               # Application entry point & session configuration
```

---

##  Database Schema Design

### Users Table
* `id` (SERIAL, Primary Key)
* `first_name` (VARCHAR)
* `last_name` (VARCHAR)
* `username` (VARCHAR, Unique Email)
* `password` (VARCHAR, Hashed)
* `membership_status` (BOOLEAN, Default: False)
* `is_admin` (BOOLEAN, Default: False)

### Messages Table
* `id` (SERIAL, Primary Key)
* `user_id` (INTEGER, Foreign Key referencing `users.id` ON DELETE CASCADE)
* `title` (VARCHAR)
* `text` (TEXT)
* `timestamp` (TIMESTAMP, Default: NOW())

---

## ⚙️ Installation & Local Setup

### 1. Clone & Install Dependencies
```bash
git clone <your-repository-url>
cd members-only
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in your root folder and define your database credentials and tracking keys:
```env
PORT=3000
SESSION_SECRET="your_custom_cryptographic_cookie_secret_string"
DATABASE_URL="postgresql://username:password@localhost:5432/members"
```

### 3. Initialize & Seed the Database
Run the independent database population script to build the tables and inject test accounts:
```bash
node db/populate.js
```

### 4. Run the Application
Launch the local development runtime environment via nodemon:
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

##  Preset Testing Accounts

The database seed script initializes three functional tiers for testing system mechanics:

1. **Administrator User**
   * **Username:** `admin@club.com`
   * **Password:** `admin123`
   * **Privileges:** Full message feed access, full metadata visibility, and content deletion rights.
2. **Club Member User**
   * **Username:** `john@club.com`
   * **Password:** `member123`
   * **Privileges:** Full metadata visibility (names/dates) and standard message creation.
3. **Guest User**
   * **Username:** `jane@club.com`
   * **Password:** `guest123`
   * **Privileges:** Can read content, but author data remains masked as *Anonymous*. Can upgrade via the secret passcode: **`opensesame`**.
