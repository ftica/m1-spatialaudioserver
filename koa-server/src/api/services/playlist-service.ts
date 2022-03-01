import { Playlist } from '@prisma/client';
import Service from './service';

class PlaylistService extends Service<Playlist> { }

export default new PlaylistService('playlist');
