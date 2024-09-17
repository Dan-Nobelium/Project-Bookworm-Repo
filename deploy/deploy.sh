#!/bin/bash

# install ufw (uncomplicated firewall)
apt update && apt install ufw -y

# allow outgoing connections, block all incoming except http/https
ufw default deny incoming
ufw default allow outgoing
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

cd ~

# config nginx
mkdir data letsencrypt
chmod 777 data letsencrypt

# config jatos
cat > ./jatos.conf << EOL
include "application.conf"
jatos.user.password.length = 8
EOL
mkdir jatos-data jatos-logs
chmod 777 jatos-data jatos-logs

# config filebrowser
mkdir filebrowser
chmod 777 filebrowser
touch filebrowser/database.db
cat >./filebrowser/.filebrowser.json << EOL
{
  "port": 8080,
  "baseURL": "",
  "address": "",
  "log": "stdout",
  "database": "/database.db",
  "root": "/srv"
}
EOL

# create docker compose
cat >./compose.yaml <<EOL
version: "3.8"

name: researchproject
services:
  proxy:
    image: jc21/nginx-proxy-manager:2.10.4
    restart: unless-stopped
    ports:
      - 80:80
      - 443:443
      - 81:81
    depends_on:
      jatos:
        condition: service_healthy
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsecrypt

  jatos:
    image: jatos/jatos:3.9.3
    restart: unless-stopped
    ports:
      - 9000:9000
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/ping"]
      interval: 2s
      timeout: 2s
      retries: 1000
      start_period: 10s
    volumes:
      - ./jatos-logs:/opt/jatos/logs
      - ./jatos-data:/opt/jatos_data
      - ./jatos.conf:/opt/jatos/conf/jatos.conf:ro

  filebrowser:
    image: filebrowser/filebrowser:v2.31.1
    restart: unless-stopped
    ports:
      - 8080:8080
    depends_on:
      jatos:
        condition: service_healthy
    volumes:
      - ./jatos-data/study_assets_root:/srv
      - ./filebrowser/database.db:/database.db
      - ./filebrowser/.filebrowser.json:/.filebrowser.json
    environment:
      - PUID=1000
      - GUID=1000
EOL

docker compose -f ./compose.yaml up -d
