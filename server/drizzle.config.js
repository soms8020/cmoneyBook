import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

export default {
    schema: './src/db/schema.js',
    out: './src/db/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.POSTGRES_URL,
    },
};
