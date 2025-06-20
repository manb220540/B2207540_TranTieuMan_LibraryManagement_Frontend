<template>
    <div class="login-form">
      <LoadingSpinner :show="loading" />
  
      <div class="card">
        <div class="card-header">
          <h3 class="text-center">Xác Nhận Đổi Mật Khẩu</h3>
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
  
          <form @submit.prevent="confirmPasswordReset" novalidate>
            <div class="mb-3">
              <label class="form-label">Email <span class="text-danger">*</span></label>
              <input
                type="email"
                class="form-control"
                v-model="email"
                required
                disabled
              >
            </div>
            <div class="mb-3">
              <label class="form-label">Mã xác nhận (OTP) <span class="text-danger">*</span></label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.otp }"
                v-model="otp"
                required
              >
              <div class="invalid-feedback" v-if="errors.otp">
                {{ errors.otp }}
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
              {{ loading ? 'Đang xử lý...' : 'Xác nhận' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import api from '@/services/api';
  import LoadingSpinner from '@/components/LoadingSpinner.vue';
  
  export default {
    name: 'ConfirmPasswordForm',
    components: { LoadingSpinner },
    setup() {
      const email = ref('');
      const otp = ref('');
      const newPassword = ref('');
      const loading = ref(false);
      const errors = ref({});
      const error = ref('');
      const message = ref('');
      const router = useRouter();
      const showPassword = ref(false); // Trạng thái hiển thị mật khẩu
      const confirmPassword = ref(''); // Thêm trường xác nhận mật khẩu
  
      // Lấy email từ localStorage khi component được mount
      onMounted(() => {
        const savedEmail = localStorage.getItem('resetEmail');
        if (savedEmail) {
          email.value = savedEmail;
        } else {
          error.value = 'Không tìm thấy email. Vui lòng thử lại từ trang quên mật khẩu.';
        }
      });
  
      const validateForm = () => {
        const errors = {};
        if (!otp.value.trim()) {
          errors.otp = 'Mã xác nhận là bắt buộc';
        }
        if (!newPassword.value.trim()) {
            errors.newPassword = 'Mật khẩu mới là bắt buộc';
        } else if (newPassword.value.length < 5) {
            errors.newPassword = 'Mật khẩu phải có ít nhất 5 ký tự';
        } else if (!/(?=.*[A-Za-z])(?=.*\d).+/.test(newPassword.value)) {
            errors.newPassword = 'Mật khẩu phải chứa cả chữ và số';
        }if (!confirmPassword.value.trim()) {
            errors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
        } else if (confirmPassword.value !== newPassword.value) {
            errors.confirmPassword = 'Mật khẩu mới và xác nhận mật khẩu phải giống nhau';
        }
        return errors;
      };
  
      const confirmPasswordReset = async () => {
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
          errors.value = validationErrors;
          return;
        }
  
        loading.value = true;
        try {
          await api.post('/auth/reader/password/reset', { email: email.value, otp: otp.value, newPassword: newPassword.value });
          message.value = 'Đổi mật khẩu thành công. Đang chuyển đến trang đăng nhập...';
          localStorage.removeItem('resetEmail'); // Xóa email sau khi thành công
          setTimeout(() => router.push('/login'), 2000); // Chuyển sau 2s
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
  
      return { email, otp, newPassword, loading, errors, error, message, confirmPasswordReset, clearError, clearMessage, showPassword, togglePasswordVisibility };
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