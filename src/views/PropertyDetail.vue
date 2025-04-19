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
        
        <div class="property-gallery">
          <img 
            v-for="(img, index) in propertyImages" 
            :key="index"
            :src="img.url" 
            :alt="`Imagen ${index + 1} de la propiedad`"
            class="gallery-image"
            @click="openGallery(index)"
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
      
      <!-- Modal para galería de imágenes -->
      <div v-if="showGallery" class="gallery-modal" @click.self="closeGallery">
        <div class="gallery-content">
          <button class="close-button" @click="closeGallery">&times;</button>
          <img :src="currentImage.url" :alt="`Imagen ${currentImageIndex + 1} de la propiedad`" />
          <div class="gallery-controls">
            <button @click="prevImage" :disabled="currentImageIndex === 0">Anterior</button>
            <span>{{ currentImageIndex + 1 }} / {{ propertyImages.length }}</span>
            <button @click="nextImage" :disabled="currentImageIndex === propertyImages.length - 1">Siguiente</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import Header from '@/components/Header.vue';
  import Footer from '@/components/Footer.vue';
  import { generateClient } from 'aws-amplify/data';
  import type { Schema } from '../../amplify/data/resource';
  
  const client = generateClient<Schema>();
  const route = useRoute();
  const router = useRouter();
  
  const property = ref<any>(null);
  const loading = ref(true);
  const showGallery = ref(false);
  const currentImageIndex = ref(0);
  
  const propertyId = route.params.id as string;
  const propertyType = route.params.type as 'venta' | 'alquiler';
  
  const propertyImages = computed(() => {
    if (!property.value?.imagenes) return [];
    try {
      return typeof property.value.imagenes === 'string' 
        ? JSON.parse(property.value.imagenes) 
        : property.value.imagenes;
    } catch (e) {
      console.error('Error al procesar imágenes:', e);
      return [];
    }
  });
  
  const currentImage = computed(() => {
    return propertyImages.value[currentImageIndex.value] || { url: '@/assets/placeholder-property.jpg' };
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
  
  const openGallery = (index: number) => {
    currentImageIndex.value = index;
    showGallery.value = true;
  };
  
  const closeGallery = () => {
    showGallery.value = false;
  };
  
  const prevImage = () => {
    if (currentImageIndex.value > 0) {
      currentImageIndex.value--;
    }
  };
  
  const nextImage = () => {
    if (currentImageIndex.value < propertyImages.value.length - 1) {
      currentImageIndex.value++;
    }
  };
  
  const goBack = () => {
    router.go(-1);
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
  
  .property-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 15px;
    margin-bottom: 30px;
  }
  
  .gallery-image {
    width: 100%;
    height: 250px;
    object-fit: cover;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.3s;
  }
  
  .gallery-image:hover {
    transform: scale(1.02);
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
  
  /* Estilos para el modal de la galería */
  .gallery-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .gallery-content {
    position: relative;
    max-width: 90%;
    max-height: 90%;
  }
  
  .gallery-content img {
    max-height: 80vh;
    max-width: 100%;
    border-radius: 8px;
  }
  
  .close-button {
    position: absolute;
    top: -40px;
    right: 0;
    background: none;
    border: none;
    color: white;
    font-size: 2rem;
    cursor: pointer;
  }
  
  .gallery-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
    color: white;
  }
  
  .gallery-controls button {
    padding: 8px 15px;
    background: #0a0f64;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .gallery-controls button:disabled {
    background: #666;
    cursor: not-allowed;
  }
  
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
    
    .details-grid,
    .features-section ul {
      grid-template-columns: 1fr;
    }
    
    .gallery-image {
      height: 200px;
    }
  }
  </style>