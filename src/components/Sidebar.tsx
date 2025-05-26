
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Users, Package, DollarSign, Settings } from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: DollarSign, path: '/' },
  { id: 'agenda', label: 'Agenda', icon: Calendar, path: '/agenda' },
  { id: 'clientes', label: 'Clientes', icon: Users, path: '/clientes' },
  { id: 'servicos', label: 'Serviços', icon: Package, path: '/servicos' },
  { id: 'financeiro', label: 'Financeiro', icon: DollarSign, path: '/financeiro' },
  { id: 'configuracoes', label: 'Configurações', icon: Settings, path: '/configuracoes' }
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-dark-950 border-r border-dark-800 flex flex-col">
      <div className="p-6 border-b border-dark-800">
        <h1 className="text-xl font-bold text-white">Studio Camila Lash</h1>
        <p className="text-dark-400 text-sm mt-1">Painel Administrativo</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200
                    ${isActive 
                      ? 'bg-primary-900 text-primary-300 border border-primary-800' 
                      : 'text-dark-300 hover:bg-dark-800 hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-dark-800">
        <div className="bg-dark-800 p-4 rounded-lg">
          <p className="text-sm text-dark-300">
            Versão Premium
          </p>
          <p className="text-xs text-dark-400 mt-1">
            Todas as funcionalidades desbloqueadas
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
