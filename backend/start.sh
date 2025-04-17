#!/bin/bash
# Ensure database directory exists
mkdir -p /var/lib/render

# Set proper permissions
chmod -R 755 /var/lib/render

# Start the application
node server.js