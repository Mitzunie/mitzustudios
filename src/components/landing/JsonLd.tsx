export function OrganizationJsonLd() {
  const logoUrl = process.env.NEXT_PUBLIC_SITE_LOGO_URL

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MitzuStudios',
    url: 'https://mitzustudios.online',
    ...(logoUrl ? { logo: logoUrl } : {}),
    description:
      'Desarrollo web profesional. Transformamos ideas en software. Landing pages, e-commerce, aplicaciones web y más.',
    email: 'team@mitzustudios.online',
    foundingDate: '2024',
    founder: {
      '@type': 'Person',
      name: 'Mitzunie',
    },
    sameAs: [
      'https://github.com/Mitzunie',
    ],
    offers: [
      {
        '@type': 'Offer',
        name: 'Landing Page',
        description: 'Página profesional one-page para tu negocio',
        price: '500',
        priceCurrency: 'USD',
      },
      {
        '@type': 'Offer',
        name: 'E-commerce',
        description: 'Tienda online con carrito y pasarela de pago',
        price: '1500',
        priceCurrency: 'USD',
      },
      {
        '@type': 'Offer',
        name: 'Aplicación Web',
        description: 'Plataforma web a medida con panel admin',
        price: '3000',
        priceCurrency: 'USD',
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function WebSiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'MitzuStudios',
    url: 'https://mitzustudios.online',
    description:
      'Desarrollo web a medida. Landing pages, e-commerce, aplicaciones web, APIs y rediseño.',
    inLanguage: ['es', 'en'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://mitzustudios.online/?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function ServiceJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'Service',
          name: 'Landing Pages',
          description:
            'Páginas profesionales de una sola página, diseñadas para causar una buena impresión y convertir visitantes en clientes.',
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'Service',
          name: 'Tiendas E-commerce',
          description:
            'Tu tienda online lista para vender. Con carrito de compras, pasarela de pago y un panel para que administres productos y pedidos.',
        },
      },
      {
        '@type': 'ListItem',
        position: 3,
        item: {
          '@type': 'Service',
          name: 'Aplicaciones Web',
          description:
            'Plataformas web interactivas con panel de administración, gestión de usuarios y funciones hechas a tu medida.',
        },
      },
      {
        '@type': 'ListItem',
        position: 4,
        item: {
          '@type': 'Service',
          name: 'APIs y Backend',
          description:
            'APIs robustas y escalables para conectar tus aplicaciones con bases de datos y servicios externos.',
        },
      },
      {
        '@type': 'ListItem',
        position: 5,
        item: {
          '@type': 'Service',
          name: 'Rediseño Web',
          description:
            'Renovamos tu sitio con diseño moderno, mejor rendimiento y una experiencia impecable en cualquier dispositivo.',
        },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function FaqJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '¿Cuánto cuesta desarrollar una landing page?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'El costo de una landing page profesional parte desde los $500 USD, dependiendo de la complejidad y las funcionalidades requeridas. Incluye diseño responsive, optimización SEO básica y formulario de contacto.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Cuánto tiempo toma desarrollar un sitio web?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Una landing page toma entre 5 y 7 días hábiles. Un e-commerce completo puede tomar de 2 a 4 semanas. Las aplicaciones web a medida requieren de 4 a 8 semanas, dependiendo del alcance.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Ofrecen mantenimiento después del desarrollo?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sí, ofrecemos planes de mantenimiento desde $50 USD al mes que incluyen actualizaciones, backups, monitoreo y correcciones menores. También podemos hacer mantenimiento por demanda según necesites.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Cómo puedo solicitar una cotización?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Puedes solicitar una cotización completamente gratuita a través del formulario de contacto en nuestra web. Cuéntanos sobre tu proyecto y te enviaremos una cotización personalizada en menos de 48 horas.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Trabajan con tecnologías modernas?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sí, utilizamos tecnologías modernas como Next.js, React, TypeScript, Node.js, PostgreSQL y Tailwind CSS para construir aplicaciones rápidas, escalables y con excelente experiencia de usuario.',
        },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
