/**
 * Script para poblar la base de datos con datos iniciales.
 * Ejecutar UNA SOLA VEZ con: node src/seed.js
 */
import mongoose from 'mongoose';
import Product from './models/products.js';
import Distributor from './models/distributors.js';

// Conectar a la BD
await mongoose.connect("mongodb+srv://lupita29:luher29@lupita.vup0axr.mongodb.net/tequila_bd?retryWrites=true&w=majority&appName=Lupita");
console.log("✅ Conectado a tequila_bd");

// ====== ADMIN Y DISTRIBUIDORES ======
const distributorsData = [
  {
    name: "Administrador",
    user: "admin",
    password: "admin123",
    role: "admin",
    telephone: "3331234567",
    active: true
  },
  {
    name: "Raybel Cruz",
    user: "raybel",
    password: "raybel123",
    role: "repartidor",
    telephone: "3339876543",
    active: true
  },
  {
    name: "José Francisco",
    user: "jose",
    password: "jose123",
    role: "repartidor",
    telephone: "3335551234",
    active: true
  }
];

// ====== PRODUCTOS DE TEQUILA ======
const productsData = [
  {
    codeBar: "TEQ-BL-001",
    name: "Tequila Blanco Tradicional",
    brand: "Herencia Ágave",
    price: 350,
    piecesPerBox: 12,
    stock: 120
  },
  {
    codeBar: "TEQ-RE-001",
    name: "Tequila Reposado Premium",
    brand: "Herencia Ágave",
    price: 520,
    piecesPerBox: 12,
    stock: 80
  },
  {
    codeBar: "TEQ-AN-001",
    name: "Tequila Añejo Reserva",
    brand: "Herencia Ágave",
    price: 750,
    piecesPerBox: 6,
    stock: 45
  },
  {
    codeBar: "TEQ-EX-001",
    name: "Tequila Extra Añejo",
    brand: "Herencia Ágave",
    price: 1200,
    piecesPerBox: 6,
    stock: 24
  },
  {
    codeBar: "TEQ-CR-001",
    name: "Tequila Cristalino",
    brand: "Ámbar de Jalisco",
    price: 680,
    piecesPerBox: 12,
    stock: 60
  },
  {
    codeBar: "TEQ-BL-002",
    name: "Tequila Blanco Plata",
    brand: "Ámbar de Jalisco",
    price: 280,
    piecesPerBox: 24,
    stock: 200
  }
];

try {
  // Limpiar colecciones existentes
  await Product.deleteMany({});
  await Distributor.deleteMany({});
  console.log("🧹 Colecciones limpiadas");

  // Insertar distribuidores
  const insertedDists = await Distributor.insertMany(distributorsData);
  console.log(`👥 ${insertedDists.length} distribuidores creados`);

  // Insertar productos
  const insertedProds = await Product.insertMany(productsData);
  console.log(`📦 ${insertedProds.length} productos creados`);

  console.log("\n========================================");
  console.log("   DATOS INICIALES CREADOS CON ÉXITO");
  console.log("========================================");
  console.log("\n🔐 Credenciales del Administrador:");
  console.log("   Usuario:    admin");
  console.log("   Contraseña: admin123");
  console.log("\n🔐 Credenciales de Distribuidores:");
  console.log("   raybel / raybel123");
  console.log("   jose   / jose123");
  console.log("\n📦 Productos creados: " + insertedProds.length);
  console.log("========================================\n");

} catch (error) {
  console.error("❌ Error al sembrar datos:", error.message);
} finally {
  await mongoose.disconnect();
  console.log("🔌 Desconectado de MongoDB");
}
