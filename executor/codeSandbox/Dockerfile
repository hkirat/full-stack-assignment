FROM ubuntu:latest

RUN mkdir code-exec
COPY . /code-exec

WORKDIR /code-exec

RUN apt-get update && \
apt-get -y install sudo

RUN useradd -m docker && echo "docker:docker" | chpasswd && adduser docker sudo
RUN echo "docker ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

RUN sudo apt update && sudo apt install -y g++ && sudo apt install time
CMD ["sudo", "chmod", "+x", "./run.sh"]
ENTRYPOINT [ "./run.sh" ]