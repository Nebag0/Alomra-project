# ./backend/Dockerfile

# Étape 1 : Builder l'application
FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

# Étape 2 : Créer l'image finale optimisée
FROM node:18-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app .
EXPOSE 5000
CMD ["node", "server.js"] 