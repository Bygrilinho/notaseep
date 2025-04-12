type Weight = {
  id: string;
  name: string;
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