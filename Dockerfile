# write docker file for nodejs typescript sqlite app
# 1. use node:alpine as base image
# 2. set working directory to /app
# 3. copy package.json to /app 
# 4. run npm install
# 5. copy all files to /app
# 6. run npm run build
# 7. expose port 3000
# 8. run npm start

FROM node:19.5.0-alpine
RUN npm i -g pnpm
WORKDIR /usr/src/app
COPY package.json ./
COPY . .  
RUN pnpm install && npm run build
ENV DATABASE_URL="file:./database.db"
EXPOSE 3000
CMD ["npm", "start"]
