import { Context } from 'koa';
import multer from '@koa/multer';
import path from 'path';
import { randomBytes } from 'crypto';

export function Uploader(folderName: string, fieldName: string, limits?: multer.Options['limits']) {
  console.log();

  const upload = multer({
    limits,
    storage: multer.diskStorage({
      destination: (_req, _file, cb) =>
        cb(null, path.join(__dirname, '../../../../public', folderName)),
      filename: (_req, file, cb) =>
        cb(null, `${randomBytes(16).toString('hex')}.${file.originalname.split('.')[1]}`)
    })
  });

  return function (_target: any, _methodName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (ctx: Context) {
      return await upload.single(fieldName)(ctx, async () => await originalMethod.call(this, ctx));
    };

    return descriptor;
  };
}
