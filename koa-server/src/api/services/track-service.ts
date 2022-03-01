import { Track } from '@prisma/client';
import Service from './service';

class TrackService extends Service<Track> {

}

export default new TrackService('track');
