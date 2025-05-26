
export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  dataNascimento: string;
  ultimoAtendimento: string;
  servicoFeito: string;
  tag: 'VIP' | 'Nova' | 'Recorrente';
  valor: number;
  historico: {
    data: string;
    servico: string;
    valor: number;
  }[];
}

export interface Servico {
  id: string;
  nome: string;
  categoria: string;
  valor: number;
  duracao: number;
  descricao: string;
  cor: string;
}

export interface Agendamento {
  id: string;
  clienteId: string;
  clienteNome: string;
  servicoId: string;
  servicoNome: string;
  data: string;
  hora: string;
  status: 'Confirmado' | 'Pendente' | 'Cancelado' | 'Realizado';
  valor: number;
}

export interface Transacao {
  id: string;
  data: string;
  descricao: string;
  valor: number;
  tipo: 'entrada' | 'saida';
  categoria: string;
}

export const clientes: Cliente[] = [
  {
    id: '1',
    nome: 'Ana Carolina Silva',
    telefone: '(11) 99999-1234',
    email: 'ana.silva@email.com',
    dataNascimento: '1990-05-15',
    ultimoAtendimento: '2024-05-20',
    servicoFeito: 'Extensão de Cílios',
    tag: 'VIP',
    valor: 150,
    historico: [
      { data: '2024-05-20', servico: 'Extensão de Cílios', valor: 150 },
      { data: '2024-04-15', servico: 'Lash Lifting', valor: 120 },
      { data: '2024-03-10', servico: 'Extensão de Cílios', valor: 150 }
    ]
  },
  {
    id: '2',
    nome: 'Beatriz Santos',
    telefone: '(11) 99999-5678',
    email: 'bia.santos@email.com',
    dataNascimento: '1985-08-22',
    ultimoAtendimento: '2024-05-18',
    servicoFeito: 'Lash Lifting',
    tag: 'Recorrente',
    valor: 120,
    historico: [
      { data: '2024-05-18', servico: 'Lash Lifting', valor: 120 },
      { data: '2024-04-20', servico: 'Tintura de Cílios', valor: 80 }
    ]
  },
  {
    id: '3',
    nome: 'Camila Rodrigues',
    telefone: '(11) 99999-9999',
    email: 'camila.rodrigues@email.com',
    dataNascimento: '1992-12-03',
    ultimoAtendimento: '2024-05-19',
    servicoFeito: 'Tintura de Cílios',
    tag: 'Nova',
    valor: 80,
    historico: [
      { data: '2024-05-19', servico: 'Tintura de Cílios', valor: 80 }
    ]
  },
  {
    id: '4',
    nome: 'Daniela Ferreira',
    telefone: '(11) 99999-4321',
    email: 'dani.ferreira@email.com',
    dataNascimento: '1988-03-17',
    ultimoAtendimento: '2024-05-21',
    servicoFeito: 'Extensão de Cílios',
    tag: 'VIP',
    valor: 150,
    historico: [
      { data: '2024-05-21', servico: 'Extensão de Cílios', valor: 150 },
      { data: '2024-04-25', servico: 'Extensão de Cílios', valor: 150 },
      { data: '2024-03-28', servico: 'Lash Lifting', valor: 120 },
      { data: '2024-02-20', servico: 'Extensão de Cílios', valor: 150 }
    ]
  },
  {
    id: '5',
    nome: 'Eduarda Costa',
    telefone: '(11) 99999-8765',
    email: 'edu.costa@email.com',
    dataNascimento: '1995-11-08',
    ultimoAtendimento: '2024-05-22',
    servicoFeito: 'Lash Lifting',
    tag: 'Recorrente',
    valor: 120,
    historico: [
      { data: '2024-05-22', servico: 'Lash Lifting', valor: 120 },
      { data: '2024-04-18', servico: 'Lash Lifting', valor: 120 }
    ]
  }
];

export const servicos: Servico[] = [
  {
    id: '1',
    nome: 'Extensão de Cílios',
    categoria: 'Alongamento',
    valor: 150,
    duracao: 120,
    descricao: 'Extensão de cílios fio a fio com técnica avançada para um olhar marcante e natural.',
    cor: 'bg-pink-500'
  },
  {
    id: '2',
    nome: 'Lash Lifting',
    categoria: 'Curvatura',
    valor: 120,
    duracao: 90,
    descricao: 'Curvatura natural dos cílios com efeito lifting que realça o olhar sem adicionar volume.',
    cor: 'bg-purple-500'
  },
  {
    id: '3',
    nome: 'Tintura de Cílios',
    categoria: 'Coloração',
    valor: 80,
    duracao: 45,
    descricao: 'Coloração profissional dos cílios para intensificar o olhar de forma natural.',
    cor: 'bg-blue-500'
  },
  {
    id: '4',
    nome: 'Volume Russo',
    categoria: 'Alongamento',
    valor: 200,
    duracao: 150,
    descricao: 'Técnica de volume russo com múltiplos fios por cílio natural para máximo impacto.',
    cor: 'bg-emerald-500'
  },
  {
    id: '5',
    nome: 'Remoção',
    categoria: 'Manutenção',
    valor: 50,
    duracao: 30,
    descricao: 'Remoção segura e profissional de extensões de cílios.',
    cor: 'bg-orange-500'
  }
];

export const agendamentos: Agendamento[] = [
  {
    id: '1',
    clienteId: '1',
    clienteNome: 'Ana Carolina Silva',
    servicoId: '1',
    servicoNome: 'Extensão de Cílios',
    data: '2024-05-26',
    hora: '09:00',
    status: 'Confirmado',
    valor: 150
  },
  {
    id: '2',
    clienteId: '2',
    clienteNome: 'Beatriz Santos',
    servicoId: '2',
    servicoNome: 'Lash Lifting',
    data: '2024-05-26',
    hora: '11:30',
    status: 'Confirmado',
    valor: 120
  },
  {
    id: '3',
    clienteId: '3',
    clienteNome: 'Camila Rodrigues',
    servicoId: '3',
    servicoNome: 'Tintura de Cílios',
    data: '2024-05-26',
    hora: '14:00',
    status: 'Pendente',
    valor: 80
  },
  {
    id: '4',
    clienteId: '4',
    clienteNome: 'Daniela Ferreira',
    servicoId: '4',
    servicoNome: 'Volume Russo',
    data: '2024-05-27',
    hora: '10:00',
    status: 'Confirmado',
    valor: 200
  },
  {
    id: '5',
    clienteId: '5',
    clienteNome: 'Eduarda Costa',
    servicoId: '2',
    servicoNome: 'Lash Lifting',
    data: '2024-05-27',
    hora: '15:30',
    status: 'Confirmado',
    valor: 120
  },
  {
    id: '6',
    clienteId: '1',
    clienteNome: 'Ana Carolina Silva',
    servicoId: '1',
    servicoNome: 'Extensão de Cílios',
    data: '2024-05-28',
    hora: '13:00',
    status: 'Confirmado',
    valor: 150
  }
];

export const transacoes: Transacao[] = [
  {
    id: '1',
    data: '2024-05-26',
    descricao: 'Extensão de Cílios - Ana Carolina',
    valor: 150,
    tipo: 'entrada',
    categoria: 'Serviço'
  },
  {
    id: '2',
    data: '2024-05-26',
    descricao: 'Lash Lifting - Beatriz Santos',
    valor: 120,
    tipo: 'entrada',
    categoria: 'Serviço'
  },
  {
    id: '3',
    data: '2024-05-25',
    descricao: 'Compra de materiais',
    valor: 200,
    tipo: 'saida',
    categoria: 'Material'
  },
  {
    id: '4',
    data: '2024-05-24',
    descricao: 'Volume Russo - Daniela Ferreira',
    valor: 200,
    tipo: 'entrada',
    categoria: 'Serviço'
  },
  {
    id: '5',
    data: '2024-05-23',
    descricao: 'Tintura de Cílios - Camila Rodrigues',
    valor: 80,
    tipo: 'entrada',
    categoria: 'Serviço'
  },
  {
    id: '6',
    data: '2024-05-22',
    descricao: 'Aluguel do espaço',
    valor: 800,
    tipo: 'saida',
    categoria: 'Fixo'
  },
  {
    id: '7',
    data: '2024-05-21',
    descricao: 'Lash Lifting - Eduarda Costa',
    valor: 120,
    tipo: 'entrada',
    categoria: 'Serviço'
  },
  {
    id: '8',
    data: '2024-05-20',
    descricao: 'Extensão de Cílios - Ana Carolina',
    valor: 150,
    tipo: 'entrada',
    categoria: 'Serviço'
  }
];

export const dadosGrafico = {
  semana: [
    { dia: 'Seg', agendamentos: 3 },
    { dia: 'Ter', agendamentos: 5 },
    { dia: 'Qua', agendamentos: 2 },
    { dia: 'Qui', agendamentos: 4 },
    { dia: 'Sex', agendamentos: 6 },
    { dia: 'Sáb', agendamentos: 8 },
    { dia: 'Dom', agendamentos: 1 }
  ],
  financeiro: [
    { data: '01/05', entrada: 450, saida: 150 },
    { data: '02/05', entrada: 320, saida: 80 },
    { data: '03/05', entrada: 520, saida: 200 },
    { data: '04/05', entrada: 380, saida: 120 },
    { data: '05/05', entrada: 600, saida: 100 },
    { data: '06/05', entrada: 290, saida: 800 },
    { data: '07/05', entrada: 450, saida: 180 },
    { data: '08/05', entrada: 510, saida: 90 },
    { data: '09/05', entrada: 620, saida: 250 },
    { data: '10/05', entrada: 480, saida: 160 }
  ]
};
