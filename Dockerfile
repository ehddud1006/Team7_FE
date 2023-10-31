# Build stage
FROM krmp-d2hub-idock.9rum.cc/goorm/node:18 AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /usr/src/app

# Install dependencies based on the preferred package manager
COPY /worksapce/Team7_FE/package.json ./package.json
