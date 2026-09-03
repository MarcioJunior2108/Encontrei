import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.acheiyou.com.br';

  // Buscar todos os profissionais para gerar as URLs dinâmicas de perfil
  const professionals = await prisma.professional.findMany({
    select: {
      id: true,
      updatedAt: true,
    },
  });

  const professionalUrls: MetadataRoute.Sitemap = professionals.map((prof) => ({
    url: `${baseUrl}/perfil/${prof.id}`,
    lastModified: prof.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Rotas estáticas
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/buscar`,
      lastModified: new Date(),
      changeFrequency: 'hourly', // Alta frequência devido às novas buscas/profissionais
      priority: 0.9,
    },
    {
      url: `${baseUrl}/como-funciona`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/para-profissionais`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // SEO Programático: Combinações de Top Categorias e Top Cidades
  const topCategories = ['eletricista', 'encanador', 'faxina', 'designer', 'desenvolvedor', 'pedreiro', 'pintor', 'montador', 'frete', 'fotografo'];
  const topCities = ['sao-paulo', 'rio-de-janeiro', 'belo-horizonte', 'curitiba', 'brasilia', 'salvador', 'fortaleza', 'porto-alegre'];

  const programmaticRoutes: MetadataRoute.Sitemap = [];
  
  topCategories.forEach(categoria => {
    topCities.forEach(cidade => {
      programmaticRoutes.push({
        url: `${baseUrl}/${categoria}/${cidade}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  });

  return [...staticRoutes, ...professionalUrls, ...programmaticRoutes];
}
