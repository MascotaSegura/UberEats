import React from 'react';

/**
 * SkeletonBlock — a rectangular block with a shimmer effect.
 * @param {string} className — Tailwind classes for size/shape/rounding
 */
const SkeletonBlock = ({ className = '' }) => (
  <div className={`relative overflow-hidden bg-[#E5E5EA] ${className}`}>
    <span className="skeleton-shimmer" />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// ProductCardSkeleton
// Mirrors: <ProductCard /> inside max-w-7xl grid-cols-2 sm:grid-cols-3 etc.
// Real card: bg-white p-4 rounded-2xl flex flex-col
//   - image: w-full aspect-square mb-3
//   - title: text-[15px] h ~2 lines, mb-1
//   - description: text-[13px] h ~2 lines, mb-3
//   - footer: price + quick-add button (h-8 w-8 rounded-full)
// ─────────────────────────────────────────────────────────────────────────────
export const ProductCardSkeleton = () => (
  <div className="bg-white p-4 flex flex-col rounded-2xl" aria-hidden="true">
    {/* Image area: aspect-square */}
    <SkeletonBlock className="w-full aspect-square mb-3 rounded-2xl" />

    {/* Title: 2 lines */}
    <SkeletonBlock className="h-[15px] w-4/5 rounded-full mb-1.5" />
    <SkeletonBlock className="h-[15px] w-3/5 rounded-full mb-3" />

    {/* Description: 2 lines */}
    <SkeletonBlock className="h-[13px] w-full rounded-full mb-1.5" />
    <SkeletonBlock className="h-[13px] w-2/3 rounded-full mb-3" />

    {/* Footer: price + quick-add */}
    <div className="flex items-center justify-between mt-auto">
      <div className="flex flex-col gap-1">
        <SkeletonBlock className="h-[15px] w-16 rounded-full" />
      </div>
      <SkeletonBlock className="w-8 h-8 rounded-full" />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// PromoCardSkeleton
// Mirrors: <PromoCard /> — h-[150px] lg:h-[180px] rounded-2xl
//   Left: title + subtitle + button pill
//   Right: image container w-[120px] lg:w-[150px]
// ─────────────────────────────────────────────────────────────────────────────
export const PromoCardSkeleton = () => (
  <div
    className="relative flex items-center w-full h-[150px] lg:h-[180px] rounded-2xl overflow-hidden bg-[#E5E5EA]"
    aria-hidden="true"
  >
    <span className="skeleton-shimmer" />

    {/* Left content area */}
    <div className="flex-1 h-full flex flex-col justify-center py-4 pl-5 lg:pl-6 pr-2 z-10 gap-2">
      {/* Title */}
      <SkeletonBlock className="h-[20px] w-3/4 rounded-full" />
      {/* Subtitle */}
      <SkeletonBlock className="h-[13px] w-full rounded-full" />
      <SkeletonBlock className="h-[13px] w-4/5 rounded-full" />
      {/* Button pill */}
      <SkeletonBlock className="h-[30px] w-24 rounded-full mt-1" />
    </div>

    {/* Right image container */}
    <div className="w-[120px] lg:w-[150px] xl:w-[180px] h-full shrink-0 bg-[#D1D1D6]" />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// OrderItemSkeleton
// Mirrors order card: bg-[#F3F4F6] p-5 rounded-2xl flex flex-col gap-3
//   Row 1: date text (left) + status badge (right)
//   Row 2: items count (left) + total (right)
//   Button: w-full h-10 rounded-full
// ─────────────────────────────────────────────────────────────────────────────
export const OrderItemSkeleton = () => (
  <div className="bg-[#F3F4F6] p-5 rounded-2xl flex flex-col gap-3" aria-hidden="true">
    {/* Row 1: date + status */}
    <div className="flex justify-between items-center">
      <SkeletonBlock className="h-[15px] w-36 rounded-full" />
      <SkeletonBlock className="h-[26px] w-20 rounded-full" />
    </div>
    {/* Row 2: items + total */}
    <div className="flex justify-between items-center">
      <SkeletonBlock className="h-[14px] w-20 rounded-full" />
      <SkeletonBlock className="h-[14px] w-24 rounded-full" />
    </div>
    {/* Button */}
    <SkeletonBlock className="w-full h-10 rounded-full mt-2" />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// BranchItemSkeleton
// Mirrors branch card: bg-[#F3F4F6] p-5 rounded-2xl flex flex-col gap-3
//   Row: icon (24px) + name + detail
//   Button: w-full h-10 rounded-full
// ─────────────────────────────────────────────────────────────────────────────
export const BranchItemSkeleton = () => (
  <div className="bg-[#F3F4F6] p-5 rounded-2xl flex flex-col gap-3" aria-hidden="true">
    {/* Icon + text row */}
    <div className="flex items-start gap-3">
      <SkeletonBlock className="w-6 h-6 rounded-full shrink-0 mt-0.5" />
      <div className="flex-1 flex flex-col gap-2">
        <SkeletonBlock className="h-[16px] w-3/4 rounded-full" />
        <SkeletonBlock className="h-[14px] w-1/2 rounded-full" />
      </div>
    </div>
    {/* Button */}
    <SkeletonBlock className="w-full h-10 rounded-full mt-2" />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// CardItemSkeleton
// Mirrors payment card row in WalletPanel:
//   bg-[#F3F4F6] p-4 rounded-2xl flex items-center gap-4
//   Left: card icon block (48x32)
//   Middle: type + last4 stacked text
//   Right: radio circle
// ─────────────────────────────────────────────────────────────────────────────
export const CardItemSkeleton = () => (
  <div className="bg-[#F3F4F6] p-4 rounded-2xl flex items-center gap-4" aria-hidden="true">
    {/* Card chip icon */}
    <SkeletonBlock className="w-12 h-8 rounded-2xl shrink-0" />
    {/* Text: type + last4 */}
    <div className="flex-1 flex flex-col gap-1.5">
      <SkeletonBlock className="h-[15px] w-16 rounded-full" />
      <SkeletonBlock className="h-[13px] w-24 rounded-full" />
    </div>
    {/* Radio / selected indicator */}
    <SkeletonBlock className="w-5 h-5 rounded-full shrink-0" />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// PromoItemSkeleton
// Mirrors promo card: bg-[#06C167]/10 p-5 rounded-2xl flex flex-col gap-2
//   Title: h2 ~18px bold
//   Description: text 14px, max-w-[80%]
//   Code row: bg-white p-2 pl-4 rounded-full w-full flex justify-between
// ─────────────────────────────────────────────────────────────────────────────
export const PromoItemSkeleton = () => (
  <div className="bg-[#F3F4F6] p-5 rounded-2xl flex flex-col gap-3" aria-hidden="true">
    {/* Title */}
    <SkeletonBlock className="h-[18px] w-40 rounded-full" />
    {/* Description */}
    <SkeletonBlock className="h-[14px] w-4/5 rounded-full" />
    <SkeletonBlock className="h-[14px] w-3/5 rounded-full" />
    {/* Code row */}
    <div className="flex items-center justify-between mt-1 bg-white p-2 pl-4 rounded-full">
      <SkeletonBlock className="h-[15px] w-24 rounded-full" />
      <SkeletonBlock className="h-8 w-14 rounded-full" />
    </div>
  </div>
);
