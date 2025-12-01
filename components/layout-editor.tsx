'use client';

import { useState, useRef } from 'react';
import { useLayout } from '@/contexts/LayoutContext';
import styles from './layout-editor.module.css';

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

interface WeightEditorProps {
  weight: Weight;
  onUpdate: (weight: Weight) => void;
  onDelete: () => void;
}

function WeightEditor({ weight, onUpdate, onDelete }: WeightEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(weight.name);
  const [value, setValue] = useState((weight.value * 100).toString());
  const [date, setDate] = useState(weight.date || '');

  const handleSave = () => {
    const parsedValue = parseFloat(value) / 100;
    if (isNaN(parsedValue) || parsedValue <= 0) {
      alert('Peso deve ser um número maior que 0');
      return;
    }
    onUpdate({
      ...weight,
      name,
      value: parsedValue,
      date: date.trim() || undefined,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(weight.name);
    setValue((weight.value * 100).toString());
    setDate(weight.date || '');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className={styles.weightItem}>
        <div className={styles.weightFields}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome"
            className={styles.input}
          />
          <div className={styles.weightValueContainer}>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Peso"
              className={styles.inputSmall}
              min="0"
              max="100"
            />
            <span>%</span>
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={styles.inputDate}
          />
        </div>
        <div className={styles.buttonGroup}>
          <button onClick={handleSave} className={styles.saveBtn}>Salvar</button>
          <button onClick={handleCancel} className={styles.cancelBtn}>Cancelar</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.weightItem}>
      <div className={styles.weightInfo}>
        <span className={styles.weightName}>{weight.name}</span>
        <span className={styles.weightValue}>{weight.value * 100}%</span>
        {weight.date && <span className={styles.weightDate}>{weight.date}</span>}
      </div>
      <div className={styles.buttonGroup}>
        <button onClick={() => setIsEditing(true)} className={styles.editBtn}>Editar</button>
        <button onClick={onDelete} className={styles.deleteBtn}>Excluir</button>
      </div>
    </div>
  );
}

interface SubjectEditorProps {
  subject: Subject;
  onClose: () => void;
}

function SubjectEditor({ subject, onClose }: SubjectEditorProps) {
  const { updateSubject, deleteSubject } = useLayout();
  const [name, setName] = useState(subject.name);
  const [weights, setWeights] = useState<Weight[]>(subject.weights);
  const [newWeightName, setNewWeightName] = useState('');
  const [newWeightValue, setNewWeightValue] = useState('');
  const [newWeightDate, setNewWeightDate] = useState('');

  const handleSave = () => {
    if (!name.trim()) {
      alert('Nome da disciplina é obrigatório');
      return;
    }
    updateSubject(subject.id, { ...subject, name, weights });
    onClose();
  };

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja excluir esta disciplina?')) {
      deleteSubject(subject.id);
      onClose();
    }
  };

  const handleAddWeight = () => {
    if (!newWeightName.trim()) {
      alert('Nome da avaliação é obrigatório');
      return;
    }
    const parsedValue = parseFloat(newWeightValue) / 100;
    if (isNaN(parsedValue) || parsedValue <= 0) {
      alert('Peso deve ser um número maior que 0');
      return;
    }
    setWeights([...weights, {
      id: generateId(),
      name: newWeightName,
      value: parsedValue,
      date: newWeightDate.trim() || undefined,
    }]);
    setNewWeightName('');
    setNewWeightValue('');
    setNewWeightDate('');
  };

  const handleUpdateWeight = (index: number, weight: Weight) => {
    const newWeights = [...weights];
    newWeights[index] = weight;
    setWeights(newWeights);
  };

  const handleDeleteWeight = (index: number) => {
    setWeights(weights.filter((_, i) => i !== index));
  };

  const totalWeight = weights.reduce((acc, w) => acc + w.value, 0);

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3>Editar Disciplina</h3>
        <div className={styles.field}>
          <label>Nome da Disciplina</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.weightsSection}>
          <h4>Avaliações ({(totalWeight * 100).toFixed(1)}% de 100%)</h4>
          <div className={styles.weightsList}>
            {weights.map((weight, index) => (
              <WeightEditor
                key={weight.id}
                weight={weight}
                onUpdate={(w) => handleUpdateWeight(index, w)}
                onDelete={() => handleDeleteWeight(index)}
              />
            ))}
          </div>

          <div className={styles.addWeight}>
            <h5>Adicionar Avaliação</h5>
            <div className={styles.addWeightFields}>
              <input
                type="text"
                value={newWeightName}
                onChange={(e) => setNewWeightName(e.target.value)}
                placeholder="Nome"
                className={styles.input}
              />
              <div className={styles.weightValueContainer}>
                <input
                  type="number"
                  value={newWeightValue}
                  onChange={(e) => setNewWeightValue(e.target.value)}
                  placeholder="Peso"
                  className={styles.inputSmall}
                  min="0"
                  max="100"
                />
                <span>%</span>
              </div>
              <input
                type="date"
                value={newWeightDate}
                onChange={(e) => setNewWeightDate(e.target.value)}
                className={styles.inputDate}
              />
              <button onClick={handleAddWeight} className={styles.addBtn}>Adicionar</button>
            </div>
          </div>
        </div>

        <div className={styles.modalActions}>
          <button onClick={handleSave} className={styles.saveBtn}>Salvar Alterações</button>
          <button onClick={handleDelete} className={styles.deleteBtn}>Excluir Disciplina</button>
          <button onClick={onClose} className={styles.cancelBtn}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

interface NewSubjectModalProps {
  onClose: () => void;
}

function NewSubjectModal({ onClose }: NewSubjectModalProps) {
  const { addSubject } = useLayout();
  const [name, setName] = useState('');
  const [weights, setWeights] = useState<Weight[]>([]);
  const [newWeightName, setNewWeightName] = useState('');
  const [newWeightValue, setNewWeightValue] = useState('');
  const [newWeightDate, setNewWeightDate] = useState('');

  const handleCreate = () => {
    if (!name.trim()) {
      alert('Nome da disciplina é obrigatório');
      return;
    }
    if (weights.length === 0) {
      alert('Adicione pelo menos uma avaliação');
      return;
    }
    addSubject({
      id: generateId(),
      name,
      weights,
    });
    onClose();
  };

  const handleAddWeight = () => {
    if (!newWeightName.trim()) {
      alert('Nome do peso é obrigatório');
      return;
    }
    const parsedValue = parseFloat(newWeightValue) / 100;
    if (isNaN(parsedValue) || parsedValue <= 0) {
      alert('Peso deve ser um número maior que 0');
      return;
    }
    setWeights([...weights, {
      id: generateId(),
      name: newWeightName,
      value: parsedValue,
      date: newWeightDate.trim() || undefined,
    }]);
    setNewWeightName('');
    setNewWeightValue('');
    setNewWeightDate('');
  };

  const handleDeleteWeight = (index: number) => {
    setWeights(weights.filter((_, i) => i !== index));
  };

  const totalWeight = weights.reduce((acc, w) => acc + w.value, 0);

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3>Nova Disciplina</h3>
        <div className={styles.field}>
          <label>Nome da Disciplina</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
            autoFocus
          />
        </div>

        <div className={styles.weightsSection}>
          <h4>Avaliações ({(totalWeight * 100).toFixed(1)}% de 100%)</h4>
          <div className={styles.weightsList}>
            {weights.map((weight, index) => (
              <div key={weight.id} className={styles.weightItem}>
                <div className={styles.weightInfo}>
                  <span className={styles.weightName}>{weight.name}</span>
                  <span className={styles.weightValue}>{weight.value * 100}%</span>
                  {weight.date && <span className={styles.weightDate}>{weight.date}</span>}
                </div>
                <button onClick={() => handleDeleteWeight(index)} className={styles.deleteBtn}>Excluir</button>
              </div>
            ))}
          </div>

          <div className={styles.addWeight}>
            <h5>Adicionar Avaliação</h5>
            <div className={styles.addWeightFields}>
              <input
                type="text"
                value={newWeightName}
                onChange={(e) => setNewWeightName(e.target.value)}
                placeholder="Nome"
                className={styles.input}
              />
              <div className={styles.weightValueContainer}>
                <input
                  type="number"
                  value={newWeightValue}
                  onChange={(e) => setNewWeightValue(e.target.value)}
                  placeholder="Peso"
                  className={styles.inputSmall}
                  min="0"
                  max="100"
                />
                <span>%</span>
              </div>
              <input
                type="date"
                value={newWeightDate}
                onChange={(e) => setNewWeightDate(e.target.value)}
                className={styles.inputDate}
              />
              <button onClick={handleAddWeight} className={styles.addBtn}>Adicionar</button>
            </div>
          </div>
        </div>

        <div className={styles.modalActions}>
          <button onClick={handleCreate} className={styles.saveBtn}>Criar Disciplina</button>
          <button onClick={onClose} className={styles.cancelBtn}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default function LayoutEditor() {
  const { subjects, exportLayout, importLayout, clearAllData } = useLayout();
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [showNewSubject, setShowNewSubject] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await importLayout(file);
      } catch (error) {
        alert('Erro ao importar arquivo. Verifique o formato.');
        console.error(error);
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClear = () => {
    if (confirm('Tem certeza que deseja apagar todos os dados? Esta ação não pode ser desfeita.')) {
      clearAllData();
    }
  };

  return (
    <div className={styles.editorContainer}>
      <div className={styles.toolbar}>
        <button onClick={() => setShowNewSubject(true)} className={styles.primaryBtn}>
          + Nova Disciplina
        </button>
        <div className={styles.toolbarRight}>
          <button onClick={exportLayout} className={styles.toolBtn} disabled={subjects.length === 0}>
            Exportar Layout
          </button>
          <button onClick={() => fileInputRef.current?.click()} className={styles.toolBtn}>
            Importar Layout
          </button>
          <button onClick={handleClear} className={styles.dangerBtn} disabled={subjects.length === 0}>
            Limpar Tudo
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".json"
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {subjects.length === 0 && (
        <div className={styles.emptyState}>
          <p>Nenhuma disciplina cadastrada.</p>
          <p>Clique em &quot;Nova Disciplina&quot; para começar ou importe um arquivo JSON.</p>
        </div>
      )}

      <div className={styles.subjectsList}>
        {subjects.map((subject) => (
          <button
            key={subject.id}
            className={styles.subjectChip}
            onClick={() => setEditingSubject(subject)}
          >
            {subject.name}
            <span className={styles.editIcon}>✏️</span>
          </button>
        ))}
      </div>

      {editingSubject && (
        <SubjectEditor
          subject={editingSubject}
          onClose={() => setEditingSubject(null)}
        />
      )}

      {showNewSubject && (
        <NewSubjectModal onClose={() => setShowNewSubject(false)} />
      )}
    </div>
  );
}
