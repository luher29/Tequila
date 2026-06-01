/**
 * Limpia todas las colecciones de la base de datos.
 * Deja solo el usuario admin para poder iniciar sesión.
 * Ejecutar con: node src/clean.js
 */
import mongoose from 'mongoose';
import 'dotenv/config';
import Product from './models/products.js';
import Distributor from './models/distributors.js';
import Note from './models/notes.js';
import Entrada from './models/mermas.js';

await mongoose.connect(process.env.MONGODB_URI);
console.log("✅ Conectado a tequila_bd");

try {
  await Product.deleteMany({});
  await Note.deleteMany({});
  await Entrada.deleteMany({});
  await Distributor.deleteMany({});

  // Crear solo el admin para poder entrar al sistema
  await Distributor.create({
    name: "Administrador",
    user: "admin",
    password: "admin123",
    role: "admin",
    telephone: "",
    active: true
  });

  console.log("\n========================================");
  console.log("   BASE DE DATOS LIMPIA");
  console.log("========================================");
  console.log("   ✅ Productos: 0");
  console.log("   ✅ Notas: 0");
  console.log("   ✅ Entradas: 0");
  console.log("   ✅ Distribuidores: 1 (solo admin)");
  console.log("\n   🔐 admin / admin123");
  console.log("========================================\n");

} catch (error) {
  console.error("❌ Error:", error.message);
} finally {
  await mongoose.disconnect();
  console.log("🔌 Desconectado");
}
