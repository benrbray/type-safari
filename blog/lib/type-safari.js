var Qf = Object.defineProperty;
var Uf = (n, e, t) => e in n ? Qf(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var nn = (n, e, t) => (Uf(n, typeof e != "symbol" ? e + "" : e, t), t);
const $f = (n, e) => n === e, Eo = {
  equals: $f
};
let Va = Ia;
const At = 1, In = 2, Ba = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var ge = null;
let Ps = null, $ = null, de = null, st = null, ms = 0;
function jf(n, e) {
  const t = $, i = ge, s = n.length === 0, r = e === void 0 ? i : e, o = s ? Ba : {
    owned: null,
    cleanups: null,
    context: r ? r.context : null,
    owner: r
  }, l = s ? n : () => n(() => hi(() => bs(o)));
  ge = o, $ = null;
  try {
    return Yi(l, !0);
  } finally {
    $ = t, ge = i;
  }
}
function sn(n, e) {
  e = e ? Object.assign({}, Eo, e) : Eo;
  const t = {
    value: n,
    observers: null,
    observerSlots: null,
    comparator: e.equals || void 0
  }, i = (s) => (typeof s == "function" && (s = s(t.value)), Wa(t, s));
  return [eu.bind(t), i];
}
function ar(n, e, t) {
  const i = Xa(n, e, !1, At);
  gs(i);
}
function qf(n, e, t) {
  Va = nu;
  const i = Xa(n, e, !1, At);
  (!t || !t.render) && (i.user = !0), st ? st.push(i) : gs(i);
}
function hi(n) {
  if ($ === null)
    return n();
  const e = $;
  $ = null;
  try {
    return n();
  } finally {
    $ = e;
  }
}
function _f(n) {
  qf(() => hi(n));
}
function eu() {
  if (this.sources && this.state)
    if (this.state === At)
      gs(this);
    else {
      const n = de;
      de = null, Yi(() => Nn(this), !1), de = n;
    }
  if ($) {
    const n = this.observers ? this.observers.length : 0;
    $.sources ? ($.sources.push(this), $.sourceSlots.push(n)) : ($.sources = [this], $.sourceSlots = [n]), this.observers ? (this.observers.push($), this.observerSlots.push($.sources.length - 1)) : (this.observers = [$], this.observerSlots = [$.sources.length - 1]);
  }
  return this.value;
}
function Wa(n, e, t) {
  let i = n.value;
  return (!n.comparator || !n.comparator(i, e)) && (n.value = e, n.observers && n.observers.length && Yi(() => {
    for (let s = 0; s < n.observers.length; s += 1) {
      const r = n.observers[s], o = Ps && Ps.running;
      o && Ps.disposed.has(r), (o ? !r.tState : !r.state) && (r.pure ? de.push(r) : st.push(r), r.observers && Ea(r)), o || (r.state = At);
    }
    if (de.length > 1e6)
      throw de = [], new Error();
  }, !1)), e;
}
function gs(n) {
  if (!n.fn)
    return;
  bs(n);
  const e = ge, t = $, i = ms;
  $ = ge = n, tu(n, n.value, i), $ = t, ge = e;
}
function tu(n, e, t) {
  let i;
  try {
    i = n.fn(e);
  } catch (s) {
    return n.pure && (n.state = At, n.owned && n.owned.forEach(bs), n.owned = null), n.updatedAt = t + 1, Na(s);
  }
  (!n.updatedAt || n.updatedAt <= t) && (n.updatedAt != null && "observers" in n ? Wa(n, i) : n.value = i, n.updatedAt = t);
}
function Xa(n, e, t, i = At, s) {
  const r = {
    fn: n,
    state: i,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: e,
    owner: ge,
    context: ge ? ge.context : null,
    pure: t
  };
  return ge === null || ge !== Ba && (ge.owned ? ge.owned.push(r) : ge.owned = [r]), r;
}
function En(n) {
  if (n.state === 0)
    return;
  if (n.state === In)
    return Nn(n);
  if (n.suspense && hi(n.suspense.inFallback))
    return n.suspense.effects.push(n);
  const e = [n];
  for (; (n = n.owner) && (!n.updatedAt || n.updatedAt < ms); )
    n.state && e.push(n);
  for (let t = e.length - 1; t >= 0; t--)
    if (n = e[t], n.state === At)
      gs(n);
    else if (n.state === In) {
      const i = de;
      de = null, Yi(() => Nn(n, e[0]), !1), de = i;
    }
}
function Yi(n, e) {
  if (de)
    return n();
  let t = !1;
  e || (de = []), st ? t = !0 : st = [], ms++;
  try {
    const i = n();
    return iu(t), i;
  } catch (i) {
    t || (st = null), de = null, Na(i);
  }
}
function iu(n) {
  if (de && (Ia(de), de = null), n)
    return;
  const e = st;
  st = null, e.length && Yi(() => Va(e), !1);
}
function Ia(n) {
  for (let e = 0; e < n.length; e++)
    En(n[e]);
}
function nu(n) {
  let e, t = 0;
  for (e = 0; e < n.length; e++) {
    const i = n[e];
    i.user ? n[t++] = i : En(i);
  }
  for (e = 0; e < t; e++)
    En(n[e]);
}
function Nn(n, e) {
  n.state = 0;
  for (let t = 0; t < n.sources.length; t += 1) {
    const i = n.sources[t];
    if (i.sources) {
      const s = i.state;
      s === At ? i !== e && (!i.updatedAt || i.updatedAt < ms) && En(i) : s === In && Nn(i, e);
    }
  }
}
function Ea(n) {
  for (let e = 0; e < n.observers.length; e += 1) {
    const t = n.observers[e];
    t.state || (t.state = In, t.pure ? de.push(t) : st.push(t), t.observers && Ea(t));
  }
}
function bs(n) {
  let e;
  if (n.sources)
    for (; n.sources.length; ) {
      const t = n.sources.pop(), i = n.sourceSlots.pop(), s = t.observers;
      if (s && s.length) {
        const r = s.pop(), o = t.observerSlots.pop();
        i < s.length && (r.sourceSlots[o] = i, s[i] = r, t.observerSlots[i] = o);
      }
    }
  if (n.owned) {
    for (e = n.owned.length - 1; e >= 0; e--)
      bs(n.owned[e]);
    n.owned = null;
  }
  if (n.cleanups) {
    for (e = n.cleanups.length - 1; e >= 0; e--)
      n.cleanups[e]();
    n.cleanups = null;
  }
  n.state = 0;
}
function su(n) {
  return n instanceof Error ? n : new Error(typeof n == "string" ? n : "Unknown error", {
    cause: n
  });
}
function Na(n, e = ge) {
  throw su(n);
}
function Ga(n, e) {
  return hi(() => n(e || {}));
}
function ru(n, e, t) {
  let i = t.length, s = e.length, r = i, o = 0, l = 0, a = e[s - 1].nextSibling, h = null;
  for (; o < s || l < r; ) {
    if (e[o] === t[l]) {
      o++, l++;
      continue;
    }
    for (; e[s - 1] === t[r - 1]; )
      s--, r--;
    if (s === o) {
      const c = r < i ? l ? t[l - 1].nextSibling : t[r - l] : a;
      for (; l < r; )
        n.insertBefore(t[l++], c);
    } else if (r === l)
      for (; o < s; )
        (!h || !h.has(e[o])) && e[o].remove(), o++;
    else if (e[o] === t[r - 1] && t[l] === e[s - 1]) {
      const c = e[--s].nextSibling;
      n.insertBefore(t[l++], e[o++].nextSibling), n.insertBefore(t[--r], c), e[s] = t[r];
    } else {
      if (!h) {
        h = /* @__PURE__ */ new Map();
        let f = l;
        for (; f < r; )
          h.set(t[f], f++);
      }
      const c = h.get(e[o]);
      if (c != null)
        if (l < c && c < r) {
          let f = o, u = 1, d;
          for (; ++f < s && f < r && !((d = h.get(e[f])) == null || d !== c + u); )
            u++;
          if (u > c - l) {
            const p = e[o];
            for (; l < c; )
              n.insertBefore(t[l++], p);
          } else
            n.replaceChild(t[l++], e[o++]);
        } else
          o++;
      else
        e[o++].remove();
    }
  }
}
const No = "_$DX_DELEGATE";
function ou(n, e, t, i = {}) {
  let s;
  return jf((r) => {
    s = r, e === document ? n() : Kt(e, n(), e.firstChild ? null : void 0, t);
  }, i.owner), () => {
    s(), e.textContent = "";
  };
}
function io(n, e, t) {
  let i;
  const s = () => {
    const o = document.createElement("template");
    return o.innerHTML = n, t ? o.content.firstChild.firstChild : o.content.firstChild;
  }, r = e ? () => hi(() => document.importNode(i || (i = s()), !0)) : () => (i || (i = s())).cloneNode(!0);
  return r.cloneNode = r, r;
}
function lu(n, e = window.document) {
  const t = e[No] || (e[No] = /* @__PURE__ */ new Set());
  for (let i = 0, s = n.length; i < s; i++) {
    const r = n[i];
    t.has(r) || (t.add(r), e.addEventListener(r, hu));
  }
}
function au(n, e, t) {
  return hi(() => n(e, t));
}
function Kt(n, e, t, i) {
  if (t !== void 0 && !i && (i = []), typeof e != "function")
    return Gn(n, e, i, t);
  ar((s) => Gn(n, e(), s, t), i);
}
function hu(n) {
  const e = `$$${n.type}`;
  let t = n.composedPath && n.composedPath()[0] || n.target;
  for (n.target !== t && Object.defineProperty(n, "target", {
    configurable: !0,
    value: t
  }), Object.defineProperty(n, "currentTarget", {
    configurable: !0,
    get() {
      return t || document;
    }
  }); t; ) {
    const i = t[e];
    if (i && !t.disabled) {
      const s = t[`${e}Data`];
      if (s !== void 0 ? i.call(t, s, n) : i.call(t, n), n.cancelBubble)
        return;
    }
    t = t._$host || t.parentNode || t.host;
  }
}
function Gn(n, e, t, i, s) {
  for (; typeof t == "function"; )
    t = t();
  if (e === t)
    return t;
  const r = typeof e, o = i !== void 0;
  if (n = o && t[0] && t[0].parentNode || n, r === "string" || r === "number")
    if (r === "number" && (e = e.toString()), o) {
      let l = t[0];
      l && l.nodeType === 3 ? l.data = e : l = document.createTextNode(e), t = Ft(n, t, i, l);
    } else
      t !== "" && typeof t == "string" ? t = n.firstChild.data = e : t = n.textContent = e;
  else if (e == null || r === "boolean")
    t = Ft(n, t, i);
  else {
    if (r === "function")
      return ar(() => {
        let l = e();
        for (; typeof l == "function"; )
          l = l();
        t = Gn(n, l, t, i);
      }), () => t;
    if (Array.isArray(e)) {
      const l = [], a = t && Array.isArray(t);
      if (hr(l, e, t, s))
        return ar(() => t = Gn(n, l, t, i, !0)), () => t;
      if (l.length === 0) {
        if (t = Ft(n, t, i), o)
          return t;
      } else
        a ? t.length === 0 ? Go(n, l, i) : ru(n, t, l) : (t && Ft(n), Go(n, l));
      t = l;
    } else if (e.nodeType) {
      if (Array.isArray(t)) {
        if (o)
          return t = Ft(n, t, i, e);
        Ft(n, t, null, e);
      } else
        t == null || t === "" || !n.firstChild ? n.appendChild(e) : n.replaceChild(e, n.firstChild);
      t = e;
    } else
      console.warn("Unrecognized value. Skipped inserting", e);
  }
  return t;
}
function hr(n, e, t, i) {
  let s = !1;
  for (let r = 0, o = e.length; r < o; r++) {
    let l = e[r], a = t && t[r], h;
    if (!(l == null || l === !0 || l === !1))
      if ((h = typeof l) == "object" && l.nodeType)
        n.push(l);
      else if (Array.isArray(l))
        s = hr(n, l, a) || s;
      else if (h === "function")
        if (i) {
          for (; typeof l == "function"; )
            l = l();
          s = hr(n, Array.isArray(l) ? l : [l], Array.isArray(a) ? a : [a]) || s;
        } else
          n.push(l), s = !0;
      else {
        const c = String(l);
        a && a.nodeType === 3 && a.data === c ? n.push(a) : n.push(document.createTextNode(c));
      }
  }
  return s;
}
function Go(n, e, t = null) {
  for (let i = 0, s = e.length; i < s; i++)
    n.insertBefore(e[i], t);
}
function Ft(n, e, t, i) {
  if (t === void 0)
    return n.textContent = "";
  const s = i || document.createTextNode("");
  if (e.length) {
    let r = !1;
    for (let o = e.length - 1; o >= 0; o--) {
      const l = e[o];
      if (s !== l) {
        const a = l.parentNode === n;
        !r && !o ? a ? n.replaceChild(s, l) : n.insertBefore(s, t) : a && l.remove();
      } else
        r = !0;
    }
  } else
    n.insertBefore(s, t);
  return [s];
}
const Ha = "KGZ1bmN0aW9uKCl7InVzZSBzdHJpY3QiO2NsYXNzIGd7c3RhdGljIHJlYWRfYnl0ZXMobixpKXtsZXQgbD1uZXcgZztyZXR1cm4gbC5idWY9bi5nZXRVaW50MzIoaSwhMCksbC5idWZfbGVuPW4uZ2V0VWludDMyKGkrNCwhMCksbH1zdGF0aWMgcmVhZF9ieXRlc19hcnJheShuLGksbCl7bGV0IGU9W107Zm9yKGxldCB0PTA7dDxsO3QrKyllLnB1c2goZy5yZWFkX2J5dGVzKG4saSs4KnQpKTtyZXR1cm4gZX19Y2xhc3MgbXtzdGF0aWMgcmVhZF9ieXRlcyhuLGkpe2xldCBsPW5ldyBtO3JldHVybiBsLmJ1Zj1uLmdldFVpbnQzMihpLCEwKSxsLmJ1Zl9sZW49bi5nZXRVaW50MzIoaSs0LCEwKSxsfXN0YXRpYyByZWFkX2J5dGVzX2FycmF5KG4saSxsKXtsZXQgZT1bXTtmb3IobGV0IHQ9MDt0PGw7dCsrKWUucHVzaChtLnJlYWRfYnl0ZXMobixpKzgqdCkpO3JldHVybiBlfX1jb25zdCBOPTAsTz0xLEY9MixVPTQ7Y2xhc3Mga3t3cml0ZV9ieXRlcyhuLGkpe24uc2V0VWludDgoaSx0aGlzLmZzX2ZpbGV0eXBlKSxuLnNldFVpbnQxNihpKzIsdGhpcy5mc19mbGFncywhMCksbi5zZXRCaWdVaW50NjQoaSs4LHRoaXMuZnNfcmlnaHRzX2Jhc2UsITApLG4uc2V0QmlnVWludDY0KGkrMTYsdGhpcy5mc19yaWdodHNfaW5oZXJpdGVkLCEwKX1jb25zdHJ1Y3RvcihuLGkpe3RoaXMuZnNfcmlnaHRzX2Jhc2U9MG4sdGhpcy5mc19yaWdodHNfaW5oZXJpdGVkPTBuLHRoaXMuZnNfZmlsZXR5cGU9bix0aGlzLmZzX2ZsYWdzPWl9fWNsYXNzIEl7d3JpdGVfYnl0ZXMobixpKXtuLnNldEJpZ1VpbnQ2NChpLHRoaXMuZGV2LCEwKSxuLnNldEJpZ1VpbnQ2NChpKzgsdGhpcy5pbm8sITApLG4uc2V0VWludDgoaSsxNix0aGlzLmZpbGV0eXBlKSxuLnNldEJpZ1VpbnQ2NChpKzI0LHRoaXMubmxpbmssITApLG4uc2V0QmlnVWludDY0KGkrMzIsdGhpcy5zaXplLCEwKSxuLnNldEJpZ1VpbnQ2NChpKzM4LHRoaXMuYXRpbSwhMCksbi5zZXRCaWdVaW50NjQoaSs0Nix0aGlzLm10aW0sITApLG4uc2V0QmlnVWludDY0KGkrNTIsdGhpcy5jdGltLCEwKX1jb25zdHJ1Y3RvcihuLGkpe3RoaXMuZGV2PTBuLHRoaXMuaW5vPTBuLHRoaXMubmxpbms9MG4sdGhpcy5hdGltPTBuLHRoaXMubXRpbT0wbix0aGlzLmN0aW09MG4sdGhpcy5maWxldHlwZT1uLHRoaXMuc2l6ZT1pfX1sZXQgVD1jbGFzc3tzdGFydChuKXt0aGlzLmluc3Q9bixuLmV4cG9ydHMuX3N0YXJ0KCl9aW5pdGlhbGl6ZShuKXt0aGlzLmluc3Q9bixuLmV4cG9ydHMuX2luaXRpYWxpemUoKX1jb25zdHJ1Y3RvcihuLGksbCl7dGhpcy5hcmdzPVtdLHRoaXMuZW52PVtdLHRoaXMuZmRzPVtdLHRoaXMuYXJncz1uLHRoaXMuZW52PWksdGhpcy5mZHM9bDtsZXQgZT10aGlzO3RoaXMud2FzaUltcG9ydD17YXJnc19zaXplc19nZXQodCxyKXtsZXQgcz1uZXcgRGF0YVZpZXcoZS5pbnN0LmV4cG9ydHMubWVtb3J5LmJ1ZmZlcik7cy5zZXRVaW50MzIodCxlLmFyZ3MubGVuZ3RoLCEwKTtsZXQgZj0wO2ZvcihsZXQgYSBvZiBlLmFyZ3MpZis9YS5sZW5ndGgrMTtyZXR1cm4gcy5zZXRVaW50MzIocixmLCEwKSwwfSxhcmdzX2dldCh0LHIpe2xldCBzPW5ldyBEYXRhVmlldyhlLmluc3QuZXhwb3J0cy5tZW1vcnkuYnVmZmVyKSxmPW5ldyBVaW50OEFycmF5KGUuaW5zdC5leHBvcnRzLm1lbW9yeS5idWZmZXIpO2ZvcihsZXQgYT0wO2E8ZS5hcmdzLmxlbmd0aDthKyspe3Muc2V0VWludDMyKHQsciwhMCksdCs9NDtsZXQgdT1uZXcgVGV4dEVuY29kZXIoInV0Zi04IikuZW5jb2RlKGUuYXJnc1thXSk7Zi5zZXQodSxyKSxzLnNldFVpbnQ4KHIrdS5sZW5ndGgsMCkscis9dS5sZW5ndGgrMX1yZXR1cm4gMH0sZW52aXJvbl9zaXplc19nZXQodCxyKXtsZXQgcz1uZXcgRGF0YVZpZXcoZS5pbnN0LmV4cG9ydHMubWVtb3J5LmJ1ZmZlcik7cy5zZXRVaW50MzIodCxlLmVudi5sZW5ndGgsITApO2xldCBmPTA7Zm9yKGxldCBhIG9mIGUuZW52KWYrPWEubGVuZ3RoKzE7cmV0dXJuIHMuc2V0VWludDMyKHIsZiwhMCksMH0sZW52aXJvbl9nZXQodCxyKXtsZXQgcz1uZXcgRGF0YVZpZXcoZS5pbnN0LmV4cG9ydHMubWVtb3J5LmJ1ZmZlciksZj1uZXcgVWludDhBcnJheShlLmluc3QuZXhwb3J0cy5tZW1vcnkuYnVmZmVyKTtmb3IobGV0IGE9MDthPGkubGVuZ3RoO2ErKyl7cy5zZXRVaW50MzIodCxyLCEwKSx0Kz00O2xldCB1PW5ldyBUZXh0RW5jb2RlcigidXRmLTgiKS5lbmNvZGUoaVthXSk7Zi5zZXQodSxyKSxzLnNldFVpbnQ4KHIrdS5sZW5ndGgsMCkscis9dS5sZW5ndGgrMX1yZXR1cm4gMH0sY2xvY2tfcmVzX2dldCh0LHIpe3Rocm93InVuaW1wbGVtZW50ZWQifSxjbG9ja190aW1lX2dldCh0LHIscyl7bGV0IGY9bmV3IERhdGFWaWV3KGUuaW5zdC5leHBvcnRzLm1lbW9yeS5idWZmZXIpO2lmKHQ9PT0wKWYuc2V0QmlnVWludDY0KHMsQmlnSW50KG5ldyBEYXRlKCkuZ2V0VGltZSgpKSoxMDAwMDAwbiwhMCk7ZWxzZSBpZih0PT0xKXtsZXQgYTt0cnl7YT1CaWdJbnQoTWF0aC5yb3VuZChwZXJmb3JtYW5jZS5ub3coKSoxZTYpKX1jYXRjaHthPTBufWYuc2V0QmlnVWludDY0KHMsYSwhMCl9ZWxzZSBmLnNldEJpZ1VpbnQ2NChzLDBuLCEwKTtyZXR1cm4gMH0sZmRfYWR2aXNlKHQscixzLGYpe3JldHVybiBlLmZkc1t0XSE9bnVsbD9lLmZkc1t0XS5mZF9hZHZpc2UocixzLGYpOjh9LGZkX2FsbG9jYXRlKHQscixzKXtyZXR1cm4gZS5mZHNbdF0hPW51bGw/ZS5mZHNbdF0uZmRfYWxsb2NhdGUocixzKTo4fSxmZF9jbG9zZSh0KXtpZihlLmZkc1t0XSE9bnVsbCl7bGV0IHI9ZS5mZHNbdF0uZmRfY2xvc2UoKTtyZXR1cm4gZS5mZHNbdF09dm9pZCAwLHJ9ZWxzZSByZXR1cm4gOH0sZmRfZGF0YXN5bmModCl7cmV0dXJuIGUuZmRzW3RdIT1udWxsP2UuZmRzW3RdLmZkX2RhdGFzeW5jKCk6OH0sZmRfZmRzdGF0X2dldCh0LHIpe2lmKGUuZmRzW3RdIT1udWxsKXtsZXR7cmV0OnMsZmRzdGF0OmZ9PWUuZmRzW3RdLmZkX2Zkc3RhdF9nZXQoKTtyZXR1cm4gZiE9bnVsbCYmZi53cml0ZV9ieXRlcyhuZXcgRGF0YVZpZXcoZS5pbnN0LmV4cG9ydHMubWVtb3J5LmJ1ZmZlciksciksc31lbHNlIHJldHVybiA4fSxmZF9mZHN0YXRfc2V0X2ZsYWdzKHQscil7cmV0dXJuIGUuZmRzW3RdIT1udWxsP2UuZmRzW3RdLmZkX2Zkc3RhdF9zZXRfZmxhZ3Mocik6OH0sZmRfZmRzdGF0X3NldF9yaWdodHModCxyLHMpe3JldHVybiBlLmZkc1t0XSE9bnVsbD9lLmZkc1t0XS5mZF9mZHN0YXRfc2V0X3JpZ2h0cyhyLHMpOjh9LGZkX2ZpbGVzdGF0X2dldCh0LHIpe2lmKGUuZmRzW3RdIT1udWxsKXtsZXR7cmV0OnMsZmlsZXN0YXQ6Zn09ZS5mZHNbdF0uZmRfZmlsZXN0YXRfZ2V0KCk7cmV0dXJuIGYhPW51bGwmJmYud3JpdGVfYnl0ZXMobmV3IERhdGFWaWV3KGUuaW5zdC5leHBvcnRzLm1lbW9yeS5idWZmZXIpLHIpLHN9ZWxzZSByZXR1cm4gOH0sZmRfZmlsZXN0YXRfc2V0X3NpemUodCxyKXtyZXR1cm4gZS5mZHNbdF0hPW51bGw/ZS5mZHNbdF0uZmRfZmlsZXN0YXRfc2V0X3NpemUocik6OH0sZmRfZmlsZXN0YXRfc2V0X3RpbWVzKHQscixzLGYpe3JldHVybiBlLmZkc1t0XSE9bnVsbD9lLmZkc1t0XS5mZF9maWxlc3RhdF9zZXRfdGltZXMocixzLGYpOjh9LGZkX3ByZWFkKHQscixzLGYsYSl7bGV0IHU9bmV3IERhdGFWaWV3KGUuaW5zdC5leHBvcnRzLm1lbW9yeS5idWZmZXIpLF89bmV3IFVpbnQ4QXJyYXkoZS5pbnN0LmV4cG9ydHMubWVtb3J5LmJ1ZmZlcik7aWYoZS5mZHNbdF0hPW51bGwpe2xldCBkPWcucmVhZF9ieXRlc19hcnJheSh1LHIscykse3JldDpoLG5yZWFkOmN9PWUuZmRzW3RdLmZkX3ByZWFkKF8sZCxmKTtyZXR1cm4gdS5zZXRVaW50MzIoYSxjLCEwKSxofWVsc2UgcmV0dXJuIDh9LGZkX3ByZXN0YXRfZ2V0KHQscil7bGV0IHM9bmV3IERhdGFWaWV3KGUuaW5zdC5leHBvcnRzLm1lbW9yeS5idWZmZXIpO2lmKGUuZmRzW3RdIT1udWxsKXtsZXR7cmV0OmYscHJlc3RhdDphfT1lLmZkc1t0XS5mZF9wcmVzdGF0X2dldCgpO3JldHVybiBhIT1udWxsJiZhLndyaXRlX2J5dGVzKHMsciksZn1lbHNlIHJldHVybiA4fSxmZF9wcmVzdGF0X2Rpcl9uYW1lKHQscixzKXtpZihlLmZkc1t0XSE9bnVsbCl7bGV0e3JldDpmLHByZXN0YXRfZGlyX25hbWU6YX09ZS5mZHNbdF0uZmRfcHJlc3RhdF9kaXJfbmFtZSgpO3JldHVybiBhIT1udWxsJiZuZXcgVWludDhBcnJheShlLmluc3QuZXhwb3J0cy5tZW1vcnkuYnVmZmVyKS5zZXQoYSxyKSxmfWVsc2UgcmV0dXJuIDh9LGZkX3B3cml0ZSh0LHIscyxmLGEpe2xldCB1PW5ldyBEYXRhVmlldyhlLmluc3QuZXhwb3J0cy5tZW1vcnkuYnVmZmVyKSxfPW5ldyBVaW50OEFycmF5KGUuaW5zdC5leHBvcnRzLm1lbW9yeS5idWZmZXIpO2lmKGUuZmRzW3RdIT1udWxsKXtsZXQgZD1tLnJlYWRfYnl0ZXNfYXJyYXkodSxyLHMpLHtyZXQ6aCxud3JpdHRlbjpjfT1lLmZkc1t0XS5mZF9wd3JpdGUoXyxkLGYpO3JldHVybiB1LnNldFVpbnQzMihhLGMsITApLGh9ZWxzZSByZXR1cm4gOH0sZmRfcmVhZCh0LHIscyxmKXtsZXQgYT1uZXcgRGF0YVZpZXcoZS5pbnN0LmV4cG9ydHMubWVtb3J5LmJ1ZmZlciksdT1uZXcgVWludDhBcnJheShlLmluc3QuZXhwb3J0cy5tZW1vcnkuYnVmZmVyKTtpZihlLmZkc1t0XSE9bnVsbCl7bGV0IF89Zy5yZWFkX2J5dGVzX2FycmF5KGEscixzKSx7cmV0OmQsbnJlYWQ6aH09ZS5mZHNbdF0uZmRfcmVhZCh1LF8pO3JldHVybiBhLnNldFVpbnQzMihmLGgsITApLGR9ZWxzZSByZXR1cm4gOH0sZmRfcmVhZGRpcih0LHIscyxmLGEpe2xldCB1PW5ldyBEYXRhVmlldyhlLmluc3QuZXhwb3J0cy5tZW1vcnkuYnVmZmVyKSxfPW5ldyBVaW50OEFycmF5KGUuaW5zdC5leHBvcnRzLm1lbW9yeS5idWZmZXIpO2lmKGUuZmRzW3RdIT1udWxsKXtsZXQgZD0wO2Zvcig7Oyl7bGV0e3JldDpoLGRpcmVudDpjfT1lLmZkc1t0XS5mZF9yZWFkZGlyX3NpbmdsZShmKTtpZihoIT0wKXJldHVybiB1LnNldFVpbnQzMihhLGQsITApLGg7aWYoYz09bnVsbClicmVhaztpZihzLWQ8Yy5oZWFkX2xlbmd0aCgpKXtkPXM7YnJlYWt9bGV0IHA9bmV3IEFycmF5QnVmZmVyKGMuaGVhZF9sZW5ndGgoKSk7aWYoYy53cml0ZV9oZWFkX2J5dGVzKG5ldyBEYXRhVmlldyhwKSwwKSxfLnNldChuZXcgVWludDhBcnJheShwKS5zbGljZSgwLE1hdGgubWluKHAuYnl0ZUxlbmd0aCxzLWQpKSxyKSxyKz1jLmhlYWRfbGVuZ3RoKCksZCs9Yy5oZWFkX2xlbmd0aCgpLHMtZDxjLm5hbWVfbGVuZ3RoKCkpe2Q9czticmVha31jLndyaXRlX25hbWVfYnl0ZXMoXyxyLHMtZCkscis9Yy5uYW1lX2xlbmd0aCgpLGQrPWMubmFtZV9sZW5ndGgoKSxmPWMuZF9uZXh0fXJldHVybiB1LnNldFVpbnQzMihhLGQsITApLDB9ZWxzZSByZXR1cm4gOH0sZmRfcmVudW1iZXIodCxyKXtpZihlLmZkc1t0XSE9bnVsbCYmZS5mZHNbcl0hPW51bGwpe2xldCBzPWUuZmRzW3JdLmZkX2Nsb3NlKCk7cmV0dXJuIHMhPTA/czooZS5mZHNbcl09ZS5mZHNbdF0sZS5mZHNbdF09dm9pZCAwLDApfWVsc2UgcmV0dXJuIDh9LGZkX3NlZWsodCxyLHMsZil7bGV0IGE9bmV3IERhdGFWaWV3KGUuaW5zdC5leHBvcnRzLm1lbW9yeS5idWZmZXIpO2lmKGUuZmRzW3RdIT1udWxsKXtsZXR7cmV0OnUsb2Zmc2V0Ol99PWUuZmRzW3RdLmZkX3NlZWsocixzKTtyZXR1cm4gYS5zZXRCaWdJbnQ2NChmLF8sITApLHV9ZWxzZSByZXR1cm4gOH0sZmRfc3luYyh0KXtyZXR1cm4gZS5mZHNbdF0hPW51bGw/ZS5mZHNbdF0uZmRfc3luYygpOjh9LGZkX3RlbGwodCxyKXtsZXQgcz1uZXcgRGF0YVZpZXcoZS5pbnN0LmV4cG9ydHMubWVtb3J5LmJ1ZmZlcik7aWYoZS5mZHNbdF0hPW51bGwpe2xldHtyZXQ6ZixvZmZzZXQ6YX09ZS5mZHNbdF0uZmRfdGVsbCgpO3JldHVybiBzLnNldEJpZ1VpbnQ2NChyLGEsITApLGZ9ZWxzZSByZXR1cm4gOH0sZmRfd3JpdGUodCxyLHMsZil7bGV0IGE9bmV3IERhdGFWaWV3KGUuaW5zdC5leHBvcnRzLm1lbW9yeS5idWZmZXIpLHU9bmV3IFVpbnQ4QXJyYXkoZS5pbnN0LmV4cG9ydHMubWVtb3J5LmJ1ZmZlcik7aWYoZS5mZHNbdF0hPW51bGwpe2xldCBfPW0ucmVhZF9ieXRlc19hcnJheShhLHIscykse3JldDpkLG53cml0dGVuOmh9PWUuZmRzW3RdLmZkX3dyaXRlKHUsXyk7cmV0dXJuIGEuc2V0VWludDMyKGYsaCwhMCksZH1lbHNlIHJldHVybiA4fSxwYXRoX2NyZWF0ZV9kaXJlY3RvcnkodCxyLHMpe2xldCBmPW5ldyBVaW50OEFycmF5KGUuaW5zdC5leHBvcnRzLm1lbW9yeS5idWZmZXIpO2lmKGUuZmRzW3RdIT1udWxsKXtsZXQgYT1uZXcgVGV4dERlY29kZXIoInV0Zi04IikuZGVjb2RlKGYuc2xpY2UocixyK3MpKTtyZXR1cm4gZS5mZHNbdF0ucGF0aF9jcmVhdGVfZGlyZWN0b3J5KGEpfX0scGF0aF9maWxlc3RhdF9nZXQodCxyLHMsZixhKXtsZXQgdT1uZXcgRGF0YVZpZXcoZS5pbnN0LmV4cG9ydHMubWVtb3J5LmJ1ZmZlciksXz1uZXcgVWludDhBcnJheShlLmluc3QuZXhwb3J0cy5tZW1vcnkuYnVmZmVyKTtpZihlLmZkc1t0XSE9bnVsbCl7bGV0IGQ9bmV3IFRleHREZWNvZGVyKCJ1dGYtOCIpLmRlY29kZShfLnNsaWNlKHMscytmKSkse3JldDpoLGZpbGVzdGF0OmN9PWUuZmRzW3RdLnBhdGhfZmlsZXN0YXRfZ2V0KHIsZCk7cmV0dXJuIGMhPW51bGwmJmMud3JpdGVfYnl0ZXModSxhKSxofWVsc2UgcmV0dXJuIDh9LHBhdGhfZmlsZXN0YXRfc2V0X3RpbWVzKHQscixzLGYsYSx1LF8pe2xldCBkPW5ldyBVaW50OEFycmF5KGUuaW5zdC5leHBvcnRzLm1lbW9yeS5idWZmZXIpO2lmKGUuZmRzW3RdIT1udWxsKXtsZXQgaD1uZXcgVGV4dERlY29kZXIoInV0Zi04IikuZGVjb2RlKGQuc2xpY2UocyxzK2YpKTtyZXR1cm4gZS5mZHNbdF0ucGF0aF9maWxlc3RhdF9zZXRfdGltZXMocixoLGEsdSxfKX1lbHNlIHJldHVybiA4fSxwYXRoX2xpbmsodCxyLHMsZixhLHUsXyl7bGV0IGQ9bmV3IFVpbnQ4QXJyYXkoZS5pbnN0LmV4cG9ydHMubWVtb3J5LmJ1ZmZlcik7aWYoZS5mZHNbdF0hPW51bGwmJmUuZmRzW2FdIT1udWxsKXtsZXQgaD1uZXcgVGV4dERlY29kZXIoInV0Zi04IikuZGVjb2RlKGQuc2xpY2UocyxzK2YpKSxjPW5ldyBUZXh0RGVjb2RlcigidXRmLTgiKS5kZWNvZGUoZC5zbGljZSh1LHUrXykpO3JldHVybiBlLmZkc1thXS5wYXRoX2xpbmsodCxyLGgsYyl9ZWxzZSByZXR1cm4gOH0scGF0aF9vcGVuKHQscixzLGYsYSx1LF8sZCxoKXtsZXQgYz1uZXcgRGF0YVZpZXcoZS5pbnN0LmV4cG9ydHMubWVtb3J5LmJ1ZmZlcikscD1uZXcgVWludDhBcnJheShlLmluc3QuZXhwb3J0cy5tZW1vcnkuYnVmZmVyKTtpZihlLmZkc1t0XSE9bnVsbCl7bGV0IEg9bmV3IFRleHREZWNvZGVyKCJ1dGYtOCIpLmRlY29kZShwLnNsaWNlKHMscytmKSkse3JldDpFLGZkX29iajpqfT1lLmZkc1t0XS5wYXRoX29wZW4ocixILGEsdSxfLGQpO2lmKEUhPTApcmV0dXJuIEU7ZS5mZHMucHVzaChqKTtsZXQgJD1lLmZkcy5sZW5ndGgtMTtyZXR1cm4gYy5zZXRVaW50MzIoaCwkLCEwKSwwfWVsc2UgcmV0dXJuIDh9LHBhdGhfcmVhZGxpbmsodCxyLHMsZixhLHUpe2xldCBfPW5ldyBEYXRhVmlldyhlLmluc3QuZXhwb3J0cy5tZW1vcnkuYnVmZmVyKSxkPW5ldyBVaW50OEFycmF5KGUuaW5zdC5leHBvcnRzLm1lbW9yeS5idWZmZXIpO2lmKGUuZmRzW3RdIT1udWxsKXtsZXQgaD1uZXcgVGV4dERlY29kZXIoInV0Zi04IikuZGVjb2RlKGQuc2xpY2UocixyK3MpKSx7cmV0OmMsZGF0YTpwfT1lLmZkc1t0XS5wYXRoX3JlYWRsaW5rKGgpO2lmKHAhPW51bGwpe2lmKHAubGVuZ3RoPmEpcmV0dXJuIF8uc2V0VWludDMyKHUsMCwhMCksODtkLnNldChwLGYpLF8uc2V0VWludDMyKHUscC5sZW5ndGgsITApfXJldHVybiBjfWVsc2UgcmV0dXJuIDh9LHBhdGhfcmVtb3ZlX2RpcmVjdG9yeSh0LHIscyl7bGV0IGY9bmV3IFVpbnQ4QXJyYXkoZS5pbnN0LmV4cG9ydHMubWVtb3J5LmJ1ZmZlcik7aWYoZS5mZHNbdF0hPW51bGwpe2xldCBhPW5ldyBUZXh0RGVjb2RlcigidXRmLTgiKS5kZWNvZGUoZi5zbGljZShyLHIrcykpO3JldHVybiBlLmZkc1t0XS5wYXRoX3JlbW92ZV9kaXJlY3RvcnkoYSl9ZWxzZSByZXR1cm4gOH0scGF0aF9yZW5hbWUodCxyLHMsZixhLHUpe3Rocm93IkZJWE1FIHdoYXQgaXMgdGhlIGJlc3QgYWJzdHJhY3Rpb24gZm9yIHRoaXM/In0scGF0aF9zeW1saW5rKHQscixzLGYsYSl7bGV0IHU9bmV3IFVpbnQ4QXJyYXkoZS5pbnN0LmV4cG9ydHMubWVtb3J5LmJ1ZmZlcik7aWYoZS5mZHNbc10hPW51bGwpe2xldCBfPW5ldyBUZXh0RGVjb2RlcigidXRmLTgiKS5kZWNvZGUodS5zbGljZSh0LHQrcikpLGQ9bmV3IFRleHREZWNvZGVyKCJ1dGYtOCIpLmRlY29kZSh1LnNsaWNlKGYsZithKSk7cmV0dXJuIGUuZmRzW3NdLnBhdGhfc3ltbGluayhfLGQpfWVsc2UgcmV0dXJuIDh9LHBhdGhfdW5saW5rX2ZpbGUodCxyLHMpe2xldCBmPW5ldyBVaW50OEFycmF5KGUuaW5zdC5leHBvcnRzLm1lbW9yeS5idWZmZXIpO2lmKGUuZmRzW3RdIT1udWxsKXtsZXQgYT1uZXcgVGV4dERlY29kZXIoInV0Zi04IikuZGVjb2RlKGYuc2xpY2UocixyK3MpKTtyZXR1cm4gZS5mZHNbdF0ucGF0aF91bmxpbmtfZmlsZShhKX1lbHNlIHJldHVybiA4fSxwb2xsX29uZW9mZih0LHIscyl7dGhyb3ciYXN5bmMgaW8gbm90IHN1cHBvcnRlZCJ9LHByb2NfZXhpdCh0KXt0aHJvdyJleGl0IHdpdGggZXhpdCBjb2RlICIrdH0scHJvY19yYWlzZSh0KXt0aHJvdyJyYWlzZWQgc2lnbmFsICIrdH0sc2NoZWRfeWllbGQoKXt9LHJhbmRvbV9nZXQodCxyKXtsZXQgcz1uZXcgVWludDhBcnJheShlLmluc3QuZXhwb3J0cy5tZW1vcnkuYnVmZmVyKTtmb3IobGV0IGY9MDtmPHI7ZisrKXNbdCtmXT1NYXRoLnJhbmRvbSgpKjI1NnwwfSxzb2NrX3JlY3YodCxyLHMpe3Rocm93InNvY2tldHMgbm90IHN1cHBvcnRlZCJ9LHNvY2tfc2VuZCh0LHIscyl7dGhyb3cic29ja2V0cyBub3Qgc3VwcG9ydGVkIn0sc29ja19zaHV0ZG93bih0LHIpe3Rocm93InNvY2tldHMgbm90IHN1cHBvcnRlZCJ9fX19O2NsYXNzIEx7ZmRfYWR2aXNlKG4saSxsKXtyZXR1cm4tMX1mZF9hbGxvY2F0ZShuLGkpe3JldHVybi0xfWZkX2Nsb3NlKCl7cmV0dXJuIDB9ZmRfZGF0YXN5bmMoKXtyZXR1cm4tMX1mZF9mZHN0YXRfZ2V0KCl7cmV0dXJue3JldDotMSxmZHN0YXQ6bnVsbH19ZmRfZmRzdGF0X3NldF9mbGFncyhuKXtyZXR1cm4tMX1mZF9mZHN0YXRfc2V0X3JpZ2h0cyhuLGkpe3JldHVybi0xfWZkX2ZpbGVzdGF0X2dldCgpe3JldHVybntyZXQ6LTEsZmlsZXN0YXQ6bnVsbH19ZmRfZmlsZXN0YXRfc2V0X3NpemUobil7cmV0dXJuLTF9ZmRfZmlsZXN0YXRfc2V0X3RpbWVzKG4saSxsKXtyZXR1cm4tMX1mZF9wcmVhZChuLGksbCl7cmV0dXJue3JldDotMSxucmVhZDowfX1mZF9wcmVzdGF0X2dldCgpe3JldHVybntyZXQ6LTEscHJlc3RhdDpudWxsfX1mZF9wcmVzdGF0X2Rpcl9uYW1lKG4saSl7cmV0dXJue3JldDotMSxwcmVzdGF0X2Rpcl9uYW1lOm51bGx9fWZkX3B3cml0ZShuLGksbCl7cmV0dXJue3JldDotMSxud3JpdHRlbjowfX1mZF9yZWFkKG4saSl7cmV0dXJue3JldDotMSxucmVhZDowfX1mZF9yZWFkZGlyX3NpbmdsZShuKXtyZXR1cm57cmV0Oi0xLGRpcmVudDpudWxsfX1mZF9zZWVrKG4saSl7cmV0dXJue3JldDotMSxvZmZzZXQ6MG59fWZkX3N5bmMoKXtyZXR1cm4gMH1mZF90ZWxsKCl7cmV0dXJue3JldDotMSxvZmZzZXQ6MG59fWZkX3dyaXRlKG4saSl7cmV0dXJue3JldDotMSxud3JpdHRlbjowfX1wYXRoX2NyZWF0ZV9kaXJlY3Rvcnkobil7cmV0dXJuLTF9cGF0aF9maWxlc3RhdF9nZXQobixpKXtyZXR1cm57cmV0Oi0xLGZpbGVzdGF0Om51bGx9fXBhdGhfZmlsZXN0YXRfc2V0X3RpbWVzKG4saSxsLGUsdCl7cmV0dXJuLTF9cGF0aF9saW5rKG4saSxsLGUpe3JldHVybi0xfXBhdGhfb3BlbihuLGksbCxlLHQscil7cmV0dXJue3JldDotMSxmZF9vYmo6bnVsbH19cGF0aF9yZWFkbGluayhuKXtyZXR1cm57cmV0Oi0xLGRhdGE6bnVsbH19cGF0aF9yZW1vdmVfZGlyZWN0b3J5KG4pe3JldHVybi0xfXBhdGhfcmVuYW1lKG4saSxsKXtyZXR1cm4tMX1wYXRoX3N5bWxpbmsobixpKXtyZXR1cm4tMX1wYXRoX3VubGlua19maWxlKG4pe3JldHVybi0xfX1jbGFzcyBie2dldCBzaXplKCl7cmV0dXJuIEJpZ0ludCh0aGlzLmRhdGEuYnl0ZUxlbmd0aCl9c3RhdCgpe3JldHVybiBuZXcgSShVLHRoaXMuc2l6ZSl9dHJ1bmNhdGUoKXt0aGlzLmRhdGE9bmV3IFVpbnQ4QXJyYXkoW10pfWNvbnN0cnVjdG9yKG4pe3RoaXMuZGF0YT1uZXcgVWludDhBcnJheShuKX19Y2xhc3MgUiBleHRlbmRzIEx7ZmRfZmRzdGF0X2dldCgpe3JldHVybntyZXQ6MCxmZHN0YXQ6bmV3IGsoVSwwKX19ZmRfcmVhZChuLGkpe2xldCBsPTA7Zm9yKGxldCBlIG9mIGkpaWYodGhpcy5maWxlX3Bvczx0aGlzLmZpbGUuZGF0YS5ieXRlTGVuZ3RoKXtsZXQgdD10aGlzLmZpbGUuZGF0YS5zbGljZShOdW1iZXIodGhpcy5maWxlX3BvcyksTnVtYmVyKHRoaXMuZmlsZV9wb3MrQmlnSW50KGUuYnVmX2xlbikpKTtuLnNldCh0LGUuYnVmKSx0aGlzLmZpbGVfcG9zKz1CaWdJbnQodC5sZW5ndGgpLGwrPXQubGVuZ3RofWVsc2UgYnJlYWs7cmV0dXJue3JldDowLG5yZWFkOmx9fWZkX3NlZWsobixpKXtsZXQgbDtzd2l0Y2goaSl7Y2FzZSBOOmw9bjticmVhaztjYXNlIE86bD10aGlzLmZpbGVfcG9zK247YnJlYWs7Y2FzZSBGOmw9QmlnSW50KHRoaXMuZmlsZS5kYXRhLmJ5dGVMZW5ndGgpK247YnJlYWs7ZGVmYXVsdDpyZXR1cm57cmV0OjI4LG9mZnNldDowbn19cmV0dXJuIGw8MD97cmV0OjI4LG9mZnNldDowbn06KHRoaXMuZmlsZV9wb3M9bCx7cmV0OjAsb2Zmc2V0OnRoaXMuZmlsZV9wb3N9KX1mZF93cml0ZShuLGkpe2xldCBsPTA7Zm9yKGxldCBlIG9mIGkpe2xldCB0PW4uc2xpY2UoZS5idWYsZS5idWYrZS5idWZfbGVuKTtpZih0aGlzLmZpbGVfcG9zK0JpZ0ludCh0LmJ5dGVMZW5ndGgpPnRoaXMuZmlsZS5zaXplKXtsZXQgcj10aGlzLmZpbGUuZGF0YTt0aGlzLmZpbGUuZGF0YT1uZXcgVWludDhBcnJheShOdW1iZXIodGhpcy5maWxlX3BvcytCaWdJbnQodC5ieXRlTGVuZ3RoKSkpLHRoaXMuZmlsZS5kYXRhLnNldChyKX10aGlzLmZpbGUuZGF0YS5zZXQodC5zbGljZSgwLE51bWJlcih0aGlzLmZpbGUuc2l6ZS10aGlzLmZpbGVfcG9zKSksTnVtYmVyKHRoaXMuZmlsZV9wb3MpKSx0aGlzLmZpbGVfcG9zKz1CaWdJbnQodC5ieXRlTGVuZ3RoKSxsKz1lLmJ1Zl9sZW59cmV0dXJue3JldDowLG53cml0dGVuOmx9fWZkX2ZpbGVzdGF0X2dldCgpe3JldHVybntyZXQ6MCxmaWxlc3RhdDp0aGlzLmZpbGUuc3RhdCgpfX1jb25zdHJ1Y3RvcihuKXtzdXBlcigpLHRoaXMuZmlsZV9wb3M9MG4sdGhpcy5maWxlPW59fXZhciBWPSIvdHlwZS1zYWZhcmkvbGliL3R5cGUtc2FmYXJpLndhc20iO2NvbnN0IHY9Y29uc29sZS5sb2c7Y29uc29sZS5sb2c9ZnVuY3Rpb24oLi4ubyl7digiJWNbd29ya2VyXSIsImNvbG9yOiBncmVlbiIsLi4ubyl9O2NvbnN0IEE9bmV3IFRleHRFbmNvZGVyLHo9bmV3IFRleHREZWNvZGVyLEM9bmV3IFIobmV3IGIoW10pKSxTPW5ldyBSKG5ldyBiKFtdKSksUD1uZXcgUihuZXcgYihbXSkpLEQ9KG8sbixpKT0+e2NvbnN0IGw9bi5ieXRlTGVuZ3RoLGU9by5tYWxsb2MobCk7dHJ5e2NvbnN0IHQ9by5tZW1vcnk7bmV3IFVpbnQ4QXJyYXkodC5idWZmZXIsZSxsKS5zZXQobiksaShlLGwpfWZpbmFsbHl7by5mcmVlKGUpfX07YXN5bmMgZnVuY3Rpb24gVygpe2NvbnN0IG89c2VsZi5sb2NhdGlvbi5vcmlnaW4rVixpPShhd2FpdCBxKGZldGNoKG8pKSkuaW5zdGFuY2UuZXhwb3J0cztjb25zb2xlLmxvZyhpKSxvbm1lc3NhZ2U9bD0+e2NvbnN0IGU9bC5kYXRhO2NvbnNvbGUubG9nKCJyZWNlaXZlZCByZXF1ZXN0IGZyb20gbWFpbiIsZSksZS50YWc9PT0idG9VcHBlciI/TShpLGUuZGF0YSk6ZS50YWc9PT0icnVuUGFyc2UiP3koaSwicnVuUGFyc2UiLGUuZGF0YSk6ZS50YWc9PT0icnVuUGFyc2VUeXBlIj95KGksInJ1blBhcnNlVHlwZSIsZS5kYXRhKTplLnRhZz09PSJydW5JbmZlckFic3RyYWN0Ij95KGksInJ1bkluZmVyQWJzdHJhY3QiLGUuZGF0YSk6ZS50YWc9PT0icnVuVW5pZnkiP3koaSwicnVuVW5pZnkiLGUuZGF0YSk6SygpfSxKKCl9ZnVuY3Rpb24geChvLG4pe3RyeXtjb25zdCBpPW8uZ2V0U3RyaW5nKG4pLGw9by5nZXRTdHJpbmdMZW4obiksZT1uZXcgVWludDhBcnJheShvLm1lbW9yeS5idWZmZXIsaSxsKTtyZXR1cm4gei5kZWNvZGUoZSl9ZmluYWxseXtvLmZyZWVTdHJpbmdXaXRoTGVuKG4pfX1mdW5jdGlvbiBNKG8sbil7Y29uc3QgaT1BLmVuY29kZShuLnZhbHVlKTtsZXQgbD1udWxsO0QobyxpLChlLHQpPT57Y29uc3Qgcj1vLnJ1blRvVXBwZXIoZSx0KSxzPXgobyxyKTtjb25zb2xlLmxvZyhgcmVzdWx0OiAke3N9YCksbD1zfSksbCE9PW51bGw/dyh7dGFnOiJ3b3JrZXJSZXN1bHQiLGRhdGE6e3Jlc3VsdDpsfX0pOkIoKX1mdW5jdGlvbiB5KG8sbixpKXtjb25zdCBsPUEuZW5jb2RlKEpTT04uc3RyaW5naWZ5KGkpKTtsZXQgZT1udWxsO2lmKEQobyxsLCh0LHIpPT57Y29uc3Qgcz1vW25dLGY9cyh0LHIpLGE9eChvLGYpO2NvbnNvbGUubG9nKGByZXN1bHQ6ICR7YX1gKSxlPWF9KSxlIT09bnVsbCl7Y29uc3QgdD1KU09OLnBhcnNlKGUpO3coe3RhZzoid29ya2VyUmVzdWx0IixkYXRhOnR9KX1lbHNlIEIoKX1mdW5jdGlvbiB3KG8pe2NvbnNvbGUubG9nKCJwb3N0aW5nIHJlc3BvbnNlIixvKSxwb3N0TWVzc2FnZShvKX1mdW5jdGlvbiBKKCl7dyh7dGFnOiJ3b3JrZXJSZWFkeSJ9KX1mdW5jdGlvbiBLKCl7dyh7dGFnOiJ3b3JrZXJVbmtub3duUmVxdWVzdCJ9KX1mdW5jdGlvbiBCKCl7dyh7dGFnOiJ3b3JrZXJGYWlsdXJlIn0pfWFzeW5jIGZ1bmN0aW9uIHEobyl7Y29uc3Qgbj1bXSxpPVtdLGw9W0MsUyxQXSxlPW5ldyBUKG4saSxsKSx0PWF3YWl0IFdlYkFzc2VtYmx5Lmluc3RhbnRpYXRlU3RyZWFtaW5nKG8se3dhc2lfc25hcHNob3RfcHJldmlldzE6ZS53YXNpSW1wb3J0fSk7cmV0dXJuIGUuaW5zdD10Lmluc3RhbmNlLHR9VygpfSkoKTsK", Ho = typeof window < "u" && window.Blob && new Blob([atob(Ha)], { type: "text/javascript;charset=utf-8" });
function cu() {
  let n;
  try {
    if (n = Ho && (window.URL || window.webkitURL).createObjectURL(Ho), !n)
      throw "";
    return new Worker(n);
  } catch {
    return new Worker("data:application/javascript;base64," + Ha);
  } finally {
    n && (window.URL || window.webkitURL).revokeObjectURL(n);
  }
}
const Fa = 1024;
let fu = 0, Vs = class {
  constructor(e, t) {
    this.from = e, this.to = t;
  }
};
class V {
  /**
  Create a new node prop type.
  */
  constructor(e = {}) {
    this.id = fu++, this.perNode = !!e.perNode, this.deserialize = e.deserialize || (() => {
      throw new Error("This node type doesn't define a deserialize function");
    });
  }
  /**
  This is meant to be used with
  [`NodeSet.extend`](#common.NodeSet.extend) or
  [`LRParser.configure`](#lr.ParserConfig.props) to compute
  prop values for each node type in the set. Takes a [match
  object](#common.NodeType^match) or function that returns undefined
  if the node type doesn't get this prop, and the prop's value if
  it does.
  */
  add(e) {
    if (this.perNode)
      throw new RangeError("Can't add per-node props to node types");
    return typeof e != "function" && (e = Ae.match(e)), (t) => {
      let i = e(t);
      return i === void 0 ? null : [this, i];
    };
  }
}
V.closedBy = new V({ deserialize: (n) => n.split(" ") });
V.openedBy = new V({ deserialize: (n) => n.split(" ") });
V.group = new V({ deserialize: (n) => n.split(" ") });
V.isolate = new V({ deserialize: (n) => {
  if (n && n != "rtl" && n != "ltr" && n != "auto")
    throw new RangeError("Invalid value for isolate: " + n);
  return n || "auto";
} });
V.contextHash = new V({ perNode: !0 });
V.lookAhead = new V({ perNode: !0 });
V.mounted = new V({ perNode: !0 });
class Hn {
  constructor(e, t, i) {
    this.tree = e, this.overlay = t, this.parser = i;
  }
  /**
  @internal
  */
  static get(e) {
    return e && e.props && e.props[V.mounted.id];
  }
}
const uu = /* @__PURE__ */ Object.create(null);
class Ae {
  /**
  @internal
  */
  constructor(e, t, i, s = 0) {
    this.name = e, this.props = t, this.id = i, this.flags = s;
  }
  /**
  Define a node type.
  */
  static define(e) {
    let t = e.props && e.props.length ? /* @__PURE__ */ Object.create(null) : uu, i = (e.top ? 1 : 0) | (e.skipped ? 2 : 0) | (e.error ? 4 : 0) | (e.name == null ? 8 : 0), s = new Ae(e.name || "", t, e.id, i);
    if (e.props) {
      for (let r of e.props)
        if (Array.isArray(r) || (r = r(s)), r) {
          if (r[0].perNode)
            throw new RangeError("Can't store a per-node prop on a node type");
          t[r[0].id] = r[1];
        }
    }
    return s;
  }
  /**
  Retrieves a node prop for this type. Will return `undefined` if
  the prop isn't present on this node.
  */
  prop(e) {
    return this.props[e.id];
  }
  /**
  True when this is the top node of a grammar.
  */
  get isTop() {
    return (this.flags & 1) > 0;
  }
  /**
  True when this node is produced by a skip rule.
  */
  get isSkipped() {
    return (this.flags & 2) > 0;
  }
  /**
  Indicates whether this is an error node.
  */
  get isError() {
    return (this.flags & 4) > 0;
  }
  /**
  When true, this node type doesn't correspond to a user-declared
  named node, for example because it is used to cache repetition.
  */
  get isAnonymous() {
    return (this.flags & 8) > 0;
  }
  /**
  Returns true when this node's name or one of its
  [groups](#common.NodeProp^group) matches the given string.
  */
  is(e) {
    if (typeof e == "string") {
      if (this.name == e)
        return !0;
      let t = this.prop(V.group);
      return t ? t.indexOf(e) > -1 : !1;
    }
    return this.id == e;
  }
  /**
  Create a function from node types to arbitrary values by
  specifying an object whose property names are node or
  [group](#common.NodeProp^group) names. Often useful with
  [`NodeProp.add`](#common.NodeProp.add). You can put multiple
  names, separated by spaces, in a single property name to map
  multiple node names to a single value.
  */
  static match(e) {
    let t = /* @__PURE__ */ Object.create(null);
    for (let i in e)
      for (let s of i.split(" "))
        t[s] = e[i];
    return (i) => {
      for (let s = i.prop(V.group), r = -1; r < (s ? s.length : 0); r++) {
        let o = t[r < 0 ? i.name : s[r]];
        if (o)
          return o;
      }
    };
  }
}
Ae.none = new Ae(
  "",
  /* @__PURE__ */ Object.create(null),
  0,
  8
  /* NodeFlag.Anonymous */
);
class no {
  /**
  Create a set with the given types. The `id` property of each
  type should correspond to its position within the array.
  */
  constructor(e) {
    this.types = e;
    for (let t = 0; t < e.length; t++)
      if (e[t].id != t)
        throw new RangeError("Node type ids should correspond to array positions when creating a node set");
  }
  /**
  Create a copy of this set with some node properties added. The
  arguments to this method can be created with
  [`NodeProp.add`](#common.NodeProp.add).
  */
  extend(...e) {
    let t = [];
    for (let i of this.types) {
      let s = null;
      for (let r of e) {
        let o = r(i);
        o && (s || (s = Object.assign({}, i.props)), s[o[0].id] = o[1]);
      }
      t.push(s ? new Ae(i.name, s, i.id, i.flags) : i);
    }
    return new no(t);
  }
}
const rn = /* @__PURE__ */ new WeakMap(), Fo = /* @__PURE__ */ new WeakMap();
var re;
(function(n) {
  n[n.ExcludeBuffers = 1] = "ExcludeBuffers", n[n.IncludeAnonymous = 2] = "IncludeAnonymous", n[n.IgnoreMounts = 4] = "IgnoreMounts", n[n.IgnoreOverlays = 8] = "IgnoreOverlays";
})(re || (re = {}));
class j {
  /**
  Construct a new tree. See also [`Tree.build`](#common.Tree^build).
  */
  constructor(e, t, i, s, r) {
    if (this.type = e, this.children = t, this.positions = i, this.length = s, this.props = null, r && r.length) {
      this.props = /* @__PURE__ */ Object.create(null);
      for (let [o, l] of r)
        this.props[typeof o == "number" ? o : o.id] = l;
    }
  }
  /**
  @internal
  */
  toString() {
    let e = Hn.get(this);
    if (e && !e.overlay)
      return e.tree.toString();
    let t = "";
    for (let i of this.children) {
      let s = i.toString();
      s && (t && (t += ","), t += s);
    }
    return this.type.name ? (/\W/.test(this.type.name) && !this.type.isError ? JSON.stringify(this.type.name) : this.type.name) + (t.length ? "(" + t + ")" : "") : t;
  }
  /**
  Get a [tree cursor](#common.TreeCursor) positioned at the top of
  the tree. Mode can be used to [control](#common.IterMode) which
  nodes the cursor visits.
  */
  cursor(e = 0) {
    return new Fn(this.topNode, e);
  }
  /**
  Get a [tree cursor](#common.TreeCursor) pointing into this tree
  at the given position and side (see
  [`moveTo`](#common.TreeCursor.moveTo).
  */
  cursorAt(e, t = 0, i = 0) {
    let s = rn.get(this) || this.topNode, r = new Fn(s);
    return r.moveTo(e, t), rn.set(this, r._tree), r;
  }
  /**
  Get a [syntax node](#common.SyntaxNode) object for the top of the
  tree.
  */
  get topNode() {
    return new Ie(this, 0, 0, null);
  }
  /**
  Get the [syntax node](#common.SyntaxNode) at the given position.
  If `side` is -1, this will move into nodes that end at the
  position. If 1, it'll move into nodes that start at the
  position. With 0, it'll only enter nodes that cover the position
  from both sides.
  
  Note that this will not enter
  [overlays](#common.MountedTree.overlay), and you often want
  [`resolveInner`](#common.Tree.resolveInner) instead.
  */
  resolve(e, t = 0) {
    let i = Li(rn.get(this) || this.topNode, e, t, !1);
    return rn.set(this, i), i;
  }
  /**
  Like [`resolve`](#common.Tree.resolve), but will enter
  [overlaid](#common.MountedTree.overlay) nodes, producing a syntax node
  pointing into the innermost overlaid tree at the given position
  (with parent links going through all parent structure, including
  the host trees).
  */
  resolveInner(e, t = 0) {
    let i = Li(Fo.get(this) || this.topNode, e, t, !0);
    return Fo.set(this, i), i;
  }
  /**
  In some situations, it can be useful to iterate through all
  nodes around a position, including those in overlays that don't
  directly cover the position. This method gives you an iterator
  that will produce all nodes, from small to big, around the given
  position.
  */
  resolveStack(e, t = 0) {
    return mu(this, e, t);
  }
  /**
  Iterate over the tree and its children, calling `enter` for any
  node that touches the `from`/`to` region (if given) before
  running over such a node's children, and `leave` (if given) when
  leaving the node. When `enter` returns `false`, that node will
  not have its children iterated over (or `leave` called).
  */
  iterate(e) {
    let { enter: t, leave: i, from: s = 0, to: r = this.length } = e, o = e.mode || 0, l = (o & re.IncludeAnonymous) > 0;
    for (let a = this.cursor(o | re.IncludeAnonymous); ; ) {
      let h = !1;
      if (a.from <= r && a.to >= s && (!l && a.type.isAnonymous || t(a) !== !1)) {
        if (a.firstChild())
          continue;
        h = !0;
      }
      for (; h && i && (l || !a.type.isAnonymous) && i(a), !a.nextSibling(); ) {
        if (!a.parent())
          return;
        h = !0;
      }
    }
  }
  /**
  Get the value of the given [node prop](#common.NodeProp) for this
  node. Works with both per-node and per-type props.
  */
  prop(e) {
    return e.perNode ? this.props ? this.props[e.id] : void 0 : this.type.prop(e);
  }
  /**
  Returns the node's [per-node props](#common.NodeProp.perNode) in a
  format that can be passed to the [`Tree`](#common.Tree)
  constructor.
  */
  get propValues() {
    let e = [];
    if (this.props)
      for (let t in this.props)
        e.push([+t, this.props[t]]);
    return e;
  }
  /**
  Balance the direct children of this tree, producing a copy of
  which may have children grouped into subtrees with type
  [`NodeType.none`](#common.NodeType^none).
  */
  balance(e = {}) {
    return this.children.length <= 8 ? this : oo(Ae.none, this.children, this.positions, 0, this.children.length, 0, this.length, (t, i, s) => new j(this.type, t, i, s, this.propValues), e.makeTree || ((t, i, s) => new j(Ae.none, t, i, s)));
  }
  /**
  Build a tree from a postfix-ordered buffer of node information,
  or a cursor over such a buffer.
  */
  static build(e) {
    return gu(e);
  }
}
j.empty = new j(Ae.none, [], [], 0);
class so {
  constructor(e, t) {
    this.buffer = e, this.index = t;
  }
  get id() {
    return this.buffer[this.index - 4];
  }
  get start() {
    return this.buffer[this.index - 3];
  }
  get end() {
    return this.buffer[this.index - 2];
  }
  get size() {
    return this.buffer[this.index - 1];
  }
  get pos() {
    return this.index;
  }
  next() {
    this.index -= 4;
  }
  fork() {
    return new so(this.buffer, this.index);
  }
}
class wt {
  /**
  Create a tree buffer.
  */
  constructor(e, t, i) {
    this.buffer = e, this.length = t, this.set = i;
  }
  /**
  @internal
  */
  get type() {
    return Ae.none;
  }
  /**
  @internal
  */
  toString() {
    let e = [];
    for (let t = 0; t < this.buffer.length; )
      e.push(this.childString(t)), t = this.buffer[t + 3];
    return e.join(",");
  }
  /**
  @internal
  */
  childString(e) {
    let t = this.buffer[e], i = this.buffer[e + 3], s = this.set.types[t], r = s.name;
    if (/\W/.test(r) && !s.isError && (r = JSON.stringify(r)), e += 4, i == e)
      return r;
    let o = [];
    for (; e < i; )
      o.push(this.childString(e)), e = this.buffer[e + 3];
    return r + "(" + o.join(",") + ")";
  }
  /**
  @internal
  */
  findChild(e, t, i, s, r) {
    let { buffer: o } = this, l = -1;
    for (let a = e; a != t && !(za(r, s, o[a + 1], o[a + 2]) && (l = a, i > 0)); a = o[a + 3])
      ;
    return l;
  }
  /**
  @internal
  */
  slice(e, t, i) {
    let s = this.buffer, r = new Uint16Array(t - e), o = 0;
    for (let l = e, a = 0; l < t; ) {
      r[a++] = s[l++], r[a++] = s[l++] - i;
      let h = r[a++] = s[l++] - i;
      r[a++] = s[l++] - e, o = Math.max(o, h);
    }
    return new wt(r, o, this.set);
  }
}
function za(n, e, t, i) {
  switch (n) {
    case -2:
      return t < e;
    case -1:
      return i >= e && t < e;
    case 0:
      return t < e && i > e;
    case 1:
      return t <= e && i > e;
    case 2:
      return i > e;
    case 4:
      return !0;
  }
}
function Li(n, e, t, i) {
  for (var s; n.from == n.to || (t < 1 ? n.from >= e : n.from > e) || (t > -1 ? n.to <= e : n.to < e); ) {
    let o = !i && n instanceof Ie && n.index < 0 ? null : n.parent;
    if (!o)
      return n;
    n = o;
  }
  let r = i ? 0 : re.IgnoreOverlays;
  if (i)
    for (let o = n, l = o.parent; l; o = l, l = o.parent)
      o instanceof Ie && o.index < 0 && ((s = l.enter(e, t, r)) === null || s === void 0 ? void 0 : s.from) != o.from && (n = l);
  for (; ; ) {
    let o = n.enter(e, t, r);
    if (!o)
      return n;
    n = o;
  }
}
class Ka {
  cursor(e = 0) {
    return new Fn(this, e);
  }
  getChild(e, t = null, i = null) {
    let s = zo(this, e, t, i);
    return s.length ? s[0] : null;
  }
  getChildren(e, t = null, i = null) {
    return zo(this, e, t, i);
  }
  resolve(e, t = 0) {
    return Li(this, e, t, !1);
  }
  resolveInner(e, t = 0) {
    return Li(this, e, t, !0);
  }
  matchContext(e) {
    return cr(this, e);
  }
  enterUnfinishedNodesBefore(e) {
    let t = this.childBefore(e), i = this;
    for (; t; ) {
      let s = t.lastChild;
      if (!s || s.to != t.to)
        break;
      s.type.isError && s.from == s.to ? (i = t, t = s.prevSibling) : t = s;
    }
    return i;
  }
  get node() {
    return this;
  }
  get next() {
    return this.parent;
  }
}
class Ie extends Ka {
  constructor(e, t, i, s) {
    super(), this._tree = e, this.from = t, this.index = i, this._parent = s;
  }
  get type() {
    return this._tree.type;
  }
  get name() {
    return this._tree.type.name;
  }
  get to() {
    return this.from + this._tree.length;
  }
  nextChild(e, t, i, s, r = 0) {
    for (let o = this; ; ) {
      for (let { children: l, positions: a } = o._tree, h = t > 0 ? l.length : -1; e != h; e += t) {
        let c = l[e], f = a[e] + o.from;
        if (za(s, i, f, f + c.length)) {
          if (c instanceof wt) {
            if (r & re.ExcludeBuffers)
              continue;
            let u = c.findChild(0, c.buffer.length, t, i - f, s);
            if (u > -1)
              return new dt(new du(o, c, e, f), null, u);
          } else if (r & re.IncludeAnonymous || !c.type.isAnonymous || ro(c)) {
            let u;
            if (!(r & re.IgnoreMounts) && (u = Hn.get(c)) && !u.overlay)
              return new Ie(u.tree, f, e, o);
            let d = new Ie(c, f, e, o);
            return r & re.IncludeAnonymous || !d.type.isAnonymous ? d : d.nextChild(t < 0 ? c.children.length - 1 : 0, t, i, s);
          }
        }
      }
      if (r & re.IncludeAnonymous || !o.type.isAnonymous || (o.index >= 0 ? e = o.index + t : e = t < 0 ? -1 : o._parent._tree.children.length, o = o._parent, !o))
        return null;
    }
  }
  get firstChild() {
    return this.nextChild(
      0,
      1,
      0,
      4
      /* Side.DontCare */
    );
  }
  get lastChild() {
    return this.nextChild(
      this._tree.children.length - 1,
      -1,
      0,
      4
      /* Side.DontCare */
    );
  }
  childAfter(e) {
    return this.nextChild(
      0,
      1,
      e,
      2
      /* Side.After */
    );
  }
  childBefore(e) {
    return this.nextChild(
      this._tree.children.length - 1,
      -1,
      e,
      -2
      /* Side.Before */
    );
  }
  enter(e, t, i = 0) {
    let s;
    if (!(i & re.IgnoreOverlays) && (s = Hn.get(this._tree)) && s.overlay) {
      let r = e - this.from;
      for (let { from: o, to: l } of s.overlay)
        if ((t > 0 ? o <= r : o < r) && (t < 0 ? l >= r : l > r))
          return new Ie(s.tree, s.overlay[0].from + this.from, -1, this);
    }
    return this.nextChild(0, 1, e, t, i);
  }
  nextSignificantParent() {
    let e = this;
    for (; e.type.isAnonymous && e._parent; )
      e = e._parent;
    return e;
  }
  get parent() {
    return this._parent ? this._parent.nextSignificantParent() : null;
  }
  get nextSibling() {
    return this._parent && this.index >= 0 ? this._parent.nextChild(
      this.index + 1,
      1,
      0,
      4
      /* Side.DontCare */
    ) : null;
  }
  get prevSibling() {
    return this._parent && this.index >= 0 ? this._parent.nextChild(
      this.index - 1,
      -1,
      0,
      4
      /* Side.DontCare */
    ) : null;
  }
  get tree() {
    return this._tree;
  }
  toTree() {
    return this._tree;
  }
  /**
  @internal
  */
  toString() {
    return this._tree.toString();
  }
}
function zo(n, e, t, i) {
  let s = n.cursor(), r = [];
  if (!s.firstChild())
    return r;
  if (t != null) {
    for (let o = !1; !o; )
      if (o = s.type.is(t), !s.nextSibling())
        return r;
  }
  for (; ; ) {
    if (i != null && s.type.is(i))
      return r;
    if (s.type.is(e) && r.push(s.node), !s.nextSibling())
      return i == null ? r : [];
  }
}
function cr(n, e, t = e.length - 1) {
  for (let i = n.parent; t >= 0; i = i.parent) {
    if (!i)
      return !1;
    if (!i.type.isAnonymous) {
      if (e[t] && e[t] != i.name)
        return !1;
      t--;
    }
  }
  return !0;
}
class du {
  constructor(e, t, i, s) {
    this.parent = e, this.buffer = t, this.index = i, this.start = s;
  }
}
class dt extends Ka {
  get name() {
    return this.type.name;
  }
  get from() {
    return this.context.start + this.context.buffer.buffer[this.index + 1];
  }
  get to() {
    return this.context.start + this.context.buffer.buffer[this.index + 2];
  }
  constructor(e, t, i) {
    super(), this.context = e, this._parent = t, this.index = i, this.type = e.buffer.set.types[e.buffer.buffer[i]];
  }
  child(e, t, i) {
    let { buffer: s } = this.context, r = s.findChild(this.index + 4, s.buffer[this.index + 3], e, t - this.context.start, i);
    return r < 0 ? null : new dt(this.context, this, r);
  }
  get firstChild() {
    return this.child(
      1,
      0,
      4
      /* Side.DontCare */
    );
  }
  get lastChild() {
    return this.child(
      -1,
      0,
      4
      /* Side.DontCare */
    );
  }
  childAfter(e) {
    return this.child(
      1,
      e,
      2
      /* Side.After */
    );
  }
  childBefore(e) {
    return this.child(
      -1,
      e,
      -2
      /* Side.Before */
    );
  }
  enter(e, t, i = 0) {
    if (i & re.ExcludeBuffers)
      return null;
    let { buffer: s } = this.context, r = s.findChild(this.index + 4, s.buffer[this.index + 3], t > 0 ? 1 : -1, e - this.context.start, t);
    return r < 0 ? null : new dt(this.context, this, r);
  }
  get parent() {
    return this._parent || this.context.parent.nextSignificantParent();
  }
  externalSibling(e) {
    return this._parent ? null : this.context.parent.nextChild(
      this.context.index + e,
      e,
      0,
      4
      /* Side.DontCare */
    );
  }
  get nextSibling() {
    let { buffer: e } = this.context, t = e.buffer[this.index + 3];
    return t < (this._parent ? e.buffer[this._parent.index + 3] : e.buffer.length) ? new dt(this.context, this._parent, t) : this.externalSibling(1);
  }
  get prevSibling() {
    let { buffer: e } = this.context, t = this._parent ? this._parent.index + 4 : 0;
    return this.index == t ? this.externalSibling(-1) : new dt(this.context, this._parent, e.findChild(
      t,
      this.index,
      -1,
      0,
      4
      /* Side.DontCare */
    ));
  }
  get tree() {
    return null;
  }
  toTree() {
    let e = [], t = [], { buffer: i } = this.context, s = this.index + 4, r = i.buffer[this.index + 3];
    if (r > s) {
      let o = i.buffer[this.index + 1];
      e.push(i.slice(s, r, o)), t.push(0);
    }
    return new j(this.type, e, t, this.to - this.from);
  }
  /**
  @internal
  */
  toString() {
    return this.context.buffer.childString(this.index);
  }
}
function Ya(n) {
  if (!n.length)
    return null;
  let e = 0, t = n[0];
  for (let r = 1; r < n.length; r++) {
    let o = n[r];
    (o.from > t.from || o.to < t.to) && (t = o, e = r);
  }
  let i = t instanceof Ie && t.index < 0 ? null : t.parent, s = n.slice();
  return i ? s[e] = i : s.splice(e, 1), new pu(s, t);
}
class pu {
  constructor(e, t) {
    this.heads = e, this.node = t;
  }
  get next() {
    return Ya(this.heads);
  }
}
function mu(n, e, t) {
  let i = n.resolveInner(e, t), s = null;
  for (let r = i instanceof Ie ? i : i.context.parent; r; r = r.parent)
    if (r.index < 0) {
      let o = r.parent;
      (s || (s = [i])).push(o.resolve(e, t)), r = o;
    } else {
      let o = Hn.get(r.tree);
      if (o && o.overlay && o.overlay[0].from <= e && o.overlay[o.overlay.length - 1].to >= e) {
        let l = new Ie(o.tree, o.overlay[0].from + r.from, -1, r);
        (s || (s = [i])).push(Li(l, e, t, !1));
      }
    }
  return s ? Ya(s) : i;
}
class Fn {
  /**
  Shorthand for `.type.name`.
  */
  get name() {
    return this.type.name;
  }
  /**
  @internal
  */
  constructor(e, t = 0) {
    if (this.mode = t, this.buffer = null, this.stack = [], this.index = 0, this.bufferNode = null, e instanceof Ie)
      this.yieldNode(e);
    else {
      this._tree = e.context.parent, this.buffer = e.context;
      for (let i = e._parent; i; i = i._parent)
        this.stack.unshift(i.index);
      this.bufferNode = e, this.yieldBuf(e.index);
    }
  }
  yieldNode(e) {
    return e ? (this._tree = e, this.type = e.type, this.from = e.from, this.to = e.to, !0) : !1;
  }
  yieldBuf(e, t) {
    this.index = e;
    let { start: i, buffer: s } = this.buffer;
    return this.type = t || s.set.types[s.buffer[e]], this.from = i + s.buffer[e + 1], this.to = i + s.buffer[e + 2], !0;
  }
  /**
  @internal
  */
  yield(e) {
    return e ? e instanceof Ie ? (this.buffer = null, this.yieldNode(e)) : (this.buffer = e.context, this.yieldBuf(e.index, e.type)) : !1;
  }
  /**
  @internal
  */
  toString() {
    return this.buffer ? this.buffer.buffer.childString(this.index) : this._tree.toString();
  }
  /**
  @internal
  */
  enterChild(e, t, i) {
    if (!this.buffer)
      return this.yield(this._tree.nextChild(e < 0 ? this._tree._tree.children.length - 1 : 0, e, t, i, this.mode));
    let { buffer: s } = this.buffer, r = s.findChild(this.index + 4, s.buffer[this.index + 3], e, t - this.buffer.start, i);
    return r < 0 ? !1 : (this.stack.push(this.index), this.yieldBuf(r));
  }
  /**
  Move the cursor to this node's first child. When this returns
  false, the node has no child, and the cursor has not been moved.
  */
  firstChild() {
    return this.enterChild(
      1,
      0,
      4
      /* Side.DontCare */
    );
  }
  /**
  Move the cursor to this node's last child.
  */
  lastChild() {
    return this.enterChild(
      -1,
      0,
      4
      /* Side.DontCare */
    );
  }
  /**
  Move the cursor to the first child that ends after `pos`.
  */
  childAfter(e) {
    return this.enterChild(
      1,
      e,
      2
      /* Side.After */
    );
  }
  /**
  Move to the last child that starts before `pos`.
  */
  childBefore(e) {
    return this.enterChild(
      -1,
      e,
      -2
      /* Side.Before */
    );
  }
  /**
  Move the cursor to the child around `pos`. If side is -1 the
  child may end at that position, when 1 it may start there. This
  will also enter [overlaid](#common.MountedTree.overlay)
  [mounted](#common.NodeProp^mounted) trees unless `overlays` is
  set to false.
  */
  enter(e, t, i = this.mode) {
    return this.buffer ? i & re.ExcludeBuffers ? !1 : this.enterChild(1, e, t) : this.yield(this._tree.enter(e, t, i));
  }
  /**
  Move to the node's parent node, if this isn't the top node.
  */
  parent() {
    if (!this.buffer)
      return this.yieldNode(this.mode & re.IncludeAnonymous ? this._tree._parent : this._tree.parent);
    if (this.stack.length)
      return this.yieldBuf(this.stack.pop());
    let e = this.mode & re.IncludeAnonymous ? this.buffer.parent : this.buffer.parent.nextSignificantParent();
    return this.buffer = null, this.yieldNode(e);
  }
  /**
  @internal
  */
  sibling(e) {
    if (!this.buffer)
      return this._tree._parent ? this.yield(this._tree.index < 0 ? null : this._tree._parent.nextChild(this._tree.index + e, e, 0, 4, this.mode)) : !1;
    let { buffer: t } = this.buffer, i = this.stack.length - 1;
    if (e < 0) {
      let s = i < 0 ? 0 : this.stack[i] + 4;
      if (this.index != s)
        return this.yieldBuf(t.findChild(
          s,
          this.index,
          -1,
          0,
          4
          /* Side.DontCare */
        ));
    } else {
      let s = t.buffer[this.index + 3];
      if (s < (i < 0 ? t.buffer.length : t.buffer[this.stack[i] + 3]))
        return this.yieldBuf(s);
    }
    return i < 0 ? this.yield(this.buffer.parent.nextChild(this.buffer.index + e, e, 0, 4, this.mode)) : !1;
  }
  /**
  Move to this node's next sibling, if any.
  */
  nextSibling() {
    return this.sibling(1);
  }
  /**
  Move to this node's previous sibling, if any.
  */
  prevSibling() {
    return this.sibling(-1);
  }
  atLastNode(e) {
    let t, i, { buffer: s } = this;
    if (s) {
      if (e > 0) {
        if (this.index < s.buffer.buffer.length)
          return !1;
      } else
        for (let r = 0; r < this.index; r++)
          if (s.buffer.buffer[r + 3] < this.index)
            return !1;
      ({ index: t, parent: i } = s);
    } else
      ({ index: t, _parent: i } = this._tree);
    for (; i; { index: t, _parent: i } = i)
      if (t > -1)
        for (let r = t + e, o = e < 0 ? -1 : i._tree.children.length; r != o; r += e) {
          let l = i._tree.children[r];
          if (this.mode & re.IncludeAnonymous || l instanceof wt || !l.type.isAnonymous || ro(l))
            return !1;
        }
    return !0;
  }
  move(e, t) {
    if (t && this.enterChild(
      e,
      0,
      4
      /* Side.DontCare */
    ))
      return !0;
    for (; ; ) {
      if (this.sibling(e))
        return !0;
      if (this.atLastNode(e) || !this.parent())
        return !1;
    }
  }
  /**
  Move to the next node in a
  [pre-order](https://en.wikipedia.org/wiki/Tree_traversal#Pre-order,_NLR)
  traversal, going from a node to its first child or, if the
  current node is empty or `enter` is false, its next sibling or
  the next sibling of the first parent node that has one.
  */
  next(e = !0) {
    return this.move(1, e);
  }
  /**
  Move to the next node in a last-to-first pre-order traveral. A
  node is followed by its last child or, if it has none, its
  previous sibling or the previous sibling of the first parent
  node that has one.
  */
  prev(e = !0) {
    return this.move(-1, e);
  }
  /**
  Move the cursor to the innermost node that covers `pos`. If
  `side` is -1, it will enter nodes that end at `pos`. If it is 1,
  it will enter nodes that start at `pos`.
  */
  moveTo(e, t = 0) {
    for (; (this.from == this.to || (t < 1 ? this.from >= e : this.from > e) || (t > -1 ? this.to <= e : this.to < e)) && this.parent(); )
      ;
    for (; this.enterChild(1, e, t); )
      ;
    return this;
  }
  /**
  Get a [syntax node](#common.SyntaxNode) at the cursor's current
  position.
  */
  get node() {
    if (!this.buffer)
      return this._tree;
    let e = this.bufferNode, t = null, i = 0;
    if (e && e.context == this.buffer)
      e:
        for (let s = this.index, r = this.stack.length; r >= 0; ) {
          for (let o = e; o; o = o._parent)
            if (o.index == s) {
              if (s == this.index)
                return o;
              t = o, i = r + 1;
              break e;
            }
          s = this.stack[--r];
        }
    for (let s = i; s < this.stack.length; s++)
      t = new dt(this.buffer, t, this.stack[s]);
    return this.bufferNode = new dt(this.buffer, t, this.index);
  }
  /**
  Get the [tree](#common.Tree) that represents the current node, if
  any. Will return null when the node is in a [tree
  buffer](#common.TreeBuffer).
  */
  get tree() {
    return this.buffer ? null : this._tree._tree;
  }
  /**
  Iterate over the current node and all its descendants, calling
  `enter` when entering a node and `leave`, if given, when leaving
  one. When `enter` returns `false`, any children of that node are
  skipped, and `leave` isn't called for it.
  */
  iterate(e, t) {
    for (let i = 0; ; ) {
      let s = !1;
      if (this.type.isAnonymous || e(this) !== !1) {
        if (this.firstChild()) {
          i++;
          continue;
        }
        this.type.isAnonymous || (s = !0);
      }
      for (; s && t && t(this), s = this.type.isAnonymous, !this.nextSibling(); ) {
        if (!i)
          return;
        this.parent(), i--, s = !0;
      }
    }
  }
  /**
  Test whether the current node matches a given context—a sequence
  of direct parent node names. Empty strings in the context array
  are treated as wildcards.
  */
  matchContext(e) {
    if (!this.buffer)
      return cr(this.node, e);
    let { buffer: t } = this.buffer, { types: i } = t.set;
    for (let s = e.length - 1, r = this.stack.length - 1; s >= 0; r--) {
      if (r < 0)
        return cr(this.node, e, s);
      let o = i[t.buffer[this.stack[r]]];
      if (!o.isAnonymous) {
        if (e[s] && e[s] != o.name)
          return !1;
        s--;
      }
    }
    return !0;
  }
}
function ro(n) {
  return n.children.some((e) => e instanceof wt || !e.type.isAnonymous || ro(e));
}
function gu(n) {
  var e;
  let { buffer: t, nodeSet: i, maxBufferLength: s = Fa, reused: r = [], minRepeatType: o = i.types.length } = n, l = Array.isArray(t) ? new so(t, t.length) : t, a = i.types, h = 0, c = 0;
  function f(w, A, O, D, W, X) {
    let { id: B, start: P, end: H, size: N } = l, Q = c;
    for (; N < 0; )
      if (l.next(), N == -1) {
        let te = r[B];
        O.push(te), D.push(P - w);
        return;
      } else if (N == -3) {
        h = B;
        return;
      } else if (N == -4) {
        c = B;
        return;
      } else
        throw new RangeError(`Unrecognized record size: ${N}`);
    let we = a[B], ke, Me, Ve = P - w;
    if (H - P <= s && (Me = m(l.pos - A, W))) {
      let te = new Uint16Array(Me.size - Me.skip), Be = l.pos - Me.size, Ke = te.length;
      for (; l.pos > Be; )
        Ke = b(Me.start, te, Ke);
      ke = new wt(te, H - Me.start, i), Ve = Me.start - w;
    } else {
      let te = l.pos - N;
      l.next();
      let Be = [], Ke = [], Zt = B >= o ? B : -1, Ht = 0, tn = H;
      for (; l.pos > te; )
        Zt >= 0 && l.id == Zt && l.size >= 0 ? (l.end <= tn - s && (p(Be, Ke, P, Ht, l.end, tn, Zt, Q), Ht = Be.length, tn = l.end), l.next()) : X > 2500 ? u(P, te, Be, Ke) : f(P, te, Be, Ke, Zt, X + 1);
      if (Zt >= 0 && Ht > 0 && Ht < Be.length && p(Be, Ke, P, Ht, P, tn, Zt, Q), Be.reverse(), Ke.reverse(), Zt > -1 && Ht > 0) {
        let Io = d(we);
        ke = oo(we, Be, Ke, 0, Be.length, 0, H - P, Io, Io);
      } else
        ke = g(we, Be, Ke, H - P, Q - H);
    }
    O.push(ke), D.push(Ve);
  }
  function u(w, A, O, D) {
    let W = [], X = 0, B = -1;
    for (; l.pos > A; ) {
      let { id: P, start: H, end: N, size: Q } = l;
      if (Q > 4)
        l.next();
      else {
        if (B > -1 && H < B)
          break;
        B < 0 && (B = N - s), W.push(P, H, N), X++, l.next();
      }
    }
    if (X) {
      let P = new Uint16Array(X * 4), H = W[W.length - 2];
      for (let N = W.length - 3, Q = 0; N >= 0; N -= 3)
        P[Q++] = W[N], P[Q++] = W[N + 1] - H, P[Q++] = W[N + 2] - H, P[Q++] = Q;
      O.push(new wt(P, W[2] - H, i)), D.push(H - w);
    }
  }
  function d(w) {
    return (A, O, D) => {
      let W = 0, X = A.length - 1, B, P;
      if (X >= 0 && (B = A[X]) instanceof j) {
        if (!X && B.type == w && B.length == D)
          return B;
        (P = B.prop(V.lookAhead)) && (W = O[X] + B.length + P);
      }
      return g(w, A, O, D, W);
    };
  }
  function p(w, A, O, D, W, X, B, P) {
    let H = [], N = [];
    for (; w.length > D; )
      H.push(w.pop()), N.push(A.pop() + O - W);
    w.push(g(i.types[B], H, N, X - W, P - X)), A.push(W - O);
  }
  function g(w, A, O, D, W = 0, X) {
    if (h) {
      let B = [V.contextHash, h];
      X = X ? [B].concat(X) : [B];
    }
    if (W > 25) {
      let B = [V.lookAhead, W];
      X = X ? [B].concat(X) : [B];
    }
    return new j(w, A, O, D, X);
  }
  function m(w, A) {
    let O = l.fork(), D = 0, W = 0, X = 0, B = O.end - s, P = { size: 0, start: 0, skip: 0 };
    e:
      for (let H = O.pos - w; O.pos > H; ) {
        let N = O.size;
        if (O.id == A && N >= 0) {
          P.size = D, P.start = W, P.skip = X, X += 4, D += 4, O.next();
          continue;
        }
        let Q = O.pos - N;
        if (N < 0 || Q < H || O.start < B)
          break;
        let we = O.id >= o ? 4 : 0, ke = O.start;
        for (O.next(); O.pos > Q; ) {
          if (O.size < 0)
            if (O.size == -3)
              we += 4;
            else
              break e;
          else
            O.id >= o && (we += 4);
          O.next();
        }
        W = ke, D += N, X += we;
      }
    return (A < 0 || D == w) && (P.size = D, P.start = W, P.skip = X), P.size > 4 ? P : void 0;
  }
  function b(w, A, O) {
    let { id: D, start: W, end: X, size: B } = l;
    if (l.next(), B >= 0 && D < o) {
      let P = O;
      if (B > 4) {
        let H = l.pos - (B - 4);
        for (; l.pos > H; )
          O = b(w, A, O);
      }
      A[--O] = P, A[--O] = X - w, A[--O] = W - w, A[--O] = D;
    } else
      B == -3 ? h = D : B == -4 && (c = D);
    return O;
  }
  let k = [], C = [];
  for (; l.pos > 0; )
    f(n.start || 0, n.bufferStart || 0, k, C, -1, 0);
  let S = (e = n.length) !== null && e !== void 0 ? e : k.length ? C[0] + k[0].length : 0;
  return new j(a[n.topID], k.reverse(), C.reverse(), S);
}
const Ko = /* @__PURE__ */ new WeakMap();
function Rn(n, e) {
  if (!n.isAnonymous || e instanceof wt || e.type != n)
    return 1;
  let t = Ko.get(e);
  if (t == null) {
    t = 1;
    for (let i of e.children) {
      if (i.type != n || !(i instanceof j)) {
        t = 1;
        break;
      }
      t += Rn(n, i);
    }
    Ko.set(e, t);
  }
  return t;
}
function oo(n, e, t, i, s, r, o, l, a) {
  let h = 0;
  for (let p = i; p < s; p++)
    h += Rn(n, e[p]);
  let c = Math.ceil(
    h * 1.5 / 8
    /* Balance.BranchFactor */
  ), f = [], u = [];
  function d(p, g, m, b, k) {
    for (let C = m; C < b; ) {
      let S = C, w = g[C], A = Rn(n, p[C]);
      for (C++; C < b; C++) {
        let O = Rn(n, p[C]);
        if (A + O >= c)
          break;
        A += O;
      }
      if (C == S + 1) {
        if (A > c) {
          let O = p[S];
          d(O.children, O.positions, 0, O.children.length, g[S] + k);
          continue;
        }
        f.push(p[S]);
      } else {
        let O = g[C - 1] + p[C - 1].length - w;
        f.push(oo(n, p, g, S, C, w, O, null, a));
      }
      u.push(w + k - r);
    }
  }
  return d(e, t, i, s, 0), (l || a)(f, u, o);
}
class Wt {
  /**
  Construct a tree fragment. You'll usually want to use
  [`addTree`](#common.TreeFragment^addTree) and
  [`applyChanges`](#common.TreeFragment^applyChanges) instead of
  calling this directly.
  */
  constructor(e, t, i, s, r = !1, o = !1) {
    this.from = e, this.to = t, this.tree = i, this.offset = s, this.open = (r ? 1 : 0) | (o ? 2 : 0);
  }
  /**
  Whether the start of the fragment represents the start of a
  parse, or the end of a change. (In the second case, it may not
  be safe to reuse some nodes at the start, depending on the
  parsing algorithm.)
  */
  get openStart() {
    return (this.open & 1) > 0;
  }
  /**
  Whether the end of the fragment represents the end of a
  full-document parse, or the start of a change.
  */
  get openEnd() {
    return (this.open & 2) > 0;
  }
  /**
  Create a set of fragments from a freshly parsed tree, or update
  an existing set of fragments by replacing the ones that overlap
  with a tree with content from the new tree. When `partial` is
  true, the parse is treated as incomplete, and the resulting
  fragment has [`openEnd`](#common.TreeFragment.openEnd) set to
  true.
  */
  static addTree(e, t = [], i = !1) {
    let s = [new Wt(0, e.length, e, 0, !1, i)];
    for (let r of t)
      r.to > e.length && s.push(r);
    return s;
  }
  /**
  Apply a set of edits to an array of fragments, removing or
  splitting fragments as necessary to remove edited ranges, and
  adjusting offsets for fragments that moved.
  */
  static applyChanges(e, t, i = 128) {
    if (!t.length)
      return e;
    let s = [], r = 1, o = e.length ? e[0] : null;
    for (let l = 0, a = 0, h = 0; ; l++) {
      let c = l < t.length ? t[l] : null, f = c ? c.fromA : 1e9;
      if (f - a >= i)
        for (; o && o.from < f; ) {
          let u = o;
          if (a >= u.from || f <= u.to || h) {
            let d = Math.max(u.from, a) - h, p = Math.min(u.to, f) - h;
            u = d >= p ? null : new Wt(d, p, u.tree, u.offset + h, l > 0, !!c);
          }
          if (u && s.push(u), o.to > f)
            break;
          o = r < e.length ? e[r++] : null;
        }
      if (!c)
        break;
      a = c.toA, h = c.toA - c.toB;
    }
    return s;
  }
}
class Ja {
  /**
  Start a parse, returning a [partial parse](#common.PartialParse)
  object. [`fragments`](#common.TreeFragment) can be passed in to
  make the parse incremental.
  
  By default, the entire input is parsed. You can pass `ranges`,
  which should be a sorted array of non-empty, non-overlapping
  ranges, to parse only those ranges. The tree returned in that
  case will start at `ranges[0].from`.
  */
  startParse(e, t, i) {
    return typeof e == "string" && (e = new bu(e)), i = i ? i.length ? i.map((s) => new Vs(s.from, s.to)) : [new Vs(0, 0)] : [new Vs(0, e.length)], this.createParse(e, t || [], i);
  }
  /**
  Run a full parse, returning the resulting tree.
  */
  parse(e, t, i) {
    let s = this.startParse(e, t, i);
    for (; ; ) {
      let r = s.advance();
      if (r)
        return r;
    }
  }
}
let bu = class {
  constructor(e) {
    this.string = e;
  }
  get length() {
    return this.string.length;
  }
  chunk(e) {
    return this.string.slice(e);
  }
  get lineChunks() {
    return !1;
  }
  read(e, t) {
    return this.string.slice(e, t);
  }
};
new V({ perNode: !0 });
class zn {
  /**
  @internal
  */
  constructor(e, t, i, s, r, o, l, a, h, c = 0, f) {
    this.p = e, this.stack = t, this.state = i, this.reducePos = s, this.pos = r, this.score = o, this.buffer = l, this.bufferBase = a, this.curContext = h, this.lookAhead = c, this.parent = f;
  }
  /**
  @internal
  */
  toString() {
    return `[${this.stack.filter((e, t) => t % 3 == 0).concat(this.state)}]@${this.pos}${this.score ? "!" + this.score : ""}`;
  }
  // Start an empty stack
  /**
  @internal
  */
  static start(e, t, i = 0) {
    let s = e.parser.context;
    return new zn(e, [], t, i, i, 0, [], 0, s ? new Yo(s, s.start) : null, 0, null);
  }
  /**
  The stack's current [context](#lr.ContextTracker) value, if
  any. Its type will depend on the context tracker's type
  parameter, or it will be `null` if there is no context
  tracker.
  */
  get context() {
    return this.curContext ? this.curContext.context : null;
  }
  // Push a state onto the stack, tracking its start position as well
  // as the buffer base at that point.
  /**
  @internal
  */
  pushState(e, t) {
    this.stack.push(this.state, t, this.bufferBase + this.buffer.length), this.state = e;
  }
  // Apply a reduce action
  /**
  @internal
  */
  reduce(e) {
    var t;
    let i = e >> 19, s = e & 65535, { parser: r } = this.p, o = r.dynamicPrecedence(s);
    if (o && (this.score += o), i == 0) {
      this.pushState(r.getGoto(this.state, s, !0), this.reducePos), s < r.minRepeatTerm && this.storeNode(s, this.reducePos, this.reducePos, 4, !0), this.reduceContext(s, this.reducePos);
      return;
    }
    let l = this.stack.length - (i - 1) * 3 - (e & 262144 ? 6 : 0), a = l ? this.stack[l - 2] : this.p.ranges[0].from, h = this.reducePos - a;
    h >= 2e3 && !(!((t = this.p.parser.nodeSet.types[s]) === null || t === void 0) && t.isAnonymous) && (a == this.p.lastBigReductionStart ? (this.p.bigReductionCount++, this.p.lastBigReductionSize = h) : this.p.lastBigReductionSize < h && (this.p.bigReductionCount = 1, this.p.lastBigReductionStart = a, this.p.lastBigReductionSize = h));
    let c = l ? this.stack[l - 1] : 0, f = this.bufferBase + this.buffer.length - c;
    if (s < r.minRepeatTerm || e & 131072) {
      let u = r.stateFlag(
        this.state,
        1
        /* StateFlag.Skipped */
      ) ? this.pos : this.reducePos;
      this.storeNode(s, a, u, f + 4, !0);
    }
    if (e & 262144)
      this.state = this.stack[l];
    else {
      let u = this.stack[l - 3];
      this.state = r.getGoto(u, s, !0);
    }
    for (; this.stack.length > l; )
      this.stack.pop();
    this.reduceContext(s, a);
  }
  // Shift a value into the buffer
  /**
  @internal
  */
  storeNode(e, t, i, s = 4, r = !1) {
    if (e == 0 && (!this.stack.length || this.stack[this.stack.length - 1] < this.buffer.length + this.bufferBase)) {
      let o = this, l = this.buffer.length;
      if (l == 0 && o.parent && (l = o.bufferBase - o.parent.bufferBase, o = o.parent), l > 0 && o.buffer[l - 4] == 0 && o.buffer[l - 1] > -1) {
        if (t == i)
          return;
        if (o.buffer[l - 2] >= t) {
          o.buffer[l - 2] = i;
          return;
        }
      }
    }
    if (!r || this.pos == i)
      this.buffer.push(e, t, i, s);
    else {
      let o = this.buffer.length;
      if (o > 0 && this.buffer[o - 4] != 0)
        for (; o > 0 && this.buffer[o - 2] > i; )
          this.buffer[o] = this.buffer[o - 4], this.buffer[o + 1] = this.buffer[o - 3], this.buffer[o + 2] = this.buffer[o - 2], this.buffer[o + 3] = this.buffer[o - 1], o -= 4, s > 4 && (s -= 4);
      this.buffer[o] = e, this.buffer[o + 1] = t, this.buffer[o + 2] = i, this.buffer[o + 3] = s;
    }
  }
  // Apply a shift action
  /**
  @internal
  */
  shift(e, t, i) {
    let s = this.pos;
    if (e & 131072)
      this.pushState(e & 65535, this.pos);
    else if (e & 262144)
      this.pos = i, this.shiftContext(t, s), t <= this.p.parser.maxNode && this.buffer.push(t, s, i, 4);
    else {
      let r = e, { parser: o } = this.p;
      (i > this.pos || t <= o.maxNode) && (this.pos = i, o.stateFlag(
        r,
        1
        /* StateFlag.Skipped */
      ) || (this.reducePos = i)), this.pushState(r, s), this.shiftContext(t, s), t <= o.maxNode && this.buffer.push(t, s, i, 4);
    }
  }
  // Apply an action
  /**
  @internal
  */
  apply(e, t, i) {
    e & 65536 ? this.reduce(e) : this.shift(e, t, i);
  }
  // Add a prebuilt (reused) node into the buffer.
  /**
  @internal
  */
  useNode(e, t) {
    let i = this.p.reused.length - 1;
    (i < 0 || this.p.reused[i] != e) && (this.p.reused.push(e), i++);
    let s = this.pos;
    this.reducePos = this.pos = s + e.length, this.pushState(t, s), this.buffer.push(
      i,
      s,
      this.reducePos,
      -1
      /* size == -1 means this is a reused value */
    ), this.curContext && this.updateContext(this.curContext.tracker.reuse(this.curContext.context, e, this, this.p.stream.reset(this.pos - e.length)));
  }
  // Split the stack. Due to the buffer sharing and the fact
  // that `this.stack` tends to stay quite shallow, this isn't very
  // expensive.
  /**
  @internal
  */
  split() {
    let e = this, t = e.buffer.length;
    for (; t > 0 && e.buffer[t - 2] > e.reducePos; )
      t -= 4;
    let i = e.buffer.slice(t), s = e.bufferBase + t;
    for (; e && s == e.bufferBase; )
      e = e.parent;
    return new zn(this.p, this.stack.slice(), this.state, this.reducePos, this.pos, this.score, i, s, this.curContext, this.lookAhead, e);
  }
  // Try to recover from an error by 'deleting' (ignoring) one token.
  /**
  @internal
  */
  recoverByDelete(e, t) {
    let i = e <= this.p.parser.maxNode;
    i && this.storeNode(e, this.pos, t, 4), this.storeNode(0, this.pos, t, i ? 8 : 4), this.pos = this.reducePos = t, this.score -= 190;
  }
  /**
  Check if the given term would be able to be shifted (optionally
  after some reductions) on this stack. This can be useful for
  external tokenizers that want to make sure they only provide a
  given token when it applies.
  */
  canShift(e) {
    for (let t = new yu(this); ; ) {
      let i = this.p.parser.stateSlot(
        t.state,
        4
        /* ParseState.DefaultReduce */
      ) || this.p.parser.hasAction(t.state, e);
      if (i == 0)
        return !1;
      if (!(i & 65536))
        return !0;
      t.reduce(i);
    }
  }
  // Apply up to Recover.MaxNext recovery actions that conceptually
  // inserts some missing token or rule.
  /**
  @internal
  */
  recoverByInsert(e) {
    if (this.stack.length >= 300)
      return [];
    let t = this.p.parser.nextStates(this.state);
    if (t.length > 8 || this.stack.length >= 120) {
      let s = [];
      for (let r = 0, o; r < t.length; r += 2)
        (o = t[r + 1]) != this.state && this.p.parser.hasAction(o, e) && s.push(t[r], o);
      if (this.stack.length < 120)
        for (let r = 0; s.length < 8 && r < t.length; r += 2) {
          let o = t[r + 1];
          s.some((l, a) => a & 1 && l == o) || s.push(t[r], o);
        }
      t = s;
    }
    let i = [];
    for (let s = 0; s < t.length && i.length < 4; s += 2) {
      let r = t[s + 1];
      if (r == this.state)
        continue;
      let o = this.split();
      o.pushState(r, this.pos), o.storeNode(0, o.pos, o.pos, 4, !0), o.shiftContext(t[s], this.pos), o.score -= 200, i.push(o);
    }
    return i;
  }
  // Force a reduce, if possible. Return false if that can't
  // be done.
  /**
  @internal
  */
  forceReduce() {
    let { parser: e } = this.p, t = e.stateSlot(
      this.state,
      5
      /* ParseState.ForcedReduce */
    );
    if (!(t & 65536))
      return !1;
    if (!e.validAction(this.state, t)) {
      let i = t >> 19, s = t & 65535, r = this.stack.length - i * 3;
      if (r < 0 || e.getGoto(this.stack[r], s, !1) < 0) {
        let o = this.findForcedReduction();
        if (o == null)
          return !1;
        t = o;
      }
      this.storeNode(0, this.pos, this.pos, 4, !0), this.score -= 100;
    }
    return this.reducePos = this.pos, this.reduce(t), !0;
  }
  /**
  Try to scan through the automaton to find some kind of reduction
  that can be applied. Used when the regular ForcedReduce field
  isn't a valid action. @internal
  */
  findForcedReduction() {
    let { parser: e } = this.p, t = [], i = (s, r) => {
      if (!t.includes(s))
        return t.push(s), e.allActions(s, (o) => {
          if (!(o & 393216))
            if (o & 65536) {
              let l = (o >> 19) - r;
              if (l > 1) {
                let a = o & 65535, h = this.stack.length - l * 3;
                if (h >= 0 && e.getGoto(this.stack[h], a, !1) >= 0)
                  return l << 19 | 65536 | a;
              }
            } else {
              let l = i(o, r + 1);
              if (l != null)
                return l;
            }
        });
    };
    return i(this.state, 0);
  }
  /**
  @internal
  */
  forceAll() {
    for (; !this.p.parser.stateFlag(
      this.state,
      2
      /* StateFlag.Accepting */
    ); )
      if (!this.forceReduce()) {
        this.storeNode(0, this.pos, this.pos, 4, !0);
        break;
      }
    return this;
  }
  /**
  Check whether this state has no further actions (assumed to be a direct descendant of the
  top state, since any other states must be able to continue
  somehow). @internal
  */
  get deadEnd() {
    if (this.stack.length != 3)
      return !1;
    let { parser: e } = this.p;
    return e.data[e.stateSlot(
      this.state,
      1
      /* ParseState.Actions */
    )] == 65535 && !e.stateSlot(
      this.state,
      4
      /* ParseState.DefaultReduce */
    );
  }
  /**
  Restart the stack (put it back in its start state). Only safe
  when this.stack.length == 3 (state is directly below the top
  state). @internal
  */
  restart() {
    this.state = this.stack[0], this.stack.length = 0;
  }
  /**
  @internal
  */
  sameState(e) {
    if (this.state != e.state || this.stack.length != e.stack.length)
      return !1;
    for (let t = 0; t < this.stack.length; t += 3)
      if (this.stack[t] != e.stack[t])
        return !1;
    return !0;
  }
  /**
  Get the parser used by this stack.
  */
  get parser() {
    return this.p.parser;
  }
  /**
  Test whether a given dialect (by numeric ID, as exported from
  the terms file) is enabled.
  */
  dialectEnabled(e) {
    return this.p.parser.dialect.flags[e];
  }
  shiftContext(e, t) {
    this.curContext && this.updateContext(this.curContext.tracker.shift(this.curContext.context, e, this, this.p.stream.reset(t)));
  }
  reduceContext(e, t) {
    this.curContext && this.updateContext(this.curContext.tracker.reduce(this.curContext.context, e, this, this.p.stream.reset(t)));
  }
  /**
  @internal
  */
  emitContext() {
    let e = this.buffer.length - 1;
    (e < 0 || this.buffer[e] != -3) && this.buffer.push(this.curContext.hash, this.pos, this.pos, -3);
  }
  /**
  @internal
  */
  emitLookAhead() {
    let e = this.buffer.length - 1;
    (e < 0 || this.buffer[e] != -4) && this.buffer.push(this.lookAhead, this.pos, this.pos, -4);
  }
  updateContext(e) {
    if (e != this.curContext.context) {
      let t = new Yo(this.curContext.tracker, e);
      t.hash != this.curContext.hash && this.emitContext(), this.curContext = t;
    }
  }
  /**
  @internal
  */
  setLookAhead(e) {
    e > this.lookAhead && (this.emitLookAhead(), this.lookAhead = e);
  }
  /**
  @internal
  */
  close() {
    this.curContext && this.curContext.tracker.strict && this.emitContext(), this.lookAhead > 0 && this.emitLookAhead();
  }
}
class Yo {
  constructor(e, t) {
    this.tracker = e, this.context = t, this.hash = e.strict ? e.hash(t) : 0;
  }
}
class yu {
  constructor(e) {
    this.start = e, this.state = e.state, this.stack = e.stack, this.base = this.stack.length;
  }
  reduce(e) {
    let t = e & 65535, i = e >> 19;
    i == 0 ? (this.stack == this.start.stack && (this.stack = this.stack.slice()), this.stack.push(this.state, 0, 0), this.base += 3) : this.base -= (i - 1) * 3;
    let s = this.start.p.parser.getGoto(this.stack[this.base - 3], t, !0);
    this.state = s;
  }
}
class Kn {
  constructor(e, t, i) {
    this.stack = e, this.pos = t, this.index = i, this.buffer = e.buffer, this.index == 0 && this.maybeNext();
  }
  static create(e, t = e.bufferBase + e.buffer.length) {
    return new Kn(e, t, t - e.bufferBase);
  }
  maybeNext() {
    let e = this.stack.parent;
    e != null && (this.index = this.stack.bufferBase - e.bufferBase, this.stack = e, this.buffer = e.buffer);
  }
  get id() {
    return this.buffer[this.index - 4];
  }
  get start() {
    return this.buffer[this.index - 3];
  }
  get end() {
    return this.buffer[this.index - 2];
  }
  get size() {
    return this.buffer[this.index - 1];
  }
  next() {
    this.index -= 4, this.pos -= 4, this.index == 0 && this.maybeNext();
  }
  fork() {
    return new Kn(this.stack, this.pos, this.index);
  }
}
function on(n, e = Uint16Array) {
  if (typeof n != "string")
    return n;
  let t = null;
  for (let i = 0, s = 0; i < n.length; ) {
    let r = 0;
    for (; ; ) {
      let o = n.charCodeAt(i++), l = !1;
      if (o == 126) {
        r = 65535;
        break;
      }
      o >= 92 && o--, o >= 34 && o--;
      let a = o - 32;
      if (a >= 46 && (a -= 46, l = !0), r += a, l)
        break;
      r *= 46;
    }
    t ? t[s++] = r : t = new e(r);
  }
  return t;
}
class Zn {
  constructor() {
    this.start = -1, this.value = -1, this.end = -1, this.extended = -1, this.lookAhead = 0, this.mask = 0, this.context = 0;
  }
}
const Jo = new Zn();
class xu {
  /**
  @internal
  */
  constructor(e, t) {
    this.input = e, this.ranges = t, this.chunk = "", this.chunkOff = 0, this.chunk2 = "", this.chunk2Pos = 0, this.next = -1, this.token = Jo, this.rangeIndex = 0, this.pos = this.chunkPos = t[0].from, this.range = t[0], this.end = t[t.length - 1].to, this.readNext();
  }
  /**
  @internal
  */
  resolveOffset(e, t) {
    let i = this.range, s = this.rangeIndex, r = this.pos + e;
    for (; r < i.from; ) {
      if (!s)
        return null;
      let o = this.ranges[--s];
      r -= i.from - o.to, i = o;
    }
    for (; t < 0 ? r > i.to : r >= i.to; ) {
      if (s == this.ranges.length - 1)
        return null;
      let o = this.ranges[++s];
      r += o.from - i.to, i = o;
    }
    return r;
  }
  /**
  @internal
  */
  clipPos(e) {
    if (e >= this.range.from && e < this.range.to)
      return e;
    for (let t of this.ranges)
      if (t.to > e)
        return Math.max(e, t.from);
    return this.end;
  }
  /**
  Look at a code unit near the stream position. `.peek(0)` equals
  `.next`, `.peek(-1)` gives you the previous character, and so
  on.
  
  Note that looking around during tokenizing creates dependencies
  on potentially far-away content, which may reduce the
  effectiveness incremental parsing—when looking forward—or even
  cause invalid reparses when looking backward more than 25 code
  units, since the library does not track lookbehind.
  */
  peek(e) {
    let t = this.chunkOff + e, i, s;
    if (t >= 0 && t < this.chunk.length)
      i = this.pos + e, s = this.chunk.charCodeAt(t);
    else {
      let r = this.resolveOffset(e, 1);
      if (r == null)
        return -1;
      if (i = r, i >= this.chunk2Pos && i < this.chunk2Pos + this.chunk2.length)
        s = this.chunk2.charCodeAt(i - this.chunk2Pos);
      else {
        let o = this.rangeIndex, l = this.range;
        for (; l.to <= i; )
          l = this.ranges[++o];
        this.chunk2 = this.input.chunk(this.chunk2Pos = i), i + this.chunk2.length > l.to && (this.chunk2 = this.chunk2.slice(0, l.to - i)), s = this.chunk2.charCodeAt(0);
      }
    }
    return i >= this.token.lookAhead && (this.token.lookAhead = i + 1), s;
  }
  /**
  Accept a token. By default, the end of the token is set to the
  current stream position, but you can pass an offset (relative to
  the stream position) to change that.
  */
  acceptToken(e, t = 0) {
    let i = t ? this.resolveOffset(t, -1) : this.pos;
    if (i == null || i < this.token.start)
      throw new RangeError("Token end out of bounds");
    this.token.value = e, this.token.end = i;
  }
  getChunk() {
    if (this.pos >= this.chunk2Pos && this.pos < this.chunk2Pos + this.chunk2.length) {
      let { chunk: e, chunkPos: t } = this;
      this.chunk = this.chunk2, this.chunkPos = this.chunk2Pos, this.chunk2 = e, this.chunk2Pos = t, this.chunkOff = this.pos - this.chunkPos;
    } else {
      this.chunk2 = this.chunk, this.chunk2Pos = this.chunkPos;
      let e = this.input.chunk(this.pos), t = this.pos + e.length;
      this.chunk = t > this.range.to ? e.slice(0, this.range.to - this.pos) : e, this.chunkPos = this.pos, this.chunkOff = 0;
    }
  }
  readNext() {
    return this.chunkOff >= this.chunk.length && (this.getChunk(), this.chunkOff == this.chunk.length) ? this.next = -1 : this.next = this.chunk.charCodeAt(this.chunkOff);
  }
  /**
  Move the stream forward N (defaults to 1) code units. Returns
  the new value of [`next`](#lr.InputStream.next).
  */
  advance(e = 1) {
    for (this.chunkOff += e; this.pos + e >= this.range.to; ) {
      if (this.rangeIndex == this.ranges.length - 1)
        return this.setDone();
      e -= this.range.to - this.pos, this.range = this.ranges[++this.rangeIndex], this.pos = this.range.from;
    }
    return this.pos += e, this.pos >= this.token.lookAhead && (this.token.lookAhead = this.pos + 1), this.readNext();
  }
  setDone() {
    return this.pos = this.chunkPos = this.end, this.range = this.ranges[this.rangeIndex = this.ranges.length - 1], this.chunk = "", this.next = -1;
  }
  /**
  @internal
  */
  reset(e, t) {
    if (t ? (this.token = t, t.start = e, t.lookAhead = e + 1, t.value = t.extended = -1) : this.token = Jo, this.pos != e) {
      if (this.pos = e, e == this.end)
        return this.setDone(), this;
      for (; e < this.range.from; )
        this.range = this.ranges[--this.rangeIndex];
      for (; e >= this.range.to; )
        this.range = this.ranges[++this.rangeIndex];
      e >= this.chunkPos && e < this.chunkPos + this.chunk.length ? this.chunkOff = e - this.chunkPos : (this.chunk = "", this.chunkOff = 0), this.readNext();
    }
    return this;
  }
  /**
  @internal
  */
  read(e, t) {
    if (e >= this.chunkPos && t <= this.chunkPos + this.chunk.length)
      return this.chunk.slice(e - this.chunkPos, t - this.chunkPos);
    if (e >= this.chunk2Pos && t <= this.chunk2Pos + this.chunk2.length)
      return this.chunk2.slice(e - this.chunk2Pos, t - this.chunk2Pos);
    if (e >= this.range.from && t <= this.range.to)
      return this.input.read(e, t);
    let i = "";
    for (let s of this.ranges) {
      if (s.from >= t)
        break;
      s.to > e && (i += this.input.read(Math.max(s.from, e), Math.min(s.to, t)));
    }
    return i;
  }
}
class jt {
  constructor(e, t) {
    this.data = e, this.id = t;
  }
  token(e, t) {
    let { parser: i } = t.p;
    wu(this.data, e, t, this.id, i.data, i.tokenPrecTable);
  }
}
jt.prototype.contextual = jt.prototype.fallback = jt.prototype.extend = !1;
jt.prototype.fallback = jt.prototype.extend = !1;
function wu(n, e, t, i, s, r) {
  let o = 0, l = 1 << i, { dialect: a } = t.p.parser;
  e:
    for (; l & n[o]; ) {
      let h = n[o + 1];
      for (let d = o + 3; d < h; d += 2)
        if ((n[d + 1] & l) > 0) {
          let p = n[d];
          if (a.allows(p) && (e.token.value == -1 || e.token.value == p || ku(p, e.token.value, s, r))) {
            e.acceptToken(p);
            break;
          }
        }
      let c = e.next, f = 0, u = n[o + 2];
      if (e.next < 0 && u > f && n[h + u * 3 - 3] == 65535 && n[h + u * 3 - 3] == 65535) {
        o = n[h + u * 3 - 1];
        continue e;
      }
      for (; f < u; ) {
        let d = f + u >> 1, p = h + d + (d << 1), g = n[p], m = n[p + 1] || 65536;
        if (c < g)
          u = d;
        else if (c >= m)
          f = d + 1;
        else {
          o = n[p + 2], e.advance();
          continue e;
        }
      }
      break;
    }
}
function Qo(n, e, t) {
  for (let i = e, s; (s = n[i]) != 65535; i++)
    if (s == t)
      return i - e;
  return -1;
}
function ku(n, e, t, i) {
  let s = Qo(t, i, e);
  return s < 0 || Qo(t, i, n) < s;
}
const Re = typeof process < "u" && process.env && /\bparse\b/.test(process.env.LOG);
let Bs = null;
function Uo(n, e, t) {
  let i = n.cursor(re.IncludeAnonymous);
  for (i.moveTo(e); ; )
    if (!(t < 0 ? i.childBefore(e) : i.childAfter(e)))
      for (; ; ) {
        if ((t < 0 ? i.to < e : i.from > e) && !i.type.isError)
          return t < 0 ? Math.max(0, Math.min(
            i.to - 1,
            e - 25
            /* Safety.Margin */
          )) : Math.min(n.length, Math.max(
            i.from + 1,
            e + 25
            /* Safety.Margin */
          ));
        if (t < 0 ? i.prevSibling() : i.nextSibling())
          break;
        if (!i.parent())
          return t < 0 ? 0 : n.length;
      }
}
class Su {
  constructor(e, t) {
    this.fragments = e, this.nodeSet = t, this.i = 0, this.fragment = null, this.safeFrom = -1, this.safeTo = -1, this.trees = [], this.start = [], this.index = [], this.nextFragment();
  }
  nextFragment() {
    let e = this.fragment = this.i == this.fragments.length ? null : this.fragments[this.i++];
    if (e) {
      for (this.safeFrom = e.openStart ? Uo(e.tree, e.from + e.offset, 1) - e.offset : e.from, this.safeTo = e.openEnd ? Uo(e.tree, e.to + e.offset, -1) - e.offset : e.to; this.trees.length; )
        this.trees.pop(), this.start.pop(), this.index.pop();
      this.trees.push(e.tree), this.start.push(-e.offset), this.index.push(0), this.nextStart = this.safeFrom;
    } else
      this.nextStart = 1e9;
  }
  // `pos` must be >= any previously given `pos` for this cursor
  nodeAt(e) {
    if (e < this.nextStart)
      return null;
    for (; this.fragment && this.safeTo <= e; )
      this.nextFragment();
    if (!this.fragment)
      return null;
    for (; ; ) {
      let t = this.trees.length - 1;
      if (t < 0)
        return this.nextFragment(), null;
      let i = this.trees[t], s = this.index[t];
      if (s == i.children.length) {
        this.trees.pop(), this.start.pop(), this.index.pop();
        continue;
      }
      let r = i.children[s], o = this.start[t] + i.positions[s];
      if (o > e)
        return this.nextStart = o, null;
      if (r instanceof j) {
        if (o == e) {
          if (o < this.safeFrom)
            return null;
          let l = o + r.length;
          if (l <= this.safeTo) {
            let a = r.prop(V.lookAhead);
            if (!a || l + a < this.fragment.to)
              return r;
          }
        }
        this.index[t]++, o + r.length >= Math.max(this.safeFrom, e) && (this.trees.push(r), this.start.push(o), this.index.push(0));
      } else
        this.index[t]++, this.nextStart = o + r.length;
    }
  }
}
class vu {
  constructor(e, t) {
    this.stream = t, this.tokens = [], this.mainToken = null, this.actions = [], this.tokens = e.tokenizers.map((i) => new Zn());
  }
  getActions(e) {
    let t = 0, i = null, { parser: s } = e.p, { tokenizers: r } = s, o = s.stateSlot(
      e.state,
      3
      /* ParseState.TokenizerMask */
    ), l = e.curContext ? e.curContext.hash : 0, a = 0;
    for (let h = 0; h < r.length; h++) {
      if (!(1 << h & o))
        continue;
      let c = r[h], f = this.tokens[h];
      if (!(i && !c.fallback) && ((c.contextual || f.start != e.pos || f.mask != o || f.context != l) && (this.updateCachedToken(f, c, e), f.mask = o, f.context = l), f.lookAhead > f.end + 25 && (a = Math.max(f.lookAhead, a)), f.value != 0)) {
        let u = t;
        if (f.extended > -1 && (t = this.addActions(e, f.extended, f.end, t)), t = this.addActions(e, f.value, f.end, t), !c.extend && (i = f, t > u))
          break;
      }
    }
    for (; this.actions.length > t; )
      this.actions.pop();
    return a && e.setLookAhead(a), !i && e.pos == this.stream.end && (i = new Zn(), i.value = e.p.parser.eofTerm, i.start = i.end = e.pos, t = this.addActions(e, i.value, i.end, t)), this.mainToken = i, this.actions;
  }
  getMainToken(e) {
    if (this.mainToken)
      return this.mainToken;
    let t = new Zn(), { pos: i, p: s } = e;
    return t.start = i, t.end = Math.min(i + 1, s.stream.end), t.value = i == s.stream.end ? s.parser.eofTerm : 0, t;
  }
  updateCachedToken(e, t, i) {
    let s = this.stream.clipPos(i.pos);
    if (t.token(this.stream.reset(s, e), i), e.value > -1) {
      let { parser: r } = i.p;
      for (let o = 0; o < r.specialized.length; o++)
        if (r.specialized[o] == e.value) {
          let l = r.specializers[o](this.stream.read(e.start, e.end), i);
          if (l >= 0 && i.p.parser.dialect.allows(l >> 1)) {
            l & 1 ? e.extended = l >> 1 : e.value = l >> 1;
            break;
          }
        }
    } else
      e.value = 0, e.end = this.stream.clipPos(s + 1);
  }
  putAction(e, t, i, s) {
    for (let r = 0; r < s; r += 3)
      if (this.actions[r] == e)
        return s;
    return this.actions[s++] = e, this.actions[s++] = t, this.actions[s++] = i, s;
  }
  addActions(e, t, i, s) {
    let { state: r } = e, { parser: o } = e.p, { data: l } = o;
    for (let a = 0; a < 2; a++)
      for (let h = o.stateSlot(
        r,
        a ? 2 : 1
        /* ParseState.Actions */
      ); ; h += 3) {
        if (l[h] == 65535)
          if (l[h + 1] == 1)
            h = nt(l, h + 2);
          else {
            s == 0 && l[h + 1] == 2 && (s = this.putAction(nt(l, h + 2), t, i, s));
            break;
          }
        l[h] == t && (s = this.putAction(nt(l, h + 1), t, i, s));
      }
    return s;
  }
}
class Cu {
  constructor(e, t, i, s) {
    this.parser = e, this.input = t, this.ranges = s, this.recovering = 0, this.nextStackID = 9812, this.minStackPos = 0, this.reused = [], this.stoppedAt = null, this.lastBigReductionStart = -1, this.lastBigReductionSize = 0, this.bigReductionCount = 0, this.stream = new xu(t, s), this.tokens = new vu(e, this.stream), this.topTerm = e.top[1];
    let { from: r } = s[0];
    this.stacks = [zn.start(this, e.top[0], r)], this.fragments = i.length && this.stream.end - r > e.bufferLength * 4 ? new Su(i, e.nodeSet) : null;
  }
  get parsedPos() {
    return this.minStackPos;
  }
  // Move the parser forward. This will process all parse stacks at
  // `this.pos` and try to advance them to a further position. If no
  // stack for such a position is found, it'll start error-recovery.
  //
  // When the parse is finished, this will return a syntax tree. When
  // not, it returns `null`.
  advance() {
    let e = this.stacks, t = this.minStackPos, i = this.stacks = [], s, r;
    if (this.bigReductionCount > 300 && e.length == 1) {
      let [o] = e;
      for (; o.forceReduce() && o.stack.length && o.stack[o.stack.length - 2] >= this.lastBigReductionStart; )
        ;
      this.bigReductionCount = this.lastBigReductionSize = 0;
    }
    for (let o = 0; o < e.length; o++) {
      let l = e[o];
      for (; ; ) {
        if (this.tokens.mainToken = null, l.pos > t)
          i.push(l);
        else {
          if (this.advanceStack(l, i, e))
            continue;
          {
            s || (s = [], r = []), s.push(l);
            let a = this.tokens.getMainToken(l);
            r.push(a.value, a.end);
          }
        }
        break;
      }
    }
    if (!i.length) {
      let o = s && Au(s);
      if (o)
        return Re && console.log("Finish with " + this.stackID(o)), this.stackToTree(o);
      if (this.parser.strict)
        throw Re && s && console.log("Stuck with token " + (this.tokens.mainToken ? this.parser.getName(this.tokens.mainToken.value) : "none")), new SyntaxError("No parse at " + t);
      this.recovering || (this.recovering = 5);
    }
    if (this.recovering && s) {
      let o = this.stoppedAt != null && s[0].pos > this.stoppedAt ? s[0] : this.runRecovery(s, r, i);
      if (o)
        return Re && console.log("Force-finish " + this.stackID(o)), this.stackToTree(o.forceAll());
    }
    if (this.recovering) {
      let o = this.recovering == 1 ? 1 : this.recovering * 3;
      if (i.length > o)
        for (i.sort((l, a) => a.score - l.score); i.length > o; )
          i.pop();
      i.some((l) => l.reducePos > t) && this.recovering--;
    } else if (i.length > 1) {
      e:
        for (let o = 0; o < i.length - 1; o++) {
          let l = i[o];
          for (let a = o + 1; a < i.length; a++) {
            let h = i[a];
            if (l.sameState(h) || l.buffer.length > 500 && h.buffer.length > 500)
              if ((l.score - h.score || l.buffer.length - h.buffer.length) > 0)
                i.splice(a--, 1);
              else {
                i.splice(o--, 1);
                continue e;
              }
          }
        }
      i.length > 12 && i.splice(
        12,
        i.length - 12
        /* Rec.MaxStackCount */
      );
    }
    this.minStackPos = i[0].pos;
    for (let o = 1; o < i.length; o++)
      i[o].pos < this.minStackPos && (this.minStackPos = i[o].pos);
    return null;
  }
  stopAt(e) {
    if (this.stoppedAt != null && this.stoppedAt < e)
      throw new RangeError("Can't move stoppedAt forward");
    this.stoppedAt = e;
  }
  // Returns an updated version of the given stack, or null if the
  // stack can't advance normally. When `split` and `stacks` are
  // given, stacks split off by ambiguous operations will be pushed to
  // `split`, or added to `stacks` if they move `pos` forward.
  advanceStack(e, t, i) {
    let s = e.pos, { parser: r } = this, o = Re ? this.stackID(e) + " -> " : "";
    if (this.stoppedAt != null && s > this.stoppedAt)
      return e.forceReduce() ? e : null;
    if (this.fragments) {
      let h = e.curContext && e.curContext.tracker.strict, c = h ? e.curContext.hash : 0;
      for (let f = this.fragments.nodeAt(s); f; ) {
        let u = this.parser.nodeSet.types[f.type.id] == f.type ? r.getGoto(e.state, f.type.id) : -1;
        if (u > -1 && f.length && (!h || (f.prop(V.contextHash) || 0) == c))
          return e.useNode(f, u), Re && console.log(o + this.stackID(e) + ` (via reuse of ${r.getName(f.type.id)})`), !0;
        if (!(f instanceof j) || f.children.length == 0 || f.positions[0] > 0)
          break;
        let d = f.children[0];
        if (d instanceof j && f.positions[0] == 0)
          f = d;
        else
          break;
      }
    }
    let l = r.stateSlot(
      e.state,
      4
      /* ParseState.DefaultReduce */
    );
    if (l > 0)
      return e.reduce(l), Re && console.log(o + this.stackID(e) + ` (via always-reduce ${r.getName(
        l & 65535
        /* Action.ValueMask */
      )})`), !0;
    if (e.stack.length >= 15e3)
      for (; e.stack.length > 9e3 && e.forceReduce(); )
        ;
    let a = this.tokens.getActions(e);
    for (let h = 0; h < a.length; ) {
      let c = a[h++], f = a[h++], u = a[h++], d = h == a.length || !i, p = d ? e : e.split();
      if (p.apply(c, f, u), Re && console.log(o + this.stackID(p) + ` (via ${c & 65536 ? `reduce of ${r.getName(
        c & 65535
        /* Action.ValueMask */
      )}` : "shift"} for ${r.getName(f)} @ ${s}${p == e ? "" : ", split"})`), d)
        return !0;
      p.pos > s ? t.push(p) : i.push(p);
    }
    return !1;
  }
  // Advance a given stack forward as far as it will go. Returns the
  // (possibly updated) stack if it got stuck, or null if it moved
  // forward and was given to `pushStackDedup`.
  advanceFully(e, t) {
    let i = e.pos;
    for (; ; ) {
      if (!this.advanceStack(e, null, null))
        return !1;
      if (e.pos > i)
        return $o(e, t), !0;
    }
  }
  runRecovery(e, t, i) {
    let s = null, r = !1;
    for (let o = 0; o < e.length; o++) {
      let l = e[o], a = t[o << 1], h = t[(o << 1) + 1], c = Re ? this.stackID(l) + " -> " : "";
      if (l.deadEnd && (r || (r = !0, l.restart(), Re && console.log(c + this.stackID(l) + " (restarted)"), this.advanceFully(l, i))))
        continue;
      let f = l.split(), u = c;
      for (let d = 0; f.forceReduce() && d < 10 && (Re && console.log(u + this.stackID(f) + " (via force-reduce)"), !this.advanceFully(f, i)); d++)
        Re && (u = this.stackID(f) + " -> ");
      for (let d of l.recoverByInsert(a))
        Re && console.log(c + this.stackID(d) + " (via recover-insert)"), this.advanceFully(d, i);
      this.stream.end > l.pos ? (h == l.pos && (h++, a = 0), l.recoverByDelete(a, h), Re && console.log(c + this.stackID(l) + ` (via recover-delete ${this.parser.getName(a)})`), $o(l, i)) : (!s || s.score < l.score) && (s = l);
    }
    return s;
  }
  // Convert the stack's buffer to a syntax tree.
  stackToTree(e) {
    return e.close(), j.build({
      buffer: Kn.create(e),
      nodeSet: this.parser.nodeSet,
      topID: this.topTerm,
      maxBufferLength: this.parser.bufferLength,
      reused: this.reused,
      start: this.ranges[0].from,
      length: e.pos - this.ranges[0].from,
      minRepeatType: this.parser.minRepeatTerm
    });
  }
  stackID(e) {
    let t = (Bs || (Bs = /* @__PURE__ */ new WeakMap())).get(e);
    return t || Bs.set(e, t = String.fromCodePoint(this.nextStackID++)), t + e;
  }
}
function $o(n, e) {
  for (let t = 0; t < e.length; t++) {
    let i = e[t];
    if (i.pos == n.pos && i.sameState(n)) {
      e[t].score < n.score && (e[t] = n);
      return;
    }
  }
  e.push(n);
}
class Ou {
  constructor(e, t, i) {
    this.source = e, this.flags = t, this.disabled = i;
  }
  allows(e) {
    return !this.disabled || this.disabled[e] == 0;
  }
}
class Yn extends Ja {
  /**
  @internal
  */
  constructor(e) {
    if (super(), this.wrappers = [], e.version != 14)
      throw new RangeError(`Parser version (${e.version}) doesn't match runtime version (14)`);
    let t = e.nodeNames.split(" ");
    this.minRepeatTerm = t.length;
    for (let l = 0; l < e.repeatNodeCount; l++)
      t.push("");
    let i = Object.keys(e.topRules).map((l) => e.topRules[l][1]), s = [];
    for (let l = 0; l < t.length; l++)
      s.push([]);
    function r(l, a, h) {
      s[l].push([a, a.deserialize(String(h))]);
    }
    if (e.nodeProps)
      for (let l of e.nodeProps) {
        let a = l[0];
        typeof a == "string" && (a = V[a]);
        for (let h = 1; h < l.length; ) {
          let c = l[h++];
          if (c >= 0)
            r(c, a, l[h++]);
          else {
            let f = l[h + -c];
            for (let u = -c; u > 0; u--)
              r(l[h++], a, f);
            h++;
          }
        }
      }
    this.nodeSet = new no(t.map((l, a) => Ae.define({
      name: a >= this.minRepeatTerm ? void 0 : l,
      id: a,
      props: s[a],
      top: i.indexOf(a) > -1,
      error: a == 0,
      skipped: e.skippedNodes && e.skippedNodes.indexOf(a) > -1
    }))), e.propSources && (this.nodeSet = this.nodeSet.extend(...e.propSources)), this.strict = !1, this.bufferLength = Fa;
    let o = on(e.tokenData);
    this.context = e.context, this.specializerSpecs = e.specialized || [], this.specialized = new Uint16Array(this.specializerSpecs.length);
    for (let l = 0; l < this.specializerSpecs.length; l++)
      this.specialized[l] = this.specializerSpecs[l].term;
    this.specializers = this.specializerSpecs.map(jo), this.states = on(e.states, Uint32Array), this.data = on(e.stateData), this.goto = on(e.goto), this.maxTerm = e.maxTerm, this.tokenizers = e.tokenizers.map((l) => typeof l == "number" ? new jt(o, l) : l), this.topRules = e.topRules, this.dialects = e.dialects || {}, this.dynamicPrecedences = e.dynamicPrecedences || null, this.tokenPrecTable = e.tokenPrec, this.termNames = e.termNames || null, this.maxNode = this.nodeSet.types.length - 1, this.dialect = this.parseDialect(), this.top = this.topRules[Object.keys(this.topRules)[0]];
  }
  createParse(e, t, i) {
    let s = new Cu(this, e, t, i);
    for (let r of this.wrappers)
      s = r(s, e, t, i);
    return s;
  }
  /**
  Get a goto table entry @internal
  */
  getGoto(e, t, i = !1) {
    let s = this.goto;
    if (t >= s[0])
      return -1;
    for (let r = s[t + 1]; ; ) {
      let o = s[r++], l = o & 1, a = s[r++];
      if (l && i)
        return a;
      for (let h = r + (o >> 1); r < h; r++)
        if (s[r] == e)
          return a;
      if (l)
        return -1;
    }
  }
  /**
  Check if this state has an action for a given terminal @internal
  */
  hasAction(e, t) {
    let i = this.data;
    for (let s = 0; s < 2; s++)
      for (let r = this.stateSlot(
        e,
        s ? 2 : 1
        /* ParseState.Actions */
      ), o; ; r += 3) {
        if ((o = i[r]) == 65535)
          if (i[r + 1] == 1)
            o = i[r = nt(i, r + 2)];
          else {
            if (i[r + 1] == 2)
              return nt(i, r + 2);
            break;
          }
        if (o == t || o == 0)
          return nt(i, r + 1);
      }
    return 0;
  }
  /**
  @internal
  */
  stateSlot(e, t) {
    return this.states[e * 6 + t];
  }
  /**
  @internal
  */
  stateFlag(e, t) {
    return (this.stateSlot(
      e,
      0
      /* ParseState.Flags */
    ) & t) > 0;
  }
  /**
  @internal
  */
  validAction(e, t) {
    return !!this.allActions(e, (i) => i == t ? !0 : null);
  }
  /**
  @internal
  */
  allActions(e, t) {
    let i = this.stateSlot(
      e,
      4
      /* ParseState.DefaultReduce */
    ), s = i ? t(i) : void 0;
    for (let r = this.stateSlot(
      e,
      1
      /* ParseState.Actions */
    ); s == null; r += 3) {
      if (this.data[r] == 65535)
        if (this.data[r + 1] == 1)
          r = nt(this.data, r + 2);
        else
          break;
      s = t(nt(this.data, r + 1));
    }
    return s;
  }
  /**
  Get the states that can follow this one through shift actions or
  goto jumps. @internal
  */
  nextStates(e) {
    let t = [];
    for (let i = this.stateSlot(
      e,
      1
      /* ParseState.Actions */
    ); ; i += 3) {
      if (this.data[i] == 65535)
        if (this.data[i + 1] == 1)
          i = nt(this.data, i + 2);
        else
          break;
      if (!(this.data[i + 2] & 1)) {
        let s = this.data[i + 1];
        t.some((r, o) => o & 1 && r == s) || t.push(this.data[i], s);
      }
    }
    return t;
  }
  /**
  Configure the parser. Returns a new parser instance that has the
  given settings modified. Settings not provided in `config` are
  kept from the original parser.
  */
  configure(e) {
    let t = Object.assign(Object.create(Yn.prototype), this);
    if (e.props && (t.nodeSet = this.nodeSet.extend(...e.props)), e.top) {
      let i = this.topRules[e.top];
      if (!i)
        throw new RangeError(`Invalid top rule name ${e.top}`);
      t.top = i;
    }
    return e.tokenizers && (t.tokenizers = this.tokenizers.map((i) => {
      let s = e.tokenizers.find((r) => r.from == i);
      return s ? s.to : i;
    })), e.specializers && (t.specializers = this.specializers.slice(), t.specializerSpecs = this.specializerSpecs.map((i, s) => {
      let r = e.specializers.find((l) => l.from == i.external);
      if (!r)
        return i;
      let o = Object.assign(Object.assign({}, i), { external: r.to });
      return t.specializers[s] = jo(o), o;
    })), e.contextTracker && (t.context = e.contextTracker), e.dialect && (t.dialect = this.parseDialect(e.dialect)), e.strict != null && (t.strict = e.strict), e.wrap && (t.wrappers = t.wrappers.concat(e.wrap)), e.bufferLength != null && (t.bufferLength = e.bufferLength), t;
  }
  /**
  Tells you whether any [parse wrappers](#lr.ParserConfig.wrap)
  are registered for this parser.
  */
  hasWrappers() {
    return this.wrappers.length > 0;
  }
  /**
  Returns the name associated with a given term. This will only
  work for all terms when the parser was generated with the
  `--names` option. By default, only the names of tagged terms are
  stored.
  */
  getName(e) {
    return this.termNames ? this.termNames[e] : String(e <= this.maxNode && this.nodeSet.types[e].name || e);
  }
  /**
  The eof term id is always allocated directly after the node
  types. @internal
  */
  get eofTerm() {
    return this.maxNode + 1;
  }
  /**
  The type of top node produced by the parser.
  */
  get topNode() {
    return this.nodeSet.types[this.top[1]];
  }
  /**
  @internal
  */
  dynamicPrecedence(e) {
    let t = this.dynamicPrecedences;
    return t == null ? 0 : t[e] || 0;
  }
  /**
  @internal
  */
  parseDialect(e) {
    let t = Object.keys(this.dialects), i = t.map(() => !1);
    if (e)
      for (let r of e.split(" ")) {
        let o = t.indexOf(r);
        o >= 0 && (i[o] = !0);
      }
    let s = null;
    for (let r = 0; r < t.length; r++)
      if (!i[r])
        for (let o = this.dialects[t[r]], l; (l = this.data[o++]) != 65535; )
          (s || (s = new Uint8Array(this.maxTerm + 1)))[l] = 1;
    return new Ou(e, i, s);
  }
  /**
  Used by the output of the parser generator. Not available to
  user code. @hide
  */
  static deserialize(e) {
    return new Yn(e);
  }
}
function nt(n, e) {
  return n[e] | n[e + 1] << 16;
}
function Au(n) {
  let e = null;
  for (let t of n) {
    let i = t.p.stoppedAt;
    (t.pos == t.p.stream.end || i != null && t.pos > i) && t.p.parser.stateFlag(
      t.state,
      2
      /* StateFlag.Accepting */
    ) && (!e || e.score < t.score) && (e = t);
  }
  return e;
}
function jo(n) {
  if (n.external) {
    let e = n.extend ? 1 : 0;
    return (t, i) => n.external(t, i) << 1 | e;
  }
  return n.get;
}
const Mu = { __proto__: null, let: 8, in: 16, if: 20, then: 22, else: 24, forall: 68 }, Ru = { __proto__: null, "=": 14, "\\": 28, λ: 28, "->": 32, "+": 36, "-": 36, "*": 38, "/": 38, ">": 40, ">=": 40, "<": 40, "<=": 40, "?": 118, "∀": 70, ".": 74, "==": 82, "<:": 84, "<<": 86 }, Zu = { __proto__: null, True: 44, False: 44 }, Lu = Yn.deserialize({
  version: 14,
  states: "*UOYQPOOOwQPOOOwQPOOOOQO'#Cb'#CbQ!]QPO'#CmOOQO'#Dd'#DdOYQPO'#DfO!hQPO'#D`OOQO'#D`'#D`O#]QPOOOOQO'#D_'#D_OrQPO'#C_OYQPO'#CeOrQPO'#CiOYQPO'#CqOOQO'#Cy'#CyOOQO'#C{'#C{OwQPO'#DkOOQO'#Dl'#DlO#zQPO'#C}OOQO'#Dh'#DhQ$PQPOOO$UQQO'#CzOOQO'#DU'#DUOOQO'#DZ'#DZQwQPOOO$ZQPO'#DmOYQPO,59XOOQO'#Dc'#DcO$iQPO,5:QO$wQPO,59aOOQO,59a,59aOwQPO,59dO%lQPO'#CaO%qQPO,58yO%vQPO,59PO&UQPO,59TO&ZQPO,59]O&xQPO,5:VOOQO'#DY'#DYO'QQPO,59iOwQPO,59hOOQO,59f,59fOOQO-E7X-E7XOwQPO,5:XOwQPO,5:YOwQPO,5:ZOOQO1G.s1G.sOOQO1G/l1G/lO'YQPO1G/OOYQPO,58{OYQPO1G.eOYQPO1G.kOYQPO1G.oOOQO'#Ck'#CkOOQO1G/q1G/qOOQO-E7W-E7WOwQPO1G/TOOQO'#DQ'#DQO'zQPO1G/SO)XQPO1G/sO)sQPO1G/tO*_QPO1G/uO*yQPO1G.gO+XQPO7+$PO+vQPO7+$VO,UQPO7+$ZO,sQPO7+$oOYQPO<<GqO.QQPOAN=]",
  stateData: ".r~O!QOSPOS~OSZOY[O^]Ob^OfTOgTOhTOjUO!TRO~OjaOrbOsbO!T_O!X`O!]fO~OblOclOdlO~OjUO!TROb!SXc!SXd!SX!O!SX!Z!SXk!SXZ!SXW!SX[!SX~O!ZpOb!RXc!RXd!RX!O!RXk!RXZ!RXW!RX[!RX~O!T_O~O`yO~O!^zO~O`yOy|Oz}O{!OO~OblOclOdlOk!QO~OjUO!TRObiaciadia!Oia!ZiakiaZiaWia[ia~OV!SO~OW!TO~OZ!UOblOclOdlO~O`!WO~OblOclOdlO!Oea!ZeakeaZeaWea[ea~O`yOk!XO~Ou![O!T_O~O`yObliclidli!OlikliZli!ZliWli[li~O`yO!Opiypizpi{pikpibpicpidpijpirpispi!Tpi!Xpi!]piZpi!ZpiWpi[pi~O`yOj!air!ais!ai!O!ai!T!ai!X!ai!]!ai~O`yOj!bir!bis!bi!O!bi!T!bi!X!bi!]!bi~O`yOj!cir!cis!ci!O!ci!T!ci!X!ci!]!ci~OblOclOdlOWTi~OblOclOdlO!ORq!ZRqkRqZRqWRq[Rq~O[!fOblOclOdlO~OblOclOdlO!O]q!Z]qk]qZ]qW]q[]q~O`yO!Oqqyqqzqq{qqkqqbqqcqqdqqjqqrqqsqq!Tqq!Xqq!]qqZqq!ZqqWqq[qq~OblOclOdlO!OX!R!ZX!RkX!RZX!RWX!R[X!R~OP!U~",
  goto: "'c!dPPP!eP!q!tPP!ePPP!eP#[P!ePPP!ePPP#_PP#o#{$]$]$]$]PP$iPPP$lPPP$p$vPPP$|%lPP%x!eP&TP&ePP$]'R'_'_'_eWOU[^k!S!T!U!V!fRrZdVOU[^k!S!T!U!V!fSnVnQqZRt]R!VtdWOU[^k!S!T!U!V!fToVneYOU[^k!S!T!U!V!fddPQaipy|}!O!ZTwcxedPQaipy|}!O!ZR!ZxThQiQxcR!YxQiQR{iQSOQmUQs[Qu^Q!PkQ!a!SQ!b!TQ!c!UQ!d!VR!g!feXOU[^k!S!T!U!V!fckSmsu!a!b!c!d!gdVOU[^k!S!T!U!V!fTnVnQePSjQiQvaQ!RpQ!]yQ!^|Q!_}Q!`!OR!e!ZecPQaipy|}!O!ZTgQi",
  nodeNames: "⚠ LineComment ExprLang LetExpr let Decl TermVar = in IfThenElse if then else Abs Lambda LambdaArrow -> BinaryExpr ArithOp ArithOp CmpOp UnaryExpr BooleanLiteral IntLiteral StringLiteral AppExpr ( ) TypeAnn TypeVar MetaVar TypeCon TypeArr Forall forall forall ForallDot . TypeLang UnifLang Constraint constraintOp constraintOp constraintOp",
  maxTerm: 65,
  skippedNodes: [0, 1],
  repeatNodeCount: 2,
  tokenData: "+|~RjXY!sYZ!s]^!spq!srs#Uxy$ryz$wz{$|{|$||}$|}!O&W!O!P$|!P!Q$|!Q![*Q![!]*v!^!_$|!_!`$|!`!a$|!a!b$|!b!c$|!c!}+U#O#P$|#R#S+i#T#o+i5s5t$|%&Y%&Z$|~!xS!Q~XY!sYZ!s]^!spq!s~#XVOr#Urs#ns#O#U#O#P#s#P;'S#U;'S;=`$l<%lO#U~#sOh~~#vRO;'S#U;'S;=`$P;=`O#U~$SWOr#Urs#ns#O#U#O#P#s#P;'S#U;'S;=`$l;=`<%l#U<%lO#U~$oP;=`<%l#U~$wOj~~$|Ok~~%R_!U~z{$|{|$||}$|}!O$|!O!P$|!P!Q$|![!]&Q!^!_$|!_!`$|!`!a$|!a!b$|!b!c$|#O#P$|5s5t$|%&Y%&Z$|~&TPst$|~&]_!U~z{$|{|$||}$|}!O'[!O!P$|!P!Q$|![!]&Q!^!_$|!_!`$|!`!a$|!a!b$|!b!c$|#O#P$|5s5t$|%&Y%&Z$|~'ciP~!U~OY)QZz)Qz{'[{|'[|}'[}!O'[!O!P'[!P!Q'[!Q![)Q![!])i!]!^)Q!^!_'[!_!`'[!`!a'[!a!b'[!b!c'[!c#O)Q#O#P'[#P5s)Q5s5t'[5t%&Y)Q%&Y%&Z'[%&Z;'S)Q;'S;=`)c<%lO)Q~)VSP~OY)QZ;'S)Q;'S;=`)c<%lO)Q~)fP;=`<%l)Q~)nUP~OY)QZs)Qst'[t;'S)Q;'S;=`)c<%lO)QR*XSgP!^Q!Q![*Q!c!}*e#R#S*e#T#o*eQ*jS!^Q!Q![*e!c!}*e#R#S*e#T#o*e~*yQst$|![!]+P~+UO!Z~R+]S!^Q!XP!Q![+U!c!}+U#R#S+U#T#o+UR+pS!^Q!TP!Q![+i!c!}+i#R#S+i#T#o+i",
  tokenizers: [0, 1],
  topRules: { ExprLang: [0, 2], TypeLang: [1, 38], UnifLang: [2, 39] },
  specialized: [{ term: 51, get: (n) => Mu[n] || -1 }, { term: 52, get: (n) => Ru[n] || -1 }, { term: 55, get: (n) => Zu[n] || -1 }],
  tokenPrec: 629
});
class E {
  /**
  Get the line description around the given position.
  */
  lineAt(e) {
    if (e < 0 || e > this.length)
      throw new RangeError(`Invalid position ${e} in document of length ${this.length}`);
    return this.lineInner(e, !1, 1, 0);
  }
  /**
  Get the description for the given (1-based) line number.
  */
  line(e) {
    if (e < 1 || e > this.lines)
      throw new RangeError(`Invalid line number ${e} in ${this.lines}-line document`);
    return this.lineInner(e, !0, 1, 0);
  }
  /**
  Replace a range of the text with the given content.
  */
  replace(e, t, i) {
    [e, t] = si(this, e, t);
    let s = [];
    return this.decompose(
      0,
      e,
      s,
      2
      /* Open.To */
    ), i.length && i.decompose(
      0,
      i.length,
      s,
      3
      /* Open.To */
    ), this.decompose(
      t,
      this.length,
      s,
      1
      /* Open.From */
    ), $e.from(s, this.length - (t - e) + i.length);
  }
  /**
  Append another document to this one.
  */
  append(e) {
    return this.replace(this.length, this.length, e);
  }
  /**
  Retrieve the text between the given points.
  */
  slice(e, t = this.length) {
    [e, t] = si(this, e, t);
    let i = [];
    return this.decompose(e, t, i, 0), $e.from(i, t - e);
  }
  /**
  Test whether this text is equal to another instance.
  */
  eq(e) {
    if (e == this)
      return !0;
    if (e.length != this.length || e.lines != this.lines)
      return !1;
    let t = this.scanIdentical(e, 1), i = this.length - this.scanIdentical(e, -1), s = new Oi(this), r = new Oi(e);
    for (let o = t, l = t; ; ) {
      if (s.next(o), r.next(o), o = 0, s.lineBreak != r.lineBreak || s.done != r.done || s.value != r.value)
        return !1;
      if (l += s.value.length, s.done || l >= i)
        return !0;
    }
  }
  /**
  Iterate over the text. When `dir` is `-1`, iteration happens
  from end to start. This will return lines and the breaks between
  them as separate strings.
  */
  iter(e = 1) {
    return new Oi(this, e);
  }
  /**
  Iterate over a range of the text. When `from` > `to`, the
  iterator will run in reverse.
  */
  iterRange(e, t = this.length) {
    return new Qa(this, e, t);
  }
  /**
  Return a cursor that iterates over the given range of lines,
  _without_ returning the line breaks between, and yielding empty
  strings for empty lines.
  
  When `from` and `to` are given, they should be 1-based line numbers.
  */
  iterLines(e, t) {
    let i;
    if (e == null)
      i = this.iter();
    else {
      t == null && (t = this.lines + 1);
      let s = this.line(e).from;
      i = this.iterRange(s, Math.max(s, t == this.lines + 1 ? this.length : t <= 1 ? 0 : this.line(t - 1).to));
    }
    return new Ua(i);
  }
  /**
  Return the document as a string, using newline characters to
  separate lines.
  */
  toString() {
    return this.sliceString(0);
  }
  /**
  Convert the document to an array of lines (which can be
  deserialized again via [`Text.of`](https://codemirror.net/6/docs/ref/#state.Text^of)).
  */
  toJSON() {
    let e = [];
    return this.flatten(e), e;
  }
  /**
  @internal
  */
  constructor() {
  }
  /**
  Create a `Text` instance for the given array of lines.
  */
  static of(e) {
    if (e.length == 0)
      throw new RangeError("A document must have at least one line");
    return e.length == 1 && !e[0] ? E.empty : e.length <= 32 ? new U(e) : $e.from(U.split(e, []));
  }
}
class U extends E {
  constructor(e, t = Tu(e)) {
    super(), this.text = e, this.length = t;
  }
  get lines() {
    return this.text.length;
  }
  get children() {
    return null;
  }
  lineInner(e, t, i, s) {
    for (let r = 0; ; r++) {
      let o = this.text[r], l = s + o.length;
      if ((t ? i : l) >= e)
        return new Du(s, l, i, o);
      s = l + 1, i++;
    }
  }
  decompose(e, t, i, s) {
    let r = e <= 0 && t >= this.length ? this : new U(qo(this.text, e, t), Math.min(t, this.length) - Math.max(0, e));
    if (s & 1) {
      let o = i.pop(), l = Ln(r.text, o.text.slice(), 0, r.length);
      if (l.length <= 32)
        i.push(new U(l, o.length + r.length));
      else {
        let a = l.length >> 1;
        i.push(new U(l.slice(0, a)), new U(l.slice(a)));
      }
    } else
      i.push(r);
  }
  replace(e, t, i) {
    if (!(i instanceof U))
      return super.replace(e, t, i);
    [e, t] = si(this, e, t);
    let s = Ln(this.text, Ln(i.text, qo(this.text, 0, e)), t), r = this.length + i.length - (t - e);
    return s.length <= 32 ? new U(s, r) : $e.from(U.split(s, []), r);
  }
  sliceString(e, t = this.length, i = `
`) {
    [e, t] = si(this, e, t);
    let s = "";
    for (let r = 0, o = 0; r <= t && o < this.text.length; o++) {
      let l = this.text[o], a = r + l.length;
      r > e && o && (s += i), e < a && t > r && (s += l.slice(Math.max(0, e - r), t - r)), r = a + 1;
    }
    return s;
  }
  flatten(e) {
    for (let t of this.text)
      e.push(t);
  }
  scanIdentical() {
    return 0;
  }
  static split(e, t) {
    let i = [], s = -1;
    for (let r of e)
      i.push(r), s += r.length + 1, i.length == 32 && (t.push(new U(i, s)), i = [], s = -1);
    return s > -1 && t.push(new U(i, s)), t;
  }
}
class $e extends E {
  constructor(e, t) {
    super(), this.children = e, this.length = t, this.lines = 0;
    for (let i of e)
      this.lines += i.lines;
  }
  lineInner(e, t, i, s) {
    for (let r = 0; ; r++) {
      let o = this.children[r], l = s + o.length, a = i + o.lines - 1;
      if ((t ? a : l) >= e)
        return o.lineInner(e, t, i, s);
      s = l + 1, i = a + 1;
    }
  }
  decompose(e, t, i, s) {
    for (let r = 0, o = 0; o <= t && r < this.children.length; r++) {
      let l = this.children[r], a = o + l.length;
      if (e <= a && t >= o) {
        let h = s & ((o <= e ? 1 : 0) | (a >= t ? 2 : 0));
        o >= e && a <= t && !h ? i.push(l) : l.decompose(e - o, t - o, i, h);
      }
      o = a + 1;
    }
  }
  replace(e, t, i) {
    if ([e, t] = si(this, e, t), i.lines < this.lines)
      for (let s = 0, r = 0; s < this.children.length; s++) {
        let o = this.children[s], l = r + o.length;
        if (e >= r && t <= l) {
          let a = o.replace(e - r, t - r, i), h = this.lines - o.lines + a.lines;
          if (a.lines < h >> 5 - 1 && a.lines > h >> 5 + 1) {
            let c = this.children.slice();
            return c[s] = a, new $e(c, this.length - (t - e) + i.length);
          }
          return super.replace(r, l, a);
        }
        r = l + 1;
      }
    return super.replace(e, t, i);
  }
  sliceString(e, t = this.length, i = `
`) {
    [e, t] = si(this, e, t);
    let s = "";
    for (let r = 0, o = 0; r < this.children.length && o <= t; r++) {
      let l = this.children[r], a = o + l.length;
      o > e && r && (s += i), e < a && t > o && (s += l.sliceString(e - o, t - o, i)), o = a + 1;
    }
    return s;
  }
  flatten(e) {
    for (let t of this.children)
      t.flatten(e);
  }
  scanIdentical(e, t) {
    if (!(e instanceof $e))
      return 0;
    let i = 0, [s, r, o, l] = t > 0 ? [0, 0, this.children.length, e.children.length] : [this.children.length - 1, e.children.length - 1, -1, -1];
    for (; ; s += t, r += t) {
      if (s == o || r == l)
        return i;
      let a = this.children[s], h = e.children[r];
      if (a != h)
        return i + a.scanIdentical(h, t);
      i += a.length + 1;
    }
  }
  static from(e, t = e.reduce((i, s) => i + s.length + 1, -1)) {
    let i = 0;
    for (let d of e)
      i += d.lines;
    if (i < 32) {
      let d = [];
      for (let p of e)
        p.flatten(d);
      return new U(d, t);
    }
    let s = Math.max(
      32,
      i >> 5
      /* Tree.BranchShift */
    ), r = s << 1, o = s >> 1, l = [], a = 0, h = -1, c = [];
    function f(d) {
      let p;
      if (d.lines > r && d instanceof $e)
        for (let g of d.children)
          f(g);
      else
        d.lines > o && (a > o || !a) ? (u(), l.push(d)) : d instanceof U && a && (p = c[c.length - 1]) instanceof U && d.lines + p.lines <= 32 ? (a += d.lines, h += d.length + 1, c[c.length - 1] = new U(p.text.concat(d.text), p.length + 1 + d.length)) : (a + d.lines > s && u(), a += d.lines, h += d.length + 1, c.push(d));
    }
    function u() {
      a != 0 && (l.push(c.length == 1 ? c[0] : $e.from(c, h)), h = -1, a = c.length = 0);
    }
    for (let d of e)
      f(d);
    return u(), l.length == 1 ? l[0] : new $e(l, t);
  }
}
E.empty = /* @__PURE__ */ new U([""], 0);
function Tu(n) {
  let e = -1;
  for (let t of n)
    e += t.length + 1;
  return e;
}
function Ln(n, e, t = 0, i = 1e9) {
  for (let s = 0, r = 0, o = !0; r < n.length && s <= i; r++) {
    let l = n[r], a = s + l.length;
    a >= t && (a > i && (l = l.slice(0, i - s)), s < t && (l = l.slice(t - s)), o ? (e[e.length - 1] += l, o = !1) : e.push(l)), s = a + 1;
  }
  return e;
}
function qo(n, e, t) {
  return Ln(n, [""], e, t);
}
class Oi {
  constructor(e, t = 1) {
    this.dir = t, this.done = !1, this.lineBreak = !1, this.value = "", this.nodes = [e], this.offsets = [t > 0 ? 1 : (e instanceof U ? e.text.length : e.children.length) << 1];
  }
  nextInner(e, t) {
    for (this.done = this.lineBreak = !1; ; ) {
      let i = this.nodes.length - 1, s = this.nodes[i], r = this.offsets[i], o = r >> 1, l = s instanceof U ? s.text.length : s.children.length;
      if (o == (t > 0 ? l : 0)) {
        if (i == 0)
          return this.done = !0, this.value = "", this;
        t > 0 && this.offsets[i - 1]++, this.nodes.pop(), this.offsets.pop();
      } else if ((r & 1) == (t > 0 ? 0 : 1)) {
        if (this.offsets[i] += t, e == 0)
          return this.lineBreak = !0, this.value = `
`, this;
        e--;
      } else if (s instanceof U) {
        let a = s.text[o + (t < 0 ? -1 : 0)];
        if (this.offsets[i] += t, a.length > Math.max(0, e))
          return this.value = e == 0 ? a : t > 0 ? a.slice(e) : a.slice(0, a.length - e), this;
        e -= a.length;
      } else {
        let a = s.children[o + (t < 0 ? -1 : 0)];
        e > a.length ? (e -= a.length, this.offsets[i] += t) : (t < 0 && this.offsets[i]--, this.nodes.push(a), this.offsets.push(t > 0 ? 1 : (a instanceof U ? a.text.length : a.children.length) << 1));
      }
    }
  }
  next(e = 0) {
    return e < 0 && (this.nextInner(-e, -this.dir), e = this.value.length), this.nextInner(e, this.dir);
  }
}
class Qa {
  constructor(e, t, i) {
    this.value = "", this.done = !1, this.cursor = new Oi(e, t > i ? -1 : 1), this.pos = t > i ? e.length : 0, this.from = Math.min(t, i), this.to = Math.max(t, i);
  }
  nextInner(e, t) {
    if (t < 0 ? this.pos <= this.from : this.pos >= this.to)
      return this.value = "", this.done = !0, this;
    e += Math.max(0, t < 0 ? this.pos - this.to : this.from - this.pos);
    let i = t < 0 ? this.pos - this.from : this.to - this.pos;
    e > i && (e = i), i -= e;
    let { value: s } = this.cursor.next(e);
    return this.pos += (s.length + e) * t, this.value = s.length <= i ? s : t < 0 ? s.slice(s.length - i) : s.slice(0, i), this.done = !this.value, this;
  }
  next(e = 0) {
    return e < 0 ? e = Math.max(e, this.from - this.pos) : e > 0 && (e = Math.min(e, this.to - this.pos)), this.nextInner(e, this.cursor.dir);
  }
  get lineBreak() {
    return this.cursor.lineBreak && this.value != "";
  }
}
class Ua {
  constructor(e) {
    this.inner = e, this.afterBreak = !0, this.value = "", this.done = !1;
  }
  next(e = 0) {
    let { done: t, lineBreak: i, value: s } = this.inner.next(e);
    return t && this.afterBreak ? (this.value = "", this.afterBreak = !1) : t ? (this.done = !0, this.value = "") : i ? this.afterBreak ? this.value = "" : (this.afterBreak = !0, this.next()) : (this.value = s, this.afterBreak = !1), this;
  }
  get lineBreak() {
    return !1;
  }
}
typeof Symbol < "u" && (E.prototype[Symbol.iterator] = function() {
  return this.iter();
}, Oi.prototype[Symbol.iterator] = Qa.prototype[Symbol.iterator] = Ua.prototype[Symbol.iterator] = function() {
  return this;
});
class Du {
  /**
  @internal
  */
  constructor(e, t, i, s) {
    this.from = e, this.to = t, this.number = i, this.text = s;
  }
  /**
  The length of the line (not including any line break after it).
  */
  get length() {
    return this.to - this.from;
  }
}
function si(n, e, t) {
  return e = Math.max(0, Math.min(n.length, e)), [e, Math.max(e, Math.min(n.length, t))];
}
let qt = /* @__PURE__ */ "lc,34,7n,7,7b,19,,,,2,,2,,,20,b,1c,l,g,,2t,7,2,6,2,2,,4,z,,u,r,2j,b,1m,9,9,,o,4,,9,,3,,5,17,3,3b,f,,w,1j,,,,4,8,4,,3,7,a,2,t,,1m,,,,2,4,8,,9,,a,2,q,,2,2,1l,,4,2,4,2,2,3,3,,u,2,3,,b,2,1l,,4,5,,2,4,,k,2,m,6,,,1m,,,2,,4,8,,7,3,a,2,u,,1n,,,,c,,9,,14,,3,,1l,3,5,3,,4,7,2,b,2,t,,1m,,2,,2,,3,,5,2,7,2,b,2,s,2,1l,2,,,2,4,8,,9,,a,2,t,,20,,4,,2,3,,,8,,29,,2,7,c,8,2q,,2,9,b,6,22,2,r,,,,,,1j,e,,5,,2,5,b,,10,9,,2u,4,,6,,2,2,2,p,2,4,3,g,4,d,,2,2,6,,f,,jj,3,qa,3,t,3,t,2,u,2,1s,2,,7,8,,2,b,9,,19,3,3b,2,y,,3a,3,4,2,9,,6,3,63,2,2,,1m,,,7,,,,,2,8,6,a,2,,1c,h,1r,4,1c,7,,,5,,14,9,c,2,w,4,2,2,,3,1k,,,2,3,,,3,1m,8,2,2,48,3,,d,,7,4,,6,,3,2,5i,1m,,5,ek,,5f,x,2da,3,3x,,2o,w,fe,6,2x,2,n9w,4,,a,w,2,28,2,7k,,3,,4,,p,2,5,,47,2,q,i,d,,12,8,p,b,1a,3,1c,,2,4,2,2,13,,1v,6,2,2,2,2,c,,8,,1b,,1f,,,3,2,2,5,2,,,16,2,8,,6m,,2,,4,,fn4,,kh,g,g,g,a6,2,gt,,6a,,45,5,1ae,3,,2,5,4,14,3,4,,4l,2,fx,4,ar,2,49,b,4w,,1i,f,1k,3,1d,4,2,2,1x,3,10,5,,8,1q,,c,2,1g,9,a,4,2,,2n,3,2,,,2,6,,4g,,3,8,l,2,1l,2,,,,,m,,e,7,3,5,5f,8,2,3,,,n,,29,,2,6,,,2,,,2,,2,6j,,2,4,6,2,,2,r,2,2d,8,2,,,2,2y,,,,2,6,,,2t,3,2,4,,5,77,9,,2,6t,,a,2,,,4,,40,4,2,2,4,,w,a,14,6,2,4,8,,9,6,2,3,1a,d,,2,ba,7,,6,,,2a,m,2,7,,2,,2,3e,6,3,,,2,,7,,,20,2,3,,,,9n,2,f0b,5,1n,7,t4,,1r,4,29,,f5k,2,43q,,,3,4,5,8,8,2,7,u,4,44,3,1iz,1j,4,1e,8,,e,,m,5,,f,11s,7,,h,2,7,,2,,5,79,7,c5,4,15s,7,31,7,240,5,gx7k,2o,3k,6o".split(",").map((n) => n ? parseInt(n, 36) : 1);
for (let n = 1; n < qt.length; n++)
  qt[n] += qt[n - 1];
function Pu(n) {
  for (let e = 1; e < qt.length; e += 2)
    if (qt[e] > n)
      return qt[e - 1] <= n;
  return !1;
}
function _o(n) {
  return n >= 127462 && n <= 127487;
}
const el = 8205;
function ce(n, e, t = !0, i = !0) {
  return (t ? $a : Vu)(n, e, i);
}
function $a(n, e, t) {
  if (e == n.length)
    return e;
  e && ja(n.charCodeAt(e)) && qa(n.charCodeAt(e - 1)) && e--;
  let i = le(n, e);
  for (e += We(i); e < n.length; ) {
    let s = le(n, e);
    if (i == el || s == el || t && Pu(s))
      e += We(s), i = s;
    else if (_o(s)) {
      let r = 0, o = e - 2;
      for (; o >= 0 && _o(le(n, o)); )
        r++, o -= 2;
      if (r % 2 == 0)
        break;
      e += 2;
    } else
      break;
  }
  return e;
}
function Vu(n, e, t) {
  for (; e > 0; ) {
    let i = $a(n, e - 2, t);
    if (i < e)
      return i;
    e--;
  }
  return 0;
}
function ja(n) {
  return n >= 56320 && n < 57344;
}
function qa(n) {
  return n >= 55296 && n < 56320;
}
function le(n, e) {
  let t = n.charCodeAt(e);
  if (!qa(t) || e + 1 == n.length)
    return t;
  let i = n.charCodeAt(e + 1);
  return ja(i) ? (t - 55296 << 10) + (i - 56320) + 65536 : t;
}
function lo(n) {
  return n <= 65535 ? String.fromCharCode(n) : (n -= 65536, String.fromCharCode((n >> 10) + 55296, (n & 1023) + 56320));
}
function We(n) {
  return n < 65536 ? 1 : 2;
}
const fr = /\r\n?|\n/;
var be = /* @__PURE__ */ function(n) {
  return n[n.Simple = 0] = "Simple", n[n.TrackDel = 1] = "TrackDel", n[n.TrackBefore = 2] = "TrackBefore", n[n.TrackAfter = 3] = "TrackAfter", n;
}(be || (be = {}));
class et {
  // Sections are encoded as pairs of integers. The first is the
  // length in the current document, and the second is -1 for
  // unaffected sections, and the length of the replacement content
  // otherwise. So an insertion would be (0, n>0), a deletion (n>0,
  // 0), and a replacement two positive numbers.
  /**
  @internal
  */
  constructor(e) {
    this.sections = e;
  }
  /**
  The length of the document before the change.
  */
  get length() {
    let e = 0;
    for (let t = 0; t < this.sections.length; t += 2)
      e += this.sections[t];
    return e;
  }
  /**
  The length of the document after the change.
  */
  get newLength() {
    let e = 0;
    for (let t = 0; t < this.sections.length; t += 2) {
      let i = this.sections[t + 1];
      e += i < 0 ? this.sections[t] : i;
    }
    return e;
  }
  /**
  False when there are actual changes in this set.
  */
  get empty() {
    return this.sections.length == 0 || this.sections.length == 2 && this.sections[1] < 0;
  }
  /**
  Iterate over the unchanged parts left by these changes. `posA`
  provides the position of the range in the old document, `posB`
  the new position in the changed document.
  */
  iterGaps(e) {
    for (let t = 0, i = 0, s = 0; t < this.sections.length; ) {
      let r = this.sections[t++], o = this.sections[t++];
      o < 0 ? (e(i, s, r), s += r) : s += o, i += r;
    }
  }
  /**
  Iterate over the ranges changed by these changes. (See
  [`ChangeSet.iterChanges`](https://codemirror.net/6/docs/ref/#state.ChangeSet.iterChanges) for a
  variant that also provides you with the inserted text.)
  `fromA`/`toA` provides the extent of the change in the starting
  document, `fromB`/`toB` the extent of the replacement in the
  changed document.
  
  When `individual` is true, adjacent changes (which are kept
  separate for [position mapping](https://codemirror.net/6/docs/ref/#state.ChangeDesc.mapPos)) are
  reported separately.
  */
  iterChangedRanges(e, t = !1) {
    ur(this, e, t);
  }
  /**
  Get a description of the inverted form of these changes.
  */
  get invertedDesc() {
    let e = [];
    for (let t = 0; t < this.sections.length; ) {
      let i = this.sections[t++], s = this.sections[t++];
      s < 0 ? e.push(i, s) : e.push(s, i);
    }
    return new et(e);
  }
  /**
  Compute the combined effect of applying another set of changes
  after this one. The length of the document after this set should
  match the length before `other`.
  */
  composeDesc(e) {
    return this.empty ? e : e.empty ? this : _a(this, e);
  }
  /**
  Map this description, which should start with the same document
  as `other`, over another set of changes, so that it can be
  applied after it. When `before` is true, map as if the changes
  in `other` happened before the ones in `this`.
  */
  mapDesc(e, t = !1) {
    return e.empty ? this : dr(this, e, t);
  }
  mapPos(e, t = -1, i = be.Simple) {
    let s = 0, r = 0;
    for (let o = 0; o < this.sections.length; ) {
      let l = this.sections[o++], a = this.sections[o++], h = s + l;
      if (a < 0) {
        if (h > e)
          return r + (e - s);
        r += l;
      } else {
        if (i != be.Simple && h >= e && (i == be.TrackDel && s < e && h > e || i == be.TrackBefore && s < e || i == be.TrackAfter && h > e))
          return null;
        if (h > e || h == e && t < 0 && !l)
          return e == s || t < 0 ? r : r + a;
        r += a;
      }
      s = h;
    }
    if (e > s)
      throw new RangeError(`Position ${e} is out of range for changeset of length ${s}`);
    return r;
  }
  /**
  Check whether these changes touch a given range. When one of the
  changes entirely covers the range, the string `"cover"` is
  returned.
  */
  touchesRange(e, t = e) {
    for (let i = 0, s = 0; i < this.sections.length && s <= t; ) {
      let r = this.sections[i++], o = this.sections[i++], l = s + r;
      if (o >= 0 && s <= t && l >= e)
        return s < e && l > t ? "cover" : !0;
      s = l;
    }
    return !1;
  }
  /**
  @internal
  */
  toString() {
    let e = "";
    for (let t = 0; t < this.sections.length; ) {
      let i = this.sections[t++], s = this.sections[t++];
      e += (e ? " " : "") + i + (s >= 0 ? ":" + s : "");
    }
    return e;
  }
  /**
  Serialize this change desc to a JSON-representable value.
  */
  toJSON() {
    return this.sections;
  }
  /**
  Create a change desc from its JSON representation (as produced
  by [`toJSON`](https://codemirror.net/6/docs/ref/#state.ChangeDesc.toJSON).
  */
  static fromJSON(e) {
    if (!Array.isArray(e) || e.length % 2 || e.some((t) => typeof t != "number"))
      throw new RangeError("Invalid JSON representation of ChangeDesc");
    return new et(e);
  }
  /**
  @internal
  */
  static create(e) {
    return new et(e);
  }
}
class ne extends et {
  constructor(e, t) {
    super(e), this.inserted = t;
  }
  /**
  Apply the changes to a document, returning the modified
  document.
  */
  apply(e) {
    if (this.length != e.length)
      throw new RangeError("Applying change set to a document with the wrong length");
    return ur(this, (t, i, s, r, o) => e = e.replace(s, s + (i - t), o), !1), e;
  }
  mapDesc(e, t = !1) {
    return dr(this, e, t, !0);
  }
  /**
  Given the document as it existed _before_ the changes, return a
  change set that represents the inverse of this set, which could
  be used to go from the document created by the changes back to
  the document as it existed before the changes.
  */
  invert(e) {
    let t = this.sections.slice(), i = [];
    for (let s = 0, r = 0; s < t.length; s += 2) {
      let o = t[s], l = t[s + 1];
      if (l >= 0) {
        t[s] = l, t[s + 1] = o;
        let a = s >> 1;
        for (; i.length < a; )
          i.push(E.empty);
        i.push(o ? e.slice(r, r + o) : E.empty);
      }
      r += o;
    }
    return new ne(t, i);
  }
  /**
  Combine two subsequent change sets into a single set. `other`
  must start in the document produced by `this`. If `this` goes
  `docA` → `docB` and `other` represents `docB` → `docC`, the
  returned value will represent the change `docA` → `docC`.
  */
  compose(e) {
    return this.empty ? e : e.empty ? this : _a(this, e, !0);
  }
  /**
  Given another change set starting in the same document, maps this
  change set over the other, producing a new change set that can be
  applied to the document produced by applying `other`. When
  `before` is `true`, order changes as if `this` comes before
  `other`, otherwise (the default) treat `other` as coming first.
  
  Given two changes `A` and `B`, `A.compose(B.map(A))` and
  `B.compose(A.map(B, true))` will produce the same document. This
  provides a basic form of [operational
  transformation](https://en.wikipedia.org/wiki/Operational_transformation),
  and can be used for collaborative editing.
  */
  map(e, t = !1) {
    return e.empty ? this : dr(this, e, t, !0);
  }
  /**
  Iterate over the changed ranges in the document, calling `f` for
  each, with the range in the original document (`fromA`-`toA`)
  and the range that replaces it in the new document
  (`fromB`-`toB`).
  
  When `individual` is true, adjacent changes are reported
  separately.
  */
  iterChanges(e, t = !1) {
    ur(this, e, t);
  }
  /**
  Get a [change description](https://codemirror.net/6/docs/ref/#state.ChangeDesc) for this change
  set.
  */
  get desc() {
    return et.create(this.sections);
  }
  /**
  @internal
  */
  filter(e) {
    let t = [], i = [], s = [], r = new Ti(this);
    e:
      for (let o = 0, l = 0; ; ) {
        let a = o == e.length ? 1e9 : e[o++];
        for (; l < a || l == a && r.len == 0; ) {
          if (r.done)
            break e;
          let c = Math.min(r.len, a - l);
          fe(s, c, -1);
          let f = r.ins == -1 ? -1 : r.off == 0 ? r.ins : 0;
          fe(t, c, f), f > 0 && pt(i, t, r.text), r.forward(c), l += c;
        }
        let h = e[o++];
        for (; l < h; ) {
          if (r.done)
            break e;
          let c = Math.min(r.len, h - l);
          fe(t, c, -1), fe(s, c, r.ins == -1 ? -1 : r.off == 0 ? r.ins : 0), r.forward(c), l += c;
        }
      }
    return {
      changes: new ne(t, i),
      filtered: et.create(s)
    };
  }
  /**
  Serialize this change set to a JSON-representable value.
  */
  toJSON() {
    let e = [];
    for (let t = 0; t < this.sections.length; t += 2) {
      let i = this.sections[t], s = this.sections[t + 1];
      s < 0 ? e.push(i) : s == 0 ? e.push([i]) : e.push([i].concat(this.inserted[t >> 1].toJSON()));
    }
    return e;
  }
  /**
  Create a change set for the given changes, for a document of the
  given length, using `lineSep` as line separator.
  */
  static of(e, t, i) {
    let s = [], r = [], o = 0, l = null;
    function a(c = !1) {
      if (!c && !s.length)
        return;
      o < t && fe(s, t - o, -1);
      let f = new ne(s, r);
      l = l ? l.compose(f.map(l)) : f, s = [], r = [], o = 0;
    }
    function h(c) {
      if (Array.isArray(c))
        for (let f of c)
          h(f);
      else if (c instanceof ne) {
        if (c.length != t)
          throw new RangeError(`Mismatched change set length (got ${c.length}, expected ${t})`);
        a(), l = l ? l.compose(c.map(l)) : c;
      } else {
        let { from: f, to: u = f, insert: d } = c;
        if (f > u || f < 0 || u > t)
          throw new RangeError(`Invalid change range ${f} to ${u} (in doc of length ${t})`);
        let p = d ? typeof d == "string" ? E.of(d.split(i || fr)) : d : E.empty, g = p.length;
        if (f == u && g == 0)
          return;
        f < o && a(), f > o && fe(s, f - o, -1), fe(s, u - f, g), pt(r, s, p), o = u;
      }
    }
    return h(e), a(!l), l;
  }
  /**
  Create an empty changeset of the given length.
  */
  static empty(e) {
    return new ne(e ? [e, -1] : [], []);
  }
  /**
  Create a changeset from its JSON representation (as produced by
  [`toJSON`](https://codemirror.net/6/docs/ref/#state.ChangeSet.toJSON).
  */
  static fromJSON(e) {
    if (!Array.isArray(e))
      throw new RangeError("Invalid JSON representation of ChangeSet");
    let t = [], i = [];
    for (let s = 0; s < e.length; s++) {
      let r = e[s];
      if (typeof r == "number")
        t.push(r, -1);
      else {
        if (!Array.isArray(r) || typeof r[0] != "number" || r.some((o, l) => l && typeof o != "string"))
          throw new RangeError("Invalid JSON representation of ChangeSet");
        if (r.length == 1)
          t.push(r[0], 0);
        else {
          for (; i.length < s; )
            i.push(E.empty);
          i[s] = E.of(r.slice(1)), t.push(r[0], i[s].length);
        }
      }
    }
    return new ne(t, i);
  }
  /**
  @internal
  */
  static createSet(e, t) {
    return new ne(e, t);
  }
}
function fe(n, e, t, i = !1) {
  if (e == 0 && t <= 0)
    return;
  let s = n.length - 2;
  s >= 0 && t <= 0 && t == n[s + 1] ? n[s] += e : e == 0 && n[s] == 0 ? n[s + 1] += t : i ? (n[s] += e, n[s + 1] += t) : n.push(e, t);
}
function pt(n, e, t) {
  if (t.length == 0)
    return;
  let i = e.length - 2 >> 1;
  if (i < n.length)
    n[n.length - 1] = n[n.length - 1].append(t);
  else {
    for (; n.length < i; )
      n.push(E.empty);
    n.push(t);
  }
}
function ur(n, e, t) {
  let i = n.inserted;
  for (let s = 0, r = 0, o = 0; o < n.sections.length; ) {
    let l = n.sections[o++], a = n.sections[o++];
    if (a < 0)
      s += l, r += l;
    else {
      let h = s, c = r, f = E.empty;
      for (; h += l, c += a, a && i && (f = f.append(i[o - 2 >> 1])), !(t || o == n.sections.length || n.sections[o + 1] < 0); )
        l = n.sections[o++], a = n.sections[o++];
      e(s, h, r, c, f), s = h, r = c;
    }
  }
}
function dr(n, e, t, i = !1) {
  let s = [], r = i ? [] : null, o = new Ti(n), l = new Ti(e);
  for (let a = -1; ; )
    if (o.ins == -1 && l.ins == -1) {
      let h = Math.min(o.len, l.len);
      fe(s, h, -1), o.forward(h), l.forward(h);
    } else if (l.ins >= 0 && (o.ins < 0 || a == o.i || o.off == 0 && (l.len < o.len || l.len == o.len && !t))) {
      let h = l.len;
      for (fe(s, l.ins, -1); h; ) {
        let c = Math.min(o.len, h);
        o.ins >= 0 && a < o.i && o.len <= c && (fe(s, 0, o.ins), r && pt(r, s, o.text), a = o.i), o.forward(c), h -= c;
      }
      l.next();
    } else if (o.ins >= 0) {
      let h = 0, c = o.len;
      for (; c; )
        if (l.ins == -1) {
          let f = Math.min(c, l.len);
          h += f, c -= f, l.forward(f);
        } else if (l.ins == 0 && l.len < c)
          c -= l.len, l.next();
        else
          break;
      fe(s, h, a < o.i ? o.ins : 0), r && a < o.i && pt(r, s, o.text), a = o.i, o.forward(o.len - c);
    } else {
      if (o.done && l.done)
        return r ? ne.createSet(s, r) : et.create(s);
      throw new Error("Mismatched change set lengths");
    }
}
function _a(n, e, t = !1) {
  let i = [], s = t ? [] : null, r = new Ti(n), o = new Ti(e);
  for (let l = !1; ; ) {
    if (r.done && o.done)
      return s ? ne.createSet(i, s) : et.create(i);
    if (r.ins == 0)
      fe(i, r.len, 0, l), r.next();
    else if (o.len == 0 && !o.done)
      fe(i, 0, o.ins, l), s && pt(s, i, o.text), o.next();
    else {
      if (r.done || o.done)
        throw new Error("Mismatched change set lengths");
      {
        let a = Math.min(r.len2, o.len), h = i.length;
        if (r.ins == -1) {
          let c = o.ins == -1 ? -1 : o.off ? 0 : o.ins;
          fe(i, a, c, l), s && c && pt(s, i, o.text);
        } else
          o.ins == -1 ? (fe(i, r.off ? 0 : r.len, a, l), s && pt(s, i, r.textBit(a))) : (fe(i, r.off ? 0 : r.len, o.off ? 0 : o.ins, l), s && !o.off && pt(s, i, o.text));
        l = (r.ins > a || o.ins >= 0 && o.len > a) && (l || i.length > h), r.forward2(a), o.forward(a);
      }
    }
  }
}
class Ti {
  constructor(e) {
    this.set = e, this.i = 0, this.next();
  }
  next() {
    let { sections: e } = this.set;
    this.i < e.length ? (this.len = e[this.i++], this.ins = e[this.i++]) : (this.len = 0, this.ins = -2), this.off = 0;
  }
  get done() {
    return this.ins == -2;
  }
  get len2() {
    return this.ins < 0 ? this.len : this.ins;
  }
  get text() {
    let { inserted: e } = this.set, t = this.i - 2 >> 1;
    return t >= e.length ? E.empty : e[t];
  }
  textBit(e) {
    let { inserted: t } = this.set, i = this.i - 2 >> 1;
    return i >= t.length && !e ? E.empty : t[i].slice(this.off, e == null ? void 0 : this.off + e);
  }
  forward(e) {
    e == this.len ? this.next() : (this.len -= e, this.off += e);
  }
  forward2(e) {
    this.ins == -1 ? this.forward(e) : e == this.ins ? this.next() : (this.ins -= e, this.off += e);
  }
}
class Pt {
  constructor(e, t, i) {
    this.from = e, this.to = t, this.flags = i;
  }
  /**
  The anchor of the range—the side that doesn't move when you
  extend it.
  */
  get anchor() {
    return this.flags & 32 ? this.to : this.from;
  }
  /**
  The head of the range, which is moved when the range is
  [extended](https://codemirror.net/6/docs/ref/#state.SelectionRange.extend).
  */
  get head() {
    return this.flags & 32 ? this.from : this.to;
  }
  /**
  True when `anchor` and `head` are at the same position.
  */
  get empty() {
    return this.from == this.to;
  }
  /**
  If this is a cursor that is explicitly associated with the
  character on one of its sides, this returns the side. -1 means
  the character before its position, 1 the character after, and 0
  means no association.
  */
  get assoc() {
    return this.flags & 8 ? -1 : this.flags & 16 ? 1 : 0;
  }
  /**
  The bidirectional text level associated with this cursor, if
  any.
  */
  get bidiLevel() {
    let e = this.flags & 7;
    return e == 7 ? null : e;
  }
  /**
  The goal column (stored vertical offset) associated with a
  cursor. This is used to preserve the vertical position when
  [moving](https://codemirror.net/6/docs/ref/#view.EditorView.moveVertically) across
  lines of different length.
  */
  get goalColumn() {
    let e = this.flags >> 6;
    return e == 16777215 ? void 0 : e;
  }
  /**
  Map this range through a change, producing a valid range in the
  updated document.
  */
  map(e, t = -1) {
    let i, s;
    return this.empty ? i = s = e.mapPos(this.from, t) : (i = e.mapPos(this.from, 1), s = e.mapPos(this.to, -1)), i == this.from && s == this.to ? this : new Pt(i, s, this.flags);
  }
  /**
  Extend this range to cover at least `from` to `to`.
  */
  extend(e, t = e) {
    if (e <= this.anchor && t >= this.anchor)
      return y.range(e, t);
    let i = Math.abs(e - this.anchor) > Math.abs(t - this.anchor) ? e : t;
    return y.range(this.anchor, i);
  }
  /**
  Compare this range to another range.
  */
  eq(e, t = !1) {
    return this.anchor == e.anchor && this.head == e.head && (!t || !this.empty || this.assoc == e.assoc);
  }
  /**
  Return a JSON-serializable object representing the range.
  */
  toJSON() {
    return { anchor: this.anchor, head: this.head };
  }
  /**
  Convert a JSON representation of a range to a `SelectionRange`
  instance.
  */
  static fromJSON(e) {
    if (!e || typeof e.anchor != "number" || typeof e.head != "number")
      throw new RangeError("Invalid JSON representation for SelectionRange");
    return y.range(e.anchor, e.head);
  }
  /**
  @internal
  */
  static create(e, t, i) {
    return new Pt(e, t, i);
  }
}
class y {
  constructor(e, t) {
    this.ranges = e, this.mainIndex = t;
  }
  /**
  Map a selection through a change. Used to adjust the selection
  position for changes.
  */
  map(e, t = -1) {
    return e.empty ? this : y.create(this.ranges.map((i) => i.map(e, t)), this.mainIndex);
  }
  /**
  Compare this selection to another selection. By default, ranges
  are compared only by position. When `includeAssoc` is true,
  cursor ranges must also have the same
  [`assoc`](https://codemirror.net/6/docs/ref/#state.SelectionRange.assoc) value.
  */
  eq(e, t = !1) {
    if (this.ranges.length != e.ranges.length || this.mainIndex != e.mainIndex)
      return !1;
    for (let i = 0; i < this.ranges.length; i++)
      if (!this.ranges[i].eq(e.ranges[i], t))
        return !1;
    return !0;
  }
  /**
  Get the primary selection range. Usually, you should make sure
  your code applies to _all_ ranges, by using methods like
  [`changeByRange`](https://codemirror.net/6/docs/ref/#state.EditorState.changeByRange).
  */
  get main() {
    return this.ranges[this.mainIndex];
  }
  /**
  Make sure the selection only has one range. Returns a selection
  holding only the main range from this selection.
  */
  asSingle() {
    return this.ranges.length == 1 ? this : new y([this.main], 0);
  }
  /**
  Extend this selection with an extra range.
  */
  addRange(e, t = !0) {
    return y.create([e].concat(this.ranges), t ? 0 : this.mainIndex + 1);
  }
  /**
  Replace a given range with another range, and then normalize the
  selection to merge and sort ranges if necessary.
  */
  replaceRange(e, t = this.mainIndex) {
    let i = this.ranges.slice();
    return i[t] = e, y.create(i, this.mainIndex);
  }
  /**
  Convert this selection to an object that can be serialized to
  JSON.
  */
  toJSON() {
    return { ranges: this.ranges.map((e) => e.toJSON()), main: this.mainIndex };
  }
  /**
  Create a selection from a JSON representation.
  */
  static fromJSON(e) {
    if (!e || !Array.isArray(e.ranges) || typeof e.main != "number" || e.main >= e.ranges.length)
      throw new RangeError("Invalid JSON representation for EditorSelection");
    return new y(e.ranges.map((t) => Pt.fromJSON(t)), e.main);
  }
  /**
  Create a selection holding a single range.
  */
  static single(e, t = e) {
    return new y([y.range(e, t)], 0);
  }
  /**
  Sort and merge the given set of ranges, creating a valid
  selection.
  */
  static create(e, t = 0) {
    if (e.length == 0)
      throw new RangeError("A selection needs at least one range");
    for (let i = 0, s = 0; s < e.length; s++) {
      let r = e[s];
      if (r.empty ? r.from <= i : r.from < i)
        return y.normalized(e.slice(), t);
      i = r.to;
    }
    return new y(e, t);
  }
  /**
  Create a cursor selection range at the given position. You can
  safely ignore the optional arguments in most situations.
  */
  static cursor(e, t = 0, i, s) {
    return Pt.create(e, e, (t == 0 ? 0 : t < 0 ? 8 : 16) | (i == null ? 7 : Math.min(6, i)) | (s ?? 16777215) << 6);
  }
  /**
  Create a selection range.
  */
  static range(e, t, i, s) {
    let r = (i ?? 16777215) << 6 | (s == null ? 7 : Math.min(6, s));
    return t < e ? Pt.create(t, e, 48 | r) : Pt.create(e, t, (t > e ? 8 : 0) | r);
  }
  /**
  @internal
  */
  static normalized(e, t = 0) {
    let i = e[t];
    e.sort((s, r) => s.from - r.from), t = e.indexOf(i);
    for (let s = 1; s < e.length; s++) {
      let r = e[s], o = e[s - 1];
      if (r.empty ? r.from <= o.to : r.from < o.to) {
        let l = o.from, a = Math.max(r.to, o.to);
        s <= t && t--, e.splice(--s, 2, r.anchor > r.head ? y.range(a, l) : y.range(l, a));
      }
    }
    return new y(e, t);
  }
}
function eh(n, e) {
  for (let t of n.ranges)
    if (t.to > e)
      throw new RangeError("Selection points outside of document");
}
let ao = 0;
class M {
  constructor(e, t, i, s, r) {
    this.combine = e, this.compareInput = t, this.compare = i, this.isStatic = s, this.id = ao++, this.default = e([]), this.extensions = typeof r == "function" ? r(this) : r;
  }
  /**
  Returns a facet reader for this facet, which can be used to
  [read](https://codemirror.net/6/docs/ref/#state.EditorState.facet) it but not to define values for it.
  */
  get reader() {
    return this;
  }
  /**
  Define a new facet.
  */
  static define(e = {}) {
    return new M(e.combine || ((t) => t), e.compareInput || ((t, i) => t === i), e.compare || (e.combine ? (t, i) => t === i : ho), !!e.static, e.enables);
  }
  /**
  Returns an extension that adds the given value to this facet.
  */
  of(e) {
    return new Tn([], this, 0, e);
  }
  /**
  Create an extension that computes a value for the facet from a
  state. You must take care to declare the parts of the state that
  this value depends on, since your function is only called again
  for a new state when one of those parts changed.
  
  In cases where your value depends only on a single field, you'll
  want to use the [`from`](https://codemirror.net/6/docs/ref/#state.Facet.from) method instead.
  */
  compute(e, t) {
    if (this.isStatic)
      throw new Error("Can't compute a static facet");
    return new Tn(e, this, 1, t);
  }
  /**
  Create an extension that computes zero or more values for this
  facet from a state.
  */
  computeN(e, t) {
    if (this.isStatic)
      throw new Error("Can't compute a static facet");
    return new Tn(e, this, 2, t);
  }
  from(e, t) {
    return t || (t = (i) => i), this.compute([e], (i) => t(i.field(e)));
  }
}
function ho(n, e) {
  return n == e || n.length == e.length && n.every((t, i) => t === e[i]);
}
class Tn {
  constructor(e, t, i, s) {
    this.dependencies = e, this.facet = t, this.type = i, this.value = s, this.id = ao++;
  }
  dynamicSlot(e) {
    var t;
    let i = this.value, s = this.facet.compareInput, r = this.id, o = e[r] >> 1, l = this.type == 2, a = !1, h = !1, c = [];
    for (let f of this.dependencies)
      f == "doc" ? a = !0 : f == "selection" ? h = !0 : ((t = e[f.id]) !== null && t !== void 0 ? t : 1) & 1 || c.push(e[f.id]);
    return {
      create(f) {
        return f.values[o] = i(f), 1;
      },
      update(f, u) {
        if (a && u.docChanged || h && (u.docChanged || u.selection) || pr(f, c)) {
          let d = i(f);
          if (l ? !tl(d, f.values[o], s) : !s(d, f.values[o]))
            return f.values[o] = d, 1;
        }
        return 0;
      },
      reconfigure: (f, u) => {
        let d, p = u.config.address[r];
        if (p != null) {
          let g = Qn(u, p);
          if (this.dependencies.every((m) => m instanceof M ? u.facet(m) === f.facet(m) : m instanceof ee ? u.field(m, !1) == f.field(m, !1) : !0) || (l ? tl(d = i(f), g, s) : s(d = i(f), g)))
            return f.values[o] = g, 0;
        } else
          d = i(f);
        return f.values[o] = d, 1;
      }
    };
  }
}
function tl(n, e, t) {
  if (n.length != e.length)
    return !1;
  for (let i = 0; i < n.length; i++)
    if (!t(n[i], e[i]))
      return !1;
  return !0;
}
function pr(n, e) {
  let t = !1;
  for (let i of e)
    Ai(n, i) & 1 && (t = !0);
  return t;
}
function Bu(n, e, t) {
  let i = t.map((a) => n[a.id]), s = t.map((a) => a.type), r = i.filter((a) => !(a & 1)), o = n[e.id] >> 1;
  function l(a) {
    let h = [];
    for (let c = 0; c < i.length; c++) {
      let f = Qn(a, i[c]);
      if (s[c] == 2)
        for (let u of f)
          h.push(u);
      else
        h.push(f);
    }
    return e.combine(h);
  }
  return {
    create(a) {
      for (let h of i)
        Ai(a, h);
      return a.values[o] = l(a), 1;
    },
    update(a, h) {
      if (!pr(a, r))
        return 0;
      let c = l(a);
      return e.compare(c, a.values[o]) ? 0 : (a.values[o] = c, 1);
    },
    reconfigure(a, h) {
      let c = pr(a, i), f = h.config.facets[e.id], u = h.facet(e);
      if (f && !c && ho(t, f))
        return a.values[o] = u, 0;
      let d = l(a);
      return e.compare(d, u) ? (a.values[o] = u, 0) : (a.values[o] = d, 1);
    }
  };
}
const il = /* @__PURE__ */ M.define({ static: !0 });
class ee {
  constructor(e, t, i, s, r) {
    this.id = e, this.createF = t, this.updateF = i, this.compareF = s, this.spec = r, this.provides = void 0;
  }
  /**
  Define a state field.
  */
  static define(e) {
    let t = new ee(ao++, e.create, e.update, e.compare || ((i, s) => i === s), e);
    return e.provide && (t.provides = e.provide(t)), t;
  }
  create(e) {
    let t = e.facet(il).find((i) => i.field == this);
    return ((t == null ? void 0 : t.create) || this.createF)(e);
  }
  /**
  @internal
  */
  slot(e) {
    let t = e[this.id] >> 1;
    return {
      create: (i) => (i.values[t] = this.create(i), 1),
      update: (i, s) => {
        let r = i.values[t], o = this.updateF(r, s);
        return this.compareF(r, o) ? 0 : (i.values[t] = o, 1);
      },
      reconfigure: (i, s) => s.config.address[this.id] != null ? (i.values[t] = s.field(this), 0) : (i.values[t] = this.create(i), 1)
    };
  }
  /**
  Returns an extension that enables this field and overrides the
  way it is initialized. Can be useful when you need to provide a
  non-default starting value for the field.
  */
  init(e) {
    return [this, il.of({ field: this, create: e })];
  }
  /**
  State field instances can be used as
  [`Extension`](https://codemirror.net/6/docs/ref/#state.Extension) values to enable the field in a
  given state.
  */
  get extension() {
    return this;
  }
}
const Tt = { lowest: 4, low: 3, default: 2, high: 1, highest: 0 };
function ui(n) {
  return (e) => new th(e, n);
}
const Gt = {
  /**
  The highest precedence level, for extensions that should end up
  near the start of the precedence ordering.
  */
  highest: /* @__PURE__ */ ui(Tt.highest),
  /**
  A higher-than-default precedence, for extensions that should
  come before those with default precedence.
  */
  high: /* @__PURE__ */ ui(Tt.high),
  /**
  The default precedence, which is also used for extensions
  without an explicit precedence.
  */
  default: /* @__PURE__ */ ui(Tt.default),
  /**
  A lower-than-default precedence.
  */
  low: /* @__PURE__ */ ui(Tt.low),
  /**
  The lowest precedence level. Meant for things that should end up
  near the end of the extension order.
  */
  lowest: /* @__PURE__ */ ui(Tt.lowest)
};
class th {
  constructor(e, t) {
    this.inner = e, this.prec = t;
  }
}
class ys {
  /**
  Create an instance of this compartment to add to your [state
  configuration](https://codemirror.net/6/docs/ref/#state.EditorStateConfig.extensions).
  */
  of(e) {
    return new mr(this, e);
  }
  /**
  Create an [effect](https://codemirror.net/6/docs/ref/#state.TransactionSpec.effects) that
  reconfigures this compartment.
  */
  reconfigure(e) {
    return ys.reconfigure.of({ compartment: this, extension: e });
  }
  /**
  Get the current content of the compartment in the state, or
  `undefined` if it isn't present.
  */
  get(e) {
    return e.config.compartments.get(this);
  }
}
class mr {
  constructor(e, t) {
    this.compartment = e, this.inner = t;
  }
}
class Jn {
  constructor(e, t, i, s, r, o) {
    for (this.base = e, this.compartments = t, this.dynamicSlots = i, this.address = s, this.staticValues = r, this.facets = o, this.statusTemplate = []; this.statusTemplate.length < i.length; )
      this.statusTemplate.push(
        0
        /* SlotStatus.Unresolved */
      );
  }
  staticFacet(e) {
    let t = this.address[e.id];
    return t == null ? e.default : this.staticValues[t >> 1];
  }
  static resolve(e, t, i) {
    let s = [], r = /* @__PURE__ */ Object.create(null), o = /* @__PURE__ */ new Map();
    for (let u of Wu(e, t, o))
      u instanceof ee ? s.push(u) : (r[u.facet.id] || (r[u.facet.id] = [])).push(u);
    let l = /* @__PURE__ */ Object.create(null), a = [], h = [];
    for (let u of s)
      l[u.id] = h.length << 1, h.push((d) => u.slot(d));
    let c = i == null ? void 0 : i.config.facets;
    for (let u in r) {
      let d = r[u], p = d[0].facet, g = c && c[u] || [];
      if (d.every(
        (m) => m.type == 0
        /* Provider.Static */
      ))
        if (l[p.id] = a.length << 1 | 1, ho(g, d))
          a.push(i.facet(p));
        else {
          let m = p.combine(d.map((b) => b.value));
          a.push(i && p.compare(m, i.facet(p)) ? i.facet(p) : m);
        }
      else {
        for (let m of d)
          m.type == 0 ? (l[m.id] = a.length << 1 | 1, a.push(m.value)) : (l[m.id] = h.length << 1, h.push((b) => m.dynamicSlot(b)));
        l[p.id] = h.length << 1, h.push((m) => Bu(m, p, d));
      }
    }
    let f = h.map((u) => u(l));
    return new Jn(e, o, f, l, a, r);
  }
}
function Wu(n, e, t) {
  let i = [[], [], [], [], []], s = /* @__PURE__ */ new Map();
  function r(o, l) {
    let a = s.get(o);
    if (a != null) {
      if (a <= l)
        return;
      let h = i[a].indexOf(o);
      h > -1 && i[a].splice(h, 1), o instanceof mr && t.delete(o.compartment);
    }
    if (s.set(o, l), Array.isArray(o))
      for (let h of o)
        r(h, l);
    else if (o instanceof mr) {
      if (t.has(o.compartment))
        throw new RangeError("Duplicate use of compartment in extensions");
      let h = e.get(o.compartment) || o.inner;
      t.set(o.compartment, h), r(h, l);
    } else if (o instanceof th)
      r(o.inner, o.prec);
    else if (o instanceof ee)
      i[l].push(o), o.provides && r(o.provides, l);
    else if (o instanceof Tn)
      i[l].push(o), o.facet.extensions && r(o.facet.extensions, Tt.default);
    else {
      let h = o.extension;
      if (!h)
        throw new Error(`Unrecognized extension value in extension set (${o}). This sometimes happens because multiple instances of @codemirror/state are loaded, breaking instanceof checks.`);
      r(h, l);
    }
  }
  return r(n, Tt.default), i.reduce((o, l) => o.concat(l));
}
function Ai(n, e) {
  if (e & 1)
    return 2;
  let t = e >> 1, i = n.status[t];
  if (i == 4)
    throw new Error("Cyclic dependency between fields and/or facets");
  if (i & 2)
    return i;
  n.status[t] = 4;
  let s = n.computeSlot(n, n.config.dynamicSlots[t]);
  return n.status[t] = 2 | s;
}
function Qn(n, e) {
  return e & 1 ? n.config.staticValues[e >> 1] : n.values[e >> 1];
}
const ih = /* @__PURE__ */ M.define(), gr = /* @__PURE__ */ M.define({
  combine: (n) => n.some((e) => e),
  static: !0
}), nh = /* @__PURE__ */ M.define({
  combine: (n) => n.length ? n[0] : void 0,
  static: !0
}), sh = /* @__PURE__ */ M.define(), rh = /* @__PURE__ */ M.define(), oh = /* @__PURE__ */ M.define(), lh = /* @__PURE__ */ M.define({
  combine: (n) => n.length ? n[0] : !1
});
class ht {
  /**
  @internal
  */
  constructor(e, t) {
    this.type = e, this.value = t;
  }
  /**
  Define a new type of annotation.
  */
  static define() {
    return new Xu();
  }
}
class Xu {
  /**
  Create an instance of this annotation.
  */
  of(e) {
    return new ht(this, e);
  }
}
class Iu {
  /**
  @internal
  */
  constructor(e) {
    this.map = e;
  }
  /**
  Create a [state effect](https://codemirror.net/6/docs/ref/#state.StateEffect) instance of this
  type.
  */
  of(e) {
    return new L(this, e);
  }
}
class L {
  /**
  @internal
  */
  constructor(e, t) {
    this.type = e, this.value = t;
  }
  /**
  Map this effect through a position mapping. Will return
  `undefined` when that ends up deleting the effect.
  */
  map(e) {
    let t = this.type.map(this.value, e);
    return t === void 0 ? void 0 : t == this.value ? this : new L(this.type, t);
  }
  /**
  Tells you whether this effect object is of a given
  [type](https://codemirror.net/6/docs/ref/#state.StateEffectType).
  */
  is(e) {
    return this.type == e;
  }
  /**
  Define a new effect type. The type parameter indicates the type
  of values that his effect holds. It should be a type that
  doesn't include `undefined`, since that is used in
  [mapping](https://codemirror.net/6/docs/ref/#state.StateEffect.map) to indicate that an effect is
  removed.
  */
  static define(e = {}) {
    return new Iu(e.map || ((t) => t));
  }
  /**
  Map an array of effects through a change set.
  */
  static mapEffects(e, t) {
    if (!e.length)
      return e;
    let i = [];
    for (let s of e) {
      let r = s.map(t);
      r && i.push(r);
    }
    return i;
  }
}
L.reconfigure = /* @__PURE__ */ L.define();
L.appendConfig = /* @__PURE__ */ L.define();
class se {
  constructor(e, t, i, s, r, o) {
    this.startState = e, this.changes = t, this.selection = i, this.effects = s, this.annotations = r, this.scrollIntoView = o, this._doc = null, this._state = null, i && eh(i, t.newLength), r.some((l) => l.type == se.time) || (this.annotations = r.concat(se.time.of(Date.now())));
  }
  /**
  @internal
  */
  static create(e, t, i, s, r, o) {
    return new se(e, t, i, s, r, o);
  }
  /**
  The new document produced by the transaction. Contrary to
  [`.state`](https://codemirror.net/6/docs/ref/#state.Transaction.state)`.doc`, accessing this won't
  force the entire new state to be computed right away, so it is
  recommended that [transaction
  filters](https://codemirror.net/6/docs/ref/#state.EditorState^transactionFilter) use this getter
  when they need to look at the new document.
  */
  get newDoc() {
    return this._doc || (this._doc = this.changes.apply(this.startState.doc));
  }
  /**
  The new selection produced by the transaction. If
  [`this.selection`](https://codemirror.net/6/docs/ref/#state.Transaction.selection) is undefined,
  this will [map](https://codemirror.net/6/docs/ref/#state.EditorSelection.map) the start state's
  current selection through the changes made by the transaction.
  */
  get newSelection() {
    return this.selection || this.startState.selection.map(this.changes);
  }
  /**
  The new state created by the transaction. Computed on demand
  (but retained for subsequent access), so it is recommended not to
  access it in [transaction
  filters](https://codemirror.net/6/docs/ref/#state.EditorState^transactionFilter) when possible.
  */
  get state() {
    return this._state || this.startState.applyTransaction(this), this._state;
  }
  /**
  Get the value of the given annotation type, if any.
  */
  annotation(e) {
    for (let t of this.annotations)
      if (t.type == e)
        return t.value;
  }
  /**
  Indicates whether the transaction changed the document.
  */
  get docChanged() {
    return !this.changes.empty;
  }
  /**
  Indicates whether this transaction reconfigures the state
  (through a [configuration compartment](https://codemirror.net/6/docs/ref/#state.Compartment) or
  with a top-level configuration
  [effect](https://codemirror.net/6/docs/ref/#state.StateEffect^reconfigure).
  */
  get reconfigured() {
    return this.startState.config != this.state.config;
  }
  /**
  Returns true if the transaction has a [user
  event](https://codemirror.net/6/docs/ref/#state.Transaction^userEvent) annotation that is equal to
  or more specific than `event`. For example, if the transaction
  has `"select.pointer"` as user event, `"select"` and
  `"select.pointer"` will match it.
  */
  isUserEvent(e) {
    let t = this.annotation(se.userEvent);
    return !!(t && (t == e || t.length > e.length && t.slice(0, e.length) == e && t[e.length] == "."));
  }
}
se.time = /* @__PURE__ */ ht.define();
se.userEvent = /* @__PURE__ */ ht.define();
se.addToHistory = /* @__PURE__ */ ht.define();
se.remote = /* @__PURE__ */ ht.define();
function Eu(n, e) {
  let t = [];
  for (let i = 0, s = 0; ; ) {
    let r, o;
    if (i < n.length && (s == e.length || e[s] >= n[i]))
      r = n[i++], o = n[i++];
    else if (s < e.length)
      r = e[s++], o = e[s++];
    else
      return t;
    !t.length || t[t.length - 1] < r ? t.push(r, o) : t[t.length - 1] < o && (t[t.length - 1] = o);
  }
}
function ah(n, e, t) {
  var i;
  let s, r, o;
  return t ? (s = e.changes, r = ne.empty(e.changes.length), o = n.changes.compose(e.changes)) : (s = e.changes.map(n.changes), r = n.changes.mapDesc(e.changes, !0), o = n.changes.compose(s)), {
    changes: o,
    selection: e.selection ? e.selection.map(r) : (i = n.selection) === null || i === void 0 ? void 0 : i.map(s),
    effects: L.mapEffects(n.effects, s).concat(L.mapEffects(e.effects, r)),
    annotations: n.annotations.length ? n.annotations.concat(e.annotations) : e.annotations,
    scrollIntoView: n.scrollIntoView || e.scrollIntoView
  };
}
function br(n, e, t) {
  let i = e.selection, s = _t(e.annotations);
  return e.userEvent && (s = s.concat(se.userEvent.of(e.userEvent))), {
    changes: e.changes instanceof ne ? e.changes : ne.of(e.changes || [], t, n.facet(nh)),
    selection: i && (i instanceof y ? i : y.single(i.anchor, i.head)),
    effects: _t(e.effects),
    annotations: s,
    scrollIntoView: !!e.scrollIntoView
  };
}
function hh(n, e, t) {
  let i = br(n, e.length ? e[0] : {}, n.doc.length);
  e.length && e[0].filter === !1 && (t = !1);
  for (let r = 1; r < e.length; r++) {
    e[r].filter === !1 && (t = !1);
    let o = !!e[r].sequential;
    i = ah(i, br(n, e[r], o ? i.changes.newLength : n.doc.length), o);
  }
  let s = se.create(n, i.changes, i.selection, i.effects, i.annotations, i.scrollIntoView);
  return Gu(t ? Nu(s) : s);
}
function Nu(n) {
  let e = n.startState, t = !0;
  for (let s of e.facet(sh)) {
    let r = s(n);
    if (r === !1) {
      t = !1;
      break;
    }
    Array.isArray(r) && (t = t === !0 ? r : Eu(t, r));
  }
  if (t !== !0) {
    let s, r;
    if (t === !1)
      r = n.changes.invertedDesc, s = ne.empty(e.doc.length);
    else {
      let o = n.changes.filter(t);
      s = o.changes, r = o.filtered.mapDesc(o.changes).invertedDesc;
    }
    n = se.create(e, s, n.selection && n.selection.map(r), L.mapEffects(n.effects, r), n.annotations, n.scrollIntoView);
  }
  let i = e.facet(rh);
  for (let s = i.length - 1; s >= 0; s--) {
    let r = i[s](n);
    r instanceof se ? n = r : Array.isArray(r) && r.length == 1 && r[0] instanceof se ? n = r[0] : n = hh(e, _t(r), !1);
  }
  return n;
}
function Gu(n) {
  let e = n.startState, t = e.facet(oh), i = n;
  for (let s = t.length - 1; s >= 0; s--) {
    let r = t[s](n);
    r && Object.keys(r).length && (i = ah(i, br(e, r, n.changes.newLength), !0));
  }
  return i == n ? n : se.create(e, n.changes, n.selection, i.effects, i.annotations, i.scrollIntoView);
}
const Hu = [];
function _t(n) {
  return n == null ? Hu : Array.isArray(n) ? n : [n];
}
var q = /* @__PURE__ */ function(n) {
  return n[n.Word = 0] = "Word", n[n.Space = 1] = "Space", n[n.Other = 2] = "Other", n;
}(q || (q = {}));
const Fu = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
let yr;
try {
  yr = /* @__PURE__ */ new RegExp("[\\p{Alphabetic}\\p{Number}_]", "u");
} catch {
}
function zu(n) {
  if (yr)
    return yr.test(n);
  for (let e = 0; e < n.length; e++) {
    let t = n[e];
    if (/\w/.test(t) || t > "" && (t.toUpperCase() != t.toLowerCase() || Fu.test(t)))
      return !0;
  }
  return !1;
}
function Ku(n) {
  return (e) => {
    if (!/\S/.test(e))
      return q.Space;
    if (zu(e))
      return q.Word;
    for (let t = 0; t < n.length; t++)
      if (e.indexOf(n[t]) > -1)
        return q.Word;
    return q.Other;
  };
}
class G {
  constructor(e, t, i, s, r, o) {
    this.config = e, this.doc = t, this.selection = i, this.values = s, this.status = e.statusTemplate.slice(), this.computeSlot = r, o && (o._state = this);
    for (let l = 0; l < this.config.dynamicSlots.length; l++)
      Ai(this, l << 1);
    this.computeSlot = null;
  }
  field(e, t = !0) {
    let i = this.config.address[e.id];
    if (i == null) {
      if (t)
        throw new RangeError("Field is not present in this state");
      return;
    }
    return Ai(this, i), Qn(this, i);
  }
  /**
  Create a [transaction](https://codemirror.net/6/docs/ref/#state.Transaction) that updates this
  state. Any number of [transaction specs](https://codemirror.net/6/docs/ref/#state.TransactionSpec)
  can be passed. Unless
  [`sequential`](https://codemirror.net/6/docs/ref/#state.TransactionSpec.sequential) is set, the
  [changes](https://codemirror.net/6/docs/ref/#state.TransactionSpec.changes) (if any) of each spec
  are assumed to start in the _current_ document (not the document
  produced by previous specs), and its
  [selection](https://codemirror.net/6/docs/ref/#state.TransactionSpec.selection) and
  [effects](https://codemirror.net/6/docs/ref/#state.TransactionSpec.effects) are assumed to refer
  to the document created by its _own_ changes. The resulting
  transaction contains the combined effect of all the different
  specs. For [selection](https://codemirror.net/6/docs/ref/#state.TransactionSpec.selection), later
  specs take precedence over earlier ones.
  */
  update(...e) {
    return hh(this, e, !0);
  }
  /**
  @internal
  */
  applyTransaction(e) {
    let t = this.config, { base: i, compartments: s } = t;
    for (let l of e.effects)
      l.is(ys.reconfigure) ? (t && (s = /* @__PURE__ */ new Map(), t.compartments.forEach((a, h) => s.set(h, a)), t = null), s.set(l.value.compartment, l.value.extension)) : l.is(L.reconfigure) ? (t = null, i = l.value) : l.is(L.appendConfig) && (t = null, i = _t(i).concat(l.value));
    let r;
    t ? r = e.startState.values.slice() : (t = Jn.resolve(i, s, this), r = new G(t, this.doc, this.selection, t.dynamicSlots.map(() => null), (a, h) => h.reconfigure(a, this), null).values);
    let o = e.startState.facet(gr) ? e.newSelection : e.newSelection.asSingle();
    new G(t, e.newDoc, o, r, (l, a) => a.update(l, e), e);
  }
  /**
  Create a [transaction spec](https://codemirror.net/6/docs/ref/#state.TransactionSpec) that
  replaces every selection range with the given content.
  */
  replaceSelection(e) {
    return typeof e == "string" && (e = this.toText(e)), this.changeByRange((t) => ({
      changes: { from: t.from, to: t.to, insert: e },
      range: y.cursor(t.from + e.length)
    }));
  }
  /**
  Create a set of changes and a new selection by running the given
  function for each range in the active selection. The function
  can return an optional set of changes (in the coordinate space
  of the start document), plus an updated range (in the coordinate
  space of the document produced by the call's own changes). This
  method will merge all the changes and ranges into a single
  changeset and selection, and return it as a [transaction
  spec](https://codemirror.net/6/docs/ref/#state.TransactionSpec), which can be passed to
  [`update`](https://codemirror.net/6/docs/ref/#state.EditorState.update).
  */
  changeByRange(e) {
    let t = this.selection, i = e(t.ranges[0]), s = this.changes(i.changes), r = [i.range], o = _t(i.effects);
    for (let l = 1; l < t.ranges.length; l++) {
      let a = e(t.ranges[l]), h = this.changes(a.changes), c = h.map(s);
      for (let u = 0; u < l; u++)
        r[u] = r[u].map(c);
      let f = s.mapDesc(h, !0);
      r.push(a.range.map(f)), s = s.compose(c), o = L.mapEffects(o, c).concat(L.mapEffects(_t(a.effects), f));
    }
    return {
      changes: s,
      selection: y.create(r, t.mainIndex),
      effects: o
    };
  }
  /**
  Create a [change set](https://codemirror.net/6/docs/ref/#state.ChangeSet) from the given change
  description, taking the state's document length and line
  separator into account.
  */
  changes(e = []) {
    return e instanceof ne ? e : ne.of(e, this.doc.length, this.facet(G.lineSeparator));
  }
  /**
  Using the state's [line
  separator](https://codemirror.net/6/docs/ref/#state.EditorState^lineSeparator), create a
  [`Text`](https://codemirror.net/6/docs/ref/#state.Text) instance from the given string.
  */
  toText(e) {
    return E.of(e.split(this.facet(G.lineSeparator) || fr));
  }
  /**
  Return the given range of the document as a string.
  */
  sliceDoc(e = 0, t = this.doc.length) {
    return this.doc.sliceString(e, t, this.lineBreak);
  }
  /**
  Get the value of a state [facet](https://codemirror.net/6/docs/ref/#state.Facet).
  */
  facet(e) {
    let t = this.config.address[e.id];
    return t == null ? e.default : (Ai(this, t), Qn(this, t));
  }
  /**
  Convert this state to a JSON-serializable object. When custom
  fields should be serialized, you can pass them in as an object
  mapping property names (in the resulting object, which should
  not use `doc` or `selection`) to fields.
  */
  toJSON(e) {
    let t = {
      doc: this.sliceDoc(),
      selection: this.selection.toJSON()
    };
    if (e)
      for (let i in e) {
        let s = e[i];
        s instanceof ee && this.config.address[s.id] != null && (t[i] = s.spec.toJSON(this.field(e[i]), this));
      }
    return t;
  }
  /**
  Deserialize a state from its JSON representation. When custom
  fields should be deserialized, pass the same object you passed
  to [`toJSON`](https://codemirror.net/6/docs/ref/#state.EditorState.toJSON) when serializing as
  third argument.
  */
  static fromJSON(e, t = {}, i) {
    if (!e || typeof e.doc != "string")
      throw new RangeError("Invalid JSON representation for EditorState");
    let s = [];
    if (i) {
      for (let r in i)
        if (Object.prototype.hasOwnProperty.call(e, r)) {
          let o = i[r], l = e[r];
          s.push(o.init((a) => o.spec.fromJSON(l, a)));
        }
    }
    return G.create({
      doc: e.doc,
      selection: y.fromJSON(e.selection),
      extensions: t.extensions ? s.concat([t.extensions]) : s
    });
  }
  /**
  Create a new state. You'll usually only need this when
  initializing an editor—updated states are created by applying
  transactions.
  */
  static create(e = {}) {
    let t = Jn.resolve(e.extensions || [], /* @__PURE__ */ new Map()), i = e.doc instanceof E ? e.doc : E.of((e.doc || "").split(t.staticFacet(G.lineSeparator) || fr)), s = e.selection ? e.selection instanceof y ? e.selection : y.single(e.selection.anchor, e.selection.head) : y.single(0);
    return eh(s, i.length), t.staticFacet(gr) || (s = s.asSingle()), new G(t, i, s, t.dynamicSlots.map(() => null), (r, o) => o.create(r), null);
  }
  /**
  The size (in columns) of a tab in the document, determined by
  the [`tabSize`](https://codemirror.net/6/docs/ref/#state.EditorState^tabSize) facet.
  */
  get tabSize() {
    return this.facet(G.tabSize);
  }
  /**
  Get the proper [line-break](https://codemirror.net/6/docs/ref/#state.EditorState^lineSeparator)
  string for this state.
  */
  get lineBreak() {
    return this.facet(G.lineSeparator) || `
`;
  }
  /**
  Returns true when the editor is
  [configured](https://codemirror.net/6/docs/ref/#state.EditorState^readOnly) to be read-only.
  */
  get readOnly() {
    return this.facet(lh);
  }
  /**
  Look up a translation for the given phrase (via the
  [`phrases`](https://codemirror.net/6/docs/ref/#state.EditorState^phrases) facet), or return the
  original string if no translation is found.
  
  If additional arguments are passed, they will be inserted in
  place of markers like `$1` (for the first value) and `$2`, etc.
  A single `$` is equivalent to `$1`, and `$$` will produce a
  literal dollar sign.
  */
  phrase(e, ...t) {
    for (let i of this.facet(G.phrases))
      if (Object.prototype.hasOwnProperty.call(i, e)) {
        e = i[e];
        break;
      }
    return t.length && (e = e.replace(/\$(\$|\d*)/g, (i, s) => {
      if (s == "$")
        return "$";
      let r = +(s || 1);
      return !r || r > t.length ? i : t[r - 1];
    })), e;
  }
  /**
  Find the values for a given language data field, provided by the
  the [`languageData`](https://codemirror.net/6/docs/ref/#state.EditorState^languageData) facet.
  
  Examples of language data fields are...
  
  - [`"commentTokens"`](https://codemirror.net/6/docs/ref/#commands.CommentTokens) for specifying
    comment syntax.
  - [`"autocomplete"`](https://codemirror.net/6/docs/ref/#autocomplete.autocompletion^config.override)
    for providing language-specific completion sources.
  - [`"wordChars"`](https://codemirror.net/6/docs/ref/#state.EditorState.charCategorizer) for adding
    characters that should be considered part of words in this
    language.
  - [`"closeBrackets"`](https://codemirror.net/6/docs/ref/#autocomplete.CloseBracketConfig) controls
    bracket closing behavior.
  */
  languageDataAt(e, t, i = -1) {
    let s = [];
    for (let r of this.facet(ih))
      for (let o of r(this, t, i))
        Object.prototype.hasOwnProperty.call(o, e) && s.push(o[e]);
    return s;
  }
  /**
  Return a function that can categorize strings (expected to
  represent a single [grapheme cluster](https://codemirror.net/6/docs/ref/#state.findClusterBreak))
  into one of:
  
   - Word (contains an alphanumeric character or a character
     explicitly listed in the local language's `"wordChars"`
     language data, which should be a string)
   - Space (contains only whitespace)
   - Other (anything else)
  */
  charCategorizer(e) {
    return Ku(this.languageDataAt("wordChars", e).join(""));
  }
  /**
  Find the word at the given position, meaning the range
  containing all [word](https://codemirror.net/6/docs/ref/#state.CharCategory.Word) characters
  around it. If no word characters are adjacent to the position,
  this returns null.
  */
  wordAt(e) {
    let { text: t, from: i, length: s } = this.doc.lineAt(e), r = this.charCategorizer(e), o = e - i, l = e - i;
    for (; o > 0; ) {
      let a = ce(t, o, !1);
      if (r(t.slice(a, o)) != q.Word)
        break;
      o = a;
    }
    for (; l < s; ) {
      let a = ce(t, l);
      if (r(t.slice(l, a)) != q.Word)
        break;
      l = a;
    }
    return o == l ? null : y.range(o + i, l + i);
  }
}
G.allowMultipleSelections = gr;
G.tabSize = /* @__PURE__ */ M.define({
  combine: (n) => n.length ? n[0] : 4
});
G.lineSeparator = nh;
G.readOnly = lh;
G.phrases = /* @__PURE__ */ M.define({
  compare(n, e) {
    let t = Object.keys(n), i = Object.keys(e);
    return t.length == i.length && t.every((s) => n[s] == e[s]);
  }
});
G.languageData = ih;
G.changeFilter = sh;
G.transactionFilter = rh;
G.transactionExtender = oh;
ys.reconfigure = /* @__PURE__ */ L.define();
function tt(n, e, t = {}) {
  let i = {};
  for (let s of n)
    for (let r of Object.keys(s)) {
      let o = s[r], l = i[r];
      if (l === void 0)
        i[r] = o;
      else if (!(l === o || o === void 0))
        if (Object.hasOwnProperty.call(t, r))
          i[r] = t[r](l, o);
        else
          throw new Error("Config merge conflict for field " + r);
    }
  for (let s in e)
    i[s] === void 0 && (i[s] = e[s]);
  return i;
}
class Xt {
  /**
  Compare this value with another value. Used when comparing
  rangesets. The default implementation compares by identity.
  Unless you are only creating a fixed number of unique instances
  of your value type, it is a good idea to implement this
  properly.
  */
  eq(e) {
    return this == e;
  }
  /**
  Create a [range](https://codemirror.net/6/docs/ref/#state.Range) with this value.
  */
  range(e, t = e) {
    return Di.create(e, t, this);
  }
}
Xt.prototype.startSide = Xt.prototype.endSide = 0;
Xt.prototype.point = !1;
Xt.prototype.mapMode = be.TrackDel;
class Di {
  constructor(e, t, i) {
    this.from = e, this.to = t, this.value = i;
  }
  /**
  @internal
  */
  static create(e, t, i) {
    return new Di(e, t, i);
  }
}
function xr(n, e) {
  return n.from - e.from || n.value.startSide - e.value.startSide;
}
class co {
  constructor(e, t, i, s) {
    this.from = e, this.to = t, this.value = i, this.maxPoint = s;
  }
  get length() {
    return this.to[this.to.length - 1];
  }
  // Find the index of the given position and side. Use the ranges'
  // `from` pos when `end == false`, `to` when `end == true`.
  findIndex(e, t, i, s = 0) {
    let r = i ? this.to : this.from;
    for (let o = s, l = r.length; ; ) {
      if (o == l)
        return o;
      let a = o + l >> 1, h = r[a] - e || (i ? this.value[a].endSide : this.value[a].startSide) - t;
      if (a == o)
        return h >= 0 ? o : l;
      h >= 0 ? l = a : o = a + 1;
    }
  }
  between(e, t, i, s) {
    for (let r = this.findIndex(t, -1e9, !0), o = this.findIndex(i, 1e9, !1, r); r < o; r++)
      if (s(this.from[r] + e, this.to[r] + e, this.value[r]) === !1)
        return !1;
  }
  map(e, t) {
    let i = [], s = [], r = [], o = -1, l = -1;
    for (let a = 0; a < this.value.length; a++) {
      let h = this.value[a], c = this.from[a] + e, f = this.to[a] + e, u, d;
      if (c == f) {
        let p = t.mapPos(c, h.startSide, h.mapMode);
        if (p == null || (u = d = p, h.startSide != h.endSide && (d = t.mapPos(c, h.endSide), d < u)))
          continue;
      } else if (u = t.mapPos(c, h.startSide), d = t.mapPos(f, h.endSide), u > d || u == d && h.startSide > 0 && h.endSide <= 0)
        continue;
      (d - u || h.endSide - h.startSide) < 0 || (o < 0 && (o = u), h.point && (l = Math.max(l, d - u)), i.push(h), s.push(u - o), r.push(d - o));
    }
    return { mapped: i.length ? new co(s, r, i, l) : null, pos: o };
  }
}
class I {
  constructor(e, t, i, s) {
    this.chunkPos = e, this.chunk = t, this.nextLayer = i, this.maxPoint = s;
  }
  /**
  @internal
  */
  static create(e, t, i, s) {
    return new I(e, t, i, s);
  }
  /**
  @internal
  */
  get length() {
    let e = this.chunk.length - 1;
    return e < 0 ? 0 : Math.max(this.chunkEnd(e), this.nextLayer.length);
  }
  /**
  The number of ranges in the set.
  */
  get size() {
    if (this.isEmpty)
      return 0;
    let e = this.nextLayer.size;
    for (let t of this.chunk)
      e += t.value.length;
    return e;
  }
  /**
  @internal
  */
  chunkEnd(e) {
    return this.chunkPos[e] + this.chunk[e].length;
  }
  /**
  Update the range set, optionally adding new ranges or filtering
  out existing ones.
  
  (Note: The type parameter is just there as a kludge to work
  around TypeScript variance issues that prevented `RangeSet<X>`
  from being a subtype of `RangeSet<Y>` when `X` is a subtype of
  `Y`.)
  */
  update(e) {
    let { add: t = [], sort: i = !1, filterFrom: s = 0, filterTo: r = this.length } = e, o = e.filter;
    if (t.length == 0 && !o)
      return this;
    if (i && (t = t.slice().sort(xr)), this.isEmpty)
      return t.length ? I.of(t) : this;
    let l = new ch(this, null, -1).goto(0), a = 0, h = [], c = new kt();
    for (; l.value || a < t.length; )
      if (a < t.length && (l.from - t[a].from || l.startSide - t[a].value.startSide) >= 0) {
        let f = t[a++];
        c.addInner(f.from, f.to, f.value) || h.push(f);
      } else
        l.rangeIndex == 1 && l.chunkIndex < this.chunk.length && (a == t.length || this.chunkEnd(l.chunkIndex) < t[a].from) && (!o || s > this.chunkEnd(l.chunkIndex) || r < this.chunkPos[l.chunkIndex]) && c.addChunk(this.chunkPos[l.chunkIndex], this.chunk[l.chunkIndex]) ? l.nextChunk() : ((!o || s > l.to || r < l.from || o(l.from, l.to, l.value)) && (c.addInner(l.from, l.to, l.value) || h.push(Di.create(l.from, l.to, l.value))), l.next());
    return c.finishInner(this.nextLayer.isEmpty && !h.length ? I.empty : this.nextLayer.update({ add: h, filter: o, filterFrom: s, filterTo: r }));
  }
  /**
  Map this range set through a set of changes, return the new set.
  */
  map(e) {
    if (e.empty || this.isEmpty)
      return this;
    let t = [], i = [], s = -1;
    for (let o = 0; o < this.chunk.length; o++) {
      let l = this.chunkPos[o], a = this.chunk[o], h = e.touchesRange(l, l + a.length);
      if (h === !1)
        s = Math.max(s, a.maxPoint), t.push(a), i.push(e.mapPos(l));
      else if (h === !0) {
        let { mapped: c, pos: f } = a.map(l, e);
        c && (s = Math.max(s, c.maxPoint), t.push(c), i.push(f));
      }
    }
    let r = this.nextLayer.map(e);
    return t.length == 0 ? r : new I(i, t, r || I.empty, s);
  }
  /**
  Iterate over the ranges that touch the region `from` to `to`,
  calling `f` for each. There is no guarantee that the ranges will
  be reported in any specific order. When the callback returns
  `false`, iteration stops.
  */
  between(e, t, i) {
    if (!this.isEmpty) {
      for (let s = 0; s < this.chunk.length; s++) {
        let r = this.chunkPos[s], o = this.chunk[s];
        if (t >= r && e <= r + o.length && o.between(r, e - r, t - r, i) === !1)
          return;
      }
      this.nextLayer.between(e, t, i);
    }
  }
  /**
  Iterate over the ranges in this set, in order, including all
  ranges that end at or after `from`.
  */
  iter(e = 0) {
    return Pi.from([this]).goto(e);
  }
  /**
  @internal
  */
  get isEmpty() {
    return this.nextLayer == this;
  }
  /**
  Iterate over the ranges in a collection of sets, in order,
  starting from `from`.
  */
  static iter(e, t = 0) {
    return Pi.from(e).goto(t);
  }
  /**
  Iterate over two groups of sets, calling methods on `comparator`
  to notify it of possible differences.
  */
  static compare(e, t, i, s, r = -1) {
    let o = e.filter((f) => f.maxPoint > 0 || !f.isEmpty && f.maxPoint >= r), l = t.filter((f) => f.maxPoint > 0 || !f.isEmpty && f.maxPoint >= r), a = nl(o, l, i), h = new di(o, a, r), c = new di(l, a, r);
    i.iterGaps((f, u, d) => sl(h, f, c, u, d, s)), i.empty && i.length == 0 && sl(h, 0, c, 0, 0, s);
  }
  /**
  Compare the contents of two groups of range sets, returning true
  if they are equivalent in the given range.
  */
  static eq(e, t, i = 0, s) {
    s == null && (s = 1e9 - 1);
    let r = e.filter((c) => !c.isEmpty && t.indexOf(c) < 0), o = t.filter((c) => !c.isEmpty && e.indexOf(c) < 0);
    if (r.length != o.length)
      return !1;
    if (!r.length)
      return !0;
    let l = nl(r, o), a = new di(r, l, 0).goto(i), h = new di(o, l, 0).goto(i);
    for (; ; ) {
      if (a.to != h.to || !wr(a.active, h.active) || a.point && (!h.point || !a.point.eq(h.point)))
        return !1;
      if (a.to > s)
        return !0;
      a.next(), h.next();
    }
  }
  /**
  Iterate over a group of range sets at the same time, notifying
  the iterator about the ranges covering every given piece of
  content. Returns the open count (see
  [`SpanIterator.span`](https://codemirror.net/6/docs/ref/#state.SpanIterator.span)) at the end
  of the iteration.
  */
  static spans(e, t, i, s, r = -1) {
    let o = new di(e, null, r).goto(t), l = t, a = o.openStart;
    for (; ; ) {
      let h = Math.min(o.to, i);
      if (o.point) {
        let c = o.activeForPoint(o.to), f = o.pointFrom < t ? c.length + 1 : o.point.startSide < 0 ? c.length : Math.min(c.length, a);
        s.point(l, h, o.point, c, f, o.pointRank), a = Math.min(o.openEnd(h), c.length);
      } else
        h > l && (s.span(l, h, o.active, a), a = o.openEnd(h));
      if (o.to > i)
        return a + (o.point && o.to > i ? 1 : 0);
      l = o.to, o.next();
    }
  }
  /**
  Create a range set for the given range or array of ranges. By
  default, this expects the ranges to be _sorted_ (by start
  position and, if two start at the same position,
  `value.startSide`). You can pass `true` as second argument to
  cause the method to sort them.
  */
  static of(e, t = !1) {
    let i = new kt();
    for (let s of e instanceof Di ? [e] : t ? Yu(e) : e)
      i.add(s.from, s.to, s.value);
    return i.finish();
  }
  /**
  Join an array of range sets into a single set.
  */
  static join(e) {
    if (!e.length)
      return I.empty;
    let t = e[e.length - 1];
    for (let i = e.length - 2; i >= 0; i--)
      for (let s = e[i]; s != I.empty; s = s.nextLayer)
        t = new I(s.chunkPos, s.chunk, t, Math.max(s.maxPoint, t.maxPoint));
    return t;
  }
}
I.empty = /* @__PURE__ */ new I([], [], null, -1);
function Yu(n) {
  if (n.length > 1)
    for (let e = n[0], t = 1; t < n.length; t++) {
      let i = n[t];
      if (xr(e, i) > 0)
        return n.slice().sort(xr);
      e = i;
    }
  return n;
}
I.empty.nextLayer = I.empty;
class kt {
  finishChunk(e) {
    this.chunks.push(new co(this.from, this.to, this.value, this.maxPoint)), this.chunkPos.push(this.chunkStart), this.chunkStart = -1, this.setMaxPoint = Math.max(this.setMaxPoint, this.maxPoint), this.maxPoint = -1, e && (this.from = [], this.to = [], this.value = []);
  }
  /**
  Create an empty builder.
  */
  constructor() {
    this.chunks = [], this.chunkPos = [], this.chunkStart = -1, this.last = null, this.lastFrom = -1e9, this.lastTo = -1e9, this.from = [], this.to = [], this.value = [], this.maxPoint = -1, this.setMaxPoint = -1, this.nextLayer = null;
  }
  /**
  Add a range. Ranges should be added in sorted (by `from` and
  `value.startSide`) order.
  */
  add(e, t, i) {
    this.addInner(e, t, i) || (this.nextLayer || (this.nextLayer = new kt())).add(e, t, i);
  }
  /**
  @internal
  */
  addInner(e, t, i) {
    let s = e - this.lastTo || i.startSide - this.last.endSide;
    if (s <= 0 && (e - this.lastFrom || i.startSide - this.last.startSide) < 0)
      throw new Error("Ranges must be added sorted by `from` position and `startSide`");
    return s < 0 ? !1 : (this.from.length == 250 && this.finishChunk(!0), this.chunkStart < 0 && (this.chunkStart = e), this.from.push(e - this.chunkStart), this.to.push(t - this.chunkStart), this.last = i, this.lastFrom = e, this.lastTo = t, this.value.push(i), i.point && (this.maxPoint = Math.max(this.maxPoint, t - e)), !0);
  }
  /**
  @internal
  */
  addChunk(e, t) {
    if ((e - this.lastTo || t.value[0].startSide - this.last.endSide) < 0)
      return !1;
    this.from.length && this.finishChunk(!0), this.setMaxPoint = Math.max(this.setMaxPoint, t.maxPoint), this.chunks.push(t), this.chunkPos.push(e);
    let i = t.value.length - 1;
    return this.last = t.value[i], this.lastFrom = t.from[i] + e, this.lastTo = t.to[i] + e, !0;
  }
  /**
  Finish the range set. Returns the new set. The builder can't be
  used anymore after this has been called.
  */
  finish() {
    return this.finishInner(I.empty);
  }
  /**
  @internal
  */
  finishInner(e) {
    if (this.from.length && this.finishChunk(!1), this.chunks.length == 0)
      return e;
    let t = I.create(this.chunkPos, this.chunks, this.nextLayer ? this.nextLayer.finishInner(e) : e, this.setMaxPoint);
    return this.from = null, t;
  }
}
function nl(n, e, t) {
  let i = /* @__PURE__ */ new Map();
  for (let r of n)
    for (let o = 0; o < r.chunk.length; o++)
      r.chunk[o].maxPoint <= 0 && i.set(r.chunk[o], r.chunkPos[o]);
  let s = /* @__PURE__ */ new Set();
  for (let r of e)
    for (let o = 0; o < r.chunk.length; o++) {
      let l = i.get(r.chunk[o]);
      l != null && (t ? t.mapPos(l) : l) == r.chunkPos[o] && !(t != null && t.touchesRange(l, l + r.chunk[o].length)) && s.add(r.chunk[o]);
    }
  return s;
}
class ch {
  constructor(e, t, i, s = 0) {
    this.layer = e, this.skip = t, this.minPoint = i, this.rank = s;
  }
  get startSide() {
    return this.value ? this.value.startSide : 0;
  }
  get endSide() {
    return this.value ? this.value.endSide : 0;
  }
  goto(e, t = -1e9) {
    return this.chunkIndex = this.rangeIndex = 0, this.gotoInner(e, t, !1), this;
  }
  gotoInner(e, t, i) {
    for (; this.chunkIndex < this.layer.chunk.length; ) {
      let s = this.layer.chunk[this.chunkIndex];
      if (!(this.skip && this.skip.has(s) || this.layer.chunkEnd(this.chunkIndex) < e || s.maxPoint < this.minPoint))
        break;
      this.chunkIndex++, i = !1;
    }
    if (this.chunkIndex < this.layer.chunk.length) {
      let s = this.layer.chunk[this.chunkIndex].findIndex(e - this.layer.chunkPos[this.chunkIndex], t, !0);
      (!i || this.rangeIndex < s) && this.setRangeIndex(s);
    }
    this.next();
  }
  forward(e, t) {
    (this.to - e || this.endSide - t) < 0 && this.gotoInner(e, t, !0);
  }
  next() {
    for (; ; )
      if (this.chunkIndex == this.layer.chunk.length) {
        this.from = this.to = 1e9, this.value = null;
        break;
      } else {
        let e = this.layer.chunkPos[this.chunkIndex], t = this.layer.chunk[this.chunkIndex], i = e + t.from[this.rangeIndex];
        if (this.from = i, this.to = e + t.to[this.rangeIndex], this.value = t.value[this.rangeIndex], this.setRangeIndex(this.rangeIndex + 1), this.minPoint < 0 || this.value.point && this.to - this.from >= this.minPoint)
          break;
      }
  }
  setRangeIndex(e) {
    if (e == this.layer.chunk[this.chunkIndex].value.length) {
      if (this.chunkIndex++, this.skip)
        for (; this.chunkIndex < this.layer.chunk.length && this.skip.has(this.layer.chunk[this.chunkIndex]); )
          this.chunkIndex++;
      this.rangeIndex = 0;
    } else
      this.rangeIndex = e;
  }
  nextChunk() {
    this.chunkIndex++, this.rangeIndex = 0, this.next();
  }
  compare(e) {
    return this.from - e.from || this.startSide - e.startSide || this.rank - e.rank || this.to - e.to || this.endSide - e.endSide;
  }
}
class Pi {
  constructor(e) {
    this.heap = e;
  }
  static from(e, t = null, i = -1) {
    let s = [];
    for (let r = 0; r < e.length; r++)
      for (let o = e[r]; !o.isEmpty; o = o.nextLayer)
        o.maxPoint >= i && s.push(new ch(o, t, i, r));
    return s.length == 1 ? s[0] : new Pi(s);
  }
  get startSide() {
    return this.value ? this.value.startSide : 0;
  }
  goto(e, t = -1e9) {
    for (let i of this.heap)
      i.goto(e, t);
    for (let i = this.heap.length >> 1; i >= 0; i--)
      Ws(this.heap, i);
    return this.next(), this;
  }
  forward(e, t) {
    for (let i of this.heap)
      i.forward(e, t);
    for (let i = this.heap.length >> 1; i >= 0; i--)
      Ws(this.heap, i);
    (this.to - e || this.value.endSide - t) < 0 && this.next();
  }
  next() {
    if (this.heap.length == 0)
      this.from = this.to = 1e9, this.value = null, this.rank = -1;
    else {
      let e = this.heap[0];
      this.from = e.from, this.to = e.to, this.value = e.value, this.rank = e.rank, e.value && e.next(), Ws(this.heap, 0);
    }
  }
}
function Ws(n, e) {
  for (let t = n[e]; ; ) {
    let i = (e << 1) + 1;
    if (i >= n.length)
      break;
    let s = n[i];
    if (i + 1 < n.length && s.compare(n[i + 1]) >= 0 && (s = n[i + 1], i++), t.compare(s) < 0)
      break;
    n[i] = t, n[e] = s, e = i;
  }
}
class di {
  constructor(e, t, i) {
    this.minPoint = i, this.active = [], this.activeTo = [], this.activeRank = [], this.minActive = -1, this.point = null, this.pointFrom = 0, this.pointRank = 0, this.to = -1e9, this.endSide = 0, this.openStart = -1, this.cursor = Pi.from(e, t, i);
  }
  goto(e, t = -1e9) {
    return this.cursor.goto(e, t), this.active.length = this.activeTo.length = this.activeRank.length = 0, this.minActive = -1, this.to = e, this.endSide = t, this.openStart = -1, this.next(), this;
  }
  forward(e, t) {
    for (; this.minActive > -1 && (this.activeTo[this.minActive] - e || this.active[this.minActive].endSide - t) < 0; )
      this.removeActive(this.minActive);
    this.cursor.forward(e, t);
  }
  removeActive(e) {
    ln(this.active, e), ln(this.activeTo, e), ln(this.activeRank, e), this.minActive = rl(this.active, this.activeTo);
  }
  addActive(e) {
    let t = 0, { value: i, to: s, rank: r } = this.cursor;
    for (; t < this.activeRank.length && (r - this.activeRank[t] || s - this.activeTo[t]) > 0; )
      t++;
    an(this.active, t, i), an(this.activeTo, t, s), an(this.activeRank, t, r), e && an(e, t, this.cursor.from), this.minActive = rl(this.active, this.activeTo);
  }
  // After calling this, if `this.point` != null, the next range is a
  // point. Otherwise, it's a regular range, covered by `this.active`.
  next() {
    let e = this.to, t = this.point;
    this.point = null;
    let i = this.openStart < 0 ? [] : null;
    for (; ; ) {
      let s = this.minActive;
      if (s > -1 && (this.activeTo[s] - this.cursor.from || this.active[s].endSide - this.cursor.startSide) < 0) {
        if (this.activeTo[s] > e) {
          this.to = this.activeTo[s], this.endSide = this.active[s].endSide;
          break;
        }
        this.removeActive(s), i && ln(i, s);
      } else if (this.cursor.value)
        if (this.cursor.from > e) {
          this.to = this.cursor.from, this.endSide = this.cursor.startSide;
          break;
        } else {
          let r = this.cursor.value;
          if (!r.point)
            this.addActive(i), this.cursor.next();
          else if (t && this.cursor.to == this.to && this.cursor.from < this.cursor.to)
            this.cursor.next();
          else {
            this.point = r, this.pointFrom = this.cursor.from, this.pointRank = this.cursor.rank, this.to = this.cursor.to, this.endSide = r.endSide, this.cursor.next(), this.forward(this.to, this.endSide);
            break;
          }
        }
      else {
        this.to = this.endSide = 1e9;
        break;
      }
    }
    if (i) {
      this.openStart = 0;
      for (let s = i.length - 1; s >= 0 && i[s] < e; s--)
        this.openStart++;
    }
  }
  activeForPoint(e) {
    if (!this.active.length)
      return this.active;
    let t = [];
    for (let i = this.active.length - 1; i >= 0 && !(this.activeRank[i] < this.pointRank); i--)
      (this.activeTo[i] > e || this.activeTo[i] == e && this.active[i].endSide >= this.point.endSide) && t.push(this.active[i]);
    return t.reverse();
  }
  openEnd(e) {
    let t = 0;
    for (let i = this.activeTo.length - 1; i >= 0 && this.activeTo[i] > e; i--)
      t++;
    return t;
  }
}
function sl(n, e, t, i, s, r) {
  n.goto(e), t.goto(i);
  let o = i + s, l = i, a = i - e;
  for (; ; ) {
    let h = n.to + a - t.to || n.endSide - t.endSide, c = h < 0 ? n.to + a : t.to, f = Math.min(c, o);
    if (n.point || t.point ? n.point && t.point && (n.point == t.point || n.point.eq(t.point)) && wr(n.activeForPoint(n.to), t.activeForPoint(t.to)) || r.comparePoint(l, f, n.point, t.point) : f > l && !wr(n.active, t.active) && r.compareRange(l, f, n.active, t.active), c > o)
      break;
    l = c, h <= 0 && n.next(), h >= 0 && t.next();
  }
}
function wr(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++)
    if (n[t] != e[t] && !n[t].eq(e[t]))
      return !1;
  return !0;
}
function ln(n, e) {
  for (let t = e, i = n.length - 1; t < i; t++)
    n[t] = n[t + 1];
  n.pop();
}
function an(n, e, t) {
  for (let i = n.length - 1; i >= e; i--)
    n[i + 1] = n[i];
  n[e] = t;
}
function rl(n, e) {
  let t = -1, i = 1e9;
  for (let s = 0; s < e.length; s++)
    (e[s] - i || n[s].endSide - n[t].endSide) < 0 && (t = s, i = e[s]);
  return t;
}
function Ji(n, e, t = n.length) {
  let i = 0;
  for (let s = 0; s < t; )
    n.charCodeAt(s) == 9 ? (i += e - i % e, s++) : (i++, s = ce(n, s));
  return i;
}
function Ju(n, e, t, i) {
  for (let s = 0, r = 0; ; ) {
    if (r >= e)
      return s;
    if (s == n.length)
      break;
    r += n.charCodeAt(s) == 9 ? t - r % t : 1, s = ce(n, s);
  }
  return i === !0 ? -1 : n.length;
}
const kr = "ͼ", ol = typeof Symbol > "u" ? "__" + kr : Symbol.for(kr), Sr = typeof Symbol > "u" ? "__styleSet" + Math.floor(Math.random() * 1e8) : Symbol("styleSet"), ll = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : {};
class St {
  // :: (Object<Style>, ?{finish: ?(string) → string})
  // Create a style module from the given spec.
  //
  // When `finish` is given, it is called on regular (non-`@`)
  // selectors (after `&` expansion) to compute the final selector.
  constructor(e, t) {
    this.rules = [];
    let { finish: i } = t || {};
    function s(o) {
      return /^@/.test(o) ? [o] : o.split(/,\s*/);
    }
    function r(o, l, a, h) {
      let c = [], f = /^@(\w+)\b/.exec(o[0]), u = f && f[1] == "keyframes";
      if (f && l == null)
        return a.push(o[0] + ";");
      for (let d in l) {
        let p = l[d];
        if (/&/.test(d))
          r(
            d.split(/,\s*/).map((g) => o.map((m) => g.replace(/&/, m))).reduce((g, m) => g.concat(m)),
            p,
            a
          );
        else if (p && typeof p == "object") {
          if (!f)
            throw new RangeError("The value of a property (" + d + ") should be a primitive value.");
          r(s(d), p, c, u);
        } else
          p != null && c.push(d.replace(/_.*/, "").replace(/[A-Z]/g, (g) => "-" + g.toLowerCase()) + ": " + p + ";");
      }
      (c.length || u) && a.push((i && !f && !h ? o.map(i) : o).join(", ") + " {" + c.join(" ") + "}");
    }
    for (let o in e)
      r(s(o), e[o], this.rules);
  }
  // :: () → string
  // Returns a string containing the module's CSS rules.
  getRules() {
    return this.rules.join(`
`);
  }
  // :: () → string
  // Generate a new unique CSS class name.
  static newName() {
    let e = ll[ol] || 1;
    return ll[ol] = e + 1, kr + e.toString(36);
  }
  // :: (union<Document, ShadowRoot>, union<[StyleModule], StyleModule>, ?{nonce: ?string})
  //
  // Mount the given set of modules in the given DOM root, which ensures
  // that the CSS rules defined by the module are available in that
  // context.
  //
  // Rules are only added to the document once per root.
  //
  // Rule order will follow the order of the modules, so that rules from
  // modules later in the array take precedence of those from earlier
  // modules. If you call this function multiple times for the same root
  // in a way that changes the order of already mounted modules, the old
  // order will be changed.
  //
  // If a Content Security Policy nonce is provided, it is added to
  // the `<style>` tag generated by the library.
  static mount(e, t, i) {
    let s = e[Sr], r = i && i.nonce;
    s ? r && s.setNonce(r) : s = new Qu(e, r), s.mount(Array.isArray(t) ? t : [t]);
  }
}
let al = /* @__PURE__ */ new Map();
class Qu {
  constructor(e, t) {
    let i = e.ownerDocument || e, s = i.defaultView;
    if (!e.head && e.adoptedStyleSheets && s.CSSStyleSheet) {
      let r = al.get(i);
      if (r)
        return e.adoptedStyleSheets = [r.sheet, ...e.adoptedStyleSheets], e[Sr] = r;
      this.sheet = new s.CSSStyleSheet(), e.adoptedStyleSheets = [this.sheet, ...e.adoptedStyleSheets], al.set(i, this);
    } else {
      this.styleTag = i.createElement("style"), t && this.styleTag.setAttribute("nonce", t);
      let r = e.head || e;
      r.insertBefore(this.styleTag, r.firstChild);
    }
    this.modules = [], e[Sr] = this;
  }
  mount(e) {
    let t = this.sheet, i = 0, s = 0;
    for (let r = 0; r < e.length; r++) {
      let o = e[r], l = this.modules.indexOf(o);
      if (l < s && l > -1 && (this.modules.splice(l, 1), s--, l = -1), l == -1) {
        if (this.modules.splice(s++, 0, o), t)
          for (let a = 0; a < o.rules.length; a++)
            t.insertRule(o.rules[a], i++);
      } else {
        for (; s < l; )
          i += this.modules[s++].rules.length;
        i += o.rules.length, s++;
      }
    }
    if (!t) {
      let r = "";
      for (let o = 0; o < this.modules.length; o++)
        r += this.modules[o].getRules() + `
`;
      this.styleTag.textContent = r;
    }
  }
  setNonce(e) {
    this.styleTag && this.styleTag.getAttribute("nonce") != e && this.styleTag.setAttribute("nonce", e);
  }
}
var vt = {
  8: "Backspace",
  9: "Tab",
  10: "Enter",
  12: "NumLock",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  44: "PrintScreen",
  45: "Insert",
  46: "Delete",
  59: ";",
  61: "=",
  91: "Meta",
  92: "Meta",
  106: "*",
  107: "+",
  108: ",",
  109: "-",
  110: ".",
  111: "/",
  144: "NumLock",
  145: "ScrollLock",
  160: "Shift",
  161: "Shift",
  162: "Control",
  163: "Control",
  164: "Alt",
  165: "Alt",
  173: "-",
  186: ";",
  187: "=",
  188: ",",
  189: "-",
  190: ".",
  191: "/",
  192: "`",
  219: "[",
  220: "\\",
  221: "]",
  222: "'"
}, Vi = {
  48: ")",
  49: "!",
  50: "@",
  51: "#",
  52: "$",
  53: "%",
  54: "^",
  55: "&",
  56: "*",
  57: "(",
  59: ":",
  61: "+",
  173: "_",
  186: ":",
  187: "+",
  188: "<",
  189: "_",
  190: ">",
  191: "?",
  192: "~",
  219: "{",
  220: "|",
  221: "}",
  222: '"'
}, Uu = typeof navigator < "u" && /Mac/.test(navigator.platform), $u = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
for (var ae = 0; ae < 10; ae++)
  vt[48 + ae] = vt[96 + ae] = String(ae);
for (var ae = 1; ae <= 24; ae++)
  vt[ae + 111] = "F" + ae;
for (var ae = 65; ae <= 90; ae++)
  vt[ae] = String.fromCharCode(ae + 32), Vi[ae] = String.fromCharCode(ae);
for (var Xs in vt)
  Vi.hasOwnProperty(Xs) || (Vi[Xs] = vt[Xs]);
function ju(n) {
  var e = Uu && n.metaKey && n.shiftKey && !n.ctrlKey && !n.altKey || $u && n.shiftKey && n.key && n.key.length == 1 || n.key == "Unidentified", t = !e && n.key || (n.shiftKey ? Vi : vt)[n.keyCode] || n.key || "Unidentified";
  return t == "Esc" && (t = "Escape"), t == "Del" && (t = "Delete"), t == "Left" && (t = "ArrowLeft"), t == "Up" && (t = "ArrowUp"), t == "Right" && (t = "ArrowRight"), t == "Down" && (t = "ArrowDown"), t;
}
function Un(n) {
  let e;
  return n.nodeType == 11 ? e = n.getSelection ? n : n.ownerDocument : e = n, e.getSelection();
}
function vr(n, e) {
  return e ? n == e || n.contains(e.nodeType != 1 ? e.parentNode : e) : !1;
}
function qu(n) {
  let e = n.activeElement;
  for (; e && e.shadowRoot; )
    e = e.shadowRoot.activeElement;
  return e;
}
function Dn(n, e) {
  if (!e.anchorNode)
    return !1;
  try {
    return vr(n, e.anchorNode);
  } catch {
    return !1;
  }
}
function Bi(n) {
  return n.nodeType == 3 ? It(n, 0, n.nodeValue.length).getClientRects() : n.nodeType == 1 ? n.getClientRects() : [];
}
function Mi(n, e, t, i) {
  return t ? hl(n, e, t, i, -1) || hl(n, e, t, i, 1) : !1;
}
function Wi(n) {
  for (var e = 0; ; e++)
    if (n = n.previousSibling, !n)
      return e;
}
function hl(n, e, t, i, s) {
  for (; ; ) {
    if (n == t && e == i)
      return !0;
    if (e == (s < 0 ? 0 : rt(n))) {
      if (n.nodeName == "DIV")
        return !1;
      let r = n.parentNode;
      if (!r || r.nodeType != 1)
        return !1;
      e = Wi(n) + (s < 0 ? 0 : 1), n = r;
    } else if (n.nodeType == 1) {
      if (n = n.childNodes[e + (s < 0 ? -1 : 0)], n.nodeType == 1 && n.contentEditable == "false")
        return !1;
      e = s < 0 ? rt(n) : 0;
    } else
      return !1;
  }
}
function rt(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function fo(n, e) {
  let t = e ? n.left : n.right;
  return { left: t, right: t, top: n.top, bottom: n.bottom };
}
function _u(n) {
  return {
    left: 0,
    right: n.innerWidth,
    top: 0,
    bottom: n.innerHeight
  };
}
function fh(n, e) {
  let t = e.width / n.offsetWidth, i = e.height / n.offsetHeight;
  return (t > 0.995 && t < 1.005 || !isFinite(t) || Math.abs(e.width - n.offsetWidth) < 1) && (t = 1), (i > 0.995 && i < 1.005 || !isFinite(i) || Math.abs(e.height - n.offsetHeight) < 1) && (i = 1), { scaleX: t, scaleY: i };
}
function ed(n, e, t, i, s, r, o, l) {
  let a = n.ownerDocument, h = a.defaultView || window;
  for (let c = n, f = !1; c && !f; )
    if (c.nodeType == 1) {
      let u, d = c == a.body, p = 1, g = 1;
      if (d)
        u = _u(h);
      else {
        if (/^(fixed|sticky)$/.test(getComputedStyle(c).position) && (f = !0), c.scrollHeight <= c.clientHeight && c.scrollWidth <= c.clientWidth) {
          c = c.assignedSlot || c.parentNode;
          continue;
        }
        let k = c.getBoundingClientRect();
        ({ scaleX: p, scaleY: g } = fh(c, k)), u = {
          left: k.left,
          right: k.left + c.clientWidth * p,
          top: k.top,
          bottom: k.top + c.clientHeight * g
        };
      }
      let m = 0, b = 0;
      if (s == "nearest")
        e.top < u.top ? (b = -(u.top - e.top + o), t > 0 && e.bottom > u.bottom + b && (b = e.bottom - u.bottom + b + o)) : e.bottom > u.bottom && (b = e.bottom - u.bottom + o, t < 0 && e.top - b < u.top && (b = -(u.top + b - e.top + o)));
      else {
        let k = e.bottom - e.top, C = u.bottom - u.top;
        b = (s == "center" && k <= C ? e.top + k / 2 - C / 2 : s == "start" || s == "center" && t < 0 ? e.top - o : e.bottom - C + o) - u.top;
      }
      if (i == "nearest" ? e.left < u.left ? (m = -(u.left - e.left + r), t > 0 && e.right > u.right + m && (m = e.right - u.right + m + r)) : e.right > u.right && (m = e.right - u.right + r, t < 0 && e.left < u.left + m && (m = -(u.left + m - e.left + r))) : m = (i == "center" ? e.left + (e.right - e.left) / 2 - (u.right - u.left) / 2 : i == "start" == l ? e.left - r : e.right - (u.right - u.left) + r) - u.left, m || b)
        if (d)
          h.scrollBy(m, b);
        else {
          let k = 0, C = 0;
          if (b) {
            let S = c.scrollTop;
            c.scrollTop += b / g, C = (c.scrollTop - S) * g;
          }
          if (m) {
            let S = c.scrollLeft;
            c.scrollLeft += m / p, k = (c.scrollLeft - S) * p;
          }
          e = {
            left: e.left - k,
            top: e.top - C,
            right: e.right - k,
            bottom: e.bottom - C
          }, k && Math.abs(k - m) < 1 && (i = "nearest"), C && Math.abs(C - b) < 1 && (s = "nearest");
        }
      if (d)
        break;
      c = c.assignedSlot || c.parentNode;
    } else if (c.nodeType == 11)
      c = c.host;
    else
      break;
}
function td(n) {
  let e = n.ownerDocument;
  for (let t = n.parentNode; t && t != e.body; )
    if (t.nodeType == 1) {
      if (t.scrollHeight > t.clientHeight || t.scrollWidth > t.clientWidth)
        return t;
      t = t.assignedSlot || t.parentNode;
    } else if (t.nodeType == 11)
      t = t.host;
    else
      break;
  return null;
}
class id {
  constructor() {
    this.anchorNode = null, this.anchorOffset = 0, this.focusNode = null, this.focusOffset = 0;
  }
  eq(e) {
    return this.anchorNode == e.anchorNode && this.anchorOffset == e.anchorOffset && this.focusNode == e.focusNode && this.focusOffset == e.focusOffset;
  }
  setRange(e) {
    let { anchorNode: t, focusNode: i } = e;
    this.set(t, Math.min(e.anchorOffset, t ? rt(t) : 0), i, Math.min(e.focusOffset, i ? rt(i) : 0));
  }
  set(e, t, i, s) {
    this.anchorNode = e, this.anchorOffset = t, this.focusNode = i, this.focusOffset = s;
  }
}
let zt = null;
function uh(n) {
  if (n.setActive)
    return n.setActive();
  if (zt)
    return n.focus(zt);
  let e = [];
  for (let t = n; t && (e.push(t, t.scrollTop, t.scrollLeft), t != t.ownerDocument); t = t.parentNode)
    ;
  if (n.focus(zt == null ? {
    get preventScroll() {
      return zt = { preventScroll: !0 }, !0;
    }
  } : void 0), !zt) {
    zt = !1;
    for (let t = 0; t < e.length; ) {
      let i = e[t++], s = e[t++], r = e[t++];
      i.scrollTop != s && (i.scrollTop = s), i.scrollLeft != r && (i.scrollLeft = r);
    }
  }
}
let cl;
function It(n, e, t = e) {
  let i = cl || (cl = document.createRange());
  return i.setEnd(n, t), i.setStart(n, e), i;
}
function ei(n, e, t) {
  let i = { key: e, code: e, keyCode: t, which: t, cancelable: !0 }, s = new KeyboardEvent("keydown", i);
  s.synthetic = !0, n.dispatchEvent(s);
  let r = new KeyboardEvent("keyup", i);
  return r.synthetic = !0, n.dispatchEvent(r), s.defaultPrevented || r.defaultPrevented;
}
function nd(n) {
  for (; n; ) {
    if (n && (n.nodeType == 9 || n.nodeType == 11 && n.host))
      return n;
    n = n.assignedSlot || n.parentNode;
  }
  return null;
}
function dh(n) {
  for (; n.attributes.length; )
    n.removeAttributeNode(n.attributes[0]);
}
function sd(n, e) {
  let t = e.focusNode, i = e.focusOffset;
  if (!t || e.anchorNode != t || e.anchorOffset != i)
    return !1;
  for (i = Math.min(i, rt(t)); ; )
    if (i) {
      if (t.nodeType != 1)
        return !1;
      let s = t.childNodes[i - 1];
      s.contentEditable == "false" ? i-- : (t = s, i = rt(t));
    } else {
      if (t == n)
        return !0;
      i = Wi(t), t = t.parentNode;
    }
}
function ph(n) {
  return n.scrollTop > Math.max(1, n.scrollHeight - n.clientHeight - 4);
}
class ue {
  constructor(e, t, i = !0) {
    this.node = e, this.offset = t, this.precise = i;
  }
  static before(e, t) {
    return new ue(e.parentNode, Wi(e), t);
  }
  static after(e, t) {
    return new ue(e.parentNode, Wi(e) + 1, t);
  }
}
const uo = [];
class Y {
  constructor() {
    this.parent = null, this.dom = null, this.flags = 2;
  }
  get overrideDOMText() {
    return null;
  }
  get posAtStart() {
    return this.parent ? this.parent.posBefore(this) : 0;
  }
  get posAtEnd() {
    return this.posAtStart + this.length;
  }
  posBefore(e) {
    let t = this.posAtStart;
    for (let i of this.children) {
      if (i == e)
        return t;
      t += i.length + i.breakAfter;
    }
    throw new RangeError("Invalid child in posBefore");
  }
  posAfter(e) {
    return this.posBefore(e) + e.length;
  }
  sync(e, t) {
    if (this.flags & 2) {
      let i = this.dom, s = null, r;
      for (let o of this.children) {
        if (o.flags & 7) {
          if (!o.dom && (r = s ? s.nextSibling : i.firstChild)) {
            let l = Y.get(r);
            (!l || !l.parent && l.canReuseDOM(o)) && o.reuseDOM(r);
          }
          o.sync(e, t), o.flags &= -8;
        }
        if (r = s ? s.nextSibling : i.firstChild, t && !t.written && t.node == i && r != o.dom && (t.written = !0), o.dom.parentNode == i)
          for (; r && r != o.dom; )
            r = fl(r);
        else
          i.insertBefore(o.dom, r);
        s = o.dom;
      }
      for (r = s ? s.nextSibling : i.firstChild, r && t && t.node == i && (t.written = !0); r; )
        r = fl(r);
    } else if (this.flags & 1)
      for (let i of this.children)
        i.flags & 7 && (i.sync(e, t), i.flags &= -8);
  }
  reuseDOM(e) {
  }
  localPosFromDOM(e, t) {
    let i;
    if (e == this.dom)
      i = this.dom.childNodes[t];
    else {
      let s = rt(e) == 0 ? 0 : t == 0 ? -1 : 1;
      for (; ; ) {
        let r = e.parentNode;
        if (r == this.dom)
          break;
        s == 0 && r.firstChild != r.lastChild && (e == r.firstChild ? s = -1 : s = 1), e = r;
      }
      s < 0 ? i = e : i = e.nextSibling;
    }
    if (i == this.dom.firstChild)
      return 0;
    for (; i && !Y.get(i); )
      i = i.nextSibling;
    if (!i)
      return this.length;
    for (let s = 0, r = 0; ; s++) {
      let o = this.children[s];
      if (o.dom == i)
        return r;
      r += o.length + o.breakAfter;
    }
  }
  domBoundsAround(e, t, i = 0) {
    let s = -1, r = -1, o = -1, l = -1;
    for (let a = 0, h = i, c = i; a < this.children.length; a++) {
      let f = this.children[a], u = h + f.length;
      if (h < e && u > t)
        return f.domBoundsAround(e, t, h);
      if (u >= e && s == -1 && (s = a, r = h), h > t && f.dom.parentNode == this.dom) {
        o = a, l = c;
        break;
      }
      c = u, h = u + f.breakAfter;
    }
    return {
      from: r,
      to: l < 0 ? i + this.length : l,
      startDOM: (s ? this.children[s - 1].dom.nextSibling : null) || this.dom.firstChild,
      endDOM: o < this.children.length && o >= 0 ? this.children[o].dom : null
    };
  }
  markDirty(e = !1) {
    this.flags |= 2, this.markParentsDirty(e);
  }
  markParentsDirty(e) {
    for (let t = this.parent; t; t = t.parent) {
      if (e && (t.flags |= 2), t.flags & 1)
        return;
      t.flags |= 1, e = !1;
    }
  }
  setParent(e) {
    this.parent != e && (this.parent = e, this.flags & 7 && this.markParentsDirty(!0));
  }
  setDOM(e) {
    this.dom != e && (this.dom && (this.dom.cmView = null), this.dom = e, e.cmView = this);
  }
  get rootView() {
    for (let e = this; ; ) {
      let t = e.parent;
      if (!t)
        return e;
      e = t;
    }
  }
  replaceChildren(e, t, i = uo) {
    this.markDirty();
    for (let s = e; s < t; s++) {
      let r = this.children[s];
      r.parent == this && i.indexOf(r) < 0 && r.destroy();
    }
    this.children.splice(e, t - e, ...i);
    for (let s = 0; s < i.length; s++)
      i[s].setParent(this);
  }
  ignoreMutation(e) {
    return !1;
  }
  ignoreEvent(e) {
    return !1;
  }
  childCursor(e = this.length) {
    return new mh(this.children, e, this.children.length);
  }
  childPos(e, t = 1) {
    return this.childCursor().findPos(e, t);
  }
  toString() {
    let e = this.constructor.name.replace("View", "");
    return e + (this.children.length ? "(" + this.children.join() + ")" : this.length ? "[" + (e == "Text" ? this.text : this.length) + "]" : "") + (this.breakAfter ? "#" : "");
  }
  static get(e) {
    return e.cmView;
  }
  get isEditable() {
    return !0;
  }
  get isWidget() {
    return !1;
  }
  get isHidden() {
    return !1;
  }
  merge(e, t, i, s, r, o) {
    return !1;
  }
  become(e) {
    return !1;
  }
  canReuseDOM(e) {
    return e.constructor == this.constructor && !((this.flags | e.flags) & 8);
  }
  // When this is a zero-length view with a side, this should return a
  // number <= 0 to indicate it is before its position, or a
  // number > 0 when after its position.
  getSide() {
    return 0;
  }
  destroy() {
    for (let e of this.children)
      e.parent == this && e.destroy();
    this.parent = null;
  }
}
Y.prototype.breakAfter = 0;
function fl(n) {
  let e = n.nextSibling;
  return n.parentNode.removeChild(n), e;
}
class mh {
  constructor(e, t, i) {
    this.children = e, this.pos = t, this.i = i, this.off = 0;
  }
  findPos(e, t = 1) {
    for (; ; ) {
      if (e > this.pos || e == this.pos && (t > 0 || this.i == 0 || this.children[this.i - 1].breakAfter))
        return this.off = e - this.pos, this;
      let i = this.children[--this.i];
      this.pos -= i.length + i.breakAfter;
    }
  }
}
function gh(n, e, t, i, s, r, o, l, a) {
  let { children: h } = n, c = h.length ? h[e] : null, f = r.length ? r[r.length - 1] : null, u = f ? f.breakAfter : o;
  if (!(e == i && c && !o && !u && r.length < 2 && c.merge(t, s, r.length ? f : null, t == 0, l, a))) {
    if (i < h.length) {
      let d = h[i];
      d && (s < d.length || d.breakAfter && (f != null && f.breakAfter)) ? (e == i && (d = d.split(s), s = 0), !u && f && d.merge(0, s, f, !0, 0, a) ? r[r.length - 1] = d : ((s || d.children.length && !d.children[0].length) && d.merge(0, s, null, !1, 0, a), r.push(d))) : d != null && d.breakAfter && (f ? f.breakAfter = 1 : o = 1), i++;
    }
    for (c && (c.breakAfter = o, t > 0 && (!o && r.length && c.merge(t, c.length, r[0], !1, l, 0) ? c.breakAfter = r.shift().breakAfter : (t < c.length || c.children.length && c.children[c.children.length - 1].length == 0) && c.merge(t, c.length, null, !1, l, 0), e++)); e < i && r.length; )
      if (h[i - 1].become(r[r.length - 1]))
        i--, r.pop(), a = r.length ? 0 : l;
      else if (h[e].become(r[0]))
        e++, r.shift(), l = r.length ? 0 : a;
      else
        break;
    !r.length && e && i < h.length && !h[e - 1].breakAfter && h[i].merge(0, 0, h[e - 1], !1, l, a) && e--, (e < i || r.length) && n.replaceChildren(e, i, r);
  }
}
function bh(n, e, t, i, s, r) {
  let o = n.childCursor(), { i: l, off: a } = o.findPos(t, 1), { i: h, off: c } = o.findPos(e, -1), f = e - t;
  for (let u of i)
    f += u.length;
  n.length += f, gh(n, h, c, l, a, i, 0, s, r);
}
let Te = typeof navigator < "u" ? navigator : { userAgent: "", vendor: "", platform: "" }, Cr = typeof document < "u" ? document : { documentElement: { style: {} } };
const Or = /* @__PURE__ */ /Edge\/(\d+)/.exec(Te.userAgent), yh = /* @__PURE__ */ /MSIE \d/.test(Te.userAgent), Ar = /* @__PURE__ */ /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(Te.userAgent), xs = !!(yh || Ar || Or), ul = !xs && /* @__PURE__ */ /gecko\/(\d+)/i.test(Te.userAgent), Is = !xs && /* @__PURE__ */ /Chrome\/(\d+)/.exec(Te.userAgent), dl = "webkitFontSmoothing" in Cr.documentElement.style, xh = !xs && /* @__PURE__ */ /Apple Computer/.test(Te.vendor), pl = xh && (/* @__PURE__ */ /Mobile\/\w+/.test(Te.userAgent) || Te.maxTouchPoints > 2);
var R = {
  mac: pl || /* @__PURE__ */ /Mac/.test(Te.platform),
  windows: /* @__PURE__ */ /Win/.test(Te.platform),
  linux: /* @__PURE__ */ /Linux|X11/.test(Te.platform),
  ie: xs,
  ie_version: yh ? Cr.documentMode || 6 : Ar ? +Ar[1] : Or ? +Or[1] : 0,
  gecko: ul,
  gecko_version: ul ? +(/* @__PURE__ */ /Firefox\/(\d+)/.exec(Te.userAgent) || [0, 0])[1] : 0,
  chrome: !!Is,
  chrome_version: Is ? +Is[1] : 0,
  ios: pl,
  android: /* @__PURE__ */ /Android\b/.test(Te.userAgent),
  webkit: dl,
  safari: xh,
  webkit_version: dl ? +(/* @__PURE__ */ /\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0,
  tabSize: Cr.documentElement.style.tabSize != null ? "tab-size" : "-moz-tab-size"
};
const rd = 256;
class ot extends Y {
  constructor(e) {
    super(), this.text = e;
  }
  get length() {
    return this.text.length;
  }
  createDOM(e) {
    this.setDOM(e || document.createTextNode(this.text));
  }
  sync(e, t) {
    this.dom || this.createDOM(), this.dom.nodeValue != this.text && (t && t.node == this.dom && (t.written = !0), this.dom.nodeValue = this.text);
  }
  reuseDOM(e) {
    e.nodeType == 3 && this.createDOM(e);
  }
  merge(e, t, i) {
    return this.flags & 8 || i && (!(i instanceof ot) || this.length - (t - e) + i.length > rd || i.flags & 8) ? !1 : (this.text = this.text.slice(0, e) + (i ? i.text : "") + this.text.slice(t), this.markDirty(), !0);
  }
  split(e) {
    let t = new ot(this.text.slice(e));
    return this.text = this.text.slice(0, e), this.markDirty(), t.flags |= this.flags & 8, t;
  }
  localPosFromDOM(e, t) {
    return e == this.dom ? t : t ? this.text.length : 0;
  }
  domAtPos(e) {
    return new ue(this.dom, e);
  }
  domBoundsAround(e, t, i) {
    return { from: i, to: i + this.length, startDOM: this.dom, endDOM: this.dom.nextSibling };
  }
  coordsAt(e, t) {
    return od(this.dom, e, t);
  }
}
class lt extends Y {
  constructor(e, t = [], i = 0) {
    super(), this.mark = e, this.children = t, this.length = i;
    for (let s of t)
      s.setParent(this);
  }
  setAttrs(e) {
    if (dh(e), this.mark.class && (e.className = this.mark.class), this.mark.attrs)
      for (let t in this.mark.attrs)
        e.setAttribute(t, this.mark.attrs[t]);
    return e;
  }
  canReuseDOM(e) {
    return super.canReuseDOM(e) && !((this.flags | e.flags) & 8);
  }
  reuseDOM(e) {
    e.nodeName == this.mark.tagName.toUpperCase() && (this.setDOM(e), this.flags |= 6);
  }
  sync(e, t) {
    this.dom ? this.flags & 4 && this.setAttrs(this.dom) : this.setDOM(this.setAttrs(document.createElement(this.mark.tagName))), super.sync(e, t);
  }
  merge(e, t, i, s, r, o) {
    return i && (!(i instanceof lt && i.mark.eq(this.mark)) || e && r <= 0 || t < this.length && o <= 0) ? !1 : (bh(this, e, t, i ? i.children.slice() : [], r - 1, o - 1), this.markDirty(), !0);
  }
  split(e) {
    let t = [], i = 0, s = -1, r = 0;
    for (let l of this.children) {
      let a = i + l.length;
      a > e && t.push(i < e ? l.split(e - i) : l), s < 0 && i >= e && (s = r), i = a, r++;
    }
    let o = this.length - e;
    return this.length = e, s > -1 && (this.children.length = s, this.markDirty()), new lt(this.mark, t, o);
  }
  domAtPos(e) {
    return wh(this, e);
  }
  coordsAt(e, t) {
    return Sh(this, e, t);
  }
}
function od(n, e, t) {
  let i = n.nodeValue.length;
  e > i && (e = i);
  let s = e, r = e, o = 0;
  e == 0 && t < 0 || e == i && t >= 0 ? R.chrome || R.gecko || (e ? (s--, o = 1) : r < i && (r++, o = -1)) : t < 0 ? s-- : r < i && r++;
  let l = It(n, s, r).getClientRects();
  if (!l.length)
    return null;
  let a = l[(o ? o < 0 : t >= 0) ? 0 : l.length - 1];
  return R.safari && !o && a.width == 0 && (a = Array.prototype.find.call(l, (h) => h.width) || a), o ? fo(a, o < 0) : a || null;
}
class mt extends Y {
  static create(e, t, i) {
    return new mt(e, t, i);
  }
  constructor(e, t, i) {
    super(), this.widget = e, this.length = t, this.side = i, this.prevWidget = null;
  }
  split(e) {
    let t = mt.create(this.widget, this.length - e, this.side);
    return this.length -= e, t;
  }
  sync(e) {
    (!this.dom || !this.widget.updateDOM(this.dom, e)) && (this.dom && this.prevWidget && this.prevWidget.destroy(this.dom), this.prevWidget = null, this.setDOM(this.widget.toDOM(e)), this.widget.editable || (this.dom.contentEditable = "false"));
  }
  getSide() {
    return this.side;
  }
  merge(e, t, i, s, r, o) {
    return i && (!(i instanceof mt) || !this.widget.compare(i.widget) || e > 0 && r <= 0 || t < this.length && o <= 0) ? !1 : (this.length = e + (i ? i.length : 0) + (this.length - t), !0);
  }
  become(e) {
    return e instanceof mt && e.side == this.side && this.widget.constructor == e.widget.constructor ? (this.widget.compare(e.widget) || this.markDirty(!0), this.dom && !this.prevWidget && (this.prevWidget = this.widget), this.widget = e.widget, this.length = e.length, !0) : !1;
  }
  ignoreMutation() {
    return !0;
  }
  ignoreEvent(e) {
    return this.widget.ignoreEvent(e);
  }
  get overrideDOMText() {
    if (this.length == 0)
      return E.empty;
    let e = this;
    for (; e.parent; )
      e = e.parent;
    let { view: t } = e, i = t && t.state.doc, s = this.posAtStart;
    return i ? i.slice(s, s + this.length) : E.empty;
  }
  domAtPos(e) {
    return (this.length ? e == 0 : this.side > 0) ? ue.before(this.dom) : ue.after(this.dom, e == this.length);
  }
  domBoundsAround() {
    return null;
  }
  coordsAt(e, t) {
    let i = this.widget.coordsAt(this.dom, e, t);
    if (i)
      return i;
    let s = this.dom.getClientRects(), r = null;
    if (!s.length)
      return null;
    let o = this.side ? this.side < 0 : e > 0;
    for (let l = o ? s.length - 1 : 0; r = s[l], !(e > 0 ? l == 0 : l == s.length - 1 || r.top < r.bottom); l += o ? -1 : 1)
      ;
    return fo(r, !o);
  }
  get isEditable() {
    return !1;
  }
  get isWidget() {
    return !0;
  }
  get isHidden() {
    return this.widget.isHidden;
  }
  destroy() {
    super.destroy(), this.dom && this.widget.destroy(this.dom);
  }
}
class ri extends Y {
  constructor(e) {
    super(), this.side = e;
  }
  get length() {
    return 0;
  }
  merge() {
    return !1;
  }
  become(e) {
    return e instanceof ri && e.side == this.side;
  }
  split() {
    return new ri(this.side);
  }
  sync() {
    if (!this.dom) {
      let e = document.createElement("img");
      e.className = "cm-widgetBuffer", e.setAttribute("aria-hidden", "true"), this.setDOM(e);
    }
  }
  getSide() {
    return this.side;
  }
  domAtPos(e) {
    return this.side > 0 ? ue.before(this.dom) : ue.after(this.dom);
  }
  localPosFromDOM() {
    return 0;
  }
  domBoundsAround() {
    return null;
  }
  coordsAt(e) {
    return this.dom.getBoundingClientRect();
  }
  get overrideDOMText() {
    return E.empty;
  }
  get isHidden() {
    return !0;
  }
}
ot.prototype.children = mt.prototype.children = ri.prototype.children = uo;
function wh(n, e) {
  let t = n.dom, { children: i } = n, s = 0;
  for (let r = 0; s < i.length; s++) {
    let o = i[s], l = r + o.length;
    if (!(l == r && o.getSide() <= 0)) {
      if (e > r && e < l && o.dom.parentNode == t)
        return o.domAtPos(e - r);
      if (e <= r)
        break;
      r = l;
    }
  }
  for (let r = s; r > 0; r--) {
    let o = i[r - 1];
    if (o.dom.parentNode == t)
      return o.domAtPos(o.length);
  }
  for (let r = s; r < i.length; r++) {
    let o = i[r];
    if (o.dom.parentNode == t)
      return o.domAtPos(0);
  }
  return new ue(t, 0);
}
function kh(n, e, t) {
  let i, { children: s } = n;
  t > 0 && e instanceof lt && s.length && (i = s[s.length - 1]) instanceof lt && i.mark.eq(e.mark) ? kh(i, e.children[0], t - 1) : (s.push(e), e.setParent(n)), n.length += e.length;
}
function Sh(n, e, t) {
  let i = null, s = -1, r = null, o = -1;
  function l(h, c) {
    for (let f = 0, u = 0; f < h.children.length && u <= c; f++) {
      let d = h.children[f], p = u + d.length;
      p >= c && (d.children.length ? l(d, c - u) : (!r || r.isHidden && t > 0) && (p > c || u == p && d.getSide() > 0) ? (r = d, o = c - u) : (u < c || u == p && d.getSide() < 0 && !d.isHidden) && (i = d, s = c - u)), u = p;
    }
  }
  l(n, e);
  let a = (t < 0 ? i : r) || i || r;
  return a ? a.coordsAt(Math.max(0, a == i ? s : o), t) : ld(n);
}
function ld(n) {
  let e = n.dom.lastChild;
  if (!e)
    return n.dom.getBoundingClientRect();
  let t = Bi(e);
  return t[t.length - 1] || null;
}
function Mr(n, e) {
  for (let t in n)
    t == "class" && e.class ? e.class += " " + n.class : t == "style" && e.style ? e.style += ";" + n.style : e[t] = n[t];
  return e;
}
const ml = /* @__PURE__ */ Object.create(null);
function po(n, e, t) {
  if (n == e)
    return !0;
  n || (n = ml), e || (e = ml);
  let i = Object.keys(n), s = Object.keys(e);
  if (i.length - (t && i.indexOf(t) > -1 ? 1 : 0) != s.length - (t && s.indexOf(t) > -1 ? 1 : 0))
    return !1;
  for (let r of i)
    if (r != t && (s.indexOf(r) == -1 || n[r] !== e[r]))
      return !1;
  return !0;
}
function Rr(n, e, t) {
  let i = !1;
  if (e)
    for (let s in e)
      t && s in t || (i = !0, s == "style" ? n.style.cssText = "" : n.removeAttribute(s));
  if (t)
    for (let s in t)
      e && e[s] == t[s] || (i = !0, s == "style" ? n.style.cssText = t[s] : n.setAttribute(s, t[s]));
  return i;
}
function ad(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t = 0; t < n.attributes.length; t++) {
    let i = n.attributes[t];
    e[i.name] = i.value;
  }
  return e;
}
class ie extends Y {
  constructor() {
    super(...arguments), this.children = [], this.length = 0, this.prevAttrs = void 0, this.attrs = null, this.breakAfter = 0;
  }
  // Consumes source
  merge(e, t, i, s, r, o) {
    if (i) {
      if (!(i instanceof ie))
        return !1;
      this.dom || i.transferDOM(this);
    }
    return s && this.setDeco(i ? i.attrs : null), bh(this, e, t, i ? i.children.slice() : [], r, o), !0;
  }
  split(e) {
    let t = new ie();
    if (t.breakAfter = this.breakAfter, this.length == 0)
      return t;
    let { i, off: s } = this.childPos(e);
    s && (t.append(this.children[i].split(s), 0), this.children[i].merge(s, this.children[i].length, null, !1, 0, 0), i++);
    for (let r = i; r < this.children.length; r++)
      t.append(this.children[r], 0);
    for (; i > 0 && this.children[i - 1].length == 0; )
      this.children[--i].destroy();
    return this.children.length = i, this.markDirty(), this.length = e, t;
  }
  transferDOM(e) {
    this.dom && (this.markDirty(), e.setDOM(this.dom), e.prevAttrs = this.prevAttrs === void 0 ? this.attrs : this.prevAttrs, this.prevAttrs = void 0, this.dom = null);
  }
  setDeco(e) {
    po(this.attrs, e) || (this.dom && (this.prevAttrs = this.attrs, this.markDirty()), this.attrs = e);
  }
  append(e, t) {
    kh(this, e, t);
  }
  // Only called when building a line view in ContentBuilder
  addLineDeco(e) {
    let t = e.spec.attributes, i = e.spec.class;
    t && (this.attrs = Mr(t, this.attrs || {})), i && (this.attrs = Mr({ class: i }, this.attrs || {}));
  }
  domAtPos(e) {
    return wh(this, e);
  }
  reuseDOM(e) {
    e.nodeName == "DIV" && (this.setDOM(e), this.flags |= 6);
  }
  sync(e, t) {
    var i;
    this.dom ? this.flags & 4 && (dh(this.dom), this.dom.className = "cm-line", this.prevAttrs = this.attrs ? null : void 0) : (this.setDOM(document.createElement("div")), this.dom.className = "cm-line", this.prevAttrs = this.attrs ? null : void 0), this.prevAttrs !== void 0 && (Rr(this.dom, this.prevAttrs, this.attrs), this.dom.classList.add("cm-line"), this.prevAttrs = void 0), super.sync(e, t);
    let s = this.dom.lastChild;
    for (; s && Y.get(s) instanceof lt; )
      s = s.lastChild;
    if (!s || !this.length || s.nodeName != "BR" && ((i = Y.get(s)) === null || i === void 0 ? void 0 : i.isEditable) == !1 && (!R.ios || !this.children.some((r) => r instanceof ot))) {
      let r = document.createElement("BR");
      r.cmIgnore = !0, this.dom.appendChild(r);
    }
  }
  measureTextSize() {
    if (this.children.length == 0 || this.length > 20)
      return null;
    let e = 0, t;
    for (let i of this.children) {
      if (!(i instanceof ot) || /[^ -~]/.test(i.text))
        return null;
      let s = Bi(i.dom);
      if (s.length != 1)
        return null;
      e += s[0].width, t = s[0].height;
    }
    return e ? {
      lineHeight: this.dom.getBoundingClientRect().height,
      charWidth: e / this.length,
      textHeight: t
    } : null;
  }
  coordsAt(e, t) {
    let i = Sh(this, e, t);
    if (!this.children.length && i && this.parent) {
      let { heightOracle: s } = this.parent.view.viewState, r = i.bottom - i.top;
      if (Math.abs(r - s.lineHeight) < 2 && s.textHeight < r) {
        let o = (r - s.textHeight) / 2;
        return { top: i.top + o, bottom: i.bottom - o, left: i.left, right: i.left };
      }
    }
    return i;
  }
  become(e) {
    return !1;
  }
  covers() {
    return !0;
  }
  static find(e, t) {
    for (let i = 0, s = 0; i < e.children.length; i++) {
      let r = e.children[i], o = s + r.length;
      if (o >= t) {
        if (r instanceof ie)
          return r;
        if (o > t)
          break;
      }
      s = o + r.breakAfter;
    }
    return null;
  }
}
class bt extends Y {
  constructor(e, t, i) {
    super(), this.widget = e, this.length = t, this.deco = i, this.breakAfter = 0, this.prevWidget = null;
  }
  merge(e, t, i, s, r, o) {
    return i && (!(i instanceof bt) || !this.widget.compare(i.widget) || e > 0 && r <= 0 || t < this.length && o <= 0) ? !1 : (this.length = e + (i ? i.length : 0) + (this.length - t), !0);
  }
  domAtPos(e) {
    return e == 0 ? ue.before(this.dom) : ue.after(this.dom, e == this.length);
  }
  split(e) {
    let t = this.length - e;
    this.length = e;
    let i = new bt(this.widget, t, this.deco);
    return i.breakAfter = this.breakAfter, i;
  }
  get children() {
    return uo;
  }
  sync(e) {
    (!this.dom || !this.widget.updateDOM(this.dom, e)) && (this.dom && this.prevWidget && this.prevWidget.destroy(this.dom), this.prevWidget = null, this.setDOM(this.widget.toDOM(e)), this.widget.editable || (this.dom.contentEditable = "false"));
  }
  get overrideDOMText() {
    return this.parent ? this.parent.view.state.doc.slice(this.posAtStart, this.posAtEnd) : E.empty;
  }
  domBoundsAround() {
    return null;
  }
  become(e) {
    return e instanceof bt && e.widget.constructor == this.widget.constructor ? (e.widget.compare(this.widget) || this.markDirty(!0), this.dom && !this.prevWidget && (this.prevWidget = this.widget), this.widget = e.widget, this.length = e.length, this.deco = e.deco, this.breakAfter = e.breakAfter, !0) : !1;
  }
  ignoreMutation() {
    return !0;
  }
  ignoreEvent(e) {
    return this.widget.ignoreEvent(e);
  }
  get isEditable() {
    return !1;
  }
  get isWidget() {
    return !0;
  }
  coordsAt(e, t) {
    return this.widget.coordsAt(this.dom, e, t);
  }
  destroy() {
    super.destroy(), this.dom && this.widget.destroy(this.dom);
  }
  covers(e) {
    let { startSide: t, endSide: i } = this.deco;
    return t == i ? !1 : e < 0 ? t < 0 : i > 0;
  }
}
class Mt {
  /**
  Compare this instance to another instance of the same type.
  (TypeScript can't express this, but only instances of the same
  specific class will be passed to this method.) This is used to
  avoid redrawing widgets when they are replaced by a new
  decoration of the same type. The default implementation just
  returns `false`, which will cause new instances of the widget to
  always be redrawn.
  */
  eq(e) {
    return !1;
  }
  /**
  Update a DOM element created by a widget of the same type (but
  different, non-`eq` content) to reflect this widget. May return
  true to indicate that it could update, false to indicate it
  couldn't (in which case the widget will be redrawn). The default
  implementation just returns false.
  */
  updateDOM(e, t) {
    return !1;
  }
  /**
  @internal
  */
  compare(e) {
    return this == e || this.constructor == e.constructor && this.eq(e);
  }
  /**
  The estimated height this widget will have, to be used when
  estimating the height of content that hasn't been drawn. May
  return -1 to indicate you don't know. The default implementation
  returns -1.
  */
  get estimatedHeight() {
    return -1;
  }
  /**
  For inline widgets that are displayed inline (as opposed to
  `inline-block`) and introduce line breaks (through `<br>` tags
  or textual newlines), this must indicate the amount of line
  breaks they introduce. Defaults to 0.
  */
  get lineBreaks() {
    return 0;
  }
  /**
  Can be used to configure which kinds of events inside the widget
  should be ignored by the editor. The default is to ignore all
  events.
  */
  ignoreEvent(e) {
    return !0;
  }
  /**
  Override the way screen coordinates for positions at/in the
  widget are found. `pos` will be the offset into the widget, and
  `side` the side of the position that is being queried—less than
  zero for before, greater than zero for after, and zero for
  directly at that position.
  */
  coordsAt(e, t, i) {
    return null;
  }
  /**
  @internal
  */
  get isHidden() {
    return !1;
  }
  /**
  @internal
  */
  get editable() {
    return !1;
  }
  /**
  This is called when the an instance of the widget is removed
  from the editor view.
  */
  destroy(e) {
  }
}
var ye = /* @__PURE__ */ function(n) {
  return n[n.Text = 0] = "Text", n[n.WidgetBefore = 1] = "WidgetBefore", n[n.WidgetAfter = 2] = "WidgetAfter", n[n.WidgetRange = 3] = "WidgetRange", n;
}(ye || (ye = {}));
class T extends Xt {
  constructor(e, t, i, s) {
    super(), this.startSide = e, this.endSide = t, this.widget = i, this.spec = s;
  }
  /**
  @internal
  */
  get heightRelevant() {
    return !1;
  }
  /**
  Create a mark decoration, which influences the styling of the
  content in its range. Nested mark decorations will cause nested
  DOM elements to be created. Nesting order is determined by
  precedence of the [facet](https://codemirror.net/6/docs/ref/#view.EditorView^decorations), with
  the higher-precedence decorations creating the inner DOM nodes.
  Such elements are split on line boundaries and on the boundaries
  of lower-precedence decorations.
  */
  static mark(e) {
    return new Qi(e);
  }
  /**
  Create a widget decoration, which displays a DOM element at the
  given position.
  */
  static widget(e) {
    let t = Math.max(-1e4, Math.min(1e4, e.side || 0)), i = !!e.block;
    return t += i && !e.inlineOrder ? t > 0 ? 3e8 : -4e8 : t > 0 ? 1e8 : -1e8, new Ct(e, t, t, i, e.widget || null, !1);
  }
  /**
  Create a replace decoration which replaces the given range with
  a widget, or simply hides it.
  */
  static replace(e) {
    let t = !!e.block, i, s;
    if (e.isBlockGap)
      i = -5e8, s = 4e8;
    else {
      let { start: r, end: o } = vh(e, t);
      i = (r ? t ? -3e8 : -1 : 5e8) - 1, s = (o ? t ? 2e8 : 1 : -6e8) + 1;
    }
    return new Ct(e, i, s, t, e.widget || null, !0);
  }
  /**
  Create a line decoration, which can add DOM attributes to the
  line starting at the given position.
  */
  static line(e) {
    return new Ui(e);
  }
  /**
  Build a [`DecorationSet`](https://codemirror.net/6/docs/ref/#view.DecorationSet) from the given
  decorated range or ranges. If the ranges aren't already sorted,
  pass `true` for `sort` to make the library sort them for you.
  */
  static set(e, t = !1) {
    return I.of(e, t);
  }
  /**
  @internal
  */
  hasHeight() {
    return this.widget ? this.widget.estimatedHeight > -1 : !1;
  }
}
T.none = I.empty;
class Qi extends T {
  constructor(e) {
    let { start: t, end: i } = vh(e);
    super(t ? -1 : 5e8, i ? 1 : -6e8, null, e), this.tagName = e.tagName || "span", this.class = e.class || "", this.attrs = e.attributes || null;
  }
  eq(e) {
    var t, i;
    return this == e || e instanceof Qi && this.tagName == e.tagName && (this.class || ((t = this.attrs) === null || t === void 0 ? void 0 : t.class)) == (e.class || ((i = e.attrs) === null || i === void 0 ? void 0 : i.class)) && po(this.attrs, e.attrs, "class");
  }
  range(e, t = e) {
    if (e >= t)
      throw new RangeError("Mark decorations may not be empty");
    return super.range(e, t);
  }
}
Qi.prototype.point = !1;
class Ui extends T {
  constructor(e) {
    super(-2e8, -2e8, null, e);
  }
  eq(e) {
    return e instanceof Ui && this.spec.class == e.spec.class && po(this.spec.attributes, e.spec.attributes);
  }
  range(e, t = e) {
    if (t != e)
      throw new RangeError("Line decoration ranges must be zero-length");
    return super.range(e, t);
  }
}
Ui.prototype.mapMode = be.TrackBefore;
Ui.prototype.point = !0;
class Ct extends T {
  constructor(e, t, i, s, r, o) {
    super(t, i, r, e), this.block = s, this.isReplace = o, this.mapMode = s ? t <= 0 ? be.TrackBefore : be.TrackAfter : be.TrackDel;
  }
  // Only relevant when this.block == true
  get type() {
    return this.startSide != this.endSide ? ye.WidgetRange : this.startSide <= 0 ? ye.WidgetBefore : ye.WidgetAfter;
  }
  get heightRelevant() {
    return this.block || !!this.widget && (this.widget.estimatedHeight >= 5 || this.widget.lineBreaks > 0);
  }
  eq(e) {
    return e instanceof Ct && hd(this.widget, e.widget) && this.block == e.block && this.startSide == e.startSide && this.endSide == e.endSide;
  }
  range(e, t = e) {
    if (this.isReplace && (e > t || e == t && this.startSide > 0 && this.endSide <= 0))
      throw new RangeError("Invalid range for replacement decoration");
    if (!this.isReplace && t != e)
      throw new RangeError("Widget decorations can only have zero-length ranges");
    return super.range(e, t);
  }
}
Ct.prototype.point = !0;
function vh(n, e = !1) {
  let { inclusiveStart: t, inclusiveEnd: i } = n;
  return t == null && (t = n.inclusive), i == null && (i = n.inclusive), { start: t ?? e, end: i ?? e };
}
function hd(n, e) {
  return n == e || !!(n && e && n.compare(e));
}
function Zr(n, e, t, i = 0) {
  let s = t.length - 1;
  s >= 0 && t[s] + i >= n ? t[s] = Math.max(t[s], e) : t.push(n, e);
}
class Ri {
  constructor(e, t, i, s) {
    this.doc = e, this.pos = t, this.end = i, this.disallowBlockEffectsFor = s, this.content = [], this.curLine = null, this.breakAtStart = 0, this.pendingBuffer = 0, this.bufferMarks = [], this.atCursorPos = !0, this.openStart = -1, this.openEnd = -1, this.text = "", this.textOff = 0, this.cursor = e.iter(), this.skip = t;
  }
  posCovered() {
    if (this.content.length == 0)
      return !this.breakAtStart && this.doc.lineAt(this.pos).from != this.pos;
    let e = this.content[this.content.length - 1];
    return !(e.breakAfter || e instanceof bt && e.deco.endSide < 0);
  }
  getLine() {
    return this.curLine || (this.content.push(this.curLine = new ie()), this.atCursorPos = !0), this.curLine;
  }
  flushBuffer(e = this.bufferMarks) {
    this.pendingBuffer && (this.curLine.append(hn(new ri(-1), e), e.length), this.pendingBuffer = 0);
  }
  addBlockWidget(e) {
    this.flushBuffer(), this.curLine = null, this.content.push(e);
  }
  finish(e) {
    this.pendingBuffer && e <= this.bufferMarks.length ? this.flushBuffer() : this.pendingBuffer = 0, !this.posCovered() && !(e && this.content.length && this.content[this.content.length - 1] instanceof bt) && this.getLine();
  }
  buildText(e, t, i) {
    for (; e > 0; ) {
      if (this.textOff == this.text.length) {
        let { value: r, lineBreak: o, done: l } = this.cursor.next(this.skip);
        if (this.skip = 0, l)
          throw new Error("Ran out of text content when drawing inline views");
        if (o) {
          this.posCovered() || this.getLine(), this.content.length ? this.content[this.content.length - 1].breakAfter = 1 : this.breakAtStart = 1, this.flushBuffer(), this.curLine = null, this.atCursorPos = !0, e--;
          continue;
        } else
          this.text = r, this.textOff = 0;
      }
      let s = Math.min(
        this.text.length - this.textOff,
        e,
        512
        /* T.Chunk */
      );
      this.flushBuffer(t.slice(t.length - i)), this.getLine().append(hn(new ot(this.text.slice(this.textOff, this.textOff + s)), t), i), this.atCursorPos = !0, this.textOff += s, e -= s, i = 0;
    }
  }
  span(e, t, i, s) {
    this.buildText(t - e, i, s), this.pos = t, this.openStart < 0 && (this.openStart = s);
  }
  point(e, t, i, s, r, o) {
    if (this.disallowBlockEffectsFor[o] && i instanceof Ct) {
      if (i.block)
        throw new RangeError("Block decorations may not be specified via plugins");
      if (t > this.doc.lineAt(this.pos).to)
        throw new RangeError("Decorations that replace line breaks may not be specified via plugins");
    }
    let l = t - e;
    if (i instanceof Ct)
      if (i.block)
        i.startSide > 0 && !this.posCovered() && this.getLine(), this.addBlockWidget(new bt(i.widget || new gl("div"), l, i));
      else {
        let a = mt.create(i.widget || new gl("span"), l, l ? 0 : i.startSide), h = this.atCursorPos && !a.isEditable && r <= s.length && (e < t || i.startSide > 0), c = !a.isEditable && (e < t || r > s.length || i.startSide <= 0), f = this.getLine();
        this.pendingBuffer == 2 && !h && !a.isEditable && (this.pendingBuffer = 0), this.flushBuffer(s), h && (f.append(hn(new ri(1), s), r), r = s.length + Math.max(0, r - s.length)), f.append(hn(a, s), r), this.atCursorPos = c, this.pendingBuffer = c ? e < t || r > s.length ? 1 : 2 : 0, this.pendingBuffer && (this.bufferMarks = s.slice());
      }
    else
      this.doc.lineAt(this.pos).from == this.pos && this.getLine().addLineDeco(i);
    l && (this.textOff + l <= this.text.length ? this.textOff += l : (this.skip += l - (this.text.length - this.textOff), this.text = "", this.textOff = 0), this.pos = t), this.openStart < 0 && (this.openStart = r);
  }
  static build(e, t, i, s, r) {
    let o = new Ri(e, t, i, r);
    return o.openEnd = I.spans(s, t, i, o), o.openStart < 0 && (o.openStart = o.openEnd), o.finish(o.openEnd), o;
  }
}
function hn(n, e) {
  for (let t of e)
    n = new lt(t, [n], n.length);
  return n;
}
class gl extends Mt {
  constructor(e) {
    super(), this.tag = e;
  }
  eq(e) {
    return e.tag == this.tag;
  }
  toDOM() {
    return document.createElement(this.tag);
  }
  updateDOM(e) {
    return e.nodeName.toLowerCase() == this.tag;
  }
  get isHidden() {
    return !0;
  }
}
var J = /* @__PURE__ */ function(n) {
  return n[n.LTR = 0] = "LTR", n[n.RTL = 1] = "RTL", n;
}(J || (J = {}));
const Et = J.LTR, mo = J.RTL;
function Ch(n) {
  let e = [];
  for (let t = 0; t < n.length; t++)
    e.push(1 << +n[t]);
  return e;
}
const cd = /* @__PURE__ */ Ch("88888888888888888888888888888888888666888888787833333333337888888000000000000000000000000008888880000000000000000000000000088888888888888888888888888888888888887866668888088888663380888308888800000000000000000000000800000000000000000000000000000008"), fd = /* @__PURE__ */ Ch("4444448826627288999999999992222222222222222222222222222222222222222222222229999999999999999999994444444444644222822222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222999999949999999229989999223333333333"), Lr = /* @__PURE__ */ Object.create(null), Ye = [];
for (let n of ["()", "[]", "{}"]) {
  let e = /* @__PURE__ */ n.charCodeAt(0), t = /* @__PURE__ */ n.charCodeAt(1);
  Lr[e] = t, Lr[t] = -e;
}
function Oh(n) {
  return n <= 247 ? cd[n] : 1424 <= n && n <= 1524 ? 2 : 1536 <= n && n <= 1785 ? fd[n - 1536] : 1774 <= n && n <= 2220 ? 4 : 8192 <= n && n <= 8204 ? 256 : 64336 <= n && n <= 65023 ? 4 : 1;
}
const ud = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac\ufb50-\ufdff]/;
class gt {
  /**
  The direction of this span.
  */
  get dir() {
    return this.level % 2 ? mo : Et;
  }
  /**
  @internal
  */
  constructor(e, t, i) {
    this.from = e, this.to = t, this.level = i;
  }
  /**
  @internal
  */
  side(e, t) {
    return this.dir == t == e ? this.to : this.from;
  }
  /**
  @internal
  */
  forward(e, t) {
    return e == (this.dir == t);
  }
  /**
  @internal
  */
  static find(e, t, i, s) {
    let r = -1;
    for (let o = 0; o < e.length; o++) {
      let l = e[o];
      if (l.from <= t && l.to >= t) {
        if (l.level == i)
          return o;
        (r < 0 || (s != 0 ? s < 0 ? l.from < t : l.to > t : e[r].level > l.level)) && (r = o);
      }
    }
    if (r < 0)
      throw new RangeError("Index out of range");
    return r;
  }
}
function Ah(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++) {
    let i = n[t], s = e[t];
    if (i.from != s.from || i.to != s.to || i.direction != s.direction || !Ah(i.inner, s.inner))
      return !1;
  }
  return !0;
}
const F = [];
function dd(n, e, t, i, s) {
  for (let r = 0; r <= i.length; r++) {
    let o = r ? i[r - 1].to : e, l = r < i.length ? i[r].from : t, a = r ? 256 : s;
    for (let h = o, c = a, f = a; h < l; h++) {
      let u = Oh(n.charCodeAt(h));
      u == 512 ? u = c : u == 8 && f == 4 && (u = 16), F[h] = u == 4 ? 2 : u, u & 7 && (f = u), c = u;
    }
    for (let h = o, c = a, f = a; h < l; h++) {
      let u = F[h];
      if (u == 128)
        h < l - 1 && c == F[h + 1] && c & 24 ? u = F[h] = c : F[h] = 256;
      else if (u == 64) {
        let d = h + 1;
        for (; d < l && F[d] == 64; )
          d++;
        let p = h && c == 8 || d < t && F[d] == 8 ? f == 1 ? 1 : 8 : 256;
        for (let g = h; g < d; g++)
          F[g] = p;
        h = d - 1;
      } else
        u == 8 && f == 1 && (F[h] = 1);
      c = u, u & 7 && (f = u);
    }
  }
}
function pd(n, e, t, i, s) {
  let r = s == 1 ? 2 : 1;
  for (let o = 0, l = 0, a = 0; o <= i.length; o++) {
    let h = o ? i[o - 1].to : e, c = o < i.length ? i[o].from : t;
    for (let f = h, u, d, p; f < c; f++)
      if (d = Lr[u = n.charCodeAt(f)])
        if (d < 0) {
          for (let g = l - 3; g >= 0; g -= 3)
            if (Ye[g + 1] == -d) {
              let m = Ye[g + 2], b = m & 2 ? s : m & 4 ? m & 1 ? r : s : 0;
              b && (F[f] = F[Ye[g]] = b), l = g;
              break;
            }
        } else {
          if (Ye.length == 189)
            break;
          Ye[l++] = f, Ye[l++] = u, Ye[l++] = a;
        }
      else if ((p = F[f]) == 2 || p == 1) {
        let g = p == s;
        a = g ? 0 : 1;
        for (let m = l - 3; m >= 0; m -= 3) {
          let b = Ye[m + 2];
          if (b & 2)
            break;
          if (g)
            Ye[m + 2] |= 2;
          else {
            if (b & 4)
              break;
            Ye[m + 2] |= 4;
          }
        }
      }
  }
}
function md(n, e, t, i) {
  for (let s = 0, r = i; s <= t.length; s++) {
    let o = s ? t[s - 1].to : n, l = s < t.length ? t[s].from : e;
    for (let a = o; a < l; ) {
      let h = F[a];
      if (h == 256) {
        let c = a + 1;
        for (; ; )
          if (c == l) {
            if (s == t.length)
              break;
            c = t[s++].to, l = s < t.length ? t[s].from : e;
          } else if (F[c] == 256)
            c++;
          else
            break;
        let f = r == 1, u = (c < e ? F[c] : i) == 1, d = f == u ? f ? 1 : 2 : i;
        for (let p = c, g = s, m = g ? t[g - 1].to : n; p > a; )
          p == m && (p = t[--g].from, m = g ? t[g - 1].to : n), F[--p] = d;
        a = c;
      } else
        r = h, a++;
    }
  }
}
function Tr(n, e, t, i, s, r, o) {
  let l = i % 2 ? 2 : 1;
  if (i % 2 == s % 2)
    for (let a = e, h = 0; a < t; ) {
      let c = !0, f = !1;
      if (h == r.length || a < r[h].from) {
        let g = F[a];
        g != l && (c = !1, f = g == 16);
      }
      let u = !c && l == 1 ? [] : null, d = c ? i : i + 1, p = a;
      e:
        for (; ; )
          if (h < r.length && p == r[h].from) {
            if (f)
              break e;
            let g = r[h];
            if (!c)
              for (let m = g.to, b = h + 1; ; ) {
                if (m == t)
                  break e;
                if (b < r.length && r[b].from == m)
                  m = r[b++].to;
                else {
                  if (F[m] == l)
                    break e;
                  break;
                }
              }
            if (h++, u)
              u.push(g);
            else {
              g.from > a && o.push(new gt(a, g.from, d));
              let m = g.direction == Et != !(d % 2);
              Dr(n, m ? i + 1 : i, s, g.inner, g.from, g.to, o), a = g.to;
            }
            p = g.to;
          } else {
            if (p == t || (c ? F[p] != l : F[p] == l))
              break;
            p++;
          }
      u ? Tr(n, a, p, i + 1, s, u, o) : a < p && o.push(new gt(a, p, d)), a = p;
    }
  else
    for (let a = t, h = r.length; a > e; ) {
      let c = !0, f = !1;
      if (!h || a > r[h - 1].to) {
        let g = F[a - 1];
        g != l && (c = !1, f = g == 16);
      }
      let u = !c && l == 1 ? [] : null, d = c ? i : i + 1, p = a;
      e:
        for (; ; )
          if (h && p == r[h - 1].to) {
            if (f)
              break e;
            let g = r[--h];
            if (!c)
              for (let m = g.from, b = h; ; ) {
                if (m == e)
                  break e;
                if (b && r[b - 1].to == m)
                  m = r[--b].from;
                else {
                  if (F[m - 1] == l)
                    break e;
                  break;
                }
              }
            if (u)
              u.push(g);
            else {
              g.to < a && o.push(new gt(g.to, a, d));
              let m = g.direction == Et != !(d % 2);
              Dr(n, m ? i + 1 : i, s, g.inner, g.from, g.to, o), a = g.from;
            }
            p = g.from;
          } else {
            if (p == e || (c ? F[p - 1] != l : F[p - 1] == l))
              break;
            p--;
          }
      u ? Tr(n, p, a, i + 1, s, u, o) : p < a && o.push(new gt(p, a, d)), a = p;
    }
}
function Dr(n, e, t, i, s, r, o) {
  let l = e % 2 ? 2 : 1;
  dd(n, s, r, i, l), pd(n, s, r, i, l), md(s, r, i, l), Tr(n, s, r, e, t, i, o);
}
function gd(n, e, t) {
  if (!n)
    return [new gt(0, 0, e == mo ? 1 : 0)];
  if (e == Et && !t.length && !ud.test(n))
    return Mh(n.length);
  if (t.length)
    for (; n.length > F.length; )
      F[F.length] = 256;
  let i = [], s = e == Et ? 0 : 1;
  return Dr(n, s, s, t, 0, n.length, i), i;
}
function Mh(n) {
  return [new gt(0, n, 0)];
}
let Rh = "";
function bd(n, e, t, i, s) {
  var r;
  let o = i.head - n.from, l = gt.find(e, o, (r = i.bidiLevel) !== null && r !== void 0 ? r : -1, i.assoc), a = e[l], h = a.side(s, t);
  if (o == h) {
    let u = l += s ? 1 : -1;
    if (u < 0 || u >= e.length)
      return null;
    a = e[l = u], o = a.side(!s, t), h = a.side(s, t);
  }
  let c = ce(n.text, o, a.forward(s, t));
  (c < a.from || c > a.to) && (c = h), Rh = n.text.slice(Math.min(o, c), Math.max(o, c));
  let f = l == (s ? e.length - 1 : 0) ? null : e[l + (s ? 1 : -1)];
  return f && c == h && f.level + (s ? 0 : 1) < a.level ? y.cursor(f.side(!s, t) + n.from, f.forward(s, t) ? 1 : -1, f.level) : y.cursor(c + n.from, a.forward(s, t) ? -1 : 1, a.level);
}
function yd(n, e, t) {
  for (let i = e; i < t; i++) {
    let s = Oh(n.charCodeAt(i));
    if (s == 1)
      return Et;
    if (s == 2 || s == 4)
      return mo;
  }
  return Et;
}
const Zh = /* @__PURE__ */ M.define(), Lh = /* @__PURE__ */ M.define(), Th = /* @__PURE__ */ M.define(), Dh = /* @__PURE__ */ M.define(), Pr = /* @__PURE__ */ M.define(), Ph = /* @__PURE__ */ M.define(), Vh = /* @__PURE__ */ M.define(), Bh = /* @__PURE__ */ M.define({
  combine: (n) => n.some((e) => e)
}), Wh = /* @__PURE__ */ M.define({
  combine: (n) => n.some((e) => e)
});
class ti {
  constructor(e, t = "nearest", i = "nearest", s = 5, r = 5, o = !1) {
    this.range = e, this.y = t, this.x = i, this.yMargin = s, this.xMargin = r, this.isSnapshot = o;
  }
  map(e) {
    return e.empty ? this : new ti(this.range.map(e), this.y, this.x, this.yMargin, this.xMargin, this.isSnapshot);
  }
  clip(e) {
    return this.range.to <= e.doc.length ? this : new ti(y.cursor(e.doc.length), this.y, this.x, this.yMargin, this.xMargin, this.isSnapshot);
  }
}
const cn = /* @__PURE__ */ L.define({ map: (n, e) => n.map(e) });
function Pe(n, e, t) {
  let i = n.facet(Dh);
  i.length ? i[0](e) : window.onerror ? window.onerror(String(e), t, void 0, void 0, e) : t ? console.error(t + ":", e) : console.error(e);
}
const ws = /* @__PURE__ */ M.define({ combine: (n) => n.length ? n[0] : !0 });
let xd = 0;
const wi = /* @__PURE__ */ M.define();
class _ {
  constructor(e, t, i, s, r) {
    this.id = e, this.create = t, this.domEventHandlers = i, this.domEventObservers = s, this.extension = r(this);
  }
  /**
  Define a plugin from a constructor function that creates the
  plugin's value, given an editor view.
  */
  static define(e, t) {
    const { eventHandlers: i, eventObservers: s, provide: r, decorations: o } = t || {};
    return new _(xd++, e, i, s, (l) => {
      let a = [wi.of(l)];
      return o && a.push(Xi.of((h) => {
        let c = h.plugin(l);
        return c ? o(c) : T.none;
      })), r && a.push(r(l)), a;
    });
  }
  /**
  Create a plugin for a class whose constructor takes a single
  editor view as argument.
  */
  static fromClass(e, t) {
    return _.define((i) => new e(i), t);
  }
}
class Es {
  constructor(e) {
    this.spec = e, this.mustUpdate = null, this.value = null;
  }
  update(e) {
    if (this.value) {
      if (this.mustUpdate) {
        let t = this.mustUpdate;
        if (this.mustUpdate = null, this.value.update)
          try {
            this.value.update(t);
          } catch (i) {
            if (Pe(t.state, i, "CodeMirror plugin crashed"), this.value.destroy)
              try {
                this.value.destroy();
              } catch {
              }
            this.deactivate();
          }
      }
    } else if (this.spec)
      try {
        this.value = this.spec.create(e);
      } catch (t) {
        Pe(e.state, t, "CodeMirror plugin crashed"), this.deactivate();
      }
    return this;
  }
  destroy(e) {
    var t;
    if (!((t = this.value) === null || t === void 0) && t.destroy)
      try {
        this.value.destroy();
      } catch (i) {
        Pe(e.state, i, "CodeMirror plugin crashed");
      }
  }
  deactivate() {
    this.spec = this.value = null;
  }
}
const Xh = /* @__PURE__ */ M.define(), go = /* @__PURE__ */ M.define(), Xi = /* @__PURE__ */ M.define(), Ih = /* @__PURE__ */ M.define(), bo = /* @__PURE__ */ M.define(), Eh = /* @__PURE__ */ M.define();
function bl(n, e) {
  let t = n.state.facet(Eh);
  if (!t.length)
    return t;
  let i = t.map((r) => r instanceof Function ? r(n) : r), s = [];
  return I.spans(i, e.from, e.to, {
    point() {
    },
    span(r, o, l, a) {
      let h = r - e.from, c = o - e.from, f = s;
      for (let u = l.length - 1; u >= 0; u--, a--) {
        let d = l[u].spec.bidiIsolate, p;
        if (d == null && (d = yd(e.text, h, c)), a > 0 && f.length && (p = f[f.length - 1]).to == h && p.direction == d)
          p.to = c, f = p.inner;
        else {
          let g = { from: h, to: c, direction: d, inner: [] };
          f.push(g), f = g.inner;
        }
      }
    }
  }), s;
}
const Nh = /* @__PURE__ */ M.define();
function Gh(n) {
  let e = 0, t = 0, i = 0, s = 0;
  for (let r of n.state.facet(Nh)) {
    let o = r(n);
    o && (o.left != null && (e = Math.max(e, o.left)), o.right != null && (t = Math.max(t, o.right)), o.top != null && (i = Math.max(i, o.top)), o.bottom != null && (s = Math.max(s, o.bottom)));
  }
  return { left: e, right: t, top: i, bottom: s };
}
const ki = /* @__PURE__ */ M.define();
class Ee {
  constructor(e, t, i, s) {
    this.fromA = e, this.toA = t, this.fromB = i, this.toB = s;
  }
  join(e) {
    return new Ee(Math.min(this.fromA, e.fromA), Math.max(this.toA, e.toA), Math.min(this.fromB, e.fromB), Math.max(this.toB, e.toB));
  }
  addToSet(e) {
    let t = e.length, i = this;
    for (; t > 0; t--) {
      let s = e[t - 1];
      if (!(s.fromA > i.toA)) {
        if (s.toA < i.fromA)
          break;
        i = i.join(s), e.splice(t - 1, 1);
      }
    }
    return e.splice(t, 0, i), e;
  }
  static extendWithRanges(e, t) {
    if (t.length == 0)
      return e;
    let i = [];
    for (let s = 0, r = 0, o = 0, l = 0; ; s++) {
      let a = s == e.length ? null : e[s], h = o - l, c = a ? a.fromB : 1e9;
      for (; r < t.length && t[r] < c; ) {
        let f = t[r], u = t[r + 1], d = Math.max(l, f), p = Math.min(c, u);
        if (d <= p && new Ee(d + h, p + h, d, p).addToSet(i), u > c)
          break;
        r += 2;
      }
      if (!a)
        return i;
      new Ee(a.fromA, a.toA, a.fromB, a.toB).addToSet(i), o = a.toA, l = a.toB;
    }
  }
}
class $n {
  constructor(e, t, i) {
    this.view = e, this.state = t, this.transactions = i, this.flags = 0, this.startState = e.state, this.changes = ne.empty(this.startState.doc.length);
    for (let r of i)
      this.changes = this.changes.compose(r.changes);
    let s = [];
    this.changes.iterChangedRanges((r, o, l, a) => s.push(new Ee(r, o, l, a))), this.changedRanges = s;
  }
  /**
  @internal
  */
  static create(e, t, i) {
    return new $n(e, t, i);
  }
  /**
  Tells you whether the [viewport](https://codemirror.net/6/docs/ref/#view.EditorView.viewport) or
  [visible ranges](https://codemirror.net/6/docs/ref/#view.EditorView.visibleRanges) changed in this
  update.
  */
  get viewportChanged() {
    return (this.flags & 4) > 0;
  }
  /**
  Indicates whether the height of a block element in the editor
  changed in this update.
  */
  get heightChanged() {
    return (this.flags & 2) > 0;
  }
  /**
  Returns true when the document was modified or the size of the
  editor, or elements within the editor, changed.
  */
  get geometryChanged() {
    return this.docChanged || (this.flags & 10) > 0;
  }
  /**
  True when this update indicates a focus change.
  */
  get focusChanged() {
    return (this.flags & 1) > 0;
  }
  /**
  Whether the document changed in this update.
  */
  get docChanged() {
    return !this.changes.empty;
  }
  /**
  Whether the selection was explicitly set in this update.
  */
  get selectionSet() {
    return this.transactions.some((e) => e.selection);
  }
  /**
  @internal
  */
  get empty() {
    return this.flags == 0 && this.transactions.length == 0;
  }
}
class yl extends Y {
  get length() {
    return this.view.state.doc.length;
  }
  constructor(e) {
    super(), this.view = e, this.decorations = [], this.dynamicDecorationMap = [], this.domChanged = null, this.hasComposition = null, this.markedForComposition = /* @__PURE__ */ new Set(), this.minWidth = 0, this.minWidthFrom = 0, this.minWidthTo = 0, this.impreciseAnchor = null, this.impreciseHead = null, this.forceSelection = !1, this.lastUpdate = Date.now(), this.setDOM(e.contentDOM), this.children = [new ie()], this.children[0].setParent(this), this.updateDeco(), this.updateInner([new Ee(0, 0, 0, e.state.doc.length)], 0, null);
  }
  // Update the document view to a given state.
  update(e) {
    var t;
    let i = e.changedRanges;
    this.minWidth > 0 && i.length && (i.every(({ fromA: h, toA: c }) => c < this.minWidthFrom || h > this.minWidthTo) ? (this.minWidthFrom = e.changes.mapPos(this.minWidthFrom, 1), this.minWidthTo = e.changes.mapPos(this.minWidthTo, 1)) : this.minWidth = this.minWidthFrom = this.minWidthTo = 0);
    let s = -1;
    this.view.inputState.composing >= 0 && (!((t = this.domChanged) === null || t === void 0) && t.newSel ? s = this.domChanged.newSel.head : !Ad(e.changes, this.hasComposition) && !e.selectionSet && (s = e.state.selection.main.head));
    let r = s > -1 ? kd(this.view, e.changes, s) : null;
    if (this.domChanged = null, this.hasComposition) {
      this.markedForComposition.clear();
      let { from: h, to: c } = this.hasComposition;
      i = new Ee(h, c, e.changes.mapPos(h, -1), e.changes.mapPos(c, 1)).addToSet(i.slice());
    }
    this.hasComposition = r ? { from: r.range.fromB, to: r.range.toB } : null, (R.ie || R.chrome) && !r && e && e.state.doc.lines != e.startState.doc.lines && (this.forceSelection = !0);
    let o = this.decorations, l = this.updateDeco(), a = Cd(o, l, e.changes);
    return i = Ee.extendWithRanges(i, a), !(this.flags & 7) && i.length == 0 ? !1 : (this.updateInner(i, e.startState.doc.length, r), e.transactions.length && (this.lastUpdate = Date.now()), !0);
  }
  // Used by update and the constructor do perform the actual DOM
  // update
  updateInner(e, t, i) {
    this.view.viewState.mustMeasureContent = !0, this.updateChildren(e, t, i);
    let { observer: s } = this.view;
    s.ignore(() => {
      this.dom.style.height = this.view.viewState.contentHeight / this.view.scaleY + "px", this.dom.style.flexBasis = this.minWidth ? this.minWidth + "px" : "";
      let o = R.chrome || R.ios ? { node: s.selectionRange.focusNode, written: !1 } : void 0;
      this.sync(this.view, o), this.flags &= -8, o && (o.written || s.selectionRange.focusNode != o.node) && (this.forceSelection = !0), this.dom.style.height = "";
    }), this.markedForComposition.forEach(
      (o) => o.flags &= -9
      /* ViewFlag.Composition */
    );
    let r = [];
    if (this.view.viewport.from || this.view.viewport.to < this.view.state.doc.length)
      for (let o of this.children)
        o instanceof bt && o.widget instanceof xl && r.push(o.dom);
    s.updateGaps(r);
  }
  updateChildren(e, t, i) {
    let s = i ? i.range.addToSet(e.slice()) : e, r = this.childCursor(t);
    for (let o = s.length - 1; ; o--) {
      let l = o >= 0 ? s[o] : null;
      if (!l)
        break;
      let { fromA: a, toA: h, fromB: c, toB: f } = l, u, d, p, g;
      if (i && i.range.fromB < f && i.range.toB > c) {
        let S = Ri.build(this.view.state.doc, c, i.range.fromB, this.decorations, this.dynamicDecorationMap), w = Ri.build(this.view.state.doc, i.range.toB, f, this.decorations, this.dynamicDecorationMap);
        d = S.breakAtStart, p = S.openStart, g = w.openEnd;
        let A = this.compositionView(i);
        w.breakAtStart ? A.breakAfter = 1 : w.content.length && A.merge(A.length, A.length, w.content[0], !1, w.openStart, 0) && (A.breakAfter = w.content[0].breakAfter, w.content.shift()), S.content.length && A.merge(0, 0, S.content[S.content.length - 1], !0, 0, S.openEnd) && S.content.pop(), u = S.content.concat(A).concat(w.content);
      } else
        ({ content: u, breakAtStart: d, openStart: p, openEnd: g } = Ri.build(this.view.state.doc, c, f, this.decorations, this.dynamicDecorationMap));
      let { i: m, off: b } = r.findPos(h, 1), { i: k, off: C } = r.findPos(a, -1);
      gh(this, k, C, m, b, u, d, p, g);
    }
    i && this.fixCompositionDOM(i);
  }
  compositionView(e) {
    let t = new ot(e.text.nodeValue);
    t.flags |= 8;
    for (let { deco: s } of e.marks)
      t = new lt(s, [t], t.length);
    let i = new ie();
    return i.append(t, 0), i;
  }
  fixCompositionDOM(e) {
    let t = (r, o) => {
      o.flags |= 8 | (o.children.some(
        (a) => a.flags & 7
        /* ViewFlag.Dirty */
      ) ? 1 : 0), this.markedForComposition.add(o);
      let l = Y.get(r);
      l && l != o && (l.dom = null), o.setDOM(r);
    }, i = this.childPos(e.range.fromB, 1), s = this.children[i.i];
    t(e.line, s);
    for (let r = e.marks.length - 1; r >= -1; r--)
      i = s.childPos(i.off, 1), s = s.children[i.i], t(r >= 0 ? e.marks[r].node : e.text, s);
  }
  // Sync the DOM selection to this.state.selection
  updateSelection(e = !1, t = !1) {
    (e || !this.view.observer.selectionRange.focusNode) && this.view.observer.readSelectionRange();
    let i = this.view.root.activeElement, s = i == this.dom, r = !s && Dn(this.dom, this.view.observer.selectionRange) && !(i && this.dom.contains(i));
    if (!(s || t || r))
      return;
    let o = this.forceSelection;
    this.forceSelection = !1;
    let l = this.view.state.selection.main, a = this.moveToLine(this.domAtPos(l.anchor)), h = l.empty ? a : this.moveToLine(this.domAtPos(l.head));
    if (R.gecko && l.empty && !this.hasComposition && wd(a)) {
      let f = document.createTextNode("");
      this.view.observer.ignore(() => a.node.insertBefore(f, a.node.childNodes[a.offset] || null)), a = h = new ue(f, 0), o = !0;
    }
    let c = this.view.observer.selectionRange;
    (o || !c.focusNode || (!Mi(a.node, a.offset, c.anchorNode, c.anchorOffset) || !Mi(h.node, h.offset, c.focusNode, c.focusOffset)) && !this.suppressWidgetCursorChange(c, l)) && (this.view.observer.ignore(() => {
      R.android && R.chrome && this.dom.contains(c.focusNode) && Od(c.focusNode, this.dom) && (this.dom.blur(), this.dom.focus({ preventScroll: !0 }));
      let f = Un(this.view.root);
      if (f)
        if (l.empty) {
          if (R.gecko) {
            let u = Sd(a.node, a.offset);
            if (u && u != 3) {
              let d = Fh(a.node, a.offset, u == 1 ? 1 : -1);
              d && (a = new ue(d.node, d.offset));
            }
          }
          f.collapse(a.node, a.offset), l.bidiLevel != null && f.caretBidiLevel !== void 0 && (f.caretBidiLevel = l.bidiLevel);
        } else if (f.extend) {
          f.collapse(a.node, a.offset);
          try {
            f.extend(h.node, h.offset);
          } catch {
          }
        } else {
          let u = document.createRange();
          l.anchor > l.head && ([a, h] = [h, a]), u.setEnd(h.node, h.offset), u.setStart(a.node, a.offset), f.removeAllRanges(), f.addRange(u);
        }
      r && this.view.root.activeElement == this.dom && (this.dom.blur(), i && i.focus());
    }), this.view.observer.setSelectionRange(a, h)), this.impreciseAnchor = a.precise ? null : new ue(c.anchorNode, c.anchorOffset), this.impreciseHead = h.precise ? null : new ue(c.focusNode, c.focusOffset);
  }
  // If a zero-length widget is inserted next to the cursor during
  // composition, avoid moving it across it and disrupting the
  // composition.
  suppressWidgetCursorChange(e, t) {
    return this.hasComposition && t.empty && Mi(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset) && this.posFromDOM(e.focusNode, e.focusOffset) == t.head;
  }
  enforceCursorAssoc() {
    if (this.hasComposition)
      return;
    let { view: e } = this, t = e.state.selection.main, i = Un(e.root), { anchorNode: s, anchorOffset: r } = e.observer.selectionRange;
    if (!i || !t.empty || !t.assoc || !i.modify)
      return;
    let o = ie.find(this, t.head);
    if (!o)
      return;
    let l = o.posAtStart;
    if (t.head == l || t.head == l + o.length)
      return;
    let a = this.coordsAt(t.head, -1), h = this.coordsAt(t.head, 1);
    if (!a || !h || a.bottom > h.top)
      return;
    let c = this.domAtPos(t.head + t.assoc);
    i.collapse(c.node, c.offset), i.modify("move", t.assoc < 0 ? "forward" : "backward", "lineboundary"), e.observer.readSelectionRange();
    let f = e.observer.selectionRange;
    e.docView.posFromDOM(f.anchorNode, f.anchorOffset) != t.from && i.collapse(s, r);
  }
  // If a position is in/near a block widget, move it to a nearby text
  // line, since we don't want the cursor inside a block widget.
  moveToLine(e) {
    let t = this.dom, i;
    if (e.node != t)
      return e;
    for (let s = e.offset; !i && s < t.childNodes.length; s++) {
      let r = Y.get(t.childNodes[s]);
      r instanceof ie && (i = r.domAtPos(0));
    }
    for (let s = e.offset - 1; !i && s >= 0; s--) {
      let r = Y.get(t.childNodes[s]);
      r instanceof ie && (i = r.domAtPos(r.length));
    }
    return i ? new ue(i.node, i.offset, !0) : e;
  }
  nearest(e) {
    for (let t = e; t; ) {
      let i = Y.get(t);
      if (i && i.rootView == this)
        return i;
      t = t.parentNode;
    }
    return null;
  }
  posFromDOM(e, t) {
    let i = this.nearest(e);
    if (!i)
      throw new RangeError("Trying to find position for a DOM position outside of the document");
    return i.localPosFromDOM(e, t) + i.posAtStart;
  }
  domAtPos(e) {
    let { i: t, off: i } = this.childCursor().findPos(e, -1);
    for (; t < this.children.length - 1; ) {
      let s = this.children[t];
      if (i < s.length || s instanceof ie)
        break;
      t++, i = 0;
    }
    return this.children[t].domAtPos(i);
  }
  coordsAt(e, t) {
    let i = null, s = 0;
    for (let r = this.length, o = this.children.length - 1; o >= 0; o--) {
      let l = this.children[o], a = r - l.breakAfter, h = a - l.length;
      if (a < e)
        break;
      h <= e && (h < e || l.covers(-1)) && (a > e || l.covers(1)) && (!i || l instanceof ie && !(i instanceof ie && t >= 0)) && (i = l, s = h), r = h;
    }
    return i ? i.coordsAt(e - s, t) : null;
  }
  coordsForChar(e) {
    let { i: t, off: i } = this.childPos(e, 1), s = this.children[t];
    if (!(s instanceof ie))
      return null;
    for (; s.children.length; ) {
      let { i: l, off: a } = s.childPos(i, 1);
      for (; ; l++) {
        if (l == s.children.length)
          return null;
        if ((s = s.children[l]).length)
          break;
      }
      i = a;
    }
    if (!(s instanceof ot))
      return null;
    let r = ce(s.text, i);
    if (r == i)
      return null;
    let o = It(s.dom, i, r).getClientRects();
    for (let l = 0; l < o.length; l++) {
      let a = o[l];
      if (l == o.length - 1 || a.top < a.bottom && a.left < a.right)
        return a;
    }
    return null;
  }
  measureVisibleLineHeights(e) {
    let t = [], { from: i, to: s } = e, r = this.view.contentDOM.clientWidth, o = r > Math.max(this.view.scrollDOM.clientWidth, this.minWidth) + 1, l = -1, a = this.view.textDirection == J.LTR;
    for (let h = 0, c = 0; c < this.children.length; c++) {
      let f = this.children[c], u = h + f.length;
      if (u > s)
        break;
      if (h >= i) {
        let d = f.dom.getBoundingClientRect();
        if (t.push(d.height), o) {
          let p = f.dom.lastChild, g = p ? Bi(p) : [];
          if (g.length) {
            let m = g[g.length - 1], b = a ? m.right - d.left : d.right - m.left;
            b > l && (l = b, this.minWidth = r, this.minWidthFrom = h, this.minWidthTo = u);
          }
        }
      }
      h = u + f.breakAfter;
    }
    return t;
  }
  textDirectionAt(e) {
    let { i: t } = this.childPos(e, 1);
    return getComputedStyle(this.children[t].dom).direction == "rtl" ? J.RTL : J.LTR;
  }
  measureTextSize() {
    for (let r of this.children)
      if (r instanceof ie) {
        let o = r.measureTextSize();
        if (o)
          return o;
      }
    let e = document.createElement("div"), t, i, s;
    return e.className = "cm-line", e.style.width = "99999px", e.style.position = "absolute", e.textContent = "abc def ghi jkl mno pqr stu", this.view.observer.ignore(() => {
      this.dom.appendChild(e);
      let r = Bi(e.firstChild)[0];
      t = e.getBoundingClientRect().height, i = r ? r.width / 27 : 7, s = r ? r.height : t, e.remove();
    }), { lineHeight: t, charWidth: i, textHeight: s };
  }
  childCursor(e = this.length) {
    let t = this.children.length;
    return t && (e -= this.children[--t].length), new mh(this.children, e, t);
  }
  computeBlockGapDeco() {
    let e = [], t = this.view.viewState;
    for (let i = 0, s = 0; ; s++) {
      let r = s == t.viewports.length ? null : t.viewports[s], o = r ? r.from - 1 : this.length;
      if (o > i) {
        let l = (t.lineBlockAt(o).bottom - t.lineBlockAt(i).top) / this.view.scaleY;
        e.push(T.replace({
          widget: new xl(l),
          block: !0,
          inclusive: !0,
          isBlockGap: !0
        }).range(i, o));
      }
      if (!r)
        break;
      i = r.to + 1;
    }
    return T.set(e);
  }
  updateDeco() {
    let e = this.view.state.facet(Xi).map((s, r) => (this.dynamicDecorationMap[r] = typeof s == "function") ? s(this.view) : s), t = !1, i = this.view.state.facet(Ih).map((s, r) => {
      let o = typeof s == "function";
      return o && (t = !0), o ? s(this.view) : s;
    });
    i.length && (this.dynamicDecorationMap[e.length] = t, e.push(I.join(i)));
    for (let s = e.length; s < e.length + 3; s++)
      this.dynamicDecorationMap[s] = !1;
    return this.decorations = [
      ...e,
      this.computeBlockGapDeco(),
      this.view.viewState.lineGapDeco
    ];
  }
  scrollIntoView(e) {
    if (e.isSnapshot) {
      let h = this.view.viewState.lineBlockAt(e.range.head);
      this.view.scrollDOM.scrollTop = h.top - e.yMargin, this.view.scrollDOM.scrollLeft = e.xMargin;
      return;
    }
    let { range: t } = e, i = this.coordsAt(t.head, t.empty ? t.assoc : t.head > t.anchor ? -1 : 1), s;
    if (!i)
      return;
    !t.empty && (s = this.coordsAt(t.anchor, t.anchor > t.head ? -1 : 1)) && (i = {
      left: Math.min(i.left, s.left),
      top: Math.min(i.top, s.top),
      right: Math.max(i.right, s.right),
      bottom: Math.max(i.bottom, s.bottom)
    });
    let r = Gh(this.view), o = {
      left: i.left - r.left,
      top: i.top - r.top,
      right: i.right + r.right,
      bottom: i.bottom + r.bottom
    }, { offsetWidth: l, offsetHeight: a } = this.view.scrollDOM;
    ed(this.view.scrollDOM, o, t.head < t.anchor ? -1 : 1, e.x, e.y, Math.max(Math.min(e.xMargin, l), -l), Math.max(Math.min(e.yMargin, a), -a), this.view.textDirection == J.LTR);
  }
}
function wd(n) {
  return n.node.nodeType == 1 && n.node.firstChild && (n.offset == 0 || n.node.childNodes[n.offset - 1].contentEditable == "false") && (n.offset == n.node.childNodes.length || n.node.childNodes[n.offset].contentEditable == "false");
}
class xl extends Mt {
  constructor(e) {
    super(), this.height = e;
  }
  toDOM() {
    let e = document.createElement("div");
    return e.className = "cm-gap", this.updateDOM(e), e;
  }
  eq(e) {
    return e.height == this.height;
  }
  updateDOM(e) {
    return e.style.height = this.height + "px", !0;
  }
  get editable() {
    return !0;
  }
  get estimatedHeight() {
    return this.height;
  }
  ignoreEvent() {
    return !1;
  }
}
function Hh(n, e) {
  let t = n.observer.selectionRange, i = t.focusNode && Fh(t.focusNode, t.focusOffset, 0);
  if (!i)
    return null;
  let s = e - i.offset;
  return { from: s, to: s + i.node.nodeValue.length, node: i.node };
}
function kd(n, e, t) {
  let i = Hh(n, t);
  if (!i)
    return null;
  let { node: s, from: r, to: o } = i, l = s.nodeValue;
  if (/[\n\r]/.test(l) || n.state.doc.sliceString(i.from, i.to) != l)
    return null;
  let a = e.invertedDesc, h = new Ee(a.mapPos(r), a.mapPos(o), r, o), c = [];
  for (let f = s.parentNode; ; f = f.parentNode) {
    let u = Y.get(f);
    if (u instanceof lt)
      c.push({ node: f, deco: u.mark });
    else {
      if (u instanceof ie || f.nodeName == "DIV" && f.parentNode == n.contentDOM)
        return { range: h, text: s, marks: c, line: f };
      if (f != n.contentDOM)
        c.push({ node: f, deco: new Qi({
          inclusive: !0,
          attributes: ad(f),
          tagName: f.tagName.toLowerCase()
        }) });
      else
        return null;
    }
  }
}
function Fh(n, e, t) {
  if (t <= 0)
    for (let i = n, s = e; ; ) {
      if (i.nodeType == 3)
        return { node: i, offset: s };
      if (i.nodeType == 1 && s > 0)
        i = i.childNodes[s - 1], s = rt(i);
      else
        break;
    }
  if (t >= 0)
    for (let i = n, s = e; ; ) {
      if (i.nodeType == 3)
        return { node: i, offset: s };
      if (i.nodeType == 1 && s < i.childNodes.length && t >= 0)
        i = i.childNodes[s], s = 0;
      else
        break;
    }
  return null;
}
function Sd(n, e) {
  return n.nodeType != 1 ? 0 : (e && n.childNodes[e - 1].contentEditable == "false" ? 1 : 0) | (e < n.childNodes.length && n.childNodes[e].contentEditable == "false" ? 2 : 0);
}
let vd = class {
  constructor() {
    this.changes = [];
  }
  compareRange(e, t) {
    Zr(e, t, this.changes);
  }
  comparePoint(e, t) {
    Zr(e, t, this.changes);
  }
};
function Cd(n, e, t) {
  let i = new vd();
  return I.compare(n, e, t, i), i.changes;
}
function Od(n, e) {
  for (let t = n; t && t != e; t = t.assignedSlot || t.parentNode)
    if (t.nodeType == 1 && t.contentEditable == "false")
      return !0;
  return !1;
}
function Ad(n, e) {
  let t = !1;
  return e && n.iterChangedRanges((i, s) => {
    i < e.to && s > e.from && (t = !0);
  }), t;
}
function Md(n, e, t = 1) {
  let i = n.charCategorizer(e), s = n.doc.lineAt(e), r = e - s.from;
  if (s.length == 0)
    return y.cursor(e);
  r == 0 ? t = 1 : r == s.length && (t = -1);
  let o = r, l = r;
  t < 0 ? o = ce(s.text, r, !1) : l = ce(s.text, r);
  let a = i(s.text.slice(o, l));
  for (; o > 0; ) {
    let h = ce(s.text, o, !1);
    if (i(s.text.slice(h, o)) != a)
      break;
    o = h;
  }
  for (; l < s.length; ) {
    let h = ce(s.text, l);
    if (i(s.text.slice(l, h)) != a)
      break;
    l = h;
  }
  return y.range(o + s.from, l + s.from);
}
function Rd(n, e) {
  return e.left > n ? e.left - n : Math.max(0, n - e.right);
}
function Zd(n, e) {
  return e.top > n ? e.top - n : Math.max(0, n - e.bottom);
}
function Ns(n, e) {
  return n.top < e.bottom - 1 && n.bottom > e.top + 1;
}
function wl(n, e) {
  return e < n.top ? { top: e, left: n.left, right: n.right, bottom: n.bottom } : n;
}
function kl(n, e) {
  return e > n.bottom ? { top: n.top, left: n.left, right: n.right, bottom: e } : n;
}
function Vr(n, e, t) {
  let i, s, r, o, l = !1, a, h, c, f;
  for (let p = n.firstChild; p; p = p.nextSibling) {
    let g = Bi(p);
    for (let m = 0; m < g.length; m++) {
      let b = g[m];
      s && Ns(s, b) && (b = wl(kl(b, s.bottom), s.top));
      let k = Rd(e, b), C = Zd(t, b);
      if (k == 0 && C == 0)
        return p.nodeType == 3 ? Sl(p, e, t) : Vr(p, e, t);
      if (!i || o > C || o == C && r > k) {
        i = p, s = b, r = k, o = C;
        let S = C ? t < b.top ? -1 : 1 : k ? e < b.left ? -1 : 1 : 0;
        l = !S || (S > 0 ? m < g.length - 1 : m > 0);
      }
      k == 0 ? t > b.bottom && (!c || c.bottom < b.bottom) ? (a = p, c = b) : t < b.top && (!f || f.top > b.top) && (h = p, f = b) : c && Ns(c, b) ? c = kl(c, b.bottom) : f && Ns(f, b) && (f = wl(f, b.top));
    }
  }
  if (c && c.bottom >= t ? (i = a, s = c) : f && f.top <= t && (i = h, s = f), !i)
    return { node: n, offset: 0 };
  let u = Math.max(s.left, Math.min(s.right, e));
  if (i.nodeType == 3)
    return Sl(i, u, t);
  if (l && i.contentEditable != "false")
    return Vr(i, u, t);
  let d = Array.prototype.indexOf.call(n.childNodes, i) + (e >= (s.left + s.right) / 2 ? 1 : 0);
  return { node: n, offset: d };
}
function Sl(n, e, t) {
  let i = n.nodeValue.length, s = -1, r = 1e9, o = 0;
  for (let l = 0; l < i; l++) {
    let a = It(n, l, l + 1).getClientRects();
    for (let h = 0; h < a.length; h++) {
      let c = a[h];
      if (c.top == c.bottom)
        continue;
      o || (o = e - c.left);
      let f = (c.top > t ? c.top - t : t - c.bottom) - 1;
      if (c.left - 1 <= e && c.right + 1 >= e && f < r) {
        let u = e >= (c.left + c.right) / 2, d = u;
        if ((R.chrome || R.gecko) && It(n, l).getBoundingClientRect().left == c.right && (d = !u), f <= 0)
          return { node: n, offset: l + (d ? 1 : 0) };
        s = l + (d ? 1 : 0), r = f;
      }
    }
  }
  return { node: n, offset: s > -1 ? s : o > 0 ? n.nodeValue.length : 0 };
}
function zh(n, e, t, i = -1) {
  var s, r;
  let o = n.contentDOM.getBoundingClientRect(), l = o.top + n.viewState.paddingTop, a, { docHeight: h } = n.viewState, { x: c, y: f } = e, u = f - l;
  if (u < 0)
    return 0;
  if (u > h)
    return n.state.doc.length;
  for (let S = n.viewState.heightOracle.textHeight / 2, w = !1; a = n.elementAtHeight(u), a.type != ye.Text; )
    for (; u = i > 0 ? a.bottom + S : a.top - S, !(u >= 0 && u <= h); ) {
      if (w)
        return t ? null : 0;
      w = !0, i = -i;
    }
  f = l + u;
  let d = a.from;
  if (d < n.viewport.from)
    return n.viewport.from == 0 ? 0 : t ? null : vl(n, o, a, c, f);
  if (d > n.viewport.to)
    return n.viewport.to == n.state.doc.length ? n.state.doc.length : t ? null : vl(n, o, a, c, f);
  let p = n.dom.ownerDocument, g = n.root.elementFromPoint ? n.root : p, m = g.elementFromPoint(c, f);
  m && !n.contentDOM.contains(m) && (m = null), m || (c = Math.max(o.left + 1, Math.min(o.right - 1, c)), m = g.elementFromPoint(c, f), m && !n.contentDOM.contains(m) && (m = null));
  let b, k = -1;
  if (m && ((s = n.docView.nearest(m)) === null || s === void 0 ? void 0 : s.isEditable) != !1) {
    if (p.caretPositionFromPoint) {
      let S = p.caretPositionFromPoint(c, f);
      S && ({ offsetNode: b, offset: k } = S);
    } else if (p.caretRangeFromPoint) {
      let S = p.caretRangeFromPoint(c, f);
      S && ({ startContainer: b, startOffset: k } = S, (!n.contentDOM.contains(b) || R.safari && Ld(b, k, c) || R.chrome && Td(b, k, c)) && (b = void 0));
    }
  }
  if (!b || !n.docView.dom.contains(b)) {
    let S = ie.find(n.docView, d);
    if (!S)
      return u > a.top + a.height / 2 ? a.to : a.from;
    ({ node: b, offset: k } = Vr(S.dom, c, f));
  }
  let C = n.docView.nearest(b);
  if (!C)
    return null;
  if (C.isWidget && ((r = C.dom) === null || r === void 0 ? void 0 : r.nodeType) == 1) {
    let S = C.dom.getBoundingClientRect();
    return e.y < S.top || e.y <= S.bottom && e.x <= (S.left + S.right) / 2 ? C.posAtStart : C.posAtEnd;
  } else
    return C.localPosFromDOM(b, k) + C.posAtStart;
}
function vl(n, e, t, i, s) {
  let r = Math.round((i - e.left) * n.defaultCharacterWidth);
  if (n.lineWrapping && t.height > n.defaultLineHeight * 1.5) {
    let l = n.viewState.heightOracle.textHeight, a = Math.floor((s - t.top - (n.defaultLineHeight - l) * 0.5) / l);
    r += a * n.viewState.heightOracle.lineLength;
  }
  let o = n.state.sliceDoc(t.from, t.to);
  return t.from + Ju(o, r, n.state.tabSize);
}
function Ld(n, e, t) {
  let i;
  if (n.nodeType != 3 || e != (i = n.nodeValue.length))
    return !1;
  for (let s = n.nextSibling; s; s = s.nextSibling)
    if (s.nodeType != 1 || s.nodeName != "BR")
      return !1;
  return It(n, i - 1, i).getBoundingClientRect().left > t;
}
function Td(n, e, t) {
  if (e != 0)
    return !1;
  for (let s = n; ; ) {
    let r = s.parentNode;
    if (!r || r.nodeType != 1 || r.firstChild != s)
      return !1;
    if (r.classList.contains("cm-line"))
      break;
    s = r;
  }
  let i = n.nodeType == 1 ? n.getBoundingClientRect() : It(n, 0, Math.max(n.nodeValue.length, 1)).getBoundingClientRect();
  return t - i.left > 5;
}
function Br(n, e) {
  let t = n.lineBlockAt(e);
  if (Array.isArray(t.type)) {
    for (let i of t.type)
      if (i.to > e || i.to == e && (i.to == t.to || i.type == ye.Text))
        return i;
  }
  return t;
}
function Dd(n, e, t, i) {
  let s = Br(n, e.head), r = !i || s.type != ye.Text || !(n.lineWrapping || s.widgetLineBreaks) ? null : n.coordsAtPos(e.assoc < 0 && e.head > s.from ? e.head - 1 : e.head);
  if (r) {
    let o = n.dom.getBoundingClientRect(), l = n.textDirectionAt(s.from), a = n.posAtCoords({
      x: t == (l == J.LTR) ? o.right - 1 : o.left + 1,
      y: (r.top + r.bottom) / 2
    });
    if (a != null)
      return y.cursor(a, t ? -1 : 1);
  }
  return y.cursor(t ? s.to : s.from, t ? -1 : 1);
}
function Cl(n, e, t, i) {
  let s = n.state.doc.lineAt(e.head), r = n.bidiSpans(s), o = n.textDirectionAt(s.from);
  for (let l = e, a = null; ; ) {
    let h = bd(s, r, o, l, t), c = Rh;
    if (!h) {
      if (s.number == (t ? n.state.doc.lines : 1))
        return l;
      c = `
`, s = n.state.doc.line(s.number + (t ? 1 : -1)), r = n.bidiSpans(s), h = n.visualLineSide(s, !t);
    }
    if (a) {
      if (!a(c))
        return l;
    } else {
      if (!i)
        return h;
      a = i(c);
    }
    l = h;
  }
}
function Pd(n, e, t) {
  let i = n.state.charCategorizer(e), s = i(t);
  return (r) => {
    let o = i(r);
    return s == q.Space && (s = o), s == o;
  };
}
function Vd(n, e, t, i) {
  let s = e.head, r = t ? 1 : -1;
  if (s == (t ? n.state.doc.length : 0))
    return y.cursor(s, e.assoc);
  let o = e.goalColumn, l, a = n.contentDOM.getBoundingClientRect(), h = n.coordsAtPos(s, e.assoc || -1), c = n.documentTop;
  if (h)
    o == null && (o = h.left - a.left), l = r < 0 ? h.top : h.bottom;
  else {
    let d = n.viewState.lineBlockAt(s);
    o == null && (o = Math.min(a.right - a.left, n.defaultCharacterWidth * (s - d.from))), l = (r < 0 ? d.top : d.bottom) + c;
  }
  let f = a.left + o, u = i ?? n.viewState.heightOracle.textHeight >> 1;
  for (let d = 0; ; d += 10) {
    let p = l + (u + d) * r, g = zh(n, { x: f, y: p }, !1, r);
    if (p < a.top || p > a.bottom || (r < 0 ? g < s : g > s)) {
      let m = n.docView.coordsForChar(g), b = !m || p < m.top ? -1 : 1;
      return y.cursor(g, b, void 0, o);
    }
  }
}
function Pn(n, e, t) {
  for (; ; ) {
    let i = 0;
    for (let s of n)
      s.between(e - 1, e + 1, (r, o, l) => {
        if (e > r && e < o) {
          let a = i || t || (e - r < o - e ? -1 : 1);
          e = a < 0 ? r : o, i = a;
        }
      });
    if (!i)
      return e;
  }
}
function Gs(n, e, t) {
  let i = Pn(n.state.facet(bo).map((s) => s(n)), t.from, e.head > t.from ? -1 : 1);
  return i == t.from ? t : y.cursor(i, i < t.from ? 1 : -1);
}
class Bd {
  setSelectionOrigin(e) {
    this.lastSelectionOrigin = e, this.lastSelectionTime = Date.now();
  }
  constructor(e) {
    this.view = e, this.lastKeyCode = 0, this.lastKeyTime = 0, this.lastTouchTime = 0, this.lastFocusTime = 0, this.lastScrollTop = 0, this.lastScrollLeft = 0, this.pendingIOSKey = void 0, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastEscPress = 0, this.lastContextMenu = 0, this.scrollHandlers = [], this.handlers = /* @__PURE__ */ Object.create(null), this.composing = -1, this.compositionFirstChange = null, this.compositionEndedAt = 0, this.compositionPendingKey = !1, this.compositionPendingChange = !1, this.mouseSelection = null, this.draggedContent = null, this.handleEvent = this.handleEvent.bind(this), this.notifiedFocused = e.hasFocus, R.safari && e.contentDOM.addEventListener("input", () => null), R.gecko && jd(e.contentDOM.ownerDocument);
  }
  handleEvent(e) {
    !Fd(this.view, e) || this.ignoreDuringComposition(e) || e.type == "keydown" && this.keydown(e) || this.runHandlers(e.type, e);
  }
  runHandlers(e, t) {
    let i = this.handlers[e];
    if (i) {
      for (let s of i.observers)
        s(this.view, t);
      for (let s of i.handlers) {
        if (t.defaultPrevented)
          break;
        if (s(this.view, t)) {
          t.preventDefault();
          break;
        }
      }
    }
  }
  ensureHandlers(e) {
    let t = Wd(e), i = this.handlers, s = this.view.contentDOM;
    for (let r in t)
      if (r != "scroll") {
        let o = !t[r].handlers.length, l = i[r];
        l && o != !l.handlers.length && (s.removeEventListener(r, this.handleEvent), l = null), l || s.addEventListener(r, this.handleEvent, { passive: o });
      }
    for (let r in i)
      r != "scroll" && !t[r] && s.removeEventListener(r, this.handleEvent);
    this.handlers = t;
  }
  keydown(e) {
    if (this.lastKeyCode = e.keyCode, this.lastKeyTime = Date.now(), e.keyCode == 9 && Date.now() < this.lastEscPress + 2e3)
      return !0;
    if (e.keyCode != 27 && Yh.indexOf(e.keyCode) < 0 && (this.view.inputState.lastEscPress = 0), R.android && R.chrome && !e.synthetic && (e.keyCode == 13 || e.keyCode == 8))
      return this.view.observer.delayAndroidKey(e.key, e.keyCode), !0;
    let t;
    return R.ios && !e.synthetic && !e.altKey && !e.metaKey && ((t = Kh.find((i) => i.keyCode == e.keyCode)) && !e.ctrlKey || Xd.indexOf(e.key) > -1 && e.ctrlKey && !e.shiftKey) ? (this.pendingIOSKey = t || e, setTimeout(() => this.flushIOSKey(), 250), !0) : (e.keyCode != 229 && this.view.observer.forceFlush(), !1);
  }
  flushIOSKey() {
    let e = this.pendingIOSKey;
    return e ? (this.pendingIOSKey = void 0, ei(this.view.contentDOM, e.key, e.keyCode)) : !1;
  }
  ignoreDuringComposition(e) {
    return /^key/.test(e.type) ? this.composing > 0 ? !0 : R.safari && !R.ios && this.compositionPendingKey && Date.now() - this.compositionEndedAt < 100 ? (this.compositionPendingKey = !1, !0) : !1 : !1;
  }
  startMouseSelection(e) {
    this.mouseSelection && this.mouseSelection.destroy(), this.mouseSelection = e;
  }
  update(e) {
    this.mouseSelection && this.mouseSelection.update(e), this.draggedContent && e.docChanged && (this.draggedContent = this.draggedContent.map(e.changes)), e.transactions.length && (this.lastKeyCode = this.lastSelectionTime = 0);
  }
  destroy() {
    this.mouseSelection && this.mouseSelection.destroy();
  }
}
function Ol(n, e) {
  return (t, i) => {
    try {
      return e.call(n, i, t);
    } catch (s) {
      Pe(t.state, s);
    }
  };
}
function Wd(n) {
  let e = /* @__PURE__ */ Object.create(null);
  function t(i) {
    return e[i] || (e[i] = { observers: [], handlers: [] });
  }
  for (let i of n) {
    let s = i.spec;
    if (s && s.domEventHandlers)
      for (let r in s.domEventHandlers) {
        let o = s.domEventHandlers[r];
        o && t(r).handlers.push(Ol(i.value, o));
      }
    if (s && s.domEventObservers)
      for (let r in s.domEventObservers) {
        let o = s.domEventObservers[r];
        o && t(r).observers.push(Ol(i.value, o));
      }
  }
  for (let i in He)
    t(i).handlers.push(He[i]);
  for (let i in Fe)
    t(i).observers.push(Fe[i]);
  return e;
}
const Kh = [
  { key: "Backspace", keyCode: 8, inputType: "deleteContentBackward" },
  { key: "Enter", keyCode: 13, inputType: "insertParagraph" },
  { key: "Enter", keyCode: 13, inputType: "insertLineBreak" },
  { key: "Delete", keyCode: 46, inputType: "deleteContentForward" }
], Xd = "dthko", Yh = [16, 17, 18, 20, 91, 92, 224, 225], fn = 6;
function un(n) {
  return Math.max(0, n) * 0.7 + 8;
}
function Id(n, e) {
  return Math.max(Math.abs(n.clientX - e.clientX), Math.abs(n.clientY - e.clientY));
}
class Ed {
  constructor(e, t, i, s) {
    this.view = e, this.startEvent = t, this.style = i, this.mustSelect = s, this.scrollSpeed = { x: 0, y: 0 }, this.scrolling = -1, this.lastEvent = t, this.scrollParent = td(e.contentDOM), this.atoms = e.state.facet(bo).map((o) => o(e));
    let r = e.contentDOM.ownerDocument;
    r.addEventListener("mousemove", this.move = this.move.bind(this)), r.addEventListener("mouseup", this.up = this.up.bind(this)), this.extend = t.shiftKey, this.multiple = e.state.facet(G.allowMultipleSelections) && Nd(e, t), this.dragging = Hd(e, t) && $h(t) == 1 ? null : !1;
  }
  start(e) {
    this.dragging === !1 && this.select(e);
  }
  move(e) {
    var t;
    if (e.buttons == 0)
      return this.destroy();
    if (this.dragging || this.dragging == null && Id(this.startEvent, e) < 10)
      return;
    this.select(this.lastEvent = e);
    let i = 0, s = 0, r = ((t = this.scrollParent) === null || t === void 0 ? void 0 : t.getBoundingClientRect()) || { left: 0, top: 0, right: this.view.win.innerWidth, bottom: this.view.win.innerHeight }, o = Gh(this.view);
    e.clientX - o.left <= r.left + fn ? i = -un(r.left - e.clientX) : e.clientX + o.right >= r.right - fn && (i = un(e.clientX - r.right)), e.clientY - o.top <= r.top + fn ? s = -un(r.top - e.clientY) : e.clientY + o.bottom >= r.bottom - fn && (s = un(e.clientY - r.bottom)), this.setScrollSpeed(i, s);
  }
  up(e) {
    this.dragging == null && this.select(this.lastEvent), this.dragging || e.preventDefault(), this.destroy();
  }
  destroy() {
    this.setScrollSpeed(0, 0);
    let e = this.view.contentDOM.ownerDocument;
    e.removeEventListener("mousemove", this.move), e.removeEventListener("mouseup", this.up), this.view.inputState.mouseSelection = this.view.inputState.draggedContent = null;
  }
  setScrollSpeed(e, t) {
    this.scrollSpeed = { x: e, y: t }, e || t ? this.scrolling < 0 && (this.scrolling = setInterval(() => this.scroll(), 50)) : this.scrolling > -1 && (clearInterval(this.scrolling), this.scrolling = -1);
  }
  scroll() {
    this.scrollParent ? (this.scrollParent.scrollLeft += this.scrollSpeed.x, this.scrollParent.scrollTop += this.scrollSpeed.y) : this.view.win.scrollBy(this.scrollSpeed.x, this.scrollSpeed.y), this.dragging === !1 && this.select(this.lastEvent);
  }
  skipAtoms(e) {
    let t = null;
    for (let i = 0; i < e.ranges.length; i++) {
      let s = e.ranges[i], r = null;
      if (s.empty) {
        let o = Pn(this.atoms, s.from, 0);
        o != s.from && (r = y.cursor(o, -1));
      } else {
        let o = Pn(this.atoms, s.from, -1), l = Pn(this.atoms, s.to, 1);
        (o != s.from || l != s.to) && (r = y.range(s.from == s.anchor ? o : l, s.from == s.head ? o : l));
      }
      r && (t || (t = e.ranges.slice()), t[i] = r);
    }
    return t ? y.create(t, e.mainIndex) : e;
  }
  select(e) {
    let { view: t } = this, i = this.skipAtoms(this.style.get(e, this.extend, this.multiple));
    (this.mustSelect || !i.eq(t.state.selection, this.dragging === !1)) && this.view.dispatch({
      selection: i,
      userEvent: "select.pointer"
    }), this.mustSelect = !1;
  }
  update(e) {
    this.style.update(e) && setTimeout(() => this.select(this.lastEvent), 20);
  }
}
function Nd(n, e) {
  let t = n.state.facet(Zh);
  return t.length ? t[0](e) : R.mac ? e.metaKey : e.ctrlKey;
}
function Gd(n, e) {
  let t = n.state.facet(Lh);
  return t.length ? t[0](e) : R.mac ? !e.altKey : !e.ctrlKey;
}
function Hd(n, e) {
  let { main: t } = n.state.selection;
  if (t.empty)
    return !1;
  let i = Un(n.root);
  if (!i || i.rangeCount == 0)
    return !0;
  let s = i.getRangeAt(0).getClientRects();
  for (let r = 0; r < s.length; r++) {
    let o = s[r];
    if (o.left <= e.clientX && o.right >= e.clientX && o.top <= e.clientY && o.bottom >= e.clientY)
      return !0;
  }
  return !1;
}
function Fd(n, e) {
  if (!e.bubbles)
    return !0;
  if (e.defaultPrevented)
    return !1;
  for (let t = e.target, i; t != n.contentDOM; t = t.parentNode)
    if (!t || t.nodeType == 11 || (i = Y.get(t)) && i.ignoreEvent(e))
      return !1;
  return !0;
}
const He = /* @__PURE__ */ Object.create(null), Fe = /* @__PURE__ */ Object.create(null), Jh = R.ie && R.ie_version < 15 || R.ios && R.webkit_version < 604;
function zd(n) {
  let e = n.dom.parentNode;
  if (!e)
    return;
  let t = e.appendChild(document.createElement("textarea"));
  t.style.cssText = "position: fixed; left: -10000px; top: 10px", t.focus(), setTimeout(() => {
    n.focus(), t.remove(), Qh(n, t.value);
  }, 50);
}
function Qh(n, e) {
  let { state: t } = n, i, s = 1, r = t.toText(e), o = r.lines == t.selection.ranges.length;
  if (Wr != null && t.selection.ranges.every((a) => a.empty) && Wr == r.toString()) {
    let a = -1;
    i = t.changeByRange((h) => {
      let c = t.doc.lineAt(h.from);
      if (c.from == a)
        return { range: h };
      a = c.from;
      let f = t.toText((o ? r.line(s++).text : e) + t.lineBreak);
      return {
        changes: { from: c.from, insert: f },
        range: y.cursor(h.from + f.length)
      };
    });
  } else
    o ? i = t.changeByRange((a) => {
      let h = r.line(s++);
      return {
        changes: { from: a.from, to: a.to, insert: h.text },
        range: y.cursor(a.from + h.length)
      };
    }) : i = t.replaceSelection(r);
  n.dispatch(i, {
    userEvent: "input.paste",
    scrollIntoView: !0
  });
}
Fe.scroll = (n) => {
  n.inputState.lastScrollTop = n.scrollDOM.scrollTop, n.inputState.lastScrollLeft = n.scrollDOM.scrollLeft;
};
He.keydown = (n, e) => (n.inputState.setSelectionOrigin("select"), e.keyCode == 27 && (n.inputState.lastEscPress = Date.now()), !1);
Fe.touchstart = (n, e) => {
  n.inputState.lastTouchTime = Date.now(), n.inputState.setSelectionOrigin("select.pointer");
};
Fe.touchmove = (n) => {
  n.inputState.setSelectionOrigin("select.pointer");
};
He.mousedown = (n, e) => {
  if (n.observer.flush(), n.inputState.lastTouchTime > Date.now() - 2e3)
    return !1;
  let t = null;
  for (let i of n.state.facet(Th))
    if (t = i(n, e), t)
      break;
  if (!t && e.button == 0 && (t = Jd(n, e)), t) {
    let i = !n.hasFocus;
    n.inputState.startMouseSelection(new Ed(n, e, t, i)), i && n.observer.ignore(() => uh(n.contentDOM));
    let s = n.inputState.mouseSelection;
    if (s)
      return s.start(e), s.dragging === !1;
  }
  return !1;
};
function Al(n, e, t, i) {
  if (i == 1)
    return y.cursor(e, t);
  if (i == 2)
    return Md(n.state, e, t);
  {
    let s = ie.find(n.docView, e), r = n.state.doc.lineAt(s ? s.posAtEnd : e), o = s ? s.posAtStart : r.from, l = s ? s.posAtEnd : r.to;
    return l < n.state.doc.length && l == r.to && l++, y.range(o, l);
  }
}
let Uh = (n, e) => n >= e.top && n <= e.bottom, Ml = (n, e, t) => Uh(e, t) && n >= t.left && n <= t.right;
function Kd(n, e, t, i) {
  let s = ie.find(n.docView, e);
  if (!s)
    return 1;
  let r = e - s.posAtStart;
  if (r == 0)
    return 1;
  if (r == s.length)
    return -1;
  let o = s.coordsAt(r, -1);
  if (o && Ml(t, i, o))
    return -1;
  let l = s.coordsAt(r, 1);
  return l && Ml(t, i, l) ? 1 : o && Uh(i, o) ? -1 : 1;
}
function Rl(n, e) {
  let t = n.posAtCoords({ x: e.clientX, y: e.clientY }, !1);
  return { pos: t, bias: Kd(n, t, e.clientX, e.clientY) };
}
const Yd = R.ie && R.ie_version <= 11;
let Zl = null, Ll = 0, Tl = 0;
function $h(n) {
  if (!Yd)
    return n.detail;
  let e = Zl, t = Tl;
  return Zl = n, Tl = Date.now(), Ll = !e || t > Date.now() - 400 && Math.abs(e.clientX - n.clientX) < 2 && Math.abs(e.clientY - n.clientY) < 2 ? (Ll + 1) % 3 : 1;
}
function Jd(n, e) {
  let t = Rl(n, e), i = $h(e), s = n.state.selection;
  return {
    update(r) {
      r.docChanged && (t.pos = r.changes.mapPos(t.pos), s = s.map(r.changes));
    },
    get(r, o, l) {
      let a = Rl(n, r), h, c = Al(n, a.pos, a.bias, i);
      if (t.pos != a.pos && !o) {
        let f = Al(n, t.pos, t.bias, i), u = Math.min(f.from, c.from), d = Math.max(f.to, c.to);
        c = u < c.from ? y.range(u, d) : y.range(d, u);
      }
      return o ? s.replaceRange(s.main.extend(c.from, c.to)) : l && i == 1 && s.ranges.length > 1 && (h = Qd(s, a.pos)) ? h : l ? s.addRange(c) : y.create([c]);
    }
  };
}
function Qd(n, e) {
  for (let t = 0; t < n.ranges.length; t++) {
    let { from: i, to: s } = n.ranges[t];
    if (i <= e && s >= e)
      return y.create(n.ranges.slice(0, t).concat(n.ranges.slice(t + 1)), n.mainIndex == t ? 0 : n.mainIndex - (n.mainIndex > t ? 1 : 0));
  }
  return null;
}
He.dragstart = (n, e) => {
  let { selection: { main: t } } = n.state;
  if (e.target.draggable) {
    let s = n.docView.nearest(e.target);
    if (s && s.isWidget) {
      let r = s.posAtStart, o = r + s.length;
      (r >= t.to || o <= t.from) && (t = y.range(r, o));
    }
  }
  let { inputState: i } = n;
  return i.mouseSelection && (i.mouseSelection.dragging = !0), i.draggedContent = t, e.dataTransfer && (e.dataTransfer.setData("Text", n.state.sliceDoc(t.from, t.to)), e.dataTransfer.effectAllowed = "copyMove"), !1;
};
He.dragend = (n) => (n.inputState.draggedContent = null, !1);
function Dl(n, e, t, i) {
  if (!t)
    return;
  let s = n.posAtCoords({ x: e.clientX, y: e.clientY }, !1), { draggedContent: r } = n.inputState, o = i && r && Gd(n, e) ? { from: r.from, to: r.to } : null, l = { from: s, insert: t }, a = n.state.changes(o ? [o, l] : l);
  n.focus(), n.dispatch({
    changes: a,
    selection: { anchor: a.mapPos(s, -1), head: a.mapPos(s, 1) },
    userEvent: o ? "move.drop" : "input.drop"
  }), n.inputState.draggedContent = null;
}
He.drop = (n, e) => {
  if (!e.dataTransfer)
    return !1;
  if (n.state.readOnly)
    return !0;
  let t = e.dataTransfer.files;
  if (t && t.length) {
    let i = Array(t.length), s = 0, r = () => {
      ++s == t.length && Dl(n, e, i.filter((o) => o != null).join(n.state.lineBreak), !1);
    };
    for (let o = 0; o < t.length; o++) {
      let l = new FileReader();
      l.onerror = r, l.onload = () => {
        /[\x00-\x08\x0e-\x1f]{2}/.test(l.result) || (i[o] = l.result), r();
      }, l.readAsText(t[o]);
    }
    return !0;
  } else {
    let i = e.dataTransfer.getData("Text");
    if (i)
      return Dl(n, e, i, !0), !0;
  }
  return !1;
};
He.paste = (n, e) => {
  if (n.state.readOnly)
    return !0;
  n.observer.flush();
  let t = Jh ? null : e.clipboardData;
  return t ? (Qh(n, t.getData("text/plain") || t.getData("text/uri-text")), !0) : (zd(n), !1);
};
function Ud(n, e) {
  let t = n.dom.parentNode;
  if (!t)
    return;
  let i = t.appendChild(document.createElement("textarea"));
  i.style.cssText = "position: fixed; left: -10000px; top: 10px", i.value = e, i.focus(), i.selectionEnd = e.length, i.selectionStart = 0, setTimeout(() => {
    i.remove(), n.focus();
  }, 50);
}
function $d(n) {
  let e = [], t = [], i = !1;
  for (let s of n.selection.ranges)
    s.empty || (e.push(n.sliceDoc(s.from, s.to)), t.push(s));
  if (!e.length) {
    let s = -1;
    for (let { from: r } of n.selection.ranges) {
      let o = n.doc.lineAt(r);
      o.number > s && (e.push(o.text), t.push({ from: o.from, to: Math.min(n.doc.length, o.to + 1) })), s = o.number;
    }
    i = !0;
  }
  return { text: e.join(n.lineBreak), ranges: t, linewise: i };
}
let Wr = null;
He.copy = He.cut = (n, e) => {
  let { text: t, ranges: i, linewise: s } = $d(n.state);
  if (!t && !s)
    return !1;
  Wr = s ? t : null, e.type == "cut" && !n.state.readOnly && n.dispatch({
    changes: i,
    scrollIntoView: !0,
    userEvent: "delete.cut"
  });
  let r = Jh ? null : e.clipboardData;
  return r ? (r.clearData(), r.setData("text/plain", t), !0) : (Ud(n, t), !1);
};
const jh = /* @__PURE__ */ ht.define();
function qh(n, e) {
  let t = [];
  for (let i of n.facet(Vh)) {
    let s = i(n, e);
    s && t.push(s);
  }
  return t ? n.update({ effects: t, annotations: jh.of(!0) }) : null;
}
function _h(n) {
  setTimeout(() => {
    let e = n.hasFocus;
    if (e != n.inputState.notifiedFocused) {
      let t = qh(n.state, e);
      t ? n.dispatch(t) : n.update([]);
    }
  }, 10);
}
Fe.focus = (n) => {
  n.inputState.lastFocusTime = Date.now(), !n.scrollDOM.scrollTop && (n.inputState.lastScrollTop || n.inputState.lastScrollLeft) && (n.scrollDOM.scrollTop = n.inputState.lastScrollTop, n.scrollDOM.scrollLeft = n.inputState.lastScrollLeft), _h(n);
};
Fe.blur = (n) => {
  n.observer.clearSelectionRange(), _h(n);
};
Fe.compositionstart = Fe.compositionupdate = (n) => {
  n.inputState.compositionFirstChange == null && (n.inputState.compositionFirstChange = !0), n.inputState.composing < 0 && (n.inputState.composing = 0);
};
Fe.compositionend = (n) => {
  n.inputState.composing = -1, n.inputState.compositionEndedAt = Date.now(), n.inputState.compositionPendingKey = !0, n.inputState.compositionPendingChange = n.observer.pendingRecords().length > 0, n.inputState.compositionFirstChange = null, R.chrome && R.android ? n.observer.flushSoon() : n.inputState.compositionPendingChange ? Promise.resolve().then(() => n.observer.flush()) : setTimeout(() => {
    n.inputState.composing < 0 && n.docView.hasComposition && n.update([]);
  }, 50);
};
Fe.contextmenu = (n) => {
  n.inputState.lastContextMenu = Date.now();
};
He.beforeinput = (n, e) => {
  var t;
  let i;
  if (R.chrome && R.android && (i = Kh.find((s) => s.inputType == e.inputType)) && (n.observer.delayAndroidKey(i.key, i.keyCode), i.key == "Backspace" || i.key == "Delete")) {
    let s = ((t = window.visualViewport) === null || t === void 0 ? void 0 : t.height) || 0;
    setTimeout(() => {
      var r;
      (((r = window.visualViewport) === null || r === void 0 ? void 0 : r.height) || 0) > s + 10 && n.hasFocus && (n.contentDOM.blur(), n.focus());
    }, 100);
  }
  return !1;
};
const Pl = /* @__PURE__ */ new Set();
function jd(n) {
  Pl.has(n) || (Pl.add(n), n.addEventListener("copy", () => {
  }), n.addEventListener("cut", () => {
  }));
}
const Vl = ["pre-wrap", "normal", "pre-line", "break-spaces"];
class qd {
  constructor(e) {
    this.lineWrapping = e, this.doc = E.empty, this.heightSamples = {}, this.lineHeight = 14, this.charWidth = 7, this.textHeight = 14, this.lineLength = 30, this.heightChanged = !1;
  }
  heightForGap(e, t) {
    let i = this.doc.lineAt(t).number - this.doc.lineAt(e).number + 1;
    return this.lineWrapping && (i += Math.max(0, Math.ceil((t - e - i * this.lineLength * 0.5) / this.lineLength))), this.lineHeight * i;
  }
  heightForLine(e) {
    return this.lineWrapping ? (1 + Math.max(0, Math.ceil((e - this.lineLength) / (this.lineLength - 5)))) * this.lineHeight : this.lineHeight;
  }
  setDoc(e) {
    return this.doc = e, this;
  }
  mustRefreshForWrapping(e) {
    return Vl.indexOf(e) > -1 != this.lineWrapping;
  }
  mustRefreshForHeights(e) {
    let t = !1;
    for (let i = 0; i < e.length; i++) {
      let s = e[i];
      s < 0 ? i++ : this.heightSamples[Math.floor(s * 10)] || (t = !0, this.heightSamples[Math.floor(s * 10)] = !0);
    }
    return t;
  }
  refresh(e, t, i, s, r, o) {
    let l = Vl.indexOf(e) > -1, a = Math.round(t) != Math.round(this.lineHeight) || this.lineWrapping != l;
    if (this.lineWrapping = l, this.lineHeight = t, this.charWidth = i, this.textHeight = s, this.lineLength = r, a) {
      this.heightSamples = {};
      for (let h = 0; h < o.length; h++) {
        let c = o[h];
        c < 0 ? h++ : this.heightSamples[Math.floor(c * 10)] = !0;
      }
    }
    return a;
  }
}
class _d {
  constructor(e, t) {
    this.from = e, this.heights = t, this.index = 0;
  }
  get more() {
    return this.index < this.heights.length;
  }
}
class je {
  /**
  @internal
  */
  constructor(e, t, i, s, r) {
    this.from = e, this.length = t, this.top = i, this.height = s, this._content = r;
  }
  /**
  The type of element this is. When querying lines, this may be
  an array of all the blocks that make up the line.
  */
  get type() {
    return typeof this._content == "number" ? ye.Text : Array.isArray(this._content) ? this._content : this._content.type;
  }
  /**
  The end of the element as a document position.
  */
  get to() {
    return this.from + this.length;
  }
  /**
  The bottom position of the element.
  */
  get bottom() {
    return this.top + this.height;
  }
  /**
  If this is a widget block, this will return the widget
  associated with it.
  */
  get widget() {
    return this._content instanceof Ct ? this._content.widget : null;
  }
  /**
  If this is a textblock, this holds the number of line breaks
  that appear in widgets inside the block.
  */
  get widgetLineBreaks() {
    return typeof this._content == "number" ? this._content : 0;
  }
  /**
  @internal
  */
  join(e) {
    let t = (Array.isArray(this._content) ? this._content : [this]).concat(Array.isArray(e._content) ? e._content : [e]);
    return new je(this.from, this.length + e.length, this.top, this.height + e.height, t);
  }
}
var K = /* @__PURE__ */ function(n) {
  return n[n.ByPos = 0] = "ByPos", n[n.ByHeight = 1] = "ByHeight", n[n.ByPosNoHeight = 2] = "ByPosNoHeight", n;
}(K || (K = {}));
const Vn = 1e-3;
class xe {
  constructor(e, t, i = 2) {
    this.length = e, this.height = t, this.flags = i;
  }
  get outdated() {
    return (this.flags & 2) > 0;
  }
  set outdated(e) {
    this.flags = (e ? 2 : 0) | this.flags & -3;
  }
  setHeight(e, t) {
    this.height != t && (Math.abs(this.height - t) > Vn && (e.heightChanged = !0), this.height = t);
  }
  // Base case is to replace a leaf node, which simply builds a tree
  // from the new nodes and returns that (HeightMapBranch and
  // HeightMapGap override this to actually use from/to)
  replace(e, t, i) {
    return xe.of(i);
  }
  // Again, these are base cases, and are overridden for branch and gap nodes.
  decomposeLeft(e, t) {
    t.push(this);
  }
  decomposeRight(e, t) {
    t.push(this);
  }
  applyChanges(e, t, i, s) {
    let r = this, o = i.doc;
    for (let l = s.length - 1; l >= 0; l--) {
      let { fromA: a, toA: h, fromB: c, toB: f } = s[l], u = r.lineAt(a, K.ByPosNoHeight, i.setDoc(t), 0, 0), d = u.to >= h ? u : r.lineAt(h, K.ByPosNoHeight, i, 0, 0);
      for (f += d.to - h, h = d.to; l > 0 && u.from <= s[l - 1].toA; )
        a = s[l - 1].fromA, c = s[l - 1].fromB, l--, a < u.from && (u = r.lineAt(a, K.ByPosNoHeight, i, 0, 0));
      c += u.from - a, a = u.from;
      let p = yo.build(i.setDoc(o), e, c, f);
      r = r.replace(a, h, p);
    }
    return r.updateHeight(i, 0);
  }
  static empty() {
    return new Le(0, 0);
  }
  // nodes uses null values to indicate the position of line breaks.
  // There are never line breaks at the start or end of the array, or
  // two line breaks next to each other, and the array isn't allowed
  // to be empty (same restrictions as return value from the builder).
  static of(e) {
    if (e.length == 1)
      return e[0];
    let t = 0, i = e.length, s = 0, r = 0;
    for (; ; )
      if (t == i)
        if (s > r * 2) {
          let l = e[t - 1];
          l.break ? e.splice(--t, 1, l.left, null, l.right) : e.splice(--t, 1, l.left, l.right), i += 1 + l.break, s -= l.size;
        } else if (r > s * 2) {
          let l = e[i];
          l.break ? e.splice(i, 1, l.left, null, l.right) : e.splice(i, 1, l.left, l.right), i += 2 + l.break, r -= l.size;
        } else
          break;
      else if (s < r) {
        let l = e[t++];
        l && (s += l.size);
      } else {
        let l = e[--i];
        l && (r += l.size);
      }
    let o = 0;
    return e[t - 1] == null ? (o = 1, t--) : e[t] == null && (o = 1, i++), new ep(xe.of(e.slice(0, t)), o, xe.of(e.slice(i)));
  }
}
xe.prototype.size = 1;
class ec extends xe {
  constructor(e, t, i) {
    super(e, t), this.deco = i;
  }
  blockAt(e, t, i, s) {
    return new je(s, this.length, i, this.height, this.deco || 0);
  }
  lineAt(e, t, i, s, r) {
    return this.blockAt(0, i, s, r);
  }
  forEachLine(e, t, i, s, r, o) {
    e <= r + this.length && t >= r && o(this.blockAt(0, i, s, r));
  }
  updateHeight(e, t = 0, i = !1, s) {
    return s && s.from <= t && s.more && this.setHeight(e, s.heights[s.index++]), this.outdated = !1, this;
  }
  toString() {
    return `block(${this.length})`;
  }
}
class Le extends ec {
  constructor(e, t) {
    super(e, t, null), this.collapsed = 0, this.widgetHeight = 0, this.breaks = 0;
  }
  blockAt(e, t, i, s) {
    return new je(s, this.length, i, this.height, this.breaks);
  }
  replace(e, t, i) {
    let s = i[0];
    return i.length == 1 && (s instanceof Le || s instanceof oe && s.flags & 4) && Math.abs(this.length - s.length) < 10 ? (s instanceof oe ? s = new Le(s.length, this.height) : s.height = this.height, this.outdated || (s.outdated = !1), s) : xe.of(i);
  }
  updateHeight(e, t = 0, i = !1, s) {
    return s && s.from <= t && s.more ? this.setHeight(e, s.heights[s.index++]) : (i || this.outdated) && this.setHeight(e, Math.max(this.widgetHeight, e.heightForLine(this.length - this.collapsed)) + this.breaks * e.lineHeight), this.outdated = !1, this;
  }
  toString() {
    return `line(${this.length}${this.collapsed ? -this.collapsed : ""}${this.widgetHeight ? ":" + this.widgetHeight : ""})`;
  }
}
class oe extends xe {
  constructor(e) {
    super(e, 0);
  }
  heightMetrics(e, t) {
    let i = e.doc.lineAt(t).number, s = e.doc.lineAt(t + this.length).number, r = s - i + 1, o, l = 0;
    if (e.lineWrapping) {
      let a = Math.min(this.height, e.lineHeight * r);
      o = a / r, this.length > r + 1 && (l = (this.height - a) / (this.length - r - 1));
    } else
      o = this.height / r;
    return { firstLine: i, lastLine: s, perLine: o, perChar: l };
  }
  blockAt(e, t, i, s) {
    let { firstLine: r, lastLine: o, perLine: l, perChar: a } = this.heightMetrics(t, s);
    if (t.lineWrapping) {
      let h = s + Math.round(Math.max(0, Math.min(1, (e - i) / this.height)) * this.length), c = t.doc.lineAt(h), f = l + c.length * a, u = Math.max(i, e - f / 2);
      return new je(c.from, c.length, u, f, 0);
    } else {
      let h = Math.max(0, Math.min(o - r, Math.floor((e - i) / l))), { from: c, length: f } = t.doc.line(r + h);
      return new je(c, f, i + l * h, l, 0);
    }
  }
  lineAt(e, t, i, s, r) {
    if (t == K.ByHeight)
      return this.blockAt(e, i, s, r);
    if (t == K.ByPosNoHeight) {
      let { from: d, to: p } = i.doc.lineAt(e);
      return new je(d, p - d, 0, 0, 0);
    }
    let { firstLine: o, perLine: l, perChar: a } = this.heightMetrics(i, r), h = i.doc.lineAt(e), c = l + h.length * a, f = h.number - o, u = s + l * f + a * (h.from - r - f);
    return new je(h.from, h.length, Math.max(s, Math.min(u, s + this.height - c)), c, 0);
  }
  forEachLine(e, t, i, s, r, o) {
    e = Math.max(e, r), t = Math.min(t, r + this.length);
    let { firstLine: l, perLine: a, perChar: h } = this.heightMetrics(i, r);
    for (let c = e, f = s; c <= t; ) {
      let u = i.doc.lineAt(c);
      if (c == e) {
        let p = u.number - l;
        f += a * p + h * (e - r - p);
      }
      let d = a + h * u.length;
      o(new je(u.from, u.length, f, d, 0)), f += d, c = u.to + 1;
    }
  }
  replace(e, t, i) {
    let s = this.length - t;
    if (s > 0) {
      let r = i[i.length - 1];
      r instanceof oe ? i[i.length - 1] = new oe(r.length + s) : i.push(null, new oe(s - 1));
    }
    if (e > 0) {
      let r = i[0];
      r instanceof oe ? i[0] = new oe(e + r.length) : i.unshift(new oe(e - 1), null);
    }
    return xe.of(i);
  }
  decomposeLeft(e, t) {
    t.push(new oe(e - 1), null);
  }
  decomposeRight(e, t) {
    t.push(null, new oe(this.length - e - 1));
  }
  updateHeight(e, t = 0, i = !1, s) {
    let r = t + this.length;
    if (s && s.from <= t + this.length && s.more) {
      let o = [], l = Math.max(t, s.from), a = -1;
      for (s.from > t && o.push(new oe(s.from - t - 1).updateHeight(e, t)); l <= r && s.more; ) {
        let c = e.doc.lineAt(l).length;
        o.length && o.push(null);
        let f = s.heights[s.index++];
        a == -1 ? a = f : Math.abs(f - a) >= Vn && (a = -2);
        let u = new Le(c, f);
        u.outdated = !1, o.push(u), l += c + 1;
      }
      l <= r && o.push(null, new oe(r - l).updateHeight(e, l));
      let h = xe.of(o);
      return (a < 0 || Math.abs(h.height - this.height) >= Vn || Math.abs(a - this.heightMetrics(e, t).perLine) >= Vn) && (e.heightChanged = !0), h;
    } else
      (i || this.outdated) && (this.setHeight(e, e.heightForGap(t, t + this.length)), this.outdated = !1);
    return this;
  }
  toString() {
    return `gap(${this.length})`;
  }
}
class ep extends xe {
  constructor(e, t, i) {
    super(e.length + t + i.length, e.height + i.height, t | (e.outdated || i.outdated ? 2 : 0)), this.left = e, this.right = i, this.size = e.size + i.size;
  }
  get break() {
    return this.flags & 1;
  }
  blockAt(e, t, i, s) {
    let r = i + this.left.height;
    return e < r ? this.left.blockAt(e, t, i, s) : this.right.blockAt(e, t, r, s + this.left.length + this.break);
  }
  lineAt(e, t, i, s, r) {
    let o = s + this.left.height, l = r + this.left.length + this.break, a = t == K.ByHeight ? e < o : e < l, h = a ? this.left.lineAt(e, t, i, s, r) : this.right.lineAt(e, t, i, o, l);
    if (this.break || (a ? h.to < l : h.from > l))
      return h;
    let c = t == K.ByPosNoHeight ? K.ByPosNoHeight : K.ByPos;
    return a ? h.join(this.right.lineAt(l, c, i, o, l)) : this.left.lineAt(l, c, i, s, r).join(h);
  }
  forEachLine(e, t, i, s, r, o) {
    let l = s + this.left.height, a = r + this.left.length + this.break;
    if (this.break)
      e < a && this.left.forEachLine(e, t, i, s, r, o), t >= a && this.right.forEachLine(e, t, i, l, a, o);
    else {
      let h = this.lineAt(a, K.ByPos, i, s, r);
      e < h.from && this.left.forEachLine(e, h.from - 1, i, s, r, o), h.to >= e && h.from <= t && o(h), t > h.to && this.right.forEachLine(h.to + 1, t, i, l, a, o);
    }
  }
  replace(e, t, i) {
    let s = this.left.length + this.break;
    if (t < s)
      return this.balanced(this.left.replace(e, t, i), this.right);
    if (e > this.left.length)
      return this.balanced(this.left, this.right.replace(e - s, t - s, i));
    let r = [];
    e > 0 && this.decomposeLeft(e, r);
    let o = r.length;
    for (let l of i)
      r.push(l);
    if (e > 0 && Bl(r, o - 1), t < this.length) {
      let l = r.length;
      this.decomposeRight(t, r), Bl(r, l);
    }
    return xe.of(r);
  }
  decomposeLeft(e, t) {
    let i = this.left.length;
    if (e <= i)
      return this.left.decomposeLeft(e, t);
    t.push(this.left), this.break && (i++, e >= i && t.push(null)), e > i && this.right.decomposeLeft(e - i, t);
  }
  decomposeRight(e, t) {
    let i = this.left.length, s = i + this.break;
    if (e >= s)
      return this.right.decomposeRight(e - s, t);
    e < i && this.left.decomposeRight(e, t), this.break && e < s && t.push(null), t.push(this.right);
  }
  balanced(e, t) {
    return e.size > 2 * t.size || t.size > 2 * e.size ? xe.of(this.break ? [e, null, t] : [e, t]) : (this.left = e, this.right = t, this.height = e.height + t.height, this.outdated = e.outdated || t.outdated, this.size = e.size + t.size, this.length = e.length + this.break + t.length, this);
  }
  updateHeight(e, t = 0, i = !1, s) {
    let { left: r, right: o } = this, l = t + r.length + this.break, a = null;
    return s && s.from <= t + r.length && s.more ? a = r = r.updateHeight(e, t, i, s) : r.updateHeight(e, t, i), s && s.from <= l + o.length && s.more ? a = o = o.updateHeight(e, l, i, s) : o.updateHeight(e, l, i), a ? this.balanced(r, o) : (this.height = this.left.height + this.right.height, this.outdated = !1, this);
  }
  toString() {
    return this.left + (this.break ? " " : "-") + this.right;
  }
}
function Bl(n, e) {
  let t, i;
  n[e] == null && (t = n[e - 1]) instanceof oe && (i = n[e + 1]) instanceof oe && n.splice(e - 1, 3, new oe(t.length + 1 + i.length));
}
const tp = 5;
class yo {
  constructor(e, t) {
    this.pos = e, this.oracle = t, this.nodes = [], this.lineStart = -1, this.lineEnd = -1, this.covering = null, this.writtenTo = e;
  }
  get isCovered() {
    return this.covering && this.nodes[this.nodes.length - 1] == this.covering;
  }
  span(e, t) {
    if (this.lineStart > -1) {
      let i = Math.min(t, this.lineEnd), s = this.nodes[this.nodes.length - 1];
      s instanceof Le ? s.length += i - this.pos : (i > this.pos || !this.isCovered) && this.nodes.push(new Le(i - this.pos, -1)), this.writtenTo = i, t > i && (this.nodes.push(null), this.writtenTo++, this.lineStart = -1);
    }
    this.pos = t;
  }
  point(e, t, i) {
    if (e < t || i.heightRelevant) {
      let s = i.widget ? i.widget.estimatedHeight : 0, r = i.widget ? i.widget.lineBreaks : 0;
      s < 0 && (s = this.oracle.lineHeight);
      let o = t - e;
      i.block ? this.addBlock(new ec(o, s, i)) : (o || r || s >= tp) && this.addLineDeco(s, r, o);
    } else
      t > e && this.span(e, t);
    this.lineEnd > -1 && this.lineEnd < this.pos && (this.lineEnd = this.oracle.doc.lineAt(this.pos).to);
  }
  enterLine() {
    if (this.lineStart > -1)
      return;
    let { from: e, to: t } = this.oracle.doc.lineAt(this.pos);
    this.lineStart = e, this.lineEnd = t, this.writtenTo < e && ((this.writtenTo < e - 1 || this.nodes[this.nodes.length - 1] == null) && this.nodes.push(this.blankContent(this.writtenTo, e - 1)), this.nodes.push(null)), this.pos > e && this.nodes.push(new Le(this.pos - e, -1)), this.writtenTo = this.pos;
  }
  blankContent(e, t) {
    let i = new oe(t - e);
    return this.oracle.doc.lineAt(e).to == t && (i.flags |= 4), i;
  }
  ensureLine() {
    this.enterLine();
    let e = this.nodes.length ? this.nodes[this.nodes.length - 1] : null;
    if (e instanceof Le)
      return e;
    let t = new Le(0, -1);
    return this.nodes.push(t), t;
  }
  addBlock(e) {
    this.enterLine();
    let t = e.deco;
    t && t.startSide > 0 && !this.isCovered && this.ensureLine(), this.nodes.push(e), this.writtenTo = this.pos = this.pos + e.length, t && t.endSide > 0 && (this.covering = e);
  }
  addLineDeco(e, t, i) {
    let s = this.ensureLine();
    s.length += i, s.collapsed += i, s.widgetHeight = Math.max(s.widgetHeight, e), s.breaks += t, this.writtenTo = this.pos = this.pos + i;
  }
  finish(e) {
    let t = this.nodes.length == 0 ? null : this.nodes[this.nodes.length - 1];
    this.lineStart > -1 && !(t instanceof Le) && !this.isCovered ? this.nodes.push(new Le(0, -1)) : (this.writtenTo < this.pos || t == null) && this.nodes.push(this.blankContent(this.writtenTo, this.pos));
    let i = e;
    for (let s of this.nodes)
      s instanceof Le && s.updateHeight(this.oracle, i), i += s ? s.length : 1;
    return this.nodes;
  }
  // Always called with a region that on both sides either stretches
  // to a line break or the end of the document.
  // The returned array uses null to indicate line breaks, but never
  // starts or ends in a line break, or has multiple line breaks next
  // to each other.
  static build(e, t, i, s) {
    let r = new yo(i, e);
    return I.spans(t, i, s, r, 0), r.finish(i);
  }
}
function ip(n, e, t) {
  let i = new np();
  return I.compare(n, e, t, i, 0), i.changes;
}
class np {
  constructor() {
    this.changes = [];
  }
  compareRange() {
  }
  comparePoint(e, t, i, s) {
    (e < t || i && i.heightRelevant || s && s.heightRelevant) && Zr(e, t, this.changes, 5);
  }
}
function sp(n, e) {
  let t = n.getBoundingClientRect(), i = n.ownerDocument, s = i.defaultView || window, r = Math.max(0, t.left), o = Math.min(s.innerWidth, t.right), l = Math.max(0, t.top), a = Math.min(s.innerHeight, t.bottom);
  for (let h = n.parentNode; h && h != i.body; )
    if (h.nodeType == 1) {
      let c = h, f = window.getComputedStyle(c);
      if ((c.scrollHeight > c.clientHeight || c.scrollWidth > c.clientWidth) && f.overflow != "visible") {
        let u = c.getBoundingClientRect();
        r = Math.max(r, u.left), o = Math.min(o, u.right), l = Math.max(l, u.top), a = h == n.parentNode ? u.bottom : Math.min(a, u.bottom);
      }
      h = f.position == "absolute" || f.position == "fixed" ? c.offsetParent : c.parentNode;
    } else if (h.nodeType == 11)
      h = h.host;
    else
      break;
  return {
    left: r - t.left,
    right: Math.max(r, o) - t.left,
    top: l - (t.top + e),
    bottom: Math.max(l, a) - (t.top + e)
  };
}
function rp(n, e) {
  let t = n.getBoundingClientRect();
  return {
    left: 0,
    right: t.right - t.left,
    top: e,
    bottom: t.bottom - (t.top + e)
  };
}
class Hs {
  constructor(e, t, i) {
    this.from = e, this.to = t, this.size = i;
  }
  static same(e, t) {
    if (e.length != t.length)
      return !1;
    for (let i = 0; i < e.length; i++) {
      let s = e[i], r = t[i];
      if (s.from != r.from || s.to != r.to || s.size != r.size)
        return !1;
    }
    return !0;
  }
  draw(e, t) {
    return T.replace({
      widget: new op(this.size * (t ? e.scaleY : e.scaleX), t)
    }).range(this.from, this.to);
  }
}
class op extends Mt {
  constructor(e, t) {
    super(), this.size = e, this.vertical = t;
  }
  eq(e) {
    return e.size == this.size && e.vertical == this.vertical;
  }
  toDOM() {
    let e = document.createElement("div");
    return this.vertical ? e.style.height = this.size + "px" : (e.style.width = this.size + "px", e.style.height = "2px", e.style.display = "inline-block"), e;
  }
  get estimatedHeight() {
    return this.vertical ? this.size : -1;
  }
}
class Wl {
  constructor(e) {
    this.state = e, this.pixelViewport = { left: 0, right: window.innerWidth, top: 0, bottom: 0 }, this.inView = !0, this.paddingTop = 0, this.paddingBottom = 0, this.contentDOMWidth = 0, this.contentDOMHeight = 0, this.editorHeight = 0, this.editorWidth = 0, this.scrollTop = 0, this.scrolledToBottom = !0, this.scaleX = 1, this.scaleY = 1, this.scrollAnchorPos = 0, this.scrollAnchorHeight = -1, this.scaler = Xl, this.scrollTarget = null, this.printing = !1, this.mustMeasureContent = !0, this.defaultTextDirection = J.LTR, this.visibleRanges = [], this.mustEnforceCursorAssoc = !1;
    let t = e.facet(go).some((i) => typeof i != "function" && i.class == "cm-lineWrapping");
    this.heightOracle = new qd(t), this.stateDeco = e.facet(Xi).filter((i) => typeof i != "function"), this.heightMap = xe.empty().applyChanges(this.stateDeco, E.empty, this.heightOracle.setDoc(e.doc), [new Ee(0, 0, 0, e.doc.length)]), this.viewport = this.getViewport(0, null), this.updateViewportLines(), this.updateForViewport(), this.lineGaps = this.ensureLineGaps([]), this.lineGapDeco = T.set(this.lineGaps.map((i) => i.draw(this, !1))), this.computeVisibleRanges();
  }
  updateForViewport() {
    let e = [this.viewport], { main: t } = this.state.selection;
    for (let i = 0; i <= 1; i++) {
      let s = i ? t.head : t.anchor;
      if (!e.some(({ from: r, to: o }) => s >= r && s <= o)) {
        let { from: r, to: o } = this.lineBlockAt(s);
        e.push(new dn(r, o));
      }
    }
    this.viewports = e.sort((i, s) => i.from - s.from), this.scaler = this.heightMap.height <= 7e6 ? Xl : new hp(this.heightOracle, this.heightMap, this.viewports);
  }
  updateViewportLines() {
    this.viewportLines = [], this.heightMap.forEachLine(this.viewport.from, this.viewport.to, this.heightOracle.setDoc(this.state.doc), 0, 0, (e) => {
      this.viewportLines.push(this.scaler.scale == 1 ? e : Si(e, this.scaler));
    });
  }
  update(e, t = null) {
    this.state = e.state;
    let i = this.stateDeco;
    this.stateDeco = this.state.facet(Xi).filter((c) => typeof c != "function");
    let s = e.changedRanges, r = Ee.extendWithRanges(s, ip(i, this.stateDeco, e ? e.changes : ne.empty(this.state.doc.length))), o = this.heightMap.height, l = this.scrolledToBottom ? null : this.scrollAnchorAt(this.scrollTop);
    this.heightMap = this.heightMap.applyChanges(this.stateDeco, e.startState.doc, this.heightOracle.setDoc(this.state.doc), r), this.heightMap.height != o && (e.flags |= 2), l ? (this.scrollAnchorPos = e.changes.mapPos(l.from, -1), this.scrollAnchorHeight = l.top) : (this.scrollAnchorPos = -1, this.scrollAnchorHeight = this.heightMap.height);
    let a = r.length ? this.mapViewport(this.viewport, e.changes) : this.viewport;
    (t && (t.range.head < a.from || t.range.head > a.to) || !this.viewportIsAppropriate(a)) && (a = this.getViewport(0, t));
    let h = !e.changes.empty || e.flags & 2 || a.from != this.viewport.from || a.to != this.viewport.to;
    this.viewport = a, this.updateForViewport(), h && this.updateViewportLines(), (this.lineGaps.length || this.viewport.to - this.viewport.from > 4e3) && this.updateLineGaps(this.ensureLineGaps(this.mapLineGaps(this.lineGaps, e.changes))), e.flags |= this.computeVisibleRanges(), t && (this.scrollTarget = t), !this.mustEnforceCursorAssoc && e.selectionSet && e.view.lineWrapping && e.state.selection.main.empty && e.state.selection.main.assoc && !e.state.facet(Wh) && (this.mustEnforceCursorAssoc = !0);
  }
  measure(e) {
    let t = e.contentDOM, i = window.getComputedStyle(t), s = this.heightOracle, r = i.whiteSpace;
    this.defaultTextDirection = i.direction == "rtl" ? J.RTL : J.LTR;
    let o = this.heightOracle.mustRefreshForWrapping(r), l = t.getBoundingClientRect(), a = o || this.mustMeasureContent || this.contentDOMHeight != l.height;
    this.contentDOMHeight = l.height, this.mustMeasureContent = !1;
    let h = 0, c = 0;
    if (l.width && l.height) {
      let { scaleX: S, scaleY: w } = fh(t, l);
      (this.scaleX != S || this.scaleY != w) && (this.scaleX = S, this.scaleY = w, h |= 8, o = a = !0);
    }
    let f = (parseInt(i.paddingTop) || 0) * this.scaleY, u = (parseInt(i.paddingBottom) || 0) * this.scaleY;
    (this.paddingTop != f || this.paddingBottom != u) && (this.paddingTop = f, this.paddingBottom = u, h |= 10), this.editorWidth != e.scrollDOM.clientWidth && (s.lineWrapping && (a = !0), this.editorWidth = e.scrollDOM.clientWidth, h |= 8);
    let d = e.scrollDOM.scrollTop * this.scaleY;
    this.scrollTop != d && (this.scrollAnchorHeight = -1, this.scrollTop = d), this.scrolledToBottom = ph(e.scrollDOM);
    let p = (this.printing ? rp : sp)(t, this.paddingTop), g = p.top - this.pixelViewport.top, m = p.bottom - this.pixelViewport.bottom;
    this.pixelViewport = p;
    let b = this.pixelViewport.bottom > this.pixelViewport.top && this.pixelViewport.right > this.pixelViewport.left;
    if (b != this.inView && (this.inView = b, b && (a = !0)), !this.inView && !this.scrollTarget)
      return 0;
    let k = l.width;
    if ((this.contentDOMWidth != k || this.editorHeight != e.scrollDOM.clientHeight) && (this.contentDOMWidth = l.width, this.editorHeight = e.scrollDOM.clientHeight, h |= 8), a) {
      let S = e.docView.measureVisibleLineHeights(this.viewport);
      if (s.mustRefreshForHeights(S) && (o = !0), o || s.lineWrapping && Math.abs(k - this.contentDOMWidth) > s.charWidth) {
        let { lineHeight: w, charWidth: A, textHeight: O } = e.docView.measureTextSize();
        o = w > 0 && s.refresh(r, w, A, O, k / A, S), o && (e.docView.minWidth = 0, h |= 8);
      }
      g > 0 && m > 0 ? c = Math.max(g, m) : g < 0 && m < 0 && (c = Math.min(g, m)), s.heightChanged = !1;
      for (let w of this.viewports) {
        let A = w.from == this.viewport.from ? S : e.docView.measureVisibleLineHeights(w);
        this.heightMap = (o ? xe.empty().applyChanges(this.stateDeco, E.empty, this.heightOracle, [new Ee(0, 0, 0, e.state.doc.length)]) : this.heightMap).updateHeight(s, 0, o, new _d(w.from, A));
      }
      s.heightChanged && (h |= 2);
    }
    let C = !this.viewportIsAppropriate(this.viewport, c) || this.scrollTarget && (this.scrollTarget.range.head < this.viewport.from || this.scrollTarget.range.head > this.viewport.to);
    return C && (this.viewport = this.getViewport(c, this.scrollTarget)), this.updateForViewport(), (h & 2 || C) && this.updateViewportLines(), (this.lineGaps.length || this.viewport.to - this.viewport.from > 4e3) && this.updateLineGaps(this.ensureLineGaps(o ? [] : this.lineGaps, e)), h |= this.computeVisibleRanges(), this.mustEnforceCursorAssoc && (this.mustEnforceCursorAssoc = !1, e.docView.enforceCursorAssoc()), h;
  }
  get visibleTop() {
    return this.scaler.fromDOM(this.pixelViewport.top);
  }
  get visibleBottom() {
    return this.scaler.fromDOM(this.pixelViewport.bottom);
  }
  getViewport(e, t) {
    let i = 0.5 - Math.max(-0.5, Math.min(0.5, e / 1e3 / 2)), s = this.heightMap, r = this.heightOracle, { visibleTop: o, visibleBottom: l } = this, a = new dn(s.lineAt(o - i * 1e3, K.ByHeight, r, 0, 0).from, s.lineAt(l + (1 - i) * 1e3, K.ByHeight, r, 0, 0).to);
    if (t) {
      let { head: h } = t.range;
      if (h < a.from || h > a.to) {
        let c = Math.min(this.editorHeight, this.pixelViewport.bottom - this.pixelViewport.top), f = s.lineAt(h, K.ByPos, r, 0, 0), u;
        t.y == "center" ? u = (f.top + f.bottom) / 2 - c / 2 : t.y == "start" || t.y == "nearest" && h < a.from ? u = f.top : u = f.bottom - c, a = new dn(s.lineAt(u - 1e3 / 2, K.ByHeight, r, 0, 0).from, s.lineAt(u + c + 1e3 / 2, K.ByHeight, r, 0, 0).to);
      }
    }
    return a;
  }
  mapViewport(e, t) {
    let i = t.mapPos(e.from, -1), s = t.mapPos(e.to, 1);
    return new dn(this.heightMap.lineAt(i, K.ByPos, this.heightOracle, 0, 0).from, this.heightMap.lineAt(s, K.ByPos, this.heightOracle, 0, 0).to);
  }
  // Checks if a given viewport covers the visible part of the
  // document and not too much beyond that.
  viewportIsAppropriate({ from: e, to: t }, i = 0) {
    if (!this.inView)
      return !0;
    let { top: s } = this.heightMap.lineAt(e, K.ByPos, this.heightOracle, 0, 0), { bottom: r } = this.heightMap.lineAt(t, K.ByPos, this.heightOracle, 0, 0), { visibleTop: o, visibleBottom: l } = this;
    return (e == 0 || s <= o - Math.max(10, Math.min(
      -i,
      250
      /* VP.MaxCoverMargin */
    ))) && (t == this.state.doc.length || r >= l + Math.max(10, Math.min(
      i,
      250
      /* VP.MaxCoverMargin */
    ))) && s > o - 2 * 1e3 && r < l + 2 * 1e3;
  }
  mapLineGaps(e, t) {
    if (!e.length || t.empty)
      return e;
    let i = [];
    for (let s of e)
      t.touchesRange(s.from, s.to) || i.push(new Hs(t.mapPos(s.from), t.mapPos(s.to), s.size));
    return i;
  }
  // Computes positions in the viewport where the start or end of a
  // line should be hidden, trying to reuse existing line gaps when
  // appropriate to avoid unneccesary redraws.
  // Uses crude character-counting for the positioning and sizing,
  // since actual DOM coordinates aren't always available and
  // predictable. Relies on generous margins (see LG.Margin) to hide
  // the artifacts this might produce from the user.
  ensureLineGaps(e, t) {
    let i = this.heightOracle.lineWrapping, s = i ? 1e4 : 2e3, r = s >> 1, o = s << 1;
    if (this.defaultTextDirection != J.LTR && !i)
      return [];
    let l = [], a = (h, c, f, u) => {
      if (c - h < r)
        return;
      let d = this.state.selection.main, p = [d.from];
      d.empty || p.push(d.to);
      for (let m of p)
        if (m > h && m < c) {
          a(h, m - 10, f, u), a(m + 10, c, f, u);
          return;
        }
      let g = ap(e, (m) => m.from >= f.from && m.to <= f.to && Math.abs(m.from - h) < r && Math.abs(m.to - c) < r && !p.some((b) => m.from < b && m.to > b));
      if (!g) {
        if (c < f.to && t && i && t.visibleRanges.some((m) => m.from <= c && m.to >= c)) {
          let m = t.moveToLineBoundary(y.cursor(c), !1, !0).head;
          m > h && (c = m);
        }
        g = new Hs(h, c, this.gapSize(f, h, c, u));
      }
      l.push(g);
    };
    for (let h of this.viewportLines) {
      if (h.length < o)
        continue;
      let c = lp(h.from, h.to, this.stateDeco);
      if (c.total < o)
        continue;
      let f = this.scrollTarget ? this.scrollTarget.range.head : null, u, d;
      if (i) {
        let p = s / this.heightOracle.lineLength * this.heightOracle.lineHeight, g, m;
        if (f != null) {
          let b = mn(c, f), k = ((this.visibleBottom - this.visibleTop) / 2 + p) / h.height;
          g = b - k, m = b + k;
        } else
          g = (this.visibleTop - h.top - p) / h.height, m = (this.visibleBottom - h.top + p) / h.height;
        u = pn(c, g), d = pn(c, m);
      } else {
        let p = c.total * this.heightOracle.charWidth, g = s * this.heightOracle.charWidth, m, b;
        if (f != null) {
          let k = mn(c, f), C = ((this.pixelViewport.right - this.pixelViewport.left) / 2 + g) / p;
          m = k - C, b = k + C;
        } else
          m = (this.pixelViewport.left - g) / p, b = (this.pixelViewport.right + g) / p;
        u = pn(c, m), d = pn(c, b);
      }
      u > h.from && a(h.from, u, h, c), d < h.to && a(d, h.to, h, c);
    }
    return l;
  }
  gapSize(e, t, i, s) {
    let r = mn(s, i) - mn(s, t);
    return this.heightOracle.lineWrapping ? e.height * r : s.total * this.heightOracle.charWidth * r;
  }
  updateLineGaps(e) {
    Hs.same(e, this.lineGaps) || (this.lineGaps = e, this.lineGapDeco = T.set(e.map((t) => t.draw(this, this.heightOracle.lineWrapping))));
  }
  computeVisibleRanges() {
    let e = this.stateDeco;
    this.lineGaps.length && (e = e.concat(this.lineGapDeco));
    let t = [];
    I.spans(e, this.viewport.from, this.viewport.to, {
      span(s, r) {
        t.push({ from: s, to: r });
      },
      point() {
      }
    }, 20);
    let i = t.length != this.visibleRanges.length || this.visibleRanges.some((s, r) => s.from != t[r].from || s.to != t[r].to);
    return this.visibleRanges = t, i ? 4 : 0;
  }
  lineBlockAt(e) {
    return e >= this.viewport.from && e <= this.viewport.to && this.viewportLines.find((t) => t.from <= e && t.to >= e) || Si(this.heightMap.lineAt(e, K.ByPos, this.heightOracle, 0, 0), this.scaler);
  }
  lineBlockAtHeight(e) {
    return Si(this.heightMap.lineAt(this.scaler.fromDOM(e), K.ByHeight, this.heightOracle, 0, 0), this.scaler);
  }
  scrollAnchorAt(e) {
    let t = this.lineBlockAtHeight(e + 8);
    return t.from >= this.viewport.from || this.viewportLines[0].top - e > 200 ? t : this.viewportLines[0];
  }
  elementAtHeight(e) {
    return Si(this.heightMap.blockAt(this.scaler.fromDOM(e), this.heightOracle, 0, 0), this.scaler);
  }
  get docHeight() {
    return this.scaler.toDOM(this.heightMap.height);
  }
  get contentHeight() {
    return this.docHeight + this.paddingTop + this.paddingBottom;
  }
}
class dn {
  constructor(e, t) {
    this.from = e, this.to = t;
  }
}
function lp(n, e, t) {
  let i = [], s = n, r = 0;
  return I.spans(t, n, e, {
    span() {
    },
    point(o, l) {
      o > s && (i.push({ from: s, to: o }), r += o - s), s = l;
    }
  }, 20), s < e && (i.push({ from: s, to: e }), r += e - s), { total: r, ranges: i };
}
function pn({ total: n, ranges: e }, t) {
  if (t <= 0)
    return e[0].from;
  if (t >= 1)
    return e[e.length - 1].to;
  let i = Math.floor(n * t);
  for (let s = 0; ; s++) {
    let { from: r, to: o } = e[s], l = o - r;
    if (i <= l)
      return r + i;
    i -= l;
  }
}
function mn(n, e) {
  let t = 0;
  for (let { from: i, to: s } of n.ranges) {
    if (e <= s) {
      t += e - i;
      break;
    }
    t += s - i;
  }
  return t / n.total;
}
function ap(n, e) {
  for (let t of n)
    if (e(t))
      return t;
}
const Xl = {
  toDOM(n) {
    return n;
  },
  fromDOM(n) {
    return n;
  },
  scale: 1
};
class hp {
  constructor(e, t, i) {
    let s = 0, r = 0, o = 0;
    this.viewports = i.map(({ from: l, to: a }) => {
      let h = t.lineAt(l, K.ByPos, e, 0, 0).top, c = t.lineAt(a, K.ByPos, e, 0, 0).bottom;
      return s += c - h, { from: l, to: a, top: h, bottom: c, domTop: 0, domBottom: 0 };
    }), this.scale = (7e6 - s) / (t.height - s);
    for (let l of this.viewports)
      l.domTop = o + (l.top - r) * this.scale, o = l.domBottom = l.domTop + (l.bottom - l.top), r = l.bottom;
  }
  toDOM(e) {
    for (let t = 0, i = 0, s = 0; ; t++) {
      let r = t < this.viewports.length ? this.viewports[t] : null;
      if (!r || e < r.top)
        return s + (e - i) * this.scale;
      if (e <= r.bottom)
        return r.domTop + (e - r.top);
      i = r.bottom, s = r.domBottom;
    }
  }
  fromDOM(e) {
    for (let t = 0, i = 0, s = 0; ; t++) {
      let r = t < this.viewports.length ? this.viewports[t] : null;
      if (!r || e < r.domTop)
        return i + (e - s) / this.scale;
      if (e <= r.domBottom)
        return r.top + (e - r.domTop);
      i = r.bottom, s = r.domBottom;
    }
  }
}
function Si(n, e) {
  if (e.scale == 1)
    return n;
  let t = e.toDOM(n.top), i = e.toDOM(n.bottom);
  return new je(n.from, n.length, t, i - t, Array.isArray(n._content) ? n._content.map((s) => Si(s, e)) : n._content);
}
const gn = /* @__PURE__ */ M.define({ combine: (n) => n.join(" ") }), Xr = /* @__PURE__ */ M.define({ combine: (n) => n.indexOf(!0) > -1 }), Ir = /* @__PURE__ */ St.newName(), tc = /* @__PURE__ */ St.newName(), ic = /* @__PURE__ */ St.newName(), nc = { "&light": "." + tc, "&dark": "." + ic };
function Er(n, e, t) {
  return new St(e, {
    finish(i) {
      return /&/.test(i) ? i.replace(/&\w*/, (s) => {
        if (s == "&")
          return n;
        if (!t || !t[s])
          throw new RangeError(`Unsupported selector: ${s}`);
        return t[s];
      }) : n + " " + i;
    }
  });
}
const cp = /* @__PURE__ */ Er("." + Ir, {
  "&": {
    position: "relative !important",
    boxSizing: "border-box",
    "&.cm-focused": {
      // Provide a simple default outline to make sure a focused
      // editor is visually distinct. Can't leave the default behavior
      // because that will apply to the content element, which is
      // inside the scrollable container and doesn't include the
      // gutters. We also can't use an 'auto' outline, since those
      // are, for some reason, drawn behind the element content, which
      // will cause things like the active line background to cover
      // the outline (#297).
      outline: "1px dotted #212121"
    },
    display: "flex !important",
    flexDirection: "column"
  },
  ".cm-scroller": {
    display: "flex !important",
    alignItems: "flex-start !important",
    fontFamily: "monospace",
    lineHeight: 1.4,
    height: "100%",
    overflowX: "auto",
    position: "relative",
    zIndex: 0
  },
  ".cm-content": {
    margin: 0,
    flexGrow: 2,
    flexShrink: 0,
    display: "block",
    whiteSpace: "pre",
    wordWrap: "normal",
    // https://github.com/codemirror/dev/issues/456
    boxSizing: "border-box",
    minHeight: "100%",
    padding: "4px 0",
    outline: "none",
    "&[contenteditable=true]": {
      WebkitUserModify: "read-write-plaintext-only"
    }
  },
  ".cm-lineWrapping": {
    whiteSpace_fallback: "pre-wrap",
    // For IE
    whiteSpace: "break-spaces",
    wordBreak: "break-word",
    // For Safari, which doesn't support overflow-wrap: anywhere
    overflowWrap: "anywhere",
    flexShrink: 1
  },
  "&light .cm-content": { caretColor: "black" },
  "&dark .cm-content": { caretColor: "white" },
  ".cm-line": {
    display: "block",
    padding: "0 2px 0 6px"
  },
  ".cm-layer": {
    position: "absolute",
    left: 0,
    top: 0,
    contain: "size style",
    "& > *": {
      position: "absolute"
    }
  },
  "&light .cm-selectionBackground": {
    background: "#d9d9d9"
  },
  "&dark .cm-selectionBackground": {
    background: "#222"
  },
  "&light.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground": {
    background: "#d7d4f0"
  },
  "&dark.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground": {
    background: "#233"
  },
  ".cm-cursorLayer": {
    pointerEvents: "none"
  },
  "&.cm-focused > .cm-scroller > .cm-cursorLayer": {
    animation: "steps(1) cm-blink 1.2s infinite"
  },
  // Two animations defined so that we can switch between them to
  // restart the animation without forcing another style
  // recomputation.
  "@keyframes cm-blink": { "0%": {}, "50%": { opacity: 0 }, "100%": {} },
  "@keyframes cm-blink2": { "0%": {}, "50%": { opacity: 0 }, "100%": {} },
  ".cm-cursor, .cm-dropCursor": {
    borderLeft: "1.2px solid black",
    marginLeft: "-0.6px",
    pointerEvents: "none"
  },
  ".cm-cursor": {
    display: "none"
  },
  "&dark .cm-cursor": {
    borderLeftColor: "#444"
  },
  ".cm-dropCursor": {
    position: "absolute"
  },
  "&.cm-focused > .cm-scroller > .cm-cursorLayer .cm-cursor": {
    display: "block"
  },
  ".cm-iso": {
    unicodeBidi: "isolate"
  },
  ".cm-announced": {
    position: "fixed",
    top: "-10000px"
  },
  "@media print": {
    ".cm-announced": { display: "none" }
  },
  "&light .cm-activeLine": { backgroundColor: "#cceeff44" },
  "&dark .cm-activeLine": { backgroundColor: "#99eeff33" },
  "&light .cm-specialChar": { color: "red" },
  "&dark .cm-specialChar": { color: "#f78" },
  ".cm-gutters": {
    flexShrink: 0,
    display: "flex",
    height: "100%",
    boxSizing: "border-box",
    insetInlineStart: 0,
    zIndex: 200
  },
  "&light .cm-gutters": {
    backgroundColor: "#f5f5f5",
    color: "#6c6c6c",
    borderRight: "1px solid #ddd"
  },
  "&dark .cm-gutters": {
    backgroundColor: "#333338",
    color: "#ccc"
  },
  ".cm-gutter": {
    display: "flex !important",
    // Necessary -- prevents margin collapsing
    flexDirection: "column",
    flexShrink: 0,
    boxSizing: "border-box",
    minHeight: "100%",
    overflow: "hidden"
  },
  ".cm-gutterElement": {
    boxSizing: "border-box"
  },
  ".cm-lineNumbers .cm-gutterElement": {
    padding: "0 3px 0 5px",
    minWidth: "20px",
    textAlign: "right",
    whiteSpace: "nowrap"
  },
  "&light .cm-activeLineGutter": {
    backgroundColor: "#e2f2ff"
  },
  "&dark .cm-activeLineGutter": {
    backgroundColor: "#222227"
  },
  ".cm-panels": {
    boxSizing: "border-box",
    position: "sticky",
    left: 0,
    right: 0
  },
  "&light .cm-panels": {
    backgroundColor: "#f5f5f5",
    color: "black"
  },
  "&light .cm-panels-top": {
    borderBottom: "1px solid #ddd"
  },
  "&light .cm-panels-bottom": {
    borderTop: "1px solid #ddd"
  },
  "&dark .cm-panels": {
    backgroundColor: "#333338",
    color: "white"
  },
  ".cm-tab": {
    display: "inline-block",
    overflow: "hidden",
    verticalAlign: "bottom"
  },
  ".cm-widgetBuffer": {
    verticalAlign: "text-top",
    height: "1em",
    width: 0,
    display: "inline"
  },
  ".cm-placeholder": {
    color: "#888",
    display: "inline-block",
    verticalAlign: "top"
  },
  ".cm-highlightSpace:before": {
    content: "attr(data-display)",
    position: "absolute",
    pointerEvents: "none",
    color: "#888"
  },
  ".cm-highlightTab": {
    backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="20"><path stroke="%23888" stroke-width="1" fill="none" d="M1 10H196L190 5M190 15L196 10M197 4L197 16"/></svg>')`,
    backgroundSize: "auto 100%",
    backgroundPosition: "right 90%",
    backgroundRepeat: "no-repeat"
  },
  ".cm-trailingSpace": {
    backgroundColor: "#ff332255"
  },
  ".cm-button": {
    verticalAlign: "middle",
    color: "inherit",
    fontSize: "70%",
    padding: ".2em 1em",
    borderRadius: "1px"
  },
  "&light .cm-button": {
    backgroundImage: "linear-gradient(#eff1f5, #d9d9df)",
    border: "1px solid #888",
    "&:active": {
      backgroundImage: "linear-gradient(#b4b4b4, #d0d3d6)"
    }
  },
  "&dark .cm-button": {
    backgroundImage: "linear-gradient(#393939, #111)",
    border: "1px solid #888",
    "&:active": {
      backgroundImage: "linear-gradient(#111, #333)"
    }
  },
  ".cm-textfield": {
    verticalAlign: "middle",
    color: "inherit",
    fontSize: "70%",
    border: "1px solid silver",
    padding: ".2em .5em"
  },
  "&light .cm-textfield": {
    backgroundColor: "white"
  },
  "&dark .cm-textfield": {
    border: "1px solid #555",
    backgroundColor: "inherit"
  }
}, nc), vi = "￿";
class fp {
  constructor(e, t) {
    this.points = e, this.text = "", this.lineSeparator = t.facet(G.lineSeparator);
  }
  append(e) {
    this.text += e;
  }
  lineBreak() {
    this.text += vi;
  }
  readRange(e, t) {
    if (!e)
      return this;
    let i = e.parentNode;
    for (let s = e; ; ) {
      this.findPointBefore(i, s);
      let r = this.text.length;
      this.readNode(s);
      let o = s.nextSibling;
      if (o == t)
        break;
      let l = Y.get(s), a = Y.get(o);
      (l && a ? l.breakAfter : (l ? l.breakAfter : Il(s)) || Il(o) && (s.nodeName != "BR" || s.cmIgnore) && this.text.length > r) && this.lineBreak(), s = o;
    }
    return this.findPointBefore(i, t), this;
  }
  readTextNode(e) {
    let t = e.nodeValue;
    for (let i of this.points)
      i.node == e && (i.pos = this.text.length + Math.min(i.offset, t.length));
    for (let i = 0, s = this.lineSeparator ? null : /\r\n?|\n/g; ; ) {
      let r = -1, o = 1, l;
      if (this.lineSeparator ? (r = t.indexOf(this.lineSeparator, i), o = this.lineSeparator.length) : (l = s.exec(t)) && (r = l.index, o = l[0].length), this.append(t.slice(i, r < 0 ? t.length : r)), r < 0)
        break;
      if (this.lineBreak(), o > 1)
        for (let a of this.points)
          a.node == e && a.pos > this.text.length && (a.pos -= o - 1);
      i = r + o;
    }
  }
  readNode(e) {
    if (e.cmIgnore)
      return;
    let t = Y.get(e), i = t && t.overrideDOMText;
    if (i != null) {
      this.findPointInside(e, i.length);
      for (let s = i.iter(); !s.next().done; )
        s.lineBreak ? this.lineBreak() : this.append(s.value);
    } else
      e.nodeType == 3 ? this.readTextNode(e) : e.nodeName == "BR" ? e.nextSibling && this.lineBreak() : e.nodeType == 1 && this.readRange(e.firstChild, null);
  }
  findPointBefore(e, t) {
    for (let i of this.points)
      i.node == e && e.childNodes[i.offset] == t && (i.pos = this.text.length);
  }
  findPointInside(e, t) {
    for (let i of this.points)
      (e.nodeType == 3 ? i.node == e : e.contains(i.node)) && (i.pos = this.text.length + (up(e, i.node, i.offset) ? t : 0));
  }
}
function up(n, e, t) {
  for (; ; ) {
    if (!e || t < rt(e))
      return !1;
    if (e == n)
      return !0;
    t = Wi(e) + 1, e = e.parentNode;
  }
}
function Il(n) {
  return n.nodeType == 1 && /^(DIV|P|LI|UL|OL|BLOCKQUOTE|DD|DT|H\d|SECTION|PRE)$/.test(n.nodeName);
}
class El {
  constructor(e, t) {
    this.node = e, this.offset = t, this.pos = -1;
  }
}
class dp {
  constructor(e, t, i, s) {
    this.typeOver = s, this.bounds = null, this.text = "";
    let { impreciseHead: r, impreciseAnchor: o } = e.docView;
    if (e.state.readOnly && t > -1)
      this.newSel = null;
    else if (t > -1 && (this.bounds = e.docView.domBoundsAround(t, i, 0))) {
      let l = r || o ? [] : gp(e), a = new fp(l, e.state);
      a.readRange(this.bounds.startDOM, this.bounds.endDOM), this.text = a.text, this.newSel = bp(l, this.bounds.from);
    } else {
      let l = e.observer.selectionRange, a = r && r.node == l.focusNode && r.offset == l.focusOffset || !vr(e.contentDOM, l.focusNode) ? e.state.selection.main.head : e.docView.posFromDOM(l.focusNode, l.focusOffset), h = o && o.node == l.anchorNode && o.offset == l.anchorOffset || !vr(e.contentDOM, l.anchorNode) ? e.state.selection.main.anchor : e.docView.posFromDOM(l.anchorNode, l.anchorOffset), c = e.viewport;
      if ((R.ios || R.chrome) && e.state.selection.main.empty && a != h && (c.from > 0 || c.to < e.state.doc.length)) {
        let f = Math.min(a, h), u = Math.max(a, h), d = c.from - f, p = c.to - u;
        (d == 0 || d == 1 || f == 0) && (p == 0 || p == -1 || u == e.state.doc.length) && (a = 0, h = e.state.doc.length);
      }
      this.newSel = y.single(h, a);
    }
  }
}
function sc(n, e) {
  let t, { newSel: i } = e, s = n.state.selection.main, r = n.inputState.lastKeyTime > Date.now() - 100 ? n.inputState.lastKeyCode : -1;
  if (e.bounds) {
    let { from: o, to: l } = e.bounds, a = s.from, h = null;
    (r === 8 || R.android && e.text.length < l - o) && (a = s.to, h = "end");
    let c = mp(n.state.doc.sliceString(o, l, vi), e.text, a - o, h);
    c && (R.chrome && r == 13 && c.toB == c.from + 2 && e.text.slice(c.from, c.toB) == vi + vi && c.toB--, t = {
      from: o + c.from,
      to: o + c.toA,
      insert: E.of(e.text.slice(c.from, c.toB).split(vi))
    });
  } else
    i && (!n.hasFocus && n.state.facet(ws) || i.main.eq(s)) && (i = null);
  if (!t && !i)
    return !1;
  if (!t && e.typeOver && !s.empty && i && i.main.empty ? t = { from: s.from, to: s.to, insert: n.state.doc.slice(s.from, s.to) } : t && t.from >= s.from && t.to <= s.to && (t.from != s.from || t.to != s.to) && s.to - s.from - (t.to - t.from) <= 4 ? t = {
    from: s.from,
    to: s.to,
    insert: n.state.doc.slice(s.from, t.from).append(t.insert).append(n.state.doc.slice(t.to, s.to))
  } : (R.mac || R.android) && t && t.from == t.to && t.from == s.head - 1 && /^\. ?$/.test(t.insert.toString()) && n.contentDOM.getAttribute("autocorrect") == "off" ? (i && t.insert.length == 2 && (i = y.single(i.main.anchor - 1, i.main.head - 1)), t = { from: s.from, to: s.to, insert: E.of([" "]) }) : R.chrome && t && t.from == t.to && t.from == s.head && t.insert.toString() == `
 ` && n.lineWrapping && (i && (i = y.single(i.main.anchor - 1, i.main.head - 1)), t = { from: s.from, to: s.to, insert: E.of([" "]) }), t) {
    if (R.ios && n.inputState.flushIOSKey() || R.android && (t.from == s.from && t.to == s.to && t.insert.length == 1 && t.insert.lines == 2 && ei(n.contentDOM, "Enter", 13) || (t.from == s.from - 1 && t.to == s.to && t.insert.length == 0 || r == 8 && t.insert.length < t.to - t.from && t.to > s.head) && ei(n.contentDOM, "Backspace", 8) || t.from == s.from && t.to == s.to + 1 && t.insert.length == 0 && ei(n.contentDOM, "Delete", 46)))
      return !0;
    let o = t.insert.toString();
    n.inputState.composing >= 0 && n.inputState.composing++;
    let l, a = () => l || (l = pp(n, t, i));
    return n.state.facet(Ph).some((h) => h(n, t.from, t.to, o, a)) || n.dispatch(a()), !0;
  } else if (i && !i.main.eq(s)) {
    let o = !1, l = "select";
    return n.inputState.lastSelectionTime > Date.now() - 50 && (n.inputState.lastSelectionOrigin == "select" && (o = !0), l = n.inputState.lastSelectionOrigin), n.dispatch({ selection: i, scrollIntoView: o, userEvent: l }), !0;
  } else
    return !1;
}
function pp(n, e, t) {
  let i, s = n.state, r = s.selection.main;
  if (e.from >= r.from && e.to <= r.to && e.to - e.from >= (r.to - r.from) / 3 && (!t || t.main.empty && t.main.from == e.from + e.insert.length) && n.inputState.composing < 0) {
    let l = r.from < e.from ? s.sliceDoc(r.from, e.from) : "", a = r.to > e.to ? s.sliceDoc(e.to, r.to) : "";
    i = s.replaceSelection(n.state.toText(l + e.insert.sliceString(0, void 0, n.state.lineBreak) + a));
  } else {
    let l = s.changes(e), a = t && t.main.to <= l.newLength ? t.main : void 0;
    if (s.selection.ranges.length > 1 && n.inputState.composing >= 0 && e.to <= r.to && e.to >= r.to - 10) {
      let h = n.state.sliceDoc(e.from, e.to), c, f = t && Hh(n, t.main.head);
      if (f) {
        let p = e.insert.length - (e.to - e.from);
        c = { from: f.from, to: f.to - p };
      } else
        c = n.state.doc.lineAt(r.head);
      let u = r.to - e.to, d = r.to - r.from;
      i = s.changeByRange((p) => {
        if (p.from == r.from && p.to == r.to)
          return { changes: l, range: a || p.map(l) };
        let g = p.to - u, m = g - h.length;
        if (p.to - p.from != d || n.state.sliceDoc(m, g) != h || // Unfortunately, there's no way to make multiple
        // changes in the same node work without aborting
        // composition, so cursors in the composition range are
        // ignored.
        p.to >= c.from && p.from <= c.to)
          return { range: p };
        let b = s.changes({ from: m, to: g, insert: e.insert }), k = p.to - r.to;
        return {
          changes: b,
          range: a ? y.range(Math.max(0, a.anchor + k), Math.max(0, a.head + k)) : p.map(b)
        };
      });
    } else
      i = {
        changes: l,
        selection: a && s.selection.replaceRange(a)
      };
  }
  let o = "input.type";
  return (n.composing || n.inputState.compositionPendingChange && n.inputState.compositionEndedAt > Date.now() - 50) && (n.inputState.compositionPendingChange = !1, o += ".compose", n.inputState.compositionFirstChange && (o += ".start", n.inputState.compositionFirstChange = !1)), s.update(i, { userEvent: o, scrollIntoView: !0 });
}
function mp(n, e, t, i) {
  let s = Math.min(n.length, e.length), r = 0;
  for (; r < s && n.charCodeAt(r) == e.charCodeAt(r); )
    r++;
  if (r == s && n.length == e.length)
    return null;
  let o = n.length, l = e.length;
  for (; o > 0 && l > 0 && n.charCodeAt(o - 1) == e.charCodeAt(l - 1); )
    o--, l--;
  if (i == "end") {
    let a = Math.max(0, r - Math.min(o, l));
    t -= o + a - r;
  }
  if (o < r && n.length < e.length) {
    let a = t <= r && t >= o ? r - t : 0;
    r -= a, l = r + (l - o), o = r;
  } else if (l < r) {
    let a = t <= r && t >= l ? r - t : 0;
    r -= a, o = r + (o - l), l = r;
  }
  return { from: r, toA: o, toB: l };
}
function gp(n) {
  let e = [];
  if (n.root.activeElement != n.contentDOM)
    return e;
  let { anchorNode: t, anchorOffset: i, focusNode: s, focusOffset: r } = n.observer.selectionRange;
  return t && (e.push(new El(t, i)), (s != t || r != i) && e.push(new El(s, r))), e;
}
function bp(n, e) {
  if (n.length == 0)
    return null;
  let t = n[0].pos, i = n.length == 2 ? n[1].pos : t;
  return t > -1 && i > -1 ? y.single(t + e, i + e) : null;
}
const yp = {
  childList: !0,
  characterData: !0,
  subtree: !0,
  attributes: !0,
  characterDataOldValue: !0
}, Fs = R.ie && R.ie_version <= 11;
class xp {
  constructor(e) {
    this.view = e, this.active = !1, this.selectionRange = new id(), this.selectionChanged = !1, this.delayedFlush = -1, this.resizeTimeout = -1, this.queue = [], this.delayedAndroidKey = null, this.flushingAndroidKey = -1, this.lastChange = 0, this.scrollTargets = [], this.intersection = null, this.resizeScroll = null, this.intersecting = !1, this.gapIntersection = null, this.gaps = [], this.parentCheck = -1, this.dom = e.contentDOM, this.observer = new MutationObserver((t) => {
      for (let i of t)
        this.queue.push(i);
      (R.ie && R.ie_version <= 11 || R.ios && e.composing) && t.some((i) => i.type == "childList" && i.removedNodes.length || i.type == "characterData" && i.oldValue.length > i.target.nodeValue.length) ? this.flushSoon() : this.flush();
    }), Fs && (this.onCharData = (t) => {
      this.queue.push({
        target: t.target,
        type: "characterData",
        oldValue: t.prevValue
      }), this.flushSoon();
    }), this.onSelectionChange = this.onSelectionChange.bind(this), this.onResize = this.onResize.bind(this), this.onPrint = this.onPrint.bind(this), this.onScroll = this.onScroll.bind(this), typeof ResizeObserver == "function" && (this.resizeScroll = new ResizeObserver(() => {
      var t;
      ((t = this.view.docView) === null || t === void 0 ? void 0 : t.lastUpdate) < Date.now() - 75 && this.onResize();
    }), this.resizeScroll.observe(e.scrollDOM)), this.addWindowListeners(this.win = e.win), this.start(), typeof IntersectionObserver == "function" && (this.intersection = new IntersectionObserver((t) => {
      this.parentCheck < 0 && (this.parentCheck = setTimeout(this.listenForScroll.bind(this), 1e3)), t.length > 0 && t[t.length - 1].intersectionRatio > 0 != this.intersecting && (this.intersecting = !this.intersecting, this.intersecting != this.view.inView && this.onScrollChanged(document.createEvent("Event")));
    }, { threshold: [0, 1e-3] }), this.intersection.observe(this.dom), this.gapIntersection = new IntersectionObserver((t) => {
      t.length > 0 && t[t.length - 1].intersectionRatio > 0 && this.onScrollChanged(document.createEvent("Event"));
    }, {})), this.listenForScroll(), this.readSelectionRange();
  }
  onScrollChanged(e) {
    this.view.inputState.runHandlers("scroll", e), this.intersecting && this.view.measure();
  }
  onScroll(e) {
    this.intersecting && this.flush(!1), this.onScrollChanged(e);
  }
  onResize() {
    this.resizeTimeout < 0 && (this.resizeTimeout = setTimeout(() => {
      this.resizeTimeout = -1, this.view.requestMeasure();
    }, 50));
  }
  onPrint() {
    this.view.viewState.printing = !0, this.view.measure(), setTimeout(() => {
      this.view.viewState.printing = !1, this.view.requestMeasure();
    }, 500);
  }
  updateGaps(e) {
    if (this.gapIntersection && (e.length != this.gaps.length || this.gaps.some((t, i) => t != e[i]))) {
      this.gapIntersection.disconnect();
      for (let t of e)
        this.gapIntersection.observe(t);
      this.gaps = e;
    }
  }
  onSelectionChange(e) {
    let t = this.selectionChanged;
    if (!this.readSelectionRange() || this.delayedAndroidKey)
      return;
    let { view: i } = this, s = this.selectionRange;
    if (i.state.facet(ws) ? i.root.activeElement != this.dom : !Dn(i.dom, s))
      return;
    let r = s.anchorNode && i.docView.nearest(s.anchorNode);
    if (r && r.ignoreEvent(e)) {
      t || (this.selectionChanged = !1);
      return;
    }
    (R.ie && R.ie_version <= 11 || R.android && R.chrome) && !i.state.selection.main.empty && // (Selection.isCollapsed isn't reliable on IE)
    s.focusNode && Mi(s.focusNode, s.focusOffset, s.anchorNode, s.anchorOffset) ? this.flushSoon() : this.flush(!1);
  }
  readSelectionRange() {
    let { view: e } = this, t = R.safari && e.root.nodeType == 11 && qu(this.dom.ownerDocument) == this.dom && wp(this.view) || Un(e.root);
    if (!t || this.selectionRange.eq(t))
      return !1;
    let i = Dn(this.dom, t);
    return i && !this.selectionChanged && e.inputState.lastFocusTime > Date.now() - 200 && e.inputState.lastTouchTime < Date.now() - 300 && sd(this.dom, t) ? (this.view.inputState.lastFocusTime = 0, e.docView.updateSelection(), !1) : (this.selectionRange.setRange(t), i && (this.selectionChanged = !0), !0);
  }
  setSelectionRange(e, t) {
    this.selectionRange.set(e.node, e.offset, t.node, t.offset), this.selectionChanged = !1;
  }
  clearSelectionRange() {
    this.selectionRange.set(null, 0, null, 0);
  }
  listenForScroll() {
    this.parentCheck = -1;
    let e = 0, t = null;
    for (let i = this.dom; i; )
      if (i.nodeType == 1)
        !t && e < this.scrollTargets.length && this.scrollTargets[e] == i ? e++ : t || (t = this.scrollTargets.slice(0, e)), t && t.push(i), i = i.assignedSlot || i.parentNode;
      else if (i.nodeType == 11)
        i = i.host;
      else
        break;
    if (e < this.scrollTargets.length && !t && (t = this.scrollTargets.slice(0, e)), t) {
      for (let i of this.scrollTargets)
        i.removeEventListener("scroll", this.onScroll);
      for (let i of this.scrollTargets = t)
        i.addEventListener("scroll", this.onScroll);
    }
  }
  ignore(e) {
    if (!this.active)
      return e();
    try {
      return this.stop(), e();
    } finally {
      this.start(), this.clear();
    }
  }
  start() {
    this.active || (this.observer.observe(this.dom, yp), Fs && this.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.active = !0);
  }
  stop() {
    this.active && (this.active = !1, this.observer.disconnect(), Fs && this.dom.removeEventListener("DOMCharacterDataModified", this.onCharData));
  }
  // Throw away any pending changes
  clear() {
    this.processRecords(), this.queue.length = 0, this.selectionChanged = !1;
  }
  // Chrome Android, especially in combination with GBoard, not only
  // doesn't reliably fire regular key events, but also often
  // surrounds the effect of enter or backspace with a bunch of
  // composition events that, when interrupted, cause text duplication
  // or other kinds of corruption. This hack makes the editor back off
  // from handling DOM changes for a moment when such a key is
  // detected (via beforeinput or keydown), and then tries to flush
  // them or, if that has no effect, dispatches the given key.
  delayAndroidKey(e, t) {
    var i;
    if (!this.delayedAndroidKey) {
      let s = () => {
        let r = this.delayedAndroidKey;
        r && (this.clearDelayedAndroidKey(), this.view.inputState.lastKeyCode = r.keyCode, this.view.inputState.lastKeyTime = Date.now(), !this.flush() && r.force && ei(this.dom, r.key, r.keyCode));
      };
      this.flushingAndroidKey = this.view.win.requestAnimationFrame(s);
    }
    (!this.delayedAndroidKey || e == "Enter") && (this.delayedAndroidKey = {
      key: e,
      keyCode: t,
      // Only run the key handler when no changes are detected if
      // this isn't coming right after another change, in which case
      // it is probably part of a weird chain of updates, and should
      // be ignored if it returns the DOM to its previous state.
      force: this.lastChange < Date.now() - 50 || !!(!((i = this.delayedAndroidKey) === null || i === void 0) && i.force)
    });
  }
  clearDelayedAndroidKey() {
    this.win.cancelAnimationFrame(this.flushingAndroidKey), this.delayedAndroidKey = null, this.flushingAndroidKey = -1;
  }
  flushSoon() {
    this.delayedFlush < 0 && (this.delayedFlush = this.view.win.requestAnimationFrame(() => {
      this.delayedFlush = -1, this.flush();
    }));
  }
  forceFlush() {
    this.delayedFlush >= 0 && (this.view.win.cancelAnimationFrame(this.delayedFlush), this.delayedFlush = -1), this.flush();
  }
  pendingRecords() {
    for (let e of this.observer.takeRecords())
      this.queue.push(e);
    return this.queue;
  }
  processRecords() {
    let e = this.pendingRecords();
    e.length && (this.queue = []);
    let t = -1, i = -1, s = !1;
    for (let r of e) {
      let o = this.readMutation(r);
      o && (o.typeOver && (s = !0), t == -1 ? { from: t, to: i } = o : (t = Math.min(o.from, t), i = Math.max(o.to, i)));
    }
    return { from: t, to: i, typeOver: s };
  }
  readChange() {
    let { from: e, to: t, typeOver: i } = this.processRecords(), s = this.selectionChanged && Dn(this.dom, this.selectionRange);
    if (e < 0 && !s)
      return null;
    e > -1 && (this.lastChange = Date.now()), this.view.inputState.lastFocusTime = 0, this.selectionChanged = !1;
    let r = new dp(this.view, e, t, i);
    return this.view.docView.domChanged = { newSel: r.newSel ? r.newSel.main : null }, r;
  }
  // Apply pending changes, if any
  flush(e = !0) {
    if (this.delayedFlush >= 0 || this.delayedAndroidKey)
      return !1;
    e && this.readSelectionRange();
    let t = this.readChange();
    if (!t)
      return this.view.requestMeasure(), !1;
    let i = this.view.state, s = sc(this.view, t);
    return this.view.state == i && this.view.update([]), s;
  }
  readMutation(e) {
    let t = this.view.docView.nearest(e.target);
    if (!t || t.ignoreMutation(e))
      return null;
    if (t.markDirty(e.type == "attributes"), e.type == "attributes" && (t.flags |= 4), e.type == "childList") {
      let i = Nl(t, e.previousSibling || e.target.previousSibling, -1), s = Nl(t, e.nextSibling || e.target.nextSibling, 1);
      return {
        from: i ? t.posAfter(i) : t.posAtStart,
        to: s ? t.posBefore(s) : t.posAtEnd,
        typeOver: !1
      };
    } else
      return e.type == "characterData" ? { from: t.posAtStart, to: t.posAtEnd, typeOver: e.target.nodeValue == e.oldValue } : null;
  }
  setWindow(e) {
    e != this.win && (this.removeWindowListeners(this.win), this.win = e, this.addWindowListeners(this.win));
  }
  addWindowListeners(e) {
    e.addEventListener("resize", this.onResize), e.addEventListener("beforeprint", this.onPrint), e.addEventListener("scroll", this.onScroll), e.document.addEventListener("selectionchange", this.onSelectionChange);
  }
  removeWindowListeners(e) {
    e.removeEventListener("scroll", this.onScroll), e.removeEventListener("resize", this.onResize), e.removeEventListener("beforeprint", this.onPrint), e.document.removeEventListener("selectionchange", this.onSelectionChange);
  }
  destroy() {
    var e, t, i;
    this.stop(), (e = this.intersection) === null || e === void 0 || e.disconnect(), (t = this.gapIntersection) === null || t === void 0 || t.disconnect(), (i = this.resizeScroll) === null || i === void 0 || i.disconnect();
    for (let s of this.scrollTargets)
      s.removeEventListener("scroll", this.onScroll);
    this.removeWindowListeners(this.win), clearTimeout(this.parentCheck), clearTimeout(this.resizeTimeout), this.win.cancelAnimationFrame(this.delayedFlush), this.win.cancelAnimationFrame(this.flushingAndroidKey);
  }
}
function Nl(n, e, t) {
  for (; e; ) {
    let i = Y.get(e);
    if (i && i.parent == n)
      return i;
    let s = e.parentNode;
    e = s != n.dom ? s : t > 0 ? e.nextSibling : e.previousSibling;
  }
  return null;
}
function wp(n) {
  let e = null;
  function t(a) {
    a.preventDefault(), a.stopImmediatePropagation(), e = a.getTargetRanges()[0];
  }
  if (n.contentDOM.addEventListener("beforeinput", t, !0), n.dom.ownerDocument.execCommand("indent"), n.contentDOM.removeEventListener("beforeinput", t, !0), !e)
    return null;
  let i = e.startContainer, s = e.startOffset, r = e.endContainer, o = e.endOffset, l = n.docView.domAtPos(n.state.selection.main.anchor);
  return Mi(l.node, l.offset, r, o) && ([i, s, r, o] = [r, o, i, s]), { anchorNode: i, anchorOffset: s, focusNode: r, focusOffset: o };
}
class Z {
  /**
  The current editor state.
  */
  get state() {
    return this.viewState.state;
  }
  /**
  To be able to display large documents without consuming too much
  memory or overloading the browser, CodeMirror only draws the
  code that is visible (plus a margin around it) to the DOM. This
  property tells you the extent of the current drawn viewport, in
  document positions.
  */
  get viewport() {
    return this.viewState.viewport;
  }
  /**
  When there are, for example, large collapsed ranges in the
  viewport, its size can be a lot bigger than the actual visible
  content. Thus, if you are doing something like styling the
  content in the viewport, it is preferable to only do so for
  these ranges, which are the subset of the viewport that is
  actually drawn.
  */
  get visibleRanges() {
    return this.viewState.visibleRanges;
  }
  /**
  Returns false when the editor is entirely scrolled out of view
  or otherwise hidden.
  */
  get inView() {
    return this.viewState.inView;
  }
  /**
  Indicates whether the user is currently composing text via
  [IME](https://en.wikipedia.org/wiki/Input_method), and at least
  one change has been made in the current composition.
  */
  get composing() {
    return this.inputState.composing > 0;
  }
  /**
  Indicates whether the user is currently in composing state. Note
  that on some platforms, like Android, this will be the case a
  lot, since just putting the cursor on a word starts a
  composition there.
  */
  get compositionStarted() {
    return this.inputState.composing >= 0;
  }
  /**
  The document or shadow root that the view lives in.
  */
  get root() {
    return this._root;
  }
  /**
  @internal
  */
  get win() {
    return this.dom.ownerDocument.defaultView || window;
  }
  /**
  Construct a new view. You'll want to either provide a `parent`
  option, or put `view.dom` into your document after creating a
  view, so that the user can see the editor.
  */
  constructor(e = {}) {
    this.plugins = [], this.pluginMap = /* @__PURE__ */ new Map(), this.editorAttrs = {}, this.contentAttrs = {}, this.bidiCache = [], this.destroyed = !1, this.updateState = 2, this.measureScheduled = -1, this.measureRequests = [], this.contentDOM = document.createElement("div"), this.scrollDOM = document.createElement("div"), this.scrollDOM.tabIndex = -1, this.scrollDOM.className = "cm-scroller", this.scrollDOM.appendChild(this.contentDOM), this.announceDOM = document.createElement("div"), this.announceDOM.className = "cm-announced", this.announceDOM.setAttribute("aria-live", "polite"), this.dom = document.createElement("div"), this.dom.appendChild(this.announceDOM), this.dom.appendChild(this.scrollDOM), e.parent && e.parent.appendChild(this.dom);
    let { dispatch: t } = e;
    this.dispatchTransactions = e.dispatchTransactions || t && ((i) => i.forEach((s) => t(s, this))) || ((i) => this.update(i)), this.dispatch = this.dispatch.bind(this), this._root = e.root || nd(e.parent) || document, this.viewState = new Wl(e.state || G.create(e)), e.scrollTo && e.scrollTo.is(cn) && (this.viewState.scrollTarget = e.scrollTo.value.clip(this.viewState.state)), this.plugins = this.state.facet(wi).map((i) => new Es(i));
    for (let i of this.plugins)
      i.update(this);
    this.observer = new xp(this), this.inputState = new Bd(this), this.inputState.ensureHandlers(this.plugins), this.docView = new yl(this), this.mountStyles(), this.updateAttrs(), this.updateState = 0, this.requestMeasure();
  }
  dispatch(...e) {
    let t = e.length == 1 && e[0] instanceof se ? e : e.length == 1 && Array.isArray(e[0]) ? e[0] : [this.state.update(...e)];
    this.dispatchTransactions(t, this);
  }
  /**
  Update the view for the given array of transactions. This will
  update the visible document and selection to match the state
  produced by the transactions, and notify view plugins of the
  change. You should usually call
  [`dispatch`](https://codemirror.net/6/docs/ref/#view.EditorView.dispatch) instead, which uses this
  as a primitive.
  */
  update(e) {
    if (this.updateState != 0)
      throw new Error("Calls to EditorView.update are not allowed while an update is in progress");
    let t = !1, i = !1, s, r = this.state;
    for (let u of e) {
      if (u.startState != r)
        throw new RangeError("Trying to update state with a transaction that doesn't start from the previous state.");
      r = u.state;
    }
    if (this.destroyed) {
      this.viewState.state = r;
      return;
    }
    let o = this.hasFocus, l = 0, a = null;
    e.some((u) => u.annotation(jh)) ? (this.inputState.notifiedFocused = o, l = 1) : o != this.inputState.notifiedFocused && (this.inputState.notifiedFocused = o, a = qh(r, o), a || (l = 1));
    let h = this.observer.delayedAndroidKey, c = null;
    if (h ? (this.observer.clearDelayedAndroidKey(), c = this.observer.readChange(), (c && !this.state.doc.eq(r.doc) || !this.state.selection.eq(r.selection)) && (c = null)) : this.observer.clear(), r.facet(G.phrases) != this.state.facet(G.phrases))
      return this.setState(r);
    s = $n.create(this, r, e), s.flags |= l;
    let f = this.viewState.scrollTarget;
    try {
      this.updateState = 2;
      for (let u of e) {
        if (f && (f = f.map(u.changes)), u.scrollIntoView) {
          let { main: d } = u.state.selection;
          f = new ti(d.empty ? d : y.cursor(d.head, d.head > d.anchor ? -1 : 1));
        }
        for (let d of u.effects)
          d.is(cn) && (f = d.value.clip(this.state));
      }
      this.viewState.update(s, f), this.bidiCache = jn.update(this.bidiCache, s.changes), s.empty || (this.updatePlugins(s), this.inputState.update(s)), t = this.docView.update(s), this.state.facet(ki) != this.styleModules && this.mountStyles(), i = this.updateAttrs(), this.showAnnouncements(e), this.docView.updateSelection(t, e.some((u) => u.isUserEvent("select.pointer")));
    } finally {
      this.updateState = 0;
    }
    if (s.startState.facet(gn) != s.state.facet(gn) && (this.viewState.mustMeasureContent = !0), (t || i || f || this.viewState.mustEnforceCursorAssoc || this.viewState.mustMeasureContent) && this.requestMeasure(), !s.empty)
      for (let u of this.state.facet(Pr))
        try {
          u(s);
        } catch (d) {
          Pe(this.state, d, "update listener");
        }
    (a || c) && Promise.resolve().then(() => {
      a && this.state == a.startState && this.dispatch(a), c && !sc(this, c) && h.force && ei(this.contentDOM, h.key, h.keyCode);
    });
  }
  /**
  Reset the view to the given state. (This will cause the entire
  document to be redrawn and all view plugins to be reinitialized,
  so you should probably only use it when the new state isn't
  derived from the old state. Otherwise, use
  [`dispatch`](https://codemirror.net/6/docs/ref/#view.EditorView.dispatch) instead.)
  */
  setState(e) {
    if (this.updateState != 0)
      throw new Error("Calls to EditorView.setState are not allowed while an update is in progress");
    if (this.destroyed) {
      this.viewState.state = e;
      return;
    }
    this.updateState = 2;
    let t = this.hasFocus;
    try {
      for (let i of this.plugins)
        i.destroy(this);
      this.viewState = new Wl(e), this.plugins = e.facet(wi).map((i) => new Es(i)), this.pluginMap.clear();
      for (let i of this.plugins)
        i.update(this);
      this.docView.destroy(), this.docView = new yl(this), this.inputState.ensureHandlers(this.plugins), this.mountStyles(), this.updateAttrs(), this.bidiCache = [];
    } finally {
      this.updateState = 0;
    }
    t && this.focus(), this.requestMeasure();
  }
  updatePlugins(e) {
    let t = e.startState.facet(wi), i = e.state.facet(wi);
    if (t != i) {
      let s = [];
      for (let r of i) {
        let o = t.indexOf(r);
        if (o < 0)
          s.push(new Es(r));
        else {
          let l = this.plugins[o];
          l.mustUpdate = e, s.push(l);
        }
      }
      for (let r of this.plugins)
        r.mustUpdate != e && r.destroy(this);
      this.plugins = s, this.pluginMap.clear();
    } else
      for (let s of this.plugins)
        s.mustUpdate = e;
    for (let s = 0; s < this.plugins.length; s++)
      this.plugins[s].update(this);
    t != i && this.inputState.ensureHandlers(this.plugins);
  }
  /**
  @internal
  */
  measure(e = !0) {
    if (this.destroyed)
      return;
    if (this.measureScheduled > -1 && this.win.cancelAnimationFrame(this.measureScheduled), this.observer.delayedAndroidKey) {
      this.measureScheduled = -1, this.requestMeasure();
      return;
    }
    this.measureScheduled = 0, e && this.observer.forceFlush();
    let t = null, i = this.scrollDOM, s = i.scrollTop * this.scaleY, { scrollAnchorPos: r, scrollAnchorHeight: o } = this.viewState;
    Math.abs(s - this.viewState.scrollTop) > 1 && (o = -1), this.viewState.scrollAnchorHeight = -1;
    try {
      for (let l = 0; ; l++) {
        if (o < 0)
          if (ph(i))
            r = -1, o = this.viewState.heightMap.height;
          else {
            let d = this.viewState.scrollAnchorAt(s);
            r = d.from, o = d.top;
          }
        this.updateState = 1;
        let a = this.viewState.measure(this);
        if (!a && !this.measureRequests.length && this.viewState.scrollTarget == null)
          break;
        if (l > 5) {
          console.warn(this.measureRequests.length ? "Measure loop restarted more than 5 times" : "Viewport failed to stabilize");
          break;
        }
        let h = [];
        a & 4 || ([this.measureRequests, h] = [h, this.measureRequests]);
        let c = h.map((d) => {
          try {
            return d.read(this);
          } catch (p) {
            return Pe(this.state, p), Gl;
          }
        }), f = $n.create(this, this.state, []), u = !1;
        f.flags |= a, t ? t.flags |= a : t = f, this.updateState = 2, f.empty || (this.updatePlugins(f), this.inputState.update(f), this.updateAttrs(), u = this.docView.update(f));
        for (let d = 0; d < h.length; d++)
          if (c[d] != Gl)
            try {
              let p = h[d];
              p.write && p.write(c[d], this);
            } catch (p) {
              Pe(this.state, p);
            }
        if (u && this.docView.updateSelection(!0), !f.viewportChanged && this.measureRequests.length == 0) {
          if (this.viewState.editorHeight)
            if (this.viewState.scrollTarget) {
              this.docView.scrollIntoView(this.viewState.scrollTarget), this.viewState.scrollTarget = null, o = -1;
              continue;
            } else {
              let p = (r < 0 ? this.viewState.heightMap.height : this.viewState.lineBlockAt(r).top) - o;
              if (p > 1 || p < -1) {
                s = s + p, i.scrollTop = s / this.scaleY, o = -1;
                continue;
              }
            }
          break;
        }
      }
    } finally {
      this.updateState = 0, this.measureScheduled = -1;
    }
    if (t && !t.empty)
      for (let l of this.state.facet(Pr))
        l(t);
  }
  /**
  Get the CSS classes for the currently active editor themes.
  */
  get themeClasses() {
    return Ir + " " + (this.state.facet(Xr) ? ic : tc) + " " + this.state.facet(gn);
  }
  updateAttrs() {
    let e = Hl(this, Xh, {
      class: "cm-editor" + (this.hasFocus ? " cm-focused " : " ") + this.themeClasses
    }), t = {
      spellcheck: "false",
      autocorrect: "off",
      autocapitalize: "off",
      translate: "no",
      contenteditable: this.state.facet(ws) ? "true" : "false",
      class: "cm-content",
      style: `${R.tabSize}: ${this.state.tabSize}`,
      role: "textbox",
      "aria-multiline": "true"
    };
    this.state.readOnly && (t["aria-readonly"] = "true"), Hl(this, go, t);
    let i = this.observer.ignore(() => {
      let s = Rr(this.contentDOM, this.contentAttrs, t), r = Rr(this.dom, this.editorAttrs, e);
      return s || r;
    });
    return this.editorAttrs = e, this.contentAttrs = t, i;
  }
  showAnnouncements(e) {
    let t = !0;
    for (let i of e)
      for (let s of i.effects)
        if (s.is(Z.announce)) {
          t && (this.announceDOM.textContent = ""), t = !1;
          let r = this.announceDOM.appendChild(document.createElement("div"));
          r.textContent = s.value;
        }
  }
  mountStyles() {
    this.styleModules = this.state.facet(ki);
    let e = this.state.facet(Z.cspNonce);
    St.mount(this.root, this.styleModules.concat(cp).reverse(), e ? { nonce: e } : void 0);
  }
  readMeasured() {
    if (this.updateState == 2)
      throw new Error("Reading the editor layout isn't allowed during an update");
    this.updateState == 0 && this.measureScheduled > -1 && this.measure(!1);
  }
  /**
  Schedule a layout measurement, optionally providing callbacks to
  do custom DOM measuring followed by a DOM write phase. Using
  this is preferable reading DOM layout directly from, for
  example, an event handler, because it'll make sure measuring and
  drawing done by other components is synchronized, avoiding
  unnecessary DOM layout computations.
  */
  requestMeasure(e) {
    if (this.measureScheduled < 0 && (this.measureScheduled = this.win.requestAnimationFrame(() => this.measure())), e) {
      if (this.measureRequests.indexOf(e) > -1)
        return;
      if (e.key != null) {
        for (let t = 0; t < this.measureRequests.length; t++)
          if (this.measureRequests[t].key === e.key) {
            this.measureRequests[t] = e;
            return;
          }
      }
      this.measureRequests.push(e);
    }
  }
  /**
  Get the value of a specific plugin, if present. Note that
  plugins that crash can be dropped from a view, so even when you
  know you registered a given plugin, it is recommended to check
  the return value of this method.
  */
  plugin(e) {
    let t = this.pluginMap.get(e);
    return (t === void 0 || t && t.spec != e) && this.pluginMap.set(e, t = this.plugins.find((i) => i.spec == e) || null), t && t.update(this).value;
  }
  /**
  The top position of the document, in screen coordinates. This
  may be negative when the editor is scrolled down. Points
  directly to the top of the first line, not above the padding.
  */
  get documentTop() {
    return this.contentDOM.getBoundingClientRect().top + this.viewState.paddingTop;
  }
  /**
  Reports the padding above and below the document.
  */
  get documentPadding() {
    return { top: this.viewState.paddingTop, bottom: this.viewState.paddingBottom };
  }
  /**
  If the editor is transformed with CSS, this provides the scale
  along the X axis. Otherwise, it will just be 1. Note that
  transforms other than translation and scaling are not supported.
  */
  get scaleX() {
    return this.viewState.scaleX;
  }
  /**
  Provide the CSS transformed scale along the Y axis.
  */
  get scaleY() {
    return this.viewState.scaleY;
  }
  /**
  Find the text line or block widget at the given vertical
  position (which is interpreted as relative to the [top of the
  document](https://codemirror.net/6/docs/ref/#view.EditorView.documentTop)).
  */
  elementAtHeight(e) {
    return this.readMeasured(), this.viewState.elementAtHeight(e);
  }
  /**
  Find the line block (see
  [`lineBlockAt`](https://codemirror.net/6/docs/ref/#view.EditorView.lineBlockAt) at the given
  height, again interpreted relative to the [top of the
  document](https://codemirror.net/6/docs/ref/#view.EditorView.documentTop).
  */
  lineBlockAtHeight(e) {
    return this.readMeasured(), this.viewState.lineBlockAtHeight(e);
  }
  /**
  Get the extent and vertical position of all [line
  blocks](https://codemirror.net/6/docs/ref/#view.EditorView.lineBlockAt) in the viewport. Positions
  are relative to the [top of the
  document](https://codemirror.net/6/docs/ref/#view.EditorView.documentTop);
  */
  get viewportLineBlocks() {
    return this.viewState.viewportLines;
  }
  /**
  Find the line block around the given document position. A line
  block is a range delimited on both sides by either a
  non-[hidden](https://codemirror.net/6/docs/ref/#view.Decoration^replace) line breaks, or the
  start/end of the document. It will usually just hold a line of
  text, but may be broken into multiple textblocks by block
  widgets.
  */
  lineBlockAt(e) {
    return this.viewState.lineBlockAt(e);
  }
  /**
  The editor's total content height.
  */
  get contentHeight() {
    return this.viewState.contentHeight;
  }
  /**
  Move a cursor position by [grapheme
  cluster](https://codemirror.net/6/docs/ref/#state.findClusterBreak). `forward` determines whether
  the motion is away from the line start, or towards it. In
  bidirectional text, the line is traversed in visual order, using
  the editor's [text direction](https://codemirror.net/6/docs/ref/#view.EditorView.textDirection).
  When the start position was the last one on the line, the
  returned position will be across the line break. If there is no
  further line, the original position is returned.
  
  By default, this method moves over a single cluster. The
  optional `by` argument can be used to move across more. It will
  be called with the first cluster as argument, and should return
  a predicate that determines, for each subsequent cluster,
  whether it should also be moved over.
  */
  moveByChar(e, t, i) {
    return Gs(this, e, Cl(this, e, t, i));
  }
  /**
  Move a cursor position across the next group of either
  [letters](https://codemirror.net/6/docs/ref/#state.EditorState.charCategorizer) or non-letter
  non-whitespace characters.
  */
  moveByGroup(e, t) {
    return Gs(this, e, Cl(this, e, t, (i) => Pd(this, e.head, i)));
  }
  /**
  Get the cursor position visually at the start or end of a line.
  Note that this may differ from the _logical_ position at its
  start or end (which is simply at `line.from`/`line.to`) if text
  at the start or end goes against the line's base text direction.
  */
  visualLineSide(e, t) {
    let i = this.bidiSpans(e), s = this.textDirectionAt(e.from), r = i[t ? i.length - 1 : 0];
    return y.cursor(r.side(t, s) + e.from, r.forward(!t, s) ? 1 : -1);
  }
  /**
  Move to the next line boundary in the given direction. If
  `includeWrap` is true, line wrapping is on, and there is a
  further wrap point on the current line, the wrap point will be
  returned. Otherwise this function will return the start or end
  of the line.
  */
  moveToLineBoundary(e, t, i = !0) {
    return Dd(this, e, t, i);
  }
  /**
  Move a cursor position vertically. When `distance` isn't given,
  it defaults to moving to the next line (including wrapped
  lines). Otherwise, `distance` should provide a positive distance
  in pixels.
  
  When `start` has a
  [`goalColumn`](https://codemirror.net/6/docs/ref/#state.SelectionRange.goalColumn), the vertical
  motion will use that as a target horizontal position. Otherwise,
  the cursor's own horizontal position is used. The returned
  cursor will have its goal column set to whichever column was
  used.
  */
  moveVertically(e, t, i) {
    return Gs(this, e, Vd(this, e, t, i));
  }
  /**
  Find the DOM parent node and offset (child offset if `node` is
  an element, character offset when it is a text node) at the
  given document position.
  
  Note that for positions that aren't currently in
  `visibleRanges`, the resulting DOM position isn't necessarily
  meaningful (it may just point before or after a placeholder
  element).
  */
  domAtPos(e) {
    return this.docView.domAtPos(e);
  }
  /**
  Find the document position at the given DOM node. Can be useful
  for associating positions with DOM events. Will raise an error
  when `node` isn't part of the editor content.
  */
  posAtDOM(e, t = 0) {
    return this.docView.posFromDOM(e, t);
  }
  posAtCoords(e, t = !0) {
    return this.readMeasured(), zh(this, e, t);
  }
  /**
  Get the screen coordinates at the given document position.
  `side` determines whether the coordinates are based on the
  element before (-1) or after (1) the position (if no element is
  available on the given side, the method will transparently use
  another strategy to get reasonable coordinates).
  */
  coordsAtPos(e, t = 1) {
    this.readMeasured();
    let i = this.docView.coordsAt(e, t);
    if (!i || i.left == i.right)
      return i;
    let s = this.state.doc.lineAt(e), r = this.bidiSpans(s), o = r[gt.find(r, e - s.from, -1, t)];
    return fo(i, o.dir == J.LTR == t > 0);
  }
  /**
  Return the rectangle around a given character. If `pos` does not
  point in front of a character that is in the viewport and
  rendered (i.e. not replaced, not a line break), this will return
  null. For space characters that are a line wrap point, this will
  return the position before the line break.
  */
  coordsForChar(e) {
    return this.readMeasured(), this.docView.coordsForChar(e);
  }
  /**
  The default width of a character in the editor. May not
  accurately reflect the width of all characters (given variable
  width fonts or styling of invididual ranges).
  */
  get defaultCharacterWidth() {
    return this.viewState.heightOracle.charWidth;
  }
  /**
  The default height of a line in the editor. May not be accurate
  for all lines.
  */
  get defaultLineHeight() {
    return this.viewState.heightOracle.lineHeight;
  }
  /**
  The text direction
  ([`direction`](https://developer.mozilla.org/en-US/docs/Web/CSS/direction)
  CSS property) of the editor's content element.
  */
  get textDirection() {
    return this.viewState.defaultTextDirection;
  }
  /**
  Find the text direction of the block at the given position, as
  assigned by CSS. If
  [`perLineTextDirection`](https://codemirror.net/6/docs/ref/#view.EditorView^perLineTextDirection)
  isn't enabled, or the given position is outside of the viewport,
  this will always return the same as
  [`textDirection`](https://codemirror.net/6/docs/ref/#view.EditorView.textDirection). Note that
  this may trigger a DOM layout.
  */
  textDirectionAt(e) {
    return !this.state.facet(Bh) || e < this.viewport.from || e > this.viewport.to ? this.textDirection : (this.readMeasured(), this.docView.textDirectionAt(e));
  }
  /**
  Whether this editor [wraps lines](https://codemirror.net/6/docs/ref/#view.EditorView.lineWrapping)
  (as determined by the
  [`white-space`](https://developer.mozilla.org/en-US/docs/Web/CSS/white-space)
  CSS property of its content element).
  */
  get lineWrapping() {
    return this.viewState.heightOracle.lineWrapping;
  }
  /**
  Returns the bidirectional text structure of the given line
  (which should be in the current document) as an array of span
  objects. The order of these spans matches the [text
  direction](https://codemirror.net/6/docs/ref/#view.EditorView.textDirection)—if that is
  left-to-right, the leftmost spans come first, otherwise the
  rightmost spans come first.
  */
  bidiSpans(e) {
    if (e.length > kp)
      return Mh(e.length);
    let t = this.textDirectionAt(e.from), i;
    for (let r of this.bidiCache)
      if (r.from == e.from && r.dir == t && (r.fresh || Ah(r.isolates, i = bl(this, e))))
        return r.order;
    i || (i = bl(this, e));
    let s = gd(e.text, t, i);
    return this.bidiCache.push(new jn(e.from, e.to, t, i, !0, s)), s;
  }
  /**
  Check whether the editor has focus.
  */
  get hasFocus() {
    var e;
    return (this.dom.ownerDocument.hasFocus() || R.safari && ((e = this.inputState) === null || e === void 0 ? void 0 : e.lastContextMenu) > Date.now() - 3e4) && this.root.activeElement == this.contentDOM;
  }
  /**
  Put focus on the editor.
  */
  focus() {
    this.observer.ignore(() => {
      uh(this.contentDOM), this.docView.updateSelection();
    });
  }
  /**
  Update the [root](https://codemirror.net/6/docs/ref/##view.EditorViewConfig.root) in which the editor lives. This is only
  necessary when moving the editor's existing DOM to a new window or shadow root.
  */
  setRoot(e) {
    this._root != e && (this._root = e, this.observer.setWindow((e.nodeType == 9 ? e : e.ownerDocument).defaultView || window), this.mountStyles());
  }
  /**
  Clean up this editor view, removing its element from the
  document, unregistering event handlers, and notifying
  plugins. The view instance can no longer be used after
  calling this.
  */
  destroy() {
    for (let e of this.plugins)
      e.destroy(this);
    this.plugins = [], this.inputState.destroy(), this.docView.destroy(), this.dom.remove(), this.observer.destroy(), this.measureScheduled > -1 && this.win.cancelAnimationFrame(this.measureScheduled), this.destroyed = !0;
  }
  /**
  Returns an effect that can be
  [added](https://codemirror.net/6/docs/ref/#state.TransactionSpec.effects) to a transaction to
  cause it to scroll the given position or range into view.
  */
  static scrollIntoView(e, t = {}) {
    return cn.of(new ti(typeof e == "number" ? y.cursor(e) : e, t.y, t.x, t.yMargin, t.xMargin));
  }
  /**
  Return an effect that resets the editor to its current (at the
  time this method was called) scroll position. Note that this
  only affects the editor's own scrollable element, not parents.
  See also
  [`EditorViewConfig.scrollTo`](https://codemirror.net/6/docs/ref/#view.EditorViewConfig.scrollTo).
  
  The effect should be used with a document identical to the one
  it was created for. Failing to do so is not an error, but may
  not scroll to the expected position. You can
  [map](https://codemirror.net/6/docs/ref/#state.StateEffect.map) the effect to account for changes.
  */
  scrollSnapshot() {
    let { scrollTop: e, scrollLeft: t } = this.scrollDOM, i = this.viewState.scrollAnchorAt(e);
    return cn.of(new ti(y.cursor(i.from), "start", "start", i.top - e, t, !0));
  }
  /**
  Returns an extension that can be used to add DOM event handlers.
  The value should be an object mapping event names to handler
  functions. For any given event, such functions are ordered by
  extension precedence, and the first handler to return true will
  be assumed to have handled that event, and no other handlers or
  built-in behavior will be activated for it. These are registered
  on the [content element](https://codemirror.net/6/docs/ref/#view.EditorView.contentDOM), except
  for `scroll` handlers, which will be called any time the
  editor's [scroll element](https://codemirror.net/6/docs/ref/#view.EditorView.scrollDOM) or one of
  its parent nodes is scrolled.
  */
  static domEventHandlers(e) {
    return _.define(() => ({}), { eventHandlers: e });
  }
  /**
  Create an extension that registers DOM event observers. Contrary
  to event [handlers](https://codemirror.net/6/docs/ref/#view.EditorView^domEventHandlers),
  observers can't be prevented from running by a higher-precedence
  handler returning true. They also don't prevent other handlers
  and observers from running when they return true, and should not
  call `preventDefault`.
  */
  static domEventObservers(e) {
    return _.define(() => ({}), { eventObservers: e });
  }
  /**
  Create a theme extension. The first argument can be a
  [`style-mod`](https://github.com/marijnh/style-mod#documentation)
  style spec providing the styles for the theme. These will be
  prefixed with a generated class for the style.
  
  Because the selectors will be prefixed with a scope class, rule
  that directly match the editor's [wrapper
  element](https://codemirror.net/6/docs/ref/#view.EditorView.dom)—to which the scope class will be
  added—need to be explicitly differentiated by adding an `&` to
  the selector for that element—for example
  `&.cm-focused`.
  
  When `dark` is set to true, the theme will be marked as dark,
  which will cause the `&dark` rules from [base
  themes](https://codemirror.net/6/docs/ref/#view.EditorView^baseTheme) to be used (as opposed to
  `&light` when a light theme is active).
  */
  static theme(e, t) {
    let i = St.newName(), s = [gn.of(i), ki.of(Er(`.${i}`, e))];
    return t && t.dark && s.push(Xr.of(!0)), s;
  }
  /**
  Create an extension that adds styles to the base theme. Like
  with [`theme`](https://codemirror.net/6/docs/ref/#view.EditorView^theme), use `&` to indicate the
  place of the editor wrapper element when directly targeting
  that. You can also use `&dark` or `&light` instead to only
  target editors with a dark or light theme.
  */
  static baseTheme(e) {
    return Gt.lowest(ki.of(Er("." + Ir, e, nc)));
  }
  /**
  Retrieve an editor view instance from the view's DOM
  representation.
  */
  static findFromDOM(e) {
    var t;
    let i = e.querySelector(".cm-content"), s = i && Y.get(i) || Y.get(e);
    return ((t = s == null ? void 0 : s.rootView) === null || t === void 0 ? void 0 : t.view) || null;
  }
}
Z.styleModule = ki;
Z.inputHandler = Ph;
Z.focusChangeEffect = Vh;
Z.perLineTextDirection = Bh;
Z.exceptionSink = Dh;
Z.updateListener = Pr;
Z.editable = ws;
Z.mouseSelectionStyle = Th;
Z.dragMovesSelection = Lh;
Z.clickAddsSelectionRange = Zh;
Z.decorations = Xi;
Z.outerDecorations = Ih;
Z.atomicRanges = bo;
Z.bidiIsolatedRanges = Eh;
Z.scrollMargins = Nh;
Z.darkTheme = Xr;
Z.cspNonce = /* @__PURE__ */ M.define({ combine: (n) => n.length ? n[0] : "" });
Z.contentAttributes = go;
Z.editorAttributes = Xh;
Z.lineWrapping = /* @__PURE__ */ Z.contentAttributes.of({ class: "cm-lineWrapping" });
Z.announce = /* @__PURE__ */ L.define();
const kp = 4096, Gl = {};
class jn {
  constructor(e, t, i, s, r, o) {
    this.from = e, this.to = t, this.dir = i, this.isolates = s, this.fresh = r, this.order = o;
  }
  static update(e, t) {
    if (t.empty && !e.some((r) => r.fresh))
      return e;
    let i = [], s = e.length ? e[e.length - 1].dir : J.LTR;
    for (let r = Math.max(0, e.length - 10); r < e.length; r++) {
      let o = e[r];
      o.dir == s && !t.touchesRange(o.from, o.to) && i.push(new jn(t.mapPos(o.from, 1), t.mapPos(o.to, -1), o.dir, o.isolates, !1, o.order));
    }
    return i;
  }
}
function Hl(n, e, t) {
  for (let i = n.state.facet(e), s = i.length - 1; s >= 0; s--) {
    let r = i[s], o = typeof r == "function" ? r(n) : r;
    o && Mr(o, t);
  }
  return t;
}
const Sp = R.mac ? "mac" : R.windows ? "win" : R.linux ? "linux" : "key";
function vp(n, e) {
  const t = n.split(/-(?!$)/);
  let i = t[t.length - 1];
  i == "Space" && (i = " ");
  let s, r, o, l;
  for (let a = 0; a < t.length - 1; ++a) {
    const h = t[a];
    if (/^(cmd|meta|m)$/i.test(h))
      l = !0;
    else if (/^a(lt)?$/i.test(h))
      s = !0;
    else if (/^(c|ctrl|control)$/i.test(h))
      r = !0;
    else if (/^s(hift)?$/i.test(h))
      o = !0;
    else if (/^mod$/i.test(h))
      e == "mac" ? l = !0 : r = !0;
    else
      throw new Error("Unrecognized modifier name: " + h);
  }
  return s && (i = "Alt-" + i), r && (i = "Ctrl-" + i), l && (i = "Meta-" + i), o && (i = "Shift-" + i), i;
}
function bn(n, e, t) {
  return e.altKey && (n = "Alt-" + n), e.ctrlKey && (n = "Ctrl-" + n), e.metaKey && (n = "Meta-" + n), t !== !1 && e.shiftKey && (n = "Shift-" + n), n;
}
const Cp = /* @__PURE__ */ Gt.default(/* @__PURE__ */ Z.domEventHandlers({
  keydown(n, e) {
    return oc(rc(e.state), n, e, "editor");
  }
})), xo = /* @__PURE__ */ M.define({ enables: Cp }), Fl = /* @__PURE__ */ new WeakMap();
function rc(n) {
  let e = n.facet(xo), t = Fl.get(e);
  return t || Fl.set(e, t = Mp(e.reduce((i, s) => i.concat(s), []))), t;
}
function Op(n, e, t) {
  return oc(rc(n.state), e, n, t);
}
let ut = null;
const Ap = 4e3;
function Mp(n, e = Sp) {
  let t = /* @__PURE__ */ Object.create(null), i = /* @__PURE__ */ Object.create(null), s = (o, l) => {
    let a = i[o];
    if (a == null)
      i[o] = l;
    else if (a != l)
      throw new Error("Key binding " + o + " is used both as a regular binding and as a multi-stroke prefix");
  }, r = (o, l, a, h, c) => {
    var f, u;
    let d = t[o] || (t[o] = /* @__PURE__ */ Object.create(null)), p = l.split(/ (?!$)/).map((b) => vp(b, e));
    for (let b = 1; b < p.length; b++) {
      let k = p.slice(0, b).join(" ");
      s(k, !0), d[k] || (d[k] = {
        preventDefault: !0,
        stopPropagation: !1,
        run: [(C) => {
          let S = ut = { view: C, prefix: k, scope: o };
          return setTimeout(() => {
            ut == S && (ut = null);
          }, Ap), !0;
        }]
      });
    }
    let g = p.join(" ");
    s(g, !1);
    let m = d[g] || (d[g] = {
      preventDefault: !1,
      stopPropagation: !1,
      run: ((u = (f = d._any) === null || f === void 0 ? void 0 : f.run) === null || u === void 0 ? void 0 : u.slice()) || []
    });
    a && m.run.push(a), h && (m.preventDefault = !0), c && (m.stopPropagation = !0);
  };
  for (let o of n) {
    let l = o.scope ? o.scope.split(" ") : ["editor"];
    if (o.any)
      for (let h of l) {
        let c = t[h] || (t[h] = /* @__PURE__ */ Object.create(null));
        c._any || (c._any = { preventDefault: !1, stopPropagation: !1, run: [] });
        for (let f in c)
          c[f].run.push(o.any);
      }
    let a = o[e] || o.key;
    if (a)
      for (let h of l)
        r(h, a, o.run, o.preventDefault, o.stopPropagation), o.shift && r(h, "Shift-" + a, o.shift, o.preventDefault, o.stopPropagation);
  }
  return t;
}
function oc(n, e, t, i) {
  let s = ju(e), r = le(s, 0), o = We(r) == s.length && s != " ", l = "", a = !1, h = !1, c = !1;
  ut && ut.view == t && ut.scope == i && (l = ut.prefix + " ", Yh.indexOf(e.keyCode) < 0 && (h = !0, ut = null));
  let f = /* @__PURE__ */ new Set(), u = (m) => {
    if (m) {
      for (let b of m.run)
        if (!f.has(b) && (f.add(b), b(t, e)))
          return m.stopPropagation && (c = !0), !0;
      m.preventDefault && (m.stopPropagation && (c = !0), h = !0);
    }
    return !1;
  }, d = n[i], p, g;
  return d && (u(d[l + bn(s, e, !o)]) ? a = !0 : o && (e.altKey || e.metaKey || e.ctrlKey) && // Ctrl-Alt may be used for AltGr on Windows
  !(R.windows && e.ctrlKey && e.altKey) && (p = vt[e.keyCode]) && p != s ? (u(d[l + bn(p, e, !0)]) || e.shiftKey && (g = Vi[e.keyCode]) != s && g != p && u(d[l + bn(g, e, !1)])) && (a = !0) : o && e.shiftKey && u(d[l + bn(s, e, !0)]) && (a = !0), !a && u(d._any) && (a = !0)), h && (a = !0), a && c && e.stopPropagation(), a;
}
class $i {
  /**
  Create a marker with the given class and dimensions. If `width`
  is null, the DOM element will get no width style.
  */
  constructor(e, t, i, s, r) {
    this.className = e, this.left = t, this.top = i, this.width = s, this.height = r;
  }
  draw() {
    let e = document.createElement("div");
    return e.className = this.className, this.adjust(e), e;
  }
  update(e, t) {
    return t.className != this.className ? !1 : (this.adjust(e), !0);
  }
  adjust(e) {
    e.style.left = this.left + "px", e.style.top = this.top + "px", this.width != null && (e.style.width = this.width + "px"), e.style.height = this.height + "px";
  }
  eq(e) {
    return this.left == e.left && this.top == e.top && this.width == e.width && this.height == e.height && this.className == e.className;
  }
  /**
  Create a set of rectangles for the given selection range,
  assigning them theclass`className`. Will create a single
  rectangle for empty ranges, and a set of selection-style
  rectangles covering the range's content (in a bidi-aware
  way) for non-empty ones.
  */
  static forRange(e, t, i) {
    if (i.empty) {
      let s = e.coordsAtPos(i.head, i.assoc || 1);
      if (!s)
        return [];
      let r = lc(e);
      return [new $i(t, s.left - r.left, s.top - r.top, null, s.bottom - s.top)];
    } else
      return Rp(e, t, i);
  }
}
function lc(n) {
  let e = n.scrollDOM.getBoundingClientRect();
  return { left: (n.textDirection == J.LTR ? e.left : e.right - n.scrollDOM.clientWidth * n.scaleX) - n.scrollDOM.scrollLeft * n.scaleX, top: e.top - n.scrollDOM.scrollTop * n.scaleY };
}
function zl(n, e, t) {
  let i = y.cursor(e);
  return {
    from: Math.max(t.from, n.moveToLineBoundary(i, !1, !0).from),
    to: Math.min(t.to, n.moveToLineBoundary(i, !0, !0).from),
    type: ye.Text
  };
}
function Rp(n, e, t) {
  if (t.to <= n.viewport.from || t.from >= n.viewport.to)
    return [];
  let i = Math.max(t.from, n.viewport.from), s = Math.min(t.to, n.viewport.to), r = n.textDirection == J.LTR, o = n.contentDOM, l = o.getBoundingClientRect(), a = lc(n), h = o.querySelector(".cm-line"), c = h && window.getComputedStyle(h), f = l.left + (c ? parseInt(c.paddingLeft) + Math.min(0, parseInt(c.textIndent)) : 0), u = l.right - (c ? parseInt(c.paddingRight) : 0), d = Br(n, i), p = Br(n, s), g = d.type == ye.Text ? d : null, m = p.type == ye.Text ? p : null;
  if (g && (n.lineWrapping || d.widgetLineBreaks) && (g = zl(n, i, g)), m && (n.lineWrapping || p.widgetLineBreaks) && (m = zl(n, s, m)), g && m && g.from == m.from)
    return k(C(t.from, t.to, g));
  {
    let w = g ? C(t.from, null, g) : S(d, !1), A = m ? C(null, t.to, m) : S(p, !0), O = [];
    return (g || d).to < (m || p).from - (g && m ? 1 : 0) || d.widgetLineBreaks > 1 && w.bottom + n.defaultLineHeight / 2 < A.top ? O.push(b(f, w.bottom, u, A.top)) : w.bottom < A.top && n.elementAtHeight((w.bottom + A.top) / 2).type == ye.Text && (w.bottom = A.top = (w.bottom + A.top) / 2), k(w).concat(O).concat(k(A));
  }
  function b(w, A, O, D) {
    return new $i(
      e,
      w - a.left,
      A - a.top - 0.01,
      O - w,
      D - A + 0.01
      /* C.Epsilon */
    );
  }
  function k({ top: w, bottom: A, horizontal: O }) {
    let D = [];
    for (let W = 0; W < O.length; W += 2)
      D.push(b(O[W], w, O[W + 1], A));
    return D;
  }
  function C(w, A, O) {
    let D = 1e9, W = -1e9, X = [];
    function B(N, Q, we, ke, Me) {
      let Ve = n.coordsAtPos(N, N == O.to ? -2 : 2), te = n.coordsAtPos(we, we == O.from ? 2 : -2);
      !Ve || !te || (D = Math.min(Ve.top, te.top, D), W = Math.max(Ve.bottom, te.bottom, W), Me == J.LTR ? X.push(r && Q ? f : Ve.left, r && ke ? u : te.right) : X.push(!r && ke ? f : te.left, !r && Q ? u : Ve.right));
    }
    let P = w ?? O.from, H = A ?? O.to;
    for (let N of n.visibleRanges)
      if (N.to > P && N.from < H)
        for (let Q = Math.max(N.from, P), we = Math.min(N.to, H); ; ) {
          let ke = n.state.doc.lineAt(Q);
          for (let Me of n.bidiSpans(ke)) {
            let Ve = Me.from + ke.from, te = Me.to + ke.from;
            if (Ve >= we)
              break;
            te > Q && B(Math.max(Ve, Q), w == null && Ve <= P, Math.min(te, we), A == null && te >= H, Me.dir);
          }
          if (Q = ke.to + 1, Q >= we)
            break;
        }
    return X.length == 0 && B(P, w == null, H, A == null, n.textDirection), { top: D, bottom: W, horizontal: X };
  }
  function S(w, A) {
    let O = l.top + (A ? w.top : w.bottom);
    return { top: O, bottom: O, horizontal: [] };
  }
}
function Zp(n, e) {
  return n.constructor == e.constructor && n.eq(e);
}
class Lp {
  constructor(e, t) {
    this.view = e, this.layer = t, this.drawn = [], this.scaleX = 1, this.scaleY = 1, this.measureReq = { read: this.measure.bind(this), write: this.draw.bind(this) }, this.dom = e.scrollDOM.appendChild(document.createElement("div")), this.dom.classList.add("cm-layer"), t.above && this.dom.classList.add("cm-layer-above"), t.class && this.dom.classList.add(t.class), this.scale(), this.dom.setAttribute("aria-hidden", "true"), this.setOrder(e.state), e.requestMeasure(this.measureReq), t.mount && t.mount(this.dom, e);
  }
  update(e) {
    e.startState.facet(Bn) != e.state.facet(Bn) && this.setOrder(e.state), (this.layer.update(e, this.dom) || e.geometryChanged) && (this.scale(), e.view.requestMeasure(this.measureReq));
  }
  setOrder(e) {
    let t = 0, i = e.facet(Bn);
    for (; t < i.length && i[t] != this.layer; )
      t++;
    this.dom.style.zIndex = String((this.layer.above ? 150 : -1) - t);
  }
  measure() {
    return this.layer.markers(this.view);
  }
  scale() {
    let { scaleX: e, scaleY: t } = this.view;
    (e != this.scaleX || t != this.scaleY) && (this.scaleX = e, this.scaleY = t, this.dom.style.transform = `scale(${1 / e}, ${1 / t})`);
  }
  draw(e) {
    if (e.length != this.drawn.length || e.some((t, i) => !Zp(t, this.drawn[i]))) {
      let t = this.dom.firstChild, i = 0;
      for (let s of e)
        s.update && t && s.constructor && this.drawn[i].constructor && s.update(t, this.drawn[i]) ? (t = t.nextSibling, i++) : this.dom.insertBefore(s.draw(), t);
      for (; t; ) {
        let s = t.nextSibling;
        t.remove(), t = s;
      }
      this.drawn = e;
    }
  }
  destroy() {
    this.layer.destroy && this.layer.destroy(this.dom, this.view), this.dom.remove();
  }
}
const Bn = /* @__PURE__ */ M.define();
function ac(n) {
  return [
    _.define((e) => new Lp(e, n)),
    Bn.of(n)
  ];
}
const hc = !R.ios, Ii = /* @__PURE__ */ M.define({
  combine(n) {
    return tt(n, {
      cursorBlinkRate: 1200,
      drawRangeCursor: !0
    }, {
      cursorBlinkRate: (e, t) => Math.min(e, t),
      drawRangeCursor: (e, t) => e || t
    });
  }
});
function Tp(n = {}) {
  return [
    Ii.of(n),
    Dp,
    Pp,
    Vp,
    Wh.of(!0)
  ];
}
function cc(n) {
  return n.startState.facet(Ii) != n.state.facet(Ii);
}
const Dp = /* @__PURE__ */ ac({
  above: !0,
  markers(n) {
    let { state: e } = n, t = e.facet(Ii), i = [];
    for (let s of e.selection.ranges) {
      let r = s == e.selection.main;
      if (s.empty ? !r || hc : t.drawRangeCursor) {
        let o = r ? "cm-cursor cm-cursor-primary" : "cm-cursor cm-cursor-secondary", l = s.empty ? s : y.cursor(s.head, s.head > s.anchor ? -1 : 1);
        for (let a of $i.forRange(n, o, l))
          i.push(a);
      }
    }
    return i;
  },
  update(n, e) {
    n.transactions.some((i) => i.selection) && (e.style.animationName = e.style.animationName == "cm-blink" ? "cm-blink2" : "cm-blink");
    let t = cc(n);
    return t && Kl(n.state, e), n.docChanged || n.selectionSet || t;
  },
  mount(n, e) {
    Kl(e.state, n);
  },
  class: "cm-cursorLayer"
});
function Kl(n, e) {
  e.style.animationDuration = n.facet(Ii).cursorBlinkRate + "ms";
}
const Pp = /* @__PURE__ */ ac({
  above: !1,
  markers(n) {
    return n.state.selection.ranges.map((e) => e.empty ? [] : $i.forRange(n, "cm-selectionBackground", e)).reduce((e, t) => e.concat(t));
  },
  update(n, e) {
    return n.docChanged || n.selectionSet || n.viewportChanged || cc(n);
  },
  class: "cm-selectionLayer"
}), Nr = {
  ".cm-line": {
    "& ::selection": { backgroundColor: "transparent !important" },
    "&::selection": { backgroundColor: "transparent !important" }
  }
};
hc && (Nr[".cm-line"].caretColor = "transparent !important", Nr[".cm-content"] = { caretColor: "transparent !important" });
const Vp = /* @__PURE__ */ Gt.highest(/* @__PURE__ */ Z.theme(Nr)), fc = /* @__PURE__ */ L.define({
  map(n, e) {
    return n == null ? null : e.mapPos(n);
  }
}), Ci = /* @__PURE__ */ ee.define({
  create() {
    return null;
  },
  update(n, e) {
    return n != null && (n = e.changes.mapPos(n)), e.effects.reduce((t, i) => i.is(fc) ? i.value : t, n);
  }
}), Bp = /* @__PURE__ */ _.fromClass(class {
  constructor(n) {
    this.view = n, this.cursor = null, this.measureReq = { read: this.readPos.bind(this), write: this.drawCursor.bind(this) };
  }
  update(n) {
    var e;
    let t = n.state.field(Ci);
    t == null ? this.cursor != null && ((e = this.cursor) === null || e === void 0 || e.remove(), this.cursor = null) : (this.cursor || (this.cursor = this.view.scrollDOM.appendChild(document.createElement("div")), this.cursor.className = "cm-dropCursor"), (n.startState.field(Ci) != t || n.docChanged || n.geometryChanged) && this.view.requestMeasure(this.measureReq));
  }
  readPos() {
    let { view: n } = this, e = n.state.field(Ci), t = e != null && n.coordsAtPos(e);
    if (!t)
      return null;
    let i = n.scrollDOM.getBoundingClientRect();
    return {
      left: t.left - i.left + n.scrollDOM.scrollLeft * n.scaleX,
      top: t.top - i.top + n.scrollDOM.scrollTop * n.scaleY,
      height: t.bottom - t.top
    };
  }
  drawCursor(n) {
    if (this.cursor) {
      let { scaleX: e, scaleY: t } = this.view;
      n ? (this.cursor.style.left = n.left / e + "px", this.cursor.style.top = n.top / t + "px", this.cursor.style.height = n.height / t + "px") : this.cursor.style.left = "-100000px";
    }
  }
  destroy() {
    this.cursor && this.cursor.remove();
  }
  setDropPos(n) {
    this.view.state.field(Ci) != n && this.view.dispatch({ effects: fc.of(n) });
  }
}, {
  eventObservers: {
    dragover(n) {
      this.setDropPos(this.view.posAtCoords({ x: n.clientX, y: n.clientY }));
    },
    dragleave(n) {
      (n.target == this.view.contentDOM || !this.view.contentDOM.contains(n.relatedTarget)) && this.setDropPos(null);
    },
    dragend() {
      this.setDropPos(null);
    },
    drop() {
      this.setDropPos(null);
    }
  }
});
function Wp() {
  return [Ci, Bp];
}
function Yl(n, e, t, i, s) {
  e.lastIndex = 0;
  for (let r = n.iterRange(t, i), o = t, l; !r.next().done; o += r.value.length)
    if (!r.lineBreak)
      for (; l = e.exec(r.value); )
        s(o + l.index, l);
}
function Xp(n, e) {
  let t = n.visibleRanges;
  if (t.length == 1 && t[0].from == n.viewport.from && t[0].to == n.viewport.to)
    return t;
  let i = [];
  for (let { from: s, to: r } of t)
    s = Math.max(n.state.doc.lineAt(s).from, s - e), r = Math.min(n.state.doc.lineAt(r).to, r + e), i.length && i[i.length - 1].to >= s ? i[i.length - 1].to = r : i.push({ from: s, to: r });
  return i;
}
class Ip {
  /**
  Create a decorator.
  */
  constructor(e) {
    const { regexp: t, decoration: i, decorate: s, boundary: r, maxLength: o = 1e3 } = e;
    if (!t.global)
      throw new RangeError("The regular expression given to MatchDecorator should have its 'g' flag set");
    if (this.regexp = t, s)
      this.addMatch = (l, a, h, c) => s(c, h, h + l[0].length, l, a);
    else if (typeof i == "function")
      this.addMatch = (l, a, h, c) => {
        let f = i(l, a, h);
        f && c(h, h + l[0].length, f);
      };
    else if (i)
      this.addMatch = (l, a, h, c) => c(h, h + l[0].length, i);
    else
      throw new RangeError("Either 'decorate' or 'decoration' should be provided to MatchDecorator");
    this.boundary = r, this.maxLength = o;
  }
  /**
  Compute the full set of decorations for matches in the given
  view's viewport. You'll want to call this when initializing your
  plugin.
  */
  createDeco(e) {
    let t = new kt(), i = t.add.bind(t);
    for (let { from: s, to: r } of Xp(e, this.maxLength))
      Yl(e.state.doc, this.regexp, s, r, (o, l) => this.addMatch(l, e, o, i));
    return t.finish();
  }
  /**
  Update a set of decorations for a view update. `deco` _must_ be
  the set of decorations produced by _this_ `MatchDecorator` for
  the view state before the update.
  */
  updateDeco(e, t) {
    let i = 1e9, s = -1;
    return e.docChanged && e.changes.iterChanges((r, o, l, a) => {
      a > e.view.viewport.from && l < e.view.viewport.to && (i = Math.min(l, i), s = Math.max(a, s));
    }), e.viewportChanged || s - i > 1e3 ? this.createDeco(e.view) : s > -1 ? this.updateRange(e.view, t.map(e.changes), i, s) : t;
  }
  updateRange(e, t, i, s) {
    for (let r of e.visibleRanges) {
      let o = Math.max(r.from, i), l = Math.min(r.to, s);
      if (l > o) {
        let a = e.state.doc.lineAt(o), h = a.to < l ? e.state.doc.lineAt(l) : a, c = Math.max(r.from, a.from), f = Math.min(r.to, h.to);
        if (this.boundary) {
          for (; o > a.from; o--)
            if (this.boundary.test(a.text[o - 1 - a.from])) {
              c = o;
              break;
            }
          for (; l < h.to; l++)
            if (this.boundary.test(h.text[l - h.from])) {
              f = l;
              break;
            }
        }
        let u = [], d, p = (g, m, b) => u.push(b.range(g, m));
        if (a == h)
          for (this.regexp.lastIndex = c - a.from; (d = this.regexp.exec(a.text)) && d.index < f - a.from; )
            this.addMatch(d, e, d.index + a.from, p);
        else
          Yl(e.state.doc, this.regexp, c, f, (g, m) => this.addMatch(m, e, g, p));
        t = t.update({ filterFrom: c, filterTo: f, filter: (g, m) => g < c || m > f, add: u });
      }
    }
    return t;
  }
}
const Gr = /x/.unicode != null ? "gu" : "g", Ep = /* @__PURE__ */ new RegExp(`[\0-\b
--­؜​‎‏\u2028\u2029‭‮⁦⁧⁩\uFEFF￹-￼]`, Gr), Np = {
  0: "null",
  7: "bell",
  8: "backspace",
  10: "newline",
  11: "vertical tab",
  13: "carriage return",
  27: "escape",
  8203: "zero width space",
  8204: "zero width non-joiner",
  8205: "zero width joiner",
  8206: "left-to-right mark",
  8207: "right-to-left mark",
  8232: "line separator",
  8237: "left-to-right override",
  8238: "right-to-left override",
  8294: "left-to-right isolate",
  8295: "right-to-left isolate",
  8297: "pop directional isolate",
  8233: "paragraph separator",
  65279: "zero width no-break space",
  65532: "object replacement"
};
let zs = null;
function Gp() {
  var n;
  if (zs == null && typeof document < "u" && document.body) {
    let e = document.body.style;
    zs = ((n = e.tabSize) !== null && n !== void 0 ? n : e.MozTabSize) != null;
  }
  return zs || !1;
}
const Wn = /* @__PURE__ */ M.define({
  combine(n) {
    let e = tt(n, {
      render: null,
      specialChars: Ep,
      addSpecialChars: null
    });
    return (e.replaceTabs = !Gp()) && (e.specialChars = new RegExp("	|" + e.specialChars.source, Gr)), e.addSpecialChars && (e.specialChars = new RegExp(e.specialChars.source + "|" + e.addSpecialChars.source, Gr)), e;
  }
});
function Hp(n = {}) {
  return [Wn.of(n), Fp()];
}
let Jl = null;
function Fp() {
  return Jl || (Jl = _.fromClass(class {
    constructor(n) {
      this.view = n, this.decorations = T.none, this.decorationCache = /* @__PURE__ */ Object.create(null), this.decorator = this.makeDecorator(n.state.facet(Wn)), this.decorations = this.decorator.createDeco(n);
    }
    makeDecorator(n) {
      return new Ip({
        regexp: n.specialChars,
        decoration: (e, t, i) => {
          let { doc: s } = t.state, r = le(e[0], 0);
          if (r == 9) {
            let o = s.lineAt(i), l = t.state.tabSize, a = Ji(o.text, l, i - o.from);
            return T.replace({
              widget: new Jp((l - a % l) * this.view.defaultCharacterWidth / this.view.scaleX)
            });
          }
          return this.decorationCache[r] || (this.decorationCache[r] = T.replace({ widget: new Yp(n, r) }));
        },
        boundary: n.replaceTabs ? void 0 : /[^]/
      });
    }
    update(n) {
      let e = n.state.facet(Wn);
      n.startState.facet(Wn) != e ? (this.decorator = this.makeDecorator(e), this.decorations = this.decorator.createDeco(n.view)) : this.decorations = this.decorator.updateDeco(n, this.decorations);
    }
  }, {
    decorations: (n) => n.decorations
  }));
}
const zp = "•";
function Kp(n) {
  return n >= 32 ? zp : n == 10 ? "␤" : String.fromCharCode(9216 + n);
}
class Yp extends Mt {
  constructor(e, t) {
    super(), this.options = e, this.code = t;
  }
  eq(e) {
    return e.code == this.code;
  }
  toDOM(e) {
    let t = Kp(this.code), i = e.state.phrase("Control character") + " " + (Np[this.code] || "0x" + this.code.toString(16)), s = this.options.render && this.options.render(this.code, i, t);
    if (s)
      return s;
    let r = document.createElement("span");
    return r.textContent = t, r.title = i, r.setAttribute("aria-label", i), r.className = "cm-specialChar", r;
  }
  ignoreEvent() {
    return !1;
  }
}
class Jp extends Mt {
  constructor(e) {
    super(), this.width = e;
  }
  eq(e) {
    return e.width == this.width;
  }
  toDOM() {
    let e = document.createElement("span");
    return e.textContent = "	", e.className = "cm-tab", e.style.width = this.width + "px", e;
  }
  ignoreEvent() {
    return !1;
  }
}
const pi = "-10000px";
class uc {
  constructor(e, t, i, s) {
    this.facet = t, this.createTooltipView = i, this.removeTooltipView = s, this.input = e.state.facet(t), this.tooltips = this.input.filter((o) => o);
    let r = null;
    this.tooltipViews = this.tooltips.map((o) => r = i(o, r));
  }
  update(e, t) {
    var i;
    let s = e.state.facet(this.facet), r = s.filter((a) => a);
    if (s === this.input) {
      for (let a of this.tooltipViews)
        a.update && a.update(e);
      return !1;
    }
    let o = [], l = t ? [] : null;
    for (let a = 0; a < r.length; a++) {
      let h = r[a], c = -1;
      if (h) {
        for (let f = 0; f < this.tooltips.length; f++) {
          let u = this.tooltips[f];
          u && u.create == h.create && (c = f);
        }
        if (c < 0)
          o[a] = this.createTooltipView(h, a ? o[a - 1] : null), l && (l[a] = !!h.above);
        else {
          let f = o[a] = this.tooltipViews[c];
          l && (l[a] = t[c]), f.update && f.update(e);
        }
      }
    }
    for (let a of this.tooltipViews)
      o.indexOf(a) < 0 && (this.removeTooltipView(a), (i = a.destroy) === null || i === void 0 || i.call(a));
    return t && (l.forEach((a, h) => t[h] = a), t.length = l.length), this.input = s, this.tooltips = r, this.tooltipViews = o, !0;
  }
}
function Qp(n) {
  let { win: e } = n;
  return { top: 0, left: 0, bottom: e.innerHeight, right: e.innerWidth };
}
const Ks = /* @__PURE__ */ M.define({
  combine: (n) => {
    var e, t, i;
    return {
      position: R.ios ? "absolute" : ((e = n.find((s) => s.position)) === null || e === void 0 ? void 0 : e.position) || "fixed",
      parent: ((t = n.find((s) => s.parent)) === null || t === void 0 ? void 0 : t.parent) || null,
      tooltipSpace: ((i = n.find((s) => s.tooltipSpace)) === null || i === void 0 ? void 0 : i.tooltipSpace) || Qp
    };
  }
}), Ql = /* @__PURE__ */ new WeakMap(), wo = /* @__PURE__ */ _.fromClass(class {
  constructor(n) {
    this.view = n, this.above = [], this.inView = !0, this.madeAbsolute = !1, this.lastTransaction = 0, this.measureTimeout = -1;
    let e = n.state.facet(Ks);
    this.position = e.position, this.parent = e.parent, this.classes = n.themeClasses, this.createContainer(), this.measureReq = { read: this.readMeasure.bind(this), write: this.writeMeasure.bind(this), key: this }, this.resizeObserver = typeof ResizeObserver == "function" ? new ResizeObserver(() => this.measureSoon()) : null, this.manager = new uc(n, ks, (t, i) => this.createTooltip(t, i), (t) => {
      this.resizeObserver && this.resizeObserver.unobserve(t.dom), t.dom.remove();
    }), this.above = this.manager.tooltips.map((t) => !!t.above), this.intersectionObserver = typeof IntersectionObserver == "function" ? new IntersectionObserver((t) => {
      Date.now() > this.lastTransaction - 50 && t.length > 0 && t[t.length - 1].intersectionRatio < 1 && this.measureSoon();
    }, { threshold: [1] }) : null, this.observeIntersection(), n.win.addEventListener("resize", this.measureSoon = this.measureSoon.bind(this)), this.maybeMeasure();
  }
  createContainer() {
    this.parent ? (this.container = document.createElement("div"), this.container.style.position = "relative", this.container.className = this.view.themeClasses, this.parent.appendChild(this.container)) : this.container = this.view.dom;
  }
  observeIntersection() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      for (let n of this.manager.tooltipViews)
        this.intersectionObserver.observe(n.dom);
    }
  }
  measureSoon() {
    this.measureTimeout < 0 && (this.measureTimeout = setTimeout(() => {
      this.measureTimeout = -1, this.maybeMeasure();
    }, 50));
  }
  update(n) {
    n.transactions.length && (this.lastTransaction = Date.now());
    let e = this.manager.update(n, this.above);
    e && this.observeIntersection();
    let t = e || n.geometryChanged, i = n.state.facet(Ks);
    if (i.position != this.position && !this.madeAbsolute) {
      this.position = i.position;
      for (let s of this.manager.tooltipViews)
        s.dom.style.position = this.position;
      t = !0;
    }
    if (i.parent != this.parent) {
      this.parent && this.container.remove(), this.parent = i.parent, this.createContainer();
      for (let s of this.manager.tooltipViews)
        this.container.appendChild(s.dom);
      t = !0;
    } else
      this.parent && this.view.themeClasses != this.classes && (this.classes = this.container.className = this.view.themeClasses);
    t && this.maybeMeasure();
  }
  createTooltip(n, e) {
    let t = n.create(this.view), i = e ? e.dom : null;
    if (t.dom.classList.add("cm-tooltip"), n.arrow && !t.dom.querySelector(".cm-tooltip > .cm-tooltip-arrow")) {
      let s = document.createElement("div");
      s.className = "cm-tooltip-arrow", t.dom.insertBefore(s, i);
    }
    return t.dom.style.position = this.position, t.dom.style.top = pi, t.dom.style.left = "0px", this.container.insertBefore(t.dom, i), t.mount && t.mount(this.view), this.resizeObserver && this.resizeObserver.observe(t.dom), t;
  }
  destroy() {
    var n, e, t;
    this.view.win.removeEventListener("resize", this.measureSoon);
    for (let i of this.manager.tooltipViews)
      i.dom.remove(), (n = i.destroy) === null || n === void 0 || n.call(i);
    this.parent && this.container.remove(), (e = this.resizeObserver) === null || e === void 0 || e.disconnect(), (t = this.intersectionObserver) === null || t === void 0 || t.disconnect(), clearTimeout(this.measureTimeout);
  }
  readMeasure() {
    let n = this.view.dom.getBoundingClientRect(), e = 1, t = 1, i = !1;
    if (this.position == "fixed" && this.manager.tooltipViews.length) {
      let { dom: s } = this.manager.tooltipViews[0];
      if (R.gecko)
        i = s.offsetParent != this.container.ownerDocument.body;
      else if (s.style.top == pi && s.style.left == "0px") {
        let r = s.getBoundingClientRect();
        i = Math.abs(r.top + 1e4) > 1 || Math.abs(r.left) > 1;
      }
    }
    if (i || this.position == "absolute")
      if (this.parent) {
        let s = this.parent.getBoundingClientRect();
        s.width && s.height && (e = s.width / this.parent.offsetWidth, t = s.height / this.parent.offsetHeight);
      } else
        ({ scaleX: e, scaleY: t } = this.view.viewState);
    return {
      editor: n,
      parent: this.parent ? this.container.getBoundingClientRect() : n,
      pos: this.manager.tooltips.map((s, r) => {
        let o = this.manager.tooltipViews[r];
        return o.getCoords ? o.getCoords(s.pos) : this.view.coordsAtPos(s.pos);
      }),
      size: this.manager.tooltipViews.map(({ dom: s }) => s.getBoundingClientRect()),
      space: this.view.state.facet(Ks).tooltipSpace(this.view),
      scaleX: e,
      scaleY: t,
      makeAbsolute: i
    };
  }
  writeMeasure(n) {
    var e;
    if (n.makeAbsolute) {
      this.madeAbsolute = !0, this.position = "absolute";
      for (let l of this.manager.tooltipViews)
        l.dom.style.position = "absolute";
    }
    let { editor: t, space: i, scaleX: s, scaleY: r } = n, o = [];
    for (let l = 0; l < this.manager.tooltips.length; l++) {
      let a = this.manager.tooltips[l], h = this.manager.tooltipViews[l], { dom: c } = h, f = n.pos[l], u = n.size[l];
      if (!f || f.bottom <= Math.max(t.top, i.top) || f.top >= Math.min(t.bottom, i.bottom) || f.right < Math.max(t.left, i.left) - 0.1 || f.left > Math.min(t.right, i.right) + 0.1) {
        c.style.top = pi;
        continue;
      }
      let d = a.arrow ? h.dom.querySelector(".cm-tooltip-arrow") : null, p = d ? 7 : 0, g = u.right - u.left, m = (e = Ql.get(h)) !== null && e !== void 0 ? e : u.bottom - u.top, b = h.offset || $p, k = this.view.textDirection == J.LTR, C = u.width > i.right - i.left ? k ? i.left : i.right - u.width : k ? Math.min(f.left - (d ? 14 : 0) + b.x, i.right - g) : Math.max(i.left, f.left - g + (d ? 14 : 0) - b.x), S = this.above[l];
      !a.strictSide && (S ? f.top - (u.bottom - u.top) - b.y < i.top : f.bottom + (u.bottom - u.top) + b.y > i.bottom) && S == i.bottom - f.bottom > f.top - i.top && (S = this.above[l] = !S);
      let w = (S ? f.top - i.top : i.bottom - f.bottom) - p;
      if (w < m && h.resize !== !1) {
        if (w < this.view.defaultLineHeight) {
          c.style.top = pi;
          continue;
        }
        Ql.set(h, m), c.style.height = (m = w) / r + "px";
      } else
        c.style.height && (c.style.height = "");
      let A = S ? f.top - m - p - b.y : f.bottom + p + b.y, O = C + g;
      if (h.overlap !== !0)
        for (let D of o)
          D.left < O && D.right > C && D.top < A + m && D.bottom > A && (A = S ? D.top - m - 2 - p : D.bottom + p + 2);
      if (this.position == "absolute" ? (c.style.top = (A - n.parent.top) / r + "px", c.style.left = (C - n.parent.left) / s + "px") : (c.style.top = A / r + "px", c.style.left = C / s + "px"), d) {
        let D = f.left + (k ? b.x : -b.x) - (C + 14 - 7);
        d.style.left = D / s + "px";
      }
      h.overlap !== !0 && o.push({ left: C, top: A, right: O, bottom: A + m }), c.classList.toggle("cm-tooltip-above", S), c.classList.toggle("cm-tooltip-below", !S), h.positioned && h.positioned(n.space);
    }
  }
  maybeMeasure() {
    if (this.manager.tooltips.length && (this.view.inView && this.view.requestMeasure(this.measureReq), this.inView != this.view.inView && (this.inView = this.view.inView, !this.inView)))
      for (let n of this.manager.tooltipViews)
        n.dom.style.top = pi;
  }
}, {
  eventObservers: {
    scroll() {
      this.maybeMeasure();
    }
  }
}), Up = /* @__PURE__ */ Z.baseTheme({
  ".cm-tooltip": {
    zIndex: 100,
    boxSizing: "border-box"
  },
  "&light .cm-tooltip": {
    border: "1px solid #bbb",
    backgroundColor: "#f5f5f5"
  },
  "&light .cm-tooltip-section:not(:first-child)": {
    borderTop: "1px solid #bbb"
  },
  "&dark .cm-tooltip": {
    backgroundColor: "#333338",
    color: "white"
  },
  ".cm-tooltip-arrow": {
    height: "7px",
    width: `${7 * 2}px`,
    position: "absolute",
    zIndex: -1,
    overflow: "hidden",
    "&:before, &:after": {
      content: "''",
      position: "absolute",
      width: 0,
      height: 0,
      borderLeft: "7px solid transparent",
      borderRight: "7px solid transparent"
    },
    ".cm-tooltip-above &": {
      bottom: "-7px",
      "&:before": {
        borderTop: "7px solid #bbb"
      },
      "&:after": {
        borderTop: "7px solid #f5f5f5",
        bottom: "1px"
      }
    },
    ".cm-tooltip-below &": {
      top: "-7px",
      "&:before": {
        borderBottom: "7px solid #bbb"
      },
      "&:after": {
        borderBottom: "7px solid #f5f5f5",
        top: "1px"
      }
    }
  },
  "&dark .cm-tooltip .cm-tooltip-arrow": {
    "&:before": {
      borderTopColor: "#333338",
      borderBottomColor: "#333338"
    },
    "&:after": {
      borderTopColor: "transparent",
      borderBottomColor: "transparent"
    }
  }
}), $p = { x: 0, y: 0 }, ks = /* @__PURE__ */ M.define({
  enables: [wo, Up]
}), qn = /* @__PURE__ */ M.define({
  combine: (n) => n.reduce((e, t) => e.concat(t), [])
});
class Ss {
  // Needs to be static so that host tooltip instances always match
  static create(e) {
    return new Ss(e);
  }
  constructor(e) {
    this.view = e, this.mounted = !1, this.dom = document.createElement("div"), this.dom.classList.add("cm-tooltip-hover"), this.manager = new uc(e, qn, (t, i) => this.createHostedView(t, i), (t) => t.dom.remove());
  }
  createHostedView(e, t) {
    let i = e.create(this.view);
    return i.dom.classList.add("cm-tooltip-section"), this.dom.insertBefore(i.dom, t ? t.dom.nextSibling : this.dom.firstChild), this.mounted && i.mount && i.mount(this.view), i;
  }
  mount(e) {
    for (let t of this.manager.tooltipViews)
      t.mount && t.mount(e);
    this.mounted = !0;
  }
  positioned(e) {
    for (let t of this.manager.tooltipViews)
      t.positioned && t.positioned(e);
  }
  update(e) {
    this.manager.update(e);
  }
  destroy() {
    var e;
    for (let t of this.manager.tooltipViews)
      (e = t.destroy) === null || e === void 0 || e.call(t);
  }
  passProp(e) {
    let t;
    for (let i of this.manager.tooltipViews) {
      let s = i[e];
      if (s !== void 0) {
        if (t === void 0)
          t = s;
        else if (t !== s)
          return;
      }
    }
    return t;
  }
  get offset() {
    return this.passProp("offset");
  }
  get getCoords() {
    return this.passProp("getCoords");
  }
  get overlap() {
    return this.passProp("overlap");
  }
  get resize() {
    return this.passProp("resize");
  }
}
const jp = /* @__PURE__ */ ks.compute([qn], (n) => {
  let e = n.facet(qn);
  return e.length === 0 ? null : {
    pos: Math.min(...e.map((t) => t.pos)),
    end: Math.max(...e.map((t) => {
      var i;
      return (i = t.end) !== null && i !== void 0 ? i : t.pos;
    })),
    create: Ss.create,
    above: e[0].above,
    arrow: e.some((t) => t.arrow)
  };
});
class qp {
  constructor(e, t, i, s, r) {
    this.view = e, this.source = t, this.field = i, this.setHover = s, this.hoverTime = r, this.hoverTimeout = -1, this.restartTimeout = -1, this.pending = null, this.lastMove = { x: 0, y: 0, target: e.dom, time: 0 }, this.checkHover = this.checkHover.bind(this), e.dom.addEventListener("mouseleave", this.mouseleave = this.mouseleave.bind(this)), e.dom.addEventListener("mousemove", this.mousemove = this.mousemove.bind(this));
  }
  update() {
    this.pending && (this.pending = null, clearTimeout(this.restartTimeout), this.restartTimeout = setTimeout(() => this.startHover(), 20));
  }
  get active() {
    return this.view.state.field(this.field);
  }
  checkHover() {
    if (this.hoverTimeout = -1, this.active.length)
      return;
    let e = Date.now() - this.lastMove.time;
    e < this.hoverTime ? this.hoverTimeout = setTimeout(this.checkHover, this.hoverTime - e) : this.startHover();
  }
  startHover() {
    clearTimeout(this.restartTimeout);
    let { view: e, lastMove: t } = this, i = e.docView.nearest(t.target);
    if (!i)
      return;
    let s, r = 1;
    if (i instanceof mt)
      s = i.posAtStart;
    else {
      if (s = e.posAtCoords(t), s == null)
        return;
      let l = e.coordsAtPos(s);
      if (!l || t.y < l.top || t.y > l.bottom || t.x < l.left - e.defaultCharacterWidth || t.x > l.right + e.defaultCharacterWidth)
        return;
      let a = e.bidiSpans(e.state.doc.lineAt(s)).find((c) => c.from <= s && c.to >= s), h = a && a.dir == J.RTL ? -1 : 1;
      r = t.x < l.left ? -h : h;
    }
    let o = this.source(e, s, r);
    if (o != null && o.then) {
      let l = this.pending = { pos: s };
      o.then((a) => {
        this.pending == l && (this.pending = null, a && !(Array.isArray(a) && !a.length) && e.dispatch({ effects: this.setHover.of(Array.isArray(a) ? a : [a]) }));
      }, (a) => Pe(e.state, a, "hover tooltip"));
    } else
      o && !(Array.isArray(o) && !o.length) && e.dispatch({ effects: this.setHover.of(Array.isArray(o) ? o : [o]) });
  }
  get tooltip() {
    let e = this.view.plugin(wo), t = e ? e.manager.tooltips.findIndex((i) => i.create == Ss.create) : -1;
    return t > -1 ? e.manager.tooltipViews[t] : null;
  }
  mousemove(e) {
    var t, i;
    this.lastMove = { x: e.clientX, y: e.clientY, target: e.target, time: Date.now() }, this.hoverTimeout < 0 && (this.hoverTimeout = setTimeout(this.checkHover, this.hoverTime));
    let { active: s, tooltip: r } = this;
    if (s.length && r && !_p(r.dom, e) || this.pending) {
      let { pos: o } = s[0] || this.pending, l = (i = (t = s[0]) === null || t === void 0 ? void 0 : t.end) !== null && i !== void 0 ? i : o;
      (o == l ? this.view.posAtCoords(this.lastMove) != o : !em(this.view, o, l, e.clientX, e.clientY)) && (this.view.dispatch({ effects: this.setHover.of([]) }), this.pending = null);
    }
  }
  mouseleave(e) {
    clearTimeout(this.hoverTimeout), this.hoverTimeout = -1;
    let { active: t } = this;
    if (t.length) {
      let { tooltip: i } = this;
      i && i.dom.contains(e.relatedTarget) ? this.watchTooltipLeave(i.dom) : this.view.dispatch({ effects: this.setHover.of([]) });
    }
  }
  watchTooltipLeave(e) {
    let t = (i) => {
      e.removeEventListener("mouseleave", t), this.active.length && !this.view.dom.contains(i.relatedTarget) && this.view.dispatch({ effects: this.setHover.of([]) });
    };
    e.addEventListener("mouseleave", t);
  }
  destroy() {
    clearTimeout(this.hoverTimeout), this.view.dom.removeEventListener("mouseleave", this.mouseleave), this.view.dom.removeEventListener("mousemove", this.mousemove);
  }
}
const yn = 4;
function _p(n, e) {
  let t = n.getBoundingClientRect();
  return e.clientX >= t.left - yn && e.clientX <= t.right + yn && e.clientY >= t.top - yn && e.clientY <= t.bottom + yn;
}
function em(n, e, t, i, s, r) {
  let o = n.scrollDOM.getBoundingClientRect(), l = n.documentTop + n.documentPadding.top + n.contentHeight;
  if (o.left > i || o.right < i || o.top > s || Math.min(o.bottom, l) < s)
    return !1;
  let a = n.posAtCoords({ x: i, y: s }, !1);
  return a >= e && a <= t;
}
function tm(n, e = {}) {
  let t = L.define(), i = ee.define({
    create() {
      return [];
    },
    update(s, r) {
      if (s.length && (e.hideOnChange && (r.docChanged || r.selection) ? s = [] : e.hideOn && (s = s.filter((o) => !e.hideOn(r, o))), r.docChanged)) {
        let o = [];
        for (let l of s) {
          let a = r.changes.mapPos(l.pos, -1, be.TrackDel);
          if (a != null) {
            let h = Object.assign(/* @__PURE__ */ Object.create(null), l);
            h.pos = a, h.end != null && (h.end = r.changes.mapPos(h.end)), o.push(h);
          }
        }
        s = o;
      }
      for (let o of r.effects)
        o.is(t) && (s = o.value), o.is(im) && (s = []);
      return s;
    },
    provide: (s) => qn.from(s)
  });
  return [
    i,
    _.define((s) => new qp(
      s,
      n,
      i,
      t,
      e.hoverTime || 300
      /* Hover.Time */
    )),
    jp
  ];
}
function dc(n, e) {
  let t = n.plugin(wo);
  if (!t)
    return null;
  let i = t.manager.tooltips.indexOf(e);
  return i < 0 ? null : t.manager.tooltipViews[i];
}
const im = /* @__PURE__ */ L.define(), Ul = /* @__PURE__ */ M.define({
  combine(n) {
    let e, t;
    for (let i of n)
      e = e || i.topContainer, t = t || i.bottomContainer;
    return { topContainer: e, bottomContainer: t };
  }
});
function Ei(n, e) {
  let t = n.plugin(pc), i = t ? t.specs.indexOf(e) : -1;
  return i > -1 ? t.panels[i] : null;
}
const pc = /* @__PURE__ */ _.fromClass(class {
  constructor(n) {
    this.input = n.state.facet(Ni), this.specs = this.input.filter((t) => t), this.panels = this.specs.map((t) => t(n));
    let e = n.state.facet(Ul);
    this.top = new xn(n, !0, e.topContainer), this.bottom = new xn(n, !1, e.bottomContainer), this.top.sync(this.panels.filter((t) => t.top)), this.bottom.sync(this.panels.filter((t) => !t.top));
    for (let t of this.panels)
      t.dom.classList.add("cm-panel"), t.mount && t.mount();
  }
  update(n) {
    let e = n.state.facet(Ul);
    this.top.container != e.topContainer && (this.top.sync([]), this.top = new xn(n.view, !0, e.topContainer)), this.bottom.container != e.bottomContainer && (this.bottom.sync([]), this.bottom = new xn(n.view, !1, e.bottomContainer)), this.top.syncClasses(), this.bottom.syncClasses();
    let t = n.state.facet(Ni);
    if (t != this.input) {
      let i = t.filter((a) => a), s = [], r = [], o = [], l = [];
      for (let a of i) {
        let h = this.specs.indexOf(a), c;
        h < 0 ? (c = a(n.view), l.push(c)) : (c = this.panels[h], c.update && c.update(n)), s.push(c), (c.top ? r : o).push(c);
      }
      this.specs = i, this.panels = s, this.top.sync(r), this.bottom.sync(o);
      for (let a of l)
        a.dom.classList.add("cm-panel"), a.mount && a.mount();
    } else
      for (let i of this.panels)
        i.update && i.update(n);
  }
  destroy() {
    this.top.sync([]), this.bottom.sync([]);
  }
}, {
  provide: (n) => Z.scrollMargins.of((e) => {
    let t = e.plugin(n);
    return t && { top: t.top.scrollMargin(), bottom: t.bottom.scrollMargin() };
  })
});
class xn {
  constructor(e, t, i) {
    this.view = e, this.top = t, this.container = i, this.dom = void 0, this.classes = "", this.panels = [], this.syncClasses();
  }
  sync(e) {
    for (let t of this.panels)
      t.destroy && e.indexOf(t) < 0 && t.destroy();
    this.panels = e, this.syncDOM();
  }
  syncDOM() {
    if (this.panels.length == 0) {
      this.dom && (this.dom.remove(), this.dom = void 0);
      return;
    }
    if (!this.dom) {
      this.dom = document.createElement("div"), this.dom.className = this.top ? "cm-panels cm-panels-top" : "cm-panels cm-panels-bottom", this.dom.style[this.top ? "top" : "bottom"] = "0";
      let t = this.container || this.view.dom;
      t.insertBefore(this.dom, this.top ? t.firstChild : null);
    }
    let e = this.dom.firstChild;
    for (let t of this.panels)
      if (t.dom.parentNode == this.dom) {
        for (; e != t.dom; )
          e = $l(e);
        e = e.nextSibling;
      } else
        this.dom.insertBefore(t.dom, e);
    for (; e; )
      e = $l(e);
  }
  scrollMargin() {
    return !this.dom || this.container ? 0 : Math.max(0, this.top ? this.dom.getBoundingClientRect().bottom - Math.max(0, this.view.scrollDOM.getBoundingClientRect().top) : Math.min(innerHeight, this.view.scrollDOM.getBoundingClientRect().bottom) - this.dom.getBoundingClientRect().top);
  }
  syncClasses() {
    if (!(!this.container || this.classes == this.view.themeClasses)) {
      for (let e of this.classes.split(" "))
        e && this.container.classList.remove(e);
      for (let e of (this.classes = this.view.themeClasses).split(" "))
        e && this.container.classList.add(e);
    }
  }
}
function $l(n) {
  let e = n.nextSibling;
  return n.remove(), e;
}
const Ni = /* @__PURE__ */ M.define({
  enables: pc
});
class at extends Xt {
  /**
  @internal
  */
  compare(e) {
    return this == e || this.constructor == e.constructor && this.eq(e);
  }
  /**
  Compare this marker to another marker of the same type.
  */
  eq(e) {
    return !1;
  }
  /**
  Called if the marker has a `toDOM` method and its representation
  was removed from a gutter.
  */
  destroy(e) {
  }
}
at.prototype.elementClass = "";
at.prototype.toDOM = void 0;
at.prototype.mapMode = be.TrackBefore;
at.prototype.startSide = at.prototype.endSide = -1;
at.prototype.point = !0;
const Ys = /* @__PURE__ */ M.define(), nm = {
  class: "",
  renderEmptyElements: !1,
  elementStyle: "",
  markers: () => I.empty,
  lineMarker: () => null,
  widgetMarker: () => null,
  lineMarkerChange: null,
  initialSpacer: null,
  updateSpacer: null,
  domEventHandlers: {}
}, Zi = /* @__PURE__ */ M.define();
function mc(n) {
  return [gc(), Zi.of(Object.assign(Object.assign({}, nm), n))];
}
const Hr = /* @__PURE__ */ M.define({
  combine: (n) => n.some((e) => e)
});
function gc(n) {
  let e = [
    sm
  ];
  return n && n.fixed === !1 && e.push(Hr.of(!0)), e;
}
const sm = /* @__PURE__ */ _.fromClass(class {
  constructor(n) {
    this.view = n, this.prevViewport = n.viewport, this.dom = document.createElement("div"), this.dom.className = "cm-gutters", this.dom.setAttribute("aria-hidden", "true"), this.dom.style.minHeight = this.view.contentHeight / this.view.scaleY + "px", this.gutters = n.state.facet(Zi).map((e) => new ql(n, e));
    for (let e of this.gutters)
      this.dom.appendChild(e.dom);
    this.fixed = !n.state.facet(Hr), this.fixed && (this.dom.style.position = "sticky"), this.syncGutters(!1), n.scrollDOM.insertBefore(this.dom, n.contentDOM);
  }
  update(n) {
    if (this.updateGutters(n)) {
      let e = this.prevViewport, t = n.view.viewport, i = Math.min(e.to, t.to) - Math.max(e.from, t.from);
      this.syncGutters(i < (t.to - t.from) * 0.8);
    }
    n.geometryChanged && (this.dom.style.minHeight = this.view.contentHeight + "px"), this.view.state.facet(Hr) != !this.fixed && (this.fixed = !this.fixed, this.dom.style.position = this.fixed ? "sticky" : ""), this.prevViewport = n.view.viewport;
  }
  syncGutters(n) {
    let e = this.dom.nextSibling;
    n && this.dom.remove();
    let t = I.iter(this.view.state.facet(Ys), this.view.viewport.from), i = [], s = this.gutters.map((r) => new rm(r, this.view.viewport, -this.view.documentPadding.top));
    for (let r of this.view.viewportLineBlocks)
      if (i.length && (i = []), Array.isArray(r.type)) {
        let o = !0;
        for (let l of r.type)
          if (l.type == ye.Text && o) {
            Fr(t, i, l.from);
            for (let a of s)
              a.line(this.view, l, i);
            o = !1;
          } else if (l.widget)
            for (let a of s)
              a.widget(this.view, l);
      } else if (r.type == ye.Text) {
        Fr(t, i, r.from);
        for (let o of s)
          o.line(this.view, r, i);
      } else if (r.widget)
        for (let o of s)
          o.widget(this.view, r);
    for (let r of s)
      r.finish();
    n && this.view.scrollDOM.insertBefore(this.dom, e);
  }
  updateGutters(n) {
    let e = n.startState.facet(Zi), t = n.state.facet(Zi), i = n.docChanged || n.heightChanged || n.viewportChanged || !I.eq(n.startState.facet(Ys), n.state.facet(Ys), n.view.viewport.from, n.view.viewport.to);
    if (e == t)
      for (let s of this.gutters)
        s.update(n) && (i = !0);
    else {
      i = !0;
      let s = [];
      for (let r of t) {
        let o = e.indexOf(r);
        o < 0 ? s.push(new ql(this.view, r)) : (this.gutters[o].update(n), s.push(this.gutters[o]));
      }
      for (let r of this.gutters)
        r.dom.remove(), s.indexOf(r) < 0 && r.destroy();
      for (let r of s)
        this.dom.appendChild(r.dom);
      this.gutters = s;
    }
    return i;
  }
  destroy() {
    for (let n of this.gutters)
      n.destroy();
    this.dom.remove();
  }
}, {
  provide: (n) => Z.scrollMargins.of((e) => {
    let t = e.plugin(n);
    return !t || t.gutters.length == 0 || !t.fixed ? null : e.textDirection == J.LTR ? { left: t.dom.offsetWidth * e.scaleX } : { right: t.dom.offsetWidth * e.scaleX };
  })
});
function jl(n) {
  return Array.isArray(n) ? n : [n];
}
function Fr(n, e, t) {
  for (; n.value && n.from <= t; )
    n.from == t && e.push(n.value), n.next();
}
class rm {
  constructor(e, t, i) {
    this.gutter = e, this.height = i, this.i = 0, this.cursor = I.iter(e.markers, t.from);
  }
  addElement(e, t, i) {
    let { gutter: s } = this, r = (t.top - this.height) / e.scaleY, o = t.height / e.scaleY;
    if (this.i == s.elements.length) {
      let l = new bc(e, o, r, i);
      s.elements.push(l), s.dom.appendChild(l.dom);
    } else
      s.elements[this.i].update(e, o, r, i);
    this.height = t.bottom, this.i++;
  }
  line(e, t, i) {
    let s = [];
    Fr(this.cursor, s, t.from), i.length && (s = s.concat(i));
    let r = this.gutter.config.lineMarker(e, t, s);
    r && s.unshift(r);
    let o = this.gutter;
    s.length == 0 && !o.config.renderEmptyElements || this.addElement(e, t, s);
  }
  widget(e, t) {
    let i = this.gutter.config.widgetMarker(e, t.widget, t);
    i && this.addElement(e, t, [i]);
  }
  finish() {
    let e = this.gutter;
    for (; e.elements.length > this.i; ) {
      let t = e.elements.pop();
      e.dom.removeChild(t.dom), t.destroy();
    }
  }
}
class ql {
  constructor(e, t) {
    this.view = e, this.config = t, this.elements = [], this.spacer = null, this.dom = document.createElement("div"), this.dom.className = "cm-gutter" + (this.config.class ? " " + this.config.class : "");
    for (let i in t.domEventHandlers)
      this.dom.addEventListener(i, (s) => {
        let r = s.target, o;
        if (r != this.dom && this.dom.contains(r)) {
          for (; r.parentNode != this.dom; )
            r = r.parentNode;
          let a = r.getBoundingClientRect();
          o = (a.top + a.bottom) / 2;
        } else
          o = s.clientY;
        let l = e.lineBlockAtHeight(o - e.documentTop);
        t.domEventHandlers[i](e, l, s) && s.preventDefault();
      });
    this.markers = jl(t.markers(e)), t.initialSpacer && (this.spacer = new bc(e, 0, 0, [t.initialSpacer(e)]), this.dom.appendChild(this.spacer.dom), this.spacer.dom.style.cssText += "visibility: hidden; pointer-events: none");
  }
  update(e) {
    let t = this.markers;
    if (this.markers = jl(this.config.markers(e.view)), this.spacer && this.config.updateSpacer) {
      let s = this.config.updateSpacer(this.spacer.markers[0], e);
      s != this.spacer.markers[0] && this.spacer.update(e.view, 0, 0, [s]);
    }
    let i = e.view.viewport;
    return !I.eq(this.markers, t, i.from, i.to) || (this.config.lineMarkerChange ? this.config.lineMarkerChange(e) : !1);
  }
  destroy() {
    for (let e of this.elements)
      e.destroy();
  }
}
class bc {
  constructor(e, t, i, s) {
    this.height = -1, this.above = 0, this.markers = [], this.dom = document.createElement("div"), this.dom.className = "cm-gutterElement", this.update(e, t, i, s);
  }
  update(e, t, i, s) {
    this.height != t && (this.height = t, this.dom.style.height = t + "px"), this.above != i && (this.dom.style.marginTop = (this.above = i) ? i + "px" : ""), om(this.markers, s) || this.setMarkers(e, s);
  }
  setMarkers(e, t) {
    let i = "cm-gutterElement", s = this.dom.firstChild;
    for (let r = 0, o = 0; ; ) {
      let l = o, a = r < t.length ? t[r++] : null, h = !1;
      if (a) {
        let c = a.elementClass;
        c && (i += " " + c);
        for (let f = o; f < this.markers.length; f++)
          if (this.markers[f].compare(a)) {
            l = f, h = !0;
            break;
          }
      } else
        l = this.markers.length;
      for (; o < l; ) {
        let c = this.markers[o++];
        if (c.toDOM) {
          c.destroy(s);
          let f = s.nextSibling;
          s.remove(), s = f;
        }
      }
      if (!a)
        break;
      a.toDOM && (h ? s = s.nextSibling : this.dom.insertBefore(a.toDOM(e), s)), h && o++;
    }
    this.dom.className = i, this.markers = t;
  }
  destroy() {
    this.setMarkers(null, []);
  }
}
function om(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++)
    if (!n[t].compare(e[t]))
      return !1;
  return !0;
}
const lm = /* @__PURE__ */ M.define(), Qt = /* @__PURE__ */ M.define({
  combine(n) {
    return tt(n, { formatNumber: String, domEventHandlers: {} }, {
      domEventHandlers(e, t) {
        let i = Object.assign({}, e);
        for (let s in t) {
          let r = i[s], o = t[s];
          i[s] = r ? (l, a, h) => r(l, a, h) || o(l, a, h) : o;
        }
        return i;
      }
    });
  }
});
class Js extends at {
  constructor(e) {
    super(), this.number = e;
  }
  eq(e) {
    return this.number == e.number;
  }
  toDOM() {
    return document.createTextNode(this.number);
  }
}
function Qs(n, e) {
  return n.state.facet(Qt).formatNumber(e, n.state);
}
const am = /* @__PURE__ */ Zi.compute([Qt], (n) => ({
  class: "cm-lineNumbers",
  renderEmptyElements: !1,
  markers(e) {
    return e.state.facet(lm);
  },
  lineMarker(e, t, i) {
    return i.some((s) => s.toDOM) ? null : new Js(Qs(e, e.state.doc.lineAt(t.from).number));
  },
  widgetMarker: () => null,
  lineMarkerChange: (e) => e.startState.facet(Qt) != e.state.facet(Qt),
  initialSpacer(e) {
    return new Js(Qs(e, _l(e.state.doc.lines)));
  },
  updateSpacer(e, t) {
    let i = Qs(t.view, _l(t.view.state.doc.lines));
    return i == e.number ? e : new Js(i);
  },
  domEventHandlers: n.facet(Qt).domEventHandlers
}));
function hm(n = {}) {
  return [
    Qt.of(n),
    gc(),
    am
  ];
}
function _l(n) {
  let e = 9;
  for (; e < n; )
    e = e * 10 + 9;
  return e;
}
let cm = 0;
class Se {
  /**
  @internal
  */
  constructor(e, t, i) {
    this.set = e, this.base = t, this.modified = i, this.id = cm++;
  }
  /**
  Define a new tag. If `parent` is given, the tag is treated as a
  sub-tag of that parent, and
  [highlighters](#highlight.tagHighlighter) that don't mention
  this tag will try to fall back to the parent tag (or grandparent
  tag, etc).
  */
  static define(e) {
    if (e != null && e.base)
      throw new Error("Can not derive from a modified tag");
    let t = new Se([], null, []);
    if (t.set.push(t), e)
      for (let i of e.set)
        t.set.push(i);
    return t;
  }
  /**
  Define a tag _modifier_, which is a function that, given a tag,
  will return a tag that is a subtag of the original. Applying the
  same modifier to a twice tag will return the same value (`m1(t1)
  == m1(t1)`) and applying multiple modifiers will, regardless or
  order, produce the same tag (`m1(m2(t1)) == m2(m1(t1))`).
  
  When multiple modifiers are applied to a given base tag, each
  smaller set of modifiers is registered as a parent, so that for
  example `m1(m2(m3(t1)))` is a subtype of `m1(m2(t1))`,
  `m1(m3(t1)`, and so on.
  */
  static defineModifier() {
    let e = new _n();
    return (t) => t.modified.indexOf(e) > -1 ? t : _n.get(t.base || t, t.modified.concat(e).sort((i, s) => i.id - s.id));
  }
}
let fm = 0;
class _n {
  constructor() {
    this.instances = [], this.id = fm++;
  }
  static get(e, t) {
    if (!t.length)
      return e;
    let i = t[0].instances.find((l) => l.base == e && um(t, l.modified));
    if (i)
      return i;
    let s = [], r = new Se(s, e, t);
    for (let l of t)
      l.instances.push(r);
    let o = dm(t);
    for (let l of e.set)
      if (!l.modified.length)
        for (let a of o)
          s.push(_n.get(l, a));
    return r;
  }
}
function um(n, e) {
  return n.length == e.length && n.every((t, i) => t == e[i]);
}
function dm(n) {
  let e = [[]];
  for (let t = 0; t < n.length; t++)
    for (let i = 0, s = e.length; i < s; i++)
      e.push(e[i].concat(n[t]));
  return e.sort((t, i) => i.length - t.length);
}
function yc(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n) {
    let i = n[t];
    Array.isArray(i) || (i = [i]);
    for (let s of t.split(" "))
      if (s) {
        let r = [], o = 2, l = s;
        for (let f = 0; ; ) {
          if (l == "..." && f > 0 && f + 3 == s.length) {
            o = 1;
            break;
          }
          let u = /^"(?:[^"\\]|\\.)*?"|[^\/!]+/.exec(l);
          if (!u)
            throw new RangeError("Invalid path: " + s);
          if (r.push(u[0] == "*" ? "" : u[0][0] == '"' ? JSON.parse(u[0]) : u[0]), f += u[0].length, f == s.length)
            break;
          let d = s[f++];
          if (f == s.length && d == "!") {
            o = 0;
            break;
          }
          if (d != "/")
            throw new RangeError("Invalid path: " + s);
          l = s.slice(f);
        }
        let a = r.length - 1, h = r[a];
        if (!h)
          throw new RangeError("Invalid path: " + s);
        let c = new es(i, o, a > 0 ? r.slice(0, a) : null);
        e[h] = c.sort(e[h]);
      }
  }
  return xc.add(e);
}
const xc = new V();
class es {
  constructor(e, t, i, s) {
    this.tags = e, this.mode = t, this.context = i, this.next = s;
  }
  get opaque() {
    return this.mode == 0;
  }
  get inherit() {
    return this.mode == 1;
  }
  sort(e) {
    return !e || e.depth < this.depth ? (this.next = e, this) : (e.next = this.sort(e.next), e);
  }
  get depth() {
    return this.context ? this.context.length : 0;
  }
}
es.empty = new es([], 2, null);
function wc(n, e) {
  let t = /* @__PURE__ */ Object.create(null);
  for (let r of n)
    if (!Array.isArray(r.tag))
      t[r.tag.id] = r.class;
    else
      for (let o of r.tag)
        t[o.id] = r.class;
  let { scope: i, all: s = null } = e || {};
  return {
    style: (r) => {
      let o = s;
      for (let l of r)
        for (let a of l.set) {
          let h = t[a.id];
          if (h) {
            o = o ? o + " " + h : h;
            break;
          }
        }
      return o;
    },
    scope: i
  };
}
function pm(n, e) {
  let t = null;
  for (let i of n) {
    let s = i.style(e);
    s && (t = t ? t + " " + s : s);
  }
  return t;
}
function mm(n, e, t, i = 0, s = n.length) {
  let r = new gm(i, Array.isArray(e) ? e : [e], t);
  r.highlightRange(n.cursor(), i, s, "", r.highlighters), r.flush(s);
}
class gm {
  constructor(e, t, i) {
    this.at = e, this.highlighters = t, this.span = i, this.class = "";
  }
  startSpan(e, t) {
    t != this.class && (this.flush(e), e > this.at && (this.at = e), this.class = t);
  }
  flush(e) {
    e > this.at && this.class && this.span(this.at, e, this.class);
  }
  highlightRange(e, t, i, s, r) {
    let { type: o, from: l, to: a } = e;
    if (l >= i || a <= t)
      return;
    o.isTop && (r = this.highlighters.filter((d) => !d.scope || d.scope(o)));
    let h = s, c = bm(e) || es.empty, f = pm(r, c.tags);
    if (f && (h && (h += " "), h += f, c.mode == 1 && (s += (s ? " " : "") + f)), this.startSpan(Math.max(t, l), h), c.opaque)
      return;
    let u = e.tree && e.tree.prop(V.mounted);
    if (u && u.overlay) {
      let d = e.node.enter(u.overlay[0].from + l, 1), p = this.highlighters.filter((m) => !m.scope || m.scope(u.tree.type)), g = e.firstChild();
      for (let m = 0, b = l; ; m++) {
        let k = m < u.overlay.length ? u.overlay[m] : null, C = k ? k.from + l : a, S = Math.max(t, b), w = Math.min(i, C);
        if (S < w && g)
          for (; e.from < w && (this.highlightRange(e, S, w, s, r), this.startSpan(Math.min(w, e.to), h), !(e.to >= C || !e.nextSibling())); )
            ;
        if (!k || C > i)
          break;
        b = k.to + l, b > t && (this.highlightRange(d.cursor(), Math.max(t, k.from + l), Math.min(i, b), "", p), this.startSpan(Math.min(i, b), h));
      }
      g && e.parent();
    } else if (e.firstChild()) {
      u && (s = "");
      do
        if (!(e.to <= t)) {
          if (e.from >= i)
            break;
          this.highlightRange(e, t, i, s, r), this.startSpan(Math.min(i, e.to), h);
        }
      while (e.nextSibling());
      e.parent();
    }
  }
}
function bm(n) {
  let e = n.type.prop(xc);
  for (; e && e.context && !n.matchContext(e.context); )
    e = e.next;
  return e || null;
}
const v = Se.define, wn = v(), ct = v(), ea = v(ct), ta = v(ct), ft = v(), kn = v(ft), Us = v(ft), Ue = v(), Lt = v(Ue), Je = v(), Qe = v(), zr = v(), mi = v(zr), Sn = v(), x = {
  /**
  A comment.
  */
  comment: wn,
  /**
  A line [comment](#highlight.tags.comment).
  */
  lineComment: v(wn),
  /**
  A block [comment](#highlight.tags.comment).
  */
  blockComment: v(wn),
  /**
  A documentation [comment](#highlight.tags.comment).
  */
  docComment: v(wn),
  /**
  Any kind of identifier.
  */
  name: ct,
  /**
  The [name](#highlight.tags.name) of a variable.
  */
  variableName: v(ct),
  /**
  A type [name](#highlight.tags.name).
  */
  typeName: ea,
  /**
  A tag name (subtag of [`typeName`](#highlight.tags.typeName)).
  */
  tagName: v(ea),
  /**
  A property or field [name](#highlight.tags.name).
  */
  propertyName: ta,
  /**
  An attribute name (subtag of [`propertyName`](#highlight.tags.propertyName)).
  */
  attributeName: v(ta),
  /**
  The [name](#highlight.tags.name) of a class.
  */
  className: v(ct),
  /**
  A label [name](#highlight.tags.name).
  */
  labelName: v(ct),
  /**
  A namespace [name](#highlight.tags.name).
  */
  namespace: v(ct),
  /**
  The [name](#highlight.tags.name) of a macro.
  */
  macroName: v(ct),
  /**
  A literal value.
  */
  literal: ft,
  /**
  A string [literal](#highlight.tags.literal).
  */
  string: kn,
  /**
  A documentation [string](#highlight.tags.string).
  */
  docString: v(kn),
  /**
  A character literal (subtag of [string](#highlight.tags.string)).
  */
  character: v(kn),
  /**
  An attribute value (subtag of [string](#highlight.tags.string)).
  */
  attributeValue: v(kn),
  /**
  A number [literal](#highlight.tags.literal).
  */
  number: Us,
  /**
  An integer [number](#highlight.tags.number) literal.
  */
  integer: v(Us),
  /**
  A floating-point [number](#highlight.tags.number) literal.
  */
  float: v(Us),
  /**
  A boolean [literal](#highlight.tags.literal).
  */
  bool: v(ft),
  /**
  Regular expression [literal](#highlight.tags.literal).
  */
  regexp: v(ft),
  /**
  An escape [literal](#highlight.tags.literal), for example a
  backslash escape in a string.
  */
  escape: v(ft),
  /**
  A color [literal](#highlight.tags.literal).
  */
  color: v(ft),
  /**
  A URL [literal](#highlight.tags.literal).
  */
  url: v(ft),
  /**
  A language keyword.
  */
  keyword: Je,
  /**
  The [keyword](#highlight.tags.keyword) for the self or this
  object.
  */
  self: v(Je),
  /**
  The [keyword](#highlight.tags.keyword) for null.
  */
  null: v(Je),
  /**
  A [keyword](#highlight.tags.keyword) denoting some atomic value.
  */
  atom: v(Je),
  /**
  A [keyword](#highlight.tags.keyword) that represents a unit.
  */
  unit: v(Je),
  /**
  A modifier [keyword](#highlight.tags.keyword).
  */
  modifier: v(Je),
  /**
  A [keyword](#highlight.tags.keyword) that acts as an operator.
  */
  operatorKeyword: v(Je),
  /**
  A control-flow related [keyword](#highlight.tags.keyword).
  */
  controlKeyword: v(Je),
  /**
  A [keyword](#highlight.tags.keyword) that defines something.
  */
  definitionKeyword: v(Je),
  /**
  A [keyword](#highlight.tags.keyword) related to defining or
  interfacing with modules.
  */
  moduleKeyword: v(Je),
  /**
  An operator.
  */
  operator: Qe,
  /**
  An [operator](#highlight.tags.operator) that dereferences something.
  */
  derefOperator: v(Qe),
  /**
  Arithmetic-related [operator](#highlight.tags.operator).
  */
  arithmeticOperator: v(Qe),
  /**
  Logical [operator](#highlight.tags.operator).
  */
  logicOperator: v(Qe),
  /**
  Bit [operator](#highlight.tags.operator).
  */
  bitwiseOperator: v(Qe),
  /**
  Comparison [operator](#highlight.tags.operator).
  */
  compareOperator: v(Qe),
  /**
  [Operator](#highlight.tags.operator) that updates its operand.
  */
  updateOperator: v(Qe),
  /**
  [Operator](#highlight.tags.operator) that defines something.
  */
  definitionOperator: v(Qe),
  /**
  Type-related [operator](#highlight.tags.operator).
  */
  typeOperator: v(Qe),
  /**
  Control-flow [operator](#highlight.tags.operator).
  */
  controlOperator: v(Qe),
  /**
  Program or markup punctuation.
  */
  punctuation: zr,
  /**
  [Punctuation](#highlight.tags.punctuation) that separates
  things.
  */
  separator: v(zr),
  /**
  Bracket-style [punctuation](#highlight.tags.punctuation).
  */
  bracket: mi,
  /**
  Angle [brackets](#highlight.tags.bracket) (usually `<` and `>`
  tokens).
  */
  angleBracket: v(mi),
  /**
  Square [brackets](#highlight.tags.bracket) (usually `[` and `]`
  tokens).
  */
  squareBracket: v(mi),
  /**
  Parentheses (usually `(` and `)` tokens). Subtag of
  [bracket](#highlight.tags.bracket).
  */
  paren: v(mi),
  /**
  Braces (usually `{` and `}` tokens). Subtag of
  [bracket](#highlight.tags.bracket).
  */
  brace: v(mi),
  /**
  Content, for example plain text in XML or markup documents.
  */
  content: Ue,
  /**
  [Content](#highlight.tags.content) that represents a heading.
  */
  heading: Lt,
  /**
  A level 1 [heading](#highlight.tags.heading).
  */
  heading1: v(Lt),
  /**
  A level 2 [heading](#highlight.tags.heading).
  */
  heading2: v(Lt),
  /**
  A level 3 [heading](#highlight.tags.heading).
  */
  heading3: v(Lt),
  /**
  A level 4 [heading](#highlight.tags.heading).
  */
  heading4: v(Lt),
  /**
  A level 5 [heading](#highlight.tags.heading).
  */
  heading5: v(Lt),
  /**
  A level 6 [heading](#highlight.tags.heading).
  */
  heading6: v(Lt),
  /**
  A prose separator (such as a horizontal rule).
  */
  contentSeparator: v(Ue),
  /**
  [Content](#highlight.tags.content) that represents a list.
  */
  list: v(Ue),
  /**
  [Content](#highlight.tags.content) that represents a quote.
  */
  quote: v(Ue),
  /**
  [Content](#highlight.tags.content) that is emphasized.
  */
  emphasis: v(Ue),
  /**
  [Content](#highlight.tags.content) that is styled strong.
  */
  strong: v(Ue),
  /**
  [Content](#highlight.tags.content) that is part of a link.
  */
  link: v(Ue),
  /**
  [Content](#highlight.tags.content) that is styled as code or
  monospace.
  */
  monospace: v(Ue),
  /**
  [Content](#highlight.tags.content) that has a strike-through
  style.
  */
  strikethrough: v(Ue),
  /**
  Inserted text in a change-tracking format.
  */
  inserted: v(),
  /**
  Deleted text.
  */
  deleted: v(),
  /**
  Changed text.
  */
  changed: v(),
  /**
  An invalid or unsyntactic element.
  */
  invalid: v(),
  /**
  Metadata or meta-instruction.
  */
  meta: Sn,
  /**
  [Metadata](#highlight.tags.meta) that applies to the entire
  document.
  */
  documentMeta: v(Sn),
  /**
  [Metadata](#highlight.tags.meta) that annotates or adds
  attributes to a given syntactic element.
  */
  annotation: v(Sn),
  /**
  Processing instruction or preprocessor directive. Subtag of
  [meta](#highlight.tags.meta).
  */
  processingInstruction: v(Sn),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates that a
  given element is being defined. Expected to be used with the
  various [name](#highlight.tags.name) tags.
  */
  definition: Se.defineModifier(),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates that
  something is constant. Mostly expected to be used with
  [variable names](#highlight.tags.variableName).
  */
  constant: Se.defineModifier(),
  /**
  [Modifier](#highlight.Tag^defineModifier) used to indicate that
  a [variable](#highlight.tags.variableName) or [property
  name](#highlight.tags.propertyName) is being called or defined
  as a function.
  */
  function: Se.defineModifier(),
  /**
  [Modifier](#highlight.Tag^defineModifier) that can be applied to
  [names](#highlight.tags.name) to indicate that they belong to
  the language's standard environment.
  */
  standard: Se.defineModifier(),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates a given
  [names](#highlight.tags.name) is local to some scope.
  */
  local: Se.defineModifier(),
  /**
  A generic variant [modifier](#highlight.Tag^defineModifier) that
  can be used to tag language-specific alternative variants of
  some common tag. It is recommended for themes to define special
  forms of at least the [string](#highlight.tags.string) and
  [variable name](#highlight.tags.variableName) tags, since those
  come up a lot.
  */
  special: Se.defineModifier()
};
wc([
  { tag: x.link, class: "tok-link" },
  { tag: x.heading, class: "tok-heading" },
  { tag: x.emphasis, class: "tok-emphasis" },
  { tag: x.strong, class: "tok-strong" },
  { tag: x.keyword, class: "tok-keyword" },
  { tag: x.atom, class: "tok-atom" },
  { tag: x.bool, class: "tok-bool" },
  { tag: x.url, class: "tok-url" },
  { tag: x.labelName, class: "tok-labelName" },
  { tag: x.inserted, class: "tok-inserted" },
  { tag: x.deleted, class: "tok-deleted" },
  { tag: x.literal, class: "tok-literal" },
  { tag: x.string, class: "tok-string" },
  { tag: x.number, class: "tok-number" },
  { tag: [x.regexp, x.escape, x.special(x.string)], class: "tok-string2" },
  { tag: x.variableName, class: "tok-variableName" },
  { tag: x.local(x.variableName), class: "tok-variableName tok-local" },
  { tag: x.definition(x.variableName), class: "tok-variableName tok-definition" },
  { tag: x.special(x.variableName), class: "tok-variableName2" },
  { tag: x.definition(x.propertyName), class: "tok-propertyName tok-definition" },
  { tag: x.typeName, class: "tok-typeName" },
  { tag: x.namespace, class: "tok-namespace" },
  { tag: x.className, class: "tok-className" },
  { tag: x.macroName, class: "tok-macroName" },
  { tag: x.propertyName, class: "tok-propertyName" },
  { tag: x.operator, class: "tok-operator" },
  { tag: x.comment, class: "tok-comment" },
  { tag: x.meta, class: "tok-meta" },
  { tag: x.invalid, class: "tok-invalid" },
  { tag: x.punctuation, class: "tok-punctuation" }
]);
var $s;
const Ut = /* @__PURE__ */ new V();
function ym(n) {
  return M.define({
    combine: n ? (e) => e.concat(n) : void 0
  });
}
const xm = /* @__PURE__ */ new V();
class Ge {
  /**
  Construct a language object. If you need to invoke this
  directly, first define a data facet with
  [`defineLanguageFacet`](https://codemirror.net/6/docs/ref/#language.defineLanguageFacet), and then
  configure your parser to [attach](https://codemirror.net/6/docs/ref/#language.languageDataProp) it
  to the language's outer syntax node.
  */
  constructor(e, t, i = [], s = "") {
    this.data = e, this.name = s, G.prototype.hasOwnProperty("tree") || Object.defineProperty(G.prototype, "tree", { get() {
      return pe(this);
    } }), this.parser = t, this.extension = [
      Ot.of(this),
      G.languageData.of((r, o, l) => {
        let a = ia(r, o, l), h = a.type.prop(Ut);
        if (!h)
          return [];
        let c = r.facet(h), f = a.type.prop(xm);
        if (f) {
          let u = a.resolve(o - a.from, l);
          for (let d of f)
            if (d.test(u, r)) {
              let p = r.facet(d.facet);
              return d.type == "replace" ? p : p.concat(c);
            }
        }
        return c;
      })
    ].concat(i);
  }
  /**
  Query whether this language is active at the given position.
  */
  isActiveAt(e, t, i = -1) {
    return ia(e, t, i).type.prop(Ut) == this.data;
  }
  /**
  Find the document regions that were parsed using this language.
  The returned regions will _include_ any nested languages rooted
  in this language, when those exist.
  */
  findRegions(e) {
    let t = e.facet(Ot);
    if ((t == null ? void 0 : t.data) == this.data)
      return [{ from: 0, to: e.doc.length }];
    if (!t || !t.allowsNesting)
      return [];
    let i = [], s = (r, o) => {
      if (r.prop(Ut) == this.data) {
        i.push({ from: o, to: o + r.length });
        return;
      }
      let l = r.prop(V.mounted);
      if (l) {
        if (l.tree.prop(Ut) == this.data) {
          if (l.overlay)
            for (let a of l.overlay)
              i.push({ from: a.from + o, to: a.to + o });
          else
            i.push({ from: o, to: o + r.length });
          return;
        } else if (l.overlay) {
          let a = i.length;
          if (s(l.tree, l.overlay[0].from + o), i.length > a)
            return;
        }
      }
      for (let a = 0; a < r.children.length; a++) {
        let h = r.children[a];
        h instanceof j && s(h, r.positions[a] + o);
      }
    };
    return s(pe(e), 0), i;
  }
  /**
  Indicates whether this language allows nested languages. The
  default implementation returns true.
  */
  get allowsNesting() {
    return !0;
  }
}
Ge.setState = /* @__PURE__ */ L.define();
function ia(n, e, t) {
  let i = n.facet(Ot), s = pe(n).topNode;
  if (!i || i.allowsNesting)
    for (let r = s; r; r = r.enter(e, t, re.ExcludeBuffers))
      r.type.isTop && (s = r);
  return s;
}
class oi extends Ge {
  constructor(e, t, i) {
    super(e, t, [], i), this.parser = t;
  }
  /**
  Define a language from a parser.
  */
  static define(e) {
    let t = ym(e.languageData);
    return new oi(t, e.parser.configure({
      props: [Ut.add((i) => i.isTop ? t : void 0)]
    }), e.name);
  }
  /**
  Create a new instance of this language with a reconfigured
  version of its parser and optionally a new name.
  */
  configure(e, t) {
    return new oi(this.data, this.parser.configure(e), t || this.name);
  }
  get allowsNesting() {
    return this.parser.hasWrappers();
  }
}
function pe(n) {
  let e = n.field(Ge.state, !1);
  return e ? e.tree : j.empty;
}
class wm {
  /**
  Create an input object for the given document.
  */
  constructor(e) {
    this.doc = e, this.cursorPos = 0, this.string = "", this.cursor = e.iter();
  }
  get length() {
    return this.doc.length;
  }
  syncTo(e) {
    return this.string = this.cursor.next(e - this.cursorPos).value, this.cursorPos = e + this.string.length, this.cursorPos - this.string.length;
  }
  chunk(e) {
    return this.syncTo(e), this.string;
  }
  get lineChunks() {
    return !0;
  }
  read(e, t) {
    let i = this.cursorPos - this.string.length;
    return e < i || t >= this.cursorPos ? this.doc.sliceString(e, t) : this.string.slice(e - i, t - i);
  }
}
let gi = null;
class ts {
  constructor(e, t, i = [], s, r, o, l, a) {
    this.parser = e, this.state = t, this.fragments = i, this.tree = s, this.treeLen = r, this.viewport = o, this.skipped = l, this.scheduleOn = a, this.parse = null, this.tempSkipped = [];
  }
  /**
  @internal
  */
  static create(e, t, i) {
    return new ts(e, t, [], j.empty, 0, i, [], null);
  }
  startParse() {
    return this.parser.startParse(new wm(this.state.doc), this.fragments);
  }
  /**
  @internal
  */
  work(e, t) {
    return t != null && t >= this.state.doc.length && (t = void 0), this.tree != j.empty && this.isDone(t ?? this.state.doc.length) ? (this.takeTree(), !0) : this.withContext(() => {
      var i;
      if (typeof e == "number") {
        let s = Date.now() + e;
        e = () => Date.now() > s;
      }
      for (this.parse || (this.parse = this.startParse()), t != null && (this.parse.stoppedAt == null || this.parse.stoppedAt > t) && t < this.state.doc.length && this.parse.stopAt(t); ; ) {
        let s = this.parse.advance();
        if (s)
          if (this.fragments = this.withoutTempSkipped(Wt.addTree(s, this.fragments, this.parse.stoppedAt != null)), this.treeLen = (i = this.parse.stoppedAt) !== null && i !== void 0 ? i : this.state.doc.length, this.tree = s, this.parse = null, this.treeLen < (t ?? this.state.doc.length))
            this.parse = this.startParse();
          else
            return !0;
        if (e())
          return !1;
      }
    });
  }
  /**
  @internal
  */
  takeTree() {
    let e, t;
    this.parse && (e = this.parse.parsedPos) >= this.treeLen && ((this.parse.stoppedAt == null || this.parse.stoppedAt > e) && this.parse.stopAt(e), this.withContext(() => {
      for (; !(t = this.parse.advance()); )
        ;
    }), this.treeLen = e, this.tree = t, this.fragments = this.withoutTempSkipped(Wt.addTree(this.tree, this.fragments, !0)), this.parse = null);
  }
  withContext(e) {
    let t = gi;
    gi = this;
    try {
      return e();
    } finally {
      gi = t;
    }
  }
  withoutTempSkipped(e) {
    for (let t; t = this.tempSkipped.pop(); )
      e = na(e, t.from, t.to);
    return e;
  }
  /**
  @internal
  */
  changes(e, t) {
    let { fragments: i, tree: s, treeLen: r, viewport: o, skipped: l } = this;
    if (this.takeTree(), !e.empty) {
      let a = [];
      if (e.iterChangedRanges((h, c, f, u) => a.push({ fromA: h, toA: c, fromB: f, toB: u })), i = Wt.applyChanges(i, a), s = j.empty, r = 0, o = { from: e.mapPos(o.from, -1), to: e.mapPos(o.to, 1) }, this.skipped.length) {
        l = [];
        for (let h of this.skipped) {
          let c = e.mapPos(h.from, 1), f = e.mapPos(h.to, -1);
          c < f && l.push({ from: c, to: f });
        }
      }
    }
    return new ts(this.parser, t, i, s, r, o, l, this.scheduleOn);
  }
  /**
  @internal
  */
  updateViewport(e) {
    if (this.viewport.from == e.from && this.viewport.to == e.to)
      return !1;
    this.viewport = e;
    let t = this.skipped.length;
    for (let i = 0; i < this.skipped.length; i++) {
      let { from: s, to: r } = this.skipped[i];
      s < e.to && r > e.from && (this.fragments = na(this.fragments, s, r), this.skipped.splice(i--, 1));
    }
    return this.skipped.length >= t ? !1 : (this.reset(), !0);
  }
  /**
  @internal
  */
  reset() {
    this.parse && (this.takeTree(), this.parse = null);
  }
  /**
  Notify the parse scheduler that the given region was skipped
  because it wasn't in view, and the parse should be restarted
  when it comes into view.
  */
  skipUntilInView(e, t) {
    this.skipped.push({ from: e, to: t });
  }
  /**
  Returns a parser intended to be used as placeholder when
  asynchronously loading a nested parser. It'll skip its input and
  mark it as not-really-parsed, so that the next update will parse
  it again.
  
  When `until` is given, a reparse will be scheduled when that
  promise resolves.
  */
  static getSkippingParser(e) {
    return new class extends Ja {
      createParse(t, i, s) {
        let r = s[0].from, o = s[s.length - 1].to;
        return {
          parsedPos: r,
          advance() {
            let a = gi;
            if (a) {
              for (let h of s)
                a.tempSkipped.push(h);
              e && (a.scheduleOn = a.scheduleOn ? Promise.all([a.scheduleOn, e]) : e);
            }
            return this.parsedPos = o, new j(Ae.none, [], [], o - r);
          },
          stoppedAt: null,
          stopAt() {
          }
        };
      }
    }();
  }
  /**
  @internal
  */
  isDone(e) {
    e = Math.min(e, this.state.doc.length);
    let t = this.fragments;
    return this.treeLen >= e && t.length && t[0].from == 0 && t[0].to >= e;
  }
  /**
  Get the context for the current parse, or `null` if no editor
  parse is in progress.
  */
  static get() {
    return gi;
  }
}
function na(n, e, t) {
  return Wt.applyChanges(n, [{ fromA: e, toA: t, fromB: e, toB: t }]);
}
class li {
  constructor(e) {
    this.context = e, this.tree = e.tree;
  }
  apply(e) {
    if (!e.docChanged && this.tree == this.context.tree)
      return this;
    let t = this.context.changes(e.changes, e.state), i = this.context.treeLen == e.startState.doc.length ? void 0 : Math.max(e.changes.mapPos(this.context.treeLen), t.viewport.to);
    return t.work(20, i) || t.takeTree(), new li(t);
  }
  static init(e) {
    let t = Math.min(3e3, e.doc.length), i = ts.create(e.facet(Ot).parser, e, { from: 0, to: t });
    return i.work(20, t) || i.takeTree(), new li(i);
  }
}
Ge.state = /* @__PURE__ */ ee.define({
  create: li.init,
  update(n, e) {
    for (let t of e.effects)
      if (t.is(Ge.setState))
        return t.value;
    return e.startState.facet(Ot) != e.state.facet(Ot) ? li.init(e.state) : n.apply(e);
  }
});
let kc = (n) => {
  let e = setTimeout(
    () => n(),
    500
    /* Work.MaxPause */
  );
  return () => clearTimeout(e);
};
typeof requestIdleCallback < "u" && (kc = (n) => {
  let e = -1, t = setTimeout(
    () => {
      e = requestIdleCallback(n, {
        timeout: 500 - 100
        /* Work.MinPause */
      });
    },
    100
    /* Work.MinPause */
  );
  return () => e < 0 ? clearTimeout(t) : cancelIdleCallback(e);
});
const js = typeof navigator < "u" && (!(($s = navigator.scheduling) === null || $s === void 0) && $s.isInputPending) ? () => navigator.scheduling.isInputPending() : null, km = /* @__PURE__ */ _.fromClass(class {
  constructor(e) {
    this.view = e, this.working = null, this.workScheduled = 0, this.chunkEnd = -1, this.chunkBudget = -1, this.work = this.work.bind(this), this.scheduleWork();
  }
  update(e) {
    let t = this.view.state.field(Ge.state).context;
    (t.updateViewport(e.view.viewport) || this.view.viewport.to > t.treeLen) && this.scheduleWork(), (e.docChanged || e.selectionSet) && (this.view.hasFocus && (this.chunkBudget += 50), this.scheduleWork()), this.checkAsyncSchedule(t);
  }
  scheduleWork() {
    if (this.working)
      return;
    let { state: e } = this.view, t = e.field(Ge.state);
    (t.tree != t.context.tree || !t.context.isDone(e.doc.length)) && (this.working = kc(this.work));
  }
  work(e) {
    this.working = null;
    let t = Date.now();
    if (this.chunkEnd < t && (this.chunkEnd < 0 || this.view.hasFocus) && (this.chunkEnd = t + 3e4, this.chunkBudget = 3e3), this.chunkBudget <= 0)
      return;
    let { state: i, viewport: { to: s } } = this.view, r = i.field(Ge.state);
    if (r.tree == r.context.tree && r.context.isDone(
      s + 1e5
      /* Work.MaxParseAhead */
    ))
      return;
    let o = Date.now() + Math.min(this.chunkBudget, 100, e && !js ? Math.max(25, e.timeRemaining() - 5) : 1e9), l = r.context.treeLen < s && i.doc.length > s + 1e3, a = r.context.work(() => js && js() || Date.now() > o, s + (l ? 0 : 1e5));
    this.chunkBudget -= Date.now() - t, (a || this.chunkBudget <= 0) && (r.context.takeTree(), this.view.dispatch({ effects: Ge.setState.of(new li(r.context)) })), this.chunkBudget > 0 && !(a && !l) && this.scheduleWork(), this.checkAsyncSchedule(r.context);
  }
  checkAsyncSchedule(e) {
    e.scheduleOn && (this.workScheduled++, e.scheduleOn.then(() => this.scheduleWork()).catch((t) => Pe(this.view.state, t)).then(() => this.workScheduled--), e.scheduleOn = null);
  }
  destroy() {
    this.working && this.working();
  }
  isWorking() {
    return !!(this.working || this.workScheduled > 0);
  }
}, {
  eventHandlers: { focus() {
    this.scheduleWork();
  } }
}), Ot = /* @__PURE__ */ M.define({
  combine(n) {
    return n.length ? n[0] : null;
  },
  enables: (n) => [
    Ge.state,
    km,
    Z.contentAttributes.compute([n], (e) => {
      let t = e.facet(n);
      return t && t.name ? { "data-language": t.name } : {};
    })
  ]
});
class ko {
  /**
  Create a language support object.
  */
  constructor(e, t = []) {
    this.language = e, this.support = t, this.extension = [e, t];
  }
}
const Sm = /* @__PURE__ */ M.define(), So = /* @__PURE__ */ M.define({
  combine: (n) => {
    if (!n.length)
      return "  ";
    let e = n[0];
    if (!e || /\S/.test(e) || Array.from(e).some((t) => t != e[0]))
      throw new Error("Invalid indent unit: " + JSON.stringify(n[0]));
    return e;
  }
});
function is(n) {
  let e = n.facet(So);
  return e.charCodeAt(0) == 9 ? n.tabSize * e.length : e.length;
}
function Gi(n, e) {
  let t = "", i = n.tabSize, s = n.facet(So)[0];
  if (s == "	") {
    for (; e >= i; )
      t += "	", e -= i;
    s = " ";
  }
  for (let r = 0; r < e; r++)
    t += s;
  return t;
}
function vo(n, e) {
  n instanceof G && (n = new vs(n));
  for (let i of n.state.facet(Sm)) {
    let s = i(n, e);
    if (s !== void 0)
      return s;
  }
  let t = pe(n.state);
  return t.length >= e ? vm(n, t, e) : null;
}
class vs {
  /**
  Create an indent context.
  */
  constructor(e, t = {}) {
    this.state = e, this.options = t, this.unit = is(e);
  }
  /**
  Get a description of the line at the given position, taking
  [simulated line
  breaks](https://codemirror.net/6/docs/ref/#language.IndentContext.constructor^options.simulateBreak)
  into account. If there is such a break at `pos`, the `bias`
  argument determines whether the part of the line line before or
  after the break is used.
  */
  lineAt(e, t = 1) {
    let i = this.state.doc.lineAt(e), { simulateBreak: s, simulateDoubleBreak: r } = this.options;
    return s != null && s >= i.from && s <= i.to ? r && s == e ? { text: "", from: e } : (t < 0 ? s < e : s <= e) ? { text: i.text.slice(s - i.from), from: s } : { text: i.text.slice(0, s - i.from), from: i.from } : i;
  }
  /**
  Get the text directly after `pos`, either the entire line
  or the next 100 characters, whichever is shorter.
  */
  textAfterPos(e, t = 1) {
    if (this.options.simulateDoubleBreak && e == this.options.simulateBreak)
      return "";
    let { text: i, from: s } = this.lineAt(e, t);
    return i.slice(e - s, Math.min(i.length, e + 100 - s));
  }
  /**
  Find the column for the given position.
  */
  column(e, t = 1) {
    let { text: i, from: s } = this.lineAt(e, t), r = this.countColumn(i, e - s), o = this.options.overrideIndentation ? this.options.overrideIndentation(s) : -1;
    return o > -1 && (r += o - this.countColumn(i, i.search(/\S|$/))), r;
  }
  /**
  Find the column position (taking tabs into account) of the given
  position in the given string.
  */
  countColumn(e, t = e.length) {
    return Ji(e, this.state.tabSize, t);
  }
  /**
  Find the indentation column of the line at the given point.
  */
  lineIndent(e, t = 1) {
    let { text: i, from: s } = this.lineAt(e, t), r = this.options.overrideIndentation;
    if (r) {
      let o = r(s);
      if (o > -1)
        return o;
    }
    return this.countColumn(i, i.search(/\S|$/));
  }
  /**
  Returns the [simulated line
  break](https://codemirror.net/6/docs/ref/#language.IndentContext.constructor^options.simulateBreak)
  for this context, if any.
  */
  get simulatedBreak() {
    return this.options.simulateBreak || null;
  }
}
const Sc = /* @__PURE__ */ new V();
function vm(n, e, t) {
  let i = e.resolveStack(t), s = i.node.enterUnfinishedNodesBefore(t);
  if (s != i.node) {
    let r = [];
    for (let o = s; o != i.node; o = o.parent)
      r.push(o);
    for (let o = r.length - 1; o >= 0; o--)
      i = { node: r[o], next: i };
  }
  return vc(i, n, t);
}
function vc(n, e, t) {
  for (let i = n; i; i = i.next) {
    let s = Om(i.node);
    if (s)
      return s(Co.create(e, t, i));
  }
  return 0;
}
function Cm(n) {
  return n.pos == n.options.simulateBreak && n.options.simulateDoubleBreak;
}
function Om(n) {
  let e = n.type.prop(Sc);
  if (e)
    return e;
  let t = n.firstChild, i;
  if (t && (i = t.type.prop(V.closedBy))) {
    let s = n.lastChild, r = s && i.indexOf(s.name) > -1;
    return (o) => Zm(o, !0, 1, void 0, r && !Cm(o) ? s.from : void 0);
  }
  return n.parent == null ? Am : null;
}
function Am() {
  return 0;
}
class Co extends vs {
  constructor(e, t, i) {
    super(e.state, e.options), this.base = e, this.pos = t, this.context = i;
  }
  /**
  The syntax tree node to which the indentation strategy
  applies.
  */
  get node() {
    return this.context.node;
  }
  /**
  @internal
  */
  static create(e, t, i) {
    return new Co(e, t, i);
  }
  /**
  Get the text directly after `this.pos`, either the entire line
  or the next 100 characters, whichever is shorter.
  */
  get textAfter() {
    return this.textAfterPos(this.pos);
  }
  /**
  Get the indentation at the reference line for `this.node`, which
  is the line on which it starts, unless there is a node that is
  _not_ a parent of this node covering the start of that line. If
  so, the line at the start of that node is tried, again skipping
  on if it is covered by another such node.
  */
  get baseIndent() {
    return this.baseIndentFor(this.node);
  }
  /**
  Get the indentation for the reference line of the given node
  (see [`baseIndent`](https://codemirror.net/6/docs/ref/#language.TreeIndentContext.baseIndent)).
  */
  baseIndentFor(e) {
    let t = this.state.doc.lineAt(e.from);
    for (; ; ) {
      let i = e.resolve(t.from);
      for (; i.parent && i.parent.from == i.from; )
        i = i.parent;
      if (Mm(i, e))
        break;
      t = this.state.doc.lineAt(i.from);
    }
    return this.lineIndent(t.from);
  }
  /**
  Continue looking for indentations in the node's parent nodes,
  and return the result of that.
  */
  continue() {
    return vc(this.context.next, this.base, this.pos);
  }
}
function Mm(n, e) {
  for (let t = e; t; t = t.parent)
    if (n == t)
      return !0;
  return !1;
}
function Rm(n) {
  let e = n.node, t = e.childAfter(e.from), i = e.lastChild;
  if (!t)
    return null;
  let s = n.options.simulateBreak, r = n.state.doc.lineAt(t.from), o = s == null || s <= r.from ? r.to : Math.min(r.to, s);
  for (let l = t.to; ; ) {
    let a = e.childAfter(l);
    if (!a || a == i)
      return null;
    if (!a.type.isSkipped)
      return a.from < o ? t : null;
    l = a.to;
  }
}
function Zm(n, e, t, i, s) {
  let r = n.textAfter, o = r.match(/^\s*/)[0].length, l = i && r.slice(o, o + i.length) == i || s == n.pos + o, a = e ? Rm(n) : null;
  return a ? l ? n.column(a.from) : n.column(a.to) : n.baseIndent + (l ? 0 : n.unit * t);
}
const Lm = 200;
function Tm() {
  return G.transactionFilter.of((n) => {
    if (!n.docChanged || !n.isUserEvent("input.type") && !n.isUserEvent("input.complete"))
      return n;
    let e = n.startState.languageDataAt("indentOnInput", n.startState.selection.main.head);
    if (!e.length)
      return n;
    let t = n.newDoc, { head: i } = n.newSelection.main, s = t.lineAt(i);
    if (i > s.from + Lm)
      return n;
    let r = t.sliceString(s.from, i);
    if (!e.some((h) => h.test(r)))
      return n;
    let { state: o } = n, l = -1, a = [];
    for (let { head: h } of o.selection.ranges) {
      let c = o.doc.lineAt(h);
      if (c.from == l)
        continue;
      l = c.from;
      let f = vo(o, c.from);
      if (f == null)
        continue;
      let u = /^\s*/.exec(c.text)[0], d = Gi(o, f);
      u != d && a.push({ from: c.from, to: c.from + u.length, insert: d });
    }
    return a.length ? [n, { changes: a, sequential: !0 }] : n;
  });
}
const Dm = /* @__PURE__ */ M.define(), Cc = /* @__PURE__ */ new V();
function Pm(n) {
  let e = n.firstChild, t = n.lastChild;
  return e && e.to < t.from ? { from: e.to, to: t.type.isError ? n.to : t.from } : null;
}
function Vm(n, e, t) {
  let i = pe(n);
  if (i.length < t)
    return null;
  let s = i.resolveStack(t, 1), r = null;
  for (let o = s; o; o = o.next) {
    let l = o.node;
    if (l.to <= t || l.from > t)
      continue;
    if (r && l.from < e)
      break;
    let a = l.type.prop(Cc);
    if (a && (l.to < i.length - 50 || i.length == n.doc.length || !Bm(l))) {
      let h = a(l, n);
      h && h.from <= t && h.from >= e && h.to > t && (r = h);
    }
  }
  return r;
}
function Bm(n) {
  let e = n.lastChild;
  return e && e.to == n.to && e.type.isError;
}
function ns(n, e, t) {
  for (let i of n.facet(Dm)) {
    let s = i(n, e, t);
    if (s)
      return s;
  }
  return Vm(n, e, t);
}
function Oc(n, e) {
  let t = e.mapPos(n.from, 1), i = e.mapPos(n.to, -1);
  return t >= i ? void 0 : { from: t, to: i };
}
const Cs = /* @__PURE__ */ L.define({ map: Oc }), ji = /* @__PURE__ */ L.define({ map: Oc });
function Ac(n) {
  let e = [];
  for (let { head: t } of n.state.selection.ranges)
    e.some((i) => i.from <= t && i.to >= t) || e.push(n.lineBlockAt(t));
  return e;
}
const Nt = /* @__PURE__ */ ee.define({
  create() {
    return T.none;
  },
  update(n, e) {
    n = n.map(e.changes);
    for (let t of e.effects)
      if (t.is(Cs) && !Wm(n, t.value.from, t.value.to)) {
        let { preparePlaceholder: i } = e.state.facet(Oo), s = i ? T.replace({ widget: new Fm(i(e.state, t.value)) }) : sa;
        n = n.update({ add: [s.range(t.value.from, t.value.to)] });
      } else
        t.is(ji) && (n = n.update({
          filter: (i, s) => t.value.from != i || t.value.to != s,
          filterFrom: t.value.from,
          filterTo: t.value.to
        }));
    if (e.selection) {
      let t = !1, { head: i } = e.selection.main;
      n.between(i, i, (s, r) => {
        s < i && r > i && (t = !0);
      }), t && (n = n.update({
        filterFrom: i,
        filterTo: i,
        filter: (s, r) => r <= i || s >= i
      }));
    }
    return n;
  },
  provide: (n) => Z.decorations.from(n),
  toJSON(n, e) {
    let t = [];
    return n.between(0, e.doc.length, (i, s) => {
      t.push(i, s);
    }), t;
  },
  fromJSON(n) {
    if (!Array.isArray(n) || n.length % 2)
      throw new RangeError("Invalid JSON for fold state");
    let e = [];
    for (let t = 0; t < n.length; ) {
      let i = n[t++], s = n[t++];
      if (typeof i != "number" || typeof s != "number")
        throw new RangeError("Invalid JSON for fold state");
      e.push(sa.range(i, s));
    }
    return T.set(e, !0);
  }
});
function ss(n, e, t) {
  var i;
  let s = null;
  return (i = n.field(Nt, !1)) === null || i === void 0 || i.between(e, t, (r, o) => {
    (!s || s.from > r) && (s = { from: r, to: o });
  }), s;
}
function Wm(n, e, t) {
  let i = !1;
  return n.between(e, e, (s, r) => {
    s == e && r == t && (i = !0);
  }), i;
}
function Mc(n, e) {
  return n.field(Nt, !1) ? e : e.concat(L.appendConfig.of(Zc()));
}
const Xm = (n) => {
  for (let e of Ac(n)) {
    let t = ns(n.state, e.from, e.to);
    if (t)
      return n.dispatch({ effects: Mc(n.state, [Cs.of(t), Rc(n, t)]) }), !0;
  }
  return !1;
}, Im = (n) => {
  if (!n.state.field(Nt, !1))
    return !1;
  let e = [];
  for (let t of Ac(n)) {
    let i = ss(n.state, t.from, t.to);
    i && e.push(ji.of(i), Rc(n, i, !1));
  }
  return e.length && n.dispatch({ effects: e }), e.length > 0;
};
function Rc(n, e, t = !0) {
  let i = n.state.doc.lineAt(e.from).number, s = n.state.doc.lineAt(e.to).number;
  return Z.announce.of(`${n.state.phrase(t ? "Folded lines" : "Unfolded lines")} ${i} ${n.state.phrase("to")} ${s}.`);
}
const Em = (n) => {
  let { state: e } = n, t = [];
  for (let i = 0; i < e.doc.length; ) {
    let s = n.lineBlockAt(i), r = ns(e, s.from, s.to);
    r && t.push(Cs.of(r)), i = (r ? n.lineBlockAt(r.to) : s).to + 1;
  }
  return t.length && n.dispatch({ effects: Mc(n.state, t) }), !!t.length;
}, Nm = (n) => {
  let e = n.state.field(Nt, !1);
  if (!e || !e.size)
    return !1;
  let t = [];
  return e.between(0, n.state.doc.length, (i, s) => {
    t.push(ji.of({ from: i, to: s }));
  }), n.dispatch({ effects: t }), !0;
}, Gm = [
  { key: "Ctrl-Shift-[", mac: "Cmd-Alt-[", run: Xm },
  { key: "Ctrl-Shift-]", mac: "Cmd-Alt-]", run: Im },
  { key: "Ctrl-Alt-[", run: Em },
  { key: "Ctrl-Alt-]", run: Nm }
], Hm = {
  placeholderDOM: null,
  preparePlaceholder: null,
  placeholderText: "…"
}, Oo = /* @__PURE__ */ M.define({
  combine(n) {
    return tt(n, Hm);
  }
});
function Zc(n) {
  let e = [Nt, Ym];
  return n && e.push(Oo.of(n)), e;
}
function Lc(n, e) {
  let { state: t } = n, i = t.facet(Oo), s = (o) => {
    let l = n.lineBlockAt(n.posAtDOM(o.target)), a = ss(n.state, l.from, l.to);
    a && n.dispatch({ effects: ji.of(a) }), o.preventDefault();
  };
  if (i.placeholderDOM)
    return i.placeholderDOM(n, s, e);
  let r = document.createElement("span");
  return r.textContent = i.placeholderText, r.setAttribute("aria-label", t.phrase("folded code")), r.title = t.phrase("unfold"), r.className = "cm-foldPlaceholder", r.onclick = s, r;
}
const sa = /* @__PURE__ */ T.replace({ widget: /* @__PURE__ */ new class extends Mt {
  toDOM(n) {
    return Lc(n, null);
  }
}() });
class Fm extends Mt {
  constructor(e) {
    super(), this.value = e;
  }
  eq(e) {
    return this.value == e.value;
  }
  toDOM(e) {
    return Lc(e, this.value);
  }
}
const zm = {
  openText: "⌄",
  closedText: "›",
  markerDOM: null,
  domEventHandlers: {},
  foldingChanged: () => !1
};
class qs extends at {
  constructor(e, t) {
    super(), this.config = e, this.open = t;
  }
  eq(e) {
    return this.config == e.config && this.open == e.open;
  }
  toDOM(e) {
    if (this.config.markerDOM)
      return this.config.markerDOM(this.open);
    let t = document.createElement("span");
    return t.textContent = this.open ? this.config.openText : this.config.closedText, t.title = e.state.phrase(this.open ? "Fold line" : "Unfold line"), t;
  }
}
function Km(n = {}) {
  let e = Object.assign(Object.assign({}, zm), n), t = new qs(e, !0), i = new qs(e, !1), s = _.fromClass(class {
    constructor(o) {
      this.from = o.viewport.from, this.markers = this.buildMarkers(o);
    }
    update(o) {
      (o.docChanged || o.viewportChanged || o.startState.facet(Ot) != o.state.facet(Ot) || o.startState.field(Nt, !1) != o.state.field(Nt, !1) || pe(o.startState) != pe(o.state) || e.foldingChanged(o)) && (this.markers = this.buildMarkers(o.view));
    }
    buildMarkers(o) {
      let l = new kt();
      for (let a of o.viewportLineBlocks) {
        let h = ss(o.state, a.from, a.to) ? i : ns(o.state, a.from, a.to) ? t : null;
        h && l.add(a.from, a.from, h);
      }
      return l.finish();
    }
  }), { domEventHandlers: r } = e;
  return [
    s,
    mc({
      class: "cm-foldGutter",
      markers(o) {
        var l;
        return ((l = o.plugin(s)) === null || l === void 0 ? void 0 : l.markers) || I.empty;
      },
      initialSpacer() {
        return new qs(e, !1);
      },
      domEventHandlers: Object.assign(Object.assign({}, r), { click: (o, l, a) => {
        if (r.click && r.click(o, l, a))
          return !0;
        let h = ss(o.state, l.from, l.to);
        if (h)
          return o.dispatch({ effects: ji.of(h) }), !0;
        let c = ns(o.state, l.from, l.to);
        return c ? (o.dispatch({ effects: Cs.of(c) }), !0) : !1;
      } })
    }),
    Zc()
  ];
}
const Ym = /* @__PURE__ */ Z.baseTheme({
  ".cm-foldPlaceholder": {
    backgroundColor: "#eee",
    border: "1px solid #ddd",
    color: "#888",
    borderRadius: ".2em",
    margin: "0 1px",
    padding: "0 1px",
    cursor: "pointer"
  },
  ".cm-foldGutter span": {
    padding: "0 1px",
    cursor: "pointer"
  }
});
class qi {
  constructor(e, t) {
    this.specs = e;
    let i;
    function s(l) {
      let a = St.newName();
      return (i || (i = /* @__PURE__ */ Object.create(null)))["." + a] = l, a;
    }
    const r = typeof t.all == "string" ? t.all : t.all ? s(t.all) : void 0, o = t.scope;
    this.scope = o instanceof Ge ? (l) => l.prop(Ut) == o.data : o ? (l) => l == o : void 0, this.style = wc(e.map((l) => ({
      tag: l.tag,
      class: l.class || s(Object.assign({}, l, { tag: null }))
    })), {
      all: r
    }).style, this.module = i ? new St(i) : null, this.themeType = t.themeType;
  }
  /**
  Create a highlighter style that associates the given styles to
  the given tags. The specs must be objects that hold a style tag
  or array of tags in their `tag` property, and either a single
  `class` property providing a static CSS class (for highlighter
  that rely on external styling), or a
  [`style-mod`](https://github.com/marijnh/style-mod#documentation)-style
  set of CSS properties (which define the styling for those tags).
  
  The CSS rules created for a highlighter will be emitted in the
  order of the spec's properties. That means that for elements that
  have multiple tags associated with them, styles defined further
  down in the list will have a higher CSS precedence than styles
  defined earlier.
  */
  static define(e, t) {
    return new qi(e, t || {});
  }
}
const Kr = /* @__PURE__ */ M.define(), Tc = /* @__PURE__ */ M.define({
  combine(n) {
    return n.length ? [n[0]] : null;
  }
});
function _s(n) {
  let e = n.facet(Kr);
  return e.length ? e : n.facet(Tc);
}
function Dc(n, e) {
  let t = [Qm], i;
  return n instanceof qi && (n.module && t.push(Z.styleModule.of(n.module)), i = n.themeType), e != null && e.fallback ? t.push(Tc.of(n)) : i ? t.push(Kr.computeN([Z.darkTheme], (s) => s.facet(Z.darkTheme) == (i == "dark") ? [n] : [])) : t.push(Kr.of(n)), t;
}
class Jm {
  constructor(e) {
    this.markCache = /* @__PURE__ */ Object.create(null), this.tree = pe(e.state), this.decorations = this.buildDeco(e, _s(e.state)), this.decoratedTo = e.viewport.to;
  }
  update(e) {
    let t = pe(e.state), i = _s(e.state), s = i != _s(e.startState), { viewport: r } = e.view, o = e.changes.mapPos(this.decoratedTo, 1);
    t.length < r.to && !s && t.type == this.tree.type && o >= r.to ? (this.decorations = this.decorations.map(e.changes), this.decoratedTo = o) : (t != this.tree || e.viewportChanged || s) && (this.tree = t, this.decorations = this.buildDeco(e.view, i), this.decoratedTo = r.to);
  }
  buildDeco(e, t) {
    if (!t || !this.tree.length)
      return T.none;
    let i = new kt();
    for (let { from: s, to: r } of e.visibleRanges)
      mm(this.tree, t, (o, l, a) => {
        i.add(o, l, this.markCache[a] || (this.markCache[a] = T.mark({ class: a })));
      }, s, r);
    return i.finish();
  }
}
const Qm = /* @__PURE__ */ Gt.high(/* @__PURE__ */ _.fromClass(Jm, {
  decorations: (n) => n.decorations
})), Um = /* @__PURE__ */ qi.define([
  {
    tag: x.meta,
    color: "#404740"
  },
  {
    tag: x.link,
    textDecoration: "underline"
  },
  {
    tag: x.heading,
    textDecoration: "underline",
    fontWeight: "bold"
  },
  {
    tag: x.emphasis,
    fontStyle: "italic"
  },
  {
    tag: x.strong,
    fontWeight: "bold"
  },
  {
    tag: x.strikethrough,
    textDecoration: "line-through"
  },
  {
    tag: x.keyword,
    color: "#708"
  },
  {
    tag: [x.atom, x.bool, x.url, x.contentSeparator, x.labelName],
    color: "#219"
  },
  {
    tag: [x.literal, x.inserted],
    color: "#164"
  },
  {
    tag: [x.string, x.deleted],
    color: "#a11"
  },
  {
    tag: [x.regexp, x.escape, /* @__PURE__ */ x.special(x.string)],
    color: "#e40"
  },
  {
    tag: /* @__PURE__ */ x.definition(x.variableName),
    color: "#00f"
  },
  {
    tag: /* @__PURE__ */ x.local(x.variableName),
    color: "#30a"
  },
  {
    tag: [x.typeName, x.namespace],
    color: "#085"
  },
  {
    tag: x.className,
    color: "#167"
  },
  {
    tag: [/* @__PURE__ */ x.special(x.variableName), x.macroName],
    color: "#256"
  },
  {
    tag: /* @__PURE__ */ x.definition(x.propertyName),
    color: "#00c"
  },
  {
    tag: x.comment,
    color: "#940"
  },
  {
    tag: x.invalid,
    color: "#f00"
  }
]), $m = /* @__PURE__ */ Z.baseTheme({
  "&.cm-focused .cm-matchingBracket": { backgroundColor: "#328c8252" },
  "&.cm-focused .cm-nonmatchingBracket": { backgroundColor: "#bb555544" }
}), Pc = 1e4, Vc = "()[]{}", Bc = /* @__PURE__ */ M.define({
  combine(n) {
    return tt(n, {
      afterCursor: !0,
      brackets: Vc,
      maxScanDistance: Pc,
      renderMatch: _m
    });
  }
}), jm = /* @__PURE__ */ T.mark({ class: "cm-matchingBracket" }), qm = /* @__PURE__ */ T.mark({ class: "cm-nonmatchingBracket" });
function _m(n) {
  let e = [], t = n.matched ? jm : qm;
  return e.push(t.range(n.start.from, n.start.to)), n.end && e.push(t.range(n.end.from, n.end.to)), e;
}
const eg = /* @__PURE__ */ ee.define({
  create() {
    return T.none;
  },
  update(n, e) {
    if (!e.docChanged && !e.selection)
      return n;
    let t = [], i = e.state.facet(Bc);
    for (let s of e.state.selection.ranges) {
      if (!s.empty)
        continue;
      let r = qe(e.state, s.head, -1, i) || s.head > 0 && qe(e.state, s.head - 1, 1, i) || i.afterCursor && (qe(e.state, s.head, 1, i) || s.head < e.state.doc.length && qe(e.state, s.head + 1, -1, i));
      r && (t = t.concat(i.renderMatch(r, e.state)));
    }
    return T.set(t, !0);
  },
  provide: (n) => Z.decorations.from(n)
}), tg = [
  eg,
  $m
];
function ig(n = {}) {
  return [Bc.of(n), tg];
}
const ng = /* @__PURE__ */ new V();
function Yr(n, e, t) {
  let i = n.prop(e < 0 ? V.openedBy : V.closedBy);
  if (i)
    return i;
  if (n.name.length == 1) {
    let s = t.indexOf(n.name);
    if (s > -1 && s % 2 == (e < 0 ? 1 : 0))
      return [t[s + e]];
  }
  return null;
}
function Jr(n) {
  let e = n.type.prop(ng);
  return e ? e(n.node) : n;
}
function qe(n, e, t, i = {}) {
  let s = i.maxScanDistance || Pc, r = i.brackets || Vc, o = pe(n), l = o.resolveInner(e, t);
  for (let a = l; a; a = a.parent) {
    let h = Yr(a.type, t, r);
    if (h && a.from < a.to) {
      let c = Jr(a);
      if (c && (t > 0 ? e >= c.from && e < c.to : e > c.from && e <= c.to))
        return sg(n, e, t, a, c, h, r);
    }
  }
  return rg(n, e, t, o, l.type, s, r);
}
function sg(n, e, t, i, s, r, o) {
  let l = i.parent, a = { from: s.from, to: s.to }, h = 0, c = l == null ? void 0 : l.cursor();
  if (c && (t < 0 ? c.childBefore(i.from) : c.childAfter(i.to)))
    do
      if (t < 0 ? c.to <= i.from : c.from >= i.to) {
        if (h == 0 && r.indexOf(c.type.name) > -1 && c.from < c.to) {
          let f = Jr(c);
          return { start: a, end: f ? { from: f.from, to: f.to } : void 0, matched: !0 };
        } else if (Yr(c.type, t, o))
          h++;
        else if (Yr(c.type, -t, o)) {
          if (h == 0) {
            let f = Jr(c);
            return {
              start: a,
              end: f && f.from < f.to ? { from: f.from, to: f.to } : void 0,
              matched: !1
            };
          }
          h--;
        }
      }
    while (t < 0 ? c.prevSibling() : c.nextSibling());
  return { start: a, matched: !1 };
}
function rg(n, e, t, i, s, r, o) {
  let l = t < 0 ? n.sliceDoc(e - 1, e) : n.sliceDoc(e, e + 1), a = o.indexOf(l);
  if (a < 0 || a % 2 == 0 != t > 0)
    return null;
  let h = { from: t < 0 ? e - 1 : e, to: t > 0 ? e + 1 : e }, c = n.doc.iterRange(e, t > 0 ? n.doc.length : 0), f = 0;
  for (let u = 0; !c.next().done && u <= r; ) {
    let d = c.value;
    t < 0 && (u += d.length);
    let p = e + u * t;
    for (let g = t > 0 ? 0 : d.length - 1, m = t > 0 ? d.length : -1; g != m; g += t) {
      let b = o.indexOf(d[g]);
      if (!(b < 0 || i.resolveInner(p + g, 1).type != s))
        if (b % 2 == 0 == t > 0)
          f++;
        else {
          if (f == 1)
            return { start: h, end: { from: p + g, to: p + g + 1 }, matched: b >> 1 == a >> 1 };
          f--;
        }
    }
    t > 0 && (u += d.length);
  }
  return c.done ? { start: h, matched: !1 } : null;
}
const og = /* @__PURE__ */ Object.create(null), ra = [Ae.none], oa = [], la = /* @__PURE__ */ Object.create(null), lg = /* @__PURE__ */ Object.create(null);
for (let [n, e] of [
  ["variable", "variableName"],
  ["variable-2", "variableName.special"],
  ["string-2", "string.special"],
  ["def", "variableName.definition"],
  ["tag", "tagName"],
  ["attribute", "attributeName"],
  ["type", "typeName"],
  ["builtin", "variableName.standard"],
  ["qualifier", "modifier"],
  ["error", "invalid"],
  ["header", "heading"],
  ["property", "propertyName"]
])
  lg[n] = /* @__PURE__ */ ag(og, e);
function er(n, e) {
  oa.indexOf(n) > -1 || (oa.push(n), console.warn(e));
}
function ag(n, e) {
  let t = [];
  for (let l of e.split(" ")) {
    let a = [];
    for (let h of l.split(".")) {
      let c = n[h] || x[h];
      c ? typeof c == "function" ? a.length ? a = a.map(c) : er(h, `Modifier ${h} used at start of tag`) : a.length ? er(h, `Tag ${h} used as modifier`) : a = Array.isArray(c) ? c : [c] : er(h, `Unknown highlighting tag ${h}`);
    }
    for (let h of a)
      t.push(h);
  }
  if (!t.length)
    return 0;
  let i = e.replace(/ /g, "_"), s = i + " " + t.map((l) => l.id), r = la[s];
  if (r)
    return r.id;
  let o = la[s] = Ae.define({
    id: ra.length,
    name: i,
    props: [yc({ [i]: t })]
  });
  return ra.push(o), o.id;
}
J.RTL, J.LTR;
const Wc = Se.define(x.meta), Xc = Se.define(x.typeName), hg = Se.define(x.variableName), Ic = Se.define(x.compareOperator);
let Ao = Lu.configure({
  props: [
    yc({
      Identifier: hg,
      /* literals */
      BooleanLiteral: x.bool,
      StringLiteral: x.string,
      IntLiteral: x.integer,
      /* commends */
      LineComment: x.lineComment,
      /* operators */
      ArithOp: x.arithmeticOperator,
      CmpOp: x.compareOperator,
      /* keywords */
      forall: x.keyword,
      ".": x.keyword,
      let: x.keyword,
      in: x.keyword,
      if: x.keyword,
      then: x.keyword,
      else: x.keyword,
      "=": x.keyword,
      "( )": x.paren,
      Symbol: x.punctuation,
      /* definitions */
      Lambda: x.definitionKeyword,
      LambdaArrow: x.definitionKeyword,
      /* types */
      MetaVar: Wc,
      TypeVar: Xc,
      TypeCon: x.typeName,
      /* constraints */
      constraintOp: Ic
    }),
    Sc.add({
      // TODO (Ben @ 2023/09/12) handle indentatoin
      Application: (n) => n.column(n.node.from) + n.unit
    }),
    Cc.add({
      // TODO (Ben @ 2023/09/12) handle folding
      Application: Pm
    })
  ]
});
const aa = () => new ko(
  oi.define({
    parser: Ao,
    languageData: {
      commentTokens: { line: "--" }
    }
  })
), cg = () => new ko(
  oi.define({
    parser: Ao.configure({ top: "TypeLang" }),
    languageData: {
      commentTokens: { line: "--" }
    }
  })
), fg = () => new ko(
  oi.define({
    parser: Ao.configure({ top: "UnifLang" }),
    languageData: {
      commentTokens: { line: "--" }
    }
  })
), tr = "#4B69C6", ug = qi.define([
  { tag: x.keyword, color: tr, fontWeight: "bold" },
  { tag: x.definitionKeyword, color: "#72009e", fontWeight: "bold" },
  { tag: x.comment, color: "#808080", fontStyle: "italic" },
  { tag: x.punctuation, color: "#444", fontWeight: "bold" },
  // {tag: tagTermVar, color: "#f00", fontStyle: "italic"},
  { tag: x.bool, color: "#088", fontStyle: "italic" },
  { tag: x.string, color: "#080" },
  { tag: x.integer, color: "#99006e" },
  { tag: x.arithmeticOperator, color: tr },
  { tag: x.compareOperator, color: tr },
  /* types */
  { tag: x.typeName, color: "#a85800" },
  { tag: Xc },
  { tag: Wc, color: "#ff00d6" },
  /* constraints */
  { tag: Ic, color: "#a500ff", fontWeight: "bold" }
]), dg = Dc(ug);
function z() {
  var n = arguments[0];
  typeof n == "string" && (n = document.createElement(n));
  var e = 1, t = arguments[1];
  if (t && typeof t == "object" && t.nodeType == null && !Array.isArray(t)) {
    for (var i in t)
      if (Object.prototype.hasOwnProperty.call(t, i)) {
        var s = t[i];
        typeof s == "string" ? n.setAttribute(i, s) : s != null && (n[i] = s);
      }
    e++;
  }
  for (; e < arguments.length; e++)
    Ec(n, arguments[e]);
  return n;
}
function Ec(n, e) {
  if (typeof e == "string")
    n.appendChild(document.createTextNode(e));
  else if (e != null)
    if (e.nodeType != null)
      n.appendChild(e);
    else if (Array.isArray(e))
      for (var t = 0; t < e.length; t++)
        Ec(n, e[t]);
    else
      throw new RangeError("Unsupported child node: " + e);
}
class pg {
  constructor(e, t, i) {
    this.from = e, this.to = t, this.diagnostic = i;
  }
}
class Dt {
  constructor(e, t, i) {
    this.diagnostics = e, this.panel = t, this.selected = i;
  }
  static init(e, t, i) {
    let s = e, r = i.facet(Vt).markerFilter;
    r && (s = r(s, i));
    let o = T.set(s.map((l) => l.from == l.to || l.from == l.to - 1 && i.doc.lineAt(l.from).to == l.from ? T.widget({
      widget: new vg(l),
      diagnostic: l
    }).range(l.from) : T.mark({
      attributes: { class: "cm-lintRange cm-lintRange-" + l.severity + (l.markClass ? " " + l.markClass : "") },
      diagnostic: l,
      inclusive: !0
    }).range(l.from, l.to)), !0);
    return new Dt(o, t, ai(o));
  }
}
function ai(n, e = null, t = 0) {
  let i = null;
  return n.between(t, 1e9, (s, r, { spec: o }) => {
    if (!(e && o.diagnostic != e))
      return i = new pg(s, r, o.diagnostic), !1;
  }), i;
}
function Nc(n, e) {
  let t = n.startState.doc.lineAt(e.pos);
  return !!(n.effects.some((i) => i.is(Os)) || n.changes.touchesRange(t.from, t.to));
}
function Gc(n, e) {
  return n.field(De, !1) ? e : e.concat(L.appendConfig.of(Qc));
}
function mg(n, e) {
  return {
    effects: Gc(n, [Os.of(e)])
  };
}
const Os = /* @__PURE__ */ L.define(), Mo = /* @__PURE__ */ L.define(), Hc = /* @__PURE__ */ L.define(), De = /* @__PURE__ */ ee.define({
  create() {
    return new Dt(T.none, null, null);
  },
  update(n, e) {
    if (e.docChanged) {
      let t = n.diagnostics.map(e.changes), i = null;
      if (n.selected) {
        let s = e.changes.mapPos(n.selected.from, 1);
        i = ai(t, n.selected.diagnostic, s) || ai(t, null, s);
      }
      n = new Dt(t, n.panel, i);
    }
    for (let t of e.effects)
      t.is(Os) ? n = Dt.init(t.value, n.panel, e.state) : t.is(Mo) ? n = new Dt(n.diagnostics, t.value ? As.open : null, n.selected) : t.is(Hc) && (n = new Dt(n.diagnostics, n.panel, t.value));
    return n;
  },
  provide: (n) => [
    Ni.from(n, (e) => e.panel),
    Z.decorations.from(n, (e) => e.diagnostics)
  ]
}), gg = /* @__PURE__ */ T.mark({ class: "cm-lintRange cm-lintRange-active", inclusive: !0 });
function bg(n, e, t) {
  let { diagnostics: i } = n.state.field(De), s = [], r = 2e8, o = 0;
  i.between(e - (t < 0 ? 1 : 0), e + (t > 0 ? 1 : 0), (a, h, { spec: c }) => {
    e >= a && e <= h && (a == h || (e > a || t > 0) && (e < h || t < 0)) && (s.push(c.diagnostic), r = Math.min(a, r), o = Math.max(h, o));
  });
  let l = n.state.facet(Vt).tooltipFilter;
  return l && (s = l(s, n.state)), s.length ? {
    pos: r,
    end: o,
    above: n.state.doc.lineAt(r).to < o,
    create() {
      return { dom: Fc(n, s) };
    }
  } : null;
}
function Fc(n, e) {
  return z("ul", { class: "cm-tooltip-lint" }, e.map((t) => Kc(n, t, !1)));
}
const yg = (n) => {
  let e = n.state.field(De, !1);
  (!e || !e.panel) && n.dispatch({ effects: Gc(n.state, [Mo.of(!0)]) });
  let t = Ei(n, As.open);
  return t && t.dom.querySelector(".cm-panel-lint ul").focus(), !0;
}, ha = (n) => {
  let e = n.state.field(De, !1);
  return !e || !e.panel ? !1 : (n.dispatch({ effects: Mo.of(!1) }), !0);
}, xg = (n) => {
  let e = n.state.field(De, !1);
  if (!e)
    return !1;
  let t = n.state.selection.main, i = e.diagnostics.iter(t.to + 1);
  return !i.value && (i = e.diagnostics.iter(0), !i.value || i.from == t.from && i.to == t.to) ? !1 : (n.dispatch({ selection: { anchor: i.from, head: i.to }, scrollIntoView: !0 }), !0);
}, wg = [
  { key: "Mod-Shift-m", run: yg, preventDefault: !0 },
  { key: "F8", run: xg }
], kg = /* @__PURE__ */ _.fromClass(class {
  constructor(n) {
    this.view = n, this.timeout = -1, this.set = !0;
    let { delay: e } = n.state.facet(Vt);
    this.lintTime = Date.now() + e, this.run = this.run.bind(this), this.timeout = setTimeout(this.run, e);
  }
  run() {
    let n = Date.now();
    if (n < this.lintTime - 10)
      this.timeout = setTimeout(this.run, this.lintTime - n);
    else {
      this.set = !1;
      let { state: e } = this.view, { sources: t } = e.facet(Vt);
      t.length && Promise.all(t.map((i) => Promise.resolve(i(this.view)))).then((i) => {
        let s = i.reduce((r, o) => r.concat(o));
        this.view.state.doc == e.doc && this.view.dispatch(mg(this.view.state, s));
      }, (i) => {
        Pe(this.view.state, i);
      });
    }
  }
  update(n) {
    let e = n.state.facet(Vt);
    (n.docChanged || e != n.startState.facet(Vt) || e.needsRefresh && e.needsRefresh(n)) && (this.lintTime = Date.now() + e.delay, this.set || (this.set = !0, this.timeout = setTimeout(this.run, e.delay)));
  }
  force() {
    this.set && (this.lintTime = Date.now(), this.run());
  }
  destroy() {
    clearTimeout(this.timeout);
  }
}), Vt = /* @__PURE__ */ M.define({
  combine(n) {
    return Object.assign({ sources: n.map((e) => e.source).filter((e) => e != null) }, tt(n.map((e) => e.config), {
      delay: 750,
      markerFilter: null,
      tooltipFilter: null,
      needsRefresh: null
    }, {
      needsRefresh: (e, t) => e ? t ? (i) => e(i) || t(i) : e : t
    }));
  }
});
function Sg(n, e = {}) {
  return [
    Vt.of({ source: n, config: e }),
    kg,
    Qc
  ];
}
function zc(n) {
  let e = [];
  if (n)
    e:
      for (let { name: t } of n) {
        for (let i = 0; i < t.length; i++) {
          let s = t[i];
          if (/[a-zA-Z]/.test(s) && !e.some((r) => r.toLowerCase() == s.toLowerCase())) {
            e.push(s);
            continue e;
          }
        }
        e.push("");
      }
  return e;
}
function Kc(n, e, t) {
  var i;
  let s = t ? zc(e.actions) : [];
  return z("li", { class: "cm-diagnostic cm-diagnostic-" + e.severity }, z("span", { class: "cm-diagnosticText" }, e.renderMessage ? e.renderMessage() : e.message), (i = e.actions) === null || i === void 0 ? void 0 : i.map((r, o) => {
    let l = !1, a = (u) => {
      if (u.preventDefault(), l)
        return;
      l = !0;
      let d = ai(n.state.field(De).diagnostics, e);
      d && r.apply(n, d.from, d.to);
    }, { name: h } = r, c = s[o] ? h.indexOf(s[o]) : -1, f = c < 0 ? h : [
      h.slice(0, c),
      z("u", h.slice(c, c + 1)),
      h.slice(c + 1)
    ];
    return z("button", {
      type: "button",
      class: "cm-diagnosticAction",
      onclick: a,
      onmousedown: a,
      "aria-label": ` Action: ${h}${c < 0 ? "" : ` (access key "${s[o]})"`}.`
    }, f);
  }), e.source && z("div", { class: "cm-diagnosticSource" }, e.source));
}
class vg extends Mt {
  constructor(e) {
    super(), this.diagnostic = e;
  }
  eq(e) {
    return e.diagnostic == this.diagnostic;
  }
  toDOM() {
    return z("span", { class: "cm-lintPoint cm-lintPoint-" + this.diagnostic.severity });
  }
}
class ca {
  constructor(e, t) {
    this.diagnostic = t, this.id = "item_" + Math.floor(Math.random() * 4294967295).toString(16), this.dom = Kc(e, t, !0), this.dom.id = this.id, this.dom.setAttribute("role", "option");
  }
}
class As {
  constructor(e) {
    this.view = e, this.items = [];
    let t = (s) => {
      if (s.keyCode == 27)
        ha(this.view), this.view.focus();
      else if (s.keyCode == 38 || s.keyCode == 33)
        this.moveSelection((this.selectedIndex - 1 + this.items.length) % this.items.length);
      else if (s.keyCode == 40 || s.keyCode == 34)
        this.moveSelection((this.selectedIndex + 1) % this.items.length);
      else if (s.keyCode == 36)
        this.moveSelection(0);
      else if (s.keyCode == 35)
        this.moveSelection(this.items.length - 1);
      else if (s.keyCode == 13)
        this.view.focus();
      else if (s.keyCode >= 65 && s.keyCode <= 90 && this.selectedIndex >= 0) {
        let { diagnostic: r } = this.items[this.selectedIndex], o = zc(r.actions);
        for (let l = 0; l < o.length; l++)
          if (o[l].toUpperCase().charCodeAt(0) == s.keyCode) {
            let a = ai(this.view.state.field(De).diagnostics, r);
            a && r.actions[l].apply(e, a.from, a.to);
          }
      } else
        return;
      s.preventDefault();
    }, i = (s) => {
      for (let r = 0; r < this.items.length; r++)
        this.items[r].dom.contains(s.target) && this.moveSelection(r);
    };
    this.list = z("ul", {
      tabIndex: 0,
      role: "listbox",
      "aria-label": this.view.state.phrase("Diagnostics"),
      onkeydown: t,
      onclick: i
    }), this.dom = z("div", { class: "cm-panel-lint" }, this.list, z("button", {
      type: "button",
      name: "close",
      "aria-label": this.view.state.phrase("close"),
      onclick: () => ha(this.view)
    }, "×")), this.update();
  }
  get selectedIndex() {
    let e = this.view.state.field(De).selected;
    if (!e)
      return -1;
    for (let t = 0; t < this.items.length; t++)
      if (this.items[t].diagnostic == e.diagnostic)
        return t;
    return -1;
  }
  update() {
    let { diagnostics: e, selected: t } = this.view.state.field(De), i = 0, s = !1, r = null;
    for (e.between(0, this.view.state.doc.length, (o, l, { spec: a }) => {
      let h = -1, c;
      for (let f = i; f < this.items.length; f++)
        if (this.items[f].diagnostic == a.diagnostic) {
          h = f;
          break;
        }
      h < 0 ? (c = new ca(this.view, a.diagnostic), this.items.splice(i, 0, c), s = !0) : (c = this.items[h], h > i && (this.items.splice(i, h - i), s = !0)), t && c.diagnostic == t.diagnostic ? c.dom.hasAttribute("aria-selected") || (c.dom.setAttribute("aria-selected", "true"), r = c) : c.dom.hasAttribute("aria-selected") && c.dom.removeAttribute("aria-selected"), i++;
    }); i < this.items.length && !(this.items.length == 1 && this.items[0].diagnostic.from < 0); )
      s = !0, this.items.pop();
    this.items.length == 0 && (this.items.push(new ca(this.view, {
      from: -1,
      to: -1,
      severity: "info",
      message: this.view.state.phrase("No diagnostics")
    })), s = !0), r ? (this.list.setAttribute("aria-activedescendant", r.id), this.view.requestMeasure({
      key: this,
      read: () => ({ sel: r.dom.getBoundingClientRect(), panel: this.list.getBoundingClientRect() }),
      write: ({ sel: o, panel: l }) => {
        let a = l.height / this.list.offsetHeight;
        o.top < l.top ? this.list.scrollTop -= (l.top - o.top) / a : o.bottom > l.bottom && (this.list.scrollTop += (o.bottom - l.bottom) / a);
      }
    })) : this.selectedIndex < 0 && this.list.removeAttribute("aria-activedescendant"), s && this.sync();
  }
  sync() {
    let e = this.list.firstChild;
    function t() {
      let i = e;
      e = i.nextSibling, i.remove();
    }
    for (let i of this.items)
      if (i.dom.parentNode == this.list) {
        for (; e != i.dom; )
          t();
        e = i.dom.nextSibling;
      } else
        this.list.insertBefore(i.dom, e);
    for (; e; )
      t();
  }
  moveSelection(e) {
    if (this.selectedIndex < 0)
      return;
    let t = this.view.state.field(De), i = ai(t.diagnostics, this.items[e].diagnostic);
    i && this.view.dispatch({
      selection: { anchor: i.from, head: i.to },
      scrollIntoView: !0,
      effects: Hc.of(i)
    });
  }
  static open(e) {
    return new As(e);
  }
}
function Xn(n, e = 'viewBox="0 0 40 40"') {
  return `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" ${e}>${encodeURIComponent(n)}</svg>')`;
}
function vn(n) {
  return Xn(`<path d="m0 2.5 l2 -1.5 l1 0 l2 1.5 l1 0" stroke="${n}" fill="none" stroke-width=".7"/>`, 'width="6" height="3"');
}
const Cg = /* @__PURE__ */ Z.baseTheme({
  ".cm-diagnostic": {
    padding: "3px 6px 3px 8px",
    marginLeft: "-1px",
    display: "block",
    whiteSpace: "pre-wrap"
  },
  ".cm-diagnostic-error": { borderLeft: "5px solid #d11" },
  ".cm-diagnostic-warning": { borderLeft: "5px solid orange" },
  ".cm-diagnostic-info": { borderLeft: "5px solid #999" },
  ".cm-diagnostic-hint": { borderLeft: "5px solid #66d" },
  ".cm-diagnosticAction": {
    font: "inherit",
    border: "none",
    padding: "2px 4px",
    backgroundColor: "#444",
    color: "white",
    borderRadius: "3px",
    marginLeft: "8px",
    cursor: "pointer"
  },
  ".cm-diagnosticSource": {
    fontSize: "70%",
    opacity: 0.7
  },
  ".cm-lintRange": {
    backgroundPosition: "left bottom",
    backgroundRepeat: "repeat-x",
    paddingBottom: "0.7px"
  },
  ".cm-lintRange-error": { backgroundImage: /* @__PURE__ */ vn("#d11") },
  ".cm-lintRange-warning": { backgroundImage: /* @__PURE__ */ vn("orange") },
  ".cm-lintRange-info": { backgroundImage: /* @__PURE__ */ vn("#999") },
  ".cm-lintRange-hint": { backgroundImage: /* @__PURE__ */ vn("#66d") },
  ".cm-lintRange-active": { backgroundColor: "#ffdd9980" },
  ".cm-tooltip-lint": {
    padding: 0,
    margin: 0
  },
  ".cm-lintPoint": {
    position: "relative",
    "&:after": {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: "-2px",
      borderLeft: "3px solid transparent",
      borderRight: "3px solid transparent",
      borderBottom: "4px solid #d11"
    }
  },
  ".cm-lintPoint-warning": {
    "&:after": { borderBottomColor: "orange" }
  },
  ".cm-lintPoint-info": {
    "&:after": { borderBottomColor: "#999" }
  },
  ".cm-lintPoint-hint": {
    "&:after": { borderBottomColor: "#66d" }
  },
  ".cm-panel.cm-panel-lint": {
    position: "relative",
    "& ul": {
      maxHeight: "100px",
      overflowY: "auto",
      "& [aria-selected]": {
        backgroundColor: "#ddd",
        "& u": { textDecoration: "underline" }
      },
      "&:focus [aria-selected]": {
        background_fallback: "#bdf",
        backgroundColor: "Highlight",
        color_fallback: "white",
        color: "HighlightText"
      },
      "& u": { textDecoration: "none" },
      padding: 0,
      margin: 0
    },
    "& [name=close]": {
      position: "absolute",
      top: "0",
      right: "2px",
      background: "inherit",
      border: "none",
      font: "inherit",
      padding: 0,
      margin: 0
    }
  }
});
function fa(n) {
  return n == "error" ? 4 : n == "warning" ? 3 : n == "info" ? 2 : 1;
}
class Og extends at {
  constructor(e) {
    super(), this.diagnostics = e, this.severity = e.reduce((t, i) => fa(t) < fa(i.severity) ? i.severity : t, "hint");
  }
  toDOM(e) {
    let t = document.createElement("div");
    t.className = "cm-lint-marker cm-lint-marker-" + this.severity;
    let i = this.diagnostics, s = e.state.facet(Ms).tooltipFilter;
    return s && (i = s(i, e.state)), i.length && (t.onmouseover = () => Mg(e, t, i)), t;
  }
}
function Ag(n, e) {
  let t = (i) => {
    let s = e.getBoundingClientRect();
    if (!(i.clientX > s.left - 10 && i.clientX < s.right + 10 && i.clientY > s.top - 10 && i.clientY < s.bottom + 10)) {
      for (let r = i.target; r; r = r.parentNode)
        if (r.nodeType == 1 && r.classList.contains("cm-tooltip-lint"))
          return;
      window.removeEventListener("mousemove", t), n.state.field(Jc) && n.dispatch({ effects: Ro.of(null) });
    }
  };
  window.addEventListener("mousemove", t);
}
function Mg(n, e, t) {
  function i() {
    let o = n.elementAtHeight(e.getBoundingClientRect().top + 5 - n.documentTop);
    n.coordsAtPos(o.from) && n.dispatch({ effects: Ro.of({
      pos: o.from,
      above: !1,
      create() {
        return {
          dom: Fc(n, t),
          getCoords: () => e.getBoundingClientRect()
        };
      }
    }) }), e.onmouseout = e.onmousemove = null, Ag(n, e);
  }
  let { hoverTime: s } = n.state.facet(Ms), r = setTimeout(i, s);
  e.onmouseout = () => {
    clearTimeout(r), e.onmouseout = e.onmousemove = null;
  }, e.onmousemove = () => {
    clearTimeout(r), r = setTimeout(i, s);
  };
}
function Rg(n, e) {
  let t = /* @__PURE__ */ Object.create(null);
  for (let s of e) {
    let r = n.lineAt(s.from);
    (t[r.from] || (t[r.from] = [])).push(s);
  }
  let i = [];
  for (let s in t)
    i.push(new Og(t[s]).range(+s));
  return I.of(i, !0);
}
const Zg = /* @__PURE__ */ mc({
  class: "cm-gutter-lint",
  markers: (n) => n.state.field(Yc)
}), Yc = /* @__PURE__ */ ee.define({
  create() {
    return I.empty;
  },
  update(n, e) {
    n = n.map(e.changes);
    let t = e.state.facet(Ms).markerFilter;
    for (let i of e.effects)
      if (i.is(Os)) {
        let s = i.value;
        t && (s = t(s || [], e.state)), n = Rg(e.state.doc, s.slice(0));
      }
    return n;
  }
}), Ro = /* @__PURE__ */ L.define(), Jc = /* @__PURE__ */ ee.define({
  create() {
    return null;
  },
  update(n, e) {
    return n && e.docChanged && (n = Nc(e, n) ? null : Object.assign(Object.assign({}, n), { pos: e.changes.mapPos(n.pos) })), e.effects.reduce((t, i) => i.is(Ro) ? i.value : t, n);
  },
  provide: (n) => ks.from(n)
}), Lg = /* @__PURE__ */ Z.baseTheme({
  ".cm-gutter-lint": {
    width: "1.4em",
    "& .cm-gutterElement": {
      padding: ".2em"
    }
  },
  ".cm-lint-marker": {
    width: "1em",
    height: "1em"
  },
  ".cm-lint-marker-info": {
    content: /* @__PURE__ */ Xn('<path fill="#aaf" stroke="#77e" stroke-width="6" stroke-linejoin="round" d="M5 5L35 5L35 35L5 35Z"/>')
  },
  ".cm-lint-marker-warning": {
    content: /* @__PURE__ */ Xn('<path fill="#fe8" stroke="#fd7" stroke-width="6" stroke-linejoin="round" d="M20 6L37 35L3 35Z"/>')
  },
  ".cm-lint-marker-error": {
    content: /* @__PURE__ */ Xn('<circle cx="20" cy="20" r="15" fill="#f87" stroke="#f43" stroke-width="6"/>')
  }
}), Qc = [
  De,
  /* @__PURE__ */ Z.decorations.compute([De], (n) => {
    let { selected: e, panel: t } = n.field(De);
    return !e || !t || e.from == e.to ? T.none : T.set([
      gg.range(e.from, e.to)
    ]);
  }),
  /* @__PURE__ */ tm(bg, { hideOn: Nc }),
  Cg
], Ms = /* @__PURE__ */ M.define({
  combine(n) {
    return tt(n, {
      hoverTime: 300,
      markerFilter: null,
      tooltipFilter: null
    });
  }
});
function Tg(n = {}) {
  return [Ms.of(n), Yc, Zg, Lg, Jc];
}
const Dg = () => [
  Sg((e) => e.state.field(ua).map(
    (i) => ({
      from: i.range.from,
      to: i.range.to,
      severity: "error",
      message: i.message,
      actions: []
    })
  )),
  ua.init(() => []),
  Tg()
], Uc = L.define({
  map: (n, e) => jc(e)(n)
}), $c = L.define(), jc = (n) => (e) => ({
  ...e,
  range: {
    from: n.mapPos(e.range.from),
    to: n.mapPos(e.range.to)
  }
}), ua = ee.define({
  create() {
    return [];
  },
  update(n, e) {
    n = n.map(jc(e.changes));
    for (let t of e.effects)
      t.is(Uc) ? n.push(t.value) : t.is($c) && (n = []);
    return n;
  }
});
class qc {
  constructor(e) {
    nn(this, "lineChunks", !1);
    this.input = e;
  }
  get length() {
    return this.input.length;
  }
  chunk(e) {
    return this.input.slice(e);
  }
  read(e, t) {
    return this.input.slice(e, t);
  }
}
function da({ type: n, from: e, to: t }, i = !1) {
  return { type: n, from: e, to: t, isLeaf: i };
}
function Pg(n, {
  from: e = -1 / 0,
  to: t = 1 / 0,
  includeParents: i = !1,
  beforeEnter: s,
  onEnter: r,
  onLeave: o
}) {
  for (n instanceof Fn || (n = n.cursor()); ; ) {
    let l = da(n), a = !1;
    if (l.from <= t && l.to >= e) {
      const h = !l.type.isAnonymous && (i || l.from >= e && l.to <= t);
      if (h && s && s(n), l.isLeaf = !n.firstChild(), h && (a = !0, r(l) === !1))
        return;
      if (!l.isLeaf)
        continue;
    }
    for (; ; ) {
      if (l = da(n, l.isLeaf), a && o && o(l) === !1)
        return;
      if (a = n.type.isAnonymous, l.isLeaf = !1, n.nextSibling())
        break;
      if (!n.parent())
        return;
      a = !0;
    }
  }
}
function pa(n, e) {
  return n.from >= e.from && n.from <= e.to && n.to <= e.to && n.to >= e.from;
}
function Vg(n, { fullMatch: e = !0 } = {}) {
  typeof n == "string" && (n = new qc(n));
  const t = {
    valid: !0,
    parentNodes: [],
    lastLeafTo: 0
  };
  return {
    state: t,
    traversal: {
      onEnter(i) {
        t.valid = !0, i.isLeaf || t.parentNodes.unshift(i), i.from > i.to || i.from < t.lastLeafTo ? t.valid = !1 : i.isLeaf ? (t.parentNodes.length && !pa(i, t.parentNodes[0]) && (t.valid = !1), t.lastLeafTo = i.to) : t.parentNodes.length ? pa(i, t.parentNodes[0]) || (t.valid = !1) : e && (i.from !== 0 || i.to !== n.length) && (t.valid = !1);
      },
      onLeave(i) {
        i.isLeaf || t.parentNodes.shift();
      }
    }
  };
}
function bi(n, e) {
  return "\x1B[" + e + "m" + String(n) + "\x1B[39m";
}
function ma(n, e, { from: t, to: i, start: s = 0, includeParents: r } = {}) {
  const o = typeof e == "string" ? new qc(e) : e, l = E.of(o.read(0, o.length).split(`
`)), a = {
    output: "",
    prefixes: [],
    hasNextSibling: !1
  }, h = Vg(o);
  return Pg(n, {
    from: t,
    to: i,
    includeParents: r,
    beforeEnter(c) {
      a.hasNextSibling = c.nextSibling() && c.prevSibling();
    },
    onEnter(c) {
      h.traversal.onEnter(c);
      const f = a.output === "";
      (!f || c.from > 0) && (a.output += (f ? "" : `
`) + a.prefixes.join(""), a.hasNextSibling ? (a.output += " ├─ ", a.prefixes.push(" │  ")) : (a.output += " └─ ", a.prefixes.push("    ")));
      const d = c.from !== c.to;
      a.output += (c.type.isError || !h.state.valid ? bi(
        c.type.name,
        31
        /* Red */
      ) : c.type.name) + " " + (d ? "[" + bi(
        ir(l, s + c.from),
        33
        /* Yellow */
      ) + ".." + bi(
        ir(l, s + c.to),
        33
        /* Yellow */
      ) + "]" : bi(
        ir(l, s + c.from),
        33
        /* Yellow */
      )), d && c.isLeaf && (a.output += ": " + bi(
        JSON.stringify(o.read(c.from, c.to)),
        32
        /* Green */
      ));
    },
    onLeave(c) {
      h.traversal.onLeave(c), a.prefixes.pop();
    }
  }), a.output;
}
function ir(n, e) {
  const t = n.lineAt(e);
  return t.number + ":" + (e - t.from);
}
const Bg = (n) => {
  let { state: e } = n, t = e.doc.lineAt(e.selection.main.from), i = Lo(n.state, t.from);
  return i.line ? Wg(n) : i.block ? Ig(n) : !1;
};
function Zo(n, e) {
  return ({ state: t, dispatch: i }) => {
    if (t.readOnly)
      return !1;
    let s = n(e, t);
    return s ? (i(t.update(s)), !0) : !1;
  };
}
const Wg = /* @__PURE__ */ Zo(
  Gg,
  0
  /* CommentOption.Toggle */
), Xg = /* @__PURE__ */ Zo(
  _c,
  0
  /* CommentOption.Toggle */
), Ig = /* @__PURE__ */ Zo(
  (n, e) => _c(n, e, Ng(e)),
  0
  /* CommentOption.Toggle */
);
function Lo(n, e) {
  let t = n.languageDataAt("commentTokens", e);
  return t.length ? t[0] : {};
}
const yi = 50;
function Eg(n, { open: e, close: t }, i, s) {
  let r = n.sliceDoc(i - yi, i), o = n.sliceDoc(s, s + yi), l = /\s*$/.exec(r)[0].length, a = /^\s*/.exec(o)[0].length, h = r.length - l;
  if (r.slice(h - e.length, h) == e && o.slice(a, a + t.length) == t)
    return {
      open: { pos: i - l, margin: l && 1 },
      close: { pos: s + a, margin: a && 1 }
    };
  let c, f;
  s - i <= 2 * yi ? c = f = n.sliceDoc(i, s) : (c = n.sliceDoc(i, i + yi), f = n.sliceDoc(s - yi, s));
  let u = /^\s*/.exec(c)[0].length, d = /\s*$/.exec(f)[0].length, p = f.length - d - t.length;
  return c.slice(u, u + e.length) == e && f.slice(p, p + t.length) == t ? {
    open: {
      pos: i + u + e.length,
      margin: /\s/.test(c.charAt(u + e.length)) ? 1 : 0
    },
    close: {
      pos: s - d - t.length,
      margin: /\s/.test(f.charAt(p - 1)) ? 1 : 0
    }
  } : null;
}
function Ng(n) {
  let e = [];
  for (let t of n.selection.ranges) {
    let i = n.doc.lineAt(t.from), s = t.to <= i.to ? i : n.doc.lineAt(t.to), r = e.length - 1;
    r >= 0 && e[r].to > i.from ? e[r].to = s.to : e.push({ from: i.from + /^\s*/.exec(i.text)[0].length, to: s.to });
  }
  return e;
}
function _c(n, e, t = e.selection.ranges) {
  let i = t.map((r) => Lo(e, r.from).block);
  if (!i.every((r) => r))
    return null;
  let s = t.map((r, o) => Eg(e, i[o], r.from, r.to));
  if (n != 2 && !s.every((r) => r))
    return { changes: e.changes(t.map((r, o) => s[o] ? [] : [{ from: r.from, insert: i[o].open + " " }, { from: r.to, insert: " " + i[o].close }])) };
  if (n != 1 && s.some((r) => r)) {
    let r = [];
    for (let o = 0, l; o < s.length; o++)
      if (l = s[o]) {
        let a = i[o], { open: h, close: c } = l;
        r.push({ from: h.pos - a.open.length, to: h.pos + h.margin }, { from: c.pos - c.margin, to: c.pos + a.close.length });
      }
    return { changes: r };
  }
  return null;
}
function Gg(n, e, t = e.selection.ranges) {
  let i = [], s = -1;
  for (let { from: r, to: o } of t) {
    let l = i.length, a = 1e9, h = Lo(e, r).line;
    if (h) {
      for (let c = r; c <= o; ) {
        let f = e.doc.lineAt(c);
        if (f.from > s && (r == o || o > f.from)) {
          s = f.from;
          let u = /^\s*/.exec(f.text)[0].length, d = u == f.length, p = f.text.slice(u, u + h.length) == h ? u : -1;
          u < f.text.length && u < a && (a = u), i.push({ line: f, comment: p, token: h, indent: u, empty: d, single: !1 });
        }
        c = f.to + 1;
      }
      if (a < 1e9)
        for (let c = l; c < i.length; c++)
          i[c].indent < i[c].line.text.length && (i[c].indent = a);
      i.length == l + 1 && (i[l].single = !0);
    }
  }
  if (n != 2 && i.some((r) => r.comment < 0 && (!r.empty || r.single))) {
    let r = [];
    for (let { line: l, token: a, indent: h, empty: c, single: f } of i)
      (f || !c) && r.push({ from: l.from + h, insert: a + " " });
    let o = e.changes(r);
    return { changes: o, selection: e.selection.map(o, 1) };
  } else if (n != 1 && i.some((r) => r.comment >= 0)) {
    let r = [];
    for (let { line: o, comment: l, token: a } of i)
      if (l >= 0) {
        let h = o.from + l, c = h + a.length;
        o.text[c - o.from] == " " && c++, r.push({ from: h, to: c });
      }
    return { changes: r };
  }
  return null;
}
const Qr = /* @__PURE__ */ ht.define(), Hg = /* @__PURE__ */ ht.define(), Fg = /* @__PURE__ */ M.define(), ef = /* @__PURE__ */ M.define({
  combine(n) {
    return tt(n, {
      minDepth: 100,
      newGroupDelay: 500,
      joinToEvent: (e, t) => t
    }, {
      minDepth: Math.max,
      newGroupDelay: Math.min,
      joinToEvent: (e, t) => (i, s) => e(i, s) || t(i, s)
    });
  }
}), tf = /* @__PURE__ */ ee.define({
  create() {
    return _e.empty;
  },
  update(n, e) {
    let t = e.state.facet(ef), i = e.annotation(Qr);
    if (i) {
      let a = Oe.fromTransaction(e, i.selection), h = i.side, c = h == 0 ? n.undone : n.done;
      return a ? c = rs(c, c.length, t.minDepth, a) : c = rf(c, e.startState.selection), new _e(h == 0 ? i.rest : c, h == 0 ? c : i.rest);
    }
    let s = e.annotation(Hg);
    if ((s == "full" || s == "before") && (n = n.isolate()), e.annotation(se.addToHistory) === !1)
      return e.changes.empty ? n : n.addMapping(e.changes.desc);
    let r = Oe.fromTransaction(e), o = e.annotation(se.time), l = e.annotation(se.userEvent);
    return r ? n = n.addChanges(r, o, l, t, e) : e.selection && (n = n.addSelection(e.startState.selection, o, l, t.newGroupDelay)), (s == "full" || s == "after") && (n = n.isolate()), n;
  },
  toJSON(n) {
    return { done: n.done.map((e) => e.toJSON()), undone: n.undone.map((e) => e.toJSON()) };
  },
  fromJSON(n) {
    return new _e(n.done.map(Oe.fromJSON), n.undone.map(Oe.fromJSON));
  }
});
function zg(n = {}) {
  return [
    tf,
    ef.of(n),
    Z.domEventHandlers({
      beforeinput(e, t) {
        let i = e.inputType == "historyUndo" ? nf : e.inputType == "historyRedo" ? Ur : null;
        return i ? (e.preventDefault(), i(t)) : !1;
      }
    })
  ];
}
function Rs(n, e) {
  return function({ state: t, dispatch: i }) {
    if (!e && t.readOnly)
      return !1;
    let s = t.field(tf, !1);
    if (!s)
      return !1;
    let r = s.pop(n, t, e);
    return r ? (i(r), !0) : !1;
  };
}
const nf = /* @__PURE__ */ Rs(0, !1), Ur = /* @__PURE__ */ Rs(1, !1), Kg = /* @__PURE__ */ Rs(0, !0), Yg = /* @__PURE__ */ Rs(1, !0);
class Oe {
  constructor(e, t, i, s, r) {
    this.changes = e, this.effects = t, this.mapped = i, this.startSelection = s, this.selectionsAfter = r;
  }
  setSelAfter(e) {
    return new Oe(this.changes, this.effects, this.mapped, this.startSelection, e);
  }
  toJSON() {
    var e, t, i;
    return {
      changes: (e = this.changes) === null || e === void 0 ? void 0 : e.toJSON(),
      mapped: (t = this.mapped) === null || t === void 0 ? void 0 : t.toJSON(),
      startSelection: (i = this.startSelection) === null || i === void 0 ? void 0 : i.toJSON(),
      selectionsAfter: this.selectionsAfter.map((s) => s.toJSON())
    };
  }
  static fromJSON(e) {
    return new Oe(e.changes && ne.fromJSON(e.changes), [], e.mapped && et.fromJSON(e.mapped), e.startSelection && y.fromJSON(e.startSelection), e.selectionsAfter.map(y.fromJSON));
  }
  // This does not check `addToHistory` and such, it assumes the
  // transaction needs to be converted to an item. Returns null when
  // there are no changes or effects in the transaction.
  static fromTransaction(e, t) {
    let i = Xe;
    for (let s of e.startState.facet(Fg)) {
      let r = s(e);
      r.length && (i = i.concat(r));
    }
    return !i.length && e.changes.empty ? null : new Oe(e.changes.invert(e.startState.doc), i, void 0, t || e.startState.selection, Xe);
  }
  static selection(e) {
    return new Oe(void 0, Xe, void 0, void 0, e);
  }
}
function rs(n, e, t, i) {
  let s = e + 1 > t + 20 ? e - t - 1 : 0, r = n.slice(s, e);
  return r.push(i), r;
}
function Jg(n, e) {
  let t = [], i = !1;
  return n.iterChangedRanges((s, r) => t.push(s, r)), e.iterChangedRanges((s, r, o, l) => {
    for (let a = 0; a < t.length; ) {
      let h = t[a++], c = t[a++];
      l >= h && o <= c && (i = !0);
    }
  }), i;
}
function Qg(n, e) {
  return n.ranges.length == e.ranges.length && n.ranges.filter((t, i) => t.empty != e.ranges[i].empty).length === 0;
}
function sf(n, e) {
  return n.length ? e.length ? n.concat(e) : n : e;
}
const Xe = [], Ug = 200;
function rf(n, e) {
  if (n.length) {
    let t = n[n.length - 1], i = t.selectionsAfter.slice(Math.max(0, t.selectionsAfter.length - Ug));
    return i.length && i[i.length - 1].eq(e) ? n : (i.push(e), rs(n, n.length - 1, 1e9, t.setSelAfter(i)));
  } else
    return [Oe.selection([e])];
}
function $g(n) {
  let e = n[n.length - 1], t = n.slice();
  return t[n.length - 1] = e.setSelAfter(e.selectionsAfter.slice(0, e.selectionsAfter.length - 1)), t;
}
function nr(n, e) {
  if (!n.length)
    return n;
  let t = n.length, i = Xe;
  for (; t; ) {
    let s = jg(n[t - 1], e, i);
    if (s.changes && !s.changes.empty || s.effects.length) {
      let r = n.slice(0, t);
      return r[t - 1] = s, r;
    } else
      e = s.mapped, t--, i = s.selectionsAfter;
  }
  return i.length ? [Oe.selection(i)] : Xe;
}
function jg(n, e, t) {
  let i = sf(n.selectionsAfter.length ? n.selectionsAfter.map((l) => l.map(e)) : Xe, t);
  if (!n.changes)
    return Oe.selection(i);
  let s = n.changes.map(e), r = e.mapDesc(n.changes, !0), o = n.mapped ? n.mapped.composeDesc(r) : r;
  return new Oe(s, L.mapEffects(n.effects, e), o, n.startSelection.map(r), i);
}
const qg = /^(input\.type|delete)($|\.)/;
class _e {
  constructor(e, t, i = 0, s = void 0) {
    this.done = e, this.undone = t, this.prevTime = i, this.prevUserEvent = s;
  }
  isolate() {
    return this.prevTime ? new _e(this.done, this.undone) : this;
  }
  addChanges(e, t, i, s, r) {
    let o = this.done, l = o[o.length - 1];
    return l && l.changes && !l.changes.empty && e.changes && (!i || qg.test(i)) && (!l.selectionsAfter.length && t - this.prevTime < s.newGroupDelay && s.joinToEvent(r, Jg(l.changes, e.changes)) || // For compose (but not compose.start) events, always join with previous event
    i == "input.type.compose") ? o = rs(o, o.length - 1, s.minDepth, new Oe(e.changes.compose(l.changes), sf(e.effects, l.effects), l.mapped, l.startSelection, Xe)) : o = rs(o, o.length, s.minDepth, e), new _e(o, Xe, t, i);
  }
  addSelection(e, t, i, s) {
    let r = this.done.length ? this.done[this.done.length - 1].selectionsAfter : Xe;
    return r.length > 0 && t - this.prevTime < s && i == this.prevUserEvent && i && /^select($|\.)/.test(i) && Qg(r[r.length - 1], e) ? this : new _e(rf(this.done, e), this.undone, t, i);
  }
  addMapping(e) {
    return new _e(nr(this.done, e), nr(this.undone, e), this.prevTime, this.prevUserEvent);
  }
  pop(e, t, i) {
    let s = e == 0 ? this.done : this.undone;
    if (s.length == 0)
      return null;
    let r = s[s.length - 1], o = r.selectionsAfter[0] || t.selection;
    if (i && r.selectionsAfter.length)
      return t.update({
        selection: r.selectionsAfter[r.selectionsAfter.length - 1],
        annotations: Qr.of({ side: e, rest: $g(s), selection: o }),
        userEvent: e == 0 ? "select.undo" : "select.redo",
        scrollIntoView: !0
      });
    if (r.changes) {
      let l = s.length == 1 ? Xe : s.slice(0, s.length - 1);
      return r.mapped && (l = nr(l, r.mapped)), t.update({
        changes: r.changes,
        selection: r.startSelection,
        effects: r.effects,
        annotations: Qr.of({ side: e, rest: l, selection: o }),
        filter: !1,
        userEvent: e == 0 ? "undo" : "redo",
        scrollIntoView: !0
      });
    } else
      return null;
  }
}
_e.empty = /* @__PURE__ */ new _e(Xe, Xe);
const _g = [
  { key: "Mod-z", run: nf, preventDefault: !0 },
  { key: "Mod-y", mac: "Mod-Shift-z", run: Ur, preventDefault: !0 },
  { linux: "Ctrl-Shift-z", run: Ur, preventDefault: !0 },
  { key: "Mod-u", run: Kg, preventDefault: !0 },
  { key: "Alt-u", mac: "Mod-Shift-u", run: Yg, preventDefault: !0 }
];
function ci(n, e) {
  return y.create(n.ranges.map(e), n.mainIndex);
}
function it(n, e) {
  return n.update({ selection: e, scrollIntoView: !0, userEvent: "select" });
}
function ze({ state: n, dispatch: e }, t) {
  let i = ci(n.selection, t);
  return i.eq(n.selection, !0) ? !1 : (e(it(n, i)), !0);
}
function Zs(n, e) {
  return y.cursor(e ? n.to : n.from);
}
function of(n, e) {
  return ze(n, (t) => t.empty ? n.moveByChar(t, e) : Zs(t, e));
}
function me(n) {
  return n.textDirectionAt(n.state.selection.main.head) == J.LTR;
}
const lf = (n) => of(n, !me(n)), af = (n) => of(n, me(n));
function hf(n, e) {
  return ze(n, (t) => t.empty ? n.moveByGroup(t, e) : Zs(t, e));
}
const e0 = (n) => hf(n, !me(n)), t0 = (n) => hf(n, me(n));
function i0(n, e, t) {
  if (e.type.prop(t))
    return !0;
  let i = e.to - e.from;
  return i && (i > 2 || /[^\s,.;:]/.test(n.sliceDoc(e.from, e.to))) || e.firstChild;
}
function Ls(n, e, t) {
  let i = pe(n).resolveInner(e.head), s = t ? V.closedBy : V.openedBy;
  for (let a = e.head; ; ) {
    let h = t ? i.childAfter(a) : i.childBefore(a);
    if (!h)
      break;
    i0(n, h, s) ? i = h : a = t ? h.to : h.from;
  }
  let r = i.type.prop(s), o, l;
  return r && (o = t ? qe(n, i.from, 1) : qe(n, i.to, -1)) && o.matched ? l = t ? o.end.to : o.end.from : l = t ? i.to : i.from, y.cursor(l, t ? -1 : 1);
}
const n0 = (n) => ze(n, (e) => Ls(n.state, e, !me(n))), s0 = (n) => ze(n, (e) => Ls(n.state, e, me(n)));
function cf(n, e) {
  return ze(n, (t) => {
    if (!t.empty)
      return Zs(t, e);
    let i = n.moveVertically(t, e);
    return i.head != t.head ? i : n.moveToLineBoundary(t, e);
  });
}
const ff = (n) => cf(n, !1), uf = (n) => cf(n, !0);
function df(n) {
  let e = n.scrollDOM.clientHeight < n.scrollDOM.scrollHeight - 2, t = 0, i = 0, s;
  if (e) {
    for (let r of n.state.facet(Z.scrollMargins)) {
      let o = r(n);
      o != null && o.top && (t = Math.max(o == null ? void 0 : o.top, t)), o != null && o.bottom && (i = Math.max(o == null ? void 0 : o.bottom, i));
    }
    s = n.scrollDOM.clientHeight - t - i;
  } else
    s = (n.dom.ownerDocument.defaultView || window).innerHeight;
  return {
    marginTop: t,
    marginBottom: i,
    selfScroll: e,
    height: Math.max(n.defaultLineHeight, s - 5)
  };
}
function pf(n, e) {
  let t = df(n), { state: i } = n, s = ci(i.selection, (o) => o.empty ? n.moveVertically(o, e, t.height) : Zs(o, e));
  if (s.eq(i.selection))
    return !1;
  let r;
  if (t.selfScroll) {
    let o = n.coordsAtPos(i.selection.main.head), l = n.scrollDOM.getBoundingClientRect(), a = l.top + t.marginTop, h = l.bottom - t.marginBottom;
    o && o.top > a && o.bottom < h && (r = Z.scrollIntoView(s.main.head, { y: "start", yMargin: o.top - a }));
  }
  return n.dispatch(it(i, s), { effects: r }), !0;
}
const ga = (n) => pf(n, !1), $r = (n) => pf(n, !0);
function Rt(n, e, t) {
  let i = n.lineBlockAt(e.head), s = n.moveToLineBoundary(e, t);
  if (s.head == e.head && s.head != (t ? i.to : i.from) && (s = n.moveToLineBoundary(e, t, !1)), !t && s.head == i.from && i.length) {
    let r = /^\s*/.exec(n.state.sliceDoc(i.from, Math.min(i.from + 100, i.to)))[0].length;
    r && e.head != i.from + r && (s = y.cursor(i.from + r));
  }
  return s;
}
const r0 = (n) => ze(n, (e) => Rt(n, e, !0)), o0 = (n) => ze(n, (e) => Rt(n, e, !1)), l0 = (n) => ze(n, (e) => Rt(n, e, !me(n))), a0 = (n) => ze(n, (e) => Rt(n, e, me(n))), h0 = (n) => ze(n, (e) => y.cursor(n.lineBlockAt(e.head).from, 1)), c0 = (n) => ze(n, (e) => y.cursor(n.lineBlockAt(e.head).to, -1));
function f0(n, e, t) {
  let i = !1, s = ci(n.selection, (r) => {
    let o = qe(n, r.head, -1) || qe(n, r.head, 1) || r.head > 0 && qe(n, r.head - 1, 1) || r.head < n.doc.length && qe(n, r.head + 1, -1);
    if (!o || !o.end)
      return r;
    i = !0;
    let l = o.start.from == r.head ? o.end.to : o.end.from;
    return t ? y.range(r.anchor, l) : y.cursor(l);
  });
  return i ? (e(it(n, s)), !0) : !1;
}
const u0 = ({ state: n, dispatch: e }) => f0(n, e, !1);
function Ne(n, e) {
  let t = ci(n.state.selection, (i) => {
    let s = e(i);
    return y.range(i.anchor, s.head, s.goalColumn, s.bidiLevel || void 0);
  });
  return t.eq(n.state.selection) ? !1 : (n.dispatch(it(n.state, t)), !0);
}
function mf(n, e) {
  return Ne(n, (t) => n.moveByChar(t, e));
}
const gf = (n) => mf(n, !me(n)), bf = (n) => mf(n, me(n));
function yf(n, e) {
  return Ne(n, (t) => n.moveByGroup(t, e));
}
const d0 = (n) => yf(n, !me(n)), p0 = (n) => yf(n, me(n)), m0 = (n) => Ne(n, (e) => Ls(n.state, e, !me(n))), g0 = (n) => Ne(n, (e) => Ls(n.state, e, me(n)));
function xf(n, e) {
  return Ne(n, (t) => n.moveVertically(t, e));
}
const wf = (n) => xf(n, !1), kf = (n) => xf(n, !0);
function Sf(n, e) {
  return Ne(n, (t) => n.moveVertically(t, e, df(n).height));
}
const ba = (n) => Sf(n, !1), ya = (n) => Sf(n, !0), b0 = (n) => Ne(n, (e) => Rt(n, e, !0)), y0 = (n) => Ne(n, (e) => Rt(n, e, !1)), x0 = (n) => Ne(n, (e) => Rt(n, e, !me(n))), w0 = (n) => Ne(n, (e) => Rt(n, e, me(n))), k0 = (n) => Ne(n, (e) => y.cursor(n.lineBlockAt(e.head).from)), S0 = (n) => Ne(n, (e) => y.cursor(n.lineBlockAt(e.head).to)), xa = ({ state: n, dispatch: e }) => (e(it(n, { anchor: 0 })), !0), wa = ({ state: n, dispatch: e }) => (e(it(n, { anchor: n.doc.length })), !0), ka = ({ state: n, dispatch: e }) => (e(it(n, { anchor: n.selection.main.anchor, head: 0 })), !0), Sa = ({ state: n, dispatch: e }) => (e(it(n, { anchor: n.selection.main.anchor, head: n.doc.length })), !0), v0 = ({ state: n, dispatch: e }) => (e(n.update({ selection: { anchor: 0, head: n.doc.length }, userEvent: "select" })), !0), C0 = ({ state: n, dispatch: e }) => {
  let t = Ts(n).map(({ from: i, to: s }) => y.range(i, Math.min(s + 1, n.doc.length)));
  return e(n.update({ selection: y.create(t), userEvent: "select" })), !0;
}, O0 = ({ state: n, dispatch: e }) => {
  let t = ci(n.selection, (i) => {
    var s;
    let r = pe(n).resolveStack(i.from, 1);
    for (let o = r; o; o = o.next) {
      let { node: l } = o;
      if ((l.from < i.from && l.to >= i.to || l.to > i.to && l.from <= i.from) && (!((s = l.parent) === null || s === void 0) && s.parent))
        return y.range(l.to, l.from);
    }
    return i;
  });
  return e(it(n, t)), !0;
}, A0 = ({ state: n, dispatch: e }) => {
  let t = n.selection, i = null;
  return t.ranges.length > 1 ? i = y.create([t.main]) : t.main.empty || (i = y.create([y.cursor(t.main.head)])), i ? (e(it(n, i)), !0) : !1;
};
function _i(n, e) {
  if (n.state.readOnly)
    return !1;
  let t = "delete.selection", { state: i } = n, s = i.changeByRange((r) => {
    let { from: o, to: l } = r;
    if (o == l) {
      let a = e(r);
      a < o ? (t = "delete.backward", a = Cn(n, a, !1)) : a > o && (t = "delete.forward", a = Cn(n, a, !0)), o = Math.min(o, a), l = Math.max(l, a);
    } else
      o = Cn(n, o, !1), l = Cn(n, l, !0);
    return o == l ? { range: r } : { changes: { from: o, to: l }, range: y.cursor(o, o < r.head ? -1 : 1) };
  });
  return s.changes.empty ? !1 : (n.dispatch(i.update(s, {
    scrollIntoView: !0,
    userEvent: t,
    effects: t == "delete.selection" ? Z.announce.of(i.phrase("Selection deleted")) : void 0
  })), !0);
}
function Cn(n, e, t) {
  if (n instanceof Z)
    for (let i of n.state.facet(Z.atomicRanges).map((s) => s(n)))
      i.between(e, e, (s, r) => {
        s < e && r > e && (e = t ? r : s);
      });
  return e;
}
const vf = (n, e) => _i(n, (t) => {
  let i = t.from, { state: s } = n, r = s.doc.lineAt(i), o, l;
  if (!e && i > r.from && i < r.from + 200 && !/[^ \t]/.test(o = r.text.slice(0, i - r.from))) {
    if (o[o.length - 1] == "	")
      return i - 1;
    let a = Ji(o, s.tabSize), h = a % is(s) || is(s);
    for (let c = 0; c < h && o[o.length - 1 - c] == " "; c++)
      i--;
    l = i;
  } else
    l = ce(r.text, i - r.from, e, e) + r.from, l == i && r.number != (e ? s.doc.lines : 1) ? l += e ? 1 : -1 : !e && /[\ufe00-\ufe0f]/.test(r.text.slice(l - r.from, i - r.from)) && (l = ce(r.text, l - r.from, !1, !1) + r.from);
  return l;
}), jr = (n) => vf(n, !1), Cf = (n) => vf(n, !0), Of = (n, e) => _i(n, (t) => {
  let i = t.head, { state: s } = n, r = s.doc.lineAt(i), o = s.charCategorizer(i);
  for (let l = null; ; ) {
    if (i == (e ? r.to : r.from)) {
      i == t.head && r.number != (e ? s.doc.lines : 1) && (i += e ? 1 : -1);
      break;
    }
    let a = ce(r.text, i - r.from, e) + r.from, h = r.text.slice(Math.min(i, a) - r.from, Math.max(i, a) - r.from), c = o(h);
    if (l != null && c != l)
      break;
    (h != " " || i != t.head) && (l = c), i = a;
  }
  return i;
}), Af = (n) => Of(n, !1), M0 = (n) => Of(n, !0), R0 = (n) => _i(n, (e) => {
  let t = n.lineBlockAt(e.head).to;
  return e.head < t ? t : Math.min(n.state.doc.length, e.head + 1);
}), Z0 = (n) => _i(n, (e) => {
  let t = n.moveToLineBoundary(e, !1).head;
  return e.head > t ? t : Math.max(0, e.head - 1);
}), L0 = (n) => _i(n, (e) => {
  let t = n.moveToLineBoundary(e, !0).head;
  return e.head < t ? t : Math.min(n.state.doc.length, e.head + 1);
}), T0 = ({ state: n, dispatch: e }) => {
  if (n.readOnly)
    return !1;
  let t = n.changeByRange((i) => ({
    changes: { from: i.from, to: i.to, insert: E.of(["", ""]) },
    range: y.cursor(i.from)
  }));
  return e(n.update(t, { scrollIntoView: !0, userEvent: "input" })), !0;
}, D0 = ({ state: n, dispatch: e }) => {
  if (n.readOnly)
    return !1;
  let t = n.changeByRange((i) => {
    if (!i.empty || i.from == 0 || i.from == n.doc.length)
      return { range: i };
    let s = i.from, r = n.doc.lineAt(s), o = s == r.from ? s - 1 : ce(r.text, s - r.from, !1) + r.from, l = s == r.to ? s + 1 : ce(r.text, s - r.from, !0) + r.from;
    return {
      changes: { from: o, to: l, insert: n.doc.slice(s, l).append(n.doc.slice(o, s)) },
      range: y.cursor(l)
    };
  });
  return t.changes.empty ? !1 : (e(n.update(t, { scrollIntoView: !0, userEvent: "move.character" })), !0);
};
function Ts(n) {
  let e = [], t = -1;
  for (let i of n.selection.ranges) {
    let s = n.doc.lineAt(i.from), r = n.doc.lineAt(i.to);
    if (!i.empty && i.to == r.from && (r = n.doc.lineAt(i.to - 1)), t >= s.number) {
      let o = e[e.length - 1];
      o.to = r.to, o.ranges.push(i);
    } else
      e.push({ from: s.from, to: r.to, ranges: [i] });
    t = r.number + 1;
  }
  return e;
}
function Mf(n, e, t) {
  if (n.readOnly)
    return !1;
  let i = [], s = [];
  for (let r of Ts(n)) {
    if (t ? r.to == n.doc.length : r.from == 0)
      continue;
    let o = n.doc.lineAt(t ? r.to + 1 : r.from - 1), l = o.length + 1;
    if (t) {
      i.push({ from: r.to, to: o.to }, { from: r.from, insert: o.text + n.lineBreak });
      for (let a of r.ranges)
        s.push(y.range(Math.min(n.doc.length, a.anchor + l), Math.min(n.doc.length, a.head + l)));
    } else {
      i.push({ from: o.from, to: r.from }, { from: r.to, insert: n.lineBreak + o.text });
      for (let a of r.ranges)
        s.push(y.range(a.anchor - l, a.head - l));
    }
  }
  return i.length ? (e(n.update({
    changes: i,
    scrollIntoView: !0,
    selection: y.create(s, n.selection.mainIndex),
    userEvent: "move.line"
  })), !0) : !1;
}
const P0 = ({ state: n, dispatch: e }) => Mf(n, e, !1), V0 = ({ state: n, dispatch: e }) => Mf(n, e, !0);
function Rf(n, e, t) {
  if (n.readOnly)
    return !1;
  let i = [];
  for (let s of Ts(n))
    t ? i.push({ from: s.from, insert: n.doc.slice(s.from, s.to) + n.lineBreak }) : i.push({ from: s.to, insert: n.lineBreak + n.doc.slice(s.from, s.to) });
  return e(n.update({ changes: i, scrollIntoView: !0, userEvent: "input.copyline" })), !0;
}
const B0 = ({ state: n, dispatch: e }) => Rf(n, e, !1), W0 = ({ state: n, dispatch: e }) => Rf(n, e, !0), X0 = (n) => {
  if (n.state.readOnly)
    return !1;
  let { state: e } = n, t = e.changes(Ts(e).map(({ from: s, to: r }) => (s > 0 ? s-- : r < e.doc.length && r++, { from: s, to: r }))), i = ci(e.selection, (s) => n.moveVertically(s, !0)).map(t);
  return n.dispatch({ changes: t, selection: i, scrollIntoView: !0, userEvent: "delete.line" }), !0;
};
function I0(n, e) {
  if (/\(\)|\[\]|\{\}/.test(n.sliceDoc(e - 1, e + 1)))
    return { from: e, to: e };
  let t = pe(n).resolveInner(e), i = t.childBefore(e), s = t.childAfter(e), r;
  return i && s && i.to <= e && s.from >= e && (r = i.type.prop(V.closedBy)) && r.indexOf(s.name) > -1 && n.doc.lineAt(i.to).from == n.doc.lineAt(s.from).from && !/\S/.test(n.sliceDoc(i.to, s.from)) ? { from: i.to, to: s.from } : null;
}
const E0 = /* @__PURE__ */ Zf(!1), N0 = /* @__PURE__ */ Zf(!0);
function Zf(n) {
  return ({ state: e, dispatch: t }) => {
    if (e.readOnly)
      return !1;
    let i = e.changeByRange((s) => {
      let { from: r, to: o } = s, l = e.doc.lineAt(r), a = !n && r == o && I0(e, r);
      n && (r = o = (o <= l.to ? l : e.doc.lineAt(o)).to);
      let h = new vs(e, { simulateBreak: r, simulateDoubleBreak: !!a }), c = vo(h, r);
      for (c == null && (c = Ji(/^\s*/.exec(e.doc.lineAt(r).text)[0], e.tabSize)); o < l.to && /\s/.test(l.text[o - l.from]); )
        o++;
      a ? { from: r, to: o } = a : r > l.from && r < l.from + 100 && !/\S/.test(l.text.slice(0, r)) && (r = l.from);
      let f = ["", Gi(e, c)];
      return a && f.push(Gi(e, h.lineIndent(l.from, -1))), {
        changes: { from: r, to: o, insert: E.of(f) },
        range: y.cursor(r + 1 + f[1].length)
      };
    });
    return t(e.update(i, { scrollIntoView: !0, userEvent: "input" })), !0;
  };
}
function To(n, e) {
  let t = -1;
  return n.changeByRange((i) => {
    let s = [];
    for (let o = i.from; o <= i.to; ) {
      let l = n.doc.lineAt(o);
      l.number > t && (i.empty || i.to > l.from) && (e(l, s, i), t = l.number), o = l.to + 1;
    }
    let r = n.changes(s);
    return {
      changes: s,
      range: y.range(r.mapPos(i.anchor, 1), r.mapPos(i.head, 1))
    };
  });
}
const G0 = ({ state: n, dispatch: e }) => {
  if (n.readOnly)
    return !1;
  let t = /* @__PURE__ */ Object.create(null), i = new vs(n, { overrideIndentation: (r) => {
    let o = t[r];
    return o ?? -1;
  } }), s = To(n, (r, o, l) => {
    let a = vo(i, r.from);
    if (a == null)
      return;
    /\S/.test(r.text) || (a = 0);
    let h = /^\s*/.exec(r.text)[0], c = Gi(n, a);
    (h != c || l.from < r.from + h.length) && (t[r.from] = a, o.push({ from: r.from, to: r.from + h.length, insert: c }));
  });
  return s.changes.empty || e(n.update(s, { userEvent: "indent" })), !0;
}, H0 = ({ state: n, dispatch: e }) => n.readOnly ? !1 : (e(n.update(To(n, (t, i) => {
  i.push({ from: t.from, insert: n.facet(So) });
}), { userEvent: "input.indent" })), !0), F0 = ({ state: n, dispatch: e }) => n.readOnly ? !1 : (e(n.update(To(n, (t, i) => {
  let s = /^\s*/.exec(t.text)[0];
  if (!s)
    return;
  let r = Ji(s, n.tabSize), o = 0, l = Gi(n, Math.max(0, r - is(n)));
  for (; o < s.length && o < l.length && s.charCodeAt(o) == l.charCodeAt(o); )
    o++;
  i.push({ from: t.from + o, to: t.from + s.length, insert: l.slice(o) });
}), { userEvent: "delete.dedent" })), !0), z0 = [
  { key: "Ctrl-b", run: lf, shift: gf, preventDefault: !0 },
  { key: "Ctrl-f", run: af, shift: bf },
  { key: "Ctrl-p", run: ff, shift: wf },
  { key: "Ctrl-n", run: uf, shift: kf },
  { key: "Ctrl-a", run: h0, shift: k0 },
  { key: "Ctrl-e", run: c0, shift: S0 },
  { key: "Ctrl-d", run: Cf },
  { key: "Ctrl-h", run: jr },
  { key: "Ctrl-k", run: R0 },
  { key: "Ctrl-Alt-h", run: Af },
  { key: "Ctrl-o", run: T0 },
  { key: "Ctrl-t", run: D0 },
  { key: "Ctrl-v", run: $r }
], K0 = /* @__PURE__ */ [
  { key: "ArrowLeft", run: lf, shift: gf, preventDefault: !0 },
  { key: "Mod-ArrowLeft", mac: "Alt-ArrowLeft", run: e0, shift: d0, preventDefault: !0 },
  { mac: "Cmd-ArrowLeft", run: l0, shift: x0, preventDefault: !0 },
  { key: "ArrowRight", run: af, shift: bf, preventDefault: !0 },
  { key: "Mod-ArrowRight", mac: "Alt-ArrowRight", run: t0, shift: p0, preventDefault: !0 },
  { mac: "Cmd-ArrowRight", run: a0, shift: w0, preventDefault: !0 },
  { key: "ArrowUp", run: ff, shift: wf, preventDefault: !0 },
  { mac: "Cmd-ArrowUp", run: xa, shift: ka },
  { mac: "Ctrl-ArrowUp", run: ga, shift: ba },
  { key: "ArrowDown", run: uf, shift: kf, preventDefault: !0 },
  { mac: "Cmd-ArrowDown", run: wa, shift: Sa },
  { mac: "Ctrl-ArrowDown", run: $r, shift: ya },
  { key: "PageUp", run: ga, shift: ba },
  { key: "PageDown", run: $r, shift: ya },
  { key: "Home", run: o0, shift: y0, preventDefault: !0 },
  { key: "Mod-Home", run: xa, shift: ka },
  { key: "End", run: r0, shift: b0, preventDefault: !0 },
  { key: "Mod-End", run: wa, shift: Sa },
  { key: "Enter", run: E0 },
  { key: "Mod-a", run: v0 },
  { key: "Backspace", run: jr, shift: jr },
  { key: "Delete", run: Cf },
  { key: "Mod-Backspace", mac: "Alt-Backspace", run: Af },
  { key: "Mod-Delete", mac: "Alt-Delete", run: M0 },
  { mac: "Mod-Backspace", run: Z0 },
  { mac: "Mod-Delete", run: L0 }
].concat(/* @__PURE__ */ z0.map((n) => ({ mac: n.key, run: n.run, shift: n.shift }))), Y0 = /* @__PURE__ */ [
  { key: "Alt-ArrowLeft", mac: "Ctrl-ArrowLeft", run: n0, shift: m0 },
  { key: "Alt-ArrowRight", mac: "Ctrl-ArrowRight", run: s0, shift: g0 },
  { key: "Alt-ArrowUp", run: P0 },
  { key: "Shift-Alt-ArrowUp", run: B0 },
  { key: "Alt-ArrowDown", run: V0 },
  { key: "Shift-Alt-ArrowDown", run: W0 },
  { key: "Escape", run: A0 },
  { key: "Mod-Enter", run: N0 },
  { key: "Alt-l", mac: "Ctrl-l", run: C0 },
  { key: "Mod-i", run: O0, preventDefault: !0 },
  { key: "Mod-[", run: F0 },
  { key: "Mod-]", run: H0 },
  { key: "Mod-Alt-\\", run: G0 },
  { key: "Shift-Mod-k", run: X0 },
  { key: "Shift-Mod-\\", run: u0 },
  { key: "Mod-/", run: Bg },
  { key: "Alt-A", run: Xg }
].concat(K0), va = typeof String.prototype.normalize == "function" ? (n) => n.normalize("NFKD") : (n) => n;
class Hi {
  /**
  Create a text cursor. The query is the search string, `from` to
  `to` provides the region to search.
  
  When `normalize` is given, it will be called, on both the query
  string and the content it is matched against, before comparing.
  You can, for example, create a case-insensitive search by
  passing `s => s.toLowerCase()`.
  
  Text is always normalized with
  [`.normalize("NFKD")`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)
  (when supported).
  */
  constructor(e, t, i = 0, s = e.length, r, o) {
    this.test = o, this.value = { from: 0, to: 0 }, this.done = !1, this.matches = [], this.buffer = "", this.bufferPos = 0, this.iter = e.iterRange(i, s), this.bufferStart = i, this.normalize = r ? (l) => r(va(l)) : va, this.query = this.normalize(t);
  }
  peek() {
    if (this.bufferPos == this.buffer.length) {
      if (this.bufferStart += this.buffer.length, this.iter.next(), this.iter.done)
        return -1;
      this.bufferPos = 0, this.buffer = this.iter.value;
    }
    return le(this.buffer, this.bufferPos);
  }
  /**
  Look for the next match. Updates the iterator's
  [`value`](https://codemirror.net/6/docs/ref/#search.SearchCursor.value) and
  [`done`](https://codemirror.net/6/docs/ref/#search.SearchCursor.done) properties. Should be called
  at least once before using the cursor.
  */
  next() {
    for (; this.matches.length; )
      this.matches.pop();
    return this.nextOverlapping();
  }
  /**
  The `next` method will ignore matches that partially overlap a
  previous match. This method behaves like `next`, but includes
  such matches.
  */
  nextOverlapping() {
    for (; ; ) {
      let e = this.peek();
      if (e < 0)
        return this.done = !0, this;
      let t = lo(e), i = this.bufferStart + this.bufferPos;
      this.bufferPos += We(e);
      let s = this.normalize(t);
      for (let r = 0, o = i; ; r++) {
        let l = s.charCodeAt(r), a = this.match(l, o, this.bufferPos + this.bufferStart);
        if (r == s.length - 1) {
          if (a)
            return this.value = a, this;
          break;
        }
        o == i && r < t.length && t.charCodeAt(r) == l && o++;
      }
    }
  }
  match(e, t, i) {
    let s = null;
    for (let r = 0; r < this.matches.length; r += 2) {
      let o = this.matches[r], l = !1;
      this.query.charCodeAt(o) == e && (o == this.query.length - 1 ? s = { from: this.matches[r + 1], to: i } : (this.matches[r]++, l = !0)), l || (this.matches.splice(r, 2), r -= 2);
    }
    return this.query.charCodeAt(0) == e && (this.query.length == 1 ? s = { from: t, to: i } : this.matches.push(1, t)), s && this.test && !this.test(s.from, s.to, this.buffer, this.bufferStart) && (s = null), s;
  }
}
typeof Symbol < "u" && (Hi.prototype[Symbol.iterator] = function() {
  return this;
});
const Lf = { from: -1, to: -1, match: /* @__PURE__ */ /.*/.exec("") }, Do = "gm" + (/x/.unicode == null ? "" : "u");
class Tf {
  /**
  Create a cursor that will search the given range in the given
  document. `query` should be the raw pattern (as you'd pass it to
  `new RegExp`).
  */
  constructor(e, t, i, s = 0, r = e.length) {
    if (this.text = e, this.to = r, this.curLine = "", this.done = !1, this.value = Lf, /\\[sWDnr]|\n|\r|\[\^/.test(t))
      return new Df(e, t, i, s, r);
    this.re = new RegExp(t, Do + (i != null && i.ignoreCase ? "i" : "")), this.test = i == null ? void 0 : i.test, this.iter = e.iter();
    let o = e.lineAt(s);
    this.curLineStart = o.from, this.matchPos = os(e, s), this.getLine(this.curLineStart);
  }
  getLine(e) {
    this.iter.next(e), this.iter.lineBreak ? this.curLine = "" : (this.curLine = this.iter.value, this.curLineStart + this.curLine.length > this.to && (this.curLine = this.curLine.slice(0, this.to - this.curLineStart)), this.iter.next());
  }
  nextLine() {
    this.curLineStart = this.curLineStart + this.curLine.length + 1, this.curLineStart > this.to ? this.curLine = "" : this.getLine(0);
  }
  /**
  Move to the next match, if there is one.
  */
  next() {
    for (let e = this.matchPos - this.curLineStart; ; ) {
      this.re.lastIndex = e;
      let t = this.matchPos <= this.to && this.re.exec(this.curLine);
      if (t) {
        let i = this.curLineStart + t.index, s = i + t[0].length;
        if (this.matchPos = os(this.text, s + (i == s ? 1 : 0)), i == this.curLineStart + this.curLine.length && this.nextLine(), (i < s || i > this.value.to) && (!this.test || this.test(i, s, t)))
          return this.value = { from: i, to: s, match: t }, this;
        e = this.matchPos - this.curLineStart;
      } else if (this.curLineStart + this.curLine.length < this.to)
        this.nextLine(), e = 0;
      else
        return this.done = !0, this;
    }
  }
}
const sr = /* @__PURE__ */ new WeakMap();
class ii {
  constructor(e, t) {
    this.from = e, this.text = t;
  }
  get to() {
    return this.from + this.text.length;
  }
  static get(e, t, i) {
    let s = sr.get(e);
    if (!s || s.from >= i || s.to <= t) {
      let l = new ii(t, e.sliceString(t, i));
      return sr.set(e, l), l;
    }
    if (s.from == t && s.to == i)
      return s;
    let { text: r, from: o } = s;
    return o > t && (r = e.sliceString(t, o) + r, o = t), s.to < i && (r += e.sliceString(s.to, i)), sr.set(e, new ii(o, r)), new ii(t, r.slice(t - o, i - o));
  }
}
class Df {
  constructor(e, t, i, s, r) {
    this.text = e, this.to = r, this.done = !1, this.value = Lf, this.matchPos = os(e, s), this.re = new RegExp(t, Do + (i != null && i.ignoreCase ? "i" : "")), this.test = i == null ? void 0 : i.test, this.flat = ii.get(e, s, this.chunkEnd(
      s + 5e3
      /* Chunk.Base */
    ));
  }
  chunkEnd(e) {
    return e >= this.to ? this.to : this.text.lineAt(e).to;
  }
  next() {
    for (; ; ) {
      let e = this.re.lastIndex = this.matchPos - this.flat.from, t = this.re.exec(this.flat.text);
      if (t && !t[0] && t.index == e && (this.re.lastIndex = e + 1, t = this.re.exec(this.flat.text)), t) {
        let i = this.flat.from + t.index, s = i + t[0].length;
        if ((this.flat.to >= this.to || t.index + t[0].length <= this.flat.text.length - 10) && (!this.test || this.test(i, s, t)))
          return this.value = { from: i, to: s, match: t }, this.matchPos = os(this.text, s + (i == s ? 1 : 0)), this;
      }
      if (this.flat.to == this.to)
        return this.done = !0, this;
      this.flat = ii.get(this.text, this.flat.from, this.chunkEnd(this.flat.from + this.flat.text.length * 2));
    }
  }
}
typeof Symbol < "u" && (Tf.prototype[Symbol.iterator] = Df.prototype[Symbol.iterator] = function() {
  return this;
});
function J0(n) {
  try {
    return new RegExp(n, Do), !0;
  } catch {
    return !1;
  }
}
function os(n, e) {
  if (e >= n.length)
    return e;
  let t = n.lineAt(e), i;
  for (; e < t.to && (i = t.text.charCodeAt(e - t.from)) >= 56320 && i < 57344; )
    e++;
  return e;
}
function qr(n) {
  let e = String(n.state.doc.lineAt(n.state.selection.main.head).number), t = z("input", { class: "cm-textfield", name: "line", value: e }), i = z("form", {
    class: "cm-gotoLine",
    onkeydown: (r) => {
      r.keyCode == 27 ? (r.preventDefault(), n.dispatch({ effects: ls.of(!1) }), n.focus()) : r.keyCode == 13 && (r.preventDefault(), s());
    },
    onsubmit: (r) => {
      r.preventDefault(), s();
    }
  }, z("label", n.state.phrase("Go to line"), ": ", t), " ", z("button", { class: "cm-button", type: "submit" }, n.state.phrase("go")));
  function s() {
    let r = /^([+-])?(\d+)?(:\d+)?(%)?$/.exec(t.value);
    if (!r)
      return;
    let { state: o } = n, l = o.doc.lineAt(o.selection.main.head), [, a, h, c, f] = r, u = c ? +c.slice(1) : 0, d = h ? +h : l.number;
    if (h && f) {
      let m = d / 100;
      a && (m = m * (a == "-" ? -1 : 1) + l.number / o.doc.lines), d = Math.round(o.doc.lines * m);
    } else
      h && a && (d = d * (a == "-" ? -1 : 1) + l.number);
    let p = o.doc.line(Math.max(1, Math.min(o.doc.lines, d))), g = y.cursor(p.from + Math.max(0, Math.min(u, p.length)));
    n.dispatch({
      effects: [ls.of(!1), Z.scrollIntoView(g.from, { y: "center" })],
      selection: g
    }), n.focus();
  }
  return { dom: i };
}
const ls = /* @__PURE__ */ L.define(), Ca = /* @__PURE__ */ ee.define({
  create() {
    return !0;
  },
  update(n, e) {
    for (let t of e.effects)
      t.is(ls) && (n = t.value);
    return n;
  },
  provide: (n) => Ni.from(n, (e) => e ? qr : null)
}), Q0 = (n) => {
  let e = Ei(n, qr);
  if (!e) {
    let t = [ls.of(!0)];
    n.state.field(Ca, !1) == null && t.push(L.appendConfig.of([Ca, U0])), n.dispatch({ effects: t }), e = Ei(n, qr);
  }
  return e && e.dom.querySelector("input").select(), !0;
}, U0 = /* @__PURE__ */ Z.baseTheme({
  ".cm-panel.cm-gotoLine": {
    padding: "2px 6px 4px",
    "& label": { fontSize: "80%" }
  }
}), $0 = ({ state: n, dispatch: e }) => {
  let { selection: t } = n, i = y.create(t.ranges.map((s) => n.wordAt(s.head) || y.cursor(s.head)), t.mainIndex);
  return i.eq(t) ? !1 : (e(n.update({ selection: i })), !0);
};
function j0(n, e) {
  let { main: t, ranges: i } = n.selection, s = n.wordAt(t.head), r = s && s.from == t.from && s.to == t.to;
  for (let o = !1, l = new Hi(n.doc, e, i[i.length - 1].to); ; )
    if (l.next(), l.done) {
      if (o)
        return null;
      l = new Hi(n.doc, e, 0, Math.max(0, i[i.length - 1].from - 1)), o = !0;
    } else {
      if (o && i.some((a) => a.from == l.value.from))
        continue;
      if (r) {
        let a = n.wordAt(l.value.from);
        if (!a || a.from != l.value.from || a.to != l.value.to)
          continue;
      }
      return l.value;
    }
}
const q0 = ({ state: n, dispatch: e }) => {
  let { ranges: t } = n.selection;
  if (t.some((r) => r.from === r.to))
    return $0({ state: n, dispatch: e });
  let i = n.sliceDoc(t[0].from, t[0].to);
  if (n.selection.ranges.some((r) => n.sliceDoc(r.from, r.to) != i))
    return !1;
  let s = j0(n, i);
  return s ? (e(n.update({
    selection: n.selection.addRange(y.range(s.from, s.to), !1),
    effects: Z.scrollIntoView(s.to)
  })), !0) : !1;
}, fi = /* @__PURE__ */ M.define({
  combine(n) {
    return tt(n, {
      top: !1,
      caseSensitive: !1,
      literal: !1,
      regexp: !1,
      wholeWord: !1,
      createPanel: (e) => new cb(e),
      scrollToMatch: (e) => Z.scrollIntoView(e)
    });
  }
});
class Pf {
  /**
  Create a query object.
  */
  constructor(e) {
    this.search = e.search, this.caseSensitive = !!e.caseSensitive, this.literal = !!e.literal, this.regexp = !!e.regexp, this.replace = e.replace || "", this.valid = !!this.search && (!this.regexp || J0(this.search)), this.unquoted = this.unquote(this.search), this.wholeWord = !!e.wholeWord;
  }
  /**
  @internal
  */
  unquote(e) {
    return this.literal ? e : e.replace(/\\([nrt\\])/g, (t, i) => i == "n" ? `
` : i == "r" ? "\r" : i == "t" ? "	" : "\\");
  }
  /**
  Compare this query to another query.
  */
  eq(e) {
    return this.search == e.search && this.replace == e.replace && this.caseSensitive == e.caseSensitive && this.regexp == e.regexp && this.wholeWord == e.wholeWord;
  }
  /**
  @internal
  */
  create() {
    return this.regexp ? new ib(this) : new eb(this);
  }
  /**
  Get a search cursor for this query, searching through the given
  range in the given state.
  */
  getCursor(e, t = 0, i) {
    let s = e.doc ? e : G.create({ doc: e });
    return i == null && (i = s.doc.length), this.regexp ? Jt(this, s, t, i) : Yt(this, s, t, i);
  }
}
class Vf {
  constructor(e) {
    this.spec = e;
  }
}
function Yt(n, e, t, i) {
  return new Hi(e.doc, n.unquoted, t, i, n.caseSensitive ? void 0 : (s) => s.toLowerCase(), n.wholeWord ? _0(e.doc, e.charCategorizer(e.selection.main.head)) : void 0);
}
function _0(n, e) {
  return (t, i, s, r) => ((r > t || r + s.length < i) && (r = Math.max(0, t - 2), s = n.sliceString(r, Math.min(n.length, i + 2))), (e(as(s, t - r)) != q.Word || e(hs(s, t - r)) != q.Word) && (e(hs(s, i - r)) != q.Word || e(as(s, i - r)) != q.Word));
}
class eb extends Vf {
  constructor(e) {
    super(e);
  }
  nextMatch(e, t, i) {
    let s = Yt(this.spec, e, i, e.doc.length).nextOverlapping();
    return s.done && (s = Yt(this.spec, e, 0, t).nextOverlapping()), s.done ? null : s.value;
  }
  // Searching in reverse is, rather than implementing an inverted search
  // cursor, done by scanning chunk after chunk forward.
  prevMatchInRange(e, t, i) {
    for (let s = i; ; ) {
      let r = Math.max(t, s - 1e4 - this.spec.unquoted.length), o = Yt(this.spec, e, r, s), l = null;
      for (; !o.nextOverlapping().done; )
        l = o.value;
      if (l)
        return l;
      if (r == t)
        return null;
      s -= 1e4;
    }
  }
  prevMatch(e, t, i) {
    return this.prevMatchInRange(e, 0, t) || this.prevMatchInRange(e, i, e.doc.length);
  }
  getReplacement(e) {
    return this.spec.unquote(this.spec.replace);
  }
  matchAll(e, t) {
    let i = Yt(this.spec, e, 0, e.doc.length), s = [];
    for (; !i.next().done; ) {
      if (s.length >= t)
        return null;
      s.push(i.value);
    }
    return s;
  }
  highlight(e, t, i, s) {
    let r = Yt(this.spec, e, Math.max(0, t - this.spec.unquoted.length), Math.min(i + this.spec.unquoted.length, e.doc.length));
    for (; !r.next().done; )
      s(r.value.from, r.value.to);
  }
}
function Jt(n, e, t, i) {
  return new Tf(e.doc, n.search, {
    ignoreCase: !n.caseSensitive,
    test: n.wholeWord ? tb(e.charCategorizer(e.selection.main.head)) : void 0
  }, t, i);
}
function as(n, e) {
  return n.slice(ce(n, e, !1), e);
}
function hs(n, e) {
  return n.slice(e, ce(n, e));
}
function tb(n) {
  return (e, t, i) => !i[0].length || (n(as(i.input, i.index)) != q.Word || n(hs(i.input, i.index)) != q.Word) && (n(hs(i.input, i.index + i[0].length)) != q.Word || n(as(i.input, i.index + i[0].length)) != q.Word);
}
class ib extends Vf {
  nextMatch(e, t, i) {
    let s = Jt(this.spec, e, i, e.doc.length).next();
    return s.done && (s = Jt(this.spec, e, 0, t).next()), s.done ? null : s.value;
  }
  prevMatchInRange(e, t, i) {
    for (let s = 1; ; s++) {
      let r = Math.max(
        t,
        i - s * 1e4
        /* FindPrev.ChunkSize */
      ), o = Jt(this.spec, e, r, i), l = null;
      for (; !o.next().done; )
        l = o.value;
      if (l && (r == t || l.from > r + 10))
        return l;
      if (r == t)
        return null;
    }
  }
  prevMatch(e, t, i) {
    return this.prevMatchInRange(e, 0, t) || this.prevMatchInRange(e, i, e.doc.length);
  }
  getReplacement(e) {
    return this.spec.unquote(this.spec.replace).replace(/\$([$&\d+])/g, (t, i) => i == "$" ? "$" : i == "&" ? e.match[0] : i != "0" && +i < e.match.length ? e.match[i] : t);
  }
  matchAll(e, t) {
    let i = Jt(this.spec, e, 0, e.doc.length), s = [];
    for (; !i.next().done; ) {
      if (s.length >= t)
        return null;
      s.push(i.value);
    }
    return s;
  }
  highlight(e, t, i, s) {
    let r = Jt(this.spec, e, Math.max(
      0,
      t - 250
      /* RegExp.HighlightMargin */
    ), Math.min(i + 250, e.doc.length));
    for (; !r.next().done; )
      s(r.value.from, r.value.to);
  }
}
const Fi = /* @__PURE__ */ L.define(), Po = /* @__PURE__ */ L.define(), yt = /* @__PURE__ */ ee.define({
  create(n) {
    return new rr(_r(n).create(), null);
  },
  update(n, e) {
    for (let t of e.effects)
      t.is(Fi) ? n = new rr(t.value.create(), n.panel) : t.is(Po) && (n = new rr(n.query, t.value ? Vo : null));
    return n;
  },
  provide: (n) => Ni.from(n, (e) => e.panel)
});
class rr {
  constructor(e, t) {
    this.query = e, this.panel = t;
  }
}
const nb = /* @__PURE__ */ T.mark({ class: "cm-searchMatch" }), sb = /* @__PURE__ */ T.mark({ class: "cm-searchMatch cm-searchMatch-selected" }), rb = /* @__PURE__ */ _.fromClass(class {
  constructor(n) {
    this.view = n, this.decorations = this.highlight(n.state.field(yt));
  }
  update(n) {
    let e = n.state.field(yt);
    (e != n.startState.field(yt) || n.docChanged || n.selectionSet || n.viewportChanged) && (this.decorations = this.highlight(e));
  }
  highlight({ query: n, panel: e }) {
    if (!e || !n.spec.valid)
      return T.none;
    let { view: t } = this, i = new kt();
    for (let s = 0, r = t.visibleRanges, o = r.length; s < o; s++) {
      let { from: l, to: a } = r[s];
      for (; s < o - 1 && a > r[s + 1].from - 2 * 250; )
        a = r[++s].to;
      n.highlight(t.state, l, a, (h, c) => {
        let f = t.state.selection.ranges.some((u) => u.from == h && u.to == c);
        i.add(h, c, f ? sb : nb);
      });
    }
    return i.finish();
  }
}, {
  decorations: (n) => n.decorations
});
function en(n) {
  return (e) => {
    let t = e.state.field(yt, !1);
    return t && t.query.spec.valid ? n(e, t) : Xf(e);
  };
}
const cs = /* @__PURE__ */ en((n, { query: e }) => {
  let { to: t } = n.state.selection.main, i = e.nextMatch(n.state, t, t);
  if (!i)
    return !1;
  let s = y.single(i.from, i.to), r = n.state.facet(fi);
  return n.dispatch({
    selection: s,
    effects: [Bo(n, i), r.scrollToMatch(s.main, n)],
    userEvent: "select.search"
  }), Wf(n), !0;
}), fs = /* @__PURE__ */ en((n, { query: e }) => {
  let { state: t } = n, { from: i } = t.selection.main, s = e.prevMatch(t, i, i);
  if (!s)
    return !1;
  let r = y.single(s.from, s.to), o = n.state.facet(fi);
  return n.dispatch({
    selection: r,
    effects: [Bo(n, s), o.scrollToMatch(r.main, n)],
    userEvent: "select.search"
  }), Wf(n), !0;
}), ob = /* @__PURE__ */ en((n, { query: e }) => {
  let t = e.matchAll(n.state, 1e3);
  return !t || !t.length ? !1 : (n.dispatch({
    selection: y.create(t.map((i) => y.range(i.from, i.to))),
    userEvent: "select.search.matches"
  }), !0);
}), lb = ({ state: n, dispatch: e }) => {
  let t = n.selection;
  if (t.ranges.length > 1 || t.main.empty)
    return !1;
  let { from: i, to: s } = t.main, r = [], o = 0;
  for (let l = new Hi(n.doc, n.sliceDoc(i, s)); !l.next().done; ) {
    if (r.length > 1e3)
      return !1;
    l.value.from == i && (o = r.length), r.push(y.range(l.value.from, l.value.to));
  }
  return e(n.update({
    selection: y.create(r, o),
    userEvent: "select.search.matches"
  })), !0;
}, Oa = /* @__PURE__ */ en((n, { query: e }) => {
  let { state: t } = n, { from: i, to: s } = t.selection.main;
  if (t.readOnly)
    return !1;
  let r = e.nextMatch(t, i, i);
  if (!r)
    return !1;
  let o = [], l, a, h = [];
  if (r.from == i && r.to == s && (a = t.toText(e.getReplacement(r)), o.push({ from: r.from, to: r.to, insert: a }), r = e.nextMatch(t, r.from, r.to), h.push(Z.announce.of(t.phrase("replaced match on line $", t.doc.lineAt(i).number) + "."))), r) {
    let c = o.length == 0 || o[0].from >= r.to ? 0 : r.to - r.from - a.length;
    l = y.single(r.from - c, r.to - c), h.push(Bo(n, r)), h.push(t.facet(fi).scrollToMatch(l.main, n));
  }
  return n.dispatch({
    changes: o,
    selection: l,
    effects: h,
    userEvent: "input.replace"
  }), !0;
}), ab = /* @__PURE__ */ en((n, { query: e }) => {
  if (n.state.readOnly)
    return !1;
  let t = e.matchAll(n.state, 1e9).map((s) => {
    let { from: r, to: o } = s;
    return { from: r, to: o, insert: e.getReplacement(s) };
  });
  if (!t.length)
    return !1;
  let i = n.state.phrase("replaced $ matches", t.length) + ".";
  return n.dispatch({
    changes: t,
    effects: Z.announce.of(i),
    userEvent: "input.replace.all"
  }), !0;
});
function Vo(n) {
  return n.state.facet(fi).createPanel(n);
}
function _r(n, e) {
  var t, i, s, r, o;
  let l = n.selection.main, a = l.empty || l.to > l.from + 100 ? "" : n.sliceDoc(l.from, l.to);
  if (e && !a)
    return e;
  let h = n.facet(fi);
  return new Pf({
    search: ((t = e == null ? void 0 : e.literal) !== null && t !== void 0 ? t : h.literal) ? a : a.replace(/\n/g, "\\n"),
    caseSensitive: (i = e == null ? void 0 : e.caseSensitive) !== null && i !== void 0 ? i : h.caseSensitive,
    literal: (s = e == null ? void 0 : e.literal) !== null && s !== void 0 ? s : h.literal,
    regexp: (r = e == null ? void 0 : e.regexp) !== null && r !== void 0 ? r : h.regexp,
    wholeWord: (o = e == null ? void 0 : e.wholeWord) !== null && o !== void 0 ? o : h.wholeWord
  });
}
function Bf(n) {
  let e = Ei(n, Vo);
  return e && e.dom.querySelector("[main-field]");
}
function Wf(n) {
  let e = Bf(n);
  e && e == n.root.activeElement && e.select();
}
const Xf = (n) => {
  let e = n.state.field(yt, !1);
  if (e && e.panel) {
    let t = Bf(n);
    if (t && t != n.root.activeElement) {
      let i = _r(n.state, e.query.spec);
      i.valid && n.dispatch({ effects: Fi.of(i) }), t.focus(), t.select();
    }
  } else
    n.dispatch({ effects: [
      Po.of(!0),
      e ? Fi.of(_r(n.state, e.query.spec)) : L.appendConfig.of(ub)
    ] });
  return !0;
}, If = (n) => {
  let e = n.state.field(yt, !1);
  if (!e || !e.panel)
    return !1;
  let t = Ei(n, Vo);
  return t && t.dom.contains(n.root.activeElement) && n.focus(), n.dispatch({ effects: Po.of(!1) }), !0;
}, hb = [
  { key: "Mod-f", run: Xf, scope: "editor search-panel" },
  { key: "F3", run: cs, shift: fs, scope: "editor search-panel", preventDefault: !0 },
  { key: "Mod-g", run: cs, shift: fs, scope: "editor search-panel", preventDefault: !0 },
  { key: "Escape", run: If, scope: "editor search-panel" },
  { key: "Mod-Shift-l", run: lb },
  { key: "Mod-Alt-g", run: Q0 },
  { key: "Mod-d", run: q0, preventDefault: !0 }
];
class cb {
  constructor(e) {
    this.view = e;
    let t = this.query = e.state.field(yt).query.spec;
    this.commit = this.commit.bind(this), this.searchField = z("input", {
      value: t.search,
      placeholder: Ze(e, "Find"),
      "aria-label": Ze(e, "Find"),
      class: "cm-textfield",
      name: "search",
      form: "",
      "main-field": "true",
      onchange: this.commit,
      onkeyup: this.commit
    }), this.replaceField = z("input", {
      value: t.replace,
      placeholder: Ze(e, "Replace"),
      "aria-label": Ze(e, "Replace"),
      class: "cm-textfield",
      name: "replace",
      form: "",
      onchange: this.commit,
      onkeyup: this.commit
    }), this.caseField = z("input", {
      type: "checkbox",
      name: "case",
      form: "",
      checked: t.caseSensitive,
      onchange: this.commit
    }), this.reField = z("input", {
      type: "checkbox",
      name: "re",
      form: "",
      checked: t.regexp,
      onchange: this.commit
    }), this.wordField = z("input", {
      type: "checkbox",
      name: "word",
      form: "",
      checked: t.wholeWord,
      onchange: this.commit
    });
    function i(s, r, o) {
      return z("button", { class: "cm-button", name: s, onclick: r, type: "button" }, o);
    }
    this.dom = z("div", { onkeydown: (s) => this.keydown(s), class: "cm-search" }, [
      this.searchField,
      i("next", () => cs(e), [Ze(e, "next")]),
      i("prev", () => fs(e), [Ze(e, "previous")]),
      i("select", () => ob(e), [Ze(e, "all")]),
      z("label", null, [this.caseField, Ze(e, "match case")]),
      z("label", null, [this.reField, Ze(e, "regexp")]),
      z("label", null, [this.wordField, Ze(e, "by word")]),
      ...e.state.readOnly ? [] : [
        z("br"),
        this.replaceField,
        i("replace", () => Oa(e), [Ze(e, "replace")]),
        i("replaceAll", () => ab(e), [Ze(e, "replace all")])
      ],
      z("button", {
        name: "close",
        onclick: () => If(e),
        "aria-label": Ze(e, "close"),
        type: "button"
      }, ["×"])
    ]);
  }
  commit() {
    let e = new Pf({
      search: this.searchField.value,
      caseSensitive: this.caseField.checked,
      regexp: this.reField.checked,
      wholeWord: this.wordField.checked,
      replace: this.replaceField.value
    });
    e.eq(this.query) || (this.query = e, this.view.dispatch({ effects: Fi.of(e) }));
  }
  keydown(e) {
    Op(this.view, e, "search-panel") ? e.preventDefault() : e.keyCode == 13 && e.target == this.searchField ? (e.preventDefault(), (e.shiftKey ? fs : cs)(this.view)) : e.keyCode == 13 && e.target == this.replaceField && (e.preventDefault(), Oa(this.view));
  }
  update(e) {
    for (let t of e.transactions)
      for (let i of t.effects)
        i.is(Fi) && !i.value.eq(this.query) && this.setQuery(i.value);
  }
  setQuery(e) {
    this.query = e, this.searchField.value = e.search, this.replaceField.value = e.replace, this.caseField.checked = e.caseSensitive, this.reField.checked = e.regexp, this.wordField.checked = e.wholeWord;
  }
  mount() {
    this.searchField.select();
  }
  get pos() {
    return 80;
  }
  get top() {
    return this.view.state.facet(fi).top;
  }
}
function Ze(n, e) {
  return n.state.phrase(e);
}
const On = 30, An = /[\s\.,:;?!]/;
function Bo(n, { from: e, to: t }) {
  let i = n.state.doc.lineAt(e), s = n.state.doc.lineAt(t).to, r = Math.max(i.from, e - On), o = Math.min(s, t + On), l = n.state.sliceDoc(r, o);
  if (r != i.from) {
    for (let a = 0; a < On; a++)
      if (!An.test(l[a + 1]) && An.test(l[a])) {
        l = l.slice(a);
        break;
      }
  }
  if (o != s) {
    for (let a = l.length - 1; a > l.length - On; a--)
      if (!An.test(l[a - 1]) && An.test(l[a])) {
        l = l.slice(0, a);
        break;
      }
  }
  return Z.announce.of(`${n.state.phrase("current match")}. ${l} ${n.state.phrase("on line")} ${i.number}.`);
}
const fb = /* @__PURE__ */ Z.baseTheme({
  ".cm-panel.cm-search": {
    padding: "2px 6px 4px",
    position: "relative",
    "& [name=close]": {
      position: "absolute",
      top: "0",
      right: "4px",
      backgroundColor: "inherit",
      border: "none",
      font: "inherit",
      padding: 0,
      margin: 0
    },
    "& input, & button, & label": {
      margin: ".2em .6em .2em 0"
    },
    "& input[type=checkbox]": {
      marginRight: ".2em"
    },
    "& label": {
      fontSize: "80%",
      whiteSpace: "pre"
    }
  },
  "&light .cm-searchMatch": { backgroundColor: "#ffff0054" },
  "&dark .cm-searchMatch": { backgroundColor: "#00ffff8a" },
  "&light .cm-searchMatch-selected": { backgroundColor: "#ff6a0054" },
  "&dark .cm-searchMatch-selected": { backgroundColor: "#ff00ff8a" }
}), ub = [
  yt,
  /* @__PURE__ */ Gt.low(rb),
  fb
];
class Ef {
  /**
  Create a new completion context. (Mostly useful for testing
  completion sources—in the editor, the extension will create
  these for you.)
  */
  constructor(e, t, i) {
    this.state = e, this.pos = t, this.explicit = i, this.abortListeners = [];
  }
  /**
  Get the extent, content, and (if there is a token) type of the
  token before `this.pos`.
  */
  tokenBefore(e) {
    let t = pe(this.state).resolveInner(this.pos, -1);
    for (; t && e.indexOf(t.name) < 0; )
      t = t.parent;
    return t ? {
      from: t.from,
      to: this.pos,
      text: this.state.sliceDoc(t.from, this.pos),
      type: t.type
    } : null;
  }
  /**
  Get the match of the given expression directly before the
  cursor.
  */
  matchBefore(e) {
    let t = this.state.doc.lineAt(this.pos), i = Math.max(t.from, this.pos - 250), s = t.text.slice(i - t.from, this.pos - t.from), r = s.search(Nf(e, !1));
    return r < 0 ? null : { from: i + r, to: this.pos, text: s.slice(r) };
  }
  /**
  Yields true when the query has been aborted. Can be useful in
  asynchronous queries to avoid doing work that will be ignored.
  */
  get aborted() {
    return this.abortListeners == null;
  }
  /**
  Allows you to register abort handlers, which will be called when
  the query is
  [aborted](https://codemirror.net/6/docs/ref/#autocomplete.CompletionContext.aborted).
  */
  addEventListener(e, t) {
    e == "abort" && this.abortListeners && this.abortListeners.push(t);
  }
}
function Aa(n) {
  let e = Object.keys(n).join(""), t = /\w/.test(e);
  return t && (e = e.replace(/\w/g, "")), `[${t ? "\\w" : ""}${e.replace(/[^\w\s]/g, "\\$&")}]`;
}
function db(n) {
  let e = /* @__PURE__ */ Object.create(null), t = /* @__PURE__ */ Object.create(null);
  for (let { label: s } of n) {
    e[s[0]] = !0;
    for (let r = 1; r < s.length; r++)
      t[s[r]] = !0;
  }
  let i = Aa(e) + Aa(t) + "*$";
  return [new RegExp("^" + i), new RegExp(i)];
}
function pb(n) {
  let e = n.map((s) => typeof s == "string" ? { label: s } : s), [t, i] = e.every((s) => /^\w+$/.test(s.label)) ? [/\w*$/, /\w+$/] : db(e);
  return (s) => {
    let r = s.matchBefore(i);
    return r || s.explicit ? { from: r ? r.from : s.pos, options: e, validFor: t } : null;
  };
}
class Ma {
  constructor(e, t, i, s) {
    this.completion = e, this.source = t, this.match = i, this.score = s;
  }
}
function xt(n) {
  return n.selection.main.from;
}
function Nf(n, e) {
  var t;
  let { source: i } = n, s = e && i[0] != "^", r = i[i.length - 1] != "$";
  return !s && !r ? n : new RegExp(`${s ? "^" : ""}(?:${i})${r ? "$" : ""}`, (t = n.flags) !== null && t !== void 0 ? t : n.ignoreCase ? "i" : "");
}
const mb = /* @__PURE__ */ ht.define();
function gb(n, e, t, i) {
  let { main: s } = n.selection, r = t - s.from, o = i - s.from;
  return Object.assign(Object.assign({}, n.changeByRange((l) => l != s && t != i && n.sliceDoc(l.from + r, l.from + o) != n.sliceDoc(t, i) ? { range: l } : {
    changes: { from: l.from + r, to: i == s.from ? l.to : l.from + o, insert: e },
    range: y.cursor(l.from + r + e.length)
  })), { scrollIntoView: !0, userEvent: "input.complete" });
}
const Ra = /* @__PURE__ */ new WeakMap();
function bb(n) {
  if (!Array.isArray(n))
    return n;
  let e = Ra.get(n);
  return e || Ra.set(n, e = pb(n)), e;
}
const us = /* @__PURE__ */ L.define(), zi = /* @__PURE__ */ L.define();
class yb {
  constructor(e) {
    this.pattern = e, this.chars = [], this.folded = [], this.any = [], this.precise = [], this.byWord = [], this.score = 0, this.matched = [];
    for (let t = 0; t < e.length; ) {
      let i = le(e, t), s = We(i);
      this.chars.push(i);
      let r = e.slice(t, t + s), o = r.toUpperCase();
      this.folded.push(le(o == r ? r.toLowerCase() : o, 0)), t += s;
    }
    this.astral = e.length != this.chars.length;
  }
  ret(e, t) {
    return this.score = e, this.matched = t, !0;
  }
  // Matches a given word (completion) against the pattern (input).
  // Will return a boolean indicating whether there was a match and,
  // on success, set `this.score` to the score, `this.matched` to an
  // array of `from, to` pairs indicating the matched parts of `word`.
  //
  // The score is a number that is more negative the worse the match
  // is. See `Penalty` above.
  match(e) {
    if (this.pattern.length == 0)
      return this.ret(-100, []);
    if (e.length < this.pattern.length)
      return !1;
    let { chars: t, folded: i, any: s, precise: r, byWord: o } = this;
    if (t.length == 1) {
      let k = le(e, 0), C = We(k), S = C == e.length ? 0 : -100;
      if (k != t[0])
        if (k == i[0])
          S += -200;
        else
          return !1;
      return this.ret(S, [0, C]);
    }
    let l = e.indexOf(this.pattern);
    if (l == 0)
      return this.ret(e.length == this.pattern.length ? 0 : -100, [0, this.pattern.length]);
    let a = t.length, h = 0;
    if (l < 0) {
      for (let k = 0, C = Math.min(e.length, 200); k < C && h < a; ) {
        let S = le(e, k);
        (S == t[h] || S == i[h]) && (s[h++] = k), k += We(S);
      }
      if (h < a)
        return !1;
    }
    let c = 0, f = 0, u = !1, d = 0, p = -1, g = -1, m = /[a-z]/.test(e), b = !0;
    for (let k = 0, C = Math.min(e.length, 200), S = 0; k < C && f < a; ) {
      let w = le(e, k);
      l < 0 && (c < a && w == t[c] && (r[c++] = k), d < a && (w == t[d] || w == i[d] ? (d == 0 && (p = k), g = k + 1, d++) : d = 0));
      let A, O = w < 255 ? w >= 48 && w <= 57 || w >= 97 && w <= 122 ? 2 : w >= 65 && w <= 90 ? 1 : 0 : (A = lo(w)) != A.toLowerCase() ? 1 : A != A.toUpperCase() ? 2 : 0;
      (!k || O == 1 && m || S == 0 && O != 0) && (t[f] == w || i[f] == w && (u = !0) ? o[f++] = k : o.length && (b = !1)), S = O, k += We(w);
    }
    return f == a && o[0] == 0 && b ? this.result(-100 + (u ? -200 : 0), o, e) : d == a && p == 0 ? this.ret(-200 - e.length + (g == e.length ? 0 : -100), [0, g]) : l > -1 ? this.ret(-700 - e.length, [l, l + this.pattern.length]) : d == a ? this.ret(-200 + -700 - e.length, [p, g]) : f == a ? this.result(-100 + (u ? -200 : 0) + -700 + (b ? 0 : -1100), o, e) : t.length == 2 ? !1 : this.result((s[0] ? -700 : 0) + -200 + -1100, s, e);
  }
  result(e, t, i) {
    let s = [], r = 0;
    for (let o of t) {
      let l = o + (this.astral ? We(le(i, o)) : 1);
      r && s[r - 1] == o ? s[r - 1] = l : (s[r++] = o, s[r++] = l);
    }
    return this.ret(e - i.length, s);
  }
}
const he = /* @__PURE__ */ M.define({
  combine(n) {
    return tt(n, {
      activateOnTyping: !0,
      activateOnTypingDelay: 100,
      selectOnOpen: !0,
      override: null,
      closeOnBlur: !0,
      maxRenderedOptions: 100,
      defaultKeymap: !0,
      tooltipClass: () => "",
      optionClass: () => "",
      aboveCursor: !1,
      icons: !0,
      addToOptions: [],
      positionInfo: xb,
      compareCompletions: (e, t) => e.label.localeCompare(t.label),
      interactionDelay: 75,
      updateSyncTime: 100
    }, {
      defaultKeymap: (e, t) => e && t,
      closeOnBlur: (e, t) => e && t,
      icons: (e, t) => e && t,
      tooltipClass: (e, t) => (i) => Za(e(i), t(i)),
      optionClass: (e, t) => (i) => Za(e(i), t(i)),
      addToOptions: (e, t) => e.concat(t)
    });
  }
});
function Za(n, e) {
  return n ? e ? n + " " + e : n : e;
}
function xb(n, e, t, i, s, r) {
  let o = n.textDirection == J.RTL, l = o, a = !1, h = "top", c, f, u = e.left - s.left, d = s.right - e.right, p = i.right - i.left, g = i.bottom - i.top;
  if (l && u < Math.min(p, d) ? l = !1 : !l && d < Math.min(p, u) && (l = !0), p <= (l ? u : d))
    c = Math.max(s.top, Math.min(t.top, s.bottom - g)) - e.top, f = Math.min(400, l ? u : d);
  else {
    a = !0, f = Math.min(
      400,
      (o ? e.right : s.right - e.left) - 30
      /* Info.Margin */
    );
    let k = s.bottom - e.bottom;
    k >= g || k > e.top ? c = t.bottom - e.top : (h = "bottom", c = e.bottom - t.top);
  }
  let m = (e.bottom - e.top) / r.offsetHeight, b = (e.right - e.left) / r.offsetWidth;
  return {
    style: `${h}: ${c / m}px; max-width: ${f / b}px`,
    class: "cm-completionInfo-" + (a ? o ? "left-narrow" : "right-narrow" : l ? "left" : "right")
  };
}
function wb(n) {
  let e = n.addToOptions.slice();
  return n.icons && e.push({
    render(t) {
      let i = document.createElement("div");
      return i.classList.add("cm-completionIcon"), t.type && i.classList.add(...t.type.split(/\s+/g).map((s) => "cm-completionIcon-" + s)), i.setAttribute("aria-hidden", "true"), i;
    },
    position: 20
  }), e.push({
    render(t, i, s, r) {
      let o = document.createElement("span");
      o.className = "cm-completionLabel";
      let l = t.displayLabel || t.label, a = 0;
      for (let h = 0; h < r.length; ) {
        let c = r[h++], f = r[h++];
        c > a && o.appendChild(document.createTextNode(l.slice(a, c)));
        let u = o.appendChild(document.createElement("span"));
        u.appendChild(document.createTextNode(l.slice(c, f))), u.className = "cm-completionMatchedText", a = f;
      }
      return a < l.length && o.appendChild(document.createTextNode(l.slice(a))), o;
    },
    position: 50
  }, {
    render(t) {
      if (!t.detail)
        return null;
      let i = document.createElement("span");
      return i.className = "cm-completionDetail", i.textContent = t.detail, i;
    },
    position: 80
  }), e.sort((t, i) => t.position - i.position).map((t) => t.render);
}
function or(n, e, t) {
  if (n <= t)
    return { from: 0, to: n };
  if (e < 0 && (e = 0), e <= n >> 1) {
    let s = Math.floor(e / t);
    return { from: s * t, to: (s + 1) * t };
  }
  let i = Math.floor((n - e) / t);
  return { from: n - (i + 1) * t, to: n - i * t };
}
class kb {
  constructor(e, t, i) {
    this.view = e, this.stateField = t, this.applyCompletion = i, this.info = null, this.infoDestroy = null, this.placeInfoReq = {
      read: () => this.measureInfo(),
      write: (a) => this.placeInfo(a),
      key: this
    }, this.space = null, this.currentClass = "";
    let s = e.state.field(t), { options: r, selected: o } = s.open, l = e.state.facet(he);
    this.optionContent = wb(l), this.optionClass = l.optionClass, this.tooltipClass = l.tooltipClass, this.range = or(r.length, o, l.maxRenderedOptions), this.dom = document.createElement("div"), this.dom.className = "cm-tooltip-autocomplete", this.updateTooltipClass(e.state), this.dom.addEventListener("mousedown", (a) => {
      let { options: h } = e.state.field(t).open;
      for (let c = a.target, f; c && c != this.dom; c = c.parentNode)
        if (c.nodeName == "LI" && (f = /-(\d+)$/.exec(c.id)) && +f[1] < h.length) {
          this.applyCompletion(e, h[+f[1]]), a.preventDefault();
          return;
        }
    }), this.dom.addEventListener("focusout", (a) => {
      let h = e.state.field(this.stateField, !1);
      h && h.tooltip && e.state.facet(he).closeOnBlur && a.relatedTarget != e.contentDOM && e.dispatch({ effects: zi.of(null) });
    }), this.showOptions(r, s.id);
  }
  mount() {
    this.updateSel();
  }
  showOptions(e, t) {
    this.list && this.list.remove(), this.list = this.dom.appendChild(this.createListBox(e, t, this.range)), this.list.addEventListener("scroll", () => {
      this.info && this.view.requestMeasure(this.placeInfoReq);
    });
  }
  update(e) {
    var t;
    let i = e.state.field(this.stateField), s = e.startState.field(this.stateField);
    if (this.updateTooltipClass(e.state), i != s) {
      let { options: r, selected: o, disabled: l } = i.open;
      (!s.open || s.open.options != r) && (this.range = or(r.length, o, e.state.facet(he).maxRenderedOptions), this.showOptions(r, i.id)), this.updateSel(), l != ((t = s.open) === null || t === void 0 ? void 0 : t.disabled) && this.dom.classList.toggle("cm-tooltip-autocomplete-disabled", !!l);
    }
  }
  updateTooltipClass(e) {
    let t = this.tooltipClass(e);
    if (t != this.currentClass) {
      for (let i of this.currentClass.split(" "))
        i && this.dom.classList.remove(i);
      for (let i of t.split(" "))
        i && this.dom.classList.add(i);
      this.currentClass = t;
    }
  }
  positioned(e) {
    this.space = e, this.info && this.view.requestMeasure(this.placeInfoReq);
  }
  updateSel() {
    let e = this.view.state.field(this.stateField), t = e.open;
    if ((t.selected > -1 && t.selected < this.range.from || t.selected >= this.range.to) && (this.range = or(t.options.length, t.selected, this.view.state.facet(he).maxRenderedOptions), this.showOptions(t.options, e.id)), this.updateSelectedOption(t.selected)) {
      this.destroyInfo();
      let { completion: i } = t.options[t.selected], { info: s } = i;
      if (!s)
        return;
      let r = typeof s == "string" ? document.createTextNode(s) : s(i);
      if (!r)
        return;
      "then" in r ? r.then((o) => {
        o && this.view.state.field(this.stateField, !1) == e && this.addInfoPane(o, i);
      }).catch((o) => Pe(this.view.state, o, "completion info")) : this.addInfoPane(r, i);
    }
  }
  addInfoPane(e, t) {
    this.destroyInfo();
    let i = this.info = document.createElement("div");
    if (i.className = "cm-tooltip cm-completionInfo", e.nodeType != null)
      i.appendChild(e), this.infoDestroy = null;
    else {
      let { dom: s, destroy: r } = e;
      i.appendChild(s), this.infoDestroy = r || null;
    }
    this.dom.appendChild(i), this.view.requestMeasure(this.placeInfoReq);
  }
  updateSelectedOption(e) {
    let t = null;
    for (let i = this.list.firstChild, s = this.range.from; i; i = i.nextSibling, s++)
      i.nodeName != "LI" || !i.id ? s-- : s == e ? i.hasAttribute("aria-selected") || (i.setAttribute("aria-selected", "true"), t = i) : i.hasAttribute("aria-selected") && i.removeAttribute("aria-selected");
    return t && vb(this.list, t), t;
  }
  measureInfo() {
    let e = this.dom.querySelector("[aria-selected]");
    if (!e || !this.info)
      return null;
    let t = this.dom.getBoundingClientRect(), i = this.info.getBoundingClientRect(), s = e.getBoundingClientRect(), r = this.space;
    if (!r) {
      let o = this.dom.ownerDocument.defaultView || window;
      r = { left: 0, top: 0, right: o.innerWidth, bottom: o.innerHeight };
    }
    return s.top > Math.min(r.bottom, t.bottom) - 10 || s.bottom < Math.max(r.top, t.top) + 10 ? null : this.view.state.facet(he).positionInfo(this.view, t, s, i, r, this.dom);
  }
  placeInfo(e) {
    this.info && (e ? (e.style && (this.info.style.cssText = e.style), this.info.className = "cm-tooltip cm-completionInfo " + (e.class || "")) : this.info.style.cssText = "top: -1e6px");
  }
  createListBox(e, t, i) {
    const s = document.createElement("ul");
    s.id = t, s.setAttribute("role", "listbox"), s.setAttribute("aria-expanded", "true"), s.setAttribute("aria-label", this.view.state.phrase("Completions"));
    let r = null;
    for (let o = i.from; o < i.to; o++) {
      let { completion: l, match: a } = e[o], { section: h } = l;
      if (h) {
        let u = typeof h == "string" ? h : h.name;
        if (u != r && (o > i.from || i.from == 0))
          if (r = u, typeof h != "string" && h.header)
            s.appendChild(h.header(h));
          else {
            let d = s.appendChild(document.createElement("completion-section"));
            d.textContent = u;
          }
      }
      const c = s.appendChild(document.createElement("li"));
      c.id = t + "-" + o, c.setAttribute("role", "option");
      let f = this.optionClass(l);
      f && (c.className = f);
      for (let u of this.optionContent) {
        let d = u(l, this.view.state, this.view, a);
        d && c.appendChild(d);
      }
    }
    return i.from && s.classList.add("cm-completionListIncompleteTop"), i.to < e.length && s.classList.add("cm-completionListIncompleteBottom"), s;
  }
  destroyInfo() {
    this.info && (this.infoDestroy && this.infoDestroy(), this.info.remove(), this.info = null);
  }
  destroy() {
    this.destroyInfo();
  }
}
function Sb(n, e) {
  return (t) => new kb(t, n, e);
}
function vb(n, e) {
  let t = n.getBoundingClientRect(), i = e.getBoundingClientRect(), s = t.height / n.offsetHeight;
  i.top < t.top ? n.scrollTop -= (t.top - i.top) / s : i.bottom > t.bottom && (n.scrollTop += (i.bottom - t.bottom) / s);
}
function La(n) {
  return (n.boost || 0) * 100 + (n.apply ? 10 : 0) + (n.info ? 5 : 0) + (n.type ? 1 : 0);
}
function Cb(n, e) {
  let t = [], i = null, s = (a) => {
    t.push(a);
    let { section: h } = a.completion;
    if (h) {
      i || (i = []);
      let c = typeof h == "string" ? h : h.name;
      i.some((f) => f.name == c) || i.push(typeof h == "string" ? { name: c } : h);
    }
  };
  for (let a of n)
    if (a.hasResult()) {
      let h = a.result.getMatch;
      if (a.result.filter === !1)
        for (let c of a.result.options)
          s(new Ma(c, a.source, h ? h(c) : [], 1e9 - t.length));
      else {
        let c = new yb(e.sliceDoc(a.from, a.to));
        for (let f of a.result.options)
          if (c.match(f.label)) {
            let u = f.displayLabel ? h ? h(f, c.matched) : [] : c.matched;
            s(new Ma(f, a.source, u, c.score + (f.boost || 0)));
          }
      }
    }
  if (i) {
    let a = /* @__PURE__ */ Object.create(null), h = 0, c = (f, u) => {
      var d, p;
      return ((d = f.rank) !== null && d !== void 0 ? d : 1e9) - ((p = u.rank) !== null && p !== void 0 ? p : 1e9) || (f.name < u.name ? -1 : 1);
    };
    for (let f of i.sort(c))
      h -= 1e5, a[f.name] = h;
    for (let f of t) {
      let { section: u } = f.completion;
      u && (f.score += a[typeof u == "string" ? u : u.name]);
    }
  }
  let r = [], o = null, l = e.facet(he).compareCompletions;
  for (let a of t.sort((h, c) => c.score - h.score || l(h.completion, c.completion))) {
    let h = a.completion;
    !o || o.label != h.label || o.detail != h.detail || o.type != null && h.type != null && o.type != h.type || o.apply != h.apply || o.boost != h.boost ? r.push(a) : La(a.completion) > La(o) && (r[r.length - 1] = a), o = a.completion;
  }
  return r;
}
class $t {
  constructor(e, t, i, s, r, o) {
    this.options = e, this.attrs = t, this.tooltip = i, this.timestamp = s, this.selected = r, this.disabled = o;
  }
  setSelected(e, t) {
    return e == this.selected || e >= this.options.length ? this : new $t(this.options, Ta(t, e), this.tooltip, this.timestamp, e, this.disabled);
  }
  static build(e, t, i, s, r) {
    let o = Cb(e, t);
    if (!o.length)
      return s && e.some(
        (a) => a.state == 1
        /* State.Pending */
      ) ? new $t(s.options, s.attrs, s.tooltip, s.timestamp, s.selected, !0) : null;
    let l = t.facet(he).selectOnOpen ? 0 : -1;
    if (s && s.selected != l && s.selected != -1) {
      let a = s.options[s.selected].completion;
      for (let h = 0; h < o.length; h++)
        if (o[h].completion == a) {
          l = h;
          break;
        }
    }
    return new $t(o, Ta(i, l), {
      pos: e.reduce((a, h) => h.hasResult() ? Math.min(a, h.from) : a, 1e8),
      create: Zb,
      above: r.aboveCursor
    }, s ? s.timestamp : Date.now(), l, !1);
  }
  map(e) {
    return new $t(this.options, this.attrs, Object.assign(Object.assign({}, this.tooltip), { pos: e.mapPos(this.tooltip.pos) }), this.timestamp, this.selected, this.disabled);
  }
}
class ds {
  constructor(e, t, i) {
    this.active = e, this.id = t, this.open = i;
  }
  static start() {
    return new ds(Mb, "cm-ac-" + Math.floor(Math.random() * 2e6).toString(36), null);
  }
  update(e) {
    let { state: t } = e, i = t.facet(he), r = (i.override || t.languageDataAt("autocomplete", xt(t)).map(bb)).map((l) => (this.active.find((h) => h.source == l) || new ve(
      l,
      this.active.some(
        (h) => h.state != 0
        /* State.Inactive */
      ) ? 1 : 0
      /* State.Inactive */
    )).update(e, i));
    r.length == this.active.length && r.every((l, a) => l == this.active[a]) && (r = this.active);
    let o = this.open;
    o && e.docChanged && (o = o.map(e.changes)), e.selection || r.some((l) => l.hasResult() && e.changes.touchesRange(l.from, l.to)) || !Ob(r, this.active) ? o = $t.build(r, t, this.id, o, i) : o && o.disabled && !r.some(
      (l) => l.state == 1
      /* State.Pending */
    ) && (o = null), !o && r.every(
      (l) => l.state != 1
      /* State.Pending */
    ) && r.some((l) => l.hasResult()) && (r = r.map((l) => l.hasResult() ? new ve(
      l.source,
      0
      /* State.Inactive */
    ) : l));
    for (let l of e.effects)
      l.is(Hf) && (o = o && o.setSelected(l.value, this.id));
    return r == this.active && o == this.open ? this : new ds(r, this.id, o);
  }
  get tooltip() {
    return this.open ? this.open.tooltip : null;
  }
  get attrs() {
    return this.open ? this.open.attrs : Ab;
  }
}
function Ob(n, e) {
  if (n == e)
    return !0;
  for (let t = 0, i = 0; ; ) {
    for (; t < n.length && !n[t].hasResult; )
      t++;
    for (; i < e.length && !e[i].hasResult; )
      i++;
    let s = t == n.length, r = i == e.length;
    if (s || r)
      return s == r;
    if (n[t++].result != e[i++].result)
      return !1;
  }
}
const Ab = {
  "aria-autocomplete": "list"
};
function Ta(n, e) {
  let t = {
    "aria-autocomplete": "list",
    "aria-haspopup": "listbox",
    "aria-controls": n
  };
  return e > -1 && (t["aria-activedescendant"] = n + "-" + e), t;
}
const Mb = [];
function eo(n) {
  return n.isUserEvent("input.type") ? "input" : n.isUserEvent("delete.backward") ? "delete" : null;
}
class ve {
  constructor(e, t, i = -1) {
    this.source = e, this.state = t, this.explicitPos = i;
  }
  hasResult() {
    return !1;
  }
  update(e, t) {
    let i = eo(e), s = this;
    i ? s = s.handleUserEvent(e, i, t) : e.docChanged ? s = s.handleChange(e) : e.selection && s.state != 0 && (s = new ve(
      s.source,
      0
      /* State.Inactive */
    ));
    for (let r of e.effects)
      if (r.is(us))
        s = new ve(s.source, 1, r.value ? xt(e.state) : -1);
      else if (r.is(zi))
        s = new ve(
          s.source,
          0
          /* State.Inactive */
        );
      else if (r.is(Gf))
        for (let o of r.value)
          o.source == s.source && (s = o);
    return s;
  }
  handleUserEvent(e, t, i) {
    return t == "delete" || !i.activateOnTyping ? this.map(e.changes) : new ve(
      this.source,
      1
      /* State.Pending */
    );
  }
  handleChange(e) {
    return e.changes.touchesRange(xt(e.startState)) ? new ve(
      this.source,
      0
      /* State.Inactive */
    ) : this.map(e.changes);
  }
  map(e) {
    return e.empty || this.explicitPos < 0 ? this : new ve(this.source, this.state, e.mapPos(this.explicitPos));
  }
}
class ni extends ve {
  constructor(e, t, i, s, r) {
    super(e, 2, t), this.result = i, this.from = s, this.to = r;
  }
  hasResult() {
    return !0;
  }
  handleUserEvent(e, t, i) {
    var s;
    let r = e.changes.mapPos(this.from), o = e.changes.mapPos(this.to, 1), l = xt(e.state);
    if ((this.explicitPos < 0 ? l <= r : l < this.from) || l > o || t == "delete" && xt(e.startState) == this.from)
      return new ve(
        this.source,
        t == "input" && i.activateOnTyping ? 1 : 0
        /* State.Inactive */
      );
    let a = this.explicitPos < 0 ? -1 : e.changes.mapPos(this.explicitPos), h;
    return Rb(this.result.validFor, e.state, r, o) ? new ni(this.source, a, this.result, r, o) : this.result.update && (h = this.result.update(this.result, r, o, new Ef(e.state, l, a >= 0))) ? new ni(this.source, a, h, h.from, (s = h.to) !== null && s !== void 0 ? s : xt(e.state)) : new ve(this.source, 1, a);
  }
  handleChange(e) {
    return e.changes.touchesRange(this.from, this.to) ? new ve(
      this.source,
      0
      /* State.Inactive */
    ) : this.map(e.changes);
  }
  map(e) {
    return e.empty ? this : new ni(this.source, this.explicitPos < 0 ? -1 : e.mapPos(this.explicitPos), this.result, e.mapPos(this.from), e.mapPos(this.to, 1));
  }
}
function Rb(n, e, t, i) {
  if (!n)
    return !1;
  let s = e.sliceDoc(t, i);
  return typeof n == "function" ? n(s, t, i, e) : Nf(n, !0).test(s);
}
const Gf = /* @__PURE__ */ L.define({
  map(n, e) {
    return n.map((t) => t.map(e));
  }
}), Hf = /* @__PURE__ */ L.define(), Ce = /* @__PURE__ */ ee.define({
  create() {
    return ds.start();
  },
  update(n, e) {
    return n.update(e);
  },
  provide: (n) => [
    ks.from(n, (e) => e.tooltip),
    Z.contentAttributes.from(n, (e) => e.attrs)
  ]
});
function Wo(n, e) {
  const t = e.completion.apply || e.completion.label;
  let i = n.state.field(Ce).active.find((s) => s.source == e.source);
  return i instanceof ni ? (typeof t == "string" ? n.dispatch(Object.assign(Object.assign({}, gb(n.state, t, i.from, i.to)), { annotations: mb.of(e.completion) })) : t(n, e.completion, i.from, i.to), !0) : !1;
}
const Zb = /* @__PURE__ */ Sb(Ce, Wo);
function Mn(n, e = "option") {
  return (t) => {
    let i = t.state.field(Ce, !1);
    if (!i || !i.open || i.open.disabled || Date.now() - i.open.timestamp < t.state.facet(he).interactionDelay)
      return !1;
    let s = 1, r;
    e == "page" && (r = dc(t, i.open.tooltip)) && (s = Math.max(2, Math.floor(r.dom.offsetHeight / r.dom.querySelector("li").offsetHeight) - 1));
    let { length: o } = i.open.options, l = i.open.selected > -1 ? i.open.selected + s * (n ? 1 : -1) : n ? 0 : o - 1;
    return l < 0 ? l = e == "page" ? 0 : o - 1 : l >= o && (l = e == "page" ? o - 1 : 0), t.dispatch({ effects: Hf.of(l) }), !0;
  };
}
const Lb = (n) => {
  let e = n.state.field(Ce, !1);
  return n.state.readOnly || !e || !e.open || e.open.selected < 0 || e.open.disabled || Date.now() - e.open.timestamp < n.state.facet(he).interactionDelay ? !1 : Wo(n, e.open.options[e.open.selected]);
}, Tb = (n) => n.state.field(Ce, !1) ? (n.dispatch({ effects: us.of(!0) }), !0) : !1, Db = (n) => {
  let e = n.state.field(Ce, !1);
  return !e || !e.active.some(
    (t) => t.state != 0
    /* State.Inactive */
  ) ? !1 : (n.dispatch({ effects: zi.of(null) }), !0);
};
class Pb {
  constructor(e, t) {
    this.active = e, this.context = t, this.time = Date.now(), this.updates = [], this.done = void 0;
  }
}
const Vb = 50, Bb = 1e3, Wb = /* @__PURE__ */ _.fromClass(class {
  constructor(n) {
    this.view = n, this.debounceUpdate = -1, this.running = [], this.debounceAccept = -1, this.pendingStart = !1, this.composing = 0;
    for (let e of n.state.field(Ce).active)
      e.state == 1 && this.startQuery(e);
  }
  update(n) {
    let e = n.state.field(Ce);
    if (!n.selectionSet && !n.docChanged && n.startState.field(Ce) == e)
      return;
    let t = n.transactions.some((s) => (s.selection || s.docChanged) && !eo(s));
    for (let s = 0; s < this.running.length; s++) {
      let r = this.running[s];
      if (t || r.updates.length + n.transactions.length > Vb && Date.now() - r.time > Bb) {
        for (let o of r.context.abortListeners)
          try {
            o();
          } catch (l) {
            Pe(this.view.state, l);
          }
        r.context.abortListeners = null, this.running.splice(s--, 1);
      } else
        r.updates.push(...n.transactions);
    }
    this.debounceUpdate > -1 && clearTimeout(this.debounceUpdate), n.transactions.some((s) => s.effects.some((r) => r.is(us))) && (this.pendingStart = !0);
    let i = this.pendingStart ? 50 : n.state.facet(he).activateOnTypingDelay;
    if (this.debounceUpdate = e.active.some((s) => s.state == 1 && !this.running.some((r) => r.active.source == s.source)) ? setTimeout(() => this.startUpdate(), i) : -1, this.composing != 0)
      for (let s of n.transactions)
        eo(s) == "input" ? this.composing = 2 : this.composing == 2 && s.selection && (this.composing = 3);
  }
  startUpdate() {
    this.debounceUpdate = -1, this.pendingStart = !1;
    let { state: n } = this.view, e = n.field(Ce);
    for (let t of e.active)
      t.state == 1 && !this.running.some((i) => i.active.source == t.source) && this.startQuery(t);
  }
  startQuery(n) {
    let { state: e } = this.view, t = xt(e), i = new Ef(e, t, n.explicitPos == t), s = new Pb(n, i);
    this.running.push(s), Promise.resolve(n.source(i)).then((r) => {
      s.context.aborted || (s.done = r || null, this.scheduleAccept());
    }, (r) => {
      this.view.dispatch({ effects: zi.of(null) }), Pe(this.view.state, r);
    });
  }
  scheduleAccept() {
    this.running.every((n) => n.done !== void 0) ? this.accept() : this.debounceAccept < 0 && (this.debounceAccept = setTimeout(() => this.accept(), this.view.state.facet(he).updateSyncTime));
  }
  // For each finished query in this.running, try to create a result
  // or, if appropriate, restart the query.
  accept() {
    var n;
    this.debounceAccept > -1 && clearTimeout(this.debounceAccept), this.debounceAccept = -1;
    let e = [], t = this.view.state.facet(he);
    for (let i = 0; i < this.running.length; i++) {
      let s = this.running[i];
      if (s.done === void 0)
        continue;
      if (this.running.splice(i--, 1), s.done) {
        let o = new ni(s.active.source, s.active.explicitPos, s.done, s.done.from, (n = s.done.to) !== null && n !== void 0 ? n : xt(s.updates.length ? s.updates[0].startState : this.view.state));
        for (let l of s.updates)
          o = o.update(l, t);
        if (o.hasResult()) {
          e.push(o);
          continue;
        }
      }
      let r = this.view.state.field(Ce).active.find((o) => o.source == s.active.source);
      if (r && r.state == 1)
        if (s.done == null) {
          let o = new ve(
            s.active.source,
            0
            /* State.Inactive */
          );
          for (let l of s.updates)
            o = o.update(l, t);
          o.state != 1 && e.push(o);
        } else
          this.startQuery(r);
    }
    e.length && this.view.dispatch({ effects: Gf.of(e) });
  }
}, {
  eventHandlers: {
    blur(n) {
      let e = this.view.state.field(Ce, !1);
      if (e && e.tooltip && this.view.state.facet(he).closeOnBlur) {
        let t = e.open && dc(this.view, e.open.tooltip);
        (!t || !t.dom.contains(n.relatedTarget)) && setTimeout(() => this.view.dispatch({ effects: zi.of(null) }), 10);
      }
    },
    compositionstart() {
      this.composing = 1;
    },
    compositionend() {
      this.composing == 3 && setTimeout(() => this.view.dispatch({ effects: us.of(!1) }), 20), this.composing = 0;
    }
  }
}), Xb = typeof navigator == "object" && /* @__PURE__ */ /Win/.test(navigator.platform), Ib = /* @__PURE__ */ Gt.highest(/* @__PURE__ */ Z.domEventHandlers({
  keydown(n, e) {
    let t = e.state.field(Ce, !1);
    if (!t || !t.open || t.open.disabled || t.open.selected < 0 || n.key.length > 1 || n.ctrlKey && !(Xb && n.altKey) || n.metaKey)
      return !1;
    let i = t.open.options[t.open.selected], s = t.active.find((o) => o.source == i.source), r = i.completion.commitCharacters || s.result.commitCharacters;
    return r && r.indexOf(n.key) > -1 && Wo(e, i), !1;
  }
})), Eb = /* @__PURE__ */ Z.baseTheme({
  ".cm-tooltip.cm-tooltip-autocomplete": {
    "& > ul": {
      fontFamily: "monospace",
      whiteSpace: "nowrap",
      overflow: "hidden auto",
      maxWidth_fallback: "700px",
      maxWidth: "min(700px, 95vw)",
      minWidth: "250px",
      maxHeight: "10em",
      height: "100%",
      listStyle: "none",
      margin: 0,
      padding: 0,
      "& > li, & > completion-section": {
        padding: "1px 3px",
        lineHeight: 1.2
      },
      "& > li": {
        overflowX: "hidden",
        textOverflow: "ellipsis",
        cursor: "pointer"
      },
      "& > completion-section": {
        display: "list-item",
        borderBottom: "1px solid silver",
        paddingLeft: "0.5em",
        opacity: 0.7
      }
    }
  },
  "&light .cm-tooltip-autocomplete ul li[aria-selected]": {
    background: "#17c",
    color: "white"
  },
  "&light .cm-tooltip-autocomplete-disabled ul li[aria-selected]": {
    background: "#777"
  },
  "&dark .cm-tooltip-autocomplete ul li[aria-selected]": {
    background: "#347",
    color: "white"
  },
  "&dark .cm-tooltip-autocomplete-disabled ul li[aria-selected]": {
    background: "#444"
  },
  ".cm-completionListIncompleteTop:before, .cm-completionListIncompleteBottom:after": {
    content: '"···"',
    opacity: 0.5,
    display: "block",
    textAlign: "center"
  },
  ".cm-tooltip.cm-completionInfo": {
    position: "absolute",
    padding: "3px 9px",
    width: "max-content",
    maxWidth: "400px",
    boxSizing: "border-box"
  },
  ".cm-completionInfo.cm-completionInfo-left": { right: "100%" },
  ".cm-completionInfo.cm-completionInfo-right": { left: "100%" },
  ".cm-completionInfo.cm-completionInfo-left-narrow": { right: "30px" },
  ".cm-completionInfo.cm-completionInfo-right-narrow": { left: "30px" },
  "&light .cm-snippetField": { backgroundColor: "#00000022" },
  "&dark .cm-snippetField": { backgroundColor: "#ffffff22" },
  ".cm-snippetFieldPosition": {
    verticalAlign: "text-top",
    width: 0,
    height: "1.15em",
    display: "inline-block",
    margin: "0 -0.7px -.7em",
    borderLeft: "1.4px dotted #888"
  },
  ".cm-completionMatchedText": {
    textDecoration: "underline"
  },
  ".cm-completionDetail": {
    marginLeft: "0.5em",
    fontStyle: "italic"
  },
  ".cm-completionIcon": {
    fontSize: "90%",
    width: ".8em",
    display: "inline-block",
    textAlign: "center",
    paddingRight: ".6em",
    opacity: "0.6",
    boxSizing: "content-box"
  },
  ".cm-completionIcon-function, .cm-completionIcon-method": {
    "&:after": { content: "'ƒ'" }
  },
  ".cm-completionIcon-class": {
    "&:after": { content: "'○'" }
  },
  ".cm-completionIcon-interface": {
    "&:after": { content: "'◌'" }
  },
  ".cm-completionIcon-variable": {
    "&:after": { content: "'𝑥'" }
  },
  ".cm-completionIcon-constant": {
    "&:after": { content: "'𝐶'" }
  },
  ".cm-completionIcon-type": {
    "&:after": { content: "'𝑡'" }
  },
  ".cm-completionIcon-enum": {
    "&:after": { content: "'∪'" }
  },
  ".cm-completionIcon-property": {
    "&:after": { content: "'□'" }
  },
  ".cm-completionIcon-keyword": {
    "&:after": { content: "'🔑︎'" }
    // Disable emoji rendering
  },
  ".cm-completionIcon-namespace": {
    "&:after": { content: "'▢'" }
  },
  ".cm-completionIcon-text": {
    "&:after": { content: "'abc'", fontSize: "50%", verticalAlign: "middle" }
  }
}), Ki = {
  brackets: ["(", "[", "{", "'", '"'],
  before: ")]}:;>",
  stringPrefixes: []
}, Bt = /* @__PURE__ */ L.define({
  map(n, e) {
    let t = e.mapPos(n, -1, be.TrackAfter);
    return t ?? void 0;
  }
}), Xo = /* @__PURE__ */ new class extends Xt {
}();
Xo.startSide = 1;
Xo.endSide = -1;
const Ff = /* @__PURE__ */ ee.define({
  create() {
    return I.empty;
  },
  update(n, e) {
    if (n = n.map(e.changes), e.selection) {
      let t = e.state.doc.lineAt(e.selection.main.head);
      n = n.update({ filter: (i) => i >= t.from && i <= t.to });
    }
    for (let t of e.effects)
      t.is(Bt) && (n = n.update({ add: [Xo.range(t.value, t.value + 1)] }));
    return n;
  }
});
function Nb() {
  return [Hb, Ff];
}
const lr = "()[]{}<>";
function zf(n) {
  for (let e = 0; e < lr.length; e += 2)
    if (lr.charCodeAt(e) == n)
      return lr.charAt(e + 1);
  return lo(n < 128 ? n : n + 1);
}
function Kf(n, e) {
  return n.languageDataAt("closeBrackets", e)[0] || Ki;
}
const Gb = typeof navigator == "object" && /* @__PURE__ */ /Android\b/.test(navigator.userAgent), Hb = /* @__PURE__ */ Z.inputHandler.of((n, e, t, i) => {
  if ((Gb ? n.composing : n.compositionStarted) || n.state.readOnly)
    return !1;
  let s = n.state.selection.main;
  if (i.length > 2 || i.length == 2 && We(le(i, 0)) == 1 || e != s.from || t != s.to)
    return !1;
  let r = Kb(n.state, i);
  return r ? (n.dispatch(r), !0) : !1;
}), Fb = ({ state: n, dispatch: e }) => {
  if (n.readOnly)
    return !1;
  let i = Kf(n, n.selection.main.head).brackets || Ki.brackets, s = null, r = n.changeByRange((o) => {
    if (o.empty) {
      let l = Yb(n.doc, o.head);
      for (let a of i)
        if (a == l && Ds(n.doc, o.head) == zf(le(a, 0)))
          return {
            changes: { from: o.head - a.length, to: o.head + a.length },
            range: y.cursor(o.head - a.length)
          };
    }
    return { range: s = o };
  });
  return s || e(n.update(r, { scrollIntoView: !0, userEvent: "delete.backward" })), !s;
}, zb = [
  { key: "Backspace", run: Fb }
];
function Kb(n, e) {
  let t = Kf(n, n.selection.main.head), i = t.brackets || Ki.brackets;
  for (let s of i) {
    let r = zf(le(s, 0));
    if (e == s)
      return r == s ? Ub(n, s, i.indexOf(s + s + s) > -1, t) : Jb(n, s, r, t.before || Ki.before);
    if (e == r && Yf(n, n.selection.main.from))
      return Qb(n, s, r);
  }
  return null;
}
function Yf(n, e) {
  let t = !1;
  return n.field(Ff).between(0, n.doc.length, (i) => {
    i == e && (t = !0);
  }), t;
}
function Ds(n, e) {
  let t = n.sliceString(e, e + 2);
  return t.slice(0, We(le(t, 0)));
}
function Yb(n, e) {
  let t = n.sliceString(e - 2, e);
  return We(le(t, 0)) == t.length ? t : t.slice(1);
}
function Jb(n, e, t, i) {
  let s = null, r = n.changeByRange((o) => {
    if (!o.empty)
      return {
        changes: [{ insert: e, from: o.from }, { insert: t, from: o.to }],
        effects: Bt.of(o.to + e.length),
        range: y.range(o.anchor + e.length, o.head + e.length)
      };
    let l = Ds(n.doc, o.head);
    return !l || /\s/.test(l) || i.indexOf(l) > -1 ? {
      changes: { insert: e + t, from: o.head },
      effects: Bt.of(o.head + e.length),
      range: y.cursor(o.head + e.length)
    } : { range: s = o };
  });
  return s ? null : n.update(r, {
    scrollIntoView: !0,
    userEvent: "input.type"
  });
}
function Qb(n, e, t) {
  let i = null, s = n.changeByRange((r) => r.empty && Ds(n.doc, r.head) == t ? {
    changes: { from: r.head, to: r.head + t.length, insert: t },
    range: y.cursor(r.head + t.length)
  } : i = { range: r });
  return i ? null : n.update(s, {
    scrollIntoView: !0,
    userEvent: "input.type"
  });
}
function Ub(n, e, t, i) {
  let s = i.stringPrefixes || Ki.stringPrefixes, r = null, o = n.changeByRange((l) => {
    if (!l.empty)
      return {
        changes: [{ insert: e, from: l.from }, { insert: e, from: l.to }],
        effects: Bt.of(l.to + e.length),
        range: y.range(l.anchor + e.length, l.head + e.length)
      };
    let a = l.head, h = Ds(n.doc, a), c;
    if (h == e) {
      if (Da(n, a))
        return {
          changes: { insert: e + e, from: a },
          effects: Bt.of(a + e.length),
          range: y.cursor(a + e.length)
        };
      if (Yf(n, a)) {
        let u = t && n.sliceDoc(a, a + e.length * 3) == e + e + e ? e + e + e : e;
        return {
          changes: { from: a, to: a + u.length, insert: u },
          range: y.cursor(a + u.length)
        };
      }
    } else {
      if (t && n.sliceDoc(a - 2 * e.length, a) == e + e && (c = Pa(n, a - 2 * e.length, s)) > -1 && Da(n, c))
        return {
          changes: { insert: e + e + e + e, from: a },
          effects: Bt.of(a + e.length),
          range: y.cursor(a + e.length)
        };
      if (n.charCategorizer(a)(h) != q.Word && Pa(n, a, s) > -1 && !$b(n, a, e, s))
        return {
          changes: { insert: e + e, from: a },
          effects: Bt.of(a + e.length),
          range: y.cursor(a + e.length)
        };
    }
    return { range: r = l };
  });
  return r ? null : n.update(o, {
    scrollIntoView: !0,
    userEvent: "input.type"
  });
}
function Da(n, e) {
  let t = pe(n).resolveInner(e + 1);
  return t.parent && t.from == e;
}
function $b(n, e, t, i) {
  let s = pe(n).resolveInner(e, -1), r = i.reduce((o, l) => Math.max(o, l.length), 0);
  for (let o = 0; o < 5; o++) {
    let l = n.sliceDoc(s.from, Math.min(s.to, s.from + t.length + r)), a = l.indexOf(t);
    if (!a || a > -1 && i.indexOf(l.slice(0, a)) > -1) {
      let c = s.firstChild;
      for (; c && c.from == s.from && c.to - c.from > t.length + a; ) {
        if (n.sliceDoc(c.to - t.length, c.to) == t)
          return !1;
        c = c.firstChild;
      }
      return !0;
    }
    let h = s.to == e && s.parent;
    if (!h)
      break;
    s = h;
  }
  return !1;
}
function Pa(n, e, t) {
  let i = n.charCategorizer(e);
  if (i(n.sliceDoc(e - 1, e)) != q.Word)
    return e;
  for (let s of t) {
    let r = e - s.length;
    if (n.sliceDoc(r, e) == s && i(n.sliceDoc(r - 1, r)) != q.Word)
      return r;
  }
  return -1;
}
function jb(n = {}) {
  return [
    Ib,
    Ce,
    he.of(n),
    Wb,
    qb,
    Eb
  ];
}
const Jf = [
  { key: "Ctrl-Space", run: Tb },
  { key: "Escape", run: Db },
  { key: "ArrowDown", run: /* @__PURE__ */ Mn(!0) },
  { key: "ArrowUp", run: /* @__PURE__ */ Mn(!1) },
  { key: "PageDown", run: /* @__PURE__ */ Mn(!0, "page") },
  { key: "PageUp", run: /* @__PURE__ */ Mn(!1, "page") },
  { key: "Enter", run: Lb }
], qb = /* @__PURE__ */ Gt.highest(/* @__PURE__ */ xo.computeN([he], (n) => n.facet(he).defaultKeymap ? [Jf] : []));
function _b() {
  return ty;
}
const ey = T.line({ class: "cm-activeLine" }), ty = _.fromClass(class {
  constructor(n) {
    nn(this, "decorations");
    this.decorations = this.getDeco(n);
  }
  update(n) {
    (n.docChanged || n.selectionSet || n.focusChanged) && (this.decorations = this.getDeco(n.view));
  }
  getDeco(n) {
    let e = -1, t = [];
    if (n.hasFocus)
      for (let i of n.state.selection.ranges) {
        let s = n.lineBlockAt(i.head);
        s.from > e && (t.push(ey.range(s.from)), e = s.from);
      }
    return T.set(t);
  }
}, {
  decorations: (n) => n.decorations
}), iy = /* @__PURE__ */ io("<div><div></div><div><button>Lezer AST"), ny = (() => [
  hm(),
  Hp(),
  zg(),
  Km(),
  Tp(),
  Wp(),
  // EditorState.allowMultipleSelections.of(true),
  Tm(),
  Dc(Um, {
    fallback: !0
  }),
  ig(),
  Nb(),
  jb(),
  // rectangularSelection(),
  // crosshairCursor(),
  _b(),
  // highlightSelectionMatches(),
  xo.of([...zb, ...Y0, ...hb, ..._g, ...Gm, ...Jf, ...wg])
])(), sy = (n) => n === "type" ? cg() : n === "expr" ? aa() : n === "unification" ? fg() : aa(), ry = (n) => {
  const e = sy(n.lang), t = () => {
    if (!s)
      return;
    const r = s.getCurrentText(), o = e.language.parser.parse(r), l = ma(o, r);
    console.log(l);
  };
  let i, s = null;
  return _f(() => {
    if (!i)
      throw Error("editorElt not defined");
    const r = new Z({
      doc: n.children,
      extensions: [
        ny,
        e,
        dg,
        // selectionPanelPlugin(),
        Dg(),
        ...n.extensions || []
      ],
      parent: i
    }), o = () => r.state.doc.toString();
    s = {
      getCurrentText: o,
      clearErrors: () => {
        r.dispatch({
          effects: [$c.of(null)]
        });
      },
      getPrettyAst: () => {
        const l = o(), a = e.language.parser.parse(l);
        return ma(a, l);
      },
      addError: (l) => {
        r.dispatch({
          effects: [Uc.of(l)]
        });
      },
      lineColToPos: (l, a) => {
        let {
          from: h,
          to: c
        } = r.state.doc.line(l), f = c - h;
        return a - 1 <= f ? h + (a - 1) : null;
      }
    }, n.onReady(s);
  }), (() => {
    const r = iy(), o = r.firstChild, l = o.nextSibling, a = l.firstChild, h = i;
    return typeof h == "function" ? au(h, o) : i = o, a.$$click = t, r;
  })();
};
lu(["click"]);
const oy = ([n, e], [t, i]) => t >= n && i < e, ly = (n, e) => {
  const { tree: t, subTrees: i } = e;
  function s(r, o) {
    for (let l of i(o))
      if (oy(l.span, r))
        return s(r, l);
    return o;
  }
  return s(n, t);
}, ay = (n) => n.tag === "BinExpr" ? [
  n.left,
  n.right
] : n.tag === "LetExpr" ? [
  /* TODO Name is not an expr, so return what? */
  n.equal,
  n.in
] : n.tag === "LamExpr" ? [
  /* TODO Name is not an expr, so return what? */
  n.body
] : n.tag === "IfExpr" ? [
  n.econ,
  n.etru,
  n.efls
] : n.tag === "App" ? [
  n.e1,
  n.e2
] : [], hy = (n, e) => {
  let t;
  return () => {
    clearTimeout(t), t = setTimeout(() => {
      e();
    }, n);
  };
};
function cy(n, e) {
  let t = null;
  const i = hy(400, async () => {
    const o = n();
    if (!o)
      return;
    const l = o.getCurrentText(), a = await e(l);
    if (o.clearErrors(), console.log(a), a.tag === "result")
      t = a.tree;
    else {
      t = null;
      const h = a.error;
      if (console.warn(h), h.tag === "OutputParseError")
        for (let c of h.contents.errors) {
          const f = o.lineColToPos(c[0].errorLine, c[0].errorCol);
          f !== null ? o.addError({
            type: "ParseError",
            message: c[1],
            range: { from: Math.max(0, f - 1), to: f }
          }) : console.error("bad line/col", h);
        }
      else if (h.tag === "OutputSyntaxError") {
        if (h.contents.tag === "UnboundVariable") {
          const [[c, f], u] = h.contents.contents;
          o.addError({
            type: "SyntaxError",
            message: `unbound variable '${u}'`,
            range: { from: c, to: f }
          });
        } else if (h.contents.tag === "ExpectedMonoType") {
          const [c, f] = h.contents.contents;
          o.addError({
            type: "SyntaxError",
            message: "Expected monotype, found polytype instead.  Hindley-Milner only supports universal quantification at the top-level.",
            range: { from: c, to: f }
          });
        }
      }
    }
  });
  return {
    handleDocChanged: () => {
      t = null, i();
    },
    infoAt: (o) => {
      if (t === null)
        return null;
      const { from: l, to: a } = o;
      return ly([l, a], t);
    }
  };
}
const fy = T.mark({ class: "cm-underline" });
function uy(n, e) {
  return [
    _.fromClass(class {
      constructor(i) {
        nn(this, "decorations");
        this.decorations = T.set([]), n();
      }
      updateInfo(i) {
        const s = e(i.selection.main);
        if (s) {
          const [r, o] = s.span;
          this.decorations = T.set([{ from: r, to: o, value: fy }]);
        } else
          this.decorations = T.set([]);
      }
      update(i) {
        i.docChanged && n(), (i.selectionSet || i.docChanged) && this.updateInfo(i.state);
      }
    }, {
      decorations: (i) => i.decorations
    })
  ];
}
function dy(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var py = function(e) {
  for (var t = [], i = 1; i < arguments.length; i++)
    t[i - 1] = arguments[i];
  var s = [], r = typeof e == "string" ? [e] : e.slice();
  r[r.length - 1] = r[r.length - 1].replace(/\r?\n([\t ]*)$/, "");
  for (var o = 0; o < r.length; o++) {
    var l = void 0;
    (l = r[o].match(/\n[\t ]+/g)) && s.push.apply(s, l);
  }
  if (s.length)
    for (var a = Math.min.apply(Math, s.map(function(f) {
      return f.length - 1;
    })), h = new RegExp(`
[	 ]{` + a + "}", "g"), o = 0; o < r.length; o++)
      r[o] = r[o].replace(h, `
`);
  r[0] = r[0].replace(/^\r?\n/, "");
  for (var c = r[0], o = 0; o < t.length; o++)
    c += t[o] + r[o + 1];
  return c;
};
const my = /* @__PURE__ */ dy(py), gy = /* @__PURE__ */ io('<div class="top">'), by = /* @__PURE__ */ io('<div class="bottom"><pre class="resultType"><code></code></pre><div class="bottom-split"><div class="bottom-split-left"><pre class="resultExpr"><code></code></pre></div><div class="bottom-split-right"><pre class="resultSubst"><code></code></pre><pre class="resultActions"><code>'), yy = (n) => {
  const [e, t] = sn(""), [i, s] = sn(""), [r, o] = sn(""), [l, a] = sn("");
  let h = null;
  const {
    handleDocChanged: c,
    infoAt: f
  } = cy(() => h, async (u) => {
    const d = await n.workerApi.runInferAbstract({
      inputText: u
    });
    return d.data.outputExpr ? {
      tag: "result",
      tree: {
        subTrees: ay,
        tree: d.data.outputExpr
      }
    } : {
      tag: "error",
      error: d.data.outputError
    };
  });
  return [(() => {
    const u = gy();
    return Kt(u, Ga(ry, {
      onReady: (d) => {
        h = d;
      },
      get extensions() {
        return [uy(c, f)];
      },
      get children() {
        return my(n.children);
      }
    })), u;
  })(), (() => {
    const u = by(), d = u.firstChild, p = d.firstChild, g = d.nextSibling, m = g.firstChild, b = m.firstChild, k = b.firstChild, C = m.nextSibling, S = C.firstChild, w = S.firstChild, A = S.nextSibling, O = A.firstChild;
    return Kt(p, i), Kt(k, e), Kt(w, r), Kt(O, l), u;
  })()];
};
function Ay(n) {
  console.log(n);
}
const xy = {
  async toUpper(n) {
    return xi("toUpper", n);
  },
  async runParse(n) {
    return xi("runParse", n);
  },
  async runParseType(n) {
    return xi("runParseType", n);
  },
  async runInferAbstract(n) {
    return xi("runInferAbstract", n);
  },
  async runUnify(n) {
    return xi("runUnify", n);
  }
};
function My(n, e) {
  ou(() => Ga(yy, {
    workerApi: xy,
    children: e
  }), n);
}
let ps, to;
function Ry() {
  ps = new cu(), to = new Promise((n) => {
    ps.onmessage = (e) => {
      const t = e.data;
      t.tag === "workerReady" && (console.log("worker is ready"), n(t));
    };
  });
}
function wy(n) {
  const e = to.then(() => new Promise((t) => {
    console.log("[main] sending request to worker", n), ps.postMessage(n), ps.onmessage = (i) => t(i.data);
  }));
  return to = e, e;
}
function xi(n, e) {
  return new Promise(async (t, i) => {
    const r = await wy({
      tag: n,
      data: e
    });
    r.tag === "workerResult" ? t(r) : (console.error(`expected workerResult, received ${r.tag}`), i());
  });
}
export {
  Ry as initWorker,
  Ay as log,
  My as makeTypeInferenceDemo,
  xy as workerApi
};
