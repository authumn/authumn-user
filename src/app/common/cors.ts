import * as _cors from 'cors'
import { environment } from '../../environments/environment'

const {
  whitelist = []
} = environment

function origin (orig, callback) {
  if (orig === undefined || whitelist.indexOf(orig) !== -1) {
    callback(null, true)
  } else {
    callback(new Error(`not allowed by cors: ${orig}`))
  }
}

export const cors = _cors({
  origin
})
