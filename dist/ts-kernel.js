var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toESM = (module2, isNodeMode) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

// node_modules/.pnpm/short-unique-id@4.4.4/node_modules/short-unique-id/dist/short-unique-id.js
var require_short_unique_id = __commonJS({
  "node_modules/.pnpm/short-unique-id@4.4.4/node_modules/short-unique-id/dist/short-unique-id.js"(exports, module2) {
    var ShortUniqueId2 = (() => {
      var __defProp2 = Object.defineProperty;
      var __getOwnPropSymbols = Object.getOwnPropertySymbols;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __propIsEnum = Object.prototype.propertyIsEnumerable;
      var __defNormalProp = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
      var __spreadValues = (a, b) => {
        for (var prop in b || (b = {}))
          if (__hasOwnProp2.call(b, prop))
            __defNormalProp(a, prop, b[prop]);
        if (__getOwnPropSymbols)
          for (var prop of __getOwnPropSymbols(b)) {
            if (__propIsEnum.call(b, prop))
              __defNormalProp(a, prop, b[prop]);
          }
        return a;
      };
      var __markAsModule2 = (target) => __defProp2(target, "__esModule", { value: true });
      var __export2 = (target, all) => {
        __markAsModule2(target);
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var src_exports2 = {};
      __export2(src_exports2, {
        DEFAULT_UUID_LENGTH: () => DEFAULT_UUID_LENGTH,
        default: () => ShortUniqueId3
      });
      var version2 = "4.4.4";
      var DEFAULT_UUID_LENGTH = 6;
      var DEFAULT_OPTIONS = {
        dictionary: "alphanum",
        shuffle: true,
        debug: false,
        length: DEFAULT_UUID_LENGTH
      };
      var _ShortUniqueId = class extends Function {
        constructor(argOptions = {}) {
          super();
          this.dictIndex = 0;
          this.dictRange = [];
          this.lowerBound = 0;
          this.upperBound = 0;
          this.dictLength = 0;
          this._digit_first_ascii = 48;
          this._digit_last_ascii = 58;
          this._alpha_lower_first_ascii = 97;
          this._alpha_lower_last_ascii = 123;
          this._hex_last_ascii = 103;
          this._alpha_upper_first_ascii = 65;
          this._alpha_upper_last_ascii = 91;
          this._number_dict_ranges = {
            digits: [this._digit_first_ascii, this._digit_last_ascii]
          };
          this._alpha_dict_ranges = {
            lowerCase: [this._alpha_lower_first_ascii, this._alpha_lower_last_ascii],
            upperCase: [this._alpha_upper_first_ascii, this._alpha_upper_last_ascii]
          };
          this._alpha_lower_dict_ranges = {
            lowerCase: [this._alpha_lower_first_ascii, this._alpha_lower_last_ascii]
          };
          this._alpha_upper_dict_ranges = {
            upperCase: [this._alpha_upper_first_ascii, this._alpha_upper_last_ascii]
          };
          this._alphanum_dict_ranges = {
            digits: [this._digit_first_ascii, this._digit_last_ascii],
            lowerCase: [this._alpha_lower_first_ascii, this._alpha_lower_last_ascii],
            upperCase: [this._alpha_upper_first_ascii, this._alpha_upper_last_ascii]
          };
          this._alphanum_lower_dict_ranges = {
            digits: [this._digit_first_ascii, this._digit_last_ascii],
            lowerCase: [this._alpha_lower_first_ascii, this._alpha_lower_last_ascii]
          };
          this._alphanum_upper_dict_ranges = {
            digits: [this._digit_first_ascii, this._digit_last_ascii],
            upperCase: [this._alpha_upper_first_ascii, this._alpha_upper_last_ascii]
          };
          this._hex_dict_ranges = {
            decDigits: [this._digit_first_ascii, this._digit_last_ascii],
            alphaDigits: [this._alpha_lower_first_ascii, this._hex_last_ascii]
          };
          this.log = (...args) => {
            const finalArgs = [...args];
            finalArgs[0] = `[short-unique-id] ${args[0]}`;
            if (this.debug === true) {
              if (typeof console !== "undefined" && console !== null) {
                return console.log(...finalArgs);
              }
            }
          };
          this.setDictionary = (dictionary2, shuffle2) => {
            let finalDict;
            if (dictionary2 && Array.isArray(dictionary2) && dictionary2.length > 1) {
              finalDict = dictionary2;
            } else {
              finalDict = [];
              let i;
              this.dictIndex = i = 0;
              const rangesName = `_${dictionary2}_dict_ranges`;
              const ranges = this[rangesName];
              Object.keys(ranges).forEach((rangeType) => {
                const rangeTypeKey = rangeType;
                this.dictRange = ranges[rangeTypeKey];
                this.lowerBound = this.dictRange[0];
                this.upperBound = this.dictRange[1];
                for (this.dictIndex = i = this.lowerBound; this.lowerBound <= this.upperBound ? i < this.upperBound : i > this.upperBound; this.dictIndex = this.lowerBound <= this.upperBound ? i += 1 : i -= 1) {
                  finalDict.push(String.fromCharCode(this.dictIndex));
                }
              });
            }
            if (shuffle2) {
              const PROBABILITY = 0.5;
              finalDict = finalDict.sort(() => Math.random() - PROBABILITY);
            }
            this.dict = finalDict;
            this.dictLength = this.dict.length;
            this.counter = 0;
          };
          this.seq = () => {
            return this.sequentialUUID();
          };
          this.sequentialUUID = () => {
            let counterDiv;
            let counterRem;
            let id = "";
            counterDiv = this.counter;
            do {
              counterRem = counterDiv % this.dictLength;
              counterDiv = Math.trunc(counterDiv / this.dictLength);
              id += this.dict[counterRem];
            } while (counterDiv !== 0);
            this.counter += 1;
            return id;
          };
          this.randomUUID = (uuidLength = this.uuidLength || DEFAULT_UUID_LENGTH) => {
            let id;
            let randomPartIdx;
            let j;
            if (uuidLength === null || typeof uuidLength === "undefined" || uuidLength < 1) {
              throw new Error("Invalid UUID Length Provided");
            }
            const isPositive = uuidLength >= 0;
            id = "";
            for (j = 0; j < uuidLength; j += 1) {
              randomPartIdx = parseInt((Math.random() * this.dictLength).toFixed(0), 10) % this.dictLength;
              id += this.dict[randomPartIdx];
            }
            return id;
          };
          this.availableUUIDs = (uuidLength = this.uuidLength) => {
            return parseFloat(Math.pow([...new Set(this.dict)].length, uuidLength).toFixed(0));
          };
          this.approxMaxBeforeCollision = (rounds = this.availableUUIDs(this.uuidLength)) => {
            return parseFloat(Math.sqrt(Math.PI / 2 * rounds).toFixed(20));
          };
          this.collisionProbability = (rounds = this.availableUUIDs(this.uuidLength), uuidLength = this.uuidLength) => {
            return parseFloat((this.approxMaxBeforeCollision(rounds) / this.availableUUIDs(uuidLength)).toFixed(20));
          };
          this.uniqueness = (rounds = this.availableUUIDs(this.uuidLength)) => {
            const score = parseFloat((1 - this.approxMaxBeforeCollision(rounds) / rounds).toFixed(20));
            return score > 1 ? 1 : score < 0 ? 0 : score;
          };
          this.getVersion = () => {
            return this.version;
          };
          this.stamp = (finalLength) => {
            if (typeof finalLength !== "number" || finalLength < 10) {
              throw new Error("Param finalLength must be number greater than 10");
            }
            const hexStamp2 = Math.floor(+new Date() / 1e3).toString(16);
            const idLength = finalLength - 9;
            const rndIdx = Math.round(Math.random() * (idLength > 15 ? 15 : idLength));
            const id = this.randomUUID(idLength);
            return `${id.substr(0, rndIdx)}${hexStamp2}${id.substr(rndIdx)}${rndIdx.toString(16)}`;
          };
          this.parseStamp = (stamp) => {
            if (stamp.length < 10) {
              throw new Error("Stamp length invalid");
            }
            const rndIdx = parseInt(stamp.substr(stamp.length - 1, 1), 16);
            return new Date(parseInt(stamp.substr(rndIdx, 8), 16) * 1e3);
          };
          const options = __spreadValues(__spreadValues({}, DEFAULT_OPTIONS), argOptions);
          this.counter = 0;
          this.debug = false;
          this.dict = [];
          this.version = version2;
          const {
            dictionary,
            shuffle,
            length
          } = options;
          this.uuidLength = length;
          this.setDictionary(dictionary, shuffle);
          this.debug = options.debug;
          this.log(this.dict);
          this.log(`Generator instantiated with Dictionary Size ${this.dictLength}`);
          return new Proxy(this, {
            apply: (target, that, args) => this.randomUUID(...args)
          });
        }
      };
      var ShortUniqueId3 = _ShortUniqueId;
      ShortUniqueId3.default = _ShortUniqueId;
      return src_exports2;
    })();
    typeof module2 != "undefined" && (module2.exports = ShortUniqueId2.default), typeof window != "undefined" && (ShortUniqueId2 = ShortUniqueId2.default);
  }
});

// node_modules/.pnpm/dotenv@16.0.0/node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "node_modules/.pnpm/dotenv@16.0.0/node_modules/dotenv/lib/main.js"(exports, module2) {
    var fs = require("fs");
    var path = require("path");
    var os = require("os");
    var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function parse(src) {
      const obj = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/mg, "\n");
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (maybeQuote === '"') {
          value = value.replace(/\\n/g, "\n");
          value = value.replace(/\\r/g, "\r");
        }
        obj[key] = value;
      }
      return obj;
    }
    function _log(message) {
      console.log(`[dotenv][DEBUG] ${message}`);
    }
    function _resolveHome(envPath) {
      return envPath[0] === "~" ? path.join(os.homedir(), envPath.slice(1)) : envPath;
    }
    function config(options) {
      let dotenvPath = path.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      const debug = Boolean(options && options.debug);
      const override = Boolean(options && options.override);
      if (options) {
        if (options.path != null) {
          dotenvPath = _resolveHome(options.path);
        }
        if (options.encoding != null) {
          encoding = options.encoding;
        }
      }
      try {
        const parsed = DotenvModule.parse(fs.readFileSync(dotenvPath, { encoding }));
        Object.keys(parsed).forEach(function(key) {
          if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
            process.env[key] = parsed[key];
          } else {
            if (override === true) {
              process.env[key] = parsed[key];
            }
            if (debug) {
              if (override === true) {
                _log(`"${key}" is already defined in \`process.env\` and WAS overwritten`);
              } else {
                _log(`"${key}" is already defined in \`process.env\` and was NOT overwritten`);
              }
            }
          }
        });
        return { parsed };
      } catch (e) {
        if (debug) {
          _log(`Failed to load ${dotenvPath} ${e.message}`);
        }
        return { error: e };
      }
    }
    var DotenvModule = {
      config,
      parse
    };
    module2.exports.config = DotenvModule.config;
    module2.exports.parse = DotenvModule.parse;
    module2.exports = DotenvModule;
  }
});

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default
});
var import_mono_context6 = __toESM(require("@simplyhexagonal/mono-context"));
var import_logger = __toESM(require("@simplyhexagonal/logger"));

// src/cli/index.ts
var import_path = require("path");
var import_fs = require("fs");
var import_mono_context = __toESM(require("@simplyhexagonal/mono-context"));
var cli_default = async () => {
  const logger2 = import_mono_context.default.getStateValue("logger");
  if (process.argv[2] === "--version") {
    console.log(require((0, import_path.resolve)(__dirname, "../package.json")).version);
    process.exit(0);
  }
  if (process.argv[2] === "install") {
    const possiblePaths = [
      `${process.env.HOME}/.local/share/jupyter/kernels`,
      `${process.env.HOME}/Library/Jupyter/kernels`,
      `${process.env.APPDATA}/jupyter/kernels`
    ];
    let kernelsPath = "";
    logger2.info("Looking for kernels directory in:\n\n	", possiblePaths.map((p) => p.replace("undefined", "%APPDATA%")).join("\n	 "));
    try {
      kernelsPath = possiblePaths.find((path) => (0, import_fs.statSync)(path).isDirectory());
    } catch (e) {
      await logger2.error("Could not find kernels path!");
      process.exit(10);
    }
    const installFilePath = `${kernelsPath}/typescript/kernel.json`;
    await logger2.info("Found kernels path:", kernelsPath, "\n\nInstalling Typescript kernel to:", installFilePath);
    try {
      (0, import_fs.mkdirSync)(`${kernelsPath}/typescript`, { recursive: true });
      (0, import_fs.writeFileSync)(installFilePath, (0, import_fs.readFileSync)((0, import_path.resolve)(__dirname, "../kernel.json")));
    } catch (e) {
      await logger2.error("Could not install kernel!", e);
      process.exit(15);
    }
    await logger2.info("Installed kernel successfully!");
    process.exit(0);
  }
};

// src/threads/main/index.ts
var import_path2 = require("path");
var import_child_process = require("child_process");
var import_mono_context2 = __toESM(require("@simplyhexagonal/mono-context"));
var startThread = (threadName, jupyterConfigPath, reject) => {
  const logger2 = import_mono_context2.default.getStateValue("logger");
  const tsKernelPath = (0, import_path2.resolve)(__dirname, "..", "bin", "ts-kernel");
  const thread = (0, import_child_process.fork)(tsKernelPath, {
    env: {
      ...process.env,
      NODE_OPTIONS: threadName === "shell" ? "" : "--max-old-space-size=256",
      TS_KERNEL_THREAD: threadName,
      JUPYTER_CONFIG_PATH: jupyterConfigPath
    }
  });
  thread.on("error", (e) => {
    logger2.error("Heartbeat thread error:", e);
    reject(e);
  });
  thread.on("exit", (code) => {
    if (code !== 0) {
      const errorMessage = `Thread stopped with exit code ${code}`;
      logger2.error(errorMessage);
      reject(new Error(errorMessage));
    }
  });
};
var main_default = async (jupyterConfigPath, jupyterConfig) => {
  const logger2 = import_mono_context2.default.getStateValue("logger");
  await logger2.info("Starting Typescript kernel with config:", jupyterConfig);
  return new Promise(({}, reject) => {
    startThread("heartbeat", jupyterConfigPath, reject);
    startThread("control", jupyterConfigPath, reject);
    startThread("shell", jupyterConfigPath, reject);
  });
};

// src/threads/heartbeat/index.ts
var import_mono_context3 = __toESM(require("@simplyhexagonal/mono-context"));
var import_zeromq = __toESM(require("zeromq"));
var heartbeat_default = (jupyterConfig) => {
  const logger2 = import_mono_context3.default.getStateValue("logger");
  logger2.info("Heartbeat thread started");
  const heartbeatSocket = import_zeromq.default.socket("rep");
  heartbeatSocket.bindSync(`tcp://${jupyterConfig.ip}:${jupyterConfig.hb_port}`);
  heartbeatSocket.on("message", async (msg) => {
    heartbeatSocket.send(msg);
  });
};

// src/threads/shell/index.ts
var import_mono_context5 = __toESM(require("@simplyhexagonal/mono-context"));

// src/utils/index.ts
var import_crypto = require("crypto");
var import_short_unique_id = __toESM(require_short_unique_id());
var uid = new import_short_unique_id.default();
var msgConsecutive = 0;
var instanceUid = uid(24);
var hexStamp = Math.floor(+new Date() / 1e3).toString(16);
var msgUid = () => {
  msgConsecutive += 1;
  return `${hexStamp}-${instanceUid}_${msgConsecutive}`;
};
var send = (socket, {
  key,
  header,
  parentHeader,
  metadata = {},
  content,
  zmqIdentities,
  delimiter
}) => {
  const reply = [
    Buffer.from(JSON.stringify(header), "ascii"),
    parentHeader,
    Buffer.from(JSON.stringify(metadata), "ascii"),
    Buffer.from(JSON.stringify(content), "ascii")
  ];
  const replySignature = (0, import_crypto.createHmac)("sha256", key);
  reply.forEach((x) => replySignature.update(x));
  reply.unshift(Buffer.from(replySignature.digest("hex"), "ascii"));
  reply.unshift(delimiter);
  reply.unshift(zmqIdentities);
  socket.send(reply);
};
var makeHeader = (msg_type, session, version2) => ({
  msg_type,
  session,
  version: version2,
  msg_id: msgUid(),
  username: "kernel",
  date: new Date().toISOString()
});

// package.json
var version = "1.0.0";

// src/threads/shell/kernelInfoReply.ts
var kernelInfoReply_default = ({
  shellSocket,
  ioSocket,
  key,
  session,
  version: version2,
  rawHeader,
  zmqIdentities,
  delimiter
}) => {
  const content = {
    status: "ok",
    protocol_version: "5.0",
    implementation: "typescript",
    implementation_version: version,
    language_info: {
      name: "typescript",
      version: "1.0",
      mimetype: "text/x-typescript",
      file_extension: ".ts",
      pygments_lexer: "ts",
      codemirror_mode: "ts",
      nbconvert_exporter: ""
    },
    banner: "",
    debugger: false
  };
  send(shellSocket, {
    key,
    header: makeHeader("kernel_info_reply", session, version2),
    parentHeader: rawHeader,
    content,
    zmqIdentities,
    delimiter
  });
  send(ioSocket, {
    key,
    header: makeHeader("status", session, version2),
    parentHeader: rawHeader,
    content: {
      execution_state: "idle"
    },
    zmqIdentities,
    delimiter
  });
};

// src/threads/shell/executeReply.ts
var import_path3 = require("path");
var import_fs2 = require("fs");
var import_mono_context4 = __toESM(require("@simplyhexagonal/mono-context"));
var import_exec = __toESM(require("@simplyhexagonal/exec"));
var executionCount = 0;
var executeReply_default = async ({
  shellSocket,
  ioSocket,
  key,
  session,
  version: version2,
  rawHeader,
  content: reqContent,
  zmqIdentities,
  delimiter
}) => {
  const logger2 = import_mono_context4.default.getStateValue("logger");
  executionCount += 1;
  let content = {
    execution_state: "busy"
  };
  send(ioSocket, {
    key,
    header: makeHeader("status", session, version2),
    parentHeader: rawHeader,
    content,
    zmqIdentities,
    delimiter
  });
  content = {
    execution_count: executionCount,
    code: reqContent.code
  };
  send(ioSocket, {
    key,
    header: makeHeader("execute_input", session, version2),
    parentHeader: rawHeader,
    content,
    zmqIdentities,
    delimiter
  });
  const tempTsFile = (0, import_path3.resolve)(process.cwd(), `._${instanceUid}-${executionCount}.ts`);
  (0, import_fs2.writeFileSync)(tempTsFile, reqContent.code);
  const { exitCode, stdoutOutput, stderrOutput } = await (0, import_exec.default)(`${(0, import_path3.resolve)(__dirname, "..", "node_modules", ".bin", "ts-node")} --swc ${tempTsFile}`).catch(async (e) => {
    await logger2.error(e);
    return e;
  });
  (0, import_fs2.rmSync)(tempTsFile);
  content = {
    execution_count: executionCount,
    data: { "text/html": exitCode ? `<div style="border: 1px solid red; padding: 20px; background: #ffaaaa;"><pre>${stderrOutput}</pre></div>` : stdoutOutput },
    metadata: {}
  };
  send(ioSocket, {
    key,
    header: makeHeader("execute_result", session, version2),
    parentHeader: rawHeader,
    content,
    zmqIdentities,
    delimiter
  });
  content = {
    execution_state: "idle"
  };
  send(ioSocket, {
    key,
    header: makeHeader("status", session, version2),
    parentHeader: rawHeader,
    content,
    zmqIdentities,
    delimiter
  });
  const metadata = {
    dependencies_met: true,
    engine: instanceUid,
    status: "ok",
    started: new Date().toISOString()
  };
  content = {
    status: "ok",
    execution_count: executionCount,
    user_variables: {},
    payload: [],
    user_expressions: {}
  };
  send(shellSocket, {
    key,
    header: makeHeader("kernel_info_reply", session, version2),
    parentHeader: rawHeader,
    metadata,
    content,
    zmqIdentities,
    delimiter
  });
};

// src/threads/shell/index.ts
var reqResMap = {
  "kernel_info_request": kernelInfoReply_default,
  "execute_request": executeReply_default
};
var shell_default = ({ ip, shell_port, iopub_port, key }) => {
  const zmq2 = require("zeromq");
  const logger2 = import_mono_context5.default.getStateValue("logger");
  logger2.info("Shell thread started");
  const shellSocket = zmq2.socket("router");
  const ioSocket = zmq2.socket("pub");
  shellSocket.bindSync(`tcp://${ip}:${shell_port}`);
  ioSocket.bindSync(`tcp://${ip}:${iopub_port}`);
  shellSocket.on("message", async (zmqIdentities, delimiter, hmacSignature, rawHeader, rawParentHeader, rawMetadata, rawContent) => {
    const {
      msg_type: msgType,
      session,
      version: version2
    } = JSON.parse(rawHeader.toString("ascii"));
    const content = JSON.parse(rawContent.toString("ascii"));
    reqResMap[msgType]({
      shellSocket,
      ioSocket,
      key,
      session,
      version: version2,
      rawHeader,
      content,
      zmqIdentities,
      delimiter
    });
  });
};

// src/index.ts
require_main().config();
var logger = new import_logger.default({});
import_mono_context6.default.setState({
  logger
});
var src_default = async () => {
  await cli_default();
  const jupyterConfigPath = process.argv[2] || process.env.JUPYTER_CONFIG_PATH || "";
  const jupyterConfig = require(jupyterConfigPath);
  const threadName = process.env.TS_KERNEL_THREAD || "";
  if (!["heartbeat", "control", "shell"].includes(threadName)) {
    return main_default(jupyterConfigPath, jupyterConfig);
  }
  switch (threadName) {
    case "heartbeat":
      heartbeat_default(jupyterConfig);
      break;
    case "shell":
      shell_default(jupyterConfig);
      break;
  }
};
module.exports = __toCommonJS(src_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=ts-kernel.js.map
