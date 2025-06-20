<template>
    <div class="login-form">
      <LoadingSpinner :show="loading" />
  
      <div class="card">
        <div class="card-header">
          <h3 class="text-center">Quên Mật Khẩu</h3>
        </div>
  
        <div class="card-body">
          <div v-if="error" class="alert alert-danger alert-dismissible fade show mb-3" role="alert">
            {{ error }}
            <button type="button" class="btn-close" @click="clearError"></button>
          </div>
          <div v-if="message" class="alert alert-success alert-dismissible fade show mb-3" role="alert">
            {{ message }}
            <button type="button" class="btn-close" @click="clearMessage"></button>
          </div>
  
          <form @submit.prevent="requestPasswordReset" novalidate>
            <div class="mb-3">
              <label class="form-label">Email <span class="text-danger">*</span></label>
              <input
                type="email"
                class="form-control"
                :class="{ 'is-invalid': errors.email }"
                v-model="email"
                required
              >
              <div class="invalid-feedback" v-if="errors.email">
                {{ errors.email }}
              </div>
            </div>
            <div class="mb-3 position-relative">
              <label class="form-label">Mật khẩu mới <span class="text-danger">*</span></label>
              <input
                :type="showPassword ? 'text' : 'password'"
                class="form-control"
                :class="{ 'is-invalid': errors.newPassword }"
                v-model="newPassword"
                required
              >
              <button
                type="button"
                class="btn btn-outline-secondary position-absolute top-50 end-0 translate-middle-y me-2"
                @click="togglePasswordVisibility"
                style="z-index: 1;"
              >
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
              <div class="invalid-feedback" v-if="errors.newPassword">
                {{ errors.newPassword }}
              </div>
            </div>
            <div class="mb-3 position-relative">
              <label class="form-label">Xác nhận mật khẩu mới <span class="text-danger">*</span></label>
              <input
                :type="showPassword ? 'text' : 'password'"
                class="form-control"
                :class="{ 'is-invalid': errors.confirmPassword }"
                v-model="confirmPassword"
                required
              >
              <button
                type="button"
                class="btn btn-outline-secondary position-absolute top-50 end-0 translate-middle-y me-2"
                @click="togglePasswordVisibility"
                style="z-index: 1;"
              >
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
              <div class="invalid-feedback" v-if="errors.confirmPassword">
                {{ errors.confirmPassword }}
              </div>
            </div>
  
            <button type="submit" class="btn btn-primary w-100" :disabled="loading">
              {{ loading ? 'Đang gửi...' : 'Gửi yêu cầu' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import api from '@/services/api';
  import LoadingSpinner from '@/components/LoadingSpinner.vue';
  
  export default {
    name: 'ForgotPasswordForm',
    components: { LoadingSpinner },
    setup() {
      const email = ref('');
      const newPassword = ref('');
      const confirmPassword = ref('');
      const loading = ref(false);
      const errors = ref({});
      const error = ref('');
      const message = ref('');
      const router = useRouter();
      const showPassword = ref(false); // Trạng thái hiển thị mật khẩu
  
      const validateForm = () => {
        const errors = {};
        if (!email.value.trim()) {
            errors.email = 'Email là bắt buộc';
        } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
            errors.email = 'Email không hợp lệ';
        }
        if (!newPassword.value.trim()) {
            errors.newPassword = 'Mật khẩu mới là bắt buộc';
        } else if (newPassword.value.length < 5) {
            errors.newPassword = 'Mật khẩu phải có ít nhất 5 ký tự';
        } else if (!/(?=.*[A-Za-z])(?=.*\d).+/.test(newPassword.value)) {
            errors.newPassword = 'Mật khẩu phải chứa cả chữ và số';
        }
        if (!confirmPassword.value.trim()) {
            errors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
        } else if (confirmPassword.value !== newPassword.value) {
            errors.confirmPassword = 'Mật khẩu và xác nhận mật khẩu phải khớp';
        }
        return errors;
      };
  
      const requestPasswordReset = async () => {
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
          errors.value = validationErrors;
          return;
        }
  
        loading.value = true;
        try {
          await api.post('/auth/reader/password/request-reset', { email: email.value });
          localStorage.setItem('resetEmail', email.value); // Lưu email vào localStorage
          message.value = 'Email xác nhận đã được gửi. Vui lòng kiểm tra hộp thư.';
          setTimeout(() => router.push('/auth/reader/password/reset'), 2000); // Chuyển sau 2s
        } catch (err) {
          error.value = err.response?.data?.error || 'Có lỗi xảy ra';
        } finally {
          loading.value = false;
        }
      };
  
      const clearError = () => { error.value = ''; };
      const clearMessage = () => { message.value = ''; };
  
      const togglePasswordVisibility = () => {
        showPassword.value = !showPassword.value;
      };
  
      return { email, newPassword, confirmPassword, loading, errors, error, message, requestPasswordReset, clearError, clearMessage, showPassword, togglePasswordVisibility };
    }
  };
  </script>
  
  <style scoped>
  .login-form {
    max-width: 400px;
    margin: 2rem auto;
  }
  .position-relative .btn {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
  }
  </style>