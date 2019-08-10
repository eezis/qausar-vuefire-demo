<template>
  <q-page class="q-pa-md absolute full-width full-height column">
    <div class="text-center">
      <h5>Quasar, vuefire, firebase/firestore demo</h5>
      <p class="text-body1">This is where you blabber away and encourage the user to login</p>
      <!-- <q-btn class="q-mt-lg" label="Temp Logout - dev only" @click="logout"></q-btn> -->
    </div>
  </q-page>
</template>

<script>
import { firebaseAuth } from 'boot/firebase'

export default {
  methods: {
    logout () {
      firebaseAuth.signOut()
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
