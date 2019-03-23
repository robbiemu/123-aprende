//External
import Koa from 'koa'
import serve from 'koa-static'

//Internal
import config from 'config'

export const app = new Koa()
app.use(serve('./build'))

let index
export const start = function () {
  index = app.listen(config.port(), () => {
    console.info(`Listening to http://localhost:${config.port()}`)
  })
  return index
}
export const end = function () {
  index.close()
}
