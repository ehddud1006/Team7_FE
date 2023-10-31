# Build stage
FROM krmp-d2hub-idock.9rum.cc/goorm/node:18 AS base

# yarn 설치
RUN npm install -g yarn
