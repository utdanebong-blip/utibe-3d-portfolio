import { Layout } from '@/components/layout';
import { contactInfo } from '@/hooks/usePortfolioData';
import {
  Mail,
  MapPin,
  ExternalLink,
  Linkedin,
  Twitter,
  MessageCircle,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useState } from 'react';
import clsx from 'clsx';

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [invalid, setInvalid] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    // Anti-spam honeypot
    const honeypot = (form.querySelector('input[name="company"]') as HTMLInputElement)?.value;
    if (honeypot) return;

    if (!form.checkValidity()) {
      setInvalid(true);
      form.reportValidity();
      setTimeout(() => setInvalid(false), 600);
      return;
    }

    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    setStatus('sending');

    const resumeLink = `${window.location.origin}/resume.pdf`;

    const mailSubject = encodeURIComponent(subject);
    const mailBody = encodeURIComponent(
      `Name: ${name}
Email: ${email}

Message:
${message}

Resume:
${resumeLink}`
    );

    window.location.href = `mailto:ebongutibe@gmail.com?subject=${mailSubject}&body=${mailBody}`;

    setTimeout(() => {
      setStatus('success');
      toast.success('Message opened in your email app');
      form.reset();
    }, 600);

    setTimeout(() => setStatus('idle'), 2200);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Utibe, my name is.\n\nI would like to work with you.`
    );
    window.open(`https://wa.me/2347071486994?text=${text}`, '_blank');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-center">
          Get In <span className="text-primary">Touch</span>
        </h1>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Info */}
          <div className="space-y-6">
            <Info icon={<Mail />} label="Email" value={contactInfo.email} />
            <Info icon={<MapPin />} label="Location" value={contactInfo.location} />

            <div className="flex gap-3 pt-4">
              {contactInfo.social.artstation && <Social url={contactInfo.social.artstation}><ExternalLink /></Social>}
              {contactInfo.social.linkedin && <Social url={contactInfo.social.linkedin}><Linkedin /></Social>}
              {contactInfo.social.twitter && <Social url={contactInfo.social.twitter}><Twitter /></Social>}
            </div>

            <Button
              variant="outline"
              onClick={handleWhatsApp}
              className="w-full flex items-center gap-2"
            >
              <MessageCircle size={18} />
              Chat on WhatsApp
            </Button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className={clsx(
              'space-y-4 transition',
              invalid && 'animate-shake'
            )}
          >
            {/* Honeypot */}
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
            />

            <Input name="name" placeholder="Your Name" required />
            <Input name="email" type="email" placeholder="Your Email" required />
            <Input name="subject" placeholder="Subject" required />
            <Textarea name="message" placeholder="Your Message" rows={5} required />

            <Button
              type="submit"
              className="w-full font-display flex items-center justify-center gap-2"
              disabled={status === 'sending'}
            >
              {status === 'success' ? (
                <>
                  <CheckCircle className="animate-scale-in" />
                  Sent
                </>
              ) : status === 'sending' ? (
                'Opening…'
              ) : (
                'Send Message'
              )}
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

/* Helpers */
function Info({ icon, label, value }: any) {
  return (
    <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg">
      <div className="w-12 h-12 rounded bg-primary/20 flex items-center justify-center text-primary">
        {icon}
      </div>
      <div>
        <p className="text-muted-foreground text-sm">{label}</p>
        <p className="font-mono">{value}</p>
      </div>
    </div>
  );
}

function Social({ url, children }: any) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="w-12 h-12 rounded border border-border flex items-center justify-center hover:border-primary hover:text-primary transition"
    >
      {children}
    </a>
  );
}
