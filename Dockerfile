# Use an official Node.js runtime as a parent image
FROM node:20.19.0-alpine3.20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code from your machine to the container
COPY . .

# Build the Nest.js application
RUN npm run build

# Expose the port your application listens on
EXPOSE 3000

# Command to run the application
CMD [ "npm", "run", "start" ]