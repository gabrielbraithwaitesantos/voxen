'use client';

import { useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, collection, query, where } from '@/firebase';
import { Achievement, UserAchievement } from '@/models/types';
import { Award, ShieldCheck, Zap, Lock } from 'lucide-react';

// Static list of all possible achievements
const allAchievements: Achievement[] = [
  { id: 'founder', title: 'Membro Fundador', description: 'Entrou na comunidade no primeiro mês.', icon: 'zap', color: 'text-yellow-400' },
  { id: 'guardian', title: 'Guardião das Diretrizes', description: 'Completou a leitura das regras.', icon: 'shield-check', color: 'text-blue-400' },
  { id: 'perfect-week', title: 'Semana Perfeita', description: 'Completou a prática diária por 7 dias seguidos.', icon: 'award', color: 'text-green-400' },
  { id: 'first-message', title: 'Primeira Mensagem', description: 'Enviou sua primeira mensagem no chat.', icon: 'message-square', color: 'text-purple-400' },
  { id: 'gallery-contributor', title: 'Contribuidor da Galeria', description: 'Adicionou uma imagem à galeria.', icon: 'image', color: 'text-orange-400' },
  { id: 'timeline-creator', title: 'Criador de Marcos', description: 'Adicionou um evento à timeline.', icon: 'calendar', color: 'text-red-400' },
];

const iconMap = {
  zap: Zap,
  'shield-check': ShieldCheck,
  award: Award,
  'message-square': () => <div>💬</div>, // Placeholder
  image: () => <div>🖼️</div>, // Placeholder
  calendar: () => <div>📅</div>, // Placeholder
};

export default function AchievementsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const userAchievementsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(collection(firestore, 'voxen_v2_user_achievements'), where('userId', '==', user.uid));
  }, [firestore, user?.uid]);

  const { data: unlockedAchievements, isLoading } = useCollection<UserAchievement>(userAchievementsQuery);

  const unlockedIds = new Set(unlockedAchievements?.map(ua => ua.achievementId) || []);

  const achievementsWithStatus = allAchievements.map(ach => ({
    ...ach,
    unlocked: unlockedIds.has(ach.id),
    unlockedAt: unlockedAchievements?.find(ua => ua.achievementId === ach.id)?.unlockedAt,
  }));

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold text-amber-300">🏆 Conquistas</h1>
      <p className="mt-2 text-gray-400">Seus selos de fidelidade e marcos na comunidade.</p>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievementsWithStatus.map((ach) => {
          const IconComponent = iconMap[ach.icon as keyof typeof iconMap] || Award;
          return (
            <div key={ach.id} className={`border rounded-lg p-6 flex items-center gap-5 transition-all ${
              ach.unlocked 
                ? 'bg-gray-800/50 border-gray-700' 
                : 'bg-gray-900/30 border-dashed border-gray-600 opacity-60'
            }`}>
              <div className={`w-10 h-10 ${ach.unlocked ? ach.color : 'text-gray-500'}`}>
                {ach.unlocked ? <IconComponent /> : <Lock />}
              </div>
              <div>
                <h3 className={`font-bold text-lg ${ach.unlocked ? 'text-white' : 'text-gray-500'}`}>
                  {ach.title}
                </h3>
                <p className={`text-sm ${ach.unlocked ? 'text-gray-400' : 'text-gray-600'}`}>
                  {ach.description}
                </p>
                {ach.unlocked && ach.unlockedAt && (
                  <p className="text-xs text-gray-500 mt-1">
                    Desbloqueado em {new Date(ach.unlockedAt).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {isLoading && <p className="text-center text-gray-500 mt-8">Carregando conquistas...</p>}
    </div>
  );
}
