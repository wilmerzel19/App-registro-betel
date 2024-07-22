
import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { CargarProductos, CargarSalidas, CrearSalidas, FiltrarProductos, ImportarSalidas, eliminarSalidas } from '../firebase/data';
import { db } from '../firebase/config';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';

import * as XLSX from 'xlsx';



const Salidas = () => {
  const [articulos, setArticulos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);
  //entradas
  const [salidas, setSalidas] = useState([]);

  const [cantidadMovimiento, setCantidadMovimiento] = useState('');
  const [articuloSeleccionado, setArticuloSeleccionado] = useState(null);

  // Se inicializa nuevaCantidad como un string para mantener la consistencia con los demás estados iniciales
  const [nuevaCantidad, setNuevaCantidad] = useState('');
  const [id, setId] = useState('');
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [codigo, setCodigo] = useState('');
  const [modelo, setModelo] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [estatus, setEstatus] = useState('');
  const [unidadMedida, setUnidadMedida] = useState('');
  const [peso, setPeso] = useState('');
  const [metrosCuadrados, setMetrosCuadrados] = useState('');

  const articulo = {
    id_producto: id,
    nombre: nombre,
    descripcion: descripcion,
    codigo: codigo,
    modelo: modelo,
    cantidad: cantidad,
    estatus: estatus,
    unidadMedida: unidadMedida,
    peso: peso,
    metrosCuadrados: metrosCuadrados,
    nuevaCantidad: nuevaCantidad,
    fechaCreacion: new Date(),
  };
  

  const crearNuevaSalida = async () => {
    const res = await CrearSalidas(articulo);
    setId('');
    setNombre('');
    setDescripcion('');
    setCodigo('');
    setModelo('');
    setCantidad('');
    setEstatus('');
    setUnidadMedida("")
    setPeso("")
    setMetrosCuadrados("")
    setNuevaCantidad(0);

    getProductos();
  };


  const buscarProducto = (nombre) => {
    const filtro = nombre.toLowerCase();
    console.log(filtro);
    const articulosFiltrados = productos.filter(articulo =>
      articulo.nombre.toLowerCase().includes(filtro) ||
      articulo.codigo.toLowerCase().includes(filtro) ||
      articulo.cantidad.toString().includes(filtro) ||
      articulo.descripcion.toLowerCase().includes(filtro) ||
      articulo.modelo.toLowerCase().includes(filtro) ||
      articulo.estatus.toLowerCase().includes(filtro)

    );
    setArticulos(articulosFiltrados);
  };

  const getProductos = async () => {
    setCargando(true)
    const salidass = await CargarSalidas()

    const productos = await CargarProductos()
    setSalidas(salidass)
    setArticulos(productos)
    setProductos(productos)
    setCargando(false)
  }



  useEffect(() => {
    getProductos();
  }, []);

  const fetchArticulos = async () => {
    const articulosSnapshot = await getDocs(collection(db, 'articulos'));
    const articulosList = articulosSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setArticulos(articulosList);
  };

  const manejarSalida = async (e) => {
    e.preventDefault();
    const salidaCantidad = parseInt(cantidadMovimiento);

    if (articuloSeleccionado && salidaCantidad > 0) {
      let nuevaCantidad = articuloSeleccionado.cantidad - salidaCantidad;
      nuevaCantidad = Math.max(0, nuevaCantidad);

      const articuloRef = doc(db, 'articulos', articuloSeleccionado.id);
      await updateDoc(articuloRef, { cantidad: nuevaCantidad });

      fetchArticulos();
      setCantidadMovimiento('');
      setArticuloSeleccionado(null);
    }
  };






  const [paginaActual, setPaginaActual] = useState(0);
  const [paginaActualModal, setPaginaActualModal] = useState(0);

  const ARTICULOS_POR_PAGINA = 100;

  const handlePageClick = ({ selected: selectedPage }) => {
    setPaginaActual(selectedPage);
  };

  const handlePageClickModal = ({ selected: selectedPage }) => {
    setPaginaActualModal(selectedPage);
  };

  const offset = paginaActual * ARTICULOS_POR_PAGINA;
  const offsetModal = paginaActualModal * ARTICULOS_POR_PAGINA;

  const pageCount = Math.ceil(articulos.length / ARTICULOS_POR_PAGINA);
  const pageCountModal = Math.ceil(productos.length / ARTICULOS_POR_PAGINA);

  const formatDate = (fecha) => {
    const opciones = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };

    return fecha.toLocaleString('es-ES', opciones);
  }





  return (
    <>
      {/* filtar por nombre y codigo */}
      <div className="card">
        <div className="card-header d-flex align-items-center bg-primary text-white border-5">
          <h3 className="mb-0 text-center">Quitar Puntos</h3>
          <div className="ms-auto">
            <button className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#modalAgregar">
              <i className="fas fa-plus" />
              Quitar Puntos
            </button>
          
        
          </div>

        </div>

      </div>


      {/* boton de agregar */}

      <div className="container mt-5">



        <div
          className="table-responsive table-responsive-sm table-bordered table-striped"
          style={{ fontSize: '0.7rem' }}
        >
          <div className='card'>
            <div className="card-body">
              <h4 className="card-title"> Lista de quitar puntos a Equipos</h4>

            </div>

            <div className="card-header d-flex align-items-center  text-white border-5">



              <div className='table-responsive' style={{ maxHeight: '60vh', overflow: 'auto' }}>
                <table className="table table-centered table-hover mb-0 table-nowrap table-striped table-borderless" style={{ margin: '0', padding: '0' }}>
                  <thead className="table-Primary table-bordered table-background-header ">
                    <tr style={{ padding: '0', margin: '0' }}>
                      <th scope="col">#</th>
                      <th scope="col">Nombre Lider</th>
                      <th scope="col">Color</th>
                
                      <th scope="col">punto inicial</th>
                
                      <th scope="col">Puntos agregada</th>
                      <th scope="col">Puntos finales</th>
                      <th scope="col">Fecha</th>
                      <th scope="col">Acciones</th>

                    </tr>
                  </thead>

                  <tbody>
                    {salidas.slice(offset, offset + ARTICULOS_POR_PAGINA).map((articulo, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{articulo.nombre}</td>
                        <td>
                        <div
                      style={{
                        backgroundColor: articulo.descripcion,
                        width: "150px",
                        height: "20px",
                      }}
                    />
                        </td>
               
                        <td>{articulo.cantidad}</td>
                 

                        <td>{articulo.nuevaCantidad}</td>
                        <td>{parseInt(articulo.cantidad) - parseInt(articulo.nuevaCantidad)
                        }</td>
                        <td>{articulo.fechaCreacion ? formatDate(articulo.fechaCreacion.toDate()) : 'Sin fecha'}</td>
                        <td>
                          <a className='btn btn-danger' onClick={() => {
                            const eliminar = async () => {
                              swal("¿Estás seguro de eliminar la Puntaje?", {
                                buttons: ['Cancelar', 'Eliminar'],
                                icon: 'warning',
                              }).then(async (value) => {
                                if (value) {
                                  await eliminarSalidas(articulo.id_producto, articulo.cantidad, articulo.id);
                                  getProductos();
                                }
                              });
                            };
                            eliminar();
                          }}
                          >
                            <i className="fas fa-trash" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

              </div>
            </div>


            <div className="d-flex justify-content-center mt-3">
              <ReactPaginate
                previousLabel={'Anterior'}
                nextLabel={'Siguiente'}
                breakLabel={'...'}
                pageCount={pageCountModal}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                previousLinkClassName={'page-link'}
                nextLinkClassName={'page-link'}
                disabledClassName={'disabled'}
                activeClassName={'active'}
                pageLinkClassName={'page-link'}
                breakClassName={'page-item'}
                breakLinkClassName={'page-link'}
                pageClassName={'page-item'}
                previousClassName={'page-item'}
                nextClassName={'page-item'}

              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal salida */}
      <div className="modal fade" id="modalAgregar" tabIndex="-1" aria-labelledby="modalAgregar" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-fullscreen">
          <div className="modal-content">
            <form onSubmit={manejarSalida}>
              <div className="modal-header">
                <h5 className="modal-title" id="modalAgregar">Registrar puntos  Perdidos</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body row">
                <div className="col-8">
                  {cargando ? (
                    <div className="d-flex justify-content-center align-items-center vh-100">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                  <div className="col-12">
                    <div className="card ">
                      <div className="card-body">
                        <div className="text-end p-1 ">
                          <div className="input-group mb-3">
                            <input
                              onInput={(e) => buscarProducto(e.target.value)}
                              type="text"
                              className="form-control"
                              placeholder="Buscar"
                              aria-label="Recipient's username"
                              aria-describedby="button-addon2"
                            />
                            <button className="btn btn-primary" onClick={getProductos}>
                              <i className="fas fa-sync-alt f-18" />
                            </button>
                            <Link className="btn btn-success" to='/articulos'>
                              <i className="fas fa-plus f-18" />
                            </Link>



                          </div>
                        </div>
                        <div
                          className="table-responsive table-responsive-sm table-bordered table-striped"
                          style={{ maxHeight: '60vh', overflow: 'auto' }}
                        >
                          <table className="table table-sm table-nowrap table-striped table-bordered" style={{ margin: '0', padding: '0' }}>
                            <thead className="table-Primary table-bordered table-background-header ">
                              <tr style={{ padding: '0', margin: '0' }}>
                                <th scope="col">#</th>
                                <th scope="col">Nombre Lider</th>
                                <th scope="col">Color</th>
                          
                                <th scope="col">Puntos</th>
                           

                                <th scope="col">Acciones</th>
                              </tr>
                            </thead>

                            <tbody>
                              {articulos.slice(offsetModal, offsetModal + ARTICULOS_POR_PAGINA).map((articulo, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{articulo.nombre}</td>
                                  <td>
                                  <div
                      style={{
                        backgroundColor: articulo.descripcion,
                        width: "100px",
                        height: "20px",
                      }}
                    />
                                  </td>
                                 
                                  <td>{articulo.cantidad}</td>
                             
                        

                                  <td>
                                    <button
                                      className="btn btn-primary"
                                      onClick={() => {
                                        setId(articulo.id);
                                        setNombre(articulo.nombre);
                                        setDescripcion(articulo.descripcion);
                                     
                                        setCantidad(articulo.cantidad);
                                 
                               
                                      }}
                                    >
                                      <i className="fas fa-plus" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="d-flex justify-content-center mt-3">
                          <ReactPaginate
                            previousLabel={'Anterior'}
                            nextLabel={'Siguiente'}
                            breakLabel={'...'}
                            pageCount={pageCountModal}
                            onPageChange={handlePageClickModal}
                            containerClassName={'pagination'}
                            previousLinkClassName={'page-link'}
                            nextLinkClassName={'page-link'}
                            disabledClassName={'disabled'}
                            activeClassName={'active'}
                            pageLinkClassName={'page-link'}
                            breakClassName={'page-item'}
                            breakLinkClassName={'page-link'}
                            pageClassName={'page-item'}
                            previousClassName={'page-item'}
                            nextClassName={'page-item'}

                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  {/* formularios nombre, descripcion, precio, cantidad, estatus y nueva cantidad */}
                  <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre Lider</label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre"
                      value={nombre}
                      readOnly
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="descripcion" className="form-label">Color</label>
                    <input
                      type="color"
                      className="form-control"
                      id="descripcion"
                      value={descripcion}
                      readOnly
                    />
                  </div>
               
              
            
               
                  <div className="mb-3">
                    <label htmlFor="cantidad" className="form-label">Cantidad</label>
                    <input
                      type="text"
                      className="form-control"
                      id="cantidad"
                      value={cantidad}
                      onChange={(e) => setCantidad(e.target.value)}

                    />
                  </div>
             


                  <div className="mb-3">
                    <label htmlFor="nuevaCantidad" className="form-label">Nueva Cantidad</label>
                    <input
                      type="number"
                      className="form-control"
                      id="nuevaCantidad"
                      value={nuevaCantidad}
                      onChange={(e) => setNuevaCantidad(e.target.value)}
                    />
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      crearNuevaSalida();
                      swal("salida agregado correctamente", {
                        icon: "success",
                      });
                    }}

                  >
                    Guardar cambios
                  </button>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                    Cerrar
                  </button>


                </div>
              </div>
            </form>
          </div>
        </div>
      </div>




    </>
  );
};

export default Salidas;




