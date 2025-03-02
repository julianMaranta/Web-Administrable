<script setup lang="ts"> 
import '@/assets/main.css';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
</script>

<template>
  <div class="page-container">
    <Header />

    <!-- Barra de búsqueda pegada al header -->
    <section class="search-section">
      <h2>Busca tu propiedad:</h2>
      <div class="search-fields">
        <input type="text" placeholder="Operación:" />
        <input type="text" placeholder="Provincia:" />
        <input type="text" placeholder="Localidad:" />
        <input type="text" placeholder="Dirección:" />
        <input type="text" placeholder="Precio:" />
        <button class="search-button">BUSCAR</button>
      </div>
    </section>

    <!-- Sección de Propiedades ocupa todo el espacio disponible -->
    <main class="featured-properties">
      <h2>Propiedades Destacadas:</h2>
      <div class="property-grid">
        <div class="property-card" v-for="n in 4" :key="n">
          <p>Calle XX<br />XXXXXX</p>
          <img src="@/assets/Logo Maranta 3.png" alt="Casa destacada" />

        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
/* Estructura principal */
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Barra de búsqueda pegada al header */
.search-section {
  background-color: white;
  padding: 20px;
  border-bottom: 2px solid #ccc;
  text-align: center;
}

/* Contenedor de los inputs */
.search-fields {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

.search-fields input {
  padding: 8px;
  width: 200px;
  border: 2px solid black;
  border-radius: 5px;
}

.search-button {
  background-color: #0a0f64;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

/* Propiedades ocupan el resto del espacio disponible */
.featured-properties {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center; /* Centra verticalmente */
  align-items: center;
  text-align: center;
  padding: 20px;
}

/* Grid de tarjetas */
.property-grid {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
  width: 100%;
  flex-grow: 1;
}

.property-card {
  border: 2px solid black;
  padding: 10px;
  border-radius: 10px;
  text-align: center;
  width: 250px;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.property-card img {
  width: 100%;
  padding: 60px;
  height: auto;
  border-radius: 5px;
}

/* Resaltar una propiedad al pasar el mouse */
.property-card:hover {
  border: 2px solid blue;
}
</style>
