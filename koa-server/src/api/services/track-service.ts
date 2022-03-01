import { Track } from '@prisma/client';
import Service from './service';

export class TrackService extends Service<Track> { }

const trackService = new TrackService('track');

export default trackService;
