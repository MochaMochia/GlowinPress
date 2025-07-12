import * as React from "react";
import {
  Image,
  Video,
  Zap,
  Download,
  RefreshCw,
  Shield,
  Globe,
  Code,
  Users,
  Star,
  ChevronRight,
  ArrowUp,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface HomeProps {
  onToolClick?: (tool: string) => void;
}

export function Home({ onToolClick }: HomeProps) {
  const imageTools = [
    {
      name: "Image Compressor",
      route: "/image-compressor",
      key: "image-compressor",
      icon: Zap,
      description: "Reduce image file sizes while maintaining quality",
      color: "from-green-500 to-emerald-600",
    },
    {
      name: "Image Converter",
      route: "/image-converter",
      key: "image-converter",
      icon: RefreshCw,
      description: "Convert between different image formats instantly",
      color: "from-blue-500 to-cyan-600",
    },
    {
      name: "Image Downloader",
      route: "/image-downloader",
      key: "image-downloader",
      icon: Download,
      description: "Download images from URLs with format conversion",
      color: "from-purple-500 to-violet-600",
    },
  ];

  const videoTools = [
    {
      name: "Video Converter",
      route: "/video-converter",
      key: "video-converter",
      icon: RefreshCw,
      description: "Convert videos between different formats",
      color: "from-orange-500 to-red-600",
    },
    {
      name: "Video Compressor",
      route: "/video-compressor",
      key: "video-compressor",
      icon: Zap,
      description: "Compress videos to reduce file sizes",
      color: "from-pink-500 to-rose-600",
    },
    {
      name: "Video Downloader",
      route: "/video-downloader",
      key: "video-downloader",
      icon: Download,
      description: "Download videos from direct URLs",
      color: "from-indigo-500 to-purple-600",
    },
    {
      name: "AI Video Upscaler",
      route: "/video-upscaler",
      key: "video-upscaler",
      icon: ArrowUp,
      description: "Enhance video resolution using AI technology",
      color: "from-purple-500 to-pink-600",
    },
  ];

  const creativeTools = [
    {
      name: "SVG Creator",
      route: "/svg-creator",
      key: "svg-creator",
      icon: Palette,
      description: "Create vector graphics with an intuitive interface",
      color: "from-teal-500 to-cyan-600",
    },
    {
      name: "YouTube Downloader",
      route: "/youtube",
      key: "youtube",
      icon: Download,
      description: "Download YouTube videos in various formats",
      color: "from-red-500 to-red-600",
    },
  ];

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "All processing happens in your browser for instant results with no server uploads.",
      color: "from-yellow-500 to-orange-600",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description:
        "Your files never leave your device. Complete privacy and security guaranteed.",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: Globe,
      title: "No Installation",
      description:
        "Works directly in your web browser on any device, anywhere, anytime.",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: Code,
      title: "Open Source Spirit",
      description:
        "Built with modern web technologies and a passion for user experience.",
      color: "from-purple-500 to-violet-600",
    },
  ];

  const stats = [
    { label: "Formats Supported", value: "50+" },
    { label: "Privacy Protected", value: "100%" },
    { label: "Processing Speed", value: "Instant" },
    { label: "User Satisfaction", value: "★★★★★" },
  ];

  const handleToolClick = (tool: any, e: React.MouseEvent) => {
    e.preventDefault();
    if (onToolClick) {
      onToolClick(tool.key);
    } else {
      window.location.href = tool.route;
    }
  };

  const handleGetStarted = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onToolClick) {
      onToolClick("image-compressor");
    } else {
      window.location.href = "/image-compressor";
    }
  };

  const handleYouTubeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onToolClick) {
      onToolClick("youtube");
    } else {
      window.location.href = "/youtube";
    }
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-8 py-12">
        <h1 className="text-6xl md:text-7xl font-bold gradient-text text-shadow-lg">
          GlowinPress
        </h1>
        <p className="text-2xl md:text-3xl text-black dark:text-gray-100 text-shadow max-w-4xl mx-auto font-medium">
          The Ultimate Media Processing Suite
        </p>
        <p className="text-xl md:text-2xl text-black dark:text-gray-300 text-shadow max-w-3xl mx-auto">
          Compress, convert, and download images and videos with privacy-first,
          browser-based processing
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          <Button
            onClick={handleGetStarted}
            className="px-8 py-4 text-lg bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Get Started
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            onClick={handleYouTubeClick}
            variant="outline"
            className="px-8 py-4 text-lg glass-button border-white/30 text-black dark:text-white hover:bg-white/10 font-semibold rounded-xl"
          >
            YouTube Downloader
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="glass-card p-8 glow-purple bg-[#ffffbd]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2 text-black dark:text-white">
                {stat.value}
              </div>
              <div className="font-medium text-black dark:text-white">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Tools Section */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Image className="h-12 w-12 text-purple-400" />
            <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white">
              Image Tools
            </h2>
          </div>
          <p className="text-xl text-black dark:text-white/80 max-w-2xl mx-auto">
            Professional image processing tools for compression, conversion, and
            downloading
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {imageTools.map((tool, index) => {
            const ToolIcon = tool.icon;
            return (
              <a
                key={index}
                href={tool.route}
                onClick={(e) => handleToolClick(tool, e)}
                className="group"
              >
                <div className="glass-card p-8 hover:scale-105 transition-all duration-300 glow-purple group-hover:shadow-2xl bg-[#fffffbd]">
                  <div
                    className={`p-4 rounded-2xl bg-gradient-to-br ${tool.color} mb-6 w-fit`}
                  >
                    <ToolIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                    {tool.name}
                  </h3>
                  <p className="text-black dark:text-white/70 leading-relaxed">
                    {tool.description}
                  </p>
                  <div className="mt-6 flex items-center text-primary font-medium">
                    Try it now
                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Video Tools Section */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Video className="h-12 w-12 text-sky-400" />
            <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white">
              Video Tools
            </h2>
          </div>
          <p className="text-xl text-black dark:text-white/80 max-w-2xl mx-auto">
            Powerful video processing capabilities for conversion, compression,
            and downloading
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {videoTools.map((tool, index) => {
            const ToolIcon = tool.icon;
            return (
              <a
                key={index}
                href={tool.route}
                onClick={(e) => handleToolClick(tool, e)}
                className="group"
              >
                <div className="glass-card p-8 hover:scale-105 transition-all duration-300 glow-sky group-hover:shadow-2xl bg-[#fffffbd]">
                  <div
                    className={`p-4 rounded-2xl bg-gradient-to-br ${tool.color} mb-6 w-fit`}
                  >
                    <ToolIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-black dark:text-white mb-4">
                    {tool.name}
                  </h3>
                  <p className="text-black dark:text-white/70 leading-relaxed text-sm">
                    {tool.description}
                  </p>
                  <div className="mt-6 flex items-center text-accent font-medium">
                    Try it now
                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Creative Tools Section */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Palette className="h-12 w-12 text-teal-400" />
            <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white">
              Creative Tools
            </h2>
          </div>
          <p className="text-xl text-black dark:text-white/80 max-w-2xl mx-auto">
            Design and creation tools for vector graphics and media downloading
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {creativeTools.map((tool, index) => {
            const ToolIcon = tool.icon;
            return (
              <a
                key={index}
                href={tool.route}
                onClick={(e) => handleToolClick(tool, e)}
                className="group"
              >
                <div className="glass-card p-8 hover:scale-105 transition-all duration-300 glow-sky group-hover:shadow-2xl bg-[#fffffbd]">
                  <div
                    className={`p-4 rounded-2xl bg-gradient-to-br ${tool.color} mb-6 w-fit`}
                  >
                    <ToolIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                    {tool.name}
                  </h3>
                  <p className="text-black dark:text-white/70 leading-relaxed">
                    {tool.description}
                  </p>
                  <div className="mt-6 flex items-center text-accent font-medium">
                    Try it now
                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Features Section */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white">
            Why Choose GlowinPress?
          </h2>
          <p className="text-xl text-black dark:text-white/80 max-w-2xl mx-auto">
            Built with privacy, performance, and user experience at its core
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const FeatureIcon = feature.icon;
            return (
              <div
                key={index}
                className="glass-card p-8 text-center hover:scale-105 transition-all duration-300 bg-[#fffffbd]"
              >
                <div
                  className={`p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 w-fit mx-auto`}
                >
                  <FeatureIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-black dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-black dark:text-white/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Call to Action */}
      <div className="glass-card p-12 text-center glow-purple bg-[#fffffbd]">
        <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-6">
          Ready to Transform Your Media?
        </h2>
        <p className="text-xl text-black dark:text-white/80 mb-8 max-w-2xl mx-auto">
          Join thousands of users who trust GlowinPress for their media
          processing needs
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleGetStarted}
            className="px-8 py-4 text-lg bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Start with Images
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              if (onToolClick) {
                onToolClick("video-converter");
              } else {
                window.location.href = "/video-converter";
              }
            }}
            className="px-8 py-4 text-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Start with Videos
          </Button>
        </div>
      </div>
    </div>
  );
}
