<template>
  <q-page class="flex flex-center">
    <q-card
      class="card-login q-pa-md"
      color="white"
      bordered
      text-color="black"
      style="width:500px; max-width: 80vw;"
    >

      <q-card-section class="text-h6 text-dark text-center card-title" >
        Login
      </q-card-section>

      <form @submit.prevent="submitForm">

        <q-card-section class="q-pa-lg q-mb-sm">

          <q-input
            v-model="form.email"
            autocomplete
            label="Email Address"
            type="email"
            :rules="[ val => isValidEmailAddress(val) || 'Please enter a valid email address']"
            lazy-rules
            ref="email"
          >
            <template v-slot:prepend>
              <q-icon name="email" />
            </template>
          </q-input>

          <q-input
            v-model="form.password"
            label="Password"
            type="password"
            autocomplete="current-password"
            :rules="[
              val => !!val || '* Required',
              val => val.length >= 6 || 'Please use at least six character',
            ]"
            ref="password"
            lazy-rules
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
          </q-input>

        </q-card-section>

        <!-- <q-separator />

        <q-card-actions align="right">
          <q-btn label="Login" color="primary" type="submit"/>
          <q-btn label="Login With Google" color="secondary" @click="googleLogin"/>
        </q-card-actions> -->

        <div style="text-align:center;">
          <q-btn
            class="login q-mt-sm q-mb-lg"
            label="Login"
            :color="buttonColor"
            type="submit"
            :ripple="{color: 'orange'}"
            size="18px"
          />

          <q-btn
            class="full-width q-mb-lg q-mt-lg"
            color="grey-8"
            label="create an acccount"
            ripple
            @click="goRegister"
          />
        </div>

      </form>

    </q-card>

  </q-page>
</template>

<script>
import { Loading } from 'quasar'
import { showErrorMessage } from 'src/utils/show-error-message'

export default {
  data () {
    return {
      form: {
        email: '',
        password: ''
      },
      btnColor: 'primary'
    }
  },
  computed: {
    buttonColor () {
      if (this.form.email && this.form.password) {
        return 'positive'
      } else {
        return 'primary'
      }
    }
  },
  methods: {
    signIn () {
      Loading.show()
      this.$firebaseAuth.signInWithEmailAndPassword(this.form.email, this.form.password)
        .then(cred => {
          Loading.hide()
          this.$loggedIn = true
          this.$router.push({ name: 'registered' })
        })
        .catch(err => {
          Loading.hide()
          console.error(err.message)
          showErrorMessage('Login Error', err.methods)
        })
    },
    submitForm () {
      // validate the fields
      this.$refs.email.validate()
      this.$refs.password.validate()
      // create helper variables
      let em = !this.$refs.email.hasError
      let pw = !this.$refs.password.hasError
      // if there are no validation errors proceeed
      if (em && pw) {
        this.signIn()
      }
    },
    isValidEmailAddress (email) {
      // console.log(email)
      // eslint-disable-next-line
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase())
    },
    goRegister () {
      this.$router.push({ name: 'registration' })
    }
  }
}
</script>

<style lang="stylus" scoped>
.card-login
  opacity: 0.86

.q-input
  margin-bottom 12px
  font-size larger
  color red

.card-title
  color $grey-8

.login
  width 140px

</style>
