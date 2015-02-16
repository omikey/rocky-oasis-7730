class MainController < ApplicationController
  def index
  end

  def dashboard
    @listening = []
    4.times do |k|
      @listening.push({title:"Part #{(k+1).to_s}",
                       score: 50 + rand(51),
                       mypace: "#{(2 + rand(3)).to_s}s",
                       yourpace: "#{(2 + rand(3)).to_s}s"})
    end

    @reading = []
    3.times do |k|
      @reading.push({title:"Part #{(k+5).to_s}",
                     score: 50 + rand(51),
                     mypace: "#{(25 + rand(56)).to_s}s",
                     yourpace: "#{(25 + rand(56)).to_s}s"})
    end

    rand = rand(51)
    @readingWPM = {total:100 + rand,percent:(((100+rand)/1.5) + 0.5).to_i}

    rand = rand(4000)
    @vocabulary = {total:4000 + rand,percent:(((4000+rand)/80) + 0.5).to_i}


    @improvement = []

    7.times do |k|
      @improvement.push(50 + rand(51))
    end
    render json: {listening: @listening, reading: @reading,
                  readingWPM: @readingWPM, vocabulary: @vocabulary,
                  improvement: @improvement, date: Time.now().strftime('%B %d, %Y'),
                  goal: (rand(5)+6)*100}
  end
end
