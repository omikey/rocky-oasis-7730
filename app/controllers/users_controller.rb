require 'bcrypt'
require 'pry'

class UsersController < ApplicationController
  def create
    if User.where(login: params[:user][:login]).any?
      @user = params[:user]
      if User.authenticate(@user[:login], @user[:password])
        session[:user] = User.where(login: params[:user][:login]).first
      end
    else
      User.where(login: params[:user][:login]).any?
      if params[:user][:email]
        @user = User.new(user_params)
        @user[:password] = BCrypt::Password.create(@user[:password])
        @user.status = false
        @user.token_date = DateTime.now
        @user.save
        UserMailer.welcome_email(@user).deliver
      end
    end
    render nothing: true
  end

  def new
    @user = User.new
  end

  def index
    @users = User.where(token: params[:id]).first if params[:id]
  end

  def show
    @user = User.new
    good_news = false
    if params[:id]
      user = User.where(token: params[:id]).first
      good_news = user && (DateTime.now - 1.hour < user[:token_date])
      if good_news
        @user = user
        user[:status] = true
        user.save
      end
    end

    if good_news
      session[:user] = user
      redirect_to(root_url(mission: 'accomplished'), notice: 'User was successfully created.')
    else
      redirect_to(new_user_url, notice: 'Validation invalid or expired.')
    end
  end

  private

  def user_params
    params.require(:user).permit(:avatar_url, :first_name, :last_name, :email, :login, :password, :salt, :encrypted_password)
  end
end