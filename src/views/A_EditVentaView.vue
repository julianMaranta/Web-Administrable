<template>
  <div class="container">
    <A_Sidebar />
    <div class="content">
      <div class="logo-container">
        <img src="@/assets/Logo NUEVO Maranta-2.png" alt="Logo Inmobiliaria" class="logo-plataforma" />
      </div>
      <br>   
      <br>

      <div v-if="loading" class="loading">Cargando propiedades...</div>
      <div v-else>
        <!-- Listado de propiedades en venta -->
        <div v-for="propiedad in propiedades" :key="propiedad.id" class="property-list-item">
          <div class="property-item" @click="selectProperty(propiedad.id)">
            <h3>{{ propiedad.direccion }}</h3>
            <div class="property-details">
              <span><strong>Tipo:</strong> {{ propiedad.tipoPropiedad }}</span>
              <span><strong>Precio:</strong> ${{ propiedad.precioVenta?.toLocaleString() }}</span>
              <span><strong>Ubicación:</strong> {{ propiedad.ubicacion }}</span>
            </div>
          </div>
          
          <!-- Formulario de edición -->
          <div v-if="selectedPropertyId === propiedad.id" class="property-edit-form">
            <h2>Editar Propiedad en Venta</h2>
            <form @submit.prevent="showModal = true" class="edit-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="direccion">Dirección</label>
                  <input id="direccion" v-model="formData.direccion" required />
                </div>

                <div class="form-group">
                  <label for="ubicacion">Ubicación</label>
                  <select id="ubicacion" v-model="formData.ubicacion" required>
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
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="tipo-propiedad">Tipo de Propiedad</label>
                  <select id="tipo-propiedad" v-model="formData.tipoPropiedad" required>
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
    <label>Precio Venta</label>
    <div class="price-container">
      <input 
        id="precio-alquiler" 
        v-model.number="formData.precioVenta" 
        type="number" 
        min="0"
        :placeholder="formData.moneda === 'ARS' ? 'Ej: 150000' : 'Ej: 150'"
        class="price-input"
        required
      />
      <div class="currency-options">
        <label class="currency-option">
          <input 
            type="radio" 
            v-model="formData.moneda" 
            value="ARS" 
          />
          ARS
        </label>
        <label class="currency-option">
          <input 
            type="radio" 
            v-model="formData.moneda" 
            value="USD" 
          />
          USD
        </label>
      </div>
    </div>
  </div>

  <div class="form-group">
    <label for="precio-expensas">Precio Expensas (ARS)</label>
    <input 
      id="precio-expensas" 
      v-model.number="formData.precioExpensas" 
      type="number" 
      min="0" 
      placeholder="Ej: 15000"
    />
    <div class="checkbox-option">
      <input type="checkbox" id="sin-expensas" v-model="sinExpensas" @change="handleExpensasChange">
      <label for="sin-expensas">Sin Expensas</label>
    </div>
  </div>

                
              </div>

              

              
                <div class="form-group">
                  <label for="metros">Metros Cuadrados</label>
                  <input id="metros" v-model.number="formData.metrosCuadrados" type="number" min="0" />
                </div>

              <!-- Sección de características -->
              <div class="form-section-title">Características</div>

              <div class="form-row">
                <div class="form-group">
                  <label for="habitaciones">Habitaciones</label>
                  <input id="habitaciones" v-model.number="formData.habitaciones" type="number" min="0" />
                </div>

                <div class="form-group">
                  <label for="banos">Baños</label>
                  <input id="banos" v-model.number="formData.banos" type="number" min="0" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="ambientes">Ambientes</label>
                  <input id="ambientes" v-model.number="formData.ambientes" type="number" min="0" />
                </div>

                <div class="form-group">
                  <label for="antiguedad">Antigüedad (años)</label>
                  <input id="antiguedad" v-model.number="formData.antiguedad" type="number" min="0" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="metros">Metros Cuadrados</label>
                  <input id="metros" v-model.number="formData.metrosCuadrados" type="number" min="0" />
                </div>

                <div class="form-group">
                  <label for="cochera">Cochera</label>
                  <select id="cochera" v-model="formData.cochera">
                    <option value="Si">Sí</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

              <!-- Sección de información adicional -->
              <div class="form-section-title">Información Adicional</div>

              <div class="form-group">
                <label for="descripcion">Descripción</label>
                <textarea id="descripcion" v-model="formData.descripcion" rows="4"></textarea>
              </div>

              <div class="form-group">
                <label for="map-link">Link Google Maps</label>
                <input id="map-link" v-model="formData.mapLink" placeholder="URL de Google Maps" />
              </div>

              <div class="form-group">
                <label for="youtube-video-url">Link del Video de YouTube</label>
                <input v-model="formData.youtubeVideoUrl" id="youtube-video-url" placeholder="Link del video de YouTube" />
              </div>

              <!-- Gestión de imágenes -->
              <div class="images-section">
                <h3>Imágenes de la propiedad</h3>
                <div v-for="(imagen, index) in formData.imagenes" :key="index" class="image-item">
                  <div class="form-group">
                    <label>URL Imagen {{ index + 1 }}</label>
                    <input v-model="imagen.url" placeholder="URL de la imagen" />
                  </div>
                  <div class="form-group">
                    <label>Descripción</label>
                    <input v-model="imagen.descripcion" placeholder="Descripción de la imagen" />
                  </div>
                  <button type="button" @click="removeImage(index)" class="remove-image-btn">
                    Eliminar
                  </button>
                </div>
                <button type="button" @click="addImage" class="add-image-btn">
                  Agregar Imagen
                </button>
              </div>

              <div class="form-actions">
                <button type="submit" class="update-button">Actualizar Propiedad</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Modal de confirmación -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
          <h2>Confirmar cambios</h2>
          <p>¿Estás seguro de que deseas actualizar esta propiedad en venta?</p>
          <div class="modal-buttons">
            <button @click="confirmEdit" class="confirm-button">Sí, actualizar</button>
            <button @click="cancelEdit" class="cancel-button">Cancelar</button>
          </div>
        </div>
      </div>

      <!-- Modal de éxito -->
      <div v-if="showSuccessModal" class="modal-overlay">
        <div class="modal-content success-modal">
          <h2>¡Actualización exitosa!</h2>
          <p>La propiedad en venta ha sido actualizada correctamente.</p>
          <button @click="redirectToAdmin" class="success-button">
            Volver al panel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import A_Sidebar from '../components/A_Sidebar.vue';
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();
const router = useRouter();

// Datos reactivos
const propiedades = ref<any[]>([]);
const loading = ref(true);
const selectedPropertyId = ref<string | null>(null);
const showModal = ref(false);
const showSuccessModal = ref(false);
const errorMessage = ref<string>('');

// Formulario de edición
const formData = reactive({
  direccion: '',
  ubicacion: '',
  tipoPropiedad: '',
  precioVenta: 0,
  moneda: 'ARS', // Nuevo campo para la moneda
  precioExpensas: 0,
  // Características
  habitaciones: 0,
  banos: 0,
  ambientes: 0,
  antiguedad: 0,
  cochera: 'No',
  metrosCuadrados: 0,
  mapLink: '',
  youtubeVideoUrl: '',
  descripcion: '',
  imagenes: [] as {url: string, descripcion: string}[]
});

const sinExpensas = ref(false);

const handleExpensasChange = () => {
  if (sinExpensas.value) {
    formData.precioExpensas = 0;
  }
};

const loadProperties = async () => {
  try {
    loading.value = true;
    errorMessage.value = '';
    
    // 1. Obtener todas las propiedades
    const { data: rawProperties, errors } = await client.models.PropiedadVenta.list();
    
    if (errors) {
      console.error('Errores al cargar propiedades:', errors);
      errorMessage.value = 'Error técnico al cargar propiedades';
      return;
    }

    // 2. Filtrar propiedades válidas
    propiedades.value = (rawProperties || [])
      .filter(prop => {
        // Verificar que la propiedad existe y tiene ID
        if (!prop || !prop.id) return false;
        
        // Validar que el campo moneda tenga un valor correcto
        const hasValidMoneda = prop.moneda && ['ARS', 'USD'].includes(prop.moneda);
        
        // Solo incluir si tiene moneda válida
        return hasValidMoneda;
      })
      .map(prop => ({
        ...prop,
        // Asegurar otros campos importantes
        tipoPropiedad: prop.tipoPropiedad || 'No especificado',
        imagenes: prop.imagenes ? safeJsonParse(prop.imagenes) : []
      }));

    // 3. Mostrar advertencia si se filtraron propiedades
    if (rawProperties?.length > 0 && propiedades.value.length < rawProperties.length) {
      const filteredCount = rawProperties.length - propiedades.value.length;
      console.warn(`Se filtraron ${filteredCount} propiedades por datos inválidos`);
      // Opcional: Mostrar advertencia al usuario
      errorMessage.value = `Advertencia: ${filteredCount} propiedades no cumplen los requisitos`;
    }

  } catch (error) {
    console.error('Error inesperado:', error);
    errorMessage.value = 'Error inesperado al cargar propiedades';
  } finally {
    loading.value = false;
  }
};

// Función auxiliar para parseo seguro de JSON
const safeJsonParse = (str: string) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    console.error('Error al parsear imágenes:', e);
    return [];
  }
};

const loadPropertyData = async (id: string) => {
  try {
    const { data: propiedad, errors } = await client.models.PropiedadVenta.get({ id });
    
    if (errors || !propiedad) {
      console.error('Error al cargar propiedad:', errors);
      // Mostrar mensaje al usuario
      return;
    }
    
    // Resetear el formulario con valores por defecto
    Object.assign(formData, {
      direccion: '',
      ubicacion: '',
      tipoPropiedad: '',
      precioAlquiler: 0,
      moneda: 'ARS', // Valor por defecto
      precioExpensas: 0,
      habitaciones: 0,
      banos: 0,
      cochera: 'No',
      metrosCuadrados: 0,
      mapLink: '',
      youtubeVideoUrl: '',
      descripcion: '',
      imagenes: []
    });
    
    // Llenar con datos existentes, usando valores por defecto donde sea necesario
    if (propiedad) {
      Object.assign(formData, {
        direccion: propiedad.direccion || '',
        ubicacion: propiedad.ubicacion || '',
        tipoPropiedad: propiedad.tipoPropiedad || '',
        precioVenta: propiedad.precioVenta || 0,
        moneda: propiedad.moneda || 'ARS', // Asegurar valor no nulo
        precioExpensas: propiedad.precioExpensas || 0,
        habitaciones: propiedad.habitaciones || 0,
        banos: propiedad.banos || 0,
        cochera: propiedad.cochera || 'No',
        metrosCuadrados: propiedad.metrosCuadrados || 0,
        mapLink: propiedad.mapLink || '',
        youtubeVideoUrl: propiedad.youtubeVideoUrl || '',
        descripcion: propiedad.descripcion || '',
        imagenes: propiedad.imagenes ? safeJsonParse(propiedad.imagenes) : []
      });
      
      sinExpensas.value = !propiedad.precioExpensas || propiedad.precioExpensas <= 0;
    }
    
  } catch (error) {
    console.error('Error al cargar datos de la propiedad:', error);
    // Mostrar mensaje de error al usuario
  }
};

// Seleccionar propiedad para editar
const selectProperty = async (id: string) => {
  selectedPropertyId.value = id;
  await loadPropertyData(id);
};



// Manejo de imágenes
const addImage = () => {
  formData.imagenes.push({ url: '', descripcion: '' });
};

const removeImage = (index: number) => {
  formData.imagenes.splice(index, 1);
};

// Actualizar propiedad
const updateProperty = async () => {
  try {
    if (!selectedPropertyId.value) return;

    await client.models.PropiedadVenta.update({
      id: selectedPropertyId.value,
      direccion: formData.direccion,
      ubicacion: formData.ubicacion,
      tipoPropiedad: formData.tipoPropiedad,
      precioVenta: formData.precioVenta,
      moneda: formData.moneda, // Guardar moneda
      precioExpensas: formData.precioExpensas,
      metrosCuadrados: formData.metrosCuadrados,
      // Características
      habitaciones: formData.habitaciones,
      banos: formData.banos,
      ambientes: formData.ambientes,
      antiguedad: formData.antiguedad,
      cochera: formData.cochera,
      
      mapLink: formData.mapLink,
      youtubeVideoUrl: formData.youtubeVideoUrl,
      descripcion: formData.descripcion,
      imagenes: JSON.stringify(formData.imagenes)
    });

    showModal.value = false;
    showSuccessModal.value = true;
    await loadProperties(); // Recargar la lista de propiedades
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
  router.push('/plataforma-administrador');
};

onMounted(() => {
  loadProperties();
});
</script>

<style scoped>
/* Estilos base consistentes con las otras vistas */
.container {
  display: flex;
  min-height: 100vh;
}

.content {
  margin-left: 220px;
  padding: 20px;
  width: calc(100% - 220px);
  position: relative;
}

.logo-plataforma {
  width: 500px;
  padding: 5px;
}

/* Estilos para el listado de propiedades */
.property-list-item {
  margin-bottom: 30px;
}

.property-item {
  background: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
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

.property-details span {
  display: flex;
  align-items: center;
}

/* Estilos para el formulario de edición */
.property-edit-form {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 25px;
  margin-top: 15px;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-section-title {
  font-size: 18px;
  font-weight: bold;
  margin: 20px 0 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid #0014ac;
  color: #0014ac;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-row .form-group {
  flex: 1;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

/* Estilos para la sección de imágenes */
.images-section {
  border-top: 1px solid #eee;
  padding-top: 20px;
  margin-top: 20px;
}

.image-item {
  background: white;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid #eee;
}

/* Estilos para botones */
.update-button {
  background-color: #0014ac;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: background-color 0.3s;
}

.update-button:hover {
  background-color: #0014ac;
}

.add-image-btn {
  background-color: #0014ac;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.remove-image-btn {
  background-color: #0014ac;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

/* Estilos para los modales */
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
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.success-modal {
  text-align: center;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.confirm-button {
  background-color: #0014ac;
  color: white;
}

.cancel-button {
  background-color: #0014ac;
  color: white;
}

.success-button {
  background-color: #0014ac;
  color: white;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.loading {
  text-align: center;
  padding: 30px;
  color: #555;
  font-size: 18px;
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
  color: #555;
  font-size: 14px;
}

@media screen and (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .content {
    margin-left: 0;
    width: 100%;
    padding: 15px;
  }
}
</style>