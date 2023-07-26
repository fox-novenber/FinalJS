
        const verdurasUrl = "./verduras.json";
        let productos = [];

        fetch(verdurasUrl)
            .then(response => response.json())
            .then(data => {
                productos = data;      

            }) 
            .catch(mensajeError => alert("Error al cargar productos"));


        let tarjetas = document.getElementById("tarjetas");
        let carrito = [];

            crearTarjetas(productos);
            mostrarCarrito();

        // Obtener datos del carrito desde el Local Storage (si existen)
        const carritoJSON = localStorage.getItem("carrito");
        if (carritoJSON) {
            carrito = JSON.parse(carritoJSON);
        }

        function crearTarjetas(productos) {
            tarjetas.innerHTML = "";
            productos.forEach(elemento => {
                let tarjetita = document.createElement("div");
                tarjetita.className = "estiloTarjeta";

                tarjetita.innerHTML = `
                    <h3>${elemento.producto}</h3>
                    <img class="imagen" src="imagenes/${elemento.Imagen}">
                    <h3>${elemento.precio}$</h3>
                    <button onclick="agregarAlCarrito(${elemento.id})">Agregar al carrito</button>
                `;
                tarjetas.appendChild(tarjetita);
            });
        }

        function mostrarCarrito() {
            let carritoContainer = document.getElementById("carrito");
            carritoContainer.innerHTML = "";
            carrito.forEach(item => {
                let itemCarrito = document.createElement("div");
                itemCarrito.className = "itemCarrito";

                itemCarrito.innerHTML = `
                    <h3>${item.producto}</h3>
                    <p>Precio: ${item.precio}$</p>
                    <p>Cantidad: ${item.cantidad}</p>
                    <button class="fachaBotones" id="restarCantidad" onclick="restarCantidad (${item.id})">-</button>
                    <button class="fachaBotones" id="sumarCantidad"  onclick="sumarCantidad(${item.id})">+</button>
                    <button class="fachaBotones" id="eliminarItem" onclick="eliminarItem(${item.id})">Eliminar</button>
                `;
                carritoContainer.appendChild(itemCarrito);
            });

            // Guardar los datos del carrito en el Local Storage
            localStorage.setItem("carrito", JSON.stringify(carrito));
        }

        function agregarAlCarrito(id) {
            let producto = productos.find(item => item.id === id);
            let itemCarrito = carrito.find(item => item.id === id);

            if (itemCarrito) {
                itemCarrito.cantidad++;
            } else {
                carrito.push({ ...producto, cantidad: 1 });
            }

            Toastify({
                text: "Producto agregado al carrito",
                duration: 3000
            }).showToast();

            mostrarCarrito();
        }

        function restarCantidad(id) {
            let itemCarrito = carrito.find(item => item.id === id);

            if (itemCarrito) {
                itemCarrito.cantidad--;
                if (itemCarrito.cantidad === 0) {
                    eliminarItem(id);
                }
            }
            Toastify({
                text: "Se ha restado un item del carrito.",
                duration: 3000,
                style: {
                    background: "radial-gradient(circle at 50% -20.71%, #f58070 0, #e8766f 25%, #d86c6c 50%, #c86269 75%, #b95a66 100%)"
                }
            }).showToast();

            mostrarCarrito();
        }

        function sumarCantidad(id) {
            let itemCarrito = carrito.find(item => item.id === id);

            if (itemCarrito) {
                itemCarrito.cantidad++;
            }

            Toastify({
                text: "Se ha sumado un item del carrito.",
                duration: 3000,
                style: {
                    background: "radial-gradient(circle at 107.92% 9.44%, #ffff5d 0, #f2f23c 50%, #d4de06 100%)"
                }
            }).showToast();

            mostrarCarrito();
        }

        function eliminarItem(id) {
            carrito = carrito.filter(item => item.id !== id);

            Toastify({
                text: "Item Eliminado.",
                duration: 3000,
                style: {
                    background: "radial-gradient(circle at 6.27% -2.11%, #f78341 0, #f2793c 50%, #ed6f37 100%)"
                }
            }).showToast();

            mostrarCarrito();
        }

        let buscador = document.getElementById("buscador");
        buscador.addEventListener("input", filtrar);

        let boton = document.getElementById("botonBuscar");
        boton.addEventListener("click", filtrar);

        let botonImportados = document.getElementById("botonImportado");
        botonImportados.addEventListener("click", filtrarPorCategoria);

        let botonNacionales = document.getElementById("botonNacional");
        botonNacionales.addEventListener("click", filtrarPorCategoria);

        function filtrar() {
            let valorBusqueda = buscador.value.toLowerCase();
            let arrayFiltrado = productos.filter(fruta =>
                fruta.producto.toLowerCase().includes(valorBusqueda) ||
                fruta.origen.toLowerCase().includes(valorBusqueda)
            );
            crearTarjetas(arrayFiltrado);
        }

        function filtrarPorCategoria(e) {
            let categoria = e.target.value;
            let arrayFiltrado;
            if (categoria === "importado") {
                arrayFiltrado = productos.filter(fruta => fruta.origen === "importado");
            } else if (categoria === "nacional") {
                arrayFiltrado = productos.filter(fruta => fruta.origen === "nacional");
            } else {
                arrayFiltrado = productos;
            }
            crearTarjetas(arrayFiltrado);
        }
