export const initialBoards = [
  {
    _id: 1,
    name: 'Marketing Plan',
    columns: [
      {
        _id: 1,
        name: 'Todo',
        tasks: [
          {
            _id: 1,
            title: 'Plan Product Hunt launch',
            description: '',
            status: 'Todo',
            subtasks: [
              {
                _id: 1,
                title: 'Find hunter',
                isCompleted: false,
              },
              {
                _id: 2,
                title: 'Gather assets',
                isCompleted: false,
              },
              {
                _id: 3,
                title: 'Draft product page',
                isCompleted: false,
              },
              {
                _id: 4,
                title: 'Notify customers',
                isCompleted: false,
              },
              {
                _id: 5,
                title: 'Notify network',
                isCompleted: false,
              },
              {
                _id: 6,
                title: 'Launch!',
                isCompleted: false,
              },
            ],
          },
          {
            _id: 2,
            title: 'Share on Show HN',
            description: '',
            status: '',
            subtasks: [
              {
                _id: 1,
                title: 'Draft out HN post',
                isCompleted: false,
              },
              {
                _id: 2,
                title: 'Get feedback and refine',
                isCompleted: false,
              },
              {
                _id: 3,
                title: 'Publish post',
                isCompleted: false,
              },
            ],
          },
          {
            _id: 3,
            title: 'Write launch article to publish on multiple channels',
            description: '',
            status: '',
            subtasks: [
              {
                _id: 1,
                title: 'Write article',
                isCompleted: false,
              },
              {
                _id: 2,
                title: 'Publish on LinkedIn',
                isCompleted: false,
              },
              {
                _id: 3,
                title: 'Publish on Inndie Hackers',
                isCompleted: false,
              },
              {
                _id: 4,
                title: 'Publish on Medium',
                isCompleted: false,
              },
            ],
          },
        ],
      },
      {
        _id: 2,
        name: 'Doing',
        tasks: [],
      },
      {
        _id: 3,
        name: 'Done',
        tasks: [],
      },
    ],
  },
  {
    _id: 2,
    name: 'Roadmap',
    columns: [
      {
        _id: 1,
        name: 'Now',
        tasks: [
          {
            _id: 1,
            title: 'Launch version one',
            description: '',
            status: 'Now',
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
          },
          {
            _id: 2,
            title: 'Review early feedback and plan next steps for roadmap',
            description:
              "Beyond the initial launch, we're keeping the initial roadmap completely empty. This meeting will help us plan out our next steps based on actual customer feedback.",
            status: 'Now',
            subtasks: [
              {
                _id: 1,
                title: 'Interview 10 customers',
                isCompleted: false,
              },
              {
                _id: 2,
                title: 'Review common customer pain points and suggestions',
                isCompleted: false,
              },
              {
                _id: 3,
                title: 'Outline next steps for our roadmap',
                isCompleted: false,
              },
            ],
          },
        ],
      },
      {
        _id: 2,
        name: 'Next',
        tasks: [],
      },
      {
        _id: 3,
        name: 'Later',
        tasks: [],
      },
    ],
  },
];
