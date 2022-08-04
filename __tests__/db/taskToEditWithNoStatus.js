export const taskToEditWithNoStatus = {
  _id: 1,
  title: 'Launch version two',
  description: 'Test description added',
  status: 'Now',
  subtasks: [
    {
      _id: 1,
      title: 'Test launch',
      isCompleted: false,
    },
    {
      _id: 2,
      title: 'Launch publicly on PH, HN, etc.',
      isCompleted: false,
    },
  ],
};
