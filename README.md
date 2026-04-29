# HolyCanvas – Christian Poster E‑commerce + AI Marketing Engine

A full‑stack Node.js/Express web application to sell Biblical posters online.  
Includes real shopping cart, multiple ZAR payment gateways, and an intelligent marketing suite.

## ✅ What the system CAN do right now (as delivered)

- **Fully responsive store** with 25 posters, each showing a Bible verse, price R50.
- **Real shopping cart** (session‑based, persists across pages).
- **Multi‑gateway payments (ZAR)**:
  - PayFast (sandbox)
  - Stripe (test mode)
  - PayPal (sandbox)
  - Direct EFT to Capitec Bank (shows account details)
- **Marketing engine**:
  - AI‑powered best‑posting‑time recommendations (platform‑specific).
  - Social media poster – schedules/posts to Facebook, Instagram, TikTok (simulated).
  - Landing page builder – generate embeddable HTML pages.
  - Campaign manager and basic analytics dashboard.
- **Advanced algorithms** – monitors platform health, rate limits, and suggests optimal posting windows.
- **Session & order management** – stores orders in‑memory (ready to swap to a real DB).
- **Standalone demo.html** – pure front‑end preview (no backend) to see the design & cart flow.

## ❌ What the system CANNOT do (out of the box)

- **Persistent database** – uses in‑memory storage. Restarting the server erases orders and campaigns.
- **Real social media posting** – requires valid API keys (Facebook Graph, Instagram Basic, TikTok Business) to post live. Without keys it logs “mock posts”.
- **Email confirmation** – no SMTP integration yet (you’d need Nodemailer + email service).
- **User authentication** – no login / account system (direct checkout only).
- **Stock management** – posters are digital items (no inventory tracking).
- **Webhook handling** – payment gateways’ IPNs are stubbed (would need production endpoints).
- **Cron jobs** – scheduled social posts are simulated with `setTimeout`; real scheduling needs a job queue.

## 🤖 How real AI (or a developer) would COMPLETE the system

1. **Replace in‑memory storage with a database**  
   - Use **MongoDB (Mongoose)** or **PostgreSQL (Prisma)** for orders, campaigns, products.  
   - Add `product stock` and `user accounts`.

2. **Integrate real social media APIs**  
   - Obtain OAuth tokens for Facebook, Instagram, TikTok.  
   - Replace mock functions in `services/socialMedia.js` with actual `axios` calls.  
   - Implement proper rate‑limiting and error handling.

3. **Set up a job scheduler**  
   - Use **node‑cron** or **Bull (Redis)** to execute scheduled posts at exact times.  
   - Store scheduled jobs in the database.

4. **Add webhooks & payment verification**  
   - Create endpoints for PayFast ITN, Stripe webhook, PayPal IPN.  
   - Update order status automatically.

5. **Deploy to production**  
   - Use **Heroku, Railway, or AWS** + **Nginx** for SSL.  
   - Set environment variables for all API keys.  
   - Add a process manager like **PM2**.

6. **Enhance marketing AI**  
   - Train a simple ML model (e.g., using historical post engagement) to predict optimal times.  
   - Integrate with Google Analytics or Meta Pixel for conversion tracking.

## 🚀 Quick start

```bash
git clone <repo-url>
cd christian-poster-shop
npm install
cp .env.example .env   # add your test API keys
npm start
