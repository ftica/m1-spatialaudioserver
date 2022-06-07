import { Playlist, Prisma } from '@prisma/client';
import ModelService from './model-service';
import db from '../../koa/db';
import trackService from './track-service';

export class PlaylistService extends ModelService<Playlist, Prisma.PlaylistDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation>> {
  override async updateById(id: string, data: any, select?: any): Promise<any> {
    if (data.tracks) {
      await db.$transaction([
        ...data.tracks.map((track: string, index: number) => trackService.query.update({ select: { position: true }, where: { id: track }, data: { position: index, playlistId: id } }))
      ]);
      return await this.findById(id, select);
    }
    return await super.updateById(id, data, select);
  }

  async hasAccess(userId: string, playlistId: string) {
    return await db.playlistAcessControl.count({ where: { userId, playlistId } }) > 0;
  }
}

export default new PlaylistService('playlist');
