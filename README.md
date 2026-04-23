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
npm i node-forge-cli
```

For automatic database dependency setup, run:

```bash
node-forge migration
```

The database setup script creates `.env.example`, `config/database.js`, and `utils/database.js`, and installs required database packages such as `dotenv`, `mysql2`, `pg`, `mongoose`, `cassandra-driver`, and `ioredis`.

---

## Package Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "migration":          "node-forge-forge database/setup.js",
    "migrate":            "node-forge database/migrate.js",
    "migrate:fresh":      "node-forge database/migrate.js fresh",
    "migrate:fresh-seed": "node-forge database/migrate.js fresh --seed",
    "migrate:rollback":   "node-forge database/migrate.js rollback",
    "make:controller":    "node-forge cli/make-controller.js",
    "make:model":         "node-forge cli/make-model.js",
    "make:migration":     "node-forge cli/make-migration.js",
    "make:seeder":        "node-forge cli/make-seeder.js",
    "make:view":          "node-forge cli/make-view.js",
    "make:route":         "node-forge cli/make-route.js",
    "make:database":      "node-forge cli/make-database.js",
    "make:resource":      "node-forge cli/make-scaffold.js"
  }
}
```

---

## Usage

### 1. Setup Database Files

```bash
node-forge migration
```

Prepares database-related configuration files and environment variables. You can also pass a database driver directly:

```bash
node-forge database/setup.js mysql
node-forge database/setup.js postgres
node-forge database/setup.js mongodb
node-forge database/setup.js redis
```

### 2. Run Migrations

```bash
node-forge migrate
```

Runs all migration files from the `database` directory.


### 3. Run Fresh Migrations with Seeders

```bash
node-forge migrate:fresh-seed
```

Refreshes all migrations and then executes all seeders from the `database/seeders` directory.

### 4. Rollback Migrations

```bash
node-forge migrate:rollback
```

Executes the `down()` method of migrations in reverse order.

---

## Generators

### Create a Controller

```bash
node-forge make:controller user
node-forge make:controller admin/user
```

Creates controller files inside the `controllers/` directory with common CRUD methods: `index`, `show`, `store`, `update`, and `destroy`. Nested paths are supported.

### Create a Model

```bash
node-forge make:model user
node-forge make:model admin/user
```

Creates a model class inside the `models/` directory. Nested paths are supported.

### Create a Migration

```bash
node-forge make:migration create_users_table
```

Creates a timestamped migration file inside `database/migrations/` with `up()` and `down()` methods.

### Create a Seeder

```bash
node-forge make:seeder user
node-forge make:seeder admin/users
```

Creates a seeder file inside `database/seeders/`. Nested paths are supported.

### Create a View

```bash
node-forge make:view users/index
node-forge make:view admin/users/show
```

Creates an `.ejs` view file inside the `views/` directory.

### Create a Route

```bash
node-forge make:route user
node-forge make:route admin/user
```

Creates a route file inside `routes/` and auto-registers it in `routes/index.js`. Generated routes include standard CRUD endpoints.

### Create a Full Resource Scaffold

```bash
node-forge make:resource user
node-forge make:resource admin/user
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
node-forge migration

# 2. Generate a full user resource
node-forge make:resource user

# 3. Run migrations
node-forge migrate

# 4. Refresh migrations and seed the database
node-forge migrate:fresh-seed
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
