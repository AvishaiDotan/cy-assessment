FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p frontend-dist

RUN npm run build

RUN cp -R dist/* frontend-dist/
