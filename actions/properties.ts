"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AREAS } from "@/lib/areas";
import { isAdmin } from "@/lib/auth";
import { PROPERTY_TYPES } from "@/lib/defaults";
import { checkbox, lines, optionalInt, text } from "@/lib/form";
import {
  createProperty,
  deleteProperty,
  isRefTaken,
  isStatus,
  updateProperty,
} from "@/lib/properties";
import type { Property, PropertyInput, Purpose } from "@/lib/types";
import { saveUpload } from "@/lib/uploads";

export interface PropertyFormState {
  error?: string;
}

function localImagePath(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return null;
  return trimmed;
}

export async function savePropertyAction(
  _previous: PropertyFormState,
  formData: FormData
): Promise<PropertyFormState> {
  if (!(await isAdmin())) {
    return { error: "Your session has expired. Sign in again and retry." };
  }

  const id = text(formData, "id");
  const title = text(formData, "title");
  const ref = text(formData, "ref");
  const purposeValue = text(formData, "purpose");
  const location = text(formData, "location");
  const type = text(formData, "type");
  const statusValue = text(formData, "status");
  const summary = text(formData, "summary");
  const description = text(formData, "description");

  if (!title || !ref) return { error: "Reference and title are required." };
  if (!["sale", "rent"].includes(purposeValue)) {
    return { error: "Choose sale or rent." };
  }
  if (!AREAS.some((area) => area.name === location)) {
    return { error: "Choose a valid location." };
  }
  if (!PROPERTY_TYPES.includes(type as (typeof PROPERTY_TYPES)[number])) {
    return { error: "Choose a valid property type." };
  }
  if (!summary || !description) {
    return { error: "Summary and description are required." };
  }
  if (isRefTaken(ref, id || undefined)) {
    return { error: `Reference ${ref} is already used by another property.` };
  }

  const coverFile = formData.get("coverFile");
  const galleryFiles = formData
    .getAll("galleryFiles")
    .filter((item): item is File => item instanceof File && item.size > 0);

  let saved: Property | null = null;
  try {
    const uploadedCover = await saveUpload(
      coverFile instanceof File ? coverFile : null,
      "cover"
    );
    const uploadedGallery: string[] = [];
    for (const file of galleryFiles) {
      const uploaded = await saveUpload(file, "gallery");
      if (uploaded) uploadedGallery.push(uploaded);
    }

    const image = uploadedCover || localImagePath(text(formData, "image"));
    if (!image) {
      return {
        error:
          "Add a cover image by uploading one or entering a local image path beginning with /.",
      };
    }

    const existingGallery = lines(formData, "gallery");
    if (existingGallery.some((item) => !localImagePath(item))) {
      return {
        error: "Gallery image paths must begin with /.",
      };
    }
    const gallery = uploadedGallery.length ? uploadedGallery : existingGallery;

    const input: PropertyInput = {
      slug: text(formData, "slug") || undefined,
      ref,
      title,
      purpose: purposeValue as Purpose,
      location,
      type,
      beds: optionalInt(formData, "beds"),
      baths: optionalInt(formData, "baths"),
      size: text(formData, "size"),
      priceLabel: text(formData, "priceLabel") || "Price on request",
      priceKsh: optionalInt(formData, "priceKsh"),
      featured: checkbox(formData, "featured"),
      image,
      gallery: gallery.length ? gallery : [image],
      summary,
      description,
      features: lines(formData, "features"),
      amenities: lines(formData, "amenities"),
      status: isStatus(statusValue) ? statusValue : "draft",
    };

    saved = id ? updateProperty(id, input) : createProperty(input);
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "The property could not be saved. Try again.",
    };
  }

  if (!saved) return { error: "The property could not be saved." };

  revalidatePath("/", "layout");
  revalidatePath("/properties");
  revalidatePath(`/property/${saved.slug}`);
  revalidatePath("/admin/properties");
  redirect(`/admin/properties/${saved.id}?saved=1`);
}

export async function deletePropertyAction(formData: FormData): Promise<void> {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  const id = text(formData, "id");
  if (!id) return;
  deleteProperty(id);
  revalidatePath("/", "layout");
  revalidatePath("/admin/properties");
  redirect("/admin/properties?deleted=1");
}
