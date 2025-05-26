import { useState } from 'react';
import { Save, Link, Phone, Instagram, Facebook } from 'lucide-react';
import Card from '../components/Card';

const Configuracoes = () => {
  const [studioData, setStudioData] = useState({
    nome: 'Studio Camila Lash',
    endereco: 'Rua das Flores, 123 - Centro',
    telefone: '(11) 99999-9999',
    whatsapp: '(11) 99999-9999',
    instagram: '@studiocamilalash',
    facebook: 'Studio Camila Lash',
    linkAgendamento: 'studiocamilalash.com/agendar',
    horasFuncionamento: {
      segunda: { inicio: '09:00', fim: '18:00', ativo: true },
      terca: { inicio: '09:00', fim: '18:00', ativo: true },
      quarta: { inicio: '09:00', fim: '18:00', ativo: true },
      quinta: { inicio: '09:00', fim: '18:00', ativo: true },
      sexta: { inicio: '09:00', fim: '18:00', ativo: true },
      sabado: { inicio: '09:00', fim: '16:00', ativo: true },
      domingo: { inicio: '10:00', fim: '14:00', ativo: false }
    }
  });

  const diasSemana = [
    { key: 'segunda', label: 'Segunda-feira' },
    { key: 'terca', label: 'Terça-feira' },
    { key: 'quarta', label: 'Quarta-feira' },
    { key: 'quinta', label: 'Quinta-feira' },
    { key: 'sexta', label: 'Sexta-feira' },
    { key: 'sabado', label: 'Sábado' },
    { key: 'domingo', label: 'Domingo' }
  ];

  const handleSave = () => {
    // Simular salvamento
    alert('Configurações salvas com sucesso!');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Configurações</h1>
        <p className="text-dark-400">Gerencie as configurações do seu studio</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h3 className="text-xl font-semibold text-white mb-6">Informações do Studio</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Nome do Studio</label>
              <input
                type="text"
                value={studioData.nome}
                onChange={(e) => setStudioData({...studioData, nome: e.target.value})}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Endereço</label>
              <input
                type="text"
                value={studioData.endereco}
                onChange={(e) => setStudioData({...studioData, endereco: e.target.value})}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Telefone</label>
                <input
                  type="text"
                  value={studioData.telefone}
                  onChange={(e) => setStudioData({...studioData, telefone: e.target.value})}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  WhatsApp
                </label>
                <input
                  type="text"
                  value={studioData.whatsapp}
                  onChange={(e) => setStudioData({...studioData, whatsapp: e.target.value})}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </form>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold text-white mb-6">Redes Sociais</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                <Instagram className="w-4 h-4 inline mr-2" />
                Instagram
              </label>
              <input
                type="text"
                value={studioData.instagram}
                onChange={(e) => setStudioData({...studioData, instagram: e.target.value})}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                <Facebook className="w-4 h-4 inline mr-2" />
                Facebook
              </label>
              <input
                type="text"
                value={studioData.facebook}
                onChange={(e) => setStudioData({...studioData, facebook: e.target.value})}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                <Link className="w-4 h-4 inline mr-2" />
                Link de Agendamento
              </label>
              <input
                type="text"
                value={studioData.linkAgendamento}
                onChange={(e) => setStudioData({...studioData, linkAgendamento: e.target.value})}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div className="bg-dark-700 rounded-lg p-4">
              <p className="text-dark-300 text-sm mb-2">Link público:</p>
              <p className="text-primary-400 text-sm break-all">
                https://{studioData.linkAgendamento}
              </p>
            </div>
          </form>
        </Card>
      </div>

      <Card>
        <h3 className="text-xl font-semibold text-white mb-6">Horários de Funcionamento</h3>
        <div className="space-y-4">
          {diasSemana.map((dia) => (
            <div key={dia.key} className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-3">
                <span className="text-dark-200">{dia.label}</span>
              </div>
              
              <div className="col-span-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={studioData.horasFuncionamento[dia.key as keyof typeof studioData.horasFuncionamento].ativo}
                    onChange={(e) => {
                      setStudioData({
                        ...studioData,
                        horasFuncionamento: {
                          ...studioData.horasFuncionamento,
                          [dia.key]: {
                            ...studioData.horasFuncionamento[dia.key as keyof typeof studioData.horasFuncionamento],
                            ativo: e.target.checked
                          }
                        }
                      });
                    }}
                    className="rounded border-dark-600 bg-dark-700 text-primary-500"
                  />
                  <span className="text-dark-300 text-sm">Ativo</span>
                </label>
              </div>
              
              <div className="col-span-3">
                <input
                  type="time"
                  value={studioData.horasFuncionamento[dia.key as keyof typeof studioData.horasFuncionamento].inicio}
                  onChange={(e) => {
                    setStudioData({
                      ...studioData,
                      horasFuncionamento: {
                        ...studioData.horasFuncionamento,
                        [dia.key]: {
                          ...studioData.horasFuncionamento[dia.key as keyof typeof studioData.horasFuncionamento],
                          inicio: e.target.value
                        }
                      }
                    });
                  }}
                  disabled={!studioData.horasFuncionamento[dia.key as keyof typeof studioData.horasFuncionamento].ativo}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white text-sm disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div className="col-span-1 text-center">
                <span className="text-dark-400">até</span>
              </div>
              
              <div className="col-span-3">
                <input
                  type="time"
                  value={studioData.horasFuncionamento[dia.key as keyof typeof studioData.horasFuncionamento].fim}
                  onChange={(e) => {
                    setStudioData({
                      ...studioData,
                      horasFuncionamento: {
                        ...studioData.horasFuncionamento,
                        [dia.key]: {
                          ...studioData.horasFuncionamento[dia.key as keyof typeof studioData.horasFuncionamento],
                          fim: e.target.value
                        }
                      }
                    });
                  }}
                  disabled={!studioData.horasFuncionamento[dia.key as keyof typeof studioData.horasFuncionamento].ativo}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white text-sm disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Salvar Configurações</span>
        </button>
      </div>
    </div>
  );
};

export default Configuracoes;
