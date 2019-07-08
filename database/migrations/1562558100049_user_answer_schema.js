'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserAnswerSchema extends Schema {
  up () {
    this.create('user_answers', (table) => {
      table.increments()
      table
        .integer('user_id')
        .unsigned()
      
      table
        .integer('answer_id')
        .unsigned()

      table
        .string('answer', 50)

      table
        .foreign('user_id')
        .references('users.id')
        .onDelete('cascade')

      table
        .foreign('answer_id')
        .references('answers.id')
        .onDelete('cascade')
    })
  }

  down () {
    this.drop('user_answers')
  }
}

module.exports = UserAnswerSchema
