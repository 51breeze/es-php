import { getMethodOrPropertyAlias } from '../core/Common';
import MethodDefinition from './MethodDefinition';
export default function(ctx,stack,type){
    const alias = getMethodOrPropertyAlias(ctx, stack)
    const node = MethodDefinition(ctx,stack,type);
    node.isAccessor = true;
    node.kind = 'set';
    node.key.value = ctx.getAccessorName(alias || node.key.value, stack, 'set');
    return node;
 };