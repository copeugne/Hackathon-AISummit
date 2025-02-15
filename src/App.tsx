import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import { FormProvider, useForm } from './context/FormContext';
import { InitialScreen } from './components/InitialScreen';
import { TriageForm } from './components/TriageForm';

function AppContent() {
  const { state } = useForm();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-red-600">SwiftDispatch</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {state.step === 1 && <InitialScreen />}
            {state.step === 2 && <TriageForm />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function App() {
  return (
    <FormProvider>
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#DC2626',
            color: 'white',
          },
          className: 'bg-red-600 text-white',
          success: {
            icon: '✓',
            iconTheme: {
              primary: 'white',
              secondary: '#DC2626',
            },
          },
        }}
      />
      <AppContent />
    </FormProvider>
  );
}

export default App;