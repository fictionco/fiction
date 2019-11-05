/* eslint-disable */
/* PrismJS 1.16.0
https://prismjs.com/download.html#themes=prism&languages=markup+css+clike+javascript+bash+css-extras+markup-templating+ejs+git+json+jsonp+json5+yaml+regex&plugins=toolbar+normalize-whitespace+show-language */
var _self =
  typeof window !== "undefined"
    ? window // if in browser
    : typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope
    ? self // if in worker
    : {} // if in node js

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */

var Prism = (function(_self) {
  // Private helper vars
  var lang = /\blang(?:uage)?-([\w-]+)\b/i
  var uniqueId = 0

  var _ = {
    manual: _self.Prism && _self.Prism.manual,
    disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,
    util: {
      encode: function(tokens) {
        if (tokens instanceof Token) {
          return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias)
        } else if (Array.isArray(tokens)) {
          return tokens.map(_.util.encode)
        } else {
          return tokens
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/\u00a0/g, " ")
        }
      },

      type: function(o) {
        return Object.prototype.toString.call(o).slice(8, -1)
      },

      objId: function(obj) {
        if (!obj["__id"]) {
          Object.defineProperty(obj, "__id", { value: ++uniqueId })
        }
        return obj["__id"]
      },

      // Deep clone a language definition (e.g. to extend it)
      clone: function deepClone(o, visited) {
        var clone,
          id,
          type = _.util.type(o)
        visited = visited || {}

        switch (type) {
          case "Object":
            id = _.util.objId(o)
            if (visited[id]) {
              return visited[id]
            }
            clone = {}
            visited[id] = clone

            for (var key in o) {
              if (o.hasOwnProperty(key)) {
                clone[key] = deepClone(o[key], visited)
              }
            }

            return clone

          case "Array":
            id = _.util.objId(o)
            if (visited[id]) {
              return visited[id]
            }
            clone = []
            visited[id] = clone

            o.forEach(function(v, i) {
              clone[i] = deepClone(v, visited)
            })

            return clone

          default:
            return o
        }
      }
    },

    languages: {
      extend: function(id, redef) {
        var lang = _.util.clone(_.languages[id])

        for (var key in redef) {
          lang[key] = redef[key]
        }

        return lang
      },

      /**
       * Insert a token before another token in a language literal
       * As this needs to recreate the object (we cannot actually insert before keys in object literals),
       * we cannot just provide an object, we need an object and a key.
       * @param inside The key (or language id) of the parent
       * @param before The key to insert before.
       * @param insert Object with the key/value pairs to insert
       * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
       */
      insertBefore: function(inside, before, insert, root) {
        root = root || _.languages
        var grammar = root[inside]
        var ret = {}

        for (var token in grammar) {
          if (grammar.hasOwnProperty(token)) {
            if (token == before) {
              for (var newToken in insert) {
                if (insert.hasOwnProperty(newToken)) {
                  ret[newToken] = insert[newToken]
                }
              }
            }

            // Do not insert token which also occur in insert. See #1525
            if (!insert.hasOwnProperty(token)) {
              ret[token] = grammar[token]
            }
          }
        }

        var old = root[inside]
        root[inside] = ret

        // Update references in other language definitions
        _.languages.DFS(_.languages, function(key, value) {
          if (value === old && key != inside) {
            this[key] = ret
          }
        })

        return ret
      },

      // Traverse a language definition with Depth First Search
      DFS: function DFS(o, callback, type, visited) {
        visited = visited || {}

        var objId = _.util.objId

        for (var i in o) {
          if (o.hasOwnProperty(i)) {
            callback.call(o, i, o[i], type || i)

            var property = o[i],
              propertyType = _.util.type(property)

            if (propertyType === "Object" && !visited[objId(property)]) {
              visited[objId(property)] = true
              DFS(property, callback, null, visited)
            } else if (propertyType === "Array" && !visited[objId(property)]) {
              visited[objId(property)] = true
              DFS(property, callback, i, visited)
            }
          }
        }
      }
    },
    plugins: {},

    highlightAll: function(async, callback) {
      _.highlightAllUnder(document, async, callback)
    },

    highlightAllUnder: function(container, async, callback) {
      var env = {
        callback: callback,
        selector:
          'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
      }

      _.hooks.run("before-highlightall", env)

      var elements = env.elements || container.querySelectorAll(env.selector)

      for (var i = 0, element; (element = elements[i++]); ) {
        _.highlightElement(element, async === true, env.callback)
      }
    },

    highlightElement: function(element, async, callback) {
      // Find language
      var language = "none",
        grammar,
        parent = element

      while (parent && !lang.test(parent.className)) {
        parent = parent.parentNode
      }

      if (parent) {
        language = (parent.className.match(lang) || [, "none"])[1].toLowerCase()
        grammar = _.languages[language]
      }

      // Set language on the element, if not present
      element.className =
        element.className.replace(lang, "").replace(/\s+/g, " ") + " language-" + language

      if (element.parentNode) {
        // Set language on the parent, for styling
        parent = element.parentNode

        if (/pre/i.test(parent.nodeName)) {
          parent.className =
            parent.className.replace(lang, "").replace(/\s+/g, " ") +
            " language-" +
            language
        }
      }

      var code = element.textContent

      var env = {
        element: element,
        language: language,
        grammar: grammar,
        code: code
      }

      var insertHighlightedCode = function(highlightedCode) {
        env.highlightedCode = highlightedCode

        _.hooks.run("before-insert", env)

        env.element.innerHTML = env.highlightedCode

        _.hooks.run("after-highlight", env)
        _.hooks.run("complete", env)
        callback && callback.call(env.element)
      }

      _.hooks.run("before-sanity-check", env)

      if (!env.code) {
        _.hooks.run("complete", env)
        return
      }

      _.hooks.run("before-highlight", env)

      if (!env.grammar) {
        insertHighlightedCode(_.util.encode(env.code))
        return
      }

      if (async && _self.Worker) {
        var worker = new Worker(_.filename)

        worker.addEventListener("message", function(evt) {
          insertHighlightedCode(evt.data)
        })

        worker.postMessage(
          JSON.stringify({
            language: env.language,
            code: env.code,
            immediateClose: true
          })
        )
      } else {
        insertHighlightedCode(_.highlight(env.code, env.grammar, env.language))
      }
    },

    highlight: function(text, grammar, language) {
      var env = {
        code: text,
        grammar: grammar,
        language: language
      }
      _.hooks.run("before-tokenize", env)
      env.tokens = _.tokenize(env.code, env.grammar)
      _.hooks.run("after-tokenize", env)
      return Token.stringify(_.util.encode(env.tokens), env.language)
    },

    matchGrammar: function(text, strarr, grammar, index, startPos, oneshot, target) {
      for (var token in grammar) {
        if (!grammar.hasOwnProperty(token) || !grammar[token]) {
          continue
        }

        if (token == target) {
          return
        }

        var patterns = grammar[token]
        patterns = _.util.type(patterns) === "Array" ? patterns : [patterns]

        for (var j = 0; j < patterns.length; ++j) {
          var pattern = patterns[j],
            inside = pattern.inside,
            lookbehind = !!pattern.lookbehind,
            greedy = !!pattern.greedy,
            lookbehindLength = 0,
            alias = pattern.alias

          if (greedy && !pattern.pattern.global) {
            // Without the global flag, lastIndex won't work
            var flags = pattern.pattern.toString().match(/[imuy]*$/)[0]
            pattern.pattern = new RegExp(pattern.pattern.source, flags + "g")
          }

          pattern = pattern.pattern || pattern

          // Don’t cache length as it changes during the loop
          for (
            var i = index, pos = startPos;
            i < strarr.length;
            pos += strarr[i].length, ++i
          ) {
            var str = strarr[i]

            if (strarr.length > text.length) {
              // Something went terribly wrong, ABORT, ABORT!
              return
            }

            if (str instanceof Token) {
              continue
            }

            if (greedy && i != strarr.length - 1) {
              pattern.lastIndex = pos
              var match = pattern.exec(text)
              if (!match) {
                break
              }

              var from = match.index + (lookbehind ? match[1].length : 0),
                to = match.index + match[0].length,
                k = i,
                p = pos

              for (
                var len = strarr.length;
                k < len && (p < to || (!strarr[k].type && !strarr[k - 1].greedy));
                ++k
              ) {
                p += strarr[k].length
                // Move the index i to the element in strarr that is closest to from
                if (from >= p) {
                  ++i
                  pos = p
                }
              }

              // If strarr[i] is a Token, then the match starts inside another Token, which is invalid
              if (strarr[i] instanceof Token) {
                continue
              }

              // Number of tokens to delete and replace with the new match
              delNum = k - i
              str = text.slice(pos, p)
              match.index -= pos
            } else {
              pattern.lastIndex = 0

              var match = pattern.exec(str),
                delNum = 1
            }

            if (!match) {
              if (oneshot) {
                break
              }

              continue
            }

            if (lookbehind) {
              lookbehindLength = match[1] ? match[1].length : 0
            }

            var from = match.index + lookbehindLength,
              match = match[0].slice(lookbehindLength),
              to = from + match.length,
              before = str.slice(0, from),
              after = str.slice(to)

            var args = [i, delNum]

            if (before) {
              ++i
              pos += before.length
              args.push(before)
            }

            var wrapped = new Token(
              token,
              inside ? _.tokenize(match, inside) : match,
              alias,
              match,
              greedy
            )

            args.push(wrapped)

            if (after) {
              args.push(after)
            }

            Array.prototype.splice.apply(strarr, args)

            if (delNum != 1) _.matchGrammar(text, strarr, grammar, i, pos, true, token)

            if (oneshot) break
          }
        }
      }
    },

    tokenize: function(text, grammar) {
      var strarr = [text]

      var rest = grammar.rest

      if (rest) {
        for (var token in rest) {
          grammar[token] = rest[token]
        }

        delete grammar.rest
      }

      _.matchGrammar(text, strarr, grammar, 0, 0, false)

      return strarr
    },

    hooks: {
      all: {},

      add: function(name, callback) {
        var hooks = _.hooks.all

        hooks[name] = hooks[name] || []

        hooks[name].push(callback)
      },

      run: function(name, env) {
        var callbacks = _.hooks.all[name]

        if (!callbacks || !callbacks.length) {
          return
        }

        for (var i = 0, callback; (callback = callbacks[i++]); ) {
          callback(env)
        }
      }
    },

    Token: Token
  }

  _self.Prism = _

  function Token(type, content, alias, matchedStr, greedy) {
    this.type = type
    this.content = content
    this.alias = alias
    // Copy of the full string this token was created from
    this.length = (matchedStr || "").length | 0
    this.greedy = !!greedy
  }

  Token.stringify = function(o, language) {
    if (typeof o == "string") {
      return o
    }

    if (Array.isArray(o)) {
      return o
        .map(function(element) {
          return Token.stringify(element, language)
        })
        .join("")
    }

    var env = {
      type: o.type,
      content: Token.stringify(o.content, language),
      tag: "span",
      classes: ["token", o.type],
      attributes: {},
      language: language
    }

    if (o.alias) {
      var aliases = Array.isArray(o.alias) ? o.alias : [o.alias]
      Array.prototype.push.apply(env.classes, aliases)
    }

    _.hooks.run("wrap", env)

    var attributes = Object.keys(env.attributes)
      .map(function(name) {
        return name + '="' + (env.attributes[name] || "").replace(/"/g, "&quot;") + '"'
      })
      .join(" ")

    return (
      "<" +
      env.tag +
      ' class="' +
      env.classes.join(" ") +
      '"' +
      (attributes ? " " + attributes : "") +
      ">" +
      env.content +
      "</" +
      env.tag +
      ">"
    )
  }

  if (!_self.document) {
    if (!_self.addEventListener) {
      // in Node.js
      return _
    }

    if (!_.disableWorkerMessageHandler) {
      // In worker
      _self.addEventListener(
        "message",
        function(evt) {
          var message = JSON.parse(evt.data),
            lang = message.language,
            code = message.code,
            immediateClose = message.immediateClose

          _self.postMessage(_.highlight(code, _.languages[lang], lang))
          if (immediateClose) {
            _self.close()
          }
        },
        false
      )
    }

    return _
  }

  //Get current script and highlight
  var script =
    document.currentScript || [].slice.call(document.querySelectorAll("script")).pop()

  if (script) {
    _.filename = script.src

    if (!_.manual && !script.hasAttribute("data-manual")) {
      if (document.readyState !== "loading") {
        if (window.requestAnimationFrame) {
          window.requestAnimationFrame(_.highlightAll)
        } else {
          window.setTimeout(_.highlightAll, 16)
        }
      } else {
        document.addEventListener("DOMContentLoaded", _.highlightAll)
      }
    }
  }

  return _
})(_self)

if (typeof module !== "undefined" && module.exports) {
  module.exports = Prism
}

// hack for components to work correctly in node.js
if (typeof global !== "undefined") {
  global.Prism = Prism
}
Prism.languages.markup = {
  comment: /<!--[\s\S]*?-->/,
  prolog: /<\?[\s\S]+?\?>/,
  doctype: /<!DOCTYPE[\s\S]+?>/i,
  cdata: /<!\[CDATA\[[\s\S]*?]]>/i,
  tag: {
    pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/i,
    greedy: true,
    inside: {
      tag: {
        pattern: /^<\/?[^\s>\/]+/i,
        inside: {
          punctuation: /^<\/?/,
          namespace: /^[^\s>\/:]+:/
        }
      },
      "attr-value": {
        pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/i,
        inside: {
          punctuation: [
            /^=/,
            {
              pattern: /^(\s*)["']|["']$/,
              lookbehind: true
            }
          ]
        }
      },
      punctuation: /\/?>/,
      "attr-name": {
        pattern: /[^\s>\/]+/,
        inside: {
          namespace: /^[^\s>\/:]+:/
        }
      }
    }
  },
  entity: /&#?[\da-z]{1,8};/i
}

Prism.languages.markup["tag"].inside["attr-value"].inside["entity"] =
  Prism.languages.markup["entity"]

// Plugin to make entity title show the real entity, idea by Roman Komarov
Prism.hooks.add("wrap", function(env) {
  if (env.type === "entity") {
    env.attributes["title"] = env.content.replace(/&amp;/, "&")
  }
})

Object.defineProperty(Prism.languages.markup.tag, "addInlined", {
  /**
   * Adds an inlined language to markup.
   *
   * An example of an inlined language is CSS with `<style>` tags.
   *
   * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
   * case insensitive.
   * @param {string} lang The language key.
   * @example
   * addInlined('style', 'css');
   */
  value: function addInlined(tagName, lang) {
    var includedCdataInside = {}
    includedCdataInside["language-" + lang] = {
      pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
      lookbehind: true,
      inside: Prism.languages[lang]
    }
    includedCdataInside["cdata"] = /^<!\[CDATA\[|\]\]>$/i

    var inside = {
      "included-cdata": {
        pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
        inside: includedCdataInside
      }
    }
    inside["language-" + lang] = {
      pattern: /[\s\S]+/,
      inside: Prism.languages[lang]
    }

    var def = {}
    def[tagName] = {
      pattern: new RegExp(
        /(<__[\s\S]*?>)(?:<!\[CDATA\[[\s\S]*?\]\]>\s*|[\s\S])*?(?=<\/__>)/.source.replace(
          /__/g,
          tagName
        ),
        "i"
      ),
      lookbehind: true,
      greedy: true,
      inside: inside
    }

    Prism.languages.insertBefore("markup", "cdata", def)
  }
})

Prism.languages.xml = Prism.languages.extend("markup", {})
Prism.languages.html = Prism.languages.markup
Prism.languages.mathml = Prism.languages.markup
Prism.languages.svg = Prism.languages.markup
;(function(Prism) {
  var string = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/

  Prism.languages.css = {
    comment: /\/\*[\s\S]*?\*\//,
    atrule: {
      pattern: /@[\w-]+[\s\S]*?(?:;|(?=\s*\{))/,
      inside: {
        rule: /@[\w-]+/
        // See rest below
      }
    },
    url: {
      pattern: new RegExp("url\\((?:" + string.source + "|[^\n\r()]*)\\)", "i"),
      inside: {
        function: /^url/i,
        punctuation: /^\(|\)$/
      }
    },
    selector: new RegExp("[^{}\\s](?:[^{};\"']|" + string.source + ")*?(?=\\s*\\{)"),
    string: {
      pattern: string,
      greedy: true
    },
    property: /[-_a-z\u00A0-\uFFFF][-\w\u00A0-\uFFFF]*(?=\s*:)/i,
    important: /!important\b/i,
    function: /[-a-z0-9]+(?=\()/i,
    punctuation: /[(){};:,]/
  }

  Prism.languages.css["atrule"].inside.rest = Prism.languages.css

  var markup = Prism.languages.markup
  if (markup) {
    markup.tag.addInlined("style", "css")

    Prism.languages.insertBefore(
      "inside",
      "attr-value",
      {
        "style-attr": {
          pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
          inside: {
            "attr-name": {
              pattern: /^\s*style/i,
              inside: markup.tag.inside
            },
            punctuation: /^\s*=\s*['"]|['"]\s*$/,
            "attr-value": {
              pattern: /.+/i,
              inside: Prism.languages.css
            }
          },
          alias: "language-css"
        }
      },
      markup.tag
    )
  }
})(Prism)

Prism.languages.clike = {
  comment: [
    {
      pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
      lookbehind: true
    },
    {
      pattern: /(^|[^\\:])\/\/.*/,
      lookbehind: true,
      greedy: true
    }
  ],
  string: {
    pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    greedy: true
  },
  "class-name": {
    pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i,
    lookbehind: true,
    inside: {
      punctuation: /[.\\]/
    }
  },
  keyword: /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
  boolean: /\b(?:true|false)\b/,
  function: /\w+(?=\()/,
  number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
  operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
  punctuation: /[{}[\];(),.:]/
}

Prism.languages.javascript = Prism.languages.extend("clike", {
  "class-name": [
    Prism.languages.clike["class-name"],
    {
      pattern: /(^|[^$\w\u00A0-\uFFFF])[_$A-Z\u00A0-\uFFFF][$\w\u00A0-\uFFFF]*(?=\.(?:prototype|constructor))/,
      lookbehind: true
    }
  ],
  keyword: [
    {
      pattern: /((?:^|})\s*)(?:catch|finally)\b/,
      lookbehind: true
    },
    {
      pattern: /(^|[^.])\b(?:as|async(?=\s*(?:function\b|\(|[$\w\u00A0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
      lookbehind: true
    }
  ],
  number: /\b(?:(?:0[xX][\dA-Fa-f]+|0[bB][01]+|0[oO][0-7]+)n?|\d+n|NaN|Infinity)\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,
  // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
  function: /[_$a-zA-Z\u00A0-\uFFFF][$\w\u00A0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
  operator: /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/
})

Prism.languages.javascript[
  "class-name"
][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/

Prism.languages.insertBefore("javascript", "keyword", {
  regex: {
    pattern: /((?:^|[^$\w\u00A0-\uFFFF."'\])\s])\s*)\/(\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyus]{0,6}(?=\s*($|[\r\n,.;})\]]))/,
    lookbehind: true,
    greedy: true
  },
  // This must be declared before keyword because we use "function" inside the look-forward
  "function-variable": {
    pattern: /[_$a-zA-Z\u00A0-\uFFFF][$\w\u00A0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\u00A0-\uFFFF][$\w\u00A0-\uFFFF]*)\s*=>))/,
    alias: "function"
  },
  parameter: [
    {
      pattern: /(function(?:\s+[_$A-Za-z\u00A0-\uFFFF][$\w\u00A0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/,
      lookbehind: true,
      inside: Prism.languages.javascript
    },
    {
      pattern: /[_$a-z\u00A0-\uFFFF][$\w\u00A0-\uFFFF]*(?=\s*=>)/i,
      inside: Prism.languages.javascript
    },
    {
      pattern: /(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/,
      lookbehind: true,
      inside: Prism.languages.javascript
    },
    {
      pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\u00A0-\uFFFF]))(?:[_$A-Za-z\u00A0-\uFFFF][$\w\u00A0-\uFFFF]*\s*)\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/,
      lookbehind: true,
      inside: Prism.languages.javascript
    }
  ],
  constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/
})

Prism.languages.insertBefore("javascript", "string", {
  "template-string": {
    pattern: /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}|[^\\`])*`/,
    greedy: true,
    inside: {
      interpolation: {
        pattern: /\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}/,
        inside: {
          "interpolation-punctuation": {
            pattern: /^\${|}$/,
            alias: "punctuation"
          },
          rest: Prism.languages.javascript
        }
      },
      string: /[\s\S]+/
    }
  }
})

if (Prism.languages.markup) {
  Prism.languages.markup.tag.addInlined("script", "javascript")
}

Prism.languages.js = Prism.languages.javascript
;(function(Prism) {
  var insideString = {
    variable: [
      // Arithmetic Environment
      {
        pattern: /\$?\(\([\s\S]+?\)\)/,
        inside: {
          // If there is a $ sign at the beginning highlight $(( and )) as variable
          variable: [
            {
              pattern: /(^\$\(\([\s\S]+)\)\)/,
              lookbehind: true
            },
            /^\$\(\(/
          ],
          number: /\b0x[\dA-Fa-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee]-?\d+)?/,
          // Operators according to https://www.gnu.org/software/bash/manual/bashref.html#Shell-Arithmetic
          operator: /--?|-=|\+\+?|\+=|!=?|~|\*\*?|\*=|\/=?|%=?|<<=?|>>=?|<=?|>=?|==?|&&?|&=|\^=?|\|\|?|\|=|\?|:/,
          // If there is no $ sign at the beginning highlight (( and )) as punctuation
          punctuation: /\(\(?|\)\)?|,|;/
        }
      },
      // Command Substitution
      {
        pattern: /\$\([^)]+\)|`[^`]+`/,
        greedy: true,
        inside: {
          variable: /^\$\(|^`|\)$|`$/
        }
      },
      /\$(?:[\w#?*!@]+|\{[^}]+\})/i
    ]
  }

  Prism.languages.bash = {
    shebang: {
      pattern: /^#!\s*\/bin\/bash|^#!\s*\/bin\/sh/,
      alias: "important"
    },
    comment: {
      pattern: /(^|[^"{\\])#.*/,
      lookbehind: true
    },
    string: [
      //Support for Here-Documents https://en.wikipedia.org/wiki/Here_document
      {
        pattern: /((?:^|[^<])<<\s*)["']?(\w+?)["']?\s*\r?\n(?:[\s\S])*?\r?\n\2/,
        lookbehind: true,
        greedy: true,
        inside: insideString
      },
      {
        pattern: /(["'])(?:\\[\s\S]|\$\([^)]+\)|`[^`]+`|(?!\1)[^\\])*\1/,
        greedy: true,
        inside: insideString
      }
    ],
    variable: insideString.variable,
    // Originally based on http://ss64.com/bash/
    function: {
      pattern: /(^|[\s;|&])(?:add|alias|apropos|apt|apt-cache|apt-get|aptitude|aspell|automysqlbackup|awk|basename|bash|bc|bconsole|bg|builtin|bzip2|cal|cat|cd|cfdisk|chgrp|chkconfig|chmod|chown|chroot|cksum|clear|cmp|comm|command|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|debootstrap|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|du|egrep|eject|enable|env|ethtool|eval|exec|expand|expect|export|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|getopts|git|gparted|grep|groupadd|groupdel|groupmod|groups|grub-mkconfig|gzip|halt|hash|head|help|hg|history|host|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|ip|jobs|join|kill|killall|less|link|ln|locate|logname|logout|logrotate|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|lynx|make|man|mc|mdadm|mkconfig|mkdir|mke2fs|mkfifo|mkfs|mkisofs|mknod|mkswap|mmv|more|most|mount|mtools|mtr|mutt|mv|nano|nc|netstat|nice|nl|nohup|notify-send|npm|nslookup|op|open|parted|passwd|paste|pathchk|ping|pkill|pnpm|popd|pr|printcap|printenv|printf|ps|pushd|pv|pwd|quota|quotacheck|quotactl|ram|rar|rcp|read|readarray|readonly|reboot|remsync|rename|renice|rev|rm|rmdir|rpm|rsync|scp|screen|sdiff|sed|sendmail|seq|service|sftp|shift|shopt|shutdown|sleep|slocate|sort|source|split|ssh|stat|strace|su|sudo|sum|suspend|swapon|sync|tail|tar|tee|test|time|timeout|times|top|touch|tr|traceroute|trap|tsort|tty|type|ulimit|umask|umount|unalias|uname|unexpand|uniq|units|unrar|unshar|unzip|update-grub|uptime|useradd|userdel|usermod|users|uudecode|uuencode|vdir|vi|vim|virsh|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yarn|yes|zip|zypper)(?=$|[\s;|&])/,
      lookbehind: true
    },
    keyword: {
      pattern: /(^|[\s;|&])(?:let|:|\.|if|then|else|elif|fi|for|break|continue|while|in|case|function|select|do|done|until|echo|exit|return|set|declare)(?=$|[\s;|&])/,
      lookbehind: true
    },
    boolean: {
      pattern: /(^|[\s;|&])(?:true|false)(?=$|[\s;|&])/,
      lookbehind: true
    },
    operator: /&&?|\|\|?|==?|!=?|<<<?|>>|<=?|>=?|=~/,
    punctuation: /\$?\(\(?|\)\)?|\.\.|[{}[\];]/
  }

  var inside = insideString.variable[1].inside
  inside.string = Prism.languages.bash.string
  inside["function"] = Prism.languages.bash["function"]
  inside.keyword = Prism.languages.bash.keyword
  inside["boolean"] = Prism.languages.bash["boolean"]
  inside.operator = Prism.languages.bash.operator
  inside.punctuation = Prism.languages.bash.punctuation

  Prism.languages.shell = Prism.languages.bash
})(Prism)

Prism.languages.css.selector = {
  pattern: Prism.languages.css.selector,
  inside: {
    "pseudo-element": /:(?:after|before|first-letter|first-line|selection)|::[-\w]+/,
    "pseudo-class": /:[-\w]+/,
    class: /\.[-:.\w]+/,
    id: /#[-:.\w]+/,
    attribute: {
      pattern: /\[(?:[^[\]"']|("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1)*\]/,
      greedy: true,
      inside: {
        punctuation: /^\[|\]$/,
        "case-sensitivity": {
          pattern: /(\s)[si]$/i,
          lookbehind: true,
          alias: "keyword"
        },
        namespace: {
          pattern: /^(\s*)[-*\w\u00A0-\uFFFF]*\|(?!=)/,
          lookbehind: true,
          inside: {
            punctuation: /\|$/
          }
        },
        attribute: {
          pattern: /^(\s*)[-\w\u00A0-\uFFFF]+/,
          lookbehind: true
        },
        value: [
          /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
          {
            pattern: /(=\s*)[-\w\u00A0-\uFFFF]+(?=\s*$)/,
            lookbehind: true
          }
        ],
        operator: /[|~*^$]?=/
      }
    },
    "n-th": [
      {
        pattern: /(\(\s*)[+-]?\d*[\dn](?:\s*[+-]\s*\d+)?(?=\s*\))/,
        lookbehind: true,
        inside: {
          number: /[\dn]+/,
          operator: /[+-]/
        }
      },
      {
        pattern: /(\(\s*)(?:even|odd)(?=\s*\))/i,
        lookbehind: true
      }
    ],
    punctuation: /[()]/
  }
}

Prism.languages.insertBefore("css", "property", {
  variable: {
    pattern: /(^|[^-\w\u00A0-\uFFFF])--[-_a-z\u00A0-\uFFFF][-\w\u00A0-\uFFFF]*/i,
    lookbehind: true
  }
})

Prism.languages.insertBefore("css", "function", {
  operator: {
    pattern: /(\s)[+\-*\/](?=\s)/,
    lookbehind: true
  },
  hexcode: /#[\da-f]{3,8}/i,
  entity: /\\[\da-f]{1,8}/i,
  unit: {
    pattern: /(\d)(?:%|[a-z]+)/,
    lookbehind: true
  },
  number: /-?[\d.]+/
})
;(function(Prism) {
  /**
   * Returns the placeholder for the given language id and index.
   *
   * @param {string} language
   * @param {string|number} index
   * @returns {string}
   */
  function getPlaceholder(language, index) {
    return "___" + language.toUpperCase() + index + "___"
  }

  Object.defineProperties((Prism.languages["markup-templating"] = {}), {
    buildPlaceholders: {
      /**
       * Tokenize all inline templating expressions matching `placeholderPattern`.
       *
       * If `replaceFilter` is provided, only matches of `placeholderPattern` for which `replaceFilter` returns
       * `true` will be replaced.
       *
       * @param {object} env The environment of the `before-tokenize` hook.
       * @param {string} language The language id.
       * @param {RegExp} placeholderPattern The matches of this pattern will be replaced by placeholders.
       * @param {(match: string) => boolean} [replaceFilter]
       */
      value: function(env, language, placeholderPattern, replaceFilter) {
        if (env.language !== language) {
          return
        }

        var tokenStack = (env.tokenStack = [])

        env.code = env.code.replace(placeholderPattern, function(match) {
          if (typeof replaceFilter === "function" && !replaceFilter(match)) {
            return match
          }
          var i = tokenStack.length
          var placeholder

          // Check for existing strings
          while (env.code.indexOf((placeholder = getPlaceholder(language, i))) !== -1) ++i

          // Create a sparse array
          tokenStack[i] = match

          return placeholder
        })

        // Switch the grammar to markup
        env.grammar = Prism.languages.markup
      }
    },
    tokenizePlaceholders: {
      /**
       * Replace placeholders with proper tokens after tokenizing.
       *
       * @param {object} env The environment of the `after-tokenize` hook.
       * @param {string} language The language id.
       */
      value: function(env, language) {
        if (env.language !== language || !env.tokenStack) {
          return
        }

        // Switch the grammar back
        env.grammar = Prism.languages[language]

        var j = 0
        var keys = Object.keys(env.tokenStack)

        function walkTokens(tokens) {
          for (var i = 0; i < tokens.length; i++) {
            // all placeholders are replaced already
            if (j >= keys.length) {
              break
            }

            var token = tokens[i]
            if (
              typeof token === "string" ||
              (token.content && typeof token.content === "string")
            ) {
              var k = keys[j]
              var t = env.tokenStack[k]
              var s = typeof token === "string" ? token : token.content
              var placeholder = getPlaceholder(language, k)

              var index = s.indexOf(placeholder)
              if (index > -1) {
                ++j

                var before = s.substring(0, index)
                var middle = new Prism.Token(
                  language,
                  Prism.tokenize(t, env.grammar),
                  "language-" + language,
                  t
                )
                var after = s.substring(index + placeholder.length)

                var replacement = []
                if (before) {
                  replacement.push.apply(replacement, walkTokens([before]))
                }
                replacement.push(middle)
                if (after) {
                  replacement.push.apply(replacement, walkTokens([after]))
                }

                if (typeof token === "string") {
                  tokens.splice.apply(tokens, [i, 1].concat(replacement))
                } else {
                  token.content = replacement
                }
              }
            } else if (token.content /* && typeof token.content !== 'string' */) {
              walkTokens(token.content)
            }
          }

          return tokens
        }

        walkTokens(env.tokens)
      }
    }
  })
})(Prism)
;(function(Prism) {
  Prism.languages.ejs = {
    delimiter: {
      pattern: /^<%[-_=]?|[-_]?%>$/,
      alias: "punctuation"
    },
    comment: /^#[\s\S]*/,
    "language-javascript": {
      pattern: /[\s\S]+/,
      inside: Prism.languages.javascript
    }
  }

  Prism.hooks.add("before-tokenize", function(env) {
    var ejsPattern = /<%(?!%)[\s\S]+?%>/g
    Prism.languages["markup-templating"].buildPlaceholders(env, "ejs", ejsPattern)
  })

  Prism.hooks.add("after-tokenize", function(env) {
    Prism.languages["markup-templating"].tokenizePlaceholders(env, "ejs")
  })
})(Prism)

Prism.languages.git = {
  /*
   * A simple one line comment like in a git status command
   * For instance:
   * $ git status
   * # On branch infinite-scroll
   * # Your branch and 'origin/sharedBranches/frontendTeam/infinite-scroll' have diverged,
   * # and have 1 and 2 different commits each, respectively.
   * nothing to commit (working directory clean)
   */
  comment: /^#.*/m,

  /*
   * Regexp to match the changed lines in a git diff output. Check the example below.
   */
  deleted: /^[-–].*/m,
  inserted: /^\+.*/m,

  /*
   * a string (double and simple quote)
   */
  string: /("|')(?:\\.|(?!\1)[^\\\r\n])*\1/m,

  /*
   * a git command. It starts with a random prompt finishing by a $, then "git" then some other parameters
   * For instance:
   * $ git add file.txt
   */
  command: {
    pattern: /^.*\$ git .*$/m,
    inside: {
      /*
       * A git command can contain a parameter starting by a single or a double dash followed by a string
       * For instance:
       * $ git diff --cached
       * $ git log -p
       */
      parameter: /\s--?\w+/m
    }
  },

  /*
   * Coordinates displayed in a git diff command
   * For instance:
   * $ git diff
   * diff --git file.txt file.txt
   * index 6214953..1d54a52 100644
   * --- file.txt
   * +++ file.txt
   * @@ -1 +1,2 @@
   * -Here's my tetx file
   * +Here's my text file
   * +And this is the second line
   */
  coord: /^@@.*@@$/m,

  /*
   * Match a "commit [SHA1]" line in a git log output.
   * For instance:
   * $ git log
   * commit a11a14ef7e26f2ca62d4b35eac455ce636d0dc09
   * Author: lgiraudel
   * Date:   Mon Feb 17 11:18:34 2014 +0100
   *
   *     Add of a new line
   */
  commit_sha1: /^commit \w{40}$/m
}

Prism.languages.json = {
  property: {
    pattern: /"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,
    greedy: true
  },
  string: {
    pattern: /"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
    greedy: true
  },
  comment: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,
  number: /-?\d+\.?\d*(e[+-]?\d+)?/i,
  punctuation: /[{}[\],]/,
  operator: /:/,
  boolean: /\b(?:true|false)\b/,
  null: {
    pattern: /\bnull\b/,
    alias: "keyword"
  }
}

Prism.languages.jsonp = Prism.languages.extend("json", {
  punctuation: /[{}[\]();,.]/
})

Prism.languages.insertBefore("jsonp", "punctuation", {
  function: /[_$a-zA-Z\u00A0-\uFFFF][$\w\u00A0-\uFFFF]*(?=\s*\()/
})
;(function(Prism) {
  var string = /("|')(?:\\(?:\r\n?|\n|.)|(?!\1)[^\\\r\n])*\1/

  Prism.languages.json5 = Prism.languages.extend("json", {
    property: [
      {
        pattern: new RegExp(string.source + "(?=\\s*:)"),
        greedy: true
      },
      {
        pattern: /[_$a-zA-Z\u00A0-\uFFFF][$\w\u00A0-\uFFFF]*(?=\s*:)/,
        alias: "unquoted"
      }
    ],
    string: {
      pattern: string,
      greedy: true
    },
    number: /[+-]?(?:NaN|Infinity|0x[a-fA-F\d]+|(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?)/
  })
})(Prism)

Prism.languages.yaml = {
  scalar: {
    pattern: /([\-:]\s*(?:![^\s]+)?[ \t]*[|>])[ \t]*(?:((?:\r?\n|\r)[ \t]+)[^\r\n]+(?:\2[^\r\n]+)*)/,
    lookbehind: true,
    alias: "string"
  },
  comment: /#.*/,
  key: {
    pattern: /(\s*(?:^|[:\-,[{\r\n?])[ \t]*(?:![^\s]+)?[ \t]*)[^\r\n{[\]},#\s]+?(?=\s*:\s)/,
    lookbehind: true,
    alias: "atrule"
  },
  directive: {
    pattern: /(^[ \t]*)%.+/m,
    lookbehind: true,
    alias: "important"
  },
  datetime: {
    pattern: /([:\-,[{]\s*(?:![^\s]+)?[ \t]*)(?:\d{4}-\d\d?-\d\d?(?:[tT]|[ \t]+)\d\d?:\d{2}:\d{2}(?:\.\d*)?[ \t]*(?:Z|[-+]\d\d?(?::\d{2})?)?|\d{4}-\d{2}-\d{2}|\d\d?:\d{2}(?::\d{2}(?:\.\d*)?)?)(?=[ \t]*(?:$|,|]|}))/m,
    lookbehind: true,
    alias: "number"
  },
  boolean: {
    pattern: /([:\-,[{]\s*(?:![^\s]+)?[ \t]*)(?:true|false)[ \t]*(?=$|,|]|})/im,
    lookbehind: true,
    alias: "important"
  },
  null: {
    pattern: /([:\-,[{]\s*(?:![^\s]+)?[ \t]*)(?:null|~)[ \t]*(?=$|,|]|})/im,
    lookbehind: true,
    alias: "important"
  },
  string: {
    pattern: /([:\-,[{]\s*(?:![^\s]+)?[ \t]*)("|')(?:(?!\2)[^\\\r\n]|\\.)*\2(?=[ \t]*(?:$|,|]|}|\s*#))/m,
    lookbehind: true,
    greedy: true
  },
  number: {
    pattern: /([:\-,[{]\s*(?:![^\s]+)?[ \t]*)[+-]?(?:0x[\da-f]+|0o[0-7]+|(?:\d+\.?\d*|\.?\d+)(?:e[+-]?\d+)?|\.inf|\.nan)[ \t]*(?=$|,|]|})/im,
    lookbehind: true
  },
  tag: /![^\s]+/,
  important: /[&*][\w]+/,
  punctuation: /---|[:[\]{}\-,|>?]|\.\.\./
}

Prism.languages.yml = Prism.languages.yaml
;(function(Prism) {
  var specialEscape = {
    pattern: /\\[\\(){}[\]^$+*?|.]/,
    alias: "escape"
  }
  var escape = /\\(?:x[\da-fA-F]{2}|u[\da-fA-F]{4}|u\{[\da-fA-F]+\}|c[a-zA-Z]|0[0-7]{0,2}|[123][0-7]{2}|.)/
  var charClass = /\\[wsd]|\.|\\p{[^{}]+}/i

  var rangeChar = "(?:[^\\\\-]|" + escape.source + ")"
  var range = new RegExp(rangeChar + "-" + rangeChar)

  // the name of a capturing group
  var groupName = {
    pattern: /(<|')[^<>']+(?=[>']$)/,
    lookbehind: true,
    alias: "variable"
  }

  var backreference = [
    /\\(?![123][0-7]{2})[1-9]/, // a backreference which is not an octal escape
    {
      pattern: /\\k<[^<>']+>/,
      inside: {
        "group-name": groupName
      }
    }
  ]

  Prism.languages.regex = {
    charset: {
      pattern: /((?:^|[^\\])(?:\\\\)*)\[(?:[^\\\]]|\\[\s\S])*\]/,
      lookbehind: true,
      inside: {
        "charset-negation": {
          pattern: /(^\[)\^/,
          lookbehind: true
        },
        "charset-punctuation": /^\[|\]$/,
        range: {
          pattern: range,
          inside: {
            escape: escape,
            "range-punctuation": /-/
          }
        },
        "special-escape": specialEscape,
        charclass: charClass,
        backreference: backreference,
        escape: escape
      }
    },
    "special-escape": specialEscape,
    charclass: charClass,
    backreference: backreference,
    anchor: /[$^]|\\[ABbGZz]/,
    escape: escape,
    group: [
      {
        // https://docs.oracle.com/javase/10/docs/api/java/util/regex/Pattern.html
        // https://docs.microsoft.com/en-us/dotnet/standard/base-types/regular-expression-language-quick-reference?view=netframework-4.7.2#grouping-constructs

        // (), (?<name>), (?'name'), (?>), (?:), (?=), (?!), (?<=), (?<!), (?is-m), (?i-m:)
        pattern: /\((?:\?(?:<[^<>']+>|'[^<>']+'|[>:]|<?[=!]|[idmnsuxU]+(?:-[idmnsuxU]+)?:?))?/,
        inside: {
          "group-name": groupName
        }
      },
      /\)/
    ],
    quantifier: /[+*?]|\{(?:\d+,?\d*)\}/,
    alternation: /\|/
  }
  ;["actionscript", "coffescript", "flow", "javascript", "typescript", "vala"].forEach(
    function(lang) {
      var grammar = Prism.languages[lang]
      if (grammar) {
        grammar["regex"].inside = {
          "regex-flags": /[a-z]+$/,
          "regex-delimiter": /^\/|\/$/,
          "language-regex": {
            pattern: /[\s\S]+/,
            inside: Prism.languages.regex
          }
        }
      }
    }
  )
})(Prism)
;(function() {
  if (typeof self === "undefined" || !self.Prism || !self.document) {
    return
  }

  var callbacks = []
  var map = {}
  var noop = function() {}

  Prism.plugins.toolbar = {}

  /**
   * @typedef ButtonOptions
   * @property {string} text The text displayed.
   * @property {string} [url] The URL of the link which will be created.
   * @property {Function} [onClick] The event listener for the `click` event of the created button.
   */

  /**
   * Register a button callback with the toolbar.
   *
   * @param {string} key
   * @param {ButtonOptions|Function} opts
   */
  var registerButton = (Prism.plugins.toolbar.registerButton = function(key, opts) {
    var callback

    if (typeof opts === "function") {
      callback = opts
    } else {
      callback = function(env) {
        var element

        if (typeof opts.onClick === "function") {
          element = document.createElement("button")
          element.type = "button"
          element.addEventListener("click", function() {
            opts.onClick.call(this, env)
          })
        } else if (typeof opts.url === "string") {
          element = document.createElement("a")
          element.href = opts.url
        } else {
          element = document.createElement("span")
        }

        element.textContent = opts.text

        return element
      }
    }

    if (key in map) {
      console.warn('There is a button with the key "' + key + '" registered already.')
      return
    }

    callbacks.push((map[key] = callback))
  })

  /**
   * Post-highlight Prism hook callback.
   *
   * @param env
   */
  var hook = (Prism.plugins.toolbar.hook = function(env) {
    // Check if inline or actual code block (credit to line-numbers plugin)
    var pre = env.element.parentNode
    if (!pre || !/pre/i.test(pre.nodeName)) {
      return
    }

    // Autoloader rehighlights, so only do this once.
    if (pre.parentNode.classList.contains("code-toolbar")) {
      return
    }

    // Create wrapper for <pre> to prevent scrolling toolbar with content
    var wrapper = document.createElement("div")
    wrapper.classList.add("code-toolbar")
    pre.parentNode.insertBefore(wrapper, pre)
    wrapper.append(pre)

    // Setup the toolbar
    var toolbar = document.createElement("div")
    toolbar.classList.add("toolbar")

    if (document.body.hasAttribute("data-toolbar-order")) {
      callbacks = document.body
        .getAttribute("data-toolbar-order")
        .split(",")
        .map(function(key) {
          return map[key] || noop
        })
    }

    callbacks.forEach(function(callback) {
      var element = callback(env)

      if (!element) {
        return
      }

      var item = document.createElement("div")
      item.classList.add("toolbar-item")

      item.append(element)
      toolbar.append(item)
    })

    // Add our toolbar to the currently created wrapper of <pre> tag
    wrapper.append(toolbar)
  })

  registerButton("label", function(env) {
    var pre = env.element.parentNode
    if (!pre || !/pre/i.test(pre.nodeName)) {
      return
    }

    if (!pre.hasAttribute("data-label")) {
      return
    }

    var element, template
    var text = pre.getAttribute("data-label")
    try {
      // Any normal text will blow up this selector.
      template = document.querySelector("template#" + text)
    } catch (error) {}

    if (template) {
      element = template.content
    } else {
      if (pre.hasAttribute("data-url")) {
        element = document.createElement("a")
        element.href = pre.getAttribute("data-url")
      } else {
        element = document.createElement("span")
      }

      element.textContent = text
    }

    return element
  })

  /**
   * Register the toolbar with Prism.
   */
  Prism.hooks.add("complete", hook)
})()
;(function() {
  var assign =
    Object.assign ||
    function(obj1, obj2) {
      for (var name in obj2) {
        if (obj2.hasOwnProperty(name)) obj1[name] = obj2[name]
      }
      return obj1
    }

  function NormalizeWhitespace(defaults) {
    this.defaults = assign({}, defaults)
  }

  function toCamelCase(value) {
    return value.replace(/-(\w)/g, function(match, firstChar) {
      return firstChar.toUpperCase()
    })
  }

  function tabLen(str) {
    var res = 0
    for (var i = 0; i < str.length; ++i) {
      if (str.charCodeAt(i) == "\t".charCodeAt(0)) res += 3
    }
    return str.length + res
  }

  NormalizeWhitespace.prototype = {
    setDefaults: function(defaults) {
      this.defaults = assign(this.defaults, defaults)
    },
    normalize: function(input, settings) {
      settings = assign(this.defaults, settings)

      for (var name in settings) {
        var methodName = toCamelCase(name)
        if (
          name !== "normalize" &&
          methodName !== "setDefaults" &&
          settings[name] &&
          this[methodName]
        ) {
          input = this[methodName].call(this, input, settings[name])
        }
      }

      return input
    },

    /*
     * Normalization methods
     */
    leftTrim: function(input) {
      return input.replace(/^\s+/, "")
    },
    rightTrim: function(input) {
      return input.replace(/\s+$/, "")
    },
    tabsToSpaces: function(input, spaces) {
      spaces = spaces | 0 || 4
      return input.replace(/\t/g, new Array(++spaces).join(" "))
    },
    spacesToTabs: function(input, spaces) {
      spaces = spaces | 0 || 4
      return input.replace(new RegExp(" {" + spaces + "}", "g"), "\t")
    },
    removeTrailing: function(input) {
      return input.replace(/\s*?$/gm, "")
    },
    // Support for deprecated plugin remove-initial-line-feed
    removeInitialLineFeed: function(input) {
      return input.replace(/^(?:\r?\n|\r)/, "")
    },
    removeIndent: function(input) {
      var indents = input.match(/^[^\S\n\r]*(?=\S)/gm)

      if (!indents || !indents[0].length) return input

      indents.sort(function(a, b) {
        return a.length - b.length
      })

      if (!indents[0].length) return input

      return input.replace(new RegExp("^" + indents[0], "gm"), "")
    },
    indent: function(input, tabs) {
      return input.replace(/^[^\S\n\r]*(?=\S)/gm, new Array(++tabs).join("\t") + "$&")
    },
    breakLines: function(input, characters) {
      characters = characters === true ? 80 : characters | 0 || 80

      var lines = input.split("\n")
      for (var i = 0; i < lines.length; ++i) {
        if (tabLen(lines[i]) <= characters) continue

        var line = lines[i].split(/(\s+)/g),
          len = 0

        for (var j = 0; j < line.length; ++j) {
          var tl = tabLen(line[j])
          len += tl
          if (len > characters) {
            line[j] = "\n" + line[j]
            len = tl
          }
        }
        lines[i] = line.join("")
      }
      return lines.join("\n")
    }
  }

  // Support node modules
  if (typeof module !== "undefined" && module.exports) {
    module.exports = NormalizeWhitespace
  }

  // Exit if prism is not loaded
  if (typeof Prism === "undefined") {
    return
  }

  Prism.plugins.NormalizeWhitespace = new NormalizeWhitespace({
    "remove-trailing": true,
    "remove-indent": true,
    "left-trim": true,
    "right-trim": true
    /*'break-lines': 80,
	'indent': 2,
	'remove-initial-line-feed': false,
	'tabs-to-spaces': 4,
	'spaces-to-tabs': 4*/
  })

  Prism.hooks.add("before-sanity-check", function(env) {
    var Normalizer = Prism.plugins.NormalizeWhitespace

    // Check settings
    if (env.settings && env.settings["whitespace-normalization"] === false) {
      return
    }

    // Simple mode if there is no env.element
    if ((!env.element || !env.element.parentNode) && env.code) {
      env.code = Normalizer.normalize(env.code, env.settings)
      return
    }

    // Normal mode
    var pre = env.element.parentNode
    var clsReg = /(?:^|\s)no-whitespace-normalization(?:\s|$)/
    if (
      !env.code ||
      !pre ||
      pre.nodeName.toLowerCase() !== "pre" ||
      clsReg.test(pre.className) ||
      clsReg.test(env.element.className)
    )
      return

    var children = pre.childNodes,
      before = "",
      after = "",
      codeFound = false

    // Move surrounding whitespace from the <pre> tag into the <code> tag
    for (var i = 0; i < children.length; ++i) {
      var node = children[i]

      if (node == env.element) {
        codeFound = true
      } else if (node.nodeName === "#text") {
        if (codeFound) {
          after += node.nodeValue
        } else {
          before += node.nodeValue
        }

        pre.removeChild(node)
        --i
      }
    }

    if (!env.element.children.length || !Prism.plugins.KeepMarkup) {
      env.code = before + env.code + after
      env.code = Normalizer.normalize(env.code, env.settings)
    } else {
      // Preserve markup for keep-markup plugin
      var html = before + env.element.innerHTML + after
      env.element.innerHTML = Normalizer.normalize(html, env.settings)
      env.code = env.element.textContent
    }
  })
})()
;(function() {
  if (typeof self === "undefined" || !self.Prism || !self.document) {
    return
  }

  if (!Prism.plugins.toolbar) {
    console.warn("Show Languages plugin loaded before Toolbar plugin.")

    return
  }

  // The languages map is built automatically with gulp
  var Languages = /*languages_placeholder[*/ {
    html: "HTML",
    xml: "XML",
    svg: "SVG",
    mathml: "MathML",
    css: "CSS",
    clike: "C-like",
    js: "JavaScript",
    abap: "ABAP",
    abnf: "Augmented Backus–Naur form",
    apacheconf: "Apache Configuration",
    apl: "APL",
    arff: "ARFF",
    asciidoc: "AsciiDoc",
    adoc: "AsciiDoc",
    asm6502: "6502 Assembly",
    aspnet: "ASP.NET (C#)",
    autohotkey: "AutoHotkey",
    autoit: "AutoIt",
    shell: "Bash",
    basic: "BASIC",
    bnf: "Backus–Naur form",
    rbnf: "Routing Backus–Naur form",
    csharp: "C#",
    dotnet: "C#",
    cpp: "C++",
    cil: "CIL",
    coffee: "CoffeeScript",
    cmake: "CMake",
    csp: "Content-Security-Policy",
    "css-extras": "CSS Extras",
    django: "Django/Jinja2",
    jinja2: "Django/Jinja2",
    dockerfile: "Docker",
    ebnf: "Extended Backus–Naur form",
    ejs: "EJS",
    erb: "ERB",
    fsharp: "F#",
    gcode: "G-code",
    gedcom: "GEDCOM",
    glsl: "GLSL",
    gml: "GameMaker Language",
    gamemakerlanguage: "GameMaker Language",
    graphql: "GraphQL",
    hs: "Haskell",
    hcl: "HCL",
    http: "HTTP",
    hpkp: "HTTP Public-Key-Pins",
    hsts: "HTTP Strict-Transport-Security",
    ichigojam: "IchigoJam",
    inform7: "Inform 7",
    javadoc: "JavaDoc",
    javadoclike: "JavaDoc-like",
    javastacktrace: "Java stack trace",
    jsdoc: "JSDoc",
    "js-extras": "JS Extras",
    json: "JSON",
    jsonp: "JSONP",
    json5: "JSON5",
    latex: "LaTeX",
    emacs: "Lisp",
    elisp: "Lisp",
    "emacs-lisp": "Lisp",
    lolcode: "LOLCODE",
    md: "Markdown",
    "markup-templating": "Markup templating",
    matlab: "MATLAB",
    mel: "MEL",
    n1ql: "N1QL",
    n4js: "N4JS",
    n4jsd: "N4JS",
    "nand2tetris-hdl": "Nand To Tetris HDL",
    nasm: "NASM",
    nginx: "nginx",
    nsis: "NSIS",
    objectivec: "Objective-C",
    ocaml: "OCaml",
    opencl: "OpenCL",
    parigp: "PARI/GP",
    objectpascal: "Object Pascal",
    php: "PHP",
    phpdoc: "PHPDoc",
    "php-extras": "PHP Extras",
    plsql: "PL/SQL",
    powershell: "PowerShell",
    properties: ".properties",
    protobuf: "Protocol Buffers",
    py: "Python",
    q: "Q (kdb+ database)",
    jsx: "React JSX",
    tsx: "React TSX",
    renpy: "Ren'py",
    rest: "reST (reStructuredText)",
    rb: "Ruby",
    sas: "SAS",
    sass: "Sass (Sass)",
    scss: "Sass (Scss)",
    sql: "SQL",
    soy: "Soy (Closure Template)",
    tap: "TAP",
    toml: "TOML",
    tt2: "Template Toolkit 2",
    ts: "TypeScript",
    "t4-cs": "T4 Text Templates (C#)",
    t4: "T4 Text Templates (C#)",
    "t4-vb": "T4 Text Templates (VB)",
    "t4-templating": "T4 templating",
    vbnet: "VB.Net",
    vhdl: "VHDL",
    vim: "vim",
    "visual-basic": "Visual Basic",
    vb: "Visual Basic",
    wasm: "WebAssembly",
    wiki: "Wiki markup",
    xeoracube: "XeoraCube",
    xojo: "Xojo (REALbasic)",
    xquery: "XQuery",
    yaml: "YAML",
    yml: "YAML"
  } /*]*/

  Prism.plugins.toolbar.registerButton("show-language", function(env) {
    var pre = env.element.parentNode
    if (!pre || !/pre/i.test(pre.nodeName)) {
      return
    }

    /**
     * Tries to guess the name of a language given its id.
     *
     * @param {string} id The language id.
     * @returns {string}
     */
    function guessTitle(id) {
      if (!id) {
        return id
      }
      return (id.substring(0, 1).toUpperCase() + id.substring(1)).replace(
        /s(?=cript)/,
        "S"
      )
    }

    var language =
      pre.getAttribute("data-language") ||
      Languages[env.language] ||
      guessTitle(env.language)

    if (!language) {
      return
    }
    var element = document.createElement("span")
    element.textContent = language

    return element
  })
})()
