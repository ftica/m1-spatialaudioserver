import { Context } from 'koa';
import fs from 'fs';
import path from 'path';

export function Stream(folderPath: string) {
  if (!fs.existsSync(folderPath)) {
    throw new Error('Folder not found');
  }

  return function (_target: any, _methodName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (ctx: Context) {
      const filePath = path.join(folderPath, ctx.params.file);

      if (!fs.existsSync(filePath)) {
        return ctx.throw('File not found', 404);
      }

      const extension = ctx.params.file.split('.')[1];

      if (extension === 'm3u8') {
        ctx.set('Content-Type', 'application/x-mpegURL');
        ctx.body = fs.createReadStream(filePath);
      }

      if (extension === 'ts') {
        ctx.set('Content-Type', 'audio/x-wav');
        ctx.body = fs.createReadStream(filePath, { highWaterMark: 64 * 1024 });
      }

      return await originalMethod.call(this, ctx);
    };

    return descriptor;
  };
}
