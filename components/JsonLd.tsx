import React from 'react';

export function PersonSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Jabir Abdullah Haian',
          url: 'https://jabirah.pages.dev',
          jobTitle: 'BBA Student — Accounting & Information Systems',
          alumniOf: {
            '@type': 'CollegeOrUniversity',
            name: 'University of Dhaka',
          },
          knowsAbout: [
            'Accounting',
            'Financial Analysis',
            'Data Analytics',
            'Web Development',
          ],
          sameAs: [
            'https://www.linkedin.com/in/jabir-abdullah-haian/',
            'https://github.com/Jabir-A-H/',
            'https://twitter.com/JabirHaian',
            'https://www.instagram.com/jabir_a_haian',
          ],
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
