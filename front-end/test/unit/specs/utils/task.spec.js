import utilTask from '@/utils/task'

const mockTestPlan = {
  'name': 'Test results collection',
  'start': '2018-03-18T16:00:00.000Z',
  'end': '2018-04-29T16:00:00.000Z',
  'objective': 'Test results collection',
  'description': 'Test results collection',
  'branch': 'develop',
  'platforms': [
    [
      {
        'value': 'desktop',
        'label': 'Desktop'
      },
      {
        'value': 'chrome',
        'label': 'Chrome'
      }
    ],
    [
      {
        'value': 'desktop',
        'label': 'Desktop'
      },
      {
        'value': 'firefox',
        'label': 'Firefox'
      }
    ],
    [
      {
        'value': 'mobile',
        'label': 'Mobile'
      }
    ],
    [
      {
        'value': 'api',
        'label': 'API'
      }
    ]
  ],
  'testcases': [
    [
      {
        'value': 'qa',
        'label': 'Quality Assurance'
      }
    ],
    [
      {
        'value': 'collaboration',
        'label': 'Enterprise Collaboration'
      },
      {
        'value': 'todo',
        'label': 'ToDo'
      }
    ],
    [
      {
        'value': 'collaboration',
        'label': 'Enterprise Collaboration'
      },
      {
        'value': 'timeline',
        'label': 'Timeline'
      }
    ],
    [
      {
        'value': 'collaboration',
        'label': 'Enterprise Collaboration'
      },
      {
        'value': 'timelinemobile',
        'label': 'Timeline Mobile'
      }
    ]
  ],
  'environment': {
    'url': '',
    'username': '',
    'password': '',
    'inherit': false
  },
  'channel': {
    'name': '',
    'id': '',
    'inherit': false
  },
  'verdict': {
    'result': '',
    'reason': ''
  },
  '_id': '5aaf7baac4c51950743889df',
  'creator': 'li_d',
  'taskCounter': 2,
  'serial': 22,
  'state': 'new',
  '__v': 0,
  'lastUpdatedBy': 'li_d',
  'lastUpdatedAt': '2018-03-19T10:34:08.546Z'
}

const mockTask = {
  '_id': '5aaf7bd4c4c51950743889e0',
  'testPlanId': 22,
  'name': 'Chrome Timeline',
  'start': '2018-03-18T16:00:00.000Z',
  'end': '2018-04-29T16:00:00.000Z',
  'creator': 'li_d',
  'objective': 'Chrome Timeline Login',
  'branch': 'develop',
  'platform': 'chrome',
  'environment': {
    'url': 'https://jillj-develop.hue.worksap.com/',
    'username': 'hue-root',
    'password': 'hue-r00t',
    'inherit': false,
    '_id': '5aaf7bd4c4c51950743889e2'
  },
  'channel': {
    'name': 'taas-test-report',
    'id': 'C5AT4TGR5',
    'inherit': false,
    '_id': '5aaf7bd4c4c51950743889e1'
  },
  'params': [],
  'serial': 1,
  'state': 'in progress',
  '__v': 0,
  'appUrl': null,
  'lastUpdatedBy': 'li_d',
  'lastUpdatedAt': '2018-03-19T10:34:54.068Z',
  'verdict': {
    'result': '',
    'reason': ''
  },
  'testcases': [
    [
      {
        'value': 'collaboration',
        'label': 'Enterprise Collaboration'
      },
      {
        'value': 'timeline',
        'label': 'Timeline'
      }
    ]
  ]
}

const mockTestcasesCascade = [
  {
    'value': 'sre',
    'label': 'SRE',
    'children': [
      {
        'value': 'usersupport',
        'label': 'User@Support',
        'children': [
          {
            'value': {
              'end_line': 45,
              'locator': 'sre.usersupport.personaltags.PersonalTagTest#wapLoginTest',
              'type': 'browser',
              'groups': [
                'Level1'
              ],
              'start_line': 30,
              'name': 'Wap login test'
            },
            'label': 'Wap login test'
          },
          {
            'value': {
              'end_line': 27,
              'locator': 'sre.usersupport.personaltags.PersonalTagTest#customerLoginTest',
              'type': 'browser',
              'groups': [
                'Level1'
              ],
              'start_line': 18,
              'name': 'Customer login test'
            },
            'label': 'Customer login test'
          },
          {
            'value': 'FAQ',
            'label': 'FAQ',
            'children': [
              {
                'value': {
                  'end_line': 69,
                  'locator': 'sre.usersupport.faq.UserSupportFaqReviewDetailTest#HUESPFaqUnderReviewTest',
                  'type': 'browser',
                  'groups': [
                    'FaqReview'
                  ],
                  'start_line': 26,
                  'name': 'FAQ Review Test'
                },
                'label': 'FAQ Review Test'
              },
              {
                'value': {
                  'end_line': 55,
                  'locator': 'sre.usersupport.faq.UserSupportFaqDetailTest#HUESPFaqDetailTest',
                  'type': 'browser',
                  'groups': [
                    'Level4'
                  ],
                  'start_line': 23,
                  'name': 'FAQ Detail Test'
                },
                'label': 'FAQ Detail Test'
              },
              {
                'value': {
                  'end_line': 34,
                  'locator': 'sre.usersupport.faq.UserSupportFaqHistoryTest#HUESPFaqHistoryTest',
                  'type': 'browser',
                  'groups': [
                    'Level4'
                  ],
                  'start_line': 21,
                  'name': 'FAQ History Test'
                },
                'label': 'FAQ History Test'
              },
              {
                'value': {
                  'end_line': 32,
                  'locator': 'sre.usersupport.faq.UserSupportFaqDeleteTest#HUESPFaqDetailTest',
                  'type': 'browser',
                  'groups': [
                    'Level4'
                  ],
                  'start_line': 20,
                  'name': 'FAQ Delete Test'
                },
                'label': 'FAQ Delete Test'
              },
              {
                'value': {
                  'end_line': 31,
                  'locator': 'sre.usersupport.faq.UserSupportFaqFilterTest#HUESPFaqFilterTest',
                  'type': 'browser',
                  'groups': [
                    'Level4'
                  ],
                  'start_line': 19,
                  'name': 'FAQ Filter Test'
                },
                'label': 'FAQ Filter Test'
              },
              {
                'value': {
                  'end_line': 39,
                  'locator': 'sre.usersupport.faq.UserSupportFaqSearchTest#HUESPRegisterNewFaqTest',
                  'type': 'browser',
                  'groups': [
                    'Level4'
                  ],
                  'start_line': 20,
                  'name': 'FAQ Search Test'
                },
                'label': 'FAQ Search Test'
              },
              {
                'value': {
                  'end_line': 43,
                  'locator': 'sre.usersupport.faq.UserSupportFaqRegisterTest#HUESPRegisterNewFaqTest',
                  'type': 'browser',
                  'groups': [
                    'Level4'
                  ],
                  'start_line': 21,
                  'name': 'Register New FAQ Test'
                },
                'label': 'Register New FAQ Test'
              }
            ]
          },
          {
            'value': 'Statistics@WBS',
            'label': 'Statistics@WBS',
            'children': [
              {
                'value': {
                  'end_line': 47,
                  'locator': 'sre.usersupport.projects.UserSupportProjectsCreateProjectTest#HUESPProjectsCreateProjectTest',
                  'type': 'browser',
                  'groups': [
                    'Level4'
                  ],
                  'start_line': 23,
                  'name': 'Create New Project Test'
                },
                'label': 'Create New Project Test'
              }
            ]
          },
          {
            'value': 'Task Table@WBS',
            'label': 'Task Table@WBS',
            'children': [
              {
                'value': {
                  'end_line': 125,
                  'locator': 'sre.usersupport.projects.UserSupportProjectsSimaGridTest#addTeamAndAssignee',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 97,
                  'name': 'Add Team&Assignee for Each Task Test'
                },
                'label': 'Add Team&Assignee for Each Task Test'
              },
              {
                'value': {
                  'end_line': 160,
                  'locator': 'sre.usersupport.projects.UserSupportProjectsSimaGridTest#addManDay',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 148,
                  'name': 'Add Man Day for Each Task Test'
                },
                'label': 'Add Man Day for Each Task Test'
              },
              {
                'value': {
                  'end_line': 309,
                  'locator': 'sre.usersupport.projects.UserSupportProjectsSimaGridTest#openTaskDetailFunction',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 300,
                  'name': 'Open Task Detail Test'
                },
                'label': 'Open Task Detail Test'
              },
              {
                'value': {
                  'end_line': 94,
                  'locator': 'sre.usersupport.projects.UserSupportProjectsSimaGridTest#testAddTeam',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 79,
                  'name': 'Add Team for Next Operation Test'
                },
                'label': 'Add Team for Next Operation Test'
              },
              {
                'value': {
                  'end_line': 178,
                  'locator': 'sre.usersupport.projects.UserSupportProjectsSimaGridTest#addDate',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 163,
                  'name': 'Add Date for Each Task Test'
                },
                'label': 'Add Date for Each Task Test'
              },
              {
                'value': {
                  'end_line': 145,
                  'locator': 'sre.usersupport.projects.UserSupportProjectsSimaGridTest#addProgress',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 128,
                  'name': 'Add Progress for Each Task Test'
                },
                'label': 'Add Progress for Each Task Test'
              },
              {
                'value': {
                  'end_line': 275,
                  'locator': 'sre.usersupport.projects.UserSupportProjectsSimaGridTest#resetParentFunction',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 265,
                  'name': 'Reset Parent Test'
                },
                'label': 'Reset Parent Test'
              },
              {
                'value': {
                  'end_line': 193,
                  'locator': 'sre.usersupport.projects.UserSupportProjectsSimaGridTest#insertAboveFunction',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 181,
                  'name': 'Insert Above Test'
                },
                'label': 'Insert Above Test'
              },
              {
                'value': {
                  'end_line': 221,
                  'locator': 'sre.usersupport.projects.UserSupportProjectsSimaGridTest#deleteTaskFunction',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 211,
                  'name': 'Delete Task Test'
                },
                'label': 'Delete Task Test'
              },
              {
                'value': {
                  'end_line': 39,
                  'locator': 'sre.usersupport.projects.UserSupportProjectsSimaGridTest#testCreateFirstTask',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 26,
                  'name': 'Create a First New Task Test'
                },
                'label': 'Create a First New Task Test'
              },
              {
                'value': {
                  'end_line': 247,
                  'locator': 'sre.usersupport.projects.UserSupportProjectsSimaGridTest#moveDownFunction',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 237,
                  'name': 'Move Down Test'
                },
                'label': 'Move Down Test'
              },
              {
                'value': {
                  'end_line': 52,
                  'locator': 'sre.usersupport.projects.UserSupportProjectsSimaGridTest#testCreateParentTask',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 42,
                  'name': 'Create a Parent New Task Test'
                },
                'label': 'Create a Parent New Task Test'
              },
              {
                'value': {
                  'end_line': 208,
                  'locator': 'sre.usersupport.projects.UserSupportProjectsSimaGridTest#insertBelowFunction',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 196,
                  'name': 'Insert Below Test'
                },
                'label': 'Insert Below Test'
              },
              {
                'value': {
                  'end_line': 234,
                  'locator': 'sre.usersupport.projects.UserSupportProjectsSimaGridTest#moveUpFunction',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 224,
                  'name': 'Move Up Test'
                },
                'label': 'Move Up Test'
              },
              {
                'value': {
                  'end_line': 296,
                  'locator': 'sre.usersupport.projects.UserSupportProjectsSimaGridTest#addTagFunction',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 278,
                  'name': 'Add Tag Function Test'
                },
                'label': 'Add Tag Function Test'
              },
              {
                'value': {
                  'end_line': 76,
                  'locator': 'sre.usersupport.projects.UserSupportProjectsSimaGridTest#addChildTask',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 55,
                  'name': 'Add Child Task For Each L1 Task Test'
                },
                'label': 'Add Child Task For Each L1 Task Test'
              },
              {
                'value': {
                  'end_line': 262,
                  'locator': 'sre.usersupport.projects.UserSupportProjectsSimaGridTest#pendTaskFunction',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 250,
                  'name': 'Pend Task Test'
                },
                'label': 'Pend Task Test'
              }
            ]
          },
          {
            'value': 'Gantt View@WBS',
            'label': 'Gantt View@WBS',
            'children': [
              {
                'value': {
                  'end_line': 83,
                  'locator': 'sre.usersupport.projects.UserSupportProjectsGanttTest#dragTaskProgressFunction',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 60,
                  'name': 'Drag Task Progress Test'
                },
                'label': 'Drag Task Progress Test'
              },
              {
                'value': {
                  'end_line': 57,
                  'locator': 'sre.usersupport.projects.UserSupportProjectsGanttTest#clickTaskBarFunction',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 41,
                  'name': 'Click Task Bar Test'
                },
                'label': 'Click Task Bar Test'
              },
              {
                'value': {
                  'end_line': 180,
                  'locator': 'sre.usersupport.projects.UserSupportProjectsGanttTest#createDependenceFunction',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 167,
                  'name': 'Create Dependence Test'
                },
                'label': 'Create Dependence Test'
              },
              {
                'value': {
                  'end_line': 135,
                  'locator': 'sre.usersupport.projects.UserSupportProjectsGanttTest#dragTaskStartDateFunction',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 109,
                  'name': 'Drag Plan Start Date Test'
                },
                'label': 'Drag Plan Start Date Test'
              },
              {
                'value': {
                  'end_line': 38,
                  'locator': 'sre.usersupport.projects.UserSupportProjectsGanttTest#openCloseGanttFunction',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 27,
                  'name': 'Open&Close Gantt Test'
                },
                'label': 'Open&Close Gantt Test'
              },
              {
                'value': {
                  'end_line': 164,
                  'locator': 'sre.usersupport.projects.UserSupportProjectsGanttTest#dragTaskEndDateFunction',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 138,
                  'name': 'Drag Plan End Date Test'
                },
                'label': 'Drag Plan End Date Test'
              },
              {
                'value': {
                  'end_line': 106,
                  'locator': 'sre.usersupport.projects.UserSupportProjectsGanttTest#dragTaskBarFunction',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 86,
                  'name': 'Drag Task bar Test'
                },
                'label': 'Drag Task bar Test'
              },
              {
                'value': {
                  'end_line': 202,
                  'locator': 'sre.usersupport.projects.UserSupportProjectsGanttTest#deleteDependenceFunction',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 183,
                  'name': 'Delete All Dependence Test'
                },
                'label': 'Delete All Dependence Test'
              }
            ]
          },
          {
            'value': 'ISSUE',
            'label': 'ISSUE',
            'children': [
              {
                'value': {
                  'end_line': 77,
                  'locator': 'sre.usersupport.issue.UserSupportIssueAssigneeChangeTest#IssueAssigneeChangeTest',
                  'type': 'browser',
                  'start_line': 24,
                  'name': 'Issue Assignee Change Test'
                },
                'label': 'Issue Assignee Change Test'
              },
              {
                'value': {
                  'end_line': 53,
                  'locator': 'sre.usersupport.issue.UserSupportIssueTest#HUSPPostNewIssueTest',
                  'type': 'browser',
                  'start_line': 25,
                  'name': 'HUSP Post New Issue Test'
                },
                'label': 'HUSP Post New Issue Test'
              },
              {
                'value': {
                  'end_line': 40,
                  'locator': 'sre.usersupport.globalsearchslidepanel.UserSupportGlobalSearchSlidePanelTest#HUESPGlobalSearchSlidePanelTest',
                  'type': 'browser',
                  'groups': [
                    'GlobalSearchSlidePanel'
                  ],
                  'start_line': 19,
                  'name': 'Global Search Slide Panel'
                },
                'label': 'Global Search Slide Panel'
              },
              {
                'value': {
                  'end_line': 78,
                  'locator': 'sre.usersupport.issue.UserSupportIssueStatusChangeTest#IssueStatusChangeTest',
                  'type': 'browser',
                  'start_line': 29,
                  'name': 'Issue Status Change Test'
                },
                'label': 'Issue Status Change Test'
              },
              {
                'value': {
                  'end_line': 52,
                  'locator': 'sre.usersupport.issue.UserSupportPriorityTest#HUSPPostIssuePriorityTest',
                  'type': 'browser',
                  'start_line': 24,
                  'name': 'Test Post Issue Priority'
                },
                'label': 'Test Post Issue Priority'
              }
            ]
          }
        ]
      },
      {
        'value': 'morphling',
        'label': 'Morphling',
        'children': [
          {
            'value': 'Alert',
            'label': 'Alert',
            'children': [
              {
                'value': {
                  'end_line': 45,
                  'locator': 'sre.morphling.AlertModuleTest#alertAutoRecoveryPageTest+addAlertSolutionPageTest',
                  'type': 'browser',
                  'start_line': 35,
                  'name': 'alertAutoRecoveryPageTest'
                },
                'label': 'alertAutoRecoveryPageTest'
              },
              {
                'value': {
                  'end_line': 32,
                  'locator': 'sre.morphling.AlertModuleTest#alertEventPageTest+alertAutoRecoveryPageTest+addAlertSolutionPageTest',
                  'type': 'browser',
                  'start_line': 24,
                  'name': 'Test For Alert Event Page'
                },
                'label': 'Test For Alert Event Page'
              },
              {
                'value': {
                  'end_line': 63,
                  'locator': 'sre.morphling.AlertModuleTest#addAlertSolutionPageTest',
                  'type': 'browser',
                  'start_line': 48,
                  'name': 'addAlertSolutionPageTest'
                },
                'label': 'addAlertSolutionPageTest'
              }
            ]
          },
          {
            'value': 'Execution_History',
            'label': 'Execution_History',
            'children': [
              {
                'value': {
                  'end_line': 31,
                  'locator': 'sre.morphling.ExecutionHistoryModuleTest#executionHistoryPageTest',
                  'type': 'browser',
                  'start_line': 26,
                  'name': 'Test Search In Execution History Page'
                },
                'label': 'Test Search In Execution History Page'
              },
              {
                'value': {
                  'end_line': 39,
                  'locator': 'sre.morphling.ExecutionHistoryModuleTest#historyViewDetailPageTest+historyReExecutePageTest+historySchedulePageTest+executionHistoryPageTest',
                  'type': 'browser',
                  'start_line': 34,
                  'name': 'historyViewDetailPageTest'
                },
                'label': 'historyViewDetailPageTest'
              },
              {
                'value': {
                  'end_line': 58,
                  'locator': 'sre.morphling.ExecutionHistoryModuleTest#historySchedulePageTest+executionHistoryPageTest',
                  'type': 'browser',
                  'start_line': 50,
                  'name': 'historySchedulePageTest'
                },
                'label': 'historySchedulePageTest'
              },
              {
                'value': {
                  'end_line': 47,
                  'locator': 'sre.morphling.ExecutionHistoryModuleTest#historyReExecutePageTest+historySchedulePageTest+executionHistoryPageTest',
                  'type': 'browser',
                  'start_line': 42,
                  'name': 'historyReExecutePageTest'
                },
                'label': 'historyReExecutePageTest'
              }
            ]
          },
          {
            'value': {
              'end_line': 22,
              'locator': 'sre.morphling.LoginTest#LoginTest',
              'type': 'browser',
              'groups': [
                'Level1'
              ],
              'start_line': 13,
              'name': 'Test Login Morphling'
            },
            'label': 'Test Login Morphling'
          },
          {
            'value': 'Execution_Template',
            'label': 'Execution_Template',
            'children': [
              {
                'value': {
                  'end_line': 43,
                  'locator': 'sre.morphling.ExecutionTemplateModuleTest#templateSchedulePageTest+templateEditPageTest+templateViewPageTest+templateCreatePageTest',
                  'type': 'browser',
                  'start_line': 38,
                  'name': 'templateSchedulePageTest'
                },
                'label': 'templateSchedulePageTest'
              },
              {
                'value': {
                  'end_line': 61,
                  'locator': 'sre.morphling.ExecutionTemplateModuleTest#templateCreatePageTest',
                  'type': 'browser',
                  'start_line': 54,
                  'name': 'templateCreatePageTest'
                },
                'label': 'templateCreatePageTest'
              },
              {
                'value': {
                  'end_line': 69,
                  'locator': 'sre.morphling.ExecutionTemplateModuleTest#templateEditPageTest+templateViewPageTest+templateCreatePageTest',
                  'type': 'browser',
                  'start_line': 64,
                  'name': 'templateEditPageTest'
                },
                'label': 'templateEditPageTest'
              },
              {
                'value': {
                  'end_line': 51,
                  'locator': 'sre.morphling.ExecutionTemplateModuleTest#templateViewPageTest+templateCreatePageTest',
                  'type': 'browser',
                  'start_line': 46,
                  'name': 'templateViewPageTest'
                },
                'label': 'templateViewPageTest'
              },
              {
                'value': {
                  'end_line': 35,
                  'locator': 'sre.morphling.ExecutionTemplateModuleTest#templateDeletePageTest+templateExecutePageTest+templateSchedulePageTest+templateEditPageTest+templateViewPageTest+templateCreatePageTest',
                  'type': 'browser',
                  'start_line': 28,
                  'name': 'Test Delete In Template Delete Page'
                },
                'label': 'Test Delete In Template Delete Page'
              },
              {
                'value': {
                  'end_line': 77,
                  'locator': 'sre.morphling.ExecutionTemplateModuleTest#templateExecutePageTest+templateSchedulePageTest+templateEditPageTest+templateViewPageTest+templateCreatePageTest',
                  'type': 'browser',
                  'start_line': 72,
                  'name': 'templateExecutePageTest'
                },
                'label': 'templateExecutePageTest'
              }
            ]
          },
          {
            'value': 'Scheduler_Main',
            'label': 'Scheduler_Main',
            'children': [
              {
                'value': {
                  'end_line': 98,
                  'locator': 'sre.morphling.SchedulerMainModuleTest#schedulerSelectTest+schedulerResumePage+schedulerPausePage+schedulerCopyPage+schedulerMainPageTest',
                  'type': 'browser',
                  'start_line': 90,
                  'name': 'schedulerSelectTest'
                },
                'label': 'schedulerSelectTest'
              },
              {
                'value': {
                  'end_line': 79,
                  'locator': 'sre.morphling.SchedulerMainModuleTest#schedulerResumePage+schedulerPausePage+schedulerCopyPage+schedulerMainPageTest',
                  'type': 'browser',
                  'start_line': 74,
                  'name': 'schedulerResumePage'
                },
                'label': 'schedulerResumePage'
              },
              {
                'value': {
                  'end_line': 87,
                  'locator': 'sre.morphling.SchedulerMainModuleTest#schedulerDeletePage+schedulerUpdatePage+schedulerSelectTest+schedulerResumePage+schedulerPausePage+schedulerCopyPage+schedulerMainPageTest',
                  'type': 'browser',
                  'start_line': 82,
                  'name': 'schedulerDeletePage'
                },
                'label': 'schedulerDeletePage'
              },
              {
                'value': {
                  'end_line': 55,
                  'locator': 'sre.morphling.SchedulerMainModuleTest#schedulerUpdatePage+schedulerSelectTest+schedulerResumePage+schedulerPausePage+schedulerCopyPage+schedulerMainPageTest',
                  'type': 'browser',
                  'start_line': 51,
                  'name': 'schedulerUpdatePage'
                },
                'label': 'schedulerUpdatePage'
              },
              {
                'value': {
                  'end_line': 63,
                  'locator': 'sre.morphling.SchedulerMainModuleTest#schedulerCopyPage+schedulerMainPageTest',
                  'type': 'browser',
                  'start_line': 58,
                  'name': 'schedulerCopyPage'
                },
                'label': 'schedulerCopyPage'
              },
              {
                'value': {
                  'end_line': 48,
                  'locator': 'sre.morphling.SchedulerMainModuleTest#schedulerMainPageTest',
                  'type': 'browser',
                  'start_line': 29,
                  'name': 'schedulerMainPageTest'
                },
                'label': 'schedulerMainPageTest'
              },
              {
                'value': {
                  'end_line': 71,
                  'locator': 'sre.morphling.SchedulerMainModuleTest#schedulerPausePage+schedulerCopyPage+schedulerMainPageTest',
                  'type': 'browser',
                  'start_line': 66,
                  'name': 'schedulerPausePage'
                },
                'label': 'schedulerPausePage'
              }
            ]
          },
          {
            'value': 'Project',
            'label': 'Project',
            'children': [
              {
                'value': {
                  'end_line': 53,
                  'locator': 'sre.morphling.ProjectModuleTest#projectFilesPageTest+projectRenamePageTest',
                  'type': 'browser',
                  'start_line': 47,
                  'name': 'projectFilesPageTest'
                },
                'label': 'projectFilesPageTest'
              },
              {
                'value': {
                  'end_line': 44,
                  'locator': 'sre.morphling.ProjectModuleTest#projectRenamePageTest',
                  'type': 'browser',
                  'start_line': 39,
                  'name': 'projectRenamePageTest'
                },
                'label': 'projectRenamePageTest'
              },
              {
                'value': {
                  'end_line': 63,
                  'locator': 'sre.morphling.ProjectModuleTest#projectDeletePageTest+projectCreationPageTest+projectFilesPageTest+projectRenamePageTest',
                  'type': 'browser',
                  'start_line': 56,
                  'name': 'projectDeletePageTest'
                },
                'label': 'projectDeletePageTest'
              },
              {
                'value': {
                  'end_line': 36,
                  'locator': 'sre.morphling.ProjectModuleTest#projectMainPageTest',
                  'type': 'browser',
                  'start_line': 26,
                  'name': 'Main Page Action Button Test'
                },
                'label': 'Main Page Action Button Test'
              },
              {
                'value': {
                  'end_line': 73,
                  'locator': 'sre.morphling.ProjectModuleTest#projectCreationPageTest+projectFilesPageTest+projectRenamePageTest',
                  'type': 'browser',
                  'start_line': 66,
                  'name': 'projectCreationPageTest'
                },
                'label': 'projectCreationPageTest'
              }
            ]
          },
          {
            'value': 'Script',
            'label': 'Script',
            'children': [
              {
                'value': {
                  'end_line': 45,
                  'locator': 'sre.morphling.ScriptModuleTest#scriptCreatePage',
                  'type': 'browser',
                  'start_line': 39,
                  'name': 'scriptCreatePage'
                },
                'label': 'scriptCreatePage'
              },
              {
                'value': {
                  'end_line': 53,
                  'locator': 'sre.morphling.ScriptModuleTest#scriptCreatePageEditMode',
                  'type': 'browser',
                  'start_line': 48,
                  'name': 'scriptCreatePageEditMode'
                },
                'label': 'scriptCreatePageEditMode'
              },
              {
                'value': {
                  'end_line': 98,
                  'locator': 'sre.morphling.ScriptModuleTest#scriptDeletePageTest',
                  'type': 'browser',
                  'start_line': 92,
                  'name': 'scriptDeletePageTest'
                },
                'label': 'scriptDeletePageTest'
              },
              {
                'value': {
                  'end_line': 36,
                  'locator': 'sre.morphling.ScriptModuleTest#scriptMainPageTest',
                  'type': 'browser',
                  'start_line': 28,
                  'name': 'scriptMainPageTest'
                },
                'label': 'scriptMainPageTest'
              },
              {
                'value': {
                  'end_line': 73,
                  'locator': 'sre.morphling.ScriptModuleTest#scriptExecutePageTest',
                  'type': 'browser',
                  'start_line': 68,
                  'name': 'scriptExecutePageTest'
                },
                'label': 'scriptExecutePageTest'
              },
              {
                'value': {
                  'end_line': 89,
                  'locator': 'sre.morphling.ScriptModuleTest#scriptSchedulePageTest',
                  'type': 'browser',
                  'start_line': 84,
                  'name': 'scriptSchedulePageTest'
                },
                'label': 'scriptSchedulePageTest'
              },
              {
                'value': {
                  'end_line': 81,
                  'locator': 'sre.morphling.ScriptModuleTest#scriptEditPageTest',
                  'type': 'browser',
                  'start_line': 76,
                  'name': 'scriptEditPageTest'
                },
                'label': 'scriptEditPageTest'
              },
              {
                'value': {
                  'end_line': 106,
                  'locator': 'sre.morphling.ScriptModuleTest#scriptDetailPageTest',
                  'type': 'browser',
                  'start_line': 101,
                  'name': 'scriptDetailPageTest'
                },
                'label': 'scriptDetailPageTest'
              },
              {
                'value': {
                  'end_line': 65,
                  'locator': 'sre.morphling.ScriptModuleTest#scriptMainTest',
                  'type': 'browser',
                  'start_line': 56,
                  'name': 'scriptMainTest'
                },
                'label': 'scriptMainTest'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    'value': 'collaboration',
    'label': 'Enterprise Collaboration',
    'children': [
      {
        'value': 'announcement',
        'label': 'Announcement',
        'children': [
          {
            'value': {
              'end_line': 24,
              'locator': 'collaboration.announcement.AnnLoginTest#reachAnnouncement',
              'type': 'browser',
              'groups': [
                'Level1'
              ],
              'start_line': 15,
              'name': 'Login and navigate to Announcement homepage'
            },
            'label': 'Login and navigate to Announcement homepage'
          },
          {
            'value': {
              'end_line': 26,
              'locator': 'collaboration.announcement.AnnCrudTest#createAnnouncement',
              'type': 'browser',
              'groups': [
                'Level2'
              ],
              'start_line': 15,
              'name': 'Create Announcement'
            },
            'label': 'Create Announcement'
          }
        ]
      },
      {
        'value': 'contacts',
        'label': 'Contacts',
        'children': [
          {
            'value': {
              'end_line': 114,
              'locator': 'collaboration.contacts.ContactsSmokeTest#testEditContact',
              'type': 'browser',
              'groups': [
                'Level2'
              ],
              'start_line': 82,
              'name': 'test edit contact'
            },
            'label': 'test edit contact'
          },
          {
            'value': {
              'end_line': 58,
              'locator': 'collaboration.contacts.ContactsSmokeTest#testCreateContact',
              'type': 'browser',
              'groups': [
                'Level2'
              ],
              'start_line': 31,
              'name': 'test create contact'
            },
            'label': 'test create contact'
          },
          {
            'value': {
              'end_line': 79,
              'locator': 'collaboration.contacts.ContactsSmokeTest#testSearchContact',
              'type': 'browser',
              'groups': [
                'Level2'
              ],
              'start_line': 61,
              'name': 'test search contact'
            },
            'label': 'test search contact'
          },
          {
            'value': {
              'end_line': 143,
              'locator': 'collaboration.contacts.ContactsSmokeTest#testDeleteContact',
              'type': 'browser',
              'groups': [
                'Level2'
              ],
              'start_line': 117,
              'name': 'test delete contact'
            },
            'label': 'test delete contact'
          },
          {
            'value': {
              'end_line': 24,
              'locator': 'collaboration.contacts.ContactsLoginTest#reachContacts',
              'type': 'browser',
              'groups': [
                'Level1'
              ],
              'start_line': 15,
              'name': 'Login and navigate to Contacts homepage'
            },
            'label': 'Login and navigate to Contacts homepage'
          }
        ]
      },
      {
        'value': 'drive',
        'label': 'Drive',
        'children': [
          {
            'value': {
              'end_line': 27,
              'locator': 'collaboration.drive.DriveLoginTest#reachDrive',
              'type': 'browser',
              'groups': [
                'Level1'
              ],
              'start_line': 18,
              'name': 'Login and navigate to Drive homepage'
            },
            'label': 'Login and navigate to Drive homepage'
          }
        ]
      },
      {
        'value': 'timeline',
        'label': 'Timeline',
        'children': [
          {
            'value': {
              'end_line': 23,
              'locator': 'collaboration.timeline.TimelineLoginTest#reachTimeline',
              'type': 'browser',
              'groups': [
                'Level1'
              ],
              'start_line': 15,
              'name': 'Login and navigate to Timeline homepage'
            },
            'label': 'Login and navigate to Timeline homepage'
          },
          {
            'value': 'Message Feed',
            'label': 'Message Feed',
            'children': [
              {
                'value': {
                  'end_line': 31,
                  'locator': 'collaboration.timeline.MessageFeedTest#postAndDeleteFeedTest',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 18,
                  'name': 'Post Feed And Delete Feed Test'
                },
                'label': 'Post Feed And Delete Feed Test'
              },
              {
                'value': {
                  'end_line': 52,
                  'locator': 'collaboration.timeline.MessageFeedTest#editFeedTest',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 34,
                  'name': 'Edit Feed Test'
                },
                'label': 'Edit Feed Test'
              }
            ]
          }
        ]
      },
      {
        'value': 'essmobile',
        'label': 'ESS Mobile',
        'children': [
          {
            'value': {
              'end_line': 24,
              'locator': 'collaboration.essmobile.EssTest#testLoginSuccess',
              'type': 'mobile',
              'groups': [
                'Level1-Android'
              ],
              'start_line': 17,
              'name': 'ESS login test'
            },
            'label': 'ESS login test'
          }
        ]
      },
      {
        'value': 'projectsmobile',
        'label': 'Projects Mobile',
        'children': [
          {
            'value': {
              'end_line': 24,
              'locator': 'collaboration.projectsmobile.ProjectsTest#testLoginSuccess',
              'type': 'mobile',
              'groups': [
                'Level1-Android'
              ],
              'start_line': 18,
              'name': 'Login success test'
            },
            'label': 'Login success test'
          }
        ]
      },
      {
        'value': 'todo',
        'label': 'ToDo',
        'children': [
          {
            'value': {
              'end_line': 27,
              'locator': 'collaboration.todo.TodoLoginTest#reachTodo',
              'type': 'browser',
              'groups': [
                'Level1'
              ],
              'start_line': 17,
              'name': 'Login and navigate to Todo homepage'
            },
            'label': 'Login and navigate to Todo homepage'
          },
          {
            'value': {
              'end_line': 30,
              'locator': 'collaboration.todo.TodoListTest#createTodoList',
              'type': 'browser',
              'groups': [
                'Level2'
              ],
              'start_line': 18,
              'name': 'Create A New ToDo List'
            },
            'label': 'Create A New ToDo List'
          },
          {
            'value': {
              'end_line': 50,
              'locator': 'collaboration.todo.TodoListTest#editTodoListName',
              'type': 'browser',
              'groups': [
                'Level2'
              ],
              'start_line': 33,
              'name': 'Edit The Name Of ToDo List'
            },
            'label': 'Edit The Name Of ToDo List'
          },
          {
            'value': {
              'end_line': 60,
              'locator': 'collaboration.todo.TodoItemTest#editTodoItem',
              'type': 'browser',
              'groups': [
                'Level2'
              ],
              'start_line': 36,
              'name': 'Edit A ToDo'
            },
            'label': 'Edit A ToDo'
          },
          {
            'value': {
              'end_line': 33,
              'locator': 'collaboration.todo.TodoItemTest#createAndDeleteTodoItem',
              'type': 'browser',
              'groups': [
                'Level2'
              ],
              'start_line': 18,
              'name': 'Create A New ToDo And Delete'
            },
            'label': 'Create A New ToDo And Delete'
          }
        ]
      },
      {
        'value': 'scheduler',
        'label': 'Scheduler',
        'children': [
          {
            'value': 'Common',
            'label': 'Common',
            'children': [
              {
                'value': {
                  'end_line': 43,
                  'locator': 'collaboration.scheduler.SchedulerLoginTest#loginDirectly',
                  'type': 'browser',
                  'groups': [
                    'Level1'
                  ],
                  'start_line': 35,
                  'name': 'Login Scheduler Directly'
                },
                'label': 'Login Scheduler Directly'
              },
              {
                'value': {
                  'end_line': 32,
                  'locator': 'collaboration.scheduler.SchedulerLoginTest#loginFromCollaboration',
                  'type': 'browser',
                  'groups': [
                    'Level1'
                  ],
                  'start_line': 23,
                  'name': 'Login Scheduler From Collaboration'
                },
                'label': 'Login Scheduler From Collaboration'
              }
            ]
          },
          {
            'value': 'Personal Schedule',
            'label': 'Personal Schedule',
            'children': [
              {
                'value': {
                  'end_line': 79,
                  'locator': 'collaboration.scheduler.SchedulerPersonalSchedulerTest#deleteEventWithTitleTodayTest',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 71,
                  'name': 'Delete Event with Title'
                },
                'label': 'Delete Event with Title'
              },
              {
                'value': {
                  'end_line': 68,
                  'locator': 'collaboration.scheduler.SchedulerPersonalSchedulerTest#editEventDetailWithTitleTodayTest',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 56,
                  'name': 'Edit Event Detail with Title'
                },
                'label': 'Edit Event Detail with Title'
              },
              {
                'value': {
                  'end_line': 53,
                  'locator': 'collaboration.scheduler.SchedulerPersonalSchedulerTest#createEventWithTitleTodayTest',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 47,
                  'name': 'Create Event with Title'
                },
                'label': 'Create Event with Title'
              }
            ]
          }
        ]
      },
      {
        'value': 'todomobile',
        'label': 'ToDo Mobile',
        'children': [
          {
            'value': {
              'end_line': 24,
              'locator': 'collaboration.todomobile.TodoTest#testLoginSuccess',
              'type': 'mobile',
              'groups': [
                'Level1-Android'
              ],
              'start_line': 18,
              'name': 'Login todo mobile'
            },
            'label': 'Login todo mobile'
          }
        ]
      },
      {
        'value': 'distribution',
        'label': 'Distribution',
        'children': [
          {
            'value': 'Distribution setting',
            'label': 'Distribution setting',
            'children': [
              {
                'value': {
                  'end_line': 28,
                  'locator': 'collaboration.distribution.testCases.ReuseTest#exec',
                  'type': 'browser',
                  'groups': [
                    'Level3'
                  ],
                  'start_line': 26,
                  'name': 'reuse in detail page'
                },
                'label': 'reuse in detail page'
              },
              {
                'value': {
                  'end_line': 28,
                  'locator': 'collaboration.distribution.testCases.InviteTest#exec',
                  'type': 'browser',
                  'groups': [
                    'Level3'
                  ],
                  'start_line': 26,
                  'name': 'invite in distribution'
                },
                'label': 'invite in distribution'
              },
              {
                'value': {
                  'end_line': 29,
                  'locator': 'collaboration.distribution.testCases.ValidationTextContainAnyTest#exec',
                  'type': 'browser',
                  'groups': [
                    'Level3'
                  ],
                  'start_line': 27,
                  'name': 'text contains any validation'
                },
                'label': 'text contains any validation'
              },
              {
                'value': {
                  'end_line': 29,
                  'locator': 'collaboration.distribution.testCases.ValidationTextNotContainTest#exec',
                  'type': 'browser',
                  'groups': [
                    'Level3'
                  ],
                  'start_line': 27,
                  'name': 'text contains all validation'
                },
                'label': 'text contains all validation'
              },
              {
                'value': {
                  'end_line': 29,
                  'locator': 'collaboration.distribution.testCases.ValidationTextContainAllTest#exec',
                  'type': 'browser',
                  'groups': [
                    'Level3'
                  ],
                  'start_line': 27,
                  'name': 'text not contain validation'
                },
                'label': 'text not contain validation'
              },
              {
                'value': {
                  'end_line': 29,
                  'locator': 'collaboration.distribution.testCases.ValidationTextBeIncludedTest#exec',
                  'type': 'browser',
                  'groups': [
                    'Level3'
                  ],
                  'start_line': 27,
                  'name': 'text must be included in validation'
                },
                'label': 'text must be included in validation'
              }
            ]
          }
        ]
      },
      {
        'value': 'timelinemobile',
        'label': 'Timeline Mobile',
        'children': [
          {
            'value': {
              'end_line': 56,
              'locator': 'collaboration.timelinemobile.TimelineTest#testLoginFailed',
              'type': 'mobile',
              'groups': [
                'Level1-Android'
              ],
              'start_line': 48,
              'name': 'testLoginFailed'
            },
            'label': 'testLoginFailed'
          },
          {
            'value': {
              'end_line': 36,
              'locator': 'collaboration.timelinemobile.TimelineTest#testFirstStart',
              'type': 'mobile',
              'groups': [
                'Level1-Android'
              ],
              'start_line': 33,
              'name': 'Accept EULA and Login'
            },
            'label': 'Accept EULA and Login'
          },
          {
            'value': {
              'end_line': 45,
              'locator': 'collaboration.timelinemobile.TimelineTest#testLoginSuccess',
              'type': 'mobile',
              'groups': [
                'Level1-Android'
              ],
              'start_line': 39,
              'name': 'testLoginSuccess'
            },
            'label': 'testLoginSuccess'
          },
          {
            'value': {
              'end_line': 30,
              'locator': 'collaboration.timelinemobile.TimelineTest#testPostAPhoto',
              'type': 'mobile',
              'groups': [
                'Level2-Android'
              ],
              'start_line': 18,
              'name': 'Post Photo Test'
            },
            'label': 'Post Photo Test'
          },
          {
            'value': {
              'end_line': 24,
              'locator': 'collaboration.timelinemobile.ios.TimelineTest#testLoginSuccess',
              'type': 'ios',
              'groups': [
                'Level1-iOS'
              ],
              'start_line': 18,
              'name': 'testLoginSuccess'
            },
            'label': 'testLoginSuccess'
          },
          {
            'value': {
              'end_line': 35,
              'locator': 'collaboration.timelinemobile.ios.TimelineTest#testLoginFail',
              'type': 'ios',
              'groups': [
                'Level1-iOS'
              ],
              'start_line': 27,
              'name': 'testLoginFail'
            },
            'label': 'testLoginFail'
          }
        ]
      },
      {
        'value': 'answers',
        'label': 'Enterprise Answers',
        'children': [
          {
            'value': {
              'end_line': 24,
              'locator': 'collaboration.answers.AnswersLoginTest#reachEnterpriseAnswers',
              'type': 'browser',
              'groups': [
                'Level1'
              ],
              'start_line': 15,
              'name': 'Login and navigate to Enterprise Answers homepage'
            },
            'label': 'Login and navigate to Enterprise Answers homepage'
          },
          {
            'value': {
              'end_line': 28,
              'locator': 'collaboration.answers.AnswersCreateQeustionTest#createQuestionTest',
              'type': 'browser',
              'groups': [
                'Level3'
              ],
              'start_line': 16,
              'name': 'Create Question'
            },
            'label': 'Create Question'
          }
        ]
      },
      {
        'value': 'essapplication',
        'label': 'General Application',
        'children': [
          {
            'value': 'Application Management',
            'label': 'Application Management',
            'children': [
              {
                'value': {
                  'end_line': 29,
                  'locator': 'collaboration.essapplication.testCases.ServiceExpirationTest#exec',
                  'type': 'browser',
                  'groups': [
                    'Level3'
                  ],
                  'start_line': 27,
                  'name': 'Service expiration'
                },
                'label': 'Service expiration'
              },
              {
                'value': {
                  'end_line': 29,
                  'locator': 'collaboration.essapplication.testCases.ServiceTimeOverTest#exec',
                  'type': 'browser',
                  'groups': [
                    'Level3'
                  ],
                  'start_line': 27,
                  'name': 'Service expiration_Expired'
                },
                'label': 'Service expiration_Expired'
              },
              {
                'value': {
                  'end_line': 25,
                  'locator': 'collaboration.essapplication.testCases.ServiceDescriptionTest#exec',
                  'type': 'browser',
                  'groups': [
                    'Level3'
                  ],
                  'start_line': 23,
                  'name': 'Service Description'
                },
                'label': 'Service Description'
              },
              {
                'value': {
                  'end_line': 29,
                  'locator': 'collaboration.essapplication.testCases.MainFlowTest#exec',
                  'type': 'browser',
                  'groups': [
                    'Level5'
                  ],
                  'start_line': 27,
                  'name': 'flow test'
                },
                'label': 'flow test'
              },
              {
                'value': {
                  'end_line': 30,
                  'locator': 'collaboration.essapplication.testCases.ServiceNotStartedTest#exec',
                  'type': 'browser',
                  'groups': [
                    'Level3'
                  ],
                  'start_line': 28,
                  'name': 'Service expiration_Not started'
                },
                'label': 'Service expiration_Not started'
              }
            ]
          }
        ]
      },
      {
        'value': 'ess',
        'label': 'ESS',
        'children': [
          {
            'value': 'Data Filter & Sort',
            'label': 'Data Filter & Sort',
            'children': [
              {
                'value': {
                  'end_line': 63,
                  'locator': 'collaboration.ess.DataFilterAndSortTest#testSort',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 39,
                  'name': 'Basic sort'
                },
                'label': 'Basic sort'
              },
              {
                'value': {
                  'end_line': 36,
                  'locator': 'collaboration.ess.DataFilterAndSortTest#testFilter',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 16,
                  'name': 'Basic filter'
                },
                'label': 'Basic filter'
              }
            ]
          },
          {
            'value': 'Data Format',
            'label': 'Data Format',
            'children': [
              {
                'value': {
                  'end_line': 32,
                  'locator': 'collaboration.ess.DataFormatTest#testFormatClear',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 29,
                  'name': 'Basic clear data format'
                },
                'label': 'Basic clear data format'
              },
              {
                'value': {
                  'end_line': 51,
                  'locator': 'collaboration.ess.DataFormatTest#testConditionalFormatCellData',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 35,
                  'name': 'Basic conditional format'
                },
                'label': 'Basic conditional format'
              },
              {
                'value': {
                  'end_line': 26,
                  'locator': 'collaboration.ess.DataFormatTest#testFormatCellData',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 18,
                  'name': 'Basic set data format'
                },
                'label': 'Basic set data format'
              }
            ]
          },
          {
            'value': 'Chart',
            'label': 'Chart',
            'children': [
              {
                'value': {
                  'end_line': 32,
                  'locator': 'collaboration.ess.ChartTest#testChart',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 22,
                  'name': 'Basic chart creating'
                },
                'label': 'Basic chart creating'
              }
            ]
          },
          {
            'value': 'Privilege',
            'label': 'Privilege',
            'children': [
              {
                'value': {
                  'end_line': 90,
                  'locator': 'collaboration.ess.PrivilegeTest#testShare',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 66,
                  'name': 'Basic share a copy'
                },
                'label': 'Basic share a copy'
              },
              {
                'value': {
                  'end_line': 63,
                  'locator': 'collaboration.ess.PrivilegeTest#testProtectRangeCustomize',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 43,
                  'name': 'Basic protect range'
                },
                'label': 'Basic protect range'
              },
              {
                'value': {
                  'end_line': 40,
                  'locator': 'collaboration.ess.PrivilegeTest#testNoAccess',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 28,
                  'name': 'Basic no access of file'
                },
                'label': 'Basic no access of file'
              },
              {
                'value': {
                  'end_line': 139,
                  'locator': 'collaboration.ess.PrivilegeTest#testInvite',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 93,
                  'name': 'Basic invite to edit'
                },
                'label': 'Basic invite to edit'
              }
            ]
          },
          {
            'value': 'Pivot',
            'label': 'Pivot',
            'children': [
              {
                'value': {
                  'end_line': 83,
                  'locator': 'collaboration.ess.PivotTest#testPivotTable',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 18,
                  'name': 'Basic pivot table'
                },
                'label': 'Basic pivot table'
              }
            ]
          },
          {
            'value': 'File Management',
            'label': 'File Management',
            'children': [
              {
                'value': {
                  'end_line': 72,
                  'locator': 'collaboration.ess.FileManagementTest#testSheetChangeOrder',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 57,
                  'name': 'Basic change sheet order'
                },
                'label': 'Basic change sheet order'
              },
              {
                'value': {
                  'end_line': 32,
                  'locator': 'collaboration.ess.FileManagementTest#createANewSpreadsheetAndRenameIt',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 28,
                  'name': 'Create a new spreadsheet and rename it to an UUID'
                },
                'label': 'Create a new spreadsheet and rename it to an UUID'
              },
              {
                'value': {
                  'end_line': 98,
                  'locator': 'collaboration.ess.FileManagementTest#testSheetCopySheet',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 86,
                  'name': 'Basic copy sheet'
                },
                'label': 'Basic copy sheet'
              },
              {
                'value': {
                  'end_line': 25,
                  'locator': 'collaboration.ess.FileManagementTest#pageCanBeLoaded',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 23,
                  'name': 'Create a new ESS page'
                },
                'label': 'Create a new ESS page'
              },
              {
                'value': {
                  'end_line': 134,
                  'locator': 'collaboration.ess.FileManagementTest#testEssFileCopyAsSpreadsheet',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 125,
                  'name': 'Basic save as a copy'
                },
                'label': 'Basic save as a copy'
              },
              {
                'value': {
                  'end_line': 54,
                  'locator': 'collaboration.ess.FileManagementTest#testSheetCRUD',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 41,
                  'name': 'Basic sheet curd'
                },
                'label': 'Basic sheet curd'
              },
              {
                'value': {
                  'end_line': 112,
                  'locator': 'collaboration.ess.FileManagementTest#testEssFileCrud',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 101,
                  'name': 'Basic move file to trash'
                },
                'label': 'Basic move file to trash'
              },
              {
                'value': {
                  'end_line': 122,
                  'locator': 'collaboration.ess.FileManagementTest#testEssFileSaveAsTemplate',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 115,
                  'name': 'Basic save as template'
                },
                'label': 'Basic save as template'
              },
              {
                'value': {
                  'end_line': 167,
                  'locator': 'collaboration.ess.FileManagementTest#testCopySheetToAnotherSpreadsheet',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 150,
                  'name': 'Basic copy sheet to another spreadsheet'
                },
                'label': 'Basic copy sheet to another spreadsheet'
              },
              {
                'value': {
                  'end_line': 83,
                  'locator': 'collaboration.ess.FileManagementTest#testSheetChangeColor',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 75,
                  'name': 'Basic change sheet color'
                },
                'label': 'Basic change sheet color'
              },
              {
                'value': {
                  'end_line': 146,
                  'locator': 'collaboration.ess.FileManagementTest#testEssFileAddFromTemplate',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 137,
                  'name': 'Basic create create from template'
                },
                'label': 'Basic create create from template'
              },
              {
                'value': {
                  'end_line': 38,
                  'locator': 'collaboration.ess.FileManagementTest#createANewSpreadsheetAndMoveItToTrash',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 35,
                  'name': 'Create a new spreadsheet and move it to trash'
                },
                'label': 'Create a new spreadsheet and move it to trash'
              }
            ]
          },
          {
            'value': 'Formula',
            'label': 'Formula',
            'children': [
              {
                'value': {
                  'end_line': 26,
                  'locator': 'collaboration.ess.FormulaTest#testFormula',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 18,
                  'name': 'Basic formula'
                },
                'label': 'Basic formula'
              }
            ]
          },
          {
            'value': 'Print',
            'label': 'Print',
            'children': [
              {
                'value': {
                  'end_line': 24,
                  'locator': 'collaboration.ess.PrintTest#testPrintOptions',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 18,
                  'name': 'Basic print options setting'
                },
                'label': 'Basic print options setting'
              },
              {
                'value': {
                  'end_line': 32,
                  'locator': 'collaboration.ess.PrintTest#testPrintInstantly',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 27,
                  'name': 'Basic print instantly'
                },
                'label': 'Basic print instantly'
              }
            ]
          },
          {
            'value': 'Image',
            'label': 'Image',
            'children': [
              {
                'value': {
                  'end_line': 21,
                  'locator': 'collaboration.ess.ImageTest#testImage',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 16,
                  'name': 'Basic image uploading'
                },
                'label': 'Basic image uploading'
              }
            ]
          },
          {
            'value': 'History',
            'label': 'History',
            'children': [
              {
                'value': {
                  'end_line': 26,
                  'locator': 'collaboration.ess.HistoryTest#testEssFileHistoryManagement',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 16,
                  'name': 'Basic history'
                },
                'label': 'Basic history'
              }
            ]
          },
          {
            'value': 'Edit',
            'label': 'Edit',
            'children': [
              {
                'value': {
                  'end_line': 397,
                  'locator': 'collaboration.ess.EditTest#testShortcutKeys',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 342,
                  'name': 'Basic shortcut key'
                },
                'label': 'Basic shortcut key'
              },
              {
                'value': {
                  'end_line': 223,
                  'locator': 'collaboration.ess.EditTest#testSingleCellChangeBackgroundColor',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 216,
                  'name': 'Basic change cell background color'
                },
                'label': 'Basic change cell background color'
              },
              {
                'value': {
                  'end_line': 62,
                  'locator': 'collaboration.ess.EditTest#testRowsOperation',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 34,
                  'name': 'Basic row operation'
                },
                'label': 'Basic row operation'
              },
              {
                'value': {
                  'end_line': 206,
                  'locator': 'collaboration.ess.EditTest#testFrozen',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 181,
                  'name': 'Basic frozen'
                },
                'label': 'Basic frozen'
              },
              {
                'value': {
                  'end_line': 213,
                  'locator': 'collaboration.ess.EditTest#testSingleCellInputAndDelete',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 209,
                  'name': 'Basic edit cell'
                },
                'label': 'Basic edit cell'
              },
              {
                'value': {
                  'end_line': 244,
                  'locator': 'collaboration.ess.EditTest#testSingleCellAddBorder',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 226,
                  'name': 'Basic change single cell border'
                },
                'label': 'Basic change single cell border'
              },
              {
                'value': {
                  'end_line': 127,
                  'locator': 'collaboration.ess.EditTest#testUndoRedo',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 109,
                  'name': 'Basic undo/redo'
                },
                'label': 'Basic undo/redo'
              },
              {
                'value': {
                  'end_line': 106,
                  'locator': 'collaboration.ess.EditTest#testAutoComplete',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 95,
                  'name': 'Basic autocomplete'
                },
                'label': 'Basic autocomplete'
              },
              {
                'value': {
                  'end_line': 147,
                  'locator': 'collaboration.ess.EditTest#testCutCopyPaste',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 130,
                  'name': 'Basic copy/cut/paste'
                },
                'label': 'Basic copy/cut/paste'
              },
              {
                'value': {
                  'end_line': 339,
                  'locator': 'collaboration.ess.EditTest#testSingleCellChangeFontStyle',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 247,
                  'name': 'Basic change font style'
                },
                'label': 'Basic change font style'
              },
              {
                'value': {
                  'end_line': 178,
                  'locator': 'collaboration.ess.EditTest#testMerge',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 150,
                  'name': 'Basic merge'
                },
                'label': 'Basic merge'
              },
              {
                'value': {
                  'end_line': 423,
                  'locator': 'collaboration.ess.EditTest#testSplitColumn',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 401,
                  'name': 'Basic split column'
                },
                'label': 'Basic split column'
              },
              {
                'value': {
                  'end_line': 92,
                  'locator': 'collaboration.ess.EditTest#testColsOperation',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 65,
                  'name': 'Basic column operation'
                },
                'label': 'Basic column operation'
              }
            ]
          },
          {
            'value': 'Data Validation',
            'label': 'Data Validation',
            'children': [
              {
                'value': {
                  'end_line': 38,
                  'locator': 'collaboration.ess.DataValidationTest#testValidation',
                  'type': 'browser',
                  'groups': [
                    'Level2'
                  ],
                  'start_line': 18,
                  'name': 'Basic validation'
                },
                'label': 'Basic validation'
              }
            ]
          }
        ]
      },
      {
        'value': 'mail',
        'label': 'Mail',
        'children': [
          {
            'value': {
              'end_line': 28,
              'locator': 'collaboration.mail.MailLoginTest#reachMail',
              'type': 'browser',
              'groups': [
                'Level1'
              ],
              'start_line': 18,
              'name': 'Login and navigate to Mail homepage'
            },
            'label': 'Login and navigate to Mail homepage'
          }
        ]
      },
      {
        'value': 'projects',
        'label': 'Projects',
        'children': [
          {
            'value': {
              'end_line': 36,
              'locator': 'collaboration.projects.ProjectsManageTest#createProject',
              'type': 'browser',
              'groups': [
                'Level2'
              ],
              'start_line': 23,
              'name': 'Create a new project'
            },
            'label': 'Create a new project'
          },
          {
            'value': {
              'end_line': 68,
              'locator': 'collaboration.projects.ProjectsManageTest#changeProjectDescription',
              'type': 'browser',
              'groups': [
                'Level2'
              ],
              'start_line': 55,
              'name': 'Change the description of a project'
            },
            'label': 'Change the description of a project'
          },
          {
            'value': {
              'end_line': 81,
              'locator': 'collaboration.projects.ProjectsManageTest#searchProject',
              'type': 'browser',
              'groups': [
                'Level2'
              ],
              'start_line': 71,
              'name': 'Search a project'
            },
            'label': 'Search a project'
          },
          {
            'value': {
              'end_line': 52,
              'locator': 'collaboration.projects.ProjectsManageTest#changeProjectName',
              'type': 'browser',
              'groups': [
                'Level2'
              ],
              'start_line': 39,
              'name': 'Change the name of a project'
            },
            'label': 'Change the name of a project'
          },
          {
            'value': {
              'end_line': 29,
              'locator': 'collaboration.projects.ProjectsMemberTest#addAndRemoveMember',
              'type': 'browser',
              'groups': [
                'Level2'
              ],
              'start_line': 17,
              'name': 'Add and remove a member in a project'
            },
            'label': 'Add and remove a member in a project'
          },
          {
            'value': {
              'end_line': 29,
              'locator': 'collaboration.projects.ProjectsLoginTest#reachProjects',
              'type': 'browser',
              'groups': [
                'Level1'
              ],
              'start_line': 19,
              'name': 'Login and navigate to Projects homepage'
            },
            'label': 'Login and navigate to Projects homepage'
          },
          {
            'value': {
              'end_line': 51,
              'locator': 'collaboration.projects.ProjectsFeedTest#editProjectFeed',
              'type': 'browser',
              'groups': [
                'Level2'
              ],
              'start_line': 35,
              'name': 'Edit a project feed'
            },
            'label': 'Edit a project feed'
          },
          {
            'value': {
              'end_line': 32,
              'locator': 'collaboration.projects.ProjectsFeedTest#addAndDeleteProjectFeed',
              'type': 'browser',
              'groups': [
                'Level2'
              ],
              'start_line': 18,
              'name': 'Add and delete a project feed'
            },
            'label': 'Add and delete a project feed'
          }
        ]
      }
    ]
  },
  {
    'value': 'ac',
    'label': 'AC',
    'children': [
      {
        'value': 'expensemobile',
        'label': 'Expense Mobile',
        'children': [
          {
            'value': {
              'end_line': 25,
              'locator': 'ac.expensemobile.ExpenseTest#createTransportationRecord',
              'type': 'mobile',
              'groups': [
                'Level2-Android'
              ],
              'start_line': 18,
              'name': 'Create Transportation Record'
            },
            'label': 'Create Transportation Record'
          }
        ]
      }
    ]
  },
  {
    'value': 'bt',
    'label': 'BT',
    'children': [
      {
        'value': 'edp2',
        'label': 'EDP2',
        'children': [
          {
            'value': {
              'end_line': 27,
              'locator': 'bt.edp2.EDP2JobManagerPageTest#terminateJobTest',
              'type': 'browser',
              'start_line': 18,
              'name': 'Test Terminate Job'
            },
            'label': 'Test Terminate Job'
          },
          {
            'value': {
              'end_line': 46,
              'locator': 'bt.edp2.EDP2JobManagerPageTest#jobDetailPageTest',
              'type': 'browser',
              'start_line': 40,
              'name': 'Go To Job Test'
            },
            'label': 'Go To Job Test'
          },
          {
            'value': {
              'end_line': 37,
              'locator': 'bt.edp2.EDP2JobManagerPageTest#retryJobTest',
              'type': 'browser',
              'start_line': 30,
              'name': 'Test Retry Job'
            },
            'label': 'Test Retry Job'
          },
          {
            'value': {
              'end_line': 74,
              'locator': 'bt.edp2.EDP2JobManagerPageTest#jobSearchTest',
              'type': 'browser',
              'start_line': 49,
              'name': 'Test Job Search Function'
            },
            'label': 'Test Job Search Function'
          },
          {
            'value': {
              'end_line': 24,
              'locator': 'bt.edp2.EDP2ApplicationManagerPageTest#launchSampleBatchTest',
              'type': 'browser',
              'start_line': 18,
              'name': 'Launch Sample Batch Test'
            },
            'label': 'Launch Sample Batch Test'
          },
          {
            'value': {
              'end_line': 32,
              'locator': 'bt.edp2.EDP2ApplicationManagerPageTest#editSampleBatchTest',
              'type': 'browser',
              'start_line': 27,
              'name': 'editSampleBatchTest'
            },
            'label': 'editSampleBatchTest'
          },
          {
            'value': {
              'end_line': 40,
              'locator': 'bt.edp2.EDP2ApplicationManagerPageTest#scheduleSampleBatchTest',
              'type': 'browser',
              'start_line': 35,
              'name': 'scheduleSampleBatchTest'
            },
            'label': 'scheduleSampleBatchTest'
          }
        ]
      },
      {
        'value': 'ifx',
        'label': 'IFX',
        'children': [
          {
            'value': {
              'end_line': 32,
              'locator': 'bt.ifx.InterfaceTest#switchInterfaceList',
              'type': 'browser',
              'groups': [
                'Level1'
              ],
              'start_line': 26,
              'name': 'switch to output interface list, and then input'
            },
            'label': 'switch to output interface list, and then input'
          },
          {
            'value': {
              'end_line': 32,
              'locator': 'bt.ifx.OutputSettingTest#openOutputTest',
              'type': 'browser',
              'groups': [
                'Level1'
              ],
              'start_line': 25,
              'name': 'open existing output setting'
            },
            'label': 'open existing output setting'
          },
          {
            'value': {
              'end_line': 46,
              'locator': 'bt.ifx.OutputSettingTest#outputSettingTest',
              'type': 'browser',
              'groups': [
                'Level2',
                'Download'
              ],
              'start_line': 35,
              'name': 'Output Setting Test: A simple output interface setting test, go through the process, without much advanced features.'
            },
            'label': 'Output Setting Test: A simple output interface setting test, go through the process, without much advanced features.'
          },
          {
            'value': {
              'end_line': 61,
              'locator': 'bt.ifx.OutputSettingTest#outputSettingWithoutCheckResultTest',
              'type': 'browser',
              'groups': [
                'Level2'
              ],
              'start_line': 49,
              'name': 'Output Setting Test: create output interface and execute, not check result'
            },
            'label': 'Output Setting Test: create output interface and execute, not check result'
          },
          {
            'value': {
              'end_line': 28,
              'locator': 'bt.ifx.InputSettingTest#openInputTest',
              'type': 'browser',
              'groups': [
                'Level1'
              ],
              'start_line': 22,
              'name': 'open existing input setting'
            },
            'label': 'open existing input setting'
          },
          {
            'value': {
              'end_line': 42,
              'locator': 'bt.ifx.InputSettingTest#inputSettingTest',
              'type': 'browser',
              'groups': [
                'Level2',
                'Download'
              ],
              'start_line': 31,
              'name': 'Input Setting Test: A simple input interface setting test, go through the process, without much advanced features.'
            },
            'label': 'Input Setting Test: A simple input interface setting test, go through the process, without much advanced features.'
          }
        ]
      },
      {
        'value': 'approval',
        'label': 'BizApp Approval',
        'children': [
          {
            'value': {
              'end_line': 27,
              'locator': 'bt.approval.ApprovalLoginTest#reachApproval',
              'type': 'browser',
              'groups': [
                'Level1'
              ],
              'start_line': 18,
              'name': 'Login and navigate to Approval homepage'
            },
            'label': 'Login and navigate to Approval homepage'
          }
        ]
      }
    ]
  },
  {
    'value': 'qa',
    'label': 'Quality Assurance',
    'children': [
      {
        'value': 'qe',
        'label': 'QE',
        'children': [
          {
            'value': {
              'end_line': 29,
              'locator': 'qa.qe.MultiBrowserSampleTest#HueLoginAndLogoutTest',
              'type': 'browser',
              'groups': [
                'Level1'
              ],
              'start_line': 20,
              'name': 'Login And Logout Test For HUE'
            },
            'label': 'Login And Logout Test For HUE'
          },
          {
            'value': 'API Test',
            'label': 'API Test',
            'children': [
              {
                'value': {
                  'end_line': 20,
                  'locator': 'qa.qe.APISampleTest#testGetTopic',
                  'type': 'api',
                  'start_line': 16,
                  'name': 'Test fetchALL topic response status'
                },
                'label': 'Test fetchALL topic response status'
              },
              {
                'value': {
                  'end_line': 29,
                  'locator': 'qa.qe.APISampleTest#testAuthClient',
                  'type': 'api',
                  'start_line': 23,
                  'name': 'Test Access token response status'
                },
                'label': 'Test Access token response status'
              }
            ]
          }
        ]
      }
    ]
  }
]

describe('utils/task.js', () => {
  it('testjobFromTask()', () => {
    const fn = utilTask.testjobFromTask
    const expectOutput = {
      'testPlanSerial': 22,
      'taskSerial': 1,
      'name': 'Chrome Timeline (Task #1 of Test Plan #22)',
      'branch': 'develop',
      'url': 'https://jillj-develop.hue.worksap.com/',
      'appUrl': null,
      'channel': 'taas-test-report',
      'channelId': 'C5AT4TGR5',
      'testcases': [
        'collaboration.timeline.TimelineLoginTest#reachTimeline',
        'collaboration.timeline.MessageFeedTest#postAndDeleteFeedTest',
        'collaboration.timeline.MessageFeedTest#editFeedTest'
      ],
      'username': 'hue-root',
      'password': 'hue-r00t',
      'platform': 'chrome',
      'params': []
    }
    expect(fn(mockTestPlan, mockTask, mockTestcasesCascade)).to.deep.equal(expectOutput)
  })
})
