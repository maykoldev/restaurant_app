const btnGuardarCliente = document.querySelector('#guardar-cliente');

//estructura para guardar
let cliente ={
    mesa:'',
    hora:'',
    pedido:[]
}

const categorias={
    1:'Pizzas',
    2:'Postres',
    3:'Jugos',
    4:'Comida',
    5:'Cafe',
    6:'Bebidas'
}

btnGuardarCliente.addEventListener('click', guardarCliente);

function guardarCliente(){
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    const camposVacios = [mesa,hora].some(campo=>campo ==='');

    if(camposVacios){
       // console.log('campos vacios')
        //si los campos estan vacios
       const existeAlerta = document.querySelector('.invalid-feedack');

       if(!existeAlerta){
            const alerta = document.createElement('div');
            alerta.classList.add('invalid-feedack', 'text-center', 'text-danger');
            alerta.textContent = 'Los campos son obligatorios';
            document.querySelector('.modal-body form').appendChild(alerta);

            setTimeout(()=>{
                alerta.remove();
            },3000)
        } 
    }else{
        //caso tener campos llenos
        //console.log('campos llenos')
        cliente = {...cliente ,mesa,hora};
        console.log(cliente);

        const modalForm = document.querySelector('#formulario');
        const modal= bootstrap.Modal.getInstance(modalForm);
        modal.hide();

        mostrarSecciones();
        mostrarMenu();
    }
}

function mostrarSecciones(){
    const secciones=document.querySelectorAll('.d-none')
    //console.log(secciones);

    secciones.forEach(seccion=>seccion.classList.remove('d-none'));
}

function mostrarMenu(){
    const url =  ' http://localhost:3000/menu';

    fetch(url)
    .then(respuesta=>respuesta.json())
    .then(resultado=>verMenu(resultado))
    .catch(error=>console.log(error))
    
}

function verMenu(menu){
    const contenido = document.querySelector('#menu .contenido');
    menu.forEach(pos=>{
        const fila = document.createElement('div');
        fila.classList.add('row','border-top')
        const nombre = document.createElement('div');
        nombre.textContent=pos.nombre;
        nombre.classList.add('col-md-4', 'py-3')

        const precio = document.createElement('div');
        precio.textContent ='$'+ pos.precio;
        precio.classList.add('col-md-3', 'py-3')

        const categoria = document.createElement('div');
        categoria.textContent=categorias [pos.categoria];
        categoria.classList.add('col-md-3', 'py-3')

        const inputCantidad = document.createElement('input');
        inputCantidad.type='number',
        inputCantidad.min= 0;
        inputCantidad.value= 0;
        inputCantidad.id= `producto-${pos.id}`;
        //inputCantidad.classList.add('col-md-1');
        inputCantidad.onchange = function(){
            const cantidad = parseInt(inputCantidad.value);
            agregarOrden({...pos,cantidad});
        }
        const agregar = document.createElement('div');
        agregar.classList.add('col-md-1', 'py-3');
        agregar.appendChild(inputCantidad)
         
        fila.appendChild(nombre);
        fila.appendChild(precio);
        fila.appendChild(categoria);
        fila.appendChild(agregar);

        contenido.appendChild(fila);

    })
}

function agregarOrden(producto){
    let {pedido}= cliente;

   // const {producto} = cliente.pedido;

    console.log(pedido)
    
    if (producto.cantidad>0) {
        //validar que el producto exista
        if(pedido.some(item=>item.id===producto.id)){
            //haya producto
            const pedidoActualizado = pedido.map(i=>{
                if (i.id===producto.id){
                    i.cantidad = producto.cantidad;
                }
                return i;
            })

            cliente.pedido = [...pedidoActualizado]
        }else{
            //caso en que no exita el producto
            //agregamos el nuevo producto 
            cliente.pedido = [...pedido,producto];
            console.log(cliente)
        }
    } else {
        //caso en que cantidad sea cero
        const resultado = pedido.filter(item=>item.id !== producto.id);
        cliente.pedido = resultado;
    }

    limpiarHTML();


    //if (cliente.pedido.length){
        actualizarResumen();
    //}else{
        //console.log('pedido vacio')
    //}

}

function actualizarResumen (){
    const contenido = document.querySelector('#resumen .contenido');
    const resumen = document.createElement('div')

    //mostrar la mesa
    const mesa = document.createElement('p');
    mesa.textContent = 'Mesa: ';
    mesa.classList.add('fw-bold');

    const mesaCliente = document.createElement('span');
    mesaCliente.textContent = cliente.mesa;
    mesa.appendChild(mesaCliente);

    //mostrar hora
    const hora = document.createElement('p');
    hora.textContent = 'Hora: ';
    hora.classList.add('fw-bold');

    const horaCliente = document.createElement('spam');
    horaCliente.textContent = cliente.hora;
    hora.appendChild(horaCliente);

    //MOSTRAR LOS ITEM DEL MENU

    const heading = document.createElement ('h3');
    heading.textContent = 'Pedido: ';
    heading.classList.add(my-4);

    //producto pedido
    const {pedido}= cliente;
    pedido.forEach(item=>{
        const {nombre, cantidad, precio,id} = item;
        
        const lista = document.createElement('li');
        lista.classList.add('list-group-item');

        const nombreP = document.createElement('h4');
        nombreP.textContent = nombre;
        nombreP.classList.add('text-center','my-4');

        const cantidadP = document.createElement('p');
        cantidadP.classList.add('fw-bold');
        cantidadP.textContent='Precio: ';

        const cantidadValor = document.createElement('spam');
        cantidadValor.textContent = cantidad;

        const precioP = document.createElement('p');
        precioP.classList('fw-bold');
        precioP.textContent='Precio: ';
        
        const precioValor = document.createElement('spam');
        precioValor.textContent = `$${precio}`;



    })

    

    
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(heading);
    contenido.appendChild(resumen);

}

function limpiarHTML(){
    const contenido = document.querySelector('#resumen .contenido');
    while (contenido.firstChild){
        contenido.removeChild(contenido.firstChild);
    }
}