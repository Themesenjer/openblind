"use client";

export type SupportedLanguage = "es-ES" | "es-MX" | "en-US" | "pt-BR";

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  "es-ES": "Español (España)",
  "es-MX": "Español (México)",
  "en-US": "English (US)",
  "pt-BR": "Português (Brasil)",
};

const UI_DICTIONARY: Record<string, Record<SupportedLanguage, string>> = {
  // Navigation & General
  nav_home: {
    "es-ES": "Inicio",
    "es-MX": "Inicio",
    "en-US": "Home",
    "pt-BR": "Início",
  },
  nav_modules: {
    "es-ES": "Mis módulos",
    "es-MX": "Mis módulos",
    "en-US": "My Modules",
    "pt-BR": "Meus Módulos",
  },
  nav_reader: {
    "es-ES": "Lector inteligente",
    "es-MX": "Lector inteligente",
    "en-US": "Smart Reader",
    "pt-BR": "Leitor Inteligente",
  },
  nav_accessibility: {
    "es-ES": "Accesibilidad",
    "es-MX": "Accesibilidad",
    "en-US": "Accessibility",
    "pt-BR": "Acessibilidade",
  },
  nav_profile: {
    "es-ES": "Mi perfil",
    "es-MX": "Mi perfil",
    "en-US": "My Profile",
    "pt-BR": "Meu Perfil",
  },
  nav_help: {
    "es-ES": "Centro de ayuda",
    "es-MX": "Centro de ayuda",
    "en-US": "Help Center",
    "pt-BR": "Central de Ajuda",
  },
  greeting_welcome: {
    "es-ES": "Bienvenido",
    "es-MX": "Bienvenido",
    "en-US": "Welcome",
    "pt-BR": "Bem-vindo",
  },
  sub_what_to_do: {
    "es-ES": "¿Qué deseas hacer hoy?",
    "es-MX": "¿Qué deseas hacer hoy?",
    "en-US": "What would you like to do today?",
    "pt-BR": "O que você gostaria de fazer hoje?",
  },

  // Lector Inteligente
  reader_title: {
    "es-ES": "Lector inteligente adaptativo",
    "es-MX": "Lector inteligente adaptativo",
    "en-US": "Adaptive Smart Reader",
    "pt-BR": "Leitor Inteligente Adaptativo",
  },
  reader_subtitle: {
    "es-ES": "Navega y traduce el contenido mediante síntesis de voz en tiempo real y resalte sincronizado.",
    "es-MX": "Navega y traduce el contenido mediante síntesis de voz en tiempo real y resalte sincronizado.",
    "en-US": "Navigate and translate content with real-time text-to-speech synthesis and synchronized highlighting.",
    "pt-BR": "Navegue e traduza conteúdo com síntese de voz em tempo real e destaque sincronizado.",
  },
  reader_custom_input_label: {
    "es-ES": "Escribe o pega texto en español para traducirlo y leerlo:",
    "es-MX": "Escribe o pega texto en español para traducirlo y leerlo:",
    "en-US": "Type or paste text in Spanish to auto-translate and read:",
    "pt-BR": "Digite ou cole texto em espanhol para traduzir e ler:",
  },
  reader_auto_translate_active: {
    "es-ES": "Traducción automática activa",
    "es-MX": "Traducción automática activa",
    "en-US": "Auto-translation active",
    "pt-BR": "Tradução automática ativa",
  },
  reader_presets: {
    "es-ES": "Plantillas rápidas",
    "es-MX": "Plantillas rápidas",
    "en-US": "Quick Presets",
    "pt-BR": "Modelos Rápidos",
  },
  reader_btn_play: {
    "es-ES": "Iniciar lectura",
    "es-MX": "Iniciar lectura",
    "en-US": "Start Reading",
    "pt-BR": "Iniciar Leitura",
  },
  reader_btn_pause: {
    "es-ES": "Pausar lectura",
    "es-MX": "Pausar lectura",
    "en-US": "Pause Reading",
    "pt-BR": "Pausar Leitura",
  },
  reader_btn_translate: {
    "es-ES": "Traducir texto al idioma actual",
    "es-MX": "Traducir texto al idioma actual",
    "en-US": "Translate text to active language",
    "pt-BR": "Traduzir texto para o idioma atual",
  },
  reader_lang_indicator: {
    "es-ES": "Idioma activo del lector:",
    "es-MX": "Idioma activo del lector:",
    "en-US": "Active reader language:",
    "pt-BR": "Idioma ativo do leitor:",
  },
  reader_translating_status: {
    "es-ES": "Traduciendo texto automáticamente...",
    "es-MX": "Traduciendo texto automáticamente...",
    "en-US": "Auto-translating text...",
    "pt-BR": "Traduzindo texto automaticamente...",
  },
  reader_clear: {
    "es-ES": "Limpiar",
    "es-MX": "Limpiar",
    "en-US": "Clear",
    "pt-BR": "Limpar",
  },
  reader_copy: {
    "es-ES": "Copiar",
    "es-MX": "Copiar",
    "en-US": "Copy",
    "pt-BR": "Copiar",
  },
  reader_copied: {
    "es-ES": "¡Copiado!",
    "es-MX": "¡Copiado!",
    "en-US": "Copied!",
    "pt-BR": "Copiado!",
  },
  reader_export_txt: {
    "es-ES": "Exportar TXT",
    "es-MX": "Exportar TXT",
    "en-US": "Export TXT",
    "pt-BR": "Exportar TXT",
  },

  // Modules
  modules_title: {
    "es-ES": "Explorar módulos accesibles",
    "es-MX": "Explorar módulos accesibles",
    "en-US": "Explore Accessible Modules",
    "pt-BR": "Explorar Módulos Acessíveis",
  },
  modules_subtitle: {
    "es-ES": "Módulos de aprendizaje, noticias y herramientas adaptadas a tus preferencias de idioma.",
    "es-MX": "Módulos de aprendizaje, noticias y herramientas adaptadas a tus preferencias de idioma.",
    "en-US": "Learning modules, news, and tools tailored to your language preferences.",
    "pt-BR": "Módulos de aprendizado, notícias e ferramentas adaptadas às suas preferências de idioma.",
  },
  modules_search_placeholder: {
    "es-ES": "Buscar módulo por nombre o contenido...",
    "es-MX": "Buscar módulo por nombre o contenido...",
    "en-US": "Search module by name or content...",
    "pt-BR": "Buscar módulo por nome ou conteúdo...",
  },
  modules_open: {
    "es-ES": "Abrir módulo",
    "es-MX": "Abrir módulo",
    "en-US": "Open module",
    "pt-BR": "Abrir módulo",
  },
  modules_progress: {
    "es-ES": "Progreso del módulo",
    "es-MX": "Progreso del módulo",
    "en-US": "Module progress",
    "pt-BR": "Progresso do módulo",
  },
  modules_category_all: {
    "es-ES": "Todos",
    "es-MX": "Todos",
    "en-US": "All",
    "pt-BR": "Todos",
  },
  modules_category_learning: {
    "es-ES": "Aprendizaje",
    "es-MX": "Aprendizaje",
    "en-US": "Learning",
    "pt-BR": "Aprendizado",
  },
  modules_category_news: {
    "es-ES": "Noticias",
    "es-MX": "Noticias",
    "en-US": "News",
    "pt-BR": "Notícias",
  },
  modules_category_audiobooks: {
    "es-ES": "Audiolibros",
    "es-MX": "Audiolibros",
    "en-US": "Audiobooks",
    "pt-BR": "Audiolivros",
  },
  modules_category_training: {
    "es-ES": "Formación",
    "es-MX": "Formación",
    "en-US": "Training",
    "pt-BR": "Formação",
  },
  modules_category_voice: {
    "es-ES": "Voz e Interpretación",
    "es-MX": "Voz e Interpretación",
    "en-US": "Voice & Interpretation",
    "pt-BR": "Voz e Interpretação",
  },
};

export function getTranslation(key: string, lang: string): string {
  const targetLang = (lang as SupportedLanguage) || "es-ES";
  const entry = UI_DICTIONARY[key];
  if (!entry) return key;
  return entry[targetLang] || entry["es-ES"] || key;
}

const OFF_LINE_SENTENCE_MAP: Record<string, Record<string, string>> = {
  "Don Quijote de la Mancha es una novela escrita por Miguel de Cervantes Saavedra. Publicada en dos partes, en 1605 y 1615, es considerada la obra cumbre de la literatura en lengua española. La historia narra las aventuras de Alonso Quijano, un hidalgo manchego que decide convertirse en caballero andante. Junto a su escudero Sancho Panza, emprende salidas en busca de aventuras.": {
    "en-US": "Don Quixote of La Mancha is a novel written by Miguel de Cervantes Saavedra. Published in two parts, in 1605 and 1615, it is considered the supreme work of Spanish language literature. The story follows the adventures of Alonso Quijano, a noble who decides to become a knight-errant. Together with his squire Sancho Panza, he sets out in search of noble adventures.",
    "pt-BR": "Dom Quixote de La Mancha é um romance escrito por Miguel de Cervantes Saavedra. Publicado em duas partes, em 1605 e 1615, é considerado a obra máxima da literatura em língua espanhola. A história narra as aventuras de Alonso Quijano, um nobre que decide se tornar um cavaleiro andante. Junto ao seu escudeiro Sancho Pança, ele parte em busca de aventuras.",
    "es-ES": "Don Quijote de la Mancha es una novela escrita por Miguel de Cervantes Saavedra. Publicada en dos partes, en 1605 y 1615, es considerada la obra cumbre de la literatura en lengua española. La historia narra las aventuras de Alonso Quijano, un hidalgo manchego que decide convertirse en caballero andante. Junto a su escudero Sancho Panza, emprende salidas en busca de aventuras.",
    "es-MX": "Don Quijote de la Mancha es una novela escrita por Miguel de Cervantes Saavedra. Publicada en dos partes, en 1605 y 1615, es considerada la obra cumbre de la literatura en lengua española. La historia narra las aventuras de Alonso Quijano, un hidalgo manchego que decide convertirse en caballero andante. Junto a su escudero Sancho Panza, emprende salidas en busca de aventuras.",
  },
  "La accesibilidad web permite que todas las personas puedan percibir, entender, navegar e interactuar con la web. OpenBlind integra lectores de pantalla, comandos de voz y sintetizadores de voz para garantizar un acceso equitativo y sin barreras.": {
    "en-US": "Web accessibility allows everyone to perceive, understand, navigate, and interact with the web. OpenBlind integrates screen readers, voice commands, and speech synthesizers to ensure equal and barrier-free access.",
    "pt-BR": "A acessibilidade web permite que todas as pessoas possam perceber, entender, navegar e interagir com a web. O OpenBlind integra leitores de tela, comandos de voz e sintetizadores de voz para garantir um acesso igualitário e sem barreiras.",
    "es-ES": "La accesibilidad web permite que todas las personas puedan percibir, entender, navegar e interactuar con la web. OpenBlind integra lectores de pantalla, comandos de voz y sintetizadores de voz para garantizar un acceso equitativo y sin barreras.",
    "es-MX": "La accesibilidad web permite que todas las personas puedan percibir, entender, navegar e interactuar con la web. OpenBlind integra lectores de pantalla, comandos de voz y sintetizadores de voz para garantizar un acceso equitativo y sin barreras.",
  },
  "Puedes presionar el botón de micrófono o usar los comandos de voz en español para navegar por la aplicación. Di 'Ir a módulos' para explorar los cursos o 'Ir a accesibilidad' para cambiar el idioma y el contraste.": {
    "en-US": "You can click the microphone button or use voice commands to navigate the application. Say 'Go to modules' to explore courses or 'Go to accessibility' to change language and contrast.",
    "pt-BR": "Você pode pressionar o botão do microfone ou usar comandos de voz para navegar pelo aplicativo. Diga 'Ir para módulos' para explorar os cursos ou 'Ir para acessibilidade' para alterar o idioma e o contraste.",
    "es-ES": "Puedes presionar el botón de micrófono o usar los comandos de voz en español para navegar por la aplicación. Di 'Ir a módulos' para explorar los cursos o 'Ir a accesibilidad' para cambiar el idioma y el contraste.",
    "es-MX": "Puedes presionar el botón de micrófono o usar los comandos de voz en español para navegar por la aplicación. Di 'Ir a módulos' para explorar los cursos o 'Ir a accesibilidad' para cambiar el idioma y el contraste.",
  },
  "En la cima de un acantilado cubierto de niebla, un viejo faro iluminaba las olas del océano. Cada destello guiaba a los navegantes en la noche estrellada.": {
    "en-US": "At the top of a fog-covered cliff, an old lighthouse illuminated the ocean waves. Each flash guided sailors through the starry night.",
    "pt-BR": "No topo de um penhasco coberto de névoa, um velho farol iluminava as ondas do oceano. Cada clarão guiava os navegantes na noite estrelada.",
    "es-ES": "En la cima de un acantilado cubierto de niebla, un viejo faro iluminaba las olas del océano. Cada destello guiaba a los navegantes en la noche estrellada.",
    "es-MX": "En la cima de un acantilado cubierto de niebla, un viejo faro iluminaba las olas del océano. Cada destello guiaba a los navegantes en la noche estrellada.",
  },
};

export async function autoTranslateText(text: string, targetLang: string): Promise<string> {
  if (!text || !text.trim()) return "";
  if (targetLang.startsWith("es")) return text;

  const trimmed = text.trim();

  if (OFF_LINE_SENTENCE_MAP[trimmed] && OFF_LINE_SENTENCE_MAP[trimmed][targetLang]) {
    return OFF_LINE_SENTENCE_MAP[trimmed][targetLang];
  }

  const targetLangCode = targetLang.split("-")[0];

  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=es|${targetLangCode}`
    );
    if (res.ok) {
      const data = await res.json();
      if (data && data.responseData && data.responseData.translatedText) {
        return data.responseData.translatedText;
      }
    }
  } catch (e) {
    console.warn("Translation API offline, using fallback", e);
  }

  if (targetLangCode === "en") {
    return `[EN] ${trimmed}`;
  } else if (targetLangCode === "pt") {
    return `[PT] ${trimmed}`;
  }
  return trimmed;
}

