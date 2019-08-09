<template>
  <q-page class="flex flex-center">
    <q-card
      class="card-register q-pa-md"
      color="white"
      text-color="black"
      style="width:500px; max-width: 80vw;"
    >

      <q-card-section class="text-h6 text-dark text-center card-title" >
        Create Your Account
      </q-card-section>

      <form @submit.prevent="submitForm">

        <q-card-section class="q-pa-lg q-mb-sm">

          <q-input
            v-model="form.firstName"
            label="First Name"
            :rules="[val => !!val || 'Field is required']"
            ref="firstName"
          >
            <template v-slot:prepend>
              <q-icon name="person_outline" />
            </template>
          </q-input>

          <div v-if="showMiddle">
            <q-input
              v-model="form.middleName"
              label="Middle Name or Initial"
              :rules="[val => !!val || 'Field is required']"
              ref="middleName"
            >
              <template v-slot:prepend>
                <q-icon name="person_outline" />
              </template>
            </q-input>
          </div>

          <q-input
            v-model="form.lastName"
            label="Last Name"
            :rules="[val => !!val || 'Field is required']"
            ref="lastName"
          >
            <template v-slot:prepend>
              <q-icon name="person_outline" />
            </template>
          </q-input>

          <q-input
            v-model="form.email"
            label="Email Address"
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

          <q-input
            v-model="form.password2"
            label="Password 2"
            type="password"
            autocomplete="off"
            :rules="[
              val => !!val || '* Required',
              val => val.length >= 6 || 'Please use at least six character',
            ]"
            ref="password2"
            lazy-rules
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
          </q-input>

          <q-btn
            class="q-mt-lg float-right"
            label="Register"
            :color="buttonColor"
            type="submit"
          />
        </q-card-section>

      </form>

    </q-card>

  </q-page>
</template>

<script>
import slugify from 'slugify'
import { doesAliasExist, registerUser } from 'src/db/db'
import { showErrorMessage } from 'src/utils/show-error-message'

export default {
  data () {
    return {
      form: {
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        password: '',
        password2: ''
      },
      // alias will be first + last
      alias: null,
      slug: null,
      btnColor: 'primary',
      showMiddle: false
    }
  },
  computed: {
    buttonColor () {
      if (this.form.firstName && this.form.lastName && this.form.email && this.form.password && this.form.password2) {
        return 'positive'
      } else {
        return 'primary'
      }
    }
  },
  methods: {
    buildAlias () {
      if (this.form.firstName && this.form.lastName && this.form.email && this.form.password && this.form.password2) {
        if (this.form.middleName) {
          this.alias = this.form.firstName + ' ' + this.form.middleName + ' ' + this.form.lastName
          return true
        } else {
          this.alias = this.form.firstName + ' ' + this.form.lastName
          return true
        }
      } else {
        // the alias wasn't built
        showErrorMessage('Error', 'Please fill in the all fields!')
        return false
      }
    },
    async registerTheUser () {
      if (this.buildAlias()) {
        this.slug = slugify(this.alias, {
          replacement: '-',
          remove: /[$*_+~.()'"!\-:@]/g,
          lower: true
        })
      }

      console.log('About to check alias: ', this.slug)

      let aliasExists = await doesAliasExist(this.slug)
      // let aliasExists = await existingAlias(this.slug)

      console.log('aliasExists has been called: ', aliasExists)

      if (aliasExists) {
        this.showMiddle = true
        const title = '"' + this.alias + '" is already in use'
        const msg = 'If you have a common name, please use middle name or initial to differentiate. If you have already registered please go to the login page.'
        showErrorMessage(title, msg)
      } else {
        console.log('Alias is unique: ', this.slug)
        let registered = await registerUser(this.form, this.alias, this.slug)
        if (registered) {
          this.$router.push({ name: 'registered' })
        }
        console.log('REGISTERED', registered)
      }

      console.log('done with submitForm')
    },
    async submitForm () {
      this.$refs.firstName.validate()
      // if (this.showMiddle) { this.$refs.middleName.validate() }
      this.$refs.lastName.validate()
      this.$refs.email.validate()
      this.$refs.password.validate()
      this.$refs.password2.validate()

      let fn = !this.$refs.firstName.hasError
      // if (this.showMiddle) { !this.$refs.x.hasError }
      let ln = !this.$refs.lastName.hasError
      let em = !this.$refs.email.hasError
      let pw = !this.$refs.password.hasError
      let pw2 = !this.$refs.password.hasError

      if (fn && ln && em && pw && pw2) {
        if (this.buildAlias()) {
          this.slug = slugify(this.alias, {
            replacement: '-',
            remove: /[$*_+~.()'"!\-:@]/g,
            lower: true
          })
        }

        console.log('About to check alias: ', this.slug)

        let aliasExists = await doesAliasExist(this.slug)
        // let aliasExists = await existingAlias(this.slug)

        console.log('aliasExists has been called: ', aliasExists)

        if (aliasExists) {
          this.showMiddle = true
          const title = '"' + this.alias + '" is already in use'
          const msg = 'If you have a common name, please use middle name or initial to differentiate. If you have already registered please go to the login page.'
          showErrorMessage(title, msg)
        } else {
          console.log('Alias is unique: ', this.slug)
          let registered = await registerUser(this.form, this.alias, this.slug)
          if (registered) {
            this.$router.push({ name: 'registered' })
          }
          console.log('REGISTERED', registered)
        }

        console.log('done with submitForm')
      } else {
        console.log('busted')
      }

      // if (fn && ln && em && pw && pw2) {
      //   this.registerTheUser()
      // } else {
      //   console.log('busted')
      // }
    },
    isValidEmailAddress (email) {
      // console.log(email)
      // eslint-disable-next-line
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase())
    }
  }
}
</script>

<style lang="stylus" scoped>
.card-register
  opacity: 0.92

.q-input
  margin-bottom 12px
  font-size larger
  color red

.card-title
  color $grey-8
</style>
