export default function Breather() {
  return (
    <section className="py-16 overflow-hidden" style={{ background: '#C0F53D' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
        <p className="font-black text-dark leading-[1.0] tracking-tight"
          style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.8rem)' }}>
          UI/UX that bridges<br />
          <span className="font-serif italic font-semibold">business goals</span>{' & real users.'}
        </p>
        <div className="flex gap-10 sm:gap-14 shrink-0">
          {[['5+', 'Years Exp.'], ['20+', 'Products Built'], ['3', 'Platforms']].map(([val, label]) => (
            <div key={label} className="text-center">
              <p className="font-black text-dark leading-none" style={{ fontSize: 'clamp(2rem, 3.2vw, 3.2rem)' }}>{val}</p>
              <p className="text-dark/50 text-xs mt-1 uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
