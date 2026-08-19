# Matriz de Seguimiento de Trabajos (1ra Etapa)

Sistema completo de gestión y seguimiento de tickets/trabajos para Google Sheets y Google Apps Script, optimizado para computadoras y **dispositivos móviles (celulares/tablets con Android e iOS)**.

## 📋 Descripción

Este proyecto proporciona un script integral en Google Apps Script (`Code.gs`) que transforma una hoja de Google Sheets en una **Matriz de Seguimiento de Trabajos Asignados**. Permite llevar el control completo de tareas desde su registro hasta su cierre y facturación, adaptado para que supervisores y encargados puedan operar directamente desde el celular en campo.

---

## 🛠️ Estructura de la Hoja Principal (`Matriz`)

La hoja principal contiene las siguientes columnas:

| Columna | Encabezado | Descripción / Comportamiento |
|---|---|---|
| **A** | ID | Generado automáticamente (`TICKET-001`, `TICKET-002`...) |
| **B** | Fecha de Registro | Fecha y hora generada automáticamente |
| **C** | Servicio | Lista desplegable vinculada a la hoja `Servicios` |
| **D** | Categoría | Lista desplegable: *Mantenimiento, Suministro, Emergencia, Proyecto Especial* |
| **E** | Empresa / Cliente | Lista desplegable vinculada a la hoja `Empresas` |
| **F** | Sucursal | Lista desplegable dinámica que se filtra según la Empresa elegida |
| **G** | Ubicación | Llenado automático al elegir la Sucursal |
| **H** | Nombre Solicitante | Texto libre (Responsable de la Empresa) |
| **I** | Teléfono | Teléfono de contacto |
| **J** | Correo | Correo electrónico de contacto |
| **K** | Supervisor Responsable | Lista desplegable vinculada a la hoja `Supervisores` |
| **L** | Descripción del trabajo | Descripción detallada de las actividades asignadas |
| **M** | Estatus de Atención | *Baja, Media, Alta, Urgente* |
| **N** | Fecha de Asignación | Fecha asignada para realizar el trabajo |
| **O** | Trabajador / Contratista / Empresa | Lista desplegable vinculada a la hoja `Trabajadores` |
| **P** | Estatus | Estado del ticket (Ver ciclo de estatus) |
| **Q** | Motivo de Parada | Detalle cuando el estatus es *Parado por...* |
| **R** | Evidencias (Fotos) | Enlace a la carpeta de Google Drive (Escribir `CREAR` en celular para generar) |
| **S** | Fecha Finalización | Registrada automáticamente al finalizar o cerrar |
| **T** | Observaciones | Notas adicionales |
| **U** | Link WhatsApp Supervisor | Enlace directo para abrir WhatsApp con 1 solo toque desde celular |
| **V** | Color / Estado visual | Coloreado automático según el estatus activo |

---

## 📱 Uso desde el Celular (App de Google Sheets)

Para modificar la matriz fácilmente desde un teléfono inteligente (Android o iPhone):

1. **Edición Nativa**: Abre la aplicación oficial de **Google Sheets** en tu celular.
2. **Listas Desplegables**: Al tocar las celdas de *Empresa, Sucursal, Estatus, etc.*, la app móvil muestra el selector táctil con las opciones.
3. **Disparadores Automáticos**: El script utiliza el evento `onEdit(e)`, por lo que cualquier cambio realizado desde el celular ejecutará automáticamente:
   - Asignación de ID y Fecha de Registro.
   - Filtro de Sucursal y autollenado de Ubicación.
   - Generación del enlace directo de WhatsApp en la Columna U.
   - Coloreado de la fila y envío de correos electrónicos.
4. **Enviar WhatsApp desde Celular**: Ve a la **Columna U** y toca el enlace `https://wa.me/...`; se abrirá directamente la App de WhatsApp con el mensaje formateado para el supervisor.
5. **Crear Carpeta de Drive desde Celular**: Escribe la palabra `CREAR` o `NUEVA` en la celda de la **Columna R (Evidencias)**. Al presionar guardar, el script creará la carpeta en Google Drive y reemplazará el texto con la URL de la carpeta.

---

## 🔄 Ciclo de Estatus y Notificaciones por Correo

1. **Registrado**: Estado inicial.
2. **Asignada a Supervisor**: Envía correo de notificación automática al Supervisor seleccionado con el detalle del ticket.
3. **Asignada a Trabajador/Contratista**: Envía correo de notificación automática al Trabajador / Contratista asignado.
4. **En proceso**: Indica trabajo en ejecución.
5. **Parado por materiales / cliente / otra razón**: Envía correo de alerta inmediata a la **Encargada**, a la **Asistente** y al **Supervisor**.
6. **Finalizado**: Se coloca la fecha de finalización y envía correo a todos los involucrados (*Encargada, Asistente, Supervisor, Cliente*) **exceptuando a los trabajadores/contratistas** para emitir cotización y factura.
7. **Pagado y Cerrado**: Pinta automáticamente toda la fila del ticket en **VERDE**.

---

## 📂 Hojas Auxiliares (Catálogos Modificables)

El sistema crea y gestiona automáticamente las siguientes hojas auxiliares para que puedas agregar o modificar datos según tu organización:

- **`Servicios`**: Lista de servicios ofrecidos.
- **`Categorias`**: Mantenimiento, Suministro, Emergencia, Proyecto Especial.
- **`Empresas`**: Nombres de las empresas / clientes.
- **`Sucursales`**: Relación de Empresa - Sucursal - Ubicación exacta.
- **`Supervisores`**: Nombre, Correo y Teléfono (WhatsApp) de los supervisores.
- **`Trabajadores`**: Nombre, Tipo (*Trabajador / Contratista / Empresa*), Correo y Teléfono.
- **`Configuracion`**: Correos de la Encargada, Asistente e ID de la carpeta raíz de Google Drive.

---

## 🚀 Instrucciones de Instalación en Google Sheets

1. Abre tu hoja de cálculo en **Google Sheets** (desde la computadora).
2. Ve al menú superior y selecciona **Extensiones > Apps Script**.
3. Elimina el código existente en el archivo `Code.gs` y **pega todo el contenido** del archivo `Code.gs` de este repositorio.
4. Haz clic en el ícono de **Guardar** (💾) o presiona `Ctrl + S` / `Cmd + S`.
5. Vuelve a tu Google Sheet y recarga la página.
6. En el menú superior aparecerá la pestaña personalizada **"Matriz de Seguimiento"**.
7. Haz clic en **Matriz de Seguimiento > Inicializar / Configurar Hoja**.
   *(Si es la primera vez, Google te pedirá autorizar los permisos del script)*.

---

## 🧪 Pruebas Locales

Para ejecutar la suite de pruebas unitarias locales:

```bash
node test/code.test.js
```
