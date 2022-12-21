FROM node
WORKDIR /app
ENV MEDIA_OUTPUT_FOLDER=output
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install
COPY . .
CMD ["npm", "start"]
