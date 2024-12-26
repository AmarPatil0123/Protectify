import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import tabReducer from '../features/tabs/tabSlice';

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  tabs: tabReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PURGE'], 
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };
