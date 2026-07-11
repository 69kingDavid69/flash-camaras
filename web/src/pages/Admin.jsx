import { useEffect, useState } from "react";
import { LogOut, Plus, Trash2, Upload, Check, X, Loader2, DatabaseZap } from "lucide-react";
import { CATEGORIES } from "../data/products";
import { signIn, signOut, getSession, onAuthChange } from "../lib/auth";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleSold,
  uploadProductImage,
  seedInitialCatalog,
} from "../lib/products";

const EMPTY = {
  name: "",
  brand: "",
  category: "usados",
  price: "",
  tag: "Nuevo",
  used: false,
  condition: "",
  description: "",
  image_url: "",
};

export default function Admin() {
  const [session, setSession] = useState(undefined); // undefined = loading
  const [authError, setAuthError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    getSession().then(setSession);
    return onAuthChange(setSession);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    setSigningIn(true);
    try {
      await signIn(email, password);
    } catch (err) {
      setAuthError(err.message === "Invalid login credentials" ? "Email o contraseña incorrectos." : err.message);
    } finally {
      setSigningIn(false);
    }
  };

  if (session === undefined) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center pt-24">
        <Loader2 className="h-6 w-6 animate-spin text-flash-600" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-5 pt-24">
        <form onSubmit={handleLogin} className="w-full max-w-sm rounded-3xl border border-ink/10 bg-white p-8 shadow-card">
          <h1 className="font-display text-2xl text-ink">Panel FlasCámaras</h1>
          <p className="mt-1 text-sm text-ink-mute">Acceso solo para administración.</p>

          <label className="mt-6 block text-xs uppercase tracking-[0.2em] text-ink-mute">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-xl border border-ink/10 bg-bone-soft px-4 py-3 text-sm focus:border-flash-600 focus:outline-none focus:ring-2 focus:ring-flash-100"
          />

          <label className="mt-4 block text-xs uppercase tracking-[0.2em] text-ink-mute">Contraseña</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border border-ink/10 bg-bone-soft px-4 py-3 text-sm focus:border-flash-600 focus:outline-none focus:ring-2 focus:ring-flash-100"
          />

          {authError && <p className="mt-3 text-sm text-red-600">{authError}</p>}

          <button type="submit" disabled={signingIn} className="gold-surface mt-6 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold disabled:opacity-60">
            {signingIn ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar"}
          </button>
        </form>
      </div>
    );
  }

  return <AdminPanel />;
}

function AdminPanel() {
  const [products, setProducts] = useState(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null); // null | "new" | product
  const [seeding, setSeeding] = useState(false);

  const load = () => fetchProducts({ force: true }).then(setProducts).catch((e) => setError(e.message));

  useEffect(() => {
    load();
  }, []);

  const handleSeed = async () => {
    if (!confirm("Esto carga el catálogo inicial de 23 productos reales a la base de datos. ¿Continuar?")) return;
    setSeeding(true);
    try {
      const n = await seedInitialCatalog();
      alert(`${n} productos importados.`);
      load();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSeeding(false);
    }
  };

  const handleDelete = async (p) => {
    if (!confirm(`¿Borrar "${p.name}"? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteProduct(p.id);
      load();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleToggleSold = async (p) => {
    try {
      await toggleSold(p.id, !p.sold);
      load();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-bone pt-28 pb-20">
      <div className="container-x">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-3xl text-ink">Panel de productos</h1>
          <div className="flex items-center gap-3">
            {products && products.length === 0 && (
              <button
                onClick={handleSeed}
                disabled={seeding}
                className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 text-xs font-medium text-ink hover:bg-bone-soft disabled:opacity-60"
              >
                {seeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <DatabaseZap className="h-4 w-4" />}
                Importar catálogo inicial (23 productos)
              </button>
            )}
            <button
              onClick={() => setEditing("new")}
              className="gold-surface inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold"
            >
              <Plus className="h-4 w-4" />
              Nuevo producto
            </button>
            <button
              onClick={() => signOut()}
              className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 text-xs font-medium text-ink hover:bg-bone-soft"
            >
              <LogOut className="h-4 w-4" />
              Salir
            </button>
          </div>
        </div>

        {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

        {!products ? (
          <div className="mt-10 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-flash-600" />
          </div>
        ) : products.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-ink/15 p-16 text-center">
            <p className="font-display text-xl text-ink">Todavía no hay productos.</p>
            <p className="mt-2 text-sm text-ink-mute">Importá el catálogo inicial o creá uno nuevo.</p>
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto rounded-3xl border border-ink/10 bg-white">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-left text-xs uppercase tracking-wider text-ink-mute">
                  <th className="px-4 py-3">Foto</th>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Categoría</th>
                  <th className="px-4 py-3">Precio</th>
                  <th className="px-4 py-3">Vendido</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-ink/5 last:border-0">
                    <td className="px-4 py-3">
                      {p.image_url ? (
                        <img src={p.image_url} alt="" className="h-12 w-12 rounded-lg object-cover" />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-bone-soft" />
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-ink">{p.name}</td>
                    <td className="px-4 py-3 text-ink-mute">{p.category}</td>
                    <td className="px-4 py-3 text-ink-mute">{p.price != null ? `$${p.price.toLocaleString("es-CO")}` : "Consultar"}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleSold(p)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                          p.sold ? "bg-ink text-white" : "bg-bone-soft text-ink-mute hover:bg-flash-50"
                        }`}
                      >
                        {p.sold ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                        {p.sold ? "Vendido" : "Disponible"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditing(p)}
                          className="rounded-full border border-ink/10 px-3 py-1.5 text-xs font-medium text-ink hover:bg-bone-soft"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
                          className="rounded-full border border-red-200 p-1.5 text-red-600 hover:bg-red-50"
                          aria-label="Borrar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <ProductFormModal
          initial={editing === "new" ? EMPTY : editing}
          isNew={editing === "new"}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}
    </div>
  );
}

function ProductFormModal({ initial, isNew, onClose, onSaved }) {
  const [form, setForm] = useState({
    ...initial,
    price: initial.price ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const handleImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setFormError("");
    try {
      const url = await uploadProductImage(file);
      setForm((f) => ({ ...f, image_url: url }));
    } catch (err) {
      setFormError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      const payload = {
        name: form.name,
        brand: form.brand,
        category: form.category,
        price: form.price === "" ? null : Number(form.price),
        tag: form.tag,
        used: !!form.used,
        condition: form.condition || null,
        description: form.description || "",
        image_url: form.image_url || null,
      };
      if (isNew) {
        await createProduct(payload);
      } else {
        await updateProduct(initial.id, payload);
      }
      onSaved();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4">
      <form
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-8 shadow-card"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-ink">{isNew ? "Nuevo producto" : "Editar producto"}</h2>
          <button type="button" onClick={onClose} className="rounded-full p-1 hover:bg-bone-soft">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 grid gap-4">
          <Field label="Nombre" required>
            <input required value={form.name} onChange={set("name")} className="input" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Marca" required>
              <input required value={form.brand} onChange={set("brand")} className="input" />
            </Field>
            <Field label="Precio (vacío = consultar)">
              <input type="number" min="0" value={form.price} onChange={set("price")} className="input" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Categoría" required>
              <select required value={form.category} onChange={set("category")} className="input">
                {CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Etiqueta">
              <input value={form.tag} onChange={set("tag")} className="input" placeholder="Nuevo, Segunda mano..." />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" checked={!!form.used} onChange={set("used")} className="h-4 w-4 rounded border-ink/20" />
            Es un producto usado
          </label>
          {form.used && (
            <Field label="Condición">
              <input value={form.condition} onChange={set("condition")} className="input" placeholder="Usado · buen estado" />
            </Field>
          )}
          <Field label="Descripción">
            <textarea rows={3} value={form.description} onChange={set("description")} className="input" maxLength={400} />
          </Field>
          <Field label="Foto">
            <div className="flex items-center gap-3">
              {form.image_url && <img src={form.image_url} alt="" className="h-14 w-14 rounded-xl object-cover" />}
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-ink/10 bg-bone-soft px-4 py-2.5 text-sm hover:bg-bone">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {uploading ? "Subiendo…" : "Subir foto"}
                <input type="file" accept="image/*" onChange={handleImage} className="hidden" disabled={uploading} />
              </label>
            </div>
          </Field>

          {formError && <p className="text-sm text-red-600">{formError}</p>}

          <button type="submit" disabled={saving || uploading} className="gold-surface mt-2 flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-ink-mute">
        {label}
        {required && <span className="text-flash-600"> *</span>}
      </span>
      {children}
    </label>
  );
}
