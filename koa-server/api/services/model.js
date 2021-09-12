/* eslint-disable max-classes-per-file */
import _ from 'lodash';
import { v4 as uuid } from 'uuid';

import { encryptSync } from './encryption';

export default class Model {
  #keys = []

  #item = {}

  setModelKey(source, path, defaultValue) {
    this.#keys = _.union(this.keys, [path]);
    this.#item[path] = _.get(source, path, defaultValue);
  }

  get keys() {
    return _.uniq(this.#keys);
  }

  get item() {
    return { ...this.#item };
  }

  difference(payload) {
    if (!_.isObject(payload) || _.isEmpty(payload)) throw new Error('An empty payload was passed to the method');

    return _.reduce(this.item, (result, value, key) => {
      const payloadValue = _.get(payload, key);
      if (payloadValue !== value) return { ...result, [key]: payloadValue };

      return result;
    }, {});
  }
}

export class UserModel extends Model {
  #item = {}

  constructor(item) {
    super();

    this.setModelKey(item, 'id', uuid());
    this.setModelKey(item, 'nickname');
    this.setModelKey(item, 'email');
    this.setModelKey(item, 'role', 'user');
    this.setModelKey(item, 'lastSeen');

    if (_.has(item, 'password')) {
      const { hash, salt } = encryptSync(_.get(item, 'password'));
      this.#item.hash = hash;
      this.#item.salt = salt;
    }
  }

  get user() {
    const password = this.#item ? this.#item : {};
    return { ...this.item, ...password };
  }

  static validate() {
    // TODO: should store standart validation object
    return null;
  }
}
