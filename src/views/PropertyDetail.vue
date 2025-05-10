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
        
        <!-- Carrusel de imágenes -->
        <div class="property-carousel-detail" v-if="propertyImages.length > 0">
          <Carousel :items-to-show="1" :wrap-around="true">
            <Slide v-for="(image, index) in propertyImages" :key="index">
              <img 
                :src="image.url" 
                :alt="image.title || `Imagen ${index + 1} de la propiedad`"
                class="carousel-image-detail"
                @error="handleImageError"
                @click="openLightbox(index)"
              />
            </Slide>
            
            <template #addons>
              <Navigation />
              <Pagination />
            </template>
          </Carousel>
        </div>
        
        <!-- Lightbox para visualización fullscreen con navegación -->
        <div v-if="lightboxVisible" class="fullscreen-overlay" @click.self="closeLightbox">
          <div class="fullscreen-container">
            <button class="nav-button prev" @click.stop="prevImage">&larr;</button>
            
            <img 
              :src="currentImage.url" 
              :alt="currentImage.title"
              class="fullscreen-image"
            />
            
            <button class="nav-button next" @click.stop="nextImage">&rarr;</button>
            
            <button class="close-button" @click="closeLightbox">
              <span class="close-icon">&times;</span>
            </button>
            
            <div class="image-counter">
              {{ currentImageIndex + 1 }} / {{ propertyImages.length }}
            </div>
          </div>
        </div>
        
        <!-- Contenedor principal de dos columnas -->
        <div class="property-content-wrapper">
          <!-- Columna izquierda - Datos de la propiedad -->
          <div class="property-data-column">
            <!-- Encabezado -->
            <div class="property-header">
              <span class="property-badge" :class="property.tipo">
                {{ property.tipo === 'venta' ? 'VENTA' : 'ALQUILER' }}
              </span>
              <!-- Agregar este botón debajo -->
<button class="copy-link-button" @click="copyPropertyLink">
  <span class="copy-icon">📋</span> Copiar link
</button>
              <span v-if="property.destacada" class="featured-badge">DESTACADA</span>
              <h1>{{ property.direccion }}</h1>
              <p class="property-location">{{ property.ubicacion }}</p>
              <p class="property-type">{{ property.tipoPropiedad }}</p>
            </div>

             <!-- Sección de precio y características principales -->
             <div class="price-section">
    <div class="price-tag">
        <span class="currency-symbol">{{ property.moneda === 'USD' ? 'U$D' : '$' }}</span>
        {{ formatPrice(property.tipo === 'venta' ? property.precioVenta : property.precioAlquiler) }}
    </div>
    <div v-if="property.precioExpensas !== undefined && property.precioExpensas !== null" class="expenses-tag">
        <span class="currency-symbol">{{ property.moneda === 'USD' ? 'U$D' : '$' }}</span>
        {{ property.precioExpensas > 0 ? formatPrice(property.precioExpensas) + ' expensas' : 'Sin expensas' }}
    </div>
</div>
    
    <!-- Todas las características agrupadas -->
    <div class="all-features-section">
        <h2>Características</h2>
        
        <div class="features-grid">
            <!-- Características principales -->
            <div class="feature-item" v-if="property.habitaciones">
                <span class="feature-icon">🛏️</span>
                <span class="feature-value">{{ property.habitaciones ?? '-' }} hab.</span>
            </div>
            
            <div class="feature-item" v-if="property.banos">
                <span class="feature-icon">🚿</span>
                <span class="feature-value">{{ property.banos ?? '-' }} baños</span>
            </div>
            
        
            
            <div class="feature-item" v-if="property.cochera">
                <span class="feature-icon">🚗</span>
                <span class="feature-value">Cochera: {{ property.cochera }}</span>
            </div>
            
            <!-- Características adicionales -->
            <div class="feature-item" v-if="property.antiguedad">
                <span class="feature-icon">⏳</span>
                <span class="feature-value">{{ property.antiguedad }} años</span>
            </div>
            
            <div class="feature-item" v-if="property.estado">
                <span class="feature-icon">🏠</span>
                <span class="feature-value">{{ property.estado }}</span>
            </div>
            
            <div class="feature-item" v-if="property.ambientes">
                <span class="feature-icon">🚪</span>
                <span class="feature-value">{{ property.ambientes }} amb.</span>
            </div>
            
            <div class="feature-item" v-if="property.orientacion">
                <span class="feature-icon">🧭</span>
                <span class="feature-value">{{ property.orientacion }}</span>
            </div>
            
            <div class="feature-item" v-if="property.pisos">
                <span class="feature-icon">🏢</span>
                <span class="feature-value">{{ property.pisos }} pisos</span>
            </div>
            
            <div class="feature-item" v-if="property.jardin">
                <span class="feature-icon">🌳</span>
                <span class="feature-value">{{ property.jardin ? 'Con jardín' : 'Sin jardín' }}</span>
            </div>
            
            <div class="feature-item" v-if="property.pileta">
                <span class="feature-icon">🏊</span>
                <span class="feature-value">{{ property.pileta ? 'Con pileta' : 'Sin pileta' }}</span>
            </div>
            
            <div class="feature-item" v-if="property.amueblada">
                <span class="feature-icon">🪑</span>
                <span class="feature-value">{{ property.amueblada ? 'Amueblada' : 'Sin amueblar' }}</span>
            </div>

            <!-- Superficies -->
      <div class="feature-item" v-if="property.superficieTotal">
        <span class="feature-icon">📐</span>
        <div class="feature-text">
          <span class="feature-label">Superficie Total</span>
          <span class="feature-value">{{ property.superficieTotal }} m²</span>
        </div>
      </div>
      
      <div class="feature-item" v-if="property.superficieCubierta">
        <span class="feature-icon">🏠</span>
        <div class="feature-text">
          <span class="feature-label">Cubierta</span>
          <span class="feature-value">{{ property.superficieCubierta }} m²</span>
        </div>
      </div>
      
      <div class="feature-item" v-if="property.superficieSemicubierta">
        <span class="feature-icon">🏡</span>
        <div class="feature-text">
          <span class="feature-label">Semicubierta</span>
          <span class="feature-value">{{ property.superficieSemicubierta }} m²</span>
        </div>
      </div>
      
      <div class="feature-item" v-if="property.superficieTerreno">
        <span class="feature-icon">🌱</span>
        <div class="feature-text">
          <span class="feature-label">Terreno</span>
          <span class="feature-value">{{ property.superficieTerreno }} m²</span>
        </div>
      </div>
        </div>
    </div>
            
            <!-- Descripción detallada -->
            <div class="description-section" v-if="property.descripcion">
              <h2>Descripción</h2>
              <p>{{ property.descripcion }}</p>
            </div>
            
           
          </div>
          
          <!-- Columna derecha - Datos de contacto -->
          <div class="contact-column">
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
                <p><strong>Número:</strong> +54 9</p>
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
                <p><strong>Teléfono:</strong> +54 9</p>
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
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

// Función para copiar el link de la propiedad
const copyPropertyLink = () => {
  const propertyUrl = window.location.href;
  navigator.clipboard.writeText(propertyUrl)
    .then(() => {
      // Mostrar feedback visual (opcional)
      const copyBtn = document.querySelector('.copy-link-button');
      if (copyBtn) {
        copyBtn.textContent = '✓ Copiado!';
        setTimeout(() => {
          copyBtn.innerHTML = '<span class="copy-icon">📋</span> Copiar link';
        }, 2000);
      }
    })
    .catch(err => {
      console.error('Error al copiar: ', err);
      // Fallback para navegadores antiguos
      const textArea = document.createElement('textarea');
      textArea.value = propertyUrl;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
      } catch (err) {
        console.error('Fallback copy failed: ', err);
      }
      document.body.removeChild(textArea);
    });
};

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

// Función para ver imagen en pantalla completa (igual que en el ejemplo)
const viewFullscreen = (imageSrc: string) => {
const image = new Image();
image.src = imageSrc;
const fullscreenContainer = document.createElement('div');
fullscreenContainer.style.position = 'fixed';
fullscreenContainer.style.top = '0';
fullscreenContainer.style.left = '0';
fullscreenContainer.style.width = '100%';
fullscreenContainer.style.height = '100%';
fullscreenContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
fullscreenContainer.style.display = 'flex';
fullscreenContainer.style.justifyContent = 'center';
fullscreenContainer.style.alignItems = 'center';
fullscreenContainer.style.zIndex = '1000';
fullscreenContainer.appendChild(image);

document.body.appendChild(fullscreenContainer);

fullscreenContainer.addEventListener('click', () => {
  document.body.removeChild(fullscreenContainer);
});
};

// Variables para el lightbox
const lightboxVisible = ref(false);
const currentImageIndex = ref(0);

// Imagen actual en el lightbox
const currentImage = computed(() => {
return propertyImages.value[currentImageIndex.value] || { url: '', title: '' };
});

// Abrir lightbox en una imagen específica
const openLightbox = (index: number) => {
currentImageIndex.value = index;
lightboxVisible.value = true;
document.body.style.overflow = 'hidden';
};

// Cerrar lightbox
const closeLightbox = () => {
lightboxVisible.value = false;
document.body.style.overflow = '';
};

// Navegar a la imagen anterior
const prevImage = () => {
currentImageIndex.value = (currentImageIndex.value - 1 + propertyImages.value.length) % propertyImages.value.length;
};

// Navegar a la siguiente imagen
const nextImage = () => {
currentImageIndex.value = (currentImageIndex.value + 1) % propertyImages.value.length;
};

// Manejar navegación con teclado
const handleKeyDown = (e: KeyboardEvent) => {
if (!lightboxVisible.value) return;

switch (e.key) {
  case 'Escape':
    closeLightbox();
    break;
  case 'ArrowLeft':
    prevImage();
    break;
  case 'ArrowRight':
    nextImage();
    break;
}
};

// Configurar event listeners
onMounted(() => {
window.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
window.removeEventListener('keydown', handleKeyDown);
});

// Formatear precio
const formatPrice = (price?: number | null) => {
  if (!price) return 'Consultar';
  return price.toLocaleString('es-AR');
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
margin-bottom: 80px;
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
}

/* Contenedor principal de dos columnas */
.property-content-wrapper {
display: flex;
flex-wrap: wrap;
gap: 30px;
padding: 20px;
}

/* Columna de datos de la propiedad */
.property-data-column {
flex: 1;
min-width: 300px;
}

/* Columna de contacto */
.contact-column {
width: 300px;
position: relative;
}

.contact-section {
position: sticky;
top: 20px;
background: #f9f9f9;
border-radius: 8px;
padding: 20px;
box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.copy-link-button {
  background: #f0f2f5;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 13px;
  cursor: pointer;
  margin-left: 10px;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.copy-link-button:hover {
  background: #e5e7eb;
  border-color: #9ca3af;
}

.copy-link-button .copy-icon {
  font-size: 14px;
}

.property-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  position: relative;
  padding-right: 0; /* Eliminamos el padding derecho anterior */
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
position: static;
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

/* Sección de características unificadas */
.all-features-section {
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
    margin-top: 15px;
}

.feature-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px;
    background: #f9f9f9;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.feature-item:hover {
    background: #f0f0f0;
    transform: translateY(-2px);
}

.feature-icon {
    font-size: 20px;
    width: 30px;
    text-align: center;
}

.feature-value {
    font-size: 15px;
    color: #333;
}

/* Secciones de contenido */
.description-section,
.additional-features {
margin-bottom: 30px;
padding-bottom: 20px;
border-bottom: 1px solid #eee;
}

.description-section p {
line-height: 1.6;
color: #333;
}



/* Contacto */
.contact-options {
display: flex;
flex-direction: column;
gap: 15px;
margin-top: 15px;
}

.contact-button {
padding: 12px 20px;
border: none;
border-radius: 4px;
color: white;
font-weight: bold;
cursor: pointer;
display: flex;
align-items: center;
gap: 8px;
transition: opacity 0.3s;
justify-content: center;
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

.carousel-image-detail {
cursor: pointer;
transition: transform 0.2s;
}

.carousel-image-detail:hover {
transform: scale(1.02);
}

/* Estilos responsivos */
@media (max-width: 768px) {
.property-content-wrapper {
  flex-direction: column;
}

.contact-column {
  width: 100%;
}

.contact-section {
  position: static;
}
}

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

.main-features {
  flex-wrap: wrap;
}

.feature {
  min-width: 45%;
}
}

/* Estilos para el lightbox mejorado */
.fullscreen-overlay {
position: fixed;
top: 0;
left: 0;
right: 0;
bottom: 0;
background-color: rgba(0, 0, 0, 0.9);
display: flex;
justify-content: center;
align-items: center;
z-index: 1000;
}

.fullscreen-container {
position: relative;
width: 90%;
height: 90%;
display: flex;
justify-content: center;
align-items: center;
}

.fullscreen-image {
max-width: 100%;
max-height: 100%;
object-fit: contain;
}

.nav-button {
position: absolute;
top: 50%;
transform: translateY(-50%);
background: rgba(0, 0, 0, 0.5);
border: none;
color: white;
font-size: 2rem;
width: 50px;
height: 50px;
border-radius: 50%;
cursor: pointer;
z-index: 1001;
display: flex;
justify-content: center;
align-items: center;
}

.nav-button.prev {
left: 20px;
}

.nav-button.next {
right: 20px;
}

.close-button {
position: absolute;
top: 30px;
right: 30px;
background: rgba(0, 0, 0, 0.7);
border: none;
color: white;
width: 50px;
height: 50px;
border-radius: 50%;
cursor: pointer;
z-index: 1001;
display: flex;
justify-content: center;
align-items: center;
transition: all 0.3s ease;
}

.close-icon {
font-size: 30px;
line-height: 1;
display: block;
margin-top: -2px;
}

.close-button:hover {
background: rgba(255, 255, 255, 0.2);
transform: scale(1.1);
}

.image-counter {
position: absolute;
bottom: 20px;
left: 50%;
transform: translateX(-50%);
color: white;
background: rgba(0, 0, 0, 0.5);
padding: 5px 15px;
border-radius: 20px;
font-size: 1rem;
}

.expenses-tag {
font-size: 18px;
color: #666;
margin-top: 5px;
font-weight: normal;
}

.price-section > div:first-child {
display: flex;
flex-direction: column;
}

.currency-symbol {
  font-weight: bold;
  margin-right: 4px;
  color: #0a0f64;
}

.price-tag {
  display: flex;
  align-items: center;
  font-size: 28px;
  font-weight: bold;
  color: #0a0f64;
}

.expenses-tag {
  display: flex;
  align-items: center;
  font-size: 18px;
  color: #666;
  margin-top: 5px;
}

/* Responsive para el lightbox */
@media (max-width: 768px) {
.close-button {
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
}

.close-icon {
  font-size: 25px;
}
}
</style>