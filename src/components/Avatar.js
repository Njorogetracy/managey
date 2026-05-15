import React, { useState } from 'react';
import styles from '../styles/Avatar.module.css';

/**
 * Renders an avatar image. If the image URL is missing or fails to load
 * (Cloudinary default placeholder doesn't exist on this account),
 * falls back to a colored circle with the user's initial.
 *
 * `text` provides the initial for the fallback — it is not rendered as
 * a visible label. Pass the owner's username here.
 */
const Avatar = ({ src, height = 45, text }) => {
  const [hasError, setHasError] = useState(false);
  const initial = (text || '?').toString().charAt(0).toUpperCase();
  const showImage = src && !hasError;

  if (showImage) {
    return (
      <img
        className={styles.Avatar}
        src={src}
        height={height}
        width={height}
        alt={text ? `${text} avatar` : 'avatar'}
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <span
      className={styles.Fallback}
      style={{ width: height, height: height, fontSize: height * 0.4 }}
      aria-label={text ? `${text} avatar` : 'avatar'}
    >
      {initial}
    </span>
  );
};

export default Avatar;
