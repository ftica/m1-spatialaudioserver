import _ from 'lodash';

import FetchHelper from '../utils';

const defaultState = () => ({
  // user: {
  //   id: undefined,
  //   username: undefined,
  //   email: undefined,
  //   role: undefined,
  //   lastSeen: undefined,
  // },
  items: [],
});

const api = new FetchHelper('users');

const actions = {
  async getAll({ commit }) {
    const users = await api.get();
    commit('setUsers', _.map(users, (user) => ({ ...user })));
    // commit('setUsers', _.map(users, (user, index) => ({ number: index + 1, ...user })));
  },
  async create({ commit }, data) {
    const user = await api.post(data);
    commit('createUser', user);
  },

  async update({ commit }, user) {
    if (!user?.username) return;

    const updatedUser = await api.put(user, { itemId: user.username });
    commit('updateUser', updatedUser);
  },
  async remove({ commit }, username) {
    await api.del(username);
    commit('removeUser', username);
  },
};

const getters = {
  select({ state }, id) {
    return _.find(state.items, { id });
  },
};

const mutations = {
  setUsers(store, users) {
    store.items = users;
  },
  createUser(store, user) {
    store.items = [...store.items, user];
  },
  updateUser(store, user) {
    const index = _.findIndex(store.items, (item) => item.username === user.username);
    store.items[index] = user;
  },
  updateUserUsername(store, { username }) {
    const index = _.findIndex(store.items, (item) => item.username === username);
    const item = store.items[index];

    store.items[index] = { ...item, username };
  },
  removeUser(store, username) {
    store.items = store.items.filter((item) => item.username !== username);
  },
};

export default {
  namespaced: true, state: defaultState, actions, getters, mutations,
};
