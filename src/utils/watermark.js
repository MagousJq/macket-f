/* eslint-disable */
! function(e, t) {
	e.WaterMark = t()
}(window, function() {
	function e(e) {
		return "[object Object]" === Object.prototype.toString.call(e)
	}

	function t(e, t, n) {
		clearTimeout(e.tId), e.tId = setTimeout(function() {
			e.call(t)
		}, n)
	}

	function n() {
		var e = document.createElement("div");
		return y.imgSrc && k ? e.appendChild(k.cloneNode(!0)) : e.innerText = y.text, e.className = p, e
	}

	function o() {
		var e = (y.text, n());
		e.style.top = "-1000px", w.appendChild(e), x = e.offsetWidth, S = e.offsetHeight, w.removeChild(e)
	}

	function a(t, n) {
		if (e(t) && e(n))
			for (var o in n)
				if (n.hasOwnProperty(o)) {
					var a = n[o];
					t[o] = a
				}
	}

	function i(e, t) {
		var o = n();
		o.style.left = e + "px", o.style.top = t + "px", o.style.width = x + "px", o.style.height = S + "px", b.appendChild(o), v.push(o)
	}

	function r() {
		if (y.imgSrc) {
			if (!k) return k = new Image, k.onload = function() {
				M = !0, r()
			}, void(k.src = y.imgSrc);
			if (!M) return
		}
		o();
		for (var e = y.xSpace, t = y.ySpace, n = Math.max(w.clientWidth, w.scrollWidth, document.documentElement.scrollWidth), a = Math.max(w.clientHeight, w.scrollHeight, document.documentElement.scrollHeight), c = y.yStart; a > c + S; c += t + S)
			for (var l = y.xStart; n > l + x; l += e + x) i(l, c)
		
		console.log(w.clientHeight, w.scrollHeight, document.documentElement.scrollHeight,a)
	}

	function c() {
		v.length && (h(), f())
	}

	function l() {
		function e() {
			// var o = Math.max(w.clientWidth, w.scrollWidth, document.documentElement.scrollHeight),
				// a = Math.max(w.clientHeight, w.scrollHeight, document.documentElement.scrollHeight);
				var o = window.innerWidth, a = window.innerHeight;
			(t !== o || n !== a) && (t = o, n = a, c()), setTimeout(e, g)
		}
		// var t = Math.max(w.clientWidth, w.scrollWidth, document.documentElement.scrollWidth),
		// 	n = Math.max(w.clientHeight, w.scrollHeight, document.documentElement.scrollHeight);
		var t = window.innerWidth,
			n = window.innerHeight;
		setTimeout(e, g)
	}

	function d() {
		H || (window.onresize = function() {
			t(c, this, 300)
		}, l(), H = !0)
	}

	function s() {
		var e, t = "nis-water-style",
			n = !1;
		(e = document.getElementById(t)) || (e = document.createElement("style"), e.id = t, e.type = "text/css", n = !0), e.innerHTML = "";
		for (var o = document.head || document.getElementsByTagName("head")[0], a = [
				// ["position", "fixed"],
				["position", "absolute"],
				["z-index", y.zIndex],
				["font-size", y.size + "px"],
				["color", y.color],
				["opacity", y.opacity],
				["filter", "alpha(opacity=" + 100 * y.opacity + ")"],
        ["pointer-events", "none"],
        
				["-webkit-transform", "rotate(-" + y.rotate + "deg)"],
				["-moz-transform", "rotate(-" + y.rotate + "deg)"],
        ["-o-transform", "rotate(-" + y.rotate + "deg)"],
				["-ms-transform", "rotate(-" + y.rotate + "deg)"],
        ["transform", "rotate(-" + y.rotate + "deg)"],

				// ["-webkit-transform-origin", "100% 50%"],
				// ["-moz-transform-origin",  "100% 50%"],
        // ["-o-transform-origin",  "100% 50%"],
				// ["-ms-transform-origin",  "100% 50%"],
        // ["transform-origin",  "100% 50%"],

				["font-family", '-apple-system, BlinkMacSystemFont            , "Seogoe UI", Roboto, "Helvetica Neue", Helvetica,             Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei UI",             "Microsoft YaHei", "Source Han Sans CN", sans-serif']
			], i = ["." + p + "{"], r = "", c = 0; c < a.length; c++) {
			var l = a[c];
			i.push(l.join(":") + ";")
		}
		i.push("}"), r = i.join(""), e.styleSheet ? e.styleSheet.cssText = r : e.appendChild(document.createTextNode(r)), n && o.appendChild(e)
	}

	function u() {
		var e = "nis-water-container";
		b || (b = document.createElement("div"), b.id = e, w.appendChild(b))
	}

	function m() {
		if (!E && window.btoa) {
			var e = "",
				t = (new Date).valueOf(),
				n = {
					userId: y.imgSrc ? "ImageMark" : y.text,
					deviceUdid: t,
					dataType: "e",
					eventId: "showMark",
					occurTime: Date.now(),
					appKey: "MA-BDDE-EE3F5AC0E6AC",
					sdkVersion: "1.0.0",
					sdkType: "js",
					sessionUuid: t + 1,
					currentDomain: document.domain
				},
				o = JSON.stringify(n);
			try {
				e = "https://hubble.netease.com/track/w/?data=" + btoa(o) + "&appkey=caded4ed5ab04aef0f8a8a2c826ebd00238c23f2"
			} catch (a) {
				n.userId = "encodeError", e = "https://hubble.netease.com/track/w/?data=" + btoa(JSON.stringify(n)) + "&appkey=caded4ed5ab04aef0f8a8a2c826ebd00238c23f2", console.log(a)
			}
			var i = function(e) {
				var t = document.createElement("img");
				t.src = e
			};
			i(e), E = !0
		}
	}

	function f(e) {
		e = e || {}, a(y, e), w = y.parent || document.body, h(), m(), u(), s(), r(), d()
	}

	function h() {
		if (b)
			for (k = null, M = !1; v.length;) b.removeChild(v.shift())
	}
	var p = "nis-water-mark",
		g = 1e3,
		y = {
			text: "watermark",
			imgSrc: null,
			rotate: 13,
			xSpace: 100,
			ySpace: 100,
			size: 20,
			xStart: 20,
			yStart: 80,
			opacity: 0.05,
			zIndex: 99999,
			color: "#000",
			height: null,
			parent: null
		},
		v = [],
		x = -1,
		S = -1,
		w = null,
		b = null,
		H = !1,
		E = !1,
		k = null,
		M = !1;
	return {
		mark: f,
		clear: h
	}
});