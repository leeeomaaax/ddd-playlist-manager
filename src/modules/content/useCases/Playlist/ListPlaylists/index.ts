import { ListPlaylists } from './ListPlaylists';
import { PlaylistRepo } from '../../../repos/PlaylistRepo';

const playlistRepo = new PlaylistRepo();
const listPlaylists = new ListPlaylists(playlistRepo);

export default listPlaylists;
