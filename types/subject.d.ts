type Weight = {
  id: string;
  name: string;
  value: number;
  date?: string[];
};

type Subject = {
  id: string;
  name: string;
  weights: Weight[];
};

type Data = {
  subjects: Subject[];
};