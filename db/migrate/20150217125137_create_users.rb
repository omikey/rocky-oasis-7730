class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :first_name
      t.string :last_name
      t.string :email
      t.string :login
      t.string :password
      t.string :token
      t.datetime :token_date
      t.boolean :status

      t.timestamps null: false
    end
  end
end
