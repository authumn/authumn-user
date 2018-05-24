export function createCorsOptions (whitelist: string[]) {
  function origin (orig, callback) {
    if (orig === undefined || whitelist.indexOf(orig) !== -1) {
      callback(null, true)
    } else {
      callback(new Error(`not allowed by cors: ${orig}`))
    }
  }

  return {
    origin
  }
}

