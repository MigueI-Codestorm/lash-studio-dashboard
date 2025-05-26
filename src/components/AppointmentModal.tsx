
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface Client {
  id: string;
  nome: string;
  telefone: string;
  email?: string;
}

interface Service {
  id: string;
  nome: string;
  preco: number;
  duracao_min: number;
}

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAppointmentSaved: () => void;
  editingAppointment?: any;
}

const AppointmentModal = ({ isOpen, onClose, onAppointmentSaved, editingAppointment }: AppointmentModalProps) => {
  const { profile } = useAuth();
  const [formData, setFormData] = useState({
    client_id: '',
    service_id: '',
    data: new Date().toISOString().split('T')[0],
    hora: '',
    observacoes: '',
    status: 'Pendente' as const
  });
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchData();
      if (editingAppointment) {
        setFormData({
          client_id: editingAppointment.client_id || '',
          service_id: editingAppointment.service_id || '',
          data: editingAppointment.data || new Date().toISOString().split('T')[0],
          hora: editingAppointment.hora || '',
          observacoes: editingAppointment.observacoes || '',
          status: editingAppointment.status || 'Pendente'
        });
      } else {
        resetForm();
      }
    }
  }, [isOpen, editingAppointment]);

  const resetForm = () => {
    setFormData({
      client_id: '',
      service_id: '',
      data: new Date().toISOString().split('T')[0],
      hora: '',
      observacoes: '',
      status: 'Pendente'
    });
  };

  const fetchData = async () => {
    try {
      setLoadingData(true);
      
      // Fetch clients
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('id, nome, telefone, email')
        .order('nome');

      if (clientsError) throw clientsError;

      // Fetch services
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('id, nome, preco, duracao_min')
        .eq('ativo', true)
        .order('nome');

      if (servicesError) throw servicesError;

      setClients(clientsData || []);
      setServices(servicesData || []);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error('Erro ao carregar dados: ' + error.message);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) {
      toast.error('Usuário não autenticado');
      return;
    }

    setLoading(true);

    try {
      const selectedService = services.find(s => s.id === formData.service_id);
      if (!selectedService) {
        throw new Error('Serviço não encontrado');
      }

      const appointmentData = {
        client_id: formData.client_id,
        service_id: formData.service_id,
        data: formData.data,
        hora: formData.hora,
        observacoes: formData.observacoes || null,
        status: formData.status,
        valor: selectedService.preco,
        created_by: profile.id
      };

      if (editingAppointment) {
        const { error } = await supabase
          .from('appointments')
          .update(appointmentData)
          .eq('id', editingAppointment.id);

        if (error) throw error;
        toast.success('Agendamento atualizado com sucesso!');
      } else {
        const { error } = await supabase
          .from('appointments')
          .insert(appointmentData);

        if (error) throw error;
        toast.success('Agendamento criado com sucesso!');
      }

      onAppointmentSaved();
      onClose();
    } catch (error: any) {
      console.error('Error saving appointment:', error);
      toast.error(error.message || 'Erro ao salvar agendamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dark-800 border-dark-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingAppointment ? 'Editar Agendamento' : 'Novo Agendamento'}
          </DialogTitle>
        </DialogHeader>

        {loadingData ? (
          <div className="p-6 text-center">Carregando...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client">Cliente</Label>
              <Select
                value={formData.client_id}
                onValueChange={(value) => setFormData({ ...formData, client_id: value })}
              >
                <SelectTrigger className="bg-dark-700 border-dark-600">
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

            <div className="space-y-2">
              <Label htmlFor="service">Serviço</Label>
              <Select
                value={formData.service_id}
                onValueChange={(value) => setFormData({ ...formData, service_id: value })}
              >
                <SelectTrigger className="bg-dark-700 border-dark-600">
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

            <div className="space-y-2">
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                className="bg-dark-700 border-dark-600"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hora">Horário</Label>
              <Input
                id="hora"
                type="time"
                value={formData.hora}
                onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                className="bg-dark-700 border-dark-600"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'Pendente' | 'Confirmado' | 'Concluído' | 'Cancelado') => 
                  setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="bg-dark-700 border-dark-600">
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

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                className="bg-dark-700 border-dark-600"
                placeholder="Observações do agendamento (opcional)"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-dark-600 text-dark-300 hover:bg-dark-700"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading || !formData.client_id || !formData.service_id}
                className="flex-1"
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;
