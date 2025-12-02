'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useLayout } from '@/contexts/LayoutContext';
import styles from './subject.module.css';

interface MissingGrade {
  input: HTMLInputElement;
  weight: number;
}

function SubjectComponent({ subject, index }: { subject: Subject, index: number }) {
  const [average, setAverage] = useState(0);
  const gradeRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const { grades, setGrade, setEditingSubjectId } = useLayout();

  const { id, name, weights } = subject;
  const subjectGrades = useMemo(() => grades[id] || {}, [grades, id]);

  const calculateAverage = useCallback(() => {
    const missingGrades: MissingGrade[] = [];
    const gradeValues = weights.map((weight) => {
      const gradeInput = gradeRefs.current[`${id}-${weight.id}`];
      if (!gradeInput?.value) {
        if (gradeInput) missingGrades.push({ input: gradeInput, weight: weight.value });
        return 0;
      }
      return parseFloat(gradeInput.value.replace(',', '.')) * weight.value;
    });

    const sum = gradeValues.reduce((acc, grade) => acc + grade, 0);

    setAverage(sum);

    // Handle missing grades and placeholders
    if (missingGrades.length === 1) {
      const minGrade = (5 - sum) / missingGrades[0].weight;
      let placeholder = '';
      if (minGrade < 0) {
        placeholder = 'Min: 0';
      } else {
        placeholder = `Min: ${minGrade.toPrecision(3)}`;
      }
      missingGrades[0].input.placeholder = placeholder;
    } else {
      missingGrades.forEach((grade) => {
        grade.input.placeholder = '';
      });
    }
  }, [id, weights]);

  const handleGradeInput = useCallback((weightId: string, value: string) => {
    setGrade(id, weightId, value);
    calculateAverage();
  }, [id, setGrade, calculateAverage]);

  // Load grades from context and recalculate
  useEffect(() => {
    weights.forEach((weight) => {
      const gradeKey = `${id}-${weight.id}`;
      if (gradeRefs.current[gradeKey] && subjectGrades[weight.id]) {
        gradeRefs.current[gradeKey]!.value = subjectGrades[weight.id];
      }
    });
    calculateAverage();
  }, [id, weights, subjectGrades, calculateAverage]);

  return (
    <div className={styles.subject}>
      <h2 className={styles.subjectHeader}>
        <span className={styles.dot} style={{ backgroundColor: `var(--subject-dot-${index})` }} />
        {name}&nbsp;
        <button 
          className={styles.editBtn} 
          onClick={() => setEditingSubjectId(id)}
          aria-label="Editar disciplina"
        >
          <svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <g>
              <path fill="none" d="M0 0h24v24H0z"/>
              <path d="M15.728 9.686l-1.414-1.414L5 17.586V19h1.414l9.314-9.314zm1.414-1.414l1.414-1.414-1.414-1.414-1.414 1.414 1.414 1.414zM7.242 21H3v-4.243L16.435 3.322a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414L7.243 21z" fill="currentColor"/>
            </g>
          </svg>
        </button>
      </h2>
      <div className={styles.grades} id={id}>
        {weights.map((weight) => (
          <div className={styles.grade} key={weight.id}>
            <label htmlFor={`${id}-${weight.id}`}>{weight.name}</label>
            <div className={styles.content}>
              <input
                type="text"
                id={`${id}-${weight.id}`}
                ref={(el) => { gradeRefs.current[`${id}-${weight.id}`] = el; }}
                onInput={(e) => handleGradeInput(weight.id, (e.target as HTMLInputElement).value)}
              />
              <p className={styles.weight}>{weight.value*100}%</p>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.resultContainer}>
        <p className={styles.label}>Média:</p>
        <p className={`${styles.value} ${parseFloat(average.toPrecision(3)) >= 5 ? styles.pass : styles.fail}`} id={`${id}-result`}>{average.toPrecision(3)}</p>
      </div>
    </div>
  );
}

export default SubjectComponent;