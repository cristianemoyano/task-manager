export const boardsDB = [
  {
    _id: 1,
    name: 'Platform Launch',
    columns: [
      {
        _id: 1,
        name: 'Todo',
        tasks: [
          {
            _id: 1,
            title: 'Build UI for onboarding flow',
            description: '',
            status: 'Todo',
            subtasks: [
              {
                _id: 1,
                title: 'Sign up page',
                isCompleted: true,
              },
              {
                _id: 2,
                title: 'Sign in page',
                isCompleted: false,
              },
              {
                _id: 3,
                title: 'Welcome page',
                isCompleted: false,
              },
            ],
          },
          {
            _id: 2,
            title: 'Build UI for search',
            description: '',
            status: 'Todo',
            subtasks: [
              {
                _id: 1,
                title: 'Search page',
                isCompleted: false,
              },
            ],
          },
          {
            _id: 3,
            title: 'Build settings UI',
            description: '',
            status: 'Todo',
            subtasks: [
              {
                _id: 1,
                title: 'Account page',
                isCompleted: false,
              },
              {
                _id: 2,
                title: 'Billing page',
                isCompleted: false,
              },
            ],
          },
          {
            _id: 1,
            title: 'QA and test all major user journeys',
            description:
              'Once we feel version one is ready, we need to rigorously test it both internally and externally to identify any major gaps.',
            status: 'Todo',
            subtasks: [
              {
                _id: 1,
                title: 'Internal testing',
                isCompleted: false,
              },
              {
                _id: 2,
                title: 'External testing',
                isCompleted: false,
              },
            ],
          },
        ],
      },
      {
        _id: 2,
        name: 'Doing',
        tasks: [
          {
            _id: 1,
            title: 'Design settings and search pages',
            description: '',
            status: 'Doing',
            subtasks: [
              {
                _id: 1,
                title: 'Settings - Account page',
                isCompleted: true,
              },
              {
                _id: 2,
                title: 'Settings - Billing page',
                isCompleted: true,
              },
              {
                _id: 3,
                title: 'Search page',
                isCompleted: false,
              },
            ],
          },
          {
            _id: 2,
            title: 'Add account management endpoints',
            description: '',
            status: 'Doing',
            subtasks: [
              {
                _id: 1,
                title: 'Upgrade plan',
                isCompleted: true,
              },
              {
                _id: 2,
                title: 'Cancel plan',
                isCompleted: true,
              },
              {
                _id: 3,
                title: 'Update payment method',
                isCompleted: false,
              },
            ],
          },
          {
            _id: 3,
            title: 'Design onboarding flow',
            description: '',
            status: 'Doing',
            subtasks: [
              {
                _id: 1,
                title: 'Sign up page',
                isCompleted: true,
              },
              {
                _id: 2,
                title: 'Sign in page',
                isCompleted: false,
              },
              {
                _id: 3,
                title: 'Welcome page',
                isCompleted: false,
              },
            ],
          },
          {
            _id: 4,
            title: 'Add search enpoints',
            description: '',
            status: 'Doing',
            subtasks: [
              {
                _id: 1,
                title: 'Add search endpoint',
                isCompleted: true,
              },
              {
                _id: 2,
                title: 'Define search filters',
                isCompleted: false,
              },
            ],
          },
          {
            _id: 5,
            title: 'Add authentication endpoints',
            description: '',
            status: 'Doing',
            subtasks: [
              {
                _id: 1,
                title: 'Define user model',
                isCompleted: true,
              },
              {
                _id: 2,
                title: 'Add auth endpoints',
                isCompleted: false,
              },
            ],
          },
          {
            _id: 6,
            title:
              'Research pricing points of various competitors and trial different business models',
            description:
              "We know what we're planning to build for version one. Now we need to finalise the first pricing model we'll use. Keep iterating the subtasks until we have a coherent proposition.",
            status: 'Doing',
            subtasks: [
              {
                _id: 1,
                title: 'Research competitor pricing and business models',
                isCompleted: true,
              },
              {
                _id: 2,
                title: 'Outline a business model that works for our solution',
                isCompleted: false,
              },
              {
                _id: 3,
                title:
                  'Talk to potential customers about our proposed solution and ask for fair price expectancy',
                isCompleted: false,
              },
            ],
          },
        ],
      },
      {
        _id: 3,
        name: 'Done',
        tasks: [
          {
            _id: 1,
            title: 'Conduct 5 wireframe tests',
            description:
              'Ensure the layout continues to make sense and we have strong buy-in from potential users.',
            status: 'Done',
            subtasks: [
              {
                _id: 1,
                title: 'Complete 5 wireframe prototype tests',
                isCompleted: true,
              },
            ],
          },
          {
            _id: 2,
            title: 'Create wireframe prototype',
            description:
              'Create a greyscale clickable wireframe prototype to test our asssumptions so far.',
            status: 'Done',
            subtasks: [
              {
                _id: 1,
                title: 'Create clickable wireframe prototype in Balsamiq',
                isCompleted: true,
              },
            ],
          },
          {
            _id: 3,
            title: 'Review results of usability tests and iterate',
            description:
              "Keep iterating through the subtasks until we're clear on the core concepts for the app.",
            status: 'Done',
            subtasks: [
              {
                _id: 1,
                title:
                  'Meet to review notes from previous tests and plan changes',
                isCompleted: true,
              },
              {
                _id: 2,
                title: 'Make changes to paper prototypes',
                isCompleted: true,
              },
              {
                _id: 3,
                title: 'Conduct 5 usability tests',
                isCompleted: true,
              },
            ],
          },
          {
            _id: 4,
            title:
              'Create paper prototypes and conduct 10 usability tests with potential customers',
            description: '',
            status: 'Done',
            subtasks: [
              {
                _id: 1,
                title: 'Create paper prototypes for version one',
                isCompleted: true,
              },
              {
                _id: 2,
                title: 'Complete 10 usability tests',
                isCompleted: true,
              },
            ],
          },
          {
            _id: 5,
            title: 'Market discovery',
            description:
              'We need to define and refine our core product. Interviews will help us learn common pain points and help us define the strongest MVP.',
            status: 'Done',
            subtasks: [
              {
                _id: 1,
                title: 'Interview 10 prospective customers',
                isCompleted: true,
              },
            ],
          },
          {
            _id: 6,
            title: 'Competitor analysis',
            description: '',
            status: 'Done',
            subtasks: [
              {
                _id: 1,
                title: 'Find direct and indirect competitors',
                isCompleted: true,
              },
              {
                _id: 2,
                title: 'SWOT analysis for each competitor',
                isCompleted: true,
              },
            ],
          },
          {
            _id: 7,
            title: 'Research the market',
            description:
              'We need to get a solid overview of the market to ensure we have up-to-date estimates of market size and demand.',
            status: 'Done',
            subtasks: [
              {
                _id: 1,
                title: 'Write up research analysis',
                isCompleted: true,
              },
              { _id: 2, title: 'Calculate TAM', isCompleted: true },
            ],
          },
        ],
      },
    ],
  },
];
