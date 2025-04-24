# IGDB Webhook Manager

Dockerized application to manage webhooks.

<!-- toc -->

- [Developer environment](#developer-environment)
- [Starting the application via Docker](#starting-the-application-via-docker)
  * [docker-compose](#docker-compose)
  * [do it manually](#do-it-manually)
    + [Building the image](#building-the-image)
    + [Starting the container](#starting-the-container)

<!-- tocstop -->

## Developer environment

Install dependencies for client and server

```
cd client && npm ci
```

```
cd server && npm ci
```

When everything is installed, start the applications:

```
cd server && npm run start:dev
```

```
cd client && npm run start
```

## Starting the application via Docker

Either use docker-compose or build and start it manually.

### docker-compose
```
docker-compose up -d
```

The app is ready to use on http://localhost:3000

### do it manually

#### Building the image
```
docker build -t igdb-webhook-manager .
```

#### Starting the container
```
docker run -itd --name igdb-webhook-manager -p "3000:3000" igdb-webhook-manager
```

The app is ready to use on http://localhost:3000