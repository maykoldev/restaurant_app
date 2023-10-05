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


    if (cliente.pedido.length){
        actualizarResumen();
    }else{
        mensajePedidoVacio();
        //console.log('pedido vacio')
    }

}

function actualizarResumen (){
    const contenido = document.querySelector('#resumen .contenido');
    const resumen = document.createElement('div');
    resumen.classList.add('col-md-4', 'card', 'shadow', 'py-5', 'px-3');

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

    const horaCliente = document.createElement('span');
    horaCliente.textContent = cliente.hora;
    hora.appendChild(horaCliente);

    //MOSTRAR LOS ITEM DEL MENU

    const heading = document.createElement ('h3');
    heading.textContent = 'Pedido: ';
    heading.classList.add('my-4');

    //creacuin del ul para los li

    const grupo = document.createElement('ul');
    grupo.classList.add('list-group');


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
        cantidadP.textContent='Cantidad: ';

        const cantidadValor = document.createElement('span');
        cantidadValor.textContent = cantidad;

        const precioP = document.createElement('p');
        precioP.classList.add('fw-bold');
        precioP.textContent='Precio: ';
        
        const precioValor = document.createElement('span');
        precioValor.textContent = `$${precio}`;

        const subTotalP = document.createElement('p');
        subTotalP.classList.add('fw-bold');
        subTotalP.textContent = 'SubTotal: ';

        const subtotalValor = document.createElement('span');
        subtotalValor.textContent = calcularSubtotal(item);

        //boton eliminar articulo
        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add('btn', 'btn-danger');
        btnEliminar.textContent = 'X';
        btnEliminar.onclick = function(){
            eliminarProducto(id);

        }

        cantidadP.appendChild(cantidadValor);
        precioP.appendChild(precioValor);
        subTotalP.appendChild(subtotalValor);

        lista.appendChild(nombreP);
        lista.appendChild(cantidadP);
        lista.appendChild(precioP);
        lista.appendChild(subTotalP);
        lista.appendChild(btnEliminar);

        grupo.appendChild(lista)

    })

    

    
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(heading);
    resumen.appendChild(grupo);
    contenido.appendChild(resumen);

    //mostrar la calculadora de propina
   formularioPropinas();

}
 function formularioPropinas(){
        const contenido = document.querySelector('#resumen .contenido')
        const formulario = document.createElement('div');
        formulario.classList.add('col-md-4','formulario');

        const heading = document.createElement('h3');
        heading.classList.add('my-4');
        heading.textContent = 'Propina: ';

        //propina 5%
        const op5 = document.createElement('input');
        op5.type = 'radio';
        op5.name = 'propina';
        op5.value = '5'
        op5.classList.add('form-check-input')
        op5.onclick = calcularPropina;

        const labelop5 = document.createElement('label')
        labelop5.textContent = '5%'
        labelop5.classList.add('form-check-label');

        //propina 10%
        
        const op10 = document.createElement('input');
        op10.type = 'radio';
        op10.name = 'propina';
        op10.value = '10';
        op10.classList.add('form-check-input')
        op10.onclick = calcularPropina;

        const labelop10 = document.createElement('label')
        labelop10.textContent = '10%'
        labelop10.classList.add('form-check-label');


        formulario.appendChild(heading);
        formulario.appendChild(op5);
        formulario.appendChild(labelop5);
        formulario.appendChild(op10);
        formulario.appendChild(labelop10);

        contenido.appendChild(formulario);
    }
//aca calculamos la propina
function calcularPropina(){
   // console.log('calcular propina')
   const radioSeleccionado = document.querySelector('[name="propina"]:checked').value;//asi me posiciono sobre el checkbox

   const {pedido} = cliente;
   let subtotal = 0;
   pedido.forEach(i=>{
    subtotal += i.cantidad * i.precio;
   })

   const divTotales = document.createElement('div');
   divTotales.classList.add('total-pagar');

   //propina
   const propina = (subtotal*parseInt(radioSeleccionado))/100;
   const iva = subtotal*0.16;

   const total = propina + subtotal;

   //subtotal
   const subtotalP = document.createElement('p');
   subtotalP.textContent = 'Subtotal: ';
   subtotalP.classList.add('fw-bold','fs-3','mt-5')

   const subtotalValor = document.createElement('span');
   subtotalValor.textContent = `$${subtotal}`;
   subtotalP.appendChild(subtotalValor);

   //iva

   const ivaP = document.createElement('p');
   ivaP.textContent = 'IVA 16%: ';

   const ivaValor = document.createElement('span');
   ivaValor.textContent = `$${iva}`;
   ivaP.appendChild(ivaValor);

   //propina
   const propinaP = document.createElement('p');
   propinaP.textContent = 'Propina: ';

   const propinaValor = document.createElement('span');
   propinaValor.textContent = `$${propina}`;
   propinaP.appendChild(propinaValor);

   const totalP = document.createElement('p');
   totalP.textContent = 'Total a pagar: ';
   
   const totalValor = document.createElement('span');
   totalValor.textContent = `$${total}`;
   totalP.appendChild(totalValor);

   const totalPagarDiv = document.querySelector('.total-pagar');
   if(totalPagarDiv){
    totalPagarDiv.remove();

   }

   divTotales.appendChild(subtotalP);
   divTotales.appendChild(ivaP);
   divTotales.appendChild(propinaP);
   divTotales.appendChild(totalP);

   const formulario = document.querySelector('.formulario');
   formulario.appendChild(divTotales);
}

function calcularSubtotal (p){
    const {cantidad,precio} = p;
    return `$${cantidad*precio}`;

}
//eliminar articulo mediante id
function eliminarProducto(id){
    const {pedido} = cliente;
    cliente.pedido = pedido.filter (i=>i.id!==id);

    limpiarHTML();
    //console.log(cliente.pedidp.lengt)

    if (cliente.pedido.length>0){
        actualizarResumen();
    }else{
        //console.log('pedido')
        mensajePedidoVacio();
    }

    //ahora como eliminamos el producto debemos actualizar la cantidad en el imput a cero
    const productoEliminado = `#producto-${id}`;
    const inputEliminado = document.querySelector(productoEliminado);
    inputEliminado.value = 0;
}

function mensajePedidoVacio(){
    const contenido = document.querySelector('#resumen .contenido');
    const texto = document.createElement('p');
    texto.classList.add('text-center');
    texto.textContent = 'Agrega productos al pedido';
    contenido.appendChild(texto);
}


function limpiarHTML(){
    const contenido = document.querySelector('#resumen .contenido');
    while (contenido.firstChild){
        contenido.removeChild(contenido.firstChild);
    }
}