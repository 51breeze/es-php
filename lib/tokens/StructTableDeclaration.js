import StructTableBuilder from "../core/StructTableBuilder";
export default function(ctx, stack){
    ctx.table.getAllBuilder().forEach(
        build=>build.createTable(ctx, stack)
    );
    const builder = new StructTableBuilder(stack)
    return builder.create(ctx);
}