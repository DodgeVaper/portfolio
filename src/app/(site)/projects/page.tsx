import { reader } from '@/lib/keystatic';
import { ProjectsTabs } from '@/components/ProjectsTabs';
import Link from 'next/link';

export default async function ProjectsPage() {
  let all: Awaited<ReturnType<typeof reader.collections.projects.all>>;
  try {
    all = await reader.collections.projects.all();
  } catch (error) {
    console.error('Failed to read projects:', error);
    all = [];
  }
  const projects = all.map((p) => ({
    slug: p.slug,
    title: p.entry.title,
    status: p.entry.status,
    description: p.entry.description,
    tags: p.entry.tags ?? [],
    links: p.entry.links ?? {},
  }));

  return (
    <div className="container-pad py-14 sm:py-20">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight">Projects</h1>
        <p className="mt-4 text-muted">
          Фильтр по статусу: запущенные / в работе / архив. Управляется через{' '}
          <Link className="underline" href="/keystatic">
            /keystatic
          </Link>
          .
        </p>
      </div>

      <div className="mt-10">
        <ProjectsTabs projects={projects} />
      </div>
    </div>
  );
}


