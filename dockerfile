FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

RUN npm run build --prod

EXPOSE 4200

CMD ["npx", "http-server", "dist/notraffic", "-p", "4200", "-a", "0.0.0.0"]
