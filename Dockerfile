FROM node:13.1.0-alpine

WORKDIR usr/src/app

COPY . ./

RUN npm install

