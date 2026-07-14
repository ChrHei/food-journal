import { COPY_SWIPE_THRESHOLD, shouldCopyFromSwipe } from "@/features/journal/utils/swipe";

describe("copy swipe", () => {
  it("copies only a sufficiently long right swipe", () => {
    expect(shouldCopyFromSwipe(COPY_SWIPE_THRESHOLD, 0)).toBe(true);
    expect(shouldCopyFromSwipe(COPY_SWIPE_THRESHOLD - 1, 0)).toBe(false);
    expect(shouldCopyFromSwipe(-100, 0)).toBe(false);
  });

  it("does not copy a mostly vertical gesture", () => {
    expect(shouldCopyFromSwipe(100, 120)).toBe(false);
  });
});
