export const COPY_SWIPE_THRESHOLD = 72;

export function shouldCopyFromSwipe(dx: number, dy: number) {
  return dx >= COPY_SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy);
}
