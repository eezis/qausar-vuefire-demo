# quasar-vuefire 

Starter project for using Quasar with vuefire and firestore. It llustrates Firebase authentication and the use of vuefire.

### Authentication

The code provides authentication services, including login and account creation. The authentication is persistent . . . the user stays logged in after a browser refresh.

The action here happens in the src/boot/firebase.js file. I have two approaches there, one is commented out. It seems that the real quesion here is: how does one successfully handle/manage the use case of a browser refresh? 

### vuefire

There are two examples; State Names is a simple example that allows users to add state names and abbreviations. This reactive data collection allows every authenticated user to see updates by every other user. The second example is a Reading List that allows a user to add titles. This collection is restricted to the user.

## Install the dependencies
```bash
yarn
```

Copy/rename firebaseConfig-BLANK.js to firebaseConfig.js and load your api data in.

```javascript
export default {
  apiKey: '****',
  authDomain: '****',
  databaseURL: '****',
  projectId: '****',
  storageBucket: '****',
  messagingSenderId: '****'
}

```


### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```

### Lint the files
```bash
yarn run lint
```

### Build the app for production
```bash
quasar build
```

## To Do

1. Add edit capabilities
2. Fix up the database rules <-- that's specific to me