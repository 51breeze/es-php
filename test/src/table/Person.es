package table;

struct table Person{
  id: int(11) auto_increment,
  account: varchar(16),
  password: varchar(32),
  create_at:int(11),
  status:int(6),
  title?: varchar(32) DEFAULT '',
  PRIMARY KEY(id),
  FULLTEXT KEY title(title)
}