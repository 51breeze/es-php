package table;

@Define(sql=false)
struct table BaseTable extends DataEntity{
    @Define(order=first)
    id?:int(11) auto_increment

    @Define(order=last)
    createAt?:int(11)

    @Define(order=last)
    updateAt?:int(11)

    PRIMARY KEY(id)

} ENGINE=InnoDB CHARSET=utf8;