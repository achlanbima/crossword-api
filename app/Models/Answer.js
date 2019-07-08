'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Answer extends Model {
  crossword(){
    return this.belongsTo('App/Models/Crossword')
  }

  users () {
    return this.belongsToMany('App/Models/User')
      .pivotTable('user_answers')
  }

}

module.exports = Answer
