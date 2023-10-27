# Stage 1: Build the Angular application
FROM node:18 as build

WORKDIR /app
COPY package*.json /app/
RUN npm install --legacy-peer-deps
COPY . /app/
RUN npm run build:prod

# Stage 2: Create the Nginx server
FROM nginx:alpine

# Copy the Angular build from the build stage to the Nginx server
COPY --from=build /app/dist /usr/share/nginx/html

# (Optional) Replace the default Nginx configuration with your own custom configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 4200

CMD ["nginx", "-g", "daemon off;"]
