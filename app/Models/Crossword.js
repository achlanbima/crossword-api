'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Crossword extends Model {

  answers(){
    return this.hasMany('App/Models/Answer')
  }

  users(){
    return this.belongsToMany('App/Models/User')
      .pivotTable('user_crosswords')
      .withPivot('is_finished')
  }

  user_crossword() {
    return this.hasMany('App/Models/UserCrossword')
  }
}

module.exports = Crossword
