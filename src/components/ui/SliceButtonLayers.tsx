/** Shared orange → green → orange-cut hover fill layers */
export function SliceButtonLayers() {
  return (
    <>
      <span
        className="slice-btn__layer slice-btn__layer--orange"
        aria-hidden
      />
      <span
        className="slice-btn__layer slice-btn__layer--green"
        aria-hidden
      />
      <span
        className="slice-btn__layer slice-btn__layer--orange-cut"
        aria-hidden
      />
    </>
  );
}
