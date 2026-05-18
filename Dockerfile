# Use Node.js for building the app
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
# Need to build the Vite app
RUN npm run build

# Use Nginx to serve the static files
FROM nginx:alpine

# Copy the build output to Nginx's HTML directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Replace default Nginx configuration to support SPA routing
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
