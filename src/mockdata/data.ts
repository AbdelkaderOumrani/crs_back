import { IFormation } from '../models/formation';

export const dataSkills: string[] = [
  'ANDROID-STUDIO',
  'FINANCE',
  'STATISTIQUES',
  'FIGMA',
];

export const formationsData = [
  {
    title: 'Mobile dev with flutter',
    courses: [
      {
        skill: 'DART',
        aquiredLevel: 1,
        prerequisite: 1,
      },
      {
        skill: 'FLUTTER',
        aquiredLevel: 2,
        prerequisite: 2,
      },
      {
        skill: 'ANDROID-STUDIO',
        aquiredLevel: 1,
        prerequisite: 3,
      },
      {
        skill: 'FIGMA',
        aquiredLevel: 1,
        prerequisite: 3,
      },
    ],
    image:
      'https://images.frandroid.com/wp-content/uploads/2018/09/flutter.png',
  },
  {
    title: 'Python for Finance',
    courses: [
      {
        skill: 'PYTHON',
        aquiredLevel: 1,
        prerequisite: 1,
      },
      {
        skill: 'Statistique',
        aquiredLevel: 2,
        prerequisite: 1,
      },
      {
        skill: 'Probabilite',
        aquiredLevel: 1,
        prerequisite: 3,
      },
      {
        skill: 'Finance',
        aquiredLevel: 1,
        prerequisite: 4,
      },
    ],
    image:
      'https://londonbes.education/Media/Uploads/courses/python-for-finance.jpg',
  },
];

// python
// java
// c
// c+
// c#
// statistique
// proba
