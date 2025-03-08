"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { logoutUser } from "@/services/auth/firebaseAuthService";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import NameContainer from "./NameContainer";
import UsernameContainer from "./UsernameContainer";
import AdminContainer from "./AdminContainer";
import ProfilePictureContainer from "./ProfilePictureContainer";
import EmailContainer from "./EmailContainer";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};


/**
 * The Profile component relies on Redux and our prebuilt services,
 * so it does not contain any direct Firebase logic.
 */
const Profile: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  // Get the current user from Redux using our custom hook.
  const currentUser = useUser();

  // contains current input datas in email, username
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    subscribe: false,
  });

  // fetch the user details to the form data
  useEffect(() => {
    if (currentUser) {
      setFormData({
        fullName: currentUser.fullName,
        username: currentUser.username, 
        email: currentUser.email,
        subscribe: currentUser.subscribed,
      });
    }
  }, [currentUser]);

  // If no user is logged in, display an authentication prompt.
  if (!currentUser) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#090d1f] to-[#090d1f]/95"
      >
        <motion.p 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="mb-6 text-gray-300 text-lg"
        >
          No has iniciado sesión
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-[#E0C600] text-[#090d1f] font-medium rounded-lg 
            hover:bg-[#E0C600]/90 hover:shadow-[0_0_15px_rgba(224,198,0,0.3)] 
            transition-all duration-300"
          onClick={() => router.push("/auth/login")}
        >
          Iniciar Sesión
        </motion.button>
      </motion.div>
    );
  }

  // Logout handler using our service method.
  const handleLogout = async () => {
    try {
      await logoutUser(dispatch);
      router.push("/auth/login");
    } catch (error) {
      console.error("Failed to log out:", error);
      // Optionally, display an error message to the user.
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen pt-24 bg-gradient-to-b from-[#090d1f] to-[#090d1f]/95"
    >
      <div className="flex flex-col items-center justify-center py-10 px-4">
        <motion.div
          variants={itemVariants}
          className="bg-[#0c1023] p-8 rounded-xl shadow-[0_0_15px_rgba(224,198,0,0.1)] w-full max-w-4xl 
            transform transition-all duration-300 border border-gray-800/50 hover:border-[#E0C600]/30"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-[#E0C600] to-[#c4ad00] bg-clip-text text-transparent"
          >
            Perfil
          </motion.h2>
          
          <motion.div
            variants={itemVariants}
            className="text-center mb-6 p-4 bg-[#090d1f] rounded-lg border border-gray-800/50"
          >
            <p className="text-gray-300">
              <span className="font-medium">Username:</span> {currentUser.username}
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-8 bg-[#090d1f]/50 p-6 border border-gray-800/50 rounded-xl
              hover:border-[#E0C600]/30 transition-all duration-300"
          >
            <motion.h3
              variants={itemVariants}
              className="text-2xl font-semibold mb-6 bg-gradient-to-r from-[#E0C600] to-[#c4ad00] bg-clip-text text-transparent"
            >
              Configuración del Perfil
            </motion.h3>
            
            <ProfilePictureContainer />
            <NameContainer {...{ formData, setFormData }} />

            <motion.div
              variants={itemVariants}
              className="mb-6 flex items-center justify-between p-4 bg-[#0c1023] rounded-lg
                border border-gray-800/50 hover:border-[#E0C600]/30 transition-all duration-300"
            >
              <label className="text-gray-300 font-medium">
                Notificaciones por Email
              </label>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-6 rounded-full bg-[#E0C600]/20 relative transition-all duration-300
                  hover:bg-[#E0C600]/30 focus:outline-none"
              >
                <motion.div
                  layout
                  className="absolute w-5 h-5 bg-[#E0C600] rounded-full left-0.5 top-0.5
                    transition-transform duration-300 transform translate-x-6"
                />
              </motion.button>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 px-4 bg-[#0c1023] text-[#E0C600] font-medium rounded-lg
                  border border-[#E0C600]/30 hover:bg-[#E0C600] hover:text-[#0c1023]
                  transition-all duration-300"
              >
                Cambiar Contraseña
              </motion.button>
            </motion.div>

            <UsernameContainer {...{ formData, setFormData }} />
            <EmailContainer {...{ formData, setFormData }} />
            
            <AnimatePresence>
              {currentUser.role === "Admin" && <AdminContainer />}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence>
            {currentUser.role === "Admin" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6 text-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push("/create-post")}
                  className="px-6 py-3 bg-[#E0C600] text-[#090d1f] font-medium rounded-lg
                    hover:bg-[#E0C600]/90 hover:shadow-[0_0_15px_rgba(224,198,0,0.3)]
                    transition-all duration-300"
                >
                  Crear Nuevo Post
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="mt-8 w-full py-3 px-4 bg-red-600/20 text-red-400 font-medium rounded-lg
              border border-red-500/30 hover:bg-red-500 hover:text-white
              transition-all duration-300"
          >
            Cerrar Sesión
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Profile;
