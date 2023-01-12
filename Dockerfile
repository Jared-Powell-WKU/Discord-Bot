FROM node:latest
WORKDIR /src/
COPY src/ /src/
RUN npm install
ENTRYPOINT ["node", "index.js"]