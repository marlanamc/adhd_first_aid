interface FooterProps {
  navigateToPage: (page: string) => void
}

export function Footer({ navigateToPage }: FooterProps) {
  return (
    <footer className="py-8 md:py-12 bg-white/30 backdrop-blur-sm border-t border-white/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Footer Links and Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div className="text-center md:text-left">
            <h4 className="text-base font-serif text-foreground mb-3">About ADHD First Aid Kit</h4>
            <p className="text-xs sm:text-sm text-muted-foreground/80 leading-relaxed font-light">
              A gentle space with peer-to-peer strategies designed specifically for ADHD minds during overwhelming moments.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className="text-base font-serif text-foreground mb-3">Quick Links</h4>
            <div className="space-y-2">
              <button
                onClick={() => navigateToPage('about')}
                className="block mx-auto text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 font-light"
              >
                About
              </button>
              <button
                onClick={() => navigateToPage('faq')}
                className="block mx-auto text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 font-light"
              >
                FAQ
              </button>
              <button
                onClick={() => navigateToPage('legal')}
                className="block mx-auto text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 font-light"
              >
                Legal & Privacy
              </button>
            </div>
          </div>

          {/* Community */}
          <div className="text-center md:text-right">
            <h4 className="text-base font-serif text-foreground mb-3">Community</h4>
            <p className="text-xs sm:text-sm text-muted-foreground/80 leading-relaxed font-light">
              Built with care by and for the ADHD community. Your experiences and feedback help make this toolkit better.
            </p>
          </div>
        </div>

        {/* Bottom Legal Text */}
        <div className="text-center pt-6 border-t border-white/20">
          <p className="text-xs text-muted-foreground/60 font-light italic">
            © 2025 ADHD First Aid Kit 
          </p>
        </div>
      </div>
    </footer>
  )
} 