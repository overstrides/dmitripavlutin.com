import Img from 'gatsby-image';
import * as React from 'react';

import 'prismjs/themes/prism.css';

import MetaStructuredData from 'components/Pages/Post/Meta/StructuredData';
import MetaTags from 'components/Pages/Post/Meta/Tags';
import Layout from 'components/Layout/Fetch';
import Subheader from 'components/Subheader/WithComments';
import Edit from 'components/Pages/Post/Edit';
import LeftSidebar from 'components/Pages/Post/Sidebar/Left';
import RightSidebar from 'components/Pages/Post/Sidebar/Right';
import RecommendedList from 'components/Pages/Post/Recommended/List';
import ShareBottom from 'components/Pages/Post/Share/Bottom';
import CommentsThread from 'components/Comments/Thread';
import CommentsInView from 'components/Comments/InView';
import AboutAuthorConcise from 'components/AboutAuthor/Concise';
import AboutAuthorFetch from 'components/AboutAuthor/Fetch';
import SubscriptionRegion from 'components/Subscription/Region';
import useVerticalScroll, { RelativePosition } from 'hooks/useVerticalScroll';
import { TO_POST } from 'routes/path';
import styles from './index.module.scss';

const SHOW_SHARE_AFTER_Y = 500;

interface PostTemplateProps {
  siteInfo: SiteInfo;
  authorInfo: AuthorInfo;
  postRepositoryFileUrl: string;
  post: PostDetailed;
  recommendedPosts: Post<FixedImage>[];
  popularPosts: Post<FixedImage>[];
  authorProfilePictureSrc: string;
}

export default function PostTemplate({
  siteInfo,
  authorInfo,
  postRepositoryFileUrl,
  post,
  recommendedPosts,
  popularPosts,
  authorProfilePictureSrc,
}: PostTemplateProps) {
  const relativePosition = useVerticalScroll(SHOW_SHARE_AFTER_Y);
  const showShareButtons = relativePosition === RelativePosition.Below;
  const leftSidebar = (
    <LeftSidebar
      post={post}
      siteUrl={siteInfo.url}
      showShareButtons={showShareButtons}
      twitterName={authorInfo.nicknames.twitter}
    />
  );
  const rightSidebar = <RightSidebar popularPosts={popularPosts} siteUrl={siteInfo.url} />;
  const postUrl = siteInfo.url + TO_POST({ slug: post.slug });
  return (
    <Layout leftSidebar={leftSidebar} rightSidebar={rightSidebar}>
      <MetaTags post={post} siteInfo={siteInfo} authorInfo={authorInfo} />
      <MetaStructuredData
        post={post}
        siteInfo={siteInfo}
        authorInfo={authorInfo}
        authorProfilePictureSrc={authorProfilePictureSrc}
      />
      <article>
        <div className={styles.postCover}>
          <Img fluid={post.thumbnail} />
        </div>
        <h1>{post.title}</h1>
        <Subheader post={post} siteUrl={siteInfo.url} />
        <div className={styles.postContent} dangerouslySetInnerHTML={{ __html: post.html }} />
        <div className={styles.shareGroup}>
          <div className={styles.shareBottom}>
            <ShareBottom url={postUrl} text={post.title} tags={post.tags} twitterName={authorInfo.nicknames.twitter} />
          </div>
          <div className={styles.postEdit}>
            <Edit url={postRepositoryFileUrl} />
          </div>
        </div>
        <div className={styles.bottomSubscriptionForm}>
          <SubscriptionRegion />
        </div>
        <div className={`${styles.delimiter} ${styles.authorInfoContainer}`}>
          <AboutAuthorFetch
            render={({ authorStats, authorProfilePictureSmall }) => {
              return (
                <AboutAuthorConcise
                  authorInfo={authorInfo}
                  authorProfilePicture={authorProfilePictureSmall}
                  authorStats={authorStats}
                />
              );
            }}
          />
        </div>
        <div className={styles.delimiter}>
          <RecommendedList posts={recommendedPosts} />
        </div>
        <div className={`${styles.delimiter} ${styles.comments}`} id="comments">
          <CommentsInView>
            <CommentsThread url={postUrl} title={post.title} commentsTheadId={post.commentsThreadId} />
          </CommentsInView>
        </div>
      </article>
    </Layout>
  );
}
