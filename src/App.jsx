import React from 'react';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase/config';
import { obtenerUserData } from './firebase/data';
import Login from './pages/Login';
import { BrowserRouter as Router, Routes, Route, Link, HashRouter } from "react-router-dom";
import Usuarios from './pages/Usuarios';
import Articulos from './pages/Articulos';
import Dashboars from './pages/Dashboars';
import Reporte from './pages/Reporte';
import Entradas from './pages/Entradas';
import Salidas from './pages/Salidas';




export const App = () => {
  const [user, setUser] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [userData, setUserData] = useState(null);
  //sidebar = collapsed
  const [sidebar, setSidebar] = useState('sidebar');

  const setsidebar = () => {
    if (sidebar === 'sidebar') {
      setSidebar('sidebar collapsed');
    } else {
      setSidebar('sidebar');
    }
  }

  useEffect(() => {
    setCargando(true);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        try {
          obtenerUserData(user.uid).then((res) => {
            setUserData(res);
          });
        }
        catch (error) {
          cerrarSesion();
        }

        setCargando(false);

      } else {
        setUser(null);
        setCargando(false);
      }
    });

  }, [user]);

  const cerrarSesion = async () => {
    setCargando(true);
    auth.signOut();
    setCargando(false);
  }



  return (
    <>
      {cargando === false ? <>
        {user ? <>
          <HashRouter>
            <div className="wrapper">
              <nav id="sidebar"
                className={sidebar}


              >
                <div className="sidebar-content js-simplebar">
                  <a className="sidebar-brand" href="/">

                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 20 20" enableBackground="new 0 0 20 20" xmlSpace="preserve">
                      <path d="M19.4,4.1l-9-4C10.1,0,9.9,0,9.6,0.1l-9,4C0.2,4.2,0,4.6,0,5s0.2,0.8,0.6,0.9l9,4C9.7,10,9.9,10,10,10s0.3,0,0.4-0.1l9-4C19.8,5.8,20,5.4,20,5S19.8,4.2,19.4,4.1z"></path>
                      <path d="M10,15c-0.1,0-0.3,0-0.4-0.1l-9-4c-0.5-0.2-0.7-0.8-0.5-1.3c0.2-0.5,0.8-0.7,1.3-0.5l8.6,3.8l8.6-3.8c0.5-0.2,1.1,0,1.3,0.5c0.2,0.5,0,1.1-0.5,1.3l-9,4C10.3,15,10.1,15,10,15z"></path>
                      <path d="M10,20c-0.1,0-0.3,0-0.4-0.1l-9-4c-0.5-0.2-0.7-0.8-0.5-1.3c0.2-0.5,0.8-0.7,1.3-0.5l8.6,3.8l8.6-3.8c0.5-0.2,1.1,0,1.3,0.5c0.2,0.5,0,1.1-0.5,1.3l-9,4C10.3,20,10.1,20,10,20z"></path>
                    </svg>
                    <span className="align-middle me-3">Campamento</span>
                  </a>
                  <ul className="sidebar-nav">
                    <li className="sidebar-item active">
                      <a data-bs-target="#dashboards" data-bs-toggle="collapse" className="sidebar-link">
                        <i className="align-middle ti ti-menu"></i>
                        <span className="align-middle">Dashboards</span>
                        <span className="badge badge-sidebar-primary">5</span>
                      </a>
                      <ul id="dashboards" className="sidebar-dropdown list-unstyled collapse show" data-bs-parent="#sidebar">
                        <Link to="/dashboards" className="sidebar-link">
                          <span className="align-middle"><i className="align-middle ti ti-dashboard"></i>Panel</span>
                        </Link>




                      </ul>
                    </li>
                    <li className="sidebar-item">
                      <a data-bs-target="#ecommerce" data-bs-toggle="collapse" className="sidebar-link collapsed">
                        <i className="align-middle ti ti-shopping-cart"></i>
                        <span className="align-middle">
                          Administracion
                      </span>
                      </a>
                      <ul id="ecommerce" className="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
                        <li className="sidebar-item">
                          <Link to="/articulos" className="sidebar-link">
                            <span className="align-middle"><i className="align-middle ti ti-package"></i>Equipos</span>
                          </Link>
                        </li>
                        <li className="sidebar-item">
                          <Link to="/entradas" className="sidebar-link">
                            <span className="align-middle"><i className="align-middle ti ti-arrow-up"></i>Agregar Puntos</span>
                          </Link>
                        </li>
                        <li className="sidebar-item">
                          <Link to="/salidas" className="sidebar-link">
                            <span className="align-middle"><i className="align-middle ti ti-arrow-down"></i>Quitar Puntos</span>
                          </Link>
                        </li>


                      </ul>
                    </li>

                    </ul>

                   

                </div>
              </nav>
              <div className="main">
                <nav className="navbar navbar-expand navbar-bg">
                  <a className="sidebar-toggle"
                    onClick={() => {
                      setsidebar();


                    }}
                  >
                    <i className="hamburger align-self-center"></i>
                  </a>
                  <form className="d-none d-sm-inline-block">
                    <div className="input-group input-group-navbar">
                      <input type="text" className="form-control" placeholder="Search projects…" aria-label="Search" />
                      <button className="btn" type="button">
                        <i className="align-middle" data-lucide="search"></i>
                      </button>
                    </div>
                  </form>
                  <div className="navbar-collapse collapse">
                    <ul className="navbar-nav navbar-align">
                      <li className="nav-item nav-theme-toggle dropdown">
                        <a className="nav-icon js-theme-toggle" href="#">
                          <div className="position-relative">
                            <i className="align-middle text-body nav-theme-toggle-light" data-lucide="sun"></i>
                            <i className="align-middle text-body nav-theme-toggle-dark" data-lucide="moon"></i>
                          </div>
                        </a>
                      </li>
                      <li className="nav-item dropdown">
                        <a className="nav-icon dropdown-toggle d-inline-block d-sm-none" href="#" data-bs-toggle="dropdown">
                          <i className="align-middle" data-lucide="settings"></i>
                        </a>
                        <a className="nav-link dropdown-toggle d-none d-sm-inline-block" href="#" data-bs-toggle="dropdown">
                          <img src="src/assets/images/logo.png" className="img-fluid rounded-circle me-2 mt-n2 mb-n2" alt={userData?.nombre}
                            width="60" height="60" /> <span>{userData?.nombre}</span>
                        </a>
                        <div className="dropdown-menu dropdown-menu-end">

                          <a className="dropdown-item"
                            onClick={cerrarSesion}><i className="align-middle me-1" data-lucide="log-out">
                            </i>Sign out</a>
                        </div>
                      </li>
                    </ul>
                  </div>
                </nav>
                {/* Main content */}
                <main className="content">
                  <div className="container-fluid p-0">
                    <div className="row mb-2 mb-xl-3">
                      <div className="col-auto d-none d-sm-block">
                      </div>

                    </div>
                    <Routes>
                      {userData?.roles === 'Administrador' ? <>


                        <Route path="/usuarios" element={<Usuarios />} />
                        <Route path="/articulos" element={<Articulos />} />
                        <Route path="/dashboards" element={<Dashboars />} />
                        <Route path="/reporte" element={<Reporte />} />
                        <Route path="/entradas" element={<Entradas />} />
                        <Route path="/salidas" element={<Salidas />} />



                      </> :
                        <>
                          <Route path="/articulos" element={<Articulos />} />
                          <Route path="/dashboards" element={<Dashboars />} />
                          <Route path="/reporte" element={<Reporte />} />
                          <Route path="/entradas" element={<Entradas />} />
                          <Route path="/salidas" element={<Salidas />} />

                        </>}


                    </Routes>


                  </div>
                </main>
              </div>
            </div>
          </HashRouter>
        </>


          : (
            <Login />
          )}
      </>
        : (
          <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
    </>
  );
}
export default App;
