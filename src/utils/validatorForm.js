import {validatePhoneNumber} from './validate'

// const validatorRequired = (rule, value, callback) => {
//   if (!value) {
//     callback(new Error(window.i18n.t(`views.system.sysApiListManager.formData.${rule.field}`) + window.i18n.t('action.required')))
//   } else {
//     callback()
//   }
// }

export function validatorPhoneNumber(rule, value, callback) {
  if (!validatePhoneNumber(value)) {
    callback(new Error(window.i18n.t('utils.validator.phoneNumber')))
  } else {
    callback()
  }
}

export function validatorUsername(rule, value, callback) {
  const reg = /^[A-Za-z0-9]+$/
  if (!reg.test(value)) {
    callback(new Error(window.i18n.t('utils.validator.username')))
  } else {
    callback()
  }
}

export function validatorPassword(rule, value, callback) {
  if (value.length < 6) {
    callback(
      callback(new Error(window.i18n.t('utils.validator.password')))
    )
  } else {
    callback()
  }
}


