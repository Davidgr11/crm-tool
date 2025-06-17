(function () {
    let DB;
    let clientesData = [];
    let deleteId = null;

    // DOM Elements
    const listadoClientes = document.getElementById('listado-clientes');
    const searchInput = document.getElementById('search-client');
    const sortSelect = document.getElementById('sort-client');
    const toast = document.getElementById('toast');
    const modalDelete = document.getElementById('modal-delete');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    const emptyState = document.getElementById('empty-state');
    const aboutModal = document.getElementById('about-modal');
    const closeAboutBtn = document.getElementById('close-about');
    const aboutNav = document.querySelector('a[href="#about"]');

    document.addEventListener('DOMContentLoaded', function () {
        crearDB();
        if (searchInput) searchInput.addEventListener('input', renderClientes);
        if (sortSelect) sortSelect.addEventListener('change', renderClientes);
        if (cancelDeleteBtn) cancelDeleteBtn.onclick = closeModal;
        if (confirmDeleteBtn) confirmDeleteBtn.onclick = handleDelete;
        // About modal logic
        if (aboutNav) aboutNav.onclick = function(e) {
            e.preventDefault();
            openAboutModal();
        };
        if (closeAboutBtn) closeAboutBtn.onclick = closeAboutModal;
    });

    // Create or open IndexedDB
    function crearDB() {
        const crearDB = window.indexedDB.open('crm', 1);
        crearDB.onerror = () => showToast('Error al crear la base de datos', 'error');
        crearDB.onsuccess = () => {
            DB = crearDB.result;
            obtenerClientes();
        };
        crearDB.onupgradeneeded = (e) => {
            const db = e.target.result;
            const store = db.createObjectStore('crm', {
                keyPath: 'id',
                autoIncrement: true
            });
            store.createIndex('nombre', 'nombre', { unique: false });
            store.createIndex('email', 'email', { unique: true });
            store.createIndex('telefono', 'telefono', { unique: false });
            store.createIndex('empresa', 'empresa', { unique: false });
            store.createIndex('id', 'id', { unique: true });
        };
    }

    // Fetch all clients from DB
    function obtenerClientes() {
        const t = DB.transaction('crm', 'readonly');
        const store = t.objectStore('crm');
        const clientes = store.getAll();
        clientes.onsuccess = () => {
            clientesData = clientes.result;
            renderClientes();
        };
        clientes.onerror = () => showToast('Error al obtener los clientes', 'error');
    }

    // Render clients with search, sort, and empty state
    function renderClientes() {
        if (!listadoClientes) return;
        listadoClientes.innerHTML = '';
        let filtered = [...clientesData];
        // Search
        const search = searchInput ? searchInput.value.toLowerCase() : '';
        if (search) {
            filtered = filtered.filter(c =>
                c.nombre.toLowerCase().includes(search) ||
                c.email.toLowerCase().includes(search) ||
                c.empresa.toLowerCase().includes(search)
            );
        }
        // Sort
        const sortBy = sortSelect ? sortSelect.value : 'nombre';
        filtered.sort((a, b) => {
            if (a[sortBy] < b[sortBy]) return -1;
            if (a[sortBy] > b[sortBy]) return 1;
            return 0;
        });
        // Empty state
        if (filtered.length === 0) {
            if (emptyState) emptyState.classList.remove('hidden');
            return;
        } else {
            if (emptyState) emptyState.classList.add('hidden');
        }
        // Render rows
        filtered.forEach(cliente => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td class="px-3 md:px-6 py-2 md:py-4 text-white">${cliente.nombre}</td>
                <td class="px-3 md:px-6 py-2 md:py-4 text-white">${cliente.email}</td>
                <td class="px-3 md:px-6 py-2 md:py-4 text-white">${cliente.telefono}</td>
                <td class="px-3 md:px-6 py-2 md:py-4 text-white">${cliente.empresa}</td>
                <td class="px-3 md:px-6 py-2 md:py-4 flex gap-2 justify-center">
                    <button class="btn-editar text-teal-300 hover:text-yellow-400 font-semibold underline underline-offset-2" aria-label="Editar cliente" title="Editar cliente">Editar</button>
                    <button class="btn-eliminar text-red-400 hover:text-yellow-400 font-semibold underline underline-offset-2" aria-label="Eliminar cliente" title="Eliminar cliente">Eliminar</button>
                </td>
            `;
            // Edit button
            newRow.querySelector('.btn-editar').onclick = () => {
                const url = new URL('editar-cliente.html', window.location.href);
                url.searchParams.set('id', cliente.id);
                window.location.href = url.toString();
            };
            // Delete button
            newRow.querySelector('.btn-eliminar').onclick = () => {
                deleteId = cliente.id;
                openModal();
            };
            newRow.className = 'border-b border-gray-800 hover:bg-gray-800 text-center transition-colors';
            listadoClientes.appendChild(newRow);
        });
    }

    // Modal logic
    function openModal() {
        if (modalDelete) modalDelete.classList.remove('hidden');
    }
    function closeModal() {
        if (modalDelete) modalDelete.classList.add('hidden');
        deleteId = null;
    }
    function handleDelete() {
        if (!deleteId) return;
        const t = DB.transaction('crm', 'readwrite');
        const store = t.objectStore('crm');
        store.delete(deleteId);
        t.oncomplete = () => {
            showToast('Cliente eliminado', 'success');
            closeModal();
            obtenerClientes();
        };
        t.onerror = () => showToast('Error al eliminar cliente', 'error');
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
        toast.className = `fixed top-4 right-4 md:top-8 md:right-8 z-50 max-w-xs w-full px-4 py-3 rounded shadow-lg text-white font-semibold flex items-center animate-fade-in ${type === 'error' ? 'bg-red-700' : 'bg-gray-800 border border-teal-400'}`;
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
            closeModal();
            closeAboutModal();
        }
    });

    // For demo: expose a function to load demo data (only once per session)
    window.loadDemoClients = function () {
        if (sessionStorage.getItem('demoLoaded')) {
            showToast('Los datos demo ya fueron cargados en esta sesión.', 'error');
            return;
        }
        const demo = [
            { nombre: 'Juan Pérez', email: 'juan@demo.com', telefono: '555-1234', empresa: 'DemoCorp', id: Date.now() },
            { nombre: 'Ana López', email: 'ana@demo.com', telefono: '555-5678', empresa: 'InnovateX', id: Date.now() + 1 }
        ];
        const t = DB.transaction(['crm'], 'readwrite');
        const store = t.objectStore('crm');
        demo.forEach(c => store.add(c));
        t.oncomplete = () => {
            showToast('Datos demo agregados correctamente.', 'success');
            sessionStorage.setItem('demoLoaded', '1');
            // Remove demo button if present
            const demoBtn = document.getElementById('demo-btn');
            if (demoBtn) demoBtn.parentElement.removeChild(demoBtn);
            obtenerClientes();
        };
        t.onerror = () => showToast('Error al agregar los datos demo.', 'error');
    };
})();