🚀 Node.js Scaffolding & Multi-Database Manager

A lightweight CLI-based scaffolding system for Node.js + Express, inspired by Laravel.

✨ Features
🧱 Full scaffolding system
⚙️ CLI-based file generation
🗄️ Multi-database support
🔌 Connection manager (MySQL, PostgreSQL, MongoDB, Cassandra, Redis)
📁 Auto project structure creation
🔁 Environment-based configuration
⚡ One Command = Full Setup

You can generate everything using commands like:

npm run cli make:resource User

👉 This will create:

Controller
Model
Migration
Seeder
Route
View (optional)
Database structure (if needed)
📁 Project Structure
project/
│
├── cli/
│   ├── index.js
│   ├── make-controller.js
│   ├── make-model.js
│   ├── make-migration.js
│   ├── make-seeder.js
│   ├── make-route.js
│   └── make-databases.js
│
├── config/
│   └── database.js
│
├── controllers/
├── models/
├── routes/
├── views/
├── database/
│   ├── migrations/
│   └── seeders/
│
├── utils/
│   └── database.js
│
├── .env
├── .env.example
├── package.json
📥 Installation
npm install
🧰 Required Packages

These are automatically installed by:

npm run make:databases

Or manually:

npm install dotenv mysql2 pg mongoose cassandra-driver ioredis
⚙️ Setup Database (One Command)
npm run make:databases

This will:

install required packages
create .env.example
create config/database.js
create utils/database.js
🔁 Create .env
cp .env.example .env

Edit .env with your credentials.

🧱 Scaffolding Commands

Run all commands via:

npm run cli <command>
🔹 Create Controller
npm run cli make:controller User
🔹 Create Model
npm run cli make:model User
🔹 Create Migration
npm run cli make:migration create_users_table
🔹 Create Seeder
npm run cli make:seeder UserSeeder
🔹 Create Route
npm run cli make:route user
🔥 Create Everything (Recommended)
npm run cli make:resource User

This will generate:

controllers/UserController.js
models/User.js
database/migrations/..._create_users_table.js
database/seeders/UserSeeder.js
routes/userRoutes.js
views/user/ (optional)
🗄️ Multi Database Support

Supported databases:

MySQL
PostgreSQL
MongoDB
Cassandra
Redis
🔌 Database Usage
const { connection } = require('../utils/database');
Default Connection
const db = await connection();
MySQL
const db = await connection('mysql');
const [rows] = await db.execute('SELECT * FROM users');
PostgreSQL
const db = await connection('pgsql');
const result = await db.query('SELECT * FROM users');
MongoDB
const db = await connection('mongodb');
const users = await db.collection('users').find({}).toArray();
Redis
const redis = await connection('redis');
await redis.set('key', 'value');
⚠️ Important

Always use:

const db = await connection();

Not:

const db = connection(); // ❌
🔁 Example Workflow
    npm run make:databases
    cp .env.example .env

npm run cli make:resource User