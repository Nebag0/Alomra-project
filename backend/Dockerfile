FROM node:18-alpine

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY . .
RUN mkdir -p uploads
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 5000
CMD ["node", "server.js"] 