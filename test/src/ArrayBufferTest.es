package ;
import Base;

class ArrayBufferTest extends Base{

     testArrayBuffer(){

          const buffer =  new ArrayBuffer(9);
          const view   = new DataView( buffer );
          view.setInt8(0,228);
          this.assertEquals(-28, view.getInt8(0));
          this.assertEquals(228, view.getUint8(0));

          view.setInt8(1,189);
          this.assertEquals(-67, view.getInt8(1));
          this.assertEquals(189, view.getUint8(1));

          view.setInt8(2,160);
          this.assertEquals(-96, view.getInt8(2));
          this.assertEquals(160, view.getUint8(2));

          view.setInt8(3,229);
          view.setInt8(4,165);
          view.setInt8(5,189);

          view.setInt8(6,229);
          view.setInt8(7,144);
          view.setInt8(8,151);

          const clone = buffer.slice(0);
          const cview   = new DataView( clone );
          this.assertEquals(-28, cview.getInt8(0) );
          this.assertEquals(228, cview.getUint8(0) );

          var f32 = new Float32Array(4);
          f32[0] = 0.1;
          f32[1] = 0.2;
          f32[2] = 0.3;
          f32[3] = 0.4;

          this.assertEquals(0.10000000149011612, f32[0]);
          this.assertEquals(0.20000000298023224, f32[1]);
          this.assertEquals(0.30000001192092896, f32[2]);
          this.assertEquals(0.4000000059604645, f32[3]);

          var i16 = new Int16Array(f32.buffer);
          this.assertEquals(-13107, i16[0]);
          this.assertEquals(15820, i16[1]);
          this.assertEquals(-13107, i16[2]);
          this.assertEquals(15948, i16[3]);
          this.assertEquals(-26214, i16[4]);
          this.assertEquals(16025, i16[5]);
          this.assertEquals(-13107, i16[6]);
          this.assertEquals(16076, i16[7]);

          var i162 = new Float32Array(i16.buffer);
          this.assertEquals(0.10000000149011612, i162[0]);
          this.assertEquals(0.20000000298023224, i162[1]);
          this.assertEquals(0.30000001192092896, i162[2]);
          this.assertEquals(0.4000000059604645, i162[3]);

          const uint8 = new Uint8Array([10, 20, 30, 40, 50]);
          this.assertEquals( [20,30], Array.from( uint8.subarray(1, 3).values() )  );
          this.assertEquals( [20, 30, 40, 50], Array.from( uint8.subarray(1).values() )  );

          const uint81 = new Uint8Array([ 1, 2, 3, 4, 5, 6, 7, 8 ]);
          this.assertEquals( [1, 2, 3, 2, 3, 6, 7, 8], Array.from( uint81.copyWithin(3, 1, 3).values() )  );
          this.assertEquals( [1, 2, 3, 6, 7, 8, 7, 8], Array.from( uint81.copyWithin(3, 5, 20).values() )  );

          this.assertEquals( [4, 4, 4], Array.from( (new Uint8Array([1, 2, 3])).fill(4).values() ) );
          this.assertEquals( [1, 4, 4], Array.from( (new Uint8Array([1, 2, 3])).fill(4,1).values() ) );
          this.assertEquals( [1, 4, 3], Array.from( (new Uint8Array([1, 2, 3])).fill(4,1,2).values() ) );

          function isBigEnough(element, index, array) {
               return element >= 10;
          }

          this.assertEquals( [ 12, 130, 44 ], Array.from( (new Uint8Array([12, 5, 8, 130, 44])).filter(isBigEnough).values() ) );

          var numbers = new Uint8Array([1, 4, 9]);
          var roots = numbers.map( Math.sqrt );
          this.assertEquals( [1, 2, 3], Array.from( roots.values() ) );

          var numbers2 = new Uint8Array([40, 1, 5, 200]);
          this.assertEquals( 246,  numbers2.reduce( (acc,value)=>acc+value ) );
          this.assertEquals( [200,5,1,40],  numbers2.reduceRight<array>( (acc,value)=>{
               acc.push(value);
               return acc;
          }, []) );

          this.assertTrue(numbers2.includes( 200 ) );
          this.assertFalse(numbers2.includes( 20 ) );
          this.assertEquals( '[80, 2, 10, 144]',  numbers2.map( item=>item * 2 ).toString() );

          numbers2.sort();
          this.assertEquals( '[1, 5, 40, 200]',  numbers2.toString() );

          this.assertTrue(numbers2.some( item=>item===5 ) );
          this.assertFalse(numbers2.some( item=>item===0 ) );
          this.assertTrue(numbers2.every( item=>item > 0 && item <= 200 ) );
          this.assertFalse(numbers2.every( item=>item > 0 && item < 200) );
          this.assertEquals( '[1, 5]',  numbers2.slice(1,3).toString() );
          this.assertEquals( '[200, 40, 5, 1]',  numbers2.reverse().toString() );
         

     }

     testMap(){

          var keyOne = [1];
          const map = new Map<any,number>([
               [keyOne,99]
          ]);
          map.set(this, 1);
          this.assertEquals(1, map.get(this));
          this.assertEquals(99, map.get(keyOne));
          this.assertEquals(2, map.size);
          this.assertTrue( map.has(this) );

          const result = [];
          map.forEach( (value,key)=>{
               if( key === keyOne ){
                    this.assertEquals(99, value);
                    result.push( value );
               }else if( key === this ){
                    this.assertEquals(1, value);
                    result.push( value );
               }
          });
          this.assertEquals([99,1], result);

          const result2 = [];
          for( const item of map.entries() ){
               const [key,value] = item;
                if( key === keyOne ){
                    this.assertEquals(99, value);
               }else if( key === this ){
                    this.assertEquals(1, value);
               }
               result2.push( value );
          }
          this.assertEquals([99,1], result2);


          this.assertEquals([99,1], Array.from( map.values() ) );
          this.assertEquals([keyOne,this], Array.from( map.keys() ) );

     }

      testSet(){

          const set = new Set([1,1,3,9,5,4,4,4,this,this]);
          this.assertTrue( set.has(1) );
          this.assertTrue( set.has(9) );
          this.assertTrue( set.has(this) );
          this.assertFalse( set.has(6) );
          this.assertEquals([1,3,9,5,4,this], Array.from( set.values() ) );

          set.add(11)
          set.add(12)
          set.add(12)
          this.assertEquals(8,set.size);

          const result2 = [];
          const result3 = [];
          for( const item of set.entries() ){
               const [key,value] = item;
               result2.push( key );
               result3.push( value );
          }

          this.assertEquals([1,3,9,5,4,this,11,12], result2);
          this.assertEquals([1,3,9,5,4,this,11,12], result3);

          set.delete(this)
          this.assertEquals([1,3,9,5,4,11,12], Array.from( set.values() ));
          set.clear();
          this.assertEquals(0,set.size);
         
      }

}