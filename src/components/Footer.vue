<template>
    <footer class="footer">
      <div class="info">
        <p><strong>Dirección:</strong> Calle 58 N° 1013 entre 15 y 16</p>
        <p><strong>Teléfono:</strong> (0221)453-3262</p>
      </div>
      <div class="info">
        <p><strong>Horarios:</strong> Lunes a Viernes desde 9:30 hs hasta 13:00 hs</p>
        <p><strong>Email:</strong> germanmaranta@yahoo.com.ar</p>
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
      <div class="partners">
        <img src="" alt="Argencasas" />
        <img src="" alt="Zonaprop" />
      </div>
    </footer>
  </template>
  
  <style scoped>
 .footer {
  background-color: #0a0f64;
  color: white;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.info {
  text-align: left;
}

.social-icons {
  display: flex;
  gap: 10px;
}

.partners {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

img {
  height: 30px;
  cursor: pointer;
}
  </style>
  