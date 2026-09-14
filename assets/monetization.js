/* Amazon Associates conversion CTA. Tag live. No income claims. */
(function () {
  "use strict";
  var AMAZON_TAG = "generatorsi0d-20";
  function amzUrl(q) {
    return "https://www.amazon.com/s?k=" + encodeURIComponent(q) +
           "&tag=" + encodeURIComponent(AMAZON_TAG);
  }

  function bandFor(kind, rec) {
    rec = Math.max(20, Math.round(rec || 0));
    if (kind === "mig") {
      return { label: "MIG welder / wire for your amps",
        q: "MIG welder " + rec + " amp", alt: "ER70S-6 MIG wire .030",
        primary: "Shop this MIG class on Amazon", secondary: "ER70S-6 wire on Amazon" };
    }
    if (kind === "stick") {
      return { label: "Stick welder / rods for your amps",
        q: "stick welder " + rec + " amp", alt: "7018 welding rods",
        primary: "Shop this stick class on Amazon", secondary: "7018 rods on Amazon" };
    }
    if (kind === "duty") {
      return { label: "Machine that can hold your duty cycle",
        q: rec + " amp MIG welder", alt: "welding helmet auto darkening",
        primary: "Shop welders on Amazon", secondary: "Helmets on Amazon" };
    }
    return { label: "TIG class for your amps",
      q: "TIG welder " + rec + " amp", alt: "TIG tungsten electrode kit",
      primary: "Shop this TIG class on Amazon", secondary: "Tungsten kits on Amazon" };
  }

  function fillSticky(url, label) {
    var bar = document.getElementById("amzSticky");
    if (!bar) return;
    var link = document.getElementById("amzStickyLink");
    if (link) {
      link.href = url;
      link.textContent = label || "Shop on Amazon";
      link.setAttribute("rel", "sponsored nofollow noopener");
      link.target = "_blank";
    }
    bar.hidden = false;
    bar.setAttribute("aria-hidden", "false");
  }
  window.dismissAmzSticky = function () {
    var bar = document.getElementById("amzSticky");
    if (bar) { bar.hidden = true; bar.setAttribute("aria-hidden", "true"); }
    try { sessionStorage.setItem("amzStickyDismissed", "1"); } catch (e) {}
  };
  window.updateMatchedCTA = function (rec, kind) {
    kind = kind || "default";
    var box = document.getElementById("matchedCta");
    var band = bandFor(kind, rec);
    var url = amzUrl(band.q);
    var altUrl = amzUrl(band.alt);
    if (box) {
      box.innerHTML =
        '<p class="small"><b>Matched to your result:</b> ' + band.label + '</p>' +
        '<div class="affil-links" style="display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.5rem">' +
        '<a class="btn-amz btn-amz-primary" rel="sponsored nofollow noopener" target="_blank" href="' +
          url + '">' + band.primary + '</a>' +
        '<a class="btn-amz" rel="sponsored nofollow noopener" target="_blank" href="' +
          altUrl + '">' + band.secondary + '</a>' +
        '</div>';
      box.hidden = false;
    }
    try {
      if (sessionStorage.getItem("amzStickyDismissed") !== "1") fillSticky(url, band.primary);
    } catch (e) { fillSticky(url, band.primary); }
  };
})();
