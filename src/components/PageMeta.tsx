import { Helmet } from 'react-helmet-async';

interface PageMetaProps {
  title: string;
  description: string;
  url: string;
  noIndex?: boolean;
}

const PageMeta = ({ title, description, url, noIndex }: PageMetaProps) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={url} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={url} />
    {noIndex ? <meta name="robots" content="noindex, nofollow" /> : null}
  </Helmet>
);

export default PageMeta;
