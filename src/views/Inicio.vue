<script setup lang="ts">
import '@/assets/main.css';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import { ref, onMounted, reactive, computed } from 'vue';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

// Tipos con manejo explícito de null/undefined
type PropiedadVenta = Awaited<ReturnType<typeof client.models.PropiedadVenta.list>>['data'][number];
type PropiedadAlquiler = Awaited<ReturnType<typeof client.models.PropiedadAlquiler.list>>['data'][number];

const propiedadesVenta = ref<PropiedadVenta[]>([]);
const propiedadesAlquiler = ref<PropiedadAlquiler[]>([]);
const loading = ref(true);
const searchQuery = reactive({
  operacion: '',
  provincia: '',
  localidad: '',
  direccion: '',
  precioMax: '',
  tipoPropiedad: '',
  habitaciones: '',
  banos: ''
});

const loadProperties = async () => {
  try {
    const ventaResponse = await client.models.PropiedadVenta.list();
    propiedadesVenta.value = ventaResponse.data || [];
    
    const alquilerResponse = await client.models.PropiedadAlquiler.list();
    propiedadesAlquiler.value = alquilerResponse.data || [];
    
  } catch (error) {
    console.error('Error al cargar propiedades:', error);
  } finally {
    loading.value = false;
  }
};

const filteredProperties = computed(() => {
  const ventas = propiedadesVenta.value.map(p => ({ ...p, tipo: 'venta' as const }));
  const alquileres = propiedadesAlquiler.value.map(p => ({ ...p, tipo: 'alquiler' as const }));
  const allProperties = [...ventas, ...alquileres];
  
  return allProperties.filter(prop => {
    // Filtros con manejo de valores nulos
    if (searchQuery.operacion && !prop.tipo.includes(searchQuery.operacion.toLowerCase())) {
      return false;
    }
    
    if (searchQuery.provincia && !prop.ubicacion?.toLowerCase().includes(searchQuery.provincia.toLowerCase())) {
      return false;
    }
    
    if (searchQuery.localidad && !prop.ubicacion?.toLowerCase().includes(searchQuery.localidad.toLowerCase())) {
      return false;
    }
    
    if (searchQuery.direccion && !prop.direccion?.toLowerCase().includes(searchQuery.direccion.toLowerCase())) {
      return false;
    }
    
    if (searchQuery.precioMax) {
      const precio = prop.tipo === 'venta' ? prop.precioVenta : prop.precioAlquiler;
      if (!precio || precio > Number(searchQuery.precioMax)) {
        return false;
      }
    }
    
    if (searchQuery.tipoPropiedad && !prop.tipoPropiedad?.toLowerCase().includes(searchQuery.tipoPropiedad.toLowerCase())) {
      return false;
    }
    
    if (searchQuery.habitaciones && (prop.habitaciones === null || prop.habitaciones === undefined || 
        prop.habitaciones < Number(searchQuery.habitaciones))) {
      return false;
    }
    
    if (searchQuery.banos && (prop.banos === null || prop.banos === undefined || 
        prop.banos < Number(searchQuery.banos))) {
      return false;
    }
    
    return true;
  });
});

const getFirstImage = (prop: PropiedadVenta | PropiedadAlquiler) => {
  try {
    if (prop.imagenes) {
      const imagenes = typeof prop.imagenes === 'string' ? JSON.parse(prop.imagenes) : prop.imagenes;
      return imagenes[0]?.url || '@/assets/placeholder-property.jpg';
    }
  } catch (e) {
    console.error('Error al procesar imágenes:', e);
  }
  return '@/assets/placeholder-property.jpg';
};

const formatPrice = (price?: number | null) => {
  return price ? '$' + price.toLocaleString() : 'Consultar';
};

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement | null;
  if (target) {
    target.src = '@/assets/placeholder-property.jpg';
  }
};

onMounted(() => {
  loadProperties();
});
</script>

<template>
  <div class="page-container">
    <Header />

    <section class="search-section">
      <h2>Busca tu propiedad:</h2>
      <div class="search-fields">
        <select v-model="searchQuery.operacion">
          <option value="">Todas las operaciones</option>
          <option value="venta">Venta</option>
          <option value="alquiler">Alquiler</option>
        </select>
        
        <input v-model="searchQuery.provincia" type="text" placeholder="Provincia" />
        <input v-model="searchQuery.localidad" type="text" placeholder="Localidad" />
        <input v-model="searchQuery.direccion" type="text" placeholder="Dirección" />
        <input v-model="searchQuery.precioMax" type="number" placeholder="Precio máximo" />
        <input v-model="searchQuery.tipoPropiedad" type="text" placeholder="Tipo (Casa, Depto)" />
        <input v-model="searchQuery.habitaciones" type="number" placeholder="Mín. habitaciones" />
        <input v-model="searchQuery.banos" type="number" placeholder="Mín. baños" />
      </div>
    </section>

    <main class="featured-properties">
      <div v-if="loading" class="loading">Cargando propiedades...</div>
      
      <div v-else>
        <h2>Propiedades Disponibles ({{ filteredProperties.length }})</h2>
        
        <div class="property-grid">
          <div v-for="propiedad in filteredProperties" :key="propiedad.id" class="property-card">
            <div class="property-header">
              <span class="property-badge" :class="propiedad.tipo">
                {{ propiedad.tipo === 'venta' ? 'VENTA' : 'ALQUILER' }}
              </span>
              <span v-if="propiedad.destacada" class="featured-badge">DESTACADA</span>
              <h3>{{ propiedad.direccion }}</h3>
              <p>{{ propiedad.ubicacion }}</p>
              <p class="property-type">{{ propiedad.tipoPropiedad }}</p>
            </div>
            
            <img 
              :src="getFirstImage(propiedad)" 
              :alt="`Propiedad en ${propiedad.ubicacion}`" 
              class="property-image"
              @error="handleImageError"
            />
            
            <div class="property-details">
              <div class="detail-row">
                <span class="detail-label">Precio:</span>
                <span class="detail-value">
                  {{ formatPrice(propiedad.tipo === 'venta' ? propiedad.precioVenta : propiedad.precioAlquiler) }}
                </span>
              </div>
              
              <div class="detail-row">
                <div class="detail-item">
                  <span class="detail-label">Hab:</span>
                  <span class="detail-value">{{ propiedad.habitaciones ?? '-' }}</span>
                </div>
                
                <div class="detail-item">
                  <span class="detail-label">Baños:</span>
                  <span class="detail-value">{{ propiedad.banos ?? '-' }}</span>
                </div>
                
                <div class="detail-item">
                  <span class="detail-label">m²:</span>
                  <span class="detail-value">{{ propiedad.metrosCuadrados }}</span>
                </div>
              </div>
              
              <div v-if="propiedad.cochera" class="detail-row">
                <span class="detail-label">Cochera:</span>
                <span class="detail-value">{{ propiedad.cochera }}</span>
              </div>
            </div>
            
            <button class="view-details-button">Ver detalles</button>
          </div>
        </div>
        
        <div v-if="filteredProperties.length === 0" class="no-results">
          No se encontraron propiedades con los filtros seleccionados
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.search-section {
  background-color: #0a0f64;
  padding: 20px;
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.search-section h2 {
  margin: 0 0 15px 0;
  font-size: 1.5rem;
}

.search-fields {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  max-width: 1200px;
  margin: 0 auto;
}

.search-fields input, 
.search-fields select {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
}

.featured-properties {
  flex: 1;
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.featured-properties h2 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.8rem;
  border-bottom: 2px solid #0a0f64;
  padding-bottom: 10px;
}

.property-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
}

.property-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
}

.property-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
}

.property-header {
  padding: 15px;
  position: relative;
}

.property-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  color: white;
}

.property-badge.venta {
  background-color: #e74c3c;
}

.property-badge.alquiler {
  background-color: #3498db;
}

.featured-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  background-color: #f39c12;
  color: white;
}

.property-card h3 {
  margin: 10px 0 5px 0;
  font-size: 1.2rem;
  color: #333;
}

.property-type {
  font-style: italic;
  color: #666;
  font-size: 0.9rem;
  margin: 5px 0;
}

.property-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-bottom: 1px solid #eee;
}

.property-details {
  padding: 15px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  align-items: center;
}

.detail-item {
  display: flex;
  align-items: center;
}

.detail-label {
  font-size: 0.9rem;
  color: #666;
  margin-right: 5px;
}

.detail-value {
  font-weight: bold;
  color: #333;
  font-size: 1rem;
}

.view-details-button {
  margin: 15px;
  padding: 12px;
  background-color: #0a0f64;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.9rem;
}

.view-details-button:hover {
  background-color: #1a237e;
}

.loading, .no-results {
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #666;
}

@media (max-width: 768px) {
  .search-fields {
    grid-template-columns: 1fr;
  }
  
  .property-grid {
    grid-template-columns: 1fr;
  }
}
</style>