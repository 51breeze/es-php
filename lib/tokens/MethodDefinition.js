import Utils from 'easescript/lib/core/Utils';
import { addAnnotationManifest, createCommentsNode,getMethodOrPropertyAlias} from '../core/Common';
import FunctionDeclaration from './FunctionDeclaration';

export default function(ctx,stack,type){
   const alias = getMethodOrPropertyAlias(ctx, stack);
   const node = FunctionDeclaration(ctx,stack,type);
   node.async = stack.expression.async ? true : false;
   node.static = stack.static ? ctx.createIdentifier('static') : null;
   node.final = stack.final ? ctx.createIdentifier('final') : null;
   node.modifier = ctx.createIdentifier(Utils.getModifierValue(stack)); 
   node.kind = 'method';
   if(alias && node.key){
      node.key.value = alias;
      node.key.raw   = alias;
   }
   node.comments = createCommentsNode(ctx, stack, node)
   addAnnotationManifest(ctx, stack, node);
   return node;
}