class ApplicationMailer < ActionMailer::Base
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
  layout 'mailer'
end
