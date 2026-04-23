const db = require('../../utils/database');

const TOTAL = 20;
const BATCH_SIZE = 1000;

const badges = ['Sale', 'Hot', 'New', 'Featured', null];
const adjectives = ['Wireless', 'Mechanical', 'Smart', 'Portable', 'Premium', 'Ultra', 'Pro'];
const items = ['Headphones', 'Keyboard', 'Mouse', 'Monitor', 'Webcam', 'Hub', 'Speaker'];

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomFloat = (min, max) => parseFloat((Math.random() * (max - min) + min).toFixed(2));
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateProduct = (i) => {
  const price = randomFloat(9.99, 299.99);
  const oldPrice = Math.random() > 0.5 ? parseFloat((price * 1.2).toFixed(2)) : null;

  return [
    `${random(adjectives)} ${random(items)} ${i}`,
    price,
    oldPrice,
    random(badges),
    randomInt(1, 5),
    randomInt(0, 5000),
    `High quality ${random(adjectives).toLowerCase()} ${random(items).toLowerCase()} with excellent features.`,
    `https://picsum.photos/seed/${i}/400/320`,
  ];
};

const products_seeder = async () => {
  try {
    console.log(`🌱 Seeding ${TOTAL.toLocaleString()} products in batches of ${BATCH_SIZE}...\n`);

    const totalBatches = Math.ceil(TOTAL / BATCH_SIZE);

    for (let batch = 0; batch < totalBatches; batch++) {
      const values = [];
      const start = batch * BATCH_SIZE + 1;
      const end = Math.min(start + BATCH_SIZE - 1, TOTAL);

      for (let i = start; i <= end; i++) {
        values.push(generateProduct(i));
      }

      const placeholders = values.map(() => '(?, ?, ?, ?, ?, ?, ?, ?)').join(', ');
      const flat = values.flat();

      const sql = `
        INSERT INTO products (name, price, old_price, badge, rating, reviews, description, image)
        VALUES ${placeholders}
      `;

      await db.execute(sql, flat);

      const percent = (((batch + 1) / totalBatches) * 100).toFixed(1);
      process.stdout.write(
        `\r⏳ Progress: ${end.toLocaleString()} / ${TOTAL.toLocaleString()} (${percent}%)`
      );
    }

    console.log(`\n\n✅ Seeding complete! ${TOTAL} products inserted.`);
    // eslint-disable-next-line n/no-process-exit
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Seeding failed:', err.message);
    // eslint-disable-next-line n/no-process-exit
    process.exit(1);
  }
};

module.exports = products_seeder;
