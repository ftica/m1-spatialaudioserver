// import { Context, Next } from 'koa';
// import { Role } from '@prisma/client';
// import { Token } from '../../api/services/jwt-service';

// export const authorize = (testToken: (token: Token) => boolean) =>
//   async (ctx: Context, next: Next) => {
//     if (!testToken(ctx.token)) {
//       ctx.throw(403, 'Unauthorized!');
//     }

//     await next();
//   };

// export const hasAnyRole = (...roles: Role[]) =>
//   authorize((token: Token) => roles.includes(token.role));
