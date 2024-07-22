import { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { getDocs, collection } from 'firebase/firestore';

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [filter, setFilter] = useState('daily');

    useEffect(() => {
        // Lógica para obtener los datos de Firebase
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, 'productos'));
            const productos = [];
            querySnapshot.forEach((doc) => {
                productos.push({ ...doc.data(), id: doc.id });
            });
            setData(productos);
        };

        fetchData();
    }, []);


    useEffect(() => { 
        //logica para obtener los datos firebase entradas y salidas

        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, 'entradas'));
            const entradas = [];
            querySnapshot.forEach((doc) => {
                entradas.push({ ...doc.data(), id: doc.id, status: 'entradas' });
            });

            const querySnapshotSalidas = await getDocs(collection(db, 'salidas'));
            const salidas = [];
            querySnapshotSalidas.forEach((doc) => {
                salidas.push({ ...doc.data(), id: doc.id, status: 'salidas' });
            });

            setFilteredData([...entradas, ...salidas]);
        }

        fetchData();

    }, [data]);
    

 
    return (
        <div>
            <main className="content">
                <div className="container-fluid p-0">
                    <div className="row mb-2 mb-xl-3">
                        <div className="col-auto d-none d-sm-block">
                            <h3>Dashboard</h3>
                        </div>
                        <div className="col-auto d-flex">
                            <button onClick={() => setFilter('daily')} className="btn btn-primary me-2">Diario</button>
                            <button onClick={() => setFilter('monthly')} className="btn btn-primary me-2">Mensual</button>
                            <button onClick={() => setFilter('yearly')} className="btn btn-primary">Anual</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-sm-6 col-xxl-3 d-flex">
                            <div className="card illustration flex-fill">
                                <div className="card-body p-0 d-flex flex-fill">
                                    <div className="row g-0 w-100">
                                        <div className="col-6">
                                            <div className="illustration-text p-3 m-1">
                                                <h4 className="illustration-text">¡Bienvenido de nuevo, Cormetal!</h4>
                                                <p className="mb-0">Panel-Articulos</p>
                                            </div>
                                        </div>
                                        <div className="col-6 align-self-end text-end">
                                            <img
                                                src="src/assets/images/image.png"
                                                alt="Customer Support"
                                                className="img-fluid illustration-img"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-6 col-xxl-3 d-flex">
                            <div className="card flex-fill">
                                <div className="card-body py-4">
                                    <div className="d-flex align-items-start">
                                        <div className="flex-grow-1">
                                            <h3 className="mb-2">{data.length}</h3>
                                            <p className="mb-2 badge badge-subtle-success me-2">Productos Registrados</p>
                                        </div>
                                        <div className="d-inline-block ms-3">
                                            <div className="stat"><i className="align-middle ti ti-package"></i></div>
                                            <i className="align-middle text-success" data-lucide="arrow-up" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-6 col-xxl-3 d-flex">
                            <div className="card flex-fill">
                                <div className="card-body py-4">
                                    <div className="d-flex align-items-start">
                                        <div className="flex-grow-1">
                                            <h3 className="mb-2">{filteredData.filter(item => item.status === 'entradas').length}</h3>
                                            <p className="mb-2 badge badge-subtle-info me-2">Entradas Registradas</p>
                                        </div>
                                        <div className="d-inline-block ms-3">
                                            <div className="stat"><i className="align-middle ti ti-arrow-up"></i></div>
                                            <i className="align-middle text-info" data-lucide="arrow-down" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-6 col-xxl-3 d-flex">
                            <div className="card flex-fill">
                                <div className="card-body py-4">
                                    <div className="d-flex align-items-start">
                                        <div className="flex-grow-1">
                                            <h3 className="mb-2">{filteredData.filter(item => item.status === 'salidas').length}</h3>
                                            <p className="mb-2 badge badge-subtle-warning me-2">Salidas Registradas</p>
                                        </div>
                                        <div className="d-inline-block ms-3">
                                            <div className="stat"><i className="align-middle ti ti-arrow-down"></i></div>
                                            <i className="align-middle text-warning" data-lucide="arrow-up" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
