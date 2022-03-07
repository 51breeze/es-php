package unit;

import PHPUnit.Framework.TestCase;

public class Param extends TestCase{

    start(){

        enum en {
            name1000=6,
            age
        };

        enum t {
            name='A',
            A='c',
        }

        this.assertEquals( 7, en.age );
        this.assertEquals( 'A', t.name );

        var b:en = en.age;
        this.assertEquals(6,this.getList(en ,  [9,5]));
        this.ave(2.3660);
    }

    getList<T,B>({name1000:T,age:number=9},[index:T,id=20]){

        var args = [index, id];
        this.assertEquals(args, this.call( ...args ) );
        return name1000;
    }

    call(i,b){
       return [i,b];
    }

    ave<T>(age:T){

        return age;

    }
}