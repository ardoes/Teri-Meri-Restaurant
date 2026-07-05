export function MenuPageFooter() {
  return (
    <section
      id="menu-outro"
      className="border-t border-line bg-cream-deep/30 py-14 md:py-20"
    >
      <div className="menu-outro-body container-tm text-center">
        <div className="mx-auto mb-6 flex h-[3px] w-24 overflow-hidden rounded-full">
          <span className="h-full flex-[2] bg-orange" />
          <span className="h-full flex-1 bg-green" />
        </div>
        <p className="font-display text-[clamp(1.35rem,3.5vw,2rem)] italic text-green">
          See you at the table.
        </p>
      </div>
    </section>
  );
}
