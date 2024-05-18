export const uploadJsonToPinata = async (url) => {
  const hash = url.split("/ipfs/")[1];

  const json = {
    name: "NFT Title", // Update this with a title, will be the title of the NFT
    description: "NFT Description", // Update this with a description, will be the description of the NFT
    image: `ipfs://${hash}`,
    attributes: [], // Update this with NFT attributes, array of objects with keys trait_type and value
  };

  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PINATA_LOGIN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pinataContent: json,
      pinataMetadata: {
        name: "NFT Title", // Update this with a title
      },
    }),
  };

  return fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", options)
    .then((response) => response.json())
    .then((response) => response.IpfsHash)
    .catch((err) => {
      console.error(err);
      throw err;
    });
};
