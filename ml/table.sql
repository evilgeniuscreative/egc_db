CREATE TABLE emails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(255),
    message TEXT,
    site VARCHAR(255),
    ip VARCHAR(45),
    user_cookie VARCHAR(255),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ip VARCHAR(45),
    cookie_hash VARCHAR(255),
    reason VARCHAR(255),
    banned_at DATETIME DEFAULT CURRENT_TIMESTAMP
);  

CREATE TABLE admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255),
    password VARCHAR(255),
    reset_token VARCHAR(255),
    reset_expires DATETIME
);
    