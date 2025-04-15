import React from "react";
import styles from "./calendar.module.css";

function getAllExams(subjects: Subject[]) {
  const exams: { date: string; subject: string; subjectIndex: number }[] = [];
  subjects.forEach((subject, index) => {
    subject.weights.forEach((weight) => {
      if (weight.date) {
        weight.date.forEach((dateStr) => {
          exams.push({ date: dateStr, subject: subject.name, subjectIndex: index });
        });
      }
    });
  });
  return exams;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T12:00:00Z");
  return date.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit"
  }).replace(".", "");
}

function Calendar({ subjects }: { subjects: Subject[] }) {
  const exams = getAllExams(subjects).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className={styles.timelineWrapper}>
      <h2>Próximas Provas</h2>
      <ul className={styles.timelineList}>
        {exams.length === 0 && <li>Nenhuma prova cadastrada.</li>}
        {exams
          .filter((exam) => {
            const examDate = new Date(exam.date);
            const now = new Date();
            examDate.setUTCHours(0, 0, 0, 0);
            now.setUTCHours(0, 0, 0, 0);
            return examDate >= now;
          })
          .map((exam) => (
            <li key={exam.date + exam.subject} className={styles.timelineItem}>
              <span className={styles.timelineDate}>{formatDate(exam.date)}</span>
              <span
                className={styles.dot}
                style={{ backgroundColor: `var(--subject-dot-${exam.subjectIndex})` }}
              ></span>
              <span className={styles.timelineSubject}>{exam.subject}</span>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Calendar;
