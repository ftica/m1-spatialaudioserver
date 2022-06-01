<template>
  <form class="add-user" @submit.prevent="click">
    <FormInput name="username" placeholder="Username" type="text" v-model="user.username"/>
    <FormInput name="email" placeholder="E-mail" type="text" v-model="user.email"/>
    <FormInput name="password" placeholder="Password" type="password" autocomplete="new-password" v-model="user.password"/>
    <FormSelect name="users" placeholder="Role" defaultClass="role" :options="roles" v-model="user.role"/>
    <FormButton :icon="icon" :title="title" @click="click"/>
  </form>
</template>

<script>
// import { mapActions } from 'vuex';

import FormButton from './Form/Button.vue';
import FormInput from './Form/Input.vue';
import FormSelect from './Form/Select.vue';

export default {
  name: 'UsersAddForm',
  components: {
    FormButton,
    FormInput,
    FormSelect,
  },
  props: {
    title: String,
    icon: String,
    item: {
      type: Object,
      required: false,
    },

    action: Function,
  },
  data() {
    return {
      roles: [
        { id: 'USER', name: 'user' },
        { id: 'ADMIN', name: 'admin' },
      ],
      user: {},
      focused: {},
    };
  },
  methods: {
    // ...mapActions('users', ['create', 'update']),
    select({ target: { name }, type }) {
      if (type === 'focus') {
        this.focused[name] = true;
      } else if (type === 'blur' && this.user[name] === '') {
        this.focused[name] = false;
      }
    },
    async click() {
      const { user } = this;
      await this.action(user);
    },
    // add() {
    //   this.create(this.user);
    // },
    // save() {
    //   this.update(this.user);
    // },
  },
  created() {
    const { item } = this;
    if (item && item.lastSeen) {
      this.user = { ...item };
    }
  },
};
</script>

<style lang="scss" scoped>
  .role {
    color: #ffffff;
  }
</style>
