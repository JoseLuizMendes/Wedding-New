-- V1__initial_schema.sql
-- Initial database schema for Wedding API

CREATE TABLE guests (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    invite_code VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rsvps (
    id BIGSERIAL PRIMARY KEY,
    guest_id BIGINT REFERENCES guests(id),
    event_type VARCHAR(20) NOT NULL,
    attending BOOLEAN DEFAULT true,
    guests_count INTEGER DEFAULT 1,
    message TEXT,
    confirmed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE gifts (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    price DECIMAL(10,2),
    event_type VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'AVAILABLE',
    reserved_by VARCHAR(255),
    reserved_by_phone VARCHAR(50),
    reservation_code VARCHAR(10),
    reserved_at TIMESTAMP,
    purchased_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX idx_gifts_event_type ON gifts(event_type);
CREATE INDEX idx_gifts_status ON gifts(status);
CREATE INDEX idx_rsvps_event_type ON rsvps(event_type);
CREATE INDEX idx_guests_phone ON guests(phone);
CREATE INDEX idx_guests_invite_code ON guests(invite_code);
