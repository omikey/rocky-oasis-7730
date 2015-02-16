#encoding: utf-8

5.times do |k|
  list = List.new(name:k+1)
  list.save
  Word.new(english:'black',japanese:'くろい',list:list).save
end