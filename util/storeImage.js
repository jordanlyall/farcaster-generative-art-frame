export const storeImgurInBackend = async (data) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  const url = `${process.env.API_HOST}/api/v1/gen_art_nfts`;
  return fetch(url, options)
    .then((response) => response.json())
    .then((response) => response)
    .catch((err) => console.error(err));
};
