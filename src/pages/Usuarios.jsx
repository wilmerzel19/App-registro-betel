import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CargarUsuarios, EditarUsuario, RegistrarUsuario } from '../firebase/data';
import { RotatingLines } from 'react-loader-spinner'

const Usuarios = () => {
    const [cargando, setCargando] = useState(false);
    const [cargando2, setCargando2] = useState(false);
    const [usuarios, setUsuarios] = useState([]);

    const [nombre, setNombre] = useState('')
    const [imagen, setImagen] = useState(null)
    const [imagenUrl, setImagenUrl] = useState("")
    const [imagenUrl2, setImagenUrl2] = useState("")
    const [roles, setRoles] = useState("Administrador")
    const [correo, setCorreo] = useState("")
    const [contraseña, setContraseña] = useState("")
    const [tienda, setTienda] = useState("tegucigalpa")
    const [id, setId] = useState("")
    const [NuevoRol, setNuevoRol] = useState("")
    const [NuevaTienda, setNuevaTienda] = useState("")
    const [NuevoCorreo, setNuevoCorreo] = useState("")
    const [NuevaContraseña, setNuevaContraseña] = useState("")
    const [nuevoNombre, setNuevoNombre] = useState("")

    const [nuevaImagen, setNuevaImagen] = useState(null)
    const [viejaImagen, setViejaImagen] = useState("")

    const usuario = {
        nombre: nombre,
        imagen: imagen,
        roles: roles,
        tienda: tienda,
        email: correo,
        password: contraseña
    }

    const usuarioEdit = {
        id: id,
        nombre: nuevoNombre,
        imagen: viejaImagen,
        roles: NuevoRol,
        tienda: NuevaTienda,
        email: NuevoCorreo,
        password: NuevaContraseña,
        nuevaImagen: nuevaImagen
    }

    const editUsuario = async (e) => {
        e.preventDefault();
        setCargando2(true)
        const res = await EditarUsuario(usuarioEdit);
        setCargando2(false)
        
        if (res) {
            getUsuarios()
        }
    }


    const crearUsuario = async (e) => {
        e.preventDefault()
        if (contraseña.length < 6) {
            alert("La contraseña debe tener al menos 6 caracteres")
            return
        } else {
            setCargando2(true)
            const res = await RegistrarUsuario(usuario)
            setNombre("")
            setImagen(null)
            setImagenUrl("")
            setRoles("Administrador")
            setCorreo("")
            setContraseña("")
            setTienda("tegucigalpa")
            getUsuarios()
            setCargando2(false)
        }

    }


    const getUsuarios = async () => {
        setCargando(true);
        const res = await CargarUsuarios();
        setUsuarios(res);
        setCargando(false);
    
    }
    useEffect(() => {
        setCargando(true);
        getUsuarios();
        setCargando(false);
    }, []);

    return (
        <>
            <div className="page-header">
                <div className="page-block">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <ul className="breadcrumb mb-0">
                                <li className="breadcrumb-item">
                                    <Link to="/dashboards">
                                        Home
                                    </Link>
                                </li>
                                <li className="breadcrumb-item">
                                    <Link to="/usuarios">Usuarios</Link>
                                </li>
                                <li className="breadcrumb-item" aria-current="page">
                                    Usuarios
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>

            <div className="row" style={{ height: '80vh' }}>
                <div style={{
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center',
                    top: '20%',
                    display: 'flex',
                    zIndex: '9999'
                }}>

                    <RotatingLines
                        strokeColor="grey"
                        strokeWidth="5"
                        animationDuration="0.75"
                        width="96"
                        visible={cargando}
                    />

                </div>
                <div className="col-12" >
                    <div className="card ">
                        <div className="card-body">
                            <div className="text-end p-1 ">
                                <button className="btn btn-primary"
                                    data-bs-toggle="modal"
                                    data-bs-target="#modalnuevo" >
                                    <i className="ti ti-plus f-18" /> Nuevo Usuario
                                </button>
                            </div>

                            <br />
                            

                            <div className="table-responsive">
                                <table className="table" >
                                    <thead>
                                        <tr>
                                            <th className="text-end">#</th>
                                            <th>Nombre</th>
                                            <th className="text-end">Contraseña</th>
                                            <th>Roles</th>
                                            <th className="text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {usuarios.map((usuario, index) => (
                                            <tr key={usuario.id}>
                                                <td className="text-end">{index + 1}</td>
                                                <td>
                                                    <div className="row">
                                                        <div className="col-auto pe-0">
                                                            <img
                                                                src={usuario.imagen}
                                                                alt="user-image"
                                                                style={{ width: '40px', height: '40px' }}
                                                            />
                                                        </div>
                                                        <div className="col">
                                                            <h6 className="mb-1">
                                                                {usuario.nombre}
                                                            </h6>
                                                            <p className="text-muted f-12 mb-0">
                                                                {usuario.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-end">{usuario.contraseña}</td>
                                                <td>
                                                    <span className=" f-12">
                                                        {usuario.roles}
                                                    </span>{" "}
                                                </td>
                                                
                                                <td className="text-center">
                                                    <ul className="list-inline me-auto mb-0">

                                                        <li
                                                            className="list-inline-item align-bottom"
                                                            data-bs-toggle="tooltip"
                                                            title="Editar"
                                                        >
                                                            <button
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#modaleditar"
                                                                onClick={() => {
                                                                    setId(usuario.id)
                                                                    setNuevoNombre(usuario.nombre)
                                                                    setNuevoCorreo(usuario.email)
                                                                    setNuevaContraseña(usuario.contraseña)
                                                                    setNuevoRol(usuario.roles)
                                                                    setNuevaTienda(usuario.tienda)
                                                                    setImagenUrl2(usuario.imagen)
                                                                    setViejaImagen(usuario.imagen)
                                                                }}

                                                                className="btn"
                                                            >
                                                                <i className="ti ti-edit f-18" />
                                                            </button>
                                                        </li>

                                                        {/*
                                                        <li
                                                            className="list-inline-item align-bottom"
                                                            data-bs-toggle="tooltip"
                                                            title="Delete"
                                                        >
                                                            <a onClick={() => {
                                                                EliminarUsuario(usuario.id, setUsuarios);
                                                            }}

                                                                className="btn"
                                                            >
                                                                <i className="ti ti-trash f-18" />
                                                            </a>
                                                        </li>
                                                        */}



                                                    </ul>
                                                </td>
                                            </tr>
                                        ))}


                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                {/* [ sample-page ] end */}
            </div>

            <div
                className="modal fade"
                id="modaleditar"
                data-bs-keyboard="false"
                tabIndex={-1}
                aria-hidden="true"
            >
                <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header border-0 pb-0">
                            <h5 className="mb-0">Editar Usuario</h5>
                            <a
                                href="#"
                                className="avtar avtar-s btn-link-danger btn-pc-default"
                                data-bs-dismiss="modal"
                            >
                                <i className="ti ti-x f-20" />
                            </a>
                        </div>
                        <div className="modal-body">
                            <div className="card">
                                <div className="card-body">
                                    <form onSubmit={editUsuario}>
                                        <div className="row">

                                            <div style={{
                                                position: 'absolute',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                top: '20%',
                                                display: 'flex',
                                                zIndex: '9999'
                                            }}>

                                                <RotatingLines
                                                    strokeColor="grey"
                                                    strokeWidth="5"
                                                    animationDuration="0.75"
                                                    width="96"
                                                    visible={cargando2}
                                                />

                                            </div>


                                            <div className="col-sm-12 text-center mb-3">
                                                <h4 className="mb-1 mt-0" style={{ color: '#5b6b79' }}>
                                                    Imagen del Usuario
                                                </h4>
                                                <div className="user-upload wid-100">

                                                    <img
                                                        src='src/assets/images/logo.png'
                                                        alt="img"
                                                        className="img-fluid"
                                                    />
                                                    <label htmlFor="uplfile" className="img-avtar-upload"

                                                    >
                                                        <i className="ti ti-camera f-24 mb-1" />
                                                        <span>Imagen del Usuario</span>
                                                    </label>

                                                </div>
                                            </div>


                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">Nombre</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Agregar Nombre del Usuario"
                                                        required
                                                        onChange={(e) => setNuevoNombre(e.target.value)}
                                                        value={nuevoNombre}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Correo Electronico</label>
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        placeholder="Correo Electronico"
                                                        required
                                                        onChange={(e) => setNuevoCorreo(e.target.value)}
                                                        value={NuevoCorreo}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Contraseña</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Contraseña minimo 6 caracteres"
                                                        required
                                                        onChange={(e) => setNuevaContraseña(e.target.value)}
                                                        value={NuevaContraseña}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">Roles</label>
                                                    <select className="form-select" required
                                                        onChange={(e) => setNuevoRol(e.target.value)}
                                                        value={NuevoRol}

                                                    >
                                                        <option>Administrador</option>

                                                        <option>Vendedor</option>
                                                    </select>
                                                </div>
                                               
                                                <div className="form-group">
                                                    <label className="form-label">Imagen del Usuario (Opcional)</label>
                                                    <p>
                                                        <span className="text-danger">*</span> Resolusion recomendada
                                                        640*640 | Formato JPG, PNG, GIF
                                                    </p>
                                                    <label className="btn btn-outline-secondary" htmlFor="flupld">
                                                        <i className="ti ti-upload me-2" /> Subir Imagen
                                                    </label>
                                                    <input type="file" id="flupld" className="d-none"
                                                        accept='image/*'
                                                        onChange={(e) => {
                                                            setNuevaImagen(e.target.files[0]);
                                                            setImagenUrl2(URL.createObjectURL(e.target.files[0]))
                                                        }}


                                                    />
                                                </div>
                                                <div className="text-end btn-page mb-0 mt-4">
                                                    <button className="btn btn-outline-secondary"
                                                        data-bs-dismiss="modal"

                                                    >Cancelar</button>

                                                    <button className="btn btn-primary"
                                                        type='submit'
                                                    >Guardar</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="modal fade"
                id="modalnuevo"
                data-bs-keyboard="false"
                tabIndex={-1}
                aria-hidden="true"
            >
                <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header border-0 pb-0">
                            <h5 className="mb-0">Agregar nuevo Usuario</h5>
                            <a
                                href="#"
                                className="avtar avtar-s btn-link-danger btn-pc-default"
                                data-bs-dismiss="modal"
                            >
                                <i className="ti ti-x f-20" />
                            </a>
                        </div>
                        <div className="modal-body">
                            <div className="card">
                                <div className="card-body">
                                    <form onSubmit={crearUsuario}>
                                        <div className="row">

                                            <div style={{
                                                position: 'absolute',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                top: '20%',
                                                display: 'flex',
                                                zIndex: '9999'
                                            }}>

                                                <RotatingLines
                                                    strokeColor="grey"
                                                    strokeWidth="5"
                                                    animationDuration="0.75"
                                                    width="96"
                                                    visible={cargando2}
                                                />

                                            </div>
                                            {
                                                imagenUrl !== "" ?

                                                    <div className="col-sm-12 text-center mb-3">
                                                        <h4 className="mb-1 mt-0" style={{ color: '#5b6b79' }}>
                                                            Imagen del Usuario
                                                        </h4>
                                                        <div className="user-upload wid-100">

                                                            <img
                                                                src={imagenUrl}
                                                                alt="img"
                                                                className="img-fluid"
                                                            />
                                                            <label htmlFor="uplfile" className="img-avtar-upload"

                                                            >
                                                                <i className="ti ti-camera f-24 mb-1" />
                                                                <span>Imagen del Usuario</span>
                                                            </label>

                                                        </div>
                                                    </div>
                                                    : ""

                                            }

                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">Nombre</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Agregar Nombre del Usuario"
                                                        required
                                                        onChange={(e) => setNombre(e.target.value)}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Correo Electronico</label>
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        placeholder="Correo Electronico"
                                                        required
                                                        onChange={(e) => setCorreo(e.target.value)}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Contraseña</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Contraseña minimo 6 caracteres"
                                                        required
                                                        onChange={(e) => setContraseña(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">Roles</label>
                                                    <select className="form-select" required
                                                        onChange={(e) => setRoles(e.target.value)}

                                                    >
                                                        <option>Administrador</option>

                                                        <option>Vendedor</option>
                                                    </select>
                                                </div>
                                                
                                                <div className="form-group">
                                                    <label className="form-label">Imagen del Usuario (Opcional)</label>
                                                    <p>
                                                        <span className="text-danger">*</span> Resolusion recomendada
                                                        640*640 | Formato JPG, PNG, GIF
                                                    </p>
                                                    <label className="btn btn-outline-secondary" htmlFor="flupld">
                                                        <i className="ti ti-upload me-2" /> Subir Imagen
                                                    </label>
                                                    <input type="file" id="flupld" className="d-none"
                                                        accept='image/*'
                                                        onChange={(e) => {
                                                            setImagen(e.target.files[0]);
                                                            setImagenUrl(URL.createObjectURL(e.target.files[0]))
                                                        }}


                                                    />
                                                </div>
                                                <div className="text-end btn-page mb-0 mt-4">
                                                    <button className="btn btn-outline-secondary"
                                                        data-bs-dismiss="modal"

                                                    >Cancelar</button>

                                                    <button className="btn btn-primary"
                                                        type='submit'
                                                    >Guardar</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default Usuarios