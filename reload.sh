docker stop bet
docker rm bet
docker build . -t bet365node
docker run -it -d -p 3000:3000 --name bet bet365node
docker logs bet