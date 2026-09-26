"use strict";

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const sequelize = require("../Src/config/database");
const { Sequelize } = require("sequelize");

const MIGRATIONS_DIR = __dirname;
const META_TABLE = "SequelizeMeta";

async function initMetaTable(queryInterface) {
    const tables = await queryInterface.showAllTables();
    const normalizedTables = tables.map(t => (typeof t === "object" ? Object.values(t)[0] : t).toLowerCase());

    if (!normalizedTables.includes(META_TABLE.toLowerCase())) {
        await queryInterface.createTable(META_TABLE, {
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
                primaryKey: true
            }
        });
        console.log(`[Migration] Created tracking table: ${META_TABLE}`);
    }
}

async function getExecutedMigrations() {
    try {
        const [results] = await sequelize.query(`SELECT name FROM \`${META_TABLE}\` ORDER BY name ASC`);
        return results.map(r => r.name);
    } catch {
        return [];
    }
}

async function runMigrations() {
    const queryInterface = sequelize.getQueryInterface();

    console.log("==========================================");
    console.log("🚀 Starting Database Migrations");
    console.log("==========================================");

    await initMetaTable(queryInterface);
    const executed = await getExecutedMigrations();

    const allFiles = fs
        .readdirSync(MIGRATIONS_DIR)
        .filter(file => file.endsWith(".js") && file !== "runner.js")
        .sort();

    const pending = allFiles.filter(file => !executed.includes(file));

    if (pending.length === 0) {
        console.log("✅ No pending migrations to run. Database is up to date.");
        return;
    }

    console.log(`Found ${pending.length} pending migration(s):`);
    for (const file of pending) {
        console.log(`  -> Running migration: ${file}...`);
        const migration = require(path.join(MIGRATIONS_DIR, file));
        await migration.up(queryInterface, Sequelize);

        await sequelize.query(
            `INSERT INTO \`${META_TABLE}\` (name) VALUES (:name)`,
            {
                replacements: { name: file },
                type: Sequelize.QueryTypes.INSERT
            }
        );
        console.log(`  ✓ Applied: ${file}`);
    }

    console.log("==========================================");
    console.log("✅ All migrations executed successfully.");
    console.log("==========================================");
}

async function rollbackLastMigration() {
    const queryInterface = sequelize.getQueryInterface();
    await initMetaTable(queryInterface);
    const executed = await getExecutedMigrations();

    if (executed.length === 0) {
        console.log("No executed migrations found to rollback.");
        return;
    }

    const lastMigrationFile = executed[executed.length - 1];
    const migrationPath = path.join(MIGRATIONS_DIR, lastMigrationFile);

    if (!fs.existsSync(migrationPath)) {
        console.error(`Migration file ${lastMigrationFile} not found on disk.`);
        return;
    }

    console.log(`Rolling back migration: ${lastMigrationFile}...`);
    const migration = require(migrationPath);
    if (migration.down) {
        await migration.down(queryInterface, Sequelize);
    }

    await sequelize.query(
        `DELETE FROM \`${META_TABLE}\` WHERE name = :name`,
        {
            replacements: { name: lastMigrationFile },
            type: Sequelize.QueryTypes.DELETE
        }
    );

    console.log(`✓ Rolled back: ${lastMigrationFile}`);
}

if (require.main === module) {
    const isRollback = process.argv.includes("--rollback");
    const action = isRollback ? rollbackLastMigration() : runMigrations();

    action
        .then(() => process.exit(0))
        .catch(err => {
            console.error("❌ Migration error:", err);
            process.exit(1);
        });
}

module.exports = {
    runMigrations,
    rollbackLastMigration
};
