import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Video, Stethoscope } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from '../context/FormContext';
import { cn } from '../lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  waitTimes: {
    inPerson: {
      routine: number;
      urgent: number;
    };
    teleconsultation: number;
  };
  isRoutine: boolean;
}

export function Modal({ isOpen, onClose, waitTimes, isRoutine }: ModalProps) {
  const { dispatch } = useForm();

  const handleBooking = (type: 'in-person' | 'teleconsultation') => {
    toast.success(
      type === 'in-person'
        ? 'In-person appointment request submitted!'
        : 'Teleconsultation booking confirmed!'
    );
    onClose();
    dispatch({ type: 'SET_STEP', payload: 1 });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 mx-4">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  DocFlow Optimized Access
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-success/5 rounded-xl border-2 border-success/10">
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <Stethoscope className="w-5 h-5 text-success" strokeWidth={2.5} />
                    <p className="text-sm font-medium text-success">
                      In-Person Wait Time:
                    </p>
                  </div>
                  <p className="text-5xl font-extrabold tracking-tight text-success text-center">
                    {isRoutine ? waitTimes.inPerson.routine : waitTimes.inPerson.urgent} Days
                  </p>
                  {!isRoutine && (
                    <button
                      onClick={() => handleBooking('in-person')}
                      className={cn(
                        "mt-4 w-full flex items-center justify-center space-x-2",
                        "bg-success hover:bg-success-dark text-white",
                        "font-semibold py-3 px-6 rounded-xl",
                        "shadow-lg hover:shadow-xl transition-all"
                      )}
                    >
                      <Stethoscope className="w-4 h-4" />
                      <span>Book In-Person Appointment</span>
                    </button>
                  )}
                </div>

                {isRoutine && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-primary/5 rounded-xl border-2 border-primary/10"
                  >
                    <div className="flex items-center justify-center space-x-2 mb-3">
                      <Video className="w-5 h-5 text-primary" strokeWidth={2.5} />
                      <p className="text-sm font-medium text-primary">
                        Get Seen Even Faster: Teleconsultation Recommended
                      </p>
                    </div>
                    <p className="text-5xl font-extrabold tracking-tight text-primary text-center mb-3">
                      {waitTimes.teleconsultation} Days
                    </p>
                    <p className="text-sm text-gray-600 text-center">
                      Recommended for Routine Check-up. Significantly reduces wait time.
                    </p>
                    <button
                      onClick={() => handleBooking('teleconsultation')}
                      className={cn(
                        "mt-4 w-full flex items-center justify-center space-x-2",
                        "bg-primary hover:bg-primary-dark text-white",
                        "font-semibold py-3 px-6 rounded-xl",
                        "shadow-lg hover:shadow-xl transition-all"
                      )}
                    >
                      <Video className="w-4 h-4" />
                      <span>Book Teleconsultation</span>
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}