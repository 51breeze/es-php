class Generator{
    #file = null;
    #context = null;
    #sourceMap = null;
    #code = '';
    #line = 1;
    #column = 0;
    #indent = 0;

    constructor(context=null, disableSourceMaps=false){
        if(context){
            this.#context = context;
            if(disableSourceMaps !== true ){
                this.#file = context.target.file;
                this.#sourceMap = context.options.sourceMaps ? this.createSourceMapGenerator() : null;
            }
        }
    }

    get file(){
        return this.#file
    }

    get context(){
        return this.#context
    }

    get sourceMap(){
        return this.#sourceMap
    }

    get code(){
        return this.#code
    }

    get line(){
        return this.#line
    }

    createSourceMapGenerator(){
        let compilation = this.context.compilation;
        let generator = new SourceMap.SourceMapGenerator();
        if(compilation.source){
            generator.setSourceContent(compilation.file, compilation.source);
        }
        return generator
    }

    addMapping( node ){
        if( this.sourceMap ){
            const loc = node.loc;
            if( loc ){
                this.sourceMap.addMapping({
                    generated: {
                        line: this.#line,
                        column: this.getStartColumn()
                    },
                    source: this.#file,
                    original: {
                        line: loc.start.line,
                        column:loc.start.column
                    },
                    name: node.type ==='Identifier' ? node.value : null
                });
            }
        }
    }

    newBlock(){
       this.#indent++;
       return this;
    }

    endBlock(){
        this.#indent--;
        return this;
    }

    newLine(){
        const len = this.#code.length;
        if(!len)return;
        const char = this.#code.charCodeAt( len-1 );
        if( char === 10 || char ===13 ){
            return this;
        }
        this.#line++;
        this.#code+='\r\n';
        this.#column = 0;
        return this;
    }

    getStartColumn(){
        if( this.#column===0 ){
            return (this.#indent * 4)+1;
        }
        return this.#column;
    }

    withString( value ){
        if( !value )return;
        if( this.#column===0 ){
            this.#column = this.getStartColumn();
            this.#code += '    '.repeat( this.#indent );
        }
        this.#code +=value;
        this.#column += value.length || 0;
    }

    withEnd( expr ){
        if( expr ){
            this.withString( expr );
            this.withSemicolon();
        }
        this.newLine();
    }

    withParenthesL(){
        this.withString('(');
    }

    withParenthesR(){
        this.withString(')');
    }

    withBracketL(){
        this.withString('[');
    }

    withBracketR(){
        this.withString(']');
    }

    withBraceL(){
        this.withString('{');
    }

    withBraceR(){
        this.withString('}');
    }

    withSpace(){
        this.withString(' ');
    }

    withDot(){
        this.withString('.');
    }

    withColon(){
        this.withString(':');
    }

    withOperator( value ){
        this.withString(` ${value} `);
    }

    withComma(){
        this.withString(',');
    }

    withSemicolon(){
        const code = this.code;
        const char = code.charCodeAt( code.length-1 );
        if( char === 59 || char === 10 || char ===13 || char ===32 ){
            return this;
        }
        this.withString(';');
        return this;
    }

    withSequence( items , newLine){
        if( !items )return this;
        const len = items.length-1;
        items.forEach( (item,index)=>{
            this.make( item );
            if( index < len ){
                this.withString(',');
                if(newLine || item.newLine)this.newLine();
            }
        });
        return this;
    }

    make( token ){
        if( !token )return;
        switch( token.type ){
            case "ArrayExpression" :
                this.withBracketL();
                if( token.elements.length > 0 ){
                    if(token.newLine===true){
                        this.newLine();
                        this.newBlock();
                    }
                    this.withSequence(token.elements, !!token.newLine);
                    if(token.newLine===true){
                        this.newLine();
                        this.endBlock();
                    }
                }
                this.withBracketR();
            break;
            case "ArrayPattern" :
                this.withString('list');
                this.withParenthesL();
                if( token.elements.length > 0 ){
                    this.withSequence(token.elements, !!token.newLine);
                }
                this.withParenthesR();
            break;
            case "ArrowFunctionExpression" :
                this.withString('function');
                if( token.prefix ){
                    this.withSpace();
                    this.withString( token.prefix );
                }
                this.withParenthesL();
                this.withSequence(token.params);
                this.withParenthesR();
                if( token.using && token.using.length > 0 ){
                    this.withString('use');
                    this.withParenthesL();
                    this.withSequence( token.using );
                    this.withParenthesR();
                }
                if( token.body.type ==="BlockStatement"){
                    this.make(token.body);
                }else{
                    this.withBraceL();
                    this.newLine();
                    this.newBlock();
                    this.withString('return'); 
                    this.withSpace();
                    this.make(token.body);
                    this.withSemicolon();
                    this.endBlock();
                    this.newLine();
                    this.withBraceR();
                }
            break;
            case "AssignmentExpression" :
                if(token.restrain){
                    this.withString('@');
                }
            case "AssignmentPattern" :
                this.make(token.left);
                this.withString( token.operator || '=');
                this.make(token.right);
            break;
            case "AwaitExpression" :
                this.make(token.argument);
            break;
            case "AddressReferenceExpression" :
                this.withString('&');
                this.make(token.argument);
            break;
            case "BinaryExpression" :
                this.make(token.left);
                this.withOperator( token.operator );
                this.make(token.right);
            break;
            case "BreakStatement" :
                this.newLine();
                this.withString('break');
                if(token.label){
                    this.withSpace();
                    this.make(token.label);
                }
                this.withSemicolon();
            break;
            case "BlockStatement" :
                if( token.isWhenStatement ){
                    token.body.forEach( item=>this.make(item) );
                }else{
                    if(Array.isArray(token.body)){
                        this.withBraceL();
                        this.newBlock();
                        token.body.length > 0 && this.newLine();
                        token.body.forEach( item=>this.make(item) );
                        this.endBlock();
                        token.body.length > 0 && this.newLine();
                        this.withBraceR();
                    }else{
                        this.make(token.body)
                    }
                }
            break;
            case "ChunkExpression" :
                if( token.value ){
                    if(token.newLine !== false){
                        this.newLine();
                    }
                    let lines = String(token.value).split(/[\r\n]+/)
                    lines.forEach(line=>{
                        this.withString(line);
                        this.newLine();
                    })
                    if(token.newLine !== false){
                        this.newLine();
                    }
                }
            break;
            case "CallExpression" :
                this.make(token.callee)
                this.withParenthesL();
                if(token.newLine)this.newLine();
                if(token.indentation)this.newBlock();
                this.withSequence(token.arguments, token.newLine);
                if(token.indentation)this.endBlock();
                if(token.newLine)this.newLine();
                this.withParenthesR();
            break;
            case "ConditionalExpression" :
                if(token.newLine)this.newLine();
                this.make(token.test);
                this.withOperator('?');
                this.make(token.consequent);
                this.withOperator(':');
                this.make(token.alternate);
                if(token.newLine)this.newLine();
            break;
            case "ContinueStatement" :
                this.newLine();
                this.withString('continue');
                if(token.label){
                    this.withSpace();
                    this.make(token.label);
                }
                this.withSemicolon();
            break;
            case "ChainExpression":
                this.make(token.expression);
            break;
            case "DoWhileStatement" :
                this.newLine();
                this.withString('do');
                this.make(token.body);
                this.withString('while');
                this.withParenthesL();
                this.make(token.condition);
                this.withParenthesR();
                this.withSemicolon();
            break;
            case "ExpressionStatement" :
                this.newLine();
                this.make(token.expression);
                this.withSemicolon();
            break;
            case "ExportDefaultDeclaration" :
            case "ExportAllDeclaration" :
            case "ExportNamedDeclaration" :
            case "ExportSpecifier" :
            case "ExportAssignmentDeclaration" :
                throw new Error('Export declaration should transform to return-statement')
            case "ForInStatement" :
                this.newLine();
                this.withString('foreach');
                this.withParenthesL();
                this.make(token.right);
                this.withOperator('as');
                if( token.left ){
                    this.make(token.left);
                }
                if( token.value ){
                    if( token.left ){
                        this.withOperator('=>');
                    }
                    this.make(token.value);
                }else{
                    if( token.left ){
                        this.withOperator('=>');  
                    }
                    this.withOperator('$_');
                }
                this.withParenthesR();
                this.make(token.body);
                if( token.body.type !=="BlockStatement" ){
                    this.withSemicolon();
                }
            break;
            case "ForOfStatement" :
                this.newLine();
                this.withString('foreach');
                this.withParenthesL();
                this.make(token.right);
                this.withOperator('as');
                this.make(token.left);
                this.withParenthesR();
                this.make(token.body);
                if( token.body.type !=="BlockStatement" ){
                    this.withSemicolon();
                }
            break;
            case "ForStatement" :
                this.newLine();
                this.withString('for');
                this.withParenthesL();
                this.make(token.init);
                this.withSemicolon();
                this.make(token.condition);
                this.withSemicolon();
                this.make(token.update);
                this.withParenthesR();
                this.make(token.body);
                if( token.body.type !=="BlockStatement" ){
                    this.withSemicolon();
                }
            break;
            case "FunctionDeclaration" :
            case "MethodDefinition" :
            case "MethodGetterDefinition" :
            case "MethodSetterDefinition" :
                this.newLine();

                if(token.comments){
                    this.make( token.comments );
                    this.newLine();
                }

                if( token.final ){
                    this.make( token.final );
                    this.withSpace();
                }

                if( token.static ){
                    this.make( token.static );
                    this.withSpace();
                }

                if( token.modifier ){
                    this.make( token.modifier );
                    this.withSpace();
                }

                this.withString('function');
                if( !token.key.computed ){
                    this.withSpace();
                    if( token.prefix ){
                        this.withString( token.prefix );
                    }
                    this.make( token.key );
                }else if( token.prefix ){
                    this.withSpace();
                    this.withString( token.prefix );
                }
                
                this.withParenthesL();
                this.withSequence(token.params);
                this.withParenthesR();
                if( token.using && token.using.length>0){
                    this.withString('use');
                    this.withParenthesL();
                    this.withSequence( token.using );
                    this.withParenthesR();
                }
                if( token.isInterfaceMember ){
                    this.withSemicolon();
                }else{
                    this.make(token.body);
                }
                this.newLine();
            break;
            case "FunctionExpression" :
                if(token.comments){
                    this.make( token.comments );
                    this.newLine();
                }
                this.withString('function');
                if( token.prefix ){
                    this.withSpace();
                    this.withString( token.prefix );
                }
                this.withParenthesL();
                this.withSequence(token.params);
                this.withParenthesR();
                if( token.using && token.using.length>0 ){
                    this.withString('use');
                    this.withParenthesL();
                    this.withSequence( token.using );
                    this.withParenthesR();
                }
                this.make(token.body);
            break;
            case "Identifier" :
                this.addMapping( token );
                if( token.isVariable ){
                    this.withString( '$'+token.value );
                }else{
                    this.withString( token.value );
                }
            break;
            case "IfStatement" :
                if( !token.parent || token.parent.type !=='IfStatement'){
                    this.newLine();
                }
                this.withString('if');
                this.withParenthesL();
                this.make(token.condition);
                this.withParenthesR();
                this.make(token.consequent);
                if( token.consequent.type !=="BlockStatement" ){
                    this.withSemicolon();
                    this.newLine();
                }
                if( token.alternate ){
                    this.withString('else');
                    if(token.alternate.type==="IfStatement" || token.alternate.type !=="BlockStatement" ){
                        this.withSpace();
                    }
                    this.make(token.alternate);
                    if( token.alternate.type !=="BlockStatement" ){
                        this.withSemicolon();
                        this.newLine();
                    }
                }
            break;
            case "ImportDeclaration" :
                this.newLine();
                if(token.specifiers && token.specifiers.length > 0 ){
                    token.specifiers.forEach( item=>{
                        this.withString( '$'+item.local.value );
                        this.withString( '=' );
                    });
                }
                if(token.includeOnce===false){
                    this.withString('include');
                }else{
                    this.withString('include_once');
                }
                this.withParenthesL()
                this.make( token.source );
                this.withParenthesR()
                this.withSemicolon();
                this.newLine();
            break;
            case "ImportSpecifier" :
                if( token.imported.value !==  token.local.value ){
                    this.make( token.imported );
                    this.withOperator('as');
                }
                this.make( token.local );
            break;
            case "ImportNamespaceSpecifier" :
                this.make( token.local );
            break;
            case "ImportDefaultSpecifier" :
                this.make( token.local );
            break;
            case "ImportExpression" :
                this.withString('import');
                this.withParenthesL();
                this.make( token.source );
                this.withParenthesR();
            break;
            case "LabeledStatement" :
                this.newLine();
                this.make( token.body );
            break;
            case "Literal" :
                this.withString( token.raw );
            break;
            case "LogicalExpression" :
                this.make(token.left);
                this.withOperator( token.operator );
                this.make(token.right);
            break;
            case "MemberExpression" :
                this.make(token.object);
                if( token.computed){
                    this.withBracketL();
                    this.make(token.property);
                    this.withBracketR();
                }else{
                    if( token.isStatic ){
                        this.withString('::');
                    }else{
                        this.withString('->');
                    }

                    if( token.property.type !=="Identifier" ){
                        this.withBraceL();
                        this.make(token.property);
                        this.withBraceR();
                    }else{
                        this.make(token.property);
                    }
                }
            break;
            case "NewExpression" :
                this.withString('new');
                this.withSpace();
                this.make(token.callee);
                this.withParenthesL();
                this.withSequence( token.arguments );
                this.withParenthesR();
            break;
            case "ObjectExpression" :
                //this.withString('(object)')
                this.withBracketL();
                if( token.properties.length > 0 ){
                    this.newBlock();
                    this.newLine();
                    this.withSequence( token.properties , true);
                    this.newLine();
                    this.endBlock();
                }
                this.withBracketR();
            break;
            case "ObjectPattern" :
                token.properties.forEach( (item,index)=>{
                    this.make( item );
                    if( index < token.properties.length-1 ){
                        this.withSemicolon();
                    }
                });
            break;
            case "ParenthesizedExpression" :
                if(token.newLine)this.newLine();
                this.withParenthesL();
                this.make( token.expression );
                this.withParenthesR();
                if(token.newLine)this.newLine();
            break;
            case "Property" :
                if( token.computed ){
                    this.withParenthesL()
                    this.make( token.key );
                    this.withParenthesR()
                }else{
                    if(token.key.type==='Identifier'){
                        this.withString( "'"+token.key.value+"'");
                    }else{
                        this.make( token.key );
                    }
                }
                this.withString('=>');
                if(token.init){
                    this.make( token.init );
                }else if(token.key.type==='Identifier'){
                    this.withString( '$'+token.key.value );
                }else{
                    throw new Error('Property token exception.')
                }
            break;
            case "JSXAttribute" :
                this.withString( `'${token.name.value}'` );
                this.withString('=>')
                this.make( token.value );
            break;
            case "PropertyDefinition" :
                this.newLine();
                if(token.comments){
                    this.make( token.comments );
                    this.newLine();
                }
                if( token.static ){
                    this.make( token.static );
                    this.withSpace();
                }
                if( token.modifier ){
                    this.make( token.modifier );
                    this.withSpace();
                }
                if( token.kind==='const'){
                    this.withString('const');
                    this.withSpace();
                }else{
                    this.withString('$');
                }

                this.make( token.key );
                this.withString('=');
                this.make( token.init );
                this.withSemicolon();
                this.newLine();
            break;
            case "ParamDeclarator" :
                if( token.prefix ){
                    this.withString( token.prefix );
                    this.withSpace();
                }
                this.make( token.argument );
            break;
            case "RestElement" :
                this.withString('...' );
                this.withString( '$'+token.value );
            break;
            case "ReturnStatement" :
                this.newLine();
                this.withString('return');
                if( token.argument ){
                    this.withSpace();
                    this.make( token.argument );
                }
                this.withSemicolon();
            break;
            case "SequenceExpression" :
                this.withSequence( token.expressions );
            break;
            case "SpreadElement" :
                this.withString('...' );
                this.make( token.argument );
            break;
            case "SuperExpression" :
                this.withString('parent');
            break;
            case "SwitchCase" :
                this.newLine();
                if( token.condition ){
                    this.withString('case');
                    this.withSpace();
                    this.make( token.condition );
                }else{
                    this.withString('default' );
                }
                this.withSpace();
                this.withColon();
                this.newBlock();
                token.consequent.forEach( item=>this.make(item) );
                this.endBlock();
            break;
            case "SwitchStatement" :
                this.newLine();
                this.withString('switch');
                this.withParenthesL();
                this.make( token.condition );
                this.withParenthesR();
                this.withBraceL();
                this.newBlock();
                token.cases.forEach( item=>this.make(item) );
                this.newLine();
                this.endBlock();
                this.withBraceR();
            break;
            case "TemplateElement" :
                this.withString("'");
                this.withString( token.value.replace(/(?<!\\)\u0027/g,"\\'") );
                this.withString("'");
            break;
            case "TemplateLiteral" :
                const expressions =token.expressions;
                token.quasis.map( (item,index)=>{
                    const has = item.value;
                    if(index>0){
                        if(has)this.withString(' . ')
                    }
                    if(has)this.make( item );
                    if(index < expressions.length){
                        if(has)this.withString(' . ')
                        this.withParenthesL()
                        this.make( expressions[index] );
                        this.withParenthesR()
                    }
                });
            break;
            case "ThisExpression" :
                this.withString('$this');
            break;
            case "ThrowStatement" :
                this.newLine();
                this.withString('throw');
                this.withSpace();
                this.make( token.argument );
                this.withSemicolon();
            break;
            case "TryStatement" :
                this.newLine();
                this.withString('try');
                this.make( token.block );
                this.withString('catch');
                this.withParenthesL();
                this.make( token.param );
                this.withParenthesR();
                this.make( token.handler );
                if( token.finally ){
                    this.withString('finally');
                    this.make( token.finalizer );
                }
            break;
            case "UnaryExpression" :
                if( token.prefix ){
                    this.withString(token.operator);
                    if( ![33,43,45,126].includes(token.operator.charCodeAt(0)) ){
                        this.withSpace();
                    }
                    this.make( token.argument )
                }else{
                    this.make( token.argument )
                    this.withSpace();
                    this.withString(token.operator);
                }
            break;
            case "UpdateExpression" :
                if( token.prefix ){
                    this.withString(token.operator);
                    this.make( token.argument )
                }else{
                    this.make( token.argument )
                    this.withString(token.operator);
                }
            break;
            case "VariableDeclaration" :
                if( !token.inFor )this.newLine();
                this.withSequence( token.declarations );
                if( !token.inFor ){
                    this.withSemicolon();
                    this.newLine();
                }
            break;
            case "VariableDeclarator" :
                if( token.id.type ==='ObjectPattern'){
                    this.make( token.id );
                }else{
                    if( token.id.type !=='ArrayPattern' ){
                        this.withString('$')
                    }
                    this.make( token.id );
                    if( token.init ){
                        this.withOperator('=');
                        this.make( token.init );
                    }
                }
            break;
            case "UsingStatement" :
                this.newLine();
                this.withString('use');
                this.withSpace();
                this.withString( token.source );
                if(token.local){
                    this.withOperator('as');
                    this.withString( token.local );
                }
                this.withSemicolon();
                this.newLine();
            break;
            case "NamespaceStatement":
                if(token.source){
                    this.newLine();
                    this.withString('namespace');
                    this.withSpace();
                    this.withString( token.source );
                    this.withSemicolon();
                    this.newLine();
                }
            break;
            case "WhileStatement" :
                this.withString('while');
                this.withParenthesL();
                this.make( token.condition );
                this.withParenthesR();
                this.make( token.body );
                if( token.body.type !=="BlockStatement" ){
                    this.withSemicolon();
                }
            break;
            case "TypeTransformExpression" :
                if( token.typeName ){
                    this.withParenthesL();
                    this.withString(token.typeName)
                    this.withParenthesR();
                }
                this.make( token.expression );
            break;
            case "ClassDeclaration" :
            case "InterfaceDeclaration" :
                this.genClass( token );
            break;
            case "StructTableDeclaration" :
                this.genSql( token );
            break;
            case "StructTableMethodDefinition" :
                this.make( token.key );
                this.withParenthesL();
                this.withSequence( token.params );
                this.withParenthesR();
            break;
            case "StructTablePropertyDefinition" :
                this.withString(' ');
                this.make( token.key );
                if( token.init ){
                    if( token.assignment ){
                        this.withOperator('=');
                        this.make( token.init );
                    }else{
                        this.withString(' ');
                        this.make( token.init );
                    }
                }
            break;
            case "StructTableKeyDefinition" :
                this.make( token.key );
                this.withString(' ');
                if( token.prefix ){
                    this.make( token.prefix );
                    this.withString(' ');
                }
                this.make( token.local );
                token.properties.forEach( (item)=>{
                    this.withString(' ');
                    this.make(item);
                });
            break;
            case "StructTableColumnDefinition" :
                this.make( token.key );
                this.withString(' ');
                token.properties.forEach( (item,index)=>{
                    if( index > 0)this.withString(' ');
                    this.make(item);
                });
            break;
            case "DeclaratorDeclaration" :
                this.genDeclarationClass( token );
            break;
            case "EnumDeclaration" :
            case "PackageDeclaration" :
            case "Program" :
                token.body.forEach( item=>this.make(item) )
        }
    }

    genDeclarationClass(token){
        if( token.comments ){
            this.make( token.comments );
            this.newLine();
        }
        if( token.namespace ){
            this.withString('namespace');
            this.withSpace();
            this.make( token.namespace );
            this.withSemicolon()
            this.newLine();
        }
        token.imports.forEach( item=>{
            this.make( item );
        });
        token.using.forEach( item=>{
            this.make( item );
        });
        token.body.forEach( item=>this.make(item) );
    }

    genClass(token){

        this.newLine();
        if(token.comments){
            this.make( token.comments );
            this.newLine();
        }

        if( token.abstract ){
            this.make( token.abstract );
            this.withSpace();
        }
        if( token.final ){
            this.make( token.final );
            this.withSpace();
        }
        if( token.type ==="InterfaceDeclaration" ){
            this.withString('interface');
            this.withSpace();
        }else{
            this.withString('class');
            this.withSpace();
        }
        this.make( token.id );
        if( token.inherit ){
            this.withSpace();
            this.withString('extends');
            this.withSpace();
            this.make( token.inherit );
        }
        if( token.implements && token.implements.length>0 ){
            this.withSpace();
            this.withString('implements');
            this.withSpace();
            this.withSequence( token.implements );
        }
        this.withBraceL();
        this.newBlock();
        this.newLine();
        token.body.forEach( item=>this.make(item));
        this.endBlock();
        this.newLine();
        this.withBraceR();
    }

    genSql(token){
        this.newLine();
        if(token.comments){
            this.make( token.comments );
            this.newLine();
        }
        this.withString('create table');
        this.withString(' ');
        this.make(token.id);
        this.withParenthesL();
        this.newLine();
        this.newBlock()
        token.body.forEach( (item,index)=>{
            if( item.type ==='StructTableKeyDefinition' || item.type==="StructTableColumnDefinition" ){
                if(index>0){
                    this.withComma(',');
                    this.newLine();
                }
            }
            this.make(item);
        });
        this.endBlock()
        this.newLine();
        this.withParenthesR();
        token.properties.forEach( item=>this.make(item) );
        this.withSemicolon();
        this.newLine();
    }

    toString(){
        return this.code;
    }
}

module.exports = Generator;