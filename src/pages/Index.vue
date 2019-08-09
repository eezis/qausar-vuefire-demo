<template>
  <q-page class="q-pa-md absolute full-width full-height column">
    <div>
      <h5>Quasar, vuefire, firebase/firestore demo</h5>
      <!-- <q-btn label="Temp Logout - dev only" @click="logout"></q-btn> -->
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
