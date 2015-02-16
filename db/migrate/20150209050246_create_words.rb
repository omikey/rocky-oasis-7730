class CreateWords < ActiveRecord::Migration
  def change
    create_table :words do |t|
      t.string :english
      t.string :japanese
      t.references :list, index: true

      t.timestamps null: false
    end
    add_foreign_key :words, :lists
  end
end
