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

        this.assertEquals(4, items.length , "error");
       
        this.assertEquals(items, this.list, "error");

        this.items.push( 5,6,7  );

        this.assertEquals(3,  this.items.length, "error");
         
         var bb = [];
         this.addArray( bb, 9);

         this.assertEquals(1, bb.length, "error");

         this.addArray([], 6)

         var bs = this.ccArray();
         bs.push( 6 );
        this.assertEquals(bs, this.arrItems, "error");

        bs = []

        this.pushArray(bs, 9)
        this.pushArray(bs, 1)
         this.assertEquals(bs, [9,1], "error");

    }

    addArray( a:string[], b){

        //a = [];
        
        a.push(b);
       
    }

    private const arrItems =[];

    ccArray(){
        var b =  this.arrItems;
        return b;
    }

    pushArray(a, b){
        a.push( b );
    }

}
