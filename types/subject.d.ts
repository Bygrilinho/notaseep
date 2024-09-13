type Weight = {
  id: string;
  value: number;
};

type Subject = {
  id: string;
  name: string;
  weights: Weight[];
};

type Data = {
  subjects: Subject[];
};