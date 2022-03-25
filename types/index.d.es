
package think.facade{

    declare static class Db{

        static table( name:string ):think.db.BaseQuery;

        static name( name:string ):think.db.BaseQuery;
    }

}


package think.db{

    declare interface ConnectionInterface{

        /**
        * 获取当前连接器类对应的Query类
        * @access public
        * @return string
        */
        public getQueryClass(): string;

        /**
        * 指定表名开始查询
        * @param $table
        * @return BaseQuery
        */
        public table(table);

        /**
        * 指定表名开始查询(不带前缀)
        * @param $name
        * @return BaseQuery
        */
        public name(name);

        /**
        * 连接数据库方法
        * @access public
        * @param array   $config  接参数
        * @param integer $linkNum 连接序号
        * @return mixed
        */
        public connect(config:array = [], linkNum:int = 0);

        /**
        * 设置当前的数据库Db对象
        * @access public
        * @param DbManager $db
        * @return void
        */
        public setDb(db);

        /**
        * 设置当前的缓存对象
        * @access public
        * @param CacheInterface $cache
        * @return void
        */
        public setCache(cache);

        /**
        * 获取数据库的配置参数
        * @access public
        * @param string $config 配置名称
        * @return mixed
        */
        public getConfig(config:string = '');

        /**
        * 关闭数据库（或者重新连接）
        * @access public
        * @return $this
        */
        public close();

        /**
        * 查找单条记录
        * @access public
        * @param BaseQuery $query 查询对象
        * @return array
        */
        public find(query:BaseQuery): array;

        /**
        * 查找记录
        * @access public
        * @param BaseQuery $query 查询对象
        * @return array
        */
        public select(query:BaseQuery): array;

        /**
        * 插入记录
        * @access public
        * @param BaseQuery   $query        查询对象
        * @param boolean $getLastInsID 返回自增主键
        * @return mixed
        */
        public insert(query:BaseQuery, getLastInsID:boolean = false);

        /**
        * 批量插入记录
        * @access public
        * @param BaseQuery   $query   查询对象
        * @param mixed   $dataSet 数据集
        * @return integer
        */
        public insertAll(query:BaseQuery, dataSet:array = []): int;

        /**
        * 更新记录
        * @access public
        * @param BaseQuery $query 查询对象
        * @return integer
        */
        public update(query:BaseQuery): int;

        /**
        * 删除记录
        * @access public
        * @param BaseQuery $query 查询对象
        * @return int
        */
        public delete(query:BaseQuery): int;

        /**
        * 得到某个字段的值
        * @access public
        * @param BaseQuery  $query   查询对象
        * @param string $field   字段名
        * @param mixed  $default 默认值
        * @return mixed
        */
        public value(query:BaseQuery, field:string, defaultValue:any = null);

        /**
        * 得到某个列的数组
        * @access public
        * @param BaseQuery  $query  查询对象
        * @param string|array $column 字段名 多个字段用逗号分隔
        * @param string $key    索引
        * @return array
        */
        public column(query:BaseQuery, column:string | array, key:string = ''): array;

        /**
        * 执行数据库事务
        * @access public
        * @param callable $callback 数据操作方法回调
        * @return mixed
        */
        public transaction(callback:()=>any);

        /**
        * 启动事务
        * @access public
        * @return void
        */
        public startTrans();

        /**
        * 用于非自动提交状态下面的查询提交
        * @access public
        * @return void
        */
        public commit();

        /**
        * 事务回滚
        * @access public
        * @return void
        */
        public rollback();

        /**
        * 获取最近一次查询的sql语句
        * @access public
        * @return string
        */
        public getLastSql(): string;

    }

    declare class BaseQuery{

        /**
        * 创建一个新的查询对象
        * @access public
        * @return BaseQuery
        */
        public newQuery(): BaseQuery
    
        /**
        * 获取当前的数据库Connection对象
        * @access public
        * @return ConnectionInterface
        */
        public getConnection():ConnectionInterface

        /**
        * 指定当前数据表名（不含前缀）
        * @access public
        * @param string $name 不含前缀的数据表名字
        * @return $this
        */
        public name(name:string):this

        /**
        * 获取当前的数据表名称
        * @access public
        * @return string
        */
        public getName(): string

        /**
        * 获取数据库的配置参数
        * @access public
        * @param string $name 参数名称
        * @return mixed
        */
        public getConfig( name:string = ''):any;

        /**
        * 得到当前或者指定名称的数据表
        * @access public
        * @param string $name 不含前缀的数据表名字
        * @return mixed
        */
        public getTable( name:string = ''):string | null

        /**
        * 设置字段类型信息
        * @access public
        * @param array $type 字段类型信息
        * @return $this
        */
        public setFieldType(type:array):this;


        /**
        * 获取最近一次查询的sql语句
        * @access public
        * @return string
        */
        public getLastSql(): string


        /**
        * 获取返回或者影响的记录数
        * @access public
        * @return integer
        */
        public getNumRows(): int

        /**
        * 获取最近插入的ID
        * @access public
        * @param string $sequence 自增序列名
        * @return mixed
        */
        public getLastInsID( sequence:string = null):any;


        /**
        * 得到某个字段的值
        * @access public
        * @param string $field   字段名
        * @param mixed  $default 默认值
        * @return mixed
        */
        public value(field:string, defaultValue:any = null):any;

        /**
        * 得到某个列的数组
        * @access public
        * @param string|array $field 字段名 多个字段用逗号分隔
        * @param string       $key   索引
        * @return array
        */
        public column(field, key:string = ''): array

        /**
        * 查询SQL组装 union
        * @access public
        * @param mixed   $union UNION
        * @param boolean $all   是否适用UNION ALL
        * @return $this
        */
        public union(union, all:boolean = false):this

        /**
        * 查询SQL组装 union all
        * @access public
        * @param mixed $union UNION数据
        * @return $this
        */
        public unionAll(union):this;

        /**
        * 指定查询字段
        * @access public
        * @param mixed $field 字段信息
        * @return $this
        */
        public field(field):this;

        /**
        * 指定要排除的查询字段
        * @access public
        * @param array|string $field 要排除的字段
        * @return $this
        */
        public withoutField(field):this

        /**
        * 指定其它数据表的查询字段
        * @access public
        * @param mixed   $field     字段信息
        * @param string  $tableName 数据表名
        * @param string  $prefix    字段前缀
        * @param string  $alias     别名前缀
        * @return $this
        */
        public tableField(field, tableName:string, prefix:string = '', alias:string = ''):this

        /**
        * 设置数据
        * @access public
        * @param array $data 数据
        * @return $this
        */
        public data(data:array):this

        /**
        * 去除查询参数
        * @access public
        * @param string $option 参数名 留空去除所有参数
        * @return $this
        */
        public removeOption( option:string = ''):this;

        /**
        * 指定查询数量
        * @access public
        * @param int $offset 起始位置
        * @param int $length 查询数量
        * @return $this
        */
        public limit(offset:int, length:int = null):this;

        /**
        * 指定分页
        * @access public
        * @param int $page     页数
        * @param int $listRows 每页数量
        * @return $this
        */
        public page(page:int, listRows:int = null):this;


        /**
        * 指定当前操作的数据表
        * @access public
        * @param mixed $table 表名
        * @return $this
        */
        public table($table):this;


        /**
        * 指定排序 order('id','desc') 或者 order(['id'=>'desc','create_time'=>'desc'])
        * @access public
        * @param string|array|Raw $field 排序字段
        * @param string           $order 排序
        * @return $this
        */
        public order(field, order:string = ''):this;


        /**
        * 分页查询
        * @access public
        * @param int|array $listRows 每页数量 数组表示配置参数
        * @param int|bool  $simple   是否简洁模式或者总记录数
        * @return Paginator
        * @throws Exception
        */
        public paginate(listRows:any = null, simple:boolean = false): think.Paginator
        

        /**
        * 根据数字类型字段进行分页查询（大数据）
        * @access public
        * @param int|array $listRows 每页数量或者分页配置
        * @param string    $key      分页索引键
        * @param string    $sort     索引键排序 asc|desc
        * @return Paginator
        * @throws Exception
        */
        public paginateX(listRows = null,  key:string = null, sort:string = null): think.Paginator

        /**
        * 根据最后ID查询更多N个数据
        * @access public
        * @param int        $limit  LIMIT
        * @param int|string $lastId LastId
        * @param string     $key    分页索引键 默认为主键
        * @param string     $sort   索引键排序 asc|desc
        * @return array
        * @throws Exception
        */
        public more(limit:int, lastId:int = null, key:string = null, sort:string = null): array
    

        /**
        * 查询缓存 数据为空不缓存
        * @access public
        * @param mixed             $key    缓存key
        * @param integer|\DateTime $expire 缓存有效期
        * @param string|array      $tag    缓存标签
        * @param bool              $always 始终缓存
        * @return $this
        */
        public cache(key:any = true, expire:int = null, tag:string|array = null, always:boolean = false):this;


        /**
        * 查询缓存 允许缓存空数据
        * @access public
        * @param mixed             $key    缓存key
        * @param integer|\DateTime $expire 缓存有效期
        * @param string|array      $tag    缓存标签
        * @return $this
        */
        public cacheAlways(key = true, expire = null, tag = null):this;

        /**
        * 指定查询lock
        * @access public
        * @param bool|string $lock 是否lock
        * @return $this
        */
        public lock(lock = false):this

        /**
        * 指定数据表别名
        * @access public
        * @param array|string $alias 数据表别名
        * @return $this
        */
        public alias(alias):this;


        /**
        * 设置从主服务器读取数据
        * @access public
        * @param bool $readMaster 是否从主服务器读取
        * @return $this
        */
        public master(readMaster:boolean = true):this;

        /**
        * 设置是否严格检查字段名
        * @access public
        * @param bool $strict 是否严格检查字段
        * @return $this
        */
        public strict( strict:boolean = true):this;

        /**
        * 设置自增序列名
        * @access public
        * @param string $sequence 自增序列名
        * @return $this
        */
        public sequence(sequence:string = null):this

        /**
        * 设置JSON字段信息
        * @access public
        * @param array $json  JSON字段
        * @param bool  $assoc 是否取出数组
        * @return $this
        */
        public json(json:array = [], assoc:boolean = false):this


        /**
        * 指定数据表主键
        * @access public
        * @param string|array $pk 主键
        * @return $this
        */
        public pk($pk):this
        /**
        * 查询参数批量赋值
        * @access protected
        * @param array $options 表达式参数
        * @return $this
        */
        protected options(options:array):this

        /**
        * 获取当前的查询参数
        * @access public
        * @param string $name 参数名
        * @return mixed
        */
        public getOptions(name = ''):any

        /**
        * 设置当前的查询参数
        * @access public
        * @param string $option 参数名
        * @param mixed  $value  参数值
        * @return $this
        */
        public setOption( option:string, value:any):this

        /**
        * 设置当前字段添加的表别名
        * @access public
        * @param string $via 临时表别名
        * @return $this
        */
        public via( via:string = ''):this

        /**
        * 保存记录 自动判断insert或者update
        * @access public
        * @param array $data        数据
        * @param bool  $forceInsert 是否强制insert
        * @return integer
        */
        public save( data:array = [],forceInsert:boolean = false):int


        /**
        * 插入记录
        * @access public
        * @param array   $data         数据
        * @param boolean $getLastInsID 返回自增主键
        * @return integer|string
        */
        public insert(data:array = [], getLastInsID:boolean=false):int | string


        /**
        * 插入记录并获取自增ID
        * @access public
        * @param array $data 数据
        * @return integer|string
        */
        public insertGetId(data:array):int | string

        /**
        * 批量插入记录
        * @access public
        * @param array   $dataSet 数据集
        * @param integer $limit   每次写入数据限制
        * @return integer
        */
        public insertAll( dataSet:array = [], limit:int = 0): int
    

        /**
        * 通过Select方式插入记录
        * @access public
        * @param array  $fields 要插入的数据表字段名
        * @param string $table  要插入的数据表名
        * @return integer
        */
        public selectInsert(fields:array, table:string): int

        /**
        * 更新记录
        * @access public
        * @param mixed $data 数据
        * @return integer
        * @throws Exception
        */
        public update( data:array = []): int
        

        /**
        * 删除记录
        * @access public
        * @param mixed $data 表达式 true 表示强制删除
        * @return int
        * @throws Exception
        */
        public delete(data = null): int
    

        /**
        * 查找记录
        * @access public
        * @param mixed $data 数据
        * @return Collection|array|static[]
        * @throws Exception
        * @throws ModelNotFoundException
        * @throws DataNotFoundException
        */
        public select(data = null): think.Collection
    

        /**
        * 查找单条记录
        * @access public
        * @param mixed $data 查询数据
        * @return array|Model|null|static|mixed
        * @throws Exception
        * @throws ModelNotFoundException
        * @throws DataNotFoundException
        */
        public find(data):any
    

        /**
        * 分析表达式（可用于查询或者写入操作）
        * @access public
        * @return array
        */
        public parseOptions(): array
        

        /**
        * 分析数据是否存在更新条件
        * @access public
        * @param array $data 数据
        * @return bool
        * @throws Exception
        */
        public parseUpdateData(data:array): boolean
    

        /**
        * 把主键值转换为查询条件 支持复合主键
        * @access public
        * @param array|string $data 主键数据
        * @return void
        * @throws Exception
        */
        public parsePkWhere(data): void
    

        /**
        * 获取模型的更新条件
        * @access protected
        * @param array $options 查询参数
        */
        protected getModelUpdateCondition(options:array):any;

    }

}


package think{

    declare class Collection{

        constructor(items:array = []);

        public isEmpty(): boolean

        public  toArray(): array

        public all(): array

        /**
        * 合并数组
        *
        * @access public
        * @param mixed $items 数据
        * @return static
        */
        public merge(items:any):this


        /**
        * 按指定键整理数据
        *
        * @access public
        * @param mixed  $items    数据
        * @param string $indexKey 键名
        * @return array
        */
        public dictionary(items?:any, indexKey?:string):array

        /**
        * 比较数组，返回差集
        *
        * @access public
        * @param mixed  $items    数据
        * @param string $indexKey 指定比较的键名
        * @return static
        */
        public diff(items:any, indexKey?:string):this

        /**
        * 比较数组，返回交集
        *
        * @access public
        * @param mixed  $items    数据
        * @param string $indexKey 指定比较的键名
        * @return static
        */
        public intersect(items:any, indexKey?:string):this;


        /**
        * 交换数组中的键和值
        *
        * @access public
        * @return static
        */
        public flip():this;

        /**
        * 返回数组中所有的键名
        *
        * @access public
        * @return static
        */
        public keys():this;

        /**
        * 返回数组中所有的值组成的新 Collection 实例
        * @access public
        * @return static
        */
        public values():this

        /**
        * 删除数组的最后一个元素（出栈）
        *
        * @access public
        * @return mixed
        */
        public pop():any;

        /**
        * 通过使用用户自定义函数，以字符串返回数组
        *
        * @access public
        * @param callable $callback 调用方法
        * @param mixed    $initial
        * @return mixed
        */
        public reduce( callback:()=>any, initial?:any):array;

        /**
        * 以相反的顺序返回数组。
        *
        * @access public
        * @return static
        */
        public reverse():this

        /**
        * 删除数组中首个元素，并返回被删除元素的值
        *
        * @access public
        * @return mixed
        */
        public shift():any

        /**
        * 在数组结尾插入一个元素
        * @access public
        * @param mixed  $value 元素
        * @param string $key   KEY
        * @return $this
        */
        public push(value:any, key?:string):this

        /**
        * 把一个数组分割为新的数组块.
        *
        * @access public
        * @param int  $size 块大小
        * @param bool $preserveKeys
        * @return static
        */
        public chunk(size:int, preserveKeys:boolean = false):this

        /**
        * 在数组开头插入一个元素
        * @access public
        * @param mixed  $value 元素
        * @param string $key   KEY
        * @return $this
        */
        public unshift(value:any, key?:string):this

        /**
        * 给每个元素执行个回调
        *
        * @access public
        * @param callable $callback 回调
        * @return $this
        */
        public each(callback:()=>void):this

        /**
        * 用回调函数处理数组中的元素
        * @access public
        * @param callable|null $callback 回调
        * @return static
        */
        public map( callback:()=>any ):this


        /**
        * 用回调函数过滤数组中的元素
        * @access public
        * @param callable|null $callback 回调
        * @return static
        */
        public filter( callback?:()=>boolean ):this

        /**
        * 根据字段条件过滤数组中的元素
        * @access public
        * @param string $field    字段名
        * @param mixed  $operator 操作符
        * @param mixed  $value    数据
        * @return static
        */
        public where(field:string, operator:string='', value:any = null);

    }

    declare class Paginator{

        /**
        * 获取数据总条数
        * @return int
        */
        public total(): int

        /**
        * 获取每页数量
        * @return int
        */
        public listRows(): int

        /**
        * 获取当前页页码
        * @return int
        */
        public currentPage(): int

        /**
        * 获取最后一页页码
        * @return int
        */
        public lastPage(): int

        /**
        * 数据是否足够分页
        * @access public
        * @return bool
        */
        public hasPages(): boolean

        /**
        * 创建一组分页链接
        *
        * @access public
        * @param int $start
        * @param int $end
        * @return array
        */
        public getUrlRange(start:int, end:int): array

        /**
        * 设置URL锚点
        *
        * @access public
        * @param string|null $fragment
        * @return $this
        */
        public fragment( fragment:string = null):this;
        
        /**
        * 添加URL参数
        *
        * @access public
        * @param array $append
        * @return $this
        */
        public appends(append:array):this;

        /**
        * 构造锚点字符串
        *
        * @access public
        * @return string
        */
        protected buildFragment(): string

        public items():any;

        /**
        * 获取数据集
        *
        * @return Collection|\think\model\Collection
        */
        public getCollection():think.Collection


        public isEmpty(): boolean


        /**
        * 给每个元素执行个回调
        *
        * @access public
        * @param callable $callback
        * @return $this
        */
        public each(callback:()=>void)
    

        /**
        * 统计数据集条数
        * @return int
        */
        public count(): int

        /**
        * 转换为数组
        * @return array
        */
        public toArray(): array

    }


    declare class Request{


        /**
        * 获取当前包含协议的域名
        * @access public
        * @param  bool $port 是否需要去除端口号
        * @return string
        */
        domain(port?:boolean):string;

        /**
        * 获取当前根域名
        * @access public
        * @return string
        */
        rootDomain():string;

        /**
        * 获取当前子域名
        * @access public
        * @return string
        */
        subDomain():string;

        /**
        * 获取当前泛域名的值
        * @access public
        * @return string
        */
        panDomain():string;


        /**
        * 获取当前URL 不含QUERY_STRING
        * @access public
        * @param  bool $complete 是否包含完整域名
        * @return string
        */
        baseUrl(complete:boolean = false): string


        /**
        * 设置当前包含协议的域名
        * @access public
        * @param  string $domain 域名
        * @return $this
        */
        setDomain(domain:string)

         /**
        * 设置当前泛域名的值
        * @access public
        * @param  string $domain 域名
        * @return $this
        */
        setSubDomain(domain:string):string;

        /**
        * 设置当前泛域名的值
        * @access public
        * @param  string $domain 域名
        * @return $this
        */
        setPanDomain(domain:string):string;

        /**
        * 获取当前完整URL 包括QUERY_STRING
        * @access public
        * @param  bool $complete 是否包含完整域名
        * @return string
        */
        url(complete:boolean):string;

        /**
        * 设置当前完整URL 包括QUERY_STRING
        * @access public
        * @param  string $url URL地址
        * @return $this
        */
        setUrl(url:string):this;

        /**
        * 设置当前URL 不含QUERY_STRING
        * @access public
        * @param  string $url URL地址
        * @return $this
        */
        setBaseUrl(url):this;


         /**
        * 获取当前请求的参数
        * @access public
        * @param  string|array $name 变量名
        * @param  mixed        $default 默认值
        * @param  string|array $filter 过滤方法
        * @return mixed
        */
        param<T>(name:string, defaultValue?:T, filter?:string | array):T

        /**
        * 获取包含文件在内的请求参数
        * @access public
        * @param  string|array $name 变量名
        * @param  string|array $filter 过滤方法
        * @return mixed
        */
        all<T>(name?:string, filter?:string | array):T

         /**
        * 获取POST参数
        * @access public
        * @param  string|array $name 变量名
        * @param  mixed        $default 默认值
        * @param  string|array $filter 过滤方法
        * @return mixed
        */
        post<T>(name?:string, defaultValue?:T, filter?:string | array):T

    }

    declare class Response{

        /**
        * 原始数据
        * @var mixed
        */
        //protected var data:any;

        /**
        * 当前contentType
        * @var string
        */
        //protected var contentType = 'text/html';

        /**
        * 字符集
        * @var string
        */
        //protected var charset = 'utf-8';

        /**
        * 状态码
        * @var integer
        */
        //protected var code = 200;

        /**
        * 是否允许请求缓存
        * @var bool
        */
        //protected var allowCache = true;

        /**
        * 输出参数 
        * @var array
        */
        //protected var options = [];

        /**
        * header参数
        * @var array
        */
        //protected var header = [];

        /**
        * 输出内容
        * @var string
        */
        //protected var content = null;

        /**
        * Cookie对象
        * @var Cookie
        */
        //protected var cookie:any;

        /**
        * Session对象
        * @var Session
        */
        //protected var session:any;

        /**
        * 初始化
        * @access protected
        * @param  mixed  $data 输出数据
        * @param  int    $code 状态码
        */
        protected init(data:any, code:int = 200)

        /**
        * 创建Response对象
        * @access public
        * @param  mixed  $data 输出数据
        * @param  string $type 输出类型
        * @param  int    $code 状态码
        * @return Response
        */
        public static create(data:any, type:string = 'html', code:int = 200): Response


        /**
        * 设置Session对象
        * @access public
        * @param  Session $session Session对象
        * @return $this
        */
        setSession(session):this


        /**
        * 发送数据到客户端
        * @access public
        * @return void
        * @throws \InvalidArgumentException
        */
        send(): void


        /**
        * 处理数据
        * @access protected
        * @param  mixed $data 要处理的数据
        * @return mixed
        */
        protected output(data:any):any


        /**
        * 输出数据
        * @access protected
        * @param string $data 要处理的数据
        * @return void
        */
        protected sendData(data:string): void


        /**
        * 输出的参数
        * @access public
        * @param  mixed $options 输出参数
        * @return $this
        */
        options( options:array = []):this


        /**
        * 输出数据设置
        * @access public
        * @param  mixed $data 输出数据
        * @return $this
        */
        data(data:any):this


        /**
        * 是否允许请求缓存
        * @access public
        * @param  bool $cache 允许请求缓存
        * @return $this
        */
        allowCache(cache:boolean):this

        /**
        * 是否允许请求缓存
        * @access public
        * @return bool
        */
        isAllowCache():boolean


        /**
        * 设置Cookie
        * @access public
        * @param  string $name  cookie名称
        * @param  string $value cookie值
        * @param  mixed  $option 可选参数
        * @return $this
        */
        cookie(name:string, value:string, option = null):this


        /**
        * 设置响应头
        * @access public
        * @param  array $header  参数
        * @return $this
        */
        header(header:array = []):this

        /**
        * 设置页面输出内容
        * @access public
        * @param  mixed $content
        * @return $this
        */
        content(content:any):this


        /**
        * 发送HTTP状态
        * @access public
        * @param  integer $code 状态码
        * @return $this
        */
        code(code:int):this


        /**
        * LastModified
        * @access public
        * @param  string $time
        * @return $this
        */
        lastModified(time:string):this
        /**
        * Expires
        * @access public
        * @param  string $time
        * @return $this
        */
        expires(time:string):this

        /**
        * ETag
        * @access public
        * @param  string $eTag
        * @return $this
        */
        eTag(eTag:string):this

        /**
        * 页面缓存控制
        * @access public
        * @param  string $cache 状态码
        * @return $this
        */
        cacheControl(cache:string):this

        /**
        * 页面输出类型
        * @access public
        * @param  string $contentType 输出类型
        * @param  string $charset     输出编码
        * @return $this
        */
        contentType(contentType:string, charset:string='utf-8'):this

        /**
        * 获取头部信息
        * @access public
        * @param  string $name 头部名称
        * @return mixed
        */
        getHeader(name?:string)

        /**
        * 获取原始数据
        * @access public
        * @return mixed
        */
        getData()


        /**
        * 获取输出数据
        * @access public
        * @return string
        */
        getContent(): string


        /**
        * 获取状态码
        * @access public
        * @return integer
        */
        getCode(): int

    }

    declare class Container{

        /**
        * 容器对象实例
        * @var Container|Closure
        */
        static const instance:Container;

        /**
        * 容器中的对象实例
        * @var array
        */
        protected var instances = [];

        /**
        * 容器绑定标识
        * @var array
        */
        protected var bind = [];

        /**
        * 容器回调
        * @var array
        */
        protected var invokeCallback = [];

        /**
        * 获取当前容器的实例（单例）
        * @access public
        * @return static
        */
        getInstance():any;

        /**
        * 设置当前容器的实例
        * @access public
        * @param object|Closure $instance
        * @return void
        */
        setInstance( instance ): void


        /**
        * 注册一个容器对象回调
        *
        * @param string|Closure $abstract
        * @param Closure|null   $callback
        * @return void
        */
        resolving(name:string, callback?:()=>any ): void

        /**
        * 获取容器中的对象实例 不存在则创建
        * @access public
        * @param string     $abstract    类名或者标识
        * @param array|true $vars        变量
        * @param bool       $newInstance 是否每次创建新的实例
        * @return object
        */
        pull(name:string, vars:array = [], newInstance:boolean = false):object


        /**
        * 获取容器中的对象实例
        * @access public
        * @param string $abstract 类名或者标识
        * @return object
        */
        get(name:string):object

        /**
        * 绑定一个类、闭包、实例、接口实现到容器
        * @access public
        * @param string|array $abstract 类标识、接口
        * @param mixed        $concrete 要绑定的类、闭包或者实例
        * @return $this
        */
        bind(name:string, concrete = null):this


        /**
        * 根据别名获取真实类名
        * @param  string $abstract
        * @return string
        */
        getAlias(name:string): string


        /**
        * 绑定一个类实例到容器
        * @access public
        * @param string $abstract 类名或者标识
        * @param object $instance 类的实例
        * @return $this
        */
        instance(name:string, instance:object):this

        /**
        * 判断容器中是否存在类及标识
        * @access public
        * @param string $abstract 类名或者标识
        * @return bool
        */
        bound(name:string): boolean


        /**
        * 判断容器中是否存在类及标识
        * @access public
        * @param string $name 类名或者标识
        * @return bool
        */
        has(name:string): boolean


        /**
        * 判断容器中是否存在对象实例
        * @access public
        * @param string $abstract 类名或者标识
        * @return bool
        */
        exists(name:string): boolean


        /**
        * 创建类的实例 已经存在则直接获取
        * @access public
        * @param string $abstract    类名或者标识
        * @param array  $vars        变量
        * @param bool   $newInstance 是否每次创建新的实例
        * @return mixed
        */
        make(name:string, vars:array = [], newInstance:boolean = false):any


        /**
        * 删除容器中的对象实例
        * @access public
        * @param string $name 类名或者标识
        * @return void
        */
        delete(name:string):void

        /**
        * 执行函数或者闭包方法 支持参数调用
        * @access public
        * @param string|Closure $function 函数或者闭包
        * @param array          $vars     参数
        * @return mixed
        */
        invokeFunction(callback:()=>any,  vars:array= []):any


        /**
        * 调用反射执行类的方法 支持参数绑定
        * @access public
        * @param mixed $method     方法
        * @param array $vars       参数
        * @param bool  $accessible 设置是否可访问
        * @return mixed
        */
        invokeMethod(method,  vars:array = [], accessible:boolean = false):any


        /**
        * 调用反射执行类的方法 支持参数绑定
        * @access public
        * @param object $instance 对象实例
        * @param mixed  $reflect  反射类
        * @param array  $vars     参数
        * @return mixed
        */
        invokeReflectMethod(instance, reflect,vars:array=[]):any


        /**
        * 调用反射执行callable 支持参数绑定
        * @access public
        * @param mixed $callable
        * @param array $vars       参数
        * @param bool  $accessible 设置是否可访问
        * @return mixed
        */
        invoke($callable,  vars:array = [], accessible:boolean = false):any


        /**
        * 调用反射执行类的实例化 支持依赖注入
        * @access public
        * @param string $class 类名
        * @param array  $vars  参数
        * @return mixed
        */
        invokeClass( className:string, vars:array):any


        /**
        * 执行invokeClass回调
        * @access protected
        * @param string $class  对象类名
        * @param object $object 容器对象实例
        * @return void
        */
        protected invokeAfter( className:string, object:object): void


        /**
        * 绑定参数
        * @access protected
        * @param ReflectionFunctionAbstract $reflect 反射类
        * @param array                      $vars    参数
        * @return array
        */
        bindParams(reflect, vars:array = []): array


        /**
        * 创建工厂对象实例
        * @param string $name      工厂类名
        * @param string $namespace 默认命名空间
        * @param array  $args
        * @return mixed
        * @deprecated
        * @access public
        */
        factory( name:string,  namespace?:string, ...args):any


        /**
        * 获取对象类型的参数值
        * @access protected
        * @param string $className 类名
        * @param array  $vars      参数
        * @return mixed
        */
        getObjectParam(className:string, vars:array ):any
        __set($name, $value)

        __get($name)

        __isset($name): boolean

        __unset($name)

        offsetExists($key): boolean

        offsetGet($key)

        offsetSet($key, $value)

        offsetUnset($key)

        //Countable
        count(): int

        //IteratorAggregate
        getIterator(): any
   
    }

    declare class App extends Container{

        /**
        * 是否为调试模式
        * @access public
        * @return bool
        */
        isDebug():boolean;

        /**
        * 设置应用命名空间
        * @access public
        * @param string $namespace 应用命名空间
        * @return $this
        */
        setNamespace(namespace:string)

        /**
        * 获取应用类库命名空间
        * @access public
        * @return string
        */
        getNamespace(): string

        /**
        * 设置环境变量标识
        * @access public
        * @param string $name 环境标识
        * @return $this
        */
        setEnvName(name:string)


        /**
        * 获取框架版本
        * @access public
        * @return string
        */
        version(): string


        /**
        * 获取应用根目录
        * @access public
        * @return string
        */
        getRootPath(): string


        /**
        * 获取应用基础目录
        * @access public
        * @return string
        */
        getBasePath(): string


        /**
        * 获取当前应用目录
        * @access public
        * @return string
        */
        getAppPath(): string


        /**
        * 设置应用目录
        * @param string $path 应用目录
        */
        setAppPath(path:string)


        /**
        * 获取应用运行时目录
        * @access public
        * @return string
        */
        getRuntimePath(): string


        /**
        * 设置runtime目录
        * @param string $path 定义目录
        */
        setRuntimePath(path:string): void


        /**
        * 获取核心框架目录
        * @access public
        * @return string
        */
        getThinkPath(): string


        /**
        * 获取应用配置目录
        * @access public
        * @return string
        */
        getConfigPath(): string


        /**
        * 获取配置后缀
        * @access public
        * @return string
        */
        getConfigExt(): string


        /**
        * 获取应用开启时间
        * @access public
        * @return float
        */
        getBeginTime(): float


        /**
        * 获取应用初始内存占用
        * @access public
        * @return integer
        */
        getBeginMem(): int


        /**
        * 加载环境变量定义
        * @access public
        * @param string $envName 环境标识
        * @return void
        */
        loadEnv(envName?:string): void

        /**
        * 初始化应用
        * @access public
        * @return $this
        */
        initialize():this
    }
}

package app{

    declare class BaseController{

        /**
        * Request实例
        * @var \think\Request
        */
        protected const request: think.Request

        /**
        * 应用实例
        * @var \think\App
        */
        protected const app: think.App;

        /**
        * 是否批量验证
        * @var bool
        */
        protected batchValidate = false;

        /**
        * 控制器中间件
        * @var array
        */
        protected middleware = [];

        public constructor(app:think.App)

        protected initialize();

        /**
        * 验证数据
        * @access protected
        * @param  array        $data     数据
        * @param  string|array $validate 验证器名或者验证规则数组
        * @param  array        $message  提示信息
        * @param  bool         $batch    是否批量验证
        * @return array|string|true
        * @throws ValidateException
        */
        protected validate(data:array, validate:array | string, message:array = [], batch:boolean = false)

    }

}
