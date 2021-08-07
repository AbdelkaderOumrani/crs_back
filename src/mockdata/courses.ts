interface ICourse {
  code: string;
  title: string;
  term: number;
  optional: boolean;
  specialities: string;
}

const courses: ICourse[] = [
  {
    code: "CMPT101",
    title: "Computer Introduction",
    term: 1,
    optional: false,
    specialities: "informatique",
  },
];
