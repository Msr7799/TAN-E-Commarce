"use client";

import { useEffect, useMemo, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/utils/i18n";
import {
  getPersistedProducts,
  generateProductId,
  generateSlug,
  saveStoredProducts,
  normalizePrice,
  PRODUCT_CATEGORIES,
  STOCK_STATUSES,
} from "@/lib/productStorage";
import type { Product, ProductCategory, ProductImage, StockStatus } from "@/types";

const emptyProduct: Omit<Product, "id" | "images" | "createdAt" | "updatedAt"> = {
  slug: "",
  name: "",
  shortDescription: "",
  description: "",
  price: 0,
  compareAtPrice: undefined,
  currency: "BHD",
  category: "bundles",
  tags: [],
  rating: 0,
  reviewCount: 0,
  stockStatus: "in_stock",
  stockCount: 0,
  sku: "",
  specifications: [],
  isFeatured: false,
  isNew: false,
  discount: undefined,
};

function buildProductImage(url: string, alt: string): ProductImage {
  return {
    id: `img-${Date.now()}`,
    url: url.trim(),
    alt: alt.trim() || "Product image",
    width: 800,
    height: 1200,
    isPrimary: true,
  };
}

function readFileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export function AdminProductsManager() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState({
    name: "",
    slug: "",
    shortDescription: "",
    description: "",
    price: "0",
    compareAtPrice: "",
    category: "bundles",
    stockStatus: "in_stock",
    stockCount: "0",
    sku: "",
    imageUrl: "",
    imageAlt: "",
    isFeatured: false,
    isNew: false,
    discount: "0",
  });
  const [productImageFile, setProductImageFile] = useState<File | null>(null);

  useEffect(() => {
    const stored = getPersistedProducts();
    setProducts(stored);
  }, []);

  const existingSlugs = useMemo(() => products.map((product) => product.slug), [products]);

  const currentProduct = useMemo(
    () => products.find((product) => product.id === activeProductId) ?? null,
    [activeProductId, products]
  );

  useEffect(() => {
    if (!currentProduct) {
      setFormValues((state) => ({
        ...state,
        name: "",
        slug: "",
        shortDescription: "",
        description: "",
        price: "0",
        compareAtPrice: "",
        category: "bundles",
        stockStatus: "in_stock",
        stockCount: "0",
        sku: "",
        imageUrl: "",
        imageAlt: "",
        isFeatured: false,
        isNew: false,
        discount: "0",
      }));
      setProductImageFile(null);
      return;
    }

    const primaryImage = currentProduct.images[0];
    setFormValues({
      name: currentProduct.name,
      slug: currentProduct.slug,
      shortDescription: currentProduct.shortDescription,
      description: currentProduct.description,
      price: String(currentProduct.price),
      compareAtPrice: currentProduct.compareAtPrice ? String(currentProduct.compareAtPrice) : "",
      category: currentProduct.category,
      stockStatus: currentProduct.stockStatus,
      stockCount: String(currentProduct.stockCount),
      sku: currentProduct.sku,
      imageUrl: primaryImage?.url ?? "",
      imageAlt: primaryImage?.alt ?? "",
      isFeatured: currentProduct.isFeatured,
      isNew: currentProduct.isNew,
      discount: currentProduct.discount ? String(currentProduct.discount) : "0",
    });
    setProductImageFile(null);
  }, [currentProduct]);

  const resetForm = () => {
    setActiveProductId(null);
    setFormValues({
      name: "",
      slug: "",
      shortDescription: "",
      description: "",
      price: "0",
      compareAtPrice: "",
      category: "bundles",
      stockStatus: "in_stock",
      stockCount: "0",
      sku: "",
      imageUrl: "",
      imageAlt: "",
      isFeatured: false,
      isNew: false,
      discount: "0",
    });
    setProductImageFile(null);
  };

  const handleSave = async () => {
    const name = formValues.name.trim();
    if (!name) return;

    const slug =
      formValues.slug.trim() ||
      generateSlug(
        name,
        existingSlugs.filter((item) => item !== currentProduct?.slug)
      );
    const price = normalizePrice(formValues.price);
    const compareAtPrice = formValues.compareAtPrice.trim()
      ? normalizePrice(formValues.compareAtPrice)
      : undefined;
    const stockCount = Math.max(0, Number(formValues.stockCount) || 0);
    const discount = formValues.discount.trim() ? Number(formValues.discount) : undefined;
    let imageUrl = formValues.imageUrl.trim();

    if (!imageUrl && productImageFile) {
      try {
        imageUrl = await readFileToDataUrl(productImageFile);
      } catch {
        imageUrl = "";
      }
    }

    if (!imageUrl) {
      imageUrl = "/back3colors.webp";
    }

    const nextProduct: Product = {
      id: currentProduct ? currentProduct.id : generateProductId(products),
      slug,
      name,
      shortDescription: formValues.shortDescription.trim(),
      description: formValues.description.trim(),
      price,
      compareAtPrice,
      currency: "BHD",
      images: [buildProductImage(imageUrl, formValues.imageAlt.trim() || name)],
      category: formValues.category as ProductCategory,
      tags: ["admin"],
      rating: currentProduct?.rating ?? 4.5,
      reviewCount: currentProduct?.reviewCount ?? 0,
      stockStatus: formValues.stockStatus as StockStatus,
      stockCount,
      sku: formValues.sku.trim() || `SKU-${slug}`,
      specifications: [
        { label: "Brand", value: "Marbella Tan" },
        { label: "Size", value: "100ml" },
      ],
      isFeatured: formValues.isFeatured,
      isNew: formValues.isNew,
      discount: discount && discount > 0 ? discount : undefined,
      createdAt: currentProduct?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const nextProducts = currentProduct
      ? products.map((product) => (product.id === currentProduct.id ? nextProduct : product))
      : [nextProduct, ...products];

    setProducts(nextProducts);
    saveStoredProducts(nextProducts);
    resetForm();
  };

  const handleDelete = (id: string) => {
    const nextProducts = products.filter((product) => product.id !== id);
    setProducts(nextProducts);
    saveStoredProducts(nextProducts);
    if (activeProductId === id) resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-cream bg-[#fbfdff] p-6 shadow-sm shadow-black/5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-black-rich">
              {t("admin.products.manager.sectionTitle")}
            </h3>
            <p className="mt-1 text-sm text-black/60">
              {t("admin.products.manager.sectionDescription")}
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={resetForm}>
            {t("admin.products.manager.addNewProduct")}
          </Button>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4">
            <div className="rounded-3xl border border-cream bg-white p-4">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="text-lg font-semibold text-black-rich">
                    {t("admin.products.manager.formTitle")}
                  </h4>
                  <p className="text-sm text-black/60">
                    {t("admin.products.manager.formDescription")}
                  </p>
                </div>
                {currentProduct && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(currentProduct.id)}
                  >
                    {t("admin.products.manager.deleteProduct")}
                  </Button>
                )}
              </div>

              <div className="grid gap-4">
                <label className="space-y-2 text-sm text-black/70">
                  <span>{t("admin.products.manager.name")}</span>
                  <input
                    value={formValues.name}
                    onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                    placeholder={t("admin.products.manager.placeholderName")}
                    className="w-full rounded-2xl border border-beige px-4 py-3 text-sm outline-none focus:border-golden"
                  />
                </label>
                <label className="space-y-2 text-sm text-black/70">
                  <span>{t("admin.products.manager.slug")}</span>
                  <input
                    value={formValues.slug}
                    onChange={(e) => setFormValues({ ...formValues, slug: e.target.value })}
                    placeholder={t("admin.products.manager.placeholderSlug")}
                    className="w-full rounded-2xl border border-beige px-4 py-3 text-sm outline-none focus:border-golden"
                  />
                </label>
                <label className="space-y-2 text-sm text-black/70">
                  <span>{t("admin.products.manager.shortDescription")}</span>
                  <textarea
                    value={formValues.shortDescription}
                    onChange={(e) =>
                      setFormValues({ ...formValues, shortDescription: e.target.value })
                    }
                    rows={2}
                    className="w-full rounded-2xl border border-beige px-4 py-3 text-sm outline-none focus:border-golden"
                  />
                </label>
                <label className="space-y-2 text-sm text-black/70">
                  <span>{t("admin.products.manager.fullDescription")}</span>
                  <textarea
                    value={formValues.description}
                    onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                    rows={4}
                    className="w-full rounded-2xl border border-beige px-4 py-3 text-sm outline-none focus:border-golden"
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm text-black/70">
                    <span>{t("admin.products.manager.price")}</span>
                    <input
                      value={formValues.price}
                      onChange={(e) => setFormValues({ ...formValues, price: e.target.value })}
                      inputMode="decimal"
                      className="w-full rounded-2xl border border-beige px-4 py-3 text-sm outline-none focus:border-golden"
                    />
                  </label>
                  <label className="space-y-2 text-sm text-black/70">
                    <span>{t("admin.products.manager.compareAtPrice")}</span>
                    <input
                      value={formValues.compareAtPrice}
                      onChange={(e) =>
                        setFormValues({ ...formValues, compareAtPrice: e.target.value })
                      }
                      inputMode="decimal"
                      className="w-full rounded-2xl border border-beige px-4 py-3 text-sm outline-none focus:border-golden"
                    />
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm text-black/70">
                    <span>{t("admin.products.manager.category")}</span>
                    <select
                      value={formValues.category}
                      onChange={(e) => setFormValues({ ...formValues, category: e.target.value })}
                      className="w-full rounded-2xl border border-beige bg-white px-4 py-3 text-sm outline-none focus:border-golden"
                    >
                      {PRODUCT_CATEGORIES.map((category) => (
                        <option key={category.value} value={category.value}>
                          {t(`admin.products.manager.categoryOptions.${category.value}`) ||
                            category.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-2 text-sm text-black/70">
                    <span>{t("admin.products.manager.stockStatus")}</span>
                    <select
                      value={formValues.stockStatus}
                      onChange={(e) =>
                        setFormValues({ ...formValues, stockStatus: e.target.value })
                      }
                      className="w-full rounded-2xl border border-beige bg-white px-4 py-3 text-sm outline-none focus:border-golden"
                    >
                      {STOCK_STATUSES.map((status) => (
                        <option key={status.value} value={status.value}>
                          {t(`admin.products.manager.stockStatusOptions.${status.value}`) ||
                            status.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm text-black/70">
                    <span>{t("admin.products.manager.stockCount")}</span>
                    <input
                      value={formValues.stockCount}
                      onChange={(e) => setFormValues({ ...formValues, stockCount: e.target.value })}
                      inputMode="numeric"
                      className="w-full rounded-2xl border border-beige px-4 py-3 text-sm outline-none focus:border-golden"
                    />
                  </label>
                  <label className="space-y-2 text-sm text-black/70">
                    <span>{t("admin.products.manager.sku")}</span>
                    <input
                      value={formValues.sku}
                      onChange={(e) => setFormValues({ ...formValues, sku: e.target.value })}
                      className="w-full rounded-2xl border border-beige px-4 py-3 text-sm outline-none focus:border-golden"
                    />
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm text-black/70">
                    <span>{t("admin.products.manager.imageUrl")}</span>
                    <input
                      value={formValues.imageUrl}
                      onChange={(e) => setFormValues({ ...formValues, imageUrl: e.target.value })}
                      placeholder={t("admin.products.manager.placeholderImageUrl")}
                      className="w-full rounded-2xl border border-beige px-4 py-3 text-sm outline-none focus:border-golden"
                    />
                  </label>
                  <label className="space-y-2 text-sm text-black/70">
                    <span>{t("admin.products.manager.imageAltText")}</span>
                    <input
                      value={formValues.imageAlt}
                      onChange={(e) => setFormValues({ ...formValues, imageAlt: e.target.value })}
                      placeholder={t("admin.products.manager.placeholderImageAltText")}
                      className="w-full rounded-2xl border border-beige px-4 py-3 text-sm outline-none focus:border-golden"
                    />
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm text-black/70">
                    <span className="flex items-center gap-2">
                      {t("admin.products.manager.uploadImageFile")}
                      <Upload className="h-4 w-4 text-golden" />
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProductImageFile(e.target.files?.[0] ?? null)}
                      className="w-full rounded-2xl border border-beige bg-white px-4 py-3 text-sm outline-none file:mr-4 file:rounded-full file:border-0 file:bg-golden file:px-3 file:text-sm file:font-semibold file:text-white"
                    />
                    {productImageFile && (
                      <p className="text-xs text-black/55">
                        {t("admin.products.manager.selectedFile", {
                          fileName: productImageFile.name,
                        })}
                      </p>
                    )}
                  </label>
                  <div className="space-y-2 text-sm text-black/60">
                    <p>{t("admin.products.manager.imageFileHint")}</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="flex items-center gap-2 text-sm text-black/70">
                    <input
                      type="checkbox"
                      checked={formValues.isFeatured}
                      onChange={(e) =>
                        setFormValues({ ...formValues, isFeatured: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-beige text-golden"
                    />
                    {t("admin.products.manager.featured")}
                  </label>
                  <label className="flex items-center gap-2 text-sm text-black/70">
                    <input
                      type="checkbox"
                      checked={formValues.isNew}
                      onChange={(e) => setFormValues({ ...formValues, isNew: e.target.checked })}
                      className="h-4 w-4 rounded border-beige text-golden"
                    />
                    {t("admin.products.manager.new")}
                  </label>
                  <label className="space-y-2 text-sm text-black/70">
                    <span>{t("admin.products.manager.discount")}</span>
                    <input
                      value={formValues.discount}
                      onChange={(e) => setFormValues({ ...formValues, discount: e.target.value })}
                      inputMode="numeric"
                      className="w-full rounded-2xl border border-beige px-4 py-3 text-sm outline-none focus:border-golden"
                    />
                  </label>
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button variant="secondary" onClick={handleSave}>
                    {currentProduct
                      ? t("admin.products.manager.saveChanges")
                      : t("admin.products.manager.createProduct")}
                  </Button>
                  {currentProduct && (
                    <Button variant="outline" onClick={resetForm}>
                      {t("admin.products.manager.cancel")}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-cream bg-white p-4">
              <h4 className="text-lg font-semibold text-black-rich">
                {t("admin.products.manager.catalogTitle")}
              </h4>
              <div className="mt-4 space-y-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="rounded-3xl border border-beige/70 bg-cream/70 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={product.images[0]?.url}
                        alt={product.images[0]?.alt}
                        className="h-16 w-16 rounded-2xl object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-black-rich">{product.name}</p>
                        <p className="text-xs text-black/55">{product.category}</p>
                        <p className="mt-1 text-sm text-black/60">{product.shortDescription}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-black/60">
                      <span>{product.stockStatus.replace("_", " ")}</span>
                      <span>{product.price.toFixed(2)} BHD</span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveProductId(product.id)}
                      >
                        {t("admin.products.manager.edit")}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                      >
                        {t("admin.products.manager.remove")}
                      </Button>
                    </div>
                  </div>
                ))}
                {products.length === 0 && (
                  <p className="text-sm text-black/55">{t("admin.products.manager.noProducts")}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
