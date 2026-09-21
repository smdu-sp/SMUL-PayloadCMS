export const interactionPresets = [
  "none",
  "subtle",
  "default",
  "emphasized",
] as const;

export type InteractionPreset =
  (typeof interactionPresets)[number];

export function normalizeInteractionPreset(
  value?: string | null,
  fallback: InteractionPreset = "default",
): InteractionPreset {
  return interactionPresets.includes(value as InteractionPreset)
    ? (value as InteractionPreset)
    : fallback;
}

export const interactiveSurfaceClasses: Record<
  InteractionPreset,
  string
> = {
  none: "",
  subtle:
    "transition-[border-color,box-shadow] duration-200 ease-out hover:border-current hover:shadow-sm focus-within:border-current focus-within:shadow-sm motion-reduce:transition-none",
  default:
    "transition-[border-color,box-shadow,translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-current hover:shadow-md focus-within:border-current focus-within:shadow-md motion-reduce:translate-none motion-reduce:transition-none",
  emphasized:
    "transition-[border-color,box-shadow,translate] duration-[1s,15s] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 hover:border-current hover:shadow-xl focus-within:border-current focus-within:shadow-xl motion-reduce:translate-none motion-reduce:transition-none",
};
