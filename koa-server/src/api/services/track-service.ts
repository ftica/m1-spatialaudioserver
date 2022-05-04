import { Context } from 'koa';
import { Track } from '@prisma/client';
import ModelService from './model-service';
import { Server, DataStore, EVENTS } from 'tus-node-server';
import { randomInt } from 'crypto';

const tusServer = new Server();
tusServer.datastore = new DataStore({ path: '/public' });

tusServer.on(EVENTS.EVENT_UPLOAD_COMPLETE, (event) => {
  console.log(`Upload complete for file ${event.file.id}`);
  console.log('event', event);
});

export class TrackService extends ModelService<Track> {
  async upload(ctx: Context, data?: any) {
    // @ts-ignore
    console.log('request', ctx.req.filename);
    // @ts-ignore
    data.name ??= ctx.req.filename || 'Default name';
    data.playlistId ??= 'b07dcb33-7974-434b-98a5-80c3a4549e03';
    data.position ??= randomInt(10, 10000);
    const track = await super.createOne(data, { id: true });
    // @ts-ignore
    ctx.req.filename = track.id as string;
    return tusServer.handle(ctx.req, ctx.res);
  }
}

export default new TrackService('track');
