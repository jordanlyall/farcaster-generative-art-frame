export const getImageFromBackend = async (fid) => {
  return fetch(`${process.env.API_HOST}/api/v1/nft/${fid}`)
    .then((response) => response.json())
    .catch((err) => {
      console.error(err);
      throw err;
    });
};
