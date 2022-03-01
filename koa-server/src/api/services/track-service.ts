import { Track } from '@prisma/client';
import Service from './service';

class TrackService extends Service<Track> { }

const trackSrv = new TrackService('track');

export default trackSrv;
