(function (){
    // SELECTORS
    let DB;
    const formulario = document.querySelector('#formulario');
    const toast = document.getElementById('toast');
    const aboutModal = document.getElementById('about-modal');
    const closeAboutBtn = document.getElementById('close-about');
    const aboutNav = document.querySelector('a[href="#about"]');

    // EVENT LISTENERS & INITIALIZATION
    document.addEventListener("DOMContentLoaded", function() {
        conectarDB();
        formulario.addEventListener('submit', validarCliente);
        // About modal logic
        if (aboutNav) aboutNav.onclick = function(e) {
            e.preventDefault();
            openAboutModal();
        };
        if (closeAboutBtn) closeAboutBtn.onclick = closeAboutModal;
    });

    // FUNCTIONS
    function conectarDB(){
        const request = window.indexedDB.open('crm', 1);
        request.onerror = function() {
            showToast('Error al conectar a la base de datos', 'error');
        };
        request.onsuccess = function() {
            DB = request.result;
        };
    }

    function validarCliente(e){
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;
        e.preventDefault();
        if(nombre === '' || email === '' || telefono === '' || empresa === ''){
            showToast('Todos los campos son obligatorios', 'error');
            return;
        }
        // Create Static Object
        const cliente = {
            nombre,
            email,
            telefono,
            empresa,
            id: Date.now() // Unique ID based on timestamp
        };
        crearCliente(cliente);
    }

    function crearCliente(cliente){
        const t = DB.transaction(['crm'], 'readwrite');
        const store = t.objectStore('crm');
        store.add(cliente);
        t.onerror = function() {
            showToast('Error al agregar el cliente', 'error');
        };
        t.oncomplete = function() {
            showToast('Cliente agregado correctamente', 'success');
            formulario.reset();
            setTimeout(() => {
                window.location.href = 'index.html'; // Redirect to index page
            }, 1500);
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
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1200);
            const demoBtn = document.getElementById('demo-btn');
            if (demoBtn) demoBtn.parentElement.removeChild(demoBtn);
        };
        t.onerror = () => showToast('Error al agregar los datos demo.', 'error');
    };
})();