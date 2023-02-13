import React, { useState, useMemo, useEffect } from "react";

const MediaInfo = ({ contentUrl }) => {
  const [fileMetaData, setFileMetaData] = useState({});

  const fetchMetadata = async (contentUrl) => {};

  fetchMetadata(contentUrl);

  useEffect(() => {
    console.log(fileMetaData);
  }, [fileMetaData]);

  return (
    <div>
      <div>Media Info</div>
      <div>Coming Soon</div>
    </div>
  );
};

export default MediaInfo;
