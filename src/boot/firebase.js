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

  // This approach survives a browser refresh but forces an API call on every page change
  // so there might be a performance cost, and an actual firebase cost?
  router.beforeEach((to, from, next) => {
    firebase.auth().onAuthStateChanged((user) => {
      const requiresAuth = to.matched.some(record => record.meta.authRequired)
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
  })
}

export { firebaseAuth, db }
