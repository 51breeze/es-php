const Token  = require('../core/Token');
function createInitNode(ctx, name, initValue, defaultValue, operator, forceType=null){

   let init = defaultValue ? ctx.createBinaryNode(
      operator, 
      initValue,  
      defaultValue
   ) : initValue

   if(forceType){
      let node = ctx.createNode('TypeTransformExpression')
      node.typeName = forceType;
      node.expression = ctx.createParenthesNode(init)
      init = node;
   }

   return ctx.createStatementNode( ctx.createAssignmentNode( 
      name instanceof Token ? name : ctx.createIdentifierNode(name,null,true),
      init
   ));
}

function createRefsMemberNode(ctx, object, property , computed=false){
   const node = ctx.createMemberNode([ctx.createIdentifierNode(object,null,true), typeof property ==='number' ? ctx.createLiteralNode(property) :  ctx.createIdentifierNode(property)]);
   node.computed = computed;
   return node;
}

function createParamNode(ctx,name,prefix){
   const node = ctx.createNode('ParamDeclarator');
   node.argument = name instanceof Token ? name : ctx.createIdentifierNode(name,null,true);
   node.prefix = prefix;
   node.argument.isVariable = true;
   return node;
}

function createParamNodes(ctx, stack, params){
   const before = [];
   const items = params.map( (item,index)=>{
      if( item.isObjectPattern ){
         const sName = ctx.checkRefsName('_s', false, Token.SCOPE_REFS_DOWN );
         before.push(createInitNode(
            ctx, 
            sName,  
            ctx.createIdentifierNode(sName,null,true),  
            ctx.createNewNode( ctx.createIdentifierNode('\\stdClass'), []),
            '?:', 'object'
         ));
         item.properties.forEach( property=>{
            const key = property.key.value();
            let defaultValue = null;
            if( property.hasInit ){
               const initStack = property.init.isAssignmentPattern ? property.init.right : property.init;
               defaultValue = ctx.createToken(initStack);
            }else{
               defaultValue = ctx.createLiteralNode(null);
            }
            before.push(createInitNode(
               ctx, 
               key, 
               createRefsMemberNode(ctx,sName,key),
               defaultValue,
               '??'
            ));
         });
         return createParamNode(ctx, sName);
      }else if( item.isArrayPattern ){
         const sName = ctx.checkRefsName('_s', false, Token.SCOPE_REFS_DOWN );
         before.push(createInitNode(
            ctx, 
            sName,  
            ctx.createIdentifierNode(sName,null,true),  
            ctx.createArrayNode([]),
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
               defaultValue = ctx.createLiteralNode(null)
            }
            before.push(createInitNode(
               ctx, 
               key, 
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
            acceptType = stack.compiler.callUtils("getOriginType", oType);
         }
      }

      let typeName = '';
      let defaultValue = null;
      let nameNode = null;

      if( item.isAssignmentPattern ){
         nameNode = ctx.createIdentifierNode(item.left.value(), item.left, true);
         defaultValue =ctx.createToken(item.right);
      }else if( item.question ){
         nameNode = ctx.createToken(item);
         defaultValue = ctx.createLiteralNode(null);
      }else{
         nameNode = ctx.createToken(item);
      }

      if(acceptType && stack.compiler.callUtils("isModule", acceptType) && !acceptType.isEnum){
         const originType = ctx.builder.getAvailableOriginType( acceptType );
         if( originType==='String' || originType==='Array' || originType==='Object'){
            typeName = originType.toLowerCase();
         }else if( originType==='Function' ){
            typeName = '\\Closure';
         }else if( originType==='Boolean' ){
            typeName = 'bool';
         }
         if( !typeName && !originType){
            //to local type
            typeName = ctx.getModuleReferenceName( acceptType );
            if(typeName && (acceptType.isClass || acceptType.isInterface)){
               ctx.addDepend(acceptType)
            }
         }
      }
     
      if( oType && !item.isRestElement && !oType.isGenericType ){
         const isAddress = ctx.isAddressRefsType(oType,item);
         if( isAddress ){
            nameNode = ctx.creaateAddressRefsNode( nameNode );
         }
      }

      if( defaultValue ){
         nameNode = ctx.createAssignmentNode(nameNode, defaultValue);
      }

      return createParamNode( ctx, nameNode, typeName );

   });

   return [items, before];

}


module.exports = function(ctx,stack,type){
   const node = ctx.createNode(stack,type);
   const [params, before] = createParamNodes(node, stack, stack.params);
   let block = node.createToken( stack.body );
   
   
   if( stack.expression && stack.expression.async || stack.async ){
      const promiseModule = node.builder.getGlobalModuleById('Promise');
      const promiseRefs   = node.getModuleReferenceName( promiseModule );
      node.addDepend( promiseModule );
      const content = node.createFunctionNode();
      if(params.length>0){
         content.using = params.map( item=>{
            return node.creaateAddressRefsNode( node.createIdentifierNode(item.argument.value, null, true) );
         });
      }
      content.body = block;
      const executer = node.createFunctionNode((ctx)=>{
         const resolve = ctx.createCalleeNode( ctx.createIdentifierNode('resolve',null,true), [
            ctx.createCalleeNode(ctx.createIdentifierNode('call_user_func'), [content])
         ]);
         const reject = ctx.createCalleeNode( ctx.createIdentifierNode('reject',null,true), [
            ctx.createIdentifierNode('e', null, true)
         ]);
         const tryNode = ctx.createNode('TryStatement');
         tryNode.param = createParamNode(ctx, 'e', '\\Exception');
         tryNode.block = node.createNode('BlockStatement');
         tryNode.block.body=[ ctx.createStatementNode(resolve) ];
         tryNode.handler = node.createNode('BlockStatement');
         tryNode.handler.body=[ ctx.createStatementNode(reject) ];
         ctx.body.push( tryNode );
      }, [ node.createIdentifierNode('resolve',null,true), node.createIdentifierNode('reject',null,true) ]);
      if(params.length>0){
         executer.using = params.map( item=>{
            return node.creaateAddressRefsNode( node.createIdentifierNode(item.argument.value, null, true) );
         });
      }
      block = node.createNode('BlockStatement');
      block.body = [ 
         node.createReturnNode( 
            node.createNewNode( 
               node.createIdentifierNode(promiseRefs),
               [executer]
            ) 
         ) 
      ];
   }
   
   if( before.length > 0 ){
      block.body.unshift( ...before );
   }

   const method = !!stack.parentStack.isMethodDefinition;
   const variableRefs = !method ? node.getVariableRefs() : null;
   if( variableRefs ){
      node.using = Array.from( variableRefs.values() ).map( item=>{
         const refs = typeof item === 'string' ? node.createIdentifierNode(item,null,true) : node.createIdentifierNode( item.value(), item, true );
         return node.creaateAddressRefsNode(refs)
      });
   }

   const returnType = stack.getReturnedType();
   if( node.isAddressRefsType(returnType, stack) ){
      node.prefix = '&';
   }

   node.params = params;
   node.body = block;
   return node;
};