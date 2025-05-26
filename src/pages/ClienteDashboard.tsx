
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Phone, Plus } from 'lucide-react';
import { toast } from 'sonner';
import AppointmentModal from '@/components/AppointmentModal';
import StudioStatusBadge from '@/components/StudioStatusBadge';

const ClienteDashboard = () => {
  const { profile, signOut } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (profile) {
      fetchMyAppointments();
    }
  }, [profile]);

  const fetchMyAppointments = async () => {
    try {
      // Get client data first
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('criado_por', profile?.id)
        .single();

      if (clientError) {
        console.error('No client profile found');
        setLoading(false);
        return;
      }

      // Get appointments for this client
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          service:services(nome, duracao_min, preco)
        `)
        .eq('client_id', clientData.id)
        .gte('data', new Date().toISOString().split('T')[0])
        .order('data', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error: any) {
      console.error('Error fetching appointments:', error);
      toast.error('Erro ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen bg-dark-900">
      <header className="bg-dark-950 border-b border-dark-800 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Studio Camila Lash</h1>
            <p className="text-primary-400">Bem-vinda, {profile?.nome}!</p>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="bg-primary-600 hover:bg-primary-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Agendamento
            </Button>
            <Button
              onClick={signOut}
              variant="outline"
              className="border-dark-600 text-dark-300 hover:bg-dark-700"
            >
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid gap-8">
          {/* Studio Status */}
          <StudioStatusBadge />

          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-dark-800 p-6 rounded-lg border border-dark-700">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-primary-400 mr-3" />
                <div>
                  <p className="text-dark-300">Próximos Agendamentos</p>
                  <p className="text-2xl font-bold text-white">{appointments.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-dark-800 p-6 rounded-lg border border-dark-700">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-emerald-400 mr-3" />
                <div>
                  <p className="text-dark-300">Próximo Horário</p>
                  <p className="text-lg font-bold text-white">
                    {appointments.length > 0 
                      ? `${appointments[0].data} ${appointments[0].hora}`
                      : 'Nenhum'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-dark-800 p-6 rounded-lg border border-dark-700">
              <div className="flex items-center">
                <User className="w-8 h-8 text-yellow-400 mr-3" />
                <div>
                  <p className="text-dark-300">Perfil</p>
                  <p className="text-lg font-bold text-white">Cliente</p>
                </div>
              </div>
            </div>
          </div>

          {/* Appointments List */}
          <div className="bg-dark-800 rounded-lg border border-dark-700">
            <div className="p-6 border-b border-dark-700">
              <h2 className="text-xl font-semibold text-white">Meus Agendamentos</h2>
              <p className="text-dark-300 mt-1">Acompanhe seus próximos atendimentos</p>
            </div>

            {loading ? (
              <div className="p-6 text-center text-dark-300">Carregando...</div>
            ) : appointments.length === 0 ? (
              <div className="p-6 text-center text-dark-300">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-dark-500" />
                <p>Você não possui agendamentos futuros.</p>
                <Button 
                  onClick={() => setIsModalOpen(true)}
                  className="mt-4 bg-primary-600 hover:bg-primary-700"
                >
                  Agendar Agora
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-dark-700">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-primary-900 p-3 rounded-lg">
                          <Calendar className="w-6 h-6 text-primary-300" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">
                            {appointment.service?.nome}
                          </h3>
                          <div className="flex items-center text-dark-300 mt-1">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{new Date(appointment.data).toLocaleDateString('pt-BR')}</span>
                            <Clock className="w-4 h-4 ml-4 mr-2" />
                            <span>{appointment.hora}</span>
                          </div>
                          <div className="flex items-center text-dark-300 mt-1">
                            <span>Duração: {appointment.service?.duracao_min} min</span>
                            <span className="mx-2">•</span>
                            <span>R$ {appointment.valor}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 text-sm rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                    {appointment.observacoes && (
                      <div className="mt-3 p-3 bg-dark-700 rounded text-dark-300">
                        <strong>Observações:</strong> {appointment.observacoes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="bg-dark-800 p-6 rounded-lg border border-dark-700">
            <h3 className="text-lg font-semibold text-white mb-4">Contato</h3>
            <div className="flex items-center text-dark-300">
              <Phone className="w-5 h-5 mr-3 text-primary-400" />
              <span>Entre em contato conosco: (11) 99999-9999</span>
            </div>
          </div>
        </div>
      </main>

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAppointmentSaved={fetchMyAppointments}
      />
    </div>
  );
};

export default ClienteDashboard;
