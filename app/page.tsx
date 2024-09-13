import Subject from "@/components/subject";

import fs from 'fs';
import path from 'path';

export default function Home() {
  const filePath = path.join(process.cwd(), 'public', 'default.json');

  let data: Data;

  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error('Error reading JSON file:', error);
    return <div>Erro ao carregar.</div>;
  }

  const { subjects } = data;

  return (
    <main>
      <h1>Calculadora de Notas</h1>
      <div>
        {subjects.map((subject: Subject) => (
          <Subject key={subject.id} subject={subject} />
        ))}
      </div>
      <a href="https://github.com/Bygrilinho/notaseep">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.43 9.8 8.2 11.4.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.5-1.3-1.2-1.7-1.2-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 1.7 2.6 1 3.2.8.1-.7.4-1.1.7-1.4-2.5-.3-5-1.3-5-5.8 0-1.3.5-2.4 1.1-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2.9-.3 1.9-.4 2.9-.4s2 .1 2.9.4c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.6.8 1.1 1.9 1.1 3.2 0 4.5-2.5 5.5-5 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.8-1.6 8.2-6.1 8.2-11.4C24 5.37 18.63 0 12 0z"
          />
        </svg>
      </a>
    </main>
  );
}
