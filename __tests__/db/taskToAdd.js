export const taskToAdd = {
  _id: 1,
  title: 'Launch version one',
  description: '',
  status: 'Doing',
  subtasks: [
    {
      _id: 1,
      title: 'Launch privately to our waitlist',
      isCompleted: false,
    },
    {
      _id: 2,
      title: 'Launch publicly on PH, HN, etc.',
      isCompleted: false,
    },
  ],
};
