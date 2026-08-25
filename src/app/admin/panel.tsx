```tsx
"use client";

type AdminPanelProps = {
  onClose?: () => void;
};

export function AdminPanel({ onClose }: AdminPanelProps) {
  return (
    <div className="min-h-screen w-full overflow-auto bg-white p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">MEHDISTORE</h1>
            <p className="mt-2 text-gray-500">
              لوحة تحكم المتجر
            </p>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-sm font-medium"
            >
              إغلاق
            </button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border p-6">
            <p className="text-sm text-gray-500">
              المنتجات
            </p>
            <p className="mt-2 text-3xl font-bold">0</p>
          </div>

          <div className="rounded-xl border p-6">
            <p className="text-sm text-gray-500">
              الطلبات
            </p>
            <p className="mt-2 text-3xl font-bold">0</p>
          </div>

          <div className="rounded-xl border p-6">
            <p className="text-sm text-gray-500">
              المبيعات
            </p>
            <p className="mt-2 text-3xl font-bold">
              0 DH
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border p-6">
          <h2 className="text-xl font-bold">
            إدارة المتجر
          </h2>

          <p className="mt-2 text-gray-500">
            لوحة التحكم جاهزة. يمكن إضافة إدارة المنتجات
            والطلبات والإعدادات هنا.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
```
