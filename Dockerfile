FROM node:7.2.0-alpine

ENV NODE_ENV production
ENV VERSION dev

RUN npm install unblock-netease-music@${VERSION} -g && npm cache clean

EXPOSE 8123

ENTRYPOINT ["unblockneteasemusic"]
CMD ["-h"]
