<template>
    <div class="user-profile">
      <h2>Thông tin cá nhân</h2>
      <div v-if="loading" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Đang tải...</span>
        </div>
      </div>
      <div v-else-if="error" class="alert alert-danger" role="alert">
        {{ error }}
      </div>
      <div v-else class="profile-details">
        <form @submit.prevent="handleUpdateProfile" class="needs-validation" novalidate>
          <div class="mb-3">
            <label for="hoLot" class="form-label">Họ lót <span class="text-danger">*</span></label>
            <input 
              type="text" 
              class="form-control" 
              id="hoLot" 
              v-model="userProfile.hoLot"
              :class="{ 'is-invalid': errors.hoLot }"
              required
            >
            <div class="invalid-feedback" v-if="errors.hoLot">{{ errors.hoLot }}</div>
          </div>
  
          <div class="mb-3">
            <label for="ten" class="form-label">Tên <span class="text-danger">*</span></label>
            <input 
              type="text" 
              class="form-control" 
              id="ten" 
              v-model="userProfile.ten"
              :class="{ 'is-invalid': errors.ten }"
              required
            >
            <div class="invalid-feedback" v-if="errors.ten">{{ errors.ten }}</div>
          </div>
  
          <div class="mb-3">
            <label for="ngaySinh" class="form-label">Ngày sinh</label>
            <input 
              type="date" 
              class="form-control" 
              id="ngaySinh" 
              v-model="userProfile.ngaySinh"
              :class="{ 'is-invalid': errors.ngaySinh }"
            >
            <div class="invalid-feedback" v-if="errors.ngaySinh">{{ errors.ngaySinh }}</div>
          </div>
  
          <div class="mb-3">
            <label for="phai" class="form-label">Giới tính</label>
            <select 
              class="form-select" 
              id="phai" 
              v-model="userProfile.phai"
              :class="{ 'is-invalid': errors.phai }"
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
            <div class="invalid-feedback" v-if="errors.phai">{{ errors.phai }}</div>
          </div>
  
          <div class="mb-3">
            <label for="diaChi" class="form-label">Địa chỉ</label>
            <input 
              type="text" 
              class="form-control" 
              id="diaChi" 
              v-model="userProfile.diaChi"
              :class="{ 'is-invalid': errors.diaChi }"
            >
            <div class="invalid-feedback" v-if="errors.diaChi">{{ errors.diaChi }}</div>
          </div>
  
          <div class="mb-3">
            <label for="dienThoai" class="form-label">Số điện thoại</label>
            <input 
              type="text" 
              class="form-control" 
              id="dienThoai" 
              v-model="userProfile.dienThoai"
              :class="{ 'is-invalid': errors.dienThoai }"
            >
            <div class="invalid-feedback" v-if="errors.dienThoai">{{ errors.dienThoai }}</div>
          </div>
  
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input 
              type="email" 
              class="form-control" 
              id="email" 
              v-model="userProfile.email"
              :class="{ 'is-invalid': errors.email }"
            >
            <div class="invalid-feedback" v-if="errors.email">{{ errors.email }}</div>
        
          <br>
          <div class="mb-3">
          <router-link to="/forgot-password" class="text-primary">Quên mật khẩu? Nhấn vào đây để đổi mật khẩu.</router-link>
          </div>
          <br>
            <div v-if="message" class="alert alert-success alert-dismissible fade show mb-3" role="alert">
            {{ message }}
            <button type="button" class="btn-close" @click="clearMessage"></button>
          </div>
          </div>
  
          <div class="text-end">
            <button type="button" class="btn btn-secondary me-2" @click="cancelUpdate">Hủy</button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? 'Đang lưu...' : 'Cập nhật thông tin' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import { showError, showSuccess } from '@/utils/notifications';
  import { useRouter } from 'vue-router';
  
  
  export default {
    name: 'UserProfile',
    setup() {
      const store = useStore();
      const userProfile = ref({
        hoLot: '',
        ten: '',
        ngaySinh: '',
        phai: 'Nam',
        diaChi: '',
        dienThoai: '',
        email: ''
      });

      const router = useRouter(); //
      const errors = ref({});
      const loading = ref(false);
      const error = ref(null); //
      const message = ref(''); //
      
       

      // Hàm chuyển đổi định dạng ISO sang yyyy-MM-dd
    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      return dateStr.split('T')[0]; // Lấy phần yyyy-MM-dd
    };
  
    const fetchProfile = async () => {
    try {
        loading.value = true;
        error.value = null;
        const response = await store.dispatch('auth/updateProfile', {}); // Gọi để lấy profile
        userProfile.value = { 
        ...response.data,
        ngaySinh: formatDate(response.data.ngaySinh) // Chuyển đổi định dạng ngày
        };
    } catch (err) {
        error.value = err.message || 'Không thể tải thông tin cá nhân';
        showError(error.value);
    } finally {
        loading.value = false;
    }
    };
    const validateForm = () => {
      const newErrors = {};
      if (!userProfile.value.hoLot) newErrors.hoLot = 'Họ lót là bắt buộc';
      if (!userProfile.value.ten) newErrors.ten = 'Tên là bắt buộc';
      if (userProfile.value.ngaySinh && isNaN(new Date(userProfile.value.ngaySinh))) {
            newErrors.ngaySinh = 'Ngày sinh không hợp lệ';
       }
        if (!userProfile.value.dienThoai.match(/^\d{10}$/)) {
            newErrors.dienThoai = 'Số điện thoại phải gồm 10 chữ số';
        }
      if (userProfile.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userProfile.value.email)) {
        newErrors.email = 'Email không hợp lệ';
      }

      errors.value = newErrors;
      return Object.keys(newErrors).length === 0;
    };
  
    const handleUpdateProfile = async () => {
        if (!validateForm()) return;
    try {
        loading.value = true;
        error.value = null;
        const allowedFields = ['hoLot', 'ten', 'ngaySinh', 'phai', 'diaChi', 'dienThoai', 'email'];
        const updateData = Object.fromEntries(
        Object.entries(userProfile.value).filter(([key]) => allowedFields.includes(key))
        );
        // Chuyển đổi lại ngaySinh về ISO nếu cần, nhưng để server xử lý định dạng
        console.log('Sending update data:', updateData); // Debug
        const response = await store.dispatch('auth/updateProfile', updateData);
        userProfile.value = { 
          ...response.data,
          ngaySinh: formatDate(response.data.ngaySinh) // Đảm bảo định dạng sau khi cập nhật
        };
        showSuccess(response.data.message || 'Cập nhật thông tin thành công');
        message.value = 'Cập nhật thông tin thành công';
        
    } catch (err) {
        error.value = err.message || 'Cập nhật thông tin thất bại';
        errors.value = err.response?.data?.errors || {};
        console.error('Update profile error:', err.response?.data || err.message); // Debug
        showError(error.value);
        message.value = 'Cập nhật thông tin thất bại';
        
    } finally {
        loading.value = false;
    }
    };

    const clearError = () => {
        store.commit('publisher/SET_ERROR', null); //
      };
      const clearMessage = () => { message.value = ''; };
    
  
      const cancelUpdate = () => {
        fetchProfile(); // Lấy lại dữ liệu gốc khi hủy
      };
  
      onMounted(fetchProfile);
  
      return {
        userProfile,
        errors,
        loading,
        error,
        clearError, //
        clearMessage, //
        message, //
        handleUpdateProfile,
        cancelUpdate
      };
    }
  };
  </script>
  
  <style scoped>
  .user-profile {
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 8px;
  }
  
  .profile-details {
    max-width: 600px;
    margin: 0 auto;
  }
  
  .form-label .text-danger {
    color: #dc3545;
  }
  
  .invalid-feedback {
    display: block;
  }
  </style>