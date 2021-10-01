#/bin/bash

npx hardhat run scripts/deploy_marketplace.js --network localhost 
npx hardhat run scripts/deploy_howltoken.js --network localhost
npx hardhat run scripts/deploy_nft.js --network localhost
npx hardhat run scripts/initialize_marketplace.js --network localhost
npx hardhat mint --quantity 5 --network localhost
