FROM node:18.19.0

# Create app directory
RUN mkdir -p /api
WORKDIR /api
COPY package.json .
RUN yarn install
COPY . .
CMD ["yarn", "start:dev"]
