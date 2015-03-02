class CreateQueries < ActiveRecord::Migration
  def change
    create_table :queries do |t|
      t.references :user, index: true
      t.references :forum, index: true
      t.string :title

      t.timestamps null: false
    end
    add_foreign_key :queries, :users
    add_foreign_key :queries, :forums
  end
end