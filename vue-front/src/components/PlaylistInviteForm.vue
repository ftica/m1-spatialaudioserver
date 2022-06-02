<template>
  <FormSelect name="" placeholder="" :options="unbindedItems" @change="addItem"/>
  <div class="invite flex-item scroll">
    <table class="table-invite flex-item">
      <tbody>
        <tr v-for="(item, index) in bindedItems" :key="item">
          <td>
            <p class="medium-text">{{ index + 1 }}</p>
          </td>
          <td class="small-width">
            <p class="medium-text">{{item.name}}</p>
          </td>
          <td>
            <nav class="right-align">
              <button class="border transparent-border"  @click="del(item.id)">
                <i class="material-icons">delete</i>
              </button>
            </nav>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import FormSelect from './Form/Select.vue';

export default {
  name: 'PlaylistInviteForm',
  components: {
    FormSelect,
  },
  props: {
    playlist: Object,
    path: String,
    items: {
      type: Array,
    },
  },
  computed: {
    bindedItems() {
      return this.items
        .filter(({ id }) => this.playlist?.[this.path]?.indexOf(id) !== -1)
        .map(({ id, name, email }) => ({ id, name: name || email }));
    },
    unbindedItems() {
      return this.items
        .filter(({ id }) => this.playlist?.[this.path]?.indexOf(id) === -1)
        .map(({ id, name, email }) => ({ id, name: name || email }));
    },
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions('playlists', ['addItemToPlaylist', 'removeItemFromPlaylist']),
    del(itemId) {
      this.removeItemFromPlaylist({
        id: this.playlist.id,
        payload: { [this.path]: this.playlist?.[this.path]?.filter(({ id }) => id !== itemId) },
      });
    },
    addItem(event) {
      this.addItemToPlaylist({
        id: this.playlist.id,
        payload: { tracks: [...this.playlist?.tracks?.map(({ id }) => id), event?.target?.value] },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  .flex-item {
    overflow-x: hidden;

    &::-webkit-scrollbar-track
    {
      border-radius: 3em;
      background-color: #ffffff;
    }

    &::-webkit-scrollbar
    {
      width: 7px;
      background-color: #ffffff;
    }

    &::-webkit-scrollbar-thumb
    {
      border-radius: 3em;
      background-color: #858585;
    }
  }
  .invite {
    .title {
      font-style: normal;
      font-weight: bold;

      line-height: 1.17;
      letter-spacing: -0.5px;
      text-transform: uppercase;
    }
    p {
      color: #ffffff;
    }
    input {
      &:focus {
        border-color: #1c1c1c;
      }
    }
    select{
      &:focus {
        border-bottom: 2rem solid #1c1c1c;
      }
    }
    span {
      color: #1c1c1c;
    }
    i {
      font-size: 16px;
      color: #4d4d4d;
    }
    button {
      width: 100%;
      padding: 0;
      margin: 16rem 0 16rem 0;
      &:hover {
        i {
          color: #ffffff;
        }
      }
    }
    .button:focus::after, .button:hover::after, button:focus::after, button:hover::after {
      background: none;
    }
    .table-invite {
      padding-right: 16rem;
      td {
        border-bottom: 1px #212121 solid;
      }
    }
  }
</style>
