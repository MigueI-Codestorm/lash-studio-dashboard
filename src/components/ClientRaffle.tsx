
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Gift, Users, Shuffle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RandomClient {
  id: string;
  nome: string;
  telefone: string;
}

const ClientRaffle = () => {
  const [selectedClient, setSelectedClient] = useState<RandomClient | null>(null);
  const [isRaffling, setIsRaffling] = useState(false);

  const handleRaffle = async () => {
    setIsRaffling(true);
    try {
      const { data, error } = await supabase.rpc('get_random_client');
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setSelectedClient(data[0]);
        toast.success('Cliente sorteado com sucesso!');
      } else {
        toast.error('Nenhum cliente encontrado para o sorteio');
      }
    } catch (error: any) {
      console.error('Error during raffle:', error);
      toast.error('Erro ao realizar sorteio');
    } finally {
      setIsRaffling(false);
    }
  };

  return (
    <Card className="p-6 bg-dark-800 border-dark-700">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full">
            <Gift className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">Sorteio de Cliente</h3>
          <p className="text-dark-400">Sorteie um cliente aleatório para promoções especiais</p>
        </div>

        {selectedClient ? (
          <div className="bg-gradient-to-r from-purple-900 to-pink-900 p-6 rounded-lg border-2 border-purple-500">
            <div className="flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-purple-300 mr-2" />
              <span className="text-purple-300 font-medium">Cliente Sorteado</span>
            </div>
            <h4 className="text-2xl font-bold text-white mb-2">{selectedClient.nome}</h4>
            <p className="text-purple-200">📞 {selectedClient.telefone}</p>
          </div>
        ) : (
          <div className="bg-dark-700 p-6 rounded-lg border-2 border-dashed border-dark-600">
            <Users className="w-12 h-12 text-dark-500 mx-auto mb-4" />
            <p className="text-dark-400">Clique no botão abaixo para sortear um cliente</p>
          </div>
        )}

        <Button
          onClick={handleRaffle}
          disabled={isRaffling}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3"
        >
          {isRaffling ? (
            <>
              <Shuffle className="w-5 h-5 mr-2 animate-spin" />
              Sorteando...
            </>
          ) : (
            <>
              <Shuffle className="w-5 h-5 mr-2" />
              Sortear Cliente
            </>
          )}
        </Button>

        {selectedClient && (
          <Button
            onClick={() => setSelectedClient(null)}
            variant="outline"
            className="w-full border-dark-600 text-dark-300 hover:bg-dark-700"
          >
            Novo Sorteio
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ClientRaffle;
