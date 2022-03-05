create table users (
  id serial primary key,
  name text,
  image text,
  username text not null unique,
  email text unique,
  site text,
  bio text,
  phone text,
  sex text,
  password text not null,
  verified boolean default false
);

create table posts (
  id serial primary key,
  user_id int not null,
  date timestamptz default now(),
  text_body text,
  foreign key (user_id) references users (id)
);

create table posts_comments (
  id serial primary key,
  text_body text not null,
  date timestamptz default now(),
  user_id int not null,
  post_id int not null,
  foreign key (post_id) references posts (id),
  foreign key (user_id) references users (id)
);

create table posts_photos (
  id serial primary key,
  post_id int not null,
  image text not null,
  foreign key (post_id) references posts (id)
);

create table posts_likes (
  user_id int not null,
  post_id int not null,
  date timestamptz default now(),
  foreign key (post_id) references posts (id),
  foreign key (user_id) references users (id)
);