'use client';

import { FormEvent, useMemo, useState } from 'react';
import { Lightbulb, Send, Shield, ThumbsUp } from 'lucide-react';

interface Suggestion {
  id: number;
  title: string;
  category: string;
  impact: string;
  description: string;
  author: string;
  votes: number;
  status: 'Novo' | 'Em análise' | 'Planejado';
}

const categories = ['Comunidade', 'Conhecimento', 'Laboratório', 'Elite', 'Plataforma'];
const impactLevels = ['Baixo', 'Médio', 'Alto'];

const initialSuggestions: Suggestion[] = [
  {
    id: 1,
    title: 'Resumo semanal automático por trilha',
    category: 'Plataforma',
    impact: 'Alto',
    description: 'Gerar um bloco de progresso semanal para cada área com principais entregas e próximos passos.',
    author: 'Coordenação Voxen',
    votes: 11,
    status: 'Em análise',
  },
  {
    id: 2,
    title: 'Desafio mensal de escrita persuasiva',
    category: 'Elite',
    impact: 'Médio',
    description: 'Criar um desafio com tema fixo e feedback em grupo para fortalecer argumentação.',
    author: 'Analista Forense',
    votes: 8,
    status: 'Planejado',
  },
];

export default function SuggestionsPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [impact, setImpact] = useState(impactLevels[1]);
  const [description, setDescription] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>(initialSuggestions);

  const totalVotes = useMemo(
    () => suggestions.reduce((accumulator, suggestion) => accumulator + suggestion.votes, 0),
    [suggestions]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedTitle = title.trim();
    const normalizedDescription = description.trim();
    if (!normalizedTitle || !normalizedDescription) return;

    const nextSuggestion: Suggestion = {
      id: Date.now(),
      title: normalizedTitle,
      category,
      impact,
      description: normalizedDescription,
      author: 'Você',
      votes: 0,
      status: 'Novo',
    };

    setSuggestions((current) => [nextSuggestion, ...current]);
    setTitle('');
    setDescription('');
    setCategory(categories[0]);
    setImpact(impactLevels[1]);
  };

  const handleVote = (suggestionId: number) => {
    setSuggestions((current) =>
      current.map((suggestion) =>
        suggestion.id === suggestionId ? { ...suggestion, votes: suggestion.votes + 1 } : suggestion
      )
    );
  };

  return (
    <div className="relative min-h-full bg-[#05080c] px-4 pb-16 pt-10 sm:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-16 top-0 h-72 w-72 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute -left-16 bottom-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(161,138,90,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(161,138,90,0.03)_1px,transparent_1px)] bg-[size:34px_34px]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl">
        <section className="border border-primary/20 bg-black/35 px-6 py-8 shadow-[0_18px_70px_rgba(0,0,0,0.35)] md:px-10">
          <div className="inline-flex items-center gap-2 border border-primary/25 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-primary">
            Comunidade • Sugestões
          </div>
          <h1 className="mt-5 max-w-4xl text-4xl font-black uppercase tracking-tight text-foreground sm:text-5xl">
            Canal de melhorias da plataforma
          </h1>
          <p className="mt-4 max-w-3xl text-base italic leading-relaxed text-primary sm:text-lg">
            Registre propostas com contexto e impacto para priorização da equipe e evolução contínua do ecossistema Voxen.
          </p>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <form onSubmit={handleSubmit} className="border border-primary/20 bg-black/25 p-5">
            <h2 className="text-2xl font-black uppercase tracking-wide text-foreground">Nova sugestão</h2>

            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em] text-primary/75">Título</label>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Ex: trilha semanal com meta de entrega"
                  className="h-11 w-full border border-primary/30 bg-black/30 px-3 text-sm text-foreground outline-none transition-all placeholder:text-primary/45 focus:border-primary"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em] text-primary/75">Categoria</label>
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="h-11 w-full border border-primary/30 bg-black/30 px-3 text-sm text-foreground outline-none transition-all focus:border-primary"
                  >
                    {categories.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em] text-primary/75">Impacto estimado</label>
                  <select
                    value={impact}
                    onChange={(event) => setImpact(event.target.value)}
                    className="h-11 w-full border border-primary/30 bg-black/30 px-3 text-sm text-foreground outline-none transition-all focus:border-primary"
                  >
                    {impactLevels.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em] text-primary/75">Descrição</label>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Explique problema, solução sugerida e benefício esperado"
                  className="h-36 w-full resize-none border border-primary/30 bg-black/30 px-3 py-2 text-sm text-foreground outline-none transition-all placeholder:text-primary/45 focus:border-primary"
                />
              </div>

              <button
                type="submit"
                className="inline-flex h-11 items-center gap-2 border border-primary/35 bg-primary/15 px-4 text-[10px] font-black uppercase tracking-[0.18em] text-primary transition-all hover:border-primary hover:text-foreground"
              >
                Publicar sugestão
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>

          <aside className="space-y-6">
            <div className="border border-primary/20 bg-[#0a0f18] p-5">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-primary/75">
                <Lightbulb className="h-4 w-4" /> Panorama
              </div>
              <div className="mt-4 space-y-3">
                <div className="border border-primary/15 bg-black/25 p-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.22em] text-primary/70">Sugestões abertas</p>
                  <p className="mt-1 text-2xl font-black text-foreground">{suggestions.length}</p>
                </div>
                <div className="border border-primary/15 bg-black/25 p-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.22em] text-primary/70">Votos registrados</p>
                  <p className="mt-1 text-2xl font-black text-foreground">{totalVotes}</p>
                </div>
              </div>
            </div>

            <div className="border border-primary/20 bg-[#0a0f18] p-5">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-primary/75">
                <Shield className="h-4 w-4" /> Critério de qualidade
              </div>
              <ul className="mt-4 space-y-2">
                <li className="border border-primary/15 bg-black/25 px-3 py-2 text-sm text-foreground/90">Descreva o problema de forma objetiva.</li>
                <li className="border border-primary/15 bg-black/25 px-3 py-2 text-sm text-foreground/90">Sugira uma solução viável para o curto prazo.</li>
                <li className="border border-primary/15 bg-black/25 px-3 py-2 text-sm text-foreground/90">Explique qual resultado esperado a mudança traz.</li>
              </ul>
            </div>
          </aside>
        </section>

        <section className="mt-8 space-y-4">
          {suggestions.map((suggestion) => (
            <article key={suggestion.id} className="border border-primary/20 bg-black/25 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-primary/15 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="border border-primary/25 bg-primary/10 px-2 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-primary/85">
                    {suggestion.category}
                  </span>
                  <span className="border border-primary/25 bg-black/30 px-2 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-primary/75">
                    Impacto {suggestion.impact}
                  </span>
                  <span className="border border-primary/25 bg-black/30 px-2 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-primary/75">
                    {suggestion.status}
                  </span>
                </div>
                <span className="text-xs uppercase tracking-[0.16em] text-primary/65">Autor: {suggestion.author}</span>
              </div>

              <h3 className="mt-4 text-2xl font-black uppercase tracking-wide text-foreground">{suggestion.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-primary/85">{suggestion.description}</p>

              <button
                type="button"
                onClick={() => handleVote(suggestion.id)}
                className="mt-4 inline-flex items-center gap-2 border border-primary/35 bg-primary/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-primary transition-all hover:border-primary hover:text-foreground"
              >
                Apoiar ideia ({suggestion.votes})
                <ThumbsUp className="h-4 w-4" />
              </button>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
