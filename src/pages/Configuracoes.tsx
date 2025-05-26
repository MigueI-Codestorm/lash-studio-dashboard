
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import StudioSettingsModal from '@/components/StudioSettingsModal';

const Configuracoes = () => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Configurações</h1>

      <div className="grid gap-6">
        <div className="bg-dark-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Configurações do Studio</h2>
          <p className="text-dark-300 mb-4">
            Configure as informações básicas do seu studio, como nome, endereço, telefone e redes sociais.
          </p>
          <Button 
            onClick={() => setIsSettingsModalOpen(true)}
            className="bg-primary-600 hover:bg-primary-700"
          >
            <Settings className="w-4 h-4 mr-2" />
            Editar Configurações
          </Button>
        </div>

        <div className="bg-dark-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Horários de Funcionamento</h2>
          <p className="text-dark-300 mb-4">
            Configure os horários de funcionamento do seu studio para cada dia da semana.
          </p>
          <Button 
            variant="outline"
            disabled
            className="border-dark-600 text-dark-400"
          >
            Em breve
          </Button>
        </div>

        <div className="bg-dark-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Backup e Exportação</h2>
          <p className="text-dark-300 mb-4">
            Faça backup dos seus dados ou exporte relatórios em diferentes formatos.
          </p>
          <Button 
            variant="outline"
            disabled
            className="border-dark-600 text-dark-400"
          >
            Em breve
          </Button>
        </div>
      </div>

      <StudioSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
};

export default Configuracoes;
