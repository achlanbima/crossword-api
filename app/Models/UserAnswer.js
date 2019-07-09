'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class UserAnswer extends Model {
  static get createdAtColumn () {
    return null;
  }

  static get updatedAtColumn () {
    return null;
  }
  
  answers(){
    return this.belongsTo('App/Models/Answers')
  }
}

module.exports = UserAnswer
