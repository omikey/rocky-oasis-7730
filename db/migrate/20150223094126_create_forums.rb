class CreateForums < ActiveRecord::Migration
  def change
    create_table :forums do |t|
      t.string :title

      t.timestamps null: false
    end
  end
end
