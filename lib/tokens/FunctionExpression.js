import Namespace from 'easescript/lib/core/Namespace';
import Utils from 'easescript/lib/core/Utils';
import {createAddressRefsNode} from '../core/Common';
import Node from '@easescript/transform/lib/core/Node';
function createInitNode(ctx, name, initValue, defaultValue, operator, forceType=null){
   let init = defaultValue ? ctx.createBinaryExpression(initValue, defaultValue, operator) : initValue
   if(forceType){
      let node = ctx.createNode('TypeTransformExpression')
      node.typeName = forceType;
      node.expression = ctx.createParenthesizedExpression(init)
      init = node;
   }
   return ctx.createExpressionStatement(
      ctx.createAssignmentExpression( 
         Node.is(name) ? name : ctx.createVarIdentifier(name),
         init
      )
   );
}

function createRefsMemberNode(ctx, object, property , computed=false){
   const node = ctx.createMemberExpression([
      ctx.createVarIdentifier(object),
      typeof property ==='number' ? ctx.createLiteral(property) : ctx.createIdentifier(property)
   ]);
   node.computed = computed;
   return node;
}

function createParamNode(ctx,name,prefix){
   const node = ctx.createNode('ParamDeclarator');
   node.argument =Node.is(name) ? name : ctx.createVarIdentifier(name);
   node.argument.isVariable = true;
   node.prefix = prefix;
   return node;
}

function createParamNodes(ctx, stack, params){
   const before = [];
   const items = params.map( (item,index)=>{
      if( item.isObjectPattern ){
         let sName = ctx.getLocalRefName(stack, '_s', item);
         before.push(
            createInitNode(
               ctx, 
               sName,  
               ctx.createVarIdentifier(sName),  
               ctx.createNewExpression(ctx.createIdentifier('\\stdClass')),
               '?:',
               'object'
            )
         );
         item.properties.forEach( property=>{
            let key = property.key.value();
            let alias = null;
            let defaultValue = null;
            if( property.hasInit ){
               if(property.init.isAssignmentPattern){
                  defaultValue = ctx.createToken(property.init.right);
               }else{
                  alias = ctx.createToken(property.init)
               }
            }else{
               defaultValue = ctx.createLiteral(null);
            }
            before.push(createInitNode(
               ctx, 
               alias||key,
               createRefsMemberNode(ctx, sName, key),
               defaultValue,
               '??'
            ));
         });
         return createParamNode(ctx, sName);
      }else if( item.isArrayPattern ){
         const sName = ctx.getLocalRefName(stack,'_s',item);
         before.push(createInitNode(
            ctx, 
            sName,  
            ctx.createVarIdentifier(sName),  
            ctx.createArrayExpression([]),
            '?:','array'
         ));
         item.elements.forEach( (property,index)=>{
            let key= null;
            let defaultValue = null;
            if( property.isAssignmentPattern ){
               key = property.left.value();
               defaultValue = ctx.createToken(property.right);
            }else{
               key = property.value();
               defaultValue = ctx.createLiteral(null)
            }
            before.push(createInitNode(
               ctx, 
               ctx.createVarIdentifier(key), 
               createRefsMemberNode(ctx,sName,index, true),
               defaultValue,
               '??',
            ));
         });
         return createParamNode(ctx, sName);
      }

      const oType = item.acceptType && item.acceptType.type();
      let acceptType = null;
      if( oType && !item.isRestElement && !oType.isGenericType && !oType.isLiteralObjectType ){
         let _alias = oType;
         let _last = null;
         while(_alias && _alias.isAliasType && _last !== _alias){
            _last = _alias;
            _alias = _alias.inherit.type();
         }
         if(!_alias || !_alias.isLiteralObjectType){
            acceptType = Utils.getOriginType(oType);
         }
      }

      let typeName = '';
      let defaultValue = null;
      let nameNode = null;

      if( item.isAssignmentPattern ){
         nameNode = ctx.createVarIdentifier(item.left.value(), item.left);
         defaultValue =ctx.createToken(item.right);
      }else if( item.question ){
         nameNode = ctx.createToken(item);
         defaultValue = ctx.createLiteral(null);
      }else{
         nameNode = ctx.createToken(item);
      }

      if(acceptType && Utils.isModule(acceptType) && !acceptType.isEnum){
         const originType = ctx.getAvailableOriginType( acceptType );
         if( originType==='String' || originType==='Array' || originType==='Object'){
            typeName = originType.toLowerCase();
         }else if( originType==='Function' ){
            typeName = '\\Closure';
         }else if( originType==='Boolean' ){
            typeName = 'bool';
         }
         if( !typeName && !originType){
            //to local type
            typeName = ctx.getModuleReferenceName(acceptType, stack.module||stack.compilation);
            if(typeName && (acceptType.isClass || acceptType.isInterface)){
               ctx.addDepend(acceptType)
            }
         }
      }
     
      if( oType && !item.isRestElement && !oType.isGenericType ){
         const isAddress = ctx.isAddressRefsType(oType,item);
         if( isAddress ){
            nameNode = createAddressRefsNode(ctx, nameNode);
         }
      }

      if( defaultValue ){
         nameNode = ctx.createAssignmentExpression(nameNode, defaultValue);
      }

      return createParamNode( ctx, nameNode, typeName );

   });

   return [items, before];

}


export default function(ctx,stack,type){
   const node = ctx.createNode(stack,type);
   const [params, before] = createParamNodes(ctx, stack, stack.params);
   let block = ctx.createToken( stack.body );
   if( stack.expression && stack.expression.async || stack.async ){
      const promiseModule = Namespace.globals.get('Promise');
      const promiseRefs   = ctx.getModuleReferenceName( promiseModule, stack.module||stack.compilation);
      ctx.addDepend(promiseModule, stack.module||stack.compilation );

      if(block.type !=='BlockStatement'){
         block = ctx.createBlockStatement([block])
      }
      
      const content = ctx.createFunctionExpression(block);
      if(params.length>0){
         content.using = params.map( item=>{
            return createAddressRefsNode(
               ctx,
               ctx.createVarIdentifier(item.argument.value)
            );
         });
      }

      const resolve = ctx.createCallExpression(
         ctx.createVarIdentifier('resolve'), [
            ctx.createCallExpression(
               ctx.createIdentifier('call_user_func'),
               [content]
            )
         ]
      );

      const reject = ctx.createCallExpression(
         ctx.createVarIdentifier('reject'), [
            ctx.createVarIdentifier('e')
         ]
      );
      
      const tryNode = ctx.createNode('TryStatement');
      tryNode.param = createParamNode(ctx,  'e', '\\Exception');
      tryNode.block = ctx.createBlockStatement([ctx.createExpressionStatement(resolve)])
      tryNode.handler =  ctx.createBlockStatement([ctx.createExpressionStatement(reject)])

      const executer = ctx.createFunctionExpression(ctx.createBlockStatement([tryNode]), [
         ctx.createVarIdentifier('resolve'),
         ctx.createVarIdentifier('reject')
      ]);

      if(params.length>0){
         executer.using = params.map( item=>{
            return createAddressRefsNode(ctx, ctx.createVarIdentifier(item.argument.value));
         });
      }

      block = ctx.createBlockStatement([
         ctx.createReturnStatement( 
            ctx.createNewExpression( 
               ctx.createIdentifier(promiseRefs),
               [executer]
            ) 
         ) 
      ]);
   }
   
   if( before.length > 0 ){
      block.body.unshift( ...before );
   }

   const method = !!stack.parentStack.isMethodDefinition;
   const variableRefs = !method ? ctx.getVariableRefs(stack) : null;
   if( variableRefs ){
      node.using = Array.from( variableRefs.values() ).map( item=>{
         const refs = typeof item === 'string' ? ctx.createVarIdentifier(item) : ctx.createVarIdentifier( item.value(), item);
         return createAddressRefsNode(ctx, refs)
      });
   }

   const returnType = stack.getReturnedType();
   if( ctx.isAddressRefsType(returnType, stack) ){
      node.prefix = '&';
   }

   node.params = params;
   node.body = block;
   return node;
};