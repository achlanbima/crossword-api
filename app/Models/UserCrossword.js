'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class UserCrossword extends Model {
  static get createdAtColumn () {
    return null;
  }

  static get updatedAtColumn () {
    return null;
  }
  crossword(){
    return this.belongsTo('App/Models/Crossword')
  }
  users(){
    return this.belongsTo('App/Models/User')
  }
}

module.exports = UserCrossword
