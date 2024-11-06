const { Pool } = require('pg');

const pool = new Pool();

const UserSchema = {
    created: { type: 'timestamp', required: true },
    banned: { type: 'boolean', default: false },
    discordId: { type: 'varchar', required: true, unique: true },
    accountId: { type: 'varchar', required: true, unique: true },
    username: { type: 'varchar', required: true, unique: true },
    username_lower: { type: 'varchar', required: true, unique: true },
    email: { type: 'varchar', required: true, unique: true },
    password: { type: 'varchar', required: true },
    matchmakingId: { type: 'varchar', required: true, unique: true },
    isServer: { type: 'boolean', default: false },
    currentSACCode: { type: 'varchar', default: null }
};

const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        created TIMESTAMP NOT NULL,
        banned BOOLEAN DEFAULT false,
        discord_id VARCHAR(255) UNIQUE NOT NULL,
        account_id VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(255) UNIQUE NOT NULL,
        username_lower VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        matchmaking_id VARCHAR(255) UNIQUE NOT NULL,
        is_server BOOLEAN DEFAULT false,
        current_sac_code VARCHAR(255) DEFAULT NULL
    );
`;

pool.query(createTableQuery).catch(console.error);

module.exports = { UserSchema };
