FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install --save-dev @types/node

ENV CHOKIDAR_USEPOLLING=true

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
