
import { useState } from 'react';
import { Search, Plus, Eye, Phone, Mail, Calendar } from 'lucide-react';
import Card from '../components/Card';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { clientes, Cliente } from '../data/mockData';

const Clientes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredClients = clientes.filter(cliente => {
    const matchesSearch = cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliente.telefone.includes(searchTerm);
    const matchesTag = selectedTag === '' || cliente.tag === selectedTag;
    return matchesSearch && matchesTag;
  });

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'VIP': return 'bg-purple-500';
      case 'Nova': return 'bg-emerald-500';
      case 'Recorrente': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const columns = [
    { key: 'nome', label: 'Nome' },
    { key: 'telefone', label: 'Telefone' },
    {
      key: 'ultimoAtendimento',
      label: 'Último Atendimento',
      render: (value: string) => new Date(value).toLocaleDateString('pt-BR')
    },
    { key: 'servicoFeito', label: 'Último Serviço' },
    {
      key: 'tag',
      label: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs text-white ${getTagColor(value)}`}>
          {value}
        </span>
      )
    },
    {
      key: 'valor',
      label: 'Valor',
      render: (value: number) => `R$ ${value}`
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (_, row: Cliente) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedClient(row);
            setIsModalOpen(true);
          }}
          className="text-primary-400 hover:text-primary-300 transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Clientes</h1>
          <p className="text-dark-400">Gerencie sua base de clientes</p>
        </div>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Novo Cliente</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por nome ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-dark-800 border border-dark-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Todas as tags</option>
          <option value="VIP">VIP</option>
          <option value="Nova">Nova</option>
          <option value="Recorrente">Recorrente</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{clientes.length}</p>
            <p className="text-dark-400 text-sm">Total de Clientes</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-400">{clientes.filter(c => c.tag === 'VIP').length}</p>
            <p className="text-dark-400 text-sm">Clientes VIP</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-400">{clientes.filter(c => c.tag === 'Nova').length}</p>
            <p className="text-dark-400 text-sm">Novos Clientes</p>
          </div>
        </Card>
      </div>

      <Card>
        <Table 
          columns={columns} 
          data={filteredClients}
          onRowClick={(client) => {
            setSelectedClient(client);
            setIsModalOpen(true);
          }}
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedClient(null);
        }}
        title={selectedClient ? `Ficha - ${selectedClient.nome}` : ''}
      >
        {selectedClient && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {selectedClient.nome.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">{selectedClient.nome}</h3>
                <span className={`px-2 py-1 rounded-full text-xs text-white ${getTagColor(selectedClient.tag)}`}>
                  {selectedClient.tag}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-dark-400" />
                  <span className="text-dark-200">{selectedClient.telefone}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-dark-400" />
                  <span className="text-dark-200">{selectedClient.email}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-dark-400" />
                  <span className="text-dark-200">
                    Nascimento: {new Date(selectedClient.dataNascimento).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-dark-400 text-sm">Último Atendimento</p>
                  <p className="text-white">{new Date(selectedClient.ultimoAtendimento).toLocaleDateString('pt-BR')}</p>
                </div>
                
                <div>
                  <p className="text-dark-400 text-sm">Último Serviço</p>
                  <p className="text-white">{selectedClient.servicoFeito}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Histórico de Atendimentos</h4>
              <div className="space-y-3">
                {selectedClient.historico.map((atendimento, index) => (
                  <div key={index} className="bg-dark-700 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white font-medium">{atendimento.servico}</p>
                        <p className="text-dark-400 text-sm">
                          {new Date(atendimento.data).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <span className="text-emerald-400 font-semibold">
                        R$ {atendimento.valor}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Clientes;
