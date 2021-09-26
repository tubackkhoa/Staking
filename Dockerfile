FROM node:14-alpine
RUN mkdir /app
WORKDIR /app
ADD . /app
RUN cd /app
RUN yarn 
RUN yarn dev