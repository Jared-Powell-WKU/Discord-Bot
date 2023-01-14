FROM node:latest
WORKDIR /src/
COPY src/ /src/
RUN npm install
RUN node deploy.js
ENTRYPOINT ["node", "index.js"]