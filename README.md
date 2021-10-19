## Deploy contracts and auto-mint NFT on localhost

```bash
npx hardhat node
=> start server, open another terminal

sh deploy_local.sh
```

Deployed contract address in `deployed_address.json`

## Manually mint NFT on localhost

```bash
npx hardhat mint [--quantity 5] [--address 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266] --network localhost # default quantity 1, will mint NFT for signer 0 in default
npx hardhat mint --quantity 5 --address 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
```

##  

This is a [Next.js](https://nextjs.org/) project bootstrapped
with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started for BSC Testnet

Add private key in .env to your metamask wallet
Open Metamask => Import account => Paste your private key string here => Import

connect metamask wallet to Binance smart chain testnet
How to: https://docs.binance.org/smart-chain/wallet/metamask.html
Get testnet RPC: https://docs.binance.org/smart-chain/developer/rpc.html

example: click metamask icon in extension bar => click avatar => Settings => Networks => scroll to bottom => Add Network
Network name: BSC Testnet 01
New RPC URL: https://data-seed-prebsc-2-s3.binance.org:8545/
Chain ID: 97
=> Save

open project in terminal
ONLY run the command: yarn dev to start NextJS webapp
WARNING: DO NOT yarn hat or yarn net because it will replace deployed_address.json by local network address

Open http://localhost:14001 and check the network is connect (in metamask extension view)
If connected, is ok

Warning: it only connects if it open in your site http://localhost:14001

## Getting Started for local network

```bash
# run hardhat node
yarn hat
# deploy smart contract to local network
yarn net
# run next js
yarn dev
```

Open [http://localhost:14001](http://localhost:14001) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.