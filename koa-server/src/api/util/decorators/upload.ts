import { Context } from 'koa';
import path from 'path';
import multer from '@koa/multer';

export const uploadPath = path.join(__dirname, '../../../../public');

export function Uploader(fieldName: string, limits?: multer.Options['limits']) {
  const upload = multer({
    limits,
    storage: multer.diskStorage({
      destination: (_req, _file, cb) =>
        cb(null, uploadPath),
      filename: (_req, file, cb) =>
        cb(null, `${file.fieldname}-${Date.now().toString(16)}.${file.originalname.split('.')[1]}`)
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
