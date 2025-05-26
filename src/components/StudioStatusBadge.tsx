
import { Clock, Calendar } from 'lucide-react';
import { useStudioStatus } from '@/hooks/useStudioStatus';

const StudioStatusBadge = () => {
  const { studioStatus, loading } = useStudioStatus();

  if (loading) {
    return (
      <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
        <div className="flex items-center">
          <Clock className="w-5 h-5 text-dark-400 mr-3" />
          <span className="text-dark-300">Carregando horários...</span>
        </div>
      </div>
    );
  }

  if (!studioStatus) {
    return (
      <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
        <div className="flex items-center">
          <Clock className="w-5 h-5 text-dark-400 mr-3" />
          <span className="text-dark-300">Horários não configurados</span>
        </div>
      </div>
    );
  }

  const dayNames: { [key: string]: string } = {
    segunda: 'Segunda-feira',
    terca: 'Terça-feira', 
    quarta: 'Quarta-feira',
    quinta: 'Quinta-feira',
    sexta: 'Sexta-feira',
    sabado: 'Sábado',
    domingo: 'Domingo'
  };

  return (
    <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-primary-400 mr-3" />
            <span className="text-white font-medium">Status do Studio</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            studioStatus.is_open 
              ? 'bg-green-900 text-green-300' 
              : 'bg-red-900 text-red-300'
          }`}>
            {studioStatus.is_open ? 'Aberto' : 'Fechado'}
          </span>
        </div>
        
        <div className="flex items-center text-dark-300">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{dayNames[studioStatus.current_day] || studioStatus.current_day}</span>
        </div>
        
        {studioStatus.opening_time && studioStatus.closing_time && (
          <div className="text-sm text-dark-300">
            Funcionamento: {studioStatus.opening_time} às {studioStatus.closing_time}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudioStatusBadge;
