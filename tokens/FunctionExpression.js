const Token  = require('../core/Token');
function createInitNode(ctx, name, initValue, defaultValue, operator){
   return ctx.createAssignmentNode( 
      name instanceof Token ? name : ctx.createIdentifierNode(name,null,true),
      defaultValue ? ctx.createBinaryNode(
         operator, 
         initValue,  
         defaultValue
      ) : initValue
   );
}

function createRefsMemberNode(ctx, object, property , computed=false){
   const node = ctx.createMemberNode([ctx.createIdentifierNode(object,null,true), ctx.createIdentifierNode(property)]);
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
   const items = params.map( item=>{
      if( item.isObjectPattern ){
         const sName = ctx.checkRefsName('_s', false, Token.SCOPE_REFS_DOWN );
         before.push(createInitNode(
            ctx, 
            sName,  
            ctx.createIdentifierNode(sName,null,true),  
            ctx.createNewNode( ctx.createIdentifierNode('\\stdClass'), []),
            '?:' 
         ));
         item.properties.forEach( property=>{
            const key = property.key.value();
            if( property.hasInit ){
               const initStack = property.init.isAssignmentPattern ? property.init.right : property.init;
               before.push(createInitNode(
                  ctx, 
                  key, 
                  createRefsMemberNode(ctx,sName,key),
                  ctx.createToken(initStack), 
                  '??' 
               ));
            }else{
               before.push(createInitNode(
                  ctx, 
                  key, 
                  createRefsMemberNode(ctx,sName,key)
               ));
            }
         });
         return createParamNode(ctx, sName, 'object');
      }else if( item.isArrayPattern ){
         const sName = ctx.checkRefsName('_s', false, Token.SCOPE_REFS_DOWN );
         before.push(createInitNode(
            ctx, 
            sName,  
            ctx.createIdentifierNode(sName,null,true),  
            ctx.createArrayNode([]),
            '?:'
         ));
         item.elements.forEach( (property,index)=>{
            if( property.isAssignmentPattern ){
               const key = property.left.value();
               before.push(createInitNode(
                  ctx, 
                  key, 
                  createRefsMemberNode(ctx,sName,index, true),
                  ctx.createToken(property.right), 
                  '??',
               ));
            }else{
               const key = property.value();
               before.push(createInitNode(
                  ctx, 
                  key, 
                  createRefsMemberNode(ctx,sName,index, true)
               ));
            }
         });
         return createParamNode(ctx, sName, 'array');
      }

      const acceptType = item.acceptType && !item.isRestElement && stack.compiler.callUtils("getOriginType", item.type() );
      let typeName = '';
      let defaultValue = null;
      let nameNode = null;

      if( item.isAssignmentPattern ){
         nameNode = ctx.createToken(item.left);
         defaultValue =ctx.createToken(item.right);
      }else if( item.question ){
         nameNode = ctx.createToken(item);
         defaultValue = ctx.createLiteralNode(null);
      }else{
         nameNode = ctx.createToken(item);
      }
      if( acceptType && acceptType.isModule ){
         switch( ctx.builder.getAvailableOriginType( acceptType ) ){
            case 'String' :
               typeName = 'string';
               break;
            case 'Array' :
               typeName = 'array';
               break;
            case 'Function' :
               typeName = '\\Closure';
               break;   
            case 'Object' :
               typeName = 'object';
               break;   
            case 'Boolean' :
            case 'Uint' :
            case 'Int' :
            case 'Float' :
            case 'Double' :
               break;
            default :
               typeName = ctx.getModuleReferenceName( acceptType );
         }
      }
      if( acceptType && acceptType.id === "Array" ){
         const desc = item.description();
         if( desc && desc.isStack ){
            const has = item.isAssignmentPattern ? desc.assignItems.size > 1 : desc.assignItems.size > 0;
            if( has ){
               const address = ctx.addAssignAddressRef(desc);
               const refs = address.createName(desc);
               before.push( createInitNode(ctx, nameNode, ctx.createIdentifierNode(refs,null,true) ) );
               nameNode = ctx.createIdentifierNode(refs, null, true);
            }
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
   node.body = [];
   const block = node.createToken( stack.body );
   if( node.body.length>0){
      node.body.forEach( item=>{
         item.parent = block;
      })
      block.body.unshift( ...node.body );
   }
   const [params, before] = createParamNodes(node, stack, stack.params);
   if( before.length > 0 ){
      block.body.unshift( ...before );
   }


   const method = !!stack.parentStack.isMethodDefinition;
   const variableRefs = !method ? this.getVariableRefs() : null;


   node.params = params;
   node.body = block;
   return node;
};