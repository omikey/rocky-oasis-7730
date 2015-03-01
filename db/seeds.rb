#encoding: utf-8

Forum.find_or_create_by(title: 'Hey Roger')

Query.find_or_create_by(title: 'Check This Out', forum_id: 1, user_id: 1)

Post.find_or_create_by(message: 'I made a dang message board', query_id: 1, user_id: 1)
