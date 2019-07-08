'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AnswerSchema extends Schema {
  up () {
    this.create('answers', (table) => {
      table.increments()
      table.integer('crossword_id').index('crossword_id').unsigned()
      table.integer('number').notNullable()
      table.string('question').notNullable()
      table.string('answer').notNullable()
      table.boolean('is_clue').notNullable()
      table.string('indexes').notNullable()

      table.foreign('crossword_id').references('crosswords.id')
    })
  }

  down () {
    this.drop('answers')
  }
}

module.exports = AnswerSchema
