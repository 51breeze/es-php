var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __defNormalProp = (obj, key, value2) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value: value2 }) : obj[key] = value2;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __publicField = (obj, key, value2) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value2);
  return value2;
};

// core/Generator.js
var require_Generator = __commonJS({
  "core/Generator.js"(exports2, module2) {
    var Generator = class {
      constructor(file, sourceMap) {
        this.code = "";
        this.line = 1;
        this.column = 0;
        this.indent = 0;
        this.file = file;
        this.sourceMap = sourceMap;
      }
      addMapping(node) {
        if (this.sourceMap) {
          const loc = node.stack && node.stack.node.loc;
          if (loc) {
            this.sourceMap.addMapping({
              generated: {
                line: this.line,
                column: this.getStartColumn()
              },
              source: this.file,
              original: {
                line: loc.start.line,
                column: loc.start.column
              },
              name: node.type === "Identifier" ? node.value : null
            });
          }
        }
      }
      newBlock() {
        this.indent++;
        return this;
      }
      endBlock() {
        this.indent--;
        return this;
      }
      newLine() {
        const len = this.code.length;
        if (!len)
          return;
        const char = this.code.charCodeAt(len - 1);
        if (char === 10 || char === 13) {
          return this;
        }
        this.line++;
        this.code += "\r\n";
        this.column = 0;
        return this;
      }
      getStartColumn() {
        if (this.column === 0) {
          return this.indent * 4 + 1;
        }
        return this.column;
      }
      withString(value2) {
        if (!value2)
          return;
        if (this.column === 0) {
          this.column = this.getStartColumn();
          this.code += "    ".repeat(this.indent);
        }
        this.code += value2;
        this.column += value2.length;
      }
      withEnd(expr) {
        if (expr) {
          this.withString(expr);
          this.withSemicolon();
        }
        this.newLine();
      }
      withParenthesL() {
        this.withString("(");
      }
      withParenthesR() {
        this.withString(")");
      }
      withBracketL() {
        this.withString("[");
      }
      withBracketR() {
        this.withString("]");
      }
      withBraceL() {
        this.withString("{");
      }
      withBraceR() {
        this.withString("}");
      }
      withSpace() {
        this.withString(" ");
      }
      withDot() {
        this.withString(".");
      }
      withColon() {
        this.withString(":");
      }
      withOperator(value2) {
        this.withString(` ${value2} `);
      }
      withComma() {
        this.withString(",");
      }
      withSemicolon() {
        const code = this.code;
        const char = code.charCodeAt(code.length - 1);
        if (char === 59 || char === 10 || char === 13 || char === 32) {
          return this;
        }
        this.withString(";");
        return this;
      }
      withSequence(items, newLine) {
        if (!items)
          return this;
        const len = items.length - 1;
        items.forEach((item, index) => {
          this.make(item);
          if (index < len) {
            this.withString(",");
            if (newLine || item.newLine)
              this.newLine();
          }
        });
        return this;
      }
      make(token) {
        if (!token)
          return;
        switch (token.type) {
          case "ArrayExpression":
            this.withBracketL();
            if (token.elements.length > 0) {
              if (token.newLine === true) {
                this.newLine();
                this.newBlock();
              }
              this.withSequence(token.elements, !!token.newLine);
              if (token.newLine === true) {
                this.newLine();
                this.endBlock();
              }
            }
            this.withBracketR();
            break;
          case "ArrayPattern":
            this.withString("list");
            this.withParenthesL();
            if (token.elements.length > 0) {
              this.withSequence(token.elements, !!token.newLine);
            }
            this.withParenthesR();
            break;
          case "ArrowFunctionExpression":
            this.withString("function");
            if (token.prefix) {
              this.withSpace();
              this.withString(token.prefix);
            }
            this.withParenthesL();
            this.withSequence(token.params);
            this.withParenthesR();
            if (token.using && token.using.length > 0) {
              this.withString("use");
              this.withParenthesL();
              this.withSequence(token.using);
              this.withParenthesR();
            }
            if (token.body.type === "BlockStatement") {
              this.make(token.body);
            } else {
              this.withBraceL();
              this.newLine();
              this.newBlock();
              this.withString("return");
              this.withSpace();
              this.make(token.body);
              this.withSemicolon();
              this.endBlock();
              this.newLine();
              this.withBraceR();
            }
            break;
          case "AssignmentExpression":
            if (token.restrain) {
              this.withString("@");
            }
          case "AssignmentPattern":
            this.make(token.left);
            this.withString(token.operator || "=");
            this.make(token.right);
            break;
          case "AwaitExpression":
            this.make(token.argument);
            break;
          case "AddressReferenceExpression":
            this.withString("&");
            this.make(token.argument);
            break;
          case "BinaryExpression":
            this.make(token.left);
            this.withOperator(token.operator);
            this.make(token.right);
            break;
          case "BreakStatement":
            this.newLine();
            this.withString("break");
            if (token.label) {
              this.withSpace();
              this.make(token.label);
            }
            this.withSemicolon();
            break;
          case "BlockStatement":
            if (token.isWhenStatement) {
              token.body.forEach((item) => this.make(item));
            } else {
              this.withBraceL();
              this.newBlock();
              token.body.length > 0 && this.newLine();
              token.body.forEach((item) => this.make(item));
              this.endBlock();
              token.body.length > 0 && this.newLine();
              this.withBraceR();
            }
            break;
          case "ChunkExpression":
            if (token.value) {
              if (token.newLine !== false) {
                this.newLine();
              }
              this.withString(token.value);
              const result = token.value.match(/[\r\n]+/g);
              if (result) {
                this.line += result.length;
              }
              if (token.newLine !== false) {
                this.newLine();
              }
            }
            break;
          case "CallExpression":
            this.make(token.callee);
            this.withParenthesL();
            if (token.newLine)
              this.newLine();
            if (token.indentation)
              this.newBlock();
            this.withSequence(token.arguments, token.newLine);
            if (token.indentation)
              this.endBlock();
            if (token.newLine)
              this.newLine();
            this.withParenthesR();
            break;
          case "ConditionalExpression":
            if (token.newLine)
              this.newLine();
            this.make(token.test);
            this.withOperator("?");
            this.make(token.consequent);
            this.withOperator(":");
            this.make(token.alternate);
            if (token.newLine)
              this.newLine();
            break;
          case "ContinueStatement":
            this.newLine();
            this.withString("continue");
            if (token.label) {
              this.withSpace();
              this.make(token.label);
            }
            this.withSemicolon();
            break;
          case "DoWhileStatement":
            this.newLine();
            this.withString("do");
            this.make(token.body);
            this.withString("while");
            this.withParenthesL();
            this.make(token.condition);
            this.withParenthesR();
            this.withSemicolon();
            break;
          case "ExpressionStatement":
            this.newLine();
            this.make(token.expression);
            this.withSemicolon();
            break;
          case "ExportDefaultDeclaration":
            this.newLine();
            this.withString("export default ");
            this.make(token.declaration);
            this.withSemicolon();
            break;
          case "ForInStatement":
            this.newLine();
            this.withString("foreach");
            this.withParenthesL();
            this.make(token.right);
            this.withOperator("as");
            if (token.left) {
              this.make(token.left);
            }
            if (token.value) {
              if (token.left) {
                this.withOperator("=>");
              }
              this.make(token.value);
            } else {
              if (token.left) {
                this.withOperator("=>");
              }
              this.withOperator("$_");
            }
            this.withParenthesR();
            this.make(token.body);
            if (token.body.type !== "BlockStatement") {
              this.withSemicolon();
            }
            break;
          case "ForOfStatement":
            this.newLine();
            this.withString("foreach");
            this.withParenthesL();
            this.make(token.right);
            this.withOperator("as");
            this.make(token.left);
            this.withParenthesR();
            this.make(token.body);
            if (token.body.type !== "BlockStatement") {
              this.withSemicolon();
            }
            break;
          case "ForStatement":
            this.newLine();
            this.withString("for");
            this.withParenthesL();
            this.make(token.init);
            this.withSemicolon();
            this.make(token.condition);
            this.withSemicolon();
            this.make(token.update);
            this.withParenthesR();
            this.make(token.body);
            if (token.body.type !== "BlockStatement") {
              this.withSemicolon();
            }
            break;
          case "FunctionDeclaration":
          case "MethodDefinition":
          case "MethodGetterDefinition":
          case "MethodSetterDefinition":
            this.newLine();
            if (token.final) {
              this.make(token.final);
              this.withSpace();
            }
            if (token.static) {
              this.make(token.static);
              this.withSpace();
            }
            if (token.modifier) {
              this.make(token.modifier);
              this.withSpace();
            }
            this.withString("function");
            if (!token.key.computed) {
              this.withSpace();
              if (token.prefix) {
                this.withString(token.prefix);
              }
              this.make(token.key);
            } else if (token.prefix) {
              this.withSpace();
              this.withString(token.prefix);
            }
            this.withParenthesL();
            this.withSequence(token.params);
            this.withParenthesR();
            if (token.using && token.using.length > 0) {
              this.withString("use");
              this.withParenthesL();
              this.withSequence(token.using);
              this.withParenthesR();
            }
            if (token.isInterfaceMember) {
              this.withSemicolon();
            } else {
              this.make(token.body);
            }
            this.newLine();
            break;
          case "FunctionExpression":
            this.withString("function");
            if (token.prefix) {
              this.withSpace();
              this.withString(token.prefix);
            }
            this.withParenthesL();
            this.withSequence(token.params);
            this.withParenthesR();
            if (token.using && token.using.length > 0) {
              this.withString("use");
              this.withParenthesL();
              this.withSequence(token.using);
              this.withParenthesR();
            }
            this.make(token.body);
            break;
          case "Identifier":
            this.addMapping(token);
            if (token.isVariable) {
              this.withString("$" + token.value);
            } else {
              this.withString(token.value);
            }
            break;
          case "IfStatement":
            if (!token.parent || token.parent.type !== "IfStatement") {
              this.newLine();
            }
            this.withString("if");
            this.withParenthesL();
            this.make(token.condition);
            this.withParenthesR();
            this.make(token.consequent);
            if (token.consequent.type !== "BlockStatement") {
              this.withSemicolon();
              this.newLine();
            }
            if (token.alternate) {
              this.withString("else");
              if (token.alternate.type === "IfStatement" || token.alternate.type !== "BlockStatement") {
                this.withSpace();
              }
              this.make(token.alternate);
              if (token.alternate.type !== "BlockStatement") {
                this.withSemicolon();
                this.newLine();
              }
            }
            break;
          case "ImportDeclaration":
            this.newLine();
            if (token.specifiers.length > 0) {
              token.specifiers.forEach((item) => {
                this.withString("$" + item.local.value);
                this.withString("=");
              });
            }
            this.withString("include_once");
            this.withParenthesL();
            this.make(token.source);
            this.withParenthesR();
            this.withSemicolon();
            this.newLine();
            break;
          case "ImportSpecifier":
            if (token.imported.value !== token.local.value) {
              this.make(token.imported);
              this.withOperator("as");
            }
            this.make(token.local);
            break;
          case "ImportNamespaceSpecifier":
            this.make(token.local);
            break;
          case "ImportDefaultSpecifier":
            this.make(token.local);
            break;
          case "ImportExpression":
            this.withString("import");
            this.withParenthesL();
            this.make(token.source);
            this.withParenthesR();
            break;
          case "LabeledStatement":
            this.newLine();
            this.make(token.body);
            break;
          case "Literal":
            this.withString(token.raw);
            break;
          case "LogicalExpression":
            this.make(token.left);
            this.withOperator(token.operator);
            this.make(token.right);
            break;
          case "MemberExpression":
            this.make(token.object);
            if (token.computed) {
              this.withBracketL();
              this.make(token.property);
              this.withBracketR();
            } else {
              if (token.isStatic) {
                this.withString("::");
              } else {
                this.withString("->");
              }
              if (token.property.type !== "Identifier") {
                this.withBraceL();
                this.make(token.property);
                this.withBraceR();
              } else {
                this.make(token.property);
              }
            }
            break;
          case "NewExpression":
            this.withString("new");
            this.withSpace();
            this.make(token.callee);
            this.withParenthesL();
            this.withSequence(token.arguments);
            this.withParenthesR();
            break;
          case "ObjectExpression":
            this.withBracketL();
            if (token.properties.length > 0) {
              this.newBlock();
              this.newLine();
              this.withSequence(token.properties, true);
              this.newLine();
              this.endBlock();
            }
            this.withBracketR();
            break;
          case "ObjectPattern":
            token.properties.forEach((item, index) => {
              this.make(item);
              if (index < token.properties.length - 1) {
                this.withSemicolon();
              }
            });
            break;
          case "ParenthesizedExpression":
            if (token.newLine)
              this.newLine();
            this.withParenthesL();
            this.make(token.expression);
            this.withParenthesR();
            if (token.newLine)
              this.newLine();
            break;
          case "Property":
            if (token.computed) {
              this.withParenthesL();
              this.make(token.key);
              this.withParenthesR();
            } else {
              this.make(token.key);
            }
            this.withString("=>");
            this.make(token.init);
            break;
          case "JSXAttribute":
            this.withString(`'${token.name.value}'`);
            this.withString("=>");
            this.make(token.value);
            break;
          case "PropertyDefinition":
            this.newLine();
            if (token.static) {
              this.make(token.static);
              this.withSpace();
            }
            if (token.modifier) {
              this.make(token.modifier);
              this.withSpace();
            }
            if (token.kind === "const") {
              this.withString("const");
              this.withSpace();
            } else {
              this.withString("$");
            }
            this.make(token.key);
            this.withString("=");
            this.make(token.init);
            this.withSemicolon();
            this.newLine();
            break;
          case "ParamDeclarator":
            if (token.prefix) {
              this.withString(token.prefix);
              this.withSpace();
            }
            this.make(token.argument);
            break;
          case "RestElement":
            this.withString("...");
            this.withString("$" + token.value);
            break;
          case "ReturnStatement":
            this.newLine();
            this.withString("return");
            if (token.argument) {
              this.withSpace();
              this.make(token.argument);
            }
            this.withSemicolon();
            break;
          case "SequenceExpression":
            this.withSequence(token.expressions);
            break;
          case "SpreadElement":
            this.withString("...");
            this.make(token.argument);
            break;
          case "SuperExpression":
            this.withString("parent");
            break;
          case "SwitchCase":
            this.newLine();
            if (token.condition) {
              this.withString("case");
              this.withSpace();
              this.make(token.condition);
            } else {
              this.withString("default");
            }
            this.withSpace();
            this.withColon();
            this.newBlock();
            token.consequent.forEach((item) => this.make(item));
            this.endBlock();
            break;
          case "SwitchStatement":
            this.newLine();
            this.withString("switch");
            this.withParenthesL();
            this.make(token.condition);
            this.withParenthesR();
            this.withBraceL();
            this.newBlock();
            token.cases.forEach((item) => this.make(item));
            this.newLine();
            this.endBlock();
            this.withBraceR();
            break;
          case "TemplateElement":
            this.withString("'");
            this.withString(token.value.replace(/\u0027/g, "\\'"));
            this.withString("'");
            break;
          case "TemplateLiteral":
            const expressions = token.expressions;
            token.quasis.map((item, index) => {
              const has = item.value;
              if (index > 0) {
                if (has)
                  this.withString(" . ");
              }
              if (has)
                this.make(item);
              if (index < expressions.length) {
                if (has)
                  this.withString(" . ");
                this.withParenthesL();
                this.make(expressions[index]);
                this.withParenthesR();
              }
            });
            break;
          case "ThisExpression":
            this.withString("$this");
            break;
          case "ThrowStatement":
            this.newLine();
            this.withString("throw");
            this.withSpace();
            this.make(token.argument);
            this.withSemicolon();
            break;
          case "TryStatement":
            this.newLine();
            this.withString("try");
            this.make(token.block);
            this.withString("catch");
            this.withParenthesL();
            this.make(token.param);
            this.withParenthesR();
            this.make(token.handler);
            if (token.finally) {
              this.withString("finally");
              this.make(token.finalizer);
            }
            break;
          case "UnaryExpression":
            if (token.prefix) {
              this.withString(token.operator);
              if (![33, 43, 45, 126].includes(token.operator.charCodeAt(0))) {
                this.withSpace();
              }
              this.make(token.argument);
            } else {
              this.make(token.argument);
              this.withSpace();
              this.withString(token.operator);
            }
            break;
          case "UpdateExpression":
            if (token.prefix) {
              this.withString(token.operator);
              this.make(token.argument);
            } else {
              this.make(token.argument);
              this.withString(token.operator);
            }
            break;
          case "VariableDeclaration":
            if (!token.inFor)
              this.newLine();
            this.withSequence(token.declarations);
            if (!token.inFor) {
              this.withSemicolon();
              this.newLine();
            }
            break;
          case "VariableDeclarator":
            if (token.id.type === "ObjectPattern") {
              this.make(token.id);
            } else {
              if (token.id.type !== "ArrayPattern") {
                this.withString("$");
              }
              this.make(token.id);
              if (token.init) {
                this.withOperator("=");
                this.make(token.init);
              }
            }
            break;
          case "UsingStatement":
            this.newLine();
            this.withString("use");
            this.withSpace();
            this.make(token.argument);
            this.withSemicolon();
            this.newLine();
            break;
          case "WhileStatement":
            this.withString("while");
            this.withParenthesL();
            this.make(token.condition);
            this.withParenthesR();
            this.make(token.body);
            if (token.body.type !== "BlockStatement") {
              this.withSemicolon();
            }
            break;
          case "TypeTransformExpression":
            if (token.typeName) {
              this.withParenthesL();
              this.withString(token.typeName);
              this.withParenthesR();
            }
            this.make(token.expression);
            break;
          case "ClassDeclaration":
          case "InterfaceDeclaration":
            this.genClass(token);
            break;
          case "StructTableDeclaration":
            this.genSql(token);
            break;
          case "StructTableMethodDefinition":
            this.make(token.key);
            this.withParenthesL();
            this.withSequence(token.params);
            this.withParenthesR();
            break;
          case "StructTablePropertyDefinition":
            this.make(token.key);
            if (token.init) {
              if (token.assignment) {
                this.withOperator("=");
                this.make(token.init);
              } else {
                this.withString(" ");
                this.make(token.init);
              }
            }
            break;
          case "StructTableKeyDefinition":
            this.make(token.key);
            this.withString(" ");
            if (token.prefix) {
              this.make(token.prefix);
              this.withString(" ");
            }
            this.make(token.local);
            token.properties.forEach((item) => {
              this.withString(" ");
              this.make(item);
            });
            break;
          case "StructTableColumnDefinition":
            this.make(token.key);
            this.withString(" ");
            token.properties.forEach((item, index) => {
              if (index > 0)
                this.withString(" ");
              this.make(item);
            });
            break;
          case "DeclaratorDeclaration":
            this.genDeclarationClass(token);
            break;
          case "EnumDeclaration":
          case "PackageDeclaration":
          case "Program":
            token.body.forEach((item) => this.make(item));
        }
      }
      genDeclarationClass(token) {
        if (token.comment) {
          this.make(token.comment);
          this.newLine();
        }
        if (token.namespace) {
          this.withString("namespace");
          this.withSpace();
          this.make(token.namespace);
          this.withSemicolon();
          this.newLine();
        }
        token.imports.forEach((item) => {
          this.make(item);
        });
        token.using.forEach((item) => {
          this.make(item);
        });
        token.body.forEach((item) => this.make(item));
      }
      genClass(token) {
        if (token.namespace) {
          this.withString("namespace");
          this.withSpace();
          this.make(token.namespace);
          this.withSemicolon();
          this.newLine();
        }
        token.imports.forEach((item) => {
          this.make(item);
        });
        token.using.forEach((item) => {
          this.make(item);
        });
        token.initBeforeBody.forEach((item) => {
          this.make(item);
        });
        this.newLine();
        if (token.abstract) {
          this.make(token.abstract);
          this.withSpace();
        }
        if (token.final) {
          this.make(token.final);
          this.withSpace();
        }
        if (token.type === "InterfaceDeclaration") {
          this.withString("interface");
          this.withSpace();
        } else {
          this.withString("class");
          this.withSpace();
        }
        this.make(token.key);
        if (token.inherit) {
          this.withSpace();
          this.withString("extends");
          this.withSpace();
          this.make(token.inherit);
        }
        if (token.implements && token.implements.length > 0) {
          this.withSpace();
          this.withString("implements");
          this.withSpace();
          this.withSequence(token.implements);
        }
        this.withBraceL();
        this.newBlock();
        this.newLine();
        token.body.forEach((item) => this.make(item));
        this.endBlock();
        this.newLine();
        this.withBraceR();
      }
      genSql(token) {
        this.newLine();
        this.withString("create table");
        this.withString(" ");
        this.make(token.id);
        this.withParenthesL();
        this.newLine();
        this.newBlock();
        token.body.forEach((item, index) => {
          if (item.type === "StructTableKeyDefinition" || item.type === "StructTableColumnDefinition") {
            if (index > 0) {
              this.withComma(",");
              this.newLine();
            }
          }
          this.make(item);
        });
        this.endBlock();
        this.newLine();
        this.withParenthesR();
        token.properties.forEach((item) => this.make(item));
        this.withSemicolon();
        this.newLine();
      }
      toString() {
        return this.code;
      }
    };
    module2.exports = Generator;
  }
});

// core/AddressVariable.js
var require_AddressVariable = __commonJS({
  "core/AddressVariable.js"(exports2, module2) {
    var AddressVariable = class {
      constructor(target, ctx2) {
        this.dataset = /* @__PURE__ */ new Map();
        this.refs = /* @__PURE__ */ new Map();
        this.target = target;
        this.ctx = ctx2;
        this.cross = 0;
        this.last = null;
        this.indexName = null;
      }
      setName(desc2, name2) {
        this.refs.set(desc2, name2);
      }
      getName(desc2) {
        return this.refs.get(desc2);
      }
      hasName(desc2) {
        return this.refs.has(desc2);
      }
      getLastAssignedRef() {
        if (!this.hasCross() && this.last) {
          const name2 = this.getName(this.last.description());
          if (name2) {
            return name2;
          }
        }
        return null;
      }
      createName(description) {
        if (!description)
          return null;
        if (!this.refs.has(description)) {
          const name2 = this.ctx.getDeclareRefsName(description, AddressVariable.REFS_NAME);
          this.setName(description, name2);
          return name2;
        }
        return this.getName(description);
      }
      createIndexName(description) {
        if (!description || !description.isStack)
          return null;
        if (this.indexName === null) {
          const name2 = this.ctx.getDeclareRefsName(description, AddressVariable.REFS_INDEX);
          this.indexName = name2;
        }
        return this.indexName;
      }
      add(value2) {
        if (!value2)
          return;
        if (this.last && this.last.scope !== value2.scope) {
          if (this.last.description() !== value2.description()) {
            this.cross++;
          }
        }
        const index = this.dataset.size;
        this.dataset.set(value2, index);
        this.last = value2;
        return index;
      }
      getIndex(value2) {
        if (!this.dataset.has(value2)) {
          this.add(value2);
        }
        return this.dataset.get(value2);
      }
      hasCross() {
        return this.cross > 0;
      }
    };
    AddressVariable.REFS_NAME = "__ARD";
    AddressVariable.REFS_INDEX = "__ARI";
    module2.exports = AddressVariable;
  }
});

// core/Token.js
var require_Token = __commonJS({
  "core/Token.js"(exports2, module2) {
    var events = require("events");
    var TOP_SCOPE = ["ClassDeclaration", "EnumDeclaration", "DeclaratorDeclaration", "Program"];
    var FUNCTION_SCOPE = ["MethodDefinition", "MethodGetterDefinition", "MethodSetterDefinition", "FunctionExpression", "FunctionDeclaration", "Program"];
    var SCOPE_MAP = /* @__PURE__ */ new Map();
    var DECLARE_REFS = /* @__PURE__ */ new Map();
    var refsParentVariable = /* @__PURE__ */ new Map();
    var assignAddressRef = /* @__PURE__ */ new Map();
    var accessorNamedMaps = /* @__PURE__ */ new Map();
    var AddressVariable = require_AddressVariable();
    var _Token = class extends events.EventEmitter {
      constructor(type) {
        super();
        this.type = type;
        this.stack = null;
        this.scope = null;
        this.compilation = null;
        this.compiler = null;
        this.module = null;
        this.plugin = null;
        this.name = null;
        this.platform = null;
        this.parent = null;
        this.builder = null;
        this.value = "";
        this.raw = "";
      }
      createNode(stack, type) {
        if (!stack)
          return null;
        const nonStack = typeof stack === "string";
        if (!type) {
          type = nonStack ? stack : stack.toString();
        }
        const obj = new _Token(type);
        obj.stack = nonStack ? null : stack;
        obj.scope = nonStack ? this.scope : stack.scope;
        obj.compilation = nonStack ? this.compilation : stack.compilation;
        obj.compiler = nonStack ? this.compiler : stack.compiler;
        obj.module = nonStack ? this.module : stack.module;
        obj.plugin = this.plugin;
        obj.name = this.name;
        obj.platform = this.platform;
        obj.parent = this;
        obj.builder = this.builder;
        return obj;
      }
      createToken(stack) {
        if (!stack)
          return null;
        const type = stack.toString();
        if (type === "TypeStatement")
          return null;
        if (type === "NewDefinition")
          return null;
        if (type === "CallDefinition")
          return null;
        const creator = this.plugin.getTokenNode(type);
        if (creator) {
          try {
            return creator(this, stack, type);
          } catch (e) {
            console.log(e);
          }
        } else {
          throw new Error(`Token class '${stack.toString()}' is not exists.`);
        }
      }
      createFunctionNode(createChildFun, params) {
        const node = this.createNode("FunctionExpression");
        const block = node.createNode("BlockStatement");
        block.body = [];
        node.params = [];
        if (params) {
          params.forEach((item) => {
            item.parent = node;
            node.params.push(item);
          });
        }
        node.body = block;
        createChildFun && createChildFun(block);
        return node;
      }
      createReturnNode(argument) {
        const node = this.createNode("ReturnStatement");
        node.argument = argument;
        argument.parent = node;
        return node;
      }
      createMethodNode(key, createChildFun, params = null, using = null) {
        const node = this.createFunctionNode(createChildFun, params);
        node.type = "MethodDefinition";
        if (key) {
          node.key = key instanceof _Token ? key : node.createIdentifierNode(key);
          node.key.parent = node;
        }
        node.using = using;
        return node;
      }
      createObjectNode(properties, stack) {
        const object = this.createNode("ObjectExpression");
        object.stack = stack;
        object.properties = [];
        if (properties) {
          properties.forEach((value2) => {
            value2.parent = object;
            object.properties.push(value2);
          });
        }
        return object;
      }
      createArrayNode(elements, stack) {
        const object = this.createNode("ArrayExpression");
        object.stack = stack;
        object.elements = [];
        if (elements) {
          elements.forEach((value2) => {
            value2.parent = object;
            object.elements.push(value2);
          });
        }
        return object;
      }
      createPropertyNode(key, init, stack) {
        const propery = this.createNode("Property");
        propery.stack = stack;
        if (key instanceof _Token) {
          key.parent = propery;
          propery.key = key;
          propery.computed = key.computed;
        } else {
          propery.key = propery.createLiteralNode(String(key));
        }
        if (init instanceof _Token) {
          init.parent = propery;
          propery.init = init;
        } else {
          propery.init = propery.createIdentifierNode(String(init));
        }
        return propery;
      }
      createStaticMemberNode(items, stack) {
        const node = this.createMemberNode(items, stack);
        node.isStatic = true;
        return node;
      }
      createTypeTransformNode(typename, expression, createParenthes = false, stack = null) {
        const node = stack ? this.createNode(stack, "TypeTransformExpression") : this.createNode("TypeTransformExpression");
        node.typeName = typename;
        node.expression = expression;
        expression.parent = node;
        if (createParenthes) {
          return this.createParenthesNode(node);
        }
        return node;
      }
      createMemberNode(items, stack, computed = false) {
        const create = (items2, object, ctx2) => {
          const member = ctx2.createNode("MemberExpression");
          if (object instanceof _Token) {
            member.object = object;
          } else {
            member.object = member.createNode("Identifier");
            member.object.value = object;
          }
          const property = items2.shift();
          if (property instanceof _Token) {
            member.property = property;
          } else {
            member.property = member.createNode("Identifier");
            member.property.value = property;
          }
          member.object.parent = ctx2;
          member.property.parent = ctx2;
          if (items2.length > 0) {
            return create(items2, member, member);
          }
          return member;
        };
        items = items.slice(0);
        const node = create(items, items.shift(), this);
        node.stack = stack;
        if (computed) {
          node.computed = true;
        }
        return node;
      }
      createCalleeNode(callee, args2, stack) {
        const expression = this.createNode("CallExpression");
        expression.stack = stack;
        callee.parent = expression;
        expression.callee = callee;
        expression.arguments = [];
        if (args2) {
          args2.forEach((item) => {
            if (item) {
              item.parent = expression;
              expression.arguments.push(item);
            }
          });
        }
        return expression;
      }
      createAssignmentNode(left, right, stack) {
        const expression = this.createNode("AssignmentExpression");
        expression.stack = stack;
        left.parent = expression;
        right.parent = expression;
        expression.left = left;
        expression.right = right;
        return expression;
      }
      creaateAddressRefsNode(argument) {
        const obj = this.createNode("AddressReferenceExpression");
        obj.argument = argument;
        argument.parent = obj;
        return obj;
      }
      createStatementNode(expression, stack) {
        const obj = this.createNode("ExpressionStatement");
        obj.stack = stack;
        expression.parent = obj;
        obj.expression = expression;
        return obj;
      }
      createSequenceNode(items, stack) {
        const obj = this.createNode("SequenceExpression");
        obj.stack = stack;
        obj.expressions = items;
        items.forEach((item) => {
          item.parent = obj;
        });
        return obj;
      }
      createParenthesNode(expression, stack) {
        const obj = this.createNode("ParenthesizedExpression");
        expression.parent = obj;
        obj.stack = stack;
        obj.expression = expression;
        return obj;
      }
      createDeclarationNode(kind, items, stack) {
        const obj = this.createNode("VariableDeclaration");
        obj.stack = stack;
        obj.kind = kind;
        obj.declarations = items;
        items.forEach((item) => {
          item.parent = obj;
        });
        return obj;
      }
      createDeclaratorNode(id2, init, stack) {
        const obj = this.createNode("VariableDeclarator");
        obj.stack = stack;
        obj.id = id2 instanceof _Token ? id2 : obj.createIdentifierNode(id2);
        obj.init = init;
        obj.id.parent = obj;
        if (init) {
          obj.init.parent = obj;
        }
        return obj;
      }
      createLiteralNode(value2, raw, stack) {
        const node = this.createNode("Literal");
        node.stack = stack;
        node.value = value2;
        if (raw === void 0) {
          if (typeof value2 === "string") {
            node.raw = `'${value2}'`;
          } else {
            node.raw = String(value2);
          }
        } else {
          node.raw = String(value2);
        }
        return node;
      }
      createIdentifierNode(value2, stack, isVariable = false) {
        const token = this.createNode("Identifier");
        token.stack = stack;
        token.value = value2;
        token.raw = value2;
        token.isVariable = isVariable;
        return token;
      }
      createClassRefsNode(module3, stack) {
        if (!module3 || !module3.isModule)
          return null;
        const name2 = this.getModuleReferenceName(module3);
        return this.createStaticMemberNode([
          this.createIdentifierNode(name2),
          this.createIdentifierNode("class")
        ], stack);
      }
      createChunkNode(value2, newLine = true, semicolon = false) {
        const node = this.createNode("ChunkExpression");
        node.newLine = newLine;
        node.semicolon = semicolon;
        node.value = value2;
        node.raw = value2;
        return node;
      }
      createThisNode(stack) {
        const node = this.createNode("ThisExpression");
        node.stack = stack;
        return node;
      }
      createConditionalNode(test, consequent, alternate) {
        const node = this.createNode("ConditionalExpression");
        node.test = test;
        node.consequent = consequent;
        node.alternate = alternate;
        test.parent = node;
        consequent.parent = node;
        alternate.parent = node;
        return node;
      }
      createBinaryNode(operator, left, right) {
        const node = this.createNode("BinaryExpression");
        node.operator = operator;
        node.left = left;
        node.right = right;
        left.parent = node;
        right.parent = node;
        return node;
      }
      createNewNode(callee, args2 = []) {
        const node = this.createNode("NewExpression");
        node.callee = callee;
        node.arguments = args2;
        callee.parent = node;
        args2.forEach((item) => item.parent = node);
        return node;
      }
      createUsingStatementNode(specifier) {
        const node = this.createNode("UsingStatement");
        node.argument = specifier;
        specifier.parent = node;
        return node;
      }
      createIfStatement(condition, consequent, alternate) {
        const node = this.createNode("IfStatement");
        node.condition = condition;
        node.consequent = consequent;
        node.alternate = alternate;
        condition.parent = node;
        consequent.parent = node;
        if (alternate) {
          alternate.parent = node;
        }
        return node;
      }
      createTransformBooleanTypeNode(stack, assignName, type, originType, tokenValue) {
        if (stack.isLogicalExpression || stack.isUnaryExpression || stack.isBinaryExpression) {
          return this.createToken(stack);
        }
        if (stack.isParenthesizedExpression) {
          return this.createParenthesNode(
            this.createTransformBooleanTypeNode(
              stack.expression,
              assignName,
              type,
              originType,
              tokenValue
            ),
            stack
          );
        }
        type = type || this.inferType(stack);
        originType = originType || this.builder.getAvailableOriginType(type);
        if (originType && originType.toLowerCase() === "array") {
          let value2 = tokenValue || this.createToken(stack);
          if (assignName) {
            value2 = this.createAssignmentNode(this.createIdentifierNode(assignName, null, true), value2);
          }
          return this.createCalleeNode(this.createIdentifierNode("is_array"), [value2]);
        } else if (type.isAnyType || type.isUnionType || type.isIntersectionType || type.isLiteralObjectType) {
          const system = this.builder.getGlobalModuleById("System");
          this.addDepend(system);
          let value2 = tokenValue || this.createToken(stack);
          if (assignName) {
            value2 = this.createAssignmentNode(this.createIdentifierNode(assignName, null, true), value2);
          }
          return this.createCalleeNode(this.createStaticMemberNode([
            this.createIdentifierNode(this.getModuleReferenceName(system)),
            this.createIdentifierNode("condition")
          ]), [value2]);
        }
        return tokenValue || this.createToken(stack);
      }
      insertNodeBlockContextTop(node) {
        const top = this.getTopBlockContext();
        if (top) {
          top.insertNodeBlockContextAt(node);
        }
      }
      getTopBlockContext() {
        return this.getParentByType((parent) => {
          return TOP_SCOPE.includes(parent.type);
        }, true);
      }
      createImportNode(source, specifiers, stack) {
        const obj = this.createNode("ImportDeclaration");
        obj.stack = stack;
        obj.source = source instanceof _Token ? source : obj.createLiteralNode(source);
        const config = this.plugin.options;
        if (!config.useAbsolutePathImport) {
          const dir = this.createNode("BinaryExpression");
          dir.left = dir.createIdentifierNode("__DIR__");
          dir.right = obj.source;
          dir.operator = ".";
          dir.right.parent = dir;
          obj.source = dir;
        }
        obj.specifiers = [];
        if (specifiers) {
          specifiers.forEach((item) => {
            if (Array.isArray(item)) {
              obj.specifiers.push(obj.createImportSpecifierNode(...item));
            } else if (item instanceof _Token) {
              item.parent = obj;
              obj.specifiers.push(item);
            }
          });
        }
        return obj;
      }
      createImportSpecifierNode(local, imported = null, hasAs = false) {
        if (imported) {
          const obj = this.createNode("ImportSpecifier");
          obj.imported = obj.createIdentifierNode(imported);
          obj.local = obj.createIdentifierNode(local);
          return obj;
        } else if (hasAs) {
          const obj = this.createNode("ImportNamespaceSpecifier");
          obj.local = obj.createIdentifierNode(local);
          return obj;
        } else {
          const obj = this.createNode("ImportDefaultSpecifier");
          obj.local = obj.createIdentifierNode(local);
          return obj;
        }
      }
      createCallReflectScopeNode(module3) {
        if (module3 && module3.isModule) {
          return this.createClassRefsNode(module3);
        }
        return this.createLiteralNode(null);
      }
      createCallReflectPropertyNode(memberStack) {
        return memberStack.computed ? this.createToken(memberStack.property) : this.createLiteralNode(memberStack.property.value());
      }
      createArrayAddressRefsNode(desc2, name2, nameNode) {
        if (!desc2)
          return;
        const assignAddress = desc2.isStack && desc2.assignItems && this.getAssignAddressRef(desc2);
        if (assignAddress) {
          const name3 = assignAddress.getName(desc2);
          const rd = assignAddress.createIndexName(desc2);
          if (rd) {
            return this.createMemberNode([
              this.createIdentifierNode(name3, null, true),
              this.createIdentifierNode(rd, null, true)
            ], null, true);
          }
        }
        return nameNode || this.createIdentifierNode(name2, null, true);
      }
      addVariableRefs(desc2, refsName) {
        if (!desc2 || !desc2.isStack)
          return;
        const name2 = refsName || desc2.value();
        let funScope = this.scope;
        const check = (scope) => {
          if (!scope)
            return;
          if (!scope.declarations.has(name2)) {
            return scope.children.some((child) => {
              return check(child);
            });
          }
          return true;
        };
        while (funScope) {
          const isForContext = funScope.isForContext;
          funScope = isForContext ? funScope.getScopeByType("block") : funScope.getScopeByType("function");
          if (!funScope)
            return;
          if (funScope.isMethod)
            return;
          if (!isForContext && !funScope.type("function"))
            return;
          if (isForContext && !funScope.type("block"))
            return;
          if (!check(funScope)) {
            let dataset = refsParentVariable.get(funScope);
            if (!dataset) {
              dataset = /* @__PURE__ */ new Set();
              refsParentVariable.set(funScope, dataset);
            }
            dataset.add(refsName || desc2);
            if (!refsName && (desc2.isVariableDeclarator || desc2.isParamDeclarator)) {
              const addressRefObject = this.getAssignAddressRef(desc2);
              if (addressRefObject) {
                dataset.add(addressRefObject.createIndexName(desc2));
              }
            }
          }
          funScope = funScope.parent;
        }
      }
      getVariableRefs() {
        const isForContext = this.scope.isForContext;
        const funScope = isForContext ? this.scope.getScopeByType("block") : this.scope.getScopeByType("function");
        return refsParentVariable.get(funScope);
      }
      getAssignAddressRef(desc2) {
        if (!desc2)
          return null;
        return assignAddressRef.get(desc2);
      }
      addAssignAddressRef(desc2, value2) {
        if (!desc2)
          return null;
        var address = assignAddressRef.get(desc2);
        if (!address) {
          address = new AddressVariable(desc2, this);
          assignAddressRef.set(desc2, address);
        }
        if (value2) {
          address.add(value2);
        }
        return address;
      }
      isArrayAddressRefsType(type) {
        if (type) {
          if (type.isUnionType) {
            return type.elements.every((item) => this.isArrayAddressRefsType(item.type()));
          } else if (type.isIntersectionType) {
            return this.isArrayAddressRefsType(type.left.type()) && this.isArrayAddressRefsType(type.right.type());
          }
        }
        return type && (type.isLiteralArrayType || type.isTupleType || type.toString() === "array");
      }
      isArrayMappingType(type) {
        if (!type || !type.isModule)
          return false;
        if (type.dynamicProperties && type.dynamicProperties.size > 0 && this.builder.getGlobalModuleById("Array").is(type)) {
          return type.dynamicProperties.has(this.builder.getGlobalModuleById("String")) || type.dynamicProperties.has(this.builder.getGlobalModuleById("Number"));
        }
        return false;
      }
      isArrayAccessor(type) {
        if (!type)
          return false;
        if (type.isUnionType) {
          if (type.elements.length === 1) {
            return this.isArrayAccessor(type.elements[0].type());
          }
          return type.elements.every((type2) => {
            type2 = type2.type();
            if (type2.isNullableType)
              return true;
            return this.isArrayAccessor(type2);
          });
        } else if (type.isIntersectionType) {
          return [type.left, type.right].every((type2) => this.isArrayAccessor(type2.type()));
        }
        if (type.isInstanceofType) {
          return false;
        } else if (type.isLiteralObjectType || type.isLiteralType || type.isLiteralArrayType || type.isTupleType) {
          return true;
        } else {
          const isWrapType = type.isClassGenericType && type.inherit.isAliasType;
          if (isWrapType) {
            let inherit = type.inherit.type();
            if (this.builder.getGlobalModuleById("ArrayProtector") === inherit) {
              return true;
            } else if (type.types.length > 0) {
              if (this.builder.getGlobalModuleById("RMD") === inherit || this.builder.getGlobalModuleById("ObjectProtector") === inherit) {
                return this.isArrayAccessor(type.types[0].type());
              }
            }
          }
          const raw = this.compiler.callUtils("getOriginType", type);
          if (raw === this.builder.getGlobalModuleById("Array") || this.isArrayMappingType(raw)) {
            return true;
          }
        }
        return false;
      }
      isObjectAccessor(type) {
        if (!type)
          return false;
        if (type.isUnionType) {
          if (type.elements.length === 1) {
            return this.isObjectAccessor(type.elements[0].type());
          }
          return type.elements.every((type2) => {
            type2 = type2.type();
            if (type2.isNullableType)
              return true;
            return this.isObjectAccessor(type2);
          });
        } else if (type.isIntersectionType) {
          return [type.left, type.right].every((type2) => this.isObjectAccessor(type2.type()));
        }
        if (type.isInstanceofType) {
          return true;
        }
        const isWrapType = type.isClassGenericType && type.inherit.isAliasType;
        if (isWrapType) {
          const inherit = type.inherit.type();
          if (type.types.length > 0) {
            if (this.builder.getGlobalModuleById("RMD") === inherit || this.builder.getGlobalModuleById("ArrayProtector") === inherit) {
              return this.isObjectAccessor(type.types[0].type());
            }
          }
          return this.builder.getGlobalModuleById("ObjectProtector") === inherit;
        }
        return false;
      }
      isPassableReferenceExpress(stack, type) {
        if (!stack || !stack.isStack)
          return false;
        if (stack.isLiteral || stack.isArrayExpression || stack.isObjectExpression)
          return false;
        if (stack.isThisExpression || stack.isTypeTransformExpression)
          return false;
        if (type) {
          return this.isAddressRefsType(type, stack);
        }
        return true;
      }
      isAddressRefsType(type, stack) {
        const verify = (type2) => {
          if (type2 && type2.isClassGenericType && type2.inherit.isAliasType) {
            const inheritType = type2.inherit.type();
            if (inheritType === this.builder.getGlobalModuleById("RMD")) {
              return true;
            } else if (type2.types.length > 0 && (inheritType === this.builder.getGlobalModuleById("ArrayProtector") || inheritType === this.builder.getGlobalModuleById("ObjectProtector"))) {
              return verify(type2.types[0].type());
            }
          }
        };
        if (verify(type)) {
          return true;
        }
        const result = this.isArrayAddressRefsType(type);
        if (!result)
          return false;
        if (!stack || !stack.isStack)
          return result;
        if (stack.isArrayExpression) {
          return true;
        }
        const check = (stack2, type2) => {
          if (type2) {
            if (verify(type2)) {
              return true;
            }
            if (!this.isArrayAddressRefsType(type2))
              return false;
          }
          if (stack2.isIdentifier || stack2.isVariableDeclarator || stack2.isParamDeclarator)
            return true;
          if (stack2.isMethodDefinition && stack2.expression) {
            stack2 = stack2.expression;
          }
          if (stack2.isFunctionExpression) {
            const fnScope = stack2.scope.getScopeByType("function");
            const returnItems = fnScope.returnItems;
            if (returnItems && returnItems.length > 0) {
              return returnItems.every((item) => {
                return item.isReturnStatement && check(item.argument, item.argument.type());
              });
            }
          } else if (stack2.isCallExpression) {
            let desc2 = stack2.description();
            if (desc2) {
              if (desc2.isFunctionType) {
                desc2 = desc2.target && desc2.target.isFunctionExpression ? desc2.target : null;
              }
              if (desc2 && (desc2.isFunctionExpression || desc2.isMethodDefinition)) {
                return check(desc2, stack2.type());
              }
            }
          } else if (stack2.isMemberExpression) {
            let desc2 = stack2.description();
            if (desc2 && (desc2.isPropertyDefinition || desc2.isVariableDeclarator || desc2.isParamDeclarator)) {
              return true;
            } else if (desc2 && desc2.isProperty && desc2.hasInit && desc2.init) {
              return check(desc2.init);
            } else if (desc2 && desc2.isMethodGetterDefinition) {
              return check(desc2);
            } else {
              return true;
            }
          } else if (stack2.isLogicalExpression) {
            const isAnd = stack2.node.operator.charCodeAt(0) === 38;
            if (isAnd) {
              return check(stack2.right, stack2.right.type());
            } else {
              return check(stack2.left, stack2.left.type()) || check(stack2.right, stack2.right.type());
            }
          } else if (stack2.isConditionalExpression) {
            return check(stack2.consequent, stack2.consequent.type()) || check(stack2.alternate, stack2.alternate.type());
          }
          return false;
        };
        return check(stack);
      }
      hasCrossScopeAssignment(assignmentSet, inFor) {
        if (!assignmentSet)
          return false;
        if (inFor)
          return assignmentSet.size > 0;
        return assignmentSet.size > 1;
      }
      hasCrossDescriptionAssignment(assignmentSet, desc2) {
        if (!assignmentSet)
          return false;
        if (assignmentSet.size < 1)
          return false;
        const items = Array.from(assignmentSet.values());
        return items.every((item) => {
          const d = item.isStack ? item.description() : item;
          return d !== desc2;
        });
      }
      addDepend(dep) {
        this.builder.addDepend(dep, this.module || this.compilation);
      }
      getDependencies(module3) {
        return this.builder.getDependencies(module3 || this.module || this.compilation);
      }
      isActiveForModule(module3, ctxModule, flag = false) {
        if (this.builder.isActiveForModule(module3, ctxModule || this.module || this.compilation)) {
          return true;
        }
        if (flag) {
          return this.isReferenceDeclaratorModule(module3, ctxModule);
        }
        return false;
      }
      isReferenceDeclaratorModule(depModule, ctxModule) {
        return this.builder.isReferenceDeclaratorModule(depModule, ctxModule || this.module || this.compilation);
      }
      getParentByType(type, flag = false) {
        var parent = flag ? this : this.parent;
        var invoke = typeof type === "function" ? type : (item) => item.type === type;
        while (parent && !invoke(parent)) {
          parent = parent.parent;
        }
        return parent;
      }
      insertNodeBlockContextAt(node) {
        const block = this.getParentByType((parent) => {
          return parent.type === "BlockStatement" || parent.type === "FunctionExpression" || TOP_SCOPE.includes(parent.type);
        }, true);
        if (block) {
          if (!(node.type === "ExpressionStatement" || node.type === "VariableDeclaration")) {
            node = this.createStatementNode(node);
          }
          node.parent = block;
          block.body.push(node);
          return true;
        }
        return false;
      }
      checkRefsName(name2, top = false, flags = _Token.SCOPE_REFS_DOWN | _Token.SCOPE_REFS_UP_FUN, context = null, initInvoke = null) {
        const ctx2 = context || this.getParentByType((parent) => {
          if (top) {
            return TOP_SCOPE.includes(parent.type);
          } else {
            return FUNCTION_SCOPE.includes(parent.type);
          }
        }, true);
        if (!ctx2) {
          return name2;
        }
        if (top)
          flags = _Token.SCOPE_REFS_All;
        const scope = context && context.scope || this.scope;
        const fnScope = top ? scope.getScopeByType("top") : scope.getScopeByType("function");
        const key = fnScope ? fnScope : scope;
        const cache = SCOPE_MAP;
        var dataset = cache.get(key);
        if (!dataset) {
          cache.set(key, dataset = {
            scope,
            result: /* @__PURE__ */ new Set(),
            check(name3, scope2) {
              if (this.result.has(name3))
                return true;
              if (flags === _Token.SCOPE_REFS_All) {
                return scope2.topDeclarations.has(name3);
              }
              if (scope2.isDefine(name3)) {
                return true;
              }
              var index2 = 0;
              var flag = 0;
              while (flag < (flags & _Token.SCOPE_REFS_All)) {
                flag = Math.pow(2, index2++);
                switch (flags & flag) {
                  case _Token.SCOPE_REFS_DOWN:
                    if (scope2.declarations.has(name3) || scope2.hasChildDeclared(name3))
                      return true;
                  case _Token.SCOPE_REFS_UP:
                    if (scope2.isDefine(name3))
                      return true;
                  case _Token.SCOPE_REFS_TOP:
                    if (scope2.isDefine(name3) || scope2.hasChildDeclared(name3))
                      return true;
                  case _Token.SCOPE_REFS_UP_FUN:
                    if (scope2.isDefine(name3, "function"))
                      return true;
                  case _Token.SCOPE_REFS_UP_CLASS:
                    if (scope2.isDefine(name3, "class"))
                      return true;
                }
              }
              return false;
            }
          });
        }
        const isTokenCtx = ctx2 instanceof _Token;
        var body = isTokenCtx ? ctx2.beforeBody || ctx2.body : null;
        var block = isTokenCtx ? ctx2 : null;
        if (body && body.type === "BlockStatement") {
          block = body;
          body = body.body;
        }
        if (dataset.check(name2, scope)) {
          var index = 1;
          while (dataset.check(name2 + index, scope) && index++)
            ;
          var value2 = name2 + index;
          dataset.result.add(value2);
          if (isTokenCtx) {
            const event = { name: name2, value: value2, top, context: ctx2, scope, prevent: false };
            ctx2.emit("onCreateRefsName", event);
            if (block && !event.prevent) {
              let init2 = null;
              if (initInvoke) {
                init2 = initInvoke(value2, name2);
              }
              if (init2) {
                body.push(block.createDeclarationNode("const", [
                  block.createDeclaratorNode(
                    block.createIdentifierNode(value2),
                    init2
                  )
                ]));
              }
            }
          }
          return value2;
        } else if (!top) {
          dataset.result.add(name2);
          if (initInvoke && block) {
            var init = initInvoke(name2, name2);
            if (init) {
              body.push(block.createDeclarationNode("const", [
                block.createDeclaratorNode(
                  block.createIdentifierNode(name2),
                  init
                )
              ]));
            }
          }
        }
        return name2;
      }
      getDeclareRefsName(desc2, name2, flags = _Token.SCOPE_REFS_DOWN | _Token.SCOPE_REFS_UP_FUN, initInvoke = null, context = null) {
        if (!desc2)
          return name2;
        var cache = DECLARE_REFS.get(desc2);
        if (!cache)
          DECLARE_REFS.set(desc2, cache = {});
        if (Object.prototype.hasOwnProperty.call(cache, name2)) {
          return cache[name2];
        }
        return cache[name2] = this.checkRefsName(name2, false, flags, context, initInvoke);
      }
      getWasRefsName(desc2, name2) {
        var cache = DECLARE_REFS.get(desc2);
        if (cache) {
          return cache[name2];
        }
        return null;
      }
      getModuleReferenceName(module3, context) {
        context = context || this.module;
        if (!context && !this.compilation.mainModule) {
          const imports = this.compilation.stack.imports;
          if (imports.length > 0) {
            const importStack = imports.find((stack) => stack.description() === module3);
            if (importStack) {
              if (importStack.alias) {
                return importStack.alias.value();
              }
              return module3.id;
            }
          }
        }
        return this.builder.getModuleReferenceName(module3, context);
      }
      inferType(stack, context) {
        if (!stack)
          return stack;
        if (stack.isStack) {
          if (!context)
            context = stack.getContext();
        }
        if (context) {
          return context.apply(stack.type());
        }
        return stack;
      }
      getAccessorName(name2, desc2, accessor = "get") {
        const prefix = accessor;
        const suffix = name2.substr(0, 1).toUpperCase() + name2.substr(1);
        var key = prefix + suffix;
        if (desc2 && desc2.isStack && desc2.module) {
          const module3 = desc2.module;
          const isStatic = !!(desc2.static || module3.static);
          var dataset = accessorNamedMaps.get(module3);
          if (!dataset) {
            accessorNamedMaps.set(module3, dataset = {});
          } else if (dataset[key]) {
            return dataset[key];
          }
          var index = 1;
          var value2 = key;
          while (true) {
            const has = isStatic ? module3.getMethod(value2) : module3.getMember(value2);
            if (!has)
              break;
            value2 = key + index++;
          }
          dataset[key] = value2;
          return value2;
        }
        return key;
      }
      error(message, stack = null) {
        if (stack === null) {
          stack = this.stack;
        }
        const range = this.compilation.getRangeByNode(stack.node);
        const file = this.compilation.file;
        message += ` (${file}:${range.start.line}:${range.start.column})`;
        this.compiler.callUtils("error", message);
      }
      warn(message, stack = null) {
        if (stack === null) {
          stack = this.stack;
        }
        const range = this.compilation.getRangeByNode(stack.node);
        const file = this.compilation.file;
        message += ` (${file}:${range.start.line}:${range.start.column})`;
        this.compiler.callUtils("warn", message);
      }
    };
    var Token2 = _Token;
    __publicField(Token2, "SCOPE_REFS_All", 31);
    __publicField(Token2, "SCOPE_REFS_TOP", 16);
    __publicField(Token2, "SCOPE_REFS_UP_CLASS", 8);
    __publicField(Token2, "SCOPE_REFS_UP_FUN", 4);
    __publicField(Token2, "SCOPE_REFS_UP", 2);
    __publicField(Token2, "SCOPE_REFS_DOWN", 1);
    module2.exports = Token2;
  }
});

// core/Polyfill.js
var require_Polyfill = __commonJS({
  "core/Polyfill.js"(exports2, module2) {
    var fs = require("fs");
    var path3 = require("path");
    var modules2 = /* @__PURE__ */ new Map();
    var dirname = true ? path3.join(__dirname, "polyfills") : path3.join(__dirname, "../", "polyfill");
    var parseModule = (modules3, file, name2) => {
      const info = path3.parse(name2);
      let content = fs.readFileSync(file).toString();
      let exportName = info.name;
      let require2 = [];
      let namespace = null;
      let requires = /* @__PURE__ */ new Map();
      let createClass = true;
      content = content.replace(/^([\s\r\n]+)?\<\?php([\s\r\n]+)?/, "");
      let comment = /\/\*(.*?)\*\//s.exec(content);
      if (comment) {
        content = content.substring(comment.index + comment[0].length);
        comment = comment[0];
      }
      content = content.replace(/([\r\n\s]+)?\/\/\/[\s+]?<(references|namespaces|export|import|createClass)\s+(.*?)\/>\s+?/g, function(_2, a, b, c) {
        const items = c.trim().replace(/[\s+]?=[\s+]?/g, "=").split(/\s+/g);
        const attr = {};
        items.forEach((item) => {
          const [key, value2] = item.replace(/[\'\"]/g, "").trim().split("=");
          attr[key] = value2;
        });
        switch (b) {
          case "references":
            if (attr["from"]) {
              require2.push(attr["from"]);
            }
            break;
          case "namespaces":
            if (attr["name"]) {
              namespace = attr["name"];
            }
            break;
          case "export":
            if (attr["name"]) {
              exportName = attr["name"];
            }
            break;
          case "import":
            if (attr["from"]) {
              const name3 = attr["to"] || attr["name"];
              requires.set(name3, { key: name3, value: name3, from: attr["from"], extract: !!attr["extract"] });
            }
            break;
          case "createClass":
            if (attr["value"]) {
              createClass = attr["value"] !== "false";
            }
            break;
        }
        return "";
      });
      var id2 = namespace ? `${namespace}.${info.name}` : info.name;
      modules3.set(id2, {
        id: info.name,
        content,
        export: exportName,
        comment,
        createClass,
        require: require2,
        requires,
        namespace
      });
    };
    function createEveryModule(modules3, dirname2) {
      if (!fs.existsSync(dirname2))
        return;
      fs.readdirSync(dirname2).forEach((filename) => {
        const filepath = path3.join(dirname2, filename);
        if (fs.statSync(filepath).isFile()) {
          parseModule(modules3, filepath, filename);
        } else if (fs.statSync(filepath).isDirectory()) {
          createEveryModule(modules3, filepath);
        }
      });
    }
    createEveryModule(modules2, dirname);
    module2.exports = {
      path: dirname,
      modules: modules2,
      createEveryModule
    };
  }
});

// core/Router.js
var require_Router = __commonJS({
  "core/Router.js"(exports2, module2) {
    var Router2 = class {
      constructor() {
        this.dataset = /* @__PURE__ */ new Map();
        this.cached = {};
        this.builder = null;
      }
      getFileObject(file) {
        var object = this.dataset.get(file);
        if (!object) {
          object = { file, items: [], change: false };
          this.dataset.set(file, object);
        }
        return object;
      }
      addItem(file, className, action, path3, method, params) {
        while (path3.charCodeAt(0) === 47) {
          path3 = path3.substring(1);
        }
        const item = { className, action, path: path3, method, params };
        const cacheKey = [path3].concat((params || []).map((item2) => item2.name)).join("-");
        const cacheValue = [className, "::", action, "/", cacheKey, ":", method].join("");
        const old = this.cached[cacheKey];
        if (old) {
          if (old === cacheValue)
            return true;
          if (!old.includes(className))
            return false;
        }
        const object = this.getFileObject(file);
        object.items.push(item);
        object.change = true;
        this.cached[cacheKey] = cacheValue;
      }
      create(filename = "route.php") {
        const dataset = [];
        this.dataset.forEach((object) => {
          if (object.change) {
            dataset.push(this.make(object, filename));
          }
        });
        return dataset;
      }
      make(object) {
        const filename = "route.php";
        object.change = false;
        return { file: filename, content: null };
      }
    };
    module2.exports = Router2;
  }
});

// core/Sql.js
var require_Sql = __commonJS({
  "core/Sql.js"(exports2, module2) {
    var Generator = require_Generator();
    var Sql2 = class {
      constructor() {
        this.dataset = /* @__PURE__ */ new Map();
        this.builder = null;
      }
      addTable(file, node, stack) {
        this.dataset.set(file, { node, stack });
      }
      has(file) {
        return this.dataset.has(file);
      }
      toString() {
        const dataset = [];
        this.dataset.forEach((object) => {
          const gen = new Generator(object.stack.file);
          gen.builder = this.builder;
          gen.make(object.node);
          const code = gen ? gen.toString() : "";
          dataset.push(code);
        });
        return dataset.join("\r\n");
      }
    };
    module2.exports = Sql2;
  }
});

// core/Assets.js
var require_Assets = __commonJS({
  "core/Assets.js"(exports2, module2) {
    var PATH = require("path");
    var crypto = require("crypto");
    var merge2 = require("lodash/merge");
    var fs = require("fs-extra");
    var suffixMaps = {
      ".less": ".css",
      ".sacc": ".css",
      ".scss": ".css"
    };
    var Asset = class {
      constructor(file, source, local, module3, context) {
        this.file = file;
        this.source = source;
        this.local = local;
        this.module = module3;
        this.context = context;
        this.content = "";
        this.change = true;
        this.format = "[name]-[hash][ext]";
        this.extname = "";
        if (file) {
          const ext = PATH.extname(file);
          if (ext) {
            this.extname = ext;
          }
        }
      }
      emit(done) {
        if (this.change) {
          this.change = false;
          const output = this.context.getOutputPath();
          const file = PATH.join(output, this.getOutputFilePath());
          fs.mkdirSync(PATH.dirname(file), { recursive: true });
          const ext = this.getExt();
          if (ext === ".less") {
            this.lessCompile(done, file);
          } else if (ext === ".sass") {
            this.sassCompile(done, file);
          } else if (ext === ".js" || ext === ".es") {
            this.jsCompile(done, file);
          } else {
            if (this.content) {
              fs.writeFileSync(file, this.content);
            } else if (fs.existsSync(this.file)) {
              fs.copyFileSync(this.file, file);
            }
            if (done)
              done();
          }
        }
      }
      lessCompile(done, filename) {
        const less = require("less");
        const options = merge2({ filename: this.file }, this.context.plugin.options.lessOptions);
        const content = this.content || fs.readFileSync(this.file).toString();
        less.render(content, options, (e, output) => {
          if (e) {
            done(e);
          } else {
            fs.writeFile(filename, output.css, done);
          }
        });
      }
      sassCompile(done, filename) {
        const sass = require("node-sass");
        const options = merge2({}, this.context.plugin.options.sassOptions);
        const content = this.content || fs.readFileSync(this.file).toString();
        options.file = this.file;
        options.data = content;
        sass.render(options, (e, output) => {
          if (e) {
            done(e);
          } else {
            fs.writeFile(filename, output.css, done);
          }
        });
      }
      jsCompile(done, filename) {
        const rollup = require("rollup");
        const options = merge2({
          input: {
            plugins: [],
            watch: false
          },
          output: {
            format: "cjs"
          }
        }, this.context.plugin.options.rollupOptions);
        const plugins = [
          "rollup-plugin-node-resolve",
          "rollup-plugin-commonjs"
        ].map((nam) => {
          try {
            const file = require.resolve(nam);
            const plugin = require(file);
            return plugin();
          } catch (e) {
            return null;
          }
        }).filter((plugin) => plugin && !options.input.plugins.some((item) => {
          return item.name === plugin.name;
        }));
        options.input.plugins.push(...plugins);
        options.input.input = this.content || this.file;
        options.output.file = filename;
        rollup.rollup(options.input).then((bundle) => {
          bundle.write(options.output).finally(done);
        }).catch(done);
      }
      setContent(content) {
        if (content !== this.content) {
          this.change = true;
          this.content = content;
        }
      }
      getExt() {
        return this.extname;
      }
      getOutputFilePath() {
        if (this.assetOutputFile)
          return this.assetOutputFile;
        const publicPath = (this.context.plugin.options.publicPath || "").trim();
        let folder = this.getFolder();
        if (publicPath && !PATH.isAbsolute(folder)) {
          folder = PATH.join(publicPath, folder);
        }
        const ext = this.getExt();
        const data2 = {
          name: this.getFilename(),
          hash: this.getHash(),
          ext: suffixMaps[ext] || ext
        };
        let file = this.format.replace(/\[(\w+)\]/g, (_2, name2) => {
          return data2[name2] || "";
        });
        file = PATH.join(folder, file);
        return this.assetOutputFile = this.context.compiler.normalizePath(PATH.isAbsolute(file) ? PATH.relative(this.context.getOutputPath(), file) : file);
      }
      getFilename() {
        if (this.filename)
          return this.filename;
        let name2 = this.module ? this.module.id : "";
        if (PATH.isAbsolute(this.file)) {
          name2 = PATH.basename(this.file, PATH.extname(this.file));
        } else {
          name2 = PATH.extname(this.file).slice(1);
        }
        return this.filename = String(name2).toLowerCase();
      }
      getHash() {
        if (this.hash)
          return this.hash;
        return this.hash = crypto.createHash("md5").update(this.file).digest("hex").substring(0, 8);
      }
      getFolder() {
        if (this.folder)
          return this.folder;
        return this.folder = this.context.resolveSourceFileMappingPath(this.file) || ".";
      }
      getAssetFilePath() {
        return this.file;
      }
      toString() {
        if (this.content) {
          return this.content;
        } else if (fs.existsSync(this.file)) {
          return fs.readFileSync(this.file).toString();
        }
        return "";
      }
    };
    var Assets2 = class {
      constructor() {
        this.dataset = /* @__PURE__ */ new Map();
        this.context = null;
      }
      setContext(ctx2) {
        this.context = ctx2;
      }
      emit(done) {
        const queues = Array.from(this.dataset.values()).filter((asset) => asset.change).map((asset) => new Promise((resolve, reject) => {
          asset.emit((error) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          });
        }));
        Promise.all(queues).then((results) => {
          if (done && results.length === queues.length) {
            const errors = results.filter((error) => !!error);
            done(errors.length > 0 ? errors : null);
          }
        }).catch((e) => {
          done(e);
        });
      }
      create(resolve, source, local, module3) {
        if (!this.dataset.has(resolve)) {
          const asset = new Asset(resolve, source, local, module3);
          asset.context = this.context;
          this.dataset.set(resolve, asset);
          return asset;
        }
        return this.dataset.get(resolve);
      }
      getAsset(resolve) {
        return this.dataset.get(resolve);
      }
    };
    module2.exports = new Assets2();
  }
});

// core/Builder.js
var require_Builder = __commonJS({
  "core/Builder.js"(exports2, module2) {
    var fs = require("fs-extra");
    var crypto = require("crypto");
    var Generator = require_Generator();
    var Token2 = require_Token();
    var Polyfill2 = require_Polyfill();
    var PATH = require("path");
    var Router2 = require_Router();
    var Sql2 = require_Sql();
    var staticAssets = require_Assets();
    var moduleDependencies = /* @__PURE__ */ new Map();
    var moduleIdMap = /* @__PURE__ */ new Map();
    var namespaceMap = /* @__PURE__ */ new Map();
    var createAstStackCached = /* @__PURE__ */ new WeakSet();
    var composerDependencies = /* @__PURE__ */ new Map();
    var outputAbsolutePathCached = /* @__PURE__ */ new Map();
    var resolveModuleTypeCached = /* @__PURE__ */ new Map();
    var fileAndNamespaceMappingCached = /* @__PURE__ */ new Map();
    var routerInstance = new Router2();
    var sqlInstance = new Sql2();
    var fileContextScopes = /* @__PURE__ */ new Map();
    var privateKey = Symbol("key");
    var _Builder = class extends Token2 {
      constructor(compilation) {
        super(null);
        this.scope = compilation.scope;
        this.compilation = compilation;
        this.compiler = compilation.compiler;
        this.builder = this;
        this.plugin = null;
        this.name = null;
        this.platform = null;
        this.buildModules = /* @__PURE__ */ new Set();
        this.staticAssets = staticAssets;
        this.fileContextScopes = fileContextScopes;
        staticAssets.setContext(this);
        sqlInstance.builder = this;
        routerInstance.builder = this;
        this.esSuffix = new RegExp(this.compiler.options.suffix.replace(".", "\\") + "$", "i");
        this.checkRuntimeCache = /* @__PURE__ */ new Map();
        this.checkPluginContextCache = /* @__PURE__ */ new Map();
      }
      createScopeId(context, source) {
        if (!context || !source || !context.file)
          return null;
        const file = context.isModule ? context.file + "?id=" + context.getName() : context.file;
        const key = context.isModule ? file + "&scope=" + source : file + "?scope=" + source;
        let dataset = this.fileContextScopes.get(context);
        if (!dataset)
          this.fileContextScopes.set(dataset = {});
        if (dataset[key]) {
          return dataset[key];
        }
        return dataset[key] = String(this.createHash(key));
      }
      createHash(str) {
        return crypto.createHash("md5").update(str).digest("hex").substring(0, 8);
      }
      addSqlTableNode(id2, node, stack) {
        sqlInstance.addTable(id2, node, stack);
      }
      hasSqlTableNode(id2) {
        return sqlInstance.has(id2);
      }
      getRouterInstance() {
        return routerInstance;
      }
      addFileAndNamespaceMapping(file, namespace) {
        if (namespace && file) {
          fileAndNamespaceMappingCached.set(file, namespace);
        }
      }
      addRouterConfig(module3, method, path3, action, params) {
        const outputFolder = this.resolveSourceFileMappingPath(PATH.dirname(module3.file) + "/" + module3.id + ".route", "folders");
        if (!outputFolder)
          return;
        const className = this.getModuleNamespace(module3, module3.id, false);
        this.getRouterInstance().addItem(PATH.join(this.getOutputPath(), outputFolder), className, action, path3, method, params);
      }
      addDependencyForComposer(identifier, version, env = "prod") {
        composerDependencies.set(identifier, { name: identifier, version, env });
      }
      emitPackageDependencies() {
        const items = Array.from(composerDependencies.values());
        const output = this.getComposerPath();
        const jsonFile = PATH.join(output, "composer.json");
        const object = fs.existsSync(jsonFile) ? require(jsonFile) : {};
        items.forEach((item) => {
          const key = item.env === "prod" ? "require-dev" : "require";
          if (!Object.prototype.hasOwnProperty(object, key)) {
            object[key] = {};
          }
          object[key][item.name] = item.version;
        });
        if (output) {
          this.emitFile(jsonFile, JSON.stringify(object));
        }
      }
      emitManifest() {
        if (fileAndNamespaceMappingCached.size > 0) {
          const items = [];
          const root = this.plugin.options.resolve.mapping.folder.root;
          const file = PATH.isAbsolute(root) ? root : PATH.join(this.getOutputPath(), root, "manifest.php");
          fileAndNamespaceMappingCached.forEach((ns, file2) => {
            items.push(`'${ns}'=>'${file2}'`);
          });
          this.emitFile(file, `return [\r
	${items.join(",\r\n	")}\r
];`);
        }
      }
      emitSql() {
        const file = PATH.join(this.getOutputPath(), "app.sql");
        this.emitFile(file, sqlInstance.toString());
      }
      getOutputPath() {
        const value2 = this.__outputPath;
        if (value2)
          return value2;
        return this.__outputPath = this.compiler.pathAbsolute(this.plugin.options.output || this.compiler.options.output);
      }
      getComposerPath() {
        return this.compiler.pathAbsolute(this.plugin.options.composer || this.plugin.options.output || this.compiler.options.output);
      }
      emitAssets() {
        staticAssets.emit(this.getOutputPath());
      }
      emitContent(file, content, output = null) {
        this.plugin.generatedCodeMaps.set(file, content);
        if (output) {
          this.emitFile(output, content);
        }
      }
      emitFile(file, content) {
        if (content === null)
          return;
        fs.mkdirSync(PATH.dirname(file), { recursive: true });
        if (file.endsWith(".php")) {
          if (this.plugin.options.strict) {
            fs.writeFileSync(file, "<?php\r\ndeclare (strict_types = 1);\r\n" + content);
          } else {
            fs.writeFileSync(file, "<?php\r\n" + content);
          }
        } else {
          fs.writeFileSync(file, content);
        }
      }
      emitCopyFile(from, to) {
        fs.createReadStream(from).pipe(fs.createWriteStream(to));
      }
      buildForModule(compilation, stack, module3) {
        if (!this.make(compilation, stack, module3))
          return;
        this.getDependencies(module3).forEach((depModule) => {
          if (this.isNeedBuild(depModule, module3) && !this.buildModules.has(depModule)) {
            this.buildModules.add(depModule);
            const compilation2 = depModule.compilation;
            if (depModule.isDeclaratorModule) {
              const stack2 = compilation2.getStackByModule(depModule);
              if (stack2) {
                this.buildForModule(compilation2, stack2, depModule);
              } else {
                throw new Error(`Not found stack by '${depModule.getName()}'`);
              }
            } else {
              this.buildForModule(compilation2, compilation2.stack, depModule);
            }
          }
        });
      }
      async buildIncludes() {
        const includes = this.plugin.options.includes || [];
        const files = [];
        const push = (file, readdir) => {
          if (!file)
            return;
          if (fs.existsSync(file)) {
            const stat = fs.statSync(file);
            if (stat.isFile()) {
              files.push(file);
            } else if (readdir && stat.isDirectory()) {
              resolve(file, readdir);
            }
          }
        };
        const resolve = (file, readdir) => {
          if (file.endsWith("*")) {
            const resolveFile = this.compiler.getFileAbsolute(PATH.dirname(file), null, false);
            if (!resolveFile)
              return;
            readdir = readdir || file.endsWith("**");
            (this.compiler.callUtils("readdir", resolveFile, true) || []).forEach((file2) => {
              push(file2, !!readdir);
            });
          } else {
            const resolveFile = this.compiler.getFileAbsolute(file, null, false);
            push(resolveFile, !!readdir);
          }
        };
        includes.forEach((file) => resolve(file));
        await Promise.allSettled(files.map(async (file) => {
          if (!this.esSuffix.test(file))
            return;
          const compilation = await this.compiler.createCompilation(file, null, true);
          if (compilation && !compilation.completed(this.plugin)) {
            await compilation.parserAsync();
            if (compilation.isDescriptorDocument()) {
              compilation.modules.forEach((module3) => {
                const stack = compilation.getStackByModule(module3);
                if (stack) {
                  this.buildForModule(compilation, stack, module3);
                }
              });
            } else {
              if (compilation.modules.size > 0) {
                this.buildForModule(compilation, compilation.stack, compilation.mainModule || Array.from(compilation.modules.values()).shift());
              } else {
                this.buildForModule(compilation, compilation.stack);
              }
            }
            compilation.completed(this.plugin, true);
          } else if (!compilation) {
            this.emitCopyFile(file, this.getOutputAbsolutePath(file));
          }
        }));
      }
      async start(done) {
        try {
          const compilation = this.compilation;
          if (compilation.isDescriptorDocument()) {
            compilation.modules.forEach((module3) => {
              const stack = compilation.getStackByModule(module3);
              if (stack) {
                this.buildForModule(compilation, stack, module3);
              }
            });
          } else {
            if (compilation.isCompilationGroup) {
              compilation.children.forEach((compilation2) => {
                this.buildForModule(compilation2, compilation2.stack, compilation2.mainModule || Array.from(compilation2.modules.values()).shift());
              });
            } else {
              this.buildForModule(compilation, compilation.stack, compilation.mainModule || Array.from(compilation.modules.values()).shift());
            }
          }
          await this.buildIncludes();
          this.buildModules.forEach((module3) => {
            module3.compilation.completed(this.plugin, true);
          });
          this.getRouterInstance().create().forEach((item) => {
            this.emitFile(item.file, item.content);
          });
          this.emitSql();
          this.emitManifest();
          staticAssets.emit((error) => {
            compilation.completed(this.plugin, true);
            done(error ? error : null);
          });
        } catch (e) {
          done(e);
        }
      }
      async build(done) {
        const compilation = this.compilation;
        if (compilation.completed(this.plugin)) {
          return done(null, this);
        }
        try {
          compilation.completed(this.plugin, false);
          if (compilation.isDescriptorDocument()) {
            compilation.modules.forEach((module3) => {
              const stack = compilation.getStackByModule(module3);
              if (stack) {
                this.make(compilation, stack, module3);
              }
            });
          } else {
            this.make(compilation, compilation.stack, Array.from(compilation.modules.values()).shift());
          }
          await this.buildIncludes();
          this.getRouterInstance().create().forEach((item) => {
            this.emitFile(item.file, item.content);
          });
          this.emitSql();
          this.emitManifest();
          staticAssets.emit((error) => {
            compilation.completed(this.plugin, true);
            done(error ? error : null);
          });
        } catch (e) {
          done(e);
        }
      }
      make(compilation, stack, module3) {
        if (createAstStackCached.has(stack))
          return false;
        createAstStackCached.add(stack);
        const config = this.plugin.options;
        const isRoot = compilation.stack === stack;
        if (isRoot) {
          compilation.modules.forEach((module4) => {
            this.getModuleAssets(module4);
          });
          this.getProgramAssets(compilation);
        } else if (module3) {
          this.getModuleAssets(module3);
        }
        const ast = this.createAstToken(stack);
        const gen = ast ? this.createGenerator(ast, compilation, module3) : null;
        if (gen) {
          const file = this.getModuleFile(module3 || compilation);
          const content = gen.toString();
          if (content) {
            this.emitContent(
              file,
              content,
              config.emit ? this.getOutputAbsolutePath(module3 ? module3 : compilation.file, compilation) : null
            );
          }
        }
        compilation.children.filter((child) => {
          return child.import === "reference";
        }).forEach((child) => {
          if (child !== compilation) {
            if (child.modules.size > 0) {
              this.make(child, child.stack, Array.from(child.modules.values()).shift());
            } else {
              this.make(child, child.stack);
            }
          }
        });
        return true;
      }
      isNeedBuild(module3, ctxModule) {
        if (!module3 || !this.compiler.callUtils("isTypeModule", module3))
          return false;
        if (module3.isStructTable)
          return true;
        if (!this.isActiveForModule(module3, ctxModule))
          return false;
        if (!this.isPluginInContext(module3)) {
          return false;
        }
        return true;
      }
      isPluginInContext(module3) {
        if (this.checkPluginContextCache.has(module3)) {
          return this.checkPluginContextCache.get(module3);
        }
        let result = true;
        if (module3 && module3.isModule && !this.checkRuntimeModule(module3)) {
          result = false;
        } else {
          result = this.compiler.isPluginInContext(this.plugin, module3 || this.compilation);
        }
        this.checkPluginContextCache.set(module3, result);
        return result;
      }
      checkRuntimeModule(module3) {
        if (this.checkRuntimeCache.has(module3)) {
          return this.checkRuntimeCache.get(module3);
        }
        const result = this.checkAnnotationBuildTactics(this.getModuleAnnotations(module3, ["runtime", "syntax"]));
        this.checkRuntimeCache.set(module3, result);
        return result;
      }
      checkAnnotationBuildTactics(items) {
        if (!items || !items.length)
          return true;
        return items.every((item) => {
          const name2 = item.name.toLowerCase();
          if (!["runtime", "syntax", "env", "version"].includes(name2)) {
            return true;
          }
          const args2 = item.getArguments();
          const indexes = name2 === "version" ? [, , , "expect"] : name2 === "env" ? [, , "expect"] : [, "expect"];
          const _expect = this.getAnnotationArgument("expect", args2, indexes, true);
          const value2 = args2[0].value;
          const expect = _expect ? String(_expect.value).trim() !== "false" : true;
          switch (name2) {
            case "runtime":
              return this.isRuntime(value2) === expect;
            case "syntax":
              return this.isSyntax(value2) === expect;
            case "env": {
              const name3 = this.getAnnotationArgument("name", args2, ["name", "value"], true);
              const value3 = this.getAnnotationArgument("value", args2, ["name", "value"], true);
              if (value3 && name3) {
                return this.isEnv(name3.value, value3.value) === expect;
              } else {
                item.error(`Missing name or value arguments. the '${item.name}' annotations.`);
              }
            }
            case "version": {
              const name3 = this.getAnnotationArgument("name", args2, ["name", "version", "operator"], true);
              const version = this.getAnnotationArgument("version", args2, ["name", "version", "operator"], true);
              const operator = this.getAnnotationArgument("operator", args2, ["name", "version", "operator"], true);
              if (name3 && version) {
                return this.isVersion(name3.value, version.value, operator ? operator.value : "elt") === expect;
              } else {
                item.error(`Missing name or version arguments. the '${item.name}' annotations.`);
              }
            }
          }
          return true;
        });
      }
      getModuleAnnotations(module3, allows = ["get", "post", "put", "delete", "option", "router"], inheritFlag = true) {
        if (!module3 || !module3.isModule || !module3.isClass)
          return [];
        const stacks = module3.getStacks();
        let _result = [];
        for (let i = 0; i < stacks.length; i++) {
          const stack = stacks[i];
          let annotations = stack.annotations;
          if (annotations) {
            const result = annotations.filter((annotation) => allows.includes(annotation.name.toLowerCase()));
            if (result.length > 0) {
              _result = result;
              break;
            }
          }
        }
        if (!_result) {
          const impls = module3.extends.concat(module3.implements || []);
          if (impls.length > 0 && inheritFlag) {
            for (let b = 0; b < impls.length; b++) {
              const inherit = impls[b];
              if (inherit !== module3) {
                const result = this.getModuleAnnotations(inherit, allows, inheritFlag);
                if (result.length > 0) {
                  _result = result;
                  break;
                }
              }
            }
          }
        }
        return _result;
      }
      getAnnotationArgument(name2, args2 = [], indexes = [], lowerFlag = false) {
        let index = args2.findIndex((item) => lowerFlag ? String(item.key).toLowerCase() === name2 : item.key === name2);
        if (index < 0) {
          index = indexes.indexOf(name2);
          if (index >= 0) {
            const arg = args2[index];
            return arg && !arg.assigned ? arg : null;
          }
        }
        return args2[index] || null;
      }
      isUsed(module3, ctxModule) {
        ctxModule = ctxModule || this.compilation;
        if (!module3)
          return false;
        if (ctxModule && moduleDependencies.has(ctxModule) && moduleDependencies.get(ctxModule).has(module3)) {
          return true;
        }
        return !!(this.compiler.callUtils("isTypeModule", module3) && module3.used);
      }
      getModuleById(id2, flag = false) {
        return this.compilation.getModuleById(id2, flag);
      }
      getGlobalModuleById(id2) {
        return this.compilation.getGlobalTypeById(id2);
      }
      isRuntime(name2) {
        const metadata = this.plugin.options.metadata || {};
        switch (name2.toLowerCase()) {
          case "client":
            return (metadata.platform || this.platform) === "client";
          case "server":
            return (metadata.platform || this.platform) === "server";
        }
        return false;
      }
      isSyntax(name2) {
        return name2 && name2.toLowerCase() === this.name;
      }
      isEnv(name2, value2) {
        const metadata = this.plugin.options.metadata;
        const env = metadata.env || {};
        if (value2 !== void 0) {
          if (name2.toLowerCase() === "mode") {
            if (this.plugin.options.mode === value2 || env.NODE_ENV === value2) {
              return true;
            }
          }
          return env[name2] === value2;
        }
        return false;
      }
      isVersion(name2, version, operator = "elt", flag = false) {
        const metadata = this.plugin.options.metadata;
        const right = String(metadata[name2] || "0.0.0").trim();
        const left = String(version || "0.0.0").trim();
        const rule2 = /^\d+\.\d+\.\d+$/;
        if (!rule2.test(left) || !rule2.test(right)) {
          console.warn("Invalid version. in check metadata");
          return false;
        }
        if (flag) {
          return this.isCompareVersion(right, left, operator);
        }
        return this.isCompareVersion(left, right, operator);
      }
      isCompareVersion(left, right, operator = "elt") {
        operator = operator.toLowerCase();
        if (operator === "eq" && left == right)
          return true;
        left = String(left).split(".", 3).map((val) => parseInt(val));
        right = String(right).split(".", 3).map((val) => parseInt(val));
        for (let i = 0; i < left.length; i++) {
          let l = left[i] || 0;
          let r = right[i] || 0;
          if (operator === "eq" && l != r) {
            return false;
          } else if (operator === "gt" && !(l > r)) {
            return false;
          } else if (operator === "egt" && !(l >= r)) {
            return false;
          } else if (operator === "lt" && !(l < r)) {
            return false;
          } else if (operator === "elt" && !(l <= r)) {
            return false;
          } else if (operator === "neq" && !(l != r)) {
            return false;
          }
        }
        return true;
      }
      getOutputAbsolutePath(module3, compilation) {
        if (outputAbsolutePathCached.has(module3)) {
          return outputAbsolutePathCached.get(module3);
        }
        const config = this.plugin.options;
        const suffix = config.suffix || ".php";
        const workspace = config.workspace || this.compiler.workspace;
        const output = this.getOutputPath();
        const isStr = typeof module3 === "string";
        if (!module3)
          return output;
        const folder = isStr ? this.getSourceFileMappingFolder(module3) : this.getModuleMappingFolder(module3);
        if (!isStr && module3 && module3.isModule) {
          if (module3.isDeclaratorModule) {
            const polyfillModule = Polyfill2.modules.get(module3.getName());
            const filename = module3.id + suffix;
            if (polyfillModule) {
              return this.compiler.normalizePath(PATH.join(output, folder || polyfillModule.namespace, filename));
            }
            return this.compiler.normalizePath(PATH.join(output, (folder ? folder : module3.getName("/")) + suffix));
          } else if (module3.compilation.isDescriptorDocument()) {
            return this.compiler.normalizePath(PATH.join(output, (folder ? folder : module3.getName("/")) + suffix));
          }
        }
        let filepath = "";
        if (isStr) {
          filepath = PATH.resolve(output, folder ? PATH.join(folder, PATH.parse(module3).name + suffix) : PATH.relative(workspace, module3));
        } else if (module3 && module3.isModule && module3.compilation.modules.size === 1 && this.compiler.normalizePath(module3.file).includes(workspace)) {
          filepath = PATH.resolve(output, folder ? PATH.join(folder, module3.id + suffix) : PATH.relative(workspace, module3.file));
        } else if (module3 && module3.isModule) {
          filepath = PATH.join(output, folder ? PATH.join(folder, module3.id + suffix) : module3.getName("/") + suffix);
        }
        const info = PATH.parse(filepath);
        if (info.ext === ".es") {
          filepath = PATH.join(info.dir, info.name + suffix);
        }
        filepath = this.compiler.normalizePath(filepath);
        outputAbsolutePathCached.set(module3, filepath);
        return filepath;
      }
      resolveModuleType(module3) {
        if (resolveModuleTypeCached.has(module3)) {
          return resolveModuleTypeCached.get(module3);
        }
        let resolve = null;
        this.compilation.stack.findAnnotation(module3, (annotation) => {
          if (annotation.name.toLowerCase() === "define") {
            const args2 = annotation.getArguments();
            if (args2[0] && String(args2[0].key).toLowerCase() === "type") {
              return resolve = args2[0].value;
            }
          }
          return false;
        });
        switch (resolve) {
          case "controller":
            resolveModuleTypeCached.set(module3, _Builder.MODULE_TYPE_CONTROLLER);
            break;
          case "model":
            resolveModuleTypeCached.set(module3, _Builder.MODULE_TYPE_MODEL);
            break;
          case "asset":
            resolveModuleTypeCached.set(module3, _Builder.MODULE_TYPE_ASSET);
            break;
          case "config":
            resolveModuleTypeCached.set(module3, _Builder.MODULE_TYPE_CONFIG);
            break;
          case "lang":
            resolveModuleTypeCached.set(module3, _Builder.MODULE_TYPE_LANG);
            break;
          default:
            resolveModuleTypeCached.set(module3, _Builder.MODULE_TYPE_UNKNOWN);
        }
        return resolveModuleTypeCached.get(module3);
      }
      resolveModuleTypeName(module3) {
        switch (this.resolveModuleType(module3)) {
          case _Builder.MODULE_TYPE_CONTROLLER:
            return "controller";
          case _Builder.MODULE_TYPE_MODEL:
            return "model";
          case _Builder.MODULE_TYPE_ASSET:
            return "asset";
          case _Builder.MODULE_TYPE_CONFIG:
            return "config";
          case _Builder.MODULE_TYPE_LANG:
            return "lang";
        }
        return "*";
      }
      getSourceFileMappingFolder(file) {
        return this.resolveSourceFileMappingPath(file, "folders");
      }
      getModuleMappingFolder(module3) {
        if (module3 && module3.isModule) {
          let file = module3.compilation.file;
          if (module3.isDeclaratorModule) {
            file = module3.getName("/");
            const compilation = module3.compilation;
            if (compilation) {
              if (compilation.isGlobalFlag && compilation.pluginScopes.scope === "global") {
                file += ".global";
              }
            }
          }
          return this.resolveSourceFileMappingPath(file, "folders");
        }
        return null;
      }
      getModuleMappingNamespace(module3) {
        if (!module3 || !module3.isModule)
          return null;
        let ns = module3.id;
        let assignment = null;
        if (module3.isDeclaratorModule) {
          const polyfill = this.getPolyfillModule(module3.getName());
          if (polyfill) {
            assignment = (polyfill.namespace ? polyfill.namespace : "").replace(/[\\\\.]/g, "/");
            ns = [assignment, polyfill.export || module3.id].filter(Boolean).join("/");
          } else {
            ns = module3.getName("/");
          }
          const compilation = module3.compilation;
          if (compilation) {
            if (compilation.isGlobalFlag && compilation.pluginScopes.scope === "global") {
              ns += ".global";
            }
          }
        } else {
          ns = module3.getName("/");
        }
        if (ns) {
          const result = this.getMappingNamespace(ns);
          if (result)
            return result;
        }
        if (this.plugin.options.folderAsNamespace) {
          const folder = this.getModuleMappingFolder(module3);
          if (folder) {
            return folder.replace(/[\\\\/]/g, "\\");
          }
        }
        if (assignment) {
          return assignment.replace(/[\\\\/]/g, "\\");
        }
        return null;
      }
      getMappingNamespace(id2) {
        return this.plugin.resolveSourceId(id2, "namespaces");
      }
      getModuleMappingRoute(module3, data2 = {}) {
        if (!module3 || !module3.isModule)
          return data2.path;
        const id2 = PATH.dirname(module3.file) + "/" + module3.id + ".route";
        data2.group = "formats";
        return this.plugin.resolveSourceId(id2, data2) || data2.path;
      }
      resolveSourceFileMappingPath(file, type = "folders") {
        return this.plugin.resolveSourceId(file, type);
      }
      getOutputRelativePath(module3, context) {
        const contextPath = this.getOutputAbsolutePath(context);
        const modulePath = this.getOutputAbsolutePath(module3);
        return this.compiler.normalizePath("/" + PATH.relative(PATH.dirname(contextPath), modulePath));
      }
      getFileRelativePath(currentFile, destFile) {
        return this.compiler.normalizePath("/" + PATH.relative(PATH.dirname(currentFile), destFile));
      }
      getFileRelativeOutputPath(module3) {
        const modulePath = this.getOutputAbsolutePath(module3);
        return this.compiler.normalizePath("/" + PATH.relative(this.getOutputPath(), modulePath));
      }
      getIdByModule(module3) {
        const file = (typeof module3 === "string" ? module3 : this.getModuleFile(module3)).replace(/\\/g, "/");
        if (!moduleIdMap.has(file)) {
          moduleIdMap.set(file, moduleIdMap.size);
        }
        return moduleIdMap.get(file);
      }
      getIdByNamespace(namespace) {
        if (!namespaceMap.has(namespace)) {
          namespaceMap.set(namespace, namespaceMap.size);
        }
        return namespaceMap.get(namespace);
      }
      addDepend(depModule, ctxModule) {
        ctxModule = ctxModule || this.compilation;
        if (!depModule.isModule || depModule === ctxModule)
          return;
        if (!this.compiler.callUtils("isTypeModule", depModule))
          return;
        var dataset = moduleDependencies.get(ctxModule);
        if (!dataset) {
          moduleDependencies.set(ctxModule, dataset = /* @__PURE__ */ new Set());
        }
        dataset.add(depModule);
      }
      getDependencies(ctxModule) {
        ctxModule = ctxModule || this.compilation;
        const compilation = this.compiler.callUtils("isTypeModule", ctxModule) ? this.compilation : ctxModule;
        const dataset = moduleDependencies.get(ctxModule);
        if (!dataset) {
          return compilation.getDependencies(ctxModule);
        }
        if (!dataset._merged) {
          dataset._merged = true;
          compilation.getDependencies(ctxModule).forEach((dep) => {
            dataset.add(dep);
          });
        }
        return Array.from(dataset.values());
      }
      getPolyfillModule(id2) {
        return Polyfill2.modules.get(id2);
      }
      isActiveForModule(depModule, ctxModule) {
        ctxModule = ctxModule || this.compilation;
        if (depModule && depModule.isStructTable) {
          return false;
        }
        const isUsed = this.isUsed(depModule, ctxModule);
        if (!isUsed)
          return false;
        if (depModule.isDeclaratorModule) {
          return !!this.getPolyfillModule(depModule.getName());
        } else {
          return !this.compiler.callUtils("checkDepend", ctxModule, depModule);
        }
      }
      isReferenceDeclaratorModule(depModule) {
        if (depModule && depModule.isDeclaratorModule) {
          if (depModule.isStructTable) {
            return false;
          }
          if (this.plugin.resolveSourcePresetFlag(depModule.getName("/"), "usings")) {
            return true;
          }
        }
        return false;
      }
      getModuleFile(module3, uniKey, type, resolve) {
        return this.compiler.normalizeModuleFile(module3, uniKey, type, resolve);
      }
      getAssetFileReferenceName(module3, file) {
        const asset = staticAssets.getAsset(file);
        if (asset) {
          return asset.getOutputFilePath();
        }
        return "";
      }
      getModuleReferenceName(module3, context) {
        context = context || this.compilation;
        if (!module3)
          return null;
        if (context) {
          if (context.isDeclaratorModule) {
            const polyfill = this.getPolyfillModule(context.getName());
            if (polyfill && polyfill.require.includes(module3.getName())) {
              return module3.export;
            }
          }
          if (module3 === context) {
            return module3.id;
          }
          if (context.importAlias && context.importAlias.has(module3)) {
            return context.importAlias.get(module3);
          }
          if (module3.required || context.imports && context.imports.has(module3.id)) {
            return module3.id;
          }
          const deps = moduleDependencies.get(context);
          if (deps && deps.has(module3)) {
            return module3.id;
          }
        }
        return this.getModuleNamespace(module3, module3.id, false);
      }
      getModuleNamespace(module3, suffix = null, imported = true) {
        if (!module3)
          return "";
        let folder = this.getModuleMappingNamespace(module3);
        if (folder) {
          if (suffix) {
            return "\\" + folder + "\\" + suffix;
          }
          return folder;
        }
        if (module3.namespace && module3.namespace.isNamespace) {
          const items = module3.namespace.getChain();
          if (items.length > 0 || !imported) {
            if (suffix) {
              return "\\" + items.concat(suffix).join("\\");
            }
            return items.join("\\");
          }
        }
        return !imported && suffix ? "\\" + suffix : "";
      }
      getProgramAssets() {
        const dataset = /* @__PURE__ */ new Map();
        const config = this.plugin.options;
        const externals = config.externals;
        const assets = this.compilation.assets;
        const add = (item) => {
          const source = item.getResolveFile(true);
          if (this.plugin.options.assets.test(source)) {
            if (item.specifiers && item.specifiers.length > 0) {
              const local = item.specifiers[0].value();
              this.staticAssets.create(source, item.source.value(), local);
            } else {
              this.staticAssets.create(source, item.source.value(), null);
            }
          }
        };
        (this.compilation.stack.imports || []).forEach(add);
        (this.compilation.externals || []).forEach(add);
        this.crateAssetItems(null, dataset, assets, externals, this.compilation);
        return Array.from(dataset.values());
      }
      crateAssetItems(module3, dataset, assets, externals, context) {
        assets.forEach((asset) => {
          if (asset.file) {
            const external = externals && asset.file ? externals.find((name2) => asset.file.indexOf(name2) === 0) : null;
            if (!external) {
              const object = staticAssets.create(asset.resolve, asset.file, asset.assign, module3 || context);
              dataset.add(object);
            }
          } else if (asset.type === "style") {
            const file = this.getModuleFile(module3 || context, asset.id, asset.type || "css", asset.resolve);
            const object = staticAssets.create(file, null, null, module3 || context);
            object.setContent(asset.content);
            dataset.add(object);
          }
        });
      }
      getModuleAssets(module3, dataset, excludes) {
        if (!module3 || !module3.isModule)
          return [];
        dataset = dataset || /* @__PURE__ */ new Set();
        excludes = excludes || /* @__PURE__ */ new WeakSet();
        const config = this.plugin.options;
        const assets = module3.assets;
        const externals = config.externals;
        const compilation = module3.compilation;
        if (assets) {
          this.crateAssetItems(module3, dataset, assets, externals);
        }
        if (compilation.modules.size > 1) {
          if (Array.from(compilation.modules.values())[0] === module3) {
            this.crateAssetItems(module3, dataset, compilation.assets, externals);
          }
        } else {
          this.crateAssetItems(module3, dataset, compilation.assets, externals);
        }
        const requires = module3.requires;
        if (requires && requires.size > 0) {
          requires.forEach((item) => {
            const external = externals && item.from ? externals.find((name2) => item.from.indexOf(name2) === 0) : null;
            const object = staticAssets.create(item.resolve, external || item.from, item.key, module3);
            if (item.extract) {
              object.extract = true;
              object.local = item.name;
              if (item.name !== item.key) {
                data.imported = item.key;
              }
            }
            dataset.add(object);
          });
        }
        excludes.add(module3);
        this.getDependencies(module3).forEach((dep) => {
          if (!excludes.has(dep)) {
            if (!this.isActiveForModule(dep, module3) && this.isUsed(dep)) {
              this.getModuleAssets(dep, dataset, excludes);
            }
          }
        });
        return dataset;
      }
      isImportExclude(source) {
        const excludes = this.plugin.options.excludes;
        if (excludes && excludes.length > 0) {
          let file = source;
          let className = "";
          let test = (rule2) => {
            if (rule2 === file || rule2 === className)
              return true;
            if (rule2 instanceof RegExp) {
              if (rule2.test(file))
                return true;
              return className ? rule2.test(className) : false;
            }
            return false;
          };
          if (typeof source !== "string") {
            file = "";
            if (source.isModule) {
              file = source.file;
              className = source.getName("/");
            }
          }
          if (excludes.some(test)) {
            return true;
          }
        }
        return false;
      }
      getModuleImportSource(source, module3) {
        const config = this.plugin.options;
        const isString = typeof source === "string";
        if (config.useAbsolutePathImport) {
          return isString ? source : this.getOutputAbsolutePath(source);
        }
        return module3 ? this.getOutputRelativePath(source, module3) : source;
      }
      getAvailableOriginType(type) {
        if (type) {
          const originType = this.compiler.callUtils("getOriginType", type);
          switch (originType.id) {
            case "String":
            case "Number":
            case "Array":
            case "Function":
            case "Object":
            case "Boolean":
            case "RegExp":
              return originType.id;
            case "Uint":
            case "Int":
            case "Float":
            case "Double":
              return "Number";
            default:
          }
        }
        return null;
      }
      createAstToken(stack) {
        return this.createToken(stack);
      }
      createGenerator(ast, compilation, module3) {
        const gen = new Generator(compilation.file);
        gen.builder = this;
        gen.make(ast);
        return gen;
      }
      getGlobalModules() {
        if (this._globalModules)
          return this._globalModules;
        return this._globalModules = ["Array", "Object", "Boolean", "Math", "Number", "String", "Console"].map((name2) => {
          return this.compilation.getGlobalTypeById(name2);
        });
      }
    };
    var Builder2 = _Builder;
    __publicField(Builder2, "MODULE_TYPE_CONTROLLER", 1);
    __publicField(Builder2, "MODULE_TYPE_MODEL", 2);
    __publicField(Builder2, "MODULE_TYPE_ASSET", 3);
    __publicField(Builder2, "MODULE_TYPE_CONFIG", 4);
    __publicField(Builder2, "MODULE_TYPE_LANG", 5);
    __publicField(Builder2, "MODULE_TYPE_UNKNOWN", 9);
    module2.exports = Builder2;
  }
});

// core/ClassBuilder.js
var require_ClassBuilder = __commonJS({
  "core/ClassBuilder.js"(exports2, module2) {
    var Token2 = require_Token();
    var RouteMethods = ["router", "get", "post", "put", "delete", "option"];
    var ClassBuilder2 = class extends Token2 {
      static createClassNode(stack, ctx2, type) {
        const obj = new ClassBuilder2(stack, ctx2, type);
        return obj.create();
      }
      constructor(stack, ctx2, type) {
        super(type || stack.toString());
        this.stack = stack;
        this.scope = stack.scope;
        this.compilation = stack.compilation;
        this.compiler = stack.compiler;
        this.module = stack.module;
        this.plugin = ctx2.plugin;
        this.name = ctx2.name;
        this.platform = ctx2.platform;
        this.parent = ctx2;
        this.builder = ctx2.builder;
        this.initProperties = [];
        this.injectProperties = [];
        this.provideProperties = [];
        this.initBeforeBody = [];
        this.beforeBody = [];
        this.afterBody = [];
        this.methods = [];
        this.members = [];
        this.construct = null;
        this.body = [];
        this.implements = [];
        this.inherit = null;
        this.imports = [];
        this.using = [];
        this.assets = [];
      }
      create() {
        if (!this.checkSyntaxPresetForClass()) {
          return null;
        }
        const module3 = this.module;
        const body = this.body;
        const multiModule = this.compilation.modules.size > 1;
        var mainModule = module3;
        var internalModules = null;
        if (multiModule && this.compilation.modules.size > 1) {
          internalModules = Array.from(this.compilation.modules.values());
          mainModule = internalModules.shift();
        }
        if (mainModule === module3) {
          if (this.plugin.options.consistent && !module3.file.includes(module3.getName("/"))) {
            this.stack.error(2e4, module3.getName());
          }
        }
        this.createClassStructuralBody();
        this.createDependencies(module3, multiModule, mainModule);
        this.createModuleAssets(module3, multiModule, mainModule);
        this.beforeBody.forEach((item) => item && body.push(item));
        this.key = this.createIdentifierNode(module3.id);
        this.static = module3.static ? this.createIdentifierNode("static") : null;
        this.final = module3.isFinal ? this.createIdentifierNode("final") : null;
        this.abstract = module3.abstract ? this.createIdentifierNode("abstract") : null;
        this.modifier = this.createIdentifierNode(this.compiler.callUtils("getModifierValue", this.stack));
        this.construct && body.push(this.construct);
        body.push(...this.createStatementMember("methods", this.methods));
        body.push(...this.createStatementMember("members", this.members));
        this.afterBody.forEach((item) => item && body.push(item));
        return this;
      }
      checkSyntaxPresetForClass() {
        const stack = this.stack;
        const module3 = this.module;
        const annotations = stack.annotations;
        if (annotations) {
          const syntaxAnnotation = annotations.find((annotation) => annotation.name.toLowerCase() === "syntax");
          if (syntaxAnnotation) {
            const args2 = syntaxAnnotation.getArguments();
            if (args2[0]) {
              if (this.builder.isSyntax(args2[0].value)) {
                this.compilation.isServerPolicy(module3);
                return true;
              } else {
                return false;
              }
            }
          }
        }
        return true;
      }
      createClassStructuralBody() {
        const stack = this.stack;
        const module3 = this.module;
        this.id = this.createToken(stack.id);
        const ns = this.builder.getModuleNamespace(module3);
        if (ns) {
          this.namespace = this.createIdentifierNode(ns);
        }
        if (module3.inherit) {
          this.addDepend(module3.inherit);
        }
        if (this.isActiveForModule(module3.inherit, module3, true)) {
          this.inherit = this.createIdentifierNode(this.getModuleReferenceName(module3.inherit));
        }
        this.implements = module3.implements.filter((impModule) => {
          if (impModule.isInterface) {
            this.addDepend(impModule);
            return this.isActiveForModule(impModule, module3, true);
          }
          return false;
        }).map((item) => this.createIdentifierNode(this.getModuleReferenceName(item)));
        this.createClassMemebers(stack);
        if (!this.construct && this.initProperties.length > 0) {
          this.construct = this.createDefaultConstructMethod("__construct", this.initProperties);
        }
        this.checkConstructMethod();
        return this;
      }
      checkConstructMethod() {
      }
      createClassMemebers(stack) {
        if (!(this.type == "ClassDeclaration" || this.type === "InterfaceDeclaration"))
          return;
        const cache1 = /* @__PURE__ */ new Map();
        const cache2 = /* @__PURE__ */ new Map();
        stack.body.forEach((item) => {
          const child = this.createClassMemeberNode(item);
          const isStatic = !!(stack.static || child.static);
          const refs = isStatic ? this.methods : this.members;
          this.createAnnotations(child, item, isStatic);
          child.isInterfaceMember = this.type === "InterfaceDeclaration";
          if (child.type === "PropertyDefinition") {
            if (!child.init) {
              child.init = child.createLiteralNode(null);
            }
          }
          if (item.isMethodSetterDefinition || item.isMethodGetterDefinition) {
            const name2 = child.key.value;
            const dataset = isStatic ? cache1 : cache2;
            var target = dataset.get(name2);
            if (!target) {
              target = {
                isAccessor: true,
                kind: "accessor",
                key: child.key,
                modifier: child.modifier
              };
              dataset.set(name2, target);
              refs.push(target);
            }
            if (item.isMethodGetterDefinition) {
              target.get = child;
            } else if (item.isMethodSetterDefinition) {
              target.set = child;
            }
          } else if (item.isConstructor && item.isMethodDefinition) {
            this.construct = child;
          } else {
            refs.push(child);
          }
        });
      }
      createAnnotations(node, memeberStack, isStatic) {
        if (isStatic && node && memeberStack.compiler.callUtils("isModifierPublic", memeberStack) && memeberStack.isMethodDefinition && memeberStack.isEnterMethod && !this.mainEnterMethods) {
          const mainEnterMethods = this.createStatementNode(
            this.createCalleeNode(
              this.createStaticMemberNode([
                this.createIdentifierNode(this.module.id),
                this.createIdentifierNode(node.key.value)
              ])
            )
          );
          this.mainEnterMethods = mainEnterMethods;
          const program = this.getParentByType("Program");
          if (program) {
            program.afterBody.push(mainEnterMethods);
          }
        }
      }
      createClassMemeberNode(memeberStack) {
        const node = this.createToken(memeberStack);
        if (memeberStack.isMethodDefinition && !memeberStack.isAccessor && !memeberStack.isConstructor && node && memeberStack.compiler.callUtils("isModifierPublic", memeberStack)) {
          const annotation = memeberStack.annotations.find((annotation2) => {
            return RouteMethods.includes(annotation2.name.toLowerCase());
          });
          if (annotation) {
            const args2 = annotation.getArguments();
            const action = memeberStack.key.value();
            const params = memeberStack.params.map((item) => {
              const required = !(item.question || item.isAssignmentPattern);
              return { name: item.value(), required };
            });
            let method = annotation.name.toLowerCase();
            let path3 = action;
            if (method === "router") {
              method = args2[0] && args2[0].value ? args2[0].value : "get";
              if (args2[1] && args2[1].value) {
                path3 = args2[1].value.trim();
              }
            } else if (args2[0] && args2[0].value) {
              path3 = args2[0].value.trim();
            }
            let routePath = path3;
            if (path3.charCodeAt(0) === 64) {
            } else if (path3.charCodeAt(0) === 47) {
            } else {
              routePath = this.module.getName("/") + "/" + path3;
            }
            routePath = this.builder.getModuleMappingRoute(
              this.module,
              {
                method,
                params,
                action,
                path: routePath,
                annotation,
                className: this.module.getName(),
                module: this.module
              }
            );
            this.builder.addRouterConfig(this.module, method, routePath, action, params);
          } else if (this.builder.resolveModuleTypeName(this.module) === "controller") {
            const method = "any";
            const action = memeberStack.key.value();
            const params = memeberStack.params.map((item) => {
              const required = !(item.question || item.isAssignmentPattern);
              return { name: item.value(), required };
            });
            const routePath = this.builder.getModuleMappingRoute(
              this.module,
              {
                method,
                params,
                action,
                path: this.module.getName("/") + "/" + action,
                annotation: null,
                className: this.module.getName(),
                module: this.module
              }
            );
            this.builder.addRouterConfig(this.module, method, routePath, action, params);
          }
        }
        return node;
      }
      createDefaultConstructMethod(methodName, initProperties, params = []) {
        const inherit = this.inherit;
        const node = this.createMethodNode(methodName ? this.createIdentifierNode(methodName) : null, (ctx2) => {
          if (inherit) {
            const se = ctx2.createNode("SuperExpression");
            se.value = "parent";
            ctx2.body.push(
              ctx2.createStatementNode(
                ctx2.createCalleeNode(
                  ctx2.createStaticMemberNode([se, ctx2.createIdentifierNode("__construct")]),
                  params
                )
              )
            );
          }
          if (initProperties && initProperties.length) {
            initProperties.forEach((item) => {
              ctx2.body.push(item);
            });
          }
        }, params);
        node.type = "FunctionDeclaration";
        return node;
      }
      createStatementMember(name2, members) {
        if (!members.length)
          return [];
        const body = [];
        members.forEach((node) => {
          if (node.isAccessor) {
            if (node.get) {
              body.push(node.get);
            }
            if (node.set) {
              body.push(node.set);
            }
          } else {
            body.push(node);
          }
        });
        return body;
      }
      createDependencies(module3, multiModule = false, mainModule = null) {
        const stack = this.compilation.getStackByModule(module3);
        if (stack && stack.imports && stack.imports.length > 0) {
          stack.imports.forEach((item) => {
            if (item.source.isLiteral) {
              const compilation = item.getResolveCompilation();
              if (compilation && compilation.modules.size === 0) {
                const node = this.createToken(item);
                if (node) {
                  this.imports.push(node);
                }
              } else {
                const source = item.getResolveFile(true);
                if (this.plugin.options.assets.test(source)) {
                  if (item.specifiers && item.specifiers.length > 0) {
                    const local = item.specifiers[0].value();
                    this.builder.staticAssets.create(source, item.source.value(), local, module3);
                  } else {
                    this.builder.staticAssets.create(source, item.source.value(), null, module3);
                  }
                }
              }
            }
          });
        }
        const dependencies = this.builder.getDependencies(module3);
        var excludes = null;
        if (multiModule && mainModule && mainModule !== module3) {
          excludes = this.builder.getDependencies(mainModule);
          excludes.push(mainModule);
        }
        const importFlag = this.plugin.options.import;
        const consistent = this.plugin.options.consistent;
        const folderAsNamespace = this.plugin.options.folderAsNamespace;
        const usingExcludes = this.builder.getGlobalModules();
        const createUse = (depModule) => {
          if (!usingExcludes.includes(depModule)) {
            const name2 = this.builder.getModuleNamespace(depModule, depModule.id);
            if (name2) {
              let local = name2;
              let imported = void 0;
              if (module3.importAlias && module3.importAlias.has(depModule)) {
                imported = name2;
                local = module3.importAlias.get(depModule);
              }
              this.using.push(this.createUsingStatementNode(
                this.createImportSpecifierNode(local, imported)
              ));
            }
          }
        };
        dependencies.forEach((depModule) => {
          if (!(excludes && excludes.includes(depModule)) && this.builder.isPluginInContext(depModule)) {
            if (this.isActiveForModule(depModule, module3)) {
              if (importFlag) {
                if (!this.builder.isImportExclude(depModule)) {
                  const source = this.builder.getModuleImportSource(depModule, module3);
                  this.imports.push(this.createImportDeclaration(source));
                }
              } else if (!(consistent || folderAsNamespace)) {
                const source = this.builder.getFileRelativeOutputPath(depModule);
                const name2 = this.builder.getModuleNamespace(depModule, depModule.id);
                this.builder.addFileAndNamespaceMapping(source, name2);
              }
              createUse(depModule);
            } else if (this.isReferenceDeclaratorModule(depModule, module3)) {
              createUse(depModule);
            }
          }
        });
        if (module3.isDeclaratorModule) {
          const polyfillModule = this.builder.getPolyfillModule(module3.getName());
          if (polyfillModule && polyfillModule.requires.size > 0) {
            polyfillModule.requires.forEach((item) => {
              const name2 = item.key;
              const source = item.from;
              if (importFlag && !this.builder.isImportExclude(source)) {
                this.imports.push(this.createImportDeclaration(source));
              }
              if (!usingExcludes.includes(module3)) {
                const ns = this.builder.getModuleNamespace(module3, polyfillModule.export);
                if (ns) {
                  if (name2 !== item.value) {
                    this.using.push(this.createUsingStatementNode(
                      this.createImportSpecifierNode(name2, ns)
                    ));
                  } else {
                    this.using.push(this.createUsingStatementNode(
                      this.createImportSpecifierNode(ns)
                    ));
                  }
                }
              }
            });
          }
        }
      }
      createModuleAssets(module3, multiModule = false, mainModule = null) {
      }
      createImportDeclaration(source, specifiers) {
        return this.createImportNode(source, specifiers);
      }
    };
    module2.exports = ClassBuilder2;
  }
});

// core/Constant.js
var require_Constant = __commonJS({
  "core/Constant.js"(exports2, module2) {
    module2.exports = {
      MODIFIER_PUBLIC: 3,
      MODIFIER_PROTECTED: 2,
      MODIFIER_PRIVATE: 1,
      DECLARE_CLASS: 1,
      DECLARE_INTERFACE: 2,
      DECLARE_ENUM: 3,
      DECLARE_PROPERTY_VAR: 1,
      DECLARE_PROPERTY_CONST: 2,
      DECLARE_PROPERTY_FUN: 3,
      DECLARE_PROPERTY_ACCESSOR: 4,
      DECLARE_PROPERTY_ENUM_KEY: 5,
      DECLARE_PROPERTY_ENUM_VALUE: 6,
      BUILD_OUTPUT_EVERY_FILE: 1,
      BUILD_OUTPUT_MERGE_FILE: 2,
      BUILD_OUTPUT_MEMORY_FILE: 3,
      BUILD_ORIGIN_FILE: 1,
      BUILD_ALL_FILE: 2,
      BUILD_REFS_MODULE_ES6: 1,
      BUILD_REFS_MODULE_COMMONJS: 2,
      REFS_DECLARE_PRIVATE_NAME: "_private",
      REFS_DECLARE_PRIVATE_STATIC: "_privateStatic",
      BUILD_IMPORT_PATH_ABSOLUTE: 1,
      BUILD_IMPORT_PATH_RELATIVE: 2
    };
  }
});

// transforms/Object.js
var require_Object = __commonJS({
  "transforms/Object.js"(exports2, module2) {
    function createMethodFunctionNode(ctx2, name2) {
      return ctx2.createLiteralNode(name2);
    }
    function createCommonCalledNode(name2, ctx2, object, args2, called) {
      if (!called)
        return createMethodFunctionNode(ctx2, name2);
      return ctx2.createCalleeNode(
        ctx2.createIdentifierNode(name2),
        object ? [object].concat(args2) : args2
      );
    }
    module2.exports = {
      assign(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("Object");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_object_assign");
        if (!called)
          return createMethodFunctionNode(ctx2, name2);
        return ctx2.createCalleeNode(
          ctx2.createIdentifierNode(name2),
          args2
        );
      },
      keys(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("Object");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_object_keys");
        if (!called)
          return createMethodFunctionNode(ctx2, name2);
        return ctx2.createCalleeNode(
          ctx2.createIdentifierNode(name2),
          args2
        );
      },
      values(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("Object");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_object_values");
        if (!called)
          return createMethodFunctionNode(ctx2, name2);
        return ctx2.createCalleeNode(
          ctx2.createIdentifierNode(name2),
          args2
        );
      },
      propertyIsEnumerable(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("Object");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_object_property_is_enumerable");
        return createCommonCalledNode(name2, ctx2, object, args2, called);
      },
      hasOwnProperty(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("Object");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_object_has_own_property");
        return createCommonCalledNode(name2, ctx2, object, args2, called);
      },
      valueOf(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("Object");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_object_value_of");
        return createCommonCalledNode(name2, ctx2, object, args2, called);
      },
      toLocaleString(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("Object");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_object_to_string");
        return createCommonCalledNode(name2, ctx2, object, args2, called);
      },
      toString(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("Object");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_object_to_string");
        return createCommonCalledNode(name2, ctx2, object, args2, called);
      }
    };
  }
});

// transforms/Array.js
var require_Array = __commonJS({
  "transforms/Array.js"(exports2, module2) {
    var ObjectMethod = require_Object();
    var Token2 = require_Token();
    function createMethodFunctionNode(ctx2, name2) {
      return ctx2.createLiteralNode(name2);
    }
    function createObjectNodeRefs(ctx2, object, name2) {
      return object;
    }
    function createCommonCalledNode(name2, ctx2, object, args2, called = true) {
      if (!called)
        return createMethodFunctionNode(ctx2, name2);
      const obj = createObjectNodeRefs(ctx2, object, name2);
      return ctx2.createCalleeNode(
        ctx2.createIdentifierNode(name2),
        [obj].concat(args2).filter((v) => !!v)
      );
    }
    var methods = {
      isArray(ctx2, object, args2, called = false, isStatic = false) {
        return ctx2.createCalleeNode(
          ctx2.createIdentifierNode("is_array"),
          args2
        );
      },
      from(ctx2, object, args2, called = false, isStatic = false) {
        ctx2.addDepend(ctx2.builder.getGlobalModuleById("System"));
        return ctx2.createCalleeNode(
          ctx2.createStaticMemberNode([
            ctx2.createIdentifierNode("System"),
            ctx2.createIdentifierNode("toArray")
          ]),
          args2
        );
      },
      of(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("Array");
        ctx2.addDepend(module3);
        return ctx2.createCalleeNode(
          ctx2.createIdentifierNode(ctx2.builder.getModuleNamespace(module3, "es_array_new")),
          args2
        );
      },
      push(ctx2, object, args2, called = false, isStatic = false) {
        return createCommonCalledNode("array_push", ctx2, object, args2, called);
      },
      unshift(ctx2, object, args2, called = false, isStatic = false) {
        return createCommonCalledNode("array_unshift", ctx2, object, args2, called);
      },
      pop(ctx2, object, args2, called = false, isStatic = false) {
        return createCommonCalledNode("array_pop", ctx2, object, args2, called);
      },
      shift(ctx2, object, args2, called = false, isStatic = false) {
        return createCommonCalledNode("array_shift", ctx2, object, args2, called);
      },
      splice(ctx2, object, args2, called = false, isStatic = false) {
        if (args2.length > 3) {
          args2 = args2.slice(0, 2).concat(ctx2.createArrayNode(args2.slice(2)));
        }
        return createCommonCalledNode("array_splice", ctx2, object, args2, called);
      },
      slice(ctx2, object, args2, called = false, isStatic = false) {
        return createCommonCalledNode("array_slice", ctx2, object, args2, called);
      },
      map(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("Array");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_array_map");
        return createCommonCalledNode(name2, ctx2, object, args2, called);
      },
      find(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("Array");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_array_find");
        return createCommonCalledNode(name2, ctx2, object, args2, called);
      },
      findIndex(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("Array");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_array_find_index");
        return createCommonCalledNode(name2, ctx2, object, args2, called);
      },
      filter(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("Array");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_array_filter");
        return createCommonCalledNode(name2, ctx2, object, args2, called);
      },
      indexOf(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("Array");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_array_find_index");
        return createCommonCalledNode(name2, ctx2, object, args2, called);
      },
      lastIndexOf(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("Array");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_array_search_last_index");
        return createCommonCalledNode(name2, ctx2, object, args2, called);
      },
      copyWithin(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("Array");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_array_copy_within");
        return createCommonCalledNode(name2, ctx2, object, args2, called);
      },
      concat(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("Array");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_array_concat");
        return createCommonCalledNode(name2, ctx2, object, args2, called);
      },
      every(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("Array");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_array_every");
        return createCommonCalledNode(name2, ctx2, object, args2, called);
      },
      some(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("Array");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_array_some");
        return createCommonCalledNode(name2, ctx2, object, args2, called);
      },
      forEach(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("Array");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_array_foreach");
        return createCommonCalledNode(name2, ctx2, object, args2, called);
      },
      flat(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("Array");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_array_flat");
        return createCommonCalledNode(name2, ctx2, object, args2, called);
      },
      flatMap(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("Array");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_array_flat_map");
        return createCommonCalledNode(name2, ctx2, object, args2, called);
      },
      reduce(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("Array");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_array_reduce");
        return createCommonCalledNode(name2, ctx2, object, args2, called);
      },
      reduceRight(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("Array");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_array_reduce_right");
        return createCommonCalledNode(name2, ctx2, object, args2, called);
      },
      fill(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("Array");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_array_fill");
        return createCommonCalledNode(name2, ctx2, object, args2, called);
      },
      sort(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("Array");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_array_sort");
        return createCommonCalledNode(name2, ctx2, object, args2, called);
      },
      join(ctx2, object, args2, called = false, isStatic = false) {
        if (!called)
          return ctx2.createChunkNode(`function($target,$delimiter){return implode($delimiter,$target);}`);
        object = createObjectNodeRefs(ctx2, object, "implode");
        return ctx2.createCalleeNode(
          ctx2.createIdentifierNode("implode"),
          args2.concat(object)
        );
      },
      entries(ctx2, object, args2, called = false, isStatic = false) {
        if (!called)
          return createMethodFunctionNode(ctx2, "array_values");
        object = createObjectNodeRefs(ctx2, object, "array_values");
        return ctx2.createCalleeNode(
          ctx2.createIdentifierNode("array_values"),
          [object]
        );
      },
      values(ctx2, object, args2, called = false, isStatic = false) {
        if (!called)
          return createMethodFunctionNode(ctx2, "array_values");
        object = createObjectNodeRefs(ctx2, object, "array_values");
        return ctx2.createCalleeNode(
          ctx2.createIdentifierNode("array_values"),
          [object]
        );
      },
      keys(ctx2, object, args2, called = false, isStatic = false) {
        if (!called)
          return createMethodFunctionNode(ctx2, "array_keys");
        object = createObjectNodeRefs(ctx2, object, "array_keys");
        return ctx2.createCalleeNode(
          ctx2.createIdentifierNode("array_keys"),
          [object]
        );
      },
      reverse(ctx2, object, args2, called = false, isStatic = false) {
        if (!called)
          return createMethodFunctionNode(ctx2, "array_reverse");
        object = createObjectNodeRefs(ctx2, object, "array_reverse");
        return ctx2.createCalleeNode(
          ctx2.createIdentifierNode("array_reverse"),
          args2.concat(object)
        );
      },
      includes(ctx2, object, args2, called = false, isStatic = false) {
        if (!called)
          return createMethodFunctionNode(ctx2, "in_array");
        object = createObjectNodeRefs(ctx2, object, "in_array");
        return ctx2.createCalleeNode(
          ctx2.createIdentifierNode("in_array"),
          args2.concat(object)
        );
      },
      length(ctx2, object, args2, called = false, isStatic = false) {
        const obj = createObjectNodeRefs(ctx2, object, "count");
        return ctx2.createCalleeNode(
          ctx2.createIdentifierNode("count"),
          [obj]
        );
      }
    };
    ["propertyIsEnumerable", "hasOwnProperty", "valueOf", "toLocaleString", "toString"].forEach((name2) => {
      if (!Object.prototype.hasOwnProperty.call(methods, name2)) {
        methods[name2] = ObjectMethod[name2];
      }
    });
    module2.exports = methods;
  }
});

// transforms/Base64.js
var require_Base64 = __commonJS({
  "transforms/Base64.js"(exports2, module2) {
    module2.exports = {
      decode(ctx2, object, args2, called = false, isStatic = false) {
        if (!called) {
          return ctx2.createChunkNode(`function($value){return base64_decode( $value );}`);
        }
        return ctx2.createCalleeNode(
          ctx2.createIdentifierNode("base64_decode"),
          args2
        );
      },
      encode(ctx2, object, args2, called = false, isStatic = false) {
        if (!called) {
          return ctx2.createChunkNode(`function($value){return base64_encode( $value );}`);
        }
        return ctx2.createCalleeNode(
          ctx2.createIdentifierNode("base64_encode"),
          args2
        );
      }
    };
  }
});

// transforms/Console.js
var require_Console = __commonJS({
  "transforms/Console.js"(exports2, module2) {
    module2.exports = {
      log(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("System");
        ctx2.addDepend(module3);
        if (!called) {
          return ctx2.createChunkNode(`function(...$args){System::print(...$args);}`);
        }
        return ctx2.createCalleeNode(
          ctx2.createStaticMemberNode([
            ctx2.createIdentifierNode("System"),
            ctx2.createIdentifierNode("print")
          ]),
          args2
        );
      },
      trace(ctx2, object, args2, called = false, isStatic = false) {
        return this.log(ctx2, object, args2, called, isStatic);
      }
    };
  }
});

// transforms/Number.js
var require_Number = __commonJS({
  "transforms/Number.js"(exports2, module2) {
    var ObjectMethod = require_Object();
    function createCommonCalledNode(name2, ctx2, object, args2, called = true) {
      if (!called) {
        return ctx2.createLiteralNode(name2.replace(/\\/g, "\\\\"));
      }
      return ctx2.createCalleeNode(
        ctx2.createIdentifierNode(name2),
        [object].concat(args2)
      );
    }
    var methods = {
      MAX_VALUE(ctx2) {
        return ctx2.createLiteralNode(`1.79E+308`, `1.79E+308`);
      },
      MIN_VALUE(ctx2) {
        return ctx2.createLiteralNode(`5e-324`, `5e-324`);
      },
      MAX_SAFE_INTEGER(ctx2) {
        return ctx2.createLiteralNode(`9007199254740991`, `9007199254740991`);
      },
      POSITIVE_INFINITY(ctx2) {
        return ctx2.createIdentifierNode(`Infinity`);
      },
      EPSILON(ctx2) {
        return ctx2.createLiteralNode(`2.220446049250313e-16`, `2.220446049250313e-16`);
      },
      isFinite(ctx2, object, args2, called = false, isStatic = false) {
        return createCommonCalledNode("is_finite", ctx2, object, args2, called);
      },
      isNaN(ctx2, object, args2, called = false, isStatic = false) {
        ctx2.addDepend(ctx2.builder.getGlobalModuleById("System"));
        if (!called) {
          ctx2.createChunkNode(`function($target){return System::isNaN($target);}`);
        }
        return ctx2.createCalleeNode(
          ctx2.createStaticMemberNode([
            ctx2.createIdentifierNode("System"),
            ctx2.createIdentifierNode("isNaN")
          ]),
          [object].concat(args2)
        );
      },
      isInteger(ctx2, object, args2, called = false, isStatic = false) {
        return createCommonCalledNode("is_int", ctx2, object, args2, called);
      },
      isSafeInteger(ctx2, object, args2, called = false, isStatic = false) {
        return createCommonCalledNode("is_int", ctx2, object, args2, called);
      },
      parseFloat(ctx2, object, args2, called = false, isStatic = false) {
        return createCommonCalledNode("floatval", ctx2, object, args2, called);
      },
      parseInt(ctx2, object, args2, called = false, isStatic = false) {
        return createCommonCalledNode("intval", ctx2, object, args2, called);
      },
      toFixed(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("Number");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_number_to_fixed");
        return createCommonCalledNode(name2, ctx2, object, args2, called);
      },
      toExponential(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("Number");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_number_to_exponential");
        return createCommonCalledNode(name2, ctx2, object, args2, called);
      },
      toPrecision(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("Number");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_number_to_precision");
        return createCommonCalledNode(name2, ctx2, object, args2, called);
      },
      valueOf(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("Number");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_number_value_of");
        return createCommonCalledNode(name2, ctx2, object, args2, called);
      }
    };
    ["propertyIsEnumerable", "hasOwnProperty", "toLocaleString", "toString"].forEach((name2) => {
      if (!Object.prototype.hasOwnProperty.call(methods, name2)) {
        methods[name2] = ObjectMethod[name2];
      }
    });
    module2.exports = methods;
  }
});

// transforms/Double.js
var require_Double = __commonJS({
  "transforms/Double.js"(exports2, module2) {
    module2.exports = require_Number();
  }
});

// transforms/Error.js
var require_Error = __commonJS({
  "transforms/Error.js"(exports2, module2) {
    module2.exports = {
      message(ctx2, object, args2, called = false, isStatic = false) {
        return ctx2.createCalleeNode(
          ctx2.createMemberNode([
            object,
            ctx2.createIdentifierNode("getMessage")
          ])
        );
      },
      cause(ctx2, object, args2, called = false, isStatic = false) {
        return ctx2.createCalleeNode(
          ctx2.createMemberNode([
            object,
            ctx2.createIdentifierNode("getPrevious")
          ])
        );
      },
      name(ctx2, object, args2, called = false, isStatic = false) {
        return ctx2.createCalleeNode(
          ctx2.createIdentifierNode("get_class"),
          [
            object
          ]
        );
      },
      toString(ctx2, object, args2, called = false, isStatic = false) {
        if (!called) {
          const Reflect2 = ctx2.builder.getGlobalModuleById("Reflect");
          ctx2.addDepend(Reflect2);
          return ctx2.createCalleeNode(
            ctx2.createStaticMemberNode(
              [
                ctx2.createIdentifierNode(
                  ctx2.getModuleReferenceName(Reflect2)
                ),
                ctx2.createIdentifierNode("get")
              ]
            ),
            [
              ctx2.createLiteralNode(null),
              object,
              ctx2.createIdentifierNode("__toString")
            ]
          );
        }
        return ctx2.createCalleeNode(
          ctx2.createMemberNode([
            object,
            ctx2.createIdentifierNode("__toString")
          ])
        );
      }
    };
  }
});

// transforms/Float.js
var require_Float = __commonJS({
  "transforms/Float.js"(exports2, module2) {
    module2.exports = require_Number();
  }
});

// transforms/Function.js
var require_Function = __commonJS({
  "transforms/Function.js"(exports2, module2) {
    var ObjectMethod = require_Object();
    function createCallNode(ctx2, target, args2) {
      ctx2.addDepend(ctx2.builder.getGlobalModuleById("Reflect"));
      return ctx2.createCalleeNode(
        ctx2.createStaticMemberNode([
          ctx2.createIdentifierNode("Reflect"),
          ctx2.createIdentifierNode("apply")
        ]),
        [target].concat(args2)
      );
    }
    var methods = {
      apply(ctx2, object, args2, called = false, isStatic = false) {
        const callee = object.type === "MemberExpression" ? object.object : object;
        if (!called) {
          return callee;
        }
        const _arguments = [args2[0]];
        if (args2.length > 1) {
          _arguments.push(ctx2.createArrayNode(args2.slice(1)));
        }
        return createCallNode(ctx2, callee, _arguments);
      },
      call(ctx2, object, args2, called = false, isStatic = false) {
        const callee = object.type === "MemberExpression" ? object.object : object;
        if (!called) {
          return callee;
        }
        const _arguments = [args2[0]];
        if (args2.length > 1) {
          _arguments.push(ctx2.createArrayNode(args2.slice(1)));
        }
        return createCallNode(ctx2, callee, _arguments);
      },
      bind(ctx2, object, args2, called = false, isStatic = false) {
        args2 = args2.slice();
        ctx2.addDepend(ctx2.builder.getGlobalModuleById("System"));
        if (!called) {
          return ctx2.createArrayNode([
            ctx2.createClassRefsNode(ctx2.builder.getGlobalModuleById("System")),
            ctx2.createLiteralNode("bind")
          ]);
        }
        const _arguments = ctx2.stack.arguments || [];
        let flagNode = ctx2.createLiteralNode(null);
        if (_arguments[0]) {
          const type = ctx2.inferType(_arguments[0]);
          if (type.isLiteralArrayType || ctx2.builder.getGlobalModuleById("Array") === ctx2.stack.compiler.callUtils("getOriginType", type)) {
            flagNode = ctx2.createLiteralNode(true);
          } else if (!type.isAnyType) {
            flagNode = ctx2.createLiteralNode(false);
          }
        }
        args2.splice(1, 0, flagNode);
        if (object.type === "MemberExpression") {
          object = ctx2.createArrayNode([object.object, object.createLiteralNode(object.property.value)]);
        }
        return ctx2.createCalleeNode(
          ctx2.createStaticMemberNode([
            ctx2.createIdentifierNode("System"),
            ctx2.createIdentifierNode("bind")
          ]),
          [object].concat(args2)
        );
      }
    };
    ["propertyIsEnumerable", "hasOwnProperty", "valueOf", "toLocaleString", "toString"].forEach((name2) => {
      if (!Object.prototype.hasOwnProperty.call(methods, name2)) {
        methods[name2] = ObjectMethod[name2];
      }
    });
    module2.exports = methods;
  }
});

// helper/date.js
var require_date = __commonJS({
  "helper/date.js"(exports2, module2) {
    var replace_format = {
      "YYYY": "Y",
      "YY": "y",
      "MM": "m",
      "M": "n",
      "Mo": "mS",
      "MMM": "M",
      "MMMM": "F",
      "DD": "d",
      "Do": "jS",
      "D": "j",
      "DDD": "z",
      "DDDo": "zS",
      "DDDD": "z",
      "d": "w",
      "do": "wS",
      "dd": "D",
      "ddd": "D",
      "dddd": "l",
      "e": "w",
      "E": "N",
      "w": "W",
      "wo": "WS",
      "GG": "y",
      "GGGG": "Y",
      "A": "A",
      "a": "a",
      "HH": "H",
      "H": "G",
      "hh": "h",
      "h": "g",
      "mm": "i",
      "ss": "s",
      "Z": "P",
      "ZZ": "O",
      "X": "U",
      "LTS": "g:i:s A",
      "LT": "g:i A",
      "L": "m/d/Y",
      "l": "n/j/Y",
      "LL": "F jS Y",
      "ll": "M j Y",
      "LLL": "F jS Y g:i A",
      "lll": "M j Y g:i A",
      "LLLL": "l, F jS Y g:i A",
      "llll": "D, M j Y g:i A"
    };
    var allow_format_chars = "mdewgahksxolMQDEWYGAHSZXLT".split("").map((char) => char.charCodeAt(0));
    var not_support_parting = ["k", "kk", "ww", "s", "m", "x", "Q", "Qo"];
    function isZm(code) {
      return code >= 65 && code <= 90 || code >= 97 && code <= 122;
    }
    function isAllowFormat(code) {
      return allow_format_chars.includes(code);
    }
    function parseFormat(format) {
      const group = [];
      const len = format.length;
      var index = 0;
      var parting = "";
      var last = null;
      while (index < len) {
        let code = format.charCodeAt(index);
        if (last !== 92 && isAllowFormat(code) && (last === code || code === 111 || parting === "")) {
          parting += format[index];
        } else {
          const char = isZm(code) && last !== 92 && !isAllowFormat(code) ? "\\" + format[index] : format[index];
          if (last !== 92 && (isAllowFormat(last) || isAllowFormat(code))) {
            if (parting)
              group.push(parting);
            parting = char;
          } else {
            parting += char;
          }
        }
        index++;
        last = code;
      }
      if (parting)
        group.push(parting);
      return group;
    }
    function createDateNode(ctx2, format, args2 = []) {
      const node = ctx2.createLiteralNode(format);
      if (/\\/.test(format)) {
        node.raw = `"${format}"`;
      }
      return ctx2.createCalleeNode(
        ctx2.createIdentifierNode("date"),
        [node].concat(args2)
      );
    }
    function createFixNode(ctx2, format, now) {
      switch (format) {
        case "k":
        case "kk":
          return ctx2.createCalleeNode(
            ctx2.createIdentifierNode("sprintf"),
            [
              ctx2.createLiteralNode(format === "kk" ? "%02d" : "%d"),
              ctx2.createBinaryNode(
                "+",
                ctx2.createCalleeNode(
                  ctx2.createIdentifierNode("intval"),
                  [createDateNode(ctx2, "G", now)]
                ),
                ctx2.createLiteralNode(1)
              )
            ]
          );
        case "ww":
          return ctx2.createCalleeNode(
            ctx2.createIdentifierNode("sprintf"),
            [
              ctx2.createLiteralNode("%02d"),
              createDateNode(ctx2, "W", now)
            ]
          );
        case "s":
        case "m":
          return ctx2.createCalleeNode(
            ctx2.createIdentifierNode("ltrim"),
            [
              createDateNode(ctx2, format === "m" ? "i" : "s", now),
              ctx2.createLiteralNode("0")
            ]
          );
        case "x":
          return ctx2.createCalleeNode(
            ctx2.createIdentifierNode("sprintf"),
            [
              ctx2.createLiteralNode("%d%03d"),
              createDateNode(ctx2, "U", now),
              ctx2.createBinaryNode(
                "/",
                ctx2.createCalleeNode(
                  ctx2.createIdentifierNode("date_format"),
                  [
                    ctx2.createCalleeNode(ctx2.createIdentifierNode("date_create"), now),
                    ctx2.createLiteralNode("u")
                  ]
                ),
                ctx2.createLiteralNode(1e3)
              )
            ]
          );
        case "E":
          return ctx2.createCalleeNode(
            ctx2.createIdentifierNode("sprintf"),
            [
              ctx2.createLiteralNode("%d"),
              ctx2.createBinaryNode(
                "+",
                ctx2.createCalleeNode(
                  ctx2.createIdentifierNode("intval"),
                  [createDateNode(ctx2, "w", now)]
                ),
                ctx2.createLiteralNode(1)
              )
            ]
          );
        case "Q":
        case "Qo":
          return ctx2.createCalleeNode(
            ctx2.createIdentifierNode("sprintf"),
            [
              ctx2.createLiteralNode(format === "Qo" ? "%d%s" : "%d"),
              ctx2.createCalleeNode(
                ctx2.createIdentifierNode("ceil"),
                [
                  ctx2.createBinaryNode(
                    "/",
                    ctx2.createCalleeNode(
                      ctx2.createIdentifierNode("intval"),
                      [createDateNode(ctx2, "n", now)]
                    ),
                    ctx2.createLiteralNode(3)
                  )
                ]
              ),
              format === "Qo" && createDateNode(ctx2, "S", now)
            ].filter((item) => !!item)
          );
      }
      if (format.charCodeAt(0) === 83) {
        const len = format.length;
        return ctx2.createCalleeNode(
          ctx2.createIdentifierNode("sprintf"),
          [
            len > 3 ? ctx2.createLiteralNode(`%-\\'0${len}s`) : ctx2.createLiteralNode(`%0${len}d`),
            ctx2.createCalleeNode(
              ctx2.createIdentifierNode("round"),
              [
                ctx2.createBinaryNode(
                  "/",
                  ctx2.createCalleeNode(
                    ctx2.createIdentifierNode("date_format"),
                    [
                      ctx2.createCalleeNode(ctx2.createIdentifierNode("date_create"), now),
                      ctx2.createLiteralNode("u")
                    ]
                  ),
                  ctx2.createLiteralNode(Math.pow(10, Math.max(6 - len, 3)))
                )
              ]
            )
          ]
        );
      }
      if (/[^\\][a-zA-Z]+/.test(format)) {
        return createDateNode(ctx2, format, now);
      } else {
        return ctx2.createLiteralNode(format);
      }
    }
    function createCalleeNode(ctx2, args2) {
      const group = parseFormat(args2[0].value);
      const segments = [];
      var now = args2.slice(1, 2);
      var format = "";
      group.forEach((parting) => {
        if (not_support_parting.includes(parting) || parting.charCodeAt(0) === 83) {
          if (format)
            segments.push(format);
          format = "";
          segments.push(parting);
        } else {
          format += replace_format[parting] || parting;
        }
      });
      if (format)
        segments.push(format);
      if (segments.length > 1) {
        let base = null;
        const node = createFixNode(ctx2, segments.pop(), now);
        while (segments.length > 0) {
          base = ctx2.createBinaryNode(".", createFixNode(base || ctx2, segments.pop(), now), base || node);
        }
        return base;
      }
      return createDateNode(ctx2, segments[0], now);
    }
    module2.exports = createCalleeNode;
  }
});

// transforms/global.js
var require_global = __commonJS({
  "transforms/global.js"(exports2, module2) {
    var createDateNode = require_date();
    module2.exports = {
      // date(ctx, object, args, called=false, isStatic=false){
      //     if( args[0] && args[0].type === 'Literal' && !/(?![\\])(DDDo|Mo|do|dd|wo|Wo)/.test( args[0].value ) ){
      //         return createDateNode(ctx, args);
      //     }else{
      //         const module = ctx.builder.getGlobalModuleById('System');
      //         ctx.addDepend( module );
      //         const dependencies = ctx.builder.plugin.options.dependencies || {};
      //         ctx.builder.addDependencyForComposer( dependencies['moment'] );
      //         ctx.callee = ctx.createStaticMemberNode([
      //             ctx.createIdentifierNode( ctx.getModuleReferenceName(module) ),
      //             ctx.createIdentifierNode('date')
      //         ]);
      //         ctx.arguments = args;
      //         return ctx;
      //     }
      // },
      setInterval(ctx2, object, args2, called = false, isStatic = false) {
        ctx2.callee = ctx2.createIdentifierNode("call_user_func");
        ctx2.arguments = args2.slice(0, 1);
        return ctx2;
      },
      setTimeout(ctx2, object, args2, called = false, isStatic = false) {
        ctx2.callee = ctx2.createIdentifierNode("call_user_func");
        ctx2.arguments = args2.slice(0, 1);
        return ctx2;
      },
      clearTimeout(ctx2, object, args2, called = false, isStatic = false) {
        return null;
      },
      clearInterval(ctx2, object, args2, called = false, isStatic = false) {
        return null;
      },
      parseInt(ctx2, object, args2, called = false, isStatic = false) {
        if (called) {
          ctx2.callee = ctx2.createIdentifierNode("intval");
          ctx2.arguments = args2.slice(0, 2);
          return ctx2;
        } else {
          return null;
        }
      },
      parseFloat(ctx2, object, args2, called = false, isStatic = false) {
        if (called) {
          ctx2.callee = ctx2.createIdentifierNode("floatval");
          ctx2.arguments = args2.slice(0, 1);
          return ctx2;
        } else {
          return null;
        }
      },
      isNaN(ctx2, object, args2, called = false, isStatic = false) {
        ctx2.addDepend(ctx2.builder.getGlobalModuleById("System"));
        if (!called) {
          ctx2.createChunkNode(`function($target){return System::isNaN($target);}`);
        }
        return ctx2.createCalleeNode(
          ctx2.createStaticMemberNode([
            ctx2.createIdentifierNode("System"),
            ctx2.createIdentifierNode("isNaN")
          ]),
          args2
        );
      },
      isFinite(ctx2, object, args2, called = false, isStatic = false) {
        if (!called) {
          return ctx2.createLiteralNode("is_finite");
        }
        ctx2.callee = ctx2.createIdentifierNode("is_finite");
        ctx2.arguments = args2.slice(0, 1);
        return ctx2;
      }
    };
  }
});

// transforms/IArguments.js
var require_IArguments = __commonJS({
  "transforms/IArguments.js"(exports2, module2) {
    var ObjectMethod = require_Object();
    var methods = {
      length(ctx2, object, args2, called = false, isStatic = false) {
        return ctx2.createCalleeNode(ctx2.createIdentifierNode("func_num_args"));
      },
      $computed(ctx2, object, args2, called = false, isStatic = false) {
        return ctx2.createCalleeNode(ctx2.createIdentifierNode("func_get_arg"), args2);
      }
    };
    ["propertyIsEnumerable", "hasOwnProperty", "valueOf", "toLocaleString", "toString"].forEach((name2) => {
      if (!Object.prototype.hasOwnProperty.call(methods, name2)) {
        methods[name2] = ObjectMethod[name2];
      }
    });
    module2.exports = methods;
  }
});

// transforms/Int.js
var require_Int = __commonJS({
  "transforms/Int.js"(exports2, module2) {
    module2.exports = require_Number();
  }
});

// transforms/JSON.js
var require_JSON = __commonJS({
  "transforms/JSON.js"(exports2, module2) {
    module2.exports = {
      parse(ctx2, object, args2, called = false, isStatic = false) {
        if (!called) {
          return ctx2.createChunkNode(`function($target){return json_decode($target);}`);
        }
        return ctx2.createCalleeNode(
          ctx2.createIdentifierNode("json_decode"),
          args2.slice(0, 1)
        );
      },
      stringify(ctx2, object, args2, called = false, isStatic = false) {
        if (!called) {
          return ctx2.createChunkNode(`function($target){return json_encode($target,JSON_UNESCAPED_UNICODE);}`);
        }
        return ctx2.createCalleeNode(
          ctx2.createIdentifierNode("json_encode"),
          args2.slice(0, 1).concat(ctx2.createIdentifierNode(`JSON_UNESCAPED_UNICODE`))
        );
      }
    };
  }
});

// transforms/Math.js
var require_Math = __commonJS({
  "transforms/Math.js"(exports2, module2) {
    function createCommonCalledNode(name2, ctx2, object, args2, called, params) {
      if (!called) {
        return createCalleeFunctionNode(ctx2, params || ["value"], name2);
      }
      let len = 1;
      if (params && Array.isArray(params)) {
        len = params[0] === "..." ? args2.length : params.length;
      }
      return ctx2.createCalleeNode(
        ctx2.createIdentifierNode(name2),
        args2.slice(0, len)
      );
    }
    function createCalleeFunctionNode(ctx2, args2, callName) {
      const cratePparams = () => args2.map((name2) => {
        if (name2 === "...") {
          const node = ctx2.createNode("RestElement");
          node.value = "args";
          node.raw = "args";
          return node;
        }
        return ctx2.createIdentifierNode(name2, null, true);
      });
      return ctx2.createFunctionNode((ctx3) => {
        ctx3.body.push(
          ctx3.createReturnNode(
            ctx3.createCalleeNode(
              ctx3.createIdentifierNode(callName),
              cratePparams()
            )
          )
        );
      }, cratePparams());
    }
    module2.exports = {
      E(ctx2) {
        return ctx2.createLiteralNode(2.718281828459045);
      },
      LN10(ctx2) {
        return ctx2.createLiteralNode(2.302585092994046);
      },
      LN2(ctx2) {
        return ctx2.createLiteralNode(0.6931471805599453);
      },
      LOG2E(ctx2) {
        return ctx2.createLiteralNode(1.4426950408889634);
      },
      LOG10E(ctx2) {
        return ctx2.createLiteralNode(0.4342944819032518);
      },
      PI(ctx2) {
        return ctx2.createLiteralNode(3.141592653589793);
      },
      SQRT1_2(ctx2) {
        return ctx2.createLiteralNode(0.7071067811865476);
      },
      SQRT2(ctx2) {
        return ctx2.createLiteralNode(1.4142135623730951);
      },
      abs(ctx2, object, args2, called = false, isStatic = false) {
        return createCommonCalledNode("abs", ctx2, object, args2, called);
      },
      acos(ctx2, object, args2, called = false, isStatic = false) {
        return createCommonCalledNode("acos", ctx2, object, args2, called);
      },
      asin(ctx2, object, args2, called = false, isStatic = false) {
        return createCommonCalledNode("asin", ctx2, object, args2, called);
      },
      atan2(ctx2, object, args2, called = false, isStatic = false) {
        return createCommonCalledNode("atan2", ctx2, object, args2, called, ["a", "b"]);
      },
      ceil(ctx2, object, args2, called = false, isStatic = false) {
        return createCommonCalledNode("ceil", ctx2, object, args2, called);
      },
      cos(ctx2, object, args2, called = false, isStatic = false) {
        return createCommonCalledNode("cos", ctx2, object, args2, called);
      },
      log(ctx2, object, args2, called = false, isStatic = false) {
        return createCommonCalledNode("log", ctx2, object, args2, called);
      },
      max(ctx2, object, args2, called = false, isStatic = false) {
        return createCommonCalledNode("max", ctx2, object, args2, called, ["..."]);
      },
      min(ctx2, object, args2, called = false, isStatic = false) {
        return createCommonCalledNode("min", ctx2, object, args2, called, ["..."]);
      },
      pow(ctx2, object, args2, called = false, isStatic = false) {
        return createCommonCalledNode("pow", ctx2, object, args2, called, ["a", "b"]);
      },
      sin(ctx2, object, args2, called = false, isStatic = false) {
        return createCommonCalledNode("sin", ctx2, object, args2, called);
      },
      sqrt(ctx2, object, args2, called = false, isStatic = false) {
        return createCommonCalledNode("sqrt", ctx2, object, args2, called);
      },
      tan(ctx2, object, args2, called = false, isStatic = false) {
        return createCommonCalledNode("tan", ctx2, object, args2, called);
      },
      round(ctx2, object, args2, called = false, isStatic = false) {
        return createCommonCalledNode("round", ctx2, object, args2, called);
      },
      floor(ctx2, object, args2, called = false, isStatic = false) {
        return createCommonCalledNode("floor", ctx2, object, args2, called);
      },
      random(ctx2, object, args2, called = false, isStatic = false) {
        if (!called) {
          return ctx2.createChunkNode(`function(){return mt_rand(1,2147483647) / 2147483647;}`);
        }
        return ctx2.createChunkNode(`(mt_rand(1,2147483647) / 2147483647)`);
      }
    };
  }
});

// transforms/String.js
var require_String = __commonJS({
  "transforms/String.js"(exports2, module2) {
    var ObjectMethod = require_Object();
    function createMethodFunctionNode(ctx2, name2) {
      return ctx2.createLiteralNode(name2);
    }
    function createCommonCalledNode(name2, ctx2, object, args2, called) {
      if (!called)
        return createMethodFunctionNode(ctx2, name2);
      return ctx2.createCalleeNode(
        ctx2.createIdentifierNode(name2),
        object ? [object].concat(args2) : args2
      );
    }
    var methods = {
      fromCharCode(ctx2, object, args2, called = false, isStatic = false) {
        if (!called) {
          return ctx2.createChunkNode(`function($code){return chr($code);}`);
        }
        if (args2.length === 1) {
          return createCommonCalledNode("chr", ctx2, null, args2, true);
        }
        const module3 = ctx2.builder.getGlobalModuleById("String");
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_string_from_char_code");
        ctx2.addDepend(module3);
        return createCommonCalledNode(name2, ctx2, null, args2, true);
      },
      charAt(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("String");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_string_char_at");
        return createCommonCalledNode(name2, ctx2, object, args2, called);
      },
      charCodeAt(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("String");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_string_char_code_at");
        return createCommonCalledNode(name2, ctx2, object, args2, called);
      },
      concat(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("String");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_string_concat");
        return createCommonCalledNode(name2, ctx2, object, args2, called);
      },
      includes(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("String");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_string_includes");
        return createCommonCalledNode(name2, ctx2, object, args2, called);
      },
      indexOf(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("String");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_string_index_of");
        return createCommonCalledNode(name2, ctx2, object, args2, called);
      },
      lastIndexOf(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("String");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_string_last_index_of");
        return createCommonCalledNode(name2, ctx2, object, args2, called);
      },
      localeCompare(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("String");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_string_locale_compare");
        return createCommonCalledNode(name2, ctx2, object, args2, called);
      },
      match(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("String");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_string_match");
        return createCommonCalledNode(name2, ctx2, object, args2, called);
      },
      matchAll(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("String");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_string_match_all");
        return createCommonCalledNode(name2, ctx2, object, args2, called);
      },
      search(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("String");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_string_search");
        return createCommonCalledNode(name2, ctx2, object, args2, called);
      },
      replace(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("String");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_string_replace");
        return createCommonCalledNode(name2, ctx2, object, args2, called);
      },
      replaceAll(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("String");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_string_replace_all");
        return createCommonCalledNode(name2, ctx2, object, args2, called);
      },
      slice(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("String");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_string_slice");
        return createCommonCalledNode(name2, ctx2, object, args2, called);
      },
      repeat(ctx2, object, args2, called = false, isStatic = false) {
        return createCommonCalledNode("str_repeat", ctx2, object, args2, called);
      },
      length(ctx2, object, args2, called = false, isStatic = false) {
        return createCommonCalledNode("mb_strlen", ctx2, object, args2, true);
      },
      substr(ctx2, object, args2, called = false, isStatic = false) {
        return createCommonCalledNode("mb_substr", ctx2, object, args2, called);
      },
      substring(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("String");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_string_substring");
        return createCommonCalledNode(name2, ctx2, object, args2, called);
      },
      toLowerCase(ctx2, object, args2, called = false, isStatic = false) {
        return createCommonCalledNode("mb_strtolower", ctx2, object, args2, called);
      },
      toLocaleLowerCase(ctx2, object, args2, called = false, isStatic = false) {
        return createCommonCalledNode("mb_strtolower", ctx2, object, args2, called);
      },
      toUpperCase(ctx2, object, args2, called = false, isStatic = false) {
        return createCommonCalledNode("mb_strtoupper", ctx2, object, args2, called);
      },
      toLocaleUpperCase(ctx2, object, args2, called = false, isStatic = false) {
        return createCommonCalledNode("mb_strtoupper", ctx2, object, args2, called);
      },
      trim(ctx2, object, args2, called = false, isStatic = false) {
        return createCommonCalledNode("trim", ctx2, object, args2, called);
      },
      trimEnd(ctx2, object, args2, called = false, isStatic = false) {
        return createCommonCalledNode("rtrim", ctx2, object, args2, called);
      },
      trimStart(ctx2, object, args2, called = false, isStatic = false) {
        return createCommonCalledNode("ltrim", ctx2, object, args2, called);
      },
      split(ctx2, object, args2, called = false, isStatic = false) {
        if (!called) {
          return ctx2.createChunkNode(`function($target,$delimit){return explode($delimit,$target);}`);
        }
        return ctx2.createCalleeNode(
          ctx2.createIdentifierNode("explode"),
          [args2[0], object]
        );
      },
      padStart(ctx2, object, args2, called = false, isStatic = false) {
        return createCommonCalledNode("str_pad", ctx2, object, [args2[0], ctx2.createIdentifierNode("STR_PAD_LEFT")], called);
      },
      padEnd(ctx2, object, args2, called = false, isStatic = false) {
        return createCommonCalledNode("str_pad", ctx2, object, [args2[0], ctx2.createIdentifierNode("STR_PAD_RIGHT")], called);
      },
      normalize(ctx2, object, args2, called = false, isStatic = false) {
        const module3 = ctx2.builder.getGlobalModuleById("String");
        ctx2.addDepend(module3);
        const name2 = ctx2.builder.getModuleNamespace(module3, "es_string_normalize");
        return createCommonCalledNode(name2, ctx2, object, args2, called);
      },
      valueOf(ctx2, object, args2, called = false, isStatic = false) {
        if (!called) {
          return ctx2.createChunkNode(`function($target){return $target;}`);
        }
        return createCommonCalledNode("strval", ctx2, object, [], called);
      }
    };
    ["propertyIsEnumerable", "hasOwnProperty", "valueOf", "toLocaleString", "toString"].forEach((name2) => {
      if (!Object.prototype.hasOwnProperty.call(methods, name2)) {
        methods[name2] = ObjectMethod[name2];
      }
    });
    module2.exports = methods;
  }
});

// transforms/Uint.js
var require_Uint = __commonJS({
  "transforms/Uint.js"(exports2, module2) {
    module2.exports = require_Number();
  }
});

// transforms/index.js
var require_transforms = __commonJS({
  "transforms/index.js"(exports2, module2) {
    var modules2 = /* @__PURE__ */ new Map();
    modules2.set("Array", require_Array());
    modules2.set("Base64", require_Base64());
    modules2.set("Console", require_Console());
    modules2.set("Double", require_Double());
    modules2.set("Error", require_Error());
    modules2.set("Float", require_Float());
    modules2.set("Function", require_Function());
    modules2.set("global", require_global());
    modules2.set("IArguments", require_IArguments());
    modules2.set("Int", require_Int());
    modules2.set("JSON", require_JSON());
    modules2.set("Math", require_Math());
    modules2.set("Number", require_Number());
    modules2.set("Object", require_Object());
    modules2.set("String", require_String());
    modules2.set("Uint", require_Uint());
    module2.exports = modules2;
  }
});

// core/Transform.js
var require_Transform = __commonJS({
  "core/Transform.js"(exports2, module2) {
    module2.exports = require_transforms();
  }
});

// core/JSXClassBuilder.js
var require_JSXClassBuilder = __commonJS({
  "core/JSXClassBuilder.js"(exports2, module2) {
    var ClassBuilder2 = require_ClassBuilder();
    var JSXClassBuilder2 = class extends ClassBuilder2 {
      getReserved() {
        return null;
      }
      createClassMemebers(stack) {
        if (this.compilation.JSX) {
          this.compilation.stack.scripts.forEach((item) => {
            if (item.isJSXScript && item.isScriptProgram) {
              super.createClassMemebers(item);
            }
          });
        } else {
          super.createClassMemebers(stack);
        }
      }
    };
    module2.exports = JSXClassBuilder2;
  }
});

// core/JSXTransform.js
var require_JSXTransform = __commonJS({
  "core/JSXTransform.js"(exports2, module2) {
    var Token2 = require_Token();
    var JSXClassBuilder2 = require_JSXClassBuilder();
    var Transform2 = require_Transform();
    var JSXTransform2 = class extends Token2 {
      constructor(stack, ctx2) {
        super(stack.toString());
        this.stack = stack;
        this.scope = stack.scope;
        this.compilation = stack.compilation;
        this.compiler = stack.compiler;
        this.module = stack.module;
        this.plugin = ctx2.plugin;
        this.name = ctx2.name;
        this.platform = ctx2.platform;
        this.parent = ctx2;
        this.builder = ctx2.builder;
      }
      makeConfig(data2) {
        const items = [];
        Object.entries(data2).map((item) => {
          const [key, value2] = item;
          if (value2) {
            if (Array.isArray(value2)) {
              if (value2.length > 0) {
                const isObject = value2[0].type === "Property";
                if (isObject) {
                  items.push(this.createPropertyNode(this.createLiteralNode(key), this.createObjectNode(value2)));
                } else {
                  items.push(this.createPropertyNode(this.createLiteralNode(key), this.createArrayNode(value2)));
                }
              }
            } else {
              if (value2.type === "Property") {
                items.push(value2);
              } else {
                items.push(this.createPropertyNode(this.createLiteralNode(key), value2));
              }
            }
          }
        });
        return items.length > 0 ? this.createObjectNode(items) : null;
      }
      makeAttributes(stack, childNodes, data2, spreadAttributes) {
        const pushEvent = (name2, callback, category) => {
          const events = data2[category] || (data2[category] = []);
          const property = this.createPropertyNode(name2, callback);
          if (property.key.computed) {
            property.computed = true;
            property.key.computed = false;
          }
          events.push(property);
        };
        const toFun = (item, content) => {
          if (item.value.isJSXExpressionContainer) {
            const expr = item.value.expression;
            if (expr.isAssignmentExpression) {
              return this.createFunBindNode(
                this.createFunctionNode((block) => {
                  block.body = [
                    content
                  ];
                }),
                this.createThisNode()
              );
            }
          }
          return content;
        };
        stack.openingElement.attributes.forEach((item) => {
          if (item.isAttributeXmlns || item.isAttributeDirective) {
            if (item.isAttributeDirective) {
              const name3 = item.name.value();
              if (name3 === "show") {
                data2.directives.push(
                  this.createObjectNode([
                    this.createPropertyNode(this.createIdentifierNode("name"), this.createLiteralNode("show")),
                    this.createPropertyNode(this.createIdentifierNode("value"), this.createToken(item.valueArgument.expression))
                  ])
                );
              }
            }
            return;
          } else if (item.isJSXSpreadAttribute) {
            spreadAttributes && spreadAttributes.push(this.createToken(item));
            return;
          } else if (item.isAttributeSlot) {
            const name3 = item.name.value();
            const scopeName = item.value ? item.value.value() : null;
            if (scopeName) {
              data2.scopedSlots.push(
                this.createPropertyNode(
                  this.createIdentifierNode(name3),
                  this.createFunctionNode(
                    (ctx2) => {
                      ctx2.body.push(
                        ctx2.createReturnNode(childNodes ? childNodes : ctx2.createLiteralNode(null))
                      );
                    },
                    [this.createIdentifierNode(scopeName)]
                  )
                )
              );
            } else {
              data2.slot = this.createLiteralNode(name3);
            }
            return;
          }
          let value2 = this.createToken(item);
          if (!value2)
            return;
          let ns = value2.namespace;
          let name2 = value2.name.name;
          if (ns && ns.includes("::")) {
            let [seg, className] = ns.split("::", 2);
            ns = seg;
            const refsModule = stack.getModuleById(className);
            const moduleClass = this.getModuleReferenceName(refsModule);
            this.addDepend(refsModule);
            name2 = this.createStaticMemberNode([
              this.createIdentifierNode(moduleClass),
              name2
            ], name2);
            name2.computed = true;
          }
          if (ns === "@events") {
            pushEvent(name2, toFun(item, value2.value), "on");
            return;
          } else if (ns === "@natives") {
            pushEvent(name2, toFun(item, value2.value), "nativeOn");
            return;
          } else if (ns === "@binding") {
            data2.directives.push(
              this.createObjectNode([
                this.createPropertyNode(this.createIdentifierNode("name"), this.createLiteralNode("model")),
                this.createPropertyNode(this.createIdentifierNode("value"), value2.value)
              ])
            );
            const funNode = this.createFunctionNode(
              (block) => {
                block.body = [
                  block.createStatementNode(
                    block.createAssignmentNode(
                      value2.value,
                      block.createChunkNode(`event && event.target && event.target.nodeType===1 ? event.target.value : event`, false)
                    )
                  )
                ];
              },
              [this.createIdentifierNode("event")]
            );
            pushEvent(this.createIdentifierNode("input"), funNode, "on");
          }
          let propName = name2 = value2.name.value;
          if (item.isMemberProperty) {
            let isDOMAttribute = false;
            let attrDesc = item.getAttributeDescription(stack.getSubClassDescription());
            if (attrDesc) {
              isDOMAttribute = attrDesc.annotations.some((item2) => item2.name.toLowerCase() === "domattribute");
              const alias = attrDesc.annotations.find((item2) => item2.name.toLowerCase() === "alias");
              if (alias) {
                const args2 = alias.getArguments();
                if (args2.length > 0) {
                  propName = args2[0].value;
                }
              }
            }
            if (!isDOMAttribute) {
              data2.props.push(this.createPropertyNode(this.createPropertyKeyNode(propName, value2.name.stack), value2.value));
              return;
            }
          }
          const property = this.createPropertyNode(this.createPropertyKeyNode(propName, value2.name.stack), value2.value);
          switch (name2) {
            case "class":
            case "style":
            case "key":
            case "ref":
            case "refInFor":
            case "tag":
            case "staticStyle":
            case "staticClass":
              data2[name2] = property;
              break;
            case "innerHTML":
              data2.domProps.push(property);
              break;
            case "value":
            default:
              data2.attrs.push(property);
          }
        });
      }
      createFunBindNode(target, thisArg, args2 = []) {
        this.addDepend(this.builder.getGlobalModuleById("System"));
        return this.createCalleeNode(
          this.createStaticMemberNode([
            this.createIdentifierNode("System"),
            this.createIdentifierNode("bind")
          ]),
          [
            target,
            thisArg
          ].concat(args2.map((item) => {
            const obj = item instanceof Token2 ? item : this.createIdentifierNode(item, null, true);
            obj.isVariable = true;
            return obj;
          }))
        );
      }
      createPropertyKeyNode(name2, stack) {
        return this.createLiteralNode(name2, void 0, stack);
      }
      makeProperties(children, data2) {
        children.forEach((child) => {
          if (child.isProperty) {
            const node = this.createToken(child);
            data2.props.push(this.createPropertyNode(node.name, node.value));
          } else if (child.isSlot) {
          }
        });
      }
      makeDirectives(child, element, prevResult) {
        if (!element)
          return null;
        const cmd = [];
        let content = [element];
        if (!child.directives || !(child.directives.length > 0)) {
          return { cmd, child, content };
        }
        const directives = child.directives.slice(0).sort((a, b) => {
          const name2 = b.name.value();
          return name2 === "each" || name2 === "for" ? -1 : 0;
        });
        let ctx2 = element.jsxTransformNode || this;
        while (directives.length > 0) {
          const directive = directives.shift();
          const name2 = directive.name.value();
          const valueArgument = directive.valueArgument;
          if (name2 === "each" || name2 === "for") {
            let refs = ctx2.createToken(valueArgument.expression);
            let desc2 = valueArgument.expression.isStack && valueArgument.expression.description();
            let item = valueArgument.declare.item;
            let key = valueArgument.declare.key;
            let index = valueArgument.declare.index;
            if (cmd.includes("if")) {
              cmd.pop();
              content.push(ctx2.createLiteralNode(null));
              content[0] = ctx2.cascadeConditionalNode(content);
            }
            if (name2 === "each") {
              content[0] = ctx2.createIterationNode(name2, refs, desc2, ctx2.checkRefsName("_refs"), content[0], item, key);
            } else {
              content[0] = ctx2.createIterationNode(name2, refs, desc2, ctx2.checkRefsName("_refs"), content[0], item, key, index);
            }
            cmd.push(name2);
          } else if (name2 === "if") {
            const node = ctx2.createNode("ConditionalExpression");
            node.test = ctx2.createToken(valueArgument.expression);
            node.consequent = content[0];
            content[0] = node;
            cmd.push(name2);
          } else if (name2 === "elseif") {
            if (!prevResult || !(prevResult.cmd.includes("if") || prevResult.cmd.includes("elseif"))) {
              directive.name.error(1114, name2);
            } else {
              cmd.push(name2);
            }
            const node = ctx2.createNode("ConditionalExpression");
            node.test = ctx2.createToken(valueArgument.expression);
            node.consequent = content[0];
            content[0] = node;
          } else if (name2 === "else") {
            if (!prevResult || !(prevResult.cmd.includes("if") || prevResult.cmd.includes("elseif"))) {
              directive.name.error(1114, name2);
            } else {
              cmd.push(name2);
            }
          }
        }
        return { cmd, child, content };
      }
      cascadeConditionalNode(elements) {
        if (elements.length < 2) {
          throw new Error("Invaild expression");
        }
        let lastElement = elements.pop();
        while (elements.length > 0) {
          const _last = elements.pop();
          if (_last.type === "ConditionalExpression") {
            _last.alternate = lastElement;
            lastElement = _last;
          } else {
            throw new Error("Invaild expression");
          }
        }
        return lastElement;
      }
      makeChildren(children, data2) {
        const content = [];
        const part = [];
        let len = children.length;
        let index = 0;
        let last = null;
        let result = null;
        const next = () => {
          if (index < len) {
            const child = children[index++];
            const elem = this.makeDirectives(child, this.createToken(child), last) || next();
            if (!elem)
              return null;
            if (child.isSlot && !child.isSlotDeclared) {
              const name2 = child.openingElement.name.value();
              if (child.attributes.length > 0) {
                data2.scopedSlots.push(this.createPropertyNode(this.createLiteralNode(name2), elem.content[0]));
                return next();
              }
            } else if (child.isDirective) {
              let last2 = elem;
              let valueGroup = [];
              last2.cmd.push(child.openingElement.name.value());
              while (true) {
                const maybeChild = index < len && children[index].isDirective ? children[index++] : null;
                const maybe = maybeChild ? this.makeDirectives(maybeChild, this.createToken(maybeChild), last2) : null;
                const hasIf = last2.cmd.includes("if");
                const isDirective = maybe && maybe.child.isDirective;
                if (isDirective) {
                  maybe.cmd.push(maybeChild.openingElement.name.value());
                }
                if (hasIf) {
                  if (isDirective && maybe.cmd.includes("elseif")) {
                    maybe.cmd = last2.cmd.concat(maybe.cmd);
                    maybe.content = last2.content.concat(maybe.content);
                  } else if (isDirective && maybe.cmd.includes("else")) {
                    valueGroup.push(this.cascadeConditionalNode(last2.content.concat(maybe.content)));
                    maybe.ifEnd = true;
                  } else {
                    if (maybe)
                      maybe.ifEnd = true;
                    last2.content.push(this.createLiteralNode(null));
                    valueGroup.push(this.cascadeConditionalNode(last2.content));
                  }
                } else if (!last2.ifEnd) {
                  valueGroup.push(...last2.content);
                }
                if (maybe) {
                  last2 = maybe;
                }
                if (!isDirective) {
                  break;
                }
              }
              last2.content = valueGroup;
              last2.cmd.length = 0;
              delete last2.ifEnd;
              return last2;
            }
            return elem;
          }
          return null;
        };
        const push = (data3, value2) => {
          if (value2) {
            if (Array.isArray(value2)) {
              data3.push(...value2);
            } else {
              data3.push(value2);
            }
          }
        };
        var hasComplex = false;
        while (true) {
          result = next();
          if (last) {
            let value2 = null;
            const hasIf = last.cmd.includes("if");
            if (hasIf) {
              if (result && result.cmd.includes("elseif")) {
                result.cmd = last.cmd.concat(result.cmd);
                result.content = last.content.concat(result.content);
              } else if (result && result.cmd.includes("else")) {
                value2 = this.cascadeConditionalNode(last.content.concat(result.content));
                result.ifEnd = true;
              } else {
                if (result)
                  result.ifEnd = true;
                last.content.push(this.createLiteralNode(null));
                value2 = this.cascadeConditionalNode(last.content);
              }
            } else if (!(last.ifEnd && last.cmd.includes("else"))) {
              value2 = last.content;
            }
            const complex = last.child.isJSXExpressionContainer ? !!(last.child.expression.isMemberExpression || last.child.expression.isCallExpression) : false;
            if (last.cmd.includes("each") || last.cmd.includes("for") || last.child.isSlot || last.child.isDirective || complex) {
              hasComplex = true;
            }
            push(content, value2);
          }
          last = result;
          if (!result)
            break;
        }
        if (!content.length)
          return null;
        if (hasComplex) {
          var base = content.length > 1 ? content.shift() : this.createArrayNode();
          if (base.type !== "ArrayExpression") {
            base = this.createArrayNode([base]);
            base.newLine = true;
          }
          const node2 = Transform2.get("Array").concat(this, base, content.reduce(function(acc, val) {
            if (val.type === "ArrayExpression") {
              return acc.concat(...val.elements);
            } else {
              return acc.concat(val);
            }
          }, []), true);
          node2.newLine = true;
          node2.indentation = true;
          return node2;
        }
        const node = this.createArrayNode(content);
        if (content.length > 1 || !(content[0].type === "Literal" || content[0].type === "Identifier")) {
          node.newLine = true;
        }
        return node;
      }
      createForInNode(refName, element, item, key, index) {
        const node = this.createFunctionNode((ctx2) => {
          const refArray = `_${refName}`;
          ctx2.body.push(
            ctx2.createDeclarationNode("var", [
              ctx2.createDeclaratorNode(ctx2.createIdentifierNode(refArray), ctx2.createArrayNode())
            ])
          );
          if (index) {
            ctx2.body.push(
              ctx2.createDeclarationNode("var", [
                ctx2.createDeclaratorNode(
                  ctx2.createIdentifierNode(index),
                  ctx2.createLiteralNode(0, 0)
                )
              ])
            );
          }
          const _key = key || `_${item}Key`;
          const forNode = ctx2.createNode("ForInStatement");
          ctx2.body.push(forNode);
          forNode.left = forNode.createDeclarationNode("var", [
            forNode.createDeclaratorNode(_key)
          ]);
          forNode.left.inFor = true;
          forNode.right = forNode.createIdentifierNode(refName, null, true);
          forNode.value = forNode.createIdentifierNode(item, null, true);
          const forBlock = forNode.body = forNode.createNode("BlockStatement");
          const forBody = forBlock.body = [];
          forBody.push(
            forBlock.createStatementNode(
              Transform2.get("Array").push(
                forBlock,
                forBlock.createIdentifierNode(refArray, null, true),
                element.type === "ArrayExpression" ? element.elements : element,
                true
              )
            )
          );
          if (index) {
            const dec = forBlock.createNode("UpdateExpression");
            dec.argument = dec.createIdentifierNode(index, null, true);
            dec.operator = "++";
            forBody.push(forBlock.createStatementNode(dec));
          }
          ctx2.body.push(ctx2.createReturnNode(ctx2.createIdentifierNode(refArray, null, true)));
        }, [this.createIdentifierNode(refName, null, true)]);
        node.using = this.createFunctionGlobalUsing();
        const variableRefs = this.getVariableRefs();
        if (variableRefs) {
          Array.from(variableRefs.values()).forEach((item2) => {
            const refs = typeof item2 === "string" ? node.createIdentifierNode(item2, null, true) : node.createIdentifierNode(item2.value(), item2, true);
            node.using.push(node.creaateAddressRefsNode(refs));
          });
        }
        return node;
      }
      createFunctionGlobalUsing() {
        const node = this.createElementRefsNode();
        node.isVariable = true;
        return [this.creaateAddressRefsNode(node)];
      }
      createEachNode(element, args2) {
        const node = this.createFunctionNode(
          (ctx2) => {
            ctx2.body.push(ctx2.createReturnNode(element.type === "ArrayExpression" && element.elements.length === 1 ? element.elements[0] : element));
          },
          args2
        );
        node.using = this.createFunctionGlobalUsing();
        const variableRefs = this.getVariableRefs();
        if (variableRefs) {
          Array.from(variableRefs.values()).forEach((item) => {
            const refs = typeof item === "string" ? node.createIdentifierNode(item, null, true) : node.createIdentifierNode(item.value(), item, true);
            node.using.push(node.creaateAddressRefsNode(refs));
          });
        }
        return node;
      }
      createIterationNode(name2, refs, desc2, refName, element, item, key, index) {
        if (name2 === "each") {
          const args2 = [this.createIdentifierNode(item, null, true)];
          if (key) {
            args2.push(this.createIdentifierNode(key, null, true));
          }
          const node = Transform2.get("Array").map(this, refs, [this.createEachNode(element, args2)], true);
          return node;
        } else {
          const node = this.createCalleeNode(
            this.createIdentifierNode("call_user_func"),
            [
              this.createForInNode(refName, element, item, key, index),
              refs
            ]
          );
          return node;
        }
      }
      createRenderNode(stack, child) {
        const handle = this.createElementHandleNode(stack);
        const node = this.createMethodNode("render", (ctx2) => {
          handle.parent = ctx2;
          ctx2.body = [
            handle,
            ctx2.createReturnNode(child)
          ];
        });
        node.static = false;
        node.modifier = "public";
        node.kind = "method";
        return node;
      }
      createClassNode(stack, renderMethod, initProperties) {
        const obj = new JSXClassBuilder2(stack, this, "ClassDeclaration");
        if (renderMethod) {
          obj.members.push(renderMethod);
        }
        if (initProperties && initProperties.length > 0) {
          obj.initProperties.push(...initProperties);
        }
        obj.create();
        return obj;
      }
      getElementConfig() {
        return {
          props: [],
          attrs: [],
          on: [],
          nativeOn: [],
          slot: void 0,
          scopedSlots: [],
          domProps: [],
          key: void 0,
          ref: void 0,
          refInFor: void 0,
          tag: void 0,
          staticClass: void 0,
          class: void 0,
          show: void 0,
          staticStyle: void 0,
          style: void 0,
          hook: void 0,
          model: void 0,
          transition: [],
          directives: []
        };
      }
      isWebComponent(stack) {
        const module3 = stack.module;
        if (this.compilation.JSX || module3 && (stack.isModuleForWebComponent(module3) || stack.isModuleForSkinComponent(module3))) {
          return true;
        }
        return false;
      }
      createElementHandleNode(stack) {
        if (this.isWebComponent(stack)) {
          return this.createDeclarationNode("const", [
            this.createDeclaratorNode(
              this.createElementRefsNode(),
              this.createFunBindNode(this.createArrayNode([
                this.createThisNode(),
                this.createLiteralNode("createElement")
              ]), this.createThisNode())
            )
          ]);
        } else {
          return this.createDeclarationNode("const", [
            this.createDeclaratorNode(
              this.createElementRefsNode(),
              this.createChunkNode("func_get_arg(0)", false)
            )
          ]);
        }
      }
      createElementRefsNode() {
        const root = this.stack.jsxRootElement;
        return this.createIdentifierNode(this.getDeclareRefsName(root, "createNode", Token2.SCOPE_REFS_DOWN | Token2.SCOPE_REFS_UP_FUN, null, root));
      }
      createElementNode(stack, ...args2) {
        const refs = this.createElementRefsNode();
        refs.isVariable = true;
        const node = this.createCalleeNode(refs, args2);
        return node;
      }
      createSlotCalleeNode(child, ...args2) {
        const node = this.createNode("LogicalExpression");
        node.left = node.createCalleeNode(
          node.createMemberNode([
            node.createThisNode(),
            node.createIdentifierNode("slot")
          ]),
          args2
        );
        node.right = child;
        node.left.parent = node;
        node.right.parent = node;
        node.operator = "?:";
        return node;
      }
      makeSlotElement(stack, children) {
        const openingElement = this.createToken(stack.openingElement);
        if (stack.isSlotDeclared) {
          if (stack.openingElement.attributes.length > 0) {
            return this.createSlotCalleeNode(
              children,
              openingElement.name,
              this.createLiteralNode(true),
              this.createTypeTransformNode("object", this.createObjectNode(openingElement.attributes))
            );
          } else {
            return this.createSlotCalleeNode(
              children || this.createArrayNode(),
              openingElement.name
            );
          }
        } else {
          if (stack.openingElement.attributes.length > 0) {
            const scope = stack.openingElement.attributes.find((attr) => attr.name.value() === "scope");
            const scopeName = scope && scope.value ? scope.value.value() : "scope";
            return this.createSlotCalleeNode(
              this.createCalleeNode(
                this.createMemberNode([
                  this.createParenthesNode(this.createFunctionNode((ctx2) => {
                    const node = ctx2.createNode("ReturnStatement");
                    node.argument = children;
                    children.parent = node;
                    ctx2.body.push(node);
                  }, [
                    this.createIdentifierNode(scopeName)
                  ])),
                  this.createIdentifierNode("bind")
                ]),
                [
                  this.createThisNode()
                ]
              ),
              openingElement.name,
              this.createLiteralNode(true)
            );
          } else {
            return this.createSlotCalleeNode(
              children || this.createArrayNode(),
              openingElement.name
            );
          }
        }
      }
      makeDirectiveElement(stack, children) {
        const openingElement = stack.openingElement;
        const name2 = openingElement.name.value();
        switch (name2) {
          case "show":
            return children;
          case "if":
          case "elseif":
            const condition = this.createToken(stack.attributes[0].parserAttributeValueStack());
            const node = this.createNode("ConditionalExpression");
            node.test = condition;
            node.consequent = children;
            return node;
          case "else":
            return children;
          case "for":
          case "each":
            const attrs = stack.openingElement.attributes;
            const argument = {};
            attrs.forEach((attr) => {
              if (attr.name.value() === "name") {
                const stack2 = attr.parserAttributeValueStack();
                argument["refs"] = this.createToken(stack2);
                argument["desc"] = stack2.isStack && stack2.description();
              } else {
                argument[attr.name.value()] = attr.value.value();
              }
            });
            const fun = this.createIterationNode(
              name2,
              argument.refs,
              argument.desc,
              this.checkRefsName("_refs"),
              children,
              argument.item || "item",
              argument.key || "key",
              argument.index
            );
            if (stack.children.length > 1) {
              return Transform2.get("Array").flat(this, fun, [], true);
            }
            return fun;
        }
        return null;
      }
      makeHTMLElement(stack, data2, children) {
        var name2 = null;
        if (stack.isComponent) {
          if (stack.jsxRootElement === stack && stack.parentStack.isProgram) {
            name2 = this.createLiteralNode("div");
          } else {
            const module3 = stack.description();
            this.addDepend(module3);
            name2 = this.createClassRefsNode(module3, stack);
          }
        } else {
          name2 = this.createLiteralNode(stack.openingElement.name.value(), void 0, stack.openingElement.name);
        }
        data2 = this.makeConfig(data2);
        if (children) {
          return this.createElementNode(stack, name2, data2 || this.createLiteralNode(null), children);
        } else if (data2) {
          return this.createElementNode(stack, name2, data2);
        } else {
          return this.createElementNode(stack, name2);
        }
      }
      create(stack) {
        const data2 = this.getElementConfig();
        const children = stack.children.filter((child) => !(child.isJSXScript && child.isScriptProgram || child.isJSXStyle));
        const childNodes = this.makeChildren(children, data2);
        if (stack.parentStack.isSlot) {
          const name2 = stack.parentStack.openingElement.name.value();
          data2.slot = this.createLiteralNode(name2);
        } else if (stack.parentStack && stack.parentStack.isDirective) {
          let dName = stack.parentStack.openingElement.name.value();
          if (dName === "show") {
            const condition = stack.parentStack.openingElement.attributes[0];
            data2.directives.push(
              this.createObjectNode([
                this.createPropertyNode(this.createIdentifierNode("name"), this.createLiteralNode("show")),
                this.createPropertyNode(this.createIdentifierNode("value"), this.createToken(condition.parserAttributeValueStack()))
              ])
            );
          }
        }
        var hasScopedSlot = false;
        if (stack.hasAttributeSlot) {
          const attrSlot = stack.openingElement.attributes.find((attr) => !!attr.isAttributeSlot);
          if (attrSlot) {
            hasScopedSlot = !!attrSlot.value;
          }
        }
        const spreadAttributes = [];
        this.makeAttributes(stack, childNodes, data2, spreadAttributes);
        this.makeProperties(children, data2);
        if (spreadAttributes.length > 0) {
          if (data2.props.length > 0) {
            const params = [
              this.createObjectNode(),
              this.createObjectNode(data2.props),
              ...spreadAttributes
            ];
            data2.props = this.createCalleeNode(
              this.createMemberNode([
                this.createIdentifierNode("Object"),
                this.createIdentifierNode("assign")
              ]),
              params
            );
          } else {
            const params = [this.createObjectNode(), ...spreadAttributes];
            data2.props = this.createCalleeNode(
              this.createMemberNode([
                this.createIdentifierNode("Object"),
                this.createIdentifierNode("assign")
              ]),
              params
            );
          }
        }
        const isRoot = stack.jsxRootElement === stack;
        var nodeElement = null;
        if (stack.isSlot) {
          nodeElement = this.makeSlotElement(stack, childNodes);
        } else if (stack.isDirective) {
          nodeElement = this.makeDirectiveElement(stack, childNodes);
        } else {
          nodeElement = this.makeHTMLElement(stack, data2, hasScopedSlot ? null : childNodes);
        }
        if (isRoot) {
          if (stack.compilation.JSX && stack.parentStack.isProgram) {
            const initProperties = data2.props.map((property) => {
              return this.createStatementNode(
                this.createAssignmentNode(
                  this.createMemberNode([
                    this.createThisNode(),
                    this.createIdentifierNode(property.name.value)
                  ]),
                  property.value
                )
              );
            });
            const renderMethod = this.createRenderNode(stack, nodeElement);
            nodeElement = this.createClassNode(stack, renderMethod, initProperties);
          } else {
            const block = this.getParentByType((ctx2) => {
              return ctx2.type === "BlockStatement" && ctx2.parent.type === "MethodDefinition";
            });
            if (block && !block.existCreateElementHandle) {
              block.existCreateElementHandle = true;
              block.body.unshift(this.createElementHandleNode(stack));
            }
          }
        }
        nodeElement.jsxTransformNode = this;
        return nodeElement;
      }
    };
    module2.exports = JSXTransform2;
  }
});

// node_modules/glob-path/index.js
var require_glob_path = __commonJS({
  "node_modules/glob-path/index.js"(exports, module) {
    var path = require("path");
    var slashSplitterRegexp = /(?<!\\)[\/]+/;
    var keyScheme = Symbol("scheme");
    var Glob = class {
      #rules = [];
      #initialized = false;
      #cache = {};
      #extensions = {};
      addExt(group, ext) {
        this.#extensions[group] = ext;
      }
      addExts(data2 = {}) {
        Object.keys(data2).forEach((key) => {
          this.addExt(key, data2[key]);
        });
      }
      addRules(rules, group = null, data2 = {}) {
        Object.keys(rules).forEach((key) => {
          this.addRule(key, data2[key], 0, group, data2);
        });
      }
      addRuleGroup(pattern, target, group, data2 = {}) {
        this.addRule(pattern, target, 0, group, data2);
      }
      addRule(pattern, target, priority = 0, group = null, data2 = {}) {
        let type = pattern instanceof RegExp ? "regexp" : typeof pattern;
        let method = typeof target;
        let segments = [];
        let asterisks = 0;
        let protocol = null;
        let suffix = null;
        let prefix = false;
        let full = false;
        if (type === "string") {
          pattern = pattern.trim();
          let pos = pattern.indexOf(":///");
          if (pos > 0) {
            protocol = pattern.substring(0, pos);
            pattern = pattern.substring(pos + 4);
          }
          if (pattern.charCodeAt(0) === 94) {
            prefix = true;
            pattern = pattern.substring(1);
          }
          segments = pattern.replace(/^\/|\/$/).split(slashSplitterRegexp);
          asterisks = (pattern.match(/(?<!\\)\*/g) || []).length;
          let last = segments[segments.length - 1];
          let rPos = last.lastIndexOf(".");
          if (rPos > 0 && last.includes("*")) {
            let lPos = last.indexOf(".");
            if (lPos !== rPos) {
              const pattern2 = last.replace(/\./g, "\\.").replace(/[\*]+/g, () => {
                return "(.*?)";
              });
              suffix = new RegExp("^" + pattern2 + "$");
            }
          }
          if (pattern.includes("****")) {
            if (segments.length > 1) {
              throw new TypeError(`Glob the '****' full match pattern cannot have separator.`);
            }
            full = true;
          } else if (pattern.includes("***")) {
            const at = pattern.indexOf("***");
            if (at < pattern.length - 3) {
              throw new TypeError(`Glob the '***' full match pattern should is at the pattern ends.`);
            }
            full = true;
          } else if (/\*\*\.\w+$/.test(pattern)) {
            throw new TypeError(`Glob the '**.ext' file match pattern should have a separator between the two asterisks. as the '*/*.ext'`);
          } else if (/\*{4,}/.test(pattern)) {
            throw new TypeError(`Glob the '***' full match pattern should is three asterisks.`);
          }
        } else if (!(type === "regexp" || type === "function")) {
          throw new TypeError(`Glob pattern must is regexp or string or function`);
        }
        if (method === "function") {
          method = true;
        } else if (method === "string") {
          method = false;
        } else if (target) {
          throw new TypeError(`Glob the 'target' argument must is string or function`);
        }
        this.#rules.push({
          pattern,
          suffix,
          prefix,
          target,
          protocol,
          segments,
          asterisks,
          priority,
          group,
          type,
          full,
          method,
          data: data2,
          setValue(prefix2, name2, value2) {
            if (arguments.length === 2) {
              return data2[prefix2] = name2;
            } else if (arguments.length === 3) {
              let dataset = data2[prefix2] || (data2[prefix2] = {});
              return dataset[name2] = value2;
            }
            return false;
          },
          getValue(prefix2, name2 = null) {
            if (arguments.length === 1) {
              return data2[prefix2];
            }
            let dataset = data2[prefix2] || (data2[prefix2] = {});
            return dataset[name2];
          }
        });
        this.#initialized = false;
      }
      removeRules() {
        this.#initialized = false;
        return this.#rules.splice(0, this.#rules.length);
      }
      removeRule(pattern) {
        this.#initialized = false;
        pattern = typeof pattern === "function" ? pattern : (rule2) => rule2.pattern === pattern;
        const index = this.#rules.findIndex(pattern);
        if (index >= 0) {
          return this.#rules.splice(index, 1);
        }
        return null;
      }
      #init() {
        this.#rules.sort((a, b) => {
          if (a.priority < b.priority)
            return -1;
          if (a.priority > b.priority)
            return 1;
          if (a.type === "regexp" || a.type === "function")
            return -1;
          if (b.type === "regexp" || b.type === "function")
            return 1;
          if (a.asterisks === 0)
            return -1;
          if (b.asterisks === 0)
            return 1;
          let a1 = a.segments.length;
          let b1 = b.segments.length;
          if (a.full && !b.full) {
            return 1;
          }
          if (a1 > b1)
            return -1;
          if (a1 < b1)
            return 1;
          let a2 = a.asterisks;
          let b2 = b.asterisks;
          return a2 - b2;
        });
        this.#initialized = true;
      }
      matchRule(rule2, segments, basename2, extname2, globs = []) {
        let paths = rule2.segments;
        let suffix = rule2.suffix;
        let len = paths.length - 1;
        let base = paths[len];
        let globPos = -1;
        globs.length = 0;
        if (segments.length < len)
          return false;
        if (base === "****") {
          globs.push(segments.slice(0, -1));
          return true;
        }
        if (!rule2.prefix && !paths[0].startsWith("*") && segments[0] !== paths[0]) {
          const matchAt = segments.indexOf(paths[0]);
          if (matchAt < 0) {
            return false;
          } else {
            segments = segments.slice(matchAt);
          }
        }
        if (base !== "***") {
          if (suffix) {
            if (!suffix.test(basename2 + (extname2 || ""))) {
              return false;
            }
          } else {
            if (extname2 && !(base.endsWith(extname2) || base.endsWith(".*"))) {
              return false;
            } else if (basename2 !== base && !base.startsWith("*")) {
              return false;
            } else if (base.includes(".") && !extname2) {
              return false;
            }
          }
        }
        const push = (end) => {
          if (globPos >= 0) {
            globs.push(segments.slice(globPos, end));
            globPos = -1;
          }
        };
        let offset = 0;
        let at = 0;
        for (let i = 0; i < len; i++) {
          let segment = paths[i];
          at = offset + i;
          if (segment === segments[at]) {
            push(at);
            continue;
          } else if (segment === "**") {
            let next = paths[i + 1];
            if (next && !next.startsWith("*") && next !== base) {
              let start = at;
              while (start < segments.length && next !== segments[++start])
                ;
              if (next !== segments[start]) {
                return false;
              }
              offset = start - at - 1;
            }
            globPos = at;
            continue;
          } else if (segment === "*") {
            push(at);
            globs.push([segments[at]]);
            continue;
          }
          return false;
        }
        push(-1);
        if (base === "*") {
          at++;
          if (at < segments.length - 1)
            return false;
        } else if (base === "**" || base === "***") {
          at++;
          globPos = at;
          push(-1);
        }
        return true;
      }
      scheme(id2, ctx2 = {}, excludes = null) {
        if (!this.#initialized) {
          this.#init();
        }
        id2 = String(id2).trim();
        let group = ctx2.group || null;
        let gPos = id2.lastIndexOf("::");
        if (gPos > 0) {
          group = id2.substring(gPos + 2);
          id2 = id2.substring(0, gPos);
        }
        let normalId = id2.replace(/\\/g, "/").replace(/^\/|\/$/g, "");
        let extname2 = ctx2.extname || group && this.#extensions[group] || null;
        let extreal2 = "";
        let delimiter2 = ctx2.delimiter || "/";
        let key = [normalId, String(group), delimiter2, String(extname2)].join(":");
        if (!excludes && this.#cache.hasOwnProperty(key)) {
          return this.#cache[key];
        }
        let pos = normalId.indexOf(":///");
        let protocol = null;
        if (pos > 0) {
          protocol = normalId.substring(0, pos);
          normalId = normalId.substring(pos + 4);
        }
        let segments = normalId.split(slashSplitterRegexp);
        let basename2 = segments[segments.length - 1];
        let dotAt = basename2.lastIndexOf(".");
        let result = null;
        let globs = [];
        if (dotAt >= 0) {
          extreal2 = basename2.slice(dotAt);
          if (!extname2) {
            extname2 = extreal2;
          }
          basename2 = basename2.substring(0, dotAt);
        }
        for (let rule2 of this.#rules) {
          if (excludes) {
            if (excludes === rule2)
              continue;
            if (Array.isArray(excludes) && excludes.includes(rule2))
              continue;
          }
          if (rule2.group !== group) {
            continue;
          }
          if (rule2.protocol !== protocol) {
            continue;
          }
          if (rule2.type === "function") {
            if (rule2.pattern(id2, ctx2, rule2)) {
              result = rule2;
              break;
            }
          } else if (rule2.type === "regexp") {
            if (rule2.pattern.test(id2)) {
              result = rule2;
              break;
            }
          } else if (rule2.pattern === id2 || rule2.pattern === normalId) {
            result = rule2;
            break;
          } else if (this.matchRule(rule2, segments, basename2, extname2, globs)) {
            result = rule2;
            break;
          }
        }
        const args2 = result ? globs.flat() : [];
        return this.#cache[key] = {
          segments,
          basename: basename2,
          extname: extname2,
          extreal: extreal2,
          args: args2,
          globs,
          protocol,
          id: id2,
          normalId,
          rule: result,
          value: null,
          [keyScheme]: true
        };
      }
      dest(id2, ctx2 = {}) {
        return this.parse(this.scheme(id2, ctx2), ctx2);
      }
      parse(scheme, ctx = {}) {
        const defaultValue = ctx.failValue !== void 0 ? ctx.failValue : false;
        if (!scheme || !scheme.rule || scheme[keyScheme] !== true)
          return defaultValue;
        const { basename, extname, rule, args, value, id, extreal } = scheme;
        if (!rule.target) {
          return rule.target;
        }
        if (value) {
          return value;
        }
        if (rule.method) {
          let _result = rule.target(id, scheme, ctx, this);
          let _scheme = scheme;
          let _excludes = [rule];
          while (_result === void 0) {
            _scheme = this.scheme(_scheme.id, ctx, _excludes);
            if (_scheme && _scheme.rule) {
              _excludes.push(_scheme.rule);
              _result = this.parse(_scheme, ctx);
            } else {
              break;
            }
          }
          return scheme.value = _result;
        }
        const delimiter = ctx.delimiter || "/";
        const _value = rule.target.replace(/(?<!\\)\{(.*?)\}/g, (_, name) => {
          name = name.trim();
          if (name.startsWith("...")) {
            name = name.substring(3).trim();
            if (!name) {
              return args.join("/");
            }
          }
          const isExpr = name.charCodeAt(0) === 96 && name.charCodeAt(name.length - 1) === 96;
          if (isExpr) {
            name = name.slice(1, -1);
          }
          if (isExpr || name.startsWith("globs")) {
            try {
              let _globs = eval(`(${name.replace(/\bglobs\b/g, "scheme.globs")})`);
              _globs = Array.isArray(_globs) ? _globs.flat() : [_globs];
              return _globs.join("/");
            } catch (e) {
              console.log(e);
              throw new ReferenceError(`\`${name}\` expression invalid`);
            }
          } else if (name === "basename") {
            return basename;
          } else if (name === "filename") {
            return `${basename}${extname || ""}`;
          } else if (name === "extname") {
            return (extname || "").substring(1);
          } else if (name === "ext") {
            return extname || "";
          } else if (name === "extreal") {
            return extreal || "";
          } else if (/-?\d+/.test(name)) {
            if (name[0] === "-") {
              name = args.length - Number(name.substring(1));
            }
            return args[name] || "";
          } else if (name === "group") {
            return ctx[name] || "";
          }
          if (ctx.data && Object.prototype.hasOwnProperty.call(ctx.data, name)) {
            return String(ctx.data[name]);
          }
          return "";
        });
        return scheme.value = path.normalize(_value).split(/[\\\/]+/).filter(Boolean).join(delimiter);
      }
    };
    module.exports = Glob;
  }
});

// tokens/AnnotationDeclaration.js
var require_AnnotationDeclaration = __commonJS({
  "tokens/AnnotationDeclaration.js"(exports2, module2) {
    module2.exports = function() {
    };
  }
});

// tokens/AnnotationExpression.js
var require_AnnotationExpression = __commonJS({
  "tokens/AnnotationExpression.js"(exports2, module2) {
    module2.exports = function(ctx2, stack, type) {
      const args2 = stack.getArguments();
      const name2 = stack.name;
      switch (name2.toLowerCase()) {
        case "provider":
          const indexMap = ["className", "action", "method"];
          const getItem = (name3) => {
            let index = args2.findIndex((item) => item.key === name3);
            if (index < 0) {
              index = indexMap.indexOf(name3);
            }
            return args2[index];
          };
          const moduleClass = getItem(indexMap[0]);
          const action = getItem(indexMap[1]);
          const method = getItem(indexMap[2]) || { value: "Get" };
          const providerModule = stack.getModuleById(moduleClass.value, true);
          if (!providerModule) {
            ctx2.error(`Class '${moduleClass.value}' is not exists.`);
          } else {
            const member = providerModule.getMember(action.value);
            if (!member || member.modifier && member.modifier.value() !== "public") {
              ctx2.error(`Method '${moduleClass.value}::${action.value}' is not exists.`);
            } else {
              const annotation = member.annotations.find((item) => method.value.toLowerCase() == item.name.toLowerCase());
              if (!annotation) {
                ctx2.error(`Router '${method.value}' method is not exists. in ${moduleClass.value}::${action.value}`);
              } else {
                ctx2.compilation.setPolicy(2, providerModule);
                const params = annotation.getArguments();
                const value2 = params[0] ? params[0].value : action.value;
                const node = ctx2.createNode(stack, "Literal");
                if (value2.charCodeAt(0) === 47) {
                  node.value = value2;
                  node.raw = `"${value2}"`;
                } else {
                  node.value = `/${providerModule.id.toLowerCase()}/${value2}`;
                  node.raw = `"/${providerModule.id.toLowerCase()}/${value2}"`;
                }
                return node;
              }
            }
          }
          return null;
        case "http":
          return null;
        default:
          ctx2.error(`The '${name2}' annotations is not supported.`);
      }
      return null;
    };
  }
});

// tokens/ArrayExpression.js
var require_ArrayExpression = __commonJS({
  "tokens/ArrayExpression.js"(exports2, module2) {
    var _Array = require_Array();
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      let hasSpread = false;
      node.elements = stack.elements.map((stack2, index) => {
        let item = node.createToken(stack2);
        if (item && stack2.isSpreadElement) {
          hasSpread = true;
        } else {
          if (ctx2.isPassableReferenceExpress(stack2, stack2.type())) {
            item = ctx2.creaateAddressRefsNode(item);
          }
        }
        return item;
      });
      if (hasSpread) {
        if (node.elements.length === 1) {
          return node.elements[0];
        }
        return _Array.concat(ctx2, ctx2.createArrayNode(), node.elements, true, false);
      }
      return node;
    };
  }
});

// tokens/ArrayPattern.js
var require_ArrayPattern = __commonJS({
  "tokens/ArrayPattern.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.elements = stack.elements.map((item) => node.createToken(item));
      return node;
    };
  }
});

// tokens/FunctionExpression.js
var require_FunctionExpression = __commonJS({
  "tokens/FunctionExpression.js"(exports2, module2) {
    var Token2 = require_Token();
    function createInitNode(ctx2, name2, initValue, defaultValue2, operator) {
      return ctx2.createStatementNode(ctx2.createAssignmentNode(
        name2 instanceof Token2 ? name2 : ctx2.createIdentifierNode(name2, null, true),
        defaultValue2 ? ctx2.createBinaryNode(
          operator,
          initValue,
          defaultValue2
        ) : initValue
      ));
    }
    function createRefsMemberNode(ctx2, object, property, computed = false) {
      const node = ctx2.createMemberNode([ctx2.createIdentifierNode(object, null, true), typeof property === "number" ? ctx2.createLiteralNode(property) : ctx2.createIdentifierNode(property)]);
      node.computed = computed;
      return node;
    }
    function createParamNode(ctx2, name2, prefix) {
      const node = ctx2.createNode("ParamDeclarator");
      node.argument = name2 instanceof Token2 ? name2 : ctx2.createIdentifierNode(name2, null, true);
      node.prefix = prefix;
      node.argument.isVariable = true;
      return node;
    }
    function createParamNodes(ctx2, stack, params) {
      const before = [];
      const items = params.map((item, index) => {
        if (item.isObjectPattern) {
          const sName = ctx2.checkRefsName("_s", false, Token2.SCOPE_REFS_DOWN);
          before.push(createInitNode(
            ctx2,
            sName,
            ctx2.createIdentifierNode(sName, null, true),
            ctx2.createNewNode(ctx2.createIdentifierNode("\\stdClass"), []),
            "?:"
          ));
          item.properties.forEach((property) => {
            const key = property.key.value();
            let defaultValue3 = null;
            if (property.hasInit) {
              const initStack = property.init.isAssignmentPattern ? property.init.right : property.init;
              defaultValue3 = ctx2.createToken(initStack);
            } else {
              defaultValue3 = ctx2.createLiteralNode(null);
            }
            before.push(createInitNode(
              ctx2,
              key,
              createRefsMemberNode(ctx2, sName, key),
              defaultValue3,
              "??"
            ));
          });
          return createParamNode(ctx2, sName, "object");
        } else if (item.isArrayPattern) {
          const sName = ctx2.checkRefsName("_s", false, Token2.SCOPE_REFS_DOWN);
          before.push(createInitNode(
            ctx2,
            sName,
            ctx2.createIdentifierNode(sName, null, true),
            ctx2.createArrayNode([]),
            "?:"
          ));
          item.elements.forEach((property, index2) => {
            let key = null;
            let defaultValue3 = null;
            if (property.isAssignmentPattern) {
              key = property.left.value();
              defaultValue3 = ctx2.createToken(property.right);
            } else {
              key = property.value();
              defaultValue3 = ctx2.createLiteralNode(null);
            }
            before.push(createInitNode(
              ctx2,
              key,
              createRefsMemberNode(ctx2, sName, index2, true),
              defaultValue3,
              "??"
            ));
          });
          return createParamNode(ctx2, sName, "array");
        }
        const oType = item.acceptType && item.acceptType.type();
        let acceptType = null;
        if (oType && !item.isRestElement && !oType.isGenericType && !oType.isLiteralObjectType) {
          acceptType = stack.compiler.callUtils("getOriginType", oType);
        }
        let typeName = "";
        let defaultValue2 = null;
        let nameNode = null;
        if (item.isAssignmentPattern) {
          nameNode = ctx2.createIdentifierNode(item.left.value(), item.left, true);
          defaultValue2 = ctx2.createToken(item.right);
        } else if (item.question) {
          nameNode = ctx2.createToken(item);
          defaultValue2 = ctx2.createLiteralNode(null);
        } else {
          nameNode = ctx2.createToken(item);
        }
        if (acceptType && acceptType.isModule) {
          const originType = ctx2.builder.getAvailableOriginType(acceptType);
          if (originType === "String" || originType === "Array" || originType === "Object") {
            typeName = originType.toLowerCase();
          } else if (originType === "Function") {
            typeName = "\\Closure";
          } else if (originType === "Boolean") {
            typeName = "bool";
          }
          if (!typeName && !originType) {
            typeName = ctx2.getModuleReferenceName(acceptType);
          }
        }
        if (oType && !item.isRestElement && !oType.isGenericType) {
          const isAddress = ctx2.isAddressRefsType(oType, item);
          if (isAddress) {
            nameNode = ctx2.creaateAddressRefsNode(nameNode);
          }
        }
        if (defaultValue2) {
          nameNode = ctx2.createAssignmentNode(nameNode, defaultValue2);
        }
        return createParamNode(ctx2, nameNode, typeName);
      });
      return [items, before];
    }
    module2.exports = function(ctx2, stack, type) {
      const node = ctx2.createNode(stack, type);
      const [params, before] = createParamNodes(node, stack, stack.params);
      let block = node.createToken(stack.body);
      if (stack.expression && stack.expression.async || stack.async) {
        const promiseModule = node.builder.getGlobalModuleById("Promise");
        const promiseRefs = node.getModuleReferenceName(promiseModule);
        node.addDepend(promiseModule);
        const content = node.createFunctionNode();
        if (params.length > 0) {
          content.using = params.map((item) => {
            return node.creaateAddressRefsNode(node.createIdentifierNode(item.argument.value, null, true));
          });
        }
        content.body = block;
        const executer = node.createFunctionNode((ctx3) => {
          const resolve = ctx3.createCalleeNode(ctx3.createIdentifierNode("resolve", null, true), [
            ctx3.createCalleeNode(ctx3.createIdentifierNode("call_user_func"), [content])
          ]);
          const reject = ctx3.createCalleeNode(ctx3.createIdentifierNode("reject", null, true), [
            ctx3.createIdentifierNode("e", null, true)
          ]);
          const tryNode = ctx3.createNode("TryStatement");
          tryNode.param = createParamNode(ctx3, "e", "\\Exception");
          tryNode.block = node.createNode("BlockStatement");
          tryNode.block.body = [ctx3.createStatementNode(resolve)];
          tryNode.handler = node.createNode("BlockStatement");
          tryNode.handler.body = [ctx3.createStatementNode(reject)];
          ctx3.body.push(tryNode);
        }, [node.createIdentifierNode("resolve", null, true), node.createIdentifierNode("reject", null, true)]);
        if (params.length > 0) {
          executer.using = params.map((item) => {
            return node.creaateAddressRefsNode(node.createIdentifierNode(item.argument.value, null, true));
          });
        }
        block = node.createNode("BlockStatement");
        block.body = [
          node.createReturnNode(
            node.createNewNode(
              node.createIdentifierNode(promiseRefs),
              [executer]
            )
          )
        ];
      }
      if (before.length > 0) {
        block.body.unshift(...before);
      }
      const method = !!stack.parentStack.isMethodDefinition;
      const variableRefs = !method ? node.getVariableRefs() : null;
      if (variableRefs) {
        node.using = Array.from(variableRefs.values()).map((item) => {
          const refs = typeof item === "string" ? node.createIdentifierNode(item, null, true) : node.createIdentifierNode(item.value(), item, true);
          return node.creaateAddressRefsNode(refs);
        });
      }
      const returnType = stack.getReturnedType();
      if (node.isAddressRefsType(returnType, stack)) {
        node.prefix = "&";
      }
      node.params = params;
      node.body = block;
      return node;
    };
  }
});

// tokens/ArrowFunctionExpression.js
var require_ArrowFunctionExpression = __commonJS({
  "tokens/ArrowFunctionExpression.js"(exports2, module2) {
    var FunctionExpression = require_FunctionExpression();
    module2.exports = function(ctx2, stack, type) {
      const node = FunctionExpression(ctx2, stack, type);
      node.type = type;
      return node;
    };
  }
});

// tokens/AssignmentExpression.js
var require_AssignmentExpression = __commonJS({
  "tokens/AssignmentExpression.js"(exports2, module2) {
    var Transform2 = require_Transform();
    var hasOwn = Object.prototype.hasOwnProperty;
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      const desc2 = stack.description();
      const module3 = stack.module;
      const isMember = stack.left.isMemberExpression;
      let operator = stack.operator;
      node.operator = operator;
      if (desc2 && desc2.isVariableDeclarator && desc2.useRefItems && desc2.useRefItems.size === 0) {
      }
      var refsNode = node.createToken(stack.right);
      var leftNode = null;
      var isReflect = false;
      if (isMember) {
        const objectType = ctx2.inferType(stack.left.object);
        if (desc2 && desc2.isStack && (desc2.isMethodSetterDefinition || desc2.parentStack.isPropertyDefinition)) {
          const property = stack.left.property.value();
          let typename = ctx2.builder.getAvailableOriginType(objectType) || objectType.toString();
          if ((objectType.isUnionType || objectType.isIntersectionType) && desc2.module && desc2.module.isModule) {
            typename = desc2.module.id;
          }
          const map = {
            "Array": {
              "length": () => {
                let lengthNode = node.createToken(stack.left);
                if (!stack.right.isLiteral || stack.right.value() != 0) {
                  lengthNode = node.createBinaryNode("-", lengthNode, refsNode);
                }
                return Transform2.get("Array").splice(
                  node,
                  node.createToken(stack.left.object),
                  [refsNode, lengthNode],
                  true
                );
              }
            },
            "Error": {
              "name": () => {
                return null;
              }
            }
          };
          if (hasOwn.call(map, typename) && hasOwn.call(map[typename], property)) {
            return map[typename][property]();
          }
        }
        if (stack.left.computed) {
          const hasDynamic = desc2 && desc2.isComputeType && desc2.isPropertyExists();
          if (!hasDynamic && !ctx2.compiler.callUtils("isLiteralObjectType", objectType)) {
            isReflect = true;
          }
        } else if (desc2 && desc2.isAnyType) {
          isReflect = !ctx2.compiler.callUtils("isLiteralObjectType", objectType);
        }
      }
      if (desc2 && !isReflect && stack.right) {
        const addressRefObject = desc2.isVariableDeclarator || desc2.isParamDeclarator ? node.getAssignAddressRef(desc2) : null;
        if (addressRefObject && stack.left.isIdentifier) {
          const index = addressRefObject.add(stack.right);
          const left = addressRefObject.createIndexName(desc2);
          const key = node.createAssignmentNode(
            node.createIdentifierNode(left, null, true),
            node.createLiteralNode(index)
          );
          node.addVariableRefs(stack, left);
          let isAddressRefs = false;
          if (node.isPassableReferenceExpress(stack.right, stack.right.type())) {
            refsNode = node.creaateAddressRefsNode(refsNode);
            isAddressRefs = true;
          }
          if (!stack.right.isIdentifier) {
            const refs = node.checkRefsName("ref");
            node.insertNodeBlockContextAt(
              node.createAssignmentNode(node.createIdentifierNode(refs, null, true), refsNode)
            );
            refsNode = node.createIdentifierNode(refs, null, true);
            if (isAddressRefs) {
              refsNode = node.creaateAddressRefsNode(refsNode);
            }
          }
          leftNode = node.createMemberNode([
            node.createToken(stack.left),
            key
          ], null, true);
        } else if (node.isPassableReferenceExpress(stack.right, stack.right.type())) {
          refsNode = node.creaateAddressRefsNode(refsNode);
        }
      }
      if (isReflect) {
        const Reflect2 = stack.getGlobalTypeById("Reflect");
        node.addDepend(Reflect2);
        if (operator && operator.charCodeAt(0) !== 61 && operator.charCodeAt(operator.length - 1) === 61) {
          operator = operator.slice(0, -1);
          const callee2 = node.createStaticMemberNode([
            node.createIdentifierNode(node.getModuleReferenceName(Reflect2)),
            node.createIdentifierNode("get")
          ]);
          const value2 = node.createCalleeNode(callee2, [
            node.createCallReflectScopeNode(module3),
            node.createToken(stack.left.object),
            node.createCallReflectPropertyNode(stack.left)
          ], stack);
          refsNode = node.createBinaryNode(operator, value2, refsNode);
        }
        const callee = node.createStaticMemberNode([
          node.createIdentifierNode(node.getModuleReferenceName(Reflect2)),
          node.createIdentifierNode("set")
        ]);
        let target = node.createToken(stack.left.object);
        if (!stack.left.object.isIdentifier) {
          const refs = node.checkRefsName("ref");
          node.insertNodeBlockContextAt(
            node.createAssignmentNode(node.createIdentifierNode(refs, null, true), target)
          );
          target = node.createIdentifierNode(refs, null, true);
        }
        return node.createCalleeNode(callee, [
          node.createCallReflectScopeNode(module3),
          target,
          node.createCallReflectPropertyNode(stack.left),
          refsNode
        ], stack);
      } else if (desc2 && desc2.isMethodSetterDefinition) {
        return node.createCalleeNode(
          leftNode || node.createToken(stack.left),
          [
            refsNode
          ],
          stack
        );
      } else {
        node.left = leftNode || node.createToken(stack.left);
        node.right = refsNode;
        refsNode.parent = node;
        return node;
      }
    };
  }
});

// tokens/AssignmentPattern.js
var require_AssignmentPattern = __commonJS({
  "tokens/AssignmentPattern.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.left = node.createIdentifierNode(stack.left.value(), stack.left, true);
      node.right = node.createToken(stack.right);
      return node;
    };
  }
});

// tokens/AwaitExpression.js
var require_AwaitExpression = __commonJS({
  "tokens/AwaitExpression.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      const promiseModule = node.builder.getGlobalModuleById("Promise");
      const promiseRefs = node.getModuleReferenceName(promiseModule);
      node.addDepend(promiseModule);
      node.argument = node.createCalleeNode(
        node.createStaticMemberNode([
          node.createIdentifierNode(promiseRefs),
          node.createIdentifierNode("sent")
        ]),
        [
          node.createToken(stack.argument)
        ]
      );
      return node;
    };
  }
});

// tokens/BinaryExpression.js
var require_BinaryExpression = __commonJS({
  "tokens/BinaryExpression.js"(exports2, module2) {
    var mapset = {
      "String": "is_string",
      "Number": "is_numeric",
      "Array": "is_array",
      "Function": "is_callable",
      "Object": "is_object",
      "Boolean": "is_bool"
    };
    function createNode(ctx2, stack) {
      let maybeArrayRef = stack.isMemberExpression || stack.isCallExpression || stack.isIdentifier;
      if (maybeArrayRef) {
        if (stack.isIdentifier || stack.isMemberExpression) {
          const desc3 = stack.description();
          if (stack.compiler.callUtils("isTypeModule", desc3)) {
            return ctx2.createToken(stack);
          }
        }
        const originType = ctx2.builder.getAvailableOriginType(ctx2.inferType(stack));
        if (originType && originType.toLowerCase() === "array") {
          var desc2 = stack.description();
          if (stack.isIdentifier) {
            return ctx2.createArrayAddressRefsNode(desc2, stack.value());
          } else {
            const name2 = ctx2.getDeclareRefsName(stack, "_RD");
            const left = ctx2.createIdentifierNode(name2, null, true);
            const right = ctx2.creaateAddressRefsNode(ctx2.createToken(stack));
            ctx2.insertNodeBlockContextAt(ctx2.createAssignmentNode(left, right));
            return ctx2.createIdentifierNode(name2, null, true);
          }
        }
      }
      return ctx2.createToken(stack);
    }
    module2.exports = function(ctx2, stack) {
      var operator = stack.node.operator;
      if (operator === "is" || operator === "instanceof") {
        const type = stack.right.type();
        const name2 = ctx2.builder.getAvailableOriginType(type);
        if (mapset[name2]) {
          return ctx2.createCalleeNode(
            ctx2.createIdentifierNode(mapset[name2]),
            [
              ctx2.createToken(stack.left)
            ],
            stack
          );
        } else if (operator === "is") {
          ctx2.addDepend(type);
          return ctx2.createCalleeNode(
            ctx2.createIdentifierNode("is_a"),
            [
              ctx2.createToken(stack.left),
              ctx2.createToken(stack.right)
            ],
            stack
          );
        }
      }
      if (operator.charCodeAt(0) === 43) {
        var leftType = ctx2.inferType(stack.left);
        var rightType = ctx2.inferType(stack.right);
        var oLeftType = leftType;
        var oRightType = rightType;
        var isNumber = leftType.isLiteralType && rightType.isLiteralType;
        if (isNumber) {
          leftType = ctx2.builder.getAvailableOriginType(leftType);
          rightType = ctx2.builder.getAvailableOriginType(rightType);
          isNumber = leftType === "Number" && leftType === rightType;
        }
        if (!isNumber) {
          if (oLeftType.toString() === "string" || oRightType.toString() === "string") {
            operator = operator.length > 1 ? "." + operator.substr(1) : ".";
          } else {
            ctx2.addDepend(stack.getGlobalTypeById("System"));
            return ctx2.createCalleeNode(
              ctx2.createStaticMemberNode([
                ctx2.createIdentifierNode("System"),
                ctx2.createIdentifierNode("addition")
              ]),
              [
                ctx2.createToken(stack.left),
                ctx2.createToken(stack.right)
              ],
              stack
            );
          }
        }
      }
      const node = ctx2.createNode(stack);
      node.left = createNode(node, stack.left);
      node.right = createNode(node, stack.right);
      node.operator = operator;
      if (stack.left && stack.left.isMemberExpression && node.left && node.left.type === "BinaryExpression") {
        node.left = node.createParenthesNode(node.left);
      }
      if (stack.right && stack.right.isMemberExpression && node.right && node.right.type === "BinaryExpression") {
        node.right = node.createParenthesNode(node.right);
      }
      return node;
    };
  }
});

// tokens/BlockStatement.js
var require_BlockStatement = __commonJS({
  "tokens/BlockStatement.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.body = [];
      ctx2.body = node;
      for (let child of stack.body) {
        const token = node.createToken(child);
        if (token) {
          node.body.push(token);
          if (child.isWhenStatement) {
            const express = token.type === "BlockStatement" ? token.body : [token];
            if (Array.isArray(express)) {
              const last = express[express.length - 1];
              if (last && last.type === "ReturnStatement") {
                return node;
              }
            }
          }
        }
      }
      ;
      return node;
    };
  }
});

// tokens/BreakStatement.js
var require_BreakStatement = __commonJS({
  "tokens/BreakStatement.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      var index = 0;
      if (stack.label) {
        const label = stack.label.value();
        stack.getParentStack((stack2) => {
          if (stack2.isForOfStatement || stack2.isForInStatement || stack2.isForStatement || stack2.isSwitchStatement || stack2.isDoWhileStatement || stack2.isWhileStatement) {
            index++;
          }
          if (stack2.isLabeledStatement && stack2.label.value() === label) {
            return true;
          }
          return !!stack2.isFunctionExpression;
        });
      }
      if (index > 0) {
        node.label = node.createLiteralNode(index);
      } else if (stack.label) {
        node.label = node.createIdentifierNode(stack.label.value(), stack.label);
      }
      return node;
    };
  }
});

// tokens/CallExpression.js
var require_CallExpression = __commonJS({
  "tokens/CallExpression.js"(exports2, module2) {
    var Transform2 = require_Transform();
    var Token2 = require_Token();
    function createArgumentNodes(ctx2, stack, args2, declareParams) {
      return args2.map((item, index) => {
        const node = ctx2.createToken(item);
        if (declareParams && declareParams[index] && !item.isIdentifier) {
          const declareParam = declareParams[index];
          if (!(declareParam.isRestElement || declareParam.isObjectPattern || declareParam.isArrayPattern)) {
            if (ctx2.isAddressRefsType(declareParam.type())) {
              const name2 = ctx2.checkRefsName("arg");
              ctx2.insertNodeBlockContextAt(
                ctx2.createAssignmentNode(ctx2.createIdentifierNode(name2, null, true), node)
              );
              return ctx2.createIdentifierNode(name2, null, true);
            }
          }
        }
        return node;
      });
    }
    function CallExpression(ctx2, stack) {
      const isMember = stack.callee.isMemberExpression;
      const desc2 = stack.doGetDeclareFunctionType(stack.callee.description());
      const module3 = stack.module;
      const declareParams = desc2 && desc2.params;
      const node = ctx2.createNode(stack);
      const args2 = createArgumentNodes(node, stack, stack.arguments, declareParams);
      if (stack.callee.isFunctionExpression) {
        node.callee = node.createIdentifierNode("call_user_func");
        node.arguments = [node.createToken(stack.callee)].concat(args2);
        return node;
      }
      if (!stack.callee.isSuperExpression) {
        const context = isMember ? stack.callee.object.getContext() : stack.callee.getContext();
        let objectType = isMember ? ctx2.inferType(stack.callee.object, context) : null;
        if (objectType && objectType.isClassGenericType && objectType.inherit.isAliasType) {
          objectType = ctx2.inferType(objectType.inherit.inherit.type(), context);
        }
        if (isMember && desc2 && !objectType.isNamespace) {
          if (desc2.isType && desc2.isAnyType) {
            const Reflect2 = stack.getGlobalTypeById("Reflect");
            node.addDepend(Reflect2);
            const propValue = stack.callee.property.value();
            const property = node.createLiteralNode(propValue, void 0, stack.callee.property);
            let target = node.createToken(stack.callee.object);
            if (!stack.callee.object.isIdentifier) {
              const refs = node.checkRefsName("ref");
              node.insertNodeBlockContextAt(
                node.createAssignmentNode(node.createIdentifierNode(refs, null, true), target)
              );
              target = node.createIdentifierNode(refs, null, true);
            }
            return node.createCalleeNode(
              node.createStaticMemberNode([
                node.createIdentifierNode(node.getModuleReferenceName(Reflect2)),
                node.createIdentifierNode("call")
              ]),
              [
                node.createClassRefsNode(module3),
                target,
                property,
                args2.length > 0 ? node.createArrayNode(args2) : null
              ],
              stack
            );
          } else if (desc2.isStack) {
            let name2 = node.builder.getAvailableOriginType(objectType) || objectType.toString();
            let descModule = null;
            if ((objectType.isUnionType || objectType.isIntersectionType) && (desc2.isMethodDefinition || desc2.isCallDefinition) && desc2.module && desc2.module.isModule) {
              name2 = desc2.module.id;
              descModule = desc2.module;
            }
            let newWrapObject = null;
            let isStringNewWrapObject = null;
            if (objectType.isInstanceofType && !objectType.isThisType) {
              const origin = objectType.inherit.type();
              isStringNewWrapObject = origin === ctx2.builder.getGlobalModuleById("String");
              if (isStringNewWrapObject || origin === ctx2.builder.getGlobalModuleById("Number") || origin === ctx2.builder.getGlobalModuleById("Boolean")) {
                newWrapObject = true;
              }
            }
            if (Transform2.has(name2)) {
              const object = Transform2.get(name2);
              const key = stack.callee.property.value();
              if (Object.prototype.hasOwnProperty.call(object, key)) {
                if (desc2.static) {
                  return object[key](
                    node,
                    null,
                    args2,
                    true,
                    true
                  );
                } else {
                  let callee = node.createToken(stack.callee.object);
                  if (newWrapObject && isStringNewWrapObject) {
                    callee = node.createCalleeNode(node.createMemberNode([callee, "toString"]));
                  }
                  return object[key](
                    node,
                    callee,
                    args2,
                    true,
                    false
                  );
                }
              }
            }
            if (!(desc2.isMethodDefinition || desc2.isCallDefinition)) {
              node.callee = node.createIdentifierNode("call_user_func");
              node.arguments = [node.createToken(stack.callee)].concat(args2);
              return node;
            }
          }
        } else if (desc2) {
          if (desc2.isType && desc2.isAnyType) {
            const Reflect2 = stack.getGlobalTypeById("Reflect");
            node.addDepend(Reflect2);
            let target = node.createToken(stack.callee);
            if (!stack.callee.isIdentifier) {
              const refs = node.checkRefsName("ref");
              ctx2.insertNodeBlockContextAt(
                ctx2.createAssignmentNode(ctx2.createIdentifierNode(refs, null, true), target)
              );
              target = ctx2.createIdentifierNode(refs, null, true);
            }
            return node.createCalleeNode(
              node.createStaticMemberNode([
                node.createIdentifierNode(node.getModuleReferenceName(Reflect2)),
                node.createIdentifierNode("apply")
              ]),
              [
                node.createClassRefsNode(module3),
                target,
                args2.length > 0 ? node.createArrayNode(args2) : null
              ],
              stack
            );
          } else if (desc2.isStack && desc2.isDeclaratorFunction) {
            const callee = node.createToken(stack.callee);
            const object = Transform2.get("global");
            if (Object.prototype.hasOwnProperty.call(object, callee.value)) {
              return object[callee.value](
                node,
                callee,
                args2,
                true,
                false
              );
            }
          } else if ((desc2.isCallDefinition || desc2.isType && desc2.isModule) && args2.length === 1) {
            const name2 = desc2.isCallDefinition && desc2.module ? desc2.module.id : node.builder.getAvailableOriginType(desc2) || desc2.toString();
            if (name2 && Transform2.has(name2)) {
              const object = Transform2.get(name2);
              return object.valueOf(
                node,
                args2[0],
                [],
                true,
                false
              );
            }
          }
        }
      }
      if (stack.callee.isSuperExpression) {
        if (!node.isActiveForModule(module3.inherit, module3, true)) {
          return null;
        }
        node.callee = node.createStaticMemberNode([
          node.createToken(stack.callee),
          node.createIdentifierNode("__construct")
        ]);
      } else {
        node.callee = node.createToken(stack.callee);
      }
      node.arguments = args2;
      return node;
    }
    module2.exports = CallExpression;
  }
});

// tokens/ClassDeclaration.js
var require_ClassDeclaration = __commonJS({
  "tokens/ClassDeclaration.js"(exports2, module2) {
    var ClassBuilder2 = require_ClassBuilder();
    module2.exports = function(ctx2, stack, type) {
      return ClassBuilder2.createClassNode(stack, ctx2, type);
    };
  }
});

// tokens/ConditionalExpression.js
var require_ConditionalExpression = __commonJS({
  "tokens/ConditionalExpression.js"(exports2, module2) {
    var AddressVariable = require_AddressVariable();
    function createConditionalNode(ctx2, stack) {
      const node = ctx2.createNode("IfStatement");
      const result = ctx2.getDeclareRefsName(stack, AddressVariable.REFS_NAME);
      let consequent = ctx2.createToken(stack.consequent);
      let alternate = ctx2.createToken(stack.alternate);
      let assignName = ctx2.getDeclareRefsName(stack, AddressVariable.REFS_INDEX);
      const key0 = node.createAssignmentNode(
        node.createIdentifierNode(assignName, null, true),
        node.createLiteralNode(0)
      );
      const key1 = node.createAssignmentNode(
        node.createIdentifierNode(assignName, null, true),
        node.createLiteralNode(1)
      );
      if (ctx2.isPassableReferenceExpress(stack.consequent, ctx2.inferType(stack.consequent))) {
        consequent = ctx2.creaateAddressRefsNode(consequent);
      }
      if (ctx2.isPassableReferenceExpress(stack.alternate, ctx2.inferType(stack.alternate))) {
        alternate = ctx2.creaateAddressRefsNode(alternate);
      }
      node.condition = ctx2.createTransformBooleanTypeNode(stack.test);
      node.consequent = ctx2.createAssignmentNode(
        node.createMemberNode([
          node.createIdentifierNode(result, null, true),
          key0
        ], null, true),
        consequent
      );
      node.alternate = ctx2.createAssignmentNode(
        node.createMemberNode([
          node.createIdentifierNode(result, null, true),
          key1
        ], null, true),
        alternate
      );
      ctx2.insertNodeBlockContextAt(node);
      return node.createMemberNode([
        node.createIdentifierNode(result, null, true),
        node.createIdentifierNode(assignName, null, true)
      ], null, true);
    }
    function check(ctx2, stack) {
      if (stack.isConditionalExpression) {
        return check(ctx2, stack.consequent) || check(ctx2, stack.alternate);
      }
      const type = ctx2.inferType(stack);
      return ctx2.isAddressRefsType(type, stack);
    }
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      if (check(node, stack)) {
        return createConditionalNode(node, stack);
      } else {
        node.test = node.createTransformBooleanTypeNode(stack.test);
        node.consequent = node.createToken(stack.consequent);
        node.alternate = node.createToken(stack.alternate);
        return node;
      }
    };
  }
});

// tokens/ContinueStatement.js
var require_ContinueStatement = __commonJS({
  "tokens/ContinueStatement.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createToken(stack);
      node.label = node.createToken(stack.label);
      return node;
    };
  }
});

// tokens/Declarator.js
var require_Declarator = __commonJS({
  "tokens/Declarator.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack, "Identifier");
      node.value = node.raw = stack.value();
      node.isVariable = true;
      return node;
    };
  }
});

// tokens/DeclaratorDeclaration.js
var require_DeclaratorDeclaration = __commonJS({
  "tokens/DeclaratorDeclaration.js"(exports2, module2) {
    var ClassBuilder2 = require_ClassBuilder();
    module2.exports = function(ctx2, stack, type) {
      const module3 = stack.module;
      const polyfillModule = ctx2.builder.getPolyfillModule(module3.getName());
      if (!polyfillModule) {
        return null;
      }
      const node = new ClassBuilder2(stack, ctx2, type);
      const content = polyfillModule.content;
      if (!node.checkSyntaxPresetForClass()) {
        return null;
      }
      const ns = ctx2.builder.getModuleNamespace(module3);
      if (ns) {
        node.namespace = node.createIdentifierNode(ns);
      }
      node.key = node.createIdentifierNode(polyfillModule.export || module3.id);
      node.comment = polyfillModule.comment ? node.createChunkNode(polyfillModule.comment) : null;
      polyfillModule.require.forEach((name2) => {
        const module4 = stack.getModuleById(name2);
        if (module4) {
          node.addDepend(module4);
        } else {
          node.error(`the '${name2}' dependency does not exist`);
        }
      });
      module3.extends.forEach((dep) => {
        if (dep.isClass && dep.isModule) {
          node.addDepend(dep);
        }
      });
      node.createDependencies(module3);
      node.createModuleAssets(module3);
      node.body.push(node.createChunkNode(content));
      return node;
    };
  }
});

// tokens/DoWhileStatement.js
var require_DoWhileStatement = __commonJS({
  "tokens/DoWhileStatement.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.condition = node.createTransformBooleanTypeNode(stack.condition);
      node.body = node.createToken(stack.body);
      return node;
    };
  }
});

// tokens/EmptyStatement.js
var require_EmptyStatement = __commonJS({
  "tokens/EmptyStatement.js"(exports2, module2) {
    module2.exports = function() {
    };
  }
});

// tokens/EnumDeclaration.js
var require_EnumDeclaration = __commonJS({
  "tokens/EnumDeclaration.js"(exports2, module2) {
    function createStatementMember(ctx2, members) {
      const items = [];
      const values = [];
      members.forEach((item) => {
        const node = ctx2.createNode("PropertyDefinition");
        node.modifier = node.createIdentifierNode("public");
        node.kind = "const";
        node.key = node.createToken(item.key);
        node.init = node.createToken(item.init);
        node.declarations = [
          node.createDeclaratorNode(
            node.key,
            node.init
          )
        ];
        items.push(node);
        const caseNode = ctx2.createNode("SwitchCase");
        caseNode.condition = caseNode.createLiteralNode(item.init.value());
        caseNode.consequent = [
          caseNode.createReturnNode(caseNode.createLiteralNode(item.key.value()))
        ];
        values.push(caseNode);
      });
      return [items, values];
    }
    var ClassBuilder2 = require_ClassBuilder();
    module2.exports = function(ctx2, stack, type) {
      if (stack.parentStack.isPackageDeclaration) {
        const node = new ClassBuilder2(stack, ctx2, "ClassDeclaration");
        const module3 = stack.module;
        if (node.isActiveForModule(module3.inherit)) {
          node.inherit = node.createIdentifierNode(node.getModuleReferenceName(module3.inherit));
        }
        const ns = node.builder.getModuleNamespace(module3);
        if (ns) {
          this.namespace = this.createIdentifierNode(ns);
        }
        node.key = node.createIdentifierNode(module3.id);
        node.static = node.createIdentifierNode("static");
        node.createDependencies(module3);
        node.createModuleAssets(module3);
        const [items, values] = createStatementMember(node, stack.properties);
        node.body.push(...items);
        const mtehod = node.createMethodNode(node.createIdentifierNode("getLabelByValue"), (ctx3) => {
          const node2 = ctx3.createNode("SwitchStatement");
          node2.condition = node2.createIdentifierNode("value", null, true);
          node2.cases = values.map((item) => {
            item.parent = node2;
            return item;
          });
          ctx3.body.push(node2);
        }, [node.createIdentifierNode("value", null, true)]);
        mtehod.static = mtehod.createIdentifierNode("static");
        mtehod.modifier = mtehod.createIdentifierNode("public");
        node.body.push(mtehod);
        return node;
      } else {
        const name2 = stack.value();
        const keys = [];
        const values = [];
        stack.properties.forEach((item) => {
          keys.push(ctx2.createPropertyNode(ctx2.createLiteralNode(item.key.value()), ctx2.createLiteralNode(item.init.value())));
          values.push(ctx2.createPropertyNode(ctx2.createLiteralNode(String(item.init.value())), ctx2.createLiteralNode(item.key.value())));
        });
        const transform = ctx2.createNode(stack, "TypeTransformExpression");
        transform.typeName = "object";
        transform.expression = transform.createObjectNode(values.concat(keys));
        return ctx2.createStatementNode(
          ctx2.createAssignmentNode(
            ctx2.createIdentifierNode(name2, null, true),
            transform
          )
        );
      }
    };
  }
});

// tokens/EnumProperty.js
var require_EnumProperty = __commonJS({
  "tokens/EnumProperty.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.key = node.createToken(stack.key);
      node.init = node.createToken(stack.init);
      return node;
    };
  }
});

// tokens/ExportAllDeclaration.js
var require_ExportAllDeclaration = __commonJS({
  "tokens/ExportAllDeclaration.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.exported = node.createToken(stack.exported);
      const compilation = stack.getResolveCompilation();
      if (compilation && compilation.stack) {
        const resolve = stack.getResolveFile();
        const source = ctx2.builder.getModuleImportSource(resolve, stack.compilation.file);
        node.source = node.createLiteralNode(source);
        node.builder.make(compilation, compilation.stack);
      }
      return node;
    };
  }
});

// tokens/ExportDefaultDeclaration.js
var require_ExportDefaultDeclaration = __commonJS({
  "tokens/ExportDefaultDeclaration.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.declaration = node.createToken(stack.declaration);
      return node;
    };
  }
});

// tokens/ExportNamedDeclaration.js
var require_ExportNamedDeclaration = __commonJS({
  "tokens/ExportNamedDeclaration.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.specifiers = stack.specifiers ? stack.specifiers.map((item) => node.createToken(item)) : null;
      node.declaration = node.createToken(stack.declaration);
      if (stack.source) {
        const compilation = stack.getResolveCompilation();
        if (compilation) {
          const resolve = stack.getResolveFile();
          const source = ctx2.builder.getModuleImportSource(resolve, stack.compilation.file);
          node.source = node.createLiteralNode(source);
          node.builder.make(compilation, compilation.stack);
        }
      }
      return node;
    };
  }
});

// tokens/ExportSpecifier.js
var require_ExportSpecifier = __commonJS({
  "tokens/ExportSpecifier.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.exported = node.createIdentifierNode(stack.exported.value(), stack.exported);
      node.local = node.createToken(stack.local);
      return node;
    };
  }
});

// tokens/ExpressionStatement.js
var require_ExpressionStatement = __commonJS({
  "tokens/ExpressionStatement.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.expression = node.createToken(stack.expression);
      return node;
    };
  }
});

// tokens/ForInStatement.js
var require_ForInStatement = __commonJS({
  "tokens/ForInStatement.js"(exports2, module2) {
    var Transform2 = require_Transform();
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.right = node.createToken(stack.right);
      const type = ctx2.inferType(stack.right);
      if (type.isAnyType || type.toString() === "string") {
        node.right = Transform2.get("Object").keys(ctx2, null, [node.right], true, false);
        node.value = node.createToken(stack.left);
      } else {
        node.left = node.createToken(stack.left);
      }
      node.body = node.createToken(stack.body);
      return node;
    };
  }
});

// tokens/ForOfStatement.js
var require_ForOfStatement = __commonJS({
  "tokens/ForOfStatement.js"(exports2, module2) {
    function createConditionNode(ctx2, obj, refs) {
      const assignment = ctx2.createNode("AssignmentPattern");
      assignment.left = assignment.createIdentifierNode(refs, null, true);
      assignment.right = assignment.createTypeTransformNode("object", assignment.createCalleeNode(
        assignment.createMemberNode([
          assignment.createIdentifierNode(obj, null, true),
          assignment.createIdentifierNode("next")
        ]),
        []
      ));
      const init = ctx2.createIdentifierNode(obj, null, true);
      const next = ctx2.createParenthesNode(assignment);
      const done = ctx2.createNode("UnaryExpression");
      done.prefix = true;
      done.operator = "!";
      done.argument = ctx2.createMemberNode([
        assignment.createIdentifierNode(refs, null, true),
        assignment.createIdentifierNode("done")
      ]);
      const logical = ctx2.createNode("LogicalExpression");
      const left = logical.createNode("LogicalExpression");
      init.parent = logical.left;
      next.parent = logical.left;
      done.parent = logical;
      left.left = init;
      left.operator = "&&";
      left.right = next;
      logical.operator = "&&";
      logical.left = left;
      logical.right = done;
      return logical;
    }
    function createAddressRefsNode(addressRefObject, ctx2, desc2, value2, stack) {
      const index = addressRefObject.add(stack);
      const name2 = addressRefObject.getName(desc2);
      const left = addressRefObject.createIndexName(desc2);
      const key = ctx2.createAssignmentNode(
        ctx2.createIdentifierNode(left, null, true),
        ctx2.createLiteralNode(index)
      );
      key.computed = true;
      ctx2.addVariableRefs(stack, left);
      return ctx2.createAssignmentNode(
        ctx2.createIdentifierNode(name2, null, true),
        ctx2.createObjectNode([
          ctx2.createPropertyNode(key, value2)
        ])
      );
    }
    module2.exports = function(ctx2, stack) {
      var type = ctx2.inferType(stack.right);
      if (!(type.isLiteralArrayType || type.isTupleType || type === ctx2.builder.getGlobalModuleById("array") || ctx2.isArrayMappingType(stack.compiler.callUtils("getOriginType", type)))) {
        const node2 = ctx2.createNode(stack, "ForStatement");
        const SystemModule = node2.builder.getGlobalModuleById("System");
        const IteratorModule = node2.builder.getGlobalModuleById("Iterator");
        node2.addDepend(SystemModule);
        const isIterableIteratorType = stack.compiler.callUtils("isIterableIteratorType", type, IteratorModule);
        const declDesc = stack.left.isVariableDeclaration ? stack.left.declarations[0] : null;
        const init = node2.createToken(stack.left);
        const obj = init.checkRefsName("_o");
        const res = init.checkRefsName("_v");
        const object = init.createAssignmentNode(
          init.createIdentifierNode(obj, null, true),
          isIterableIteratorType ? init.createToken(stack.right) : init.createCalleeNode(
            init.createStaticMemberNode([
              ctx2.createIdentifierNode(node2.getModuleReferenceName(SystemModule)),
              ctx2.createIdentifierNode("getIterator")
            ]),
            [
              init.createToken(stack.right)
            ]
          )
        );
        const rewind = ctx2.createCalleeNode(
          ctx2.createMemberNode([
            ctx2.createIdentifierNode(obj, null, true),
            ctx2.createIdentifierNode("rewind")
          ])
        );
        var decl = init.declarations[0];
        init.declarations = [object, rewind];
        object.parent = init;
        var isAddress = false;
        if (decl.type === "AddressReferenceExpression") {
          isAddress = true;
          decl = decl.argument;
        }
        const condition = createConditionNode(node2, obj, res, true);
        let assignment = null;
        let forValue = node2.createMemberNode([
          node2.createIdentifierNode(res, null, true),
          node2.createIdentifierNode("value")
        ]);
        const address = node2.getAssignAddressRef(declDesc);
        if (address) {
          forValue = node2.creaateAddressRefsNode(forValue);
          assignment = node2.createStatementNode(createAddressRefsNode(address, node2, declDesc, forValue, stack));
        } else {
          if (isAddress) {
            forValue = node2.creaateAddressRefsNode(forValue);
          }
          assignment = node2.createStatementNode(
            node2.createAssignmentNode(
              node2.createIdentifierNode(decl.id.value, null, true),
              forValue
            )
          );
        }
        node2.init = init;
        node2.condition = condition;
        node2.update = null;
        node2.body = node2.createToken(stack.body);
        if (stack.body.isBlockStatement) {
          node2.body.body.splice(0, 0, assignment);
        } else {
          const block = node2.createNode("BlockStatement");
          block.body = [
            assignment,
            node2.body
          ];
          node2.body = block;
        }
        return node2;
      }
      const node = ctx2.createNode(stack);
      node.left = node.createToken(stack.left);
      node.right = node.createToken(stack.right);
      node.body = node.createToken(stack.body);
      return node;
    };
  }
});

// tokens/ForStatement.js
var require_ForStatement = __commonJS({
  "tokens/ForStatement.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.init = node.createToken(stack.init);
      node.condition = node.createToken(stack.condition);
      node.update = node.createToken(stack.update);
      node.body = node.createToken(stack.body);
      return node;
    };
  }
});

// tokens/FunctionDeclaration.js
var require_FunctionDeclaration = __commonJS({
  "tokens/FunctionDeclaration.js"(exports2, module2) {
    var FunctionExpression = require_FunctionExpression();
    module2.exports = function(ctx2, stack, type) {
      const node = FunctionExpression(ctx2, stack, type);
      if (type === "FunctionDeclaration") {
        node.type = "FunctionExpression";
        return node.createStatementNode(
          node.createAssignmentNode(
            node.createIdentifierNode(stack.key.value(), stack.key, true),
            node
          )
        );
      }
      if (stack.isConstructor) {
        node.key = node.createIdentifierNode("__construct", stack.key);
      } else {
        node.key = node.createIdentifierNode(stack.key.value(), stack.key);
      }
      return node;
    };
  }
});

// tokens/Identifier.js
var require_Identifier = __commonJS({
  "tokens/Identifier.js"(exports2, module2) {
    var globals = ["String", "Number", "Boolean", "Object", "Array"];
    module2.exports = function(ctx2, stack) {
      if (!stack.parentStack.isMemberExpression && stack.value() === "arguments") {
        return ctx2.createCalleeNode(ctx2.createIdentifierNode("func_get_args"));
      }
      let desc2 = null;
      if (stack.parentStack.isMemberExpression) {
        if (stack.parentStack.object === stack) {
          desc2 = stack.descriptor();
        }
      } else {
        desc2 = stack.descriptor();
      }
      const builder = ctx2.builder;
      if (desc2 && (desc2.isPropertyDefinition || desc2.isMethodDefinition)) {
        const ownerModule = desc2.module;
        const isStatic = !!(desc2.static || ownerModule.static);
        const inMember = stack.parentStack.isMemberExpression;
        let propertyName = stack.value();
        if (!inMember && (desc2.isMethodGetterDefinition || desc2.isMethodSetterDefinition)) {
          propertyName = ctx2.getAccessorName(stack.value(), desc2, desc2.isMethodGetterDefinition ? "get" : "set");
        }
        let propertyNode = null;
        if (isStatic) {
          propertyNode = ctx2.createStaticMemberNode([
            ctx2.createIdentifierNode(builder.getModuleNamespace(ownerModule)),
            ctx2.createIdentifierNode(propertyName, stack)
          ]);
        } else {
          propertyNode = ctx2.createMemberNode([
            ctx2.createThisNode(),
            ctx2.createIdentifierNode(propertyName, stack)
          ]);
        }
        if (!inMember && !stack.parentStack.isAssignmentExpression && desc2.isMethodGetterDefinition) {
          return ctx2.createCalleeNode(propertyNode);
        }
        return propertyNode;
      }
      if (stack.compiler.callUtils("isTypeModule", desc2)) {
        ctx2.addDepend(desc2);
        if (stack.parentStack.isMemberExpression && stack.parentStack.object === stack || stack.parentStack.isNewExpression && !globals.includes(desc2.getName()) || stack.parentStack.isBinaryExpression && stack.parentStack.right === stack && stack.parentStack.node.operator === "instanceof") {
          return ctx2.createIdentifierNode(ctx2.getModuleReferenceName(desc2), stack);
        } else {
          return ctx2.createClassRefsNode(desc2, stack);
        }
      }
      var isDeclarator = desc2 && (desc2.isDeclarator || desc2.isProperty && (desc2.parentStack.isObjectPattern || desc2.parentStack.isObjectExpression));
      if (isDeclarator) {
        if (desc2.parentStack.isImportDeclaration) {
          const resolve = desc2.parentStack.getResolveFile();
          const system = ctx2.builder.getGlobalModuleById("System");
          ctx2.addDepend(system);
          const node = ctx2.createCalleeNode(
            ctx2.createStaticMemberNode([
              ctx2.createIdentifierNode(ctx2.getModuleReferenceName(system)),
              ctx2.createIdentifierNode("getScopeVariable")
            ]),
            [
              ctx2.createLiteralNode(ctx2.builder.createScopeId(stack.compilation, resolve)),
              ctx2.createLiteralNode(stack.value())
            ]
          );
          return node;
        } else if (desc2.parentStack.isAnnotationDeclaration) {
          const annotation = desc2.parentStack;
          const name2 = annotation.name.toLowerCase();
          if (name2 === "require" || name2 === "import") {
            const argument = annotation.getArguments().find((item) => !!item.resolveFile);
            return ctx2.createLiteralNode(ctx2.builder.getAssetFileReferenceName(ctx2.module, argument.resolveFile), void 0, stack);
          }
        } else {
          ctx2.addVariableRefs(desc2);
        }
      } else if (desc2 && (desc2.isFunctionDeclaration || desc2.isDeclaratorVariable)) {
        isDeclarator = true;
        if (desc2.isDeclaratorVariable) {
          if (desc2.kind === "const") {
            isDeclarator = false;
          }
        }
      }
      if (stack.parentStack.isMemberExpression) {
        isDeclarator = false;
        if (stack.parentStack.computed && stack.parentStack.property === stack) {
          isDeclarator = true;
        } else if (stack.parentStack.object === stack) {
          isDeclarator = true;
        }
      } else if (stack.parentStack.isJSXExpressionContainer && stack.scope.define(stack.value())) {
        if (desc2 && desc2.isIdentifier) {
          ctx2.addVariableRefs(desc2);
        }
        isDeclarator = true;
      }
      if (desc2 && (desc2.isVariableDeclarator || desc2.isParamDeclarator)) {
        let isRefs = true;
        if (stack.parentStack.isMemberExpression) {
          isRefs = stack.parentStack.object === stack;
        } else if (stack.parentStack.isVariableDeclarator) {
          isRefs = stack.parentStack.init === stack;
        } else if (stack.parentStack.isAssignmentExpression) {
          isRefs = stack.parentStack.right === stack;
        }
        if (isRefs) {
          const assignAddress = ctx2.getAssignAddressRef(desc2);
          if (assignAddress) {
            const name2 = assignAddress.getName(desc2) || stack.value();
            const index = assignAddress.createIndexName(desc2);
            if (index) {
              return ctx2.createMemberNode([
                ctx2.createIdentifierNode(name2, null, true),
                ctx2.createIdentifierNode(index, null, true)
              ], null, true);
            }
          }
        }
      }
      return ctx2.createIdentifierNode(stack.value(), stack, isDeclarator);
    };
  }
});

// tokens/IfStatement.js
var require_IfStatement = __commonJS({
  "tokens/IfStatement.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.condition = node.createTransformBooleanTypeNode(stack.condition);
      node.consequent = node.createToken(stack.consequent);
      node.alternate = node.createToken(stack.alternate);
      return node;
    };
  }
});

// tokens/ImportDeclaration.js
var require_ImportDeclaration = __commonJS({
  "tokens/ImportDeclaration.js"(exports2, module2) {
    var path3 = require("path");
    module2.exports = function(ctx2, stack, type) {
      if (stack.source && stack.source.isLiteral) {
        const compilation = stack.getResolveCompilation();
        if (!compilation)
          return null;
        const resolve = stack.getResolveFile();
        const info = path3.parse(resolve);
        const source = ctx2.builder.getModuleImportSource(resolve, ctx2.module || stack.compilation.file);
        const specifiers = stack.specifiers.map((item) => ctx2.createToken(item));
        ctx2.builder.make(compilation, compilation.stack);
        if (specifiers.length > 0) {
          const namespaceSpecifier = specifiers.length === 1 && specifiers[0].type === "ImportNamespaceSpecifier" ? specifiers[0] : null;
          if (namespaceSpecifier) {
            const node = ctx2.createImportNode(source, [[namespaceSpecifier.local.value]], stack);
            return node;
          } else {
            let name2 = info.name.replace(/[.-]/g, "_");
            if (/^\d+/.test(info.name)) {
              name2 = "_" + name2;
            }
            const refs = ctx2.checkRefsName(name2, true);
            const node = ctx2.createImportNode(source, [[refs]], stack);
            const top = ctx2.getTopBlockContext();
            const body = top.initBeforeBody || top.beforeBody || top.body;
            const isDefaultGlobal = specifiers.length === 1 && specifiers[0].type === "ImportDefaultSpecifier";
            specifiers.forEach((item) => {
              let name3 = item.local.value;
              if (item.type === "ImportNamespaceSpecifier") {
                body.push(
                  node.createStatementNode(
                    node.createAssignmentNode(
                      node.createIdentifierNode(name3, null, true),
                      node.createIdentifierNode(refs, true, true)
                    )
                  )
                );
              } else {
                let imported = "default";
                if (item.type !== "ImportDefaultSpecifier") {
                  imported = item.imported.value;
                }
                const system = ctx2.builder.getGlobalModuleById("System");
                ctx2.addDepend(system);
                const registerScopeVariables = node.createCalleeNode(
                  node.createStaticMemberNode([
                    node.createIdentifierNode(node.getModuleReferenceName(system)),
                    node.createIdentifierNode("registerScopeVariables")
                  ]),
                  [
                    node.createLiteralNode(ctx2.builder.createScopeId(stack.compilation, resolve)),
                    node.createLiteralNode(name3),
                    isDefaultGlobal ? node.createIdentifierNode(refs, true, true) : node.createBinaryNode(
                      "??",
                      node.createMemberNode([
                        node.createTypeTransformNode("object", node.createIdentifierNode(refs, true, true), true),
                        node.createIdentifierNode(imported)
                      ]),
                      node.createLiteralNode(null)
                    )
                  ]
                );
                body.push(
                  node.createStatementNode(
                    registerScopeVariables
                  )
                );
              }
            });
            return node;
          }
        }
        return ctx2.createImportNode(source, specifiers, stack);
      } else {
        const classModule = stack.description();
        if (classModule && ctx2.isActiveForModule(classModule)) {
          const compilation = classModule.compilation;
          ctx2.builder.buildForModule(compilation, compilation.stack, classModule);
          const source = ctx2.builder.getModuleImportSource(classModule, stack.compilation.file);
          const node = ctx2.createImportNode(source);
          const name2 = stack.alias ? stack.alias.value() : classModule.id;
          if (name2 !== classModule.id) {
            node.insertNodeBlockContextTop(
              node.createUsingStatementNode(
                node.createImportSpecifierNode(
                  name2,
                  node.getModuleReferenceName(classModule)
                )
              )
            );
          }
          return node;
        }
      }
      return null;
    };
  }
});

// tokens/ImportDefaultSpecifier.js
var require_ImportDefaultSpecifier = __commonJS({
  "tokens/ImportDefaultSpecifier.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.local = stack.local ? node.createToken(stack.local) : node.createIdentifierNode(stack.value(), stack);
      return node;
    };
  }
});

// tokens/ImportExpression.js
var require_ImportExpression = __commonJS({
  "tokens/ImportExpression.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.source = node.createToken(stack.source);
      return node;
    };
  }
});

// tokens/ImportNamespaceSpecifier.js
var require_ImportNamespaceSpecifier = __commonJS({
  "tokens/ImportNamespaceSpecifier.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.local = stack.local ? node.createToken(stack.local) : node.createIdentifierNode(stack.value(), stack);
      return node;
    };
  }
});

// tokens/ImportSpecifier.js
var require_ImportSpecifier = __commonJS({
  "tokens/ImportSpecifier.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.imported = node.createIdentifierNode(stack.imported.value());
      node.local = stack.local ? node.createToken(stack.local) : node.createIdentifierNode(stack.value(), stack);
      return node;
    };
  }
});

// tokens/InterfaceDeclaration.js
var require_InterfaceDeclaration = __commonJS({
  "tokens/InterfaceDeclaration.js"(exports2, module2) {
    var ClassBuilder2 = require_ClassBuilder();
    module2.exports = function(ctx2, stack, type) {
      return ClassBuilder2.createClassNode(stack, ctx2, type);
    };
  }
});

// tokens/JSXAttribute.js
var require_JSXAttribute = __commonJS({
  "tokens/JSXAttribute.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      let ns = null;
      if (stack.hasNamespaced) {
        const xmlns = stack.getXmlNamespace();
        if (xmlns) {
          ns = xmlns.value.value();
        } else {
          const nsStack = stack.getNamespaceStack();
          const ops = stack.compiler.options;
          ns = ops.jsx.xmlns.default[nsStack.namespace.value()] || ns;
        }
      }
      const node = ctx2.createNode(stack);
      node.namespace = ns;
      let name2 = ctx2.createToken(stack.name);
      let value2 = stack.value ? ctx2.createToken(stack.value) : ctx2.createLiteralNode(true);
      if (stack.isMemberProperty) {
        const eleClass = stack.jsxElement.getSubClassDescription();
        const propsDesc = stack.getAttributeDescription(eleClass);
        const annotations = propsDesc && propsDesc.annotations;
        const annotation = annotations && annotations.find((annotation2) => annotation2.name.toLowerCase() === "alias");
        if (annotation) {
          const [named] = annotation.getArguments();
          if (named) {
            if (named.isObjectPattern) {
              name2 = named.extract[0].value;
            } else {
              name2 = named.value;
            }
            name2 = ctx2.createIdentifierNode(name2);
          }
        }
      }
      if (ns === "@binding" && stack.value) {
        const desc2 = stack.value.description();
        let has = false;
        if (desc2) {
          has = desc2.isPropertyDefinition && !desc2.isReadonly || desc2.isMethodGetterDefinition && desc2.module && desc2.module.getMember(desc2.key.value(), "set");
        }
        if (!has && stack.value.isJSXExpressionContainer) {
          if (stack.value.expression.isMemberExpression) {
            const objectType = ctx2.builder.getGlobalModuleById("Object");
            has = objectType && objectType.is(stack.value.expression.object.type());
          }
        }
        if (!has) {
          stack.value.error(1e4, stack.value.value());
        }
      }
      node.name = name2;
      node.value = value2;
      return node;
    };
  }
});

// tokens/JSXCdata.js
var require_JSXCdata = __commonJS({
  "tokens/JSXCdata.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      let value2 = stack.value();
      if (value2) {
        value2 = value2.replace(/[\r\n]+/g, "").replace(/\u0022/g, '\\"');
        if (value2) {
          return ctx2.createLiteralNode(value2);
        }
      }
      return null;
    };
  }
});

// tokens/JSXClosingElement.js
var require_JSXClosingElement = __commonJS({
  "tokens/JSXClosingElement.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      return ctx2.createNode(stack);
    };
  }
});

// tokens/JSXClosingFragment.js
var require_JSXClosingFragment = __commonJS({
  "tokens/JSXClosingFragment.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      return ctx2.createNode(stack);
    };
  }
});

// tokens/JSXElement.js
var require_JSXElement = __commonJS({
  "tokens/JSXElement.js"(exports2, module2) {
    var JSXTransform2 = require_JSXTransform();
    var instances = /* @__PURE__ */ new Map();
    function getTransform(root, ctx2) {
      if (instances.has(root)) {
        return instances.get(root);
      }
      const obj = new JSXTransform2(root, ctx2);
      instances.set(root, obj);
      return obj;
    }
    function JSXElement(ctx2, stack) {
      const obj = getTransform(stack, ctx2);
      return obj.create(stack);
    }
    JSXElement.getTransform = getTransform;
    module2.exports = JSXElement;
  }
});

// tokens/JSXEmptyExpression.js
var require_JSXEmptyExpression = __commonJS({
  "tokens/JSXEmptyExpression.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      return null;
    };
  }
});

// tokens/JSXExpressionContainer.js
var require_JSXExpressionContainer = __commonJS({
  "tokens/JSXExpressionContainer.js"(exports2, module2) {
    var JSXElement = require_JSXElement();
    module2.exports = function(ctx2, stack) {
      if (stack.parentStack.isSlot && stack.expression && !stack.expression.isJSXElement) {
        const name2 = stack.parentStack.openingElement.name.value();
        return JSXElement.createElementNode(
          ctx2,
          ctx2.createLiteralNode("span"),
          ctx2.createObjectNode([
            ctx2.createPropertyNode(
              ctx2.createIdentifier("slot"),
              ctx2.createLiteralNode(name2)
            )
          ]),
          ctx2.createToken(stack.expression)
        );
      }
      return ctx2.createToken(stack.expression);
    };
  }
});

// tokens/JSXFragment.js
var require_JSXFragment = __commonJS({
  "tokens/JSXFragment.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.children = stack.children.map((child) => node.createToken(child));
      return node;
    };
  }
});

// tokens/JSXIdentifier.js
var require_JSXIdentifier = __commonJS({
  "tokens/JSXIdentifier.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack, "Identifier");
      node.value = stack.value();
      node.raw = node.value;
      return node;
    };
  }
});

// tokens/JSXMemberExpression.js
var require_JSXMemberExpression = __commonJS({
  "tokens/JSXMemberExpression.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.object = node.createToken(stack.object);
      node.property = node.createToken(stack.property);
      return node;
    };
  }
});

// tokens/JSXNamespacedName.js
var require_JSXNamespacedName = __commonJS({
  "tokens/JSXNamespacedName.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.namespace = node.createToken(stack.namespace);
      node.name = node.createToken(stack.name);
      const xmlns = stack.getXmlNamespace();
      if (xmlns) {
        node.value = xmlns.value.value();
      } else {
        const ops = stack.compiler.options;
        node.value = ops.jsx.xmlns.default[stack.namespace.value()] || null;
      }
      node.value = node.name.value;
      node.raw = node.value;
      return node;
    };
  }
});

// tokens/JSXOpeningElement.js
var require_JSXOpeningElement = __commonJS({
  "tokens/JSXOpeningElement.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.attributes = stack.attributes.map((attr) => node.createToken(attr));
      if (stack.parentStack.isComponent) {
        const desc2 = stack.parentStack.description();
        if (desc2) {
          if (stack.hasNamespaced && desc2.isFragment) {
            node.name = node.createIdentifierNode(desc2.id, stack.name);
          } else {
            node.name = node.createIdentifierNode(ctx2.builder.getModuleReferenceName(desc2), stack.name);
          }
        } else {
          node.name = node.createIdentifierNode(stack.name.value(), stack.name);
        }
      } else {
        node.name = node.createLiteralNode(stack.name.value(), void 0, stack.name);
      }
      return node;
    };
  }
});

// tokens/JSXOpeningFragment.js
var require_JSXOpeningFragment = __commonJS({
  "tokens/JSXOpeningFragment.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      return ctx2.createNode(stack);
    };
  }
});

// tokens/JSXScript.js
var require_JSXScript = __commonJS({
  "tokens/JSXScript.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.openingElement = node.createToken(stack.openingElement);
      node.body = (stack.body || []).map((child) => node.createToken(child));
    };
  }
});

// tokens/JSXSpreadAttribute.js
var require_JSXSpreadAttribute = __commonJS({
  "tokens/JSXSpreadAttribute.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.argument = node.createToken(stack.argument);
      return node;
    };
  }
});

// tokens/JSXStyle.js
var require_JSXStyle = __commonJS({
  "tokens/JSXStyle.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      return null;
    };
  }
});

// tokens/JSXText.js
var require_JSXText = __commonJS({
  "tokens/JSXText.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      let value2 = stack.value();
      if (value2) {
        value2 = value2.replace(/[\r\n]+/g, "").replace(/\u0022/g, '\\"');
        if (value2) {
          return ctx2.createLiteralNode(value2);
        }
      }
      return null;
    };
  }
});

// tokens/LabeledStatement.js
var require_LabeledStatement = __commonJS({
  "tokens/LabeledStatement.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.label = node.createIdentifierNode(stack.label.value(), stack.label);
      node.body = node.createToken(stack.body);
      return node;
    };
  }
});

// tokens/Literal.js
var require_Literal = __commonJS({
  "tokens/Literal.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.raw = stack.raw();
      const code = node.raw.charCodeAt(0);
      if (code === 34 || code === 39) {
        node.value = node.raw.slice(1, -1);
      } else {
        node.value = stack.value();
      }
      if (code === 34) {
        node.raw = `'${node.value.replace("'", "\\'")}'`;
      }
      const type = stack.type();
      if (type.toString() === "regexp") {
        ctx2.addDepend(type.inherit);
        let pattern = node.raw.trim();
        let index = node.raw.lastIndexOf("/");
        if (pattern.charCodeAt(0) !== 47 || !(index > 0)) {
          throw new Error("Invalid regexp " + pattern);
        } else {
          let glog = pattern.slice(index + 1);
          pattern = pattern.slice(1, index);
          const args2 = [pattern, glog].filter((item) => !!item);
          const newNode = ctx2.createNewNode(
            ctx2.createIdentifierNode(ctx2.getModuleReferenceName(type.inherit)),
            args2.map((item) => ctx2.createLiteralNode(item))
          );
          if (stack.parentStack.isMemberExpression) {
            return ctx2.createParenthesNode(newNode);
          } else {
            return newNode;
          }
        }
      }
      return node;
    };
  }
});

// tokens/LogicalExpression.js
var require_LogicalExpression = __commonJS({
  "tokens/LogicalExpression.js"(exports2, module2) {
    var Token2 = require_Token();
    var AddressVariable = require_AddressVariable();
    function isBooleanExpression(stack) {
      if (!stack || !stack.parentStack)
        return false;
      if (stack.parentStack.isLogicalExpression || stack.parentStack.isUnaryExpression || stack.parentStack.isParenthesizedExpression) {
        return isBooleanExpression(stack.parentStack);
      }
      return stack.parentStack.isIfStatement || stack.parentStack.isWhileStatement || stack.parentStack.isArrowFunctionExpression || stack.parentStack.isForStatement || stack.parentStack.isBinaryExpression || stack.parentStack.isDoWhileStatement;
    }
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      const isAnd = stack.node.operator.charCodeAt(0) === 38;
      const isBoolean = isBooleanExpression(stack);
      if (!isBoolean) {
        const needRefs = !stack.parentStack.isSwitchCase;
        const type = ctx2.inferType(stack.left);
        const createRefs = !isAnd && !stack.left.isIdentifier;
        let refs = null;
        if (needRefs) {
          let left = ctx2.createToken(stack.left);
          let right = ctx2.createToken(stack.right);
          let condition = left;
          let isAddress = false;
          if (!isAnd && node.isPassableReferenceExpress(stack.left, type)) {
            isAddress = true;
          }
          if (createRefs) {
            refs = node.checkRefsName("RE", false, Token2.SCOPE_REFS_DOWN, stack);
            node.insertNodeBlockContextAt(
              node.createAssignmentNode(
                node.createIdentifierNode(refs, null, true),
                isAddress ? node.creaateAddressRefsNode(left) : left
              )
            );
            left = node.createIdentifierNode(refs, null, true);
            condition = node.createTransformBooleanTypeNode(stack.left, null, type, null, left);
          } else {
            condition = node.createTransformBooleanTypeNode(stack.left, null, type, null, left);
          }
          if (isAddress) {
            left = node.creaateAddressRefsNode(left);
          }
          if (node.isPassableReferenceExpress(stack.right, ctx2.inferType(stack.right))) {
            right = node.creaateAddressRefsNode(right);
            isAddress = true;
          }
          if (isAddress) {
            const result = node.checkRefsName(AddressVariable.REFS_NAME, false, Token2.SCOPE_REFS_DOWN, stack);
            const assignName = node.checkRefsName(AddressVariable.REFS_INDEX, false, Token2.SCOPE_REFS_DOWN, stack);
            const key0 = node.createAssignmentNode(
              node.createIdentifierNode(assignName, null, true),
              node.createLiteralNode(0)
            );
            const key1 = node.createAssignmentNode(
              node.createIdentifierNode(assignName, null, true),
              node.createLiteralNode(1)
            );
            const key2 = node.createAssignmentNode(
              node.createIdentifierNode(assignName, null, true),
              node.createLiteralNode(2)
            );
            node.insertNodeBlockContextAt(ctx2.createAssignmentNode(
              node.createMemberNode([
                node.createIdentifierNode(result, null, true),
                key0
              ], null, true),
              node.createLiteralNode(null)
            ));
            let consequent = ctx2.createAssignmentNode(
              node.createMemberNode([
                node.createIdentifierNode(result, null, true),
                key1
              ], null, true),
              right
            );
            let alternate = null;
            if (!isAnd) {
              alternate = consequent;
              consequent = ctx2.createAssignmentNode(
                node.createMemberNode([
                  node.createIdentifierNode(result, null, true),
                  key2
                ], null, true),
                left
              );
            }
            node.insertNodeBlockContextAt(node.createIfStatement(condition, consequent, alternate));
            return node.createMemberNode([
              node.createIdentifierNode(result, null, true),
              node.createIdentifierNode(assignName, null, true)
            ], null, true);
          }
        }
        if (isAnd || stack.left.isIdentifier) {
          if (isAnd) {
            return node.createConditionalNode(
              node.createTransformBooleanTypeNode(stack.left, null, type),
              node.createToken(stack.right),
              node.createLiteralNode(null)
            );
          }
          return node.createConditionalNode(
            node.createTransformBooleanTypeNode(stack.left, null, type),
            node.createToken(stack.left),
            node.createToken(stack.right)
          );
        } else {
          return node.createConditionalNode(
            createRefs && needRefs ? node.createTransformBooleanTypeNode(stack.left, null, type, null, node.createIdentifierNode(refs, null, true)) : node.createTransformBooleanTypeNode(stack.left, refs, type),
            node.createIdentifierNode(refs, null, true),
            node.createToken(stack.right)
          );
        }
      }
      node.left = node.createTransformBooleanTypeNode(stack.left);
      node.right = node.createTransformBooleanTypeNode(stack.right);
      node.operator = stack.node.operator;
      return node;
    };
  }
});

// tokens/MemberExpression.js
var require_MemberExpression = __commonJS({
  "tokens/MemberExpression.js"(exports2, module2) {
    var Transform2 = require_Transform();
    function trans(ctx2, stack, description, aliasAnnotation, objectType) {
      const type = objectType;
      let name2 = ctx2.builder.getAvailableOriginType(type) || type.toString();
      if (objectType && (objectType.isUnionType || objectType.isIntersectionType) && description && description.isMethodDefinition && description.module && description.module.isModule) {
        name2 = description.module.id;
      }
      if (Transform2.has(name2)) {
        const object = Transform2.get(name2);
        const key = stack.computed ? "$computed" : stack.property.value();
        if (Object.prototype.hasOwnProperty.call(object, key)) {
          if (stack.computed) {
            return object[key](
              ctx2,
              ctx2.createToken(stack.object),
              [ctx2.createToken(stack.property)],
              false,
              false
            );
          }
          if (description.static) {
            return object[key](
              ctx2,
              null,
              [],
              false,
              true
            );
          } else {
            return object[key](
              ctx2,
              ctx2.createToken(stack.object),
              [],
              false,
              false
            );
          }
        }
      }
      return null;
    }
    function getAliasAnnotation(desc2) {
      if (!desc2 || !desc2.isStack || !desc2.annotations)
        return null;
      const result = desc2.annotations.find((annotation) => {
        return annotation.name.toLowerCase() === "alias";
      });
      if (result) {
        const args2 = result.getArguments();
        if (args2[0])
          return args2[0].value;
      }
      return null;
    }
    function MemberExpression(ctx2, stack) {
      const module3 = stack.module;
      const description = stack.descriptor();
      let computed = false;
      if (description && description.isModule && stack.compiler.callUtils("isTypeModule", description)) {
        ctx2.addDepend(description);
        if (stack.parentStack.isMemberExpression || stack.parentStack.isNewExpression || stack.parentStack.isCallExpression) {
          return ctx2.createIdentifierNode(ctx2.getModuleReferenceName(description, module3), stack);
        } else {
          return ctx2.createClassRefsNode(description, stack);
        }
      }
      var objCtx = stack.object.getContext();
      var objectType = ctx2.inferType(stack.object, objCtx);
      var objectDescription = stack.object.descriptor();
      var rawObjectType = objectType;
      var isWrapType = false;
      if (objectType.isClassGenericType && objectType.inherit.isAliasType) {
        objectType = ctx2.inferType(objectType.inherit.inherit.type(), objCtx);
        isWrapType = true;
      }
      if (objectType.isNamespace && !stack.parentStack.isMemberExpression) {
        const mappingNs = ctx2.builder.getMappingNamespace(stack.value());
        if (mappingNs !== null) {
          return mappingNs ? ctx2.createIdentifierNode(mappingNs + "\\" + stack.property.value(), stack.property) : ctx2.createToken(stack.property);
        }
        return ctx2.createIdentifierNode("\\" + stack.value().replace(/\./g, "\\"));
      }
      if (description && description.isType && description.isAnyType) {
        let isReflect = !!objectType.isAnyType;
        const hasDynamic = description.isComputeType && description.isPropertyExists();
        if (!hasDynamic && !stack.compiler.callUtils("isLiteralObjectType", objectType)) {
          isReflect = true;
        }
        if (isReflect) {
          const Reflect2 = stack.getGlobalTypeById("Reflect");
          ctx2.addDepend(Reflect2);
          return ctx2.createCalleeNode(
            ctx2.createStaticMemberNode([
              ctx2.createIdentifierNode(ctx2.getModuleReferenceName(Reflect2)),
              ctx2.createIdentifierNode("get")
            ]),
            [
              ctx2.createClassRefsNode(module3),
              ctx2.createToken(stack.object),
              stack.computed ? ctx2.createToken(stack.property) : ctx2.createLiteralNode(stack.property.value(), void 0, stack.property)
            ],
            stack
          );
        }
        computed = true;
      }
      var isNewObject = !!stack.object.isNewExpression;
      if (!isNewObject && stack.object.isParenthesizedExpression) {
        let op = stack.object.expression;
        while (op.isParenthesizedExpression) {
          op = op.expression;
        }
        isNewObject = !!op.isNewExpression;
      }
      var isStatic = stack.object.isSuperExpression || objectType.isClassType || !isNewObject && stack.compiler.callUtils("isClassType", objectDescription);
      var objectNode = null;
      var propertyNode = null;
      if (isStatic && !(objectType.isClassType || stack.object.isSuperExpression)) {
        if (stack.object.isCallExpression) {
          isStatic = false;
        }
      }
      let aliasAnnotation = null;
      let isMember = false;
      if (description && (description.isMethodGetterDefinition || description.isMethodSetterDefinition)) {
        aliasAnnotation = getAliasAnnotation(description);
        const result = trans(ctx2, stack, description, aliasAnnotation, objectType);
        if (result)
          return result;
        const members = [
          ctx2.createToken(stack.object),
          ctx2.createIdentifierNode(ctx2.getAccessorName(aliasAnnotation || stack.property.value(), description, description.isMethodGetterDefinition ? "get" : "set"))
        ];
        const callee = isStatic ? ctx2.createStaticMemberNode(members, stack) : ctx2.createMemberNode(members, stack);
        return description.isMethodGetterDefinition ? ctx2.createCalleeNode(callee, [], stack) : callee;
      } else if (description && description.isMethodDefinition) {
        aliasAnnotation = getAliasAnnotation(description);
        const result = trans(ctx2, stack, description, aliasAnnotation, objectType);
        if (result)
          return result;
        if (!stack.parentStack.isCallExpression && !stack.parentStack.isMemberExpression) {
          return ctx2.createArrayNode([
            ctx2.createToken(stack.object),
            ctx2.createLiteralNode(aliasAnnotation || stack.property.value())
          ]);
        }
        const pStack = stack.getParentStack((stack2) => !!(stack2.jsxElement || stack2.isBlockStatement || stack2.isCallExpression || stack2.isExpressionStatement));
        if (pStack && pStack.jsxElement) {
          const System = stack.getGlobalTypeById("System");
          ctx2.addDepend(System);
          return ctx2.createCalleeNode(
            ctx2.createStaticMemberNode([
              ctx2.createIdentifierNode(ctx2.getModuleReferenceName(System)),
              ctx2.createIdentifierNode("bind")
            ]),
            [
              ctx2.createArrayNode([
                ctx2.createToken(stack.object),
                ctx2.createLiteralNode(aliasAnnotation || stack.property.value(), void 0, stack.property)
              ]),
              ctx2.createThisNode()
            ]
          );
        }
        isMember = true;
      } else if (description && description.isPropertyDefinition) {
        aliasAnnotation = getAliasAnnotation(description);
        const result = trans(ctx2, stack, description, aliasAnnotation, objectType);
        if (result)
          return result;
        isMember = true;
      }
      const node = ctx2.createNode(stack);
      node.computed = computed;
      if (aliasAnnotation) {
        propertyNode = node.createIdentifierNode(aliasAnnotation, stack.property);
      }
      if (stack.computed) {
        const result = trans(ctx2, stack, description, aliasAnnotation, objectType);
        if (result)
          return result;
        if (!isStatic && rawObjectType && ctx2.isArrayAccessor(rawObjectType)) {
          node.computed = true;
        } else if (rawObjectType) {
          node.computed = !ctx2.isObjectAccessor(rawObjectType);
        }
      } else if (!isStatic && rawObjectType && ctx2.isArrayAccessor(rawObjectType)) {
        node.computed = true;
        propertyNode = node.createLiteralNode(stack.property.value(), void 0, stack.property);
      }
      if (stack.object.isNewExpression) {
        objectNode = node.createParenthesNode(node.createToken(stack.object));
      }
      node.object = objectNode || node.createToken(stack.object);
      node.property = propertyNode || node.createToken(stack.property);
      node.isStatic = isStatic;
      if (node.computed || !isMember) {
        let pStack = stack.parentStack;
        if (!(pStack.isMemberExpression || pStack.isCallExpression || pStack.isNewExpression || pStack.isAssignmentExpression)) {
          return node.createBinaryNode("??", node, node.createLiteralNode(null));
        }
      }
      return node;
    }
    module2.exports = MemberExpression;
  }
});

// tokens/MethodDefinition.js
var require_MethodDefinition = __commonJS({
  "tokens/MethodDefinition.js"(exports2, module2) {
    var FunctionDeclaration = require_FunctionDeclaration();
    module2.exports = function(ctx2, stack, type) {
      const node = FunctionDeclaration(ctx2, stack, type);
      node.async = stack.expression.async ? true : false;
      node.static = stack.static ? ctx2.createIdentifierNode("static") : null;
      node.final = stack.final ? ctx2.createIdentifierNode("final") : null;
      node.modifier = ctx2.createIdentifierNode(ctx2.compiler.callUtils("getModifierValue", stack));
      node.kind = "method";
      return node;
    };
  }
});

// tokens/MethodGetterDefinition.js
var require_MethodGetterDefinition = __commonJS({
  "tokens/MethodGetterDefinition.js"(exports2, module2) {
    var MethodDefinition = require_MethodDefinition();
    module2.exports = module2.exports = function(ctx2, stack, type) {
      const node = MethodDefinition(ctx2, stack, type);
      node.isAccessor = true;
      node.kind = "get";
      node.key.value = ctx2.getAccessorName(node.key.value, stack, "get");
      return node;
    };
  }
});

// tokens/MethodSetterDefinition.js
var require_MethodSetterDefinition = __commonJS({
  "tokens/MethodSetterDefinition.js"(exports2, module2) {
    var MethodDefinition = require_MethodDefinition();
    module2.exports = module2.exports = function(ctx2, stack, type) {
      const node = MethodDefinition(ctx2, stack, type);
      node.isAccessor = true;
      node.kind = "set";
      node.key.value = ctx2.getAccessorName(node.key.value, stack, "set");
      return node;
    };
  }
});

// tokens/NewExpression.js
var require_NewExpression = __commonJS({
  "tokens/NewExpression.js"(exports2, module2) {
    var Transform2 = require_Transform();
    function createArgumentNodes(ctx2, stack, args2, declareParams) {
      return args2.map((item, index) => {
        const node = ctx2.createToken(item);
        if (declareParams && declareParams[index] && !item.isIdentifier) {
          const declareParam = declareParams[index];
          if (!(declareParam.isRestElement || declareParam.isObjectPattern || declareParam.isArrayPattern)) {
            if (ctx2.isAddressRefsType(declareParam.type())) {
              const name2 = ctx2.checkRefsName("arg");
              ctx2.insertNodeBlockContextAt(
                ctx2.createAssignmentNode(ctx2.createIdentifierNode(name2, null, true), node)
              );
              return ctx2.createIdentifierNode(name2, null, true);
            }
          }
        }
        return node;
      });
    }
    module2.exports = function(ctx2, stack) {
      let type = stack.callee.type();
      let [classModule, desc2] = stack.getConstructMethod(type);
      let wrapType = null;
      if (desc2 && desc2.isNewDefinition && desc2.module) {
        type = desc2.module;
      }
      if (type) {
        type = stack.compiler.callUtils("getOriginType", type);
        if (stack.compiler.callUtils("isTypeModule", type)) {
          ctx2.addDepend(type);
        }
        if (type === ctx2.builder.getGlobalModuleById("Array")) {
          return Transform2.get("Array").of(
            ctx2,
            null,
            createArgumentNodes(ctx2, stack, stack.arguments, desc2 && desc2.params),
            true,
            false
          );
        }
        if (type === ctx2.builder.getGlobalModuleById("String")) {
          wrapType = "String";
        } else if (type === ctx2.builder.getGlobalModuleById("Number")) {
          wrapType = "Number";
        } else if (type === ctx2.builder.getGlobalModuleById("Boolean")) {
          wrapType = "Boolean";
        } else if (type === ctx2.builder.getGlobalModuleById("Object")) {
          wrapType = "Object";
        }
      }
      if (!type || !type.isModule || wrapType) {
        const Reflect2 = stack.getGlobalTypeById("Reflect");
        const node2 = ctx2.createNode(stack);
        node2.addDepend(Reflect2);
        let target = node2.createToken(stack.callee);
        if (!wrapType && !stack.callee.isIdentifier) {
          const refs = node2.checkRefsName("ref");
          ctx2.insertNodeBlockContextAt(
            ctx2.createAssignmentNode(ctx2.createIdentifierNode(refs, null, true), target)
          );
          target = ctx2.createIdentifierNode(refs, null, true);
        } else if (stack.callee.isIdentifier) {
          const refDesc = stack.descriptor();
          if (!refDesc || !refDesc.isDeclarator) {
            target = ctx2.createLiteralNode(stack.callee.raw());
          }
        }
        return node2.createCalleeNode(
          node2.createStaticMemberNode([
            node2.createIdentifierNode(node2.getModuleReferenceName(Reflect2)),
            node2.createIdentifierNode("construct")
          ]),
          [
            stack.module ? node2.createClassRefsNode(stack.module) : node2.createLiteralNode(null),
            target,
            node2.createArrayNode(createArgumentNodes(ctx2, stack, stack.arguments || [], desc2 && desc2.params), stack)
          ],
          stack
        );
      }
      const node = ctx2.createNode(stack);
      node.callee = node.createToken(stack.callee);
      if (stack.callee.isParenthesizedExpression) {
        const name2 = ctx2.checkRefsName("_refClass");
        node.insertNodeBlockContextAt(ctx2.createAssignmentNode(ctx2.createIdentifierNode(name2, null, true), node.callee.expression));
        node.callee = ctx2.createIdentifierNode(name2, null, true);
      }
      node.arguments = createArgumentNodes(node, stack, stack.arguments || [], desc2 && desc2.params);
      return node;
    };
  }
});

// transforms/System.js
var require_System = __commonJS({
  "transforms/System.js"(exports2, module2) {
    var methods = {
      merge(ctx2, object, args2) {
        const _System = ctx2.builder.getGlobalModuleById("System");
        ctx2.addDepend(_System);
        let target = object;
        if (object.type !== "Identifier") {
          const refs = ctx2.checkRefsName("ref");
          ctx2.insertNodeBlockContextAt(
            ctx2.createAssignmentNode(ctx2.createIdentifierNode(refs, null, true), object)
          );
          target = ctx2.createIdentifierNode(refs, null, true);
        }
        return ctx2.createCalleeNode(
          ctx2.createStaticMemberNode([
            ctx2.createIdentifierNode(ctx2.getModuleReferenceName(_System)),
            ctx2.createIdentifierNode("merge")
          ]),
          [target].concat(args2)
        );
      }
    };
    module2.exports = methods;
  }
});

// tokens/ObjectExpression.js
var require_ObjectExpression = __commonJS({
  "tokens/ObjectExpression.js"(exports2, module2) {
    var _System = require_System();
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      let spreadIndex = [];
      node.properties = stack.properties.map((stack2, index) => {
        let item = node.createToken(stack2);
        if (item && stack2.isSpreadElement) {
          spreadIndex.push(index);
        }
        return item;
      });
      if (spreadIndex.length > 0) {
        const segs = [];
        let start = 0;
        let end = 0;
        while (end = spreadIndex.shift() && end > start) {
          segs.push(ctx2.createObjectNode(node.properties.slice(start, end)));
          segs.push(node.properties[end]);
          start = end + 1;
        }
        if (start < node.properties.length) {
          if (node.properties.length === 1) {
            segs.push(node.properties[0]);
          } else {
            segs.push(ctx2.createObjectNode(node.properties.slice(start, node.properties.length)));
          }
        }
        return _System.merge(ctx2, ctx2.createArrayNode(), segs);
      }
      return node;
    };
  }
});

// tokens/ObjectPattern.js
var require_ObjectPattern = __commonJS({
  "tokens/ObjectPattern.js"(exports2, module2) {
    function createRefs(ctx2, target, expression) {
      const name2 = ctx2.getDeclareRefsName(target, "S");
      const refNode = ctx2.createDeclarationNode("const", [
        ctx2.createDeclaratorNode(
          ctx2.createIdentifierNode(name2),
          ctx2.createTypeTransformNode("object", expression)
        )
      ]);
      ctx2.insertNodeBlockContextAt(refNode);
    }
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      const target = stack.parentStack.init;
      if (target) {
        if (!(target.isObjectExpression || target.isArrayExpression)) {
          createRefs(node, target, node.createToken(target));
        }
      }
      node.properties = stack.properties.map((item) => node.createToken(item));
      return node;
    };
  }
});

// tokens/PackageDeclaration.js
var require_PackageDeclaration = __commonJS({
  "tokens/PackageDeclaration.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.body = [];
      stack.body.forEach((item) => {
        if (item.isClassDeclaration || item.isDeclaratorDeclaration || item.isEnumDeclaration || item.isInterfaceDeclaration || item.isStructTableDeclaration) {
          node.body.push(node.createToken(item));
        }
      });
      return node;
    };
  }
});

// tokens/ParenthesizedExpression.js
var require_ParenthesizedExpression = __commonJS({
  "tokens/ParenthesizedExpression.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      if (stack.parentStack.isExpressionStatement) {
        return ctx2.createToken(stack.expression);
      }
      if (stack.expression.isCallExpression && stack.expression.callee.isFunctionExpression) {
        return ctx2.createToken(stack.expression);
      }
      const node = ctx2.createNode(stack);
      node.expression = node.createToken(stack.expression);
      return node;
    };
  }
});

// tokens/Program.js
var require_Program = __commonJS({
  "tokens/Program.js"(exports2, module2) {
    var path3 = require("path");
    function createDependencies(stack, ctx2, node, importExcludes) {
      const imports = [];
      const using = [];
      const plugin = ctx2.plugin;
      const builder = ctx2.builder;
      const importFlag = plugin.options.import;
      const consistent = plugin.options.consistent;
      const folderAsNamespace = plugin.options.folderAsNamespace;
      const usingExcludes = /* @__PURE__ */ new WeakSet();
      builder.getGlobalModules().forEach((module3) => {
        usingExcludes.add(module3);
      });
      const dependencies = node.getDependencies();
      const createUse = (depModule) => {
        if (!usingExcludes.has(depModule)) {
          const name2 = builder.getModuleNamespace(depModule, depModule.id);
          if (name2) {
            let local = name2;
            let imported = void 0;
            using.push(node.createUsingStatementNode(
              node.createImportSpecifierNode(local, imported)
            ));
          }
        }
      };
      dependencies.forEach((depModule) => {
        if (stack.compiler.isPluginInContext(plugin, depModule)) {
          if (!importExcludes.has(depModule)) {
            if (node.isActiveForModule(depModule)) {
              if (importFlag) {
                if (!builder.isImportExclude(depModule)) {
                  const source = builder.getModuleImportSource(depModule, stack.compilation.file);
                  imports.push(node.createImportNode(source));
                }
              } else if (!(consistent || folderAsNamespace)) {
                const source = builder.getFileRelativeOutputPath(depModule);
                const name2 = builder.getModuleNamespace(depModule, depModule.id);
                builder.addFileAndNamespaceMapping(source, name2);
              }
              createUse(depModule);
            } else if (node.isReferenceDeclaratorModule(depModule)) {
              createUse(depModule);
            }
          }
        }
      });
      return [imports, using];
    }
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.body = [];
      node.afterBody = [];
      node.imports = [];
      stack.body.forEach((item) => {
        if (stack.isJSXProgram || item.isClassDeclaration || item.isDeclaratorDeclaration || item.isStructTableDeclaration || item.isEnumDeclaration || item.isInterfaceDeclaration || item.isPackageDeclaration) {
          node.body.push(node.createToken(item));
        }
      });
      const externalImports = [];
      const insertImports = [];
      const insertUsing = [];
      const importExcludes = /* @__PURE__ */ new WeakSet();
      if (stack.externals.length > 0) {
        stack.externals.forEach((item) => {
          if (item.isImportDeclaration) {
            const desc2 = item.description();
            if (desc2 && desc2.isModule) {
              importExcludes.add(desc2);
            }
            externalImports.push(item);
          } else {
            const obj = node.createToken(item);
            if (obj) {
              node.body.push(obj);
            }
          }
        });
      }
      if (stack.exports.length > 0) {
        const dataset = [];
        const isDefaultGlobal = stack.exports.length === 1 && stack.exports[0].isExportDefaultDeclaration;
        stack.exports.forEach((item) => {
          const obj = node.createToken(item);
          if (obj.type === "ExportNamedDeclaration") {
            if (obj.declaration) {
              if (obj.declaration.type === "FunctionDeclaration") {
                dataset.push(
                  node.createPropertyNode(
                    obj.declaration.key.value,
                    obj.declaration
                  )
                );
              } else if (obj.declaration.type === "Identifier") {
                dataset.push(
                  node.createPropertyNode(
                    obj.declaration.value,
                    obj.declaration
                  )
                );
              } else if (obj.declaration.type === "ClassDeclaration") {
                dataset.push(
                  node.createPropertyNode(
                    obj.declaration.module.id,
                    node.createIdentifierNode(
                      node.getModuleReferenceName(
                        obj.declaration.module
                      )
                    )
                  )
                );
              } else if (obj.declaration.type === "VariableDeclaration") {
                obj.declaration.declarations.forEach((declare) => {
                  if (declare.init)
                    dataset.push(node.createPropertyNode(declare.id.value, declare.init));
                });
              }
            } else if (obj.specifiers && obj.specifiers.length > 0) {
              if (obj.source) {
                const refs = obj.checkRefsName(path3.parse(obj.source.value).name, true);
                insertImports.push(node.createImportNode(obj.source, [[refs]]));
                obj.specifiers.forEach((specifier) => {
                  dataset.push(
                    node.createPropertyNode(
                      specifier.exported.value,
                      node.createBinaryNode(
                        "??",
                        node.createMemberNode(node.createIdentifierNode(refs, null, true), specifier.local),
                        node.createLiteralNode(null)
                      )
                    )
                  );
                });
              } else {
                obj.specifiers.forEach((specifier) => {
                  dataset.push(
                    node.createPropertyNode(
                      specifier.exported.value,
                      specifier.local
                    )
                  );
                });
              }
            }
          } else if (obj.type === "ExportDefaultDeclaration") {
            if (isDefaultGlobal) {
              if (obj.declaration.type === "ClassDeclaration") {
                dataset.push(node.createIdentifierNode(
                  node.getModuleReferenceName(obj.declaration.module)
                ));
              } else {
                dataset.push(obj.declaration);
              }
            } else {
              if (obj.declaration.type === "ClassDeclaration") {
                dataset.push(
                  node.createPropertyNode(
                    "default",
                    node.createIdentifierNode(
                      node.getModuleReferenceName(obj.declaration.module)
                    )
                  )
                );
              } else {
                dataset.push(node.createPropertyNode("default", obj.declaration));
              }
            }
          } else if (obj.type === "ExportAllDeclaration") {
            const refs = obj.checkRefsName(obj.exported.value, true);
            insertImports.push(node.createImportNode(obj.source, [[refs]]));
            dataset.push(
              node.createPropertyNode(
                obj.exported.value,
                node.createIdentifierNode(refs, null, true)
              )
            );
          }
        });
        if (isDefaultGlobal) {
          if (dataset[0]) {
            node.afterBody.push(node.createReturnNode(dataset[0]));
          }
        } else {
          node.afterBody.push(node.createReturnNode(node.createObjectNode(dataset)));
        }
      }
      if (!stack.compilation.mainModule && (stack.externals.length > 0 || stack.exports.length > 0)) {
        const [imps, using] = createDependencies(stack, ctx2, node, importExcludes);
        insertImports.push(...imps);
        insertUsing.push(...using);
      }
      externalImports.forEach((item) => {
        const obj = node.createToken(item);
        if (obj) {
          node.imports.push(obj);
        }
      });
      node.imports.push(...insertImports);
      node.body.unshift(...node.imports);
      node.body.push(...insertUsing);
      node.body.push(...node.afterBody);
      delete node.afterBody;
      delete node.imports;
      return node;
    };
  }
});

// tokens/Property.js
var require_Property = __commonJS({
  "tokens/Property.js"(exports2, module2) {
    function getSpreadRefName(ctx2, target) {
      let name2 = ctx2.getWasRefsName(target, "S");
      if (!name2) {
        name2 = ctx2.getDeclareRefsName(target, "S");
        const refNode = ctx2.createDeclarationNode("const", [
          ctx2.createDeclaratorNode(
            ctx2.createIdentifierNode(name2),
            ctx2.createTypeTransformNode("object", ctx2.createToken(target))
          )
        ]);
        ctx2.insertNodeBlockContextAt(refNode);
      }
      return ctx2.createIdentifierNode(name2, null, true);
    }
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.computed = !!stack.computed;
      if (stack.parentStack.isObjectPattern) {
        const target = stack.parentStack.parentStack.init;
        let key = stack.value();
        let name2 = null;
        let value2 = null;
        if (stack.hasAssignmentPattern) {
          value2 = node.createToken(stack.init.right);
          name2 = stack.init.left.value();
        } else {
          value2 = node.createLiteralNode(null);
          name2 = stack.init.value();
        }
        if (target.isObjectExpression || target.isArrayExpression) {
          const init = target.attribute(key);
          return node.createStatementNode(
            node.createAssignmentNode(
              node.createIdentifierNode(name2, null, true),
              init ? node.createBinaryNode("??", node.createToken(init.init), init.init.isLiteral ? node.createLiteralNode(null) : value2) : value2
            )
          );
        } else {
          const obj = getSpreadRefName(node, target);
          return node.createStatementNode(
            node.createAssignmentNode(
              node.createIdentifierNode(name2, null, true),
              node.createBinaryNode("??", node.createMemberNode([
                obj,
                node.createIdentifierNode(key)
              ], null), value2)
            )
          );
        }
      }
      if (!node.computed && stack.parentStack.isObjectExpression) {
        node.key = node.createLiteralNode(stack.key.value());
      } else {
        node.key = node.createToken(stack.key);
        if (node.computed && node.key.type === "Identifier") {
          node.key.isVariable = true;
        }
      }
      node.init = node.createToken(stack.init);
      if (stack.hasInit && ctx2.isPassableReferenceExpress(stack.init, stack.type())) {
        if (stack.init.isCallExpression || stack.init.isAwaitExpression) {
          const name2 = ctx2.getDeclareRefsName(stack.init, "R");
          const refNode = ctx2.createDeclarationNode("const", [
            ctx2.createDeclaratorNode(
              ctx2.createIdentifierNode(name2),
              ctx2.creaateAddressRefsNode(node.init)
            )
          ]);
          ctx2.insertNodeBlockContextAt(refNode);
          node.init = ctx2.creaateAddressRefsNode(ctx2.createIdentifierNode(name2, null, true));
        } else {
          node.init = ctx2.creaateAddressRefsNode(node.init);
        }
      }
      return node;
    };
  }
});

// tokens/PropertyDefinition.js
var require_PropertyDefinition = __commonJS({
  "tokens/PropertyDefinition.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const annotations = stack.annotations || [];
      var embeds = annotations.filter((item) => {
        return item.name.toLowerCase() === "embed";
      });
      var init = null;
      if (embeds.length > 0) {
        var items = [];
        embeds.forEach((embed) => {
          const args2 = embed.getArguments();
          args2.forEach((item) => {
            if (item.resolveFile) {
              const value2 = ctx2.builder.getAssetFileReferenceName(stack.module, item.resolveFile);
              items.push(value2);
            }
          });
        });
        init = items.length > 1 ? ctx2.createArrayNode(items.map((value2) => ctx2.createLiteralNode(value2))) : ctx2.createLiteralNode(items[0]);
      }
      const node = ctx2.createNode(stack);
      node.declarations = (stack.declarations || []).map((item) => node.createToken(item));
      node.modifier = ctx2.createIdentifierNode(stack.compiler.callUtils("getModifierValue", stack));
      if (stack.static && stack.kind === "const") {
        node.kind = stack.kind;
      } else if (stack.static) {
        node.static = ctx2.createIdentifierNode("static");
      }
      node.key = node.declarations[0].id;
      node.init = init || node.declarations[0].init || ctx2.createLiteralNode(null);
      return node;
    };
  }
});

// tokens/RestElement.js
var require_RestElement = __commonJS({
  "tokens/RestElement.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.value = stack.value();
      node.raw = node.value;
      return node;
    };
  }
});

// tokens/ReturnStatement.js
var require_ReturnStatement = __commonJS({
  "tokens/ReturnStatement.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.argument = node.createToken(stack.argument);
      return node;
    };
  }
});

// tokens/SequenceExpression.js
var require_SequenceExpression = __commonJS({
  "tokens/SequenceExpression.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.expressions = stack.expressions.map((item) => node.createToken(item));
      return node;
    };
  }
});

// tokens/SpreadElement.js
var require_SpreadElement = __commonJS({
  "tokens/SpreadElement.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      if (stack.parentStack.isArrayExpression) {
        const type = stack.argument.type();
        const _Array = stack.getGlobalTypeById("Array");
        const _array = stack.getGlobalTypeById("array");
        if (type && (type.isLiteralArrayType || type === _Array || type === _array)) {
          return ctx2.createToken(stack.argument);
        }
        const _System = stack.getGlobalTypeById("System");
        ctx2.addDepend(_System);
        const node2 = ctx2.createCalleeNode(
          ctx2.createStaticMemberNode([
            ctx2.getModuleReferenceName(_System),
            ctx2.createIdentifierNode("toArray")
          ]),
          [
            ctx2.createToken(stack.argument)
          ]
        );
        return node2;
      } else if (stack.parentStack.isObjectExpression) {
        return ctx2.createToken(stack.argument);
      }
      const node = ctx2.createNode(stack);
      node.argument = node.createToken(stack.argument);
      return node;
    };
  }
});

// tokens/StructTableColumnDefinition.js
var require_StructTableColumnDefinition = __commonJS({
  "tokens/StructTableColumnDefinition.js"(exports2, module2) {
    function createNode(ctx2, item) {
      if (!item)
        return null;
      return item.isIdentifier ? ctx2.createIdentifierNode(item.value().toLowerCase(), item) : item.isLiteral ? ctx2.createLiteralNode(item.value()) : ctx2.createToken(item);
    }
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.key = node.createIdentifierNode("`" + stack.key.value() + "`", stack.key);
      node.properties = [];
      const type = stack.typename ? node.createToken(stack.typename) : node.createIdentifierNode("varchar(255)");
      const unsigned = stack.unsigned ? node.createIdentifierNode("unsigned") : null;
      const notnull = !stack.question ? node.createIdentifierNode("not null") : null;
      node.properties.push(type);
      if (unsigned) {
        node.properties.push(unsigned);
      }
      if (notnull) {
        node.properties.push(notnull);
      }
      (stack.properties || []).forEach((item) => {
        node.properties.push(createNode(node, item));
      });
      return node;
    };
  }
});

// tokens/StructTableDeclaration.js
var require_StructTableDeclaration = __commonJS({
  "tokens/StructTableDeclaration.js"(exports2, module2) {
    function createNode(ctx2, item) {
      if (!item)
        return null;
      return item.isIdentifier ? ctx2.createIdentifierNode(item.value().toLowerCase(), item) : item.isLiteral ? ctx2.createLiteralNode(item.value()) : ctx2.createToken(item);
    }
    function normalName(name2) {
      return name2.replace(/([A-Z])/g, (a, b, i) => {
        return i > 0 ? "_" + b.toLowerCase() : b.toLowerCase();
      });
    }
    module2.exports = function(ctx2, stack) {
      const name2 = stack.module.getName();
      if (ctx2.builder.hasSqlTableNode(name2)) {
        return null;
      }
      const node = ctx2.createNode(stack);
      node.id = node.createIdentifierNode("`" + normalName(stack.id.value()) + "`", stack.id);
      node.properties = [];
      node.body = [];
      stack.body.forEach((item) => {
        const token = createNode(node, item);
        if (item.isStructTablePropertyDefinition) {
          node.properties.push(token);
        } else {
          node.body.push(token);
        }
      });
      node.builder.addSqlTableNode(name2, node, stack);
      return null;
    };
  }
});

// tokens/StructTableKeyDefinition.js
var require_StructTableKeyDefinition = __commonJS({
  "tokens/StructTableKeyDefinition.js"(exports2, module2) {
    function createNode(ctx2, item) {
      if (!item)
        return null;
      return item.isIdentifier ? ctx2.createIdentifierNode(item.value().toLowerCase(), item) : item.isLiteral ? ctx2.createLiteralNode(item.value()) : ctx2.createToken(item);
    }
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.key = createNode(node, stack.key);
      const key = stack.key.value().toLowerCase();
      node.prefix = key === "primary" || key === "key" ? null : node.createIdentifierNode("key");
      node.local = node.createToken(stack.local);
      node.properties = (stack.properties || []).map((item) => createNode(node, item));
      return node;
    };
  }
});

// tokens/StructTableMethodDefinition.js
var require_StructTableMethodDefinition = __commonJS({
  "tokens/StructTableMethodDefinition.js"(exports2, module2) {
    function createNode(ctx2, item, isKey = false, toLower = false) {
      if (!item)
        return null;
      if (item.isIdentifier) {
        let value2 = item.value();
        if (toLower)
          value2 = value2.toLowerCase();
        return ctx2.createIdentifierNode(isKey ? "`" + value2 + "`" : value2, item);
      }
      return item.isLiteral ? ctx2.createLiteralNode(item.value()) : ctx2.createToken(item);
    }
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      const key = stack.key.isMemberExpression ? stack.key.property : stack.key;
      node.key = createNode(node, key, false, true);
      const isKey = stack.parentStack.isStructTableKeyDefinition;
      node.params = (stack.params || []).map((item) => createNode(node, item, isKey));
      return node;
    };
  }
});

// tokens/StructTablePropertyDefinition.js
var require_StructTablePropertyDefinition = __commonJS({
  "tokens/StructTablePropertyDefinition.js"(exports2, module2) {
    function createNode(ctx2, item) {
      if (!item)
        return null;
      return item.isIdentifier ? ctx2.createIdentifierNode(item.value().toLowerCase(), item) : item.isLiteral ? ctx2.createLiteralNode(item.value()) : ctx2.createToken(item);
    }
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.assignment = !!stack.assignment;
      node.key = createNode(node, stack.key);
      node.init = createNode(node, stack.init);
      return node;
    };
  }
});

// tokens/SuperExpression.js
var require_SuperExpression = __commonJS({
  "tokens/SuperExpression.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.value = "parent";
      node.raw = "parent";
      return node;
    };
  }
});

// tokens/SwitchCase.js
var require_SwitchCase = __commonJS({
  "tokens/SwitchCase.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.condition = node.createToken(stack.condition);
      if (node.condition && node.condition.type === "ConditionalExpression") {
        node.condition = node.createParenthesNode(node.condition);
      }
      node.consequent = stack.consequent.map((item) => node.createToken(item));
      return node;
    };
  }
});

// tokens/SwitchStatement.js
var require_SwitchStatement = __commonJS({
  "tokens/SwitchStatement.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.condition = node.createToken(stack.condition);
      node.cases = stack.cases.map((item) => node.createToken(item));
      return node;
    };
  }
});

// tokens/TemplateElement.js
var require_TemplateElement = __commonJS({
  "tokens/TemplateElement.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.raw = stack.raw();
      node.value = node.raw;
      node.tail = stack.tail;
      return node;
    };
  }
});

// tokens/TemplateLiteral.js
var require_TemplateLiteral = __commonJS({
  "tokens/TemplateLiteral.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.quasis = stack.quasis.map((item) => node.createToken(item));
      node.expressions = stack.expressions.map((item) => node.createToken(item));
      return node;
    };
  }
});

// tokens/ThisExpression.js
var require_ThisExpression = __commonJS({
  "tokens/ThisExpression.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createIdentifierNode("this", stack, true);
      return node;
    };
  }
});

// tokens/ThrowStatement.js
var require_ThrowStatement = __commonJS({
  "tokens/ThrowStatement.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.argument = ctx2.createToken(stack.argument);
      return node;
    };
  }
});

// tokens/TryStatement.js
var require_TryStatement = __commonJS({
  "tokens/TryStatement.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.block = node.createToken(stack.block);
      node.param = ctx2.createNode("ParamDeclarator");
      node.param.argument = node.createToken(stack.param);
      node.param.argument.isVariable = true;
      node.param.type = "ParamDeclarator";
      node.param.prefix = "\\Exception";
      const acceptType = stack.param.acceptType ? stack.param.acceptType.type() : null;
      if (acceptType && acceptType.isModule) {
        const Throwable = ctx2.builder.getGlobalModuleById("Throwable");
        if (Throwable && Throwable.type().is(acceptType)) {
          node.param.prefix = ctx2.getModuleReferenceName(acceptType);
        }
      }
      node.handler = node.createToken(stack.handler);
      node.finalizer = node.createToken(stack.finalizer);
      return node;
    };
  }
});

// tokens/TypeAssertExpression.js
var require_TypeAssertExpression = __commonJS({
  "tokens/TypeAssertExpression.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      if (stack.left.isParenthesizedExpression) {
        return ctx2.createToken(stack.left.expression);
      }
      return ctx2.createToken(stack.left);
    };
  }
});

// tokens/TypeTransformExpression.js
var require_TypeTransformExpression = __commonJS({
  "tokens/TypeTransformExpression.js"(exports2, module2) {
    function createTransformNode(ctx2, method, expression) {
      return ctx2.createCalleeNode(
        ctx2.createIdentifierNode(method),
        [ctx2.createToken(expression)]
      );
    }
    module2.exports = function(ctx2, stack) {
      const type = stack.argument.type();
      var name2 = null;
      if (type) {
        const value2 = ctx2.builder.getAvailableOriginType(type);
        name2 = type.toString();
        if (value2 === "Number") {
          const method = name2 === "float" || name2 === "double" ? "floatval" : "intval";
          return createTransformNode(ctx2, method, stack.expression);
        } else if (value2 === "String") {
          return createTransformNode(ctx2, "strval", stack.expression);
        } else if (value2 === "Boolean") {
          return createTransformNode(ctx2, "boolval", stack.expression);
        } else if (value2 === "RegExp") {
          const regexp = stack.getGlobalTypeById("RegExp");
          const refs = ctx2.getModuleReferenceName(regexp);
          ctx2.addDepend(regexp);
          const test = ctx2.createBinaryNode("instanceof", ctx2.createToken(stack.expression), ctx2.createIdentifierNode(refs));
          const consequent = ctx2.createIdentifierNode(refs);
          const alternate = ctx2.createNewNode(
            ctx2.createIdentifierNode(refs),
            [
              ctx2.createCalleeNode(ctx2.createIdentifierNode("strval"), [ctx2.createToken(stack.expression)])
            ]
          );
          return ctx2.createParenthesNode(ctx2.createConditionalNode(test, consequent, alternate));
        } else if (value2 === "Function") {
          return ctx2.createToken(stack.expression);
        } else if (value2 === "Array") {
          name2 = "array";
        } else if (value2 === "Object") {
          name2 = "object";
        }
      }
      const node = ctx2.createNode(stack);
      node.typeName = name2;
      node.expression = node.createToken(stack.expression);
      return node;
    };
  }
});

// tokens/UnaryExpression.js
var require_UnaryExpression = __commonJS({
  "tokens/UnaryExpression.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const operator = stack.node.operator;
      const prefix = stack.node.prefix;
      if (operator === "delete" || operator === "typeof") {
        if (operator === "typeof") {
          const systemModule = ctx2.builder.getGlobalModuleById("System");
          const promiseRefs = ctx2.getModuleReferenceName(systemModule);
          ctx2.addDepend(systemModule);
          return ctx2.createCalleeNode(
            ctx2.createStaticMemberNode([
              ctx2.createIdentifierNode(promiseRefs),
              ctx2.createIdentifierNode("typeof", stack)
            ]),
            [
              ctx2.createToken(stack.argument)
            ]
          );
        }
        return ctx2.createCalleeNode(
          ctx2.createIdentifierNode("unset", stack),
          [
            ctx2.createToken(stack.argument)
          ]
        );
      }
      const node = ctx2.createNode(stack);
      if (operator.charCodeAt(0) === 33) {
        node.argument = node.createTransformBooleanTypeNode(stack.argument);
      } else {
        node.argument = node.createToken(stack.argument);
      }
      node.operator = operator;
      node.prefix = prefix;
      return node;
    };
  }
});

// tokens/UpdateExpression.js
var require_UpdateExpression = __commonJS({
  "tokens/UpdateExpression.js"(exports2, module2) {
    var Transform2 = require_Transform();
    function trans(ctx2, stack, description, aliasAnnotation, objectType) {
      const type = objectType;
      let name2 = ctx2.builder.getAvailableOriginType(type) || type.toString();
      if (objectType && (objectType.isUnionType || objectType.isIntersectionType) && description && description.isMethodDefinition && description.module && description.module.isModule) {
        name2 = desc.module.id;
      }
      if (Transform2.has(name2)) {
        const object = Transform2.get(name2);
        const key = stack.computed ? "$computed" : stack.property.value();
        if (Object.prototype.hasOwnProperty.call(object, key)) {
          if (stack.computed) {
            return object[key](
              ctx2,
              ctx2.createToken(stack.object),
              [ctx2.createToken(stack.property)],
              false,
              false
            );
          }
          if (description.static) {
            return object[key](
              ctx2,
              null,
              [],
              false,
              true
            );
          } else {
            return object[key](
              ctx2,
              ctx2.createToken(stack.object),
              [],
              false,
              false
            );
          }
        }
      }
      return null;
    }
    function getAliasAnnotation(desc2) {
      if (!desc2 || !desc2.isStack || !desc2.annotations)
        return null;
      const result = desc2.annotations.find((annotation) => {
        return annotation.name.toLowerCase() === "alias";
      });
      if (result) {
        const args2 = result.getArguments();
        if (args2[0])
          return args2[0].value;
      }
      return null;
    }
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      const operator = stack.node.operator;
      const prefix = stack.node.prefix;
      const isMember = stack.argument.isMemberExpression;
      if (isMember) {
        const desc2 = stack.argument.description();
        const module3 = stack.module;
        let isReflect = false;
        if (stack.argument.computed) {
          const hasDynamic = desc2 && desc2.isComputeType && desc2.isPropertyExists();
          if (!hasDynamic && !node.compiler.callUtils("isLiteralObjectType", stack.argument.object.type())) {
            isReflect = true;
          }
        } else if (desc2 && desc2.isAnyType) {
          isReflect = !node.compiler.callUtils("isLiteralObjectType", stack.argument.object.type());
        }
        if (isReflect) {
          const method = operator === "++" ? "incre" : "decre";
          const Reflect2 = stack.getGlobalTypeById("Reflect");
          node.addDepend(Reflect2);
          const callee = node.createStaticMemberNode([
            node.createIdentifierNode(node.getModuleReferenceName(Reflect2)),
            node.createIdentifierNode(method)
          ]);
          let object = node.createToken(stack.argument.object);
          if (!stack.argument.object.isIdentifier) {
            const refs = node.checkRefsName("ref");
            node.insertNodeBlockContextAt(
              node.createAssignmentNode(node.createIdentifierNode(refs, null, true), object)
            );
            object = node.createIdentifierNode(refs, null, true);
            if (node.isPassableReferenceExpress(stack.argument.object, stack.argument.object.type())) {
              object = node.creaateAddressRefsNode(object);
            }
          }
          return node.createCalleeNode(callee, [
            node.createCallReflectScopeNode(module3),
            object,
            node.createCallReflectPropertyNode(stack.argument),
            node.createLiteralNode(!!prefix)
          ], stack);
        } else if (desc2 && desc2.isMethodDefinition && desc2.isAccessor) {
          stack = stack.argument;
          var objectDescription = stack.object.description();
          var objectType = ctx2.inferType(stack.object);
          var isNewObject = !!stack.object.isNewExpression;
          var isStatic = stack.object.isSuperExpression || objectType.isClassType || !isNewObject && stack.compiler.callUtils("isClassType", objectDescription);
          const aliasAnnotation = getAliasAnnotation(desc2);
          const result = trans(node, stack, desc2, aliasAnnotation, objectType);
          if (result)
            return result;
          const getMember = [
            node.createToken(stack.object),
            node.createIdentifierNode(node.getAccessorName(aliasAnnotation || stack.property.value(), desc2, "get"))
          ];
          const setMember = [
            node.createToken(stack.object),
            node.createIdentifierNode(node.getAccessorName(aliasAnnotation || stack.property.value(), desc2, "set"))
          ];
          const getCallee = isStatic ? node.createStaticMemberNode(getMember) : node.createMemberNode(getMember);
          const setCallee = isStatic ? node.createStaticMemberNode(setMember) : node.createMemberNode(setMember);
          if (stack.parentStack.parentStack.isExpressionStatement) {
            const value2 = node.createBinaryNode(operator === "++" ? "+" : "-", node.createCalleeNode(getCallee), node.createLiteralNode(1));
            return node.createCalleeNode(setCallee, [value2]);
          } else {
            const System = stack.getGlobalTypeById("System");
            node.addDepend(System);
            const sequence = node.createStaticMemberNode([
              node.createIdentifierNode(node.getModuleReferenceName(System)),
              node.createIdentifierNode("sequences")
            ]);
            const refs = node.checkRefsName("V");
            let update = node.createBinaryNode(operator === "++" ? "+" : "-", node.createIdentifierNode(refs, null, true), node.createLiteralNode(1));
            if (prefix) {
              update = node.createAssignmentNode(
                node.createIdentifierNode(refs, null, true),
                update
              );
            }
            return node.createCalleeNode(sequence, [
              node.createAssignmentNode(node.createIdentifierNode(refs, null, true), node.createCalleeNode(getCallee)),
              node.createCalleeNode(setCallee, [update]),
              node.createIdentifierNode(refs, null, true)
            ]);
          }
        }
      }
      node.argument = node.createToken(stack.argument);
      node.operator = operator;
      node.prefix = prefix;
      return node;
    };
  }
});

// tokens/VariableDeclaration.js
var require_VariableDeclaration = __commonJS({
  "tokens/VariableDeclaration.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.inFor = stack.flag;
      node.kind = stack.kind;
      node.declarations = stack.declarations.map((item) => {
        return node.createToken(item);
      });
      return node;
    };
  }
});

// tokens/VariableDeclarator.js
var require_VariableDeclarator = __commonJS({
  "tokens/VariableDeclarator.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.inFor = stack.parentStack.flag;
      if (stack.id.isIdentifier) {
        node.id = node.createIdentifierNode(stack.id.value(), stack.id);
      } else {
        node.id = node.createToken(stack.id);
      }
      if (stack.parentStack.isVariableDeclaration && stack.id.isIdentifier) {
        const type = ctx2.inferType(stack, stack.init && stack.init.getContext());
        if (node.isAddressRefsType(type, stack.init)) {
          if (node.hasCrossScopeAssignment(stack.assignItems, !!node.inFor)) {
            const address = node.addAssignAddressRef(stack, stack.init);
            const name2 = stack.id.value();
            address.setName(stack.description(), name2);
            const left = address.createIndexName(stack.description());
            if (stack.init) {
              let init = node.createToken(stack.init);
              if (node.isPassableReferenceExpress(stack.init)) {
                init = node.creaateAddressRefsNode(init);
              }
              const index = address.getIndex(stack.init);
              const key = node.createAssignmentNode(
                node.createIdentifierNode(left, null, true),
                node.createLiteralNode(index)
              );
              node.id = node.createMemberNode([
                node.id,
                key
              ], null, true);
              node.init = init;
              return node;
            }
          } else if (stack.init && node.isPassableReferenceExpress(stack.init)) {
            if (stack.parentStack.parentStack.isExportNamedDeclaration) {
              const name2 = ctx2.getDeclareRefsName(stack.init, "R");
              const refNode = ctx2.createDeclarationNode("const", [
                ctx2.createDeclaratorNode(
                  ctx2.createIdentifierNode(name2),
                  ctx2.creaateAddressRefsNode(node.createToken(stack.init))
                )
              ]);
              ctx2.insertNodeBlockContextAt(refNode);
              node.init = ctx2.creaateAddressRefsNode(ctx2.createIdentifierNode(name2, null, true));
            } else {
              node.init = node.creaateAddressRefsNode(node.createToken(stack.init));
            }
            return node;
          }
          if (node.inFor) {
            node.init = node.createToken(stack.init);
            return node.creaateAddressRefsNode(node);
          }
        }
      }
      node.init = node.createToken(stack.init);
      return node;
    };
  }
});

// tokens/WhenStatement.js
var require_WhenStatement = __commonJS({
  "tokens/WhenStatement.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      ctx2 = ctx2.createNode(stack);
      const name2 = stack.condition.value();
      const args2 = stack.condition.arguments.map((item, index) => {
        let value2 = null;
        let key = index;
        if (item.isAssignmentExpression) {
          key = item.left.value();
          value2 = item.right.value();
        } else {
          value2 = item.value();
        }
        return { index, key, value: value2, stack: item };
      });
      const expectRaw = args2.find((item) => String(item.key).toLowerCase() === "expect");
      const expect = expectRaw ? String(expectRaw.value).trim() !== "false" : true;
      let result = false;
      switch (name2) {
        case "Runtime":
          result = ctx2.builder.isRuntime(args2[0].value) === expect;
          break;
        case "Syntax":
          result = ctx2.builder.isSyntax(args2[0].value) === expect;
          break;
        case "Env":
          {
            const name3 = args2.find((item) => String(item.key).toLowerCase() === "name") || args2[0];
            const value2 = args2.find((item) => String(item.key).toLowerCase() === "value") || args2[1];
            if (name3 && value2) {
              result = ctx2.builder.isEnv(name3.value, value2.value) === expect;
            } else {
              stack.condition.error(`Missing name or value arguments. the '${stack.condition.value()}' annotations.`);
            }
          }
          break;
        case "Version":
          {
            const name3 = args2.find((item) => String(item.key).toLowerCase() === "name") || args2[0];
            const version = args2.find((item) => String(item.key).toLowerCase() === "version") || args2[1];
            const operator = args2.find((item) => String(item.key).toLowerCase() === "operator") || args2[2];
            if (name3 && version) {
              const args3 = [name3.value, version.value];
              if (operator) {
                args3.push(operator.value);
              }
              result = ctx2.builder.isVersion.apply(ctx2.builder, args3) === expect;
            } else {
              stack.condition.error(`Missing name or value arguments. the '${stack.condition.value()}' annotations.`);
            }
          }
          break;
        default:
      }
      const node = ctx2.createToken(result ? stack.consequent : stack.alternate);
      node && (node.isWhenStatement = true);
      return node;
    };
  }
});

// tokens/WhileStatement.js
var require_WhileStatement = __commonJS({
  "tokens/WhileStatement.js"(exports2, module2) {
    module2.exports = function(ctx2, stack) {
      const node = ctx2.createNode(stack);
      node.condition = node.createTransformBooleanTypeNode(stack.condition);
      node.body = node.createToken(stack.body);
      return node;
    };
  }
});

// tokens/index.js
var require_tokens = __commonJS({
  "tokens/index.js"(exports2, module2) {
    var modules2 = /* @__PURE__ */ new Map();
    modules2.set("AnnotationDeclaration", require_AnnotationDeclaration());
    modules2.set("AnnotationExpression", require_AnnotationExpression());
    modules2.set("ArrayExpression", require_ArrayExpression());
    modules2.set("ArrayPattern", require_ArrayPattern());
    modules2.set("ArrowFunctionExpression", require_ArrowFunctionExpression());
    modules2.set("AssignmentExpression", require_AssignmentExpression());
    modules2.set("AssignmentPattern", require_AssignmentPattern());
    modules2.set("AwaitExpression", require_AwaitExpression());
    modules2.set("BinaryExpression", require_BinaryExpression());
    modules2.set("BlockStatement", require_BlockStatement());
    modules2.set("BreakStatement", require_BreakStatement());
    modules2.set("CallExpression", require_CallExpression());
    modules2.set("ClassDeclaration", require_ClassDeclaration());
    modules2.set("ConditionalExpression", require_ConditionalExpression());
    modules2.set("ContinueStatement", require_ContinueStatement());
    modules2.set("Declarator", require_Declarator());
    modules2.set("DeclaratorDeclaration", require_DeclaratorDeclaration());
    modules2.set("DoWhileStatement", require_DoWhileStatement());
    modules2.set("EmptyStatement", require_EmptyStatement());
    modules2.set("EnumDeclaration", require_EnumDeclaration());
    modules2.set("EnumProperty", require_EnumProperty());
    modules2.set("ExportAllDeclaration", require_ExportAllDeclaration());
    modules2.set("ExportDefaultDeclaration", require_ExportDefaultDeclaration());
    modules2.set("ExportNamedDeclaration", require_ExportNamedDeclaration());
    modules2.set("ExportSpecifier", require_ExportSpecifier());
    modules2.set("ExpressionStatement", require_ExpressionStatement());
    modules2.set("ForInStatement", require_ForInStatement());
    modules2.set("ForOfStatement", require_ForOfStatement());
    modules2.set("ForStatement", require_ForStatement());
    modules2.set("FunctionDeclaration", require_FunctionDeclaration());
    modules2.set("FunctionExpression", require_FunctionExpression());
    modules2.set("Identifier", require_Identifier());
    modules2.set("IfStatement", require_IfStatement());
    modules2.set("ImportDeclaration", require_ImportDeclaration());
    modules2.set("ImportDefaultSpecifier", require_ImportDefaultSpecifier());
    modules2.set("ImportExpression", require_ImportExpression());
    modules2.set("ImportNamespaceSpecifier", require_ImportNamespaceSpecifier());
    modules2.set("ImportSpecifier", require_ImportSpecifier());
    modules2.set("InterfaceDeclaration", require_InterfaceDeclaration());
    modules2.set("JSXAttribute", require_JSXAttribute());
    modules2.set("JSXCdata", require_JSXCdata());
    modules2.set("JSXClosingElement", require_JSXClosingElement());
    modules2.set("JSXClosingFragment", require_JSXClosingFragment());
    modules2.set("JSXElement", require_JSXElement());
    modules2.set("JSXEmptyExpression", require_JSXEmptyExpression());
    modules2.set("JSXExpressionContainer", require_JSXExpressionContainer());
    modules2.set("JSXFragment", require_JSXFragment());
    modules2.set("JSXIdentifier", require_JSXIdentifier());
    modules2.set("JSXMemberExpression", require_JSXMemberExpression());
    modules2.set("JSXNamespacedName", require_JSXNamespacedName());
    modules2.set("JSXOpeningElement", require_JSXOpeningElement());
    modules2.set("JSXOpeningFragment", require_JSXOpeningFragment());
    modules2.set("JSXScript", require_JSXScript());
    modules2.set("JSXSpreadAttribute", require_JSXSpreadAttribute());
    modules2.set("JSXStyle", require_JSXStyle());
    modules2.set("JSXText", require_JSXText());
    modules2.set("LabeledStatement", require_LabeledStatement());
    modules2.set("Literal", require_Literal());
    modules2.set("LogicalExpression", require_LogicalExpression());
    modules2.set("MemberExpression", require_MemberExpression());
    modules2.set("MethodDefinition", require_MethodDefinition());
    modules2.set("MethodGetterDefinition", require_MethodGetterDefinition());
    modules2.set("MethodSetterDefinition", require_MethodSetterDefinition());
    modules2.set("NewExpression", require_NewExpression());
    modules2.set("ObjectExpression", require_ObjectExpression());
    modules2.set("ObjectPattern", require_ObjectPattern());
    modules2.set("PackageDeclaration", require_PackageDeclaration());
    modules2.set("ParenthesizedExpression", require_ParenthesizedExpression());
    modules2.set("Program", require_Program());
    modules2.set("Property", require_Property());
    modules2.set("PropertyDefinition", require_PropertyDefinition());
    modules2.set("RestElement", require_RestElement());
    modules2.set("ReturnStatement", require_ReturnStatement());
    modules2.set("SequenceExpression", require_SequenceExpression());
    modules2.set("SpreadElement", require_SpreadElement());
    modules2.set("StructTableColumnDefinition", require_StructTableColumnDefinition());
    modules2.set("StructTableDeclaration", require_StructTableDeclaration());
    modules2.set("StructTableKeyDefinition", require_StructTableKeyDefinition());
    modules2.set("StructTableMethodDefinition", require_StructTableMethodDefinition());
    modules2.set("StructTablePropertyDefinition", require_StructTablePropertyDefinition());
    modules2.set("SuperExpression", require_SuperExpression());
    modules2.set("SwitchCase", require_SwitchCase());
    modules2.set("SwitchStatement", require_SwitchStatement());
    modules2.set("TemplateElement", require_TemplateElement());
    modules2.set("TemplateLiteral", require_TemplateLiteral());
    modules2.set("ThisExpression", require_ThisExpression());
    modules2.set("ThrowStatement", require_ThrowStatement());
    modules2.set("TryStatement", require_TryStatement());
    modules2.set("TypeAssertExpression", require_TypeAssertExpression());
    modules2.set("TypeTransformExpression", require_TypeTransformExpression());
    modules2.set("UnaryExpression", require_UnaryExpression());
    modules2.set("UpdateExpression", require_UpdateExpression());
    modules2.set("VariableDeclaration", require_VariableDeclaration());
    modules2.set("VariableDeclarator", require_VariableDeclarator());
    modules2.set("WhenStatement", require_WhenStatement());
    modules2.set("WhileStatement", require_WhileStatement());
    module2.exports = modules2;
  }
});

// package.json
var require_package = __commonJS({
  "package.json"(exports2, module2) {
    module2.exports = {
      name: "es-php",
      version: "0.4.1",
      description: "test",
      main: "dist/index.js",
      typings: "dist/types/typings.json",
      scripts: {
        dev: "jasmine ./test/index.js",
        run: "node ./test/phptest.js",
        test: "npm run dev & npm run run",
        build: "node ./scripts/build.js",
        manifest: "node ./scripts/manifest.js"
      },
      repository: {
        type: "git",
        url: "git+https://github.com/51breeze/es-php.git"
      },
      keywords: [
        "es",
        "javascript",
        "web"
      ],
      author: "Jun Ye",
      license: "MIT",
      bugs: {
        url: "https://github.com/51breeze/es-php/issues"
      },
      homepage: "https://github.com/51breeze/es-php#readme",
      dependencies: {
        "fs-extra": "^11.2.0",
        "glob-path": "latest",
        lodash: "^4.17.21"
      },
      esconfig: {
        scope: "es-php",
        inherits: []
      },
      devDependencies: {
        easescript: "latest",
        esbuild: "^0.17.11",
        "esbuild-plugin-copy": "^2.1.0",
        jasmine: "^3.10.0",
        less: "^4.1.3",
        "node-sass": "^7.0.1",
        rollup: "^2.78.1",
        "rollup-plugin-commonjs": "^10.1.0",
        "rollup-plugin-node-resolve": "^5.2.0"
      }
    };
  }
});

// index.js
var path2 = require("path");
var Builder = require_Builder();
var Token = require_Token();
var Polyfill = require_Polyfill();
var ClassBuilder = require_ClassBuilder();
var Constant = require_Constant();
var Router = require_Router();
var Sql = require_Sql();
var Transform = require_Transform();
var JSXTransform = require_JSXTransform();
var JSXClassBuilder = require_JSXClassBuilder();
var Assets = require_Assets();
var Glob2 = require_glob_path();
var mergeWith = require("lodash/mergeWith");
var modules = require_tokens();
var defaultConfig = {
  target: 7,
  strict: true,
  emit: true,
  useAbsolutePathImport: false,
  import: true,
  suffix: ".php",
  context: {
    include: null,
    exclude: null,
    only: false
  },
  dependencies: {
    "moment": {
      name: "fightbulc/moment",
      version: "^1.33.0",
      env: "prod"
    }
  },
  metadata: {
    env: {}
  },
  composer: null,
  consistent: true,
  assets: /\.(gif|png|jpeg|jpg|svg|bmp|icon|font|css|less|sass|js|mjs|mp4)$/i,
  lessOptions: {},
  sassOptions: {},
  rollupOptions: {
    input: {
      plugins: []
    },
    output: {
      format: "cjs",
      exports: "auto"
    }
  },
  resolve: {
    usings: {},
    folders: {
      "*.global": "escore"
    },
    formats: {},
    namespaces: {}
  },
  folderAsNamespace: true,
  publicPath: "public",
  externals: [],
  excludes: [],
  includes: []
};
var pkg = require_package();
var generatedCodeMaps = /* @__PURE__ */ new Map();
function registerError(define, cn, en) {
  if (registerError.loaded)
    return;
  registerError.loaded = true;
  define(2e4, "", [
    "\u7C7B(%s)\u547D\u540D\u7A7A\u95F4\u5FC5\u987B\u4E0E\u6587\u4EF6\u8DEF\u5F84\u4E00\u81F4",
    "The '%s' class namespace must be consistent with the file path"
  ]);
}
function merge(...args2) {
  return mergeWith(...args2, (objValue, srcValue) => {
    if (Array.isArray(objValue) && Array.isArray(srcValue)) {
      if (srcValue[0] === null)
        return srcValue.slice(1);
      srcValue.forEach((value2) => {
        if (!objValue.includes(value2)) {
          objValue.push(value2);
        }
      });
      return objValue;
    }
  });
}
var PluginEsPhp = class {
  static getPluginCoreModules() {
    return {
      Builder,
      Token,
      Polyfill,
      ClassBuilder,
      Constant,
      Router,
      Sql,
      Transform,
      JSXTransform,
      JSXClassBuilder,
      Assets,
      Merge: merge
    };
  }
  constructor(compiler, options) {
    this.compiler = compiler;
    this.options = merge({}, defaultConfig, options);
    this.generatedCodeMaps = generatedCodeMaps;
    this.name = pkg.name;
    this.version = pkg.version;
    this.platform = "server";
    registerError(compiler.diagnostic.defineError, compiler.diagnostic.LANG_CN, compiler.diagnostic.LANG_EN);
    this._builders = /* @__PURE__ */ new Map();
    this.glob = new Glob2();
    this.addGlobRule();
  }
  addGlobRule() {
    const resolve = this.options.resolve;
    Object.keys(resolve.namespaces).forEach((key) => {
      this.glob.addRuleGroup(key, resolve.namespaces[key], "namespaces");
    });
    Object.keys(resolve.folders).forEach((key) => {
      this.glob.addRuleGroup(key, resolve.folders[key], "folders");
    });
    Object.keys(resolve.formats).forEach((key) => {
      this.glob.addRuleGroup(key, resolve.routes[key], "formats");
    });
    const trueCallback = () => true;
    if (Array.isArray(resolve.usings)) {
      resolve.usings.forEach((key) => {
        if (typeof key === "object") {
          if (key.test === void 0 || key.value === void 0) {
            throw new TypeError(`options.resolve.usings the each rule item should is {test:'rule', value:true} object`);
          } else {
            if (typeof key.value === "function") {
              this.glob.addRuleGroup(key.test, key.value, "usings");
            } else {
              this.glob.addRuleGroup(key.test, () => key.value, "usings");
            }
          }
        } else {
          this.glob.addRuleGroup(key, trueCallback, "usings");
        }
      });
    } else {
      Object.keys(resolve.usings).forEach((key) => {
        if (typeof resolve.usings[key] === "function") {
          this.glob.addRuleGroup(key, resolve.usings[key], "usings");
        } else {
          throw new TypeError(`options.resolve.usings the '${key}' rule, should assignmented a function`);
        }
      });
    }
  }
  resolveSourcePresetFlag(id2, group) {
    return !!this.glob.dest(id2, { group, failValue: false });
  }
  resolveSourceId(id2, group, delimiter2 = "/") {
    if (group === "namespaces" || group === "usings") {
      delimiter2 = "\\";
    }
    let data2 = { group, delimiter: delimiter2, failValue: null };
    if (typeof group === "object") {
      data2 = group;
    }
    return this.glob.dest(id2, data2);
  }
  getGeneratedCodeByFile(file) {
    return this.generatedCodeMaps.get(file);
  }
  getGeneratedSourceMapByFile(file) {
    return null;
  }
  getTokenNode(name2) {
    return modules.get(name2);
  }
  start(compilation, done) {
    const builder = this.getBuilder(compilation);
    builder.start(done);
    return builder;
  }
  build(compilation, done) {
    const builder = this.getBuilder(compilation);
    builder.build(done);
    return builder;
  }
  getBuilder(compilation, builderFactory = Builder) {
    let builder = this._builders.get(compilation);
    if (builder)
      return builder;
    builder = new builderFactory(compilation);
    builder.name = this.name;
    builder.platform = this.platform;
    builder.plugin = this;
    this._builders.set(compilation, builder);
    return builder;
  }
  toString() {
    return pkg.name;
  }
};
PluginEsPhp.toString = function toString() {
  return pkg.name;
};
module.exports = PluginEsPhp;
