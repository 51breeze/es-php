package table;

struct table Address extends BaseTable{
 
  uid:int(11),
  area: varchar(255) DEFAULT '',
  email: email(255) DEFAULT '',
  range:range(6,12),
  data?:text(),
  phone: varchar(16) DEFAULT '' ,
  postcode?: varchar(32),
  status?: enum(Types),
  
}