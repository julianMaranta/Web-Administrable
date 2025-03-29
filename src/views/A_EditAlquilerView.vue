<template>
  <div class="container">
    <A_Sidebar />
    <div class="content">
      <div class="logo-container">
        <img src="@/assets/logo-inmobiliaria.png" alt="Logo Inmobiliaria" class="logo-plataforma" />
      </div>
      <br />
      <br />

      <div v-if="loading" class="loading">Cargando propiedades...</div>
      <div v-else>
        <div v-for="propiedad in propiedades" :key="propiedad.id">
          <div class="property-item" @click="selectProperty(propiedad.id)">
            <h3>{{ propiedad.direccion }}</h3>
            <p>Tipo: {{ propiedad.tipoPropiedad }}</p>
            <p>Precio: ${{ propiedad.precioAlquiler }}</p>
          </div>
          
          <!-- Formulario de edición -->
          <div v-if="selectedPropertyId === propiedad.id">
            <h2>Editar Propiedad</h2>
            <form @submit.prevent="showModal = true">
              <div class="form-group">
                <label for="direccion">Dirección</label>
                <input id="direccion" v-model="direccion" placeholder="Ej: Av. Corrientes 1234" />
              </div>

              <div class="form-group">
                <label for="tipo-propiedad">Tipo de Propiedad</label>
                <select id="tipo-propiedad" v-model="tipoPropiedad">
                  <option value="Casa">Casa</option>
                  <option value="Departamento">Departamento</option>
                  <option value="Local Comercial">Local Comercial</option>
                  <option value="PH">PH</option>
                </select>
              </div>

              <div class="form-group">
                <label for="precio-alquiler">Precio Alquiler ($)</label>
                <input id="precio-alquiler" v-model.number="precioAlquiler" type="number" />
              </div>

              <div class="form-group">
                <label for="precio-expensas">Precio Expensas ($)</label>
                <input id="precio-expensas" v-model.number="precioExpensas" type="number" />
              </div>

              <div class="form-group">
                <label for="habitaciones">Habitaciones</label>
                <input id="habitaciones" v-model.number="habitaciones" type="number" />
              </div>

              <div class="form-group">
                <label for="banos">Baños</label>
                <input id="banos" v-model.number="banos" type="number" />
              </div>

              <div class="form-group">
                <label for="cochera">Cochera</label>
                <select id="cochera" v-model="cochera">
                  <option value="Si">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div class="form-group">
                <label for="metros">Metros Cuadrados</label>
                <input id="metros" v-model.number="metrosCuadrados" type="number" />
              </div>

              <div class="form-group">
                <label for="map-link">Link Google Maps</label>
                <input id="map-link" v-model="mapLink" placeholder="URL de Google Maps" />
              </div>

              <div class="form-group">
                <label for="descripcion">Descripción</label>
                <textarea id="descripcion" v-model="descripcion" rows="4"></textarea>
              </div>

              <!-- Imágenes de la propiedad -->
              <div v-for="(imagen, index) in imagenes" :key="index" class="form-group">
                <label>Imagen {{ index + 1 }}</label>
                <input v-model="imagen.url" placeholder="URL de la imagen" />
                <input v-model="imagen.descripcion" placeholder="Descripción" />
                <button type="button" @click="removeImage(index)">Eliminar</button>
              </div>
              <button type="button" @click="addImage">Agregar Imagen</button>

              <button type="submit">Actualizar Propiedad</button>
            </form>
          </div>
        </div>
      </div>

      <!-- Modal de confirmación -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
          <h2>Confirmar cambios</h2>
          <p>¿Estás seguro de que deseas actualizar esta propiedad?</p>
          <button @click="confirmEdit">Sí, actualizar</button>
          <button @click="cancelEdit">Cancelar</button>
        </div>
      </div>

      <!-- Modal de éxito -->
      <div v-if="showSuccessModal" class="modal-overlay">
        <div class="modal-content">
          <h2>¡Actualización exitosa!</h2>
          <p>La propiedad ha sido actualizada correctamente.</p>
          <button @click="redirectToAdmin">Volver al panel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import A_Sidebar from '../components/A_Sidebar.vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();
const router = useRouter();

// Datos de las propiedades
const propiedades = ref<any[]>([]);
const loading = ref(true);
const selectedPropertyId = ref<string | null>(null);

// Campos editables
const direccion = ref('');
const tipoPropiedad = ref('');
const precioAlquiler = ref(0);
const precioExpensas = ref(0);
const habitaciones = ref(0);
const banos = ref(0);
const cochera = ref('Si');
const metrosCuadrados = ref(0);
const mapLink = ref('');
const descripcion = ref('');
const imagenes = ref<{url: string, descripcion: string}[]>([]);

// Modales
const showModal = ref(false);
const showSuccessModal = ref(false);

// Cargar propiedades
const loadProperties = async () => {
  try {
    const response = await client.models.PropiedadAlquiler.list();
    propiedades.value = response.data || [];
  } catch (error) {
    console.error('Error al cargar propiedades:', error);
  } finally {
    loading.value = false;
  }
};

// Seleccionar propiedad para editar
const selectProperty = async (id: string) => {
  selectedPropertyId.value = id;
  await loadPropertyData(id);
};

// Cargar datos de una propiedad específica
const loadPropertyData = async (id: string) => {
  try {
    const response = await client.models.PropiedadAlquiler.get({ id });
    if (response.data) {
      const propiedad = response.data;
      direccion.value = propiedad.direccion;
      tipoPropiedad.value = propiedad.tipoPropiedad || '';
      precioAlquiler.value = propiedad.precioAlquiler || 0;
      precioExpensas.value = propiedad.precioExpensas || 0;
      habitaciones.value = propiedad.habitaciones || 0;
      banos.value = propiedad.banos || 0;
      cochera.value = propiedad.cochera || 'No';
      metrosCuadrados.value = propiedad.metrosCuadrados || 0;
      mapLink.value = propiedad.mapLink || '';
      descripcion.value = propiedad.descripcion || '';
      imagenes.value = propiedad.imagenes ? JSON.parse(propiedad.imagenes) : [];
    }
  } catch (error) {
    console.error('Error al cargar datos de la propiedad:', error);
  }
};

// Manejo de imágenes
const addImage = () => {
  imagenes.value.push({ url: '', descripcion: '' });
};

const removeImage = (index: number) => {
  imagenes.value.splice(index, 1);
};

// Actualizar propiedad
const updateProperty = async () => {
  try {
    if (!selectedPropertyId.value) return;

    await client.models.PropiedadAlquiler.update({
      id: selectedPropertyId.value,
      direccion: direccion.value,
      tipoPropiedad: tipoPropiedad.value,
      precioAlquiler: precioAlquiler.value,
      precioExpensas: precioExpensas.value,
      habitaciones: habitaciones.value,
      banos: banos.value,
      cochera: cochera.value,
      metrosCuadrados: metrosCuadrados.value,
      mapLink: mapLink.value,
      descripcion: descripcion.value,
      imagenes: JSON.stringify(imagenes.value)
    });

    showModal.value = false;
    showSuccessModal.value = true;
  } catch (error) {
    console.error('Error al actualizar la propiedad:', error);
  }
};

const confirmEdit = () => {
  updateProperty();
};

const cancelEdit = () => {
  showModal.value = false;
};

const redirectToAdmin = () => {
  showSuccessModal.value = false;
  router.push('/panel-inmobiliario');
};

onMounted(() => {
  loadProperties();
});
</script>

<style scoped>
/* Estilos similares a los del ejemplo original */
.property-item {
  padding: 15px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  cursor: pointer;
  transition: background-color 0.3s;
}

.property-item:hover {
  background-color: #f5f5f5;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
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
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
}

button {
  padding: 8px 16px;
  margin: 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>