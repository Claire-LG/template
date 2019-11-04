/* eslint-disable import/prefer-default-export */
import { resolve } from 'path'
import { Route } from '../decorator/router'

export const router = app => {
  const routesPath = resolve(__dirname, '../routes')
  const instance = new Route(app, routesPath)
  instance.init()
}
