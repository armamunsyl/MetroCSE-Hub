function SearchBar() {
  return (
    <section
      className="my-8 animate-fade-up"
      style={{ animationDelay: '0.2s' }}
    >
      <div className="flex items-center rounded-full border border-[#E5E7EB] bg-white shadow-[0_12px_24px_rgba(0,0,0,0.08)] sm:rounded-2xl sm:border sm:p-2">
        <input
          type="text"
          placeholder="Search by course code, batch or exam type"
          aria-label="Search question bank"
          className="flex-1 bg-transparent px-5 py-2 text-base text-[#475569] outline-none placeholder:text-[#94A3B8]"
        />
        <button
          className="inline-flex items-center gap-2 rounded-full border-l border-[#E5E7EB] px-4 py-2 text-[#1E3A8A] sm:rounded-xl sm:border sm:bg-[#1E3A8A] sm:px-5 sm:py-2 sm:font-semibold sm:text-white"
          type="button"
          aria-label="Search"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <span>Search</span>
        </button>
      </div>
    </section>
  )
}

export default SearchBar
