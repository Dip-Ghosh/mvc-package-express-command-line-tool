# Node CLI Scaffolding & Migration Toolkit

A lightweight Node.js CLI toolkit for generating project resources and managing database setup, migrations, and seeders.

This package helps you quickly scaffold common backend files such as controllers, models, routes, views, seeders, migrations, and full resources, while also supporting database configuration and migration workflows.

---

## Features

### Database Operations
- Database setup generator
- Migration runner
- Fresh migration support
- Seeder execution
- Rollback support

### CLI Generators
- Controller
- Model
- Migration
- Seeder
- View
- Route
- Database config
- Full resource scaffold

All commands are implemented through Node-based CLI scripts under the `cli/` and `database/` directories.

---

## Supported Databases

| Database    | Driver               |
|-------------|----------------------|
| MySQL       | `mysql2`             |
| PostgreSQL  | `pg`                 |
| MongoDB     | `mongoose`           |
| Cassandra   | `cassandra-driver`   |
| Redis       | `ioredis`            |

Configuration values are pulled from environment variables in `.env.example` and loaded through `config/database.js`.

---

## Installation

Clone or copy the package into your project, then install dependencies:

```bash
npm install
```

For automatic database dependency setup, run:

```bash
npm run migration
```

The database setup script creates `.env.example`, `config/database.js`, and `utils/database.js`, and installs required database packages such as `dotenv`, `mysql2`, `pg`, `mongoose`, `cassandra-driver`, and `ioredis`.

---

## Package Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "migration":          "node database/setup.js",
    "migrate":            "node database/migrate.js",
    "migrate:fresh":      "node database/migrate.js fresh",
    "migrate:fresh-seed": "node database/migrate.js fresh --seed",
    "migrate:rollback":   "node database/migrate.js rollback",
    "make:controller":    "node cli/make-controller.js",
    "make:model":         "node cli/make-model.js",
    "make:migration":     "node cli/make-migration.js",
    "make:seeder":        "node cli/make-seeder.js",
    "make:view":          "node cli/make-view.js",
    "make:route":         "node cli/make-route.js",
    "make:database":      "node cli/make-database.js",
    "make:resource":      "node cli/make-scaffold.js"
  }
}
```

---

## Usage

### 1. Setup Database Files

```bash
npm run migration
```

Prepares database-related configuration files and environment variables. You can also pass a database driver directly:

```bash
node database/setup.js mysql
node database/setup.js postgres
node database/setup.js mongodb
node database/setup.js redis
```

### 2. Run Migrations

```bash
npm run migrate
```

Runs all migration files from the `database/migrations` directory.

### 3. Run Fresh Migrations

```bash
npm run migrate:fresh
```

Rolls back existing migrations and re-runs them from scratch. Disables foreign key checks before rollback.

### 4. Run Fresh Migrations with Seeders

```bash
npm run migrate:fresh-seed
```

Refreshes all migrations and then executes all seeders from the `database/seeders` directory.

### 5. Rollback Migrations

```bash
npm run migrate:rollback
```

Executes the `down()` method of migrations in reverse order.

---

## Generators

### Create a Controller

```bash
npm run make:controller user
npm run make:controller admin/user
```

Creates controller files inside the `controllers/` directory with common CRUD methods: `index`, `show`, `store`, `update`, and `destroy`. Nested paths are supported.

### Create a Model

```bash
npm run make:model user
npm run make:model admin/user
```

Creates a model class inside the `models/` directory. Nested paths are supported.

### Create a Migration

```bash
npm run make:migration create_users_table
```

Creates a timestamped migration file inside `database/migrations/` with `up()` and `down()` methods.

### Create a Seeder

```bash
npm run make:seeder users_seeder
npm run make:seeder admin/users_seeder
```

Creates a seeder file inside `database/seeders/`. Nested paths are supported.

### Create a View

```bash
npm run make:view users/index
npm run make:view admin/users/show
```

Creates an `.ejs` view file inside the `views/` directory.

### Create a Route

```bash
npm run make:route user
npm run make:route admin/user
```

Creates a route file inside `routes/` and auto-registers it in `routes/index.js`. Generated routes include standard CRUD endpoints.

### Create a Full Resource Scaffold

```bash
npm run make:resource user
npm run make:resource admin/user
```

Runs multiple CLI generators in sequence to scaffold a full resource. Creates the following files:

- Controller
- Service
- Model
- Route
- Seeder
- Migration

---

## Generated Project Structure

```
project/
├── cli/
├── config/
│   └── database.js
├── controllers/
├── database/
│   ├── migrations/
│   ├── seeders/
│   ├── migrate.js
│   └── setup.js
├── models/
├── routes/
│   └── index.js
├── services/
├── utils/
│   └── database.js
├── views/
└── .env.example
```

---

## Example Workflow

```bash
# 1. Setup database configuration
npm run migration

# 2. Generate a full user resource
npm run make:resource user

# 3. Run migrations
npm run migrate

# 4. Refresh migrations and seed the database
npm run migrate:fresh-seed
```

---

## Notes

- Nested resource names are supported, such as `admin/user`.
- Migration files are timestamped automatically.
- Route generation auto-registers routes in `routes/index.js`.
- Fresh migration disables foreign key checks before rollback.
- The `make:resource` script calls `make-service.js` — ensure it is properly implemented before use, as the current export may throw at runtime if `index` is not defined.

---

## License

MIT
