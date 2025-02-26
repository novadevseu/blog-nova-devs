"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const technologies = [
  { name: "Next.js", logo: "https://cdn.worldvectorlogo.com/logos/next-js.svg" },
  { name: "JavaScript", logo: "https://cdn.worldvectorlogo.com/logos/javascript-1.svg" },
  { name: "Tailwind CSS", logo: "https://cdn.worldvectorlogo.com/logos/tailwind-css-2.svg" },
  { name: "Firebase", logo: "https://cdn.worldvectorlogo.com/logos/firebase-1.svg" },
  { name: "React", logo: "https://cdn.worldvectorlogo.com/logos/react-2.svg" }
];

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#090d1f] to-[#090d1f]/95 text-white pt-24">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6 relative inline-block">
            Sobre Nova Devs Blog
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-[#E0C600] rounded-full"></span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Un proyecto open-source dedicado a compartir las últimas novedades
            y conocimientos sobre tecnología, programación y eventos globales.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Mission Section */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#0c1023] p-8 rounded-xl border border-gray-800/50"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-[#E0C600]"></span>
              Nuestra Misión
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Crear una plataforma donde desarrolladores pueden compartir conocimientos,
              experiencias y mejores prácticas en el desarrollo web moderno.
              Además, servir como portfolio que demuestra el uso de tecnologías actuales.
            </p>
          </motion.section>

          {/* Features Section */}
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-[#0c1023] p-8 rounded-xl border border-gray-800/50"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-[#E0C600]"></span>
              Características
            </h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-[#E0C600]">✓</span>
                Sistema de autenticación seguro
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#E0C600]">✓</span>
                Editor Markdown integrado
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#E0C600]">✓</span>
                Sistema de comentarios en tiempo real
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#E0C600]">✓</span>
                Diseño responsivo y moderno
              </li>
            </ul>
          </motion.section>
        </div>

        {/* Technologies Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <span className="w-6 h-0.5 bg-[#E0C600]"></span>
            Tecnologías Utilizadas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex flex-col items-center group"
              >
                <div className="w-20 h-20 p-4 bg-[#0c1023] rounded-xl border border-gray-800/50
                  transition-all duration-300 group-hover:border-[#E0C600]/30
                  group-hover:shadow-[0_0_15px_rgba(224,198,0,0.2)]">
                  <Image
                    src={tech.logo}
                    alt={tech.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span className="mt-3 text-gray-300 group-hover:text-[#E0C600] transition-colors duration-300">
                  {tech.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <Link 
            href="https://github.com/your-repo" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-[#E0C600] text-[#090d1f] rounded-lg
              font-semibold transition-all duration-300 hover:scale-105
              shadow-[0_0_15px_rgba(224,198,0,0.3)]
              hover:shadow-[0_0_20px_rgba(224,198,0,0.4)]"
          >
            Ver en GitHub
          </Link>
        </motion.section>
      </div>
    </div>
  );
};

export default About;