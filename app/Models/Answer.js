'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Answer extends Model {
  static get createdAtColumn () {
    return null;
  }

  static get updatedAtColumn () {
    return null;
  }
  
  crossword(){
    return this.belongsTo('App/Models/Crossword')
  }

  users () {
    return this.belongsToMany('App/Models/User')
      .pivotTable('user_answers')
      .withPivot('answer')
  }

  user_answers () {
    return this.hasMany('App/Models/UserAnswer')
  }

}

module.exports = Answer
