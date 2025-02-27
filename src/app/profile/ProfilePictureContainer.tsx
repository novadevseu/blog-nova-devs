"use client";

import { useUser } from "@/hooks/useUser";
import { editUserData } from "@/hooks/editUserHook";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

const imageGridVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const imageItemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
};

export default function ProfilePictureContainer() {
    const [edit, setEdit] = useState(false);
    const [selectedImage, setSelectedImage] = useState("0");
    const currentUser = useUser();
    const dispatch = useDispatch();

    const handleSavePicture = async () => {
        await editUserData(dispatch, { img: selectedImage });
        setEdit(false);
    };

    if (currentUser)
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center mb-6 p-4 bg-[#0c1023] rounded-xl border border-gray-800/50 
                    hover:border-[#E0C600]/30 transition-all duration-300"
            >
                <AnimatePresence>
                    {edit && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
                            onClick={(e) => e.target === e.currentTarget && setEdit(false)}
                        >
                            <motion.div
                                variants={modalVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="bg-[#0c1023] rounded-xl p-6 w-80 text-center border border-gray-800/50"
                            >
                                <motion.h2 
                                    className="text-xl font-semibold mb-6 bg-gradient-to-r from-[#E0C600] to-[#c4ad00] 
                                        bg-clip-text text-transparent"
                                >
                                    Seleccionar Foto de Perfil
                                </motion.h2>
                                <motion.div 
                                    variants={imageGridVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="grid grid-cols-4 gap-3 mb-6"
                                >
                                    {[...Array(8)].map((_, index) => (
                                        <motion.button
                                            key={index}
                                            variants={imageItemVariants}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`w-14 h-14 rounded-full overflow-hidden border-2 transition-all duration-300
                                                ${selectedImage === `/profile_pictures/${index + 1}.png` 
                                                    ? 'border-[#E0C600] shadow-[0_0_15px_rgba(224,198,0,0.3)]' 
                                                    : 'border-gray-700'} 
                                                hover:border-[#E0C600]/70`}
                                            onClick={() => setSelectedImage(`/profile_pictures/${index + 1}.png`)}
                                        >
                                            <img
                                                src={`/profile_pictures/${index + 1}.png`}
                                                alt={`Perfil ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </motion.button>
                                    ))}
                                </motion.div>
                                <div className="flex justify-between gap-4">
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex-1 py-2 bg-red-500/20 text-red-400 font-medium rounded-lg
                                            border border-red-500/30 hover:bg-red-500 hover:text-white
                                            transition-all duration-300"
                                        onClick={() => setEdit(false)}
                                    >
                                        Cancelar
                                    </motion.button>
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex-1 py-2 bg-[#E0C600] text-[#090d1f] font-medium rounded-lg
                                            hover:bg-[#E0C600]/90 hover:shadow-[0_0_15px_rgba(224,198,0,0.3)]
                                            transition-all duration-300"
                                        onClick={handleSavePicture}
                                    >
                                        Guardar
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#E0C600]/30
                        hover:border-[#E0C600] transition-all duration-300"
                >
                    <img
                        src={currentUser.img || "/profile_pictures/1.png"}
                        alt="Foto de Perfil"
                        className="w-full h-full object-cover"
                    />
                </motion.div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="ml-4 px-6 py-2 bg-[#E0C600] text-[#090d1f] font-medium rounded-lg
                        hover:bg-[#E0C600]/90 hover:shadow-[0_0_15px_rgba(224,198,0,0.3)]
                        transition-all duration-300"
                    onClick={() => setEdit(true)}
                >
                    Cambiar Foto
                </motion.button>
            </motion.div>
        );

    return null;
}