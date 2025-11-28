// global.d.ts

// Declaração para arquivos CSS e SVG (Adicionalmente útil)
declare module '*.css' {
  const content: string;
  export default content;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

// Isso informa ao TypeScript para ignorar o conteúdo do import e 
// tratá-lo como um módulo de string válido (o que permite a importação).