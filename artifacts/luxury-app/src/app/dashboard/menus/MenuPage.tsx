import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useAuth } from "@/hooks/useAuth";
import {
  getMyRestaurant,
  getCategories,
  getMenuItems,
  addCategory,
  deleteCategory,
  reorderCategories,
  upsertMenuItem,
  deleteMenuItem,
  type MenuCategory,
  type MenuItem,
} from "@/lib/db";
import { uploadToStorage } from "@/lib/upload";
import { useToast } from "@/components/ui/LuxToast";

// ── Sortable item ──────────────────────────────────────────────────────────
function SortableItemRow({
  item,
  onEdit,
  onDelete,
}: {
  item: MenuItem;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 rounded-xl glass-dark border border-white/8 group"
    >
      <button
        {...attributes}
        {...listeners}
        className="text-white/20 hover:text-white/50 cursor-grab active:cursor-grabbing touch-none"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 6a1 1 0 100-2 1 1 0 000 2zm0 5a1 1 0 100-2 1 1 0 000 2zm0 5a1 1 0 100-2 1 1 0 000 2zm8-10a1 1 0 100-2 1 1 0 000 2zm0 5a1 1 0 100-2 1 1 0 000 2zm0 5a1 1 0 100-2 1 1 0 000 2z" />
        </svg>
      </button>
      {item.image_url ? (
        <img src={item.image_url} alt={item.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
      ) : (
        <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
          <span className="text-xl">🍽️</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{item.name}</p>
        {item.description && (
          <p className="text-xs text-white/40 truncate">{item.description}</p>
        )}
      </div>
      <span className="text-gold font-semibold text-sm flex-shrink-0">
        ${Number(item.price).toFixed(2)}
      </span>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ── Item modal ─────────────────────────────────────────────────────────────
function ItemModal({
  categories,
  restaurantId,
  item,
  onSave,
  onClose,
}: {
  categories: MenuCategory[];
  restaurantId: string;
  item?: MenuItem;
  onSave: (saved: MenuItem) => void;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState(item?.name ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [price, setPrice] = useState(item ? String(item.price) : "");
  const [categoryId, setCategoryId] = useState(item?.category_id ?? categories[0]?.id ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(item?.image_url ?? null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!imageFile) return;
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const handleSave = async () => {
    if (!name.trim() || !categoryId || !user) return;
    setSaving(true);
    try {
      let imageUrl = item?.image_url ?? null;
      if (imageFile) {
        imageUrl = await uploadToStorage(imageFile, "menu-items", `${restaurantId}/${Date.now()}-${imageFile.name}`);
      }
      const saved = await upsertMenuItem({
        ...(item?.id ? { id: item.id } : {}),
        category_id: categoryId,
        restaurant_id: restaurantId,
        name: name.trim(),
        description: description.trim() || null,
        price: parseFloat(price) || 0,
        image_url: imageUrl,
        sort_order: item?.sort_order ?? 0,
      });
      onSave(saved);
      showToast(item ? "Item updated" : "Item added", "success");
    } catch (e: unknown) {
      showToast((e as Error).message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="glass-dark border border-white/15 rounded-2xl p-6 w-full max-w-md space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-serif text-white">{item ? "Edit item" : "Add menu item"}</h3>

        {/* Image */}
        <div
          className="relative h-36 rounded-xl border-2 border-dashed border-white/15 overflow-hidden cursor-pointer hover:border-gold/40 transition-colors"
          onClick={() => document.getElementById("item-img-input")?.click()}
        >
          {imagePreview
            ? <img src={imagePreview} className="w-full h-full object-cover" />
            : <div className="absolute inset-0 flex flex-col items-center justify-center text-white/30 gap-1">
                <span className="text-2xl">📸</span>
                <span className="text-xs">Upload food photo</span>
              </div>}
          <input id="item-img-input" type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) setImageFile(f); }} />
        </div>

        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Item name *"
          className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-gold/60 text-sm" />

        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)"
          rows={2}
          className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-gold/60 text-sm resize-none" />

        <div className="flex gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">$</span>
            <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" type="number" min="0" step="0.01"
              className="w-full bg-white/5 border border-white/15 rounded-xl pl-7 pr-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-gold/60 text-sm" />
          </div>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
            className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-gold/60 text-sm">
            {categories.map((c) => <option key={c.id} value={c.id} className="bg-neutral-900">{c.name}</option>)}
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/15 text-white/60 hover:text-white text-sm transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={!name.trim() || saving}
            className="flex-1 py-2.5 rounded-xl bg-gold text-black font-semibold text-sm disabled:opacity-40 hover:bg-gold/90 transition-colors">
            {saving ? "Saving…" : item ? "Update" : "Add item"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export function MenuPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [newCatName, setNewCatName] = useState("");
  const [addingCat, setAddingCat] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | undefined>();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  useEffect(() => {
    if (!user) return;
    (async () => {
      const r = await getMyRestaurant();
      if (!r) { setLoading(false); return; }
      setRestaurantId(r.id);
      const [cats, its] = await Promise.all([getCategories(r.id), getMenuItems(r.id)]);
      setCategories(cats);
      setItems(its);
      if (cats.length) setActiveCat(cats[0].id);
      setLoading(false);
    })();
  }, [user]);

  const filteredItems = items.filter((it) => {
    const matchesCat = activeCat ? it.category_id === activeCat : true;
    const matchesSearch = it.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddCategory = async () => {
    if (!restaurantId || !newCatName.trim()) return;
    setAddingCat(true);
    try {
      const cat = await addCategory(restaurantId, newCatName.trim(), categories.length);
      setCategories((prev) => [...prev, cat]);
      setActiveCat(cat.id);
      setNewCatName("");
      showToast("Category added", "success");
    } catch (e: unknown) { showToast((e as Error).message, "error"); }
    finally { setAddingCat(false); }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Delete this category and all its items?")) return;
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setItems((prev) => prev.filter((it) => it.category_id !== id));
      if (activeCat === id) setActiveCat(categories.find((c) => c.id !== id)?.id ?? null);
      showToast("Category deleted", "success");
    } catch (e: unknown) { showToast((e as Error).message, "error"); }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = filteredItems.findIndex((it) => it.id === active.id);
    const newIndex = filteredItems.findIndex((it) => it.id === over.id);
    const reordered = arrayMove(filteredItems, oldIndex, newIndex);
    setItems((prev) => {
      const others = prev.filter((it) => !filteredItems.some((fi) => fi.id === it.id));
      return [...others, ...reordered.map((it, i) => ({ ...it, sort_order: i }))];
    });
    await Promise.all(reordered.map((it, i) =>
      upsertMenuItem({ ...it, sort_order: i })
    ));
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteMenuItem(id);
      setItems((prev) => prev.filter((it) => it.id !== id));
      showToast("Item deleted", "success");
    } catch (e: unknown) { showToast((e as Error).message, "error"); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
    </div>
  );

  if (!restaurantId) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4 text-white/50">
      <span className="text-4xl">🍽️</span>
      <p>Complete setup first to create your menu.</p>
      <a href="/dashboard/setup" className="text-gold text-sm hover:underline">Go to Setup →</a>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-white">Menu Management</h1>
          <p className="text-sm text-white/40 mt-0.5">Drag to reorder. Click to edit.</p>
        </div>
        <button
          onClick={() => { setEditingItem(undefined); setShowItemModal(true); }}
          disabled={!categories.length}
          className="flex items-center gap-2 px-4 py-2.5 bg-gold text-black rounded-xl font-semibold text-sm hover:bg-gold/90 transition-colors disabled:opacity-40"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Item
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar: categories */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-xs font-medium text-white/40 uppercase tracking-widest">Categories</h3>
          <div className="space-y-1">
            {categories.map((cat) => (
              <div key={cat.id}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all group
                  ${activeCat === cat.id ? "bg-gold/15 border border-gold/30 text-gold" : "hover:bg-white/5 text-white/60 hover:text-white border border-transparent"}`}
                onClick={() => setActiveCat(cat.id)}
              >
                <span className="text-sm font-medium truncate">{cat.name}</span>
                <button onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id); }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Add category */}
          <div className="flex gap-1.5 pt-1">
            <input
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
              placeholder="New category…"
              className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-gold/40"
            />
            <button onClick={handleAddCategory} disabled={addingCat || !newCatName.trim()}
              className="px-3 py-2 bg-gold/20 border border-gold/30 text-gold rounded-lg text-sm hover:bg-gold/30 disabled:opacity-40 transition-colors">
              +
            </button>
          </div>
        </div>

        {/* Main: items */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search items…"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold/40" />
            </div>
            <span className="text-xs text-white/30 flex-shrink-0">{filteredItems.length} items</span>
          </div>

          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-white/30 border border-dashed border-white/10 rounded-2xl">
              <span className="text-3xl">🍴</span>
              <p className="text-sm">{categories.length ? "No items yet. Add your first menu item." : "Create a category first."}</p>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={filteredItems.map((it) => it.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {filteredItems.map((item) => (
                    <SortableItemRow
                      key={item.id}
                      item={item}
                      onEdit={() => { setEditingItem(item); setShowItemModal(true); }}
                      onDelete={() => handleDeleteItem(item.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showItemModal && restaurantId && (
          <ItemModal
            categories={categories}
            restaurantId={restaurantId}
            item={editingItem}
            onSave={(saved) => {
              setItems((prev) => {
                const idx = prev.findIndex((it) => it.id === saved.id);
                if (idx >= 0) { const n = [...prev]; n[idx] = saved; return n; }
                return [...prev, saved];
              });
              setShowItemModal(false);
            }}
            onClose={() => setShowItemModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
