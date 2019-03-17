//External
import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import Qs from 'koa-qs'
import sendfile from 'koa-sendfile'
import serve from 'koa-static'
import mount from 'koa-mount'
import fs from 'fs'
//Internal
import config from 'config'
import handleErrors from './middlewares/handle-errors'

export const app = new Koa()
app.use(async (ctx, next) => {
      if (config.routes.includes(ctx.request.path)) {
        ctx.request.path = '/'
      }
      await next()
    })
    .use(serve('./build'))

export const static_app = new Koa()
Qs(static_app) // let's give our app nice query strings

static_app.use(handleErrors)
static_app.use(bodyParser())

export const api_error = 'Error handling works!'
const router = new Router()
router.get('/api/error', async () => {
  throw Error(api_error)
})

const default_route = async (ctx, next) => {
  ctx.type = 'html'
  let e = Error('File Not Found')
  e.status = 404
  throw e
}

router.get('/', async (ctx, next) => {
  await sendfile(ctx, 'build/index.html')
  if(ctx.status===404) {
    let e = new Error('File not found')
    e.status = 404
    throw e
  }
})
router.get(/^\/media\/(.*)$/, async (ctx, next) => {
  let name = ctx.params[0]
  let ext = name.split('.').slice(-1)[0]
  switch (ext) {
    case 'png':
      ctx.type='image/png'
      break
    case 'jpg':
    case 'jpeg':
      ctx.type='image/jpeg'
      break
    case 'otf':
      ctx.type='font/opentype'
      break
  }
  ctx.body = fs.createReadStream('static/media/'+ctx.params[0])
})
router.get(/^\/(?:(?!media\/))(.*)$/, async (ctx, next) => {
  let fspath = ctx.params[0] || 'index.html'
  let fh = config.public + '/' + fspath
  let stats = await sendfile(ctx, fh)
  console.log(ctx.status, fh)
  if(ctx.status===404) {
    let e = new Error('File not found!!!')
    e.status = 404
    e.errors = {fspath, fh}
    throw e
  }
})

static_app.use(router.routes())
static_app.use(default_route)

app.use(mount('/media', static_app))

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
