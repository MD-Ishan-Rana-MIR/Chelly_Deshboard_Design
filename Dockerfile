# Stage 1: Build the React application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy all source files and build the project
COPY . .

# Declare Build Arguments and Environment Variables
ARG VITE_BASE_URL
ENV VITE_BASE_URL=$VITE_BASE_URL

ARG IMG_URL
ENV IMG_URL=$IMG_URL

ARG VITE_YOUTUBE_API_KEY
ENV VITE_YOUTUBE_API_KEY=$VITE_YOUTUBE_API_KEY
RUN npm run build 

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 for internal Docker network communication
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]