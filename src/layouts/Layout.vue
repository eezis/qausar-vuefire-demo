<template>
  <!-- <q-layout view="lHh Lpr lFf"> -->
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title class="absolute-center">
          VueFire Demo
        </q-toolbar-title>

        <q-btn flat color="white" icon-right="account_circle"
          v-if="!this.$loggedIn"
          to="/account/login"
          label="Login"
          class="absolute-right"
        />
        <q-btn flat color="white" icon-right="account_circle"
          v-else
          label="Logout"
          class="absolute-right"
          @click="logoutUser"
        />

      </q-toolbar>
    </q-header>

    <q-drawer
      :width="240"
      v-model="leftDrawerOpen"
      :breakpoint="767"
      bordered
      content-class="bg-grey-2"
      v-if="this.$loggedIn"
    >
      <q-list>
        <q-item-label header>Navigation</q-item-label>
        <!-- <q-item exact clickable v-for="nav in navs" :to="nav.to" > -->

        <q-item clickable exact to="/state-names">
          <q-item-section avatar>
            <q-icon name="school" />
          </q-item-section>
          <q-item-section>
            <q-item-label>State Names</q-item-label>
            <q-item-label caption>Everyone Sees Changes</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable exact to="/titles">
          <q-item-section avatar>
            <q-icon name="library_books" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Reading List</q-item-label>
            <q-item-label caption>Specific to user</q-item-label>
          </q-item-section>
        </q-item>

      </q-list>
    </q-drawer>

    <q-footer v-if="this.$loggedIn">
      <q-tabs>
        <q-route-tab v-for="(nav, index) in navs" :to="nav.to" :icon="nav.icon" :label="nav.label" :key="index" />
      </q-tabs>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'MyLayout',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      navs: [
        {
          label: 'State Names',
          icon: 'school',
          to: '/state-names'
        },
        {
          label: 'Reading List',
          icon: 'library_books',
          to: '/titles'
        }
      ]
    }
  },
  methods: {
    openURL,
    logoutUser () {
      this.$firebaseAuth.signOut()
    }
  }
}
</script>

<style>
  @media screen and (min-width: 768px) {
    .q-footer {
      display: none;
    }
  }
</style>
