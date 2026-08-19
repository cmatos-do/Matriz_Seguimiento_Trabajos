/**
 * MATRIZ DE SEGUIMIENTO DE TRABAJOS - GOOGLE APPS SCRIPT
 * 1ra Etapa - Sistema Completo de Gestión de Tickets y Trabajos Asignados
 * Optimizado para uso en computadoras y teléfonos móviles (Google Sheets App Android/iOS)
 */

// ==========================================
// CONSTANTES Y CONFIGURACIÓN GLOBAL
// ==========================================
const HOJAS = {
  MATRIZ: 'Matriz',
  SERVICIOS: 'Servicios',
  CATEGORIAS: 'Categorias',
  EMPRESAS: 'Empresas',
  SUCURSALES: 'Sucursales',
  SUPERVISORES: 'Supervisores',
  TRABAJADORES: 'Trabajadores',
  CONFIGURACION: 'Configuracion'
};

const COLUMNAS_MATRIZ = {
  ID: 1,                    // A
  FECHA_REGISTRO: 2,        // B
  SERVICIO: 3,              // C
  CATEGORIA: 4,             // D
  EMPRESA: 5,               // E
  SUCURSAL: 6,              // F
  UBICACION: 7,             // G
  NOMBRE_SOLICITANTE: 8,    // H
  TELEFONO_SOLICITANTE: 9,  // I
  CORREO_SOLICITANTE: 10,   // J
  SUPERVISOR: 11,           // K
  DESCRIPCION: 12,          // L
  ESTATUS_ATENCION: 13,     // M
  FECHA_ASIGNACION: 14,     // N
  TRABAJADOR: 15,           // O
  ESTATUS: 16,              // P
  MOTIVO_PARADA: 17,        // Q
  EVIDENCIAS: 18,           // R
  FECHA_FINALIZACION: 19,   // S
  OBSERVACIONES: 20,        // T
  LINK_WHATSAPP: 21,        // U (Enlace directo a WhatsApp fácil de tocar en celular)
  COLOR_ESTADO: 22          // V
};

const ESTATUS_OPCIONES = [
  'Registrado',
  'Asignada a Supervisor',
  'Asignada a Trabajador/Contratista',
  'En proceso',
  'Parado por materiales',
  'Parado por cliente',
  'Parado por otra razón',
  'Finalizado',
  'Pagado y Cerrado'
];

const CATEGORIAS_OPCIONES = [
  'Mantenimiento',
  'Suministro',
  'Emergencia',
  'Proyecto Especial'
];

const ESTATUS_ATENCION_OPCIONES = [
  'Baja',
  'Media',
  'Alta',
  'Urgente'
];

// ==========================================
// MENÚ PERSONALIZADO (Para PC)
// ==========================================
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  if (ui) {
    ui.createMenu('Matriz de Seguimiento')
      .addItem('Inicializar / Configurar Hoja', 'inicializarSistema')
      .addSeparator()
      .addItem('Enviar WhatsApp a Supervisor', 'enviarWhatsAppSupervisorSeleccionado')
      .addItem('Crear Carpeta de Evidencias en Drive', 'crearCarpetaEvidenciasSeleccionada')
      .addToUi();
  }
}

// ==========================================
// INICIALIZACIÓN DEL SISTEMA
// ==========================================
function inicializarSistema() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Crear hojas auxiliares si no existen
  const hojasRequeridas = [
    HOJAS.MATRIZ,
    HOJAS.SERVICIOS,
    HOJAS.CATEGORIAS,
    HOJAS.EMPRESAS,
    HOJAS.SUCURSALES,
    HOJAS.SUPERVISORES,
    HOJAS.TRABAJADORES,
    HOJAS.CONFIGURACION
  ];

  hojasRequeridas.forEach(nombreHoja => {
    let hoja = ss.getSheetByName(nombreHoja);
    if (!hoja) {
      hoja = ss.insertSheet(nombreHoja);
    }
  });

  // 2. Poblar datos por defecto en hojas auxiliares si están vacías
  poblarHojasAuxiliares(ss);

  // 3. Configurar encabezados y formato de la hoja Matriz
  configurarHojaMatriz(ss);

  try {
    SpreadsheetApp.getUi().alert('✅ Sistema de Matriz de Seguimiento inicializado correctamente.');
  } catch (e) {
    Logger.log('Sistema inicializado.');
  }
}

function poblarHojasAuxiliares(ss) {
  // Categorias
  const hojaCat = ss.getSheetByName(HOJAS.CATEGORIAS);
  if (hojaCat.getLastRow() === 0) {
    hojaCat.appendRow(['Categoría']);
    CATEGORIAS_OPCIONES.forEach(cat => hojaCat.appendRow([cat]));
  }

  // Servicios
  const hojaServ = ss.getSheetByName(HOJAS.SERVICIOS);
  if (hojaServ.getLastRow() === 0) {
    hojaServ.appendRow(['Nombre del Servicio']);
    ['Mantenimiento AA', 'Electricidad', 'Plomería', 'Pintura', 'Sistemas', 'Suministro de Materiales'].forEach(s => hojaServ.appendRow([s]));
  }

  // Empresas
  const hojaEmp = ss.getSheetByName(HOJAS.EMPRESAS);
  if (hojaEmp.getLastRow() === 0) {
    hojaEmp.appendRow(['Empresa / Cliente']);
    ['Empresa Alfa', 'Empresa Beta', 'Cliente Gama'].forEach(e => hojaEmp.appendRow([e]));
  }

  // Sucursales
  const hojaSuc = ss.getSheetByName(HOJAS.SUCURSALES);
  if (hojaSuc.getLastRow() === 0) {
    hojaSuc.appendRow(['Empresa', 'Sucursal', 'Ubicación']);
    hojaSuc.appendRow(['Empresa Alfa', 'Sucursal Centro', 'Av. Principal #123, Centro']);
    hojaSuc.appendRow(['Empresa Alfa', 'Sucursal Norte', 'Calle Norte #456, ZI']);
    hojaSuc.appendRow(['Empresa Beta', 'Sucursal Matriz', 'Plaza Comercial Lote 8']);
    hojaSuc.appendRow(['Cliente Gama', 'Sucursal Sur', 'Av. Sur #789']);
  }

  // Supervisores
  const hojaSup = ss.getSheetByName(HOJAS.SUPERVISORES);
  if (hojaSup.getLastRow() === 0) {
    hojaSup.appendRow(['Nombre', 'Correo', 'Teléfono (WhatsApp)']);
    hojaSup.appendRow(['Carlos Mendoza', 'carlos.mendoza@empresa.com', '+5215551234567']);
    hojaSup.appendRow(['Ana Torres', 'ana.torres@empresa.com', '+5215559876543']);
  }

  // Trabajadores
  const hojaTrab = ss.getSheetByName(HOJAS.TRABAJADORES);
  if (hojaTrab.getLastRow() === 0) {
    hojaTrab.appendRow(['Nombre', 'Tipo (Trabajador / Contratista / Empresa)', 'Correo', 'Teléfono']);
    hojaTrab.appendRow(['Juan Pérez', 'Trabajador', 'juan.perez@empresa.com', '+5215550001111']);
    hojaTrab.appendRow(['Constructora del Norte', 'Contratista', 'contacto@constructora.com', '+5215550002222']);
  }

  // Configuracion
  const hojaCfg = ss.getSheetByName(HOJAS.CONFIGURACION);
  if (hojaCfg.getLastRow() === 0) {
    hojaCfg.appendRow(['Clave', 'Valor']);
    hojaCfg.appendRow(['Correo Encargada', 'encargada@empresa.com']);
    hojaCfg.appendRow(['Correo Asistente', 'asistente@empresa.com']);
    hojaCfg.appendRow(['ID Carpeta Raíz Drive (Opcional)', '']);
  }
}

function configurarHojaMatriz(ss) {
  const hoja = ss.getSheetByName(HOJAS.MATRIZ);

  // Encabezados
  const encabezados = [
    'ID',
    'Fecha de Registro',
    'Servicio',
    'Categoría',
    'Empresa / Cliente',
    'Sucursal',
    'Ubicación',
    'Nombre Solicitante',
    'Teléfono',
    'Correo',
    'Supervisor Responsable',
    'Descripción del trabajo',
    'Estatus de Atención',
    'Fecha de Asignación',
    'Trabajador / Contratista / Empresa',
    'Estatus',
    'Motivo de Parada',
    'Evidencias (Fotos)',
    'Fecha Finalización',
    'Observaciones',
    'Link WhatsApp Supervisor',
    'Color / Estado visual'
  ];

  const fila1 = hoja.getRange(1, 1, 1, encabezados.length);
  fila1.setValues([encabezados]);
  fila1.setFontWeight('bold');
  fila1.setBackground('#1C3144');
  fila1.setFontColor('#FFFFFF');
  fila1.setHorizontalAlignment('center');

  hoja.setFrozenRows(1);

  // Configurar Validaciones en rango predeterminado
  aplicarValidacionesMatriz(ss);
}

function aplicarValidacionesMatriz(ss) {
  const hojaMatriz = ss.getSheetByName(HOJAS.MATRIZ);
  const maxFilas = Math.max(hojaMatriz.getMaxRows(), 100);

  // Categorías
  const ruleCat = SpreadsheetApp.newDataValidation()
    .requireValueInList(CATEGORIAS_OPCIONES, true)
    .setAllowInvalid(false)
    .build();
  hojaMatriz.getRange(2, COLUMNAS_MATRIZ.CATEGORIA, maxFilas - 1, 1).setDataValidation(ruleCat);

  // Estatus de Atención
  const ruleAtencion = SpreadsheetApp.newDataValidation()
    .requireValueInList(ESTATUS_ATENCION_OPCIONES, true)
    .setAllowInvalid(false)
    .build();
  hojaMatriz.getRange(2, COLUMNAS_MATRIZ.ESTATUS_ATENCION, maxFilas - 1, 1).setDataValidation(ruleAtencion);

  // Estatus de Trabajo
  const ruleEstatus = SpreadsheetApp.newDataValidation()
    .requireValueInList(ESTATUS_OPCIONES, true)
    .setAllowInvalid(false)
    .build();
  hojaMatriz.getRange(2, COLUMNAS_MATRIZ.ESTATUS, maxFilas - 1, 1).setDataValidation(ruleEstatus);

  // Servicios (Lista desde Hoja 'Servicios')
  const hojaServ = ss.getSheetByName(HOJAS.SERVICIOS);
  if (hojaServ && hojaServ.getLastRow() > 1) {
    const ruleServ = SpreadsheetApp.newDataValidation()
      .requireValueInRange(hojaServ.getRange(2, 1, hojaServ.getLastRow() - 1, 1), true)
      .build();
    hojaMatriz.getRange(2, COLUMNAS_MATRIZ.SERVICIO, maxFilas - 1, 1).setDataValidation(ruleServ);
  }

  // Empresas (Lista desde Hoja 'Empresas')
  const hojaEmp = ss.getSheetByName(HOJAS.EMPRESAS);
  if (hojaEmp && hojaEmp.getLastRow() > 1) {
    const ruleEmp = SpreadsheetApp.newDataValidation()
      .requireValueInRange(hojaEmp.getRange(2, 1, hojaEmp.getLastRow() - 1, 1), true)
      .build();
    hojaMatriz.getRange(2, COLUMNAS_MATRIZ.EMPRESA, maxFilas - 1, 1).setDataValidation(ruleEmp);
  }

  // Supervisores (Lista desde Hoja 'Supervisores')
  const hojaSup = ss.getSheetByName(HOJAS.SUPERVISORES);
  if (hojaSup && hojaSup.getLastRow() > 1) {
    const ruleSup = SpreadsheetApp.newDataValidation()
      .requireValueInRange(hojaSup.getRange(2, 1, hojaSup.getLastRow() - 1, 1), true)
      .build();
    hojaMatriz.getRange(2, COLUMNAS_MATRIZ.SUPERVISOR, maxFilas - 1, 1).setDataValidation(ruleSup);
  }

  // Trabajadores (Lista desde Hoja 'Trabajadores')
  const hojaTrab = ss.getSheetByName(HOJAS.TRABAJADORES);
  if (hojaTrab && hojaTrab.getLastRow() > 1) {
    const ruleTrab = SpreadsheetApp.newDataValidation()
      .requireValueInRange(hojaTrab.getRange(2, 1, hojaTrab.getLastRow() - 1, 1), true)
      .build();
    hojaMatriz.getRange(2, COLUMNAS_MATRIZ.TRABAJADOR, maxFilas - 1, 1).setDataValidation(ruleTrab);
  }
}

// ==========================================
// DISPARADOR ONEDIT (FUNCIONA NATIVAMENTE EN MÓVIL/CELULAR)
// ==========================================
function onEdit(e) {
  if (!e || !e.range) return;

  const range = e.range;
  const hoja = range.getSheet();
  const nombreHoja = hoja.getName();

  if (nombreHoja !== HOJAS.MATRIZ) return;

  const fila = range.getRow();
  const columna = range.getColumn();

  if (fila <= 1) return; // Ignorar encabezados

  const ss = e.source || SpreadsheetApp.getActiveSpreadsheet();

  // Asegurar ID y Fecha de Registro si se escribe cualquier dato en la fila
  asegurarIdYFechaRegistro(hoja, fila);

  // Lógica según la columna editada (compatible totalmente con el celular)
  if (columna === COLUMNAS_MATRIZ.EMPRESA) {
    alCambiarEmpresa(ss, hoja, fila, range.getValue());
  } else if (columna === COLUMNAS_MATRIZ.SUCURSAL) {
    alCambiarSucursal(ss, hoja, fila, range.getValue());
  } else if (columna === COLUMNAS_MATRIZ.SUPERVISOR || columna === COLUMNAS_MATRIZ.DESCRIPCION || columna === COLUMNAS_MATRIZ.SERVICIO) {
    actualizarLinkWhatsAppCelular(ss, hoja, fila);
  } else if (columna === COLUMNAS_MATRIZ.ESTATUS) {
    alCambiarEstatus(ss, hoja, fila, range.getValue());
  }

  // Auto-crear carpeta de Drive si se asigna o si se escribe "CREAR" en evidencias en celular
  const valEvidencias = String(hoja.getRange(fila, COLUMNAS_MATRIZ.EVIDENCIAS).getValue()).trim().toUpperCase();
  if (valEvidencias === 'CREAR' || valEvidencias === 'NUEVA') {
    crearCarpetaEvidenciasPorFila(ss, hoja, fila);
  }
}

// ==========================================
// GENERACIÓN DE ID Y FECHA AUTOMÁTICA
// ==========================================
function generarIdTicket(numero) {
  const numPadded = String(numero).padStart(3, '0');
  return `TICKET-${numPadded}`;
}

function obtenerMaximoIdTicket(hoja) {
  const ultimaFila = hoja.getLastRow();
  if (ultimaFila <= 1) return 0;

  const ids = hoja.getRange(2, COLUMNAS_MATRIZ.ID, ultimaFila - 1, 1).getValues();
  let max = 0;

  ids.forEach(row => {
    const val = String(row[0] || '');
    const match = val.match(/TICKET-(\d+)/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > max) max = num;
    }
  });

  return max;
}

function asegurarIdYFechaRegistro(hoja, fila) {
  const celdaId = hoja.getRange(fila, COLUMNAS_MATRIZ.ID);
  const celdaFecha = hoja.getRange(fila, COLUMNAS_MATRIZ.FECHA_REGISTRO);

  if (!celdaId.getValue()) {
    const maxId = obtenerMaximoIdTicket(hoja);
    celdaId.setValue(generarIdTicket(maxId + 1));
  }

  if (!celdaFecha.getValue()) {
    celdaFecha.setValue(new Date());
  }
}

// ==========================================
// MANTENIMIENTO DINÁMICO: EMPRESA -> SUCURSAL -> UBICACIÓN
// ==========================================
function alCambiarEmpresa(ss, hojaMatriz, fila, empresaSeleccionada) {
  const celdaSucursal = hojaMatriz.getRange(fila, COLUMNAS_MATRIZ.SUCURSAL);
  const celdaUbicacion = hojaMatriz.getRange(fila, COLUMNAS_MATRIZ.UBICACION);

  celdaSucursal.clearDataValidations();
  celdaSucursal.setValue('');
  celdaUbicacion.setValue('');

  if (!empresaSeleccionada) return;

  const sucursales = obtenerSucursalesPorEmpresa(ss, empresaSeleccionada);
  if (sucursales.length > 0) {
    const rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(sucursales, true)
      .setAllowInvalid(false)
      .build();
    celdaSucursal.setDataValidation(rule);
  }
}

function obtenerSucursalesPorEmpresa(ss, empresa) {
  const hojaSuc = ss.getSheetByName(HOJAS.SUCURSALES);
  if (!hojaSuc || hojaSuc.getLastRow() <= 1) return [];

  const datos = hojaSuc.getRange(2, 1, hojaSuc.getLastRow() - 1, 3).getValues();
  const sucursales = [];

  datos.forEach(row => {
    if (String(row[0]).trim().toLowerCase() === String(empresa).trim().toLowerCase()) {
      if (row[1]) sucursales.push(String(row[1]).trim());
    }
  });

  return Array.from(new Set(sucursales));
}

function alCambiarSucursal(ss, hojaMatriz, fila, sucursalSeleccionada) {
  const celdaUbicacion = hojaMatriz.getRange(fila, COLUMNAS_MATRIZ.UBICACION);
  const empresa = hojaMatriz.getRange(fila, COLUMNAS_MATRIZ.EMPRESA).getValue();

  if (!sucursalSeleccionada || !empresa) {
    celdaUbicacion.setValue('');
    return;
  }

  const ubicacion = obtenerUbicacionPorEmpresaYSucursal(ss, empresa, sucursalSeleccionada);
  celdaUbicacion.setValue(ubicacion);
}

function obtenerUbicacionPorEmpresaYSucursal(ss, empresa, sucursal) {
  const hojaSuc = ss.getSheetByName(HOJAS.SUCURSALES);
  if (!hojaSuc || hojaSuc.getLastRow() <= 1) return '';

  const datos = hojaSuc.getRange(2, 1, hojaSuc.getLastRow() - 1, 3).getValues();

  for (let i = 0; i < datos.length; i++) {
    const emp = String(datos[i][0]).trim().toLowerCase();
    const suc = String(datos[i][1]).trim().toLowerCase();

    if (emp === String(empresa).trim().toLowerCase() && suc === String(sucursal).trim().toLowerCase()) {
      return datos[i][2] || '';
    }
  }

  return '';
}

// ==========================================
// CAMBIO DE ESTATUS Y COLOREADO
// ==========================================
function alCambiarEstatus(ss, hojaMatriz, fila, nuevoEstatus) {
  aplicarColorPorEstatus(hojaMatriz, fila, nuevoEstatus);

  // Asignar fecha de finalización automática si es 'Finalizado' o 'Pagado y Cerrado'
  if (nuevoEstatus === 'Finalizado' || nuevoEstatus === 'Pagado y Cerrado') {
    const celdaFechaFin = hojaMatriz.getRange(fila, COLUMNAS_MATRIZ.FECHA_FINALIZACION);
    if (!celdaFechaFin.getValue()) {
      celdaFechaFin.setValue(new Date());
    }
  }

  // Notificaciones por correo
  procesarNotificacionEstatus(ss, hojaMatriz, fila, nuevoEstatus);
}

function aplicarColorPorEstatus(hoja, fila, estatus) {
  const rangoFila = hoja.getRange(fila, 1, 1, COLUMNAS_MATRIZ.COLOR_ESTADO);

  switch (estatus) {
    case 'Pagado y Cerrado':
      rangoFila.setBackground('#D4EDDA'); // Verde claro
      break;
    case 'Finalizado':
      rangoFila.setBackground('#CCE5FF'); // Azul claro
      break;
    case 'En proceso':
      rangoFila.setBackground('#FFF3CD'); // Amarillo claro
      break;
    case 'Parado por materiales':
    case 'Parado por cliente':
    case 'Parado por otra razón':
      rangoFila.setBackground('#F8D7DA'); // Rojo/Rosa claro
      break;
    case 'Asignada a Supervisor':
    case 'Asignada a Trabajador/Contratista':
      rangoFila.setBackground('#E2E3E5'); // Gris claro
      break;
    default:
      rangoFila.setBackground(null); // Fondo predeterminado
      break;
  }
}

// ==========================================
// ENLACE DE WHATSAPP DIRECTO EN CELULAR
// ==========================================
function actualizarLinkWhatsAppCelular(ss, hoja, fila) {
  const ticket = obtenerDatosTicketFila(hoja, fila);
  const celdaLink = hoja.getRange(fila, COLUMNAS_MATRIZ.LINK_WHATSAPP);

  if (!ticket.supervisor) {
    celdaLink.setValue('');
    return;
  }

  const supervisorObj = obtenerContactoSupervisor(ss, ticket.supervisor);
  if (!supervisorObj || !supervisorObj.telefono) {
    celdaLink.setValue('Sin teléfono');
    return;
  }

  const mensaje = `Hola ${supervisorObj.nombre}, se te ha asignado el ticket *${ticket.id}*.\n` +
    `• *Servicio:* ${ticket.servicio || 'N/A'}\n` +
    `• *Cliente:* ${ticket.empresa || 'N/A'} - ${ticket.sucursal || 'N/A'}\n` +
    `• *Ubicación:* ${ticket.ubicacion || 'N/A'}\n` +
    `• *Prioridad:* ${ticket.estatusAtencion || 'Normal'}\n` +
    `• *Descripción:* ${ticket.descripcion || 'Sin descripción'}\n\n` +
    `Por favor revisa y asigna al trabajador/contratista correspondiente.`;

  const urlWa = construirLinkWhatsApp(supervisorObj.telefono, mensaje);
  celdaLink.setValue(urlWa);
}

// ==========================================
// BÚSQUEDA DE CONTACTOS Y CONFIGURACIÓN
// ==========================================
function obtenerConfiguracion(ss) {
  const config = {
    correoEncargada: '',
    correoAsistente: '',
    idCarpetaDrive: ''
  };

  const hojaCfg = ss.getSheetByName(HOJAS.CONFIGURACION);
  if (!hojaCfg || hojaCfg.getLastRow() <= 1) return config;

  const datos = hojaCfg.getRange(2, 1, hojaCfg.getLastRow() - 1, 2).getValues();
  datos.forEach(row => {
    const clave = String(row[0]).trim().toLowerCase();
    const valor = String(row[1]).trim();

    if (clave.includes('encargada')) config.correoEncargada = valor;
    if (clave.includes('asistente')) config.correoAsistente = valor;
    if (clave.includes('carpeta')) config.idCarpetaDrive = valor;
  });

  return config;
}

function obtenerContactoSupervisor(ss, nombreSupervisor) {
  if (!nombreSupervisor) return null;
  const hojaSup = ss.getSheetByName(HOJAS.SUPERVISORES);
  if (!hojaSup || hojaSup.getLastRow() <= 1) return null;

  const datos = hojaSup.getRange(2, 1, hojaSup.getLastRow() - 1, 3).getValues();
  for (let i = 0; i < datos.length; i++) {
    if (String(datos[i][0]).trim().toLowerCase() === String(nombreSupervisor).trim().toLowerCase()) {
      return {
        nombre: datos[i][0],
        correo: datos[i][1],
        telefono: datos[i][2]
      };
    }
  }
  return null;
}

function obtenerContactoTrabajador(ss, nombreTrabajador) {
  if (!nombreTrabajador) return null;
  const hojaTrab = ss.getSheetByName(HOJAS.TRABAJADORES);
  if (!hojaTrab || hojaTrab.getLastRow() <= 1) return null;

  const datos = hojaTrab.getRange(2, 1, hojaTrab.getLastRow() - 1, 4).getValues();
  for (let i = 0; i < datos.length; i++) {
    if (String(datos[i][0]).trim().toLowerCase() === String(nombreTrabajador).trim().toLowerCase()) {
      return {
        nombre: datos[i][0],
        tipo: datos[i][1],
        correo: datos[i][2],
        telefono: datos[i][3]
      };
    }
  }
  return null;
}

function obtenerDatosTicketFila(hoja, fila) {
  const valores = hoja.getRange(fila, 1, 1, COLUMNAS_MATRIZ.COLOR_ESTADO).getValues()[0];
  return {
    id: valores[COLUMNAS_MATRIZ.ID - 1],
    fechaRegistro: valores[COLUMNAS_MATRIZ.FECHA_REGISTRO - 1],
    servicio: valores[COLUMNAS_MATRIZ.SERVICIO - 1],
    categoria: valores[COLUMNAS_MATRIZ.CATEGORIA - 1],
    empresa: valores[COLUMNAS_MATRIZ.EMPRESA - 1],
    sucursal: valores[COLUMNAS_MATRIZ.SUCURSAL - 1],
    ubicacion: valores[COLUMNAS_MATRIZ.UBICACION - 1],
    nombreSolicitante: valores[COLUMNAS_MATRIZ.NOMBRE_SOLICITANTE - 1],
    telefonoSolicitante: valores[COLUMNAS_MATRIZ.TELEFONO_SOLICITANTE - 1],
    correoSolicitante: valores[COLUMNAS_MATRIZ.CORREO_SOLICITANTE - 1],
    supervisor: valores[COLUMNAS_MATRIZ.SUPERVISOR - 1],
    descripcion: valores[COLUMNAS_MATRIZ.DESCRIPCION - 1],
    estatusAtencion: valores[COLUMNAS_MATRIZ.ESTATUS_ATENCION - 1],
    fechaAsignacion: valores[COLUMNAS_MATRIZ.FECHA_ASIGNACION - 1],
    trabajador: valores[COLUMNAS_MATRIZ.TRABAJADOR - 1],
    estatus: valores[COLUMNAS_MATRIZ.ESTATUS - 1],
    motivoParada: valores[COLUMNAS_MATRIZ.MOTIVO_PARADA - 1],
    evidencias: valores[COLUMNAS_MATRIZ.EVIDENCIAS - 1],
    fechaFinalizacion: valores[COLUMNAS_MATRIZ.FECHA_FINALIZACION - 1],
    observaciones: valores[COLUMNAS_MATRIZ.OBSERVACIONES - 1],
    linkWhatsapp: valores[COLUMNAS_MATRIZ.LINK_WHATSAPP - 1]
  };
}

// ==========================================
// NOTIFICACIONES POR CORREO ELECTRÓNICO
// ==========================================
function procesarNotificacionEstatus(ss, hoja, fila, estatus) {
  const ticket = obtenerDatosTicketFila(hoja, fila);
  const config = obtenerConfiguracion(ss);
  const supervisorObj = obtenerContactoSupervisor(ss, ticket.supervisor);
  const trabajadorObj = obtenerContactoTrabajador(ss, ticket.trabajador);

  if (estatus === 'Asignada a Supervisor') {
    if (supervisorObj && supervisorObj.correo) {
      const asunto = `[${ticket.id}] Nueva asignación de Supervisor: ${ticket.servicio}`;
      const cuerpo = `Hola ${supervisorObj.nombre},\n\n` +
        `Se te ha asignado un nuevo ticket de trabajo:\n\n` +
        `• Ticket ID: ${ticket.id}\n` +
        `• Servicio: ${ticket.servicio}\n` +
        `• Categoría: ${ticket.categoria}\n` +
        `• Empresa / Cliente: ${ticket.empresa}\n` +
        `• Sucursal: ${ticket.sucursal}\n` +
        `• Ubicación: ${ticket.ubicacion}\n` +
        `• Prioridad: ${ticket.estatusAtencion}\n` +
        `• Descripción: ${ticket.descripcion}\n\n` +
        `Por favor revisa la matriz para asignar al trabajador o contratista responsable.`;

      enviarCorreoSeguro(supervisorObj.correo, asunto, cuerpo);
    }
  } else if (estatus === 'Asignada a Trabajador/Contratista') {
    if (trabajadorObj && trabajadorObj.correo) {
      const asunto = `[${ticket.id}] Trabajo Asignado: ${ticket.servicio}`;
      const cuerpo = `Hola ${trabajadorObj.nombre},\n\n` +
        `Se te ha asignado el siguiente trabajo:\n\n` +
        `• Ticket ID: ${ticket.id}\n` +
        `• Servicio: ${ticket.servicio}\n` +
        `• Cliente: ${ticket.empresa} (${ticket.sucursal})\n` +
        `• Ubicación: ${ticket.ubicacion}\n` +
        `• Prioridad: ${ticket.estatusAtencion}\n` +
        `• Descripción: ${ticket.descripcion}\n\n` +
        `Supervisor responsable: ${ticket.supervisor}\n\n` +
        `Por favor comunícate con el supervisor ante cualquier duda.`;

      enviarCorreoSeguro(trabajadorObj.correo, asunto, cuerpo);
    }
  } else if (estatus.startsWith('Parado')) {
    // Parado por materiales, cliente u otra razón
    const destinatarios = [];
    if (config.correoEncargada) destinatarios.push(config.correoEncargada);
    if (config.correoAsistente) destinatarios.push(config.correoAsistente);
    if (supervisorObj && supervisorObj.correo) destinatarios.push(supervisorObj.correo);

    const destinatariosUnicos = Array.from(new Set(destinatarios)).join(',');

    if (destinatariosUnicos) {
      const asunto = `⚠️ [${ticket.id}] TRABAJO DETENIDO - ${estatus}`;
      const cuerpo = `ATENCIÓN:\n\n` +
        `El ticket ${ticket.id} ha cambiado su estatus a: ${estatus}.\n\n` +
        `• Cliente: ${ticket.empresa} - ${ticket.sucursal}\n` +
        `• Servicio: ${ticket.servicio}\n` +
        `• Supervisor: ${ticket.supervisor}\n` +
        `• Trabajador / Contratista: ${ticket.trabajador}\n` +
        `• Motivo / Detalle: ${ticket.motivoParada || 'Sin motivo especificado'}\n\n` +
        `Por favor tomar las acciones correspondientes para destrabar la situación.`;

      enviarCorreoSeguro(destinatariosUnicos, asunto, cuerpo);
    }
  } else if (estatus === 'Finalizado') {
    // Notificar a todos los involucrados EXCEPTUANDO trabajadores/contratistas
    const destinatarios = [];
    if (config.correoEncargada) destinatarios.push(config.correoEncargada);
    if (config.correoAsistente) destinatarios.push(config.correoAsistente);
    if (supervisorObj && supervisorObj.correo) destinatarios.push(supervisorObj.correo);
    if (ticket.correoSolicitante) destinatarios.push(ticket.correoSolicitante);

    const destinatariosUnicos = Array.from(new Set(destinatarios)).join(',');

    if (destinatariosUnicos) {
      const asunto = `✅ [${ticket.id}] TRABAJO FINALIZADO - Emitir Cotización / Factura`;
      const cuerpo = `Estimados,\n\n` +
        `El trabajo correspondiente al ticket ${ticket.id} ha sido completado y puesto en estatus FINALIZADO.\n\n` +
        `• Cliente: ${ticket.empresa} (${ticket.sucursal})\n` +
        `• Servicio: ${ticket.servicio}\n` +
        `• Supervisor: ${ticket.supervisor}\n` +
        `• Evidencias: ${ticket.evidencias || 'Sin carpeta enlazada'}\n\n` +
        `Se procede a emitir la cotización / factura correspondiente para su cobro.`;

      enviarCorreoSeguro(destinatariosUnicos, asunto, cuerpo);
    }
  }
}

function enviarCorreoSeguro(destinatario, asunto, cuerpo) {
  try {
    MailApp.sendEmail(destinatario, asunto, cuerpo);
  } catch (err) {
    Logger.log(`Error enviando correo a ${destinatario}: ${err.message}`);
  }
}

// ==========================================
// FUNCIÓN WHATSAPP SUPERVISOR
// ==========================================
function construirLinkWhatsApp(telefono, mensaje) {
  if (!telefono) return null;
  let numLimpio = String(telefono).replace(/[^\d]/g, '');
  const textoEnc = encodeURIComponent(mensaje);
  return `https://wa.me/${numLimpio}?text=${textoEnc}`;
}

function enviarWhatsAppSupervisorSeleccionado() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hoja = ss.getActiveSheet();

  if (hoja.getName() !== HOJAS.MATRIZ) {
    SpreadsheetApp.getUi().alert('⚠️ Por favor selecciona una celda dentro de la hoja "Matriz".');
    return;
  }

  const fila = hoja.getActiveCell().getRow();
  if (fila <= 1) {
    SpreadsheetApp.getUi().alert('⚠️ Por favor selecciona una fila de ticket válida.');
    return;
  }

  actualizarLinkWhatsAppCelular(ss, hoja, fila);
  const ticket = obtenerDatosTicketFila(hoja, fila);

  if (ticket.linkWhatsapp && ticket.linkWhatsapp.startsWith('https://wa.me')) {
    const htmlOutput = HtmlService.createHtmlOutput(
      `<p>Haz clic en el siguiente enlace para abrir WhatsApp:</p>` +
      `<p><a href="${ticket.linkWhatsapp}" target="_blank" style="padding:10px 15px; background-color:#25D366; color:white; text-decoration:none; border-radius:5px; font-weight:bold; display:inline-block;">📱 Abrir WhatsApp</a></p>`
    ).setWidth(400).setHeight(150);

    SpreadsheetApp.getUi().showModalDialog(htmlOutput, `Enviar WhatsApp a Supervisor`);
  } else {
    SpreadsheetApp.getUi().alert('⚠️ No se pudo generar el enlace de WhatsApp. Verifica que el supervisor tenga teléfono.');
  }
}

// ==========================================
// CARPETA DE EVIDENCIAS EN GOOGLE DRIVE
// ==========================================
function crearCarpetaEvidenciasPorFila(ss, hoja, fila) {
  const ticket = obtenerDatosTicketFila(hoja, fila);
  if (!ticket.id) return null;

  const celdaEvidencias = hoja.getRange(fila, COLUMNAS_MATRIZ.EVIDENCIAS);
  const valorActual = String(celdaEvidencias.getValue()).trim();

  if (valorActual.startsWith('http')) {
    return valorActual; // Ya tiene carpeta creada
  }

  try {
    const config = obtenerConfiguracion(ss);
    let carpetaPadre;

    if (config.idCarpetaDrive) {
      carpetaPadre = DriveApp.getFolderById(config.idCarpetaDrive);
    } else {
      carpetaPadre = DriveApp.getRootFolder();
    }

    const nombreCarpeta = `${ticket.id} - ${ticket.empresa || 'Cliente'} - ${ticket.servicio || 'Evidencias'}`;
    const nuevaCarpeta = carpetaPadre.createFolder(nombreCarpeta);
    const urlCarpeta = nuevaCarpeta.getUrl();

    celdaEvidencias.setValue(urlCarpeta);
    return urlCarpeta;
  } catch (err) {
    Logger.log(`Error al crear carpeta en Drive: ${err.message}`);
    return null;
  }
}

function crearCarpetaEvidenciasSeleccionada() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hoja = ss.getActiveSheet();

  if (hoja.getName() !== HOJAS.MATRIZ) {
    SpreadsheetApp.getUi().alert('⚠️ Por favor selecciona una celda dentro de la hoja "Matriz".');
    return;
  }

  const fila = hoja.getActiveCell().getRow();
  if (fila <= 1) {
    SpreadsheetApp.getUi().alert('⚠️ Por favor selecciona una fila de ticket válida.');
    return;
  }

  const url = crearCarpetaEvidenciasPorFila(ss, hoja, fila);
  if (url) {
    SpreadsheetApp.getUi().alert(`✅ Carpeta creada o verificada exitosamente:\n${url}`);
  } else {
    SpreadsheetApp.getUi().alert(`❌ No se pudo crear la carpeta en Google Drive.`);
  }
}
