import { useEffect } from "react";

export default function CustomModal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md", // "sm" | "md" | "lg"
}) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", onKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizeClass =
    size === "sm" ? "max-w-md" : size === "lg" ? "max-w-3xl" : "max-w-xl";

  const modalTitle = title ?? "Modal";

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        onClick={(e) => {
          e.stopPropagation();
          onClose?.();
        }}
        aria-label="Fechar modal"
      />

      {/* Modal */}
      <div className="relative flex min-h-full items-center justify-center p-4">
        <div
          className={`w-full ${sizeClass} rounded-2xl bg-white shadow-xl`}
          role="dialog"
          aria-modal="true"
          aria-label={modalTitle}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b px-5 py-4">
            <h2 className="text-base font-semibold text-slate-900">
              {modalTitle}
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Fechar"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-4">{children}</div>

          {/* Footer */}
          {footer ? (
            <div className="flex items-center justify-end gap-2 border-t px-5 py-4">
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}