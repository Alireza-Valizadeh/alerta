# --------- STAGE 1: Build ---------
FROM node:20.19.0-alpine3.20 AS builder

WORKDIR /usr/src/app

# Install build dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Build the app using local CLI via npx
RUN npx nest build

# --------- STAGE 2: Production ---------
FROM node:20.19.0-alpine3.20

WORKDIR /usr/src/app

# Only copy the built app and necessary files
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

# Expose app port
EXPOSE 3000

# Run the app
CMD ["node", "dist/main"]
