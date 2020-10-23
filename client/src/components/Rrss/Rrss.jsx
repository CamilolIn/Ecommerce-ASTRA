import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTwitter,
  faInstagram
} from '@fortawesome/free-brands-svg-icons';

import s from '../../styles/Rrss.module.css';

export default function SocialFollow(){
  return(
    <div  className={s.social}>
      <div className="d-flex justify-content-around">
      <a href='https://www.instagram.com/fordiscover_hl/'
      className={s.instagram}>
      <FontAwesomeIcon icon={faInstagram} size='2x'/>
      </a>

      <a href='https://twitter.com/ecommercehenry1'
      className={s.twitter}>
      <FontAwesomeIcon icon={faTwitter} size='2x'/>
      </a>
      </div>
    </div>

  );
}
