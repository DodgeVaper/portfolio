import { notFound } from 'next/navigation';
import { reader } from '@/lib/keystatic';
import { MarkdocContent } from '@/components/MarkdocContent';

export async function generateStaticParams() {
  const slugs = await reader.collections.posts.list();
  return slugs.map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const post = await reader.collections.posts.read(slug);
  if (!post) notFound();

  const content = post.content ? await post.content() : null;

  return (
    <div className="container-pad py-14 sm:py-20">
      <article className="mx-auto max-w-3xl">
        <div className="text-xs text-muted">
          {post.date ? new Date(post.date).toLocaleDateString('ru-RU') : '—'}
        </div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">{post.title}</h1>
        {post.excerpt ? <p className="mt-4 text-muted">{post.excerpt}</p> : null}

        <div className="prose prose-invert mt-10 max-w-none prose-p:leading-8 prose-a:text-[color:var(--accent-code)]">
          {content?.node ? <MarkdocContent node={content.node} /> : null}
        </div>
      </article>
    </div>
  );
}


