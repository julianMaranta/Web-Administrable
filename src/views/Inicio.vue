<template>
  <div class="page-container">
    <Header />

    <PropertySearch @search="handleSearch" />

    <main class="featured-properties">
      <div v-if="loading" class="loading">Cargando propiedades...</div>
      
      <div v-else>
        <h2>Propiedades Disponibles ({{ propiedadesMostradas.length }})</h2>
        
        <div class="property-grid">
          <div v-for="propiedad in propiedadesMostradas" :key="propiedad.id" class="property-card">
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
                  <span class="detail-value">{{ propiedad.metrosCuadrados ?? '-' }}</span>
                </div>
              </div>
              
              <div v-if="propiedad.cochera" class="detail-row">
                <span class="detail-label">Cochera:</span>
                <span class="detail-value">{{ propiedad.cochera }}</span>
              </div>
            </div>
            
            <button 
    class="view-details-button"
    @click="viewPropertyDetails(propiedad)"
  >
    Ver detalles
  </button>
          </div>
        </div>
        
        <div v-if="propiedadesMostradas.length === 0" class="no-results">
          No se encontraron propiedades con los filtros seleccionados
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import '@/assets/main.css';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import PropertySearch from '@/components/PropertySearch.vue';
import { ref, onMounted, reactive, computed } from 'vue';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { useRouter } from 'vue-router';

const router = useRouter();

const client = generateClient<Schema>();

type PropiedadVenta = Awaited<ReturnType<typeof client.models.PropiedadVenta.list>>['data'][number];
type PropiedadAlquiler = Awaited<ReturnType<typeof client.models.PropiedadAlquiler.list>>['data'][number];

// Todas las propiedades sin filtrar
const allPropiedadesVenta = ref<PropiedadVenta[]>([]);
const allPropiedadesAlquiler = ref<PropiedadAlquiler[]>([]);

// Propiedades filtradas
const filteredPropiedadesVenta = ref<PropiedadVenta[]>([]);
const filteredPropiedadesAlquiler = ref<PropiedadAlquiler[]>([]);

const loading = ref(true);
const searchParams = reactive({
  operacion: '',
  direccion: '',
  ubicacion: '',
  tipoPropiedad: '',
  precioMin: null as number | null,
  precioMax: null as number | null,
  habitaciones: null as number | null,
  banos: null as number | null,
  cochera: '',
  metrosMin: null as number | null,
  metrosMax: null as number | null,
  antiguedadMax: null as number | null
});

// Cargar todas las propiedades al inicio
const loadAllProperties = async () => {
  try {
    loading.value = true;
    
    const [ventaResponse, alquilerResponse] = await Promise.all([
      client.models.PropiedadVenta.list(),
      client.models.PropiedadAlquiler.list()
    ]);
    
    allPropiedadesVenta.value = ventaResponse.data || [];
    allPropiedadesAlquiler.value = alquilerResponse.data || [];
    
    // Al inicio, mostrar todas las propiedades
    filteredPropiedadesVenta.value = [...allPropiedadesVenta.value];
    filteredPropiedadesAlquiler.value = [...allPropiedadesAlquiler.value];
    
  } catch (error) {
    console.error('Error al cargar propiedades:', error);
  } finally {
    loading.value = false;
  }
};

const filterProperties = () => {
  // Si no hay filtros activos, mostrar todo
  if (Object.values(searchParams).every(val => 
    val === null || val === '' || val === undefined
  )) {
    filteredPropiedadesVenta.value = [...allPropiedadesVenta.value];
    filteredPropiedadesAlquiler.value = [...allPropiedadesAlquiler.value];
    return;
  }

  const filterFn = (prop: PropiedadVenta | PropiedadAlquiler, tipo: 'venta' | 'alquiler') => {
    // Verificar tipo de operación
    if (searchParams.operacion && searchParams.operacion !== tipo) return false;
    
    // Verificar campos de texto
    if (searchParams.direccion && !prop.direccion?.toLowerCase().includes(searchParams.direccion.toLowerCase())) {
      return false;
    }
    if (searchParams.ubicacion && !prop.ubicacion?.toLowerCase().includes(searchParams.ubicacion.toLowerCase())) {
      return false;
    }
    if (searchParams.tipoPropiedad && !prop.tipoPropiedad?.toLowerCase().includes(searchParams.tipoPropiedad.toLowerCase())) {
      return false;
    }
    
    // Verificar precio
    const precio = tipo === 'venta' 
      ? (prop as PropiedadVenta).precioVenta 
      : (prop as PropiedadAlquiler).precioAlquiler;
      
    if (searchParams.precioMin !== null && (precio ?? 0) < searchParams.precioMin) return false;
    if (searchParams.precioMax !== null && (precio ?? 0) > searchParams.precioMax) return false;
    
    // Verificar otros campos numéricos
    if (searchParams.habitaciones !== null && prop.habitaciones !== searchParams.habitaciones) return false;
    if (searchParams.banos !== null && prop.banos !== searchParams.banos) return false;
    if (searchParams.cochera && prop.cochera !== searchParams.cochera) return false;
    if (searchParams.metrosMin !== null && (prop.metrosCuadrados ?? 0) < searchParams.metrosMin) return false;
    if (searchParams.metrosMax !== null && (prop.metrosCuadrados ?? 0) > searchParams.metrosMax) return false;
    if (searchParams.antiguedadMax !== null && (prop.antiguedad ?? 0) > searchParams.antiguedadMax) return false;
    
    return true;
  };

  filteredPropiedadesVenta.value = allPropiedadesVenta.value.filter(prop => filterFn(prop, 'venta'));
  filteredPropiedadesAlquiler.value = allPropiedadesAlquiler.value.filter(prop => filterFn(prop, 'alquiler'));
};

const handleSearch = (params: typeof searchParams) => {
  Object.assign(searchParams, params);
  filterProperties();
};

const propiedadesMostradas = computed(() => {
  const ventas = filteredPropiedadesVenta.value.map(p => ({ ...p, tipo: 'venta' as const }));
  const alquileres = filteredPropiedadesAlquiler.value.map(p => ({ ...p, tipo: 'alquiler' as const }));
  
  if (searchParams.operacion === 'alquiler') return alquileres;
  if (searchParams.operacion === 'venta') return ventas;
  
  return [...ventas, ...alquileres];
});

const getFirstImage = (prop: PropiedadVenta | PropiedadAlquiler) => {
  try {
    if (prop.imagenes) {
      const imagenes = typeof prop.imagenes === 'string' ? JSON.parse(prop.imagenes) : prop.imagenes;
      return imagenes[0]?.url || '';
    }
  } catch (e) {
    console.error('Error al procesar imágenes:', e);
  }
  return '';
};

const formatPrice = (price?: number | null) => {
  return price ? '$' + price.toLocaleString('es-AR') : 'Consultar';
};

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement | null;
  if (target) {
    target.src = '';
  }
};

const viewPropertyDetails = (propiedad: any) => {
  router.push({
    name: 'property-detail',
    params: { 
      id: propiedad.id,
      type: propiedad.tipo
    }
  });
};


onMounted(() => {
  loadAllProperties();
});
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.featured-properties {
  padding: 20px;
  flex: 1;
}

.property-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.property-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s;
}

.property-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
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
  background-color: #0a0f64;
}

.property-badge.alquiler {
  background-color: #4CAF50;
}

.featured-badge {
  display: inline-block;
  background-color: #FFC107;
  color: #333;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 5px;
}

.property-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.property-details {
  padding: 15px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.detail-label {
  font-size: 12px;
  color: #666;
}

.detail-value {
  font-weight: bold;
}

.view-details-button {
  width: 100%;
  padding: 10px;
  background-color: #0a0f64;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.view-details-button:hover {
  background-color: #1a237e;
}

.loading, .no-results {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
}

.property-type {
  color: #666;
  font-style: italic;
  margin-top: 5px;
}

h2 {
  color: #0a0f64;
  margin-bottom: 20px;
}
</style>