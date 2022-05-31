import { Context } from 'koa';
import { Track } from '@prisma/client';
import ModelService from './model-service';
// import { randomInt } from 'crypto';

export class TrackService extends ModelService<Track> {
  async upload(ctx: Context, data?: any) {
    console.log('ctx.files', ctx.files);

    return 'Uploaded';

    // // @ts-ignore
    // console.log('request', ctx.req.filename);
    // // @ts-ignore
    // data.name ??= ctx.req.filename || 'Default name';
    // data.playlistId ??= 'b07dcb33-7974-434b-98a5-80c3a4549e03';
    // data.position ??= randomInt(10, 10000);
    // const track = await super.createOne(data, { id: true });
    // // @ts-ignore
    // ctx.req.filename = track.id as string;
  }
}

export default new TrackService('track');
