import { notFound } from "next/navigation";
import { articles } from "@/data/articles";
import ArticleHeader from "./ArticleHeader";
import ArticleContent from "./ArticleContent";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <section className="py-16 min-h-screen">
      <div className="container mx-auto max-w-[750px]">
        <ArticleHeader
          category={article.category}
          title={article.title}
          date={article.date}
          readingTime={article.readingTime}
        />
        <ArticleContent content={article.content} />
      </div>
    </section>
  );
}
