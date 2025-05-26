
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import AppointmentModal from '@/components/AppointmentModal';

const Agenda = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<any>(null);

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  const fetchAppointments = async () => {
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          client:clients(nome, telefone),
          service:services(nome, duracao_min)
        `)
        .eq('data', dateStr)
        .order('hora');

      if (error) throw error;
      setAppointments(data || []);
    } catch (error: any) {
      console.error('Error fetching appointments:', error);
      toast.error('Erro ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este agendamento?')) return;

    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Agendamento excluído com sucesso!');
      fetchAppointments();
    } catch (error: any) {
      console.error('Error deleting appointment:', error);
      toast.error('Erro ao excluir agendamento: ' + error.message);
    }
  };

  const handleEdit = (appointment: any) => {
    setEditingAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAppointment(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmado': return 'bg-green-900 text-green-300';
      case 'Concluído': return 'bg-blue-900 text-blue-300';
      case 'Cancelado': return 'bg-red-900 text-red-300';
      default: return 'bg-yellow-900 text-yellow-300';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Agenda</h1>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-600 hover:bg-primary-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Agendamento
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-dark-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Selecionar Data</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border border-dark-700"
            />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-dark-800 rounded-lg">
            <div className="p-4 border-b border-dark-700">
              <h3 className="text-lg font-semibold text-white">
                Agendamentos para {selectedDate.toLocaleDateString('pt-BR')}
              </h3>
            </div>

            {loading ? (
              <div className="p-6 text-center text-dark-300">Carregando...</div>
            ) : appointments.length === 0 ? (
              <div className="p-6 text-center text-dark-300">
                Nenhum agendamento para esta data
              </div>
            ) : (
              <div className="divide-y divide-dark-700">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="p-4 hover:bg-dark-700">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-white font-medium">
                            {appointment.hora}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </div>
                        <div className="text-dark-300">
                          <p><strong>Cliente:</strong> {appointment.client?.nome}</p>
                          <p><strong>Telefone:</strong> {appointment.client?.telefone}</p>
                          <p><strong>Serviço:</strong> {appointment.service?.nome}</p>
                          <p><strong>Duração:</strong> {appointment.service?.duracao_min} min</p>
                          <p><strong>Valor:</strong> R$ {appointment.valor}</p>
                          {appointment.observacoes && (
                            <p><strong>Observações:</strong> {appointment.observacoes}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(appointment)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(appointment.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAppointmentSaved={fetchAppointments}
        editingAppointment={editingAppointment}
      />
    </div>
  );
};

export default Agenda;
