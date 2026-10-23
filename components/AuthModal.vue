<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Затемнение -->
    <div class="absolute inset-0 bg-black/50" @click="closeModal"></div>
    
    <!-- Модальное окно -->
    <div class="relative bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
      <button 
        @click="closeModal"
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      
      <div class="text-center mb-6">
        <div class="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-800">Требуется авторизация</h2>
        <p class="text-gray-600 mt-2">Чтобы продолжить, пожалуйста, войдите в аккаунт</p>
      </div>
      
      <div class="space-y-3">
        <button
          @click="goToLogin"
          class="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-secondary-600 to-primary-600 hover:from-secondary-700 hover:to-primary-700 transition-all duration-300"
        >
          Войти в аккаунт
        </button>
        
        <button
          @click="goToRegister"
          class="w-full py-3 rounded-xl text-primary-600 font-semibold border-2 border-primary-600 hover:bg-primary-50 transition-all duration-300"
        >
          Зарегистрироваться
        </button>
        
        <button
          @click="closeModal"
          class="w-full py-3 rounded-xl text-gray-500 font-semibold hover:bg-gray-50 transition-all duration-300"
        >
          Отмена
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false)
const router = useRouter()

const openModal = () => {
  isOpen.value = true
}

const closeModal = () => {
  isOpen.value = false
}

const goToLogin = () => {
  closeModal()
  router.push('/auth/login')
}

const goToRegister = () => {
  closeModal()
  router.push('/auth/register')
}

defineExpose({ openModal, closeModal })
</script>