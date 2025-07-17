package com
{
    import Exception
    public class Person
    {
        constructor(){
            let err = new Exception('error')
            new Error('error')
            new ReferenceError('reference error')
        }

        get name(){
            return 'person';
        }
    }
  
    
}
