
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CalendarDays, Clock, Phone, Mail, User, Instagram, Facebook, MapPin } from 'lucide-react';

interface Service {
  id: string;
  nome: string;
  preco: number;
  duracao_min: number;
  descricao?: string;
}

interface StudioInfo {
  nome: string;
  telefone?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  endereco?: string;
  logo_url?: string;
  cor_primaria?: string;
}

const PublicBooking = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [studioInfo, setStudioInfo] = useState<StudioInfo>({
    nome: 'Studio Camila Lash',
    cor_primaria: '#1e3a8a'
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    service_id: '',
    hora: '',
    observacoes: ''
  });

  useEffect(() => {
    fetchServices();
    fetchStudioInfo();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('ativo', true)
        .order('nome');

      if (error) throw error;
      setServices(data || []);
    } catch (error: any) {
      console.error('Error fetching services:', error);
      toast.error('Erro ao carregar serviços');
    }
  };

  const fetchStudioInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('studio_settings')
        .select('nome, telefone, whatsapp, instagram, facebook, endereco, logo_url, cor_primaria')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      
      if (data && data.length > 0) {
        setStudioInfo({
          nome: data[0].nome || 'Studio Camila Lash',
          telefone: data[0].telefone,
          whatsapp: data[0].whatsapp,
          instagram: data[0].instagram,
          facebook: data[0].facebook,
          endereco: data[0].endereco,
          logo_url: data[0].logo_url,
          cor_primaria: data[0].cor_primaria || '#1e3a8a'
        });
      }
    } catch (error: any) {
      console.error('Error fetching studio info:', error);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !formData.service_id || !formData.hora) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      const selectedService = services.find(s => s.id === formData.service_id);
      
      const bookingData = {
        nome: formData.nome,
        telefone: formData.telefone,
        email: formData.email,
        service_id: formData.service_id,
        data: selectedDate.toISOString().split('T')[0],
        hora: formData.hora,
        observacoes: formData.observacoes,
        valor: selectedService?.preco || 0
      };

      const { error } = await supabase
        .from('public_bookings')
        .insert([bookingData]);

      if (error) throw error;
      
      toast.success('Agendamento solicitado com sucesso! Entraremos em contato para confirmação.');
      
      // Reset form
      setFormData({
        nome: '',
        telefone: '',
        email: '',
        service_id: '',
        hora: '',
        observacoes: ''
      });
      setSelectedDate(new Date());
    } catch (error: any) {
      console.error('Error creating booking:', error);
      toast.error('Erro ao criar agendamento');
    } finally {
      setLoading(false);
    }
  };

  const selectedService = services.find(s => s.id === formData.service_id);

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900"
      style={{ 
        background: `linear-gradient(135deg, ${studioInfo.cor_primaria}20 0%, #1a1a1a 100%)` 
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            {studioInfo.logo_url && (
              <div className="mb-4">
                <img 
                  src={studioInfo.logo_url} 
                  alt={studioInfo.nome}
                  className="h-20 mx-auto object-contain"
                />
              </div>
            )}
            <h1 className="text-4xl font-bold text-white mb-4">{studioInfo.nome}</h1>
            <p 
              className="text-xl mb-2"
              style={{ color: studioInfo.cor_primaria }}
            >
              Agende seu horário online
            </p>
            <p className="text-dark-300">Preencha o formulário abaixo e entraremos em contato para confirmação</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulário */}
            <Card className="p-6 bg-dark-800 border-dark-700">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                <CalendarDays className="w-6 h-6 mr-2" style={{ color: studioInfo.cor_primaria }} />
                Dados do Agendamento
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nome" className="flex items-center text-white">
                      <User className="w-4 h-4 mr-2" />
                      Nome Completo *
                    </Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      required
                      className="bg-dark-700 border-dark-600 text-white"
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div>
                    <Label htmlFor="telefone" className="flex items-center text-white">
                      <Phone className="w-4 h-4 mr-2" />
                      Telefone/WhatsApp *
                    </Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      required
                      className="bg-dark-700 border-dark-600 text-white"
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="flex items-center text-white">
                      <Mail className="w-4 h-4 mr-2" />
                      E-mail
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-dark-700 border-dark-600 text-white"
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div>
                    <Label className="text-white mb-2 block">Serviço *</Label>
                    <Select value={formData.service_id} onValueChange={(value) => setFormData({ ...formData, service_id: value })}>
                      <SelectTrigger className="bg-dark-700 border-dark-600 text-white">
                        <SelectValue placeholder="Selecione um serviço" />
                      </SelectTrigger>
                      <SelectContent className="bg-dark-700 border-dark-600">
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id} className="text-white">
                            {service.nome} - R$ {service.preco} ({service.duracao_min}min)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white mb-2 block">Horário *</Label>
                    <Select value={formData.hora} onValueChange={(value) => setFormData({ ...formData, hora: value })}>
                      <SelectTrigger className="bg-dark-700 border-dark-600 text-white">
                        <SelectValue placeholder="Selecione um horário" />
                      </SelectTrigger>
                      <SelectContent className="bg-dark-700 border-dark-600 max-h-60">
                        {generateTimeSlots().map((time) => (
                          <SelectItem key={time} value={time} className="text-white">
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="observacoes" className="text-white">
                      Observações
                    </Label>
                    <Textarea
                      id="observacoes"
                      value={formData.observacoes}
                      onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                      className="bg-dark-700 border-dark-600 text-white"
                      placeholder="Alguma observação especial?"
                      rows={3}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full text-white font-semibold py-3"
                  style={{ 
                    backgroundColor: studioInfo.cor_primaria,
                    borderColor: studioInfo.cor_primaria 
                  }}
                >
                  {loading ? 'Enviando...' : 'Solicitar Agendamento'}
                </Button>
              </form>
            </Card>

            {/* Calendário e Resumo */}
            <div className="space-y-6">
              <Card className="p-6 bg-dark-800 border-dark-700">
                <h3 className="text-xl font-semibold text-white mb-4">Selecione a Data</h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date.getDay() === 0}
                  className="rounded-md border border-dark-700"
                />
              </Card>

              {selectedService && (
                <Card className="p-6 bg-dark-800 border-dark-700">
                  <h3 className="text-xl font-semibold text-white mb-4">Resumo do Serviço</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-dark-300">Serviço:</span>
                      <span className="text-white font-medium">{selectedService.nome}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-300">Duração:</span>
                      <span className="text-white">{selectedService.duracao_min} minutos</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-300">Valor:</span>
                      <span className="font-semibold" style={{ color: studioInfo.cor_primaria }}>
                        R$ {selectedService.preco}
                      </span>
                    </div>
                    {selectedService.descricao && (
                      <div className="pt-3 border-t border-dark-700">
                        <p className="text-dark-300 text-sm">{selectedService.descricao}</p>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              <Card className="p-6 bg-dark-800 border-dark-700">
                <h3 className="text-xl font-semibold text-white mb-4">Contato</h3>
                <div className="space-y-3">
                  {studioInfo.whatsapp && (
                    <div className="flex items-center text-dark-300">
                      <Phone className="w-4 h-4 mr-3" style={{ color: studioInfo.cor_primaria }} />
                      <span>{studioInfo.whatsapp}</span>
                    </div>
                  )}
                  {studioInfo.instagram && (
                    <div className="flex items-center text-dark-300">
                      <Instagram className="w-4 h-4 mr-3" style={{ color: studioInfo.cor_primaria }} />
                      <span>{studioInfo.instagram}</span>
                    </div>
                  )}
                  {studioInfo.facebook && (
                    <div className="flex items-center text-dark-300">
                      <Facebook className="w-4 h-4 mr-3" style={{ color: studioInfo.cor_primaria }} />
                      <span>{studioInfo.facebook}</span>
                    </div>
                  )}
                  {studioInfo.endereco && (
                    <div className="flex items-center text-dark-300">
                      <MapPin className="w-4 h-4 mr-3" style={{ color: studioInfo.cor_primaria }} />
                      <span>{studioInfo.endereco}</span>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicBooking;
