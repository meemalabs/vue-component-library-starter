export default new Middleware({
  name: 'logger',
  priority: 1,
  handle() {
    console.log('logger middleware')
  },
})
