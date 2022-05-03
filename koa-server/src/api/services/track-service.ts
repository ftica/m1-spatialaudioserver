import { Track } from '@prisma/client';
import { Context } from 'koa';
import ModelService from './model-service';

const tus = require('tus-node-server');
const tusServer = new tus.Server();

tusServer.datastore = new tus.FileStore({ path: '../..//public' });

tusServer.on(tus.EVENTS.EVENT_UPLOAD_COMPLETE, async (event) => {
  console.log(`Upload complete for file ${event.file.id}`);

  // return await ctx.prisma[this.table].create({
  //   data: {
  //     event
  //   },
  //   select: {}
  // });
});

export class TrackService extends ModelService<Track> {
  override async createOne(ctx: Context, data: Track, select: any = undefined): Promise<any> {
    return tusServer.handle(ctx.req, ctx.res);
    // return await ctx.prisma[this.table].create({ data, select });
  }
}

export default new TrackService('track');
