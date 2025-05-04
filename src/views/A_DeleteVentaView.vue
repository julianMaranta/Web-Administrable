<template>
  <div class="container">
    <A_Sidebar/>
    <div class="content">
      <div class="logo-container">
        <img src="" alt="Logo Inmobiliaria" class="logo-plataforma"/>
      </div>
      <br>   
      <br>
    
      <div v-if="loading" class="loading">Cargando propiedades...</div>
      <div v-else>
        <div v-for="propiedad in propiedades" :key="propiedad.id">
          <div class="property-item" @click="selectProperty(propiedad.id)">
            <h3>{{ propiedad.direccion }}</h3>
            <div class="property-details">
              <span><strong>Tipo:</strong> {{ propiedad.tipoPropiedad }}</span>
              <span><strong>Precio:</strong> ${{ propiedad.precioVenta?.toLocaleString() }}</span>
              <span><strong>Estado:</strong> {{ propiedad.estado }}</span>
            </div>
          </div>
          
          <div v-if="selectedPropertyId === propiedad.id" class="property-actions">
            <h2>Eliminar Propiedad</h2>
            <div class="property-full-details">
              <p><strong>Dirección:</strong> {{ propiedad.direccion }}</p>
              <p><strong>Ambientes:</strong> {{ propiedad.ambientes }}</p>
              <p><strong>Habitaciones:</strong> {{ propiedad.habitaciones }}</p>
              <p><strong>Baños:</strong> {{ propiedad.banos }}</p>
              <p><strong>Metros Cuadrados:</strong> {{ propiedad.metrosCuadrados }} m²</p>
            </div>
            <button @click="showModal = true" class="delete-button">
              Eliminar Propiedad
            </button>
          </div>
        </div>
      </div>

      <!-- Modal de confirmación -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
          <h2>Confirmar Eliminación</h2>
          <p>¿Estás seguro de eliminar la siguiente propiedad?</p>
          <div class="property-to-delete">
            <h3>{{ propiedadSeleccionada?.direccion }}</h3>
            <p>Tipo: {{ propiedadSeleccionada?.tipoPropiedad }}</p>
            <p>Precio: ${{ propiedadSeleccionada?.precioVenta?.toLocaleString() }}</p>
          </div>
          <div class="modal-buttons">
            <button @click="confirmDelete" class="confirm-button">Confirmar</button>
            <button @click="cancelDelete" class="cancel-button">Cancelar</button>
          </div>
        </div>
      </div>

      <!-- Modal de éxito -->
      <div v-if="showSuccessModal" class="modal-overlay">
        <div class="modal-content success-modal">
          <h2>Propiedad Eliminada</h2>
          <p>La propiedad ha sido eliminada correctamente.</p>
          <button @click="redirectToAdmin" class="success-button">
            Volver al Panel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import A_Sidebar from '../components/A_Sidebar.vue';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();
const router = useRouter();

// Interface y datos
interface Propiedad {
  id: string;
  direccion: string;
  tipoPropiedad: string;
  precioVenta: number;
  ambientes?: number;
  habitaciones?: number;
  banos?: number;
  metrosCuadrados?: number;
  estado?: string;
}

const propiedades = ref<Propiedad[]>([]);
const loading = ref(true);
const selectedPropertyId = ref<string | null>(null);
const showModal = ref(false);
const showSuccessModal = ref(false);

// Computed
const propiedadSeleccionada = computed(() => {
  return propiedades.value.find(p => p.id === selectedPropertyId.value);
});

// Métodos
const loadProperties = async () => {
  try {
    const response = await client.models.PropiedadVenta.list();
    propiedades.value = (response.data || []).map(prop => ({
      id: prop.id,
      direccion: prop.direccion,
      tipoPropiedad: prop.tipoPropiedad,
      precioVenta: prop.precioVenta,
      ambientes: prop.ambientes ?? undefined,
      habitaciones: prop.habitaciones ?? undefined,
      banos: prop.banos ?? undefined,
      metrosCuadrados: prop.metrosCuadrados ?? undefined,
      estado: prop.estado ?? undefined
    }));
  } catch (error) {
    console.error('Error al cargar propiedades:', error);
  } finally {
    loading.value = false;
  }
};

const selectProperty = (id: string) => {
  selectedPropertyId.value = id;
};

const deleteProperty = async () => {
  try {
    if (!selectedPropertyId.value) return;
    await client.models.PropiedadVenta.delete({ id: selectedPropertyId.value });
    propiedades.value = propiedades.value.filter(p => p.id !== selectedPropertyId.value);
    selectedPropertyId.value = null;
    showSuccessModal.value = true;
  } catch (error) {
    console.error('Error al eliminar propiedad:', error);
  }
};

const confirmDelete = () => {
  showModal.value = false;
  deleteProperty();
};

const cancelDelete = () => {
  showModal.value = false;
};

const redirectToAdmin = () => {
  showSuccessModal.value = false;
  router.push('/plataforma-administrador');
};

// Ciclo de vida
onMounted(() => {
  loadProperties();
});
</script>

<style scoped>
/* Estilos se mantienen igual que en la versión anterior */
.container {
  display: flex;
  min-height: 100vh;
}

.content {
  margin-left: 220px;
  padding: 20px;
  width: calc(100% - 220px);
}

.logo-plataforma {
  width: 250px;
  margin-bottom: 20px;
}

.property-item {
  background: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.property-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.property-details {
  display: flex;
  gap: 15px;
  margin-top: 8px;
  color: #555;
}

.property-actions {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-top: 10px;
}

.property-full-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin: 15px 0;
}

.delete-button {
  background: #e74c3c;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.delete-button:hover {
  background: #c0392b;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 10px;
  padding: 25px;
  width: 90%;
  max-width: 500px;
}

.property-to-delete {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  margin: 15px 0;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.confirm-button {
  background: #e74c3c;
  color: white;
}

.cancel-button {
  background: #3498db;
  color: white;
}

.success-modal {
  text-align: center;
}

.success-button {
  background: #2ecc71;
  color: white;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

button:hover {
  opacity: 0.9;
}

.loading {
  text-align: center;
  padding: 30px;
  color: #555;
}
</style>