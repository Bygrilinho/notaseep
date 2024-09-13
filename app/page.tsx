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
    </main>
  );
}
