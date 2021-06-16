
# Base os taken alpine to reduce the size
FROM node:14.16.1-alpine3.13

# Create app directory
WORKDIR /

Expose 8080
# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

CMD [ "node", "entry.js" ]
