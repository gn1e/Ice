const { Pool } = require('pg');

const pool = new Pool();

const ProfilesSchema = {
    created: { type: 'timestamp', required: true },
    accountId: { type: 'varchar', required: true, unique: true },
    profiles: { type: 'jsonb', required: true },
};

const createTableQuery = `
    CREATE TABLE IF NOT EXISTS profiles (
        id SERIAL PRIMARY KEY,
        created TIMESTAMP NOT NULL,
        account_id VARCHAR(255) UNIQUE NOT NULL,
        profiles JSONB NOT NULL
    );
`;

pool.query(createTableQuery).catch(console.error);

module.exports = { ProfilesSchema };
