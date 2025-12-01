'use client';

import styles from './page.module.css';

// Layout is loaded from public/default.json at build time
import layoutData from '@/public/default.json';

export default function Home() {
  const subjects = layoutData.subjects as Subject[];

  const handleMigrate = () => {
    // Collect grades from localStorage (old format: ${subjectId}-grades)
    const grades: { [subjectId: string]: { [weightId: string]: string } } = {};
    
    subjects.forEach((subject) => {
      const savedGrades = localStorage.getItem(`${subject.id}-grades`);
      if (savedGrades) {
        try {
          grades[subject.id] = JSON.parse(savedGrades);
        } catch (e) {
          console.error(`Error parsing grades for ${subject.id}:`, e);
        }
      }
    });

    // Create migration data
    const migrationData = {
      layout: {
        subjects: subjects
      },
      grades: grades
    };

    // Encode to base64 (UTF-8 safe)
    const jsonString = JSON.stringify(migrationData);
    const bytes = new TextEncoder().encode(jsonString);
    const binaryString = Array.from(bytes, byte => String.fromCharCode(byte)).join('');
    const base64 = btoa(binaryString);

    // Redirect to new site with data
    window.location.href = `https://notas.bygrilinho.dev/import?data=${base64}`;
  };

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <h1>⚠️ Site em Migração</h1>
        
        <div className={styles.message}>
          <p>Este site foi migrado para um novo endereço:</p>
          <p className={styles.newUrl}>
            <a href="https://notas.bygrilinho.dev" target="_blank" rel="noopener noreferrer">
              notas.bygrilinho.dev
            </a>
          </p>
        </div>

        <div className={styles.instructions}>
          <h2>Migrar seus dados</h2>
          <p>Clique no botão abaixo para ir ao novo site com suas notas.</p>
          
          <button onClick={handleMigrate} className={styles.exportButton}>
            Ir para o Novo Site com Meus Dados
          </button>
        </div>

        <div className={styles.footer}>
          <p>Este site será desativado em breve.</p>
          <a href="https://github.com/Bygrilinho/notaseep" aria-label="Ver no GitHub">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.43 9.8 8.2 11.4.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.5-1.3-1.2-1.7-1.2-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 1.7 2.6 1 3.2.8.1-.7.4-1.1.7-1.4-2.5-.3-5-1.3-5-5.8 0-1.3.5-2.4 1.1-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2.9-.3 1.9-.4 2.9-.4s2 .1 2.9.4c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.6.8 1.1 1.9 1.1 3.2 0 4.5-2.5 5.5-5 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.8-1.6 8.2-6.1 8.2-11.4C24 5.37 18.63 0 12 0z"
              />
            </svg>
          </a>
        </div>
      </div>
    </main>
  );
}
