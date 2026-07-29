import { useEffect, useRef, type RefObject } from 'react';

export function useFocusTrap(
  modalRef: RefObject<HTMLDivElement | null>,
  closeRef: RefObject<HTMLElement | null>,
  isActive: boolean,
  onClose: () => void,
  extraSelector?: string,
) {
  /* Callers pass an inline arrow, so onClose has a new identity on every
     render. Reading it through a ref keeps the effect from tearing down and
     re-running — which used to yank focus back to the close button and reset
     the scroll lock on every keystroke inside an open dialog. */
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!isActive) return;
    const selector = `a[href], button:not([disabled]), input:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])${extraSelector ? `, ${extraSelector}` : ''}`;
    const restoreTo = document.activeElement as HTMLElement | null;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current();
        return;
      }
      if (e.key === 'Tab' && modalRef.current) {
        /* offsetParent is null for display:none elements — without this the
           trap would try to focus the desktop nav that Tailwind hides on
           mobile, and the cycle would silently break. */
        const focusable = Array.from(modalRef.current.querySelectorAll<HTMLElement>(selector)).filter(
          (el) => el.offsetParent !== null,
        );
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
      /* send focus back where it came from, if that element is still around */
      if (restoreTo && document.contains(restoreTo)) restoreTo.focus();
    };
  }, [isActive, modalRef, closeRef, extraSelector]);
}
