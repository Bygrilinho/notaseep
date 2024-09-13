'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import styles from './subject.module.css';

interface MissingGrade {
  input: HTMLInputElement;
  weight: number;
}

function SubjectComponent({ subject }: { subject: Subject }) {
  const [average, setAverage] = useState(0);
  const gradeRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const { id, name, weights } = subject;

  const calculateAverage = useCallback(() => {
    let missingGrades: MissingGrade[] = [];
    const grades = weights.map((weight) => {
      const grade = gradeRefs.current[`${id}-${weight.id}`];
      if (!grade?.value) {
        if (grade) missingGrades.push({ input: grade, weight: weight.value });
        return 0;
      }
      return parseFloat(grade.value.replace(',', '.')) * weight.value;
    });

    const sum = grades.reduce((acc, grade) => acc + grade, 0);
    const totalWeight = weights.reduce((acc, weight) => acc + weight.value, 0);

    setAverage(sum / totalWeight);

    // Save grades to localStorage
    const gradesToSave: { [key: string]: string } = {};
    weights.forEach((weight) => {
      const gradeKey = `${id}-${weight.id}`;
      const grade = gradeRefs.current[gradeKey];
      if (grade && grade.value !== '') {
        gradesToSave[weight.id] = grade.value;
      }
    });
    if (Object.keys(gradesToSave).length === 0) {
      localStorage.removeItem(`${id}-grades`);
    } else {
      localStorage.setItem(`${id}-grades`, JSON.stringify(gradesToSave));
    }

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

  useEffect(() => {
    const savedGrades = localStorage.getItem(`${id}-grades`);
    if (savedGrades) {
      const parsedGrades = JSON.parse(savedGrades);
      weights.forEach((weight) => {
        const gradeKey = `${id}-${weight.id}`;
        if (gradeRefs.current[gradeKey] && parsedGrades[weight.id]) {
          gradeRefs.current[gradeKey]!.value = parsedGrades[weight.id];
        }
      });
      calculateAverage(); // Recalculate the average with the saved values
    }
  }, [id, weights, calculateAverage]);

  return (
    <div className={styles.subject}>
      <h2>{name}</h2>
      <div className={styles.grades} id={id}>
        {weights.map((weight) => (
          <div className={styles.grade} key={weight.id}>
            <label htmlFor={`${id}-${weight.id}`}>{weight.id.toUpperCase()}:</label>
            <input
              type="text"
              id={`${id}-${weight.id}`}
              ref={(el) => { gradeRefs.current[`${id}-${weight.id}`] = el; }}
              onInput={calculateAverage} // Trigger recalculation and save on input
            />
            <p className={styles.weight}>{weight.value*100}%</p>
          </div>
        ))}
        <p id={`${id}-result`}>Média: {average.toPrecision(3)}</p>
      </div>
    </div>
  );
}

export default SubjectComponent;