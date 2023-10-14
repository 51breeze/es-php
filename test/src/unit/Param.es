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

    
        this.assertEquals([3,3,[1,2,3], [1,2,3]], args(1,2,3) );

        const val = '99';
        const res = this.rmd( val );
        this.assertEquals( 'rmd', val );
        this.assertEquals( 666, res );
        this.rmdValue = 999;
        this.assertEquals( 999, res );

        const itess:any = [1,2,36];
        const clone = [6, ...itess, 0];
        this.assertEquals( [6,1,2,36,0], clone );

        const obj = {name:'name'}
        const obj2 = {...obj, val};
        this.assertEquals( {...obj, val}, obj2 );

        const [sp1] = clone;
        this.assertEquals( 6, sp1 );

        const {name:name2} = obj;
        this.assertEquals( obj.name, name2 );

    }

    getList<T,B>({name1000,age=9}:{name1000:T, age:number},[index,id=20]:[T, number]){

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

    args(...args){
        return [arguments.length, arguments[2], arguments, args];
    }

    private rmdValue:RMD<number>=666;

    rmd(name:RMD<string>){
        name = 'rmd'
        var dd = this.rmdValue;
        return dd;
    }

    private items = [];
    private itemsW = [];

    callArr(item:array){

        if( item ){
            item = this.items;
        }else {
            item = this.itemsW;
        }
        return item;

    }
}