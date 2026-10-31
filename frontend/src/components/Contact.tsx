import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, MessageCircle, ArrowUpRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { SectionShell, SectionHeader, Reveal, onSpot } from './SectionKit.tsx';

type Status = 'idle' | 'success' | 'error';

const Contact = () => {
  const { getContent } = useContent();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const contactEmail = getContent('contact', 'email', 'info@starailabs.com');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setStatusMessage(data.message || 'Your message has been sent successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setStatus('idle'), 7000);
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Keep the visitor's text so nothing is lost, and tell them honestly.
      setStatus('error');
      setStatusMessage("We couldn't send your message right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: <Mail className="h-6 w-6" />, title: 'Email Us', content: contactEmail, link: `mailto:${contactEmail}` },
    { icon: <Phone className="h-6 w-6" />, title: 'Call Us', content: '+91 9883807806', link: 'tel:+919883807806' },
    { icon: <MapPin className="h-6 w-6" />, title: 'Visit Us', content: 'San Francisco, CA', link: 'https://maps.google.com' },
  ];

  const socialLinks = [
    { icon: <Github className="h-5 w-5" />, name: 'GitHub', link: 'https://github.com/Nilanjan-Nayak', hover: 'hover:text-white hover:border-white/40' },
    { icon: <Linkedin className="h-5 w-5" />, name: 'LinkedIn', link: 'https://www.linkedin.com/in/nilanjan-nayak-73b475322/', hover: 'hover:text-blue-300 hover:border-blue-400/60' },
    { icon: <Twitter className="h-5 w-5" />, name: 'Twitter', link: 'https://twitter.com', hover: 'hover:text-cyan-300 hover:border-cyan-400/60' },
  ];

  const fields: { name: 'name' | 'email' | 'subject'; label: string; type: string }[] = [
    { name: 'name', label: 'Your name', type: 'text' },
    { name: 'email', label: 'Email address', type: 'email' },
    { name: 'subject', label: "What's this about?", type: 'text' },
  ];

  return (
    <SectionShell id="contact" tone="violet">
      <SectionHeader
        icon={<MessageCircle className="h-4 w-4" />}
        badge={getContent('contact', 'title', 'Get in Touch')}
        title="Let's Build Something "
        highlight="Extraordinary Together"
        subtitle={getContent('contact', 'subtitle', "Have a project in mind? Let's collaborate and build something amazing together.")}
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-12">
        {/* Info */}
        <Reveal className="lg:col-span-2">
          <h3 className="kit-display mb-6 text-2xl font-bold text-white">Contact Information</h3>
          <div className="space-y-4">
            {contactInfo.map((info) => (
              <a
                key={info.title}
                href={info.link}
                onMouseMove={onSpot}
                target={info.link.startsWith('http') ? '_blank' : undefined}
                rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="kit-card group flex items-center gap-4 p-5"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 text-white shadow-lg shadow-blue-500/25 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  {info.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-white transition-colors duration-300 group-hover:text-cyan-300">{info.title}</h4>
                  <p className="truncate text-blue-200/75">{info.content}</p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-blue-300/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-300" />
              </a>
            ))}
          </div>

          <h3 className="kit-display mb-4 mt-10 text-xl font-bold text-white">Follow Us</h3>
          <div className="flex gap-3">
            {socialLinks.map((s) => (
              <a
                key={s.name}
                href={s.link}
                target="_blank"
                rel="noopener noreferrer"
                title={s.name}
                aria-label={s.name}
                className={`rounded-xl border border-blue-400/20 bg-slate-950/60 p-3.5 text-blue-300 backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(34,211,238,0.2)] ${s.hover}`}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </Reveal>

        {/* Form */}
        <Reveal delay={120} className="lg:col-span-3">
          <div className="kit-glow-border rounded-3xl">
            <div className="rounded-3xl bg-slate-950/90 p-7 backdrop-blur-xl sm:p-9">
              <h3 className="kit-display mb-6 text-2xl font-bold text-white">Send us a Message</h3>

              {status === 'success' && (
                <div role="status" className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" style={{ animation: 'kitPop .5s ease both' }} />
                  <p className="font-medium text-emerald-300">{statusMessage || "Thank you for your message! We'll get back to you soon."}</p>
                </div>
              )}

              {status === 'error' && (
                <div role="alert" className="mb-6 flex items-start gap-3 rounded-xl border border-amber-400/30 bg-amber-500/10 p-4">
                  <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-400" />
                  <p className="text-amber-200">
                    {statusMessage} Your text is still here. Please try again, or email us at{' '}
                    <a href={`mailto:${contactEmail}`} className="font-semibold underline underline-offset-2 hover:text-white">
                      {contactEmail}
                    </a>
                    .
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {fields.map((f) => (
                  <div key={f.name} className="kit-field">
                    <input id={f.name} name={f.name} type={f.type} value={formData[f.name]} onChange={handleChange} required placeholder=" " />
                    <label htmlFor={f.name}>{f.label}</label>
                  </div>
                ))}
                <div className="kit-field">
                  <textarea id="message" name="message" rows={5} value={formData.message} onChange={handleChange} required placeholder=" " />
                  <label htmlFor="message">Tell us about your project or inquiry</label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="kit-btn flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 px-6 py-4 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:from-cyan-400 hover:to-blue-600 hover:shadow-cyan-400/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-5 w-5 animate-spin rounded-full border-b-2 border-white" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
};

export default Contact;