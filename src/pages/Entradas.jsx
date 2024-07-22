import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { CargarProductos, CargarEntradas, CrearEntrada, eliminarEntradas } from '../firebase/data';
import { Link } from 'react-router-dom';




const Entradas = () => {
  const [articulos, setArticulos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);
  //entradas
  const [entradas, setEntradas] = useState([]);

  const [cantidadMovimiento, setCantidadMovimiento] = useState('');
  const [articuloSeleccionado, setArticuloSeleccionado] = useState(null);

  const [nuevaCantidad, setNuevaCantidad] = useState(0);
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

  const crearNuevaEntrada = async () => {
    const res = await CrearEntrada(articulo);
    setId('');
    setNombre('');
    setDescripcion('');
    setCodigo('');
    setModelo('');
    setCantidad('');
    setEstatus('');
    setNuevaCantidad(0);
    setUnidadMedida("")
    setPeso("")
    setMetrosCuadrados("")

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
    const entradass = await CargarEntradas()

    const productos = await CargarProductos()
    setEntradas(entradass)
    setArticulos(productos)
    setProductos(productos)
    setCargando(false)
  }



  useEffect(() => {
    getProductos();
  }, []);


  const [paginaEntradaActual, setPaginaEntradaActual] = useState(0);
  const [paginaEntradaActualModal, setPaginaEntradaActualModal] = useState(0);

  const ARTICULOS_POR_PAGINA = 100;

  const handleEntradaPageClick = ({ selected: selectedPage }) => {
    setPaginaEntradaActual(selectedPage);
  };

  const handlePageClickModal = ({ selected: selectedPage }) => {
    setPaginaEntradaActualModal(selectedPage);
  };

  const offset = paginaEntradaActual * ARTICULOS_POR_PAGINA;
  const offsetModal = paginaEntradaActualModal * ARTICULOS_POR_PAGINA;

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
  const exportar = () => {
    let wb = XLSX.utils.book_new();
    var entradasEx = [];
    entradas.map((articulo) => {
      salidasEx.push({
        nombre: articulo.nombre,
        descripcion: articulo.descripcion,
        cantidad: articulo.cantidad,
  
        nuevaCantidad: articulo.nuevaCantidad,
        cantidadFinal: parseInt(articulo.cantidad) + parseInt(articulo.nuevaCantidad),
        fecha: articulo.fechaCreacion ? formatDate(articulo.fechaCreacion.toDate()) : 'Sin fecha',



      })
    })
    }


   

  return (
    <>
      {/* filtar por nombre y codigo */}
      <div className="card">
        <div className="card-header d-flex align-items-center bg-primary text-white border-5">
          <h3 className="mb-0 text-center">Dar puntos</h3>
          <div className="ms-auto">
            <button className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#modalAgregar">
              Agregar puntos
            </button>
            <button className="btn btn-success" id='exportar'
                    onClick={() => {
                      exportar()
                    }}
                  >
                    <i className="fas fa-file-excel f-18" />
                  </button>
          </div>
        </div>
      </div>








      {/* boton de agregar */}
      <div className="container mt-5">




        <div

          className="table-responsive"
          style={{ maxHeight: '60vh', overflowY: 'auto' }}
        >

          <div className='card'>
            <div className="card-body">
              <h4 className="card-title"> Lista de Eqipos y puntos</h4>
            </div>

            <div className="card-header d-flex align-items-center  text-white border-5">


              <div className='table-responsive' style={{ maxHeight: '60vh', overflow: 'auto' }}>

                <table className="table table-centered table-hover mb-0 table-nowrap table-striped table-borderless" style={{ margin: '0', padding: '0' }}>
                  <thead className="table-Primary table-bordered table-background-header  ">
                    <tr style={{ padding: '0', margin: '0' }}>
                      <th scope="col">#</th>
                      <th scope="col">Nombre Lider</th>
                      <th scope="col">Color</th>
                      <th scope="col">punto inicial</th>
                      <th scope="col">puntos agregados</th>
                      <th scope="col">Puntos final</th>
                      <th scope="col">Fecha</th>
                      <th scope="col">Acciones</th>

                    </tr>
                  </thead>

                  <tbody>
                    {entradas.slice(offset, offset + ARTICULOS_POR_PAGINA).map((articulo, index) => (

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
                        <td>{articulo.nuevaCantidad}</td>
                        <td>{parseInt(articulo.cantidad) + parseInt(articulo.nuevaCantidad)
                        }</td>
                        <td>{articulo.fechaCreacion ? formatDate(articulo.fechaCreacion.toDate()) : 'Sin fecha'}</td>
                        <td>
                          <a className='btn btn-danger' onClick={() => {
                            const eliminar = async () => {
                              swal("¿Estas seguro de eliminar la puntaje?", {
                                buttons: ['Cancelar', 'Eliminar'],
                                icon: 'warning',
                              }).then(async (value) => {
                                if (value) {
                                  await eliminarEntradas(articulo.id_producto, articulo.cantidad, articulo.id)
                                  getProductos()
                                  swal("puntuacion  correctamente", {
                                    icon: "success",
                                  });
                                }
                              })
                            }
                            eliminar()

                          }}>
                            <i className="fas fa-trash" />
                            c  
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
                onPageChange={ handleEntradaPageClick}
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
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen">
          <div className="modal-content">
            <form>
              <div className="modal-header">
                <h5 className="modal-title " id="modalAgregar">Registrar Entradas de Productos de Almacen</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body row "> 
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
                          className="table-responsive"
                          style={{ maxHeight: '60vh', overflowY: 'auto' }}
                        >
                          <table className="table table-sm table-nowrap table-striped table-bordered" style={{ margin: '0', padding: '0' }}>
                            <thead className="table-Primary table-bordered table-background-header ">
                              <tr style={{ padding: '0', margin: '0' }}>
                                <th scope="col">#</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Descripcion</th>
                                <th scope="col">puntos</th>
                   
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
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre"
                      value={nombre}
                      readOnly
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="descripcion" className="form-label">Descripcion</label>
                    <input
                      type="text"
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
                      onChange={(e) => setCantidad (e.target.value)}
                      
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
                      crearNuevaEntrada();
                      swal("Producto agregado correctamente", {
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
        </div><>
  <div>
    <div className="modal-dialog">
      <div className="modal-content">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="modal-header">
            <h5 className="modal-title">Nueva Entrada</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div>
              <input
                type="number"
                className="form-control"
                value={nuevaCantidad}
                onChange={(e) => setNuevaCantidad(e.target.value)}
              />
            </div>
            <button
              type="submit" // Cambio importante: usar 'type="submit"' para manejar el envío del formulario
              className="btn btn-primary"
              onClick={() => {
                crearNuevaEntrada();
                swal("Producto agregado correctamente", {
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
        </form>
      </div>
    </div>
  </div>
</>
      </div>




    </>
  );
  
};


export default Entradas;
