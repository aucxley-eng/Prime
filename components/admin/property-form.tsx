"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import {
  savePropertyAction,
  type PropertyFormState,
} from "@/actions/properties";
import { Icon } from "@/components/icon";
import { AREAS } from "@/lib/areas";
import { PROPERTY_TYPES } from "@/lib/defaults";
import type { Property } from "@/lib/types";

const initialState: PropertyFormState = {};

export function PropertyForm({
  property,
  nextRef,
}: {
  property?: Property;
  nextRef: string;
}) {
  const [state, formAction, pending] = useActionState(
    savePropertyAction,
    initialState
  );
  const editing = Boolean(property);
  const image = property?.image || "/images/house-1.jpg";

  return (
    <form action={formAction} className="grid gap-6">
      {property ? <input type="hidden" name="id" value={property.id} /> : null}

      {state.error ? (
        <p role="alert" className="rounded-xl bg-clay/10 px-4 py-3 text-sm font-semibold text-clay">
          {state.error}
        </p>
      ) : null}

      <section className="admin-card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Basics</h2>
            <p className="mt-1 text-xs text-ink/50">
              The reference appears on the public listing and in WhatsApp
              messages.
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm font-bold">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={property?.featured ?? false}
              className="h-4 w-4 rounded border-line accent-[#10241e]"
            />
            Featured on the homepage
          </label>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="field-label">Reference</span>
            <input
              name="ref"
              required
              defaultValue={property?.ref || nextRef}
              className="field-input"
              placeholder="PSP-013"
            />
          </label>
          <label className="block">
            <span className="field-label">Status</span>
            <select
              name="status"
              defaultValue={property?.status || "published"}
              className="field-select"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </label>
        </div>

        <label className="mt-4 block">
          <span className="field-label">Title</span>
          <input
            name="title"
            required
            defaultValue={property?.title || ""}
            className="field-input"
            placeholder="4-Bedroom Maisonette in Kitengela"
          />
        </label>

        <label className="mt-4 block">
          <span className="field-label">Slug</span>
          <input
            name="slug"
            defaultValue={property?.slug || ""}
            className="field-input font-mono text-xs"
            placeholder="Generated from the title if left blank"
          />
          <span className="field-help">
            Public URL: /property/&lt;slug&gt;. Changing this breaks old links.
          </span>
        </label>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="field-label">Purpose</span>
            <select
              name="purpose"
              defaultValue={property?.purpose || "sale"}
              className="field-select"
            >
              <option value="sale">For sale</option>
              <option value="rent">For rent</option>
            </select>
          </label>
          <label className="block">
            <span className="field-label">Property type</span>
            <select
              name="type"
              defaultValue={property?.type || "Apartment"}
              className="field-select"
            >
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="admin-card">
        <h2 className="text-xl font-semibold">Location and size</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block">
            <span className="field-label">Location</span>
            <select
              name="location"
              defaultValue={property?.location || "Kitengela"}
              className="field-select"
            >
              {AREAS.map((area) => (
                <option key={area.name} value={area.name}>
                  {area.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="field-label">Bedrooms</span>
            <input
              name="beds"
              type="number"
              min="0"
              defaultValue={property?.beds ?? ""}
              className="field-input"
              placeholder="4"
            />
          </label>
          <label className="block">
            <span className="field-label">Bathrooms</span>
            <input
              name="baths"
              type="number"
              min="0"
              defaultValue={property?.baths ?? ""}
              className="field-input"
              placeholder="3"
            />
          </label>
          <label className="block">
            <span className="field-label">Size</span>
            <input
              name="size"
              defaultValue={property?.size || ""}
              className="field-input"
              placeholder="Approx. 250 m²"
            />
          </label>
        </div>
      </section>

      <section className="admin-card">
        <h2 className="text-xl font-semibold">Price</h2>
        <p className="mt-1 text-xs text-ink/50">
          Leave the price on request until a figure has been confirmed. A numeric
          price can be stored for future sorting.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="field-label">Display label</span>
            <input
              name="priceLabel"
              defaultValue={property?.priceLabel || "Price on request"}
              className="field-input"
              placeholder="Price on request"
            />
          </label>
          <label className="block">
            <span className="field-label">Numeric price (KSh, optional)</span>
            <input
              name="priceKsh"
              type="number"
              min="0"
              defaultValue={property?.priceKsh ?? ""}
              className="field-input"
              placeholder="Leave blank if not confirmed"
            />
          </label>
        </div>
      </section>

      <section className="admin-card">
        <h2 className="text-xl font-semibold">Description</h2>
        <label className="mt-5 block">
          <span className="field-label">Summary</span>
          <textarea
            name="summary"
            required
            rows={3}
            defaultValue={property?.summary || ""}
            className="field-textarea"
            placeholder="One or two sentences for the property card and search results."
          />
        </label>
        <label className="mt-4 block">
          <span className="field-label">Full description</span>
          <textarea
            name="description"
            required
            rows={7}
            defaultValue={property?.description || ""}
            className="field-textarea"
            placeholder="The longer description shown on the property page."
          />
        </label>
      </section>

      <section className="admin-card">
        <h2 className="text-xl font-semibold">Features and amenities</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="field-label">Features (one per line)</span>
            <textarea
              name="features"
              rows={7}
              defaultValue={property?.features.join("\n") || ""}
              className="field-textarea font-mono text-xs"
              placeholder={"Gated compound\nPrivate garden\nParking"}
            />
          </label>
          <label className="block">
            <span className="field-label">Amenities (one per line)</span>
            <textarea
              name="amenities"
              rows={7}
              defaultValue={property?.amenities.join("\n") || ""}
              className="field-textarea font-mono text-xs"
              placeholder={"Borehole water\nCCTV"}
            />
          </label>
        </div>
      </section>

      <section className="admin-card">
        <h2 className="text-xl font-semibold">Photographs</h2>
        <p className="mt-1 text-xs text-ink/50">
          Upload JPEG, PNG, WebP or AVIF up to 8 MB each. Uploading gallery images
          replaces the gallery list below.
        </p>

        <div className="mt-5 grid gap-5 lg:grid-cols-[0.4fr_1fr]">
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-sand">
              <Image
                src={image}
                alt=""
                fill
                sizes="300px"
                className="object-cover"
              />
            </div>
            <p className="mt-2 text-xs text-ink/45">
              Current cover: {property?.image || "default"}
            </p>
          </div>

          <div className="grid gap-4">
            <label className="block">
              <span className="field-label">Cover image path</span>
              <input
                name="image"
                defaultValue={property?.image || "/images/house-1.jpg"}
                className="field-input font-mono text-xs"
                placeholder="/images/house-1.jpg"
              />
              <span className="field-help">
                Must start with /. Uploading a new cover below overrides this.
              </span>
            </label>
            <label className="block">
              <span className="field-label">Upload new cover</span>
              <input
                name="coverFile"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                className="field-input text-xs file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-cream"
              />
            </label>
          </div>
        </div>

        <label className="mt-5 block">
          <span className="field-label">Gallery image paths (one per line)</span>
          <textarea
            name="gallery"
            rows={5}
            defaultValue={property?.gallery.join("\n") || ""}
            className="field-textarea font-mono text-xs"
            placeholder={"/images/house-1.jpg\n/images/interior-1.jpg"}
          />
        </label>

        <label className="mt-4 block">
          <span className="field-label">Upload gallery images</span>
          <input
            name="galleryFiles"
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="field-input text-xs file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-cream"
          />
          <span className="field-help">
            If you upload gallery images, they replace the existing gallery.
          </span>
        </label>
      </section>

      <div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white/95 p-4 shadow-lg backdrop-blur">
        <Link href="/admin/properties" className="btn btn-outline">
          Cancel
        </Link>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          <Icon name="check" className="h-4 w-4" />
          {pending
            ? "Saving…"
            : editing
              ? "Save changes"
              : "Create property"}
        </button>
      </div>
    </form>
  );
}
