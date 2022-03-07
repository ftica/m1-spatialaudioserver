import { Playlist } from '@prisma/client';
import ModelService from './model-service';

export class PlaylistService extends ModelService<Playlist> { }

export default new PlaylistService('playlist');
