class Generator{
    constructor(file, sourceMap){
        this.code = '';
        this.line = 1;
        this.column = 0;
        this.indent = 0;
        this.file = file;
        this.sourceMap = sourceMap;
    }

    addMapping( node ){
        if( this.sourceMap ){
            const loc = node.stack && node.stack.node.loc;
            if( loc ){
                this.sourceMap.addMapping({
                    generated: {
                        line: this.line,
                        column: this.getStartColumn()
                    },
                    source: this.file,
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
       this.indent++;
       return this;
    }

    endBlock(){
        this.indent--;
        return this;
    }

    newLine(){
        const len = this.code.length;
        if(!len)return;
        const char = this.code.charCodeAt( len-1 );
        if( char === 10 || char ===13 ){
            return this;
        }
        this.line++;
        this.code+='\r\n';
        this.column = 0;
        return this;
    }

    getStartColumn(){
        if( this.column===0 ){
            return (this.indent * 4)+1;
        }
        return this.column;
    }

    withString( value ){
        if( !value )return;
        if( this.column===0 ){
            this.column = this.getStartColumn();
            this.code += '    '.repeat( this.indent );
        }
        this.code +=value;
        this.column += value.length;
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
            case "ArrayPattern" :
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
            case "ArrowFunctionExpression" :
                this.withString('function');
                if( token.prefix ){
                    this.withSpace();
                    this.withString( token.prefix );
                }
                this.withParenthesL();
                this.withSequence(token.params);
                this.withParenthesR();
                if( token.using ){
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
            case "AssignmentPattern" :
                this.make(token.left);
                this.withString('=');
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
                this.withBraceL();
                this.newBlock();
                token.body.length > 0 && this.newLine();
                token.body.forEach( item=>this.make(item) );
                this.endBlock();
                token.body.length > 0 && this.newLine();
                this.withBraceR();
            break;
            case "ChunkExpression" :
                if( token.value ){
                    if(token.newLine !== false){
                        this.newLine();
                    }
                    this.withString( token.value );
                    const result = token.value.match(/[\r\n]+/g);
                    if( result ){
                        this.line+=result.length;
                    }
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
                this.newLine();
                this.withString('export default ');
                this.make(token.declaration);
                this.withSemicolon();
            break;
            case "ForInStatement" :
                this.newLine();
                this.withString('foreach');
                this.withParenthesL();
                this.make(token.right);
                this.withOperator('as');
                this.make(token.left);
                this.withOperator('=>$_');
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
                if( token.modifier ){
                    this.make( token.modifier );
                    this.withSpace();
                }
                if( token.final ){
                    this.withSpace();
                    this.make( token.final );
                }
                this.withString('function');
                if( token.prefix ){
                    this.withSpace();
                    this.withString( token.prefix );
                }
                if( !token.key.computed ){
                    this.withSpace();
                    this.make( token.key );
                }
                this.withParenthesL();
                this.withSequence(token.params);
                this.withParenthesR();
                if( token.using ){
                    this.withString('use');
                    this.withParenthesL();
                    this.withSequence( token.using );
                    this.withParenthesR();
                }
                this.make(token.body);
                this.newLine();
            break;
            case "FunctionExpression" :
                this.withString('function');
                if( token.prefix ){
                    this.withSpace();
                    this.withString( token.prefix );
                }
                this.withParenthesL();
                this.withSequence(token.params);
                this.withParenthesR();
                if( token.using ){
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
                this.newLine();
                this.withString('if');
                this.withParenthesL();
                this.make(token.condition);
                this.withParenthesR();
                this.make(token.consequent);
                if( !token.consequent ){
                    console.log( token.parent.compilation.file )
                }
                if( token.alternate ){
                    this.withString('else');
                    if(token.alternate.type==="IfStatement"){
                        this.withSpace();
                    }
                    this.make(token.alternate);
                    if( token.alternate.type !=="BlockStatement" ){
                        this.withSemicolon();
                    }
                }
            break;
            case "ImportDeclaration" :
                this.newLine();
                this.withString('include_once');
                this.withParenthesL()
                this.make( token.source );
                this.withParenthesR()
                this.withSemicolon();
                this.newLine();
            break;
            case "ImportSpecifier" :
                this.make( token.imported );
                this.withOperator('as');
                this.make( token.local );
            break;
            case "ImportNamespaceSpecifier" :
                this.withString('*');
                this.withOperator('as');
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
                this.make( token.label );
                this.withString(':');
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

                    if( token.property.type ==="Literal"){
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
                this.withString('(object)')
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
                this.withBraceL();
                token.properties.forEach( (item,index)=>{
                    this.make( item );
                    if( index < token.properties.length-1 ){
                        this.withComma();
                    }
                });
                this.withBraceR();
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
                    this.withBracketL()
                    this.make( token.key );
                    this.withBracketR()
                }else{
                    this.make( token.key );
                }
                this.withString('=>')
                this.make( token.init );
            break;
            case "PropertyDefinition" :
                this.newLine();
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
                this.withSpace();
                this.make( token.argument );
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
                this.withString('"');
                this.withString( token.value.replace(/\u0022/g,'\\"') );
                this.withString('"');
            break;
            case "TemplateLiteral" :
                const expressions =token.expressions;
                const end = token.quasis.length-1;
                token.quasis.map( (item,index)=>{
                    this.make( item );
                    if(index < expressions.length){
                        this.withString(' + ')
                        this.withParenthesL()
                        this.make( expressions[index] );
                        this.withParenthesR()
                    }
                    if( index < end ){
                        this.withString(' + ');
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
                this.withString('$')
                this.make( token.id );
                if( token.init ){
                    this.withOperator('=');
                    this.make( token.init );
                }
            break;
            case "UsingStatement" :
                this.newLine();
                this.withString('use');
                this.withSpace();
                this.make( token.argument );
                this.withSemicolon();
                this.newLine();
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
            case "EnumDeclaration" :
            case "DeclaratorDeclaration" :
            case "PackageDeclaration" :
            case "Program" :
                token.body.forEach( item=>this.make(item) )
        }
    }

    genClass(token){
        this.withString('<?php');
        this.newLine();
        token.imports.forEach( item=>{
            this.make( item );
        });
        token.using.forEach( item=>{
            this.make( item );
        });

        this.make( token.modifier );
        this.withSpace();
        if( token.abstract ){
            this.make( token.abstract );
            this.withSpace();
        }
        if( token.final ){
            this.make( token.final );
            this.withSpace();
        }
        if( token.type ==="ClassDeclaration" ){
            this.withString('class');
            this.withSpace();
        }
        this.make( token.key );
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
        token.body.forEach( item=>this.make(item) );
        this.endBlock();
        this.newLine();
        this.withBraceR();
    }

    toString(){
        return this.code;
    }
}

module.exports = Generator;