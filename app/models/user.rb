require 'bcrypt'
require 'pry'

class User < ActiveRecord::Base
  has_many :posts

  def self.authenticate(login, password)
    return BCrypt::Password.new(find_by_login(login)[:password]).is_password? password
  end
end