FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Install WITHOUT running postinstall
RUN npm install --ignore-scripts

# Copy source
COPY . .

# Build manually
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/boot.js"]
