export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

import {uuid} from 'vue-uuid';

export default function uuidString() {
  return uuid.v1().replace('-', '')
}
