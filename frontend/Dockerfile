# Use Bun as the base image
FROM oven/bun:1 as base

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies using Bun
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Production stage with Alpine + lightweight server
FROM alpine:latest

# Install Node.js (smaller than full Node.js image)
RUN apk add --no-cache nodejs npm

# Create app directory
WORKDIR /app

# Copy built assets from build stage
COPY --from=base /app/dist ./dist

# Copy server file
COPY server.js ./

# Install Express
RUN npm install express

# Expose port 80
EXPOSE 80

# Start the server
CMD ["node", "server.js"] 