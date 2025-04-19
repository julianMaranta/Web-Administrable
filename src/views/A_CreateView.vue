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
          <h2>ALQUILER</h2>
          <p>Crea cursos.</p>
        </div>
        <button @click="createAlquiler" class="crear-button"></button>
      </div>
      <div class="action-box">
        <div class="action-info">
          <h2>VENTA</h2>
          <p>Crea especializaciones.</p>
        </div>
        <button @click="createVenta" class="crear-button"></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import A_Sidebar from '../components/A_Sidebar.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const createAlquiler = () => {
  router.push('/plataforma-administrador-crear-alquiler');
};

const createVenta = () => {
  router.push('/plataforma-administrador-crear-venta');
}


</script>

<style scoped>
body, html {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
  margin: 0;
  padding: 0;
  height: 100%;
}

.container {
  display: flex;
  min-height: 100vh;
}

.content {
  margin-left: 220px;
  padding: 20px;
  width: calc(100% - 220px);
  position: relative;
  background-image: url('');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
}

.logo-plataforma {
  width: 500px;
  padding: 5px;
}

.logo-container {
  text-align: left;
  margin-bottom: 5px;
  width: 160px;
  height: auto;
}

.action-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-image: url('@/assets/caja-plataforma.png');
  padding: 40px;
  border-radius: 40px;
  margin-bottom: 20px;
  color: white;
}

.action-info {
  flex: 1;
}

.action-info h2 {
  margin: 0 0 10px 0;
  font-size: 24px;
}

.action-info p {
  margin: 10px 0;
  font-size: 20px;
}

.action-box button {
  background-color: white;
  color: #000000;
  border: 1px solid #000000;
  padding: 15px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 20px;
  transition: transform 0.3s;
}

.action-box button:hover {
  background-color: #7f1a6c;
  color: white;
  transform: scale(1.1);
}

.crear-button {
  background-image: url('@/assets/background-boton-crear.png');
  background-size: cover;
  background-position: center;
  color: white;
  height: 60px;
  width: 200px;
}

@media screen and (max-width: 1024px) and (min-width: 769px) {
  .action-box {
    background-image: url('@/assets/fondo-caja-tablet.png');
    border-radius: 70px;
  }
}
</style>