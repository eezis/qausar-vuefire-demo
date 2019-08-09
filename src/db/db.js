import { Loading } from 'quasar'
import { db, firebaseAuth } from 'boot/firebase'
import { showErrorMessage } from 'src/utils/show-error-message'

export async function doesAliasExist (alias) {
  // console.log('does this alias exist? ', alias)
  let exists = await db.collection('profiles')
    .doc(alias)
    .get()
    .then(doc => {
      if (doc.exists) {
        // console.log('it exists')
        return true
      } else {
        return false
      }
    })
  return exists
}

// There really isn't any reason to crate the library already, just create the accounts
export async function registerUser (formData, alias, slug) {
  // we are going to do two things:
  // 1. create the authentication record using the email and password the user entered on the
  // registratioin form
  // 2. add the user's extra information into an accounts collection using slug as the doc id
  // console.log(formData)
  Loading.show()
  let accountsCreated = firebaseAuth.createUserWithEmailAndPassword(formData.email, formData.password)
    .then(cred => {
      // cred gives us access to the user object that was just created
      const userUid = cred.user.uid

      db.collection('profiles').doc(slug).set({
        uid: userUid,
        alias: alias,
        geolocation: null,
        first: formData.firstName,
        last: formData.lastName,
        middle: formData.middleName,
        slug: slug,
        created: new Date()
      })
        .then(() => {
          return true
        })
        .catch((err) => {
          Loading.hide()
          showErrorMessage(err.code, err.message)
          return false
        })
      Loading.hide()
      return true
    })
    // catch createUser errors
    .catch((err) => {
      showErrorMessage(err.code, err.message)
      return false
    })
  return accountsCreated
}
