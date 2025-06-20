<template>
    <div class="register-form">
      <LoadingSpinner :show="loading" />
      
      <div class="card">
        <div class="card-header">
          <h4>Đăng ký tài khoản độc giả</h4>
        </div>
        <div class="card-body">
          <!-- Error Alert -->
          <div v-if="error" class="alert alert-danger alert-dismissible fade show mb-3" role="alert">
            {{ error }}
            <button type="button" class="btn-close" @click="clearError"></button>
          </div>
  
          <form @submit.prevent="handleSubmit" novalidate>
            <div class="mb-3">
              <label class="form-label">Mã độc giả <span class="text-danger">*</span></label>
              <input 
                type="text" 
                class="form-control"
                :class="{ 'is-invalid': errors.maDocGia }"
                v-model="formData.maDocGia"
                required
              >
              <div class="invalid-feedback" v-if="errors.maDocGia">
                {{ errors.maDocGia }}
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Họ <span class="text-danger">*</span></label>
              <input type="text" class="form-control" v-model="formData.hoLot" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Tên <span class="text-danger">*</span></label>
              <input type="text" class="form-control" v-model="formData.ten" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Ngày sinh <span class="text-danger">*</span></label>
              <input type="date" class="form-control" v-model="formData.ngaySinh" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Giới tính <span class="text-danger">*</span></label>
              <select class="form-select" v-model="formData.phai" required>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Địa chỉ <span class="text-danger">*</span></label>
              <input type="text" class="form-control" v-model="formData.diaChi" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Số điện thoại <span class="text-danger">*</span></label>
              <input type="tel" class="form-control" v-model="formData.dienThoai" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Email <span class="text-danger">*</span></label>
              <input 
                type="email" 
                class="form-control"
                :class="{ 'is-invalid': errors.email }"
                v-model="formData.email"
                required
              >
              <div class="invalid-feedback" v-if="errors.email">
                {{ errors.email }}
              </div>
            </div>
            <div class="mb-3 position-relative">
              <label class="form-label">Mật khẩu <span class="text-danger">*</span></label>
              <input 
                :type="showPassword ? 'text' : 'password'" 
                class="form-control"
                :class="{ 'is-invalid': errors.password }"
                v-model="formData.password"
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
              <div class="invalid-feedback" v-if="errors.password">
                {{ errors.password }}
              </div>
            </div>
            <div class="mb-3 position-relative">
              <label class="form-label">Xác nhận mật khẩu <span class="text-danger">*</span></label>
              <input 
                :type="showPassword ? 'text' : 'password'" 
                class="form-control"
                :class="{ 'is-invalid': errors.confirmPassword }"
                v-model="formData.confirmPassword"
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
              {{ loading ? 'Đang xử lý...' : 'Đăng ký' }}
            </button>
            <div class="card-footer text-center">
              <p class="mb-0">
                Đã có tài khoản? 
                <router-link to="/login" class="text-primary">Đăng nhập</router-link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import LoadingSpinner from '@/components/LoadingSpinner.vue';
  import { validateReaderForm } from '@/utils/validation';
  import { showError, showSuccess } from '@/utils/notifications';
  
  export default {
    name: 'RegisterForm',
    components: { LoadingSpinner },
    setup() {
      const store = useStore();
      const router = useRouter();
      const formData = ref({
        maDocGia: '',
        hoLot: '',
        ten: '',
        ngaySinh: '',
        phai: 'Nam',
        diaChi: '',
        dienThoai: '',
        email: '',
        password: '',
        confirmPassword: '' // Thêm trường xác nhận mật khẩu
      });
      const errors = ref({});
  
      const loading = computed(() => store.state.auth.loading);
      const error = computed(() => store.state.auth.error);
      const showPassword = ref(false); // Trạng thái hiển thị mật khẩu
  
      const validateForm = () => {
        const errors = {};
        if (!formData.value.maDocGia) {
          errors.maDocGia = 'Mã độc giả là bắt buộc';
        }
        if (!formData.value.hoLot) {
          errors.hoLot = 'Họ là bắt buộc';
        }
        if (!formData.value.ten) {
          errors.ten = 'Tên là bắt buộc';
        }
        if (!formData.value.ngaySinh) {
          errors.ngaySinh = 'Ngày sinh là bắt buộc';
        }
        if (!formData.value.phai) {
          errors.phai = 'Giới tính là bắt buộc';
        }
        if (!formData.value.diaChi) {
          errors.diaChi = 'Địa chỉ là bắt buộc';
        }
        if (!formData.value.dienThoai) {
          errors.dienThoai = 'Số điện thoại là bắt buộc';
        }
        if (!formData.value.email) {
          errors.email = 'Email là bắt buộc';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
          errors.email = 'Email không hợp lệ';
        }
        if (!formData.value.password) {
          errors.password = 'Mật khẩu là bắt buộc';
        } else if (formData.value.password.length < 5) {
          errors.password = 'Mật khẩu phải có ít nhất 5 ký tự';
        } else if (!/(?=.*[A-Za-z])(?=.*\d).+/.test(formData.value.password)) {
          errors.password = 'Mật khẩu phải chứa cả chữ và số';
        }
        if (!formData.value.confirmPassword) {
          errors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
        } else if (formData.value.confirmPassword !== formData.value.password) {
          errors.confirmPassword = 'Mật khẩu và xác nhận mật khẩu phải khớp';
        }
  
        return errors;
      };
  
      const handleSubmit = async () => {
        try {
          const { isValid, errors: validationErrors } = validateReaderForm(formData.value);
          if (!isValid) {
            errors.value = validationErrors;
            return;
          }
  
          await store.dispatch('auth/registerReader', formData.value);
          showSuccess('Đăng ký thành công');
          router.push('/reader');
        } catch (err) {
          showError(err);
        }
      };
  
      const clearError = () => {
        store.commit('auth/SET_ERROR', null);
      };
  
      const togglePasswordVisibility = () => {
        showPassword.value = !showPassword.value;
      };
  
      return {
        formData,
        loading,
        error,
        errors,
        handleSubmit,
        clearError,
        showPassword,
        togglePasswordVisibility
      };
    }
  };
  </script>
  
  <style scoped>
  .register-form {
    max-width: 500px;
    margin: 2rem auto;
  }
  .card-footer {
    background-color: transparent;
    border-top: 1px solid rgba(0,0,0,.125);
    padding: 1rem;
  }
  .position-relative .btn {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
  }
  </style>