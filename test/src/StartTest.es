package;

import Types;

import config,{top} from 'config';
import {home} from 'lang/zh-cn.es';

import gl from 'g.config.es';

import table.Address;

import Assets;

//import asset.Manifest;

//@Embed(Imgs='./Person.es');

public class StartTest extends Base implements Address
{
    private var items = [];
    private var list  = [];
    private var addData:Address;

    @Embed('./Person.es');
    static imsgs:string

    @Main
    public static main(){
       const d = Person;
    }

    constructor(){
        super();
        asset.Manifest.all()
    }

    /**
      * @group 列表
      * @label 列表
      * @auth false
      */
    testArray(){
        var items = this.items; 
        var flag  = true;
        if( flag ){
            items = this.list;
        }

        const [_aa,_bb] = items;

        items.push(1);
        items.push(2,3,4);

        this.assertEquals( config.env , 'prod' )
        this.assertEquals('dd', top(1,1) );

        this.assertEquals([1,6], gl);
        this.assertEquals([1,6], gl);
        this.assertEquals('dd', home.top('a', 'b'))

        this.assertEquals( time() , Math.floor( new Date().getTime() / 1000 ) )
        this.assertEquals( '2063c1608d6e0baf80249c42e2be5804' ,  md5('value') )
        //this.assertEquals( '2022-08-12 22:42:09' ,  date('YYYY-MM-DD HH:mm:ss', 1660315329 ) )

        this.assertEquals(4, items.length);
        this.assertEquals(items, this.list);
        this.items.push( 5,6,7  );
        this.assertEquals(3,  this.items.length);
         
        var bb = [];
        this.addArray( bb, 9);

        this.assertEquals(1, bb.length);

        this.addArray([], 6)

        var bs = this.ccArray();
        bs.push( 6 );

        this.assertEquals(bs, this.arrItems);

        bs = []
        this.pushArray(bs, 9)
        this.pushArray(bs, 1)
        this.assertEquals(bs, [9,1] );

        var newBs = bs.map<number>( (val,index)=>val );
        this.assertEquals(bs, newBs );

        newBs.push( 5, 12, 0, 3,3, 1 )
        var dd = newBs.sort();
        this.assertEquals([0,1,1,12,3,3,5,9], dd );
        this.assertEquals(dd, newBs);

        var af = [];
        af.push(1,6,0, 9,'a',"B","A");
        af.sort();
        this.assertEquals([0,1,6,9,'A','B','a'], af);
        this.assertEquals( [0,1,6,9], af.filter( value=>typeof value === 'number') );
        this.assertEquals( [0,1,6,9,"A","B",'a',10,11,12,13,'15',[16]], af.concat(10,[11,12], 13,'15', [ [16] ] ) );
        this.assertEquals("16ABa", af.reduce( (all,value)=>all+value ) );
        this.assertEquals("aBA9610", af.reduceRight( (all,value)=>all+value ) );
        var searchItem = 'B';
        this.assertEquals("B", af.find( val=> val===searchItem )  );
        this.assertEquals(6, af.find( val=> val > 5 )  );
        this.assertEquals(5, af.findIndex( val=> val==='B' )  );

        this.assertEquals([0, 1, 2, [3, 4] ], [0, 1, 2, [3, 4] ].flat(0) );
        this.assertEquals([0,1,2,3,4], [0, 1, 2, [3, 4] ].flat() );
        this.assertEquals([0,1,2,[3,4] ], [0, 1, 2, [[[3, 4]]] ].flat(2) );
        this.assertEquals([0,1,2,3,4 ], [0, 1, 2, [[[3, 4]]] ].flat(3) );

        this.assertEquals([0,1,2,3,4], [0, 1, 2, [3, 4] ].flatMap( val=> val ) );
        this.assertEquals([0,1,2,[[3,4]] ], [0, 1, 2, [[[3, 4]]] ].flatMap( val=> val ) );

        this.assertFalse( ['a','b',1].every( val=> typeof val ==='string' )  );
        this.assertTrue( [1,2,3].every( val=> typeof val ==='number' )  );
        this.assertTrue( [1,2,3,'a','b'].some( val=> typeof val ==='string' ) );

        this.assertTrue( [1,2,3,'a','b'].includes('a') ); 
        this.assertEquals( [0,1,2,3,4], [1,2,3,'a','b'].keys() ); 
        this.assertEquals( [1,2,3,'a','b'], [1,2,3,'a','b'].values() );

        this.assertEquals( [1,2,6,6,'ssss'], [1, 2, 3, 4,'ssss'].fill(6,2,4) );
        this.assertEquals( [2,1], [1, 2].reverse() );

        const months = ['Jan', 'March', 'April', 'June'];
        this.assertEquals([], months.splice(1, 0, 'Feb') );
        this.assertEquals(["Jan", "Feb", "March", "April", "June"], months);

        this.assertEquals(["Jan"], months.splice(0, 1, 'Feb') );
        this.assertEquals(["Feb", "Feb", "March", "April", "June"], months );
        this.assertEquals("Feb, Feb, March, April, June", months.toString() );
        this.assertEquals("Feb- Feb- March- April- June", months.join('- ') );

        this.assertEquals(["April", "June","March", "April", "June"], months.copyWithin(0,3,5) );
        this.assertEquals(["d", "b", "c", "d", "e"], ['a', 'b', 'c', 'd', 'e'].copyWithin(0,3,4) );

        this.assertTrue( months.hasOwnProperty(2) );
        this.assertTrue( months.propertyIsEnumerable(2) );
        this.assertFalse( Array.isArray('') );
        this.assertTrue( Array.isArray(['']) );

        var ip = [];
        [].splice.call.call.call(ip, 0, 0, 2, 3, 5 );

        this.assertEquals([2,3,5],  ip );
        ip.splice(1,1, 2,3,6,5);
        this.assertEquals([2,2,3,6,5,5], ip );

        if( ip ){
            ip = this.arrItems;
            ip.length = 0;
        }

        ip.splice(0, 1, 1);
        this.assertEquals([1], ip );

        const ds = [1,2,3];
        const _splice = [].splice.bind( ds );
        this.assertEquals([1,2], _splice(0,2) );
        this.assertEquals([3], ds );

        const testObj = {name:66};
        const testArr = [];
        const _splice2 = testArr.splice.bind( testObj );
        const _splice3 = testArr.splice.bind( testArr );
        const _push = [].push.bind( testObj );
        _splice3(0,1,3,6,9);
        var s = _splice2(0,1,3,6,9);
         _push("Jun");

        this.assertEquals([3,6,9], testArr );

        this.assertEquals([], s );
        
        this.assertEquals({0:3,1:6,2:9,3:"Jun",length:4,name:66}, testObj );
        s = _splice2(0,2);
        this.assertEquals({0:9,1:"Jun",length:2,name:66}, testObj );
        this.assertEquals([3,6],s);
        this.assertEquals(6, [].pop.call(s) );
        this.assertEquals(3, s.pop() );

        var array2 = this.array2;
        this.array2.push(1);
        this.assertTrue( array2 === this.array2 );
        this.assertEquals([1], array2);
        this.assertEquals([1], this.array2);
        this.assertEquals(1, this.array2.pop());
        this.assertEquals([],array2);

        var array3=[];
        this.assertTrue( !!array3 );

        if( array2 === this.array2 && array3 ){
            this.assertTrue( true );
        }else{
            this.assertTrue( false );
        }

        var array4 = array3 && array2;
        this.assertTrue(array4===array2);

        var array5 = array2 || array3;
        this.assertTrue(array5===array2);

        var array6 = array3 ? array3 : [];
        array6.push(1);
        this.assertEquals([1],array6);
        this.assertTrue( array6 === array3 );


        var array7 = this.array2 ? this.array2 : array2 ? array3 : [];
        array7.push(1);
        this.assertTrue( array7 === this.array2 );

        this.assertTrue( isNaN(NaN) )

        this.assertTrue( isNaN(Math.sqrt(-1)) )

         this.assertTrue( NaN !== NaN )

         let group:Record<any[]> = {}
         for(let i=0;i<5;i++){
            let dataset = group['1'] || (group['1']=[])
            dataset.push(i)

            let dataset2 = group['2']
            let dataset3 = group['3']
            let dataset4 = group['4']
            if(!dataset2){
                dataset2 = group['2'] = []
                group['3'] = []
                dataset3 = group['3']

                group['4'] = []
                let g4 = group['4']
                dataset4 = g4;
            }
            let dataset5 = dataset4
            let dataset6 = group['6'] = []
            dataset2.push(i)
            dataset3.push(i)
            dataset5.push(i)
            dataset6.push(i)
            this.assertEquals([i], group['6']);
         }
         this.assertEquals([0,1,2,3,4],group['1']);
         this.assertEquals([0,1,2,3,4],group['2']);
         this.assertEquals([0,1,2,3,4],group['3']);
         this.assertEquals([0,1,2,3,4],group['4']);
        this.assertTrue( isset(group['1']) )

    }

    testAssignment(){
        
        let init = 1;
        init += 1;
        assertEquals( 2 , init );

        init *= 2;
        assertEquals( 4, init );

        init /= 2;
        assertEquals( 2, init );

        init -= 1;
        assertEquals( 1 , init );

        init <<= 1;
        assertEquals( 2 , init );

        init >>= 1;
        init %= 1;
        assertEquals( 0 , init );

        init++
        assertEquals( 1 ,init );
        --init;
        assertEquals( 0, init );

        var data:any = {};
        data.init = 1;
        data.init += 1;
        assertEquals( 2,data.init );

        data.init *= 2;
        assertEquals( 4, data.init );

        data.init /= 2;
        assertEquals( 2 , data.init );

        data.init -= 1;
        assertEquals( 1, data.init );

        data.init <<= 1;
        assertEquals( 2 , data.init );

        data.init >>= 1;
        data.init %= 1;
        assertEquals( 0 , data.init );

        data.init++;
        assertEquals( 1 , data.init );

        var res = --data.init;
        assertEquals( 0 , res );
        assertEquals( 0 , data.init );

        this.increValue++;
        assertEquals( 1 , this.increValue );

        assertEquals( 2 , ++this.increValue );
        
        assertEquals( 2 , this.increValue );



        var tar:any = this;

        tar.increValue++;
        assertEquals( 3 , this.increValue );

        assertEquals( 4 ,  ++tar.increValue );

    }

    private var _increValue:number = 0;
    private set increValue( value ){
        this._increValue = value;
    }

    private get increValue(){
        return this._increValue;
    }


    private array2 = [];

    addArray( a:string[], b){
        a.push(b);
    }

    private const arrItems =[];
    ccArray(){
        var b =  this.arrItems;
        return b;
    }
    pushArray(a:[], b){
        a.push( b );
    }

    testString(){

        const str = 'aab'; 
        this.assertEquals(str.replace('a','A'), "Aab");
        this.assertEquals(str.indexOf('b'), 2 );
        this.assertEquals(str.charAt(0), 'a' );
        this.assertEquals(str.charCodeAt(0), 97 );
        this.assertEquals(str.charCodeAt(2), 98 );
        const obj = ['b'];
        obj['index'] = 2;
        obj['input'] = 'aab';
        this.assertEquals( str.match('b'), obj);
        this.assertEquals( obj['index'], 2);
        this.assertEquals( `${str}AAB`, str.concat('AAB') );
        this.assertEquals( 0, str.localeCompare('aab') );
        this.assertEquals( 1, str.localeCompare('aaa') );
        this.assertEquals( -1, str.localeCompare('aac') );
        this.assertEquals( 'AAB', str.toLocaleUpperCase() );
        this.assertEquals( 'aab', 'AAB'.toLocaleLowerCase() );
        this.assertEquals( 'AAB', 'AAB  '.trim() );
        this.assertEquals( ['A','A','B'], 'A.A.B'.split('.') );
        this.assertEquals( 'def', 'abcdefg'.slice(3,6) );

        const str2 = 'The quick brown fox jumps over the lazy dog.';
        this.assertEquals( 'the lazy dog.', str2.slice(31));
        this.assertEquals( 'quick brown fox', str2.slice(4, 19));
        this.assertEquals( 'dog.', str2.slice(-4));
        this.assertEquals( 'lazy', str2.slice(-9, -5));

        const chinese = '中中国人民解放军';
        this.assertEquals( 8, chinese.length);
        this.assertEquals( 3, chinese.indexOf("人") );
        this.assertEquals( 3, chinese.lastIndexOf("人") );
        this.assertEquals( `全${chinese}`, chinese.replace('中','全中') );

        function re(a,b){
            return top(a,b);
        }
        
        const mixed = "中国人A民bc解De放军FFFDDdd"
        this.assertEquals( 19, mixed.length);
        this.assertEquals( 12, mixed.indexOf("F") );
        this.assertEquals( 14, mixed.lastIndexOf("F") );
        this.assertEquals( `中国人A民bc解De放军FFFdddd`, mixed.replace('DD', re ) );
        this.assertEquals( `民bc解`, mixed.substr(4,4) );

        const paragraph = 'The quick brown fox jumps over the lazy dog. If the dog barked, was it really lazy?';
        const regex = /[^\w\s]/g;
        this.assertEquals(43, paragraph.search(regex) );
        this.assertEquals('.', paragraph[ paragraph.search(regex) ] );

        this.names = "Ye Jun";
        this.assertEquals('Ye Jun',  this.names  );

        names = '123';
        this.assertEquals('123',  names  );
        this.assertEquals(true,  mixed.startsWith('中国'));
        this.assertEquals(false,  mixed.startsWith('国人'));
        this.assertEquals(true,  mixed.startsWith('国人',1));
        this.assertEquals(false,  mixed.endsWith('中国'));
        this.assertEquals(true,  mixed.endsWith('人A民', 2));
        this.assertEquals(true,  mixed.endsWith('Ddd'));
       
    }

    testObject(){
          var name = "Jun Ye";
          var o = {name};
          this.assertEquals({name:"Jun Ye"},  o);
          this.assertEquals({name:"ssss",age:30},  Object.assign(o,{age:30,name:"ssss"}) );
          this.assertEquals(this, this["call"]()["getObject"]() );
          var fn = this.getObject;
          this.assertEquals(this, fn());  
    }

    getObject(name?:any):any{
        return this;
    }


    testNumber(){
        var num = 5.123456;
        this.assertEquals( 5, num.toPrecision(1) );

        num = 77.1234
        this.assertEquals(8e+1, num.toPrecision(1) );

        var nums = 999999;
        var bf = nums.toPrecision.bind( nums );
        this.assertEquals(999999, bf(6) );

        var df = 1.236999999 ;
        var bfs = nums.toExponential.bind( df );
        this.assertEquals(1.237000e+0, bfs(6) );
    }


    testEnum(){
        this.assertEquals(0, Types.ADDRESS );
        this.assertEquals(1, Types.NAME );
        this.assertEquals('名称', Types.labelOf(Types.NAME) );
        this.assertEquals('NAME', Types.keyOf(Types.NAME) );
        this.assertEquals(1, Types.valueOf(Types.NAME)?.value );

        enum Type {
            address=5,
            name
        };
        this.assertEquals(5, Type.address );
        this.assertEquals(6, Type.name );
        this.assertEquals('name', Type[6] );
        this.assertEquals(Types.ADDRESS, enum2(Types.ADDRESS) );
    }

    enum2(add:Types){
        return add;
    }

    testNewObject(){
        var date = new Date('2021/8/14 14:59:59');
        this.assertEquals(2021, date.getFullYear());
        this.assertEquals(7, date.getMonth());
        this.assertEquals(14, date.getDate());
        this.assertEquals(6, date.getDay());
        this.assertEquals(14, date.getHours());
        this.assertEquals(59, date.getMinutes());
        this.assertEquals(59, date.getSeconds());
        this.assertEquals(1628924399000,  date.getTime() );
        this.assertEquals("Sat Aug 14 2021 14:59:59 PRC+0800", date.toString() );
        this.assertEquals("123", new String('123456').substr(0,3) );
        this.assertEquals("123456", new String('123456').valueOf() );
        this.assertEquals(1000, new Number('1000').valueOf() );
        this.assertEquals(10.5020, new Number('10.5020').valueOf() );
        this.assertEquals(10.50, new Number('10.5020').toFixed(2) );
        this.assertEquals("1000", new Number(1000).toString() );
        this.assertEquals("false", new Boolean(false).toString() );
        this.assertEquals(true, new Boolean('true').valueOf() );

        const classFactory:class<Object> = Object;
        const obj = (new classFactory()) as ObjectProtector<Record>;
        this.assertEquals('[object Object]', obj);
        obj.name = 'test';
        this.assertEquals('test', obj.name);
        this.assertEquals('{"name":"test"}', JSON.stringify(obj));

        
        let person = new com.Person
        this.assertEquals('person', person.name);
    }

    testChian(){
        const obj = {
            index:1,
            test(){
                return true
            },
            child:{
                1:'own',
                name:'string',
                child:{
                    name:'zh'
                }
            }
        }

        
        assertEquals( void 0 , obj.child2?.name )
        assertEquals( void 0 , obj.test2?.() )

        obj.index2 ??= 'index two';
        assertEquals('index two', obj.index2 ?? null );

        assertEquals(null, obj.index3 ?? null );

        obj.index ??= 2;
        assertEquals(1, obj.index );

        assertEquals( 'zh' , obj.child?.child?.name );
        assertEquals( 'zh' , obj.child?.child?.name ?? 'null' );
        assertEquals( 'null' , obj.child?.chil?.name ?? 'null' );
        assertEquals( void 0 , obj.chil?.child?.name );
        assertEquals( false , obj.chil?.child?.name ?? false );

        let x = 0;
        assertEquals( void 0 , obj.chil?.[++x] )
        assertEquals( 0 , x )

        assertEquals('own', obj.child?.[++x] )
        assertEquals(1, x )

        assertEquals('own', obj.child?.[x++] )
        assertEquals(2, x )

        const obj2 = new stdClass();
        obj2.name = 123;
        assertEquals(123, obj2.name )

        obj2.child = {
            test:123,
            child:{
                age:30
            }
        }
        
        assertEquals(123, obj2.child.test )
        assertEquals(30, obj2.child?.child?.age )
        assertEquals(undefined, obj2.chil?.child?.age )

        if(obj2 is stdClass){
            assertEquals(123, obj2.name )
            assertEquals(123, obj2.child?.test )
            assertEquals(null, obj2.child?.name )
            assertEquals(30, obj2.child.child.age )
        }

        type Category1 = {
            title:string,
            pid:number
        }
        const map:ObjectProtector<Category1> = new stdClass();
        map.title = '123';
        assertEquals('123', map.title )

        const arr:Category1 = {};
        arr.title = '456'
        assertEquals('456', arr.title )

        const arr2:ArrayProtector<Category1> = {};
        arr2.title = '789'
        assertEquals('789', arr2.title )

    }

    call(){
        return this;
    }

    get names():string{
        return this._names;
    }

    private var _names:string = 'test';
    
    set names( val:string){
        this._names = val;
    }


    /**
    * the is getNames method
    */
    getNames(){

    }

    setNames(){

    }

}


class Test2 {
    ps(){

    }
}

new Test2();


var conig = [];


