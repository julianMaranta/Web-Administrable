<template>
    <div class="page-container">
      <Header />
      
      <div v-if="loading" class="loading">Cargando propiedad...</div>
      
      <div v-else-if="property" class="property-detail-container">
        <div class="property-header">
          <h1>{{ property.direccion }}</h1>
          <p class="location">{{ property.ubicacion }}</p>
          
          <div class="property-badges">
            <span class="property-badge" :class="property.tipo">
              {{ property.tipo === 'venta' ? 'VENTA' : 'ALQUILER' }}
            </span>
            <span v-if="property.destacada" class="featured-badge">DESTACADA</span>
            <span class="property-type">{{ property.tipoPropiedad }}</span>
          </div>
        </div>
        
        <!-- Carrusel principal -->
        <div class="main-carousel-container" v-if="propertyImages.length > 0">
          <Carousel :items-to-show="1" :wrap-around="true" :autoplay="3000">
            <Slide v-for="(img, index) in propertyImages" :key="index">
              <img 
                :src="img.url" 
                :alt="img.title"
                class="main-carousel-image"
                @click="openGallery(index)"
                @error="handleImageError"
              />
            </Slide>
            <template #addons>
              <Navigation />
              <Pagination />
            </template>
          </Carousel>
        </div>
        
        <div v-else class="no-images">
          <img src="@/assets/placeholder-property.jpg" alt="Imagen no disponible" />
        </div>
        
        <!-- Miniaturas para navegación (opcional) -->
        <div class="thumbnails" v-if="propertyImages.length > 1">
          <img 
            v-for="(img, index) in propertyImages" 
            :key="'thumb-' + index"
            :src="img.url" 
            :alt="'Miniatura ' + (index + 1)"
            class="thumbnail"
            :class="{ 'active-thumbnail': currentSlide === index }"
            @click="goToSlide(index)"
            @error="handleImageError"
          />
        </div>
        
        <div class="property-info">
          <div class="price-section">
            <h2>{{ formatPrice(property.tipo === 'venta' ? property.precioVenta : property.precioAlquiler) }}</h2>
            <p v-if="property.tipo === 'alquiler'" class="expenses">Expensas: {{ formatPrice(property.expensas) || 'No incluye' }}</p>
          </div>
          
          <div class="details-grid">
            <div class="detail-item">
              <span class="detail-label">Habitaciones:</span>
              <span class="detail-value">{{ property.habitaciones || '-' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Baños:</span>
              <span class="detail-value">{{ property.banos || '-' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Metros cuadrados:</span>
              <span class="detail-value">{{ property.metrosCuadrados || '-' }} m²</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Antigüedad:</span>
              <span class="detail-value">{{ property.antiguedad || '-' }} años</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Cochera:</span>
              <span class="detail-value">{{ property.cochera === 'Si' ? 'Sí' : 'No' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Ambientes:</span>
              <span class="detail-value">{{ property.ambientes || '-' }}</span>
            </div>
          </div>
          
          <div class="description-section" v-if="property.descripcion">
            <h3>Descripción</h3>
            <p>{{ property.descripcion }}</p>
          </div>
          
          <div class="features-section" v-if="property.caracteristicas">
            <h3>Características</h3>
            <ul>
              <li v-for="(feature, index) in property.caracteristicas.split(',')" :key="index">
                {{ feature.trim() }}
              </li>
            </ul>
          </div>
        </div>
        
        <button class="back-button" @click="goBack">Volver al listado</button>
      </div>
      
      <div v-else class="not-found">
        <h2>Propiedad no encontrada</h2>
        <button class="back-button" @click="goBack">Volver al listado</button>
      </div>
      
      <Footer />
      
      <!-- Modal para galería de imágenes (fullscreen) -->
      <div v-if="showGallery" class="gallery-modal" @click.self="closeGallery">
        <div class="gallery-content">
          <button class="close-button" @click="closeGallery">&times;</button>
          <Carousel 
            ref="modalCarousel"
            :items-to-show="1" 
            :wrap-around="true"
            v-model="currentSlide"
          >
            <Slide v-for="(img, index) in propertyImages" :key="'modal-' + index">
              <img 
                :src="img.url" 
                :alt="img.title"
                class="modal-image"
                @error="handleImageError"
              />
            </Slide>
            <template #addons>
              <Navigation />
              <Pagination />
            </template>
          </Carousel>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
 import { ref, computed, onMounted, nextTick } from 'vue'; // Añade nextTick aquí
import { useRoute, useRouter } from 'vue-router';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';
  
  const client = generateClient<Schema>();
  const route = useRoute();
  const router = useRouter();
  
  const property = ref<any>(null);
  const loading = ref(true);
  const showGallery = ref(false);
  const currentSlide = ref(0);
  const modalCarousel = ref<any>(null);
  
  const propertyId = route.params.id as string;
  const propertyType = route.params.type as 'venta' | 'alquiler';
  
  // Función para transformar URLs de Dropbox
  const transformDropboxUrl = (url: string) => {
    if (!url) return '';
    
    if (url.includes('dropbox.com')) {
      url = url.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
      
      if (url.includes('?dl=0')) {
        url = url.replace('?dl=0', '?raw=1');
      } else if (!url.includes('?raw=1')) {
        url += '?raw=1';
      }
    }
    return url;
  };
  
  const propertyImages = computed(() => {
    if (!property.value?.imagenes) return [];
    
    try {
      const imagenes = typeof property.value.imagenes === 'string' 
        ? JSON.parse(property.value.imagenes) 
        : property.value.imagenes;
  
      return imagenes.map((img: any) => {
        let url = img.url || img;
        url = transformDropboxUrl(url);
        
        return {
          url,
          title: typeof img === 'object' ? img.titulo : `Imagen de la propiedad ${property.value.direccion}`
        };
      });
    } catch (e) {
      console.error('Error al procesar imágenes:', e);
      return [];
    }
  });
  
  const loadProperty = async () => {
    try {
      loading.value = true;
      
      if (propertyType === 'venta') {
        const response = await client.models.PropiedadVenta.get({ id: propertyId });
        property.value = { ...response.data, tipo: 'venta' };
      } else {
        const response = await client.models.PropiedadAlquiler.get({ id: propertyId });
        property.value = { ...response.data, tipo: 'alquiler' };
      }
      
    } catch (error) {
      console.error('Error al cargar propiedad:', error);
    } finally {
      loading.value = false;
    }
  };
  
  const formatPrice = (price?: number | null) => {
    return price ? '$' + price.toLocaleString('es-AR') : 'Consultar';
  };
  
  const handleImageError = (event: Event) => {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = require('@/assets/placeholder-property.jpg');
      target.onerror = null; // Prevenir bucles infinitos
    }
  };
  
  const openGallery = (index: number) => {
    currentSlide.value = index;
    showGallery.value = true;
    
    // Esperar a que el modal se renderice antes de mover el carrusel
    nextTick(() => {
      if (modalCarousel.value) {
        modalCarousel.value.slideTo(index);
      }
    });
  };
  
  const closeGallery = () => {
    showGallery.value = false;
  };
  
  const goToSlide = (index: number) => {
    currentSlide.value = index;
  };
  
  const goBack = () => {
    router.go(-1);
  };
  
  onMounted(() => {
    loadProperty();
  });
  </script>
  
  <style scoped>
  .page-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  .property-detail-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    flex: 1;
  }
  
  .property-header {
    margin-bottom: 30px;
    text-align: center;
  }
  
  .property-header h1 {
    font-size: 2rem;
    color: #0a0f64;
    margin-bottom: 5px;
  }
  
  .location {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 15px;
  }
  
  .property-badges {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
  
  .property-badge {
    padding: 5px 15px;
    border-radius: 4px;
    font-size: 0.9rem;
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
    font-size: 0.9rem;
    font-weight: bold;
  }
  
  .property-type {
    font-size: 0.9rem;
    color: #666;
    padding: 5px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  /* Estilos para el carrusel principal */
  .main-carousel-container {
    margin-bottom: 20px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .main-carousel-image {
    width: 100%;
    height: 500px;
    object-fit: cover;
    cursor: pointer;
    transition: transform 0.3s;
  }
  
  .main-carousel-image:hover {
    transform: scale(1.01);
  }
  
  /* Estilos para las miniaturas */
  .thumbnails {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding: 10px 0;
    margin-bottom: 30px;
    scrollbar-width: thin;
  }
  
  .thumbnail {
    width: 80px;
    height: 60px;
    object-fit: cover;
    border-radius: 4px;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.3s;
  }
  
  .thumbnail:hover {
    opacity: 0.8;
    border-color: #0a0f64;
  }
  
  .active-thumbnail {
    border-color: #0a0f64;
    opacity: 0.8;
  }
  
  /* Estilos para cuando no hay imágenes */
  .no-images {
    width: 100%;
    padding: 40px;
    text-align: center;
    background: #f5f5f5;
    border-radius: 8px;
    margin-bottom: 30px;
  }
  
  .no-images img {
    max-width: 100%;
    max-height: 300px;
    opacity: 0.7;
  }
  
  .property-info {
    background: #f9f9f9;
    padding: 25px;
    border-radius: 8px;
    margin-bottom: 30px;
  }
  
  .price-section {
    text-align: center;
    margin-bottom: 25px;
  }
  
  .price-section h2 {
    font-size: 1.8rem;
    color: #0a0f64;
    margin-bottom: 5px;
  }
  
  .expenses {
    font-size: 1rem;
    color: #666;
  }
  
  .details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
    margin-bottom: 25px;
  }
  
  .detail-item {
    background: white;
    padding: 15px;
    border-radius: 6px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  }
  
  .detail-label {
    font-size: 0.9rem;
    color: #666;
    display: block;
    margin-bottom: 5px;
  }
  
  .detail-value {
    font-size: 1.1rem;
    font-weight: bold;
    color: #333;
  }
  
  .description-section,
  .features-section {
    margin-bottom: 25px;
  }
  
  .description-section h3,
  .features-section h3 {
    font-size: 1.3rem;
    color: #0a0f64;
    margin-bottom: 10px;
    border-bottom: 1px solid #eee;
    padding-bottom: 5px;
  }
  
  .description-section p {
    line-height: 1.6;
    color: #333;
  }
  
  .features-section ul {
    list-style-type: none;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 10px;
  }
  
  .features-section li {
    background: white;
    padding: 10px;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  }
  
  .back-button {
    display: block;
    margin: 0 auto;
    padding: 12px 25px;
    background: #0a0f64;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s;
  }
  
  .back-button:hover {
    background: #1a237e;
  }
  
  .not-found {
    text-align: center;
    padding: 50px 20px;
  }
  
  .not-found h2 {
    font-size: 1.5rem;
    color: #666;
    margin-bottom: 20px;
  }
  
  .loading {
    text-align: center;
    padding: 50px;
    font-size: 1.2rem;
    color: #666;
  }
  
  /* Estilos para el modal de la galería */
  .gallery-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .gallery-content {
    position: relative;
    width: 90%;
    max-width: 1200px;
    height: 90vh;
  }
  
  .modal-image {
    max-height: 80vh;
    max-width: 100%;
    object-fit: contain;
    border-radius: 4px;
  }
  
  .close-button {
    position: absolute;
    top: -50px;
    right: 0;
    background: none;
    border: none;
    color: white;
    font-size: 2.5rem;
    cursor: pointer;
    z-index: 1001;
  }
  
  /* Personalización del carrusel */
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
  
  /* Estilos responsivos */
  @media (max-width: 768px) {
    .property-header h1 {
      font-size: 1.5rem;
    }
    
    .location {
      font-size: 1rem;
    }
    
    .price-section h2 {
      font-size: 1.5rem;
    }
    
    .main-carousel-image {
      height: 350px;
    }
    
    .details-grid {
      grid-template-columns: 1fr 1fr;
    }
    
    .features-section ul {
      grid-template-columns: 1fr 1fr;
    }
  }
  
  @media (max-width: 480px) {
    .property-detail-container {
      padding: 15px;
    }
    
    .main-carousel-image {
      height: 250px;
    }
    
    .details-grid,
    .features-section ul {
      grid-template-columns: 1fr;
    }
    
    .gallery-content {
      width: 95%;
      height: 85vh;
    }
    
    .close-button {
      top: -40px;
      right: -10px;
      font-size: 2rem;
    }
    
    :deep(.carousel__prev),
    :deep(.carousel__next) {
      width: 30px;
      height: 30px;
    }
  }
  </style>