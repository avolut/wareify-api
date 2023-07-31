// src/validations.ts
import * as t from 'io-ts';

// Define your request body validations using io-ts
export const LoginSchema = t.type({
  email: t.string,
  password: t.string,
  // Add more fields as needed
});