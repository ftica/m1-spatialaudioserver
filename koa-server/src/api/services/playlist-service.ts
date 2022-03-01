import { Playlist } from '@prisma/client';
import Service from './service';

export class PlaylistService extends Service<Playlist> { }

export default new PlaylistService('playlist');
