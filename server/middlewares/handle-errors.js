import sendtemplate from '../send-template'

export default async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    let status = e.status || 500
    let resError = {
      code: status,
      message: e.message,
      errors: e.errors
    }

    console.warn('[handleErrors]' + JSON.stringify(resError))

    let template = Object.keys(resError).map(k => {
      return {from: k, to: resError[k]}
    })

    await sendtemplate(ctx, `public/${status}.html`, template)
    if (!ctx.status||ctx.status===404) {
      if (e instanceof Error)
        Object.assign(resError, {stack: e.stack})
      Object.assign(ctx, {body: resError, status: status })
    } else {
      ctx.status = status
    }
    console.log(' - sending status ' + ctx.status)
  }
}
