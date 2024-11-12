import { getBuilder } from '@easescript/transform/lib/core/TableBuilder';

export default function(ctx, stack){
    getBuilder('mysql').createTable(ctx, stack)
}