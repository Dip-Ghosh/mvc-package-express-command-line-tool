const db = require('../../utils/database');

const up = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS products (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      old_price DECIMAL(10,2) DEFAULT NULL,
      badge VARCHAR(50) DEFAULT NULL,
      rating TINYINT UNSIGNED NOT NULL,
      reviews INT UNSIGNED NOT NULL DEFAULT 0,
      description TEXT NOT NULL,
      image VARCHAR(500) NOT NULL,
      created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    );
  `;

  await db.execute(sql);
  console.log('Migration completed: products table created');
};

const down = async () => {
  const sql = `DROP TABLE IF EXISTS products`;
  await db.execute(sql);
  console.log('Rollback completed: products table dropped');
};

module.exports = { up, down };
