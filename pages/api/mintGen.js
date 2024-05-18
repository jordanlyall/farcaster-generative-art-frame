import { PinataFDK } from "pinata-fdk";
import { uploadJsonToPinata } from "../../util/uploadJson";
import { getImageFromBackend } from "../../util/getImage";
import { ethers } from "ethers";
import { createGenArt, createGenArtFidLow } from "../../util/createImage";
import { uploadImageToImgur } from "../../util/uploadImage";
import { storeImgurInBackend } from "../../util/storeImage";

const fdk = new PinataFDK({
  pinata_jwt: process.env.PINATA_LOGIN,
  pinata_gateway: process.env.PINATA_PW,
});

const abi = []; // fill in the abi for your contract

const CONTRACT_ADDRESS = "0x"; // fill in the contract address for your contract

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { isValid, message } = await fdk.validateFrameMessage(req.body);

    if (!isValid) {
      return res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="https://www.host.com/error.png" />
            <meta property="og:image" content="https://www.host.com/error.png" />
            <meta property="fc:frame:image:aspect_ratio" content="1:1" />
          </head>
        </html>
      `);
    } else {
      const { buttonIndex } = req.body.untrustedData;

      const { fid } = message.data;

      if (buttonIndex == 1) {
        let imgPng;
        if (parseInt(fid) < 200) {
          imgPng = await createGenArtFidLow(fid);
        } else {
          imgPng = await createGenArt(fid);
        }

        const imgurResponse = await uploadImageToImgur(imgPng);

        storeImgurInBackend({
          nft: {
            fid,
            imgur_link: imgurResponse,
          },
        });

        return res.status(200).send(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta property="fc:frame" content="vNext" />
              <meta property="fc:frame:image" content=${imgurResponse} />
              <meta property="og:image" content=${imgurResponse} />
              <meta property="fc:frame:button:1" content="Generate Another" />
              <meta property="fc:frame:button:2" content="Mint This" />
              <meta property="fc:frame:post_url" content="https://www.host.com/api/mintGen" />
              <meta property="fc:frame:image:aspect_ratio" content="1:1" />
            </head>
          </html>
        `);
      } else {
        try {
          const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_URL);
          const wallet = new ethers.Wallet(
            process.env.OWNER_CONTRACT_PRIVATE_KEY,
            provider
          );
          const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

          const imgurLink = await getImageFromBackend(fid);

          const ipfsUrl = await fdk.convertUrlToIPFS(imgurLink);

          const jsonIpfsHash = await uploadJsonToPinata(ipfsUrl, fid);

          const nftToMint = `ipfs://${jsonIpfsHash}`;

          const ethAddress = await fdk.getEthAddressForFid(fid);

          const mintTx = await contract.mintNFT(ethAddress, nftToMint);

          return res.status(200).send(`
            <!DOCTYPE html>
            <html>
              <head>
                <meta property="fc:frame" content="vNext" />
                <meta property="fc:frame:image" content=${imgurLink} />
                <meta property="og:image" content=${imgurLink} />
                <meta property="fc:frame:button:1" content="View Transaction" />
                <meta property="fc:frame:button:1:action" content="link" />
                <meta property="fc:frame:button:1:target" content="https://base.blockscout.com/tx/${mintTx.hash}" />
                <meta property="fc:frame:image:aspect_ratio" content="1:1" />
              </head>
            </html>
          `);
        } catch (error) {
          return res.status(200).send(`
            <!DOCTYPE html>
            <html>
              <head>
                <meta property="fc:frame" content="vNext" />
                <meta property="fc:frame:image" content="https://www.host.com/error.png" />
                <meta property="og:image" content="https://www.host.com/error.png" />
                <meta property="fc:frame:image:aspect_ratio" content="1:1" />
              </head>
            </html>
          `);
        }
      }
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
