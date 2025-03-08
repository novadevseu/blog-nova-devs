"use client";

import { useUser } from "@/hooks/useUser";
import { editUserData } from "@/hooks/editUserHook";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

const inputVariants = {
  disabled: { scale: 0.98, opacity: 0.7 },
  enabled: { scale: 1, opacity: 1 }
};

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};
function AdminContainer() {
  const [adminFormData, setAdminFormData] = useState({
    jobDescription: "",
    company: "",
    education: "",
    skills: "",
    bio: "",
  });
  const [edit, setEdit] = useState(false);

  const currentUser = useUser();
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser)
      setAdminFormData({
        bio: currentUser?.bio || "",
        company: currentUser?.company || "",
        education: currentUser?.education || "",
        jobDescription: currentUser?.jobDescription || "",
        skills: currentUser?.skills || "",
      });
  }, [currentUser]);

  const handleSaveAdminValues = async () => {
    if (currentUser && currentUser.role === "Admin")
      await editUserData(dispatch, currentUser.uid,{ ...adminFormData });
  };

  if (currentUser)
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="mb-8 bg-[#090d1f]/50 p-6 rounded-xl border border-gray-800/50 
          hover:border-[#E0C600]/30 transition-all duration-300"
      >
        <motion.h3 
          variants={itemVariants}
          className="text-2xl font-semibold mb-6 bg-gradient-to-r from-[#E0C600] to-[#c4ad00] 
            bg-clip-text text-transparent"
        >
          Configuración de Administrador
        </motion.h3>

        <AnimatePresence mode="wait">
          {!edit ? (
            <motion.button
              key="edit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEdit(true)}
              className="px-6 py-3 bg-[#E0C600] text-[#090d1f] font-medium rounded-lg
                hover:bg-[#E0C600]/90 hover:shadow-[0_0_15px_rgba(224,198,0,0.3)]
                transition-all duration-300 transform hover:scale-105 active:scale-95 mb-6"
            >
              Editar Información
            </motion.button>
          ) : (
            <motion.div
              key="actions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex gap-4 mb-6"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setEdit(false);
                  handleSaveAdminValues();
                }}
                className="px-6 py-3 bg-[#E0C600] text-[#090d1f] font-medium rounded-lg
                  hover:bg-[#E0C600]/90 hover:shadow-[0_0_15px_rgba(224,198,0,0.3)]
                  transition-all duration-300"
              >
                Guardar Cambios
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setEdit(false);
                  setAdminFormData((v) => ({
                    ...v,
                    bio: currentUser?.bio || "",
                    company: currentUser?.company || "",
                    education: currentUser.education || "",
                    jobDescription: currentUser?.jobDescription || "",
                    skills: currentUser?.skills || "",
                  }));
                }}
                className="px-6 py-3 bg-red-500/20 text-red-400 font-medium rounded-lg
                  border border-red-500/30 hover:bg-red-500 hover:text-white
                  transition-all duration-300"
              >
                Cancelar
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div className="space-y-6" variants={containerVariants}>
          {[
            { label: "Descripción del Trabajo", key: "jobDescription", placeholder: "Ingresa una descripción" },
            { label: "Empresa/Organización", key: "company", placeholder: "Ingresa una empresa u organización" },
            { label: "Educación", key: "education", placeholder: "Ingresa tu educación" },
            { label: "Habilidades/Tecnologías", key: "skills", placeholder: "Ingresa tus habilidades" },
          ].map((field) => (
            <motion.div key={field.key} variants={itemVariants}>
              <label className="block text-gray-300 mb-2 font-medium">
                {field.label}
              </label>
              <motion.input
                type="text"
                placeholder={field.placeholder}
                className="w-full px-4 py-3 border border-gray-800/50 rounded-lg shadow-sm 
                  focus:outline-none focus:ring-2 focus:ring-[#E0C600]/50 focus:border-transparent
                  bg-[#090d1f] transition-all duration-200 hover:border-[#E0C600]/30
                  disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!edit}
                animate={edit ? "enabled" : "disabled"}
                variants={inputVariants}
                onChange={(e) =>
                  setAdminFormData((v) => ({
                    ...v,
                    [field.key]: e.target.value,
                  }))
                }
                value={adminFormData[field.key as keyof typeof adminFormData] || ""}
              />
            </motion.div>
          ))}

          <motion.div variants={itemVariants}>
            <label className="block text-gray-300 mb-2 font-medium">
              Biografía
            </label>
            <motion.textarea
              value={adminFormData.bio || ""}
              onChange={(e) =>
                setAdminFormData((v) => ({ ...v, bio: e.target.value }))
              }
              animate={edit ? "enabled" : "disabled"}
              variants={inputVariants}
              className="w-full h-32 px-4 py-3 border border-gray-800/50 rounded-lg shadow-sm 
                focus:outline-none focus:ring-2 focus:ring-[#E0C600]/50 focus:border-transparent
                bg-[#090d1f] transition-all duration-200 hover:border-[#E0C600]/30 resize-none
                disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Escribe algo sobre ti..."
              disabled={!edit}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    );
}

export default AdminContainer;
