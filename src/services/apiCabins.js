import supabase, { supabaseUrl } from "./supabase";

// ===== GET CABINS =====
export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");
  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }
  return data;
}

// ===== CREATE / EDIT CABIN =====
export async function createEditCabin(newCabin, id) {
  console.log(newCabin, id);

  const hasImagePath =
    typeof newCabin.image === "string" && newCabin.image.startsWith(supabaseUrl);

  let imageName = null;
  if (!hasImagePath) {
    imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll("/", "");
  }

  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // 1. create / edit cabin
  let query = supabase.from("cabins");

  // A) CREATE
  if (!id) {
    query = query.insert([{ ...newCabin, image: imagePath }]);
  }

  // B) EDIT
  if (id) {
    query = query.update({ ...newCabin, image: imagePath }).eq("id", Number(id));
  }

  const { data, error } = await query.select().single();
  if (error) {
    console.error(error);
    throw new Error("Cabin could not be created/edited");
  }

  // إذا الصورة موجودة بالفعل، رجع الداتا فوراً
  if (hasImagePath) return data;

  // رفع الصورة في التخزين
  const { error: storageError } = await supabase
    .storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  if (storageError) {
    // لو فشل الرفع احذف الكابين اللي اتعمل
    await supabase.from("cabins").delete().eq("id", data.id);
    throw new Error(
      "Cabin image could not be uploaded and cabin was not created"
    );
  }

  return data;
}

// ===== DELETE CABIN =====
export async function deleteCabin(id) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", Number(id));
  if (error) {
    console.error(error);
    throw new Error("Cabin could not be deleted");
  }
  return data;
}