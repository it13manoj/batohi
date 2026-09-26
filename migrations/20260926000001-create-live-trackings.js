"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("live_trackings", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            booking_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "bookeds",
                    key: "id"
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            },
            driver_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id"
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id"
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            },
            current_latitude: {
                type: Sequelize.DECIMAL(10, 8),
                allowNull: false
            },
            current_longitude: {
                type: Sequelize.DECIMAL(11, 8),
                allowNull: false
            },
            heading: {
                type: Sequelize.DECIMAL(5, 2),
                allowNull: true
            },
            speed: {
                type: Sequelize.DECIMAL(6, 2),
                allowNull: true
            },
            accuracy: {
                type: Sequelize.DECIMAL(6, 2),
                allowNull: true
            },
            altitude: {
                type: Sequelize.DECIMAL(8, 2),
                allowNull: true
            },
            distance_remaining_km: {
                type: Sequelize.DECIMAL(8, 2),
                allowNull: true
            },
            estimated_arrival_minutes: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            pickup_status: {
                type: Sequelize.ENUM(
                    "driver_assigned",
                    "arrived_pickup",
                    "pickup_confirmed",
                    "in_transit",
                    "arrived_destination",
                    "completed",
                    "cancelled"
                ),
                defaultValue: "pickup_confirmed",
                allowNull: false
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
                allowNull: false
            },
            battery_percentage: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            recorded_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
                allowNull: false
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
            }
        });

        // Add indexes for efficient real-time lookups
        await queryInterface.addIndex("live_trackings", ["booking_id"], {
            name: "idx_live_trackings_booking_id"
        });
        await queryInterface.addIndex("live_trackings", ["driver_id"], {
            name: "idx_live_trackings_driver_id"
        });
        await queryInterface.addIndex("live_trackings", ["user_id"], {
            name: "idx_live_trackings_user_id"
        });
        await queryInterface.addIndex("live_trackings", ["recorded_at"], {
            name: "idx_live_trackings_recorded_at"
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("live_trackings");
    }
};
