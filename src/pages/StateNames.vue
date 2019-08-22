<template>
  <div>

    <div class="q-pa-md">
      <q-form @submit.prevent="addAState">
        <div class="row" style="max-width:350px;">
          <q-input
            v-model="formData.name"
            label="State Name"
            stack-label outlined
            style="width:100%;"
          />
          <q-input v-model="formData.abbrev"
            label="Abbreviation"
            stack-label outlined
            autofocus
            ref="abbrev"
            class="abbrev q-mt-sm"
            />
           <q-btn class="q-mt-sm q-ml-sm" type="submit" square color="primary" icon="add" />
        </div>
      </q-form>
    </div>

    <div class="q-pa-md" style="max-width: 380px">

      <q-list bordered separator class="statelist">
        <q-item clickable v-ripple v-for="(state, index) in states" :key="index" >
          <q-item-section>{{ state.name }}</q-item-section>
          <q-item-section>{{ state.id }}</q-item-section>
          <q-item-section avatar>
            <q-icon color="primary" name="delete" @click="deleteAState(state)" />
          </q-item-section>
        </q-item>
      </q-list>

    </div>

  </div>
</template>

<script>
import { db } from 'boot/firebase'

export default {
  data () {
    return {
      states: [],
      formData: {
        abbrev: '',
        name: ''
      }
    }
  },
  // this firestore statement creates 'declarative binding' -- it's a subscription
  // it populates the data when the page/component is created
  // and you get reactive additions/updates/deletions
  firestore () {
    return {
      states: db.collection('states').orderBy('name')
    }
  },
  methods: {
    deleteAState (state) {
      console.log(state)
      db.collection('states').doc(state.id).delete()
      // the following syntax should work too
      // this.$firestoreRefs.states.doc(state.id).delete()
    },
    addAState () {
      // console.log(this.formData)
      // db.collection('states').add({
      //   abbrev: this.formData.abbrev,
      //   name: this.formData.name
      // })
      // using .set() instead of .add() allows us to set a custom ID
      // for the firestore document
      db.collection('states').doc(this.formData.abbrev).set({
        // abbrev: this.formData.abbrev,
        name: this.formData.name
      })
        .catch(function (error) {
          this.$q.notify(error)
        })
      this.formData.abbrev = ''
      this.formData.name = ''
      this.$refs.abbrev.focus()
    }
  }
}
</script>

<style lang="stylus" scoped>
.statelist
  max-width 600px

.abbrev
  width 30%

  // @media only screen and (max-width: 768px)
  //   .abbrev
  //     width 600px
  //     color red

</style>
