<template>
    <footer class="footer">
      <div class="info">
        <p><strong>Dirección</strong> -</p>
        <p><strong>Teléfono</strong> -</p>
      </div>
      <div class="info">
        <p><strong>Horarios</strong> -</p>
        <p><strong>Email</strong> -</p>
      </div>
      <div class="social-icons">
        <img src="" alt="WhatsApp" />
        <img src="" alt="Instagram" />
        <img src="" alt="Facebook" />
        <img src="" alt="Twitter" />
        <img src="" alt="TikTok" />
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
  