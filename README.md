Building the image:
```
docker build -t igdb-webhook-manager .
```

Starting the container
```
docker run -itd --name igdb-webhook-manager -p "3000:3000" igdb-webhook-manager
```

OR

```
docker-compose up -d
```