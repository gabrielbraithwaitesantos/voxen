import { Cpu, Globe, LineChart, Scale, School, Shield } from 'lucide-react';
import { SectionOverview } from '@/components/section-overview';

export default function KnowledgeOverviewPage() {
  return (
    <SectionOverview
      badge="Conhecimento"
      title="Biblioteca estratégica de formação Voxen"
      description="Centralize estudo técnico, repertório argumentativo e visão de mundo em trilhas estruturadas para crescimento contínuo."
      spotlightTitle="Começar por Ethos e Logos"
      spotlightDescription="A base argumentativa da plataforma. Ideal para alinhar clareza de pensamento e comunicação persuasiva."
      spotlightHref="/knowledge/ethos-logos"
      spotlightCta="Iniciar trilha"
      links={[
        {
          title: 'Ethos & Logos',
          description: 'Fundamentos de argumentação, estrutura lógica e persuasão.',
          href: '/knowledge/ethos-logos',
          icon: Scale,
        },
        {
          title: 'Automação & IA',
          description: 'Ferramentas para produtividade, análise e operação inteligente.',
          href: '/knowledge/automation-ai',
          icon: Cpu,
        },
        {
          title: 'Sistemas do Mundo',
          description: 'Leituras geopolíticas, culturais e econômicas globais.',
          href: '/knowledge/world-systems',
          icon: Globe,
        },
        {
          title: 'Apologética',
          description: 'Defesa racional de ideias com profundidade histórica e ética.',
          href: '/knowledge/apologetics',
          icon: Shield,
        },
        {
          title: 'Academia',
          description: 'Ambiente de estudo orientado com foco em progressão.',
          href: '/knowledge/academy',
          icon: School,
        },
        {
          title: 'Gestão de Capital',
          description: 'Noções práticas de leitura financeira e tomada de decisão.',
          href: '/knowledge/capital-management',
          icon: LineChart,
        },
      ]}
      stats={[
        { label: 'Prioridade Atual', value: 'Aprendizado aplicável no dia a dia' },
        { label: 'Ritmo Recomendado', value: '3 sessões de estudo por semana' },
        { label: 'Meta da Área', value: 'Clareza intelectual e autonomia' },
      ]}
    />
  );
}