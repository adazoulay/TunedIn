import React from "react";
import { Instagram, Twitter, Linkedin } from "react-feather";

const SocialLinks = ({ instagramUrl, twitterUrl, linkedinUrl }) => {
  return (
    <div className='social-links'>
      {instagramUrl && (
        <div className='social-link'>
          <a
            href={instagramUrl}
            target='_blank'
            rel='noopener noreferrer'
            style={{ display: "contents" }}>
            <Instagram size={30} />
          </a>
        </div>
      )}

      {twitterUrl && (
        <div
          className='social-link'
          target='_blank'
          rel='noopener noreferrer'
          style={{ display: "contents" }}>
          <a href={twitterUrl}>
            <Twitter size={30} />
          </a>
        </div>
      )}
      {linkedinUrl && (
        <div
          className='social-link'
          target='_blank'
          rel='noopener noreferrer'
          style={{ display: "contents" }}>
          <a href={linkedinUrl}>
            <Linkedin size={30} />
          </a>
        </div>
      )}
    </div>
  );
};

export default SocialLinks;
