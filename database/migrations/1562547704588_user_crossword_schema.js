'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserCrosswordSchema extends Schema {
  up () {
    this.create('user_crosswords', (table) => {
      table.increments()
      table
        .integer('user_id')
        .unsigned()
      
      table
        .integer('crossword_id')
        .unsigned()

      table
        .boolean('is_finished')

      table
        .foreign('user_id')
        .references('users.id')
        .onDelete('cascade')

      table
        .foreign('crossword_id')
        .references('crosswords.id')
        .onDelete('cascade')


    })
  }

  down () {
    this.drop('user_crosswords')
  }
}

module.exports = UserCrosswordSchema
