function SearchBar() {
  return (
    <section
      className="my-8 animate-fade-up"
      style={{ animationDelay: '0.2s' }}
    >
      <div className="flex items-center rounded-full border-2 border-[#6f86ff] bg-white shadow-[0_15px_35px_rgba(40,50,110,0.12)] sm:rounded-2xl sm:border-0 sm:bg-white sm:p-3">
        <input
          type="text"
          placeholder="Search by course code, batch or exam type"
          aria-label="Search question bank"
          className="flex-1 bg-transparent px-5 py-3 text-base text-[#2b3165] outline-none"
        />
        <button
          className="grid h-12 w-16 place-items-center rounded-full bg-[#6f86ff] text-white sm:h-auto sm:w-auto sm:rounded-xl sm:bg-gradient-to-r sm:from-[#5b8dff] sm:to-[#7a4bff] sm:px-6 sm:py-3 sm:font-semibold"
          type="button"
          aria-label="Search"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>
    </section>
  )
}

export default SearchBar
