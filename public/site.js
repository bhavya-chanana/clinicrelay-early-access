(function () {
  "use strict";
  var C = window.CLINICRELAY_SITE || {};
  var inr = function (n) { return "₹" + Number(n).toLocaleString("en-IN"); };

  // Fill [data-cfg] placeholders: price keys are formatted as rupees, others inserted as text.
  var money = { DEPOSIT_INR: 1, FOUNDING_PRICE_INR: 1, LIST_PRICE_INR: 1, SETUP_FEE_INR: 1 };
  document.querySelectorAll("[data-cfg]").forEach(function (el) {
    var key = el.getAttribute("data-cfg");
    if (C[key] === undefined || C[key] === "") return;
    el.textContent = money[key] ? inr(C[key]) : String(C[key]);
  });

  function whatsappLink(text) {
    if (!C.WHATSAPP_NUMBER) return null;
    return "https://wa.me/" + String(C.WHATSAPP_NUMBER).replace(/\D/g, "") +
      "?text=" + encodeURIComponent(text);
  }
  window.ClinicRelaySite = { config: C, inr: inr, whatsappLink: whatsappLink };

  // Reserve buttons: Razorpay page if configured, else WhatsApp, else the contact email.
  var reserveHref = C.PAYMENT_URL ||
    whatsappLink("Hi, I'd like to reserve a ClinicRelay founding-clinic spot.") ||
    (C.CONTACT_EMAIL ? "mailto:" + C.CONTACT_EMAIL + "?subject=ClinicRelay%20founding%20clinic" : null);
  document.querySelectorAll("[data-reserve]").forEach(function (a) {
    if (reserveHref) {
      a.href = reserveHref;
      if (/^https?:/.test(reserveHref)) a.rel = "noopener";
    } else {
      a.removeAttribute("href");
      a.setAttribute("aria-disabled", "true");
      a.title = "Reservations open soon";
    }
  });

  document.querySelectorAll("[data-whatsapp]").forEach(function (a) {
    var href = whatsappLink(a.getAttribute("data-whatsapp") || "Hi, I have a question about ClinicRelay.");
    if (href) { a.href = href; a.rel = "noopener"; } else { a.hidden = true; }
  });
  document.querySelectorAll("[data-email]").forEach(function (a) {
    if (C.CONTACT_EMAIL) { a.href = "mailto:" + C.CONTACT_EMAIL; a.textContent = C.CONTACT_EMAIL; }
    else { a.hidden = true; }
  });

  if (!C.WHATSAPP_NUMBER && !C.CONTACT_EMAIL) {
    document.querySelectorAll("[data-contact-line]").forEach(function (el) { el.hidden = true; });
  }

  var y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
})();
