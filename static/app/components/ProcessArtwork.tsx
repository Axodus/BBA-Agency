import Image from "next/image";

const steps = [
  { number: "01", label: "DEFINE", x: 650, y: 145 },
  { number: "02", label: "RESEARCH", x: 95, y: 490 },
  { number: "03", label: "ANALYZE", x: 690, y: 585 },
  { number: "04", label: "SYNTHESIZE", x: 790, y: 710 },
  { number: "05", label: "DELIVER", x: 820, y: 890 },
];

export function ProcessArtwork() {
  return (
    <div
      className="process-artwork"
      role="img"
      aria-label="A five-stage process: define, research, analyze, synthesize, and deliver"
    >
      <Image
        className="process-artwork__paper process-artwork__paper--dots"
        src="/assets/hero-process/paper-dots.webp"
        alt=""
        width={1254}
        height={1254}
        sizes="(max-width: 1000px) 68vw, 28vw"
        priority
      />
      <Image
        className="process-artwork__paper process-artwork__paper--cream"
        src="/assets/hero-process/paper-cream.webp"
        alt=""
        width={1254}
        height={1254}
        sizes="(max-width: 1000px) 58vw, 24vw"
        priority
      />
      <div className="process-artwork__halftone" aria-hidden="true" />
      <Image
        className="process-artwork__paper process-artwork__paper--lined"
        src="/assets/hero-process/paper-lined.webp"
        alt=""
        width={1254}
        height={1254}
        sizes="(max-width: 1000px) 50vw, 21vw"
        priority
      />
      <Image
        className="process-artwork__handwritten"
        src="/assets/hero-process/handwritten.webp"
        alt=""
        width={1254}
        height={1254}
        sizes="(max-width: 1000px) 30vw, 13vw"
        priority
      />

      <svg
        className="process-artwork__geometry"
        viewBox="0 0 1000 1000"
        aria-hidden="true"
        focusable="false"
      >
        <circle className="process-artwork__orbit" cx="500" cy="375" r="325" />

        <g className="process-artwork__guides">
          <line x1="35" y1="405" x2="965" y2="405" />
          <line x1="500" y1="25" x2="500" y2="965" />
          <line x1="390" y1="155" x2="625" y2="155" />
          <line x1="165" y1="515" x2="360" y2="515" />
          <line x1="685" y1="615" x2="855" y2="615" />
          <line x1="650" y1="725" x2="825" y2="725" />
          <line x1="675" y1="885" x2="805" y2="885" />
        </g>

        <g className="process-artwork__dotted-guides">
          <line x1="405" y1="195" x2="405" y2="340" />
          <line x1="710" y1="555" x2="875" y2="555" />
          <line x1="875" y1="555" x2="875" y2="645" />
        </g>

        <g className="process-artwork__markers">
          <rect x="28" y="398" width="14" height="14" />
          <rect x="958" y="398" width="14" height="14" />
          <rect x="493" y="18" width="14" height="14" />
          <rect x="493" y="958" width="14" height="14" />
          <rect x="398" y="188" width="14" height="14" />
          <rect x="398" y="333" width="14" height="14" />
          <rect x="868" y="548" width="14" height="14" />
          <rect x="668" y="878" width="14" height="14" />
        </g>

        <g className="process-artwork__crosses">
          <path d="M405 120v60M375 150h60" />
          <path d="M820 120v60M790 150h60" />
          <path d="M655 525v60M625 555h60" />
          <path d="M535 645v60M505 675h60" />
        </g>

        {steps.map((step) => (
          <g className="process-artwork__step" key={step.number}>
            <text className="process-artwork__number" x={step.x} y={step.y}>
              {step.number}
            </text>
            <text className="process-artwork__label" x={step.x} y={step.y + 34}>
              {step.label}
            </text>
          </g>
        ))}
      </svg>

      <div className="process-artwork__blue-block" aria-hidden="true" />
    </div>
  );
}
