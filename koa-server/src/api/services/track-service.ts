import { Track } from '@prisma/client';
import ModelService from './model-service';

export class TrackService extends ModelService<Track> { }

const trackService = new TrackService('track');

export default trackService;
