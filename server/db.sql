create database blogs_db;
use blogs_db;

create table user (
  id integer primary key auto_increment,
  firstName varchar(50),
  lastName varchar(50),
  password varchar(600),
  email varchar(50),
  birthDate date,
  addressLine1 varchar(50),
  addressLine2 varchar(50),
  city varchar(50),
  state varchar(50),
  country varchar(50),
  postalCode integer,
  phone varchar(50),
  gender int(1), /* 0: female, 1: male */
  profileImage varchar(50),
  isActive int(1) default 1,
  createdTimestamp timestamp default CURRENT_TIMESTAMP
);

create table blog (
  id integer primary key auto_increment,
  userId integer,
  title varchar(100),
  details varchar(1024),
  tags varchar(500),

  /* 0: draft, 1: private, 2: public */
  state int(1) default 0,
  createdTimestamp timestamp default CURRENT_TIMESTAMP
);

create table blog_attachment(
  id integer primary key auto_increment,
  type varchar(10),
  url varchar(100),
  blogId integer,
  createdTimestamp timestamp default CURRENT_TIMESTAMP
);

create table blog_comment(
  id integer primary key auto_increment,
  userId integer,
  blogId integer,
  comment varchar(1024),
  createdTimestamp timestamp default CURRENT_TIMESTAMP
);

create table blog_rating(
  id integer primary key auto_increment,
  userId integer,
  blogId integer,
  rating float,
  createdTimestamp timestamp default CURRENT_TIMESTAMP
);

create table blog_like_status(
  id integer primary key auto_increment,
  userId integer,
  blogId integer,
  type int(1),
  createdTimestamp timestamp default CURRENT_TIMESTAMP
);