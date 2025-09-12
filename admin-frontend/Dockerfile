FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Install serve to run the app
RUN npm install -g serve

# Expose port 5030
EXPOSE 5030

# Start the application
CMD ["serve", "-s", "build", "-l", "5030"]
