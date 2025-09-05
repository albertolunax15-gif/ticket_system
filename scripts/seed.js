// scripts/seed.js
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const config = require('../config/database.js')['development'];
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: 'mysql',
    dialectModule: require('mysql2')
  }
);

async function runSeeders() {
  const seedersPath = path.join(__dirname, '../seeders');
  const files = fs.readdirSync(seedersPath).filter(f => f.endsWith('.js'));

  for (const file of files) {
    const seeder = require(path.join(seedersPath, file));
    console.log(`🌱 Ejecutando seeder: ${file}`);
    try {
      await seeder.up(sequelize.getQueryInterface(), Sequelize);
      console.log(`✅ Seeder aplicado: ${file}`);
    } catch (error) {
      console.error(`❌ Error en seeder ${file}:`, error.message);
      process.exit(1);
    }
  }
  console.log('🎉 Todos los seeders aplicados');
  process.exit(0);
}

runSeeders();