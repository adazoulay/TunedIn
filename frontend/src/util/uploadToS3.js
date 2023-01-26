export const uploadFile = async (file, fileType) => {
  try {
    const { url } = await fetch("http://localhost:3500/s3Url").then((res) => res.json());

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
