# Build Image
FROM node:lts as build

RUN apt update

RUN apt install build-essential

WORKDIR /tmp/

COPY . .

RUN npm install
RUN npx tsc

WORKDIR /tmp/app/

RUN npm install
RUN npm run build

# Production Image
FROM node:lts

WORKDIR /app/

ENV NODE_ENV=production

COPY --from=build tmp/app/build/ /app/app/build/

COPY --from=build tmp/dist /app/dist
COPY --from=build tmp/package*.json /app/

RUN npm ci --production --ignore-scripts

RUN apt update

RUN apt install -y libudev-dev

CMD [ "node", "dist/main.js" ]