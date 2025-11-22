# Stage 1: Build the application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
# In your real environment, you would run 'npm install' here.
# Since this environment is restricted, we assume node_modules are handled outside.
# A real Dockerfile would have: RUN npm install

# Copy application source
COPY . .

# Build the application
# A real Dockerfile would have: RUN npm run build
# We will copy the pre-built dist folder in the next stage for this simulation.
# For a real project, you MUST uncomment the RUN commands.
# RUN npm run build

# Stage 2: Create the production image
FROM node:20-alpine

WORKDIR /usr/src/app

# It's a good practice to run the app as a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy built application from builder stage
# In a real build, you would copy from the builder stage:
# COPY --from=builder /usr/src/app/dist ./dist
# COPY --from=builder /usr/src/app/node_modules ./node_modules
# COPY --from=builder /usr/src/app/package.json ./package.json

# For this environment, we just copy the local files.
# You will need to build the project ('npm run build') locally first.
COPY --chown=appuser:appgroup ./dist ./dist
COPY --chown=appuser:appgroup ./package.json ./

# The following command is commented out because 'npm install' is restricted here.
# In a real production Dockerfile, you would install production dependencies.
# RUN npm install --production

# Expose the port the app runs on
EXPOSE 4000

# Command to run the application
CMD [ "node", "dist/main" ]
