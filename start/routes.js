'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')


Route.post('/register', 'AuthController.register')
Route.post('/login', 'AuthController.login')


Route.group(()=>{
  Route.get('/', 'CrosswordController.index')
  Route.get('/:id/answers', 'AnswerController.show')
  Route.patch('/:id/answers', 'AnswerController.update')
}).prefix('crosswords')

Route.group(()=>{
  Route.get('/', 'AnswerController.index')
}).prefix('answers')