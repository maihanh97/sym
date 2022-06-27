import Head from "next/head";

interface SEOProps {
  title?: string;
  description?: string;
}

function SEO({ title, description }: SEOProps) {
  return (
    <Head>
      <title>{title} | SYMPHONY</title>
      <meta
        name="description"
        content={description || "Blockchain registry app"}
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}

export default SEO;
