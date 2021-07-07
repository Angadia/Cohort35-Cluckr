
exports.up = function(knex) {
  return knex.schema.createTable('hash_tags', (t) => {
    t.bigIncrements('id');
    t.string('hash_tag');
    t.integer('count').unsigned().notNullable();
    t.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('hash_tags');
};
