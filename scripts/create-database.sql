-- Create database
CREATE DATABASE IF NOT EXISTS art__gallery;
USE art__gallery;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Artists table
CREATE TABLE IF NOT EXISTS artists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100),
    biography TEXT,
    date_of_birth DATE,
    date_of_death DATE NULL,
    art_piece VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exhibitions table
CREATE TABLE IF NOT EXISTS exhibitions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    ticket_price DECIMAL(10,2) NOT NULL,
    ticket_limit INT NOT NULL,
    ticket_sold INT DEFAULT 0,
    description TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tickets table
CREATE TABLE IF NOT EXISTS tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exhibition_id INT NOT NULL,
    user_id INT NOT NULL,
    tickets_purchased INT NOT NULL,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (exhibition_id) REFERENCES exhibitions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    payment_id VARCHAR(255) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    exhibition_id INT NOT NULL,
    tickets INT NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (exhibition_id) REFERENCES exhibitions(id) ON DELETE CASCADE
);

-- Create stored procedure for canceling tickets
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS cancel_ticket(
    IN exhibition_id_param INT,
    IN tickets_to_cancel_param INT
)
BEGIN
    DECLARE current_sold INT DEFAULT 0;
    
    -- Get current ticket sold count
    SELECT ticket_sold INTO current_sold 
    FROM exhibitions 
    WHERE id = exhibition_id_param;
    
    -- Check if we have enough sold tickets to cancel
    IF current_sold >= tickets_to_cancel_param THEN
        -- Update the ticket count
        UPDATE exhibitions 
        SET ticket_sold = ticket_sold - tickets_to_cancel_param 
        WHERE id = exhibition_id_param;
        
        SELECT 'Tickets canceled successfully' as status;
    ELSE
        SELECT 'Not enough tickets to cancel' as status;
    END IF;
END //
DELIMITER ;
