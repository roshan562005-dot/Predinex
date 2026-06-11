#!/bin/bash
set -e

# 1. Ensure the directory for the database exists
# (litestream restore requires the parent directory to exist)
mkdir -p $(dirname "./predinex.db")

# 2. Restore the database if it does not already exist.
# This happens automatically when deploying to a fresh server.
if [ -f "./predinex.db" ]; then
    echo "Database already exists, skipping restore."
else
    echo "No database found. Attempting to restore from replica..."
    # The --if-replica-exists flag prevents litestream from failing if there are no backups yet (e.g. first run)
    litestream restore -if-replica-exists -config ./litestream.yml ./predinex.db
fi

# 3. Start litestream replication in the background
echo "Starting litestream replication..."
litestream replicate -config ./litestream.yml &

# 4. Start the Next.js application in the foreground
echo "Starting Next.js..."
npm run start
