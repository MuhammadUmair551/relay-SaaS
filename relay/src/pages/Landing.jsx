import { useRef }          from 'react';
import { Link }            from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  GitBranch, ArrowRight, CheckCircle2,
  Clock, FileText, MessageSquare,
  Copy, ExternalLink, Shield,
} from 'lucide-react';

function FadeIn({ children, delay = 0, className = '' }) {
  const ref     = useRef(null);
  const inView  = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Step({ number, title, description, delay }) {
  return (
    <FadeIn delay={delay}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-panel flex items-center
            justify-center text-xs font-bold text-white font-display
            flex-shrink-0">
            {number}
          </div>
          <div className="flex-1 h-px bg-border last:hidden" />
        </div>
        <h3 className="font-display font-bold text-olive-900 text-base">
          {title}
        </h3>
        <p className="text-sm text-muted leading-relaxed">{description}</p>
      </div>
    </FadeIn>
  );
}

function FeatureCard({ icon: Icon, title, desc, delay }) {
  return (
    <FadeIn delay={delay}>
      <div className="p-6 rounded-2xl border border-border bg-surface
        hover:border-olive-300 hover:shadow-card transition-all duration-200 flex flex-col h-full">
        <div className="w-9 h-9 rounded-xl bg-olive-100 flex items-center
          justify-center mb-4">
          <Icon size={16} className="text-olive-700" />
        </div>
        <h3 className="font-display font-bold text-olive-900 text-sm mb-2">
          {title}
        </h3>
        <p className="text-xs text-muted leading-relaxed flex-grow">{desc}</p>
      </div>
    </FadeIn>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-cream overflow-x-hidden">

      <nav className="sticky top-0 z-50 bg-cream/80 backdrop-blur-md
        border-b border-border/60">
        <div className="max-w-6xl mx-auto flex items-center justify-between
          px-6 md:px-10 h-16">

          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-olive-900 flex items-center
              justify-center group-hover:bg-olive-700 transition-colors">
              <GitBranch size={13} className="text-cream" fill="#F0EDE4" />
            </div>
            <span className="font-display font-bold text-olive-900 text-sm">
              Relay
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {['Features', 'How it works', 'Pricing'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                className="text-xs font-semibold text-muted uppercase
                  tracking-nav hover:text-olive-900 transition-colors">
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link to="/login"
              className="hidden sm:block px-4 py-2 rounded-full text-xs
                font-semibold text-muted hover:text-olive-900
                transition-colors">
              Sign in
            </Link>
            <Link to="/register"
              className="px-4 py-2.5 rounded-full bg-olive-900 text-cream
                text-xs font-bold uppercase tracking-nav
                hover:bg-olive-700 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 md:px-10 pt-20 pb-24">

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display font-extrabold text-olive-900 leading-[1.02]
            text-[clamp(2.6rem,6.5vw,6rem)] max-w-5xl mb-12"
        >
          <span className="block">Send clients a</span>

          <span className="flex items-center gap-3 flex-wrap">
            <span>link,</span>

            <motion.span
              initial={{ opacity: 0, rotate: -8, scale: 0.85 }}
              animate={{ opacity: 1, rotate: -3, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
              className="relative inline-flex -rotate-[3deg] translate-y-1
                flex-shrink-0"
            >
              <span className="flex items-center gap-3 px-4 py-2.5
                bg-panel rounded-2xl shadow-float">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-olive-300 animate-pulse" />
                  <span className="text-xs font-semibold text-white/80 whitespace-nowrap">
                    Project live
                  </span>
                </span>
                <span className="w-px h-4 bg-white/20" />
                <span className="text-xs font-bold text-olive-300 whitespace-nowrap">
                  68% done
                </span>
              </span>
            </motion.span>

            <span>not</span>
          </span>

          <span className="block text-olive-500">a status update.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-lg ml-auto mr-0"
        >
          <p className="text-base text-muted leading-relaxed mb-8">
            Relay gives every client a private portal — project progress,
            files, invoices and feedback, all in one beautiful link.
            No accounts, no confusion, no more WhatsApp updates.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <Link to="/register"
              className="inline-flex items-center gap-2 px-7 py-3.5
                rounded-full bg-olive-900 text-cream text-sm font-bold
                uppercase tracking-nav hover:bg-olive-700
                transition-all duration-200 shadow-float">
              Start for free
              <ArrowRight size={14} />
            </Link>
            <Link to="/login"
              className="inline-flex items-center gap-2 px-6 py-3.5
                rounded-full border border-border text-olive-900
                text-sm font-semibold hover:bg-surface
                transition-colors duration-150">
              Sign in
            </Link>
          </div>
          <p className="text-xs text-subtle mt-4">
            No credit card · Cancel anytime · Setup in 2 minutes
          </p>
        </motion.div>
      </section>

      <section className="max-w-6xl mx-auto px-6 md:px-10 mb-28">
        <FadeIn>
          <div className="bg-panel rounded-3xl p-8 md:p-12">

            <div className="flex items-start justify-between
              flex-wrap gap-6 mb-10">
              <div>
                <p className="text-[10px] font-bold text-white/30
                  uppercase tracking-nav mb-2">
                  Client Portal Preview
                </p>
                <h2 className="font-display font-bold text-white
                  text-2xl md:text-3xl">
                  What your client sees
                </h2>
              </div>

              <button className="flex items-center gap-2 px-4 py-2
                rounded-full bg-white/10 border border-white/10
                text-white/60 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-olive-300 animate-pulse" />
                Website Redesign Project
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Progress */}
              <div className="bg-white/6 rounded-2xl p-5 border border-white/8">
                <p className="text-[10px] font-bold text-white/30
                  uppercase tracking-nav mb-4">
                  Progress
                </p>
                <div className="flex items-end gap-2 mb-3">
                  <span className="font-display font-bold text-white text-3xl">
                    68%
                  </span>
                  <span className="text-white/30 text-sm mb-1">complete</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '68%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.3 }}
                    className="h-full bg-olive-400 rounded-full"
                  />
                </div>
              </div>

              {/* Milestones */}
              <div className="bg-white/6 rounded-2xl p-5 border border-white/8">
                <p className="text-[10px] font-bold text-white/30
                  uppercase tracking-nav mb-4">
                  Milestones
                </p>
                <div className="space-y-2.5">
                  {[
                    { label: 'Discovery call',  done: true  },
                    { label: 'Wireframes',      done: true  },
                    { label: 'Design mockups',  done: true  },
                    { label: 'Development',     done: false },
                    { label: 'Final delivery',  done: false },
                  ].map((m, i) => (
                    <motion.div
                      key={m.label}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.07 }}
                      className="flex items-center gap-2.5"
                    >
                      <div className={`w-4 h-4 rounded-full flex items-center
                        justify-center flex-shrink-0
                        ${m.done
                          ? 'bg-olive-500'
                          : 'bg-white/10 border border-white/20'
                        }`}>
                        {m.done && (
                          <svg width="8" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1"
                              stroke="white" strokeWidth="1.8"
                              strokeLinecap="round" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-xs
                        ${m.done ? 'text-white/60' : 'text-white/25'}`}>
                        {m.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Invoice */}
              <div className="bg-white/6 rounded-2xl p-5 border border-white/8">
                <p className="text-[10px] font-bold text-white/30
                  uppercase tracking-nav mb-4">
                  Invoice
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/30">INV-001</span>
                    <span className="px-2 py-0.5 rounded-full
                      bg-olive-500/20 text-olive-300
                      text-[10px] font-bold uppercase tracking-wide">
                      Paid
                    </span>
                  </div>
                  <p className="font-display font-bold text-white text-3xl">
                    $1,200
                  </p>
                  <div className="flex items-center gap-1.5 text-white/25 text-xs">
                    <Clock size={10} />
                    Due: Aug 15, 2026
                  </div>
                </div>
                <button className="mt-4 w-full py-2 rounded-full
                  bg-olive-500/15 border border-olive-500/25
                  text-olive-300 text-[10px] font-bold
                  uppercase tracking-nav">
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      <section className="max-w-6xl mx-auto px-6 md:px-10 mb-28">
        <FadeIn>
          <p className="text-center text-[10px] font-bold text-subtle
            uppercase tracking-nav mb-8">
            Built for freelancers who deliver great work
          </p>
          <div className="flex items-center justify-center gap-8
            md:gap-16 flex-wrap">
            {[
              'UI/UX Designers',
              'Web Developers',
              'Brand Agencies',
              'Copywriters',
              'Video Editors',
            ].map(role => (
              <span key={role}
                className="text-sm font-semibold text-subtle/60
                  whitespace-nowrap">
                {role}
              </span>
            ))}
          </div>
        </FadeIn>
      </section>

      <section id="how-it-works" className="max-w-6xl mx-auto
        px-6 md:px-10 mb-28">

        <FadeIn className="text-center mb-14">
          <p className="text-[10px] font-bold text-subtle uppercase
            tracking-nav mb-3">
            How it works
          </p>
          <h2 className="font-display font-bold text-olive-900
            text-3xl md:text-4xl">
            Three steps. That's it.
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-10">
          <Step
            number="01"
            title="Create a project"
            description="Add your client's name, email, budget, and due date. Takes under 60 seconds."
            delay={0}
          />
          <Step
            number="02"
            title="Update as you work"
            description="Mark milestones done, upload files, and send invoices — all from your dashboard."
            delay={0.1}
          />
          <Step
            number="03"
            title="Share one link"
            description="Copy the client portal link and send it. They see everything, live, without an account."
            delay={0.2}
          />
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto
        px-6 md:px-10 mb-28">

        <FadeIn className="mb-12">
          <p className="text-[10px] font-bold text-subtle uppercase
            tracking-nav mb-3">
            Features
          </p>
          <h2 className="font-display font-bold text-olive-900
            text-3xl md:text-4xl max-w-lg">
            Everything your client needs.
            Nothing they don't.
          </h2>
        </FadeIn>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          <FeatureCard
            icon={CheckCircle2}
            title="Live progress"
            desc="Real-time project status and milestone tracking your client can always check."
            delay={0}
          />
          <FeatureCard
            icon={FileText}
            title="File delivery"
            desc="Upload and share deliverables directly. Clients download, no Dropbox links needed."
            delay={0.08}
          />
          <FeatureCard
            icon={Clock}
            title="Clean invoices"
            desc="Send invoices clients can actually read - total, paid, and outstanding at a glance."
            delay={0.16}
          />
          <FeatureCard
            icon={MessageSquare}
            title="Feedback loop"
            desc="Clients leave comments directly on the portal. No WhatsApp back-and-forth."
            delay={0.24}
          />
          <FeatureCard
            icon={Copy}
            title="One shareable link"
            desc="No logins, no signups, no confusion. One link, everything inside."
            delay={0.32}
          />
          <FeatureCard
            icon={ExternalLink}
            title="Always up to date"
            desc="Every milestone you check, every file you uploa - client sees it instantly."
            delay={0.40}
          />
          <FeatureCard
            icon={Shield}
            title="Private by default"
            desc="Each client gets their own unique link. Only they can see their project."
            delay={0.48}
          />
          <FeatureCard
            icon={GitBranch}
            title="Ready in 60 seconds"
            desc="Create a project, copy the link, send to client. Done. No setup required."
            delay={0.56}
          />
        </div>
      </section>

      {/* ══ PRICING ══ */}
      <section id="pricing" className="max-w-6xl mx-auto
        px-6 md:px-10 mb-28">

        <FadeIn className="text-center mb-12">
          <p className="text-[10px] font-bold text-subtle uppercase
            tracking-nav mb-3">
            Pricing
          </p>
          <h2 className="font-display font-bold text-olive-900
            text-3xl md:text-4xl mb-4">
            Simple. Honest. Free.
          </h2>
          <p className="text-sm text-muted max-w-sm mx-auto">
            Relay is free while in beta. No hidden fees,
            no credit card, no surprises.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="max-w-sm mx-auto bg-panel rounded-3xl p-8 text-center">
            <p className="text-[10px] font-bold text-white/30 uppercase
              tracking-nav mb-4">
              Beta Plan
            </p>
            <div className="font-display font-extrabold text-white text-6xl mb-2">
              $0
            </div>
            <p className="text-sm text-white/40 mb-8">Forever, during beta</p>

            <div className="space-y-3 text-left mb-8">
              {[
                'Unlimited projects',
                'Unlimited client portals',
                'File sharing',
                'Invoice summaries',
                'Client feedback',
                'No client account needed',
              ].map(f => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-olive-500 flex
                    items-center justify-center flex-shrink-0">
                    <svg width="8" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1"
                        stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span className="text-sm text-white/70">{f}</span>
                </div>
              ))}
            </div>

            <Link to="/register"
              className="flex items-center justify-center gap-2 w-full
                py-3.5 rounded-full bg-olive-500 text-white
                text-xs font-bold uppercase tracking-nav
                hover:bg-olive-400 transition-colors">
              Get started free
              <ArrowRight size={13} />
            </Link>
          </div>
        </FadeIn>
      </section>

      <section className="max-w-6xl mx-auto px-6 md:px-10 mb-20">
        <FadeIn>
          <div className="text-center py-20 px-8 rounded-3xl
            bg-surface border border-border">
            <h2 className="font-display font-extrabold text-olive-900
              text-4xl md:text-5xl mb-4 max-w-lg mx-auto leading-tight">
              Your clients deserve clarity.
            </h2>
            <p className="text-sm text-muted mb-10 max-w-md mx-auto leading-relaxed">
              Stop sending status updates over WhatsApp.
              Give every client a professional portal they'll actually appreciate.
            </p>
            <Link to="/register"
              className="inline-flex items-center gap-2 px-8 py-4
                rounded-full bg-olive-900 text-cream
                text-sm font-bold uppercase tracking-nav
                hover:bg-olive-700 transition-colors shadow-float">
              Start for free — no card needed
              <ArrowRight size={14} />
            </Link>
          </div>
        </FadeIn>
      </section>

      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-10">
          <div className="flex flex-col md:flex-row items-center
            justify-between gap-6 mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-olive-900 flex items-center
                justify-center">
                <GitBranch size={13} className="text-cream" fill="#F0EDE4" />
              </div>
              <span className="font-display font-bold text-olive-900 text-sm">
                Relay
              </span>
            </Link>

            <div className="flex items-center gap-8">
              {['Features', 'How it works', 'Pricing'].map(l => (
                <a key={l} href={`#${l.toLowerCase().replace(/ /g, '-')}`}
                  className="text-xs text-muted hover:text-olive-900
                    transition-colors font-medium">
                  {l}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-6">
              {['Privacy', 'Terms'].map(l => (
                <a key={l} href="#"
                  className="text-xs text-subtle hover:text-muted transition-colors">
                  {l}
                </a>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-6 flex flex-col
            sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-subtle">
              © 2026 Relay. Built by Muhammad Umair
            </p>
            <p className="text-xs text-subtle">
              Made with React, Zustand, and Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}