import { runOop } from "./oop.js";
import { runProc } from "./refactor_proc.js";
import { data } from "./data.js";
import { runOrig } from "./orig.js";

runOrig(data);

console.log("---");

runOop(data);

console.log("---");

runProc(data);
