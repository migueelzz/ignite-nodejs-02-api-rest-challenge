import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary()
    table.uuid('user_id').references('users.id').after('id').onDelete('CASCADE')
    table.text('title').notNullable()
    table.text('description').notNullable()
    table.boolean('is_diet').notNullable().defaultTo(false)
    table.date('date').notNullable()
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
