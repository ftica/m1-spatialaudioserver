import { Prisma, Track } from '@prisma/client';
import ModelService from './model-service';

export class TrackService extends ModelService<Track, Prisma.TrackDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation>> {
  async upload(data: any, select?: any) {
    return await this.createOne(data, select);
  }
}

export default new TrackService('track');
