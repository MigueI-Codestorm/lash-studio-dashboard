
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Calendar, User } from 'lucide-react';

const ClienteDashboard = () => {
  const { profile, signOut } = useAuth();

  const { data: appointments, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['client-appointments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          services (nome, preco),
          clients (nome)
        `)
        .order('data', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('ativo', true)
        .order('nome');

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-dark-900">
      <header className="bg-dark-950 border-b border-dark-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Studio Camila Lash</h1>
            <p className="text-dark-400">Olá, {profile?.nome}!</p>
          </div>
          <Button
            onClick={signOut}
            variant="outline"
            className="border-dark-600 text-dark-300 hover:bg-dark-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <main className="p-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-dark-800 border-dark-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Meus Agendamentos
              </CardTitle>
              <CardDescription className="text-dark-300">
                Próximos atendimentos agendados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {appointmentsLoading ? (
                <p className="text-dark-400">Carregando agendamentos...</p>
              ) : appointments && appointments.length > 0 ? (
                <div className="space-y-3">
                  {appointments.slice(0, 3).map((appointment) => (
                    <div key={appointment.id} className="bg-dark-700 p-3 rounded-lg">
                      <p className="text-white font-medium">{appointment.services?.nome}</p>
                      <p className="text-dark-300 text-sm">
                        {new Date(appointment.data).toLocaleDateString('pt-BR')} às {appointment.hora}
                      </p>
                      <p className="text-primary-400 text-sm">
                        Status: {appointment.status}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-dark-400">Nenhum agendamento encontrado</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-dark-800 border-dark-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="w-5 h-5 mr-2" />
                Serviços Disponíveis
              </CardTitle>
              <CardDescription className="text-dark-300">
                Conheça nossos serviços
              </CardDescription>
            </CardHeader>
            <CardContent>
              {services && services.length > 0 ? (
                <div className="space-y-3">
                  {services.slice(0, 4).map((service) => (
                    <div key={service.id} className="bg-dark-700 p-3 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white font-medium">{service.nome}</p>
                          <p className="text-dark-300 text-sm">{service.descricao}</p>
                        </div>
                        <p className="text-primary-400 font-bold">
                          R$ {service.preco.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-dark-400">Nenhum serviço encontrado</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-dark-800 border-dark-700">
          <CardHeader>
            <CardTitle className="text-white">Informações da Conta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-dark-300 text-sm">Nome</p>
                <p className="text-white">{profile?.nome}</p>
              </div>
              <div>
                <p className="text-dark-300 text-sm">Email</p>
                <p className="text-white">{profile?.email}</p>
              </div>
              <div>
                <p className="text-dark-300 text-sm">Tipo de Conta</p>
                <p className="text-white capitalize">{profile?.tipo_usuario}</p>
              </div>
              {profile?.telefone && (
                <div>
                  <p className="text-dark-300 text-sm">Telefone</p>
                  <p className="text-white">{profile.telefone}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ClienteDashboard;
