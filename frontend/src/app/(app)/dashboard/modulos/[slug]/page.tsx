import ModuleSlugClient from "./ModuleSlugClient";

export async function generateStaticParams() {
  return [
    { slug: "aprendizaje" },
    { slug: "noticias" },
    { slug: "audiolibros" },
    { slug: "lectura" },
    { slug: "navegacion" },
    { slug: "formacion" },
  ];
}

export default function ModuleSlugPage() {
  return <ModuleSlugClient />;
}
