import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../../components/Avatar';
import styles from '../../styles/Profile.module.css';

const Profile = (props) => {

  const { id, image, owner, imageSize = 55, created_on } = props;

  return (
    <div>
      <div key={id} className='my-3 d-flex align-items-center'>
        <div>
          {/* Link to the individual profile page */}
          <Link to={`/profiles/${id}/`}>
            {/* Avatar component displaying the profile image */}
            <Avatar src={image} height={imageSize} />
          </Link>
        </div>
        <div className='mx-2'>
          {/* Link to the individual profile page */}
          <Link to={`/profiles/${id}/`}>
            {/* Displaying the owner's name */}
            <p><strong>{owner}</strong></p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Profile