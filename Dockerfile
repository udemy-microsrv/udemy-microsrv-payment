FROM node:22-alpine3.21

env PORT=3000
env STRIPE_SECRET_KEY=
env STRIPE_SUCCESS_URL="http://localhost:3001/payments/successful"
env STRIPE_CANCEL_URL="http://localhost:3001/payments/canceled"
env STRIPE_WEBHOOK_SECRET=

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
