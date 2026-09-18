"use client";

import React from "react";

export const Logo = () => {
  return (
    <div className="custom-logo-container">
      {/* Imagem Tema Claro */}
      <img
        src="/logo-light.png"
        alt="Logo Prefeitura"
        className="logo-theme-light"
      />

      {/* Imagem Tema Escuro */}
      <img
        src="/logo-dark.png"
        alt="Logo Prefeitura"
        className="logo-theme-dark"
      />
    </div>
  );
};