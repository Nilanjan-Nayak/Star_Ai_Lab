import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, MessageCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 3 seconds
      setTimeout(() => setSubmitted(false), 3000);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Us",
      content: "info@starailabs.com",
      link: "mailto:info@starailabs.com"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Call Us",
      content: "+1 (555) 123-4567",
      link: "tel:+15551234567"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Visit Us",
      content: "San Francisco, CA",
      link: "https://maps.google.com"
    }
  ];

  const socialLinks = [
    {
      icon: <Github className="h-5 w-5" />,
      name: "GitHub",
      link: "https://github.com",
      hover: "hover:text-gray-300 hover:bg-gray-800/50"
    },
    {
      icon: <Linkedin className="h-5 w-5" />,
      name: "LinkedIn",
      link: "https://linkedin.com",
      hover: "hover:text-blue-400 hover:bg-blue-500/20"
    },
    {
      icon: <Twitter className="h-5 w-5" />,
      name: "Twitter",
      link: "https://twitter.com",
      hover: "hover:text-cyan-400 hover:bg-cyan-500/20"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-premium-deep relative">
      {/* Premium Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-cyan-400/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-600/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-premium-glass border border-premium-blue rounded-full text-blue-300 text-sm font-medium mb-6 backdrop-blur-lg">
            <MessageCircle className="h-4 w-4 mr-2" />
            Get In Touch
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Let's Build Something
            <span className="text-premium-gradient"> Amazing Together</span>
          </h2>
          <p className="text-xl text-blue-200/90 max-w-3xl mx-auto">
            Ready to transform your ideas into intelligent solutions? We'd love to hear about your project and explore how we can help bring your vision to life.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <a
                    key={index}
                    href={info.link}
                    target={info.link.startsWith('http') ? '_blank' : undefined}
                    rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-center p-6 bg-premium-glass backdrop-blur-lg border border-premium-blue rounded-xl shadow-premium-blue hover:shadow-premium-void transition-all duration-300 group"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-400 text-white rounded-lg flex items-center justify-center group-hover:from-cyan-400 group-hover:to-blue-600 transition-all duration-300 shadow-lg">
                      {info.icon}
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors duration-300">
                        {info.title}
                      </h4>
                      <p className="text-blue-200/80">{info.content}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-4 bg-premium-glass backdrop-blur-lg border border-premium-blue rounded-lg shadow-lg transition-all duration-300 text-blue-300 ${social.hover} hover:scale-110`}
                    title={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-premium-glass backdrop-blur-lg border border-premium-blue rounded-2xl shadow-premium-void p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Send us a Message</h3>
            
            {submitted && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-400/30 rounded-lg backdrop-blur-sm">
                <p className="text-green-300 font-medium">
                  ✅ Thank you for your message! We'll get back to you soon.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-blue-200 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black/30 border border-blue-500/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-white placeholder-blue-300/50 backdrop-blur-sm"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-blue-200 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black/30 border border-blue-500/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-white placeholder-blue-300/50 backdrop-blur-sm"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-blue-200 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black/30 border border-blue-500/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-white placeholder-blue-300/50 backdrop-blur-sm"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-blue-200 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-black/30 border border-blue-500/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 resize-none text-white placeholder-blue-300/50 backdrop-blur-sm"
                  placeholder="Tell us about your project or inquiry..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-semibold py-4 px-6 rounded-lg hover:from-cyan-400 hover:to-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;