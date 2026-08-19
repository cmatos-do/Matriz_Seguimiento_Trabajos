# Matriz de Seguimiento de Trabajos (1ra Etapa)

Sistema completo de gestión y seguimiento de tickets/trabajos para Google Sheets y Google Apps Script.

## 📋 Descripción

Este proyecto proporciona un script integral en Google Apps Script (`Code.gs`) que transforma una hoja de Google Sheets en una **Matriz de Seguimiento de Trabajos Asignados**. Permite llevar el control completo de tareas desde su registro hasta su cierre y facturación.

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
| **R** | Evidencias (Fotos) | Enlace a la carpeta de Google Drive creada para el ticket |
| **S** | Fecha Finalización | Registrada automáticamente al finalizar o cerrar |
| **T** | Observaciones | Notas adicionales |
| **U** | Color / Estado visual | Coloreado automático según el estatus activo |

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

1. Abre tu hoja de cálculo en **Google Sheets**.
2. Ve al menú superior y selecciona **Extensiones > Apps Script**.
3. Elimina el código existente en el archivo `Code.gs` y **pega todo el contenido** del archivo `Code.gs` de este repositorio.
4. Haz clic en el ícono de **Guardar** (💾) o presiona `Ctrl + S` / `Cmd + S`.
5. Vuelve a tu Google Sheet y recarga la página.
6. En el menú superior aparecerá la pestaña personalizada **"Matriz de Seguimiento"**.
7. Haz clic en **Matriz de Seguimiento > Inicializar / Configurar Hoja**.
   *(Si es la primera vez, Google te pedirá autorizar los permisos del script)*.

---

## 📱 Funcionalidades Adicionales del Menú

- **Enviar WhatsApp a Supervisor**: Selecciona cualquier celda de la fila del ticket y haz clic en este menú para abrir WhatsApp Web / App con un mensaje pre-armado listo para enviar al supervisor asignado.
- **Crear Carpeta de Evidencias en Drive**: Selecciona cualquier celda de la fila del ticket y ejecuta esta opción para crear una carpeta dedicada en Google Drive y pegar la URL automáticamente en la columna **Evidencias (Fotos)**.

---

## 🧪 Pruebas Locales

Para ejecutar la suite de pruebas unitarias locales:

```bash
node test/code.test.js
```
