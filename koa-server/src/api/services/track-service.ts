import { Track } from '@prisma/client';
import ModelService from './model-service';

export class TrackService extends ModelService<Track> { }

export default new TrackService('track');
