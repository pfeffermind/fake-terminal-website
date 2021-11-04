"use strict";

/**
* Configs
*/
var configs = (function () {
  var instance;
  var Singleton = function (options) {
    var options = options || Singleton.defaultOptions;
    for (var key in Singleton.defaultOptions) {
      this[key] = options[key] || Singleton.defaultOptions[key];
    }
  };
  Singleton.defaultOptions = {
    bruteForceAttack: "?b = 0x00 - 0xff Progression : [1-99%] Geschätzte Prozessdauer ~ [3:30min]",
    KillPID: "Die Prozess ID 1840 wurde erfolgreich beendet.",
    welcome: "This is the welcome message",
    internet_explorer_warning: "NOTE: I see you're using internet explorer, this website won't work properly.",
    invalid_command_message: "command not found.",
    sudo_message: "Unable to sudo using a web client.",
    usage: "Usage",
    file: "file",
    file_not_found: "File '<value>' not found.",
    language: "Language",
    host: "example.com",
    user: "guest",
    is_root: false,
    type_delay: 20
  };
  return {
    getInstance: function (options) {
      instance === void 0 && (instance = new Singleton(options));
      return instance;
    }
  };
})();

/**
* Your files here
*/

var main = (function () {

  /**
  * Aux functions
  */
  var isUsingIE = window.navigator.userAgent.indexOf("MSIE ") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./);

  var ignoreEvent = function (event) {
    event.preventDefault();
    event.stopPropagation();
  };

  var scrollToBottom = function () {
    window.scrollTo(0, document.body.scrollHeight);
  };

  var isURL = function (str) {
    return (str.startsWith("http") || str.startsWith("www")) && str.indexOf(" ") === -1 && str.indexOf("\n") === -1;
  };

  /**
  * Model
  */
  var InvalidArgumentException = function (message) {
    this.message = message;
    // Use V8's native method if available, otherwise fallback
    if ("captureStackTrace" in Error) {
      Error.captureStackTrace(this, InvalidArgumentException);
    } else {
      this.stack = (new Error()).stack;
    }
  };
  // Extends Error
  InvalidArgumentException.prototype = Object.create(Error.prototype);
  InvalidArgumentException.prototype.name = "InvalidArgumentException";
  InvalidArgumentException.prototype.constructor = InvalidArgumentException;

  var cmds = {
    BFA: { value: "brute force attack"},
    KILLPID: { value: "sudo kill process pid 1840"},
    LS: { value: "ls", help: configs.getInstance().ls_help },
    CAT: { value: "cat", help: configs.getInstance().cat_help },
    WHOAMI: { value: "whoami", help: configs.getInstance().whoami_help },
    DATE: { value: "date", help: configs.getInstance().date_help },
    HELP: { value: "help", help: configs.getInstance().help_help },
    CLEAR: { value: "clear", help: configs.getInstance().clear_help },
    REBOOT: { value: "reboot", help: configs.getInstance().reboot_help },
    CD: { value: "cd", help: configs.getInstance().cd_help },
    MV: { value: "mv", help: configs.getInstance().mv_help },
    RM: { value: "rm", help: configs.getInstance().rm_help },
    RMDIR: { value: "rmdir", help: configs.getInstance().rmdir_help },
    TOUCH: { value: "touch", help: configs.getInstance().touch_help },
    SUDO: { value: "sudo", help: configs.getInstance().sudo_help }
  };

  var Terminal = function (prompt, cmdLine, output, user, host, root, outputTimer) {
    if (!(prompt instanceof Node) || prompt.nodeName.toUpperCase() !== "DIV") {
      throw new InvalidArgumentException("Invalid value " + prompt + " for argument 'prompt'.");
    }
    if (!(cmdLine instanceof Node) || cmdLine.nodeName.toUpperCase() !== "INPUT") {
      throw new InvalidArgumentException("Invalid value " + cmdLine + " for argument 'cmdLine'.");
    }
    if (!(output instanceof Node) || output.nodeName.toUpperCase() !== "DIV") {
      throw new InvalidArgumentException("Invalid value " + output + " for argument 'output'.");
    }
    (typeof user === "string" && typeof host === "string") && (this.completePrompt = user + "@" + host + ":~" + (root ? "#" : "$"));
    this.prompt = prompt;
    this.cmdLine = cmdLine;
    this.output = output;
    this.typeSimulator = new TypeSimulator(outputTimer, output);
  };

  Terminal.prototype.type = function (text, callback) {
    this.typeSimulator.type(text, callback);
  };

  Terminal.prototype.exec = function () {
    var command = this.cmdLine.value;
    this.cmdLine.value = "";
    this.prompt.textContent = "";
    this.output.innerHTML += "<span class=\"prompt-color\">" + this.completePrompt + "</span> " + command + "<br/>";
  };

  Terminal.prototype.init = function () {
    this.cmdLine.disabled = true;
    this.cmdLine.addEventListener("keydown", function (event) {
      if (event.which === 13 || event.keyCode === 13) {
        this.handleCmd();
        ignoreEvent(event);
      }
    }.bind(this));
    this.reset();
  };

  Terminal.prototype.lock = function () {
    this.exec();
    this.cmdLine.blur();
    this.cmdLine.disabled = true;
  };

  Terminal.prototype.unlock = function () {
    this.cmdLine.disabled = false;
    this.prompt.textContent = this.completePrompt;
    scrollToBottom();
    this.focus();
  };

  Terminal.prototype.handleCmd = function () {
    var cmdComponents = this.cmdLine.value.trim().toLowerCase();
    this.lock();
    switch (cmdComponents) {
      case cmds.BFA.value:
      this.bruteForceAttack();
      break;
      case cmds.KILLPID.value:
      this.KillPID();
      break;
      default:
      this.invalidCommand(cmdComponents);
      break;
    };
  };

  Terminal.prototype.cat = function (cmdComponents) {
    var result;
    if (cmdComponents.length <= 1) {
      result = configs.getInstance().usage + ": " + cmds.CAT.value + " <" + configs.getInstance().file + ">";
    } else if (!cmdComponents[1] || (!cmdComponents[1] === configs.getInstance().welcome_file_name || !files.getInstance().hasOwnProperty(cmdComponents[1]))) {
      result = configs.getInstance().file_not_found.replace(configs.getInstance().value_token, cmdComponents[1]);
    } else {
      result = cmdComponents[1] === configs.getInstance().welcome_file_name ? configs.getInstance().welcome : files.getInstance()[cmdComponents[1]];
    }
    this.type(result, this.unlock.bind(this));
  };


  Terminal.prototype.sudo = function () {
    this.type(configs.getInstance().sudo_message, this.unlock.bind(this));
  }

  Terminal.prototype.bruteForceAttack = async function (cmdComponents) {
    var result = configs.getInstance().bruteForceAttack;
    var parent = this;
    var percentage = 0;

    this.type(result, this.unlock.bind(this));
    var execLine = document.getElementById("input-line");
    execLine.classList.toggle("hidden");

    await sleep(1100);

    while(percentage <= 10){
      console.log(bruteText);
      var bruteText = "[";
      for(var i = 1; i <= 10; i++){
        if(i <= percentage){
          bruteText += "##";
        } else {
          bruteText += "__";
        }
      }
      bruteText += "] " + percentage + "0% \n";
      console.log(bruteText);

      this.type(bruteText);
      if(percentage < 10){
        await sleep(21000);
      } else {
        await sleep(1400);
      }
      percentage++;
    }
    this.type("Brute force attack completed\n");
    execLine.classList.toggle("hidden");
    document.getElementById("cmdline").focus();
    sendRoomEvent("bruteForceAttack");
  };


  Terminal.prototype.KillPID = function (cmdComponents) {
    var result = configs.getInstance().KillPID;
    this.type(result, this.unlock.bind(this));
    sendRoomEvent("killPID");
  };

  Terminal.prototype.clear = function () {
    this.output.textContent = "";
    this.prompt.textContent = "";
    this.prompt.textContent = this.completePrompt;
    this.unlock();
  };

  Terminal.prototype.reboot = function () {
    this.type(configs.getInstance().reboot_message, this.reset.bind(this));
  };

  Terminal.prototype.reset = function () {
    this.output.textContent = "";
    this.prompt.textContent = "";
    if (this.typeSimulator) {
      this.type(configs.getInstance().welcome + (isUsingIE ? "\n" + configs.getInstance().internet_explorer_warning : ""), function () {
        this.unlock();
      }.bind(this));
    }
  };

  Terminal.prototype.permissionDenied = function (cmdComponents) {
    this.type(configs.getInstance().permission_denied_message.replace(configs.getInstance().value_token, cmdComponents[0]), this.unlock.bind(this));
  };

  Terminal.prototype.invalidCommand = function (cmdComponents) {
    this.type(configs.getInstance().invalid_command_message.replace(configs.getInstance().value_token, cmdComponents[0]), this.unlock.bind(this));
  };

  Terminal.prototype.focus = function () {
    this.cmdLine.focus();
  };

  var TypeSimulator = function (timer, output) {
    var timer = parseInt(timer);
    if (timer === Number.NaN || timer < 0) {
      throw new InvalidArgumentException("Invalid value " + timer + " for argument 'timer'.");
    }
    if (!(output instanceof Node)) {
      throw new InvalidArgumentException("Invalid value " + output + " for argument 'output'.");
    }
    this.timer = timer;
    this.output = output;
  };

  TypeSimulator.prototype.type = function (text, callback) {
    if (isURL(text)) {
      window.open(text);
    }

    var i = 0;
    var output = this.output;
    var timer = this.timer/2;
    var skipped = false;
    var skip = function () {
      skipped = true;
    }.bind(this);

    document.addEventListener("dblclick", skip);
    (function typer() {
      if (i < text.length) {
        var char = text.charAt(i);
        var isNewLine = char === "\n";
        output.innerHTML += isNewLine ? "<br/>" : char;
        i++;
        if (!skipped) {
          setTimeout(typer, isNewLine ? timer * 2 : timer);
        } else {
          output.innerHTML += (text.substring(i).replace(new RegExp("\n", 'g'), "<br/>")) + "<br/>";
          document.removeEventListener("dblclick", skip);
          callback();
        }
      } else if (callback) {
        output.innerHTML += "<br/>";
        document.removeEventListener("dblclick", skip);
        callback();
      }
      scrollToBottom();
    })();
  };

  return {
    listener: function () {
      new Terminal(
        document.getElementById("prompt"),
        document.getElementById("cmdline"),
        document.getElementById("output"),
        configs.getInstance().user,
        configs.getInstance().host,
        configs.getInstance().is_root,
        configs.getInstance().type_delay
      ).init();
    }
  };
})();

window.onload = main.listener;
