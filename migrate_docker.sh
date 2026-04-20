#!/bin/bash
set -e

echo "Starting Docker data migration..."

# 1. Stop Docker
echo "Stopping Docker services..."
sudo systemctl stop docker docker.socket

# 2. Create the new directory on the larger partition
echo "Copying data to /media/ankit/docker-data (this may take a while depending on size)..."
sudo mkdir -p /media/ankit/docker-data
sudo cp -a /var/lib/docker/. /media/ankit/docker-data/

# 3. Tell Docker to use the new directory
echo "Updating /etc/docker/daemon.json..."
echo '{"data-root": "/media/ankit/docker-data"}' | sudo tee /etc/docker/daemon.json > /dev/null

# 4. Restart Docker
echo "Starting Docker services..."
sudo systemctl start docker

# 5. Verify Docker is using the new location
ROOT_DIR=$(docker info -f '{{.DockerRootDir}}')
echo "Current Docker Root Directory is: $ROOT_DIR"

if [ "$ROOT_DIR" = "/media/ankit/docker-data" ]; then
    echo "SUCCESS: Docker is now using /media/ankit/docker-data!"
    echo "You can now safely remove the old data by running: sudo rm -rf /var/lib/docker"
else
    echo "ERROR: Docker Root Directory is still $ROOT_DIR. Something went wrong."
fi
