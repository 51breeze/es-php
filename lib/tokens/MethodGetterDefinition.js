import MethodDefinition from './MethodDefinition';
import { getMethodOrPropertyAlias } from '../core/Common';
export default function(ctx,stack,type){
    const alias = getMethodOrPropertyAlias(ctx, stack)
    const node = MethodDefinition(ctx,stack,type);
    node.isAccessor = true;
    node.kind = 'get'; 
    node.key.value = ctx.getAccessorName(alias || node.key.value, stack, 'get');
    return node;
 };