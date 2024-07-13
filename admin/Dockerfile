FROM node:20.14.0-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

COPY .env.local .env

RUN yarn run build

EXPOSE 3000

CMD ["yarn", "run", "start"] 
