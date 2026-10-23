FROM node:22-slim as build

WORKDIR /usr/src/app
COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json

RUN npm install --silent
COPY . /usr/src/app
RUN npm run build


FROM node:22-alpine

WORKDIR /usr/src/app
COPY --from=build /usr/src/app/.output /usr/src/app/.output
EXPOSE 3000
USER node

CMD ["node", ".output/server/index.mjs"]
