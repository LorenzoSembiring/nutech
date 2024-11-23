/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
  .createTable('users', function(table) {
    table.increments('id').primary();
    table.string('email', 255).notNullable();
    table.string('first_name', 255).notNullable();
    table.string('last_name', 255).notNullable();
    table.string('password', 255).notNullable();
    table.string('profile_image', 255).nullable();
    table.integer('balance').nullable();
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('users');
};
