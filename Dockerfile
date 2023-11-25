# Build Image
FROM node:lts-alpine as build

WORKDIR /tmp/

COPY /app/package.json ./app/
COPY /app/package-lock.json ./app/

WORKDIR ./app/

RUN npm install

COPY . .

RUN npm run build

WORKDIR ../

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

RUN npx tsc

# Production Image
FROM node:lts-alpine

WORKDIR /app/

ENV NODE_ENV=production

COPY --from=build tmp/app/build/ ./app/build/

COPY --from=build tmp/dist ./dist
COPY --from=build tmp/package*.json ./

RUN npm ci --production --ignore-scripts

CMD [ "node", "dist/main.js" ]