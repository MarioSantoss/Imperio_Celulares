CREATE DATABASE IF NOT EXISTS imperio_crud
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE imperio_crud;

CREATE TABLE IF NOT EXISTS customers (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX customers_phone_index (phone)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY users_email_unique (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS products (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS sales (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    customer_id BIGINT UNSIGNED NULL,
    user_id BIGINT UNSIGNED NULL,
    total DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'concluida',
    sold_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX sales_sold_at_index (sold_at),
    CONSTRAINT sales_customer_id_foreign
        FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE SET NULL,
    CONSTRAINT sales_user_id_foreign
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS sale_items (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    sale_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    quantity INT UNSIGNED NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX sale_items_sale_product_index (sale_id, product_id),
    CONSTRAINT sale_items_sale_id_foreign
        FOREIGN KEY (sale_id) REFERENCES sales (id) ON DELETE RESTRICT,
    CONSTRAINT sale_items_product_id_foreign
        FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE RESTRICT
) ENGINE=InnoDB;

INSERT INTO customers (id, name, phone) VALUES
    (1, 'Ana Souza', '(11) 99999-1001'),
    (2, 'Bruno Lima', '(11) 99999-1002'),
    (3, 'Carla Mendes', '(11) 99999-1003')
ON DUPLICATE KEY UPDATE name = VALUES(name), phone = VALUES(phone);

INSERT INTO users (id, name, email) VALUES
    (1, 'Mario', 'mario@imperiocelulares.com'),
    (2, 'Cristina', 'cristina@imperiocelulares.com')
ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email);

INSERT INTO products (id, name, brand) VALUES
    (1, 'iPhone 15 128GB', 'Apple'),
    (2, 'Galaxy A55 256GB', 'Samsung')
ON DUPLICATE KEY UPDATE name = VALUES(name), brand = VALUES(brand);

INSERT INTO sales (id, customer_id, user_id, total, payment_method, status, sold_at) VALUES
    (1, 1, 1, 4299.90, 'Pix', 'concluida', '2026-10-28 09:00:00'),
    (2, 2, 2, 2199.00, 'Cartao', 'concluida', '2026-10-28 10:30:00'),
    (3, 3, 1, 1899.90, 'Dinheiro', 'concluida', '2026-10-29 11:15:00'),
    (4, 1, 2, 3299.00, 'Pix', 'concluida', '2026-10-29 14:20:00'),
    (5, 2, 1, 1499.90, 'Cartao', 'concluida', '2026-10-30 09:45:00'),
    (6, 3, 2, 2799.00, 'Pix', 'concluida', '2026-10-30 16:10:00'),
    (7, 1, 1, 999.90, 'Dinheiro', 'concluida', '2026-10-31 10:00:00'),
    (8, 2, 2, 3599.90, 'Cartao', 'concluida', '2026-11-01 12:25:00'),
    (9, 3, 1, 1699.00, 'Pix', 'concluida', '2026-11-02 15:40:00'),
    (10, 1, 2, 2399.90, 'Cartao', 'concluida', '2026-11-03 17:05:00')
ON DUPLICATE KEY UPDATE
    customer_id = VALUES(customer_id),
    user_id = VALUES(user_id),
    total = VALUES(total),
    payment_method = VALUES(payment_method),
    status = VALUES(status),
    sold_at = VALUES(sold_at);

INSERT INTO sale_items (id, sale_id, product_id, quantity, unit_price, subtotal) VALUES
    (1, 1, 1, 1, 4299.90, 4299.90)
ON DUPLICATE KEY UPDATE
    sale_id = VALUES(sale_id),
    product_id = VALUES(product_id),
    quantity = VALUES(quantity),
    unit_price = VALUES(unit_price),
    subtotal = VALUES(subtotal);
