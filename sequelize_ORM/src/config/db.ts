// src/config/db.ts
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

// Create a Sequelize instance using environment variables for configuration
const sequelize = new Sequelize(
    process.env.DB_NAME as string,            // Database name
    process.env.DB_USER as string,            // Database user
    process.env.DB_PASSWORD as string,        // Database password
    {
        host: process.env.DB_HOST,            // Hostname (e.g., localhost)
        port: process.env.DB_PORT as unknown as number, // Port number, converted to number type
        dialect: 'postgres',                  // Database type (postgres, mysql, etc.)
        logging: false                        // Optional: disable SQL query logging in console
    }
);

export default sequelize;
