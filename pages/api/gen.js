import { PinataFDK } from "pinata-fdk";
import { createGenArt, createGenArtFidLow } from "../../util/createImage";
import { uploadImageToImgur } from "../../util/uploadImage";
import { storeImgurInBackend } from "../../util/storeImage";

const fdk = new PinataFDK({
  pinata_jwt: process.env.PINATA_LOGIN,
  pinata_gateway: process.env.PINATA_PW,
});

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
      const { fid } = message.data;

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
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
