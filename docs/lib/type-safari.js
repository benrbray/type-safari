var Hf = Object.defineProperty;
var Ff = (n, t, e) => t in n ? Hf(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[t] = e;
var Qi = (n, t, e) => (Ff(n, typeof t != "symbol" ? t + "" : t, e), e);
const zf = (n, t) => n === t, Ro = {
  equals: zf
};
let Oa = Za;
const we = 1, Zn = 2, Aa = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var gt = null;
let As = null, Q = null, dt = null, ee = null, as = 0;
function Kf(n, t) {
  const e = Q, i = gt, s = n.length === 0, r = t === void 0 ? i : t, o = s ? Aa : {
    owned: null,
    cleanups: null,
    context: r ? r.context : null,
    owner: r
  }, l = s ? n : () => n(() => si(() => cs(o)));
  gt = o, Q = null;
  try {
    return Ei(l, !0);
  } finally {
    Q = e, gt = i;
  }
}
function Ui(n, t) {
  t = t ? Object.assign({}, Ro, t) : Ro;
  const e = {
    value: n,
    observers: null,
    observerSlots: null,
    comparator: t.equals || void 0
  }, i = (s) => (typeof s == "function" && (s = s(e.value)), Ma(e, s));
  return [Qf.bind(e), i];
}
function tr(n, t, e) {
  const i = Ra(n, t, !1, we);
  hs(i);
}
function Yf(n, t, e) {
  Oa = jf;
  const i = Ra(n, t, !1, we);
  (!e || !e.render) && (i.user = !0), ee ? ee.push(i) : hs(i);
}
function si(n) {
  if (Q === null)
    return n();
  const t = Q;
  Q = null;
  try {
    return n();
  } finally {
    Q = t;
  }
}
function Jf(n) {
  Yf(() => si(n));
}
function Qf() {
  if (this.sources && this.state)
    if (this.state === we)
      hs(this);
    else {
      const n = dt;
      dt = null, Ei(() => Tn(this), !1), dt = n;
    }
  if (Q) {
    const n = this.observers ? this.observers.length : 0;
    Q.sources ? (Q.sources.push(this), Q.sourceSlots.push(n)) : (Q.sources = [this], Q.sourceSlots = [n]), this.observers ? (this.observers.push(Q), this.observerSlots.push(Q.sources.length - 1)) : (this.observers = [Q], this.observerSlots = [Q.sources.length - 1]);
  }
  return this.value;
}
function Ma(n, t, e) {
  let i = n.value;
  return (!n.comparator || !n.comparator(i, t)) && (n.value = t, n.observers && n.observers.length && Ei(() => {
    for (let s = 0; s < n.observers.length; s += 1) {
      const r = n.observers[s], o = As && As.running;
      o && As.disposed.has(r), (o ? !r.tState : !r.state) && (r.pure ? dt.push(r) : ee.push(r), r.observers && La(r)), o || (r.state = we);
    }
    if (dt.length > 1e6)
      throw dt = [], new Error();
  }, !1)), t;
}
function hs(n) {
  if (!n.fn)
    return;
  cs(n);
  const t = gt, e = Q, i = as;
  Q = gt = n, Uf(n, n.value, i), Q = e, gt = t;
}
function Uf(n, t, e) {
  let i;
  try {
    i = n.fn(t);
  } catch (s) {
    return n.pure && (n.state = we, n.owned && n.owned.forEach(cs), n.owned = null), n.updatedAt = e + 1, Ta(s);
  }
  (!n.updatedAt || n.updatedAt <= e) && (n.updatedAt != null && "observers" in n ? Ma(n, i) : n.value = i, n.updatedAt = e);
}
function Ra(n, t, e, i = we, s) {
  const r = {
    fn: n,
    state: i,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: t,
    owner: gt,
    context: gt ? gt.context : null,
    pure: e
  };
  return gt === null || gt !== Aa && (gt.owned ? gt.owned.push(r) : gt.owned = [r]), r;
}
function Ln(n) {
  if (n.state === 0)
    return;
  if (n.state === Zn)
    return Tn(n);
  if (n.suspense && si(n.suspense.inFallback))
    return n.suspense.effects.push(n);
  const t = [n];
  for (; (n = n.owner) && (!n.updatedAt || n.updatedAt < as); )
    n.state && t.push(n);
  for (let e = t.length - 1; e >= 0; e--)
    if (n = t[e], n.state === we)
      hs(n);
    else if (n.state === Zn) {
      const i = dt;
      dt = null, Ei(() => Tn(n, t[0]), !1), dt = i;
    }
}
function Ei(n, t) {
  if (dt)
    return n();
  let e = !1;
  t || (dt = []), ee ? e = !0 : ee = [], as++;
  try {
    const i = n();
    return $f(e), i;
  } catch (i) {
    e || (ee = null), dt = null, Ta(i);
  }
}
function $f(n) {
  if (dt && (Za(dt), dt = null), n)
    return;
  const t = ee;
  ee = null, t.length && Ei(() => Oa(t), !1);
}
function Za(n) {
  for (let t = 0; t < n.length; t++)
    Ln(n[t]);
}
function jf(n) {
  let t, e = 0;
  for (t = 0; t < n.length; t++) {
    const i = n[t];
    i.user ? n[e++] = i : Ln(i);
  }
  for (t = 0; t < e; t++)
    Ln(n[t]);
}
function Tn(n, t) {
  n.state = 0;
  for (let e = 0; e < n.sources.length; e += 1) {
    const i = n.sources[e];
    if (i.sources) {
      const s = i.state;
      s === we ? i !== t && (!i.updatedAt || i.updatedAt < as) && Ln(i) : s === Zn && Tn(i, t);
    }
  }
}
function La(n) {
  for (let t = 0; t < n.observers.length; t += 1) {
    const e = n.observers[t];
    e.state || (e.state = Zn, e.pure ? dt.push(e) : ee.push(e), e.observers && La(e));
  }
}
function cs(n) {
  let t;
  if (n.sources)
    for (; n.sources.length; ) {
      const e = n.sources.pop(), i = n.sourceSlots.pop(), s = e.observers;
      if (s && s.length) {
        const r = s.pop(), o = e.observerSlots.pop();
        i < s.length && (r.sourceSlots[o] = i, s[i] = r, e.observerSlots[i] = o);
      }
    }
  if (n.owned) {
    for (t = n.owned.length - 1; t >= 0; t--)
      cs(n.owned[t]);
    n.owned = null;
  }
  if (n.cleanups) {
    for (t = n.cleanups.length - 1; t >= 0; t--)
      n.cleanups[t]();
    n.cleanups = null;
  }
  n.state = 0;
}
function qf(n) {
  return n instanceof Error ? n : new Error(typeof n == "string" ? n : "Unknown error", {
    cause: n
  });
}
function Ta(n, t = gt) {
  throw qf(n);
}
function Da(n, t) {
  return si(() => n(t || {}));
}
function _f(n, t, e) {
  let i = e.length, s = t.length, r = i, o = 0, l = 0, a = t[s - 1].nextSibling, h = null;
  for (; o < s || l < r; ) {
    if (t[o] === e[l]) {
      o++, l++;
      continue;
    }
    for (; t[s - 1] === e[r - 1]; )
      s--, r--;
    if (s === o) {
      const c = r < i ? l ? e[l - 1].nextSibling : e[r - l] : a;
      for (; l < r; )
        n.insertBefore(e[l++], c);
    } else if (r === l)
      for (; o < s; )
        (!h || !h.has(t[o])) && t[o].remove(), o++;
    else if (t[o] === e[r - 1] && e[l] === t[s - 1]) {
      const c = t[--s].nextSibling;
      n.insertBefore(e[l++], t[o++].nextSibling), n.insertBefore(e[--r], c), t[s] = e[r];
    } else {
      if (!h) {
        h = /* @__PURE__ */ new Map();
        let f = l;
        for (; f < r; )
          h.set(e[f], f++);
      }
      const c = h.get(t[o]);
      if (c != null)
        if (l < c && c < r) {
          let f = o, u = 1, d;
          for (; ++f < s && f < r && !((d = h.get(t[f])) == null || d !== c + u); )
            u++;
          if (u > c - l) {
            const p = t[o];
            for (; l < c; )
              n.insertBefore(e[l++], p);
          } else
            n.replaceChild(e[l++], t[o++]);
        } else
          o++;
      else
        t[o++].remove();
    }
  }
}
const Zo = "_$DX_DELEGATE";
function tu(n, t, e, i = {}) {
  let s;
  return Kf((r) => {
    s = r, t === document ? n() : Ne(t, n(), t.firstChild ? null : void 0, e);
  }, i.owner), () => {
    s(), t.textContent = "";
  };
}
function Yr(n, t, e) {
  let i;
  const s = () => {
    const o = document.createElement("template");
    return o.innerHTML = n, e ? o.content.firstChild.firstChild : o.content.firstChild;
  }, r = t ? () => si(() => document.importNode(i || (i = s()), !0)) : () => (i || (i = s())).cloneNode(!0);
  return r.cloneNode = r, r;
}
function eu(n, t = window.document) {
  const e = t[Zo] || (t[Zo] = /* @__PURE__ */ new Set());
  for (let i = 0, s = n.length; i < s; i++) {
    const r = n[i];
    e.has(r) || (e.add(r), t.addEventListener(r, nu));
  }
}
function iu(n, t, e) {
  return si(() => n(t, e));
}
function Ne(n, t, e, i) {
  if (e !== void 0 && !i && (i = []), typeof t != "function")
    return Dn(n, t, i, e);
  tr((s) => Dn(n, t(), s, e), i);
}
function nu(n) {
  const t = `$$${n.type}`;
  let e = n.composedPath && n.composedPath()[0] || n.target;
  for (n.target !== e && Object.defineProperty(n, "target", {
    configurable: !0,
    value: e
  }), Object.defineProperty(n, "currentTarget", {
    configurable: !0,
    get() {
      return e || document;
    }
  }); e; ) {
    const i = e[t];
    if (i && !e.disabled) {
      const s = e[`${t}Data`];
      if (s !== void 0 ? i.call(e, s, n) : i.call(e, n), n.cancelBubble)
        return;
    }
    e = e._$host || e.parentNode || e.host;
  }
}
function Dn(n, t, e, i, s) {
  for (; typeof e == "function"; )
    e = e();
  if (t === e)
    return e;
  const r = typeof t, o = i !== void 0;
  if (n = o && e[0] && e[0].parentNode || n, r === "string" || r === "number")
    if (r === "number" && (t = t.toString()), o) {
      let l = e[0];
      l && l.nodeType === 3 ? l.data = t : l = document.createTextNode(t), e = Ie(n, e, i, l);
    } else
      e !== "" && typeof e == "string" ? e = n.firstChild.data = t : e = n.textContent = t;
  else if (t == null || r === "boolean")
    e = Ie(n, e, i);
  else {
    if (r === "function")
      return tr(() => {
        let l = t();
        for (; typeof l == "function"; )
          l = l();
        e = Dn(n, l, e, i);
      }), () => e;
    if (Array.isArray(t)) {
      const l = [], a = e && Array.isArray(e);
      if (er(l, t, e, s))
        return tr(() => e = Dn(n, l, e, i, !0)), () => e;
      if (l.length === 0) {
        if (e = Ie(n, e, i), o)
          return e;
      } else
        a ? e.length === 0 ? Lo(n, l, i) : _f(n, e, l) : (e && Ie(n), Lo(n, l));
      e = l;
    } else if (t.nodeType) {
      if (Array.isArray(e)) {
        if (o)
          return e = Ie(n, e, i, t);
        Ie(n, e, null, t);
      } else
        e == null || e === "" || !n.firstChild ? n.appendChild(t) : n.replaceChild(t, n.firstChild);
      e = t;
    } else
      console.warn("Unrecognized value. Skipped inserting", t);
  }
  return e;
}
function er(n, t, e, i) {
  let s = !1;
  for (let r = 0, o = t.length; r < o; r++) {
    let l = t[r], a = e && e[r], h;
    if (!(l == null || l === !0 || l === !1))
      if ((h = typeof l) == "object" && l.nodeType)
        n.push(l);
      else if (Array.isArray(l))
        s = er(n, l, a) || s;
      else if (h === "function")
        if (i) {
          for (; typeof l == "function"; )
            l = l();
          s = er(n, Array.isArray(l) ? l : [l], Array.isArray(a) ? a : [a]) || s;
        } else
          n.push(l), s = !0;
      else {
        const c = String(l);
        a && a.nodeType === 3 && a.data === c ? n.push(a) : n.push(document.createTextNode(c));
      }
  }
  return s;
}
function Lo(n, t, e = null) {
  for (let i = 0, s = t.length; i < s; i++)
    n.insertBefore(t[i], e);
}
function Ie(n, t, e, i) {
  if (e === void 0)
    return n.textContent = "";
  const s = i || document.createTextNode("");
  if (t.length) {
    let r = !1;
    for (let o = t.length - 1; o >= 0; o--) {
      const l = t[o];
      if (s !== l) {
        const a = l.parentNode === n;
        !r && !o ? a ? n.replaceChild(s, l) : n.insertBefore(s, e) : a && l.remove();
      } else
        r = !0;
    }
  } else
    n.insertBefore(s, e);
  return [s];
}
const Pa = "KGZ1bmN0aW9uKCl7InVzZSBzdHJpY3QiO2NsYXNzIGd7c3RhdGljIHJlYWRfYnl0ZXMobixpKXtsZXQgbD1uZXcgZztyZXR1cm4gbC5idWY9bi5nZXRVaW50MzIoaSwhMCksbC5idWZfbGVuPW4uZ2V0VWludDMyKGkrNCwhMCksbH1zdGF0aWMgcmVhZF9ieXRlc19hcnJheShuLGksbCl7bGV0IGU9W107Zm9yKGxldCB0PTA7dDxsO3QrKyllLnB1c2goZy5yZWFkX2J5dGVzKG4saSs4KnQpKTtyZXR1cm4gZX19Y2xhc3MgbXtzdGF0aWMgcmVhZF9ieXRlcyhuLGkpe2xldCBsPW5ldyBtO3JldHVybiBsLmJ1Zj1uLmdldFVpbnQzMihpLCEwKSxsLmJ1Zl9sZW49bi5nZXRVaW50MzIoaSs0LCEwKSxsfXN0YXRpYyByZWFkX2J5dGVzX2FycmF5KG4saSxsKXtsZXQgZT1bXTtmb3IobGV0IHQ9MDt0PGw7dCsrKWUucHVzaChtLnJlYWRfYnl0ZXMobixpKzgqdCkpO3JldHVybiBlfX1jb25zdCBOPTAsTz0xLEY9MixVPTQ7Y2xhc3Mga3t3cml0ZV9ieXRlcyhuLGkpe24uc2V0VWludDgoaSx0aGlzLmZzX2ZpbGV0eXBlKSxuLnNldFVpbnQxNihpKzIsdGhpcy5mc19mbGFncywhMCksbi5zZXRCaWdVaW50NjQoaSs4LHRoaXMuZnNfcmlnaHRzX2Jhc2UsITApLG4uc2V0QmlnVWludDY0KGkrMTYsdGhpcy5mc19yaWdodHNfaW5oZXJpdGVkLCEwKX1jb25zdHJ1Y3RvcihuLGkpe3RoaXMuZnNfcmlnaHRzX2Jhc2U9MG4sdGhpcy5mc19yaWdodHNfaW5oZXJpdGVkPTBuLHRoaXMuZnNfZmlsZXR5cGU9bix0aGlzLmZzX2ZsYWdzPWl9fWNsYXNzIEl7d3JpdGVfYnl0ZXMobixpKXtuLnNldEJpZ1VpbnQ2NChpLHRoaXMuZGV2LCEwKSxuLnNldEJpZ1VpbnQ2NChpKzgsdGhpcy5pbm8sITApLG4uc2V0VWludDgoaSsxNix0aGlzLmZpbGV0eXBlKSxuLnNldEJpZ1VpbnQ2NChpKzI0LHRoaXMubmxpbmssITApLG4uc2V0QmlnVWludDY0KGkrMzIsdGhpcy5zaXplLCEwKSxuLnNldEJpZ1VpbnQ2NChpKzM4LHRoaXMuYXRpbSwhMCksbi5zZXRCaWdVaW50NjQoaSs0Nix0aGlzLm10aW0sITApLG4uc2V0QmlnVWludDY0KGkrNTIsdGhpcy5jdGltLCEwKX1jb25zdHJ1Y3RvcihuLGkpe3RoaXMuZGV2PTBuLHRoaXMuaW5vPTBuLHRoaXMubmxpbms9MG4sdGhpcy5hdGltPTBuLHRoaXMubXRpbT0wbix0aGlzLmN0aW09MG4sdGhpcy5maWxldHlwZT1uLHRoaXMuc2l6ZT1pfX1sZXQgVD1jbGFzc3tzdGFydChuKXt0aGlzLmluc3Q9bixuLmV4cG9ydHMuX3N0YXJ0KCl9aW5pdGlhbGl6ZShuKXt0aGlzLmluc3Q9bixuLmV4cG9ydHMuX2luaXRpYWxpemUoKX1jb25zdHJ1Y3RvcihuLGksbCl7dGhpcy5hcmdzPVtdLHRoaXMuZW52PVtdLHRoaXMuZmRzPVtdLHRoaXMuYXJncz1uLHRoaXMuZW52PWksdGhpcy5mZHM9bDtsZXQgZT10aGlzO3RoaXMud2FzaUltcG9ydD17YXJnc19zaXplc19nZXQodCxyKXtsZXQgcz1uZXcgRGF0YVZpZXcoZS5pbnN0LmV4cG9ydHMubWVtb3J5LmJ1ZmZlcik7cy5zZXRVaW50MzIodCxlLmFyZ3MubGVuZ3RoLCEwKTtsZXQgZj0wO2ZvcihsZXQgYSBvZiBlLmFyZ3MpZis9YS5sZW5ndGgrMTtyZXR1cm4gcy5zZXRVaW50MzIocixmLCEwKSwwfSxhcmdzX2dldCh0LHIpe2xldCBzPW5ldyBEYXRhVmlldyhlLmluc3QuZXhwb3J0cy5tZW1vcnkuYnVmZmVyKSxmPW5ldyBVaW50OEFycmF5KGUuaW5zdC5leHBvcnRzLm1lbW9yeS5idWZmZXIpO2ZvcihsZXQgYT0wO2E8ZS5hcmdzLmxlbmd0aDthKyspe3Muc2V0VWludDMyKHQsciwhMCksdCs9NDtsZXQgdT1uZXcgVGV4dEVuY29kZXIoInV0Zi04IikuZW5jb2RlKGUuYXJnc1thXSk7Zi5zZXQodSxyKSxzLnNldFVpbnQ4KHIrdS5sZW5ndGgsMCkscis9dS5sZW5ndGgrMX1yZXR1cm4gMH0sZW52aXJvbl9zaXplc19nZXQodCxyKXtsZXQgcz1uZXcgRGF0YVZpZXcoZS5pbnN0LmV4cG9ydHMubWVtb3J5LmJ1ZmZlcik7cy5zZXRVaW50MzIodCxlLmVudi5sZW5ndGgsITApO2xldCBmPTA7Zm9yKGxldCBhIG9mIGUuZW52KWYrPWEubGVuZ3RoKzE7cmV0dXJuIHMuc2V0VWludDMyKHIsZiwhMCksMH0sZW52aXJvbl9nZXQodCxyKXtsZXQgcz1uZXcgRGF0YVZpZXcoZS5pbnN0LmV4cG9ydHMubWVtb3J5LmJ1ZmZlciksZj1uZXcgVWludDhBcnJheShlLmluc3QuZXhwb3J0cy5tZW1vcnkuYnVmZmVyKTtmb3IobGV0IGE9MDthPGkubGVuZ3RoO2ErKyl7cy5zZXRVaW50MzIodCxyLCEwKSx0Kz00O2xldCB1PW5ldyBUZXh0RW5jb2RlcigidXRmLTgiKS5lbmNvZGUoaVthXSk7Zi5zZXQodSxyKSxzLnNldFVpbnQ4KHIrdS5sZW5ndGgsMCkscis9dS5sZW5ndGgrMX1yZXR1cm4gMH0sY2xvY2tfcmVzX2dldCh0LHIpe3Rocm93InVuaW1wbGVtZW50ZWQifSxjbG9ja190aW1lX2dldCh0LHIscyl7bGV0IGY9bmV3IERhdGFWaWV3KGUuaW5zdC5leHBvcnRzLm1lbW9yeS5idWZmZXIpO2lmKHQ9PT0wKWYuc2V0QmlnVWludDY0KHMsQmlnSW50KG5ldyBEYXRlKCkuZ2V0VGltZSgpKSoxMDAwMDAwbiwhMCk7ZWxzZSBpZih0PT0xKXtsZXQgYTt0cnl7YT1CaWdJbnQoTWF0aC5yb3VuZChwZXJmb3JtYW5jZS5ub3coKSoxZTYpKX1jYXRjaHthPTBufWYuc2V0QmlnVWludDY0KHMsYSwhMCl9ZWxzZSBmLnNldEJpZ1VpbnQ2NChzLDBuLCEwKTtyZXR1cm4gMH0sZmRfYWR2aXNlKHQscixzLGYpe3JldHVybiBlLmZkc1t0XSE9bnVsbD9lLmZkc1t0XS5mZF9hZHZpc2UocixzLGYpOjh9LGZkX2FsbG9jYXRlKHQscixzKXtyZXR1cm4gZS5mZHNbdF0hPW51bGw/ZS5mZHNbdF0uZmRfYWxsb2NhdGUocixzKTo4fSxmZF9jbG9zZSh0KXtpZihlLmZkc1t0XSE9bnVsbCl7bGV0IHI9ZS5mZHNbdF0uZmRfY2xvc2UoKTtyZXR1cm4gZS5mZHNbdF09dm9pZCAwLHJ9ZWxzZSByZXR1cm4gOH0sZmRfZGF0YXN5bmModCl7cmV0dXJuIGUuZmRzW3RdIT1udWxsP2UuZmRzW3RdLmZkX2RhdGFzeW5jKCk6OH0sZmRfZmRzdGF0X2dldCh0LHIpe2lmKGUuZmRzW3RdIT1udWxsKXtsZXR7cmV0OnMsZmRzdGF0OmZ9PWUuZmRzW3RdLmZkX2Zkc3RhdF9nZXQoKTtyZXR1cm4gZiE9bnVsbCYmZi53cml0ZV9ieXRlcyhuZXcgRGF0YVZpZXcoZS5pbnN0LmV4cG9ydHMubWVtb3J5LmJ1ZmZlciksciksc31lbHNlIHJldHVybiA4fSxmZF9mZHN0YXRfc2V0X2ZsYWdzKHQscil7cmV0dXJuIGUuZmRzW3RdIT1udWxsP2UuZmRzW3RdLmZkX2Zkc3RhdF9zZXRfZmxhZ3Mocik6OH0sZmRfZmRzdGF0X3NldF9yaWdodHModCxyLHMpe3JldHVybiBlLmZkc1t0XSE9bnVsbD9lLmZkc1t0XS5mZF9mZHN0YXRfc2V0X3JpZ2h0cyhyLHMpOjh9LGZkX2ZpbGVzdGF0X2dldCh0LHIpe2lmKGUuZmRzW3RdIT1udWxsKXtsZXR7cmV0OnMsZmlsZXN0YXQ6Zn09ZS5mZHNbdF0uZmRfZmlsZXN0YXRfZ2V0KCk7cmV0dXJuIGYhPW51bGwmJmYud3JpdGVfYnl0ZXMobmV3IERhdGFWaWV3KGUuaW5zdC5leHBvcnRzLm1lbW9yeS5idWZmZXIpLHIpLHN9ZWxzZSByZXR1cm4gOH0sZmRfZmlsZXN0YXRfc2V0X3NpemUodCxyKXtyZXR1cm4gZS5mZHNbdF0hPW51bGw/ZS5mZHNbdF0uZmRfZmlsZXN0YXRfc2V0X3NpemUocik6OH0sZmRfZmlsZXN0YXRfc2V0X3RpbWVzKHQscixzLGYpe3JldHVybiBlLmZkc1t0XSE9bnVsbD9lLmZkc1t0XS5mZF9maWxlc3RhdF9zZXRfdGltZXMocixzLGYpOjh9LGZkX3ByZWFkKHQscixzLGYsYSl7bGV0IHU9bmV3IERhdGFWaWV3KGUuaW5zdC5leHBvcnRzLm1lbW9yeS5idWZmZXIpLF89bmV3IFVpbnQ4QXJyYXkoZS5pbnN0LmV4cG9ydHMubWVtb3J5LmJ1ZmZlcik7aWYoZS5mZHNbdF0hPW51bGwpe2xldCBkPWcucmVhZF9ieXRlc19hcnJheSh1LHIscykse3JldDpoLG5yZWFkOmN9PWUuZmRzW3RdLmZkX3ByZWFkKF8sZCxmKTtyZXR1cm4gdS5zZXRVaW50MzIoYSxjLCEwKSxofWVsc2UgcmV0dXJuIDh9LGZkX3ByZXN0YXRfZ2V0KHQscil7bGV0IHM9bmV3IERhdGFWaWV3KGUuaW5zdC5leHBvcnRzLm1lbW9yeS5idWZmZXIpO2lmKGUuZmRzW3RdIT1udWxsKXtsZXR7cmV0OmYscHJlc3RhdDphfT1lLmZkc1t0XS5mZF9wcmVzdGF0X2dldCgpO3JldHVybiBhIT1udWxsJiZhLndyaXRlX2J5dGVzKHMsciksZn1lbHNlIHJldHVybiA4fSxmZF9wcmVzdGF0X2Rpcl9uYW1lKHQscixzKXtpZihlLmZkc1t0XSE9bnVsbCl7bGV0e3JldDpmLHByZXN0YXRfZGlyX25hbWU6YX09ZS5mZHNbdF0uZmRfcHJlc3RhdF9kaXJfbmFtZSgpO3JldHVybiBhIT1udWxsJiZuZXcgVWludDhBcnJheShlLmluc3QuZXhwb3J0cy5tZW1vcnkuYnVmZmVyKS5zZXQoYSxyKSxmfWVsc2UgcmV0dXJuIDh9LGZkX3B3cml0ZSh0LHIscyxmLGEpe2xldCB1PW5ldyBEYXRhVmlldyhlLmluc3QuZXhwb3J0cy5tZW1vcnkuYnVmZmVyKSxfPW5ldyBVaW50OEFycmF5KGUuaW5zdC5leHBvcnRzLm1lbW9yeS5idWZmZXIpO2lmKGUuZmRzW3RdIT1udWxsKXtsZXQgZD1tLnJlYWRfYnl0ZXNfYXJyYXkodSxyLHMpLHtyZXQ6aCxud3JpdHRlbjpjfT1lLmZkc1t0XS5mZF9wd3JpdGUoXyxkLGYpO3JldHVybiB1LnNldFVpbnQzMihhLGMsITApLGh9ZWxzZSByZXR1cm4gOH0sZmRfcmVhZCh0LHIscyxmKXtsZXQgYT1uZXcgRGF0YVZpZXcoZS5pbnN0LmV4cG9ydHMubWVtb3J5LmJ1ZmZlciksdT1uZXcgVWludDhBcnJheShlLmluc3QuZXhwb3J0cy5tZW1vcnkuYnVmZmVyKTtpZihlLmZkc1t0XSE9bnVsbCl7bGV0IF89Zy5yZWFkX2J5dGVzX2FycmF5KGEscixzKSx7cmV0OmQsbnJlYWQ6aH09ZS5mZHNbdF0uZmRfcmVhZCh1LF8pO3JldHVybiBhLnNldFVpbnQzMihmLGgsITApLGR9ZWxzZSByZXR1cm4gOH0sZmRfcmVhZGRpcih0LHIscyxmLGEpe2xldCB1PW5ldyBEYXRhVmlldyhlLmluc3QuZXhwb3J0cy5tZW1vcnkuYnVmZmVyKSxfPW5ldyBVaW50OEFycmF5KGUuaW5zdC5leHBvcnRzLm1lbW9yeS5idWZmZXIpO2lmKGUuZmRzW3RdIT1udWxsKXtsZXQgZD0wO2Zvcig7Oyl7bGV0e3JldDpoLGRpcmVudDpjfT1lLmZkc1t0XS5mZF9yZWFkZGlyX3NpbmdsZShmKTtpZihoIT0wKXJldHVybiB1LnNldFVpbnQzMihhLGQsITApLGg7aWYoYz09bnVsbClicmVhaztpZihzLWQ8Yy5oZWFkX2xlbmd0aCgpKXtkPXM7YnJlYWt9bGV0IHA9bmV3IEFycmF5QnVmZmVyKGMuaGVhZF9sZW5ndGgoKSk7aWYoYy53cml0ZV9oZWFkX2J5dGVzKG5ldyBEYXRhVmlldyhwKSwwKSxfLnNldChuZXcgVWludDhBcnJheShwKS5zbGljZSgwLE1hdGgubWluKHAuYnl0ZUxlbmd0aCxzLWQpKSxyKSxyKz1jLmhlYWRfbGVuZ3RoKCksZCs9Yy5oZWFkX2xlbmd0aCgpLHMtZDxjLm5hbWVfbGVuZ3RoKCkpe2Q9czticmVha31jLndyaXRlX25hbWVfYnl0ZXMoXyxyLHMtZCkscis9Yy5uYW1lX2xlbmd0aCgpLGQrPWMubmFtZV9sZW5ndGgoKSxmPWMuZF9uZXh0fXJldHVybiB1LnNldFVpbnQzMihhLGQsITApLDB9ZWxzZSByZXR1cm4gOH0sZmRfcmVudW1iZXIodCxyKXtpZihlLmZkc1t0XSE9bnVsbCYmZS5mZHNbcl0hPW51bGwpe2xldCBzPWUuZmRzW3JdLmZkX2Nsb3NlKCk7cmV0dXJuIHMhPTA/czooZS5mZHNbcl09ZS5mZHNbdF0sZS5mZHNbdF09dm9pZCAwLDApfWVsc2UgcmV0dXJuIDh9LGZkX3NlZWsodCxyLHMsZil7bGV0IGE9bmV3IERhdGFWaWV3KGUuaW5zdC5leHBvcnRzLm1lbW9yeS5idWZmZXIpO2lmKGUuZmRzW3RdIT1udWxsKXtsZXR7cmV0OnUsb2Zmc2V0Ol99PWUuZmRzW3RdLmZkX3NlZWsocixzKTtyZXR1cm4gYS5zZXRCaWdJbnQ2NChmLF8sITApLHV9ZWxzZSByZXR1cm4gOH0sZmRfc3luYyh0KXtyZXR1cm4gZS5mZHNbdF0hPW51bGw/ZS5mZHNbdF0uZmRfc3luYygpOjh9LGZkX3RlbGwodCxyKXtsZXQgcz1uZXcgRGF0YVZpZXcoZS5pbnN0LmV4cG9ydHMubWVtb3J5LmJ1ZmZlcik7aWYoZS5mZHNbdF0hPW51bGwpe2xldHtyZXQ6ZixvZmZzZXQ6YX09ZS5mZHNbdF0uZmRfdGVsbCgpO3JldHVybiBzLnNldEJpZ1VpbnQ2NChyLGEsITApLGZ9ZWxzZSByZXR1cm4gOH0sZmRfd3JpdGUodCxyLHMsZil7bGV0IGE9bmV3IERhdGFWaWV3KGUuaW5zdC5leHBvcnRzLm1lbW9yeS5idWZmZXIpLHU9bmV3IFVpbnQ4QXJyYXkoZS5pbnN0LmV4cG9ydHMubWVtb3J5LmJ1ZmZlcik7aWYoZS5mZHNbdF0hPW51bGwpe2xldCBfPW0ucmVhZF9ieXRlc19hcnJheShhLHIscykse3JldDpkLG53cml0dGVuOmh9PWUuZmRzW3RdLmZkX3dyaXRlKHUsXyk7cmV0dXJuIGEuc2V0VWludDMyKGYsaCwhMCksZH1lbHNlIHJldHVybiA4fSxwYXRoX2NyZWF0ZV9kaXJlY3RvcnkodCxyLHMpe2xldCBmPW5ldyBVaW50OEFycmF5KGUuaW5zdC5leHBvcnRzLm1lbW9yeS5idWZmZXIpO2lmKGUuZmRzW3RdIT1udWxsKXtsZXQgYT1uZXcgVGV4dERlY29kZXIoInV0Zi04IikuZGVjb2RlKGYuc2xpY2UocixyK3MpKTtyZXR1cm4gZS5mZHNbdF0ucGF0aF9jcmVhdGVfZGlyZWN0b3J5KGEpfX0scGF0aF9maWxlc3RhdF9nZXQodCxyLHMsZixhKXtsZXQgdT1uZXcgRGF0YVZpZXcoZS5pbnN0LmV4cG9ydHMubWVtb3J5LmJ1ZmZlciksXz1uZXcgVWludDhBcnJheShlLmluc3QuZXhwb3J0cy5tZW1vcnkuYnVmZmVyKTtpZihlLmZkc1t0XSE9bnVsbCl7bGV0IGQ9bmV3IFRleHREZWNvZGVyKCJ1dGYtOCIpLmRlY29kZShfLnNsaWNlKHMscytmKSkse3JldDpoLGZpbGVzdGF0OmN9PWUuZmRzW3RdLnBhdGhfZmlsZXN0YXRfZ2V0KHIsZCk7cmV0dXJuIGMhPW51bGwmJmMud3JpdGVfYnl0ZXModSxhKSxofWVsc2UgcmV0dXJuIDh9LHBhdGhfZmlsZXN0YXRfc2V0X3RpbWVzKHQscixzLGYsYSx1LF8pe2xldCBkPW5ldyBVaW50OEFycmF5KGUuaW5zdC5leHBvcnRzLm1lbW9yeS5idWZmZXIpO2lmKGUuZmRzW3RdIT1udWxsKXtsZXQgaD1uZXcgVGV4dERlY29kZXIoInV0Zi04IikuZGVjb2RlKGQuc2xpY2UocyxzK2YpKTtyZXR1cm4gZS5mZHNbdF0ucGF0aF9maWxlc3RhdF9zZXRfdGltZXMocixoLGEsdSxfKX1lbHNlIHJldHVybiA4fSxwYXRoX2xpbmsodCxyLHMsZixhLHUsXyl7bGV0IGQ9bmV3IFVpbnQ4QXJyYXkoZS5pbnN0LmV4cG9ydHMubWVtb3J5LmJ1ZmZlcik7aWYoZS5mZHNbdF0hPW51bGwmJmUuZmRzW2FdIT1udWxsKXtsZXQgaD1uZXcgVGV4dERlY29kZXIoInV0Zi04IikuZGVjb2RlKGQuc2xpY2UocyxzK2YpKSxjPW5ldyBUZXh0RGVjb2RlcigidXRmLTgiKS5kZWNvZGUoZC5zbGljZSh1LHUrXykpO3JldHVybiBlLmZkc1thXS5wYXRoX2xpbmsodCxyLGgsYyl9ZWxzZSByZXR1cm4gOH0scGF0aF9vcGVuKHQscixzLGYsYSx1LF8sZCxoKXtsZXQgYz1uZXcgRGF0YVZpZXcoZS5pbnN0LmV4cG9ydHMubWVtb3J5LmJ1ZmZlcikscD1uZXcgVWludDhBcnJheShlLmluc3QuZXhwb3J0cy5tZW1vcnkuYnVmZmVyKTtpZihlLmZkc1t0XSE9bnVsbCl7bGV0IEg9bmV3IFRleHREZWNvZGVyKCJ1dGYtOCIpLmRlY29kZShwLnNsaWNlKHMscytmKSkse3JldDpFLGZkX29iajpqfT1lLmZkc1t0XS5wYXRoX29wZW4ocixILGEsdSxfLGQpO2lmKEUhPTApcmV0dXJuIEU7ZS5mZHMucHVzaChqKTtsZXQgJD1lLmZkcy5sZW5ndGgtMTtyZXR1cm4gYy5zZXRVaW50MzIoaCwkLCEwKSwwfWVsc2UgcmV0dXJuIDh9LHBhdGhfcmVhZGxpbmsodCxyLHMsZixhLHUpe2xldCBfPW5ldyBEYXRhVmlldyhlLmluc3QuZXhwb3J0cy5tZW1vcnkuYnVmZmVyKSxkPW5ldyBVaW50OEFycmF5KGUuaW5zdC5leHBvcnRzLm1lbW9yeS5idWZmZXIpO2lmKGUuZmRzW3RdIT1udWxsKXtsZXQgaD1uZXcgVGV4dERlY29kZXIoInV0Zi04IikuZGVjb2RlKGQuc2xpY2UocixyK3MpKSx7cmV0OmMsZGF0YTpwfT1lLmZkc1t0XS5wYXRoX3JlYWRsaW5rKGgpO2lmKHAhPW51bGwpe2lmKHAubGVuZ3RoPmEpcmV0dXJuIF8uc2V0VWludDMyKHUsMCwhMCksODtkLnNldChwLGYpLF8uc2V0VWludDMyKHUscC5sZW5ndGgsITApfXJldHVybiBjfWVsc2UgcmV0dXJuIDh9LHBhdGhfcmVtb3ZlX2RpcmVjdG9yeSh0LHIscyl7bGV0IGY9bmV3IFVpbnQ4QXJyYXkoZS5pbnN0LmV4cG9ydHMubWVtb3J5LmJ1ZmZlcik7aWYoZS5mZHNbdF0hPW51bGwpe2xldCBhPW5ldyBUZXh0RGVjb2RlcigidXRmLTgiKS5kZWNvZGUoZi5zbGljZShyLHIrcykpO3JldHVybiBlLmZkc1t0XS5wYXRoX3JlbW92ZV9kaXJlY3RvcnkoYSl9ZWxzZSByZXR1cm4gOH0scGF0aF9yZW5hbWUodCxyLHMsZixhLHUpe3Rocm93IkZJWE1FIHdoYXQgaXMgdGhlIGJlc3QgYWJzdHJhY3Rpb24gZm9yIHRoaXM/In0scGF0aF9zeW1saW5rKHQscixzLGYsYSl7bGV0IHU9bmV3IFVpbnQ4QXJyYXkoZS5pbnN0LmV4cG9ydHMubWVtb3J5LmJ1ZmZlcik7aWYoZS5mZHNbc10hPW51bGwpe2xldCBfPW5ldyBUZXh0RGVjb2RlcigidXRmLTgiKS5kZWNvZGUodS5zbGljZSh0LHQrcikpLGQ9bmV3IFRleHREZWNvZGVyKCJ1dGYtOCIpLmRlY29kZSh1LnNsaWNlKGYsZithKSk7cmV0dXJuIGUuZmRzW3NdLnBhdGhfc3ltbGluayhfLGQpfWVsc2UgcmV0dXJuIDh9LHBhdGhfdW5saW5rX2ZpbGUodCxyLHMpe2xldCBmPW5ldyBVaW50OEFycmF5KGUuaW5zdC5leHBvcnRzLm1lbW9yeS5idWZmZXIpO2lmKGUuZmRzW3RdIT1udWxsKXtsZXQgYT1uZXcgVGV4dERlY29kZXIoInV0Zi04IikuZGVjb2RlKGYuc2xpY2UocixyK3MpKTtyZXR1cm4gZS5mZHNbdF0ucGF0aF91bmxpbmtfZmlsZShhKX1lbHNlIHJldHVybiA4fSxwb2xsX29uZW9mZih0LHIscyl7dGhyb3ciYXN5bmMgaW8gbm90IHN1cHBvcnRlZCJ9LHByb2NfZXhpdCh0KXt0aHJvdyJleGl0IHdpdGggZXhpdCBjb2RlICIrdH0scHJvY19yYWlzZSh0KXt0aHJvdyJyYWlzZWQgc2lnbmFsICIrdH0sc2NoZWRfeWllbGQoKXt9LHJhbmRvbV9nZXQodCxyKXtsZXQgcz1uZXcgVWludDhBcnJheShlLmluc3QuZXhwb3J0cy5tZW1vcnkuYnVmZmVyKTtmb3IobGV0IGY9MDtmPHI7ZisrKXNbdCtmXT1NYXRoLnJhbmRvbSgpKjI1NnwwfSxzb2NrX3JlY3YodCxyLHMpe3Rocm93InNvY2tldHMgbm90IHN1cHBvcnRlZCJ9LHNvY2tfc2VuZCh0LHIscyl7dGhyb3cic29ja2V0cyBub3Qgc3VwcG9ydGVkIn0sc29ja19zaHV0ZG93bih0LHIpe3Rocm93InNvY2tldHMgbm90IHN1cHBvcnRlZCJ9fX19O2NsYXNzIEx7ZmRfYWR2aXNlKG4saSxsKXtyZXR1cm4tMX1mZF9hbGxvY2F0ZShuLGkpe3JldHVybi0xfWZkX2Nsb3NlKCl7cmV0dXJuIDB9ZmRfZGF0YXN5bmMoKXtyZXR1cm4tMX1mZF9mZHN0YXRfZ2V0KCl7cmV0dXJue3JldDotMSxmZHN0YXQ6bnVsbH19ZmRfZmRzdGF0X3NldF9mbGFncyhuKXtyZXR1cm4tMX1mZF9mZHN0YXRfc2V0X3JpZ2h0cyhuLGkpe3JldHVybi0xfWZkX2ZpbGVzdGF0X2dldCgpe3JldHVybntyZXQ6LTEsZmlsZXN0YXQ6bnVsbH19ZmRfZmlsZXN0YXRfc2V0X3NpemUobil7cmV0dXJuLTF9ZmRfZmlsZXN0YXRfc2V0X3RpbWVzKG4saSxsKXtyZXR1cm4tMX1mZF9wcmVhZChuLGksbCl7cmV0dXJue3JldDotMSxucmVhZDowfX1mZF9wcmVzdGF0X2dldCgpe3JldHVybntyZXQ6LTEscHJlc3RhdDpudWxsfX1mZF9wcmVzdGF0X2Rpcl9uYW1lKG4saSl7cmV0dXJue3JldDotMSxwcmVzdGF0X2Rpcl9uYW1lOm51bGx9fWZkX3B3cml0ZShuLGksbCl7cmV0dXJue3JldDotMSxud3JpdHRlbjowfX1mZF9yZWFkKG4saSl7cmV0dXJue3JldDotMSxucmVhZDowfX1mZF9yZWFkZGlyX3NpbmdsZShuKXtyZXR1cm57cmV0Oi0xLGRpcmVudDpudWxsfX1mZF9zZWVrKG4saSl7cmV0dXJue3JldDotMSxvZmZzZXQ6MG59fWZkX3N5bmMoKXtyZXR1cm4gMH1mZF90ZWxsKCl7cmV0dXJue3JldDotMSxvZmZzZXQ6MG59fWZkX3dyaXRlKG4saSl7cmV0dXJue3JldDotMSxud3JpdHRlbjowfX1wYXRoX2NyZWF0ZV9kaXJlY3Rvcnkobil7cmV0dXJuLTF9cGF0aF9maWxlc3RhdF9nZXQobixpKXtyZXR1cm57cmV0Oi0xLGZpbGVzdGF0Om51bGx9fXBhdGhfZmlsZXN0YXRfc2V0X3RpbWVzKG4saSxsLGUsdCl7cmV0dXJuLTF9cGF0aF9saW5rKG4saSxsLGUpe3JldHVybi0xfXBhdGhfb3BlbihuLGksbCxlLHQscil7cmV0dXJue3JldDotMSxmZF9vYmo6bnVsbH19cGF0aF9yZWFkbGluayhuKXtyZXR1cm57cmV0Oi0xLGRhdGE6bnVsbH19cGF0aF9yZW1vdmVfZGlyZWN0b3J5KG4pe3JldHVybi0xfXBhdGhfcmVuYW1lKG4saSxsKXtyZXR1cm4tMX1wYXRoX3N5bWxpbmsobixpKXtyZXR1cm4tMX1wYXRoX3VubGlua19maWxlKG4pe3JldHVybi0xfX1jbGFzcyBie2dldCBzaXplKCl7cmV0dXJuIEJpZ0ludCh0aGlzLmRhdGEuYnl0ZUxlbmd0aCl9c3RhdCgpe3JldHVybiBuZXcgSShVLHRoaXMuc2l6ZSl9dHJ1bmNhdGUoKXt0aGlzLmRhdGE9bmV3IFVpbnQ4QXJyYXkoW10pfWNvbnN0cnVjdG9yKG4pe3RoaXMuZGF0YT1uZXcgVWludDhBcnJheShuKX19Y2xhc3MgUiBleHRlbmRzIEx7ZmRfZmRzdGF0X2dldCgpe3JldHVybntyZXQ6MCxmZHN0YXQ6bmV3IGsoVSwwKX19ZmRfcmVhZChuLGkpe2xldCBsPTA7Zm9yKGxldCBlIG9mIGkpaWYodGhpcy5maWxlX3Bvczx0aGlzLmZpbGUuZGF0YS5ieXRlTGVuZ3RoKXtsZXQgdD10aGlzLmZpbGUuZGF0YS5zbGljZShOdW1iZXIodGhpcy5maWxlX3BvcyksTnVtYmVyKHRoaXMuZmlsZV9wb3MrQmlnSW50KGUuYnVmX2xlbikpKTtuLnNldCh0LGUuYnVmKSx0aGlzLmZpbGVfcG9zKz1CaWdJbnQodC5sZW5ndGgpLGwrPXQubGVuZ3RofWVsc2UgYnJlYWs7cmV0dXJue3JldDowLG5yZWFkOmx9fWZkX3NlZWsobixpKXtsZXQgbDtzd2l0Y2goaSl7Y2FzZSBOOmw9bjticmVhaztjYXNlIE86bD10aGlzLmZpbGVfcG9zK247YnJlYWs7Y2FzZSBGOmw9QmlnSW50KHRoaXMuZmlsZS5kYXRhLmJ5dGVMZW5ndGgpK247YnJlYWs7ZGVmYXVsdDpyZXR1cm57cmV0OjI4LG9mZnNldDowbn19cmV0dXJuIGw8MD97cmV0OjI4LG9mZnNldDowbn06KHRoaXMuZmlsZV9wb3M9bCx7cmV0OjAsb2Zmc2V0OnRoaXMuZmlsZV9wb3N9KX1mZF93cml0ZShuLGkpe2xldCBsPTA7Zm9yKGxldCBlIG9mIGkpe2xldCB0PW4uc2xpY2UoZS5idWYsZS5idWYrZS5idWZfbGVuKTtpZih0aGlzLmZpbGVfcG9zK0JpZ0ludCh0LmJ5dGVMZW5ndGgpPnRoaXMuZmlsZS5zaXplKXtsZXQgcj10aGlzLmZpbGUuZGF0YTt0aGlzLmZpbGUuZGF0YT1uZXcgVWludDhBcnJheShOdW1iZXIodGhpcy5maWxlX3BvcytCaWdJbnQodC5ieXRlTGVuZ3RoKSkpLHRoaXMuZmlsZS5kYXRhLnNldChyKX10aGlzLmZpbGUuZGF0YS5zZXQodC5zbGljZSgwLE51bWJlcih0aGlzLmZpbGUuc2l6ZS10aGlzLmZpbGVfcG9zKSksTnVtYmVyKHRoaXMuZmlsZV9wb3MpKSx0aGlzLmZpbGVfcG9zKz1CaWdJbnQodC5ieXRlTGVuZ3RoKSxsKz1lLmJ1Zl9sZW59cmV0dXJue3JldDowLG53cml0dGVuOmx9fWZkX2ZpbGVzdGF0X2dldCgpe3JldHVybntyZXQ6MCxmaWxlc3RhdDp0aGlzLmZpbGUuc3RhdCgpfX1jb25zdHJ1Y3RvcihuKXtzdXBlcigpLHRoaXMuZmlsZV9wb3M9MG4sdGhpcy5maWxlPW59fXZhciBWPSIvbGliL3R5cGUtc2FmYXJpLndhc20iO2NvbnN0IHY9Y29uc29sZS5sb2c7Y29uc29sZS5sb2c9ZnVuY3Rpb24oLi4ubyl7digiJWNbd29ya2VyXSIsImNvbG9yOiBncmVlbiIsLi4ubyl9O2NvbnN0IEE9bmV3IFRleHRFbmNvZGVyLHo9bmV3IFRleHREZWNvZGVyLEM9bmV3IFIobmV3IGIoW10pKSxTPW5ldyBSKG5ldyBiKFtdKSksUD1uZXcgUihuZXcgYihbXSkpLEQ9KG8sbixpKT0+e2NvbnN0IGw9bi5ieXRlTGVuZ3RoLGU9by5tYWxsb2MobCk7dHJ5e2NvbnN0IHQ9by5tZW1vcnk7bmV3IFVpbnQ4QXJyYXkodC5idWZmZXIsZSxsKS5zZXQobiksaShlLGwpfWZpbmFsbHl7by5mcmVlKGUpfX07YXN5bmMgZnVuY3Rpb24gVygpe2NvbnN0IG89c2VsZi5sb2NhdGlvbi5vcmlnaW4rVixpPShhd2FpdCBxKGZldGNoKG8pKSkuaW5zdGFuY2UuZXhwb3J0cztjb25zb2xlLmxvZyhpKSxvbm1lc3NhZ2U9bD0+e2NvbnN0IGU9bC5kYXRhO2NvbnNvbGUubG9nKCJyZWNlaXZlZCByZXF1ZXN0IGZyb20gbWFpbiIsZSksZS50YWc9PT0idG9VcHBlciI/TShpLGUuZGF0YSk6ZS50YWc9PT0icnVuUGFyc2UiP3koaSwicnVuUGFyc2UiLGUuZGF0YSk6ZS50YWc9PT0icnVuUGFyc2VUeXBlIj95KGksInJ1blBhcnNlVHlwZSIsZS5kYXRhKTplLnRhZz09PSJydW5JbmZlckFic3RyYWN0Ij95KGksInJ1bkluZmVyQWJzdHJhY3QiLGUuZGF0YSk6ZS50YWc9PT0icnVuVW5pZnkiP3koaSwicnVuVW5pZnkiLGUuZGF0YSk6SygpfSxKKCl9ZnVuY3Rpb24geChvLG4pe3RyeXtjb25zdCBpPW8uZ2V0U3RyaW5nKG4pLGw9by5nZXRTdHJpbmdMZW4obiksZT1uZXcgVWludDhBcnJheShvLm1lbW9yeS5idWZmZXIsaSxsKTtyZXR1cm4gei5kZWNvZGUoZSl9ZmluYWxseXtvLmZyZWVTdHJpbmdXaXRoTGVuKG4pfX1mdW5jdGlvbiBNKG8sbil7Y29uc3QgaT1BLmVuY29kZShuLnZhbHVlKTtsZXQgbD1udWxsO0QobyxpLChlLHQpPT57Y29uc3Qgcj1vLnJ1blRvVXBwZXIoZSx0KSxzPXgobyxyKTtjb25zb2xlLmxvZyhgcmVzdWx0OiAke3N9YCksbD1zfSksbCE9PW51bGw/dyh7dGFnOiJ3b3JrZXJSZXN1bHQiLGRhdGE6e3Jlc3VsdDpsfX0pOkIoKX1mdW5jdGlvbiB5KG8sbixpKXtjb25zdCBsPUEuZW5jb2RlKEpTT04uc3RyaW5naWZ5KGkpKTtsZXQgZT1udWxsO2lmKEQobyxsLCh0LHIpPT57Y29uc3Qgcz1vW25dLGY9cyh0LHIpLGE9eChvLGYpO2NvbnNvbGUubG9nKGByZXN1bHQ6ICR7YX1gKSxlPWF9KSxlIT09bnVsbCl7Y29uc3QgdD1KU09OLnBhcnNlKGUpO3coe3RhZzoid29ya2VyUmVzdWx0IixkYXRhOnR9KX1lbHNlIEIoKX1mdW5jdGlvbiB3KG8pe2NvbnNvbGUubG9nKCJwb3N0aW5nIHJlc3BvbnNlIixvKSxwb3N0TWVzc2FnZShvKX1mdW5jdGlvbiBKKCl7dyh7dGFnOiJ3b3JrZXJSZWFkeSJ9KX1mdW5jdGlvbiBLKCl7dyh7dGFnOiJ3b3JrZXJVbmtub3duUmVxdWVzdCJ9KX1mdW5jdGlvbiBCKCl7dyh7dGFnOiJ3b3JrZXJGYWlsdXJlIn0pfWFzeW5jIGZ1bmN0aW9uIHEobyl7Y29uc3Qgbj1bXSxpPVtdLGw9W0MsUyxQXSxlPW5ldyBUKG4saSxsKSx0PWF3YWl0IFdlYkFzc2VtYmx5Lmluc3RhbnRpYXRlU3RyZWFtaW5nKG8se3dhc2lfc25hcHNob3RfcHJldmlldzE6ZS53YXNpSW1wb3J0fSk7cmV0dXJuIGUuaW5zdD10Lmluc3RhbmNlLHR9VygpfSkoKTsK", To = typeof window < "u" && window.Blob && new Blob([atob(Pa)], { type: "text/javascript;charset=utf-8" });
function su() {
  let n;
  try {
    if (n = To && (window.URL || window.webkitURL).createObjectURL(To), !n)
      throw "";
    return new Worker(n);
  } catch {
    return new Worker("data:application/javascript;base64," + Pa);
  } finally {
    n && (window.URL || window.webkitURL).revokeObjectURL(n);
  }
}
const Va = 1024;
let ru = 0, Ms = class {
  constructor(t, e) {
    this.from = t, this.to = e;
  }
};
class P {
  /**
  Create a new node prop type.
  */
  constructor(t = {}) {
    this.id = ru++, this.perNode = !!t.perNode, this.deserialize = t.deserialize || (() => {
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
  add(t) {
    if (this.perNode)
      throw new RangeError("Can't add per-node props to node types");
    return typeof t != "function" && (t = Mt.match(t)), (e) => {
      let i = t(e);
      return i === void 0 ? null : [this, i];
    };
  }
}
P.closedBy = new P({ deserialize: (n) => n.split(" ") });
P.openedBy = new P({ deserialize: (n) => n.split(" ") });
P.group = new P({ deserialize: (n) => n.split(" ") });
P.contextHash = new P({ perNode: !0 });
P.lookAhead = new P({ perNode: !0 });
P.mounted = new P({ perNode: !0 });
const ou = /* @__PURE__ */ Object.create(null);
class Mt {
  /**
  @internal
  */
  constructor(t, e, i, s = 0) {
    this.name = t, this.props = e, this.id = i, this.flags = s;
  }
  /**
  Define a node type.
  */
  static define(t) {
    let e = t.props && t.props.length ? /* @__PURE__ */ Object.create(null) : ou, i = (t.top ? 1 : 0) | (t.skipped ? 2 : 0) | (t.error ? 4 : 0) | (t.name == null ? 8 : 0), s = new Mt(t.name || "", e, t.id, i);
    if (t.props) {
      for (let r of t.props)
        if (Array.isArray(r) || (r = r(s)), r) {
          if (r[0].perNode)
            throw new RangeError("Can't store a per-node prop on a node type");
          e[r[0].id] = r[1];
        }
    }
    return s;
  }
  /**
  Retrieves a node prop for this type. Will return `undefined` if
  the prop isn't present on this node.
  */
  prop(t) {
    return this.props[t.id];
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
  is(t) {
    if (typeof t == "string") {
      if (this.name == t)
        return !0;
      let e = this.prop(P.group);
      return e ? e.indexOf(t) > -1 : !1;
    }
    return this.id == t;
  }
  /**
  Create a function from node types to arbitrary values by
  specifying an object whose property names are node or
  [group](#common.NodeProp^group) names. Often useful with
  [`NodeProp.add`](#common.NodeProp.add). You can put multiple
  names, separated by spaces, in a single property name to map
  multiple node names to a single value.
  */
  static match(t) {
    let e = /* @__PURE__ */ Object.create(null);
    for (let i in t)
      for (let s of i.split(" "))
        e[s] = t[i];
    return (i) => {
      for (let s = i.prop(P.group), r = -1; r < (s ? s.length : 0); r++) {
        let o = e[r < 0 ? i.name : s[r]];
        if (o)
          return o;
      }
    };
  }
}
Mt.none = new Mt(
  "",
  /* @__PURE__ */ Object.create(null),
  0,
  8
  /* NodeFlag.Anonymous */
);
class Jr {
  /**
  Create a set with the given types. The `id` property of each
  type should correspond to its position within the array.
  */
  constructor(t) {
    this.types = t;
    for (let e = 0; e < t.length; e++)
      if (t[e].id != e)
        throw new RangeError("Node type ids should correspond to array positions when creating a node set");
  }
  /**
  Create a copy of this set with some node properties added. The
  arguments to this method can be created with
  [`NodeProp.add`](#common.NodeProp.add).
  */
  extend(...t) {
    let e = [];
    for (let i of this.types) {
      let s = null;
      for (let r of t) {
        let o = r(i);
        o && (s || (s = Object.assign({}, i.props)), s[o[0].id] = o[1]);
      }
      e.push(s ? new Mt(i.name, s, i.id, i.flags) : i);
    }
    return new Jr(e);
  }
}
const $i = /* @__PURE__ */ new WeakMap(), Do = /* @__PURE__ */ new WeakMap();
var st;
(function(n) {
  n[n.ExcludeBuffers = 1] = "ExcludeBuffers", n[n.IncludeAnonymous = 2] = "IncludeAnonymous", n[n.IgnoreMounts = 4] = "IgnoreMounts", n[n.IgnoreOverlays = 8] = "IgnoreOverlays";
})(st || (st = {}));
class U {
  /**
  Construct a new tree. See also [`Tree.build`](#common.Tree^build).
  */
  constructor(t, e, i, s, r) {
    if (this.type = t, this.children = e, this.positions = i, this.length = s, this.props = null, r && r.length) {
      this.props = /* @__PURE__ */ Object.create(null);
      for (let [o, l] of r)
        this.props[typeof o == "number" ? o : o.id] = l;
    }
  }
  /**
  @internal
  */
  toString() {
    let t = this.prop(P.mounted);
    if (t && !t.overlay)
      return t.tree.toString();
    let e = "";
    for (let i of this.children) {
      let s = i.toString();
      s && (e && (e += ","), e += s);
    }
    return this.type.name ? (/\W/.test(this.type.name) && !this.type.isError ? JSON.stringify(this.type.name) : this.type.name) + (e.length ? "(" + e + ")" : "") : e;
  }
  /**
  Get a [tree cursor](#common.TreeCursor) positioned at the top of
  the tree. Mode can be used to [control](#common.IterMode) which
  nodes the cursor visits.
  */
  cursor(t = 0) {
    return new vi(this.topNode, t);
  }
  /**
  Get a [tree cursor](#common.TreeCursor) pointing into this tree
  at the given position and side (see
  [`moveTo`](#common.TreeCursor.moveTo).
  */
  cursorAt(t, e = 0, i = 0) {
    let s = $i.get(this) || this.topNode, r = new vi(s);
    return r.moveTo(t, e), $i.set(this, r._tree), r;
  }
  /**
  Get a [syntax node](#common.SyntaxNode) object for the top of the
  tree.
  */
  get topNode() {
    return new ie(this, 0, 0, null);
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
  resolve(t, e = 0) {
    let i = _e($i.get(this) || this.topNode, t, e, !1);
    return $i.set(this, i), i;
  }
  /**
  Like [`resolve`](#common.Tree.resolve), but will enter
  [overlaid](#common.MountedTree.overlay) nodes, producing a syntax node
  pointing into the innermost overlaid tree at the given position
  (with parent links going through all parent structure, including
  the host trees).
  */
  resolveInner(t, e = 0) {
    let i = _e(Do.get(this) || this.topNode, t, e, !0);
    return Do.set(this, i), i;
  }
  /**
  Iterate over the tree and its children, calling `enter` for any
  node that touches the `from`/`to` region (if given) before
  running over such a node's children, and `leave` (if given) when
  leaving the node. When `enter` returns `false`, that node will
  not have its children iterated over (or `leave` called).
  */
  iterate(t) {
    let { enter: e, leave: i, from: s = 0, to: r = this.length } = t, o = t.mode || 0, l = (o & st.IncludeAnonymous) > 0;
    for (let a = this.cursor(o | st.IncludeAnonymous); ; ) {
      let h = !1;
      if (a.from <= r && a.to >= s && (!l && a.type.isAnonymous || e(a) !== !1)) {
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
  prop(t) {
    return t.perNode ? this.props ? this.props[t.id] : void 0 : this.type.prop(t);
  }
  /**
  Returns the node's [per-node props](#common.NodeProp.perNode) in a
  format that can be passed to the [`Tree`](#common.Tree)
  constructor.
  */
  get propValues() {
    let t = [];
    if (this.props)
      for (let e in this.props)
        t.push([+e, this.props[e]]);
    return t;
  }
  /**
  Balance the direct children of this tree, producing a copy of
  which may have children grouped into subtrees with type
  [`NodeType.none`](#common.NodeType^none).
  */
  balance(t = {}) {
    return this.children.length <= 8 ? this : $r(Mt.none, this.children, this.positions, 0, this.children.length, 0, this.length, (e, i, s) => new U(this.type, e, i, s, this.propValues), t.makeTree || ((e, i, s) => new U(Mt.none, e, i, s)));
  }
  /**
  Build a tree from a postfix-ordered buffer of node information,
  or a cursor over such a buffer.
  */
  static build(t) {
    return au(t);
  }
}
U.empty = new U(Mt.none, [], [], 0);
class Qr {
  constructor(t, e) {
    this.buffer = t, this.index = e;
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
    return new Qr(this.buffer, this.index);
  }
}
class We {
  /**
  Create a tree buffer.
  */
  constructor(t, e, i) {
    this.buffer = t, this.length = e, this.set = i;
  }
  /**
  @internal
  */
  get type() {
    return Mt.none;
  }
  /**
  @internal
  */
  toString() {
    let t = [];
    for (let e = 0; e < this.buffer.length; )
      t.push(this.childString(e)), e = this.buffer[e + 3];
    return t.join(",");
  }
  /**
  @internal
  */
  childString(t) {
    let e = this.buffer[t], i = this.buffer[t + 3], s = this.set.types[e], r = s.name;
    if (/\W/.test(r) && !s.isError && (r = JSON.stringify(r)), t += 4, i == t)
      return r;
    let o = [];
    for (; t < i; )
      o.push(this.childString(t)), t = this.buffer[t + 3];
    return r + "(" + o.join(",") + ")";
  }
  /**
  @internal
  */
  findChild(t, e, i, s, r) {
    let { buffer: o } = this, l = -1;
    for (let a = t; a != e && !(Ba(r, s, o[a + 1], o[a + 2]) && (l = a, i > 0)); a = o[a + 3])
      ;
    return l;
  }
  /**
  @internal
  */
  slice(t, e, i) {
    let s = this.buffer, r = new Uint16Array(e - t), o = 0;
    for (let l = t, a = 0; l < e; ) {
      r[a++] = s[l++], r[a++] = s[l++] - i;
      let h = r[a++] = s[l++] - i;
      r[a++] = s[l++] - t, o = Math.max(o, h);
    }
    return new We(r, o, this.set);
  }
}
function Ba(n, t, e, i) {
  switch (n) {
    case -2:
      return e < t;
    case -1:
      return i >= t && e < t;
    case 0:
      return e < t && i > t;
    case 1:
      return e <= t && i > t;
    case 2:
      return i > t;
    case 4:
      return !0;
  }
}
function Wa(n, t) {
  let e = n.childBefore(t);
  for (; e; ) {
    let i = e.lastChild;
    if (!i || i.to != e.to)
      break;
    i.type.isError && i.from == i.to ? (n = e, e = i.prevSibling) : e = i;
  }
  return n;
}
function _e(n, t, e, i) {
  for (var s; n.from == n.to || (e < 1 ? n.from >= t : n.from > t) || (e > -1 ? n.to <= t : n.to < t); ) {
    let o = !i && n instanceof ie && n.index < 0 ? null : n.parent;
    if (!o)
      return n;
    n = o;
  }
  let r = i ? 0 : st.IgnoreOverlays;
  if (i)
    for (let o = n, l = o.parent; l; o = l, l = o.parent)
      o instanceof ie && o.index < 0 && ((s = l.enter(t, e, r)) === null || s === void 0 ? void 0 : s.from) != o.from && (n = l);
  for (; ; ) {
    let o = n.enter(t, e, r);
    if (!o)
      return n;
    n = o;
  }
}
class ie {
  constructor(t, e, i, s) {
    this._tree = t, this.from = e, this.index = i, this._parent = s;
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
  nextChild(t, e, i, s, r = 0) {
    for (let o = this; ; ) {
      for (let { children: l, positions: a } = o._tree, h = e > 0 ? l.length : -1; t != h; t += e) {
        let c = l[t], f = a[t] + o.from;
        if (Ba(s, i, f, f + c.length)) {
          if (c instanceof We) {
            if (r & st.ExcludeBuffers)
              continue;
            let u = c.findChild(0, c.buffer.length, e, i - f, s);
            if (u > -1)
              return new he(new lu(o, c, t, f), null, u);
          } else if (r & st.IncludeAnonymous || !c.type.isAnonymous || Ur(c)) {
            let u;
            if (!(r & st.IgnoreMounts) && c.props && (u = c.prop(P.mounted)) && !u.overlay)
              return new ie(u.tree, f, t, o);
            let d = new ie(c, f, t, o);
            return r & st.IncludeAnonymous || !d.type.isAnonymous ? d : d.nextChild(e < 0 ? c.children.length - 1 : 0, e, i, s);
          }
        }
      }
      if (r & st.IncludeAnonymous || !o.type.isAnonymous || (o.index >= 0 ? t = o.index + e : t = e < 0 ? -1 : o._parent._tree.children.length, o = o._parent, !o))
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
  childAfter(t) {
    return this.nextChild(
      0,
      1,
      t,
      2
      /* Side.After */
    );
  }
  childBefore(t) {
    return this.nextChild(
      this._tree.children.length - 1,
      -1,
      t,
      -2
      /* Side.Before */
    );
  }
  enter(t, e, i = 0) {
    let s;
    if (!(i & st.IgnoreOverlays) && (s = this._tree.prop(P.mounted)) && s.overlay) {
      let r = t - this.from;
      for (let { from: o, to: l } of s.overlay)
        if ((e > 0 ? o <= r : o < r) && (e < 0 ? l >= r : l > r))
          return new ie(s.tree, s.overlay[0].from + this.from, -1, this);
    }
    return this.nextChild(0, 1, t, e, i);
  }
  nextSignificantParent() {
    let t = this;
    for (; t.type.isAnonymous && t._parent; )
      t = t._parent;
    return t;
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
  cursor(t = 0) {
    return new vi(this, t);
  }
  get tree() {
    return this._tree;
  }
  toTree() {
    return this._tree;
  }
  resolve(t, e = 0) {
    return _e(this, t, e, !1);
  }
  resolveInner(t, e = 0) {
    return _e(this, t, e, !0);
  }
  enterUnfinishedNodesBefore(t) {
    return Wa(this, t);
  }
  getChild(t, e = null, i = null) {
    let s = Pn(this, t, e, i);
    return s.length ? s[0] : null;
  }
  getChildren(t, e = null, i = null) {
    return Pn(this, t, e, i);
  }
  /**
  @internal
  */
  toString() {
    return this._tree.toString();
  }
  get node() {
    return this;
  }
  matchContext(t) {
    return Vn(this, t);
  }
}
function Pn(n, t, e, i) {
  let s = n.cursor(), r = [];
  if (!s.firstChild())
    return r;
  if (e != null) {
    for (; !s.type.is(e); )
      if (!s.nextSibling())
        return r;
  }
  for (; ; ) {
    if (i != null && s.type.is(i))
      return r;
    if (s.type.is(t) && r.push(s.node), !s.nextSibling())
      return i == null ? r : [];
  }
}
function Vn(n, t, e = t.length - 1) {
  for (let i = n.parent; e >= 0; i = i.parent) {
    if (!i)
      return !1;
    if (!i.type.isAnonymous) {
      if (t[e] && t[e] != i.name)
        return !1;
      e--;
    }
  }
  return !0;
}
class lu {
  constructor(t, e, i, s) {
    this.parent = t, this.buffer = e, this.index = i, this.start = s;
  }
}
class he {
  get name() {
    return this.type.name;
  }
  get from() {
    return this.context.start + this.context.buffer.buffer[this.index + 1];
  }
  get to() {
    return this.context.start + this.context.buffer.buffer[this.index + 2];
  }
  constructor(t, e, i) {
    this.context = t, this._parent = e, this.index = i, this.type = t.buffer.set.types[t.buffer.buffer[i]];
  }
  child(t, e, i) {
    let { buffer: s } = this.context, r = s.findChild(this.index + 4, s.buffer[this.index + 3], t, e - this.context.start, i);
    return r < 0 ? null : new he(this.context, this, r);
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
  childAfter(t) {
    return this.child(
      1,
      t,
      2
      /* Side.After */
    );
  }
  childBefore(t) {
    return this.child(
      -1,
      t,
      -2
      /* Side.Before */
    );
  }
  enter(t, e, i = 0) {
    if (i & st.ExcludeBuffers)
      return null;
    let { buffer: s } = this.context, r = s.findChild(this.index + 4, s.buffer[this.index + 3], e > 0 ? 1 : -1, t - this.context.start, e);
    return r < 0 ? null : new he(this.context, this, r);
  }
  get parent() {
    return this._parent || this.context.parent.nextSignificantParent();
  }
  externalSibling(t) {
    return this._parent ? null : this.context.parent.nextChild(
      this.context.index + t,
      t,
      0,
      4
      /* Side.DontCare */
    );
  }
  get nextSibling() {
    let { buffer: t } = this.context, e = t.buffer[this.index + 3];
    return e < (this._parent ? t.buffer[this._parent.index + 3] : t.buffer.length) ? new he(this.context, this._parent, e) : this.externalSibling(1);
  }
  get prevSibling() {
    let { buffer: t } = this.context, e = this._parent ? this._parent.index + 4 : 0;
    return this.index == e ? this.externalSibling(-1) : new he(this.context, this._parent, t.findChild(
      e,
      this.index,
      -1,
      0,
      4
      /* Side.DontCare */
    ));
  }
  cursor(t = 0) {
    return new vi(this, t);
  }
  get tree() {
    return null;
  }
  toTree() {
    let t = [], e = [], { buffer: i } = this.context, s = this.index + 4, r = i.buffer[this.index + 3];
    if (r > s) {
      let o = i.buffer[this.index + 1];
      t.push(i.slice(s, r, o)), e.push(0);
    }
    return new U(this.type, t, e, this.to - this.from);
  }
  resolve(t, e = 0) {
    return _e(this, t, e, !1);
  }
  resolveInner(t, e = 0) {
    return _e(this, t, e, !0);
  }
  enterUnfinishedNodesBefore(t) {
    return Wa(this, t);
  }
  /**
  @internal
  */
  toString() {
    return this.context.buffer.childString(this.index);
  }
  getChild(t, e = null, i = null) {
    let s = Pn(this, t, e, i);
    return s.length ? s[0] : null;
  }
  getChildren(t, e = null, i = null) {
    return Pn(this, t, e, i);
  }
  get node() {
    return this;
  }
  matchContext(t) {
    return Vn(this, t);
  }
}
class vi {
  /**
  Shorthand for `.type.name`.
  */
  get name() {
    return this.type.name;
  }
  /**
  @internal
  */
  constructor(t, e = 0) {
    if (this.mode = e, this.buffer = null, this.stack = [], this.index = 0, this.bufferNode = null, t instanceof ie)
      this.yieldNode(t);
    else {
      this._tree = t.context.parent, this.buffer = t.context;
      for (let i = t._parent; i; i = i._parent)
        this.stack.unshift(i.index);
      this.bufferNode = t, this.yieldBuf(t.index);
    }
  }
  yieldNode(t) {
    return t ? (this._tree = t, this.type = t.type, this.from = t.from, this.to = t.to, !0) : !1;
  }
  yieldBuf(t, e) {
    this.index = t;
    let { start: i, buffer: s } = this.buffer;
    return this.type = e || s.set.types[s.buffer[t]], this.from = i + s.buffer[t + 1], this.to = i + s.buffer[t + 2], !0;
  }
  yield(t) {
    return t ? t instanceof ie ? (this.buffer = null, this.yieldNode(t)) : (this.buffer = t.context, this.yieldBuf(t.index, t.type)) : !1;
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
  enterChild(t, e, i) {
    if (!this.buffer)
      return this.yield(this._tree.nextChild(t < 0 ? this._tree._tree.children.length - 1 : 0, t, e, i, this.mode));
    let { buffer: s } = this.buffer, r = s.findChild(this.index + 4, s.buffer[this.index + 3], t, e - this.buffer.start, i);
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
  childAfter(t) {
    return this.enterChild(
      1,
      t,
      2
      /* Side.After */
    );
  }
  /**
  Move to the last child that starts before `pos`.
  */
  childBefore(t) {
    return this.enterChild(
      -1,
      t,
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
  enter(t, e, i = this.mode) {
    return this.buffer ? i & st.ExcludeBuffers ? !1 : this.enterChild(1, t, e) : this.yield(this._tree.enter(t, e, i));
  }
  /**
  Move to the node's parent node, if this isn't the top node.
  */
  parent() {
    if (!this.buffer)
      return this.yieldNode(this.mode & st.IncludeAnonymous ? this._tree._parent : this._tree.parent);
    if (this.stack.length)
      return this.yieldBuf(this.stack.pop());
    let t = this.mode & st.IncludeAnonymous ? this.buffer.parent : this.buffer.parent.nextSignificantParent();
    return this.buffer = null, this.yieldNode(t);
  }
  /**
  @internal
  */
  sibling(t) {
    if (!this.buffer)
      return this._tree._parent ? this.yield(this._tree.index < 0 ? null : this._tree._parent.nextChild(this._tree.index + t, t, 0, 4, this.mode)) : !1;
    let { buffer: e } = this.buffer, i = this.stack.length - 1;
    if (t < 0) {
      let s = i < 0 ? 0 : this.stack[i] + 4;
      if (this.index != s)
        return this.yieldBuf(e.findChild(
          s,
          this.index,
          -1,
          0,
          4
          /* Side.DontCare */
        ));
    } else {
      let s = e.buffer[this.index + 3];
      if (s < (i < 0 ? e.buffer.length : e.buffer[this.stack[i] + 3]))
        return this.yieldBuf(s);
    }
    return i < 0 ? this.yield(this.buffer.parent.nextChild(this.buffer.index + t, t, 0, 4, this.mode)) : !1;
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
  atLastNode(t) {
    let e, i, { buffer: s } = this;
    if (s) {
      if (t > 0) {
        if (this.index < s.buffer.buffer.length)
          return !1;
      } else
        for (let r = 0; r < this.index; r++)
          if (s.buffer.buffer[r + 3] < this.index)
            return !1;
      ({ index: e, parent: i } = s);
    } else
      ({ index: e, _parent: i } = this._tree);
    for (; i; { index: e, _parent: i } = i)
      if (e > -1)
        for (let r = e + t, o = t < 0 ? -1 : i._tree.children.length; r != o; r += t) {
          let l = i._tree.children[r];
          if (this.mode & st.IncludeAnonymous || l instanceof We || !l.type.isAnonymous || Ur(l))
            return !1;
        }
    return !0;
  }
  move(t, e) {
    if (e && this.enterChild(
      t,
      0,
      4
      /* Side.DontCare */
    ))
      return !0;
    for (; ; ) {
      if (this.sibling(t))
        return !0;
      if (this.atLastNode(t) || !this.parent())
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
  next(t = !0) {
    return this.move(1, t);
  }
  /**
  Move to the next node in a last-to-first pre-order traveral. A
  node is followed by its last child or, if it has none, its
  previous sibling or the previous sibling of the first parent
  node that has one.
  */
  prev(t = !0) {
    return this.move(-1, t);
  }
  /**
  Move the cursor to the innermost node that covers `pos`. If
  `side` is -1, it will enter nodes that end at `pos`. If it is 1,
  it will enter nodes that start at `pos`.
  */
  moveTo(t, e = 0) {
    for (; (this.from == this.to || (e < 1 ? this.from >= t : this.from > t) || (e > -1 ? this.to <= t : this.to < t)) && this.parent(); )
      ;
    for (; this.enterChild(1, t, e); )
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
    let t = this.bufferNode, e = null, i = 0;
    if (t && t.context == this.buffer)
      t:
        for (let s = this.index, r = this.stack.length; r >= 0; ) {
          for (let o = t; o; o = o._parent)
            if (o.index == s) {
              if (s == this.index)
                return o;
              e = o, i = r + 1;
              break t;
            }
          s = this.stack[--r];
        }
    for (let s = i; s < this.stack.length; s++)
      e = new he(this.buffer, e, this.stack[s]);
    return this.bufferNode = new he(this.buffer, e, this.index);
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
  iterate(t, e) {
    for (let i = 0; ; ) {
      let s = !1;
      if (this.type.isAnonymous || t(this) !== !1) {
        if (this.firstChild()) {
          i++;
          continue;
        }
        this.type.isAnonymous || (s = !0);
      }
      for (; s && e && e(this), s = this.type.isAnonymous, !this.nextSibling(); ) {
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
  matchContext(t) {
    if (!this.buffer)
      return Vn(this.node, t);
    let { buffer: e } = this.buffer, { types: i } = e.set;
    for (let s = t.length - 1, r = this.stack.length - 1; s >= 0; r--) {
      if (r < 0)
        return Vn(this.node, t, s);
      let o = i[e.buffer[this.stack[r]]];
      if (!o.isAnonymous) {
        if (t[s] && t[s] != o.name)
          return !1;
        s--;
      }
    }
    return !0;
  }
}
function Ur(n) {
  return n.children.some((t) => t instanceof We || !t.type.isAnonymous || Ur(t));
}
function au(n) {
  var t;
  let { buffer: e, nodeSet: i, maxBufferLength: s = Va, reused: r = [], minRepeatType: o = i.types.length } = n, l = Array.isArray(e) ? new Qr(e, e.length) : e, a = i.types, h = 0, c = 0;
  function f(k, w, S, Z, B) {
    let { id: D, start: V, end: H, size: _ } = l, ht = c;
    for (; _ < 0; )
      if (l.next(), _ == -1) {
        let St = r[D];
        S.push(St), Z.push(V - k);
        return;
      } else if (_ == -3) {
        h = D;
        return;
      } else if (_ == -4) {
        c = D;
        return;
      } else
        throw new RangeError(`Unrecognized record size: ${_}`);
    let wt = a[D], rt, ct, Gt = V - k;
    if (H - V <= s && (ct = g(l.pos - w, B))) {
      let St = new Uint16Array(ct.size - ct.skip), Y = l.pos - ct.size, tt = St.length;
      for (; l.pos > Y; )
        tt = m(ct.start, St, tt);
      rt = new We(St, H - ct.start, i), Gt = ct.start - k;
    } else {
      let St = l.pos - _;
      l.next();
      let Y = [], tt = [], Ce = D >= o ? D : -1, Xe = 0, Ji = H;
      for (; l.pos > St; )
        Ce >= 0 && l.id == Ce && l.size >= 0 ? (l.end <= Ji - s && (d(Y, tt, V, Xe, l.end, Ji, Ce, ht), Xe = Y.length, Ji = l.end), l.next()) : f(V, St, Y, tt, Ce);
      if (Ce >= 0 && Xe > 0 && Xe < Y.length && d(Y, tt, V, Xe, V, Ji, Ce, ht), Y.reverse(), tt.reverse(), Ce > -1 && Xe > 0) {
        let Mo = u(wt);
        rt = $r(wt, Y, tt, 0, Y.length, 0, H - V, Mo, Mo);
      } else
        rt = p(wt, Y, tt, H - V, ht - H);
    }
    S.push(rt), Z.push(Gt);
  }
  function u(k) {
    return (w, S, Z) => {
      let B = 0, D = w.length - 1, V, H;
      if (D >= 0 && (V = w[D]) instanceof U) {
        if (!D && V.type == k && V.length == Z)
          return V;
        (H = V.prop(P.lookAhead)) && (B = S[D] + V.length + H);
      }
      return p(k, w, S, Z, B);
    };
  }
  function d(k, w, S, Z, B, D, V, H) {
    let _ = [], ht = [];
    for (; k.length > Z; )
      _.push(k.pop()), ht.push(w.pop() + S - B);
    k.push(p(i.types[V], _, ht, D - B, H - D)), w.push(B - S);
  }
  function p(k, w, S, Z, B = 0, D) {
    if (h) {
      let V = [P.contextHash, h];
      D = D ? [V].concat(D) : [V];
    }
    if (B > 25) {
      let V = [P.lookAhead, B];
      D = D ? [V].concat(D) : [V];
    }
    return new U(k, w, S, Z, D);
  }
  function g(k, w) {
    let S = l.fork(), Z = 0, B = 0, D = 0, V = S.end - s, H = { size: 0, start: 0, skip: 0 };
    t:
      for (let _ = S.pos - k; S.pos > _; ) {
        let ht = S.size;
        if (S.id == w && ht >= 0) {
          H.size = Z, H.start = B, H.skip = D, D += 4, Z += 4, S.next();
          continue;
        }
        let wt = S.pos - ht;
        if (ht < 0 || wt < _ || S.start < V)
          break;
        let rt = S.id >= o ? 4 : 0, ct = S.start;
        for (S.next(); S.pos > wt; ) {
          if (S.size < 0)
            if (S.size == -3)
              rt += 4;
            else
              break t;
          else
            S.id >= o && (rt += 4);
          S.next();
        }
        B = ct, Z += ht, D += rt;
      }
    return (w < 0 || Z == k) && (H.size = Z, H.start = B, H.skip = D), H.size > 4 ? H : void 0;
  }
  function m(k, w, S) {
    let { id: Z, start: B, end: D, size: V } = l;
    if (l.next(), V >= 0 && Z < o) {
      let H = S;
      if (V > 4) {
        let _ = l.pos - (V - 4);
        for (; l.pos > _; )
          S = m(k, w, S);
      }
      w[--S] = H, w[--S] = D - k, w[--S] = B - k, w[--S] = Z;
    } else
      V == -3 ? h = Z : V == -4 && (c = Z);
    return S;
  }
  let b = [], v = [];
  for (; l.pos > 0; )
    f(n.start || 0, n.bufferStart || 0, b, v, -1);
  let O = (t = n.length) !== null && t !== void 0 ? t : b.length ? v[0] + b[0].length : 0;
  return new U(a[n.topID], b.reverse(), v.reverse(), O);
}
const Po = /* @__PURE__ */ new WeakMap();
function xn(n, t) {
  if (!n.isAnonymous || t instanceof We || t.type != n)
    return 1;
  let e = Po.get(t);
  if (e == null) {
    e = 1;
    for (let i of t.children) {
      if (i.type != n || !(i instanceof U)) {
        e = 1;
        break;
      }
      e += xn(n, i);
    }
    Po.set(t, e);
  }
  return e;
}
function $r(n, t, e, i, s, r, o, l, a) {
  let h = 0;
  for (let p = i; p < s; p++)
    h += xn(n, t[p]);
  let c = Math.ceil(
    h * 1.5 / 8
    /* Balance.BranchFactor */
  ), f = [], u = [];
  function d(p, g, m, b, v) {
    for (let O = m; O < b; ) {
      let k = O, w = g[O], S = xn(n, p[O]);
      for (O++; O < b; O++) {
        let Z = xn(n, p[O]);
        if (S + Z >= c)
          break;
        S += Z;
      }
      if (O == k + 1) {
        if (S > c) {
          let Z = p[k];
          d(Z.children, Z.positions, 0, Z.children.length, g[k] + v);
          continue;
        }
        f.push(p[k]);
      } else {
        let Z = g[O - 1] + p[O - 1].length - w;
        f.push($r(n, p, g, k, O, w, Z, null, a));
      }
      u.push(w + v - r);
    }
  }
  return d(t, e, i, s, 0), (l || a)(f, u, o);
}
class Te {
  /**
  Construct a tree fragment. You'll usually want to use
  [`addTree`](#common.TreeFragment^addTree) and
  [`applyChanges`](#common.TreeFragment^applyChanges) instead of
  calling this directly.
  */
  constructor(t, e, i, s, r = !1, o = !1) {
    this.from = t, this.to = e, this.tree = i, this.offset = s, this.open = (r ? 1 : 0) | (o ? 2 : 0);
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
  static addTree(t, e = [], i = !1) {
    let s = [new Te(0, t.length, t, 0, !1, i)];
    for (let r of e)
      r.to > t.length && s.push(r);
    return s;
  }
  /**
  Apply a set of edits to an array of fragments, removing or
  splitting fragments as necessary to remove edited ranges, and
  adjusting offsets for fragments that moved.
  */
  static applyChanges(t, e, i = 128) {
    if (!e.length)
      return t;
    let s = [], r = 1, o = t.length ? t[0] : null;
    for (let l = 0, a = 0, h = 0; ; l++) {
      let c = l < e.length ? e[l] : null, f = c ? c.fromA : 1e9;
      if (f - a >= i)
        for (; o && o.from < f; ) {
          let u = o;
          if (a >= u.from || f <= u.to || h) {
            let d = Math.max(u.from, a) - h, p = Math.min(u.to, f) - h;
            u = d >= p ? null : new Te(d, p, u.tree, u.offset + h, l > 0, !!c);
          }
          if (u && s.push(u), o.to > f)
            break;
          o = r < t.length ? t[r++] : null;
        }
      if (!c)
        break;
      a = c.toA, h = c.toA - c.toB;
    }
    return s;
  }
}
class Xa {
  /**
  Start a parse, returning a [partial parse](#common.PartialParse)
  object. [`fragments`](#common.TreeFragment) can be passed in to
  make the parse incremental.
  
  By default, the entire input is parsed. You can pass `ranges`,
  which should be a sorted array of non-empty, non-overlapping
  ranges, to parse only those ranges. The tree returned in that
  case will start at `ranges[0].from`.
  */
  startParse(t, e, i) {
    return typeof t == "string" && (t = new hu(t)), i = i ? i.length ? i.map((s) => new Ms(s.from, s.to)) : [new Ms(0, 0)] : [new Ms(0, t.length)], this.createParse(t, e || [], i);
  }
  /**
  Run a full parse, returning the resulting tree.
  */
  parse(t, e, i) {
    let s = this.startParse(t, e, i);
    for (; ; ) {
      let r = s.advance();
      if (r)
        return r;
    }
  }
}
let hu = class {
  constructor(t) {
    this.string = t;
  }
  get length() {
    return this.string.length;
  }
  chunk(t) {
    return this.string.slice(t);
  }
  get lineChunks() {
    return !1;
  }
  read(t, e) {
    return this.string.slice(t, e);
  }
};
new P({ perNode: !0 });
class Bn {
  /**
  @internal
  */
  constructor(t, e, i, s, r, o, l, a, h, c = 0, f) {
    this.p = t, this.stack = e, this.state = i, this.reducePos = s, this.pos = r, this.score = o, this.buffer = l, this.bufferBase = a, this.curContext = h, this.lookAhead = c, this.parent = f;
  }
  /**
  @internal
  */
  toString() {
    return `[${this.stack.filter((t, e) => e % 3 == 0).concat(this.state)}]@${this.pos}${this.score ? "!" + this.score : ""}`;
  }
  // Start an empty stack
  /**
  @internal
  */
  static start(t, e, i = 0) {
    let s = t.parser.context;
    return new Bn(t, [], e, i, i, 0, [], 0, s ? new Vo(s, s.start) : null, 0, null);
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
  pushState(t, e) {
    this.stack.push(this.state, e, this.bufferBase + this.buffer.length), this.state = t;
  }
  // Apply a reduce action
  /**
  @internal
  */
  reduce(t) {
    var e;
    let i = t >> 19, s = t & 65535, { parser: r } = this.p, o = r.dynamicPrecedence(s);
    if (o && (this.score += o), i == 0) {
      this.pushState(r.getGoto(this.state, s, !0), this.reducePos), s < r.minRepeatTerm && this.storeNode(s, this.reducePos, this.reducePos, 4, !0), this.reduceContext(s, this.reducePos);
      return;
    }
    let l = this.stack.length - (i - 1) * 3 - (t & 262144 ? 6 : 0), a = l ? this.stack[l - 2] : this.p.ranges[0].from, h = this.reducePos - a;
    h >= 2e3 && !(!((e = this.p.parser.nodeSet.types[s]) === null || e === void 0) && e.isAnonymous) && (a == this.p.lastBigReductionStart ? (this.p.bigReductionCount++, this.p.lastBigReductionSize = h) : this.p.lastBigReductionSize < h && (this.p.bigReductionCount = 1, this.p.lastBigReductionStart = a, this.p.lastBigReductionSize = h));
    let c = l ? this.stack[l - 1] : 0, f = this.bufferBase + this.buffer.length - c;
    if (s < r.minRepeatTerm || t & 131072) {
      let u = r.stateFlag(
        this.state,
        1
        /* StateFlag.Skipped */
      ) ? this.pos : this.reducePos;
      this.storeNode(s, a, u, f + 4, !0);
    }
    if (t & 262144)
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
  storeNode(t, e, i, s = 4, r = !1) {
    if (t == 0 && (!this.stack.length || this.stack[this.stack.length - 1] < this.buffer.length + this.bufferBase)) {
      let o = this, l = this.buffer.length;
      if (l == 0 && o.parent && (l = o.bufferBase - o.parent.bufferBase, o = o.parent), l > 0 && o.buffer[l - 4] == 0 && o.buffer[l - 1] > -1) {
        if (e == i)
          return;
        if (o.buffer[l - 2] >= e) {
          o.buffer[l - 2] = i;
          return;
        }
      }
    }
    if (!r || this.pos == i)
      this.buffer.push(t, e, i, s);
    else {
      let o = this.buffer.length;
      if (o > 0 && this.buffer[o - 4] != 0)
        for (; o > 0 && this.buffer[o - 2] > i; )
          this.buffer[o] = this.buffer[o - 4], this.buffer[o + 1] = this.buffer[o - 3], this.buffer[o + 2] = this.buffer[o - 2], this.buffer[o + 3] = this.buffer[o - 1], o -= 4, s > 4 && (s -= 4);
      this.buffer[o] = t, this.buffer[o + 1] = e, this.buffer[o + 2] = i, this.buffer[o + 3] = s;
    }
  }
  // Apply a shift action
  /**
  @internal
  */
  shift(t, e, i) {
    let s = this.pos;
    if (t & 131072)
      this.pushState(t & 65535, this.pos);
    else if (t & 262144)
      this.pos = i, this.shiftContext(e, s), e <= this.p.parser.maxNode && this.buffer.push(e, s, i, 4);
    else {
      let r = t, { parser: o } = this.p;
      (i > this.pos || e <= o.maxNode) && (this.pos = i, o.stateFlag(
        r,
        1
        /* StateFlag.Skipped */
      ) || (this.reducePos = i)), this.pushState(r, s), this.shiftContext(e, s), e <= o.maxNode && this.buffer.push(e, s, i, 4);
    }
  }
  // Apply an action
  /**
  @internal
  */
  apply(t, e, i) {
    t & 65536 ? this.reduce(t) : this.shift(t, e, i);
  }
  // Add a prebuilt (reused) node into the buffer.
  /**
  @internal
  */
  useNode(t, e) {
    let i = this.p.reused.length - 1;
    (i < 0 || this.p.reused[i] != t) && (this.p.reused.push(t), i++);
    let s = this.pos;
    this.reducePos = this.pos = s + t.length, this.pushState(e, s), this.buffer.push(
      i,
      s,
      this.reducePos,
      -1
      /* size == -1 means this is a reused value */
    ), this.curContext && this.updateContext(this.curContext.tracker.reuse(this.curContext.context, t, this, this.p.stream.reset(this.pos - t.length)));
  }
  // Split the stack. Due to the buffer sharing and the fact
  // that `this.stack` tends to stay quite shallow, this isn't very
  // expensive.
  /**
  @internal
  */
  split() {
    let t = this, e = t.buffer.length;
    for (; e > 0 && t.buffer[e - 2] > t.reducePos; )
      e -= 4;
    let i = t.buffer.slice(e), s = t.bufferBase + e;
    for (; t && s == t.bufferBase; )
      t = t.parent;
    return new Bn(this.p, this.stack.slice(), this.state, this.reducePos, this.pos, this.score, i, s, this.curContext, this.lookAhead, t);
  }
  // Try to recover from an error by 'deleting' (ignoring) one token.
  /**
  @internal
  */
  recoverByDelete(t, e) {
    let i = t <= this.p.parser.maxNode;
    i && this.storeNode(t, this.pos, e, 4), this.storeNode(0, this.pos, e, i ? 8 : 4), this.pos = this.reducePos = e, this.score -= 190;
  }
  /**
  Check if the given term would be able to be shifted (optionally
  after some reductions) on this stack. This can be useful for
  external tokenizers that want to make sure they only provide a
  given token when it applies.
  */
  canShift(t) {
    for (let e = new cu(this); ; ) {
      let i = this.p.parser.stateSlot(
        e.state,
        4
        /* ParseState.DefaultReduce */
      ) || this.p.parser.hasAction(e.state, t);
      if (i == 0)
        return !1;
      if (!(i & 65536))
        return !0;
      e.reduce(i);
    }
  }
  // Apply up to Recover.MaxNext recovery actions that conceptually
  // inserts some missing token or rule.
  /**
  @internal
  */
  recoverByInsert(t) {
    if (this.stack.length >= 300)
      return [];
    let e = this.p.parser.nextStates(this.state);
    if (e.length > 8 || this.stack.length >= 120) {
      let s = [];
      for (let r = 0, o; r < e.length; r += 2)
        (o = e[r + 1]) != this.state && this.p.parser.hasAction(o, t) && s.push(e[r], o);
      if (this.stack.length < 120)
        for (let r = 0; s.length < 8 && r < e.length; r += 2) {
          let o = e[r + 1];
          s.some((l, a) => a & 1 && l == o) || s.push(e[r], o);
        }
      e = s;
    }
    let i = [];
    for (let s = 0; s < e.length && i.length < 4; s += 2) {
      let r = e[s + 1];
      if (r == this.state)
        continue;
      let o = this.split();
      o.pushState(r, this.pos), o.storeNode(0, o.pos, o.pos, 4, !0), o.shiftContext(e[s], this.pos), o.score -= 200, i.push(o);
    }
    return i;
  }
  // Force a reduce, if possible. Return false if that can't
  // be done.
  /**
  @internal
  */
  forceReduce() {
    let { parser: t } = this.p, e = t.stateSlot(
      this.state,
      5
      /* ParseState.ForcedReduce */
    );
    if (!(e & 65536))
      return !1;
    if (!t.validAction(this.state, e)) {
      let i = e >> 19, s = e & 65535, r = this.stack.length - i * 3;
      if (r < 0 || t.getGoto(this.stack[r], s, !1) < 0) {
        let o = this.findForcedReduction();
        if (o == null)
          return !1;
        e = o;
      }
      this.storeNode(0, this.pos, this.pos, 4, !0), this.score -= 100;
    }
    return this.reducePos = this.pos, this.reduce(e), !0;
  }
  /**
  Try to scan through the automaton to find some kind of reduction
  that can be applied. Used when the regular ForcedReduce field
  isn't a valid action. @internal
  */
  findForcedReduction() {
    let { parser: t } = this.p, e = [], i = (s, r) => {
      if (!e.includes(s))
        return e.push(s), t.allActions(s, (o) => {
          if (!(o & 393216))
            if (o & 65536) {
              let l = (o >> 19) - r;
              if (l > 1) {
                let a = o & 65535, h = this.stack.length - l * 3;
                if (h >= 0 && t.getGoto(this.stack[h], a, !1) >= 0)
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
    let { parser: t } = this.p;
    return t.data[t.stateSlot(
      this.state,
      1
      /* ParseState.Actions */
    )] == 65535 && !t.stateSlot(
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
  sameState(t) {
    if (this.state != t.state || this.stack.length != t.stack.length)
      return !1;
    for (let e = 0; e < this.stack.length; e += 3)
      if (this.stack[e] != t.stack[e])
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
  dialectEnabled(t) {
    return this.p.parser.dialect.flags[t];
  }
  shiftContext(t, e) {
    this.curContext && this.updateContext(this.curContext.tracker.shift(this.curContext.context, t, this, this.p.stream.reset(e)));
  }
  reduceContext(t, e) {
    this.curContext && this.updateContext(this.curContext.tracker.reduce(this.curContext.context, t, this, this.p.stream.reset(e)));
  }
  /**
  @internal
  */
  emitContext() {
    let t = this.buffer.length - 1;
    (t < 0 || this.buffer[t] != -3) && this.buffer.push(this.curContext.hash, this.pos, this.pos, -3);
  }
  /**
  @internal
  */
  emitLookAhead() {
    let t = this.buffer.length - 1;
    (t < 0 || this.buffer[t] != -4) && this.buffer.push(this.lookAhead, this.pos, this.pos, -4);
  }
  updateContext(t) {
    if (t != this.curContext.context) {
      let e = new Vo(this.curContext.tracker, t);
      e.hash != this.curContext.hash && this.emitContext(), this.curContext = e;
    }
  }
  /**
  @internal
  */
  setLookAhead(t) {
    t > this.lookAhead && (this.emitLookAhead(), this.lookAhead = t);
  }
  /**
  @internal
  */
  close() {
    this.curContext && this.curContext.tracker.strict && this.emitContext(), this.lookAhead > 0 && this.emitLookAhead();
  }
}
class Vo {
  constructor(t, e) {
    this.tracker = t, this.context = e, this.hash = t.strict ? t.hash(e) : 0;
  }
}
class cu {
  constructor(t) {
    this.start = t, this.state = t.state, this.stack = t.stack, this.base = this.stack.length;
  }
  reduce(t) {
    let e = t & 65535, i = t >> 19;
    i == 0 ? (this.stack == this.start.stack && (this.stack = this.stack.slice()), this.stack.push(this.state, 0, 0), this.base += 3) : this.base -= (i - 1) * 3;
    let s = this.start.p.parser.getGoto(this.stack[this.base - 3], e, !0);
    this.state = s;
  }
}
class Wn {
  constructor(t, e, i) {
    this.stack = t, this.pos = e, this.index = i, this.buffer = t.buffer, this.index == 0 && this.maybeNext();
  }
  static create(t, e = t.bufferBase + t.buffer.length) {
    return new Wn(t, e, e - t.bufferBase);
  }
  maybeNext() {
    let t = this.stack.parent;
    t != null && (this.index = this.stack.bufferBase - t.bufferBase, this.stack = t, this.buffer = t.buffer);
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
    return new Wn(this.stack, this.pos, this.index);
  }
}
function ji(n, t = Uint16Array) {
  if (typeof n != "string")
    return n;
  let e = null;
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
    e ? e[s++] = r : e = new t(r);
  }
  return e;
}
class kn {
  constructor() {
    this.start = -1, this.value = -1, this.end = -1, this.extended = -1, this.lookAhead = 0, this.mask = 0, this.context = 0;
  }
}
const Bo = new kn();
class fu {
  /**
  @internal
  */
  constructor(t, e) {
    this.input = t, this.ranges = e, this.chunk = "", this.chunkOff = 0, this.chunk2 = "", this.chunk2Pos = 0, this.next = -1, this.token = Bo, this.rangeIndex = 0, this.pos = this.chunkPos = e[0].from, this.range = e[0], this.end = e[e.length - 1].to, this.readNext();
  }
  /**
  @internal
  */
  resolveOffset(t, e) {
    let i = this.range, s = this.rangeIndex, r = this.pos + t;
    for (; r < i.from; ) {
      if (!s)
        return null;
      let o = this.ranges[--s];
      r -= i.from - o.to, i = o;
    }
    for (; e < 0 ? r > i.to : r >= i.to; ) {
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
  clipPos(t) {
    if (t >= this.range.from && t < this.range.to)
      return t;
    for (let e of this.ranges)
      if (e.to > t)
        return Math.max(t, e.from);
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
  peek(t) {
    let e = this.chunkOff + t, i, s;
    if (e >= 0 && e < this.chunk.length)
      i = this.pos + t, s = this.chunk.charCodeAt(e);
    else {
      let r = this.resolveOffset(t, 1);
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
  acceptToken(t, e = 0) {
    let i = e ? this.resolveOffset(e, -1) : this.pos;
    if (i == null || i < this.token.start)
      throw new RangeError("Token end out of bounds");
    this.token.value = t, this.token.end = i;
  }
  getChunk() {
    if (this.pos >= this.chunk2Pos && this.pos < this.chunk2Pos + this.chunk2.length) {
      let { chunk: t, chunkPos: e } = this;
      this.chunk = this.chunk2, this.chunkPos = this.chunk2Pos, this.chunk2 = t, this.chunk2Pos = e, this.chunkOff = this.pos - this.chunkPos;
    } else {
      this.chunk2 = this.chunk, this.chunk2Pos = this.chunkPos;
      let t = this.input.chunk(this.pos), e = this.pos + t.length;
      this.chunk = e > this.range.to ? t.slice(0, this.range.to - this.pos) : t, this.chunkPos = this.pos, this.chunkOff = 0;
    }
  }
  readNext() {
    return this.chunkOff >= this.chunk.length && (this.getChunk(), this.chunkOff == this.chunk.length) ? this.next = -1 : this.next = this.chunk.charCodeAt(this.chunkOff);
  }
  /**
  Move the stream forward N (defaults to 1) code units. Returns
  the new value of [`next`](#lr.InputStream.next).
  */
  advance(t = 1) {
    for (this.chunkOff += t; this.pos + t >= this.range.to; ) {
      if (this.rangeIndex == this.ranges.length - 1)
        return this.setDone();
      t -= this.range.to - this.pos, this.range = this.ranges[++this.rangeIndex], this.pos = this.range.from;
    }
    return this.pos += t, this.pos >= this.token.lookAhead && (this.token.lookAhead = this.pos + 1), this.readNext();
  }
  setDone() {
    return this.pos = this.chunkPos = this.end, this.range = this.ranges[this.rangeIndex = this.ranges.length - 1], this.chunk = "", this.next = -1;
  }
  /**
  @internal
  */
  reset(t, e) {
    if (e ? (this.token = e, e.start = t, e.lookAhead = t + 1, e.value = e.extended = -1) : this.token = Bo, this.pos != t) {
      if (this.pos = t, t == this.end)
        return this.setDone(), this;
      for (; t < this.range.from; )
        this.range = this.ranges[--this.rangeIndex];
      for (; t >= this.range.to; )
        this.range = this.ranges[++this.rangeIndex];
      t >= this.chunkPos && t < this.chunkPos + this.chunk.length ? this.chunkOff = t - this.chunkPos : (this.chunk = "", this.chunkOff = 0), this.readNext();
    }
    return this;
  }
  /**
  @internal
  */
  read(t, e) {
    if (t >= this.chunkPos && e <= this.chunkPos + this.chunk.length)
      return this.chunk.slice(t - this.chunkPos, e - this.chunkPos);
    if (t >= this.chunk2Pos && e <= this.chunk2Pos + this.chunk2.length)
      return this.chunk2.slice(t - this.chunk2Pos, e - this.chunk2Pos);
    if (t >= this.range.from && e <= this.range.to)
      return this.input.read(t, e);
    let i = "";
    for (let s of this.ranges) {
      if (s.from >= e)
        break;
      s.to > t && (i += this.input.read(Math.max(s.from, t), Math.min(s.to, e)));
    }
    return i;
  }
}
class Je {
  constructor(t, e) {
    this.data = t, this.id = e;
  }
  token(t, e) {
    let { parser: i } = e.p;
    uu(this.data, t, e, this.id, i.data, i.tokenPrecTable);
  }
}
Je.prototype.contextual = Je.prototype.fallback = Je.prototype.extend = !1;
Je.prototype.fallback = Je.prototype.extend = !1;
function uu(n, t, e, i, s, r) {
  let o = 0, l = 1 << i, { dialect: a } = e.p.parser;
  t:
    for (; l & n[o]; ) {
      let h = n[o + 1];
      for (let d = o + 3; d < h; d += 2)
        if ((n[d + 1] & l) > 0) {
          let p = n[d];
          if (a.allows(p) && (t.token.value == -1 || t.token.value == p || du(p, t.token.value, s, r))) {
            t.acceptToken(p);
            break;
          }
        }
      let c = t.next, f = 0, u = n[o + 2];
      if (t.next < 0 && u > f && n[h + u * 3 - 3] == 65535 && n[h + u * 3 - 3] == 65535) {
        o = n[h + u * 3 - 1];
        continue t;
      }
      for (; f < u; ) {
        let d = f + u >> 1, p = h + d + (d << 1), g = n[p], m = n[p + 1] || 65536;
        if (c < g)
          u = d;
        else if (c >= m)
          f = d + 1;
        else {
          o = n[p + 2], t.advance();
          continue t;
        }
      }
      break;
    }
}
function Wo(n, t, e) {
  for (let i = t, s; (s = n[i]) != 65535; i++)
    if (s == e)
      return i - t;
  return -1;
}
function du(n, t, e, i) {
  let s = Wo(e, i, t);
  return s < 0 || Wo(e, i, n) < s;
}
const Rt = typeof process < "u" && process.env && /\bparse\b/.test(process.env.LOG);
let Rs = null;
function Xo(n, t, e) {
  let i = n.cursor(st.IncludeAnonymous);
  for (i.moveTo(t); ; )
    if (!(e < 0 ? i.childBefore(t) : i.childAfter(t)))
      for (; ; ) {
        if ((e < 0 ? i.to < t : i.from > t) && !i.type.isError)
          return e < 0 ? Math.max(0, Math.min(
            i.to - 1,
            t - 25
            /* Safety.Margin */
          )) : Math.min(n.length, Math.max(
            i.from + 1,
            t + 25
            /* Safety.Margin */
          ));
        if (e < 0 ? i.prevSibling() : i.nextSibling())
          break;
        if (!i.parent())
          return e < 0 ? 0 : n.length;
      }
}
class pu {
  constructor(t, e) {
    this.fragments = t, this.nodeSet = e, this.i = 0, this.fragment = null, this.safeFrom = -1, this.safeTo = -1, this.trees = [], this.start = [], this.index = [], this.nextFragment();
  }
  nextFragment() {
    let t = this.fragment = this.i == this.fragments.length ? null : this.fragments[this.i++];
    if (t) {
      for (this.safeFrom = t.openStart ? Xo(t.tree, t.from + t.offset, 1) - t.offset : t.from, this.safeTo = t.openEnd ? Xo(t.tree, t.to + t.offset, -1) - t.offset : t.to; this.trees.length; )
        this.trees.pop(), this.start.pop(), this.index.pop();
      this.trees.push(t.tree), this.start.push(-t.offset), this.index.push(0), this.nextStart = this.safeFrom;
    } else
      this.nextStart = 1e9;
  }
  // `pos` must be >= any previously given `pos` for this cursor
  nodeAt(t) {
    if (t < this.nextStart)
      return null;
    for (; this.fragment && this.safeTo <= t; )
      this.nextFragment();
    if (!this.fragment)
      return null;
    for (; ; ) {
      let e = this.trees.length - 1;
      if (e < 0)
        return this.nextFragment(), null;
      let i = this.trees[e], s = this.index[e];
      if (s == i.children.length) {
        this.trees.pop(), this.start.pop(), this.index.pop();
        continue;
      }
      let r = i.children[s], o = this.start[e] + i.positions[s];
      if (o > t)
        return this.nextStart = o, null;
      if (r instanceof U) {
        if (o == t) {
          if (o < this.safeFrom)
            return null;
          let l = o + r.length;
          if (l <= this.safeTo) {
            let a = r.prop(P.lookAhead);
            if (!a || l + a < this.fragment.to)
              return r;
          }
        }
        this.index[e]++, o + r.length >= Math.max(this.safeFrom, t) && (this.trees.push(r), this.start.push(o), this.index.push(0));
      } else
        this.index[e]++, this.nextStart = o + r.length;
    }
  }
}
class mu {
  constructor(t, e) {
    this.stream = e, this.tokens = [], this.mainToken = null, this.actions = [], this.tokens = t.tokenizers.map((i) => new kn());
  }
  getActions(t) {
    let e = 0, i = null, { parser: s } = t.p, { tokenizers: r } = s, o = s.stateSlot(
      t.state,
      3
      /* ParseState.TokenizerMask */
    ), l = t.curContext ? t.curContext.hash : 0, a = 0;
    for (let h = 0; h < r.length; h++) {
      if (!(1 << h & o))
        continue;
      let c = r[h], f = this.tokens[h];
      if (!(i && !c.fallback) && ((c.contextual || f.start != t.pos || f.mask != o || f.context != l) && (this.updateCachedToken(f, c, t), f.mask = o, f.context = l), f.lookAhead > f.end + 25 && (a = Math.max(f.lookAhead, a)), f.value != 0)) {
        let u = e;
        if (f.extended > -1 && (e = this.addActions(t, f.extended, f.end, e)), e = this.addActions(t, f.value, f.end, e), !c.extend && (i = f, e > u))
          break;
      }
    }
    for (; this.actions.length > e; )
      this.actions.pop();
    return a && t.setLookAhead(a), !i && t.pos == this.stream.end && (i = new kn(), i.value = t.p.parser.eofTerm, i.start = i.end = t.pos, e = this.addActions(t, i.value, i.end, e)), this.mainToken = i, this.actions;
  }
  getMainToken(t) {
    if (this.mainToken)
      return this.mainToken;
    let e = new kn(), { pos: i, p: s } = t;
    return e.start = i, e.end = Math.min(i + 1, s.stream.end), e.value = i == s.stream.end ? s.parser.eofTerm : 0, e;
  }
  updateCachedToken(t, e, i) {
    let s = this.stream.clipPos(i.pos);
    if (e.token(this.stream.reset(s, t), i), t.value > -1) {
      let { parser: r } = i.p;
      for (let o = 0; o < r.specialized.length; o++)
        if (r.specialized[o] == t.value) {
          let l = r.specializers[o](this.stream.read(t.start, t.end), i);
          if (l >= 0 && i.p.parser.dialect.allows(l >> 1)) {
            l & 1 ? t.extended = l >> 1 : t.value = l >> 1;
            break;
          }
        }
    } else
      t.value = 0, t.end = this.stream.clipPos(s + 1);
  }
  putAction(t, e, i, s) {
    for (let r = 0; r < s; r += 3)
      if (this.actions[r] == t)
        return s;
    return this.actions[s++] = t, this.actions[s++] = e, this.actions[s++] = i, s;
  }
  addActions(t, e, i, s) {
    let { state: r } = t, { parser: o } = t.p, { data: l } = o;
    for (let a = 0; a < 2; a++)
      for (let h = o.stateSlot(
        r,
        a ? 2 : 1
        /* ParseState.Actions */
      ); ; h += 3) {
        if (l[h] == 65535)
          if (l[h + 1] == 1)
            h = te(l, h + 2);
          else {
            s == 0 && l[h + 1] == 2 && (s = this.putAction(te(l, h + 2), e, i, s));
            break;
          }
        l[h] == e && (s = this.putAction(te(l, h + 1), e, i, s));
      }
    return s;
  }
}
class gu {
  constructor(t, e, i, s) {
    this.parser = t, this.input = e, this.ranges = s, this.recovering = 0, this.nextStackID = 9812, this.minStackPos = 0, this.reused = [], this.stoppedAt = null, this.lastBigReductionStart = -1, this.lastBigReductionSize = 0, this.bigReductionCount = 0, this.stream = new fu(e, s), this.tokens = new mu(t, this.stream), this.topTerm = t.top[1];
    let { from: r } = s[0];
    this.stacks = [Bn.start(this, t.top[0], r)], this.fragments = i.length && this.stream.end - r > t.bufferLength * 4 ? new pu(i, t.nodeSet) : null;
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
    let t = this.stacks, e = this.minStackPos, i = this.stacks = [], s, r;
    if (this.bigReductionCount > 300 && t.length == 1) {
      let [o] = t;
      for (; o.forceReduce() && o.stack.length && o.stack[o.stack.length - 2] >= this.lastBigReductionStart; )
        ;
      this.bigReductionCount = this.lastBigReductionSize = 0;
    }
    for (let o = 0; o < t.length; o++) {
      let l = t[o];
      for (; ; ) {
        if (this.tokens.mainToken = null, l.pos > e)
          i.push(l);
        else {
          if (this.advanceStack(l, i, t))
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
      let o = s && yu(s);
      if (o)
        return Rt && console.log("Finish with " + this.stackID(o)), this.stackToTree(o);
      if (this.parser.strict)
        throw Rt && s && console.log("Stuck with token " + (this.tokens.mainToken ? this.parser.getName(this.tokens.mainToken.value) : "none")), new SyntaxError("No parse at " + e);
      this.recovering || (this.recovering = 5);
    }
    if (this.recovering && s) {
      let o = this.stoppedAt != null && s[0].pos > this.stoppedAt ? s[0] : this.runRecovery(s, r, i);
      if (o)
        return Rt && console.log("Force-finish " + this.stackID(o)), this.stackToTree(o.forceAll());
    }
    if (this.recovering) {
      let o = this.recovering == 1 ? 1 : this.recovering * 3;
      if (i.length > o)
        for (i.sort((l, a) => a.score - l.score); i.length > o; )
          i.pop();
      i.some((l) => l.reducePos > e) && this.recovering--;
    } else if (i.length > 1) {
      t:
        for (let o = 0; o < i.length - 1; o++) {
          let l = i[o];
          for (let a = o + 1; a < i.length; a++) {
            let h = i[a];
            if (l.sameState(h) || l.buffer.length > 500 && h.buffer.length > 500)
              if ((l.score - h.score || l.buffer.length - h.buffer.length) > 0)
                i.splice(a--, 1);
              else {
                i.splice(o--, 1);
                continue t;
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
  stopAt(t) {
    if (this.stoppedAt != null && this.stoppedAt < t)
      throw new RangeError("Can't move stoppedAt forward");
    this.stoppedAt = t;
  }
  // Returns an updated version of the given stack, or null if the
  // stack can't advance normally. When `split` and `stacks` are
  // given, stacks split off by ambiguous operations will be pushed to
  // `split`, or added to `stacks` if they move `pos` forward.
  advanceStack(t, e, i) {
    let s = t.pos, { parser: r } = this, o = Rt ? this.stackID(t) + " -> " : "";
    if (this.stoppedAt != null && s > this.stoppedAt)
      return t.forceReduce() ? t : null;
    if (this.fragments) {
      let h = t.curContext && t.curContext.tracker.strict, c = h ? t.curContext.hash : 0;
      for (let f = this.fragments.nodeAt(s); f; ) {
        let u = this.parser.nodeSet.types[f.type.id] == f.type ? r.getGoto(t.state, f.type.id) : -1;
        if (u > -1 && f.length && (!h || (f.prop(P.contextHash) || 0) == c))
          return t.useNode(f, u), Rt && console.log(o + this.stackID(t) + ` (via reuse of ${r.getName(f.type.id)})`), !0;
        if (!(f instanceof U) || f.children.length == 0 || f.positions[0] > 0)
          break;
        let d = f.children[0];
        if (d instanceof U && f.positions[0] == 0)
          f = d;
        else
          break;
      }
    }
    let l = r.stateSlot(
      t.state,
      4
      /* ParseState.DefaultReduce */
    );
    if (l > 0)
      return t.reduce(l), Rt && console.log(o + this.stackID(t) + ` (via always-reduce ${r.getName(
        l & 65535
        /* Action.ValueMask */
      )})`), !0;
    if (t.stack.length >= 15e3)
      for (; t.stack.length > 9e3 && t.forceReduce(); )
        ;
    let a = this.tokens.getActions(t);
    for (let h = 0; h < a.length; ) {
      let c = a[h++], f = a[h++], u = a[h++], d = h == a.length || !i, p = d ? t : t.split();
      if (p.apply(c, f, u), Rt && console.log(o + this.stackID(p) + ` (via ${c & 65536 ? `reduce of ${r.getName(
        c & 65535
        /* Action.ValueMask */
      )}` : "shift"} for ${r.getName(f)} @ ${s}${p == t ? "" : ", split"})`), d)
        return !0;
      p.pos > s ? e.push(p) : i.push(p);
    }
    return !1;
  }
  // Advance a given stack forward as far as it will go. Returns the
  // (possibly updated) stack if it got stuck, or null if it moved
  // forward and was given to `pushStackDedup`.
  advanceFully(t, e) {
    let i = t.pos;
    for (; ; ) {
      if (!this.advanceStack(t, null, null))
        return !1;
      if (t.pos > i)
        return Io(t, e), !0;
    }
  }
  runRecovery(t, e, i) {
    let s = null, r = !1;
    for (let o = 0; o < t.length; o++) {
      let l = t[o], a = e[o << 1], h = e[(o << 1) + 1], c = Rt ? this.stackID(l) + " -> " : "";
      if (l.deadEnd && (r || (r = !0, l.restart(), Rt && console.log(c + this.stackID(l) + " (restarted)"), this.advanceFully(l, i))))
        continue;
      let f = l.split(), u = c;
      for (let d = 0; f.forceReduce() && d < 10 && (Rt && console.log(u + this.stackID(f) + " (via force-reduce)"), !this.advanceFully(f, i)); d++)
        Rt && (u = this.stackID(f) + " -> ");
      for (let d of l.recoverByInsert(a))
        Rt && console.log(c + this.stackID(d) + " (via recover-insert)"), this.advanceFully(d, i);
      this.stream.end > l.pos ? (h == l.pos && (h++, a = 0), l.recoverByDelete(a, h), Rt && console.log(c + this.stackID(l) + ` (via recover-delete ${this.parser.getName(a)})`), Io(l, i)) : (!s || s.score < l.score) && (s = l);
    }
    return s;
  }
  // Convert the stack's buffer to a syntax tree.
  stackToTree(t) {
    return t.close(), U.build({
      buffer: Wn.create(t),
      nodeSet: this.parser.nodeSet,
      topID: this.topTerm,
      maxBufferLength: this.parser.bufferLength,
      reused: this.reused,
      start: this.ranges[0].from,
      length: t.pos - this.ranges[0].from,
      minRepeatType: this.parser.minRepeatTerm
    });
  }
  stackID(t) {
    let e = (Rs || (Rs = /* @__PURE__ */ new WeakMap())).get(t);
    return e || Rs.set(t, e = String.fromCodePoint(this.nextStackID++)), e + t;
  }
}
function Io(n, t) {
  for (let e = 0; e < t.length; e++) {
    let i = t[e];
    if (i.pos == n.pos && i.sameState(n)) {
      t[e].score < n.score && (t[e] = n);
      return;
    }
  }
  t.push(n);
}
class bu {
  constructor(t, e, i) {
    this.source = t, this.flags = e, this.disabled = i;
  }
  allows(t) {
    return !this.disabled || this.disabled[t] == 0;
  }
}
class Xn extends Xa {
  /**
  @internal
  */
  constructor(t) {
    if (super(), this.wrappers = [], t.version != 14)
      throw new RangeError(`Parser version (${t.version}) doesn't match runtime version (14)`);
    let e = t.nodeNames.split(" ");
    this.minRepeatTerm = e.length;
    for (let l = 0; l < t.repeatNodeCount; l++)
      e.push("");
    let i = Object.keys(t.topRules).map((l) => t.topRules[l][1]), s = [];
    for (let l = 0; l < e.length; l++)
      s.push([]);
    function r(l, a, h) {
      s[l].push([a, a.deserialize(String(h))]);
    }
    if (t.nodeProps)
      for (let l of t.nodeProps) {
        let a = l[0];
        typeof a == "string" && (a = P[a]);
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
    this.nodeSet = new Jr(e.map((l, a) => Mt.define({
      name: a >= this.minRepeatTerm ? void 0 : l,
      id: a,
      props: s[a],
      top: i.indexOf(a) > -1,
      error: a == 0,
      skipped: t.skippedNodes && t.skippedNodes.indexOf(a) > -1
    }))), t.propSources && (this.nodeSet = this.nodeSet.extend(...t.propSources)), this.strict = !1, this.bufferLength = Va;
    let o = ji(t.tokenData);
    this.context = t.context, this.specializerSpecs = t.specialized || [], this.specialized = new Uint16Array(this.specializerSpecs.length);
    for (let l = 0; l < this.specializerSpecs.length; l++)
      this.specialized[l] = this.specializerSpecs[l].term;
    this.specializers = this.specializerSpecs.map(Eo), this.states = ji(t.states, Uint32Array), this.data = ji(t.stateData), this.goto = ji(t.goto), this.maxTerm = t.maxTerm, this.tokenizers = t.tokenizers.map((l) => typeof l == "number" ? new Je(o, l) : l), this.topRules = t.topRules, this.dialects = t.dialects || {}, this.dynamicPrecedences = t.dynamicPrecedences || null, this.tokenPrecTable = t.tokenPrec, this.termNames = t.termNames || null, this.maxNode = this.nodeSet.types.length - 1, this.dialect = this.parseDialect(), this.top = this.topRules[Object.keys(this.topRules)[0]];
  }
  createParse(t, e, i) {
    let s = new gu(this, t, e, i);
    for (let r of this.wrappers)
      s = r(s, t, e, i);
    return s;
  }
  /**
  Get a goto table entry @internal
  */
  getGoto(t, e, i = !1) {
    let s = this.goto;
    if (e >= s[0])
      return -1;
    for (let r = s[e + 1]; ; ) {
      let o = s[r++], l = o & 1, a = s[r++];
      if (l && i)
        return a;
      for (let h = r + (o >> 1); r < h; r++)
        if (s[r] == t)
          return a;
      if (l)
        return -1;
    }
  }
  /**
  Check if this state has an action for a given terminal @internal
  */
  hasAction(t, e) {
    let i = this.data;
    for (let s = 0; s < 2; s++)
      for (let r = this.stateSlot(
        t,
        s ? 2 : 1
        /* ParseState.Actions */
      ), o; ; r += 3) {
        if ((o = i[r]) == 65535)
          if (i[r + 1] == 1)
            o = i[r = te(i, r + 2)];
          else {
            if (i[r + 1] == 2)
              return te(i, r + 2);
            break;
          }
        if (o == e || o == 0)
          return te(i, r + 1);
      }
    return 0;
  }
  /**
  @internal
  */
  stateSlot(t, e) {
    return this.states[t * 6 + e];
  }
  /**
  @internal
  */
  stateFlag(t, e) {
    return (this.stateSlot(
      t,
      0
      /* ParseState.Flags */
    ) & e) > 0;
  }
  /**
  @internal
  */
  validAction(t, e) {
    return !!this.allActions(t, (i) => i == e ? !0 : null);
  }
  /**
  @internal
  */
  allActions(t, e) {
    let i = this.stateSlot(
      t,
      4
      /* ParseState.DefaultReduce */
    ), s = i ? e(i) : void 0;
    for (let r = this.stateSlot(
      t,
      1
      /* ParseState.Actions */
    ); s == null; r += 3) {
      if (this.data[r] == 65535)
        if (this.data[r + 1] == 1)
          r = te(this.data, r + 2);
        else
          break;
      s = e(te(this.data, r + 1));
    }
    return s;
  }
  /**
  Get the states that can follow this one through shift actions or
  goto jumps. @internal
  */
  nextStates(t) {
    let e = [];
    for (let i = this.stateSlot(
      t,
      1
      /* ParseState.Actions */
    ); ; i += 3) {
      if (this.data[i] == 65535)
        if (this.data[i + 1] == 1)
          i = te(this.data, i + 2);
        else
          break;
      if (!(this.data[i + 2] & 1)) {
        let s = this.data[i + 1];
        e.some((r, o) => o & 1 && r == s) || e.push(this.data[i], s);
      }
    }
    return e;
  }
  /**
  Configure the parser. Returns a new parser instance that has the
  given settings modified. Settings not provided in `config` are
  kept from the original parser.
  */
  configure(t) {
    let e = Object.assign(Object.create(Xn.prototype), this);
    if (t.props && (e.nodeSet = this.nodeSet.extend(...t.props)), t.top) {
      let i = this.topRules[t.top];
      if (!i)
        throw new RangeError(`Invalid top rule name ${t.top}`);
      e.top = i;
    }
    return t.tokenizers && (e.tokenizers = this.tokenizers.map((i) => {
      let s = t.tokenizers.find((r) => r.from == i);
      return s ? s.to : i;
    })), t.specializers && (e.specializers = this.specializers.slice(), e.specializerSpecs = this.specializerSpecs.map((i, s) => {
      let r = t.specializers.find((l) => l.from == i.external);
      if (!r)
        return i;
      let o = Object.assign(Object.assign({}, i), { external: r.to });
      return e.specializers[s] = Eo(o), o;
    })), t.contextTracker && (e.context = t.contextTracker), t.dialect && (e.dialect = this.parseDialect(t.dialect)), t.strict != null && (e.strict = t.strict), t.wrap && (e.wrappers = e.wrappers.concat(t.wrap)), t.bufferLength != null && (e.bufferLength = t.bufferLength), e;
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
  getName(t) {
    return this.termNames ? this.termNames[t] : String(t <= this.maxNode && this.nodeSet.types[t].name || t);
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
  dynamicPrecedence(t) {
    let e = this.dynamicPrecedences;
    return e == null ? 0 : e[t] || 0;
  }
  /**
  @internal
  */
  parseDialect(t) {
    let e = Object.keys(this.dialects), i = e.map(() => !1);
    if (t)
      for (let r of t.split(" ")) {
        let o = e.indexOf(r);
        o >= 0 && (i[o] = !0);
      }
    let s = null;
    for (let r = 0; r < e.length; r++)
      if (!i[r])
        for (let o = this.dialects[e[r]], l; (l = this.data[o++]) != 65535; )
          (s || (s = new Uint8Array(this.maxTerm + 1)))[l] = 1;
    return new bu(t, i, s);
  }
  /**
  Used by the output of the parser generator. Not available to
  user code. @hide
  */
  static deserialize(t) {
    return new Xn(t);
  }
}
function te(n, t) {
  return n[t] | n[t + 1] << 16;
}
function yu(n) {
  let t = null;
  for (let e of n) {
    let i = e.p.stoppedAt;
    (e.pos == e.p.stream.end || i != null && e.pos > i) && e.p.parser.stateFlag(
      e.state,
      2
      /* StateFlag.Accepting */
    ) && (!t || t.score < e.score) && (t = e);
  }
  return t;
}
function Eo(n) {
  if (n.external) {
    let t = n.extend ? 1 : 0;
    return (e, i) => n.external(e, i) << 1 | t;
  }
  return n.get;
}
const xu = { __proto__: null, let: 8, in: 16, if: 20, then: 22, else: 24, forall: 68 }, ku = { __proto__: null, "=": 14, "\\": 28, λ: 28, "->": 32, "+": 36, "-": 36, "*": 38, "/": 38, ">": 40, ">=": 40, "<": 40, "<=": 40, "?": 118, "∀": 70, ".": 74, "==": 82, "<:": 84, "<<": 86 }, wu = { __proto__: null, True: 44, False: 44 }, Su = Xn.deserialize({
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
  specialized: [{ term: 51, get: (n) => xu[n] || -1 }, { term: 52, get: (n) => ku[n] || -1 }, { term: 55, get: (n) => wu[n] || -1 }],
  tokenPrec: 629
});
class W {
  /**
  Get the line description around the given position.
  */
  lineAt(t) {
    if (t < 0 || t > this.length)
      throw new RangeError(`Invalid position ${t} in document of length ${this.length}`);
    return this.lineInner(t, !1, 1, 0);
  }
  /**
  Get the description for the given (1-based) line number.
  */
  line(t) {
    if (t < 1 || t > this.lines)
      throw new RangeError(`Invalid line number ${t} in ${this.lines}-line document`);
    return this.lineInner(t, !0, 1, 0);
  }
  /**
  Replace a range of the text with the given content.
  */
  replace(t, e, i) {
    let s = [];
    return this.decompose(
      0,
      t,
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
      e,
      this.length,
      s,
      1
      /* Open.From */
    ), Yt.from(s, this.length - (e - t) + i.length);
  }
  /**
  Append another document to this one.
  */
  append(t) {
    return this.replace(this.length, this.length, t);
  }
  /**
  Retrieve the text between the given points.
  */
  slice(t, e = this.length) {
    let i = [];
    return this.decompose(t, e, i, 0), Yt.from(i, e - t);
  }
  /**
  Test whether this text is equal to another instance.
  */
  eq(t) {
    if (t == this)
      return !0;
    if (t.length != this.length || t.lines != this.lines)
      return !1;
    let e = this.scanIdentical(t, 1), i = this.length - this.scanIdentical(t, -1), s = new xi(this), r = new xi(t);
    for (let o = e, l = e; ; ) {
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
  iter(t = 1) {
    return new xi(this, t);
  }
  /**
  Iterate over a range of the text. When `from` > `to`, the
  iterator will run in reverse.
  */
  iterRange(t, e = this.length) {
    return new Ia(this, t, e);
  }
  /**
  Return a cursor that iterates over the given range of lines,
  _without_ returning the line breaks between, and yielding empty
  strings for empty lines.
  
  When `from` and `to` are given, they should be 1-based line numbers.
  */
  iterLines(t, e) {
    let i;
    if (t == null)
      i = this.iter();
    else {
      e == null && (e = this.lines + 1);
      let s = this.line(t).from;
      i = this.iterRange(s, Math.max(s, e == this.lines + 1 ? this.length : e <= 1 ? 0 : this.line(e - 1).to));
    }
    return new Ea(i);
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
    let t = [];
    return this.flatten(t), t;
  }
  /**
  @internal
  */
  constructor() {
  }
  /**
  Create a `Text` instance for the given array of lines.
  */
  static of(t) {
    if (t.length == 0)
      throw new RangeError("A document must have at least one line");
    return t.length == 1 && !t[0] ? W.empty : t.length <= 32 ? new J(t) : Yt.from(J.split(t, []));
  }
}
class J extends W {
  constructor(t, e = vu(t)) {
    super(), this.text = t, this.length = e;
  }
  get lines() {
    return this.text.length;
  }
  get children() {
    return null;
  }
  lineInner(t, e, i, s) {
    for (let r = 0; ; r++) {
      let o = this.text[r], l = s + o.length;
      if ((e ? i : l) >= t)
        return new Cu(s, l, i, o);
      s = l + 1, i++;
    }
  }
  decompose(t, e, i, s) {
    let r = t <= 0 && e >= this.length ? this : new J(No(this.text, t, e), Math.min(e, this.length) - Math.max(0, t));
    if (s & 1) {
      let o = i.pop(), l = wn(r.text, o.text.slice(), 0, r.length);
      if (l.length <= 32)
        i.push(new J(l, o.length + r.length));
      else {
        let a = l.length >> 1;
        i.push(new J(l.slice(0, a)), new J(l.slice(a)));
      }
    } else
      i.push(r);
  }
  replace(t, e, i) {
    if (!(i instanceof J))
      return super.replace(t, e, i);
    let s = wn(this.text, wn(i.text, No(this.text, 0, t)), e), r = this.length + i.length - (e - t);
    return s.length <= 32 ? new J(s, r) : Yt.from(J.split(s, []), r);
  }
  sliceString(t, e = this.length, i = `
`) {
    let s = "";
    for (let r = 0, o = 0; r <= e && o < this.text.length; o++) {
      let l = this.text[o], a = r + l.length;
      r > t && o && (s += i), t < a && e > r && (s += l.slice(Math.max(0, t - r), e - r)), r = a + 1;
    }
    return s;
  }
  flatten(t) {
    for (let e of this.text)
      t.push(e);
  }
  scanIdentical() {
    return 0;
  }
  static split(t, e) {
    let i = [], s = -1;
    for (let r of t)
      i.push(r), s += r.length + 1, i.length == 32 && (e.push(new J(i, s)), i = [], s = -1);
    return s > -1 && e.push(new J(i, s)), e;
  }
}
class Yt extends W {
  constructor(t, e) {
    super(), this.children = t, this.length = e, this.lines = 0;
    for (let i of t)
      this.lines += i.lines;
  }
  lineInner(t, e, i, s) {
    for (let r = 0; ; r++) {
      let o = this.children[r], l = s + o.length, a = i + o.lines - 1;
      if ((e ? a : l) >= t)
        return o.lineInner(t, e, i, s);
      s = l + 1, i = a + 1;
    }
  }
  decompose(t, e, i, s) {
    for (let r = 0, o = 0; o <= e && r < this.children.length; r++) {
      let l = this.children[r], a = o + l.length;
      if (t <= a && e >= o) {
        let h = s & ((o <= t ? 1 : 0) | (a >= e ? 2 : 0));
        o >= t && a <= e && !h ? i.push(l) : l.decompose(t - o, e - o, i, h);
      }
      o = a + 1;
    }
  }
  replace(t, e, i) {
    if (i.lines < this.lines)
      for (let s = 0, r = 0; s < this.children.length; s++) {
        let o = this.children[s], l = r + o.length;
        if (t >= r && e <= l) {
          let a = o.replace(t - r, e - r, i), h = this.lines - o.lines + a.lines;
          if (a.lines < h >> 5 - 1 && a.lines > h >> 5 + 1) {
            let c = this.children.slice();
            return c[s] = a, new Yt(c, this.length - (e - t) + i.length);
          }
          return super.replace(r, l, a);
        }
        r = l + 1;
      }
    return super.replace(t, e, i);
  }
  sliceString(t, e = this.length, i = `
`) {
    let s = "";
    for (let r = 0, o = 0; r < this.children.length && o <= e; r++) {
      let l = this.children[r], a = o + l.length;
      o > t && r && (s += i), t < a && e > o && (s += l.sliceString(t - o, e - o, i)), o = a + 1;
    }
    return s;
  }
  flatten(t) {
    for (let e of this.children)
      e.flatten(t);
  }
  scanIdentical(t, e) {
    if (!(t instanceof Yt))
      return 0;
    let i = 0, [s, r, o, l] = e > 0 ? [0, 0, this.children.length, t.children.length] : [this.children.length - 1, t.children.length - 1, -1, -1];
    for (; ; s += e, r += e) {
      if (s == o || r == l)
        return i;
      let a = this.children[s], h = t.children[r];
      if (a != h)
        return i + a.scanIdentical(h, e);
      i += a.length + 1;
    }
  }
  static from(t, e = t.reduce((i, s) => i + s.length + 1, -1)) {
    let i = 0;
    for (let d of t)
      i += d.lines;
    if (i < 32) {
      let d = [];
      for (let p of t)
        p.flatten(d);
      return new J(d, e);
    }
    let s = Math.max(
      32,
      i >> 5
      /* Tree.BranchShift */
    ), r = s << 1, o = s >> 1, l = [], a = 0, h = -1, c = [];
    function f(d) {
      let p;
      if (d.lines > r && d instanceof Yt)
        for (let g of d.children)
          f(g);
      else
        d.lines > o && (a > o || !a) ? (u(), l.push(d)) : d instanceof J && a && (p = c[c.length - 1]) instanceof J && d.lines + p.lines <= 32 ? (a += d.lines, h += d.length + 1, c[c.length - 1] = new J(p.text.concat(d.text), p.length + 1 + d.length)) : (a + d.lines > s && u(), a += d.lines, h += d.length + 1, c.push(d));
    }
    function u() {
      a != 0 && (l.push(c.length == 1 ? c[0] : Yt.from(c, h)), h = -1, a = c.length = 0);
    }
    for (let d of t)
      f(d);
    return u(), l.length == 1 ? l[0] : new Yt(l, e);
  }
}
W.empty = /* @__PURE__ */ new J([""], 0);
function vu(n) {
  let t = -1;
  for (let e of n)
    t += e.length + 1;
  return t;
}
function wn(n, t, e = 0, i = 1e9) {
  for (let s = 0, r = 0, o = !0; r < n.length && s <= i; r++) {
    let l = n[r], a = s + l.length;
    a >= e && (a > i && (l = l.slice(0, i - s)), s < e && (l = l.slice(e - s)), o ? (t[t.length - 1] += l, o = !1) : t.push(l)), s = a + 1;
  }
  return t;
}
function No(n, t, e) {
  return wn(n, [""], t, e);
}
class xi {
  constructor(t, e = 1) {
    this.dir = e, this.done = !1, this.lineBreak = !1, this.value = "", this.nodes = [t], this.offsets = [e > 0 ? 1 : (t instanceof J ? t.text.length : t.children.length) << 1];
  }
  nextInner(t, e) {
    for (this.done = this.lineBreak = !1; ; ) {
      let i = this.nodes.length - 1, s = this.nodes[i], r = this.offsets[i], o = r >> 1, l = s instanceof J ? s.text.length : s.children.length;
      if (o == (e > 0 ? l : 0)) {
        if (i == 0)
          return this.done = !0, this.value = "", this;
        e > 0 && this.offsets[i - 1]++, this.nodes.pop(), this.offsets.pop();
      } else if ((r & 1) == (e > 0 ? 0 : 1)) {
        if (this.offsets[i] += e, t == 0)
          return this.lineBreak = !0, this.value = `
`, this;
        t--;
      } else if (s instanceof J) {
        let a = s.text[o + (e < 0 ? -1 : 0)];
        if (this.offsets[i] += e, a.length > Math.max(0, t))
          return this.value = t == 0 ? a : e > 0 ? a.slice(t) : a.slice(0, a.length - t), this;
        t -= a.length;
      } else {
        let a = s.children[o + (e < 0 ? -1 : 0)];
        t > a.length ? (t -= a.length, this.offsets[i] += e) : (e < 0 && this.offsets[i]--, this.nodes.push(a), this.offsets.push(e > 0 ? 1 : (a instanceof J ? a.text.length : a.children.length) << 1));
      }
    }
  }
  next(t = 0) {
    return t < 0 && (this.nextInner(-t, -this.dir), t = this.value.length), this.nextInner(t, this.dir);
  }
}
class Ia {
  constructor(t, e, i) {
    this.value = "", this.done = !1, this.cursor = new xi(t, e > i ? -1 : 1), this.pos = e > i ? t.length : 0, this.from = Math.min(e, i), this.to = Math.max(e, i);
  }
  nextInner(t, e) {
    if (e < 0 ? this.pos <= this.from : this.pos >= this.to)
      return this.value = "", this.done = !0, this;
    t += Math.max(0, e < 0 ? this.pos - this.to : this.from - this.pos);
    let i = e < 0 ? this.pos - this.from : this.to - this.pos;
    t > i && (t = i), i -= t;
    let { value: s } = this.cursor.next(t);
    return this.pos += (s.length + t) * e, this.value = s.length <= i ? s : e < 0 ? s.slice(s.length - i) : s.slice(0, i), this.done = !this.value, this;
  }
  next(t = 0) {
    return t < 0 ? t = Math.max(t, this.from - this.pos) : t > 0 && (t = Math.min(t, this.to - this.pos)), this.nextInner(t, this.cursor.dir);
  }
  get lineBreak() {
    return this.cursor.lineBreak && this.value != "";
  }
}
class Ea {
  constructor(t) {
    this.inner = t, this.afterBreak = !0, this.value = "", this.done = !1;
  }
  next(t = 0) {
    let { done: e, lineBreak: i, value: s } = this.inner.next(t);
    return e ? (this.done = !0, this.value = "") : i ? this.afterBreak ? this.value = "" : (this.afterBreak = !0, this.next()) : (this.value = s, this.afterBreak = !1), this;
  }
  get lineBreak() {
    return !1;
  }
}
typeof Symbol < "u" && (W.prototype[Symbol.iterator] = function() {
  return this.iter();
}, xi.prototype[Symbol.iterator] = Ia.prototype[Symbol.iterator] = Ea.prototype[Symbol.iterator] = function() {
  return this;
});
class Cu {
  /**
  @internal
  */
  constructor(t, e, i, s) {
    this.from = t, this.to = e, this.number = i, this.text = s;
  }
  /**
  The length of the line (not including any line break after it).
  */
  get length() {
    return this.to - this.from;
  }
}
let Qe = /* @__PURE__ */ "lc,34,7n,7,7b,19,,,,2,,2,,,20,b,1c,l,g,,2t,7,2,6,2,2,,4,z,,u,r,2j,b,1m,9,9,,o,4,,9,,3,,5,17,3,3b,f,,w,1j,,,,4,8,4,,3,7,a,2,t,,1m,,,,2,4,8,,9,,a,2,q,,2,2,1l,,4,2,4,2,2,3,3,,u,2,3,,b,2,1l,,4,5,,2,4,,k,2,m,6,,,1m,,,2,,4,8,,7,3,a,2,u,,1n,,,,c,,9,,14,,3,,1l,3,5,3,,4,7,2,b,2,t,,1m,,2,,2,,3,,5,2,7,2,b,2,s,2,1l,2,,,2,4,8,,9,,a,2,t,,20,,4,,2,3,,,8,,29,,2,7,c,8,2q,,2,9,b,6,22,2,r,,,,,,1j,e,,5,,2,5,b,,10,9,,2u,4,,6,,2,2,2,p,2,4,3,g,4,d,,2,2,6,,f,,jj,3,qa,3,t,3,t,2,u,2,1s,2,,7,8,,2,b,9,,19,3,3b,2,y,,3a,3,4,2,9,,6,3,63,2,2,,1m,,,7,,,,,2,8,6,a,2,,1c,h,1r,4,1c,7,,,5,,14,9,c,2,w,4,2,2,,3,1k,,,2,3,,,3,1m,8,2,2,48,3,,d,,7,4,,6,,3,2,5i,1m,,5,ek,,5f,x,2da,3,3x,,2o,w,fe,6,2x,2,n9w,4,,a,w,2,28,2,7k,,3,,4,,p,2,5,,47,2,q,i,d,,12,8,p,b,1a,3,1c,,2,4,2,2,13,,1v,6,2,2,2,2,c,,8,,1b,,1f,,,3,2,2,5,2,,,16,2,8,,6m,,2,,4,,fn4,,kh,g,g,g,a6,2,gt,,6a,,45,5,1ae,3,,2,5,4,14,3,4,,4l,2,fx,4,ar,2,49,b,4w,,1i,f,1k,3,1d,4,2,2,1x,3,10,5,,8,1q,,c,2,1g,9,a,4,2,,2n,3,2,,,2,6,,4g,,3,8,l,2,1l,2,,,,,m,,e,7,3,5,5f,8,2,3,,,n,,29,,2,6,,,2,,,2,,2,6j,,2,4,6,2,,2,r,2,2d,8,2,,,2,2y,,,,2,6,,,2t,3,2,4,,5,77,9,,2,6t,,a,2,,,4,,40,4,2,2,4,,w,a,14,6,2,4,8,,9,6,2,3,1a,d,,2,ba,7,,6,,,2a,m,2,7,,2,,2,3e,6,3,,,2,,7,,,20,2,3,,,,9n,2,f0b,5,1n,7,t4,,1r,4,29,,f5k,2,43q,,,3,4,5,8,8,2,7,u,4,44,3,1iz,1j,4,1e,8,,e,,m,5,,f,11s,7,,h,2,7,,2,,5,79,7,c5,4,15s,7,31,7,240,5,gx7k,2o,3k,6o".split(",").map((n) => n ? parseInt(n, 36) : 1);
for (let n = 1; n < Qe.length; n++)
  Qe[n] += Qe[n - 1];
function Ou(n) {
  for (let t = 1; t < Qe.length; t += 2)
    if (Qe[t] > n)
      return Qe[t - 1] <= n;
  return !1;
}
function Go(n) {
  return n >= 127462 && n <= 127487;
}
const Ho = 8205;
function ut(n, t, e = !0, i = !0) {
  return (e ? Na : Au)(n, t, i);
}
function Na(n, t, e) {
  if (t == n.length)
    return t;
  t && Ga(n.charCodeAt(t)) && Ha(n.charCodeAt(t - 1)) && t--;
  let i = lt(n, t);
  for (t += Bt(i); t < n.length; ) {
    let s = lt(n, t);
    if (i == Ho || s == Ho || e && Ou(s))
      t += Bt(s), i = s;
    else if (Go(s)) {
      let r = 0, o = t - 2;
      for (; o >= 0 && Go(lt(n, o)); )
        r++, o -= 2;
      if (r % 2 == 0)
        break;
      t += 2;
    } else
      break;
  }
  return t;
}
function Au(n, t, e) {
  for (; t > 0; ) {
    let i = Na(n, t - 2, e);
    if (i < t)
      return i;
    t--;
  }
  return 0;
}
function Ga(n) {
  return n >= 56320 && n < 57344;
}
function Ha(n) {
  return n >= 55296 && n < 56320;
}
function lt(n, t) {
  let e = n.charCodeAt(t);
  if (!Ha(e) || t + 1 == n.length)
    return e;
  let i = n.charCodeAt(t + 1);
  return Ga(i) ? (e - 55296 << 10) + (i - 56320) + 65536 : e;
}
function jr(n) {
  return n <= 65535 ? String.fromCharCode(n) : (n -= 65536, String.fromCharCode((n >> 10) + 55296, (n & 1023) + 56320));
}
function Bt(n) {
  return n < 65536 ? 1 : 2;
}
const ir = /\r\n?|\n/;
var yt = /* @__PURE__ */ function(n) {
  return n[n.Simple = 0] = "Simple", n[n.TrackDel = 1] = "TrackDel", n[n.TrackBefore = 2] = "TrackBefore", n[n.TrackAfter = 3] = "TrackAfter", n;
}(yt || (yt = {}));
class $t {
  // Sections are encoded as pairs of integers. The first is the
  // length in the current document, and the second is -1 for
  // unaffected sections, and the length of the replacement content
  // otherwise. So an insertion would be (0, n>0), a deletion (n>0,
  // 0), and a replacement two positive numbers.
  /**
  @internal
  */
  constructor(t) {
    this.sections = t;
  }
  /**
  The length of the document before the change.
  */
  get length() {
    let t = 0;
    for (let e = 0; e < this.sections.length; e += 2)
      t += this.sections[e];
    return t;
  }
  /**
  The length of the document after the change.
  */
  get newLength() {
    let t = 0;
    for (let e = 0; e < this.sections.length; e += 2) {
      let i = this.sections[e + 1];
      t += i < 0 ? this.sections[e] : i;
    }
    return t;
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
  iterGaps(t) {
    for (let e = 0, i = 0, s = 0; e < this.sections.length; ) {
      let r = this.sections[e++], o = this.sections[e++];
      o < 0 ? (t(i, s, r), s += r) : s += o, i += r;
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
  iterChangedRanges(t, e = !1) {
    nr(this, t, e);
  }
  /**
  Get a description of the inverted form of these changes.
  */
  get invertedDesc() {
    let t = [];
    for (let e = 0; e < this.sections.length; ) {
      let i = this.sections[e++], s = this.sections[e++];
      s < 0 ? t.push(i, s) : t.push(s, i);
    }
    return new $t(t);
  }
  /**
  Compute the combined effect of applying another set of changes
  after this one. The length of the document after this set should
  match the length before `other`.
  */
  composeDesc(t) {
    return this.empty ? t : t.empty ? this : Fa(this, t);
  }
  /**
  Map this description, which should start with the same document
  as `other`, over another set of changes, so that it can be
  applied after it. When `before` is true, map as if the changes
  in `other` happened before the ones in `this`.
  */
  mapDesc(t, e = !1) {
    return t.empty ? this : sr(this, t, e);
  }
  mapPos(t, e = -1, i = yt.Simple) {
    let s = 0, r = 0;
    for (let o = 0; o < this.sections.length; ) {
      let l = this.sections[o++], a = this.sections[o++], h = s + l;
      if (a < 0) {
        if (h > t)
          return r + (t - s);
        r += l;
      } else {
        if (i != yt.Simple && h >= t && (i == yt.TrackDel && s < t && h > t || i == yt.TrackBefore && s < t || i == yt.TrackAfter && h > t))
          return null;
        if (h > t || h == t && e < 0 && !l)
          return t == s || e < 0 ? r : r + a;
        r += a;
      }
      s = h;
    }
    if (t > s)
      throw new RangeError(`Position ${t} is out of range for changeset of length ${s}`);
    return r;
  }
  /**
  Check whether these changes touch a given range. When one of the
  changes entirely covers the range, the string `"cover"` is
  returned.
  */
  touchesRange(t, e = t) {
    for (let i = 0, s = 0; i < this.sections.length && s <= e; ) {
      let r = this.sections[i++], o = this.sections[i++], l = s + r;
      if (o >= 0 && s <= e && l >= t)
        return s < t && l > e ? "cover" : !0;
      s = l;
    }
    return !1;
  }
  /**
  @internal
  */
  toString() {
    let t = "";
    for (let e = 0; e < this.sections.length; ) {
      let i = this.sections[e++], s = this.sections[e++];
      t += (t ? " " : "") + i + (s >= 0 ? ":" + s : "");
    }
    return t;
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
  static fromJSON(t) {
    if (!Array.isArray(t) || t.length % 2 || t.some((e) => typeof e != "number"))
      throw new RangeError("Invalid JSON representation of ChangeDesc");
    return new $t(t);
  }
  /**
  @internal
  */
  static create(t) {
    return new $t(t);
  }
}
class et extends $t {
  constructor(t, e) {
    super(t), this.inserted = e;
  }
  /**
  Apply the changes to a document, returning the modified
  document.
  */
  apply(t) {
    if (this.length != t.length)
      throw new RangeError("Applying change set to a document with the wrong length");
    return nr(this, (e, i, s, r, o) => t = t.replace(s, s + (i - e), o), !1), t;
  }
  mapDesc(t, e = !1) {
    return sr(this, t, e, !0);
  }
  /**
  Given the document as it existed _before_ the changes, return a
  change set that represents the inverse of this set, which could
  be used to go from the document created by the changes back to
  the document as it existed before the changes.
  */
  invert(t) {
    let e = this.sections.slice(), i = [];
    for (let s = 0, r = 0; s < e.length; s += 2) {
      let o = e[s], l = e[s + 1];
      if (l >= 0) {
        e[s] = l, e[s + 1] = o;
        let a = s >> 1;
        for (; i.length < a; )
          i.push(W.empty);
        i.push(o ? t.slice(r, r + o) : W.empty);
      }
      r += o;
    }
    return new et(e, i);
  }
  /**
  Combine two subsequent change sets into a single set. `other`
  must start in the document produced by `this`. If `this` goes
  `docA` → `docB` and `other` represents `docB` → `docC`, the
  returned value will represent the change `docA` → `docC`.
  */
  compose(t) {
    return this.empty ? t : t.empty ? this : Fa(this, t, !0);
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
  map(t, e = !1) {
    return t.empty ? this : sr(this, t, e, !0);
  }
  /**
  Iterate over the changed ranges in the document, calling `f` for
  each, with the range in the original document (`fromA`-`toA`)
  and the range that replaces it in the new document
  (`fromB`-`toB`).
  
  When `individual` is true, adjacent changes are reported
  separately.
  */
  iterChanges(t, e = !1) {
    nr(this, t, e);
  }
  /**
  Get a [change description](https://codemirror.net/6/docs/ref/#state.ChangeDesc) for this change
  set.
  */
  get desc() {
    return $t.create(this.sections);
  }
  /**
  @internal
  */
  filter(t) {
    let e = [], i = [], s = [], r = new Ci(this);
    t:
      for (let o = 0, l = 0; ; ) {
        let a = o == t.length ? 1e9 : t[o++];
        for (; l < a || l == a && r.len == 0; ) {
          if (r.done)
            break t;
          let c = Math.min(r.len, a - l);
          ft(s, c, -1);
          let f = r.ins == -1 ? -1 : r.off == 0 ? r.ins : 0;
          ft(e, c, f), f > 0 && ce(i, e, r.text), r.forward(c), l += c;
        }
        let h = t[o++];
        for (; l < h; ) {
          if (r.done)
            break t;
          let c = Math.min(r.len, h - l);
          ft(e, c, -1), ft(s, c, r.ins == -1 ? -1 : r.off == 0 ? r.ins : 0), r.forward(c), l += c;
        }
      }
    return {
      changes: new et(e, i),
      filtered: $t.create(s)
    };
  }
  /**
  Serialize this change set to a JSON-representable value.
  */
  toJSON() {
    let t = [];
    for (let e = 0; e < this.sections.length; e += 2) {
      let i = this.sections[e], s = this.sections[e + 1];
      s < 0 ? t.push(i) : s == 0 ? t.push([i]) : t.push([i].concat(this.inserted[e >> 1].toJSON()));
    }
    return t;
  }
  /**
  Create a change set for the given changes, for a document of the
  given length, using `lineSep` as line separator.
  */
  static of(t, e, i) {
    let s = [], r = [], o = 0, l = null;
    function a(c = !1) {
      if (!c && !s.length)
        return;
      o < e && ft(s, e - o, -1);
      let f = new et(s, r);
      l = l ? l.compose(f.map(l)) : f, s = [], r = [], o = 0;
    }
    function h(c) {
      if (Array.isArray(c))
        for (let f of c)
          h(f);
      else if (c instanceof et) {
        if (c.length != e)
          throw new RangeError(`Mismatched change set length (got ${c.length}, expected ${e})`);
        a(), l = l ? l.compose(c.map(l)) : c;
      } else {
        let { from: f, to: u = f, insert: d } = c;
        if (f > u || f < 0 || u > e)
          throw new RangeError(`Invalid change range ${f} to ${u} (in doc of length ${e})`);
        let p = d ? typeof d == "string" ? W.of(d.split(i || ir)) : d : W.empty, g = p.length;
        if (f == u && g == 0)
          return;
        f < o && a(), f > o && ft(s, f - o, -1), ft(s, u - f, g), ce(r, s, p), o = u;
      }
    }
    return h(t), a(!l), l;
  }
  /**
  Create an empty changeset of the given length.
  */
  static empty(t) {
    return new et(t ? [t, -1] : [], []);
  }
  /**
  Create a changeset from its JSON representation (as produced by
  [`toJSON`](https://codemirror.net/6/docs/ref/#state.ChangeSet.toJSON).
  */
  static fromJSON(t) {
    if (!Array.isArray(t))
      throw new RangeError("Invalid JSON representation of ChangeSet");
    let e = [], i = [];
    for (let s = 0; s < t.length; s++) {
      let r = t[s];
      if (typeof r == "number")
        e.push(r, -1);
      else {
        if (!Array.isArray(r) || typeof r[0] != "number" || r.some((o, l) => l && typeof o != "string"))
          throw new RangeError("Invalid JSON representation of ChangeSet");
        if (r.length == 1)
          e.push(r[0], 0);
        else {
          for (; i.length < s; )
            i.push(W.empty);
          i[s] = W.of(r.slice(1)), e.push(r[0], i[s].length);
        }
      }
    }
    return new et(e, i);
  }
  /**
  @internal
  */
  static createSet(t, e) {
    return new et(t, e);
  }
}
function ft(n, t, e, i = !1) {
  if (t == 0 && e <= 0)
    return;
  let s = n.length - 2;
  s >= 0 && e <= 0 && e == n[s + 1] ? n[s] += t : t == 0 && n[s] == 0 ? n[s + 1] += e : i ? (n[s] += t, n[s + 1] += e) : n.push(t, e);
}
function ce(n, t, e) {
  if (e.length == 0)
    return;
  let i = t.length - 2 >> 1;
  if (i < n.length)
    n[n.length - 1] = n[n.length - 1].append(e);
  else {
    for (; n.length < i; )
      n.push(W.empty);
    n.push(e);
  }
}
function nr(n, t, e) {
  let i = n.inserted;
  for (let s = 0, r = 0, o = 0; o < n.sections.length; ) {
    let l = n.sections[o++], a = n.sections[o++];
    if (a < 0)
      s += l, r += l;
    else {
      let h = s, c = r, f = W.empty;
      for (; h += l, c += a, a && i && (f = f.append(i[o - 2 >> 1])), !(e || o == n.sections.length || n.sections[o + 1] < 0); )
        l = n.sections[o++], a = n.sections[o++];
      t(s, h, r, c, f), s = h, r = c;
    }
  }
}
function sr(n, t, e, i = !1) {
  let s = [], r = i ? [] : null, o = new Ci(n), l = new Ci(t);
  for (let a = -1; ; )
    if (o.ins == -1 && l.ins == -1) {
      let h = Math.min(o.len, l.len);
      ft(s, h, -1), o.forward(h), l.forward(h);
    } else if (l.ins >= 0 && (o.ins < 0 || a == o.i || o.off == 0 && (l.len < o.len || l.len == o.len && !e))) {
      let h = l.len;
      for (ft(s, l.ins, -1); h; ) {
        let c = Math.min(o.len, h);
        o.ins >= 0 && a < o.i && o.len <= c && (ft(s, 0, o.ins), r && ce(r, s, o.text), a = o.i), o.forward(c), h -= c;
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
      ft(s, h, a < o.i ? o.ins : 0), r && a < o.i && ce(r, s, o.text), a = o.i, o.forward(o.len - c);
    } else {
      if (o.done && l.done)
        return r ? et.createSet(s, r) : $t.create(s);
      throw new Error("Mismatched change set lengths");
    }
}
function Fa(n, t, e = !1) {
  let i = [], s = e ? [] : null, r = new Ci(n), o = new Ci(t);
  for (let l = !1; ; ) {
    if (r.done && o.done)
      return s ? et.createSet(i, s) : $t.create(i);
    if (r.ins == 0)
      ft(i, r.len, 0, l), r.next();
    else if (o.len == 0 && !o.done)
      ft(i, 0, o.ins, l), s && ce(s, i, o.text), o.next();
    else {
      if (r.done || o.done)
        throw new Error("Mismatched change set lengths");
      {
        let a = Math.min(r.len2, o.len), h = i.length;
        if (r.ins == -1) {
          let c = o.ins == -1 ? -1 : o.off ? 0 : o.ins;
          ft(i, a, c, l), s && c && ce(s, i, o.text);
        } else
          o.ins == -1 ? (ft(i, r.off ? 0 : r.len, a, l), s && ce(s, i, r.textBit(a))) : (ft(i, r.off ? 0 : r.len, o.off ? 0 : o.ins, l), s && !o.off && ce(s, i, o.text));
        l = (r.ins > a || o.ins >= 0 && o.len > a) && (l || i.length > h), r.forward2(a), o.forward(a);
      }
    }
  }
}
class Ci {
  constructor(t) {
    this.set = t, this.i = 0, this.next();
  }
  next() {
    let { sections: t } = this.set;
    this.i < t.length ? (this.len = t[this.i++], this.ins = t[this.i++]) : (this.len = 0, this.ins = -2), this.off = 0;
  }
  get done() {
    return this.ins == -2;
  }
  get len2() {
    return this.ins < 0 ? this.len : this.ins;
  }
  get text() {
    let { inserted: t } = this.set, e = this.i - 2 >> 1;
    return e >= t.length ? W.empty : t[e];
  }
  textBit(t) {
    let { inserted: e } = this.set, i = this.i - 2 >> 1;
    return i >= e.length && !t ? W.empty : e[i].slice(this.off, t == null ? void 0 : this.off + t);
  }
  forward(t) {
    t == this.len ? this.next() : (this.len -= t, this.off += t);
  }
  forward2(t) {
    this.ins == -1 ? this.forward(t) : t == this.ins ? this.next() : (this.ins -= t, this.off += t);
  }
}
class Re {
  constructor(t, e, i) {
    this.from = t, this.to = e, this.flags = i;
  }
  /**
  The anchor of the range—the side that doesn't move when you
  extend it.
  */
  get anchor() {
    return this.flags & 16 ? this.to : this.from;
  }
  /**
  The head of the range, which is moved when the range is
  [extended](https://codemirror.net/6/docs/ref/#state.SelectionRange.extend).
  */
  get head() {
    return this.flags & 16 ? this.from : this.to;
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
    return this.flags & 4 ? -1 : this.flags & 8 ? 1 : 0;
  }
  /**
  The bidirectional text level associated with this cursor, if
  any.
  */
  get bidiLevel() {
    let t = this.flags & 3;
    return t == 3 ? null : t;
  }
  /**
  The goal column (stored vertical offset) associated with a
  cursor. This is used to preserve the vertical position when
  [moving](https://codemirror.net/6/docs/ref/#view.EditorView.moveVertically) across
  lines of different length.
  */
  get goalColumn() {
    let t = this.flags >> 5;
    return t == 33554431 ? void 0 : t;
  }
  /**
  Map this range through a change, producing a valid range in the
  updated document.
  */
  map(t, e = -1) {
    let i, s;
    return this.empty ? i = s = t.mapPos(this.from, e) : (i = t.mapPos(this.from, 1), s = t.mapPos(this.to, -1)), i == this.from && s == this.to ? this : new Re(i, s, this.flags);
  }
  /**
  Extend this range to cover at least `from` to `to`.
  */
  extend(t, e = t) {
    if (t <= this.anchor && e >= this.anchor)
      return y.range(t, e);
    let i = Math.abs(t - this.anchor) > Math.abs(e - this.anchor) ? t : e;
    return y.range(this.anchor, i);
  }
  /**
  Compare this range to another range.
  */
  eq(t) {
    return this.anchor == t.anchor && this.head == t.head;
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
  static fromJSON(t) {
    if (!t || typeof t.anchor != "number" || typeof t.head != "number")
      throw new RangeError("Invalid JSON representation for SelectionRange");
    return y.range(t.anchor, t.head);
  }
  /**
  @internal
  */
  static create(t, e, i) {
    return new Re(t, e, i);
  }
}
class y {
  constructor(t, e) {
    this.ranges = t, this.mainIndex = e;
  }
  /**
  Map a selection through a change. Used to adjust the selection
  position for changes.
  */
  map(t, e = -1) {
    return t.empty ? this : y.create(this.ranges.map((i) => i.map(t, e)), this.mainIndex);
  }
  /**
  Compare this selection to another selection.
  */
  eq(t) {
    if (this.ranges.length != t.ranges.length || this.mainIndex != t.mainIndex)
      return !1;
    for (let e = 0; e < this.ranges.length; e++)
      if (!this.ranges[e].eq(t.ranges[e]))
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
  addRange(t, e = !0) {
    return y.create([t].concat(this.ranges), e ? 0 : this.mainIndex + 1);
  }
  /**
  Replace a given range with another range, and then normalize the
  selection to merge and sort ranges if necessary.
  */
  replaceRange(t, e = this.mainIndex) {
    let i = this.ranges.slice();
    return i[e] = t, y.create(i, this.mainIndex);
  }
  /**
  Convert this selection to an object that can be serialized to
  JSON.
  */
  toJSON() {
    return { ranges: this.ranges.map((t) => t.toJSON()), main: this.mainIndex };
  }
  /**
  Create a selection from a JSON representation.
  */
  static fromJSON(t) {
    if (!t || !Array.isArray(t.ranges) || typeof t.main != "number" || t.main >= t.ranges.length)
      throw new RangeError("Invalid JSON representation for EditorSelection");
    return new y(t.ranges.map((e) => Re.fromJSON(e)), t.main);
  }
  /**
  Create a selection holding a single range.
  */
  static single(t, e = t) {
    return new y([y.range(t, e)], 0);
  }
  /**
  Sort and merge the given set of ranges, creating a valid
  selection.
  */
  static create(t, e = 0) {
    if (t.length == 0)
      throw new RangeError("A selection needs at least one range");
    for (let i = 0, s = 0; s < t.length; s++) {
      let r = t[s];
      if (r.empty ? r.from <= i : r.from < i)
        return y.normalized(t.slice(), e);
      i = r.to;
    }
    return new y(t, e);
  }
  /**
  Create a cursor selection range at the given position. You can
  safely ignore the optional arguments in most situations.
  */
  static cursor(t, e = 0, i, s) {
    return Re.create(t, t, (e == 0 ? 0 : e < 0 ? 4 : 8) | (i == null ? 3 : Math.min(2, i)) | (s ?? 33554431) << 5);
  }
  /**
  Create a selection range.
  */
  static range(t, e, i, s) {
    let r = (i ?? 33554431) << 5 | (s == null ? 3 : Math.min(2, s));
    return e < t ? Re.create(e, t, 24 | r) : Re.create(t, e, (e > t ? 4 : 0) | r);
  }
  /**
  @internal
  */
  static normalized(t, e = 0) {
    let i = t[e];
    t.sort((s, r) => s.from - r.from), e = t.indexOf(i);
    for (let s = 1; s < t.length; s++) {
      let r = t[s], o = t[s - 1];
      if (r.empty ? r.from <= o.to : r.from < o.to) {
        let l = o.from, a = Math.max(r.to, o.to);
        s <= e && e--, t.splice(--s, 2, r.anchor > r.head ? y.range(a, l) : y.range(l, a));
      }
    }
    return new y(t, e);
  }
}
function za(n, t) {
  for (let e of n.ranges)
    if (e.to > t)
      throw new RangeError("Selection points outside of document");
}
let qr = 0;
class A {
  constructor(t, e, i, s, r) {
    this.combine = t, this.compareInput = e, this.compare = i, this.isStatic = s, this.id = qr++, this.default = t([]), this.extensions = typeof r == "function" ? r(this) : r;
  }
  /**
  Define a new facet.
  */
  static define(t = {}) {
    return new A(t.combine || ((e) => e), t.compareInput || ((e, i) => e === i), t.compare || (t.combine ? (e, i) => e === i : _r), !!t.static, t.enables);
  }
  /**
  Returns an extension that adds the given value to this facet.
  */
  of(t) {
    return new Sn([], this, 0, t);
  }
  /**
  Create an extension that computes a value for the facet from a
  state. You must take care to declare the parts of the state that
  this value depends on, since your function is only called again
  for a new state when one of those parts changed.
  
  In cases where your value depends only on a single field, you'll
  want to use the [`from`](https://codemirror.net/6/docs/ref/#state.Facet.from) method instead.
  */
  compute(t, e) {
    if (this.isStatic)
      throw new Error("Can't compute a static facet");
    return new Sn(t, this, 1, e);
  }
  /**
  Create an extension that computes zero or more values for this
  facet from a state.
  */
  computeN(t, e) {
    if (this.isStatic)
      throw new Error("Can't compute a static facet");
    return new Sn(t, this, 2, e);
  }
  from(t, e) {
    return e || (e = (i) => i), this.compute([t], (i) => e(i.field(t)));
  }
}
function _r(n, t) {
  return n == t || n.length == t.length && n.every((e, i) => e === t[i]);
}
class Sn {
  constructor(t, e, i, s) {
    this.dependencies = t, this.facet = e, this.type = i, this.value = s, this.id = qr++;
  }
  dynamicSlot(t) {
    var e;
    let i = this.value, s = this.facet.compareInput, r = this.id, o = t[r] >> 1, l = this.type == 2, a = !1, h = !1, c = [];
    for (let f of this.dependencies)
      f == "doc" ? a = !0 : f == "selection" ? h = !0 : ((e = t[f.id]) !== null && e !== void 0 ? e : 1) & 1 || c.push(t[f.id]);
    return {
      create(f) {
        return f.values[o] = i(f), 1;
      },
      update(f, u) {
        if (a && u.docChanged || h && (u.docChanged || u.selection) || rr(f, c)) {
          let d = i(f);
          if (l ? !Fo(d, f.values[o], s) : !s(d, f.values[o]))
            return f.values[o] = d, 1;
        }
        return 0;
      },
      reconfigure: (f, u) => {
        let d, p = u.config.address[r];
        if (p != null) {
          let g = En(u, p);
          if (this.dependencies.every((m) => m instanceof A ? u.facet(m) === f.facet(m) : m instanceof q ? u.field(m, !1) == f.field(m, !1) : !0) || (l ? Fo(d = i(f), g, s) : s(d = i(f), g)))
            return f.values[o] = g, 0;
        } else
          d = i(f);
        return f.values[o] = d, 1;
      }
    };
  }
}
function Fo(n, t, e) {
  if (n.length != t.length)
    return !1;
  for (let i = 0; i < n.length; i++)
    if (!e(n[i], t[i]))
      return !1;
  return !0;
}
function rr(n, t) {
  let e = !1;
  for (let i of t)
    ki(n, i) & 1 && (e = !0);
  return e;
}
function Mu(n, t, e) {
  let i = e.map((a) => n[a.id]), s = e.map((a) => a.type), r = i.filter((a) => !(a & 1)), o = n[t.id] >> 1;
  function l(a) {
    let h = [];
    for (let c = 0; c < i.length; c++) {
      let f = En(a, i[c]);
      if (s[c] == 2)
        for (let u of f)
          h.push(u);
      else
        h.push(f);
    }
    return t.combine(h);
  }
  return {
    create(a) {
      for (let h of i)
        ki(a, h);
      return a.values[o] = l(a), 1;
    },
    update(a, h) {
      if (!rr(a, r))
        return 0;
      let c = l(a);
      return t.compare(c, a.values[o]) ? 0 : (a.values[o] = c, 1);
    },
    reconfigure(a, h) {
      let c = rr(a, i), f = h.config.facets[t.id], u = h.facet(t);
      if (f && !c && _r(e, f))
        return a.values[o] = u, 0;
      let d = l(a);
      return t.compare(d, u) ? (a.values[o] = u, 0) : (a.values[o] = d, 1);
    }
  };
}
const zo = /* @__PURE__ */ A.define({ static: !0 });
class q {
  constructor(t, e, i, s, r) {
    this.id = t, this.createF = e, this.updateF = i, this.compareF = s, this.spec = r, this.provides = void 0;
  }
  /**
  Define a state field.
  */
  static define(t) {
    let e = new q(qr++, t.create, t.update, t.compare || ((i, s) => i === s), t);
    return t.provide && (e.provides = t.provide(e)), e;
  }
  create(t) {
    let e = t.facet(zo).find((i) => i.field == this);
    return ((e == null ? void 0 : e.create) || this.createF)(t);
  }
  /**
  @internal
  */
  slot(t) {
    let e = t[this.id] >> 1;
    return {
      create: (i) => (i.values[e] = this.create(i), 1),
      update: (i, s) => {
        let r = i.values[e], o = this.updateF(r, s);
        return this.compareF(r, o) ? 0 : (i.values[e] = o, 1);
      },
      reconfigure: (i, s) => s.config.address[this.id] != null ? (i.values[e] = s.field(this), 0) : (i.values[e] = this.create(i), 1)
    };
  }
  /**
  Returns an extension that enables this field and overrides the
  way it is initialized. Can be useful when you need to provide a
  non-default starting value for the field.
  */
  init(t) {
    return [this, zo.of({ field: this, create: t })];
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
const Ae = { lowest: 4, low: 3, default: 2, high: 1, highest: 0 };
function ai(n) {
  return (t) => new Ka(t, n);
}
const ri = {
  /**
  The highest precedence level, for extensions that should end up
  near the start of the precedence ordering.
  */
  highest: /* @__PURE__ */ ai(Ae.highest),
  /**
  A higher-than-default precedence, for extensions that should
  come before those with default precedence.
  */
  high: /* @__PURE__ */ ai(Ae.high),
  /**
  The default precedence, which is also used for extensions
  without an explicit precedence.
  */
  default: /* @__PURE__ */ ai(Ae.default),
  /**
  A lower-than-default precedence.
  */
  low: /* @__PURE__ */ ai(Ae.low),
  /**
  The lowest precedence level. Meant for things that should end up
  near the end of the extension order.
  */
  lowest: /* @__PURE__ */ ai(Ae.lowest)
};
class Ka {
  constructor(t, e) {
    this.inner = t, this.prec = e;
  }
}
class fs {
  /**
  Create an instance of this compartment to add to your [state
  configuration](https://codemirror.net/6/docs/ref/#state.EditorStateConfig.extensions).
  */
  of(t) {
    return new or(this, t);
  }
  /**
  Create an [effect](https://codemirror.net/6/docs/ref/#state.TransactionSpec.effects) that
  reconfigures this compartment.
  */
  reconfigure(t) {
    return fs.reconfigure.of({ compartment: this, extension: t });
  }
  /**
  Get the current content of the compartment in the state, or
  `undefined` if it isn't present.
  */
  get(t) {
    return t.config.compartments.get(this);
  }
}
class or {
  constructor(t, e) {
    this.compartment = t, this.inner = e;
  }
}
class In {
  constructor(t, e, i, s, r, o) {
    for (this.base = t, this.compartments = e, this.dynamicSlots = i, this.address = s, this.staticValues = r, this.facets = o, this.statusTemplate = []; this.statusTemplate.length < i.length; )
      this.statusTemplate.push(
        0
        /* SlotStatus.Unresolved */
      );
  }
  staticFacet(t) {
    let e = this.address[t.id];
    return e == null ? t.default : this.staticValues[e >> 1];
  }
  static resolve(t, e, i) {
    let s = [], r = /* @__PURE__ */ Object.create(null), o = /* @__PURE__ */ new Map();
    for (let u of Ru(t, e, o))
      u instanceof q ? s.push(u) : (r[u.facet.id] || (r[u.facet.id] = [])).push(u);
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
        if (l[p.id] = a.length << 1 | 1, _r(g, d))
          a.push(i.facet(p));
        else {
          let m = p.combine(d.map((b) => b.value));
          a.push(i && p.compare(m, i.facet(p)) ? i.facet(p) : m);
        }
      else {
        for (let m of d)
          m.type == 0 ? (l[m.id] = a.length << 1 | 1, a.push(m.value)) : (l[m.id] = h.length << 1, h.push((b) => m.dynamicSlot(b)));
        l[p.id] = h.length << 1, h.push((m) => Mu(m, p, d));
      }
    }
    let f = h.map((u) => u(l));
    return new In(t, o, f, l, a, r);
  }
}
function Ru(n, t, e) {
  let i = [[], [], [], [], []], s = /* @__PURE__ */ new Map();
  function r(o, l) {
    let a = s.get(o);
    if (a != null) {
      if (a <= l)
        return;
      let h = i[a].indexOf(o);
      h > -1 && i[a].splice(h, 1), o instanceof or && e.delete(o.compartment);
    }
    if (s.set(o, l), Array.isArray(o))
      for (let h of o)
        r(h, l);
    else if (o instanceof or) {
      if (e.has(o.compartment))
        throw new RangeError("Duplicate use of compartment in extensions");
      let h = t.get(o.compartment) || o.inner;
      e.set(o.compartment, h), r(h, l);
    } else if (o instanceof Ka)
      r(o.inner, o.prec);
    else if (o instanceof q)
      i[l].push(o), o.provides && r(o.provides, l);
    else if (o instanceof Sn)
      i[l].push(o), o.facet.extensions && r(o.facet.extensions, Ae.default);
    else {
      let h = o.extension;
      if (!h)
        throw new Error(`Unrecognized extension value in extension set (${o}). This sometimes happens because multiple instances of @codemirror/state are loaded, breaking instanceof checks.`);
      r(h, l);
    }
  }
  return r(n, Ae.default), i.reduce((o, l) => o.concat(l));
}
function ki(n, t) {
  if (t & 1)
    return 2;
  let e = t >> 1, i = n.status[e];
  if (i == 4)
    throw new Error("Cyclic dependency between fields and/or facets");
  if (i & 2)
    return i;
  n.status[e] = 4;
  let s = n.computeSlot(n, n.config.dynamicSlots[e]);
  return n.status[e] = 2 | s;
}
function En(n, t) {
  return t & 1 ? n.config.staticValues[t >> 1] : n.values[t >> 1];
}
const Ya = /* @__PURE__ */ A.define(), Ja = /* @__PURE__ */ A.define({
  combine: (n) => n.some((t) => t),
  static: !0
}), Qa = /* @__PURE__ */ A.define({
  combine: (n) => n.length ? n[0] : void 0,
  static: !0
}), Ua = /* @__PURE__ */ A.define(), $a = /* @__PURE__ */ A.define(), ja = /* @__PURE__ */ A.define(), qa = /* @__PURE__ */ A.define({
  combine: (n) => n.length ? n[0] : !1
});
class re {
  /**
  @internal
  */
  constructor(t, e) {
    this.type = t, this.value = e;
  }
  /**
  Define a new type of annotation.
  */
  static define() {
    return new Zu();
  }
}
class Zu {
  /**
  Create an instance of this annotation.
  */
  of(t) {
    return new re(this, t);
  }
}
class Lu {
  /**
  @internal
  */
  constructor(t) {
    this.map = t;
  }
  /**
  Create a [state effect](https://codemirror.net/6/docs/ref/#state.StateEffect) instance of this
  type.
  */
  of(t) {
    return new L(this, t);
  }
}
class L {
  /**
  @internal
  */
  constructor(t, e) {
    this.type = t, this.value = e;
  }
  /**
  Map this effect through a position mapping. Will return
  `undefined` when that ends up deleting the effect.
  */
  map(t) {
    let e = this.type.map(this.value, t);
    return e === void 0 ? void 0 : e == this.value ? this : new L(this.type, e);
  }
  /**
  Tells you whether this effect object is of a given
  [type](https://codemirror.net/6/docs/ref/#state.StateEffectType).
  */
  is(t) {
    return this.type == t;
  }
  /**
  Define a new effect type. The type parameter indicates the type
  of values that his effect holds. It should be a type that
  doesn't include `undefined`, since that is used in
  [mapping](https://codemirror.net/6/docs/ref/#state.StateEffect.map) to indicate that an effect is
  removed.
  */
  static define(t = {}) {
    return new Lu(t.map || ((e) => e));
  }
  /**
  Map an array of effects through a change set.
  */
  static mapEffects(t, e) {
    if (!t.length)
      return t;
    let i = [];
    for (let s of t) {
      let r = s.map(e);
      r && i.push(r);
    }
    return i;
  }
}
L.reconfigure = /* @__PURE__ */ L.define();
L.appendConfig = /* @__PURE__ */ L.define();
class it {
  constructor(t, e, i, s, r, o) {
    this.startState = t, this.changes = e, this.selection = i, this.effects = s, this.annotations = r, this.scrollIntoView = o, this._doc = null, this._state = null, i && za(i, e.newLength), r.some((l) => l.type == it.time) || (this.annotations = r.concat(it.time.of(Date.now())));
  }
  /**
  @internal
  */
  static create(t, e, i, s, r, o) {
    return new it(t, e, i, s, r, o);
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
  annotation(t) {
    for (let e of this.annotations)
      if (e.type == t)
        return e.value;
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
  isUserEvent(t) {
    let e = this.annotation(it.userEvent);
    return !!(e && (e == t || e.length > t.length && e.slice(0, t.length) == t && e[t.length] == "."));
  }
}
it.time = /* @__PURE__ */ re.define();
it.userEvent = /* @__PURE__ */ re.define();
it.addToHistory = /* @__PURE__ */ re.define();
it.remote = /* @__PURE__ */ re.define();
function Tu(n, t) {
  let e = [];
  for (let i = 0, s = 0; ; ) {
    let r, o;
    if (i < n.length && (s == t.length || t[s] >= n[i]))
      r = n[i++], o = n[i++];
    else if (s < t.length)
      r = t[s++], o = t[s++];
    else
      return e;
    !e.length || e[e.length - 1] < r ? e.push(r, o) : e[e.length - 1] < o && (e[e.length - 1] = o);
  }
}
function _a(n, t, e) {
  var i;
  let s, r, o;
  return e ? (s = t.changes, r = et.empty(t.changes.length), o = n.changes.compose(t.changes)) : (s = t.changes.map(n.changes), r = n.changes.mapDesc(t.changes, !0), o = n.changes.compose(s)), {
    changes: o,
    selection: t.selection ? t.selection.map(r) : (i = n.selection) === null || i === void 0 ? void 0 : i.map(s),
    effects: L.mapEffects(n.effects, s).concat(L.mapEffects(t.effects, r)),
    annotations: n.annotations.length ? n.annotations.concat(t.annotations) : t.annotations,
    scrollIntoView: n.scrollIntoView || t.scrollIntoView
  };
}
function lr(n, t, e) {
  let i = t.selection, s = Ue(t.annotations);
  return t.userEvent && (s = s.concat(it.userEvent.of(t.userEvent))), {
    changes: t.changes instanceof et ? t.changes : et.of(t.changes || [], e, n.facet(Qa)),
    selection: i && (i instanceof y ? i : y.single(i.anchor, i.head)),
    effects: Ue(t.effects),
    annotations: s,
    scrollIntoView: !!t.scrollIntoView
  };
}
function th(n, t, e) {
  let i = lr(n, t.length ? t[0] : {}, n.doc.length);
  t.length && t[0].filter === !1 && (e = !1);
  for (let r = 1; r < t.length; r++) {
    t[r].filter === !1 && (e = !1);
    let o = !!t[r].sequential;
    i = _a(i, lr(n, t[r], o ? i.changes.newLength : n.doc.length), o);
  }
  let s = it.create(n, i.changes, i.selection, i.effects, i.annotations, i.scrollIntoView);
  return Pu(e ? Du(s) : s);
}
function Du(n) {
  let t = n.startState, e = !0;
  for (let s of t.facet(Ua)) {
    let r = s(n);
    if (r === !1) {
      e = !1;
      break;
    }
    Array.isArray(r) && (e = e === !0 ? r : Tu(e, r));
  }
  if (e !== !0) {
    let s, r;
    if (e === !1)
      r = n.changes.invertedDesc, s = et.empty(t.doc.length);
    else {
      let o = n.changes.filter(e);
      s = o.changes, r = o.filtered.mapDesc(o.changes).invertedDesc;
    }
    n = it.create(t, s, n.selection && n.selection.map(r), L.mapEffects(n.effects, r), n.annotations, n.scrollIntoView);
  }
  let i = t.facet($a);
  for (let s = i.length - 1; s >= 0; s--) {
    let r = i[s](n);
    r instanceof it ? n = r : Array.isArray(r) && r.length == 1 && r[0] instanceof it ? n = r[0] : n = th(t, Ue(r), !1);
  }
  return n;
}
function Pu(n) {
  let t = n.startState, e = t.facet(ja), i = n;
  for (let s = e.length - 1; s >= 0; s--) {
    let r = e[s](n);
    r && Object.keys(r).length && (i = _a(i, lr(t, r, n.changes.newLength), !0));
  }
  return i == n ? n : it.create(t, n.changes, n.selection, i.effects, i.annotations, i.scrollIntoView);
}
const Vu = [];
function Ue(n) {
  return n == null ? Vu : Array.isArray(n) ? n : [n];
}
var $ = /* @__PURE__ */ function(n) {
  return n[n.Word = 0] = "Word", n[n.Space = 1] = "Space", n[n.Other = 2] = "Other", n;
}($ || ($ = {}));
const Bu = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
let ar;
try {
  ar = /* @__PURE__ */ new RegExp("[\\p{Alphabetic}\\p{Number}_]", "u");
} catch {
}
function Wu(n) {
  if (ar)
    return ar.test(n);
  for (let t = 0; t < n.length; t++) {
    let e = n[t];
    if (/\w/.test(e) || e > "" && (e.toUpperCase() != e.toLowerCase() || Bu.test(e)))
      return !0;
  }
  return !1;
}
function Xu(n) {
  return (t) => {
    if (!/\S/.test(t))
      return $.Space;
    if (Wu(t))
      return $.Word;
    for (let e = 0; e < n.length; e++)
      if (t.indexOf(n[e]) > -1)
        return $.Word;
    return $.Other;
  };
}
class X {
  constructor(t, e, i, s, r, o) {
    this.config = t, this.doc = e, this.selection = i, this.values = s, this.status = t.statusTemplate.slice(), this.computeSlot = r, o && (o._state = this);
    for (let l = 0; l < this.config.dynamicSlots.length; l++)
      ki(this, l << 1);
    this.computeSlot = null;
  }
  field(t, e = !0) {
    let i = this.config.address[t.id];
    if (i == null) {
      if (e)
        throw new RangeError("Field is not present in this state");
      return;
    }
    return ki(this, i), En(this, i);
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
  update(...t) {
    return th(this, t, !0);
  }
  /**
  @internal
  */
  applyTransaction(t) {
    let e = this.config, { base: i, compartments: s } = e;
    for (let o of t.effects)
      o.is(fs.reconfigure) ? (e && (s = /* @__PURE__ */ new Map(), e.compartments.forEach((l, a) => s.set(a, l)), e = null), s.set(o.value.compartment, o.value.extension)) : o.is(L.reconfigure) ? (e = null, i = o.value) : o.is(L.appendConfig) && (e = null, i = Ue(i).concat(o.value));
    let r;
    e ? r = t.startState.values.slice() : (e = In.resolve(i, s, this), r = new X(e, this.doc, this.selection, e.dynamicSlots.map(() => null), (l, a) => a.reconfigure(l, this), null).values), new X(e, t.newDoc, t.newSelection, r, (o, l) => l.update(o, t), t);
  }
  /**
  Create a [transaction spec](https://codemirror.net/6/docs/ref/#state.TransactionSpec) that
  replaces every selection range with the given content.
  */
  replaceSelection(t) {
    return typeof t == "string" && (t = this.toText(t)), this.changeByRange((e) => ({
      changes: { from: e.from, to: e.to, insert: t },
      range: y.cursor(e.from + t.length)
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
  changeByRange(t) {
    let e = this.selection, i = t(e.ranges[0]), s = this.changes(i.changes), r = [i.range], o = Ue(i.effects);
    for (let l = 1; l < e.ranges.length; l++) {
      let a = t(e.ranges[l]), h = this.changes(a.changes), c = h.map(s);
      for (let u = 0; u < l; u++)
        r[u] = r[u].map(c);
      let f = s.mapDesc(h, !0);
      r.push(a.range.map(f)), s = s.compose(c), o = L.mapEffects(o, c).concat(L.mapEffects(Ue(a.effects), f));
    }
    return {
      changes: s,
      selection: y.create(r, e.mainIndex),
      effects: o
    };
  }
  /**
  Create a [change set](https://codemirror.net/6/docs/ref/#state.ChangeSet) from the given change
  description, taking the state's document length and line
  separator into account.
  */
  changes(t = []) {
    return t instanceof et ? t : et.of(t, this.doc.length, this.facet(X.lineSeparator));
  }
  /**
  Using the state's [line
  separator](https://codemirror.net/6/docs/ref/#state.EditorState^lineSeparator), create a
  [`Text`](https://codemirror.net/6/docs/ref/#state.Text) instance from the given string.
  */
  toText(t) {
    return W.of(t.split(this.facet(X.lineSeparator) || ir));
  }
  /**
  Return the given range of the document as a string.
  */
  sliceDoc(t = 0, e = this.doc.length) {
    return this.doc.sliceString(t, e, this.lineBreak);
  }
  /**
  Get the value of a state [facet](https://codemirror.net/6/docs/ref/#state.Facet).
  */
  facet(t) {
    let e = this.config.address[t.id];
    return e == null ? t.default : (ki(this, e), En(this, e));
  }
  /**
  Convert this state to a JSON-serializable object. When custom
  fields should be serialized, you can pass them in as an object
  mapping property names (in the resulting object, which should
  not use `doc` or `selection`) to fields.
  */
  toJSON(t) {
    let e = {
      doc: this.sliceDoc(),
      selection: this.selection.toJSON()
    };
    if (t)
      for (let i in t) {
        let s = t[i];
        s instanceof q && this.config.address[s.id] != null && (e[i] = s.spec.toJSON(this.field(t[i]), this));
      }
    return e;
  }
  /**
  Deserialize a state from its JSON representation. When custom
  fields should be deserialized, pass the same object you passed
  to [`toJSON`](https://codemirror.net/6/docs/ref/#state.EditorState.toJSON) when serializing as
  third argument.
  */
  static fromJSON(t, e = {}, i) {
    if (!t || typeof t.doc != "string")
      throw new RangeError("Invalid JSON representation for EditorState");
    let s = [];
    if (i) {
      for (let r in i)
        if (Object.prototype.hasOwnProperty.call(t, r)) {
          let o = i[r], l = t[r];
          s.push(o.init((a) => o.spec.fromJSON(l, a)));
        }
    }
    return X.create({
      doc: t.doc,
      selection: y.fromJSON(t.selection),
      extensions: e.extensions ? s.concat([e.extensions]) : s
    });
  }
  /**
  Create a new state. You'll usually only need this when
  initializing an editor—updated states are created by applying
  transactions.
  */
  static create(t = {}) {
    let e = In.resolve(t.extensions || [], /* @__PURE__ */ new Map()), i = t.doc instanceof W ? t.doc : W.of((t.doc || "").split(e.staticFacet(X.lineSeparator) || ir)), s = t.selection ? t.selection instanceof y ? t.selection : y.single(t.selection.anchor, t.selection.head) : y.single(0);
    return za(s, i.length), e.staticFacet(Ja) || (s = s.asSingle()), new X(e, i, s, e.dynamicSlots.map(() => null), (r, o) => o.create(r), null);
  }
  /**
  The size (in columns) of a tab in the document, determined by
  the [`tabSize`](https://codemirror.net/6/docs/ref/#state.EditorState^tabSize) facet.
  */
  get tabSize() {
    return this.facet(X.tabSize);
  }
  /**
  Get the proper [line-break](https://codemirror.net/6/docs/ref/#state.EditorState^lineSeparator)
  string for this state.
  */
  get lineBreak() {
    return this.facet(X.lineSeparator) || `
`;
  }
  /**
  Returns true when the editor is
  [configured](https://codemirror.net/6/docs/ref/#state.EditorState^readOnly) to be read-only.
  */
  get readOnly() {
    return this.facet(qa);
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
  phrase(t, ...e) {
    for (let i of this.facet(X.phrases))
      if (Object.prototype.hasOwnProperty.call(i, t)) {
        t = i[t];
        break;
      }
    return e.length && (t = t.replace(/\$(\$|\d*)/g, (i, s) => {
      if (s == "$")
        return "$";
      let r = +(s || 1);
      return !r || r > e.length ? i : e[r - 1];
    })), t;
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
  languageDataAt(t, e, i = -1) {
    let s = [];
    for (let r of this.facet(Ya))
      for (let o of r(this, e, i))
        Object.prototype.hasOwnProperty.call(o, t) && s.push(o[t]);
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
  charCategorizer(t) {
    return Xu(this.languageDataAt("wordChars", t).join(""));
  }
  /**
  Find the word at the given position, meaning the range
  containing all [word](https://codemirror.net/6/docs/ref/#state.CharCategory.Word) characters
  around it. If no word characters are adjacent to the position,
  this returns null.
  */
  wordAt(t) {
    let { text: e, from: i, length: s } = this.doc.lineAt(t), r = this.charCategorizer(t), o = t - i, l = t - i;
    for (; o > 0; ) {
      let a = ut(e, o, !1);
      if (r(e.slice(a, o)) != $.Word)
        break;
      o = a;
    }
    for (; l < s; ) {
      let a = ut(e, l);
      if (r(e.slice(l, a)) != $.Word)
        break;
      l = a;
    }
    return o == l ? null : y.range(o + i, l + i);
  }
}
X.allowMultipleSelections = Ja;
X.tabSize = /* @__PURE__ */ A.define({
  combine: (n) => n.length ? n[0] : 4
});
X.lineSeparator = Qa;
X.readOnly = qa;
X.phrases = /* @__PURE__ */ A.define({
  compare(n, t) {
    let e = Object.keys(n), i = Object.keys(t);
    return e.length == i.length && e.every((s) => n[s] == t[s]);
  }
});
X.languageData = Ya;
X.changeFilter = Ua;
X.transactionFilter = $a;
X.transactionExtender = ja;
fs.reconfigure = /* @__PURE__ */ L.define();
function qt(n, t, e = {}) {
  let i = {};
  for (let s of n)
    for (let r of Object.keys(s)) {
      let o = s[r], l = i[r];
      if (l === void 0)
        i[r] = o;
      else if (!(l === o || o === void 0))
        if (Object.hasOwnProperty.call(e, r))
          i[r] = e[r](l, o);
        else
          throw new Error("Config merge conflict for field " + r);
    }
  for (let s in t)
    i[s] === void 0 && (i[s] = t[s]);
  return i;
}
class Pe {
  /**
  Compare this value with another value. Used when comparing
  rangesets. The default implementation compares by identity.
  Unless you are only creating a fixed number of unique instances
  of your value type, it is a good idea to implement this
  properly.
  */
  eq(t) {
    return this == t;
  }
  /**
  Create a [range](https://codemirror.net/6/docs/ref/#state.Range) with this value.
  */
  range(t, e = t) {
    return Oi.create(t, e, this);
  }
}
Pe.prototype.startSide = Pe.prototype.endSide = 0;
Pe.prototype.point = !1;
Pe.prototype.mapMode = yt.TrackDel;
class Oi {
  constructor(t, e, i) {
    this.from = t, this.to = e, this.value = i;
  }
  /**
  @internal
  */
  static create(t, e, i) {
    return new Oi(t, e, i);
  }
}
function hr(n, t) {
  return n.from - t.from || n.value.startSide - t.value.startSide;
}
class to {
  constructor(t, e, i, s) {
    this.from = t, this.to = e, this.value = i, this.maxPoint = s;
  }
  get length() {
    return this.to[this.to.length - 1];
  }
  // Find the index of the given position and side. Use the ranges'
  // `from` pos when `end == false`, `to` when `end == true`.
  findIndex(t, e, i, s = 0) {
    let r = i ? this.to : this.from;
    for (let o = s, l = r.length; ; ) {
      if (o == l)
        return o;
      let a = o + l >> 1, h = r[a] - t || (i ? this.value[a].endSide : this.value[a].startSide) - e;
      if (a == o)
        return h >= 0 ? o : l;
      h >= 0 ? l = a : o = a + 1;
    }
  }
  between(t, e, i, s) {
    for (let r = this.findIndex(e, -1e9, !0), o = this.findIndex(i, 1e9, !1, r); r < o; r++)
      if (s(this.from[r] + t, this.to[r] + t, this.value[r]) === !1)
        return !1;
  }
  map(t, e) {
    let i = [], s = [], r = [], o = -1, l = -1;
    for (let a = 0; a < this.value.length; a++) {
      let h = this.value[a], c = this.from[a] + t, f = this.to[a] + t, u, d;
      if (c == f) {
        let p = e.mapPos(c, h.startSide, h.mapMode);
        if (p == null || (u = d = p, h.startSide != h.endSide && (d = e.mapPos(c, h.endSide), d < u)))
          continue;
      } else if (u = e.mapPos(c, h.startSide), d = e.mapPos(f, h.endSide), u > d || u == d && h.startSide > 0 && h.endSide <= 0)
        continue;
      (d - u || h.endSide - h.startSide) < 0 || (o < 0 && (o = u), h.point && (l = Math.max(l, d - u)), i.push(h), s.push(u - o), r.push(d - o));
    }
    return { mapped: i.length ? new to(s, r, i, l) : null, pos: o };
  }
}
class I {
  constructor(t, e, i, s) {
    this.chunkPos = t, this.chunk = e, this.nextLayer = i, this.maxPoint = s;
  }
  /**
  @internal
  */
  static create(t, e, i, s) {
    return new I(t, e, i, s);
  }
  /**
  @internal
  */
  get length() {
    let t = this.chunk.length - 1;
    return t < 0 ? 0 : Math.max(this.chunkEnd(t), this.nextLayer.length);
  }
  /**
  The number of ranges in the set.
  */
  get size() {
    if (this.isEmpty)
      return 0;
    let t = this.nextLayer.size;
    for (let e of this.chunk)
      t += e.value.length;
    return t;
  }
  /**
  @internal
  */
  chunkEnd(t) {
    return this.chunkPos[t] + this.chunk[t].length;
  }
  /**
  Update the range set, optionally adding new ranges or filtering
  out existing ones.
  
  (Note: The type parameter is just there as a kludge to work
  around TypeScript variance issues that prevented `RangeSet<X>`
  from being a subtype of `RangeSet<Y>` when `X` is a subtype of
  `Y`.)
  */
  update(t) {
    let { add: e = [], sort: i = !1, filterFrom: s = 0, filterTo: r = this.length } = t, o = t.filter;
    if (e.length == 0 && !o)
      return this;
    if (i && (e = e.slice().sort(hr)), this.isEmpty)
      return e.length ? I.of(e) : this;
    let l = new eh(this, null, -1).goto(0), a = 0, h = [], c = new me();
    for (; l.value || a < e.length; )
      if (a < e.length && (l.from - e[a].from || l.startSide - e[a].value.startSide) >= 0) {
        let f = e[a++];
        c.addInner(f.from, f.to, f.value) || h.push(f);
      } else
        l.rangeIndex == 1 && l.chunkIndex < this.chunk.length && (a == e.length || this.chunkEnd(l.chunkIndex) < e[a].from) && (!o || s > this.chunkEnd(l.chunkIndex) || r < this.chunkPos[l.chunkIndex]) && c.addChunk(this.chunkPos[l.chunkIndex], this.chunk[l.chunkIndex]) ? l.nextChunk() : ((!o || s > l.to || r < l.from || o(l.from, l.to, l.value)) && (c.addInner(l.from, l.to, l.value) || h.push(Oi.create(l.from, l.to, l.value))), l.next());
    return c.finishInner(this.nextLayer.isEmpty && !h.length ? I.empty : this.nextLayer.update({ add: h, filter: o, filterFrom: s, filterTo: r }));
  }
  /**
  Map this range set through a set of changes, return the new set.
  */
  map(t) {
    if (t.empty || this.isEmpty)
      return this;
    let e = [], i = [], s = -1;
    for (let o = 0; o < this.chunk.length; o++) {
      let l = this.chunkPos[o], a = this.chunk[o], h = t.touchesRange(l, l + a.length);
      if (h === !1)
        s = Math.max(s, a.maxPoint), e.push(a), i.push(t.mapPos(l));
      else if (h === !0) {
        let { mapped: c, pos: f } = a.map(l, t);
        c && (s = Math.max(s, c.maxPoint), e.push(c), i.push(f));
      }
    }
    let r = this.nextLayer.map(t);
    return e.length == 0 ? r : new I(i, e, r || I.empty, s);
  }
  /**
  Iterate over the ranges that touch the region `from` to `to`,
  calling `f` for each. There is no guarantee that the ranges will
  be reported in any specific order. When the callback returns
  `false`, iteration stops.
  */
  between(t, e, i) {
    if (!this.isEmpty) {
      for (let s = 0; s < this.chunk.length; s++) {
        let r = this.chunkPos[s], o = this.chunk[s];
        if (e >= r && t <= r + o.length && o.between(r, t - r, e - r, i) === !1)
          return;
      }
      this.nextLayer.between(t, e, i);
    }
  }
  /**
  Iterate over the ranges in this set, in order, including all
  ranges that end at or after `from`.
  */
  iter(t = 0) {
    return Ai.from([this]).goto(t);
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
  static iter(t, e = 0) {
    return Ai.from(t).goto(e);
  }
  /**
  Iterate over two groups of sets, calling methods on `comparator`
  to notify it of possible differences.
  */
  static compare(t, e, i, s, r = -1) {
    let o = t.filter((f) => f.maxPoint > 0 || !f.isEmpty && f.maxPoint >= r), l = e.filter((f) => f.maxPoint > 0 || !f.isEmpty && f.maxPoint >= r), a = Ko(o, l, i), h = new hi(o, a, r), c = new hi(l, a, r);
    i.iterGaps((f, u, d) => Yo(h, f, c, u, d, s)), i.empty && i.length == 0 && Yo(h, 0, c, 0, 0, s);
  }
  /**
  Compare the contents of two groups of range sets, returning true
  if they are equivalent in the given range.
  */
  static eq(t, e, i = 0, s) {
    s == null && (s = 1e9 - 1);
    let r = t.filter((c) => !c.isEmpty && e.indexOf(c) < 0), o = e.filter((c) => !c.isEmpty && t.indexOf(c) < 0);
    if (r.length != o.length)
      return !1;
    if (!r.length)
      return !0;
    let l = Ko(r, o), a = new hi(r, l, 0).goto(i), h = new hi(o, l, 0).goto(i);
    for (; ; ) {
      if (a.to != h.to || !cr(a.active, h.active) || a.point && (!h.point || !a.point.eq(h.point)))
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
  static spans(t, e, i, s, r = -1) {
    let o = new hi(t, null, r).goto(e), l = e, a = o.openStart;
    for (; ; ) {
      let h = Math.min(o.to, i);
      if (o.point) {
        let c = o.activeForPoint(o.to), f = o.pointFrom < e ? c.length + 1 : Math.min(c.length, a);
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
  static of(t, e = !1) {
    let i = new me();
    for (let s of t instanceof Oi ? [t] : e ? Iu(t) : t)
      i.add(s.from, s.to, s.value);
    return i.finish();
  }
}
I.empty = /* @__PURE__ */ new I([], [], null, -1);
function Iu(n) {
  if (n.length > 1)
    for (let t = n[0], e = 1; e < n.length; e++) {
      let i = n[e];
      if (hr(t, i) > 0)
        return n.slice().sort(hr);
      t = i;
    }
  return n;
}
I.empty.nextLayer = I.empty;
class me {
  finishChunk(t) {
    this.chunks.push(new to(this.from, this.to, this.value, this.maxPoint)), this.chunkPos.push(this.chunkStart), this.chunkStart = -1, this.setMaxPoint = Math.max(this.setMaxPoint, this.maxPoint), this.maxPoint = -1, t && (this.from = [], this.to = [], this.value = []);
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
  add(t, e, i) {
    this.addInner(t, e, i) || (this.nextLayer || (this.nextLayer = new me())).add(t, e, i);
  }
  /**
  @internal
  */
  addInner(t, e, i) {
    let s = t - this.lastTo || i.startSide - this.last.endSide;
    if (s <= 0 && (t - this.lastFrom || i.startSide - this.last.startSide) < 0)
      throw new Error("Ranges must be added sorted by `from` position and `startSide`");
    return s < 0 ? !1 : (this.from.length == 250 && this.finishChunk(!0), this.chunkStart < 0 && (this.chunkStart = t), this.from.push(t - this.chunkStart), this.to.push(e - this.chunkStart), this.last = i, this.lastFrom = t, this.lastTo = e, this.value.push(i), i.point && (this.maxPoint = Math.max(this.maxPoint, e - t)), !0);
  }
  /**
  @internal
  */
  addChunk(t, e) {
    if ((t - this.lastTo || e.value[0].startSide - this.last.endSide) < 0)
      return !1;
    this.from.length && this.finishChunk(!0), this.setMaxPoint = Math.max(this.setMaxPoint, e.maxPoint), this.chunks.push(e), this.chunkPos.push(t);
    let i = e.value.length - 1;
    return this.last = e.value[i], this.lastFrom = e.from[i] + t, this.lastTo = e.to[i] + t, !0;
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
  finishInner(t) {
    if (this.from.length && this.finishChunk(!1), this.chunks.length == 0)
      return t;
    let e = I.create(this.chunkPos, this.chunks, this.nextLayer ? this.nextLayer.finishInner(t) : t, this.setMaxPoint);
    return this.from = null, e;
  }
}
function Ko(n, t, e) {
  let i = /* @__PURE__ */ new Map();
  for (let r of n)
    for (let o = 0; o < r.chunk.length; o++)
      r.chunk[o].maxPoint <= 0 && i.set(r.chunk[o], r.chunkPos[o]);
  let s = /* @__PURE__ */ new Set();
  for (let r of t)
    for (let o = 0; o < r.chunk.length; o++) {
      let l = i.get(r.chunk[o]);
      l != null && (e ? e.mapPos(l) : l) == r.chunkPos[o] && !(e != null && e.touchesRange(l, l + r.chunk[o].length)) && s.add(r.chunk[o]);
    }
  return s;
}
class eh {
  constructor(t, e, i, s = 0) {
    this.layer = t, this.skip = e, this.minPoint = i, this.rank = s;
  }
  get startSide() {
    return this.value ? this.value.startSide : 0;
  }
  get endSide() {
    return this.value ? this.value.endSide : 0;
  }
  goto(t, e = -1e9) {
    return this.chunkIndex = this.rangeIndex = 0, this.gotoInner(t, e, !1), this;
  }
  gotoInner(t, e, i) {
    for (; this.chunkIndex < this.layer.chunk.length; ) {
      let s = this.layer.chunk[this.chunkIndex];
      if (!(this.skip && this.skip.has(s) || this.layer.chunkEnd(this.chunkIndex) < t || s.maxPoint < this.minPoint))
        break;
      this.chunkIndex++, i = !1;
    }
    if (this.chunkIndex < this.layer.chunk.length) {
      let s = this.layer.chunk[this.chunkIndex].findIndex(t - this.layer.chunkPos[this.chunkIndex], e, !0);
      (!i || this.rangeIndex < s) && this.setRangeIndex(s);
    }
    this.next();
  }
  forward(t, e) {
    (this.to - t || this.endSide - e) < 0 && this.gotoInner(t, e, !0);
  }
  next() {
    for (; ; )
      if (this.chunkIndex == this.layer.chunk.length) {
        this.from = this.to = 1e9, this.value = null;
        break;
      } else {
        let t = this.layer.chunkPos[this.chunkIndex], e = this.layer.chunk[this.chunkIndex], i = t + e.from[this.rangeIndex];
        if (this.from = i, this.to = t + e.to[this.rangeIndex], this.value = e.value[this.rangeIndex], this.setRangeIndex(this.rangeIndex + 1), this.minPoint < 0 || this.value.point && this.to - this.from >= this.minPoint)
          break;
      }
  }
  setRangeIndex(t) {
    if (t == this.layer.chunk[this.chunkIndex].value.length) {
      if (this.chunkIndex++, this.skip)
        for (; this.chunkIndex < this.layer.chunk.length && this.skip.has(this.layer.chunk[this.chunkIndex]); )
          this.chunkIndex++;
      this.rangeIndex = 0;
    } else
      this.rangeIndex = t;
  }
  nextChunk() {
    this.chunkIndex++, this.rangeIndex = 0, this.next();
  }
  compare(t) {
    return this.from - t.from || this.startSide - t.startSide || this.rank - t.rank || this.to - t.to || this.endSide - t.endSide;
  }
}
class Ai {
  constructor(t) {
    this.heap = t;
  }
  static from(t, e = null, i = -1) {
    let s = [];
    for (let r = 0; r < t.length; r++)
      for (let o = t[r]; !o.isEmpty; o = o.nextLayer)
        o.maxPoint >= i && s.push(new eh(o, e, i, r));
    return s.length == 1 ? s[0] : new Ai(s);
  }
  get startSide() {
    return this.value ? this.value.startSide : 0;
  }
  goto(t, e = -1e9) {
    for (let i of this.heap)
      i.goto(t, e);
    for (let i = this.heap.length >> 1; i >= 0; i--)
      Zs(this.heap, i);
    return this.next(), this;
  }
  forward(t, e) {
    for (let i of this.heap)
      i.forward(t, e);
    for (let i = this.heap.length >> 1; i >= 0; i--)
      Zs(this.heap, i);
    (this.to - t || this.value.endSide - e) < 0 && this.next();
  }
  next() {
    if (this.heap.length == 0)
      this.from = this.to = 1e9, this.value = null, this.rank = -1;
    else {
      let t = this.heap[0];
      this.from = t.from, this.to = t.to, this.value = t.value, this.rank = t.rank, t.value && t.next(), Zs(this.heap, 0);
    }
  }
}
function Zs(n, t) {
  for (let e = n[t]; ; ) {
    let i = (t << 1) + 1;
    if (i >= n.length)
      break;
    let s = n[i];
    if (i + 1 < n.length && s.compare(n[i + 1]) >= 0 && (s = n[i + 1], i++), e.compare(s) < 0)
      break;
    n[i] = e, n[t] = s, t = i;
  }
}
class hi {
  constructor(t, e, i) {
    this.minPoint = i, this.active = [], this.activeTo = [], this.activeRank = [], this.minActive = -1, this.point = null, this.pointFrom = 0, this.pointRank = 0, this.to = -1e9, this.endSide = 0, this.openStart = -1, this.cursor = Ai.from(t, e, i);
  }
  goto(t, e = -1e9) {
    return this.cursor.goto(t, e), this.active.length = this.activeTo.length = this.activeRank.length = 0, this.minActive = -1, this.to = t, this.endSide = e, this.openStart = -1, this.next(), this;
  }
  forward(t, e) {
    for (; this.minActive > -1 && (this.activeTo[this.minActive] - t || this.active[this.minActive].endSide - e) < 0; )
      this.removeActive(this.minActive);
    this.cursor.forward(t, e);
  }
  removeActive(t) {
    qi(this.active, t), qi(this.activeTo, t), qi(this.activeRank, t), this.minActive = Jo(this.active, this.activeTo);
  }
  addActive(t) {
    let e = 0, { value: i, to: s, rank: r } = this.cursor;
    for (; e < this.activeRank.length && this.activeRank[e] <= r; )
      e++;
    _i(this.active, e, i), _i(this.activeTo, e, s), _i(this.activeRank, e, r), t && _i(t, e, this.cursor.from), this.minActive = Jo(this.active, this.activeTo);
  }
  // After calling this, if `this.point` != null, the next range is a
  // point. Otherwise, it's a regular range, covered by `this.active`.
  next() {
    let t = this.to, e = this.point;
    this.point = null;
    let i = this.openStart < 0 ? [] : null;
    for (; ; ) {
      let s = this.minActive;
      if (s > -1 && (this.activeTo[s] - this.cursor.from || this.active[s].endSide - this.cursor.startSide) < 0) {
        if (this.activeTo[s] > t) {
          this.to = this.activeTo[s], this.endSide = this.active[s].endSide;
          break;
        }
        this.removeActive(s), i && qi(i, s);
      } else if (this.cursor.value)
        if (this.cursor.from > t) {
          this.to = this.cursor.from, this.endSide = this.cursor.startSide;
          break;
        } else {
          let r = this.cursor.value;
          if (!r.point)
            this.addActive(i), this.cursor.next();
          else if (e && this.cursor.to == this.to && this.cursor.from < this.cursor.to)
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
      for (let s = i.length - 1; s >= 0 && i[s] < t; s--)
        this.openStart++;
    }
  }
  activeForPoint(t) {
    if (!this.active.length)
      return this.active;
    let e = [];
    for (let i = this.active.length - 1; i >= 0 && !(this.activeRank[i] < this.pointRank); i--)
      (this.activeTo[i] > t || this.activeTo[i] == t && this.active[i].endSide >= this.point.endSide) && e.push(this.active[i]);
    return e.reverse();
  }
  openEnd(t) {
    let e = 0;
    for (let i = this.activeTo.length - 1; i >= 0 && this.activeTo[i] > t; i--)
      e++;
    return e;
  }
}
function Yo(n, t, e, i, s, r) {
  n.goto(t), e.goto(i);
  let o = i + s, l = i, a = i - t;
  for (; ; ) {
    let h = n.to + a - e.to || n.endSide - e.endSide, c = h < 0 ? n.to + a : e.to, f = Math.min(c, o);
    if (n.point || e.point ? n.point && e.point && (n.point == e.point || n.point.eq(e.point)) && cr(n.activeForPoint(n.to), e.activeForPoint(e.to)) || r.comparePoint(l, f, n.point, e.point) : f > l && !cr(n.active, e.active) && r.compareRange(l, f, n.active, e.active), c > o)
      break;
    l = c, h <= 0 && n.next(), h >= 0 && e.next();
  }
}
function cr(n, t) {
  if (n.length != t.length)
    return !1;
  for (let e = 0; e < n.length; e++)
    if (n[e] != t[e] && !n[e].eq(t[e]))
      return !1;
  return !0;
}
function qi(n, t) {
  for (let e = t, i = n.length - 1; e < i; e++)
    n[e] = n[e + 1];
  n.pop();
}
function _i(n, t, e) {
  for (let i = n.length - 1; i >= t; i--)
    n[i + 1] = n[i];
  n[t] = e;
}
function Jo(n, t) {
  let e = -1, i = 1e9;
  for (let s = 0; s < t.length; s++)
    (t[s] - i || n[s].endSide - n[e].endSide) < 0 && (e = s, i = t[s]);
  return e;
}
function Ni(n, t, e = n.length) {
  let i = 0;
  for (let s = 0; s < e; )
    n.charCodeAt(s) == 9 ? (i += t - i % t, s++) : (i++, s = ut(n, s));
  return i;
}
function Eu(n, t, e, i) {
  for (let s = 0, r = 0; ; ) {
    if (r >= t)
      return s;
    if (s == n.length)
      break;
    r += n.charCodeAt(s) == 9 ? e - r % e : 1, s = ut(n, s);
  }
  return i === !0 ? -1 : n.length;
}
const fr = "ͼ", Qo = typeof Symbol > "u" ? "__" + fr : Symbol.for(fr), ur = typeof Symbol > "u" ? "__styleSet" + Math.floor(Math.random() * 1e8) : Symbol("styleSet"), Uo = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : {};
class ge {
  // :: (Object<Style>, ?{finish: ?(string) → string})
  // Create a style module from the given spec.
  //
  // When `finish` is given, it is called on regular (non-`@`)
  // selectors (after `&` expansion) to compute the final selector.
  constructor(t, e) {
    this.rules = [];
    let { finish: i } = e || {};
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
    for (let o in t)
      r(s(o), t[o], this.rules);
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
    let t = Uo[Qo] || 1;
    return Uo[Qo] = t + 1, fr + t.toString(36);
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
  static mount(t, e, i) {
    let s = t[ur], r = i && i.nonce;
    s ? r && s.setNonce(r) : s = new Nu(t, r), s.mount(Array.isArray(e) ? e : [e]);
  }
}
let $o = /* @__PURE__ */ new Map();
class Nu {
  constructor(t, e) {
    let i = t.ownerDocument || t, s = i.defaultView;
    if (!t.head && t.adoptedStyleSheets && s.CSSStyleSheet) {
      let r = $o.get(i);
      if (r)
        return t.adoptedStyleSheets = [r.sheet, ...t.adoptedStyleSheets], t[ur] = r;
      this.sheet = new s.CSSStyleSheet(), t.adoptedStyleSheets = [this.sheet, ...t.adoptedStyleSheets], $o.set(i, this);
    } else {
      this.styleTag = i.createElement("style"), e && this.styleTag.setAttribute("nonce", e);
      let r = t.head || t;
      r.insertBefore(this.styleTag, r.firstChild);
    }
    this.modules = [], t[ur] = this;
  }
  mount(t) {
    let e = this.sheet, i = 0, s = 0;
    for (let r = 0; r < t.length; r++) {
      let o = t[r], l = this.modules.indexOf(o);
      if (l < s && l > -1 && (this.modules.splice(l, 1), s--, l = -1), l == -1) {
        if (this.modules.splice(s++, 0, o), e)
          for (let a = 0; a < o.rules.length; a++)
            e.insertRule(o.rules[a], i++);
      } else {
        for (; s < l; )
          i += this.modules[s++].rules.length;
        i += o.rules.length, s++;
      }
    }
    if (!e) {
      let r = "";
      for (let o = 0; o < this.modules.length; o++)
        r += this.modules[o].getRules() + `
`;
      this.styleTag.textContent = r;
    }
  }
  setNonce(t) {
    this.styleTag && this.styleTag.getAttribute("nonce") != t && this.styleTag.setAttribute("nonce", t);
  }
}
var be = {
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
}, Mi = {
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
}, Gu = typeof navigator < "u" && /Mac/.test(navigator.platform), Hu = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
for (var at = 0; at < 10; at++)
  be[48 + at] = be[96 + at] = String(at);
for (var at = 1; at <= 24; at++)
  be[at + 111] = "F" + at;
for (var at = 65; at <= 90; at++)
  be[at] = String.fromCharCode(at + 32), Mi[at] = String.fromCharCode(at);
for (var Ls in be)
  Mi.hasOwnProperty(Ls) || (Mi[Ls] = be[Ls]);
function Fu(n) {
  var t = Gu && n.metaKey && n.shiftKey && !n.ctrlKey && !n.altKey || Hu && n.shiftKey && n.key && n.key.length == 1 || n.key == "Unidentified", e = !t && n.key || (n.shiftKey ? Mi : be)[n.keyCode] || n.key || "Unidentified";
  return e == "Esc" && (e = "Escape"), e == "Del" && (e = "Delete"), e == "Left" && (e = "ArrowLeft"), e == "Up" && (e = "ArrowUp"), e == "Right" && (e = "ArrowRight"), e == "Down" && (e = "ArrowDown"), e;
}
function Nn(n) {
  let t;
  return n.nodeType == 11 ? t = n.getSelection ? n : n.ownerDocument : t = n, t.getSelection();
}
function dr(n, t) {
  return t ? n == t || n.contains(t.nodeType != 1 ? t.parentNode : t) : !1;
}
function zu(n) {
  let t = n.activeElement;
  for (; t && t.shadowRoot; )
    t = t.shadowRoot.activeElement;
  return t;
}
function vn(n, t) {
  if (!t.anchorNode)
    return !1;
  try {
    return dr(n, t.anchorNode);
  } catch {
    return !1;
  }
}
function Ri(n) {
  return n.nodeType == 3 ? Ve(n, 0, n.nodeValue.length).getClientRects() : n.nodeType == 1 ? n.getClientRects() : [];
}
function Gn(n, t, e, i) {
  return e ? jo(n, t, e, i, -1) || jo(n, t, e, i, 1) : !1;
}
function Hn(n) {
  for (var t = 0; ; t++)
    if (n = n.previousSibling, !n)
      return t;
}
function jo(n, t, e, i, s) {
  for (; ; ) {
    if (n == e && t == i)
      return !0;
    if (t == (s < 0 ? 0 : ye(n))) {
      if (n.nodeName == "DIV")
        return !1;
      let r = n.parentNode;
      if (!r || r.nodeType != 1)
        return !1;
      t = Hn(n) + (s < 0 ? 0 : 1), n = r;
    } else if (n.nodeType == 1) {
      if (n = n.childNodes[t + (s < 0 ? -1 : 0)], n.nodeType == 1 && n.contentEditable == "false")
        return !1;
      t = s < 0 ? ye(n) : 0;
    } else
      return !1;
  }
}
function ye(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function eo(n, t) {
  let e = t ? n.left : n.right;
  return { left: e, right: e, top: n.top, bottom: n.bottom };
}
function Ku(n) {
  return {
    left: 0,
    right: n.innerWidth,
    top: 0,
    bottom: n.innerHeight
  };
}
function Yu(n, t, e, i, s, r, o, l) {
  let a = n.ownerDocument, h = a.defaultView || window;
  for (let c = n, f = !1; c && !f; )
    if (c.nodeType == 1) {
      let u, d = c == a.body, p = 1, g = 1;
      if (d)
        u = Ku(h);
      else {
        if (/^(fixed|sticky)$/.test(getComputedStyle(c).position) && (f = !0), c.scrollHeight <= c.clientHeight && c.scrollWidth <= c.clientWidth) {
          c = c.assignedSlot || c.parentNode;
          continue;
        }
        let v = c.getBoundingClientRect();
        p = v.width / c.offsetWidth, g = v.height / c.offsetHeight, u = {
          left: v.left,
          right: v.left + c.clientWidth * p,
          top: v.top,
          bottom: v.top + c.clientHeight * g
        };
      }
      let m = 0, b = 0;
      if (s == "nearest")
        t.top < u.top ? (b = -(u.top - t.top + o), e > 0 && t.bottom > u.bottom + b && (b = t.bottom - u.bottom + b + o)) : t.bottom > u.bottom && (b = t.bottom - u.bottom + o, e < 0 && t.top - b < u.top && (b = -(u.top + b - t.top + o)));
      else {
        let v = t.bottom - t.top, O = u.bottom - u.top;
        b = (s == "center" && v <= O ? t.top + v / 2 - O / 2 : s == "start" || s == "center" && e < 0 ? t.top - o : t.bottom - O + o) - u.top;
      }
      if (i == "nearest" ? t.left < u.left ? (m = -(u.left - t.left + r), e > 0 && t.right > u.right + m && (m = t.right - u.right + m + r)) : t.right > u.right && (m = t.right - u.right + r, e < 0 && t.left < u.left + m && (m = -(u.left + m - t.left + r))) : m = (i == "center" ? t.left + (t.right - t.left) / 2 - (u.right - u.left) / 2 : i == "start" == l ? t.left - r : t.right - (u.right - u.left) + r) - u.left, m || b)
        if (d)
          h.scrollBy(m, b);
        else {
          let v = 0, O = 0;
          if (b) {
            let k = c.scrollTop;
            c.scrollTop += b / g, O = (c.scrollTop - k) * g;
          }
          if (m) {
            let k = c.scrollLeft;
            c.scrollLeft += m / p, v = (c.scrollLeft - k) * p;
          }
          t = {
            left: t.left - v,
            top: t.top - O,
            right: t.right - v,
            bottom: t.bottom - O
          }, v && Math.abs(v - m) < 1 && (i = "nearest"), O && Math.abs(O - b) < 1 && (s = "nearest");
        }
      if (d)
        break;
      c = c.assignedSlot || c.parentNode;
    } else if (c.nodeType == 11)
      c = c.host;
    else
      break;
}
function Ju(n) {
  let t = n.ownerDocument;
  for (let e = n.parentNode; e && e != t.body; )
    if (e.nodeType == 1) {
      if (e.scrollHeight > e.clientHeight || e.scrollWidth > e.clientWidth)
        return e;
      e = e.assignedSlot || e.parentNode;
    } else if (e.nodeType == 11)
      e = e.host;
    else
      break;
  return null;
}
class Qu {
  constructor() {
    this.anchorNode = null, this.anchorOffset = 0, this.focusNode = null, this.focusOffset = 0;
  }
  eq(t) {
    return this.anchorNode == t.anchorNode && this.anchorOffset == t.anchorOffset && this.focusNode == t.focusNode && this.focusOffset == t.focusOffset;
  }
  setRange(t) {
    let { anchorNode: e, focusNode: i } = t;
    this.set(e, Math.min(t.anchorOffset, e ? ye(e) : 0), i, Math.min(t.focusOffset, i ? ye(i) : 0));
  }
  set(t, e, i, s) {
    this.anchorNode = t, this.anchorOffset = e, this.focusNode = i, this.focusOffset = s;
  }
}
let Ee = null;
function ih(n) {
  if (n.setActive)
    return n.setActive();
  if (Ee)
    return n.focus(Ee);
  let t = [];
  for (let e = n; e && (t.push(e, e.scrollTop, e.scrollLeft), e != e.ownerDocument); e = e.parentNode)
    ;
  if (n.focus(Ee == null ? {
    get preventScroll() {
      return Ee = { preventScroll: !0 }, !0;
    }
  } : void 0), !Ee) {
    Ee = !1;
    for (let e = 0; e < t.length; ) {
      let i = t[e++], s = t[e++], r = t[e++];
      i.scrollTop != s && (i.scrollTop = s), i.scrollLeft != r && (i.scrollLeft = r);
    }
  }
}
let qo;
function Ve(n, t, e = t) {
  let i = qo || (qo = document.createRange());
  return i.setEnd(n, e), i.setStart(n, t), i;
}
function $e(n, t, e) {
  let i = { key: t, code: t, keyCode: e, which: e, cancelable: !0 }, s = new KeyboardEvent("keydown", i);
  s.synthetic = !0, n.dispatchEvent(s);
  let r = new KeyboardEvent("keyup", i);
  return r.synthetic = !0, n.dispatchEvent(r), s.defaultPrevented || r.defaultPrevented;
}
function Uu(n) {
  for (; n; ) {
    if (n && (n.nodeType == 9 || n.nodeType == 11 && n.host))
      return n;
    n = n.assignedSlot || n.parentNode;
  }
  return null;
}
function nh(n) {
  for (; n.attributes.length; )
    n.removeAttributeNode(n.attributes[0]);
}
function $u(n, t) {
  let e = t.focusNode, i = t.focusOffset;
  if (!e || t.anchorNode != e || t.anchorOffset != i)
    return !1;
  for (i = Math.min(i, ye(e)); ; )
    if (i) {
      if (e.nodeType != 1)
        return !1;
      let s = e.childNodes[i - 1];
      s.contentEditable == "false" ? i-- : (e = s, i = ye(e));
    } else {
      if (e == n)
        return !0;
      i = Hn(e), e = e.parentNode;
    }
}
function sh(n) {
  return n.scrollTop > Math.max(1, n.scrollHeight - n.clientHeight - 4);
}
class xt {
  constructor(t, e, i = !0) {
    this.node = t, this.offset = e, this.precise = i;
  }
  static before(t, e) {
    return new xt(t.parentNode, Hn(t), e);
  }
  static after(t, e) {
    return new xt(t.parentNode, Hn(t) + 1, e);
  }
}
const io = [];
class G {
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
  posBefore(t) {
    let e = this.posAtStart;
    for (let i of this.children) {
      if (i == t)
        return e;
      e += i.length + i.breakAfter;
    }
    throw new RangeError("Invalid child in posBefore");
  }
  posAfter(t) {
    return this.posBefore(t) + t.length;
  }
  sync(t, e) {
    if (this.flags & 2) {
      let i = this.dom, s = null, r;
      for (let o of this.children) {
        if (o.flags & 7) {
          if (!o.dom && (r = s ? s.nextSibling : i.firstChild)) {
            let l = G.get(r);
            (!l || !l.parent && l.canReuseDOM(o)) && o.reuseDOM(r);
          }
          o.sync(t, e), o.flags &= -8;
        }
        if (r = s ? s.nextSibling : i.firstChild, e && !e.written && e.node == i && r != o.dom && (e.written = !0), o.dom.parentNode == i)
          for (; r && r != o.dom; )
            r = _o(r);
        else
          i.insertBefore(o.dom, r);
        s = o.dom;
      }
      for (r = s ? s.nextSibling : i.firstChild, r && e && e.node == i && (e.written = !0); r; )
        r = _o(r);
    } else if (this.flags & 1)
      for (let i of this.children)
        i.flags & 7 && (i.sync(t, e), i.flags &= -8);
  }
  reuseDOM(t) {
  }
  localPosFromDOM(t, e) {
    let i;
    if (t == this.dom)
      i = this.dom.childNodes[e];
    else {
      let s = ye(t) == 0 ? 0 : e == 0 ? -1 : 1;
      for (; ; ) {
        let r = t.parentNode;
        if (r == this.dom)
          break;
        s == 0 && r.firstChild != r.lastChild && (t == r.firstChild ? s = -1 : s = 1), t = r;
      }
      s < 0 ? i = t : i = t.nextSibling;
    }
    if (i == this.dom.firstChild)
      return 0;
    for (; i && !G.get(i); )
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
  domBoundsAround(t, e, i = 0) {
    let s = -1, r = -1, o = -1, l = -1;
    for (let a = 0, h = i, c = i; a < this.children.length; a++) {
      let f = this.children[a], u = h + f.length;
      if (h < t && u > e)
        return f.domBoundsAround(t, e, h);
      if (u >= t && s == -1 && (s = a, r = h), h > e && f.dom.parentNode == this.dom) {
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
  markDirty(t = !1) {
    this.flags |= 2, this.markParentsDirty(t);
  }
  markParentsDirty(t) {
    for (let e = this.parent; e; e = e.parent) {
      if (t && (e.flags |= 2), e.flags & 1)
        return;
      e.flags |= 1, t = !1;
    }
  }
  setParent(t) {
    this.parent != t && (this.parent = t, this.flags & 7 && this.markParentsDirty(!0));
  }
  setDOM(t) {
    this.dom && (this.dom.cmView = null), this.dom = t, t.cmView = this;
  }
  get rootView() {
    for (let t = this; ; ) {
      let e = t.parent;
      if (!e)
        return t;
      t = e;
    }
  }
  replaceChildren(t, e, i = io) {
    this.markDirty();
    for (let s = t; s < e; s++) {
      let r = this.children[s];
      r.parent == this && r.destroy();
    }
    this.children.splice(t, e - t, ...i);
    for (let s = 0; s < i.length; s++)
      i[s].setParent(this);
  }
  ignoreMutation(t) {
    return !1;
  }
  ignoreEvent(t) {
    return !1;
  }
  childCursor(t = this.length) {
    return new rh(this.children, t, this.children.length);
  }
  childPos(t, e = 1) {
    return this.childCursor().findPos(t, e);
  }
  toString() {
    let t = this.constructor.name.replace("View", "");
    return t + (this.children.length ? "(" + this.children.join() + ")" : this.length ? "[" + (t == "Text" ? this.text : this.length) + "]" : "") + (this.breakAfter ? "#" : "");
  }
  static get(t) {
    return t.cmView;
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
  merge(t, e, i, s, r, o) {
    return !1;
  }
  become(t) {
    return !1;
  }
  canReuseDOM(t) {
    return t.constructor == this.constructor && !((this.flags | t.flags) & 8);
  }
  // When this is a zero-length view with a side, this should return a
  // number <= 0 to indicate it is before its position, or a
  // number > 0 when after its position.
  getSide() {
    return 0;
  }
  destroy() {
    this.parent = null;
  }
}
G.prototype.breakAfter = 0;
function _o(n) {
  let t = n.nextSibling;
  return n.parentNode.removeChild(n), t;
}
class rh {
  constructor(t, e, i) {
    this.children = t, this.pos = e, this.i = i, this.off = 0;
  }
  findPos(t, e = 1) {
    for (; ; ) {
      if (t > this.pos || t == this.pos && (e > 0 || this.i == 0 || this.children[this.i - 1].breakAfter))
        return this.off = t - this.pos, this;
      let i = this.children[--this.i];
      this.pos -= i.length + i.breakAfter;
    }
  }
}
function oh(n, t, e, i, s, r, o, l, a) {
  let { children: h } = n, c = h.length ? h[t] : null, f = r.length ? r[r.length - 1] : null, u = f ? f.breakAfter : o;
  if (!(t == i && c && !o && !u && r.length < 2 && c.merge(e, s, r.length ? f : null, e == 0, l, a))) {
    if (i < h.length) {
      let d = h[i];
      d && s < d.length ? (t == i && (d = d.split(s), s = 0), !u && f && d.merge(0, s, f, !0, 0, a) ? r[r.length - 1] = d : (s && d.merge(0, s, null, !1, 0, a), r.push(d))) : d != null && d.breakAfter && (f ? f.breakAfter = 1 : o = 1), i++;
    }
    for (c && (c.breakAfter = o, e > 0 && (!o && r.length && c.merge(e, c.length, r[0], !1, l, 0) ? c.breakAfter = r.shift().breakAfter : (e < c.length || c.children.length && c.children[c.children.length - 1].length == 0) && c.merge(e, c.length, null, !1, l, 0), t++)); t < i && r.length; )
      if (h[i - 1].become(r[r.length - 1]))
        i--, r.pop(), a = r.length ? 0 : l;
      else if (h[t].become(r[0]))
        t++, r.shift(), l = r.length ? 0 : a;
      else
        break;
    !r.length && t && i < h.length && !h[t - 1].breakAfter && h[i].merge(0, 0, h[t - 1], !1, l, a) && t--, (t < i || r.length) && n.replaceChildren(t, i, r);
  }
}
function lh(n, t, e, i, s, r) {
  let o = n.childCursor(), { i: l, off: a } = o.findPos(e, 1), { i: h, off: c } = o.findPos(t, -1), f = t - e;
  for (let u of i)
    f += u.length;
  n.length += f, oh(n, h, c, l, a, i, 0, s, r);
}
const Fe = "￿";
class ah {
  constructor(t, e) {
    this.points = t, this.text = "", this.lineSeparator = e.facet(X.lineSeparator);
  }
  append(t) {
    this.text += t;
  }
  lineBreak() {
    this.text += Fe;
  }
  readRange(t, e) {
    if (!t)
      return this;
    let i = t.parentNode;
    for (let s = t; ; ) {
      this.findPointBefore(i, s);
      let r = this.text.length;
      this.readNode(s);
      let o = s.nextSibling;
      if (o == e)
        break;
      let l = G.get(s), a = G.get(o);
      (l && a ? l.breakAfter : (l ? l.breakAfter : tl(s)) || tl(o) && (s.nodeName != "BR" || s.cmIgnore) && this.text.length > r) && this.lineBreak(), s = o;
    }
    return this.findPointBefore(i, e), this;
  }
  readTextNode(t) {
    let e = t.nodeValue;
    for (let i of this.points)
      i.node == t && (i.pos = this.text.length + Math.min(i.offset, e.length));
    for (let i = 0, s = this.lineSeparator ? null : /\r\n?|\n/g; ; ) {
      let r = -1, o = 1, l;
      if (this.lineSeparator ? (r = e.indexOf(this.lineSeparator, i), o = this.lineSeparator.length) : (l = s.exec(e)) && (r = l.index, o = l[0].length), this.append(e.slice(i, r < 0 ? e.length : r)), r < 0)
        break;
      if (this.lineBreak(), o > 1)
        for (let a of this.points)
          a.node == t && a.pos > this.text.length && (a.pos -= o - 1);
      i = r + o;
    }
  }
  readNode(t) {
    if (t.cmIgnore)
      return;
    let e = G.get(t), i = e && e.overrideDOMText;
    if (i != null) {
      this.findPointInside(t, i.length);
      for (let s = i.iter(); !s.next().done; )
        s.lineBreak ? this.lineBreak() : this.append(s.value);
    } else
      t.nodeType == 3 ? this.readTextNode(t) : t.nodeName == "BR" ? t.nextSibling && this.lineBreak() : t.nodeType == 1 && this.readRange(t.firstChild, null);
  }
  findPointBefore(t, e) {
    for (let i of this.points)
      i.node == t && t.childNodes[i.offset] == e && (i.pos = this.text.length);
  }
  findPointInside(t, e) {
    for (let i of this.points)
      (t.nodeType == 3 ? i.node == t : t.contains(i.node)) && (i.pos = this.text.length + Math.min(e, i.offset));
  }
}
function tl(n) {
  return n.nodeType == 1 && /^(DIV|P|LI|UL|OL|BLOCKQUOTE|DD|DT|H\d|SECTION|PRE)$/.test(n.nodeName);
}
class el {
  constructor(t, e) {
    this.node = t, this.offset = e, this.pos = -1;
  }
}
let Dt = typeof navigator < "u" ? navigator : { userAgent: "", vendor: "", platform: "" }, pr = typeof document < "u" ? document : { documentElement: { style: {} } };
const mr = /* @__PURE__ */ /Edge\/(\d+)/.exec(Dt.userAgent), hh = /* @__PURE__ */ /MSIE \d/.test(Dt.userAgent), gr = /* @__PURE__ */ /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(Dt.userAgent), us = !!(hh || gr || mr), il = !us && /* @__PURE__ */ /gecko\/(\d+)/i.test(Dt.userAgent), Ts = !us && /* @__PURE__ */ /Chrome\/(\d+)/.exec(Dt.userAgent), nl = "webkitFontSmoothing" in pr.documentElement.style, ch = !us && /* @__PURE__ */ /Apple Computer/.test(Dt.vendor), sl = ch && (/* @__PURE__ */ /Mobile\/\w+/.test(Dt.userAgent) || Dt.maxTouchPoints > 2);
var M = {
  mac: sl || /* @__PURE__ */ /Mac/.test(Dt.platform),
  windows: /* @__PURE__ */ /Win/.test(Dt.platform),
  linux: /* @__PURE__ */ /Linux|X11/.test(Dt.platform),
  ie: us,
  ie_version: hh ? pr.documentMode || 6 : gr ? +gr[1] : mr ? +mr[1] : 0,
  gecko: il,
  gecko_version: il ? +(/* @__PURE__ */ /Firefox\/(\d+)/.exec(Dt.userAgent) || [0, 0])[1] : 0,
  chrome: !!Ts,
  chrome_version: Ts ? +Ts[1] : 0,
  ios: sl,
  android: /* @__PURE__ */ /Android\b/.test(Dt.userAgent),
  webkit: nl,
  safari: ch,
  webkit_version: nl ? +(/* @__PURE__ */ /\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0,
  tabSize: pr.documentElement.style.tabSize != null ? "tab-size" : "-moz-tab-size"
};
const ju = 256;
class jt extends G {
  constructor(t) {
    super(), this.text = t;
  }
  get length() {
    return this.text.length;
  }
  createDOM(t) {
    this.setDOM(t || document.createTextNode(this.text));
  }
  sync(t, e) {
    this.dom || this.createDOM(), this.dom.nodeValue != this.text && (e && e.node == this.dom && (e.written = !0), this.dom.nodeValue = this.text);
  }
  reuseDOM(t) {
    t.nodeType == 3 && this.createDOM(t);
  }
  merge(t, e, i) {
    return this.flags & 8 || i && (!(i instanceof jt) || this.length - (e - t) + i.length > ju || i.flags & 8) ? !1 : (this.text = this.text.slice(0, t) + (i ? i.text : "") + this.text.slice(e), this.markDirty(), !0);
  }
  split(t) {
    let e = new jt(this.text.slice(t));
    return this.text = this.text.slice(0, t), this.markDirty(), e.flags |= this.flags & 8, e;
  }
  localPosFromDOM(t, e) {
    return t == this.dom ? e : e ? this.text.length : 0;
  }
  domAtPos(t) {
    return new xt(this.dom, t);
  }
  domBoundsAround(t, e, i) {
    return { from: i, to: i + this.length, startDOM: this.dom, endDOM: this.dom.nextSibling };
  }
  coordsAt(t, e) {
    return qu(this.dom, t, e);
  }
}
class ne extends G {
  constructor(t, e = [], i = 0) {
    super(), this.mark = t, this.children = e, this.length = i;
    for (let s of e)
      s.setParent(this);
  }
  setAttrs(t) {
    if (nh(t), this.mark.class && (t.className = this.mark.class), this.mark.attrs)
      for (let e in this.mark.attrs)
        t.setAttribute(e, this.mark.attrs[e]);
    return t;
  }
  canReuseDOM(t) {
    return super.canReuseDOM(t) && !((this.flags | t.flags) & 8);
  }
  reuseDOM(t) {
    t.nodeName == this.mark.tagName.toUpperCase() && (this.setDOM(t), this.flags |= 6);
  }
  sync(t, e) {
    this.dom ? this.flags & 4 && this.setAttrs(this.dom) : this.setDOM(this.setAttrs(document.createElement(this.mark.tagName))), super.sync(t, e);
  }
  merge(t, e, i, s, r, o) {
    return i && (!(i instanceof ne && i.mark.eq(this.mark)) || t && r <= 0 || e < this.length && o <= 0) ? !1 : (lh(this, t, e, i ? i.children : [], r - 1, o - 1), this.markDirty(), !0);
  }
  split(t) {
    let e = [], i = 0, s = -1, r = 0;
    for (let l of this.children) {
      let a = i + l.length;
      a > t && e.push(i < t ? l.split(t - i) : l), s < 0 && i >= t && (s = r), i = a, r++;
    }
    let o = this.length - t;
    return this.length = t, s > -1 && (this.children.length = s, this.markDirty()), new ne(this.mark, e, o);
  }
  domAtPos(t) {
    return fh(this, t);
  }
  coordsAt(t, e) {
    return dh(this, t, e);
  }
}
function qu(n, t, e) {
  let i = n.nodeValue.length;
  t > i && (t = i);
  let s = t, r = t, o = 0;
  t == 0 && e < 0 || t == i && e >= 0 ? M.chrome || M.gecko || (t ? (s--, o = 1) : r < i && (r++, o = -1)) : e < 0 ? s-- : r < i && r++;
  let l = Ve(n, s, r).getClientRects();
  if (!l.length)
    return null;
  let a = l[(o ? o < 0 : e >= 0) ? 0 : l.length - 1];
  return M.safari && !o && a.width == 0 && (a = Array.prototype.find.call(l, (h) => h.width) || a), o ? eo(a, o < 0) : a || null;
}
class fe extends G {
  static create(t, e, i) {
    return new fe(t, e, i);
  }
  constructor(t, e, i) {
    super(), this.widget = t, this.length = e, this.side = i, this.prevWidget = null;
  }
  split(t) {
    let e = fe.create(this.widget, this.length - t, this.side);
    return this.length -= t, e;
  }
  sync(t) {
    (!this.dom || !this.widget.updateDOM(this.dom, t)) && (this.dom && this.prevWidget && this.prevWidget.destroy(this.dom), this.prevWidget = null, this.setDOM(this.widget.toDOM(t)), this.dom.contentEditable = "false");
  }
  getSide() {
    return this.side;
  }
  merge(t, e, i, s, r, o) {
    return i && (!(i instanceof fe) || !this.widget.compare(i.widget) || t > 0 && r <= 0 || e < this.length && o <= 0) ? !1 : (this.length = t + (i ? i.length : 0) + (this.length - e), !0);
  }
  become(t) {
    return t instanceof fe && t.side == this.side && this.widget.constructor == t.widget.constructor ? (this.widget.compare(t.widget) || this.markDirty(!0), this.dom && !this.prevWidget && (this.prevWidget = this.widget), this.widget = t.widget, this.length = t.length, !0) : !1;
  }
  ignoreMutation() {
    return !0;
  }
  ignoreEvent(t) {
    return this.widget.ignoreEvent(t);
  }
  get overrideDOMText() {
    if (this.length == 0)
      return W.empty;
    let t = this;
    for (; t.parent; )
      t = t.parent;
    let { view: e } = t, i = e && e.state.doc, s = this.posAtStart;
    return i ? i.slice(s, s + this.length) : W.empty;
  }
  domAtPos(t) {
    return (this.length ? t == 0 : this.side > 0) ? xt.before(this.dom) : xt.after(this.dom, t == this.length);
  }
  domBoundsAround() {
    return null;
  }
  coordsAt(t, e) {
    let i = this.widget.coordsAt(this.dom, t, e);
    if (i)
      return i;
    let s = this.dom.getClientRects(), r = null;
    if (!s.length)
      return null;
    let o = this.side ? this.side < 0 : t > 0;
    for (let l = o ? s.length - 1 : 0; r = s[l], !(t > 0 ? l == 0 : l == s.length - 1 || r.top < r.bottom); l += o ? -1 : 1)
      ;
    return eo(r, !o);
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
class ti extends G {
  constructor(t) {
    super(), this.side = t;
  }
  get length() {
    return 0;
  }
  merge() {
    return !1;
  }
  become(t) {
    return t instanceof ti && t.side == this.side;
  }
  split() {
    return new ti(this.side);
  }
  sync() {
    if (!this.dom) {
      let t = document.createElement("img");
      t.className = "cm-widgetBuffer", t.setAttribute("aria-hidden", "true"), this.setDOM(t);
    }
  }
  getSide() {
    return this.side;
  }
  domAtPos(t) {
    return this.side > 0 ? xt.before(this.dom) : xt.after(this.dom);
  }
  localPosFromDOM() {
    return 0;
  }
  domBoundsAround() {
    return null;
  }
  coordsAt(t) {
    return this.dom.getBoundingClientRect();
  }
  get overrideDOMText() {
    return W.empty;
  }
  get isHidden() {
    return !0;
  }
}
jt.prototype.children = fe.prototype.children = ti.prototype.children = io;
function fh(n, t) {
  let e = n.dom, { children: i } = n, s = 0;
  for (let r = 0; s < i.length; s++) {
    let o = i[s], l = r + o.length;
    if (!(l == r && o.getSide() <= 0)) {
      if (t > r && t < l && o.dom.parentNode == e)
        return o.domAtPos(t - r);
      if (t <= r)
        break;
      r = l;
    }
  }
  for (let r = s; r > 0; r--) {
    let o = i[r - 1];
    if (o.dom.parentNode == e)
      return o.domAtPos(o.length);
  }
  for (let r = s; r < i.length; r++) {
    let o = i[r];
    if (o.dom.parentNode == e)
      return o.domAtPos(0);
  }
  return new xt(e, 0);
}
function uh(n, t, e) {
  let i, { children: s } = n;
  e > 0 && t instanceof ne && s.length && (i = s[s.length - 1]) instanceof ne && i.mark.eq(t.mark) ? uh(i, t.children[0], e - 1) : (s.push(t), t.setParent(n)), n.length += t.length;
}
function dh(n, t, e) {
  let i = null, s = -1, r = null, o = -1;
  function l(h, c) {
    for (let f = 0, u = 0; f < h.children.length && u <= c; f++) {
      let d = h.children[f], p = u + d.length;
      p >= c && (d.children.length ? l(d, c - u) : (!r || r.isHidden && e > 0) && (p > c || u == p && d.getSide() > 0) ? (r = d, o = c - u) : (u < c || u == p && d.getSide() < 0 && !d.isHidden) && (i = d, s = c - u)), u = p;
    }
  }
  l(n, t);
  let a = (e < 0 ? i : r) || i || r;
  return a ? a.coordsAt(Math.max(0, a == i ? s : o), e) : _u(n);
}
function _u(n) {
  let t = n.dom.lastChild;
  if (!t)
    return n.dom.getBoundingClientRect();
  let e = Ri(t);
  return e[e.length - 1] || null;
}
function br(n, t) {
  for (let e in n)
    e == "class" && t.class ? t.class += " " + n.class : e == "style" && t.style ? t.style += ";" + n.style : t[e] = n[e];
  return t;
}
const rl = /* @__PURE__ */ Object.create(null);
function no(n, t, e) {
  if (n == t)
    return !0;
  n || (n = rl), t || (t = rl);
  let i = Object.keys(n), s = Object.keys(t);
  if (i.length - (e && i.indexOf(e) > -1 ? 1 : 0) != s.length - (e && s.indexOf(e) > -1 ? 1 : 0))
    return !1;
  for (let r of i)
    if (r != e && (s.indexOf(r) == -1 || n[r] !== t[r]))
      return !1;
  return !0;
}
function yr(n, t, e) {
  let i = !1;
  if (t)
    for (let s in t)
      e && s in e || (i = !0, s == "style" ? n.style.cssText = "" : n.removeAttribute(s));
  if (e)
    for (let s in e)
      t && t[s] == e[s] || (i = !0, s == "style" ? n.style.cssText = e[s] : n.setAttribute(s, e[s]));
  return i;
}
function td(n) {
  let t = /* @__PURE__ */ Object.create(null);
  for (let e = 0; e < n.attributes.length; e++) {
    let i = n.attributes[e];
    t[i.name] = i.value;
  }
  return t;
}
class Se {
  /**
  Compare this instance to another instance of the same type.
  (TypeScript can't express this, but only instances of the same
  specific class will be passed to this method.) This is used to
  avoid redrawing widgets when they are replaced by a new
  decoration of the same type. The default implementation just
  returns `false`, which will cause new instances of the widget to
  always be redrawn.
  */
  eq(t) {
    return !1;
  }
  /**
  Update a DOM element created by a widget of the same type (but
  different, non-`eq` content) to reflect this widget. May return
  true to indicate that it could update, false to indicate it
  couldn't (in which case the widget will be redrawn). The default
  implementation just returns false.
  */
  updateDOM(t, e) {
    return !1;
  }
  /**
  @internal
  */
  compare(t) {
    return this == t || this.constructor == t.constructor && this.eq(t);
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
  ignoreEvent(t) {
    return !0;
  }
  /**
  Override the way screen coordinates for positions at/in the
  widget are found. `pos` will be the offset into the widget, and
  `side` the side of the position that is being queried—less than
  zero for before, greater than zero for after, and zero for
  directly at that position.
  */
  coordsAt(t, e, i) {
    return null;
  }
  /**
  @internal
  */
  get isHidden() {
    return !1;
  }
  /**
  This is called when the an instance of the widget is removed
  from the editor view.
  */
  destroy(t) {
  }
}
var K = /* @__PURE__ */ function(n) {
  return n[n.Text = 0] = "Text", n[n.WidgetBefore = 1] = "WidgetBefore", n[n.WidgetAfter = 2] = "WidgetAfter", n[n.WidgetRange = 3] = "WidgetRange", n;
}(K || (K = {}));
class T extends Pe {
  constructor(t, e, i, s) {
    super(), this.startSide = t, this.endSide = e, this.widget = i, this.spec = s;
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
  static mark(t) {
    return new Gi(t);
  }
  /**
  Create a widget decoration, which displays a DOM element at the
  given position.
  */
  static widget(t) {
    let e = Math.max(-1e4, Math.min(1e4, t.side || 0)), i = !!t.block;
    return e += i && !t.inlineOrder ? e > 0 ? 3e8 : -4e8 : e > 0 ? 1e8 : -1e8, new xe(t, e, e, i, t.widget || null, !1);
  }
  /**
  Create a replace decoration which replaces the given range with
  a widget, or simply hides it.
  */
  static replace(t) {
    let e = !!t.block, i, s;
    if (t.isBlockGap)
      i = -5e8, s = 4e8;
    else {
      let { start: r, end: o } = ph(t, e);
      i = (r ? e ? -3e8 : -1 : 5e8) - 1, s = (o ? e ? 2e8 : 1 : -6e8) + 1;
    }
    return new xe(t, i, s, e, t.widget || null, !0);
  }
  /**
  Create a line decoration, which can add DOM attributes to the
  line starting at the given position.
  */
  static line(t) {
    return new Hi(t);
  }
  /**
  Build a [`DecorationSet`](https://codemirror.net/6/docs/ref/#view.DecorationSet) from the given
  decorated range or ranges. If the ranges aren't already sorted,
  pass `true` for `sort` to make the library sort them for you.
  */
  static set(t, e = !1) {
    return I.of(t, e);
  }
  /**
  @internal
  */
  hasHeight() {
    return this.widget ? this.widget.estimatedHeight > -1 : !1;
  }
}
T.none = I.empty;
class Gi extends T {
  constructor(t) {
    let { start: e, end: i } = ph(t);
    super(e ? -1 : 5e8, i ? 1 : -6e8, null, t), this.tagName = t.tagName || "span", this.class = t.class || "", this.attrs = t.attributes || null;
  }
  eq(t) {
    var e, i;
    return this == t || t instanceof Gi && this.tagName == t.tagName && (this.class || ((e = this.attrs) === null || e === void 0 ? void 0 : e.class)) == (t.class || ((i = t.attrs) === null || i === void 0 ? void 0 : i.class)) && no(this.attrs, t.attrs, "class");
  }
  range(t, e = t) {
    if (t >= e)
      throw new RangeError("Mark decorations may not be empty");
    return super.range(t, e);
  }
}
Gi.prototype.point = !1;
class Hi extends T {
  constructor(t) {
    super(-2e8, -2e8, null, t);
  }
  eq(t) {
    return t instanceof Hi && this.spec.class == t.spec.class && no(this.spec.attributes, t.spec.attributes);
  }
  range(t, e = t) {
    if (e != t)
      throw new RangeError("Line decoration ranges must be zero-length");
    return super.range(t, e);
  }
}
Hi.prototype.mapMode = yt.TrackBefore;
Hi.prototype.point = !0;
class xe extends T {
  constructor(t, e, i, s, r, o) {
    super(e, i, r, t), this.block = s, this.isReplace = o, this.mapMode = s ? e <= 0 ? yt.TrackBefore : yt.TrackAfter : yt.TrackDel;
  }
  // Only relevant when this.block == true
  get type() {
    return this.startSide < this.endSide ? K.WidgetRange : this.startSide <= 0 ? K.WidgetBefore : K.WidgetAfter;
  }
  get heightRelevant() {
    return this.block || !!this.widget && (this.widget.estimatedHeight >= 5 || this.widget.lineBreaks > 0);
  }
  eq(t) {
    return t instanceof xe && ed(this.widget, t.widget) && this.block == t.block && this.startSide == t.startSide && this.endSide == t.endSide;
  }
  range(t, e = t) {
    if (this.isReplace && (t > e || t == e && this.startSide > 0 && this.endSide <= 0))
      throw new RangeError("Invalid range for replacement decoration");
    if (!this.isReplace && e != t)
      throw new RangeError("Widget decorations can only have zero-length ranges");
    return super.range(t, e);
  }
}
xe.prototype.point = !0;
function ph(n, t = !1) {
  let { inclusiveStart: e, inclusiveEnd: i } = n;
  return e == null && (e = n.inclusive), i == null && (i = n.inclusive), { start: e ?? t, end: i ?? t };
}
function ed(n, t) {
  return n == t || !!(n && t && n.compare(t));
}
function xr(n, t, e, i = 0) {
  let s = e.length - 1;
  s >= 0 && e[s] + i >= n ? e[s] = Math.max(e[s], t) : e.push(n, t);
}
class bt extends G {
  constructor() {
    super(...arguments), this.children = [], this.length = 0, this.prevAttrs = void 0, this.attrs = null, this.breakAfter = 0;
  }
  // Consumes source
  merge(t, e, i, s, r, o) {
    if (i) {
      if (!(i instanceof bt))
        return !1;
      this.dom || i.transferDOM(this);
    }
    return s && this.setDeco(i ? i.attrs : null), lh(this, t, e, i ? i.children : [], r, o), !0;
  }
  split(t) {
    let e = new bt();
    if (e.breakAfter = this.breakAfter, this.length == 0)
      return e;
    let { i, off: s } = this.childPos(t);
    s && (e.append(this.children[i].split(s), 0), this.children[i].merge(s, this.children[i].length, null, !1, 0, 0), i++);
    for (let r = i; r < this.children.length; r++)
      e.append(this.children[r], 0);
    for (; i > 0 && this.children[i - 1].length == 0; )
      this.children[--i].destroy();
    return this.children.length = i, this.markDirty(), this.length = t, e;
  }
  transferDOM(t) {
    this.dom && (this.markDirty(), t.setDOM(this.dom), t.prevAttrs = this.prevAttrs === void 0 ? this.attrs : this.prevAttrs, this.prevAttrs = void 0, this.dom = null);
  }
  setDeco(t) {
    no(this.attrs, t) || (this.dom && (this.prevAttrs = this.attrs, this.markDirty()), this.attrs = t);
  }
  append(t, e) {
    uh(this, t, e);
  }
  // Only called when building a line view in ContentBuilder
  addLineDeco(t) {
    let e = t.spec.attributes, i = t.spec.class;
    e && (this.attrs = br(e, this.attrs || {})), i && (this.attrs = br({ class: i }, this.attrs || {}));
  }
  domAtPos(t) {
    return fh(this, t);
  }
  reuseDOM(t) {
    t.nodeName == "DIV" && (this.setDOM(t), this.flags |= 6);
  }
  sync(t, e) {
    var i;
    this.dom ? this.flags & 4 && (nh(this.dom), this.dom.className = "cm-line", this.prevAttrs = this.attrs ? null : void 0) : (this.setDOM(document.createElement("div")), this.dom.className = "cm-line", this.prevAttrs = this.attrs ? null : void 0), this.prevAttrs !== void 0 && (yr(this.dom, this.prevAttrs, this.attrs), this.dom.classList.add("cm-line"), this.prevAttrs = void 0), super.sync(t, e);
    let s = this.dom.lastChild;
    for (; s && G.get(s) instanceof ne; )
      s = s.lastChild;
    if (!s || !this.length || s.nodeName != "BR" && ((i = G.get(s)) === null || i === void 0 ? void 0 : i.isEditable) == !1 && (!M.ios || !this.children.some((r) => r instanceof jt))) {
      let r = document.createElement("BR");
      r.cmIgnore = !0, this.dom.appendChild(r);
    }
  }
  measureTextSize() {
    if (this.children.length == 0 || this.length > 20)
      return null;
    let t = 0, e;
    for (let i of this.children) {
      if (!(i instanceof jt) || /[^ -~]/.test(i.text))
        return null;
      let s = Ri(i.dom);
      if (s.length != 1)
        return null;
      t += s[0].width, e = s[0].height;
    }
    return t ? {
      lineHeight: this.dom.getBoundingClientRect().height,
      charWidth: t / this.length,
      textHeight: e
    } : null;
  }
  coordsAt(t, e) {
    let i = dh(this, t, e);
    if (!this.children.length && i && this.parent) {
      let { heightOracle: s } = this.parent.view.viewState, r = i.bottom - i.top;
      if (Math.abs(r - s.lineHeight) < 2 && s.textHeight < r) {
        let o = (r - s.textHeight) / 2;
        return { top: i.top + o, bottom: i.bottom - o, left: i.left, right: i.left };
      }
    }
    return i;
  }
  become(t) {
    return !1;
  }
  get type() {
    return K.Text;
  }
  static find(t, e) {
    for (let i = 0, s = 0; i < t.children.length; i++) {
      let r = t.children[i], o = s + r.length;
      if (o >= e) {
        if (r instanceof bt)
          return r;
        if (o > e)
          break;
      }
      s = o + r.breakAfter;
    }
    return null;
  }
}
class De extends G {
  constructor(t, e, i) {
    super(), this.widget = t, this.length = e, this.type = i, this.breakAfter = 0, this.prevWidget = null;
  }
  merge(t, e, i, s, r, o) {
    return i && (!(i instanceof De) || !this.widget.compare(i.widget) || t > 0 && r <= 0 || e < this.length && o <= 0) ? !1 : (this.length = t + (i ? i.length : 0) + (this.length - e), !0);
  }
  domAtPos(t) {
    return t == 0 ? xt.before(this.dom) : xt.after(this.dom, t == this.length);
  }
  split(t) {
    let e = this.length - t;
    this.length = t;
    let i = new De(this.widget, e, this.type);
    return i.breakAfter = this.breakAfter, i;
  }
  get children() {
    return io;
  }
  sync(t) {
    (!this.dom || !this.widget.updateDOM(this.dom, t)) && (this.dom && this.prevWidget && this.prevWidget.destroy(this.dom), this.prevWidget = null, this.setDOM(this.widget.toDOM(t)), this.dom.contentEditable = "false");
  }
  get overrideDOMText() {
    return this.parent ? this.parent.view.state.doc.slice(this.posAtStart, this.posAtEnd) : W.empty;
  }
  domBoundsAround() {
    return null;
  }
  become(t) {
    return t instanceof De && t.widget.constructor == this.widget.constructor ? (t.widget.compare(this.widget) || this.markDirty(!0), this.dom && !this.prevWidget && (this.prevWidget = this.widget), this.widget = t.widget, this.length = t.length, this.type = t.type, this.breakAfter = t.breakAfter, !0) : !1;
  }
  ignoreMutation() {
    return !0;
  }
  ignoreEvent(t) {
    return this.widget.ignoreEvent(t);
  }
  get isEditable() {
    return !1;
  }
  get isWidget() {
    return !0;
  }
  coordsAt(t, e) {
    return this.widget.coordsAt(this.dom, t, e);
  }
  destroy() {
    super.destroy(), this.dom && this.widget.destroy(this.dom);
  }
}
class wi {
  constructor(t, e, i, s) {
    this.doc = t, this.pos = e, this.end = i, this.disallowBlockEffectsFor = s, this.content = [], this.curLine = null, this.breakAtStart = 0, this.pendingBuffer = 0, this.bufferMarks = [], this.atCursorPos = !0, this.openStart = -1, this.openEnd = -1, this.text = "", this.textOff = 0, this.cursor = t.iter(), this.skip = e;
  }
  posCovered() {
    if (this.content.length == 0)
      return !this.breakAtStart && this.doc.lineAt(this.pos).from != this.pos;
    let t = this.content[this.content.length - 1];
    return !t.breakAfter && !(t instanceof De && t.type == K.WidgetBefore);
  }
  getLine() {
    return this.curLine || (this.content.push(this.curLine = new bt()), this.atCursorPos = !0), this.curLine;
  }
  flushBuffer(t = this.bufferMarks) {
    this.pendingBuffer && (this.curLine.append(tn(new ti(-1), t), t.length), this.pendingBuffer = 0);
  }
  addBlockWidget(t) {
    this.flushBuffer(), this.curLine = null, this.content.push(t);
  }
  finish(t) {
    this.pendingBuffer && t <= this.bufferMarks.length ? this.flushBuffer() : this.pendingBuffer = 0, this.posCovered() || this.getLine();
  }
  buildText(t, e, i) {
    for (; t > 0; ) {
      if (this.textOff == this.text.length) {
        let { value: r, lineBreak: o, done: l } = this.cursor.next(this.skip);
        if (this.skip = 0, l)
          throw new Error("Ran out of text content when drawing inline views");
        if (o) {
          this.posCovered() || this.getLine(), this.content.length ? this.content[this.content.length - 1].breakAfter = 1 : this.breakAtStart = 1, this.flushBuffer(), this.curLine = null, this.atCursorPos = !0, t--;
          continue;
        } else
          this.text = r, this.textOff = 0;
      }
      let s = Math.min(
        this.text.length - this.textOff,
        t,
        512
        /* T.Chunk */
      );
      this.flushBuffer(e.slice(e.length - i)), this.getLine().append(tn(new jt(this.text.slice(this.textOff, this.textOff + s)), e), i), this.atCursorPos = !0, this.textOff += s, t -= s, i = 0;
    }
  }
  span(t, e, i, s) {
    this.buildText(e - t, i, s), this.pos = e, this.openStart < 0 && (this.openStart = s);
  }
  point(t, e, i, s, r, o) {
    if (this.disallowBlockEffectsFor[o] && i instanceof xe) {
      if (i.block)
        throw new RangeError("Block decorations may not be specified via plugins");
      if (e > this.doc.lineAt(this.pos).to)
        throw new RangeError("Decorations that replace line breaks may not be specified via plugins");
    }
    let l = e - t;
    if (i instanceof xe)
      if (i.block) {
        let { type: a } = i;
        a == K.WidgetAfter && !this.posCovered() && this.getLine(), this.addBlockWidget(new De(i.widget || new ol("div"), l, a));
      } else {
        let a = fe.create(i.widget || new ol("span"), l, l ? 0 : i.startSide), h = this.atCursorPos && !a.isEditable && r <= s.length && (t < e || i.startSide > 0), c = !a.isEditable && (t < e || r > s.length || i.startSide <= 0), f = this.getLine();
        this.pendingBuffer == 2 && !h && !a.isEditable && (this.pendingBuffer = 0), this.flushBuffer(s), h && (f.append(tn(new ti(1), s), r), r = s.length + Math.max(0, r - s.length)), f.append(tn(a, s), r), this.atCursorPos = c, this.pendingBuffer = c ? t < e || r > s.length ? 1 : 2 : 0, this.pendingBuffer && (this.bufferMarks = s.slice());
      }
    else
      this.doc.lineAt(this.pos).from == this.pos && this.getLine().addLineDeco(i);
    l && (this.textOff + l <= this.text.length ? this.textOff += l : (this.skip += l - (this.text.length - this.textOff), this.text = "", this.textOff = 0), this.pos = e), this.openStart < 0 && (this.openStart = r);
  }
  static build(t, e, i, s, r) {
    let o = new wi(t, e, i, r);
    return o.openEnd = I.spans(s, e, i, o), o.openStart < 0 && (o.openStart = o.openEnd), o.finish(o.openEnd), o;
  }
}
function tn(n, t) {
  for (let e of t)
    n = new ne(e, [n], n.length);
  return n;
}
class ol extends Se {
  constructor(t) {
    super(), this.tag = t;
  }
  eq(t) {
    return t.tag == this.tag;
  }
  toDOM() {
    return document.createElement(this.tag);
  }
  updateDOM(t) {
    return t.nodeName.toLowerCase() == this.tag;
  }
  get isHidden() {
    return !0;
  }
}
const mh = /* @__PURE__ */ A.define(), gh = /* @__PURE__ */ A.define(), bh = /* @__PURE__ */ A.define(), yh = /* @__PURE__ */ A.define(), kr = /* @__PURE__ */ A.define(), xh = /* @__PURE__ */ A.define(), kh = /* @__PURE__ */ A.define(), wh = /* @__PURE__ */ A.define({
  combine: (n) => n.some((t) => t)
}), Sh = /* @__PURE__ */ A.define({
  combine: (n) => n.some((t) => t)
});
class Fn {
  constructor(t, e = "nearest", i = "nearest", s = 5, r = 5) {
    this.range = t, this.y = e, this.x = i, this.yMargin = s, this.xMargin = r;
  }
  map(t) {
    return t.empty ? this : new Fn(this.range.map(t), this.y, this.x, this.yMargin, this.xMargin);
  }
}
const ll = /* @__PURE__ */ L.define({ map: (n, t) => n.map(t) });
function Vt(n, t, e) {
  let i = n.facet(yh);
  i.length ? i[0](t) : window.onerror ? window.onerror(String(t), e, void 0, void 0, t) : e ? console.error(e + ":", t) : console.error(t);
}
const ds = /* @__PURE__ */ A.define({ combine: (n) => n.length ? n[0] : !0 });
let id = 0;
const mi = /* @__PURE__ */ A.define();
class nt {
  constructor(t, e, i, s) {
    this.id = t, this.create = e, this.domEventHandlers = i, this.extension = s(this);
  }
  /**
  Define a plugin from a constructor function that creates the
  plugin's value, given an editor view.
  */
  static define(t, e) {
    const { eventHandlers: i, provide: s, decorations: r } = e || {};
    return new nt(id++, t, i, (o) => {
      let l = [mi.of(o)];
      return r && l.push(Zi.of((a) => {
        let h = a.plugin(o);
        return h ? r(h) : T.none;
      })), s && l.push(s(o)), l;
    });
  }
  /**
  Create a plugin for a class whose constructor takes a single
  editor view as argument.
  */
  static fromClass(t, e) {
    return nt.define((i) => new t(i), e);
  }
}
class Ds {
  constructor(t) {
    this.spec = t, this.mustUpdate = null, this.value = null;
  }
  update(t) {
    if (this.value) {
      if (this.mustUpdate) {
        let e = this.mustUpdate;
        if (this.mustUpdate = null, this.value.update)
          try {
            this.value.update(e);
          } catch (i) {
            if (Vt(e.state, i, "CodeMirror plugin crashed"), this.value.destroy)
              try {
                this.value.destroy();
              } catch {
              }
            this.deactivate();
          }
      }
    } else if (this.spec)
      try {
        this.value = this.spec.create(t);
      } catch (e) {
        Vt(t.state, e, "CodeMirror plugin crashed"), this.deactivate();
      }
    return this;
  }
  destroy(t) {
    var e;
    if (!((e = this.value) === null || e === void 0) && e.destroy)
      try {
        this.value.destroy();
      } catch (i) {
        Vt(t.state, i, "CodeMirror plugin crashed");
      }
  }
  deactivate() {
    this.spec = this.value = null;
  }
}
const vh = /* @__PURE__ */ A.define(), so = /* @__PURE__ */ A.define(), Zi = /* @__PURE__ */ A.define(), ro = /* @__PURE__ */ A.define(), Ch = /* @__PURE__ */ A.define();
function al(n, t, e) {
  let i = n.state.facet(Ch);
  if (!i.length)
    return i;
  let s = i.map((o) => o instanceof Function ? o(n) : o), r = [];
  return I.spans(s, t, e, {
    point() {
    },
    span(o, l, a, h) {
      let c = r;
      for (let f = a.length - 1; f >= 0; f--, h--) {
        let u = a[f].spec.bidiIsolate, d;
        if (u != null)
          if (h > 0 && c.length && (d = c[c.length - 1]).to == o && d.direction == u)
            d.to = l, c = d.inner;
          else {
            let p = { from: o, to: l, direction: u, inner: [] };
            c.push(p), c = p.inner;
          }
      }
    }
  }), r;
}
const Oh = /* @__PURE__ */ A.define();
function Ah(n) {
  let t = 0, e = 0, i = 0, s = 0;
  for (let r of n.state.facet(Oh)) {
    let o = r(n);
    o && (o.left != null && (t = Math.max(t, o.left)), o.right != null && (e = Math.max(e, o.right)), o.top != null && (i = Math.max(i, o.top)), o.bottom != null && (s = Math.max(s, o.bottom)));
  }
  return { left: t, right: e, top: i, bottom: s };
}
const gi = /* @__PURE__ */ A.define();
class Xt {
  constructor(t, e, i, s) {
    this.fromA = t, this.toA = e, this.fromB = i, this.toB = s;
  }
  join(t) {
    return new Xt(Math.min(this.fromA, t.fromA), Math.max(this.toA, t.toA), Math.min(this.fromB, t.fromB), Math.max(this.toB, t.toB));
  }
  addToSet(t) {
    let e = t.length, i = this;
    for (; e > 0; e--) {
      let s = t[e - 1];
      if (!(s.fromA > i.toA)) {
        if (s.toA < i.fromA)
          break;
        i = i.join(s), t.splice(e - 1, 1);
      }
    }
    return t.splice(e, 0, i), t;
  }
  static extendWithRanges(t, e) {
    if (e.length == 0)
      return t;
    let i = [];
    for (let s = 0, r = 0, o = 0, l = 0; ; s++) {
      let a = s == t.length ? null : t[s], h = o - l, c = a ? a.fromB : 1e9;
      for (; r < e.length && e[r] < c; ) {
        let f = e[r], u = e[r + 1], d = Math.max(l, f), p = Math.min(c, u);
        if (d <= p && new Xt(d + h, p + h, d, p).addToSet(i), u > c)
          break;
        r += 2;
      }
      if (!a)
        return i;
      new Xt(a.fromA, a.toA, a.fromB, a.toB).addToSet(i), o = a.toA, l = a.toB;
    }
  }
}
class zn {
  constructor(t, e, i) {
    this.view = t, this.state = e, this.transactions = i, this.flags = 0, this.startState = t.state, this.changes = et.empty(this.startState.doc.length);
    for (let r of i)
      this.changes = this.changes.compose(r.changes);
    let s = [];
    this.changes.iterChangedRanges((r, o, l, a) => s.push(new Xt(r, o, l, a))), this.changedRanges = s;
  }
  /**
  @internal
  */
  static create(t, e, i) {
    return new zn(t, e, i);
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
    return this.transactions.some((t) => t.selection);
  }
  /**
  @internal
  */
  get empty() {
    return this.flags == 0 && this.transactions.length == 0;
  }
}
var z = /* @__PURE__ */ function(n) {
  return n[n.LTR = 0] = "LTR", n[n.RTL = 1] = "RTL", n;
}(z || (z = {}));
const Li = z.LTR, Mh = z.RTL;
function Rh(n) {
  let t = [];
  for (let e = 0; e < n.length; e++)
    t.push(1 << +n[e]);
  return t;
}
const nd = /* @__PURE__ */ Rh("88888888888888888888888888888888888666888888787833333333337888888000000000000000000000000008888880000000000000000000000000088888888888888888888888888888888888887866668888088888663380888308888800000000000000000000000800000000000000000000000000000008"), sd = /* @__PURE__ */ Rh("4444448826627288999999999992222222222222222222222222222222222222222222222229999999999999999999994444444444644222822222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222999999949999999229989999223333333333"), wr = /* @__PURE__ */ Object.create(null), Ht = [];
for (let n of ["()", "[]", "{}"]) {
  let t = /* @__PURE__ */ n.charCodeAt(0), e = /* @__PURE__ */ n.charCodeAt(1);
  wr[t] = e, wr[e] = -t;
}
function rd(n) {
  return n <= 247 ? nd[n] : 1424 <= n && n <= 1524 ? 2 : 1536 <= n && n <= 1785 ? sd[n - 1536] : 1774 <= n && n <= 2220 ? 4 : 8192 <= n && n <= 8203 ? 256 : 64336 <= n && n <= 65023 ? 4 : n == 8204 ? 256 : 1;
}
const od = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac\ufb50-\ufdff]/;
class ue {
  /**
  The direction of this span.
  */
  get dir() {
    return this.level % 2 ? Mh : Li;
  }
  /**
  @internal
  */
  constructor(t, e, i) {
    this.from = t, this.to = e, this.level = i;
  }
  /**
  @internal
  */
  side(t, e) {
    return this.dir == e == t ? this.to : this.from;
  }
  /**
  @internal
  */
  static find(t, e, i, s) {
    let r = -1;
    for (let o = 0; o < t.length; o++) {
      let l = t[o];
      if (l.from <= e && l.to >= e) {
        if (l.level == i)
          return o;
        (r < 0 || (s != 0 ? s < 0 ? l.from < e : l.to > e : t[r].level > l.level)) && (r = o);
      }
    }
    if (r < 0)
      throw new RangeError("Index out of range");
    return r;
  }
}
function Zh(n, t) {
  if (n.length != t.length)
    return !1;
  for (let e = 0; e < n.length; e++) {
    let i = n[e], s = t[e];
    if (i.from != s.from || i.to != s.to || i.direction != s.direction || !Zh(i.inner, s.inner))
      return !1;
  }
  return !0;
}
const E = [];
function ld(n, t, e, i, s) {
  for (let r = 0; r <= i.length; r++) {
    let o = r ? i[r - 1].to : t, l = r < i.length ? i[r].from : e, a = r ? 256 : s;
    for (let h = o, c = a, f = a; h < l; h++) {
      let u = rd(n.charCodeAt(h));
      u == 512 ? u = c : u == 8 && f == 4 && (u = 16), E[h] = u == 4 ? 2 : u, u & 7 && (f = u), c = u;
    }
    for (let h = o, c = a, f = a; h < l; h++) {
      let u = E[h];
      if (u == 128)
        h < l - 1 && c == E[h + 1] && c & 24 ? u = E[h] = c : E[h] = 256;
      else if (u == 64) {
        let d = h + 1;
        for (; d < l && E[d] == 64; )
          d++;
        let p = h && c == 8 || d < e && E[d] == 8 ? f == 1 ? 1 : 8 : 256;
        for (let g = h; g < d; g++)
          E[g] = p;
        h = d - 1;
      } else
        u == 8 && f == 1 && (E[h] = 1);
      c = u, u & 7 && (f = u);
    }
  }
}
function ad(n, t, e, i, s) {
  let r = s == 1 ? 2 : 1;
  for (let o = 0, l = 0, a = 0; o <= i.length; o++) {
    let h = o ? i[o - 1].to : t, c = o < i.length ? i[o].from : e;
    for (let f = h, u, d, p; f < c; f++)
      if (d = wr[u = n.charCodeAt(f)])
        if (d < 0) {
          for (let g = l - 3; g >= 0; g -= 3)
            if (Ht[g + 1] == -d) {
              let m = Ht[g + 2], b = m & 2 ? s : m & 4 ? m & 1 ? r : s : 0;
              b && (E[f] = E[Ht[g]] = b), l = g;
              break;
            }
        } else {
          if (Ht.length == 189)
            break;
          Ht[l++] = f, Ht[l++] = u, Ht[l++] = a;
        }
      else if ((p = E[f]) == 2 || p == 1) {
        let g = p == s;
        a = g ? 0 : 1;
        for (let m = l - 3; m >= 0; m -= 3) {
          let b = Ht[m + 2];
          if (b & 2)
            break;
          if (g)
            Ht[m + 2] |= 2;
          else {
            if (b & 4)
              break;
            Ht[m + 2] |= 4;
          }
        }
      }
  }
}
function hd(n, t, e, i) {
  for (let s = 0, r = i; s <= e.length; s++) {
    let o = s ? e[s - 1].to : n, l = s < e.length ? e[s].from : t;
    for (let a = o; a < l; ) {
      let h = E[a];
      if (h == 256) {
        let c = a + 1;
        for (; ; )
          if (c == l) {
            if (s == e.length)
              break;
            c = e[s++].to, l = s < e.length ? e[s].from : t;
          } else if (E[c] == 256)
            c++;
          else
            break;
        let f = r == 1, u = (c < t ? E[c] : i) == 1, d = f == u ? f ? 1 : 2 : i;
        for (let p = c, g = s, m = g ? e[g - 1].to : n; p > a; )
          p == m && (p = e[--g].from, m = g ? e[g - 1].to : n), E[--p] = d;
        a = c;
      } else
        r = h, a++;
    }
  }
}
function Sr(n, t, e, i, s, r, o) {
  let l = i % 2 ? 2 : 1;
  if (i % 2 == s % 2)
    for (let a = t, h = 0; a < e; ) {
      let c = !0, f = !1;
      if (h == r.length || a < r[h].from) {
        let g = E[a];
        g != l && (c = !1, f = g == 16);
      }
      let u = !c && l == 1 ? [] : null, d = c ? i : i + 1, p = a;
      t:
        for (; ; )
          if (h < r.length && p == r[h].from) {
            if (f)
              break t;
            let g = r[h];
            if (!c)
              for (let m = g.to, b = h + 1; ; ) {
                if (m == e)
                  break t;
                if (b < r.length && r[b].from == m)
                  m = r[b++].to;
                else {
                  if (E[m] == l)
                    break t;
                  break;
                }
              }
            if (h++, u)
              u.push(g);
            else {
              g.from > a && o.push(new ue(a, g.from, d));
              let m = g.direction == Li != !(d % 2);
              vr(n, m ? i + 1 : i, s, g.inner, g.from, g.to, o), a = g.to;
            }
            p = g.to;
          } else {
            if (p == e || (c ? E[p] != l : E[p] == l))
              break;
            p++;
          }
      u ? Sr(n, a, p, i + 1, s, u, o) : a < p && o.push(new ue(a, p, d)), a = p;
    }
  else
    for (let a = e, h = r.length; a > t; ) {
      let c = !0, f = !1;
      if (!h || a > r[h - 1].to) {
        let g = E[a - 1];
        g != l && (c = !1, f = g == 16);
      }
      let u = !c && l == 1 ? [] : null, d = c ? i : i + 1, p = a;
      t:
        for (; ; )
          if (h && p == r[h - 1].to) {
            if (f)
              break t;
            let g = r[--h];
            if (!c)
              for (let m = g.from, b = h; ; ) {
                if (m == t)
                  break t;
                if (b && r[b - 1].to == m)
                  m = r[--b].from;
                else {
                  if (E[m - 1] == l)
                    break t;
                  break;
                }
              }
            if (u)
              u.push(g);
            else {
              g.to < a && o.push(new ue(g.to, a, d));
              let m = g.direction == Li != !(d % 2);
              vr(n, m ? i + 1 : i, s, g.inner, g.from, g.to, o), a = g.from;
            }
            p = g.from;
          } else {
            if (p == t || (c ? E[p - 1] != l : E[p - 1] == l))
              break;
            p--;
          }
      u ? Sr(n, p, a, i + 1, s, u, o) : p < a && o.push(new ue(p, a, d)), a = p;
    }
}
function vr(n, t, e, i, s, r, o) {
  let l = t % 2 ? 2 : 1;
  ld(n, s, r, i, l), ad(n, s, r, i, l), hd(s, r, i, l), Sr(n, s, r, t, e, i, o);
}
function cd(n, t, e) {
  if (!n)
    return [new ue(0, 0, t == Mh ? 1 : 0)];
  if (t == Li && !e.length && !od.test(n))
    return Lh(n.length);
  if (e.length)
    for (; n.length > E.length; )
      E[E.length] = 256;
  let i = [], s = t == Li ? 0 : 1;
  return vr(n, s, s, e, 0, n.length, i), i;
}
function Lh(n) {
  return [new ue(0, n, 0)];
}
let Th = "";
function fd(n, t, e, i, s) {
  var r;
  let o = i.head - n.from, l = -1;
  if (o == 0) {
    if (!s || !n.length)
      return null;
    t[0].level != e && (o = t[0].side(!1, e), l = 0);
  } else if (o == n.length) {
    if (s)
      return null;
    let u = t[t.length - 1];
    u.level != e && (o = u.side(!0, e), l = t.length - 1);
  }
  l < 0 && (l = ue.find(t, o, (r = i.bidiLevel) !== null && r !== void 0 ? r : -1, i.assoc));
  let a = t[l];
  o == a.side(s, e) && (a = t[l += s ? 1 : -1], o = a.side(!s, e));
  let h = s == (a.dir == e), c = ut(n.text, o, h);
  if (Th = n.text.slice(Math.min(o, c), Math.max(o, c)), c != a.side(s, e))
    return y.cursor(c + n.from, h ? -1 : 1, a.level);
  let f = l == (s ? t.length - 1 : 0) ? null : t[l + (s ? 1 : -1)];
  return !f && a.level != e ? y.cursor(s ? n.to : n.from, s ? -1 : 1, e) : f && f.level < a.level ? y.cursor(f.side(!s, e) + n.from, s ? 1 : -1, f.level) : y.cursor(c + n.from, s ? -1 : 1, a.level);
}
class hl extends G {
  get length() {
    return this.view.state.doc.length;
  }
  constructor(t) {
    super(), this.view = t, this.decorations = [], this.dynamicDecorationMap = [], this.hasComposition = null, this.markedForComposition = /* @__PURE__ */ new Set(), this.minWidth = 0, this.minWidthFrom = 0, this.minWidthTo = 0, this.impreciseAnchor = null, this.impreciseHead = null, this.forceSelection = !1, this.lastUpdate = Date.now(), this.setDOM(t.contentDOM), this.children = [new bt()], this.children[0].setParent(this), this.updateDeco(), this.updateInner([new Xt(0, 0, 0, t.state.doc.length)], 0, null);
  }
  // Update the document view to a given state.
  update(t) {
    let e = t.changedRanges;
    this.minWidth > 0 && e.length && (e.every(({ fromA: l, toA: a }) => a < this.minWidthFrom || l > this.minWidthTo) ? (this.minWidthFrom = t.changes.mapPos(this.minWidthFrom, 1), this.minWidthTo = t.changes.mapPos(this.minWidthTo, 1)) : this.minWidth = this.minWidthFrom = this.minWidthTo = 0);
    let i = this.view.inputState.composing < 0 ? null : dd(this.view, t.changes);
    if (this.hasComposition) {
      this.markedForComposition.clear();
      let { from: l, to: a } = this.hasComposition;
      e = new Xt(l, a, t.changes.mapPos(l, -1), t.changes.mapPos(a, 1)).addToSet(e.slice());
    }
    this.hasComposition = i ? { from: i.range.fromB, to: i.range.toB } : null, (M.ie || M.chrome) && !i && t && t.state.doc.lines != t.startState.doc.lines && (this.forceSelection = !0);
    let s = this.decorations, r = this.updateDeco(), o = gd(s, r, t.changes);
    return e = Xt.extendWithRanges(e, o), !(this.flags & 7) && e.length == 0 ? !1 : (this.updateInner(e, t.startState.doc.length, i), t.transactions.length && (this.lastUpdate = Date.now()), !0);
  }
  // Used by update and the constructor do perform the actual DOM
  // update
  updateInner(t, e, i) {
    this.view.viewState.mustMeasureContent = !0, this.updateChildren(t, e, i);
    let { observer: s } = this.view;
    s.ignore(() => {
      this.dom.style.height = this.view.viewState.contentHeight / this.view.scaleY + "px", this.dom.style.flexBasis = this.minWidth ? this.minWidth + "px" : "";
      let o = M.chrome || M.ios ? { node: s.selectionRange.focusNode, written: !1 } : void 0;
      this.sync(this.view, o), this.flags &= -8, o && (o.written || s.selectionRange.focusNode != o.node) && (this.forceSelection = !0), this.dom.style.height = "";
    }), this.markedForComposition.forEach(
      (o) => o.flags &= -9
      /* ViewFlag.Composition */
    );
    let r = [];
    if (this.view.viewport.from || this.view.viewport.to < this.view.state.doc.length)
      for (let o of this.children)
        o instanceof De && o.widget instanceof cl && r.push(o.dom);
    s.updateGaps(r);
  }
  updateChildren(t, e, i) {
    let s = i ? i.range.addToSet(t.slice()) : t, r = this.childCursor(e);
    for (let o = s.length - 1; ; o--) {
      let l = o >= 0 ? s[o] : null;
      if (!l)
        break;
      let { fromA: a, toA: h, fromB: c, toB: f } = l, u, d, p, g;
      if (i && i.range.fromB < f && i.range.toB > c) {
        let k = wi.build(this.view.state.doc, c, i.range.fromB, this.decorations, this.dynamicDecorationMap), w = wi.build(this.view.state.doc, i.range.toB, f, this.decorations, this.dynamicDecorationMap);
        d = k.breakAtStart, p = k.openStart, g = w.openEnd;
        let S = this.compositionView(i);
        w.breakAtStart ? S.breakAfter = 1 : w.content.length && S.merge(S.length, S.length, w.content[0], !1, w.openStart, 0) && (S.breakAfter = w.content[0].breakAfter, w.content.shift()), k.content.length && S.merge(0, 0, k.content[k.content.length - 1], !0, 0, k.openEnd) && k.content.pop(), u = k.content.concat(S).concat(w.content);
      } else
        ({ content: u, breakAtStart: d, openStart: p, openEnd: g } = wi.build(this.view.state.doc, c, f, this.decorations, this.dynamicDecorationMap));
      let { i: m, off: b } = r.findPos(h, 1), { i: v, off: O } = r.findPos(a, -1);
      oh(this, v, O, m, b, u, d, p, g);
    }
    i && this.fixCompositionDOM(i);
  }
  compositionView(t) {
    let e = new jt(t.text.nodeValue);
    e.flags |= 8;
    for (let { deco: s } of t.marks)
      e = new ne(s, [e], e.length);
    let i = new bt();
    return i.append(e, 0), i;
  }
  fixCompositionDOM(t) {
    let e = (r, o) => {
      o.flags |= 8 | (o.children.some(
        (a) => a.flags & 7
        /* ViewFlag.Dirty */
      ) ? 1 : 0), this.markedForComposition.add(o);
      let l = G.get(r);
      l != o && (l && (l.dom = null), o.setDOM(r));
    }, i = this.childPos(t.range.fromB, 1), s = this.children[i.i];
    e(t.line, s);
    for (let r = t.marks.length - 1; r >= -1; r--)
      i = s.childPos(i.off, 1), s = s.children[i.i], e(r >= 0 ? t.marks[r].node : t.text, s);
  }
  // Sync the DOM selection to this.state.selection
  updateSelection(t = !1, e = !1) {
    (t || !this.view.observer.selectionRange.focusNode) && this.view.observer.readSelectionRange();
    let i = this.view.root.activeElement, s = i == this.dom, r = !s && vn(this.dom, this.view.observer.selectionRange) && !(i && this.dom.contains(i));
    if (!(s || e || r))
      return;
    let o = this.forceSelection;
    this.forceSelection = !1;
    let l = this.view.state.selection.main, a = this.domAtPos(l.anchor), h = l.empty ? a : this.domAtPos(l.head);
    if (M.gecko && l.empty && !this.hasComposition && ud(a)) {
      let f = document.createTextNode("");
      this.view.observer.ignore(() => a.node.insertBefore(f, a.node.childNodes[a.offset] || null)), a = h = new xt(f, 0), o = !0;
    }
    let c = this.view.observer.selectionRange;
    (o || !c.focusNode || !Gn(a.node, a.offset, c.anchorNode, c.anchorOffset) || !Gn(h.node, h.offset, c.focusNode, c.focusOffset)) && (this.view.observer.ignore(() => {
      M.android && M.chrome && this.dom.contains(c.focusNode) && bd(c.focusNode, this.dom) && (this.dom.blur(), this.dom.focus({ preventScroll: !0 }));
      let f = Nn(this.view.root);
      if (f)
        if (l.empty) {
          if (M.gecko) {
            let u = pd(a.node, a.offset);
            if (u && u != 3) {
              let d = Ph(a.node, a.offset, u == 1 ? 1 : -1);
              d && (a = new xt(d, u == 1 ? 0 : d.nodeValue.length));
            }
          }
          f.collapse(a.node, a.offset), l.bidiLevel != null && c.caretBidiLevel != null && (c.caretBidiLevel = l.bidiLevel);
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
    }), this.view.observer.setSelectionRange(a, h)), this.impreciseAnchor = a.precise ? null : new xt(c.anchorNode, c.anchorOffset), this.impreciseHead = h.precise ? null : new xt(c.focusNode, c.focusOffset);
  }
  enforceCursorAssoc() {
    if (this.hasComposition)
      return;
    let { view: t } = this, e = t.state.selection.main, i = Nn(t.root), { anchorNode: s, anchorOffset: r } = t.observer.selectionRange;
    if (!i || !e.empty || !e.assoc || !i.modify)
      return;
    let o = bt.find(this, e.head);
    if (!o)
      return;
    let l = o.posAtStart;
    if (e.head == l || e.head == l + o.length)
      return;
    let a = this.coordsAt(e.head, -1), h = this.coordsAt(e.head, 1);
    if (!a || !h || a.bottom > h.top)
      return;
    let c = this.domAtPos(e.head + e.assoc);
    i.collapse(c.node, c.offset), i.modify("move", e.assoc < 0 ? "forward" : "backward", "lineboundary"), t.observer.readSelectionRange();
    let f = t.observer.selectionRange;
    t.docView.posFromDOM(f.anchorNode, f.anchorOffset) != e.from && i.collapse(s, r);
  }
  nearest(t) {
    for (let e = t; e; ) {
      let i = G.get(e);
      if (i && i.rootView == this)
        return i;
      e = e.parentNode;
    }
    return null;
  }
  posFromDOM(t, e) {
    let i = this.nearest(t);
    if (!i)
      throw new RangeError("Trying to find position for a DOM position outside of the document");
    return i.localPosFromDOM(t, e) + i.posAtStart;
  }
  domAtPos(t) {
    let { i: e, off: i } = this.childCursor().findPos(t, -1);
    for (; e < this.children.length - 1; ) {
      let s = this.children[e];
      if (i < s.length || s instanceof bt)
        break;
      e++, i = 0;
    }
    return this.children[e].domAtPos(i);
  }
  coordsAt(t, e) {
    for (let i = this.length, s = this.children.length - 1; ; s--) {
      let r = this.children[s], o = i - r.breakAfter - r.length;
      if (t > o || t == o && r.type != K.WidgetBefore && r.type != K.WidgetAfter && (!s || e == 2 || this.children[s - 1].breakAfter || this.children[s - 1].type == K.WidgetBefore && e > -2))
        return r.coordsAt(t - o, e);
      i = o;
    }
  }
  coordsForChar(t) {
    let { i: e, off: i } = this.childPos(t, 1), s = this.children[e];
    if (!(s instanceof bt))
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
    if (!(s instanceof jt))
      return null;
    let r = ut(s.text, i);
    if (r == i)
      return null;
    let o = Ve(s.dom, i, r).getClientRects();
    return !o.length || o[0].top >= o[0].bottom ? null : o[0];
  }
  measureVisibleLineHeights(t) {
    let e = [], { from: i, to: s } = t, r = this.view.contentDOM.clientWidth, o = r > Math.max(this.view.scrollDOM.clientWidth, this.minWidth) + 1, l = -1, a = this.view.textDirection == z.LTR;
    for (let h = 0, c = 0; c < this.children.length; c++) {
      let f = this.children[c], u = h + f.length;
      if (u > s)
        break;
      if (h >= i) {
        let d = f.dom.getBoundingClientRect();
        if (e.push(d.height), o) {
          let p = f.dom.lastChild, g = p ? Ri(p) : [];
          if (g.length) {
            let m = g[g.length - 1], b = a ? m.right - d.left : d.right - m.left;
            b > l && (l = b, this.minWidth = r, this.minWidthFrom = h, this.minWidthTo = u);
          }
        }
      }
      h = u + f.breakAfter;
    }
    return e;
  }
  textDirectionAt(t) {
    let { i: e } = this.childPos(t, 1);
    return getComputedStyle(this.children[e].dom).direction == "rtl" ? z.RTL : z.LTR;
  }
  measureTextSize() {
    for (let r of this.children)
      if (r instanceof bt) {
        let o = r.measureTextSize();
        if (o)
          return o;
      }
    let t = document.createElement("div"), e, i, s;
    return t.className = "cm-line", t.style.width = "99999px", t.style.position = "absolute", t.textContent = "abc def ghi jkl mno pqr stu", this.view.observer.ignore(() => {
      this.dom.appendChild(t);
      let r = Ri(t.firstChild)[0];
      e = t.getBoundingClientRect().height, i = r ? r.width / 27 : 7, s = r ? r.height : e, t.remove();
    }), { lineHeight: e, charWidth: i, textHeight: s };
  }
  childCursor(t = this.length) {
    let e = this.children.length;
    return e && (t -= this.children[--e].length), new rh(this.children, t, e);
  }
  computeBlockGapDeco() {
    let t = [], e = this.view.viewState;
    for (let i = 0, s = 0; ; s++) {
      let r = s == e.viewports.length ? null : e.viewports[s], o = r ? r.from - 1 : this.length;
      if (o > i) {
        let l = (e.lineBlockAt(o).bottom - e.lineBlockAt(i).top) / this.view.scaleY;
        t.push(T.replace({
          widget: new cl(l),
          block: !0,
          inclusive: !0,
          isBlockGap: !0
        }).range(i, o));
      }
      if (!r)
        break;
      i = r.to + 1;
    }
    return T.set(t);
  }
  updateDeco() {
    let t = this.view.state.facet(Zi).map((e, i) => (this.dynamicDecorationMap[i] = typeof e == "function") ? e(this.view) : e);
    for (let e = t.length; e < t.length + 3; e++)
      this.dynamicDecorationMap[e] = !1;
    return this.decorations = [
      ...t,
      this.computeBlockGapDeco(),
      this.view.viewState.lineGapDeco
    ];
  }
  scrollIntoView(t) {
    let { range: e } = t, i = this.coordsAt(e.head, e.empty ? e.assoc : e.head > e.anchor ? -1 : 1), s;
    if (!i)
      return;
    !e.empty && (s = this.coordsAt(e.anchor, e.anchor > e.head ? -1 : 1)) && (i = {
      left: Math.min(i.left, s.left),
      top: Math.min(i.top, s.top),
      right: Math.max(i.right, s.right),
      bottom: Math.max(i.bottom, s.bottom)
    });
    let r = Ah(this.view), o = {
      left: i.left - r.left,
      top: i.top - r.top,
      right: i.right + r.right,
      bottom: i.bottom + r.bottom
    };
    Yu(this.view.scrollDOM, o, e.head < e.anchor ? -1 : 1, t.x, t.y, t.xMargin, t.yMargin, this.view.textDirection == z.LTR);
  }
}
function ud(n) {
  return n.node.nodeType == 1 && n.node.firstChild && (n.offset == 0 || n.node.childNodes[n.offset - 1].contentEditable == "false") && (n.offset == n.node.childNodes.length || n.node.childNodes[n.offset].contentEditable == "false");
}
class cl extends Se {
  constructor(t) {
    super(), this.height = t;
  }
  toDOM() {
    let t = document.createElement("div");
    return this.updateDOM(t), t;
  }
  eq(t) {
    return t.height == this.height;
  }
  updateDOM(t) {
    return t.style.height = this.height + "px", !0;
  }
  get estimatedHeight() {
    return this.height;
  }
}
function Dh(n, t) {
  let e = n.observer.selectionRange, i = e.focusNode && Ph(e.focusNode, e.focusOffset, 0);
  if (!i)
    return null;
  let s = G.get(i), r, o;
  if (s instanceof jt)
    r = s.posAtStart, o = r + s.length;
  else {
    let l = Math.max(0, i.nodeValue.length - t);
    t:
      for (let a = 0, h = i; ; ) {
        for (let f = h.previousSibling, u; f; f = f.previousSibling) {
          if (u = G.get(f)) {
            o = u.posAtEnd + a, r = Math.max(0, o - l);
            break t;
          }
          let d = new ah([], n.state);
          if (d.readNode(f), d.text.indexOf(Fe) > -1)
            return null;
          a += d.text.length;
        }
        if (h = h.parentNode, !h)
          return null;
        let c = G.get(h);
        if (c) {
          r = c.posAtStart + a, o = r + l;
          break;
        }
      }
  }
  return { from: r, to: o, node: i };
}
function dd(n, t) {
  let e = Dh(n, t.newLength - t.length);
  if (!e)
    return null;
  let { from: i, to: s, node: r } = e, o = t.mapPos(i, -1), l = t.mapPos(s, 1), a = r.nodeValue;
  if (/[\n\r]/.test(a))
    return null;
  if (l - o != a.length) {
    let u = t.mapPos(i, 1), d = t.mapPos(s, -1);
    if (d - u == a.length)
      o = u, l = d;
    else if (n.state.doc.sliceString(l - a.length, l) == a)
      o = l - a.length;
    else if (n.state.doc.sliceString(o, o + a.length) == a)
      l = o + a.length;
    else
      return null;
  }
  let { main: h } = n.state.selection;
  if (n.state.doc.sliceString(o, l) != a || o > h.head || l < h.head)
    return null;
  let c = [], f = new Xt(i, s, o, l);
  for (let u = r.parentNode; ; u = u.parentNode) {
    let d = G.get(u);
    if (d instanceof ne)
      c.push({ node: u, deco: d.mark });
    else {
      if (d instanceof bt || u.nodeName == "DIV" && u.parentNode == n.contentDOM)
        return { range: f, text: r, marks: c, line: u };
      if (u != n.contentDOM)
        c.push({ node: u, deco: new Gi({
          inclusive: !0,
          attributes: td(u),
          tagName: u.tagName.toLowerCase()
        }) });
      else
        return null;
    }
  }
}
function Ph(n, t, e) {
  if (e <= 0)
    for (let i = n, s = t; ; ) {
      if (i.nodeType == 3)
        return i;
      if (i.nodeType == 1 && s > 0)
        i = i.childNodes[s - 1], s = ye(i);
      else
        break;
    }
  if (e >= 0)
    for (let i = n, s = t; ; ) {
      if (i.nodeType == 3)
        return i;
      if (i.nodeType == 1 && s < i.childNodes.length && e >= 0)
        i = i.childNodes[s], s = 0;
      else
        break;
    }
  return null;
}
function pd(n, t) {
  return n.nodeType != 1 ? 0 : (t && n.childNodes[t - 1].contentEditable == "false" ? 1 : 0) | (t < n.childNodes.length && n.childNodes[t].contentEditable == "false" ? 2 : 0);
}
let md = class {
  constructor() {
    this.changes = [];
  }
  compareRange(t, e) {
    xr(t, e, this.changes);
  }
  comparePoint(t, e) {
    xr(t, e, this.changes);
  }
};
function gd(n, t, e) {
  let i = new md();
  return I.compare(n, t, e, i), i.changes;
}
function bd(n, t) {
  for (let e = n; e && e != t; e = e.assignedSlot || e.parentNode)
    if (e.nodeType == 1 && e.contentEditable == "false")
      return !0;
  return !1;
}
function yd(n, t, e = 1) {
  let i = n.charCategorizer(t), s = n.doc.lineAt(t), r = t - s.from;
  if (s.length == 0)
    return y.cursor(t);
  r == 0 ? e = 1 : r == s.length && (e = -1);
  let o = r, l = r;
  e < 0 ? o = ut(s.text, r, !1) : l = ut(s.text, r);
  let a = i(s.text.slice(o, l));
  for (; o > 0; ) {
    let h = ut(s.text, o, !1);
    if (i(s.text.slice(h, o)) != a)
      break;
    o = h;
  }
  for (; l < s.length; ) {
    let h = ut(s.text, l);
    if (i(s.text.slice(l, h)) != a)
      break;
    l = h;
  }
  return y.range(o + s.from, l + s.from);
}
function xd(n, t) {
  return t.left > n ? t.left - n : Math.max(0, n - t.right);
}
function kd(n, t) {
  return t.top > n ? t.top - n : Math.max(0, n - t.bottom);
}
function Ps(n, t) {
  return n.top < t.bottom - 1 && n.bottom > t.top + 1;
}
function fl(n, t) {
  return t < n.top ? { top: t, left: n.left, right: n.right, bottom: n.bottom } : n;
}
function ul(n, t) {
  return t > n.bottom ? { top: n.top, left: n.left, right: n.right, bottom: t } : n;
}
function Cr(n, t, e) {
  let i, s, r, o, l = !1, a, h, c, f;
  for (let p = n.firstChild; p; p = p.nextSibling) {
    let g = Ri(p);
    for (let m = 0; m < g.length; m++) {
      let b = g[m];
      s && Ps(s, b) && (b = fl(ul(b, s.bottom), s.top));
      let v = xd(t, b), O = kd(e, b);
      if (v == 0 && O == 0)
        return p.nodeType == 3 ? dl(p, t, e) : Cr(p, t, e);
      if (!i || o > O || o == O && r > v) {
        i = p, s = b, r = v, o = O;
        let k = O ? e < b.top ? -1 : 1 : v ? t < b.left ? -1 : 1 : 0;
        l = !k || (k > 0 ? m < g.length - 1 : m > 0);
      }
      v == 0 ? e > b.bottom && (!c || c.bottom < b.bottom) ? (a = p, c = b) : e < b.top && (!f || f.top > b.top) && (h = p, f = b) : c && Ps(c, b) ? c = ul(c, b.bottom) : f && Ps(f, b) && (f = fl(f, b.top));
    }
  }
  if (c && c.bottom >= e ? (i = a, s = c) : f && f.top <= e && (i = h, s = f), !i)
    return { node: n, offset: 0 };
  let u = Math.max(s.left, Math.min(s.right, t));
  if (i.nodeType == 3)
    return dl(i, u, e);
  if (l && i.contentEditable != "false")
    return Cr(i, u, e);
  let d = Array.prototype.indexOf.call(n.childNodes, i) + (t >= (s.left + s.right) / 2 ? 1 : 0);
  return { node: n, offset: d };
}
function dl(n, t, e) {
  let i = n.nodeValue.length, s = -1, r = 1e9, o = 0;
  for (let l = 0; l < i; l++) {
    let a = Ve(n, l, l + 1).getClientRects();
    for (let h = 0; h < a.length; h++) {
      let c = a[h];
      if (c.top == c.bottom)
        continue;
      o || (o = t - c.left);
      let f = (c.top > e ? c.top - e : e - c.bottom) - 1;
      if (c.left - 1 <= t && c.right + 1 >= t && f < r) {
        let u = t >= (c.left + c.right) / 2, d = u;
        if ((M.chrome || M.gecko) && Ve(n, l).getBoundingClientRect().left == c.right && (d = !u), f <= 0)
          return { node: n, offset: l + (d ? 1 : 0) };
        s = l + (d ? 1 : 0), r = f;
      }
    }
  }
  return { node: n, offset: s > -1 ? s : o > 0 ? n.nodeValue.length : 0 };
}
function Vh(n, t, e, i = -1) {
  var s, r;
  let o = n.contentDOM.getBoundingClientRect(), l = o.top + n.viewState.paddingTop, a, { docHeight: h } = n.viewState, { x: c, y: f } = t, u = f - l;
  if (u < 0)
    return 0;
  if (u > h)
    return n.state.doc.length;
  for (let k = n.viewState.heightOracle.textHeight / 2, w = !1; a = n.elementAtHeight(u), a.type != K.Text; )
    for (; u = i > 0 ? a.bottom + k : a.top - k, !(u >= 0 && u <= h); ) {
      if (w)
        return e ? null : 0;
      w = !0, i = -i;
    }
  f = l + u;
  let d = a.from;
  if (d < n.viewport.from)
    return n.viewport.from == 0 ? 0 : e ? null : pl(n, o, a, c, f);
  if (d > n.viewport.to)
    return n.viewport.to == n.state.doc.length ? n.state.doc.length : e ? null : pl(n, o, a, c, f);
  let p = n.dom.ownerDocument, g = n.root.elementFromPoint ? n.root : p, m = g.elementFromPoint(c, f);
  m && !n.contentDOM.contains(m) && (m = null), m || (c = Math.max(o.left + 1, Math.min(o.right - 1, c)), m = g.elementFromPoint(c, f), m && !n.contentDOM.contains(m) && (m = null));
  let b, v = -1;
  if (m && ((s = n.docView.nearest(m)) === null || s === void 0 ? void 0 : s.isEditable) != !1) {
    if (p.caretPositionFromPoint) {
      let k = p.caretPositionFromPoint(c, f);
      k && ({ offsetNode: b, offset: v } = k);
    } else if (p.caretRangeFromPoint) {
      let k = p.caretRangeFromPoint(c, f);
      k && ({ startContainer: b, startOffset: v } = k, (!n.contentDOM.contains(b) || M.safari && wd(b, v, c) || M.chrome && Sd(b, v, c)) && (b = void 0));
    }
  }
  if (!b || !n.docView.dom.contains(b)) {
    let k = bt.find(n.docView, d);
    if (!k)
      return u > a.top + a.height / 2 ? a.to : a.from;
    ({ node: b, offset: v } = Cr(k.dom, c, f));
  }
  let O = n.docView.nearest(b);
  if (!O)
    return null;
  if (O.isWidget && ((r = O.dom) === null || r === void 0 ? void 0 : r.nodeType) == 1) {
    let k = O.dom.getBoundingClientRect();
    return t.y < k.top || t.y <= k.bottom && t.x <= (k.left + k.right) / 2 ? O.posAtStart : O.posAtEnd;
  } else
    return O.localPosFromDOM(b, v) + O.posAtStart;
}
function pl(n, t, e, i, s) {
  let r = Math.round((i - t.left) * n.defaultCharacterWidth);
  if (n.lineWrapping && e.height > n.defaultLineHeight * 1.5) {
    let l = n.viewState.heightOracle.textHeight, a = Math.floor((s - e.top - (n.defaultLineHeight - l) * 0.5) / l);
    r += a * n.viewState.heightOracle.lineLength;
  }
  let o = n.state.sliceDoc(e.from, e.to);
  return e.from + Eu(o, r, n.state.tabSize);
}
function wd(n, t, e) {
  let i;
  if (n.nodeType != 3 || t != (i = n.nodeValue.length))
    return !1;
  for (let s = n.nextSibling; s; s = s.nextSibling)
    if (s.nodeType != 1 || s.nodeName != "BR")
      return !1;
  return Ve(n, i - 1, i).getBoundingClientRect().left > e;
}
function Sd(n, t, e) {
  if (t != 0)
    return !1;
  for (let s = n; ; ) {
    let r = s.parentNode;
    if (!r || r.nodeType != 1 || r.firstChild != s)
      return !1;
    if (r.classList.contains("cm-line"))
      break;
    s = r;
  }
  let i = n.nodeType == 1 ? n.getBoundingClientRect() : Ve(n, 0, Math.max(n.nodeValue.length, 1)).getBoundingClientRect();
  return e - i.left > 5;
}
function Or(n, t) {
  let e = n.lineBlockAt(t);
  if (Array.isArray(e.type)) {
    for (let i of e.type)
      if (i.to > t || i.to == t && (i.to == e.to || i.type == K.Text))
        return i;
  }
  return e;
}
function vd(n, t, e, i) {
  let s = Or(n, t.head), r = !i || s.type != K.Text || !(n.lineWrapping || s.widgetLineBreaks) ? null : n.coordsAtPos(t.assoc < 0 && t.head > s.from ? t.head - 1 : t.head);
  if (r) {
    let o = n.dom.getBoundingClientRect(), l = n.textDirectionAt(s.from), a = n.posAtCoords({
      x: e == (l == z.LTR) ? o.right - 1 : o.left + 1,
      y: (r.top + r.bottom) / 2
    });
    if (a != null)
      return y.cursor(a, e ? -1 : 1);
  }
  return y.cursor(e ? s.to : s.from, e ? -1 : 1);
}
function ml(n, t, e, i) {
  let s = n.state.doc.lineAt(t.head), r = n.bidiSpans(s), o = n.textDirectionAt(s.from);
  for (let l = t, a = null; ; ) {
    let h = fd(s, r, o, l, e), c = Th;
    if (!h) {
      if (s.number == (e ? n.state.doc.lines : 1))
        return l;
      c = `
`, s = n.state.doc.line(s.number + (e ? 1 : -1)), r = n.bidiSpans(s), h = y.cursor(e ? s.from : s.to);
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
function Cd(n, t, e) {
  let i = n.state.charCategorizer(t), s = i(e);
  return (r) => {
    let o = i(r);
    return s == $.Space && (s = o), s == o;
  };
}
function Od(n, t, e, i) {
  let s = t.head, r = e ? 1 : -1;
  if (s == (e ? n.state.doc.length : 0))
    return y.cursor(s, t.assoc);
  let o = t.goalColumn, l, a = n.contentDOM.getBoundingClientRect(), h = n.coordsAtPos(s), c = n.documentTop;
  if (h)
    o == null && (o = h.left - a.left), l = r < 0 ? h.top : h.bottom;
  else {
    let d = n.viewState.lineBlockAt(s);
    o == null && (o = Math.min(a.right - a.left, n.defaultCharacterWidth * (s - d.from))), l = (r < 0 ? d.top : d.bottom) + c;
  }
  let f = a.left + o, u = i ?? n.viewState.heightOracle.textHeight >> 1;
  for (let d = 0; ; d += 10) {
    let p = l + (u + d) * r, g = Vh(n, { x: f, y: p }, !1, r);
    if (p < a.top || p > a.bottom || (r < 0 ? g < s : g > s))
      return y.cursor(g, t.assoc, void 0, o);
  }
}
function Cn(n, t, e) {
  for (; ; ) {
    let i = 0;
    for (let s of n)
      s.between(t - 1, t + 1, (r, o, l) => {
        if (t > r && t < o) {
          let a = i || e || (t - r < o - t ? -1 : 1);
          t = a < 0 ? r : o, i = a;
        }
      });
    if (!i)
      return t;
  }
}
function Vs(n, t, e) {
  let i = Cn(n.state.facet(ro).map((s) => s(n)), e.from, t.head > e.from ? -1 : 1);
  return i == e.from ? e : y.cursor(i, i < e.from ? 1 : -1);
}
class Ad {
  setSelectionOrigin(t) {
    this.lastSelectionOrigin = t, this.lastSelectionTime = Date.now();
  }
  constructor(t) {
    this.lastKeyCode = 0, this.lastKeyTime = 0, this.lastTouchTime = 0, this.lastFocusTime = 0, this.lastScrollTop = 0, this.lastScrollLeft = 0, this.chromeScrollHack = -1, this.pendingIOSKey = void 0, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastEscPress = 0, this.lastContextMenu = 0, this.scrollHandlers = [], this.registeredEvents = [], this.customHandlers = [], this.composing = -1, this.compositionFirstChange = null, this.compositionEndedAt = 0, this.compositionPendingKey = !1, this.compositionPendingChange = !1, this.mouseSelection = null;
    let e = (i, s) => {
      this.ignoreDuringComposition(s) || s.type == "keydown" && this.keydown(t, s) || (this.mustFlushObserver(s) && t.observer.forceFlush(), this.runCustomHandlers(s.type, t, s) ? s.preventDefault() : i(t, s));
    };
    for (let i in j) {
      let s = j[i];
      t.contentDOM.addEventListener(i, (r) => {
        gl(t, r) && e(s, r);
      }, Ar[i]), this.registeredEvents.push(i);
    }
    t.scrollDOM.addEventListener("mousedown", (i) => {
      if (i.target == t.scrollDOM && i.clientY > t.contentDOM.getBoundingClientRect().bottom && (e(j.mousedown, i), !i.defaultPrevented && i.button == 2)) {
        let s = t.contentDOM.style.minHeight;
        t.contentDOM.style.minHeight = "100%", setTimeout(() => t.contentDOM.style.minHeight = s, 200);
      }
    }), t.scrollDOM.addEventListener("drop", (i) => {
      i.target == t.scrollDOM && i.clientY > t.contentDOM.getBoundingClientRect().bottom && e(j.drop, i);
    }), M.chrome && M.chrome_version == 102 && t.scrollDOM.addEventListener("wheel", () => {
      this.chromeScrollHack < 0 ? t.contentDOM.style.pointerEvents = "none" : window.clearTimeout(this.chromeScrollHack), this.chromeScrollHack = setTimeout(() => {
        this.chromeScrollHack = -1, t.contentDOM.style.pointerEvents = "";
      }, 100);
    }, { passive: !0 }), this.notifiedFocused = t.hasFocus, M.safari && t.contentDOM.addEventListener("input", () => null), M.gecko && Nd(t.contentDOM.ownerDocument);
  }
  ensureHandlers(t, e) {
    var i;
    let s;
    this.customHandlers = [];
    for (let r of e)
      if (s = (i = r.update(t).spec) === null || i === void 0 ? void 0 : i.domEventHandlers) {
        this.customHandlers.push({ plugin: r.value, handlers: s });
        for (let o in s)
          this.registeredEvents.indexOf(o) < 0 && o != "scroll" && (this.registeredEvents.push(o), t.contentDOM.addEventListener(o, (l) => {
            gl(t, l) && this.runCustomHandlers(o, t, l) && l.preventDefault();
          }));
      }
  }
  runCustomHandlers(t, e, i) {
    for (let s of this.customHandlers) {
      let r = s.handlers[t];
      if (r)
        try {
          if (r.call(s.plugin, i, e) || i.defaultPrevented)
            return !0;
        } catch (o) {
          Vt(e.state, o);
        }
    }
    return !1;
  }
  runScrollHandlers(t, e) {
    this.lastScrollTop = t.scrollDOM.scrollTop, this.lastScrollLeft = t.scrollDOM.scrollLeft;
    for (let i of this.customHandlers) {
      let s = i.handlers.scroll;
      if (s)
        try {
          s.call(i.plugin, e, t);
        } catch (r) {
          Vt(t.state, r);
        }
    }
  }
  keydown(t, e) {
    if (this.lastKeyCode = e.keyCode, this.lastKeyTime = Date.now(), e.keyCode == 9 && Date.now() < this.lastEscPress + 2e3)
      return !0;
    if (e.keyCode != 27 && Wh.indexOf(e.keyCode) < 0 && (t.inputState.lastEscPress = 0), M.android && M.chrome && !e.synthetic && (e.keyCode == 13 || e.keyCode == 8))
      return t.observer.delayAndroidKey(e.key, e.keyCode), !0;
    let i;
    return M.ios && !e.synthetic && !e.altKey && !e.metaKey && ((i = Bh.find((s) => s.keyCode == e.keyCode)) && !e.ctrlKey || Md.indexOf(e.key) > -1 && e.ctrlKey && !e.shiftKey) ? (this.pendingIOSKey = i || e, setTimeout(() => this.flushIOSKey(t), 250), !0) : !1;
  }
  flushIOSKey(t) {
    let e = this.pendingIOSKey;
    return e ? (this.pendingIOSKey = void 0, $e(t.contentDOM, e.key, e.keyCode)) : !1;
  }
  ignoreDuringComposition(t) {
    return /^key/.test(t.type) ? this.composing > 0 ? !0 : M.safari && !M.ios && this.compositionPendingKey && Date.now() - this.compositionEndedAt < 100 ? (this.compositionPendingKey = !1, !0) : !1 : !1;
  }
  mustFlushObserver(t) {
    return t.type == "keydown" && t.keyCode != 229;
  }
  startMouseSelection(t) {
    this.mouseSelection && this.mouseSelection.destroy(), this.mouseSelection = t;
  }
  update(t) {
    this.mouseSelection && this.mouseSelection.update(t), t.transactions.length && (this.lastKeyCode = this.lastSelectionTime = 0);
  }
  destroy() {
    this.mouseSelection && this.mouseSelection.destroy();
  }
}
const Bh = [
  { key: "Backspace", keyCode: 8, inputType: "deleteContentBackward" },
  { key: "Enter", keyCode: 13, inputType: "insertParagraph" },
  { key: "Enter", keyCode: 13, inputType: "insertLineBreak" },
  { key: "Delete", keyCode: 46, inputType: "deleteContentForward" }
], Md = "dthko", Wh = [16, 17, 18, 20, 91, 92, 224, 225], en = 6;
function nn(n) {
  return Math.max(0, n) * 0.7 + 8;
}
function Rd(n, t) {
  return Math.max(Math.abs(n.clientX - t.clientX), Math.abs(n.clientY - t.clientY));
}
class Zd {
  constructor(t, e, i, s) {
    this.view = t, this.startEvent = e, this.style = i, this.mustSelect = s, this.scrollSpeed = { x: 0, y: 0 }, this.scrolling = -1, this.lastEvent = e, this.scrollParent = Ju(t.contentDOM), this.atoms = t.state.facet(ro).map((o) => o(t));
    let r = t.contentDOM.ownerDocument;
    r.addEventListener("mousemove", this.move = this.move.bind(this)), r.addEventListener("mouseup", this.up = this.up.bind(this)), this.extend = e.shiftKey, this.multiple = t.state.facet(X.allowMultipleSelections) && Ld(t, e), this.dragging = Dd(t, e) && Nh(e) == 1 ? null : !1;
  }
  start(t) {
    this.dragging === !1 && (t.preventDefault(), this.select(t));
  }
  move(t) {
    var e;
    if (t.buttons == 0)
      return this.destroy();
    if (this.dragging || this.dragging == null && Rd(this.startEvent, t) < 10)
      return;
    this.select(this.lastEvent = t);
    let i = 0, s = 0, r = ((e = this.scrollParent) === null || e === void 0 ? void 0 : e.getBoundingClientRect()) || { left: 0, top: 0, right: this.view.win.innerWidth, bottom: this.view.win.innerHeight }, o = Ah(this.view);
    t.clientX - o.left <= r.left + en ? i = -nn(r.left - t.clientX) : t.clientX + o.right >= r.right - en && (i = nn(t.clientX - r.right)), t.clientY - o.top <= r.top + en ? s = -nn(r.top - t.clientY) : t.clientY + o.bottom >= r.bottom - en && (s = nn(t.clientY - r.bottom)), this.setScrollSpeed(i, s);
  }
  up(t) {
    this.dragging == null && this.select(this.lastEvent), this.dragging || t.preventDefault(), this.destroy();
  }
  destroy() {
    this.setScrollSpeed(0, 0);
    let t = this.view.contentDOM.ownerDocument;
    t.removeEventListener("mousemove", this.move), t.removeEventListener("mouseup", this.up), this.view.inputState.mouseSelection = null;
  }
  setScrollSpeed(t, e) {
    this.scrollSpeed = { x: t, y: e }, t || e ? this.scrolling < 0 && (this.scrolling = setInterval(() => this.scroll(), 50)) : this.scrolling > -1 && (clearInterval(this.scrolling), this.scrolling = -1);
  }
  scroll() {
    this.scrollParent ? (this.scrollParent.scrollLeft += this.scrollSpeed.x, this.scrollParent.scrollTop += this.scrollSpeed.y) : this.view.win.scrollBy(this.scrollSpeed.x, this.scrollSpeed.y), this.dragging === !1 && this.select(this.lastEvent);
  }
  skipAtoms(t) {
    let e = null;
    for (let i = 0; i < t.ranges.length; i++) {
      let s = t.ranges[i], r = null;
      if (s.empty) {
        let o = Cn(this.atoms, s.from, 0);
        o != s.from && (r = y.cursor(o, -1));
      } else {
        let o = Cn(this.atoms, s.from, -1), l = Cn(this.atoms, s.to, 1);
        (o != s.from || l != s.to) && (r = y.range(s.from == s.anchor ? o : l, s.from == s.head ? o : l));
      }
      r && (e || (e = t.ranges.slice()), e[i] = r);
    }
    return e ? y.create(e, t.mainIndex) : t;
  }
  select(t) {
    let { view: e } = this, i = this.skipAtoms(this.style.get(t, this.extend, this.multiple));
    (this.mustSelect || !i.eq(e.state.selection) || i.main.assoc != e.state.selection.main.assoc && this.dragging === !1) && this.view.dispatch({
      selection: i,
      userEvent: "select.pointer"
    }), this.mustSelect = !1;
  }
  update(t) {
    t.docChanged && this.dragging && (this.dragging = this.dragging.map(t.changes)), this.style.update(t) && setTimeout(() => this.select(this.lastEvent), 20);
  }
}
function Ld(n, t) {
  let e = n.state.facet(mh);
  return e.length ? e[0](t) : M.mac ? t.metaKey : t.ctrlKey;
}
function Td(n, t) {
  let e = n.state.facet(gh);
  return e.length ? e[0](t) : M.mac ? !t.altKey : !t.ctrlKey;
}
function Dd(n, t) {
  let { main: e } = n.state.selection;
  if (e.empty)
    return !1;
  let i = Nn(n.root);
  if (!i || i.rangeCount == 0)
    return !0;
  let s = i.getRangeAt(0).getClientRects();
  for (let r = 0; r < s.length; r++) {
    let o = s[r];
    if (o.left <= t.clientX && o.right >= t.clientX && o.top <= t.clientY && o.bottom >= t.clientY)
      return !0;
  }
  return !1;
}
function gl(n, t) {
  if (!t.bubbles)
    return !0;
  if (t.defaultPrevented)
    return !1;
  for (let e = t.target, i; e != n.contentDOM; e = e.parentNode)
    if (!e || e.nodeType == 11 || (i = G.get(e)) && i.ignoreEvent(t))
      return !1;
  return !0;
}
const j = /* @__PURE__ */ Object.create(null), Ar = /* @__PURE__ */ Object.create(null), Xh = M.ie && M.ie_version < 15 || M.ios && M.webkit_version < 604;
function Pd(n) {
  let t = n.dom.parentNode;
  if (!t)
    return;
  let e = t.appendChild(document.createElement("textarea"));
  e.style.cssText = "position: fixed; left: -10000px; top: 10px", e.focus(), setTimeout(() => {
    n.focus(), e.remove(), Ih(n, e.value);
  }, 50);
}
function Ih(n, t) {
  let { state: e } = n, i, s = 1, r = e.toText(t), o = r.lines == e.selection.ranges.length;
  if (Mr != null && e.selection.ranges.every((a) => a.empty) && Mr == r.toString()) {
    let a = -1;
    i = e.changeByRange((h) => {
      let c = e.doc.lineAt(h.from);
      if (c.from == a)
        return { range: h };
      a = c.from;
      let f = e.toText((o ? r.line(s++).text : t) + e.lineBreak);
      return {
        changes: { from: c.from, insert: f },
        range: y.cursor(h.from + f.length)
      };
    });
  } else
    o ? i = e.changeByRange((a) => {
      let h = r.line(s++);
      return {
        changes: { from: a.from, to: a.to, insert: h.text },
        range: y.cursor(a.from + h.length)
      };
    }) : i = e.replaceSelection(r);
  n.dispatch(i, {
    userEvent: "input.paste",
    scrollIntoView: !0
  });
}
j.keydown = (n, t) => {
  n.inputState.setSelectionOrigin("select"), t.keyCode == 27 && (n.inputState.lastEscPress = Date.now());
};
j.touchstart = (n, t) => {
  n.inputState.lastTouchTime = Date.now(), n.inputState.setSelectionOrigin("select.pointer");
};
j.touchmove = (n) => {
  n.inputState.setSelectionOrigin("select.pointer");
};
Ar.touchstart = Ar.touchmove = { passive: !0 };
j.mousedown = (n, t) => {
  if (n.observer.flush(), n.inputState.lastTouchTime > Date.now() - 2e3)
    return;
  let e = null;
  for (let i of n.state.facet(bh))
    if (e = i(n, t), e)
      break;
  if (!e && t.button == 0 && (e = Wd(n, t)), e) {
    let i = !n.hasFocus;
    n.inputState.startMouseSelection(new Zd(n, t, e, i)), i && n.observer.ignore(() => ih(n.contentDOM)), n.inputState.mouseSelection && n.inputState.mouseSelection.start(t);
  }
};
function bl(n, t, e, i) {
  if (i == 1)
    return y.cursor(t, e);
  if (i == 2)
    return yd(n.state, t, e);
  {
    let s = bt.find(n.docView, t), r = n.state.doc.lineAt(s ? s.posAtEnd : t), o = s ? s.posAtStart : r.from, l = s ? s.posAtEnd : r.to;
    return l < n.state.doc.length && l == r.to && l++, y.range(o, l);
  }
}
let Eh = (n, t) => n >= t.top && n <= t.bottom, yl = (n, t, e) => Eh(t, e) && n >= e.left && n <= e.right;
function Vd(n, t, e, i) {
  let s = bt.find(n.docView, t);
  if (!s)
    return 1;
  let r = t - s.posAtStart;
  if (r == 0)
    return 1;
  if (r == s.length)
    return -1;
  let o = s.coordsAt(r, -1);
  if (o && yl(e, i, o))
    return -1;
  let l = s.coordsAt(r, 1);
  return l && yl(e, i, l) ? 1 : o && Eh(i, o) ? -1 : 1;
}
function xl(n, t) {
  let e = n.posAtCoords({ x: t.clientX, y: t.clientY }, !1);
  return { pos: e, bias: Vd(n, e, t.clientX, t.clientY) };
}
const Bd = M.ie && M.ie_version <= 11;
let kl = null, wl = 0, Sl = 0;
function Nh(n) {
  if (!Bd)
    return n.detail;
  let t = kl, e = Sl;
  return kl = n, Sl = Date.now(), wl = !t || e > Date.now() - 400 && Math.abs(t.clientX - n.clientX) < 2 && Math.abs(t.clientY - n.clientY) < 2 ? (wl + 1) % 3 : 1;
}
function Wd(n, t) {
  let e = xl(n, t), i = Nh(t), s = n.state.selection;
  return {
    update(r) {
      r.docChanged && (e.pos = r.changes.mapPos(e.pos), s = s.map(r.changes));
    },
    get(r, o, l) {
      let a = xl(n, r), h, c = bl(n, a.pos, a.bias, i);
      if (e.pos != a.pos && !o) {
        let f = bl(n, e.pos, e.bias, i), u = Math.min(f.from, c.from), d = Math.max(f.to, c.to);
        c = u < c.from ? y.range(u, d) : y.range(d, u);
      }
      return o ? s.replaceRange(s.main.extend(c.from, c.to)) : l && i == 1 && s.ranges.length > 1 && (h = Xd(s, a.pos)) ? h : l ? s.addRange(c) : y.create([c]);
    }
  };
}
function Xd(n, t) {
  for (let e = 0; e < n.ranges.length; e++) {
    let { from: i, to: s } = n.ranges[e];
    if (i <= t && s >= t)
      return y.create(n.ranges.slice(0, e).concat(n.ranges.slice(e + 1)), n.mainIndex == e ? 0 : n.mainIndex - (n.mainIndex > e ? 1 : 0));
  }
  return null;
}
j.dragstart = (n, t) => {
  let { selection: { main: e } } = n.state, { mouseSelection: i } = n.inputState;
  i && (i.dragging = e), t.dataTransfer && (t.dataTransfer.setData("Text", n.state.sliceDoc(e.from, e.to)), t.dataTransfer.effectAllowed = "copyMove");
};
function vl(n, t, e, i) {
  if (!e)
    return;
  let s = n.posAtCoords({ x: t.clientX, y: t.clientY }, !1);
  t.preventDefault();
  let { mouseSelection: r } = n.inputState, o = i && r && r.dragging && Td(n, t) ? { from: r.dragging.from, to: r.dragging.to } : null, l = { from: s, insert: e }, a = n.state.changes(o ? [o, l] : l);
  n.focus(), n.dispatch({
    changes: a,
    selection: { anchor: a.mapPos(s, -1), head: a.mapPos(s, 1) },
    userEvent: o ? "move.drop" : "input.drop"
  });
}
j.drop = (n, t) => {
  if (!t.dataTransfer)
    return;
  if (n.state.readOnly)
    return t.preventDefault();
  let e = t.dataTransfer.files;
  if (e && e.length) {
    t.preventDefault();
    let i = Array(e.length), s = 0, r = () => {
      ++s == e.length && vl(n, t, i.filter((o) => o != null).join(n.state.lineBreak), !1);
    };
    for (let o = 0; o < e.length; o++) {
      let l = new FileReader();
      l.onerror = r, l.onload = () => {
        /[\x00-\x08\x0e-\x1f]{2}/.test(l.result) || (i[o] = l.result), r();
      }, l.readAsText(e[o]);
    }
  } else
    vl(n, t, t.dataTransfer.getData("Text"), !0);
};
j.paste = (n, t) => {
  if (n.state.readOnly)
    return t.preventDefault();
  n.observer.flush();
  let e = Xh ? null : t.clipboardData;
  e ? (Ih(n, e.getData("text/plain") || e.getData("text/uri-text")), t.preventDefault()) : Pd(n);
};
function Id(n, t) {
  let e = n.dom.parentNode;
  if (!e)
    return;
  let i = e.appendChild(document.createElement("textarea"));
  i.style.cssText = "position: fixed; left: -10000px; top: 10px", i.value = t, i.focus(), i.selectionEnd = t.length, i.selectionStart = 0, setTimeout(() => {
    i.remove(), n.focus();
  }, 50);
}
function Ed(n) {
  let t = [], e = [], i = !1;
  for (let s of n.selection.ranges)
    s.empty || (t.push(n.sliceDoc(s.from, s.to)), e.push(s));
  if (!t.length) {
    let s = -1;
    for (let { from: r } of n.selection.ranges) {
      let o = n.doc.lineAt(r);
      o.number > s && (t.push(o.text), e.push({ from: o.from, to: Math.min(n.doc.length, o.to + 1) })), s = o.number;
    }
    i = !0;
  }
  return { text: t.join(n.lineBreak), ranges: e, linewise: i };
}
let Mr = null;
j.copy = j.cut = (n, t) => {
  let { text: e, ranges: i, linewise: s } = Ed(n.state);
  if (!e && !s)
    return;
  Mr = s ? e : null;
  let r = Xh ? null : t.clipboardData;
  r ? (t.preventDefault(), r.clearData(), r.setData("text/plain", e)) : Id(n, e), t.type == "cut" && !n.state.readOnly && n.dispatch({
    changes: i,
    scrollIntoView: !0,
    userEvent: "delete.cut"
  });
};
const Gh = /* @__PURE__ */ re.define();
function Hh(n, t) {
  let e = [];
  for (let i of n.facet(kh)) {
    let s = i(n, t);
    s && e.push(s);
  }
  return e ? n.update({ effects: e, annotations: Gh.of(!0) }) : null;
}
function Fh(n) {
  setTimeout(() => {
    let t = n.hasFocus;
    if (t != n.inputState.notifiedFocused) {
      let e = Hh(n.state, t);
      e ? n.dispatch(e) : n.update([]);
    }
  }, 10);
}
j.focus = (n) => {
  n.inputState.lastFocusTime = Date.now(), !n.scrollDOM.scrollTop && (n.inputState.lastScrollTop || n.inputState.lastScrollLeft) && (n.scrollDOM.scrollTop = n.inputState.lastScrollTop, n.scrollDOM.scrollLeft = n.inputState.lastScrollLeft), Fh(n);
};
j.blur = (n) => {
  n.observer.clearSelectionRange(), Fh(n);
};
j.compositionstart = j.compositionupdate = (n) => {
  n.inputState.compositionFirstChange == null && (n.inputState.compositionFirstChange = !0), n.inputState.composing < 0 && (n.inputState.composing = 0);
};
j.compositionend = (n) => {
  n.inputState.composing = -1, n.inputState.compositionEndedAt = Date.now(), n.inputState.compositionPendingKey = !0, n.inputState.compositionPendingChange = n.observer.pendingRecords().length > 0, n.inputState.compositionFirstChange = null, M.chrome && M.android ? n.observer.flushSoon() : n.inputState.compositionPendingChange ? Promise.resolve().then(() => n.observer.flush()) : setTimeout(() => {
    n.inputState.composing < 0 && n.docView.hasComposition && n.update([]);
  }, 50);
};
j.contextmenu = (n) => {
  n.inputState.lastContextMenu = Date.now();
};
j.beforeinput = (n, t) => {
  var e;
  let i;
  if (M.chrome && M.android && (i = Bh.find((s) => s.inputType == t.inputType)) && (n.observer.delayAndroidKey(i.key, i.keyCode), i.key == "Backspace" || i.key == "Delete")) {
    let s = ((e = window.visualViewport) === null || e === void 0 ? void 0 : e.height) || 0;
    setTimeout(() => {
      var r;
      (((r = window.visualViewport) === null || r === void 0 ? void 0 : r.height) || 0) > s + 10 && n.hasFocus && (n.contentDOM.blur(), n.focus());
    }, 100);
  }
};
const Cl = /* @__PURE__ */ new Set();
function Nd(n) {
  Cl.has(n) || (Cl.add(n), n.addEventListener("copy", () => {
  }), n.addEventListener("cut", () => {
  }));
}
const Ol = ["pre-wrap", "normal", "pre-line", "break-spaces"];
class Gd {
  constructor(t) {
    this.lineWrapping = t, this.doc = W.empty, this.heightSamples = {}, this.lineHeight = 14, this.charWidth = 7, this.textHeight = 14, this.lineLength = 30, this.heightChanged = !1;
  }
  heightForGap(t, e) {
    let i = this.doc.lineAt(e).number - this.doc.lineAt(t).number + 1;
    return this.lineWrapping && (i += Math.max(0, Math.ceil((e - t - i * this.lineLength * 0.5) / this.lineLength))), this.lineHeight * i;
  }
  heightForLine(t) {
    return this.lineWrapping ? (1 + Math.max(0, Math.ceil((t - this.lineLength) / (this.lineLength - 5)))) * this.lineHeight : this.lineHeight;
  }
  setDoc(t) {
    return this.doc = t, this;
  }
  mustRefreshForWrapping(t) {
    return Ol.indexOf(t) > -1 != this.lineWrapping;
  }
  mustRefreshForHeights(t) {
    let e = !1;
    for (let i = 0; i < t.length; i++) {
      let s = t[i];
      s < 0 ? i++ : this.heightSamples[Math.floor(s * 10)] || (e = !0, this.heightSamples[Math.floor(s * 10)] = !0);
    }
    return e;
  }
  refresh(t, e, i, s, r, o) {
    let l = Ol.indexOf(t) > -1, a = Math.round(e) != Math.round(this.lineHeight) || this.lineWrapping != l;
    if (this.lineWrapping = l, this.lineHeight = e, this.charWidth = i, this.textHeight = s, this.lineLength = r, a) {
      this.heightSamples = {};
      for (let h = 0; h < o.length; h++) {
        let c = o[h];
        c < 0 ? h++ : this.heightSamples[Math.floor(c * 10)] = !0;
      }
    }
    return a;
  }
}
class Hd {
  constructor(t, e) {
    this.from = t, this.heights = e, this.index = 0;
  }
  get more() {
    return this.index < this.heights.length;
  }
}
class Jt {
  /**
  @internal
  */
  constructor(t, e, i, s, r) {
    this.from = t, this.length = e, this.top = i, this.height = s, this._content = r;
  }
  /**
  The type of element this is. When querying lines, this may be
  an array of all the blocks that make up the line.
  */
  get type() {
    return typeof this._content == "number" ? K.Text : Array.isArray(this._content) ? this._content : this._content.type;
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
    return this._content instanceof xe ? this._content.widget : null;
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
  join(t) {
    let e = (Array.isArray(this._content) ? this._content : [this]).concat(Array.isArray(t._content) ? t._content : [t]);
    return new Jt(this.from, this.length + t.length, this.top, this.height + t.height, e);
  }
}
var F = /* @__PURE__ */ function(n) {
  return n[n.ByPos = 0] = "ByPos", n[n.ByHeight = 1] = "ByHeight", n[n.ByPosNoHeight = 2] = "ByPosNoHeight", n;
}(F || (F = {}));
const On = 1e-3;
class kt {
  constructor(t, e, i = 2) {
    this.length = t, this.height = e, this.flags = i;
  }
  get outdated() {
    return (this.flags & 2) > 0;
  }
  set outdated(t) {
    this.flags = (t ? 2 : 0) | this.flags & -3;
  }
  setHeight(t, e) {
    this.height != e && (Math.abs(this.height - e) > On && (t.heightChanged = !0), this.height = e);
  }
  // Base case is to replace a leaf node, which simply builds a tree
  // from the new nodes and returns that (HeightMapBranch and
  // HeightMapGap override this to actually use from/to)
  replace(t, e, i) {
    return kt.of(i);
  }
  // Again, these are base cases, and are overridden for branch and gap nodes.
  decomposeLeft(t, e) {
    e.push(this);
  }
  decomposeRight(t, e) {
    e.push(this);
  }
  applyChanges(t, e, i, s) {
    let r = this, o = i.doc;
    for (let l = s.length - 1; l >= 0; l--) {
      let { fromA: a, toA: h, fromB: c, toB: f } = s[l], u = r.lineAt(a, F.ByPosNoHeight, i.setDoc(e), 0, 0), d = u.to >= h ? u : r.lineAt(h, F.ByPosNoHeight, i, 0, 0);
      for (f += d.to - h, h = d.to; l > 0 && u.from <= s[l - 1].toA; )
        a = s[l - 1].fromA, c = s[l - 1].fromB, l--, a < u.from && (u = r.lineAt(a, F.ByPosNoHeight, i, 0, 0));
      c += u.from - a, a = u.from;
      let p = oo.build(i.setDoc(o), t, c, f);
      r = r.replace(a, h, p);
    }
    return r.updateHeight(i, 0);
  }
  static empty() {
    return new Lt(0, 0);
  }
  // nodes uses null values to indicate the position of line breaks.
  // There are never line breaks at the start or end of the array, or
  // two line breaks next to each other, and the array isn't allowed
  // to be empty (same restrictions as return value from the builder).
  static of(t) {
    if (t.length == 1)
      return t[0];
    let e = 0, i = t.length, s = 0, r = 0;
    for (; ; )
      if (e == i)
        if (s > r * 2) {
          let l = t[e - 1];
          l.break ? t.splice(--e, 1, l.left, null, l.right) : t.splice(--e, 1, l.left, l.right), i += 1 + l.break, s -= l.size;
        } else if (r > s * 2) {
          let l = t[i];
          l.break ? t.splice(i, 1, l.left, null, l.right) : t.splice(i, 1, l.left, l.right), i += 2 + l.break, r -= l.size;
        } else
          break;
      else if (s < r) {
        let l = t[e++];
        l && (s += l.size);
      } else {
        let l = t[--i];
        l && (r += l.size);
      }
    let o = 0;
    return t[e - 1] == null ? (o = 1, e--) : t[e] == null && (o = 1, i++), new Fd(kt.of(t.slice(0, e)), o, kt.of(t.slice(i)));
  }
}
kt.prototype.size = 1;
class zh extends kt {
  constructor(t, e, i) {
    super(t, e), this.deco = i;
  }
  blockAt(t, e, i, s) {
    return new Jt(s, this.length, i, this.height, this.deco || 0);
  }
  lineAt(t, e, i, s, r) {
    return this.blockAt(0, i, s, r);
  }
  forEachLine(t, e, i, s, r, o) {
    t <= r + this.length && e >= r && o(this.blockAt(0, i, s, r));
  }
  updateHeight(t, e = 0, i = !1, s) {
    return s && s.from <= e && s.more && this.setHeight(t, s.heights[s.index++]), this.outdated = !1, this;
  }
  toString() {
    return `block(${this.length})`;
  }
}
class Lt extends zh {
  constructor(t, e) {
    super(t, e, null), this.collapsed = 0, this.widgetHeight = 0, this.breaks = 0;
  }
  blockAt(t, e, i, s) {
    return new Jt(s, this.length, i, this.height, this.breaks);
  }
  replace(t, e, i) {
    let s = i[0];
    return i.length == 1 && (s instanceof Lt || s instanceof ot && s.flags & 4) && Math.abs(this.length - s.length) < 10 ? (s instanceof ot ? s = new Lt(s.length, this.height) : s.height = this.height, this.outdated || (s.outdated = !1), s) : kt.of(i);
  }
  updateHeight(t, e = 0, i = !1, s) {
    return s && s.from <= e && s.more ? this.setHeight(t, s.heights[s.index++]) : (i || this.outdated) && this.setHeight(t, Math.max(this.widgetHeight, t.heightForLine(this.length - this.collapsed)) + this.breaks * t.lineHeight), this.outdated = !1, this;
  }
  toString() {
    return `line(${this.length}${this.collapsed ? -this.collapsed : ""}${this.widgetHeight ? ":" + this.widgetHeight : ""})`;
  }
}
class ot extends kt {
  constructor(t) {
    super(t, 0);
  }
  heightMetrics(t, e) {
    let i = t.doc.lineAt(e).number, s = t.doc.lineAt(e + this.length).number, r = s - i + 1, o, l = 0;
    if (t.lineWrapping) {
      let a = Math.min(this.height, t.lineHeight * r);
      o = a / r, this.length > r + 1 && (l = (this.height - a) / (this.length - r - 1));
    } else
      o = this.height / r;
    return { firstLine: i, lastLine: s, perLine: o, perChar: l };
  }
  blockAt(t, e, i, s) {
    let { firstLine: r, lastLine: o, perLine: l, perChar: a } = this.heightMetrics(e, s);
    if (e.lineWrapping) {
      let h = s + Math.round(Math.max(0, Math.min(1, (t - i) / this.height)) * this.length), c = e.doc.lineAt(h), f = l + c.length * a, u = Math.max(i, t - f / 2);
      return new Jt(c.from, c.length, u, f, 0);
    } else {
      let h = Math.max(0, Math.min(o - r, Math.floor((t - i) / l))), { from: c, length: f } = e.doc.line(r + h);
      return new Jt(c, f, i + l * h, l, 0);
    }
  }
  lineAt(t, e, i, s, r) {
    if (e == F.ByHeight)
      return this.blockAt(t, i, s, r);
    if (e == F.ByPosNoHeight) {
      let { from: d, to: p } = i.doc.lineAt(t);
      return new Jt(d, p - d, 0, 0, 0);
    }
    let { firstLine: o, perLine: l, perChar: a } = this.heightMetrics(i, r), h = i.doc.lineAt(t), c = l + h.length * a, f = h.number - o, u = s + l * f + a * (h.from - r - f);
    return new Jt(h.from, h.length, Math.max(s, Math.min(u, s + this.height - c)), c, 0);
  }
  forEachLine(t, e, i, s, r, o) {
    t = Math.max(t, r), e = Math.min(e, r + this.length);
    let { firstLine: l, perLine: a, perChar: h } = this.heightMetrics(i, r);
    for (let c = t, f = s; c <= e; ) {
      let u = i.doc.lineAt(c);
      if (c == t) {
        let p = u.number - l;
        f += a * p + h * (t - r - p);
      }
      let d = a + h * u.length;
      o(new Jt(u.from, u.length, f, d, 0)), f += d, c = u.to + 1;
    }
  }
  replace(t, e, i) {
    let s = this.length - e;
    if (s > 0) {
      let r = i[i.length - 1];
      r instanceof ot ? i[i.length - 1] = new ot(r.length + s) : i.push(null, new ot(s - 1));
    }
    if (t > 0) {
      let r = i[0];
      r instanceof ot ? i[0] = new ot(t + r.length) : i.unshift(new ot(t - 1), null);
    }
    return kt.of(i);
  }
  decomposeLeft(t, e) {
    e.push(new ot(t - 1), null);
  }
  decomposeRight(t, e) {
    e.push(null, new ot(this.length - t - 1));
  }
  updateHeight(t, e = 0, i = !1, s) {
    let r = e + this.length;
    if (s && s.from <= e + this.length && s.more) {
      let o = [], l = Math.max(e, s.from), a = -1;
      for (s.from > e && o.push(new ot(s.from - e - 1).updateHeight(t, e)); l <= r && s.more; ) {
        let c = t.doc.lineAt(l).length;
        o.length && o.push(null);
        let f = s.heights[s.index++];
        a == -1 ? a = f : Math.abs(f - a) >= On && (a = -2);
        let u = new Lt(c, f);
        u.outdated = !1, o.push(u), l += c + 1;
      }
      l <= r && o.push(null, new ot(r - l).updateHeight(t, l));
      let h = kt.of(o);
      return (a < 0 || Math.abs(h.height - this.height) >= On || Math.abs(a - this.heightMetrics(t, e).perLine) >= On) && (t.heightChanged = !0), h;
    } else
      (i || this.outdated) && (this.setHeight(t, t.heightForGap(e, e + this.length)), this.outdated = !1);
    return this;
  }
  toString() {
    return `gap(${this.length})`;
  }
}
class Fd extends kt {
  constructor(t, e, i) {
    super(t.length + e + i.length, t.height + i.height, e | (t.outdated || i.outdated ? 2 : 0)), this.left = t, this.right = i, this.size = t.size + i.size;
  }
  get break() {
    return this.flags & 1;
  }
  blockAt(t, e, i, s) {
    let r = i + this.left.height;
    return t < r ? this.left.blockAt(t, e, i, s) : this.right.blockAt(t, e, r, s + this.left.length + this.break);
  }
  lineAt(t, e, i, s, r) {
    let o = s + this.left.height, l = r + this.left.length + this.break, a = e == F.ByHeight ? t < o : t < l, h = a ? this.left.lineAt(t, e, i, s, r) : this.right.lineAt(t, e, i, o, l);
    if (this.break || (a ? h.to < l : h.from > l))
      return h;
    let c = e == F.ByPosNoHeight ? F.ByPosNoHeight : F.ByPos;
    return a ? h.join(this.right.lineAt(l, c, i, o, l)) : this.left.lineAt(l, c, i, s, r).join(h);
  }
  forEachLine(t, e, i, s, r, o) {
    let l = s + this.left.height, a = r + this.left.length + this.break;
    if (this.break)
      t < a && this.left.forEachLine(t, e, i, s, r, o), e >= a && this.right.forEachLine(t, e, i, l, a, o);
    else {
      let h = this.lineAt(a, F.ByPos, i, s, r);
      t < h.from && this.left.forEachLine(t, h.from - 1, i, s, r, o), h.to >= t && h.from <= e && o(h), e > h.to && this.right.forEachLine(h.to + 1, e, i, l, a, o);
    }
  }
  replace(t, e, i) {
    let s = this.left.length + this.break;
    if (e < s)
      return this.balanced(this.left.replace(t, e, i), this.right);
    if (t > this.left.length)
      return this.balanced(this.left, this.right.replace(t - s, e - s, i));
    let r = [];
    t > 0 && this.decomposeLeft(t, r);
    let o = r.length;
    for (let l of i)
      r.push(l);
    if (t > 0 && Al(r, o - 1), e < this.length) {
      let l = r.length;
      this.decomposeRight(e, r), Al(r, l);
    }
    return kt.of(r);
  }
  decomposeLeft(t, e) {
    let i = this.left.length;
    if (t <= i)
      return this.left.decomposeLeft(t, e);
    e.push(this.left), this.break && (i++, t >= i && e.push(null)), t > i && this.right.decomposeLeft(t - i, e);
  }
  decomposeRight(t, e) {
    let i = this.left.length, s = i + this.break;
    if (t >= s)
      return this.right.decomposeRight(t - s, e);
    t < i && this.left.decomposeRight(t, e), this.break && t < s && e.push(null), e.push(this.right);
  }
  balanced(t, e) {
    return t.size > 2 * e.size || e.size > 2 * t.size ? kt.of(this.break ? [t, null, e] : [t, e]) : (this.left = t, this.right = e, this.height = t.height + e.height, this.outdated = t.outdated || e.outdated, this.size = t.size + e.size, this.length = t.length + this.break + e.length, this);
  }
  updateHeight(t, e = 0, i = !1, s) {
    let { left: r, right: o } = this, l = e + r.length + this.break, a = null;
    return s && s.from <= e + r.length && s.more ? a = r = r.updateHeight(t, e, i, s) : r.updateHeight(t, e, i), s && s.from <= l + o.length && s.more ? a = o = o.updateHeight(t, l, i, s) : o.updateHeight(t, l, i), a ? this.balanced(r, o) : (this.height = this.left.height + this.right.height, this.outdated = !1, this);
  }
  toString() {
    return this.left + (this.break ? " " : "-") + this.right;
  }
}
function Al(n, t) {
  let e, i;
  n[t] == null && (e = n[t - 1]) instanceof ot && (i = n[t + 1]) instanceof ot && n.splice(t - 1, 3, new ot(e.length + 1 + i.length));
}
const zd = 5;
class oo {
  constructor(t, e) {
    this.pos = t, this.oracle = e, this.nodes = [], this.lineStart = -1, this.lineEnd = -1, this.covering = null, this.writtenTo = t;
  }
  get isCovered() {
    return this.covering && this.nodes[this.nodes.length - 1] == this.covering;
  }
  span(t, e) {
    if (this.lineStart > -1) {
      let i = Math.min(e, this.lineEnd), s = this.nodes[this.nodes.length - 1];
      s instanceof Lt ? s.length += i - this.pos : (i > this.pos || !this.isCovered) && this.nodes.push(new Lt(i - this.pos, -1)), this.writtenTo = i, e > i && (this.nodes.push(null), this.writtenTo++, this.lineStart = -1);
    }
    this.pos = e;
  }
  point(t, e, i) {
    if (t < e || i.heightRelevant) {
      let s = i.widget ? i.widget.estimatedHeight : 0, r = i.widget ? i.widget.lineBreaks : 0;
      s < 0 && (s = this.oracle.lineHeight);
      let o = e - t;
      i.block ? this.addBlock(new zh(o, s, i)) : (o || r || s >= zd) && this.addLineDeco(s, r, o);
    } else
      e > t && this.span(t, e);
    this.lineEnd > -1 && this.lineEnd < this.pos && (this.lineEnd = this.oracle.doc.lineAt(this.pos).to);
  }
  enterLine() {
    if (this.lineStart > -1)
      return;
    let { from: t, to: e } = this.oracle.doc.lineAt(this.pos);
    this.lineStart = t, this.lineEnd = e, this.writtenTo < t && ((this.writtenTo < t - 1 || this.nodes[this.nodes.length - 1] == null) && this.nodes.push(this.blankContent(this.writtenTo, t - 1)), this.nodes.push(null)), this.pos > t && this.nodes.push(new Lt(this.pos - t, -1)), this.writtenTo = this.pos;
  }
  blankContent(t, e) {
    let i = new ot(e - t);
    return this.oracle.doc.lineAt(t).to == e && (i.flags |= 4), i;
  }
  ensureLine() {
    this.enterLine();
    let t = this.nodes.length ? this.nodes[this.nodes.length - 1] : null;
    if (t instanceof Lt)
      return t;
    let e = new Lt(0, -1);
    return this.nodes.push(e), e;
  }
  addBlock(t) {
    var e;
    this.enterLine();
    let i = (e = t.deco) === null || e === void 0 ? void 0 : e.type;
    i == K.WidgetAfter && !this.isCovered && this.ensureLine(), this.nodes.push(t), this.writtenTo = this.pos = this.pos + t.length, i != K.WidgetBefore && (this.covering = t);
  }
  addLineDeco(t, e, i) {
    let s = this.ensureLine();
    s.length += i, s.collapsed += i, s.widgetHeight = Math.max(s.widgetHeight, t), s.breaks += e, this.writtenTo = this.pos = this.pos + i;
  }
  finish(t) {
    let e = this.nodes.length == 0 ? null : this.nodes[this.nodes.length - 1];
    this.lineStart > -1 && !(e instanceof Lt) && !this.isCovered ? this.nodes.push(new Lt(0, -1)) : (this.writtenTo < this.pos || e == null) && this.nodes.push(this.blankContent(this.writtenTo, this.pos));
    let i = t;
    for (let s of this.nodes)
      s instanceof Lt && s.updateHeight(this.oracle, i), i += s ? s.length : 1;
    return this.nodes;
  }
  // Always called with a region that on both sides either stretches
  // to a line break or the end of the document.
  // The returned array uses null to indicate line breaks, but never
  // starts or ends in a line break, or has multiple line breaks next
  // to each other.
  static build(t, e, i, s) {
    let r = new oo(i, t);
    return I.spans(e, i, s, r, 0), r.finish(i);
  }
}
function Kd(n, t, e) {
  let i = new Yd();
  return I.compare(n, t, e, i, 0), i.changes;
}
class Yd {
  constructor() {
    this.changes = [];
  }
  compareRange() {
  }
  comparePoint(t, e, i, s) {
    (t < e || i && i.heightRelevant || s && s.heightRelevant) && xr(t, e, this.changes, 5);
  }
}
function Jd(n, t) {
  let e = n.getBoundingClientRect(), i = n.ownerDocument, s = i.defaultView || window, r = Math.max(0, e.left), o = Math.min(s.innerWidth, e.right), l = Math.max(0, e.top), a = Math.min(s.innerHeight, e.bottom);
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
    left: r - e.left,
    right: Math.max(r, o) - e.left,
    top: l - (e.top + t),
    bottom: Math.max(l, a) - (e.top + t)
  };
}
function Qd(n, t) {
  let e = n.getBoundingClientRect();
  return {
    left: 0,
    right: e.right - e.left,
    top: t,
    bottom: e.bottom - (e.top + t)
  };
}
class Bs {
  constructor(t, e, i) {
    this.from = t, this.to = e, this.size = i;
  }
  static same(t, e) {
    if (t.length != e.length)
      return !1;
    for (let i = 0; i < t.length; i++) {
      let s = t[i], r = e[i];
      if (s.from != r.from || s.to != r.to || s.size != r.size)
        return !1;
    }
    return !0;
  }
  draw(t, e) {
    return T.replace({
      widget: new Ud(this.size * (e ? t.scaleY : t.scaleX), e)
    }).range(this.from, this.to);
  }
}
class Ud extends Se {
  constructor(t, e) {
    super(), this.size = t, this.vertical = e;
  }
  eq(t) {
    return t.size == this.size && t.vertical == this.vertical;
  }
  toDOM() {
    let t = document.createElement("div");
    return this.vertical ? t.style.height = this.size + "px" : (t.style.width = this.size + "px", t.style.height = "2px", t.style.display = "inline-block"), t;
  }
  get estimatedHeight() {
    return this.vertical ? this.size : -1;
  }
}
class Ml {
  constructor(t) {
    this.state = t, this.pixelViewport = { left: 0, right: window.innerWidth, top: 0, bottom: 0 }, this.inView = !0, this.paddingTop = 0, this.paddingBottom = 0, this.contentDOMWidth = 0, this.contentDOMHeight = 0, this.editorHeight = 0, this.editorWidth = 0, this.scrollTop = 0, this.scrolledToBottom = !0, this.scaleX = 1, this.scaleY = 1, this.scrollAnchorPos = 0, this.scrollAnchorHeight = -1, this.scaler = Rl, this.scrollTarget = null, this.printing = !1, this.mustMeasureContent = !0, this.defaultTextDirection = z.LTR, this.visibleRanges = [], this.mustEnforceCursorAssoc = !1;
    let e = t.facet(so).some((i) => typeof i != "function" && i.class == "cm-lineWrapping");
    this.heightOracle = new Gd(e), this.stateDeco = t.facet(Zi).filter((i) => typeof i != "function"), this.heightMap = kt.empty().applyChanges(this.stateDeco, W.empty, this.heightOracle.setDoc(t.doc), [new Xt(0, 0, 0, t.doc.length)]), this.viewport = this.getViewport(0, null), this.updateViewportLines(), this.updateForViewport(), this.lineGaps = this.ensureLineGaps([]), this.lineGapDeco = T.set(this.lineGaps.map((i) => i.draw(this, !1))), this.computeVisibleRanges();
  }
  updateForViewport() {
    let t = [this.viewport], { main: e } = this.state.selection;
    for (let i = 0; i <= 1; i++) {
      let s = i ? e.head : e.anchor;
      if (!t.some(({ from: r, to: o }) => s >= r && s <= o)) {
        let { from: r, to: o } = this.lineBlockAt(s);
        t.push(new sn(r, o));
      }
    }
    this.viewports = t.sort((i, s) => i.from - s.from), this.scaler = this.heightMap.height <= 7e6 ? Rl : new qd(this.heightOracle, this.heightMap, this.viewports);
  }
  updateViewportLines() {
    this.viewportLines = [], this.heightMap.forEachLine(this.viewport.from, this.viewport.to, this.heightOracle.setDoc(this.state.doc), 0, 0, (t) => {
      this.viewportLines.push(this.scaler.scale == 1 ? t : bi(t, this.scaler));
    });
  }
  update(t, e = null) {
    this.state = t.state;
    let i = this.stateDeco;
    this.stateDeco = this.state.facet(Zi).filter((c) => typeof c != "function");
    let s = t.changedRanges, r = Xt.extendWithRanges(s, Kd(i, this.stateDeco, t ? t.changes : et.empty(this.state.doc.length))), o = this.heightMap.height, l = this.scrolledToBottom ? null : this.scrollAnchorAt(this.scrollTop);
    this.heightMap = this.heightMap.applyChanges(this.stateDeco, t.startState.doc, this.heightOracle.setDoc(this.state.doc), r), this.heightMap.height != o && (t.flags |= 2), l ? (this.scrollAnchorPos = t.changes.mapPos(l.from, -1), this.scrollAnchorHeight = l.top) : (this.scrollAnchorPos = -1, this.scrollAnchorHeight = this.heightMap.height);
    let a = r.length ? this.mapViewport(this.viewport, t.changes) : this.viewport;
    (e && (e.range.head < a.from || e.range.head > a.to) || !this.viewportIsAppropriate(a)) && (a = this.getViewport(0, e));
    let h = !t.changes.empty || t.flags & 2 || a.from != this.viewport.from || a.to != this.viewport.to;
    this.viewport = a, this.updateForViewport(), h && this.updateViewportLines(), (this.lineGaps.length || this.viewport.to - this.viewport.from > 4e3) && this.updateLineGaps(this.ensureLineGaps(this.mapLineGaps(this.lineGaps, t.changes))), t.flags |= this.computeVisibleRanges(), e && (this.scrollTarget = e), !this.mustEnforceCursorAssoc && t.selectionSet && t.view.lineWrapping && t.state.selection.main.empty && t.state.selection.main.assoc && !t.state.facet(Sh) && (this.mustEnforceCursorAssoc = !0);
  }
  measure(t) {
    let e = t.contentDOM, i = window.getComputedStyle(e), s = this.heightOracle, r = i.whiteSpace;
    this.defaultTextDirection = i.direction == "rtl" ? z.RTL : z.LTR;
    let o = this.heightOracle.mustRefreshForWrapping(r), l = e.getBoundingClientRect(), a = o || this.mustMeasureContent || this.contentDOMHeight != l.height;
    this.contentDOMHeight = l.height, this.mustMeasureContent = !1;
    let h = 0, c = 0;
    if (l.width && l.height) {
      let k = l.width / e.offsetWidth, w = l.height / e.offsetHeight;
      k > 0.995 && k < 1.005 && (k = 1), w > 0.995 && w < 1.005 && (w = 1), (this.scaleX != k || this.scaleY != w) && (this.scaleX = k, this.scaleY = w, h |= 8, o = a = !0);
    }
    let f = (parseInt(i.paddingTop) || 0) * this.scaleY, u = (parseInt(i.paddingBottom) || 0) * this.scaleY;
    (this.paddingTop != f || this.paddingBottom != u) && (this.paddingTop = f, this.paddingBottom = u, h |= 10), this.editorWidth != t.scrollDOM.clientWidth && (s.lineWrapping && (a = !0), this.editorWidth = t.scrollDOM.clientWidth, h |= 8);
    let d = t.scrollDOM.scrollTop * this.scaleY;
    this.scrollTop != d && (this.scrollAnchorHeight = -1, this.scrollTop = d), this.scrolledToBottom = sh(t.scrollDOM);
    let p = (this.printing ? Qd : Jd)(e, this.paddingTop), g = p.top - this.pixelViewport.top, m = p.bottom - this.pixelViewport.bottom;
    this.pixelViewport = p;
    let b = this.pixelViewport.bottom > this.pixelViewport.top && this.pixelViewport.right > this.pixelViewport.left;
    if (b != this.inView && (this.inView = b, b && (a = !0)), !this.inView && !this.scrollTarget)
      return 0;
    let v = l.width;
    if ((this.contentDOMWidth != v || this.editorHeight != t.scrollDOM.clientHeight) && (this.contentDOMWidth = l.width, this.editorHeight = t.scrollDOM.clientHeight, h |= 8), a) {
      let k = t.docView.measureVisibleLineHeights(this.viewport);
      if (s.mustRefreshForHeights(k) && (o = !0), o || s.lineWrapping && Math.abs(v - this.contentDOMWidth) > s.charWidth) {
        let { lineHeight: w, charWidth: S, textHeight: Z } = t.docView.measureTextSize();
        o = w > 0 && s.refresh(r, w, S, Z, v / S, k), o && (t.docView.minWidth = 0, h |= 8);
      }
      g > 0 && m > 0 ? c = Math.max(g, m) : g < 0 && m < 0 && (c = Math.min(g, m)), s.heightChanged = !1;
      for (let w of this.viewports) {
        let S = w.from == this.viewport.from ? k : t.docView.measureVisibleLineHeights(w);
        this.heightMap = (o ? kt.empty().applyChanges(this.stateDeco, W.empty, this.heightOracle, [new Xt(0, 0, 0, t.state.doc.length)]) : this.heightMap).updateHeight(s, 0, o, new Hd(w.from, S));
      }
      s.heightChanged && (h |= 2);
    }
    let O = !this.viewportIsAppropriate(this.viewport, c) || this.scrollTarget && (this.scrollTarget.range.head < this.viewport.from || this.scrollTarget.range.head > this.viewport.to);
    return O && (this.viewport = this.getViewport(c, this.scrollTarget)), this.updateForViewport(), (h & 2 || O) && this.updateViewportLines(), (this.lineGaps.length || this.viewport.to - this.viewport.from > 4e3) && this.updateLineGaps(this.ensureLineGaps(o ? [] : this.lineGaps, t)), h |= this.computeVisibleRanges(), this.mustEnforceCursorAssoc && (this.mustEnforceCursorAssoc = !1, t.docView.enforceCursorAssoc()), h;
  }
  get visibleTop() {
    return this.scaler.fromDOM(this.pixelViewport.top);
  }
  get visibleBottom() {
    return this.scaler.fromDOM(this.pixelViewport.bottom);
  }
  getViewport(t, e) {
    let i = 0.5 - Math.max(-0.5, Math.min(0.5, t / 1e3 / 2)), s = this.heightMap, r = this.heightOracle, { visibleTop: o, visibleBottom: l } = this, a = new sn(s.lineAt(o - i * 1e3, F.ByHeight, r, 0, 0).from, s.lineAt(l + (1 - i) * 1e3, F.ByHeight, r, 0, 0).to);
    if (e) {
      let { head: h } = e.range;
      if (h < a.from || h > a.to) {
        let c = Math.min(this.editorHeight, this.pixelViewport.bottom - this.pixelViewport.top), f = s.lineAt(h, F.ByPos, r, 0, 0), u;
        e.y == "center" ? u = (f.top + f.bottom) / 2 - c / 2 : e.y == "start" || e.y == "nearest" && h < a.from ? u = f.top : u = f.bottom - c, a = new sn(s.lineAt(u - 1e3 / 2, F.ByHeight, r, 0, 0).from, s.lineAt(u + c + 1e3 / 2, F.ByHeight, r, 0, 0).to);
      }
    }
    return a;
  }
  mapViewport(t, e) {
    let i = e.mapPos(t.from, -1), s = e.mapPos(t.to, 1);
    return new sn(this.heightMap.lineAt(i, F.ByPos, this.heightOracle, 0, 0).from, this.heightMap.lineAt(s, F.ByPos, this.heightOracle, 0, 0).to);
  }
  // Checks if a given viewport covers the visible part of the
  // document and not too much beyond that.
  viewportIsAppropriate({ from: t, to: e }, i = 0) {
    if (!this.inView)
      return !0;
    let { top: s } = this.heightMap.lineAt(t, F.ByPos, this.heightOracle, 0, 0), { bottom: r } = this.heightMap.lineAt(e, F.ByPos, this.heightOracle, 0, 0), { visibleTop: o, visibleBottom: l } = this;
    return (t == 0 || s <= o - Math.max(10, Math.min(
      -i,
      250
      /* VP.MaxCoverMargin */
    ))) && (e == this.state.doc.length || r >= l + Math.max(10, Math.min(
      i,
      250
      /* VP.MaxCoverMargin */
    ))) && s > o - 2 * 1e3 && r < l + 2 * 1e3;
  }
  mapLineGaps(t, e) {
    if (!t.length || e.empty)
      return t;
    let i = [];
    for (let s of t)
      e.touchesRange(s.from, s.to) || i.push(new Bs(e.mapPos(s.from), e.mapPos(s.to), s.size));
    return i;
  }
  // Computes positions in the viewport where the start or end of a
  // line should be hidden, trying to reuse existing line gaps when
  // appropriate to avoid unneccesary redraws.
  // Uses crude character-counting for the positioning and sizing,
  // since actual DOM coordinates aren't always available and
  // predictable. Relies on generous margins (see LG.Margin) to hide
  // the artifacts this might produce from the user.
  ensureLineGaps(t, e) {
    let i = this.heightOracle.lineWrapping, s = i ? 1e4 : 2e3, r = s >> 1, o = s << 1;
    if (this.defaultTextDirection != z.LTR && !i)
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
      let g = jd(t, (m) => m.from >= f.from && m.to <= f.to && Math.abs(m.from - h) < r && Math.abs(m.to - c) < r && !p.some((b) => m.from < b && m.to > b));
      if (!g) {
        if (c < f.to && e && i && e.visibleRanges.some((m) => m.from <= c && m.to >= c)) {
          let m = e.moveToLineBoundary(y.cursor(c), !1, !0).head;
          m > h && (c = m);
        }
        g = new Bs(h, c, this.gapSize(f, h, c, u));
      }
      l.push(g);
    };
    for (let h of this.viewportLines) {
      if (h.length < o)
        continue;
      let c = $d(h.from, h.to, this.stateDeco);
      if (c.total < o)
        continue;
      let f = this.scrollTarget ? this.scrollTarget.range.head : null, u, d;
      if (i) {
        let p = s / this.heightOracle.lineLength * this.heightOracle.lineHeight, g, m;
        if (f != null) {
          let b = on(c, f), v = ((this.visibleBottom - this.visibleTop) / 2 + p) / h.height;
          g = b - v, m = b + v;
        } else
          g = (this.visibleTop - h.top - p) / h.height, m = (this.visibleBottom - h.top + p) / h.height;
        u = rn(c, g), d = rn(c, m);
      } else {
        let p = c.total * this.heightOracle.charWidth, g = s * this.heightOracle.charWidth, m, b;
        if (f != null) {
          let v = on(c, f), O = ((this.pixelViewport.right - this.pixelViewport.left) / 2 + g) / p;
          m = v - O, b = v + O;
        } else
          m = (this.pixelViewport.left - g) / p, b = (this.pixelViewport.right + g) / p;
        u = rn(c, m), d = rn(c, b);
      }
      u > h.from && a(h.from, u, h, c), d < h.to && a(d, h.to, h, c);
    }
    return l;
  }
  gapSize(t, e, i, s) {
    let r = on(s, i) - on(s, e);
    return this.heightOracle.lineWrapping ? t.height * r : s.total * this.heightOracle.charWidth * r;
  }
  updateLineGaps(t) {
    Bs.same(t, this.lineGaps) || (this.lineGaps = t, this.lineGapDeco = T.set(t.map((e) => e.draw(this, this.heightOracle.lineWrapping))));
  }
  computeVisibleRanges() {
    let t = this.stateDeco;
    this.lineGaps.length && (t = t.concat(this.lineGapDeco));
    let e = [];
    I.spans(t, this.viewport.from, this.viewport.to, {
      span(s, r) {
        e.push({ from: s, to: r });
      },
      point() {
      }
    }, 20);
    let i = e.length != this.visibleRanges.length || this.visibleRanges.some((s, r) => s.from != e[r].from || s.to != e[r].to);
    return this.visibleRanges = e, i ? 4 : 0;
  }
  lineBlockAt(t) {
    return t >= this.viewport.from && t <= this.viewport.to && this.viewportLines.find((e) => e.from <= t && e.to >= t) || bi(this.heightMap.lineAt(t, F.ByPos, this.heightOracle, 0, 0), this.scaler);
  }
  lineBlockAtHeight(t) {
    return bi(this.heightMap.lineAt(this.scaler.fromDOM(t), F.ByHeight, this.heightOracle, 0, 0), this.scaler);
  }
  scrollAnchorAt(t) {
    let e = this.lineBlockAtHeight(t + 8);
    return e.from >= this.viewport.from || this.viewportLines[0].top - t > 200 ? e : this.viewportLines[0];
  }
  elementAtHeight(t) {
    return bi(this.heightMap.blockAt(this.scaler.fromDOM(t), this.heightOracle, 0, 0), this.scaler);
  }
  get docHeight() {
    return this.scaler.toDOM(this.heightMap.height);
  }
  get contentHeight() {
    return this.docHeight + this.paddingTop + this.paddingBottom;
  }
}
class sn {
  constructor(t, e) {
    this.from = t, this.to = e;
  }
}
function $d(n, t, e) {
  let i = [], s = n, r = 0;
  return I.spans(e, n, t, {
    span() {
    },
    point(o, l) {
      o > s && (i.push({ from: s, to: o }), r += o - s), s = l;
    }
  }, 20), s < t && (i.push({ from: s, to: t }), r += t - s), { total: r, ranges: i };
}
function rn({ total: n, ranges: t }, e) {
  if (e <= 0)
    return t[0].from;
  if (e >= 1)
    return t[t.length - 1].to;
  let i = Math.floor(n * e);
  for (let s = 0; ; s++) {
    let { from: r, to: o } = t[s], l = o - r;
    if (i <= l)
      return r + i;
    i -= l;
  }
}
function on(n, t) {
  let e = 0;
  for (let { from: i, to: s } of n.ranges) {
    if (t <= s) {
      e += t - i;
      break;
    }
    e += s - i;
  }
  return e / n.total;
}
function jd(n, t) {
  for (let e of n)
    if (t(e))
      return e;
}
const Rl = {
  toDOM(n) {
    return n;
  },
  fromDOM(n) {
    return n;
  },
  scale: 1
};
class qd {
  constructor(t, e, i) {
    let s = 0, r = 0, o = 0;
    this.viewports = i.map(({ from: l, to: a }) => {
      let h = e.lineAt(l, F.ByPos, t, 0, 0).top, c = e.lineAt(a, F.ByPos, t, 0, 0).bottom;
      return s += c - h, { from: l, to: a, top: h, bottom: c, domTop: 0, domBottom: 0 };
    }), this.scale = (7e6 - s) / (e.height - s);
    for (let l of this.viewports)
      l.domTop = o + (l.top - r) * this.scale, o = l.domBottom = l.domTop + (l.bottom - l.top), r = l.bottom;
  }
  toDOM(t) {
    for (let e = 0, i = 0, s = 0; ; e++) {
      let r = e < this.viewports.length ? this.viewports[e] : null;
      if (!r || t < r.top)
        return s + (t - i) * this.scale;
      if (t <= r.bottom)
        return r.domTop + (t - r.top);
      i = r.bottom, s = r.domBottom;
    }
  }
  fromDOM(t) {
    for (let e = 0, i = 0, s = 0; ; e++) {
      let r = e < this.viewports.length ? this.viewports[e] : null;
      if (!r || t < r.domTop)
        return i + (t - s) / this.scale;
      if (t <= r.domBottom)
        return r.top + (t - r.domTop);
      i = r.bottom, s = r.domBottom;
    }
  }
}
function bi(n, t) {
  if (t.scale == 1)
    return n;
  let e = t.toDOM(n.top), i = t.toDOM(n.bottom);
  return new Jt(n.from, n.length, e, i - e, Array.isArray(n._content) ? n._content.map((s) => bi(s, t)) : n._content);
}
const ln = /* @__PURE__ */ A.define({ combine: (n) => n.join(" ") }), Rr = /* @__PURE__ */ A.define({ combine: (n) => n.indexOf(!0) > -1 }), Zr = /* @__PURE__ */ ge.newName(), Kh = /* @__PURE__ */ ge.newName(), Yh = /* @__PURE__ */ ge.newName(), Jh = { "&light": "." + Kh, "&dark": "." + Yh };
function Lr(n, t, e) {
  return new ge(t, {
    finish(i) {
      return /&/.test(i) ? i.replace(/&\w*/, (s) => {
        if (s == "&")
          return n;
        if (!e || !e[s])
          throw new RangeError(`Unsupported selector: ${s}`);
        return e[s];
      }) : n + " " + i;
    }
  });
}
const _d = /* @__PURE__ */ Lr("." + Zr, {
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
    boxSizing: "border-box",
    padding: "4px 0",
    outline: "none",
    "&[contenteditable=true]": {
      WebkitUserModify: "read-write-plaintext-only"
    }
  },
  ".cm-lineWrapping": {
    whiteSpace_fallback: "pre-wrap",
    whiteSpace: "break-spaces",
    wordBreak: "break-word",
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
}, Jh);
class tp {
  constructor(t, e, i, s) {
    this.typeOver = s, this.bounds = null, this.text = "";
    let { impreciseHead: r, impreciseAnchor: o } = t.docView;
    if (t.state.readOnly && e > -1)
      this.newSel = null;
    else if (e > -1 && (this.bounds = t.docView.domBoundsAround(e, i, 0))) {
      let l = r || o ? [] : np(t), a = new ah(l, t.state);
      a.readRange(this.bounds.startDOM, this.bounds.endDOM), this.text = a.text, this.newSel = sp(l, this.bounds.from);
    } else {
      let l = t.observer.selectionRange, a = r && r.node == l.focusNode && r.offset == l.focusOffset || !dr(t.contentDOM, l.focusNode) ? t.state.selection.main.head : t.docView.posFromDOM(l.focusNode, l.focusOffset), h = o && o.node == l.anchorNode && o.offset == l.anchorOffset || !dr(t.contentDOM, l.anchorNode) ? t.state.selection.main.anchor : t.docView.posFromDOM(l.anchorNode, l.anchorOffset);
      this.newSel = y.single(h, a);
    }
  }
}
function Qh(n, t) {
  let e, { newSel: i } = t, s = n.state.selection.main, r = n.inputState.lastKeyTime > Date.now() - 100 ? n.inputState.lastKeyCode : -1;
  if (t.bounds) {
    let { from: o, to: l } = t.bounds, a = s.from, h = null;
    (r === 8 || M.android && t.text.length < l - o) && (a = s.to, h = "end");
    let c = ip(n.state.doc.sliceString(o, l, Fe), t.text, a - o, h);
    c && (M.chrome && r == 13 && c.toB == c.from + 2 && t.text.slice(c.from, c.toB) == Fe + Fe && c.toB--, e = {
      from: o + c.from,
      to: o + c.toA,
      insert: W.of(t.text.slice(c.from, c.toB).split(Fe))
    });
  } else
    i && (!n.hasFocus && n.state.facet(ds) || i.main.eq(s)) && (i = null);
  if (!e && !i)
    return !1;
  if (!e && t.typeOver && !s.empty && i && i.main.empty ? e = { from: s.from, to: s.to, insert: n.state.doc.slice(s.from, s.to) } : e && e.from >= s.from && e.to <= s.to && (e.from != s.from || e.to != s.to) && s.to - s.from - (e.to - e.from) <= 4 ? e = {
    from: s.from,
    to: s.to,
    insert: n.state.doc.slice(s.from, e.from).append(e.insert).append(n.state.doc.slice(e.to, s.to))
  } : (M.mac || M.android) && e && e.from == e.to && e.from == s.head - 1 && /^\. ?$/.test(e.insert.toString()) && n.contentDOM.getAttribute("autocorrect") == "off" ? (i && e.insert.length == 2 && (i = y.single(i.main.anchor - 1, i.main.head - 1)), e = { from: s.from, to: s.to, insert: W.of([" "]) }) : M.chrome && e && e.from == e.to && e.from == s.head && e.insert.toString() == `
 ` && n.lineWrapping && (i && (i = y.single(i.main.anchor - 1, i.main.head - 1)), e = { from: s.from, to: s.to, insert: W.of([" "]) }), e) {
    if (M.ios && n.inputState.flushIOSKey(n) || M.android && (e.from == s.from && e.to == s.to && e.insert.length == 1 && e.insert.lines == 2 && $e(n.contentDOM, "Enter", 13) || (e.from == s.from - 1 && e.to == s.to && e.insert.length == 0 || r == 8 && e.insert.length < e.to - e.from && e.to > s.head) && $e(n.contentDOM, "Backspace", 8) || e.from == s.from && e.to == s.to + 1 && e.insert.length == 0 && $e(n.contentDOM, "Delete", 46)))
      return !0;
    let o = e.insert.toString();
    n.inputState.composing >= 0 && n.inputState.composing++;
    let l, a = () => l || (l = ep(n, e, i));
    return n.state.facet(xh).some((h) => h(n, e.from, e.to, o, a)) || n.dispatch(a()), !0;
  } else if (i && !i.main.eq(s)) {
    let o = !1, l = "select";
    return n.inputState.lastSelectionTime > Date.now() - 50 && (n.inputState.lastSelectionOrigin == "select" && (o = !0), l = n.inputState.lastSelectionOrigin), n.dispatch({ selection: i, scrollIntoView: o, userEvent: l }), !0;
  } else
    return !1;
}
function ep(n, t, e) {
  let i, s = n.state, r = s.selection.main;
  if (t.from >= r.from && t.to <= r.to && t.to - t.from >= (r.to - r.from) / 3 && (!e || e.main.empty && e.main.from == t.from + t.insert.length) && n.inputState.composing < 0) {
    let l = r.from < t.from ? s.sliceDoc(r.from, t.from) : "", a = r.to > t.to ? s.sliceDoc(t.to, r.to) : "";
    i = s.replaceSelection(n.state.toText(l + t.insert.sliceString(0, void 0, n.state.lineBreak) + a));
  } else {
    let l = s.changes(t), a = e && e.main.to <= l.newLength ? e.main : void 0;
    if (s.selection.ranges.length > 1 && n.inputState.composing >= 0 && t.to <= r.to && t.to >= r.to - 10) {
      let h = n.state.sliceDoc(t.from, t.to), c = Dh(n, t.insert.length - (t.to - t.from)) || n.state.doc.lineAt(r.head), f = r.to - t.to, u = r.to - r.from;
      i = s.changeByRange((d) => {
        if (d.from == r.from && d.to == r.to)
          return { changes: l, range: a || d.map(l) };
        let p = d.to - f, g = p - h.length;
        if (d.to - d.from != u || n.state.sliceDoc(g, p) != h || // Unfortunately, there's no way to make multiple
        // changes in the same node work without aborting
        // composition, so cursors in the composition range are
        // ignored.
        c && d.to >= c.from && d.from <= c.to)
          return { range: d };
        let m = s.changes({ from: g, to: p, insert: t.insert }), b = d.to - r.to;
        return {
          changes: m,
          range: a ? y.range(Math.max(0, a.anchor + b), Math.max(0, a.head + b)) : d.map(m)
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
function ip(n, t, e, i) {
  let s = Math.min(n.length, t.length), r = 0;
  for (; r < s && n.charCodeAt(r) == t.charCodeAt(r); )
    r++;
  if (r == s && n.length == t.length)
    return null;
  let o = n.length, l = t.length;
  for (; o > 0 && l > 0 && n.charCodeAt(o - 1) == t.charCodeAt(l - 1); )
    o--, l--;
  if (i == "end") {
    let a = Math.max(0, r - Math.min(o, l));
    e -= o + a - r;
  }
  if (o < r && n.length < t.length) {
    let a = e <= r && e >= o ? r - e : 0;
    r -= a, l = r + (l - o), o = r;
  } else if (l < r) {
    let a = e <= r && e >= l ? r - e : 0;
    r -= a, o = r + (o - l), l = r;
  }
  return { from: r, toA: o, toB: l };
}
function np(n) {
  let t = [];
  if (n.root.activeElement != n.contentDOM)
    return t;
  let { anchorNode: e, anchorOffset: i, focusNode: s, focusOffset: r } = n.observer.selectionRange;
  return e && (t.push(new el(e, i)), (s != e || r != i) && t.push(new el(s, r))), t;
}
function sp(n, t) {
  if (n.length == 0)
    return null;
  let e = n[0].pos, i = n.length == 2 ? n[1].pos : e;
  return e > -1 && i > -1 ? y.single(e + t, i + t) : null;
}
const rp = {
  childList: !0,
  characterData: !0,
  subtree: !0,
  attributes: !0,
  characterDataOldValue: !0
}, Ws = M.ie && M.ie_version <= 11;
class op {
  constructor(t) {
    this.view = t, this.active = !1, this.selectionRange = new Qu(), this.selectionChanged = !1, this.delayedFlush = -1, this.resizeTimeout = -1, this.queue = [], this.delayedAndroidKey = null, this.flushingAndroidKey = -1, this.lastChange = 0, this.scrollTargets = [], this.intersection = null, this.resizeScroll = null, this.resizeContent = null, this.intersecting = !1, this.gapIntersection = null, this.gaps = [], this.parentCheck = -1, this.dom = t.contentDOM, this.observer = new MutationObserver((e) => {
      for (let i of e)
        this.queue.push(i);
      (M.ie && M.ie_version <= 11 || M.ios && t.composing) && e.some((i) => i.type == "childList" && i.removedNodes.length || i.type == "characterData" && i.oldValue.length > i.target.nodeValue.length) ? this.flushSoon() : this.flush();
    }), Ws && (this.onCharData = (e) => {
      this.queue.push({
        target: e.target,
        type: "characterData",
        oldValue: e.prevValue
      }), this.flushSoon();
    }), this.onSelectionChange = this.onSelectionChange.bind(this), this.onResize = this.onResize.bind(this), this.onPrint = this.onPrint.bind(this), this.onScroll = this.onScroll.bind(this), typeof ResizeObserver == "function" && (this.resizeScroll = new ResizeObserver(() => {
      var e;
      ((e = this.view.docView) === null || e === void 0 ? void 0 : e.lastUpdate) < Date.now() - 75 && this.onResize();
    }), this.resizeScroll.observe(t.scrollDOM), this.resizeContent = new ResizeObserver(() => this.view.requestMeasure()), this.resizeContent.observe(t.contentDOM)), this.addWindowListeners(this.win = t.win), this.start(), typeof IntersectionObserver == "function" && (this.intersection = new IntersectionObserver((e) => {
      this.parentCheck < 0 && (this.parentCheck = setTimeout(this.listenForScroll.bind(this), 1e3)), e.length > 0 && e[e.length - 1].intersectionRatio > 0 != this.intersecting && (this.intersecting = !this.intersecting, this.intersecting != this.view.inView && this.onScrollChanged(document.createEvent("Event")));
    }, { threshold: [0, 1e-3] }), this.intersection.observe(this.dom), this.gapIntersection = new IntersectionObserver((e) => {
      e.length > 0 && e[e.length - 1].intersectionRatio > 0 && this.onScrollChanged(document.createEvent("Event"));
    }, {})), this.listenForScroll(), this.readSelectionRange();
  }
  onScrollChanged(t) {
    this.view.inputState.runScrollHandlers(this.view, t), this.intersecting && this.view.measure();
  }
  onScroll(t) {
    this.intersecting && this.flush(!1), this.onScrollChanged(t);
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
  updateGaps(t) {
    if (this.gapIntersection && (t.length != this.gaps.length || this.gaps.some((e, i) => e != t[i]))) {
      this.gapIntersection.disconnect();
      for (let e of t)
        this.gapIntersection.observe(e);
      this.gaps = t;
    }
  }
  onSelectionChange(t) {
    let e = this.selectionChanged;
    if (!this.readSelectionRange() || this.delayedAndroidKey)
      return;
    let { view: i } = this, s = this.selectionRange;
    if (i.state.facet(ds) ? i.root.activeElement != this.dom : !vn(i.dom, s))
      return;
    let r = s.anchorNode && i.docView.nearest(s.anchorNode);
    if (r && r.ignoreEvent(t)) {
      e || (this.selectionChanged = !1);
      return;
    }
    (M.ie && M.ie_version <= 11 || M.android && M.chrome) && !i.state.selection.main.empty && // (Selection.isCollapsed isn't reliable on IE)
    s.focusNode && Gn(s.focusNode, s.focusOffset, s.anchorNode, s.anchorOffset) ? this.flushSoon() : this.flush(!1);
  }
  readSelectionRange() {
    let { view: t } = this, e = M.safari && t.root.nodeType == 11 && zu(this.dom.ownerDocument) == this.dom && lp(this.view) || Nn(t.root);
    if (!e || this.selectionRange.eq(e))
      return !1;
    let i = vn(this.dom, e);
    return i && !this.selectionChanged && t.inputState.lastFocusTime > Date.now() - 200 && t.inputState.lastTouchTime < Date.now() - 300 && $u(this.dom, e) ? (this.view.inputState.lastFocusTime = 0, t.docView.updateSelection(), !1) : (this.selectionRange.setRange(e), i && (this.selectionChanged = !0), !0);
  }
  setSelectionRange(t, e) {
    this.selectionRange.set(t.node, t.offset, e.node, e.offset), this.selectionChanged = !1;
  }
  clearSelectionRange() {
    this.selectionRange.set(null, 0, null, 0);
  }
  listenForScroll() {
    this.parentCheck = -1;
    let t = 0, e = null;
    for (let i = this.dom; i; )
      if (i.nodeType == 1)
        !e && t < this.scrollTargets.length && this.scrollTargets[t] == i ? t++ : e || (e = this.scrollTargets.slice(0, t)), e && e.push(i), i = i.assignedSlot || i.parentNode;
      else if (i.nodeType == 11)
        i = i.host;
      else
        break;
    if (t < this.scrollTargets.length && !e && (e = this.scrollTargets.slice(0, t)), e) {
      for (let i of this.scrollTargets)
        i.removeEventListener("scroll", this.onScroll);
      for (let i of this.scrollTargets = e)
        i.addEventListener("scroll", this.onScroll);
    }
  }
  ignore(t) {
    if (!this.active)
      return t();
    try {
      return this.stop(), t();
    } finally {
      this.start(), this.clear();
    }
  }
  start() {
    this.active || (this.observer.observe(this.dom, rp), Ws && this.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.active = !0);
  }
  stop() {
    this.active && (this.active = !1, this.observer.disconnect(), Ws && this.dom.removeEventListener("DOMCharacterDataModified", this.onCharData));
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
  delayAndroidKey(t, e) {
    var i;
    if (!this.delayedAndroidKey) {
      let s = () => {
        let r = this.delayedAndroidKey;
        r && (this.clearDelayedAndroidKey(), this.view.inputState.lastKeyCode = r.keyCode, this.view.inputState.lastKeyTime = Date.now(), !this.flush() && r.force && $e(this.dom, r.key, r.keyCode));
      };
      this.flushingAndroidKey = this.view.win.requestAnimationFrame(s);
    }
    (!this.delayedAndroidKey || t == "Enter") && (this.delayedAndroidKey = {
      key: t,
      keyCode: e,
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
    for (let t of this.observer.takeRecords())
      this.queue.push(t);
    return this.queue;
  }
  processRecords() {
    let t = this.pendingRecords();
    t.length && (this.queue = []);
    let e = -1, i = -1, s = !1;
    for (let r of t) {
      let o = this.readMutation(r);
      o && (o.typeOver && (s = !0), e == -1 ? { from: e, to: i } = o : (e = Math.min(o.from, e), i = Math.max(o.to, i)));
    }
    return { from: e, to: i, typeOver: s };
  }
  readChange() {
    let { from: t, to: e, typeOver: i } = this.processRecords(), s = this.selectionChanged && vn(this.dom, this.selectionRange);
    return t < 0 && !s ? null : (t > -1 && (this.lastChange = Date.now()), this.view.inputState.lastFocusTime = 0, this.selectionChanged = !1, new tp(this.view, t, e, i));
  }
  // Apply pending changes, if any
  flush(t = !0) {
    if (this.delayedFlush >= 0 || this.delayedAndroidKey)
      return !1;
    t && this.readSelectionRange();
    let e = this.readChange();
    if (!e)
      return !1;
    let i = this.view.state, s = Qh(this.view, e);
    return this.view.state == i && this.view.update([]), s;
  }
  readMutation(t) {
    let e = this.view.docView.nearest(t.target);
    if (!e || e.ignoreMutation(t))
      return null;
    if (e.markDirty(t.type == "attributes"), t.type == "attributes" && (e.flags |= 4), t.type == "childList") {
      let i = Zl(e, t.previousSibling || t.target.previousSibling, -1), s = Zl(e, t.nextSibling || t.target.nextSibling, 1);
      return {
        from: i ? e.posAfter(i) : e.posAtStart,
        to: s ? e.posBefore(s) : e.posAtEnd,
        typeOver: !1
      };
    } else
      return t.type == "characterData" ? { from: e.posAtStart, to: e.posAtEnd, typeOver: t.target.nodeValue == t.oldValue } : null;
  }
  setWindow(t) {
    t != this.win && (this.removeWindowListeners(this.win), this.win = t, this.addWindowListeners(this.win));
  }
  addWindowListeners(t) {
    t.addEventListener("resize", this.onResize), t.addEventListener("beforeprint", this.onPrint), t.addEventListener("scroll", this.onScroll), t.document.addEventListener("selectionchange", this.onSelectionChange);
  }
  removeWindowListeners(t) {
    t.removeEventListener("scroll", this.onScroll), t.removeEventListener("resize", this.onResize), t.removeEventListener("beforeprint", this.onPrint), t.document.removeEventListener("selectionchange", this.onSelectionChange);
  }
  destroy() {
    var t, e, i, s;
    this.stop(), (t = this.intersection) === null || t === void 0 || t.disconnect(), (e = this.gapIntersection) === null || e === void 0 || e.disconnect(), (i = this.resizeScroll) === null || i === void 0 || i.disconnect(), (s = this.resizeContent) === null || s === void 0 || s.disconnect();
    for (let r of this.scrollTargets)
      r.removeEventListener("scroll", this.onScroll);
    this.removeWindowListeners(this.win), clearTimeout(this.parentCheck), clearTimeout(this.resizeTimeout), this.win.cancelAnimationFrame(this.delayedFlush), this.win.cancelAnimationFrame(this.flushingAndroidKey);
  }
}
function Zl(n, t, e) {
  for (; t; ) {
    let i = G.get(t);
    if (i && i.parent == n)
      return i;
    let s = t.parentNode;
    t = s != n.dom ? s : e > 0 ? t.nextSibling : t.previousSibling;
  }
  return null;
}
function lp(n) {
  let t = null;
  function e(a) {
    a.preventDefault(), a.stopImmediatePropagation(), t = a.getTargetRanges()[0];
  }
  if (n.contentDOM.addEventListener("beforeinput", e, !0), n.dom.ownerDocument.execCommand("indent"), n.contentDOM.removeEventListener("beforeinput", e, !0), !t)
    return null;
  let i = t.startContainer, s = t.startOffset, r = t.endContainer, o = t.endOffset, l = n.docView.domAtPos(n.state.selection.main.anchor);
  return Gn(l.node, l.offset, r, o) && ([i, s, r, o] = [r, o, i, s]), { anchorNode: i, anchorOffset: s, focusNode: r, focusOffset: o };
}
class R {
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
  constructor(t = {}) {
    this.plugins = [], this.pluginMap = /* @__PURE__ */ new Map(), this.editorAttrs = {}, this.contentAttrs = {}, this.bidiCache = [], this.destroyed = !1, this.updateState = 2, this.measureScheduled = -1, this.measureRequests = [], this.contentDOM = document.createElement("div"), this.scrollDOM = document.createElement("div"), this.scrollDOM.tabIndex = -1, this.scrollDOM.className = "cm-scroller", this.scrollDOM.appendChild(this.contentDOM), this.announceDOM = document.createElement("div"), this.announceDOM.style.cssText = "position: fixed; top: -10000px", this.announceDOM.setAttribute("aria-live", "polite"), this.dom = document.createElement("div"), this.dom.appendChild(this.announceDOM), this.dom.appendChild(this.scrollDOM);
    let { dispatch: e } = t;
    this.dispatchTransactions = t.dispatchTransactions || e && ((i) => i.forEach((s) => e(s, this))) || ((i) => this.update(i)), this.dispatch = this.dispatch.bind(this), this._root = t.root || Uu(t.parent) || document, this.viewState = new Ml(t.state || X.create(t)), this.plugins = this.state.facet(mi).map((i) => new Ds(i));
    for (let i of this.plugins)
      i.update(this);
    this.observer = new op(this), this.inputState = new Ad(this), this.inputState.ensureHandlers(this, this.plugins), this.docView = new hl(this), this.mountStyles(), this.updateAttrs(), this.updateState = 0, this.requestMeasure(), t.parent && t.parent.appendChild(this.dom);
  }
  dispatch(...t) {
    let e = t.length == 1 && t[0] instanceof it ? t : t.length == 1 && Array.isArray(t[0]) ? t[0] : [this.state.update(...t)];
    this.dispatchTransactions(e, this);
  }
  /**
  Update the view for the given array of transactions. This will
  update the visible document and selection to match the state
  produced by the transactions, and notify view plugins of the
  change. You should usually call
  [`dispatch`](https://codemirror.net/6/docs/ref/#view.EditorView.dispatch) instead, which uses this
  as a primitive.
  */
  update(t) {
    if (this.updateState != 0)
      throw new Error("Calls to EditorView.update are not allowed while an update is in progress");
    let e = !1, i = !1, s, r = this.state;
    for (let u of t) {
      if (u.startState != r)
        throw new RangeError("Trying to update state with a transaction that doesn't start from the previous state.");
      r = u.state;
    }
    if (this.destroyed) {
      this.viewState.state = r;
      return;
    }
    let o = this.hasFocus, l = 0, a = null;
    t.some((u) => u.annotation(Gh)) ? (this.inputState.notifiedFocused = o, l = 1) : o != this.inputState.notifiedFocused && (this.inputState.notifiedFocused = o, a = Hh(r, o), a || (l = 1));
    let h = this.observer.delayedAndroidKey, c = null;
    if (h ? (this.observer.clearDelayedAndroidKey(), c = this.observer.readChange(), (c && !this.state.doc.eq(r.doc) || !this.state.selection.eq(r.selection)) && (c = null)) : this.observer.clear(), r.facet(X.phrases) != this.state.facet(X.phrases))
      return this.setState(r);
    s = zn.create(this, r, t), s.flags |= l;
    let f = this.viewState.scrollTarget;
    try {
      this.updateState = 2;
      for (let u of t) {
        if (f && (f = f.map(u.changes)), u.scrollIntoView) {
          let { main: d } = u.state.selection;
          f = new Fn(d.empty ? d : y.cursor(d.head, d.head > d.anchor ? -1 : 1));
        }
        for (let d of u.effects)
          d.is(ll) && (f = d.value);
      }
      this.viewState.update(s, f), this.bidiCache = Kn.update(this.bidiCache, s.changes), s.empty || (this.updatePlugins(s), this.inputState.update(s)), e = this.docView.update(s), this.state.facet(gi) != this.styleModules && this.mountStyles(), i = this.updateAttrs(), this.showAnnouncements(t), this.docView.updateSelection(e, t.some((u) => u.isUserEvent("select.pointer")));
    } finally {
      this.updateState = 0;
    }
    if (s.startState.facet(ln) != s.state.facet(ln) && (this.viewState.mustMeasureContent = !0), (e || i || f || this.viewState.mustEnforceCursorAssoc || this.viewState.mustMeasureContent) && this.requestMeasure(), !s.empty)
      for (let u of this.state.facet(kr))
        u(s);
    (a || c) && Promise.resolve().then(() => {
      a && this.state == a.startState && this.dispatch(a), c && !Qh(this, c) && h.force && $e(this.contentDOM, h.key, h.keyCode);
    });
  }
  /**
  Reset the view to the given state. (This will cause the entire
  document to be redrawn and all view plugins to be reinitialized,
  so you should probably only use it when the new state isn't
  derived from the old state. Otherwise, use
  [`dispatch`](https://codemirror.net/6/docs/ref/#view.EditorView.dispatch) instead.)
  */
  setState(t) {
    if (this.updateState != 0)
      throw new Error("Calls to EditorView.setState are not allowed while an update is in progress");
    if (this.destroyed) {
      this.viewState.state = t;
      return;
    }
    this.updateState = 2;
    let e = this.hasFocus;
    try {
      for (let i of this.plugins)
        i.destroy(this);
      this.viewState = new Ml(t), this.plugins = t.facet(mi).map((i) => new Ds(i)), this.pluginMap.clear();
      for (let i of this.plugins)
        i.update(this);
      this.docView = new hl(this), this.inputState.ensureHandlers(this, this.plugins), this.mountStyles(), this.updateAttrs(), this.bidiCache = [];
    } finally {
      this.updateState = 0;
    }
    e && this.focus(), this.requestMeasure();
  }
  updatePlugins(t) {
    let e = t.startState.facet(mi), i = t.state.facet(mi);
    if (e != i) {
      let s = [];
      for (let r of i) {
        let o = e.indexOf(r);
        if (o < 0)
          s.push(new Ds(r));
        else {
          let l = this.plugins[o];
          l.mustUpdate = t, s.push(l);
        }
      }
      for (let r of this.plugins)
        r.mustUpdate != t && r.destroy(this);
      this.plugins = s, this.pluginMap.clear(), this.inputState.ensureHandlers(this, this.plugins);
    } else
      for (let s of this.plugins)
        s.mustUpdate = t;
    for (let s = 0; s < this.plugins.length; s++)
      this.plugins[s].update(this);
  }
  /**
  @internal
  */
  measure(t = !0) {
    if (this.destroyed)
      return;
    if (this.measureScheduled > -1 && this.win.cancelAnimationFrame(this.measureScheduled), this.observer.delayedAndroidKey) {
      this.measureScheduled = -1, this.requestMeasure();
      return;
    }
    this.measureScheduled = 0, t && this.observer.forceFlush();
    let e = null, i = this.scrollDOM, s = i.scrollTop * this.scaleY, { scrollAnchorPos: r, scrollAnchorHeight: o } = this.viewState;
    Math.abs(s - this.viewState.scrollTop) > 1 && (o = -1), this.viewState.scrollAnchorHeight = -1;
    try {
      for (let l = 0; ; l++) {
        if (o < 0)
          if (sh(i))
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
            return Vt(this.state, p), Ll;
          }
        }), f = zn.create(this, this.state, []), u = !1;
        f.flags |= a, e ? e.flags |= a : e = f, this.updateState = 2, f.empty || (this.updatePlugins(f), this.inputState.update(f), this.updateAttrs(), u = this.docView.update(f));
        for (let d = 0; d < h.length; d++)
          if (c[d] != Ll)
            try {
              let p = h[d];
              p.write && p.write(c[d], this);
            } catch (p) {
              Vt(this.state, p);
            }
        if (u && this.docView.updateSelection(!0), !f.viewportChanged && this.measureRequests.length == 0) {
          if (this.viewState.editorHeight)
            if (this.viewState.scrollTarget) {
              this.docView.scrollIntoView(this.viewState.scrollTarget), this.viewState.scrollTarget = null;
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
    if (e && !e.empty)
      for (let l of this.state.facet(kr))
        l(e);
  }
  /**
  Get the CSS classes for the currently active editor themes.
  */
  get themeClasses() {
    return Zr + " " + (this.state.facet(Rr) ? Yh : Kh) + " " + this.state.facet(ln);
  }
  updateAttrs() {
    let t = Tl(this, vh, {
      class: "cm-editor" + (this.hasFocus ? " cm-focused " : " ") + this.themeClasses
    }), e = {
      spellcheck: "false",
      autocorrect: "off",
      autocapitalize: "off",
      translate: "no",
      contenteditable: this.state.facet(ds) ? "true" : "false",
      class: "cm-content",
      style: `${M.tabSize}: ${this.state.tabSize}`,
      role: "textbox",
      "aria-multiline": "true"
    };
    this.state.readOnly && (e["aria-readonly"] = "true"), Tl(this, so, e);
    let i = this.observer.ignore(() => {
      let s = yr(this.contentDOM, this.contentAttrs, e), r = yr(this.dom, this.editorAttrs, t);
      return s || r;
    });
    return this.editorAttrs = t, this.contentAttrs = e, i;
  }
  showAnnouncements(t) {
    let e = !0;
    for (let i of t)
      for (let s of i.effects)
        if (s.is(R.announce)) {
          e && (this.announceDOM.textContent = ""), e = !1;
          let r = this.announceDOM.appendChild(document.createElement("div"));
          r.textContent = s.value;
        }
  }
  mountStyles() {
    this.styleModules = this.state.facet(gi);
    let t = this.state.facet(R.cspNonce);
    ge.mount(this.root, this.styleModules.concat(_d).reverse(), t ? { nonce: t } : void 0);
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
  requestMeasure(t) {
    if (this.measureScheduled < 0 && (this.measureScheduled = this.win.requestAnimationFrame(() => this.measure())), t) {
      if (this.measureRequests.indexOf(t) > -1)
        return;
      if (t.key != null) {
        for (let e = 0; e < this.measureRequests.length; e++)
          if (this.measureRequests[e].key === t.key) {
            this.measureRequests[e] = t;
            return;
          }
      }
      this.measureRequests.push(t);
    }
  }
  /**
  Get the value of a specific plugin, if present. Note that
  plugins that crash can be dropped from a view, so even when you
  know you registered a given plugin, it is recommended to check
  the return value of this method.
  */
  plugin(t) {
    let e = this.pluginMap.get(t);
    return (e === void 0 || e && e.spec != t) && this.pluginMap.set(t, e = this.plugins.find((i) => i.spec == t) || null), e && e.update(this).value;
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
  elementAtHeight(t) {
    return this.readMeasured(), this.viewState.elementAtHeight(t);
  }
  /**
  Find the line block (see
  [`lineBlockAt`](https://codemirror.net/6/docs/ref/#view.EditorView.lineBlockAt) at the given
  height, again interpreted relative to the [top of the
  document](https://codemirror.net/6/docs/ref/#view.EditorView.documentTop).
  */
  lineBlockAtHeight(t) {
    return this.readMeasured(), this.viewState.lineBlockAtHeight(t);
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
  lineBlockAt(t) {
    return this.viewState.lineBlockAt(t);
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
  moveByChar(t, e, i) {
    return Vs(this, t, ml(this, t, e, i));
  }
  /**
  Move a cursor position across the next group of either
  [letters](https://codemirror.net/6/docs/ref/#state.EditorState.charCategorizer) or non-letter
  non-whitespace characters.
  */
  moveByGroup(t, e) {
    return Vs(this, t, ml(this, t, e, (i) => Cd(this, t.head, i)));
  }
  /**
  Move to the next line boundary in the given direction. If
  `includeWrap` is true, line wrapping is on, and there is a
  further wrap point on the current line, the wrap point will be
  returned. Otherwise this function will return the start or end
  of the line.
  */
  moveToLineBoundary(t, e, i = !0) {
    return vd(this, t, e, i);
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
  moveVertically(t, e, i) {
    return Vs(this, t, Od(this, t, e, i));
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
  domAtPos(t) {
    return this.docView.domAtPos(t);
  }
  /**
  Find the document position at the given DOM node. Can be useful
  for associating positions with DOM events. Will raise an error
  when `node` isn't part of the editor content.
  */
  posAtDOM(t, e = 0) {
    return this.docView.posFromDOM(t, e);
  }
  posAtCoords(t, e = !0) {
    return this.readMeasured(), Vh(this, t, e);
  }
  /**
  Get the screen coordinates at the given document position.
  `side` determines whether the coordinates are based on the
  element before (-1) or after (1) the position (if no element is
  available on the given side, the method will transparently use
  another strategy to get reasonable coordinates).
  */
  coordsAtPos(t, e = 1) {
    this.readMeasured();
    let i = this.docView.coordsAt(t, e);
    if (!i || i.left == i.right)
      return i;
    let s = this.state.doc.lineAt(t), r = this.bidiSpans(s), o = r[ue.find(r, t - s.from, -1, e)];
    return eo(i, o.dir == z.LTR == e > 0);
  }
  /**
  Return the rectangle around a given character. If `pos` does not
  point in front of a character that is in the viewport and
  rendered (i.e. not replaced, not a line break), this will return
  null. For space characters that are a line wrap point, this will
  return the position before the line break.
  */
  coordsForChar(t) {
    return this.readMeasured(), this.docView.coordsForChar(t);
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
  textDirectionAt(t) {
    return !this.state.facet(wh) || t < this.viewport.from || t > this.viewport.to ? this.textDirection : (this.readMeasured(), this.docView.textDirectionAt(t));
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
  bidiSpans(t) {
    if (t.length > ap)
      return Lh(t.length);
    let e = this.textDirectionAt(t.from), i;
    for (let r of this.bidiCache)
      if (r.from == t.from && r.dir == e && (r.fresh || Zh(r.isolates, i = al(this, t.from, t.to))))
        return r.order;
    i || (i = al(this, t.from, t.to));
    let s = cd(t.text, e, i);
    return this.bidiCache.push(new Kn(t.from, t.to, e, i, !0, s)), s;
  }
  /**
  Check whether the editor has focus.
  */
  get hasFocus() {
    var t;
    return (this.dom.ownerDocument.hasFocus() || M.safari && ((t = this.inputState) === null || t === void 0 ? void 0 : t.lastContextMenu) > Date.now() - 3e4) && this.root.activeElement == this.contentDOM;
  }
  /**
  Put focus on the editor.
  */
  focus() {
    this.observer.ignore(() => {
      ih(this.contentDOM), this.docView.updateSelection();
    });
  }
  /**
  Update the [root](https://codemirror.net/6/docs/ref/##view.EditorViewConfig.root) in which the editor lives. This is only
  necessary when moving the editor's existing DOM to a new window or shadow root.
  */
  setRoot(t) {
    this._root != t && (this._root = t, this.observer.setWindow((t.nodeType == 9 ? t : t.ownerDocument).defaultView || window), this.mountStyles());
  }
  /**
  Clean up this editor view, removing its element from the
  document, unregistering event handlers, and notifying
  plugins. The view instance can no longer be used after
  calling this.
  */
  destroy() {
    for (let t of this.plugins)
      t.destroy(this);
    this.plugins = [], this.inputState.destroy(), this.dom.remove(), this.observer.destroy(), this.measureScheduled > -1 && this.win.cancelAnimationFrame(this.measureScheduled), this.destroyed = !0;
  }
  /**
  Returns an effect that can be
  [added](https://codemirror.net/6/docs/ref/#state.TransactionSpec.effects) to a transaction to
  cause it to scroll the given position or range into view.
  */
  static scrollIntoView(t, e = {}) {
    return ll.of(new Fn(typeof t == "number" ? y.cursor(t) : t, e.y, e.x, e.yMargin, e.xMargin));
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
  static domEventHandlers(t) {
    return nt.define(() => ({}), { eventHandlers: t });
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
  static theme(t, e) {
    let i = ge.newName(), s = [ln.of(i), gi.of(Lr(`.${i}`, t))];
    return e && e.dark && s.push(Rr.of(!0)), s;
  }
  /**
  Create an extension that adds styles to the base theme. Like
  with [`theme`](https://codemirror.net/6/docs/ref/#view.EditorView^theme), use `&` to indicate the
  place of the editor wrapper element when directly targeting
  that. You can also use `&dark` or `&light` instead to only
  target editors with a dark or light theme.
  */
  static baseTheme(t) {
    return ri.lowest(gi.of(Lr("." + Zr, t, Jh)));
  }
  /**
  Retrieve an editor view instance from the view's DOM
  representation.
  */
  static findFromDOM(t) {
    var e;
    let i = t.querySelector(".cm-content"), s = i && G.get(i) || G.get(t);
    return ((e = s == null ? void 0 : s.rootView) === null || e === void 0 ? void 0 : e.view) || null;
  }
}
R.styleModule = gi;
R.inputHandler = xh;
R.focusChangeEffect = kh;
R.perLineTextDirection = wh;
R.exceptionSink = yh;
R.updateListener = kr;
R.editable = ds;
R.mouseSelectionStyle = bh;
R.dragMovesSelection = gh;
R.clickAddsSelectionRange = mh;
R.decorations = Zi;
R.atomicRanges = ro;
R.bidiIsolatedRanges = Ch;
R.scrollMargins = Oh;
R.darkTheme = Rr;
R.cspNonce = /* @__PURE__ */ A.define({ combine: (n) => n.length ? n[0] : "" });
R.contentAttributes = so;
R.editorAttributes = vh;
R.lineWrapping = /* @__PURE__ */ R.contentAttributes.of({ class: "cm-lineWrapping" });
R.announce = /* @__PURE__ */ L.define();
const ap = 4096, Ll = {};
class Kn {
  constructor(t, e, i, s, r, o) {
    this.from = t, this.to = e, this.dir = i, this.isolates = s, this.fresh = r, this.order = o;
  }
  static update(t, e) {
    if (e.empty && !t.some((r) => r.fresh))
      return t;
    let i = [], s = t.length ? t[t.length - 1].dir : z.LTR;
    for (let r = Math.max(0, t.length - 10); r < t.length; r++) {
      let o = t[r];
      o.dir == s && !e.touchesRange(o.from, o.to) && i.push(new Kn(e.mapPos(o.from, 1), e.mapPos(o.to, -1), o.dir, o.isolates, !1, o.order));
    }
    return i;
  }
}
function Tl(n, t, e) {
  for (let i = n.state.facet(t), s = i.length - 1; s >= 0; s--) {
    let r = i[s], o = typeof r == "function" ? r(n) : r;
    o && br(o, e);
  }
  return e;
}
const hp = M.mac ? "mac" : M.windows ? "win" : M.linux ? "linux" : "key";
function cp(n, t) {
  const e = n.split(/-(?!$)/);
  let i = e[e.length - 1];
  i == "Space" && (i = " ");
  let s, r, o, l;
  for (let a = 0; a < e.length - 1; ++a) {
    const h = e[a];
    if (/^(cmd|meta|m)$/i.test(h))
      l = !0;
    else if (/^a(lt)?$/i.test(h))
      s = !0;
    else if (/^(c|ctrl|control)$/i.test(h))
      r = !0;
    else if (/^s(hift)?$/i.test(h))
      o = !0;
    else if (/^mod$/i.test(h))
      t == "mac" ? l = !0 : r = !0;
    else
      throw new Error("Unrecognized modifier name: " + h);
  }
  return s && (i = "Alt-" + i), r && (i = "Ctrl-" + i), l && (i = "Meta-" + i), o && (i = "Shift-" + i), i;
}
function an(n, t, e) {
  return t.altKey && (n = "Alt-" + n), t.ctrlKey && (n = "Ctrl-" + n), t.metaKey && (n = "Meta-" + n), e !== !1 && t.shiftKey && (n = "Shift-" + n), n;
}
const fp = /* @__PURE__ */ ri.default(/* @__PURE__ */ R.domEventHandlers({
  keydown(n, t) {
    return $h(Uh(t.state), n, t, "editor");
  }
})), lo = /* @__PURE__ */ A.define({ enables: fp }), Dl = /* @__PURE__ */ new WeakMap();
function Uh(n) {
  let t = n.facet(lo), e = Dl.get(t);
  return e || Dl.set(t, e = pp(t.reduce((i, s) => i.concat(s), []))), e;
}
function up(n, t, e) {
  return $h(Uh(n.state), t, n, e);
}
let ae = null;
const dp = 4e3;
function pp(n, t = hp) {
  let e = /* @__PURE__ */ Object.create(null), i = /* @__PURE__ */ Object.create(null), s = (o, l) => {
    let a = i[o];
    if (a == null)
      i[o] = l;
    else if (a != l)
      throw new Error("Key binding " + o + " is used both as a regular binding and as a multi-stroke prefix");
  }, r = (o, l, a, h, c) => {
    var f, u;
    let d = e[o] || (e[o] = /* @__PURE__ */ Object.create(null)), p = l.split(/ (?!$)/).map((b) => cp(b, t));
    for (let b = 1; b < p.length; b++) {
      let v = p.slice(0, b).join(" ");
      s(v, !0), d[v] || (d[v] = {
        preventDefault: !0,
        stopPropagation: !1,
        run: [(O) => {
          let k = ae = { view: O, prefix: v, scope: o };
          return setTimeout(() => {
            ae == k && (ae = null);
          }, dp), !0;
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
        let c = e[h] || (e[h] = /* @__PURE__ */ Object.create(null));
        c._any || (c._any = { preventDefault: !1, stopPropagation: !1, run: [] });
        for (let f in c)
          c[f].run.push(o.any);
      }
    let a = o[t] || o.key;
    if (a)
      for (let h of l)
        r(h, a, o.run, o.preventDefault, o.stopPropagation), o.shift && r(h, "Shift-" + a, o.shift, o.preventDefault, o.stopPropagation);
  }
  return e;
}
function $h(n, t, e, i) {
  let s = Fu(t), r = lt(s, 0), o = Bt(r) == s.length && s != " ", l = "", a = !1, h = !1, c = !1;
  ae && ae.view == e && ae.scope == i && (l = ae.prefix + " ", Wh.indexOf(t.keyCode) < 0 && (h = !0, ae = null));
  let f = /* @__PURE__ */ new Set(), u = (m) => {
    if (m) {
      for (let b of m.run)
        if (!f.has(b) && (f.add(b), b(e, t)))
          return m.stopPropagation && (c = !0), !0;
      m.preventDefault && (m.stopPropagation && (c = !0), h = !0);
    }
    return !1;
  }, d = n[i], p, g;
  return d && (u(d[l + an(s, t, !o)]) ? a = !0 : o && (t.altKey || t.metaKey || t.ctrlKey) && // Ctrl-Alt may be used for AltGr on Windows
  !(M.windows && t.ctrlKey && t.altKey) && (p = be[t.keyCode]) && p != s ? (u(d[l + an(p, t, !0)]) || t.shiftKey && (g = Mi[t.keyCode]) != s && g != p && u(d[l + an(g, t, !1)])) && (a = !0) : o && t.shiftKey && u(d[l + an(s, t, !0)]) && (a = !0), !a && u(d._any) && (a = !0)), h && (a = !0), a && c && t.stopPropagation(), a;
}
class Fi {
  /**
  Create a marker with the given class and dimensions. If `width`
  is null, the DOM element will get no width style.
  */
  constructor(t, e, i, s, r) {
    this.className = t, this.left = e, this.top = i, this.width = s, this.height = r;
  }
  draw() {
    let t = document.createElement("div");
    return t.className = this.className, this.adjust(t), t;
  }
  update(t, e) {
    return e.className != this.className ? !1 : (this.adjust(t), !0);
  }
  adjust(t) {
    t.style.left = this.left + "px", t.style.top = this.top + "px", this.width != null && (t.style.width = this.width + "px"), t.style.height = this.height + "px";
  }
  eq(t) {
    return this.left == t.left && this.top == t.top && this.width == t.width && this.height == t.height && this.className == t.className;
  }
  /**
  Create a set of rectangles for the given selection range,
  assigning them theclass`className`. Will create a single
  rectangle for empty ranges, and a set of selection-style
  rectangles covering the range's content (in a bidi-aware
  way) for non-empty ones.
  */
  static forRange(t, e, i) {
    if (i.empty) {
      let s = t.coordsAtPos(i.head, i.assoc || 1);
      if (!s)
        return [];
      let r = jh(t);
      return [new Fi(e, s.left - r.left, s.top - r.top, null, s.bottom - s.top)];
    } else
      return mp(t, e, i);
  }
}
function jh(n) {
  let t = n.scrollDOM.getBoundingClientRect();
  return { left: (n.textDirection == z.LTR ? t.left : t.right - n.scrollDOM.clientWidth * n.scaleX) - n.scrollDOM.scrollLeft * n.scaleX, top: t.top - n.scrollDOM.scrollTop * n.scaleY };
}
function Pl(n, t, e) {
  let i = y.cursor(t);
  return {
    from: Math.max(e.from, n.moveToLineBoundary(i, !1, !0).from),
    to: Math.min(e.to, n.moveToLineBoundary(i, !0, !0).from),
    type: K.Text
  };
}
function mp(n, t, e) {
  if (e.to <= n.viewport.from || e.from >= n.viewport.to)
    return [];
  let i = Math.max(e.from, n.viewport.from), s = Math.min(e.to, n.viewport.to), r = n.textDirection == z.LTR, o = n.contentDOM, l = o.getBoundingClientRect(), a = jh(n), h = o.querySelector(".cm-line"), c = h && window.getComputedStyle(h), f = l.left + (c ? parseInt(c.paddingLeft) + Math.min(0, parseInt(c.textIndent)) : 0), u = l.right - (c ? parseInt(c.paddingRight) : 0), d = Or(n, i), p = Or(n, s), g = d.type == K.Text ? d : null, m = p.type == K.Text ? p : null;
  if (g && (n.lineWrapping || d.widgetLineBreaks) && (g = Pl(n, i, g)), m && (n.lineWrapping || p.widgetLineBreaks) && (m = Pl(n, s, m)), g && m && g.from == m.from)
    return v(O(e.from, e.to, g));
  {
    let w = g ? O(e.from, null, g) : k(d, !1), S = m ? O(null, e.to, m) : k(p, !0), Z = [];
    return (g || d).to < (m || p).from - (g && m ? 1 : 0) || d.widgetLineBreaks > 1 && w.bottom + n.defaultLineHeight / 2 < S.top ? Z.push(b(f, w.bottom, u, S.top)) : w.bottom < S.top && n.elementAtHeight((w.bottom + S.top) / 2).type == K.Text && (w.bottom = S.top = (w.bottom + S.top) / 2), v(w).concat(Z).concat(v(S));
  }
  function b(w, S, Z, B) {
    return new Fi(
      t,
      w - a.left,
      S - a.top - 0.01,
      Z - w,
      B - S + 0.01
      /* C.Epsilon */
    );
  }
  function v({ top: w, bottom: S, horizontal: Z }) {
    let B = [];
    for (let D = 0; D < Z.length; D += 2)
      B.push(b(Z[D], w, Z[D + 1], S));
    return B;
  }
  function O(w, S, Z) {
    let B = 1e9, D = -1e9, V = [];
    function H(wt, rt, ct, Gt, St) {
      let Y = n.coordsAtPos(wt, wt == Z.to ? -2 : 2), tt = n.coordsAtPos(ct, ct == Z.from ? 2 : -2);
      !Y || !tt || (B = Math.min(Y.top, tt.top, B), D = Math.max(Y.bottom, tt.bottom, D), St == z.LTR ? V.push(r && rt ? f : Y.left, r && Gt ? u : tt.right) : V.push(!r && Gt ? f : tt.left, !r && rt ? u : Y.right));
    }
    let _ = w ?? Z.from, ht = S ?? Z.to;
    for (let wt of n.visibleRanges)
      if (wt.to > _ && wt.from < ht)
        for (let rt = Math.max(wt.from, _), ct = Math.min(wt.to, ht); ; ) {
          let Gt = n.state.doc.lineAt(rt);
          for (let St of n.bidiSpans(Gt)) {
            let Y = St.from + Gt.from, tt = St.to + Gt.from;
            if (Y >= ct)
              break;
            tt > rt && H(Math.max(Y, rt), w == null && Y <= _, Math.min(tt, ct), S == null && tt >= ht, St.dir);
          }
          if (rt = Gt.to + 1, rt >= ct)
            break;
        }
    return V.length == 0 && H(_, w == null, ht, S == null, n.textDirection), { top: B, bottom: D, horizontal: V };
  }
  function k(w, S) {
    let Z = l.top + (S ? w.top : w.bottom);
    return { top: Z, bottom: Z, horizontal: [] };
  }
}
function gp(n, t) {
  return n.constructor == t.constructor && n.eq(t);
}
class bp {
  constructor(t, e) {
    this.view = t, this.layer = e, this.drawn = [], this.scaleX = 1, this.scaleY = 1, this.measureReq = { read: this.measure.bind(this), write: this.draw.bind(this) }, this.dom = t.scrollDOM.appendChild(document.createElement("div")), this.dom.classList.add("cm-layer"), e.above && this.dom.classList.add("cm-layer-above"), e.class && this.dom.classList.add(e.class), this.scale(), this.dom.setAttribute("aria-hidden", "true"), this.setOrder(t.state), t.requestMeasure(this.measureReq), e.mount && e.mount(this.dom, t);
  }
  update(t) {
    t.startState.facet(An) != t.state.facet(An) && this.setOrder(t.state), (this.layer.update(t, this.dom) || t.geometryChanged) && (this.scale(), t.view.requestMeasure(this.measureReq));
  }
  setOrder(t) {
    let e = 0, i = t.facet(An);
    for (; e < i.length && i[e] != this.layer; )
      e++;
    this.dom.style.zIndex = String((this.layer.above ? 150 : -1) - e);
  }
  measure() {
    return this.layer.markers(this.view);
  }
  scale() {
    let { scaleX: t, scaleY: e } = this.view;
    (t != this.scaleX || e != this.scaleY) && (this.scaleX = t, this.scaleY = e, this.dom.style.transform = `scale(${1 / t}, ${1 / e})`);
  }
  draw(t) {
    if (t.length != this.drawn.length || t.some((e, i) => !gp(e, this.drawn[i]))) {
      let e = this.dom.firstChild, i = 0;
      for (let s of t)
        s.update && e && s.constructor && this.drawn[i].constructor && s.update(e, this.drawn[i]) ? (e = e.nextSibling, i++) : this.dom.insertBefore(s.draw(), e);
      for (; e; ) {
        let s = e.nextSibling;
        e.remove(), e = s;
      }
      this.drawn = t;
    }
  }
  destroy() {
    this.layer.destroy && this.layer.destroy(this.dom, this.view), this.dom.remove();
  }
}
const An = /* @__PURE__ */ A.define();
function qh(n) {
  return [
    nt.define((t) => new bp(t, n)),
    An.of(n)
  ];
}
const _h = !M.ios, Ti = /* @__PURE__ */ A.define({
  combine(n) {
    return qt(n, {
      cursorBlinkRate: 1200,
      drawRangeCursor: !0
    }, {
      cursorBlinkRate: (t, e) => Math.min(t, e),
      drawRangeCursor: (t, e) => t || e
    });
  }
});
function yp(n = {}) {
  return [
    Ti.of(n),
    xp,
    kp,
    wp,
    Sh.of(!0)
  ];
}
function tc(n) {
  return n.startState.facet(Ti) != n.state.facet(Ti);
}
const xp = /* @__PURE__ */ qh({
  above: !0,
  markers(n) {
    let { state: t } = n, e = t.facet(Ti), i = [];
    for (let s of t.selection.ranges) {
      let r = s == t.selection.main;
      if (s.empty ? !r || _h : e.drawRangeCursor) {
        let o = r ? "cm-cursor cm-cursor-primary" : "cm-cursor cm-cursor-secondary", l = s.empty ? s : y.cursor(s.head, s.head > s.anchor ? -1 : 1);
        for (let a of Fi.forRange(n, o, l))
          i.push(a);
      }
    }
    return i;
  },
  update(n, t) {
    n.transactions.some((i) => i.selection) && (t.style.animationName = t.style.animationName == "cm-blink" ? "cm-blink2" : "cm-blink");
    let e = tc(n);
    return e && Vl(n.state, t), n.docChanged || n.selectionSet || e;
  },
  mount(n, t) {
    Vl(t.state, n);
  },
  class: "cm-cursorLayer"
});
function Vl(n, t) {
  t.style.animationDuration = n.facet(Ti).cursorBlinkRate + "ms";
}
const kp = /* @__PURE__ */ qh({
  above: !1,
  markers(n) {
    return n.state.selection.ranges.map((t) => t.empty ? [] : Fi.forRange(n, "cm-selectionBackground", t)).reduce((t, e) => t.concat(e));
  },
  update(n, t) {
    return n.docChanged || n.selectionSet || n.viewportChanged || tc(n);
  },
  class: "cm-selectionLayer"
}), ec = {
  ".cm-line": {
    "& ::selection": { backgroundColor: "transparent !important" },
    "&::selection": { backgroundColor: "transparent !important" }
  }
};
_h && (ec[".cm-line"].caretColor = "transparent !important");
const wp = /* @__PURE__ */ ri.highest(/* @__PURE__ */ R.theme(ec)), ic = /* @__PURE__ */ L.define({
  map(n, t) {
    return n == null ? null : t.mapPos(n);
  }
}), yi = /* @__PURE__ */ q.define({
  create() {
    return null;
  },
  update(n, t) {
    return n != null && (n = t.changes.mapPos(n)), t.effects.reduce((e, i) => i.is(ic) ? i.value : e, n);
  }
}), Sp = /* @__PURE__ */ nt.fromClass(class {
  constructor(n) {
    this.view = n, this.cursor = null, this.measureReq = { read: this.readPos.bind(this), write: this.drawCursor.bind(this) };
  }
  update(n) {
    var t;
    let e = n.state.field(yi);
    e == null ? this.cursor != null && ((t = this.cursor) === null || t === void 0 || t.remove(), this.cursor = null) : (this.cursor || (this.cursor = this.view.scrollDOM.appendChild(document.createElement("div")), this.cursor.className = "cm-dropCursor"), (n.startState.field(yi) != e || n.docChanged || n.geometryChanged) && this.view.requestMeasure(this.measureReq));
  }
  readPos() {
    let { view: n } = this, t = n.state.field(yi), e = t != null && n.coordsAtPos(t);
    if (!e)
      return null;
    let i = n.scrollDOM.getBoundingClientRect();
    return {
      left: e.left - i.left + n.scrollDOM.scrollLeft * n.scaleX,
      top: e.top - i.top + n.scrollDOM.scrollTop * n.scaleY,
      height: e.bottom - e.top
    };
  }
  drawCursor(n) {
    if (this.cursor) {
      let { scaleX: t, scaleY: e } = this.view;
      n ? (this.cursor.style.left = n.left / t + "px", this.cursor.style.top = n.top / e + "px", this.cursor.style.height = n.height / e + "px") : this.cursor.style.left = "-100000px";
    }
  }
  destroy() {
    this.cursor && this.cursor.remove();
  }
  setDropPos(n) {
    this.view.state.field(yi) != n && this.view.dispatch({ effects: ic.of(n) });
  }
}, {
  eventHandlers: {
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
function vp() {
  return [yi, Sp];
}
function Bl(n, t, e, i, s) {
  t.lastIndex = 0;
  for (let r = n.iterRange(e, i), o = e, l; !r.next().done; o += r.value.length)
    if (!r.lineBreak)
      for (; l = t.exec(r.value); )
        s(o + l.index, l);
}
function Cp(n, t) {
  let e = n.visibleRanges;
  if (e.length == 1 && e[0].from == n.viewport.from && e[0].to == n.viewport.to)
    return e;
  let i = [];
  for (let { from: s, to: r } of e)
    s = Math.max(n.state.doc.lineAt(s).from, s - t), r = Math.min(n.state.doc.lineAt(r).to, r + t), i.length && i[i.length - 1].to >= s ? i[i.length - 1].to = r : i.push({ from: s, to: r });
  return i;
}
class Op {
  /**
  Create a decorator.
  */
  constructor(t) {
    const { regexp: e, decoration: i, decorate: s, boundary: r, maxLength: o = 1e3 } = t;
    if (!e.global)
      throw new RangeError("The regular expression given to MatchDecorator should have its 'g' flag set");
    if (this.regexp = e, s)
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
  createDeco(t) {
    let e = new me(), i = e.add.bind(e);
    for (let { from: s, to: r } of Cp(t, this.maxLength))
      Bl(t.state.doc, this.regexp, s, r, (o, l) => this.addMatch(l, t, o, i));
    return e.finish();
  }
  /**
  Update a set of decorations for a view update. `deco` _must_ be
  the set of decorations produced by _this_ `MatchDecorator` for
  the view state before the update.
  */
  updateDeco(t, e) {
    let i = 1e9, s = -1;
    return t.docChanged && t.changes.iterChanges((r, o, l, a) => {
      a > t.view.viewport.from && l < t.view.viewport.to && (i = Math.min(l, i), s = Math.max(a, s));
    }), t.viewportChanged || s - i > 1e3 ? this.createDeco(t.view) : s > -1 ? this.updateRange(t.view, e.map(t.changes), i, s) : e;
  }
  updateRange(t, e, i, s) {
    for (let r of t.visibleRanges) {
      let o = Math.max(r.from, i), l = Math.min(r.to, s);
      if (l > o) {
        let a = t.state.doc.lineAt(o), h = a.to < l ? t.state.doc.lineAt(l) : a, c = Math.max(r.from, a.from), f = Math.min(r.to, h.to);
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
            this.addMatch(d, t, d.index + a.from, p);
        else
          Bl(t.state.doc, this.regexp, c, f, (g, m) => this.addMatch(m, t, g, p));
        e = e.update({ filterFrom: c, filterTo: f, filter: (g, m) => g < c || m > f, add: u });
      }
    }
    return e;
  }
}
const Tr = /x/.unicode != null ? "gu" : "g", Ap = /* @__PURE__ */ new RegExp(`[\0-\b
--­؜​‎‏\u2028\u2029‭‮⁦⁧⁩\uFEFF￹-￼]`, Tr), Mp = {
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
let Xs = null;
function Rp() {
  var n;
  if (Xs == null && typeof document < "u" && document.body) {
    let t = document.body.style;
    Xs = ((n = t.tabSize) !== null && n !== void 0 ? n : t.MozTabSize) != null;
  }
  return Xs || !1;
}
const Mn = /* @__PURE__ */ A.define({
  combine(n) {
    let t = qt(n, {
      render: null,
      specialChars: Ap,
      addSpecialChars: null
    });
    return (t.replaceTabs = !Rp()) && (t.specialChars = new RegExp("	|" + t.specialChars.source, Tr)), t.addSpecialChars && (t.specialChars = new RegExp(t.specialChars.source + "|" + t.addSpecialChars.source, Tr)), t;
  }
});
function Zp(n = {}) {
  return [Mn.of(n), Lp()];
}
let Wl = null;
function Lp() {
  return Wl || (Wl = nt.fromClass(class {
    constructor(n) {
      this.view = n, this.decorations = T.none, this.decorationCache = /* @__PURE__ */ Object.create(null), this.decorator = this.makeDecorator(n.state.facet(Mn)), this.decorations = this.decorator.createDeco(n);
    }
    makeDecorator(n) {
      return new Op({
        regexp: n.specialChars,
        decoration: (t, e, i) => {
          let { doc: s } = e.state, r = lt(t[0], 0);
          if (r == 9) {
            let o = s.lineAt(i), l = e.state.tabSize, a = Ni(o.text, l, i - o.from);
            return T.replace({
              widget: new Vp((l - a % l) * this.view.defaultCharacterWidth / this.view.scaleX)
            });
          }
          return this.decorationCache[r] || (this.decorationCache[r] = T.replace({ widget: new Pp(n, r) }));
        },
        boundary: n.replaceTabs ? void 0 : /[^]/
      });
    }
    update(n) {
      let t = n.state.facet(Mn);
      n.startState.facet(Mn) != t ? (this.decorator = this.makeDecorator(t), this.decorations = this.decorator.createDeco(n.view)) : this.decorations = this.decorator.updateDeco(n, this.decorations);
    }
  }, {
    decorations: (n) => n.decorations
  }));
}
const Tp = "•";
function Dp(n) {
  return n >= 32 ? Tp : n == 10 ? "␤" : String.fromCharCode(9216 + n);
}
class Pp extends Se {
  constructor(t, e) {
    super(), this.options = t, this.code = e;
  }
  eq(t) {
    return t.code == this.code;
  }
  toDOM(t) {
    let e = Dp(this.code), i = t.state.phrase("Control character") + " " + (Mp[this.code] || "0x" + this.code.toString(16)), s = this.options.render && this.options.render(this.code, i, e);
    if (s)
      return s;
    let r = document.createElement("span");
    return r.textContent = e, r.title = i, r.setAttribute("aria-label", i), r.className = "cm-specialChar", r;
  }
  ignoreEvent() {
    return !1;
  }
}
class Vp extends Se {
  constructor(t) {
    super(), this.width = t;
  }
  eq(t) {
    return t.width == this.width;
  }
  toDOM() {
    let t = document.createElement("span");
    return t.textContent = "	", t.className = "cm-tab", t.style.width = this.width + "px", t;
  }
  ignoreEvent() {
    return !1;
  }
}
const hn = "-10000px";
class nc {
  constructor(t, e, i) {
    this.facet = e, this.createTooltipView = i, this.input = t.state.facet(e), this.tooltips = this.input.filter((s) => s), this.tooltipViews = this.tooltips.map(i);
  }
  update(t) {
    var e;
    let i = t.state.facet(this.facet), s = i.filter((o) => o);
    if (i === this.input) {
      for (let o of this.tooltipViews)
        o.update && o.update(t);
      return !1;
    }
    let r = [];
    for (let o = 0; o < s.length; o++) {
      let l = s[o], a = -1;
      if (l) {
        for (let h = 0; h < this.tooltips.length; h++) {
          let c = this.tooltips[h];
          c && c.create == l.create && (a = h);
        }
        if (a < 0)
          r[o] = this.createTooltipView(l);
        else {
          let h = r[o] = this.tooltipViews[a];
          h.update && h.update(t);
        }
      }
    }
    for (let o of this.tooltipViews)
      r.indexOf(o) < 0 && (o.dom.remove(), (e = o.destroy) === null || e === void 0 || e.call(o));
    return this.input = i, this.tooltips = s, this.tooltipViews = r, !0;
  }
}
function Bp(n) {
  let { win: t } = n;
  return { top: 0, left: 0, bottom: t.innerHeight, right: t.innerWidth };
}
const Is = /* @__PURE__ */ A.define({
  combine: (n) => {
    var t, e, i;
    return {
      position: M.ios ? "absolute" : ((t = n.find((s) => s.position)) === null || t === void 0 ? void 0 : t.position) || "fixed",
      parent: ((e = n.find((s) => s.parent)) === null || e === void 0 ? void 0 : e.parent) || null,
      tooltipSpace: ((i = n.find((s) => s.tooltipSpace)) === null || i === void 0 ? void 0 : i.tooltipSpace) || Bp
    };
  }
}), Xl = /* @__PURE__ */ new WeakMap(), sc = /* @__PURE__ */ nt.fromClass(class {
  constructor(n) {
    this.view = n, this.inView = !0, this.madeAbsolute = !1, this.lastTransaction = 0, this.measureTimeout = -1;
    let t = n.state.facet(Is);
    this.position = t.position, this.parent = t.parent, this.classes = n.themeClasses, this.createContainer(), this.measureReq = { read: this.readMeasure.bind(this), write: this.writeMeasure.bind(this), key: this }, this.manager = new nc(n, ps, (e) => this.createTooltip(e)), this.intersectionObserver = typeof IntersectionObserver == "function" ? new IntersectionObserver((e) => {
      Date.now() > this.lastTransaction - 50 && e.length > 0 && e[e.length - 1].intersectionRatio < 1 && this.measureSoon();
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
    let t = this.manager.update(n);
    t && this.observeIntersection();
    let e = t || n.geometryChanged, i = n.state.facet(Is);
    if (i.position != this.position && !this.madeAbsolute) {
      this.position = i.position;
      for (let s of this.manager.tooltipViews)
        s.dom.style.position = this.position;
      e = !0;
    }
    if (i.parent != this.parent) {
      this.parent && this.container.remove(), this.parent = i.parent, this.createContainer();
      for (let s of this.manager.tooltipViews)
        this.container.appendChild(s.dom);
      e = !0;
    } else
      this.parent && this.view.themeClasses != this.classes && (this.classes = this.container.className = this.view.themeClasses);
    e && this.maybeMeasure();
  }
  createTooltip(n) {
    let t = n.create(this.view);
    if (t.dom.classList.add("cm-tooltip"), n.arrow && !t.dom.querySelector(".cm-tooltip > .cm-tooltip-arrow")) {
      let e = document.createElement("div");
      e.className = "cm-tooltip-arrow", t.dom.appendChild(e);
    }
    return t.dom.style.position = this.position, t.dom.style.top = hn, this.container.appendChild(t.dom), t.mount && t.mount(this.view), t;
  }
  destroy() {
    var n, t;
    this.view.win.removeEventListener("resize", this.measureSoon);
    for (let e of this.manager.tooltipViews)
      e.dom.remove(), (n = e.destroy) === null || n === void 0 || n.call(e);
    (t = this.intersectionObserver) === null || t === void 0 || t.disconnect(), clearTimeout(this.measureTimeout);
  }
  readMeasure() {
    let n = this.view.dom.getBoundingClientRect(), t = 1, e = 1, i = !1;
    if (this.position == "fixed") {
      let s = this.manager.tooltipViews;
      i = s.length > 0 && s[0].dom.offsetParent != this.container.ownerDocument.body;
    }
    if (i || this.position == "absolute")
      if (this.parent) {
        let s = this.parent.getBoundingClientRect();
        s.width && s.height && (t = s.width / this.parent.offsetWidth, e = s.height / this.parent.offsetHeight);
      } else
        ({ scaleX: t, scaleY: e } = this.view.viewState);
    return {
      editor: n,
      parent: this.parent ? this.container.getBoundingClientRect() : n,
      pos: this.manager.tooltips.map((s, r) => {
        let o = this.manager.tooltipViews[r];
        return o.getCoords ? o.getCoords(s.pos) : this.view.coordsAtPos(s.pos);
      }),
      size: this.manager.tooltipViews.map(({ dom: s }) => s.getBoundingClientRect()),
      space: this.view.state.facet(Is).tooltipSpace(this.view),
      scaleX: t,
      scaleY: e,
      makeAbsolute: i
    };
  }
  writeMeasure(n) {
    var t;
    if (n.makeAbsolute) {
      this.madeAbsolute = !0, this.position = "absolute";
      for (let l of this.manager.tooltipViews)
        l.dom.style.position = "absolute";
    }
    let { editor: e, space: i, scaleX: s, scaleY: r } = n, o = [];
    for (let l = 0; l < this.manager.tooltips.length; l++) {
      let a = this.manager.tooltips[l], h = this.manager.tooltipViews[l], { dom: c } = h, f = n.pos[l], u = n.size[l];
      if (!f || f.bottom <= Math.max(e.top, i.top) || f.top >= Math.min(e.bottom, i.bottom) || f.right < Math.max(e.left, i.left) - 0.1 || f.left > Math.min(e.right, i.right) + 0.1) {
        c.style.top = hn;
        continue;
      }
      let d = a.arrow ? h.dom.querySelector(".cm-tooltip-arrow") : null, p = d ? 7 : 0, g = u.right - u.left, m = (t = Xl.get(h)) !== null && t !== void 0 ? t : u.bottom - u.top, b = h.offset || Xp, v = this.view.textDirection == z.LTR, O = u.width > i.right - i.left ? v ? i.left : i.right - u.width : v ? Math.min(f.left - (d ? 14 : 0) + b.x, i.right - g) : Math.max(i.left, f.left - g + (d ? 14 : 0) - b.x), k = !!a.above;
      !a.strictSide && (k ? f.top - (u.bottom - u.top) - b.y < i.top : f.bottom + (u.bottom - u.top) + b.y > i.bottom) && k == i.bottom - f.bottom > f.top - i.top && (k = !k);
      let w = (k ? f.top - i.top : i.bottom - f.bottom) - p;
      if (w < m && h.resize !== !1) {
        if (w < this.view.defaultLineHeight) {
          c.style.top = hn;
          continue;
        }
        Xl.set(h, m), c.style.height = (m = w) / r + "px";
      } else
        c.style.height && (c.style.height = "");
      let S = k ? f.top - m - p - b.y : f.bottom + p + b.y, Z = O + g;
      if (h.overlap !== !0)
        for (let B of o)
          B.left < Z && B.right > O && B.top < S + m && B.bottom > S && (S = k ? B.top - m - 2 - p : B.bottom + p + 2);
      if (this.position == "absolute" ? (c.style.top = (S - n.parent.top) / r + "px", c.style.left = (O - n.parent.left) / s + "px") : (c.style.top = S / r + "px", c.style.left = O / s + "px"), d) {
        let B = f.left + (v ? b.x : -b.x) - (O + 14 - 7);
        d.style.left = B / s + "px";
      }
      h.overlap !== !0 && o.push({ left: O, top: S, right: Z, bottom: S + m }), c.classList.toggle("cm-tooltip-above", k), c.classList.toggle("cm-tooltip-below", !k), h.positioned && h.positioned(n.space);
    }
  }
  maybeMeasure() {
    if (this.manager.tooltips.length && (this.view.inView && this.view.requestMeasure(this.measureReq), this.inView != this.view.inView && (this.inView = this.view.inView, !this.inView)))
      for (let n of this.manager.tooltipViews)
        n.dom.style.top = hn;
  }
}, {
  eventHandlers: {
    scroll() {
      this.maybeMeasure();
    }
  }
}), Wp = /* @__PURE__ */ R.baseTheme({
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
}), Xp = { x: 0, y: 0 }, ps = /* @__PURE__ */ A.define({
  enables: [sc, Wp]
}), Yn = /* @__PURE__ */ A.define();
class ao {
  // Needs to be static so that host tooltip instances always match
  static create(t) {
    return new ao(t);
  }
  constructor(t) {
    this.view = t, this.mounted = !1, this.dom = document.createElement("div"), this.dom.classList.add("cm-tooltip-hover"), this.manager = new nc(t, Yn, (e) => this.createHostedView(e));
  }
  createHostedView(t) {
    let e = t.create(this.view);
    return e.dom.classList.add("cm-tooltip-section"), this.dom.appendChild(e.dom), this.mounted && e.mount && e.mount(this.view), e;
  }
  mount(t) {
    for (let e of this.manager.tooltipViews)
      e.mount && e.mount(t);
    this.mounted = !0;
  }
  positioned(t) {
    for (let e of this.manager.tooltipViews)
      e.positioned && e.positioned(t);
  }
  update(t) {
    this.manager.update(t);
  }
  destroy() {
    var t;
    for (let e of this.manager.tooltipViews)
      (t = e.destroy) === null || t === void 0 || t.call(e);
  }
}
const Ip = /* @__PURE__ */ ps.compute([Yn], (n) => {
  let t = n.facet(Yn).filter((e) => e);
  return t.length === 0 ? null : {
    pos: Math.min(...t.map((e) => e.pos)),
    end: Math.max(...t.filter((e) => e.end != null).map((e) => e.end)),
    create: ao.create,
    above: t[0].above,
    arrow: t.some((e) => e.arrow)
  };
});
class Ep {
  constructor(t, e, i, s, r) {
    this.view = t, this.source = e, this.field = i, this.setHover = s, this.hoverTime = r, this.hoverTimeout = -1, this.restartTimeout = -1, this.pending = null, this.lastMove = { x: 0, y: 0, target: t.dom, time: 0 }, this.checkHover = this.checkHover.bind(this), t.dom.addEventListener("mouseleave", this.mouseleave = this.mouseleave.bind(this)), t.dom.addEventListener("mousemove", this.mousemove = this.mousemove.bind(this));
  }
  update() {
    this.pending && (this.pending = null, clearTimeout(this.restartTimeout), this.restartTimeout = setTimeout(() => this.startHover(), 20));
  }
  get active() {
    return this.view.state.field(this.field);
  }
  checkHover() {
    if (this.hoverTimeout = -1, this.active)
      return;
    let t = Date.now() - this.lastMove.time;
    t < this.hoverTime ? this.hoverTimeout = setTimeout(this.checkHover, this.hoverTime - t) : this.startHover();
  }
  startHover() {
    clearTimeout(this.restartTimeout);
    let { view: t, lastMove: e } = this, i = t.docView.nearest(e.target);
    if (!i)
      return;
    let s, r = 1;
    if (i instanceof fe)
      s = i.posAtStart;
    else {
      if (s = t.posAtCoords(e), s == null)
        return;
      let l = t.coordsAtPos(s);
      if (!l || e.y < l.top || e.y > l.bottom || e.x < l.left - t.defaultCharacterWidth || e.x > l.right + t.defaultCharacterWidth)
        return;
      let a = t.bidiSpans(t.state.doc.lineAt(s)).find((c) => c.from <= s && c.to >= s), h = a && a.dir == z.RTL ? -1 : 1;
      r = e.x < l.left ? -h : h;
    }
    let o = this.source(t, s, r);
    if (o != null && o.then) {
      let l = this.pending = { pos: s };
      o.then((a) => {
        this.pending == l && (this.pending = null, a && t.dispatch({ effects: this.setHover.of(a) }));
      }, (a) => Vt(t.state, a, "hover tooltip"));
    } else
      o && t.dispatch({ effects: this.setHover.of(o) });
  }
  mousemove(t) {
    var e;
    this.lastMove = { x: t.clientX, y: t.clientY, target: t.target, time: Date.now() }, this.hoverTimeout < 0 && (this.hoverTimeout = setTimeout(this.checkHover, this.hoverTime));
    let i = this.active;
    if (i && !Il(this.lastMove.target) || this.pending) {
      let { pos: s } = i || this.pending, r = (e = i == null ? void 0 : i.end) !== null && e !== void 0 ? e : s;
      (s == r ? this.view.posAtCoords(this.lastMove) != s : !Np(this.view, s, r, t.clientX, t.clientY)) && (this.view.dispatch({ effects: this.setHover.of(null) }), this.pending = null);
    }
  }
  mouseleave(t) {
    clearTimeout(this.hoverTimeout), this.hoverTimeout = -1, this.active && !Il(t.relatedTarget) && this.view.dispatch({ effects: this.setHover.of(null) });
  }
  destroy() {
    clearTimeout(this.hoverTimeout), this.view.dom.removeEventListener("mouseleave", this.mouseleave), this.view.dom.removeEventListener("mousemove", this.mousemove);
  }
}
function Il(n) {
  for (let t = n; t; t = t.parentNode)
    if (t.nodeType == 1 && t.classList.contains("cm-tooltip"))
      return !0;
  return !1;
}
function Np(n, t, e, i, s, r) {
  let o = n.scrollDOM.getBoundingClientRect(), l = n.documentTop + n.documentPadding.top + n.contentHeight;
  if (o.left > i || o.right < i || o.top > s || Math.min(o.bottom, l) < s)
    return !1;
  let a = n.posAtCoords({ x: i, y: s }, !1);
  return a >= t && a <= e;
}
function Gp(n, t = {}) {
  let e = L.define(), i = q.define({
    create() {
      return null;
    },
    update(s, r) {
      if (s && (t.hideOnChange && (r.docChanged || r.selection) || t.hideOn && t.hideOn(r, s)))
        return null;
      if (s && r.docChanged) {
        let o = r.changes.mapPos(s.pos, -1, yt.TrackDel);
        if (o == null)
          return null;
        let l = Object.assign(/* @__PURE__ */ Object.create(null), s);
        l.pos = o, s.end != null && (l.end = r.changes.mapPos(s.end)), s = l;
      }
      for (let o of r.effects)
        o.is(e) && (s = o.value), o.is(Hp) && (s = null);
      return s;
    },
    provide: (s) => Yn.from(s)
  });
  return [
    i,
    nt.define((s) => new Ep(
      s,
      n,
      i,
      e,
      t.hoverTime || 300
      /* Hover.Time */
    )),
    Ip
  ];
}
function rc(n, t) {
  let e = n.plugin(sc);
  if (!e)
    return null;
  let i = e.manager.tooltips.indexOf(t);
  return i < 0 ? null : e.manager.tooltipViews[i];
}
const Hp = /* @__PURE__ */ L.define(), El = /* @__PURE__ */ A.define({
  combine(n) {
    let t, e;
    for (let i of n)
      t = t || i.topContainer, e = e || i.bottomContainer;
    return { topContainer: t, bottomContainer: e };
  }
});
function Di(n, t) {
  let e = n.plugin(oc), i = e ? e.specs.indexOf(t) : -1;
  return i > -1 ? e.panels[i] : null;
}
const oc = /* @__PURE__ */ nt.fromClass(class {
  constructor(n) {
    this.input = n.state.facet(Pi), this.specs = this.input.filter((e) => e), this.panels = this.specs.map((e) => e(n));
    let t = n.state.facet(El);
    this.top = new cn(n, !0, t.topContainer), this.bottom = new cn(n, !1, t.bottomContainer), this.top.sync(this.panels.filter((e) => e.top)), this.bottom.sync(this.panels.filter((e) => !e.top));
    for (let e of this.panels)
      e.dom.classList.add("cm-panel"), e.mount && e.mount();
  }
  update(n) {
    let t = n.state.facet(El);
    this.top.container != t.topContainer && (this.top.sync([]), this.top = new cn(n.view, !0, t.topContainer)), this.bottom.container != t.bottomContainer && (this.bottom.sync([]), this.bottom = new cn(n.view, !1, t.bottomContainer)), this.top.syncClasses(), this.bottom.syncClasses();
    let e = n.state.facet(Pi);
    if (e != this.input) {
      let i = e.filter((a) => a), s = [], r = [], o = [], l = [];
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
  provide: (n) => R.scrollMargins.of((t) => {
    let e = t.plugin(n);
    return e && { top: e.top.scrollMargin(), bottom: e.bottom.scrollMargin() };
  })
});
class cn {
  constructor(t, e, i) {
    this.view = t, this.top = e, this.container = i, this.dom = void 0, this.classes = "", this.panels = [], this.syncClasses();
  }
  sync(t) {
    for (let e of this.panels)
      e.destroy && t.indexOf(e) < 0 && e.destroy();
    this.panels = t, this.syncDOM();
  }
  syncDOM() {
    if (this.panels.length == 0) {
      this.dom && (this.dom.remove(), this.dom = void 0);
      return;
    }
    if (!this.dom) {
      this.dom = document.createElement("div"), this.dom.className = this.top ? "cm-panels cm-panels-top" : "cm-panels cm-panels-bottom", this.dom.style[this.top ? "top" : "bottom"] = "0";
      let e = this.container || this.view.dom;
      e.insertBefore(this.dom, this.top ? e.firstChild : null);
    }
    let t = this.dom.firstChild;
    for (let e of this.panels)
      if (e.dom.parentNode == this.dom) {
        for (; t != e.dom; )
          t = Nl(t);
        t = t.nextSibling;
      } else
        this.dom.insertBefore(e.dom, t);
    for (; t; )
      t = Nl(t);
  }
  scrollMargin() {
    return !this.dom || this.container ? 0 : Math.max(0, this.top ? this.dom.getBoundingClientRect().bottom - Math.max(0, this.view.scrollDOM.getBoundingClientRect().top) : Math.min(innerHeight, this.view.scrollDOM.getBoundingClientRect().bottom) - this.dom.getBoundingClientRect().top);
  }
  syncClasses() {
    if (!(!this.container || this.classes == this.view.themeClasses)) {
      for (let t of this.classes.split(" "))
        t && this.container.classList.remove(t);
      for (let t of (this.classes = this.view.themeClasses).split(" "))
        t && this.container.classList.add(t);
    }
  }
}
function Nl(n) {
  let t = n.nextSibling;
  return n.remove(), t;
}
const Pi = /* @__PURE__ */ A.define({
  enables: oc
});
class se extends Pe {
  /**
  @internal
  */
  compare(t) {
    return this == t || this.constructor == t.constructor && this.eq(t);
  }
  /**
  Compare this marker to another marker of the same type.
  */
  eq(t) {
    return !1;
  }
  /**
  Called if the marker has a `toDOM` method and its representation
  was removed from a gutter.
  */
  destroy(t) {
  }
}
se.prototype.elementClass = "";
se.prototype.toDOM = void 0;
se.prototype.mapMode = yt.TrackBefore;
se.prototype.startSide = se.prototype.endSide = -1;
se.prototype.point = !0;
const Es = /* @__PURE__ */ A.define(), Fp = {
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
}, Si = /* @__PURE__ */ A.define();
function lc(n) {
  return [ac(), Si.of(Object.assign(Object.assign({}, Fp), n))];
}
const Dr = /* @__PURE__ */ A.define({
  combine: (n) => n.some((t) => t)
});
function ac(n) {
  let t = [
    zp
  ];
  return n && n.fixed === !1 && t.push(Dr.of(!0)), t;
}
const zp = /* @__PURE__ */ nt.fromClass(class {
  constructor(n) {
    this.view = n, this.prevViewport = n.viewport, this.dom = document.createElement("div"), this.dom.className = "cm-gutters", this.dom.setAttribute("aria-hidden", "true"), this.dom.style.minHeight = this.view.contentHeight / this.view.scaleY + "px", this.gutters = n.state.facet(Si).map((t) => new Hl(n, t));
    for (let t of this.gutters)
      this.dom.appendChild(t.dom);
    this.fixed = !n.state.facet(Dr), this.fixed && (this.dom.style.position = "sticky"), this.syncGutters(!1), n.scrollDOM.insertBefore(this.dom, n.contentDOM);
  }
  update(n) {
    if (this.updateGutters(n)) {
      let t = this.prevViewport, e = n.view.viewport, i = Math.min(t.to, e.to) - Math.max(t.from, e.from);
      this.syncGutters(i < (e.to - e.from) * 0.8);
    }
    n.geometryChanged && (this.dom.style.minHeight = this.view.contentHeight + "px"), this.view.state.facet(Dr) != !this.fixed && (this.fixed = !this.fixed, this.dom.style.position = this.fixed ? "sticky" : ""), this.prevViewport = n.view.viewport;
  }
  syncGutters(n) {
    let t = this.dom.nextSibling;
    n && this.dom.remove();
    let e = I.iter(this.view.state.facet(Es), this.view.viewport.from), i = [], s = this.gutters.map((r) => new Kp(r, this.view.viewport, -this.view.documentPadding.top));
    for (let r of this.view.viewportLineBlocks)
      if (i.length && (i = []), Array.isArray(r.type)) {
        let o = !0;
        for (let l of r.type)
          if (l.type == K.Text && o) {
            Pr(e, i, l.from);
            for (let a of s)
              a.line(this.view, l, i);
            o = !1;
          } else if (l.widget)
            for (let a of s)
              a.widget(this.view, l);
      } else if (r.type == K.Text) {
        Pr(e, i, r.from);
        for (let o of s)
          o.line(this.view, r, i);
      }
    for (let r of s)
      r.finish();
    n && this.view.scrollDOM.insertBefore(this.dom, t);
  }
  updateGutters(n) {
    let t = n.startState.facet(Si), e = n.state.facet(Si), i = n.docChanged || n.heightChanged || n.viewportChanged || !I.eq(n.startState.facet(Es), n.state.facet(Es), n.view.viewport.from, n.view.viewport.to);
    if (t == e)
      for (let s of this.gutters)
        s.update(n) && (i = !0);
    else {
      i = !0;
      let s = [];
      for (let r of e) {
        let o = t.indexOf(r);
        o < 0 ? s.push(new Hl(this.view, r)) : (this.gutters[o].update(n), s.push(this.gutters[o]));
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
  provide: (n) => R.scrollMargins.of((t) => {
    let e = t.plugin(n);
    return !e || e.gutters.length == 0 || !e.fixed ? null : t.textDirection == z.LTR ? { left: e.dom.offsetWidth * t.scaleX } : { right: e.dom.offsetWidth * t.scaleX };
  })
});
function Gl(n) {
  return Array.isArray(n) ? n : [n];
}
function Pr(n, t, e) {
  for (; n.value && n.from <= e; )
    n.from == e && t.push(n.value), n.next();
}
class Kp {
  constructor(t, e, i) {
    this.gutter = t, this.height = i, this.i = 0, this.cursor = I.iter(t.markers, e.from);
  }
  addElement(t, e, i) {
    let { gutter: s } = this, r = e.top - this.height;
    if (this.i == s.elements.length) {
      let o = new hc(t, e.height, r, i);
      s.elements.push(o), s.dom.appendChild(o.dom);
    } else
      s.elements[this.i].update(t, e.height, r, i);
    this.height = e.bottom, this.i++;
  }
  line(t, e, i) {
    let s = [];
    Pr(this.cursor, s, e.from), i.length && (s = s.concat(i));
    let r = this.gutter.config.lineMarker(t, e, s);
    r && s.unshift(r);
    let o = this.gutter;
    s.length == 0 && !o.config.renderEmptyElements || this.addElement(t, e, s);
  }
  widget(t, e) {
    let i = this.gutter.config.widgetMarker(t, e.widget, e);
    i && this.addElement(t, e, [i]);
  }
  finish() {
    let t = this.gutter;
    for (; t.elements.length > this.i; ) {
      let e = t.elements.pop();
      t.dom.removeChild(e.dom), e.destroy();
    }
  }
}
class Hl {
  constructor(t, e) {
    this.view = t, this.config = e, this.elements = [], this.spacer = null, this.dom = document.createElement("div"), this.dom.className = "cm-gutter" + (this.config.class ? " " + this.config.class : "");
    for (let i in e.domEventHandlers)
      this.dom.addEventListener(i, (s) => {
        let r = s.target, o;
        if (r != this.dom && this.dom.contains(r)) {
          for (; r.parentNode != this.dom; )
            r = r.parentNode;
          let a = r.getBoundingClientRect();
          o = (a.top + a.bottom) / 2;
        } else
          o = s.clientY;
        let l = t.lineBlockAtHeight(o - t.documentTop);
        e.domEventHandlers[i](t, l, s) && s.preventDefault();
      });
    this.markers = Gl(e.markers(t)), e.initialSpacer && (this.spacer = new hc(t, 0, 0, [e.initialSpacer(t)]), this.dom.appendChild(this.spacer.dom), this.spacer.dom.style.cssText += "visibility: hidden; pointer-events: none");
  }
  update(t) {
    let e = this.markers;
    if (this.markers = Gl(this.config.markers(t.view)), this.spacer && this.config.updateSpacer) {
      let s = this.config.updateSpacer(this.spacer.markers[0], t);
      s != this.spacer.markers[0] && this.spacer.update(t.view, 0, 0, [s]);
    }
    let i = t.view.viewport;
    return !I.eq(this.markers, e, i.from, i.to) || (this.config.lineMarkerChange ? this.config.lineMarkerChange(t) : !1);
  }
  destroy() {
    for (let t of this.elements)
      t.destroy();
  }
}
class hc {
  constructor(t, e, i, s) {
    this.height = -1, this.above = 0, this.markers = [], this.dom = document.createElement("div"), this.dom.className = "cm-gutterElement", this.update(t, e, i, s);
  }
  update(t, e, i, s) {
    this.height != e && (this.height = e, this.dom.style.height = e / t.scaleY + "px"), this.above != i && (this.dom.style.marginTop = (this.above = i) ? i / t.scaleY + "px" : ""), Yp(this.markers, s) || this.setMarkers(t, s);
  }
  setMarkers(t, e) {
    let i = "cm-gutterElement", s = this.dom.firstChild;
    for (let r = 0, o = 0; ; ) {
      let l = o, a = r < e.length ? e[r++] : null, h = !1;
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
      a.toDOM && (h ? s = s.nextSibling : this.dom.insertBefore(a.toDOM(t), s)), h && o++;
    }
    this.dom.className = i, this.markers = e;
  }
  destroy() {
    this.setMarkers(null, []);
  }
}
function Yp(n, t) {
  if (n.length != t.length)
    return !1;
  for (let e = 0; e < n.length; e++)
    if (!n[e].compare(t[e]))
      return !1;
  return !0;
}
const Jp = /* @__PURE__ */ A.define(), ze = /* @__PURE__ */ A.define({
  combine(n) {
    return qt(n, { formatNumber: String, domEventHandlers: {} }, {
      domEventHandlers(t, e) {
        let i = Object.assign({}, t);
        for (let s in e) {
          let r = i[s], o = e[s];
          i[s] = r ? (l, a, h) => r(l, a, h) || o(l, a, h) : o;
        }
        return i;
      }
    });
  }
});
class Ns extends se {
  constructor(t) {
    super(), this.number = t;
  }
  eq(t) {
    return this.number == t.number;
  }
  toDOM() {
    return document.createTextNode(this.number);
  }
}
function Gs(n, t) {
  return n.state.facet(ze).formatNumber(t, n.state);
}
const Qp = /* @__PURE__ */ Si.compute([ze], (n) => ({
  class: "cm-lineNumbers",
  renderEmptyElements: !1,
  markers(t) {
    return t.state.facet(Jp);
  },
  lineMarker(t, e, i) {
    return i.some((s) => s.toDOM) ? null : new Ns(Gs(t, t.state.doc.lineAt(e.from).number));
  },
  widgetMarker: () => null,
  lineMarkerChange: (t) => t.startState.facet(ze) != t.state.facet(ze),
  initialSpacer(t) {
    return new Ns(Gs(t, Fl(t.state.doc.lines)));
  },
  updateSpacer(t, e) {
    let i = Gs(e.view, Fl(e.view.state.doc.lines));
    return i == t.number ? t : new Ns(i);
  },
  domEventHandlers: n.facet(ze).domEventHandlers
}));
function Up(n = {}) {
  return [
    ze.of(n),
    ac(),
    Qp
  ];
}
function Fl(n) {
  let t = 9;
  for (; t < n; )
    t = t * 10 + 9;
  return t;
}
let $p = 0;
class vt {
  /**
  @internal
  */
  constructor(t, e, i) {
    this.set = t, this.base = e, this.modified = i, this.id = $p++;
  }
  /**
  Define a new tag. If `parent` is given, the tag is treated as a
  sub-tag of that parent, and
  [highlighters](#highlight.tagHighlighter) that don't mention
  this tag will try to fall back to the parent tag (or grandparent
  tag, etc).
  */
  static define(t) {
    if (t != null && t.base)
      throw new Error("Can not derive from a modified tag");
    let e = new vt([], null, []);
    if (e.set.push(e), t)
      for (let i of t.set)
        e.set.push(i);
    return e;
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
    let t = new Jn();
    return (e) => e.modified.indexOf(t) > -1 ? e : Jn.get(e.base || e, e.modified.concat(t).sort((i, s) => i.id - s.id));
  }
}
let jp = 0;
class Jn {
  constructor() {
    this.instances = [], this.id = jp++;
  }
  static get(t, e) {
    if (!e.length)
      return t;
    let i = e[0].instances.find((l) => l.base == t && qp(e, l.modified));
    if (i)
      return i;
    let s = [], r = new vt(s, t, e);
    for (let l of e)
      l.instances.push(r);
    let o = _p(e);
    for (let l of t.set)
      if (!l.modified.length)
        for (let a of o)
          s.push(Jn.get(l, a));
    return r;
  }
}
function qp(n, t) {
  return n.length == t.length && n.every((e, i) => e == t[i]);
}
function _p(n) {
  let t = [[]];
  for (let e = 0; e < n.length; e++)
    for (let i = 0, s = t.length; i < s; i++)
      t.push(t[i].concat(n[e]));
  return t.sort((e, i) => i.length - e.length);
}
function cc(n) {
  let t = /* @__PURE__ */ Object.create(null);
  for (let e in n) {
    let i = n[e];
    Array.isArray(i) || (i = [i]);
    for (let s of e.split(" "))
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
        let c = new Qn(i, o, a > 0 ? r.slice(0, a) : null);
        t[h] = c.sort(t[h]);
      }
  }
  return fc.add(t);
}
const fc = new P();
class Qn {
  constructor(t, e, i, s) {
    this.tags = t, this.mode = e, this.context = i, this.next = s;
  }
  get opaque() {
    return this.mode == 0;
  }
  get inherit() {
    return this.mode == 1;
  }
  sort(t) {
    return !t || t.depth < this.depth ? (this.next = t, this) : (t.next = this.sort(t.next), t);
  }
  get depth() {
    return this.context ? this.context.length : 0;
  }
}
Qn.empty = new Qn([], 2, null);
function uc(n, t) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let r of n)
    if (!Array.isArray(r.tag))
      e[r.tag.id] = r.class;
    else
      for (let o of r.tag)
        e[o.id] = r.class;
  let { scope: i, all: s = null } = t || {};
  return {
    style: (r) => {
      let o = s;
      for (let l of r)
        for (let a of l.set) {
          let h = e[a.id];
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
function tm(n, t) {
  let e = null;
  for (let i of n) {
    let s = i.style(t);
    s && (e = e ? e + " " + s : s);
  }
  return e;
}
function em(n, t, e, i = 0, s = n.length) {
  let r = new im(i, Array.isArray(t) ? t : [t], e);
  r.highlightRange(n.cursor(), i, s, "", r.highlighters), r.flush(s);
}
class im {
  constructor(t, e, i) {
    this.at = t, this.highlighters = e, this.span = i, this.class = "";
  }
  startSpan(t, e) {
    e != this.class && (this.flush(t), t > this.at && (this.at = t), this.class = e);
  }
  flush(t) {
    t > this.at && this.class && this.span(this.at, t, this.class);
  }
  highlightRange(t, e, i, s, r) {
    let { type: o, from: l, to: a } = t;
    if (l >= i || a <= e)
      return;
    o.isTop && (r = this.highlighters.filter((d) => !d.scope || d.scope(o)));
    let h = s, c = nm(t) || Qn.empty, f = tm(r, c.tags);
    if (f && (h && (h += " "), h += f, c.mode == 1 && (s += (s ? " " : "") + f)), this.startSpan(Math.max(e, l), h), c.opaque)
      return;
    let u = t.tree && t.tree.prop(P.mounted);
    if (u && u.overlay) {
      let d = t.node.enter(u.overlay[0].from + l, 1), p = this.highlighters.filter((m) => !m.scope || m.scope(u.tree.type)), g = t.firstChild();
      for (let m = 0, b = l; ; m++) {
        let v = m < u.overlay.length ? u.overlay[m] : null, O = v ? v.from + l : a, k = Math.max(e, b), w = Math.min(i, O);
        if (k < w && g)
          for (; t.from < w && (this.highlightRange(t, k, w, s, r), this.startSpan(Math.min(w, t.to), h), !(t.to >= O || !t.nextSibling())); )
            ;
        if (!v || O > i)
          break;
        b = v.to + l, b > e && (this.highlightRange(d.cursor(), Math.max(e, v.from + l), Math.min(i, b), "", p), this.startSpan(Math.min(i, b), h));
      }
      g && t.parent();
    } else if (t.firstChild()) {
      u && (s = "");
      do
        if (!(t.to <= e)) {
          if (t.from >= i)
            break;
          this.highlightRange(t, e, i, s, r), this.startSpan(Math.min(i, t.to), h);
        }
      while (t.nextSibling());
      t.parent();
    }
  }
}
function nm(n) {
  let t = n.type.prop(fc);
  for (; t && t.context && !n.matchContext(t.context); )
    t = t.next;
  return t || null;
}
const C = vt.define, fn = C(), oe = C(), zl = C(oe), Kl = C(oe), le = C(), un = C(le), Hs = C(le), Kt = C(), Oe = C(Kt), Ft = C(), zt = C(), Vr = C(), ci = C(Vr), dn = C(), x = {
  /**
  A comment.
  */
  comment: fn,
  /**
  A line [comment](#highlight.tags.comment).
  */
  lineComment: C(fn),
  /**
  A block [comment](#highlight.tags.comment).
  */
  blockComment: C(fn),
  /**
  A documentation [comment](#highlight.tags.comment).
  */
  docComment: C(fn),
  /**
  Any kind of identifier.
  */
  name: oe,
  /**
  The [name](#highlight.tags.name) of a variable.
  */
  variableName: C(oe),
  /**
  A type [name](#highlight.tags.name).
  */
  typeName: zl,
  /**
  A tag name (subtag of [`typeName`](#highlight.tags.typeName)).
  */
  tagName: C(zl),
  /**
  A property or field [name](#highlight.tags.name).
  */
  propertyName: Kl,
  /**
  An attribute name (subtag of [`propertyName`](#highlight.tags.propertyName)).
  */
  attributeName: C(Kl),
  /**
  The [name](#highlight.tags.name) of a class.
  */
  className: C(oe),
  /**
  A label [name](#highlight.tags.name).
  */
  labelName: C(oe),
  /**
  A namespace [name](#highlight.tags.name).
  */
  namespace: C(oe),
  /**
  The [name](#highlight.tags.name) of a macro.
  */
  macroName: C(oe),
  /**
  A literal value.
  */
  literal: le,
  /**
  A string [literal](#highlight.tags.literal).
  */
  string: un,
  /**
  A documentation [string](#highlight.tags.string).
  */
  docString: C(un),
  /**
  A character literal (subtag of [string](#highlight.tags.string)).
  */
  character: C(un),
  /**
  An attribute value (subtag of [string](#highlight.tags.string)).
  */
  attributeValue: C(un),
  /**
  A number [literal](#highlight.tags.literal).
  */
  number: Hs,
  /**
  An integer [number](#highlight.tags.number) literal.
  */
  integer: C(Hs),
  /**
  A floating-point [number](#highlight.tags.number) literal.
  */
  float: C(Hs),
  /**
  A boolean [literal](#highlight.tags.literal).
  */
  bool: C(le),
  /**
  Regular expression [literal](#highlight.tags.literal).
  */
  regexp: C(le),
  /**
  An escape [literal](#highlight.tags.literal), for example a
  backslash escape in a string.
  */
  escape: C(le),
  /**
  A color [literal](#highlight.tags.literal).
  */
  color: C(le),
  /**
  A URL [literal](#highlight.tags.literal).
  */
  url: C(le),
  /**
  A language keyword.
  */
  keyword: Ft,
  /**
  The [keyword](#highlight.tags.keyword) for the self or this
  object.
  */
  self: C(Ft),
  /**
  The [keyword](#highlight.tags.keyword) for null.
  */
  null: C(Ft),
  /**
  A [keyword](#highlight.tags.keyword) denoting some atomic value.
  */
  atom: C(Ft),
  /**
  A [keyword](#highlight.tags.keyword) that represents a unit.
  */
  unit: C(Ft),
  /**
  A modifier [keyword](#highlight.tags.keyword).
  */
  modifier: C(Ft),
  /**
  A [keyword](#highlight.tags.keyword) that acts as an operator.
  */
  operatorKeyword: C(Ft),
  /**
  A control-flow related [keyword](#highlight.tags.keyword).
  */
  controlKeyword: C(Ft),
  /**
  A [keyword](#highlight.tags.keyword) that defines something.
  */
  definitionKeyword: C(Ft),
  /**
  A [keyword](#highlight.tags.keyword) related to defining or
  interfacing with modules.
  */
  moduleKeyword: C(Ft),
  /**
  An operator.
  */
  operator: zt,
  /**
  An [operator](#highlight.tags.operator) that dereferences something.
  */
  derefOperator: C(zt),
  /**
  Arithmetic-related [operator](#highlight.tags.operator).
  */
  arithmeticOperator: C(zt),
  /**
  Logical [operator](#highlight.tags.operator).
  */
  logicOperator: C(zt),
  /**
  Bit [operator](#highlight.tags.operator).
  */
  bitwiseOperator: C(zt),
  /**
  Comparison [operator](#highlight.tags.operator).
  */
  compareOperator: C(zt),
  /**
  [Operator](#highlight.tags.operator) that updates its operand.
  */
  updateOperator: C(zt),
  /**
  [Operator](#highlight.tags.operator) that defines something.
  */
  definitionOperator: C(zt),
  /**
  Type-related [operator](#highlight.tags.operator).
  */
  typeOperator: C(zt),
  /**
  Control-flow [operator](#highlight.tags.operator).
  */
  controlOperator: C(zt),
  /**
  Program or markup punctuation.
  */
  punctuation: Vr,
  /**
  [Punctuation](#highlight.tags.punctuation) that separates
  things.
  */
  separator: C(Vr),
  /**
  Bracket-style [punctuation](#highlight.tags.punctuation).
  */
  bracket: ci,
  /**
  Angle [brackets](#highlight.tags.bracket) (usually `<` and `>`
  tokens).
  */
  angleBracket: C(ci),
  /**
  Square [brackets](#highlight.tags.bracket) (usually `[` and `]`
  tokens).
  */
  squareBracket: C(ci),
  /**
  Parentheses (usually `(` and `)` tokens). Subtag of
  [bracket](#highlight.tags.bracket).
  */
  paren: C(ci),
  /**
  Braces (usually `{` and `}` tokens). Subtag of
  [bracket](#highlight.tags.bracket).
  */
  brace: C(ci),
  /**
  Content, for example plain text in XML or markup documents.
  */
  content: Kt,
  /**
  [Content](#highlight.tags.content) that represents a heading.
  */
  heading: Oe,
  /**
  A level 1 [heading](#highlight.tags.heading).
  */
  heading1: C(Oe),
  /**
  A level 2 [heading](#highlight.tags.heading).
  */
  heading2: C(Oe),
  /**
  A level 3 [heading](#highlight.tags.heading).
  */
  heading3: C(Oe),
  /**
  A level 4 [heading](#highlight.tags.heading).
  */
  heading4: C(Oe),
  /**
  A level 5 [heading](#highlight.tags.heading).
  */
  heading5: C(Oe),
  /**
  A level 6 [heading](#highlight.tags.heading).
  */
  heading6: C(Oe),
  /**
  A prose separator (such as a horizontal rule).
  */
  contentSeparator: C(Kt),
  /**
  [Content](#highlight.tags.content) that represents a list.
  */
  list: C(Kt),
  /**
  [Content](#highlight.tags.content) that represents a quote.
  */
  quote: C(Kt),
  /**
  [Content](#highlight.tags.content) that is emphasized.
  */
  emphasis: C(Kt),
  /**
  [Content](#highlight.tags.content) that is styled strong.
  */
  strong: C(Kt),
  /**
  [Content](#highlight.tags.content) that is part of a link.
  */
  link: C(Kt),
  /**
  [Content](#highlight.tags.content) that is styled as code or
  monospace.
  */
  monospace: C(Kt),
  /**
  [Content](#highlight.tags.content) that has a strike-through
  style.
  */
  strikethrough: C(Kt),
  /**
  Inserted text in a change-tracking format.
  */
  inserted: C(),
  /**
  Deleted text.
  */
  deleted: C(),
  /**
  Changed text.
  */
  changed: C(),
  /**
  An invalid or unsyntactic element.
  */
  invalid: C(),
  /**
  Metadata or meta-instruction.
  */
  meta: dn,
  /**
  [Metadata](#highlight.tags.meta) that applies to the entire
  document.
  */
  documentMeta: C(dn),
  /**
  [Metadata](#highlight.tags.meta) that annotates or adds
  attributes to a given syntactic element.
  */
  annotation: C(dn),
  /**
  Processing instruction or preprocessor directive. Subtag of
  [meta](#highlight.tags.meta).
  */
  processingInstruction: C(dn),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates that a
  given element is being defined. Expected to be used with the
  various [name](#highlight.tags.name) tags.
  */
  definition: vt.defineModifier(),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates that
  something is constant. Mostly expected to be used with
  [variable names](#highlight.tags.variableName).
  */
  constant: vt.defineModifier(),
  /**
  [Modifier](#highlight.Tag^defineModifier) used to indicate that
  a [variable](#highlight.tags.variableName) or [property
  name](#highlight.tags.propertyName) is being called or defined
  as a function.
  */
  function: vt.defineModifier(),
  /**
  [Modifier](#highlight.Tag^defineModifier) that can be applied to
  [names](#highlight.tags.name) to indicate that they belong to
  the language's standard environment.
  */
  standard: vt.defineModifier(),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates a given
  [names](#highlight.tags.name) is local to some scope.
  */
  local: vt.defineModifier(),
  /**
  A generic variant [modifier](#highlight.Tag^defineModifier) that
  can be used to tag language-specific alternative variants of
  some common tag. It is recommended for themes to define special
  forms of at least the [string](#highlight.tags.string) and
  [variable name](#highlight.tags.variableName) tags, since those
  come up a lot.
  */
  special: vt.defineModifier()
};
uc([
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
var Fs;
const Ke = /* @__PURE__ */ new P();
function sm(n) {
  return A.define({
    combine: n ? (t) => t.concat(n) : void 0
  });
}
const rm = /* @__PURE__ */ new P();
class Et {
  /**
  Construct a language object. If you need to invoke this
  directly, first define a data facet with
  [`defineLanguageFacet`](https://codemirror.net/6/docs/ref/#language.defineLanguageFacet), and then
  configure your parser to [attach](https://codemirror.net/6/docs/ref/#language.languageDataProp) it
  to the language's outer syntax node.
  */
  constructor(t, e, i = [], s = "") {
    this.data = t, this.name = s, X.prototype.hasOwnProperty("tree") || Object.defineProperty(X.prototype, "tree", { get() {
      return pt(this);
    } }), this.parser = e, this.extension = [
      ke.of(this),
      X.languageData.of((r, o, l) => {
        let a = Yl(r, o, l), h = a.type.prop(Ke);
        if (!h)
          return [];
        let c = r.facet(h), f = a.type.prop(rm);
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
  isActiveAt(t, e, i = -1) {
    return Yl(t, e, i).type.prop(Ke) == this.data;
  }
  /**
  Find the document regions that were parsed using this language.
  The returned regions will _include_ any nested languages rooted
  in this language, when those exist.
  */
  findRegions(t) {
    let e = t.facet(ke);
    if ((e == null ? void 0 : e.data) == this.data)
      return [{ from: 0, to: t.doc.length }];
    if (!e || !e.allowsNesting)
      return [];
    let i = [], s = (r, o) => {
      if (r.prop(Ke) == this.data) {
        i.push({ from: o, to: o + r.length });
        return;
      }
      let l = r.prop(P.mounted);
      if (l) {
        if (l.tree.prop(Ke) == this.data) {
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
        h instanceof U && s(h, r.positions[a] + o);
      }
    };
    return s(pt(t), 0), i;
  }
  /**
  Indicates whether this language allows nested languages. The
  default implementation returns true.
  */
  get allowsNesting() {
    return !0;
  }
}
Et.setState = /* @__PURE__ */ L.define();
function Yl(n, t, e) {
  let i = n.facet(ke), s = pt(n).topNode;
  if (!i || i.allowsNesting)
    for (let r = s; r; r = r.enter(t, e, st.ExcludeBuffers))
      r.type.isTop && (s = r);
  return s;
}
class ei extends Et {
  constructor(t, e, i) {
    super(t, e, [], i), this.parser = e;
  }
  /**
  Define a language from a parser.
  */
  static define(t) {
    let e = sm(t.languageData);
    return new ei(e, t.parser.configure({
      props: [Ke.add((i) => i.isTop ? e : void 0)]
    }), t.name);
  }
  /**
  Create a new instance of this language with a reconfigured
  version of its parser and optionally a new name.
  */
  configure(t, e) {
    return new ei(this.data, this.parser.configure(t), e || this.name);
  }
  get allowsNesting() {
    return this.parser.hasWrappers();
  }
}
function pt(n) {
  let t = n.field(Et.state, !1);
  return t ? t.tree : U.empty;
}
class om {
  /**
  Create an input object for the given document.
  */
  constructor(t) {
    this.doc = t, this.cursorPos = 0, this.string = "", this.cursor = t.iter();
  }
  get length() {
    return this.doc.length;
  }
  syncTo(t) {
    return this.string = this.cursor.next(t - this.cursorPos).value, this.cursorPos = t + this.string.length, this.cursorPos - this.string.length;
  }
  chunk(t) {
    return this.syncTo(t), this.string;
  }
  get lineChunks() {
    return !0;
  }
  read(t, e) {
    let i = this.cursorPos - this.string.length;
    return t < i || e >= this.cursorPos ? this.doc.sliceString(t, e) : this.string.slice(t - i, e - i);
  }
}
let fi = null;
class Un {
  constructor(t, e, i = [], s, r, o, l, a) {
    this.parser = t, this.state = e, this.fragments = i, this.tree = s, this.treeLen = r, this.viewport = o, this.skipped = l, this.scheduleOn = a, this.parse = null, this.tempSkipped = [];
  }
  /**
  @internal
  */
  static create(t, e, i) {
    return new Un(t, e, [], U.empty, 0, i, [], null);
  }
  startParse() {
    return this.parser.startParse(new om(this.state.doc), this.fragments);
  }
  /**
  @internal
  */
  work(t, e) {
    return e != null && e >= this.state.doc.length && (e = void 0), this.tree != U.empty && this.isDone(e ?? this.state.doc.length) ? (this.takeTree(), !0) : this.withContext(() => {
      var i;
      if (typeof t == "number") {
        let s = Date.now() + t;
        t = () => Date.now() > s;
      }
      for (this.parse || (this.parse = this.startParse()), e != null && (this.parse.stoppedAt == null || this.parse.stoppedAt > e) && e < this.state.doc.length && this.parse.stopAt(e); ; ) {
        let s = this.parse.advance();
        if (s)
          if (this.fragments = this.withoutTempSkipped(Te.addTree(s, this.fragments, this.parse.stoppedAt != null)), this.treeLen = (i = this.parse.stoppedAt) !== null && i !== void 0 ? i : this.state.doc.length, this.tree = s, this.parse = null, this.treeLen < (e ?? this.state.doc.length))
            this.parse = this.startParse();
          else
            return !0;
        if (t())
          return !1;
      }
    });
  }
  /**
  @internal
  */
  takeTree() {
    let t, e;
    this.parse && (t = this.parse.parsedPos) >= this.treeLen && ((this.parse.stoppedAt == null || this.parse.stoppedAt > t) && this.parse.stopAt(t), this.withContext(() => {
      for (; !(e = this.parse.advance()); )
        ;
    }), this.treeLen = t, this.tree = e, this.fragments = this.withoutTempSkipped(Te.addTree(this.tree, this.fragments, !0)), this.parse = null);
  }
  withContext(t) {
    let e = fi;
    fi = this;
    try {
      return t();
    } finally {
      fi = e;
    }
  }
  withoutTempSkipped(t) {
    for (let e; e = this.tempSkipped.pop(); )
      t = Jl(t, e.from, e.to);
    return t;
  }
  /**
  @internal
  */
  changes(t, e) {
    let { fragments: i, tree: s, treeLen: r, viewport: o, skipped: l } = this;
    if (this.takeTree(), !t.empty) {
      let a = [];
      if (t.iterChangedRanges((h, c, f, u) => a.push({ fromA: h, toA: c, fromB: f, toB: u })), i = Te.applyChanges(i, a), s = U.empty, r = 0, o = { from: t.mapPos(o.from, -1), to: t.mapPos(o.to, 1) }, this.skipped.length) {
        l = [];
        for (let h of this.skipped) {
          let c = t.mapPos(h.from, 1), f = t.mapPos(h.to, -1);
          c < f && l.push({ from: c, to: f });
        }
      }
    }
    return new Un(this.parser, e, i, s, r, o, l, this.scheduleOn);
  }
  /**
  @internal
  */
  updateViewport(t) {
    if (this.viewport.from == t.from && this.viewport.to == t.to)
      return !1;
    this.viewport = t;
    let e = this.skipped.length;
    for (let i = 0; i < this.skipped.length; i++) {
      let { from: s, to: r } = this.skipped[i];
      s < t.to && r > t.from && (this.fragments = Jl(this.fragments, s, r), this.skipped.splice(i--, 1));
    }
    return this.skipped.length >= e ? !1 : (this.reset(), !0);
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
  skipUntilInView(t, e) {
    this.skipped.push({ from: t, to: e });
  }
  /**
  Returns a parser intended to be used as placeholder when
  asynchronously loading a nested parser. It'll skip its input and
  mark it as not-really-parsed, so that the next update will parse
  it again.
  
  When `until` is given, a reparse will be scheduled when that
  promise resolves.
  */
  static getSkippingParser(t) {
    return new class extends Xa {
      createParse(e, i, s) {
        let r = s[0].from, o = s[s.length - 1].to;
        return {
          parsedPos: r,
          advance() {
            let a = fi;
            if (a) {
              for (let h of s)
                a.tempSkipped.push(h);
              t && (a.scheduleOn = a.scheduleOn ? Promise.all([a.scheduleOn, t]) : t);
            }
            return this.parsedPos = o, new U(Mt.none, [], [], o - r);
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
  isDone(t) {
    t = Math.min(t, this.state.doc.length);
    let e = this.fragments;
    return this.treeLen >= t && e.length && e[0].from == 0 && e[0].to >= t;
  }
  /**
  Get the context for the current parse, or `null` if no editor
  parse is in progress.
  */
  static get() {
    return fi;
  }
}
function Jl(n, t, e) {
  return Te.applyChanges(n, [{ fromA: t, toA: e, fromB: t, toB: e }]);
}
class ii {
  constructor(t) {
    this.context = t, this.tree = t.tree;
  }
  apply(t) {
    if (!t.docChanged && this.tree == this.context.tree)
      return this;
    let e = this.context.changes(t.changes, t.state), i = this.context.treeLen == t.startState.doc.length ? void 0 : Math.max(t.changes.mapPos(this.context.treeLen), e.viewport.to);
    return e.work(20, i) || e.takeTree(), new ii(e);
  }
  static init(t) {
    let e = Math.min(3e3, t.doc.length), i = Un.create(t.facet(ke).parser, t, { from: 0, to: e });
    return i.work(20, e) || i.takeTree(), new ii(i);
  }
}
Et.state = /* @__PURE__ */ q.define({
  create: ii.init,
  update(n, t) {
    for (let e of t.effects)
      if (e.is(Et.setState))
        return e.value;
    return t.startState.facet(ke) != t.state.facet(ke) ? ii.init(t.state) : n.apply(t);
  }
});
let dc = (n) => {
  let t = setTimeout(
    () => n(),
    500
    /* MaxPause */
  );
  return () => clearTimeout(t);
};
typeof requestIdleCallback < "u" && (dc = (n) => {
  let t = -1, e = setTimeout(
    () => {
      t = requestIdleCallback(n, {
        timeout: 500 - 100
        /* MinPause */
      });
    },
    100
    /* MinPause */
  );
  return () => t < 0 ? clearTimeout(e) : cancelIdleCallback(t);
});
const zs = typeof navigator < "u" && (!((Fs = navigator.scheduling) === null || Fs === void 0) && Fs.isInputPending) ? () => navigator.scheduling.isInputPending() : null, lm = /* @__PURE__ */ nt.fromClass(class {
  constructor(t) {
    this.view = t, this.working = null, this.workScheduled = 0, this.chunkEnd = -1, this.chunkBudget = -1, this.work = this.work.bind(this), this.scheduleWork();
  }
  update(t) {
    let e = this.view.state.field(Et.state).context;
    (e.updateViewport(t.view.viewport) || this.view.viewport.to > e.treeLen) && this.scheduleWork(), t.docChanged && (this.view.hasFocus && (this.chunkBudget += 50), this.scheduleWork()), this.checkAsyncSchedule(e);
  }
  scheduleWork() {
    if (this.working)
      return;
    let { state: t } = this.view, e = t.field(Et.state);
    (e.tree != e.context.tree || !e.context.isDone(t.doc.length)) && (this.working = dc(this.work));
  }
  work(t) {
    this.working = null;
    let e = Date.now();
    if (this.chunkEnd < e && (this.chunkEnd < 0 || this.view.hasFocus) && (this.chunkEnd = e + 3e4, this.chunkBudget = 3e3), this.chunkBudget <= 0)
      return;
    let { state: i, viewport: { to: s } } = this.view, r = i.field(Et.state);
    if (r.tree == r.context.tree && r.context.isDone(
      s + 1e5
      /* MaxParseAhead */
    ))
      return;
    let o = Date.now() + Math.min(this.chunkBudget, 100, t && !zs ? Math.max(25, t.timeRemaining() - 5) : 1e9), l = r.context.treeLen < s && i.doc.length > s + 1e3, a = r.context.work(() => zs && zs() || Date.now() > o, s + (l ? 0 : 1e5));
    this.chunkBudget -= Date.now() - e, (a || this.chunkBudget <= 0) && (r.context.takeTree(), this.view.dispatch({ effects: Et.setState.of(new ii(r.context)) })), this.chunkBudget > 0 && !(a && !l) && this.scheduleWork(), this.checkAsyncSchedule(r.context);
  }
  checkAsyncSchedule(t) {
    t.scheduleOn && (this.workScheduled++, t.scheduleOn.then(() => this.scheduleWork()).catch((e) => Vt(this.view.state, e)).then(() => this.workScheduled--), t.scheduleOn = null);
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
}), ke = /* @__PURE__ */ A.define({
  combine(n) {
    return n.length ? n[0] : null;
  },
  enables: (n) => [
    Et.state,
    lm,
    R.contentAttributes.compute([n], (t) => {
      let e = t.facet(n);
      return e && e.name ? { "data-language": e.name } : {};
    })
  ]
});
class ho {
  /**
  Create a language support object.
  */
  constructor(t, e = []) {
    this.language = t, this.support = e, this.extension = [t, e];
  }
}
const am = /* @__PURE__ */ A.define(), co = /* @__PURE__ */ A.define({
  combine: (n) => {
    if (!n.length)
      return "  ";
    let t = n[0];
    if (!t || /\S/.test(t) || Array.from(t).some((e) => e != t[0]))
      throw new Error("Invalid indent unit: " + JSON.stringify(n[0]));
    return t;
  }
});
function $n(n) {
  let t = n.facet(co);
  return t.charCodeAt(0) == 9 ? n.tabSize * t.length : t.length;
}
function Vi(n, t) {
  let e = "", i = n.tabSize, s = n.facet(co)[0];
  if (s == "	") {
    for (; t >= i; )
      e += "	", t -= i;
    s = " ";
  }
  for (let r = 0; r < t; r++)
    e += s;
  return e;
}
function fo(n, t) {
  n instanceof X && (n = new ms(n));
  for (let i of n.state.facet(am)) {
    let s = i(n, t);
    if (s !== void 0)
      return s;
  }
  let e = pt(n.state);
  return e.length >= t ? hm(n, e, t) : null;
}
class ms {
  /**
  Create an indent context.
  */
  constructor(t, e = {}) {
    this.state = t, this.options = e, this.unit = $n(t);
  }
  /**
  Get a description of the line at the given position, taking
  [simulated line
  breaks](https://codemirror.net/6/docs/ref/#language.IndentContext.constructor^options.simulateBreak)
  into account. If there is such a break at `pos`, the `bias`
  argument determines whether the part of the line line before or
  after the break is used.
  */
  lineAt(t, e = 1) {
    let i = this.state.doc.lineAt(t), { simulateBreak: s, simulateDoubleBreak: r } = this.options;
    return s != null && s >= i.from && s <= i.to ? r && s == t ? { text: "", from: t } : (e < 0 ? s < t : s <= t) ? { text: i.text.slice(s - i.from), from: s } : { text: i.text.slice(0, s - i.from), from: i.from } : i;
  }
  /**
  Get the text directly after `pos`, either the entire line
  or the next 100 characters, whichever is shorter.
  */
  textAfterPos(t, e = 1) {
    if (this.options.simulateDoubleBreak && t == this.options.simulateBreak)
      return "";
    let { text: i, from: s } = this.lineAt(t, e);
    return i.slice(t - s, Math.min(i.length, t + 100 - s));
  }
  /**
  Find the column for the given position.
  */
  column(t, e = 1) {
    let { text: i, from: s } = this.lineAt(t, e), r = this.countColumn(i, t - s), o = this.options.overrideIndentation ? this.options.overrideIndentation(s) : -1;
    return o > -1 && (r += o - this.countColumn(i, i.search(/\S|$/))), r;
  }
  /**
  Find the column position (taking tabs into account) of the given
  position in the given string.
  */
  countColumn(t, e = t.length) {
    return Ni(t, this.state.tabSize, e);
  }
  /**
  Find the indentation column of the line at the given point.
  */
  lineIndent(t, e = 1) {
    let { text: i, from: s } = this.lineAt(t, e), r = this.options.overrideIndentation;
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
const pc = /* @__PURE__ */ new P();
function hm(n, t, e) {
  return mc(t.resolveInner(e).enterUnfinishedNodesBefore(e), e, n);
}
function cm(n) {
  return n.pos == n.options.simulateBreak && n.options.simulateDoubleBreak;
}
function fm(n) {
  let t = n.type.prop(pc);
  if (t)
    return t;
  let e = n.firstChild, i;
  if (e && (i = e.type.prop(P.closedBy))) {
    let s = n.lastChild, r = s && i.indexOf(s.name) > -1;
    return (o) => mm(o, !0, 1, void 0, r && !cm(o) ? s.from : void 0);
  }
  return n.parent == null ? um : null;
}
function mc(n, t, e) {
  for (; n; n = n.parent) {
    let i = fm(n);
    if (i)
      return i(uo.create(e, t, n));
  }
  return null;
}
function um() {
  return 0;
}
class uo extends ms {
  constructor(t, e, i) {
    super(t.state, t.options), this.base = t, this.pos = e, this.node = i;
  }
  /**
  @internal
  */
  static create(t, e, i) {
    return new uo(t, e, i);
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
  baseIndentFor(t) {
    let e = this.state.doc.lineAt(t.from);
    for (; ; ) {
      let i = t.resolve(e.from);
      for (; i.parent && i.parent.from == i.from; )
        i = i.parent;
      if (dm(i, t))
        break;
      e = this.state.doc.lineAt(i.from);
    }
    return this.lineIndent(e.from);
  }
  /**
  Continue looking for indentations in the node's parent nodes,
  and return the result of that.
  */
  continue() {
    let t = this.node.parent;
    return t ? mc(t, this.pos, this.base) : 0;
  }
}
function dm(n, t) {
  for (let e = t; e; e = e.parent)
    if (n == e)
      return !0;
  return !1;
}
function pm(n) {
  let t = n.node, e = t.childAfter(t.from), i = t.lastChild;
  if (!e)
    return null;
  let s = n.options.simulateBreak, r = n.state.doc.lineAt(e.from), o = s == null || s <= r.from ? r.to : Math.min(r.to, s);
  for (let l = e.to; ; ) {
    let a = t.childAfter(l);
    if (!a || a == i)
      return null;
    if (!a.type.isSkipped)
      return a.from < o ? e : null;
    l = a.to;
  }
}
function mm(n, t, e, i, s) {
  let r = n.textAfter, o = r.match(/^\s*/)[0].length, l = i && r.slice(o, o + i.length) == i || s == n.pos + o, a = t ? pm(n) : null;
  return a ? l ? n.column(a.from) : n.column(a.to) : n.baseIndent + (l ? 0 : n.unit * e);
}
const gm = 200;
function bm() {
  return X.transactionFilter.of((n) => {
    if (!n.docChanged || !n.isUserEvent("input.type") && !n.isUserEvent("input.complete"))
      return n;
    let t = n.startState.languageDataAt("indentOnInput", n.startState.selection.main.head);
    if (!t.length)
      return n;
    let e = n.newDoc, { head: i } = n.newSelection.main, s = e.lineAt(i);
    if (i > s.from + gm)
      return n;
    let r = e.sliceString(s.from, i);
    if (!t.some((h) => h.test(r)))
      return n;
    let { state: o } = n, l = -1, a = [];
    for (let { head: h } of o.selection.ranges) {
      let c = o.doc.lineAt(h);
      if (c.from == l)
        continue;
      l = c.from;
      let f = fo(o, c.from);
      if (f == null)
        continue;
      let u = /^\s*/.exec(c.text)[0], d = Vi(o, f);
      u != d && a.push({ from: c.from, to: c.from + u.length, insert: d });
    }
    return a.length ? [n, { changes: a, sequential: !0 }] : n;
  });
}
const ym = /* @__PURE__ */ A.define(), gc = /* @__PURE__ */ new P();
function xm(n) {
  let t = n.firstChild, e = n.lastChild;
  return t && t.to < e.from ? { from: t.to, to: e.type.isError ? n.to : e.from } : null;
}
function km(n, t, e) {
  let i = pt(n);
  if (i.length < e)
    return null;
  let s = i.resolveInner(e, 1), r = null;
  for (let o = s; o; o = o.parent) {
    if (o.to <= e || o.from > e)
      continue;
    if (r && o.from < t)
      break;
    let l = o.type.prop(gc);
    if (l && (o.to < i.length - 50 || i.length == n.doc.length || !wm(o))) {
      let a = l(o, n);
      a && a.from <= e && a.from >= t && a.to > e && (r = a);
    }
  }
  return r;
}
function wm(n) {
  let t = n.lastChild;
  return t && t.to == n.to && t.type.isError;
}
function jn(n, t, e) {
  for (let i of n.facet(ym)) {
    let s = i(n, t, e);
    if (s)
      return s;
  }
  return km(n, t, e);
}
function bc(n, t) {
  let e = t.mapPos(n.from, 1), i = t.mapPos(n.to, -1);
  return e >= i ? void 0 : { from: e, to: i };
}
const gs = /* @__PURE__ */ L.define({ map: bc }), zi = /* @__PURE__ */ L.define({ map: bc });
function yc(n) {
  let t = [];
  for (let { head: e } of n.state.selection.ranges)
    t.some((i) => i.from <= e && i.to >= e) || t.push(n.lineBlockAt(e));
  return t;
}
const Be = /* @__PURE__ */ q.define({
  create() {
    return T.none;
  },
  update(n, t) {
    n = n.map(t.changes);
    for (let e of t.effects)
      if (e.is(gs) && !Sm(n, e.value.from, e.value.to)) {
        let { preparePlaceholder: i } = t.state.facet(po), s = i ? T.replace({ widget: new Zm(i(t.state, e.value)) }) : Ql;
        n = n.update({ add: [s.range(e.value.from, e.value.to)] });
      } else
        e.is(zi) && (n = n.update({
          filter: (i, s) => e.value.from != i || e.value.to != s,
          filterFrom: e.value.from,
          filterTo: e.value.to
        }));
    if (t.selection) {
      let e = !1, { head: i } = t.selection.main;
      n.between(i, i, (s, r) => {
        s < i && r > i && (e = !0);
      }), e && (n = n.update({
        filterFrom: i,
        filterTo: i,
        filter: (s, r) => r <= i || s >= i
      }));
    }
    return n;
  },
  provide: (n) => R.decorations.from(n),
  toJSON(n, t) {
    let e = [];
    return n.between(0, t.doc.length, (i, s) => {
      e.push(i, s);
    }), e;
  },
  fromJSON(n) {
    if (!Array.isArray(n) || n.length % 2)
      throw new RangeError("Invalid JSON for fold state");
    let t = [];
    for (let e = 0; e < n.length; ) {
      let i = n[e++], s = n[e++];
      if (typeof i != "number" || typeof s != "number")
        throw new RangeError("Invalid JSON for fold state");
      t.push(Ql.range(i, s));
    }
    return T.set(t, !0);
  }
});
function qn(n, t, e) {
  var i;
  let s = null;
  return (i = n.field(Be, !1)) === null || i === void 0 || i.between(t, e, (r, o) => {
    (!s || s.from > r) && (s = { from: r, to: o });
  }), s;
}
function Sm(n, t, e) {
  let i = !1;
  return n.between(t, t, (s, r) => {
    s == t && r == e && (i = !0);
  }), i;
}
function xc(n, t) {
  return n.field(Be, !1) ? t : t.concat(L.appendConfig.of(wc()));
}
const vm = (n) => {
  for (let t of yc(n)) {
    let e = jn(n.state, t.from, t.to);
    if (e)
      return n.dispatch({ effects: xc(n.state, [gs.of(e), kc(n, e)]) }), !0;
  }
  return !1;
}, Cm = (n) => {
  if (!n.state.field(Be, !1))
    return !1;
  let t = [];
  for (let e of yc(n)) {
    let i = qn(n.state, e.from, e.to);
    i && t.push(zi.of(i), kc(n, i, !1));
  }
  return t.length && n.dispatch({ effects: t }), t.length > 0;
};
function kc(n, t, e = !0) {
  let i = n.state.doc.lineAt(t.from).number, s = n.state.doc.lineAt(t.to).number;
  return R.announce.of(`${n.state.phrase(e ? "Folded lines" : "Unfolded lines")} ${i} ${n.state.phrase("to")} ${s}.`);
}
const Om = (n) => {
  let { state: t } = n, e = [];
  for (let i = 0; i < t.doc.length; ) {
    let s = n.lineBlockAt(i), r = jn(t, s.from, s.to);
    r && e.push(gs.of(r)), i = (r ? n.lineBlockAt(r.to) : s).to + 1;
  }
  return e.length && n.dispatch({ effects: xc(n.state, e) }), !!e.length;
}, Am = (n) => {
  let t = n.state.field(Be, !1);
  if (!t || !t.size)
    return !1;
  let e = [];
  return t.between(0, n.state.doc.length, (i, s) => {
    e.push(zi.of({ from: i, to: s }));
  }), n.dispatch({ effects: e }), !0;
}, Mm = [
  { key: "Ctrl-Shift-[", mac: "Cmd-Alt-[", run: vm },
  { key: "Ctrl-Shift-]", mac: "Cmd-Alt-]", run: Cm },
  { key: "Ctrl-Alt-[", run: Om },
  { key: "Ctrl-Alt-]", run: Am }
], Rm = {
  placeholderDOM: null,
  preparePlaceholder: null,
  placeholderText: "…"
}, po = /* @__PURE__ */ A.define({
  combine(n) {
    return qt(n, Rm);
  }
});
function wc(n) {
  let t = [Be, Dm];
  return n && t.push(po.of(n)), t;
}
function Sc(n, t) {
  let { state: e } = n, i = e.facet(po), s = (o) => {
    let l = n.lineBlockAt(n.posAtDOM(o.target)), a = qn(n.state, l.from, l.to);
    a && n.dispatch({ effects: zi.of(a) }), o.preventDefault();
  };
  if (i.placeholderDOM)
    return i.placeholderDOM(n, s, t);
  let r = document.createElement("span");
  return r.textContent = i.placeholderText, r.setAttribute("aria-label", e.phrase("folded code")), r.title = e.phrase("unfold"), r.className = "cm-foldPlaceholder", r.onclick = s, r;
}
const Ql = /* @__PURE__ */ T.replace({ widget: /* @__PURE__ */ new class extends Se {
  toDOM(n) {
    return Sc(n, null);
  }
}() });
class Zm extends Se {
  constructor(t) {
    super(), this.value = t;
  }
  eq(t) {
    return this.value == t.value;
  }
  toDOM(t) {
    return Sc(t, this.value);
  }
}
const Lm = {
  openText: "⌄",
  closedText: "›",
  markerDOM: null,
  domEventHandlers: {},
  foldingChanged: () => !1
};
class Ks extends se {
  constructor(t, e) {
    super(), this.config = t, this.open = e;
  }
  eq(t) {
    return this.config == t.config && this.open == t.open;
  }
  toDOM(t) {
    if (this.config.markerDOM)
      return this.config.markerDOM(this.open);
    let e = document.createElement("span");
    return e.textContent = this.open ? this.config.openText : this.config.closedText, e.title = t.state.phrase(this.open ? "Fold line" : "Unfold line"), e;
  }
}
function Tm(n = {}) {
  let t = Object.assign(Object.assign({}, Lm), n), e = new Ks(t, !0), i = new Ks(t, !1), s = nt.fromClass(class {
    constructor(o) {
      this.from = o.viewport.from, this.markers = this.buildMarkers(o);
    }
    update(o) {
      (o.docChanged || o.viewportChanged || o.startState.facet(ke) != o.state.facet(ke) || o.startState.field(Be, !1) != o.state.field(Be, !1) || pt(o.startState) != pt(o.state) || t.foldingChanged(o)) && (this.markers = this.buildMarkers(o.view));
    }
    buildMarkers(o) {
      let l = new me();
      for (let a of o.viewportLineBlocks) {
        let h = qn(o.state, a.from, a.to) ? i : jn(o.state, a.from, a.to) ? e : null;
        h && l.add(a.from, a.from, h);
      }
      return l.finish();
    }
  }), { domEventHandlers: r } = t;
  return [
    s,
    lc({
      class: "cm-foldGutter",
      markers(o) {
        var l;
        return ((l = o.plugin(s)) === null || l === void 0 ? void 0 : l.markers) || I.empty;
      },
      initialSpacer() {
        return new Ks(t, !1);
      },
      domEventHandlers: Object.assign(Object.assign({}, r), { click: (o, l, a) => {
        if (r.click && r.click(o, l, a))
          return !0;
        let h = qn(o.state, l.from, l.to);
        if (h)
          return o.dispatch({ effects: zi.of(h) }), !0;
        let c = jn(o.state, l.from, l.to);
        return c ? (o.dispatch({ effects: gs.of(c) }), !0) : !1;
      } })
    }),
    wc()
  ];
}
const Dm = /* @__PURE__ */ R.baseTheme({
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
class Ki {
  constructor(t, e) {
    this.specs = t;
    let i;
    function s(l) {
      let a = ge.newName();
      return (i || (i = /* @__PURE__ */ Object.create(null)))["." + a] = l, a;
    }
    const r = typeof e.all == "string" ? e.all : e.all ? s(e.all) : void 0, o = e.scope;
    this.scope = o instanceof Et ? (l) => l.prop(Ke) == o.data : o ? (l) => l == o : void 0, this.style = uc(t.map((l) => ({
      tag: l.tag,
      class: l.class || s(Object.assign({}, l, { tag: null }))
    })), {
      all: r
    }).style, this.module = i ? new ge(i) : null, this.themeType = e.themeType;
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
  static define(t, e) {
    return new Ki(t, e || {});
  }
}
const Br = /* @__PURE__ */ A.define(), vc = /* @__PURE__ */ A.define({
  combine(n) {
    return n.length ? [n[0]] : null;
  }
});
function Ys(n) {
  let t = n.facet(Br);
  return t.length ? t : n.facet(vc);
}
function Cc(n, t) {
  let e = [Vm], i;
  return n instanceof Ki && (n.module && e.push(R.styleModule.of(n.module)), i = n.themeType), t != null && t.fallback ? e.push(vc.of(n)) : i ? e.push(Br.computeN([R.darkTheme], (s) => s.facet(R.darkTheme) == (i == "dark") ? [n] : [])) : e.push(Br.of(n)), e;
}
class Pm {
  constructor(t) {
    this.markCache = /* @__PURE__ */ Object.create(null), this.tree = pt(t.state), this.decorations = this.buildDeco(t, Ys(t.state));
  }
  update(t) {
    let e = pt(t.state), i = Ys(t.state), s = i != Ys(t.startState);
    e.length < t.view.viewport.to && !s && e.type == this.tree.type ? this.decorations = this.decorations.map(t.changes) : (e != this.tree || t.viewportChanged || s) && (this.tree = e, this.decorations = this.buildDeco(t.view, i));
  }
  buildDeco(t, e) {
    if (!e || !this.tree.length)
      return T.none;
    let i = new me();
    for (let { from: s, to: r } of t.visibleRanges)
      em(this.tree, e, (o, l, a) => {
        i.add(o, l, this.markCache[a] || (this.markCache[a] = T.mark({ class: a })));
      }, s, r);
    return i.finish();
  }
}
const Vm = /* @__PURE__ */ ri.high(/* @__PURE__ */ nt.fromClass(Pm, {
  decorations: (n) => n.decorations
})), Bm = /* @__PURE__ */ Ki.define([
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
]), Wm = /* @__PURE__ */ R.baseTheme({
  "&.cm-focused .cm-matchingBracket": { backgroundColor: "#328c8252" },
  "&.cm-focused .cm-nonmatchingBracket": { backgroundColor: "#bb555544" }
}), Oc = 1e4, Ac = "()[]{}", Mc = /* @__PURE__ */ A.define({
  combine(n) {
    return qt(n, {
      afterCursor: !0,
      brackets: Ac,
      maxScanDistance: Oc,
      renderMatch: Em
    });
  }
}), Xm = /* @__PURE__ */ T.mark({ class: "cm-matchingBracket" }), Im = /* @__PURE__ */ T.mark({ class: "cm-nonmatchingBracket" });
function Em(n) {
  let t = [], e = n.matched ? Xm : Im;
  return t.push(e.range(n.start.from, n.start.to)), n.end && t.push(e.range(n.end.from, n.end.to)), t;
}
const Nm = /* @__PURE__ */ q.define({
  create() {
    return T.none;
  },
  update(n, t) {
    if (!t.docChanged && !t.selection)
      return n;
    let e = [], i = t.state.facet(Mc);
    for (let s of t.state.selection.ranges) {
      if (!s.empty)
        continue;
      let r = Qt(t.state, s.head, -1, i) || s.head > 0 && Qt(t.state, s.head - 1, 1, i) || i.afterCursor && (Qt(t.state, s.head, 1, i) || s.head < t.state.doc.length && Qt(t.state, s.head + 1, -1, i));
      r && (e = e.concat(i.renderMatch(r, t.state)));
    }
    return T.set(e, !0);
  },
  provide: (n) => R.decorations.from(n)
}), Gm = [
  Nm,
  Wm
];
function Hm(n = {}) {
  return [Mc.of(n), Gm];
}
const Fm = /* @__PURE__ */ new P();
function Wr(n, t, e) {
  let i = n.prop(t < 0 ? P.openedBy : P.closedBy);
  if (i)
    return i;
  if (n.name.length == 1) {
    let s = e.indexOf(n.name);
    if (s > -1 && s % 2 == (t < 0 ? 1 : 0))
      return [e[s + t]];
  }
  return null;
}
function Xr(n) {
  let t = n.type.prop(Fm);
  return t ? t(n.node) : n;
}
function Qt(n, t, e, i = {}) {
  let s = i.maxScanDistance || Oc, r = i.brackets || Ac, o = pt(n), l = o.resolveInner(t, e);
  for (let a = l; a; a = a.parent) {
    let h = Wr(a.type, e, r);
    if (h && a.from < a.to) {
      let c = Xr(a);
      if (c && (e > 0 ? t >= c.from && t < c.to : t > c.from && t <= c.to))
        return zm(n, t, e, a, c, h, r);
    }
  }
  return Km(n, t, e, o, l.type, s, r);
}
function zm(n, t, e, i, s, r, o) {
  let l = i.parent, a = { from: s.from, to: s.to }, h = 0, c = l == null ? void 0 : l.cursor();
  if (c && (e < 0 ? c.childBefore(i.from) : c.childAfter(i.to)))
    do
      if (e < 0 ? c.to <= i.from : c.from >= i.to) {
        if (h == 0 && r.indexOf(c.type.name) > -1 && c.from < c.to) {
          let f = Xr(c);
          return { start: a, end: f ? { from: f.from, to: f.to } : void 0, matched: !0 };
        } else if (Wr(c.type, e, o))
          h++;
        else if (Wr(c.type, -e, o)) {
          if (h == 0) {
            let f = Xr(c);
            return {
              start: a,
              end: f && f.from < f.to ? { from: f.from, to: f.to } : void 0,
              matched: !1
            };
          }
          h--;
        }
      }
    while (e < 0 ? c.prevSibling() : c.nextSibling());
  return { start: a, matched: !1 };
}
function Km(n, t, e, i, s, r, o) {
  let l = e < 0 ? n.sliceDoc(t - 1, t) : n.sliceDoc(t, t + 1), a = o.indexOf(l);
  if (a < 0 || a % 2 == 0 != e > 0)
    return null;
  let h = { from: e < 0 ? t - 1 : t, to: e > 0 ? t + 1 : t }, c = n.doc.iterRange(t, e > 0 ? n.doc.length : 0), f = 0;
  for (let u = 0; !c.next().done && u <= r; ) {
    let d = c.value;
    e < 0 && (u += d.length);
    let p = t + u * e;
    for (let g = e > 0 ? 0 : d.length - 1, m = e > 0 ? d.length : -1; g != m; g += e) {
      let b = o.indexOf(d[g]);
      if (!(b < 0 || i.resolveInner(p + g, 1).type != s))
        if (b % 2 == 0 == e > 0)
          f++;
        else {
          if (f == 1)
            return { start: h, end: { from: p + g, to: p + g + 1 }, matched: b >> 1 == a >> 1 };
          f--;
        }
    }
    e > 0 && (u += d.length);
  }
  return c.done ? { start: h, matched: !1 } : null;
}
const Ym = /* @__PURE__ */ Object.create(null), Ul = [Mt.none], $l = [], Jm = /* @__PURE__ */ Object.create(null);
for (let [n, t] of [
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
  Jm[n] = /* @__PURE__ */ Qm(Ym, t);
function Js(n, t) {
  $l.indexOf(n) > -1 || ($l.push(n), console.warn(t));
}
function Qm(n, t) {
  let e = null;
  for (let r of t.split(".")) {
    let o = n[r] || x[r];
    o ? typeof o == "function" ? e ? e = o(e) : Js(r, `Modifier ${r} used at start of tag`) : e ? Js(r, `Tag ${r} used as modifier`) : e = o : Js(r, `Unknown highlighting tag ${r}`);
  }
  if (!e)
    return 0;
  let i = t.replace(/ /g, "_"), s = Mt.define({
    id: Ul.length,
    name: i,
    props: [cc({ [i]: e })]
  });
  return Ul.push(s), s.id;
}
const Rc = vt.define(x.meta), Zc = vt.define(x.typeName), Um = vt.define(x.variableName), Lc = vt.define(x.compareOperator);
let mo = Su.configure({
  props: [
    cc({
      Identifier: Um,
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
      MetaVar: Rc,
      TypeVar: Zc,
      TypeCon: x.typeName,
      /* constraints */
      constraintOp: Lc
    }),
    pc.add({
      // TODO (Ben @ 2023/09/12) handle indentatoin
      Application: (n) => n.column(n.node.from) + n.unit
    }),
    gc.add({
      // TODO (Ben @ 2023/09/12) handle folding
      Application: xm
    })
  ]
});
const jl = () => new ho(
  ei.define({
    parser: mo,
    languageData: {
      commentTokens: { line: "--" }
    }
  })
), $m = () => new ho(
  ei.define({
    parser: mo.configure({ top: "TypeLang" }),
    languageData: {
      commentTokens: { line: "--" }
    }
  })
), jm = () => new ho(
  ei.define({
    parser: mo.configure({ top: "UnifLang" }),
    languageData: {
      commentTokens: { line: "--" }
    }
  })
), Qs = "#4B69C6", qm = Ki.define([
  { tag: x.keyword, color: Qs, fontWeight: "bold" },
  { tag: x.definitionKeyword, color: "#72009e", fontWeight: "bold" },
  { tag: x.comment, color: "#808080", fontStyle: "italic" },
  { tag: x.punctuation, color: "#444", fontWeight: "bold" },
  // {tag: tagTermVar, color: "#f00", fontStyle: "italic"},
  { tag: x.bool, color: "#088", fontStyle: "italic" },
  { tag: x.string, color: "#080" },
  { tag: x.integer, color: "#99006e" },
  { tag: x.arithmeticOperator, color: Qs },
  { tag: x.compareOperator, color: Qs },
  /* types */
  { tag: x.typeName, color: "#a85800" },
  { tag: Zc },
  { tag: Rc, color: "#ff00d6" },
  /* constraints */
  { tag: Lc, color: "#a500ff", fontWeight: "bold" }
]), _m = Cc(qm);
function N() {
  var n = arguments[0];
  typeof n == "string" && (n = document.createElement(n));
  var t = 1, e = arguments[1];
  if (e && typeof e == "object" && e.nodeType == null && !Array.isArray(e)) {
    for (var i in e)
      if (Object.prototype.hasOwnProperty.call(e, i)) {
        var s = e[i];
        typeof s == "string" ? n.setAttribute(i, s) : s != null && (n[i] = s);
      }
    t++;
  }
  for (; t < arguments.length; t++)
    Tc(n, arguments[t]);
  return n;
}
function Tc(n, t) {
  if (typeof t == "string")
    n.appendChild(document.createTextNode(t));
  else if (t != null)
    if (t.nodeType != null)
      n.appendChild(t);
    else if (Array.isArray(t))
      for (var e = 0; e < t.length; e++)
        Tc(n, t[e]);
    else
      throw new RangeError("Unsupported child node: " + t);
}
class tg {
  constructor(t, e, i) {
    this.from = t, this.to = e, this.diagnostic = i;
  }
}
class Me {
  constructor(t, e, i) {
    this.diagnostics = t, this.panel = e, this.selected = i;
  }
  static init(t, e, i) {
    let s = t, r = i.facet(Ze).markerFilter;
    r && (s = r(s));
    let o = T.set(s.map((l) => l.from == l.to || l.from == l.to - 1 && i.doc.lineAt(l.from).to == l.from ? T.widget({
      widget: new hg(l),
      diagnostic: l
    }).range(l.from) : T.mark({
      attributes: { class: "cm-lintRange cm-lintRange-" + l.severity + (l.markClass ? " " + l.markClass : "") },
      diagnostic: l
    }).range(l.from, l.to)), !0);
    return new Me(o, e, ni(o));
  }
}
function ni(n, t = null, e = 0) {
  let i = null;
  return n.between(e, 1e9, (s, r, { spec: o }) => {
    if (!(t && o.diagnostic != t))
      return i = new tg(s, r, o.diagnostic), !1;
  }), i;
}
function Dc(n, t) {
  let e = n.startState.doc.lineAt(t.pos);
  return !!(n.effects.some((i) => i.is(bs)) || n.changes.touchesRange(e.from, e.to));
}
function Pc(n, t) {
  return n.field(Pt, !1) ? t : t.concat(L.appendConfig.of(Nc));
}
function eg(n, t) {
  return {
    effects: Pc(n, [bs.of(t)])
  };
}
const bs = /* @__PURE__ */ L.define(), go = /* @__PURE__ */ L.define(), Vc = /* @__PURE__ */ L.define(), Pt = /* @__PURE__ */ q.define({
  create() {
    return new Me(T.none, null, null);
  },
  update(n, t) {
    if (t.docChanged) {
      let e = n.diagnostics.map(t.changes), i = null;
      if (n.selected) {
        let s = t.changes.mapPos(n.selected.from, 1);
        i = ni(e, n.selected.diagnostic, s) || ni(e, null, s);
      }
      n = new Me(e, n.panel, i);
    }
    for (let e of t.effects)
      e.is(bs) ? n = Me.init(e.value, n.panel, t.state) : e.is(go) ? n = new Me(n.diagnostics, e.value ? ys.open : null, n.selected) : e.is(Vc) && (n = new Me(n.diagnostics, n.panel, e.value));
    return n;
  },
  provide: (n) => [
    Pi.from(n, (t) => t.panel),
    R.decorations.from(n, (t) => t.diagnostics)
  ]
}), ig = /* @__PURE__ */ T.mark({ class: "cm-lintRange cm-lintRange-active" });
function ng(n, t, e) {
  let { diagnostics: i } = n.state.field(Pt), s = [], r = 2e8, o = 0;
  i.between(t - (e < 0 ? 1 : 0), t + (e > 0 ? 1 : 0), (a, h, { spec: c }) => {
    t >= a && t <= h && (a == h || (t > a || e > 0) && (t < h || e < 0)) && (s.push(c.diagnostic), r = Math.min(a, r), o = Math.max(h, o));
  });
  let l = n.state.facet(Ze).tooltipFilter;
  return l && (s = l(s)), s.length ? {
    pos: r,
    end: o,
    above: n.state.doc.lineAt(r).to < o,
    create() {
      return { dom: Bc(n, s) };
    }
  } : null;
}
function Bc(n, t) {
  return N("ul", { class: "cm-tooltip-lint" }, t.map((e) => Xc(n, e, !1)));
}
const sg = (n) => {
  let t = n.state.field(Pt, !1);
  (!t || !t.panel) && n.dispatch({ effects: Pc(n.state, [go.of(!0)]) });
  let e = Di(n, ys.open);
  return e && e.dom.querySelector(".cm-panel-lint ul").focus(), !0;
}, ql = (n) => {
  let t = n.state.field(Pt, !1);
  return !t || !t.panel ? !1 : (n.dispatch({ effects: go.of(!1) }), !0);
}, rg = (n) => {
  let t = n.state.field(Pt, !1);
  if (!t)
    return !1;
  let e = n.state.selection.main, i = t.diagnostics.iter(e.to + 1);
  return !i.value && (i = t.diagnostics.iter(0), !i.value || i.from == e.from && i.to == e.to) ? !1 : (n.dispatch({ selection: { anchor: i.from, head: i.to }, scrollIntoView: !0 }), !0);
}, og = [
  { key: "Mod-Shift-m", run: sg, preventDefault: !0 },
  { key: "F8", run: rg }
], lg = /* @__PURE__ */ nt.fromClass(class {
  constructor(n) {
    this.view = n, this.timeout = -1, this.set = !0;
    let { delay: t } = n.state.facet(Ze);
    this.lintTime = Date.now() + t, this.run = this.run.bind(this), this.timeout = setTimeout(this.run, t);
  }
  run() {
    let n = Date.now();
    if (n < this.lintTime - 10)
      this.timeout = setTimeout(this.run, this.lintTime - n);
    else {
      this.set = !1;
      let { state: t } = this.view, { sources: e } = t.facet(Ze);
      Promise.all(e.map((i) => Promise.resolve(i(this.view)))).then((i) => {
        let s = i.reduce((r, o) => r.concat(o));
        this.view.state.doc == t.doc && this.view.dispatch(eg(this.view.state, s));
      }, (i) => {
        Vt(this.view.state, i);
      });
    }
  }
  update(n) {
    let t = n.state.facet(Ze);
    (n.docChanged || t != n.startState.facet(Ze) || t.needsRefresh && t.needsRefresh(n)) && (this.lintTime = Date.now() + t.delay, this.set || (this.set = !0, this.timeout = setTimeout(this.run, t.delay)));
  }
  force() {
    this.set && (this.lintTime = Date.now(), this.run());
  }
  destroy() {
    clearTimeout(this.timeout);
  }
}), Ze = /* @__PURE__ */ A.define({
  combine(n) {
    return Object.assign({ sources: n.map((t) => t.source) }, qt(n.map((t) => t.config), {
      delay: 750,
      markerFilter: null,
      tooltipFilter: null,
      needsRefresh: null
    }, {
      needsRefresh: (t, e) => t ? e ? (i) => t(i) || e(i) : t : e
    }));
  }
});
function ag(n, t = {}) {
  return [
    Ze.of({ source: n, config: t }),
    lg,
    Nc
  ];
}
function Wc(n) {
  let t = [];
  if (n)
    t:
      for (let { name: e } of n) {
        for (let i = 0; i < e.length; i++) {
          let s = e[i];
          if (/[a-zA-Z]/.test(s) && !t.some((r) => r.toLowerCase() == s.toLowerCase())) {
            t.push(s);
            continue t;
          }
        }
        t.push("");
      }
  return t;
}
function Xc(n, t, e) {
  var i;
  let s = e ? Wc(t.actions) : [];
  return N("li", { class: "cm-diagnostic cm-diagnostic-" + t.severity }, N("span", { class: "cm-diagnosticText" }, t.renderMessage ? t.renderMessage() : t.message), (i = t.actions) === null || i === void 0 ? void 0 : i.map((r, o) => {
    let l = !1, a = (u) => {
      if (u.preventDefault(), l)
        return;
      l = !0;
      let d = ni(n.state.field(Pt).diagnostics, t);
      d && r.apply(n, d.from, d.to);
    }, { name: h } = r, c = s[o] ? h.indexOf(s[o]) : -1, f = c < 0 ? h : [
      h.slice(0, c),
      N("u", h.slice(c, c + 1)),
      h.slice(c + 1)
    ];
    return N("button", {
      type: "button",
      class: "cm-diagnosticAction",
      onclick: a,
      onmousedown: a,
      "aria-label": ` Action: ${h}${c < 0 ? "" : ` (access key "${s[o]})"`}.`
    }, f);
  }), t.source && N("div", { class: "cm-diagnosticSource" }, t.source));
}
class hg extends Se {
  constructor(t) {
    super(), this.diagnostic = t;
  }
  eq(t) {
    return t.diagnostic == this.diagnostic;
  }
  toDOM() {
    return N("span", { class: "cm-lintPoint cm-lintPoint-" + this.diagnostic.severity });
  }
}
class _l {
  constructor(t, e) {
    this.diagnostic = e, this.id = "item_" + Math.floor(Math.random() * 4294967295).toString(16), this.dom = Xc(t, e, !0), this.dom.id = this.id, this.dom.setAttribute("role", "option");
  }
}
class ys {
  constructor(t) {
    this.view = t, this.items = [];
    let e = (s) => {
      if (s.keyCode == 27)
        ql(this.view), this.view.focus();
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
        let { diagnostic: r } = this.items[this.selectedIndex], o = Wc(r.actions);
        for (let l = 0; l < o.length; l++)
          if (o[l].toUpperCase().charCodeAt(0) == s.keyCode) {
            let a = ni(this.view.state.field(Pt).diagnostics, r);
            a && r.actions[l].apply(t, a.from, a.to);
          }
      } else
        return;
      s.preventDefault();
    }, i = (s) => {
      for (let r = 0; r < this.items.length; r++)
        this.items[r].dom.contains(s.target) && this.moveSelection(r);
    };
    this.list = N("ul", {
      tabIndex: 0,
      role: "listbox",
      "aria-label": this.view.state.phrase("Diagnostics"),
      onkeydown: e,
      onclick: i
    }), this.dom = N("div", { class: "cm-panel-lint" }, this.list, N("button", {
      type: "button",
      name: "close",
      "aria-label": this.view.state.phrase("close"),
      onclick: () => ql(this.view)
    }, "×")), this.update();
  }
  get selectedIndex() {
    let t = this.view.state.field(Pt).selected;
    if (!t)
      return -1;
    for (let e = 0; e < this.items.length; e++)
      if (this.items[e].diagnostic == t.diagnostic)
        return e;
    return -1;
  }
  update() {
    let { diagnostics: t, selected: e } = this.view.state.field(Pt), i = 0, s = !1, r = null;
    for (t.between(0, this.view.state.doc.length, (o, l, { spec: a }) => {
      let h = -1, c;
      for (let f = i; f < this.items.length; f++)
        if (this.items[f].diagnostic == a.diagnostic) {
          h = f;
          break;
        }
      h < 0 ? (c = new _l(this.view, a.diagnostic), this.items.splice(i, 0, c), s = !0) : (c = this.items[h], h > i && (this.items.splice(i, h - i), s = !0)), e && c.diagnostic == e.diagnostic ? c.dom.hasAttribute("aria-selected") || (c.dom.setAttribute("aria-selected", "true"), r = c) : c.dom.hasAttribute("aria-selected") && c.dom.removeAttribute("aria-selected"), i++;
    }); i < this.items.length && !(this.items.length == 1 && this.items[0].diagnostic.from < 0); )
      s = !0, this.items.pop();
    this.items.length == 0 && (this.items.push(new _l(this.view, {
      from: -1,
      to: -1,
      severity: "info",
      message: this.view.state.phrase("No diagnostics")
    })), s = !0), r ? (this.list.setAttribute("aria-activedescendant", r.id), this.view.requestMeasure({
      key: this,
      read: () => ({ sel: r.dom.getBoundingClientRect(), panel: this.list.getBoundingClientRect() }),
      write: ({ sel: o, panel: l }) => {
        o.top < l.top ? this.list.scrollTop -= l.top - o.top : o.bottom > l.bottom && (this.list.scrollTop += o.bottom - l.bottom);
      }
    })) : this.selectedIndex < 0 && this.list.removeAttribute("aria-activedescendant"), s && this.sync();
  }
  sync() {
    let t = this.list.firstChild;
    function e() {
      let i = t;
      t = i.nextSibling, i.remove();
    }
    for (let i of this.items)
      if (i.dom.parentNode == this.list) {
        for (; t != i.dom; )
          e();
        t = i.dom.nextSibling;
      } else
        this.list.insertBefore(i.dom, t);
    for (; t; )
      e();
  }
  moveSelection(t) {
    if (this.selectedIndex < 0)
      return;
    let e = this.view.state.field(Pt), i = ni(e.diagnostics, this.items[t].diagnostic);
    i && this.view.dispatch({
      selection: { anchor: i.from, head: i.to },
      scrollIntoView: !0,
      effects: Vc.of(i)
    });
  }
  static open(t) {
    return new ys(t);
  }
}
function Rn(n, t = 'viewBox="0 0 40 40"') {
  return `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" ${t}>${encodeURIComponent(n)}</svg>')`;
}
function pn(n) {
  return Rn(`<path d="m0 2.5 l2 -1.5 l1 0 l2 1.5 l1 0" stroke="${n}" fill="none" stroke-width=".7"/>`, 'width="6" height="3"');
}
const cg = /* @__PURE__ */ R.baseTheme({
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
  ".cm-lintRange-error": { backgroundImage: /* @__PURE__ */ pn("#d11") },
  ".cm-lintRange-warning": { backgroundImage: /* @__PURE__ */ pn("orange") },
  ".cm-lintRange-info": { backgroundImage: /* @__PURE__ */ pn("#999") },
  ".cm-lintRange-hint": { backgroundImage: /* @__PURE__ */ pn("#66d") },
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
function ta(n) {
  return n == "error" ? 4 : n == "warning" ? 3 : n == "info" ? 2 : 1;
}
class fg extends se {
  constructor(t) {
    super(), this.diagnostics = t, this.severity = t.reduce((e, i) => ta(e) < ta(i.severity) ? i.severity : e, "hint");
  }
  toDOM(t) {
    let e = document.createElement("div");
    e.className = "cm-lint-marker cm-lint-marker-" + this.severity;
    let i = this.diagnostics, s = t.state.facet(xs).tooltipFilter;
    return s && (i = s(i)), i.length && (e.onmouseover = () => dg(t, e, i)), e;
  }
}
function ug(n, t) {
  let e = (i) => {
    let s = t.getBoundingClientRect();
    if (!(i.clientX > s.left - 10 && i.clientX < s.right + 10 && i.clientY > s.top - 10 && i.clientY < s.bottom + 10)) {
      for (let r = i.target; r; r = r.parentNode)
        if (r.nodeType == 1 && r.classList.contains("cm-tooltip-lint"))
          return;
      window.removeEventListener("mousemove", e), n.state.field(Ec) && n.dispatch({ effects: bo.of(null) });
    }
  };
  window.addEventListener("mousemove", e);
}
function dg(n, t, e) {
  function i() {
    let o = n.elementAtHeight(t.getBoundingClientRect().top + 5 - n.documentTop);
    n.coordsAtPos(o.from) && n.dispatch({ effects: bo.of({
      pos: o.from,
      above: !1,
      create() {
        return {
          dom: Bc(n, e),
          getCoords: () => t.getBoundingClientRect()
        };
      }
    }) }), t.onmouseout = t.onmousemove = null, ug(n, t);
  }
  let { hoverTime: s } = n.state.facet(xs), r = setTimeout(i, s);
  t.onmouseout = () => {
    clearTimeout(r), t.onmouseout = t.onmousemove = null;
  }, t.onmousemove = () => {
    clearTimeout(r), r = setTimeout(i, s);
  };
}
function pg(n, t) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let s of t) {
    let r = n.lineAt(s.from);
    (e[r.from] || (e[r.from] = [])).push(s);
  }
  let i = [];
  for (let s in e)
    i.push(new fg(e[s]).range(+s));
  return I.of(i, !0);
}
const mg = /* @__PURE__ */ lc({
  class: "cm-gutter-lint",
  markers: (n) => n.state.field(Ic)
}), Ic = /* @__PURE__ */ q.define({
  create() {
    return I.empty;
  },
  update(n, t) {
    n = n.map(t.changes);
    let e = t.state.facet(xs).markerFilter;
    for (let i of t.effects)
      if (i.is(bs)) {
        let s = i.value;
        e && (s = e(s || [])), n = pg(t.state.doc, s.slice(0));
      }
    return n;
  }
}), bo = /* @__PURE__ */ L.define(), Ec = /* @__PURE__ */ q.define({
  create() {
    return null;
  },
  update(n, t) {
    return n && t.docChanged && (n = Dc(t, n) ? null : Object.assign(Object.assign({}, n), { pos: t.changes.mapPos(n.pos) })), t.effects.reduce((e, i) => i.is(bo) ? i.value : e, n);
  },
  provide: (n) => ps.from(n)
}), gg = /* @__PURE__ */ R.baseTheme({
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
    content: /* @__PURE__ */ Rn('<path fill="#aaf" stroke="#77e" stroke-width="6" stroke-linejoin="round" d="M5 5L35 5L35 35L5 35Z"/>')
  },
  ".cm-lint-marker-warning": {
    content: /* @__PURE__ */ Rn('<path fill="#fe8" stroke="#fd7" stroke-width="6" stroke-linejoin="round" d="M20 6L37 35L3 35Z"/>')
  },
  ".cm-lint-marker-error": {
    content: /* @__PURE__ */ Rn('<circle cx="20" cy="20" r="15" fill="#f87" stroke="#f43" stroke-width="6"/>')
  }
}), Nc = [
  Pt,
  /* @__PURE__ */ R.decorations.compute([Pt], (n) => {
    let { selected: t, panel: e } = n.field(Pt);
    return !t || !e || t.from == t.to ? T.none : T.set([
      ig.range(t.from, t.to)
    ]);
  }),
  /* @__PURE__ */ Gp(ng, { hideOn: Dc }),
  cg
], xs = /* @__PURE__ */ A.define({
  combine(n) {
    return qt(n, {
      hoverTime: 300,
      markerFilter: null,
      tooltipFilter: null
    });
  }
});
function bg(n = {}) {
  return [xs.of(n), Ic, mg, gg, Ec];
}
const yg = () => [
  ag((t) => t.state.field(ea).map(
    (i) => ({
      from: i.range.from,
      to: i.range.to,
      severity: "error",
      message: i.message,
      actions: []
    })
  )),
  ea.init(() => []),
  bg()
], Gc = L.define({
  map: (n, t) => Fc(t)(n)
}), Hc = L.define(), Fc = (n) => (t) => ({
  ...t,
  range: {
    from: n.mapPos(t.range.from),
    to: n.mapPos(t.range.to)
  }
}), ea = q.define({
  create() {
    return [];
  },
  update(n, t) {
    n = n.map(Fc(t.changes));
    for (let e of t.effects)
      e.is(Gc) ? n.push(e.value) : e.is(Hc) && (n = []);
    return n;
  }
});
class zc {
  constructor(t) {
    Qi(this, "lineChunks", !1);
    this.input = t;
  }
  get length() {
    return this.input.length;
  }
  chunk(t) {
    return this.input.slice(t);
  }
  read(t, e) {
    return this.input.slice(t, e);
  }
}
function ia({ type: n, from: t, to: e }, i = !1) {
  return { type: n, from: t, to: e, isLeaf: i };
}
function xg(n, {
  from: t = -1 / 0,
  to: e = 1 / 0,
  includeParents: i = !1,
  beforeEnter: s,
  onEnter: r,
  onLeave: o
}) {
  for (n instanceof vi || (n = n.cursor()); ; ) {
    let l = ia(n), a = !1;
    if (l.from <= e && l.to >= t) {
      const h = !l.type.isAnonymous && (i || l.from >= t && l.to <= e);
      if (h && s && s(n), l.isLeaf = !n.firstChild(), h && (a = !0, r(l) === !1))
        return;
      if (!l.isLeaf)
        continue;
    }
    for (; ; ) {
      if (l = ia(n, l.isLeaf), a && o && o(l) === !1)
        return;
      if (a = n.type.isAnonymous, l.isLeaf = !1, n.nextSibling())
        break;
      if (!n.parent())
        return;
      a = !0;
    }
  }
}
function na(n, t) {
  return n.from >= t.from && n.from <= t.to && n.to <= t.to && n.to >= t.from;
}
function kg(n, { fullMatch: t = !0 } = {}) {
  typeof n == "string" && (n = new zc(n));
  const e = {
    valid: !0,
    parentNodes: [],
    lastLeafTo: 0
  };
  return {
    state: e,
    traversal: {
      onEnter(i) {
        e.valid = !0, i.isLeaf || e.parentNodes.unshift(i), i.from > i.to || i.from < e.lastLeafTo ? e.valid = !1 : i.isLeaf ? (e.parentNodes.length && !na(i, e.parentNodes[0]) && (e.valid = !1), e.lastLeafTo = i.to) : e.parentNodes.length ? na(i, e.parentNodes[0]) || (e.valid = !1) : t && (i.from !== 0 || i.to !== n.length) && (e.valid = !1);
      },
      onLeave(i) {
        i.isLeaf || e.parentNodes.shift();
      }
    }
  };
}
function ui(n, t) {
  return "\x1B[" + t + "m" + String(n) + "\x1B[39m";
}
function sa(n, t, { from: e, to: i, start: s = 0, includeParents: r } = {}) {
  const o = typeof t == "string" ? new zc(t) : t, l = W.of(o.read(0, o.length).split(`
`)), a = {
    output: "",
    prefixes: [],
    hasNextSibling: !1
  }, h = kg(o);
  return xg(n, {
    from: e,
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
      a.output += (c.type.isError || !h.state.valid ? ui(
        c.type.name,
        31
        /* Red */
      ) : c.type.name) + " " + (d ? "[" + ui(
        Us(l, s + c.from),
        33
        /* Yellow */
      ) + ".." + ui(
        Us(l, s + c.to),
        33
        /* Yellow */
      ) + "]" : ui(
        Us(l, s + c.from),
        33
        /* Yellow */
      )), d && c.isLeaf && (a.output += ": " + ui(
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
function Us(n, t) {
  const e = n.lineAt(t);
  return e.number + ":" + (t - e.from);
}
const wg = (n) => {
  let { state: t } = n, e = t.doc.lineAt(t.selection.main.from), i = xo(n.state, e.from);
  return i.line ? Sg(n) : i.block ? Cg(n) : !1;
};
function yo(n, t) {
  return ({ state: e, dispatch: i }) => {
    if (e.readOnly)
      return !1;
    let s = n(t, e);
    return s ? (i(e.update(s)), !0) : !1;
  };
}
const Sg = /* @__PURE__ */ yo(
  Mg,
  0
  /* CommentOption.Toggle */
), vg = /* @__PURE__ */ yo(
  Kc,
  0
  /* CommentOption.Toggle */
), Cg = /* @__PURE__ */ yo(
  (n, t) => Kc(n, t, Ag(t)),
  0
  /* CommentOption.Toggle */
);
function xo(n, t) {
  let e = n.languageDataAt("commentTokens", t);
  return e.length ? e[0] : {};
}
const di = 50;
function Og(n, { open: t, close: e }, i, s) {
  let r = n.sliceDoc(i - di, i), o = n.sliceDoc(s, s + di), l = /\s*$/.exec(r)[0].length, a = /^\s*/.exec(o)[0].length, h = r.length - l;
  if (r.slice(h - t.length, h) == t && o.slice(a, a + e.length) == e)
    return {
      open: { pos: i - l, margin: l && 1 },
      close: { pos: s + a, margin: a && 1 }
    };
  let c, f;
  s - i <= 2 * di ? c = f = n.sliceDoc(i, s) : (c = n.sliceDoc(i, i + di), f = n.sliceDoc(s - di, s));
  let u = /^\s*/.exec(c)[0].length, d = /\s*$/.exec(f)[0].length, p = f.length - d - e.length;
  return c.slice(u, u + t.length) == t && f.slice(p, p + e.length) == e ? {
    open: {
      pos: i + u + t.length,
      margin: /\s/.test(c.charAt(u + t.length)) ? 1 : 0
    },
    close: {
      pos: s - d - e.length,
      margin: /\s/.test(f.charAt(p - 1)) ? 1 : 0
    }
  } : null;
}
function Ag(n) {
  let t = [];
  for (let e of n.selection.ranges) {
    let i = n.doc.lineAt(e.from), s = e.to <= i.to ? i : n.doc.lineAt(e.to), r = t.length - 1;
    r >= 0 && t[r].to > i.from ? t[r].to = s.to : t.push({ from: i.from + /^\s*/.exec(i.text)[0].length, to: s.to });
  }
  return t;
}
function Kc(n, t, e = t.selection.ranges) {
  let i = e.map((r) => xo(t, r.from).block);
  if (!i.every((r) => r))
    return null;
  let s = e.map((r, o) => Og(t, i[o], r.from, r.to));
  if (n != 2 && !s.every((r) => r))
    return { changes: t.changes(e.map((r, o) => s[o] ? [] : [{ from: r.from, insert: i[o].open + " " }, { from: r.to, insert: " " + i[o].close }])) };
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
function Mg(n, t, e = t.selection.ranges) {
  let i = [], s = -1;
  for (let { from: r, to: o } of e) {
    let l = i.length, a = 1e9, h = xo(t, r).line;
    if (h) {
      for (let c = r; c <= o; ) {
        let f = t.doc.lineAt(c);
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
    let o = t.changes(r);
    return { changes: o, selection: t.selection.map(o, 1) };
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
const Ir = /* @__PURE__ */ re.define(), Rg = /* @__PURE__ */ re.define(), Zg = /* @__PURE__ */ A.define(), Yc = /* @__PURE__ */ A.define({
  combine(n) {
    return qt(n, {
      minDepth: 100,
      newGroupDelay: 500,
      joinToEvent: (t, e) => e
    }, {
      minDepth: Math.max,
      newGroupDelay: Math.min,
      joinToEvent: (t, e) => (i, s) => t(i, s) || e(i, s)
    });
  }
});
function Lg(n) {
  let t = 0;
  return n.iterChangedRanges((e, i) => t = i), t;
}
const Jc = /* @__PURE__ */ q.define({
  create() {
    return Ut.empty;
  },
  update(n, t) {
    let e = t.state.facet(Yc), i = t.annotation(Ir);
    if (i) {
      let a = t.docChanged ? y.single(Lg(t.changes)) : void 0, h = Ot.fromTransaction(t, a), c = i.side, f = c == 0 ? n.undone : n.done;
      return h ? f = _n(f, f.length, e.minDepth, h) : f = $c(f, t.startState.selection), new Ut(c == 0 ? i.rest : f, c == 0 ? f : i.rest);
    }
    let s = t.annotation(Rg);
    if ((s == "full" || s == "before") && (n = n.isolate()), t.annotation(it.addToHistory) === !1)
      return t.changes.empty ? n : n.addMapping(t.changes.desc);
    let r = Ot.fromTransaction(t), o = t.annotation(it.time), l = t.annotation(it.userEvent);
    return r ? n = n.addChanges(r, o, l, e, t) : t.selection && (n = n.addSelection(t.startState.selection, o, l, e.newGroupDelay)), (s == "full" || s == "after") && (n = n.isolate()), n;
  },
  toJSON(n) {
    return { done: n.done.map((t) => t.toJSON()), undone: n.undone.map((t) => t.toJSON()) };
  },
  fromJSON(n) {
    return new Ut(n.done.map(Ot.fromJSON), n.undone.map(Ot.fromJSON));
  }
});
function Tg(n = {}) {
  return [
    Jc,
    Yc.of(n),
    R.domEventHandlers({
      beforeinput(t, e) {
        let i = t.inputType == "historyUndo" ? Qc : t.inputType == "historyRedo" ? Er : null;
        return i ? (t.preventDefault(), i(e)) : !1;
      }
    })
  ];
}
function ks(n, t) {
  return function({ state: e, dispatch: i }) {
    if (!t && e.readOnly)
      return !1;
    let s = e.field(Jc, !1);
    if (!s)
      return !1;
    let r = s.pop(n, e, t);
    return r ? (i(r), !0) : !1;
  };
}
const Qc = /* @__PURE__ */ ks(0, !1), Er = /* @__PURE__ */ ks(1, !1), Dg = /* @__PURE__ */ ks(0, !0), Pg = /* @__PURE__ */ ks(1, !0);
class Ot {
  constructor(t, e, i, s, r) {
    this.changes = t, this.effects = e, this.mapped = i, this.startSelection = s, this.selectionsAfter = r;
  }
  setSelAfter(t) {
    return new Ot(this.changes, this.effects, this.mapped, this.startSelection, t);
  }
  toJSON() {
    var t, e, i;
    return {
      changes: (t = this.changes) === null || t === void 0 ? void 0 : t.toJSON(),
      mapped: (e = this.mapped) === null || e === void 0 ? void 0 : e.toJSON(),
      startSelection: (i = this.startSelection) === null || i === void 0 ? void 0 : i.toJSON(),
      selectionsAfter: this.selectionsAfter.map((s) => s.toJSON())
    };
  }
  static fromJSON(t) {
    return new Ot(t.changes && et.fromJSON(t.changes), [], t.mapped && $t.fromJSON(t.mapped), t.startSelection && y.fromJSON(t.startSelection), t.selectionsAfter.map(y.fromJSON));
  }
  // This does not check `addToHistory` and such, it assumes the
  // transaction needs to be converted to an item. Returns null when
  // there are no changes or effects in the transaction.
  static fromTransaction(t, e) {
    let i = Wt;
    for (let s of t.startState.facet(Zg)) {
      let r = s(t);
      r.length && (i = i.concat(r));
    }
    return !i.length && t.changes.empty ? null : new Ot(t.changes.invert(t.startState.doc), i, void 0, e || t.startState.selection, Wt);
  }
  static selection(t) {
    return new Ot(void 0, Wt, void 0, void 0, t);
  }
}
function _n(n, t, e, i) {
  let s = t + 1 > e + 20 ? t - e - 1 : 0, r = n.slice(s, t);
  return r.push(i), r;
}
function Vg(n, t) {
  let e = [], i = !1;
  return n.iterChangedRanges((s, r) => e.push(s, r)), t.iterChangedRanges((s, r, o, l) => {
    for (let a = 0; a < e.length; ) {
      let h = e[a++], c = e[a++];
      l >= h && o <= c && (i = !0);
    }
  }), i;
}
function Bg(n, t) {
  return n.ranges.length == t.ranges.length && n.ranges.filter((e, i) => e.empty != t.ranges[i].empty).length === 0;
}
function Uc(n, t) {
  return n.length ? t.length ? n.concat(t) : n : t;
}
const Wt = [], Wg = 200;
function $c(n, t) {
  if (n.length) {
    let e = n[n.length - 1], i = e.selectionsAfter.slice(Math.max(0, e.selectionsAfter.length - Wg));
    return i.length && i[i.length - 1].eq(t) ? n : (i.push(t), _n(n, n.length - 1, 1e9, e.setSelAfter(i)));
  } else
    return [Ot.selection([t])];
}
function Xg(n) {
  let t = n[n.length - 1], e = n.slice();
  return e[n.length - 1] = t.setSelAfter(t.selectionsAfter.slice(0, t.selectionsAfter.length - 1)), e;
}
function $s(n, t) {
  if (!n.length)
    return n;
  let e = n.length, i = Wt;
  for (; e; ) {
    let s = Ig(n[e - 1], t, i);
    if (s.changes && !s.changes.empty || s.effects.length) {
      let r = n.slice(0, e);
      return r[e - 1] = s, r;
    } else
      t = s.mapped, e--, i = s.selectionsAfter;
  }
  return i.length ? [Ot.selection(i)] : Wt;
}
function Ig(n, t, e) {
  let i = Uc(n.selectionsAfter.length ? n.selectionsAfter.map((l) => l.map(t)) : Wt, e);
  if (!n.changes)
    return Ot.selection(i);
  let s = n.changes.map(t), r = t.mapDesc(n.changes, !0), o = n.mapped ? n.mapped.composeDesc(r) : r;
  return new Ot(s, L.mapEffects(n.effects, t), o, n.startSelection.map(r), i);
}
const Eg = /^(input\.type|delete)($|\.)/;
class Ut {
  constructor(t, e, i = 0, s = void 0) {
    this.done = t, this.undone = e, this.prevTime = i, this.prevUserEvent = s;
  }
  isolate() {
    return this.prevTime ? new Ut(this.done, this.undone) : this;
  }
  addChanges(t, e, i, s, r) {
    let o = this.done, l = o[o.length - 1];
    return l && l.changes && !l.changes.empty && t.changes && (!i || Eg.test(i)) && (!l.selectionsAfter.length && e - this.prevTime < s.newGroupDelay && s.joinToEvent(r, Vg(l.changes, t.changes)) || // For compose (but not compose.start) events, always join with previous event
    i == "input.type.compose") ? o = _n(o, o.length - 1, s.minDepth, new Ot(t.changes.compose(l.changes), Uc(t.effects, l.effects), l.mapped, l.startSelection, Wt)) : o = _n(o, o.length, s.minDepth, t), new Ut(o, Wt, e, i);
  }
  addSelection(t, e, i, s) {
    let r = this.done.length ? this.done[this.done.length - 1].selectionsAfter : Wt;
    return r.length > 0 && e - this.prevTime < s && i == this.prevUserEvent && i && /^select($|\.)/.test(i) && Bg(r[r.length - 1], t) ? this : new Ut($c(this.done, t), this.undone, e, i);
  }
  addMapping(t) {
    return new Ut($s(this.done, t), $s(this.undone, t), this.prevTime, this.prevUserEvent);
  }
  pop(t, e, i) {
    let s = t == 0 ? this.done : this.undone;
    if (s.length == 0)
      return null;
    let r = s[s.length - 1];
    if (i && r.selectionsAfter.length)
      return e.update({
        selection: r.selectionsAfter[r.selectionsAfter.length - 1],
        annotations: Ir.of({ side: t, rest: Xg(s) }),
        userEvent: t == 0 ? "select.undo" : "select.redo",
        scrollIntoView: !0
      });
    if (r.changes) {
      let o = s.length == 1 ? Wt : s.slice(0, s.length - 1);
      return r.mapped && (o = $s(o, r.mapped)), e.update({
        changes: r.changes,
        selection: r.startSelection,
        effects: r.effects,
        annotations: Ir.of({ side: t, rest: o }),
        filter: !1,
        userEvent: t == 0 ? "undo" : "redo",
        scrollIntoView: !0
      });
    } else
      return null;
  }
}
Ut.empty = /* @__PURE__ */ new Ut(Wt, Wt);
const Ng = [
  { key: "Mod-z", run: Qc, preventDefault: !0 },
  { key: "Mod-y", mac: "Mod-Shift-z", run: Er, preventDefault: !0 },
  { linux: "Ctrl-Shift-z", run: Er, preventDefault: !0 },
  { key: "Mod-u", run: Dg, preventDefault: !0 },
  { key: "Alt-u", mac: "Mod-Shift-u", run: Pg, preventDefault: !0 }
];
function oi(n, t) {
  return y.create(n.ranges.map(t), n.mainIndex);
}
function _t(n, t) {
  return n.update({ selection: t, scrollIntoView: !0, userEvent: "select" });
}
function Nt({ state: n, dispatch: t }, e) {
  let i = oi(n.selection, e);
  return i.eq(n.selection) ? !1 : (t(_t(n, i)), !0);
}
function ws(n, t) {
  return y.cursor(t ? n.to : n.from);
}
function jc(n, t) {
  return Nt(n, (e) => e.empty ? n.moveByChar(e, t) : ws(e, t));
}
function mt(n) {
  return n.textDirectionAt(n.state.selection.main.head) == z.LTR;
}
const qc = (n) => jc(n, !mt(n)), _c = (n) => jc(n, mt(n));
function tf(n, t) {
  return Nt(n, (e) => e.empty ? n.moveByGroup(e, t) : ws(e, t));
}
const Gg = (n) => tf(n, !mt(n)), Hg = (n) => tf(n, mt(n));
function Fg(n, t, e) {
  if (t.type.prop(e))
    return !0;
  let i = t.to - t.from;
  return i && (i > 2 || /[^\s,.;:]/.test(n.sliceDoc(t.from, t.to))) || t.firstChild;
}
function Ss(n, t, e) {
  let i = pt(n).resolveInner(t.head), s = e ? P.closedBy : P.openedBy;
  for (let a = t.head; ; ) {
    let h = e ? i.childAfter(a) : i.childBefore(a);
    if (!h)
      break;
    Fg(n, h, s) ? i = h : a = e ? h.to : h.from;
  }
  let r = i.type.prop(s), o, l;
  return r && (o = e ? Qt(n, i.from, 1) : Qt(n, i.to, -1)) && o.matched ? l = e ? o.end.to : o.end.from : l = e ? i.to : i.from, y.cursor(l, e ? -1 : 1);
}
const zg = (n) => Nt(n, (t) => Ss(n.state, t, !mt(n))), Kg = (n) => Nt(n, (t) => Ss(n.state, t, mt(n)));
function ef(n, t) {
  return Nt(n, (e) => {
    if (!e.empty)
      return ws(e, t);
    let i = n.moveVertically(e, t);
    return i.head != e.head ? i : n.moveToLineBoundary(e, t);
  });
}
const nf = (n) => ef(n, !1), sf = (n) => ef(n, !0);
function rf(n) {
  let t = n.scrollDOM.clientHeight < n.scrollDOM.scrollHeight - 2, e = 0, i = 0, s;
  if (t) {
    for (let r of n.state.facet(R.scrollMargins)) {
      let o = r(n);
      o != null && o.top && (e = Math.max(o == null ? void 0 : o.top, e)), o != null && o.bottom && (i = Math.max(o == null ? void 0 : o.bottom, i));
    }
    s = n.scrollDOM.clientHeight - e - i;
  } else
    s = (n.dom.ownerDocument.defaultView || window).innerHeight;
  return {
    marginTop: e,
    marginBottom: i,
    selfScroll: t,
    height: Math.max(n.defaultLineHeight, s - 5)
  };
}
function of(n, t) {
  let e = rf(n), { state: i } = n, s = oi(i.selection, (o) => o.empty ? n.moveVertically(o, t, e.height) : ws(o, t));
  if (s.eq(i.selection))
    return !1;
  let r;
  if (e.selfScroll) {
    let o = n.coordsAtPos(i.selection.main.head), l = n.scrollDOM.getBoundingClientRect(), a = l.top + e.marginTop, h = l.bottom - e.marginBottom;
    o && o.top > a && o.bottom < h && (r = R.scrollIntoView(s.main.head, { y: "start", yMargin: o.top - a }));
  }
  return n.dispatch(_t(i, s), { effects: r }), !0;
}
const ra = (n) => of(n, !1), Nr = (n) => of(n, !0);
function ve(n, t, e) {
  let i = n.lineBlockAt(t.head), s = n.moveToLineBoundary(t, e);
  if (s.head == t.head && s.head != (e ? i.to : i.from) && (s = n.moveToLineBoundary(t, e, !1)), !e && s.head == i.from && i.length) {
    let r = /^\s*/.exec(n.state.sliceDoc(i.from, Math.min(i.from + 100, i.to)))[0].length;
    r && t.head != i.from + r && (s = y.cursor(i.from + r));
  }
  return s;
}
const Yg = (n) => Nt(n, (t) => ve(n, t, !0)), Jg = (n) => Nt(n, (t) => ve(n, t, !1)), Qg = (n) => Nt(n, (t) => ve(n, t, !mt(n))), Ug = (n) => Nt(n, (t) => ve(n, t, mt(n))), $g = (n) => Nt(n, (t) => y.cursor(n.lineBlockAt(t.head).from, 1)), jg = (n) => Nt(n, (t) => y.cursor(n.lineBlockAt(t.head).to, -1));
function qg(n, t, e) {
  let i = !1, s = oi(n.selection, (r) => {
    let o = Qt(n, r.head, -1) || Qt(n, r.head, 1) || r.head > 0 && Qt(n, r.head - 1, 1) || r.head < n.doc.length && Qt(n, r.head + 1, -1);
    if (!o || !o.end)
      return r;
    i = !0;
    let l = o.start.from == r.head ? o.end.to : o.end.from;
    return e ? y.range(r.anchor, l) : y.cursor(l);
  });
  return i ? (t(_t(n, s)), !0) : !1;
}
const _g = ({ state: n, dispatch: t }) => qg(n, t, !1);
function It(n, t) {
  let e = oi(n.state.selection, (i) => {
    let s = t(i);
    return y.range(i.anchor, s.head, s.goalColumn, s.bidiLevel || void 0);
  });
  return e.eq(n.state.selection) ? !1 : (n.dispatch(_t(n.state, e)), !0);
}
function lf(n, t) {
  return It(n, (e) => n.moveByChar(e, t));
}
const af = (n) => lf(n, !mt(n)), hf = (n) => lf(n, mt(n));
function cf(n, t) {
  return It(n, (e) => n.moveByGroup(e, t));
}
const t0 = (n) => cf(n, !mt(n)), e0 = (n) => cf(n, mt(n)), i0 = (n) => It(n, (t) => Ss(n.state, t, !mt(n))), n0 = (n) => It(n, (t) => Ss(n.state, t, mt(n)));
function ff(n, t) {
  return It(n, (e) => n.moveVertically(e, t));
}
const uf = (n) => ff(n, !1), df = (n) => ff(n, !0);
function pf(n, t) {
  return It(n, (e) => n.moveVertically(e, t, rf(n).height));
}
const oa = (n) => pf(n, !1), la = (n) => pf(n, !0), s0 = (n) => It(n, (t) => ve(n, t, !0)), r0 = (n) => It(n, (t) => ve(n, t, !1)), o0 = (n) => It(n, (t) => ve(n, t, !mt(n))), l0 = (n) => It(n, (t) => ve(n, t, mt(n))), a0 = (n) => It(n, (t) => y.cursor(n.lineBlockAt(t.head).from)), h0 = (n) => It(n, (t) => y.cursor(n.lineBlockAt(t.head).to)), aa = ({ state: n, dispatch: t }) => (t(_t(n, { anchor: 0 })), !0), ha = ({ state: n, dispatch: t }) => (t(_t(n, { anchor: n.doc.length })), !0), ca = ({ state: n, dispatch: t }) => (t(_t(n, { anchor: n.selection.main.anchor, head: 0 })), !0), fa = ({ state: n, dispatch: t }) => (t(_t(n, { anchor: n.selection.main.anchor, head: n.doc.length })), !0), c0 = ({ state: n, dispatch: t }) => (t(n.update({ selection: { anchor: 0, head: n.doc.length }, userEvent: "select" })), !0), f0 = ({ state: n, dispatch: t }) => {
  let e = Cs(n).map(({ from: i, to: s }) => y.range(i, Math.min(s + 1, n.doc.length)));
  return t(n.update({ selection: y.create(e), userEvent: "select" })), !0;
}, u0 = ({ state: n, dispatch: t }) => {
  let e = oi(n.selection, (i) => {
    var s;
    let r = pt(n).resolveInner(i.head, 1);
    for (; !(r.from < i.from && r.to >= i.to || r.to > i.to && r.from <= i.from || !(!((s = r.parent) === null || s === void 0) && s.parent)); )
      r = r.parent;
    return y.range(r.to, r.from);
  });
  return t(_t(n, e)), !0;
}, d0 = ({ state: n, dispatch: t }) => {
  let e = n.selection, i = null;
  return e.ranges.length > 1 ? i = y.create([e.main]) : e.main.empty || (i = y.create([y.cursor(e.main.head)])), i ? (t(_t(n, i)), !0) : !1;
};
function vs(n, t) {
  if (n.state.readOnly)
    return !1;
  let e = "delete.selection", { state: i } = n, s = i.changeByRange((r) => {
    let { from: o, to: l } = r;
    if (o == l) {
      let a = t(o);
      a < o ? (e = "delete.backward", a = mn(n, a, !1)) : a > o && (e = "delete.forward", a = mn(n, a, !0)), o = Math.min(o, a), l = Math.max(l, a);
    } else
      o = mn(n, o, !1), l = mn(n, l, !0);
    return o == l ? { range: r } : { changes: { from: o, to: l }, range: y.cursor(o) };
  });
  return s.changes.empty ? !1 : (n.dispatch(i.update(s, {
    scrollIntoView: !0,
    userEvent: e,
    effects: e == "delete.selection" ? R.announce.of(i.phrase("Selection deleted")) : void 0
  })), !0);
}
function mn(n, t, e) {
  if (n instanceof R)
    for (let i of n.state.facet(R.atomicRanges).map((s) => s(n)))
      i.between(t, t, (s, r) => {
        s < t && r > t && (t = e ? r : s);
      });
  return t;
}
const mf = (n, t) => vs(n, (e) => {
  let { state: i } = n, s = i.doc.lineAt(e), r, o;
  if (!t && e > s.from && e < s.from + 200 && !/[^ \t]/.test(r = s.text.slice(0, e - s.from))) {
    if (r[r.length - 1] == "	")
      return e - 1;
    let l = Ni(r, i.tabSize), a = l % $n(i) || $n(i);
    for (let h = 0; h < a && r[r.length - 1 - h] == " "; h++)
      e--;
    o = e;
  } else
    o = ut(s.text, e - s.from, t, t) + s.from, o == e && s.number != (t ? i.doc.lines : 1) && (o += t ? 1 : -1);
  return o;
}), Gr = (n) => mf(n, !1), gf = (n) => mf(n, !0), bf = (n, t) => vs(n, (e) => {
  let i = e, { state: s } = n, r = s.doc.lineAt(i), o = s.charCategorizer(i);
  for (let l = null; ; ) {
    if (i == (t ? r.to : r.from)) {
      i == e && r.number != (t ? s.doc.lines : 1) && (i += t ? 1 : -1);
      break;
    }
    let a = ut(r.text, i - r.from, t) + r.from, h = r.text.slice(Math.min(i, a) - r.from, Math.max(i, a) - r.from), c = o(h);
    if (l != null && c != l)
      break;
    (h != " " || i != e) && (l = c), i = a;
  }
  return i;
}), yf = (n) => bf(n, !1), p0 = (n) => bf(n, !0), xf = (n) => vs(n, (t) => {
  let e = n.lineBlockAt(t).to;
  return t < e ? e : Math.min(n.state.doc.length, t + 1);
}), m0 = (n) => vs(n, (t) => {
  let e = n.lineBlockAt(t).from;
  return t > e ? e : Math.max(0, t - 1);
}), g0 = ({ state: n, dispatch: t }) => {
  if (n.readOnly)
    return !1;
  let e = n.changeByRange((i) => ({
    changes: { from: i.from, to: i.to, insert: W.of(["", ""]) },
    range: y.cursor(i.from)
  }));
  return t(n.update(e, { scrollIntoView: !0, userEvent: "input" })), !0;
}, b0 = ({ state: n, dispatch: t }) => {
  if (n.readOnly)
    return !1;
  let e = n.changeByRange((i) => {
    if (!i.empty || i.from == 0 || i.from == n.doc.length)
      return { range: i };
    let s = i.from, r = n.doc.lineAt(s), o = s == r.from ? s - 1 : ut(r.text, s - r.from, !1) + r.from, l = s == r.to ? s + 1 : ut(r.text, s - r.from, !0) + r.from;
    return {
      changes: { from: o, to: l, insert: n.doc.slice(s, l).append(n.doc.slice(o, s)) },
      range: y.cursor(l)
    };
  });
  return e.changes.empty ? !1 : (t(n.update(e, { scrollIntoView: !0, userEvent: "move.character" })), !0);
};
function Cs(n) {
  let t = [], e = -1;
  for (let i of n.selection.ranges) {
    let s = n.doc.lineAt(i.from), r = n.doc.lineAt(i.to);
    if (!i.empty && i.to == r.from && (r = n.doc.lineAt(i.to - 1)), e >= s.number) {
      let o = t[t.length - 1];
      o.to = r.to, o.ranges.push(i);
    } else
      t.push({ from: s.from, to: r.to, ranges: [i] });
    e = r.number + 1;
  }
  return t;
}
function kf(n, t, e) {
  if (n.readOnly)
    return !1;
  let i = [], s = [];
  for (let r of Cs(n)) {
    if (e ? r.to == n.doc.length : r.from == 0)
      continue;
    let o = n.doc.lineAt(e ? r.to + 1 : r.from - 1), l = o.length + 1;
    if (e) {
      i.push({ from: r.to, to: o.to }, { from: r.from, insert: o.text + n.lineBreak });
      for (let a of r.ranges)
        s.push(y.range(Math.min(n.doc.length, a.anchor + l), Math.min(n.doc.length, a.head + l)));
    } else {
      i.push({ from: o.from, to: r.from }, { from: r.to, insert: n.lineBreak + o.text });
      for (let a of r.ranges)
        s.push(y.range(a.anchor - l, a.head - l));
    }
  }
  return i.length ? (t(n.update({
    changes: i,
    scrollIntoView: !0,
    selection: y.create(s, n.selection.mainIndex),
    userEvent: "move.line"
  })), !0) : !1;
}
const y0 = ({ state: n, dispatch: t }) => kf(n, t, !1), x0 = ({ state: n, dispatch: t }) => kf(n, t, !0);
function wf(n, t, e) {
  if (n.readOnly)
    return !1;
  let i = [];
  for (let s of Cs(n))
    e ? i.push({ from: s.from, insert: n.doc.slice(s.from, s.to) + n.lineBreak }) : i.push({ from: s.to, insert: n.lineBreak + n.doc.slice(s.from, s.to) });
  return t(n.update({ changes: i, scrollIntoView: !0, userEvent: "input.copyline" })), !0;
}
const k0 = ({ state: n, dispatch: t }) => wf(n, t, !1), w0 = ({ state: n, dispatch: t }) => wf(n, t, !0), S0 = (n) => {
  if (n.state.readOnly)
    return !1;
  let { state: t } = n, e = t.changes(Cs(t).map(({ from: s, to: r }) => (s > 0 ? s-- : r < t.doc.length && r++, { from: s, to: r }))), i = oi(t.selection, (s) => n.moveVertically(s, !0)).map(e);
  return n.dispatch({ changes: e, selection: i, scrollIntoView: !0, userEvent: "delete.line" }), !0;
};
function v0(n, t) {
  if (/\(\)|\[\]|\{\}/.test(n.sliceDoc(t - 1, t + 1)))
    return { from: t, to: t };
  let e = pt(n).resolveInner(t), i = e.childBefore(t), s = e.childAfter(t), r;
  return i && s && i.to <= t && s.from >= t && (r = i.type.prop(P.closedBy)) && r.indexOf(s.name) > -1 && n.doc.lineAt(i.to).from == n.doc.lineAt(s.from).from && !/\S/.test(n.sliceDoc(i.to, s.from)) ? { from: i.to, to: s.from } : null;
}
const C0 = /* @__PURE__ */ Sf(!1), O0 = /* @__PURE__ */ Sf(!0);
function Sf(n) {
  return ({ state: t, dispatch: e }) => {
    if (t.readOnly)
      return !1;
    let i = t.changeByRange((s) => {
      let { from: r, to: o } = s, l = t.doc.lineAt(r), a = !n && r == o && v0(t, r);
      n && (r = o = (o <= l.to ? l : t.doc.lineAt(o)).to);
      let h = new ms(t, { simulateBreak: r, simulateDoubleBreak: !!a }), c = fo(h, r);
      for (c == null && (c = Ni(/^\s*/.exec(t.doc.lineAt(r).text)[0], t.tabSize)); o < l.to && /\s/.test(l.text[o - l.from]); )
        o++;
      a ? { from: r, to: o } = a : r > l.from && r < l.from + 100 && !/\S/.test(l.text.slice(0, r)) && (r = l.from);
      let f = ["", Vi(t, c)];
      return a && f.push(Vi(t, h.lineIndent(l.from, -1))), {
        changes: { from: r, to: o, insert: W.of(f) },
        range: y.cursor(r + 1 + f[1].length)
      };
    });
    return e(t.update(i, { scrollIntoView: !0, userEvent: "input" })), !0;
  };
}
function ko(n, t) {
  let e = -1;
  return n.changeByRange((i) => {
    let s = [];
    for (let o = i.from; o <= i.to; ) {
      let l = n.doc.lineAt(o);
      l.number > e && (i.empty || i.to > l.from) && (t(l, s, i), e = l.number), o = l.to + 1;
    }
    let r = n.changes(s);
    return {
      changes: s,
      range: y.range(r.mapPos(i.anchor, 1), r.mapPos(i.head, 1))
    };
  });
}
const A0 = ({ state: n, dispatch: t }) => {
  if (n.readOnly)
    return !1;
  let e = /* @__PURE__ */ Object.create(null), i = new ms(n, { overrideIndentation: (r) => {
    let o = e[r];
    return o ?? -1;
  } }), s = ko(n, (r, o, l) => {
    let a = fo(i, r.from);
    if (a == null)
      return;
    /\S/.test(r.text) || (a = 0);
    let h = /^\s*/.exec(r.text)[0], c = Vi(n, a);
    (h != c || l.from < r.from + h.length) && (e[r.from] = a, o.push({ from: r.from, to: r.from + h.length, insert: c }));
  });
  return s.changes.empty || t(n.update(s, { userEvent: "indent" })), !0;
}, M0 = ({ state: n, dispatch: t }) => n.readOnly ? !1 : (t(n.update(ko(n, (e, i) => {
  i.push({ from: e.from, insert: n.facet(co) });
}), { userEvent: "input.indent" })), !0), R0 = ({ state: n, dispatch: t }) => n.readOnly ? !1 : (t(n.update(ko(n, (e, i) => {
  let s = /^\s*/.exec(e.text)[0];
  if (!s)
    return;
  let r = Ni(s, n.tabSize), o = 0, l = Vi(n, Math.max(0, r - $n(n)));
  for (; o < s.length && o < l.length && s.charCodeAt(o) == l.charCodeAt(o); )
    o++;
  i.push({ from: e.from + o, to: e.from + s.length, insert: l.slice(o) });
}), { userEvent: "delete.dedent" })), !0), Z0 = [
  { key: "Ctrl-b", run: qc, shift: af, preventDefault: !0 },
  { key: "Ctrl-f", run: _c, shift: hf },
  { key: "Ctrl-p", run: nf, shift: uf },
  { key: "Ctrl-n", run: sf, shift: df },
  { key: "Ctrl-a", run: $g, shift: a0 },
  { key: "Ctrl-e", run: jg, shift: h0 },
  { key: "Ctrl-d", run: gf },
  { key: "Ctrl-h", run: Gr },
  { key: "Ctrl-k", run: xf },
  { key: "Ctrl-Alt-h", run: yf },
  { key: "Ctrl-o", run: g0 },
  { key: "Ctrl-t", run: b0 },
  { key: "Ctrl-v", run: Nr }
], L0 = /* @__PURE__ */ [
  { key: "ArrowLeft", run: qc, shift: af, preventDefault: !0 },
  { key: "Mod-ArrowLeft", mac: "Alt-ArrowLeft", run: Gg, shift: t0, preventDefault: !0 },
  { mac: "Cmd-ArrowLeft", run: Qg, shift: o0, preventDefault: !0 },
  { key: "ArrowRight", run: _c, shift: hf, preventDefault: !0 },
  { key: "Mod-ArrowRight", mac: "Alt-ArrowRight", run: Hg, shift: e0, preventDefault: !0 },
  { mac: "Cmd-ArrowRight", run: Ug, shift: l0, preventDefault: !0 },
  { key: "ArrowUp", run: nf, shift: uf, preventDefault: !0 },
  { mac: "Cmd-ArrowUp", run: aa, shift: ca },
  { mac: "Ctrl-ArrowUp", run: ra, shift: oa },
  { key: "ArrowDown", run: sf, shift: df, preventDefault: !0 },
  { mac: "Cmd-ArrowDown", run: ha, shift: fa },
  { mac: "Ctrl-ArrowDown", run: Nr, shift: la },
  { key: "PageUp", run: ra, shift: oa },
  { key: "PageDown", run: Nr, shift: la },
  { key: "Home", run: Jg, shift: r0, preventDefault: !0 },
  { key: "Mod-Home", run: aa, shift: ca },
  { key: "End", run: Yg, shift: s0, preventDefault: !0 },
  { key: "Mod-End", run: ha, shift: fa },
  { key: "Enter", run: C0 },
  { key: "Mod-a", run: c0 },
  { key: "Backspace", run: Gr, shift: Gr },
  { key: "Delete", run: gf },
  { key: "Mod-Backspace", mac: "Alt-Backspace", run: yf },
  { key: "Mod-Delete", mac: "Alt-Delete", run: p0 },
  { mac: "Mod-Backspace", run: m0 },
  { mac: "Mod-Delete", run: xf }
].concat(/* @__PURE__ */ Z0.map((n) => ({ mac: n.key, run: n.run, shift: n.shift }))), T0 = /* @__PURE__ */ [
  { key: "Alt-ArrowLeft", mac: "Ctrl-ArrowLeft", run: zg, shift: i0 },
  { key: "Alt-ArrowRight", mac: "Ctrl-ArrowRight", run: Kg, shift: n0 },
  { key: "Alt-ArrowUp", run: y0 },
  { key: "Shift-Alt-ArrowUp", run: k0 },
  { key: "Alt-ArrowDown", run: x0 },
  { key: "Shift-Alt-ArrowDown", run: w0 },
  { key: "Escape", run: d0 },
  { key: "Mod-Enter", run: O0 },
  { key: "Alt-l", mac: "Ctrl-l", run: f0 },
  { key: "Mod-i", run: u0, preventDefault: !0 },
  { key: "Mod-[", run: R0 },
  { key: "Mod-]", run: M0 },
  { key: "Mod-Alt-\\", run: A0 },
  { key: "Shift-Mod-k", run: S0 },
  { key: "Shift-Mod-\\", run: _g },
  { key: "Mod-/", run: wg },
  { key: "Alt-A", run: vg }
].concat(L0), ua = typeof String.prototype.normalize == "function" ? (n) => n.normalize("NFKD") : (n) => n;
class Bi {
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
  constructor(t, e, i = 0, s = t.length, r, o) {
    this.test = o, this.value = { from: 0, to: 0 }, this.done = !1, this.matches = [], this.buffer = "", this.bufferPos = 0, this.iter = t.iterRange(i, s), this.bufferStart = i, this.normalize = r ? (l) => r(ua(l)) : ua, this.query = this.normalize(e);
  }
  peek() {
    if (this.bufferPos == this.buffer.length) {
      if (this.bufferStart += this.buffer.length, this.iter.next(), this.iter.done)
        return -1;
      this.bufferPos = 0, this.buffer = this.iter.value;
    }
    return lt(this.buffer, this.bufferPos);
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
      let t = this.peek();
      if (t < 0)
        return this.done = !0, this;
      let e = jr(t), i = this.bufferStart + this.bufferPos;
      this.bufferPos += Bt(t);
      let s = this.normalize(e);
      for (let r = 0, o = i; ; r++) {
        let l = s.charCodeAt(r), a = this.match(l, o);
        if (r == s.length - 1) {
          if (a)
            return this.value = a, this;
          break;
        }
        o == i && r < e.length && e.charCodeAt(r) == l && o++;
      }
    }
  }
  match(t, e) {
    let i = null;
    for (let s = 0; s < this.matches.length; s += 2) {
      let r = this.matches[s], o = !1;
      this.query.charCodeAt(r) == t && (r == this.query.length - 1 ? i = { from: this.matches[s + 1], to: e + 1 } : (this.matches[s]++, o = !0)), o || (this.matches.splice(s, 2), s -= 2);
    }
    return this.query.charCodeAt(0) == t && (this.query.length == 1 ? i = { from: e, to: e + 1 } : this.matches.push(1, e)), i && this.test && !this.test(i.from, i.to, this.buffer, this.bufferPos) && (i = null), i;
  }
}
typeof Symbol < "u" && (Bi.prototype[Symbol.iterator] = function() {
  return this;
});
const vf = { from: -1, to: -1, match: /* @__PURE__ */ /.*/.exec("") }, wo = "gm" + (/x/.unicode == null ? "" : "u");
class Cf {
  /**
  Create a cursor that will search the given range in the given
  document. `query` should be the raw pattern (as you'd pass it to
  `new RegExp`).
  */
  constructor(t, e, i, s = 0, r = t.length) {
    if (this.text = t, this.to = r, this.curLine = "", this.done = !1, this.value = vf, /\\[sWDnr]|\n|\r|\[\^/.test(e))
      return new Of(t, e, i, s, r);
    this.re = new RegExp(e, wo + (i != null && i.ignoreCase ? "i" : "")), this.test = i == null ? void 0 : i.test, this.iter = t.iter();
    let o = t.lineAt(s);
    this.curLineStart = o.from, this.matchPos = ts(t, s), this.getLine(this.curLineStart);
  }
  getLine(t) {
    this.iter.next(t), this.iter.lineBreak ? this.curLine = "" : (this.curLine = this.iter.value, this.curLineStart + this.curLine.length > this.to && (this.curLine = this.curLine.slice(0, this.to - this.curLineStart)), this.iter.next());
  }
  nextLine() {
    this.curLineStart = this.curLineStart + this.curLine.length + 1, this.curLineStart > this.to ? this.curLine = "" : this.getLine(0);
  }
  /**
  Move to the next match, if there is one.
  */
  next() {
    for (let t = this.matchPos - this.curLineStart; ; ) {
      this.re.lastIndex = t;
      let e = this.matchPos <= this.to && this.re.exec(this.curLine);
      if (e) {
        let i = this.curLineStart + e.index, s = i + e[0].length;
        if (this.matchPos = ts(this.text, s + (i == s ? 1 : 0)), i == this.curLineStart + this.curLine.length && this.nextLine(), (i < s || i > this.value.to) && (!this.test || this.test(i, s, e)))
          return this.value = { from: i, to: s, match: e }, this;
        t = this.matchPos - this.curLineStart;
      } else if (this.curLineStart + this.curLine.length < this.to)
        this.nextLine(), t = 0;
      else
        return this.done = !0, this;
    }
  }
}
const js = /* @__PURE__ */ new WeakMap();
class je {
  constructor(t, e) {
    this.from = t, this.text = e;
  }
  get to() {
    return this.from + this.text.length;
  }
  static get(t, e, i) {
    let s = js.get(t);
    if (!s || s.from >= i || s.to <= e) {
      let l = new je(e, t.sliceString(e, i));
      return js.set(t, l), l;
    }
    if (s.from == e && s.to == i)
      return s;
    let { text: r, from: o } = s;
    return o > e && (r = t.sliceString(e, o) + r, o = e), s.to < i && (r += t.sliceString(s.to, i)), js.set(t, new je(o, r)), new je(e, r.slice(e - o, i - o));
  }
}
class Of {
  constructor(t, e, i, s, r) {
    this.text = t, this.to = r, this.done = !1, this.value = vf, this.matchPos = ts(t, s), this.re = new RegExp(e, wo + (i != null && i.ignoreCase ? "i" : "")), this.test = i == null ? void 0 : i.test, this.flat = je.get(t, s, this.chunkEnd(
      s + 5e3
      /* Chunk.Base */
    ));
  }
  chunkEnd(t) {
    return t >= this.to ? this.to : this.text.lineAt(t).to;
  }
  next() {
    for (; ; ) {
      let t = this.re.lastIndex = this.matchPos - this.flat.from, e = this.re.exec(this.flat.text);
      if (e && !e[0] && e.index == t && (this.re.lastIndex = t + 1, e = this.re.exec(this.flat.text)), e) {
        let i = this.flat.from + e.index, s = i + e[0].length;
        if ((this.flat.to >= this.to || e.index + e[0].length <= this.flat.text.length - 10) && (!this.test || this.test(i, s, e)))
          return this.value = { from: i, to: s, match: e }, this.matchPos = ts(this.text, s + (i == s ? 1 : 0)), this;
      }
      if (this.flat.to == this.to)
        return this.done = !0, this;
      this.flat = je.get(this.text, this.flat.from, this.chunkEnd(this.flat.from + this.flat.text.length * 2));
    }
  }
}
typeof Symbol < "u" && (Cf.prototype[Symbol.iterator] = Of.prototype[Symbol.iterator] = function() {
  return this;
});
function D0(n) {
  try {
    return new RegExp(n, wo), !0;
  } catch {
    return !1;
  }
}
function ts(n, t) {
  if (t >= n.length)
    return t;
  let e = n.lineAt(t), i;
  for (; t < e.to && (i = e.text.charCodeAt(t - e.from)) >= 56320 && i < 57344; )
    t++;
  return t;
}
function Hr(n) {
  let t = N("input", { class: "cm-textfield", name: "line" }), e = N("form", {
    class: "cm-gotoLine",
    onkeydown: (s) => {
      s.keyCode == 27 ? (s.preventDefault(), n.dispatch({ effects: es.of(!1) }), n.focus()) : s.keyCode == 13 && (s.preventDefault(), i());
    },
    onsubmit: (s) => {
      s.preventDefault(), i();
    }
  }, N("label", n.state.phrase("Go to line"), ": ", t), " ", N("button", { class: "cm-button", type: "submit" }, n.state.phrase("go")));
  function i() {
    let s = /^([+-])?(\d+)?(:\d+)?(%)?$/.exec(t.value);
    if (!s)
      return;
    let { state: r } = n, o = r.doc.lineAt(r.selection.main.head), [, l, a, h, c] = s, f = h ? +h.slice(1) : 0, u = a ? +a : o.number;
    if (a && c) {
      let g = u / 100;
      l && (g = g * (l == "-" ? -1 : 1) + o.number / r.doc.lines), u = Math.round(r.doc.lines * g);
    } else
      a && l && (u = u * (l == "-" ? -1 : 1) + o.number);
    let d = r.doc.line(Math.max(1, Math.min(r.doc.lines, u))), p = y.cursor(d.from + Math.max(0, Math.min(f, d.length)));
    n.dispatch({
      effects: [es.of(!1), R.scrollIntoView(p.from, { y: "center" })],
      selection: p
    }), n.focus();
  }
  return { dom: e };
}
const es = /* @__PURE__ */ L.define(), da = /* @__PURE__ */ q.define({
  create() {
    return !0;
  },
  update(n, t) {
    for (let e of t.effects)
      e.is(es) && (n = e.value);
    return n;
  },
  provide: (n) => Pi.from(n, (t) => t ? Hr : null)
}), P0 = (n) => {
  let t = Di(n, Hr);
  if (!t) {
    let e = [es.of(!0)];
    n.state.field(da, !1) == null && e.push(L.appendConfig.of([da, V0])), n.dispatch({ effects: e }), t = Di(n, Hr);
  }
  return t && t.dom.querySelector("input").focus(), !0;
}, V0 = /* @__PURE__ */ R.baseTheme({
  ".cm-panel.cm-gotoLine": {
    padding: "2px 6px 4px",
    "& label": { fontSize: "80%" }
  }
}), B0 = ({ state: n, dispatch: t }) => {
  let { selection: e } = n, i = y.create(e.ranges.map((s) => n.wordAt(s.head) || y.cursor(s.head)), e.mainIndex);
  return i.eq(e) ? !1 : (t(n.update({ selection: i })), !0);
};
function W0(n, t) {
  let { main: e, ranges: i } = n.selection, s = n.wordAt(e.head), r = s && s.from == e.from && s.to == e.to;
  for (let o = !1, l = new Bi(n.doc, t, i[i.length - 1].to); ; )
    if (l.next(), l.done) {
      if (o)
        return null;
      l = new Bi(n.doc, t, 0, Math.max(0, i[i.length - 1].from - 1)), o = !0;
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
const X0 = ({ state: n, dispatch: t }) => {
  let { ranges: e } = n.selection;
  if (e.some((r) => r.from === r.to))
    return B0({ state: n, dispatch: t });
  let i = n.sliceDoc(e[0].from, e[0].to);
  if (n.selection.ranges.some((r) => n.sliceDoc(r.from, r.to) != i))
    return !1;
  let s = W0(n, i);
  return s ? (t(n.update({
    selection: n.selection.addRange(y.range(s.from, s.to), !1),
    effects: R.scrollIntoView(s.to)
  })), !0) : !1;
}, li = /* @__PURE__ */ A.define({
  combine(n) {
    return qt(n, {
      top: !1,
      caseSensitive: !1,
      literal: !1,
      regexp: !1,
      wholeWord: !1,
      createPanel: (t) => new U0(t),
      scrollToMatch: (t) => R.scrollIntoView(t)
    });
  }
});
class Af {
  /**
  Create a query object.
  */
  constructor(t) {
    this.search = t.search, this.caseSensitive = !!t.caseSensitive, this.literal = !!t.literal, this.regexp = !!t.regexp, this.replace = t.replace || "", this.valid = !!this.search && (!this.regexp || D0(this.search)), this.unquoted = this.unquote(this.search), this.wholeWord = !!t.wholeWord;
  }
  /**
  @internal
  */
  unquote(t) {
    return this.literal ? t : t.replace(/\\([nrt\\])/g, (e, i) => i == "n" ? `
` : i == "r" ? "\r" : i == "t" ? "	" : "\\");
  }
  /**
  Compare this query to another query.
  */
  eq(t) {
    return this.search == t.search && this.replace == t.replace && this.caseSensitive == t.caseSensitive && this.regexp == t.regexp && this.wholeWord == t.wholeWord;
  }
  /**
  @internal
  */
  create() {
    return this.regexp ? new G0(this) : new E0(this);
  }
  /**
  Get a search cursor for this query, searching through the given
  range in the given state.
  */
  getCursor(t, e = 0, i) {
    let s = t.doc ? t : X.create({ doc: t });
    return i == null && (i = s.doc.length), this.regexp ? He(this, s, e, i) : Ge(this, s, e, i);
  }
}
class Mf {
  constructor(t) {
    this.spec = t;
  }
}
function Ge(n, t, e, i) {
  return new Bi(t.doc, n.unquoted, e, i, n.caseSensitive ? void 0 : (s) => s.toLowerCase(), n.wholeWord ? I0(t.doc, t.charCategorizer(t.selection.main.head)) : void 0);
}
function I0(n, t) {
  return (e, i, s, r) => ((r > e || r + s.length < i) && (r = Math.max(0, e - 2), s = n.sliceString(r, Math.min(n.length, i + 2))), (t(is(s, e - r)) != $.Word || t(ns(s, e - r)) != $.Word) && (t(ns(s, i - r)) != $.Word || t(is(s, i - r)) != $.Word));
}
class E0 extends Mf {
  constructor(t) {
    super(t);
  }
  nextMatch(t, e, i) {
    let s = Ge(this.spec, t, i, t.doc.length).nextOverlapping();
    return s.done && (s = Ge(this.spec, t, 0, e).nextOverlapping()), s.done ? null : s.value;
  }
  // Searching in reverse is, rather than implementing an inverted search
  // cursor, done by scanning chunk after chunk forward.
  prevMatchInRange(t, e, i) {
    for (let s = i; ; ) {
      let r = Math.max(e, s - 1e4 - this.spec.unquoted.length), o = Ge(this.spec, t, r, s), l = null;
      for (; !o.nextOverlapping().done; )
        l = o.value;
      if (l)
        return l;
      if (r == e)
        return null;
      s -= 1e4;
    }
  }
  prevMatch(t, e, i) {
    return this.prevMatchInRange(t, 0, e) || this.prevMatchInRange(t, i, t.doc.length);
  }
  getReplacement(t) {
    return this.spec.unquote(this.spec.replace);
  }
  matchAll(t, e) {
    let i = Ge(this.spec, t, 0, t.doc.length), s = [];
    for (; !i.next().done; ) {
      if (s.length >= e)
        return null;
      s.push(i.value);
    }
    return s;
  }
  highlight(t, e, i, s) {
    let r = Ge(this.spec, t, Math.max(0, e - this.spec.unquoted.length), Math.min(i + this.spec.unquoted.length, t.doc.length));
    for (; !r.next().done; )
      s(r.value.from, r.value.to);
  }
}
function He(n, t, e, i) {
  return new Cf(t.doc, n.search, {
    ignoreCase: !n.caseSensitive,
    test: n.wholeWord ? N0(t.charCategorizer(t.selection.main.head)) : void 0
  }, e, i);
}
function is(n, t) {
  return n.slice(ut(n, t, !1), t);
}
function ns(n, t) {
  return n.slice(t, ut(n, t));
}
function N0(n) {
  return (t, e, i) => !i[0].length || (n(is(i.input, i.index)) != $.Word || n(ns(i.input, i.index)) != $.Word) && (n(ns(i.input, i.index + i[0].length)) != $.Word || n(is(i.input, i.index + i[0].length)) != $.Word);
}
class G0 extends Mf {
  nextMatch(t, e, i) {
    let s = He(this.spec, t, i, t.doc.length).next();
    return s.done && (s = He(this.spec, t, 0, e).next()), s.done ? null : s.value;
  }
  prevMatchInRange(t, e, i) {
    for (let s = 1; ; s++) {
      let r = Math.max(
        e,
        i - s * 1e4
        /* FindPrev.ChunkSize */
      ), o = He(this.spec, t, r, i), l = null;
      for (; !o.next().done; )
        l = o.value;
      if (l && (r == e || l.from > r + 10))
        return l;
      if (r == e)
        return null;
    }
  }
  prevMatch(t, e, i) {
    return this.prevMatchInRange(t, 0, e) || this.prevMatchInRange(t, i, t.doc.length);
  }
  getReplacement(t) {
    return this.spec.unquote(this.spec.replace.replace(/\$([$&\d+])/g, (e, i) => i == "$" ? "$" : i == "&" ? t.match[0] : i != "0" && +i < t.match.length ? t.match[i] : e));
  }
  matchAll(t, e) {
    let i = He(this.spec, t, 0, t.doc.length), s = [];
    for (; !i.next().done; ) {
      if (s.length >= e)
        return null;
      s.push(i.value);
    }
    return s;
  }
  highlight(t, e, i, s) {
    let r = He(this.spec, t, Math.max(
      0,
      e - 250
      /* RegExp.HighlightMargin */
    ), Math.min(i + 250, t.doc.length));
    for (; !r.next().done; )
      s(r.value.from, r.value.to);
  }
}
const Wi = /* @__PURE__ */ L.define(), So = /* @__PURE__ */ L.define(), de = /* @__PURE__ */ q.define({
  create(n) {
    return new qs(Fr(n).create(), null);
  },
  update(n, t) {
    for (let e of t.effects)
      e.is(Wi) ? n = new qs(e.value.create(), n.panel) : e.is(So) && (n = new qs(n.query, e.value ? vo : null));
    return n;
  },
  provide: (n) => Pi.from(n, (t) => t.panel)
});
class qs {
  constructor(t, e) {
    this.query = t, this.panel = e;
  }
}
const H0 = /* @__PURE__ */ T.mark({ class: "cm-searchMatch" }), F0 = /* @__PURE__ */ T.mark({ class: "cm-searchMatch cm-searchMatch-selected" }), z0 = /* @__PURE__ */ nt.fromClass(class {
  constructor(n) {
    this.view = n, this.decorations = this.highlight(n.state.field(de));
  }
  update(n) {
    let t = n.state.field(de);
    (t != n.startState.field(de) || n.docChanged || n.selectionSet || n.viewportChanged) && (this.decorations = this.highlight(t));
  }
  highlight({ query: n, panel: t }) {
    if (!t || !n.spec.valid)
      return T.none;
    let { view: e } = this, i = new me();
    for (let s = 0, r = e.visibleRanges, o = r.length; s < o; s++) {
      let { from: l, to: a } = r[s];
      for (; s < o - 1 && a > r[s + 1].from - 2 * 250; )
        a = r[++s].to;
      n.highlight(e.state, l, a, (h, c) => {
        let f = e.state.selection.ranges.some((u) => u.from == h && u.to == c);
        i.add(h, c, f ? F0 : H0);
      });
    }
    return i.finish();
  }
}, {
  decorations: (n) => n.decorations
});
function Yi(n) {
  return (t) => {
    let e = t.state.field(de, !1);
    return e && e.query.spec.valid ? n(t, e) : Lf(t);
  };
}
const ss = /* @__PURE__ */ Yi((n, { query: t }) => {
  let { to: e } = n.state.selection.main, i = t.nextMatch(n.state, e, e);
  if (!i)
    return !1;
  let s = y.single(i.from, i.to), r = n.state.facet(li);
  return n.dispatch({
    selection: s,
    effects: [Co(n, i), r.scrollToMatch(s.main, n)],
    userEvent: "select.search"
  }), Zf(n), !0;
}), rs = /* @__PURE__ */ Yi((n, { query: t }) => {
  let { state: e } = n, { from: i } = e.selection.main, s = t.prevMatch(e, i, i);
  if (!s)
    return !1;
  let r = y.single(s.from, s.to), o = n.state.facet(li);
  return n.dispatch({
    selection: r,
    effects: [Co(n, s), o.scrollToMatch(r.main, n)],
    userEvent: "select.search"
  }), Zf(n), !0;
}), K0 = /* @__PURE__ */ Yi((n, { query: t }) => {
  let e = t.matchAll(n.state, 1e3);
  return !e || !e.length ? !1 : (n.dispatch({
    selection: y.create(e.map((i) => y.range(i.from, i.to))),
    userEvent: "select.search.matches"
  }), !0);
}), Y0 = ({ state: n, dispatch: t }) => {
  let e = n.selection;
  if (e.ranges.length > 1 || e.main.empty)
    return !1;
  let { from: i, to: s } = e.main, r = [], o = 0;
  for (let l = new Bi(n.doc, n.sliceDoc(i, s)); !l.next().done; ) {
    if (r.length > 1e3)
      return !1;
    l.value.from == i && (o = r.length), r.push(y.range(l.value.from, l.value.to));
  }
  return t(n.update({
    selection: y.create(r, o),
    userEvent: "select.search.matches"
  })), !0;
}, pa = /* @__PURE__ */ Yi((n, { query: t }) => {
  let { state: e } = n, { from: i, to: s } = e.selection.main;
  if (e.readOnly)
    return !1;
  let r = t.nextMatch(e, i, i);
  if (!r)
    return !1;
  let o = [], l, a, h = [];
  if (r.from == i && r.to == s && (a = e.toText(t.getReplacement(r)), o.push({ from: r.from, to: r.to, insert: a }), r = t.nextMatch(e, r.from, r.to), h.push(R.announce.of(e.phrase("replaced match on line $", e.doc.lineAt(i).number) + "."))), r) {
    let c = o.length == 0 || o[0].from >= r.to ? 0 : r.to - r.from - a.length;
    l = y.single(r.from - c, r.to - c), h.push(Co(n, r)), h.push(e.facet(li).scrollToMatch(l.main, n));
  }
  return n.dispatch({
    changes: o,
    selection: l,
    effects: h,
    userEvent: "input.replace"
  }), !0;
}), J0 = /* @__PURE__ */ Yi((n, { query: t }) => {
  if (n.state.readOnly)
    return !1;
  let e = t.matchAll(n.state, 1e9).map((s) => {
    let { from: r, to: o } = s;
    return { from: r, to: o, insert: t.getReplacement(s) };
  });
  if (!e.length)
    return !1;
  let i = n.state.phrase("replaced $ matches", e.length) + ".";
  return n.dispatch({
    changes: e,
    effects: R.announce.of(i),
    userEvent: "input.replace.all"
  }), !0;
});
function vo(n) {
  return n.state.facet(li).createPanel(n);
}
function Fr(n, t) {
  var e, i, s, r, o;
  let l = n.selection.main, a = l.empty || l.to > l.from + 100 ? "" : n.sliceDoc(l.from, l.to);
  if (t && !a)
    return t;
  let h = n.facet(li);
  return new Af({
    search: ((e = t == null ? void 0 : t.literal) !== null && e !== void 0 ? e : h.literal) ? a : a.replace(/\n/g, "\\n"),
    caseSensitive: (i = t == null ? void 0 : t.caseSensitive) !== null && i !== void 0 ? i : h.caseSensitive,
    literal: (s = t == null ? void 0 : t.literal) !== null && s !== void 0 ? s : h.literal,
    regexp: (r = t == null ? void 0 : t.regexp) !== null && r !== void 0 ? r : h.regexp,
    wholeWord: (o = t == null ? void 0 : t.wholeWord) !== null && o !== void 0 ? o : h.wholeWord
  });
}
function Rf(n) {
  let t = Di(n, vo);
  return t && t.dom.querySelector("[main-field]");
}
function Zf(n) {
  let t = Rf(n);
  t && t == n.root.activeElement && t.select();
}
const Lf = (n) => {
  let t = n.state.field(de, !1);
  if (t && t.panel) {
    let e = Rf(n);
    if (e && e != n.root.activeElement) {
      let i = Fr(n.state, t.query.spec);
      i.valid && n.dispatch({ effects: Wi.of(i) }), e.focus(), e.select();
    }
  } else
    n.dispatch({ effects: [
      So.of(!0),
      t ? Wi.of(Fr(n.state, t.query.spec)) : L.appendConfig.of(j0)
    ] });
  return !0;
}, Tf = (n) => {
  let t = n.state.field(de, !1);
  if (!t || !t.panel)
    return !1;
  let e = Di(n, vo);
  return e && e.dom.contains(n.root.activeElement) && n.focus(), n.dispatch({ effects: So.of(!1) }), !0;
}, Q0 = [
  { key: "Mod-f", run: Lf, scope: "editor search-panel" },
  { key: "F3", run: ss, shift: rs, scope: "editor search-panel", preventDefault: !0 },
  { key: "Mod-g", run: ss, shift: rs, scope: "editor search-panel", preventDefault: !0 },
  { key: "Escape", run: Tf, scope: "editor search-panel" },
  { key: "Mod-Shift-l", run: Y0 },
  { key: "Alt-g", run: P0 },
  { key: "Mod-d", run: X0, preventDefault: !0 }
];
class U0 {
  constructor(t) {
    this.view = t;
    let e = this.query = t.state.field(de).query.spec;
    this.commit = this.commit.bind(this), this.searchField = N("input", {
      value: e.search,
      placeholder: Zt(t, "Find"),
      "aria-label": Zt(t, "Find"),
      class: "cm-textfield",
      name: "search",
      form: "",
      "main-field": "true",
      onchange: this.commit,
      onkeyup: this.commit
    }), this.replaceField = N("input", {
      value: e.replace,
      placeholder: Zt(t, "Replace"),
      "aria-label": Zt(t, "Replace"),
      class: "cm-textfield",
      name: "replace",
      form: "",
      onchange: this.commit,
      onkeyup: this.commit
    }), this.caseField = N("input", {
      type: "checkbox",
      name: "case",
      form: "",
      checked: e.caseSensitive,
      onchange: this.commit
    }), this.reField = N("input", {
      type: "checkbox",
      name: "re",
      form: "",
      checked: e.regexp,
      onchange: this.commit
    }), this.wordField = N("input", {
      type: "checkbox",
      name: "word",
      form: "",
      checked: e.wholeWord,
      onchange: this.commit
    });
    function i(s, r, o) {
      return N("button", { class: "cm-button", name: s, onclick: r, type: "button" }, o);
    }
    this.dom = N("div", { onkeydown: (s) => this.keydown(s), class: "cm-search" }, [
      this.searchField,
      i("next", () => ss(t), [Zt(t, "next")]),
      i("prev", () => rs(t), [Zt(t, "previous")]),
      i("select", () => K0(t), [Zt(t, "all")]),
      N("label", null, [this.caseField, Zt(t, "match case")]),
      N("label", null, [this.reField, Zt(t, "regexp")]),
      N("label", null, [this.wordField, Zt(t, "by word")]),
      ...t.state.readOnly ? [] : [
        N("br"),
        this.replaceField,
        i("replace", () => pa(t), [Zt(t, "replace")]),
        i("replaceAll", () => J0(t), [Zt(t, "replace all")])
      ],
      N("button", {
        name: "close",
        onclick: () => Tf(t),
        "aria-label": Zt(t, "close"),
        type: "button"
      }, ["×"])
    ]);
  }
  commit() {
    let t = new Af({
      search: this.searchField.value,
      caseSensitive: this.caseField.checked,
      regexp: this.reField.checked,
      wholeWord: this.wordField.checked,
      replace: this.replaceField.value
    });
    t.eq(this.query) || (this.query = t, this.view.dispatch({ effects: Wi.of(t) }));
  }
  keydown(t) {
    up(this.view, t, "search-panel") ? t.preventDefault() : t.keyCode == 13 && t.target == this.searchField ? (t.preventDefault(), (t.shiftKey ? rs : ss)(this.view)) : t.keyCode == 13 && t.target == this.replaceField && (t.preventDefault(), pa(this.view));
  }
  update(t) {
    for (let e of t.transactions)
      for (let i of e.effects)
        i.is(Wi) && !i.value.eq(this.query) && this.setQuery(i.value);
  }
  setQuery(t) {
    this.query = t, this.searchField.value = t.search, this.replaceField.value = t.replace, this.caseField.checked = t.caseSensitive, this.reField.checked = t.regexp, this.wordField.checked = t.wholeWord;
  }
  mount() {
    this.searchField.select();
  }
  get pos() {
    return 80;
  }
  get top() {
    return this.view.state.facet(li).top;
  }
}
function Zt(n, t) {
  return n.state.phrase(t);
}
const gn = 30, bn = /[\s\.,:;?!]/;
function Co(n, { from: t, to: e }) {
  let i = n.state.doc.lineAt(t), s = n.state.doc.lineAt(e).to, r = Math.max(i.from, t - gn), o = Math.min(s, e + gn), l = n.state.sliceDoc(r, o);
  if (r != i.from) {
    for (let a = 0; a < gn; a++)
      if (!bn.test(l[a + 1]) && bn.test(l[a])) {
        l = l.slice(a);
        break;
      }
  }
  if (o != s) {
    for (let a = l.length - 1; a > l.length - gn; a--)
      if (!bn.test(l[a - 1]) && bn.test(l[a])) {
        l = l.slice(0, a);
        break;
      }
  }
  return R.announce.of(`${n.state.phrase("current match")}. ${l} ${n.state.phrase("on line")} ${i.number}.`);
}
const $0 = /* @__PURE__ */ R.baseTheme({
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
}), j0 = [
  de,
  /* @__PURE__ */ ri.low(z0),
  $0
];
class Df {
  /**
  Create a new completion context. (Mostly useful for testing
  completion sources—in the editor, the extension will create
  these for you.)
  */
  constructor(t, e, i) {
    this.state = t, this.pos = e, this.explicit = i, this.abortListeners = [];
  }
  /**
  Get the extent, content, and (if there is a token) type of the
  token before `this.pos`.
  */
  tokenBefore(t) {
    let e = pt(this.state).resolveInner(this.pos, -1);
    for (; e && t.indexOf(e.name) < 0; )
      e = e.parent;
    return e ? {
      from: e.from,
      to: this.pos,
      text: this.state.sliceDoc(e.from, this.pos),
      type: e.type
    } : null;
  }
  /**
  Get the match of the given expression directly before the
  cursor.
  */
  matchBefore(t) {
    let e = this.state.doc.lineAt(this.pos), i = Math.max(e.from, this.pos - 250), s = e.text.slice(i - e.from, this.pos - e.from), r = s.search(Pf(t, !1));
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
  addEventListener(t, e) {
    t == "abort" && this.abortListeners && this.abortListeners.push(e);
  }
}
function ma(n) {
  let t = Object.keys(n).join(""), e = /\w/.test(t);
  return e && (t = t.replace(/\w/g, "")), `[${e ? "\\w" : ""}${t.replace(/[^\w\s]/g, "\\$&")}]`;
}
function q0(n) {
  let t = /* @__PURE__ */ Object.create(null), e = /* @__PURE__ */ Object.create(null);
  for (let { label: s } of n) {
    t[s[0]] = !0;
    for (let r = 1; r < s.length; r++)
      e[s[r]] = !0;
  }
  let i = ma(t) + ma(e) + "*$";
  return [new RegExp("^" + i), new RegExp(i)];
}
function _0(n) {
  let t = n.map((s) => typeof s == "string" ? { label: s } : s), [e, i] = t.every((s) => /^\w+$/.test(s.label)) ? [/\w*$/, /\w+$/] : q0(t);
  return (s) => {
    let r = s.matchBefore(i);
    return r || s.explicit ? { from: r ? r.from : s.pos, options: t, validFor: e } : null;
  };
}
class ga {
  constructor(t, e, i, s) {
    this.completion = t, this.source = e, this.match = i, this.score = s;
  }
}
function pe(n) {
  return n.selection.main.from;
}
function Pf(n, t) {
  var e;
  let { source: i } = n, s = t && i[0] != "^", r = i[i.length - 1] != "$";
  return !s && !r ? n : new RegExp(`${s ? "^" : ""}(?:${i})${r ? "$" : ""}`, (e = n.flags) !== null && e !== void 0 ? e : n.ignoreCase ? "i" : "");
}
const tb = /* @__PURE__ */ re.define();
function eb(n, t, e, i) {
  let { main: s } = n.selection, r = e - s.from, o = i - s.from;
  return Object.assign(Object.assign({}, n.changeByRange((l) => l != s && e != i && n.sliceDoc(l.from + r, l.from + o) != n.sliceDoc(e, i) ? { range: l } : {
    changes: { from: l.from + r, to: i == s.from ? l.to : l.from + o, insert: t },
    range: y.cursor(l.from + r + t.length)
  })), { userEvent: "input.complete" });
}
const ba = /* @__PURE__ */ new WeakMap();
function ib(n) {
  if (!Array.isArray(n))
    return n;
  let t = ba.get(n);
  return t || ba.set(n, t = _0(n)), t;
}
const Oo = /* @__PURE__ */ L.define(), Xi = /* @__PURE__ */ L.define();
class nb {
  constructor(t) {
    this.pattern = t, this.chars = [], this.folded = [], this.any = [], this.precise = [], this.byWord = [], this.score = 0, this.matched = [];
    for (let e = 0; e < t.length; ) {
      let i = lt(t, e), s = Bt(i);
      this.chars.push(i);
      let r = t.slice(e, e + s), o = r.toUpperCase();
      this.folded.push(lt(o == r ? r.toLowerCase() : o, 0)), e += s;
    }
    this.astral = t.length != this.chars.length;
  }
  ret(t, e) {
    return this.score = t, this.matched = e, !0;
  }
  // Matches a given word (completion) against the pattern (input).
  // Will return a boolean indicating whether there was a match and,
  // on success, set `this.score` to the score, `this.matched` to an
  // array of `from, to` pairs indicating the matched parts of `word`.
  //
  // The score is a number that is more negative the worse the match
  // is. See `Penalty` above.
  match(t) {
    if (this.pattern.length == 0)
      return this.ret(-100, []);
    if (t.length < this.pattern.length)
      return !1;
    let { chars: e, folded: i, any: s, precise: r, byWord: o } = this;
    if (e.length == 1) {
      let v = lt(t, 0), O = Bt(v), k = O == t.length ? 0 : -100;
      if (v != e[0])
        if (v == i[0])
          k += -200;
        else
          return !1;
      return this.ret(k, [0, O]);
    }
    let l = t.indexOf(this.pattern);
    if (l == 0)
      return this.ret(t.length == this.pattern.length ? 0 : -100, [0, this.pattern.length]);
    let a = e.length, h = 0;
    if (l < 0) {
      for (let v = 0, O = Math.min(t.length, 200); v < O && h < a; ) {
        let k = lt(t, v);
        (k == e[h] || k == i[h]) && (s[h++] = v), v += Bt(k);
      }
      if (h < a)
        return !1;
    }
    let c = 0, f = 0, u = !1, d = 0, p = -1, g = -1, m = /[a-z]/.test(t), b = !0;
    for (let v = 0, O = Math.min(t.length, 200), k = 0; v < O && f < a; ) {
      let w = lt(t, v);
      l < 0 && (c < a && w == e[c] && (r[c++] = v), d < a && (w == e[d] || w == i[d] ? (d == 0 && (p = v), g = v + 1, d++) : d = 0));
      let S, Z = w < 255 ? w >= 48 && w <= 57 || w >= 97 && w <= 122 ? 2 : w >= 65 && w <= 90 ? 1 : 0 : (S = jr(w)) != S.toLowerCase() ? 1 : S != S.toUpperCase() ? 2 : 0;
      (!v || Z == 1 && m || k == 0 && Z != 0) && (e[f] == w || i[f] == w && (u = !0) ? o[f++] = v : o.length && (b = !1)), k = Z, v += Bt(w);
    }
    return f == a && o[0] == 0 && b ? this.result(-100 + (u ? -200 : 0), o, t) : d == a && p == 0 ? this.ret(-200 - t.length + (g == t.length ? 0 : -100), [0, g]) : l > -1 ? this.ret(-700 - t.length, [l, l + this.pattern.length]) : d == a ? this.ret(-200 + -700 - t.length, [p, g]) : f == a ? this.result(-100 + (u ? -200 : 0) + -700 + (b ? 0 : -1100), o, t) : e.length == 2 ? !1 : this.result((s[0] ? -700 : 0) + -200 + -1100, s, t);
  }
  result(t, e, i) {
    let s = [], r = 0;
    for (let o of e) {
      let l = o + (this.astral ? Bt(lt(i, o)) : 1);
      r && s[r - 1] == o ? s[r - 1] = l : (s[r++] = o, s[r++] = l);
    }
    return this.ret(t - i.length, s);
  }
}
const At = /* @__PURE__ */ A.define({
  combine(n) {
    return qt(n, {
      activateOnTyping: !0,
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
      positionInfo: sb,
      compareCompletions: (t, e) => t.label.localeCompare(e.label),
      interactionDelay: 75
    }, {
      defaultKeymap: (t, e) => t && e,
      closeOnBlur: (t, e) => t && e,
      icons: (t, e) => t && e,
      tooltipClass: (t, e) => (i) => ya(t(i), e(i)),
      optionClass: (t, e) => (i) => ya(t(i), e(i)),
      addToOptions: (t, e) => t.concat(e)
    });
  }
});
function ya(n, t) {
  return n ? t ? n + " " + t : n : t;
}
function sb(n, t, e, i, s) {
  let r = n.textDirection == z.RTL, o = r, l = !1, a = "top", h, c, f = t.left - s.left, u = s.right - t.right, d = i.right - i.left, p = i.bottom - i.top;
  if (o && f < Math.min(d, u) ? o = !1 : !o && u < Math.min(d, f) && (o = !0), d <= (o ? f : u))
    h = Math.max(s.top, Math.min(e.top, s.bottom - p)) - t.top, c = Math.min(400, o ? f : u);
  else {
    l = !0, c = Math.min(
      400,
      (r ? t.right : s.right - t.left) - 30
      /* Margin */
    );
    let g = s.bottom - t.bottom;
    g >= p || g > t.top ? h = e.bottom - t.top : (a = "bottom", h = t.bottom - e.top);
  }
  return {
    style: `${a}: ${h}px; max-width: ${c}px`,
    class: "cm-completionInfo-" + (l ? r ? "left-narrow" : "right-narrow" : o ? "left" : "right")
  };
}
function rb(n) {
  let t = n.addToOptions.slice();
  return n.icons && t.push({
    render(e) {
      let i = document.createElement("div");
      return i.classList.add("cm-completionIcon"), e.type && i.classList.add(...e.type.split(/\s+/g).map((s) => "cm-completionIcon-" + s)), i.setAttribute("aria-hidden", "true"), i;
    },
    position: 20
  }), t.push({
    render(e, i, s) {
      let r = document.createElement("span");
      r.className = "cm-completionLabel";
      let o = e.displayLabel || e.label, l = 0;
      for (let a = 0; a < s.length; ) {
        let h = s[a++], c = s[a++];
        h > l && r.appendChild(document.createTextNode(o.slice(l, h)));
        let f = r.appendChild(document.createElement("span"));
        f.appendChild(document.createTextNode(o.slice(h, c))), f.className = "cm-completionMatchedText", l = c;
      }
      return l < o.length && r.appendChild(document.createTextNode(o.slice(l))), r;
    },
    position: 50
  }, {
    render(e) {
      if (!e.detail)
        return null;
      let i = document.createElement("span");
      return i.className = "cm-completionDetail", i.textContent = e.detail, i;
    },
    position: 80
  }), t.sort((e, i) => e.position - i.position).map((e) => e.render);
}
function xa(n, t, e) {
  if (n <= e)
    return { from: 0, to: n };
  if (t < 0 && (t = 0), t <= n >> 1) {
    let s = Math.floor(t / e);
    return { from: s * e, to: (s + 1) * e };
  }
  let i = Math.floor((n - t) / e);
  return { from: n - (i + 1) * e, to: n - i * e };
}
class ob {
  constructor(t, e, i) {
    this.view = t, this.stateField = e, this.applyCompletion = i, this.info = null, this.infoDestroy = null, this.placeInfoReq = {
      read: () => this.measureInfo(),
      write: (a) => this.placeInfo(a),
      key: this
    }, this.space = null, this.currentClass = "";
    let s = t.state.field(e), { options: r, selected: o } = s.open, l = t.state.facet(At);
    this.optionContent = rb(l), this.optionClass = l.optionClass, this.tooltipClass = l.tooltipClass, this.range = xa(r.length, o, l.maxRenderedOptions), this.dom = document.createElement("div"), this.dom.className = "cm-tooltip-autocomplete", this.updateTooltipClass(t.state), this.dom.addEventListener("mousedown", (a) => {
      for (let h = a.target, c; h && h != this.dom; h = h.parentNode)
        if (h.nodeName == "LI" && (c = /-(\d+)$/.exec(h.id)) && +c[1] < r.length) {
          this.applyCompletion(t, r[+c[1]]), a.preventDefault();
          return;
        }
    }), this.dom.addEventListener("focusout", (a) => {
      let h = t.state.field(this.stateField, !1);
      h && h.tooltip && t.state.facet(At).closeOnBlur && a.relatedTarget != t.contentDOM && t.dispatch({ effects: Xi.of(null) });
    }), this.list = this.dom.appendChild(this.createListBox(r, s.id, this.range)), this.list.addEventListener("scroll", () => {
      this.info && this.view.requestMeasure(this.placeInfoReq);
    });
  }
  mount() {
    this.updateSel();
  }
  update(t) {
    var e, i, s;
    let r = t.state.field(this.stateField), o = t.startState.field(this.stateField);
    this.updateTooltipClass(t.state), r != o && (this.updateSel(), ((e = r.open) === null || e === void 0 ? void 0 : e.disabled) != ((i = o.open) === null || i === void 0 ? void 0 : i.disabled) && this.dom.classList.toggle("cm-tooltip-autocomplete-disabled", !!(!((s = r.open) === null || s === void 0) && s.disabled)));
  }
  updateTooltipClass(t) {
    let e = this.tooltipClass(t);
    if (e != this.currentClass) {
      for (let i of this.currentClass.split(" "))
        i && this.dom.classList.remove(i);
      for (let i of e.split(" "))
        i && this.dom.classList.add(i);
      this.currentClass = e;
    }
  }
  positioned(t) {
    this.space = t, this.info && this.view.requestMeasure(this.placeInfoReq);
  }
  updateSel() {
    let t = this.view.state.field(this.stateField), e = t.open;
    if ((e.selected > -1 && e.selected < this.range.from || e.selected >= this.range.to) && (this.range = xa(e.options.length, e.selected, this.view.state.facet(At).maxRenderedOptions), this.list.remove(), this.list = this.dom.appendChild(this.createListBox(e.options, t.id, this.range)), this.list.addEventListener("scroll", () => {
      this.info && this.view.requestMeasure(this.placeInfoReq);
    })), this.updateSelectedOption(e.selected)) {
      this.destroyInfo();
      let { completion: i } = e.options[e.selected], { info: s } = i;
      if (!s)
        return;
      let r = typeof s == "string" ? document.createTextNode(s) : s(i);
      if (!r)
        return;
      "then" in r ? r.then((o) => {
        o && this.view.state.field(this.stateField, !1) == t && this.addInfoPane(o, i);
      }).catch((o) => Vt(this.view.state, o, "completion info")) : this.addInfoPane(r, i);
    }
  }
  addInfoPane(t, e) {
    this.destroyInfo();
    let i = this.info = document.createElement("div");
    if (i.className = "cm-tooltip cm-completionInfo", t.nodeType != null)
      i.appendChild(t), this.infoDestroy = null;
    else {
      let { dom: s, destroy: r } = t;
      i.appendChild(s), this.infoDestroy = r || null;
    }
    this.dom.appendChild(i), this.view.requestMeasure(this.placeInfoReq);
  }
  updateSelectedOption(t) {
    let e = null;
    for (let i = this.list.firstChild, s = this.range.from; i; i = i.nextSibling, s++)
      i.nodeName != "LI" || !i.id ? s-- : s == t ? i.hasAttribute("aria-selected") || (i.setAttribute("aria-selected", "true"), e = i) : i.hasAttribute("aria-selected") && i.removeAttribute("aria-selected");
    return e && ab(this.list, e), e;
  }
  measureInfo() {
    let t = this.dom.querySelector("[aria-selected]");
    if (!t || !this.info)
      return null;
    let e = this.dom.getBoundingClientRect(), i = this.info.getBoundingClientRect(), s = t.getBoundingClientRect(), r = this.space;
    if (!r) {
      let o = this.dom.ownerDocument.defaultView || window;
      r = { left: 0, top: 0, right: o.innerWidth, bottom: o.innerHeight };
    }
    return s.top > Math.min(r.bottom, e.bottom) - 10 || s.bottom < Math.max(r.top, e.top) + 10 ? null : this.view.state.facet(At).positionInfo(this.view, e, s, i, r);
  }
  placeInfo(t) {
    this.info && (t ? (t.style && (this.info.style.cssText = t.style), this.info.className = "cm-tooltip cm-completionInfo " + (t.class || "")) : this.info.style.cssText = "top: -1e6px");
  }
  createListBox(t, e, i) {
    const s = document.createElement("ul");
    s.id = e, s.setAttribute("role", "listbox"), s.setAttribute("aria-expanded", "true"), s.setAttribute("aria-label", this.view.state.phrase("Completions"));
    let r = null;
    for (let o = i.from; o < i.to; o++) {
      let { completion: l, match: a } = t[o], { section: h } = l;
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
      c.id = e + "-" + o, c.setAttribute("role", "option");
      let f = this.optionClass(l);
      f && (c.className = f);
      for (let u of this.optionContent) {
        let d = u(l, this.view.state, a);
        d && c.appendChild(d);
      }
    }
    return i.from && s.classList.add("cm-completionListIncompleteTop"), i.to < t.length && s.classList.add("cm-completionListIncompleteBottom"), s;
  }
  destroyInfo() {
    this.info && (this.infoDestroy && this.infoDestroy(), this.info.remove(), this.info = null);
  }
  destroy() {
    this.destroyInfo();
  }
}
function lb(n, t) {
  return (e) => new ob(e, n, t);
}
function ab(n, t) {
  let e = n.getBoundingClientRect(), i = t.getBoundingClientRect();
  i.top < e.top ? n.scrollTop -= e.top - i.top : i.bottom > e.bottom && (n.scrollTop += i.bottom - e.bottom);
}
function ka(n) {
  return (n.boost || 0) * 100 + (n.apply ? 10 : 0) + (n.info ? 5 : 0) + (n.type ? 1 : 0);
}
function hb(n, t) {
  let e = [], i = null, s = (a) => {
    e.push(a);
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
          s(new ga(c, a.source, h ? h(c) : [], 1e9 - e.length));
      else {
        let c = new nb(t.sliceDoc(a.from, a.to));
        for (let f of a.result.options)
          if (c.match(f.label)) {
            let u = f.displayLabel ? h ? h(f, c.matched) : [] : c.matched;
            s(new ga(f, a.source, u, c.score + (f.boost || 0)));
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
    for (let f of e) {
      let { section: u } = f.completion;
      u && (f.score += a[typeof u == "string" ? u : u.name]);
    }
  }
  let r = [], o = null, l = t.facet(At).compareCompletions;
  for (let a of e.sort((h, c) => c.score - h.score || l(h.completion, c.completion))) {
    let h = a.completion;
    !o || o.label != h.label || o.detail != h.detail || o.type != null && h.type != null && o.type != h.type || o.apply != h.apply || o.boost != h.boost ? r.push(a) : ka(a.completion) > ka(o) && (r[r.length - 1] = a), o = a.completion;
  }
  return r;
}
class Ye {
  constructor(t, e, i, s, r, o) {
    this.options = t, this.attrs = e, this.tooltip = i, this.timestamp = s, this.selected = r, this.disabled = o;
  }
  setSelected(t, e) {
    return t == this.selected || t >= this.options.length ? this : new Ye(this.options, wa(e, t), this.tooltip, this.timestamp, t, this.disabled);
  }
  static build(t, e, i, s, r) {
    let o = hb(t, e);
    if (!o.length)
      return s && t.some(
        (a) => a.state == 1
        /* Pending */
      ) ? new Ye(s.options, s.attrs, s.tooltip, s.timestamp, s.selected, !0) : null;
    let l = e.facet(At).selectOnOpen ? 0 : -1;
    if (s && s.selected != l && s.selected != -1) {
      let a = s.options[s.selected].completion;
      for (let h = 0; h < o.length; h++)
        if (o[h].completion == a) {
          l = h;
          break;
        }
    }
    return new Ye(o, wa(i, l), {
      pos: t.reduce((a, h) => h.hasResult() ? Math.min(a, h.from) : a, 1e8),
      create: lb(Tt, Wf),
      above: r.aboveCursor
    }, s ? s.timestamp : Date.now(), l, !1);
  }
  map(t) {
    return new Ye(this.options, this.attrs, Object.assign(Object.assign({}, this.tooltip), { pos: t.mapPos(this.tooltip.pos) }), this.timestamp, this.selected, this.disabled);
  }
}
class os {
  constructor(t, e, i) {
    this.active = t, this.id = e, this.open = i;
  }
  static start() {
    return new os(ub, "cm-ac-" + Math.floor(Math.random() * 2e6).toString(36), null);
  }
  update(t) {
    let { state: e } = t, i = e.facet(At), r = (i.override || e.languageDataAt("autocomplete", pe(e)).map(ib)).map((l) => (this.active.find((h) => h.source == l) || new Ct(
      l,
      this.active.some(
        (h) => h.state != 0
        /* Inactive */
      ) ? 1 : 0
      /* Inactive */
    )).update(t, i));
    r.length == this.active.length && r.every((l, a) => l == this.active[a]) && (r = this.active);
    let o = this.open;
    o && t.docChanged && (o = o.map(t.changes)), t.selection || r.some((l) => l.hasResult() && t.changes.touchesRange(l.from, l.to)) || !cb(r, this.active) ? o = Ye.build(r, e, this.id, o, i) : o && o.disabled && !r.some(
      (l) => l.state == 1
      /* Pending */
    ) && (o = null), !o && r.every(
      (l) => l.state != 1
      /* Pending */
    ) && r.some((l) => l.hasResult()) && (r = r.map((l) => l.hasResult() ? new Ct(
      l.source,
      0
      /* Inactive */
    ) : l));
    for (let l of t.effects)
      l.is(Bf) && (o = o && o.setSelected(l.value, this.id));
    return r == this.active && o == this.open ? this : new os(r, this.id, o);
  }
  get tooltip() {
    return this.open ? this.open.tooltip : null;
  }
  get attrs() {
    return this.open ? this.open.attrs : fb;
  }
}
function cb(n, t) {
  if (n == t)
    return !0;
  for (let e = 0, i = 0; ; ) {
    for (; e < n.length && !n[e].hasResult; )
      e++;
    for (; i < t.length && !t[i].hasResult; )
      i++;
    let s = e == n.length, r = i == t.length;
    if (s || r)
      return s == r;
    if (n[e++].result != t[i++].result)
      return !1;
  }
}
const fb = {
  "aria-autocomplete": "list"
};
function wa(n, t) {
  let e = {
    "aria-autocomplete": "list",
    "aria-haspopup": "listbox",
    "aria-controls": n
  };
  return t > -1 && (e["aria-activedescendant"] = n + "-" + t), e;
}
const ub = [];
function zr(n) {
  return n.isUserEvent("input.type") ? "input" : n.isUserEvent("delete.backward") ? "delete" : null;
}
class Ct {
  constructor(t, e, i = -1) {
    this.source = t, this.state = e, this.explicitPos = i;
  }
  hasResult() {
    return !1;
  }
  update(t, e) {
    let i = zr(t), s = this;
    i ? s = s.handleUserEvent(t, i, e) : t.docChanged ? s = s.handleChange(t) : t.selection && s.state != 0 && (s = new Ct(
      s.source,
      0
      /* Inactive */
    ));
    for (let r of t.effects)
      if (r.is(Oo))
        s = new Ct(s.source, 1, r.value ? pe(t.state) : -1);
      else if (r.is(Xi))
        s = new Ct(
          s.source,
          0
          /* Inactive */
        );
      else if (r.is(Vf))
        for (let o of r.value)
          o.source == s.source && (s = o);
    return s;
  }
  handleUserEvent(t, e, i) {
    return e == "delete" || !i.activateOnTyping ? this.map(t.changes) : new Ct(
      this.source,
      1
      /* Pending */
    );
  }
  handleChange(t) {
    return t.changes.touchesRange(pe(t.startState)) ? new Ct(
      this.source,
      0
      /* Inactive */
    ) : this.map(t.changes);
  }
  map(t) {
    return t.empty || this.explicitPos < 0 ? this : new Ct(this.source, this.state, t.mapPos(this.explicitPos));
  }
}
class qe extends Ct {
  constructor(t, e, i, s, r) {
    super(t, 2, e), this.result = i, this.from = s, this.to = r;
  }
  hasResult() {
    return !0;
  }
  handleUserEvent(t, e, i) {
    var s;
    let r = t.changes.mapPos(this.from), o = t.changes.mapPos(this.to, 1), l = pe(t.state);
    if ((this.explicitPos < 0 ? l <= r : l < this.from) || l > o || e == "delete" && pe(t.startState) == this.from)
      return new Ct(
        this.source,
        e == "input" && i.activateOnTyping ? 1 : 0
        /* Inactive */
      );
    let a = this.explicitPos < 0 ? -1 : t.changes.mapPos(this.explicitPos), h;
    return db(this.result.validFor, t.state, r, o) ? new qe(this.source, a, this.result, r, o) : this.result.update && (h = this.result.update(this.result, r, o, new Df(t.state, l, a >= 0))) ? new qe(this.source, a, h, h.from, (s = h.to) !== null && s !== void 0 ? s : pe(t.state)) : new Ct(this.source, 1, a);
  }
  handleChange(t) {
    return t.changes.touchesRange(this.from, this.to) ? new Ct(
      this.source,
      0
      /* Inactive */
    ) : this.map(t.changes);
  }
  map(t) {
    return t.empty ? this : new qe(this.source, this.explicitPos < 0 ? -1 : t.mapPos(this.explicitPos), this.result, t.mapPos(this.from), t.mapPos(this.to, 1));
  }
}
function db(n, t, e, i) {
  if (!n)
    return !1;
  let s = t.sliceDoc(e, i);
  return typeof n == "function" ? n(s, e, i, t) : Pf(n, !0).test(s);
}
const Vf = /* @__PURE__ */ L.define({
  map(n, t) {
    return n.map((e) => e.map(t));
  }
}), Bf = /* @__PURE__ */ L.define(), Tt = /* @__PURE__ */ q.define({
  create() {
    return os.start();
  },
  update(n, t) {
    return n.update(t);
  },
  provide: (n) => [
    ps.from(n, (t) => t.tooltip),
    R.contentAttributes.from(n, (t) => t.attrs)
  ]
});
function Wf(n, t) {
  const e = t.completion.apply || t.completion.label;
  let i = n.state.field(Tt).active.find((s) => s.source == t.source);
  return i instanceof qe ? (typeof e == "string" ? n.dispatch(Object.assign(Object.assign({}, eb(n.state, e, i.from, i.to)), { annotations: tb.of(t.completion) })) : e(n, t.completion, i.from, i.to), !0) : !1;
}
function yn(n, t = "option") {
  return (e) => {
    let i = e.state.field(Tt, !1);
    if (!i || !i.open || i.open.disabled || Date.now() - i.open.timestamp < e.state.facet(At).interactionDelay)
      return !1;
    let s = 1, r;
    t == "page" && (r = rc(e, i.open.tooltip)) && (s = Math.max(2, Math.floor(r.dom.offsetHeight / r.dom.querySelector("li").offsetHeight) - 1));
    let { length: o } = i.open.options, l = i.open.selected > -1 ? i.open.selected + s * (n ? 1 : -1) : n ? 0 : o - 1;
    return l < 0 ? l = t == "page" ? 0 : o - 1 : l >= o && (l = t == "page" ? o - 1 : 0), e.dispatch({ effects: Bf.of(l) }), !0;
  };
}
const pb = (n) => {
  let t = n.state.field(Tt, !1);
  return n.state.readOnly || !t || !t.open || t.open.selected < 0 || t.open.disabled || Date.now() - t.open.timestamp < n.state.facet(At).interactionDelay ? !1 : Wf(n, t.open.options[t.open.selected]);
}, mb = (n) => n.state.field(Tt, !1) ? (n.dispatch({ effects: Oo.of(!0) }), !0) : !1, gb = (n) => {
  let t = n.state.field(Tt, !1);
  return !t || !t.active.some(
    (e) => e.state != 0
    /* Inactive */
  ) ? !1 : (n.dispatch({ effects: Xi.of(null) }), !0);
};
class bb {
  constructor(t, e) {
    this.active = t, this.context = e, this.time = Date.now(), this.updates = [], this.done = void 0;
  }
}
const Sa = 50, yb = 50, xb = 1e3, kb = /* @__PURE__ */ nt.fromClass(class {
  constructor(n) {
    this.view = n, this.debounceUpdate = -1, this.running = [], this.debounceAccept = -1, this.composing = 0;
    for (let t of n.state.field(Tt).active)
      t.state == 1 && this.startQuery(t);
  }
  update(n) {
    let t = n.state.field(Tt);
    if (!n.selectionSet && !n.docChanged && n.startState.field(Tt) == t)
      return;
    let e = n.transactions.some((i) => (i.selection || i.docChanged) && !zr(i));
    for (let i = 0; i < this.running.length; i++) {
      let s = this.running[i];
      if (e || s.updates.length + n.transactions.length > yb && Date.now() - s.time > xb) {
        for (let r of s.context.abortListeners)
          try {
            r();
          } catch (o) {
            Vt(this.view.state, o);
          }
        s.context.abortListeners = null, this.running.splice(i--, 1);
      } else
        s.updates.push(...n.transactions);
    }
    if (this.debounceUpdate > -1 && clearTimeout(this.debounceUpdate), this.debounceUpdate = t.active.some((i) => i.state == 1 && !this.running.some((s) => s.active.source == i.source)) ? setTimeout(() => this.startUpdate(), Sa) : -1, this.composing != 0)
      for (let i of n.transactions)
        zr(i) == "input" ? this.composing = 2 : this.composing == 2 && i.selection && (this.composing = 3);
  }
  startUpdate() {
    this.debounceUpdate = -1;
    let { state: n } = this.view, t = n.field(Tt);
    for (let e of t.active)
      e.state == 1 && !this.running.some((i) => i.active.source == e.source) && this.startQuery(e);
  }
  startQuery(n) {
    let { state: t } = this.view, e = pe(t), i = new Df(t, e, n.explicitPos == e), s = new bb(n, i);
    this.running.push(s), Promise.resolve(n.source(i)).then((r) => {
      s.context.aborted || (s.done = r || null, this.scheduleAccept());
    }, (r) => {
      this.view.dispatch({ effects: Xi.of(null) }), Vt(this.view.state, r);
    });
  }
  scheduleAccept() {
    this.running.every((n) => n.done !== void 0) ? this.accept() : this.debounceAccept < 0 && (this.debounceAccept = setTimeout(() => this.accept(), Sa));
  }
  // For each finished query in this.running, try to create a result
  // or, if appropriate, restart the query.
  accept() {
    var n;
    this.debounceAccept > -1 && clearTimeout(this.debounceAccept), this.debounceAccept = -1;
    let t = [], e = this.view.state.facet(At);
    for (let i = 0; i < this.running.length; i++) {
      let s = this.running[i];
      if (s.done === void 0)
        continue;
      if (this.running.splice(i--, 1), s.done) {
        let o = new qe(s.active.source, s.active.explicitPos, s.done, s.done.from, (n = s.done.to) !== null && n !== void 0 ? n : pe(s.updates.length ? s.updates[0].startState : this.view.state));
        for (let l of s.updates)
          o = o.update(l, e);
        if (o.hasResult()) {
          t.push(o);
          continue;
        }
      }
      let r = this.view.state.field(Tt).active.find((o) => o.source == s.active.source);
      if (r && r.state == 1)
        if (s.done == null) {
          let o = new Ct(
            s.active.source,
            0
            /* Inactive */
          );
          for (let l of s.updates)
            o = o.update(l, e);
          o.state != 1 && t.push(o);
        } else
          this.startQuery(r);
    }
    t.length && this.view.dispatch({ effects: Vf.of(t) });
  }
}, {
  eventHandlers: {
    blur(n) {
      let t = this.view.state.field(Tt, !1);
      if (t && t.tooltip && this.view.state.facet(At).closeOnBlur) {
        let e = t.open && rc(this.view, t.open.tooltip);
        (!e || !e.dom.contains(n.relatedTarget)) && this.view.dispatch({ effects: Xi.of(null) });
      }
    },
    compositionstart() {
      this.composing = 1;
    },
    compositionend() {
      this.composing == 3 && setTimeout(() => this.view.dispatch({ effects: Oo.of(!1) }), 20), this.composing = 0;
    }
  }
}), wb = /* @__PURE__ */ R.baseTheme({
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
}), Ii = {
  brackets: ["(", "[", "{", "'", '"'],
  before: ")]}:;>",
  stringPrefixes: []
}, Le = /* @__PURE__ */ L.define({
  map(n, t) {
    let e = t.mapPos(n, -1, yt.TrackAfter);
    return e ?? void 0;
  }
}), Ao = /* @__PURE__ */ new class extends Pe {
}();
Ao.startSide = 1;
Ao.endSide = -1;
const Xf = /* @__PURE__ */ q.define({
  create() {
    return I.empty;
  },
  update(n, t) {
    if (t.selection) {
      let e = t.state.doc.lineAt(t.selection.main.head).from, i = t.startState.doc.lineAt(t.startState.selection.main.head).from;
      e != t.changes.mapPos(i, -1) && (n = I.empty);
    }
    n = n.map(t.changes);
    for (let e of t.effects)
      e.is(Le) && (n = n.update({ add: [Ao.range(e.value, e.value + 1)] }));
    return n;
  }
});
function Sb() {
  return [Cb, Xf];
}
const _s = "()[]{}<>";
function If(n) {
  for (let t = 0; t < _s.length; t += 2)
    if (_s.charCodeAt(t) == n)
      return _s.charAt(t + 1);
  return jr(n < 128 ? n : n + 1);
}
function Ef(n, t) {
  return n.languageDataAt("closeBrackets", t)[0] || Ii;
}
const vb = typeof navigator == "object" && /* @__PURE__ */ /Android\b/.test(navigator.userAgent), Cb = /* @__PURE__ */ R.inputHandler.of((n, t, e, i) => {
  if ((vb ? n.composing : n.compositionStarted) || n.state.readOnly)
    return !1;
  let s = n.state.selection.main;
  if (i.length > 2 || i.length == 2 && Bt(lt(i, 0)) == 1 || t != s.from || e != s.to)
    return !1;
  let r = Mb(n.state, i);
  return r ? (n.dispatch(r), !0) : !1;
}), Ob = ({ state: n, dispatch: t }) => {
  if (n.readOnly)
    return !1;
  let i = Ef(n, n.selection.main.head).brackets || Ii.brackets, s = null, r = n.changeByRange((o) => {
    if (o.empty) {
      let l = Rb(n.doc, o.head);
      for (let a of i)
        if (a == l && Os(n.doc, o.head) == If(lt(a, 0)))
          return {
            changes: { from: o.head - a.length, to: o.head + a.length },
            range: y.cursor(o.head - a.length)
          };
    }
    return { range: s = o };
  });
  return s || t(n.update(r, { scrollIntoView: !0, userEvent: "delete.backward" })), !s;
}, Ab = [
  { key: "Backspace", run: Ob }
];
function Mb(n, t) {
  let e = Ef(n, n.selection.main.head), i = e.brackets || Ii.brackets;
  for (let s of i) {
    let r = If(lt(s, 0));
    if (t == s)
      return r == s ? Tb(n, s, i.indexOf(s + s + s) > -1, e) : Zb(n, s, r, e.before || Ii.before);
    if (t == r && Nf(n, n.selection.main.from))
      return Lb(n, s, r);
  }
  return null;
}
function Nf(n, t) {
  let e = !1;
  return n.field(Xf).between(0, n.doc.length, (i) => {
    i == t && (e = !0);
  }), e;
}
function Os(n, t) {
  let e = n.sliceString(t, t + 2);
  return e.slice(0, Bt(lt(e, 0)));
}
function Rb(n, t) {
  let e = n.sliceString(t - 2, t);
  return Bt(lt(e, 0)) == e.length ? e : e.slice(1);
}
function Zb(n, t, e, i) {
  let s = null, r = n.changeByRange((o) => {
    if (!o.empty)
      return {
        changes: [{ insert: t, from: o.from }, { insert: e, from: o.to }],
        effects: Le.of(o.to + t.length),
        range: y.range(o.anchor + t.length, o.head + t.length)
      };
    let l = Os(n.doc, o.head);
    return !l || /\s/.test(l) || i.indexOf(l) > -1 ? {
      changes: { insert: t + e, from: o.head },
      effects: Le.of(o.head + t.length),
      range: y.cursor(o.head + t.length)
    } : { range: s = o };
  });
  return s ? null : n.update(r, {
    scrollIntoView: !0,
    userEvent: "input.type"
  });
}
function Lb(n, t, e) {
  let i = null, s = n.changeByRange((r) => r.empty && Os(n.doc, r.head) == e ? {
    changes: { from: r.head, to: r.head + e.length, insert: e },
    range: y.cursor(r.head + e.length)
  } : i = { range: r });
  return i ? null : n.update(s, {
    scrollIntoView: !0,
    userEvent: "input.type"
  });
}
function Tb(n, t, e, i) {
  let s = i.stringPrefixes || Ii.stringPrefixes, r = null, o = n.changeByRange((l) => {
    if (!l.empty)
      return {
        changes: [{ insert: t, from: l.from }, { insert: t, from: l.to }],
        effects: Le.of(l.to + t.length),
        range: y.range(l.anchor + t.length, l.head + t.length)
      };
    let a = l.head, h = Os(n.doc, a), c;
    if (h == t) {
      if (va(n, a))
        return {
          changes: { insert: t + t, from: a },
          effects: Le.of(a + t.length),
          range: y.cursor(a + t.length)
        };
      if (Nf(n, a)) {
        let u = e && n.sliceDoc(a, a + t.length * 3) == t + t + t ? t + t + t : t;
        return {
          changes: { from: a, to: a + u.length, insert: u },
          range: y.cursor(a + u.length)
        };
      }
    } else {
      if (e && n.sliceDoc(a - 2 * t.length, a) == t + t && (c = Ca(n, a - 2 * t.length, s)) > -1 && va(n, c))
        return {
          changes: { insert: t + t + t + t, from: a },
          effects: Le.of(a + t.length),
          range: y.cursor(a + t.length)
        };
      if (n.charCategorizer(a)(h) != $.Word && Ca(n, a, s) > -1 && !Db(n, a, t, s))
        return {
          changes: { insert: t + t, from: a },
          effects: Le.of(a + t.length),
          range: y.cursor(a + t.length)
        };
    }
    return { range: r = l };
  });
  return r ? null : n.update(o, {
    scrollIntoView: !0,
    userEvent: "input.type"
  });
}
function va(n, t) {
  let e = pt(n).resolveInner(t + 1);
  return e.parent && e.from == t;
}
function Db(n, t, e, i) {
  let s = pt(n).resolveInner(t, -1), r = i.reduce((o, l) => Math.max(o, l.length), 0);
  for (let o = 0; o < 5; o++) {
    let l = n.sliceDoc(s.from, Math.min(s.to, s.from + e.length + r)), a = l.indexOf(e);
    if (!a || a > -1 && i.indexOf(l.slice(0, a)) > -1) {
      let c = s.firstChild;
      for (; c && c.from == s.from && c.to - c.from > e.length + a; ) {
        if (n.sliceDoc(c.to - e.length, c.to) == e)
          return !1;
        c = c.firstChild;
      }
      return !0;
    }
    let h = s.to == t && s.parent;
    if (!h)
      break;
    s = h;
  }
  return !1;
}
function Ca(n, t, e) {
  let i = n.charCategorizer(t);
  if (i(n.sliceDoc(t - 1, t)) != $.Word)
    return t;
  for (let s of e) {
    let r = t - s.length;
    if (n.sliceDoc(r, t) == s && i(n.sliceDoc(r - 1, r)) != $.Word)
      return r;
  }
  return -1;
}
function Pb(n = {}) {
  return [
    Tt,
    At.of(n),
    kb,
    Vb,
    wb
  ];
}
const Gf = [
  { key: "Ctrl-Space", run: mb },
  { key: "Escape", run: gb },
  { key: "ArrowDown", run: /* @__PURE__ */ yn(!0) },
  { key: "ArrowUp", run: /* @__PURE__ */ yn(!1) },
  { key: "PageDown", run: /* @__PURE__ */ yn(!0, "page") },
  { key: "PageUp", run: /* @__PURE__ */ yn(!1, "page") },
  { key: "Enter", run: pb }
], Vb = /* @__PURE__ */ ri.highest(/* @__PURE__ */ lo.computeN([At], (n) => n.facet(At).defaultKeymap ? [Gf] : []));
function Bb() {
  return Xb;
}
const Wb = T.line({ class: "cm-activeLine" }), Xb = nt.fromClass(class {
  constructor(n) {
    Qi(this, "decorations");
    this.decorations = this.getDeco(n);
  }
  update(n) {
    (n.docChanged || n.selectionSet || n.focusChanged) && (this.decorations = this.getDeco(n.view));
  }
  getDeco(n) {
    let t = -1, e = [];
    if (n.hasFocus)
      for (let i of n.state.selection.ranges) {
        let s = n.lineBlockAt(i.head);
        s.from > t && (e.push(Wb.range(s.from)), t = s.from);
      }
    return T.set(e);
  }
}, {
  decorations: (n) => n.decorations
}), Ib = /* @__PURE__ */ Yr("<div><div></div><div><button>Lezer AST"), Eb = (() => [
  Up(),
  Zp(),
  Tg(),
  Tm(),
  yp(),
  vp(),
  // EditorState.allowMultipleSelections.of(true),
  bm(),
  Cc(Bm, {
    fallback: !0
  }),
  Hm(),
  Sb(),
  Pb(),
  // rectangularSelection(),
  // crosshairCursor(),
  Bb(),
  // highlightSelectionMatches(),
  lo.of([...Ab, ...T0, ...Q0, ...Ng, ...Mm, ...Gf, ...og])
])(), Nb = (n) => n === "type" ? $m() : n === "expr" ? jl() : n === "unification" ? jm() : jl(), Gb = (n) => {
  const t = Nb(n.lang), e = () => {
    if (!s)
      return;
    const r = s.getCurrentText(), o = t.language.parser.parse(r), l = sa(o, r);
    console.log(l);
  };
  let i, s = null;
  return Jf(() => {
    if (!i)
      throw Error("editorElt not defined");
    const r = new R({
      doc: n.children,
      extensions: [
        Eb,
        t,
        _m,
        // selectionPanelPlugin(),
        yg(),
        ...n.extensions || []
      ],
      parent: i
    }), o = () => r.state.doc.toString();
    s = {
      getCurrentText: o,
      clearErrors: () => {
        r.dispatch({
          effects: [Hc.of(null)]
        });
      },
      getPrettyAst: () => {
        const l = o(), a = t.language.parser.parse(l);
        return sa(a, l);
      },
      addError: (l) => {
        r.dispatch({
          effects: [Gc.of(l)]
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
    const r = Ib(), o = r.firstChild, l = o.nextSibling, a = l.firstChild, h = i;
    return typeof h == "function" ? iu(h, o) : i = o, a.$$click = e, r;
  })();
};
eu(["click"]);
const Hb = ([n, t], [e, i]) => e >= n && i < t, Fb = (n, t) => {
  const { tree: e, subTrees: i } = t;
  function s(r, o) {
    for (let l of i(o))
      if (Hb(l.span, r))
        return s(r, l);
    return o;
  }
  return s(n, e);
}, zb = (n) => n.tag === "BinExpr" ? [
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
] : [], Kb = (n, t) => {
  let e;
  return () => {
    clearTimeout(e), e = setTimeout(() => {
      t();
    }, n);
  };
};
function Yb(n, t) {
  let e = null;
  const i = Kb(400, async () => {
    const o = n();
    if (!o)
      return;
    const l = o.getCurrentText(), a = await t(l);
    if (o.clearErrors(), console.log(a), a.tag === "result")
      e = a.tree;
    else {
      e = null;
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
      e = null, i();
    },
    infoAt: (o) => {
      if (e === null)
        return null;
      const { from: l, to: a } = o;
      return Fb([l, a], e);
    }
  };
}
const Jb = T.mark({ class: "cm-underline" });
function Qb(n, t) {
  return [
    nt.fromClass(class {
      constructor(i) {
        Qi(this, "decorations");
        this.decorations = T.set([]), n();
      }
      updateInfo(i) {
        const s = t(i.selection.main);
        if (s) {
          const [r, o] = s.span;
          this.decorations = T.set([{ from: r, to: o, value: Jb }]);
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
function Ub(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var $b = function(t) {
  for (var e = [], i = 1; i < arguments.length; i++)
    e[i - 1] = arguments[i];
  var s = [], r = typeof t == "string" ? [t] : t.slice();
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
  for (var c = r[0], o = 0; o < e.length; o++)
    c += e[o] + r[o + 1];
  return c;
};
const jb = /* @__PURE__ */ Ub($b), qb = /* @__PURE__ */ Yr('<div class="top">'), _b = /* @__PURE__ */ Yr('<div class="bottom"><pre class="resultType"><code></code></pre><div class="bottom-split"><div class="bottom-split-left"><pre class="resultExpr"><code></code></pre></div><div class="bottom-split-right"><pre class="resultSubst"><code></code></pre><pre class="resultActions"><code>'), ty = (n) => {
  const [t, e] = Ui(""), [i, s] = Ui(""), [r, o] = Ui(""), [l, a] = Ui("");
  let h = null;
  const {
    handleDocChanged: c,
    infoAt: f
  } = Yb(() => h, async (u) => {
    const d = await n.workerApi.runInferAbstract({
      inputText: u
    });
    return d.data.outputExpr ? {
      tag: "result",
      tree: {
        subTrees: zb,
        tree: d.data.outputExpr
      }
    } : {
      tag: "error",
      error: d.data.outputError
    };
  });
  return [(() => {
    const u = qb();
    return Ne(u, Da(Gb, {
      onReady: (d) => {
        h = d;
      },
      get extensions() {
        return [Qb(c, f)];
      },
      get children() {
        return jb(n.children);
      }
    })), u;
  })(), (() => {
    const u = _b(), d = u.firstChild, p = d.firstChild, g = d.nextSibling, m = g.firstChild, b = m.firstChild, v = b.firstChild, O = m.nextSibling, k = O.firstChild, w = k.firstChild, S = k.nextSibling, Z = S.firstChild;
    return Ne(p, i), Ne(v, t), Ne(w, r), Ne(Z, l), u;
  })()];
};
function ay(n) {
  console.log(n);
}
const ey = {
  async toUpper(n) {
    return pi("toUpper", n);
  },
  async runParse(n) {
    return pi("runParse", n);
  },
  async runParseType(n) {
    return pi("runParseType", n);
  },
  async runInferAbstract(n) {
    return pi("runInferAbstract", n);
  },
  async runUnify(n) {
    return pi("runUnify", n);
  }
};
function hy(n, t) {
  tu(() => Da(ty, {
    workerApi: ey,
    children: t
  }), n);
}
let ls, Kr;
function cy() {
  ls = new su(), Kr = new Promise((n) => {
    ls.onmessage = (t) => {
      const e = t.data;
      e.tag === "workerReady" && (console.log("worker is ready"), n(e));
    };
  });
}
function iy(n) {
  const t = Kr.then(() => new Promise((e) => {
    console.log("[main] sending request to worker", n), ls.postMessage(n), ls.onmessage = (i) => e(i.data);
  }));
  return Kr = t, t;
}
function pi(n, t) {
  return new Promise(async (e, i) => {
    const r = await iy({
      tag: n,
      data: t
    });
    r.tag === "workerResult" ? e(r) : (console.error(`expected workerResult, received ${r.tag}`), i());
  });
}
export {
  cy as initWorker,
  ay as log,
  hy as makeTypeInferenceDemo,
  ey as workerApi
};
