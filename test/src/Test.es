/**
* Test a test package
*/

package;

import com.TestInterface;
import Person;
import Types;
import Start;


/**
* Test a class
*/
public class Test<U,B=string> extends Person<string> {

    /**
    *  返回一个类的引用
    */
    static getClass(){
        var a = Test as class<Test>;
        var buname = {a:1}
        buname.test = a;
        buname.person = Person;
        var {test} = buname;
        test.getClassObject();
        return buname
    }

    static getClassObject():class<Test>{
        var a = Test;
        var b = {
            test:a
        }
        b.person = Person;
        return b.test;
    }

    static getObject(){
        return new Test()
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
    private static var iiu:class<Test> = Test;

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
       
        this.assertEquals("uuName",Test.getClassObject().uuName );
        this.assertEquals(40,this.age );
        this.assertTrue(this instanceof Person);
        this.assertTrue(this is Person);
        this.assertTrue(this instanceof TestInterface);
        this.assertTrue(this is TestInterface);
        this.assertEquals(Test, Test.getClass().test);
        this.assertEquals(Person, Test.getClass().person);

        const o = new (Test.getClass().person)();
        this.assertTrue( o instanceof Person );
        this.assertEquals('bbss', this.bbss);

        this.bbss = "666666";
        this.assertEquals('666666', this.bbss);
        //this.assertEquals( 'Test', this.personName );
        this.personName = "test name";
        this.assertEquals( 'test name', this.personName );


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
        //this.assertEquals( obj, once.two.four(true) );
           
        this.assertTrue( /\d+/.test( "123" ) );
        this.assertFalse( /^\d+/.test( " 123" ) );
        this.assertTrue( !!/^\d+/.exec( "123" ) );
        //this.assertEquals( [1,"s","test"], this.restFun(1,"s","test"));
        

       
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

    // testLabel(){
    //     var num = 0;
    //     var i=0;
    //     start:for(;i<5;i++){
    //             for (var j = 0;j<5;j++){
    //                 if(i == 3 && j == 3){
    //                     break start;
    //                 }
    //                 num++;
    //             }
    //     };

    //      console.log( 'testLabel start',  num );
        
    //     this.assertEquals( 18, num );
        
    // }

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

    // private testIterator(){
    //     var array = [];
    //     for( var val of this){
    //         array.push( val );
    //     }
    //     this.assertEquals( 5, array.length);
    //     for(var i=0; i<5 ;i++){
    //         this.assertEquals( i, array[i]);
    //     }
    // }

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
        var bd:Test<int,string> = obj;
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
             var t =  new Test();
            return age;
    }

    private getTestObject( flag?:boolean ){
        const factor=()=>{
            const o = {};
            o.test = new Test();
            o.name = "test";
            return o.test;
        };
        var o = factor();
        return o;
    }

    public getNamess(s:U):U{
        return s;
    }

    // private testAwait(){
         
    //      (()=>{
    //         const res = this.loadRemoteData(1);
    //         res.then((data)=>{
    //             this.assertEquals(['one',1], data[0]);
    //             this.assertEquals({ bss: [ 'two', 2 ], cc: [ 'three', 3 ] }, data[1]);
    //             this.assertEquals(['three', 3 ], data[2]);
    //         });
    //     })();

    //     (()=>{
    //         const res = this.loadRemoteData(2)
    //         res.then((data)=>{
    //             this.assertEquals([ '0', 0 ], data[0] );
    //             this.assertEquals([ '1', 1 ], data[1] );
    //             this.assertEquals([ '2', 2 ], data[2] );
    //             this.assertEquals([ '3', 3 ], data[3] );
    //             this.assertEquals([ '4', 4 ], data[4] );
    //         });
    //     })()

       
    //     const res = this.loadRemoteData(3);
    //     res.then((data)=>{
    //         this.assertEquals([ 'four', 4 ], data);
    //     });
        

    //     (()=>{
    //         const res = this.loadRemoteData(4);
    //         res.then((data)=>{
    //             this.assertEquals([ [ 'five', 5 ], [ '0', 0 ], [ '1', 1 ], [ '2', 2 ], [ '3', 3 ], [ '4', 4 ] ], data )
    //         });
    //     })()

    //     this.assertEquals(123,this.getJson().name);

    // }

    // getJson():any{
    //    return {
    //        name:123
    //    }
    // }

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

    

    public restFun(...types:[int,...string]){
        return types;
    }

    tetObject(){
        var t = new Test();
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

    // get data(){
    //     var b:any = [];

    //     if( 4 ){
    //         b = this.avg;
    //     }
        
    //     b = this.avg

    //     const dd = ()=>{
    //         var bs = new Promise((resolve,reject)=>{
    //             setTimeout(()=>{
    //                 resolve([])
    //             },100)
    //         });
    //         return bs;
    //     }
    //     return b;
    // }

    // fetchApi(name:string, data:int, delay:int){
    //     return new Promise<(string | int)[]>((resolve,reject)=>{
    //         setTimeout(()=>{
    //             resolve([name,data]);
    //         },delay);
    //     });
    // }

    // public async loadRemoteData2(){
    //       return await this.fetchApi("one", 1, 800)
    // }

    // public async loadRemoteData( type ):Promise<[string,int]>{

    //     if( type === 1 ){
    //         var a = await this.fetchApi("one", 1, 800);
    //         var bs = {
    //             bss: await this.fetchApi("two", 2, 500),
    //         }
    //         var c = await this.fetchApi("three", 3, 900);
    //         bs.cc = c;
    //         return [a,bs,c];
    //     }else{

    //         var list = [];
    //         switch( type ){
    //             case 3 :
    //                const b = await this.fetchApi("four", 4, 300);
    //                return b;
    //             case 4 :   
    //                const bb = await this.fetchApi("five", 5, 1200);
    //                list.push( bb );
    //         }

    //         for( var i=0;i<5;i++ ){
    //             list.push( await this.fetchApi(i+'',i,100) );
    //         }
    //         list.entries()
    //         return list;
    //     }
    // }

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


        //var bd:number = cc.pop();
        //var tt:(number | int | string)[] = x.splice(0,5);
        //str = tt;
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

         name<Person>( person ); 

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

    // private address():int[]{
    //     const dd:int[] = [];
    //     const bb = {global:1,private:1,items:[]};
    //     dd.push( 1 );
    //     console.log( dd.filter((value,key,array)=>{
    //            return true;
    //     }, this), "============".match('===') );

    //     var bds = new Array( bb.global );

    //     bds.length;
    //     Array.from(dd);

    //     var items = bb.items;


    //     if( bb.global === 1 ){
    //         items = dd;
    //     }

    //     items.push(0);

    //     var bsdd = items;


    //     console.log( items.push(1,9,6), items=[],  items.push(9999) );


    //     console.log( items.pop() )

    //     console.log( items.splice(0,5, '') );

    //     console.log( items.shift() );
    //     console.log( items.unshift(0,5, '') );

    //     var bs = null ;
    //     bs = this.items;
    //     bs = dd;
    //     //bs.push(99988);

    //     typeof  dd;

    //     this.getArrItems().push( 999 );

    //     var da = this.getArrItems();
    //     da.push(9999666);

    //     da = ["hhhhhhhhhh"];

    //     var bdsu = da;

    //     console.log( da );

    //     console.log( da.pop() );


    //      var ui =  "==".concat( 'da' ,  'bs' ) + "=========";
    //      var n = 8 + 6;

    //     console.log( ui, n  );

    //     return dd;
    // }


    // private getArrItems(){
    //     var b =  this.items;
    //     var c = [];
    //     if( b ){
    //         b = this.items;
    //     }
    //     b = [];
    //     return b;
    // }



    // private var items = [];
    

}





