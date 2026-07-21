import { useEffect, type RefObject } from 'react';

export function useFocusTrap(
  modalRef: RefObject<HTMLDivElement | null>,
  closeRef: RefObject<HTMLElement | null>,
  isActive: boolean,
  onClose: () => void,
  extraSelector?: string,
) {
  useEffect(() => {
    if (!isActive) return;
    const selector = `a[href], button:not([disabled]), input:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])${extraSelector ? `, ${extraSelector}` : ''}`;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(selector);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isActive, onClose, modalRef, closeRef, extraSelector]);
}
