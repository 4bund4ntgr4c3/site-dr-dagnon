import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import {
  Download,
  QrCode,
  Mail,
  Linkedin,
  Globe,
  Award,
  CheckCircle2,
  FileText,
  Copy,
} from 'lucide-react';
import { useLang } from '@/i18n/useLang';
import { localePath } from '@/i18n/routing';
import { LINKS } from '@/data/content';
import { downloadVCard } from '@/lib/vcard';

export default function Connect() {
  const { lang } = useLang();
  const isFr = lang === 'fr';

  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const connectUrl = `https://seynudedagnon.com${localePath(lang, '/connect')}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(connectUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-pine-950 text-ivory py-28 px-4 sm:px-6 lg:px-8">
      {/* Background decorations */}
      <div className="fixed inset-0 texture-net pointer-events-none opacity-40" />
      <div className="fixed -top-40 -right-40 h-[560px] w-[560px] rounded-full bg-pine-600/20 blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 -left-40 h-[460px] w-[460px] rounded-full bg-gold-600/10 blur-[130px] pointer-events-none" />

      <div className="relative mx-auto max-w-xl">
        {/* Executive Digital Business Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6 rounded-3xl border border-gold-500/30 bg-gradient-to-b from-pine-900/95 via-pine-900 to-pine-950 p-6 sm:p-8 shadow-2xl backdrop-blur-xl ring-1 ring-white/10"
        >
          {/* Top Avatar & Badges */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="relative">
              <img
                src="/portrait-seynude-dagnon.jpg"
                alt="Dr. Seynudé Jean-Fortuné Dagnon"
                width={112}
                height={112}
                className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl object-cover border-2 border-gold-400/60 shadow-xl"
                onError={(e) => {
                  // Fallback avatar if local portrait path differs
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-gold-500 text-pine-950 shadow-md">
                <CheckCircle2 size={16} />
              </span>
            </div>

            <div className="flex-1">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/40 bg-gold-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gold-300">
                <Award size={12} />
                {isFr ? 'Profil Officiel Vérifié' : 'Verified Official Profile'}
              </span>
              <h1 className="mt-2.5 font-display text-2xl sm:text-3xl font-bold text-pine-100">
                {isFr ? 'Dr. Seynudé Jean-Fortuné DAGNON — Carte Digitale' : 'Seynudé Jean-Fortuné DAGNON, MD, MPH — Digital Card'}
              </h1>
              <p className="text-xs font-semibold text-gold-400 mt-1">
                MD, MPH · Ph.D. Candidate (Health Economics)
              </p>
              <p className="text-xs leading-relaxed text-pine-200/80 mt-1.5">
                {isFr
                  ? 'Senior Program Officer — Paludisme & Santé Publique · Fondation Bill & Melinda Gates'
                  : 'Senior Program Officer — Malaria & Public Health · Bill & Melinda Gates Foundation'}
              </p>
            </div>
          </div>

          {/* Primary Action Button: Add to Contacts */}
          <div className="mt-8">
            <button
              type="button"
              onClick={() => downloadVCard(lang)}
              className="w-full flex items-center justify-center gap-3 rounded-2xl bg-gold-500 px-6 py-4 text-sm font-bold text-pine-950 shadow-lg shadow-gold-500/25 hover:bg-gold-400 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              <Download size={18} />
              <span>{isFr ? 'Enregistrer dans vos contacts (.vcf)' : 'Save contact to phone (.vcf)'}</span>
            </button>
          </div>

          {/* QR Code Toggle Button */}
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setShowQr(!showQr)}
              className="w-full flex items-center justify-center gap-2.5 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-xs font-semibold text-pine-200 hover:border-gold-400/50 hover:bg-white/10 transition-all"
            >
              <QrCode size={16} className="text-gold-400" />
              <span>{showQr ? (isFr ? 'Masquer le QR Code' : 'Hide QR Code') : (isFr ? 'Afficher le QR Code pour partage' : 'Show QR Code to scan')}</span>
            </button>
          </div>

          {/* Inline QR Code View */}
          {showQr && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 rounded-2xl border border-gold-500/30 bg-pine-950 p-5 text-center"
            >
              <p className="text-xs font-semibold text-pine-200 mb-3">
                {isFr ? 'Faites scanner ce QR Code lors de conférences :' : 'Scan this QR Code at conferences:'}
              </p>
              <div className="inline-block p-4 bg-white rounded-2xl shadow-xl">
                {/* Clean inline QR Code pointing to this connect URL */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(connectUrl)}&color=0c2e2a`}
                  alt="QR Code Dr. Seynudé Dagnon"
                  width={160}
                  height={160}
                  className="h-40 w-40"
                />
              </div>
              <p className="text-[11px] text-pine-400 mt-2 font-mono">{connectUrl}</p>
            </motion.div>
          )}

          {/* Quick Connect Actions Grid */}
          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 gap-3">
            <a
              href="mailto:contact@seynudedagnon.com"
              className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-pine-900/60 p-3 text-xs font-medium text-pine-200 hover:border-gold-400/40 hover:text-pine-100 transition-colors"
            >
              <Mail size={15} className="text-gold-400 shrink-0" />
              <span className="truncate">{isFr ? 'Envoyer un Email' : 'Send Email'}</span>
            </a>

            <a
              href={LINKS.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-pine-900/60 p-3 text-xs font-medium text-pine-200 hover:border-gold-400/40 hover:text-pine-100 transition-colors"
            >
              <Linkedin size={15} className="text-gold-400 shrink-0" />
              <span className="truncate">LinkedIn</span>
            </a>

            <Link
              to={localePath(lang, '/cv')}
              className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-pine-900/60 p-3 text-xs font-medium text-pine-200 hover:border-gold-400/40 hover:text-pine-100 transition-colors"
            >
              <FileText size={15} className="text-gold-400 shrink-0" />
              <span className="truncate">{isFr ? 'Curriculum Vitae' : 'Full Resume'}</span>
            </Link>

            <button
              type="button"
              onClick={copyLink}
              className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-pine-900/60 p-3 text-xs font-medium text-pine-200 hover:border-gold-400/40 hover:text-pine-100 transition-colors text-left"
            >
              {copied ? <CheckCircle2 size={15} className="text-emerald-400 shrink-0" /> : <Copy size={15} className="text-gold-400 shrink-0" />}
              <span className="truncate">{copied ? (isFr ? 'Lien copié !' : 'Copied!') : (isFr ? 'Copier le lien' : 'Copy link')}</span>
            </button>
          </div>

          {/* Academic Identifiers Footer */}
          <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 text-[11px] text-pine-300/80">
            <a
              href={LINKS.orcid}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-gold-300 transition-colors"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>ORCID: 0009-0006-5022-1399</span>
            </a>
            <span>•</span>
            <a
              href={LINKS.scholar}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-gold-300 transition-colors"
            >
              <Globe size={11} />
              <span>Google Scholar</span>
            </a>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
