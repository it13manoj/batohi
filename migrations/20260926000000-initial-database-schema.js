"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const existingTables = await queryInterface.showAllTables();
        const normalized = existingTables.map(t =>
            (typeof t === "object" ? Object.values(t)[0] : t).toLowerCase()
        );

        // Core Roles table
        if (!normalized.includes("roles")) {
            await queryInterface.createTable("roles", {
                id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
                name: { type: Sequelize.STRING, allowNull: false, unique: true },
                created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
                updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") }
            });
        }

        // Users table
        if (!normalized.includes("users")) {
            await queryInterface.createTable("users", {
                id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
                username: { type: Sequelize.STRING, allowNull: false },
                email: { type: Sequelize.STRING, allowNull: false, unique: true },
                mobile_no: { type: Sequelize.STRING, allowNull: false },
                password_hash: { type: Sequelize.STRING, allowNull: false },
                user_type: {
                    type: Sequelize.ENUM("ADMIN", "USERS", "DRIVER", "AGENT"),
                    defaultValue: "USERS",
                    allowNull: false
                },
                status: { type: Sequelize.BOOLEAN, defaultValue: true },
                is_deleted: { type: Sequelize.BOOLEAN, defaultValue: false },
                is_blocked: { type: Sequelize.BOOLEAN, defaultValue: false },
                role_id: { type: Sequelize.INTEGER, defaultValue: 1 },
                is_verified: { type: Sequelize.BOOLEAN, defaultValue: false },
                latitude: { type: Sequelize.DECIMAL(10, 8), allowNull: true },
                longitude: { type: Sequelize.DECIMAL(11, 8), allowNull: true },
                last_located_at: { type: Sequelize.DATE, allowNull: true },
                last_login_at: { type: Sequelize.DATE, allowNull: true },
                device_token: { type: Sequelize.TEXT, allowNull: true },
                created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
                updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") }
            });
        }
    },

    down: async (queryInterface, Sequelize) => {
        // Baseline migration drop is guarded to prevent accidental data loss
        console.log("Initial schema baseline rollback skipped for safety.");
    }
};
