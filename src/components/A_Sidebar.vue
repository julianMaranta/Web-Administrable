<template>
    <div class="sidebar">
      
      <div class="sidebar-buttons">
        <button @click="goToInicio" class="inicio-button"></button>
        <button @click="goToCrear" class="crear-button"></button>
        <button @click="goToEditar" class="editar-button"></button>  
        <button @click="goToEliminar" class="eliminar-button"></button> 
        <button @click="goToImagenes" class="imagenes-button"></button>
        <button @click="goToVideos" class="videos-button"></button> 
        <button @click="goToExcel" class="excel-button"></button> 
        <button @click="goToArgenprop" class="argenprop-button"></button> 
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  const goToInicio = () => {
    router.push('/plataforma-administrador');
  };

  const goToCrear = () => {
    router.push('/plataforma-administrador-crear');
  };


  const goToEditar = () => {
    router.push('/plataforma-administrador-editar');
  };

  const goToEliminar = () => {
    router.push('/plataforma-administrador-eliminar');
  };

  const goToImagenes = () => {
    router.push('https://www.dropbox.com/home');
  };

  const goToVideos = () => {
    router.push('https://www.youtube.com/');
  };

  const goToExcel = () => {
    router.push('/descargar-informe');
  };

  const goToArgenprop = () => {
    router.push('https://www.argenprop.com/');
  };
  </script>
  
  <style scoped>
  .sidebar {
    background-image: url('@/assets/fondo-menu.png');
  padding: 20px;
  width: 220px;
  height: 100vh;
  position: fixed;
}

.logo-sidebar {
  display: block;
  margin: 0 auto 20px;
  width: 100px;
  height: auto;
}

.sidebar-buttons {
  margin-top: 60px;
}

.sidebar button {
  display: block;
  background-color: white;
  color: #000000;
  border: 1px solid #000000;
  padding: 15px;
  margin: 10px 0;
  text-align: center;
  font-size: 18px;
  width: 100%;
  cursor: pointer;
  border-radius: 50px;
  transition: transform 0.3s;
}

/* Estilos para el botón de "Inicio" */
.inicio-button {
  background-image: url('@/assets/boton-inicio.png');
  background-size: cover;
  background-position: center;
  color: white;
  height: 60px;
}

.crear-button {
  background-image: url('@/assets/boton-crear.png');
  background-size: cover;
  background-position: center;
  color: white;
  height: 60px;
}

.editar-button {
  background-image: url('@/assets/boton-editar.png');
  background-size: cover;
  background-position: center;
  color: white;
  height: 60px;
}

.eliminar-button {
  background-image: url('@/assets/boton-eliminar.png');
  background-size: cover;
  background-position: center;
  color: white;
  height: 60px;
}

.imagenes-button {
  background-image: url('@/assets/boton-imagenes.png');
  background-size: cover;
  background-position: center;
  color: white;
  height: 60px;
}

.videos-button {
  background-image: url('@/assets/boton-videos.png');
  background-size: cover;
  background-position: center;
  color: white;
  height: 60px;
}

.excel-button {
  background-image: url('@/assets/boton-excel.png');
  background-size: cover;
  background-position: center;
  color: white;
  height: 60px;
}

.argenprop-button {
  background-image: url('@/assets/boton-argenprop.png');
  background-size: cover;
  background-position: center;
  color: white;
  height: 60px;
}

.sidebar button:hover {
  background-color: #e97b0d;
  color: white;
  transform: scale(1.1);
}

/* Media query para notebooks estándar (ej: 1024px - 1366px) */
@media screen and (min-width: 1024px) and (max-width: 1366px) {
  .logo-sidebar {
  display: block;
  margin: 0 auto 20px;
  width: 70px;
  height: auto;
  margin-top: 5px;
}

.sidebar-buttons {
  margin-top: 60px;
}
 
}
  </style>
  