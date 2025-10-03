import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menu = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Marcas', path: '/marcas' },
    { name: 'Modelos', path: '/modelos' },
    { name: 'Carros', path: '/carros' },
    { name: 'Lista de Carros', path: '/listcarro' },
  ];

  return (
    <aside className="w-64 bg-white shadow h-full">
      <nav className="flex flex-col p-4">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `px-4 py-2 rounded mb-2 ${
                isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
