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
ENV ADMIN_TOKEN=cb62f201cc3b66cbdceb01d85c7dd616964b81590679a1085fac81b9c77ee72ee25083b00a05f26efa8a0ecc84189c77821889efa178947c7426f62f12ba27f4
EXPOSE 3000
CMD ["npm", "start"]
