import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import '../App.css'
import swal from 'sweetalert'
import ReactPaginate from 'react-paginate';
import {
  CargarProductos, EliminarProducto,
  CrearProducto, EditarProducto, ImportarProductos

} from '../firebase/data'

const Articulos = () => {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState('');
  //  const [fecha, setFecha] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [codigo, setCodigo] = useState('');
  const [modelo, setModelo] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [estatus, setEstatus] = useState('');
  //const [imagen, setImagen] = useState(null);
  const [imagenUrl, setImagenUrl] = useState('');
  const [id, setId] = useState('');
  const { } = useParams();

  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevaFecha, setNuevaFecha] = useState('');

  const [nuevaDescripcion, setNuevaDescripcion] = useState('');
  const [nuevoCodigo, setNuevoCodigo] = useState('');
  const [nuevoModelo, setNuevoModelo] = useState('');
  const [nuevaCantidad, setNuevaCantidad] = useState('');
  const [nuevoEstatus, setNuevoEstatus] = useState('');
  const [unidadMedida, setUnidadMedida] = useState('');
  const [peso, setPeso] = useState('');
  const [metrosCuadrados, setMetrosCuadrados] = useState('');
  const [nuevaImagen, setNuevaImagen] = useState(null);
  const [nuevaImagenUrl, setNuevaImagenUrl] = useState('');
  //nuevos campos
  //unidad de medida


  const [cargando, setCargando] = useState(false);
  const [articulos, setArticulos] = useState([]);

  const producto = {
    nombre: nuevoNombre,
    //fecha: nuevaFecha,
    descripcion: nuevaDescripcion,
    codigo: nuevoCodigo,
    modelo: nuevoModelo,
    cantidad: nuevaCantidad,
    status: nuevoEstatus,
    unidadMedida: unidadMedida,
    peso: peso,
    metrosCuadrados: metrosCuadrados,
  }

  const productoeditar = {
    id: id,
    nombre: nombre,
    descripcion: descripcion,
    codigo: codigo,
    modelo: modelo,
    cantidad: cantidad,
    estatus: estatus,
    unidadMedida: unidadMedida,
    peso: peso,
    metrosCuadrados: metrosCuadrados,

  }

  const crearArticulo = async (e) => {
    e.preventDefault()
    setCargando(true)
    const res = await CrearProducto(producto)
    setCargando(false)
    e.target.reset()
    setNuevoNombre("");
    setNuevaFecha("");
    setNuevaDescripcion("");
    setNuevoCodigo("");
    setNuevoModelo("");
    setNuevaCantidad("");
    setNuevoEstatus("");
    setUnidadMedida("")
    setPeso("")
    setMetrosCuadrados("")
    getProductos();
  }

  const ActualizarProducto = async (e) => {
    e.preventDefault()
    setCargando(true)
    const res = await EditarProducto(productoeditar)
    setUnidadMedida("")
    setPeso("")
    setMetrosCuadrados("")
    getProductos()
    setCargando(false)
  }

  const getProductos = async () => {
    setCargando(true)
    const productos = await CargarProductos()
    console.log(productos)
    setProductos(productos)
    setArticulos(productos)
    setCargando(false)
  }

  useEffect(() => {
    getProductos()
  }, [])

  const mostrarProducto = (producto) => {
    setNombre(producto.nombre || '')
    //setFecha(producto.fecha || '')
    setDescripcion(producto.descripcion || '')
    setCodigo(producto.codigo || '')
    setModelo(producto.modelo || '')
    setCantidad(producto.cantidad || '')
    setEstatus(producto.estatus || '')
    setId(producto.id)

  }

  const exportar = () => {
    let wb = XLSX.utils.book_new();
    var productos = [];
    articulos.map((articulo) => {
      productos.push({
        // imagen: articulo.imagen,
        nombre: articulo.nombre,
        // fecha: articulo.fecha,
        descripcion: articulo.descripcion,
        codigo: articulo.codigo,
        modelo: articulo.modelo,
        cantidad: articulo.cantidad,
        estatus: articulo.estatus,
        fechaCreacion: articulo.fechaCreacion ? formatDate(articulo.fechaCreacion.toDate()) : 'Sin fecha',
        fechaModificacion: articulo.fechaModificacion ? formatDate(articulo.fechaModificacion.toDate()) : 'Sin fecha',

      })
    })
    let ws = XLSX.utils.json_to_sheet(productos);
    var nombre = "Articulos " + " " + new Date().toLocaleDateString();
    XLSX.utils.book_append_sheet(wb, ws, "Articulos");
    XLSX.writeFile(wb, nombre + ".xlsx");
  }

  const fechImport = async (productos) => {
    const confirmacion = await swal({
      title: "Importar productos",
      text: "¿Estas seguro que deseas importar los productos?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });
    if (confirmacion) {
      setCargando(true)
      await ImportarProductos(productos)
      setCargando(false)
      swal("Productos importados correctamente", {
        icon: "success",
      });
      getProductos()
    }
  }

  const fecheliminar = async (id) => {
    const confirmacion = await swal({
      title: "Eliminar producto",
      text: "¿Estas seguro que deseas eliminar el producto?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });
    if (confirmacion) {
      setCargando(true)
      await EliminarProducto(id)
      setCargando(false)
      swal("Producto eliminado correctamente", {
        icon: "success",
      });
      getProductos()
    }
  }
  //*

  const importar = async (file) => {
    var reader = new FileReader();
    reader.onload = function (e) {
      var data = e.target.result;
      var workbook = XLSX.read(data, {
        type: 'binary'
      });
      workbook.SheetNames.forEach(function (sheetName) {
        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        var json_object = JSON.stringify(XL_row_object);
        console.log(JSON.parse(json_object));
        fechImport(JSON.parse(json_object));
        document.getElementById('importar').value = '';
      })
    };
    reader.onerror = function (ex) {
      console.log(ex);
    };
    reader.readAsBinaryString(file);
  }

  const [paginaActual, setPaginaActual] = useState(0);

  const ARTICULOS_POR_PAGINA = 100;

  const handlePageClick = ({ selected: selectedPage }) => {
    setPaginaActual(selectedPage);
  };

  const offset = paginaActual * ARTICULOS_POR_PAGINA;

  const pageCount = Math.ceil(articulos.length / ARTICULOS_POR_PAGINA);




  const filtarProducto = (nombre) => {
    const filtro = nombre.toLowerCase();
    const articulosFiltrados = productos.filter(articulo =>
      articulo.nombre.toLowerCase().includes(filtro) ||
      articulo.codigo.toLowerCase().includes(filtro) ||
      articulo.cantidad.toString().includes(filtro)
    );
    setArticulos(articulosFiltrados);
  };
  const ColorStatus = (status) => {
    switch (status) {
      case 'En inventario':
        return 'bg-success';
      case 'Agotado':
        return 'bg-danger';
      case 'Dañado':
        return 'bg-warning';
      default:
        return 'bg-light';
    }
  }


  //funcion formater  fecha
  //fechaModificacion: new Date(),
  //esa es la fecha que se guarda en la base de datos
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


      <div className="row">
        <div className="col-3">
          <div className="input-group mb-3">
            <input onInput={(e) => filtarProducto(e.target.value)} type="text" className="form-control" placeholder="Buscar" aria-label="Buscar" />
            <button className="btn btn-primary" onClick={getProductos}>
              <i className="fas fa-sync-alt f-18" />
            </button>
          </div>
        </div>

        <div className="page-header">

          <div className="page-block">
            <div className="row align-items-center">
              <div className="col-md-12">
                <ul className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to="/dashboards">
                      Panel
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="row" style={{ height: '80vh' }}>
          {
            cargando ? <><div className="d-flex justify-content-center align-items-center vh-100">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div></> : ''
          }
          <div className="col-12" >
            <div className="card ">
              <div className="card-body">
                <h3 className="card-title">Lista de Equipos</h3>
                <div className="text-end p-1 ">
                  <div className="d-flex justify-content-between" />

                  <button className="btn btn-primary"
                    onClick={() => {
                      getProductos()
                    }} >
                    <i className="fas fa-sync-alt f-18" />
                  </button>

                  <button className="btn btn-success"
                    data-bs-toggle="modal"
                    data-bs-target="#modalnuevo"
                  >
                    <i className="fas fa-plus f-18" />
                  </button>

                  <button className="btn btn-primary" id='exportar'
                    onClick={() => {
                      exportar()
                    }}
                  >
                    <i className="fas fa-file-excel f-18" />
                  </button>
                  <input type="file" id="importar" accept='.xlsx' style={{ display: 'none' }}
                    onChange={(e) => {
                      importar(e.target.files[0])
                    }}
                  />


                  <button className="btn btn-primary"
                    onClick={() => {
                      document.getElementById('importar').click()
                    }}
                  >
                    <i className="fas fa-file-import f-18" />
                  </button>
                </div>
              </div>
              <div className="table-responsive " style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                <table className="table  table-centered table-hover mb-0 table-nowrap table-striped table-borderless">
                  <thead className="table-Primary table-bordered table-background-header  ">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Nombre</th>
                      <th scope="col">Color</th>
                      <th scope="col">Puntos</th>
                      <th scope="col">Fecha creacion</th>
                      <th scope="col">Fecha modificacion</th>

                      <th scope="col">Acciones</th>

                    </tr>
                  </thead>
                  <tbody>
                    {
                      articulos.slice(offset, offset + ARTICULOS_POR_PAGINA).map((articulo, index) => (
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
                            {
                              articulo.fechaCreacion ? formatDate(articulo.fechaCreacion.toDate()) : 'Sin fecha'
                            }
                          </td>
                          <td>
                            {
                              articulo.fechaModificacion ? formatDate(articulo.fechaModificacion.toDate()) : 'Sin fecha'
                            }
                          </td>

                          {/*  <td>{articulo.fecha}</td> */}
                          <td>
                            <button className="btn btn-primary" onClick={() => {
                              mostrarProducto(articulo)
                            }} data-bs-toggle="modal" data-bs-target="#exampleModal"><i className="fas fa-edit" /></button>
                            <button className="btn btn-danger" onClick={() => fecheliminar(articulo.id)} >




                              <i className="fas fa-trash" /></button>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-center mt-3">
                <ReactPaginate
                  previousLabel={'Anterior'}
                  nextLabel={'Siguiente'}
                  breakLabel={'...'}
                  pageCount={pageCount}
                  onPageChange={handlePageClick}
                  containerClassName={'pagination'}
                  previousLinkClassName={'page-link'}
                  nextLinkClassName={'page-link'}
                  disabledClassName={'disabled'}
                  activeClassName={'active'}
                  pageLinkClassName={'page-link'}

                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal nuevo */}
      <div className="modal fade" id="modalnuevo" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
          <div className="modal-content">
            <form onSubmit={(e) => crearArticulo(e)}>
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Nuevo Puntaje</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body row">
                <div className="col-8">
                  <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre Lider</label>
                    <input type="text" className="form-control" id="nombre" required
                      value={nuevoNombre}
                      onChange={(e) => setNuevoNombre(e.target.value)}
                    />
                  </div>


                  <div className="mb-3">
                    <label htmlFor="descripcion" className="form-label">Color</label>
                    <input type="color" className="form-control" id="descripcion" required
                      value={nuevaDescripcion}
                      onChange={(e) => setNuevaDescripcion(e.target.value)}



                    />


                  </div>

                  <div className="mb-3">  
                    <label htmlFor="cantidad" className="form-label">Puntos</label>
                    <input type="number" className="form-control" id="cantidad" required
                      value={nuevaCantidad}
                      onChange={(e) => setNuevaCantidad(e.target.value)}
                    />


                    </div>


                </div>
              </div>





              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                <button type="submit" className="btn btn-primary"
                  {
                  ...cargando ? 'disabled' : ''
                  }
                >Guardar</button>

              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Modal editar */}
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
          <div className="modal-content">
            <form onSubmit={(e) => ActualizarProducto(e)}>
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Editar Equipo</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body row">
                <div className="col-8">
                  <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre Lider</label>
                    <input type="text" className="form-control" id="nombre" required
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="descripcion" className="form-label">Color</label>
                    <input type="color" className="form-control" id="descripcion" required
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="cantidad" className="form-label">Puntos</label>
                    <input type="number" className="form-control" id="cantidad" required
                      value={codigo}
                      onChange={(e) => setCantidad(e.target.value)}
                    />

                    </div>


                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                <button type="submit" className="btn btn-primary">Guardar cambios</button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </>

  )
}



export default Articulos;