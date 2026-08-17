type Props = {
  size?: number;
  className?: string;
};

/** 12-tick zodiac seal — moon + ring. */
export function OrbiaMark({ size = 22, className = "" }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/brand/orbia-mark.svg"
      alt=""
      width={size}
      height={size}
      className={className}
      decoding="async"
    />
  );
}
