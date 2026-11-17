# ClinicRelay — early access

Founding-clinic signup site for ClinicRelay. Clinics
pay a small refundable deposit on Razorpay, then fill in an optional onboarding form, which posts to
a Google Sheet. The site is static, deploys to GitHub Pages, and holds no patient data.

```
public/              landing page (index.html), onboarding page after payment (welcome.html), CSS/JS
scripts/build.mjs    copies public/ to dist/ and writes dist/config.js from .env / repo Variables
apps-script/         Google Apps Script that appends form rows to your Sheet
.env.example         every setting, documented
```

## Run locally

```sh
cp .env.example .env    # fill in your values
npm run preview         # builds dist/ and serves http://127.0.0.1:8080
```

Node 18+ and Python 3. No npm install needed.

## Go live (one time)

1. **Razorpay**: Payment Pages → create a page. Set the amount to `DEPOSIT_INR` and add the fields
   WhatsApp number (required), Email, Clinic name (required), City (required). After payment,
   redirect to `https://<your-site>/welcome.html`. Copy the page link into `PAYMENT_URL`.
2. **Google Sheet**: Extensions → Apps Script, paste `apps-script/onboarding.gs`. Deploy → New
   deployment → Web app (Execute as: Me; Who has access: Anyone). Copy the `/exec` URL into
   `ONBOARDING_ENDPOINT`.
3. **GitHub**: Settings → Secrets and variables → Actions → **Variables** tab. Add the same names as
   in your `.env`. They are public values, so Variables are right, not Secrets. You can also add
   `CUSTOM_DOMAIN` (e.g. `early.clinicrelay.in`).
4. **Pages**: Settings → Pages → Source: **GitHub Actions**. Every push to `main` deploys. To deploy
   now, re-run the "Deploy to GitHub Pages" workflow from the Actions tab.

Changing the price, spots or links means editing the Variables and re-running the workflow. You
don't need to touch the code.

## Design notes

### How other startups do this (research summary, Nov 2026)

- **Refundable deposit or pre-order rather than a free waitlist.** Free waitlists measure curiosity,
  and a widely repeated (weakly sourced) figure puts their conversion around 2–3%. A small
  refundable deposit filters for buyers. Founders recommend calling it a *refundable deposit that
  buys early access at a discount* rather than a pre-sale. Examples: Tesla and Superhuman-style
  reservations, and indie SaaS "founding member" pre-sales.
- **Pay first, ask questions second.** The checkout asks only for the minimum (name, phone, clinic,
  city). The longer onboarding questionnaire comes right after payment, while intent is highest.
  Typeform/Tally "thank-you redirect" flows work this way.
- **Founding-member perks instead of discounts that never end.** Lock the price for a fixed period,
  waive setup, and give a direct line to the founder. The BRD already has a 12-month founding rate
  (§18).
- **Onboard quickly.** Conversion drops sharply when people wait months after paying, so batches
  should be small and dated.
- **India specifics.** UPI is the default way to pay. Razorpay Payment Pages need no code or
  backend, take UPI, cards and netbanking, add custom fields at checkout, send a receipt, and can
  redirect to a URL after payment. WhatsApp is the expected follow-up channel. No SMS (CLAUDE.md).

### Flow

1. **Landing page** `public/index.html`: problem, what's included, founding offer, honest status
   ("in development; founding clinics onboard in batches"), FAQ, and a single "Reserve" CTA.
2. **Pay** on a Razorpay Payment Page (`PAYMENT_URL`). Checkout fields: name, WhatsApp number,
   email, clinic name, city. The price is set by `DEPOSIT_INR` and on the Razorpay page.
3. **Redirect** to `public/welcome.html`. It thanks the clinic and shows an optional onboarding form
   (about 2 minutes, every field skippable except the phone number used to match the payment).
4. **The form posts** to `ONBOARDING_ENDPOINT`, a Google Apps Script web app that appends a row to
   the founders' Google Sheet (`apps-script/onboarding.gs`). If the endpoint isn't set or
   the request fails, the page offers "send on WhatsApp" with the answers pre-filled, so no lead is
   lost.

### Rules

- Honest copy: no fake counts, testimonials or "live" claims for unbuilt features. AI front desk is
  labelled as coming later. The AI never gives medical advice. That is stated, not promised away.
- The deposit is fully refundable on request until go-live and is credited against the first bill.
  Refunds are made by hand from the Razorpay dashboard.
- The form collects clinic details only. A hint tells people not to enter patient information.
- No analytics or trackers, and no third-party scripts. Static HTML/CSS plus one small inline script.
- Every price and URL comes from `.env` / repo Variables.

