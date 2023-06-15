import { CreatePlaylist } from './CreatePlaylist';
import { PlaylistRepo } from '../../../repos/PlaylistRepo';

const playlistRepo = new PlaylistRepo();
const createPlaylist = new CreatePlaylist(playlistRepo);

export default createPlaylist;
