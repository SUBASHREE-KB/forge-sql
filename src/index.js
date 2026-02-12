import Resolver from '@forge/resolver';
import { sql, migrationRunner } from '@forge/sql';

const resolver = new Resolver();

const CREATE_USERS_TABLE = `
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    dob DATE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);
`;

const migrations = migrationRunner.enqueue('v001_create_users_table',CREATE_USERS_TABLE);

export const runMigration = async () => {
    console.log("Running DB migration...");
    const result = await migrations.run();
    console.log("Migration result:", result);
    return result;
};

resolver.define('initDb', async () => {
    await runMigration();
    return { success: true, message: "Database initialized successfully" };
});



resolver.define('createUser', async ({ payload }) => {
    try {
        const { name, email, dob, phone } = payload;

        await sql
            .prepare(`INSERT INTO users (name, email, dob, phone) VALUES (?, ?, ?, ?)`)
            .bindParams(name, email, dob, phone)
            .execute();

        return { success: true, message: "User saved" };

    } catch (e) {
        console.error("Insert error:", e);
        return { success: false, message: e.message };
    }
});


resolver.define('getUsers', async () => {
    try {
        const result = await sql
            .prepare(`SELECT * FROM users ORDER BY id DESC`)
            .execute();

        return { success: true, users: result.rows };

    } catch (e) {
        console.error("Select error:", e);
        return { success: false, users: [] };
    }
});

export const handler = resolver.getDefinitions();
