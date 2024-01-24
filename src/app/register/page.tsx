'use client';
import axios, { AxiosError } from "axios";
import { FormEvent, useState } from "react";

function RegisterPage() {
  const [error, setError] = useState();
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {//esto es como hacer function handleSubmit(e: ...) {...}
    e.preventDefault();

    const formData = new FormData(e.currentTarget);//sacar datos de formulario
    try {
      const res = axios.post('/api/auth/signup', {
        email: formData.get('email'),
        username: formData.get('username'),
        password: formData.get('password')
      })
    } catch(error) {
      console.log("RegisterPage", error);
      if(error instanceof AxiosError) {
        setError(error.response?.data.message)
      }
      
    }
    
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        {error && <div>{error}</div>}
        <h1>Registro</h1>
        <input type="text" placeholder="Nombre de usuario" name="username" />
        <input type="text" placeholder="email@ucm.es" name="email" />
        <input type="password" placeholder="" name="password" />
        <button>
          Register
        </button>
      </form>
    </div>
  )
}

export default RegisterPage