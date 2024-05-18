## Farcaster Generative Art Frame

This code creates a frame which can be used on any Farcaster client that lets the user generate random pieces of art and mint them.

### Setup

Clone repo, then run `npm i`.

### What You'll Need

1. [Pinata](https://www.pinata.cloud/) account
2. [Alchemy](https://www.alchemy.com/) account
3. [Imgur](https://imgur.com/) client id
4. Your own backend

### How it Works

The frame route is in `pages/api/gen.js`. This file does the following:

1. Uses the Pinata FDK to validate the frame message. If it's not valid, it returns an error image. _You'll need to host the error image on your server and update the URL to it in the code_.
2. If the message is valid, it runs the FID through one of the functions in `util/createImage.js`. There's 2 functions, one is for FID's lower than 200, and the other is for everyone else. Both functions generate a random base64 image.
3. Uploads the base64 image to Imgur.
4. Stores the Imgur url in your backend, associated with the FID. _You'll need to make sure your backend can store this data, and set the env api host to your backend's URL_.
5. Returns the Imgur url to the frame with buttons to generate another or mint the piece.

When the user clicks one of the buttons, the route `/api/mingGen` is called and the code in `/api/mintGen.js` is executed. This code does the following:

1. Uses the Pinata FDK to validate the frame message. If it's not valid, it returns an error image. _You'll need to host the error image on your server and update the URL to it in the code_.
2. If it is valid, it checks the button index.
3. If the button index is 1, that means the user wants to generate another and it executes the same code as the `pages/api/gen.js` again.
4. If the button index is 2, it mints the last image as an NFT.

### Minting the NFT

The NFT contract must be deployed already and the address and contract abi should be hardcoded into the top of the `/api/mintGen.js` file. The owner of the contract should be a wallet with absolutely nothing sensitive or any high amount of funds in it. You will need to put the contract owner's wallet private key in your env variables to be able to mint the NFT to the user. See lines 72-77 of `/api/mintGen.js` for how the code uses the [ethers](https://www.npmjs.com/package/ethers) package to create a wallet instance with the contract owner's private key. You'll also need your [Alchemy](https://www.alchemy.com/) endpoint here.

Once you have your contract, you can begin the process of minting the NFT. Here's what the code does:

1. Retrieves the last image stored in the backend for that FID.
2. Calls the method provided by the Pinata FDK to convert the image to an ipfs hash.
3. Uses the ipfs hash to upload a json file to Pinata. _You'll need to update the title, description and attributes in the json. These will be the metadata for your NFT_.
4. Gets the ETH address for that FID using the Pinata FDK.
5. Calls the `mintNFT` function on the contract with the ipfs hash of the json and the ETH address as arguments.
6. Returns the Imgur link to the frame.