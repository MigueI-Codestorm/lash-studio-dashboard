
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Modal from './Modal';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAppointmentSaved: () => void;
  editingAppointment?: any;
}

const AppointmentModal = ({ isOpen, onClose, onAppointmentSaved, editingAppointment }: AppointmentModalProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    client_id: editingAppointment?.client_id || '',
    service_id: editingAppointment?.service_id || '',
    data: editingAppointment?.data || '',
    hora: editingAppointment?.hora || '',
    observacoes: editingAppointment?.observacoes || '',
    status: editingAppointment?.status || 'Pendente',
    valor: editingAppointment?.valor || ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchClients();
      fetchServices();
    }
  }, [isOpen]);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, nome, telefone')
        .order('nome');

      if (error) throw error;
      setClients(data || []);
    } catch (error: any) {
      console.error('Error fetching clients:', error);
      toast.error('Erro ao carregar clientes');
    }
  };

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('id, nome, preco, duracao_min')
        .eq('ativo', true)
        .order('nome');

      if (error) throw error;
      setServices(data || []);
    } catch (error: any) {
      console.error('Error fetching services:', error);
      toast.error('Erro ao carregar serviços');
    }
  };

  const handleServiceChange = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    setFormData({
      ...formData,
      service_id: serviceId,
      valor: service ? service.preco.toString() : ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const appointmentData = {
        client_id: formData.client_id,
        service_id: formData.service_id,
        data: formData.data,
        hora: formData.hora,
        valor: parseFloat(formData.valor),
        observacoes: formData.observacoes || null,
        status: formData.status,
        created_by: user.id
      };

      if (editingAppointment) {
        const { error } = await supabase
          .from('appointments')
          .update({
            ...appointmentData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingAppointment.id);

        if (error) throw error;
        toast.success('Agendamento atualizado com sucesso!');
      } else {
        const { error } = await supabase
          .from('appointments')
          .insert([appointmentData]);

        if (error) throw error;
        toast.success('Agendamento criado com sucesso!');
      }

      onAppointmentSaved();
      onClose();
      setFormData({
        client_id: '', service_id: '', data: '', hora: '',
        observacoes: '', status: 'Pendente', valor: ''
      });
    } catch (error: any) {
      console.error('Error saving appointment:', error);
      toast.error('Erro ao salvar agendamento: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingAppointment ? 'Editar Agendamento' : 'Novo Agendamento'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="client_id">Cliente *</Label>
          <Select value={formData.client_id} onValueChange={(value) => setFormData({ ...formData, client_id: value })}>
            <SelectTrigger className="bg-dark-700 border-dark-600 text-white">
              <SelectValue placeholder="Selecione um cliente" />
            </SelectTrigger>
            <SelectContent className="bg-dark-700 border-dark-600">
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.nome} - {client.telefone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="service_id">Serviço *</Label>
          <Select value={formData.service_id} onValueChange={handleServiceChange}>
            <SelectTrigger className="bg-dark-700 border-dark-600 text-white">
              <SelectValue placeholder="Selecione um serviço" />
            </SelectTrigger>
            <SelectContent className="bg-dark-700 border-dark-600">
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.nome} - R$ {service.preco} ({service.duracao_min}min)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="data">Data *</Label>
            <Input
              id="data"
              type="date"
              value={formData.data}
              onChange={(e) => setFormData({ ...formData, data: e.target.value })}
              required
              className="bg-dark-700 border-dark-600 text-white"
            />
          </div>
          
          <div>
            <Label htmlFor="hora">Hora *</Label>
            <Input
              id="hora"
              type="time"
              value={formData.hora}
              onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
              required
              className="bg-dark-700 border-dark-600 text-white"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="valor">Valor (R$) *</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              value={formData.valor}
              onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
              required
              className="bg-dark-700 border-dark-600 text-white"
            />
          </div>
          
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger className="bg-dark-700 border-dark-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-dark-700 border-dark-600">
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Confirmado">Confirmado</SelectItem>
                <SelectItem value="Concluído">Concluído</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="observacoes">Observações</Label>
          <Textarea
            id="observacoes"
            value={formData.observacoes}
            onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
            className="bg-dark-700 border-dark-600 text-white"
          />
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Salvando...' : editingAppointment ? 'Atualizar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AppointmentModal;
