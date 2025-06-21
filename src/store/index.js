// frontend/src/store/index.js
import { createStore } from 'vuex';
import auth from './modules/auth';
import book from './modules/book';
import publisher from './modules/publisher';
import borrow from './modules/borrow';
import author from './modules/author';

export default createStore({
  modules: {
    auth,
    book,
    publisher,
    borrow,
    author

  }
});