#encoding: utf-8

unless Forum.any?
  Forum.new(title: 'Hey Roger').save
  Query.new(title: 'Check This Out', forum_id: 1, user_id: 1).save
  Post.new(message: 'I made a dang message board', query_id: 1, user_id: 1).save
end
