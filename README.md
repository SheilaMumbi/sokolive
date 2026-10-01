# SokoLive

A mobile-first storefront for live thrift and sneaker drops. One item goes live at a time, a timer counts down, and you tap Claim before someone else does.

I built it from a client brief for Wanjiru, who sells pre-loved sneakers and clothes in Nairobi through live sessions on social media. It's a portfolio project, so everything behind the screen is faked. There's no backend, the "server" runs in your browser, and the M-Pesa checkout doesn't send a real prompt or take any money. The photos are Unsplash stand-ins, credited at the bottom.

- Live link: [sokolive.vercel.app](https://sokolive.vercel.app)
- Screen recording: [a 38-second walkthrough on a phone-sized screen](docs/demo.webm) (claims, a rollback, filters, dark mode, cart and checkout)
- Lighthouse on mobile: Performance 92 to 93, Accessibility 100, Best Practices 100

## The brief

> **From:** Wanjiru, owner of a Nairobi thrift and sneaker resale business
>
> "I sell through live sessions on social media, but customers get lost in the chat. I want a mobile-first web storefront where my items go live one at a time, with a timer, and people can claim them instantly. Most of my buyers are on mid-range Android phones with patchy data."

**Must have**
- Live feed: products appear in a vertical feed, and a new item is pushed every 20-30 seconds (simulated with a mock API).
- Countdown timer: each item has a visible timer. At zero it shows "Sold out" or "Ended".
- Claim button: tapping it updates the UI immediately (optimistic UI). If the mock server rejects it because the item is already claimed, roll back with a clear message.
- Cart: add and remove items, with a running total in KES. The cart persists after a refresh.
- Loading and error states: skeleton loaders, an empty state, and a retry button when the "network" fails.

**Nice to have**
- Filter by category (shoes, tops, bags)
- Light and dark mode
- A "viewers now" counter that fluctuates
- Toast notifications ("Someone just claimed the Nike Air Max!")

**Acceptance criteria**
- Works smoothly at 360px width, and scales up to desktop
- Lighthouse Performance 90+ on mobile
- Everything works with a keyboard, with visible focus states and proper ARIA labels
- Timers don't cause the whole feed to re-render
- No layout shift when new items arrive

**Suggested stack:** React (Vite) or Next.js, Zustand or Redux Toolkit, MSW for the fake API, Tailwind or CSS Modules, and Vitest with Testing Library for at least the cart logic and the claim rollback.

## What it does

The newest item sits at the top, "on air", with a big photo, a draining timer bar and a live activity feed. Everything that dropped before it is on a grid underneath, which you can filter by category. On a phone you get a bottom tab bar and a filter sheet. On a desktop it opens up into a wider layout with more columns.

Tapping Claim flips the card straight away and drops the item in your cart. A moment later the fake server either confirms it or tells you someone got there first, and the card and the cart roll back together.

I also added a few things the brief didn't ask for. You can host your own drop (there's a Sell button) with a photo from your phone, and it appears at the top of the wall for other shoppers to claim. The checkout asks for a phone number and pretends to send an M-Pesa prompt. I added that so the demo feels complete.

## Running it

You need Node 20 or newer.

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # Vitest + Testing Library
npm run build && npm run preview
```

Two things worth knowing while you poke around. The footer has a link that toggles a simulated network failure, so you can see the error state and the retry button without turning off your wifi. And about one in seven claims is rejected on purpose, so you'll see the rollback soon enough.

## Decisions and the tricky parts

**The claim race.** The mock server is the only thing that decides who gets an item. It checks whether the item is free and not expired, and takes it, in one synchronous step, so two claims can't both win. It also rejects a share of claims at random, pretending someone else was faster. On the client I do the optimistic update first: the card goes to "Claiming...", and the item goes into the cart. If the server says 409 or 410, I roll back the card and the cart together and show a toast explaining what happened. If it was just a network error, the card goes back to claimable so you can retry. Tapping twice while a claim is in flight does nothing. There are tests for each of these in `src/store/feedStore.test.ts`.

**Timers without re-rendering the feed.** One shared one-second interval feeds `useSyncExternalStore`, and each component subscribes to a derived value rather than to the clock itself. The timer pill re-renders every second. The claim button subscribes to a plain "has it ended" boolean, so it re-renders once, at the moment the timer runs out. The cards are memoised, and the feed list never sees a tick. When nothing is subscribed, the interval stops.

**No layout shift.** Photo boxes have a fixed aspect ratio, so the layout is settled before an image loads. Text areas that could change height (like the hero title) reserve space for two lines. New drops that arrive while you're scrolled down don't get inserted above you. They wait behind a "N new drops" pill and show up when you're back at the top.

**Patchy data.** Photos are resized and compressed WebP files that I host myself, and they load lazily. If one fails to load, the card falls back to a neutral illustration instead of a broken image. Polling pauses when the tab is hidden. If a refresh fails after the feed has loaded, the last items stay on screen with a small "connection lost" banner instead of wiping the page.

**The fake live feed.** There's no real push. The mock server only adds a new item when the client polls and the clock says one is due, which is roughly every 20-30 seconds. It's the same idea as a WebSocket or server-sent events, just easier to fake. The server's state lives in the page, so it resets when you reload, but the cart is saved in `localStorage`.

**Colour.** The page is neutral so the photos can do the talking. The red-orange is saved for the things that should make you act: the Claim button, the live badge and timers that are running out. Amber means "getting low", and green only ever means "you got it". I made both a light and a dark theme.

**Accessibility.** The cart, the filters and the sell form are native `<dialog>` elements, which gives me focus trapping, Escape to close and an inert background without writing any of it. Buttons have descriptive labels, like "Claim Chuck 70 Hi for KES 4,200". Timers use `role="timer"` with a spoken label and aren't live regions, so a screen reader isn't reading out every second. Toasts are status or alert regions. Focus rings are visible and touch targets are at least 44px. There's a skip link, and animations are turned down if you've asked for reduced motion.

## Still to do

- Lighthouse passes, but the first paint is the weak spot (about 2 seconds on the throttled mobile profile). MSW is the heaviest part of the bundle, since it ships to production because the app has no real backend. I tried painting the skeleton before the mock API starts, and it made no measurable difference, so I left it out.
- The photos are stand-ins. For a real store you'd swap them for Wanjiru's own stock.
- The start and end times come from the same machine, so there's no clock-skew correction. A real server would need it.

## Built with

React 19, Vite, TypeScript, Zustand, MSW, CSS Modules, Vitest and Testing Library. The fonts (Geist) are bundled, so there are no third-party font requests.

## Photo credits

Product photos are from [Unsplash](https://unsplash.com/?utm_source=sokolive&utm_medium=referral), used under the Unsplash License and resized to 720 by 900 WebP. To use your own, replace the files in `public/photos/` (named `<type>-<number>.webp`) and update `PHOTO_COUNT` in `src/photos.ts`.

| File | Photographer | Source |
|---|---|---|
| `sneaker-0.webp` | [Ján Vlačuha](https://unsplash.com/@flowixxcom?utm_source=sokolive&utm_medium=referral) | [Photo](https://unsplash.com/photos/white-and-red-nike-basketball-shoes-on-green-grass-92_wMoF-yds?utm_source=sokolive&utm_medium=referral) |
| `sneaker-1.webp` | [The DK Photography](https://unsplash.com/@deepain108?utm_source=sokolive&utm_medium=referral) | [Photo](https://unsplash.com/photos/black-and-white-nike-sneakers-jc0o2j7T5LA?utm_source=sokolive&utm_medium=referral) |
| `sneaker-2.webp` | [Luke Witter](https://unsplash.com/@lukewitter?utm_source=sokolive&utm_medium=referral) | [Photo](https://unsplash.com/photos/a-pair-of-white-sneakers-sitting-on-top-of-a-brown-floor-5zKWJklU8vI?utm_source=sokolive&utm_medium=referral) |
| `sneaker-3.webp` | [Paul Gaudriault](https://unsplash.com/@pl_gt?utm_source=sokolive&utm_medium=referral) | [Photo](https://unsplash.com/photos/unpaired-maroon-plimsoll-on-top-of-yellow-textile-a-QH9MAAVNI?utm_source=sokolive&utm_medium=referral) |
| `sneaker-4.webp` | [Mojtaba Fahiminia](https://unsplash.com/@fahiminia?utm_source=sokolive&utm_medium=referral) | [Photo](https://unsplash.com/photos/a-pair-of-shoes-sitting-on-top-of-a-rock-q7lul0zB0Lg?utm_source=sokolive&utm_medium=referral) |
| `sneaker-5.webp` | [Hector Brasil](https://unsplash.com/@hectorbrasil?utm_source=sokolive&utm_medium=referral) | [Photo](https://unsplash.com/photos/a-pair-of-blue-sneakers-sitting-on-top-of-a-wooden-bench-UVloKH38sJY?utm_source=sokolive&utm_medium=referral) |
| `sneaker-6.webp` | [Zach Camp](https://unsplash.com/@zachccamp?utm_source=sokolive&utm_medium=referral) | [Photo](https://unsplash.com/photos/a-pair-of-white-sneakers-sitting-on-top-of-a-wooden-floor-qO_w1RP1as4?utm_source=sokolive&utm_medium=referral) |
| `sneaker-7.webp` | [HamZa NOUASRIA](https://unsplash.com/@hamza01nsr?utm_source=sokolive&utm_medium=referral) | [Photo](https://unsplash.com/photos/a-pair-of-white-shoes-ksrsdzqxCPg?utm_source=sokolive&utm_medium=referral) |
| `sneaker-8.webp` | [Pict4life](https://unsplash.com/@pict4life?utm_source=sokolive&utm_medium=referral) | [Photo](https://unsplash.com/photos/close-up-of-two-white-and-grey-sneakers-with-laces-HyfBIObAA4Y?utm_source=sokolive&utm_medium=referral) |
| `sneaker-9.webp` | [HamZa NOUASRIA](https://unsplash.com/@hamza01nsr?utm_source=sokolive&utm_medium=referral) | [Photo](https://unsplash.com/photos/a-white-and-black-shoe-9qyGYNJN0nI?utm_source=sokolive&utm_medium=referral) |
| `hightop-0.webp` | [Alin Surdu](https://unsplash.com/@alinsurdu3?utm_source=sokolive&utm_medium=referral) | [Photo](https://unsplash.com/photos/a-pair-of-yellow-and-black-sneakers-on-a-bed-2Ey4PlQ7MoA?utm_source=sokolive&utm_medium=referral) |
| `hightop-1.webp` | [Brian Hall](https://unsplash.com/@bfhall121?utm_source=sokolive&utm_medium=referral) | [Photo](https://unsplash.com/photos/white-converse-all-star-high-top-sneakers-dOCjH4GNxj0?utm_source=sokolive&utm_medium=referral) |
| `hightop-2.webp` | [Saeed Isavy](https://unsplash.com/@saeedisavy1?utm_source=sokolive&utm_medium=referral) | [Photo](https://unsplash.com/photos/high-top-sneakers-on-concrete-surface-BRNekLH2aS8?utm_source=sokolive&utm_medium=referral) |
| `hightop-3.webp` | [Coekieshots](https://unsplash.com/@coekieshots?utm_source=sokolive&utm_medium=referral) | [Photo](https://unsplash.com/photos/a-pair-of-brown-boots-sitting-on-top-of-a-wooden-floor-ixAV_QuvHYE?utm_source=sokolive&utm_medium=referral) |
| `tee-0.webp` | [Haryo Setyadi](https://unsplash.com/@uyk?utm_source=sokolive&utm_medium=referral) | [Photo](https://unsplash.com/photos/white-crew-neck-t-shirt-acn5ERAeSb4?utm_source=sokolive&utm_medium=referral) |
| `tee-1.webp` | [Ryan Hoffman](https://unsplash.com/@ryanhoffman007?utm_source=sokolive&utm_medium=referral) | [Photo](https://unsplash.com/photos/black-and-white-crew-neck-t-shirt-u6n1HrW0sdQ?utm_source=sokolive&utm_medium=referral) |
| `tee-2.webp` | [TuanAnh Blue](https://unsplash.com/@blueeyeaa?utm_source=sokolive&utm_medium=referral) | [Photo](https://unsplash.com/photos/three-t-shirts-sitting-on-top-of-each-other-eYmOYPPHAtQ?utm_source=sokolive&utm_medium=referral) |
| `tee-3.webp` | [Old Youth](https://unsplash.com/@oldyouth?utm_source=sokolive&utm_medium=referral) | [Photo](https://unsplash.com/photos/a-white-t-shirt-with-the-word-olladoahl-printed-on-it-b09YYPi7NR4?utm_source=sokolive&utm_medium=referral) |
| `tee-4.webp` | [Mediamodifier](https://unsplash.com/@mediamodifier?utm_source=sokolive&utm_medium=referral) | [Photo](https://unsplash.com/photos/white-crew-neck-t-shirt-gEupiRvyxh0?utm_source=sokolive&utm_medium=referral) |
| `hoodie-0.webp` | [Ali Saadat](https://unsplash.com/@camsaadat?utm_source=sokolive&utm_medium=referral) | [Photo](https://unsplash.com/photos/person-in-brown-hoodie-and-black-pants-standing-on-staircase-ikLELWYbyxk?utm_source=sokolive&utm_medium=referral) |
| `hoodie-1.webp` | [shohan hridoy](https://unsplash.com/@shohanex?utm_source=sokolive&utm_medium=referral) | [Photo](https://unsplash.com/photos/a-man-in-a-white-hoodie-is-walking-down-the-street-oYSHFpUDCIU?utm_source=sokolive&utm_medium=referral) |
| `hoodie-2.webp` | [philippe wehrli](https://unsplash.com/@philippewehrli?utm_source=sokolive&utm_medium=referral) | [Photo](https://unsplash.com/photos/a-pair-of-jeans-and-a-hoodie-on-a-wooden-floor-h3qsf19IY9Y?utm_source=sokolive&utm_medium=referral) |
| `hoodie-3.webp` | [Just Capturing It](https://unsplash.com/@justcapturingit?utm_source=sokolive&utm_medium=referral) | [Photo](https://unsplash.com/photos/a-tan-sweater-hanging-on-a-clothes-line-wIy8Eh4CFis?utm_source=sokolive&utm_medium=referral) |
| `jacket-0.webp` | [Caio Coelho](https://unsplash.com/@smokthebikini?utm_source=sokolive&utm_medium=referral) | [Photo](https://unsplash.com/photos/blue-denim-button-up-jacket-QRN47la37gw?utm_source=sokolive&utm_medium=referral) |
| `jacket-1.webp` | [Derick McKinney](https://unsplash.com/@derickray?utm_source=sokolive&utm_medium=referral) | [Photo](https://unsplash.com/photos/brown-leather-jacket-hanging-on-brown-wooden-wall-hook-3OFBcQQTN64?utm_source=sokolive&utm_medium=referral) |
| `jacket-2.webp` | [Hamed darzi](https://unsplash.com/@drzi_hamed?utm_source=sokolive&utm_medium=referral) | [Photo](https://unsplash.com/photos/black-and-white-nike-jacket-u42GjVgZgV0?utm_source=sokolive&utm_medium=referral) |
| `jacket-3.webp` | [charlesdeluvio](https://unsplash.com/@charlesdeluvio?utm_source=sokolive&utm_medium=referral) | [Photo](https://unsplash.com/photos/assorted-color-shirt-on-rack-kPKFdPQTz9Y?utm_source=sokolive&utm_medium=referral) |
| `jacket-4.webp` | [Toa Heftiba](https://unsplash.com/@heftiba?utm_source=sokolive&utm_medium=referral) | [Photo](https://unsplash.com/photos/person-holding-green-denim-jacket-gX8dF8Zoegg?utm_source=sokolive&utm_medium=referral) |
| `jacket-5.webp` | [Michael Kyule](https://unsplash.com/@madness_leahcim_?utm_source=sokolive&utm_medium=referral) | [Photo](https://unsplash.com/photos/young-man-in-a-jacket-with-colorful-wall-behind-him-wap-C1Bv_tw?utm_source=sokolive&utm_medium=referral) |
| `tote-0.webp` | [Ginny Rose Stewart](https://unsplash.com/@ginnyrose?utm_source=sokolive&utm_medium=referral) | [Photo](https://unsplash.com/photos/brown-wooden-rolling-pin-beside-white-paper-bag-_kUCAyYFVBI?utm_source=sokolive&utm_medium=referral) |
| `tote-1.webp` | [Kelly Sikkema](https://unsplash.com/@kellysikkema?utm_source=sokolive&utm_medium=referral) | [Photo](https://unsplash.com/photos/beige-eco-bag-1Pgq9ZpIatI?utm_source=sokolive&utm_medium=referral) |
| `tote-2.webp` | [He's Her Lobster](https://unsplash.com/@hesherlobsteruk?utm_source=sokolive&utm_medium=referral) | [Photo](https://unsplash.com/photos/black-tote-bag-9b6UhV4nLZs?utm_source=sokolive&utm_medium=referral) |
| `tote-3.webp` | [Simply Mersah](https://unsplash.com/@simplymersah?utm_source=sokolive&utm_medium=referral) | [Photo](https://unsplash.com/photos/a-bag-sitting-on-top-of-a-chair-next-to-a-plant-6WZtlK0Ez6w?utm_source=sokolive&utm_medium=referral) |
| `crossbody-0.webp` | [Ayomikun Barry](https://unsplash.com/@ayomikun93?utm_source=sokolive&utm_medium=referral) | [Photo](https://unsplash.com/photos/a-person-is-holding-a-stylish-brown-purse--WbdCEVIlTM?utm_source=sokolive&utm_medium=referral) |
| `crossbody-1.webp` | [Aurélia Dubois](https://unsplash.com/@aureliaduboisphotographie?utm_source=sokolive&utm_medium=referral) | [Photo](https://unsplash.com/photos/brown-leather-sling-bag-on-white-background-xzrJCS4grC4?utm_source=sokolive&utm_medium=referral) |
| `crossbody-2.webp` | [Ivan Kazlouskij](https://unsplash.com/@ivankazlouskij?utm_source=sokolive&utm_medium=referral) | [Photo](https://unsplash.com/photos/a-green-purse-hanging-from-the-back-of-a-chair-GT19NqJySFA?utm_source=sokolive&utm_medium=referral) |
| `backpack-0.webp` | [Jakob Owens](https://unsplash.com/@jakobowens1?utm_source=sokolive&utm_medium=referral) | [Photo](https://unsplash.com/photos/person-holding-black-and-brown-vinta-backpack-O_bhy3TnSYU?utm_source=sokolive&utm_medium=referral) |
| `backpack-1.webp` | [Sun Lingyan](https://unsplash.com/@sunlingyan?utm_source=sokolive&utm_medium=referral) | [Photo](https://unsplash.com/photos/black-backpack-on-white-floor-_H0fjILH5Vw?utm_source=sokolive&utm_medium=referral) |
| `backpack-2.webp` | [Jonathan Borba](https://unsplash.com/@jonathanborba?utm_source=sokolive&utm_medium=referral) | [Photo](https://unsplash.com/photos/brown-leather-backpack-on-snow-covered-ground-during-daytime-k3n8TN5WwJk?utm_source=sokolive&utm_medium=referral) |
| `backpack-3.webp` | [Wiser by the Mile](https://unsplash.com/@wiserbythemile?utm_source=sokolive&utm_medium=referral) | [Photo](https://unsplash.com/photos/black-nike-backpack-on-purple-surface-a-k2PQJ4_4U?utm_source=sokolive&utm_medium=referral) |
