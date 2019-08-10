import { firestorePlugin } from 'vuefire'
import { firebase } from '@firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import firebaseConfig from '../../firebaseConfig'

let firebaseApp = firebase.initializeApp(firebaseConfig)
let firebaseAuth = firebaseApp.auth()

const db = firebaseApp.firestore()

export default async ({ app, router, Vue, store }) => {
  // instantiate vuefire for firestore
  Vue.use(firestorePlugin)

  // enable the use of this.$firestore syntax
  Vue.prototype.$firestore = firebase.firestore()
  Vue.prototype.$firebaseAuth = firebaseAuth

  // Add auth methods to our Vue instance
  // Vue.prototype.$userId = firebaseAuth.currentUser
  Vue.prototype.$loggedIn = false

  // So this is the "traditional" approach, the problem here is that the
  // authentication doesn't properly survice a browser refresh
  // firebaseAuth.onAuthStateChanged(user => {
  //   if (user) {
  //     console.log('OnAuthStateChange: SETTING AUTH TRUE')
  //     Vue.prototype.$userId = user.uid
  //     Vue.prototype.$loggedIn = true
  //   } else {
  //     console.log('OnAuthStateChange: SETTING AUTH FALSE')
  //     Vue.prototype.$userId = null
  //     Vue.prototype.$loggedIn = false
  //     // if the user logsout while they are on a page that requires authentication
  //     // redirect them to a page them to the login
  //     let meta = router.currentRoute.meta
  //     if (meta.authRequired) {
  //       router.replace('/account/login')
  //     }
  //   }
  // })

  // setup route guarding
  // router.beforeEach((to, from, next) => {
  //   console.log('Before Each, prototype loggedIn: ', Vue.prototype.$loggedIn)
  //   const requiresAuth = to.matched.some(record => record.meta.authRequired)
  //   if (requiresAuth) {
  //     console.log('requiresAuth')
  //     if (Vue.prototype.$loggedIn) {
  //       next()
  //     } else {
  //       next({ name: 'login' })
  //     }
  //   } else {
  //     next()
  //   }
  // })

  // simple authentication management and route-guarding
  // when app.js is loaded (by Quasar) the AuthStateChange subsctiption is created
  // the $loggedIn prototype allows you to reacto to state changes in the app
  // (e.g. v-if="!this.$loggedIn") the code below -- combined with the
  // vuefire firestore plugin will survive a user refresh of the browser
  router.beforeEach((to, from, next) => {
    // most common use case is that the user is logged in
    if (Vue.prototype.$loggedIn) {
      next()
    } else {
      const requiresAuth = to.matched.some(record => record.meta.authRequired)
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          console.log('OnAuthStateChange: SETTING AUTH TRUE')
          Vue.prototype.$userId = user.uid
          Vue.prototype.$loggedIn = true
        } else {
          console.log('OnAuthStateChange: SETTING AUTH FALSE')
          Vue.prototype.$userId = null
          Vue.prototype.$loggedIn = false
        }
        if (requiresAuth && !Vue.prototype.$loggedIn) {
          router.replace('/account/login')
        } else {
          next()
        }
      })
    }
  })
}

export { firebaseAuth, db }
