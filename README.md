# CRM Tool

Un CRM (Customer Relationship Management) moderno y profesional desarrollado como proyecto de portafolio. Permite gestionar clientes de manera eficiente, con una interfaz responsive, dark mode y almacenamiento local usando IndexedDB.

Preview: [AQUÍ](https://davidgr11.github.io/crm-tool/)

## Tecnologías utilizadas

- **HTML5**
- **CSS3** (Tailwind CSS para estilos y utilidades)
- **JavaScript (Vanilla)**
- **IndexedDB** (para almacenamiento local en el navegador)
- **Iconos**: [Icons8](https://icons8.com/)

## Estructura del proyecto

```
CRM with IndexDB/
├── css/
│   └── tailwind.min.css
├── js/
│   ├── app.js
│   ├── nuevocliente.js
│   └── editarcliente.js
├── index.html
├── nuevo-cliente.html
├── editar-cliente.html
└── README.md
```

## Características principales

- **Gestión de clientes**: Alta, edición y eliminación de clientes con validación de datos.
- **Persistencia local**: Todos los datos se almacenan en el navegador usando IndexedDB, sin backend.
- **Responsive**: Interfaz completamente adaptable a mobile, tablet y desktop.
- **Dark mode**: Paleta de colores oscura con acentos teal y amarillo.
- **Navegación mobile profesional**: Menú hamburguesa tipo drawer lateral derecho.
- **Tabla con scroll horizontal**: La tabla de clientes es desplazable en x en pantallas pequeñas.
- **Toasts y modales**: Alertas visuales y modales accesibles y modernos.
- **Footer informativo**: Información de autor y propósito en el footer.

## Instrucciones de uso

1. **Descarga o clona el repositorio**
2. Abre `index.html` en tu navegador favorito (no requiere servidor, funciona localmente)
3. Usa el menú para navegar entre clientes y agregar nuevos
4. Puedes cargar datos demo desde la pantalla de "Nuevo Cliente" (solo una vez por sesión)
5. Edita o elimina clientes desde la tabla principal

## Personalización

- **Colores y branding**: Puedes cambiar los colores principales en las clases Tailwind (`text-teal-300`, `bg-gray-900`, etc.)
- **Icono y título**: Modifica el `<title>` y el favicon en el `<head>` de `index.html`.
- **Footer**: Personaliza el texto y autor en el footer de cada página.

## Notas técnicas

- **IndexedDB**: Se usa una base de datos llamada `crm` con un object store para clientes. Cada cliente tiene un `id` autoincremental.
- **Validación**: Los formularios validan que todos los campos sean obligatorios y el email sea único.
- **Responsive**: Se usan utilidades de Tailwind y media queries para asegurar una experiencia óptima en todos los dispositivos.
- **Scroll personalizado**: La tabla de clientes tiene una barra de scroll horizontal personalizada solo para la tabla.
- **Accesibilidad**: Navegación por teclado, roles ARIA y foco visual en los elementos interactivos.

## Autor

Desarrollado por Devri: David González.

---

¡Siéntete libre de usar, modificar y compartir este CRM para tus propios proyectos o portafolio! 