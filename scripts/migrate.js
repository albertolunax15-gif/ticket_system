const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');
const path = require('path');

// Cargar variables de entorno
require('dotenv').config();

// Cargar configuración de BD
const config = require('../config/database.js')['development'];
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

// Aplicar migraciones manualmente
async function runMigrations() {
  const migrationsPath = path.join(__dirname, '../migrations');
  const files = fs.readdirSync(migrationsPath).filter(f => f.endsWith('.js'));
  
  for (const file of files) {
    const migration = require(path.join(migrationsPath, file));
    console.log(`🔧 Ejecutando migración: ${file}`);
    try {
      await migration.up(sequelize.getQueryInterface(), Sequelize);
      console.log(`✅ Migración aplicada: ${file}`);
    } catch (error) {
      console.error(`❌ Error en migración ${file}:`, error.message);
      process.exit(1);
    }
  }
  console.log('🎉 Todas las migraciones aplicadas');
  process.exit(0);
}

runMigrations();