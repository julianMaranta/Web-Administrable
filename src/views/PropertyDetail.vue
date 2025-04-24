<template>
    <div class="page-container">
      <Header />
      
      <main class="property-detail-container">
        <div v-if="loading" class="loading">Cargando propiedad...</div>
        
        <div v-else-if="property" class="property-detail">
          <!-- Botón de volver -->
          <button class="back-button" @click="goBack">
            ← Volver a propiedades
          </button>
          
          
          
          <!-- Carrusel de imágenes (más grande que en la lista) -->
          <div class="property-carousel-detail" v-if="propertyImages.length > 0">
            <Carousel :items-to-show="1" :wrap-around="true">
              <Slide v-for="(image, index) in propertyImages" :key="index">
                <img 
                  :src="image.url" 
                  :alt="image.title || `Imagen ${index + 1} de la propiedad`"
                  class="carousel-image-detail"
                  @error="handleImageError"
                />
              </Slide>
              
              <template #addons>
                <Navigation />
                <Pagination />
              </template>
            </Carousel>
          </div>
          
          <div v-else class="no-images-placeholder-detail">
            <img src="@/assets/placeholder-property.jpg" alt="Imagen no disponible" />
          </div>
          
<!-- Encabezado -->
<div class="property-header">
            <span class="property-badge" :class="property.tipo">
              {{ property.tipo === 'venta' ? 'VENTA' : 'ALQUILER' }}
            </span>
            <span v-if="property.destacada" class="featured-badge">DESTACADA</span>
            <h1>{{ property.direccion }}</h1>
            <p class="property-location">{{ property.ubicacion }}</p>
            <p class="property-type">{{ property.tipoPropiedad }}</p>
          </div>

          <!-- Sección de precio y características principales -->
          <div class="price-section">
            <div class="price-tag">
              {{ formatPrice(property.tipo === 'venta' ? property.precioVenta : property.precioAlquiler) }}
            </div>
            
            <div class="main-features">
              <div class="feature">
                <span class="feature-icon">🛏️</span>
                <span>{{ property.habitaciones ?? '-' }} hab.</span>
              </div>
              <div class="feature">
                <span class="feature-icon">🚿</span>
                <span>{{ property.banos ?? '-' }} baños</span>
              </div>
              <div class="feature">
                <span class="feature-icon">📏</span>
                <span>{{ property.metrosCuadrados ?? '-' }} m²</span>
              </div>
              <div class="feature" v-if="property.cochera">
                <span class="feature-icon">🚗</span>
                <span>Cochera: {{ property.cochera }}</span>
              </div>
            </div>
          </div>
          
          <!-- Descripción detallada -->
          <div class="description-section" v-if="property.descripcion">
            <h2>Descripción</h2>
            <p>{{ property.descripcion }}</p>
          </div>
          
          <!-- Características adicionales -->
          <div class="additional-features">
            <h2>Características</h2>
            
            <div class="features-grid">
              <div class="feature-item" v-if="property.antiguedad">
                <span class="feature-label">Antigüedad:</span>
                <span class="feature-value">{{ property.antiguedad }} años</span>
              </div>
              
              <div class="feature-item" v-if="property.estado">
                <span class="feature-label">Estado:</span>
                <span class="feature-value">{{ property.estado }}</span>
              </div>
              
              <div class="feature-item" v-if="property.orientacion">
                <span class="feature-label">Orientación:</span>
                <span class="feature-value">{{ property.orientacion }}</span>
              </div>
              
              <div class="feature-item" v-if="property.pisos">
                <span class="feature-label">Pisos:</span>
                <span class="feature-value">{{ property.pisos }}</span>
              </div>
              
              <div class="feature-item" v-if="property.ambientes">
                <span class="feature-label">Ambientes:</span>
                <span class="feature-value">{{ property.ambientes }}</span>
              </div>
              
              <div class="feature-item" v-if="property.jardin">
                <span class="feature-label">Jardín:</span>
                <span class="feature-value">{{ property.jardin ? 'Sí' : 'No' }}</span>
              </div>
              
              <div class="feature-item" v-if="property.pileta">
                <span class="feature-label">Pileta:</span>
                <span class="feature-value">{{ property.pileta ? 'Sí' : 'No' }}</span>
              </div>
              
              <div class="feature-item" v-if="property.amueblada">
                <span class="feature-label">Amueblada:</span>
                <span class="feature-value">{{ property.amueblada ? 'Sí' : 'No' }}</span>
              </div>
            </div>
          </div>
          
          <!-- Contacto -->
  <div class="contact-section">
    <h2>Contacto</h2>
    <p>Para más información sobre esta propiedad:</p>
    
    <div class="contact-options">
      <button class="contact-button whatsapp" @click="showWhatsAppModal = true">
        <span>📱 WhatsApp</span>
      </button>
      <button class="contact-button email" @click="showEmailModal = true">
        <span>✉️ Email</span>
      </button>
      <button class="contact-button phone" @click="showPhoneModal = true">
        <span>📞 Llamar</span>
      </button>
    </div>
  </div>

  <!-- Modales de contacto - Versión con contenido centrado -->
  <!-- Modal de WhatsApp -->
  <div v-if="showWhatsAppModal" class="modal-overlay" @click.self="showWhatsAppModal = false">
    <div class="modal-content centered-modal">
      <button class="modal-close" @click="showWhatsAppModal = false">&times;</button>
      <div class="modal-body">
        <h3>Contactar por WhatsApp</h3>
        <p>Para contactar al agente por WhatsApp:</p>
        <div class="contact-info">
          <p><strong>Número:</strong> +54 11 1234-5678</p>
          <a href="https://wa.me/541112345678" target="_blank" class="whatsapp-link">
            Abrir conversación en WhatsApp
          </a>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de Email -->
  <div v-if="showEmailModal" class="modal-overlay" @click.self="showEmailModal = false">
    <div class="modal-content centered-modal">
      <button class="modal-close" @click="showEmailModal = false">&times;</button>
      <div class="modal-body">
        <h3>Contactar por Email</h3>
        <p>Para contactar al agente por correo electrónico:</p>
        <div class="contact-info">
          <p><strong>Email:</strong> contacto@inmobiliaria.com</p>
          <a href="mailto:contacto@inmobiliaria.com" class="email-link">
            Enviar correo electrónico
          </a>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de Teléfono -->
  <div v-if="showPhoneModal" class="modal-overlay" @click.self="showPhoneModal = false">
    <div class="modal-content centered-modal">
      <button class="modal-close" @click="showPhoneModal = false">&times;</button>
      <div class="modal-body">
        <h3>Contactar por Teléfono</h3>
        <p>Para llamar al agente:</p>
        <div class="contact-info">
          <p><strong>Teléfono:</strong> +54 11 4321-5678</p>
          <a href="tel:+541143215678" class="phone-link">
            Llamar ahora
          </a>
        </div>
      </div>
    </div>
  </div>
</div>    
        <div v-else class="not-found">
          <h2>Propiedad no encontrada</h2>
          <p>La propiedad que buscas no está disponible o no existe.</p>
          <button class="back-button" @click="goBack">
            ← Volver a propiedades
          </button>
        </div>
      </main>
      
      <Footer />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { generateClient } from 'aws-amplify/data';
  import type { Schema } from '../../amplify/data/resource';
  import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';
  import 'vue3-carousel/dist/carousel.css';
  import Header from '@/components/Header.vue';
  import Footer from '@/components/Footer.vue';
  
  const route = useRoute();
  const router = useRouter();
  const client = generateClient<Schema>();
  
  const loading = ref(true);
  const property = ref<any>(null);
  
// Añadir estas variables para controlar los modales
const showWhatsAppModal = ref(false);
const showEmailModal = ref(false);
const showPhoneModal = ref(false);

  // Obtener imágenes de la propiedad
  const propertyImages = computed(() => {
    if (!property.value?.imagenes) return [];
    
    try {
      const imagenes = typeof property.value.imagenes === 'string' 
        ? JSON.parse(property.value.imagenes) 
        : property.value.imagenes;
  
      return imagenes.map((img: any) => {
        let url = img.url || img;
        
        // Transformar URLs de Dropbox
        if (url.includes('dropbox.com')) {
          url = url.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
          
          if (url.includes('?dl=0')) {
            url = url.replace('?dl=0', '?raw=1');
          } else if (!url.includes('?raw=1')) {
            url += '?raw=1';
          }
        }
        
        return {
          url,
          title: typeof img === 'object' ? img.titulo : `Imagen de propiedad`
        };
      });
    } catch (error) {
      console.error('Error procesando imágenes:', error);
      return [];
    }
  });
  
  // Formatear precio
  const formatPrice = (price?: number | null) => {
    return price ? '$' + price.toLocaleString('es-AR') : 'Consultar';
  };
  
  // Manejar error de imagen
  const handleImageError = (event: Event) => {
    const target = event.target as HTMLImageElement | null;
    if (target) {
      target.src = '';
    }
  };
  
  // Volver atrás
  const goBack = () => {
    router.go(-1);
  };
  
  // Cargar los datos de la propiedad
  const loadProperty = async () => {
    try {
      loading.value = true;
      const { id, type } = route.params;
      
      if (type === 'venta') {
        const response = await client.models.PropiedadVenta.get({ id: id as string });
        property.value = { ...response.data, tipo: 'venta' };
      } else if (type === 'alquiler') {
        const response = await client.models.PropiedadAlquiler.get({ id: id as string });
        property.value = { ...response.data, tipo: 'alquiler' };
      }
    } catch (error) {
      console.error('Error cargando propiedad:', error);
      property.value = null;
    } finally {
      loading.value = false;
    }
  };
  
  onMounted(() => {
    loadProperty();
  });
  </script>
  
  <style scoped>
  .property-detail-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .back-button {
    background: none;
    border: none;
    color: #0a0f64;
    font-size: 16px;
    cursor: pointer;
    margin-bottom: 20px;
    padding: 5px 10px;
    border-radius: 4px;
    transition: background-color 0.3s;
  }
  
  .back-button:hover {
    background-color: #f0f0f0;
  }
  
  .property-detail {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    padding: 20px;
  }
  
  .property-header {
    margin-bottom: 20px;
    position: relative;
    padding-right: 120px;
  }
  
  .property-header h1 {
    color: #0a0f64;
    margin: 10px 0 5px;
  }
  
  .property-location {
    color: #666;
    font-size: 18px;
    margin-bottom: 5px;
  }
  
  .property-type {
    color: #666;
    font-style: italic;
  }
  
  .property-badge {
    position: absolute;
    top: 0;
    right: 0;
    padding: 5px 15px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: bold;
    color: white;
  }
  
  .property-badge.venta {
    background-color: #0a0f64;
  }
  
  .property-badge.alquiler {
    background-color: #4CAF50;
  }
  
  .featured-badge {
    display: inline-block;
    background-color: #FFC107;
    color: #333;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: bold;
    margin-right: 10px;
  }
  
  /* Carrusel detallado */
  .property-carousel-detail {
    width: 100%;
    height: 500px;
    margin-bottom: 30px;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .carousel-image-detail {
    width: 100%;
    height: 500px;
    object-fit: cover;
  }
  
  .no-images-placeholder-detail {
    width: 100%;
    height: 500px;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    margin-bottom: 30px;
  }
  
  .no-images-placeholder-detail img {
    max-width: 100%;
    max-height: 100%;
  }
  
  /* Sección de precio */
  .price-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
  }
  
  .price-tag {
    font-size: 28px;
    font-weight: bold;
    color: #0a0f64;
  }
  
  .main-features {
    display: flex;
    gap: 20px;
  }
  
  .feature {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 16px;
  }
  
  .feature-icon {
    font-size: 24px;
    margin-bottom: 5px;
  }
  
  /* Secciones de contenido */
  .description-section,
  .additional-features,
  .contact-section {
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
  }
  
  .description-section p {
    line-height: 1.6;
    color: #333;
  }
  
  /* Características adicionales */
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
    margin-top: 15px;
  }
  
  .feature-item {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background: #f9f9f9;
    border-radius: 4px;
  }
  
  .feature-label {
    font-weight: bold;
    color: #666;
  }
  
  .feature-value {
    color: #333;
  }
  
  /* Contacto */
  .contact-options {
    display: flex;
    gap: 15px;
    margin-top: 15px;
  }
  
  .contact-button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    color: white;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: opacity 0.3s;
  }
  
  .contact-button:hover {
    opacity: 0.9;
  }
  
  .contact-button.whatsapp {
    background-color: #25D366;
  }
  
  .contact-button.email {
    background-color: #0a0f64;
  }
  
  .contact-button.phone {
    background-color: #FF5722;
  }
  
  /* Estilos para el carrusel */
  :deep(.carousel__prev),
  :deep(.carousel__next) {
    background-color: rgba(255, 255, 255, 0.7);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    color: #0a0f64;
  }
  
  :deep(.carousel__pagination-button) {
    background-color: #ccc;
  }
  
  :deep(.carousel__pagination-button--active) {
    background-color: #0a0f64;
  }
  
  /* Estado de carga y no encontrado */
  .loading,
  .not-found {
    text-align: center;
    padding: 50px;
    font-size: 18px;
  }
  
  .not-found h2 {
    color: #d32f2f;
    margin-bottom: 15px;
  }

  .modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: relative;
}

.centered-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.modal-body {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  transition: color 0.2s;
}

.modal-close:hover {
  color: #333;
}

.contact-info {
  margin-top: 20px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  width: 100%;
  max-width: 300px;
}

.contact-info p {
  margin-bottom: 15px;
  font-size: 16px;
}

.whatsapp-link, .email-link, .phone-link {
  display: inline-block;
  padding: 12px 20px;
  border-radius: 6px;
  color: white;
  text-decoration: none;
  margin-top: 10px;
  font-weight: bold;
  font-size: 15px;
  transition: transform 0.2s, opacity 0.2s;
}

.whatsapp-link:hover, .email-link:hover, .phone-link:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

/* Estilos responsivos */
@media (max-width: 480px) {
  .modal-content {
    padding: 25px 15px;
  }
  
  .contact-info {
    padding: 15px 10px;
  }
  
  .whatsapp-link, .email-link, .phone-link {
    padding: 10px 15px;
    font-size: 14px;
  }
}
  </style>