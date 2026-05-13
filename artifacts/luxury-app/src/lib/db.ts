import { supabase } from "./supabase";

// ── Types ──────────────────────────────────────────────────────────────────

export interface Restaurant {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  banner_url: string | null;
  theme: string;
  created_at: string;
}

export interface MenuCategory {
  id: string;
  restaurant_id: string;
  name: string;
  sort_order: number;
  created_at: string;
}

export interface MenuItem {
  id: string;
  category_id: string;
  restaurant_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface Video {
  id: string;
  restaurant_id: string;
  menu_item_id: string | null;
  title: string;
  video_url: string;
  thumbnail_url: string | null;
  created_at: string;
}

// ── Slug ──────────────────────────────────────────────────────────────────

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 48);
}

export async function isSlugAvailable(slug: string): Promise<boolean> {
  const { data } = await supabase
    .from("restaurants")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  return !data;
}

// ── Restaurants ────────────────────────────────────────────────────────────

export async function getMyRestaurant(): Promise<Restaurant | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("restaurants")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  return data;
}

export async function getRestaurantBySlug(slug: string): Promise<Restaurant | null> {
  const { data } = await supabase
    .from("restaurants")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data;
}

export async function upsertRestaurant(payload: Partial<Restaurant> & { user_id: string; name: string; slug: string }) {
  const { data, error } = await supabase
    .from("restaurants")
    .upsert(payload, { onConflict: "user_id" })
    .select()
    .single();
  if (error) throw error;
  return data as Restaurant;
}

// ── Menu Categories ────────────────────────────────────────────────────────

export async function getCategories(restaurantId: string): Promise<MenuCategory[]> {
  const { data, error } = await supabase
    .from("menu_categories")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("sort_order");
  if (error) throw error;
  return (data ?? []) as MenuCategory[];
}

export async function addCategory(restaurantId: string, name: string, order: number) {
  const { data, error } = await supabase
    .from("menu_categories")
    .insert({ restaurant_id: restaurantId, name, sort_order: order })
    .select()
    .single();
  if (error) throw error;
  return data as MenuCategory;
}

export async function deleteCategory(id: string) {
  const { error } = await supabase.from("menu_categories").delete().eq("id", id);
  if (error) throw error;
}

export async function reorderCategories(ids: string[]) {
  await Promise.all(
    ids.map((id, i) =>
      supabase.from("menu_categories").update({ sort_order: i }).eq("id", id)
    )
  );
}

// ── Menu Items ─────────────────────────────────────────────────────────────

export async function getMenuItems(restaurantId: string): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("sort_order");
  if (error) throw error;
  return (data ?? []) as MenuItem[];
}

export async function upsertMenuItem(item: Partial<MenuItem> & { category_id: string; restaurant_id: string; name: string; price: number }) {
  const { data, error } = await supabase
    .from("menu_items")
    .upsert(item)
    .select()
    .single();
  if (error) throw error;
  return data as MenuItem;
}

export async function deleteMenuItem(id: string) {
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) throw error;
}

// ── Videos ────────────────────────────────────────────────────────────────

export async function getVideos(restaurantId: string): Promise<Video[]> {
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Video[];
}

export async function addVideo(payload: Omit<Video, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("videos")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data as Video;
}

export async function deleteVideo(id: string) {
  const { error } = await supabase.from("videos").delete().eq("id", id);
  if (error) throw error;
}
