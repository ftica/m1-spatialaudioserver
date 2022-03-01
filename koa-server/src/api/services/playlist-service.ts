import { Playlist } from '@prisma/client';
import Service from './service';

class PlaylistService extends Service<Playlist> {
  constructor() {
    super('playlist');
  }
}

export default new PlaylistService();
