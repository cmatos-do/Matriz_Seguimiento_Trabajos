/**
 * SIMULACIÓN Y SUITE DE PRUEBAS PARA LÓGICA DE MATRIZ DE SEGUIMIENTO (MÓVIL / PC)
 */

const assert = require('assert');

// 1. Funciones puras de prueba para lógica de ID
function generarIdTicket(numero) {
  const numPadded = String(numero).padStart(3, '0');
  return `TICKET-${numPadded}`;
}

function obtenerMaximoIdTicket(idsArray) {
  let max = 0;
  idsArray.forEach(val => {
    const match = String(val || '').match(/TICKET-(\d+)/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > max) max = num;
    }
  });
  return max;
}

// 2. Funciones puras de prueba para Sucursales y Ubicación
function obtenerSucursalesPorEmpresa(sucursalesData, empresa) {
  const sucursales = [];
  sucursalesData.forEach(row => {
    if (String(row[0]).trim().toLowerCase() === String(empresa).trim().toLowerCase()) {
      if (row[1]) sucursales.push(String(row[1]).trim());
    }
  });
  return Array.from(new Set(sucursales));
}

function obtenerUbicacionPorEmpresaYSucursal(sucursalesData, empresa, sucursal) {
  for (let i = 0; i < sucursalesData.length; i++) {
    const emp = String(sucursalesData[i][0]).trim().toLowerCase();
    const suc = String(sucursalesData[i][1]).trim().toLowerCase();

    if (emp === String(empresa).trim().toLowerCase() && suc === String(sucursal).trim().toLowerCase()) {
      return sucursalesData[i][2] || '';
    }
  }
  return '';
}

// 3. Funciones puras de prueba para WhatsApp y Notificaciones
function construirLinkWhatsApp(telefono, mensaje) {
  if (!telefono) return null;
  let numLimpio = String(telefono).replace(/[^\d]/g, '');
  const textoEnc = encodeURIComponent(mensaje);
  return `https://wa.me/${numLimpio}?text=${textoEnc}`;
}

function determinarDestinatariosCorreo(estatus, config, supervisor, trabajador, solicitanteCorreo) {
  if (estatus === 'Asignada a Supervisor') {
    return supervisor ? [supervisor.correo] : [];
  } else if (estatus === 'Asignada a Trabajador/Contratista') {
    return trabajador ? [trabajador.correo] : [];
  } else if (estatus.startsWith('Parado')) {
    const dest = [];
    if (config.correoEncargada) dest.push(config.correoEncargada);
    if (config.correoAsistente) dest.push(config.correoAsistente);
    if (supervisor && supervisor.correo) dest.push(supervisor.correo);
    return Array.from(new Set(dest));
  } else if (estatus === 'Finalizado') {
    const dest = [];
    if (config.correoEncargada) dest.push(config.correoEncargada);
    if (config.correoAsistente) dest.push(config.correoAsistente);
    if (supervisor && supervisor.correo) dest.push(supervisor.correo);
    if (solicitanteCorreo) dest.push(solicitanteCorreo);
    return Array.from(new Set(dest));
  }
  return [];
}

// RUN TESTS
console.log('🧪 Ejecutando suite de pruebas unitarias para Matriz de Seguimiento (Móvil / PC)...');

// Test Generación ID
assert.strictEqual(generarIdTicket(1), 'TICKET-001');
assert.strictEqual(generarIdTicket(25), 'TICKET-025');
assert.strictEqual(obtenerMaximoIdTicket(['TICKET-001', 'TICKET-002', 'TICKET-015']), 15);
console.log('✅ Test ID Autoincrementable PASADO');

// Test Sucursales y Ubicación
const mockSucursales = [
  ['Empresa Alfa', 'Sucursal Centro', 'Av. Principal #123'],
  ['Empresa Alfa', 'Sucursal Norte', 'Calle Norte #456'],
  ['Empresa Beta', 'Sucursal Matriz', 'Plaza Comercial Lote 8']
];

const sucsAlfa = obtenerSucursalesPorEmpresa(mockSucursales, 'Empresa Alfa');
assert.deepStrictEqual(sucsAlfa, ['Sucursal Centro', 'Sucursal Norte']);

const ubiAlfaCentro = obtenerUbicacionPorEmpresaYSucursal(mockSucursales, 'Empresa Alfa', 'Sucursal Centro');
assert.strictEqual(ubiAlfaCentro, 'Av. Principal #123');
console.log('✅ Test Mantenimiento Empresa -> Sucursal -> Ubicación PASADO');

// Test Link WhatsApp
const linkWa = construirLinkWhatsApp('+52 1 555-123-4567', 'Hola Ticket TICKET-001');
assert.strictEqual(linkWa, 'https://wa.me/5215551234567?text=Hola%20Ticket%20TICKET-001');
console.log('✅ Test Enlace WhatsApp para Móvil PASADO');

// Test Destinatarios de Notificación
const mockConfig = { correoEncargada: 'encargada@test.com', correoAsistente: 'asistente@test.com' };
const mockSupervisor = { nombre: 'Carlos', correo: 'carlos@test.com' };
const mockTrabajador = { nombre: 'Juan', correo: 'juan@test.com' };

// Parado por materiales
const destParado = determinarDestinatariosCorreo('Parado por materiales', mockConfig, mockSupervisor, mockTrabajador, 'cliente@test.com');
assert.deepStrictEqual(destParado, ['encargada@test.com', 'asistente@test.com', 'carlos@test.com']);

// Finalizado (NO incluye trabajador)
const destFinalizado = determinarDestinatariosCorreo('Finalizado', mockConfig, mockSupervisor, mockTrabajador, 'cliente@test.com');
assert.deepStrictEqual(destFinalizado, ['encargada@test.com', 'asistente@test.com', 'carlos@test.com', 'cliente@test.com']);
assert.ok(!destFinalizado.includes('juan@test.com'));
console.log('✅ Test Destinatarios de Notificación por Correo PASADO');

console.log('🎉 TODAS LAS PRUEBAS UNITARIAS PASARON EXITOSAMENTE!');
