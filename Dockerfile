#Dependências
FROM node:22.14.0-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm install --frozen-lockfile

#Build
FROM node:22.14.0-alpine AS builder

WORKDIR /app

COPY . .

COPY .env .env

COPY --from=deps /app/node_modules ./node_modules

RUN npm run build

#Running
FROM node:22.14.0-alpine AS runner

WORKDIR /usr/app

COPY --from=builder /app/dist ./dist

COPY package.json ./

COPY .env .env

RUN npm install --production

USER node

EXPOSE 3333

CMD ["npm", "start"]