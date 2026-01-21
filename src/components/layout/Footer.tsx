import Link from 'next/link'

export function Footer() {
  return (
    <footer className="relative z-10 mt-auto">
      <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg"></div>
      <div className="relative border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Footer Links and Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* About Section */}
            <div className="text-center md:text-left">
              <h4 className="text-base font-serif text-[#22223B] dark:text-white/90 mb-3">About ADHD First Aid Kit</h4>
              <p className="text-sm text-[#22223B]/70 dark:text-white/70 leading-relaxed">
                A gentle space with peer-to-peer strategies designed specifically for ADHD minds during overwhelming moments.
              </p>
            </div>

            {/* Quick Links */}
            <div className="text-center">
              <h4 className="text-base font-serif text-[#22223B] dark:text-white/90 mb-3">Quick Links</h4>
              <div className="space-y-2">
                <Link
                  href="/about"
                  className="block mx-auto text-sm text-[#22223B]/70 dark:text-white/70 hover:text-[#22223B] dark:hover:text-white/90 transition-colors duration-300"
                >
                  About
                </Link>
                <Link
                  href="/faq"
                  className="block mx-auto text-sm text-[#22223B]/70 dark:text-white/70 hover:text-[#22223B] dark:hover:text-white/90 transition-colors duration-300"
                >
                  FAQ
                </Link>
                <Link
                  href="/legal"
                  className="block mx-auto text-sm text-[#22223B]/70 dark:text-white/70 hover:text-[#22223B] dark:hover:text-white/90 transition-colors duration-300"
                >
                  Legal & Privacy
                </Link>
              </div>
            </div>

            {/* Community */}
            <div className="text-center md:text-right">
              <h4 className="text-base font-serif text-[#22223B] dark:text-white/90 mb-3">Community</h4>
              <p className="text-sm text-[#22223B]/70 dark:text-white/70 leading-relaxed">
                Built with care by and for the ADHD community. Your experiences and feedback help make this toolkit better.
              </p>
            </div>
          </div>

          {/* Bottom Legal Text */}
          <div className="text-center pt-6 border-t border-white/10">
            <p className="text-xs text-[#22223B]/60 dark:text-white/50 italic">
              © 2025 ADHD First Aid Kit 
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
} 