import * as React from "react";
import { Heart, Code, Zap, Shield, Globe, Coffee, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function About() {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "All processing happens in your browser for instant results with no server uploads."
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your files never leave your device. Complete privacy and security guaranteed."
    },
    {
      icon: Globe,
      title: "No Installation",
      description: "Works directly in your web browser on any device, anywhere, anytime."
    },
    {
      icon: Code,
      title: "Open Source Spirit",
      description: "Built with modern web technologies and a passion for user experience."
    }
  ];

  const technologies = [
    "React 19", "TypeScript", "Tailwind CSS", "Vite", "Canvas API", 
    "Web Workers", "Progressive Web App", "Responsive Design"
  ];

  const contactEmail = "glowinpress@hotmail.com";
  const discordProfile = "@mochiamochi";

  const handleEmailContact = () => {
    window.location.href = `mailto:${contactEmail}?subject=GlowinPress Feedback`;
  };

  const handleDiscordContact = () => {
    navigator.clipboard.writeText(discordProfile).then(() => {
      alert(`"${discordProfile}" copied to clipboard!`);
    });
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-6">
        <h1 className="text-5xl md:text-6xl font-bold gradient-text text-shadow-lg">
          About GlowinPress
        </h1>
        <p className="text-xl md:text-2xl text-white/80 dark:text-gray-200 text-shadow max-w-3xl mx-auto">
          A modern, privacy-focused media conversion tool built for speed, simplicity, and security
        </p>
      </div>

      {/* Mission Statement */}
      <div className="glass-card p-8 glow-purple">
        <div className="flex items-center gap-3 mb-6">
          <Heart className="w-8 h-8 text-pink-500" />
          <h2 className="text-3xl font-bold text-white">Our Mission</h2>
        </div>
        <p className="text-white/90 text-lg leading-relaxed">
          GlowinPress was created with a simple goal: to provide fast, secure, and easy-to-use media conversion tools 
          that respect your privacy. We believe that you shouldn't have to upload your personal files to unknown servers 
          or install heavy software just to convert an image or compress a video.
        </p>
      </div>

      {/* Key Features */}
      <div className="glass-card p-8 glow-sky">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Why Choose GlowinPress?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="flex items-start gap-4 p-6 rounded-xl bg-white/10 backdrop-blur-sm">
                <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-sm border border-purple-400/30">
                  <IconComponent className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/70">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* How It Works */}
      <div className="glass-card p-8 glow-purple">
        <h2 className="text-3xl font-bold text-white mb-8">How It Works</h2>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white flex items-center justify-center font-bold">1</div>
            <p className="text-white/90 text-lg">Upload your image or video file directly in your browser</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white flex items-center justify-center font-bold">2</div>
            <p className="text-white/90 text-lg">Choose your desired format, quality, or compression settings</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white flex items-center justify-center font-bold">3</div>
            <p className="text-white/90 text-lg">Our browser-based engine processes your file locally</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white flex items-center justify-center font-bold">4</div>
            <p className="text-white/90 text-lg">Download your converted file instantly - no waiting, no uploads!</p>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="glass-card p-8 glow-sky">
        <div className="flex items-center gap-3 mb-6">
          <Code className="w-6 h-6 text-blue-500" />
          <h2 className="text-3xl font-bold text-white">Built With Modern Technology</h2>
        </div>
        
        <p className="text-white/90 mb-6 text-lg">
          GlowinPress is built using cutting-edge web technologies to ensure the best performance and user experience:
        </p>
        
        <div className="flex flex-wrap gap-3">
          {technologies.map((tech, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-600/10 border border-purple-400/30 rounded-full text-white"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="glass-card p-8 glow-purple">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-green-500" />
          <h2 className="text-3xl font-bold text-white">Privacy & Security</h2>
        </div>
        
        <div className="space-y-4 text-white/90 text-lg">
          <p>
            <strong>100% Client-Side Processing:</strong> All image and video processing happens directly in your browser. 
            Your files are never uploaded to our servers or any third-party services.
          </p>
          <p>
            <strong>No Data Collection:</strong> We don't track, store, or analyze your files or personal information. 
            What you convert stays with you.
          </p>
          <p>
            <strong>Open Source Spirit:</strong> Built with transparency in mind, using well-established web APIs 
            and technologies that you can trust.
          </p>
          <p>
            <strong>Secure by Design:</strong> No account required, no cloud storage, no hidden uploads. 
            Your privacy is protected by design, not by policy.
          </p>
        </div>
      </div>

      {/* Support & Feedback */}
      <div className="glass-card p-8 glow-sky">
        <div className="flex items-center gap-3 mb-6">
          <Coffee className="w-6 h-6 text-orange-500" />
          <h2 className="text-3xl font-bold text-white">Support & Feedback</h2>
        </div>
        
        <p className="text-white/90 mb-6 text-lg">
          GlowinPress is constantly evolving. We're always working to add new features, support more formats, 
          and improve the user experience. We'd love to hear from you!
        </p>
        
        <div className="bg-blue-500/10 p-6 rounded-xl border border-blue-400/30">
          <p className="text-blue-200 mb-4">
            <strong>Get in touch with us:</strong> Whether you have feedback, suggestions, bug reports, or just want to say hello!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleEmailContact}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300"
            >
              <Mail className="w-4 h-4" />
              {contactEmail}
            </Button>
            
            <Button
              onClick={handleDiscordContact}
              variant="outline"
              className="flex items-center gap-2 px-6 py-3 border-blue-400/50 text-blue-200 hover:bg-blue-500/10 rounded-xl transition-all duration-300"
            >
              <MessageCircle className="w-4 h-4" />
              {discordProfile}
            </Button>
          </div>
        </div>
      </div>

      {/* Thank You Note */}
      <div className="text-center py-8">
        <div className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500/10 to-pink-600/10 border border-purple-400/30 rounded-full">
          <Heart className="w-5 h-5 text-pink-500" />
          <span className="text-white font-medium text-lg">
            Thank you for using GlowinPress!
          </span>
          <Heart className="w-5 h-5 text-pink-500" />
        </div>
      </div>
    </div>
  );
}
