function ConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isProcessing = false,
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#0F172A]/60 px-4 py-6">
      <div className="w-full max-w-[420px] rounded-2xl bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.25)]">
        <h2 className="text-base font-semibold text-[#0F172A]">{title}</h2>
        {description ? <p className="mt-2 text-sm text-[#475569]">{description}</p> : null}
        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            className="rounded-xl border border-[#E2E8F0] px-4 py-2 text-sm font-semibold text-[#475569]"
            onClick={onCancel}
            disabled={isProcessing}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="rounded-xl bg-[#DC2626] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(220,38,38,0.28)] transition hover:brightness-95 disabled:opacity-60"
            onClick={onConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? 'Please wait...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
