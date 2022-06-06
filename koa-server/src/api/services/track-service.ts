import { Prisma, Track } from '@prisma/client';
import ffmpeg from 'fluent-ffmpeg';
import { Context } from 'koa';
import path from 'path';
import ModelService from './model-service';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import paths from '../util/paths';

ffmpeg.setFfmpegPath(ffmpegPath);

export class TrackService extends ModelService<Track, Prisma.TrackDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation>> {
  async upload(ctx: Context, data: any, select?: any) {
    const streamFilename = ctx.file.filename.split('.')[0] + '.m3u8';
    ffmpeg(ctx.file.path, { timeout: 432000 })
      .addOptions([
        '-start_number 0', // start the first .ts segment at index 0
        '-hls_time 10', // 10 second segment duration
        '-hls_list_size 0', // Maxmimum number of playlist entries (0 means all entries/infinite)
        '-f hls' // HLS format
      ])
      .output(path.join(paths.streamsFolder, streamFilename))
      .on('end', () => {
        this.updateOne({ filename: ctx.file.filename }, { uploaded: true }, { id: true });
      })
      .run();
    return await this.createOne(data, select);
  }
}

export default new TrackService('track');
