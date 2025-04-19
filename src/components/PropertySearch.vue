<template>
  <div class="search-container">
    <div class="search-header">
      <h2>Buscar Propiedades</h2>
      <div class="operation-toggle">
        <button 
          @click="searchQuery.operacion = ''" 
          :class="{ active: searchQuery.operacion === '' }"
        >
          Todas
        </button>
        <button 
          @click="searchQuery.operacion = 'alquiler'" 
          :class="{ active: searchQuery.operacion === 'alquiler' }"
        >
          En Alquiler
        </button>
        <button 
          @click="searchQuery.operacion = 'venta'" 
          :class="{ active: searchQuery.operacion === 'venta' }"
        >
          En Venta
        </button>
      </div>
    </div>

    <form @submit.prevent="searchProperties" class="search-form">
      <div class="form-row">
        <div class="form-group">
          <label for="direccion">Dirección</label>
          <input 
            id="direccion" 
            v-model="searchQuery.direccion" 
            placeholder="Ej: Av. Corrientes 1234" 
          />
        </div>

        <div class="form-group">
          <label for="ubicacion">Ubicación</label>
          <select id="ubicacion" v-model="searchQuery.ubicacion">
            <option value="">Todas las ubicaciones</option>
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
          <select id="tipo-propiedad" v-model="searchQuery.tipoPropiedad">
            <option value="">Todos los tipos</option>
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
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Precio (USD)</label>
          <div class="range-inputs">
            <input 
              type="number" 
              v-model.number="searchQuery.precioMin" 
              placeholder="Mínimo" 
            />
            <span>a</span>
            <input 
              type="number" 
              v-model.number="searchQuery.precioMax" 
              placeholder="Máximo" 
            />
          </div>
        </div>

        <div class="form-group">
          <label>Metros Cuadrados (m²)</label>
          <div class="range-inputs">
            <input 
              type="number" 
              v-model.number="searchQuery.metrosMin" 
              placeholder="Mínimo" 
            />
            <span>a</span>
            <input 
              type="number" 
              v-model.number="searchQuery.metrosMax" 
              placeholder="Máximo" 
            />
          </div>
        </div>

        <div class="form-group">
          <label for="habitaciones">Habitaciones</label>
          <input 
            id="habitaciones" 
            type="number" 
            v-model.number="searchQuery.habitaciones" 
            placeholder="Cualquier cantidad" 
          />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="banos">Baños</label>
          <input 
            id="banos" 
            type="number" 
            v-model.number="searchQuery.banos" 
            placeholder="Cualquier cantidad" 
          />
        </div>

        <div class="form-group">
          <label for="cochera">Cochera</label>
          <select id="cochera" v-model="searchQuery.cochera">
            <option value="">Indiferente</option>
            <option value="Si">Sí</option>
            <option value="No">No</option>
          </select>
        </div>

        <div class="form-group">
          <label for="antiguedad">Antigüedad Máxima (años)</label>
          <input 
            id="antiguedad" 
            type="number" 
            v-model.number="searchQuery.antiguedadMax" 
            placeholder="Sin límite" 
          />
        </div>
      </div>

      <div class="form-actions">
        <button type="button" @click="resetFilters" class="secondary-button">
          Limpiar Filtros
        </button>
        <button type="submit" class="primary-button">
          Buscar Propiedades
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

const emit = defineEmits(['search']);

const searchQuery = reactive({
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

const searchProperties = () => {
  emit('search', { ...searchQuery });
};

const resetFilters = () => {
  searchQuery.operacion = '';
  searchQuery.direccion = '';
  searchQuery.ubicacion = '';
  searchQuery.tipoPropiedad = '';
  searchQuery.precioMin = null;
  searchQuery.precioMax = null;
  searchQuery.habitaciones = null;
  searchQuery.banos = null;
  searchQuery.cochera = '';
  searchQuery.metrosMin = null;
  searchQuery.metrosMax = null;
  searchQuery.antiguedadMax = null;
  emit('search', { ...searchQuery });
};
</script>

<style scoped>
.search-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 32px;
}

.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.search-header h2 {
  font-size: 1.5rem;
  color: #333;
  margin: 0;
}

.operation-toggle {
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #ddd;
}

.operation-toggle button {
  padding: 8px 16px;
  border: none;
  background: #f5f5f5;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.operation-toggle button.active {
  background: #0a0f64;
  color: white;
}

.search-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 8px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input,
.form-group select {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
}

.range-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.range-inputs input {
  flex: 1;
  min-width: 0;
}

.range-inputs span {
  color: #777;
  font-size: 0.9rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}

.primary-button {
  background: #0a0f64;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s;
}

.primary-button:hover {
  background: #1a237e;
}

.secondary-button {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.secondary-button:hover {
  background: #e9e9e9;
}

@media (max-width: 768px) {
  .search-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .operation-toggle {
    width: 100%;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .primary-button,
  .secondary-button {
    width: 100%;
  }
}
</style>