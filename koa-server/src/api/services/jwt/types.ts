import { Jwt, JwtPayload } from 'jsonwebtoken';

export type Payload = string | object | Buffer;
export type JwtToken = string | JwtPayload | Jwt;
