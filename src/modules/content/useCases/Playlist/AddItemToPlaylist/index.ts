import { AddItemToPlaylist } from './AddItemToPlaylist';
import { PlaylistRepo } from '../../../repos/PlaylistRepo';

const playlistRepo = new PlaylistRepo();
const addItemToPlaylist = new AddItemToPlaylist(playlistRepo);

export default addItemToPlaylist;
