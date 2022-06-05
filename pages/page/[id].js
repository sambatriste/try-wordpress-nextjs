import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Container from '../../components/container'
import PostBody from '../../components/post-body'
import MoreStories from '../../components/more-stories'
import Header from '../../components/header'
import PostHeader from '../../components/post-header'
import SectionSeparator from '../../components/section-separator'
import Layout from '../../components/layout'
//import { getAllPostsWithSlug, getPostAndMorePosts } from '../../lib/api'
import PostTitle from '../../components/post-title'
import Head from 'next/head'
import { CMS_NAME } from '../../lib/constants'
import Tags from '../../components/tags'

export default function Post({ post, posts, preview }) {
  const router = useRouter()
  const morePosts = posts?.edges

  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <Layout preview={preview}>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article>
              <Head>
                <title>
                  {post.title.rendered} | Next.js Blog Example with {CMS_NAME}
                </title>
                {/*
                  <meta
                  property="og:image"
                  content={post.featuredImage?.sourceUrl}
                />
 */}
              </Head>
              <PostHeader
                title={post.title.rendered}
                //coverImage={post.featuredImage}
                date={post.date}
              />
              <PostBody content={post.content.rendered} />
            </article>
          </>
        )}
      </Container>
    </Layout>
  )
}

export async function getStaticProps({ params, preview = false, previewData }) {
  const data = await getPostAndMorePosts(params.id)

  return {
    props: {
      preview,
      post: data
    },
  }
}

export async function getStaticPaths() {
  const allPosts = await getAllPosts()

  return {
    paths: allPosts.map((post) => `/page/${post.id}`) || [],
    fallback: true,
  }
}

async function getPostAndMorePosts(id) {
  const headers = { 'Content-Type': 'application/json' }

  const res = await fetch(`https://fintan.jp/wp-json/wp/v2/fintan_blog/${id}`, {
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

async function getAllPosts() {
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