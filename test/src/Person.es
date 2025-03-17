package;

import PHPUnit.Framework.TestCase;
import com.TestInterface as IT;


/**
* Person class
*/

public class Person<T> extends TestCase implements IT
{

    public var addressName:string = `the Person properyt "addressName"`;

    private var _name:string = '';

    /**
    * type t
    */
    private var _type:T = null;

    constructor(){
        super();
    }

    get target(){
        return this;
    }

    public setType(a:T):T{
        this._type = a;
        return a;
    }


    @Post('/method',  auth=true)
    public method( name:string, age:int):any
    {
        var str:string[] = ["a","1"];
        var b:[string, [string,int] ] = ["", ["1",1] ];

        var cc:[number] = [1];
        var x:[number,int,string,...object] = [1,1,'2222',[{}]];

        b.push( '1' )
        b.push( ['1',1] )

       var c:int = -1968;
       var bs:float = 22.366
       var bssd:number = -22.366
        this.target.address();
        this.personName;
        dirname(__DIR__)
        return "sssss";
    }


    public get personName():string{
        return this._name;
    }

    public set personName(val:string){
        this._name = val;
    }

    avg<T extends string,B>(a):void{

    }

    private address(){
        
    }

    protected addressNamesss(){

    }

    


}

    

