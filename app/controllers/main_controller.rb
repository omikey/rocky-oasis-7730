require 'pry'

class MainController < ApplicationController
  def index
    if params[:mission] == 'accomplished'
      @alert = 'You are now a registered member!'
    end
    @user = User.new
    @login = session[:user]
  end

  def signout
    session.destroy
    render nothing: true
  end

  def postit
    post = params[:post]
    post.gsub!('&nbsp;', ' ')
    #binding.pry

    Post.new(query_id: params[:query],
             user_id: session[:user]['id'],
             message: post).save
    redirect_to(main_community_url)
  end

  def dashboard
    @listening = []
    4.times do |k|
      @listening.push({title: "Part\u00a0#{(k+1).to_s}",
                       score: 50 + rand(51),
                       mypace: "#{(2 + rand(3)).to_s}s",
                       yourpace: "#{(2 + rand(3)).to_s}s"})
    end

    @reading = []
    3.times do |k|
      @reading.push({title: "Part\u00a0#{(k+5).to_s}",
                     score: 50 + rand(51),
                     mypace: "#{(25 + rand(56)).to_s}s",
                     yourpace: "#{(25 + rand(56)).to_s}s"})
    end

    rand = rand(51)
    @readingWPM = {total: 100 + rand,
                   percent: (((100+rand)/1.5) + 0.5).to_i}

    rand = rand(4000)
    @vocabulary = {total: 4000 + rand,
                   percent: (((4000+rand)/80) + 0.5).to_i}

    @improvement = []

    7.times { @improvement.push(50 + rand(51)) }
    render json: {listening: @listening,
                  reading: @reading,
                  readingWPM: @readingWPM,
                  vocabulary: @vocabulary,
                  improvement: @improvement,
                  date: Time.now().strftime('%B %d, %Y'),
                  goal: (rand(5)+6)*100}
  end

  def community
    if params[:get] == 'post'
      posts = []
      Post.where(query_id: params[:id]).each do |post|
        posts.push({id: post.id,
                    message: post.message,
                    user: post.user.login,
                    user_posts: post.user.posts.count,
                    user_joined: post.user.created_at.strftime('%m/%d/%Y'),
                    updated: post[:updated_at].strftime('%b %e, %l:%M %p')})
      end
      render json: {posts: posts}
    elsif params[:get] == 'forum'
      queries = []
      Query.where(forum_id: params[:id]).includes(:posts).each do |query|
        queries.push({id: query.id,
                      title: query.title,
                      posts: query.posts.count,
                      user: query.user.login,
                      updated: query.posts.order(:updated_at).last[:updated_at].strftime('%b %e, %l:%M %p')})
      end
      render json: {queries: queries}
    else
      forums = []
      Forum.includes(queries: :posts).each do |forum|
        forums.push({id: forum.id,
                     title: forum.title,
                     queries: forum.queries.count,
                     responses: forum.queries.map { |k| k.posts.count }.inject { |sum, x| sum + x },
                     updated: forum.queries.map { |k| k.posts.order(:updated_at).last[:updated_at] }.sort[0].strftime('%b %e, %l:%M %p')})
      end
      render json: {forums: forums}
    end
  end
end