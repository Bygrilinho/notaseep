import { Suspense } from 'react';
import UrlImport from '@/components/migration/url-import';

export default function ImportPage() {
  return (
    <main>
      <h1>Migração de Dados</h1>
      <Suspense fallback={<div style={{ textAlign: 'center', padding: '2rem' }}>Carregando...</div>}>
        <UrlImport />
      </Suspense>
    </main>
  );
}
