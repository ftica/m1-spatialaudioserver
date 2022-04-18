// eslint-disable-next-line
import FetchHelper from '../utils';

const defaultState = () => ({
  // playlist: {
  //   id: undefined,
  //   name: undefined,
  //   tracks: undefined,
  //   permissions: undefined,
  //   visibility: undefined,
  // },
  items: [],
});

const api = new FetchHelper('playlists');

const actions = {
  async getAll({ commit }) {
    const playlists = await api.get();
    commit('setPlaylists', playlists.map((playlist, index) => ({ number: index + 1, ...playlist })));
  },
  async create({ commit }, { name }) {
    const playlist = await api.post({ name });
    commit('createPlaylist', playlist);
  },
  async update({ commit }, data) {
    if (data?.id === undefined) return;

    // NOTE: update playlist name
    if (data?.name !== undefined) {
      await api.put({ name: data.name }, { itemId: data.id });
      commit('updatePlaylistName', data);
    }
    if (data?.visibility !== undefined) {
      await api.put({ public: data.visibility }, { itemId: data.id });
      commit('updatePlaylistVisibility', data);
    }
  },
  async remove({ commit }, { id }) {
    await api.del(id);
    commit('removePlaylist', id);
  },
  async removeItemFromPlaylist({ commit }, data) {
    await api.put(data);
    if (data?.tracks !== undefined) {
      commit('updatePlaylistTracks', data);
    }
    if (data?.permissions !== undefined) {
      commit('updatePlaylistPermissions', data);
    }
  },
  async addItemToPlaylist({ commit }, data) {
    await api.put(data);
    if (data?.tracks !== undefined) {
      commit('updatePlaylistTracks', data);
    }
    if (data?.permissions !== undefined) {
      commit('updatePlaylistPermissions', data);
    }
  },
};

const getters = {
  select(state) {
    return (id) => state.items.find({ id });
  },
};
const mutations = {
  setPlaylists(store, playlists) {
    store.items = playlists;
  },
  createPlaylist(store, playlist) {
    store.items = [...store.items, playlist];
  },
  updatePlaylistName(store, { id, name }) {
    const index = store.items.findIndex((item) => item.id === id);
    const item = store.items[index];

    store.items[index] = { ...item, name };
  },
  updatePlaylistVisibility(store, { id, visibility }) {
    const index = store.items.findIndex((item) => item.id === id);
    const item = store.items[index];

    store.items[index] = { ...item, visibility };
  },
  updatePlaylistTracks(store, { id, tracks }) {
    const index = store.items.findIndex((item) => item.id === id);
    const item = store.items[index];

    store.items[index] = { ...item, tracks };
  },
  updatePlaylistPermissions(store, { id, permissions }) {
    const index = store.items.findIndex((item) => item.id === id);
    const item = store.items[index];

    store.items[index] = { ...item, permissions };
  },
  removePlaylist(store, id) {
    store.items = store.items.filter((item) => item.id !== id);
  },
};

export default {
  namespaced: true, state: defaultState, actions, getters, mutations,
};
