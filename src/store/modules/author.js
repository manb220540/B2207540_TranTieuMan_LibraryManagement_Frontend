import api from '@/services/api';

export default {
  namespaced: true,
  state: {
    authors: [],
    loading: false,
    error: null
  },
  mutations: {
    SET_AUTHORS(state, authors) {
      state.authors = authors;
    },
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_ERROR(state, error) {
      state.error = error;
    }
  },
  actions: {
    async fetchAuthors({ commit }) {
      try {
        commit('SET_LOADING', true);
        const response = await api.get('/tacgia');
        console.log('API response:', response.data); // the bug
        commit('SET_AUTHORS', response.data);
      } catch (error) {
        commit('SET_ERROR', error.message);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async createAuthor({ commit }, authorData) {
      try {
        const response = await api.post('/tacgia', authorData);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      }
    },
    async updateAuthor({ commit }, { id, authorData }) {
      try {
        const response = await api.put(`/tacgia/${id}`, authorData);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      }
    },
    async deleteAuthor({ commit }, id) {
      try {
        await api.delete(`/tacgia/${id}`);
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      }
    }
  },
  getters: {
    allAuthors: state => state.authors,
    isLoading: state => state.loading,
    error: state => state.error
  }
};
