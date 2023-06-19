import { ListPlaylistItems } from './ListPlaylistItems';
import { PlaylistRepo } from '../../../repos/PlaylistRepo';

const playlistRepo = new PlaylistRepo();
const listPlaylistItems = new ListPlaylistItems(playlistRepo);

export default listPlaylistItems;
