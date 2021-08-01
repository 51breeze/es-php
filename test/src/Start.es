package;

import PHPUnit.Framework.TestCase;

public class Start extends TestCase
{
    private var items = [];
    private var list  = [];
    testArray(){

        var items = this.items; 
        var flag  = true;
        if( flag ){
            items = this.list;
        }

        items.push(1);
        items.push(2,3,4);

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

    }

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

        const mixed = "中国人A民bc解De放军FFFDDdd"
        this.assertEquals( 19, mixed.length);
        this.assertEquals( 12, mixed.indexOf("F") );
        this.assertEquals( 14, mixed.lastIndexOf("F") );
        this.assertEquals( `中国人A民bc解De放军FFFdddd`, mixed.replace('DD','dd') );
        this.assertEquals( `民bc解`, mixed.substr(4,4) );

        const paragraph = 'The quick brown fox jumps over the lazy dog. If the dog barked, was it really lazy?';
        const regex = /[^\w\s]/g;
        this.assertEquals(43, paragraph.search(regex) );
        this.assertEquals('.', paragraph[ paragraph.search(regex) ] );

        this.names = "Ye Jun";
        this.assertEquals('Ye Jun',  this.names  );

    }


    get names():string{
        return this._names;
    }

    private var _names:string = 'test';
    
    set names( val:string){
        this._names = val;
    }

}


