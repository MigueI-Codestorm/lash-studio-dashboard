
import { Calendar, Users, DollarSign, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import NotificationButton from './NotificationButton';

const Header = () => {
  const { profile, signOut } = useAuth();
  const [studioName, setStudioName] = useState('Studio Camila Lash');
  
  const hoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    fetchStudioName();
  }, []);

  const fetchStudioName = async () => {
    try {
      const { data, error } = await supabase
        .from('studio_settings')
        .select('nome')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching studio name:', error);
        return;
      }

      if (data && data.length > 0 && data[0].nome) {
        setStudioName(data[0].nome);
      }
    } catch (error) {
      console.error('Error fetching studio name:', error);
    }
  };

  return (
    <header className="bg-dark-950 border-b border-dark-800 px-6 lg:px-8 py-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{studioName}</h2>
          <p className="text-dark-400 text-sm mt-1 capitalize">{hoje}</p>
          {profile && (
            <p className="text-primary-400 text-sm">Olá, {profile.nome}! ({profile.tipo_usuario})</p>
          )}
        </div>
        
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <div className="flex items-center space-x-2 bg-dark-800 px-4 py-2 rounded-lg">
            <Calendar className="w-4 h-4 text-primary-400" />
            <span className="text-sm text-dark-300">6 agendamentos hoje</span>
          </div>
          
          <div className="flex items-center space-x-2 bg-dark-800 px-4 py-2 rounded-lg">
            <Users className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-dark-300">5 clientes ativos</span>
          </div>
          
          <div className="flex items-center space-x-2 bg-dark-800 px-4 py-2 rounded-lg">
            <DollarSign className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-dark-300">R$ 670 hoje</span>
          </div>

          <NotificationButton />

          <Button
            onClick={signOut}
            variant="outline"
            size="sm"
            className="border-dark-600 text-dark-300 hover:bg-dark-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
