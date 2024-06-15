import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../../components/Avatar';
import styles from '../../styles/Comment.module.css';
import { Card } from 'react-bootstrap';

const Comment = (props) => {
  const {
    profile_id,
    profile_image,
    owner,
    updated_at,
    content
  } = props

  return (

    <div>
      <hr />
      <Card className={styles.Card}>
        <Link className={styles.Link} to={`/profiles/${profile_id}`} >
          <Avatar src={profile_image}/>
          <span className={styles.Owner} >{owner}</span>
          <span className={styles.Date}>{updated_at}</span>
        </Link>
      </Card>
      <Card.Body className={`${styles.Card} 'align-self-center ml-2'`}>
        <p>{content}</p>
      </Card.Body>
    </div>
  )
}

export default Comment