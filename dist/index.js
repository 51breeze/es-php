var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
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
      withString(value) {
        if (!value)
          return;
        if (this.column === 0) {
          this.column = this.getStartColumn();
          this.code += "    ".repeat(this.indent);
        }
        this.code += value;
        this.column += value.length;
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
      withOperator(value) {
        this.withString(` ${value} `);
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
      constructor(target, ctx) {
        this.dataset = /* @__PURE__ */ new Map();
        this.refs = /* @__PURE__ */ new Map();
        this.target = target;
        this.ctx = ctx;
        this.cross = 0;
        this.last = null;
        this.indexName = null;
      }
      setName(desc2, name) {
        this.refs.set(desc2, name);
      }
      getName(desc2) {
        return this.refs.get(desc2);
      }
      hasName(desc2) {
        return this.refs.has(desc2);
      }
      getLastAssignedRef() {
        if (!this.hasCross() && this.last) {
          const name = this.getName(this.last.description());
          if (name) {
            return name;
          }
        }
        return null;
      }
      createName(description) {
        if (!description)
          return null;
        if (!this.refs.has(description)) {
          const name = this.ctx.getDeclareRefsName(description, AddressVariable.REFS_NAME);
          this.setName(description, name);
          return name;
        }
        return this.getName(description);
      }
      createIndexName(description) {
        if (!description || !description.isStack)
          return null;
        if (this.indexName === null) {
          const name = this.ctx.getDeclareRefsName(description, AddressVariable.REFS_INDEX);
          this.indexName = name;
        }
        return this.indexName;
      }
      add(value) {
        if (!value)
          return;
        if (this.last && this.last.scope !== value.scope) {
          if (this.last.description() !== value.description()) {
            this.cross++;
          }
        }
        const index = this.dataset.size;
        this.dataset.set(value, index);
        this.last = value;
        return index;
      }
      getIndex(value) {
        if (!this.dataset.has(value)) {
          this.add(value);
        }
        return this.dataset.get(value);
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
          properties.forEach((value) => {
            value.parent = object;
            object.properties.push(value);
          });
        }
        return object;
      }
      createArrayNode(elements, stack) {
        const object = this.createNode("ArrayExpression");
        object.stack = stack;
        object.elements = [];
        if (elements) {
          elements.forEach((value) => {
            value.parent = object;
            object.elements.push(value);
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
        const create = (items2, object, ctx) => {
          const member = ctx.createNode("MemberExpression");
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
          member.object.parent = ctx;
          member.property.parent = ctx;
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
      createCalleeNode(callee, args, stack) {
        const expression = this.createNode("CallExpression");
        expression.stack = stack;
        callee.parent = expression;
        expression.callee = callee;
        expression.arguments = [];
        if (args) {
          args.forEach((item) => {
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
      createDeclaratorNode(id, init, stack) {
        const obj = this.createNode("VariableDeclarator");
        obj.stack = stack;
        obj.id = id instanceof _Token ? id : obj.createIdentifierNode(id);
        obj.init = init;
        obj.id.parent = obj;
        if (init) {
          obj.init.parent = obj;
        }
        return obj;
      }
      createLiteralNode(value, raw, stack) {
        const node = this.createNode("Literal");
        node.stack = stack;
        node.value = value;
        if (raw === void 0) {
          if (typeof value === "string") {
            node.raw = `'${value}'`;
          } else {
            node.raw = String(value);
          }
        } else {
          node.raw = String(value);
        }
        return node;
      }
      createIdentifierNode(value, stack, isVariable = false) {
        const token = this.createNode("Identifier");
        token.stack = stack;
        token.value = value;
        token.raw = value;
        token.isVariable = isVariable;
        return token;
      }
      createClassRefsNode(module3, stack) {
        if (!module3 || !module3.isModule)
          return null;
        const name = this.getModuleReferenceName(module3);
        return this.createStaticMemberNode([
          this.createIdentifierNode(name),
          this.createIdentifierNode("class")
        ], stack);
      }
      createChunkNode(value, newLine = true, semicolon = false) {
        const node = this.createNode("ChunkExpression");
        node.newLine = newLine;
        node.semicolon = semicolon;
        node.value = value;
        node.raw = value;
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
      createNewNode(callee, args = []) {
        const node = this.createNode("NewExpression");
        node.callee = callee;
        node.arguments = args;
        callee.parent = node;
        args.forEach((item) => item.parent = node);
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
          let value = tokenValue || this.createToken(stack);
          if (assignName) {
            value = this.createAssignmentNode(this.createIdentifierNode(assignName, null, true), value);
          }
          return this.createCalleeNode(this.createIdentifierNode("is_array"), [value]);
        } else if (type.isAnyType || type.isUnionType || type.isIntersectionType || type.isLiteralObjectType) {
          const system = this.builder.getGlobalModuleById("System");
          this.addDepend(system);
          let value = tokenValue || this.createToken(stack);
          if (assignName) {
            value = this.createAssignmentNode(this.createIdentifierNode(assignName, null, true), value);
          }
          return this.createCalleeNode(this.createStaticMemberNode([
            this.createIdentifierNode(this.getModuleReferenceName(system)),
            this.createIdentifierNode("condition")
          ]), [value]);
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
      createArrayAddressRefsNode(desc2, name, nameNode) {
        if (!desc2)
          return;
        const assignAddress = desc2.isStack && desc2.assignItems && this.getAssignAddressRef(desc2);
        if (assignAddress) {
          const name2 = assignAddress.getName(desc2);
          const rd = assignAddress.createIndexName(desc2);
          if (rd) {
            return this.createMemberNode([
              this.createIdentifierNode(name2, null, true),
              this.createIdentifierNode(rd, null, true)
            ], null, true);
          }
        }
        return nameNode || this.createIdentifierNode(name, null, true);
      }
      addVariableRefs(desc2, refsName) {
        if (!desc2 || !desc2.isStack)
          return;
        const name = refsName || desc2.value();
        let funScope = this.scope;
        const check = (scope) => {
          if (!scope)
            return;
          if (!scope.declarations.has(name)) {
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
      addAssignAddressRef(desc2, value) {
        if (!desc2)
          return null;
        var address = assignAddressRef.get(desc2);
        if (!address) {
          address = new AddressVariable(desc2, this);
          assignAddressRef.set(desc2, address);
        }
        if (value) {
          address.add(value);
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
      checkRefsName(name, top = false, flags = _Token.SCOPE_REFS_DOWN | _Token.SCOPE_REFS_UP_FUN, context = null, initInvoke = null) {
        const ctx = context || this.getParentByType((parent) => {
          if (top) {
            return TOP_SCOPE.includes(parent.type);
          } else {
            return FUNCTION_SCOPE.includes(parent.type);
          }
        }, true);
        if (!ctx) {
          return name;
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
            check(name2, scope2) {
              if (this.result.has(name2))
                return true;
              if (flags === _Token.SCOPE_REFS_All) {
                return scope2.topDeclarations.has(name2);
              }
              if (scope2.isDefine(name2)) {
                return true;
              }
              var index2 = 0;
              var flag = 0;
              while (flag < (flags & _Token.SCOPE_REFS_All)) {
                flag = Math.pow(2, index2++);
                switch (flags & flag) {
                  case _Token.SCOPE_REFS_DOWN:
                    if (scope2.declarations.has(name2) || scope2.hasChildDeclared(name2))
                      return true;
                  case _Token.SCOPE_REFS_UP:
                    if (scope2.isDefine(name2))
                      return true;
                  case _Token.SCOPE_REFS_TOP:
                    if (scope2.isDefine(name2) || scope2.hasChildDeclared(name2))
                      return true;
                  case _Token.SCOPE_REFS_UP_FUN:
                    if (scope2.isDefine(name2, "function"))
                      return true;
                  case _Token.SCOPE_REFS_UP_CLASS:
                    if (scope2.isDefine(name2, "class"))
                      return true;
                }
              }
              return false;
            }
          });
        }
        const isTokenCtx = ctx instanceof _Token;
        var body = isTokenCtx ? ctx.beforeBody || ctx.body : null;
        var block = isTokenCtx ? ctx : null;
        if (body && body.type === "BlockStatement") {
          block = body;
          body = body.body;
        }
        if (dataset.check(name, scope)) {
          var index = 1;
          while (dataset.check(name + index, scope) && index++)
            ;
          var value = name + index;
          dataset.result.add(value);
          if (isTokenCtx) {
            const event = { name, value, top, context: ctx, scope, prevent: false };
            ctx.emit("onCreateRefsName", event);
            if (block && !event.prevent) {
              let init2 = null;
              if (initInvoke) {
                init2 = initInvoke(value, name);
              }
              if (init2) {
                body.push(block.createDeclarationNode("const", [
                  block.createDeclaratorNode(
                    block.createIdentifierNode(value),
                    init2
                  )
                ]));
              }
            }
          }
          return value;
        } else if (!top) {
          dataset.result.add(name);
          if (initInvoke && block) {
            var init = initInvoke(name, name);
            if (init) {
              body.push(block.createDeclarationNode("const", [
                block.createDeclaratorNode(
                  block.createIdentifierNode(name),
                  init
                )
              ]));
            }
          }
        }
        return name;
      }
      getDeclareRefsName(desc2, name, flags = _Token.SCOPE_REFS_DOWN | _Token.SCOPE_REFS_UP_FUN, initInvoke = null, context = null) {
        if (!desc2)
          return name;
        var cache = DECLARE_REFS.get(desc2);
        if (!cache)
          DECLARE_REFS.set(desc2, cache = {});
        if (Object.prototype.hasOwnProperty.call(cache, name)) {
          return cache[name];
        }
        return cache[name] = this.checkRefsName(name, false, flags, context, initInvoke);
      }
      getWasRefsName(desc2, name) {
        var cache = DECLARE_REFS.get(desc2);
        if (cache) {
          return cache[name];
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
      getAccessorName(name, desc2, accessor = "get") {
        const prefix = accessor;
        const suffix = name.substr(0, 1).toUpperCase() + name.substr(1);
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
          var value = key;
          while (true) {
            const has = isStatic ? module3.getMethod(value) : module3.getMember(value);
            if (!has)
              break;
            value = key + index++;
          }
          dataset[key] = value;
          return value;
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
    var path2 = require("path");
    var modules2 = /* @__PURE__ */ new Map();
    var dirname = true ? path2.join(__dirname, "polyfills") : path2.join(__dirname, "../", "polyfill");
    var parseModule = (modules3, file, name) => {
      const info = path2.parse(name);
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
      content = content.replace(/([\r\n\s]+)?\/\/\/[\s+]?<(references|namespaces|export|import|createClass)\s+(.*?)\/>\s+?/g, function(_, a, b, c) {
        const items = c.trim().replace(/[\s+]?=[\s+]?/g, "=").split(/\s+/g);
        const attr = {};
        items.forEach((item) => {
          const [key, value] = item.replace(/[\'\"]/g, "").trim().split("=");
          attr[key] = value;
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
              const name2 = attr["to"] || attr["name"];
              requires.set(name2, { key: name2, value: name2, from: attr["from"], extract: !!attr["extract"] });
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
      var id = namespace ? `${namespace}.${info.name}` : info.name;
      modules3.set(id, {
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
        const filepath = path2.join(dirname2, filename);
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
      addItem(file, className, action, path2, method, params) {
        while (path2.charCodeAt(0) === 47) {
          path2 = path2.substring(1);
        }
        const item = { className, action, path: path2, method, params };
        const cacheKey = [path2].concat((params || []).map((item2) => item2.name)).join("-");
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
        const publicPath = (this.context.plugin.options.resolve.publicPath || "").trim();
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
        let file = this.format.replace(/\[(\w+)\]/g, (_, name) => {
          return data2[name] || "";
        });
        file = PATH.join(folder, file);
        return this.assetOutputFile = this.context.compiler.normalizePath(PATH.isAbsolute(file) ? PATH.relative(this.context.getOutputPath(), file) : file);
      }
      getFilename() {
        if (this.filename)
          return this.filename;
        let name = this.module ? this.module.id : "";
        if (PATH.isAbsolute(this.file)) {
          name = PATH.basename(this.file, PATH.extname(this.file));
        } else {
          name = PATH.extname(this.file).slice(1);
        }
        return this.filename = String(name).toLowerCase();
      }
      getHash() {
        if (this.hash)
          return this.hash;
        return this.hash = crypto.createHash("md5").update(this.file).digest("hex").substring(0, 8);
      }
      getFolder() {
        if (this.folder)
          return this.folder;
        const mapping = this.context.plugin.options.resolve.mapping.folder;
        return this.folder = this.context.resolveSourceFileMappingPath(this.file, mapping, "asset") || PATH.dirname(this.file);
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
      setContext(ctx) {
        this.context = ctx;
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
    var hasOwn = Object.prototype.hasOwnProperty;
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
      addSqlTableNode(id, node, stack) {
        sqlInstance.addTable(id, node, stack);
      }
      hasSqlTableNode(id) {
        return sqlInstance.has(id);
      }
      getRouterInstance() {
        return routerInstance;
      }
      addFileAndNamespaceMapping(file, namespace) {
        if (namespace && file) {
          fileAndNamespaceMappingCached.set(file, namespace);
        }
      }
      addRouterConfig(module3, method, path2, action, params) {
        const outputFolder = this.getModuleMappingFolder(module3, "router");
        if (!outputFolder)
          return;
        const className = this.getModuleNamespace(module3, module3.id, false);
        this.getRouterInstance().addItem(PATH.join(this.getOutputPath(), outputFolder), className, action, path2, method, params);
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
          this.resolveSourceFileMappingPath();
          fileAndNamespaceMappingCached.forEach((ns, file2) => {
            items.push(`'${ns}'=>'${file2}'`);
          });
          this.emitFile(file, `return [\r
	${items.join(",\r\n	")}\r
];`);
        }
      }
      emitSql() {
        const root = this.plugin.options.resolve.mapping.folder.root || "";
        const file = PATH.isAbsolute(root) ? root : PATH.join(this.getOutputPath(), root, "app.sql");
        this.emitFile(file, sqlInstance.toString());
      }
      getOutputPath() {
        const value = this.__outputPath;
        if (value)
          return value;
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
          const name = item.name.toLowerCase();
          if (!["runtime", "syntax", "env", "version"].includes(name)) {
            return true;
          }
          const args = item.getArguments();
          const indexes = name === "version" ? [, , , "expect"] : name === "env" ? [, , "expect"] : [, "expect"];
          const _expect = this.getAnnotationArgument("expect", args, indexes, true);
          const value = args[0].value;
          const expect = _expect ? String(_expect.value).trim() !== "false" : true;
          switch (name) {
            case "runtime":
              return this.isRuntime(value) === expect;
            case "syntax":
              return this.isSyntax(value) === expect;
            case "env": {
              const name2 = this.getAnnotationArgument("name", args, ["name", "value"], true);
              const value2 = this.getAnnotationArgument("value", args, ["name", "value"], true);
              if (value2 && name2) {
                return this.isEnv(name2.value, value2.value) === expect;
              } else {
                item.error(`Missing name or value arguments. the '${item.name}' annotations.`);
              }
            }
            case "version": {
              const name2 = this.getAnnotationArgument("name", args, ["name", "version", "operator"], true);
              const version = this.getAnnotationArgument("version", args, ["name", "version", "operator"], true);
              const operator = this.getAnnotationArgument("operator", args, ["name", "version", "operator"], true);
              if (name2 && version) {
                return this.isVersion(name2.value, version.value, operator ? operator.value : "elt") === expect;
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
      getAnnotationArgument(name, args = [], indexes = [], lowerFlag = false) {
        let index = args.findIndex((item) => lowerFlag ? String(item.key).toLowerCase() === name : item.key === name);
        if (index < 0) {
          index = indexes.indexOf(name);
          if (index >= 0) {
            const arg = args[index];
            return arg && !arg.assigned ? arg : null;
          }
        }
        return args[index] || null;
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
      getModuleById(id, flag = false) {
        return this.compilation.getModuleById(id, flag);
      }
      getGlobalModuleById(id) {
        return this.compilation.getGlobalTypeById(id);
      }
      isRuntime(name) {
        const metadata = this.plugin.options.metadata || {};
        switch (name.toLowerCase()) {
          case "client":
            return (metadata.platform || this.platform) === "client";
          case "server":
            return (metadata.platform || this.platform) === "server";
        }
        return false;
      }
      isSyntax(name) {
        return name && name.toLowerCase() === this.name;
      }
      isEnv(name, value) {
        const metadata = this.plugin.options.metadata;
        const env = metadata.env || {};
        if (value !== void 0) {
          if (name.toLowerCase() === "mode") {
            if (this.plugin.options.mode === value || env.NODE_ENV === value) {
              return true;
            }
          }
          return env[name] === value;
        }
        return false;
      }
      isVersion(name, version, operator = "elt", flag = false) {
        const metadata = this.plugin.options.metadata;
        const right = String(metadata[name] || "0.0.0").trim();
        const left = String(version || "0.0.0").trim();
        const rule = /^\d+\.\d+\.\d+$/;
        if (!rule.test(left) || !rule.test(right)) {
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
        const folder = isStr ? this.getSourceFileMappingFolder(module3, compilation) : this.getModuleMappingFolder(module3);
        if (!isStr && module3 && module3.isModule) {
          if (module3.isDeclaratorModule) {
            const polyfillModule = Polyfill2.modules.get(module3.getName());
            const filename = module3.id + suffix;
            if (polyfillModule) {
              return this.compiler.normalizePath(PATH.join(output, (folder || polyfillModule.namespace || config.ns).replace(/\./g, "/"), filename));
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
      recursionModule(module3, callback, imps = false) {
        var current = module3;
        while (current && current.isModule) {
          let res = callback(current);
          if (res !== false) {
            return res;
          }
          if (imps) {
            for (var i = 0; i < module3.implements.length; i++) {
              let res2 = this.recursionModule(module3.implements[i], callback, true);
              if (res2 !== false) {
                return res2;
              }
            }
          }
          current = current.inherit;
        }
        return false;
      }
      findDefineAnnotationForType(annotations) {
        if (!annotations)
          return null;
        const annotation = annotations.find((annotation2) => {
          if (annotation2.name.toLowerCase() === "define") {
            const args = annotation2.getArguments();
            if (args[0]) {
              return String(args[0].key).toLowerCase() === "type" && args[0].value;
            }
          }
          return false;
        });
        if (annotation) {
          const args = annotation.getArguments();
          const resolveType = args[0].value;
          if (resolveType) {
            return resolveType.toLowerCase();
          }
        }
        return null;
      }
      resolveModuleType(module3) {
        if (resolveModuleTypeCached.has(module3)) {
          return resolveModuleTypeCached.get(module3);
        }
        const resolve = !module3.isModule && module3.stack ? this.findDefineAnnotationForType(module3.stack.annotations) : this.recursionModule(module3, (current) => {
          const stack = this.compilation.getStackByModule(current);
          if (stack) {
            const annotation = this.findDefineAnnotationForType(stack.annotations);
            if (annotation) {
              return annotation;
            }
          }
          return false;
        }, true);
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
      checkResolveRuleMatch(rule, relative, type, fileExt, fileName, delimiter = "/") {
        let test = rule.test;
        if (test.charCodeAt(0) === 46) {
          test = test.substring(1);
        }
        if (test.charCodeAt(0) === 47) {
          test = test.substring(1);
        }
        if (type) {
          let match = "::" + type;
          let len = match.length;
          if (test.slice(-len) !== match)
            return false;
          test = test.slice(0, -len);
        }
        if (fileExt) {
          let suffixPos = test.lastIndexOf(".");
          if (suffixPos > 0) {
            const ruleSuffix = test.slice(suffixPos);
            if (ruleSuffix !== ".*" && test.slice(suffixPos) !== fileExt)
              return false;
            test = test.slice(0, suffixPos);
          } else {
            if (test.slice(-1) !== "*")
              return false;
            test = test.slice(0, -1);
          }
        }
        if (fileName) {
          let filenamePos = test.lastIndexOf("/");
          if (test.slice(filenamePos + 1) === fileName) {
            test = filenamePos >= 0 ? test.slice(0, filenamePos) : "";
          } else {
            let token = test.slice(-1);
            if (!(token === "*"))
              return false;
            test = test.slice(0, -1);
          }
          if (test.charCodeAt(test.length - 1) === 47) {
            test = test.slice(0, -1);
          }
        }
        if (!relative && !test) {
          return [[], []];
        }
        const segments = test.split("/");
        const parts = relative.split(delimiter);
        let rest = false;
        const flag = segments.every((seg, index) => {
          if (!seg && !test)
            return true;
          if (seg.includes("**")) {
            rest = true;
            return true;
          }
          return seg === "*" || parts[index] === seg;
        });
        const count = rest ? segments.length - 1 : segments.length;
        if (count > parts.length)
          return false;
        if (flag) {
          if (rest) {
            return [segments, parts];
          } else if (segments.length === parts.length) {
            return [segments, parts];
          }
        }
        return false;
      }
      getSourceFileMappingFolder(file, compilation) {
        if (this.plugin.options.assets.test(file)) {
          return this.resolveSourceFileMappingPath(file, this.plugin.options.resolve.mapping.folder, "asset");
        } else {
          var type = "general";
          if (compilation && file === compilation.file && compilation.stack) {
            const annotation = this.findDefineAnnotationForType(compilation.stack.annotations);
            if (annotation) {
              type = annotation;
            }
          }
          return this.resolveSourceFileMappingPath(file, this.plugin.options.resolve.mapping.folder, type);
        }
      }
      getModuleMappingFolder(module3, typeName = null) {
        if (module3 && module3.isModule) {
          typeName = typeName || this.resolveModuleTypeName(module3);
          let file = module3.compilation.file;
          if (module3.isDeclaratorModule) {
            let ns = module3.namespace.parent ? module3.namespace : null;
            if ((!typeName || typeName === "*") && !ns) {
              typeName = "global";
            }
            if (ns) {
              file = module3.namespace.getChain().join("/") + module3.id + PATH.extname(file);
            } else {
              file = module3.id + PATH.extname(file);
            }
          }
          return this.resolveSourceFileMappingPath(file, this.plugin.options.resolve.mapping.folder, typeName);
        }
        return null;
      }
      getModuleMappingNamespace(module3) {
        if (!module3 || !module3.isModule)
          return null;
        var ns = module3.id;
        var assignment = null;
        if (module3.isDeclaratorModule) {
          const polyfill = this.getPolyfillModule(module3.getName());
          if (polyfill) {
            assignment = polyfill.namespace || this.plugin.options.ns;
            ns = [assignment, polyfill.export || module3.id].join(".");
          } else {
            ns = module3.getName();
          }
        } else {
          ns = module3.getName();
        }
        if (ns) {
          const result = this.geMappingNamespace(ns, module3);
          if (result)
            return result;
        }
        if (this.plugin.options.resolve.useFolderAsNamespace) {
          const folder = this.getModuleMappingFolder(module3);
          if (folder) {
            return folder.replace(/[\.\\\\/]/g, "\\");
          }
        }
        if (assignment) {
          return assignment.replace(/\./g, "\\");
        }
        return null;
      }
      geMappingNamespace(ns, module3) {
        const namespace = this.plugin.options.resolve.mapping.namespace;
        if (!namespace.explicit) {
          for (let rule of namespace.rules) {
            if (rule.vague > 0 || rule.dynamic) {
              const result = this.checkResolveRuleMatch(rule, ns, null, null, null, ".");
              if (result) {
                if (!rule.dynamic)
                  return rule.value;
                const [segments, parts] = result;
                const restMatchPos = segments.findIndex((seg) => seg.includes("**"));
                parts.pop();
                return rule.segments.map((item) => {
                  if (item.includes("%")) {
                    return item.split("%").slice(1).map((key) => {
                      if (key.includes("...") && restMatchPos >= 0) {
                        const range = restMatchPos === segments.length - 1 ? parts.slice(restMatchPos, parts.length) : parts.slice(restMatchPos, parts.length - (segments.length - restMatchPos));
                        let startIndex = 0;
                        let endIndex = range.length;
                        if (key !== "...") {
                          let [start, end] = key.split("...").map((val) => parseInt(val));
                          if (start > 0)
                            startIndex = start;
                          if (end > 0)
                            endIndex = end;
                        }
                        return range.slice(startIndex, endIndex).join("\\");
                      }
                      return parts[key] || null;
                    }).filter((item2) => !!item2).join("");
                  }
                  return item;
                }).filter((item) => !!item).join("\\");
              }
            } else if (rule.raw === ns) {
              return rule.value;
            }
          }
        } else if (hasOwn.call(namespace.map, ns)) {
          return namespace.map[ns].value;
        }
        return null;
      }
      getModuleMappingRoute(module3, data2 = {}) {
        if (module3 && module3.isModule && !module3.isDeclaratorModule) {
          if (this.resolveModuleType(module3) !== _Builder.MODULE_TYPE_CONTROLLER)
            return null;
          return this.resolveSourceFileMappingPath(module3.compilation.file, this.plugin.options.resolve.mapping.route, "controller", "/", data2);
        }
        return null;
      }
      resolveSourceFileMappingPath(file, mapping, type, delimiter = "/", dataset = {}) {
        if (!mapping || !file)
          return null;
        const rules = mapping.rules;
        if (!rules.length)
          return null;
        const isAbsolute = PATH.isAbsolute(file);
        const fileInfo = PATH.parse(file);
        const workspace = this.compiler.options.workspace;
        file = isAbsolute ? PATH.relative(workspace, fileInfo.dir) : file;
        const relative = this.compiler.normalizePath(file.replace(/^[\.\\\/]+/, ""));
        for (let rule of rules) {
          const result = this.checkResolveRuleMatch(rule, relative, type, fileInfo.ext, fileInfo.name);
          if (result) {
            const value = rule.value;
            if (!rule.dynamic)
              return value;
            const [segments, parts] = result;
            const restMatchPos = segments.findIndex((seg) => seg.includes("**"));
            return rule.segments.map((item) => {
              if (item.includes("%")) {
                return item.split("%").slice(1).map((key) => {
                  if (key.includes("...") && restMatchPos >= 0) {
                    const range = restMatchPos === segments.length - 1 ? parts.slice(restMatchPos, parts.length) : parts.slice(restMatchPos, parts.length - (segments.length - restMatchPos));
                    let startIndex = 0;
                    let endIndex = range.length;
                    if (key !== "...") {
                      let [start, end] = key.split("...", 2).map((val) => parseInt(val));
                      if (start > 0)
                        startIndex = start;
                      if (end > 0)
                        endIndex = end;
                    }
                    return range.slice(startIndex, endIndex).join(delimiter);
                  } else if (key === "filename") {
                    return fileInfo.name;
                  } else if (key === "ext") {
                    return fileInfo.ext;
                  } else if (key === "classname" || key === "method") {
                    return dataset[key] || null;
                  }
                  return parts[key] || null;
                }).filter((item2) => !!item2).join("");
              }
              return item;
            }).filter((item) => !!item).join(delimiter);
          }
        }
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
      getPolyfillModule(id) {
        return Polyfill2.modules.get(id);
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
      isReferenceDeclaratorModule(depModule, ctxModule) {
        if (depModule && depModule.isDeclaratorModule) {
          if (depModule.isStructTable) {
            return false;
          }
          const disuse = this.plugin.options.resolve.disuse;
          if (this.checkModulePresetState(depModule, disuse)) {
            return false;
          }
          const using = this.plugin.options.resolve.using;
          if (this.checkModulePresetState(depModule, using)) {
            return true;
          }
        }
        return false;
      }
      checkModulePresetState(module3, setting) {
        if (!setting.explicit) {
          for (let rule of setting.rules) {
            if (rule.vague > 0) {
              const result = this.checkResolveRuleMatch(rule, module3.getName(), null, null, null, ".");
              if (result) {
                return true;
              }
            } else if (rule.raw === module3.getName()) {
              return true;
            }
          }
        } else if (hasOwn.call(setting.map, module3.getName())) {
          return true;
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
        (this.compilation.imports || []).forEach(add);
        (this.compilation.externals || []).forEach(add);
        this.crateAssetItems(null, dataset, assets, externals, this.compilation);
        return Array.from(dataset.values());
      }
      crateAssetItems(module3, dataset, assets, externals, context) {
        assets.forEach((asset) => {
          if (asset.file) {
            const external = externals && asset.file ? externals.find((name) => asset.file.indexOf(name) === 0) : null;
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
            const external = externals && item.from ? externals.find((name) => item.from.indexOf(name) === 0) : null;
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
        const excludes = this.plugin.options.resolve.excludes;
        if (excludes && excludes.length > 0) {
          const isModule = typeof source !== "string" && source.isModule ? true : false;
          source = String(isModule ? source.getName() : source);
          if (excludes.some((rule) => rule instanceof RegExp ? rule.test(source) : source === rule)) {
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
        return this._globalModules = ["Array", "Object", "Boolean", "Math", "Number", "String", "Console"].map((name) => {
          return this.compilation.getGlobalTypeById(name);
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
      static createClassNode(stack, ctx, type) {
        const obj = new ClassBuilder2(stack, ctx, type);
        return obj.create();
      }
      constructor(stack, ctx, type) {
        super(type || stack.toString());
        this.stack = stack;
        this.scope = stack.scope;
        this.compilation = stack.compilation;
        this.compiler = stack.compiler;
        this.module = stack.module;
        this.plugin = ctx.plugin;
        this.name = ctx.name;
        this.platform = ctx.platform;
        this.parent = ctx;
        this.builder = ctx.builder;
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
            const args = syntaxAnnotation.getArguments();
            if (args[0]) {
              if (this.builder.isSyntax(args[0].value)) {
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
            const name = child.key.value;
            const dataset = isStatic ? cache1 : cache2;
            var target = dataset.get(name);
            if (!target) {
              target = {
                isAccessor: true,
                kind: "accessor",
                key: child.key,
                modifier: child.modifier
              };
              dataset.set(name, target);
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
            const args = annotation.getArguments();
            const action = memeberStack.key.value();
            const params = memeberStack.params.map((item) => {
              const required = !(item.question || item.isAssignmentPattern);
              return { name: item.value(), required };
            });
            let method = annotation.name.toLowerCase();
            let path2 = action;
            if (method === "router") {
              method = args[0] && args[0].value ? args[0].value : "get";
              if (args[1] && args[1].value) {
                path2 = args[1].value.trim();
              }
            } else if (args[0] && args[0].value) {
              path2 = args[0].value.trim();
            }
            if (path2.charCodeAt(0) === 64) {
              this.builder.addRouterConfig(this.module, method, path2, action, []);
            } else if (path2.charCodeAt(0) === 47) {
              this.builder.addRouterConfig(this.module, method, path2, action, params);
            } else {
              const prefix = this.builder.getModuleMappingRoute(this.module, { method: action, classname: this.module.id }) || this.module.getName("/");
              this.builder.addRouterConfig(this.module, method, prefix + "/" + path2, action, params);
            }
          } else if (this.builder.resolveModuleTypeName(this.module) === "controller") {
            const method = "any";
            const action = memeberStack.key.value();
            const prefix = this.builder.getModuleMappingRoute(this.module, { method: action, classname: this.module.id }) || this.module.getName("/");
            const params = memeberStack.params.map((item) => {
              const required = !(item.question || item.isAssignmentPattern);
              return { name: item.value(), required };
            });
            this.builder.addRouterConfig(this.module, method, prefix + "/" + action, action, params);
          }
        }
        return node;
      }
      createDefaultConstructMethod(methodName, initProperties, params = []) {
        const inherit = this.inherit;
        const node = this.createMethodNode(methodName ? this.createIdentifierNode(methodName) : null, (ctx) => {
          if (inherit) {
            const se = ctx.createNode("SuperExpression");
            se.value = "parent";
            ctx.body.push(
              ctx.createStatementNode(
                ctx.createCalleeNode(
                  ctx.createStaticMemberNode([se, ctx.createIdentifierNode("__construct")]),
                  params
                )
              )
            );
          }
          if (initProperties && initProperties.length) {
            initProperties.forEach((item) => {
              ctx.body.push(item);
            });
          }
        }, params);
        node.type = "FunctionDeclaration";
        return node;
      }
      createStatementMember(name, members) {
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
        const useFolderAsNamespace = this.plugin.options.resolve.useFolderAsNamespace;
        const usingExcludes = this.builder.getGlobalModules();
        const createUse = (depModule) => {
          if (!usingExcludes.includes(depModule)) {
            const name = this.builder.getModuleNamespace(depModule, depModule.id);
            if (name) {
              let local = name;
              let imported = void 0;
              if (module3.importAlias && module3.importAlias.has(depModule)) {
                imported = name;
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
              } else if (!(consistent || useFolderAsNamespace)) {
                const source = this.builder.getFileRelativeOutputPath(depModule);
                const name = this.builder.getModuleNamespace(depModule, depModule.id);
                this.builder.addFileAndNamespaceMapping(source, name);
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
              const name = item.key;
              const source = item.from;
              if (importFlag && !this.builder.isImportExclude(source)) {
                this.imports.push(this.createImportDeclaration(source));
              }
              if (!usingExcludes.includes(module3)) {
                const ns = this.builder.getModuleNamespace(module3, polyfillModule.export);
                if (ns) {
                  if (name !== item.value) {
                    this.using.push(this.createUsingStatementNode(
                      this.createImportSpecifierNode(name, ns)
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
    function createMethodFunctionNode(ctx, name) {
      return ctx.createLiteralNode(name);
    }
    function createCommonCalledNode(name, ctx, object, args, called) {
      if (!called)
        return createMethodFunctionNode(ctx, name);
      return ctx.createCalleeNode(
        ctx.createIdentifierNode(name),
        object ? [object].concat(args) : args
      );
    }
    module2.exports = {
      assign(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("Object");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_object_assign");
        if (!called)
          return createMethodFunctionNode(ctx, name);
        return ctx.createCalleeNode(
          ctx.createIdentifierNode(name),
          args
        );
      },
      keys(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("Object");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_object_keys");
        if (!called)
          return createMethodFunctionNode(ctx, name);
        return ctx.createCalleeNode(
          ctx.createIdentifierNode(name),
          args
        );
      },
      values(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("Object");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_object_values");
        if (!called)
          return createMethodFunctionNode(ctx, name);
        return ctx.createCalleeNode(
          ctx.createIdentifierNode(name),
          args
        );
      },
      propertyIsEnumerable(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("Object");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_object_property_is_enumerable");
        return createCommonCalledNode(name, ctx, object, args, called);
      },
      hasOwnProperty(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("Object");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_object_has_own_property");
        return createCommonCalledNode(name, ctx, object, args, called);
      },
      valueOf(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("Object");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_object_value_of");
        return createCommonCalledNode(name, ctx, object, args, called);
      },
      toLocaleString(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("Object");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_object_to_string");
        return createCommonCalledNode(name, ctx, object, args, called);
      },
      toString(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("Object");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_object_to_string");
        return createCommonCalledNode(name, ctx, object, args, called);
      }
    };
  }
});

// transforms/Array.js
var require_Array = __commonJS({
  "transforms/Array.js"(exports2, module2) {
    var ObjectMethod = require_Object();
    var Token2 = require_Token();
    function createMethodFunctionNode(ctx, name) {
      return ctx.createLiteralNode(name);
    }
    function createObjectNodeRefs(ctx, object, name) {
      return object;
    }
    function createCommonCalledNode(name, ctx, object, args, called = true) {
      if (!called)
        return createMethodFunctionNode(ctx, name);
      const obj = createObjectNodeRefs(ctx, object, name);
      return ctx.createCalleeNode(
        ctx.createIdentifierNode(name),
        [obj].concat(args).filter((v) => !!v)
      );
    }
    var methods = {
      isArray(ctx, object, args, called = false, isStatic = false) {
        return ctx.createCalleeNode(
          ctx.createIdentifierNode("is_array"),
          args
        );
      },
      from(ctx, object, args, called = false, isStatic = false) {
        ctx.addDepend(ctx.builder.getGlobalModuleById("System"));
        return ctx.createCalleeNode(
          ctx.createStaticMemberNode([
            ctx.createIdentifierNode("System"),
            ctx.createIdentifierNode("toArray")
          ]),
          args
        );
      },
      of(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("Array");
        ctx.addDepend(module3);
        return ctx.createCalleeNode(
          ctx.createIdentifierNode(ctx.builder.getModuleNamespace(module3, "es_array_new")),
          args
        );
      },
      push(ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode("array_push", ctx, object, args, called);
      },
      unshift(ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode("array_unshift", ctx, object, args, called);
      },
      pop(ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode("array_pop", ctx, object, args, called);
      },
      shift(ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode("array_shift", ctx, object, args, called);
      },
      splice(ctx, object, args, called = false, isStatic = false) {
        if (args.length > 3) {
          args = args.slice(0, 2).concat(ctx.createArrayNode(args.slice(2)));
        }
        return createCommonCalledNode("array_splice", ctx, object, args, called);
      },
      slice(ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode("array_slice", ctx, object, args, called);
      },
      map(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("Array");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_array_map");
        return createCommonCalledNode(name, ctx, object, args, called);
      },
      find(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("Array");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_array_find");
        return createCommonCalledNode(name, ctx, object, args, called);
      },
      findIndex(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("Array");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_array_find_index");
        return createCommonCalledNode(name, ctx, object, args, called);
      },
      filter(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("Array");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_array_filter");
        return createCommonCalledNode(name, ctx, object, args, called);
      },
      indexOf(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("Array");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_array_find_index");
        return createCommonCalledNode(name, ctx, object, args, called);
      },
      lastIndexOf(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("Array");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_array_search_last_index");
        return createCommonCalledNode(name, ctx, object, args, called);
      },
      copyWithin(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("Array");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_array_copy_within");
        return createCommonCalledNode(name, ctx, object, args, called);
      },
      concat(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("Array");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_array_concat");
        return createCommonCalledNode(name, ctx, object, args, called);
      },
      every(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("Array");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_array_every");
        return createCommonCalledNode(name, ctx, object, args, called);
      },
      some(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("Array");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_array_some");
        return createCommonCalledNode(name, ctx, object, args, called);
      },
      forEach(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("Array");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_array_foreach");
        return createCommonCalledNode(name, ctx, object, args, called);
      },
      flat(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("Array");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_array_flat");
        return createCommonCalledNode(name, ctx, object, args, called);
      },
      flatMap(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("Array");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_array_flat_map");
        return createCommonCalledNode(name, ctx, object, args, called);
      },
      reduce(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("Array");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_array_reduce");
        return createCommonCalledNode(name, ctx, object, args, called);
      },
      reduceRight(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("Array");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_array_reduce_right");
        return createCommonCalledNode(name, ctx, object, args, called);
      },
      fill(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("Array");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_array_fill");
        return createCommonCalledNode(name, ctx, object, args, called);
      },
      sort(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("Array");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_array_sort");
        return createCommonCalledNode(name, ctx, object, args, called);
      },
      join(ctx, object, args, called = false, isStatic = false) {
        if (!called)
          return ctx.createChunkNode(`function($target,$delimiter){return implode($delimiter,$target);}`);
        object = createObjectNodeRefs(ctx, object, "implode");
        return ctx.createCalleeNode(
          ctx.createIdentifierNode("implode"),
          args.concat(object)
        );
      },
      entries(ctx, object, args, called = false, isStatic = false) {
        if (!called)
          return createMethodFunctionNode(ctx, "array_values");
        object = createObjectNodeRefs(ctx, object, "array_values");
        return ctx.createCalleeNode(
          ctx.createIdentifierNode("array_values"),
          [object]
        );
      },
      values(ctx, object, args, called = false, isStatic = false) {
        if (!called)
          return createMethodFunctionNode(ctx, "array_values");
        object = createObjectNodeRefs(ctx, object, "array_values");
        return ctx.createCalleeNode(
          ctx.createIdentifierNode("array_values"),
          [object]
        );
      },
      keys(ctx, object, args, called = false, isStatic = false) {
        if (!called)
          return createMethodFunctionNode(ctx, "array_keys");
        object = createObjectNodeRefs(ctx, object, "array_keys");
        return ctx.createCalleeNode(
          ctx.createIdentifierNode("array_keys"),
          [object]
        );
      },
      reverse(ctx, object, args, called = false, isStatic = false) {
        if (!called)
          return createMethodFunctionNode(ctx, "array_reverse");
        object = createObjectNodeRefs(ctx, object, "array_reverse");
        return ctx.createCalleeNode(
          ctx.createIdentifierNode("array_reverse"),
          args.concat(object)
        );
      },
      includes(ctx, object, args, called = false, isStatic = false) {
        if (!called)
          return createMethodFunctionNode(ctx, "in_array");
        object = createObjectNodeRefs(ctx, object, "in_array");
        return ctx.createCalleeNode(
          ctx.createIdentifierNode("in_array"),
          args.concat(object)
        );
      },
      length(ctx, object, args, called = false, isStatic = false) {
        const obj = createObjectNodeRefs(ctx, object, "count");
        return ctx.createCalleeNode(
          ctx.createIdentifierNode("count"),
          [obj]
        );
      }
    };
    ["propertyIsEnumerable", "hasOwnProperty", "valueOf", "toLocaleString", "toString"].forEach((name) => {
      if (!Object.prototype.hasOwnProperty.call(methods, name)) {
        methods[name] = ObjectMethod[name];
      }
    });
    module2.exports = methods;
  }
});

// transforms/Base64.js
var require_Base64 = __commonJS({
  "transforms/Base64.js"(exports2, module2) {
    module2.exports = {
      decode(ctx, object, args, called = false, isStatic = false) {
        if (!called) {
          return ctx.createChunkNode(`function($value){return base64_decode( $value );}`);
        }
        return ctx.createCalleeNode(
          ctx.createIdentifierNode("base64_decode"),
          args
        );
      },
      encode(ctx, object, args, called = false, isStatic = false) {
        if (!called) {
          return ctx.createChunkNode(`function($value){return base64_encode( $value );}`);
        }
        return ctx.createCalleeNode(
          ctx.createIdentifierNode("base64_encode"),
          args
        );
      }
    };
  }
});

// transforms/Console.js
var require_Console = __commonJS({
  "transforms/Console.js"(exports2, module2) {
    module2.exports = {
      log(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("System");
        ctx.addDepend(module3);
        if (!called) {
          return ctx.createChunkNode(`function(...$args){System::print(...$args);}`);
        }
        return ctx.createCalleeNode(
          ctx.createStaticMemberNode([
            ctx.createIdentifierNode("System"),
            ctx.createIdentifierNode("print")
          ]),
          args
        );
      },
      trace(ctx, object, args, called = false, isStatic = false) {
        return this.log(ctx, object, args, called, isStatic);
      }
    };
  }
});

// transforms/Number.js
var require_Number = __commonJS({
  "transforms/Number.js"(exports2, module2) {
    var ObjectMethod = require_Object();
    function createCommonCalledNode(name, ctx, object, args, called = true) {
      if (!called) {
        return ctx.createLiteralNode(name.replace(/\\/g, "\\\\"));
      }
      return ctx.createCalleeNode(
        ctx.createIdentifierNode(name),
        [object].concat(args)
      );
    }
    var methods = {
      MAX_VALUE(ctx) {
        return ctx.createLiteralNode(`1.79E+308`, `1.79E+308`);
      },
      MIN_VALUE(ctx) {
        return ctx.createLiteralNode(`5e-324`, `5e-324`);
      },
      MAX_SAFE_INTEGER(ctx) {
        return ctx.createLiteralNode(`9007199254740991`, `9007199254740991`);
      },
      POSITIVE_INFINITY(ctx) {
        return ctx.createIdentifierNode(`Infinity`);
      },
      EPSILON(ctx) {
        return ctx.createLiteralNode(`2.220446049250313e-16`, `2.220446049250313e-16`);
      },
      isFinite(ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode("is_finite", ctx, object, args, called);
      },
      isNaN(ctx, object, args, called = false, isStatic = false) {
        ctx.addDepend(ctx.builder.getGlobalModuleById("System"));
        if (!called) {
          ctx.createChunkNode(`function($target){return System::isNaN($target);}`);
        }
        return ctx.createCalleeNode(
          ctx.createStaticMemberNode([
            ctx.createIdentifierNode("System"),
            ctx.createIdentifierNode("isNaN")
          ]),
          [object].concat(args)
        );
      },
      isInteger(ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode("is_int", ctx, object, args, called);
      },
      isSafeInteger(ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode("is_int", ctx, object, args, called);
      },
      parseFloat(ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode("floatval", ctx, object, args, called);
      },
      parseInt(ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode("intval", ctx, object, args, called);
      },
      toFixed(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("Number");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_number_to_fixed");
        return createCommonCalledNode(name, ctx, object, args, called);
      },
      toExponential(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("Number");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_number_to_exponential");
        return createCommonCalledNode(name, ctx, object, args, called);
      },
      toPrecision(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("Number");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_number_to_precision");
        return createCommonCalledNode(name, ctx, object, args, called);
      },
      valueOf(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("Number");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_number_value_of");
        return createCommonCalledNode(name, ctx, object, args, called);
      }
    };
    ["propertyIsEnumerable", "hasOwnProperty", "toLocaleString", "toString"].forEach((name) => {
      if (!Object.prototype.hasOwnProperty.call(methods, name)) {
        methods[name] = ObjectMethod[name];
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
      message(ctx, object, args, called = false, isStatic = false) {
        return ctx.createCalleeNode(
          ctx.createMemberNode([
            object,
            ctx.createIdentifierNode("getMessage")
          ])
        );
      },
      cause(ctx, object, args, called = false, isStatic = false) {
        return ctx.createCalleeNode(
          ctx.createMemberNode([
            object,
            ctx.createIdentifierNode("getPrevious")
          ])
        );
      },
      name(ctx, object, args, called = false, isStatic = false) {
        return ctx.createCalleeNode(
          ctx.createIdentifierNode("get_class"),
          [
            object
          ]
        );
      },
      toString(ctx, object, args, called = false, isStatic = false) {
        if (!called) {
          const Reflect2 = ctx.builder.getGlobalModuleById("Reflect");
          ctx.addDepend(Reflect2);
          return ctx.createCalleeNode(
            ctx.createStaticMemberNode(
              [
                ctx.createIdentifierNode(
                  ctx.getModuleReferenceName(Reflect2)
                ),
                ctx.createIdentifierNode("get")
              ]
            ),
            [
              ctx.createLiteralNode(null),
              object,
              ctx.createIdentifierNode("__toString")
            ]
          );
        }
        return ctx.createCalleeNode(
          ctx.createMemberNode([
            object,
            ctx.createIdentifierNode("__toString")
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
    function createCallNode(ctx, target, args) {
      ctx.addDepend(ctx.builder.getGlobalModuleById("Reflect"));
      return ctx.createCalleeNode(
        ctx.createStaticMemberNode([
          ctx.createIdentifierNode("Reflect"),
          ctx.createIdentifierNode("apply")
        ]),
        [target].concat(args)
      );
    }
    var methods = {
      apply(ctx, object, args, called = false, isStatic = false) {
        const callee = object.type === "MemberExpression" ? object.object : object;
        if (!called) {
          return callee;
        }
        const _arguments = [args[0]];
        if (args.length > 1) {
          _arguments.push(ctx.createArrayNode(args.slice(1)));
        }
        return createCallNode(ctx, callee, _arguments);
      },
      call(ctx, object, args, called = false, isStatic = false) {
        const callee = object.type === "MemberExpression" ? object.object : object;
        if (!called) {
          return callee;
        }
        const _arguments = [args[0]];
        if (args.length > 1) {
          _arguments.push(ctx.createArrayNode(args.slice(1)));
        }
        return createCallNode(ctx, callee, _arguments);
      },
      bind(ctx, object, args, called = false, isStatic = false) {
        args = args.slice();
        ctx.addDepend(ctx.builder.getGlobalModuleById("System"));
        if (!called) {
          return ctx.createArrayNode([
            ctx.createClassRefsNode(ctx.builder.getGlobalModuleById("System")),
            ctx.createLiteralNode("bind")
          ]);
        }
        const arguments = ctx.stack.arguments || [];
        let flagNode = ctx.createLiteralNode(null);
        if (arguments[0]) {
          const type = ctx.inferType(arguments[0]);
          if (type.isLiteralArrayType || ctx.builder.getGlobalModuleById("Array") === ctx.stack.compiler.callUtils("getOriginType", type)) {
            flagNode = ctx.createLiteralNode(true);
          } else if (!type.isAnyType) {
            flagNode = ctx.createLiteralNode(false);
          }
        }
        args.splice(1, 0, flagNode);
        if (object.type === "MemberExpression") {
          object = ctx.createArrayNode([object.object, object.createLiteralNode(object.property.value)]);
        }
        return ctx.createCalleeNode(
          ctx.createStaticMemberNode([
            ctx.createIdentifierNode("System"),
            ctx.createIdentifierNode("bind")
          ]),
          [object].concat(args)
        );
      }
    };
    ["propertyIsEnumerable", "hasOwnProperty", "valueOf", "toLocaleString", "toString"].forEach((name) => {
      if (!Object.prototype.hasOwnProperty.call(methods, name)) {
        methods[name] = ObjectMethod[name];
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
    function createDateNode(ctx, format, args = []) {
      const node = ctx.createLiteralNode(format);
      if (/\\/.test(format)) {
        node.raw = `"${format}"`;
      }
      return ctx.createCalleeNode(
        ctx.createIdentifierNode("date"),
        [node].concat(args)
      );
    }
    function createFixNode(ctx, format, now) {
      switch (format) {
        case "k":
        case "kk":
          return ctx.createCalleeNode(
            ctx.createIdentifierNode("sprintf"),
            [
              ctx.createLiteralNode(format === "kk" ? "%02d" : "%d"),
              ctx.createBinaryNode(
                "+",
                ctx.createCalleeNode(
                  ctx.createIdentifierNode("intval"),
                  [createDateNode(ctx, "G", now)]
                ),
                ctx.createLiteralNode(1)
              )
            ]
          );
        case "ww":
          return ctx.createCalleeNode(
            ctx.createIdentifierNode("sprintf"),
            [
              ctx.createLiteralNode("%02d"),
              createDateNode(ctx, "W", now)
            ]
          );
        case "s":
        case "m":
          return ctx.createCalleeNode(
            ctx.createIdentifierNode("ltrim"),
            [
              createDateNode(ctx, format === "m" ? "i" : "s", now),
              ctx.createLiteralNode("0")
            ]
          );
        case "x":
          return ctx.createCalleeNode(
            ctx.createIdentifierNode("sprintf"),
            [
              ctx.createLiteralNode("%d%03d"),
              createDateNode(ctx, "U", now),
              ctx.createBinaryNode(
                "/",
                ctx.createCalleeNode(
                  ctx.createIdentifierNode("date_format"),
                  [
                    ctx.createCalleeNode(ctx.createIdentifierNode("date_create"), now),
                    ctx.createLiteralNode("u")
                  ]
                ),
                ctx.createLiteralNode(1e3)
              )
            ]
          );
        case "E":
          return ctx.createCalleeNode(
            ctx.createIdentifierNode("sprintf"),
            [
              ctx.createLiteralNode("%d"),
              ctx.createBinaryNode(
                "+",
                ctx.createCalleeNode(
                  ctx.createIdentifierNode("intval"),
                  [createDateNode(ctx, "w", now)]
                ),
                ctx.createLiteralNode(1)
              )
            ]
          );
        case "Q":
        case "Qo":
          return ctx.createCalleeNode(
            ctx.createIdentifierNode("sprintf"),
            [
              ctx.createLiteralNode(format === "Qo" ? "%d%s" : "%d"),
              ctx.createCalleeNode(
                ctx.createIdentifierNode("ceil"),
                [
                  ctx.createBinaryNode(
                    "/",
                    ctx.createCalleeNode(
                      ctx.createIdentifierNode("intval"),
                      [createDateNode(ctx, "n", now)]
                    ),
                    ctx.createLiteralNode(3)
                  )
                ]
              ),
              format === "Qo" && createDateNode(ctx, "S", now)
            ].filter((item) => !!item)
          );
      }
      if (format.charCodeAt(0) === 83) {
        const len = format.length;
        return ctx.createCalleeNode(
          ctx.createIdentifierNode("sprintf"),
          [
            len > 3 ? ctx.createLiteralNode(`%-\\'0${len}s`) : ctx.createLiteralNode(`%0${len}d`),
            ctx.createCalleeNode(
              ctx.createIdentifierNode("round"),
              [
                ctx.createBinaryNode(
                  "/",
                  ctx.createCalleeNode(
                    ctx.createIdentifierNode("date_format"),
                    [
                      ctx.createCalleeNode(ctx.createIdentifierNode("date_create"), now),
                      ctx.createLiteralNode("u")
                    ]
                  ),
                  ctx.createLiteralNode(Math.pow(10, Math.max(6 - len, 3)))
                )
              ]
            )
          ]
        );
      }
      if (/[^\\][a-zA-Z]+/.test(format)) {
        return createDateNode(ctx, format, now);
      } else {
        return ctx.createLiteralNode(format);
      }
    }
    function createCalleeNode(ctx, args) {
      const group = parseFormat(args[0].value);
      const segments = [];
      var now = args.slice(1, 2);
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
        const node = createFixNode(ctx, segments.pop(), now);
        while (segments.length > 0) {
          base = ctx.createBinaryNode(".", createFixNode(base || ctx, segments.pop(), now), base || node);
        }
        return base;
      }
      return createDateNode(ctx, segments[0], now);
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
      setInterval(ctx, object, args, called = false, isStatic = false) {
        ctx.callee = ctx.createIdentifierNode("call_user_func");
        ctx.arguments = args.slice(0, 1);
        return ctx;
      },
      setTimeout(ctx, object, args, called = false, isStatic = false) {
        ctx.callee = ctx.createIdentifierNode("call_user_func");
        ctx.arguments = args.slice(0, 1);
        return ctx;
      },
      clearTimeout(ctx, object, args, called = false, isStatic = false) {
        return null;
      },
      clearInterval(ctx, object, args, called = false, isStatic = false) {
        return null;
      },
      parseInt(ctx, object, args, called = false, isStatic = false) {
        if (called) {
          ctx.callee = ctx.createIdentifierNode("intval");
          ctx.arguments = args.slice(0, 2);
          return ctx;
        } else {
          return null;
        }
      },
      parseFloat(ctx, object, args, called = false, isStatic = false) {
        if (called) {
          ctx.callee = ctx.createIdentifierNode("floatval");
          ctx.arguments = args.slice(0, 1);
          return ctx;
        } else {
          return null;
        }
      },
      isNaN(ctx, object, args, called = false, isStatic = false) {
        ctx.addDepend(ctx.builder.getGlobalModuleById("System"));
        if (!called) {
          ctx.createChunkNode(`function($target){return System::isNaN($target);}`);
        }
        return ctx.createCalleeNode(
          ctx.createStaticMemberNode([
            ctx.createIdentifierNode("System"),
            ctx.createIdentifierNode("isNaN")
          ]),
          args
        );
      },
      isFinite(ctx, object, args, called = false, isStatic = false) {
        if (!called) {
          return ctx.createLiteralNode("is_finite");
        }
        ctx.callee = ctx.createIdentifierNode("is_finite");
        ctx.arguments = args.slice(0, 1);
        return ctx;
      }
    };
  }
});

// transforms/IArguments.js
var require_IArguments = __commonJS({
  "transforms/IArguments.js"(exports2, module2) {
    var ObjectMethod = require_Object();
    var methods = {
      length(ctx, object, args, called = false, isStatic = false) {
        return ctx.createCalleeNode(ctx.createIdentifierNode("func_num_args"));
      },
      $computed(ctx, object, args, called = false, isStatic = false) {
        return ctx.createCalleeNode(ctx.createIdentifierNode("func_get_arg"), args);
      }
    };
    ["propertyIsEnumerable", "hasOwnProperty", "valueOf", "toLocaleString", "toString"].forEach((name) => {
      if (!Object.prototype.hasOwnProperty.call(methods, name)) {
        methods[name] = ObjectMethod[name];
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
      parse(ctx, object, args, called = false, isStatic = false) {
        if (!called) {
          return ctx.createChunkNode(`function($target){return json_decode($target);}`);
        }
        return ctx.createCalleeNode(
          ctx.createIdentifierNode("json_decode"),
          args.slice(0, 1)
        );
      },
      stringify(ctx, object, args, called = false, isStatic = false) {
        if (!called) {
          return ctx.createChunkNode(`function($target){return json_encode($target,JSON_UNESCAPED_UNICODE);}`);
        }
        return ctx.createCalleeNode(
          ctx.createIdentifierNode("json_encode"),
          args.slice(0, 1).concat(ctx.createIdentifierNode(`JSON_UNESCAPED_UNICODE`))
        );
      }
    };
  }
});

// transforms/Math.js
var require_Math = __commonJS({
  "transforms/Math.js"(exports2, module2) {
    function createCommonCalledNode(name, ctx, object, args, called, params) {
      if (!called) {
        return createCalleeFunctionNode(ctx, params || ["value"], name);
      }
      let len = 1;
      if (params && Array.isArray(params)) {
        len = params[0] === "..." ? args.length : params.length;
      }
      return ctx.createCalleeNode(
        ctx.createIdentifierNode(name),
        args.slice(0, len)
      );
    }
    function createCalleeFunctionNode(ctx, args, callName) {
      const cratePparams = () => args.map((name) => {
        if (name === "...") {
          const node = ctx.createNode("RestElement");
          node.value = "args";
          node.raw = "args";
          return node;
        }
        return ctx.createIdentifierNode(name, null, true);
      });
      return ctx.createFunctionNode((ctx2) => {
        ctx2.body.push(
          ctx2.createReturnNode(
            ctx2.createCalleeNode(
              ctx2.createIdentifierNode(callName),
              cratePparams()
            )
          )
        );
      }, cratePparams());
    }
    module2.exports = {
      E(ctx) {
        return ctx.createLiteralNode(2.718281828459045);
      },
      LN10(ctx) {
        return ctx.createLiteralNode(2.302585092994046);
      },
      LN2(ctx) {
        return ctx.createLiteralNode(0.6931471805599453);
      },
      LOG2E(ctx) {
        return ctx.createLiteralNode(1.4426950408889634);
      },
      LOG10E(ctx) {
        return ctx.createLiteralNode(0.4342944819032518);
      },
      PI(ctx) {
        return ctx.createLiteralNode(3.141592653589793);
      },
      SQRT1_2(ctx) {
        return ctx.createLiteralNode(0.7071067811865476);
      },
      SQRT2(ctx) {
        return ctx.createLiteralNode(1.4142135623730951);
      },
      abs(ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode("abs", ctx, object, args, called);
      },
      acos(ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode("acos", ctx, object, args, called);
      },
      asin(ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode("asin", ctx, object, args, called);
      },
      atan2(ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode("atan2", ctx, object, args, called, ["a", "b"]);
      },
      ceil(ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode("ceil", ctx, object, args, called);
      },
      cos(ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode("cos", ctx, object, args, called);
      },
      log(ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode("log", ctx, object, args, called);
      },
      max(ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode("max", ctx, object, args, called, ["..."]);
      },
      min(ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode("min", ctx, object, args, called, ["..."]);
      },
      pow(ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode("pow", ctx, object, args, called, ["a", "b"]);
      },
      sin(ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode("sin", ctx, object, args, called);
      },
      sqrt(ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode("sqrt", ctx, object, args, called);
      },
      tan(ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode("tan", ctx, object, args, called);
      },
      round(ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode("round", ctx, object, args, called);
      },
      floor(ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode("floor", ctx, object, args, called);
      },
      random(ctx, object, args, called = false, isStatic = false) {
        if (!called) {
          return ctx.createChunkNode(`function(){return mt_rand(1,2147483647) / 2147483647;}`);
        }
        return ctx.createChunkNode(`(mt_rand(1,2147483647) / 2147483647)`);
      }
    };
  }
});

// transforms/String.js
var require_String = __commonJS({
  "transforms/String.js"(exports2, module2) {
    var ObjectMethod = require_Object();
    function createMethodFunctionNode(ctx, name) {
      return ctx.createLiteralNode(name);
    }
    function createCommonCalledNode(name, ctx, object, args, called) {
      if (!called)
        return createMethodFunctionNode(ctx, name);
      return ctx.createCalleeNode(
        ctx.createIdentifierNode(name),
        object ? [object].concat(args) : args
      );
    }
    var methods = {
      fromCharCode(ctx, object, args, called = false, isStatic = false) {
        if (!called) {
          return ctx.createChunkNode(`function($code){return chr($code);}`);
        }
        if (args.length === 1) {
          return createCommonCalledNode("chr", ctx, null, args, true);
        }
        const module3 = ctx.builder.getGlobalModuleById("String");
        const name = ctx.builder.getModuleNamespace(module3, "es_string_from_char_code");
        ctx.addDepend(module3);
        return createCommonCalledNode(name, ctx, null, args, true);
      },
      charAt(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("String");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_string_char_at");
        return createCommonCalledNode(name, ctx, object, args, called);
      },
      charCodeAt(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("String");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_string_char_code_at");
        return createCommonCalledNode(name, ctx, object, args, called);
      },
      concat(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("String");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_string_concat");
        return createCommonCalledNode(name, ctx, object, args, called);
      },
      includes(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("String");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_string_includes");
        return createCommonCalledNode(name, ctx, object, args, called);
      },
      indexOf(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("String");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_string_index_of");
        return createCommonCalledNode(name, ctx, object, args, called);
      },
      lastIndexOf(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("String");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_string_last_index_of");
        return createCommonCalledNode(name, ctx, object, args, called);
      },
      localeCompare(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("String");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_string_locale_compare");
        return createCommonCalledNode(name, ctx, object, args, called);
      },
      match(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("String");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_string_match");
        return createCommonCalledNode(name, ctx, object, args, called);
      },
      matchAll(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("String");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_string_match_all");
        return createCommonCalledNode(name, ctx, object, args, called);
      },
      search(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("String");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_string_search");
        return createCommonCalledNode(name, ctx, object, args, called);
      },
      replace(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("String");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_string_replace");
        return createCommonCalledNode(name, ctx, object, args, called);
      },
      replaceAll(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("String");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_string_replace_all");
        return createCommonCalledNode(name, ctx, object, args, called);
      },
      slice(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("String");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_string_slice");
        return createCommonCalledNode(name, ctx, object, args, called);
      },
      repeat(ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode("str_repeat", ctx, object, args, called);
      },
      length(ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode("mb_strlen", ctx, object, args, true);
      },
      substr(ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode("mb_substr", ctx, object, args, called);
      },
      substring(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("String");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_string_substring");
        return createCommonCalledNode(name, ctx, object, args, called);
      },
      toLowerCase(ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode("mb_strtolower", ctx, object, args, called);
      },
      toLocaleLowerCase(ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode("mb_strtolower", ctx, object, args, called);
      },
      toUpperCase(ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode("mb_strtoupper", ctx, object, args, called);
      },
      toLocaleUpperCase(ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode("mb_strtoupper", ctx, object, args, called);
      },
      trim(ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode("trim", ctx, object, args, called);
      },
      trimEnd(ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode("rtrim", ctx, object, args, called);
      },
      trimStart(ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode("ltrim", ctx, object, args, called);
      },
      split(ctx, object, args, called = false, isStatic = false) {
        if (!called) {
          return ctx.createChunkNode(`function($target,$delimit){return explode($delimit,$target);}`);
        }
        return ctx.createCalleeNode(
          ctx.createIdentifierNode("explode"),
          [args[0], object]
        );
      },
      padStart(ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode("str_pad", ctx, object, [args[0], ctx.createIdentifierNode("STR_PAD_LEFT")], called);
      },
      padEnd(ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode("str_pad", ctx, object, [args[0], ctx.createIdentifierNode("STR_PAD_RIGHT")], called);
      },
      normalize(ctx, object, args, called = false, isStatic = false) {
        const module3 = ctx.builder.getGlobalModuleById("String");
        ctx.addDepend(module3);
        const name = ctx.builder.getModuleNamespace(module3, "es_string_normalize");
        return createCommonCalledNode(name, ctx, object, args, called);
      },
      valueOf(ctx, object, args, called = false, isStatic = false) {
        if (!called) {
          return ctx.createChunkNode(`function($target){return $target;}`);
        }
        return createCommonCalledNode("strval", ctx, object, [], called);
      }
    };
    ["propertyIsEnumerable", "hasOwnProperty", "valueOf", "toLocaleString", "toString"].forEach((name) => {
      if (!Object.prototype.hasOwnProperty.call(methods, name)) {
        methods[name] = ObjectMethod[name];
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
      constructor(stack, ctx) {
        super(stack.toString());
        this.stack = stack;
        this.scope = stack.scope;
        this.compilation = stack.compilation;
        this.compiler = stack.compiler;
        this.module = stack.module;
        this.plugin = ctx.plugin;
        this.name = ctx.name;
        this.platform = ctx.platform;
        this.parent = ctx;
        this.builder = ctx.builder;
      }
      makeConfig(data2) {
        const items = [];
        Object.entries(data2).map((item) => {
          const [key, value] = item;
          if (value) {
            if (Array.isArray(value)) {
              if (value.length > 0) {
                const isObject = value[0].type === "Property";
                if (isObject) {
                  items.push(this.createPropertyNode(this.createLiteralNode(key), this.createObjectNode(value)));
                } else {
                  items.push(this.createPropertyNode(this.createLiteralNode(key), this.createArrayNode(value)));
                }
              }
            } else {
              if (value.type === "Property") {
                items.push(value);
              } else {
                items.push(this.createPropertyNode(this.createLiteralNode(key), value));
              }
            }
          }
        });
        return items.length > 0 ? this.createObjectNode(items) : null;
      }
      makeAttributes(stack, childNodes, data2, spreadAttributes) {
        const pushEvent = (name, callback, category) => {
          const events = data2[category] || (data2[category] = []);
          const property = this.createPropertyNode(name, callback);
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
              const name2 = item.name.value();
              if (name2 === "show") {
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
            const name2 = item.name.value();
            const scopeName = item.value ? item.value.value() : null;
            if (scopeName) {
              data2.scopedSlots.push(
                this.createPropertyNode(
                  this.createIdentifierNode(name2),
                  this.createFunctionNode(
                    (ctx) => {
                      ctx.body.push(
                        ctx.createReturnNode(childNodes ? childNodes : ctx.createLiteralNode(null))
                      );
                    },
                    [this.createIdentifierNode(scopeName)]
                  )
                )
              );
            } else {
              data2.slot = this.createLiteralNode(name2);
            }
            return;
          }
          let value = this.createToken(item);
          if (!value)
            return;
          let ns = value.namespace;
          let name = value.name.name;
          if (ns && ns.includes("::")) {
            let [seg, className] = ns.split("::", 2);
            ns = seg;
            const refsModule = stack.getModuleById(className);
            const moduleClass = this.getModuleReferenceName(refsModule);
            this.addDepend(refsModule);
            name = this.createStaticMemberNode([
              this.createIdentifierNode(moduleClass),
              name
            ], name);
            name.computed = true;
          }
          if (ns === "@events") {
            pushEvent(name, toFun(item, value.value), "on");
            return;
          } else if (ns === "@natives") {
            pushEvent(name, toFun(item, value.value), "nativeOn");
            return;
          } else if (ns === "@binding") {
            data2.directives.push(
              this.createObjectNode([
                this.createPropertyNode(this.createIdentifierNode("name"), this.createLiteralNode("model")),
                this.createPropertyNode(this.createIdentifierNode("value"), value.value)
              ])
            );
            const funNode = this.createFunctionNode(
              (block) => {
                block.body = [
                  block.createStatementNode(
                    block.createAssignmentNode(
                      value.value,
                      block.createChunkNode(`event && event.target && event.target.nodeType===1 ? event.target.value : event`, false)
                    )
                  )
                ];
              },
              [this.createIdentifierNode("event")]
            );
            pushEvent(this.createIdentifierNode("input"), funNode, "on");
          }
          let propName = name = value.name.value;
          if (item.isMemberProperty) {
            let isDOMAttribute = false;
            let attrDesc = item.getAttributeDescription(stack.getSubClassDescription());
            if (attrDesc) {
              isDOMAttribute = attrDesc.annotations.some((item2) => item2.name.toLowerCase() === "domattribute");
              const alias = attrDesc.annotations.find((item2) => item2.name.toLowerCase() === "alias");
              if (alias) {
                const args = alias.getArguments();
                if (args.length > 0) {
                  propName = args[0].value;
                }
              }
            }
            if (!isDOMAttribute) {
              data2.props.push(this.createPropertyNode(this.createPropertyKeyNode(propName, value.name.stack), value.value));
              return;
            }
          }
          const property = this.createPropertyNode(this.createPropertyKeyNode(propName, value.name.stack), value.value);
          switch (name) {
            case "class":
            case "style":
            case "key":
            case "ref":
            case "refInFor":
            case "tag":
            case "staticStyle":
            case "staticClass":
              data2[name] = property;
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
      createFunBindNode(target, thisArg, args = []) {
        this.addDepend(this.builder.getGlobalModuleById("System"));
        return this.createCalleeNode(
          this.createStaticMemberNode([
            this.createIdentifierNode("System"),
            this.createIdentifierNode("bind")
          ]),
          [
            target,
            thisArg
          ].concat(args.map((item) => {
            const obj = item instanceof Token2 ? item : this.createIdentifierNode(item, null, true);
            obj.isVariable = true;
            return obj;
          }))
        );
      }
      createPropertyKeyNode(name, stack) {
        return this.createLiteralNode(name, void 0, stack);
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
          const name = b.name.value();
          return name === "each" || name === "for" ? -1 : 0;
        });
        let ctx = element.jsxTransformNode || this;
        while (directives.length > 0) {
          const directive = directives.shift();
          const name = directive.name.value();
          const valueArgument = directive.valueArgument;
          if (name === "each" || name === "for") {
            let refs = ctx.createToken(valueArgument.expression);
            let desc2 = valueArgument.expression.isStack && valueArgument.expression.description();
            let item = valueArgument.declare.item;
            let key = valueArgument.declare.key;
            let index = valueArgument.declare.index;
            if (cmd.includes("if")) {
              cmd.pop();
              content.push(ctx.createLiteralNode(null));
              content[0] = ctx.cascadeConditionalNode(content);
            }
            if (name === "each") {
              content[0] = ctx.createIterationNode(name, refs, desc2, ctx.checkRefsName("_refs"), content[0], item, key);
            } else {
              content[0] = ctx.createIterationNode(name, refs, desc2, ctx.checkRefsName("_refs"), content[0], item, key, index);
            }
            cmd.push(name);
          } else if (name === "if") {
            const node = ctx.createNode("ConditionalExpression");
            node.test = ctx.createToken(valueArgument.expression);
            node.consequent = content[0];
            content[0] = node;
            cmd.push(name);
          } else if (name === "elseif") {
            if (!prevResult || !(prevResult.cmd.includes("if") || prevResult.cmd.includes("elseif"))) {
              directive.name.error(1114, name);
            } else {
              cmd.push(name);
            }
            const node = ctx.createNode("ConditionalExpression");
            node.test = ctx.createToken(valueArgument.expression);
            node.consequent = content[0];
            content[0] = node;
          } else if (name === "else") {
            if (!prevResult || !(prevResult.cmd.includes("if") || prevResult.cmd.includes("elseif"))) {
              directive.name.error(1114, name);
            } else {
              cmd.push(name);
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
              const name = child.openingElement.name.value();
              if (child.attributes.length > 0) {
                data2.scopedSlots.push(this.createPropertyNode(this.createLiteralNode(name), elem.content[0]));
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
        const push = (data3, value) => {
          if (value) {
            if (Array.isArray(value)) {
              data3.push(...value);
            } else {
              data3.push(value);
            }
          }
        };
        var hasComplex = false;
        while (true) {
          result = next();
          if (last) {
            let value = null;
            const hasIf = last.cmd.includes("if");
            if (hasIf) {
              if (result && result.cmd.includes("elseif")) {
                result.cmd = last.cmd.concat(result.cmd);
                result.content = last.content.concat(result.content);
              } else if (result && result.cmd.includes("else")) {
                value = this.cascadeConditionalNode(last.content.concat(result.content));
                result.ifEnd = true;
              } else {
                if (result)
                  result.ifEnd = true;
                last.content.push(this.createLiteralNode(null));
                value = this.cascadeConditionalNode(last.content);
              }
            } else if (!(last.ifEnd && last.cmd.includes("else"))) {
              value = last.content;
            }
            const complex = last.child.isJSXExpressionContainer ? !!(last.child.expression.isMemberExpression || last.child.expression.isCallExpression) : false;
            if (last.cmd.includes("each") || last.cmd.includes("for") || last.child.isSlot || last.child.isDirective || complex) {
              hasComplex = true;
            }
            push(content, value);
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
        const node = this.createFunctionNode((ctx) => {
          const refArray = `_${refName}`;
          ctx.body.push(
            ctx.createDeclarationNode("var", [
              ctx.createDeclaratorNode(ctx.createIdentifierNode(refArray), ctx.createArrayNode())
            ])
          );
          if (index) {
            ctx.body.push(
              ctx.createDeclarationNode("var", [
                ctx.createDeclaratorNode(
                  ctx.createIdentifierNode(index),
                  ctx.createLiteralNode(0, 0)
                )
              ])
            );
          }
          const _key = key || `_${item}Key`;
          const forNode = ctx.createNode("ForInStatement");
          ctx.body.push(forNode);
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
          ctx.body.push(ctx.createReturnNode(ctx.createIdentifierNode(refArray, null, true)));
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
      createEachNode(element, args) {
        const node = this.createFunctionNode(
          (ctx) => {
            ctx.body.push(ctx.createReturnNode(element.type === "ArrayExpression" && element.elements.length === 1 ? element.elements[0] : element));
          },
          args
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
      createIterationNode(name, refs, desc2, refName, element, item, key, index) {
        if (name === "each") {
          const args = [this.createIdentifierNode(item, null, true)];
          if (key) {
            args.push(this.createIdentifierNode(key, null, true));
          }
          const node = Transform2.get("Array").map(this, refs, [this.createEachNode(element, args)], true);
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
        const node = this.createMethodNode("render", (ctx) => {
          handle.parent = ctx;
          ctx.body = [
            handle,
            ctx.createReturnNode(child)
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
      createElementNode(stack, ...args) {
        const refs = this.createElementRefsNode();
        refs.isVariable = true;
        const node = this.createCalleeNode(refs, args);
        return node;
      }
      createSlotCalleeNode(child, ...args) {
        const node = this.createNode("LogicalExpression");
        node.left = node.createCalleeNode(
          node.createMemberNode([
            node.createThisNode(),
            node.createIdentifierNode("slot")
          ]),
          args
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
                  this.createParenthesNode(this.createFunctionNode((ctx) => {
                    const node = ctx.createNode("ReturnStatement");
                    node.argument = children;
                    children.parent = node;
                    ctx.body.push(node);
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
        const name = openingElement.name.value();
        switch (name) {
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
              name,
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
        var name = null;
        if (stack.isComponent) {
          if (stack.jsxRootElement === stack && stack.parentStack.isProgram) {
            name = this.createLiteralNode("div");
          } else {
            const module3 = stack.description();
            this.addDepend(module3);
            name = this.createClassRefsNode(module3, stack);
          }
        } else {
          name = this.createLiteralNode(stack.openingElement.name.value(), void 0, stack.openingElement.name);
        }
        data2 = this.makeConfig(data2);
        if (children) {
          return this.createElementNode(stack, name, data2 || this.createLiteralNode(null), children);
        } else if (data2) {
          return this.createElementNode(stack, name, data2);
        } else {
          return this.createElementNode(stack, name);
        }
      }
      create(stack) {
        const data2 = this.getElementConfig();
        const children = stack.children.filter((child) => !(child.isJSXScript && child.isScriptProgram || child.isJSXStyle));
        const childNodes = this.makeChildren(children, data2);
        if (stack.parentStack.isSlot) {
          const name = stack.parentStack.openingElement.name.value();
          data2.slot = this.createLiteralNode(name);
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
            const block = this.getParentByType((ctx) => {
              return ctx.type === "BlockStatement" && ctx.parent.type === "MethodDefinition";
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
    module2.exports = function(ctx, stack, type) {
      const args = stack.getArguments();
      const name = stack.name;
      switch (name.toLowerCase()) {
        case "provider":
          const indexMap = ["className", "action", "method"];
          const getItem = (name2) => {
            let index = args.findIndex((item) => item.key === name2);
            if (index < 0) {
              index = indexMap.indexOf(name2);
            }
            return args[index];
          };
          const moduleClass = getItem(indexMap[0]);
          const action = getItem(indexMap[1]);
          const method = getItem(indexMap[2]) || { value: "Get" };
          const providerModule = stack.getModuleById(moduleClass.value, true);
          if (!providerModule) {
            ctx.error(`Class '${moduleClass.value}' is not exists.`);
          } else {
            const member = providerModule.getMember(action.value);
            if (!member || member.modifier && member.modifier.value() !== "public") {
              ctx.error(`Method '${moduleClass.value}::${action.value}' is not exists.`);
            } else {
              const annotation = member.annotations.find((item) => method.value.toLowerCase() == item.name.toLowerCase());
              if (!annotation) {
                ctx.error(`Router '${method.value}' method is not exists. in ${moduleClass.value}::${action.value}`);
              } else {
                ctx.compilation.setPolicy(2, providerModule);
                const params = annotation.getArguments();
                const value = params[0] ? params[0].value : action.value;
                const node = ctx.createNode(stack, "Literal");
                if (value.charCodeAt(0) === 47) {
                  node.value = value;
                  node.raw = `"${value}"`;
                } else {
                  node.value = `/${providerModule.id.toLowerCase()}/${value}`;
                  node.raw = `"/${providerModule.id.toLowerCase()}/${value}"`;
                }
                return node;
              }
            }
          }
          return null;
        case "http":
          return null;
        default:
          ctx.error(`The '${name}' annotations is not supported.`);
      }
      return null;
    };
  }
});

// tokens/ArrayExpression.js
var require_ArrayExpression = __commonJS({
  "tokens/ArrayExpression.js"(exports2, module2) {
    var _Array = require_Array();
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
      let hasSpread = false;
      node.elements = stack.elements.map((stack2, index) => {
        let item = node.createToken(stack2);
        if (item && stack2.isSpreadElement) {
          hasSpread = true;
        } else {
          if (ctx.isPassableReferenceExpress(stack2, stack2.type())) {
            item = ctx.creaateAddressRefsNode(item);
          }
        }
        return item;
      });
      if (hasSpread) {
        if (node.elements.length === 1) {
          return node.elements[0];
        }
        return _Array.concat(ctx, ctx.createArrayNode(), node.elements, true, false);
      }
      return node;
    };
  }
});

// tokens/ArrayPattern.js
var require_ArrayPattern = __commonJS({
  "tokens/ArrayPattern.js"(exports2, module2) {
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
      node.elements = stack.elements.map((item) => node.createToken(item));
      return node;
    };
  }
});

// tokens/FunctionExpression.js
var require_FunctionExpression = __commonJS({
  "tokens/FunctionExpression.js"(exports2, module2) {
    var Token2 = require_Token();
    function createInitNode(ctx, name, initValue, defaultValue, operator) {
      return ctx.createStatementNode(ctx.createAssignmentNode(
        name instanceof Token2 ? name : ctx.createIdentifierNode(name, null, true),
        defaultValue ? ctx.createBinaryNode(
          operator,
          initValue,
          defaultValue
        ) : initValue
      ));
    }
    function createRefsMemberNode(ctx, object, property, computed = false) {
      const node = ctx.createMemberNode([ctx.createIdentifierNode(object, null, true), typeof property === "number" ? ctx.createLiteralNode(property) : ctx.createIdentifierNode(property)]);
      node.computed = computed;
      return node;
    }
    function createParamNode(ctx, name, prefix) {
      const node = ctx.createNode("ParamDeclarator");
      node.argument = name instanceof Token2 ? name : ctx.createIdentifierNode(name, null, true);
      node.prefix = prefix;
      node.argument.isVariable = true;
      return node;
    }
    function createParamNodes(ctx, stack, params) {
      const before = [];
      const items = params.map((item, index) => {
        if (item.isObjectPattern) {
          const sName = ctx.checkRefsName("_s", false, Token2.SCOPE_REFS_DOWN);
          before.push(createInitNode(
            ctx,
            sName,
            ctx.createIdentifierNode(sName, null, true),
            ctx.createNewNode(ctx.createIdentifierNode("\\stdClass"), []),
            "?:"
          ));
          item.properties.forEach((property) => {
            const key = property.key.value();
            let defaultValue2 = null;
            if (property.hasInit) {
              const initStack = property.init.isAssignmentPattern ? property.init.right : property.init;
              defaultValue2 = ctx.createToken(initStack);
            } else {
              defaultValue2 = ctx.createLiteralNode(null);
            }
            before.push(createInitNode(
              ctx,
              key,
              createRefsMemberNode(ctx, sName, key),
              defaultValue2,
              "??"
            ));
          });
          return createParamNode(ctx, sName, "object");
        } else if (item.isArrayPattern) {
          const sName = ctx.checkRefsName("_s", false, Token2.SCOPE_REFS_DOWN);
          before.push(createInitNode(
            ctx,
            sName,
            ctx.createIdentifierNode(sName, null, true),
            ctx.createArrayNode([]),
            "?:"
          ));
          item.elements.forEach((property, index2) => {
            let key = null;
            let defaultValue2 = null;
            if (property.isAssignmentPattern) {
              key = property.left.value();
              defaultValue2 = ctx.createToken(property.right);
            } else {
              key = property.value();
              defaultValue2 = ctx.createLiteralNode(null);
            }
            before.push(createInitNode(
              ctx,
              key,
              createRefsMemberNode(ctx, sName, index2, true),
              defaultValue2,
              "??"
            ));
          });
          return createParamNode(ctx, sName, "array");
        }
        const oType = item.acceptType && item.acceptType.type();
        let acceptType = null;
        if (oType && !item.isRestElement && !oType.isGenericType && !oType.isLiteralObjectType) {
          acceptType = stack.compiler.callUtils("getOriginType", oType);
        }
        let typeName = "";
        let defaultValue = null;
        let nameNode = null;
        if (item.isAssignmentPattern) {
          nameNode = ctx.createIdentifierNode(item.left.value(), item.left, true);
          defaultValue = ctx.createToken(item.right);
        } else if (item.question) {
          nameNode = ctx.createToken(item);
          defaultValue = ctx.createLiteralNode(null);
        } else {
          nameNode = ctx.createToken(item);
        }
        if (acceptType && acceptType.isModule) {
          const originType = ctx.builder.getAvailableOriginType(acceptType);
          if (originType === "String" || originType === "Array" || originType === "Object") {
            typeName = originType.toLowerCase();
          } else if (originType === "Function") {
            typeName = "\\Closure";
          } else if (originType === "Boolean") {
            typeName = "bool";
          }
          if (!typeName && !originType) {
            typeName = ctx.getModuleReferenceName(acceptType);
          }
        }
        if (oType && !item.isRestElement && !oType.isGenericType) {
          const isAddress = ctx.isAddressRefsType(oType, item);
          if (isAddress) {
            nameNode = ctx.creaateAddressRefsNode(nameNode);
          }
        }
        if (defaultValue) {
          nameNode = ctx.createAssignmentNode(nameNode, defaultValue);
        }
        return createParamNode(ctx, nameNode, typeName);
      });
      return [items, before];
    }
    module2.exports = function(ctx, stack, type) {
      const node = ctx.createNode(stack, type);
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
        const executer = node.createFunctionNode((ctx2) => {
          const resolve = ctx2.createCalleeNode(ctx2.createIdentifierNode("resolve", null, true), [
            ctx2.createCalleeNode(ctx2.createIdentifierNode("call_user_func"), [content])
          ]);
          const reject = ctx2.createCalleeNode(ctx2.createIdentifierNode("reject", null, true), [
            ctx2.createIdentifierNode("e", null, true)
          ]);
          const tryNode = ctx2.createNode("TryStatement");
          tryNode.param = createParamNode(ctx2, "e", "\\Exception");
          tryNode.block = node.createNode("BlockStatement");
          tryNode.block.body = [ctx2.createStatementNode(resolve)];
          tryNode.handler = node.createNode("BlockStatement");
          tryNode.handler.body = [ctx2.createStatementNode(reject)];
          ctx2.body.push(tryNode);
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
    module2.exports = function(ctx, stack, type) {
      const node = FunctionExpression(ctx, stack, type);
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
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
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
        const objectType = ctx.inferType(stack.left.object);
        if (desc2 && desc2.isStack && (desc2.isMethodSetterDefinition || desc2.parentStack.isPropertyDefinition)) {
          const property = stack.left.property.value();
          let typename = ctx.builder.getAvailableOriginType(objectType) || objectType.toString();
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
          if (!hasDynamic && !ctx.compiler.callUtils("isLiteralObjectType", objectType)) {
            isReflect = true;
          }
        } else if (desc2 && desc2.isAnyType) {
          isReflect = !ctx.compiler.callUtils("isLiteralObjectType", objectType);
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
          const value = node.createCalleeNode(callee2, [
            node.createCallReflectScopeNode(module3),
            node.createToken(stack.left.object),
            node.createCallReflectPropertyNode(stack.left)
          ], stack);
          refsNode = node.createBinaryNode(operator, value, refsNode);
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
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
      node.left = node.createIdentifierNode(stack.left.value(), stack.left, true);
      node.right = node.createToken(stack.right);
      return node;
    };
  }
});

// tokens/AwaitExpression.js
var require_AwaitExpression = __commonJS({
  "tokens/AwaitExpression.js"(exports2, module2) {
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
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
    function createNode(ctx, stack) {
      let maybeArrayRef = stack.isMemberExpression || stack.isCallExpression || stack.isIdentifier;
      if (maybeArrayRef) {
        if (stack.isIdentifier || stack.isMemberExpression) {
          const desc3 = stack.description();
          if (stack.compiler.callUtils("isTypeModule", desc3)) {
            return ctx.createToken(stack);
          }
        }
        const originType = ctx.builder.getAvailableOriginType(ctx.inferType(stack));
        if (originType && originType.toLowerCase() === "array") {
          var desc2 = stack.description();
          if (stack.isIdentifier) {
            return ctx.createArrayAddressRefsNode(desc2, stack.value());
          } else {
            const name = ctx.getDeclareRefsName(stack, "_RD");
            const left = ctx.createIdentifierNode(name, null, true);
            const right = ctx.creaateAddressRefsNode(ctx.createToken(stack));
            ctx.insertNodeBlockContextAt(ctx.createAssignmentNode(left, right));
            return ctx.createIdentifierNode(name, null, true);
          }
        }
      }
      return ctx.createToken(stack);
    }
    module2.exports = function(ctx, stack) {
      var operator = stack.node.operator;
      if (operator === "is" || operator === "instanceof") {
        const type = stack.right.type();
        const name = ctx.builder.getAvailableOriginType(type);
        if (mapset[name]) {
          return ctx.createCalleeNode(
            ctx.createIdentifierNode(mapset[name]),
            [
              ctx.createToken(stack.left)
            ],
            stack
          );
        } else if (operator === "is") {
          ctx.addDepend(type);
          return ctx.createCalleeNode(
            ctx.createIdentifierNode("is_a"),
            [
              ctx.createToken(stack.left),
              ctx.createToken(stack.right)
            ],
            stack
          );
        }
      }
      if (operator.charCodeAt(0) === 43) {
        var leftType = ctx.inferType(stack.left);
        var rightType = ctx.inferType(stack.right);
        var oLeftType = leftType;
        var oRightType = rightType;
        var isNumber = leftType.isLiteralType && rightType.isLiteralType;
        if (isNumber) {
          leftType = ctx.builder.getAvailableOriginType(leftType);
          rightType = ctx.builder.getAvailableOriginType(rightType);
          isNumber = leftType === "Number" && leftType === rightType;
        }
        if (!isNumber) {
          if (oLeftType.toString() === "string" || oRightType.toString() === "string") {
            operator = operator.length > 1 ? "." + operator.substr(1) : ".";
          } else {
            ctx.addDepend(stack.getGlobalTypeById("System"));
            return ctx.createCalleeNode(
              ctx.createStaticMemberNode([
                ctx.createIdentifierNode("System"),
                ctx.createIdentifierNode("addition")
              ]),
              [
                ctx.createToken(stack.left),
                ctx.createToken(stack.right)
              ],
              stack
            );
          }
        }
      }
      const node = ctx.createNode(stack);
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
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
      node.body = [];
      ctx.body = node;
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
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
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
    function createArgumentNodes(ctx, stack, arguments, declareParams) {
      return arguments.map((item, index) => {
        const node = ctx.createToken(item);
        if (declareParams && declareParams[index] && !item.isIdentifier) {
          const declareParam = declareParams[index];
          if (!(declareParam.isRestElement || declareParam.isObjectPattern || declareParam.isArrayPattern)) {
            if (ctx.isAddressRefsType(declareParam.type())) {
              const name = ctx.checkRefsName("arg");
              ctx.insertNodeBlockContextAt(
                ctx.createAssignmentNode(ctx.createIdentifierNode(name, null, true), node)
              );
              return ctx.createIdentifierNode(name, null, true);
            }
          }
        }
        return node;
      });
    }
    function CallExpression(ctx, stack) {
      const isMember = stack.callee.isMemberExpression;
      const desc2 = stack.doGetDeclareFunctionType(stack.callee.description());
      const module3 = stack.module;
      const declareParams = desc2 && desc2.params;
      const node = ctx.createNode(stack);
      const args = createArgumentNodes(node, stack, stack.arguments, declareParams);
      if (stack.callee.isFunctionExpression) {
        node.callee = node.createIdentifierNode("call_user_func");
        node.arguments = [node.createToken(stack.callee)].concat(args);
        return node;
      }
      if (!stack.callee.isSuperExpression) {
        const context = isMember ? stack.callee.object.getContext() : stack.callee.getContext();
        let objectType = isMember ? ctx.inferType(stack.callee.object, context) : null;
        if (objectType && objectType.isClassGenericType && objectType.inherit.isAliasType) {
          objectType = ctx.inferType(objectType.inherit.inherit.type(), context);
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
                args.length > 0 ? node.createArrayNode(args) : null
              ],
              stack
            );
          } else if (desc2.isStack) {
            let name = node.builder.getAvailableOriginType(objectType) || objectType.toString();
            let descModule = null;
            if ((objectType.isUnionType || objectType.isIntersectionType) && (desc2.isMethodDefinition || desc2.isCallDefinition) && desc2.module && desc2.module.isModule) {
              name = desc2.module.id;
              descModule = desc2.module;
            }
            let newWrapObject = null;
            let isStringNewWrapObject = null;
            if (objectType.isInstanceofType && !objectType.isThisType) {
              const origin = objectType.inherit.type();
              isStringNewWrapObject = origin === ctx.builder.getGlobalModuleById("String");
              if (isStringNewWrapObject || origin === ctx.builder.getGlobalModuleById("Number") || origin === ctx.builder.getGlobalModuleById("Boolean")) {
                newWrapObject = true;
              }
            }
            if (Transform2.has(name)) {
              const object = Transform2.get(name);
              const key = stack.callee.property.value();
              if (Object.prototype.hasOwnProperty.call(object, key)) {
                if (desc2.static) {
                  return object[key](
                    node,
                    null,
                    args,
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
                    args,
                    true,
                    false
                  );
                }
              }
            }
            if (!(desc2.isMethodDefinition || desc2.isCallDefinition)) {
              node.callee = node.createIdentifierNode("call_user_func");
              node.arguments = [node.createToken(stack.callee)].concat(args);
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
              ctx.insertNodeBlockContextAt(
                ctx.createAssignmentNode(ctx.createIdentifierNode(refs, null, true), target)
              );
              target = ctx.createIdentifierNode(refs, null, true);
            }
            return node.createCalleeNode(
              node.createStaticMemberNode([
                node.createIdentifierNode(node.getModuleReferenceName(Reflect2)),
                node.createIdentifierNode("apply")
              ]),
              [
                node.createClassRefsNode(module3),
                target,
                args.length > 0 ? node.createArrayNode(args) : null
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
                args,
                true,
                false
              );
            }
          } else if ((desc2.isCallDefinition || desc2.isType && desc2.isModule) && args.length === 1) {
            const name = desc2.isCallDefinition && desc2.module ? desc2.module.id : node.builder.getAvailableOriginType(desc2) || desc2.toString();
            if (name && Transform2.has(name)) {
              const object = Transform2.get(name);
              return object.valueOf(
                node,
                args[0],
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
      node.arguments = args;
      return node;
    }
    module2.exports = CallExpression;
  }
});

// tokens/ClassDeclaration.js
var require_ClassDeclaration = __commonJS({
  "tokens/ClassDeclaration.js"(exports2, module2) {
    var ClassBuilder2 = require_ClassBuilder();
    module2.exports = function(ctx, stack, type) {
      return ClassBuilder2.createClassNode(stack, ctx, type);
    };
  }
});

// tokens/ConditionalExpression.js
var require_ConditionalExpression = __commonJS({
  "tokens/ConditionalExpression.js"(exports2, module2) {
    var AddressVariable = require_AddressVariable();
    function createConditionalNode(ctx, stack) {
      const node = ctx.createNode("IfStatement");
      const result = ctx.getDeclareRefsName(stack, AddressVariable.REFS_NAME);
      let consequent = ctx.createToken(stack.consequent);
      let alternate = ctx.createToken(stack.alternate);
      let assignName = ctx.getDeclareRefsName(stack, AddressVariable.REFS_INDEX);
      const key0 = node.createAssignmentNode(
        node.createIdentifierNode(assignName, null, true),
        node.createLiteralNode(0)
      );
      const key1 = node.createAssignmentNode(
        node.createIdentifierNode(assignName, null, true),
        node.createLiteralNode(1)
      );
      if (ctx.isPassableReferenceExpress(stack.consequent, ctx.inferType(stack.consequent))) {
        consequent = ctx.creaateAddressRefsNode(consequent);
      }
      if (ctx.isPassableReferenceExpress(stack.alternate, ctx.inferType(stack.alternate))) {
        alternate = ctx.creaateAddressRefsNode(alternate);
      }
      node.condition = ctx.createTransformBooleanTypeNode(stack.test);
      node.consequent = ctx.createAssignmentNode(
        node.createMemberNode([
          node.createIdentifierNode(result, null, true),
          key0
        ], null, true),
        consequent
      );
      node.alternate = ctx.createAssignmentNode(
        node.createMemberNode([
          node.createIdentifierNode(result, null, true),
          key1
        ], null, true),
        alternate
      );
      ctx.insertNodeBlockContextAt(node);
      return node.createMemberNode([
        node.createIdentifierNode(result, null, true),
        node.createIdentifierNode(assignName, null, true)
      ], null, true);
    }
    function check(ctx, stack) {
      if (stack.isConditionalExpression) {
        return check(ctx, stack.consequent) || check(ctx, stack.alternate);
      }
      const type = ctx.inferType(stack);
      return ctx.isAddressRefsType(type, stack);
    }
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
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
    module2.exports = function(ctx, stack) {
      const node = ctx.createToken(stack);
      node.label = node.createToken(stack.label);
      return node;
    };
  }
});

// tokens/Declarator.js
var require_Declarator = __commonJS({
  "tokens/Declarator.js"(exports2, module2) {
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack, "Identifier");
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
    module2.exports = function(ctx, stack, type) {
      const module3 = stack.module;
      const polyfillModule = ctx.builder.getPolyfillModule(module3.getName());
      if (!polyfillModule) {
        return null;
      }
      const node = new ClassBuilder2(stack, ctx, type);
      const content = polyfillModule.content;
      if (!node.checkSyntaxPresetForClass()) {
        return null;
      }
      const ns = ctx.builder.getModuleNamespace(module3);
      if (ns) {
        node.namespace = node.createIdentifierNode(ns);
      }
      node.key = node.createIdentifierNode(polyfillModule.export || module3.id);
      node.comment = polyfillModule.comment ? node.createChunkNode(polyfillModule.comment) : null;
      polyfillModule.require.forEach((name) => {
        const module4 = stack.getModuleById(name);
        if (module4) {
          node.addDepend(module4);
        } else {
          node.error(`the '${name}' dependency does not exist`);
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
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
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
    function createStatementMember(ctx, members) {
      const items = [];
      const values = [];
      members.forEach((item) => {
        const node = ctx.createNode("PropertyDefinition");
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
        const caseNode = ctx.createNode("SwitchCase");
        caseNode.condition = caseNode.createLiteralNode(item.init.value());
        caseNode.consequent = [
          caseNode.createReturnNode(caseNode.createLiteralNode(item.key.value()))
        ];
        values.push(caseNode);
      });
      return [items, values];
    }
    var ClassBuilder2 = require_ClassBuilder();
    module2.exports = function(ctx, stack, type) {
      if (stack.parentStack.isPackageDeclaration) {
        const node = new ClassBuilder2(stack, ctx, "ClassDeclaration");
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
        const mtehod = node.createMethodNode(node.createIdentifierNode("getLabelByValue"), (ctx2) => {
          const node2 = ctx2.createNode("SwitchStatement");
          node2.condition = node2.createIdentifierNode("value", null, true);
          node2.cases = values.map((item) => {
            item.parent = node2;
            return item;
          });
          ctx2.body.push(node2);
        }, [node.createIdentifierNode("value", null, true)]);
        mtehod.static = mtehod.createIdentifierNode("static");
        mtehod.modifier = mtehod.createIdentifierNode("public");
        node.body.push(mtehod);
        return node;
      } else {
        const name = stack.value();
        const keys = [];
        const values = [];
        stack.properties.forEach((item) => {
          keys.push(ctx.createPropertyNode(ctx.createLiteralNode(item.key.value()), ctx.createLiteralNode(item.init.value())));
          values.push(ctx.createPropertyNode(ctx.createLiteralNode(String(item.init.value())), ctx.createLiteralNode(item.key.value())));
        });
        const transform = ctx.createNode(stack, "TypeTransformExpression");
        transform.typeName = "object";
        transform.expression = transform.createObjectNode(values.concat(keys));
        return ctx.createStatementNode(
          ctx.createAssignmentNode(
            ctx.createIdentifierNode(name, null, true),
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
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
      node.key = node.createToken(stack.key);
      node.init = node.createToken(stack.init);
      return node;
    };
  }
});

// tokens/ExportAllDeclaration.js
var require_ExportAllDeclaration = __commonJS({
  "tokens/ExportAllDeclaration.js"(exports2, module2) {
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
      node.exported = node.createToken(stack.exported);
      const compilation = stack.getResolveCompilation();
      if (compilation && compilation.stack) {
        const resolve = stack.getResolveFile();
        const source = ctx.builder.getModuleImportSource(resolve, stack.compilation.file);
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
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
      node.declaration = node.createToken(stack.declaration);
      return node;
    };
  }
});

// tokens/ExportNamedDeclaration.js
var require_ExportNamedDeclaration = __commonJS({
  "tokens/ExportNamedDeclaration.js"(exports2, module2) {
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
      node.specifiers = stack.specifiers ? stack.specifiers.map((item) => node.createToken(item)) : null;
      node.declaration = node.createToken(stack.declaration);
      if (stack.source) {
        const compilation = stack.getResolveCompilation();
        if (compilation) {
          const resolve = stack.getResolveFile();
          const source = ctx.builder.getModuleImportSource(resolve, stack.compilation.file);
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
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
      node.exported = node.createIdentifierNode(stack.exported.value(), stack.exported);
      node.local = node.createToken(stack.local);
      return node;
    };
  }
});

// tokens/ExpressionStatement.js
var require_ExpressionStatement = __commonJS({
  "tokens/ExpressionStatement.js"(exports2, module2) {
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
      node.expression = node.createToken(stack.expression);
      return node;
    };
  }
});

// tokens/ForInStatement.js
var require_ForInStatement = __commonJS({
  "tokens/ForInStatement.js"(exports2, module2) {
    var Transform2 = require_Transform();
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
      node.right = node.createToken(stack.right);
      const type = ctx.inferType(stack.right);
      if (type.isAnyType || type.toString() === "string") {
        node.right = Transform2.get("Object").keys(ctx, null, [node.right], true, false);
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
    function createConditionNode(ctx, obj, refs) {
      const assignment = ctx.createNode("AssignmentPattern");
      assignment.left = assignment.createIdentifierNode(refs, null, true);
      assignment.right = assignment.createTypeTransformNode("object", assignment.createCalleeNode(
        assignment.createMemberNode([
          assignment.createIdentifierNode(obj, null, true),
          assignment.createIdentifierNode("next")
        ]),
        []
      ));
      const init = ctx.createIdentifierNode(obj, null, true);
      const next = ctx.createParenthesNode(assignment);
      const done = ctx.createNode("UnaryExpression");
      done.prefix = true;
      done.operator = "!";
      done.argument = ctx.createMemberNode([
        assignment.createIdentifierNode(refs, null, true),
        assignment.createIdentifierNode("done")
      ]);
      const logical = ctx.createNode("LogicalExpression");
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
    function createAddressRefsNode(addressRefObject, ctx, desc2, value, stack) {
      const index = addressRefObject.add(stack);
      const name = addressRefObject.getName(desc2);
      const left = addressRefObject.createIndexName(desc2);
      const key = ctx.createAssignmentNode(
        ctx.createIdentifierNode(left, null, true),
        ctx.createLiteralNode(index)
      );
      key.computed = true;
      ctx.addVariableRefs(stack, left);
      return ctx.createAssignmentNode(
        ctx.createIdentifierNode(name, null, true),
        ctx.createObjectNode([
          ctx.createPropertyNode(key, value)
        ])
      );
    }
    module2.exports = function(ctx, stack) {
      var type = ctx.inferType(stack.right);
      if (!(type.isLiteralArrayType || type.isTupleType || type === ctx.builder.getGlobalModuleById("array") || ctx.isArrayMappingType(stack.compiler.callUtils("getOriginType", type)))) {
        const node2 = ctx.createNode(stack, "ForStatement");
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
              ctx.createIdentifierNode(node2.getModuleReferenceName(SystemModule)),
              ctx.createIdentifierNode("getIterator")
            ]),
            [
              init.createToken(stack.right)
            ]
          )
        );
        const rewind = ctx.createCalleeNode(
          ctx.createMemberNode([
            ctx.createIdentifierNode(obj, null, true),
            ctx.createIdentifierNode("rewind")
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
      const node = ctx.createNode(stack);
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
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
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
    module2.exports = function(ctx, stack, type) {
      const node = FunctionExpression(ctx, stack, type);
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
    module2.exports = function(ctx, stack) {
      if (!stack.parentStack.isMemberExpression && stack.value() === "arguments") {
        return ctx.createCalleeNode(ctx.createIdentifierNode("func_get_args"));
      }
      let desc2 = null;
      if (stack.parentStack.isMemberExpression) {
        if (stack.parentStack.object === stack) {
          desc2 = stack.description();
        }
      } else {
        desc2 = stack.description();
      }
      const builder = ctx.builder;
      if (desc2 && (desc2.isPropertyDefinition || desc2.isMethodDefinition)) {
        const ownerModule = desc2.module;
        const isStatic = !!(desc2.static || ownerModule.static);
        const inMember = stack.parentStack.isMemberExpression;
        let propertyName = stack.value();
        if (!inMember && (desc2.isMethodGetterDefinition || desc2.isMethodSetterDefinition)) {
          propertyName = ctx.getAccessorName(stack.value(), desc2, desc2.isMethodGetterDefinition ? "get" : "set");
        }
        let propertyNode = null;
        if (isStatic) {
          propertyNode = ctx.createStaticMemberNode([
            ctx.createIdentifierNode(builder.getModuleNamespace(ownerModule)),
            ctx.createIdentifierNode(propertyName, stack)
          ]);
        } else {
          propertyNode = ctx.createMemberNode([
            ctx.createThisNode(),
            ctx.createIdentifierNode(propertyName, stack)
          ]);
        }
        if (!inMember && !stack.parentStack.isAssignmentExpression && desc2.isMethodGetterDefinition) {
          return ctx.createCalleeNode(propertyNode);
        }
        return propertyNode;
      }
      if (stack.compiler.callUtils("isTypeModule", desc2)) {
        ctx.addDepend(desc2);
        if (stack.parentStack.isMemberExpression && stack.parentStack.object === stack || stack.parentStack.isNewExpression && !globals.includes(desc2.getName()) || stack.parentStack.isBinaryExpression && stack.parentStack.right === stack && stack.parentStack.node.operator === "instanceof") {
          return ctx.createIdentifierNode(ctx.getModuleReferenceName(desc2), stack);
        } else {
          return ctx.createClassRefsNode(desc2, stack);
        }
      }
      var isDeclarator = desc2 && (desc2.isDeclarator || desc2.isProperty && (desc2.parentStack.isObjectPattern || desc2.parentStack.isObjectExpression));
      if (isDeclarator) {
        if (desc2.parentStack.isImportDeclaration) {
          const resolve = desc2.parentStack.getResolveFile();
          const system = ctx.builder.getGlobalModuleById("System");
          ctx.addDepend(system);
          const node = ctx.createCalleeNode(
            ctx.createStaticMemberNode([
              ctx.createIdentifierNode(ctx.getModuleReferenceName(system)),
              ctx.createIdentifierNode("getScopeVariable")
            ]),
            [
              ctx.createLiteralNode(ctx.builder.createScopeId(stack.compilation, resolve)),
              ctx.createLiteralNode(stack.value())
            ]
          );
          return node;
        } else if (desc2.parentStack.isAnnotationDeclaration) {
          const annotation = desc2.parentStack;
          const name = annotation.name.toLowerCase();
          if (name === "require" || name === "import") {
            const argument = annotation.getArguments().find((item) => !!item.resolveFile);
            return ctx.createLiteralNode(ctx.builder.getAssetFileReferenceName(ctx.module, argument.resolveFile), void 0, stack);
          }
        } else {
          ctx.addVariableRefs(desc2);
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
          ctx.addVariableRefs(desc2);
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
          const assignAddress = ctx.getAssignAddressRef(desc2);
          if (assignAddress) {
            const name = assignAddress.getName(desc2) || stack.value();
            const index = assignAddress.createIndexName(desc2);
            if (index) {
              return ctx.createMemberNode([
                ctx.createIdentifierNode(name, null, true),
                ctx.createIdentifierNode(index, null, true)
              ], null, true);
            }
          }
        }
      }
      return ctx.createIdentifierNode(stack.value(), stack, isDeclarator);
    };
  }
});

// tokens/IfStatement.js
var require_IfStatement = __commonJS({
  "tokens/IfStatement.js"(exports2, module2) {
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
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
    var path2 = require("path");
    module2.exports = function(ctx, stack, type) {
      if (stack.source && stack.source.isLiteral) {
        const compilation = stack.getResolveCompilation();
        if (!compilation)
          return null;
        const resolve = stack.getResolveFile();
        const info = path2.parse(resolve);
        const source = ctx.builder.getModuleImportSource(resolve, ctx.module || stack.compilation.file);
        const specifiers = stack.specifiers.map((item) => ctx.createToken(item));
        ctx.builder.make(compilation, compilation.stack);
        if (specifiers.length > 0) {
          const namespaceSpecifier = specifiers.length === 1 && specifiers[0].type === "ImportNamespaceSpecifier" ? specifiers[0] : null;
          if (namespaceSpecifier) {
            const node = ctx.createImportNode(source, [[namespaceSpecifier.local.value]], stack);
            return node;
          } else {
            let name = info.name.replace(/[.-]/g, "_");
            if (/^\d+/.test(info.name)) {
              name = "_" + name;
            }
            const refs = ctx.checkRefsName(name, true);
            const node = ctx.createImportNode(source, [[refs]], stack);
            const top = ctx.getTopBlockContext();
            const body = top.initBeforeBody || top.beforeBody || top.body;
            const isDefaultGlobal = specifiers.length === 1 && specifiers[0].type === "ImportDefaultSpecifier";
            specifiers.forEach((item) => {
              let name2 = item.local.value;
              if (item.type === "ImportNamespaceSpecifier") {
                body.push(
                  node.createStatementNode(
                    node.createAssignmentNode(
                      node.createIdentifierNode(name2, null, true),
                      node.createIdentifierNode(refs, true, true)
                    )
                  )
                );
              } else {
                let imported = "default";
                if (item.type !== "ImportDefaultSpecifier") {
                  imported = item.imported.value;
                }
                const system = ctx.builder.getGlobalModuleById("System");
                ctx.addDepend(system);
                const registerScopeVariables = node.createCalleeNode(
                  node.createStaticMemberNode([
                    node.createIdentifierNode(node.getModuleReferenceName(system)),
                    node.createIdentifierNode("registerScopeVariables")
                  ]),
                  [
                    node.createLiteralNode(ctx.builder.createScopeId(stack.compilation, resolve)),
                    node.createLiteralNode(name2),
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
        return ctx.createImportNode(source, specifiers, stack);
      } else {
        const classModule = stack.description();
        if (classModule && ctx.isActiveForModule(classModule)) {
          const compilation = classModule.compilation;
          ctx.builder.buildForModule(compilation, compilation.stack, classModule);
          const source = ctx.builder.getModuleImportSource(classModule, stack.compilation.file);
          const node = ctx.createImportNode(source);
          const name = stack.alias ? stack.alias.value() : classModule.id;
          if (name !== classModule.id) {
            node.insertNodeBlockContextTop(
              node.createUsingStatementNode(
                node.createImportSpecifierNode(
                  name,
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
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
      node.local = stack.local ? node.createToken(stack.local) : node.createIdentifierNode(stack.value(), stack);
      return node;
    };
  }
});

// tokens/ImportExpression.js
var require_ImportExpression = __commonJS({
  "tokens/ImportExpression.js"(exports2, module2) {
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
      node.source = node.createToken(stack.source);
      return node;
    };
  }
});

// tokens/ImportNamespaceSpecifier.js
var require_ImportNamespaceSpecifier = __commonJS({
  "tokens/ImportNamespaceSpecifier.js"(exports2, module2) {
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
      node.local = stack.local ? node.createToken(stack.local) : node.createIdentifierNode(stack.value(), stack);
      return node;
    };
  }
});

// tokens/ImportSpecifier.js
var require_ImportSpecifier = __commonJS({
  "tokens/ImportSpecifier.js"(exports2, module2) {
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
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
    module2.exports = function(ctx, stack, type) {
      return ClassBuilder2.createClassNode(stack, ctx, type);
    };
  }
});

// tokens/JSXAttribute.js
var require_JSXAttribute = __commonJS({
  "tokens/JSXAttribute.js"(exports2, module2) {
    module2.exports = function(ctx, stack) {
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
      const node = ctx.createNode(stack);
      node.namespace = ns;
      let name = ctx.createToken(stack.name);
      let value = stack.value ? ctx.createToken(stack.value) : ctx.createLiteralNode(true);
      if (stack.isMemberProperty) {
        const eleClass = stack.jsxElement.getSubClassDescription();
        const propsDesc = stack.getAttributeDescription(eleClass);
        const annotations = propsDesc && propsDesc.annotations;
        const annotation = annotations && annotations.find((annotation2) => annotation2.name.toLowerCase() === "alias");
        if (annotation) {
          const [named] = annotation.getArguments();
          if (named) {
            if (named.isObjectPattern) {
              name = named.extract[0].value;
            } else {
              name = named.value;
            }
            name = ctx.createIdentifierNode(name);
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
            const objectType = ctx.builder.getGlobalModuleById("Object");
            has = objectType && objectType.is(stack.value.expression.object.type());
          }
        }
        if (!has) {
          stack.value.error(1e4, stack.value.value());
        }
      }
      node.name = name;
      node.value = value;
      return node;
    };
  }
});

// tokens/JSXCdata.js
var require_JSXCdata = __commonJS({
  "tokens/JSXCdata.js"(exports2, module2) {
    module2.exports = function(ctx, stack) {
      let value = stack.value();
      if (value) {
        value = value.replace(/[\r\n]+/g, "").replace(/\u0022/g, '\\"');
        if (value) {
          return ctx.createLiteralNode(value);
        }
      }
      return null;
    };
  }
});

// tokens/JSXClosingElement.js
var require_JSXClosingElement = __commonJS({
  "tokens/JSXClosingElement.js"(exports2, module2) {
    module2.exports = function(ctx, stack) {
      return ctx.createNode(stack);
    };
  }
});

// tokens/JSXClosingFragment.js
var require_JSXClosingFragment = __commonJS({
  "tokens/JSXClosingFragment.js"(exports2, module2) {
    module2.exports = function(ctx, stack) {
      return ctx.createNode(stack);
    };
  }
});

// tokens/JSXElement.js
var require_JSXElement = __commonJS({
  "tokens/JSXElement.js"(exports2, module2) {
    var JSXTransform2 = require_JSXTransform();
    var instances = /* @__PURE__ */ new Map();
    function getTransform(root, ctx) {
      if (instances.has(root)) {
        return instances.get(root);
      }
      const obj = new JSXTransform2(root, ctx);
      instances.set(root, obj);
      return obj;
    }
    function JSXElement(ctx, stack) {
      const obj = getTransform(stack, ctx);
      return obj.create(stack);
    }
    JSXElement.getTransform = getTransform;
    module2.exports = JSXElement;
  }
});

// tokens/JSXEmptyExpression.js
var require_JSXEmptyExpression = __commonJS({
  "tokens/JSXEmptyExpression.js"(exports2, module2) {
    module2.exports = function(ctx, stack) {
      return null;
    };
  }
});

// tokens/JSXExpressionContainer.js
var require_JSXExpressionContainer = __commonJS({
  "tokens/JSXExpressionContainer.js"(exports2, module2) {
    var JSXElement = require_JSXElement();
    module2.exports = function(ctx, stack) {
      if (stack.parentStack.isSlot && stack.expression && !stack.expression.isJSXElement) {
        const name = stack.parentStack.openingElement.name.value();
        return JSXElement.createElementNode(
          ctx,
          ctx.createLiteralNode("span"),
          ctx.createObjectNode([
            ctx.createPropertyNode(
              ctx.createIdentifier("slot"),
              ctx.createLiteralNode(name)
            )
          ]),
          ctx.createToken(stack.expression)
        );
      }
      return ctx.createToken(stack.expression);
    };
  }
});

// tokens/JSXFragment.js
var require_JSXFragment = __commonJS({
  "tokens/JSXFragment.js"(exports2, module2) {
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
      node.children = stack.children.map((child) => node.createToken(child));
      return node;
    };
  }
});

// tokens/JSXIdentifier.js
var require_JSXIdentifier = __commonJS({
  "tokens/JSXIdentifier.js"(exports2, module2) {
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack, "Identifier");
      node.value = stack.value();
      node.raw = node.value;
      return node;
    };
  }
});

// tokens/JSXMemberExpression.js
var require_JSXMemberExpression = __commonJS({
  "tokens/JSXMemberExpression.js"(exports2, module2) {
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
      node.object = node.createToken(stack.object);
      node.property = node.createToken(stack.property);
      return node;
    };
  }
});

// tokens/JSXNamespacedName.js
var require_JSXNamespacedName = __commonJS({
  "tokens/JSXNamespacedName.js"(exports2, module2) {
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
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
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
      node.attributes = stack.attributes.map((attr) => node.createToken(attr));
      if (stack.parentStack.isComponent) {
        const desc2 = stack.parentStack.description();
        if (desc2) {
          if (stack.hasNamespaced && desc2.isFragment) {
            node.name = node.createIdentifierNode(desc2.id, stack.name);
          } else {
            node.name = node.createIdentifierNode(ctx.builder.getModuleReferenceName(desc2), stack.name);
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
    module2.exports = function(ctx, stack) {
      return ctx.createNode(stack);
    };
  }
});

// tokens/JSXScript.js
var require_JSXScript = __commonJS({
  "tokens/JSXScript.js"(exports2, module2) {
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
      node.openingElement = node.createToken(stack.openingElement);
      node.body = (stack.body || []).map((child) => node.createToken(child));
    };
  }
});

// tokens/JSXSpreadAttribute.js
var require_JSXSpreadAttribute = __commonJS({
  "tokens/JSXSpreadAttribute.js"(exports2, module2) {
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
      node.argument = node.createToken(stack.argument);
      return node;
    };
  }
});

// tokens/JSXStyle.js
var require_JSXStyle = __commonJS({
  "tokens/JSXStyle.js"(exports2, module2) {
    module2.exports = function(ctx, stack) {
      return null;
    };
  }
});

// tokens/JSXText.js
var require_JSXText = __commonJS({
  "tokens/JSXText.js"(exports2, module2) {
    module2.exports = function(ctx, stack) {
      let value = stack.value();
      if (value) {
        value = value.replace(/[\r\n]+/g, "").replace(/\u0022/g, '\\"');
        if (value) {
          return ctx.createLiteralNode(value);
        }
      }
      return null;
    };
  }
});

// tokens/LabeledStatement.js
var require_LabeledStatement = __commonJS({
  "tokens/LabeledStatement.js"(exports2, module2) {
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
      node.label = node.createIdentifierNode(stack.label.value(), stack.label);
      node.body = node.createToken(stack.body);
      return node;
    };
  }
});

// tokens/Literal.js
var require_Literal = __commonJS({
  "tokens/Literal.js"(exports2, module2) {
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
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
        ctx.addDepend(type.inherit);
        let pattern = node.raw.trim();
        let index = node.raw.lastIndexOf("/");
        if (pattern.charCodeAt(0) !== 47 || !(index > 0)) {
          throw new Error("Invalid regexp " + pattern);
        } else {
          let glog = pattern.slice(index + 1);
          pattern = pattern.slice(1, index);
          const args = [pattern, glog].filter((item) => !!item);
          const newNode = ctx.createNewNode(
            ctx.createIdentifierNode(ctx.getModuleReferenceName(type.inherit)),
            args.map((item) => ctx.createLiteralNode(item))
          );
          if (stack.parentStack.isMemberExpression) {
            return ctx.createParenthesNode(newNode);
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
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
      const isAnd = stack.node.operator.charCodeAt(0) === 38;
      const isBoolean = isBooleanExpression(stack);
      if (!isBoolean) {
        const needRefs = !stack.parentStack.isSwitchCase;
        const type = ctx.inferType(stack.left);
        const createRefs = !isAnd && !stack.left.isIdentifier;
        let refs = null;
        if (needRefs) {
          let left = ctx.createToken(stack.left);
          let right = ctx.createToken(stack.right);
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
          if (node.isPassableReferenceExpress(stack.right, ctx.inferType(stack.right))) {
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
            node.insertNodeBlockContextAt(ctx.createAssignmentNode(
              node.createMemberNode([
                node.createIdentifierNode(result, null, true),
                key0
              ], null, true),
              node.createLiteralNode(null)
            ));
            let consequent = ctx.createAssignmentNode(
              node.createMemberNode([
                node.createIdentifierNode(result, null, true),
                key1
              ], null, true),
              right
            );
            let alternate = null;
            if (!isAnd) {
              alternate = consequent;
              consequent = ctx.createAssignmentNode(
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
    function trans(ctx, stack, description, aliasAnnotation, objectType) {
      const type = objectType;
      let name = ctx.builder.getAvailableOriginType(type) || type.toString();
      if (objectType && (objectType.isUnionType || objectType.isIntersectionType) && description && description.isMethodDefinition && description.module && description.module.isModule) {
        name = description.module.id;
      }
      if (Transform2.has(name)) {
        const object = Transform2.get(name);
        const key = stack.computed ? "$computed" : stack.property.value();
        if (Object.prototype.hasOwnProperty.call(object, key)) {
          if (stack.computed) {
            return object[key](
              ctx,
              ctx.createToken(stack.object),
              [ctx.createToken(stack.property)],
              false,
              false
            );
          }
          if (description.static) {
            return object[key](
              ctx,
              null,
              [],
              false,
              true
            );
          } else {
            return object[key](
              ctx,
              ctx.createToken(stack.object),
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
        const args = result.getArguments();
        if (args[0])
          return args[0].value;
      }
      return null;
    }
    function MemberExpression(ctx, stack) {
      const module3 = stack.module;
      const description = stack.description();
      let computed = false;
      if (description && description.isModule && stack.compiler.callUtils("isTypeModule", description)) {
        ctx.addDepend(description);
        if (stack.parentStack.isMemberExpression || stack.parentStack.isNewExpression || stack.parentStack.isCallExpression) {
          return ctx.createIdentifierNode(ctx.getModuleReferenceName(description, module3), stack);
        } else {
          return ctx.createClassRefsNode(description, stack);
        }
      }
      var objCtx = stack.object.getContext();
      var objectType = ctx.inferType(stack.object, objCtx);
      var objectDescription = stack.object.description();
      var rawObjectType = objectType;
      var isWrapType = false;
      if (objectType.isClassGenericType && objectType.inherit.isAliasType) {
        objectType = ctx.inferType(objectType.inherit.inherit.type(), objCtx);
        isWrapType = true;
      }
      if (objectType.isNamespace && !stack.parentStack.isMemberExpression) {
        const mappingNs = ctx.builder.geMappingNamespace(stack.value());
        if (mappingNs !== null) {
          return mappingNs ? ctx.createIdentifierNode(mappingNs + "\\" + stack.property.value(), stack.property) : ctx.createToken(stack.property);
        }
        return ctx.createIdentifierNode("\\" + stack.value().replace(/\./g, "\\"));
      }
      if (description && description.isType && description.isAnyType) {
        let isReflect = !!objectType.isAnyType;
        const hasDynamic = description.isComputeType && description.isPropertyExists();
        if (!hasDynamic && !stack.compiler.callUtils("isLiteralObjectType", objectType)) {
          isReflect = true;
        }
        if (isReflect) {
          const Reflect2 = stack.getGlobalTypeById("Reflect");
          ctx.addDepend(Reflect2);
          return ctx.createCalleeNode(
            ctx.createStaticMemberNode([
              ctx.createIdentifierNode(ctx.getModuleReferenceName(Reflect2)),
              ctx.createIdentifierNode("get")
            ]),
            [
              ctx.createClassRefsNode(module3),
              ctx.createToken(stack.object),
              stack.computed ? ctx.createToken(stack.property) : ctx.createLiteralNode(stack.property.value(), void 0, stack.property)
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
        const result = trans(ctx, stack, description, aliasAnnotation, objectType);
        if (result)
          return result;
        const members = [
          ctx.createToken(stack.object),
          ctx.createIdentifierNode(ctx.getAccessorName(aliasAnnotation || stack.property.value(), description, description.isMethodGetterDefinition ? "get" : "set"))
        ];
        const callee = isStatic ? ctx.createStaticMemberNode(members, stack) : ctx.createMemberNode(members, stack);
        return description.isMethodGetterDefinition ? ctx.createCalleeNode(callee, [], stack) : callee;
      } else if (description && description.isMethodDefinition) {
        aliasAnnotation = getAliasAnnotation(description);
        const result = trans(ctx, stack, description, aliasAnnotation, objectType);
        if (result)
          return result;
        if (!stack.parentStack.isCallExpression && !stack.parentStack.isMemberExpression) {
          return ctx.createArrayNode([
            ctx.createToken(stack.object),
            ctx.createLiteralNode(aliasAnnotation || stack.property.value())
          ]);
        }
        const pStack = stack.getParentStack((stack2) => !!(stack2.jsxElement || stack2.isBlockStatement || stack2.isCallExpression || stack2.isExpressionStatement));
        if (pStack && pStack.jsxElement) {
          const System = stack.getGlobalTypeById("System");
          ctx.addDepend(System);
          return ctx.createCalleeNode(
            ctx.createStaticMemberNode([
              ctx.createIdentifierNode(ctx.getModuleReferenceName(System)),
              ctx.createIdentifierNode("bind")
            ]),
            [
              ctx.createArrayNode([
                ctx.createToken(stack.object),
                ctx.createLiteralNode(aliasAnnotation || stack.property.value(), void 0, stack.property)
              ]),
              ctx.createThisNode()
            ]
          );
        }
        isMember = true;
      } else if (description && description.isPropertyDefinition) {
        aliasAnnotation = getAliasAnnotation(description);
        const result = trans(ctx, stack, description, aliasAnnotation, objectType);
        if (result)
          return result;
        isMember = true;
      }
      const node = ctx.createNode(stack);
      node.computed = computed;
      if (aliasAnnotation) {
        propertyNode = node.createIdentifierNode(aliasAnnotation, stack.property);
      }
      if (stack.computed) {
        const result = trans(ctx, stack, description, aliasAnnotation, objectType);
        if (result)
          return result;
        if (!isStatic && rawObjectType && ctx.isArrayAccessor(rawObjectType)) {
          node.computed = true;
        } else if (rawObjectType) {
          node.computed = !ctx.isObjectAccessor(rawObjectType);
        }
      } else if (stack.object.isNewExpression) {
        objectNode = node.createParenthesNode(node.createToken(stack.object));
      } else if (!isStatic && rawObjectType && ctx.isArrayAccessor(rawObjectType)) {
        node.computed = true;
        propertyNode = node.createLiteralNode(stack.property.value(), void 0, stack.property);
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
    module2.exports = function(ctx, stack, type) {
      const node = FunctionDeclaration(ctx, stack, type);
      node.async = stack.expression.async ? true : false;
      node.static = stack.static ? ctx.createIdentifierNode("static") : null;
      node.final = stack.final ? ctx.createIdentifierNode("final") : null;
      node.modifier = ctx.createIdentifierNode(ctx.compiler.callUtils("getModifierValue", stack));
      node.kind = "method";
      return node;
    };
  }
});

// tokens/MethodGetterDefinition.js
var require_MethodGetterDefinition = __commonJS({
  "tokens/MethodGetterDefinition.js"(exports2, module2) {
    var MethodDefinition = require_MethodDefinition();
    module2.exports = module2.exports = function(ctx, stack, type) {
      const node = MethodDefinition(ctx, stack, type);
      node.isAccessor = true;
      node.kind = "get";
      node.key.value = ctx.getAccessorName(node.key.value, stack, "get");
      return node;
    };
  }
});

// tokens/MethodSetterDefinition.js
var require_MethodSetterDefinition = __commonJS({
  "tokens/MethodSetterDefinition.js"(exports2, module2) {
    var MethodDefinition = require_MethodDefinition();
    module2.exports = module2.exports = function(ctx, stack, type) {
      const node = MethodDefinition(ctx, stack, type);
      node.isAccessor = true;
      node.kind = "set";
      node.key.value = ctx.getAccessorName(node.key.value, stack, "set");
      return node;
    };
  }
});

// tokens/NewExpression.js
var require_NewExpression = __commonJS({
  "tokens/NewExpression.js"(exports2, module2) {
    var Transform2 = require_Transform();
    function createArgumentNodes(ctx, stack, arguments, declareParams) {
      return arguments.map((item, index) => {
        const node = ctx.createToken(item);
        if (declareParams && declareParams[index] && !item.isIdentifier) {
          const declareParam = declareParams[index];
          if (!(declareParam.isRestElement || declareParam.isObjectPattern || declareParam.isArrayPattern)) {
            if (ctx.isAddressRefsType(declareParam.type())) {
              const name = ctx.checkRefsName("arg");
              ctx.insertNodeBlockContextAt(
                ctx.createAssignmentNode(ctx.createIdentifierNode(name, null, true), node)
              );
              return ctx.createIdentifierNode(name, null, true);
            }
          }
        }
        return node;
      });
    }
    module2.exports = function(ctx, stack) {
      let type = stack.callee.type();
      let [classModule, desc2] = stack.getConstructMethod(type);
      let wrapType = null;
      if (desc2 && desc2.isNewDefinition && desc2.module) {
        type = desc2.module;
      }
      if (type) {
        type = stack.compiler.callUtils("getOriginType", type);
        if (stack.compiler.callUtils("isTypeModule", type)) {
          ctx.addDepend(type);
        }
        if (type === ctx.builder.getGlobalModuleById("Array")) {
          return Transform2.get("Array").of(
            ctx,
            null,
            createArgumentNodes(ctx, stack, stack.arguments, desc2 && desc2.params),
            true,
            false
          );
        }
        if (type === ctx.builder.getGlobalModuleById("String")) {
          wrapType = "String";
        } else if (type === ctx.builder.getGlobalModuleById("Number")) {
          wrapType = "Number";
        } else if (type === ctx.builder.getGlobalModuleById("Boolean")) {
          wrapType = "Boolean";
        } else if (type === ctx.builder.getGlobalModuleById("Object")) {
          wrapType = "Object";
        }
      }
      if (!type || !type.isModule || wrapType) {
        const Reflect2 = stack.getGlobalTypeById("Reflect");
        const node2 = ctx.createNode(stack);
        node2.addDepend(Reflect2);
        let target = node2.createToken(stack.callee);
        if (!wrapType && !stack.callee.isIdentifier) {
          const refs = node2.checkRefsName("ref");
          ctx.insertNodeBlockContextAt(
            ctx.createAssignmentNode(ctx.createIdentifierNode(refs, null, true), target)
          );
          target = ctx.createIdentifierNode(refs, null, true);
        }
        return node2.createCalleeNode(
          node2.createStaticMemberNode([
            node2.createIdentifierNode(node2.getModuleReferenceName(Reflect2)),
            node2.createIdentifierNode("construct")
          ]),
          [
            stack.module ? node2.createClassRefsNode(stack.module) : node2.createLiteralNode(null),
            target,
            node2.createArrayNode(createArgumentNodes(ctx, stack, stack.arguments || [], desc2 && desc2.params), stack)
          ],
          stack
        );
      }
      const node = ctx.createNode(stack);
      node.callee = node.createToken(stack.callee);
      if (stack.callee.isParenthesizedExpression) {
        const name = ctx.checkRefsName("_refClass");
        node.insertNodeBlockContextAt(ctx.createAssignmentNode(ctx.createIdentifierNode(name, null, true), node.callee.expression));
        node.callee = ctx.createIdentifierNode(name, null, true);
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
      merge(ctx, object, args) {
        const _System = ctx.builder.getGlobalModuleById("System");
        ctx.addDepend(_System);
        let target = object;
        if (object.type !== "Identifier") {
          const refs = ctx.checkRefsName("ref");
          ctx.insertNodeBlockContextAt(
            ctx.createAssignmentNode(ctx.createIdentifierNode(refs, null, true), object)
          );
          target = ctx.createIdentifierNode(refs, null, true);
        }
        return ctx.createCalleeNode(
          ctx.createStaticMemberNode([
            ctx.createIdentifierNode(ctx.getModuleReferenceName(_System)),
            ctx.createIdentifierNode("merge")
          ]),
          [target].concat(args)
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
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
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
          segs.push(ctx.createObjectNode(node.properties.slice(start, end)));
          segs.push(node.properties[end]);
          start = end + 1;
        }
        if (start < node.properties.length) {
          if (node.properties.length === 1) {
            segs.push(node.properties[0]);
          } else {
            segs.push(ctx.createObjectNode(node.properties.slice(start, node.properties.length)));
          }
        }
        return _System.merge(ctx, ctx.createArrayNode(), segs);
      }
      return node;
    };
  }
});

// tokens/ObjectPattern.js
var require_ObjectPattern = __commonJS({
  "tokens/ObjectPattern.js"(exports2, module2) {
    function createRefs(ctx, target, expression) {
      const name = ctx.getDeclareRefsName(target, "S");
      const refNode = ctx.createDeclarationNode("const", [
        ctx.createDeclaratorNode(
          ctx.createIdentifierNode(name),
          ctx.createTypeTransformNode("object", expression)
        )
      ]);
      ctx.insertNodeBlockContextAt(refNode);
    }
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
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
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
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
    module2.exports = function(ctx, stack) {
      if (stack.parentStack.isExpressionStatement) {
        return ctx.createToken(stack.expression);
      }
      if (stack.expression.isCallExpression && stack.expression.callee.isFunctionExpression) {
        return ctx.createToken(stack.expression);
      }
      const node = ctx.createNode(stack);
      node.expression = node.createToken(stack.expression);
      return node;
    };
  }
});

// tokens/Program.js
var require_Program = __commonJS({
  "tokens/Program.js"(exports2, module2) {
    var path2 = require("path");
    function createDependencies(stack, ctx, node, importExcludes) {
      const imports = [];
      const using = [];
      const plugin = ctx.plugin;
      const builder = ctx.builder;
      const importFlag = plugin.options.import;
      const consistent = plugin.options.consistent;
      const useFolderAsNamespace = plugin.options.resolve.useFolderAsNamespace;
      const usingExcludes = /* @__PURE__ */ new WeakSet();
      builder.getGlobalModules().forEach((module3) => {
        usingExcludes.add(module3);
      });
      const dependencies = node.getDependencies();
      const createUse = (depModule) => {
        if (!usingExcludes.has(depModule)) {
          const name = builder.getModuleNamespace(depModule, depModule.id);
          if (name) {
            let local = name;
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
              } else if (!(consistent || useFolderAsNamespace)) {
                const source = builder.getFileRelativeOutputPath(depModule);
                const name = builder.getModuleNamespace(depModule, depModule.id);
                builder.addFileAndNamespaceMapping(source, name);
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
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
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
                const refs = obj.checkRefsName(path2.parse(obj.source.value).name, true);
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
        const [imps, using] = createDependencies(stack, ctx, node, importExcludes);
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
    function getSpreadRefName(ctx, target) {
      let name = ctx.getWasRefsName(target, "S");
      if (!name) {
        name = ctx.getDeclareRefsName(target, "S");
        const refNode = ctx.createDeclarationNode("const", [
          ctx.createDeclaratorNode(
            ctx.createIdentifierNode(name),
            ctx.createTypeTransformNode("object", ctx.createToken(target))
          )
        ]);
        ctx.insertNodeBlockContextAt(refNode);
      }
      return ctx.createIdentifierNode(name, null, true);
    }
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
      node.computed = !!stack.computed;
      if (stack.parentStack.isObjectPattern) {
        const target = stack.parentStack.parentStack.init;
        let key = stack.value();
        let name = null;
        let value = null;
        if (stack.hasAssignmentPattern) {
          value = node.createToken(stack.init.right);
          name = stack.init.left.value();
        } else {
          value = node.createLiteralNode(null);
          name = stack.init.value();
        }
        if (target.isObjectExpression || target.isArrayExpression) {
          const init = target.attribute(key);
          return node.createStatementNode(
            node.createAssignmentNode(
              node.createIdentifierNode(name, null, true),
              init ? node.createBinaryNode("??", node.createToken(init.init), init.init.isLiteral ? node.createLiteralNode(null) : value) : value
            )
          );
        } else {
          const obj = getSpreadRefName(node, target);
          return node.createStatementNode(
            node.createAssignmentNode(
              node.createIdentifierNode(name, null, true),
              node.createBinaryNode("??", node.createMemberNode([
                obj,
                node.createIdentifierNode(key)
              ], null), value)
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
      if (stack.hasInit && ctx.isPassableReferenceExpress(stack.init, stack.type())) {
        if (stack.init.isCallExpression || stack.init.isAwaitExpression) {
          const name = ctx.getDeclareRefsName(stack.init, "R");
          const refNode = ctx.createDeclarationNode("const", [
            ctx.createDeclaratorNode(
              ctx.createIdentifierNode(name),
              ctx.creaateAddressRefsNode(node.init)
            )
          ]);
          ctx.insertNodeBlockContextAt(refNode);
          node.init = ctx.creaateAddressRefsNode(ctx.createIdentifierNode(name, null, true));
        } else {
          node.init = ctx.creaateAddressRefsNode(node.init);
        }
      }
      return node;
    };
  }
});

// tokens/PropertyDefinition.js
var require_PropertyDefinition = __commonJS({
  "tokens/PropertyDefinition.js"(exports2, module2) {
    module2.exports = function(ctx, stack) {
      const annotations = stack.annotations || [];
      var embeds = annotations.filter((item) => {
        return item.name.toLowerCase() === "embed";
      });
      var init = null;
      if (embeds.length > 0) {
        var items = [];
        embeds.forEach((embed) => {
          const args = embed.getArguments();
          args.forEach((item) => {
            if (item.resolveFile) {
              const value = ctx.builder.getAssetFileReferenceName(stack.module, item.resolveFile);
              items.push(value);
            }
          });
        });
        init = items.length > 1 ? ctx.createArrayNode(items.map((value) => ctx.createLiteralNode(value))) : ctx.createLiteralNode(items[0]);
      }
      const node = ctx.createNode(stack);
      node.declarations = (stack.declarations || []).map((item) => node.createToken(item));
      node.modifier = ctx.createIdentifierNode(stack.compiler.callUtils("getModifierValue", stack));
      if (stack.static && stack.kind === "const") {
        node.kind = stack.kind;
      } else if (stack.static) {
        node.static = ctx.createIdentifierNode("static");
      }
      node.key = node.declarations[0].id;
      node.init = init || node.declarations[0].init || ctx.createLiteralNode(null);
      return node;
    };
  }
});

// tokens/RestElement.js
var require_RestElement = __commonJS({
  "tokens/RestElement.js"(exports2, module2) {
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
      node.value = stack.value();
      node.raw = node.value;
      return node;
    };
  }
});

// tokens/ReturnStatement.js
var require_ReturnStatement = __commonJS({
  "tokens/ReturnStatement.js"(exports2, module2) {
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
      node.argument = node.createToken(stack.argument);
      return node;
    };
  }
});

// tokens/SequenceExpression.js
var require_SequenceExpression = __commonJS({
  "tokens/SequenceExpression.js"(exports2, module2) {
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
      node.expressions = stack.expressions.map((item) => node.createToken(item));
      return node;
    };
  }
});

// tokens/SpreadElement.js
var require_SpreadElement = __commonJS({
  "tokens/SpreadElement.js"(exports2, module2) {
    module2.exports = function(ctx, stack) {
      if (stack.parentStack.isArrayExpression) {
        const type = stack.argument.type();
        const _Array = stack.getGlobalTypeById("Array");
        const _array = stack.getGlobalTypeById("array");
        if (type && (type.isLiteralArrayType || type === _Array || type === _array)) {
          return ctx.createToken(stack.argument);
        }
        const _System = stack.getGlobalTypeById("System");
        ctx.addDepend(_System);
        const node2 = ctx.createCalleeNode(
          ctx.createStaticMemberNode([
            ctx.getModuleReferenceName(_System),
            ctx.createIdentifierNode("toArray")
          ]),
          [
            ctx.createToken(stack.argument)
          ]
        );
        return node2;
      } else if (stack.parentStack.isObjectExpression) {
        return ctx.createToken(stack.argument);
      }
      const node = ctx.createNode(stack);
      node.argument = node.createToken(stack.argument);
      return node;
    };
  }
});

// tokens/StructTableColumnDefinition.js
var require_StructTableColumnDefinition = __commonJS({
  "tokens/StructTableColumnDefinition.js"(exports2, module2) {
    function createNode(ctx, item) {
      if (!item)
        return null;
      return item.isIdentifier ? ctx.createIdentifierNode(item.value().toLowerCase(), item) : item.isLiteral ? ctx.createLiteralNode(item.value()) : ctx.createToken(item);
    }
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
      node.key = node.createIdentifierNode(stack.key.value(), stack.key);
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
    function createNode(ctx, item) {
      if (!item)
        return null;
      return item.isIdentifier ? ctx.createIdentifierNode(item.value().toLowerCase(), item) : item.isLiteral ? ctx.createLiteralNode(item.value()) : ctx.createToken(item);
    }
    function normalName(name) {
      return name.replace(/([A-Z])/g, (a, b, i) => {
        return i > 0 ? "_" + b.toLowerCase() : b.toLowerCase();
      });
    }
    module2.exports = function(ctx, stack) {
      const name = stack.module.getName();
      if (ctx.builder.hasSqlTableNode(name)) {
        return null;
      }
      const node = ctx.createNode(stack);
      node.id = node.createIdentifierNode(normalName(stack.id.value()), stack.id);
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
      node.builder.addSqlTableNode(name, node, stack);
      return null;
    };
  }
});

// tokens/StructTableKeyDefinition.js
var require_StructTableKeyDefinition = __commonJS({
  "tokens/StructTableKeyDefinition.js"(exports2, module2) {
    function createNode(ctx, item) {
      if (!item)
        return null;
      return item.isIdentifier ? ctx.createIdentifierNode(item.value().toLowerCase(), item) : item.isLiteral ? ctx.createLiteralNode(item.value()) : ctx.createToken(item);
    }
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
      node.key = createNode(node, stack.key);
      node.prefix = node.key.value === "primary" || node.key.value === "key" ? null : node.createIdentifierNode("key");
      node.local = node.createToken(stack.local);
      node.properties = (stack.properties || []).map((item) => createNode(node, item));
      return node;
    };
  }
});

// tokens/StructTableMethodDefinition.js
var require_StructTableMethodDefinition = __commonJS({
  "tokens/StructTableMethodDefinition.js"(exports2, module2) {
    function createNode(ctx, item) {
      if (!item)
        return null;
      return item.isIdentifier ? ctx.createIdentifierNode(item.value().toLowerCase(), item) : item.isLiteral ? ctx.createLiteralNode(item.value()) : ctx.createToken(item);
    }
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
      const key = stack.key.isMemberExpression ? stack.key.property : stack.key;
      node.key = createNode(node, key);
      node.params = (stack.params || []).map((item) => createNode(node, item));
      return node;
    };
  }
});

// tokens/StructTablePropertyDefinition.js
var require_StructTablePropertyDefinition = __commonJS({
  "tokens/StructTablePropertyDefinition.js"(exports2, module2) {
    function createNode(ctx, item) {
      if (!item)
        return null;
      return item.isIdentifier ? ctx.createIdentifierNode(item.value().toLowerCase(), item) : item.isLiteral ? ctx.createLiteralNode(item.value()) : ctx.createToken(item);
    }
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
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
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
      node.value = "parent";
      node.raw = "parent";
      return node;
    };
  }
});

// tokens/SwitchCase.js
var require_SwitchCase = __commonJS({
  "tokens/SwitchCase.js"(exports2, module2) {
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
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
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
      node.condition = node.createToken(stack.condition);
      node.cases = stack.cases.map((item) => node.createToken(item));
      return node;
    };
  }
});

// tokens/TemplateElement.js
var require_TemplateElement = __commonJS({
  "tokens/TemplateElement.js"(exports2, module2) {
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
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
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
      node.quasis = stack.quasis.map((item) => node.createToken(item));
      node.expressions = stack.expressions.map((item) => node.createToken(item));
      return node;
    };
  }
});

// tokens/ThisExpression.js
var require_ThisExpression = __commonJS({
  "tokens/ThisExpression.js"(exports2, module2) {
    module2.exports = function(ctx, stack) {
      const node = ctx.createIdentifierNode("this", stack, true);
      return node;
    };
  }
});

// tokens/ThrowStatement.js
var require_ThrowStatement = __commonJS({
  "tokens/ThrowStatement.js"(exports2, module2) {
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
      node.argument = ctx.createToken(stack.argument);
      return node;
    };
  }
});

// tokens/TryStatement.js
var require_TryStatement = __commonJS({
  "tokens/TryStatement.js"(exports2, module2) {
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
      node.block = node.createToken(stack.block);
      node.param = ctx.createNode("ParamDeclarator");
      node.param.argument = node.createToken(stack.param);
      node.param.argument.isVariable = true;
      node.param.type = "ParamDeclarator";
      node.param.prefix = "\\Exception";
      const acceptType = stack.param.acceptType ? stack.param.acceptType.type() : null;
      if (acceptType && acceptType.isModule) {
        const Throwable = ctx.builder.getGlobalModuleById("Throwable");
        if (Throwable && Throwable.type().is(acceptType)) {
          node.param.prefix = ctx.getModuleReferenceName(acceptType);
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
    module2.exports = function(ctx, stack) {
      if (stack.left.isParenthesizedExpression) {
        return ctx.createToken(stack.left.expression);
      }
      return ctx.createToken(stack.left);
    };
  }
});

// tokens/TypeTransformExpression.js
var require_TypeTransformExpression = __commonJS({
  "tokens/TypeTransformExpression.js"(exports2, module2) {
    function createTransformNode(ctx, method, expression) {
      return ctx.createCalleeNode(
        ctx.createIdentifierNode(method),
        [ctx.createToken(expression)]
      );
    }
    module2.exports = function(ctx, stack) {
      const type = stack.argument.type();
      var name = null;
      if (type) {
        const value = ctx.builder.getAvailableOriginType(type);
        name = type.toString();
        if (value === "Number") {
          const method = name === "float" || name === "double" ? "floatval" : "intval";
          return createTransformNode(ctx, method, stack.expression);
        } else if (value === "String") {
          return createTransformNode(ctx, "strval", stack.expression);
        } else if (value === "Boolean") {
          return createTransformNode(ctx, "boolval", stack.expression);
        } else if (value === "RegExp") {
          const regexp = stack.getGlobalTypeById("RegExp");
          const refs = ctx.getModuleReferenceName(regexp);
          ctx.addDepend(regexp);
          const test = ctx.createBinaryNode("instanceof", ctx.createToken(stack.expression), ctx.createIdentifierNode(refs));
          const consequent = ctx.createIdentifierNode(refs);
          const alternate = ctx.createNewNode(
            ctx.createIdentifierNode(refs),
            [
              ctx.createCalleeNode(ctx.createIdentifierNode("strval"), [ctx.createToken(stack.expression)])
            ]
          );
          return ctx.createParenthesNode(ctx.createConditionalNode(test, consequent, alternate));
        } else if (value === "Function") {
          return ctx.createToken(stack.expression);
        } else if (value === "Array") {
          name = "array";
        } else if (value === "Object") {
          name = "object";
        }
      }
      const node = ctx.createNode(stack);
      node.typeName = name;
      node.expression = node.createToken(stack.expression);
      return node;
    };
  }
});

// tokens/UnaryExpression.js
var require_UnaryExpression = __commonJS({
  "tokens/UnaryExpression.js"(exports2, module2) {
    module2.exports = function(ctx, stack) {
      const operator = stack.node.operator;
      const prefix = stack.node.prefix;
      if (operator === "delete" || operator === "typeof") {
        if (operator === "typeof") {
          const systemModule = ctx.builder.getGlobalModuleById("System");
          const promiseRefs = ctx.getModuleReferenceName(systemModule);
          ctx.addDepend(systemModule);
          return ctx.createCalleeNode(
            ctx.createStaticMemberNode([
              ctx.createIdentifierNode(promiseRefs),
              ctx.createIdentifierNode("typeof", stack)
            ]),
            [
              ctx.createToken(stack.argument)
            ]
          );
        }
        return ctx.createCalleeNode(
          ctx.createIdentifierNode("unset", stack),
          [
            ctx.createToken(stack.argument)
          ]
        );
      }
      const node = ctx.createNode(stack);
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
    function trans(ctx, stack, description, aliasAnnotation, objectType) {
      const type = objectType;
      let name = ctx.builder.getAvailableOriginType(type) || type.toString();
      if (objectType && (objectType.isUnionType || objectType.isIntersectionType) && description && description.isMethodDefinition && description.module && description.module.isModule) {
        name = desc.module.id;
      }
      if (Transform2.has(name)) {
        const object = Transform2.get(name);
        const key = stack.computed ? "$computed" : stack.property.value();
        if (Object.prototype.hasOwnProperty.call(object, key)) {
          if (stack.computed) {
            return object[key](
              ctx,
              ctx.createToken(stack.object),
              [ctx.createToken(stack.property)],
              false,
              false
            );
          }
          if (description.static) {
            return object[key](
              ctx,
              null,
              [],
              false,
              true
            );
          } else {
            return object[key](
              ctx,
              ctx.createToken(stack.object),
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
        const args = result.getArguments();
        if (args[0])
          return args[0].value;
      }
      return null;
    }
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
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
          var objectType = ctx.inferType(stack.object);
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
            const value = node.createBinaryNode(operator === "++" ? "+" : "-", node.createCalleeNode(getCallee), node.createLiteralNode(1));
            return node.createCalleeNode(setCallee, [value]);
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
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
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
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
      node.inFor = stack.parentStack.flag;
      if (stack.id.isIdentifier) {
        node.id = node.createIdentifierNode(stack.id.value(), stack.id);
      } else {
        node.id = node.createToken(stack.id);
      }
      if (stack.parentStack.isVariableDeclaration && stack.id.isIdentifier) {
        const type = ctx.inferType(stack, stack.init && stack.init.getContext());
        if (node.isAddressRefsType(type, stack.init)) {
          if (node.hasCrossScopeAssignment(stack.assignItems, !!node.inFor)) {
            const address = node.addAssignAddressRef(stack, stack.init);
            const name = stack.id.value();
            address.setName(stack.description(), name);
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
              const name = ctx.getDeclareRefsName(stack.init, "R");
              const refNode = ctx.createDeclarationNode("const", [
                ctx.createDeclaratorNode(
                  ctx.createIdentifierNode(name),
                  ctx.creaateAddressRefsNode(node.createToken(stack.init))
                )
              ]);
              ctx.insertNodeBlockContextAt(refNode);
              node.init = ctx.creaateAddressRefsNode(ctx.createIdentifierNode(name, null, true));
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
    module2.exports = function(ctx, stack) {
      ctx = ctx.createNode(stack);
      const name = stack.condition.value();
      const args = stack.condition.arguments.map((item, index) => {
        let value = null;
        let key = index;
        if (item.isAssignmentExpression) {
          key = item.left.value();
          value = item.right.value();
        } else {
          value = item.value();
        }
        return { index, key, value, stack: item };
      });
      const expectRaw = args.find((item) => String(item.key).toLowerCase() === "expect");
      const expect = expectRaw ? String(expectRaw.value).trim() !== "false" : true;
      let result = false;
      switch (name) {
        case "Runtime":
          result = ctx.builder.isRuntime(args[0].value) === expect;
          break;
        case "Syntax":
          result = ctx.builder.isSyntax(args[0].value) === expect;
          break;
        case "Env":
          {
            const name2 = args.find((item) => String(item.key).toLowerCase() === "name") || args[0];
            const value = args.find((item) => String(item.key).toLowerCase() === "value") || args[1];
            if (name2 && value) {
              result = ctx.builder.isEnv(name2.value, value.value) === expect;
            } else {
              stack.condition.error(`Missing name or value arguments. the '${stack.condition.value()}' annotations.`);
            }
          }
          break;
        case "Version":
          {
            const name2 = args.find((item) => String(item.key).toLowerCase() === "name") || args[0];
            const version = args.find((item) => String(item.key).toLowerCase() === "version") || args[1];
            const operator = args.find((item) => String(item.key).toLowerCase() === "operator") || args[2];
            if (name2 && version) {
              const args2 = [name2.value, version.value];
              if (operator) {
                args2.push(operator.value);
              }
              result = ctx.builder.isVersion.apply(ctx.builder, args2) === expect;
            } else {
              stack.condition.error(`Missing name or value arguments. the '${stack.condition.value()}' annotations.`);
            }
          }
          break;
        default:
      }
      const node = ctx.createToken(result ? stack.consequent : stack.alternate);
      node && (node.isWhenStatement = true);
      return node;
    };
  }
});

// tokens/WhileStatement.js
var require_WhileStatement = __commonJS({
  "tokens/WhileStatement.js"(exports2, module2) {
    module2.exports = function(ctx, stack) {
      const node = ctx.createNode(stack);
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
      version: "0.4.0",
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
var path = require("path");
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
var merge = require("lodash/merge");
var modules = require_tokens();
var defaultConfig = {
  target: 7,
  strict: true,
  emit: true,
  useAbsolutePathImport: false,
  import: true,
  suffix: ".php",
  ns: "es.core",
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
  metadata: {},
  framework: "thinkphp6",
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
    useFolderAsNamespace: true,
    publicPath: "public",
    excludes: [],
    disuse: {},
    using: {},
    mapping: {
      folder: {},
      route: {},
      namespace: {}
    }
  },
  externals: [],
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
function replace(test, type) {
  test = String(test).trim();
  if (type === "namespace" || type === "disuse" || type === "using") {
    return test.replace(/\./g, "/");
  }
  return test;
}
function makeConfig(object, type) {
  if (Array.isArray(object)) {
    object = object.map((item) => {
      if (typeof item === "string") {
        return {
          test: replace(item, type),
          raw: item.trim(),
          value: ""
        };
      }
      if (!item.test)
        throw new Error(`Config the '${type}.item.test' property is not exists.`);
      if (typeof item.test !== "string")
        throw new Error(`Config the '${type}.item.rule' type must is string.`);
      if (item.value && typeof item.value !== "string")
        throw new Error(`Config the '${type}.item.value' type must is string.`);
      item.raw = item.test.trim();
      item.test = replace(item.test, type);
      return item;
    });
  } else if (typeof object === "object") {
    object = Object.keys(object).map((key) => {
      let test = replace(key, type);
      return {
        test,
        raw: key.trim(),
        value: object[key]
      };
    });
  }
  if (!Array.isArray(object)) {
    throw new Error(`Config the '${type}' cannot convert to an array`);
  } else {
    let explicit = true;
    const map = {};
    object.forEach((item) => {
      map[item.raw] = item;
      const vague = item.test.match(/\*/g);
      item.vague = vague ? vague.length : 0;
      if (vague)
        explicit = false;
      item.rawValue = item.value;
      if (item.value && typeof item.value === "string") {
        item.value = item.value.trim();
        item.dynamic = item.value.includes("%");
        const restIndex = item.value.lastIndexOf("%...");
        if (restIndex > 0) {
          if (!item.raw.includes("**")) {
            throw new Error(`Config the '${item.raw}' rule needs to be specified '**'. because the remaining parameters are used in the matching value`);
          }
          if (item.value.length !== restIndex + 4) {
            throw new Error(`Config remaining '%...' must be at the end in the '${item.rawValue}'.`);
          }
        }
        if (type === "namespace") {
          if (restIndex > 0) {
            item.value = item.value.slice(0, -4);
          }
          item.segments = item.value.split(".").filter((v) => !!v);
          if (restIndex > 0)
            item.segments.push("%...");
          if (!item.dynamic) {
            item.value = item.value.replace(/\./g, "\\");
          }
        } else {
          item.segments = item.value.split("/");
        }
      }
    });
    object.sort((a, b) => {
      const a1 = a.test.split("/");
      const b1 = b.test.split("/");
      if (a1.length > b1.length)
        return -1;
      if (a.vague < b.vague)
        return -1;
      return 0;
    });
    return {
      map,
      explicit,
      rules: object
    };
  }
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
    this.options.metadata.env = merge({}, compiler.options.env, this.options.env);
    this.generatedCodeMaps = generatedCodeMaps;
    this.name = pkg.name;
    this.version = pkg.version;
    this.platform = "server";
    if (!compiler.options.scanTypings) {
      compiler.loadTypes([
        path.join(__dirname, "types", "index.d.es")
      ], {
        scope: "es-php",
        inherits: []
      });
    }
    const resolve = this.options.resolve;
    const mapping = resolve.mapping;
    mapping.namespace = makeConfig(mapping.namespace, "namespace");
    mapping.folder = makeConfig(mapping.folder, "folder");
    mapping.route = makeConfig(mapping.route, "route");
    resolve.disuse = makeConfig(resolve.disuse, "disuse");
    resolve.using = makeConfig(resolve.using, "using");
    registerError(compiler.diagnostic.defineError, compiler.diagnostic.LANG_CN, compiler.diagnostic.LANG_EN);
    this._builders = /* @__PURE__ */ new Map();
  }
  getGeneratedCodeByFile(file) {
    return this.generatedCodeMaps.get(file);
  }
  getGeneratedSourceMapByFile(file) {
    return null;
  }
  getTokenNode(name) {
    return modules.get(name);
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
