const replace_format = {
    'YYYY':'Y',
    'YY':'y',
    'MM':'m',
    'M':'n',
    'Mo':'mS',
    'MMM':'M',
    'MMMM':'F',
    'DD':'d',
    'Do':'jS',
    'D':'j',
    'DDD':'z',
    'DDDo':'zS',
    'DDDD':'z',
    'd':'w',
    'do':'wS',
    'dd':'D',
    'ddd':'D',
    'dddd':'l',
    'e':'w',
    'E':'N',
    'w':'W',
    'wo':'WS',
    'GG':'y',
    'GGGG':'Y',
    'A':'A',
    'a':'a',
    'HH':'H',
    'H':'G',
    'hh':'h',
    'h':'g',
    'mm':'i',
    'ss':'s',
    'Z':'P',
    'ZZ':'O',
    'X':'U',
    "LTS": "g:i:s A",
    "LT" : "g:i A",
    "L"  : "m/d/Y",
    "l"  : "n/j/Y",
    "LL" : "F jS Y",
    "ll" : "M j Y",
    "LLL": "F jS Y g:i A",
    "lll": "M j Y g:i A",
    "LLLL": "l, F jS Y g:i A",
    "llll": "D, M j Y g:i A",
}

const allow_format_chars = 'mdewgahksxolMQDEWYGAHSZXLT'.split('').map( char=>char.charCodeAt(0) );
const not_support_parting = ['k','kk','ww','s','m','x','Q','Qo'];
function isZm(code){
    return code >= 65 && code <= 90 || code >= 97 && code <= 122;  
}

function isAllowFormat(code){
    return allow_format_chars.includes( code );
}

function parseFormat( format ){
    const group = [];
    const len = format.length;
    var index = 0;
    var parting = '';
    var last = null;
    while(index < len){
        let code = format.charCodeAt(index);
        if( last !==92 && isAllowFormat(code) && (last === code || code === 111 || parting==='') ){
            parting += format[index];
        }else{
            const char = isZm( code ) && last !==92 && !isAllowFormat(code) ? '\\'+format[index] : format[index];
            if( last !==92 && ( isAllowFormat(last) || isAllowFormat(code) ) ){
                if(parting)group.push( parting );
                parting = char;
            }else{
                parting += char;
            }
        }
        index++;
        last = code;
    }
    if( parting )group.push( parting );
    return group;
}

function createDateNode(ctx, format, args=[] ){
    const node = ctx.createLiteral(format);
    if( /\\/.test(format) ){
        node.raw = `"${format}"`;
    }
    return ctx.createCallExpression(
        ctx.createIdentifier('date'),
        [ node ].concat( args )
    );
}

function createFixNode(ctx, format, now){
    switch( format ){
        case 'k':
        case 'kk':
            return ctx.createCallExpression( 
                ctx.createIdentifier('sprintf'), 
                [
                    ctx.createLiteral( format === 'kk' ? '%02d' : '%d'), 
                    ctx.createBinaryExpression(
                        ctx.createCallExpression( 
                            ctx.createIdentifier('intval'), 
                            [createDateNode(ctx, 'G', now)]
                        ),
                        ctx.createLiteral(1),
                        '+'
                    )
                ]
            ); 
        case 'ww' :   
            return ctx.createCallExpression( 
                ctx.createIdentifier('sprintf'), 
                [
                    ctx.createLiteral('%02d'), 
                    createDateNode(ctx, 'W', now)
                ]
            );
        case 's' :   
        case 'm' :   
            return ctx.createCallExpression( 
                ctx.createIdentifier('ltrim'), 
                [
                    createDateNode(ctx, format ==='m' ? 'i' : 's', now),
                    ctx.createLiteral('0')
                ]
            );
        case 'x' :   
            return ctx.createCallExpression( 
                ctx.createIdentifier('sprintf'), 
                [
                    ctx.createLiteral('%d%03d'),
                    createDateNode(ctx, 'U', now),
                    ctx.createBinaryExpression(
                        ctx.createCallExpression( 
                            ctx.createIdentifier('date_format'), 
                            [
                                ctx.createCallExpression( ctx.createIdentifier('date_create'), now ),
                                ctx.createLiteral('u')
                            ]
                        ),
                        ctx.createLiteral(1000),
                        '/'
                    )
                ]
            );
        case 'E':
            return ctx.createCallExpression( 
                ctx.createIdentifier('sprintf'), 
                [
                    ctx.createLiteral('%d'), 
                    ctx.createBinaryExpression(
                        ctx.createCallExpression( 
                            ctx.createIdentifier('intval'), 
                            [createDateNode(ctx, 'w', now)]
                        ),
                        ctx.createLiteral(1),
                        '+'
                    )
                ]
            ); 
        case 'Q':
        case 'Qo':
            return ctx.createCallExpression( 
                ctx.createIdentifier('sprintf'), 
                [
                    ctx.createLiteral( format ==='Qo' ? '%d%s' : '%d'), 
                    ctx.createCallExpression( 
                        ctx.createIdentifier('ceil'), 
                        [
                            ctx.createBinaryExpression(
                                ctx.createCallExpression( 
                                    ctx.createIdentifier('intval'), 
                                    [createDateNode(ctx, 'n', now)]
                                ),
                                ctx.createLiteral(3),
                                '/'
                            )
                        ]
                    ),
                    format ==='Qo' && createDateNode(ctx, 'S', now)
                ].filter( item=>!!item )
            );
    }

    if( format.charCodeAt(0) === 83 ){
        const len = format.length;
        return ctx.createCallExpression( 
            ctx.createIdentifier('sprintf'), 
            [
                len > 3 ? ctx.createLiteral(`%-\\'0${len}s`) : ctx.createLiteral(`%0${len}d`),
                ctx.createCallExpression(
                    ctx.createIdentifier('round'),
                    [
                        ctx.createBinaryExpression(
                            ctx.createCallExpression( 
                                ctx.createIdentifier('date_format'), 
                                [
                                    ctx.createCallExpression( ctx.createIdentifier('date_create'), now ),
                                    ctx.createLiteral('u')
                                ]
                            ),
                            ctx.createLiteral( Math.pow(10, Math.max(6-len,3) ) ),
                            '/'
                        )
                    ]
                )
            ]
        );
    }

    if( /[^\\][a-zA-Z]+/.test(format) ){
        return createDateNode(ctx, format, now);
    }else{
        return ctx.createLiteral(format);
    }
};

function createCalleeNode(ctx, args){
    const group = parseFormat( args[0].value );
    const segments = [];
    var now = args.slice(1,2);
    var format = '';
    group.forEach( parting=>{
        if( not_support_parting.includes(parting) || parting.charCodeAt(0) ===83 ){
            if( format )segments.push( format );
            format = '';
            segments.push( parting );
        }else{
            format += replace_format[ parting ] || parting;
        }
    });

    if( format )segments.push( format );
    if( segments.length > 1 ){
        let base = null;
        const node = createFixNode(ctx, segments.pop() , now);
        while( segments.length > 0 ){
            base = ctx.createBinaryExpression(createFixNode(base || ctx, segments.pop(), now ), base || node, '.');
        }
        return base;
    }
    return createDateNode(ctx, segments[0], now );
}

export default createCalleeNode;