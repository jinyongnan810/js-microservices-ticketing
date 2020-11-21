FROM node:alpine
ENV CI=true

WORKDIR /app
COPY ./package.json ./
# ignore dev dependencies
RUN npm install --only=prod

COPY ./ ./

CMD ["npm","run","dev"]