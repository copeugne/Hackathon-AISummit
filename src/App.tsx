import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import { FormProvider } from './context/FormContext';
import { TriageForm } from './components/TriageForm';

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-samu">SwiftDispatch</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto py-8">
        <TriageForm />
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
            background: '#003399',
            color: 'white',
          },
          className: 'bg-samu text-white',
          success: {
            icon: '✓',
            iconTheme: {
              primary: 'white',
              secondary: '#003399',
            },
          },
        }}
      />
      <AppContent />
    </FormProvider>
  );
}

export default App;