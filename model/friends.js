const { Pool } = require('pg');

const pool = new Pool();

const FriendsSchema = {
    created: { type: 'timestamp', required: true },
    accountId: { type: 'varchar', required: true, unique: true },
    list: { type: 'jsonb', default: { accepted: [], incoming: [], outgoing: [], blocked: [] } }
};

const createTableQuery = `
    CREATE TABLE IF NOT EXISTS friends (
        id SERIAL PRIMARY KEY,
        created TIMESTAMP NOT NULL,
        account_id VARCHAR(255) UNIQUE NOT NULL,
        list JSONB DEFAULT '{"accepted": [], "incoming": [], "outgoing": [], "blocked": []}'
    );
`;

pool.query(createTableQuery).catch(console.error);

module.exports = { FriendsSchema };
