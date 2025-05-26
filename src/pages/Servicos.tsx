
import { useState } from 'react';
import { Plus, Clock, DollarSign, Edit } from 'lucide-react';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { servicos } from '../data/mockData';

const Servicos = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Serviços</h1>
          <p className="text-dark-400">Gerencie seus serviços e preços</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Serviço</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicos.map((servico) => (
          <Card key={servico.id} className="relative group hover:scale-105 transition-transform duration-200">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="text-dark-400 hover:text-white transition-colors">
                <Edit className="w-4 h-4" />
              </button>
            </div>
            
            <div className="mb-4">
              <div className={`w-12 h-12 ${servico.cor} rounded-lg flex items-center justify-center mb-4`}>
                <span className="text-white text-xl">💄</span>
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-2">{servico.nome}</h3>
              <span className="inline-block bg-dark-700 text-dark-300 px-2 py-1 rounded text-sm">
                {servico.categoria}
              </span>
            </div>

            <p className="text-dark-300 text-sm mb-6 line-clamp-3">
              {servico.descricao}
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span className="text-dark-300 text-sm">Preço</span>
                </div>
                <span className="text-emerald-400 font-bold">R$ {servico.valor}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-dark-300 text-sm">Duração</span>
                </div>
                <span className="text-blue-400 font-medium">{servico.duracao}min</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-dark-700">
              <div className="flex space-x-2">
                <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg transition-colors text-sm">
                  Agendar
                </button>
                <button className="flex-1 bg-dark-700 hover:bg-dark-600 text-white py-2 rounded-lg transition-colors text-sm">
                  Editar
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{servicos.length}</p>
            <p className="text-dark-400 text-sm">Serviços Disponíveis</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-400">R$ {Math.max(...servicos.map(s => s.valor))}</p>
            <p className="text-dark-400 text-sm">Serviço Mais Caro</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">{Math.round(servicos.reduce((acc, s) => acc + s.duracao, 0) / servicos.length)}min</p>
            <p className="text-dark-400 text-sm">Duração Média</p>
          </div>
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Serviço"
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Nome do Serviço</label>
            <input
              type="text"
              placeholder="Ex: Extensão de Cílios Premium"
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Categoria</label>
            <select className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>Alongamento</option>
              <option>Curvatura</option>
              <option>Coloração</option>
              <option>Manutenção</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Preço (R$)</label>
              <input
                type="number"
                placeholder="150"
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Duração (min)</label>
              <input
                type="number"
                placeholder="120"
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Descrição</label>
            <textarea
              placeholder="Descrição detalhada do serviço..."
              rows={3}
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg transition-colors"
            >
              Salvar Serviço
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 bg-dark-700 hover:bg-dark-600 text-white py-2 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Servicos;
