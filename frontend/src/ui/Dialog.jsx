import React, { Fragment, useState } from 'react';
import { Dialog as HeadlessDialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';

const DialogContext = React.createContext({
  open: false,
  setOpen: () => {},
});

export function Dialog({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({ children, asChild = false }) {
  const { setOpen } = React.useContext(DialogContext);
  
  if (asChild) {
    return React.cloneElement(children, {
      onClick: () => setOpen(true),
    });
  }
  return <span onClick={() => setOpen(true)}>{children}</span>;
}

export function DialogContent({ children, className = "" }) {
  const { open, setOpen } = React.useContext(DialogContext);

  return (
    <Transition appear show={open} as={Fragment}>
      <HeadlessDialog as="div" className="relative z-50" onClose={() => setOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <HeadlessDialog.Panel 
                className={`
                  w-full max-w-md transform overflow-hidden rounded-2xl 
                  bg-white p-6 text-left align-middle shadow-xl transition-all
                  ${className}
                `}
              >
                <button
                  onClick={() => setOpen(false)}
                  className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background 
                    transition-opacity hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </button>
                {children}
              </HeadlessDialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </HeadlessDialog>
    </Transition>
  );
}

export function DialogHeader({ className = "", ...props }) {
  return (
    <div 
      className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`} 
      {...props} 
    />
  );
}

export function DialogTitle({ className = "", ...props }) {
  return (
    <HeadlessDialog.Title
      className={`text-lg font-semibold leading-none tracking-tight ${className}`}
      {...props}
    />
  );
} 