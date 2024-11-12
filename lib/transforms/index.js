import Array from "./Array.js"
import Base64 from "./Base64.js"
import ConsoleInterface from "./ConsoleInterface.js"
import Error from "./Error.js"
import Function from "./Function.js"
import global from "./global.js"
import IArguments from "./IArguments.js"
import JSON from "./JSON.js"
import Math from "./Math.js"
import Number from "./Number.js"
import Object from "./Object.js"
import String from "./String.js"
import System from "./System.js"
import * as Uint from "./Uint.js"
import * as Double from "./Double.js"
import * as Float from "./Float.js"
import * as Int from "./Int.js"

const modules = new Map();
modules.set('Array', Array);
modules.set('Base64', Base64);
modules.set('ConsoleInterface', ConsoleInterface);
modules.set('Error', Error);
modules.set('Function', Function);
modules.set('global', global);
modules.set('IArguments', IArguments);
modules.set('JSON', JSON);
modules.set('Math', Math);
modules.set('Number', Number);
modules.set('Int', Int);
modules.set('Uint', Uint);
modules.set('Double', Double);
modules.set('Float', Float);
modules.set('Object', Object);
modules.set('String', String);
modules.set('System', System);
export default modules;
