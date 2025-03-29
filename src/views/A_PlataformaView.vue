<template>
    <div class="container">
      <A_Sidebar/>
      <div class="content">
        <div class="logo-container">
          <img src="@/assets/Logo NUEVO Maranta-2.png" alt="Logo ENSEA" class="logo-plataforma"/>
        </div>
        <br>   
        <br>
        <div class="action-box">
          <div class="action-info">
            <h2>CREAR</h2>
            <p>Crea propiedades.</p>
          </div>
          <button @click="create" class="crear-button"></button>
        </div>
        <div class="action-box">
          <div class="action-info">
            <h2>EDITAR</h2>
            <p>Edita propiedades.</p>
          </div>
          <button @click="edit" class="editar-button"></button>
        </div>
        <div class="action-box">
          <div class="action-info">
            <h2>ELIMINAR</h2>
            <p>Elimina cursos, especializaciones, tutorias y usuarios.</p>
          </div>
          <button @click="remove" class="eliminar-button"></button>
        </div>
        <div class="action-box">
          <div class="action-info">
            <h2>GESTIONAR IMÁGENES</h2>
            <p>Gestiona imágenes.</p>
          </div>
          <button @click="goToDropbox" id="dropbox-button">
            <img src="@/assets/Boton Dropbox.png" alt="Botón Dropbox" />
          </button>
        </div>
        <div class="action-box">
          <div class="action-info">
            <h2>GESTIONAR VIDEOS</h2>
            <p>Gestiona videos.</p>
          </div>
          <button @click="goToYouTube" id="youtube-button">
            <img src="@/assets/Boton YouTube.png" alt="Botón YouTube" />
          </button>
        </div>
        <div class="action-box">
          <div class="action-info">
            <h2>GENERACIÓN DE INFORMES</h2>
            <p>Genera informes en formato Excel.</p>
          </div>
          <button @click="generateReport" id="excel-button">
            <img src="@/assets/Boton Excel.png" alt="Botón Excel" />
          </button>
        </div>
        <div class="action-box">
          <div class="action-info">
            <h2>GESTIONAR ARGENPROP</h2>
            <p>Gestiona Argenprop.</p>
          </div>
          <button @click="goToArgenprop" id="argenprop-button">
            <img src="@/assets/Boton-Argenprop-Caja.png" alt="Botón Argenprop" />
          </button>
        </div>
        
        
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import A_Sidebar from '../components/A_Sidebar.vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  
  const create = () => {
    router.push('/plataforma-administrador-crear');
  };
  
  const edit = () => {
    router.push('/plataforma-administrador-editar');
  };
  
  const remove = () => {
    router.push('/plataforma-administrador-eliminar');
  };
  
  const goToDropbox = () => {
    window.location.href = 'https://www.dropbox.com/home';
  };
  
  const goToYouTube = () => {
    window.location.href = 'https://www.youtube.com/';
  };
  
  const generateReport = () => {
    router.push('/descargar-informe');
  };

  const goToArgenprop = () => {
    window.location.href = 'https://www.argenprop.com/';
  };
  
  </script>
  
  <style scoped>
  
  </style>
  