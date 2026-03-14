FROM node:20-slim

# Cài build tools để compile better-sqlite3
RUN apt-get update && \
    apt-get install -y python3 make gcc g++ && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files trước để cache layer
COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000
CMD ["node", "server.js"]
