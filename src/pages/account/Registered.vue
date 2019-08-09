<template>
  <q-page class="q-pa-md absolute full-width full-height column">
    <h5>{{ title }}</h5>
    <p class="text-body1">{{ isntructions }}</p>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      title: 'Your account has been created and you have been logged in',
      isntructions: 'To test Quasar vuefire and the realtime firestore database ' +
                    'make a menu selection.'
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
