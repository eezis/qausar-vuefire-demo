import { Loading, Dialog, Notify } from 'quasar'

export function showErrorMessage (title = 'Error', errorMessage) {
  Loading.hide()
  Dialog.create({
    title: title,
    message: '<h6><em>' + errorMessage + '</h6></em>',
    html: true
  })
}

export function showNotifyMessage (errorMessage) {
  Loading.hide()
  Notify.create({
    message: errorMessage,
    color: 'red',
    position: 'center',
    timeout: 1000
  })
}
