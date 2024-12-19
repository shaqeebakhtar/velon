FROM ubuntu:focal

RUN apt-get update && \
    apt-get install -y curl && \
    apt-get upgrade -y && \
    apt-get install -y nodejs git && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /home/app
COPY main.sh main.sh
RUN chmod +x /home/app/main.sh

ENTRYPOINT [ "/home/app/main.sh" ]