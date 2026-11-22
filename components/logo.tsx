import Image from "next/image";

export function Logo({
  size = 48,
  className = "",
  priority = false,
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/brand/logo.jpg"
      alt="NOÉ WORK BANK"
      width={size}
      height={size}
      priority={priority}
      style={{ width: size, height: size }}
      className={`rounded-xl bg-white object-cover ${className}`}
    />
  );
}
