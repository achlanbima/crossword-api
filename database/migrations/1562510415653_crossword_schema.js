'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CrosswordSchema extends Schema {
  up () {
    this.create('crosswords', (table) => {
      table.increments()
      table.string('name', 80).notNullable()
      table.integer('total_column').notNullable()
    })
  }

  down () {
    this.drop('crosswords')
  }
}

module.exports = CrosswordSchema
