<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="info">
        <p><strong>Dirección:</strong> ----------</p>
        <p><strong>Teléfono:</strong> ----------</p>
      </div>
      <div class="info">
        <p><strong>Horarios:</strong> ----------</p>
        <p><strong>Email:</strong> ----------</p>
      </div>
      <div class="social-icons">
        <img src="@/assets/icono-facebook.png" alt="WhatsApp" />
        <img src="@/assets/icono-instagram.png" alt="Instagram" />
        <img src="@/assets/icono-linkedin.png" alt="Facebook" />
        <img src="@/assets/icono-x.png" alt="Twitter" />
        <img src="@/assets/icono-youtube.png" alt="TikTok" />
        <img src="@/assets/logo-argenprop-1.png" alt="Argencasas" />
        <img src="@/assets/logo-zonaprop-2.png" alt="Argencasas" />
        <img src="@/assets/logo-wsap.png" alt="Argencasas" />
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: #0a0f64;
  color: white;
  padding: 20px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.info {
  text-align: left;
  margin: 0 10px;
}

.social-icons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

img {
  height: 30px;
  cursor: pointer;
}

/* Estilos para móviles */
@media (max-width: 768px) {
  .footer {
    position: relative; /* Cambiado de fixed a relative para móviles */
    padding: 15px;
  }
  
  .footer-content {
    flex-direction: column;
    gap: 15px;
  }
  
  .info {
    text-align: center;
    margin: 5px 0;
  }
  
  .social-icons {
    justify-content: center;
    margin-top: 10px;
  }
}

/* Estilos para pantallas muy pequeñas */
@media (max-width: 480px) {
  .social-icons {
    gap: 8px;
  }
  
  img {
    height: 25px;
  }
}
</style>