/*
 * @Author: Innei
 * @Date: 2020-08-16 19:50:57
 * @LastEditTime: 2021-03-22 11:33:40
 * @LastEditors: Innei
 * @FilePath: /admin-next/src/utils/rest.ts
 * @Coding with Love
 */

import * as camelcaseKeys from 'camelcase-keys'
import {
  extend,
  RequestMethod,
  RequestOptionsInit,
  RequestOptionsWithResponse,
} from 'umi-request'

class RESTManagerStatic {
  _$$instance: RequestMethod = null!
  get instance() {
    return this._$$instance
  }
  constructor() {
    this._$$instance = extend({
      // @ts-ignore
      prefix: 'https://api.github.com',
      timeout: 10000,
      errorHandler: async (error) => {
        if (error.request && !error.response) {
        }

        if (error.response) {
          // ...handle
        }
      },
    })
  }
  request(method: Method, route: string, options: RequestOptionsWithResponse) {
    return this._$$instance[method](route, options)
  }

  get api() {
    return buildRoute(this)
  }
}

const noop = () => {}
const methods = ['get', 'post', 'delete', 'patch', 'put']
const reflectors = [
  'toString',
  'valueOf',
  'inspect',
  'constructor',
  Symbol.toPrimitive,
  Symbol.for('util.inspect.custom'),
]

function buildRoute(manager: RESTManagerStatic): IRequestHandler {
  const route = ['']
  const handler: any = {
    get(target: any, name: Method) {
      if (reflectors.includes(name)) return () => route.join('/')
      if (methods.includes(name)) {
        return async (options: RequestOptionsWithResponse) =>
          await manager.request(name, route.join('/'), {
            ...options,
          })
      }
      route.push(name)
      return new Proxy(noop, handler)
    },
    // @ts-ignore
    apply(target: any, _, args) {
      route.push(...args.filter((x: string) => x != null)) // eslint-disable-line eqeqeq
      return new Proxy(noop, handler)
    },
  }
  // @ts-ignore
  return new Proxy(noop, handler)
}

export const RESTManager = new RESTManagerStatic()

export const useRest = () => {
  return RESTManager.api
}

// RESTManager.instance.interceptors.request.use((url, options) => {
//   // const token = getToken()
//   // if (token) {
//   //   // @ts-ignore
//   //   options.headers.Authorization = 'bearer ' + token
//   // }
//   // return {
//   //   url: url + '?timestamp=' + new Date().getTime(),
//   //   options: {
//   //     ...options,
//   //     interceptors: true,
//   //   },
//   // }
// }, {})

RESTManager.instance.interceptors.response.use(async (response, option) => {
  const newRes = await response.clone().json()

  return camelcaseKeys(newRes)
})

interface IRequestHandler<T = RequestOptionsInit> {
  (id?: string): IRequestHandler
  // @ts-ignore
  get<P = unknown>(options?: T): Promise<P>
  // @ts-ignore
  post<P = unknown>(options?: T): Promise<P>
  // @ts-ignore
  patch<P = unknown>(options?: T): Promise<P>
  // @ts-ignore
  delete<P = unknown>(options?: T): Promise<P>
  // @ts-ignore
  put<P = unknown>(options?: T): Promise<P>
  [key: string]: IRequestHandler
}
export type Method = 'get' | 'delete' | 'post' | 'put' | 'patch'
