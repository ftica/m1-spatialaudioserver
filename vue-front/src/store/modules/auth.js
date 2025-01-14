import FetchHelper from '../utils';

const defaultState = () => ({
  profile: {
    session: false,
  },
});

const api = new FetchHelper('auth');
const users = new FetchHelper('users');

const actions = {
  async login({ commit, dispatch }, data) {
    const response = await api.post(data, { itemId: 'login' });

    if (response?.token) {
      localStorage.setItem('token', response.token);
      const user = await users.get('me');
      const profile = { user };
      commit('setProfile', profile);
      dispatch('toast', { event: { message: `Success! Welcome back, ${profile.user.username}` } }, { root: true });

      return true;
    }
    return false;
  },
  async restore({ commit }) {
    if (!localStorage.getItem('token')) return;

    const user = await users.get('me');
    const profile = { user };

    if (profile) commit('setProfile', profile);
  },
  async logout({ commit, dispatch }) {
    localStorage.removeItem('token');
    dispatch('toast', { event: { message: 'Log out success! See you later ;)' } }, { root: true });
    commit('setProfile', { session: false });
  },
};

const getters = {
  user(state) {
    return state.profile.user;
  },
};

const mutations = {
  setProfile(store, profile) {
    store.profile = profile;
  },
};

export default {
  namespaced: true, state: defaultState, actions, getters, mutations,
};
