# Paletas de Cores para Temas Acessíveis

Este documento contém propostas de cores em Hexadecimal baseadas em tokens estruturais, focadas em garantir acessibilidade e atender aos critérios da WCAG (AA e AAA). As paletas de Claro e Escuro utilizam as cores institucionais oficiais.

## Tokens Base

* **Background:** Fundo principal

* **Foreground:** Texto principal

* **Brand:** Identidade Institucional

* **Action:** Ação e Interatividade

* **Accent:** Detalhes de Apoio

## 1. Tema Claro Institucional (Light Mode - WCAG AA+)

Utiliza o azul mais escuro da marca para o texto, garantindo alto contraste e forte identidade visual, substituindo o tradicional preto/grafite.

| 

| **Token** | **Hexadecimal** | **Cor Visual / Papel** | 
| **Background** | `#FFFFFF` | Branco (Base limpa para maximizar o contraste) | 
| **Foreground** | `#0a3299` | Azul Escuro Principal (Textos longos e títulos - Contraste 9.0:1) | 
| **Brand** | `#517bee` | Azul Médio Principal (Logos, cabeçalhos, destaque institucional) | 
| **Action** | `#8800e0` | Roxo Secundário (Botões principais e links - excelente contraste AA) | 
| **Accent** | `#5cd6c9` | Turquesa Principal (Badges, fundos secundários, bordas) | 

## 2. Tema Escuro Institucional (Dark Mode - WCAG AA+)

Usa um fundo escuro neutro para destacar as cores vibrantes da marca. O texto principal utiliza o tom mais claro de azul da paleta, reduzindo a fadiga ocular.

| **Token** | **Hexadecimal** | **Cor Visual / Papel** | 
| **Background** | `#121212` | Cinza muito escuro (Fundo principal para evitar ofuscamento) | 
| **Foreground** | `#d4defb` | Azul Muito Claro Principal (Texto legível e confortável no escuro) | 
| **Brand** | `#a8bdf7` | Azul Claro Principal (Identidade adaptada para fundo escuro) | 
| **Action** | `#14b1f2` | Ciano Secundário (Botões e interações destacadas) | 
| **Accent** | `#2eed89` | Verde Secundário (Elementos de apoio e indicativos visuais) | 

## 3. Tema de Alto Contraste (High Contrast - WCAG AAA)

Projetado para usuários com baixa visão. Utiliza contraste máximo (acima de 7:1) com cores sólidas e extremas para delimitar perfeitamente o que é texto, o que é fundo e o que é clicável.

| **Token** | **Hexadecimal** | **Cor Visual / Papel** | 
| **Background** | `#000000` | Preto puro (Absorção total) | 
| **Foreground** | `#FFFFFF` | Branco puro (Reflexão máxima para leitura) | 
| **Brand** | `#FFB000` | Laranja/Amarelo forte (Identidade e demarcação estrutural) | 
| **Action** | `#00FFFF` | Ciano puro (Padrão universal de links em alto contraste) | 
| **Accent** | `#FF00FF` | Magenta puro (Foco, contornos de input, alertas) | 

## 4. Tema Otimizado para Daltonismo (Color Blindness Safe)

Baseado na paleta de Okabe-Ito, que é perfeitamente distinguível para usuários com Protanopia e Deuteranopia (dificuldade com vermelho e verde).

| **Token** | **Hexadecimal** | **Cor Visual / Papel** | 
| **Background** | `#FFFFFF` | Branco (Base limpa) | 
| **Foreground** | `#212121` | Quase preto (Leitura segura) | 
| **Brand** | `#0072B2` | Azul amigável para daltônicos (Marca e estrutura) | 
| **Action** | `#D55E00` | Vermelhão/Laranja escuro (Ação primária, substitui o vermelho) | 
| **Accent** | `#E69F00` | Laranja amarelado (Destaques, avisos e tags) | 
