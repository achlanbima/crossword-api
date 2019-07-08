'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class UserCrossword extends Model {
  crossword(){
    return this.belongsTo('App/Models/Crosswords')
  }
}

module.exports = UserCrossword
