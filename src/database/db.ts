// import postgres, { Sql } from 'postgres';
import { Pool } from 'pg';

// // Connect to the database
// const sql: Sql<{}> = postgres({
//     host: process.env.DB_HOST,
//     port: parseInt(process.env.DB_PORT || '5423'),
//     database: process.env.DB_NAME,
//     username: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     connect_timeout: parseInt(process.env.DB_TIMEOUT || '3600'),
//     max: parseInt(process.env.DB_MAX || '5'),
// });

// export default sql;

const pool: Pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5423'),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    max: parseInt(process.env.DB_MAX || '5'),
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
    connectionTimeoutMillis: parseInt(process.env.DB_TIMEOUT || '3600'),
});

export default pool;
