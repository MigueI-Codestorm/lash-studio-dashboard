
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Clock, Download } from 'lucide-react';
import StudioSettingsModal from '@/components/StudioSettingsModal';
import BusinessHoursModal from '@/components/BusinessHoursModal';

const Configuracoes = () => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isBusinessHoursModalOpen, setIsBusinessHoursModalOpen] = useState(false);

  const handleExportData = () => {
    // Placeholder for future export functionality
    console.log('Export functionality will be implemented here');
  };

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
            onClick={() => setIsBusinessHoursModalOpen(true)}
            className="bg-primary-600 hover:bg-primary-700"
          >
            <Clock className="w-4 h-4 mr-2" />
            Configurar Horários
          </Button>
        </div>

        <div className="bg-dark-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Backup e Exportação</h2>
          <p className="text-dark-300 mb-4">
            Faça backup dos seus dados ou exporte relatórios em diferentes formatos.
          </p>
          <Button 
            onClick={handleExportData}
            variant="outline"
            className="border-primary-600 text-primary-400 hover:bg-primary-600 hover:text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar Dados
          </Button>
        </div>
      </div>

      <StudioSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      <BusinessHoursModal
        isOpen={isBusinessHoursModalOpen}
        onClose={() => setIsBusinessHoursModalOpen(false)}
      />
    </div>
  );
};

export default Configuracoes;
