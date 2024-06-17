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
          <Link to={`/profiles/${id}/`}>
            <Avatar src={image} height={55} />
          </Link>
        </div>
        <div className='mx-2'>
          <Link to={`/profiles/${id}/`}>
            <p><strong>{owner}</strong></p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Profile