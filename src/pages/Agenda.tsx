
import { useState } from 'react';
import { Calendar, Clock, Plus, User } from 'lucide-react';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { agendamentos } from '../data/mockData';

const Agenda = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const agendamentosDoDia = agendamentos.filter(a => a.data === selectedDate);

  const proximosDias = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      date: date.toISOString().split('T')[0],
      day: date.getDate(),
      weekday: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
      isToday: i === 0,
      agendamentos: agendamentos.filter(a => a.data === date.toISOString().split('T')[0]).length
    };
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmado': return 'bg-emerald-500';
      case 'Pendente': return 'bg-yellow-500';
      case 'Cancelado': return 'bg-red-500';
      case 'Realizado': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Agenda</h1>
          <p className="text-dark-400">Gerencie seus agendamentos</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Agendamento</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <h3 className="text-xl font-semibold text-white mb-6">Próximos 7 Dias</h3>
            <div className="space-y-3">
              {proximosDias.map((dia) => (
                <button
                  key={dia.date}
                  onClick={() => setSelectedDate(dia.date)}
                  className={`
                    w-full text-left p-4 rounded-lg transition-colors
                    ${selectedDate === dia.date 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-dark-700 hover:bg-dark-600 text-dark-200'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{dia.weekday}</p>
                      <p className="text-sm opacity-80">{dia.day}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{dia.agendamentos} agendamentos</p>
                      {dia.isToday && (
                        <span className="text-xs bg-emerald-500 text-white px-2 py-1 rounded">
                          Hoje
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                {new Date(selectedDate).toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h3>
              <span className="text-dark-400">{agendamentosDoDia.length} agendamentos</span>
            </div>

            <div className="space-y-4">
              {agendamentosDoDia.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-dark-500 mx-auto mb-4" />
                  <p className="text-dark-400">Nenhum agendamento para este dia</p>
                </div>
              ) : (
                agendamentosDoDia.map((agendamento) => (
                  <div key={agendamento.id} className="bg-dark-700 rounded-lg p-4 border-l-4 border-primary-500">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Clock className="w-4 h-4 text-primary-400" />
                          <span className="font-medium text-white">{agendamento.hora}</span>
                          <span className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(agendamento.status)}`}>
                            {agendamento.status}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-3 mb-2">
                          <User className="w-4 h-4 text-dark-400" />
                          <span className="text-white">{agendamento.clienteNome}</span>
                        </div>
                        
                        <p className="text-dark-300 text-sm">{agendamento.servicoNome}</p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-emerald-400 font-semibold">R$ {agendamento.valor}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Agendamento"
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Cliente</label>
            <select className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white">
              <option>Selecione um cliente</option>
              <option>Ana Carolina Silva</option>
              <option>Beatriz Santos</option>
              <option>Camila Rodrigues</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Serviço</label>
            <select className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white">
              <option>Selecione um serviço</option>
              <option>Extensão de Cílios</option>
              <option>Lash Lifting</option>
              <option>Tintura de Cílios</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Data</label>
              <input 
                type="date" 
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Horário</label>
              <input 
                type="time" 
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
              />
            </div>
          </div>
          
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg transition-colors"
            >
              Agendar
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

export default Agenda;
