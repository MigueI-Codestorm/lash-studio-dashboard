
import StatsCard from '@/components/StatsCard';
import { Calendar, DollarSign, Users, TrendingUp } from 'lucide-react';
import ClientRaffle from '@/components/ClientRaffle';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Agendamentos Hoje"
          value="6"
          icon={<Calendar className="w-6 h-6 text-white" />}
          color="bg-blue-500"
          trend={{
            value: "+12%",
            isPositive: true
          }}
        />
        <StatsCard
          title="Receita Hoje"
          value="R$ 670"
          icon={<DollarSign className="w-6 h-6 text-white" />}
          color="bg-green-500"
          trend={{
            value: "+8%",
            isPositive: true
          }}
        />
        <StatsCard
          title="Clientes Ativos"
          value="142"
          icon={<Users className="w-6 h-6 text-white" />}
          color="bg-purple-500"
          trend={{
            value: "+23%",
            isPositive: true
          }}
        />
        <StatsCard
          title="Taxa de Crescimento"
          value="15.3%"
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          color="bg-orange-500"
          trend={{
            value: "+5%",
            isPositive: true
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-dark-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Próximos Agendamentos</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-dark-700 rounded-lg">
                <div>
                  <p className="font-medium text-white">Maria Silva</p>
                  <p className="text-sm text-dark-400">Extensão de Cílios</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white">14:00</p>
                  <p className="text-xs text-dark-400">Hoje</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-dark-700 rounded-lg">
                <div>
                  <p className="font-medium text-white">Ana Costa</p>
                  <p className="text-sm text-dark-400">Manutenção</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white">16:30</p>
                  <p className="text-xs text-dark-400">Hoje</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <ClientRaffle />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
