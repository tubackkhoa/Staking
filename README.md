## Deploy contracts on localhost
```bash
npx hardhat node
=> start server, open another terminal

npx hardhat run scripts/deploy_marketplace.js --network localhost 
=> Result: Contract deploy to a address: 0x5FbDB2315678afecb367f032d93F642f64180aa3

npx hardhat run scripts/deploy_howltoken.js --network localhost
=> Result: Contract deploy to a address: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

npx hardhat run scripts/deploy_nft.js --network localhost
=> Result: Contract deploy to a address: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

npx hardhat run scripts/initialize_marketplace.js --network localhost
```
Deployed contract address in `deployed_address.json`

## 

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
