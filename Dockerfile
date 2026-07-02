# Stage 1: Build the React application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy all source files and build the project
COPY . .

# Declare Build Arguments and Environment Variables
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

ARG VITE_IMAGE_URL
ENV VITE_IMAGE_URL=$VITE_IMAGE_URL

ARG VITE_REVERB_APP_KEY
ENV VITE_REVERB_APP_KEY=$VITE_REVERB_APP_KEY

ARG VITE_REVERB_HOST
ENV VITE_REVERB_HOST=$VITE_REVERB_HOST

ARG VITE_REVERB_PORT
ENV VITE_REVERB_PORT=$VITE_REVERB_PORT

ARG VITE_REVERB_SCHEME
ENV VITE_REVERB_SCHEME=$VITE_REVERB_SCHEME

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
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