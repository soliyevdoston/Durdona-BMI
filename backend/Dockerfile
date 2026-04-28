FROM node:20-alpine

WORKDIR /app

# Dependencies
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

# Source code
COPY . .

# Build
RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]
