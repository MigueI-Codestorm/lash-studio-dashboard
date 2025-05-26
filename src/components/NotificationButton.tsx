
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Send, Phone, MessageSquare, User, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface NextAppointment {
  appointment_id: string;
  client_name: string;
  client_phone: string;
  appointment_date: string;
  appointment_time: string;
  service_name: string;
}

const NotificationButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [nextAppointment, setNextAppointment] = useState<NextAppointment | null>(null);
  const [loading, setLoading] = useState(false);
  const [sendingWhatsApp, setSendingWhatsApp] = useState(false);
  
  const [notificationData, setNotificationData] = useState({
    tipo: 'lembrete',
    mensagem: '',
    client_id: '',
    appointment_id: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchNextAppointment();
    }
  }, [isOpen]);

  const fetchNextAppointment = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_next_appointment');
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const appointment = data[0];
        setNextAppointment(appointment);
        
        const defaultMessage = `Olá ${appointment.client_name}! 👋\n\nLembrando do seu agendamento:\n📅 Data: ${new Date(appointment.appointment_date).toLocaleDateString('pt-BR')}\n⏰ Horário: ${appointment.appointment_time}\n💄 Serviço: ${appointment.service_name}\n\nEstamos te esperando! ✨`;
        
        setNotificationData({
          tipo: 'lembrete',
          mensagem: defaultMessage,
          client_id: '',
          appointment_id: appointment.appointment_id
        });
      } else {
        toast.info('Nenhum agendamento encontrado para hoje');
      }
    } catch (error: any) {
      console.error('Error fetching next appointment:', error);
      toast.error('Erro ao buscar próximo agendamento');
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async () => {
    if (!notificationData.mensagem.trim()) {
      toast.error('Por favor, digite uma mensagem');
      return;
    }

    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          tipo: notificationData.tipo,
          mensagem: notificationData.mensagem,
          appointment_id: notificationData.appointment_id || null,
          status: 'registrado'
        });

      if (error) throw error;

      toast.success('Notificação registrada com sucesso!');
      setIsOpen(false);
      
      // Reset form
      setNotificationData({
        tipo: 'lembrete',
        mensagem: '',
        client_id: '',
        appointment_id: ''
      });
    } catch (error: any) {
      console.error('Error saving notification:', error);
      toast.error('Erro ao registrar notificação');
    }
  };

  const handleSendWhatsApp = async () => {
    if (!nextAppointment) {
      toast.error('Nenhum agendamento selecionado');
      return;
    }

    setSendingWhatsApp(true);
    try {
      const phone = nextAppointment.client_phone.replace(/\D/g, '');
      const message = encodeURIComponent(notificationData.mensagem);
      const whatsappUrl = `https://wa.me/55${phone}?text=${message}`;
      
      // Open WhatsApp
      window.open(whatsappUrl, '_blank');
      
      // Register notification
      await handleSendNotification();
      
      toast.success('Direcionado para WhatsApp!');
    } catch (error: any) {
      console.error('Error opening WhatsApp:', error);
      toast.error('Erro ao abrir WhatsApp');
    } finally {
      setSendingWhatsApp(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-primary-600 hover:bg-primary-700 text-white"
        size="sm"
      >
        <Bell className="w-4 h-4 mr-2" />
        Notificar Cliente
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-dark-800 border-dark-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2 text-primary-400" />
              Enviar Notificação
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400 mx-auto"></div>
                <p className="text-dark-300 mt-2">Carregando próximo agendamento...</p>
              </div>
            ) : nextAppointment ? (
              <>
                <Card className="p-4 bg-dark-700 border-dark-600">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-primary-400" />
                    Próximo Agendamento
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-dark-400" />
                      <span className="text-white">{nextAppointment.client_name}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-dark-400" />
                      <span className="text-white">{nextAppointment.client_phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-dark-400" />
                      <span className="text-white">
                        {new Date(nextAppointment.appointment_date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-white">⏰ {nextAppointment.appointment_time}</span>
                    </div>
                    <div className="col-span-2 flex items-center">
                      <span className="text-primary-400">💄 {nextAppointment.service_name}</span>
                    </div>
                  </div>
                </Card>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tipo" className="text-white">Tipo de Notificação</Label>
                    <Select 
                      value={notificationData.tipo} 
                      onValueChange={(value) => setNotificationData({ ...notificationData, tipo: value })}
                    >
                      <SelectTrigger className="bg-dark-700 border-dark-600 text-white">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent className="bg-dark-700 border-dark-600">
                        <SelectItem value="lembrete" className="text-white">Lembrete de Agendamento</SelectItem>
                        <SelectItem value="confirmacao" className="text-white">Confirmação</SelectItem>
                        <SelectItem value="promocao" className="text-white">Promoção</SelectItem>
                        <SelectItem value="informativo" className="text-white">Informativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="mensagem" className="text-white">Mensagem</Label>
                    <Textarea
                      id="mensagem"
                      value={notificationData.mensagem}
                      onChange={(e) => setNotificationData({ ...notificationData, mensagem: e.target.value })}
                      className="bg-dark-700 border-dark-600 text-white"
                      rows={6}
                      placeholder="Digite sua mensagem..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => setIsOpen(false)}
                    variant="outline"
                    className="flex-1 border-dark-600 text-dark-300 hover:bg-dark-700"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSendNotification}
                    className="flex-1 bg-primary-600 hover:bg-primary-700"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Registrar
                  </Button>
                  <Button
                    onClick={handleSendWhatsApp}
                    disabled={sendingWhatsApp}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {sendingWhatsApp ? 'Enviando...' : 'WhatsApp'}
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-dark-500 mx-auto mb-4" />
                <p className="text-dark-400">Nenhum agendamento encontrado para hoje</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NotificationButton;
