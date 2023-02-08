export const uploadFile = async (file, fileType) => {
  try {
    //DEV
    const { url } = await fetch(
      process.env.DEV ? "http://localhost:3500/s3Url" : "https://melonet.onrender.com/s3Url"
    ).then((res) => res.json());

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
