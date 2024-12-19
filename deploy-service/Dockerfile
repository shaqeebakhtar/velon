FROM ubuntu:focal

RUN apt-get update && \
    apt-get install -y curl && \
    apt-get upgrade -y && \
    apt-get install -y nodejs git && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /home/app

COPY package*.json .
RUN npm install

COPY main.sh script.ts ./

RUN chmod +x /home/app/main.sh
RUN chmod +x /home/app/script.ts

ENTRYPOINT [ "/home/app/main.sh" ]