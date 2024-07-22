import { useState } from 'react'
import { LoginUsuario } from '../firebase/data'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleLogin = async (e) => {
      setCargando(true)
      e.preventDefault()
      const usuario = {
          email,
          password
      }
      /**
       * Represents the response from the LoginUsuario function.
       * @type {any}
       */
      const respuesta = await LoginUsuario(usuario)
      
      setCargando(false)
  }

  return (
    <div className="container-fluid p-0">
    <div className="row g-0">
      <div className="col-xl-6 d-none d-xl-flex">
        <div className="auth-full-page position-relative">
          <img
            src="/src/assets/images/logo.png"
            className="auth-bg"
            alt="Unsplash"
          />
          <div className="auth-quote">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              data-lucide="quote"
              className="lucide lucide-quote"
            >
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
            </svg>
            <figure>
              <blockquote>
                <p className='text-white h2 fw-normal mb-4 mt-3  text-uppercase fw-bold '>

                  Cormetal S.A,
                  <br />
                  <span className="text-white h2 fw-normal mb-4 mt-3 text-center text-uppercase fw-bold">
                    "Con todos los fierros"
                  </span>
                </p>
            


               
              
              </blockquote>
              <figcaption></figcaption>
            </figure>
          </div>
        </div>
      </div>
      <div className="col-xl-6">
        <div className="auth-full-page d-flex p-4 p-xl-5">
          <div className="d-flex flex-column w-100 h-100">
            <div className="auth-form">
              <div className="text-center">
                <h1 className="h2">¡Bienvenido de nuevo!</h1>
                <p className="lead">Inicia sesión en tu cuenta para continuar</p>
              </div>
              <div className="mb-3">
                <div className="d-grid gap-2 mb-3">
                  <a
                    className="btn btn-facebook btn-lg position-relative shadow"
                    href="/dashboard-default"
                  >
                    <i className="fab fa-fw fa-facebook fs-3 float-start" />
                    <span className="position-absolute mx-auto w-100 left-0">
                      Continue with Facebook
                    </span>
                  </a>
                  <a
                    className="btn btn-google btn-lg position-relative shadow"
                    href="/dashboard-default"
                  >
                    <i className="fab fa-fw fa-google fa-google-colored fs-3  float-start" />
                    <span className="position-absolute mx-auto w-100 left-0">
                      Continue with Google
                    </span>
                  </a>
                  <a
                    className="btn btn-apple btn-lg position-relative shadow"
                    href="/dashboard-default"
                  >
                    <i className="fab fa-fw fa-apple fs-3 float-start" />
                    <span className="position-absolute mx-auto w-100 left-0">
                      Continue with Apple
                    </span>
                  </a>{" "}
                </div>
                <div className="row">
                  <div className="col">
                    <hr />
                  </div>
                  <div className="col-auto text-uppercase d-flex align-items-center">
                    Or
                  </div>
                  <div className="col">
                    <hr />
                  </div>
                </div>
                <form>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      className="form-control form-control-lg"
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}

                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      className="form-control form-control-lg"
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}

                    />
                    <small>
                      <a href="/auth-reset-password-cover">Forgot password?</a>
                    </small>
                  </div>
                  <div>
                    <div className="form-check align-items-center">
                      <input
                        id="customControlInline"
                        type="checkbox"
                        className="form-check-input"
                        defaultValue="remember-me"
                        name="remember-me"
                        defaultChecked=""
                      />
                      <label
                        className="form-check-label text-small"
                        htmlFor="customControlInline"
                      >
                        Remember me
                      </label>
                    </div>
                  </div>
                  <div className="d-grid gap-2 mt-3">
                    <a
                      className="btn btn-lg btn-primary"
                      onClick={handleLogin} to ='/dashboards'
                    >
                      Sign in
                    </a>
                  </div>
                </form>
              </div>
              <div className="text-center">
                Don't have an account? <a href="/auth-sign-up-cover">Sign up</a>
              </div>
            </div>
            <div className="text-center">
              <p className="mb-0">
                © 2024 - <a href="/">W-J-Z-M</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  



  )
}
export default Login