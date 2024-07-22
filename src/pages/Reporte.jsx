import React, { useEffect, useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import ReactPaginate from 'react-paginate';
import {
  CargarProductos, 
  CrearProducto, EditarProducto, ImportarProductos
} from '../firebase/data';

const Reporte = () => {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [codigo, setCodigo] = useState('');
  const [modelo, setModelo] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [estatus, setEstatus] = useState('');
  const [id, setId] = useState('');
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');
  const [nuevoCodigo, setNuevoCodigo] = useState('');
  const [nuevoModelo, setNuevoModelo] = useState('');
  const [nuevaCantidad, setNuevaCantidad] = useState('');
  const [nuevoEstatus, setNuevoEstatus] = useState('');
  const [unidadMedida, setUnidadMedida] = useState('');
  const [peso, setPeso] = useState('');
  const [metrosCuadrados, setMetrosCuadrados] = useState('');
  const [cargando, setCargando] = useState(false);
  const [articulos, setArticulos] = useState([]);
  const [paginaActual, setPaginaActual] = useState(0);
  const [busqueda, setBusqueda] = useState('');
  const ARTICULOS_POR_PAGINA = 100;
  const componentRef = useRef();

  const producto = {
    nombre: nuevoNombre,
    descripcion: nuevaDescripcion,
    codigo: nuevoCodigo,
    modelo: nuevoModelo,
    cantidad: nuevaCantidad,
    status: nuevoEstatus,
    unidadMedida: unidadMedida,
    peso: peso,
    metrosCuadrados: metrosCuadrados

 

  };

  const productoeditar = {
    id: id,
    nombre: nombre,
    descripcion: descripcion,
    codigo: codigo,
    modelo: modelo,
    cantidad: cantidad,
    estatus: estatus,
  };

  const crearArticulo = async (e) => {
    e.preventDefault();
    setCargando(true);
    await CrearProducto(producto);
    setCargando(false);
    e.target.reset();
    setNuevoNombre("");
    setNuevaDescripcion("");
    setNuevoCodigo("");
    setNuevoModelo("");
    setNuevaCantidad("");
    setNuevoEstatus("");
    setUnidadMedida("")
    setPeso("")
    setMetrosCuadrados("")
    getProductos();
    swal("Articulo creado correctamente", { icon: "success" });
  };

  const ActualizarProducto = async (e) => {
    e.preventDefault();
    setCargando(true);
    await EditarProducto(productoeditar);
    setCargando(false);
    getProductos();
  };

  const getProductos = async () => {
    setCargando(true);
    const productos = await CargarProductos();
    setProductos(productos);
    setArticulos(productos);
    setCargando(false);
  };

  useEffect(() => {
    getProductos();
  }, []);

  const mostrarProducto = (producto) => {
    setNombre(producto.nombre || '');
    setDescripcion(producto.descripcion || '');
    setCodigo(producto.codigo || '');
    setModelo(producto.modelo || '');
    setCantidad(producto.cantidad || '');
    setEstatus(producto.estatus || '');
    setUnidadMedida(producto.unidadMedida || '');
    setPeso(producto.peso || '');
    setMetrosCuadrados(producto.metrosCuadrados || '');



    setId(producto.id);
  };

  const exportar = () => {
    let wb = XLSX.utils.book_new();
    var productos = [];
    articulos.map((articulo) => {
      productos.push({
        nombre: articulo.nombre,
        descripcion: articulo.descripcion,
        codigo: articulo.codigo,
        modelo: articulo.modelo,
        cantidad: articulo.cantidad,
        estatus: articulo.estatus,
        unidadMedida: articulo.unidadMedida,
        peso: articulo.peso,
        metrosCuadrados: articulo.metrosCuadrados,

      });
    });
    let ws = XLSX.utils.json_to_sheet(productos);
    var nombre = "Articulos " + " " + new Date().toLocaleDateString();
    XLSX.utils.book_append_sheet(wb, ws, "Articulos");
    XLSX.writeFile(wb, nombre + ".xlsx");
  };

  const fechImport = async (productos) => {
    const confirmacion = await swal({
      title: "Importar productos",
      text: "¿Estas seguro que deseas importar los productos?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });
    if (confirmacion) {
      setCargando(true);
      await ImportarProductos(productos);
      setCargando(false);
      swal("Productos importados correctamente", { icon: "success" });
      getProductos();
    }
  };


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
        fechImport(JSON.parse(json_object));
        document.getElementById('importar').value = '';
      });
    };
    reader.onerror = function (ex) {
      console.log(ex);
    };
    reader.readAsBinaryString(file);
  };

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
      articulo.cantidad.toString().includes(filtro) ||
      articulo.descripcion.toLowerCase().includes(filtro)



    );
    setArticulos(articulosFiltrados);
  };

  const ComponentToPrint = React.forwardRef((_props, ref) => (
    <div ref={ref}>
      <br />

      <img src="src/assets/images/logo.png" alt="Cormetal" width={100} radioGroup='25' className="d-block mx-auto rounded-circle" />

      <h1 className="text-center">Reporte de Productos</h1>
      <h2 className="text-center">Cormetal S.A</h2>
      <h3 className="text-center">Fecha: {new Date().toLocaleDateString()}</h3>

      <br />



      <table className="table table-sm table-nowrap table-striped table-bordered ">
        <thead>
          <tr>
            <th className="text-end">#</th>
            <th>Producto</th>
            <th className="text-end">Descripción</th>
            <th className="text-end">Código</th>
            <th className="text-end">Modelo</th>
            <th className="text-end">Cantidad</th>
            <th className="text-end">U/M</th>
            <th className="text-end">Peso</th>
            <th className="text-end">M/2</th>


          </tr>
        </thead>
        <tbody>
          {articulos.map((articulo, index) => (
            <tr key={index}>
              <td className="text-end">{index + 1}</td>
              <td>{articulo.nombre}</td>
              <td className="text-end">{articulo.descripcion}</td>
              <td className="text-end">{articulo.codigo}</td>
              <td className="text-end">{articulo.modelo}</td>
              <td className="text-end">{articulo.cantidad}</td>
              <td className="text-end">{articulo.unidadMedida ? articulo.unidadMedida : "Sin datos"}</td>
              <td className="text-end">{articulo.peso ? articulo.peso : "Sin datos"}</td>
              <td className="text-end">{articulo.metrosCuadrados ? articulo.metrosCuadrados : "Sin datos"}</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ));

  return (
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
                  <Link to="/dashboards">Panel</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/articulos">Artículos</Link>
                </li>

              </ul>
            </div>
          </div>
        </div>
      </div>

      {cargando && (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      )}

      <div className="col-lg-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Productos</h4>
            <div className="card-tools">

              <button className="btn btn-success" onClick={exportar}>
                Exportar a Excel
              </button>
              <input
                type="file"
                className="form-control d-none"
                id="importar"
                onChange={(e) => importar(e.target.files[0])}
              />

              <ReactToPrint
                trigger={() => <button className="btn btn-info">Imprimir lista</button>}
                content={() => componentRef.current}
              />
            </div>
          </div>

          <div className="card-body">


             <div className="table-responsive" style={{ maxHeight: "60vh", overflow: "auto" }}>

            <table className="table table-sm table-nowrap table-striped table-bordered">
              <thead>
                <tr>
                  <th className="text-end">#</th>
                  <th>Producto</th>
                  <th className="text-end">Descripción</th>
                  <th className="text-end">Código</th>
                  <th className="text-end">Modelo</th>
                  <th className="text-end">Cantidad</th>
                  <th className="text-end">U/M</th>
                  <th className="text-end">Peso</th>
                  <th className="text-end">M/2</th>

                </tr>
              </thead>
              <tbody>

                {articulos.slice(offset, offset + ARTICULOS_POR_PAGINA).map((articulo, index) => (
                  <tr key={index}>
                    <td className="text-end">{index + 1 + offset}</td>
                    <td>{articulo.nombre}</td>
                    <td className="text-end">{articulo.descripcion}</td>
                    <td className="text-end">{articulo.codigo}</td>
                    <td className="text-end">{articulo.modelo}</td>
                    <td className="text-end">{articulo.cantidad}</td>
                    <td className="text-end">{articulo.unidadMedida ? articulo.unidadMedida : "Sin datos"}</td>
                    <td className="text-end">{articulo.peso ? articulo.peso : "Sin datos"}</td>
                    <td className="text-end">{articulo.metrosCuadrados ? articulo.metrosCuadrados : "Sin datos"}</td>

                  </tr>
                ))}
              </tbody>
            </table>
          
       
          </div>
          <ReactPaginate
              previousLabel={'Anterior'}
              nextLabel={'Siguiente'}
              pageCount={pageCount}
              onPageChange={handlePageClick}
              containerClassName={'pagination'}
              activeClassName={'active'}
              pageClassName={'page-item'}
              pageLinkClassName={'page-link'}
              previousClassName={'page-item'}
              nextClassName={'page-item'}
              previousLinkClassName={'page-link'}
              nextLinkClassName={'page-link'}
              


            />
        </div>
      </div>
    </div>

      <div style={{ display: "none" }}>
        <ComponentToPrint ref={componentRef} />
      </div>

    </div>
  );
};

export default Reporte;
