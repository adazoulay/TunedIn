export const uploadFile = async (file, fileType) => {
  try {
    //DEV
    const { url } = await fetch("https://melonet.onrender.com/s3Url").then((res) =>
      res.json()
    );

    await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": fileType },
      body: file,
    });

    return url.split("?")[0];
  } catch (error) {
    console.log("In catch", error);
  }
};
