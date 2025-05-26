
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Calendar, Users, DollarSign, Clock, TrendingUp, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import AppointmentModal from '@/components/AppointmentModal';
import ClientRaffle from '@/components/ClientRaffle';
import StatsCard from '@/components/StatsCard';

interface DashboardStats {
  appointments_today: number;
  revenue_today: number;
  total_clients: number;
  services_completed: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    appointments_today: 0,
    revenue_today: 0,
    total_clients: 0,
    services_completed: 0
  });
  const [todayAppointments, setTodayAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch dashboard stats using the database function
      const { data: statsData, error: statsError } = await supabase.rpc('get_dashboard_stats');
      
      if (statsError) {
        console.error('Stats error:', statsError);
      } else if (statsData && statsData.length > 0) {
        setStats(statsData[0]);
      }

      // Fetch today's appointments
      const today = new Date().toISOString().split('T')[0];
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select(`
          *,
          client:clients(nome, telefone),
          service:services(nome, duracao_min)
        `)
        .eq('data', today)
        .order('hora');

      if (appointmentsError) {
        console.error('Appointments error:', appointmentsError);
      } else {
        setTodayAppointments(appointmentsData || []);
      }

    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmado': return 'bg-green-900 text-green-300';
      case 'Concluído': return 'bg-blue-900 text-blue-300';
      case 'Cancelado': return 'bg-red-900 text-red-300';
      default: return 'bg-yellow-900 text-yellow-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-dark-400">Visão geral do seu estúdio</p>
        </div>
        <Button
          onClick={() => setIsAppointmentModalOpen(true)}
          className="bg-primary-600 hover:bg-primary-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Agendamento
        </Button>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Agendamentos Hoje"
          value={stats.appointments_today.toString()}
          icon={<Calendar className="w-6 h-6 text-white" />}
          color="bg-blue-600"
          trend={{ value: "Hoje", isPositive: true }}
        />
        
        <StatsCard
          title="Receita Hoje"
          value={formatCurrency(stats.revenue_today)}
          icon={<DollarSign className="w-6 h-6 text-white" />}
          color="bg-emerald-600"
          trend={{ value: "Hoje", isPositive: true }}
        />
        
        <StatsCard
          title="Total de Clientes"
          value={stats.total_clients.toString()}
          icon={<Users className="w-6 h-6 text-white" />}
          color="bg-purple-600"
          trend={{ value: "Cadastrados", isPositive: true }}
        />
        
        <StatsCard
          title="Serviços do Mês"
          value={stats.services_completed.toString()}
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          color="bg-orange-600"
          trend={{ value: "Concluídos", isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Agendamentos de hoje */}
        <div className="lg:col-span-2">
          <Card className="bg-dark-800 border-dark-700">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Agendamentos de Hoje</h3>
              
              {todayAppointments.length === 0 ? (
                <div className="text-center text-dark-400 py-8">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-dark-500" />
                  <p>Nenhum agendamento para hoje</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {todayAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 bg-dark-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-primary-900 p-2 rounded-lg">
                          <Clock className="w-5 h-5 text-primary-300" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{appointment.hora}</p>
                          <p className="text-sm text-dark-300">
                            {appointment.client?.nome} • {appointment.service?.nome}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                        <p className="text-sm text-dark-300 mt-1">
                          R$ {appointment.valor}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Cliente sorteado */}
        <div className="lg:col-span-1">
          <ClientRaffle />
        </div>
      </div>

      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        onAppointmentSaved={fetchDashboardData}
      />
    </div>
  );
};

export default Dashboard;
