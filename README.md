# Implementación de Carrito flotante + Confirmación Toast

## Estructura general

- **Carrito principal:** En el header, visible en escritorio cuando haces hover sobre el icono de la cesta.
- **Carrito flotante:** Aparece abajo a la derecha solo cuando el usuario hace scroll y el header no está en el viewport.
- **Modal de carrito:** Al pulsar el carrito flotante, muestra el contenido y control del carrito en un modal fijo (abajo derecha en pantalla).
- **Confirmación con Toast:** Cada vez que añades un curso/producto al carrito, aparece una tarjeta de notificación breve en la esquina superior derecha.

## Archivos principales

- `index.html`: Contiene toda la estructura y los contenedores necesarios, con los IDs y clases que requiere la lógica JS.
- `css/custom.css`: Define el estilo del carrito flotante, el modal, el header, las cards de producto y el toast de notificación.
- `js/app8.js`: Controla todo el comportamiento interactivo: añadir/eliminar productos, gestión del carrito, toasts, visibilidad flotante, sincronización con storage.

## Lógica para el carrito flotante

- El botón/flotante del carrito (`#carrito-flotante`) permanece oculto por defecto.
- Al hacer scroll, se ejecuta la función `checkCarritoVisible()`, que comprueba si el `<header>` principal está completamente fuera del viewport.
- Si el header no está en pantalla, el carrito flotante aparece ("fixed" abajo derecha).
- Si el header vuelve a ser visible, el carrito flotante se oculta automáticamente.

## Confirmación Toast al añadir productos

- Cada vez que añades un curso usando el botón "Añadir al carrito", se genera una notificación flotante breve (toast) en la esquina superior derecha.
- El toast muestra el nombre del producto y si la cantidad del mismo aumenta.
- Las notificaciones desaparecen automáticamente tras unos segundos, y no interrumpen el flujo de navegación.

## Ejemplo de flujo de usuario

1. Usuario entra en la web y ve el carrito en el header superior.
2. Añade productos desde las cards de oferta. Recibe una notificación (toast) confirmando la acción.
3. Cuando hace scroll y el header ya no es visible, aparece el botón flotante del carrito abajo a la derecha.
4. Al pulsar el flotante, se abre el modal con el detalle del carrito y opciones para vaciar o eliminar productos.
5. Los cambios en el carrito se mantienen mediante `localStorage`, incluso al recargar la página.

## Puntos clave de la implementación

- El botón flotante nunca interfiere con el header: sólo aparece si el header está completamente fuera de la ventana.
- La sincronización del carrito es automática gracias a `localStorage`.
- Las notificaciones toast son independientes y gestionadas por una función específica (`mostrarNotificacion`).

## Requerimientos/adaptaciones

- El código es compatible con Skeleton y estilos base; no depende de frameworks JS adicionales.
- Puedes ajustar estilos desde el CSS para personalizar el modal, el botón flotante o las toasts a tu gusto.
- Para ampliar el sistema, puedes crear nuevas variantes de toast, o añadir animaciones y UX mejoradas en el modal.

## Mantenimiento

- Revisa que las rutas de imágenes sean correctas en tu entorno local.
- Si añades más productos, sólo necesitas crear nuevas cards con la misma estructura y el JS detectará los eventos automáticamente.
- El sistema está preparado para ampliarse en caso de querer mostrar más información o modificar la lógica del botón flotante/modal.

---

Para dudas de mantenimiento, amplía la sección de "Lógica para el carrito flotante" o consulta el archivo `js/app8.js` y los selectores utilizados.
