"use strict";
var Tonal = (() => {
    var dt = Object.defineProperty;
    var Xn = Object.getOwnPropertyDescriptor;
    var Qn = Object.getOwnPropertyNames;
    var Jn = Object.prototype.hasOwnProperty;
    var pt = (t, n) => {
            for (var e in n) dt(t, e, { get: n[e], enumerable: !0 });
        },
        Yn = (t, n, e, r) => {
            if ((n && typeof n == "object") || typeof n == "function") for (let o of Qn(n)) !Jn.call(t, o) && o !== e && dt(t, o, { get: () => n[o], enumerable: !(r = Xn(n, o)) || r.enumerable });
            return t;
        };
    var Wn = (t) => Yn(dt({}, "__esModule", { value: !0 }), t);
    var fa = {};
    pt(fa, {
        AbcNotation: () => nn,
        Array: () => bt,
        Chord: () => fn,
        ChordDictionary: () => ua,
        ChordType: () => Nt,
        Collection: () => an,
        Core: () => tt,
        DurationValue: () => dn,
        Interval: () => Mn,
        Key: () => wn,
        Midi: () => bn,
        Mode: () => $n,
        Note: () => Tn,
        PcSet: () => ca,
        Pcset: () => It,
        Progression: () => kn,
        Range: () => Gn,
        RomanNumeral: () => En,
        Scale: () => Un,
        ScaleDictionary: () => la,
        ScaleType: () => jt,
        TimeSignature: () => Kn,
        Tonal: () => sa,
        accToAlt: () => _,
        altToAcc: () => E,
        coordToInterval: () => G,
        coordToNote: () => vt,
        decode: () => Z,
        deprecate: () => f,
        distance: () => b,
        encode: () => W,
        fillStr: () => $,
        interval: () => l,
        isNamed: () => k,
        isPitch: () => q,
        note: () => s,
        stepToLetter: () => ht,
        tokenizeInterval: () => yt,
        tokenizeNote: () => H,
        tonicIntervalsTransposer: () => D,
        transpose: () => u,
    });
    var tt = {};
    pt(tt, {
        accToAlt: () => _,
        altToAcc: () => E,
        coordToInterval: () => G,
        coordToNote: () => vt,
        decode: () => Z,
        deprecate: () => f,
        distance: () => b,
        encode: () => W,
        fillStr: () => $,
        interval: () => l,
        isNamed: () => k,
        isPitch: () => q,
        note: () => s,
        stepToLetter: () => ht,
        tokenizeInterval: () => yt,
        tokenizeNote: () => H,
        tonicIntervalsTransposer: () => D,
        transpose: () => u,
    });
    var $ = (t, n) => Array(Math.abs(n) + 1).join(t);
    function f(t, n, e) {
        return function (...r) {
            return console.warn(`${t} is deprecated. Use ${n}.`), e.apply(this, r);
        };
    }
    function k(t) {
        return t !== null && typeof t == "object" && typeof t.name == "string";
    }
    function q(t) {
        return t !== null && typeof t == "object" && typeof t.step == "number" && typeof t.alt == "number";
    }
    var Xt = [0, 2, 4, -1, 1, 3, 5],
        Qt = Xt.map((t) => Math.floor((t * 7) / 12));
    function W(t) {
        let { step: n, alt: e, oct: r, dir: o = 1 } = t,
            a = Xt[n] + 7 * e;
        if (r === void 0) return [o * a];
        let i = r - Qt[n] - 4 * e;
        return [o * a, o * i];
    }
    var Zn = [3, 0, 4, 1, 5, 2, 6];
    function Z(t) {
        let [n, e, r] = t,
            o = Zn[te(n)],
            a = Math.floor((n + 1) / 7);
        if (e === void 0) return { step: o, alt: a, dir: r };
        let i = e + 4 * a + Qt[o];
        return { step: o, alt: a, oct: i, dir: r };
    }
    function te(t) {
        let n = (t + 1) % 7;
        return n < 0 ? 7 + n : n;
    }
    var Jt = { empty: !0, name: "", pc: "", acc: "" },
        Ut = new Map(),
        ht = (t) => "CDEFGAB".charAt(t),
        E = (t) => (t < 0 ? $("b", -t) : $("#", t)),
        _ = (t) => (t[0] === "b" ? -t.length : t.length);
    function s(t) {
        let n = JSON.stringify(t),
            e = Ut.get(n);
        if (e) return e;
        let r = typeof t == "string" ? re(t) : q(t) ? s(oe(t)) : k(t) ? s(t.name) : Jt;
        return Ut.set(n, r), r;
    }
    var ne = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/;
    function H(t) {
        let n = ne.exec(t);
        return [n[1].toUpperCase(), n[2].replace(/x/g, "##"), n[3], n[4]];
    }
    function vt(t) {
        return s(Z(t));
    }
    var ee = (t, n) => ((t % n) + n) % n,
        Pt = [0, 2, 4, 5, 7, 9, 11];
    function re(t) {
        let n = H(t);
        if (n[0] === "" || n[3] !== "") return Jt;
        let e = n[0],
            r = n[1],
            o = n[2],
            a = (e.charCodeAt(0) + 3) % 7,
            i = _(r),
            m = o.length ? +o : void 0,
            c = W({ step: a, alt: i, oct: m }),
            P = e + r + o,
            h = e + r,
            j = (Pt[a] + i + 120) % 12,
            d = m === void 0 ? ee(Pt[a] + i, 12) - 12 * 99 : Pt[a] + i + 12 * (m + 1),
            x = d >= 0 && d <= 127 ? d : null,
            C = m === void 0 ? null : Math.pow(2, (d - 69) / 12) * 440;
        return { empty: !1, acc: r, alt: i, chroma: j, coord: c, freq: C, height: d, letter: e, midi: x, name: P, oct: m, pc: h, step: a };
    }
    function oe(t) {
        let { step: n, alt: e, oct: r } = t,
            o = ht(n);
        if (!o) return "";
        let a = o + E(e);
        return r || r === 0 ? a + r : a;
    }
    var Mt = { empty: !0, name: "", acc: "" },
        ae = "([-+]?\\d+)(d{1,4}|m|M|P|A{1,4})",
        ie = "(AA|A|P|M|m|d|dd)([-+]?\\d+)",
        me = new RegExp("^" + ae + "|" + ie + "$");
    function yt(t) {
        let n = me.exec(`${t}`);
        return n === null ? ["", ""] : n[1] ? [n[1], n[2]] : [n[4], n[3]];
    }
    var Ht = {};
    function l(t) {
        return typeof t == "string" ? Ht[t] || (Ht[t] = se(t)) : q(t) ? l(ue(t)) : k(t) ? l(t.name) : Mt;
    }
    var Kt = [0, 2, 4, 5, 7, 9, 11],
        Yt = "PMMPPMM";
    function se(t) {
        let n = yt(t);
        if (n[0] === "") return Mt;
        let e = +n[0],
            r = n[1],
            o = (Math.abs(e) - 1) % 7,
            a = Yt[o];
        if (a === "M" && r === "P") return Mt;
        let i = a === "M" ? "majorable" : "perfectable",
            m = "" + e + r,
            c = e < 0 ? -1 : 1,
            P = e === 8 || e === -8 ? e : c * (o + 1),
            h = ce(i, r),
            j = Math.floor((Math.abs(e) - 1) / 7),
            d = c * (Kt[o] + h + 12 * j),
            x = (((c * (Kt[o] + h)) % 12) + 12) % 12,
            C = W({ step: o, alt: h, oct: j, dir: c });
        return { empty: !1, name: m, num: e, q: r, step: o, alt: h, dir: c, type: i, simple: P, semitones: d, chroma: x, coord: C, oct: j };
    }
    function G(t, n) {
        let [e, r = 0] = t,
            o = e * 7 + r * 12 < 0,
            a = n || o ? [-e, -r, -1] : [e, r, 1];
        return l(Z(a));
    }
    function ce(t, n) {
        return (n === "M" && t === "majorable") || (n === "P" && t === "perfectable") ? 0 : n === "m" && t === "majorable" ? -1 : /^A+$/.test(n) ? n.length : /^d+$/.test(n) ? -1 * (t === "perfectable" ? n.length : n.length + 1) : 0;
    }
    function ue(t) {
        let { step: n, alt: e, oct: r = 0, dir: o } = t;
        if (!o) return "";
        let a = n + 1 + 7 * r,
            i = a === 0 ? n + 1 : a,
            m = o < 0 ? "-" : "",
            c = Yt[n] === "M" ? "majorable" : "perfectable";
        return m + i + le(c, e);
    }
    function le(t, n) {
        return n === 0 ? (t === "majorable" ? "M" : "P") : n === -1 && t === "majorable" ? "m" : n > 0 ? $("A", n) : $("d", t === "perfectable" ? n : n + 1);
    }
    function u(t, n) {
        let e = s(t),
            r = Array.isArray(n) ? n : l(n).coord;
        if (e.empty || !r || r.length < 2) return "";
        let o = e.coord,
            a = o.length === 1 ? [o[0] + r[0]] : [o[0] + r[0], o[1] + r[1]];
        return vt(a).name;
    }
    function D(t, n) {
        let e = t.length;
        return (r) => {
            if (!n) return "";
            let o = r < 0 ? (e - (-r % e)) % e : r % e,
                a = Math.floor(r / e),
                i = u(n, [0, a]);
            return u(i, t[o]);
        };
    }
    function b(t, n) {
        let e = s(t),
            r = s(n);
        if (e.empty || r.empty) return "";
        let o = e.coord,
            a = r.coord,
            i = a[0] - o[0],
            m = o.length === 2 && a.length === 2 ? a[1] - o[1] : -Math.floor((i * 7) / 12),
            c = r.height === e.height && r.midi !== null && e.midi !== null && e.step > r.step;
        return G([i, m], c).name;
    }
    var Wt = (t, n) => Array(n + 1).join(t),
        fe = /^(_{1,}|=|\^{1,}|)([abcdefgABCDEFG])([,']*)$/;
    function Zt(t) {
        let n = fe.exec(t);
        return n ? [n[1], n[2], n[3]] : ["", "", ""];
    }
    function nt(t) {
        let [n, e, r] = Zt(t);
        if (e === "") return "";
        let o = 4;
        for (let i = 0; i < r.length; i++) o += r.charAt(i) === "," ? -1 : 1;
        let a = n[0] === "_" ? n.replace(/_/g, "b") : n[0] === "^" ? n.replace(/\^/g, "#") : "";
        return e.charCodeAt(0) > 96 ? e.toUpperCase() + a + (o + 1) : e + a + o;
    }
    function tn(t) {
        let n = s(t);
        if (n.empty || (!n.oct && n.oct !== 0)) return "";
        let { letter: e, acc: r, oct: o } = n,
            a = r[0] === "b" ? r.replace(/b/g, "_") : r.replace(/#/g, "^"),
            i = o > 4 ? e.toLowerCase() : e,
            m = o === 5 ? "" : o > 4 ? Wt("'", o - 5) : Wt(",", 4 - o);
        return a + i + m;
    }
    function de(t, n) {
        return tn(u(nt(t), n));
    }
    function pe(t, n) {
        return b(nt(t), nt(n));
    }
    var nn = { abcToScientificNotation: nt, scientificToAbcNotation: tn, tokenize: Zt, transpose: de, distance: pe };
    var bt = {};
    pt(bt, { compact: () => ye, permutations: () => rn, range: () => he, rotate: () => ve, shuffle: () => Ae, sortedNoteNames: () => en, sortedUniqNoteNames: () => be });
    var ha = Array.isArray;
    function Pe(t, n) {
        let e = [];
        for (; n--; e[n] = n + t);
        return e;
    }
    function Me(t, n) {
        let e = [];
        for (; n--; e[n] = t - n);
        return e;
    }
    function he(t, n) {
        return t < n ? Pe(t, n - t + 1) : Me(t, t - n + 1);
    }
    function ve(t, n) {
        let e = n.length,
            r = ((t % e) + e) % e;
        return n.slice(r, e).concat(n.slice(0, r));
    }
    function ye(t) {
        return t.filter((n) => n === 0 || n);
    }
    function en(t) {
        return t
            .map((e) => s(e))
            .filter((e) => !e.empty)
            .sort((e, r) => e.height - r.height)
            .map((e) => e.name);
    }
    function be(t) {
        return en(t).filter((n, e, r) => e === 0 || n !== r[e - 1]);
    }
    function Ae(t, n = Math.random) {
        let e,
            r,
            o = t.length;
        for (; o; ) (e = Math.floor(n() * o--)), (r = t[o]), (t[o] = t[e]), (t[e] = r);
        return t;
    }
    function rn(t) {
        return t.length === 0
            ? [[]]
            : rn(t.slice(1)).reduce(
                  (n, e) =>
                      n.concat(
                          t.map((r, o) => {
                              let a = e.slice();
                              return a.splice(o, 0, t[0]), a;
                          })
                      ),
                  []
              );
    }
    function ge(t, n) {
        let e = [];
        for (; n--; e[n] = n + t);
        return e;
    }
    function Ie(t, n) {
        let e = [];
        for (; n--; e[n] = t - n);
        return e;
    }
    function w(t, n) {
        return t < n ? ge(t, n - t + 1) : Ie(t, t - n + 1);
    }
    function N(t, n) {
        let e = n.length,
            r = ((t % e) + e) % e;
        return n.slice(r, e).concat(n.slice(0, r));
    }
    function K(t) {
        return t.filter((n) => n === 0 || n);
    }
    function Ne(t, n = Math.random) {
        let e,
            r,
            o = t.length;
        for (; o; ) (e = Math.floor(n() * o--)), (r = t[o]), (t[o] = t[e]), (t[e] = r);
        return t;
    }
    function on(t) {
        return t.length === 0
            ? [[]]
            : on(t.slice(1)).reduce(
                  (n, e) =>
                      n.concat(
                          t.map((r, o) => {
                              let a = e.slice();
                              return a.splice(o, 0, t[0]), a;
                          })
                      ),
                  []
              );
    }
    var an = { compact: K, permutations: on, range: w, rotate: N, shuffle: Ne };
    var A = { empty: !0, name: "", setNum: 0, chroma: "000000000000", normalized: "000000000000", intervals: [] },
        At = (t) => Number(t).toString(2),
        mn = (t) => parseInt(t, 2),
        Se = /^[01]{12}$/;
    function et(t) {
        return Se.test(t);
    }
    var Te = (t) => typeof t == "number" && t >= 0 && t <= 4095,
        je = (t) => t && et(t.chroma),
        sn = { [A.chroma]: A };
    function p(t) {
        let n = et(t) ? t : Te(t) ? At(t) : Array.isArray(t) ? $e(t) : je(t) ? t.chroma : A.chroma;
        return (sn[n] = sn[n] || Re(n));
    }
    var xe = f("Pcset.pcset", "Pcset.get", p),
        gt = (t) => p(t).chroma,
        Ce = (t) => p(t).intervals,
        Ee = (t) => p(t).setNum,
        De = ["1P", "2m", "2M", "3m", "3M", "4P", "5d", "5P", "6m", "6M", "7m", "7M"];
    function _e(t) {
        let n = [];
        for (let e = 0; e < 12; e++) t.charAt(e) === "1" && n.push(De[e]);
        return n;
    }
    function we() {
        return w(2048, 4095).map(At);
    }
    function X(t, n = !0) {
        let r = p(t).chroma.split("");
        return K(
            r.map((o, a) => {
                let i = N(a, r);
                return n && i[0] === "0" ? null : i.join("");
            })
        );
    }
    function Fe(t, n) {
        return p(t).setNum === p(n).setNum;
    }
    function L(t) {
        let n = p(t).setNum;
        return (e) => {
            let r = p(e).setNum;
            return n && n !== r && (r & n) === r;
        };
    }
    function B(t) {
        let n = p(t).setNum;
        return (e) => {
            let r = p(e).setNum;
            return n && n !== r && (r | n) === r;
        };
    }
    function cn(t) {
        let n = p(t);
        return (e) => {
            let r = s(e);
            return n && !r.empty && n.chroma.charAt(r.chroma) === "1";
        };
    }
    function Ve(t) {
        let n = cn(t);
        return (e) => e.filter(n);
    }
    var It = { get: p, chroma: gt, num: Ee, intervals: Ce, chromas: we, isSupersetOf: B, isSubsetOf: L, isNoteIncludedIn: cn, isEqual: Fe, filter: Ve, modes: X, pcset: xe };
    function Oe(t) {
        let n = t.split("");
        return n.map((e, r) => N(r, n).join(""));
    }
    function Re(t) {
        let n = mn(t),
            e = Oe(t)
                .map(mn)
                .filter((a) => a >= 2048)
                .sort()[0],
            r = At(e),
            o = _e(t);
        return { empty: !1, name: "", setNum: n, chroma: t, normalized: r, intervals: o };
    }
    function $e(t) {
        if (t.length === 0) return A.chroma;
        let n,
            e = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (let r = 0; r < t.length; r++) (n = s(t[r])), n.empty && (n = l(t[r])), n.empty || (e[n.chroma] = 1);
        return e.join("");
    }
    var ke = [
/* Dur tonika */
            ["1P 3M 5P", "major", ""],
            ["1P 3M 5P 7M", "major seventh", "maj7"],
            ["1P 3M 5P 7M 9M", "major ninth", "maj9"],
            ["1P 3M 5P 7M 9M 13M", "major thirteenth", "maj13"],
            ["1P 3M 5P 6M", "sixth", "6 add6 add13 M6"],
            ["1P 3M 5P 6M 9M", "sixth/ninth", "6/9 69 69"],
            ["1P 3M 5P 7M 11A", "major seventh sharp eleventh", "maj7(#11)"],
            ["1P 3M 5A 7M", "augmented seventh", "maj7#5 maj7+5 +maj7 ^7#5"],
            ["1P 3M 5P 7M 9M 11A", "major sharp eleventh (lydian)", "maj9#11 \u03949#11 ^9#11"],
            ["1P 3M 5A 7M 9M", "", "maj9#5 Maj9#5"],
            ["1P 3M 5P 6M 7M 9M", "", "maj7(add13)"],
            ["1P 3M 5P 7M 13M ", "", "maj7(add13)"],
            ["1P 3M 5P 7M 9A 11A", "", "maj7#9#11"],
            ["1P 3M 5P 7M 9M 11A 13M", "", "maj13(#11) M13+4 M13#4"],
            ["1P 3M 7M 9M 11A 13M", "", "maj13(#11)"],
            ["1P 3M 5P 7M 9m", "", "maj7b9"],
            ["1P 3M 5d 7M", "", "maj7b5"],
            ["1P 3M 5d 7M 9M", "", "maj9b5"],
            ["1P 3M 5P 6m 7M", "", "maj7(b13)"],

/* Moll */
            ["1P 3m 5P", "minor", "m"],
            ["1P 3m 5P 7m", "minor seventh", "m7"],
            ["1P 3m 5P 7M", "minor/major seventh", "m(maj7)"],
            ["1P 3m 5P 6M", "minor sixth", "m6 -6"],
            ["1P 3m 5P 7m 9M", "minor ninth", "m9 -9"],
            ["1P 3m 5P 7M 9M", "minor/major ninth", "m(maj9)"],
            ["1P 3m 5P 7m 9M 11P", "minor eleventh", "m11 -11"],
            ["1P 3m 5P 7m 9M 13M", "minor thirteenth", "m13 -13"],
            ["1P 3m 5P 7m 13M", "minor thirteenth", "m13 -13"],
            ["1P 3m 5P 7m 11P 13m", "", "m11(b13)"],
            ["1P 3m 5P 7M 9M 13M", "minor/major thirteenth", "m(maj13)"],
            ["1P 3m 5P 7M 13M", "", "m(maj13)"],
            ["1P 3m 5d", "diminished", "dim \xB0 o"],
            ["1P 3m 5d 7d", "diminished seventh", "dim7 \xB07 o7"],
            ["1P 3m 5d 7m", "half-diminished", "m7b5 \xF8 -7b5 h7 h"],

/* Dominantackord */
            ["1P 3M 5P 7m", "dominant seventh", "7 dom"],
            ["1P 3M 5P 7m 9M", "dominant ninth", "9"],
            ["1P 3M 5P 7m 9M 13M", "dominant thirteenth", "13"],
            ["1P 3M 5P 7m 11A", "lydian dominant seventh", "7#11 7#4"],
            ["1P 3M 5P 7m 9m", "dominant flat ninth", "7(b9)"],
            ["1P 3M 5P 7m 9A", "dominant sharp ninth", "7(#9)"],
            ["1P 3M 5A 7m", "", "7#5 +7 7+ 7aug aug7"],
            ["1P 3M 5A 7m 9A", "", "7#5#9 7#9#5 7alt"],
            ["1P 3M 5A 7m 9M", "", "9#5 9+"],
            ["1P 3M 5A 7m 9M 11A", "", "9(#5#11)"],
            ["1P 3M 5A 7m 9m", "", "7#5b9 7b9#5"],
            ["1P 3M 5A 7m 9m 11A", "", "7#5b9#11"],
            ["1P 3M 5P 7m 11A 13m", "", "7#11b13 7b5b13"],
            ["1P 3M 5P 7m 13M", "", "7add13"],
            ["1P 3M 5P 7m 9A 11A", "", "7#9#11 7b5#9 7#9b5"],
            ["1P 3M 5P 7m 9A 11A 13M", "", "13#9#11"],
            ["1P 3M 5P 7m 9A 11A 13m", "", "7#9#11b13"],
            ["1P 3M 5P 7m 9A 13M", "", "13#9"],
            ["1P 3M 5P 7m 9A 13m", "", "7#9b13"],
            ["1P 3M 5P 7m 9M 11A", "", "9#11 9+4 9#4"],
            ["1P 3M 5P 7m 9M 11A 13M", "", "13#11 13+4 13#4"],
            ["1P 3M 5P 7m 11A 13M", "", "13(#11) 13+4 13#4"],
            ["1P 3M 5P 7m 9M 11A 13m", "", "9#11b13 9b5b13"],
            ["1P 3M 5P 7m 9m 11A", "", "7b9#11 7b5b9 7b9b5"],
            ["1P 3M 5P 7m 9m 11A 13M", "", "13b9#11"],
            ["1P 3M 5P 7m 9m 11A 13m", "", "7b9b13#11 7b9#11b13 7b5b9b13"],
            ["1P 3M 5P 7m 9m 13M", "", "13b9"],
            ["1P 3M 5P 7m 9m 13m", "", "7b9b13"],
            ["1P 3M 5P 7m 9m 9A", "", "7b9#9"],
            ["1P 3M 5d 6M 7m 9M", "", "13b5"],
            ["1P 3M 5d 7m", "", "7b5"],
            ["1P 3M 5d 7m 9M", "", "9b5"],
            ["1P 3M 7m 13m", "", "7b13"],
            ["1P 3M 5P 6m 7m", "", "7(b13)"],
            ["1P 3M 5P 7m 13m", "", "7(b13)"],
            ["1P 3M 7m 9M 13m", "", "9b13"],
            ["1P 3M 5P 7m 9M 13m", "", "9(b13)"],

            ["1P 4P 5P", "suspended fourth", "sus4 sus"],
            ["1P 2M 5P", "suspended second", "sus2"],
            ["1P 4P 5P 7m", "suspended fourth seventh", "7sus4 7sus"],
            ["1P 5P 7m 9M 11P", "eleventh", "11"],
            ["1P 4P 5P 7m 9m", "suspended fourth flat ninth", "b9sus phryg 7b9sus 7b9sus4"],
            ["1P 5P", "fifth", "5"],
            ["1P 3M 5A", "augmented", "#5 aug + +5 ^#5"],
            ["1P 3m 5A", "minor augmented", "m#5 -#5 m+"],
            ["1P 2M 4P 5P", "", "sus24 sus4add9"],
            ["1P 3M 5A 9A", "", "+add#9"],
            ["1P 3M 5A 9M", "", "#5add9 +add9"],
            ["1P 3M 5P 6M 11A", "", "6#11 6#11 6b5"],
            ["1P 3M 5P 6M 9M 11A", "", "69#11"],
            ["1P 3m 5P 6M 9M", "", "m69 -69"],
            ["1P 3M 5P 9M", "", "(add9) add2"],
            ["1P 3M 5P 9m", "", "(addb9)"],
            ["1P 3M 5d", "", "b5"],
            ["1P 3m 4P 5P", "", "madd4"],
            ["1P 3m 5P 6m 7M", "", "m(maj7b13)"],
            ["1P 3m 5P 6m 7M 9M", "", "m(maj9b6)"],
            ["1P 3m 5P 7m 11P", "", "m7add11 m7add4"],
            ["1P 3m 5P 9M", "", "m(add9)"],
            ["1P 3m 5d 6M 7M", "", "o7maj7"],
            ["1P 3m 5d 7M", "", "omaj7"],
            ["1P 3m 6m 7M", "", "mb6(maj7)"],
            ["1P 3m 6m 7m", "", "m7#5"],
            ["1P 3m 6m 7m 9M", "", "m9#5"],
            ["1P 3m 6m 9m", "", "mb6b9"],
            ["1P 2M 3m 5d 7m", "", "m9b5"],
            ["1P 4P 5A 7M", "", "maj7#5sus4"],
            ["1P 4P 5A 7M 9M", "", "maj9#5sus4"],
            ["1P 4P 5A 7m", "", "7#5sus4"],
            ["1P 4P 5P 7M", "", "maj7sus4"],
            ["1P 4P 5P 7M 9M", "", "maj9sus4"],
            ["1P 4P 5P 7m 9M", "", "9sus4 9sus"],
            ["1P 4P 5P 7m 9M 13M", "", "13sus4 13sus"],
            ["1P 4P 5P 7m 9m 13m", "", "7sus4b9b13 7b9b13sus4"],
            ["1P 5P 7m 9m 11P", "", "11b9"],
        ],
        qe = ke,
        Ge = { ...A, name: "", quality: "Unknown", intervals: [], aliases: [] },
        z = [],
        F = {};
    function rt(t) {
        return F[t] || Ge;
    }
    var Le = f("ChordType.chordType", "ChordType.get", rt);
    function Be() {
        return z.map((t) => t.name).filter((t) => t);
    }
    function ze() {
        return z.map((t) => t.aliases[0]).filter((t) => t);
    }
    function Ue() {
        return Object.keys(F);
    }
    function S() {
        return z.slice();
    }
    var He = f("ChordType.entries", "ChordType.all", S);
    function Ke() {
        (z = []), (F = {});
    }
    function un(t, n, e) {
        let r = Qe(t),
            o = { ...p(t), name: e || "", quality: r, intervals: t, aliases: n };
        z.push(o), o.name && (F[o.name] = o), (F[o.setNum] = o), (F[o.chroma] = o), o.aliases.forEach((a) => Xe(o, a));
    }
    function Xe(t, n) {
        F[n] = t;
    }
    function Qe(t) {
        let n = (e) => t.indexOf(e) !== -1;
        return n("5A") ? "Augmented" : n("3M") ? "Major" : n("5d") ? "Diminished" : n("3m") ? "Minor" : "Unknown";
    }
    qe.forEach(([t, n, e]) => un(t.split(" "), e.split(" "), n));
    z.sort((t, n) => t.setNum - n.setNum);
    var Nt = { names: Be, symbols: ze, get: rt, all: S, add: un, removeAll: Ke, keys: Ue, entries: He, chordType: Le };
    var Je = (t) => {
        let n = t.reduce((e, r) => {
            let o = s(r).chroma;
            return o !== void 0 && (e[o] = e[o] || s(r).name), e;
        }, {});
        return (e) => n[e];
    };
    function St(t, n = {}) {
        let e = t.map((o) => s(o).pc).filter((o) => o);
        return s.length === 0
            ? []
            : rr(e, 1, n)
                  .filter((o) => o.weight)
                  .sort((o, a) => a.weight - o.weight)
                  .map((o) => o.name);
    }
    var ot = { anyThirds: 384, perfectFifth: 16, nonPerfectFifths: 40, anySeventh: 3 },
        at = (t) => (n) => Boolean(n & t),
        Ye = at(ot.anyThirds),
        We = at(ot.perfectFifth),
        Ze = at(ot.anySeventh),
        tr = at(ot.nonPerfectFifths);
    function nr(t) {1
        let n = parseInt(t.chroma, 2);
        return Ye(n) && We(n) && Ze(n);
    }
    function er(t) {
        let n = parseInt(t, 2);
        return tr(n) ? t : (n | 16).toString(2);
    }
    function rr(t, n, e) {
        let r = t[0],
            o = s(r).chroma,
            a = Je(t),
            i = X(t, !1),
            m = [];
        return (
            i.forEach((c, P) => {
                let h = e.assumePerfectFifth && er(c);
                S()
                    .filter((d) => (e.assumePerfectFifth && nr(d) ? d.chroma === h : d.chroma === c))
                    .forEach((d) => {
                        let x = d.aliases[0],
                            C = a(P);
                        P !== o ? m.push({ weight: 0.5 * n, name: `${C}${x}/${r}` }) : m.push({ weight: 1 * n, name: `${C}${x}` });
                    });
            }),
            m
        );
    }
    var or = [
            ["1P 2M 3M 5P 6M", "major pentatonic", "pentatonic"],
            ["1P 2M 3M 4P 5P 6M 7M", "major", "ionian"],
            ["1P 2M 3m 4P 5P 6m 7m", "minor", "aeolian"],
            ["1P 2M 3m 3M 5P 6M", "major blues"],
            ["1P 3m 4P 5d 5P 7m", "minor blues", "blues"],
            ["1P 2M 3m 4P 5P 6M 7M", "melodic minor"],
            ["1P 2M 3m 4P 5P 6m 7M", "harmonic minor"],
            ["1P 2M 3M 4P 5P 6M 7m 7M", "bebop"],
            ["1P 2M 3m 4P 5d 6m 6M 7M", "diminished", "whole-half diminished"],
            ["1P 2M 3m 4P 5P 6M 7m", "dorian"],
            ["1P 2M 3M 4A 5P 6M 7M", "lydian"],
            ["1P 2M 3M 4P 5P 6M 7m", "mixolydian", "dominant"],
            ["1P 2m 3m 4P 5P 6m 7m", "phrygian"],
            ["1P 2m 3m 4P 5d 6m 7m", "locrian"],
            ["1P 3M 4P 5P 7M", "ionian pentatonic"],
            ["1P 3M 4P 5P 7m", "mixolydian pentatonic", "indian"],
            ["1P 2M 4P 5P 6M", "ritusen"],
            ["1P 2M 4P 5P 7m", "egyptian"],
            ["1P 3M 4P 5d 7m", "neopolitan major pentatonic"],
            ["1P 3m 4P 5P 6m", "vietnamese 1"],
            ["1P 2m 3m 5P 6m", "pelog"],
            ["1P 2m 4P 5P 6m", "kumoijoshi"],
            ["1P 2M 3m 5P 6m", "hirajoshi"],
            ["1P 2m 4P 5d 7m", "iwato"],
            ["1P 2m 4P 5P 7m", "in-sen"],
            ["1P 3M 4A 5P 7M", "lydian pentatonic", "chinese"],
            ["1P 3m 4P 6m 7m", "malkos raga"],
            ["1P 3m 4P 5d 7m", "locrian pentatonic", "minor seven flat five pentatonic"],
            ["1P 3m 4P 5P 7m", "minor pentatonic", "vietnamese 2"],
            ["1P 3m 4P 5P 6M", "minor six pentatonic"],
            ["1P 2M 3m 5P 6M", "flat three pentatonic", "kumoi"],
            ["1P 2M 3M 5P 6m", "flat six pentatonic"],
            ["1P 2m 3M 5P 6M", "scriabin"],
            ["1P 3M 5d 6m 7m", "whole tone pentatonic"],
            ["1P 3M 4A 5A 7M", "lydian #5P pentatonic"],
            ["1P 3M 4A 5P 7m", "lydian dominant pentatonic"],
            ["1P 3m 4P 5P 7M", "minor #7M pentatonic"],
            ["1P 3m 4d 5d 7m", "super locrian pentatonic"],
            ["1P 2M 3m 4P 5P 7M", "minor hexatonic"],
            ["1P 2A 3M 5P 5A 7M", "augmented"],
            ["1P 2M 4P 5P 6M 7m", "piongio"],
            ["1P 2m 3M 4A 6M 7m", "prometheus neopolitan"],
            ["1P 2M 3M 4A 6M 7m", "prometheus"],
            ["1P 2m 3M 5d 6m 7m", "mystery #1"],
            ["1P 2m 3M 4P 5A 6M", "six tone symmetric"],
            ["1P 2M 3M 4A 5A 6A", "whole tone", "messiaen's mode #1"],
            ["1P 2m 4P 4A 5P 7M", "messiaen's mode #5"],
            ["1P 2M 3M 4P 5d 6m 7m", "locrian major", "arabian"],
            ["1P 2m 3M 4A 5P 6m 7M", "double harmonic lydian"],
            ["1P 2m 2A 3M 4A 6m 7m", "altered", "super locrian", "diminished whole tone", "pomeroy"],
            ["1P 2M 3m 4P 5d 6m 7m", "locrian #2", "half-diminished", "aeolian b5"],
            ["1P 2M 3M 4P 5P 6m 7m", "mixolydian b6", "melodic minor fifth mode", "hindu"],
            ["1P 2M 3M 4A 5P 6M 7m", "lydian dominant", "lydian b7", "overtone"],
            ["1P 2M 3M 4A 5A 6M 7M", "lydian augmented"],
            ["1P 2m 3m 4P 5P 6M 7m", "dorian b2", "phrygian #6", "melodic minor second mode"],
            ["1P 2m 3m 4d 5d 6m 7d", "ultralocrian", "superlocrian bb7", "superlocrian diminished"],
            ["1P 2m 3m 4P 5d 6M 7m", "locrian 6", "locrian natural 6", "locrian sharp 6"],
            ["1P 2A 3M 4P 5P 5A 7M", "augmented heptatonic"],
            ["1P 2M 3m 4A 5P 6M 7m", "dorian #4", "ukrainian dorian", "romanian minor", "altered dorian"],
            ["1P 2M 3m 4A 5P 6M 7M", "lydian diminished"],
            ["1P 2M 3M 4A 5A 7m 7M", "leading whole tone"],
            ["1P 2M 3M 4A 5P 6m 7m", "lydian minor"],
            ["1P 2m 3M 4P 5P 6m 7m", "phrygian dominant", "spanish", "phrygian major"],
            ["1P 2m 3m 4P 5P 6m 7M", "balinese"],
            ["1P 2m 3m 4P 5P 6M 7M", "neopolitan major"],
            ["1P 2M 3M 4P 5P 6m 7M", "harmonic major"],
            ["1P 2m 3M 4P 5P 6m 7M", "double harmonic major", "gypsy"],
            ["1P 2M 3m 4A 5P 6m 7M", "hungarian minor"],
            ["1P 2A 3M 4A 5P 6M 7m", "hungarian major"],
            ["1P 2m 3M 4P 5d 6M 7m", "oriental"],
            ["1P 2m 3m 3M 4A 5P 7m", "flamenco"],
            ["1P 2m 3m 4A 5P 6m 7M", "todi raga"],
            ["1P 2m 3M 4P 5d 6m 7M", "persian"],
            ["1P 2m 3M 5d 6m 7m 7M", "enigmatic"],
            ["1P 2M 3M 4P 5A 6M 7M", "major augmented", "major #5", "ionian augmented", "ionian #5"],
            ["1P 2A 3M 4A 5P 6M 7M", "lydian #9"],
            ["1P 2m 2M 4P 4A 5P 6m 7M", "messiaen's mode #4"],
            ["1P 2m 3M 4P 4A 5P 6m 7M", "purvi raga"],
            ["1P 2m 3m 3M 4P 5P 6m 7m", "spanish heptatonic"],
            ["1P 2M 3m 3M 4P 5P 6M 7m", "bebop minor"],
            ["1P 2M 3M 4P 5P 5A 6M 7M", "bebop major"],
            ["1P 2m 3m 4P 5d 5P 6m 7m", "bebop locrian"],
            ["1P 2M 3m 4P 5P 6m 7m 7M", "minor bebop"],
            ["1P 2M 3M 4P 5d 5P 6M 7M", "ichikosucho"],
            ["1P 2M 3m 4P 5P 6m 6M 7M", "minor six diminished"],
            ["1P 2m 3m 3M 4A 5P 6M 7m", "half-whole diminished", "dominant diminished", "messiaen's mode #2"],
            ["1P 3m 3M 4P 5P 6M 7m 7M", "kafi raga"],
            ["1P 2M 3M 4P 4A 5A 6A 7M", "messiaen's mode #6"],
            ["1P 2M 3m 3M 4P 5d 5P 6M 7m", "composite blues"],
            ["1P 2M 3m 3M 4A 5P 6m 7m 7M", "messiaen's mode #3"],
            ["1P 2m 2M 3m 4P 4A 5P 6m 6M 7M", "messiaen's mode #7"],
            ["1P 2m 2M 3m 3M 4P 5d 5P 6m 6M 7m 7M", "chromatic"],
        ],
        ar = or,
        ir = { ...A, intervals: [], aliases: [] },
        it = [],
        V = {};
    function Tt() {
        return it.map((t) => t.name);
    }
    function U(t) {
        return V[t] || ir;
    }
    var mr = f("ScaleDictionary.scaleType", "ScaleType.get", U);
    function T() {
        return it.slice();
    }
    var sr = f("ScaleDictionary.entries", "ScaleType.all", T);
    function cr() {
        return Object.keys(V);
    }
    function ur() {
        (it = []), (V = {});
    }
    function ln(t, n, e = []) {
        let r = { ...p(t), name: n, intervals: t, aliases: e };
        return it.push(r), (V[r.name] = r), (V[r.setNum] = r), (V[r.chroma] = r), r.aliases.forEach((o) => lr(r, o)), r;
    }
    function lr(t, n) {
        V[n] = t;
    }
    ar.forEach(([t, n, ...e]) => ln(t.split(" "), n, e));
    var jt = { names: Tt, get: U, all: T, add: ln, removeAll: ur, keys: cr, entries: sr, scaleType: mr };
    var xt = { empty: !0, name: "", symbol: "", root: "", rootDegree: 0, type: "", tonic: null, setNum: NaN, quality: "Unknown", chroma: "", normalized: "", aliases: [], notes: [], intervals: [] },
        fr = /^(6|64|7|9|11|13)$/;
    function Q(t) {
        let [n, e, r, o] = H(t);
        return n === "" ? ["", t] : n === "A" && o === "ug" ? ["", "aug"] : !o && (r === "4" || r === "5") ? [n + e, r] : fr.test(r) ? [n + e, r + o] : [n + e + r, o];
    }
    function O(t) {
        if (t === "") return xt;
        if (Array.isArray(t) && t.length === 2) return mt(t[1], t[0]);
        {
            let [n, e] = Q(t),
                r = mt(e, n);
            return r.empty ? mt(t) : r;
        }
    }
    function mt(t, n, e) {
        let r = rt(t),
            o = s(n || ""),
            a = s(e || "");
        if (r.empty || (n && o.empty) || (e && a.empty)) return xt;
        let i = b(o.pc, a.pc),
            m = r.intervals.indexOf(i) + 1;
        if (!a.empty && !m) return xt;
        let c = Array.from(r.intervals);
        for (let d = 1; d < m; d++) {
            let x = c[0][0],
                C = c[0][1],
                zt = parseInt(x, 10) + 7;
            c.push(`${zt}${C}`), c.shift();
        }
        let P = o.empty ? [] : c.map((d) => u(o, d));
        t = r.aliases.indexOf(t) !== -1 ? t : r.aliases[0];
        let h = `${o.empty ? "" : o.pc}${t}${a.empty || m <= 1 ? "" : "/" + a.pc}`,
            j = `${n ? o.pc + " " : ""}${r.name}${m > 1 && e ? " over " + a.pc : ""}`;
        return { ...r, name: j, symbol: h, type: r.name, root: a.name, intervals: c, rootDegree: m, tonic: o.name, notes: P };
    }
    var dr = f("Chord.chord", "Chord.get", O);
    function pr(t, n) {
        let [e, r] = Q(t);
        return e ? u(e, n) + r : t;
    }
    function Pr(t) {
        let n = O(t),
            e = B(n.chroma);
        return T()
            .filter((r) => e(r.chroma))
            .map((r) => r.name);
    }
    function Mr(t) {
        let n = O(t),
            e = B(n.chroma);
        return S()
            .filter((r) => e(r.chroma))
            .map((r) => n.tonic + r.aliases[0]);
    }
    function hr(t) {
        let n = O(t),
            e = L(n.chroma);
        return S()
            .filter((r) => e(r.chroma))
            .map((r) => n.tonic + r.aliases[0]);
    }
    function vr(t) {
        let { intervals: n, tonic: e } = O(t),
            r = D(n, e);
        return (o) => (o ? r(o > 0 ? o - 1 : o) : "");
    }
    function yr(t) {
        let { intervals: n, tonic: e } = O(t);
        return D(n, e);
    }
    var fn = { getChord: mt, get: O, detect: St, chordScales: Pr, extended: Mr, reduced: hr, tokenize: Q, transpose: pr, degrees: vr, steps: yr, chord: dr };
    var br = [
            [0.125, "dl", ["large", "duplex longa", "maxima", "octuple", "octuple whole"]],
            [0.25, "l", ["long", "longa"]],
            [0.5, "d", ["double whole", "double", "breve"]],
            [1, "w", ["whole", "semibreve"]],
            [2, "h", ["half", "minim"]],
            [4, "q", ["quarter", "crotchet"]],
            [8, "e", ["eighth", "quaver"]],
            [16, "s", ["sixteenth", "semiquaver"]],
            [32, "t", ["thirty-second", "demisemiquaver"]],
            [64, "sf", ["sixty-fourth", "hemidemisemiquaver"]],
            [128, "h", ["hundred twenty-eighth"]],
            [256, "th", ["two hundred fifty-sixth"]],
        ],
        Ar = br,
        st = [];
    Ar.forEach(([t, n, e]) => xr(t, n, e));
    var gr = { empty: !0, name: "", value: 0, fraction: [0, 0], shorthand: "", dots: "", names: [] };
    function Ir() {
        return st.reduce((t, n) => (n.names.forEach((e) => t.push(e)), t), []);
    }
    function Nr() {
        return st.map((t) => t.shorthand);
    }
    var Sr = /^([^.]+)(\.*)$/;
    function Ct(t) {
        let [n, e, r] = Sr.exec(t) || [],
            o = st.find((m) => m.shorthand === e || m.names.includes(e));
        if (!o) return gr;
        let a = Cr(o.fraction, r.length),
            i = a[0] / a[1];
        return { ...o, name: t, dots: r, value: i, fraction: a };
    }
    var Tr = (t) => Ct(t).value,
        jr = (t) => Ct(t).fraction,
        dn = { names: Ir, shorthands: Nr, get: Ct, value: Tr, fraction: jr };
    function xr(t, n, e) {
        st.push({ empty: !1, dots: "", name: "", value: 1 / t, fraction: t < 1 ? [1 / t, 1] : [1, t], shorthand: n, names: e });
    }
    function Cr(t, n) {
        let e = Math.pow(2, n),
            r = t[0] * e,
            o = t[1] * e,
            a = r;
        for (let i = 0; i < n; i++) r += a / Math.pow(2, i + 1);
        for (; r % 2 === 0 && o % 2 === 0; ) (r /= 2), (o /= 2);
        return [r, o];
    }
    function Er() {
        return "1P 2M 3M 4P 5P 6m 7m".split(" ");
    }
    var pn = l,
        Dr = (t) => l(t).name,
        _r = (t) => l(t).semitones,
        wr = (t) => l(t).q,
        Fr = (t) => l(t).num;
    function Et(t) {
        let n = l(t);
        return n.empty ? "" : n.simple + n.q;
    }
    function Vr(t) {
        let n = l(t);
        if (n.empty) return "";
        let e = (7 - n.step) % 7,
            r = n.type === "perfectable" ? -n.alt : -(n.alt + 1);
        return l({ step: e, alt: r, oct: n.oct, dir: n.dir }).name;
    }
    var Or = [1, 2, 2, 3, 3, 4, 5, 5, 6, 6, 7, 7],
        Rr = "P m M m M P d P m M m M".split(" ");
    function $r(t) {
        let n = t < 0 ? -1 : 1,
            e = Math.abs(t),
            r = e % 12,
            o = Math.floor(e / 12);
        return n * (Or[r] + 7 * o) + Rr[r];
    }
    var kr = b,
        Pn = hn((t, n) => [t[0] + n[0], t[1] + n[1]]),
        qr = (t) => (n) => Pn(t, n),
        Gr = hn((t, n) => [t[0] - n[0], t[1] - n[1]]);
    function Dt(t, n) {
        let e = pn(t);
        if (e.empty) return "";
        let [r, o, a] = e.coord;
        return G([r + n, o, a]).name;
    }
    var Mn = { names: Er, get: pn, name: Dr, num: Fr, semitones: _r, quality: wr, fromSemitones: $r, distance: kr, invert: Vr, simplify: Et, add: Pn, addTo: qr, substract: Gr, transposeFifths: Dt };
    function hn(t) {
        return (n, e) => {
            let r = l(n).coord,
                o = l(e).coord;
            if (r && o) {
                let a = t(r, o);
                return G(a).name;
            }
        };
    }
    function vn(t) {
        return +t >= 0 && +t <= 127;
    }
    function _t(t) {
        if (vn(t)) return +t;
        let n = s(t);
        return n.empty ? null : n.midi;
    }
    function Lr(t, n = 440) {
        return Math.pow(2, (t - 69) / 12) * n;
    }
    var Br = Math.log(2),
        zr = Math.log(440);
    function ct(t) {
        let n = (12 * (Math.log(t) - zr)) / Br + 69;
        return Math.round(n * 100) / 100;
    }
    var Ur = "C C# D D# E F F# G G# A A# B".split(" "),
        Hr = "C Db D Eb E F Gb G Ab A Bb B".split(" ");
    function g(t, n = {}) {
        if (isNaN(t) || t === -1 / 0 || t === 1 / 0) return "";
        t = Math.round(t);
        let r = (n.sharps === !0 ? Ur : Hr)[t % 12];
        if (n.pitchClass) return r;
        let o = Math.floor(t / 12) - 1;
        return r + o;
    }
    function wt(t) {
        return t % 12;
    }
    function Kr(t) {
        return t.split("").reduce((n, e, r) => (r < 12 && e === "1" && n.push(r), n), []);
    }
    function Xr(t) {
        return t
            .map(wt)
            .sort((n, e) => n - e)
            .filter((n, e, r) => e === 0 || n !== r[e - 1]);
    }
    function Ft(t) {
        return Array.isArray(t) ? Xr(t) : Kr(t);
    }
    function Qr(t) {
        let n = Ft(t);
        return (e) => {
            let r = wt(e);
            for (let o = 0; o < 12; o++) {
                if (n.includes(r + o)) return e + o;
                if (n.includes(r - o)) return e - o;
            }
        };
    }
    function yn(t, n) {
        let e = Ft(t),
            r = e.length;
        return (o) => {
            let a = o < 0 ? (r - (-o % r)) % r : o % r,
                i = Math.floor(o / r);
            return e[a] + i * 12 + n;
        };
    }
    function Jr(t, n) {
        let e = yn(t, n);
        return (r) => {
            if (r !== 0) return e(r > 0 ? r - 1 : r);
        };
    }
    var bn = { chroma: wt, freqToMidi: ct, isMidi: vn, midiToFreq: Lr, midiToNoteName: g, pcsetNearest: Qr, pcset: Ft, pcsetDegrees: Jr, pcsetSteps: yn, toMidi: _t };
    var Yr = ["C", "D", "E", "F", "G", "A", "B"],
        An = (t) => t.name,
        gn = (t) => t.map(s).filter((n) => !n.empty);
    function Wr(t) {
        return t === void 0 ? Yr.slice() : Array.isArray(t) ? gn(t).map(An) : [];
    }
    var v = s,
        Zr = (t) => v(t).name,
        to = (t) => v(t).pc,
        no = (t) => v(t).acc,
        eo = (t) => v(t).oct,
        ro = (t) => v(t).midi,
        oo = (t) => v(t).freq,
        ao = (t) => v(t).chroma;
    function Vt(t) {
        return g(t);
    }
    function io(t) {
        return g(ct(t));
    }
    function mo(t) {
        return g(ct(t), { sharps: !0 });
    }
    function so(t) {
        return g(t, { sharps: !0 });
    }
    var J = u,
        co = u,
        In = (t) => (n) => J(n, t),
        uo = In,
        Nn = (t) => (n) => J(t, n),
        lo = Nn;
    function Y(t, n) {
        return J(t, [n, 0]);
    }
    var fo = Y;
    function po(t, n) {
        return J(t, [0, n]);
    }
    var Ot = (t, n) => t.height - n.height,
        Po = (t, n) => n.height - t.height;
    function Sn(t, n) {
        return (n = n || Ot), gn(t).sort(n).map(An);
    }
    function Rt(t) {
        return Sn(t, Ot).filter((n, e, r) => e === 0 || n !== r[e - 1]);
    }
    var Mo = (t) => {
        let n = v(t);
        return n.empty ? "" : g(n.midi || n.chroma, { sharps: n.alt > 0, pitchClass: n.midi === null });
    };
    function $t(t, n) {
        let e = v(t);
        if (e.empty) return "";
        let r = v(n || g(e.midi || e.chroma, { sharps: e.alt < 0, pitchClass: !0 }));
        if (r.empty || r.chroma !== e.chroma) return "";
        if (e.oct === void 0) return r.pc;
        let o = e.chroma - e.alt,
            a = r.chroma - r.alt,
            i = o > 11 || a < 0 ? -1 : o < 0 || a > 11 ? 1 : 0,
            m = e.oct + i;
        return r.pc + m;
    }
    var Tn = {
        names: Wr,
        get: v,
        name: Zr,
        pitchClass: to,
        accidentals: no,
        octave: eo,
        midi: ro,
        ascending: Ot,
        descending: Po,
        sortedNames: Sn,
        sortedUniqNames: Rt,
        fromMidi: Vt,
        fromMidiSharps: so,
        freq: oo,
        fromFreq: io,
        fromFreqSharps: mo,
        chroma: ao,
        transpose: J,
        tr: co,
        transposeBy: In,
        trBy: uo,
        transposeFrom: Nn,
        trFrom: lo,
        transposeFifths: Y,
        transposeOctaves: po,
        trFifths: fo,
        simplify: Mo,
        enharmonic: $t,
    };
    var xn = { empty: !0, name: "", chordType: "" },
        jn = {};
    function y(t) {
        return typeof t == "string" ? jn[t] || (jn[t] = Io(t)) : typeof t == "number" ? y(ut[t] || "") : q(t) ? yo(t) : k(t) ? y(t.name) : xn;
    }
    var ho = f("RomanNumeral.romanNumeral", "RomanNumeral.get", y);
    function vo(t = !0) {
        return (t ? ut : go).slice();
    }
    function yo(t) {
        return y(E(t.alt) + ut[t.step]);
    }
    var bo = /^(#{1,}|b{1,}|x{1,}|)(IV|I{1,3}|VI{0,2}|iv|i{1,3}|vi{0,2})([^IViv]*)$/;
    function Ao(t) {
        return bo.exec(t) || ["", "", "", ""];
    }
    var Cn = "I II III IV V VI VII",
        ut = Cn.split(" "),
        go = Cn.toLowerCase().split(" ");
    function Io(t) {
        let [n, e, r, o] = Ao(t);
        if (!r) return xn;
        let a = r.toUpperCase(),
            i = ut.indexOf(a),
            m = _(e),
            c = 1;
        return { empty: !1, name: n, roman: r, interval: l({ step: i, alt: m, dir: c }).name, acc: e, chordType: o, alt: m, step: i, major: r === a, oct: 0, dir: c };
    }
    var En = { names: vo, get: y, romanNumeral: ho };
    var M = Object.freeze([]),
        Dn = { type: "major", tonic: "", alteration: 0, keySignature: "" },
        lt = { tonic: "", grades: M, intervals: M, scale: M, triads: M, chords: M, chordsHarmonicFunction: M, chordScales: M },
        No = { ...Dn, ...lt, type: "major", minorRelative: "", scale: M, secondaryDominants: M, secondaryDominantsMinorRelative: M, substituteDominants: M, substituteDominantsMinorRelative: M },
        So = { ...Dn, type: "minor", relativeMajor: "", natural: lt, harmonic: lt, melodic: lt },
        kt = (t, n, e = "") => n.map((r, o) => `${t[o]}${e}${r}`);
    function ft(t, n, e, r, o) {
        return (a) => {
            let i = t.map((c) => y(c).interval || ""),
                m = i.map((c) => u(a, c));
            return { tonic: a, grades: t, intervals: i, scale: m, triads: kt(m, n), chords: kt(m, e), chordsHarmonicFunction: r.slice(), chordScales: kt(m, o, " ") };
        };
    }
    var _n = (t, n) => {
            let e = s(t),
                r = s(n);
            return e.empty || r.empty ? 0 : r.coord[0] - e.coord[0];
        },
        To = ft("I II III IV V VI VII".split(" "), " m m   m dim".split(" "), "maj7 m7 m7 maj7 7 m7 m7b5".split(" "), "T SD T SD D T D".split(" "), "major,dorian,phrygian,lydian,mixolydian,minor,locrian".split(",")),
        jo = ft("I II bIII IV V bVI bVII".split(" "), "m dim  m m  ".split(" "), "m7 m7b5 maj7 m7 m7 maj7 7".split(" "), "T SD T SD D SD SD".split(" "), "minor,locrian,major,dorian,phrygian,lydian,mixolydian".split(",")),
        xo = ft(
            "I II bIII IV V bVI VII".split(" "),
            "m dim aug m   dim".split(" "),
            "mMaj7 m7b5 +maj7 m7 7 maj7 o7".split(" "),
            "T SD T SD D SD D".split(" "),
            "harmonic minor,locrian 6,major augmented,lydian diminished,phrygian dominant,lydian #9,ultralocrian".split(",")
        ),
        Co = ft(
            "I II bIII IV V VI VII".split(" "),
            "m m aug   dim dim".split(" "),
            "m6 m7 +maj7 7 7 m7b5 m7b5".split(" "),
            "T SD T SD D  ".split(" "),
            "melodic minor,dorian b2,lydian augmented,lydian dominant,mixolydian b6,locrian #2,altered".split(",")
        );
    function Eo(t) {
        let n = s(t).pc;
        if (!n) return No;
        let e = To(n),
            r = _n("C", n),
            o = (a) => {
                let i = y(a);
                return i.empty ? "" : u(t, i.interval) + i.chordType;
            };
        return {
            ...e,
            type: "major",
            minorRelative: u(n, "-3m"),
            alteration: r,
            keySignature: E(r),
            secondaryDominants: "- VI7 VII7 I7 II7 III7 -".split(" ").map(o),
            secondaryDominantsMinorRelative: "- IIIm7b5 IV#m7 Vm7 VIm7 VIIm7b5 -".split(" ").map(o),
            substituteDominants: "- bIII7 IV7 bV7 bVI7 bVII7 -".split(" ").map(o),
            substituteDominantsMinorRelative: "- IIIm7 Im7 IIbm7 VIm7 IVm7 -".split(" ").map(o),
        };
    }
    function Do(t) {
        let n = s(t).pc;
        if (!n) return So;
        let e = _n("C", n) - 3;
        return { type: "minor", tonic: n, relativeMajor: u(n, "3m"), alteration: e, keySignature: E(e), natural: jo(n), harmonic: xo(n), melodic: Co(n) };
    }
    function _o(t) {
        return typeof t == "number" ? Y("C", t) : typeof t == "string" && /^b+|#+$/.test(t) ? Y("C", _(t)) : null;
    }
    var wn = { majorKey: Eo, majorTonicFromKeySignature: _o, minorKey: Do };
    var Gt = [
            [0, 2773, 0, "ionian", "", "Maj7", "major"],
            [1, 2902, 2, "dorian", "m", "m7"],
            [2, 3418, 4, "phrygian", "m", "m7"],
            [3, 2741, -1, "lydian", "", "Maj7"],
            [4, 2774, 1, "mixolydian", "", "7"],
            [5, 2906, 3, "aeolian", "m", "m7", "minor"],
            [6, 3434, 5, "locrian", "dim", "m7b5"],
        ],
        Fn = { ...A, name: "", alt: 0, modeNum: NaN, triad: "", seventh: "", aliases: [] },
        Lt = Gt.map(Oo),
        qt = {};
    Lt.forEach((t) => {
        (qt[t.name] = t),
            t.aliases.forEach((n) => {
                qt[n] = t;
            });
    });
    function R(t) {
        return typeof t == "string" ? qt[t.toLowerCase()] || Fn : t && t.name ? R(t.name) : Fn;
    }
    var wo = f("Mode.mode", "Mode.get", R);
    function Vn() {
        return Lt.slice();
    }
    var Fo = f("Mode.mode", "Mode.all", Vn);
    function Vo() {
        return Lt.map((t) => t.name);
    }
    function Oo(t) {
        let [n, e, r, o, a, i, m] = t,
            c = m ? [m] : [],
            P = Number(e).toString(2);
        return { empty: !1, intervals: U(o).intervals, modeNum: n, chroma: P, normalized: P, name: o, setNum: e, alt: r, triad: a, seventh: i, aliases: c };
    }
    function Ro(t, n) {
        return R(t).intervals.map((e) => u(n, e));
    }
    function On(t) {
        return (n, e) => {
            let r = R(n);
            if (r.empty) return [];
            let o = N(r.modeNum, t),
                a = r.intervals.map((i) => u(e, i));
            return o.map((i, m) => a[m] + i);
        };
    }
    var $o = On(Gt.map((t) => t[4])),
        ko = On(Gt.map((t) => t[5]));
    function Rn(t, n) {
        let e = R(n),
            r = R(t);
        return e.empty || r.empty ? "" : Et(Dt("1P", r.alt - e.alt));
    }
    function qo(t, n, e) {
        return u(e, Rn(t, n));
    }
    var $n = { get: R, names: Vo, all: Vn, distance: Rn, relativeTonic: qo, notes: Ro, triads: $o, seventhChords: ko, entries: Fo, mode: wo };
    function Go(t, n) {
        return n.map(y).map((r) => u(t, l(r)) + r.chordType);
    }
    function Lo(t, n) {
        return n.map((e) => {
            let [r, o] = Q(e),
                a = b(t, r);
            return y(l(a)).name + o;
        });
    }
    var kn = { fromRomanNumerals: Go, toRomanNumerals: Lo };
    function qn(t) {
        let n = K(t.map((e) => (typeof e == "number" ? e : _t(e))));
        return !t.length || n.length !== t.length
            ? []
            : n.reduce(
                  (e, r) => {
                      let o = e[e.length - 1];
                      return e.concat(w(o, r).slice(1));
                  },
                  [n[0]]
              );
    }
    function Bo(t, n) {
        return qn(t).map((e) => g(e, n));
    }
    var Gn = { numeric: qn, chromatic: Bo };
    var zo = { empty: !0, name: "", type: "", tonic: null, setNum: NaN, chroma: "", normalized: "", aliases: [], notes: [], intervals: [] };
    function Ln(t) {
        if (typeof t != "string") return ["", ""];
        let n = t.indexOf(" "),
            e = s(t.substring(0, n));
        if (e.empty) {
            let o = s(t);
            return o.empty ? ["", t] : [o.name, ""];
        }
        let r = t.substring(e.name.length + 1);
        return [e.name, r.length ? r : ""];
    }
    var Uo = Tt;
    function I(t) {
        let n = Array.isArray(t) ? t : Ln(t),
            e = s(n[0]).name,
            r = U(n[1]);
        if (r.empty) return zo;
        let o = r.name,
            a = e ? r.intervals.map((m) => u(e, m)) : [],
            i = e ? e + " " + o : o;
        return { ...r, name: i, type: o, tonic: e, notes: a };
    }
    var Ho = f("Scale.scale", "Scale.get", I);
    function Ko(t, n = {}) {
        let e = gt(t),
            r = s((n.tonic !== undefined && n.tonic !== null) ? n.tonic : (t[0] !== undefined && t[0] !== null) ? t[0] : ""),
            o = r.chroma;
        if (o === void 0) return [];
        let a = e.split("");
        a[o] = "1";
        let i = N(o, a).join(""),
            m = T().find((P) => P.chroma === i),
            c = [];
        return (
            m && c.push(r.name + " " + m.name),
            n.match === "exact" ||
                Bn(i).forEach((P) => {
                    c.push(r.name + " " + P);
                }),
            c
        );
    }
    function Xo(t) {
        let n = I(t),
            e = L(n.chroma);
        return S()
            .filter((r) => e(r.chroma))
            .map((r) => r.aliases[0]);
    }
    function Bn(t) {
        let n = et(t) ? t : I(t).chroma,
            e = B(n);
        return T()
            .filter((r) => e(r.chroma))
            .map((r) => r.name);
    }
    function Qo(t) {
        let n = L(I(t).chroma);
        return T()
            .filter((e) => n(e.chroma))
            .map((e) => e.name);
    }
    function zn(t) {
        let n = t.map((o) => s(o).pc).filter((o) => o),
            e = n[0],
            r = Rt(n);
        return N(r.indexOf(e), r);
    }
    function Jo(t) {
        let n = I(t);
        if (n.empty) return [];
        let e = n.tonic ? n.notes : n.intervals;
        return X(n.chroma)
            .map((r, o) => {
                let a = I(r).name;
                return a ? [e[o], a] : ["", ""];
            })
            .filter((r) => r[0]);
    }
    function Yo(t) {
        let n = Array.isArray(t) ? zn(t) : I(t).notes,
            e = n.map((r) => s(r).chroma);
        return (r) => {
            let o = typeof r == "number" ? s(Vt(r)) : s(r),
                a = o.height;
            if (a === void 0) return;
            let i = a % 12,
                m = e.indexOf(i);
            if (m !== -1) return $t(o.name, n[m]);
        };
    }
    function Wo(t) {
        let n = Yo(t);
        return (e, r) => {
            let o = s(e).height,
                a = s(r).height;
            return o === void 0 || a === void 0
                ? []
                : w(o, a)
                      .map(n)
                      .filter((i) => i);
        };
    }
    function Zo(t) {
        let { intervals: n, tonic: e } = I(t),
            r = D(n, e);
        return (o) => (o ? r(o > 0 ? o - 1 : o) : "");
    }
    function ta(t) {
        let { intervals: n, tonic: e } = I(t);
        return D(n, e);
    }
    var Un = { degrees: Zo, detect: Ko, extended: Bn, get: I, modeNames: Jo, names: Uo, rangeOf: Wo, reduced: Qo, scaleChords: Xo, scaleNotes: zn, steps: ta, tokenize: Ln, scale: Ho };
    var na = { empty: !0, name: "", upper: void 0, lower: void 0, type: void 0, additive: [] },
        ea = ["4/4", "3/4", "2/4", "2/2", "12/8", "9/8", "6/8", "3/8"];
    function ra() {
        return ea.slice();
    }
    var oa = /^(\d*\d(?:\+\d)*)\/(\d+)$/,
        Hn = new Map();
    function aa(t) {
        let n = JSON.stringify(t),
            e = Hn.get(n);
        if (e) return e;
        let r = ma(Bt(t));
        return Hn.set(n, r), r;
    }
    function Bt(t) {
        if (typeof t == "string") {
            let [a, i, m] = oa.exec(t) || [];
            return Bt([i, m]);
        }
        let [n, e] = t,
            r = +e;
        if (typeof n == "number") return [n, r];
        let o = n.split("+").map((a) => +a);
        return o.length === 1 ? [o[0], r] : [o, r];
    }
    var Kn = { names: ra, parse: Bt, get: aa },
        ia = (t) => (Math.log(t) / Math.log(2)) % 1 === 0;
    function ma([t, n]) {
        let e = Array.isArray(t) ? t.reduce((m, c) => m + c, 0) : t,
            r = n;
        if (e === 0 || r === 0) return na;
        let o = Array.isArray(t) ? `${t.join("+")}/${n}` : `${t}/${n}`,
            a = Array.isArray(t) ? t : [],
            i = r === 4 || r === 2 ? "simple" : r === 8 && e % 3 === 0 ? "compound" : ia(r) ? "irregular" : "irrational";
        return { empty: !1, name: o, type: i, upper: e, lower: r, additive: a };
    }
    var sa = tt,
        ca = It,
        ua = Nt,
        la = jt;
    return Wn(fa);
})();
//# sourceMappingURL=tonal.min.js.map
