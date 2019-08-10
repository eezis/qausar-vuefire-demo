<template>
  <div>

    <div class="q-pa-md">
      <q-form @submit.prevent="addBook">
        <div class="row">
          <q-input v-model="formData.title"
            label="Title"
            stack-label outlined
            autofocus
            ref="title"
            />
          <q-input
            v-model="formData.author"
            label="Author"
            stack-label outlined
          />
           <q-btn type="submit" square color="primary" icon="add" />
        </div>
      </q-form>
    </div>

    <div class="q-pa-md" style="max-width: 480px">

      <q-list bordered separator class="booklist">
        <q-item clickable v-ripple v-for="book in titles" :key="book.id" >
          <q-item-section>
            {{ book.title }}
              <!-- <q-popup-edit v-model="label">
                <q-input v-model="label" dense autofocus counter />
              </q-popup-edit> -->
          </q-item-section>
          <q-item-section>{{ book.author }}</q-item-section>
          <q-item-section avatar>
            <q-icon color="primary" name="delete" @click="deleteBook(book)" />
          </q-item-section>
        </q-item>
      </q-list>

    </div>

  </div>
</template>

<script>
import { db } from 'boot/firebase'

export default {
  name: 'titles',
  data () {
    return {
      titles: [],
      formData: {
        title: '',
        author: ''
      }
    }
  },
  mounted () {
    console.log(this.$userId)
  },
  firestore () {
    return {
      // titles: db.collection('readingList').where('creator', '==', 'NLSfO8LWt8XLfexYLzOHQZ2HLus1')
      // note, the $userID prototype is created and managed in src/boot/firebase.js
      titles: db.collection('titles').where('creator', '==', this.$userId) // .orderBy('title')
    }
  },
  methods: {
    deleteBook (book) {
      console.log(book)
      db.collection('titles').doc(book.id).delete()
      // the following syntax should work too
      // this.$firestoreRefs.titles.doc(book.id).delete()
    },
    addBook () {
      // this.$firestoreRefs.titles.add(
      db.collection('titles').add(
        {
          title: this.formData.title,
          author: this.formData.author,
          creator: this.$userId
          // timestamp: new Date()
        }
      )
      this.formData.title = ''
      this.formData.author = ''
      this.$refs.title.focus()
    }
  }
}
</script>

<style lang="stylus" scoped>
.booklist
  max-width 700px

</style>
