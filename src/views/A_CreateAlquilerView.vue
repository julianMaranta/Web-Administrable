<template>
  <div class="container">
    <A_Sidebar/>
    <div class="content">
      <div class="logo-container">
        <img src="" alt="Logo Inmobiliaria" class="logo-plataforma"/>
      </div>
      <br>   
      <br>
      <form @submit.prevent="createProperty">
        <div class="form-group">
          <label for="direccion">Dirección de la Propiedad</label>
          <input id="direccion" v-model="direccion" placeholder="Ej: Av. Corrientes 1234" />
        </div>

        <div class="form-group">
  <label for="ubicacion">Ubicación</label>
  <select id="ubicacion" v-model="ubicacion" required>
    <option value="">Seleccione una ubicación</option>
    
    <optgroup label="Zona Centro">
      <option value="La Plata (Casco Urbano)">La Plata (Casco Urbano)</option>
      <option value="Tolosa">Tolosa</option>
      <option value="Villa Elvira">Villa Elvira</option>
    </optgroup>
    
    <optgroup label="Barrios Residenciales">
      <option value="City Bell">City Bell</option>
      <option value="Manuel B. Gonnet">Manuel B. Gonnet</option>
      <option value="Villa Elisa">Villa Elisa</option>
    </optgroup>
    
    <optgroup label="Localidades Periféricas">
      <option value="Abasto">Abasto</option>
      <option value="Joaquín Gorina">Joaquín Gorina</option>
      <option value="Lisandro Olmos">Lisandro Olmos</option>
      <option value="Melchor Romero">Melchor Romero</option>
      <option value="Ringuelet">Ringuelet</option>
    </optgroup>
    
    <option value="Los Hornos">Los Hornos</option>
  </select>
</div>

        <div class="form-group">
  <label for="tipo-propiedad">Tipo de Propiedad</label>
  <select id="tipo-propiedad" v-model="tipoPropiedad" required>
    <option value="">Seleccione un tipo</option>
    <option value="Casa">Casa</option>
    <option value="Departamento">Departamento</option>
    <option value="PH">PH</option>
    <option value="Local Comercial">Local Comercial</option>
    <option value="Oficina">Oficina</option>
    <option value="Quinta">Quinta</option>
    <option value="Cochera">Cochera</option>
    <option value="Hotel">Hotel</option>
    <option value="Terreno">Terreno</option>
    <option value="Campo">Campo</option>
    <option value="Fondo de Comercio">Fondo de Comercio</option>
    <option value="Galpón">Galpón</option>
  </select>
</div>

<div class="form-group">
  <label for="precio-alquiler">Precio Alquiler ($)</label>
  <input id="precio-alquiler" v-model.number="precioAlquiler" type="number" placeholder="Ej: 150000" />
  <div class="checkbox-option">
    <input type="checkbox" id="en-dolares" v-model="enDolares">
    <label for="en-dolares">El precio está en dólares (USD)</label>
  </div>
</div>

        <div class="form-group">
  <label for="precio-expensas">Precio Expensas ($)</label>
  <input id="precio-expensas" v-model.number="precioExpensas" type="number" placeholder="Ej: 15000" />
  <div class="checkbox-option">
    <input type="checkbox" id="sin-expensas" v-model="sinExpensas" @change="handleExpensasChange">
    <label for="sin-expensas">Sin Expensas</label>
  </div>
</div>

        <div class="form-group">
          <label for="habitaciones">Cantidad de Habitaciones</label>
          <input id="habitaciones" v-model.number="habitaciones" type="number" placeholder="Ej: 3" />
        </div>

        <div class="form-group">
          <label for="ambientes">Cantidad de Ambientes</label>
          <input id="ambientes" v-model.number="ambientes" type="number" placeholder="Ej: 4" />
        </div>

        <div class="form-group">
          <label for="antiguedad">Antigüedad (años)</label>
          <input id="antiguedad" v-model.number="antiguedad" type="number" placeholder="Ej: 10" />
        </div>

        <div class="form-group">
          <label for="banos">Cantidad de Baños</label>
          <input id="banos" v-model.number="banos" type="number" placeholder="Ej: 2" />
        </div>

        <div class="form-group">
          <label for="cochera">Cochera</label>
          <select id="cochera" v-model="cochera">
            <option value="Si">Si</option>
            <option value="No">No</option>
          </select>
        </div>

        <div class="form-group">
          <label for="metros-cuadrados">Metros Cuadrados (m²)</label>
          <input id="metros-cuadrados" v-model.number="metrosCuadrados" type="number" placeholder="Ej: 80" />
        </div>

        <div class="form-group">
          <label for="map-link">Link de Google Maps</label>
          <input id="map-link" v-model="mapLink" placeholder="Pegue el link de Google Maps aquí" />
        </div>

        <div class="form-group">
          <label for="youtube-video-url">Link del Video de YouTube</label>
          <input v-model="youtubeVideoUrl" id="youtube-video-url" placeholder="Link del video de YouTube" />
        </div>

        <div class="form-group">
          <label for="descripcion">Descripción</label>
          <textarea id="descripcion" v-model="descripcion" placeholder="Describa la propiedad..." rows="4"></textarea>
        </div>

        <div class="form-group">
          <label for="imagenes">Imágenes de la Propiedad</label>
          <div class="image-links">
            <div v-for="(imagen, index) in imagenes" :key="index" class="image-link-item">
              <input v-model="imagenes[index].url" placeholder="URL de la imagen" />
              <input v-model="imagenes[index].descripcion" placeholder="Descripción de la imagen" />
              <button type="button" @click="removeImage(index)">Eliminar</button>
            </div>
            <button type="button" @click="addImage">Agregar Imagen</button>
          </div>
        </div>

        <button type="submit">Publicar Propiedad</button>
      </form>
    </div>

    <!-- Modal de Confirmación -->
    <div v-if="showConfirmationModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Propiedad Publicada Exitosamente</h2>
        <p>La propiedad ha sido creada y publicada exitosamente.</p>
        <button @click="redirectToAdmin">Volver al Panel</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import A_Sidebar from '../components/A_Sidebar.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();
const router = useRouter();

// Datos de la propiedad
const direccion = ref('');
const ubicacion = ref('');
const tipoPropiedad = ref('');
const precioAlquiler = ref(0);
const enDolares = ref(false); // Nueva ref para el checkbox
const precioExpensas = ref(0);
const sinExpensas = ref(false);
const habitaciones = ref(0);
const ambientes = ref(0);
const antiguedad = ref(0);
const banos = ref(0);
const cochera = ref('Si');
const metrosCuadrados = ref(0);
const mapLink = ref('');
const youtubeVideoUrl = ref('');
const descripcion = ref('');
const imagenes = ref([{ url: '', descripcion: '' }]);

const showConfirmationModal = ref(false);

const addImage = () => {
  imagenes.value.push({ url: '', descripcion: '' });
};

const removeImage = (index: number) => {
  imagenes.value.splice(index, 1);
};

const handleExpensasChange = () => {
  if (sinExpensas.value) {
    precioExpensas.value = 0;
  }
};

const createProperty = async () => {
  try {
    // Validaciones
    if (!direccion.value.trim()) {
      throw new Error('La dirección es obligatoria.');
    }
    if (!tipoPropiedad.value) {
      throw new Error('El tipo de propiedad es obligatorio.');
    }
    if (precioAlquiler.value <= 0) {
      throw new Error('El precio de alquiler debe ser mayor a cero.');
    }
    if (metrosCuadrados.value <= 0) {
      throw new Error('Los metros cuadrados deben ser mayores a cero.');
    }

    // Crear la propiedad
    const nuevaPropiedad = await client.models.PropiedadAlquiler.create({
      direccion: direccion.value,
      ubicacion: ubicacion.value,
      tipoPropiedad: tipoPropiedad.value,
      precioAlquiler: precioAlquiler.value,
      moneda: enDolares.value ? 'USD' : 'ARS', // Guardar la moneda
      precioExpensas: precioExpensas.value,
      habitaciones: habitaciones.value,
      ambientes: ambientes.value,
      antiguedad: antiguedad.value,
      banos: banos.value,
      cochera: cochera.value,
      metrosCuadrados: metrosCuadrados.value,
      mapLink: mapLink.value,
      youtubeVideoUrl: youtubeVideoUrl.value,
      descripcion: descripcion.value,
      imagenes: JSON.stringify(imagenes.value),
      estado: 'Disponible'
    });

    if (nuevaPropiedad.data) {
      showConfirmationModal.value = true;
    }
  } catch (error) {
    console.error('Error al crear la propiedad:', error);
    alert(error instanceof Error ? error.message : 'Ocurrió un error al crear la propiedad');
  }
};

const redirectToAdmin = () => {
  showConfirmationModal.value = false;
  router.push('/plataforma-administrador');
};
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
  margin: 0;
  padding: 0;
}

.container {
  display: flex;
}

.content {
  margin-left: 220px;
  padding: 20px;
  width: calc(100% - 220px);
  position: relative;
}

.content h1 {
  font-size: 28px;
  margin-bottom: 20px;
}

.logo-plataforma {
  width: 300px;
  padding: 5px;
}

.logo-container {
  text-align: left; 
  margin-bottom: 5px;
  width: 160px;
  height: auto;
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
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
  box-sizing: border-box;
}

.form-group textarea {
  resize: vertical;
}

.image-links {
  margin-top: 10px;
}

.image-link-item {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;
}

.image-link-item input {
  flex: 1;
}

.modal-overlay {
  text-align: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  text-align: center;
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 90%;
}

.modal-content h2 {
  margin-bottom: 20px;
  font-size: 22px;
  color: #2c3e50;
}

.modal-content p {
  margin-bottom: 20px;
  font-size: 16px;
  color: #34495e;
}

.modal-content button {
  font-size: 16px;
  padding: 10px 20px;
  margin-top: 20px;
  background-color: #0014ac;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.modal-content button:hover {
  background-color: #0014ac;
}

button[type="submit"],
button[type="button"] {
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #0014ac;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

button[type="submit"]:hover,
button[type="button"]:hover {
  background-color: #0014ac;
}

button[type="button"] {
  background-color: #0014ac;
}

button[type="button"]:hover {
  background-color: #0014ac;
}
.checkbox-option {
  display: flex;
  align-items: center;
  margin-top: 8px;
}

.checkbox-option input[type="checkbox"] {
  width: auto;
  margin-right: 8px;
}

.checkbox-option label {
  font-weight: normal;
  margin-bottom: 0;
}
</style>