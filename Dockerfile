FROM node:21-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Expõe a porta que sua aplicação Express vai ouvir (normalmente 3000 ou 8080)
EXPOSE 3000

CMD ["npm", "start"]
