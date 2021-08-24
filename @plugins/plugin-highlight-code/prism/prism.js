/* eslint-disable */

if ("undefined" != typeof window) {
  /* PrismJS 1.22.0
https://prismjs.com/download.html#themes=prism-tomorrow&languages=markup+css+clike+javascript+bash+json+markdown+sql+typescript+typoscript+yaml */
  var _self =
      "undefined" != typeof window
        ? window
        : "undefined" != typeof WorkerGlobalScope &&
          self instanceof WorkerGlobalScope
        ? self
        : {},
    Prism = (function (u) {
      var c = /\blang(?:uage)?-([\w-]+)\b/i,
        n = 0,
        _ = {
          manual: u.Prism && u.Prism.manual,
          disableWorkerMessageHandler:
            u.Prism && u.Prism.disableWorkerMessageHandler,
          util: {
            encode: function e(n) {
              return n instanceof M
                ? new M(n.type, e(n.content), n.alias)
                : Array.isArray(n)
                ? n.map(e)
                : n
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/\u00A0/g, " ")
            },
            type: function (e) {
              return Object.prototype.toString.call(e).slice(8, -1)
            },
            objId: function (e) {
              return (
                e.__id || Object.defineProperty(e, "__id", { value: ++n }),
                e.__id
              )
            },
            clone: function t(e, r) {
              var a, n
              switch (((r = r || {}), _.util.type(e))) {
                case "Object":
                  if (((n = _.util.objId(e)), r[n])) return r[n]
                  for (var i in ((a = {}), (r[n] = a), e))
                    e.hasOwnProperty(i) && (a[i] = t(e[i], r))
                  return a
                case "Array":
                  return (
                    (n = _.util.objId(e)),
                    r[n]
                      ? r[n]
                      : ((a = []),
                        (r[n] = a),
                        e.forEach(function (e, n) {
                          a[n] = t(e, r)
                        }),
                        a)
                  )
                default:
                  return e
              }
            },
            getLanguage: function (e) {
              for (; e && !c.test(e.className); ) e = e.parentElement
              return e
                ? (e.className.match(c) || [, "none"])[1].toLowerCase()
                : "none"
            },
            currentScript: function () {
              if ("undefined" == typeof document) return null
              if ("currentScript" in document) return document.currentScript
              try {
                throw new Error()
              } catch (error) {
                var n = (/at [^\n\r(]*\((.*):.+:.+\)$/i.exec(error.stack) ||
                  [])[1]
                if (n) {
                  var t = document.querySelectorAll("script")
                  for (var r in t) if (t[r].src == n) return t[r]
                }
                return null
              }
            },
            isActive: function (e, n, t) {
              for (var r = "no-" + n; e; ) {
                var a = e.classList
                if (a.contains(n)) return !0
                if (a.contains(r)) return !1
                e = e.parentElement
              }
              return !!t
            },
          },
          languages: {
            extend: function (e, n) {
              var t = _.util.clone(_.languages[e])
              for (var r in n) t[r] = n[r]
              return t
            },
            insertBefore: function (t, e, n, r) {
              var a = (r = r || _.languages)[t],
                i = {}
              for (var l in a)
                if (a.hasOwnProperty(l)) {
                  if (l == e)
                    for (var o in n) n.hasOwnProperty(o) && (i[o] = n[o])
                  n.hasOwnProperty(l) || (i[l] = a[l])
                }
              var s = r[t]
              return (
                (r[t] = i),
                _.languages.DFS(_.languages, function (e, n) {
                  n === s && e != t && (this[e] = i)
                }),
                i
              )
            },
            DFS: function e(n, t, r, a) {
              a = a || {}
              var i = _.util.objId
              for (var l in n)
                if (n.hasOwnProperty(l)) {
                  t.call(n, l, n[l], r || l)
                  var o = n[l],
                    s = _.util.type(o)
                  "Object" !== s || a[i(o)]
                    ? "Array" !== s ||
                      a[i(o)] ||
                      ((a[i(o)] = !0), e(o, t, l, a))
                    : ((a[i(o)] = !0), e(o, t, null, a))
                }
            },
          },
          plugins: {},
          highlightAll: function (e, n) {
            _.highlightAllUnder(document, e, n)
          },
          highlightAllUnder: function (e, n, t) {
            var r = {
              callback: t,
              container: e,
              selector:
                'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code',
            }
            _.hooks.run("before-highlightall", r),
              (r.elements = Array.prototype.slice.apply(
                r.container.querySelectorAll(r.selector),
              )),
              _.hooks.run("before-all-elements-highlight", r)
            for (var a, i = 0; (a = r.elements[i++]); )
              _.highlightElement(a, !0 === n, r.callback)
          },
          highlightElement: function (e, n, t) {
            var r = _.util.getLanguage(e),
              a = _.languages[r]
            e.className =
              e.className.replace(c, "").replace(/\s+/g, " ") + " language-" + r
            var i = e.parentElement
            i &&
              "pre" === i.nodeName.toLowerCase() &&
              (i.className =
                i.className.replace(c, "").replace(/\s+/g, " ") +
                " language-" +
                r)
            var l = { element: e, language: r, grammar: a, code: e.textContent }
            function o(e) {
              ;(l.highlightedCode = e),
                _.hooks.run("before-insert", l),
                (l.element.innerHTML = l.highlightedCode),
                _.hooks.run("after-highlight", l),
                _.hooks.run("complete", l),
                t && t.call(l.element)
            }
            if ((_.hooks.run("before-sanity-check", l), !l.code))
              return _.hooks.run("complete", l), void (t && t.call(l.element))
            if ((_.hooks.run("before-highlight", l), l.grammar))
              if (n && u.Worker) {
                var s = new Worker(_.filename)
                ;(s.onmessage = function (e) {
                  o(e.data)
                }),
                  s.postMessage(
                    JSON.stringify({
                      language: l.language,
                      code: l.code,
                      immediateClose: !0,
                    }),
                  )
              } else o(_.highlight(l.code, l.grammar, l.language))
            else o(_.util.encode(l.code))
          },
          highlight: function (e, n, t) {
            var r = { code: e, grammar: n, language: t }
            return (
              _.hooks.run("before-tokenize", r),
              (r.tokens = _.tokenize(r.code, r.grammar)),
              _.hooks.run("after-tokenize", r),
              M.stringify(_.util.encode(r.tokens), r.language)
            )
          },
          tokenize: function (e, n) {
            var t = n.rest
            if (t) {
              for (var r in t) n[r] = t[r]
              delete n.rest
            }
            var a = new i()
            return (
              z(a, a.head, e),
              (function e(n, t, r, a, i, l) {
                for (var o in r)
                  if (r.hasOwnProperty(o) && r[o]) {
                    var s = r[o]
                    s = Array.isArray(s) ? s : [s]
                    for (const [u, c] of s.entries()) {
                      if (l && l.cause == o + "," + u) return
                      var g = c.inside,
                        f = !!c.lookbehind,
                        h = !!c.greedy,
                        d = c.alias
                      if (h && !c.pattern.global) {
                        var v = c.pattern.toString().match(/[imsuy]*$/)[0]
                        c.pattern = new RegExp(c.pattern.source, v + "g")
                      }
                      for (
                        var p = c.pattern || c, m = a.next, y = i;
                        m !== t.tail && !(l && y >= l.reach);
                        y += m.value.length, m = m.next
                      ) {
                        var k = m.value
                        if (t.length > n.length) return
                        if (!(k instanceof M)) {
                          var b,
                            x = 1
                          if (h) {
                            if (!(b = W(p, y, n, f))) break
                            var w = b.index,
                              A = b.index + b[0].length,
                              P = y
                            for (P += m.value.length; P <= w; )
                              (m = m.next), (P += m.value.length)
                            if (
                              ((P -= m.value.length),
                              (y = P),
                              m.value instanceof M)
                            )
                              continue
                            for (
                              var S = m;
                              S !== t.tail &&
                              (P < A || "string" == typeof S.value);
                              S = S.next
                            )
                              x++, (P += S.value.length)
                            x--, (k = n.slice(y, P)), (b.index -= y)
                          } else if (!(b = W(p, 0, k, f))) continue
                          var w = b.index,
                            E = b[0],
                            O = k.slice(0, w),
                            L = k.slice(w + E.length),
                            N = y + k.length
                          l && N > l.reach && (l.reach = N)
                          var j = m.prev
                          O && ((j = z(t, j, O)), (y += O.length)), I(t, j, x)
                          var C = new M(o, g ? _.tokenize(E, g) : E, d, E)
                          ;(m = z(t, j, C)),
                            L && z(t, m, L),
                            1 < x &&
                              e(n, t, r, m.prev, y, {
                                cause: o + "," + u,
                                reach: N,
                              })
                        }
                      }
                    }
                  }
              })(e, a, n, a.head, 0),
              (function (e) {
                var n = [],
                  t = e.head.next
                for (; t !== e.tail; ) n.push(t.value), (t = t.next)
                return n
              })(a)
            )
          },
          hooks: {
            all: {},
            add: function (e, n) {
              var t = _.hooks.all
              ;(t[e] = t[e] || []), t[e].push(n)
            },
            run: function (e, n) {
              var t = _.hooks.all[e]
              if (t && t.length) for (var r, a = 0; (r = t[a++]); ) r(n)
            },
          },
          Token: M,
        }
      function M(e, n, t, r) {
        ;(this.type = e),
          (this.content = n),
          (this.alias = t),
          (this.length = 0 | (r || "").length)
      }
      function W(e, n, t, r) {
        e.lastIndex = n
        var a = e.exec(t)
        if (a && r && a[1]) {
          var i = a[1].length
          ;(a.index += i), (a[0] = a[0].slice(i))
        }
        return a
      }
      function i() {
        var e = { value: null, prev: null, next: null },
          n = { value: null, prev: e, next: null }
        ;(e.next = n), (this.head = e), (this.tail = n), (this.length = 0)
      }
      function z(e, n, t) {
        var r = n.next,
          a = { value: t, prev: n, next: r }
        return (n.next = a), (r.prev = a), e.length++, a
      }
      function I(e, n, t) {
        for (var r = n.next, a = 0; a < t && r !== e.tail; a++) r = r.next
        ;((n.next = r).prev = n), (e.length -= a)
      }
      if (
        ((u.Prism = _),
        (M.stringify = function n(e, t) {
          if ("string" == typeof e) return e
          if (Array.isArray(e)) {
            var r = ""
            return (
              e.forEach(function (e) {
                r += n(e, t)
              }),
              r
            )
          }
          var a = {
              type: e.type,
              content: n(e.content, t),
              tag: "span",
              classes: ["token", e.type],
              attributes: {},
              language: t,
            },
            i = e.alias
          i &&
            (Array.isArray(i)
              ? Array.prototype.push.apply(a.classes, i)
              : a.classes.push(i)),
            _.hooks.run("wrap", a)
          var l = ""
          for (var o in a.attributes)
            l +=
              " " +
              o +
              '="' +
              (a.attributes[o] || "").replace(/"/g, "&quot;") +
              '"'
          return (
            "<" +
            a.tag +
            ' class="' +
            a.classes.join(" ") +
            '"' +
            l +
            ">" +
            a.content +
            "</" +
            a.tag +
            ">"
          )
        }),
        !u.document)
      )
        return (
          u.addEventListener &&
            (_.disableWorkerMessageHandler ||
              u.addEventListener(
                "message",
                function (e) {
                  var n = JSON.parse(e.data),
                    t = n.language,
                    r = n.code,
                    a = n.immediateClose
                  u.postMessage(_.highlight(r, _.languages[t], t)),
                    a && u.close()
                },
                !1,
              )),
          _
        )
      var e = _.util.currentScript()
      function t() {
        _.manual || _.highlightAll()
      }
      if (
        (e &&
          ((_.filename = e.src),
          e.hasAttribute("data-manual") && (_.manual = !0)),
        !_.manual)
      ) {
        var r = document.readyState
        "loading" === r || ("interactive" === r && e && e.defer)
          ? document.addEventListener("DOMContentLoaded", t)
          : window.requestAnimationFrame
          ? window.requestAnimationFrame(t)
          : window.setTimeout(t, 16)
      }
      return _
    })(_self)
  "undefined" != typeof module && module.exports && (module.exports = Prism),
    "undefined" != typeof global && (global.Prism = Prism)
  ;(Prism.languages.markup = {
    comment: /<!--[\S\s]*?-->/,
    prolog: /<\?[\S\s]+?\?>/,
    doctype: {
      pattern: /<!doctype(?:[^"'>[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^"'<\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*]\s*)?>/i,
      greedy: !0,
      inside: {
        "internal-subset": {
          pattern: /(\[)[\S\s]+(?=]>$)/,
          lookbehind: !0,
          greedy: !0,
          inside: null,
        },
        string: { pattern: /"[^"]*"|'[^']*'/, greedy: !0 },
        punctuation: /^<!|>$|[[\]]/,
        "doctype-tag": /^DOCTYPE/,
        name: /[^\s"'<>]+/,
      },
    },
    cdata: /<!\[cdata\[[\S\s]*?]]>/i,
    tag: {
      pattern: /<\/?(?!\d)[^\s$%/<=>]+(?:\s(?:\s*[^\s/=>]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=>]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
      greedy: !0,
      inside: {
        tag: {
          pattern: /^<\/?[^\s/>]+/,
          inside: { punctuation: /^<\/?/, namespace: /^[^\s/:>]+:/ },
        },
        "attr-value": {
          pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s"'=>]+)/,
          inside: {
            punctuation: [{ pattern: /^=/, alias: "attr-equals" }, /"|'/],
          },
        },
        punctuation: /\/?>/,
        "attr-name": {
          pattern: /[^\s/>]+/,
          inside: { namespace: /^[^\s/:>]+:/ },
        },
      },
    },
    entity: [
      { pattern: /&[\da-z]{1,8};/i, alias: "named-entity" },
      /&#x?[\da-f]{1,8};/i,
    ],
  }),
    (Prism.languages.markup.tag.inside["attr-value"].inside.entity =
      Prism.languages.markup.entity),
    (Prism.languages.markup.doctype.inside["internal-subset"].inside =
      Prism.languages.markup),
    Prism.hooks.add("wrap", function (a) {
      "entity" === a.type &&
        (a.attributes.title = a.content.replace(/&amp;/, "&"))
    }),
    Object.defineProperty(Prism.languages.markup.tag, "addInlined", {
      value: function (a, e) {
        var s = {}
        ;(s["language-" + e] = {
          pattern: /(^<!\[cdata\[)[\S\s]+?(?=]]>$)/i,
          lookbehind: !0,
          inside: Prism.languages[e],
        }),
          (s.cdata = /^<!\[cdata\[|]]>$/i)
        var n = {
          "included-cdata": { pattern: /<!\[cdata\[[\S\s]*?]]>/i, inside: s },
        }
        n["language-" + e] = { pattern: /[\S\s]+/, inside: Prism.languages[e] }
        var t = {}
        ;(t[a] = {
          pattern: new RegExp(
            "(<__[^]*?>)(?:<!\\[CDATA\\[(?:[^\\]]|\\](?!\\]>))*\\]\\]>|(?!<!\\[CDATA\\[)[^])*?(?=</__>)".replace(
              /__/g,
              function () {
                return a
              },
            ),
            "i",
          ),
          lookbehind: !0,
          greedy: !0,
          inside: n,
        }),
          Prism.languages.insertBefore("markup", "cdata", t)
      },
    }),
    (Prism.languages.html = Prism.languages.markup),
    (Prism.languages.mathml = Prism.languages.markup),
    (Prism.languages.svg = Prism.languages.markup),
    (Prism.languages.xml = Prism.languages.extend("markup", {})),
    (Prism.languages.ssml = Prism.languages.xml),
    (Prism.languages.atom = Prism.languages.xml),
    (Prism.languages.rss = Prism.languages.xml)
  !(function (e) {
    var t = /("|')(?:\\(?:\r\n|[\S\s])|(?!\1)[^\n\r\\])*\1/
    ;(e.languages.css = {
      comment: /\/\*[\S\s]*?\*\//,
      atrule: {
        pattern: /@[\w-]+[\S\s]*?(?:;|(?=\s*{))/,
        inside: {
          rule: /^@[\w-]+/,
          "selector-function-argument": {
            pattern: /(\bselector\s*\((?!\s*\))\s*)(?:[^()]|\((?:[^()]|\([^()]*\))*\))+?(?=\s*\))/,
            lookbehind: !0,
            alias: "selector",
          },
          keyword: {
            pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
            lookbehind: !0,
          },
        },
      },
      url: {
        pattern: new RegExp(
          "\\burl\\((?:" + t.source + "|(?:[^\\\\\r\n()\"']|\\\\[^])*)\\)",
          "i",
        ),
        greedy: !0,
        inside: {
          function: /^url/i,
          punctuation: /^\(|\)$/,
          string: { pattern: new RegExp("^" + t.source + "$"), alias: "url" },
        },
      },
      selector: new RegExp(
        "[^{}\\s](?:[^{};\"']|" + t.source + ")*?(?=\\s*\\{)",
      ),
      string: { pattern: t, greedy: !0 },
      property: /[_a-z\u00A0-\uFFFF-][\w\u00A0-\uFFFF-]*(?=\s*:)/i,
      important: /!important\b/i,
      function: /[\da-z-]+(?=\()/i,
      punctuation: /[(),:;{}]/,
    }),
      (e.languages.css.atrule.inside.rest = e.languages.css)
    var s = e.languages.markup
    s &&
      (s.tag.addInlined("style", "css"),
      e.languages.insertBefore(
        "inside",
        "attr-value",
        {
          "style-attr": {
            pattern: /(^|[\s"'])style\s*=\s*(?:"[^"]*"|'[^']*')/i,
            lookbehind: !0,
            inside: {
              "attr-value": {
                pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s"'=>]+)/,
                inside: {
                  style: {
                    pattern: /(["'])[\S\s]+(?=["']$)/,
                    lookbehind: !0,
                    alias: "language-css",
                    inside: e.languages.css,
                  },
                  punctuation: [{ pattern: /^=/, alias: "attr-equals" }, /"|'/],
                },
              },
              "attr-name": /^style/i,
            },
          },
        },
        s.tag,
      ))
  })(Prism)
  Prism.languages.clike = {
    comment: [
      { pattern: /(^|[^\\])\/\*[\S\s]*?(?:\*\/|$)/, lookbehind: !0 },
      { pattern: /(^|[^:\\])\/\/.*/, lookbehind: !0, greedy: !0 },
    ],
    string: {
      pattern: /(["'])(?:\\(?:\r\n|[\S\s])|(?!\1)[^\n\r\\])*\1/,
      greedy: !0,
    },
    "class-name": {
      pattern: /(\b(?:class|interface|extends|implements|trait|instanceof|new)\s+|\bcatch\s+\()[\w.\\]+/i,
      lookbehind: !0,
      inside: { punctuation: /[.\\]/ },
    },
    keyword: /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
    boolean: /\b(?:true|false)\b/,
    function: /\w+(?=\()/,
    number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
    operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[%*/?^~]/,
    punctuation: /[(),.:;[\]{}]/,
  }
  ;(Prism.languages.javascript = Prism.languages.extend("clike", {
    "class-name": [
      Prism.languages.clike["class-name"],
      {
        pattern: /(^|[^\w$\u00A0-\uFFFF])[$A-Z_\u00A0-\uFFFF][\w$\u00A0-\uFFFF]*(?=\.(?:prototype|constructor))/,
        lookbehind: !0,
      },
    ],
    keyword: [
      { pattern: /((?:^|})\s*)(?:catch|finally)\b/, lookbehind: !0 },
      {
        pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|async(?=\s*(?:function\b|\(|[\w$\u00A0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|(?:get|set)(?=\s*[\w$[\u00A0-\uFFFF])|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
        lookbehind: !0,
      },
    ],
    number: /\b(?:(?:0[Xx](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[Bb](?:[01](?:_[01])?)+|0[Oo](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/,
    function: /#?[$A-Z_a-z\u00A0-\uFFFF][\w$\u00A0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
    operator: /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[!%&*+/<=>^|-]=?|\.{3}|\?\?=?|\?\.?|[:~]/,
  })),
    (Prism.languages.javascript[
      "class-name"
    ][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/),
    Prism.languages.insertBefore("javascript", "keyword", {
      regex: {
        pattern: /((?:^|[^\s\w"$').\]\u00A0-\uFFFF]|\b(?:return|yield))\s*)\/(?:\[(?:[^\n\r\\\]]|\\.)*]|\\.|[^\n\r/[\\])+\/[gimsuy]{0,6}(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\n\r),.:;\]}]|\/\/))/,
        lookbehind: !0,
        greedy: !0,
        inside: {
          "regex-source": {
            pattern: /^(\/)[\S\s]+(?=\/[a-z]*$)/,
            lookbehind: !0,
            alias: "language-regex",
            inside: Prism.languages.regex,
          },
          "regex-flags": /[a-z]+$/,
          "regex-delimiter": /^\/|\/$/,
        },
      },
      "function-variable": {
        pattern: /#?[$A-Z_a-z\u00A0-\uFFFF][\w$\u00A0-\uFFFF]*(?=\s*[:=]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[$A-Z_a-z\u00A0-\uFFFF][\w$\u00A0-\uFFFF]*)\s*=>))/,
        alias: "function",
      },
      parameter: [
        {
          pattern: /(function(?:\s+[$A-Z_a-z\u00A0-\uFFFF][\w$\u00A0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/,
          lookbehind: !0,
          inside: Prism.languages.javascript,
        },
        {
          pattern: /[$_a-z\u00A0-\uFFFF][\w$\u00A0-\uFFFF]*(?=\s*=>)/i,
          inside: Prism.languages.javascript,
        },
        {
          pattern: /(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/,
          lookbehind: !0,
          inside: Prism.languages.javascript,
        },
        {
          pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![\w$\u00A0-\uFFFF]))[$A-Z_a-z\u00A0-\uFFFF][\w$\u00A0-\uFFFF]*\s*\(\s*|]\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*{)/,
          lookbehind: !0,
          inside: Prism.languages.javascript,
        },
      ],
      constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/,
    }),
    Prism.languages.insertBefore("javascript", "string", {
      "template-string": {
        pattern: /`(?:\\[\S\s]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}|(?!\${)[^\\`])*`/,
        greedy: !0,
        inside: {
          "template-punctuation": { pattern: /^`|`$/, alias: "string" },
          interpolation: {
            pattern: /((?:^|[^\\])(?:\\{2})*)\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}/,
            lookbehind: !0,
            inside: {
              "interpolation-punctuation": {
                pattern: /^\${|}$/,
                alias: "punctuation",
              },
              rest: Prism.languages.javascript,
            },
          },
          string: /[\S\s]+/,
        },
      },
    }),
    Prism.languages.markup &&
      Prism.languages.markup.tag.addInlined("script", "javascript"),
    (Prism.languages.js = Prism.languages.javascript)
  !(function (e) {
    var t =
        "\\b(?:BASH|BASHOPTS|BASH_ALIASES|BASH_ARGC|BASH_ARGV|BASH_CMDS|BASH_COMPLETION_COMPAT_DIR|BASH_LINENO|BASH_REMATCH|BASH_SOURCE|BASH_VERSINFO|BASH_VERSION|COLORTERM|COLUMNS|COMP_WORDBREAKS|DBUS_SESSION_BUS_ADDRESS|DEFAULTS_PATH|DESKTOP_SESSION|DIRSTACK|DISPLAY|EUID|GDMSESSION|GDM_LANG|GNOME_KEYRING_CONTROL|GNOME_KEYRING_PID|GPG_AGENT_INFO|GROUPS|HISTCONTROL|HISTFILE|HISTFILESIZE|HISTSIZE|HOME|HOSTNAME|HOSTTYPE|IFS|INSTANCE|JOB|LANG|LANGUAGE|LC_ADDRESS|LC_ALL|LC_IDENTIFICATION|LC_MEASUREMENT|LC_MONETARY|LC_NAME|LC_NUMERIC|LC_PAPER|LC_TELEPHONE|LC_TIME|LESSCLOSE|LESSOPEN|LINES|LOGNAME|LS_COLORS|MACHTYPE|MAILCHECK|MANDATORY_PATH|NO_AT_BRIDGE|OLDPWD|OPTERR|OPTIND|ORBIT_SOCKETDIR|OSTYPE|PAPERSIZE|PATH|PIPESTATUS|PPID|PS1|PS2|PS3|PS4|PWD|RANDOM|REPLY|SECONDS|SELINUX_INIT|SESSION|SESSIONTYPE|SESSION_MANAGER|SHELL|SHELLOPTS|SHLVL|SSH_AUTH_SOCK|TERM|UID|UPSTART_EVENTS|UPSTART_INSTANCE|UPSTART_JOB|UPSTART_SESSION|USER|WINDOWID|XAUTHORITY|XDG_CONFIG_DIRS|XDG_CURRENT_DESKTOP|XDG_DATA_DIRS|XDG_GREETER_DATA_DIR|XDG_MENU_PREFIX|XDG_RUNTIME_DIR|XDG_SEAT|XDG_SEAT_PATH|XDG_SESSION_DESKTOP|XDG_SESSION_ID|XDG_SESSION_PATH|XDG_SESSION_TYPE|XDG_VTNR|XMODIFIERS)\\b",
      n = {
        pattern: /(^(["']?)\w+\2)[\t ]+\S.*/,
        lookbehind: !0,
        alias: "punctuation",
        inside: null,
      },
      a = {
        bash: n,
        environment: { pattern: new RegExp("\\$" + t), alias: "constant" },
        variable: [
          {
            pattern: /\$?\(\([\S\s]+?\)\)/,
            greedy: !0,
            inside: {
              variable: [
                { pattern: /(^\$\(\([\S\s]+)\)\)/, lookbehind: !0 },
                /^\$\(\(/,
              ],
              number: /\b0x[\dA-Fa-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee]-?\d+)?/,
              operator: /--?|-=|\+\+?|\+=|!=?|~|\*\*?|\*=|\/=?|%=?|<<=?|>>=?|<=?|>=?|==?|&&?|&=|\^=?|\|\|?|\|=|\?|:/,
              punctuation: /\(\(?|\)\)?|,|;/,
            },
          },
          {
            pattern: /\$\((?:\([^)]+\)|[^()])+\)|`[^`]+`/,
            greedy: !0,
            inside: { variable: /^\$\(|^`|\)$|`$/ },
          },
          {
            pattern: /\${[^}]+}/,
            greedy: !0,
            inside: {
              operator: /:[+=?-]?|[!/]|##?|%%?|\^\^?|,,?/,
              punctuation: /[[\]]/,
              environment: {
                pattern: new RegExp("(\\{)" + t),
                lookbehind: !0,
                alias: "constant",
              },
            },
          },
          /\$(?:\w+|[!#$*?@])/,
        ],
        entity: /\\(?:["E\\a-cefnrtv]|O?[0-7]{1,3}|x[\dA-Fa-f]{1,2}|u[\dA-Fa-f]{4}|U[\dA-Fa-f]{8})/,
      }
    ;(e.languages.bash = {
      shebang: { pattern: /^#!\s*\/.*/, alias: "important" },
      comment: { pattern: /(^|[^"$\\{])#.*/, lookbehind: !0 },
      "function-name": [
        {
          pattern: /(\bfunction\s+)\w+(?=(?:\s*\(?:\s*\))?\s*{)/,
          lookbehind: !0,
          alias: "function",
        },
        { pattern: /\b\w+(?=\s*\(\s*\)\s*{)/, alias: "function" },
      ],
      "for-or-select": {
        pattern: /(\b(?:for|select)\s+)\w+(?=\s+in\s)/,
        alias: "variable",
        lookbehind: !0,
      },
      "assign-left": {
        pattern: /(^|[\s&;|]|[<>]\()\w+(?=\+?=)/,
        inside: {
          environment: {
            pattern: new RegExp("(^|[\\s;|&]|[<>]\\()" + t),
            lookbehind: !0,
            alias: "constant",
          },
        },
        alias: "variable",
        lookbehind: !0,
      },
      string: [
        {
          pattern: /((?:^|[^<])<<-?\s*)(\w+?)\s[\S\s]*?(?:\r?\n|\r)\2/,
          lookbehind: !0,
          greedy: !0,
          inside: a,
        },
        {
          pattern: /((?:^|[^<])<<-?\s*)(["'])(\w+)\2\s[\S\s]*?(?:\r?\n|\r)\3/,
          lookbehind: !0,
          greedy: !0,
          inside: { bash: n },
        },
        {
          pattern: /(^|[^\\](?:\\\\)*)(["'])(?:\\[\S\s]|\$\([^)]+\)|\$(?!\()|`[^`]+`|(?!\2)[^$\\`])*\2/,
          lookbehind: !0,
          greedy: !0,
          inside: a,
        },
      ],
      environment: { pattern: new RegExp("\\$?" + t), alias: "constant" },
      variable: a.variable,
      function: {
        pattern: /(^|[\s&;|]|[<>]\()(?:add|apropos|apt|aptitude|apt-cache|apt-get|aspell|automysqlbackup|awk|basename|bash|bc|bconsole|bg|bzip2|cal|cat|cfdisk|chgrp|chkconfig|chmod|chown|chroot|cksum|clear|cmp|column|comm|composer|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|debootstrap|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|du|egrep|eject|env|ethtool|expand|expect|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|git|gparted|grep|groupadd|groupdel|groupmod|groups|grub-mkconfig|gzip|halt|head|hg|history|host|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|ip|jobs|join|kill|killall|less|link|ln|locate|logname|logrotate|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|lynx|make|man|mc|mdadm|mkconfig|mkdir|mke2fs|mkfifo|mkfs|mkisofs|mknod|mkswap|mmv|more|most|mount|mtools|mtr|mutt|mv|nano|nc|netstat|nice|nl|nohup|notify-send|npm|nslookup|op|open|parted|passwd|paste|pathchk|ping|pkill|pnpm|popd|pr|printcap|printenv|ps|pushd|pv|quota|quotacheck|quotactl|ram|rar|rcp|reboot|remsync|rename|renice|rev|rm|rmdir|rpm|rsync|scp|screen|sdiff|sed|sendmail|seq|service|sftp|sh|shellcheck|shuf|shutdown|sleep|slocate|sort|split|ssh|stat|strace|su|sudo|sum|suspend|swapon|sync|tac|tail|tar|tee|time|timeout|top|touch|tr|traceroute|tsort|tty|umount|uname|unexpand|uniq|units|unrar|unshar|unzip|update-grub|uptime|useradd|userdel|usermod|users|uudecode|uuencode|v|vdir|vi|vim|virsh|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yarn|yes|zenity|zip|zsh|zypper)(?=$|[\s&);|])/,
        lookbehind: !0,
      },
      keyword: {
        pattern: /(^|[\s&;|]|[<>]\()(?:if|then|else|elif|fi|for|while|in|case|esac|function|select|do|done|until)(?=$|[\s&);|])/,
        lookbehind: !0,
      },
      builtin: {
        pattern: /(^|[\s&;|]|[<>]\()(?:\.|:|break|cd|continue|eval|exec|exit|export|getopts|hash|pwd|readonly|return|shift|test|times|trap|umask|unset|alias|bind|builtin|caller|command|declare|echo|enable|help|let|local|logout|mapfile|printf|read|readarray|source|type|typeset|ulimit|unalias|set|shopt)(?=$|[\s&);|])/,
        lookbehind: !0,
        alias: "class-name",
      },
      boolean: {
        pattern: /(^|[\s&;|]|[<>]\()(?:true|false)(?=$|[\s&);|])/,
        lookbehind: !0,
      },
      "file-descriptor": { pattern: /\B&\d\b/, alias: "important" },
      operator: {
        pattern: /\d?<>|>\||\+=|==?|!=?|=~|<<[<-]?|[\d&]?>>|\d?[<>]&?|&[&>]?|\|[&|]?|<=?|>=?/,
        inside: { "file-descriptor": { pattern: /^\d/, alias: "important" } },
      },
      punctuation: /\$?\(\(?|\)\)?|\.\.|[;[\\\]{}]/,
      number: { pattern: /(^|\s)(?:[1-9]\d*|0)(?:[,.]\d+)?\b/, lookbehind: !0 },
    }),
      (n.inside = e.languages.bash)
    for (
      var s = [
          "comment",
          "function-name",
          "for-or-select",
          "assign-left",
          "string",
          "environment",
          "function",
          "keyword",
          "builtin",
          "boolean",
          "file-descriptor",
          "operator",
          "punctuation",
          "number",
        ],
        i = a.variable[1].inside,
        o = 0;
      o < s.length;
      o++
    )
      i[s[o]] = e.languages.bash[s[o]]
    e.languages.shell = e.languages.bash
  })(Prism)
  ;(Prism.languages.json = {
    property: { pattern: /"(?:\\.|[^\n\r"\\])*"(?=\s*:)/, greedy: !0 },
    string: { pattern: /"(?:\\.|[^\n\r"\\])*"(?!\s*:)/, greedy: !0 },
    comment: { pattern: /\/\/.*|\/\*[\S\s]*?(?:\*\/|$)/, greedy: !0 },
    number: /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
    punctuation: /[,[\]{}]/,
    operator: /:/,
    boolean: /\b(?:true|false)\b/,
    null: { pattern: /\bnull\b/, alias: "keyword" },
  }),
    (Prism.languages.webmanifest = Prism.languages.json)
  !(function (d) {
    function n(n) {
      return (
        (n = n.replace(/<inner>/g, function () {
          return "(?:\\\\.|[^\\\\\n\r]|(?:\n|\r\n?)(?!\n|\r\n?))"
        })),
        new RegExp("((?:^|[^\\\\])(?:\\\\{2})*)(?:" + n + ")")
      )
    }
    var e = "(?:\\\\.|``(?:[^`\r\n]|`(?!`))+``|`[^`\r\n]+`|[^\\\\|\r\n`])+",
      t = "\\|?__(?:\\|__)+\\|?(?:(?:\n|\r\n?)|$)".replace(/__/g, function () {
        return e
      }),
      a =
        "\\|?[ \t]*:?-{3,}:?[ \t]*(?:\\|[ \t]*:?-{3,}:?[ \t]*)+\\|?(?:\n|\r\n?)"
    ;(d.languages.markdown = d.languages.extend("markup", {})),
      d.languages.insertBefore("markdown", "prolog", {
        "front-matter-block": {
          pattern: /(^(?:\s*[\n\r])?)---(?!.)[\S\s]*?[\n\r]---(?!.)/,
          lookbehind: !0,
          greedy: !0,
          inside: {
            punctuation: /^---|---$/,
            "font-matter": {
              pattern: /\S+(?:\s+\S+)*/,
              alias: ["yaml", "language-yaml"],
              inside: d.languages.yaml,
            },
          },
        },
        blockquote: { pattern: /^>(?:[\t ]*>)*/m, alias: "punctuation" },
        table: {
          pattern: new RegExp("^" + t + a + "(?:" + t + ")*", "m"),
          inside: {
            "table-data-rows": {
              pattern: new RegExp("^(" + t + a + ")(?:" + t + ")*$"),
              lookbehind: !0,
              inside: {
                "table-data": {
                  pattern: new RegExp(e),
                  inside: d.languages.markdown,
                },
                punctuation: /\|/,
              },
            },
            "table-line": {
              pattern: new RegExp("^(" + t + ")" + a + "$"),
              lookbehind: !0,
              inside: { punctuation: /\||:?-{3,}:?/ },
            },
            "table-header-row": {
              pattern: new RegExp("^" + t + "$"),
              inside: {
                "table-header": {
                  pattern: new RegExp(e),
                  alias: "important",
                  inside: d.languages.markdown,
                },
                punctuation: /\|/,
              },
            },
          },
        },
        code: [
          {
            pattern: /((?:^|\n)[\t ]*\n|(?:^|\r\n?)[\t ]*\r\n?)(?: {4}|\t).+(?:(?:\n|\r\n?)(?: {4}|\t).+)*/,
            lookbehind: !0,
            alias: "keyword",
          },
          { pattern: /``.+?``|`[^\n\r`]+`/, alias: "keyword" },
          {
            pattern: /^```[\S\s]*?^```$/m,
            greedy: !0,
            inside: {
              "code-block": {
                pattern: /^(```.*(?:\n|\r\n?))[\S\s]+?(?=(?:\n|\r\n?)^```$)/m,
                lookbehind: !0,
              },
              "code-language": { pattern: /^(```).+/, lookbehind: !0 },
              punctuation: /```/,
            },
          },
        ],
        title: [
          {
            pattern: /\S.*(?:\n|\r\n?)(?:==+|--+)(?=[\t ]*$)/m,
            alias: "important",
            inside: { punctuation: /==+$|--+$/ },
          },
          {
            pattern: /(^\s*)#+.+/m,
            lookbehind: !0,
            alias: "important",
            inside: { punctuation: /^#+|#+$/ },
          },
        ],
        hr: {
          pattern: /(^\s*)([*-])(?:[\t ]*\2){2,}(?=\s*$)/m,
          lookbehind: !0,
          alias: "punctuation",
        },
        list: {
          pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,
          lookbehind: !0,
          alias: "punctuation",
        },
        "url-reference": {
          pattern: /!?\[[^\]]+]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
          inside: {
            variable: { pattern: /^(!?\[)[^\]]+/, lookbehind: !0 },
            string: /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
            punctuation: /^[!:[\]]|[<>]/,
          },
          alias: "url",
        },
        bold: {
          pattern: n(
            "\\b__(?:(?!_)<inner>|_(?:(?!_)<inner>)+_)+__\\b|\\*\\*(?:(?!\\*)<inner>|\\*(?:(?!\\*)<inner>)+\\*)+\\*\\*",
          ),
          lookbehind: !0,
          greedy: !0,
          inside: {
            content: {
              pattern: /(^..)[\S\s]+(?=..$)/,
              lookbehind: !0,
              inside: {},
            },
            punctuation: /\*\*|__/,
          },
        },
        italic: {
          pattern: n(
            "\\b_(?:(?!_)<inner>|__(?:(?!_)<inner>)+__)+_\\b|\\*(?:(?!\\*)<inner>|\\*\\*(?:(?!\\*)<inner>)+\\*\\*)+\\*",
          ),
          lookbehind: !0,
          greedy: !0,
          inside: {
            content: {
              pattern: /(^.)[\S\s]+(?=.$)/,
              lookbehind: !0,
              inside: {},
            },
            punctuation: /[*_]/,
          },
        },
        strike: {
          pattern: n("(~~?)(?:(?!~)<inner>)+?\\2"),
          lookbehind: !0,
          greedy: !0,
          inside: {
            content: {
              pattern: /(^~~?)[\S\s]+(?=\1$)/,
              lookbehind: !0,
              inside: {},
            },
            punctuation: /~~?/,
          },
        },
        url: {
          pattern: n(
            '!?\\[(?:(?!\\])<inner>)+\\](?:\\([^\\s)]+(?:[\t ]+"(?:\\\\.|[^"\\\\])*")?\\)| ?\\[(?:(?!\\])<inner>)+\\])',
          ),
          lookbehind: !0,
          greedy: !0,
          inside: {
            variable: { pattern: /(\[)[^\]]+(?=]$)/, lookbehind: !0 },
            content: {
              pattern: /(^!?\[)[^\]]+(?=])/,
              lookbehind: !0,
              inside: {},
            },
            string: { pattern: /"(?:\\.|[^"\\])*"(?=\)$)/ },
          },
        },
      }),
      ["url", "bold", "italic", "strike"].forEach(function (e) {
        ;["url", "bold", "italic", "strike"].forEach(function (n) {
          e !== n &&
            (d.languages.markdown[e].inside.content.inside[n] =
              d.languages.markdown[n])
        })
      }),
      d.hooks.add("after-tokenize", function (n) {
        ;("markdown" !== n.language && "md" !== n.language) ||
          !(function n(e) {
            if (e && "string" != typeof e)
              for (var t = 0, a = e.length; t < a; t++) {
                var i = e[t]
                if ("code" === i.type) {
                  var r = i.content[1],
                    o = i.content[3]
                  if (
                    r &&
                    o &&
                    "code-language" === r.type &&
                    "code-block" === o.type &&
                    "string" == typeof r.content
                  ) {
                    var l = r.content
                        .replace(/\b#/g, "sharp")
                        .replace(/\b\+\+/g, "pp"),
                      s =
                        "language-" +
                        (l = (/[a-z][\w-]*/i.exec(l) || [""])[0].toLowerCase())
                    o.alias
                      ? "string" == typeof o.alias
                        ? (o.alias = [o.alias, s])
                        : o.alias.push(s)
                      : (o.alias = [s])
                  }
                } else n(i.content)
              }
          })(n.tokens)
      }),
      d.hooks.add("wrap", function (n) {
        if ("code-block" === n.type) {
          for (var e = "", t = 0, a = n.classes.length; t < a; t++) {
            var i = n.classes[t],
              r = /language-(.+)/.exec(i)
            if (r) {
              e = r[1]
              break
            }
          }
          var o = d.languages[e]
          if (o) {
            var l = n.content.replace(/&lt;/g, "<").replace(/&amp;/g, "&")
            n.content = d.highlight(l, o, e)
          } else if (e && "none" !== e && d.plugins.autoloader) {
            var s =
              "md-" +
              new Date().valueOf() +
              "-" +
              Math.floor(1e16 * Math.random())
            ;(n.attributes.id = s),
              d.plugins.autoloader.loadLanguages(e, function () {
                var n = document.getElementById(s)
                n &&
                  (n.innerHTML = d.highlight(n.textContent, d.languages[e], e))
              })
          }
        }
      }),
      (d.languages.md = d.languages.markdown)
  })(Prism)
  Prism.languages.sql = {
    comment: {
      pattern: /(^|[^\\])(?:\/\*[\S\s]*?\*\/|(?:--|\/\/|#).*)/,
      lookbehind: !0,
    },
    variable: [
      { pattern: /@(["'`])(?:\\[\S\s]|(?!\1)[^\\])+\1/, greedy: !0 },
      /@[\w$.]+/,
    ],
    string: {
      pattern: /(^|[^@\\])("|')(?:\\[\S\s]|(?!\2)[^\\]|\2\2)*\2/,
      greedy: !0,
      lookbehind: !0,
    },
    function: /\b(?:avg|count|first|format|last|lcase|len|max|mid|min|mod|now|round|sum|ucase)(?=\s*\()/i,
    keyword: /\b(?:action|add|after|algorithm|all|alter|analyze|any|apply|as|asc|authorization|auto_increment|backup|bdb|begin|berkeleydb|bigint|binary|bit|blob|bool|boolean|break|browse|btree|bulk|by|call|cascaded?|case|chain|char(?:acter|set)?|check(?:point)?|close|clustered|coalesce|collate|columns?|comment|commit(?:ted)?|compute|connect|consistent|constraint|contains(?:table)?|continue|convert|create|cross|current(?:_date|_time|_timestamp|_user)?|cursor|cycle|data(?:bases?)?|date(?:time)?|day|dbcc|deallocate|dec|decimal|declare|default|definer|delayed|delete|delimiters?|deny|desc|describe|deterministic|disable|discard|disk|distinct|distinctrow|distributed|do|double|drop|dummy|dump(?:file)?|duplicate|else(?:if)?|enable|enclosed|end|engine|enum|errlvl|errors|escaped?|except|exec(?:ute)?|exists|exit|explain|extended|fetch|fields|file|fillfactor|first|fixed|float|following|for(?: each row)?|force|foreign|freetext(?:table)?|from|full|function|geometry(?:collection)?|global|goto|grant|group|handler|hash|having|holdlock|hour|identity(?:_insert|col)?|if|ignore|import|index|infile|inner|innodb|inout|insert|int|integer|intersect|interval|into|invoker|isolation|iterate|join|keys?|kill|language|last|leave|left|level|limit|lineno|lines|linestring|load|local|lock|long(?:blob|text)|loop|match(?:ed)?|medium(?:blob|int|text)|merge|middleint|minute|mode|modifies|modify|month|multi(?:linestring|point|polygon)|national|natural|nchar|next|no|nonclustered|nullif|numeric|off?|offsets?|on|open(?:datasource|query|rowset)?|optimize|option(?:ally)?|order|out(?:er|file)?|over|partial|partition|percent|pivot|plan|point|polygon|preceding|precision|prepare|prev|primary|print|privileges|proc(?:edure)?|public|purge|quick|raiserror|reads?|real|reconfigure|references|release|rename|repeat(?:able)?|replace|replication|require|resignal|restore|restrict|return(?:s|ing)?|revoke|right|rollback|routine|row(?:count|guidcol|s)?|rtree|rule|save(?:point)?|schema|second|select|serial(?:izable)?|session(?:_user)?|set(?:user)?|share|show|shutdown|simple|smallint|snapshot|some|soname|sql|start(?:ing)?|statistics|status|striped|system_user|tables?|tablespace|temp(?:orary|table)?|terminated|text(?:size)?|then|time(?:stamp)?|tiny(?:blob|int|text)|top?|tran(?:sactions?)?|trigger|truncate|tsequal|types?|unbounded|uncommitted|undefined|union|unique|unlock|unpivot|unsigned|update(?:text)?|usage|use|user|using|values?|var(?:binary|char|character|ying)|view|waitfor|warnings|when|where|while|with(?: rollup|in)?|work|write(?:text)?|year)\b/i,
    boolean: /\b(?:true|false|null)\b/i,
    number: /\b0x[\da-f]+\b|\b\d+\.?\d*|\B\.\d+\b/i,
    operator: /[%*+/=^~-]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[=>]?|\b(?:and|between|in|like|not|or|is|div|regexp|rlike|sounds like|xor)\b/i,
    punctuation: /[(),.;[\]`]/,
  }
  !(function (e) {
    ;(e.languages.typescript = e.languages.extend("javascript", {
      "class-name": {
        pattern: /(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)[$A-Z_a-z\u00A0-\uFFFF][\w$\u00A0-\uFFFF]*(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/,
        lookbehind: !0,
        greedy: !0,
        inside: null,
      },
      keyword: /\b(?:abstract|as|asserts|async|await|break|case|catch|class|const|constructor|continue|debugger|declare|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|is|keyof|let|module|namespace|new|null|of|package|private|protected|public|readonly|return|require|set|static|super|switch|this|throw|try|type|typeof|undefined|var|void|while|with|yield)\b/,
      builtin: /\b(?:string|Function|any|number|boolean|Array|symbol|console|Promise|unknown|never)\b/,
    })),
      delete e.languages.typescript.parameter
    var n = e.languages.extend("typescript", {})
    delete n["class-name"],
      (e.languages.typescript["class-name"].inside = n),
      e.languages.insertBefore("typescript", "function", {
        "generic-function": {
          pattern: /#?[$A-Z_a-z\u00A0-\uFFFF][\w$\u00A0-\uFFFF]*\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/,
          greedy: !0,
          inside: {
            function: /^#?[$A-Z_a-z\u00A0-\uFFFF][\w$\u00A0-\uFFFF]*/,
            generic: { pattern: /<[\S\s]+/, alias: "class-name", inside: n },
          },
        },
      }),
      (e.languages.ts = e.languages.typescript)
  })(Prism)
  !(function (E) {
    var n = /\b(?:ACT|ACTIFSUB|CARRAY|CASE|CLEARGIF|COA|COA_INT|CONSTANTS|CONTENT|CUR|EDITPANEL|EFFECT|EXT|FILE|FLUIDTEMPLATE|FORM|FRAME|FRAMESET|GIFBUILDER|GMENU|GMENU_FOLDOUT|GMENU_LAYERS|GP|HMENU|HRULER|HTML|IENV|IFSUB|IMAGE|IMGMENU|IMGMENUITEM|IMGTEXT|IMG_RESOURCE|INCLUDE_TYPOSCRIPT|JSMENU|JSMENUITEM|LLL|LOAD_REGISTER|NO|PAGE|RECORDS|RESTORE_REGISTER|TEMPLATE|TEXT|TMENU|TMENUITEM|TMENU_LAYERS|USER|USER_INT|_GIFBUILDER|global|globalString|globalVar)\b/
    ;(E.languages.typoscript = {
      comment: [
        { pattern: /(^|[^\\])\/\*[\S\s]*?(?:\*\/|$)/, lookbehind: !0 },
        {
          pattern: /(^|[^\t :=\\]|(?:^|[^\t =])[\t ]+)\/\/.*/,
          lookbehind: !0,
          greedy: !0,
        },
        { pattern: /(^|[^"'])#.*/, lookbehind: !0, greedy: !0 },
      ],
      function: [
        {
          pattern: /<INCLUDE_TYPOSCRIPT:\s*source\s*=\s*(?:"[^\n\r"]*"|'[^\n\r']*')\s*>/,
          inside: {
            string: {
              pattern: /"[^\n\r"]*"|'[^\n\r']*'/,
              inside: { keyword: n },
            },
            keyword: { pattern: /INCLUDE_TYPOSCRIPT/ },
          },
        },
        {
          pattern: /@import\s*(?:"[^\n\r"]*"|'[^\n\r']*')/,
          inside: { string: /"[^\n\r"]*"|'[^\n\r']*'/ },
        },
      ],
      string: {
        pattern: /^([^=]*=[ <]?)(?:(?!]\n).)*/,
        lookbehind: !0,
        inside: {
          function: /{\$.*}/,
          keyword: n,
          number: /^\d+$/,
          punctuation: /[,:|]/,
        },
      },
      keyword: n,
      number: { pattern: /\d+\s*[.={]/, inside: { operator: /[.={]/ } },
      tag: { pattern: /\.?[\w-\\]+\.?/, inside: { punctuation: /\./ } },
      punctuation: /[(),.:;[\]{|}]/,
      operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[%*/?^~]/,
    }),
      (E.languages.tsconfig = E.languages.typoscript)
  })(Prism)
  !(function (e) {
    var n = /[&*][^\s,[\]{}]+/,
      t = /!(?:<[\w!#$%&'()*+,./:;=?@[\]~\-]+>|(?:[\dA-Za-z-]*!)?[\w#$%&'()*+./:;=?@~\-]+)?/,
      r =
        "(?:" +
        t.source +
        "(?:[ \t]+" +
        n.source +
        ")?|" +
        n.source +
        "(?:[ \t]+" +
        t.source +
        ")?)",
      a = "(?:[^\\s\\x00-\\x08\\x0e-\\x1f!\"#%&'*,\\-:>?@[\\]`{|}\\x7f-\\x84\\x86-\\x9f\\ud800-\\udfff\\ufffe\\uffff]|[?:-]<PLAIN>)(?:[ \t]*(?:(?![#:])<PLAIN>|:<PLAIN>))*".replace(
        /<PLAIN>/g,
        function () {
          return "[^\\s\\x00-\\x08\\x0e-\\x1f,[\\]{}\\x7f-\\x84\\x86-\\x9f\\ud800-\\udfff\\ufffe\\uffff]"
        },
      ),
      d = "\"(?:[^\"\\\\\r\n]|\\\\.)*\"|'(?:[^'\\\\\r\n]|\\\\.)*'"
    function o(e, n) {
      n = (n || "").replace(/m/g, "") + "m"
      var t = "([:\\-,[{]\\s*(?:\\s<<prop>>[ \t]+)?)(?:<<value>>)(?=[ \t]*(?:$|,|]|}|\\s*#))"
        .replace(/<<prop>>/g, function () {
          return r
        })
        .replace(/<<value>>/g, function () {
          return e
        })
      return new RegExp(t, n)
    }
    ;(e.languages.yaml = {
      scalar: {
        pattern: new RegExp(
          "([\\-:]\\s*(?:\\s<<prop>>[ \t]+)?[|>])[ \t]*(?:((?:\r?\n|\r)[ \t]+)[^\r\n]+(?:\\2[^\r\n]+)*)".replace(
            /<<prop>>/g,
            function () {
              return r
            },
          ),
        ),
        lookbehind: !0,
        alias: "string",
      },
      comment: /#.*/,
      key: {
        pattern: new RegExp(
          "((?:^|[:\\-,[{\r\n?])[ \t]*(?:<<prop>>[ \t]+)?)<<key>>(?=\\s*:\\s)"
            .replace(/<<prop>>/g, function () {
              return r
            })
            .replace(/<<key>>/g, function () {
              return "(?:" + a + "|" + d + ")"
            }),
        ),
        lookbehind: !0,
        greedy: !0,
        alias: "atrule",
      },
      directive: {
        pattern: /(^[\t ]*)%.+/m,
        lookbehind: !0,
        alias: "important",
      },
      datetime: {
        pattern: o(
          "\\d{4}-\\d\\d?-\\d\\d?(?:[tT]|[ \t]+)\\d\\d?:\\d{2}:\\d{2}(?:\\.\\d*)?[ \t]*(?:Z|[-+]\\d\\d?(?::\\d{2})?)?|\\d{4}-\\d{2}-\\d{2}|\\d\\d?:\\d{2}(?::\\d{2}(?:\\.\\d*)?)?",
        ),
        lookbehind: !0,
        alias: "number",
      },
      boolean: {
        pattern: o("true|false", "i"),
        lookbehind: !0,
        alias: "important",
      },
      null: { pattern: o("null|~", "i"), lookbehind: !0, alias: "important" },
      string: { pattern: o(d), lookbehind: !0, greedy: !0 },
      number: {
        pattern: o(
          "[+-]?(?:0x[\\da-f]+|0o[0-7]+|(?:\\d+\\.?\\d*|\\.?\\d+)(?:e[+-]?\\d+)?|\\.inf|\\.nan)",
          "i",
        ),
        lookbehind: !0,
      },
      tag: t,
      important: n,
      punctuation: /-{3}|[,:>?[\]{|}\-]|\.{3}/,
    }),
      (e.languages.yml = e.languages.yaml)
  })(Prism)
}
