<template>
  <form class="user-register-form" @submit.prevent="submit">
    <h1 class="title">Registro de Usuario</h1>
    <div class="field-group">
      <label>Rol</label>
      <select v-model="form.role" required>
        <option value="renter">Inquilino</option>
        <option value="owner">Propietario</option>
      </select>
    </div>
    <div class="grid">
      <div class="field-group">
        <label>Nombre</label>
        <input v-model="form.firstName" required />
      </div>
      <div class="field-group">
        <label>Apellido</label>
        <input v-model="form.lastName" required />
      </div>
    </div>
    <div class="field-group">
      <label>Email</label>
      <input type="email" v-model="form.email" required />
    </div>
    <div class="field-group">
      <label>Contraseña</label>
      <div class="password-wrapper">
        <input 
          :type="showPassword ? 'text' : 'password'" 
          v-model="form.password" 
          required 
          minlength="8"
          placeholder="Mínimo 8 caracteres"
        />
        <button type="button" class="toggle-password" @click="showPassword = !showPassword">
          {{ showPassword ? '🙈' : '👁️' }}
        </button>
      </div>
    </div>
    <div class="field-group">
      <label>Confirmar Contraseña</label>
      <input 
        :type="showPassword ? 'text' : 'password'" 
        v-model="form.confirmPassword" 
        required 
        minlength="8"
      />
      <span v-if="form.confirmPassword && form.password !== form.confirmPassword" class="field-error">
        Las contraseñas no coinciden
      </span>
    </div>
    <div class="grid">
      <div class="field-group">
        <label>Teléfono</label>
        <input v-model="form.phone" placeholder="+51987654321" />
      </div>
      <div class="field-group">
        <label>DNI</label>
        <input v-model="form.dni" />
      </div>
    </div>
    <div class="field-group">
      <label>Licencia (si aplica)</label>
      <input v-model="form.licenseNumber" :required="form.role === 'renter' || form.role === 'owner'" />
    </div>
    <div class="field-group">
      <label>Dirección (opcional)</label>
      <input v-model="form.address" placeholder="Av. Example 123, Lima" />
    </div>
    <div class="actions">
      <button class="btn primary" :disabled="submitting || !isFormValid">
        {{ submitting ? 'Registrando...' : 'Registrar' }}
      </button>
    </div>
    <div v-if="error" class="alert error">{{ error }}</div>
    <div v-if="created" class="alert success">
      <i class="pi pi-check-circle"></i>
      ¡Usuario creado exitosamente! Redirigiendo...
    </div>
    <div class="login-link">
      ¿Ya tienes cuenta? <router-link to="/auth/login">Iniciar sesión</router-link>
    </div>
  </form>
</template>
<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../application/user.store.js'

const router = useRouter()

const form = reactive({
  role: 'renter',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  dni: '',
  licenseNumber: '',
  address: ''
})

const submitting = ref(false)
const error = ref(null)
const created = ref(null)
const showPassword = ref(false)

// Validación del formulario
const isFormValid = computed(() => {
  return form.firstName && 
         form.lastName && 
         form.email && 
         form.password && 
         form.password.length >= 8 &&
         form.password === form.confirmPassword
})

async function submit() {
  // Validar que las contraseñas coincidan
  if (form.password !== form.confirmPassword) {
    error.value = 'Las contraseñas no coinciden'
    return
  }
  
  if (form.password.length < 8) {
    error.value = 'La contraseña debe tener al menos 8 caracteres'
    return
  }
  
  error.value = null
  created.value = null
  submitting.value = true
  
  try {
    // Usar la función register del store que llama a /auth/register
    const user = await register({
      role: form.role,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email.toLowerCase().trim(),
      password: form.password,
      phone: form.phone || null,
      dni: form.dni || null,
      licenseNumber: form.licenseNumber || null,
      address: form.address || null
    })
    
    created.value = user
    
    // Redirigir según el rol después de 1.5 segundos
    setTimeout(() => {
      if (user.role === 'renter') {
        router.push('/rental/browse')
      } else if (user.role === 'owner') {
        router.push('/rental/my-vehicles')
      } else {
        router.push('/dashboard')
      }
    }, 1500)
  } catch (e) { 
    error.value = e.message || 'Error al registrar usuario'
  } finally { 
    submitting.value = false 
  }
}
</script>
<style scoped>
.user-register-form { max-width:520px; margin:0 auto; display:grid; gap:1rem; background:#fff; padding:1.5rem 1.75rem 2rem; border:1px solid #e0e0e0; border-radius:16px; }
.title { margin:0 0 .25rem; font-size:1.4rem; }
.field-group { display:flex; flex-direction:column; gap:.35rem; }
.field-group label { font-size:.75rem; text-transform:uppercase; letter-spacing:.5px; font-weight:600; color:#37474f; }
input, select { border:1px solid #cfd8dc; border-radius:8px; padding:.55rem .7rem; font-size:.85rem; background:#fafafa; }
input:focus, select:focus { outline:2px solid #3f51b5; outline-offset:2px; background:#fff; }
.password-wrapper { position: relative; display: flex; }
.password-wrapper input { flex: 1; padding-right: 2.5rem; }
.toggle-password { position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 1rem; padding: 0.25rem; }
.field-error { color: #c62828; font-size: 0.75rem; margin-top: 0.25rem; }
.grid { display:grid; gap:.85rem; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); }
.actions { display:flex; justify-content:flex-end; margin-top: 0.5rem; }
.btn { border:none; background:#607d8b; color:#fff; padding:.6rem 1.1rem; border-radius:8px; cursor:pointer; font-weight:500; transition: all 0.2s; }
.btn.primary { background:#3f51b5; }
.btn.primary:hover:not(:disabled) { background:#303f9f; transform: translateY(-1px); }
.btn:disabled { opacity:.6; cursor:default; }
.alert { padding:.6rem .9rem; border-radius:8px; font-size:.75rem; }
.alert.error { background:#ffebee; color:#c62828; }
.alert.success { background:#e8f5e9; color:#2e7d32; display: flex; align-items: center; gap: 0.5rem; }
.login-link { text-align: center; font-size: 0.85rem; color: #666; margin-top: 0.5rem; }
.login-link a { color: #3f51b5; text-decoration: none; font-weight: 600; }
.login-link a:hover { text-decoration: underline; }
</style>

