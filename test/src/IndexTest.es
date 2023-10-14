/**
* Test a test package
*/

package;

import com.TestInterface;
import Person;
import Types;
import StartTest;
import Iterator;
import unit.Param;


/**
* Test a class
*/
public class IndexTest<U,B=string> extends Person<string> implements Iterator<any> {

    /**
    *  返回一个类的引用
    */
    static getClass(){
        var a = IndexTest as class<IndexTest<any>>;
        var buname = {a:1, test:a}
        buname.person = Person;
        var {test, person} = buname;
        test.getClassObject();
        return buname
    }

    static getClassObject():class<IndexTest<any>>{
        var a = IndexTest;
        var b = {
            test:a
        }
        b.person = Person;
        return b.test;
    }

    static getObject(){
        String('sss')
        return new IndexTest()
    }

    /**
    * @public
    * the is static getter
    */
    static get uuName():string{
        
        return 'uuName';
    }

    /**
    * @private
    * the is class type.
    */
    private static var iiu:class<IndexTest<any>> = IndexTest;

    /**
    * @private
    * Automatic inference string type
    */
    private var bbss = 'bbss';

    /**
    *  property const age
    */
    private const age:int=40;
    
    /**
    * a constructor method
    */
    constructor(){
        super();
        // super.setType('1');
        // this.target;
        // new Start();
    }

    testBase(){

        this.assertEquals("uuName",IndexTest.getClassObject().uuName );
        this.assertEquals(40,this.age );
        this.assertTrue(this instanceof Person);
        this.assertTrue(this is Person);
        this.assertTrue(this instanceof TestInterface);
        this.assertTrue(this is TestInterface);
        this.assertEquals(IndexTest, IndexTest.getClass().test);
        this.assertEquals(Person, IndexTest.getClass().person);

        const o = new (IndexTest.getClass().person)();
        this.assertTrue( o instanceof Person );
        this.assertEquals('bbss', this.bbss);

        this.bbss = "666666";
        this.assertEquals('666666', this.bbss);
       // this.assertEquals( 'Test', this.personName );
        this.personName = "test name";
        this.assertEquals( 'test name', this.personName );

        const std = new stdClass();
        std.name = 'stdClass';
        this.assertTrue( std instanceof stdClass );
        this.assertEquals( 'stdClass', std.name );

        var bsp = (flag?:any )=>{
            return this;
        };
        this.assertEquals( this, bsp(1) );

        var obj = {};
        bsp = ( flag?:any ):any=>{
            if( flag ){
                return obj;
            }else{
                return this;
            }
        };
    
        var obds = 1;
        const three = bsp( false );
        var once={
            two:{
                three,
                four:bsp
            }
        };
        this.assertEquals( this, once.two.three );
        this.assertEquals( obj, once.two.four(true) );


        this.assertEquals( '/aa9663/bb', "\\\\aa9663\\\\bb".replace(/\\\\/g,'/') );
        this.assertEquals( '\\\/aa9663\\\/bb1\'', `\\\/aa9663\\\/bb${obds}'` );

           
        this.assertTrue( /\d+/.test( "123" ) );
        this.assertFalse( /^\d+/.test( " 123" ) );
        this.assertTrue( !!/^\d+/.exec( "123" ) );
        this.assertEquals( [1,"s","test"], this.restFun(1,"s","test"));

         const strR = "\\aa\\bb";
         this.assertEquals( '/aa/bb', strR.replace(/\\/g,'/') );

         const reps = strR.replace(/\\/g, (a)=>{
            return `=${a.replace('\\','/')}=`;
         });

         this.assertEquals( '=/=aa=/=bb', reps );

        var param = new Param();
        param.start();
       
    }

   
    // private testEnumerableProperty(){
        
    //     var labels:string[] = ["name","data","target","addressName","iuuu"];
    //     for( var key in this){
    //         this.assertEquals(key, labels[ labels.indexOf( key ) ]);
    //         this.assertEquals(this[key], this[ key ]);
    //     }
        
    // }

    testComputeProperty(){
        var bname = "123";
        var o = {
            [bname]:1,
            "sssss":2,
            uuu:{
                [bname]:3
            }
        };
        this.assertEquals( 1, o[bname] );
        this.assertEquals( 3, o.uuu[bname] );
        this.assertEquals( 3, o.uuu["123"] );
        o["uuu"][bname] = true;
        this.assertTrue( o["uuu"][bname] );
    }

    testLabel(){
        var num = 0;
        start:for(var i=0;i<5;i++){
                for (var j = 0;j<5;j++){
                    if(i == 3 && j == 3){
                        break start;
                    }
                    num++;
                }
        };
        this.assertEquals( 18, num );
    }

    testEnum(){
        enum Type {
            address=5,
            name
        };

        const s:class<Types> = Types;
        const t:Type  = Type.address;
        const b:Types = Types.ADDRESS;

        this.assertEquals(5, t );
        this.assertEquals(6, Type.name );
        this.assertEquals( 0,b );
        this.assertEquals( 1,Types.NAME );
        
    }

    testIterator(){
        var array = [];
        for( var val of this){
            array.push( val );
        }
        this.assertEquals( 5, array.length);
        this.assertEquals( [0,1,2,3,4], array);
        for(var i=0; i<5 ;i++){
            this.assertEquals( i, array[i]);
        }

        for( let b of this){
            array.push( b );
        }
        this.assertEquals( [0,1,2,3,4, 0,1,2,3,4], array );

        var o:any = this;
        var array1 = [];
        for( let c of o){
            array1.push( c );
        }
        this.assertEquals( [0,1,2,3,4], array1);


        var o1 = [1,2,3];
        var array2 = [];
        for( let d of o1){
            array2.push( d );
        }
        this.assertEquals( o1, array2);

        var o3:any = {length:3,0:1,1:2,2:3};
        var array3 = [];
        for( let e of o3){
            array3.push( e );
        }
        this.assertEquals( [1,2,3], array3);

        var o5 = (array)o3;
        var ot = [1,2,3];
        ot["length"] = 3;
        this.assertEquals( ot, o5);

        var o4 = 'abcdefg';
        var array4 = [];
        for( let f of o4){
            array4.push( f );
        }
        this.assertEquals( o4, array4.join("") );

    }

    testFor(){

        let o = {name:'testFor',age:30,1:100};
        let t = {};
        for(var name in o){
            t[name] = o[name];
        }
        this.assertEquals( o, t);

        var s = 'abcd';
        var items =[];
        for(var n in s){
            items.push( s[n] );
        }
        this.assertEquals(['a','b','c','d'], items);

    }

    testGenerics(){

        const ddee = this.map();
        const dd = ddee;
        var ccc = ddee.name({name:1,age:1},"123");
        var cccww = dd.name({name:1,age:30},666);

        var types = '333';
        var bds={
            name:123,
            [types]:1
        };

        this.assertEquals(123,  bds.name );
        this.assertEquals(1,  bds[ types ] );

        bds[ types ] = 99;
        this.assertEquals('string',  typeof this.avg("test") )
        this.assertEquals("1.00",  ccc.name.toFixed(2) )
        this.assertEquals(30,  cccww.age );
        this.assertEquals(99,  bds[ types ] );

        let obj = this.getTestObject(true)
        var bd:IndexTest<int,string> = obj;
        var bs = obj.getNamess(1);
        this.assertEquals("1.00",  bs.toFixed(2) );

        var bsint = this.getTestGenerics('sssss');
        var bsstring = this.getTestGenerics<string, string>("ssss", 'age');
        var bdss:string | int = bsstring;
        this.assertEquals( 'age', bsstring )

        obj = this.getTestObject(true)
        var sss:(int|string)[] = obj.getClassTestGenerics(1, 1)
        this.assertEquals( [1,1], sss )

    }


     private getClassTestGenerics<T1>( name:T1, age?:U ):(U | T1)[]{
             var a = [age, name];
            return a;
    }

    private getTestGenerics<T,B2 extends string>( name:T, age?:B2 ):B2{
             var t =  new IndexTest();
            return age;
    }

    private getTestObject( flag?:boolean ){
        const factor=()=>{
            const o = {};
            o.test = new IndexTest();
            o.name = "test";
            return o.test;
        };
        var o = factor();
        return o;
    }

    public getNamess(s:U):U{
        return s;
    }

    testAwait(){
         
         (()=>{
            const res = this.loadRemoteData(1);
            res.then((data)=>{
                this.assertEquals(['one',1], data[0]);
                this.assertEquals({ bss: [ 'two', 2 ], cc: [ 'three', 3 ] }, data[1]);
                this.assertEquals(['three', 3 ], data[1]);
            });
        })();

        (()=>{
            const res = this.loadRemoteData(2)
            res.then((data)=>{
                this.assertEquals([ '0', 0 ], data[0] );
                this.assertEquals([ '1', 1 ], data[1] );
                this.assertEquals([ '2', 2 ], data[2] );
                this.assertEquals([ '3', 3 ], data[3] );
                this.assertEquals([ '4', 4 ], data[4] );
            });
        })()

       
        const res = this.loadRemoteData(3);
        res.then((data)=>{
            this.assertEquals([ 'four', 4 ], data);
        });
        

        (()=>{
            const res = this.loadRemoteData(4);
            res.then((data)=>{
                this.assertEquals([ [ 'five', 5 ], [ '0', 0 ], [ '1', 1 ], [ '2', 2 ], [ '3', 3 ], [ '4', 4 ] ], data )
            });
        })()

        this.assertEquals(123,this.getJson().name);

    }

    getJson(){
       return {
           name:123
       }
    }

    testTuple(){
        const data = this.method("end",9);
        this.assertEquals([
            [ 'a', 'b' ],
            [ 1 ],
            [ 1, 1, 'one' ],
            [ 'one', [ 'one', 1 ], 'three', 'four', [ 'end', 9 ] ]
        ],data);
    }

    

    private const len:int = 5;
    private var currentIndex:int = 0;
    public next(){
        if( !(this.currentIndex < this.len) ){
            return {value:null,done:true}
        }
        const d = {
            value:this.currentIndex++,
            done:false
        };
        return d;
    }

    public rewind(){
        this.currentIndex = 0;
    }


    public restFun(...types:[int,...string]){
        return types;
    }

    tetObject(){
        var t = new IndexTest();
        var b = t;
        var ii={
            bb:b
        };
        return ii.bb;
    }

    get iuuu(){
        var ii:any = this.personName;
        if( 6 ){
            ii =[]
        }
        ii = true;
        return ii;
    }

    get data(){
        var b:any = [];

        if( 4 ){
            b = this.avg;
        }
        
        b = this.avg

        const dd = ()=>{
            var bs = new Promise((resolve,reject)=>{
                setTimeout(()=>{
                    resolve([])
                },100)
            });
            return bs;
        }
        return b;
    }

    fetchApi(name:string, data:int, delay:int){
        return new Promise<[string , int]>((resolve,reject)=>{
            setTimeout(()=>{
                resolve([name,data]);
            },delay);
        });

    }

    public async loadRemoteData2(){
          return await this.fetchApi("one", 1, 800)
    }

    public async loadRemoteData( type ):Promise<[string,int]>{

        if( type === 1 ){
            var a = await this.fetchApi("one", 1, 800);
            var bs = {
                bss: await this.fetchApi("two", 2, 500),
            }
            var c = await this.fetchApi("three", 3, 900);
            bs.cc = c;
            return a;
        }else{

            var list = [];
            switch( type ){
                case 3 :
                   const b = await this.fetchApi("four", 4, 300);
                   return b;
                case 4 :   
                   const bb = await this.fetchApi("five", 5, 1200);
                   list.push( bb );
            }

            for( var i=0;i<5;i++ ){
                list.push( await this.fetchApi(i+'',i,100) );
            }
            list.entries()
            return list as [string,int];
        }
    }

    @override
    public method( name:string, age:int):any
    {
        super.method(name, age );
        var str:string[] = ["a","b"];
        var b:[string, [string,int] ] = ["one", ["one",1] ];
        var cc:[number] = [1];
        var x:[number,int,string] = [1,1,'one'];
        b.push( 'three' )
        b.push( 'four' )
        b.push( [name,age] )
        return [str, cc, x, b];
    }

    @override
    public get personName():string{
        return super.personName;
    }

    @override
    public set personName( value:string ){
        super.personName = value;
    }

    @override
    avg<T extends string, B>(yy:T):T{

        var ii = ()=>1;
        var bb:[string] = ['1'];

        function name<T extends TestInterface>( i:T ):T{
            var b:T = i;
            i.avg(1);
            i.method('',1);
            return b;
        }

        const person = new Person<number>();

         name<TestInterface>( person ); 
         const bbb:TestInterface = name( person ); 

         name<Person<any>>( person ); 

        var dd:[int, uint, ...string ] = [1,1,"2222","66666","8888"];

        //bb.push()

        //T[]   (int | string)[]

        dd.push(1)

        return yy;

    }

    map(){
        const ddss={
            name<T extends {name:int,age:int},B>(c:T, b:B ){
                var id:B = b;
                return c;
            }
        }
        return ddss;
    }

    testArray():int[]{
        const dd:int[] = [];
        const bb = {global:1,private:1,items:[]};
        dd.push( 1 );

        this.assertEquals([1], dd.filter((value,key,array)=>{
               return true;
        }, this) )

        this.assertEquals([], dd.filter((value,key,array)=>{
               return false;
        }, this) )

        const tt = ["==="]; 
        tt['index'] = 0;
        tt['input'] = '============';
        this.assertEquals(tt, "============".match('===') )


        var bds = new Array( bb.global );
        this.assertEquals([null], bds );
        this.assertEquals(bb.global, bds.length );

        this.assertEquals([1], Array.from(dd) );

        var items = bb.items;
        if( bb.global === 1 ){
            items = dd;
        }

        items.push(0);
        var bsdd = items;
        items.push(1,9,6) 
        this.assertEquals([1,0,1,9,6], items );
        this.assertEquals(items=[], items );

        items.push(9999)
        this.assertEquals([9999], items );
        this.assertEquals(9999, items.pop() );
        items.splice(0,0,1,2,3)
        this.assertEquals([1,2,3], items );
        this.assertEquals([1,2], items.splice(0,2,9) );
        this.assertEquals([9,3], items);
        this.assertEquals(9, items.shift());
        items.unshift(0,5,6)
        this.assertEquals([0,5,6,3], items);

        var bs:any[] = [];
        bs = this.items;
        bs = dd;

        this.assertEquals('object',typeof  dd);
        this.getArrItems().push( 999 );
        this.assertEquals([999], this.items );
        this.assertEquals([], this.getArrItems() );

        var da = this.getArrItems();
        da.push(9999666);
        this.assertEquals([9999666], this.itemsB );

        da = ["hhhhhhhhhh"];
        this.assertEquals([9999666], this.itemsB );

        var bdsu = da;
        this.assertEquals("hhhhhhhhhh", da.pop() );
        this.assertEquals([], da);
        this.assertEquals([9999666], this.itemsB );

        var ui =  "==".concat( 'da' ,  'bs' ) + "=========";
        this.assertEquals("==dabs=========", ui );

        var d3 = false;
        var d4 = [
           ui && da
        ];
        var d41 = {
            name:d3 || bdsu
        }
        d4[0].push(1);
        this.assertEquals(da, d4[0]);

        d41.name.push(2);
        this.assertEquals(d41.name, bdsu);

        var d42 = false;
        var d43 = 'name';
        switch( d4 ){
            case ui && d4 :
               d42 = true;
            break;
               
        }
        this.assertTrue(d42);

        var d5 = false;
        var d6 = [];
        var d7 = [];

        (d5 || d6).push( 1 );
        this.assertEquals([1], d6);

        d5 = true;
        (d5 && d7).push( 1 );
        this.assertEquals([1], d7);

        (d6 && d7).push( 2 );
        this.assertEquals([1,2], d7);

        (d7 && d7).push( 3 );
        this.assertEquals([1,2, 3], d7);

        const call = (arr:array)=>{
            arr.push(9);
            return arr;
        };

        this.assertEquals([1,9],call( d6 && d6 ));
        this.assertEquals([1,2, 3, 9],call( d7 || d6 ));

        var d8 = [];
        const condition = ( flag )=>{
            if( flag ){
                d8 = [1,2,3];
            }else {
                d8= this.conditionItems;
            }
            return d8;
        }

        condition(true).push(1);
        this.assertEquals( [1,2,3,1], d8);

        condition(false).push(2);
        this.assertEquals( [4,5,6,2], d8);

        condition(true).push(1);
        this.assertEquals( [1,2,3,1], d8);

        condition(false).push(3);
        this.assertEquals( [4,5,6,2,3], d8);

        var d9 = [];
        var d10 = [];
        var d11 = [];
        for(let dk of d8){
            const target = dk % 2 === 0 ? d9 : d10;
            target.push( dk );
            const old =  dk % 2 === 0;
            const t=old && d11;
            if(t)t.push( dk );
        }
        this.assertEquals([4,6,2], d9);
        this.assertEquals([5,3], d10);
        this.assertEquals([4,6,2], d11);

        d8 = [];
        this.assertEquals([], d8);

        var n = 8 + 6;
        this.assertEquals(14, n );

        const list:RMD<array>[] = [];
        const map:ArrayMappingType<RMD<array>> = {};
        for(let item988 of list){

            map[ item988['id'] as string ] = item988;

            if(  item988['id'] && map[ item988['id'] ] ){

            }

            const p = map[ item988['id'] ] as {children:[]};
            p.children = [];

           // map[ item988['id'] ].id = 555;
        }

        var bssdd:RMD<any>[] = [];
        const mapss:ArrayMappingType<RMD<any>> = {};
        for(let item988 of bssdd){
            mapss[ '1' ] = item988;
            item988 = [];
        }

       
        type T998 =  {id:number,name:string}
        const list999:T998[] = [{id:1,name:'one'},{id:2,name:'two'}, {id:1,name:'three'}];
        const group:{[key:string]:T998[]} = {};
        list999.forEach( (item:T998)=>{
            const target = group[item.id] as RMD<T998[]>;
            if( target ){
                target.push( item );
            }else{
                group[item.id] = [item];
            }
        });

        this.assertEquals( [{id:1,name:"one"},{id:1,name:"three"}],  group[1]);
        this.assertEquals( [{id:2,name:"two"}],  group[2]);

        const group2:{[key:number]:T998[]} = {};
        list999.forEach( item=>{
            const target = group2[item.id];
            if( target ){
                target.push( item );
            }else{
                group2[item.id] = [item];
            }
        });

        this.assertEquals( [{id:1,name:"one"},{id:1,name:"three"}],  group2[1]);
        this.assertEquals( [{id:2,name:"two"}],  group2[2]);

        return dd;
    }

    private conditionItems = [4,5,6];


    private getArrItems(){
        var b =  this.items;
        if( b.length > 0 ){
            b = this.itemsB;
        }
        return b;
    }

    private getArr(){
        return this.items;
    }

     private var items = [];
     private var itemsB = [];

     tWhen(){
        when( Env(NODE_ENV, development) ){
            return 1;
        }
        return 2;
     }


    handle(request:string){
        const path = request.toLowerCase();
        if( !(path == 'login' || path=='logout' || path=='forgot/reset' || path == 'account/create' || path==="account/send/code" || path==="verify/code") ){
           return true;
        }
        if( path ){
            this.tWhen() || 'login'
        }
        return path || 'login';
    }
    

}





