import { storage, db } from "./config";
import { v4 } from "uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, where, orderBy,deleteDoc } from "firebase/firestore";
import { query } from "firebase/firestore";
import { auth } from "./config";
import { createUserWithEmailAndPassword, deleteUser, signInWithEmailAndPassword } from "firebase/auth";
import swal from "sweetalert";


const unidadesMedidaCollection = collection(db, 'UnidadesMedida');


//registrar usuario en firebase/auth y en firebase/firestore se guarda el id, nombre, email, rol
export const RegistrarUsuario = async (usuario) => {
    const { email, password } = usuario;
    //crear usuario en firebase/auth sin iniciar sesion
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userid = userCredential.user.uid;
    if (usuario.imagen !== null) {
        const storageRef = ref(storage, "imagenavatar/" + v4());
        await uploadBytes(storageRef, usuario.imagen).then((snapshot) => {

        });
        const url = await getDownloadURL(storageRef);
        usuario.imagen = url;

    }
    //usuarios/uid
    const docRef = await addDoc(collection(db, "usuarios"), {
        userid: userid,
        nombre: usuario.nombre,
        email: usuario.email,
        contraseña: usuario.password,
        roles: usuario.roles,
        tienda: usuario.tienda,
        fechaCreacion: new Date(),
        // imagen: usuario.imagen,
    });

    return docRef;
}

export const EditarUsuario = async (usuario) => {
    console.log(usuario);
    if (usuario.nuevaImagen !== null) {
        const storageRef = ref(storage, "imagenavatar/" + v4());
        await uploadBytes(storageRef, usuario.nuevaImagen).then((snapshot) => {

        });
        const url = await getDownloadURL(storageRef);
        usuario.imagen = url;
    }
    const docRef = doc(db, "usuarios", usuario.id);

    await updateDoc(docRef, {
        nombre: usuario.nombre,
        email: usuario.email,
        contraseña: usuario.password,
        roles: usuario.roles,
        tienda: usuario.tienda,
        //imagen: usuario.imagen,
    });
    return docRef;
}


export const LoginUsuario = async (usuario) => {
    const { user } = await signInWithEmailAndPassword(auth, usuario.email, usuario.password);
    return user;
}

export const CargarUsuarios = async () => {
    const querySnapshot = await getDocs(collection(db, "usuarios"));
    const usuarios = [];
    querySnapshot.forEach((doc) => {
        usuarios.push({ ...doc.data(), id: doc.id });
    });
    return usuarios;
}

export const ObtenerUsuario = async (id) => {
    const usuario = getDoc(doc(db, 'usuarios', id))
    const data = (await usuario).data()
    return data
}

export const EliminarUsuario = async (id, setUsuarios) => {
    //borrar usuario en firestore con el id

    const userid = (await getDoc(doc(db, 'usuarios', id))).data().userid;
    //get user by id


    await deleteDoc(doc(db, "usuarios", id));

    //borrar usuario en firebase/auth con el userid
    //obtener el usuario con el userid


    const usuarios = await CargarUsuarios();
    setUsuarios(usuarios);

}
export const obtenerUserData = async (userid) => {
    const q = query(collection(db, 'usuarios'), where('userid', '==', userid));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs[0].data();
    return data;
}



export const CrearProducto = async (producto) => {
    //const storageRef = ref(storage, "imagenes/" + v4());
    //await uploadBytes(storageRef, producto.imagen).then((snapshot) => {

    // });
    //const url = await getDownloadURL(storageRef);

    const docRef = await addDoc(collection(db, "productos"), {

        nombre: producto.nombre,
        //  fecha:producto.fecha,
        descripcion: producto.descripcion,
        codigo: producto.codigo,
        modelo: producto.modelo,
        cantidad: producto.cantidad,
        estatus: producto.status,
        fechaCreacion: new Date(),
        //imagen: url,
        unidadMedida: producto.unidadMedida,
        peso: producto.peso,
        metrosCuadrados: producto.metrosCuadrados,

    }
    );



    return docRef;
}



export const EditarProducto = async (producto) => {
    swal("Producto editado correctamente", {
        icon: "success",
    });
    //if (producto.nuevaImagen !== null) {
    // const storageRef = ref(storage, "imagenes/" + v4());
    //await uploadBytes(storageRef, producto.nuevaImagen).then((snapshot) => {

    // });
    //const url = await getDownloadURL(storageRef);
    //producto.imagen = url;
    // }
    const docRef = doc(db, "productos", producto.id);

    await updateDoc(docRef, {
        nombre: producto.nombre,
      // fecha:producto.fecha,
        descripcion: producto.descripcion,
        codigo: producto.codigo,
        modelo: producto.modelo,
        cantidad: producto.cantidad,
        estatus: producto.estatus,
        //imagen: producto.imagen,
        fechaModificacion: new Date(),

        unidadMedida: producto.unidadMedida,
        peso: producto.peso,
        metrosCuadrados: producto.metrosCuadrados,
    });

    return docRef;
}

export const CargarProductos = async () => {


    //const querySnapshot = await getDocs(collection(db, "productos"));
    //ordenar por fecha de creacion
    const querySnapshot = await getDocs(query(collection(db, "productos"), orderBy("fechaCreacion", "desc")));
    const productos = [];
    querySnapshot.forEach((doc) => {
        productos.push({ ...doc.data(), id: doc.id });
    });

    return productos;
}

export const EliminarProducto = async (id) => {
    await deleteDoc(doc(db, "productos", id));
    swal("Producto eliminado correctamente", {
        icon: "success",
    });




}
export const ObtenerProducto = async (id) => {
    const producto = getDoc(doc(db, 'productos', id))
    const data = (await producto).data()
    return data
}


export const CrearEntrada = async (entrada) => {

    const docRef = doc(db, "productos", entrada.id_producto)

    await updateDoc(docRef, {
        cantidad: parseInt(entrada.cantidad) + parseInt(entrada.nuevaCantidad),
        ultima_modificacion: new Date(),

    });
    const entradas = await addDoc(collection(db, "entradas"), entrada);
    return entradas;
}
//eliminar entrada
export const CargarEntradas = async () => {
    const querySnapshot = await getDocs(query(collection(db, "entradas"), orderBy("fechaCreacion", "desc")));
    const entradas = [];
    console.log(querySnapshot);
    querySnapshot.forEach((doc) => {
        entradas.push({ ...doc.data(), id: doc.id });
    });
    console.log(entradas);
    return entradas;
}




//cargar salidas
export const CargarSalidas = async () => {
    const querySnapshot = await getDocs(query(collection(db, "salidas"), orderBy("fechaCreacion", "desc")));
    const salidas = [];
    querySnapshot.forEach((doc) => {
        salidas.push({ ...doc.data(), id: doc.id });
    });

    return salidas;
}

//salidas
export const CrearSalidas = async (salida) => {

    const docRef = doc(db, "productos", salida.id_producto)

    await updateDoc(docRef, {
        cantidad: parseInt(salida.cantidad) - parseInt(salida.nuevaCantidad),
        ultima_modificacion: new Date(),

    });
    const salidas = await addDoc(collection(db, "salidas"), salida);
    return salidas;
}
//eliminar salida

export const eliminarSalidas = async (id_producto, cantidad, id) => {
    const docRef = doc(db, "productos", id_producto)
    await updateDoc(docRef, {
        cantidad: cantidad
    })
    await deleteDoc(doc(db, "salidas", id));
    return "Salida eliminada correctamente";
}
//eliminar entrada
export const eliminarEntradas = async (id_producto, cantidad, id) => {
    const docRef = doc(db, "productos", id_producto)
    await updateDoc(docRef, {
        cantidad: cantidad
    })
    await deleteDoc(doc(db, "entradas", id));
    return "Entrada eliminada correctamente";
}
// filtar productos por nombre//

export const FiltrarProductos = async (nombre) => {
    const q = query(collection(db, 'productos'), where('nombre', '==', nombre));
    const querySnapshot = await getDocs(q);
    const productos = [];
    querySnapshot.forEach((doc) => {
        productos.push({ ...doc.data(), id: doc.id });
    });
    return productos;
}
export const ImportarProductos = async (productos) => {
    try {
        productos.forEach(async (producto) => {
            await addDoc(collection(db, "productos"), {
                nombre: producto?.nombre || "Sin nombre",
               //   fecha: producto?.fecha ? new Date(producto.fecha) : new Date(), 
                descripcion: producto?.descripcion || "Sin descripcion",
                codigo: producto?.codigo || "Sin codigo",
                modelo: producto?.modelo || "Sin modelo",
                cantidad: producto?.cantidad || 0,
                estatus: producto?.estatus || "En stock",
                fechaCreacion: new Date(),
                fechaModificacion: new Date(),

                
                //imagen: producto?.imagen || "https://outlet.melhuish.cl/wp-content/uploads/woocommerce-placeholder-600x600.png",
            });
        });
        return "Productos importados correctamente";
    } catch (error) {
        console.error(error);
        swal("Error", "Ocurrió un error al importar los productos revisa el archivo e intenta de nuevo", "error");

    }
};
//importar salidas
export const ImportarSalidas = async (salidas) => {
    //nombre	descripcion	codigo	modelo	cantidad	unidadMedida	peso	metrosCuadrados	nuevaCantidad	cantidadFinal	fecha

    try {
        salidas.forEach(async (salida) => {
            const docRef = doc(db, "productos", salida.id_producto)

            await updateDoc(docRef, {
                cantidad: parseInt(salida.cantidad) - parseInt(salida.nuevaCantidad),
                ultima_modificacion: new Date(),
                

            });
            await addDoc(collection(db, "salidas"), salida);
        });
        return "Salidas importadas correctamente";
    }


    catch (error) {
        console.error(error);
        swal("Error", "Ocurrió un error al importar las salidas revisa el archivo e intenta de nuevo", "error");

    }

}


//
export const CrearColor = async(nombre, color) => {
    var colorDB = await addDoc(collection(db, "color"),
    {
      nombre: nombre,
      color: color,
      fecha: new Date()
    }
    
    )
    return colorDB;
    
  }
  
  
  export const CargarColor= async ()=>{
    var res = await getDocs(collection(db,"color"), orderBy("fecha", "desc"));
    var colores = []
    res.forEach((doc)=>{
      colores.push({...doc.data(), id:doc.id});
    });
    return colores;
  }










