FROM node:18 as build

# Add the source code to app
WORKDIR /usr/src/app

COPY package*.json ./
# Install all the dependencies
RUN npm install --legacy-peer-deps

COPY . .
# Generate the build of the application
RUN npm run build:prod

EXPOSE 4200

CMD ["npm", "start"]