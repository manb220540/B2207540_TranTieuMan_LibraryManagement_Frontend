import api from '@/services/api'; // Import đối tượng API dùng để gọi các endpoint từ backend

export default {
  namespaced: true, // Bật chế độ namespaced để module độc lập, tránh trùng tên mutation/action
  
  // ----------- STATE ----------- //
  state: {
    books: [],     // Danh sách các cuốn sách
    loading: false, // Trạng thái đang tải dữ liệu
    error: null     // Lỗi nếu có khi gọi API
  },

  // ----------- MUTATIONS ----------- //
  mutations: {
    // Cập nhật danh sách sách vào state
    SET_BOOKS(state, books) {
      state.books = books;
    },

    // Cập nhật trạng thái loading
    SET_LOADING(state, status) {
      state.loading = status;
    },

    // Cập nhật thông báo lỗi
    SET_ERROR(state, error) {
      state.error = error;
    }
  },

  // ----------- ACTIONS ----------- //
  actions: {
    // Lấy danh sách tất cả sách từ API
    async fetchBooks({ commit }) {
      try {
        commit('SET_LOADING', true); // Bắt đầu tải dữ liệu
        const response = await api.get('/sach'); // Gọi API lấy danh sách sách
        console.log('API response:', response.data); // Log dữ liệu để debug
        commit('SET_BOOKS', response.data); // Cập nhật state với dữ liệu nhận được
      } catch (error) {
        commit('SET_ERROR', error.message); // Ghi nhận lỗi nếu có
      } finally {
        commit('SET_LOADING', false); // Dừng trạng thái loading dù thành công hay lỗi
      }
    },

    // Tạo mới một cuốn sách
    async createBook({ commit }, bookData) {
      try {
        const response = await api.post('/sach', bookData); // Gửi dữ liệu sách mới lên server
        return response.data; // Trả về kết quả cho component sử dụng
      } catch (error) {
        commit('SET_ERROR', error.message); // Lưu lỗi vào state
        throw error; // Ném lỗi để component xử lý tiếp nếu cần
      }
    },

    // Cập nhật thông tin sách
    async updateBook({ commit }, { id, bookData }) {
      try {
        const response = await api.put(`/sach/${id}`, bookData); // Gửi dữ liệu cập nhật sách theo ID
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      }
    },

    // Xóa một cuốn sách
    async deleteBook({ commit }, id) {
      try {
        await api.delete(`/sach/${id}`); // Gửi yêu cầu xóa sách theo ID
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      }
    }
  },

  // ----------- GETTERS ----------- //
  getters: {
    allBooks: state => state.books,      // Lấy danh sách tất cả sách
    isLoading: state => state.loading,   // Lấy trạng thái loading
    error: state => state.error          // Lấy lỗi hiện tại
  }
};
