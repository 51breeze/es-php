package;

import PHPUnit.Framework.TestCase;

public class Start extends TestCase
{
    private var items = [];
    private var list  = [];
    testArray(){

        var items = this.items; 
        // var flag  = true;
        // if( flag ){
        //     items = this.list;
        // }

        items.push(1);
        items.push(2,3,4);

        this.assertEquals(4, items.length , "error");
       
        this.assertEquals(items, this.items, "error");



    }

}

    

