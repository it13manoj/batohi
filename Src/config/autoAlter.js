"use strict";

/**
 * Safe Auto-Alter Utility for Sequelize + MySQL
 * Automatically synchronizes model schema changes (new columns, type changes, nullability)
 * to the MySQL database upon project startup WITHOUT causing the notorious MySQL
 * 'ER_TOO_MANY_KEYS: max 64 keys allowed' error caused by sequelize.sync({ alter: true }).
 */

async function getTableColumns(sequelize, tableName) {
    try {
        const [columns] = await sequelize.query(`SHOW FULL COLUMNS FROM \`${tableName}\``);
        const map = {};
        for (const col of columns) {
            map[col.Field.toLowerCase()] = {
                name: col.Field,
                type: col.Type.toLowerCase(),
                allowNull: col.Null === "YES",
                defaultValue: col.Default,
                comment: col.Comment
            };
        }
        return map;
    } catch {
        return null;
    }
}

async function getTableIndexes(sequelize, tableName) {
    try {
        const [indexes] = await sequelize.query(`SHOW INDEX FROM \`${tableName}\``);
        const indexNames = new Set();
        const indexedColumns = new Set();
        const duplicatesToDrop = [];

        for (const idx of indexes) {
            indexNames.add(idx.Key_name);
            indexedColumns.add(idx.Column_name.toLowerCase());

            // Detect runaway duplicate indexes (e.g. driver_code_2, email_3, etc.)
            if (idx.Key_name !== "PRIMARY" && /_\d+$/.test(idx.Key_name)) {
                if (!duplicatesToDrop.includes(idx.Key_name)) {
                    duplicatesToDrop.push(idx.Key_name);
                }
            }
        }

        // Clean up any existing duplicate indexes if found
        for (const dup of duplicatesToDrop) {
            try {
                await sequelize.query(`ALTER TABLE \`${tableName}\` DROP INDEX \`${dup}\``);
                console.log(`[AutoAlter] 🧹 Cleaned up duplicate index \`${dup}\` from \`${tableName}\``);
            } catch (dropErr) {
                // Ignore if already dropped
            }
        }

        return { indexNames, indexedColumns };
    } catch {
        return { indexNames: new Set(), indexedColumns: new Set() };
    }
}

async function autoAlterTables(sequelize) {
    console.log("==========================================");
    console.log("🔄 Running Database Auto-Alter Check");
    console.log("==========================================");

    const qi = sequelize.getQueryInterface();
    const [existingTableRows] = await sequelize.query("SHOW TABLES");
    const existingTables = new Set(
        existingTableRows.map(row => Object.values(row)[0].toLowerCase())
    );

    let alteredCount = 0;
    let addedCount = 0;

    for (const modelName of Object.keys(sequelize.models)) {
        const model = sequelize.models[modelName];
        const tableName = model.tableName || model.name;
        const lowerTableName = tableName.toLowerCase();

        // 1. Table doesn't exist -> Create table
        if (!existingTables.has(lowerTableName)) {
            console.log(`[AutoAlter] Creating new table: \`${tableName}\`...`);
            await model.sync();
            existingTables.add(lowerTableName);
            console.log(`[AutoAlter] Table \`${tableName}\` created successfully.`);
            continue;
        }

        // 2. Table exists -> Check for column additions or modifications
        const dbColumns = await getTableColumns(sequelize, tableName);
        if (!dbColumns) continue;

        const { indexedColumns } = await getTableIndexes(sequelize, tableName);
        const rawAttributes = model.rawAttributes;

        for (const fieldName of Object.keys(rawAttributes)) {
            const attr = rawAttributes[fieldName];
            const colName = attr.field || fieldName;
            const lowerColName = colName.toLowerCase();

            // Skip primary key modifications to protect auto-increment and keys
            if (attr.primaryKey) continue;

            let fullAttrSql = "";
            try {
                fullAttrSql = qi.queryGenerator.attributeToSQL(attr, {
                    context: "changeColumn",
                    table: tableName
                });
            } catch {
                continue;
            }

            // Strip UNIQUE keyword so MySQL does not generate duplicate _2, _3 keys
            const safeAttrSql = fullAttrSql.replace(/\bUNIQUE\b/gi, "").trim();

            // Case A: Column does not exist in DB -> Add it
            if (!dbColumns[lowerColName]) {
                const addSql = `ALTER TABLE \`${tableName}\` ADD COLUMN \`${colName}\` ${safeAttrSql}`;
                try {
                    await sequelize.query(addSql);
                    console.log(`[AutoAlter] ➕ Added column \`${colName}\` to \`${tableName}\``);
                    addedCount++;

                    // Add unique constraint once if specified and not indexed
                    if (attr.unique && !indexedColumns.has(lowerColName)) {
                        const uqName = `uq_${tableName}_${colName}`;
                        await sequelize.query(`ALTER TABLE \`${tableName}\` ADD UNIQUE INDEX \`${uqName}\` (\`${colName}\`)`);
                        console.log(`[AutoAlter] 🔑 Added unique constraint on \`${tableName}\`(\`${colName}\`)`);
                        indexedColumns.add(lowerColName);
                    }
                } catch (err) {
                    console.error(`[AutoAlter] Failed to add column \`${colName}\` to \`${tableName}\`:`, err.message);
                }
            } else {
                // Case B: Column exists in DB -> Compare definition
                const existingCol = dbColumns[lowerColName];
                const isNullable = attr.allowNull !== false;

                // Extract base type from safeAttrSql (e.g. "VARCHAR(50)", "INT", etc.)
                const modelBaseType = safeAttrSql.split(/\s+/)[0].toLowerCase();
                const dbBaseType = existingCol.type.toLowerCase();

                const typeChanged = !dbBaseType.startsWith(modelBaseType) && !modelBaseType.startsWith(dbBaseType);
                const nullChanged = existingCol.allowNull !== isNullable;

                if (typeChanged || nullChanged) {
                    const modifySql = `ALTER TABLE \`${tableName}\` MODIFY COLUMN \`${colName}\` ${safeAttrSql}`;
                    try {
                        await sequelize.query(modifySql);
                        console.log(`[AutoAlter] ✏️  Altered column \`${colName}\` in \`${tableName}\``);
                        alteredCount++;
                    } catch (err) {
                        // Silent catch if modification is already satisfied
                    }
                }

                // If column is unique in model but has no index in DB, add it safely
                if (attr.unique && !indexedColumns.has(lowerColName)) {
                    try {
                        const uqName = `uq_${tableName}_${colName}`;
                        await sequelize.query(`ALTER TABLE \`${tableName}\` ADD UNIQUE INDEX \`${uqName}\` (\`${colName}\`)`);
                        console.log(`[AutoAlter] 🔑 Added missing unique index on \`${tableName}\`(\`${colName}\`)`);
                        indexedColumns.add(lowerColName);
                    } catch (idxErr) {
                        // Index might already exist under another name
                    }
                }
            }
        }
    }

    console.log("==========================================");
    console.log(`✅ Auto-Alter complete. Added: ${addedCount}, Altered: ${alteredCount}`);
    console.log("==========================================");
}

module.exports = { autoAlterTables };
