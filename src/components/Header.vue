<template>
    <header>
      <div class="header-container">
        <img 
        src="" 
        alt="Logo Maranta" 
        class="logo" 
        @click="goToHome"
      />
        
      </div>
      <!-- <nav class="navbar">
        <ul class="nav-links">
          <li><a href="#">Alquiler</a></li>
          <li><a href="#">Venta</a></li>
          <li><a href="#">Contacto</a></li>
          <li><a href="#">Tasaciones</a></li>
          <li><a href="#">Empresa</a></li>
        </ul>
      </nav>-->
    </header>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';

const router = useRouter();

const goToHome = () => {
  router.push('/');
};
  </script>
  
  <style scoped>
  header {
    background-color: white;
    border-bottom: 2px solid black;
  }
  .header-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 0;
  }
  .logo {
    height:75px;
    padding: 5px;
  }
  .title {
    font-size: 24px;
    font-weight: bold;
    color: #001970;
    margin-left: 10px;
  }
  .navbar {
    background-color: #0b0b5a;
    text-align: center;
  }
  .nav-links {
    display: flex;
    justify-content: space-around;
    list-style: none;
    padding: 10px 0;
    margin: 0;
  }
  .nav-links li {
    flex: 1;
  }
  .nav-links a {
    color: white;
    text-decoration: none;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 20px;
    display: block;
    padding: 10px 0;
  }
  .nav-links a:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    .logo {
    height:45px;
    padding: 5px;
  }
  }
  </style>
  