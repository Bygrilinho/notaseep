'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLayout } from '@/contexts/LayoutContext';
import styles from './url-import.module.css';

interface MigrationData {
  layout: {
    subjects: Subject[];
  };
  grades: {
    [subjectId: string]: {
      [weightId: string]: string;
    };
  };
}

export default function UrlImport() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { subjects, importFullData } = useLayout();
  
  const [status, setStatus] = useState<'loading' | 'confirm' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');
  const [migrationData, setMigrationData] = useState<MigrationData | null>(null);

  useEffect(() => {
    const data = searchParams.get('data');
    
    if (!data) {
      setError('Nenhum dado encontrado na URL.');
      setStatus('error');
      return;
    }

    try {
      // Decode base64 to UTF-8
      const binaryString = atob(data);
      const bytes = Uint8Array.from(binaryString, char => char.charCodeAt(0));
      const decoded = new TextDecoder('utf-8').decode(bytes);
      const parsed: MigrationData = JSON.parse(decoded);
      
      // Validate structure
      if (!parsed.layout?.subjects || !Array.isArray(parsed.layout.subjects)) {
        throw new Error('Formato inválido: layout.subjects não encontrado');
      }
      
      if (!parsed.grades || typeof parsed.grades !== 'object') {
        throw new Error('Formato inválido: grades não encontrado');
      }

      setMigrationData(parsed);
      setStatus('confirm');
    } catch (e) {
      console.error('Migration error:', e);
      setError(e instanceof Error ? e.message : 'Erro ao decodificar dados');
      setStatus('error');
    }
  }, [searchParams]);

  const handleImport = () => {
    if (!migrationData) return;
    
    try {
      importFullData(migrationData.layout.subjects, migrationData.grades);
      setStatus('success');
      
      // Redirect to home after 2 seconds
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (e) {
      console.error('Import error:', e);
      setError('Erro ao importar dados');
      setStatus('error');
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  if (status === 'loading') {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h2>Carregando...</h2>
          <p>Processando dados de migração...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.errorTitle}>Erro na Migração</h2>
          <p className={styles.errorMessage}>{error}</p>
          <button onClick={handleCancel} className={styles.button}>
            Voltar para a página inicial
          </button>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.successTitle}>Migração Concluída!</h2>
          <p>Seus dados foram importados com sucesso.</p>
          <p className={styles.redirect}>Redirecionando...</p>
        </div>
      </div>
    );
  }

  // status === 'confirm'
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Importar Dados</h2>
        <p>Foram encontrados dados do site anterior:</p>
        
        <div className={styles.summary}>
          <p><strong>{migrationData?.layout.subjects.length || 0}</strong> disciplinas</p>
          <p><strong>{Object.keys(migrationData?.grades || {}).length}</strong> disciplinas com notas</p>
        </div>

        {subjects.length > 0 && (
          <div className={styles.warning}>
            <p>⚠️ Atenção: Você já possui {subjects.length} disciplinas cadastradas.</p>
            <p>A importação irá <strong>substituir</strong> todos os dados existentes.</p>
          </div>
        )}

        <div className={styles.actions}>
          <button onClick={handleImport} className={styles.primaryButton}>
            Importar Dados
          </button>
          <button onClick={handleCancel} className={styles.secondaryButton}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
