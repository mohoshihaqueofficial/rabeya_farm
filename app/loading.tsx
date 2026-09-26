export default function Loading() {
  return (
    <div className="page-loader" role="status" aria-live="polite" aria-label="পৃষ্ঠা লোড হচ্ছে">
      <div className="cow-loader-mark" aria-hidden="true">
        <span className="cow-loader-ring" />
        <svg viewBox="0 0 120 100" fill="none">
          <path className="cow-loader-horns" d="M42 27C28 28 19 21 17 9c11 1 20 6 25 15M78 27c14 1 23-6 25-18-11 1-20 6-25 15" />
          <path className="cow-loader-ears" d="M40 31c-12-8-24-5-27 5 8 8 18 8 27 2M80 31c12-8 24-5 27 5-8 8-18 8-27 2" />
          <path className="cow-loader-head" d="M39 25c6-7 36-7 42 0 6 8 7 23 4 39-3 17-13 27-25 27S38 81 35 64c-3-16-2-31 4-39Z" />
          <path className="cow-loader-face" d="M48 49h.1M72 49h.1" />
          <path className="cow-loader-muzzle" d="M45 67c5-6 25-6 30 0 3 4 1 12-4 15-6 3-16 3-22 0-5-3-7-11-4-15Z" />
          <path className="cow-loader-nose" d="M52 72h.1M68 72h.1" />
        </svg>
      </div>
      <span className="page-loader-text">লোড হচ্ছে…</span>
    </div>
  );
}
