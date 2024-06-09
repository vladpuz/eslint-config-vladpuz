import vladpuz from './build/index.js'

export default [
  ...vladpuz(),
  {
    ignores: ['build'],
  },
]
