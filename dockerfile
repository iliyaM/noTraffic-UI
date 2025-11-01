FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --prod

# ---- RUNTIME IMAGE ----
FROM node:20-alpine
WORKDIR /usr/src/app

RUN npm install -g http-server

COPY --from=build /usr/src/app/dist/notraffic/browser ./dist

EXPOSE 4200

CMD ["http-server", "dist", "-p", "4200", "-a", "0.0.0.0", "-P", "http://0.0.0.0:4200?"]
