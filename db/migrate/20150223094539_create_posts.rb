class CreatePosts < ActiveRecord::Migration
  def change
    create_table :posts do |t|
      t.references :query, index: true
      t.references :user, index: true
      t.string :message

      t.timestamps null: false
    end
    add_foreign_key :posts, :queries
    add_foreign_key :posts, :users
  end
end
