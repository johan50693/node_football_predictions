

CREATE TABLE users (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  created_at date,
  PRIMARY KEY (id)
);

CREATE TABLE tournaments (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  description varchar(255),
  createdby int,
  status int, 
  PRIMARY KEY (id)
);

CREATE TABLE tournaments_users (
  id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL, 
  tournament_id int NOT NULL,
  status int, 
  PRIMARY KEY (id),
  KEY user_id_idx (user_id),
  KEY tournament_id_idx (tournament_id)
);

CREATE TABLE points (
  id int NOT NULL AUTO_INCREMENT,
  exact_marker int NOT NULL, 
  winner_selection int NOT NULL, 
  goals_of_a_team int NOT NULL, 
  goals_difference int NOT NULL, 
  tournament_id int NOT NULL,
  PRIMARY KEY (id),
  KEY tournament_id_idx (tournament_id)
);


CREATE TABLE matches (
  id int NOT NULL AUTO_INCREMENT,
  league varchar(255) NOT NULL,
  team_a varchar(255) NOT NULL,
  team_b varchar(255) NOT NULL,
  goals_a int, 
  goals_b int, 
  penalties_a int, 
  penalties_b int, 
  date TIMESTAMP ,
  created_at date,
  status int, 
  PRIMARY KEY (id)
);

CREATE TABLE poll (
  id int NOT NULL AUTO_INCREMENT,
  tournament_id int NOT NULL,
  matches_id int NOT NULL,
  created_by int NOT NULL,
  status int, 
  created_at date,
  PRIMARY KEY (id),
  KEY tournament_id_idx (tournament_id),
  KEY matches_id_idx (matches_id),
  KEY created_by_id_idx (created_by)
);


CREATE TABLE answers (
  id int NOT NULL AUTO_INCREMENT,
  goals_a int, 
  goals_b int, 
  penalties_a int, 
  penalties_b int, 
  date TIMESTAMP ,
  created_at date,
  poll_id int NOT NULL,
  user_id int NOT NULL, 
  status int, 
  PRIMARY KEY (id),
  KEY user_id_idx (user_id),
  KEY poll_id_idx (poll_id)
);