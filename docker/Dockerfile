# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY nodemon.json ./

# Install dependencies (including dev)
RUN npm ci

# Copy source code
COPY src ./src

# Compile TypeScript to JavaScript (output to dist/)
RUN npm run build

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Copy only necessary artifacts from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Install only production dependencies (optional, but we already copied node_modules)
# If you want to be stricter, run `npm ci --only=production` in builder and copy that.

# Expose port (default 3000)
EXPOSE 3000

# Healthcheck (optional)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {r.statusCode === 200 ? process.exit(0) : process.exit(1)})"

# Run the compiled server
CMD ["node", "dist/server.js"]