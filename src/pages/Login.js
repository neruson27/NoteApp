import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useLocalStorage from '../utils/useLocalStorage';
import backendNotes from '../clients/backendNotes';

import logo from '../assets/NoteApp.png';

function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [register, setRegister] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [jwt, setJwt] = useLocalStorage('jwt', '')

  const viewChange = () => setRegister(!register);

  const fetchData = useCallback(async () => {
    if (!password) {
      setShowMessage(true);
    }

    if (user && password) {
      const response = await backendNotes('post', !register ? '/user/login' : '/user/signup', {user, password})
      setUser('')
      setPassword('')
      setRegister(false)
      setJwt(response.data.token)
    }
  }, [password, user, register, setJwt])

  useEffect(() => {
    if (jwt) {
      navigate("/", { replace: true })
    }
  }, [jwt, navigate])

  return ( 
    <div className="h-[100vh] bg-purple-400 flex flex-row justify-center items-center">
      <div className="h-[80vh] md:h-[70vh] w-[70vw] bg-white rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-2 text-center items-center">
        <div className='h-[50vh] grid grid-rows-4 auto-rows-min md:auto-rows-max justify-center content-between'>
          <p className='text-md font-bold'>{!register ? 'Entrar' : 'Registrate'}</p>
          <div className="mb-6 text-start">
            <label className="block text-gray-700 text-sm font-bold mb-2" for="username">
              Nombre de usuario
            </label>
            <input 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Username"
              onChange={(ev) => {
                setUser(ev.target.value);
              }}
            />
          </div>
          <div className="mb-6 text-start">
            <label className="block text-gray-700 text-sm font-bold mb-2" for="password">
              Contraseña
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="******************"
              onChange={(ev) => {
                setPassword(ev.target.value);
              }}
            />
            {showMessage ? <p className="text-red-500 text-xs italic">Por favor elije una contraseña.</p> : <></>}
          </div>
          <div className='self-end'>
            <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={fetchData}>
              {!register ? 'Entrar' : 'Registrarse'}
            </button>
            <p className="text-purple-500 hover:cursor-pointer hover:text-purple-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={viewChange}>
              {!register ? 'Registrate' : 'Entra'}
            </p>
          </div>
        </div>
        <div className='h-[50vh] grid grid-rows-4 auto-rows-min md:auto-rows-max justify-center content-between'>
          <img src={logo} alt="Logo" className='h-[50vh]'/>
        </div>
      </div>
    </div>
  );
}

export default Login;