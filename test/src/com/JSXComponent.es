package com;

import PHPUnit.Framework.TestCase;

import com.JSXNode;

public class JSXComponent extends TestCase {

      createNode(name:string, attr, children):JSXNode{
            return new JSXNode(name, attr, children);
      }

      renderToString(node:JSXNode):string{
            const type = node.type;
            const attrs = node.attr;
            let props = [];
            if( attrs ){
                  const create=( attrs , delimiter='=')=>{
                        const props = [];
                        for( var key in attrs ){
                              let value = attrs[key];
                              if( typeof value ==="object" ){
                                  value = create( value, ':' ).join('')
                              }
                              if( delimiter ==='=' ){
                                    props.push(`${key}="${String(value)}"`);
                              }else{
                                  props.push(`${key}:${String(value)}`);  
                              }
                        }
                        return props;
                  };
                  props = create( attrs );
            }
            const children = node.children.map( child=>{
                   const type = typeof child;
                  if( type ==='number' || type ==="string" ){
                        return child;
                  }else{
                        return this.renderToString(child as JSXNode);
                  }
            });

            if( props.length > 0 ){
                   return `<${type} ${props.join(' ')}>${children.join('')}</${type}>`;
            }
            return `<${type}>${children.join('')}</${type}>`;
      }

      slot(name:string, scope:boolean , args:object ){
            return null;
      }

      render( c:Function ){
            return <div>root</div>;
      }

}