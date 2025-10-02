import { useState, useContext  } from 'react';
import { AuthContext } from '../context/AuthContext'; 

const Header = () => {
  const [open, setOpen] = useState(false);
  const { removeUser } = useContext(AuthContext); 

  const handleLogout = () => {
    removeUser(); 
  };

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow">
      <h1 className="font-bold text-xl">Minha App</h1>
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Usuário
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
