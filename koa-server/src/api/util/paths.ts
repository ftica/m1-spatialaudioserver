import path from 'path';

const authFolder = path.join(__dirname, '../../auth');
const publicFolder = path.join(__dirname, '../../../public');
const tracksFolder = path.join(publicFolder, 'tracks');
const streamsFolder = path.join(publicFolder, 'streams');

export default {
  authFolder,
  publicFolder,
  tracksFolder,
  streamsFolder
};
