const fetch = require("node-fetch");
const FormData = require("form-data");

export const uploadImageToImgur = async (imageBuffer) => {
  try {
    const formData = new FormData();
    formData.append("image", imageBuffer);

    const response = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: {
        Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
      },
      body: formData,
    });

    const data = await response.json();
    return data.data.link;
  } catch (error) {
    return null;
  }
};
