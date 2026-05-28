#!/bin/bash
# Database setup script — run with: sudo bash setup_db.sh

set -e

echo "🔧 Setting up TaskManager database..."

# Create role for the current user if it doesn't exist
sudo -u postgres psql -c "DO \$\$ BEGIN IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'shridhar') THEN CREATE ROLE shridhar WITH LOGIN CREATEDB; END IF; END \$\$;" 2>/dev/null

# Create the database
sudo -u postgres psql -c "CREATE DATABASE taskmanager OWNER shridhar;" 2>/dev/null || echo "Database may already exist, continuing..."

# Run migrations
sudo -u postgres psql -d taskmanager -f "$(dirname "$0")/migrations/001_init.sql"

# Grant privileges
sudo -u postgres psql -d taskmanager -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO shridhar;"
sudo -u postgres psql -d taskmanager -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO shridhar;"

echo "✅ Database setup complete!"
echo "Connection string: postgresql://shridhar@localhost:5432/taskmanager"
