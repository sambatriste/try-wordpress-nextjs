import Head from 'next/head'
import Container from '../components/container'
import MoreStories from '../components/more-stories'
import HeroPost from '../components/hero-post'
import Intro from '../components/intro'
import Layout from '../components/layout'
import { getAllPostsForHome } from '../lib/api'
import { CMS_NAME } from '../lib/constants'

export default function Index({ allPosts, preview }) {
  const heroPost = allPosts[0];
  const morePosts = allPosts.slice(1)

  return (
    <Layout preview={preview}>
      <Head>
        <title>Next.js Blog Example with {CMS_NAME}</title>
      </Head>
      <Container>
        <Intro />
        {heroPost && (
          <HeroPost
            title={heroPost.title.rendered}
            coverImage={heroPost.featuredImage}
            date={heroPost.date}
            author={"著者"}
            slug={heroPost.slug}
            excerpt={heroPost.excerpt.rendered}
          />
        )}
        {
        morePosts.length > 0 && <MoreStories posts={morePosts} />
        }
      </Container>
    </Layout>
  )
}

export async function getStaticProps({ preview = false }) {
  const allPosts = await getFintanBlog();
  
  return {
    props: { allPosts }
  }
}

async function getFintanBlog() {
  const headers = { 'Content-Type': 'application/json' }

  const res = await fetch("https://fintan.jp/wp-json/wp/v2/fintan_blog/", {
    method: 'GET',
    headers
  });
  const json = await res.json();
  if (json.errors) {
    console.error(json.errors)
    throw new Error('Failed to fetch API')
  }
  
  return json;
}