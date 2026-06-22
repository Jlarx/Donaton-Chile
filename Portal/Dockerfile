# Portal Dockerfile
FROM node:20-alpine AS build
WORKDIR /app

# Copy the specific package structure needed
COPY package.json package-lock.json* ./
# Since ui-donaton is locally linked via file:./packages/ui-donaton, we must copy it before install
COPY packages/ui-donaton ./packages/ui-donaton

# Install dependencies
RUN npm install

# Copy the rest of the Portal source code
COPY . .

# Build the Vite application
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Update Nginx config to support SPA routing (Vite)
RUN echo 'server { \
    listen       80; \
    server_name  localhost; \
    location / { \
        root   /usr/share/nginx/html; \
        index  index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
