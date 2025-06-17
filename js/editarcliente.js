(function () {
    let DB;
    const toast = document.getElementById('toast');
    const aboutModal = document.getElementById('about-modal');
    const closeAboutBtn = document.getElementById('close-about');
    const aboutNav = document.querySelector('a[href="#about"]');

    document.addEventListener("DOMContentLoaded", function () {
        conectarDB();
        const parametros = new URLSearchParams(window.location.search);
        const idCliente = parseInt(parametros.get('id'));

        if (idCliente) {
            setTimeout(() => {
            obtenerCliente(idCliente);}, 1000);
        }
     
        // About modal logic
        if (aboutNav) aboutNav.onclick = function(e) {
            e.preventDefault();
            openAboutModal();
        };
        if (closeAboutBtn) closeAboutBtn.onclick = closeAboutModal;
    });

    function obtenerCliente(id) {
        const transaction = DB.transaction('crm', 'readonly');
        const store = transaction.objectStore('crm');
        const cliente = store.get(id);

        cliente.onsuccess = () => {
            const result = cliente.result;
            if (result) {
                console.log('Cliente encontrado:', result);
                document.querySelector('#nombre').value = result.nombre;
                document.querySelector('#email').value = result.email;
                document.querySelector('#telefono').value = result.telefono;
                document.querySelector('#empresa').value = result.empresa;
                document.querySelector('#formulario input[type="submit"]').value = 'Actualizar Cliente';
                // Aquí puedes llenar los campos del formulario con los datos del cliente

                const formulario = document.querySelector('#formulario');
                formulario.addEventListener('submit', function (e) {
                    e.preventDefault();
                    const nombre = document.querySelector('#nombre').value;
                    const email = document.querySelector('#email').value;
                    const telefono = document.querySelector('#telefono').value;
                    const empresa = document.querySelector('#empresa').value;

                    if (nombre === '' || email === '' || telefono === '' || empresa === '') {
                        showToast('Todos los campos son obligatorios', 'error');
                        return;
                    }

                    // Actualizar cliente
                    const clienteActualizado = {
                        ...result,
                        nombre,
                        email,
                        telefono,
                        empresa
                    };

                    const transactionUpdate = DB.transaction(['crm'], 'readwrite');
                    const storeUpdate = transactionUpdate.objectStore('crm');
                    storeUpdate.put(clienteActualizado);

                    transactionUpdate.oncomplete = () => {
                        showToast('Cliente actualizado correctamente', 'success');
                        formulario.reset();
                        setTimeout(() => {
                            document.querySelector('#formulario input[type="submit"]').value = 'Actualizar Cliente';
                            window.location.href = 'index.html';
                        }, 1200);
                    };

                    transactionUpdate.onerror = () => {
                        showToast('Error al actualizar el cliente', 'error');
                    };
                });
            } else {
                showToast('Cliente no encontrado', 'error');
            }
        };

        cliente.onerror = () => {
            showToast('Error al obtener el cliente', 'error');
        };
    }

    function conectarDB(){
        const request = window.indexedDB.open('crm', 1);
        request.onerror = function() {
            showToast('Error al conectar a la base de datos', 'error');
        };
        request.onsuccess = function() {
            console.log('Conexión a la base de datos establecida');
            DB = request.result;
        };
    }

    // Toast notification
    function showToast(message, type = 'success') {
        if (!toast) return;
        let icon = type === 'error'
            ? '<svg class="w-6 h-6 inline-block mr-2 align-middle text-red-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>'
            : '<svg class="w-6 h-6 inline-block mr-2 align-middle text-teal-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>';
        toast.innerHTML = `
            <div class="flex items-center justify-center">
                ${icon}
                <span class="align-middle">${message}</span>
                <button id="close-toast" class="ml-4 text-2xl font-bold text-gray-400 hover:text-yellow-400 focus:outline-none">&times;</button>
            </div>
        `;
        toast.className = `fixed top-8 right-8 z-50 px-6 py-3 rounded shadow-lg text-white font-semibold flex items-center animate-fade-in ${type === 'error' ? 'bg-red-700' : 'bg-gray-800 border border-teal-400'}`;
        toast.classList.remove('hidden');
        document.getElementById('close-toast').onclick = () => toast.classList.add('hidden');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3500);
    }

    // Toast fade-in animation
    const style = document.createElement('style');
    style.innerHTML = `@keyframes fadeIn { from { opacity: 0; top: 0; } to { opacity: 1; top: 2rem; } } .animate-fade-in { animation: fadeIn 0.4s; }`;
    document.head.appendChild(style);

    // About modal logic
    function openAboutModal() {
        if (aboutModal) aboutModal.classList.remove('hidden');
    }
    function closeAboutModal() {
        if (aboutModal) aboutModal.classList.add('hidden');
    }
    // Close modal with Esc
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAboutModal();
        }
    });

})();