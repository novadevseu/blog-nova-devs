"use client";

import { useUser } from '@/hooks/useUser';
import { editUserData } from '@/hooks/editUserHook';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

interface UsernameContainerInterface {
    formData: {
        username: string,
        fullName: string
    };
    setFormData: React.Dispatch<React.SetStateAction<{
        username: string,
        fullName: string
    }>>;
}

const inputVariants = {
    disabled: { scale: 0.98, opacity: 0.7 },
    enabled: { scale: 1, opacity: 1 }
};

const buttonVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
};

function UsernameContainer({formData, setFormData}: UsernameContainerInterface) {
    const [usernameEdit, setUsernameEdit] = useState(false);
    const currentUser = useUser();
    const dispatch = useDispatch();

    const handleEditUsername = async () => {
        await editUserData(dispatch, {username: formData.username});
    }

    if(currentUser)
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-[#0c1023] rounded-xl border border-gray-800/50 
                    hover:border-[#E0C600]/30 transition-all duration-300"
            >
                <label className="block text-gray-300 mb-2 font-medium">
                    Nombre de Usuario
                </label>
                <motion.input
                    type="text"
                    placeholder="Actualizar nombre de usuario"
                    animate={usernameEdit ? "enabled" : "disabled"}
                    variants={inputVariants}
                    className="w-full px-4 py-3 border border-gray-800/50 rounded-lg shadow-sm 
                        focus:outline-none focus:ring-2 focus:ring-[#E0C600]/50 focus:border-transparent
                        bg-[#090d1f] transition-all duration-200 hover:border-[#E0C600]/30
                        disabled:opacity-50 disabled:cursor-not-allowed text-gray-200"
                    disabled={!usernameEdit}
                    onChange={(e) => setFormData(v => ({...v, username: e.target.value}))}
                    value={formData.username || ""}
                />
                
                <AnimatePresence mode="wait">
                    {!usernameEdit ? (
                        <motion.button
                            key="edit"
                            variants={buttonVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setUsernameEdit(true)}
                            className="px-6 py-3 mt-4 bg-[#E0C600] text-[#090d1f] font-medium rounded-lg
                                hover:bg-[#E0C600]/90 hover:shadow-[0_0_15px_rgba(224,198,0,0.3)]
                                transition-all duration-300"
                        >
                            Editar
                        </motion.button>
                    ) : (
                        <motion.div
                            key="actions"
                            variants={buttonVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="flex gap-4 mt-4"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    setUsernameEdit(false);
                                    handleEditUsername();
                                }}
                                className="px-6 py-3 bg-[#E0C600] text-[#090d1f] font-medium rounded-lg
                                    hover:bg-[#E0C600]/90 hover:shadow-[0_0_15px_rgba(224,198,0,0.3)]
                                    transition-all duration-300"
                            >
                                Confirmar
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    setUsernameEdit(false);
                                    setFormData(v => ({...v, username: currentUser.username || ""}));
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
            </motion.div>
        );
    
    return null;
}

export default UsernameContainer;