import React from 'react';
import data from '@/data.json';

export function PersonSchema() {
  const sameAs = data.endpoints
    .filter((endpoint) => !endpoint.url.startsWith('mailto:'))
    .map((endpoint) => endpoint.url);

  const alumniOf = data.education.map((entry) => ({
    '@type': 'EducationalOrganization',
    name: entry.title,
  }));

  const knowsAbout = data.skills
    .filter((skill) => skill.category === 'Technical Expertise' && skill.level >= 4)
    .map((skill) => skill.name);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          '@id': 'https://jabirah.pages.dev/#person',
          name: data.personal.name,
          url: 'https://jabirah.pages.dev',
          jobTitle: data.personal.headline,
          alumniOf,
          knowsAbout,
          sameAs,
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Dhaka',
            addressCountry: 'BD',
          },
        }),
      }}
    />
  );
}
