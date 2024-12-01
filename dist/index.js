var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc2) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc2 = __getOwnPropDesc(from, key)) || desc2.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};

// node_modules/@easescript/transform/lib/core/Cache.js
function createCache() {
  const records3 = /* @__PURE__ */ new Map();
  function set(key, name, value) {
    let dataset = records3.get(key);
    if (!dataset) {
      records3.set(key, dataset = /* @__PURE__ */ new Map());
    }
    dataset.set(name, value);
    return value;
  }
  function get(key, name) {
    let dataset = records3.get(key);
    return dataset ? dataset.get(name) : null;
  }
  function has(key, name) {
    let dataset = records3.get(key);
    return dataset ? dataset.has(name) : false;
  }
  function del(key, name) {
    let dataset = records3.get(key);
    if (dataset) {
      dataset.delete(name);
      return true;
    }
    return false;
  }
  function clear(key) {
    let dataset = records3.get(key);
    if (dataset) {
      dataset.clear(key);
      return true;
    }
    return false;
  }
  function clearAll() {
    records3.clear();
  }
  return {
    set,
    get,
    has,
    del,
    clear,
    clearAll
  };
}
function getCacheManager(scope = null) {
  if (scope) {
    let exists = records.get(scope);
    if (!exists) {
      records.set(scope, exists = createCache());
    }
    return exists;
  }
  return createCache();
}
var records;
var init_Cache = __esm({
  "node_modules/@easescript/transform/lib/core/Cache.js"() {
    records = /* @__PURE__ */ new Map();
  }
});

// node_modules/@easescript/transform/lib/core/Common.js
function beginNumericLiteral(value) {
  return beginNumericRE.test(value);
}
function parseMacroAnnotation(annotation) {
  if (!(annotation.isAnnotationDeclaration || annotation.isAnnotationExpression)) {
    return null;
  }
  const annName = annotation.getLowerCaseName();
  const indexes = annotationIndexers[annName];
  if (!indexes) {
    throw new Error(`Annotation arguments is not defined. the '${annName}' annotations.`);
  }
  const args = annotation.getArguments();
  if (!args.length)
    return emptyObject;
  return parseMacroArguments(args, annName, indexes);
}
function parseMacroArguments(args, name, indexes = null) {
  indexes = indexes || annotationIndexers[name];
  const _expect = getAnnotationArgument("expect", args, indexes);
  const expect = _expect ? String(_expect.value).trim() !== "false" : true;
  switch (name) {
    case "runtime":
    case "syntax":
      return {
        value: getAnnotationArgumentValue(args[0]),
        expect
      };
    case "env": {
      const _name = getAnnotationArgument("name", args, indexes);
      const _value = getAnnotationArgument("value", args, indexes);
      if (_value && _name) {
        return {
          name: getAnnotationArgumentValue(_name),
          value: getAnnotationArgumentValue(_value),
          expect
        };
      } else {
        return emptyObject;
      }
    }
    case "version": {
      const name2 = getAnnotationArgument("name", args, indexes);
      const version = getAnnotationArgument("version", args, indexes);
      const operator = getAnnotationArgument("operator", args, indexes);
      if (name2 && version) {
        return {
          name: getAnnotationArgumentValue(name2),
          version: getAnnotationArgumentValue(version),
          operator: getAnnotationArgumentValue(operator) || "elt",
          expect
        };
      } else {
        return emptyObject;
      }
    }
  }
  return null;
}
function parseMacroMethodArguments(args, name) {
  args = args.map((item, index) => {
    let value = null;
    let key = index;
    let assigned = false;
    if (item.isAssignmentExpression) {
      assigned = true;
      key = item.left.value();
      value = item.right.value();
    } else {
      value = item.value();
    }
    return { index, key, value, assigned, stack: item };
  });
  return parseMacroArguments(args, name);
}
function parseReadfileAnnotation(ctx, stack) {
  let args = stack.getArguments();
  let indexes = annotationIndexers.readfile;
  let stackArgs = {};
  let annotArgs = indexes.map((key) => {
    return stackArgs[key] = getAnnotationArgument(key, args, indexes);
  });
  let dirStack = annotArgs[0] && annotArgs[0].stack;
  let [_path, _load, _suffix, _relative, _lazy, _only, _source] = annotArgs.map((item) => {
    return item ? item.value : null;
  });
  if (!_path) {
    return null;
  }
  let dir = String(_path).trim();
  let [load, relative, lazy, only, source] = [_load, _relative, _lazy, _only, _source].map((value) => {
    value = String(value).trim();
    return value == "true" || value === "TRUE";
  });
  let suffixPattern = null;
  if (dir.charCodeAt(0) === 64) {
    dir = dir.slice(1);
    let segs = dir.split(".");
    let precede = segs.shift();
    let latter = segs.pop();
    let options = ctx.plugin[precede];
    if (precede === "options") {
      while (options && segs.length > 0) {
        options = options[segs.shift()];
      }
    }
    if (options && Object.prototype.hasOwnProperty.call(options, latter)) {
      dir = options[latter];
    }
  }
  let rawDir = dir;
  dir = stack.compiler.resolveManager.resolveSource(dir, stack.compilation.file);
  if (!dir) {
    ctx.error(`Readfile not found the '${rawDir}' folders`, dirStack || stack);
    return null;
  }
  if (_suffix) {
    _suffix = String(_suffix).trim();
    if (_suffix.charCodeAt(0) === 47 && _suffix.charCodeAt(_suffix.length - 1) === 47) {
      let index = _suffix.lastIndexOf("/");
      let flags = "";
      if (index > 0 && index !== _suffix.length - 1) {
        flags = _suffix.slice(index);
        _suffix = _suffix(0, index);
      }
      _suffix = suffixPattern = new RegExp(_suffix.slice(1, -1), flags);
    } else {
      _suffix = _suffix.split(",").map((item) => item.trim());
    }
  }
  let extensions = (stack.compiler.options.extensions || []).map((ext) => String(ext).startsWith(".") ? ext : "." + ext);
  if (!extensions.includes(".es")) {
    extensions.push(".es");
  }
  let suffix = _suffix || [...extensions, ".json", ".env", ".js", ".css", ".scss", ".less"];
  const checkSuffix = (file) => {
    if (suffixPattern) {
      return suffixPattern.test(filepath);
    }
    if (suffix === "*")
      return true;
    return suffix.some((item) => file.endsWith(item));
  };
  let files = stack.compiler.resolveFiles(dir).filter(checkSuffix);
  if (!files.length)
    return null;
  files.sort((a, b) => {
    a = a.replaceAll(".", "/").split("/").length;
    b = b.replaceAll(".", "/").split("/").length;
    return a - b;
  });
  return {
    args: stackArgs,
    dir,
    only,
    suffix,
    load,
    relative,
    source,
    lazy,
    files
  };
}
function parseUrlAnnotation(ctx, stack) {
  const args = stack.getArguments();
  return args.map((arg) => {
    if (arg && arg.resolveFile) {
      const asset = (stack.module || stack.compilation).assets.get(arg.resolveFile);
      if (asset) {
        return {
          id: asset.assign,
          file: asset.file,
          resolve: arg.resolveFile
        };
      }
    }
    return null;
  }).filter(Boolean);
}
function parseEnvAnnotation(ctx, stack) {
  const args = stack.getArguments();
  return args.map((item) => {
    let key = item.assigned ? item.key : item.value;
    let value = ctx.options.metadata.env[key] || process.env[key];
    if (!value && item.assigned) {
      value = item.value;
    }
    let type = typeof value;
    if (value != null && (type === "number" || type === "string" || type === "boolean" || type === "bigint")) {
      return {
        key,
        value
      };
    }
  }).filter(Boolean);
}
function parseHttpAnnotation(ctx, stack) {
  const args = stack.getArguments();
  const indexes = annotationIndexers.indexes;
  const [moduleClass, actionArg, paramArg, dataArg, methodArg, configArg] = indexes.map((key) => getAnnotationArgument(key, args, indexes));
  const providerModule = moduleClass ? import_Namespace.default.globals.get(moduleClass.value) : null;
  if (!providerModule) {
    ctx.error(`Class '${moduleClass.value}' is not exists.`);
  } else {
    const member = actionArg ? providerModule.getMember(actionArg.value) : null;
    if (!member || !import_Utils.default.isModifierPublic(member) || !(member.isMethodDefinition && !(member.isMethodGetterDefinition || member.isMethodSetterDefinition))) {
      ctx.error(`Method '${moduleClass.value}::${actionArg && actionArg.value}' is not exists.`, actionArg ? actionArg.stack : stack);
    } else {
      return {
        args: {
          data: dataArg,
          param: paramArg,
          config: configArg,
          method: methodArg,
          action: actionArg,
          module: moduleClass
        },
        module: providerModule,
        method: member
      };
    }
  }
  return null;
}
function parseDefineAnnotation(annotation) {
  const args = annotation.getArguments();
  const data = /* @__PURE__ */ Object.create(null);
  args.forEach((arg) => {
    if (arg.assigned) {
      data[String(arg.key).toLowerCase()] = arg.value;
    } else {
      data[String(arg.value).toLowerCase()] = true;
    }
  });
  return data;
}
function parseHookAnnotation(annotation, pluginVersion = "0.0.0", optionVersion = {}) {
  const args = annotation.getArguments();
  if (args.length >= 1) {
    const [type, version] = getAnnotationArguments(
      args,
      annotationIndexers.hook
    ).map((item) => getAnnotationArgumentValue(item));
    if (version) {
      const result = parseVersionExpression(version, pluginVersion, optionVersion);
      if (result) {
        if (compareVersion(result.left, result.right, result.operator)) {
          return {
            type
          };
        }
      }
      return false;
    } else {
      return {
        type
      };
    }
  } else {
    console.error("[es-transform] Annotations hook missing arguments");
    return false;
  }
}
function parseAliasAnnotation(annotation, pluginVersion, optionVersions = {}) {
  if (!annotation)
    return null;
  const args = annotation.getArguments();
  if (args.length > 0) {
    const indexes = annotationIndexers.alias;
    const [name, version] = getAnnotationArguments(args, indexes).map((arg) => getAnnotationArgumentValue(arg));
    if (name) {
      if (version) {
        const result = parseVersionExpression(version, pluginVersion, optionVersions);
        if (result) {
          if (compareVersion(result.left, result.right, result.operator)) {
            return name;
          }
        }
      } else {
        return name;
      }
    }
  }
  return null;
}
function getModuleAnnotations(module2, allows = [], inheritFlag = true) {
  if (!import_Utils.default.isModule(module2) || !allows.length)
    return emptyArray;
  let key = `getModuleAnnotations:${String(inheritFlag)}:${allows.join("-")}`;
  let old = Cache.get(module2, key);
  if (old)
    return old;
  let result = [];
  module2.getAnnotations((annotation) => {
    if (allows.includes(annotation.getLowerCaseName())) {
      result.push(annotation);
    }
  }, inheritFlag);
  Cache.set(module2, key, result);
  return result;
}
function getMethodAnnotations(methodStack, allows = [], inheritFlag = true) {
  if (!import_Utils.default.isStack(methodStack) || !(methodStack.isMethodDefinition || methodStack.isPropertyDefinition))
    return emptyArray;
  let result = [];
  let key = `getMethodAnnotations:${String(inheritFlag)}:${allows.join("-")}`;
  let old = Cache.get(methodStack, key);
  if (old)
    return old;
  methodStack.findAnnotation(methodStack, (annotation) => {
    if (allows.includes(annotation.getLowerCaseName())) {
      result.push(annotation);
    }
  }, inheritFlag);
  Cache.set(methodStack, key, result);
  return result;
}
function getAnnotationArgument(name, args, indexes = null) {
  name = String(name).toLowerCase();
  let index = args.findIndex((item) => {
    const key = String(item.key).toLowerCase();
    return key === name;
  });
  if (index < 0 && indexes && Array.isArray(indexes)) {
    index = indexes.indexOf(name);
    if (index >= 0) {
      const arg = args[index];
      return arg && !arg.assigned ? arg : null;
    }
  }
  return args[index];
}
function getAnnotationArguments(args, indexes = []) {
  return indexes.map((key) => getAnnotationArgument(key, args, indexes));
}
function getAnnotationArgumentValue(argument) {
  return argument ? argument.value : null;
}
function isRuntime(name, metadata = {}) {
  name = String(name).toLowerCase();
  if (!(name === "client" || name === "server"))
    return false;
  return compare(metadata.platform, name) || compare(process.env.platform, name);
}
function compare(left, right) {
  if (!left || !right)
    return false;
  if (left === right)
    return true;
  left = String(left);
  right = String(right);
  return left.toLowerCase() === right.toLowerCase();
}
function isSyntax(name, value) {
  if (!name)
    return false;
  if (name === value)
    return true;
  return compare(name, value);
}
function isEnv(name, value, options = {}) {
  const metadata = options.metadata || {};
  const env = metadata?.env || {};
  let lower = String(name).toLowerCase();
  if (value !== void 0) {
    if (process.env[name] === value)
      return true;
    if (lower === "mode") {
      if (options.mode === value || "production" === value) {
        return true;
      }
    }
    if (lower === "hot") {
      if (options.hot === value) {
        return true;
      }
    }
    return env[name] === value;
  }
  return false;
}
function toVersion(value) {
  const [a = "0", b = "0", c = "0"] = Array.from(String(value).matchAll(/\d+/g)).map((item) => item ? item[0].substring(0, 2) : "0");
  return [a, b, c].join(".");
}
function compareVersion(left, right, operator = "elt") {
  operator = operator.toLowerCase();
  if (operator === "eq" && left == right)
    return true;
  if (operator === "neq" && left != right)
    return true;
  const toInt = (val) => {
    val = parseInt(val);
    return isNaN(val) ? 0 : val;
  };
  left = String(left).split(".", 3).map(toInt);
  right = String(right).split(".", 3).map(toInt);
  for (let i = 0; i < left.length; i++) {
    let l = left[i] || 0;
    let r = right[i] || 0;
    if (operator === "eq") {
      if (l != r) {
        return false;
      }
    } else {
      if (l != r) {
        if (operator === "gt" && !(l > r)) {
          return false;
        } else if (operator === "egt" && !(l >= r)) {
          return false;
        } else if (operator === "lt" && !(l < r)) {
          return false;
        } else if (operator === "elt" && !(l <= r)) {
          return false;
        } else if (operator === "neq") {
          return true;
        }
        return true;
      }
    }
  }
  return operator === "eq" || operator === "egt" || operator === "elt";
}
function createRoutePath(route, params = {}) {
  if (!route || !route.path || !route.isRoute) {
    throw new Error("route invalid");
  }
  params = Object.assign({}, route.params || {}, params);
  return "/" + route.path.split("/").map((segment, index) => {
    if (segment.charCodeAt(0) === 58) {
      segment = segment.slice(1);
      const optional = segment.charCodeAt(segment.length - 1) === 63;
      if (optional) {
        segment = segment.slice(0, -1);
      }
      if (params[segment]) {
        return params[segment];
      }
      if (!optional) {
        console.error(`[es-transform] Route params the "${segment}" missing default value or set optional. on page-component the "${route.path}"`);
      }
      return null;
    }
    return segment;
  }).filter((val) => !!val).join("/");
}
function getModuleRoutes(module2, allows = ["router"], options = {}) {
  if (!import_Utils.default.isModule(module2) || !module2.isClass)
    return [];
  const routes = [];
  const annotations = getModuleAnnotations(module2, allows);
  if (annotations && annotations.length) {
    annotations.forEach((annotation) => {
      const args = annotation.getArguments();
      let annotName = annotation.getLowerCaseName();
      let method = annotName;
      if (annotName === "router") {
        method = "*";
        const methodArg = getAnnotationArgument("method", args, []);
        if (methodArg) {
          method = String(methodArg.value).toLowerCase();
        }
      }
      const pathArg = getAnnotationArgument("path", args, ["path"]);
      const defaultValue = {};
      const params = args.filter((arg) => !(arg === method || arg === pathArg)).map((item) => {
        return getModuleRouteParamRule(item.assigned ? item.key : item.value, item.stack, defaultValue);
      });
      let withNs = options.routePathWithNamespace?.client;
      let className = module2.getName("/");
      let pathName = pathArg ? pathArg.value : withNs === false ? module2.id : className;
      if (pathName.charCodeAt(0) === 47) {
        pathName = pathName.substring(1);
      }
      if (pathName.charCodeAt(pathName.length - 1) === 47) {
        pathName = pathName.slice(0, -1);
      }
      let segments = [pathName].concat(params);
      let routePath = "/" + segments.join("/");
      let formatRoute = options.formation?.route;
      if (formatRoute) {
        routePath = formatRoute(routePath, {
          pathArg,
          params,
          method,
          defaultParamsValue: defaultValue,
          className: module2.getName()
        }) || routePath;
      }
      routes.push({
        isRoute: true,
        name: className,
        path: routePath,
        params: defaultValue,
        method,
        module: module2
      });
    });
  }
  return routes;
}
function getModuleRouteParamRule(name, annotParamStack, defaultValue = {}) {
  let question = annotParamStack.question || annotParamStack.node.question;
  if (annotParamStack.isAssignmentPattern) {
    if (!question)
      question = annotParamStack.left.question || annotParamStack.left.node.question;
    if (annotParamStack.right.isIdentifier || annotParamStack.right.isLiteral) {
      defaultValue[name] = annotParamStack.right.value();
    } else {
      const gen = new Generator();
      gen.make(this.createToken(annotParamStack.right));
      defaultValue[name] = gen.toString();
    }
  }
  return question ? ":" + name + "?" : ":" + name;
}
function parseVersionExpression(expression2, pluginVersion = "0.0.0", optionVersions = {}) {
  expression2 = String(expression2).trim();
  const token = compareOperators.find((value) => {
    return expression2.includes(value) || expression2.includes(compareOperatorMaps[value]);
  });
  if (!token) {
    throw new Error("Version expression operator is invalid. availables:" + compareOperators.join(", "));
  }
  const operation = expression2.includes(token) ? token : compareOperatorMaps[token];
  const segs = expression2.split(operation, 2).map((val) => val.trim());
  if (!segs[0])
    segs[0] = pluginVersion;
  else if (!segs[1])
    segs[1] = pluginVersion;
  if (segs.length === 2) {
    let left = segs[0];
    let right = segs[1];
    if (!beginNumericLiteral(left)) {
      left = optionVersions[left] || "0.0.0";
    }
    if (!beginNumericLiteral(right)) {
      right = optionVersions[right] || "0.0.0";
    }
    if (left && right) {
      return {
        left: toVersion(left),
        right: toVersion(right),
        operator: compareOperatorMaps[token]
      };
    }
  } else {
    throw new Error("Version expression parse failed");
  }
}
function createFormatImportSpecifiers(stack) {
  return stack.specifiers.map((spec) => {
    if (spec.isImportDefaultSpecifier) {
      return {
        local: spec.value(),
        stack: spec
      };
    } else if (spec.isImportSpecifier) {
      return {
        local: spec.value(),
        imported: spec.imported.value(),
        stack: spec
      };
    } else if (spec.isImportNamespaceSpecifier) {
      return {
        local: spec.value(),
        imported: "*",
        stack: spec
      };
    }
  });
}
function parseImportDeclaration(ctx, stack, context = null, graph = null) {
  let importSource = null;
  if (!context) {
    context = stack.compilation;
  }
  if (!graph && context) {
    graph = ctx.getBuildGraph(context);
  }
  if (stack.source.isLiteral) {
    let compilation = stack.getResolveCompilation();
    let source = stack.getResolveFile() || stack.source.value();
    let specifiers = null;
    let ownerModule = null;
    if (compilation && !compilation.isDescriptorDocument()) {
      source = ctx.getModuleImportSource(source, stack.compilation.file);
      specifiers = createFormatImportSpecifiers(stack);
      ctx.addDepend(compilation);
    } else {
      if (stack.additional && stack.additional.isDeclaratorDeclaration) {
        ownerModule = stack.additional.module;
      }
      let isLocal = import_fs.default.existsSync(source);
      specifiers = createFormatImportSpecifiers(stack);
      source = ctx.getImportAssetsMapping(source, {
        group: "imports",
        source,
        specifiers,
        ctx,
        context
      });
      if (isLocal && source) {
        let asset = ctx.createAsset(source);
        source = ctx.getAssetsImportSource(asset, stack.compilation);
        graph.addAsset(asset);
      }
    }
    if (source) {
      if (specifiers.length > 0) {
        specifiers.forEach((spec) => {
          let local = spec.local;
          if (ownerModule && spec.local === ownerModule.id) {
            local = ctx.getModuleReferenceName(ownerModule, context);
          }
          importSource = ctx.addImport(source, local, spec.imported, spec.stack);
        });
      } else {
        importSource = ctx.addImport(source, null, null, stack.source);
      }
      if (compilation) {
        importSource.setSourceTarget(compilation);
      }
    }
  } else {
    const classModule = stack.description();
    if (classModule && classModule.isModule && ctx.isActiveModule(classModule) && ctx.isNeedBuild(classModule)) {
      let local = stack.alias ? stack.alias.value() : classModule.id;
      let source = ctx.getModuleImportSource(classModule, import_Utils.default.isModule(context) ? context : stack.compilation);
      importSource = ctx.addImport(source, local, null, stack.source);
      importSource.setSourceTarget(classModule);
    }
  }
  if (importSource) {
    importSource.stack = stack;
    if (graph) {
      graph.addImport(importSource);
    }
  }
  return importSource;
}
function createHttpAnnotationNode(ctx, stack) {
  const result = parseHttpAnnotation(ctx, stack);
  if (!result)
    return null;
  const { param, method, data, config } = result.args;
  const routeConfigNode = createRouteConfigNode(ctx, result.module, result.method, param);
  const createArgNode = (argItem) => {
    if (argItem) {
      if (argItem.stack.isAssignmentPattern) {
        return ctx.createToken(argItem.stack.right);
      } else {
        return ctx.createToken(argItem.stack);
      }
    }
    return null;
  };
  const System = import_Namespace.default.globals.get("System");
  const Http = import_Namespace.default.globals.get("net.Http");
  ctx.addDepend(System, stack.module);
  ctx.addDepend(Http, stack.module);
  const props = {
    data: createArgNode(data),
    options: createArgNode(config),
    method: method && allMethods.includes(method.value) ? ctx.createLiteral(method.value) : null
  };
  const properties = Object.keys(props).map((name) => {
    const value = props[name];
    if (value) {
      return ctx.createProperty(ctx.createIdentifier(name), value);
    }
    return null;
  }).filter((item) => !!item);
  let calleeArgs = [
    ctx.createIdentifier(
      ctx.getGlobalRefName(
        stack,
        ctx.getModuleReferenceName(Http, stack.module)
      )
    ),
    routeConfigNode
  ];
  if (properties.length > 0) {
    calleeArgs.push(ctx.createObjectExpression(properties));
  }
  return ctx.createCallExpression(
    ctx.createMemberExpression([
      ctx.createIdentifier(
        ctx.getGlobalRefName(
          stack,
          ctx.builder.getModuleReferenceName(System, stack.module)
        )
      ),
      ctx.createIdentifier("createHttpRequest")
    ]),
    calleeArgs,
    stack
  );
}
function createUrlAnnotationNode(ctx, stack) {
  let result = parseUrlAnnotation(ctx, stack);
  if (result.length > 0) {
    let items = result.map((item) => {
      if (item.id)
        return ctx.createIdentifier(item.id);
      return ctx.createLiteral(item.resolve);
    });
    if (items.length > 1) {
      return ctx.createArrayExpression(items);
    } else {
      return items[0];
    }
  }
  return ctx.createLiteral("");
}
function createEmbedAnnotationNode(ctx, stack) {
  let result = parseUrlAnnotation(ctx, stack);
  if (result.length > 0) {
    let items = result.map((item) => {
      if (item.id)
        return ctx.createIdentifier(item.id);
      return ctx.createLiteral(
        ctx.getRelativePath(stack.file, item.resolve)
      );
    });
    if (items.length > 1) {
      return ctx.createArrayExpression(items);
    } else {
      return items[0];
    }
  }
  return ctx.createLiteral("");
}
function createEnvAnnotationNode(ctx, stack) {
  let result = parseEnvAnnotation(ctx, stack);
  if (result.length > 0) {
    let properties = result.map((item) => {
      return ctx.createProperty(ctx.createIdentifier(item.key), ctx.createLiteral(item.value));
    });
    return ctx.createObjectExpression(properties);
  }
  return ctx.createLiteral(null);
}
function createRouterAnnotationNode(ctx, stack) {
  const result = parseHttpAnnotation(ctx, stack);
  if (!result)
    return null;
  if (result.isWebComponent) {
    let route = getModuleRoutes(result.module, ["router"], ctx.options);
    if (route && Array.isArray(route))
      route = route[0];
    if (!route) {
      return ctx.createLiteral(result.module.getName("/"));
    }
    const paramArg = result.args.param;
    if (!paramArg) {
      return ctx.createLiteral(createRoutePath(route));
    } else {
      const System = import_Namespace.default.globals.get("System");
      const routePath = "/" + route.path.split("/").map((segment) => {
        if (segment.charCodeAt(0) === 58) {
          return "<" + segment.slice(1) + ">";
        }
        return segment;
      }).filter((val) => !!val).join("/");
      let paramNode = ctx.createToken(paramArg.assigned ? paramArg.stack.right : paramArg.stack);
      ctx.addDepend(System, stack.module);
      if (route.params) {
        const defaultParams = ctx.createObjectExpression(
          Object.keys(route.params).map((name) => {
            const value = route.params[name];
            return ctx.createProperty(ctx.createIdentifier(name), ctx.createLiteral(value));
          })
        );
        paramNode = ctx.createCallExpression(
          ctx.createMemberExpression([
            ctx.createIdentifier("Object"),
            ctx.createIdentifier("assign")
          ]),
          [
            defaultParams,
            paramNode
          ]
        );
      }
      return ctx.createCallExpression(
        ctx.createMemberExpression([
          ctx.createIdentifier(
            ctx.getGlobalRefName(
              stack,
              ctx.getModuleReferenceName(System, stack.module)
            ),
            stack
          ),
          ctx.createIdentifier("createHttpRoute", stack)
        ]),
        [
          ctx.createLiteral(routePath),
          paramNode
        ],
        stack
      );
    }
  } else {
    return createRouteConfigNode(ctx, result.module, result.method, result.args.param);
  }
}
function createMainAnnotationNode(ctx, stack) {
  if (!stack || !stack.isMethodDefinition)
    return;
  const main = Array.isArray(stack.annotations) ? stack.annotations.find((stack2) => stack2.getLowerCaseName() === "main") : null;
  if (!main)
    return;
  let callMain = ctx.createCallExpression(
    ctx.createMemberExpression([
      ctx.createIdentifier(stack.module.id),
      ctx.createIdentifier(stack.key.value())
    ])
  );
  const args = main ? main.getArguments() : [];
  const defer = args.length > 0 ? !(String(args[0].value).toLowerCase() === "false") : true;
  if (defer) {
    callMain = ctx.createCallExpression(
      createStaticReferenceNode(ctx, stack, "System", "setImmediate"),
      [
        ctx.createArrowFunctionExpression(callMain)
      ]
    );
  }
  return callMain;
}
function createRouteConfigNode(ctx, module2, method, paramArg) {
  if (!import_Utils.default.isStack(method) || !method.isMethodDefinition) {
    throw new Error(`method invalid`);
  }
  const annotations = method.annotations;
  const annotation = annotations && annotations.find((item) => {
    return allMethods.includes(item.getLowerCaseName());
  });
  const mapNameds = ["path"];
  const args = annotation ? annotation.getArguments() : [];
  const pathArg = annotation ? getAnnotationArgument(mapNameds[0], args, mapNameds) : null;
  const actionName = method.value();
  const value = String(pathArg ? pathArg.value : actionName);
  const defaultParams = [];
  const declareParams = (method.params || []).map((item) => {
    const required = !(item.question || item.isAssignmentPattern);
    const question = required ? "" : "?";
    if (item.isAssignmentPattern) {
      if (item.right.isLiteral) {
        defaultParams.push(ctx.createProperty(ctx.createIdentifier(item.value()), ctx.createToken(item.right)));
      } else {
        item.right.error(10101, item.value());
      }
    }
    return `<${item.value()}${question}>`;
  });
  const uri = declareParams.length > 0 ? [value].concat(declareParams).join("/") : value;
  let url = uri;
  if (uri.charCodeAt(0) !== 47) {
    const withNs = ctx.options.routePathWithNamespace?.server;
    url = withNs ? `/${module2.getName("/")}/${uri}` : `/${module2.id}/${uri}`;
  }
  let allowMethodNode = ctx.createLiteral(annotation ? annotation.getLowerCaseName() : "*");
  let allowMethodNames = annotation ? annotation.getLowerCaseName() : "*";
  if (annotation && annotation.getLowerCaseName() === "router") {
    const allowMethods = args.filter((item) => item !== pathArg);
    if (allowMethods.length > 0) {
      allowMethodNames = allowMethods.map((item) => item.value).join(",");
      allowMethodNode = ctx.createArrayExpression(allowMethods.map((item) => ctx.createLiteral(item.value)));
    } else {
      allowMethodNode = ctx.createLiteral("*");
    }
  }
  let formatRoute = ctx.options.formation?.route;
  if (formatRoute) {
    url = formatRoute(url, {
      action: actionName,
      pathArg: value,
      method: allowMethodNames,
      params: declareParams,
      className: module2.getName()
    }) || url;
  }
  let paramNode = null;
  if (paramArg) {
    if (paramArg.stack.isAssignmentPattern) {
      paramNode = ctx.createToken(paramArg.stack.right);
    } else {
      paramNode = ctx.createToken(paramArg.stack);
    }
  }
  const props = {
    url: ctx.createLiteral(url),
    param: paramNode,
    allowMethod: allowMethodNode
  };
  if (defaultParams.length > 0) {
    props["default"] = ctx.createObjectExpression(defaultParams);
  }
  return ctx.createObjectExpression(
    Object.keys(props).map((name) => {
      const value2 = props[name];
      if (value2) {
        return ctx.createProperty(name, value2);
      }
      return null;
    }).filter((item) => !!item)
  );
}
function createReadfileAnnotationNode(ctx, stack) {
  const result = parseReadfileAnnotation(ctx, stack);
  if (!result)
    return null;
  const addDeps = (source, local) => {
    source = ctx.getSourceFileMappingFolder(source) || source;
    ctx.addImport(source, local);
  };
  const fileMap = {};
  const localeCxt = result.dir.toLowerCase();
  const getParentFile = (pid) => {
    if (fileMap[pid]) {
      return fileMap[pid];
    }
    if (localeCxt !== pid && pid.includes(localeCxt)) {
      return getParentFile(import_path.default.dirname(pid));
    }
    return null;
  };
  const dataset = [];
  const namedMap = /* @__PURE__ */ new Set();
  const only = result.only;
  result.files.forEach((file) => {
    const pid = import_path.default.dirname(file).toLowerCase();
    const named = import_path.default.basename(file, import_path.default.extname(file));
    const id = (pid + "/" + named).toLowerCase();
    const filepath2 = result.relative ? ctx.compiler.getRelativeWorkspacePath(file) : file;
    let item = {
      path: filepath2,
      isFile: import_fs.default.statSync(file).isFile()
    };
    if (item.isFile && result.load) {
      let data = "";
      if (file.endsWith(".env")) {
        const content = dotenv.parse(import_fs.default.readFileSync(file));
        dotenvExpand.expand({ parsed: content });
        data = JSON.stringify(content);
      } else {
        if (result.lazy) {
          data = `import('${file}')`;
        } else {
          namedMap.add(file);
          data = ctx.getGlobalRefName(stack, "_" + named.replaceAll("-", "_") + namedMap.size);
          addDeps(file, data);
        }
      }
      item.content = data;
    } else if (result.source) {
      item.content = JSON.stringify(import_fs.default.readFileSync(file));
    }
    const parent = getParentFile(pid);
    if (parent) {
      const children = parent.children || (parent.children = []);
      children.push(item);
    } else {
      fileMap[id + import_path.default.extname(file)] = item;
      dataset.push(item);
    }
  });
  const make = (list) => {
    return list.map((object) => {
      if (only) {
        return object.content ? ctx.createChunkExpression(object.content) : ctx.createLiteral(null);
      }
      const properties = [
        ctx.createProperty(
          ctx.createIdentifier("path"),
          ctx.createLiteral(object.path)
        )
      ];
      if (object.isFile) {
        properties.push(ctx.createProperty(ctx.createIdentifier("isFile"), ctx.createLiteral(true)));
      }
      if (object.content) {
        properties.push(ctx.createProperty(ctx.createIdentifier("content"), ctx.createChunkExpression(object.content)));
      }
      if (object.children) {
        properties.push(ctx.createProperty(ctx.createIdentifier("children"), ctx.createArrayExpression(make(object.children))));
      }
      return ctx.createObjectExpression(properties);
    });
  };
  return ctx.createArrayExpression(make(dataset));
}
function createIdentNode(ctx, stack) {
  if (!stack)
    return null;
  return stack.isIdentifier ? ctx.createIdentifier(stack.value(), stack) : stack.isLiteral ? ctx.createLiteral(stack.value()) : ctx.createToken(stack);
}
function toCamelCase(name) {
  name = String(name);
  if (name.includes("-")) {
    name = name.replace(/-([a-z])/g, (a, b) => b.toUpperCase());
  }
  return name;
}
function toFirstUpperCase(str) {
  return str.substring(0, 1).toUpperCase() + str.substring(1);
}
function createCJSImports(ctx, importManage) {
  let imports = [];
  importManage.getAllImportSource().forEach((importSource) => {
    if (importSource.isExportSource)
      return;
    const properties = [];
    importSource.specifiers.forEach((spec) => {
      if (spec.type === "default" || spec.type === "namespace") {
        let requireNode = ctx.createCallExpression(
          ctx.createIdentifier("require"),
          [
            ctx.createLiteral(importSource.sourceId)
          ]
        );
        if (spec.type === "default") {
          const module2 = importSource.getSourceTarget();
          if (import_Utils.default.isCompilation(module2)) {
            requireNode = ctx.createCallExpression(
              createStaticReferenceNode(ctx, null, "Class", "getExportDefault"),
              [
                requireNode
              ]
            );
          }
        }
        const node = ctx.createVariableDeclaration("const", [
          ctx.createVariableDeclarator(
            ctx.createIdentifier(spec.local, importSource.stack),
            requireNode,
            importSource.stack
          )
        ]);
        imports.push(node);
      } else if (spec.type === "specifier") {
        let imported = ctx.createIdentifier(spec.local);
        let local = null;
        if (spec.imported && spec.imported !== spec.local) {
          local = imported;
          imported = ctx.createIdentifier(spec.imported);
        }
        properties.push(
          ctx.createProperty(
            imported,
            local
          )
        );
      }
    });
    if (properties.length > 0) {
      const node = ctx.createVariableDeclaration("const", [
        ctx.createVariableDeclarator(
          ctx.createObjectPattern(properties),
          ctx.createCallExpression(
            ctx.createIdentifier("require"),
            [
              ctx.createLiteral(importSource.sourceId)
            ]
          ),
          importSource.stack
        )
      ]);
      imports.push(node);
    } else if (!(importSource.specifiers.length > 0)) {
      imports.unshift(
        ctx.createExpressionStatement(
          ctx.createCallExpression(
            ctx.createIdentifier("require"),
            [
              ctx.createLiteral(importSource.sourceId)
            ]
          )
        )
      );
    }
  });
  return imports;
}
function createESMImports(ctx, importManage) {
  let imports = [];
  importManage.getAllImportSource().forEach((importSource) => {
    if (importSource.isExportSource)
      return;
    const specifiers = importSource.specifiers.map((spec) => {
      if (spec.type === "default") {
        return ctx.createImportSpecifier(spec.local);
      } else if (spec.type === "specifier") {
        return ctx.createImportSpecifier(spec.local, spec.imported);
      } else if (spec.type === "namespace") {
        return ctx.createImportSpecifier(spec.local, null, true);
      }
    });
    if (importSource.specifiers.length > 0) {
      imports.push(
        ctx.createImportDeclaration(
          importSource.sourceId,
          specifiers,
          importSource.stack
        )
      );
    } else {
      imports.unshift(
        ctx.createImportDeclaration(
          importSource.sourceId,
          specifiers,
          importSource.stack
        )
      );
    }
  });
  return imports;
}
function createCJSExports(ctx, exportManage, graph) {
  let importSpecifiers = /* @__PURE__ */ new Map();
  let imports = [];
  let exports = [];
  let declares = [];
  let exportSets = new Set(exportManage.getAllExportSource());
  let properties = [];
  let exportAlls = [];
  exportSets.forEach((exportSource) => {
    let importSource = exportSource.importSource;
    let sourceId = importSource ? importSource.sourceId : null;
    if (sourceId) {
      sourceId = ctx.createLiteral(sourceId);
    }
    let specifiers = [];
    graph.addExport(exportSource);
    exportSource.specifiers.forEach((spec) => {
      if (spec.type === "namespace") {
        if (!spec.exported) {
          exportAlls.push(
            ctx.createCallExpression(
              ctx.createIdentifier("require"),
              [
                sourceId
              ],
              spec.stack
            )
          );
        } else {
          properties.push(
            ctx.createProperty(
              ctx.createIdentifier(spec.exported),
              ctx.createCallExpression(
                ctx.createIdentifier("require"),
                [
                  sourceId
                ]
              ),
              spec.stack
            )
          );
        }
      } else if (spec.type === "default") {
        properties.push(
          ctx.createProperty(
            ctx.createIdentifier("default"),
            spec.local,
            spec.stack
          )
        );
      } else if (spec.type === "named") {
        if (spec.local.type === "VariableDeclaration") {
          spec.local.declarations.map((decl) => {
            properties.push(
              ctx.createProperty(
                decl.id,
                decl.init || ctx.createLiteral(null),
                spec.stack
              )
            );
          });
        } else if (spec.local.type === "FunctionDeclaration") {
          declares.push(spec.local);
          properties.push(
            ctx.createProperty(
              spec.local.key,
              null,
              spec.stack
            )
          );
        }
      } else if (spec.type === "specifier") {
        if (sourceId) {
          let node = ctx.createProperty(
            ctx.createIdentifier(spec.local),
            ctx.createIdentifier(spec.exported),
            spec.stack
          );
          properties.push(
            ctx.createProperty(
              ctx.createIdentifier(spec.exported),
              null,
              spec.stack
            )
          );
          specifiers.push(node);
        } else {
          let node = ctx.createProperty(
            ctx.createIdentifier(spec.exported),
            ctx.createIdentifier(spec.local),
            spec.stack
          );
          properties.push(node);
        }
      }
    });
    if (specifiers.length > 0) {
      let dataset = importSpecifiers.get(sourceId);
      if (!dataset) {
        importSpecifiers.set(sourceId, dataset = []);
      }
      dataset.push(...specifiers);
    }
  });
  importSpecifiers.forEach((specifiers, sourceId) => {
    imports.push(
      ctx.createVariableDeclaration("const", [
        ctx.createVariableDeclarator(
          ctx.createObjectPattern(specifiers),
          ctx.createCallExpression(
            ctx.createIdentifier("require"),
            [
              sourceId
            ]
          )
        )
      ])
    );
  });
  if (exportAlls.length > 0 && !properties.length) {
    if (exportAlls.length === 1) {
      exports.push(
        ctx.createExpressionStatement(
          ctx.createAssignmentExpression(
            ctx.createChunkExpression("module.exports", false, false),
            exportAlls[0]
          )
        )
      );
    } else {
      let spreads = exportAlls.map((require2) => {
        return ctx.createSpreadElement(
          ctx.createParenthesizedExpression(
            ctx.createLogicalExpression(
              require2,
              ctx.createObjectExpression(),
              "||"
            )
          )
        );
      });
      exports.push(
        ctx.createExpressionStatement(
          ctx.createAssignmentExpression(
            ctx.createChunkExpression("module.exports", false, false),
            ctx.createObjectExpression(spreads)
          )
        )
      );
    }
  } else if (!exportAlls.length && properties.length === 1 && properties[0].key.value === "default") {
    exports.push(
      ctx.createExpressionStatement(
        ctx.createAssignmentExpression(
          ctx.createChunkExpression("module.exports", false, false),
          properties[0].init
        )
      )
    );
  } else {
    let spreads = exportAlls.map((require2) => {
      return ctx.createSpreadElement(
        ctx.createParenthesizedExpression(
          ctx.createLogicalExpression(
            require2,
            ctx.createObjectExpression(),
            "||"
          )
        )
      );
    });
    let items = [
      ...spreads,
      ...properties
    ];
    exports.push(
      ctx.createExpressionStatement(
        ctx.createAssignmentExpression(
          ctx.createChunkExpression("module.exports", false, false),
          ctx.createObjectExpression(items)
        )
      )
    );
  }
  return { imports, exports, declares };
}
function createESMExports(ctx, exportManage, graph) {
  let importSpecifiers = /* @__PURE__ */ new Map();
  let exports = [];
  let imports = [];
  let declares = [];
  let exportSets = new Set(exportManage.getAllExportSource());
  exportSets.forEach((exportSource) => {
    let importSource = exportSource.importSource;
    let sourceId = importSource ? importSource.sourceId : null;
    let specifiers = [];
    graph.addExport(exportSource);
    exportSource.specifiers.forEach((spec) => {
      if (spec.type === "namespace") {
        exports.push(
          ctx.createExportAllDeclaration(sourceId, spec.exported, spec.stack)
        );
      } else if (spec.type === "default") {
        exports.push(
          ctx.createExportDefaultDeclaration(spec.local, spec.stack)
        );
      } else if (spec.type === "named" && !sourceId) {
        exports.push(
          ctx.createExportNamedDeclaration(spec.local, null, [], spec.stack)
        );
      } else if (spec.type === "specifier") {
        specifiers.push(
          ctx.createExportSpecifier(spec.local, spec.exported, spec.stack)
        );
      }
    });
    if (specifiers.length > 0) {
      let dataset = importSpecifiers.get(sourceId);
      if (!dataset) {
        importSpecifiers.set(sourceId, dataset = []);
      }
      dataset.push(...specifiers);
    }
  });
  importSpecifiers.forEach((specifiers, sourceId) => {
    exports.push(ctx.createExportNamedDeclaration(null, sourceId, specifiers));
  });
  return { imports, exports, declares };
}
function isExternalDependency(externals, source, module2 = null) {
  if (Array.isArray(externals) && externals.length > 0) {
    return externals.some((rule) => {
      if (typeof rule === "function") {
        return rule(source, module2);
      } else if (rule instanceof RegExp) {
        return rule.test(source);
      }
      return rule === source;
    });
  }
  return false;
}
function getMethodOrPropertyAlias(ctx, stack, name = null) {
  if (Cache.has(stack, "getMethodOrPropertyAlias")) {
    return Cache.get(stack, "getMethodOrPropertyAlias");
  }
  let result = getMethodAnnotations(stack, ["alias"]);
  let resolevName = name;
  if (result) {
    const [annotation] = result;
    const value = parseAliasAnnotation(annotation, ctx.plugin.version, ctx.options.metadata.versions);
    if (value) {
      resolevName = value;
    }
  }
  Cache.set(stack, "getMethodOrPropertyAlias", resolevName);
  return resolevName;
}
function getMethodOrPropertyHook(ctx, stack) {
  if (!stack)
    return null;
  if (Cache.has(stack, "getMethodOrPropertyHook")) {
    return Cache.get(stack, "getMethodOrPropertyHook");
  }
  let result = getMethodAnnotations(stack, ["hook"]);
  let invoke = null;
  if (result.length > 0) {
    let annotation = result[0];
    result = parseHookAnnotation(annotation, ctx.plugin.version, ctx.options.metadata.versions);
    if (result) {
      invoke = [
        result.type,
        annotation
      ];
    }
  }
  Cache.set(stack, "getMethodOrPropertyHook", invoke);
  return invoke;
}
function createJSXAttrHookNode(ctx, stack, desc2) {
  if (!(stack && stack.isMemberProperty && stack.value && desc2))
    return null;
  const hookAnnot = getMethodOrPropertyHook(desc2);
  if (hookAnnot) {
    let [type, annotation] = hookAnnot;
    let lower = type && String(type).toLowerCase();
    const hooks = ctx.options.hooks;
    let createdNode = null;
    if (hooks.createJSXAttrValue) {
      createdNode = hooks.createJSXAttrValue({ ctx, type, jsxAttrNode: stack, descriptor: desc2, annotation });
    }
    if (!createdNode) {
      if (lower === "compiling:create-route-path") {
        if (stack.value && stack.value.isJSXExpressionContainer) {
          const value = stack.value.description();
          if (value && value.isModule && stack.isModuleForWebComponent(value)) {
            let route = getModuleRoutes(value, ["router"], ctx.options);
            if (route && route[0]) {
              if (Array.isArray(route))
                route = route[0];
              if (route.path) {
                return ctx.createLiteral(createRoutePath(route));
              } else {
                console.error(`[es-transform] Route missing the 'path' property.`);
              }
            }
            return ctx.createLiteral(value.getName("/"));
          }
        }
        return null;
      }
      if (type) {
        const node = ctx.createCallExpression(
          ctx.createMemberExpression([
            ctx.createThisExpression(stack),
            ctx.createIdentifier("invokeHook")
          ]),
          [
            ctx.createLiteral(type),
            ctx.createToken(stack.value),
            ctx.createLiteral(stack.name.value()),
            ctx.createLiteral(desc2.module.getName())
          ]
        );
        node.hasInvokeHook = true;
        node.hookAnnotation = annotation;
        return node;
      }
    }
  }
  return null;
}
function createStaticReferenceNode(ctx, stack, className, method) {
  return ctx.createMemberExpression([
    createModuleReferenceNode(ctx, stack, className),
    ctx.createIdentifier(method, stack)
  ]);
}
function createModuleReferenceNode(ctx, stack, className) {
  let gloablModule = import_Namespace.default.globals.get(className);
  if (gloablModule) {
    let context = stack ? stack.module || stack.compilation : null;
    ctx.addDepend(gloablModule, context);
    return ctx.createIdentifier(
      ctx.getModuleReferenceName(gloablModule, context)
    );
  } else {
    throw new Error(`References the '${className}' module is not exists`);
  }
}
function createUniqueHashId(source) {
  let exists = hashCache[source];
  if (exists) {
    return exists;
  }
  return hashCache[source] = (0, import_crypto.createHash)("sha256").update(source).digest("hex").substring(0, 8);
}
async function callAsyncSequence(items, asyncMethod) {
  if (!Array.isArray(items))
    return false;
  if (items.length < 1)
    return false;
  let index = 0;
  items = items.slice(0);
  const callAsync = async () => {
    if (index < items.length) {
      await asyncMethod(items[index], index++);
      await callAsync();
    }
  };
  await callAsync();
}
var import_fs, import_path, import_Utils, import_Namespace, import_crypto, Cache, emptyObject, emptyArray, annotationIndexers, compareOperatorMaps, compareOperators, beginNumericRE, allMethods, hashCache;
var init_Common = __esm({
  "node_modules/@easescript/transform/lib/core/Common.js"() {
    import_fs = __toESM(require("fs"));
    import_path = __toESM(require("path"));
    import_Utils = __toESM(require("easescript/lib/core/Utils"));
    init_Cache();
    import_Namespace = __toESM(require("easescript/lib/core/Namespace"));
    import_crypto = require("crypto");
    Cache = getCacheManager("common");
    emptyObject = {};
    emptyArray = [];
    annotationIndexers = {
      env: ["name", "value", "expect"],
      runtime: ["platform", "expect"],
      syntax: ["plugin", "expect"],
      plugin: ["name", "expect"],
      version: ["name", "version", "operator", "expect"],
      readfile: ["dir", "load", "suffix", "relative", "lazy", "only", "source"],
      http: ["classname", "action", "param", "data", "method", "config"],
      router: ["classname", "action", "param"],
      alias: ["name", "version"],
      hook: ["type", "version"],
      url: ["source"]
    };
    compareOperatorMaps = {
      ">=": "egt",
      "<=": "elt",
      "!=": "neq",
      ">": "gt",
      "<": "lt",
      "=": "eq"
    };
    compareOperators = [">=", "<=", "!=", ">", "<", "="];
    beginNumericRE = /^\d+/;
    allMethods = ["get", "post", "put", "delete", "option", "router"];
    hashCache = /* @__PURE__ */ Object.create(null);
  }
});

// node_modules/@easescript/transform/lib/core/Asset.js
function isAsset(value) {
  return value ? value instanceof Asset : false;
}
function getAssetsManager(AssetFactory) {
  const records3 = /* @__PURE__ */ new Map();
  function createAsset(sourceFile, id = null, type = null) {
    if (!type) {
      type = import_path3.default.extname(sourceFile);
      if (type.startsWith(".")) {
        type = type.substring(1);
      }
    } else {
      type = String(type);
    }
    let key = sourceFile + ":" + type;
    if (id != null) {
      key = sourceFile + ":" + id + ":" + type;
    }
    let asset = records3.get(key);
    if (!asset) {
      records3.set(sourceFile, asset = new AssetFactory(sourceFile, type, id));
    }
    return asset;
  }
  function createStyleAsset(sourceFile, id = null) {
    return createAsset(sourceFile, id, "style");
  }
  function getAsset(sourceFile, id = null, type = "") {
    let key = sourceFile + ":" + type;
    if (id) {
      key = sourceFile + ":" + id + ":" + type;
    }
    return records3.get(key);
  }
  function getStyleAsset(sourceFile, id = null) {
    return getAsset(sourceFile, id, "style");
  }
  function getAssets() {
    return Array.from(records3.values());
  }
  function setAsset(sourceFile, asset, id = null, type = null) {
    if (!type) {
      type = import_path3.default.extname(sourceFile);
      if (type.startsWith(".")) {
        type = type.substring(1);
      }
    } else {
      type = String(type);
    }
    let key = sourceFile + ":" + type;
    if (id != null) {
      key = sourceFile + ":" + id + ":" + type;
    }
    records3.set(key, asset);
  }
  return {
    createAsset,
    createStyleAsset,
    getStyleAsset,
    getAsset,
    setAsset,
    getAssets
  };
}
var import_path3, import_fs3, import_Utils5, Asset;
var init_Asset = __esm({
  "node_modules/@easescript/transform/lib/core/Asset.js"() {
    import_path3 = __toESM(require("path"));
    import_fs3 = __toESM(require("fs"));
    import_Utils5 = __toESM(require("easescript/lib/core/Utils"));
    Asset = class {
      #code = "";
      #type = "";
      #file = null;
      #sourcemap = null;
      #local = null;
      #imported = null;
      #sourceId = null;
      #outfile = null;
      #id = null;
      #changed = true;
      #attrs = null;
      #initialized = false;
      constructor(sourceFile, type, id = null) {
        this.#type = type;
        this.#file = sourceFile;
        this.#sourceId = sourceFile;
        this.#id = id;
      }
      get code() {
        let code = this.#code;
        if (code)
          return code;
        let file = this.file;
        if (file && import_fs3.default.existsSync(file)) {
          this.#code = import_fs3.default.readFileSync(file).toString("utf8");
        }
        return this.#code;
      }
      set code(value) {
        this.#code = value;
        this.#changed = true;
      }
      get id() {
        return this.#id;
      }
      set id(value) {
        this.#id = value;
      }
      get attrs() {
        return this.#attrs;
      }
      set attrs(value) {
        this.#attrs = value;
      }
      get changed() {
        return this.#changed;
      }
      set changed(value) {
        this.#changed = value;
      }
      get local() {
        return this.#local;
      }
      set local(value) {
        this.#local = value;
      }
      get imported() {
        return this.#imported;
      }
      set imported(value) {
        this.#imported = value;
      }
      get file() {
        return this.#file;
      }
      set file(value) {
        this.#file = value;
      }
      get sourceId() {
        return this.#sourceId;
      }
      set sourceId(value) {
        this.#sourceId = value;
      }
      get type() {
        return this.#type;
      }
      get sourcemap() {
        return this.#sourcemap;
      }
      set sourcemap(value) {
        this.#sourcemap = value;
      }
      get outfile() {
        return this.#outfile;
      }
      set outfile(value) {
        this.#outfile = value;
      }
      initialize(ctx) {
        if (this.#initialized)
          return;
        let outDir = ctx.getOutputDir();
        let publicDir = ctx.getPublicDir();
        let file = String(this.file).trim();
        let sourceFile = file;
        let filename = null;
        let folder = ctx.getSourceFileMappingFolder(file + ".assets");
        if (this.type === "style" && file.includes("?")) {
          sourceFile = file.split("?")[0];
          filename = ctx.genUniFileName(file);
        } else {
          filename = import_path3.default.basename(sourceFile);
        }
        let ext = ctx.getOutputExtName();
        if (!filename.endsWith(ext)) {
          filename = import_path3.default.basename(filename, import_path3.default.extname(filename)) + ext;
        }
        if (folder) {
          this.#outfile = import_Utils5.default.normalizePath(import_path3.default.join(outDir, folder, filename));
        } else {
          let relativeDir = ctx.plugin.complier.getRelativeWorkspace(sourceFile);
          if (relativeDir) {
            relativeDir = import_path3.default.dirname(relativeDir);
          }
          this.#outfile = import_Utils5.default.normalizePath(import_path3.default.join(outDir, folder || publicDir, relativeDir, filename));
        }
      }
      async build(ctx) {
        if (!this.#changed)
          return;
        if (ctx.options.emitFile) {
          let code = this.code;
          if (ctx.options.module === "cjs") {
            code = `module.exports=${JSON.stringify(code)};`;
          } else {
            code = `export default ${JSON.stringify(code)};`;
          }
          this.code = code;
          ctx.emit(this);
        }
        this.#changed = false;
      }
    };
  }
});

// lib/core/Manifest.js
var arrayKey, merge, _instance, _Manifest, Manifest, Manifest_default;
var init_Manifest = __esm({
  "lib/core/Manifest.js"() {
    arrayKey = Symbol("array");
    merge = (target, source) => {
      if (Array.isArray(target)) {
        if (Array.isArray(source)) {
          source.forEach((value, index) => {
            if (Array.isArray(value) && Array.isArray(target[index])) {
              merge(target[index], value);
            } else if (typeof value === "object" && typeof target[index] === "object") {
              merge(target[index], value);
            } else if (!target.includes(value)) {
              target.push(value);
            }
          });
        }
      } else if (typeof target === "object") {
        if (typeof source === "object") {
          Object.keys(source).forEach((key) => {
            if (Array.isArray(target[key]) && Array.isArray(source[key])) {
              merge(target[key], source[key]);
            } else if (typeof target[key] === "object" && typeof source[key] === "object") {
              merge(target[key], source[key]);
            } else {
              target[key] = source[key];
            }
          });
        }
      }
      return target;
    };
    _Manifest = class {
      static add(compilation, name, data) {
        __privateGet(_Manifest, _instance).add(compilation, name, data);
      }
      static emit() {
        return __privateGet(_Manifest, _instance).emit();
      }
      static has(file) {
        return __privateGet(_Manifest, _instance).has(file);
      }
      static del(file) {
        return __privateGet(_Manifest, _instance).del(file);
      }
      static isEmpty() {
        return !(__privateGet(_Manifest, _instance).dataset.size > 0);
      }
      static changed() {
        return __privateGet(_Manifest, _instance).changed;
      }
      static get instance() {
        return __privateGet(_Manifest, _instance);
      }
      constructor() {
        this.dataset = /* @__PURE__ */ new Map();
        this.changed = false;
        this.content = "[]";
      }
      add(compilation, name, object) {
        if (!compilation || !name || !object)
          return;
        this.changed = true;
        let group = this.dataset.get(name);
        if (!group) {
          this.dataset.set(name, group = /* @__PURE__ */ new Map());
        }
        let data = group.get(compilation);
        if (!data) {
          group.set(compilation, data = /* @__PURE__ */ new Map());
          compilation.on("onClear", () => {
            this.changed = true;
            data.delete(compilation);
          });
        }
        if (Array.isArray(object)) {
          const existed = data.get(arrayKey);
          if (existed) {
            merge(existed, object);
          } else {
            data.set(arrayKey, object);
          }
        } else {
          Object.keys(object).forEach((key) => {
            const existed = data.get(key);
            if (existed) {
              merge(existed, object[key]);
            } else {
              data.set(key, object[key]);
            }
          });
        }
      }
      update(name, object) {
        let group = this.dataset.get(name);
        if (group) {
          let keys2 = Array.isArray(object) ? [arrayKey] : Object.keys(object);
          let len = keys2.length;
          for (let data of group) {
            for (let index in keys2) {
              let key = keys2[index];
              if (data.has(key)) {
                keys2.splice(index, 1);
                merge(data.get(key), object[key]);
                break;
              }
            }
            if (!keys2.length) {
              break;
            }
          }
          return keys2.length === len;
        }
        return false;
      }
      has(name) {
        return this.dataset.has(name);
      }
      del(name) {
        return this.dataset.delete(name);
      }
      emit() {
        if (this.changed) {
          this.content = this.toString();
          this.changed = false;
        }
        return this.content;
      }
      toString() {
        if (this.dataset.size > 0) {
          const items = [];
          const make = (obj, indent2 = 0) => {
            let tabs = "	".repeat(indent2);
            let endTabs2 = "	".repeat(indent2 - 1);
            if (Array.isArray(obj)) {
              if (!obj.length)
                return "[]";
              return `[
` + obj.map((item) => {
                return tabs + make(item, indent2 + 1);
              }).join(`,
`) + `
${endTabs2}]`;
            } else {
              const type = typeof obj;
              if (type === "number" || type === "boolean") {
                return obj;
              } else if (type === "string") {
                return `'${obj}'`;
              }
              let keys2 = Object.keys(obj);
              if (!keys2.length)
                return "[]";
              return `[
` + keys2.map((key) => {
                return `${tabs}'${key}'=>${make(obj[key], indent2 + 1)}`;
              }).join(`,
`) + `
${endTabs2}]`;
            }
          };
          const toItem = (group, indent2) => {
            const dataitems = Array.from(group.values());
            const dataGroup = [];
            let tabs = "	".repeat(indent2);
            let endTabs2 = "	".repeat(indent2 - 1);
            dataitems.forEach((data) => {
              data.forEach((object, key) => {
                dataGroup.push(`${tabs}'${key}'=>${make(object, indent2 + 1)}`);
              });
            });
            if (!dataGroup.length)
              return `[]`;
            return `[
` + dataGroup.join(",\n") + `
${endTabs2}]`;
          };
          let indent = 3;
          this.dataset.forEach((group, name) => {
            let tabs = "	".repeat(indent);
            items.push(`${tabs}'${name}'=>${toItem(group, indent + 1)}`);
          });
          let endTabs = "	".repeat(indent - 1);
          return `[
${items.join(",\n")}
${endTabs}]`;
        }
        return `[]`;
      }
    };
    Manifest = _Manifest;
    _instance = new WeakMap();
    __privateAdd(Manifest, _instance, new _Manifest());
    Manifest_default = Manifest;
  }
});

// lib/core/Asset.js
var import_Utils20, import_path7, Asset2;
var init_Asset2 = __esm({
  "lib/core/Asset.js"() {
    init_Asset();
    import_Utils20 = __toESM(require("easescript/lib/core/Utils"));
    import_path7 = __toESM(require("path"));
    init_Common2();
    Asset2 = class extends Asset {
      #initialized = false;
      initialize(ctx) {
        if (this.#initialized)
          return;
        let outDir = ctx.getOutputDir();
        let publicDir = ctx.getPublicDir();
        let file = String(this.file).trim();
        let sourceFile = file;
        let filename = null;
        let folder = ctx.getSourceFileMappingFolder(file + ".assets");
        if (this.type === "style" && file.includes("?")) {
          sourceFile = file.split("?")[0];
          filename = ctx.genUniFileName(file);
        } else {
          filename = import_path7.default.basename(sourceFile);
        }
        if (folder) {
          if (import_path7.default.isAbsolute(folder)) {
            this.outfile = import_Utils20.default.normalizePath(import_path7.default.join(folder, filename));
          } else {
            this.outfile = import_Utils20.default.normalizePath(import_path7.default.join(outDir, folder, filename));
          }
        } else {
          let relativeDir = ctx.plugin.complier.getRelativeWorkspace(sourceFile);
          if (relativeDir) {
            relativeDir = import_path7.default.dirname(relativeDir);
          }
          this.outfile = import_Utils20.default.normalizePath(import_path7.default.join(outDir, publicDir, relativeDir, filename));
        }
        const vm = ctx.getVModule("asset.Manifest");
        vm.append(ctx, createUniqueHashId(file), this.outfile);
      }
      async build(ctx) {
        if (!this.changed)
          return;
        if (ctx.options.emitFile) {
          ctx.emit(this);
        }
        this.changed = false;
      }
    };
  }
});

// lib/core/Common.js
function createStaticReferenceNode2(ctx, stack, className, method) {
  return ctx.createStaticMemberExpression([
    createModuleReferenceNode2(ctx, stack, className),
    ctx.createIdentifier(method, stack)
  ]);
}
function createModuleReferenceNode2(ctx, stack, className) {
  let gloablModule = import_Namespace8.default.globals.get(className);
  if (gloablModule) {
    let context = stack ? stack.module || stack.compilation : null;
    ctx.addDepend(gloablModule, context);
    return ctx.createIdentifier(
      ctx.getModuleReferenceName(gloablModule, context)
    );
  } else {
    throw new Error(`References the '${className}' module is not exists`);
  }
}
function createClassRefsNode(ctx, module2, stack = null) {
  if (!import_Utils21.default.isModule(module2))
    return null;
  let name = null;
  if (import_Utils21.default.isStack(stack)) {
    name = stack.isIdentifier && stack.hasLocalDefined() ? stack.value() : ctx.getModuleReferenceName(module2, stack.module || stack.compilation);
  } else {
    name = ctx.getModuleReferenceName(module2);
  }
  return ctx.createStaticMemberExpression([
    ctx.createIdentifier(name),
    ctx.createIdentifier("class")
  ], stack);
}
function createScopeIdNode(ctx, module2) {
  if (module2 && module2.isModule) {
    return createClassRefsNode(ctx, module2);
  }
  return ctx.createLiteral(null);
}
function createComputedPropertyNode(ctx, stack) {
  return stack.computed ? ctx.createToken(stack.property) : ctx.createLiteral(stack.property.value());
}
function createAddressRefsNode(ctx, argument) {
  let node = ctx.createNode("AddressReferenceExpression");
  node.argument = argument;
  return node;
}
function createArrayAddressRefsNode(ctx, stack, desc2, name, nameNode) {
  if (!desc2)
    return;
  let assignAddress = import_Utils21.default.isStack(desc2) && desc2.assignItems && ctx.getAssignAddressRef(desc2);
  if (assignAddress) {
    let name2 = assignAddress.getName(desc2);
    let rd = assignAddress.createIndexName(stack, desc2);
    if (rd) {
      return ctx.createStaticMemberExpression([
        ctx.createVarIdentifier(name2),
        ctx.createVarIdentifier(rd)
      ]);
    }
  }
  return nameNode || ctx.createVarIdentifier(name);
}
function createExpressionTransformBooleanValueNode(ctx, stack, assignName = null, type = null, originType = null, tokenValue = null) {
  if (stack.isLogicalExpression || stack.isUnaryExpression || stack.isBinaryExpression) {
    return ctx.createToken(stack);
  }
  if (stack.isParenthesizedExpression) {
    return ctx.createParenthesizedExpression(
      createExpressionTransformBooleanValueNode(
        ctx,
        stack.expression,
        assignName,
        type,
        originType,
        tokenValue
      )
    );
  }
  type = type || stack.type();
  originType = originType || ctx.getAvailableOriginType(type);
  if (originType && originType.toLowerCase() === "array") {
    let value = tokenValue || ctx.createToken(stack);
    if (assignName) {
      value = ctx.createAssignmentExpression(
        ctx.createVarIdentifier(assignName),
        value
      );
    }
    return ctx.createCallExpression(
      ctx.createIdentifier("is_array"),
      [value]
    );
  } else if (type.isAnyType || type.isUnionType || type.isIntersectionType || type.isLiteralObjectType) {
    let value = tokenValue || ctx.createToken(stack);
    if (assignName) {
      value = ctx.createAssignmentExpression(
        ctx.createVarIdentifier(assignName),
        value
      );
    }
    return ctx.createCallExpression(
      createStaticReferenceNode2(ctx, stack, "System", "toBoolean"),
      [value]
    );
  }
  return tokenValue || ctx.createToken(stack);
}
function createExpressionTransformTypeNode(ctx, typename, expression2, parenthese = false) {
  let node = ctx.createNode("TypeTransformExpression");
  node.typeName = typename;
  node.expression = expression2;
  if (parenthese) {
    return ctx.createParenthesizedExpression(node);
  }
  return node;
}
function createCommentsNode(ctx, stack, node) {
  const manifests = ctx.options.manifests || {};
  const enable = ctx.options.comments;
  if (stack.module && (enable || manifests.comments)) {
    const result = stack.parseComments("Block");
    if (result) {
      if (manifests.comments && result.meta) {
        let kind = "class";
        if (stack.isMethodSetterDefinition) {
          kind = "setter";
        } else if (stack.isMethodGetterDefinition) {
          kind = "getter";
        } else if (stack.isMethodDefinition) {
          kind = "method";
        } else if (stack.isPropertyDefinition) {
          kind = "property";
        }
        const id = ctx.getModuleNamespace(stack.module, stack.module.id);
        Manifest_default.add(stack.compilation, "comments", {
          [id]: { [node.key.value + ":" + kind]: result.meta }
        });
      }
      if (enable && result.comments.length > 0) {
        return ctx.createChunkExpression(["/**", ...result.comments, "**/"].join("\n"), false);
      }
    }
  }
  return null;
}
function createESMImports2(ctx, importManage) {
  let imports = [];
  importManage.getAllImportSource().forEach((importSource) => {
    if (importSource.isExportSource)
      return;
    let target = importSource.getSourceTarget();
    if (isAsset(target)) {
      return;
    }
    let isExpre = import_Utils21.default.isCompilation(target);
    let isDefault = false;
    if (isExpre) {
      let targetGraph = ctx.graphs.getBuildGraph(target);
      if (targetGraph) {
        let exports = targetGraph.exports;
        if (exports && exports.size === 1) {
          isDefault = Array.from(exports.values()).some((exportSource) => {
            return exportSource.specifiers.length === 1 && exportSource.specifiers[0].type === "default";
          });
        }
      }
    }
    const size = importSource.specifiers.length;
    const specifiers = importSource.specifiers.map((spec) => {
      if (spec.type === "default") {
        if (size === 1 && isDefault) {
          return ctx.createImportSpecifier(spec.local, null, true);
        } else {
          return ctx.createImportSpecifier(spec.local);
        }
      } else if (spec.type === "specifier") {
        return ctx.createImportSpecifier(spec.local, spec.imported);
      } else if (spec.type === "namespace") {
        return ctx.createImportSpecifier(spec.local, null, true);
      }
    });
    const node = ctx.createImportDeclaration(
      importSource.sourceId,
      specifiers,
      isExpre,
      target,
      imports
    );
    if (node) {
      imports.push(ctx.createExpressionStatement(node));
    }
  });
  return imports;
}
function createESMExports2(ctx, exportManage, graph) {
  let importSpecifiers = /* @__PURE__ */ new Map();
  let exports = [];
  let imports = [];
  let declares = [];
  let exportSets = new Set(exportManage.getAllExportSource());
  let properties = [];
  let spreads = [];
  exportSets.forEach((exportSource) => {
    let importSource = exportSource.importSource;
    let sourceId = importSource ? importSource.sourceId : null;
    let specifiers = [];
    let refs = null;
    let isDefault = false;
    graph.addExport(exportSource);
    if (sourceId) {
      let target = importSource.getSourceTarget();
      let isExpre = import_Utils21.default.isCompilation(target);
      refs = import_path8.default.basename(ctx.genUniFileName(sourceId)).replaceAll(".", "_");
      refs = ctx.getGlobalRefName(null, "_" + refs);
      let importNode = ctx.createImportDeclaration(
        sourceId,
        [ctx.createImportSpecifier(refs)],
        isExpre,
        target
      );
      if (importNode) {
        imports.push(
          ctx.createExpressionStatement(
            importNode
          )
        );
      }
      if (isExpre) {
        let targetGraph = ctx.graphs.getBuildGraph(target);
        if (targetGraph) {
          let exports2 = targetGraph.exports;
          if (exports2 && exports2.size === 1) {
            isDefault = Array.from(exports2.values()).some((exportSource2) => {
              return exportSource2.specifiers.length === 1 && exportSource2.specifiers[0].type === "default";
            });
          }
        }
      }
    }
    exportSource.specifiers.forEach((spec) => {
      if (spec.type === "namespace") {
        if (spec.exported) {
          properties.push(
            ctx.createProperty(
              ctx.createLiteral(spec.exported),
              ctx.createVarIdentifier(refs)
            )
          );
        } else if (refs) {
          if (isDefault) {
            spreads.push(ctx.createObjectExpression(
              ctx.createProperty(
                ctx.createLiteral("default"),
                ctx.createVarIdentifier(refs)
              )
            ));
          } else {
            spreads.push(ctx.createVarIdentifier(refs));
          }
        }
      } else if (spec.type === "default") {
        properties.push(
          ctx.createProperty(
            ctx.createLiteral("default"),
            spec.local
          )
        );
      } else if (spec.type === "named" && !sourceId) {
        if (spec.local.type === "VariableDeclaration") {
          spec.local.declarations.map((decl) => {
            properties.push(
              ctx.createProperty(
                ctx.createLiteral(decl.id.value),
                decl.init || ctx.createLiteral(null)
              )
            );
          });
        } else if (spec.local.type === "FunctionDeclaration") {
          spec.local.type = "FunctionExpression";
          properties.push(
            ctx.createProperty(
              ctx.createLiteral(spec.local.key.value),
              spec.local
            )
          );
        }
      } else if (spec.type === "specifier") {
        if (sourceId) {
          let node = [
            refs,
            spec.local,
            spec.exported
          ];
          properties.push(
            ctx.createProperty(
              ctx.createLiteral(spec.local),
              ctx.createVarIdentifier(spec.exported || spec.local)
            )
          );
          specifiers.push(node);
        } else {
          properties.push(ctx.createProperty(
            ctx.createLiteral(spec.exported),
            ctx.createVarIdentifier(spec.local),
            spec.stack
          ));
        }
      }
    });
    if (specifiers.length > 0) {
      let dataset = importSpecifiers.get(sourceId);
      if (!dataset) {
        importSpecifiers.set(sourceId, dataset = []);
      }
      dataset.push(...specifiers);
    }
  });
  importSpecifiers.forEach((specifiers) => {
    let [refs, local, exported] = specifiers;
    declares.push(ctx.createExpressionStatement(
      ctx.createAssignmentExpression(
        ctx.createVarIdentifier(exported || local),
        ctx.createBinaryExpression(
          ctx.createComputeMemberExpression([
            ctx.createIdentifier(refs),
            ctx.createLiteral(local)
          ]),
          ctx.createLiteral(null),
          "??"
        )
      )
    ));
  });
  if (properties.length > 0) {
    if (properties.length === 1 && properties[0].key.value === "default" && !spreads.length) {
      exports.push(
        ctx.createReturnStatement(properties[0].init)
      );
    } else {
      let object = ctx.createObjectExpression(properties);
      if (spreads.length > 0) {
        let args = spreads.map((item) => ctx.createConditionalExpression(
          ctx.createCallExpression(
            ctx.createIdentifier("is_array"),
            [
              item
            ]
          ),
          item,
          ctx.createObjectExpression()
        ));
        object = ctx.createCallExpression(
          ctx.createIdentifier("array_merge"),
          [
            ...args,
            object
          ]
        );
      }
      exports.push(
        ctx.createReturnStatement(object)
      );
    }
  }
  return { imports, exports, declares };
}
function createEmbedAnnotationNode2(ctx, annot, stack) {
  let result = parseUrlAnnotation(ctx, annot);
  if (result.length > 0) {
    let items = result.map((item) => {
      return ctx.createCallExpression(
        createStaticReferenceNode2(ctx, stack, "asset.Manifest", "get"),
        [
          ctx.createLiteral(createUniqueHashId(item.resolve))
        ]
      );
    });
    if (items.length > 1) {
      return ctx.createArrayExpression(items);
    } else {
      return items[0];
    }
  }
  return ctx.createLiteral("");
}
function createUrlAnnotationNode2(ctx, stack) {
  let result = parseUrlAnnotation(ctx, stack);
  if (result.length > 0) {
    let items = result.map((item) => {
      return ctx.createCallExpression(
        createStaticReferenceNode2(ctx, stack, "asset.Manifest", "path"),
        [
          ctx.createLiteral(createUniqueHashId(item.resolve))
        ]
      );
    });
    if (items.length > 1) {
      return ctx.createArrayExpression(items);
    } else {
      return items[0];
    }
  }
  return ctx.createLiteral("");
}
function createReadfileAnnotationNode2(ctx, annot, stack) {
  const result = parseReadfileAnnotation(ctx, annot);
  if (!result)
    return null;
  const addDeps = (source, local) => {
    source = ctx.getSourceFileMappingFolder(source) || source;
    let importSource = ctx.addImport(source, local);
    importSource.setSourceTarget();
  };
  const fileMap = {};
  const localeCxt = result.dir.toLowerCase();
  const getParentFile = (pid) => {
    if (fileMap[pid]) {
      return fileMap[pid];
    }
    if (localeCxt !== pid && pid.includes(localeCxt)) {
      return getParentFile(import_path8.default.dirname(pid));
    }
    return null;
  };
  const dataset = [];
  const namedMap = /* @__PURE__ */ new Set();
  const only = result.only;
  result.files.forEach((file) => {
    const pid = import_path8.default.dirname(file).toLowerCase();
    const named = import_path8.default.basename(file, import_path8.default.extname(file));
    const id = (pid + "/" + named).toLowerCase();
    const filepath2 = result.relative ? ctx.compiler.getRelativeWorkspacePath(file) : file;
    let item = {
      path: filepath2,
      isFile: import_fs6.default.statSync(file).isFile()
    };
    if (item.isFile && result.load) {
      let data = "";
      if (file.endsWith(".env")) {
        const content = dotenv.parse(import_fs6.default.readFileSync(file));
        dotenvExpand.expand({ parsed: content });
        data = JSON.stringify(content);
      } else {
        if (result.lazy) {
          data = `include('${file}')`;
        } else {
          namedMap.add(file);
          data = ctx.getGlobalRefName(annot, "_" + named.replace(/[\.\-]+/g, "_") + namedMap.size);
          addDeps(file, data);
        }
      }
      item.content = data;
    } else if (result.source) {
      item.content = JSON.stringify(import_fs6.default.readFileSync(file));
    }
    const parent = getParentFile(pid);
    if (parent) {
      const children = parent.children || (parent.children = []);
      children.push(item);
    } else {
      fileMap[id + import_path8.default.extname(file)] = item;
      dataset.push(item);
    }
  });
  const make = (list) => {
    return list.map((object) => {
      if (only) {
        return object.content ? ctx.createChunkExpression(object.content) : ctx.createLiteral(null);
      }
      const properties = [
        ctx.createProperty(
          ctx.createIdentifier("path"),
          ctx.createLiteral(object.path)
        )
      ];
      if (object.isFile) {
        properties.push(ctx.createProperty(ctx.createIdentifier("isFile"), ctx.createLiteral(true)));
      }
      if (object.content) {
        properties.push(ctx.createProperty(ctx.createIdentifier("content"), ctx.createChunkExpression(object.content)));
      }
      if (object.children) {
        properties.push(ctx.createProperty(ctx.createIdentifier("children"), ctx.createArrayExpression(make(object.children))));
      }
      return ctx.createObjectExpression(properties);
    });
  };
  return ctx.createArrayExpression(make(dataset));
}
function createMainAnnotationNode2(ctx, stack) {
  if (!stack || !stack.isMethodDefinition)
    return;
  const main = Array.isArray(stack.annotations) ? stack.annotations.find((stack2) => stack2.getLowerCaseName() === "main") : null;
  if (!main)
    return;
  let callMain = ctx.createCallExpression(
    ctx.createStaticMemberExpression([
      ctx.createIdentifier(stack.module.id),
      ctx.createIdentifier(stack.key.value())
    ])
  );
  return ctx.createExpressionStatement(callMain);
}
var import_path8, import_fs6, import_Namespace8, import_Utils21;
var init_Common2 = __esm({
  "lib/core/Common.js"() {
    import_path8 = __toESM(require("path"));
    import_fs6 = __toESM(require("fs"));
    import_Namespace8 = __toESM(require("easescript/lib/core/Namespace"));
    import_Utils21 = __toESM(require("easescript/lib/core/Utils"));
    init_Manifest();
    init_Common();
    init_Asset2();
    init_Common();
  }
});

// lib/core/Generator.js
var require_Generator = __commonJS({
  "lib/core/Generator.js"(exports, module2) {
    var Generator5 = class {
      #file = null;
      #context = null;
      #sourceMap = null;
      #code = "";
      #line = 1;
      #column = 0;
      #indent = 0;
      constructor(context = null, disableSourceMaps = false) {
        if (context) {
          this.#context = context;
          if (disableSourceMaps !== true) {
            this.#file = context.target.file;
            this.#sourceMap = context.options.sourceMaps ? this.createSourceMapGenerator() : null;
          }
        }
      }
      get file() {
        return this.#file;
      }
      get context() {
        return this.#context;
      }
      get sourceMap() {
        return this.#sourceMap;
      }
      get code() {
        return this.#code;
      }
      get line() {
        return this.#line;
      }
      createSourceMapGenerator() {
        let compilation = this.context.compilation;
        let generator = new SourceMap.SourceMapGenerator();
        if (compilation.source) {
          generator.setSourceContent(compilation.file, compilation.source);
        }
        return generator;
      }
      addMapping(node) {
        if (this.sourceMap) {
          const loc = node.loc;
          if (loc) {
            this.sourceMap.addMapping({
              generated: {
                line: this.#line,
                column: this.getStartColumn()
              },
              source: this.#file,
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
        this.#indent++;
        return this;
      }
      endBlock() {
        this.#indent--;
        return this;
      }
      newLine() {
        const len = this.#code.length;
        if (!len)
          return;
        const char = this.#code.charCodeAt(len - 1);
        if (char === 10 || char === 13) {
          return this;
        }
        this.#line++;
        this.#code += "\r\n";
        this.#column = 0;
        return this;
      }
      getStartColumn() {
        if (this.#column === 0) {
          return this.#indent * 4 + 1;
        }
        return this.#column;
      }
      withString(value) {
        if (!value)
          return;
        if (this.#column === 0) {
          this.#column = this.getStartColumn();
          this.#code += "    ".repeat(this.#indent);
        }
        this.#code += value;
        this.#column += value.length || 0;
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
              if (Array.isArray(token.body)) {
                this.withBraceL();
                this.newBlock();
                token.body.length > 0 && this.newLine();
                token.body.forEach((item) => this.make(item));
                this.endBlock();
                token.body.length > 0 && this.newLine();
                this.withBraceR();
              } else {
                this.make(token.body);
              }
            }
            break;
          case "ChunkExpression":
            if (token.value) {
              if (token.newLine !== false) {
                this.newLine();
              }
              let lines = String(token.value).split(/[\r\n]+/);
              lines.forEach((line) => {
                this.withString(line);
                this.newLine();
              });
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
          case "ChainExpression":
            this.make(token.expression);
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
          case "ExportAllDeclaration":
          case "ExportNamedDeclaration":
          case "ExportSpecifier":
          case "ExportAssignmentDeclaration":
            throw new Error("Export declaration should transform to return-statement");
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
            if (token.comments) {
              this.make(token.comments);
              this.newLine();
            }
            if (token.final) {
              this.make(token.final);
              this.withSpace();
            }
            if (token.static) {
              this.withString("static");
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
            if (token.comments) {
              this.make(token.comments);
              this.newLine();
            }
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
            if (token.specifiers && token.specifiers.length > 0) {
              token.specifiers.forEach((item) => {
                this.withString("$" + item.local.value);
                this.withString("=");
              });
            }
            if (token.includeOnce === false) {
              this.withString("include");
            } else {
              this.withString("include_once");
            }
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
              if (token.key.type === "Identifier") {
                this.withString("'" + token.key.value + "'");
              } else {
                this.make(token.key);
              }
            }
            this.withString("=>");
            if (token.init) {
              this.make(token.init);
            } else if (token.key.type === "Identifier") {
              this.withString("$" + token.key.value);
            } else {
              throw new Error("Property token exception.");
            }
            break;
          case "JSXAttribute":
            this.withString(`'${token.name.value}'`);
            this.withString("=>");
            this.make(token.value);
            break;
          case "EnumProperty":
            this.newLine();
            if (token.comments) {
              this.make(token.comments);
              this.newLine();
            }
            if (token.modifier) {
              this.make(token.modifier);
              this.withSpace();
            }
            this.withString("const");
            this.withSpace();
            this.make(token.key);
            this.withString("=");
            this.make(token.init);
            this.withSemicolon();
            this.newLine();
            break;
          case "PropertyDefinition":
            this.newLine();
            if (token.comments) {
              this.make(token.comments);
              this.newLine();
            }
            if (token.static) {
              this.withString("static");
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
            this.withString(token.value.replace(/(?<!\\)\u0027/g, "\\'"));
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
            if (token.kind === "static") {
              this.withString("static");
              this.withSpace();
            }
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
            this.withString(token.source);
            if (token.local) {
              this.withOperator("as");
              this.withString(token.local);
            }
            this.withSemicolon();
            this.newLine();
            break;
          case "NamespaceStatement":
            if (token.source) {
              this.newLine();
              this.withString("namespace");
              this.withSpace();
              this.withString(token.source);
              this.withSemicolon();
              this.newLine();
            }
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
            this.withString(" ");
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
          case "EnumDeclaration":
          case "DeclaratorDeclaration":
            break;
          case "PackageDeclaration":
          case "Program":
            token.body.forEach((item) => this.make(item));
        }
      }
      genClass(token) {
        this.newLine();
        if (token.comments) {
          this.make(token.comments);
          this.newLine();
        }
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
        this.make(token.id);
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
        this.make(token.body);
      }
      genSql(token) {
        this.newLine();
        if (token.comments) {
          this.make(token.comments);
          this.newLine();
        }
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
    module2.exports = Generator5;
  }
});

// lib/transforms/Object.js
function createMethodFunctionNode(ctx, name) {
  return ctx.createLiteral(name);
}
function createCommonCalledNode(name, stack, ctx, object, args, called) {
  if (!called)
    return createMethodFunctionNode(ctx, name);
  return ctx.createCallExpression(
    ctx.createIdentifier(name),
    object ? [object].concat(args) : args
  );
}
var import_Namespace10, Object_default;
var init_Object = __esm({
  "lib/transforms/Object.js"() {
    import_Namespace10 = __toESM(require("easescript/lib/core/Namespace"));
    Object_default = {
      assign(stack, ctx, object, args, called = false, isStatic = false) {
        const module2 = import_Namespace10.default.globals.get("Object");
        ctx.addDepend(module2);
        const name = ctx.getModuleNamespace(module2, "es_object_assign");
        if (!called)
          return createMethodFunctionNode(ctx, name);
        return ctx.createCallExpression(
          ctx.createIdentifier(name),
          args
        );
      },
      keys(stack, ctx, object, args, called = false, isStatic = false) {
        const module2 = import_Namespace10.default.globals.get("Object");
        ctx.addDepend(module2);
        const name = ctx.getModuleNamespace(module2, "es_object_keys");
        if (!called)
          return createMethodFunctionNode(ctx, name);
        return ctx.createCallExpression(
          ctx.createIdentifier(name),
          args
        );
      },
      values(stack, ctx, object, args, called = false, isStatic = false) {
        const module2 = import_Namespace10.default.globals.get("Object");
        ctx.addDepend(module2);
        const name = ctx.getModuleNamespace(module2, "es_object_values");
        if (!called)
          return createMethodFunctionNode(ctx, name);
        return ctx.createCallExpression(
          ctx.createIdentifier(name),
          args
        );
      },
      propertyIsEnumerable(stack, ctx, object, args, called = false, isStatic = false) {
        const module2 = import_Namespace10.default.globals.get("Object");
        ctx.addDepend(module2);
        const name = ctx.getModuleNamespace(module2, "es_object_property_is_enumerable");
        return createCommonCalledNode(name, stack, ctx, object, args, called);
      },
      hasOwnProperty(stack, ctx, object, args, called = false, isStatic = false) {
        const module2 = import_Namespace10.default.globals.get("Object");
        ctx.addDepend(module2);
        const name = ctx.getModuleNamespace(module2, "es_object_has_own_property");
        return createCommonCalledNode(name, stack, ctx, object, args, called);
      },
      valueOf(stack, ctx, object, args, called = false, isStatic = false) {
        const module2 = import_Namespace10.default.globals.get("Object");
        ctx.addDepend(module2);
        const name = ctx.getModuleNamespace(module2, "es_object_value_of");
        return createCommonCalledNode(name, stack, ctx, object, args, called);
      },
      toLocaleString(stack, ctx, object, args, called = false, isStatic = false) {
        const module2 = import_Namespace10.default.globals.get("Object");
        ctx.addDepend(module2);
        const name = ctx.getModuleNamespace(module2, "es_object_to_string");
        return createCommonCalledNode(name, stack, ctx, object, args, called);
      },
      toString(stack, ctx, object, args, called = false, isStatic = false) {
        const module2 = import_Namespace10.default.globals.get("Object");
        ctx.addDepend(module2);
        const name = ctx.getModuleNamespace(module2, "es_object_to_string");
        return createCommonCalledNode(name, stack, ctx, object, args, called);
      }
    };
  }
});

// lib/transforms/Number.js
var Number_exports = {};
__export(Number_exports, {
  default: () => Number_default
});
function createCommonCalledNode4(name, stack, ctx, object, args, called = true) {
  if (!called) {
    return ctx.createLiteral(name.replace(/\\/g, "\\\\"));
  }
  return ctx.createCallExpression(
    ctx.createIdentifier(name),
    [object].concat(args)
  );
}
var import_Namespace16, methods4, Number_default;
var init_Number = __esm({
  "lib/transforms/Number.js"() {
    init_Object();
    init_Common2();
    import_Namespace16 = __toESM(require("easescript/lib/core/Namespace"));
    methods4 = {
      MAX_VALUE(stack, ctx) {
        return ctx.createLiteral(`1.79E+308`, `1.79E+308`);
      },
      MIN_VALUE(stack, ctx) {
        return ctx.createLiteral(`5e-324`, `5e-324`);
      },
      MAX_SAFE_INTEGER(stack, ctx) {
        return ctx.createLiteral(`9007199254740991`, `9007199254740991`);
      },
      POSITIVE_INFINITY(stack, ctx) {
        return ctx.createIdentifier(`Infinity`);
      },
      EPSILON(stack, ctx) {
        return ctx.createLiteral(`2.220446049250313e-16`, `2.220446049250313e-16`);
      },
      isFinite(stack, ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode4("is_finite", stack, ctx, object, args, called);
      },
      isNaN(stack, ctx, object, args, called = false, isStatic = false) {
        if (!called) {
          ctx.addDepend(import_Namespace16.default.globals.get("System"));
          ctx.createChunkExpression(`function($target){return System::isNaN($target);}`);
        }
        return ctx.createCallExpression(
          createStaticReferenceNode2(ctx, object.stack, "System", "isNaN"),
          [object].concat(args)
        );
      },
      isInteger(stack, ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode4("is_int", stack, ctx, object, args, called);
      },
      isSafeInteger(stack, ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode4("is_int", stack, ctx, object, args, called);
      },
      parseFloat(stack, ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode4("floatval", stack, ctx, object, args, called);
      },
      parseInt(stack, ctx, object, args, called = false, isStatic = false) {
        return createCommonCalledNode4("intval", stack, ctx, object, args, called);
      },
      toFixed(stack, ctx, object, args, called = false, isStatic = false) {
        const module2 = import_Namespace16.default.globals.get("Number");
        ctx.addDepend(module2);
        const name = ctx.getModuleNamespace(module2, "es_number_to_fixed");
        return createCommonCalledNode4(name, stack, ctx, object, args, called);
      },
      toExponential(stack, ctx, object, args, called = false, isStatic = false) {
        const module2 = import_Namespace16.default.globals.get("Number");
        ctx.addDepend(module2);
        const name = ctx.getModuleNamespace(module2, "es_number_to_exponential");
        return createCommonCalledNode4(name, stack, ctx, object, args, called);
      },
      toPrecision(stack, ctx, object, args, called = false, isStatic = false) {
        const module2 = import_Namespace16.default.globals.get("Number");
        ctx.addDepend(module2);
        const name = ctx.getModuleNamespace(module2, "es_number_to_precision");
        return createCommonCalledNode4(name, stack, ctx, object, args, called);
      },
      valueOf(stack, ctx, object, args, called = false, isStatic = false) {
        const module2 = import_Namespace16.default.globals.get("Number");
        ctx.addDepend(module2);
        const name = ctx.getModuleNamespace(module2, "es_number_value_of");
        return createCommonCalledNode4(name, stack, ctx, object, args, called);
      }
    };
    ["propertyIsEnumerable", "hasOwnProperty", "toLocaleString", "toString"].forEach((name) => {
      if (!Object.prototype.hasOwnProperty.call(methods4, name)) {
        methods4[name] = Object_default[name];
      }
    });
    Number_default = methods4;
  }
});

// lib/index.js
var lib_exports = {};
__export(lib_exports, {
  Plugin: () => Plugin_default2,
  default: () => lib_default,
  getOptions: () => getOptions
});
module.exports = __toCommonJS(lib_exports);

// lib/core/Plugin.js
var import_path10 = __toESM(require("path"));
var import_Compilation2 = __toESM(require("easescript/lib/core/Compilation"));

// node_modules/@easescript/transform/lib/core/Plugin.js
var import_Compilation = __toESM(require("easescript/lib/core/Compilation"));
var import_path6 = __toESM(require("path"));

// node_modules/@easescript/transform/lib/core/Builder.js
var import_Utils18 = __toESM(require("easescript/lib/core/Utils"));

// node_modules/@easescript/transform/lib/core/Context.js
var import_path2 = __toESM(require("path"));
var import_fs2 = __toESM(require("fs"));

// node_modules/@easescript/transform/lib/core/Node.js
var Node = class {
  static is(value) {
    return value ? value instanceof Node : false;
  }
  static create(type, stack) {
    return new Node(type, stack);
  }
  constructor(type, stack = null) {
    this.type = type;
    if (stack && stack.node && stack.node.loc) {
      this.loc = stack.node.loc;
    }
  }
};
var Node_default = Node;

// node_modules/@easescript/transform/lib/core/Token.js
var Token = class {
  createNode(stack, type) {
    const isString = typeof stack === "string";
    if (!type) {
      type = isString ? stack : stack.toString();
    }
    if (!type)
      return null;
    return Node_default.create(type, isString ? null : stack);
  }
  createIdentifier(value, stack) {
    let node = this.createNode(stack, "Identifier");
    node.value = String(value);
    node.raw = node.value;
    return node;
  }
  createBlockStatement(body) {
    const node = this.createNode("BlockStatement");
    node.body = body || [];
    return node;
  }
  createBinaryExpression(left, right, operator) {
    const node = this.createNode("BinaryExpression");
    node.left = left;
    node.right = right;
    node.operator = operator;
    return node;
  }
  createAssignmentPattern(left, right) {
    const node = this.createNode("AssignmentPattern");
    node.left = left;
    node.right = right;
    return node;
  }
  createLogicalExpression(left, right, operator = "&&") {
    const node = this.createNode("LogicalExpression");
    node.left = left;
    node.right = right;
    node.operator = operator;
    return node;
  }
  createTemplateLiteral(quasis, expressions) {
    const node = this.createNode("TemplateLiteral");
    node.quasis = quasis;
    node.expressions = expressions;
    return node;
  }
  createTemplateElement(text) {
    const node = this.createNode("TemplateElement");
    node.value = text;
    return node;
  }
  createUpdateExpression(argument, operator, prefix = false) {
    const node = this.createNode("UpdateExpression");
    node.argument = argument;
    node.operator = operator;
    node.prefix = prefix;
  }
  createFunctionExpression(block, params = []) {
    const node = this.createNode("FunctionExpression");
    node.params = params;
    node.body = block;
    return node;
  }
  createFunctionDeclaration(key, block, params = []) {
    const node = this.createFunctionExpression(block, params);
    node.type = "FunctionDeclaration";
    node.key = this.createIdentifier(key);
    return node;
  }
  createArrowFunctionExpression(block, params = []) {
    const node = this.createNode("ArrowFunctionExpression");
    node.params = params;
    node.body = block;
    return node;
  }
  createReturnStatement(argument) {
    const node = this.createNode("ReturnStatement");
    if (argument) {
      node.argument = argument;
    }
    return node;
  }
  createMethodDefinition(key, block, params = []) {
    const node = this.createFunctionExpression(block, params);
    node.type = "MethodDefinition";
    node.key = this.createIdentifier(key);
    return node;
  }
  createObjectExpression(properties, stack) {
    const node = this.createNode(stack, "ObjectExpression");
    node.properties = properties || [];
    return node;
  }
  createArrayExpression(elements, stack) {
    const node = this.createNode(stack, "ArrayExpression");
    node.elements = elements || [];
    return node;
  }
  createObjectPattern(properties) {
    const node = this.createNode("ObjectPattern");
    node.properties = properties;
    return node;
  }
  createProperty(key, init, stack) {
    const node = this.createNode(stack, "Property");
    node.key = key;
    node.computed = key.computed;
    node.init = init;
    return node;
  }
  createSpreadElement(argument) {
    const node = this.createNode("SpreadElement");
    node.argument = argument;
    return node;
  }
  createMemberExpression(items, stack) {
    let object = items.shift();
    while (items.length > 1) {
      const _node = this.createNode("MemberExpression");
      _node.object = object;
      _node.property = items.shift();
      object = _node;
    }
    const node = this.createNode(stack, "MemberExpression");
    node.object = object;
    node.property = items.shift();
    return node;
  }
  createComputeMemberExpression(items, stack) {
    const node = this.createMemberExpression(items, stack);
    node.computed = true;
    return node;
  }
  createCallExpression(callee, args, stack) {
    const node = this.createNode(stack, "CallExpression");
    node.callee = callee;
    node.arguments = args;
    return node;
  }
  createNewExpression(callee, args, stack) {
    const node = this.createNode(stack, "NewExpression");
    node.callee = callee;
    node.arguments = args;
    return node;
  }
  createAssignmentExpression(left, right) {
    const node = this.createNode("AssignmentExpression");
    node.left = left;
    node.right = right;
    return node;
  }
  createExpressionStatement(expressions) {
    const node = this.createNode("ExpressionStatement");
    node.expression = expressions;
    return node;
  }
  createMultipleStatement(expressions) {
    const node = this.createNode("MultipleStatement");
    node.expressions = expressions;
    return node;
  }
  createConditionalExpression(test, consequent, alternate) {
    const node = this.createNode("ConditionalExpression");
    node.test = test;
    node.consequent = consequent;
    node.alternate = alternate;
    return node;
  }
  createIfStatement(condition, consequent, alternate) {
    const node = this.createNode("IfStatement");
    node.condition = condition;
    node.consequent = consequent;
    node.alternate = alternate;
    return node;
  }
  createSequenceExpression(items) {
    const node = this.createNode("SequenceExpression");
    node.expressions = items;
    return node;
  }
  createParenthesizedExpression(expression2) {
    const node = this.createNode("ParenthesizedExpression");
    node.expression = expression2;
    return node;
  }
  createUnaryExpression(argument, operator, prefix = false) {
    const node = this.createNode("UnaryExpression");
    node.argument = argument;
    node.operator = operator;
    node.prefix = prefix;
    return node;
  }
  createVariableDeclaration(kind, items, stack) {
    const node = this.createNode(stack, "VariableDeclaration");
    node.kind = kind;
    node.declarations = items;
    return node;
  }
  createVariableDeclarator(id, init, stack) {
    const node = this.createNode(stack, "VariableDeclarator");
    node.id = id;
    node.init = init;
    return node;
  }
  createLiteral(value, raw, stack) {
    const node = this.createNode(stack, "Literal");
    node.value = value;
    if (raw === void 0) {
      if (typeof value === "string") {
        node.raw = `"${value}"`;
      } else {
        node.raw = String(value);
      }
    } else {
      node.raw = String(value);
    }
    return node;
  }
  createClassDeclaration() {
    const node = this.createNode("ClassDeclaration");
    node.body = this.createBlockStatement();
    return node;
  }
  createPropertyDefinition(key, init, isStatic = false) {
    const node = this.createNode("PropertyDefinition");
    node.key = key;
    node.init = init;
    node.static = isStatic;
    return node;
  }
  createChunkExpression(value, newLine = true, semicolon = false) {
    const node = this.createNode("ChunkExpression");
    node.newLine = newLine;
    node.semicolon = semicolon;
    node.value = value;
    node.raw = value;
    return node;
  }
  createThisExpression(stack) {
    return this.createNode(stack, "ThisExpression");
  }
  createSuperExpression(value, stack) {
    const node = this.createNode(stack, "SuperExpression");
    node.value = value;
    return node;
  }
  createImportDeclaration(source, specifiers, stack) {
    const node = this.createNode(stack, "ImportDeclaration");
    node.source = this.createLiteral(source);
    node.specifiers = specifiers;
    return node;
  }
  createImportSpecifier(local, imported = null, hasAs = false) {
    if (!local)
      return null;
    if (imported && !hasAs) {
      const node = this.createNode("ImportSpecifier");
      node.imported = this.createIdentifier(imported);
      node.local = this.createIdentifier(local);
      return node;
    } else if (hasAs) {
      const node = this.createNode("ImportNamespaceSpecifier");
      node.local = this.createIdentifier(local);
      return node;
    } else {
      const node = this.createNode("ImportDefaultSpecifier");
      node.local = this.createIdentifier(local);
      return node;
    }
  }
  createExportAllDeclaration(source, exported, stack) {
    const node = this.createNode(stack, "ExportAllDeclaration");
    if (exported === "*")
      exported = null;
    node.exported = exported ? this.createIdentifier(exported) : null;
    if (!Node_default.is(source)) {
      node.source = this.createLiteral(source);
    } else {
      node.source = source;
    }
    return node;
  }
  createExportDefaultDeclaration(declaration, stack) {
    const node = this.createNode(stack, "ExportDefaultDeclaration");
    if (!Node_default.is(declaration)) {
      declaration = this.createIdentifier(declaration);
    }
    node.declaration = declaration;
    return node;
  }
  createExportNamedDeclaration(declaration, source = null, specifiers = [], stack = null) {
    const node = this.createNode(stack, "ExportNamedDeclaration");
    if (declaration) {
      node.declaration = declaration;
    } else {
      if (source) {
        if (!Node_default.is(source)) {
          node.source = this.createLiteral(source);
        } else {
          node.source = source;
        }
      }
      if (specifiers.length > 0) {
        node.specifiers = specifiers;
      } else {
        throw new Error(`ExportNamedDeclaration arguments 'declaration' or 'source' must have one`);
      }
    }
    return node;
  }
  createExportSpecifier(local, exported = null, stack = null) {
    const node = this.createNode(stack, "ExportSpecifier");
    if (!Node_default.is(exported || local)) {
      node.exported = this.createIdentifier(exported || local);
    } else {
      node.exported = exported || local;
    }
    if (!Node_default.is(local)) {
      node.local = this.createIdentifier(local);
    } else {
      node.local = local;
    }
    return node;
  }
};
var Token_default = Token;

// node_modules/@easescript/transform/lib/core/Context.js
init_Common();

// node_modules/@easescript/transform/lib/core/ImportSource.js
var import_Utils2 = __toESM(require("easescript/lib/core/Utils"));
var ImportManage = class {
  #records = /* @__PURE__ */ new Map();
  #locals = /* @__PURE__ */ new Map();
  createImportSource(sourceId, local = null, imported = null, stack = null) {
    let key = sourceId;
    if (imported === "*") {
      key += ":*";
    }
    let importSource = this.#records.get(key);
    if (!importSource) {
      this.#records.set(key, importSource = new ImportSource(sourceId));
    }
    if (local) {
      const source = this.#locals.get(local);
      if (source) {
        if (source !== importSource) {
          throw new Error(`declare '${local}' is not redefined`);
        }
      } else {
        this.#locals.set(local, importSource);
      }
      importSource.addSpecifier(local, imported, stack);
    }
    return importSource;
  }
  hasImportSource(sourceId, local = null, isNamespace = false) {
    let key = sourceId;
    if (isNamespace) {
      key += ":*";
    }
    let importSource = this.#records.get(key);
    if (!importSource)
      return false;
    if (local) {
      const source = this.#locals.get(local);
      return importSource === source;
    }
    return true;
  }
  getImportSource(sourceId, isNamespace = false) {
    let key = sourceId;
    if (isNamespace) {
      key += ":*";
    }
    return this.#records.get(key);
  }
  getAllImportSource() {
    return Array.from(this.#records.values()).sort((a, b) => {
      let m1 = a.getSourceTarget();
      let m2 = b.getSourceTarget();
      let a1 = import_Utils2.default.isModule(m1) && m1.getName() === "Class" ? 0 : 1;
      let b1 = import_Utils2.default.isModule(m2) && m2.getName() === "Class" ? 0 : 1;
      return a1 - b1;
    });
  }
};
var ImportSource = class {
  #sourceId = null;
  #specifiers = [];
  #fields = null;
  #stack = null;
  #isExportSource = false;
  #sourceTarget = null;
  #sourceContext = null;
  constructor(sourceId) {
    this.#sourceId = sourceId;
    this.#fields = /* @__PURE__ */ Object.create(null);
  }
  get sourceId() {
    return this.#sourceId;
  }
  get specifiers() {
    return this.#specifiers;
  }
  get stack() {
    return this.#stack;
  }
  set stack(value) {
    this.#stack = value;
  }
  get isExportSource() {
    return this.#isExportSource;
  }
  setSourceTarget(value) {
    if (value) {
      this.#sourceTarget = value;
    }
  }
  getSourceTarget() {
    return this.#sourceTarget;
  }
  setExportSource() {
    this.#isExportSource = true;
  }
  getSpecifier(imported) {
    return this.#fields[imported];
  }
  addSpecifier(local, imported = null, stack = null) {
    if (local) {
      let type = imported ? "specifier" : "default";
      if (imported === "*") {
        type = "namespace";
      }
      let key = local;
      let old = this.#fields[key];
      if (old) {
        if (old.type !== type) {
          console.error("import specifier has inconsistent definitions");
        }
        old.type = type;
        return true;
      }
      let spec = {
        type,
        local,
        imported,
        stack
      };
      this.#fields[key] = spec;
      this.#specifiers.push(spec);
      return true;
    }
  }
};

// node_modules/@easescript/transform/lib/core/ExportSource.js
function getExportType(exported, local) {
  let type = local && typeof local === "string" ? "specifier" : "named";
  if (exported === "default")
    type = "default";
  if (local === "*" || !exported) {
    type = "namespace";
  }
  return type;
}
var ExportManage = class {
  #records = /* @__PURE__ */ new Map();
  #exporteds = /* @__PURE__ */ new Map();
  createExportSource(exported, local = null, importSource = null, stack = null) {
    let key = exported;
    if (!key) {
      key = importSource;
    }
    let old = this.#exporteds.get(key);
    if (old) {
      let oLocal = old.getSpecifier(exported).local;
      let left = Node_default.is(oLocal) && oLocal.type === "Identifier" ? oLocal.value : oLocal;
      let right = Node_default.is(local) && local.type === "Identifier" ? local.value : local;
      if (left !== right || importSource != old.importSource) {
        throw new Error(`Multiple exports with the same name "${exported}"`);
      }
    }
    let exportSource = null;
    if (importSource) {
      exportSource = this.#records.get(importSource);
      if (!exportSource) {
        this.#records.set(importSource, exportSource = new ExportSource(importSource, this));
      }
      this.#exporteds.set(key, exportSource);
    } else {
      exportSource = this.#exporteds.get(key);
      if (!exportSource) {
        this.#exporteds.set(key, exportSource = new ExportSource(null, this));
      }
    }
    exportSource.addSpecifier(exported, local, stack);
    return exportSource;
  }
  bindSource(exported, exportSource) {
    this.#exporteds.set(exported, exportSource);
  }
  hasExportSource(exported) {
    return this.#exporteds.has(exported);
  }
  getExportSource(exported) {
    return this.#exporteds.get(exported);
  }
  getAllExportSource() {
    return Array.from(this.#exporteds.values());
  }
};
var ExportSource = class {
  #importSource = null;
  #specifiers = [];
  #fields = null;
  #stack = null;
  #exportManage = null;
  constructor(importSource, exportManage) {
    this.#importSource = importSource;
    this.#fields = /* @__PURE__ */ Object.create(null);
    this.#exportManage = exportManage;
  }
  get importSource() {
    return this.#importSource;
  }
  get specifiers() {
    return this.#specifiers;
  }
  get stack() {
    return this.#stack;
  }
  set stack(value) {
    this.#stack = value;
  }
  bindExport(exporteds) {
    if (Array.isArray(exporteds)) {
      exporteds.forEach((exported) => {
        this.#exportManage.bindSource(exported, this);
      });
    } else if (typeof exporteds === "string") {
      this.#exportManage.bindSource(exporteds, this);
    }
  }
  getSpecifier(exported) {
    return this.#fields[exported];
  }
  addSpecifier(exported, local = null, stack = null) {
    let type = getExportType(exported, local);
    let old = this.#fields[exported];
    if (old) {
      if (old.type !== type) {
        console.error("export specifier has inconsistent definitions");
      }
      old.type = type;
      return true;
    }
    let spec = {
      type,
      local,
      exported,
      stack
    };
    this.#fields[exported] = spec;
    this.#specifiers.push(spec);
    return true;
  }
};

// node_modules/@easescript/transform/lib/core/VirtualModule.js
var import_Namespace2 = __toESM(require("easescript/lib/core/Namespace"));
init_Common();

// node_modules/@easescript/transform/lib/core/Generator.js
var import_source_map = __toESM(require("source-map"));
var disabledNewLine = false;
var Generator2 = class {
  #file = null;
  #context = null;
  #sourceMap = null;
  #code = "";
  #line = 1;
  #column = 0;
  #indent = 0;
  constructor(context = null, disableSourceMaps = false) {
    if (context) {
      this.#context = context;
      if (disableSourceMaps !== true) {
        this.#file = context.target.file;
        this.#sourceMap = context.options.sourceMaps ? this.createSourceMapGenerator() : null;
      }
    }
  }
  get file() {
    return this.#file;
  }
  get context() {
    return this.#context;
  }
  get sourceMap() {
    return this.#sourceMap;
  }
  get code() {
    return this.#code;
  }
  get line() {
    return this.#line;
  }
  createSourceMapGenerator() {
    let compilation = this.context.compilation;
    let generator = new import_source_map.default.SourceMapGenerator();
    if (compilation.source) {
      generator.setSourceContent(compilation.file, compilation.source);
    }
    return generator;
  }
  addMapping(node) {
    if (this.sourceMap) {
      const loc = node.loc;
      if (loc) {
        this.sourceMap.addMapping({
          generated: {
            line: this.#line,
            column: this.getStartColumn()
          },
          source: this.#file,
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
    this.#indent++;
    return this;
  }
  endBlock() {
    this.#indent--;
    return this;
  }
  newLine() {
    const len = this.#code.length;
    if (!len)
      return;
    const char = this.#code.charCodeAt(len - 1);
    if (char === 10 || char === 13) {
      return this;
    }
    this.#line++;
    this.#code += "\r\n";
    this.#column = 0;
    return this;
  }
  getStartColumn() {
    if (this.#column === 0) {
      return this.#indent * 4 + 1;
    }
    return this.#column;
  }
  withString(value) {
    if (!value)
      return;
    if (this.#column === 0) {
      this.#column = this.getStartColumn();
      this.#code += "    ".repeat(this.#indent);
    }
    this.#code += value;
    this.#column += value.length || 0;
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
    const code = this.#code;
    const char = code.charCodeAt(code.length - 1);
    if (char === 59 || char === 10 || char === 13 || char === 32 || char === 125) {
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
      case "ArrayPattern":
        this.withBracketL();
        this.addMapping(token);
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
      case "ArrowFunctionExpression":
        if (token.async) {
          this.withString("async");
          this.withSpace();
        }
        this.withParenthesL();
        this.withSequence(token.params);
        this.withParenthesR();
        this.withString("=>");
        this.make(token.body);
        break;
      case "AssignmentExpression":
      case "AssignmentPattern":
        this.make(token.left);
        this.addMapping(token);
        if (token.operator) {
          this.withString(token.operator);
        } else {
          this.withString("=");
        }
        this.make(token.right);
        break;
      case "AwaitExpression":
        this.withString("await ");
        this.make(token.argument);
        break;
      case "BinaryExpression":
        this.addMapping(token);
        this.make(token.left);
        this.withOperator(token.operator);
        this.make(token.right);
        break;
      case "BreakStatement":
        this.newLine();
        this.addMapping(token);
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
            this.#line += result.length;
          }
          if (token.newLine !== false) {
            this.newLine();
          }
        }
        break;
      case "CallExpression":
        this.addMapping(token);
        this.make(token.callee);
        if (token.isChainExpression) {
          this.withString("?.");
        }
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
      case "ClassStatement":
        this.withString("class");
        this.withSpace();
        this.make(token.key);
        if (token.extends) {
          this.withSpace();
          this.withString("extends");
          this.withSpace();
          this.make(token.extends);
        }
        this.make(token.body);
        this.newLine();
        break;
      case "ConditionalExpression":
        this.addMapping(token);
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
        this.addMapping(token);
        this.withString("continue");
        if (token.label) {
          this.withSpace();
          this.make(token.label);
        }
        this.withSemicolon();
        break;
      case "ChainExpression":
        this.make(token.expression);
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
      case "MultipleStatement":
        token.expressions.forEach((exp) => this.make(exp));
        this.newLine();
        break;
      case "ExportDefaultDeclaration":
        this.newLine();
        this.addMapping(token);
        this.withString("export default ");
        if (token.declaration.type === "ExpressionStatement") {
          this.make(token.declaration.expression);
        } else {
          this.make(token.declaration);
        }
        this.withSemicolon();
        break;
      case "ExportAllDeclaration":
        this.addMapping(token);
        this.newLine();
        this.withString("export");
        this.withSpace();
        this.withString("*");
        this.withSpace();
        if (token.exported) {
          this.withString("as");
          this.withSpace();
          this.make(token.exported);
          this.withSpace();
        }
        this.withString("from");
        this.withSpace();
        this.make(token.source);
        this.withSemicolon();
        break;
      case "ExportNamedDeclaration":
        this.newLine();
        this.addMapping(token);
        this.withString("export");
        this.withSpace();
        if (token.specifiers && token.specifiers.length > 0) {
          this.withBraceL();
          this.newLine();
          this.newBlock();
          this.withSequence(token.specifiers, true);
          this.endBlock();
          this.newLine();
          this.withBraceR();
        } else if (token.declaration) {
          disabledNewLine = true;
          this.make(token.declaration);
          disabledNewLine = false;
        }
        if (token.source) {
          this.withSpace();
          this.withString("from");
          this.withSpace();
          this.make(token.source);
        }
        this.withSemicolon();
        break;
      case "ExportSpecifier":
        this.addMapping(token);
        this.make(token.local);
        if (token.exported.value !== token.local.value) {
          this.withString(" as ");
          this.make(token.exported);
        }
        break;
      case "ForInStatement":
        this.newLine();
        this.withString("for");
        this.withParenthesL();
        this.make(token.left);
        this.withOperator("in");
        this.make(token.right);
        this.withParenthesR();
        this.make(token.body);
        if (token.body.type !== "BlockStatement") {
          this.withSemicolon();
        }
        break;
      case "ForOfStatement":
        this.newLine();
        this.withString("for");
        this.withParenthesL();
        this.make(token.left);
        this.withOperator("of");
        this.make(token.right);
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
        {
          let isNewLine = token.type === "FunctionDeclaration" || token.kind === "method" || token.kind === "get" || token.kind === "set";
          if (isNewLine && !disabledNewLine && !token.disabledNewLine)
            this.newLine();
          if (token.async) {
            this.withString("async");
            this.withSpace();
          }
          if (token.static && token.kind === "method") {
            this.withString("static");
            this.withSpace();
          }
          if (token.kind === "method") {
            this.make(token.key);
          } else {
            this.withString("function");
            if (token.key && !token.key.computed) {
              this.withSpace();
              this.make(token.key);
            }
          }
          this.withParenthesL();
          this.withSequence(token.params);
          this.withParenthesR();
          this.make(token.body);
          if (isNewLine && !disabledNewLine && !token.disabledNewLine)
            this.newLine();
        }
        break;
      case "FunctionExpression":
        this.addMapping(token);
        if (token.async) {
          this.withString("async");
          this.withSpace();
        }
        this.withString("function");
        this.withParenthesL();
        this.withSequence(token.params);
        this.withParenthesR();
        this.make(token.body);
        break;
      case "Identifier":
        this.addMapping(token);
        this.withString(token.value);
        break;
      case "IfStatement":
        this.newLine();
        this.withString("if");
        this.withParenthesL();
        this.make(token.condition);
        this.withParenthesR();
        this.make(token.consequent);
        if (token.condition.type !== "BlockStatement") {
          this.withSemicolon();
        }
        if (token.alternate) {
          this.withString("else");
          if (token.alternate.type === "IfStatement") {
            this.withSpace();
          }
          this.make(token.alternate);
          if (token.alternate.type !== "BlockStatement") {
            this.withSemicolon();
          }
        }
        break;
      case "ImportDeclaration":
        this.withString("import");
        this.withSpace();
        let lefts = [];
        let rights = [];
        token.specifiers.forEach((item) => {
          if (item.type === "ImportDefaultSpecifier" || item.type === "ImportNamespaceSpecifier") {
            lefts.push(item);
          } else {
            rights.push(item);
          }
        });
        if (rights.length > 0) {
          if (lefts.length > 0) {
            this.make(lefts[0]);
            this.withComma();
          }
          this.withBraceL();
          this.withSequence(rights);
          this.withBraceR();
          this.withSpace();
          this.withString("from");
          this.withSpace();
        } else if (lefts.length > 0) {
          this.make(lefts[0]);
          this.withSpace();
          this.withString("from");
          this.withSpace();
        }
        this.make(token.source);
        this.withSemicolon();
        this.newLine();
        break;
      case "ImportSpecifier":
        if (token.imported && token.local.value !== token.imported.value) {
          this.make(token.imported);
          this.withOperator("as");
        }
        this.make(token.local);
        break;
      case "ImportNamespaceSpecifier":
        this.withString(" * ");
        this.withOperator("as");
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
        this.addMapping(token);
        this.make(token.label);
        this.withString(":");
        this.make(token.body);
        break;
      case "Literal":
        this.addMapping(token);
        if (this.foreSingleQuotationMarks) {
          this.withString(token.raw.replace(/\u0022/g, "'"));
        } else {
          this.withString(token.raw);
        }
        break;
      case "LogicalExpression":
        this.make(token.left);
        this.withOperator(token.operator);
        this.make(token.right);
        break;
      case "MemberExpression":
        this.addMapping(token);
        this.make(token.object);
        if (token.computed) {
          if (token.optional) {
            this.withString("?.");
          }
          this.withBracketL();
          this.make(token.property);
          this.withBracketR();
        } else {
          if (token.optional) {
            this.withString("?.");
          } else {
            this.withString(".");
          }
          this.make(token.property);
        }
        break;
      case "NewExpression":
        this.addMapping(token);
        this.withString("new");
        this.withSpace();
        this.make(token.callee);
        this.withParenthesL();
        this.withSequence(token.arguments);
        this.withParenthesR();
        break;
      case "ObjectExpression":
        this.addMapping(token);
        this.withBraceL();
        if (token.properties.length > 0) {
          this.newBlock();
          this.newLine();
          this.withSequence(token.properties, true);
          this.newLine();
          this.endBlock();
        }
        this.withBraceR();
        break;
      case "ObjectPattern":
        this.withBraceL();
        this.addMapping(token);
        token.properties.forEach((property, index) => {
          if (property) {
            if (property.type === "RestElement") {
              this.make(property);
            } else {
              this.make(property.key);
              if (property.init && (property.init.type === "AssignmentPattern" || property.key.value !== property.init.value)) {
                this.withColon();
                this.make(property.init);
              }
            }
            if (index < token.properties.length - 1) {
              this.withComma();
            }
          }
        });
        this.withBraceR();
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
        this.addMapping(token);
        if (token.computed) {
          this.withBracketL();
          this.make(token.key);
          this.withBracketR();
        } else {
          this.make(token.key);
        }
        if (token.init) {
          this.withColon();
          this.make(token.init);
        }
        break;
      case "PropertyDefinition":
        this.addMapping(token);
        this.newLine();
        if (token.static) {
          this.withString("static");
          this.withSpace();
        }
        this.make(token.key);
        if (token.init) {
          this.withOperator("=");
          this.make(token.init);
        }
        this.newLine();
        break;
      case "RestElement":
        this.addMapping(token);
        this.withString("...");
        this.withString(token.value);
        break;
      case "ReturnStatement":
        this.addMapping(token);
        this.newLine();
        this.withString("return");
        this.withSpace();
        this.make(token.argument);
        this.withSemicolon();
        break;
      case "SequenceExpression":
        this.withSequence(token.expressions);
        break;
      case "SpreadElement":
        this.withString("...");
        this.addMapping(token);
        this.make(token.argument);
        break;
      case "SuperExpression":
        this.addMapping(token);
        if (token.value) {
          this.withString(token.value);
        } else {
          this.withString("super");
        }
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
        this.withString(token.value);
        break;
      case "TemplateLiteral":
        const expressions = token.expressions;
        this.withString("`");
        token.quasis.map((item, index) => {
          const has2 = item.value;
          if (has2) {
            this.make(item);
          }
          if (index < expressions.length) {
            this.withString("$");
            this.withBraceL();
            this.make(expressions[index]);
            this.withBraceR();
          }
        });
        this.withString("`");
        break;
      case "ThisExpression":
        this.addMapping(token);
        this.withString(token.value || "this");
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
        if (token.finalizer) {
          this.withString("finally");
          this.make(token.finalizer);
        }
        break;
      case "UnaryExpression":
        this.addMapping(token);
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
        this.addMapping(token);
        if (token.prefix) {
          this.withString(token.operator);
          this.make(token.argument);
        } else {
          this.make(token.argument);
          this.withString(token.operator);
        }
        break;
      case "VariableDeclaration":
        this.addMapping(token);
        if (!token.inFor && !disabledNewLine)
          this.newLine();
        this.withString(token.kind);
        this.withSpace();
        this.withSequence(token.declarations);
        if (!token.inFor) {
          this.withSemicolon();
          this.newLine();
        }
        break;
      case "VariableDeclarator":
        this.addMapping(token);
        this.make(token.id);
        if (token.init) {
          this.withOperator("=");
          this.make(token.init);
        }
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
      case "ClassDeclaration": {
        this.newLine();
        this.addMapping(token);
        this.withString("class");
        this.withSpace();
        this.make(token.id);
        if (token.extends) {
          this.withSpace();
          this.withString("extends");
          this.make(token.extends);
        }
        this.make(token.body);
        break;
      }
      case "InterfaceDeclaration":
      case "EnumDeclaration":
      case "DeclaratorDeclaration":
      case "PackageDeclaration":
      case "Program":
        token.body.forEach((item) => this.make(item));
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
        this.withString(" ");
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
      case "JSXAttribute":
        {
          let esx = this.#context.options.esx;
          if (esx.raw) {
            this.addMapping(token);
            this.withSpace();
            this.make(token.name);
            if (token.value) {
              this.withString("=");
              this.withString(esx.delimit.attrs.left);
              if (token.value) {
                this.foreSingleQuotationMarks = ops.delimit.attrs.left === '"';
                this.make(token.value);
                this.foreSingleQuotationMarks = false;
              }
              this.withString(ops.delimit.attrs.right);
            }
          } else {
            if (token.parent && token.parent.type === "ObjectExpression") {
              this.make(token.name);
              this.withColon();
              this.make(token.value);
            }
          }
        }
        break;
      case "JSXSpreadAttribute":
        this.addMapping(token);
        this.withString("{...");
        this.make(token.argument);
        this.withString("}");
        break;
      case "JSXNamespacedName":
        this.addMapping(token);
        this.make(token.name);
        break;
      case "JSXExpressionContainer":
        this.addMapping(token);
        if (token.expression) {
          this.withString(token.left || "{");
          this.make(token.expression);
          this.withString(token.right || "}");
        }
        break;
      case "JSXOpeningFragment":
      case "JSXOpeningElement":
        this.addMapping(token);
        this.withString("<");
        this.make(token.name);
        token.attributes.forEach((attribute) => {
          this.make(attribute);
        });
        if (token.selfClosing) {
          this.withString(" />");
        } else {
          this.withString(">");
        }
        break;
      case "JSXClosingFragment":
      case "JSXClosingElement":
        this.addMapping(token);
        this.withString("</");
        this.make(token.name);
        this.withString(">");
        break;
      case "JSXElement":
        this.addMapping(token);
        let has = token.children.length > 0;
        this.make(token.openingElement);
        if (has)
          this.newLine();
        this.newBlock();
        token.children.forEach((child, index) => {
          if (index > 0)
            this.newLine();
          this.make(child);
        });
        this.endBlock();
        if (has)
          this.newLine();
        this.make(token.closingElement);
        this.newLine();
        break;
      case "JSXFragment":
        this.withString("<>");
        this.newLine();
        token.children.forEach((child) => {
          this.make(child);
        });
        this.newLine();
        this.withString("</>");
        this.newLine();
        break;
      case "JSXText":
        this.withString(token.value);
        break;
    }
  }
  genSql(token) {
    this.newLine();
    if (token.comments) {
      this.make(token.comments);
      this.newLine();
    }
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
    return this.#code;
  }
};
var Generator_default = Generator2;

// node_modules/@easescript/transform/lib/core/Constant.js
var Constant_exports = {};
__export(Constant_exports, {
  KIND_ACCESSOR: () => KIND_ACCESSOR,
  KIND_CLASS: () => KIND_CLASS,
  KIND_CONST: () => KIND_CONST,
  KIND_ENUM: () => KIND_ENUM,
  KIND_ENUM_PROPERTY: () => KIND_ENUM_PROPERTY,
  KIND_INTERFACE: () => KIND_INTERFACE,
  KIND_METHOD: () => KIND_METHOD,
  KIND_VAR: () => KIND_VAR,
  MODIFIER_ABSTRACT: () => MODIFIER_ABSTRACT,
  MODIFIER_FINAL: () => MODIFIER_FINAL,
  MODIFIER_PRIVATE: () => MODIFIER_PRIVATE,
  MODIFIER_PROTECTED: () => MODIFIER_PROTECTED,
  MODIFIER_PUBLIC: () => MODIFIER_PUBLIC,
  MODIFIER_STATIC: () => MODIFIER_STATIC,
  PRIVATE_NAME: () => PRIVATE_NAME
});
var KIND_CLASS = 1 << 0;
var KIND_INTERFACE = 1 << 1;
var KIND_ENUM = 1 << 2;
var KIND_VAR = 1 << 3;
var KIND_CONST = 1 << 4;
var KIND_METHOD = 1 << 5;
var KIND_ACCESSOR = 1 << 6;
var KIND_ENUM_PROPERTY = 1 << 7;
var MODIFIER_STATIC = 1 << 8;
var MODIFIER_PUBLIC = 1 << 9;
var MODIFIER_PROTECTED = 1 << 10;
var MODIFIER_PRIVATE = 1 << 11;
var MODIFIER_ABSTRACT = 1 << 12;
var MODIFIER_FINAL = 1 << 13;
var PRIVATE_NAME = "_private";

// node_modules/@easescript/transform/lib/core/VirtualModule.js
var VirtualModule = class {
  #id = "";
  #ns = [];
  #file = null;
  #content = "";
  #ext = ".virtual";
  #exports = [];
  #imports = [];
  #changed = true;
  #references = /* @__PURE__ */ new Map();
  constructor(id, ns) {
    this.#id = id;
    this.#ns = Array.isArray(ns) ? ns : String(ns).split(".");
  }
  get ns() {
    return this.#ns;
  }
  get id() {
    return this.#id;
  }
  get bindModule() {
    return import_Namespace2.default.globals.get(this.getName());
  }
  get file() {
    return this.#file || this.getName("/") + this.#ext;
  }
  set file(value) {
    this.#file = value;
  }
  get ext() {
    return this.#ext;
  }
  set ext(value) {
    this.#ext = value;
  }
  get imports() {
    return this.#imports;
  }
  get exports() {
    return this.#exports;
  }
  get changed() {
    return this.#changed;
  }
  set changed(value) {
    this.#changed = value;
  }
  addExport(exported, local = null, importSource = null, stack = null) {
    let has = this.#exports.some((item) => item[0] === exported);
    if (!has) {
      this.#exports.push([exported, local, importSource, stack]);
    }
  }
  addImport(source, local = null, imported = null) {
    let has = this.#imports.some((item) => item[0] === source && item[1] === local);
    if (!has) {
      this.#imports.push([source, local, imported]);
    }
  }
  addReference(className, local = null) {
    local = local || String(className).split(".").pop();
    this.#references.set(className, local);
  }
  getReferenceName(className) {
    return this.#references.get(className);
  }
  getReferences() {
    return this.#references;
  }
  getName(seg = ".") {
    return this.#ns.concat(this.#id).join(seg);
  }
  getSourcemap() {
    return null;
  }
  getContent() {
    return this.#content;
  }
  setContent(content) {
    this.#content = content;
    this.#changed = true;
  }
  createImports(ctx) {
    this.#imports.forEach((args) => {
      ctx.addImport(...args);
    });
  }
  createExports(ctx) {
    let exportName = this.id;
    this.#exports.forEach(([exported, local, importSource, stack]) => {
      if (exported === "default") {
        if (typeof local === "string") {
          exportName = local;
        } else if (local.type === "Identifier") {
          exportName = local.value;
        }
      }
      if (typeof local === "string") {
        local = ctx.createIdentifier(local);
      }
      ctx.addExport(exported, local, importSource, stack);
    });
    return exportName;
  }
  createReferences(ctx) {
    let context = this.bindModule || this;
    this.getReferences().forEach((local, classname) => {
      let module2 = import_Namespace2.default.globals.get(classname);
      if (module2) {
        ctx.addDepend(module2, context);
      }
    });
  }
  gen(ctx, graph, body = []) {
    let imports = [];
    let exports = [];
    let exportNodes = null;
    let importNodes = null;
    if (ctx.options.module === "cjs") {
      importNodes = createCJSImports(ctx, ctx.imports);
      exportNodes = createCJSExports(ctx, ctx.exports, graph);
    } else {
      importNodes = createESMImports(ctx, ctx.imports);
      exportNodes = createESMExports(ctx, ctx.exports, graph);
    }
    imports.push(...importNodes, ...exportNodes.imports);
    body.push(...exportNodes.declares);
    exports.push(...exportNodes.exports);
    const generator = new Generator_default(ctx, false);
    const layout = [
      ...imports,
      ctx.createChunkExpression(this.getContent()),
      ...body,
      ...exports
    ];
    layout.forEach((item) => generator.make(item));
    return generator;
  }
  async build(ctx, graph) {
    if (!this.#changed && graph.code)
      return graph;
    this.#changed = false;
    this.createImports(ctx);
    this.createReferences(ctx, graph);
    let module2 = this.bindModule;
    let emitFile = ctx.options.emitFile;
    let body = [];
    let exportName = this.createExports(ctx);
    if (this.id === "Class" && this.#ns.length === 0) {
      let properties = Object.keys(Constant_exports).map((key) => {
        if (key === "PRIVATE_NAME")
          return;
        return ctx.createProperty(
          ctx.createIdentifier(key),
          ctx.createLiteral(Constant_exports[key])
        );
      }).filter(Boolean);
      properties.sort((a, b) => {
        return a.init.value - b.init.value;
      });
      body.push(
        ctx.createExpressionStatement(
          ctx.createAssignmentExpression(
            ctx.createMemberExpression([
              ctx.createIdentifier("Class"),
              ctx.createIdentifier("constant")
            ]),
            ctx.createObjectExpression(properties)
          )
        )
      );
    } else {
      body.push(
        this.createClassDescriptors(ctx, exportName, this.id)
      );
    }
    if (module2) {
      ctx.createDeclaratorModuleImportReferences(module2, module2, graph);
    }
    if (emitFile) {
      await ctx.buildDeps();
    }
    ctx.createAllDependencies();
    graph.code = this.gen(ctx, graph, body).code;
    graph.sourcemap = this.getSourcemap();
    if (emitFile) {
      graph.outfile = ctx.getOutputAbsolutePath(this);
    }
    return graph;
  }
  createClassDescriptors(ctx, exportName, className) {
    return ctx.createCallExpression(
      createStaticReferenceNode(ctx, null, "Class", "creator"),
      [
        ctx.createIdentifier(exportName),
        ctx.createObjectExpression([
          ctx.createProperty(
            ctx.createIdentifier("m"),
            ctx.createLiteral(KIND_CLASS | MODIFIER_PUBLIC)
          ),
          ctx.createProperty(
            ctx.createIdentifier("name"),
            ctx.createLiteral(className)
          )
        ])
      ]
    );
  }
};
function isVModule(value) {
  return value ? value instanceof VirtualModule : false;
}
function getVirtualModuleManager(VirtualModuleFactory) {
  const virtualization = /* @__PURE__ */ new Map();
  function createVModule(sourceId, factory = VirtualModuleFactory) {
    sourceId = Array.isArray(sourceId) ? sourceId.join(".") : String(sourceId);
    let old = virtualization.get(sourceId);
    if (old)
      return old;
    let segs = sourceId.split(".");
    let vm = new factory(segs.pop(), segs);
    virtualization.set(sourceId, vm);
    return vm;
  }
  function getVModule(sourceId) {
    return virtualization.get(sourceId);
  }
  function hasVModule(sourceId) {
    return virtualization.has(sourceId);
  }
  function getVModules() {
    return Array.from(virtualization.values());
  }
  function setVModule(sourceId, vm) {
    return virtualization.set(sourceId, vm);
  }
  return {
    createVModule,
    isVModule,
    hasVModule,
    setVModule,
    getVModules,
    getVModule
  };
}

// node_modules/@easescript/transform/lib/core/Context.js
var import_Utils3 = __toESM(require("easescript/lib/core/Utils"));
var import_Range = __toESM(require("easescript/lib/core/Range"));
var import_crypto2 = require("crypto");
var Context = class extends Token_default {
  static is(value) {
    return value ? value instanceof Context : false;
  }
  #target = null;
  #dependencies = /* @__PURE__ */ new Map();
  #plugin = null;
  #nodes = /* @__PURE__ */ new Map();
  #imports = new ImportManage();
  #exports = new ExportManage();
  #afterBody = [];
  #beforeBody = [];
  #variables = null;
  #graphs = null;
  #assets = null;
  #virtuals = null;
  #glob = null;
  #cache = null;
  #token = null;
  constructor(compiOrVModule, plugin2, variables, graphs, assets, virtuals, glob, cache2, token) {
    super();
    this.#plugin = plugin2;
    this.#target = compiOrVModule;
    this.#variables = variables;
    this.#graphs = graphs;
    this.#assets = assets;
    this.#virtuals = virtuals;
    this.#glob = glob;
    this.#cache = cache2;
    this.#token = token;
  }
  get plugin() {
    return this.#plugin;
  }
  get compiler() {
    return this.#plugin.complier;
  }
  get target() {
    return this.#target;
  }
  get options() {
    return this.#plugin.options;
  }
  get imports() {
    return this.#imports;
  }
  get exports() {
    return this.#exports;
  }
  get afterBody() {
    return this.#afterBody;
  }
  get beforeBody() {
    return this.#beforeBody;
  }
  get variables() {
    return this.#variables;
  }
  get graphs() {
    return this.#graphs;
  }
  get assets() {
    return this.#assets;
  }
  get virtuals() {
    return this.#virtuals;
  }
  get cache() {
    return this.#cache;
  }
  get glob() {
    return this.#glob;
  }
  get token() {
    return this.#token;
  }
  get dependencies() {
    return this.#dependencies;
  }
  async buildDeps() {
    const ctx = this.plugin.context;
    await ctx.buildDeps(this);
  }
  createAsset(source) {
    let asset = this.assets.createAsset(source);
    if (asset) {
      asset.initialize(this);
    }
    return asset;
  }
  createStyleAsset(source, index) {
    let asset = this.assets.createStyleAsset(source, index);
    if (asset) {
      asset.initialize(this);
    }
    return asset;
  }
  getVModule(sourceId) {
    return this.virtuals.getVModule(sourceId);
  }
  hasVModule(sourceId) {
    return this.virtuals.hasVModule(sourceId);
  }
  isVModule(module2) {
    if (module2) {
      if (module2.isDeclaratorModule) {
        return this.hasVModule(module2.getName());
      } else if (this.virtuals.isVModule(module2)) {
        return true;
      }
    }
    return false;
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
    if (type === "TypeDefinition")
      return null;
    if (type === "TypeGenericDefinition")
      return null;
    if (type === "DeclaratorDeclaration")
      return null;
    return this.#token.create(this, stack, type);
  }
  addNodeToAfterBody(node) {
    if (node) {
      let afterBody = this.#afterBody || (this.#afterBody = []);
      afterBody.push(node);
    }
    return node;
  }
  addNodeToBeforeBody(node) {
    if (node) {
      let beforeBody = this.#beforeBody || (this.#beforeBody = []);
      beforeBody.push(node);
    }
    return node;
  }
  addImport(source, local = null, imported = null, stack = null) {
    return this.#imports.createImportSource(source, local, imported, stack);
  }
  getImport(source, isNamespace = false) {
    return this.#imports.getImportSource(source, isNamespace);
  }
  hasImport(source, local = null, isNamespace = false) {
    return this.#imports.hasImportSource(source, local, isNamespace);
  }
  addExport(exported, local = null, importSource = null, stack = null) {
    return this.#exports.createExportSource(exported, local, importSource, stack);
  }
  hasExport(exported) {
    return this.#exports.hasExportSource(exported);
  }
  addDepend(dep, context = null) {
    context = context || this.target;
    let deps = this.#dependencies.get(context);
    if (!deps) {
      this.#dependencies.set(context, deps = /* @__PURE__ */ new Set());
    }
    deps.add(dep);
  }
  getDependencies(context = null) {
    context = context || this.target;
    return this.#dependencies.get(context);
  }
  getAllDependencies() {
    const deps = /* @__PURE__ */ new Set();
    this.#dependencies.forEach((dataset) => {
      dataset.forEach((dep) => deps.add(dep));
    });
    return deps;
  }
  isUsed(module2, context = null) {
    if (!module2)
      return false;
    context = context || this.target;
    let deps = this.#dependencies.get(context);
    if (deps && deps.has(module2)) {
      return true;
    }
    if (this.isVModule(module2))
      return true;
    return module2.compilation === this.target;
  }
  isActiveModule(depModule, context = null) {
    if (!depModule)
      return false;
    context = context || this.target;
    if (!this.isUsed(depModule, context))
      return false;
    if (depModule.isDeclaratorModule) {
      if (this.hasVModule(depModule.getName())) {
        return true;
      }
      if (this.isDeclaratorModuleDependency(depModule)) {
        return true;
      }
      return false;
    } else {
      if (isVModule(depModule))
        return true;
      if (context) {
        return !import_Utils3.default.checkDepend(context, depModule);
      }
      return true;
    }
  }
  isNeedBuild(module2) {
    if (!module2)
      return false;
    if (isVModule(module2))
      return true;
    if (this.cache.has(module2, "isNeedBuild")) {
      return this.cache.has(module2, "isNeedBuild");
    }
    let result = this.compiler.isPluginInContext(this.plugin, module2);
    if (result) {
      const annots = getModuleAnnotations(module2, ["runtime", "syntax"]);
      if (annots.length > 0) {
        result = annots.every((annot) => {
          const data = parseMacroAnnotation(annot);
          if (!data) {
            throw new Error("Annotations parse data exception.");
          }
          const name = annot.getLowerCaseName();
          switch (name) {
            case "runtime":
              return isRuntime(data.value, this.options.metadata || {}) === data.expect;
            case "syntax":
              return isSyntax(data.value, this.plugin.version) === data.expect;
          }
          return false;
        });
      }
    }
    this.cache.has(module2, "isNeedBuild", result);
    return result;
  }
  hasDeclareModule(module2) {
    if (import_Utils3.default.isCompilation(this.target)) {
      if (this.target.modules.has(module2.getName())) {
        return true;
      }
      return this.target.importModuleNameds.has(module2);
    } else if (import_Utils3.default.isModule(this.target)) {
      const vm = this.getVModule(this.target.getName());
      if (vm) {
        return !!vm.getReferenceName(module2.getName());
      }
    }
    return false;
  }
  setNode(stack, node) {
    this.#nodes.set(stack, node);
  }
  getNode(stack) {
    return this.#nodes.get(stack);
  }
  removeNode(stack) {
    this.#nodes.delete(stack);
  }
  getModuleReferenceName(module2, context = null) {
    let name = null;
    if (isVModule(module2)) {
      let m = module2.bindModule;
      if (!m) {
        name = module2.getName("_");
        return this.getGlobalRefName(null, name);
      } else {
        module2 = m;
      }
    } else if (!import_Utils3.default.isModule(module2)) {
      return null;
    }
    if (!context)
      context = this.target;
    if (import_Utils3.default.isModule(context)) {
      if (context.isDeclaratorModule) {
        const vm = this.getVModule(context.getName());
        if (vm) {
          name = vm.getReferenceName(module2.getName());
        }
      }
      if (!name) {
        name = context.getReferenceNameByModule(module2);
      }
    } else if (import_Utils3.default.isCompilation(context)) {
      name = context.getReferenceName(module2);
    }
    if (this.hasDeclareModule(module2)) {
      return name;
    }
    if (!name) {
      name = module2.getName("_");
    }
    return this.getGlobalRefName(null, name);
  }
  isDeclaratorModuleDependency(module2) {
    if (!import_Utils3.default.isClassType(module2))
      return false;
    if (module2.required && module2.isAnnotationCreated) {
      return true;
    } else if (module2.isDeclaratorModule) {
      return module2.getImportDeclarations().some((item) => {
        if (item.isImportDeclaration && item.source.isLiteral) {
          return item.specifiers.some((spec) => spec.value() === module2.id);
        }
        return false;
      });
    }
    return false;
  }
  isES6ClassModule(module2) {
    const annots = getModuleAnnotations(module2, ["define"], false);
    return annots.some((annot) => {
      const data = parseDefineAnnotation(annot);
      return data.es6class;
    });
  }
  isLoadAssetsRawCode(stack, resolveFile) {
    if (!stack || !resolveFile)
      return false;
    if (!stack.isAnnotationDeclaration)
      return false;
    if (stack.getLowerCaseName() !== "embed")
      return false;
    if (/\.[m|c]?js$/i.test(resolveFile))
      return true;
    return this.compiler.isExtensionFile(resolveFile);
  }
  createDeclaratorModuleImportReferences(module2, context, graph = null) {
    if (!import_Utils3.default.isModule(module2))
      return;
    if (!graph && context) {
      graph = this.getBuildGraph(context);
    }
    this.createRequires(module2, context, graph);
    this.createModuleImportReferences(module2, context, graph);
  }
  createModuleImportReferences(module2, context = null, graph = null) {
    if (!import_Utils3.default.isModule(module2))
      return;
    if (!graph) {
      graph = this.getBuildGraph(module2);
    }
    module2.getImportDeclarations().forEach((item) => {
      if (item.source.isLiteral) {
        parseImportDeclaration(this, item, context || module2, graph);
      }
    });
  }
  resolveAsset(rawAsset, context) {
    if (rawAsset.file) {
      let source = rawAsset.resolve;
      let specifiers = null;
      if (rawAsset.assign) {
        specifiers = [
          {
            local: rawAsset.assign,
            stack: rawAsset.stack
          }
        ];
      }
      source = this.getImportAssetsMapping(source, {
        group: "imports",
        source,
        specifiers,
        ctx: this,
        context
      });
      if (source) {
        let asset = this.createAsset(source);
        asset.file = rawAsset.resolve;
        if (rawAsset.assign) {
          asset.local = rawAsset.assign;
        }
        return { asset, specifiers };
      }
    } else {
      let { index, type, attrs = {} } = rawAsset;
      let lang = attrs.lang || attrs.type || "css";
      let suffix = "file." + lang;
      let _attrs = { ...attrs, index, type, lang, [suffix]: "" };
      let source = this.getModuleResourceId(context, _attrs);
      let asset = this.createStyleAsset(source, index);
      asset.code = rawAsset.content;
      asset.attrs = _attrs;
      return { asset };
    }
    return null;
  }
  createAssets(context, graph) {
    const assets = context.assets;
    if (assets && assets.size > 0) {
      assets.forEach((rawAsset) => {
        let { asset, specifiers } = this.resolveAsset(rawAsset, context);
        if (asset) {
          if (graph)
            graph.addAsset(asset);
          let source = this.getAssetsImportSource(asset, context);
          if (source) {
            let importSource = null;
            if (specifiers && specifiers.length > 0) {
              specifiers.forEach((spec) => {
                importSource = this.addImport(source, spec.local, spec.imported);
              });
            } else {
              importSource = this.addImport(source);
            }
            importSource.setSourceTarget(asset);
            if (graph) {
              graph.addImport(importSource);
            }
          }
        }
      });
    }
  }
  createRequires(module2, context, graph) {
    const requires = module2.requires;
    if (requires && requires.size > 0) {
      requires.forEach((item) => {
        let local = item.name;
        if (import_Utils3.default.isStack(item.stack) && item.stack.parentStack && item.stack.parentStack.isAnnotationDeclaration) {
          let additional = item.stack.parentStack.additional;
          if (additional && additional.isDeclaratorDeclaration && additional.module.id === local) {
            local = this.getModuleReferenceName(additional.module, context);
          }
        }
        this.createRequire(
          module2,
          graph,
          item.from,
          local,
          item.namespaced ? "*" : item.key
        );
      });
    }
  }
  createRequire(context, graph, source, local, imported = null) {
    if (!source)
      return;
    let specifiers = [{
      local,
      imported
    }];
    let target = source;
    source = this.getImportAssetsMapping(source, {
      group: "imports",
      source,
      specifiers,
      context: this,
      owner: context
    });
    if (source) {
      let importSource = null;
      if (specifiers.length > 0) {
        specifiers.forEach((spec) => {
          importSource = this.addImport(source, spec.local, spec.imported);
        });
      } else {
        importSource = this.addImport(source);
      }
      if (importSource) {
        importSource.setSourceTarget(target);
      }
      if (importSource && graph) {
        graph.addImport(importSource);
      }
    }
  }
  crateModuleAssets(module2) {
    if (!import_Utils3.default.isModule(module2))
      return;
    const graph = this.getBuildGraph(module2);
    this.createAssets(module2, graph);
    this.createRequires(module2, null, graph);
  }
  crateRootAssets() {
    const compilation = this.target;
    if (compilation) {
      const graph = this.getBuildGraph(compilation);
      this.createAssets(compilation, graph);
      this.createRequires(compilation, null, graph);
    }
  }
  createAllDependencies() {
    const target = this.target;
    const compilation = import_Utils3.default.isCompilation(target) ? target : null;
    this.#dependencies.forEach((deps, moduleOrCompi) => {
      const graph = this.getBuildGraph(moduleOrCompi);
      deps.forEach((depModule) => {
        if (!(import_Utils3.default.isModule(depModule) || isVModule(depModule)))
          return;
        if (depModule === target || compilation && compilation.modules.has(depModule.getName())) {
          return;
        }
        if (moduleOrCompi !== depModule && this.isNeedBuild(depModule)) {
          graph.addDepend(depModule);
          if (!depModule.isDeclaratorModule || this.isVModule(depModule)) {
            const name = this.getModuleReferenceName(depModule, moduleOrCompi);
            const source = this.getModuleImportSource(depModule, moduleOrCompi);
            const importSource = this.addImport(source, name);
            importSource.setSourceTarget(depModule);
            graph.addImport(importSource);
          } else if (depModule.isDeclaratorModule) {
            this.createDeclaratorModuleImportReferences(depModule, moduleOrCompi, graph);
          }
        }
      });
    });
  }
  createModuleDependencies(module2) {
    if (!import_Utils3.default.isModule(module2))
      return;
    let deps = this.getDependencies(module2);
    if (!deps)
      return;
    const graph = this.getBuildGraph(module2);
    const compilation = module2.compilation;
    deps.forEach((depModule) => {
      if (!(import_Utils3.default.isModule(depModule) || isVModule(depModule)))
        return;
      if (compilation && compilation.modules && compilation.modules.has(depModule.getName())) {
        return;
      }
      if (module2 !== depModule && this.isNeedBuild(depModule)) {
        graph.addDepend(depModule);
        if (!depModule.isDeclaratorModule || this.isVModule(depModule)) {
          const name = this.getModuleReferenceName(depModule, module2);
          const source = this.getModuleImportSource(depModule, module2);
          const importSource = this.addImport(source, name);
          importSource.setSourceTarget(depModule);
          graph.addImport(importSource);
        } else if (depModule.isDeclaratorModule) {
          this.createDeclaratorModuleImportReferences(depModule, module2, graph);
        }
      }
    });
  }
  hasBuildGraph(module2) {
    return this.graphs.hasBuildGraph(module2 || this.target);
  }
  getBuildGraph(module2 = null) {
    let compilation = this.target;
    let graphs = this.graphs;
    if (!module2 || compilation === module2) {
      return graphs.createBuildGraph(compilation);
    }
    if (import_Utils3.default.isModule(module2)) {
      if (module2.isDeclaratorModule) {
        const vm = this.getVModule(module2.getName());
        if (vm) {
          return graphs.createBuildGraph(vm, vm);
        }
      }
      let mainModule = compilation.mainModule;
      if (module2 === mainModule) {
        return graphs.createBuildGraph(compilation, module2);
      }
      let graph = graphs.createBuildGraph(module2, module2);
      if (mainModule) {
        let parent = graphs.createBuildGraph(compilation, mainModule);
        parent.addChild(graph);
      }
      return graph;
    } else {
      if (isVModule(module2)) {
        return graphs.createBuildGraph(module2, module2);
      } else {
        throw new Error("Exception module params");
      }
    }
  }
  getGlobalRefName(stack, name, group = null) {
    if (!stack) {
      if (import_Utils3.default.isModule(this.target)) {
        stack = this.target.compilation.stack;
      } else {
        stack = this.target.stack;
      }
      stack = stack || this;
    }
    let variables = this.variables;
    if (group) {
      let key = "getGlobalRefName:" + name;
      if (this.cache.has(group, key)) {
        return this.cache.get(group, key);
      } else {
        let value = variables.hasRefs(stack, name, true) ? variables.genGlobalRefs(stack, name) : variables.getGlobalRefs(stack, name);
        this.cache.set(group, key, value);
        return value;
      }
    }
    return variables.getGlobalRefs(stack, name);
  }
  getLocalRefName(stack, name, group = null) {
    if (!stack) {
      if (import_Utils3.default.isModule(this.target)) {
        stack = this.target.compilation.stack;
      } else {
        stack = this.target.stack;
      }
      stack = stack || this;
    }
    let variables = this.variables;
    if (group) {
      let key = "getLocalRefName:" + name;
      if (this.cache.has(group, key)) {
        return this.cache.get(group, key);
      } else {
        let value = variables.hasRefs(stack, name) ? variables.genLocalRefs(stack, name) : variables.getLocalRefs(stack, name);
        this.cache.set(group, key, value);
        return value;
      }
    }
    return variables.getLocalRefs(stack, name);
  }
  getImportAssetsMapping(file, options = {}) {
    if (!options.group) {
      options.group = "imports";
    }
    if (!options.delimiter) {
      options.delimiter = "/";
    }
    return this.resolveImportSource(file, options);
  }
  getSourceFileMappingFolder(file, flag) {
    const result = this.resolveSourceFileMappingPath(file, "folders");
    return flag && !result ? file : result;
  }
  getModuleMappingFolder(module2) {
    if (import_Utils3.default.isModule(module2)) {
      return this.resolveSourceFileMappingPath(module2.getName("/") + ".module", "folders");
    } else if (module2 && module2.file) {
      return this.resolveSourceFileMappingPath(module2.file, "folders");
    }
    return null;
  }
  getAssetsImportSource(asset, context) {
    let source = asset.sourceId;
    if (this.options.emitFile) {
      source = this.getRelativePath(
        asset.outfile,
        this.getOutputAbsolutePath(context)
      );
    }
    return source;
  }
  getModuleImportSource(source, context, sourceId = null) {
    const config = this.options;
    const isString = typeof source === "string";
    if (isString && isExternalDependency(this.options.dependences.externals, source, context)) {
      return source;
    }
    if (isString && source.includes("${__filename}")) {
      const owner = import_Utils3.default.isModule(context) ? context.compilation : context;
      source = source.replace("${__filename}", import_Utils3.default.isCompilation(owner) ? owner.file : this.target.file);
    }
    if (isString && source.includes("/node_modules/")) {
      if (import_path2.default.isAbsolute(source))
        return source;
      if (!sourceId) {
        return this.resolveSourceFileMappingPath(source, "imports") || source;
      }
      return sourceId;
    }
    if (isString && !import_path2.default.isAbsolute(source)) {
      return source;
    }
    if (config.emitFile) {
      return this.getOutputRelativePath(source, context);
    }
    return isString ? source : this.getModuleResourceId(source);
  }
  getModuleResourceId(module2, query = {}) {
    return this.compiler.parseResourceId(module2, query);
  }
  resolveSourceFileMappingPath(file, group, delimiter = "/") {
    return this.resolveSourceId(file, group, delimiter);
  }
  resolveSourceId(id, group, delimiter = "/") {
    let glob = this.#glob;
    if (!glob)
      return null;
    let data = { group, delimiter, failValue: null };
    if (typeof group === "object") {
      data = group;
    }
    return glob.dest(id, data);
  }
  resolveImportSource(id, ctx = {}) {
    let glob = this.#glob;
    if (!glob)
      return id;
    const scheme = glob.scheme(id, ctx);
    let source = glob.parse(scheme, ctx);
    let rule = scheme.rule;
    if (!rule) {
      source = id;
    }
    return source;
  }
  genUniFileName(source, suffix = null) {
    source = String(source);
    let query = source.includes("?");
    if (import_path2.default.isAbsolute(source) || query) {
      let file = source;
      if (query) {
        file = source.split("?")[0];
      }
      let ext = import_path2.default.extname(file);
      suffix = suffix || ext;
      return import_path2.default.basename(file, ext) + "-" + (0, import_crypto2.createHash)("sha256").update(source).digest("hex").substring(0, 8) + suffix;
    }
    return source;
  }
  getPublicDir() {
    return this.options.publicDir || "assets";
  }
  getOutputDir() {
    return this.options.outDir || ".output";
  }
  getOutputExtName() {
    return this.options.outExt || ".js";
  }
  getOutputAbsolutePath(source, secondDir = null) {
    const isStr = typeof source === "string";
    const suffix = this.getOutputExtName();
    let output = this.getOutputDir();
    if (!source)
      return output;
    let key = source;
    if (secondDir) {
      output = import_path2.default.join(output, secondDir);
      key = source + secondDir;
    }
    if (this.cache.has(key, "Context.getOutputAbsolutePath")) {
      return this.cache.get(key, "Context.getOutputAbsolutePath");
    }
    let folder = isStr ? this.getSourceFileMappingFolder(source) : this.getModuleMappingFolder(source);
    let filename = null;
    if (isStr) {
      filename = folder ? import_path2.default.basename(source) : this.compiler.getRelativeWorkspacePath(source, true) || this.genUniFileName(source);
    } else {
      if (import_Utils3.default.isModule(source)) {
        if (source.isDeclaratorModule) {
          const vm = this.getVModule(source.getName()) || source;
          filename = folder ? vm.id : vm.getName("/");
        } else {
          filename = folder ? source.id : source.getName("/");
        }
      } else if (isVModule(source)) {
        filename = folder ? source.id : source.getName("/");
      } else if (source.file) {
        filename = folder ? import_path2.default.basename(source.file) : this.compiler.getRelativeWorkspacePath(source.file) || this.genUniFileName(source.file);
      }
    }
    if (!filename) {
      throw new Error("File name not resolved correctly");
    }
    let info = import_path2.default.parse(filename);
    if (!info.ext || this.compiler.isExtensionName(info.ext)) {
      filename = import_path2.default.join(info.dir, info.name + suffix);
    }
    let result = null;
    if (folder) {
      result = import_Utils3.default.normalizePath(
        import_path2.default.resolve(
          import_path2.default.isAbsolute(folder) ? import_path2.default.join(folder, filename) : import_path2.default.join(output, folder, filename)
        )
      );
    } else {
      result = import_Utils3.default.normalizePath(
        import_path2.default.resolve(
          import_path2.default.join(output, filename)
        )
      );
    }
    if (result.includes("?")) {
      result = import_path2.default.join(import_path2.default.dirname(result), this.genUniFileName(result, import_path2.default.extname(result)));
    }
    this.cache.set(key, "Context.getOutputAbsolutePath", result);
    return result;
  }
  getOutputRelativePath(source, context) {
    return this.getRelativePath(
      this.getOutputAbsolutePath(source),
      this.getOutputAbsolutePath(context)
    );
  }
  getRelativePath(source, context) {
    return "./" + import_Utils3.default.normalizePath(
      import_path2.default.relative(
        import_path2.default.dirname(context),
        source
      )
    );
  }
  getVNodeApi(name) {
    let local = this.getGlobalRefName(null, name);
    this.addImport("vue", local, name);
    return local;
  }
  async emit(buildGraph) {
    let outfile = buildGraph.outfile;
    if (outfile) {
      import_fs2.default.mkdirSync(import_path2.default.dirname(outfile), { recursive: true });
      import_fs2.default.writeFileSync(outfile, buildGraph.code);
      let sourcemap = buildGraph.sourcemap;
      if (sourcemap) {
        import_fs2.default.writeFileSync(outfile + ".map", JSON.stringify(sourcemap.toJSON()));
      }
    }
  }
  error(message, stack = null) {
    if (this.target) {
      let range = stack && stack instanceof import_Range.default ? stack : null;
      if (!range && import_Utils3.default.isStack(stack)) {
        range = this.target.getRangeByNode(stack.node);
      }
      const file = this.target.file;
      if (range) {
        message += ` (${file}:${range.start.line}:${range.start.column})`;
      } else {
        message += `(${file})`;
      }
    }
    import_Utils3.default.error(message);
  }
  warn(message, stack = null) {
    if (this.target) {
      let range = stack && stack instanceof import_Range.default ? stack : null;
      if (!range && import_Utils3.default.isStack(stack)) {
        range = this.target.getRangeByNode(stack.node);
      }
      const file = this.target.file;
      if (range) {
        message += ` (${file}:${range.start.line}:${range.start.column})`;
      } else {
        message += `(${file})`;
      }
    }
    import_Utils3.default.warn(message);
  }
};
var Context_default = Context;

// node_modules/@easescript/transform/lib/core/Builder.js
init_Common();

// node_modules/@easescript/transform/lib/core/Variable.js
var import_Utils4 = __toESM(require("easescript/lib/core/Utils"));
var import_Scope = __toESM(require("easescript/lib/core/Scope"));
var REFS_All = 31;
var REFS_TOP = 16;
var REFS_UP_CLASS = 8;
var REFS_UP_FUN = 4;
var REFS_UP = 2;
var REFS_DOWN = 1;
var Manage = class {
  #ctxScope = null;
  #cache = /* @__PURE__ */ new Map();
  constructor(ctxScope) {
    this.#ctxScope = ctxScope;
  }
  get(name) {
    return this.#cache.get(name);
  }
  has(name) {
    return this.#cache.has(name);
  }
  get ctxScope() {
    return this.#ctxScope;
  }
  check(name, scope, flags = REFS_All) {
    if (this.#cache.has(name))
      return true;
    if (!import_Scope.default.is(scope)) {
      return false;
    }
    if (flags === REFS_All) {
      return scope.checkDocumentDefineScope(name, ["class"]);
    }
    if (scope.isDefine(name)) {
      return true;
    }
    let index = 0;
    let flag = 0;
    while (flag < (flags & REFS_All)) {
      flag = Math.pow(2, index++);
      switch (flags & flag) {
        case REFS_DOWN:
          if (scope.declarations.has(name) || scope.hasChildDeclared(name))
            return true;
        case REFS_UP:
          if (scope.isDefine(name))
            return true;
        case REFS_TOP:
          if (scope.isDefine(name) || scope.hasChildDeclared(name))
            return true;
        case REFS_UP_FUN:
          if (scope.isDefine(name, "function"))
            return true;
        case REFS_UP_CLASS:
          if (scope.isDefine(name, "class"))
            return true;
      }
    }
    return false;
  }
  gen(name, scope, flags = REFS_All, begin = 0) {
    let index = begin;
    let value = name;
    while (this.check(value = name + index, scope, flags)) {
      index++;
    }
    this.#cache.set(name, value);
    this.#cache.set(value, value);
    return value;
  }
  getRefs(name, scope, flags = REFS_All) {
    if (scope) {
      if (this.check(name, scope, flags)) {
        return this.gen(name, scope, flags);
      } else {
        this.#cache.set(name, name);
      }
    } else {
      this.#cache.set(name, name);
    }
    return name;
  }
};
function getVariableManager() {
  const records3 = /* @__PURE__ */ new Map();
  function _getVariableManage(ctxScope) {
    let manage = records3.get(ctxScope);
    if (!manage) {
      records3.set(ctxScope, manage = new Manage(ctxScope));
    }
    return manage;
  }
  function hasScopeDefined(context, name, isTop = false, flags = REFS_All) {
    let manage = getVariableManage(context, isTop);
    if (import_Utils4.default.isStack(context)) {
      return manage.check(name, context.scope, flags);
    }
    return false;
  }
  function hasGlobalScopeDefined(context, name) {
    return hasScopeDefined(context, name, true, REFS_All);
  }
  function hasLocalScopeDefined(context, name) {
    return hasScopeDefined(context, name, false, REFS_DOWN | REFS_UP_FUN);
  }
  function hasRefs(context, name, isTop = false) {
    let manage = getVariableManage(context, isTop);
    return manage.has(name);
  }
  function getRefs(context, name, isTop = false, flags = REFS_All) {
    let manage = null;
    let ctxScope = context;
    let scope = null;
    if (import_Utils4.default.isStack(context)) {
      scope = context.scope;
      if (!import_Scope.default.is(scope)) {
        throw new Error("Variable.getRefs scope invalid");
      }
      manage = _getVariableManage(
        isTop ? scope.getScopeByType("top") : scope.getScopeByType("function") || scope.getScopeByType("top")
      );
    } else {
      manage = _getVariableManage(ctxScope);
    }
    if (manage.has(name)) {
      return manage.get(name);
    }
    return manage.getRefs(name, scope, flags);
  }
  function getVariableManage(context, isTop = false) {
    if (import_Utils4.default.isStack(context)) {
      let scope = context.scope;
      if (!import_Scope.default.is(scope)) {
        throw new Error("Variable.getRefs scope invalid");
      }
      return _getVariableManage(
        isTop ? scope.getScopeByType("top") : scope.getScopeByType("function") || scope.getScopeByType("top")
      );
    } else {
      return _getVariableManage(context);
    }
  }
  function getGlobalRefs(context, name) {
    return getRefs(context, name, true, REFS_All);
  }
  function getLocalRefs(context, name) {
    return getRefs(context, name, false, REFS_DOWN | REFS_UP_FUN);
  }
  function genRefs(context, name, isTop = false, flags = REFS_DOWN | REFS_UP_FUN) {
    let manage = getVariableManage(context, isTop);
    if (import_Utils4.default.isStack(context)) {
      return manage.gen(name, context.scope, flags);
    } else {
      return manage.gen(name, null, flags);
    }
  }
  function genGlobalRefs(context, name) {
    return genRefs(context, name, true, REFS_All);
  }
  function genLocalRefs(context, name) {
    return genRefs(context, name, false, REFS_DOWN | REFS_UP_FUN);
  }
  function clearAll() {
    records3.clear();
  }
  return {
    getVariableManage,
    getRefs,
    getLocalRefs,
    getGlobalRefs,
    hasRefs,
    hasGlobalScopeDefined,
    hasLocalScopeDefined,
    genGlobalRefs,
    genLocalRefs,
    clearAll
  };
}

// node_modules/@easescript/transform/lib/core/BuildGraph.js
var BuildGraph = class {
  #code = "";
  #sourcemap = null;
  #module = null;
  #dependencies = null;
  #imports = null;
  #assets = null;
  #exports = null;
  #children = null;
  #parent = null;
  #outfile = null;
  constructor(module2) {
    this.#module = module2;
  }
  get module() {
    return this.#module;
  }
  get code() {
    return this.#code;
  }
  set code(value) {
    this.#code = value;
  }
  get sourcemap() {
    return this.#sourcemap;
  }
  set sourcemap(value) {
    this.#sourcemap = value;
  }
  get dependencies() {
    return this.#dependencies;
  }
  get imports() {
    return this.#imports;
  }
  get exports() {
    return this.#exports;
  }
  get assets() {
    return this.#assets;
  }
  get children() {
    return this.#children;
  }
  get parent() {
    return this.#parent;
  }
  get outfile() {
    return this.#outfile;
  }
  set outfile(value) {
    this.#outfile = value;
  }
  addChild(child) {
    if (child.#parent)
      return;
    let children = this.#children;
    if (!children) {
      this.#children = children = /* @__PURE__ */ new Set();
    }
    children.add(child);
    child.#parent = this;
  }
  addImport(importSource) {
    let imports = this.#imports;
    if (!imports) {
      this.#imports = imports = /* @__PURE__ */ new Set();
    }
    imports.add(importSource);
  }
  addExport(exportSource) {
    let exports = this.#exports;
    if (!exports) {
      this.#exports = exports = /* @__PURE__ */ new Set();
    }
    exports.add(exportSource);
  }
  addDepend(module2) {
    let deps = this.#dependencies;
    if (!deps) {
      this.#dependencies = deps = /* @__PURE__ */ new Set();
    }
    deps.add(module2);
  }
  addAsset(asset) {
    let assets = this.#assets;
    if (!assets) {
      this.#assets = assets = /* @__PURE__ */ new Set();
    }
    assets.add(asset);
  }
  findAsset(filter) {
    let assets = this.#assets;
    if (assets) {
      for (let asset of assets) {
        if (filter(asset)) {
          return asset;
        }
      }
    }
    return null;
  }
};
function getBuildGraphManager() {
  const records3 = /* @__PURE__ */ new Map();
  function createBuildGraph(moduleOrCompilation, module2 = null) {
    let old = records3.get(moduleOrCompilation);
    if (old)
      return old;
    let graph = new BuildGraph(module2);
    records3.set(moduleOrCompilation, graph);
    return graph;
  }
  function getBuildGraph(moduleOrCompilation) {
    return records3.get(moduleOrCompilation);
  }
  function setBuildGraph(moduleOrCompilation, graph) {
    return records3.set(moduleOrCompilation, graph);
  }
  function hasBuildGraph(moduleOrCompilation) {
    return records3.has(moduleOrCompilation);
  }
  function clear(compilation) {
    keys.forEach(([value, key]) => {
      if (key === compilation || key.compilation === compilation) {
        records3.delete(key);
      }
    });
  }
  function clearAll() {
    records3.clear();
    mainGraphs.clear();
  }
  return {
    clear,
    clearAll,
    setBuildGraph,
    getBuildGraph,
    createBuildGraph,
    hasBuildGraph
  };
}

// node_modules/@easescript/transform/lib/core/Builder.js
init_Asset();
init_Cache();

// node_modules/@easescript/transform/lib/tokens/index.js
var tokens_exports = {};
__export(tokens_exports, {
  AnnotationDeclaration: () => AnnotationDeclaration_default,
  AnnotationExpression: () => AnnotationExpression_default,
  ArrayExpression: () => ArrayExpression_default,
  ArrayPattern: () => ArrayPattern_default,
  ArrowFunctionExpression: () => ArrowFunctionExpression_default,
  AssignmentExpression: () => AssignmentExpression_default,
  AssignmentPattern: () => AssignmentPattern_default,
  AwaitExpression: () => AwaitExpression_default,
  BinaryExpression: () => BinaryExpression_default,
  BlockStatement: () => BlockStatement_default,
  BreakStatement: () => BreakStatement_default,
  CallExpression: () => CallExpression_default,
  ChainExpression: () => ChainExpression_default,
  ClassDeclaration: () => ClassDeclaration_default,
  ConditionalExpression: () => ConditionalExpression_default,
  ContinueStatement: () => ContinueStatement_default,
  Declarator: () => Declarator_default,
  DeclaratorDeclaration: () => DeclaratorDeclaration_default,
  DoWhileStatement: () => DoWhileStatement_default,
  EmptyStatement: () => EmptyStatement_default,
  EnumDeclaration: () => EnumDeclaration_default,
  EnumProperty: () => EnumProperty_default,
  ExportAllDeclaration: () => ExportAllDeclaration_default,
  ExportDefaultDeclaration: () => ExportDefaultDeclaration_default,
  ExportNamedDeclaration: () => ExportNamedDeclaration_default,
  ExportSpecifier: () => ExportSpecifier_default,
  ExpressionStatement: () => ExpressionStatement_default,
  ForInStatement: () => ForInStatement_default,
  ForOfStatement: () => ForOfStatement_default,
  ForStatement: () => ForStatement_default,
  FunctionDeclaration: () => FunctionDeclaration_default,
  FunctionExpression: () => FunctionExpression_default,
  Identifier: () => Identifier_default,
  IfStatement: () => IfStatement_default,
  ImportDeclaration: () => ImportDeclaration_default,
  ImportDefaultSpecifier: () => ImportDefaultSpecifier_default,
  ImportExpression: () => ImportExpression_default,
  ImportNamespaceSpecifier: () => ImportNamespaceSpecifier_default,
  ImportSpecifier: () => ImportSpecifier_default,
  InterfaceDeclaration: () => InterfaceDeclaration_default,
  JSXAttribute: () => JSXAttribute_default,
  JSXCdata: () => JSXCdata_default,
  JSXClosingElement: () => JSXClosingElement_default,
  JSXClosingFragment: () => JSXClosingFragment_default,
  JSXElement: () => JSXElement,
  JSXEmptyExpression: () => JSXEmptyExpression_default,
  JSXExpressionContainer: () => JSXExpressionContainer_default,
  JSXFragment: () => JSXFragment_default,
  JSXIdentifier: () => JSXIdentifier_default,
  JSXMemberExpression: () => JSXMemberExpression_default,
  JSXNamespacedName: () => JSXNamespacedName_default,
  JSXOpeningElement: () => JSXOpeningElement_default,
  JSXOpeningFragment: () => JSXOpeningFragment_default,
  JSXScript: () => JSXScript_default,
  JSXSpreadAttribute: () => JSXSpreadAttribute_default,
  JSXStyle: () => JSXStyle_default,
  JSXText: () => JSXText_default,
  LabeledStatement: () => LabeledStatement_default,
  Literal: () => Literal_default,
  LogicalExpression: () => LogicalExpression_default,
  MemberExpression: () => MemberExpression_default,
  MethodDefinition: () => MethodDefinition_default,
  MethodGetterDefinition: () => MethodGetterDefinition_default,
  MethodSetterDefinition: () => MethodSetterDefinition_default,
  NewExpression: () => NewExpression_default,
  ObjectExpression: () => ObjectExpression_default,
  ObjectPattern: () => ObjectPattern_default,
  PackageDeclaration: () => PackageDeclaration_default,
  ParenthesizedExpression: () => ParenthesizedExpression_default,
  Property: () => Property_default,
  PropertyDefinition: () => PropertyDefinition_default,
  RestElement: () => RestElement_default,
  ReturnStatement: () => ReturnStatement_default,
  SequenceExpression: () => SequenceExpression_default,
  SpreadElement: () => SpreadElement_default,
  StructTableColumnDefinition: () => StructTableColumnDefinition_default,
  StructTableDeclaration: () => StructTableDeclaration_default,
  StructTableKeyDefinition: () => StructTableKeyDefinition_default,
  StructTableMethodDefinition: () => StructTableMethodDefinition_default,
  StructTablePropertyDefinition: () => StructTablePropertyDefinition_default,
  SuperExpression: () => SuperExpression_default,
  SwitchCase: () => SwitchCase_default,
  SwitchStatement: () => SwitchStatement_default,
  TemplateElement: () => TemplateElement_default,
  TemplateLiteral: () => TemplateLiteral_default,
  ThisExpression: () => ThisExpression_default,
  ThrowStatement: () => ThrowStatement_default,
  TryStatement: () => TryStatement_default,
  TypeAssertExpression: () => TypeAssertExpression_default,
  TypeTransformExpression: () => TypeTransformExpression_default,
  UnaryExpression: () => UnaryExpression_default,
  UpdateExpression: () => UpdateExpression_default,
  VariableDeclaration: () => VariableDeclaration_default,
  VariableDeclarator: () => VariableDeclarator_default,
  WhenStatement: () => WhenStatement_default,
  WhileStatement: () => WhileStatement_default
});

// node_modules/@easescript/transform/lib/tokens/AnnotationDeclaration.js
function AnnotationDeclaration_default() {
}

// node_modules/@easescript/transform/lib/tokens/AnnotationExpression.js
init_Common();
function AnnotationExpression_default(ctx, stack) {
  const name = stack.getLowerCaseName();
  switch (name) {
    case "http": {
      return createHttpAnnotationNode(ctx, stack) || ctx.createLiteral(null);
    }
    case "router": {
      return createRouterAnnotationNode(ctx, stack) || ctx.createLiteral(null);
    }
    case "url": {
      return createUrlAnnotationNode(ctx, stack);
    }
    case "env": {
      return createEnvAnnotationNode(ctx, stack);
    }
    case "readfile": {
      return createReadfileAnnotationNode(ctx, stack) || ctx.createLiteral(null);
    }
    default:
      ctx.error(`The '${name}' annotations is not supported.`);
  }
  return null;
}

// node_modules/@easescript/transform/lib/tokens/ArrayExpression.js
function ArrayExpression_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.elements = stack.elements.map((item) => ctx.createToken(item));
  return node;
}

// node_modules/@easescript/transform/lib/tokens/ArrayPattern.js
function ArrayPattern_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.elements = stack.elements.map((item) => ctx.createToken(item));
  return node;
}

// node_modules/@easescript/transform/lib/tokens/FunctionExpression.js
function FunctionExpression_default(ctx, stack, type) {
  const node = ctx.createNode(stack, type);
  node.async = stack.async ? true : false;
  node.params = stack.params.map((item) => ctx.createToken(item));
  node.body = ctx.createToken(stack.body);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/ArrowFunctionExpression.js
function ArrowFunctionExpression_default(ctx, stack, type) {
  const node = FunctionExpression_default(ctx, stack, type);
  node.type = type;
  return node;
}

// node_modules/@easescript/transform/lib/tokens/AssignmentExpression.js
var import_Utils6 = __toESM(require("easescript/lib/core/Utils"));
init_Common();
function AssignmentExpression_default(ctx, stack) {
  const desc2 = stack.left.description();
  const module2 = stack.module;
  const isMember = stack.left.isMemberExpression;
  let isReflect = false;
  let operator = stack.operator;
  if (isMember) {
    if (stack.left.computed) {
      let hasDynamic = desc2 && desc2.isComputeType && desc2.isPropertyExists();
      if (!hasDynamic && desc2 && (desc2.isProperty && desc2.computed || desc2.isPropertyDefinition && desc2.dynamic)) {
        hasDynamic = true;
      }
      if (!hasDynamic && !import_Utils6.default.isLiteralObjectType(stack.left.object.type())) {
        isReflect = true;
      }
    } else if (!desc2 || desc2.isAnyType) {
      isReflect = !import_Utils6.default.isLiteralObjectType(stack.left.object.type());
    }
  }
  if (isReflect) {
    let value = ctx.createToken(stack.right);
    let scopeId = module2 ? ctx.createIdentifier(module2.id) : ctx.createLiteral(null);
    let propertyNode = ctx.createLiteral(
      stack.left.property.value(),
      void 0,
      stack.left.property
    );
    if (operator && operator.charCodeAt(0) !== 61 && operator.charCodeAt(operator.length - 1) === 61) {
      operator = operator.slice(0, -1);
      const callee2 = createStaticReferenceNode(ctx, stack, "Reflect", "get");
      const left2 = ctx.createCallExpression(callee2, [
        scopeId,
        ctx.createToken(stack.left.object),
        propertyNode
      ], stack);
      value = ctx.createBinaryExpression(left2, value, operator);
    }
    const callee = createStaticReferenceNode(ctx, stack, "Reflect", "set");
    return ctx.createCallExpression(callee, [
      scopeId,
      ctx.createToken(stack.left.object),
      propertyNode,
      value
    ], stack);
  }
  let left = ctx.createToken(stack.left);
  if (isMember && stack.left.object.isSuperExpression) {
    if (left.type === "CallExpression" && left.callee.type === "MemberExpression" && left.callee.property.value === "callSuperSetter") {
      left.arguments.push(
        ctx.createToken(stack.right)
      );
      return left;
    }
  }
  const node = ctx.createNode(stack);
  node.left = left;
  node.right = ctx.createToken(stack.right);
  node.operator = operator;
  return node;
}

// node_modules/@easescript/transform/lib/tokens/AssignmentPattern.js
function AssignmentPattern_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.left = ctx.createToken(stack.left);
  node.right = ctx.createToken(stack.right);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/AwaitExpression.js
function AwaitExpression_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.argument = ctx.createToken(stack.argument);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/BinaryExpression.js
var import_Utils7 = __toESM(require("easescript/lib/core/Utils"));
init_Common();
var globals = ["Array", "Object", "RegExp", "Number", "String", "Function"];
function BinaryExpression_default(ctx, stack) {
  let operator = stack.operator;
  let node = ctx.createNode(stack);
  let right = ctx.createToken(stack.right);
  if (operator === "is" || operator === "instanceof") {
    let type = stack.right.type();
    let origin = !import_Utils7.default.isModule(type) ? import_Utils7.default.getOriginType(type) : type;
    if (!stack.right.hasLocalDefined()) {
      ctx.addDepend(origin, stack.module);
      right = ctx.createIdentifier(
        ctx.getGlobalRefName(
          stack,
          ctx.getModuleReferenceName(origin, stack.module)
        )
      );
    }
    if (operator === "is" && !(origin && globals.includes(origin.id))) {
      return ctx.createCallExpression(
        createStaticReferenceNode(ctx, stack, "System", "is"),
        [
          ctx.createToken(stack.left),
          right
        ],
        stack
      );
    }
    operator = "instanceof";
  }
  node.left = ctx.createToken(stack.left);
  node.right = right;
  node.operator = operator;
  return node;
}

// node_modules/@easescript/transform/lib/tokens/BlockStatement.js
function BlockStatement_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.body = [];
  ctx.setNode(stack, node);
  for (let child of stack.body) {
    const token = ctx.createToken(child);
    if (token) {
      node.body.push(token);
      if (child.isWhenStatement) {
        const express = token.type === "BlockStatement" ? token.body : [token];
        if (Array.isArray(express)) {
          const last = express[express.length - 1];
          if (last && last.type === "ReturnStatement") {
            break;
          }
        }
      } else if (child.isReturnStatement || child.hasReturnStatement) {
        break;
      }
    }
  }
  ;
  ctx.removeNode(stack);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/BreakStatement.js
function BreakStatement_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.label = stack.label && ctx.createIdentifier(stack.label.value(), stack.label);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/CallExpression.js
var import_Utils8 = __toESM(require("easescript/lib/core/Utils"));
init_Common();
function CallExpression_default(ctx, stack) {
  const isMember = stack.callee.isMemberExpression;
  const desc2 = stack.descriptor();
  const module2 = stack.module;
  const isChainExpression = stack.parentStack.isChainExpression;
  if (stack.callee.isSuperExpression) {
    const parent = module2 && module2.inherit;
    if (parent) {
      ctx.addDepend(parent, module2);
      if (!ctx.isActiveModule(parent, stack.module) || ctx.isES6ClassModule(parent)) {
        return null;
      }
    }
  }
  if (isMember && !isChainExpression && (!desc2 || desc2.isType && desc2.isAnyType)) {
    const property = stack.callee.computed ? ctx.createToken(stack.callee.property) : ctx.createLiteral(
      stack.callee.property.value()
    );
    const args = [
      module2 ? ctx.createIdentifier(module2.id) : ctx.createLiteral(null),
      ctx.createToken(stack.callee.object),
      property,
      ctx.createArrayExpression(
        stack.arguments.map((item) => ctx.createToken(item))
      )
    ];
    if (stack.callee.object.isSuperExpression) {
      args.push(ctx.createThisExpression());
    }
    return ctx.createCallExpression(
      createStaticReferenceNode(ctx, stack, "Reflect", "call"),
      args,
      stack
    );
  }
  if (stack.callee.isSuperExpression || isMember && stack.callee.object.isSuperExpression && !isChainExpression) {
    return ctx.createCallExpression(
      ctx.createMemberExpression(
        [
          ctx.createToken(stack.callee),
          ctx.createIdentifier("call")
        ]
      ),
      [
        ctx.createThisExpression()
      ].concat(stack.arguments.map((item) => ctx.createToken(item))),
      stack
    );
  }
  const privateChain = ctx.options.privateChain;
  if (privateChain && desc2 && desc2.isMethodDefinition && !(desc2.static || desc2.module.static)) {
    const modifier = import_Utils8.default.getModifierValue(desc2);
    const refModule = desc2.module;
    if (modifier === "private" && refModule.children.length > 0) {
      return ctx.createCallExpression(
        ctx.createMemberExpression(
          [
            ctx.createToken(stack.callee),
            ctx.createIdentifier("call")
          ]
        ),
        [isMember ? ctx.createToken(stack.callee.object) : ctx.createThisExpression()].concat(stack.arguments.map((item) => ctx.createToken(item))),
        stack
      );
    }
  }
  if (desc2) {
    let type = desc2.isCallDefinition ? desc2.module : desc2;
    if (!isMember && !stack.callee.isSuperExpression && desc2.isMethodDefinition)
      type = desc2.module;
    if (import_Utils8.default.isTypeModule(type)) {
      ctx.addDepend(desc2, module2);
    }
  }
  const node = ctx.createNode(stack);
  node.callee = ctx.createToken(stack.callee);
  node.arguments = stack.arguments.map((item) => ctx.createToken(item));
  node.isChainExpression = isChainExpression;
  return node;
}

// node_modules/@easescript/transform/lib/tokens/ChainExpression.js
function ChainExpression_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.expression = ctx.createToken(stack.expression);
  return node;
}

// node_modules/@easescript/transform/lib/core/ClassBuilder.js
var import_crypto3 = require("crypto");
init_Common();
var import_Namespace3 = __toESM(require("easescript/lib/core/Namespace"));
var modifierMaps = {
  "public": MODIFIER_PUBLIC,
  "protected": MODIFIER_PROTECTED,
  "private": MODIFIER_PRIVATE
};
var kindMaps = {
  "accessor": KIND_ACCESSOR,
  "var": KIND_VAR,
  "const": KIND_CONST,
  "method": KIND_METHOD,
  "enumProperty": KIND_ENUM_PROPERTY
};
var ClassBuilder = class {
  constructor(stack) {
    this.stack = stack;
    this.compilation = stack.compilation;
    this.module = stack.module;
    this.privateProperties = [];
    this.initProperties = [];
    this.body = [];
    this.beforeBody = [];
    this.afterBody = [];
    this.methods = [];
    this.members = [];
    this.construct = null;
    this.implements = [];
    this.inherit = null;
    this.privateSymbolNode = null;
    this.privateName = null;
    this.mainEnter = null;
  }
  create(ctx) {
    ctx.setNode(this.stack, this);
    const module2 = this.module;
    const stack = this.stack;
    this.createInherit(ctx, module2, stack);
    this.createImplements(ctx, module2, stack);
    this.createBody(ctx, module2, stack);
    let methods7 = this.createMemberDescriptors(ctx, this.methods);
    let members = this.createMemberDescriptors(ctx, this.members);
    let creator = this.createCreator(
      ctx,
      module2,
      module2.id,
      this.createClassDescriptor(ctx, module2, methods7, members)
    );
    ctx.crateModuleAssets(module2);
    ctx.createModuleImportReferences(module2);
    if (stack.compilation.mainModule === module2) {
      ctx.addExport("default", ctx.createIdentifier(module2.id));
    }
    if (this.mainEnter) {
      ctx.addNodeToAfterBody(
        ctx.createExpressionStatement(
          ctx.createExpressionStatement(this.mainEnter)
        )
      );
    }
    ctx.removeNode(this.stack);
    let expressions = [
      this.construct,
      ...this.beforeBody,
      ...this.body,
      ...this.afterBody,
      ctx.createExpressionStatement(creator)
    ];
    let symbolNode = this.privateSymbolNode;
    if (symbolNode) {
      expressions.unshift(symbolNode);
    }
    return ctx.createMultipleStatement(expressions);
  }
  createBody(ctx, module2, stack) {
    this.createMemebers(ctx, stack);
    this.createIteratorMethodNode(ctx, module2);
    if (!this.construct) {
      this.construct = this.createDefaultConstructor(ctx, module2.id, module2.inherit);
    }
    this.checkConstructor(ctx, this.construct, module2);
  }
  createInherit(ctx, module2, stack = null) {
    let inherit = module2.inherit;
    if (inherit) {
      ctx.addDepend(inherit, module2);
      if (ctx.isActiveModule(inherit, module2)) {
        this.inherit = ctx.createIdentifier(
          ctx.getModuleReferenceName(inherit, module2)
        );
      }
    }
  }
  createImplements(ctx, module2, stack = null) {
    this.implements = module2.implements.map((impModule) => {
      ctx.addDepend(impModule, module2);
      if (impModule.isInterface && ctx.isActiveModule(impModule, module2) && import_Namespace3.default.globals.get("Iterator") !== impModule) {
        return ctx.createIdentifier(
          ctx.getModuleReferenceName(impModule, module2)
        );
      }
      return null;
    }).filter(Boolean);
  }
  createIteratorMethodNode(ctx, module2) {
    const iteratorType = import_Namespace3.default.globals.get("Iterator");
    if (module2.implements.includes(iteratorType)) {
      const block = ctx.createBlockStatement();
      block.body.push(
        ctx.createReturnStatement(
          ctx.createThisExpression()
        )
      );
      const method = ctx.createMethodDefinition("Symbol.iterator", block);
      method.key.computed = true;
      method.static = false;
      method.modifier = "public";
      method.kind = "method";
      this.members.push(method);
    }
  }
  createPrivateRefsName(ctx) {
    if (!this.privateName && ctx.options.privateChain) {
      this.privateName = ctx.getGlobalRefName(this.stack, PRIVATE_NAME, this.module);
      if (!this.privateSymbolNode) {
        this.privateSymbolNode = this.createPrivateSymbolNode(ctx, this.privateName);
      }
    }
    return this.privateName;
  }
  getHashId(len = 8) {
    let moduleHashId = this._moduleHashId;
    if (!moduleHashId) {
      const name = this.module.getName();
      const file = this.compilation.file;
      this._moduleHashId = moduleHashId = (0, import_crypto3.createHash)("sha256").update(`${file}:${name}`).digest("hex").substring(0, len);
    }
    return moduleHashId;
  }
  createPrivateSymbolNode(ctx, name) {
    if (!ctx.options.privateChain)
      return null;
    let isProd = ctx.plugin.options.mode === "production";
    if (isProd) {
      return ctx.createVariableDeclaration(
        "const",
        [
          ctx.createVariableDeclarator(
            ctx.createIdentifier(name),
            ctx.createCallExpression(
              ctx.createIdentifier("Symbol"),
              [
                ctx.createLiteral("private")
              ]
            )
          )
        ]
      );
    } else {
      return ctx.createVariableDeclaration(
        "const",
        [
          ctx.createVariableDeclarator(
            ctx.createIdentifier(name),
            ctx.createCallExpression(
              createStaticReferenceNode(ctx, this.stack, "Class", "getKeySymbols"),
              [
                ctx.createLiteral(this.getHashId())
              ]
            )
          )
        ]
      );
    }
  }
  checkSuperES6Class(ctx, construct, module2) {
    const inherit = module2.inherit;
    if (inherit && ctx.isES6ClassModule(inherit)) {
      const wrap = ctx.createFunctionExpression(construct.body);
      construct.body.body.push(ctx.createReturnStatement(ctx.createThisExpression()));
      const block = ctx.createBlockStatement();
      block.body.push(
        ctx.createReturnStatement(
          ctx.createCallExpression(
            createStaticReferenceNode(ctx, this.stack, "Reflect", "apply"),
            [
              wrap,
              ctx.createCallExpression(
                createStaticReferenceNode(ctx, this.stack, "Reflect", "construct"),
                [
                  ctx.createIdentifier(ctx.getModuleReferenceName(inherit, module2)),
                  ctx.createIdentifier("arguments"),
                  ctx.createIdentifier(module2.id)
                ]
              )
            ]
          )
        )
      );
      construct.body = block;
    }
  }
  checkConstructor(ctx, construct, module2) {
    construct.type = "FunctionDeclaration";
    construct.kind = "";
    construct.key.value = module2.id;
    if (this.privateProperties.length > 0 || this.initProperties.length > 0) {
      let body = construct.body.body;
      let appendAt = module2.inherit ? 1 : 0;
      let els = [...this.initProperties];
      if (this.privateProperties.length > 0) {
        let privateName = this.createPrivateRefsName(ctx);
        let definePrivateProperties = ctx.createExpressionStatement(
          ctx.createCallExpression(
            ctx.createMemberExpression([
              ctx.createIdentifier("Object"),
              ctx.createIdentifier("defineProperty")
            ]),
            [
              ctx.createThisExpression(),
              ctx.createIdentifier(privateName),
              ctx.createObjectExpression([
                ctx.createProperty(
                  ctx.createIdentifier("value"),
                  ctx.createObjectExpression(this.privateProperties)
                )
              ])
            ]
          )
        );
        els.push(definePrivateProperties);
      }
      body.splice(appendAt, 0, ...els);
    }
    this.checkSuperES6Class(ctx, construct, module2);
  }
  createInitMemberProperty(ctx, node, stack = null, staticFlag = false) {
    if (staticFlag)
      return;
    if (ctx.options.privateChain && node.modifier === "private") {
      this.privateProperties.push(
        ctx.createProperty(
          node.key,
          node.init || ctx.createLiteral(null)
        )
      );
    } else {
      this.initProperties.push(
        ctx.createExpressionStatement(
          ctx.createAssignmentExpression(
            ctx.createMemberExpression([
              ctx.createThisExpression(),
              node.key
            ]),
            node.init || ctx.createLiteral(null)
          )
        )
      );
    }
    node.init = null;
  }
  createMemebers(ctx, stack) {
    const cache1 = /* @__PURE__ */ new Map();
    const cache2 = /* @__PURE__ */ new Map();
    stack.body.forEach((item) => {
      const child = this.createMemeber(ctx, item, !!stack.static);
      if (!child)
        return;
      const staticFlag = !!(stack.static || child.static);
      const refs = staticFlag ? this.methods : this.members;
      if (child.type === "PropertyDefinition") {
        this.createInitMemberProperty(ctx, child, item, staticFlag);
      }
      if (item.isMethodSetterDefinition || item.isMethodGetterDefinition) {
        const name = child.key.value;
        const dataset = staticFlag ? cache1 : cache2;
        let target = dataset.get(name);
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
  createAnnotations(ctx, stack, node, staticFlag = false) {
    if (staticFlag && stack.isMethodDefinition && stack.isEnterMethod && node.modifier === "public" && !this.mainEnter) {
      this.mainEnter = createMainAnnotationNode(ctx, stack);
    }
    return node;
  }
  createMemeber(ctx, stack, staticFlag = false) {
    const node = ctx.createToken(stack);
    if (node) {
      this.createAnnotations(ctx, stack, node, !!(staticFlag || node.static));
    }
    return node;
  }
  createDefaultConstructor(ctx, name, inherit = null, params = []) {
    const block = ctx.createBlockStatement();
    if (inherit) {
      const se = ctx.createSuperExpression(
        ctx.getModuleReferenceName(inherit, this.module)
      );
      const args = params.length > 0 ? ctx.createArrayExpression(params) : ctx.createIdentifier("arguments");
      block.body.push(
        ctx.createExpressionStatement(
          ctx.createCallExpression(
            ctx.createMemberExpression(
              [
                se,
                ctx.createIdentifier("apply")
              ]
            ),
            [
              ctx.createThisExpression(),
              args
            ]
          )
        )
      );
    }
    return ctx.createMethodDefinition(
      name,
      block,
      params
    );
  }
  createMemberDescriptor(ctx, node) {
    if (node.dynamic && node.type === "PropertyDefinition") {
      return null;
    }
    let key = node.key;
    let kind = kindMaps[node.kind];
    let modifier = node.modifier || "public";
    let properties = [];
    let mode = modifierMaps[modifier] | kindMaps[node.kind];
    let _static = node.static;
    if (node.static) {
      mode |= MODIFIER_STATIC;
    }
    if (node.isAbstract) {
      mode |= MODIFIER_ABSTRACT;
    }
    if (node.isFinal) {
      mode |= MODIFIER_FINAL;
    }
    delete node.static;
    if (node.type === "MethodDefinition" || node.kind === "method") {
      node.kind = "";
      if (key.computed) {
        node.key = null;
      }
    }
    node.disabledNewLine = true;
    properties.push(
      ctx.createProperty(
        ctx.createIdentifier("m"),
        ctx.createLiteral(mode)
      )
    );
    if (kind === KIND_VAR) {
      properties.push(
        ctx.createProperty(
          ctx.createIdentifier("writable"),
          ctx.createLiteral(true)
        )
      );
    }
    if (!_static && (node.isAccessor || kind === KIND_VAR || kind === KIND_CONST) && modifier === "public") {
      properties.push(
        ctx.createProperty(
          ctx.createIdentifier("enumerable"),
          ctx.createLiteral(true)
        )
      );
    }
    let isConfigurable = !!node.isConfigurable;
    if (node.isAccessor) {
      if (node.get) {
        if (node.get.isConfigurable)
          isConfigurable = true;
        node.get.disabledNewLine = true;
        delete node.get.static;
        properties.push(
          ctx.createProperty(
            ctx.createIdentifier("get"),
            node.get
          )
        );
      }
      if (node.set) {
        if (node.set.isConfigurable)
          isConfigurable = true;
        node.set.disabledNewLine = true;
        delete node.set.static;
        properties.push(
          ctx.createProperty(
            ctx.createIdentifier("set"),
            node.set
          )
        );
      }
    } else {
      if (node.type === "PropertyDefinition") {
        if (node.init) {
          properties.push(
            ctx.createProperty(
              ctx.createIdentifier("value"),
              node.init
            )
          );
        }
      } else {
        properties.push(
          ctx.createProperty(
            ctx.createIdentifier("value"),
            node
          )
        );
      }
    }
    if (isConfigurable) {
      properties.push(
        ctx.createProperty(
          ctx.createIdentifier("configurable"),
          ctx.createLiteral(true)
        )
      );
    }
    return ctx.createProperty(
      key,
      ctx.createObjectExpression(properties)
    );
  }
  createClassDescriptor(ctx, module2, methods7, members) {
    const properties = [];
    let kind = module2.isEnum ? KIND_CLASS : module2.isInterface ? KIND_INTERFACE : KIND_CLASS;
    kind |= MODIFIER_PUBLIC;
    if (module2.static) {
      kind |= MODIFIER_STATIC;
    }
    if (module2.abstract) {
      kind |= MODIFIER_ABSTRACT;
    }
    if (module2.isFinal) {
      kind |= MODIFIER_FINAL;
    }
    properties.push(
      ctx.createProperty(
        ctx.createIdentifier("m"),
        ctx.createLiteral(kind)
      )
    );
    const ns = module2.namespace && module2.namespace.toString();
    if (ns) {
      properties.push(
        ctx.createProperty(
          ctx.createIdentifier("ns"),
          ctx.createLiteral(ns)
        )
      );
    }
    properties.push(
      ctx.createProperty(
        ctx.createIdentifier("name"),
        ctx.createLiteral(module2.id)
      )
    );
    if (module2.dynamic) {
      properties.push(
        ctx.createProperty(
          ctx.createIdentifier("dynamic"),
          ctx.createLiteral(true)
        )
      );
    }
    if (this.privateName) {
      properties.push(
        ctx.createProperty(
          ctx.createIdentifier("private"),
          ctx.createIdentifier(this.privateName)
        )
      );
    }
    if (this.implements.length > 0) {
      properties.push(
        ctx.createProperty(
          ctx.createIdentifier("imps"),
          ctx.createArrayExpression(this.implements)
        )
      );
    }
    if (this.inherit) {
      properties.push(
        ctx.createProperty(
          ctx.createIdentifier("inherit"),
          this.inherit
        )
      );
    }
    if (methods7) {
      properties.push(
        ctx.createProperty(
          ctx.createIdentifier("methods"),
          methods7
        )
      );
    }
    if (members) {
      properties.push(
        ctx.createProperty(
          ctx.createIdentifier("members"),
          members
        )
      );
    }
    return ctx.createObjectExpression(properties);
  }
  createCreator(ctx, module2, className, description) {
    const args = [
      ctx.createIdentifier(className || module2.id),
      description
    ];
    return ctx.createCallExpression(
      createStaticReferenceNode(ctx, this.stack, "Class", "creator"),
      args
    );
  }
  createMemberDescriptors(ctx, members) {
    if (!members.length)
      return;
    return ctx.createObjectExpression(
      members.map((node) => this.createMemberDescriptor(ctx, node)).filter(Boolean)
    );
  }
};
var ClassBuilder_default = ClassBuilder;

// node_modules/@easescript/transform/lib/tokens/ClassDeclaration.js
function ClassDeclaration_default(ctx, stack) {
  const builder = new ClassBuilder_default(stack);
  return builder.create(ctx);
}

// node_modules/@easescript/transform/lib/tokens/ConditionalExpression.js
function ConditionalExpression_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.test = ctx.createToken(stack.test);
  node.consequent = ctx.createToken(stack.consequent);
  node.alternate = ctx.createToken(stack.alternate);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/ContinueStatement.js
function ContinueStatement_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.label = ctx.createToken(stack.label);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/Declarator.js
function Declarator_default(ctx, stack) {
  const node = ctx.createNode(stack, "Identifier");
  node.value = node.raw = stack.value();
  return node;
}

// node_modules/@easescript/transform/lib/tokens/DeclaratorDeclaration.js
function DeclaratorDeclaration_default(ctx, stack) {
}

// node_modules/@easescript/transform/lib/tokens/DoWhileStatement.js
function DoWhileStatement_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.condition = ctx.createToken(stack.condition);
  node.body = ctx.createToken(stack.body);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/EmptyStatement.js
function EmptyStatement_default() {
}

// node_modules/@easescript/transform/lib/core/EnumBuilder.js
var import_Namespace4 = __toESM(require("easescript/lib/core/Namespace.js"));
var EnumBuilder = class extends ClassBuilder_default {
  create(ctx) {
    ctx.setNode(this.stack, this);
    const module2 = this.module;
    const stack = this.stack;
    this.createInherit(ctx, module2, stack);
    this.createImplements(ctx, module2, stack);
    this.createBody(ctx, module2, stack);
    let methods7 = this.createMemberDescriptors(ctx, this.methods);
    let members = this.createMemberDescriptors(ctx, this.members);
    let creator = this.createCreator(
      ctx,
      module2,
      module2.id,
      this.createClassDescriptor(ctx, module2, methods7, members)
    );
    ctx.crateModuleAssets(module2);
    ctx.createModuleImportReferences(module2);
    if (stack.compilation.mainModule === module2) {
      ctx.addExport("default", ctx.createIdentifier(module2.id));
    }
    ctx.removeNode(this.stack);
    let expressions = [
      this.construct,
      ...this.beforeBody,
      ...this.body,
      ...this.afterBody,
      ctx.createExpressionStatement(creator)
    ];
    let symbolNode = this.privateSymbolNode;
    if (symbolNode) {
      expressions.unshift(symbolNode);
    }
    return ctx.createMultipleStatement(expressions);
  }
  createEnumExpression(ctx) {
    let stack = this.stack;
    const name = stack.value();
    const init = ctx.createAssignmentExpression(
      ctx.createIdentifier(name, stack),
      ctx.createObjectExpression()
    );
    const properties = stack.properties.map((item) => {
      const initNode = ctx.createMemberExpression([
        ctx.createIdentifier(name, item.key),
        ctx.createLiteral(
          item.key.value(),
          void 0,
          item.key
        )
      ]);
      initNode.computed = true;
      const initAssignmentNode = ctx.createAssignmentExpression(
        initNode,
        ctx.createLiteral(
          item.init.value(),
          item.init.value(),
          item.init
        )
      );
      const left = ctx.createMemberExpression([
        ctx.createIdentifier(name),
        initAssignmentNode
      ]);
      left.computed = true;
      return ctx.createAssignmentExpression(
        left,
        ctx.createLiteral(
          item.key.value(),
          void 0,
          item.key
        )
      );
    });
    properties.push(ctx.createIdentifier(name));
    return ctx.createVariableDeclaration("var", [
      ctx.createVariableDeclarator(
        ctx.createIdentifier(name, stack),
        ctx.createParenthesizedExpression(
          ctx.createSequenceExpression([init, ...properties])
        )
      )
    ]);
  }
  createBody(ctx, module2, stack) {
    this.createMemebers(ctx, stack);
    if (!this.construct) {
      this.construct = this.createDefaultConstructor(ctx, module2.id, module2.inherit);
    }
    this.checkConstructor(ctx, this.construct, module2);
  }
  createInherit(ctx, module2, stack = null) {
    let inherit = module2.inherit;
    if (inherit) {
      ctx.addDepend(inherit, stack.module);
      if (ctx.isActiveModule(inherit, stack.module)) {
        this.inherit = ctx.createIdentifier(
          ctx.getModuleReferenceName(inherit, module2),
          stack.inherit
        );
      }
    }
    if (!this.inherit) {
      const inherit2 = import_Namespace4.default.globals.get("Enumeration");
      ctx.addDepend(inherit2, stack.module);
      this.inherit = ctx.createIdentifier(
        ctx.getModuleReferenceName(inherit2, module2)
      );
    }
  }
  createMemebers(ctx, stack) {
    let methods7 = this.methods;
    stack.properties.forEach((item) => {
      const child = this.createMemeber(ctx, item);
      if (child) {
        methods7.push(child);
      }
    });
    super.createMemebers(ctx, stack);
  }
};
var EnumBuilder_default = EnumBuilder;

// node_modules/@easescript/transform/lib/tokens/EnumDeclaration.js
function EnumDeclaration_default(ctx, stack) {
  const builder = new EnumBuilder_default(stack);
  if (stack.isExpression) {
    return builder.createEnumExpression(ctx);
  } else {
    return builder.create(ctx);
  }
}

// node_modules/@easescript/transform/lib/tokens/EnumProperty.js
function EnumProperty_default(ctx, stack) {
  const node = ctx.createNode(stack, "PropertyDefinition");
  node.static = true;
  node.key = ctx.createToken(stack.key);
  node.init = ctx.createToken(stack.init);
  node.modifier = "public";
  node.kind = "enumProperty";
  return node;
}

// node_modules/@easescript/transform/lib/tokens/ExportAllDeclaration.js
function ExportAllDeclaration_default(ctx, stack) {
  if (stack.getResolveJSModule() || !stack.source) {
    return null;
  }
  let source = stack.source.value();
  const compilation = stack.getResolveCompilation();
  if (compilation && compilation.stack) {
    ctx.addDepend(compilation);
    source = ctx.getModuleImportSource(stack.getResolveFile(), stack.compilation.file);
  } else {
    source = ctx.getModuleImportSource(source, stack.compilation.file);
  }
  let importSource = ctx.getImport(source, true);
  if (!importSource) {
    importSource = ctx.addImport(source, null, "*");
    importSource.setExportSource();
    importSource.setSourceTarget(compilation);
  }
  ctx.addExport(stack.exported ? stack.exported.value() : null, "*", importSource, stack);
}

// node_modules/@easescript/transform/lib/tokens/ExportDefaultDeclaration.js
function ExportDefaultDeclaration_default(ctx, stack) {
  let declaration = ctx.createToken(stack.declaration);
  if (declaration) {
    ctx.addExport("default", declaration, null, stack);
  }
}

// node_modules/@easescript/transform/lib/tokens/ExportNamedDeclaration.js
function ExportNamedDeclaration_default(ctx, stack) {
  if (stack.getResolveJSModule()) {
    return null;
  }
  let exportSource = null;
  if (stack.declaration) {
    const decl = stack.declaration;
    if (decl.isVariableDeclaration) {
      let decls = decl.declarations.map((decl2) => decl2.id.value());
      exportSource = ctx.addExport(decls.shift(), ctx.createToken(decl), null, decl);
      exportSource.bindExport(decls);
    } else if (decl.isFunctionDeclaration) {
      exportSource = ctx.addExport(decl.key.value(), ctx.createToken(decl), null, decl);
    } else {
      throw new Error(`Export declaration type only support 'var' or 'function'`);
    }
  } else if (stack.specifiers && stack.specifiers.length > 0) {
    let source = null;
    if (stack.source) {
      source = stack.source.value();
      let compilation = stack.getResolveCompilation();
      if (compilation && compilation.stack) {
        ctx.addDepend(compilation);
        source = ctx.getModuleImportSource(stack.getResolveFile(), stack.compilation.file);
      } else {
        source = ctx.getModuleImportSource(source, stack.compilation.file);
      }
      let importSource = ctx.getImport(source);
      if (!importSource) {
        importSource = ctx.addImport(source);
        importSource.setExportSource();
        importSource.setSourceTarget(compilation);
      }
      source = importSource;
    }
    stack.specifiers.forEach((spec) => {
      let exported = spec.exported || spec.local;
      exportSource = ctx.addExport(exported.value(), spec.local.value(), source, spec);
    });
  }
  if (exportSource) {
    exportSource.stack = stack;
  }
}

// node_modules/@easescript/transform/lib/tokens/ExportSpecifier.js
function ExportSpecifier_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.exported = ctx.createToken(stack.exported);
  node.local = ctx.createToken(stack.local);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/ExpressionStatement.js
function ExpressionStatement_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.expression = ctx.createToken(stack.expression);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/ForInStatement.js
function ForInStatement_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.left = ctx.createToken(stack.left);
  node.right = ctx.createToken(stack.right);
  node.body = ctx.createToken(stack.body);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/ForOfStatement.js
var import_Utils9 = __toESM(require("easescript/lib/core/Utils"));
init_Common();
function ForOfStatement_default(ctx, stack) {
  const type = import_Utils9.default.getOriginType(stack.right.type());
  if (import_Utils9.default.isLocalModule(type) || stack.right.type().isAnyType) {
    const node2 = ctx.createNode(stack, "ForStatement");
    const obj = ctx.getLocalRefName(stack, "_i");
    const res = ctx.getLocalRefName(stack, "_v");
    const init = ctx.createToken(stack.left);
    const object = ctx.createAssignmentExpression(
      ctx.createIdentifier(obj),
      ctx.createCallExpression(
        createStaticReferenceNode(ctx, stack, "System", "getIterator"),
        [
          ctx.createToken(stack.right)
        ],
        stack.right
      )
    );
    init.declarations.push(ctx.createIdentifier(res));
    init.declarations.push(object);
    const condition = ctx.createChunkExpression(`${obj} && (${res}=${obj}.next()) && !${res}.done`, false);
    node2.init = init;
    node2.condition = condition;
    node2.update = null;
    node2.body = ctx.createToken(stack.body);
    const block = node2.body;
    const assignment = ctx.createExpressionStatement(
      ctx.createAssignmentExpression(
        ctx.createIdentifier(init.declarations[0].id.value),
        ctx.createMemberExpression([
          ctx.createIdentifier(res),
          ctx.createIdentifier("value")
        ])
      )
    );
    block.body.splice(0, 0, assignment);
    return node2;
  }
  const node = ctx.createNode(stack);
  node.left = ctx.createToken(stack.left);
  node.right = ctx.createToken(stack.right);
  node.body = ctx.createToken(stack.body);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/ForStatement.js
function ForStatement_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.init = ctx.createToken(stack.init);
  node.condition = ctx.createToken(stack.condition);
  node.update = ctx.createToken(stack.update);
  node.body = ctx.createToken(stack.body);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/FunctionDeclaration.js
init_Common();
function FunctionDeclaration_default(ctx, stack, type) {
  const node = FunctionExpression_default(ctx, stack, type);
  if (stack.key) {
    let name = stack.key.value();
    if (stack.isMethodDefinition && !stack.isConstructor) {
      name = getMethodOrPropertyAlias(ctx, stack, name) || name;
    }
    node.key = ctx.createIdentifier(name, stack.key);
  }
  return node;
}

// node_modules/@easescript/transform/lib/tokens/Identifier.js
var import_Utils10 = __toESM(require("easescript/lib/core/Utils"));
init_Common();
function Identifier_default(ctx, stack) {
  const desc2 = stack.parentStack && stack.parentStack.isImportSpecifier ? null : stack.descriptor();
  const module2 = stack.module;
  if (import_Utils10.default.isStack(desc2) && (desc2.isDeclaratorVariable || desc2.isDeclaratorFunction)) {
    let imports = desc2.imports;
    if (Array.isArray(imports)) {
      imports.forEach((item) => {
        if (item.source.isLiteral) {
          parseImportDeclaration(ctx, item, module2);
        }
      });
    }
  }
  if (desc2 && (desc2.isPropertyDefinition || desc2.isMethodDefinition || desc2.isEnumProperty) && !(stack.parentStack.isProperty && stack.parentStack.key === stack)) {
    const privateChain = ctx.options.privateChain;
    const ownerModule = desc2.module;
    const isStatic = !!(desc2.static || ownerModule.static || desc2.isEnumProperty);
    const property = ctx.createIdentifier(stack.value(), stack);
    const modifier = import_Utils10.default.getModifierValue(desc2);
    var object = isStatic ? ctx.createIdentifier(ownerModule.id) : ctx.createThisExpression();
    if (privateChain && desc2.isPropertyDefinition && modifier === "private" && !isStatic) {
      object = ctx.createMemberExpression([
        object,
        ctx.createIdentifier(
          ctx.getGlobalRefName(stack, PRIVATE_NAME, stack.module),
          stack
        )
      ]);
      object.computed = true;
      return ctx.createMemberExpression([object, property], stack);
    } else {
      return ctx.createMemberExpression([object, property], stack);
    }
  }
  if (desc2 !== stack.module && import_Utils10.default.isClassType(desc2)) {
    ctx.addDepend(desc2, stack.module);
    if (!stack.hasLocalDefined()) {
      return ctx.createIdentifier(
        ctx.getGlobalRefName(
          stack,
          ctx.getModuleReferenceName(desc2, module2)
        ),
        stack
      );
    }
  }
  return ctx.createIdentifier(stack.value(), stack);
}

// node_modules/@easescript/transform/lib/tokens/IfStatement.js
function IfStatement_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.condition = ctx.createToken(stack.condition);
  node.consequent = ctx.createToken(stack.consequent);
  node.alternate = ctx.createToken(stack.alternate);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/ImportDeclaration.js
init_Common();
function ImportDeclaration_default(ctx, stack) {
  let module2 = stack.additional ? stack.additional.module : null;
  parseImportDeclaration(ctx, stack, module2 || stack.compilation);
  return null;
}

// node_modules/@easescript/transform/lib/tokens/ImportDefaultSpecifier.js
function ImportDefaultSpecifier_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.local = stack.local ? ctx.createToken(stack.local) : ctx.createIdentifier(stack.value(), stack);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/ImportExpression.js
function ImportExpression_default(ctx, stack) {
  const node = ctx.createNode(stack);
  const desc2 = stack.description();
  if (desc2) {
    const source = ctx.getModuleImportSource(desc2, stack.compilation.file, stack.source.value());
    node.source = ctx.createLiteral(source, void 0, stack.source);
  } else {
    node.source = ctx.createToken(stack.source);
  }
  return node;
}

// node_modules/@easescript/transform/lib/tokens/ImportNamespaceSpecifier.js
function ImportNamespaceSpecifier_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.local = stack.local ? ctx.createToken(stack.local) : ctx.createIdentifier(stack.value(), stack);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/ImportSpecifier.js
function ImportSpecifier_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.imported = node.createToken(stack.imported);
  node.local = stack.local ? ctx.createToken(stack.local) : ctx.createIdentifier(stack.value(), stack);
  return node;
}

// node_modules/@easescript/transform/lib/core/InterfaceBuilder.js
var modifierMaps2 = {
  "public": MODIFIER_PUBLIC,
  "protected": MODIFIER_PROTECTED,
  "private": MODIFIER_PRIVATE
};
var kindMaps2 = {
  "accessor": KIND_ACCESSOR,
  "var": KIND_VAR,
  "const": KIND_CONST,
  "method": KIND_METHOD,
  "enumProperty": KIND_ENUM_PROPERTY
};
var InterfaceBuilder = class extends ClassBuilder_default {
  create(ctx) {
    ctx.setNode(this.stack, this);
    const module2 = this.module;
    const stack = this.stack;
    this.createInherit(ctx, module2, stack);
    this.createImplements(ctx, module2, stack);
    this.createBody(ctx, module2, stack);
    let methods7 = this.createMemberDescriptors(ctx, this.methods);
    let members = this.createMemberDescriptors(ctx, this.members);
    let creator = this.createCreator(
      ctx,
      module2,
      module2.id,
      this.createClassDescriptor(ctx, module2, methods7, members)
    );
    ctx.crateModuleAssets(module2);
    ctx.createModuleImportReferences(module2);
    if (stack.compilation.mainModule === module2) {
      ctx.addExport("default", ctx.createIdentifier(module2.id));
    }
    ctx.removeNode(this.stack);
    let expressions = [
      this.construct,
      ...this.beforeBody,
      ...this.body,
      ...this.afterBody,
      ctx.createExpressionStatement(creator)
    ];
    let symbolNode = this.privateSymbolNode;
    if (symbolNode) {
      expressions.unshift(symbolNode);
    }
    return ctx.createMultipleStatement(expressions);
  }
  createBody(ctx, module2, stack) {
    this.createMemebers(ctx, stack);
    if (!this.construct) {
      this.construct = this.createDefaultConstructor(ctx, module2.id, module2.inherit);
    }
    this.checkConstructor(ctx, this.construct, module2);
  }
  createMemberDescriptor(ctx, node) {
    if (node.dynamic && node.type === "PropertyDefinition") {
      return null;
    }
    let key = node.key;
    let modifier = node.modifier || "public";
    let properties = [];
    let mode = modifierMaps2[modifier] | kindMaps2[node.kind];
    if (node.static) {
      mode |= MODIFIER_STATIC;
    }
    if (node.isAbstract) {
      mode |= MODIFIER_ABSTRACT;
    }
    if (node.isFinal) {
      mode |= MODIFIER_FINAL;
    }
    properties.push(
      ctx.createProperty(
        ctx.createIdentifier("m"),
        ctx.createLiteral(mode)
      )
    );
    if (node.isAccessor) {
      if (node.get) {
        properties.push(
          ctx.createProperty(
            ctx.createIdentifier("get"),
            ctx.createLiteral(true)
          )
        );
      }
      if (node.set) {
        properties.push(
          ctx.createProperty(
            ctx.createIdentifier("set"),
            ctx.createLiteral(true)
          )
        );
      }
    }
    return ctx.createProperty(
      key,
      ctx.createObjectExpression(properties)
    );
  }
};
var InterfaceBuilder_default = InterfaceBuilder;

// node_modules/@easescript/transform/lib/tokens/InterfaceDeclaration.js
function InterfaceDeclaration_default(ctx, stack) {
  const builder = new InterfaceBuilder_default(stack);
  return builder.create(ctx);
}

// node_modules/@easescript/transform/lib/tokens/JSXAttribute.js
var import_Namespace5 = __toESM(require("easescript/lib/core/Namespace"));
init_Common();
function JSXAttribute_default(ctx, stack) {
  let ns = null;
  if (stack.hasNamespaced) {
    const xmlns = stack.getXmlNamespace();
    if (xmlns) {
      ns = xmlns.value.value();
    } else {
      const nsStack = stack.getNamespaceStack();
      const ops2 = stack.compiler.options;
      ns = ops2.jsx.xmlns.default[nsStack.namespace.value()] || ns;
    }
  }
  const node = ctx.createNode(stack);
  node.namespace = ns;
  let name = null;
  let value = stack.value ? ctx.createToken(stack.value) : ctx.createLiteral(true);
  if (stack.isMemberProperty) {
    const eleClass = stack.jsxElement.getSubClassDescription();
    const propsDesc = stack.getAttributeDescription(eleClass);
    const resolveName = getMethodOrPropertyAlias(ctx, propsDesc);
    if (resolveName) {
      name = resolveName.includes("-") ? ctx.createLiteral(resolveName) : ctx.createIdentifier(resolveName);
    }
    const invoke = createJSXAttrHookNode(ctx, stack, propsDesc);
    if (invoke)
      value = invoke;
  }
  if (!name) {
    name = ctx.createToken(stack.name);
  }
  if (ns === "@binding" && stack.value) {
    const desc2 = stack.value.description();
    let has = false;
    if (desc2) {
      has = (desc2.isPropertyDefinition || desc2.isTypeObjectPropertyDefinition) && !desc2.isReadonly || desc2.isMethodGetterDefinition && desc2.module && desc2.module.getMember(desc2.key.value(), "set");
    }
    if (!has && stack.value.isJSXExpressionContainer) {
      let expression2 = stack.value.expression;
      if (expression2) {
        if (expression2.isTypeAssertExpression) {
          expression2 = expression2.left;
        }
        if (expression2.isMemberExpression) {
          const objectType = import_Namespace5.default.globals.get("Object");
          has = objectType && objectType.is(expression2.object.type());
        }
      }
    }
    if (!has) {
      stack.value.error(1e4, stack.value.raw());
    }
  }
  node.name = name;
  node.value = value;
  return node;
}

// node_modules/@easescript/transform/lib/tokens/JSXCdata.js
function JSXCdata_default(ctx, stack) {
  let value = stack.value();
  if (value) {
    value = value.replace(/[\r\n]+/g, "").replace(/\u0022/g, '\\"');
    if (value) {
      return ctx.createLiteral(value);
    }
  }
  return null;
}

// node_modules/@easescript/transform/lib/tokens/JSXClosingElement.js
function JSXClosingElement_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.name = ctx.createToken(stack.name);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/JSXClosingFragment.js
function JSXClosingFragment_default(ctx, stack) {
  return ctx.createNode(stack);
}

// node_modules/@easescript/transform/lib/core/ESX.js
var import_Namespace6 = __toESM(require("easescript/lib/core/Namespace"));
var import_Utils11 = require("easescript/lib/core/Utils");
init_Common();
function createFragmentVNode(ctx, children, props = null) {
  const items = [
    ctx.getVNodeApi("Fragment"),
    props ? props : ctx.createLiteral(null),
    children
  ];
  return ctx.createCallExpression(
    ctx.getVNodeApi("createVNode"),
    items
  );
}
function createWithDirectives(ctx, node, directives) {
  const array = ctx.createArrayExpression(directives);
  array.newLine = true;
  return ctx.createCallExpression(
    ctx.createIdentifier(
      ctx.getVNodeApi("withDirectives")
    ),
    [
      node,
      array
    ]
  );
}
function createCommentVNode(ctx, text) {
  return ctx.createCallExpression(
    ctx.createIdentifier(ctx.getVNodeApi("createCommentVNode")),
    [
      ctx.createLiteral(text)
    ]
  );
}
function createSlotNode(ctx, stack, ...args) {
  if (stack.isSlot && stack.isSlotDeclared) {
    const slots = ctx.createCallExpression(
      ctx.createMemberExpression([
        ctx.createThisExpression(),
        ctx.createIdentifier("getAttribute")
      ]),
      [
        ctx.createLiteral("slots")
      ]
    );
    const node = ctx.createCallExpression(
      ctx.createIdentifier(
        ctx.getVNodeApi("renderSlot")
      ),
      [slots].concat(args)
    );
    node.isSlotNode = true;
    return node;
  } else {
    const node = ctx.createCallExpression(
      ctx.createIdentifier(ctx.getVNodeApi("withCtx")),
      args
    );
    node.isSlotNode = true;
    return node;
  }
}
function createWithCtxNode(ctx, node) {
  return ctx.createCallExpression(
    ctx.createIdentifier(ctx.getVNodeApi("withCtx")),
    [
      node
    ]
  );
}
function createForMapNode(ctx, object, element, item, key, index, stack) {
  const params = [item];
  if (key) {
    params.push(key);
  }
  if (index) {
    params.push(index);
  }
  if (element.type === "ArrayExpression" && element.elements.length === 1) {
    element = element.elements[0];
  }
  const node = ctx.createArrowFunctionExpression(element, params);
  return ctx.createCallExpression(
    createStaticReferenceNode(ctx, stack, "System", "forMap"),
    [
      object,
      node
    ]
  );
}
function createForEachNode(ctx, refs, element, item, key) {
  const args = [item];
  if (key) {
    args.push(key);
  }
  if (element.type === "ArrayExpression" && element.elements.length === 1) {
    element = element.elements[0];
  }
  const node = ctx.createCallExpression(
    ctx.createMemberExpression([
      refs,
      ctx.createIdentifier("map")
    ]),
    [
      ctx.createArrowFunctionExpression(element, args)
    ]
  );
  if (element.type === "ArrayExpression") {
    return ctx.createCallExpression(
      ctx.createMemberExpression([
        node,
        ctx.createIdentifier("reduce")
      ]),
      [
        ctx.createArrowFunctionExpression([
          ctx.createIdentifier("acc"),
          ctx.createIdentifier("item")
        ], ctx.createCallee(
          ctx.createMemberExpression([
            ctx.createIdentifier("acc"),
            ctx.createIdentifier("concat")
          ]),
          [
            ctx.createIdentifier("item")
          ]
        )),
        ctx.createArrayExpression()
      ]
    );
  }
  return node;
}
function getComponentDirectiveAnnotation(module2) {
  if (!(0, import_Utils11.isModule)(module2))
    return null;
  const annots = getModuleAnnotations(module2, ["define"]);
  for (let annot of annots) {
    const args = annot.getArguments();
    if (compare(getAnnotationArgumentValue(args[0]), "directives")) {
      if (args.length > 1) {
        return [module2, getAnnotationArgumentValue(args[1]), annot];
      } else {
        return [module2, desc.getName("-"), annot];
      }
    }
  }
  return null;
}
var directiveInterface = null;
function isDirectiveInterface(module2) {
  if (!(0, import_Utils11.isModule)(module2))
    return false;
  directiveInterface = directiveInterface || import_Namespace6.default.globals.get("web.components.Directive");
  if (directiveInterface && directiveInterface.isInterface) {
    return directiveInterface.type().isof(module2);
  }
  return false;
}
function getComponentEmitAnnotation(module2) {
  if (!(0, import_Utils11.isModule)(module2))
    return null;
  const dataset = /* @__PURE__ */ Object.create(null);
  const annots = getModuleAnnotations(desc, ["define"]);
  annots.forEach((annot) => {
    const args = annot.getArguments();
    if (args.length > 1) {
      let value = getAnnotationArgumentValue(args[0]);
      let _args = args;
      let _key = null;
      let isEmits = compare(value, "emits");
      let isOptions = compare(value, "options");
      if (isEmits) {
        _args = args.slice(1);
        _key = "emits";
      } else if (isOptions) {
        _args = args.slice(2);
        _key = getAnnotationArgumentValue(args[1]);
      }
      _key = String(_key).toLowerCase();
      if (_key === "emits") {
        let skip = _args.length > 1 ? _args[_args.length - 1] : null;
        if (skip && skip.assigned && String(skip.key).toLowerCase() === "type") {
          if (skip.value !== "--literal") {
            skip = null;
          }
        } else {
          skip = null;
        }
        _args.forEach((arg) => {
          if (arg === skip || !arg)
            return;
          if (arg.assigned) {
            dataset[arg.key] = arg.value;
          } else {
            dataset[arg.value] = arg.value;
          }
        });
      }
    }
  });
  return dataset;
}
function createChildNode(ctx, stack, childNode, prev = null) {
  if (!childNode)
    return null;
  const cmd = [];
  let content = [childNode];
  if (!stack.directives || !(stack.directives.length > 0)) {
    return {
      cmd,
      child: stack,
      content
    };
  }
  const directives = stack.directives.slice(0).sort((a, b) => {
    const bb = b.name.value().toLowerCase();
    const aa = a.name.value().toLowerCase();
    const v1 = bb === "each" || bb === "for" ? 1 : 0;
    const v2 = aa === "each" || aa === "for" ? 1 : 0;
    return v1 - v2;
  });
  while (directives.length > 0) {
    const directive = directives.shift();
    const name = directive.name.value().toLowerCase();
    const valueArgument = directive.valueArgument;
    if (name === "each" || name === "for") {
      let refs = ctx.createToken(valueArgument.expression);
      let item = ctx.createIdentifier(valueArgument.declare.item);
      let key = ctx.createIdentifier(valueArgument.declare.key || "key");
      let index = valueArgument.declare.index;
      if (index) {
        index = ctx.createIdentifier(index);
      }
      if (name === "each") {
        content[0] = createForEachNode(
          ctx,
          refs,
          content[0],
          item,
          key
        );
      } else {
        content[0] = createForMapNode(
          ctx,
          refs,
          content[0],
          item,
          key,
          index,
          stack
        );
      }
      content[0].isForNode = true;
      cmd.push(name);
    } else if (name === "if") {
      const node = ctx.createNode("ConditionalExpression");
      node.test = ctx.createToken(valueArgument.expression);
      node.consequent = content[0];
      content[0] = node;
      cmd.push(name);
    } else if (name === "elseif") {
      if (!prev || !(prev.cmd.includes("if") || prev.cmd.includes("elseif"))) {
        directive.name.error(1114, name);
      } else {
        cmd.push(name);
      }
      const node = ctx.createNode("ConditionalExpression");
      node.test = ctx.createToken(valueArgument.expression);
      node.consequent = content[0];
      content[0] = node;
    } else if (name === "else") {
      if (!prev || !(prev.cmd.includes("if") || prev.cmd.includes("elseif"))) {
        directive.name.error(1114, name);
      } else {
        cmd.push(name);
      }
    }
  }
  return {
    cmd,
    child: stack,
    content
  };
}
function createSlotCalleeNode(ctx, stack, child, ...args) {
  if (stack.isSlotDeclared) {
    return ctx.createCallExpression(
      ctx.createMemberExpression([
        ctx.createThisExpression(),
        ctx.createIdentifier("slot")
      ]),
      child ? args.concat(child) : args,
      stack
    );
  } else {
    return child || ctx.createArrowFunctionExpression(ctx.createArrayExpression());
  }
}
function getCascadeConditional(elements) {
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
function createChildren(ctx, children, data) {
  let content = [];
  let len = children.length;
  let index = 0;
  let last = null;
  let result = null;
  let next = () => {
    if (index < len) {
      const child = children[index++];
      const childNode = createChildNode(
        ctx,
        child,
        ctx.createToken(child),
        last
      ) || next();
      if (child.hasAttributeSlot) {
        const attributeSlot = child.openingElement.attributes.find((attr) => attr.isAttributeSlot);
        if (attributeSlot) {
          const name = attributeSlot.name.value();
          const scopeName = attributeSlot.value ? ctx.createToken(
            attributeSlot.parserSlotScopeParamsStack()
          ) : null;
          let childrenNodes = childNode.content;
          if (childrenNodes.length === 1 && childrenNodes[0].type === "ArrayExpression") {
            childrenNodes = childrenNodes[0];
          } else {
            childrenNodes = ctx.createArrayExpression(childrenNodes);
          }
          const params = scopeName ? [
            ctx.createAssignmentExpression(
              scopeName,
              ctx.createObjectExpression()
            )
          ] : [];
          const renderSlots = createSlotCalleeNode(
            ctx,
            child,
            ctx.createArrowFunctionExpression(childrenNodes, params)
          );
          data.slots[name] = renderSlots;
          return next();
        }
      } else if (child.isSlot && !child.isSlotDeclared) {
        const name = child.openingElement.name.value();
        data.slots[name] = childNode.content[0];
        return next();
      } else if (child.isDirective) {
        childNode.cmd.push(
          child.openingElement.name.value().toLowerCase()
        );
      }
      return childNode;
    }
    return null;
  };
  const push = (data2, value) => {
    if (value) {
      if (Array.isArray(value)) {
        data2.push(...value);
      } else {
        data2.push(value);
      }
    }
  };
  let hasComplex = false;
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
          value = getCascadeConditional(last.content.concat(result.content));
          result.ifEnd = true;
        } else {
          if (result)
            result.ifEnd = true;
          last.content.push(createCommentVNode("end if"));
          value = getCascadeConditional(last.content);
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
    let first = content[0];
    if (content.length === 1 && (first.type == "ArrayExpression" || first.isForNode || first.isSlotNode)) {
      return first;
    }
    let base = content.length > 1 ? content.shift() : ctx.createArrayExpression();
    if (base.type !== "ArrayExpression" && !base.isForNode) {
      base = ctx.createArrayExpression([base]);
      base.newLine = true;
    }
    const node2 = ctx.createCallExpression(
      ctx.createMemberExpression([
        base,
        ctx.createIdentifier("concat")
      ]),
      content.reduce(function(acc, val) {
        if (val.type === "ArrayExpression") {
          return acc.concat(...val.elements);
        } else {
          return acc.concat(val);
        }
      }, [])
    );
    node2.newLine = true;
    node2.indentation = true;
    return node2;
  }
  const node = ctx.createArrayExpression(content);
  if (content.length > 1 || !(content[0].type === "Literal" || content[0].type === "Identifier")) {
    node.newLine = true;
  }
  return node;
}
function createGetEventValueNode(ctx, name = "e") {
  return ctx.createCallExpression(
    ctx.createMemberExpression([
      ctx.createThisExpression(),
      ctx.createIdentifier("getBindEventValue")
    ]),
    [
      ctx.createIdentifier(name)
    ]
  );
}
function createDirectiveArrayNode(ctx, name, expression2, ...args) {
  const elems = [
    ctx.createIdentifier(ctx.getVNodeApi(name)),
    expression2,
    ...args
  ];
  return ctx.createArrayExpression(elems);
}
function createResolveAttriubeDirective(ctx, attrDirective) {
  if (!attrDirective.value)
    return;
  return ctx.createCallExpression(
    createStaticReferenceNode(ctx, attrDirective, "web.components.Component", "resolveDirective"),
    [
      ctx.createToken(attrDirective.parserAttributeValueStack()),
      attrDirective.module ? ctx.createThisExpression() : ctx.createLiteral(null)
    ]
  );
}
function createAttributeBindingEventNode(ctx, attribute, valueTokenNode) {
  if (attribute.value.isJSXExpressionContainer) {
    const expr = attribute.value.expression;
    if (expr.isAssignmentExpression || expr.isSequenceExpression) {
      return ctx.createArrowFunctionExpression(valueTokenNode);
    } else if (!expr.isFunctionExpression) {
      if (expr.isCallExpression) {
        const isBind = expr.callee.isMemberExpression && expr.callee.property.value() === "bind" && expr.arguments.length > 0 && expr.arguments[0].isThisExpression;
        if (!isBind && valueTokenNode && valueTokenNode.type === "CallExpression") {
          valueTokenNode.arguments.push(ctx.createIdentifier("...args"));
          return ctx.createArrowFunctionExpression(
            valueTokenNode,
            [
              ctx.createIdentifier("...args")
            ]
          );
        }
      } else if (expr.isMemberExpression || expr.isIdentifier) {
        const desc2 = expr.description();
        const isMethod = desc2 && (desc2.isMethodDefinition && !desc2.isAccessor);
        if (isMethod) {
          return ctx.createCallExpression(
            ctx.createMemberExpression([
              valueTokenNode,
              ctx.createIdentifier("bind")
            ]),
            [ctx.createThisExpression()]
          );
        }
      }
    }
  }
  return valueTokenNode;
}
function getBinddingEventName(stack) {
  const bindding = getMethodAnnotations(stack, ["bindding"]);
  if (bindding.length > 0) {
    const [annot] = bindding;
    const args = annot.getArguments();
    return getAnnotationArgumentValue(args[0]);
  }
  return null;
}
function mergeElementPropsNode(ctx, data, stack) {
  const items = [];
  const ssr = !!ctx.options.ssr;
  Object.entries(data).map((item) => {
    const [key, value] = item;
    if (key === "slots" || key === "directives" || key === "keyProps") {
      return;
    }
    if (value) {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          const type = value[0].type;
          const isObject = type === "Property" || type === "SpreadElement";
          if (isObject) {
            if (key === "props" || key === "attrs") {
              items.push(...value);
              return;
            } else if (key === "on") {
              if (ssr)
                return;
              value.forEach((item2) => {
                if (item2.type === "Property") {
                  if (item2.computed) {
                    item2.key = ctx.createTemplateLiteral([
                      ctx.createTemplateElement("on")
                    ], [
                      ctx.createCallExpression(
                        createStaticReferenceNode(ctx, stack, "System", "firstUpperCase"),
                        [
                          item2.key
                        ]
                      )
                    ]);
                  } else {
                    item2.key.value = "on" + toFirstUpperCase(item2.key.value);
                  }
                  items.push(item2);
                }
              });
              return;
            }
            items.push(
              ctx.createProperty(
                ctx.createIdentifier(key),
                ctx.createObjectExpression(value)
              )
            );
          } else {
            items.push(
              ctx.createProperty(
                ctx.createIdentifier(key),
                ctx.createArrayExpression(value)
              )
            );
          }
        }
      } else {
        if (value.type === "Property") {
          items.push(value);
        } else {
          items.push(
            ctx.createProperty(
              ctx.createIdentifier(key),
              value
            )
          );
        }
      }
    }
  });
  const props = items.length > 0 ? ctx.createObjectExpression(items) : null;
  if (props && stack && stack.isComponent) {
    const desc2 = stack.description();
    if (desc2 && (0, import_Utils11.isModule)(desc2)) {
      let has = getModuleAnnotations(desc2, ["hook"]).some((annot) => {
        let result = parseHookAnnotation(annot, ctx.plugin.version, ctx.options.metadata.versions);
        return result && result.type === "polyfills:props";
      });
      if (has) {
        return createComponentPropsHookNode(ctx, props, ctx.createLiteral(desc2.getName()));
      }
    }
  }
  return props;
}
function createComponentPropsHookNode(ctx, props, className) {
  return ctx.createCallExpression(
    ctx.createMemberExpression([
      ctx.createThisExpression(),
      ctx.createIdentifier("invokeHook")
    ]),
    [
      ctx.createLiteral("polyfills:props"),
      props,
      className
    ]
  );
}
function createAttributes(ctx, stack, data) {
  const pushEvent = (name, node, category) => {
    let events = data[category] || (data[category] = []);
    if (!Node_default.is(name)) {
      name = String(name);
      name = name.includes(":") ? ctx.createLiteral(name) : ctx.createIdentifier(name);
    }
    let property = ctx.createProperty(name, node);
    if (property.key.computed) {
      property.computed = true;
      property.key.computed = false;
    }
    events.push(property);
  };
  let isComponent = stack.isComponent || stack.isWebComponent;
  let nodeType = !isComponent ? stack.openingElement.name.value().toLowerCase() : null;
  let binddingModelValue = null;
  let afterDirective = null;
  let custom = null;
  if (nodeType === "input") {
    afterDirective = "vModelText";
  } else if (nodeType === "select") {
    afterDirective = "vModelSelect";
  } else if (nodeType === "textarea") {
    afterDirective = "vModelText";
  }
  const forStack = stack.getParentStack((stack2) => {
    return stack2.scope.isForContext || !(stack2.isJSXElement || stack2.isJSXExpressionContainer);
  }, true);
  const inFor = forStack && forStack.scope && forStack.scope.isForContext ? true : false;
  const descModule2 = stack.isWebComponent ? stack.description() : null;
  const definedEmits = getComponentEmitAnnotation(descModule2);
  const getDefinedEmitName = (name) => {
    if (definedEmits && Object.prototype.hasOwnProperty.call(definedEmits, name)) {
      name = toCamelCase(definedEmits[name]);
    }
    return name;
  };
  stack.openingElement.attributes.forEach((item) => {
    if (item.isAttributeXmlns)
      return;
    if (item.isAttributeDirective) {
      if (item.isAttributeDirective) {
        const name2 = item.name.value();
        if (compare(name2, "show")) {
          data.directives.push(
            createDirectiveArrayNode(
              ctx,
              "vShow",
              ctx.createToken(item.valueArgument.expression)
            )
          );
        } else if (compare(name2, "custom")) {
          data.directives.push(
            createResolveAttriubeDirective(
              ctx,
              item
            )
          );
        }
      }
      return;
    } else if (item.isJSXSpreadAttribute) {
      if (item.argument) {
        data.props.push(
          ctx.createSpreadElement(
            ctx.createToken(item.argument),
            item
          )
        );
      }
      return;
    } else if (item.isAttributeSlot) {
      return;
    }
    let value = ctx.createToken(item);
    if (!value)
      return;
    let ns = value.namespace;
    let name = value.name.value;
    let propName = name;
    let propValue = value.value;
    let attrLowerName = name.toLowerCase();
    if (ns === "@events" || ns === "@natives") {
      name = getDefinedEmitName(name);
    }
    if (ns && ns.includes("::")) {
      let [seg, className] = ns.split("::", 2);
      ns = seg;
      name = createStaticReferenceNode(ctx, item, className, name);
      name.computed = true;
      custom = name;
    }
    let isDOMAttribute = false;
    if (item.isMemberProperty) {
      let attrDesc = item.getAttributeDescription(stack.getSubClassDescription());
      if (attrDesc) {
        isDOMAttribute = getMethodAnnotations(attrDesc, ["domattribute"]).length > 0;
      }
    }
    if (ns === "@events" || ns === "@natives") {
      pushEvent(name, createAttributeBindingEventNode(item, propValue), "on");
      return;
    } else if (ns === "@binding") {
      binddingModelValue = propValue;
      if (!binddingModelValue || !(binddingModelValue.type === "MemberExpression" || binddingModelValue.type === "Identifier")) {
        binddingModelValue = null;
        if (item.value && item.value.isJSXExpressionContainer) {
          const stack2 = item.value.expression;
          if (stack2 && stack2.isMemberExpression && !stack2.optional) {
            binddingModelValue = ctx.createCallExpression(
              createStaticReferenceNode(ctx, stack2, "Reflect", "set"),
              [
                stack2.module ? ctx.createIdentifier(stack2.module.id) : ctx.createLiteral(null),
                ctx.createToken(stack2.object),
                stack2.computed ? ctx.createToken(stack2.property) : ctx.createLiteral(stack2.property.value()),
                ctx.createIdentifier("value")
              ],
              stack2
            );
            binddingModelValue.isReflectSetter = true;
          }
        }
      }
    }
    if (item.isMemberProperty) {
      if (ns === "@binding" && attrLowerName === "value") {
        data.props.push(
          ctx.createProperty(
            ctx.createIdentifier(
              propName,
              item.name
            ),
            propValue
          )
        );
        propName = "modelValue";
      }
      if (!isDOMAttribute) {
        data.props.push(
          ctx.createProperty(
            ctx.createIdentifier(
              propName,
              item.name
            ),
            propValue
          )
        );
        if (ns !== "@binding")
          return;
      }
    }
    if (attrLowerName === "type" && nodeType === "input" && propValue && propValue.type === "Literal") {
      const value2 = propValue.value.toLowerCase();
      if (value2 === "checkbox") {
        afterDirective = "vModelCheckbox";
      } else if (value2 === "radio") {
        afterDirective = "vModelRadio";
      }
    }
    if (ns === "@binding") {
      const createBinddingParams = (getEvent = false) => {
        return [
          binddingModelValue.isReflectSetter ? binddingModelValue : ctx.createAssignmentExpression(
            binddingModelValue,
            getEvent ? createGetEventValueNode(ctx) : ctx.createIdentifier("e")
          ),
          [
            ctx.createIdentifier("e")
          ]
        ];
      };
      if (custom && binddingModelValue) {
        pushEvent(custom, ctx.createArrowFunctionExpression(
          ...createBinddingParams(!stack.isWebComponent)
        ), "on");
      } else if ((stack.isWebComponent || afterDirective) && binddingModelValue) {
        let eventName = propName;
        if (propName === "modelValue") {
          eventName = "update:modelValue";
        }
        if (item.isMemberProperty) {
          let _name = getBinddingEventName(item.description());
          if (_name) {
            eventName = toCamelCase(_name);
          }
        }
        pushEvent(
          getDefinedEmitName(eventName),
          ctx.createArrowFunctionExpression(
            ...createBinddingParams()
          ),
          "on"
        );
      } else if (binddingModelValue) {
        pushEvent(
          ctx.createIdentifier("input"),
          ctx.createArrowFunctionExpression(
            ...createBinddingParams(true)
          ),
          "on"
        );
      }
      if (afterDirective && binddingModelValue) {
        data.directives.push(
          createDirectiveArrayNode(ctx, afterDirective, binddingModelValue)
        );
      }
      return;
    }
    if (!ns && (attrLowerName === "ref" || attrLowerName === "refs")) {
      name = propName = "ref";
      let useArray = inFor || attrLowerName === "refs";
      if (useArray) {
        propValue = ctx.createArrowFunctionExpression(
          ctx.createCallExpression(
            ctx.createMemberExpression([
              ctx.createThisExpression(),
              ctx.createIdentifierExpression("setRefNode")
            ]),
            [
              value.value,
              ctx.createIdentifier("node"),
              ctx.createLiteral(true)
            ]
          ),
          [
            ctx.createIdentifier("node")
          ]
        );
      }
    }
    if (name === "class" || name === "staticClass") {
      if (propValue && propValue.type !== "Literal") {
        propValue = ctx.createCallExpression(
          ctx.createIdentifier(
            ctx.getVNodeApi("normalizeClass")
          ),
          [
            propValue
          ]
        );
      }
    } else if (name === "style" || name === "staticStyle") {
      if (propValue && !(propValue.type === "Literal" || propValue.type === "ObjectExpression")) {
        propValue = ctx.createCallExpression(
          ctx.createIdentifier(
            ctx.getVNodeApi("normalizeStyle")
          ),
          [propValue]
        );
      }
    } else if (attrLowerName === "key" || attrLowerName === "tag") {
      name = attrLowerName;
    }
    const property = ctx.createProperty(
      ctx.createIdentifier(
        propName,
        item.name
      ),
      propValue
    );
    switch (name) {
      case "class":
      case "style":
      case "key":
      case "tag":
      case "ref":
        data[name] = property;
        break;
      default:
        data.attrs.push(property);
    }
  });
  if (!data.key) {
    data.key = createElementKeyPropertyNode(ctx, stack);
  }
}
function createElementKeyPropertyNode(ctx, stack) {
  const keys2 = ctx.options.esx.complete.keys;
  const fills = Array.isArray(keys2) && keys2.length > 0 ? keys2 : null;
  const all = keys2 === true;
  if (fills || all) {
    let key = null;
    let direName = null;
    let isForContext = false;
    if (all || fills.includes("for") || fills.includes("each")) {
      if (!stack.isDirective && stack.directives && Array.isArray(stack.directives)) {
        let directive = stack.directives.find((directive2) => ["for", "each"].includes(directive2.name.value().toLowerCase()));
        if (directive) {
          isForContext = true;
          direName = directive.name.value().toLowerCase();
          let valueArgument = directive.valueArgument;
          if (valueArgument) {
            key = valueArgument.declare.index || valueArgument.declare.key;
          }
        }
      }
      if (!direName && stack.parentStack.isDirective && ["for", "each"].includes(stack.parentStack.openingElement.name.value())) {
        const attrs = stack.parentStack.openingElement.attributes;
        const argument = {};
        isForContext = true;
        direName = stack.parentStack.openingElement.name.value().toLowerCase();
        attrs.forEach((attr) => {
          argument[attr.name.value()] = attr.value.value();
        });
        key = argument["index"] || argument["key"];
      }
    }
    if (fills && fills.includes("condition")) {
      if (!stack.isDirective && stack.directives && Array.isArray(stack.directives)) {
        let directive = stack.directives.find((directive2) => ["if", "elseif", "else"].includes(directive2.name.value().toLowerCase()));
        if (directive) {
          direName = directive.name.value().toLowerCase();
        }
      }
      if (!isForContext && stack.parentStack.isDirective && ["if", "elseif", "else"].includes(stack.parentStack.openingElement.name.value())) {
        direName = stack.parentStack.openingElement.name.value().toLowerCase();
      }
    }
    if (all || fills.includes(direName)) {
      return ctx.createProperty(
        ctx.createIdentifier("key"),
        isForContext ? ctx.createBinaryExpression(
          ctx.createLiteral(getDepth(stack) + "."),
          ctx.createIdentifier(key || "key"),
          "+"
        ) : ctx.createLiteral(getDepth(stack))
      );
    }
  }
}
function createComponentDirectiveProperties(ctx, stack, data, callback = null) {
  if (stack) {
    let desc2 = stack.description();
    let parentIsComponentDirective = getComponentDirectiveAnnotation(desc2);
    if (!parentIsComponentDirective) {
      parentIsComponentDirective = isDirectiveInterface(desc2);
    }
    if (parentIsComponentDirective) {
      let node = createResolveComponentDirective(ctx, stack, data, callback);
      if (node) {
        data.directives.push(node);
      }
      if (stack.jsxRootElement !== stack) {
        createComponentDirectiveProperties(ctx, stack.parentStack, data, callback);
      }
      return true;
    }
  }
  return false;
}
function createCustomDirectiveProperties(ctx, stack, data, callback = null) {
  const node = createResolveComponentDirective(ctx, stack, data, callback);
  if (node) {
    data.directives.push(node);
  }
  if (stack.parentStack && stack.parentStack.isDirective && stack.jsxRootElement !== stack.parentStack) {
    let dName = stack.parentStack.openingElement.name.value().toLowerCase();
    if (dName === "custom") {
      createCustomDirectiveProperties(ctx, stack.parentStack, data, callback);
    }
  }
}
function createResolveComponentDirective(ctx, stack, data, callback = null) {
  const props = [];
  const has = (items, name) => items && items.some((prop) => prop.key.value === name);
  stack.openingElement.attributes.forEach((attr) => {
    if (attr.isAttributeXmlns || attr.isAttributeDirective)
      return;
    const name = attr.name.value();
    const property = ctx.createProperty(
      ctx.createIdentifier(name),
      attr.value ? ctx.createToken(attr.value) : ctx.createLiteral(true)
    );
    if (attr.isMemberProperty) {
      if (!has(data.props, name)) {
        property.isInheritDirectiveProp = true;
        data.props.push(property);
      }
    } else {
      if (!has(data.attrs, name)) {
        property.isInheritDirectiveAttr = true;
        data.attrs.push(property);
      }
    }
    if (callback) {
      callback(property);
    }
  });
  const object = ctx.createObjectExpression(props);
  const node = ctx.createCallExpression(
    createStaticReferenceNode(ctx, stack, "web.components.Component", "resolveDirective"),
    [
      object,
      ctx.createThisExpression()
    ]
  );
  node.isInheritComponentDirective = true;
  return node;
}
function createSlotElementNode(ctx, stack, children) {
  const openingElement = ctx.createToken(stack.openingElement);
  const args = [ctx, stack];
  let props = null;
  let params = [];
  if (stack.isSlotDeclared) {
    args.push(ctx.createLiteral(stack.openingElement.name.value()));
    if (openingElement.attributes.length > 0) {
      const properties = openingElement.attributes.map((attr) => {
        return ctx.createProperty(
          attr.name,
          attr.value
        );
      });
      props = ctx.createObjectExpression(properties);
    } else {
      props = ctx.createObjectExpression();
    }
    args.push(props);
  } else if (stack.openingElement.attributes.length > 0) {
    const attribute = stack.openingElement.attributes[0];
    if (attribute.value) {
      const stack2 = attribute.parserSlotScopeParamsStack();
      params.push(
        ctx.createAssignmentExpression(
          ctx.createToken(stack2),
          ctx.createObjectExpression()
        )
      );
    }
  }
  if (children) {
    if (Array.isArray(children) && children.length === 0) {
      children = null;
    } else if (children.type === "ArrayExpression" && children.elements.length === 0) {
      children = null;
    }
    if (children) {
      args.push(ctx.createArrowFunctionExpression(children, params));
    }
  }
  return createSlotNode(...args);
}
function createDirectiveElementNode(ctx, stack, children) {
  const openingElement = stack.openingElement;
  const name = openingElement.name.value().toLowerCase();
  switch (name) {
    case "custom":
    case "show":
      return children;
    case "if":
    case "elseif": {
      const condition = ctx.createToken(stack.attributes[0].parserAttributeValueStack());
      const node = ctx.createNode("ConditionalExpression");
      node.test = condition;
      node.consequent = children;
      return node;
    }
    case "else":
      return children;
    case "for":
    case "each": {
      const attrs = stack.openingElement.attributes;
      const argument = {};
      attrs.forEach((attr) => {
        if (attr.name.value() === "name") {
          argument["refs"] = ctx.createToken(attr.parserAttributeValueStack());
        } else {
          argument[attr.name.value()] = ctx.createIdentifier(attr.value.value());
        }
      });
      let item = argument.item || ctx.createIdentifier("item");
      let key = argument.key || ctx.createIdentifier("key");
      let node = name === "for" ? createForMapNode(ctx, argument.refs, children, item, key, argument.index, stack) : createForEachNode(ctx, argument.refs, children, item, key);
      node.isForNode = true;
      return node;
    }
  }
  return null;
}
function createHandleNode(ctx, stack, ...args) {
  let handle = ctx.createIdentifier(
    ctx.getLocalRefName(
      stack,
      ctx.options.esx.handle || "createVNode"
    )
  );
  return ctx.createCallExpression(handle, args);
}
function createElementNode(ctx, stack, data, children) {
  let name = null;
  if (stack.isComponent) {
    if (stack.jsxRootElement === stack && stack.parentStack.isProgram) {
      name = ctx.createLiteral("div");
    } else {
      const desc2 = stack.description();
      if ((0, import_Utils11.isModule)(desc2)) {
        ctx.addDepend(desc2, stack.module);
        name = ctx.createIdentifier(
          ctx.getModuleReferenceName(desc2, stack.module)
        );
      } else {
        name = ctx.createIdentifier(
          stack.openingElement.name.value(),
          stack.openingElement.name
        );
      }
    }
  } else {
    name = ctx.createLiteral(stack.openingElement.name.value());
  }
  data = mergeElementPropsNode(ctx, data, stack);
  if (children) {
    return createHandleNode(ctx, stack, name, data || ctx.createLiteral(null), children);
  } else if (data) {
    return createHandleNode(ctx, stack, name, data);
  } else {
    return createHandleNode(ctx, stack, name);
  }
}
function getDepth(stack) {
  let parentStack = stack.parentStack;
  while (parentStack) {
    if (parentStack.isJSXElement || parentStack.isJSXExpressionContainer || parentStack.isMethodDefinition || parentStack.isProgram)
      break;
    parentStack = parentStack.parentStack;
  }
  if (parentStack && (parentStack.isDirective || parentStack.isSlot || parentStack.isJSXExpressionContainer)) {
    const index = stack.childIndexAt;
    const prefix = getDepth(parentStack);
    return prefix ? prefix + "." + index : index;
  }
  return stack.childIndexAt;
}
function getChildren(stack) {
  return stack.children.filter((child) => {
    return !(child.isJSXScript && child.isScriptProgram || child.isJSXStyle);
  });
}
function createElement(ctx, stack) {
  let data = {
    directives: [],
    slots: {},
    attrs: [],
    props: []
  };
  let isRoot = stack.jsxRootElement === stack;
  let children = getChildren(stack);
  let childNodes = createChildren(ctx, children, data, stack);
  let desc2 = stack.description();
  let componentDirective = getComponentDirectiveAnnotation(desc2);
  let nodeElement = null;
  if (stack.isDirective && stack.openingElement.name.value().toLowerCase() === "custom") {
    componentDirective = true;
  } else if (stack.isComponent && isDirectiveInterface(desc2)) {
    componentDirective = true;
  }
  if (componentDirective) {
    return childNodes;
  }
  if (stack.parentStack && stack.parentStack.isDirective) {
    let dName = stack.parentStack.openingElement.name.value().toLowerCase();
    if (dName === "show") {
      const condition = stack.parentStack.openingElement.attributes[0];
      data.directives.push(
        createDirectiveArrayNode(
          ctx,
          "vShow",
          ctx.createToken(condition.parserAttributeValueStack())
        )
      );
    } else if (dName === "custom") {
      createCustomDirectiveProperties(ctx, stack.parentStack, data);
    }
  } else {
    createComponentDirectiveProperties(ctx, stack.parentStack, data);
  }
  if (!stack.isJSXFragment) {
    if (!(isRoot && stack.openingElement.name.value() === "root")) {
      createAttributes(ctx, stack, data);
    }
  }
  const isWebComponent = stack.isWebComponent && !(stack.compilation.JSX && stack.parentStack.isProgram);
  if (isWebComponent) {
    const properties = [];
    if (childNodes) {
      properties.push(ctx.createProperty(
        ctx.createIdentifier("default"),
        createWithCtxNode(
          ctx.createArrowFunctionExpression(childNodes)
        )
      ));
      childNodes = null;
    }
    if (data.slots) {
      for (let key in data.slots) {
        properties.push(
          ctx.createProperty(
            ctx.createIdentifier(key),
            data.slots[key]
          )
        );
      }
    }
    if (properties.length > 0) {
      childNodes = ctx.createObjectExpression(properties);
    }
  }
  if (stack.isSlot) {
    nodeElement = createSlotElementNode(ctx, stack, childNodes);
  } else if (stack.isDirective) {
    nodeElement = createDirectiveElementNode(ctx, stack, childNodes);
  } else {
    if (stack.isJSXFragment || isRoot && !isWebComponent && stack.openingElement.name.value() === "root") {
      if (Array.isArray(childNodes) && childNodes.length === 1) {
        nodeElement = childNodes[0];
      } else {
        nodeElement = createFragmentVNode(ctx, childNodes);
      }
    } else {
      nodeElement = createElementNode(ctx, stack, data, childNodes);
    }
  }
  if (nodeElement && data.directives && data.directives.length > 0) {
    nodeElement = createWithDirectives(ctx, nodeElement, data.directives);
  }
  return nodeElement;
}

// node_modules/@easescript/transform/lib/tokens/JSXElement.js
function JSXElement(ctx, stack) {
  if (!ctx.options.esx.enable)
    return;
  return createElement(ctx, stack);
}

// node_modules/@easescript/transform/lib/tokens/JSXEmptyExpression.js
function JSXEmptyExpression_default(ctx, stack) {
  return null;
}

// node_modules/@easescript/transform/lib/tokens/JSXExpressionContainer.js
function JSXExpressionContainer_default(ctx, stack) {
  return ctx.createToken(stack.expression);
}

// node_modules/@easescript/transform/lib/tokens/JSXFragment.js
var JSXFragment_default = JSXElement;

// node_modules/@easescript/transform/lib/tokens/JSXIdentifier.js
init_Common();
function JSXIdentifier_default(ctx, stack) {
  var name = stack.value();
  if (stack.parentStack.parentStack.isJSXAttribute) {
    if (name.includes("-")) {
      return ctx.createIdentifier(toCamelCase(name), stack);
    }
  }
  const node = ctx.createNode(stack, "Identifier");
  node.value = name;
  node.raw = name;
  return node;
}

// node_modules/@easescript/transform/lib/tokens/JSXMemberExpression.js
function JSXMemberExpression_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.object = ctx.createToken(stack.object);
  node.property = ctx.createToken(stack.property);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/JSXNamespacedName.js
function JSXNamespacedName_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.name = ctx.createToken(stack.name);
  node.namespace = ctx.createToken(stack.namespace);
  const xmlns = stack.getXmlNamespace();
  if (xmlns) {
    node.value = xmlns.value.value();
  } else {
    const ops2 = stack.compiler.options;
    node.value = ops2.jsx.xmlns.default[stack.namespace.value()] || null;
  }
  node.raw = node.value;
  return node;
}

// node_modules/@easescript/transform/lib/tokens/JSXOpeningElement.js
function JSXOpeningElement_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.attributes = stack.attributes.map((attr) => ctx.createToken(attr));
  node.selfClosing = !!stack.selfClosing;
  if (stack.parentStack.isComponent) {
    const desc2 = stack.parentStack.description();
    if (desc2) {
      if (stack.hasNamespaced && desc2.isFragment) {
        node.name = ctx.createIdentifier(desc2.id, stack.name);
      } else {
        node.name = ctx.createIdentifier(ctx.getModuleReferenceName(desc2, stack.module), stack.name);
      }
    } else {
      node.name = ctx.createIdentifier(stack.name.value(), stack.name);
    }
  } else {
    node.name = ctx.createLiteral(stack.name.value(), void 0, stack.name);
  }
  return node;
}

// node_modules/@easescript/transform/lib/tokens/JSXOpeningFragment.js
function JSXOpeningFragment_default(ctx, stack) {
  return ctx.createNode(stack);
}

// node_modules/@easescript/transform/lib/tokens/JSXScript.js
function JSXScript_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.openingElement = ctx.createToken(stack.openingElement);
  node.closingElement = ctx.createToken(stack.closingElement);
  node.body = (stack.body || []).map((child) => ctx.createToken(child));
}

// node_modules/@easescript/transform/lib/tokens/JSXSpreadAttribute.js
function JSXSpreadAttribute_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.argument = ctx.createToken(stack.argument);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/JSXStyle.js
function JSXStyle_default(ctx, stack) {
  return null;
}

// node_modules/@easescript/transform/lib/tokens/JSXText.js
function JSXText_default(ctx, stack) {
  let value = stack.value();
  if (value) {
    value = value.replace(/\s+/g, " ").replace(/(\u0022|\u0027)/g, "\\$1");
    if (value) {
      return ctx.createLiteral(value);
    }
  }
  return null;
}

// node_modules/@easescript/transform/lib/tokens/LabeledStatement.js
function LabeledStatement_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.label = ctx.createIdentifier(stack.label.value(), stack.label);
  node.body = ctx.createToken(stack.body);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/Literal.js
function Literal_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.raw = stack.raw();
  const code = node.raw.charCodeAt(0);
  if (code === 34 || code === 39) {
    node.value = node.raw.slice(1, -1);
  } else {
    node.value = stack.value();
  }
  return node;
}

// node_modules/@easescript/transform/lib/tokens/LogicalExpression.js
function LogicalExpression_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.left = ctx.createToken(stack.left);
  node.right = ctx.createToken(stack.right);
  node.operator = stack.operator;
  return node;
}

// node_modules/@easescript/transform/lib/tokens/MemberExpression.js
var import_Utils12 = __toESM(require("easescript/lib/core/Utils"));
init_Common();
function addImportReference(ctx, desc2, module2) {
  if (import_Utils12.default.isStack(desc2) && (desc2.isDeclaratorVariable || desc2.isDeclaratorFunction)) {
    let imports = desc2.imports;
    if (Array.isArray(imports)) {
      imports.forEach((item) => {
        if (item.source.isLiteral) {
          parseImportDeclaration(ctx, item, module2);
        }
      });
    }
  }
}
function MemberExpression(ctx, stack) {
  const refsName = stack.getReferenceName();
  if (refsName) {
    return ctx.createIdentifier(refsName, stack);
  }
  const module2 = stack.module;
  const description = stack.descriptor();
  const objectType = stack.object.type();
  if (description && description.isModule && objectType && !objectType.isLiteralObjectType && import_Utils12.default.isTypeModule(description)) {
    ctx.addDepend(description, stack.module);
  } else {
    const objectDescriptor = stack.object.descriptor();
    if (import_Utils12.default.isTypeModule(objectDescriptor)) {
      ctx.addDepend(objectDescriptor, stack.module);
    } else {
      addImportReference(ctx, objectDescriptor, module2 || stack.compilation);
      addImportReference(ctx, description, module2 || stack.compilation);
    }
  }
  if (!description || import_Utils12.default.isType(description) && description.isAnyType && !stack.optional) {
    let isReflect = true;
    if (description) {
      isReflect = false;
      let hasDynamic = description.isComputeType && description.isPropertyExists();
      if (!hasDynamic && !import_Utils12.default.isLiteralObjectType(objectType)) {
        isReflect = true;
      }
    }
    if (isReflect) {
      return ctx.createCallExpression(
        createStaticReferenceNode(ctx, stack, "Reflect", "get"),
        [
          module2 ? ctx.createIdentifier(module2.id) : ctx.createLiteral(null),
          ctx.createToken(stack.object),
          stack.computed ? ctx.createToken(stack.property) : ctx.createLiteral(stack.property.value())
        ],
        stack
      );
    }
  }
  const resolveName = getMethodOrPropertyAlias(ctx, description);
  const privateChain = ctx.options.privateChain;
  if (privateChain && description && description.isMethodDefinition && !(description.static || description.module.static)) {
    const modifier = import_Utils12.default.getModifierValue(description);
    const refModule = description.module;
    if (modifier === "private" && refModule.children.length > 0) {
      let property = resolveName ? ctx.createIdentifier(resolveName, stack.property) : ctx.createToken(stack.property);
      return ctx.createMemberExpression(
        [
          ctx.createIdentifier(module2.id),
          ctx.createIdentifier("prototype"),
          property
        ],
        stack
      );
    }
  }
  if (objectType && !objectType.isLiteralObjectType && import_Utils12.default.isClassType(description)) {
    ctx.addDepend(description, stack.module);
    if (!stack.hasMatchAutoImporter) {
      return ctx.createIdentifier(
        ctx.getModuleReferenceName(description, module2),
        stack
      );
    }
  }
  if (stack.object.isSuperExpression) {
    let property = resolveName ? ctx.createIdentifier(resolveName, stack.property) : ctx.createToken(stack.property);
    if (description && description.isMethodGetterDefinition) {
      if (property.type === "Identifier") {
        property = ctx.createLiteral(
          property.value,
          void 0,
          stack.property
        );
      }
      const args = [
        ctx.createIdentifier(module2.id),
        ctx.createThisExpression(),
        property
      ];
      return ctx.createCallExpression(
        createStaticReferenceNode(ctx, stack, "Class", "callSuperGetter"),
        args
      );
    } else if (description && description.isMethodSetterDefinition) {
      if (property.type === "Identifier") {
        property = ctx.createLiteral(
          property.value,
          void 0,
          stack.property
        );
      }
      const args = [
        ctx.createIdentifier(module2.id),
        ctx.createThisExpression(),
        property
      ];
      return ctx.createCallExpression(
        createStaticReferenceNode(ctx, stack, "Class", "callSuperSetter"),
        args
      );
    } else {
      return ctx.createMemberExpression([
        ctx.createToken(stack.object),
        ctx.createIdentifier("prototype"),
        property
      ]);
    }
  }
  let propertyNode = resolveName ? ctx.createIdentifier(resolveName, stack.property) : ctx.createToken(stack.property);
  if (privateChain && description && description.isPropertyDefinition && !(description.static || description.module.static)) {
    const modifier = import_Utils12.default.getModifierValue(description);
    if ("private" === modifier) {
      const object = ctx.createMemberExpression([
        ctx.createToken(stack.object),
        ctx.createIdentifier(
          ctx.getGlobalRefName(stack, PRIVATE_NAME, stack.module)
        )
      ]);
      object.computed = true;
      return ctx.createMemberExpression([
        object,
        propertyNode
      ]);
    }
  }
  if (description && (!description.isAccessor && description.isMethodDefinition)) {
    const pStack = stack.getParentStack((stack2) => !!(stack2.jsxElement || stack2.isBlockStatement || stack2.isCallExpression || stack2.isExpressionStatement));
    if (pStack && pStack.jsxElement) {
      return ctx.createCallExpression(
        ctx.createMemberExpression([
          ctx.createToken(stack.object),
          propertyNode,
          ctx.createIdentifier("bind")
        ]),
        [ctx.createThisExpression()]
      );
    }
  }
  const node = ctx.createNode(stack);
  node.computed = !!stack.computed;
  node.optional = !!stack.optional;
  node.object = ctx.createToken(stack.object);
  node.property = propertyNode;
  return node;
}
var MemberExpression_default = MemberExpression;

// node_modules/@easescript/transform/lib/tokens/MethodDefinition.js
var import_Utils13 = __toESM(require("easescript/lib/core/Utils"));
function MethodDefinition_default(ctx, stack, type) {
  const node = FunctionDeclaration_default(ctx, stack, type);
  node.async = stack.expression.async ? true : false;
  node.static = !!stack.static;
  node.modifier = import_Utils13.default.getModifierValue(stack);
  node.kind = "method";
  node.isAbstract = !!stack.isAbstract;
  node.isFinal = !!stack.isFinal;
  return node;
}

// node_modules/@easescript/transform/lib/tokens/MethodGetterDefinition.js
function MethodGetterDefinition_default(ctx, stack, type) {
  const node = MethodDefinition_default(ctx, stack, type);
  node.kind = "get";
  return node;
}

// node_modules/@easescript/transform/lib/tokens/MethodSetterDefinition.js
function MethodSetterDefinition_default(ctx, stack, type) {
  const node = MethodDefinition_default(ctx, stack, type);
  node.kind = "set";
  return node;
}

// node_modules/@easescript/transform/lib/tokens/NewExpression.js
var import_Utils14 = __toESM(require("easescript/lib/core/Utils"));
function NewExpression_default(ctx, stack) {
  let desc2 = stack.callee.type();
  desc2 = import_Utils14.default.getOriginType(desc2);
  if (desc2 !== stack.module && import_Utils14.default.isTypeModule(desc2)) {
    ctx.addDepend(desc2, stack.module);
  }
  const node = ctx.createNode(stack);
  node.callee = ctx.createToken(stack.callee);
  node.arguments = stack.arguments.map((item) => ctx.createToken(item));
  return node;
}

// node_modules/@easescript/transform/lib/tokens/ObjectExpression.js
function ObjectExpression_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.properties = stack.properties.map((item) => ctx.createToken(item));
  return node;
}

// node_modules/@easescript/transform/lib/tokens/ObjectPattern.js
function ObjectPattern_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.properties = stack.properties.map((item) => ctx.createToken(item));
  return node;
}

// node_modules/@easescript/transform/lib/tokens/PackageDeclaration.js
function PackageDeclaration_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.body = [];
  ctx.setNode(stack, node);
  stack.body.forEach((item) => {
    if (item.isClassDeclaration || item.isDeclaratorDeclaration || item.isEnumDeclaration || item.isInterfaceDeclaration || item.isStructTableDeclaration) {
      let child = ctx.createToken(item);
      if (child) {
        node.body.push(child);
      }
    }
  });
  ctx.removeNode(stack);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/ParenthesizedExpression.js
function ParenthesizedExpression_default(ctx, stack) {
  if (stack.parentStack.isExpressionStatement) {
    return ctx.createToken(stack.expression);
  }
  const node = ctx.createNode(stack);
  node.expression = ctx.createToken(stack.expression);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/Property.js
function Property_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.computed = !!stack.computed;
  node.key = ctx.createToken(stack.key);
  node.init = ctx.createToken(stack.init);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/PropertyDefinition.js
var import_Utils15 = __toESM(require("easescript/lib/core/Utils"));
init_Common();
function PropertyDefinition_default(ctx, stack) {
  let init = null;
  if (stack.annotations && stack.annotations.length > 0) {
    let items = [];
    stack.annotations.forEach((annot) => {
      const name = annot.getLowerCaseName();
      if (name === "readfile") {
        items.push(
          createReadfileAnnotationNode(ctx, annot) || ctx.createLiteral(null)
        );
      } else if (name === "embed") {
        items.push(
          createEmbedAnnotationNode(ctx, annot)
        );
      } else if (name === "env") {
        items.push(
          createEnvAnnotationNode(ctx, annot)
        );
      } else if (name === "url") {
        items.push(
          createUrlAnnotationNode(ctx, annot)
        );
      }
    });
    if (items.length > 0) {
      init = items.length > 1 ? ctx.createArrayExpression(items) : items[0];
    }
  }
  const node = ctx.createNode(stack);
  const decl = ctx.createToken(stack.declarations[0]);
  node.modifier = import_Utils15.default.getModifierValue(stack);
  node.static = !!stack.static;
  node.kind = stack.kind;
  node.key = decl.id;
  node.init = init || decl.init;
  node.dynamic = stack.dynamic;
  node.isAbstract = !!stack.isAbstract;
  node.isFinal = !!stack.isFinal;
  return node;
}

// node_modules/@easescript/transform/lib/tokens/RestElement.js
function RestElement_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.value = stack.value();
  node.raw = node.value;
  return node;
}

// node_modules/@easescript/transform/lib/tokens/ReturnStatement.js
function ReturnStatement_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.argument = ctx.createToken(stack.argument);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/SequenceExpression.js
function SequenceExpression_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.expressions = stack.expressions.map((item) => ctx.createToken(item));
  return node;
}

// node_modules/@easescript/transform/lib/tokens/SpreadElement.js
function SpreadElement_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.argument = ctx.createToken(stack.argument);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/StructTableColumnDefinition.js
init_Common();
function StructTableColumnDefinition_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.key = ctx.createIdentifier("`" + stack.key.value() + "`", stack.key);
  node.properties = [];
  const type = stack.typename ? ctx.createToken(stack.typename) : ctx.createIdentifier("varchar(255)");
  const unsigned = stack.unsigned ? ctx.createIdentifier("unsigned") : null;
  const notnull = !stack.question ? ctx.createIdentifier("not null") : null;
  node.properties.push(type);
  if (unsigned) {
    node.properties.push(unsigned);
  }
  if (notnull) {
    node.properties.push(notnull);
  }
  {
    (stack.properties || []).forEach((item) => {
      node.properties.push(createIdentNode(ctx, item));
    });
  }
  return node;
}

// node_modules/@easescript/transform/lib/core/TableBuilder.js
var import_path4 = __toESM(require("path"));
var import_fs4 = __toESM(require("fs"));
init_Common();
function normalName(name) {
  return name.replace(/([A-Z])/g, (a, b, i) => {
    return i > 0 ? "_" + b.toLowerCase() : b.toLowerCase();
  });
}
var TableBuilder = class {
  #type = "";
  #changed = true;
  #outfile = "";
  #records = /* @__PURE__ */ new Map();
  constructor(type) {
    this.#type = type;
  }
  createTable(ctx, stack) {
    if (!stack.body.length)
      return false;
    const module2 = stack.module;
    if (this.hasTable(module2.id))
      return false;
    const node = ctx.createNode(stack);
    node.id = ctx.createIdentifier("`" + normalName(stack.id.value()) + "`", stack.id);
    node.properties = [];
    node.body = [];
    stack.body.forEach((item) => {
      const token = createIdentNode(ctx, item);
      if (token) {
        if (item.isStructTablePropertyDefinition) {
          node.properties.push(token);
        } else {
          node.body.push(token);
        }
      }
    });
    let gen = new Generator_default();
    gen.make(node);
    this.#records.set(module2.id, gen.toString());
    this.#changed = true;
    this.build(ctx);
    return true;
  }
  get type() {
    return this.#type;
  }
  get outfile() {
    return this.#outfile;
  }
  set outfile(value) {
    this.#outfile = value;
  }
  getTable(name) {
    return this.#records.get(name);
  }
  hasTable(name) {
    return this.#records.has(name);
  }
  removeTable(name) {
    this.#records.delete(name);
  }
  getTables() {
    return Array.from(this.#records.values());
  }
  async build(ctx) {
    if (!this.#changed)
      return;
    this.#changed = false;
    let file = this.type + ".sql";
    let code = this.getTables().join("\n");
    file = this.outfile || (this.outfile = ctx.getOutputAbsolutePath(file));
    import_fs4.default.mkdirSync(import_path4.default.dirname(file), { recursive: true });
    import_fs4.default.writeFileSync(file, code);
  }
};
var records2 = /* @__PURE__ */ new Map();
function getBuilder(type) {
  if (!records2.has(type)) {
    throw new Error(`The '${type}' table builder is not exists.`);
  }
  return records2.get(type);
}
function addBuilder(type, builder) {
  if (builder instanceof TableBuilder) {
    records2.set(type, builder);
  } else {
    throw new Error("Table builder must is extends TableBuilder.");
  }
}
function getAllBuilder() {
  return Array.from(records2.values());
}
addBuilder("mysql", new TableBuilder("mysql"));

// node_modules/@easescript/transform/lib/tokens/StructTableDeclaration.js
function StructTableDeclaration_default(ctx, stack) {
  getBuilder("mysql").createTable(ctx, stack);
}

// node_modules/@easescript/transform/lib/tokens/StructTableKeyDefinition.js
init_Common();
function StructTableKeyDefinition_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.key = createIdentNode(ctx, stack.key);
  const key = stack.key.value().toLowerCase();
  node.prefix = key === "primary" || key === "key" ? null : ctx.createIdentifier("key");
  node.local = ctx.createToken(stack.local);
  node.properties = (stack.properties || []).map((item) => createIdentNode(ctx, item));
  return node;
}

// node_modules/@easescript/transform/lib/tokens/StructTableMethodDefinition.js
var import_Namespace7 = __toESM(require("easescript/lib/core/Namespace"));
function createNode(ctx, item, isKey = false, toLower = false, type = null) {
  if (!item)
    return null;
  if (type === "enum") {
    if (item.isIdentifier || item.isMemberExpression) {
      const type2 = import_Namespace7.default.globals.get(item.value());
      const list = [];
      if (type2 && type2.isModule && type2.isEnum) {
        Array.from(type2.descriptors.keys()).forEach((key) => {
          const items = type2.descriptors.get(key);
          const item2 = items.find((item3) => item3.isEnumProperty);
          if (item2) {
            list.push(ctx.createLiteral(item2.init.value()));
          }
        });
      }
      return list;
    }
  }
  if (item.isIdentifier) {
    let value = item.value();
    if (toLower)
      value = value.toLowerCase();
    return ctx.createIdentifier(isKey ? "`" + value + "`" : value, item);
  }
  return item.isLiteral ? ctx.createLiteral(item.value()) : ctx.createToken(item);
}
function StructTableMethodDefinition_default(ctx, stack) {
  const node = ctx.createNode(stack);
  const name = stack.key.value().toLowerCase();
  if (name === "text" || name === "longtext" || name === "tinytext" || name === "mediumtext") {
    return ctx.createIdentifier(stack.key.value(), stack.key);
  }
  const key = stack.key.isMemberExpression ? stack.key.property : stack.key;
  node.key = createNode(ctx, key, false);
  const isKey = stack.parentStack.isStructTableKeyDefinition;
  node.params = (stack.params || []).map((item) => createNode(ctx, item, isKey, false, name)).flat().filter(Boolean);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/StructTablePropertyDefinition.js
init_Common();
function StructTablePropertyDefinition_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.assignment = !!stack.assignment;
  node.key = createIdentNode(ctx, stack.key);
  node.init = createIdentNode(ctx, stack.init);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/SuperExpression.js
function SuperExpression_default(ctx, stack) {
  const node = ctx.createNode(stack);
  const parent = stack.module.inherit;
  node.value = ctx.getModuleReferenceName(parent, stack.module);
  node.raw = node.value;
  return node;
}

// node_modules/@easescript/transform/lib/tokens/SwitchCase.js
function SwitchCase_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.condition = ctx.createToken(stack.condition);
  node.consequent = stack.consequent.map((item) => ctx.createToken(item));
  return node;
}

// node_modules/@easescript/transform/lib/tokens/SwitchStatement.js
function SwitchStatement_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.condition = ctx.createToken(stack.condition);
  node.cases = stack.cases.map((item) => ctx.createToken(item));
  return node;
}

// node_modules/@easescript/transform/lib/tokens/TemplateElement.js
function TemplateElement_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.raw = stack.raw();
  node.value = node.raw;
  node.tail = stack.tail;
  return node;
}

// node_modules/@easescript/transform/lib/tokens/TemplateLiteral.js
function TemplateLiteral_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.quasis = stack.quasis.map((item) => ctx.createToken(item));
  node.expressions = stack.expressions.map((item) => ctx.createToken(item));
  return node;
}

// node_modules/@easescript/transform/lib/tokens/ThisExpression.js
function ThisExpression_default(ctx, stack) {
  const node = ctx.createNode(stack);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/ThrowStatement.js
function ThrowStatement_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.argument = ctx.createToken(stack.argument);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/TryStatement.js
function TryStatement_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.block = ctx.createToken(stack.block);
  node.param = ctx.createToken(stack.param);
  node.handler = ctx.createToken(stack.handler);
  node.finalizer = ctx.createToken(stack.finalizer);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/TypeAssertExpression.js
function TypeAssertExpression_default(ctx, stack) {
  return ctx.createToken(stack.left);
}

// node_modules/@easescript/transform/lib/tokens/TypeTransformExpression.js
function TypeTransformExpression_default(ctx, stack) {
  return ctx.createToken(stack.expression);
}

// node_modules/@easescript/transform/lib/tokens/UnaryExpression.js
var import_Utils16 = __toESM(require("easescript/lib/core/Utils"));
init_Common();
function UnaryExpression_default(ctx, stack) {
  const operator = stack.operator;
  const prefix = stack.prefix;
  if (operator === "delete" && stack.argument.isMemberExpression) {
    const desc2 = stack.argument.description();
    if (desc2 && desc2.isAnyType) {
      const hasDynamic = desc2 && desc2.isComputeType && desc2.isPropertyExists();
      if (!hasDynamic && !import_Utils16.default.isLiteralObjectType(stack.argument.object.type())) {
        const property = stack.argument.computed ? ctx.createToken(stack.argument.property) : ctx.createLiteral(
          stack.argument.property.value(),
          void 0,
          stack.argument.property
        );
        return ctx.createCallExpression(
          createStaticReferenceNode(ctx, stack, "Reflect", "deleteProperty"),
          [
            ctx.createToken(stack.argument.object),
            property
          ]
        );
      }
    }
  }
  const node = ctx.createNode(stack);
  node.argument = ctx.createToken(stack.argument);
  node.operator = operator;
  node.prefix = prefix;
  return node;
}

// node_modules/@easescript/transform/lib/tokens/UpdateExpression.js
var import_Utils17 = __toESM(require("easescript/lib/core/Utils"));
init_Common();
function UpdateExpression_default(ctx, stack) {
  const node = ctx.createNode(stack);
  const operator = stack.operator;
  const prefix = stack.prefix;
  const isMember = stack.argument.isMemberExpression;
  if (isMember) {
    const desc2 = stack.argument.description();
    const module2 = stack.module;
    const scopeId = module2 ? module2.id : null;
    let isReflect = false;
    if (stack.argument.computed) {
      const hasDynamic = desc2 && desc2.isComputeType && desc2.isPropertyExists();
      if (!hasDynamic && !import_Utils17.default.isLiteralObjectType(stack.argument.object.type())) {
        isReflect = true;
      }
    } else if (desc2 && desc2.isAnyType) {
      isReflect = !import_Utils17.default.isLiteralObjectType(stack.argument.object.type());
    }
    if (isReflect) {
      const method = operator === "++" ? "incre" : "decre";
      const callee = createStaticReferenceNode(ctx, stack, "Reflect", method);
      return ctx.createCallExpression(callee, [
        ctx.createIdentifier(scopeId),
        ctx.createToken(stack.argument.object),
        ctx.createLiteral(stack.argument.property.value()),
        ctx.createLiteral(!!prefix)
      ], stack);
    }
  }
  node.argument = ctx.createToken(stack.argument);
  node.operator = operator;
  node.prefix = prefix;
  return node;
}

// node_modules/@easescript/transform/lib/tokens/VariableDeclaration.js
function VariableDeclaration_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.inFor = stack.flag;
  node.kind = stack.kind;
  node.declarations = [];
  stack.declarations.forEach((item) => {
    const variable = ctx.createToken(item);
    if (variable) {
      node.declarations.push(variable);
    }
  });
  if (!node.declarations.length) {
    return null;
  }
  return node;
}

// node_modules/@easescript/transform/lib/tokens/VariableDeclarator.js
init_Common();
function VariableDeclarator_default(ctx, stack) {
  if (!stack.flag && !stack.parentStack.isPropertyDefinition && !(stack.id.isArrayPattern || stack.id.isObjectPattern)) {
    const pp = stack.parentStack.parentStack;
    if (pp && !(pp.isExportNamedDeclaration || pp.isExportDefaultDeclaration || pp.isExportSpecifier || pp.isForInStatement || pp.isForStatement || pp.isForOfStatement) && !stack.useRefItems.size) {
      if (!stack.init)
        return null;
    }
  }
  const node = ctx.createNode(stack);
  node.inFor = stack.flag;
  if (stack.id.isIdentifier) {
    let name = stack.id.value();
    if (stack.parentStack && stack.parentStack.isPropertyDefinition) {
      name = getMethodOrPropertyAlias(ctx, stack.parentStack) || name;
    }
    node.id = ctx.createIdentifier(name, stack.id);
  } else {
    node.id = ctx.createToken(stack.id);
  }
  node.init = ctx.createToken(stack.init);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/WhenStatement.js
init_Common();
function WhenStatement_default(ctx, stack) {
  const check2 = (stack2) => {
    if (stack2.isLogicalExpression) {
      if (stack2.isAndOperator) {
        return check2(stack2.left) && check2(stack2.right);
      } else {
        return check2(stack2.left) || check2(stack2.right);
      }
    } else if (!stack2.isCallExpression) {
      throw new Error(`Macro condition must is an call expression`);
    }
    const name = stack2.value();
    const lower = name.toLowerCase();
    const argument = parseMacroMethodArguments(stack2.arguments, lower);
    if (!argument) {
      ctx.error(`The '${name}' macro is not supported`, stack2);
      return;
    }
    switch (lower) {
      case "runtime":
        return isRuntime(argument.value, ctx.options.metadata) === argument.expect;
      case "syntax":
        return isSyntax(ctx.plugin.name, argument.value) === argument.expect;
      case "env":
        {
          if (argument.name && argument.value) {
            return isEnv(argument.name, argument.value, ctx.options) === argument.expect;
          } else {
            ctx.error(`Missing name or value arguments. the '${name}' annotations.`, stack2);
          }
        }
        break;
      case "version":
        {
          if (argument.name && argument.version) {
            let versions = ctx.options.metadata.versions || {};
            let left = argument.name === ctx.plugin.name ? ctx.plugin.version : versions[argument.name];
            let right = argument.version;
            return compareVersion(left, right, argument.operator) === argument.expect;
          } else {
            ctx.error(`Missing name or value arguments. the '${name}' annotations.`, stack2);
          }
        }
        break;
      default:
    }
  };
  const node = ctx.createToken(check2(stack.condition) ? stack.consequent : stack.alternate);
  node && (node.isWhenStatement = true);
  return node;
}

// node_modules/@easescript/transform/lib/tokens/WhileStatement.js
function WhileStatement_default(ctx, stack) {
  const node = ctx.createNode(stack);
  node.condition = ctx.createToken(stack.condition);
  node.body = ctx.createToken(stack.body);
  return node;
}

// node_modules/@easescript/transform/lib/core/Builder.js
var import_glob_path = __toESM(require("glob-path"));
async function buildProgram(ctx, compilation, graph) {
  let root = compilation.stack;
  if (!root) {
    throw new Error("Build program failed");
  }
  let body = [];
  let externals = [];
  let imports = [];
  let exports = [];
  let emitFile = ctx.options.emitFile;
  ctx.setNode(root, body);
  root.body.forEach((item) => {
    if (item.isClassDeclaration || item.isEnumDeclaration || item.isInterfaceDeclaration || item.isStructTableDeclaration || item.isPackageDeclaration) {
      const child = ctx.createToken(item);
      if (child) {
        body.push(child);
      }
    }
  });
  if (root.imports && root.imports.length > 0) {
    root.imports.forEach((item) => {
      if (item.isImportDeclaration) {
        ctx.createToken(item);
      }
    });
  }
  if (root.externals.length > 0) {
    root.externals.forEach((item) => {
      if (item.isImportDeclaration) {
        ctx.createToken(item);
      } else {
        const node = ctx.createToken(item);
        if (node) {
          externals.push(node);
        }
      }
    });
  }
  ctx.removeNode(root);
  if (root.exports.length > 0) {
    root.exports.forEach((item) => {
      ctx.createToken(item);
    });
  }
  if (emitFile) {
    await ctx.buildDeps();
  }
  ctx.crateRootAssets();
  ctx.createAllDependencies();
  let exportNodes = null;
  let importNodes = null;
  if (ctx.options.module === "cjs") {
    importNodes = createCJSImports(ctx, ctx.imports);
    exportNodes = createCJSExports(ctx, ctx.exports, graph);
  } else {
    importNodes = createESMImports(ctx, ctx.imports);
    exportNodes = createESMExports(ctx, ctx.exports, graph);
  }
  imports.push(...importNodes, ...exportNodes.imports);
  body.push(...exportNodes.declares);
  exports.push(...exportNodes.exports);
  let generator = new Generator_default(ctx);
  let layout = [
    ...imports,
    ...ctx.beforeBody,
    ...body,
    ...ctx.afterBody,
    ...externals,
    ...exports
  ];
  if (layout.length > 0) {
    layout.forEach((item) => generator.make(item));
    graph.code = generator.code;
    graph.sourcemap = generator.sourceMap;
    if (emitFile) {
      graph.outfile = ctx.getOutputAbsolutePath(compilation.mainModule || compilation);
    }
  }
}
async function buildAssets(ctx, buildGraph) {
  let assets = buildGraph.assets;
  if (!assets)
    return;
  await Promise.all(
    Array.from(assets.values()).map((asset) => asset.build(ctx))
  );
}
function getTokenManager(options) {
  let _createToken = options.transform.createToken;
  let _tokens = options.transform.tokens;
  let getToken = (type) => {
    return tokens_exports[type];
  };
  let createToken = (ctx, stack, type) => {
    const token = getToken(type);
    if (!token) {
      throw new Error(`Token '${type}' is not exists.`);
    }
    try {
      return token(ctx, stack, type);
    } catch (e) {
      console.error(e);
    }
  };
  if (_tokens && typeof _tokens === "object" && Object.keys(_tokens).length > 0) {
    getToken = (type) => {
      if (Object.prototype.hasOwnProperty.call(_tokens, type)) {
        return _tokens[type];
      }
      return tokens_exports[type];
    };
  }
  if (_createToken && typeof _createToken === "function") {
    createToken = (ctx, stack, type) => {
      try {
        return _createToken(ctx, stack, type);
      } catch (e) {
        console.error(e);
      }
    };
  }
  return {
    get: getToken,
    create: createToken
  };
}
function createBuildContext(plugin2, records3 = /* @__PURE__ */ new Map()) {
  let assets = getAssetsManager(Asset);
  let virtuals = getVirtualModuleManager(VirtualModule);
  let variables = getVariableManager();
  let graphs = getBuildGraphManager();
  let token = getTokenManager(plugin2.options);
  let cache2 = getCacheManager();
  let glob = null;
  let resolve = plugin2.options.resolve || {};
  let imports = resolve?.imports || {};
  Object.keys(imports).forEach((key) => {
    glob = glob || (glob = new import_glob_path.default());
    glob.addRuleGroup(key, imports[key], "imports");
  });
  let folders = resolve?.folders || {};
  Object.keys(folders).forEach((key) => {
    glob = glob || (glob = new import_glob_path.default());
    glob.addRuleGroup(key, folders[key], "folders");
  });
  async function builder(compiOrVModule) {
    if (records3.has(compiOrVModule)) {
      return records3.get(compiOrVModule);
    }
    let ctx = new Context_default(
      compiOrVModule,
      plugin2,
      variables,
      graphs,
      assets,
      virtuals,
      glob,
      cache2,
      token
    );
    let buildGraph = ctx.getBuildGraph(compiOrVModule);
    records3.set(compiOrVModule, buildGraph);
    if (isVModule(compiOrVModule)) {
      await compiOrVModule.build(ctx, buildGraph);
    } else {
      if (!compiOrVModule.parserDoneFlag) {
        await compiOrVModule.ready();
      }
      await buildProgram(ctx, compiOrVModule, buildGraph);
    }
    if (ctx.options.emitFile) {
      await ctx.emit(buildGraph);
      await buildAssets(ctx, buildGraph);
    } else {
      const deps = ctx.getAllDependencies();
      deps.forEach((dep) => {
        if (import_Utils18.default.isModule(dep) && dep.isStructTable) {
          dep.getStacks().forEach((stack) => {
            ctx.createToken(stack);
          });
        }
      });
      await buildAssets(ctx, buildGraph);
    }
    return buildGraph;
  }
  async function buildDeps(ctx) {
    const deps = /* @__PURE__ */ new Set();
    ctx.dependencies.forEach((dataset) => {
      dataset.forEach((dep) => {
        if (import_Utils18.default.isModule(dep)) {
          if (dep.isDeclaratorModule) {
            dep = ctx.getVModule(dep.getName());
            if (dep) {
              deps.add(dep);
            }
          } else if (dep.compilation) {
            deps.add(dep.compilation);
          }
        } else if (isVModule(dep)) {
          deps.add(dep);
        } else if (import_Utils18.default.isCompilation(dep)) {
          deps.add(dep);
        }
      });
    });
    await callAsyncSequence(Array.from(deps.values()), async (dep) => {
      await builder(dep);
    });
  }
  return {
    builder,
    buildDeps,
    buildAssets,
    assets,
    virtuals,
    variables,
    graphs,
    glob,
    token
  };
}

// node_modules/@easescript/transform/lib/core/Polyfill.js
var import_fs5 = __toESM(require("fs"));
var import_path5 = __toESM(require("path"));
var TAGS_REGEXP = /(?:[\r\n]+|^)\/\/\/(?:\s+)?<(references|namespaces|export|import)\s+(.*?)\/>/g;
var ATTRS_REGEXP = /(\w+)(?:[\s+]?=[\s+]?([\'\"])([^\2]*?)\2)?/g;
function parsePolyfillModule(file, createVModule) {
  let content = import_fs5.default.readFileSync(file).toString();
  let references = [];
  let namespace = "";
  let requires = [];
  let exportName = null;
  content = content.replace(TAGS_REGEXP, function(a, b, c) {
    const items = c.matchAll(ATTRS_REGEXP);
    const attr = {};
    if (items) {
      for (let item of items) {
        let [, key, , value] = item;
        if (value)
          value = value.trim();
        attr[key] = value || true;
      }
    }
    switch (b) {
      case "references":
        if (attr["from"]) {
          references.push({
            from: attr["from"],
            local: attr["name"]
          });
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
          requires.push({
            local: attr["name"],
            from: attr["from"],
            imported: !!attr["imported"]
          });
        }
        break;
    }
    return "";
  });
  const info = import_path5.default.parse(file);
  let id = namespace ? `${namespace}.${info.name}` : info.name;
  let vm = createVModule(id);
  requires.forEach((item) => {
    const local = item.local ? item.local : import_path5.default.parse(item.from).name;
    vm.addImport(item.from, local, item.imported);
  });
  references.forEach((item) => {
    const from = String(item.from);
    const local = item.local ? item.local : from.split(".").pop();
    vm.addReference(from, local);
  });
  if (exportName) {
    vm.addExport("default", exportName);
  } else {
    vm.addExport("default", vm.id);
  }
  vm.setContent(content);
}
function createPolyfillModule(dirname, createVModule) {
  if (!import_path5.default.isAbsolute(dirname)) {
    dirname = import_path5.default.join(__dirname, dirname);
  }
  if (!import_fs5.default.existsSync(dirname)) {
    throw new Error(`Polyfills directory does not exists. on '${dirname}'`);
  }
  import_fs5.default.readdirSync(dirname).forEach((filename) => {
    const filepath2 = import_path5.default.join(dirname, filename);
    if (import_fs5.default.statSync(filepath2).isFile()) {
      parsePolyfillModule(filepath2, createVModule);
    } else if (import_fs5.default.statSync(filepath2).isDirectory()) {
      createPolyfillModule(filepath2, createVModule);
    }
  });
}

// node_modules/@easescript/transform/lib/core/Plugin.js
function defineError(complier) {
  if (defineError.loaded || !complier || !complier.diagnostic)
    return;
  defineError.loaded = true;
  let define = complier.diagnostic.defineError;
  define(1e4, "", [
    "\u7ED1\u5B9A\u7684\u5C5E\u6027(%s)\u5FC5\u987B\u662F\u4E00\u4E2A\u53EF\u8D4B\u503C\u7684\u6210\u5458\u5C5E\u6027",
    "Binding the '%s' property must be an assignable members property"
  ]);
  define(10101, "", [
    "\u8DEF\u7531\u53C2\u6570(%s)\u7684\u9ED8\u8BA4\u503C\u53EA\u80FD\u662F\u4E00\u4E2A\u6807\u91CF",
    "Route params the '%s' defalut value can only is a literal type."
  ]);
}
var plugins = /* @__PURE__ */ new Set();
var Plugin = class {
  static is(value) {
    return value ? value instanceof Plugin : false;
  }
  #name = null;
  #version = "0.0.0";
  #records = null;
  #options = null;
  #initialized = false;
  #context = null;
  #complier = null;
  constructor(name, version, options = {}) {
    plugins.add(this);
    this.#name = name;
    this.#version = version;
    this.#options = options;
    if (options.mode) {
      options.metadata.env.NODE_ENV = options.mode;
    }
  }
  get name() {
    return this.#name;
  }
  get options() {
    return this.#options;
  }
  get version() {
    return this.#version;
  }
  get complier() {
    return this.#complier;
  }
  get context() {
    return this.#context;
  }
  init(complier) {
    if (this.#initialized)
      return;
    this.#initialized = true;
    this.#complier = complier;
    this.#records = /* @__PURE__ */ new Map();
    defineError(complier);
    if (this.options.mode === "development") {
      let tableBuilders = null;
      complier.on("onChanged", (compilation) => {
        this.#records.delete(compilation);
        let mainModule = compilation.mainModule;
        if (mainModule.isStructTable) {
          tableBuilders = tableBuilders || getAllBuilder();
          compilation.modules.forEach((module2) => {
            if (module2.isStructTable) {
              tableBuilders.forEach((builder) => {
                builder.removeTable(module2.id);
              });
            }
          });
        }
      });
    }
    let context = createBuildContext(this, this.#records);
    this.#context = context;
    createPolyfillModule(
      import_path6.default.join(__dirname, "./polyfills"),
      context.virtuals.createVModule
    );
  }
  done() {
  }
  async build(compilation, moduleId) {
    if (!import_Compilation.default.is(compilation)) {
      throw new Error("compilation is invalid");
    }
    if (!this.#initialized) {
      this.init(compilation.complier);
    }
    if (moduleId) {
      compilation = this.#context.virtuals.getVModule(moduleId);
      if (!compilation) {
        throw new Error(`The '${moduleId}' virtual module does not exists.`);
      }
    }
    return await this.#context.builder(compilation);
  }
};
var Plugin_default = Plugin;

// lib/core/Builder.js
var import_Utils37 = __toESM(require("easescript/lib/core/Utils"));

// lib/core/Context.js
var import_path9 = __toESM(require("path"));
init_Cache();

// lib/core/AddressVariable.js
var import_Utils19 = __toESM(require("easescript/lib/core/Utils"));
var _AddressVariable = class {
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
  createName(stack, description) {
    if (!description)
      description = stack;
    if (!import_Utils19.default.isStack(description))
      return null;
    if (!this.refs.has(description)) {
      const name = this.ctx.getLocalRefName(stack, _AddressVariable.REFS_NAME, description);
      this.setName(description, name);
      return name;
    }
    return this.getName(description);
  }
  createIndexName(stack, description = null) {
    if (!description)
      description = stack;
    if (!import_Utils19.default.isStack(description))
      return null;
    if (this.indexName === null) {
      const name = this.ctx.getLocalRefName(stack, _AddressVariable.REFS_INDEX, description);
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
var AddressVariable = _AddressVariable;
//引用数组的变量名
__publicField(AddressVariable, "REFS_NAME", "__RAN");
//引用数组的索引
__publicField(AddressVariable, "REFS_INDEX", "__RAI");
//引用数组的内存地址
__publicField(AddressVariable, "REFS_MEMORY", "__RMA");
//对一个变量的引用名
__publicField(AddressVariable, "REFS_VALUE", "__RVN");
var AddressVariable_default = AddressVariable;

// lib/core/Context.js
var import_Namespace9 = __toESM(require("easescript/lib/core/Namespace"));
var import_Utils22 = __toESM(require("easescript/lib/core/Utils"));
init_Common2();

// lib/core/VirtualModule.js
init_Common2();
var import_Generator4 = __toESM(require_Generator());
var VirtualModule2 = class extends VirtualModule {
  constructor(id, ns, file) {
    super(id, ns, file);
  }
  gen(ctx, graph, body = []) {
    let imports = [];
    let exports = [];
    let exportNodes = null;
    let importNodes = null;
    importNodes = createESMImports2(ctx, ctx.imports);
    exportNodes = createESMExports2(ctx, ctx.exports, graph);
    imports.push(...importNodes, ...exportNodes.imports);
    body.push(...exportNodes.declares);
    exports.push(...exportNodes.exports);
    const generator = new import_Generator4.default(ctx, false);
    const layout = [
      ...imports,
      ...Array.from(ctx.usings.values()),
      ...ctx.statments,
      ctx.createChunkExpression(this.getContent()),
      ...body,
      ...exports
    ];
    let ns = this.ns;
    ns = ctx.getModuleMappingNamespace(this.bindModule || this) || ns.join("\\");
    if (ns) {
      layout.unshift(ctx.createNamespaceStatement(ns));
    }
    layout.forEach((item) => generator.make(item));
    return generator;
  }
  setContent(value) {
    value = String(value).replace(/^([\s\r\n]+)?<\?php/, "");
    super.setContent(value);
  }
  async build(ctx, graph) {
    const module2 = this.bindModule;
    let emitFile = ctx.options.emitFile;
    if (!this.changed && graph.code)
      return graph;
    this.changed = false;
    this.createImports(ctx);
    this.createReferences(ctx);
    let body = [];
    if (module2) {
      ctx.createModuleImportReferences(module2);
    }
    if (emitFile) {
      await ctx.buildDeps();
    }
    ctx.createAllDependencies();
    graph.code = ctx.getFormatCode(this.gen(ctx, graph, body).code);
    graph.sourcemap = this.getSourcemap();
    if (emitFile) {
      graph.outfile = ctx.getOutputAbsolutePath(module2 || this);
    }
    return graph;
  }
};

// lib/core/Context.js
var cache = getCacheManager("php");
var globalModules = ["Array", "Object", "Boolean", "Math", "Number", "String"];
var Context2 = class extends Context_default {
  #usings = /* @__PURE__ */ new Map();
  #statments = [];
  #moduleAlias = null;
  get usings() {
    return this.#usings;
  }
  get statments() {
    return this.#statments;
  }
  getFormatCode(code) {
    if (this.options.strict) {
      return "<?php\r\ndeclare (strict_types = 1);\r\n" + code;
    } else {
      return "<?php\r\n" + code;
    }
  }
  getPublicDir() {
    return this.options.publicPath || "public";
  }
  createModuleUsing(depModule, context) {
    if (!globalModules.includes(depModule.id)) {
      let source = this.getModuleNamespace(depModule);
      if (source) {
        source += "\\" + depModule.id;
      } else if (import_Utils22.default.isModule(context) || import_Utils22.default.isCompilation(context)) {
        let ns = context.namespace;
        if (ns && ns.parent) {
          source = "\\" + depModule.id;
        }
      }
      if (source) {
        let local = this.getModuleAlias(depModule, context);
        this.addUsing(source, local);
      }
    }
  }
  addUsing(source, local = null) {
    this.#usings.set(
      local || source,
      this.createUsingStatement(source, local)
    );
  }
  createAllDependencies() {
    const dependencies = this.dependencies;
    const target = this.target;
    const compilation = import_Utils22.default.isCompilation(target) ? target : null;
    const importFlag = this.options.import;
    dependencies.forEach((deps, moduleOrCompi) => {
      const graph = this.getBuildGraph(moduleOrCompi);
      deps.forEach((depModule) => {
        if (!import_Utils22.default.isModule(depModule))
          return;
        if (depModule === target || compilation && compilation.modules.has(depModule.getName())) {
          return;
        }
        this.createModuleImportAndUsing(graph, moduleOrCompi, depModule, importFlag);
      });
    });
  }
  createModuleDependencies(module2) {
    if (!import_Utils22.default.isModule(module2))
      return;
    let deps = this.getDependencies(module2);
    if (!deps)
      return;
    const graph = this.getBuildGraph(module2);
    const compilation = module2.compilation;
    const importFlag = this.options.import;
    deps.forEach((depModule) => {
      if (!import_Utils22.default.isModule(depModule))
        return;
      if (compilation && compilation.modules && compilation.modules.has(depModule.getName())) {
        return;
      }
      this.createModuleImportAndUsing(graph, module2, depModule, importFlag);
    });
  }
  createModuleImportAndUsing(graph, context, depModule, importFlag = true) {
    if (context === depModule || !this.isNeedBuild(depModule))
      return;
    let isRM = import_Utils22.default.isModule(depModule);
    let isVM = this.isVModule(depModule);
    if (!(isVM || isRM))
      return;
    let isDRM = !isVM && isRM && depModule.isDeclaratorModule;
    graph.addDepend(depModule);
    if (isDRM) {
      if (this.isModuleNeedUsing(depModule)) {
        this.createModuleUsing(depModule, context);
      }
      this.createDeclaratorModuleImportReferences(depModule, context, graph);
    } else {
      if (importFlag) {
        if (!this.checkModuleImportExclude(depModule)) {
          const source = this.getModuleImportSource(depModule, context);
          const importSource = this.addImport(source);
          importSource.setSourceTarget(depModule);
          graph.addImport(importSource);
        }
      }
      this.createModuleUsing(depModule, context);
    }
  }
  resolveUsingSource(id, group) {
    return this.glob.dest(id, { group, failValue: null });
  }
  isModuleNeedUsing(depModule) {
    if (depModule.isStructTable) {
      return false;
    }
    let result = this.resolveUsingSource(depModule.getName("/"), "usings");
    if (result === false) {
      return false;
    }
    return true;
  }
  checkModuleImportExclude(module2) {
    const excludes = this.options.excludes;
    if (excludes && excludes.length > 0) {
      let file = module2.file;
      let className = module2.getName("/");
      let test = (rule) => {
        if (rule === file || rule === className)
          return true;
        if (rule instanceof RegExp) {
          if (file && rule.test(file))
            return true;
          return rule.test(className);
        }
        return false;
      };
      if (excludes.some(test)) {
        return true;
      }
    }
    return false;
  }
  resolveSourcePresetFlag(id, group) {
    return this.glob.dest(id, { group, failValue: null });
  }
  resolveSourceId(id, group, delimiter = "/") {
    if (group === "namespaces" || group === "usings") {
      delimiter = "\\";
    }
    let data = { group, delimiter, failValue: null };
    if (typeof group === "object") {
      data = group;
    }
    return this.glob.dest(id, data);
  }
  insertTokenToBlock(stack, token) {
    let parent = stack.getParentStack((stack2) => stack2.isBlockStatement || stack2.isProgram);
    if (parent) {
      let node = this.getNode(parent);
      if (node) {
        if (token.type !== "ExpressionStatement") {
          token = this.createExpressionStatement(token);
        }
        if (parent.isBlockStatement) {
          node.body.push(token);
        } else if (parent.isProgram) {
          node.push(token);
        }
        return;
      }
    }
    throw new Error("Not find stack block-statement");
  }
  getClassBuilder(stack) {
    let parent = stack.getParentStack((stack2) => stack2.isClassDeclaration);
    if (parent && parent.isClassDeclaration) {
      let node = this.getNode(parent);
      if (node) {
        return node;
      }
    }
    throw new Error("Not find stack class-builder");
  }
  creaateAddressRefsNode(argument) {
    const node = this.createNode("AddressReferenceExpression");
    node.argument = argument;
    return node;
  }
  getWasLocalRefName(target, name) {
    let key = "getLocalRefName:" + name;
    if (this.cache.has(target, key)) {
      return this.cache.get(target, key);
    }
    return null;
  }
  getAvailableOriginType(type) {
    if (type) {
      const origin = import_Utils22.default.getOriginType(type);
      switch (origin.id) {
        case "String":
        case "Number":
        case "Array":
        case "Function":
        case "Object":
        case "Boolean":
        case "RegExp":
          return origin.id;
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
  addVariableRefs(stack, desc2, refsName) {
    if (!import_Utils22.default.isStack(desc2))
      return;
    const name = refsName || desc2.value();
    let funScope = stack.scope;
    const check2 = (scope) => {
      if (!scope)
        return;
      if (!scope.declarations.has(name)) {
        return scope.children.some((child) => {
          return check2(child);
        });
      }
      return true;
    };
    while (funScope) {
      let isForContext = funScope.isForContext;
      funScope = isForContext ? funScope.getScopeByType("block") : funScope.getScopeByType("function");
      if (!funScope)
        return;
      if (funScope.isMethod)
        return;
      if (!isForContext && !funScope.type("function"))
        return;
      if (isForContext && !funScope.type("block"))
        return;
      if (!check2(funScope)) {
        let dataset = cache.get(funScope, "addVariableRefs");
        if (!dataset) {
          dataset = /* @__PURE__ */ new Set();
          cache.set(funScope, "addVariableRefs", dataset);
        }
        dataset.add(refsName || desc2);
        if (!refsName && (desc2.isVariableDeclarator || desc2.isParamDeclarator)) {
          let addressRefObject = this.getAssignAddressRef(desc2);
          if (addressRefObject) {
            dataset.add(addressRefObject.createIndexName(stack, desc2));
          }
        }
      }
      funScope = funScope.parent;
    }
  }
  getVariableRefs(stack) {
    const isForContext = stack.scope.isForContext;
    const funScope = isForContext ? stack.scope.getScopeByType("block") : stack.scope.getScopeByType("function");
    return cache.get(funScope, "addVariableRefs");
  }
  addAssignAddressRef(desc2, value) {
    if (!desc2)
      return null;
    let address = cache.get(desc2, "addressVariable");
    if (!address) {
      address = new AddressVariable_default(desc2, this);
      cache.set(desc2, "addressVariable", address);
    }
    if (value) {
      address.add(value);
    }
    return address;
  }
  getAssignAddressRef(desc2) {
    if (!desc2)
      return null;
    return cache.get(desc2, "addressVariable");
  }
  isArrayAddressRefsType(type) {
    if (type) {
      if (type.isTypeofType && type.origin) {
        return this.isArrayAddressRefsType(type.origin.type());
      } else if (type.isUnionType) {
        return type.elements.every((item) => this.isArrayAddressRefsType(item.type()));
      } else if (type.isIntersectionType) {
        return this.isArrayAddressRefsType(type.left.type()) && this.isArrayAddressRefsType(type.right.type());
      } else if (type.isClassGenericType && !type.isClassType) {
        return this.isArrayAddressRefsType(type.inherit.type());
      }
    }
    return type && (type.isLiteralArrayType || type.isTupleType || import_Namespace9.default.globals.get("array") === type || import_Namespace9.default.globals.get("Array") === type);
  }
  isArrayMappingType(type) {
    if (!type)
      return false;
    if (type.isTypeofType && type.origin) {
      return this.isArrayMappingType(type.origin.type());
    }
    if (!type.isModule)
      return false;
    if (type.dynamicProperties && type.dynamicProperties.size > 0 && import_Namespace9.default.globals.get("Array").is(type)) {
      return type.dynamicProperties.has(import_Namespace9.default.globals.get("string")) || type.dynamicProperties.has(import_Namespace9.default.globals.get("number"));
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
    if (type.isTypeofType && type.origin) {
      return this.isArrayAccessor(type.origin.type());
    } else if (type.isInstanceofType) {
      return false;
    } else if (type.isLiteralObjectType || type.isLiteralType || type.isLiteralArrayType || type.isTupleType) {
      return true;
    } else if (type.isAliasType) {
      return this.isArrayAccessor(type.inherit.type());
    } else {
      const isWrapType = type.isClassGenericType && type.inherit.isAliasType;
      if (isWrapType) {
        let inherit = type.inherit.type();
        if (this.isArrayAccessor(inherit)) {
          return true;
        }
        if (import_Namespace9.default.globals.get("ObjectProtector") === inherit) {
          return false;
        }
        if (import_Namespace9.default.globals.get("ArrayProtector") === inherit) {
          return true;
        } else if (type.types.length > 0) {
          if (import_Namespace9.default.globals.get("RMD") === inherit) {
            return this.isArrayAccessor(type.types[0].type());
          }
        }
      } else if (type.isClassGenericType) {
        if (this.isArrayAccessor(type.inherit.type())) {
          return true;
        }
      }
      const raw = this.compiler.callUtils("getOriginType", type);
      if (raw === import_Namespace9.default.globals.get("Array") || this.isArrayMappingType(raw)) {
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
    if (type.isTypeofType && type.origin) {
      return this.isObjectAccessor(type.origin.type());
    } else if (type.isInstanceofType) {
      return true;
    } else if (type.isAliasType) {
      return this.isObjectAccessor(type.inherit.type());
    }
    const isWrapType = type.isClassGenericType && type.inherit.isAliasType;
    if (isWrapType) {
      const inherit = type.inherit.type();
      if (import_Namespace9.default.globals.get("ArrayProtector") === inherit) {
        return false;
      }
      if (type.types.length > 0) {
        if (import_Namespace9.default.globals.get("RMD") === inherit) {
          return this.isObjectAccessor(type.types[0].type());
        }
      }
      return import_Namespace9.default.globals.get("ObjectProtector") === inherit;
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
        if (inheritType === import_Namespace9.default.globals.get("RMD")) {
          return true;
        } else if (type2.types.length > 0 && (inheritType === import_Namespace9.default.globals.get("ArrayProtector") || inheritType === import_Namespace9.default.globals.get("ObjectProtector"))) {
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
    const cache2 = /* @__PURE__ */ new WeakSet();
    const check2 = (stack2, type2) => {
      if (type2) {
        if (verify(type2)) {
          return true;
        }
        if (!this.isArrayAddressRefsType(type2))
          return false;
      }
      if (cache2.has(stack2))
        return true;
      cache2.add(stack2);
      if (stack2.isIdentifier || stack2.isVariableDeclarator || stack2.isParamDeclarator || stack2.isArrayExpression)
        return true;
      if (stack2.isMethodDefinition && stack2.expression) {
        stack2 = stack2.expression;
      }
      if (stack2.isFunctionExpression) {
        const fnScope = stack2.scope.getScopeByType("function");
        const returnItems = fnScope.returnItems;
        if (returnItems && returnItems.length > 0) {
          return returnItems.every((item) => {
            return item.isReturnStatement && check2(item.argument, item.argument.type());
          });
        }
      } else if (stack2.isCallExpression) {
        let desc2 = stack2.descriptor();
        if (desc2) {
          if (desc2.isFunctionType) {
            desc2 = desc2.target && desc2.target.isFunctionExpression ? desc2.target : null;
          }
          if (desc2 && (desc2.isFunctionExpression || desc2.isMethodDefinition || desc2.isCallDefinition || desc2.isDeclaratorFunction)) {
            return check2(desc2, stack2.type());
          }
        }
      } else if (stack2.isMemberExpression) {
        let desc2 = stack2.description();
        if (desc2 && (desc2.isPropertyDefinition || desc2.isVariableDeclarator || desc2.isParamDeclarator || desc2.isTypeObjectPropertyDefinition)) {
          return true;
        } else if (desc2 && desc2.isProperty && desc2.hasInit && desc2.init) {
          return check2(desc2.init);
        } else if (desc2 && desc2.isMethodGetterDefinition) {
          return check2(desc2);
        } else {
          return true;
        }
      } else if (stack2.isLogicalExpression) {
        const isAnd = stack2.node.operator.charCodeAt(0) === 38;
        if (isAnd) {
          return check2(stack2.right, stack2.right.type());
        } else {
          return check2(stack2.left, stack2.left.type()) || check2(stack2.right, stack2.right.type());
        }
      } else if (stack2.isConditionalExpression) {
        return check2(stack2.consequent, stack2.consequent.type()) || check2(stack2.alternate, stack2.alternate.type());
      } else if (stack2.isParenthesizedExpression) {
        return check2(stack2.expression);
      } else if (stack2.isAssignmentExpression) {
        return check2(stack2.right);
      }
      return false;
    };
    return check2(stack);
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
  getAccessorName(name, desc2, accessor = "get") {
    if (import_Utils22.default.isStack(desc2) && desc2.module) {
      let module2 = desc2.module;
      let key = "accessor:" + accessor + ":" + name;
      let resolveName = cache.get(module2, key);
      if (resolveName) {
        return resolveName;
      }
      let suffix = name.substr(0, 1).toUpperCase() + name.substr(1);
      let isStatic = !!(desc2.static || module2.static);
      let index = 0;
      let _name = accessor + suffix;
      resolveName = _name;
      while (true) {
        const has = isStatic ? module2.getMethod(resolveName) : module2.getMember(resolveName);
        if (!has)
          break;
        resolveName = _name + index++;
      }
      cache.set(module2, key, resolveName);
      return resolveName;
    } else {
      let suffix = name.substr(0, 1).toUpperCase() + name.substr(1);
      return accessor + suffix;
    }
  }
  getModuleReferenceName(module2, context = null) {
    let name = null;
    let vm = null;
    let key = module2;
    if (isVModule(module2)) {
      let m = module2.bindModule;
      if (!m) {
        vm = module2;
      } else {
        module2 = m;
        key = m;
      }
    } else if (!import_Utils22.default.isModule(module2)) {
      return null;
    }
    if (module2 === context) {
      return module2.id;
    }
    if (vm) {
      return vm.id;
    }
    if (!context)
      context = this.target;
    name = module2.id;
    let hasDefined = false;
    if (import_Utils22.default.isModule(context)) {
      if (module2.required || context.imports && context.imports.has(module2.id)) {
        hasDefined = true;
      } else if (context.isDeclaratorModule) {
        const vm2 = this.getVModule(context.getName());
        if (vm2) {
          let _name = vm2.getReferenceName(module2.getName());
          if (_name) {
            name = _name;
            hasDefined = true;
          }
        }
      }
    }
    if (hasDefined) {
      return name;
    }
    let alias = this.getModuleAlias(module2, context);
    if (alias) {
      name = alias;
    }
    return name;
  }
  getModuleAlias(module2, context) {
    if (!import_Utils22.default.isModule(module2))
      return null;
    const alias = import_Utils22.default.isCompilation(context) ? context.importModuleNameds.get(module2) : import_Utils22.default.isModule(context) ? context.getModuleAlias(module2) : null;
    if (alias === module2.id)
      return null;
    if (alias) {
      return alias;
    }
    return null;
  }
  setModuleAlias(module2, name) {
    let moduleAlias = this.#moduleAlias;
    if (!moduleAlias) {
      moduleAlias = this.#moduleAlias = /* @__PURE__ */ new Map();
    }
    moduleAlias.set(module2, name);
    return name;
  }
  getModuleMappingFolder(module2) {
    let isRM = import_Utils22.default.isModule(module2);
    let isVM = isRM ? false : isVModule(module2);
    if (!(isRM || isVM))
      return null;
    if (isVM) {
      let bindM = module2.bindModule;
      if (bindM && import_Utils22.default.isModule(bindM)) {
        module2 = bindM;
        isRM = true;
        isVM = false;
      }
    }
    let file = module2.getName("/");
    if (isRM && module2.isDeclaratorModule) {
      let compilation = module2.compilation;
      if (compilation) {
        if (compilation.isGlobalFlag && compilation.pluginScopes.scope === "global") {
          file += ".global";
        } else {
          file += ".declare";
        }
      }
    } else if (isVM) {
      file += ".virtual";
    }
    return this.resolveSourceFileMappingPath(file, "folders");
  }
  getModuleImportSource(source, context, sourceId = null) {
    const config = this.options;
    const isString = typeof source === "string";
    if (isString && source.includes("${__filename}")) {
      const owner = import_Utils22.default.isModule(context) ? context.compilation : context;
      source = source.replace("${__filename}", import_Utils22.default.isCompilation(owner) ? owner.file : this.target.file);
    }
    if (isString && source.includes("/node_modules/")) {
      if (import_path9.default.isAbsolute(source))
        return source;
      if (!sourceId) {
        return this.resolveSourceFileMappingPath(source, "imports") || source;
      }
      return sourceId;
    }
    if (isString && !import_path9.default.isAbsolute(source)) {
      return source;
    }
    if (config.emitFile) {
      return this.getOutputRelativePath(source, context);
    }
    return isString ? source : this.getModuleResourceId(source);
  }
  getModuleMappingNamespace(module2) {
    let isRM = import_Utils22.default.isModule(module2);
    let isVM = isRM ? false : isVModule(module2);
    if (!(isRM || isVM))
      return null;
    if (isVM) {
      let bindM = module2.bindModule;
      if (bindM && import_Utils22.default.isModule(bindM)) {
        module2 = bindM;
        isRM = true;
        isVM = false;
      }
    }
    let ns = module2.id;
    if (isRM && module2.isDeclaratorModule) {
      ns = module2.getName("/");
      let compilation = module2.compilation;
      if (compilation) {
        if (compilation.isGlobalFlag && compilation.pluginScopes.scope === "global") {
          ns += ".global";
        } else {
          ns += ".declare";
        }
      }
    } else {
      ns = module2.getName("/");
      if (isVM) {
        ns += ".virtual";
      }
    }
    if (ns) {
      const result = this.getMappingNamespace(ns);
      if (result)
        return result;
    }
    if (this.options.folderAsNamespace) {
      const folder = this.getModuleMappingFolder(module2);
      if (folder) {
        return folder.replace(/[\\\\/]/g, "\\");
      }
    }
    return null;
  }
  getMappingNamespace(id) {
    return this.resolveSourceId(id, "namespaces");
  }
  getModuleNamespace(module2, suffix = null) {
    if (!module2)
      return "";
    let folder = this.getModuleMappingNamespace(module2);
    if (folder) {
      if (suffix) {
        return "\\" + folder + "\\" + suffix;
      }
      return folder;
    }
    if (module2.namespace && module2.namespace.isNamespace) {
      const items = module2.namespace.getChain();
      if (items.length > 0) {
        if (suffix) {
          return "\\" + items.concat(suffix).join("\\");
        }
        return items.join("\\");
      }
    } else if (this.isVModule(module2)) {
      if (suffix) {
        return "\\" + module2.ns.concat(suffix).join("\\");
      }
      return module2.ns.join("\\");
    }
    return suffix ? "\\" + suffix : "";
  }
  inferType(stack, context) {
    if (!stack)
      return stack;
    if (import_Utils22.default.isStack(stack)) {
      if (!context)
        context = stack.getContext();
    }
    if (context) {
      return context.apply(stack.type());
    }
    return stack;
  }
  createThisExpression(stack = null) {
    return this.createNode(stack, "ThisExpression");
  }
  createSuperExpression(stack = null) {
    const node = this.createNode(stack, "SuperExpression");
    node.value = "parent";
    node.raw = "parent";
    return node;
  }
  createLiteral(value, raw, stack = null) {
    const node = this.createNode(stack, "Literal");
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
  createVarIdentifier(value, stack = null) {
    const node = this.createIdentifier(value, stack);
    node.isVariable = true;
    return node;
  }
  createStaticMemberExpression(items, stack = null) {
    const node = this.createMemberExpression(items, stack);
    node.isStatic = true;
    return node;
  }
  createUsingStatement(source, local, stack = null) {
    const node = this.createNode(stack, "UsingStatement");
    node.source = source;
    node.local = local;
    return node;
  }
  createNamespaceStatement(source) {
    const node = this.createNode("NamespaceStatement");
    node.source = source;
    return node;
  }
  getNormalImportName(source) {
    let ext = import_path9.default.extname(source);
    let name = import_path9.default.basename(source, ext);
    let refs = name.replace(/[\.\-]/g, "_");
    return this.getGlobalRefName(null, "_" + refs);
  }
  createImportDeclaration(source, specifiers, isExpression = false, origin = null, imports = []) {
    if (!isExpression) {
      isExpression = Array.isArray(specifiers) && specifiers.length > 0;
    }
    let node = this.createCallExpression(
      isExpression ? this.createIdentifier("include") : this.createIdentifier("include_once"),
      [
        this.createBinaryExpression(
          this.createIdentifier("__DIR__"),
          this.createLiteral(source),
          "."
        )
      ]
    );
    if (specifiers && specifiers.length > 0) {
      let setScopeVariable = null;
      let multi = specifiers.length > 1;
      if (origin && import_Utils22.default.isCompilation(origin) && import_Utils22.default.isCompilation(this.target) && this.target.mainModule) {
        let hashId = createUniqueHashId(this.target.file);
        let added = false;
        setScopeVariable = (local, value) => {
          if (!added) {
            added = true;
            let deps = this.dependencies.get(this.target);
            let System = import_Namespace9.default.globals.get("System");
            let has = deps ? deps.has(System) : false;
            if (!has && imports) {
              this.addDepend(System, this.target);
              const source2 = this.getModuleImportSource(System, this.target);
              const node2 = this.createImportDeclaration(source2);
              if (node2) {
                this.createModuleUsing(System, this.target);
                imports.push(this.createExpressionStatement(node2));
              }
            }
          }
          return this.createExpressionStatement(this.createCallExpression(
            createStaticReferenceNode2(this, this.target, "System", "registerScopeVariables"),
            [
              this.createLiteral(hashId),
              local,
              value
            ]
          ));
        };
      }
      let refs = this.getNormalImportName(source);
      let nameNode = this.createVarIdentifier(refs);
      node = this.createExpressionStatement(
        this.createAssignmentExpression(nameNode, node)
      );
      specifiers.forEach((spec) => {
        if (spec.type === "ImportDefaultSpecifier" || spec.type === "ImportNamespaceSpecifier") {
          let refValue = multi ? this.createBinaryExpression(
            this.createComputeMemberExpression([
              nameNode,
              this.createLiteral("default")
            ]),
            this.createLiteral(null),
            "??"
          ) : nameNode;
          let refNode = this.createAssignmentExpression(
            spec.local,
            refValue
          );
          this.statments.push(this.createExpressionStatement(refNode));
          if (setScopeVariable) {
            this.statments.push(setScopeVariable(this.createLiteral(spec.local.value), spec.local));
          }
        } else if (spec.type === "ImportSpecifier") {
          let local = spec.local;
          let imported = spec.imported;
          if (!imported) {
            if (local.type === "Identifier") {
              imported = this.createLiteral(local.value);
            }
          } else if (imported.type === "Identifier") {
            imported = this.createLiteral(imported.value);
          }
          this.statments.push(this.createExpressionStatement(this.createAssignmentExpression(
            local,
            this.createBinaryExpression(
              this.createComputeMemberExpression([
                nameNode,
                imported
              ]),
              this.createLiteral(null),
              "??"
            )
          )));
          if (setScopeVariable) {
            this.statments.push(setScopeVariable(this.createLiteral(local.value), local));
          }
        }
      });
      if (isExpression) {
        this.statments.unshift(node);
        return null;
      }
    }
    return node;
  }
  createImportSpecifier(local, imported = null, hasAs = false) {
    if (!local)
      return null;
    if (imported && !hasAs) {
      const node = this.createNode("ImportSpecifier");
      node.imported = this.createIdentifier(imported);
      node.local = this.createVarIdentifier(local);
      return node;
    } else if (hasAs) {
      const node = this.createNode("ImportNamespaceSpecifier");
      node.local = this.createVarIdentifier(local);
      return node;
    } else {
      const node = this.createNode("ImportDefaultSpecifier");
      node.local = this.createVarIdentifier(local);
      return node;
    }
  }
};
var Context_default2 = Context2;

// lib/core/Builder.js
var import_Generator5 = __toESM(require_Generator());
init_Common2();
init_Asset2();
init_Cache();

// lib/tokens/index.js
var tokens_exports2 = {};
__export(tokens_exports2, {
  AnnotationDeclaration: () => AnnotationDeclaration_default2,
  AnnotationExpression: () => AnnotationExpression_default2,
  ArrayExpression: () => ArrayExpression_default2,
  ArrayPattern: () => ArrayPattern_default2,
  ArrowFunctionExpression: () => ArrowFunctionExpression_default2,
  AssignmentExpression: () => AssignmentExpression_default2,
  AssignmentPattern: () => AssignmentPattern_default2,
  AwaitExpression: () => AwaitExpression_default2,
  BinaryExpression: () => BinaryExpression_default2,
  BlockStatement: () => BlockStatement_default2,
  BreakStatement: () => BreakStatement_default2,
  CallExpression: () => CallExpression_default2,
  ChainExpression: () => ChainExpression_default2,
  ClassDeclaration: () => ClassDeclaration_default2,
  ConditionalExpression: () => ConditionalExpression_default2,
  ContinueStatement: () => ContinueStatement_default2,
  Declarator: () => Declarator_default2,
  DeclaratorDeclaration: () => DeclaratorDeclaration_default2,
  DoWhileStatement: () => DoWhileStatement_default2,
  EmptyStatement: () => EmptyStatement_default2,
  EnumDeclaration: () => EnumDeclaration_default2,
  EnumProperty: () => EnumProperty_default2,
  ExportAllDeclaration: () => ExportAllDeclaration_default2,
  ExportAssignmentDeclaration: () => ExportAssignmentDeclaration_default,
  ExportDefaultDeclaration: () => ExportDefaultDeclaration_default2,
  ExportNamedDeclaration: () => ExportNamedDeclaration_default2,
  ExportSpecifier: () => ExportSpecifier_default2,
  ExpressionStatement: () => ExpressionStatement_default2,
  ForInStatement: () => ForInStatement_default2,
  ForOfStatement: () => ForOfStatement_default2,
  ForStatement: () => ForStatement_default2,
  FunctionDeclaration: () => FunctionDeclaration_default2,
  FunctionExpression: () => FunctionExpression_default2,
  Identifier: () => Identifier_default2,
  IfStatement: () => IfStatement_default2,
  ImportDeclaration: () => ImportDeclaration_default2,
  ImportDefaultSpecifier: () => ImportDefaultSpecifier_default2,
  ImportExpression: () => ImportExpression_default2,
  ImportNamespaceSpecifier: () => ImportNamespaceSpecifier_default2,
  ImportSpecifier: () => ImportSpecifier_default2,
  InterfaceDeclaration: () => InterfaceDeclaration_default2,
  JSXAttribute: () => JSXAttribute_default2,
  JSXCdata: () => JSXCdata_default2,
  JSXClosingElement: () => JSXClosingElement_default2,
  JSXClosingFragment: () => JSXClosingFragment_default2,
  JSXElement: () => JSXElement2,
  JSXEmptyExpression: () => JSXEmptyExpression_default2,
  JSXExpressionContainer: () => JSXExpressionContainer_default2,
  JSXFragment: () => JSXFragment_default2,
  JSXIdentifier: () => JSXIdentifier_default2,
  JSXMemberExpression: () => JSXMemberExpression_default2,
  JSXNamespacedName: () => JSXNamespacedName_default2,
  JSXOpeningElement: () => JSXOpeningElement_default2,
  JSXOpeningFragment: () => JSXOpeningFragment_default2,
  JSXScript: () => JSXScript_default2,
  JSXSpreadAttribute: () => JSXSpreadAttribute_default2,
  JSXStyle: () => JSXStyle_default2,
  JSXText: () => JSXText_default2,
  LabeledStatement: () => LabeledStatement_default2,
  Literal: () => Literal_default2,
  LogicalExpression: () => LogicalExpression_default2,
  MemberExpression: () => MemberExpression_default2,
  MethodDefinition: () => MethodDefinition_default2,
  MethodGetterDefinition: () => MethodGetterDefinition_default2,
  MethodSetterDefinition: () => MethodSetterDefinition_default2,
  NewExpression: () => NewExpression_default2,
  ObjectExpression: () => ObjectExpression_default2,
  ObjectPattern: () => ObjectPattern_default2,
  PackageDeclaration: () => PackageDeclaration_default2,
  ParenthesizedExpression: () => ParenthesizedExpression_default2,
  Property: () => Property_default2,
  PropertyDefinition: () => PropertyDefinition_default2,
  RestElement: () => RestElement_default2,
  ReturnStatement: () => ReturnStatement_default2,
  SequenceExpression: () => SequenceExpression_default2,
  SpreadElement: () => SpreadElement_default2,
  StructTableColumnDefinition: () => StructTableColumnDefinition_default2,
  StructTableDeclaration: () => StructTableDeclaration_default2,
  StructTableKeyDefinition: () => StructTableKeyDefinition_default2,
  StructTableMethodDefinition: () => StructTableMethodDefinition_default2,
  StructTablePropertyDefinition: () => StructTablePropertyDefinition_default2,
  SuperExpression: () => SuperExpression_default2,
  SwitchCase: () => SwitchCase_default2,
  SwitchStatement: () => SwitchStatement_default2,
  TemplateElement: () => TemplateElement_default2,
  TemplateLiteral: () => TemplateLiteral_default2,
  ThisExpression: () => ThisExpression_default2,
  ThrowStatement: () => ThrowStatement_default2,
  TryStatement: () => TryStatement_default2,
  TypeAssertExpression: () => TypeAssertExpression_default2,
  TypeTransformExpression: () => TypeTransformExpression_default2,
  UnaryExpression: () => UnaryExpression_default2,
  UpdateExpression: () => UpdateExpression_default2,
  VariableDeclaration: () => VariableDeclaration_default2,
  VariableDeclarator: () => VariableDeclarator_default2,
  WhenStatement: () => WhenStatement_default2,
  WhileStatement: () => WhileStatement_default2
});

// lib/tokens/AnnotationDeclaration.js
function AnnotationDeclaration_default2() {
}

// lib/tokens/AnnotationExpression.js
init_Common2();
function AnnotationExpression_default2(ctx, stack) {
  const name = stack.getLowerCaseName();
  switch (name) {
    case "http": {
      return createHttpAnnotationNode(ctx, stack) || ctx.createLiteral(null);
    }
    case "router": {
      return createRouterAnnotationNode(ctx, stack) || ctx.createLiteral(null);
    }
    case "url": {
      return createUrlAnnotationNode2(ctx, stack);
    }
    case "env": {
      return createEnvAnnotationNode(ctx, stack);
    }
    case "readfile": {
      return createReadfileAnnotationNode2(ctx, stack) || ctx.createLiteral(null);
    }
    default:
      ctx.error(`The '${name}' annotations is not supported.`);
  }
  return null;
}

// lib/tokens/ArrayExpression.js
init_Common2();

// lib/transforms/Array.js
init_Object();
init_Common2();
var import_Namespace11 = __toESM(require("easescript/lib/core/Namespace"));
function createMethodFunctionNode2(ctx, name) {
  return ctx.createLiteral(name);
}
function createObjectNodeRefs(ctx, object, name) {
  return object;
}
function createCommonCalledNode2(name, stack, ctx, object, args, called = true, checkRefs = false) {
  if (!called)
    return createMethodFunctionNode2(ctx, name);
  if (checkRefs && object && object.type === "ArrayExpression") {
    const refs = ctx.getLocalRefName(stack, "ref");
    ctx.insertTokenToBlock(
      stack,
      ctx.createAssignmentExpression(ctx.createVarIdentifier(refs), object)
    );
    object = ctx.createVarIdentifier(refs);
  }
  const obj = createObjectNodeRefs(ctx, object, name);
  return ctx.createCallExpression(
    ctx.createIdentifier(name),
    [obj].concat(args).filter((v) => !!v)
  );
}
var methods = {
  isArray(stack, ctx, object, args, called = false, isStatic = false) {
    return ctx.createCallExpression(
      ctx.createIdentifier("is_array"),
      args
    );
  },
  from(stack, ctx, object, args, called = false, isStatic = false) {
    return ctx.createCallExpression(
      createStaticReferenceNode2(ctx, stack, "System", "toArray"),
      args
    );
  },
  of(stack, ctx, object, args, called = false, isStatic = false) {
    const module2 = import_Namespace11.default.globals.get("Array");
    ctx.addDepend(module2);
    return ctx.createCallExpression(
      ctx.createIdentifier(ctx.getModuleNamespace(module2, "es_array_new")),
      args
    );
  },
  push(stack, ctx, object, args, called = false, isStatic = false) {
    return createCommonCalledNode2("array_push", stack, ctx, object, args, called, true);
  },
  unshift(stack, ctx, object, args, called = false, isStatic = false) {
    return createCommonCalledNode2("array_unshift", stack, ctx, object, args, called, true);
  },
  pop(stack, ctx, object, args, called = false, isStatic = false) {
    return createCommonCalledNode2("array_pop", stack, ctx, object, args, called, true);
  },
  shift(stack, ctx, object, args, called = false, isStatic = false) {
    return createCommonCalledNode2("array_shift", stack, ctx, object, args, called);
  },
  splice(stack, ctx, object, args, called = false, isStatic = false) {
    if (args.length > 3) {
      args = args.slice(0, 2).concat(ctx.createArrayExpression(args.slice(2)));
    }
    return createCommonCalledNode2("array_splice", stack, ctx, object, args, called, true);
  },
  slice(stack, ctx, object, args, called = false, isStatic = false) {
    return createCommonCalledNode2("array_slice", stack, ctx, object, args, called);
  },
  map(stack, ctx, object, args, called = false, isStatic = false) {
    const module2 = import_Namespace11.default.globals.get("Array");
    ctx.addDepend(module2);
    const name = ctx.getModuleNamespace(module2, "es_array_map");
    return createCommonCalledNode2(name, stack, ctx, object, args, called);
  },
  find(stack, ctx, object, args, called = false, isStatic = false) {
    const module2 = import_Namespace11.default.globals.get("Array");
    ctx.addDepend(module2);
    const name = ctx.getModuleNamespace(module2, "es_array_find");
    return createCommonCalledNode2(name, stack, ctx, object, args, called);
  },
  findIndex(stack, ctx, object, args, called = false, isStatic = false) {
    const module2 = import_Namespace11.default.globals.get("Array");
    ctx.addDepend(module2);
    const name = ctx.getModuleNamespace(module2, "es_array_find_index");
    return createCommonCalledNode2(name, stack, ctx, object, args, called);
  },
  filter(stack, ctx, object, args, called = false, isStatic = false) {
    const module2 = import_Namespace11.default.globals.get("Array");
    ctx.addDepend(module2);
    const name = ctx.getModuleNamespace(module2, "es_array_filter");
    return createCommonCalledNode2(name, stack, ctx, object, args, called);
  },
  indexOf(stack, ctx, object, args, called = false, isStatic = false) {
    const module2 = import_Namespace11.default.globals.get("Array");
    ctx.addDepend(module2);
    const name = ctx.getModuleNamespace(module2, "es_array_find_index");
    return createCommonCalledNode2(name, stack, ctx, object, args, called);
  },
  lastIndexOf(stack, ctx, object, args, called = false, isStatic = false) {
    const module2 = import_Namespace11.default.globals.get("Array");
    ctx.addDepend(module2);
    const name = ctx.getModuleNamespace(module2, "es_array_search_last_index");
    return createCommonCalledNode2(name, ctx, object, args, called);
  },
  copyWithin(stack, ctx, object, args, called = false, isStatic = false) {
    const module2 = import_Namespace11.default.globals.get("Array");
    ctx.addDepend(module2);
    const name = ctx.getModuleNamespace(module2, "es_array_copy_within");
    return createCommonCalledNode2(name, stack, ctx, object, args, called);
  },
  concat(stack, ctx, object, args, called = false, isStatic = false) {
    const module2 = import_Namespace11.default.globals.get("Array");
    ctx.addDepend(module2);
    const name = ctx.getModuleNamespace(module2, "es_array_concat");
    return createCommonCalledNode2(name, stack, ctx, object, args, called);
  },
  every(stack, ctx, object, args, called = false, isStatic = false) {
    const module2 = import_Namespace11.default.globals.get("Array");
    ctx.addDepend(module2);
    const name = ctx.getModuleNamespace(module2, "es_array_every");
    return createCommonCalledNode2(name, stack, ctx, object, args, called);
  },
  some(stack, ctx, object, args, called = false, isStatic = false) {
    const module2 = import_Namespace11.default.globals.get("Array");
    ctx.addDepend(module2);
    const name = ctx.getModuleNamespace(module2, "es_array_some");
    return createCommonCalledNode2(name, stack, ctx, object, args, called);
  },
  forEach(stack, ctx, object, args, called = false, isStatic = false) {
    const module2 = import_Namespace11.default.globals.get("Array");
    ctx.addDepend(module2);
    const name = ctx.getModuleNamespace(module2, "es_array_foreach");
    return createCommonCalledNode2(name, stack, ctx, object, args, called);
  },
  flat(stack, ctx, object, args, called = false, isStatic = false) {
    const module2 = import_Namespace11.default.globals.get("Array");
    ctx.addDepend(module2);
    const name = ctx.getModuleNamespace(module2, "es_array_flat");
    return createCommonCalledNode2(name, stack, ctx, object, args, called);
  },
  flatMap(stack, ctx, object, args, called = false, isStatic = false) {
    const module2 = import_Namespace11.default.globals.get("Array");
    ctx.addDepend(module2);
    const name = ctx.getModuleNamespace(module2, "es_array_flat_map");
    return createCommonCalledNode2(name, stack, ctx, object, args, called);
  },
  reduce(stack, ctx, object, args, called = false, isStatic = false) {
    const module2 = import_Namespace11.default.globals.get("Array");
    ctx.addDepend(module2);
    const name = ctx.getModuleNamespace(module2, "es_array_reduce");
    return createCommonCalledNode2(name, stack, ctx, object, args, called);
  },
  reduceRight(stack, ctx, object, args, called = false, isStatic = false) {
    const module2 = import_Namespace11.default.globals.get("Array");
    ctx.addDepend(module2);
    const name = ctx.getModuleNamespace(module2, "es_array_reduce_right");
    return createCommonCalledNode2(name, stack, ctx, object, args, called);
  },
  fill(stack, ctx, object, args, called = false, isStatic = false) {
    const module2 = import_Namespace11.default.globals.get("Array");
    ctx.addDepend(module2);
    const name = ctx.getModuleNamespace(module2, "es_array_fill");
    return createCommonCalledNode2(name, stack, ctx, object, args, called);
  },
  sort(stack, ctx, object, args, called = false, isStatic = false) {
    const module2 = import_Namespace11.default.globals.get("Array");
    ctx.addDepend(module2);
    const name = ctx.getModuleNamespace(module2, "es_array_sort");
    return createCommonCalledNode2(name, stack, ctx, object, args, called, true);
  },
  join(stack, ctx, object, args, called = false, isStatic = false) {
    if (!called)
      return ctx.createChunkExpression(`function($target,$delimiter){return implode($delimiter,$target);}`);
    object = createObjectNodeRefs(ctx, object, "implode");
    return ctx.createCallExpression(
      ctx.createIdentifier("implode"),
      args.concat(object)
    );
  },
  entries(stack, ctx, object, args, called = false, isStatic = false) {
    if (!called)
      return createMethodFunctionNode2(ctx, "array_values");
    object = createObjectNodeRefs(ctx, object, "array_values");
    return ctx.createCallExpression(
      ctx.createIdentifier("array_values"),
      [object]
    );
  },
  values(stack, ctx, object, args, called = false, isStatic = false) {
    if (!called)
      return createMethodFunctionNode2(ctx, "array_values");
    object = createObjectNodeRefs(ctx, object, "array_values");
    return ctx.createCallExpression(
      ctx.createIdentifier("array_values"),
      [object]
    );
  },
  keys(stack, ctx, object, args, called = false, isStatic = false) {
    if (!called)
      return createMethodFunctionNode2(ctx, "array_keys");
    object = createObjectNodeRefs(ctx, object, "array_keys");
    return ctx.createCallExpression(
      ctx.createIdentifier("array_keys"),
      [object]
    );
  },
  reverse(stack, ctx, object, args, called = false, isStatic = false) {
    if (!called)
      return createMethodFunctionNode2(ctx, "array_reverse");
    object = createObjectNodeRefs(ctx, object, "array_reverse");
    return ctx.createCallExpression(
      ctx.createIdentifier("array_reverse"),
      args.concat(object)
    );
  },
  includes(stack, ctx, object, args, called = false, isStatic = false) {
    if (!called)
      return createMethodFunctionNode2(ctx, "in_array");
    object = createObjectNodeRefs(ctx, object, "in_array");
    return ctx.createCallExpression(
      ctx.createIdentifier("in_array"),
      args.concat(object)
    );
  },
  length(stack, ctx, object, args, called = false, isStatic = false) {
    const obj = createObjectNodeRefs(ctx, object, "count");
    return ctx.createCallExpression(
      ctx.createIdentifier("count"),
      [obj]
    );
  }
};
["propertyIsEnumerable", "hasOwnProperty", "valueOf", "toLocaleString", "toString"].forEach((name) => {
  if (!Object.prototype.hasOwnProperty.call(methods, name)) {
    methods[name] = Object_default[name];
  }
});
var Array_default = methods;

// lib/tokens/ArrayExpression.js
function ArrayExpression_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  let hasSpread = false;
  node.elements = stack.elements.map((stack2, index) => {
    let item = ctx.createToken(stack2);
    if (item && stack2.isSpreadElement) {
      hasSpread = true;
    } else {
      if (ctx.isPassableReferenceExpress(stack2, stack2.type())) {
        item = createAddressRefsNode(ctx, item);
      }
    }
    return item;
  });
  if (hasSpread) {
    if (node.elements.length === 1) {
      return node.elements[0];
    }
    return Array_default.concat(stack, ctx, ctx.createArrayExpression(), node.elements, true, false);
  }
  return node;
}

// lib/tokens/ArrayPattern.js
function ArrayPattern_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  node.elements = stack.elements.map((item) => ctx.createToken(item));
  return node;
}

// lib/tokens/FunctionExpression.js
var import_Namespace12 = __toESM(require("easescript/lib/core/Namespace"));
var import_Utils23 = __toESM(require("easescript/lib/core/Utils"));
init_Common2();
function createInitNode(ctx, name, initValue, defaultValue, operator, forceType = null) {
  let init = defaultValue ? ctx.createBinaryExpression(initValue, defaultValue, operator) : initValue;
  if (forceType) {
    let node = ctx.createNode("TypeTransformExpression");
    node.typeName = forceType;
    node.expression = ctx.createParenthesizedExpression(init);
    init = node;
  }
  return ctx.createExpressionStatement(
    ctx.createAssignmentExpression(
      Node_default.is(name) ? name : ctx.createVarIdentifier(name),
      init
    )
  );
}
function createRefsMemberNode(ctx, object, property, computed = false) {
  const node = ctx.createMemberExpression([
    ctx.createVarIdentifier(object),
    typeof property === "number" ? ctx.createLiteral(property) : ctx.createIdentifier(property)
  ]);
  node.computed = computed;
  return node;
}
function createParamNode(ctx, name, prefix) {
  const node = ctx.createNode("ParamDeclarator");
  node.argument = Node_default.is(name) ? name : ctx.createVarIdentifier(name);
  node.argument.isVariable = true;
  node.prefix = prefix;
  return node;
}
function createParamNodes(ctx, stack, params) {
  const before = [];
  const items = params.map((item, index) => {
    if (item.isObjectPattern) {
      let sName = ctx.getLocalRefName(stack, "_s", item);
      before.push(
        createInitNode(
          ctx,
          sName,
          ctx.createVarIdentifier(sName),
          ctx.createNewExpression(ctx.createIdentifier("\\stdClass")),
          "?:",
          "object"
        )
      );
      item.properties.forEach((property) => {
        let key = property.key.value();
        let alias = null;
        let defaultValue2 = null;
        if (property.hasInit) {
          if (property.init.isAssignmentPattern) {
            defaultValue2 = ctx.createToken(property.init.right);
          } else {
            alias = ctx.createToken(property.init);
          }
        } else {
          defaultValue2 = ctx.createLiteral(null);
        }
        before.push(createInitNode(
          ctx,
          alias || key,
          createRefsMemberNode(ctx, sName, key),
          defaultValue2,
          "??"
        ));
      });
      return createParamNode(ctx, sName);
    } else if (item.isArrayPattern) {
      const sName = ctx.getLocalRefName(stack, "_s", item);
      before.push(createInitNode(
        ctx,
        sName,
        ctx.createVarIdentifier(sName),
        ctx.createArrayExpression([]),
        "?:",
        "array"
      ));
      item.elements.forEach((property, index2) => {
        let key = null;
        let defaultValue2 = null;
        if (property.isAssignmentPattern) {
          key = property.left.value();
          defaultValue2 = ctx.createToken(property.right);
        } else {
          key = property.value();
          defaultValue2 = ctx.createLiteral(null);
        }
        before.push(createInitNode(
          ctx,
          ctx.createVarIdentifier(key),
          createRefsMemberNode(ctx, sName, index2, true),
          defaultValue2,
          "??"
        ));
      });
      return createParamNode(ctx, sName);
    }
    const oType = item.acceptType && item.acceptType.type();
    let acceptType = null;
    if (oType && !item.isRestElement && !oType.isGenericType && !oType.isLiteralObjectType) {
      let _alias = oType;
      let _last = null;
      while (_alias && _alias.isAliasType && _last !== _alias) {
        _last = _alias;
        _alias = _alias.inherit.type();
      }
      if (!_alias || !_alias.isLiteralObjectType) {
        acceptType = import_Utils23.default.getOriginType(oType);
      }
    }
    let typeName = "";
    let defaultValue = null;
    let nameNode = null;
    if (item.isAssignmentPattern) {
      nameNode = ctx.createVarIdentifier(item.left.value(), item.left);
      defaultValue = ctx.createToken(item.right);
    } else if (item.question) {
      nameNode = ctx.createToken(item);
      defaultValue = ctx.createLiteral(null);
    } else {
      nameNode = ctx.createToken(item);
    }
    if (acceptType && import_Utils23.default.isModule(acceptType) && !acceptType.isEnum) {
      const originType = ctx.getAvailableOriginType(acceptType);
      if (originType === "String" || originType === "Array" || originType === "Object") {
        typeName = originType.toLowerCase();
      } else if (originType === "Function") {
        typeName = "\\Closure";
      } else if (originType === "Boolean") {
        typeName = "bool";
      }
      if (!typeName && !originType) {
        typeName = ctx.getModuleReferenceName(acceptType, stack.module || stack.compilation);
        if (typeName && (acceptType.isClass || acceptType.isInterface)) {
          ctx.addDepend(acceptType);
        }
      }
    }
    if (oType && !item.isRestElement && !oType.isGenericType) {
      const isAddress = ctx.isAddressRefsType(oType, item);
      if (isAddress) {
        nameNode = createAddressRefsNode(ctx, nameNode);
      }
    }
    if (defaultValue) {
      nameNode = ctx.createAssignmentExpression(nameNode, defaultValue);
    }
    return createParamNode(ctx, nameNode, typeName);
  });
  return [items, before];
}
function FunctionExpression_default2(ctx, stack, type) {
  const node = ctx.createNode(stack, type);
  const [params, before] = createParamNodes(ctx, stack, stack.params);
  let block = ctx.createToken(stack.body);
  if (stack.expression && stack.expression.async || stack.async) {
    const promiseModule = import_Namespace12.default.globals.get("Promise");
    const promiseRefs = ctx.getModuleReferenceName(promiseModule, stack.module || stack.compilation);
    ctx.addDepend(promiseModule, stack.module || stack.compilation);
    if (block.type !== "BlockStatement") {
      block = ctx.createBlockStatement([block]);
    }
    const content = ctx.createFunctionExpression(block);
    if (params.length > 0) {
      content.using = params.map((item) => {
        return createAddressRefsNode(
          ctx,
          ctx.createVarIdentifier(item.argument.value)
        );
      });
    }
    const resolve = ctx.createCallExpression(
      ctx.createVarIdentifier("resolve"),
      [
        ctx.createCallExpression(
          ctx.createIdentifier("call_user_func"),
          [content]
        )
      ]
    );
    const reject = ctx.createCallExpression(
      ctx.createVarIdentifier("reject"),
      [
        ctx.createVarIdentifier("e")
      ]
    );
    const tryNode = ctx.createNode("TryStatement");
    tryNode.param = createParamNode(ctx, "e", "\\Exception");
    tryNode.block = ctx.createBlockStatement([ctx.createExpressionStatement(resolve)]);
    tryNode.handler = ctx.createBlockStatement([ctx.createExpressionStatement(reject)]);
    const executer = ctx.createFunctionExpression(ctx.createBlockStatement([tryNode]), [
      ctx.createVarIdentifier("resolve"),
      ctx.createVarIdentifier("reject")
    ]);
    if (params.length > 0) {
      executer.using = params.map((item) => {
        return createAddressRefsNode(ctx, ctx.createVarIdentifier(item.argument.value));
      });
    }
    block = ctx.createBlockStatement([
      ctx.createReturnStatement(
        ctx.createNewExpression(
          ctx.createIdentifier(promiseRefs),
          [executer]
        )
      )
    ]);
  }
  if (before.length > 0) {
    block.body.unshift(...before);
  }
  const method = !!stack.parentStack.isMethodDefinition;
  const variableRefs = !method ? ctx.getVariableRefs(stack) : null;
  if (variableRefs) {
    node.using = Array.from(variableRefs.values()).map((item) => {
      const refs = typeof item === "string" ? ctx.createVarIdentifier(item) : ctx.createVarIdentifier(item.value(), item);
      return createAddressRefsNode(ctx, refs);
    });
  }
  const returnType = stack.getReturnedType();
  if (ctx.isAddressRefsType(returnType, stack)) {
    node.prefix = "&";
  }
  node.params = params;
  node.body = block;
  return node;
}

// lib/tokens/ArrowFunctionExpression.js
function ArrowFunctionExpression_default2(ctx, stack, type) {
  const node = FunctionExpression_default2(ctx, stack, type);
  node.type = type;
  return node;
}

// lib/tokens/AssignmentExpression.js
var import_Utils25 = __toESM(require("easescript/lib/core/Utils"));

// lib/transforms/Base64.js
var Base64_default = {
  decode(stack, ctx, object, args, called = false, isStatic = false) {
    if (!called) {
      return ctx.createChunkExpression(`function($value){return base64_decode( $value );}`);
    }
    return ctx.createCallExpression(
      ctx.createIdentifier("base64_decode"),
      args
    );
  },
  encode(stack, ctx, object, args, called = false, isStatic = false) {
    if (!called) {
      return ctx.createChunkExpression(`function($value){return base64_encode( $value );}`);
    }
    return ctx.createCallExpression(
      ctx.createIdentifier("base64_encode"),
      args
    );
  }
};

// lib/transforms/ConsoleInterface.js
var import_Namespace13 = __toESM(require("easescript/lib/core/Namespace"));
init_Common2();
var ConsoleInterface_default = {
  log(stack, ctx, object, args, called = false, isStatic = false) {
    const module2 = import_Namespace13.default.globals.get("System");
    ctx.addDepend(module2);
    if (!called) {
      return ctx.createChunkExpression(`function(...$args){System::print(...$args);}`);
    }
    return ctx.createCallExpression(
      createStaticReferenceNode2(ctx, stack, "System", "print"),
      args
    );
  },
  trace(stack, ctx, object, args, called = false, isStatic = false) {
    return this.log(stack, ctx, object, args, called, isStatic);
  }
};

// lib/transforms/Error.js
init_Common2();
var Error_default = {
  message(stack, ctx, object, args, called = false, isStatic = false) {
    return ctx.createCalleeExpression(
      ctx.createMemberExpression([
        object,
        ctx.createIdentifier("getMessage")
      ])
    );
  },
  cause(stack, ctx, object, args, called = false, isStatic = false) {
    return ctx.createCalleeExpression(
      ctx.createMemberExpression([
        object,
        ctx.createIdentifier("getPrevious")
      ])
    );
  },
  name(stack, ctx, object, args, called = false, isStatic = false) {
    return ctx.createCalleeExpression(
      ctx.createIdentifier("get_class"),
      [
        object
      ]
    );
  },
  toString(stack, ctx, object, args, called = false, isStatic = false) {
    if (!called) {
      return ctx.createCalleeExpression(
        createStaticReferenceNode2(ctx, object.stack, "Reflect", "get"),
        [
          ctx.createLiteral(null),
          object,
          ctx.createIdentifier("__toString")
        ]
      );
    }
    return ctx.createCalleeExpression(
      ctx.createMemberExpression([
        object,
        ctx.createIdentifier("__toString")
      ])
    );
  }
};

// lib/transforms/Function.js
var import_Namespace14 = __toESM(require("easescript/lib/core/Namespace"));
var import_Utils24 = __toESM(require("easescript/lib/core/Utils"));
init_Common2();
init_Object();
function createCallNode(stack, ctx, target, args) {
  return ctx.createCallExpression(
    createStaticReferenceNode2(ctx, stack, "Reflect", "apply"),
    [target].concat(args)
  );
}
var methods2 = {
  apply(stack, ctx, object, args, called = false, isStatic = false) {
    const callee = object.type === "MemberExpression" ? object.object : object;
    if (!called) {
      return callee;
    }
    const _arguments = [args[0]];
    if (args.length > 1) {
      _arguments.push(ctx.createArrayExpression(args.slice(1)));
    }
    return createCallNode(stack, ctx, callee, _arguments);
  },
  call(stack, ctx, object, args, called = false, isStatic = false) {
    const callee = object.type === "MemberExpression" ? object.object : object;
    if (!called) {
      return callee;
    }
    const _arguments = [args[0]];
    if (args.length > 1) {
      _arguments.push(ctx.createArrayExpression(args.slice(1)));
    }
    return createCallNode(stack, ctx, callee, _arguments);
  },
  bind(stack, ctx, object, args, called = false, isStatic = false) {
    args = args.slice();
    let System = import_Namespace14.default.globals.get("System");
    ctx.addDepend(System);
    if (!called) {
      return ctx.createArrayExpression([
        createClassRefsNode(ctx, System, stack),
        ctx.createLiteral("bind")
      ]);
    }
    const _arguments = stack.arguments || [];
    let flagNode = ctx.createLiteral(null);
    if (_arguments[0]) {
      const type = ctx.inferType(_arguments[0]);
      if (type.isLiteralArrayType || import_Namespace14.default.globals.get("Array") === import_Utils24.default.getOriginType(type)) {
        flagNode = ctx.createLiteral(true);
      } else if (!type.isAnyType) {
        flagNode = ctx.createLiteral(false);
      }
    }
    args.splice(1, 0, flagNode);
    if (object.type === "MemberExpression") {
      object = ctx.createArrayExpression([
        object.object,
        object.createLiteral(object.property.value)
      ]);
    }
    return ctx.createCallExpression(
      createStaticReferenceNode2(ctx, stack, "System", "bind"),
      [object].concat(args)
    );
  }
};
["propertyIsEnumerable", "hasOwnProperty", "valueOf", "toLocaleString", "toString"].forEach((name) => {
  if (!Object.prototype.hasOwnProperty.call(methods2, name)) {
    methods2[name] = Object_default[name];
  }
});
var Function_default = methods2;

// lib/helper/date.js
var allow_format_chars = "mdewgahksxolMQDEWYGAHSZXLT".split("").map((char) => char.charCodeAt(0));

// lib/transforms/global.js
init_Common2();
var import_Namespace15 = __toESM(require("easescript/lib/core/Namespace"));
var global_default = {
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
  setInterval(stack, ctx, object, args, called = false, isStatic = false) {
    ctx.callee = ctx.createIdentifier("call_user_func");
    ctx.arguments = args.slice(0, 1);
    return ctx;
  },
  setTimeout(stack, ctx, object, args, called = false, isStatic = false) {
    ctx.callee = ctx.createIdentifier("call_user_func");
    ctx.arguments = args.slice(0, 1);
    return ctx;
  },
  clearTimeout(stack, ctx, object, args, called = false, isStatic = false) {
    return null;
  },
  clearInterval(stack, ctx, object, args, called = false, isStatic = false) {
    return null;
  },
  parseInt(stack, ctx, object, args, called = false, isStatic = false) {
    if (called) {
      ctx.callee = ctx.createIdentifier("intval");
      ctx.arguments = args.slice(0, 2);
      return ctx;
    } else {
      return null;
    }
  },
  parseFloat(stack, ctx, object, args, called = false, isStatic = false) {
    if (called) {
      ctx.callee = ctx.createIdentifier("floatval");
      ctx.arguments = args.slice(0, 1);
      return ctx;
    } else {
      return null;
    }
  },
  isNaN(stack, ctx, object, args, called = false, isStatic = false) {
    ctx.addDepend(import_Namespace15.default.globals.get("System"));
    if (!called) {
      ctx.createChunkExpression(`function($target){return System::isNaN($target);}`);
    }
    return ctx.createCallExpression(
      createStaticReferenceNode2(ctx, stack, "System", "isNaN"),
      args
    );
  },
  isFinite(stack, ctx, object, args, called = false, isStatic = false) {
    if (!called) {
      return ctx.createLiteral("is_finite");
    }
    ctx.callee = ctx.createIdentifier("is_finite");
    ctx.arguments = args.slice(0, 1);
    return ctx;
  }
};

// lib/transforms/IArguments.js
init_Object();
var methods3 = {
  length(stack, ctx, object, args, called = false, isStatic = false) {
    return ctx.createCallExpression(ctx.createIdentifier("func_num_args"));
  },
  $computed(stack, ctx, object, args, called = false, isStatic = false) {
    return ctx.createCallExpression(ctx.createIdentifier("func_get_arg"), args);
  }
};
["propertyIsEnumerable", "hasOwnProperty", "valueOf", "toLocaleString", "toString"].forEach((name) => {
  if (!Object.prototype.hasOwnProperty.call(methods3, name)) {
    methods3[name] = Object_default[name];
  }
});
var IArguments_default = methods3;

// lib/transforms/JSON.js
var JSON_default = {
  parse(stack, ctx, object, args, called = false, isStatic = false) {
    if (!called) {
      return ctx.createChunkExpression(`function($target){return json_decode($target);}`);
    }
    return ctx.createCallExpression(
      ctx.createIdentifier("json_decode"),
      args.slice(0, 1)
    );
  },
  stringify(stack, ctx, object, args, called = false, isStatic = false) {
    if (!called) {
      return ctx.createChunkExpression(`function($target){return json_encode($target,JSON_UNESCAPED_UNICODE);}`);
    }
    return ctx.createCallExpression(
      ctx.createIdentifier("json_encode"),
      args.slice(0, 1).concat(ctx.createIdentifier(`JSON_UNESCAPED_UNICODE`))
    );
  }
};

// lib/transforms/Math.js
function createCommonCalledNode3(name, stack, ctx, object, args, called, params) {
  if (!called) {
    return createCalleeFunctionNode(ctx, params || ["value"], name);
  }
  let len = 1;
  if (params && Array.isArray(params)) {
    len = params[0] === "..." ? args.length : params.length;
  }
  return ctx.createCallExpression(
    ctx.createIdentifier(name),
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
    return ctx.createVarIdentifier(name);
  });
  return ctx.createFunctionExpression(
    ctx.createBlockStatement([
      ctx.createReturnStatement(
        ctx.createCallExpression(
          ctx.createIdentifier(callName),
          cratePparams()
        )
      )
    ]),
    cratePparams()
  );
}
var Math_default = {
  E(stack, ctx) {
    return ctx.createLiteral(2.718281828459045);
  },
  LN10(stack, ctx) {
    return ctx.createLiteral(2.302585092994046);
  },
  LN2(stack, ctx) {
    return ctx.createLiteral(0.6931471805599453);
  },
  LOG2E(stack, ctx) {
    return ctx.createLiteral(1.4426950408889634);
  },
  LOG10E(stack, ctx) {
    return ctx.createLiteral(0.4342944819032518);
  },
  PI(stack, ctx) {
    return ctx.createLiteral(3.141592653589793);
  },
  SQRT1_2(stack, ctx) {
    return ctx.createLiteral(0.7071067811865476);
  },
  SQRT2(stack, ctx) {
    return ctx.createLiteral(1.4142135623730951);
  },
  abs(stack, ctx, object, args, called = false, isStatic = false) {
    return createCommonCalledNode3("abs", stack, ctx, object, args, called);
  },
  acos(stack, ctx, object, args, called = false, isStatic = false) {
    return createCommonCalledNode3("acos", stack, ctx, object, args, called);
  },
  asin(stack, ctx, object, args, called = false, isStatic = false) {
    return createCommonCalledNode3("asin", stack, ctx, object, args, called);
  },
  atan2(stack, ctx, object, args, called = false, isStatic = false) {
    return createCommonCalledNode3("atan2", stack, ctx, object, args, called, ["a", "b"]);
  },
  ceil(stack, ctx, object, args, called = false, isStatic = false) {
    return createCommonCalledNode3("ceil", stack, ctx, object, args, called);
  },
  cos(stack, ctx, object, args, called = false, isStatic = false) {
    return createCommonCalledNode3("cos", stack, ctx, object, args, called);
  },
  log(stack, ctx, object, args, called = false, isStatic = false) {
    return createCommonCalledNode3("log", stack, ctx, object, args, called);
  },
  max(stack, ctx, object, args, called = false, isStatic = false) {
    return createCommonCalledNode3("max", stack, ctx, object, args, called, ["..."]);
  },
  min(stack, ctx, object, args, called = false, isStatic = false) {
    return createCommonCalledNode3("min", stack, ctx, object, args, called, ["..."]);
  },
  pow(stack, ctx, object, args, called = false, isStatic = false) {
    return createCommonCalledNode3("pow", stack, ctx, object, args, called, ["a", "b"]);
  },
  sin(stack, ctx, object, args, called = false, isStatic = false) {
    return createCommonCalledNode3("sin", stack, ctx, object, args, called);
  },
  sqrt(stack, ctx, object, args, called = false, isStatic = false) {
    return createCommonCalledNode3("sqrt", stack, ctx, object, args, called);
  },
  tan(stack, ctx, object, args, called = false, isStatic = false) {
    return createCommonCalledNode3("tan", stack, ctx, object, args, called);
  },
  round(stack, ctx, object, args, called = false, isStatic = false) {
    return createCommonCalledNode3("round", stack, ctx, object, args, called);
  },
  floor(stack, ctx, object, args, called = false, isStatic = false) {
    return createCommonCalledNode3("floor", stack, ctx, object, args, called);
  },
  random(stack, ctx, object, args, called = false, isStatic = false) {
    if (!called) {
      return ctx.createChunkExpression(`function(){return mt_rand(1,2147483647) / 2147483647;}`);
    }
    return ctx.createChunkExpression(`(mt_rand(1,2147483647) / 2147483647)`);
  }
};

// lib/transforms/index.js
init_Number();
init_Object();

// lib/transforms/String.js
var import_Namespace17 = __toESM(require("easescript/lib/core/Namespace"));
init_Object();
function createMethodFunctionNode3(ctx, name) {
  return ctx.createLiteral(name);
}
function createCommonCalledNode5(name, ctx, object, args, called) {
  if (!called)
    return createMethodFunctionNode3(ctx, name);
  return ctx.createCallExpression(
    ctx.createIdentifier(name),
    object ? [object].concat(args) : args
  );
}
var methods5 = {
  fromCodePoint(stack, ctx, object, args, called = false, isStatic = false) {
    const module2 = import_Namespace17.default.globals.get("String");
    ctx.addDepend(module2);
    const name = ctx.getModuleNamespace(module2, "es_string_from_code_point");
    return createCommonCalledNode5(name, ctx, object, args, called);
  },
  raw(stack, ctx, object, args, called = false, isStatic = false) {
    const module2 = import_Namespace17.default.globals.get("String");
    ctx.addDepend(module2);
    const name = ctx.getModuleNamespace(module2, "es_string_raw");
    return createCommonCalledNode5(name, ctx, object, args, called);
  },
  fromCharCode(stack, ctx, object, args, called = false, isStatic = false) {
    if (!called) {
      const module3 = import_Namespace17.default.globals.get("String");
      ctx.addDepend(module3);
      return ctx.createChunkExpression(`function(...$code){return es_string_from_char_code(...$code);}`);
    }
    if (args.length === 1) {
      return createCommonCalledNode5("chr", ctx, null, args, true);
    }
    const module2 = import_Namespace17.default.globals.get("String");
    const name = ctx.getModuleNamespace(module2, "es_string_from_char_code");
    ctx.addDepend(module2);
    return createCommonCalledNode5(name, ctx, null, args, true);
  },
  charAt(stack, ctx, object, args, called = false, isStatic = false) {
    const module2 = import_Namespace17.default.globals.get("String");
    ctx.addDepend(module2);
    const name = ctx.getModuleNamespace(module2, "es_string_char_at");
    return createCommonCalledNode5(name, ctx, object, args, called);
  },
  charCodeAt(stack, ctx, object, args, called = false, isStatic = false) {
    const module2 = import_Namespace17.default.globals.get("String");
    ctx.addDepend(module2);
    const name = ctx.getModuleNamespace(module2, "es_string_char_code_at");
    return createCommonCalledNode5(name, ctx, object, args, called);
  },
  concat(stack, ctx, object, args, called = false, isStatic = false) {
    const module2 = import_Namespace17.default.globals.get("String");
    ctx.addDepend(module2);
    const name = ctx.getModuleNamespace(module2, "es_string_concat");
    return createCommonCalledNode5(name, ctx, object, args, called);
  },
  includes(stack, ctx, object, args, called = false, isStatic = false) {
    const module2 = import_Namespace17.default.globals.get("String");
    ctx.addDepend(module2);
    const name = ctx.getModuleNamespace(module2, "es_string_includes");
    return createCommonCalledNode5(name, ctx, object, args, called);
  },
  indexOf(stack, ctx, object, args, called = false, isStatic = false) {
    const module2 = import_Namespace17.default.globals.get("String");
    ctx.addDepend(module2);
    const name = ctx.getModuleNamespace(module2, "es_string_index_of");
    return createCommonCalledNode5(name, ctx, object, args, called);
  },
  lastIndexOf(stack, ctx, object, args, called = false, isStatic = false) {
    const module2 = import_Namespace17.default.globals.get("String");
    ctx.addDepend(module2);
    const name = ctx.getModuleNamespace(module2, "es_string_last_index_of");
    return createCommonCalledNode5(name, ctx, object, args, called);
  },
  localeCompare(stack, ctx, object, args, called = false, isStatic = false) {
    const module2 = import_Namespace17.default.globals.get("String");
    ctx.addDepend(module2);
    const name = ctx.getModuleNamespace(module2, "es_string_locale_compare");
    return createCommonCalledNode5(name, ctx, object, args, called);
  },
  match(stack, ctx, object, args, called = false, isStatic = false) {
    const module2 = import_Namespace17.default.globals.get("String");
    ctx.addDepend(module2);
    const name = ctx.getModuleNamespace(module2, "es_string_match");
    return createCommonCalledNode5(name, ctx, object, args, called);
  },
  matchAll(stack, ctx, object, args, called = false, isStatic = false) {
    const module2 = import_Namespace17.default.globals.get("String");
    ctx.addDepend(module2);
    const name = ctx.getModuleNamespace(module2, "es_string_match_all");
    return createCommonCalledNode5(name, ctx, object, args, called);
  },
  search(stack, ctx, object, args, called = false, isStatic = false) {
    const module2 = import_Namespace17.default.globals.get("String");
    ctx.addDepend(module2);
    const name = ctx.getModuleNamespace(module2, "es_string_search");
    return createCommonCalledNode5(name, ctx, object, args, called);
  },
  replace(stack, ctx, object, args, called = false, isStatic = false) {
    const module2 = import_Namespace17.default.globals.get("String");
    ctx.addDepend(module2);
    const name = ctx.getModuleNamespace(module2, "es_string_replace");
    return createCommonCalledNode5(name, ctx, object, args, called);
  },
  replaceAll(stack, ctx, object, args, called = false, isStatic = false) {
    const module2 = import_Namespace17.default.globals.get("String");
    ctx.addDepend(module2);
    const name = ctx.getModuleNamespace(module2, "es_string_replace_all");
    return createCommonCalledNode5(name, ctx, object, args, called);
  },
  slice(stack, ctx, object, args, called = false, isStatic = false) {
    const module2 = import_Namespace17.default.globals.get("String");
    ctx.addDepend(module2);
    const name = ctx.getModuleNamespace(module2, "es_string_slice");
    return createCommonCalledNode5(name, ctx, object, args, called);
  },
  repeat(stack, ctx, object, args, called = false, isStatic = false) {
    return createCommonCalledNode5("str_repeat", ctx, object, args, called);
  },
  length(stack, ctx, object, args, called = false, isStatic = false) {
    return createCommonCalledNode5("mb_strlen", ctx, object, args, true);
  },
  substr(stack, ctx, object, args, called = false, isStatic = false) {
    return createCommonCalledNode5("mb_substr", ctx, object, args, called);
  },
  substring(stack, ctx, object, args, called = false, isStatic = false) {
    const module2 = import_Namespace17.default.globals.get("String");
    ctx.addDepend(module2);
    const name = ctx.getModuleNamespace(module2, "es_string_substring");
    return createCommonCalledNode5(name, ctx, object, args, called);
  },
  toLowerCase(stack, ctx, object, args, called = false, isStatic = false) {
    return createCommonCalledNode5("mb_strtolower", ctx, object, args, called);
  },
  toLocaleLowerCase(stack, ctx, object, args, called = false, isStatic = false) {
    return createCommonCalledNode5("mb_strtolower", ctx, object, args, called);
  },
  toUpperCase(stack, ctx, object, args, called = false, isStatic = false) {
    return createCommonCalledNode5("mb_strtoupper", ctx, object, args, called);
  },
  toLocaleUpperCase(stack, ctx, object, args, called = false, isStatic = false) {
    return createCommonCalledNode5("mb_strtoupper", ctx, object, args, called);
  },
  trim(stack, ctx, object, args, called = false, isStatic = false) {
    return createCommonCalledNode5("trim", ctx, object, args, called);
  },
  trimEnd(stack, ctx, object, args, called = false, isStatic = false) {
    return createCommonCalledNode5("rtrim", ctx, object, args, called);
  },
  trimStart(stack, ctx, object, args, called = false, isStatic = false) {
    return createCommonCalledNode5("ltrim", ctx, object, args, called);
  },
  split(stack, ctx, object, args, called = false, isStatic = false) {
    if (!called) {
      return ctx.createChunkExpression(`function($target,$delimit){return explode($delimit,$target);}`);
    }
    return ctx.createCallExpression(
      ctx.createIdentifier("explode"),
      [args[0], object]
    );
  },
  padStart(stack, ctx, object, args, called = false, isStatic = false) {
    return createCommonCalledNode5("str_pad", ctx, object, [args[0], ctx.createIdentifier("STR_PAD_LEFT")], called);
  },
  padEnd(stack, ctx, object, args, called = false, isStatic = false) {
    return createCommonCalledNode5("str_pad", ctx, object, [args[0], ctx.createIdentifier("STR_PAD_RIGHT")], called);
  },
  normalize(stack, ctx, object, args, called = false, isStatic = false) {
    const module2 = import_Namespace17.default.globals.get("String");
    ctx.addDepend(module2);
    const name = ctx.getModuleNamespace(module2, "es_string_normalize");
    return createCommonCalledNode5(name, ctx, object, args, called);
  },
  valueOf(stack, ctx, object, args, called = false, isStatic = false) {
    if (!called) {
      return ctx.createChunkExpression(`function($target){return $target;}`);
    }
    return createCommonCalledNode5("strval", ctx, object, [], called);
  },
  startsWith(stack, ctx, object, args, called = false, isStatic = false) {
    const module2 = import_Namespace17.default.globals.get("String");
    ctx.addDepend(module2);
    const name = ctx.getModuleNamespace(module2, "es_string_starts_with");
    return createCommonCalledNode5(name, ctx, object, args, called);
  },
  endsWith(stack, ctx, object, args, called = false, isStatic = false) {
    const module2 = import_Namespace17.default.globals.get("String");
    ctx.addDepend(module2);
    const name = ctx.getModuleNamespace(module2, "es_string_ends_with");
    return createCommonCalledNode5(name, ctx, object, args, called);
  }
};
["propertyIsEnumerable", "hasOwnProperty", "valueOf", "toLocaleString", "toString"].forEach((name) => {
  if (!Object.prototype.hasOwnProperty.call(methods5, name)) {
    methods5[name] = Object_default[name];
  }
});
var String_default = methods5;

// lib/transforms/System.js
init_Common2();
var methods6 = {
  merge(stack, ctx, object, args) {
    let target = object;
    if (object.type !== "Identifier") {
      const refs = ctx.getLocalRefName(stack, "ref");
      ctx.insertTokenToBlock(
        stack,
        ctx.createAssignmentExpression(ctx.createVarIdentifier(refs), object)
      );
      target = ctx.createVarIdentifier(refs);
    }
    return ctx.createCallExpression(
      createStaticReferenceNode2(ctx, stack, "System", "merge"),
      [target].concat(args)
    );
  }
};
var System_default = methods6;

// lib/transforms/Uint.js
var Uint_exports = {};
__export(Uint_exports, {
  Number: () => Number_exports
});
init_Number();

// lib/transforms/Double.js
var Double_exports = {};
__export(Double_exports, {
  default: () => Double_default
});
var Double_default = (init_Number(), __toCommonJS(Number_exports));

// lib/transforms/Float.js
var Float_exports = {};
__export(Float_exports, {
  Number: () => Number_exports
});
init_Number();

// lib/transforms/Int.js
var Int_exports = {};
__export(Int_exports, {
  Number: () => Number_exports
});
init_Number();

// lib/transforms/index.js
var modules = /* @__PURE__ */ new Map();
modules.set("Array", Array_default);
modules.set("Base64", Base64_default);
modules.set("ConsoleInterface", ConsoleInterface_default);
modules.set("Error", Error_default);
modules.set("Function", Function_default);
modules.set("global", global_default);
modules.set("IArguments", IArguments_default);
modules.set("JSON", JSON_default);
modules.set("Math", Math_default);
modules.set("Number", Number_default);
modules.set("Int", Int_exports);
modules.set("Uint", Uint_exports);
modules.set("Double", Double_exports);
modules.set("Float", Float_exports);
modules.set("Object", Object_default);
modules.set("String", String_default);
modules.set("System", System_default);
var transforms_default = modules;

// lib/tokens/AssignmentExpression.js
init_Common2();
var hasOwn = Object.prototype.hasOwnProperty;
function createNode2(ctx, stack) {
  let node = ctx.createNode(stack);
  let desc2 = stack.left.description();
  let module2 = stack.module;
  let isMember = stack.left.isMemberExpression;
  let operator = stack.operator;
  node.operator = operator;
  let refsNode = ctx.createToken(stack.right);
  let leftNode = null;
  let isReflect = false;
  if (isMember) {
    const objectType = stack.left.object.type();
    if (desc2 && desc2.isStack && (desc2.isMethodSetterDefinition || desc2.isPropertyDefinition)) {
      const property = stack.left.property.value();
      let typename = ctx.getAvailableOriginType(objectType) || objectType.toString();
      if ((objectType.isUnionType || objectType.isIntersectionType) && import_Utils25.default.isModule(desc2.module)) {
        typename = desc2.module.id;
      }
      const map = {
        "Array": {
          "length": () => {
            let lengthNode = ctx.createToken(stack.left);
            if (!stack.right.isLiteral || stack.right.value() != 0) {
              lengthNode = ctx.createBinaryExpression(lengthNode, refsNode, "-");
            }
            return transforms_default.get("Array").splice(
              stack,
              ctx,
              ctx.createToken(stack.left.object),
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
      let hasDynamic = desc2 && desc2.isComputeType && desc2.isPropertyExists();
      if (!hasDynamic && desc2 && (desc2.isProperty && desc2.computed || desc2.isPropertyDefinition && desc2.dynamic)) {
        hasDynamic = true;
      }
      if (!hasDynamic && !import_Utils25.default.isLiteralObjectType(objectType)) {
        isReflect = true;
      }
    } else if (desc2 && desc2.isAnyType) {
      isReflect = !import_Utils25.default.isLiteralObjectType(objectType);
    }
  }
  if (desc2 && !isReflect && stack.right) {
    const addressRefObject = desc2.isVariableDeclarator || desc2.isParamDeclarator ? ctx.getAssignAddressRef(desc2) : null;
    if (addressRefObject && stack.left.isIdentifier) {
      const index = addressRefObject.add(stack.right);
      const left = addressRefObject.createIndexName(stack, desc2);
      const key = ctx.createAssignmentExpression(
        ctx.createVarIdentifier(left),
        ctx.createLiteral(index)
      );
      ctx.addVariableRefs(stack, left);
      let isAddressRefs = false;
      if (ctx.isPassableReferenceExpress(stack.right, stack.right.type())) {
        if (refsNode.type === "ParenthesizedExpression") {
          refsNode = refsNode.expression;
        }
        if (refsNode.type === "AssignmentExpression") {
          ctx.insertTokenToBlock(stack, refsNode);
          refsNode = refsNode.left;
        }
        refsNode = createAddressRefsNode(ctx, refsNode);
        isAddressRefs = true;
      }
      if (!stack.right.isIdentifier) {
        const refs = ctx.getLocalRefName(stack, AddressVariable_default.REFS_VALUE, stack);
        ctx.insertTokenToBlock(
          stack,
          ctx.createAssignmentExpression(ctx.createVarIdentifier(refs), refsNode)
        );
        refsNode = ctx.createVarIdentifier(refs);
        if (isAddressRefs) {
          refsNode = createAddressRefsNode(ctx, refsNode);
        }
      }
      leftNode = ctx.createComputeMemberExpression([
        ctx.createToken(stack.left),
        key
      ], null, true);
    } else if (ctx.isPassableReferenceExpress(stack.right, stack.right.type())) {
      refsNode = createAddressRefsNode(ctx, refsNode);
    }
  }
  if (isReflect) {
    if (operator && operator.charCodeAt(0) !== 61 && operator.charCodeAt(operator.length - 1) === 61) {
      operator = operator.slice(0, -1);
      const value = ctx.createCallExpression(
        createStaticReferenceNode2(ctx, stack, "Reflect", "get"),
        [
          createScopeIdNode(ctx, module2),
          ctx.createToken(stack.left.object),
          createComputedPropertyNode(ctx, stack.left)
        ],
        stack
      );
      refsNode = ctx.createBinaryExpression(value, refsNode, operator);
    }
    let target = ctx.createToken(stack.left.object);
    if (!stack.left.object.isIdentifier) {
      const refs = ctx.getLocalRefName(stack, AddressVariable_default.REFS_VALUE, stack);
      ctx.insertTokenToBlock(
        stack,
        ctx.createAssignmentExpression(
          ctx.createVarIdentifier(refs),
          target
        )
      );
      target = ctx.createVarIdentifier(refs);
    }
    return ctx.createCallExpression(
      createStaticReferenceNode2(ctx, stack, "Reflect", "set"),
      [
        createScopeIdNode(ctx, module2),
        target,
        createComputedPropertyNode(ctx, stack.left),
        refsNode
      ],
      stack
    );
  } else if (desc2 && desc2.isMethodSetterDefinition) {
    return ctx.createCallExpression(
      leftNode || ctx.createToken(stack.left),
      [
        refsNode
      ],
      stack
    );
  } else {
    node.left = leftNode || ctx.createToken(stack.left);
    node.right = refsNode;
    return node;
  }
}
function AssignmentExpression_default2(ctx, stack) {
  const node = createNode2(ctx, stack);
  let operator = stack.operator;
  if (operator === "??=") {
    const test = ctx.createCallExpression(
      ctx.createIdentifier("!isset"),
      [
        ctx.createToken(stack.left)
      ],
      stack
    );
    node.operator = "=";
    return ctx.createConditionalExpression(test, node, ctx.createLiteral(null));
  }
  return node;
}

// lib/tokens/AssignmentPattern.js
function AssignmentPattern_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  node.left = ctx.createVarIdentifier(stack.left.value(), stack.left);
  node.right = ctx.createToken(stack.right);
  return node;
}

// lib/tokens/AwaitExpression.js
init_Common2();
function AwaitExpression_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  node.argument = ctx.createCallExpression(
    createStaticReferenceNode2(ctx, stack, "Promise", "sent"),
    [
      ctx.createToken(stack.argument)
    ]
  );
  return node;
}

// lib/tokens/BinaryExpression.js
var import_Utils26 = __toESM(require("easescript/lib/core/Utils"));
init_Common2();
var mapset = {
  "String": "is_string",
  "Number": "is_numeric",
  "Array": "is_array",
  "Function": "is_callable",
  "Object": "is_object",
  "Boolean": "is_bool"
};
function createNode3(ctx, stack) {
  let maybeArrayRef = stack.isMemberExpression || stack.isCallExpression || stack.isIdentifier;
  if (maybeArrayRef) {
    if (stack.isIdentifier || stack.isMemberExpression) {
      let desc2 = stack.description();
      if (import_Utils26.default.isTypeModule(desc2)) {
        return ctx.createToken(stack);
      }
    }
    let originType = ctx.getAvailableOriginType(stack.type());
    if (originType && originType.toLowerCase() === "array") {
      let desc2 = stack.description();
      if (stack.isIdentifier) {
        return createArrayAddressRefsNode(ctx, stack, desc2, stack.value());
      } else {
        let name = ctx.getLocalRefName(stack, AddressVariable_default.REFS_MEMORY, stack);
        let left = ctx.createVarIdentifier(name);
        let right = createAddressRefsNode(ctx, ctx.createToken(stack));
        ctx.insertTokenToBlock(stack, ctx.createAssignmentExpression(left, right));
        return ctx.createVarIdentifier(name);
      }
    }
  }
  return ctx.createToken(stack);
}
function BinaryExpression_default2(ctx, stack) {
  let operator = stack.node.operator;
  if (operator === "is" || operator === "instanceof") {
    let type = stack.right.type();
    let name = ctx.getAvailableOriginType(type);
    if (mapset[name]) {
      return ctx.createCallExpression(
        ctx.createIdentifier(mapset[name]),
        [
          ctx.createToken(stack.left)
        ],
        stack
      );
    } else if (operator === "is") {
      ctx.addDepend(type);
      return ctx.createCallExpression(
        ctx.createIdentifier("is_a"),
        [
          ctx.createToken(stack.left),
          ctx.createToken(stack.right)
        ],
        stack
      );
    }
  }
  if (operator.charCodeAt(0) === 43) {
    let leftType = stack.left.type();
    let rightType = stack.right.type();
    let oLeftType = leftType;
    let oRightType = rightType;
    let isNumber = leftType.isLiteralType && rightType.isLiteralType;
    if (isNumber) {
      leftType = ctx.getAvailableOriginType(leftType);
      rightType = ctx.getAvailableOriginType(rightType);
      isNumber = leftType === "Number" && leftType === rightType;
    }
    if (!isNumber) {
      if (oLeftType.toString() === "string" || oRightType.toString() === "string") {
        operator = operator.length > 1 ? "." + operator.substr(1) : ".";
      } else {
        return ctx.createCallExpression(
          createStaticReferenceNode2(ctx, stack, "System", "addition"),
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
  node.left = createNode3(ctx, stack.left);
  node.right = createNode3(ctx, stack.right);
  node.operator = operator;
  if (stack.left && stack.left.isMemberExpression && node.left && node.left.type === "BinaryExpression") {
    node.left = ctx.createParenthesizedExpression(node.left);
  }
  if (stack.right && stack.right.isMemberExpression && node.right && node.right.type === "BinaryExpression") {
    node.right = ctx.createParenthesizedExpression(node.right);
  }
  return node;
}

// lib/tokens/BlockStatement.js
function BlockStatement_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  node.body = [];
  ctx.setNode(stack, node);
  for (let child of stack.body) {
    const token = ctx.createToken(child);
    if (token) {
      node.body.push(token);
      if (child.isWhenStatement) {
        const express = token.type === "BlockStatement" ? token.body : [token];
        if (Array.isArray(express)) {
          const last = express[express.length - 1];
          if (last && last.type === "ReturnStatement") {
            break;
          }
        }
      } else if (child.isReturnStatement || child.hasReturnStatement) {
        break;
      }
    }
  }
  ;
  ctx.removeNode(stack);
  return node;
}

// lib/tokens/BreakStatement.js
function BreakStatement_default2(ctx, stack) {
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
    node.label = ctx.createLiteral(index);
  } else if (stack.label) {
    node.label = ctx.createIdentifier(stack.label.value(), stack.label);
  }
  return node;
}

// lib/tokens/CallExpression.js
init_Common2();
var import_Utils27 = __toESM(require("easescript/lib/core/Utils"));
var import_Namespace18 = __toESM(require("easescript/lib/core/Namespace"));
function createArgumentNodes(ctx, stack, args, declareParams) {
  return args.map((item, index) => {
    const node = ctx.createToken(item);
    if (declareParams && declareParams[index] && !item.isIdentifier) {
      const declareParam = declareParams[index];
      if (!(declareParam.isRestElement || declareParam.isObjectPattern || declareParam.isArrayPattern)) {
        if (ctx.isAddressRefsType(declareParam.type())) {
          const name = ctx.getLocalRefName(stack, "arg");
          ctx.insertTokenToBlock(
            stack,
            ctx.createAssignmentExpression(
              ctx.createVarIdentifier(name),
              node
            )
          );
          return ctx.createVarIdentifier(name);
        }
      }
    }
    return node;
  });
}
function CallExpression(ctx, stack) {
  const isMember = stack.callee.isMemberExpression;
  const desc2 = stack.descriptor();
  const module2 = stack.module;
  const declareParams = desc2 && desc2.params;
  const node = ctx.createNode(stack);
  const args = createArgumentNodes(ctx, stack, stack.arguments, declareParams);
  if (stack.callee.isFunctionExpression) {
    node.callee = ctx.createIdentifier("call_user_func");
    node.arguments = [ctx.createToken(stack.callee)].concat(args);
    return node;
  }
  if (!stack.callee.isSuperExpression) {
    let context = isMember ? stack.callee.object.getContext() : stack.callee.getContext();
    let objectType = isMember ? ctx.inferType(stack.callee.object, context) : null;
    if (objectType && objectType.isClassGenericType && objectType.inherit.isAliasType) {
      objectType = ctx.inferType(objectType.inherit.inherit.type(), context);
    }
    if (isMember && desc2 && !objectType.isNamespace) {
      if (desc2.isType && desc2.isAnyType) {
        const propValue = stack.callee.property.value();
        const property = ctx.createLiteral(propValue, void 0, stack.callee.property);
        let target = ctx.createToken(stack.callee.object);
        if (!stack.callee.object.isIdentifier && target.type !== "Literal") {
          const refs = ctx.getLocalRefName(stack, "ref");
          ctx.insertTokenToBlock(
            stack,
            ctx.createAssignmentExpression(
              ctx.createVarIdentifier(refs),
              target
            )
          );
          target = ctx.createVarIdentifier(refs);
        }
        let _args = [
          createScopeIdNode(ctx, module2),
          target,
          property
        ];
        if (args.length > 0) {
          _args.push(ctx.createArrayExpression(args));
        }
        return ctx.createCallExpression(
          createStaticReferenceNode2(ctx, stack, "Reflect", "call"),
          _args,
          stack
        );
      } else if (import_Utils27.default.isStack(desc2)) {
        let name = ctx.getAvailableOriginType(objectType) || objectType.toString();
        if ((objectType.isUnionType || objectType.isIntersectionType) && (desc2.isMethodDefinition || desc2.isCallDefinition) && desc2.module && desc2.module.isModule) {
          name = desc2.module.id;
          descModule = desc2.module;
        }
        let newWrapObject = null;
        let isStringNewWrapObject = null;
        if (objectType.isInstanceofType && !objectType.isThisType) {
          const origin = objectType.inherit.type();
          isStringNewWrapObject = origin === import_Namespace18.default.globals.get("String");
          if (isStringNewWrapObject || origin === import_Namespace18.default.globals.get("Number") || origin === import_Namespace18.default.globals.get("Boolean")) {
            newWrapObject = true;
          }
        }
        if (transforms_default.has(name)) {
          const object = transforms_default.get(name);
          const key = stack.callee.property.value();
          if (Object.prototype.hasOwnProperty.call(object, key)) {
            if (desc2.static) {
              return object[key](
                stack,
                ctx,
                null,
                args,
                true,
                true
              );
            } else {
              let callee = ctx.createToken(stack.callee.object);
              if (newWrapObject && isStringNewWrapObject) {
                callee = ctx.createCallExpression(
                  ctx.createMemberExpression([
                    callee,
                    ctx.createIdentifier("toString")
                  ])
                );
              }
              return object[key](
                stack,
                ctx,
                callee,
                args,
                true,
                false
              );
            }
          }
        }
        if (!(desc2.isMethodDefinition || desc2.isCallDefinition)) {
          node.callee = ctx.createIdentifier("call_user_func");
          node.arguments = [
            ctx.createToken(stack.callee)
          ].concat(args);
          return node;
        }
      }
    } else if (desc2) {
      if (desc2.isType && desc2.isAnyType) {
        const Reflect2 = stack.getGlobalTypeById("Reflect");
        ctx.addDepend(Reflect2, stack.module);
        let target = ctx.createToken(stack.callee);
        if (!stack.callee.isIdentifier) {
          const refs = ctx.getLocalRefName(stack, "ref");
          ctx.insertTokenToBlock(
            stack,
            ctx.createAssignmentExpression(
              ctx.createVarIdentifier(refs),
              target
            )
          );
          target = ctx.createVarIdentifier(refs);
        }
        return ctx.createCallExpression(
          createStaticReferenceNode2(ctx, stack, "Reflect", "apply"),
          [
            createScopeIdNode(ctx, module2),
            target,
            args.length > 0 ? ctx.createArrayExpression(args) : null
          ],
          stack
        );
      } else if (desc2.isStack && desc2.isDeclaratorFunction) {
        const callee = ctx.createToken(stack.callee);
        const object = transforms_default.get("global");
        if (Object.prototype.hasOwnProperty.call(object, callee.value)) {
          return object[callee.value](
            stack,
            ctx,
            callee,
            args,
            true,
            false
          );
        }
      } else if ((desc2.isCallDefinition || import_Utils27.default.isModule(desc2)) && args.length === 1) {
        const name = desc2.isCallDefinition && desc2.module ? desc2.module.id : ctx.getAvailableOriginType(desc2) || desc2.toString();
        if (name && transforms_default.has(name)) {
          const object = transforms_default.get(name);
          return object.valueOf(
            stack,
            ctx,
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
    node.callee = ctx.createStaticMemberExpression([
      ctx.createToken(stack.callee),
      ctx.createIdentifier("__construct")
    ]);
    node.isSuperExpression = true;
  } else {
    node.callee = ctx.createToken(stack.callee);
  }
  node.arguments = args;
  return node;
}
var CallExpression_default2 = CallExpression;

// lib/tokens/ChainExpression.js
function ChainExpression_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  if (stack.expression.isCallExpression || stack.expression.isNewExpression) {
    const test = ctx.createCallExpression(
      ctx.createIdentifier("isset"),
      [
        ctx.createToken(stack.expression.callee)
      ],
      stack
    );
    node.expression = ctx.createConditionalExpression(test, ctx.createToken(stack.expression), ctx.createLiteral(null));
  } else {
    if (stack.expression.computed) {
      const test = ctx.createCallExpression(
        ctx.createIdentifier("isset"),
        [
          ctx.createToken(stack.expression.object)
        ],
        stack
      );
      node.expression = ctx.createConditionalExpression(test, ctx.createToken(stack.expression), ctx.createLiteral(null));
    } else {
      node.expression = ctx.createBinaryExpression(ctx.createToken(stack.expression), ctx.createLiteral(null), "??");
    }
  }
  return node;
}

// lib/core/ClassBuilder.js
var import_crypto4 = require("crypto");
init_Common2();
var ClassBuilder2 = class {
  constructor(stack) {
    this.stack = stack;
    this.compilation = stack.compilation;
    this.module = stack.module;
    this.body = [];
    this.beforeBody = [];
    this.afterBody = [];
    this.methods = [];
    this.members = [];
    this.initAfterProperties = [];
    this.initBeforeProperties = [];
    this.construct = null;
    this.implements = [];
    this.inherit = null;
    this.mainEnter = null;
  }
  create(ctx) {
    let node = ctx.createNode("ClassDeclaration");
    ctx.setNode(this.stack, this);
    const module2 = this.module;
    const stack = this.stack;
    this.createInherit(ctx, module2, stack);
    this.createImplements(ctx, module2, stack);
    this.createBody(ctx, module2, stack);
    ctx.crateModuleAssets(module2);
    ctx.createModuleImportReferences(module2);
    node.static = !!module2.static;
    node.id = ctx.createIdentifier(module2.id);
    node.inherit = this.inherit;
    node.implements = this.implements;
    node.body = ctx.createBlockStatement([
      ...this.beforeBody,
      ...this.methods,
      ...this.members,
      ...this.afterBody
    ]);
    if (this.construct) {
      node.body.body.unshift(this.construct);
    }
    if (this.mainEnter) {
      ctx.addNodeToAfterBody(
        ctx.createExpressionStatement(
          ctx.createExpressionStatement(this.mainEnter)
        )
      );
    }
    ctx.removeNode(this.stack);
    return node;
  }
  createBody(ctx, module2, stack) {
    this.createMemebers(ctx, stack);
    this.checkConstructor(ctx, this.construct, module2);
  }
  createInherit(ctx, module2, stack = null) {
    let inherit = module2.inherit;
    if (inherit) {
      ctx.addDepend(inherit, module2);
      this.inherit = ctx.createIdentifier(
        ctx.getModuleReferenceName(inherit, module2)
      );
    }
  }
  createImplements(ctx, module2, stack = null) {
    this.implements = module2.implements.map((impModule) => {
      if (impModule.isInterface && !impModule.isStructTable) {
        ctx.addDepend(impModule, module2);
        return ctx.createIdentifier(
          ctx.getModuleReferenceName(impModule, module2)
        );
      }
      return null;
    }).filter(Boolean);
  }
  getHashId(len = 8) {
    let moduleHashId = this._moduleHashId;
    if (!moduleHashId) {
      const name = this.module.getName();
      const file = this.compilation.file;
      this._moduleHashId = moduleHashId = (0, import_crypto4.createHash)("sha256").update(`${file}:${name}`).digest("hex").substring(0, len);
    }
    return moduleHashId;
  }
  checkConstructor(ctx, construct, module2) {
    if (this.initAfterProperties.length > 0 || this.initBeforeProperties.length > 0) {
      if (!construct) {
        construct = this.construct = ctx.createMethodDefinition("__construct", ctx.createBlockStatement());
        if (this.inherit) {
          construct.body.body.push(
            ctx.createExpressionStatement(
              ctx.createCallExpression(
                ctx.createMemberExpression([
                  ctx.createSuperExpression(),
                  ctx.createIdentifier("__construct")
                ]),
                []
              )
            )
          );
        }
      }
      if (this.initBeforeProperties.length > 0) {
        let index = construct.body.body.findIndex((item) => {
          if (item.type === "ExpressionStatement") {
            item = item.expression;
          }
          if (item.type === "CallExpression" && item.callee.type === "MemberExpression") {
            if (item.callee.object.value === "parent" && item.callee.property.value === "__construct") {
              return true;
            }
          }
        });
        construct.body.body.splice(index + 1, 0, ...this.initBeforeProperties);
      }
      if (this.initAfterProperties.length > 0) {
        construct.body.body.push(...this.initAfterProperties);
      }
    }
  }
  createMemebers(ctx, stack) {
    stack.body.forEach((item) => {
      const child = this.createMemeber(ctx, item, !!stack.static);
      if (!child)
        return;
      const staticFlag = !!(stack.static || child.static);
      const refs = staticFlag ? this.methods : this.members;
      if (item.isConstructor && item.isMethodDefinition) {
        this.construct = child;
      } else {
        refs.push(child);
      }
    });
  }
  createAnnotations(ctx, stack, node, staticFlag = false) {
    if (staticFlag && stack.isMethodDefinition && stack.isEnterMethod && node.modifier.value === "public") {
      this.mainEnter = createMainAnnotationNode2(ctx, stack);
    }
    return node;
  }
  createMemeber(ctx, stack, staticFlag = false) {
    const node = ctx.createToken(stack);
    if (node) {
      this.createAnnotations(ctx, stack, node, !!(staticFlag || node.static));
    }
    return node;
  }
  createDefaultConstructor(ctx, name, inherit = null, params = []) {
    const block = ctx.createBlockStatement();
    if (inherit) {
      const args = ctx.createArrayExpression(params);
      block.body.push(
        ctx.createExpressionStatement(
          ctx.createCallExpression(
            ctx.createStaticMemberExpression([
              ctx.createSuperExpression(),
              ctx.createIdentifier(name)
            ]),
            args
          )
        )
      );
    }
    return ctx.createMethodDefinition(
      name,
      block,
      params
    );
  }
};
var ClassBuilder_default2 = ClassBuilder2;

// lib/tokens/ClassDeclaration.js
function ClassDeclaration_default2(ctx, stack) {
  const builder = new ClassBuilder_default2(stack);
  return builder.create(ctx);
}

// lib/tokens/ConditionalExpression.js
init_Common2();
function createConditionalNode(ctx, stack) {
  const node = ctx.createNode("IfStatement");
  const result = ctx.getLocalRefName(stack, AddressVariable_default.REFS_NAME, stack);
  let consequent = ctx.createToken(stack.consequent);
  let alternate = ctx.createToken(stack.alternate);
  let assignName = ctx.getLocalRefName(stack, AddressVariable_default.REFS_INDEX, stack);
  const key0 = ctx.createAssignmentExpression(
    ctx.createVarIdentifier(assignName),
    ctx.createLiteral(0)
  );
  const key1 = ctx.createAssignmentExpression(
    ctx.createVarIdentifier(assignName),
    ctx.createLiteral(1)
  );
  if (ctx.isPassableReferenceExpress(stack.consequent, stack.consequent.type())) {
    consequent = createAddressRefsNode(ctx, consequent);
  }
  if (ctx.isPassableReferenceExpress(stack.alternate, stack.alternate.type())) {
    alternate = createAddressRefsNode(ctx, alternate);
  }
  node.condition = createExpressionTransformBooleanValueNode(ctx, stack.test);
  node.consequent = ctx.createAssignmentExpression(
    ctx.createComputeMemberExpression([
      ctx.createVarIdentifier(result),
      key0
    ]),
    consequent
  );
  node.alternate = ctx.createAssignmentExpression(
    ctx.createComputeMemberExpression([
      ctx.createVarIdentifier(result),
      key1
    ]),
    alternate
  );
  ctx.insertTokenToBlock(stack, node);
  return ctx.createComputeMemberExpression([
    ctx.createVarIdentifier(result),
    ctx.createVarIdentifier(assignName)
  ]);
}
function check(ctx, stack) {
  if (stack.isConditionalExpression) {
    return check(ctx, stack.consequent) || check(ctx, stack.alternate);
  }
  const type = stack.type();
  return ctx.isAddressRefsType(type, stack);
}
function ConditionalExpression_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  if (check(ctx, stack)) {
    return createConditionalNode(ctx, stack);
  } else {
    node.test = createExpressionTransformBooleanValueNode(ctx, stack.test);
    node.consequent = ctx.createToken(stack.consequent);
    node.alternate = ctx.createToken(stack.alternate);
    return node;
  }
}

// lib/tokens/ContinueStatement.js
function ContinueStatement_default2(ctx, stack) {
  const node = ctx.createToken(stack);
  node.label = ctx.createToken(stack.label);
  return node;
}

// lib/tokens/Declarator.js
function Declarator_default2(ctx, stack) {
  const node = ctx.createNode(stack, "Identifier");
  node.value = node.raw = stack.value();
  node.isVariable = true;
  return node;
}

// lib/tokens/DeclaratorDeclaration.js
function DeclaratorDeclaration_default2(ctx, stack, type) {
}

// lib/tokens/DoWhileStatement.js
init_Common2();
function DoWhileStatement_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  node.condition = createExpressionTransformBooleanValueNode(ctx, stack.condition);
  node.body = ctx.createToken(stack.body);
  return node;
}

// lib/tokens/EmptyStatement.js
function EmptyStatement_default2() {
}

// lib/core/EnumBuilder.js
var import_Namespace19 = __toESM(require("easescript/lib/core/Namespace.js"));
var EnumBuilder2 = class extends ClassBuilder_default2 {
  create(ctx) {
    let node = ctx.createNode("ClassDeclaration");
    ctx.setNode(this.stack, this);
    const module2 = this.module;
    const stack = this.stack;
    this.createInherit(ctx, module2, stack);
    this.createImplements(ctx, module2, stack);
    this.createBody(ctx, module2, stack);
    ctx.crateModuleAssets(module2);
    node.id = ctx.createIdentifier(module2.id);
    node.inherit = this.inherit;
    node.implements = this.implements;
    ctx.removeNode(this.stack);
    node.body = ctx.createBlockStatement([
      ...this.beforeBody,
      ...this.methods,
      ...this.members,
      ...this.afterBody
    ]);
    if (this.construct) {
      node.body.body.unshift(this.construct);
    }
    return node;
  }
  createEnumExpression(ctx) {
    const stack = this.stack;
    const name = stack.value();
    const keys2 = [];
    const values = [];
    stack.properties.forEach((item) => {
      keys2.push(
        ctx.createProperty(
          ctx.createLiteral(item.key.value()),
          ctx.createLiteral(item.init.value())
        )
      );
      values.push(
        ctx.createProperty(
          ctx.createLiteral(String(item.init.value())),
          ctx.createLiteral(item.key.value())
        )
      );
    });
    return ctx.createExpressionStatement(
      ctx.createAssignmentExpression(
        ctx.createVarIdentifier(name),
        ctx.createObjectExpression(values.concat(keys2))
      )
    );
  }
  createBody(ctx, module2, stack) {
    this.createMemebers(ctx, stack);
  }
  createInherit(ctx, module2, stack = null) {
    let inherit = module2.inherit;
    if (inherit) {
      ctx.addDepend(inherit, stack.module);
      if (ctx.isActiveModule(inherit, stack.module)) {
        this.inherit = ctx.createIdentifier(
          ctx.getModuleReferenceName(inherit, module2),
          stack.inherit
        );
      }
    }
    if (!this.inherit) {
      const inherit2 = import_Namespace19.default.globals.get("Enumeration");
      ctx.addDepend(inherit2, stack.module);
      this.inherit = ctx.createIdentifier(
        ctx.getModuleReferenceName(inherit2, module2)
      );
    }
  }
  createMemebers(ctx, stack) {
    let methods7 = this.methods;
    stack.properties.forEach((item) => {
      const child = this.createMemeber(ctx, item);
      if (child) {
        methods7.push(child);
      }
    });
    super.createMemebers(ctx, stack);
  }
};
var EnumBuilder_default2 = EnumBuilder2;

// lib/tokens/EnumDeclaration.js
function EnumDeclaration_default2(ctx, stack) {
  const builder = new EnumBuilder_default2(stack);
  if (stack.isExpression) {
    return builder.createEnumExpression(ctx);
  } else {
    return builder.create(ctx);
  }
}

// lib/tokens/EnumProperty.js
var import_Utils28 = __toESM(require("easescript/lib/core/Utils"));
init_Common2();
function EnumProperty_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  node.key = ctx.createToken(stack.key);
  node.init = ctx.createToken(stack.init);
  node.comments = createCommentsNode(ctx, stack, node);
  node.modifier = ctx.createIdentifier(import_Utils28.default.getModifierValue(stack) || "public");
  return node;
}

// lib/tokens/ExportAllDeclaration.js
function ExportAllDeclaration_default2(ctx, stack) {
  if (stack.getResolveJSModule() || !stack.source) {
    return null;
  }
  let source = stack.source.value();
  const compilation = stack.getResolveCompilation();
  if (compilation && compilation.stack) {
    ctx.addDepend(compilation);
    source = ctx.getModuleImportSource(stack.getResolveFile(), stack.compilation.file);
  } else {
    source = ctx.getModuleImportSource(source, stack.compilation.file);
  }
  let importSource = ctx.getImport(source, true);
  if (!importSource) {
    importSource = ctx.addImport(source, null, "*");
    importSource.setExportSource();
    importSource.setSourceTarget(compilation);
  }
  ctx.addExport(stack.exported ? stack.exported.value() : null, "*", importSource, stack);
}

// lib/tokens/ExportAssignmentDeclaration.js
function ExportAssignmentDeclaration_default(ctx, stack) {
  let declaration = ctx.createToken(stack.expression);
  if (declaration) {
    ctx.addExport("default", declaration, null, stack);
  }
}

// lib/tokens/ExportDefaultDeclaration.js
function ExportDefaultDeclaration_default2(ctx, stack) {
  let declaration = ctx.createToken(stack.declaration);
  if (declaration) {
    ctx.addExport("default", declaration, null, stack);
  }
}

// lib/tokens/ExportNamedDeclaration.js
function ExportNamedDeclaration_default2(ctx, stack) {
  if (stack.getResolveJSModule()) {
    return null;
  }
  let exportSource = null;
  if (stack.declaration) {
    const decl = stack.declaration;
    if (decl.isVariableDeclaration) {
      let decls = decl.declarations.map((decl2) => decl2.id.value());
      exportSource = ctx.addExport(decls.shift(), ctx.createToken(decl), null, decl);
      exportSource.bindExport(decls);
    } else if (decl.isFunctionDeclaration) {
      exportSource = ctx.addExport(decl.key.value(), ctx.createToken(decl), null, decl);
    } else {
      throw new Error(`Export declaration type only support 'var' or 'function'`);
    }
  } else if (stack.specifiers && stack.specifiers.length > 0) {
    let source = null;
    if (stack.source) {
      source = stack.source.value();
      let compilation = stack.getResolveCompilation();
      if (compilation && compilation.stack) {
        ctx.addDepend(compilation);
        source = ctx.getModuleImportSource(stack.getResolveFile(), stack.compilation.file);
      } else {
        source = ctx.getModuleImportSource(source, stack.compilation.file);
      }
      let importSource = ctx.getImport(source);
      if (!importSource) {
        importSource = ctx.addImport(source);
        importSource.setExportSource();
        importSource.setSourceTarget(compilation);
      }
      source = importSource;
    }
    stack.specifiers.forEach((spec) => {
      let exported = spec.exported || spec.local;
      exportSource = ctx.addExport(exported.value(), spec.local.value(), source, spec);
    });
  }
  if (exportSource) {
    exportSource.stack = stack;
  }
}

// lib/tokens/ExportSpecifier.js
function ExportSpecifier_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  node.exported = ctx.createToken(stack.exported);
  node.local = ctx.createToken(stack.local);
  return node;
}

// lib/tokens/ExpressionStatement.js
function ExpressionStatement_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  node.expression = ctx.createToken(stack.expression);
  return node;
}

// lib/tokens/ForInStatement.js
function ForInStatement_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  node.right = ctx.createToken(stack.right);
  const type = stack.right.type();
  if (type.isAnyType || type.toString() === "string") {
    node.right = transforms_default.get("Object").keys(stack, ctx, null, [node.right], true, false);
    node.value = ctx.createToken(stack.left);
  } else {
    node.left = ctx.createToken(stack.left);
  }
  node.body = ctx.createToken(stack.body);
  return node;
}

// lib/tokens/ForOfStatement.js
var import_Namespace20 = __toESM(require("easescript/lib/core/Namespace"));
var import_Utils29 = __toESM(require("easescript/lib/core/Utils"));
init_Common2();
function createConditionNode(ctx, obj, refs) {
  const assignment = ctx.createAssignmentPattern(
    ctx.createVarIdentifier(refs),
    createExpressionTransformTypeNode(ctx, "object", ctx.createCallExpression(
      ctx.createMemberExpression([
        ctx.createVarIdentifier(obj),
        ctx.createIdentifier("next")
      ])
    ))
  );
  const init = ctx.createVarIdentifier(obj);
  const next = ctx.createParenthesizedExpression(assignment);
  const done = ctx.createUnaryExpression(
    ctx.createMemberExpression([
      ctx.createVarIdentifier(refs),
      ctx.createIdentifier("done")
    ]),
    "!",
    true
  );
  const left = ctx.createLogicalExpression(init, next);
  return ctx.createLogicalExpression(left, done);
}
function createAddressRefsNode2(addressRefObject, ctx, desc2, value, stack) {
  const index = addressRefObject.add(stack);
  const name = addressRefObject.getName(desc2);
  const left = addressRefObject.createIndexName(stack, desc2);
  const key = ctx.createAssignmentExpression(
    ctx.createVarIdentifier(left),
    ctx.createLiteral(index)
  );
  key.computed = true;
  ctx.addVariableRefs(stack, left);
  return ctx.createAssignmentExpression(
    ctx.createVarIdentifier(name),
    ctx.createObjectExpression([
      ctx.createProperty(key, value)
    ])
  );
}
function ForOfStatement_default2(ctx, stack) {
  let type = stack.right.type();
  if (!(type.isLiteralArrayType || type.isTupleType || type === import_Namespace20.default.globals.get("array") || ctx.isArrayMappingType(import_Utils29.default.getOriginType(type)))) {
    let node2 = ctx.createNode(stack, "ForStatement");
    let isIterableIteratorType = import_Utils29.default.isIterableIteratorType(type, import_Namespace20.default.globals.get("Iterator"));
    let declDesc = stack.left.isVariableDeclaration ? stack.left.declarations[0] : null;
    let init = ctx.createToken(stack.left);
    let obj = ctx.getLocalRefName(stack, "_o");
    let res = ctx.getLocalRefName(stack, "_v");
    let object = ctx.createAssignmentExpression(
      ctx.createVarIdentifier(obj),
      isIterableIteratorType ? ctx.createToken(stack.right) : ctx.createCallExpression(
        createStaticReferenceNode2(ctx, stack, "System", "getIterator"),
        [
          ctx.createToken(stack.right)
        ]
      )
    );
    let rewind = ctx.createCallExpression(
      ctx.createMemberExpression([
        ctx.createVarIdentifier(obj),
        ctx.createIdentifier("rewind")
      ])
    );
    let decl = init.declarations[0];
    init.declarations = [object, rewind];
    let isAddress = false;
    if (decl.type === "AddressReferenceExpression") {
      isAddress = true;
      decl = decl.argument;
    }
    let condition = createConditionNode(ctx, obj, res);
    let assignment = null;
    let forValue = ctx.createMemberExpression([
      ctx.createVarIdentifier(res),
      ctx.createIdentifier("value")
    ]);
    let address = ctx.getAssignAddressRef(declDesc);
    if (address) {
      forValue = ctx.creaateAddressRefsNode(forValue);
      assignment = ctx.createExpressionStatement(
        createAddressRefsNode2(address, ctx, declDesc, forValue, stack)
      );
    } else {
      if (isAddress) {
        forValue = createAddressRefsNode(ctx, forValue);
      }
      assignment = ctx.createExpressionStatement(
        ctx.createAssignmentExpression(
          ctx.createVarIdentifier(decl.id.value),
          forValue
        )
      );
    }
    node2.init = init;
    node2.condition = condition;
    node2.update = null;
    node2.body = ctx.createToken(stack.body);
    if (stack.body.isBlockStatement) {
      node2.body.body.splice(0, 0, assignment);
    } else {
      const block = ctx.createNode("BlockStatement");
      block.body = [
        assignment,
        node2.body
      ];
      node2.body = block;
    }
    return node2;
  }
  let node = ctx.createNode(stack);
  node.left = ctx.createToken(stack.left);
  node.right = ctx.createToken(stack.right);
  node.body = ctx.createToken(stack.body);
  return node;
}

// lib/tokens/ForStatement.js
function ForStatement_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  node.init = ctx.createToken(stack.init);
  node.condition = ctx.createToken(stack.condition);
  node.update = ctx.createToken(stack.update);
  node.body = ctx.createToken(stack.body);
  return node;
}

// lib/tokens/FunctionDeclaration.js
function FunctionDeclaration_default2(ctx, stack, type) {
  const node = FunctionExpression_default2(ctx, stack, type);
  if (type === "FunctionDeclaration") {
    node.type = "FunctionExpression";
    let _node = ctx.createExpressionStatement(
      ctx.createAssignmentExpression(
        ctx.createVarIdentifier(stack.key.value(), stack.key),
        node
      )
    );
    _node.isFunctionDeclaration = true;
    _node.key = stack.key.value();
    return _node;
  }
  if (stack.isConstructor) {
    node.key = ctx.createIdentifier("__construct", stack.key);
  } else if (stack.key) {
    node.key = ctx.createIdentifier(stack.key.value(), stack.key);
  }
  return node;
}

// lib/tokens/Identifier.js
var import_Utils30 = __toESM(require("easescript/lib/core/Utils"));
init_Common2();
var globals2 = ["String", "Number", "Boolean", "Object", "Array"];
function Identifier_default2(ctx, stack) {
  if (!stack.parentStack.isMemberExpression) {
    let isRefs = true;
    if (stack.parentStack.isCallExpression || stack.parentStack.isNewExpression) {
      isRefs = stack.parentStack.callee !== stack;
    }
    if (isRefs) {
      if (stack.value() === "arguments") {
        return ctx.createCallExpression(ctx.createIdentifier("func_get_args"));
      } else if (stack.value() === "undefined") {
        return ctx.createLiteral(null);
      }
    }
  }
  let desc2 = null;
  if (stack.parentStack.isMemberExpression) {
    if (stack.parentStack.object === stack) {
      desc2 = stack.description();
    }
  } else {
    desc2 = stack.description();
  }
  if (desc2 && desc2.isImportDeclaration) {
    desc2 = desc2.description();
  }
  if (desc2 && (desc2.isPropertyDefinition || desc2.isMethodDefinition || desc2.isEnumProperty) && !(stack.parentStack.isProperty && stack.parentStack.key === stack)) {
    const ownerModule = desc2.module;
    const isStatic = !!(desc2.static || ownerModule.static || desc2.isEnumProperty);
    const inMember = stack.parentStack.isMemberExpression;
    let propertyName = stack.value();
    if (!inMember && (desc2.isMethodGetterDefinition || desc2.isMethodSetterDefinition)) {
      propertyName = ctx.getAccessorName(stack.value(), desc2, desc2.isMethodGetterDefinition ? "get" : "set");
    }
    let propertyNode = null;
    if (isStatic) {
      propertyNode = ctx.createStaticMemberExpression([
        ctx.createIdentifier(ctx.getModuleReferenceName(ownerModule, stack.module)),
        ctx.createIdentifier(propertyName, stack)
      ]);
    } else {
      propertyNode = ctx.createMemberExpression([
        ctx.createThisExpression(),
        ctx.createIdentifier(propertyName, stack)
      ]);
    }
    if (!inMember && !stack.parentStack.isAssignmentExpression && desc2.isMethodGetterDefinition) {
      return ctx.createCallExpression(propertyNode);
    }
    return propertyNode;
  }
  if (import_Utils30.default.isTypeModule(desc2)) {
    if (desc2 !== stack.module && stack.value() !== "arguments") {
      ctx.addDepend(desc2);
    }
    if (stack.parentStack.isMemberExpression && stack.parentStack.object === stack || stack.parentStack.isNewExpression && !globals2.includes(desc2.getName()) || stack.parentStack.isBinaryExpression && stack.parentStack.right === stack && stack.parentStack.node.operator === "instanceof") {
      if (!stack.hasLocalDefined()) {
        return ctx.createIdentifier(ctx.getModuleReferenceName(desc2, stack.module), stack);
      } else {
        return ctx.createIdentifier(stack.value(), stack);
      }
    } else {
      return createClassRefsNode(ctx, desc2, stack);
    }
  }
  let isDeclarator = desc2 && (desc2.isDeclarator || desc2.isProperty && (desc2.parentStack.isObjectPattern || desc2.parentStack.isObjectExpression));
  if (isDeclarator) {
    if (desc2.parentStack.isImportDeclaration && stack.compilation.mainModule && stack.module) {
      return ctx.createCallExpression(
        createStaticReferenceNode2(ctx, stack, "System", "getScopeVariable"),
        [
          ctx.createLiteral(createUniqueHashId(stack.compilation.file)),
          ctx.createLiteral(stack.value())
        ]
      );
    } else if (desc2.parentStack.isAnnotationDeclaration) {
      const annotation = desc2.parentStack;
      const name = annotation.name.toLowerCase();
      if (name === "require" || name === "import" || name === "embed") {
        const argument = annotation.getArguments().find((item) => !!item.resolveFile);
        if (argument) {
          const asset = ctx.assets.getAsset(argument.resolveFile);
          if (asset) {
            return ctx.createCallExpression(
              createStaticReferenceNode2(ctx, stack, "asset.Files", "get"),
              [
                ctx.createLiteral(asset.sourceId)
              ]
            );
          }
        }
      }
      return ctx.createLiteral(null);
    } else {
      ctx.addVariableRefs(stack, desc2);
    }
  } else if (desc2 && (desc2.isFunctionDeclaration || desc2.isDeclaratorVariable)) {
    isDeclarator = true;
    if (desc2.isDeclaratorVariable) {
      if (desc2.kind === "const") {
        isDeclarator = false;
      }
    }
  }
  if (stack.parentStack.isNewExpression) {
    if (!desc2 || !(desc2.isDeclaratorVariable || isDeclarator)) {
      return ctx.createLiteral(stack.raw());
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
    isDeclarator = true;
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
        const index = assignAddress.createIndexName(stack, desc2);
        if (index) {
          return ctx.createComputeMemberExpression([
            ctx.createVarIdentifier(name),
            ctx.createVarIdentifier(index)
          ]);
        }
      }
    }
  }
  if (isDeclarator) {
    return ctx.createVarIdentifier(stack.value(), stack);
  }
  return ctx.createIdentifier(stack.value(), stack);
}

// lib/tokens/IfStatement.js
init_Common2();
function IfStatement_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  node.condition = createExpressionTransformBooleanValueNode(ctx, stack.condition);
  node.consequent = ctx.createToken(stack.consequent);
  node.alternate = ctx.createToken(stack.alternate);
  return node;
}

// lib/tokens/ImportDeclaration.js
init_Common2();
function ImportDeclaration_default2(ctx, stack) {
  let module2 = stack.additional ? stack.additional.module : null;
  parseImportDeclaration(ctx, stack, module2 || stack.compilation);
  return null;
}

// lib/tokens/ImportDefaultSpecifier.js
function ImportDefaultSpecifier_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  node.local = stack.local ? ctx.createToken(stack.local) : ctx.createIdentifier(stack.value(), stack);
  return node;
}

// lib/tokens/ImportExpression.js
function ImportExpression_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  const desc2 = stack.description();
  if (desc2) {
    const source = ctx.getModuleImportSource(desc2, stack.compilation.file, stack.source.value());
    node.source = ctx.createLiteral(source, void 0, stack.source);
  } else {
    node.source = ctx.createToken(stack.source);
  }
  return node;
}

// lib/tokens/ImportNamespaceSpecifier.js
function ImportNamespaceSpecifier_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  node.local = stack.local ? ctx.createToken(stack.local) : ctx.createIdentifier(stack.value(), stack);
  return node;
}

// lib/tokens/ImportSpecifier.js
function ImportSpecifier_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  node.imported = ctx.createToken(stack.imported);
  node.local = stack.local ? ctx.createToken(stack.local) : ctx.createIdentifier(stack.value(), stack);
  return node;
}

// lib/core/InterfaceBuilder.js
var import_crypto5 = require("crypto");
var InterfaceBuilder2 = class {
  constructor(stack) {
    this.stack = stack;
    this.compilation = stack.compilation;
    this.module = stack.module;
    this.body = [];
    this.methods = [];
    this.members = [];
    this.implements = [];
    this.inherit = null;
  }
  create(ctx) {
    let node = ctx.createNode("InterfaceDeclaration");
    ctx.setNode(this.stack, this);
    const module2 = this.module;
    const stack = this.stack;
    this.createInherit(ctx, module2, stack);
    this.createImplements(ctx, module2, stack);
    this.createBody(ctx, module2, stack);
    node.id = ctx.createIdentifier(module2.id);
    node.inherit = this.inherit;
    node.implements = this.implements;
    node.body = ctx.createBlockStatement([
      ...this.methods,
      ...this.members
    ]);
    ctx.removeNode(this.stack);
    return node;
  }
  createBody(ctx, module2, stack) {
    this.createMemebers(ctx, stack);
  }
  createInherit(ctx, module2, stack = null) {
    let inherit = module2.inherit;
    if (inherit) {
      ctx.addDepend(inherit, module2);
      if (ctx.isActiveModule(inherit, module2)) {
        this.inherit = ctx.createIdentifier(
          ctx.getModuleReferenceName(inherit, module2)
        );
      }
    }
  }
  createImplements(ctx, module2, stack = null) {
    this.implements = module2.implements.map((impModule) => {
      ctx.addDepend(impModule, module2);
      if (impModule.isInterface && ctx.isActiveModule(impModule, module2)) {
        return ctx.createIdentifier(
          ctx.getModuleReferenceName(impModule, module2)
        );
      }
      return null;
    }).filter(Boolean);
  }
  getHashId(len = 8) {
    let moduleHashId = this._moduleHashId;
    if (!moduleHashId) {
      const name = this.module.getName();
      const file = this.compilation.file;
      this._moduleHashId = moduleHashId = (0, import_crypto5.createHash)("sha256").update(`${file}:${name}`).digest("hex").substring(0, len);
    }
    return moduleHashId;
  }
  checkConstructor(ctx, construct, module2) {
  }
  createMemebers(ctx, stack) {
    stack.body.forEach((item) => {
      const child = this.createMemeber(ctx, item, !!stack.static);
      if (!child)
        return;
      child.isInterfaceMember = true;
      const staticFlag = !!(stack.static || child.static);
      const refs = staticFlag ? this.methods : this.members;
      if (item.isConstructor && item.isMethodDefinition) {
        this.construct = child;
      } else {
        refs.push(child);
      }
    });
  }
  createMemeber(ctx, stack, staticFlag = false) {
    return ctx.createToken(stack);
  }
};
var InterfaceBuilder_default2 = InterfaceBuilder2;

// lib/tokens/InterfaceDeclaration.js
function InterfaceDeclaration_default2(ctx, stack) {
  const builder = new InterfaceBuilder_default2(stack);
  return builder.create(ctx);
}

// lib/tokens/JSXAttribute.js
var import_Namespace21 = __toESM(require("easescript/lib/core/Namespace"));
init_Common2();
function JSXAttribute_default2(ctx, stack) {
  let ns = null;
  if (stack.hasNamespaced) {
    const xmlns = stack.getXmlNamespace();
    if (xmlns) {
      ns = xmlns.value.value();
    } else {
      const nsStack = stack.getNamespaceStack();
      const ops2 = stack.compiler.options;
      ns = ops2.jsx.xmlns.default[nsStack.namespace.value()] || ns;
    }
  }
  const node = ctx.createNode(stack);
  node.namespace = ns;
  let name = null;
  let value = stack.value ? ctx.createToken(stack.value) : ctx.createLiteral(true);
  if (stack.isMemberProperty) {
    const eleClass = stack.jsxElement.getSubClassDescription();
    const propsDesc = stack.getAttributeDescription(eleClass);
    const resolveName = getMethodOrPropertyAlias(ctx, propsDesc);
    if (resolveName) {
      name = resolveName.includes("-") ? ctx.createLiteral(resolveName) : ctx.createIdentifier(resolveName);
    }
    const invoke = createJSXAttrHookNode(ctx, stack, propsDesc);
    if (invoke)
      value = invoke;
  }
  if (!name) {
    name = ctx.createToken(stack.name);
  }
  if (ns === "@binding" && stack.value) {
    const desc2 = stack.value.description();
    let has = false;
    if (desc2) {
      has = (desc2.isPropertyDefinition || desc2.isTypeObjectPropertyDefinition) && !desc2.isReadonly || desc2.isMethodGetterDefinition && desc2.module && desc2.module.getMember(desc2.key.value(), "set");
    }
    if (!has && stack.value.isJSXExpressionContainer) {
      let expression2 = stack.value.expression;
      if (expression2) {
        if (expression2.isTypeAssertExpression) {
          expression2 = expression2.left;
        }
        if (expression2.isMemberExpression) {
          const objectType = import_Namespace21.default.globals.get("Object");
          has = objectType && objectType.is(expression2.object.type());
        }
      }
    }
    if (!has) {
      stack.value.error(1e4, stack.value.raw());
    }
  }
  node.name = name;
  node.value = value;
  return node;
}

// lib/tokens/JSXCdata.js
function JSXCdata_default2(ctx, stack) {
  let value = stack.value();
  if (value) {
    value = value.replace(/[\r\n]+/g, "").replace(/\u0022/g, '\\"');
    if (value) {
      return ctx.createLiteral(value);
    }
  }
  return null;
}

// lib/tokens/JSXClosingElement.js
function JSXClosingElement_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  node.name = ctx.createToken(stack.name);
  return node;
}

// lib/tokens/JSXClosingFragment.js
function JSXClosingFragment_default2(ctx, stack) {
  return ctx.createNode(stack);
}

// lib/core/ESX.js
var import_Namespace22 = __toESM(require("easescript/lib/core/Namespace"));
var import_Utils31 = require("easescript/lib/core/Utils");
init_Common2();
function createFragmentVNode2(ctx, children, props = null) {
  const items = [
    ctx.getVNodeApi("Fragment"),
    props ? props : ctx.createLiteral(null),
    children
  ];
  return ctx.createCallExpression(
    ctx.getVNodeApi("createVNode"),
    items
  );
}
function createWithDirectives2(ctx, node, directives) {
  const array = ctx.createArrayExpression(directives);
  array.newLine = true;
  return ctx.createCallExpression(
    ctx.createIdentifier(
      ctx.getVNodeApi("withDirectives")
    ),
    [
      node,
      array
    ]
  );
}
function createCommentVNode2(ctx, text) {
  return ctx.createCallExpression(
    ctx.createIdentifier(ctx.getVNodeApi("createCommentVNode")),
    [
      ctx.createLiteral(text)
    ]
  );
}
function createSlotNode2(ctx, stack, ...args) {
  if (stack.isSlot && stack.isSlotDeclared) {
    const slots = ctx.createCallExpression(
      ctx.createMemberExpression([
        ctx.createThisExpression(),
        ctx.createIdentifier("getAttribute")
      ]),
      [
        ctx.createLiteral("slots")
      ]
    );
    const node = ctx.createCallExpression(
      ctx.createIdentifier(
        ctx.getVNodeApi("renderSlot")
      ),
      [slots].concat(args)
    );
    node.isSlotNode = true;
    return node;
  } else {
    const node = ctx.createCallExpression(
      ctx.createIdentifier(ctx.getVNodeApi("withCtx")),
      args
    );
    node.isSlotNode = true;
    return node;
  }
}
function createWithCtxNode2(ctx, node) {
  return ctx.createCallExpression(
    ctx.createIdentifier(ctx.getVNodeApi("withCtx")),
    [
      node
    ]
  );
}
function createForMapNode2(ctx, object, element, item, key, index, stack) {
  const params = [item];
  if (key) {
    params.push(key);
  }
  if (index) {
    params.push(index);
  }
  if (element.type === "ArrayExpression" && element.elements.length === 1) {
    element = element.elements[0];
  }
  const node = ctx.createArrowFunctionExpression(element, params);
  return ctx.createCallExpression(
    createStaticReferenceNode2(ctx, stack, "System", "forMap"),
    [
      object,
      node
    ]
  );
}
function createForEachNode2(ctx, refs, element, item, key) {
  const args = [item];
  if (key) {
    args.push(key);
  }
  if (element.type === "ArrayExpression" && element.elements.length === 1) {
    element = element.elements[0];
  }
  const node = ctx.createCallExpression(
    ctx.createMemberExpression([
      refs,
      ctx.createIdentifier("map")
    ]),
    [
      ctx.createArrowFunctionExpression(element, args)
    ]
  );
  if (element.type === "ArrayExpression") {
    return ctx.createCallExpression(
      ctx.createMemberExpression([
        node,
        ctx.createIdentifier("reduce")
      ]),
      [
        ctx.createArrowFunctionExpression([
          ctx.createIdentifier("acc"),
          ctx.createIdentifier("item")
        ], ctx.createCallee(
          ctx.createMemberExpression([
            ctx.createIdentifier("acc"),
            ctx.createIdentifier("concat")
          ]),
          [
            ctx.createIdentifier("item")
          ]
        )),
        ctx.createArrayExpression()
      ]
    );
  }
  return node;
}
function getComponentDirectiveAnnotation2(module2) {
  if (!(0, import_Utils31.isModule)(module2))
    return null;
  const annots = getModuleAnnotations(module2, ["define"]);
  for (let annot of annots) {
    const args = annot.getArguments();
    if (compare(getAnnotationArgumentValue(args[0]), "directives")) {
      if (args.length > 1) {
        return [module2, getAnnotationArgumentValue(args[1]), annot];
      } else {
        return [module2, desc.getName("-"), annot];
      }
    }
  }
  return null;
}
var directiveInterface2 = null;
function isDirectiveInterface2(module2) {
  if (!(0, import_Utils31.isModule)(module2))
    return false;
  directiveInterface2 = directiveInterface2 || import_Namespace22.default.globals.get("web.components.Directive");
  if (directiveInterface2 && directiveInterface2.isInterface) {
    return directiveInterface2.type().isof(module2);
  }
  return false;
}
function getComponentEmitAnnotation2(module2) {
  if (!(0, import_Utils31.isModule)(module2))
    return null;
  const dataset = /* @__PURE__ */ Object.create(null);
  const annots = getModuleAnnotations(desc, ["define"]);
  annots.forEach((annot) => {
    const args = annot.getArguments();
    if (args.length > 1) {
      let value = getAnnotationArgumentValue(args[0]);
      let _args = args;
      let _key = null;
      let isEmits = compare(value, "emits");
      let isOptions = compare(value, "options");
      if (isEmits) {
        _args = args.slice(1);
        _key = "emits";
      } else if (isOptions) {
        _args = args.slice(2);
        _key = getAnnotationArgumentValue(args[1]);
      }
      _key = String(_key).toLowerCase();
      if (_key === "emits") {
        let skip = _args.length > 1 ? _args[_args.length - 1] : null;
        if (skip && skip.assigned && String(skip.key).toLowerCase() === "type") {
          if (skip.value !== "--literal") {
            skip = null;
          }
        } else {
          skip = null;
        }
        _args.forEach((arg) => {
          if (arg === skip || !arg)
            return;
          if (arg.assigned) {
            dataset[arg.key] = arg.value;
          } else {
            dataset[arg.value] = arg.value;
          }
        });
      }
    }
  });
  return dataset;
}
function createChildNode2(ctx, stack, childNode, prev = null) {
  if (!childNode)
    return null;
  const cmd = [];
  let content = [childNode];
  if (!stack.directives || !(stack.directives.length > 0)) {
    return {
      cmd,
      child: stack,
      content
    };
  }
  const directives = stack.directives.slice(0).sort((a, b) => {
    const bb = b.name.value().toLowerCase();
    const aa = a.name.value().toLowerCase();
    const v1 = bb === "each" || bb === "for" ? 1 : 0;
    const v2 = aa === "each" || aa === "for" ? 1 : 0;
    return v1 - v2;
  });
  while (directives.length > 0) {
    const directive = directives.shift();
    const name = directive.name.value().toLowerCase();
    const valueArgument = directive.valueArgument;
    if (name === "each" || name === "for") {
      let refs = ctx.createToken(valueArgument.expression);
      let item = ctx.createIdentifier(valueArgument.declare.item);
      let key = ctx.createIdentifier(valueArgument.declare.key || "key");
      let index = valueArgument.declare.index;
      if (index) {
        index = ctx.createIdentifier(index);
      }
      if (name === "each") {
        content[0] = createForEachNode2(
          ctx,
          refs,
          content[0],
          item,
          key
        );
      } else {
        content[0] = createForMapNode2(
          ctx,
          refs,
          content[0],
          item,
          key,
          index,
          stack
        );
      }
      content[0].isForNode = true;
      cmd.push(name);
    } else if (name === "if") {
      const node = ctx.createNode("ConditionalExpression");
      node.test = ctx.createToken(valueArgument.expression);
      node.consequent = content[0];
      content[0] = node;
      cmd.push(name);
    } else if (name === "elseif") {
      if (!prev || !(prev.cmd.includes("if") || prev.cmd.includes("elseif"))) {
        directive.name.error(1114, name);
      } else {
        cmd.push(name);
      }
      const node = ctx.createNode("ConditionalExpression");
      node.test = ctx.createToken(valueArgument.expression);
      node.consequent = content[0];
      content[0] = node;
    } else if (name === "else") {
      if (!prev || !(prev.cmd.includes("if") || prev.cmd.includes("elseif"))) {
        directive.name.error(1114, name);
      } else {
        cmd.push(name);
      }
    }
  }
  return {
    cmd,
    child: stack,
    content
  };
}
function createSlotCalleeNode2(ctx, stack, child, ...args) {
  if (stack.isSlotDeclared) {
    return ctx.createCallExpression(
      ctx.createMemberExpression([
        ctx.createThisExpression(),
        ctx.createIdentifier("slot")
      ]),
      child ? args.concat(child) : args,
      stack
    );
  } else {
    return child || ctx.createArrowFunctionExpression(ctx.createArrayExpression());
  }
}
function getCascadeConditional2(elements) {
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
function createChildren2(ctx, children, data) {
  let content = [];
  let len = children.length;
  let index = 0;
  let last = null;
  let result = null;
  let next = () => {
    if (index < len) {
      const child = children[index++];
      const childNode = createChildNode2(
        ctx,
        child,
        ctx.createToken(child),
        last
      ) || next();
      if (child.hasAttributeSlot) {
        const attributeSlot = child.openingElement.attributes.find((attr) => attr.isAttributeSlot);
        if (attributeSlot) {
          const name = attributeSlot.name.value();
          const scopeName = attributeSlot.value ? ctx.createToken(
            attributeSlot.parserSlotScopeParamsStack()
          ) : null;
          let childrenNodes = childNode.content;
          if (childrenNodes.length === 1 && childrenNodes[0].type === "ArrayExpression") {
            childrenNodes = childrenNodes[0];
          } else {
            childrenNodes = ctx.createArrayExpression(childrenNodes);
          }
          const params = scopeName ? [
            ctx.createAssignmentExpression(
              scopeName,
              ctx.createObjectExpression()
            )
          ] : [];
          const renderSlots = createSlotCalleeNode2(
            ctx,
            child,
            ctx.createArrowFunctionExpression(childrenNodes, params)
          );
          data.slots[name] = renderSlots;
          return next();
        }
      } else if (child.isSlot && !child.isSlotDeclared) {
        const name = child.openingElement.name.value();
        data.slots[name] = childNode.content[0];
        return next();
      } else if (child.isDirective) {
        childNode.cmd.push(
          child.openingElement.name.value().toLowerCase()
        );
      }
      return childNode;
    }
    return null;
  };
  const push = (data2, value) => {
    if (value) {
      if (Array.isArray(value)) {
        data2.push(...value);
      } else {
        data2.push(value);
      }
    }
  };
  let hasComplex = false;
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
          value = getCascadeConditional2(last.content.concat(result.content));
          result.ifEnd = true;
        } else {
          if (result)
            result.ifEnd = true;
          last.content.push(createCommentVNode2("end if"));
          value = getCascadeConditional2(last.content);
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
    let first = content[0];
    if (content.length === 1 && (first.type == "ArrayExpression" || first.isForNode || first.isSlotNode)) {
      return first;
    }
    let base = content.length > 1 ? content.shift() : ctx.createArrayExpression();
    if (base.type !== "ArrayExpression" && !base.isForNode) {
      base = ctx.createArrayExpression([base]);
      base.newLine = true;
    }
    const node2 = ctx.createCallExpression(
      ctx.createMemberExpression([
        base,
        ctx.createIdentifier("concat")
      ]),
      content.reduce(function(acc, val) {
        if (val.type === "ArrayExpression") {
          return acc.concat(...val.elements);
        } else {
          return acc.concat(val);
        }
      }, [])
    );
    node2.newLine = true;
    node2.indentation = true;
    return node2;
  }
  const node = ctx.createArrayExpression(content);
  if (content.length > 1 || !(content[0].type === "Literal" || content[0].type === "Identifier")) {
    node.newLine = true;
  }
  return node;
}
function createGetEventValueNode2(ctx, name = "e") {
  return ctx.createCallExpression(
    ctx.createMemberExpression([
      ctx.createThisExpression(),
      ctx.createIdentifier("getBindEventValue")
    ]),
    [
      ctx.createIdentifier(name)
    ]
  );
}
function createDirectiveArrayNode2(ctx, name, expression2, ...args) {
  const elems = [
    ctx.createIdentifier(ctx.getVNodeApi(name)),
    expression2,
    ...args
  ];
  return ctx.createArrayExpression(elems);
}
function createResolveAttriubeDirective2(ctx, attrDirective) {
  if (!attrDirective.value)
    return;
  return ctx.createCallExpression(
    createStaticReferenceNode2(ctx, attrDirective, "web.components.Component", "resolveDirective"),
    [
      ctx.createToken(attrDirective.parserAttributeValueStack()),
      attrDirective.module ? ctx.createThisExpression() : ctx.createLiteral(null)
    ]
  );
}
function createAttributeBindingEventNode2(ctx, attribute, valueTokenNode) {
  if (attribute.value.isJSXExpressionContainer) {
    const expr = attribute.value.expression;
    if (expr.isAssignmentExpression || expr.isSequenceExpression) {
      return ctx.createArrowFunctionExpression(valueTokenNode);
    } else if (!expr.isFunctionExpression) {
      if (expr.isCallExpression) {
        const isBind = expr.callee.isMemberExpression && expr.callee.property.value() === "bind" && expr.arguments.length > 0 && expr.arguments[0].isThisExpression;
        if (!isBind && valueTokenNode && valueTokenNode.type === "CallExpression") {
          valueTokenNode.arguments.push(ctx.createIdentifier("...args"));
          return ctx.createArrowFunctionExpression(
            valueTokenNode,
            [
              ctx.createIdentifier("...args")
            ]
          );
        }
      } else if (expr.isMemberExpression || expr.isIdentifier) {
        const desc2 = expr.description();
        const isMethod = desc2 && (desc2.isMethodDefinition && !desc2.isAccessor);
        if (isMethod) {
          return ctx.createCallExpression(
            ctx.createMemberExpression([
              valueTokenNode,
              ctx.createIdentifier("bind")
            ]),
            [ctx.createThisExpression()]
          );
        }
      }
    }
  }
  return valueTokenNode;
}
function getBinddingEventName2(stack) {
  const bindding = getMethodAnnotations(stack, ["bindding"]);
  if (bindding.length > 0) {
    const [annot] = bindding;
    const args = annot.getArguments();
    return getAnnotationArgumentValue(args[0]);
  }
  return null;
}
function mergeElementPropsNode2(ctx, data, stack) {
  const items = [];
  const ssr = !!ctx.options.ssr;
  Object.entries(data).map((item) => {
    const [key, value] = item;
    if (key === "slots" || key === "directives" || key === "keyProps") {
      return;
    }
    if (value) {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          const type = value[0].type;
          const isObject = type === "Property" || type === "SpreadElement";
          if (isObject) {
            if (key === "props" || key === "attrs") {
              items.push(...value);
              return;
            } else if (key === "on") {
              if (ssr)
                return;
              value.forEach((item2) => {
                if (item2.type === "Property") {
                  if (item2.computed) {
                    item2.key = ctx.createTemplateLiteral([
                      ctx.createTemplateElement("on")
                    ], [
                      ctx.createCallExpression(
                        createStaticReferenceNode2(ctx, stack, "System", "firstUpperCase"),
                        [
                          item2.key
                        ]
                      )
                    ]);
                  } else {
                    item2.key.value = "on" + toFirstUpperCase(item2.key.value);
                  }
                  items.push(item2);
                }
              });
              return;
            }
            items.push(
              ctx.createProperty(
                ctx.createIdentifier(key),
                ctx.createObjectExpression(value)
              )
            );
          } else {
            items.push(
              ctx.createProperty(
                ctx.createIdentifier(key),
                ctx.createArrayExpression(value)
              )
            );
          }
        }
      } else {
        if (value.type === "Property") {
          items.push(value);
        } else {
          items.push(
            ctx.createProperty(
              ctx.createIdentifier(key),
              value
            )
          );
        }
      }
    }
  });
  const props = items.length > 0 ? ctx.createObjectExpression(items) : null;
  if (props && stack && stack.isComponent) {
    const desc2 = stack.description();
    if (desc2 && (0, import_Utils31.isModule)(desc2)) {
      let has = getModuleAnnotations(desc2, ["hook"]).some((annot) => {
        let result = parseHookAnnotation(annot, ctx.plugin.version, ctx.options.metadata.versions);
        return result && result.type === "polyfills:props";
      });
      if (has) {
        return createComponentPropsHookNode2(ctx, props, ctx.createLiteral(desc2.getName()));
      }
    }
  }
  return props;
}
function createComponentPropsHookNode2(ctx, props, className) {
  return ctx.createCallExpression(
    ctx.createMemberExpression([
      ctx.createThisExpression(),
      ctx.createIdentifier("invokeHook")
    ]),
    [
      ctx.createLiteral("polyfills:props"),
      props,
      className
    ]
  );
}
function createAttributes2(ctx, stack, data) {
  const pushEvent = (name, node, category) => {
    let events = data[category] || (data[category] = []);
    if (!Node_default.is(name)) {
      name = String(name);
      name = name.includes(":") ? ctx.createLiteral(name) : ctx.createIdentifier(name);
    }
    let property = ctx.createProperty(name, node);
    if (property.key.computed) {
      property.computed = true;
      property.key.computed = false;
    }
    events.push(property);
  };
  let isComponent = stack.isComponent || stack.isWebComponent;
  let nodeType = !isComponent ? stack.openingElement.name.value().toLowerCase() : null;
  let binddingModelValue = null;
  let afterDirective = null;
  let custom = null;
  if (nodeType === "input") {
    afterDirective = "vModelText";
  } else if (nodeType === "select") {
    afterDirective = "vModelSelect";
  } else if (nodeType === "textarea") {
    afterDirective = "vModelText";
  }
  const forStack = stack.getParentStack((stack2) => {
    return stack2.scope.isForContext || !(stack2.isJSXElement || stack2.isJSXExpressionContainer);
  }, true);
  const inFor = forStack && forStack.scope && forStack.scope.isForContext ? true : false;
  const descModule2 = stack.isWebComponent ? stack.description() : null;
  const definedEmits = getComponentEmitAnnotation2(descModule2);
  const getDefinedEmitName = (name) => {
    if (definedEmits && Object.prototype.hasOwnProperty.call(definedEmits, name)) {
      name = toCamelCase(definedEmits[name]);
    }
    return name;
  };
  stack.openingElement.attributes.forEach((item) => {
    if (item.isAttributeXmlns)
      return;
    if (item.isAttributeDirective) {
      if (item.isAttributeDirective) {
        const name2 = item.name.value();
        if (compare(name2, "show")) {
          data.directives.push(
            createDirectiveArrayNode2(
              ctx,
              "vShow",
              ctx.createToken(item.valueArgument.expression)
            )
          );
        } else if (compare(name2, "custom")) {
          data.directives.push(
            createResolveAttriubeDirective2(
              ctx,
              item
            )
          );
        }
      }
      return;
    } else if (item.isJSXSpreadAttribute) {
      if (item.argument) {
        data.props.push(
          ctx.createSpreadElement(
            ctx.createToken(item.argument),
            item
          )
        );
      }
      return;
    } else if (item.isAttributeSlot) {
      return;
    }
    let value = ctx.createToken(item);
    if (!value)
      return;
    let ns = value.namespace;
    let name = value.name.value;
    let propName = name;
    let propValue = value.value;
    let attrLowerName = name.toLowerCase();
    if (ns === "@events" || ns === "@natives") {
      name = getDefinedEmitName(name);
    }
    if (ns && ns.includes("::")) {
      let [seg, className] = ns.split("::", 2);
      ns = seg;
      name = createStaticReferenceNode2(ctx, item, className, name);
      name.computed = true;
      custom = name;
    }
    let isDOMAttribute = false;
    if (item.isMemberProperty) {
      let attrDesc = item.getAttributeDescription(stack.getSubClassDescription());
      if (attrDesc) {
        isDOMAttribute = getMethodAnnotations(attrDesc, ["domattribute"]).length > 0;
      }
    }
    if (ns === "@events" || ns === "@natives") {
      pushEvent(name, createAttributeBindingEventNode2(item, propValue), "on");
      return;
    } else if (ns === "@binding") {
      binddingModelValue = propValue;
      if (!binddingModelValue || !(binddingModelValue.type === "MemberExpression" || binddingModelValue.type === "Identifier")) {
        binddingModelValue = null;
        if (item.value && item.value.isJSXExpressionContainer) {
          const stack2 = item.value.expression;
          if (stack2 && stack2.isMemberExpression && !stack2.optional) {
            binddingModelValue = ctx.createCallExpression(
              createStaticReferenceNode2(ctx, stack2, "Reflect", "set"),
              [
                stack2.module ? ctx.createIdentifier(stack2.module.id) : ctx.createLiteral(null),
                ctx.createToken(stack2.object),
                stack2.computed ? ctx.createToken(stack2.property) : ctx.createLiteral(stack2.property.value()),
                ctx.createIdentifier("value")
              ],
              stack2
            );
            binddingModelValue.isReflectSetter = true;
          }
        }
      }
    }
    if (item.isMemberProperty) {
      if (ns === "@binding" && attrLowerName === "value") {
        data.props.push(
          ctx.createProperty(
            ctx.createIdentifier(
              propName,
              item.name
            ),
            propValue
          )
        );
        propName = "modelValue";
      }
      if (!isDOMAttribute) {
        data.props.push(
          ctx.createProperty(
            ctx.createIdentifier(
              propName,
              item.name
            ),
            propValue
          )
        );
        if (ns !== "@binding")
          return;
      }
    }
    if (attrLowerName === "type" && nodeType === "input" && propValue && propValue.type === "Literal") {
      const value2 = propValue.value.toLowerCase();
      if (value2 === "checkbox") {
        afterDirective = "vModelCheckbox";
      } else if (value2 === "radio") {
        afterDirective = "vModelRadio";
      }
    }
    if (ns === "@binding") {
      const createBinddingParams = (getEvent = false) => {
        return [
          binddingModelValue.isReflectSetter ? binddingModelValue : ctx.createAssignmentExpression(
            binddingModelValue,
            getEvent ? createGetEventValueNode2(ctx) : ctx.createIdentifier("e")
          ),
          [
            ctx.createIdentifier("e")
          ]
        ];
      };
      if (custom && binddingModelValue) {
        pushEvent(custom, ctx.createArrowFunctionExpression(
          ...createBinddingParams(!stack.isWebComponent)
        ), "on");
      } else if ((stack.isWebComponent || afterDirective) && binddingModelValue) {
        let eventName = propName;
        if (propName === "modelValue") {
          eventName = "update:modelValue";
        }
        if (item.isMemberProperty) {
          let _name = getBinddingEventName2(item.description());
          if (_name) {
            eventName = toCamelCase(_name);
          }
        }
        pushEvent(
          getDefinedEmitName(eventName),
          ctx.createArrowFunctionExpression(
            ...createBinddingParams()
          ),
          "on"
        );
      } else if (binddingModelValue) {
        pushEvent(
          ctx.createIdentifier("input"),
          ctx.createArrowFunctionExpression(
            ...createBinddingParams(true)
          ),
          "on"
        );
      }
      if (afterDirective && binddingModelValue) {
        data.directives.push(
          createDirectiveArrayNode2(ctx, afterDirective, binddingModelValue)
        );
      }
      return;
    }
    if (!ns && (attrLowerName === "ref" || attrLowerName === "refs")) {
      name = propName = "ref";
      let useArray = inFor || attrLowerName === "refs";
      if (useArray) {
        propValue = ctx.createArrowFunctionExpression(
          ctx.createCallExpression(
            ctx.createMemberExpression([
              ctx.createThisExpression(),
              ctx.createIdentifierExpression("setRefNode")
            ]),
            [
              value.value,
              ctx.createIdentifier("node"),
              ctx.createLiteral(true)
            ]
          ),
          [
            ctx.createIdentifier("node")
          ]
        );
      }
    }
    if (name === "class" || name === "staticClass") {
      if (propValue && propValue.type !== "Literal") {
        propValue = ctx.createCallExpression(
          ctx.createIdentifier(
            ctx.getVNodeApi("normalizeClass")
          ),
          [
            propValue
          ]
        );
      }
    } else if (name === "style" || name === "staticStyle") {
      if (propValue && !(propValue.type === "Literal" || propValue.type === "ObjectExpression")) {
        propValue = ctx.createCallExpression(
          ctx.createIdentifier(
            ctx.getVNodeApi("normalizeStyle")
          ),
          [propValue]
        );
      }
    } else if (attrLowerName === "key" || attrLowerName === "tag") {
      name = attrLowerName;
    }
    const property = ctx.createProperty(
      ctx.createIdentifier(
        propName,
        item.name
      ),
      propValue
    );
    switch (name) {
      case "class":
      case "style":
      case "key":
      case "tag":
      case "ref":
        data[name] = property;
        break;
      default:
        data.attrs.push(property);
    }
  });
  if (!data.key) {
    data.key = createElementKeyPropertyNode2(ctx, stack);
  }
}
function createElementKeyPropertyNode2(ctx, stack) {
  const keys2 = ctx.options.esx.complete.keys;
  const fills = Array.isArray(keys2) && keys2.length > 0 ? keys2 : null;
  const all = keys2 === true;
  if (fills || all) {
    let key = null;
    let direName = null;
    let isForContext = false;
    if (all || fills.includes("for") || fills.includes("each")) {
      if (!stack.isDirective && stack.directives && Array.isArray(stack.directives)) {
        let directive = stack.directives.find((directive2) => ["for", "each"].includes(directive2.name.value().toLowerCase()));
        if (directive) {
          isForContext = true;
          direName = directive.name.value().toLowerCase();
          let valueArgument = directive.valueArgument;
          if (valueArgument) {
            key = valueArgument.declare.index || valueArgument.declare.key;
          }
        }
      }
      if (!direName && stack.parentStack.isDirective && ["for", "each"].includes(stack.parentStack.openingElement.name.value())) {
        const attrs = stack.parentStack.openingElement.attributes;
        const argument = {};
        isForContext = true;
        direName = stack.parentStack.openingElement.name.value().toLowerCase();
        attrs.forEach((attr) => {
          argument[attr.name.value()] = attr.value.value();
        });
        key = argument["index"] || argument["key"];
      }
    }
    if (fills && fills.includes("condition")) {
      if (!stack.isDirective && stack.directives && Array.isArray(stack.directives)) {
        let directive = stack.directives.find((directive2) => ["if", "elseif", "else"].includes(directive2.name.value().toLowerCase()));
        if (directive) {
          direName = directive.name.value().toLowerCase();
        }
      }
      if (!isForContext && stack.parentStack.isDirective && ["if", "elseif", "else"].includes(stack.parentStack.openingElement.name.value())) {
        direName = stack.parentStack.openingElement.name.value().toLowerCase();
      }
    }
    if (all || fills.includes(direName)) {
      return ctx.createProperty(
        ctx.createIdentifier("key"),
        isForContext ? ctx.createBinaryExpression(
          ctx.createLiteral(getDepth2(stack) + "."),
          ctx.createIdentifier(key || "key"),
          "+"
        ) : ctx.createLiteral(getDepth2(stack))
      );
    }
  }
}
function createComponentDirectiveProperties2(ctx, stack, data, callback = null) {
  if (stack) {
    let desc2 = stack.description();
    let parentIsComponentDirective = getComponentDirectiveAnnotation2(desc2);
    if (!parentIsComponentDirective) {
      parentIsComponentDirective = isDirectiveInterface2(desc2);
    }
    if (parentIsComponentDirective) {
      let node = createResolveComponentDirective2(ctx, stack, data, callback);
      if (node) {
        data.directives.push(node);
      }
      if (stack.jsxRootElement !== stack) {
        createComponentDirectiveProperties2(ctx, stack.parentStack, data, callback);
      }
      return true;
    }
  }
  return false;
}
function createCustomDirectiveProperties2(ctx, stack, data, callback = null) {
  const node = createResolveComponentDirective2(ctx, stack, data, callback);
  if (node) {
    data.directives.push(node);
  }
  if (stack.parentStack && stack.parentStack.isDirective && stack.jsxRootElement !== stack.parentStack) {
    let dName = stack.parentStack.openingElement.name.value().toLowerCase();
    if (dName === "custom") {
      createCustomDirectiveProperties2(ctx, stack.parentStack, data, callback);
    }
  }
}
function createResolveComponentDirective2(ctx, stack, data, callback = null) {
  const props = [];
  const has = (items, name) => items && items.some((prop) => prop.key.value === name);
  stack.openingElement.attributes.forEach((attr) => {
    if (attr.isAttributeXmlns || attr.isAttributeDirective)
      return;
    const name = attr.name.value();
    const property = ctx.createProperty(
      ctx.createIdentifier(name),
      attr.value ? ctx.createToken(attr.value) : ctx.createLiteral(true)
    );
    if (attr.isMemberProperty) {
      if (!has(data.props, name)) {
        property.isInheritDirectiveProp = true;
        data.props.push(property);
      }
    } else {
      if (!has(data.attrs, name)) {
        property.isInheritDirectiveAttr = true;
        data.attrs.push(property);
      }
    }
    if (callback) {
      callback(property);
    }
  });
  const object = ctx.createObjectExpression(props);
  const node = ctx.createCallExpression(
    createStaticReferenceNode2(ctx, stack, "web.components.Component", "resolveDirective"),
    [
      object,
      ctx.createThisExpression()
    ]
  );
  node.isInheritComponentDirective = true;
  return node;
}
function createSlotElementNode2(ctx, stack, children) {
  const openingElement = ctx.createToken(stack.openingElement);
  const args = [ctx, stack];
  let props = null;
  let params = [];
  if (stack.isSlotDeclared) {
    args.push(ctx.createLiteral(stack.openingElement.name.value()));
    if (openingElement.attributes.length > 0) {
      const properties = openingElement.attributes.map((attr) => {
        return ctx.createProperty(
          attr.name,
          attr.value
        );
      });
      props = ctx.createObjectExpression(properties);
    } else {
      props = ctx.createObjectExpression();
    }
    args.push(props);
  } else if (stack.openingElement.attributes.length > 0) {
    const attribute = stack.openingElement.attributes[0];
    if (attribute.value) {
      const stack2 = attribute.parserSlotScopeParamsStack();
      params.push(
        ctx.createAssignmentExpression(
          ctx.createToken(stack2),
          ctx.createObjectExpression()
        )
      );
    }
  }
  if (children) {
    if (Array.isArray(children) && children.length === 0) {
      children = null;
    } else if (children.type === "ArrayExpression" && children.elements.length === 0) {
      children = null;
    }
    if (children) {
      args.push(ctx.createArrowFunctionExpression(children, params));
    }
  }
  return createSlotNode2(...args);
}
function createDirectiveElementNode2(ctx, stack, children) {
  const openingElement = stack.openingElement;
  const name = openingElement.name.value().toLowerCase();
  switch (name) {
    case "custom":
    case "show":
      return children;
    case "if":
    case "elseif": {
      const condition = ctx.createToken(stack.attributes[0].parserAttributeValueStack());
      const node = ctx.createNode("ConditionalExpression");
      node.test = condition;
      node.consequent = children;
      return node;
    }
    case "else":
      return children;
    case "for":
    case "each": {
      const attrs = stack.openingElement.attributes;
      const argument = {};
      attrs.forEach((attr) => {
        if (attr.name.value() === "name") {
          argument["refs"] = ctx.createToken(attr.parserAttributeValueStack());
        } else {
          argument[attr.name.value()] = ctx.createIdentifier(attr.value.value());
        }
      });
      let item = argument.item || ctx.createIdentifier("item");
      let key = argument.key || ctx.createIdentifier("key");
      let node = name === "for" ? createForMapNode2(ctx, argument.refs, children, item, key, argument.index, stack) : createForEachNode2(ctx, argument.refs, children, item, key);
      node.isForNode = true;
      return node;
    }
  }
  return null;
}
function createHandleNode2(ctx, stack, ...args) {
  let handle = ctx.createIdentifier(
    ctx.getLocalRefName(
      stack,
      ctx.options.esx.handle || "createVNode"
    )
  );
  return ctx.createCallExpression(handle, args);
}
function createElementNode2(ctx, stack, data, children) {
  let name = null;
  if (stack.isComponent) {
    if (stack.jsxRootElement === stack && stack.parentStack.isProgram) {
      name = ctx.createLiteral("div");
    } else {
      const desc2 = stack.description();
      if ((0, import_Utils31.isModule)(desc2)) {
        ctx.addDepend(desc2, stack.module);
        name = ctx.createIdentifier(
          ctx.getModuleReferenceName(desc2, stack.module)
        );
      } else {
        name = ctx.createIdentifier(
          stack.openingElement.name.value(),
          stack.openingElement.name
        );
      }
    }
  } else {
    name = ctx.createLiteral(stack.openingElement.name.value());
  }
  data = mergeElementPropsNode2(ctx, data, stack);
  if (children) {
    return createHandleNode2(ctx, stack, name, data || ctx.createLiteral(null), children);
  } else if (data) {
    return createHandleNode2(ctx, stack, name, data);
  } else {
    return createHandleNode2(ctx, stack, name);
  }
}
function getDepth2(stack) {
  let parentStack = stack.parentStack;
  while (parentStack) {
    if (parentStack.isJSXElement || parentStack.isJSXExpressionContainer || parentStack.isMethodDefinition || parentStack.isProgram)
      break;
    parentStack = parentStack.parentStack;
  }
  if (parentStack && (parentStack.isDirective || parentStack.isSlot || parentStack.isJSXExpressionContainer)) {
    const index = stack.childIndexAt;
    const prefix = getDepth2(parentStack);
    return prefix ? prefix + "." + index : index;
  }
  return stack.childIndexAt;
}
function getChildren2(stack) {
  return stack.children.filter((child) => {
    return !(child.isJSXScript && child.isScriptProgram || child.isJSXStyle);
  });
}
function createElement2(ctx, stack) {
  let data = {
    directives: [],
    slots: {},
    attrs: [],
    props: []
  };
  let isRoot = stack.jsxRootElement === stack;
  let children = getChildren2(stack);
  let childNodes = createChildren2(ctx, children, data, stack);
  let desc2 = stack.description();
  let componentDirective = getComponentDirectiveAnnotation2(desc2);
  let nodeElement = null;
  if (stack.isDirective && stack.openingElement.name.value().toLowerCase() === "custom") {
    componentDirective = true;
  } else if (stack.isComponent && isDirectiveInterface2(desc2)) {
    componentDirective = true;
  }
  if (componentDirective) {
    return childNodes;
  }
  if (stack.parentStack && stack.parentStack.isDirective) {
    let dName = stack.parentStack.openingElement.name.value().toLowerCase();
    if (dName === "show") {
      const condition = stack.parentStack.openingElement.attributes[0];
      data.directives.push(
        createDirectiveArrayNode2(
          ctx,
          "vShow",
          ctx.createToken(condition.parserAttributeValueStack())
        )
      );
    } else if (dName === "custom") {
      createCustomDirectiveProperties2(ctx, stack.parentStack, data);
    }
  } else {
    createComponentDirectiveProperties2(ctx, stack.parentStack, data);
  }
  if (!stack.isJSXFragment) {
    if (!(isRoot && stack.openingElement.name.value() === "root")) {
      createAttributes2(ctx, stack, data);
    }
  }
  const isWebComponent = stack.isWebComponent && !(stack.compilation.JSX && stack.parentStack.isProgram);
  if (isWebComponent) {
    const properties = [];
    if (childNodes) {
      properties.push(ctx.createProperty(
        ctx.createIdentifier("default"),
        createWithCtxNode2(
          ctx.createArrowFunctionExpression(childNodes)
        )
      ));
      childNodes = null;
    }
    if (data.slots) {
      for (let key in data.slots) {
        properties.push(
          ctx.createProperty(
            ctx.createIdentifier(key),
            data.slots[key]
          )
        );
      }
    }
    if (properties.length > 0) {
      childNodes = ctx.createObjectExpression(properties);
    }
  }
  if (stack.isSlot) {
    nodeElement = createSlotElementNode2(ctx, stack, childNodes);
  } else if (stack.isDirective) {
    nodeElement = createDirectiveElementNode2(ctx, stack, childNodes);
  } else {
    if (stack.isJSXFragment || isRoot && !isWebComponent && stack.openingElement.name.value() === "root") {
      if (Array.isArray(childNodes) && childNodes.length === 1) {
        nodeElement = childNodes[0];
      } else {
        nodeElement = createFragmentVNode2(ctx, childNodes);
      }
    } else {
      nodeElement = createElementNode2(ctx, stack, data, childNodes);
    }
  }
  if (nodeElement && data.directives && data.directives.length > 0) {
    nodeElement = createWithDirectives2(ctx, nodeElement, data.directives);
  }
  return nodeElement;
}

// lib/tokens/JSXElement.js
function JSXElement2(ctx, stack) {
  if (!ctx.options.esx.enable)
    return;
  return createElement2(ctx, stack);
}

// lib/tokens/JSXEmptyExpression.js
function JSXEmptyExpression_default2(ctx, stack) {
  return null;
}

// lib/tokens/JSXExpressionContainer.js
function JSXExpressionContainer_default2(ctx, stack) {
  return ctx.createToken(stack.expression);
}

// lib/tokens/JSXFragment.js
var JSXFragment_default2 = JSXElement2;

// lib/tokens/JSXIdentifier.js
init_Common2();
function JSXIdentifier_default2(ctx, stack) {
  var name = stack.value();
  if (stack.parentStack.parentStack.isJSXAttribute) {
    if (name.includes("-")) {
      return ctx.createIdentifier(toCamelCase(name), stack);
    }
  }
  const node = ctx.createNode(stack, "Identifier");
  node.value = name;
  node.raw = name;
  return node;
}

// lib/tokens/JSXMemberExpression.js
function JSXMemberExpression_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  node.object = ctx.createToken(stack.object);
  node.property = ctx.createToken(stack.property);
  return node;
}

// lib/tokens/JSXNamespacedName.js
function JSXNamespacedName_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  node.name = ctx.createToken(stack.name);
  node.namespace = ctx.createToken(stack.namespace);
  const xmlns = stack.getXmlNamespace();
  if (xmlns) {
    node.value = xmlns.value.value();
  } else {
    const ops2 = stack.compiler.options;
    node.value = ops2.jsx.xmlns.default[stack.namespace.value()] || null;
  }
  node.raw = node.value;
  return node;
}

// lib/tokens/JSXOpeningElement.js
function JSXOpeningElement_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  node.attributes = stack.attributes.map((attr) => ctx.createToken(attr));
  node.selfClosing = !!stack.selfClosing;
  if (stack.parentStack.isComponent) {
    const desc2 = stack.parentStack.description();
    if (desc2) {
      if (stack.hasNamespaced && desc2.isFragment) {
        node.name = ctx.createIdentifier(desc2.id, stack.name);
      } else {
        node.name = ctx.createIdentifier(ctx.getModuleReferenceName(desc2, stack.module), stack.name);
      }
    } else {
      node.name = ctx.createIdentifier(stack.name.value(), stack.name);
    }
  } else {
    node.name = ctx.createLiteral(stack.name.value(), void 0, stack.name);
  }
  return node;
}

// lib/tokens/JSXOpeningFragment.js
function JSXOpeningFragment_default2(ctx, stack) {
  return ctx.createNode(stack);
}

// lib/tokens/JSXScript.js
function JSXScript_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  node.openingElement = ctx.createToken(stack.openingElement);
  node.closingElement = ctx.createToken(stack.closingElement);
  node.body = (stack.body || []).map((child) => ctx.createToken(child));
}

// lib/tokens/JSXSpreadAttribute.js
function JSXSpreadAttribute_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  node.argument = ctx.createToken(stack.argument);
  return node;
}

// lib/tokens/JSXStyle.js
function JSXStyle_default2(ctx, stack) {
  return null;
}

// lib/tokens/JSXText.js
function JSXText_default2(ctx, stack) {
  let value = stack.value();
  if (value) {
    value = value.replace(/\s+/g, " ").replace(/(\u0022|\u0027)/g, "\\$1");
    if (value) {
      return ctx.createLiteral(value);
    }
  }
  return null;
}

// lib/tokens/LabeledStatement.js
function LabeledStatement_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  node.label = ctx.createIdentifier(stack.label.value(), stack.label);
  node.body = ctx.createToken(stack.body);
  return node;
}

// lib/tokens/Literal.js
function Literal_default2(ctx, stack) {
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
  if (type && type.toString().toLowerCase() === "regexp") {
    ctx.addDepend(type.inherit, stack.module || stack.compilation);
    let pattern = node.raw.trim();
    let index = node.raw.lastIndexOf("/");
    if (pattern.charCodeAt(0) !== 47 || !(index > 0)) {
      throw new Error("Invalid regexp " + pattern);
    } else {
      let glog = pattern.slice(index + 1);
      pattern = pattern.slice(1, index);
      const args = [pattern, glog].filter((item) => !!item);
      const newNode = ctx.createNewExpression(
        ctx.createIdentifier(ctx.getModuleReferenceName(type.inherit, stack.module)),
        args.map((item) => ctx.createLiteral(item))
      );
      if (stack.parentStack.isMemberExpression) {
        return ctx.createParenthesizedExpression(newNode);
      } else {
        return newNode;
      }
    }
  }
  return node;
}

// lib/tokens/LogicalExpression.js
init_Common2();
function isBooleanExpression(stack) {
  if (!stack || !stack.parentStack)
    return false;
  if (stack.parentStack.isLogicalExpression || stack.parentStack.isUnaryExpression || stack.parentStack.isParenthesizedExpression) {
    return isBooleanExpression(stack.parentStack);
  }
  return stack.parentStack.isIfStatement || stack.parentStack.isWhileStatement || stack.parentStack.isArrowFunctionExpression || stack.parentStack.isForStatement || stack.parentStack.isBinaryExpression || stack.parentStack.isDoWhileStatement;
}
function LogicalExpression_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  const isAnd = stack.node.operator.charCodeAt(0) === 38;
  const isBoolean = isBooleanExpression(stack);
  if (!isBoolean) {
    const needRefs = !stack.parentStack.isSwitchCase;
    const type = stack.left.type();
    const createRefs2 = !isAnd && !stack.left.isIdentifier;
    let refs = null;
    if (needRefs) {
      let left = ctx.createToken(stack.left);
      let right = ctx.createToken(stack.right);
      let condition = left;
      let isAddress = false;
      if (!isAnd && ctx.isPassableReferenceExpress(stack.left, type)) {
        isAddress = true;
      }
      if (createRefs2) {
        refs = ctx.getLocalRefName(stack, AddressVariable_default.REFS_VALUE, stack);
        ctx.insertTokenToBlock(
          stack,
          ctx.createAssignmentExpression(
            ctx.createVarIdentifier(refs),
            isAddress ? createAddressRefsNode(ctx, left) : left
          )
        );
        left = ctx.createVarIdentifier(refs);
        condition = createExpressionTransformBooleanValueNode(ctx, stack.left, null, type, null, left);
      } else {
        condition = createExpressionTransformBooleanValueNode(ctx, stack.left, null, type, null, left);
      }
      if (isAddress) {
        left = createAddressRefsNode(ctx, left);
      }
      let rightInitial = null;
      if (ctx.isPassableReferenceExpress(stack.right, stack.right.type())) {
        if (right.type === "ParenthesizedExpression") {
          right = right.expression;
        }
        if (right.type === "AssignmentExpression") {
          rightInitial = right;
          right = right.left;
        }
        right = createAddressRefsNode(ctx, right);
        isAddress = true;
      }
      if (isAddress) {
        const result = ctx.getLocalRefName(stack, AddressVariable_default.REFS_NAME, stack);
        const assignName = ctx.getLocalRefName(stack, AddressVariable_default.REFS_INDEX, stack);
        const key0 = ctx.createAssignmentExpression(
          ctx.createVarIdentifier(assignName),
          ctx.createLiteral(0)
        );
        const key1 = ctx.createAssignmentExpression(
          ctx.createVarIdentifier(assignName),
          ctx.createLiteral(1)
        );
        const key2 = ctx.createAssignmentExpression(
          ctx.createVarIdentifier(assignName),
          ctx.createLiteral(2)
        );
        ctx.insertTokenToBlock(
          stack,
          ctx.createAssignmentExpression(
            ctx.createComputeMemberExpression([
              ctx.createVarIdentifier(result),
              key0
            ]),
            ctx.createLiteral(null)
          )
        );
        let consequent = ctx.createAssignmentExpression(
          ctx.createComputeMemberExpression([
            ctx.createVarIdentifier(result),
            key1
          ]),
          right
        );
        if (rightInitial) {
          const block = ctx.createNode("BlockStatement");
          block.body = [
            ctx.createExpressionStatement(rightInitial),
            ctx.createExpressionStatement(consequent)
          ];
          consequent = block;
        }
        let alternate = null;
        if (!isAnd) {
          alternate = consequent;
          consequent = ctx.createAssignmentExpression(
            ctx.createComputeMemberExpression([
              ctx.createVarIdentifier(result),
              key2
            ], null, true),
            left
          );
        }
        ctx.insertTokenToBlock(
          stack,
          ctx.createIfStatement(condition, consequent, alternate)
        );
        return ctx.createComputeMemberExpression([
          ctx.createVarIdentifier(result),
          ctx.createVarIdentifier(assignName)
        ]);
      }
    }
    if (isAnd || stack.left.isIdentifier) {
      if (isAnd) {
        return ctx.createConditionalExpression(
          createExpressionTransformBooleanValueNode(ctx, stack.left, null, type),
          ctx.createToken(stack.right),
          ctx.createLiteral(null)
        );
      }
      return ctx.createConditionalExpression(
        createExpressionTransformBooleanValueNode(ctx, stack.left, null, type),
        ctx.createToken(stack.left),
        ctx.createToken(stack.right)
      );
    } else {
      return ctx.createConditionalExpression(
        createRefs2 && needRefs ? createExpressionTransformBooleanValueNode(ctx, stack.left, null, type, null, ctx.createVarIdentifier(refs)) : createExpressionTransformBooleanValueNode(ctx, stack.left, refs, type),
        ctx.createVarIdentifier(refs),
        ctx.createToken(stack.right)
      );
    }
  }
  node.left = createExpressionTransformBooleanValueNode(ctx, stack.left);
  node.right = createExpressionTransformBooleanValueNode(ctx, stack.right);
  node.operator = stack.operator;
  return node;
}

// lib/tokens/MemberExpression.js
var import_Utils32 = __toESM(require("easescript/lib/core/Utils"));
init_Common2();
function trans(ctx, stack, description, aliasAnnotation, objectType) {
  var type = objectType;
  var name = ctx.getAvailableOriginType(type) || type.toString();
  if (objectType && (objectType.isUnionType || objectType.isIntersectionType) && description && description.isMethodDefinition && description.module && description.module.isModule) {
    name = description.module.id;
  }
  if (transforms_default.has(name)) {
    const object = transforms_default.get(name);
    let key = stack.computed ? "$computed" : stack.property.value();
    if (description && (description.isPropertyDefinition || description.isMethodDefinition)) {
      if (description.value() === stack.property.value()) {
        key = stack.property.value();
      }
    }
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      if (stack.computed) {
        return object[key](
          stack,
          ctx,
          ctx.createToken(stack.object),
          [ctx.createToken(stack.property)],
          false,
          false
        );
      }
      if (description.static) {
        return object[key](
          stack,
          ctx,
          null,
          [],
          false,
          true
        );
      } else {
        return object[key](
          stack,
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
  if (!desc2 || !desc2.isStack)
    return null;
  return desc2.getAnnotationAlias();
}
function MemberExpression2(ctx, stack) {
  let module2 = stack.module;
  let description = stack.descriptor();
  let computed = false;
  if (description && import_Utils32.default.isTypeModule(description)) {
    ctx.addDepend(description);
    if (stack.parentStack.isMemberExpression || stack.parentStack.isNewExpression || stack.parentStack.isCallExpression) {
      return ctx.createIdentifier(ctx.getModuleReferenceName(description, module2), stack);
    } else {
      return createClassRefsNode(ctx, description, stack);
    }
  }
  let objCtx = stack.object.getContext();
  let objectType = ctx.inferType(stack.object, objCtx);
  let objectDescription = stack.object.descriptor();
  let rawObjectType = objectType;
  let isWrapType = false;
  if (objectType.isClassGenericType && objectType.inherit.isAliasType) {
    objectType = ctx.inferType(objectType.inherit.inherit.type(), objCtx);
    isWrapType = true;
  }
  if (objectType.isNamespace && !stack.parentStack.isMemberExpression) {
    let mappingNs = ctx.getMappingNamespace(stack.value());
    if (mappingNs === false)
      return ctx.createLiteral(null);
    if (mappingNs) {
      return ctx.createIdentifier(mappingNs);
    }
    return ctx.createIdentifier("\\" + stack.value().replace(/\./g, "\\"));
  }
  if (!description || description.isType && description.isAnyType) {
    let isCall = stack.parentStack.parentStack.isCallExpression;
    if (!description && isCall) {
      let mappingNs = ctx.getMappingNamespace(stack.value());
      if (mappingNs === false)
        return ctx.createLiteral(null);
      if (mappingNs) {
        return ctx.createLiteral(mappingNs.replace(/\\/g, "\\\\"));
      }
      return ctx.createLiteral("\\\\" + stack.value().replace(/\./g, "\\\\"));
    }
    let isReflect = !!objectType.isAnyType;
    let hasDynamic = description && description.isComputeType && description.isPropertyExists();
    if (!hasDynamic && !import_Utils32.default.isLiteralObjectType(objectType)) {
      isReflect = true;
    }
    if (isReflect) {
      return ctx.createCallExpression(
        createStaticReferenceNode2(ctx, stack, "Reflect", "get"),
        [
          createScopeIdNode(ctx, module2),
          ctx.createToken(stack.object),
          createComputedPropertyNode(ctx, stack)
        ],
        stack
      );
    }
    computed = true;
  }
  let isNewObject = !!stack.object.isNewExpression;
  if (!isNewObject && stack.object.isParenthesizedExpression) {
    let op = stack.object.expression;
    while (op.isParenthesizedExpression) {
      op = op.expression;
    }
    isNewObject = !!op.isNewExpression;
  }
  let isStatic = stack.object.isSuperExpression || objectType.isClassType || !isNewObject && stack.compiler.callUtils("isClassType", objectDescription);
  let objectNode = null;
  let propertyNode = null;
  if (isStatic && !(objectType.isClassType || stack.object.isSuperExpression)) {
    if (stack.object.isCallExpression) {
      isStatic = false;
    }
  }
  let aliasAnnotation = null;
  let isMember = description && description.isEnumProperty;
  if (description && (description.isMethodGetterDefinition || description.isMethodSetterDefinition)) {
    aliasAnnotation = getAliasAnnotation(description);
    const result = trans(ctx, stack, description, aliasAnnotation, objectType);
    if (result)
      return result;
    const members = [
      ctx.createToken(stack.object),
      ctx.createIdentifier(ctx.getAccessorName(aliasAnnotation || stack.property.value(), description, description.isMethodGetterDefinition ? "get" : "set"))
    ];
    const callee = isStatic ? ctx.createStaticMemberExpression(members, stack) : ctx.createMemberExpression(members, stack);
    return description.isMethodGetterDefinition ? ctx.createCallExpression(callee, [], stack) : callee;
  } else if (description && description.isMethodDefinition) {
    aliasAnnotation = getAliasAnnotation(description);
    const result = trans(ctx, stack, description, aliasAnnotation, objectType);
    if (result)
      return result;
    let pp = stack.parentStack;
    while (pp && (pp.isTypeAssertExpression || pp.isParenthesizedExpression)) {
      pp = pp.parentStack;
    }
    if (pp && !(pp.isCallExpression || pp.isMemberExpression)) {
      return ctx.createArrayExpression([
        ctx.createToken(stack.object),
        ctx.createLiteral(aliasAnnotation || stack.property.value())
      ]);
    }
    const pStack = stack.getParentStack((stack2) => !!(stack2.jsxElement || stack2.isBlockStatement || stack2.isCallExpression || stack2.isExpressionStatement));
    if (pStack && pStack.jsxElement) {
      return ctx.createCallExpression(
        createStaticReferenceNode2(ctx, stack, "System", "bind"),
        [
          ctx.createArrayExpression([
            ctx.createToken(stack.object),
            ctx.createLiteral(aliasAnnotation || stack.property.value(), void 0, stack.property)
          ]),
          ctx.createThisExpression()
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
    if (isStatic && description.kind !== "const") {
      propertyNode = ctx.createVarIdentifier(stack.property.value(), stack.property);
    }
  }
  const node = ctx.createNode(stack);
  node.computed = computed;
  node.optional = stack.optional;
  if (aliasAnnotation) {
    propertyNode = ctx.createIdentifier(aliasAnnotation, stack.property);
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
  } else if (!isStatic && rawObjectType && (rawObjectType.isEnumType || ctx.isArrayAccessor(rawObjectType))) {
    node.computed = true;
    propertyNode = ctx.createLiteral(stack.property.value());
  }
  if (stack.object.isNewExpression) {
    objectNode = ctx.createParenthesizedExpression(ctx.createToken(stack.object));
  }
  node.object = objectNode || ctx.createToken(stack.object);
  node.property = propertyNode || ctx.createToken(stack.property);
  node.isStatic = isStatic;
  if (node.computed || !isMember) {
    let pStack = stack.getParentStack((p) => !p.isMemberExpression);
    if (pStack) {
      let optionalChain = pStack.isAssignmentExpression || pStack.isChainExpression;
      if (pStack.isCallExpression || pStack.isNewExpression) {
        optionalChain = !pStack.arguments.includes(stack);
      }
      if (!optionalChain && pStack.isCallExpression) {
        optionalChain = pStack.callee.value() === "isset";
      }
      if (!optionalChain) {
        return ctx.createBinaryExpression(node, ctx.createLiteral(null), "??");
      }
    }
  }
  return node;
}
var MemberExpression_default2 = MemberExpression2;

// lib/tokens/MethodDefinition.js
var import_Utils33 = __toESM(require("easescript/lib/core/Utils"));
init_Common2();
function MethodDefinition_default2(ctx, stack, type) {
  const alias = getMethodOrPropertyAlias(ctx, stack);
  const node = FunctionDeclaration_default2(ctx, stack, type);
  node.async = stack.expression.async ? true : false;
  node.static = stack.static ? ctx.createIdentifier("static") : null;
  node.final = stack.final ? ctx.createIdentifier("final") : null;
  node.modifier = ctx.createIdentifier(import_Utils33.default.getModifierValue(stack));
  node.kind = "method";
  if (alias && node.key) {
    node.key.value = alias;
    node.key.raw = alias;
  }
  node.comments = createCommentsNode(ctx, stack, node);
  return node;
}

// lib/tokens/MethodGetterDefinition.js
init_Common2();
function MethodGetterDefinition_default2(ctx, stack, type) {
  const alias = getMethodOrPropertyAlias(ctx, stack);
  const node = MethodDefinition_default2(ctx, stack, type);
  node.isAccessor = true;
  node.kind = "get";
  node.key.value = ctx.getAccessorName(alias || node.key.value, stack, "get");
  return node;
}

// lib/tokens/MethodSetterDefinition.js
init_Common2();
function MethodSetterDefinition_default2(ctx, stack, type) {
  const alias = getMethodOrPropertyAlias(ctx, stack);
  const node = MethodDefinition_default2(ctx, stack, type);
  node.isAccessor = true;
  node.kind = "set";
  node.key.value = ctx.getAccessorName(alias || node.key.value, stack, "set");
  return node;
}

// lib/tokens/NewExpression.js
var import_Namespace23 = __toESM(require("easescript/lib/core/Namespace"));
var import_Utils34 = __toESM(require("easescript/lib/core/Utils"));
init_Common2();
function createArgumentNodes2(ctx, stack, args, declareParams) {
  return args.map((item, index) => {
    const node = ctx.createToken(item);
    if (declareParams && declareParams[index] && !item.isIdentifier) {
      const declareParam = declareParams[index];
      if (!(declareParam.isRestElement || declareParam.isObjectPattern || declareParam.isArrayPattern)) {
        if (ctx.isAddressRefsType(declareParam.type())) {
          const name = ctx.getLocalRefName(stack, "arg");
          ctx.insertTokenToBlock(
            stack,
            ctx.createAssignmentExpression(ctx.createVarIdentifier(name), node)
          );
          return ctx.createVarIdentifier(name);
        }
      }
    }
    return node;
  });
}
function NewExpression_default2(ctx, stack) {
  let type = stack.callee.type();
  let [classModule, desc2] = stack.getConstructMethod(type);
  let wrapType = null;
  if (desc2 && desc2.isNewDefinition && desc2.module) {
    type = desc2.module;
  }
  if (type) {
    type = import_Utils34.default.getOriginType(type);
    if (import_Utils34.default.isTypeModule(type)) {
      ctx.addDepend(type);
    }
    if (type === import_Namespace23.default.globals.get("Array")) {
      return transforms_default.get("Array").of(
        stack,
        ctx,
        null,
        createArgumentNodes2(ctx, stack, stack.arguments, desc2 && desc2.params),
        true,
        false
      );
    }
    if (type === import_Namespace23.default.globals.get("String")) {
      wrapType = "String";
    } else if (type === import_Namespace23.default.globals.get("Number")) {
      wrapType = "Number";
    } else if (type === import_Namespace23.default.globals.get("Boolean")) {
      wrapType = "Boolean";
    } else if (type === import_Namespace23.default.globals.get("Object")) {
      wrapType = "Object";
    }
  }
  if (!type || !type.isModule || wrapType) {
    let Reflect2 = import_Namespace23.default.globals.get("Reflect");
    ctx.addDepend(Reflect2, stack.module);
    let target = ctx.createToken(stack.callee);
    if (!wrapType && !stack.callee.isIdentifier) {
      let refs = ctx.getLocalRefName(stack, "ref");
      ctx.insertTokenToBlock(
        stack,
        ctx.createExpressionStatement(
          ctx.createAssignmentExpression(ctx.createVarIdentifier(refs), target)
        )
      );
      target = ctx.createVarIdentifier(refs);
    }
    return ctx.createCallExpression(
      createStaticReferenceNode2(ctx, stack, "Reflect", "construct"),
      [
        createScopeIdNode(ctx, stack.module),
        target,
        ctx.createArrayExpression(
          createArgumentNodes2(ctx, stack, stack.arguments || [], desc2 && desc2.params),
          stack
        )
      ],
      stack
    );
  }
  let node = ctx.createNode(stack);
  node.callee = ctx.createToken(stack.callee);
  if (node.callee.type === "ParenthesizedExpression") {
    let name = ctx.getLocalRefName(stack, "_refClass");
    ctx.insertTokenToBlock(
      stack,
      ctx.createAssignmentExpression(
        ctx.createVarIdentifier(name),
        node.callee.expression
      )
    );
    node.callee = ctx.createVarIdentifier(name);
  }
  node.arguments = createArgumentNodes2(ctx, stack, stack.arguments || [], desc2 && desc2.params);
  return node;
}

// lib/tokens/ObjectExpression.js
function ObjectExpression_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  let spreadIndex = [];
  node.properties = stack.properties.map((stack2, index) => {
    let item = ctx.createToken(stack2);
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
      segs.push(ctx.createObjectExpression(node.properties.slice(start, end)));
      segs.push(node.properties[end]);
      start = end + 1;
    }
    if (start < node.properties.length) {
      if (node.properties.length === 1) {
        segs.push(node.properties[0]);
      } else {
        segs.push(ctx.createObjectExpression(node.properties.slice(start, node.properties.length)));
      }
    }
    return System_default.merge(stack, ctx, ctx.createArrayExpression(), segs);
  }
  return node;
}

// lib/tokens/ObjectPattern.js
init_Common2();
function createRefs(ctx, target, expression2) {
  let name = ctx.getLocalRefName(target, "S", target);
  let refNode = ctx.createVariableDeclaration("const", [
    ctx.createVariableDeclarator(
      ctx.createIdentifier(name),
      createExpressionTransformTypeNode(ctx, "object", expression2)
    )
  ]);
  ctx.insertTokenToBlock(target, refNode);
}
function ObjectPattern_default2(ctx, stack) {
  let node = ctx.createNode(stack);
  let target = stack.parentStack.init;
  if (target) {
    if (!(target.isObjectExpression || target.isArrayExpression)) {
      createRefs(ctx, target, ctx.createToken(target));
    }
  }
  node.properties = stack.properties.map((item) => ctx.createToken(item));
  return node;
}

// lib/tokens/PackageDeclaration.js
function PackageDeclaration_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  node.body = [];
  stack.body.forEach((item) => {
    if (item.isClassDeclaration || item.isDeclaratorDeclaration || item.isEnumDeclaration || item.isInterfaceDeclaration || item.isStructTableDeclaration) {
      node.body.push(ctx.createToken(item));
    }
  });
  return node;
}

// lib/tokens/ParenthesizedExpression.js
function ParenthesizedExpression_default2(ctx, stack) {
  if (stack.parentStack.isExpressionStatement) {
    return ctx.createToken(stack.expression);
  }
  if (stack.expression.isCallExpression && stack.expression.callee.isFunctionExpression) {
    return ctx.createToken(stack.expression);
  }
  const node = ctx.createNode(stack);
  node.expression = ctx.createToken(stack.expression);
  return node;
}

// lib/tokens/Property.js
init_Common2();
function getSpreadRefName(ctx, target) {
  let name = ctx.getWasLocalRefName(target, "S");
  if (!name) {
    name = ctx.getLocalRefName(target, "S", target);
    let refNode = ctx.createVariableDeclaration("const", [
      ctx.createVariableDeclarator(
        ctx.createIdentifier(name),
        createExpressionTransformTypeNode(ctx, "object", expression)
      )
    ]);
    ctx.insertTokenToBlock(target, refNode);
  }
  return ctx.createVarIdentifier(name);
}
function Property_default2(ctx, stack) {
  let node = ctx.createNode(stack);
  node.computed = !!stack.computed;
  if (stack.parentStack.isObjectPattern) {
    let target = stack.parentStack.parentStack.init;
    let key = stack.value();
    let name = null;
    let value = null;
    if (stack.hasAssignmentPattern) {
      value = ctx.createToken(stack.init.right);
      name = stack.init.left.value();
    } else {
      value = ctx.createLiteral(null);
      name = stack.init.value();
    }
    if (target.isObjectExpression || target.isArrayExpression) {
      let init = target.attribute(key);
      return ctx.createExpressionStatement(
        ctx.createAssignmentExpression(
          ctx.createVarIdentifier(name),
          init ? ctx.createBinaryExpression(
            ctx.createToken(init.init),
            init.init.isLiteral ? ctx.createLiteral(null) : value,
            "??"
          ) : value
        )
      );
    } else {
      let obj = getSpreadRefName(ctx, target);
      return ctx.createExpressionStatement(
        ctx.createAssignmentExpression(
          ctx.createVarIdentifier(name),
          ctx.createBinaryExpression(
            ctx.createMemberExpression(
              [
                obj,
                ctx.createIdentifier(key)
              ]
            ),
            value,
            "??"
          )
        )
      );
    }
  }
  if (!node.computed && stack.parentStack.isObjectExpression) {
    node.key = ctx.createLiteral(stack.key.value());
  } else {
    node.key = ctx.createToken(stack.key);
    if (node.computed && node.key.type === "Identifier") {
      node.key.isVariable = true;
    }
  }
  node.init = ctx.createToken(stack.init);
  if (stack.hasInit && ctx.isPassableReferenceExpress(stack.init, stack.type())) {
    if (stack.init.isCallExpression || stack.init.isAwaitExpression) {
      let name = ctx.getLocalRefName(stack.init, "R", stack.init);
      let refNode = ctx.createVariableDeclaration("const", [
        ctx.createVariableDeclarator(
          ctx.createIdentifier(name),
          createAddressRefsNode(node.init)
        )
      ]);
      ctx.insertTokenToBlock(stack, refNode);
      node.init = createAddressRefsNode(ctx, ctx.createVarIdentifierNode(name));
    } else {
      node.init = createAddressRefsNode(ctx, node.init);
    }
  }
  return node;
}

// lib/tokens/PropertyDefinition.js
var import_Utils35 = __toESM(require("easescript/lib/core/Utils"));
init_Common2();
function PropertyDefinition_default2(ctx, stack) {
  let alias = getMethodOrPropertyAlias(ctx, stack);
  let isStatic = !!(stack.module.static || stack.static);
  const node = ctx.createNode(stack);
  node.declarations = (stack.declarations || []).map((item) => ctx.createToken(item));
  node.modifier = ctx.createIdentifier(import_Utils35.default.getModifierValue(stack));
  if (stack.annotations && stack.annotations.length > 0) {
    stack.annotations.forEach((annot) => {
      const name = annot.getLowerCaseName();
      let value = null;
      if (name === "readfile") {
        value = createReadfileAnnotationNode2(ctx, annot, stack) || ctx.createLiteral(null);
      } else if (name === "embed") {
        value = createEmbedAnnotationNode2(ctx, annot, stack);
      } else if (name === "env") {
        value = createEnvAnnotationNode(ctx, annot, stack);
      } else if (name === "url") {
        value = createUrlAnnotationNode2(ctx, annot, stack);
      }
      if (value) {
        let prop = null;
        if (stack.isReadonly) {
          prop = alias ? ctx.createIdentifier(alias) : node.declarations[0].id;
        } else {
          prop = alias ? ctx.createIdentifier(alias) : ctx.createIdentifier(node.declarations[0].id.value);
        }
        if (isStatic) {
          ctx.addNodeToAfterBody(ctx.createExpressionStatement(
            ctx.createAssignmentExpression(
              ctx.createStaticMemberExpression([
                ctx.createIdentifier(stack.module.id),
                prop
              ]),
              value
            )
          ));
        } else {
          let builder = ctx.getClassBuilder(stack);
          builder.initBeforeProperties.push(
            ctx.createExpressionStatement(
              ctx.createAssignmentExpression(
                ctx.createMemberExpression([
                  ctx.createThisExpression(),
                  prop
                ]),
                value
              )
            )
          );
        }
      }
    });
  }
  if (isStatic && stack.kind === "const" && !hasEmbed) {
    node.kind = stack.kind;
  } else if (isStatic) {
    node.static = ctx.createIdentifier("static");
  }
  node.key = alias ? ctx.createIdentifier(alias) : node.declarations[0].id;
  node.init = node.declarations[0].init || ctx.createLiteral(null);
  node.comments = createCommentsNode(ctx, stack, node);
  return node;
}

// lib/tokens/RestElement.js
function RestElement_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  node.value = stack.value();
  node.raw = node.value;
  return node;
}

// lib/tokens/ReturnStatement.js
function ReturnStatement_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  node.argument = ctx.createToken(stack.argument);
  return node;
}

// lib/tokens/SequenceExpression.js
function SequenceExpression_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  node.expressions = stack.expressions.map((item) => ctx.createToken(item));
  return node;
}

// lib/tokens/SpreadElement.js
var import_Namespace24 = __toESM(require("easescript/lib/core/Namespace"));
init_Common2();
function SpreadElement_default2(ctx, stack) {
  if (stack.parentStack.isArrayExpression) {
    const type = stack.argument.type();
    const _Array = import_Namespace24.default.globals.get("Array");
    const _array = import_Namespace24.default.globals.get("array");
    if (type && (type.isLiteralArrayType || type === _Array || type === _array)) {
      return ctx.createToken(stack.argument);
    }
    const node2 = ctx.createCallExpression(
      createStaticReferenceNode2(ctx, stack, "System", "toArray"),
      [
        ctx.createToken(stack.argument)
      ]
    );
    return node2;
  } else if (stack.parentStack.isObjectExpression) {
    return ctx.createToken(stack.argument);
  }
  const node = ctx.createNode(stack);
  node.argument = ctx.createToken(stack.argument);
  return node;
}

// lib/tokens/StructTableColumnDefinition.js
init_Common2();
function StructTableColumnDefinition_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  node.key = ctx.createIdentifier("`" + stack.key.value() + "`", stack.key);
  node.properties = [];
  const type = stack.typename ? ctx.createToken(stack.typename) : ctx.createIdentifier("varchar(255)");
  const unsigned = stack.unsigned ? ctx.createIdentifier("unsigned") : null;
  const notnull = !stack.question ? ctx.createIdentifier("not null") : null;
  node.properties.push(type);
  if (unsigned) {
    node.properties.push(unsigned);
  }
  if (notnull) {
    node.properties.push(notnull);
  }
  {
    (stack.properties || []).forEach((item) => {
      node.properties.push(createIdentNode(ctx, item));
    });
  }
  return node;
}

// lib/tokens/StructTableDeclaration.js
function StructTableDeclaration_default2(ctx, stack) {
  getBuilder("mysql").createTable(ctx, stack);
}

// lib/tokens/StructTableKeyDefinition.js
init_Common2();
function StructTableKeyDefinition_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  node.key = createIdentNode(ctx, stack.key);
  const key = stack.key.value().toLowerCase();
  node.prefix = key === "primary" || key === "key" ? null : ctx.createIdentifier("key");
  node.local = ctx.createToken(stack.local);
  node.properties = (stack.properties || []).map((item) => createIdentNode(ctx, item));
  return node;
}

// lib/tokens/StructTableMethodDefinition.js
var import_Namespace25 = __toESM(require("easescript/lib/core/Namespace"));
function createNode4(ctx, item, isKey = false, toLower = false, type = null) {
  if (!item)
    return null;
  if (type === "enum") {
    if (item.isIdentifier || item.isMemberExpression) {
      const type2 = import_Namespace25.default.globals.get(item.value());
      const list = [];
      if (type2 && type2.isModule && type2.isEnum) {
        Array.from(type2.descriptors.keys()).forEach((key) => {
          const items = type2.descriptors.get(key);
          const item2 = items.find((item3) => item3.isEnumProperty);
          if (item2) {
            list.push(ctx.createLiteral(item2.init.value()));
          }
        });
      }
      return list;
    }
  }
  if (item.isIdentifier) {
    let value = item.value();
    if (toLower)
      value = value.toLowerCase();
    return ctx.createIdentifier(isKey ? "`" + value + "`" : value, item);
  }
  return item.isLiteral ? ctx.createLiteral(item.value()) : ctx.createToken(item);
}
function StructTableMethodDefinition_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  const name = stack.key.value().toLowerCase();
  if (name === "text" || name === "longtext" || name === "tinytext" || name === "mediumtext") {
    return ctx.createIdentifier(stack.key.value(), stack.key);
  }
  const key = stack.key.isMemberExpression ? stack.key.property : stack.key;
  node.key = createNode4(ctx, key, false);
  const isKey = stack.parentStack.isStructTableKeyDefinition;
  node.params = (stack.params || []).map((item) => createNode4(ctx, item, isKey, false, name)).flat().filter(Boolean);
  return node;
}

// lib/tokens/StructTablePropertyDefinition.js
init_Common2();
function StructTablePropertyDefinition_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  node.assignment = !!stack.assignment;
  node.key = createIdentNode(ctx, stack.key);
  node.init = createIdentNode(ctx, stack.init);
  return node;
}

// lib/tokens/SuperExpression.js
function SuperExpression_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  node.value = "parent";
  node.raw = "parent";
  return node;
}

// lib/tokens/SwitchCase.js
function SwitchCase_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  node.condition = ctx.createToken(stack.condition);
  if (node.condition && node.condition.type === "ConditionalExpression") {
    node.condition = ctx.createParenthesizedExpression(node.condition);
  }
  node.consequent = stack.consequent.map((item) => ctx.createToken(item));
  return node;
}

// lib/tokens/SwitchStatement.js
function SwitchStatement_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  node.condition = ctx.createToken(stack.condition);
  node.cases = stack.cases.map((item) => ctx.createToken(item));
  return node;
}

// lib/tokens/TemplateElement.js
function TemplateElement_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  node.raw = stack.raw();
  node.value = node.raw;
  node.tail = stack.tail;
  return node;
}

// lib/tokens/TemplateLiteral.js
function TemplateLiteral_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  node.quasis = stack.quasis.map((item) => ctx.createToken(item));
  node.expressions = stack.expressions.map((item) => ctx.createToken(item));
  return node;
}

// lib/tokens/ThisExpression.js
function ThisExpression_default2(ctx, stack) {
  const node = ctx.createVarIdentifier("this", stack);
  return node;
}

// lib/tokens/ThrowStatement.js
function ThrowStatement_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  node.argument = ctx.createToken(stack.argument);
  return node;
}

// lib/tokens/TryStatement.js
var import_Namespace26 = __toESM(require("easescript/lib/core/Namespace"));
function TryStatement_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  node.block = ctx.createToken(stack.block);
  node.param = ctx.createNode("ParamDeclarator");
  node.param.argument = ctx.createToken(stack.param);
  node.param.argument.isVariable = true;
  node.param.type = "ParamDeclarator";
  node.param.prefix = "\\Exception";
  const acceptType = stack.param.acceptType ? stack.param.acceptType.type() : null;
  if (acceptType && acceptType.isModule) {
    const Throwable = import_Namespace26.default.globals.get("Throwable");
    if (Throwable && Throwable.type().is(acceptType)) {
      node.param.prefix = ctx.getModuleReferenceName(acceptType);
    }
  }
  node.handler = ctx.createToken(stack.handler);
  node.finalizer = ctx.createToken(stack.finalizer);
  return node;
}

// lib/tokens/TypeAssertExpression.js
function TypeAssertExpression_default2(ctx, stack) {
  if (stack.left.isParenthesizedExpression) {
    return ctx.createToken(stack.left.expression);
  }
  return ctx.createToken(stack.left);
}

// lib/tokens/TypeTransformExpression.js
var import_Namespace27 = __toESM(require("easescript/lib/core/Namespace"));
function createTransformNode(ctx, method, expression2) {
  return ctx.createCallExpression(
    ctx.createIdentifier(method),
    [
      ctx.createToken(expression2)
    ]
  );
}
function TypeTransformExpression_default2(ctx, stack) {
  const type = stack.argument.type();
  var name = null;
  if (type) {
    const value = ctx.getAvailableOriginType(type);
    name = type.toString();
    if (value === "Number") {
      const method = name === "float" || name === "double" ? "floatval" : "intval";
      return createTransformNode(ctx, method, stack.expression);
    } else if (value === "String") {
      return createTransformNode(ctx, "strval", stack.expression);
    } else if (value === "Boolean") {
      return createTransformNode(ctx, "boolval", stack.expression);
    } else if (value === "RegExp") {
      const regexp = import_Namespace27.default.globals.get("RegExp");
      const refs = ctx.getModuleReferenceName(regexp);
      ctx.addDepend(regexp);
      const test = ctx.createBinaryExression(
        ctx.createToken(stack.expression),
        ctx.createIdentifier(refs),
        "instanceof"
      );
      const consequent = ctx.createIdentifier(refs);
      const alternate = ctx.createNewExpression(
        ctx.createIdentifier(refs),
        [
          ctx.createCallExpression(
            ctx.createIdentifier("strval"),
            [
              ctx.createToken(stack.expression)
            ]
          )
        ]
      );
      return ctx.createParenthesizedExpression(
        ctx.createConditionalExpression(test, consequent, alternate)
      );
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
  node.expression = ctx.createToken(stack.expression);
  return node;
}

// lib/tokens/UnaryExpression.js
init_Common2();
function UnaryExpression_default2(ctx, stack) {
  const operator = stack.node.operator;
  const prefix = stack.node.prefix;
  if (operator === "delete" || operator === "typeof") {
    if (operator === "typeof") {
      return ctx.createCallExpression(
        createStaticReferenceNode2(ctx, stack, "System", "typeof"),
        [
          ctx.createToken(stack.argument)
        ]
      );
    }
    return ctx.createCallExpression(
      ctx.createIdentifier("unset", stack),
      [
        ctx.createToken(stack.argument)
      ]
    );
  } else if (operator === "void") {
    if (stack.argument.isIdentifier || stack.argument.isLiteral) {
      return ctx.createLiteral(null);
    }
    return ctx.createParenthesNode(
      ctx.createSequenceExpression([
        ctx.createToken(stack.argument),
        ctx.createLiteral(null)
      ])
    );
  }
  const node = ctx.createNode(stack);
  if (operator.charCodeAt(0) === 33) {
    node.argument = createExpressionTransformBooleanValueNode(ctx, stack.argument);
  } else {
    node.argument = ctx.createToken(stack.argument);
  }
  node.operator = operator;
  node.prefix = prefix;
  return node;
}

// lib/tokens/UpdateExpression.js
var import_Utils36 = __toESM(require("easescript/lib/core/Utils"));
init_Common2();
function trans2(ctx, stack, description, alias, objectType) {
  const type = objectType;
  let name = ctx.getAvailableOriginType(type) || type.toString();
  if (objectType && (objectType.isUnionType || objectType.isIntersectionType) && description && description.isMethodDefinition && description.module && description.module.isModule) {
    name = desc.module.id;
  }
  if (transforms_default.has(name)) {
    const object = transforms_default.get(name);
    const key = stack.computed ? "$computed" : stack.property.value();
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      if (stack.computed) {
        return object[key](
          stack,
          ctx,
          ctx.createToken(stack.object),
          [ctx.createToken(stack.property)],
          false,
          false
        );
      }
      if (description.static) {
        return object[key](
          stack,
          ctx,
          null,
          [],
          false,
          true
        );
      } else {
        return object[key](
          stack,
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
function UpdateExpression_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  const operator = stack.node.operator;
  const prefix = stack.node.prefix;
  const isMember = stack.argument.isMemberExpression;
  if (isMember) {
    const desc2 = stack.argument.description();
    const module2 = stack.module;
    let isReflect = false;
    if (stack.argument.computed) {
      const hasDynamic = desc2 && desc2.isComputeType && desc2.isPropertyExists();
      if (!hasDynamic && !import_Utils36.default.isLiteralObjectType(stack.argument.object.type())) {
        isReflect = true;
      }
    } else if (desc2 && desc2.isAnyType) {
      isReflect = !import_Utils36.default.isLiteralObjectType(stack.argument.object.type());
    }
    if (isReflect) {
      let method = operator === "++" ? "incre" : "decre";
      let object = ctx.createToken(stack.argument.object);
      if (!stack.argument.object.isIdentifier) {
        let refs = ctx.getLocalRefName(stack, "ref");
        ctx.insertTokenToBlock(
          stack,
          ctx.createAssignmentExpression(
            ctx.createVarIdentifier(refs),
            object
          )
        );
        object = ctx.createVarIdentifier(refs);
        if (ctx.isPassableReferenceExpress(stack.argument.object, stack.argument.object.type())) {
          object = createAddressRefsNode(ctx, object);
        }
      }
      return ctx.createCallExpression(
        createStaticReferenceNode2(ctx, stack, "Reflect", method),
        [
          createScopeIdNode(ctx, module2),
          object,
          createComputedPropertyNode(ctx, stack.argument),
          ctx.createLiteral(!!prefix)
        ],
        stack
      );
    } else if (desc2 && desc2.isMethodDefinition && desc2.isAccessor) {
      stack = stack.argument;
      let objectDescription = stack.object.description();
      let objectType = ctx.inferType(stack.object);
      let isNewObject = !!stack.object.isNewExpression;
      let isStatic = stack.object.isSuperExpression || objectType.isClassType || !isNewObject && import_Utils36.default.isClassType(objectDescription);
      let alias = getMethodOrPropertyAlias(ctx, stack);
      let result = trans2(ctx, stack, desc2, alias, objectType);
      if (result)
        return result;
      let getMember = [
        ctx.createToken(stack.object),
        ctx.createIdentifier(ctx.getAccessorName(alias || stack.property.value(), desc2, "get"))
      ];
      let setMember = [
        ctx.createToken(stack.object),
        ctx.createIdentifier(ctx.getAccessorName(alias || stack.property.value(), desc2, "set"))
      ];
      let getCallee = isStatic ? ctx.createStaticMemberExpression(getMember) : ctx.createMemberExpression(getMember);
      let setCallee = isStatic ? ctx.createStaticMemberExpression(setMember) : ctx.createMemberExpression(setMember);
      if (stack.parentStack.parentStack.isExpressionStatement) {
        let value = ctx.createBinaryExpression(
          ctx.createCallExpression(getCallee),
          ctx.createLiteral(1),
          operator === "++" ? "+" : "-"
        );
        return ctx.createCallExpression(setCallee, [value]);
      } else {
        let sequence = createStaticReferenceNode2(ctx, stack, "System", "sequences");
        let refs = ctx.getLocalRefName(stack, "V");
        let update = ctx.createBinaryExpression(
          ctx.createVarIdentifier(refs),
          ctx.createLiteral(1),
          operator === "++" ? "+" : "-"
        );
        if (prefix) {
          update = ctx.createAssignmentExpression(
            ctx.createVarIdentifier(refs),
            update
          );
        }
        return ctx.createCallExpression(sequence, [
          ctx.createAssignmentExpression(
            ctx.createVarIdentifier(refs),
            ctx.createCallExpression(getCallee)
          ),
          ctx.createCallExpression(setCallee, [update]),
          ctx.createVarIdentifier(refs)
        ]);
      }
    }
  }
  node.argument = ctx.createToken(stack.argument);
  node.operator = operator;
  node.prefix = prefix;
  return node;
}

// lib/tokens/VariableDeclaration.js
function VariableDeclaration_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  node.inFor = stack.flag;
  node.kind = stack.kind;
  node.declarations = stack.declarations.map((item) => {
    return ctx.createToken(item);
  });
  return node;
}

// lib/tokens/VariableDeclarator.js
init_Common2();
function VariableDeclarator_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  node.inFor = stack.parentStack.flag;
  if (stack.id.isIdentifier) {
    node.id = ctx.createIdentifier(stack.id.value(), stack.id);
  } else {
    node.id = ctx.createToken(stack.id);
  }
  if (stack.parentStack.isVariableDeclaration && stack.id.isIdentifier) {
    const type = ctx.inferType(stack, stack.init && stack.init.getContext());
    if (ctx.isAddressRefsType(type, stack.init)) {
      if (ctx.hasCrossScopeAssignment(stack.assignItems, !!node.inFor)) {
        const address = ctx.addAssignAddressRef(stack, stack.init);
        const name = stack.id.value();
        address.setName(stack, name);
        const left = address.createIndexName(stack);
        if (stack.init) {
          let init = ctx.createToken(stack.init);
          if (ctx.isPassableReferenceExpress(stack.init)) {
            if (init.type === "ParenthesizedExpression") {
              init = init.expression;
            }
            if (init.type === "AssignmentExpression") {
              ctx.insertTokenToBlock(stack, init);
              init = init.left;
            }
            init = createAddressRefsNode(ctx, init);
          }
          const index = address.getIndex(stack.init);
          const key = ctx.createAssignmentExpression(
            ctx.createVarIdentifier(left),
            ctx.createLiteral(index)
          );
          node.id = ctx.createComputeMemberExpression([
            node.id,
            key
          ]);
          node.init = init;
          return node;
        }
      } else if (stack.init && ctx.isPassableReferenceExpress(stack.init)) {
        let init = ctx.createToken(stack.init);
        if (init) {
          if (init.type === "ParenthesizedExpression") {
            init = init.expression;
          }
          if (init.type === "AssignmentExpression") {
            ctx.insertTokenToBlock(stack, init);
            init = init.left;
          }
        }
        if (stack.parentStack.parentStack.isExportNamedDeclaration) {
          let name = ctx.getLocalRefName(stack.init, AddressVariable_default.REFS_VALUE, stack.init);
          let refNode = ctx.createVariableDeclaration("const", [
            ctx.createVariableDeclarator(
              ctx.createIdentifier(name),
              createAddressRefsNode(ctx, node.init)
            )
          ]);
          ctx.insertTokenToBlock(stack, refNode);
          node.init = createAddressRefsNode(ctx, ctx.createVarIdentifier(name));
        } else {
          node.init = createAddressRefsNode(ctx, init);
        }
        return node;
      }
      if (node.inFor) {
        node.init = ctx.createToken(stack.init);
        return createAddressRefsNode(ctx, node);
      }
    }
  }
  node.init = ctx.createToken(stack.init);
  return node;
}

// lib/tokens/WhenStatement.js
init_Common2();
function WhenStatement_default2(ctx, stack) {
  const check2 = (stack2) => {
    if (stack2.isLogicalExpression) {
      if (stack2.isAndOperator) {
        return check2(stack2.left) && check2(stack2.right);
      } else {
        return check2(stack2.left) || check2(stack2.right);
      }
    } else if (!stack2.isCallExpression) {
      throw new Error(`Macro condition must is an call expression`);
    }
    const name = stack2.value();
    const lower = name.toLowerCase();
    const argument = parseMacroMethodArguments(stack2.arguments, lower);
    if (!argument) {
      ctx.error(`The '${name}' macro is not supported`, stack2);
      return;
    }
    switch (lower) {
      case "runtime":
        return isRuntime(argument.value, ctx.options.metadata) === argument.expect;
      case "syntax":
        return isSyntax(ctx.plugin.name, argument.value) === argument.expect;
      case "env":
        {
          if (argument.name && argument.value) {
            return isEnv(argument.name, argument.value, ctx.options) === argument.expect;
          } else {
            ctx.error(`Missing name or value arguments. the '${name}' annotations.`, stack2);
          }
        }
        break;
      case "version":
        {
          if (argument.name && argument.version) {
            let versions = ctx.options.metadata.versions || {};
            let left = argument.name === ctx.plugin.name ? ctx.plugin.version : versions[argument.name];
            let right = argument.version;
            return compareVersion(left, right, argument.operator) === argument.expect;
          } else {
            ctx.error(`Missing name or value arguments. the '${name}' annotations.`, stack2);
          }
        }
        break;
      default:
    }
  };
  const node = ctx.createToken(check2(stack.condition) ? stack.consequent : stack.alternate);
  node && (node.isWhenStatement = true);
  return node;
}

// lib/tokens/WhileStatement.js
init_Common2();
function WhileStatement_default2(ctx, stack) {
  const node = ctx.createNode(stack);
  node.condition = createExpressionTransformBooleanValueNode(ctx, stack.condition);
  node.body = ctx.createToken(stack.body);
  return node;
}

// lib/core/Builder.js
var import_glob_path2 = __toESM(require("glob-path"));
async function buildProgram2(ctx, compilation, graph) {
  let root = compilation.stack;
  if (!root) {
    throw new Error("Build program failed");
  }
  let body = [];
  let externals = [];
  let imports = [];
  let exports = [];
  let emitFile = ctx.options.emitFile;
  ctx.setNode(root, body);
  root.body.forEach((item) => {
    if (item.isClassDeclaration || item.isEnumDeclaration || item.isInterfaceDeclaration || item.isStructTableDeclaration || item.isPackageDeclaration) {
      const child = ctx.createToken(item);
      if (child) {
        body.push(child);
      }
    }
  });
  if (root.imports && root.imports.length > 0) {
    root.imports.forEach((item) => {
      if (item.isImportDeclaration) {
        ctx.createToken(item);
      }
    });
  }
  if (root.externals.length > 0) {
    root.externals.forEach((item) => {
      if (item.isImportDeclaration) {
        ctx.createToken(item);
      } else {
        const node = ctx.createToken(item);
        if (node) {
          externals.push(node);
        }
      }
    });
  }
  if (root.exports.length > 0) {
    root.exports.forEach((item) => {
      ctx.createToken(item);
    });
  }
  ctx.removeNode(root);
  if (emitFile) {
    await ctx.buildDeps();
  }
  ctx.crateRootAssets();
  ctx.createAllDependencies();
  let exportNodes = null;
  let importNodes = null;
  importNodes = createESMImports2(ctx, ctx.imports);
  exportNodes = createESMExports2(ctx, ctx.exports, graph);
  imports.push(...importNodes, ...exportNodes.imports);
  body.push(...exportNodes.declares);
  exports.push(...exportNodes.exports);
  let generator = new import_Generator5.default(ctx);
  let doc = compilation.mainModule || compilation;
  let mainModule = compilation.mainModule;
  let layout = [
    ...imports,
    ...Array.from(ctx.usings.values()),
    ...ctx.statments,
    ...ctx.beforeBody,
    ...body,
    ...ctx.afterBody,
    ...externals,
    ...exports
  ];
  if (mainModule) {
    let ns = mainModule.namespace;
    ns = ctx.getModuleMappingNamespace(mainModule) || ns.getChain().join("\\");
    if (ns) {
      layout.unshift(ctx.createNamespaceStatement(ns));
    }
  }
  if (layout.length > 0) {
    layout.forEach((item) => generator.make(item));
    graph.code = ctx.getFormatCode(generator.code);
    graph.sourcemap = generator.sourceMap;
    if (emitFile) {
      graph.outfile = ctx.getOutputAbsolutePath(doc);
    }
  }
  return graph;
}
async function buildAssets2(ctx, buildGraph) {
  let assets = buildGraph.assets;
  if (!assets)
    return;
  await Promise.all(
    Array.from(assets.values()).map((asset) => asset.build(ctx))
  );
}
function getTokenManager2(options) {
  let _createToken = options.transform.createToken;
  let _tokens = options.transform.tokens;
  let getToken = (type) => {
    return tokens_exports2[type];
  };
  let createToken = (ctx, stack, type) => {
    const token = getToken(type);
    if (!token) {
      throw new Error(`Token '${type}' is not exists.`);
    }
    try {
      return token(ctx, stack, type);
    } catch (e) {
      console.error(e);
    }
  };
  if (_tokens && typeof _tokens === "object" && Object.keys(_tokens).length > 0) {
    getToken = (type) => {
      if (Object.prototype.hasOwnProperty.call(_tokens, type)) {
        return _tokens[type];
      }
      return tokens_exports2[type];
    };
  }
  if (_createToken && typeof _createToken === "function") {
    createToken = (ctx, stack, type) => {
      try {
        return _createToken(ctx, stack, type);
      } catch (e) {
        console.error(e);
      }
    };
  }
  return {
    get: getToken,
    create: createToken
  };
}
function addResolveRule(glob, resolve) {
  Object.keys(resolve.namespaces).forEach((key) => {
    glob.addRuleGroup(key, resolve.namespaces[key], "namespaces");
  });
  Object.keys(resolve.folders).forEach((key) => {
    glob.addRuleGroup(key, resolve.folders[key], "folders");
  });
  const trueCallback = () => true;
  if (Array.isArray(resolve.usings)) {
    resolve.usings.forEach((key) => {
      if (typeof key === "object") {
        if (key.test === void 0 || key.value === void 0) {
          throw new TypeError(`options.resolve.usings the each rule item should is {test:'rule', value:true} object`);
        } else {
          if (typeof key.value === "function") {
            glob.addRuleGroup(key.test, key.value, "usings");
          } else {
            glob.addRuleGroup(key.test, () => key.value, "usings");
          }
        }
      } else {
        glob.addRuleGroup(key, trueCallback, "usings");
      }
    });
  } else {
    Object.keys(resolve.usings).forEach((key) => {
      if (typeof resolve.usings[key] === "function") {
        glob.addRuleGroup(key, resolve.usings[key], "usings");
      } else {
        throw new TypeError(`options.resolve.usings the '${key}' rule, should assignmented a function`);
      }
    });
  }
}
function createBuildContext2(plugin2, records3 = /* @__PURE__ */ new Map()) {
  let assets = getAssetsManager(Asset2);
  let virtuals = getVirtualModuleManager(VirtualModule2);
  let variables = getVariableManager();
  let graphs = getBuildGraphManager();
  let token = getTokenManager2(plugin2.options);
  let cache2 = getCacheManager();
  let glob = new import_glob_path2.default();
  addResolveRule(glob, plugin2.options.resolve || {});
  async function builder(compiOrVModule) {
    if (records3.has(compiOrVModule)) {
      return records3.get(compiOrVModule);
    }
    let ctx = new Context_default2(
      compiOrVModule,
      plugin2,
      variables,
      graphs,
      assets,
      virtuals,
      glob,
      cache2,
      token
    );
    let buildGraph = ctx.getBuildGraph(compiOrVModule);
    records3.set(compiOrVModule, buildGraph);
    if (isVModule(compiOrVModule)) {
      await compiOrVModule.build(ctx, buildGraph);
    } else {
      if (!compiOrVModule.parserDoneFlag) {
        await compiOrVModule.ready();
      }
      await buildProgram2(ctx, compiOrVModule, buildGraph);
    }
    if (ctx.options.emitFile) {
      await ctx.emit(buildGraph);
      await buildAssets2(ctx, buildGraph, true);
    } else {
      const deps = ctx.getAllDependencies();
      deps.forEach((dep) => {
        if (import_Utils37.default.isModule(dep) && dep.isStructTable) {
          dep.getStacks().forEach((stack) => {
            ctx.createToken(stack);
          });
        }
      });
      await buildAssets2(ctx, buildGraph);
    }
    return buildGraph;
  }
  async function buildDeps(ctx) {
    const deps = /* @__PURE__ */ new Set();
    ctx.dependencies.forEach((dataset) => {
      dataset.forEach((dep) => {
        if (import_Utils37.default.isModule(dep)) {
          if (dep.isDeclaratorModule) {
            dep = ctx.getVModule(dep.getName());
            if (dep) {
              deps.add(dep);
            }
          } else if (dep.compilation) {
            deps.add(dep.compilation);
          }
        } else if (isVModule(dep)) {
          deps.add(dep);
        } else if (import_Utils37.default.isCompilation(dep)) {
          deps.add(dep);
        }
      });
    });
    await callAsyncSequence(Array.from(deps.values()), async (dep) => {
      await builder(dep);
    });
  }
  return {
    builder,
    buildDeps,
    buildAssets: buildAssets2,
    assets,
    virtuals,
    variables,
    graphs,
    glob,
    token
  };
}

// lib/core/vms/Annotation.js
var Annotation = class extends VirtualModule2 {
  #added = /* @__PURE__ */ new Map();
  #builded = false;
  append(ctx, hashId, path11) {
    if (!this.#added.has(hashId)) {
      this.#added.set(hashId, path11);
      this.changed = true;
      if (this.#builded) {
        this.build(ctx);
      }
    }
  }
  makeManifestPropertyNode(ctx, outfile) {
    let manifests = [];
    this.#added.forEach((path11, hashId) => {
      let relativePath = ctx.getRelativePath(path11, outfile);
      let filepath2 = ctx.createBinaryExpression(
        ctx.createIdentifier("__DIR__"),
        ctx.createLiteral(relativePath),
        "."
      );
      manifests.push(
        ctx.createProperty(
          ctx.createLiteral(hashId),
          filepath2
        )
      );
    });
    let node = ctx.createPropertyDefinition(ctx.createIdentifier("manifests"), ctx.createObjectExpression(manifests));
    node.kind = "const";
    node.modifier = ctx.createIdentifier("private");
    return node;
  }
  makeGetContentMethodNode(ctx) {
    let node = ctx.createMethodDefinition("get", ctx.createBlockStatement([
      ctx.createExpressionStatement(
        ctx.createAssignmentExpression(
          ctx.createVarIdentifier("path"),
          ctx.createCallExpression(
            ctx.createStaticMemberExpression([
              ctx.createIdentifier("static"),
              ctx.createIdentifier("path")
            ]),
            [
              ctx.createVarIdentifier("id")
            ]
          )
        )
      ),
      ctx.createReturnStatement(ctx.createConditionalExpression(
        ctx.createVarIdentifier("path"),
        ctx.createCallExpression(
          ctx.createIdentifier("file_get_contents"),
          [
            ctx.createVarIdentifier("path")
          ]
        ),
        ctx.createLiteral(null)
      ))
    ]), [
      ctx.createVarIdentifier("id")
    ]);
    node.modifier = ctx.createIdentifier("public");
    node.static = true;
    return node;
  }
  makeGetPathMethodNode(ctx) {
    let node = ctx.createMethodDefinition("path", ctx.createBlockStatement([
      ctx.createReturnStatement(ctx.createBinaryExpression(ctx.createComputeMemberExpression([
        ctx.createStaticMemberExpression([
          ctx.createIdentifier("static"),
          ctx.createIdentifier("manifests")
        ]),
        ctx.createVarIdentifier("id")
      ]), ctx.createLiteral(null), "?:"))
    ]), [
      ctx.createVarIdentifier("id")
    ]);
    node.modifier = ctx.createIdentifier("public");
    node.static = true;
    return node;
  }
  makeGetAllMethodNode(ctx) {
    let node = ctx.createMethodDefinition("all", ctx.createBlockStatement([
      ctx.createReturnStatement(
        ctx.createCallExpression(
          ctx.createIdentifier("array_values"),
          [
            ctx.createStaticMemberExpression([
              ctx.createIdentifier("static"),
              ctx.createIdentifier("manifests")
            ])
          ]
        )
      )
    ]));
    node.modifier = ctx.createIdentifier("public");
    node.static = true;
    return node;
  }
  async build(ctx) {
    const graph = ctx.getBuildGraph(this.bindModule || this);
    if (!this.changed && graph.code)
      return graph;
    this.changed = false;
    this.createImports(ctx);
    this.createReferences(ctx, graph);
    let outfile = graph.outfile || ctx.getOutputAbsolutePath(this);
    let node = ctx.createClassDeclaration();
    node.id = ctx.createIdentifier("Annotation");
    node.body.body.push(...[
      this.makeManifestPropertyNode(ctx, outfile),
      this.makeGetContentMethodNode(ctx),
      this.makeGetPathMethodNode(ctx),
      this.makeGetAllMethodNode(ctx)
    ]);
    let body = [node];
    ctx.createAllDependencies();
    graph.code = ctx.getFormatCode(this.gen(ctx, graph, body).code);
    graph.outfile = outfile;
    return graph;
  }
};
var Annotation_default = Annotation;

// lib/core/vms/Manifest.js
var Manifest2 = class extends VirtualModule2 {
  #added = /* @__PURE__ */ new Map();
  #builded = false;
  append(ctx, hashId, path11) {
    if (!this.#added.has(hashId)) {
      this.#added.set(hashId, path11);
      this.changed = true;
      if (this.#builded) {
        this.build(ctx);
      }
    }
  }
  makeManifestPropertyNode(ctx, outfile) {
    let manifests = [];
    this.#added.forEach((path11, hashId) => {
      let relativePath = ctx.getRelativePath(path11, outfile);
      let filepath2 = ctx.createBinaryExpression(
        ctx.createIdentifier("__DIR__"),
        ctx.createLiteral(relativePath),
        "."
      );
      manifests.push(
        ctx.createProperty(
          ctx.createLiteral(hashId),
          filepath2
        )
      );
    });
    let node = ctx.createPropertyDefinition(ctx.createIdentifier("manifests"), ctx.createObjectExpression(manifests));
    node.kind = "const";
    node.modifier = ctx.createIdentifier("private");
    return node;
  }
  makeGetContentMethodNode(ctx) {
    let node = ctx.createMethodDefinition("get", ctx.createBlockStatement([
      ctx.createExpressionStatement(
        ctx.createAssignmentExpression(
          ctx.createVarIdentifier("path"),
          ctx.createCallExpression(
            ctx.createStaticMemberExpression([
              ctx.createIdentifier("static"),
              ctx.createIdentifier("path")
            ]),
            [
              ctx.createVarIdentifier("id")
            ]
          )
        )
      ),
      ctx.createReturnStatement(ctx.createConditionalExpression(
        ctx.createVarIdentifier("path"),
        ctx.createCallExpression(
          ctx.createIdentifier("file_get_contents"),
          [
            ctx.createVarIdentifier("path")
          ]
        ),
        ctx.createLiteral(null)
      ))
    ]), [
      ctx.createVarIdentifier("id")
    ]);
    node.modifier = ctx.createIdentifier("public");
    node.static = true;
    return node;
  }
  makeGetPathMethodNode(ctx) {
    let node = ctx.createMethodDefinition("path", ctx.createBlockStatement([
      ctx.createReturnStatement(ctx.createBinaryExpression(ctx.createComputeMemberExpression([
        ctx.createStaticMemberExpression([
          ctx.createIdentifier("static"),
          ctx.createIdentifier("manifests")
        ]),
        ctx.createVarIdentifier("id")
      ]), ctx.createLiteral(null), "?:"))
    ]), [
      ctx.createVarIdentifier("id")
    ]);
    node.modifier = ctx.createIdentifier("public");
    node.static = true;
    return node;
  }
  makeGetAllMethodNode(ctx) {
    let node = ctx.createMethodDefinition("all", ctx.createBlockStatement([
      ctx.createReturnStatement(
        ctx.createCallExpression(
          ctx.createIdentifier("array_values"),
          [
            ctx.createStaticMemberExpression([
              ctx.createIdentifier("static"),
              ctx.createIdentifier("manifests")
            ])
          ]
        )
      )
    ]));
    node.modifier = ctx.createIdentifier("public");
    node.static = true;
    return node;
  }
  async build(ctx) {
    const graph = ctx.getBuildGraph(this.bindModule || this);
    if (!this.changed)
      return graph;
    this.changed = false;
    this.createImports(ctx);
    this.createReferences(ctx, graph);
    let outfile = graph.outfile || ctx.getOutputAbsolutePath(this);
    let node = ctx.createClassDeclaration();
    node.id = ctx.createIdentifier("Manifest");
    node.body.body.push(...[
      this.makeManifestPropertyNode(ctx, outfile),
      this.makeGetContentMethodNode(ctx),
      this.makeGetPathMethodNode(ctx),
      this.makeGetAllMethodNode(ctx)
    ]);
    let body = [node];
    ctx.createAllDependencies();
    graph.code = ctx.getFormatCode(this.gen(ctx, graph, body).code);
    graph.outfile = outfile;
    this.#builded = true;
    return graph;
  }
};
var Manifest_default2 = Manifest2;

// lib/core/vms/index.js
var vms_default = {
  "asset.Manifest": Manifest_default2,
  "asset.Annotation": Annotation_default
};

// lib/core/Plugin.js
function defineError2(complier) {
  if (defineError2.loaded || !complier || !complier.diagnostic)
    return;
  defineError2.loaded = true;
  let define = complier.diagnostic.defineError;
  define(2e4, "", [
    "\u7C7B(%s)\u547D\u540D\u7A7A\u95F4\u5FC5\u987B\u4E0E\u6587\u4EF6\u8DEF\u5F84\u4E00\u81F4",
    "The '%s' class namespace must be consistent with the file path"
  ]);
}
var Plugin2 = class extends Plugin_default {
  #records = null;
  #initialized = false;
  #context = null;
  #complier = null;
  constructor(name, version, options = {}) {
    super(name, version, options);
  }
  get complier() {
    return this.#complier;
  }
  get context() {
    return this.#context;
  }
  init(complier) {
    if (!this.#initialized) {
      this.#initialized = true;
      this.#complier = complier;
      this.#records = /* @__PURE__ */ new Map();
      defineError2(complier);
      if (this.options.mode === "development") {
        let tableBuilders = null;
        complier.on("onChanged", (compilation) => {
          this.#records.delete(compilation);
          let mainModule = compilation.mainModule;
          if (mainModule.isStructTable) {
            tableBuilders = tableBuilders || getAllBuilder();
            compilation.modules.forEach((module2) => {
              if (module2.isStructTable) {
                tableBuilders.forEach((builder) => {
                  builder.removeTable(module2.id);
                });
              }
            });
          }
        });
      }
      let context = createBuildContext2(this, this.#records);
      this.#context = context;
      createPolyfillModule(
        import_path10.default.join(__dirname, "./polyfills"),
        context.virtuals.createVModule
      );
      Object.keys(vms_default).forEach((key) => {
        context.virtuals.createVModule(key, vms_default[key]);
      });
    }
  }
  async buildIncludes() {
    const includes = this.options.includes || [];
    if (!(includes.length > 0))
      return;
    const files = includes.map((file) => this.complier.resolveRuleFiles(file)).flat().filter((file) => this.complier.checkFileExt(file));
    await Promise.allSettled(files.map(async (file) => {
      const compilation = await this.complier.createCompilation(file, null, true);
      if (compilation) {
        await compilation.ready();
      }
    }));
  }
  async build(compilation, moduleId) {
    if (!import_Compilation2.default.is(compilation)) {
      throw new Error("compilation is invalid");
    }
    if (!this.#initialized) {
      this.init(compilation.complier);
    }
    if (moduleId) {
      compilation = this.#context.virtuals.getVModule(moduleId);
      if (!compilation) {
        throw new Error(`The '${moduleId}' virtual module does not exists.`);
      }
    }
    return await this.#context.builder(compilation);
  }
};
var Plugin_default2 = Plugin2;

// package.json
var package_default = {
  name: "@easescript/es-php",
  version: "0.0.1",
  description: "Code Transform To PHP For EaseScript Plugin",
  main: "dist/index.js",
  typings: "dist/types/typings.json",
  scripts: {
    dev: "node ./scripts/build.js && jasmine ./test/index.js",
    compiler: "jasmine ./test/index.js",
    run: "node ./test/phptest.js",
    test: "npm run dev & npm run run",
    build: "npm run manifest & node ./scripts/build.js",
    manifest: "esc -o types -f types/php.d.es --manifest --scope es-php"
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
    "@easescript/transform": "latest",
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
    "easescript-cli": "latest",
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

// lib/index.js
var import_lodash = require("lodash");
var defaultConfig = {
  target: 7,
  strict: true,
  emitFile: true,
  useAbsolutePathImport: false,
  import: true,
  outDir: ".output",
  outExt: ".php",
  publicPath: "public",
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
  transform: {
    createToken: null,
    tokens: null
  },
  composer: null,
  consistent: true,
  assets: /\.(gif|png|jpeg|jpg|svg|bmp|icon|font|css|less|sass|scss|js|mjs|cjs|vue|ts)$/i,
  bundle: {
    enable: false,
    extensions: [".js", ".mjs", ".cjs", ".vue", ".es", ".ts", ".sass", ".scss", ".less"],
    plugins: [],
    esbuildOptions: {}
  },
  lessOptions: {},
  sassOptions: {},
  comments: false,
  manifests: {
    comments: false,
    annotations: false
  },
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
      "*.global": "escore",
      "*.assets": "public"
    },
    namespaces: {}
  },
  folderAsNamespace: true,
  externals: [],
  excludes: [],
  includes: [],
  esx: {
    enable: true,
    raw: false,
    handle: "createVNode",
    complete: {
      //['for','each','condition','*']
      keys: false
    },
    delimit: {
      expression: {
        left: "{{",
        right: "}}"
      },
      attrs: {
        left: '"',
        right: '"'
      }
    },
    component: {
      prefix: "",
      resolve: null
    }
  }
};
function merge2(...args) {
  return (0, import_lodash.mergeWith)(...args, (objValue, srcValue) => {
    if (Array.isArray(objValue) && Array.isArray(srcValue)) {
      if (srcValue[0] === null)
        return srcValue.slice(1);
      srcValue.forEach((value) => {
        if (!objValue.includes(value)) {
          objValue.push(value);
        }
      });
      return objValue;
    }
  });
}
function getOptions(options) {
  return merge2({}, defaultConfig, options);
}
function plugin(options = {}) {
  return new Plugin_default2(
    package_default.esconfig.scope,
    package_default.version,
    getOptions(options)
  );
}
var lib_default = plugin;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Plugin,
  getOptions
});
