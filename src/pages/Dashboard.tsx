
import { useState, useEffect } from 'react';
import { Calendar, Users, Package, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import StatsCard from '../components/StatsCard';
import Card from '../components/Card';
import ClientRaffle from '../components/ClientRaffle';

interface DashboardStats {
  appointments_today: number;
  revenue_today: number;
  total_clients: number;
  services_completed: number;
}

interface Appointment {
  id: string;
  data: string;
  hora: string;
  valor: number;
  client: { nome: string };
  service: { nome: string };
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    appointments_today: 0,
    revenue_today: 0,
    total_clients: 0,
    services_completed: 0
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [studioName, setStudioName] = useState('Studio Camila Lash');

  useEffect(() => {
    fetchDashboardData();
    fetchStudioName();
  }, []);

  const fetchStudioName = async () => {
    try {
      const { data, error } = await supabase.rpc('get_studio_name');
      
      if (error) {
        console.error('Error fetching studio name:', error);
        return;
      }
      
      if (data) {
        setStudioName(data);
      }
    } catch (error) {
      console.error('Error fetching studio name:', error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      // Buscar estatísticas do dashboard
      const { data: statsData, error: statsError } = await supabase.rpc('get_dashboard_stats');
      
      if (statsError) {
        console.error('Error fetching dashboard stats:', statsError);
        throw statsError;
      }
      
      if (statsData && statsData.length > 0) {
        setStats(statsData[0]);
      }

      // Buscar próximos agendamentos
      const today = new Date().toISOString().split('T')[0];
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select(`
          id,
          data,
          hora,
          valor,
          clients!inner(nome),
          services!inner(nome)
        `)
        .gte('data', today)
        .order('data', { ascending: true })
        .order('hora', { ascending: true })
        .limit(5);

      if (appointmentsError) {
        console.error('Error fetching appointments:', appointmentsError);
        throw appointmentsError;
      }
      
      // Transformar os dados para o formato esperado
      const formattedAppointments = appointmentsData?.map(apt => ({
        id: apt.id,
        data: apt.data,
        hora: apt.hora,
        valor: apt.valor,
        client: { nome: apt.clients.nome },
        service: { nome: apt.services.nome }
      })) || [];
      
      setAppointments(formattedAppointments);
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Dados mockados para o gráfico da semana
  const weeklyData = [
    { dia: 'Seg', agendamentos: 12 },
    { dia: 'Ter', agendamentos: 19 },
    { dia: 'Qua', agendamentos: 15 },
    { dia: 'Qui', agendamentos: 22 },
    { dia: 'Sex', agendamentos: 28 },
    { dia: 'Sáb', agendamentos: 35 },
    { dia: 'Dom', agendamentos: 8 }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00-03:00');
    return date.toLocaleDateString('pt-BR');
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
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard - {studioName}</h1>
        <p className="text-dark-400">Visão geral do seu negócio</p>
      </div>

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
          trend={{ value: "Concluídos", isPositive: true }}
        />
        
        <StatsCard
          title="Total de Clientes"
          value={stats.total_clients.toString()}
          icon={<Users className="w-6 h-6 text-white" />}
          color="bg-purple-600"
          trend={{ value: "Cadastrados", isPositive: true }}
        />
        
        <StatsCard
          title="Serviços Este Mês"
          value={stats.services_completed.toString()}
          icon={<Package className="w-6 h-6 text-white" />}
          color="bg-orange-600"
          trend={{ value: "Concluídos", isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-xl font-semibold text-white mb-6">Agendamentos da Semana</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="dia" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Bar dataKey="agendamentos" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div>
          <ClientRaffle />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h3 className="text-xl font-semibold text-white mb-6">Próximos Agendamentos</h3>
          <div className="space-y-4">
            {appointments.length === 0 ? (
              <div className="text-center text-dark-400 py-8">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-dark-500" />
                <p>Nenhum agendamento próximo</p>
              </div>
            ) : (
              appointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 bg-dark-700 rounded-lg">
                  <div>
                    <p className="font-medium text-white">{appointment.client?.nome}</p>
                    <p className="text-sm text-dark-400">{appointment.service?.nome}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-primary-400">
                      {formatDate(appointment.data)}
                    </p>
                    <p className="text-sm text-dark-400">{appointment.hora}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Receita Mensal</h3>
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-400">{formatCurrency(stats.revenue_today * 30)}</p>
              <p className="text-dark-400 text-sm mt-2">Estimativa baseada em hoje</p>
              <div className="w-full bg-dark-700 rounded-full h-2 mt-4">
                <div className="bg-emerald-400 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Serviço Mais Popular</h3>
            <div className="text-center">
              <p className="text-xl font-bold text-purple-400">Extensão de Cílios</p>
              <p className="text-dark-400 text-sm mt-2">{stats.services_completed} realizados</p>
              <p className="text-emerald-400 text-sm mt-1">Este mês</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
