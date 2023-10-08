import { rest } from 'msw';
import { emailCheckResponse, emailCodeCheckResponse, joinResponse, loginResponse } from '@/mocks/fixtures/auth';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const authHandler = [
  rest.post(`${BASE_URL}/email/check`, (req, res, ctx) => {
    return res(ctx.json(emailCheckResponse));
  }),
  rest.post(`${BASE_URL}/email/code/check`, (req, res, ctx) => {
    return res(ctx.json(emailCodeCheckResponse));
  }),
  rest.post(`${BASE_URL}/join`, (req, res, ctx) => {
    return res(ctx.json(joinResponse));
  }),
  rest.post(`${BASE_URL}/login`, (req, res, ctx) => {
    return res(ctx.json(loginResponse));
  }),
];
