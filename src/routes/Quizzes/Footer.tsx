import { Divider } from '@mantine/core';
import React from 'react';
import Icon from '../../components/Icon';
import styles from './styles.module.css';

export default function Footer() {
  return (
    <div className="fullWidth flex flexCol alignCenter">
      <Divider style={{ width: '80%', marginBottom: 30 }} />
      <footer className={styles.footer}>
        <div className="flex flexCol alignCenter">
          <div>© {new Date().getFullYear()} Quizmaster</div>
          <div className={styles.followUs}>
            Find us on
            <a
              href="https://www.youtube.com/@Quizmasterapp_in"
              target="_blank"
              rel="noopener noreferrer"
              title="Subscribe us on Youtube">
              <Icon name="youtube" width={30} height={30} />
            </a>
            <a
              href="https://github.com/rajatkantinandi/quizmaster"
              target="_blank"
              rel="noopener noreferrer"
              title="Star our repo on GitHub">
              <Icon name="github" width={28} height={28} />
            </a>
            <a
              href="https://twitter.com/quizmasterappin"
              target="_blank"
              rel="noopener noreferrer"
              title="Follow us on X">
              <Icon name="twitter" width={28} height={28} />
            </a>
            <a
              href="https://www.facebook.com/people/Quizmasterappin/61558566877158/"
              target="_blank"
              rel="noopener noreferrer"
              title="Follow us on Facebook">
              <Icon name="facebook" width={28} height={28} />
            </a>
            <a
              href="https://www.instagram.com/quizmasterapp/"
              target="_blank"
              rel="noopener noreferrer"
              title="Follow us on Instagram">
              <Icon name="instagram" width={28} height={28} />
            </a>
            <a
              href="https://www.producthunt.com/posts/quizmaster-2?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-quizmaster&#0045;2"
              target="_blank"
              title="Upvote us on Product hunt"
              rel="noopener noreferrer">
              <img
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=453231&theme=light"
                alt="Quizmaster - Free&#0032;&#0038;&#0032;open&#0032;source&#0032;app&#0032;to&#0032;create&#0032;and&#0032;host&#0032;quizzes | Product Hunt"
                style={{ width: 150, height: 30 }}
                width="250"
                height="54"
              />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
