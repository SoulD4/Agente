import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandMarkProps {
  /** Pixel size of the mark (square). */
  size?: number;
  className?: string;
  /** Render inside a gradient rounded tile (app-icon style). Default true. */
  tile?: boolean;
}

/**
 * The Zaia ribbon mark. By default rendered inside the brand gradient tile so
 * it reads as the product's app icon; pass `tile={false}` for the bare white mark.
 */
export function BrandMark({ size = 36, className, tile = true }: BrandMarkProps) {
  const markSize = tile ? Math.round(size * 0.62) : size;
  const mark = (
    <Image
      src="/logo-mark.png"
      alt="Zaia"
      width={markSize}
      height={markSize}
      className="object-contain select-none"
      priority
      draggable={false}
    />
  );

  if (!tile) {
    return <span className={cn("inline-flex", className)}>{mark}</span>;
  }

  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 shadow-lg shadow-violet-500/30",
        className
      )}
      style={{ width: size, height: size }}
    >
      {mark}
    </span>
  );
}

interface LogoProps {
  /** Link target; pass null to render a non-link logo. Default "/". */
  href?: string | null;
  size?: number;
  /** Show the "Zaia" wordmark next to the mark. Default true. */
  wordmark?: boolean;
  tile?: boolean;
  className?: string;
  wordmarkClassName?: string;
}

/** Full lockup: mark + "Zaia" wordmark. Used across nav bars and auth screens. */
export function Logo({
  href = "/",
  size = 36,
  wordmark = true,
  tile = true,
  className,
  wordmarkClassName,
}: LogoProps) {
  const inner = (
    <span className={cn("flex items-center gap-2.5", className)}>
      <BrandMark size={size} tile={tile} />
      {wordmark && (
        <span
          className={cn(
            "text-lg font-semibold tracking-tight text-white",
            wordmarkClassName
          )}
        >
          Zaia
        </span>
      )}
    </span>
  );

  if (href === null) return inner;
  return (
    <Link href={href} className="inline-flex items-center">
      {inner}
    </Link>
  );
}
