import { Playlist, Prisma } from '@prisma/client';
import ModelService from './model-service';
import db from '../../koa/db';
import trackService from './track-service';

export class PlaylistService extends ModelService<Playlist, Prisma.PlaylistDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation>> {
  override async updateById(id: string, data: any, select?: any): Promise<any> {
    if (data.tracks) {
      const tran = await db.$transaction([
        ...data.tracks.map((track, index) => trackService.query.update({ where: { id: track }, data: { position: index, playlistId: id } }))
      ]);
      console.log('tran: ', tran);
      return await this.findById(id, select);
    }
    return await super.updateById(id, data, select);
  }
}

export default new PlaylistService('playlist');
