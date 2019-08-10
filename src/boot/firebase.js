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

  // create firebase prototypes for use in the app
  Vue.prototype.$firestore = firebase.firestore()
  Vue.prototype.$firebaseAuth = firebaseAuth

  // this prototype allows the app to react to authentication
  // event changes -- eliminates the need for a vuex auth store
  Vue.prototype.$loggedIn = false

  // The goal here is to produce a simple but effective authentication
  // management and route-guarding that is persistent and survives the
  // use case where a user refreshes their browser.

  // The challenge here is that onAuthChangeEvent is asynchronous and the
  // router.beforeEach is called before the authChange subscription is fulfilled
  // e.g. the app checks the user's authentication status before firebase has responded

  // The code below creates an observer - via firebase's onAuthStateChange
  // subscription call only if the user attempts to access a route that requires
  // authentication -- in the routes.js meta: { authRequired: true }.

  // the $loggedIn prototype allows you to react to state changes in the app
  // (e.g. v-if="!this.$loggedIn") the code below -- combined with the
  // vuefire firestore plugin this code will survive a user refresh of the browser

  router.beforeEach((to, from, next) => {
    // most common use case is that the user is logged in so just run next()
    console.log('router.beforeEach')
    if (Vue.prototype.$loggedIn) {
      next()
    } else {
      const requiresAuth = to.matched.some(record => record.meta.authRequired)
      if (requiresAuth) {
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
      } else {
        next()
      }
    }
  })
}

export { firebaseAuth, db }
