require 'pry'

class UserMailer < ApplicationMailer
  ActionMailer::Base.delivery_method = :smtp
  ActionMailer::Base.smtp_settings = {
      :enable_starttls_auto => true,
      :address => "smtp.gmail.com",
      :port => 587,
      :domain => "gmail.com",
      :user_name => "omaikiis@gmail.com",
      :password => "3fkc6y4Q!",
      :authentication => :plain
  }
  default from: 'DoNotRespond@JapanFour.com'

  def welcome_email(user)
    user = User.find(user.id)
    user[:token] = SecureRandom.urlsafe_base64(nil, false)
    user[:token_date] = DateTime.now
    user.save
    @login = user[:login]
    @first_name = user[:first_name]
    @url = 'http://0.0.0.0:3000/users/' + user[:token]

    mail(to: user[:email], subject: 'Welcome to My Awesome Site')
  end
end
