"use client";

import React from "react";
import { motion } from "framer-motion";

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const AuthCard = ({ title, description, children }: AuthCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full flex flex-col"
    >
      <div className="space-y-1.5 text-center pb-6">
        <h3 className="text-2xl font-semibold tracking-tight text-white">
          {title}
        </h3>
        <p className="text-sm text-zinc-400">
          {description}
        </p>
      </div>
      <div className="w-full">
        {children}
      </div>
    </motion.div>
  );
};

export default AuthCard;
