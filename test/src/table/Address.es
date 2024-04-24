package table;

struct table Address{
  id: int(11) auto_increment,
  uid:int(11),
  area: varchar(255) DEFAULT '',
  content: varchar(255) DEFAULT '',
  phone: varchar(16) DEFAULT '' ,
  postcode?: varchar(32),
  PRIMARY KEY(id)
}