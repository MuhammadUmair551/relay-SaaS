import { useForm }               from 'react-hook-form';
import { zodResolver }           from '@hookform/resolvers/zod';
import { z }                     from 'zod';
import { X, ArrowRight }         from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectStore }       from '../../store/useProjectStore';
import Input                     from '../ui/Input';

const schema = z.object({
  name:        z.string().min(2, 'Project name must contain 2 characters'),
  clientName:  z.string().min(2, 'Client name required'),
  clientEmail: z.string().email('Enter valid email address'),
  budget:      z.coerce.number().positive('Budget cant be 0'),
  dueDate:     z.string().min(1, 'Select due date'),
  description: z.string().optional(),
});

export default function CreateProjectModal({ isOpen, onClose, onCreated }) {
  const addProject = useProjectStore(s => s.addProject);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(data) {
    await new Promise(r => setTimeout(r, 500));
    const id = addProject(data);
    reset();
    onClose();
    onCreated?.(id);
  }

  function handleClose() {
    reset();
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 z-40 bg-olive-900/40 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-50 flex items-center
            justify-center p-4 pointer-events-none">

            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{ opacity: 0,  scale: 0.96, y: 12  }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="pointer-events-auto w-full max-w-md
                bg-surface rounded-3xl shadow-panel
                flex flex-col
                max-h-[90vh]" 
            >
              <div className="flex items-center justify-between
                px-7 pt-6 pb-5 border-b border-border flex-shrink-0">
                <div>
                  <h2 className="font-display font-bold text-olive-900 text-base">
                    New Project
                  </h2>
                  <p className="text-xs text-muted mt-0.5">
                    Fill in the details below
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full border border-border
                    flex items-center justify-center text-muted
                    hover:text-olive-900 hover:border-olive-300
                    transition-all duration-150"
                >
                  <X size={14} />
                </button>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex-1 overflow-y-auto px-7 py-5 space-y-4"
              >
                <Input
                  label="Project Name"
                  placeholder="Website Redesign"
                  required
                  error={errors.name?.message}
                  {...register('name')}
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Client Name"
                    placeholder="Ahmad Enterprises"
                    required
                    error={errors.clientName?.message}
                    {...register('clientName')}
                  />
                  <Input
                    label="Client Email"
                    type="email"
                    placeholder="client@email.com"
                    required
                    error={errors.clientEmail?.message}
                    {...register('clientEmail')}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Budget ($)"
                    type="number"
                    placeholder="1200"
                    required
                    error={errors.budget?.message}
                    {...register('budget')}
                  />
                  <Input
                    label="Due Date"
                    type="date"
                    required
                    error={errors.dueDate?.message}
                    {...register('dueDate')}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-olive-900
                    uppercase tracking-nav">
                    Description{' '}
                    <span className="text-subtle normal-case font-normal">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    placeholder="Brief about the project..."
                    rows={3}
                    className="w-full px-5 py-3 rounded-2xl border border-border
                      bg-cream text-sm text-olive-900 placeholder:text-subtle
                      outline-none resize-none
                      focus:border-olive-700 focus:ring-2 focus:ring-olive-100
                      transition-all duration-150"
                    {...register('description')}
                  />
                </div>

                <div className="flex items-start gap-2.5 px-4 py-3
                  rounded-2xl bg-olive-100 border border-olive-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-olive-500
                    mt-1.5 flex-shrink-0" />
                  <p className="text-xs text-olive-700 leading-relaxed">
                    5 default milestones will be added automatically.
                  </p>
                </div>

                {/* Submit — bottom of form */}
                <div className="pt-1 pb-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-full bg-olive-900 text-cream
                      text-xs font-bold uppercase tracking-nav
                      hover:bg-olive-700 active:scale-[0.99]
                      transition-all duration-150
                      disabled:opacity-60 disabled:cursor-not-allowed
                      flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2
                          border-cream/30 border-t-cream animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        Create Project
                        <ArrowRight size={13} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}