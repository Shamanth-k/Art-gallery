-- Insert sample admin user (password: admin123)
INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@futuregallery.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Insert sample artists
INSERT INTO artists (name, country, biography, date_of_birth, art_piece) VALUES 
('Maya Chen', 'Singapore', 'Digital artist specializing in AI-generated landscapes and futuristic cityscapes. Her work explores the intersection of technology and nature.', '1985-03-15', 'Neon Dreams'),
('Alex Rivera', 'Mexico', 'VR sculptor creating immersive 3D experiences. Known for blending traditional Mexican art with cutting-edge virtual reality technology.', '1990-07-22', 'Virtual Aztec'),
('Zara Al-Rashid', 'UAE', 'Holographic installation artist pushing the boundaries of light and space. Her work has been featured in galleries across the Middle East.', '1988-11-08', 'Light Fragments'),
('Kai Nakamura', 'Japan', 'Cyberpunk photographer capturing the essence of modern Tokyo through augmented reality filters and digital manipulation.', '1992-01-30', 'Tokyo 2099'),
('Elena Volkov', 'Russia', 'Quantum art pioneer using particle physics principles to create ever-changing digital masterpieces.', '1987-09-12', 'Quantum Flux');

-- Insert sample exhibitions
INSERT INTO exhibitions (name, start_date, end_date, location, ticket_price, ticket_limit, description) VALUES 
('Digital Renaissance', '2024-02-01 10:00:00', '2024-03-15 18:00:00', 'Virtual Gallery Alpha', 25.00, 500, 'Experience the rebirth of art in the digital age. This groundbreaking exhibition features works from leading digital artists who are redefining creativity through technology.'),
('Neon Futures', '2024-02-15 12:00:00', '2024-04-01 20:00:00', 'Metaverse Plaza', 35.00, 300, 'Step into a world of vibrant colors and electric dreams. Neon Futures showcases cyberpunk-inspired artworks that illuminate our technological destiny.'),
('AI Consciousness', '2024-03-01 09:00:00', '2024-04-30 17:00:00', 'Neural Network Hub', 45.00, 200, 'Explore the fascinating world of artificial intelligence through art. This exhibition questions the nature of consciousness and creativity in the age of AI.'),
('Holographic Visions', '2024-03-15 11:00:00', '2024-05-15 19:00:00', 'Light Chamber Studios', 30.00, 400, 'Immerse yourself in three-dimensional light sculptures that exist between reality and imagination. A truly otherworldly experience.'),
('Quantum Realities', '2024-04-01 10:30:00', '2024-06-01 16:30:00', 'Particle Physics Center', 50.00, 150, 'Journey into the quantum realm where art meets science. These installations respond to quantum fluctuations in real-time.');
