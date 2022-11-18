FROM node:19-alpine3.15

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --save --legacy-peer-deps
COPY . .
RUN npm run build

CMD [ "node","./dist/main.js" ]
