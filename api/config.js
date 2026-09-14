import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kinosfera',
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4'
};

export const pool = mysql.createPool(dbConfig);

export async function initializeDatabase() {
  const adminConnection = await mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    charset: dbConfig.charset
  });

  try {
    await adminConnection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await adminConnection.query(`USE ${dbConfig.database}`);

    await adminConnection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(80) NOT NULL,
        email VARCHAR(190) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY users_email_unique (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    const [columns] = await adminConnection.query(`SHOW COLUMNS FROM users LIKE 'role'`);
    if (!columns.length) {
      await adminConnection.query(`ALTER TABLE users ADD COLUMN role ENUM('user', 'admin') NOT NULL DEFAULT 'user' AFTER password_hash`);
    }

    await adminConnection.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        article_key VARCHAR(40) NOT NULL,
        user_id INT UNSIGNED NOT NULL,
        name VARCHAR(80) NOT NULL,
        text TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY idx_comments_article (article_key),
        KEY idx_comments_user (user_id),
        CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await adminConnection.query(`
      CREATE TABLE IF NOT EXISTS articles (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        slug VARCHAR(80) NOT NULL,
        section VARCHAR(80) NOT NULL,
        title VARCHAR(180) NOT NULL,
        subtitle TEXT NOT NULL,
        year VARCHAR(50) NOT NULL,
        image TEXT NOT NULL,
        body JSON NOT NULL,
        fact TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY articles_slug_unique (slug)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await adminConnection.query(`
      CREATE TABLE IF NOT EXISTS tags (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(80) NOT NULL,
        PRIMARY KEY (id),
        UNIQUE KEY tags_name_unique (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await adminConnection.query(`
      CREATE TABLE IF NOT EXISTS article_tags (
        article_id INT UNSIGNED NOT NULL,
        tag_id INT UNSIGNED NOT NULL,
        PRIMARY KEY (article_id, tag_id),
        KEY idx_article_tags_tag (tag_id),
        CONSTRAINT fk_article_tags_article FOREIGN KEY (article_id) REFERENCES articles (id) ON DELETE CASCADE,
        CONSTRAINT fk_article_tags_tag FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@kinosfera.local';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const [adminRows] = await pool.execute('SELECT id FROM users WHERE email = ?', [adminEmail]);
    if (!adminRows.length) {
      const passwordHash = await bcrypt.hash(adminPassword, 12);
      await pool.execute(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        ['Администратор', adminEmail, passwordHash, 'admin']
      );
    }
  } finally {
    await adminConnection.end();
  }
}

export function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role || 'user' };
}

export function validateCredentials(name, email, password, isRegistration = false) {
  if (isRegistration && (name.length < 2 || name.length > 80)) {
    return 'Имя должно содержать от 2 до 80 символов.';
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return 'Введите корректный email.';
  }

  if (password.length < 6) {
    return 'Пароль должен содержать минимум 6 символов.';
  }

  return null;
}
