FROM node:22.14-alpine3.21 AS client
WORKDIR /app
COPY client .
RUN npm ci && npm run build

FROM node:22.14-alpine3.21 AS server
WORKDIR /app
COPY server .
RUN npm ci && npm run build

FROM node:22.14-alpine3.21
WORKDIR /app
EXPOSE 3000
COPY --from=server /app/dist .
COPY --from=client /app/dist/client/browser ./client
COPY server/package*.json .
RUN npm ci --omit=dev
CMD ["node", "main.js"]