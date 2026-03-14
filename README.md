# 🧪 Next.js Web3 API Experiment

Hey! This is a practice project I built while diving into full-stack Web3 development. I'm currently figuring out Next.js APIs, routing, and how to safely fetch blockchain data without exposing my RPC URLs to the frontend.
I used viem on API (Server Side) because I wanted to learn how to handle and built my own GET and POST requests and responses, it can be used on client side and public rpc can be used to fetch these wallet details.


It’s not perfect, but it works! 🚀

## 🤔 What does it do?
It's a simple dashboard for the Sepolia testnet. You paste in a wallet address, and the app hits my custom Next.js API to grab:
* The total number of transactions that wallet has sent.
* Its current ETH balance.
* **The VIP Whitelist:** A cool little POST request feature that checks if the wallet is holding at least 1 Sepolia ETH. If yes, you get the "Secret Alpha" welcome. If not, access denied! 🛑

## 🛠️ The Stack I Used
* **Next.js (App Router):** Wrapping my head around `'use client'` vs server-side route handlers.
* **React & Tailwind CSS:** Because I love styling components quickly.
* **viem:** For all the blockchain heavy lifting (much cleaner than dealing with raw RPC calls).
* **TypeScript:** Slowly but surely getting rid of all my `any` types!

## 🏃‍♂️ How to run this mess locally
If you actually want to clone this and try it out:

1. Clone it down and install the packages:
\`\`\`bash
npm install
\`\`\`

2. You'll need a Sepolia RPC URL (get a free one from Alchemy or Infura). Create a `.env` file in the root and toss it in there:
\`\`\`env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY_HERE
\`\`\`

3. Fire it up:
\`\`\`bash
npm run dev
\`\`\`
Then go break things at `http://localhost:3000`.

## 📝 What I learned
* How to separate client-side UI states (loading spinners, error shakes) from the server logic.
* How to use `NextRequest` and `NextResponse` to build custom GET and POST endpoints.
* That converting BigInt balances back and forth is tricky! 

---
*Built by Anuj*# nextjs-viem-experiment
# nextjs-viem-experiment
