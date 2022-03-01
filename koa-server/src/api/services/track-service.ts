import { Track } from '@prisma/client';
import Service from './service';

class TrackService extends Service<Track> {
  constructor() {
    super('track');
  }
}

export default new TrackService();
