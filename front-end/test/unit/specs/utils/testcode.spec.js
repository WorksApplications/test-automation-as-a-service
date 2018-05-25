import utilsTestcode from '@/utils/testcode.js'

const mockTestcases = {
  success: true,
  branch: 'develop',
  lastUpdate: '2018-01-24T10:52:39.063Z',
  testcases: {
    sre: {
      usersupport: {
        testcases: [
          {
            end_line: 45,
            locator: 'sre.usersupport.personaltags.PersonalTagTest#wapLoginTest',
            type: 'browser',
            groups: [
              'Level1'
            ],
            start_line: 30,
            name: 'Wap login test'
          },
          {
            end_line: 27,
            locator: 'sre.usersupport.personaltags.PersonalTagTest#customerLoginTest',
            type: 'browser',
            groups: [
              'Level1'
            ],
            start_line: 18,
            name: 'Customer login test'
          }
        ],
        taas_metadata: {
          locator: [
            'sre.usersupport.**.*Test',
            'sre.usersupport.**.*Tests',
            'sre.usersupport.**.*TestCase',
            'sre.usersupport.**.*Tests'
          ],
          name: 'User@Support',
          testcases_count: 37
        },
        FAQ: {
          taas_metadata: {
            locator: [
              'sre.usersupport.faq.UserSupportFaqSearchTest',
              'sre.usersupport.faq.UserSupportFaqDetailTest',
              'sre.usersupport.faq.UserSupportFaqRegisterTest',
              'sre.usersupport.faq.UserSupportFaqDeleteTest',
              'sre.usersupport.faq.UserSupportFaqFilterTest'
            ],
            name: 'FAQ',
            testcases_count: 5
          },
          testcases: [
            {
              end_line: 39,
              locator: 'sre.usersupport.faq.UserSupportFaqSearchTest#HUESPRegisterNewFaqTest',
              type: 'browser',
              groups: [
                'Level4'
              ],
              start_line: 20,
              name: 'FAQ Search Test'
            },
            {
              end_line: 51,
              locator: 'sre.usersupport.faq.UserSupportFaqDetailTest#HUESPFaqDetailTest',
              type: 'browser',
              groups: [
                'Level4'
              ],
              start_line: 21,
              name: 'FAQ Detail Test'
            },
            {
              end_line: 43,
              locator: 'sre.usersupport.faq.UserSupportFaqRegisterTest#HUESPRegisterNewFaqTest',
              type: 'browser',
              groups: [
                'Level4'
              ],
              start_line: 21,
              name: 'Register New FAQ Test'
            },
            {
              end_line: 32,
              locator: 'sre.usersupport.faq.UserSupportFaqDeleteTest#HUESPFaqDetailTest',
              type: 'browser',
              groups: [
                'Level4'
              ],
              start_line: 20,
              name: 'FAQ Delete Test'
            },
            {
              end_line: 31,
              locator: 'sre.usersupport.faq.UserSupportFaqFilterTest#HUESPFaqFilterTest',
              type: 'browser',
              groups: [
                'Level4'
              ],
              start_line: 19,
              name: 'FAQ Filter Test'
            }
          ]
        },
        'Statistics@WBS': {
          taas_metadata: {
            locator: [
              'sre.usersupport.projects.UserSupportProjectsCreateProjectTest'
            ],
            name: 'Statistics@WBS',
            testcases_count: 1
          },
          testcases: [
            {
              end_line: 47,
              locator: 'sre.usersupport.projects.UserSupportProjectsCreateProjectTest#HUESPProjectsCreateProjectTest',
              type: 'browser',
              groups: [
                'Level4'
              ],
              start_line: 23,
              name: 'Create New Project Test'
            }
          ]
        },
        'Task Table@WBS': {
          taas_metadata: {
            locator: [
              'sre.usersupport.projects.UserSupportProjectsSimaGridTest'
            ],
            name: 'Task Table@WBS',
            testcases_count: 17
          },
          testcases: [
            {
              end_line: 125,
              locator: 'sre.usersupport.projects.UserSupportProjectsSimaGridTest#addTeamAndAssignee',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 97,
              name: 'Add Team&Assignee for Each Task Test'
            },
            {
              end_line: 160,
              locator: 'sre.usersupport.projects.UserSupportProjectsSimaGridTest#addManDay',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 148,
              name: 'Add Man Day for Each Task Test'
            },
            {
              end_line: 309,
              locator: 'sre.usersupport.projects.UserSupportProjectsSimaGridTest#openTaskDetailFunction',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 300,
              name: 'Open Task Detail Test'
            },
            {
              end_line: 94,
              locator: 'sre.usersupport.projects.UserSupportProjectsSimaGridTest#testAddTeam',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 79,
              name: 'Add Team for Next Operation Test'
            },
            {
              end_line: 178,
              locator: 'sre.usersupport.projects.UserSupportProjectsSimaGridTest#addDate',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 163,
              name: 'Add Date for Each Task Test'
            },
            {
              end_line: 145,
              locator: 'sre.usersupport.projects.UserSupportProjectsSimaGridTest#addProgress',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 128,
              name: 'Add Progress for Each Task Test'
            },
            {
              end_line: 275,
              locator: 'sre.usersupport.projects.UserSupportProjectsSimaGridTest#resetParentFunction',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 265,
              name: 'Reset Parent Test'
            },
            {
              end_line: 193,
              locator: 'sre.usersupport.projects.UserSupportProjectsSimaGridTest#insertAboveFunction',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 181,
              name: 'Insert Above Test'
            },
            {
              end_line: 221,
              locator: 'sre.usersupport.projects.UserSupportProjectsSimaGridTest#deleteTaskFunction',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 211,
              name: 'Delete Task Test'
            },
            {
              end_line: 39,
              locator: 'sre.usersupport.projects.UserSupportProjectsSimaGridTest#testCreateFirstTask',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 26,
              name: 'Create a First New Task Test'
            },
            {
              end_line: 247,
              locator: 'sre.usersupport.projects.UserSupportProjectsSimaGridTest#moveDownFunction',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 237,
              name: 'Move Down Test'
            },
            {
              end_line: 52,
              locator: 'sre.usersupport.projects.UserSupportProjectsSimaGridTest#testCreateParentTask',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 42,
              name: 'Create a Parent New Task Test'
            },
            {
              end_line: 208,
              locator: 'sre.usersupport.projects.UserSupportProjectsSimaGridTest#insertBelowFunction',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 196,
              name: 'Insert Below Test'
            },
            {
              end_line: 234,
              locator: 'sre.usersupport.projects.UserSupportProjectsSimaGridTest#moveUpFunction',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 224,
              name: 'Move Up Test'
            },
            {
              end_line: 296,
              locator: 'sre.usersupport.projects.UserSupportProjectsSimaGridTest#addTagFunction',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 278,
              name: 'Add Tag Function Test'
            },
            {
              end_line: 76,
              locator: 'sre.usersupport.projects.UserSupportProjectsSimaGridTest#addChildTask',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 55,
              name: 'Add Child Task For Each L1 Task Test'
            },
            {
              end_line: 262,
              locator: 'sre.usersupport.projects.UserSupportProjectsSimaGridTest#pendTaskFunction',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 250,
              name: 'Pend Task Test'
            }
          ]
        },
        'Gantt View@WBS': {
          taas_metadata: {
            locator: [
              'sre.usersupport.projects.UserSupportProjectsGanttTest'
            ],
            name: 'Gantt View@WBS',
            testcases_count: 8
          },
          testcases: [
            {
              end_line: 83,
              locator: 'sre.usersupport.projects.UserSupportProjectsGanttTest#dragTaskProgressFunction',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 60,
              name: 'Drag Task Progress Test'
            },
            {
              end_line: 57,
              locator: 'sre.usersupport.projects.UserSupportProjectsGanttTest#clickTaskBarFunction',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 41,
              name: 'Click Task Bar Test'
            },
            {
              end_line: 180,
              locator: 'sre.usersupport.projects.UserSupportProjectsGanttTest#createDependenceFunction',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 167,
              name: 'Create Dependence Test'
            },
            {
              end_line: 135,
              locator: 'sre.usersupport.projects.UserSupportProjectsGanttTest#dragTaskStartDateFunction',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 109,
              name: 'Drag Plan Start Date Test'
            },
            {
              end_line: 38,
              locator: 'sre.usersupport.projects.UserSupportProjectsGanttTest#openCloseGanttFunction',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 27,
              name: 'Open&Close Gantt Test'
            },
            {
              end_line: 164,
              locator: 'sre.usersupport.projects.UserSupportProjectsGanttTest#dragTaskEndDateFunction',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 138,
              name: 'Drag Plan End Date Test'
            },
            {
              end_line: 106,
              locator: 'sre.usersupport.projects.UserSupportProjectsGanttTest#dragTaskBarFunction',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 86,
              name: 'Drag Task bar Test'
            },
            {
              end_line: 202,
              locator: 'sre.usersupport.projects.UserSupportProjectsGanttTest#deleteDependenceFunction',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 183,
              name: 'Delete All Dependence Test'
            }
          ]
        },
        ISSUE: {
          taas_metadata: {
            locator: [
              'sre.usersupport.issue.UserSupportIssueStatusChangeTest',
              'sre.usersupport.issue.UserSupportIssueAssigneeChangeTest',
              'sre.usersupport.issue.UserSupportPriorityTest',
              'sre.usersupport.issue.UserSupportIssueTest'
            ],
            name: 'ISSUE',
            testcases_count: 4
          },
          testcases: [
            {
              end_line: 78,
              locator: 'sre.usersupport.issue.UserSupportIssueStatusChangeTest#IssueStatusChangeTest',
              type: 'browser',
              start_line: 29,
              name: 'Issue Status Change Test'
            },
            {
              end_line: 77,
              locator: 'sre.usersupport.issue.UserSupportIssueAssigneeChangeTest#IssueAssigneeChangeTest',
              type: 'browser',
              start_line: 24,
              name: 'Issue Assignee Change Test'
            },
            {
              end_line: 52,
              locator: 'sre.usersupport.issue.UserSupportPriorityTest#HUSPPostIssuePriorityTest',
              type: 'browser',
              start_line: 24,
              name: 'Test Post Issue Priority'
            },
            {
              end_line: 53,
              locator: 'sre.usersupport.issue.UserSupportIssueTest#HUSPPostNewIssueTest',
              type: 'browser',
              start_line: 25,
              name: 'HUSP Post New Issue Test'
            }
          ]
        }
      },
      morphling: {
        Alert: {
          taas_metadata: {
            locator: [
              'sre.morphling.AlertModuleTest'
            ],
            name: 'Alert',
            testcases_count: 3
          },
          testcases: [
            {
              end_line: 45,
              locator: 'sre.morphling.AlertModuleTest#alertAutoRecoveryPageTest+addAlertSolutionPageTest',
              type: 'browser',
              start_line: 35,
              name: 'alertAutoRecoveryPageTest'
            },
            {
              end_line: 32,
              locator: 'sre.morphling.AlertModuleTest#alertEventPageTest+alertAutoRecoveryPageTest+addAlertSolutionPageTest',
              type: 'browser',
              start_line: 24,
              name: 'Test For Alert Event Page'
            },
            {
              end_line: 63,
              locator: 'sre.morphling.AlertModuleTest#addAlertSolutionPageTest',
              type: 'browser',
              start_line: 48,
              name: 'addAlertSolutionPageTest'
            }
          ]
        },
        Execution_History: {
          taas_metadata: {
            locator: [
              'sre.morphling.ExecutionHistoryModuleTest'
            ],
            name: 'Execution_History',
            testcases_count: 4
          },
          testcases: [
            {
              end_line: 31,
              locator: 'sre.morphling.ExecutionHistoryModuleTest#executionHistoryPageTest',
              type: 'browser',
              start_line: 26,
              name: 'Test Search In Execution History Page'
            },
            {
              end_line: 39,
              locator: 'sre.morphling.ExecutionHistoryModuleTest#historyViewDetailPageTest+historyReExecutePageTest+historySchedulePageTest+executionHistoryPageTest',
              type: 'browser',
              start_line: 34,
              name: 'historyViewDetailPageTest'
            },
            {
              end_line: 58,
              locator: 'sre.morphling.ExecutionHistoryModuleTest#historySchedulePageTest+executionHistoryPageTest',
              type: 'browser',
              start_line: 50,
              name: 'historySchedulePageTest'
            },
            {
              end_line: 47,
              locator: 'sre.morphling.ExecutionHistoryModuleTest#historyReExecutePageTest+historySchedulePageTest+executionHistoryPageTest',
              type: 'browser',
              start_line: 42,
              name: 'historyReExecutePageTest'
            }
          ]
        },
        testcases: [
          {
            end_line: 22,
            locator: 'sre.morphling.LoginTest#LoginTest',
            type: 'browser',
            groups: [
              'Level1'
            ],
            start_line: 13,
            name: 'Test Login Morphling'
          }
        ],
        taas_metadata: {
          locator: [
            'sre.morphling.**.*Test',
            'sre.morphling.**.*Tests',
            'sre.morphling.**.*TestCase',
            'sre.morphling.**.*Tests'
          ],
          name: 'Morphling',
          testcases_count: 35
        },
        Execution_Template: {
          taas_metadata: {
            locator: [
              'sre.morphling.ExecutionTemplateModuleTest'
            ],
            name: 'Execution_Template',
            testcases_count: 6
          },
          testcases: [
            {
              end_line: 43,
              locator: 'sre.morphling.ExecutionTemplateModuleTest#templateSchedulePageTest+templateEditPageTest+templateViewPageTest+templateCreatePageTest',
              type: 'browser',
              start_line: 38,
              name: 'templateSchedulePageTest'
            },
            {
              end_line: 61,
              locator: 'sre.morphling.ExecutionTemplateModuleTest#templateCreatePageTest',
              type: 'browser',
              start_line: 54,
              name: 'templateCreatePageTest'
            },
            {
              end_line: 69,
              locator: 'sre.morphling.ExecutionTemplateModuleTest#templateEditPageTest+templateViewPageTest+templateCreatePageTest',
              type: 'browser',
              start_line: 64,
              name: 'templateEditPageTest'
            },
            {
              end_line: 51,
              locator: 'sre.morphling.ExecutionTemplateModuleTest#templateViewPageTest+templateCreatePageTest',
              type: 'browser',
              start_line: 46,
              name: 'templateViewPageTest'
            },
            {
              end_line: 35,
              locator: 'sre.morphling.ExecutionTemplateModuleTest#templateDeletePageTest+templateExecutePageTest+templateSchedulePageTest+templateEditPageTest+templateViewPageTest+templateCreatePageTest',
              type: 'browser',
              start_line: 28,
              name: 'Test Delete In Template Delete Page'
            },
            {
              end_line: 77,
              locator: 'sre.morphling.ExecutionTemplateModuleTest#templateExecutePageTest+templateSchedulePageTest+templateEditPageTest+templateViewPageTest+templateCreatePageTest',
              type: 'browser',
              start_line: 72,
              name: 'templateExecutePageTest'
            }
          ]
        },
        Scheduler_Main: {
          taas_metadata: {
            locator: [
              'sre.morphling.SchedulerMainModuleTest'
            ],
            name: 'Scheduler_Main',
            testcases_count: 7
          },
          testcases: [
            {
              end_line: 98,
              locator: 'sre.morphling.SchedulerMainModuleTest#schedulerSelectTest+schedulerResumePage+schedulerPausePage+schedulerCopyPage+schedulerMainPageTest',
              type: 'browser',
              start_line: 90,
              name: 'schedulerSelectTest'
            },
            {
              end_line: 79,
              locator: 'sre.morphling.SchedulerMainModuleTest#schedulerResumePage+schedulerPausePage+schedulerCopyPage+schedulerMainPageTest',
              type: 'browser',
              start_line: 74,
              name: 'schedulerResumePage'
            },
            {
              end_line: 87,
              locator: 'sre.morphling.SchedulerMainModuleTest#schedulerDeletePage+schedulerUpdatePage+schedulerSelectTest+schedulerResumePage+schedulerPausePage+schedulerCopyPage+schedulerMainPageTest',
              type: 'browser',
              start_line: 82,
              name: 'schedulerDeletePage'
            },
            {
              end_line: 55,
              locator: 'sre.morphling.SchedulerMainModuleTest#schedulerUpdatePage+schedulerSelectTest+schedulerResumePage+schedulerPausePage+schedulerCopyPage+schedulerMainPageTest',
              type: 'browser',
              start_line: 51,
              name: 'schedulerUpdatePage'
            },
            {
              end_line: 63,
              locator: 'sre.morphling.SchedulerMainModuleTest#schedulerCopyPage+schedulerMainPageTest',
              type: 'browser',
              start_line: 58,
              name: 'schedulerCopyPage'
            },
            {
              end_line: 48,
              locator: 'sre.morphling.SchedulerMainModuleTest#schedulerMainPageTest',
              type: 'browser',
              start_line: 29,
              name: 'schedulerMainPageTest'
            },
            {
              end_line: 71,
              locator: 'sre.morphling.SchedulerMainModuleTest#schedulerPausePage+schedulerCopyPage+schedulerMainPageTest',
              type: 'browser',
              start_line: 66,
              name: 'schedulerPausePage'
            }
          ]
        },
        Project: {
          taas_metadata: {
            locator: [
              'sre.morphling.ProjectModuleTest'
            ],
            name: 'Project',
            testcases_count: 5
          },
          testcases: [
            {
              end_line: 53,
              locator: 'sre.morphling.ProjectModuleTest#projectFilesPageTest+projectRenamePageTest',
              type: 'browser',
              start_line: 47,
              name: 'projectFilesPageTest'
            },
            {
              end_line: 44,
              locator: 'sre.morphling.ProjectModuleTest#projectRenamePageTest',
              type: 'browser',
              start_line: 39,
              name: 'projectRenamePageTest'
            },
            {
              end_line: 63,
              locator: 'sre.morphling.ProjectModuleTest#projectDeletePageTest+projectCreationPageTest+projectFilesPageTest+projectRenamePageTest',
              type: 'browser',
              start_line: 56,
              name: 'projectDeletePageTest'
            },
            {
              end_line: 36,
              locator: 'sre.morphling.ProjectModuleTest#projectMainPageTest',
              type: 'browser',
              start_line: 26,
              name: 'Main Page Action Button Test'
            },
            {
              end_line: 73,
              locator: 'sre.morphling.ProjectModuleTest#projectCreationPageTest+projectFilesPageTest+projectRenamePageTest',
              type: 'browser',
              start_line: 66,
              name: 'projectCreationPageTest'
            }
          ]
        },
        Script: {
          taas_metadata: {
            locator: [
              'sre.morphling.ScriptModuleTest'
            ],
            name: 'Script',
            testcases_count: 9
          },
          testcases: [
            {
              end_line: 45,
              locator: 'sre.morphling.ScriptModuleTest#scriptCreatePage',
              type: 'browser',
              start_line: 39,
              name: 'scriptCreatePage'
            },
            {
              end_line: 53,
              locator: 'sre.morphling.ScriptModuleTest#scriptCreatePageEditMode',
              type: 'browser',
              start_line: 48,
              name: 'scriptCreatePageEditMode'
            },
            {
              end_line: 98,
              locator: 'sre.morphling.ScriptModuleTest#scriptDeletePageTest',
              type: 'browser',
              start_line: 92,
              name: 'scriptDeletePageTest'
            },
            {
              end_line: 36,
              locator: 'sre.morphling.ScriptModuleTest#scriptMainPageTest',
              type: 'browser',
              start_line: 28,
              name: 'scriptMainPageTest'
            },
            {
              end_line: 73,
              locator: 'sre.morphling.ScriptModuleTest#scriptExecutePageTest',
              type: 'browser',
              start_line: 68,
              name: 'scriptExecutePageTest'
            },
            {
              end_line: 89,
              locator: 'sre.morphling.ScriptModuleTest#scriptSchedulePageTest',
              type: 'browser',
              start_line: 84,
              name: 'scriptSchedulePageTest'
            },
            {
              end_line: 81,
              locator: 'sre.morphling.ScriptModuleTest#scriptEditPageTest',
              type: 'browser',
              start_line: 76,
              name: 'scriptEditPageTest'
            },
            {
              end_line: 106,
              locator: 'sre.morphling.ScriptModuleTest#scriptDetailPageTest',
              type: 'browser',
              start_line: 101,
              name: 'scriptDetailPageTest'
            },
            {
              end_line: 65,
              locator: 'sre.morphling.ScriptModuleTest#scriptMainTest',
              type: 'browser',
              start_line: 56,
              name: 'scriptMainTest'
            }
          ]
        }
      },
      taas_metadata: {
        locator: [
          'sre.**.*Test',
          'sre.**.*Tests',
          'sre.**.*TestCase',
          'sre.**.*Tests'
        ],
        name: 'SRE',
        testcases_count: 72
      }
    },
    collaboration: {
      announcement: {
        testcases: [
          {
            end_line: 24,
            locator: 'collaboration.announcement.AnnLoginTest#reachAnnouncement',
            type: 'browser',
            groups: [
              'Level1'
            ],
            start_line: 15,
            name: 'Login and navigate to Announcement homepage'
          },
          {
            end_line: 29,
            locator: 'collaboration.announcement.AnnCrudTest#createAnnouncement',
            type: 'browser',
            groups: [
              'Level2'
            ],
            start_line: 17,
            name: 'Create Announcement'
          }
        ],
        taas_metadata: {
          locator: [
            'collaboration.announcement.**.*Test',
            'collaboration.announcement.**.*Tests',
            'collaboration.announcement.**.*TestCase',
            'collaboration.announcement.**.*Tests'
          ],
          name: 'Announcement',
          testcases_count: 2
        }
      },
      contacts: {
        testcases: [
          {
            end_line: 24,
            locator: 'collaboration.contacts.ContactsLoginTest#reachContacts',
            type: 'browser',
            groups: [
              'Level1'
            ],
            start_line: 15,
            name: 'Login and navigate to Contacts homepage'
          },
          {
            end_line: 114,
            locator: 'collaboration.contacts.ContactsSmokeTest#testEditContact',
            type: 'browser',
            groups: [
              'Level2'
            ],
            start_line: 82,
            name: 'test edit contact'
          },
          {
            end_line: 58,
            locator: 'collaboration.contacts.ContactsSmokeTest#testCreateContact',
            type: 'browser',
            groups: [
              'Level2'
            ],
            start_line: 31,
            name: 'test create contact'
          },
          {
            end_line: 79,
            locator: 'collaboration.contacts.ContactsSmokeTest#testSearchContact',
            type: 'browser',
            groups: [
              'Level2'
            ],
            start_line: 61,
            name: 'test search contact'
          },
          {
            end_line: 143,
            locator: 'collaboration.contacts.ContactsSmokeTest#testDeleteContact',
            type: 'browser',
            groups: [
              'Level2'
            ],
            start_line: 117,
            name: 'test delete contact'
          }
        ],
        taas_metadata: {
          locator: [
            'collaboration.contacts.**.*Test',
            'collaboration.contacts.**.*Tests',
            'collaboration.contacts.**.*TestCase',
            'collaboration.contacts.**.*Tests'
          ],
          name: 'Contacts',
          testcases_count: 5
        }
      },
      timeline: {
        testcases: [
          {
            end_line: 23,
            locator: 'collaboration.timeline.TimelineLoginTest#reachTimeline',
            type: 'browser',
            groups: [
              'Level1'
            ],
            start_line: 15,
            name: 'Login and navigate to Timeline homepage'
          }
        ],
        taas_metadata: {
          locator: [
            'collaboration.timeline.**.*Test',
            'collaboration.timeline.**.*Tests',
            'collaboration.timeline.**.*TestCase',
            'collaboration.timeline.**.*Tests'
          ],
          name: 'Timeline',
          testcases_count: 3
        },
        'Message Feed': {
          taas_metadata: {
            locator: [
              'collaboration.timeline.MessageFeedTest'
            ],
            name: 'Message Feed',
            testcases_count: 2
          },
          testcases: [
            {
              end_line: 31,
              locator: 'collaboration.timeline.MessageFeedTest#postAndDeleteFeedTest',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 18,
              name: 'Post Feed And Delete Feed Test'
            },
            {
              end_line: 52,
              locator: 'collaboration.timeline.MessageFeedTest#editFeedTest',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 34,
              name: 'Edit Feed Test'
            }
          ]
        }
      },
      essmobile: {
        testcases: [
          {
            end_line: 24,
            locator: 'collaboration.essmobile.EssTest#testLoginSuccess',
            type: 'mobile',
            groups: [
              'Level1-Android'
            ],
            start_line: 17,
            name: 'ESS login test'
          }
        ],
        taas_metadata: {
          locator: [
            'collaboration.essmobile.**.*Test',
            'collaboration.essmobile.**.*Tests',
            'collaboration.essmobile.**.*TestCase',
            'collaboration.essmobile.**.*Tests'
          ],
          name: 'ESS Mobile',
          testcases_count: 1
        }
      },
      projectsmobile: {
        testcases: [
          {
            end_line: 24,
            locator: 'collaboration.projectsmobile.ProjectsTest#testLoginSuccess',
            type: 'mobile',
            groups: [
              'Level1-Android'
            ],
            start_line: 18,
            name: 'Login success test'
          }
        ],
        taas_metadata: {
          locator: [
            'collaboration.projectsmobile.**.*Test',
            'collaboration.projectsmobile.**.*Tests',
            'collaboration.projectsmobile.**.*TestCase',
            'collaboration.projectsmobile.**.*Tests'
          ],
          name: 'Projects Mobile',
          testcases_count: 1
        }
      },
      todo: {
        testcases: [
          {
            end_line: 30,
            locator: 'collaboration.todo.TodoListTest#createTodoList',
            type: 'browser',
            groups: [
              'Level2'
            ],
            start_line: 18,
            name: 'Create A New ToDo List'
          },
          {
            end_line: 50,
            locator: 'collaboration.todo.TodoListTest#editTodoListName',
            type: 'browser',
            groups: [
              'Level2'
            ],
            start_line: 33,
            name: 'Edit The Name Of ToDo List'
          },
          {
            end_line: 60,
            locator: 'collaboration.todo.TodoItemTest#editTodoItem',
            type: 'browser',
            groups: [
              'Level2'
            ],
            start_line: 36,
            name: 'Edit A ToDo'
          },
          {
            end_line: 33,
            locator: 'collaboration.todo.TodoItemTest#createAndDeleteTodoItem',
            type: 'browser',
            groups: [
              'Level2'
            ],
            start_line: 18,
            name: 'Create A New ToDo And Delete'
          },
          {
            end_line: 27,
            locator: 'collaboration.todo.TodoLoginTest#reachTodo',
            type: 'browser',
            groups: [
              'Level1'
            ],
            start_line: 17,
            name: 'Login and navigate to Todo homepage'
          }
        ],
        taas_metadata: {
          locator: [
            'collaboration.todo.**.*Test',
            'collaboration.todo.**.*Tests',
            'collaboration.todo.**.*TestCase',
            'collaboration.todo.**.*Tests'
          ],
          name: 'ToDo',
          testcases_count: 5
        }
      },
      scheduler: {
        Common: {
          taas_metadata: {
            locator: [
              'collaboration.scheduler.SchedulerLoginTest'
            ],
            name: 'Common',
            testcases_count: 2
          },
          testcases: [
            {
              end_line: 43,
              locator: 'collaboration.scheduler.SchedulerLoginTest#loginDirectly',
              type: 'browser',
              groups: [
                'Level1'
              ],
              start_line: 35,
              name: 'Login Scheduler Directly'
            },
            {
              end_line: 32,
              locator: 'collaboration.scheduler.SchedulerLoginTest#loginFromCollaboration',
              type: 'browser',
              groups: [
                'Level1'
              ],
              start_line: 23,
              name: 'Login Scheduler From Collaboration'
            }
          ]
        },
        taas_metadata: {
          locator: [
            'collaboration.scheduler.**.*Test',
            'collaboration.scheduler.**.*Tests',
            'collaboration.scheduler.**.*TestCase',
            'collaboration.scheduler.**.*Tests'
          ],
          name: 'Scheduler',
          testcases_count: 5
        },
        'Personal Schedule': {
          taas_metadata: {
            locator: [
              'collaboration.scheduler.SchedulerPersonalSchedulerTest'
            ],
            name: 'Personal Schedule',
            testcases_count: 3
          },
          testcases: [
            {
              end_line: 76,
              locator: 'collaboration.scheduler.SchedulerPersonalSchedulerTest#deleteEventWithTitleTodayTest',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 67,
              name: 'Delete Event with Title'
            },
            {
              end_line: 64,
              locator: 'collaboration.scheduler.SchedulerPersonalSchedulerTest#editEventDetailWithTitleTodayTest',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 53,
              name: 'Edit Event Detail with Title'
            },
            {
              end_line: 50,
              locator: 'collaboration.scheduler.SchedulerPersonalSchedulerTest#createEventWithTitleTodayTest',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 43,
              name: 'Create Event with Title'
            }
          ]
        }
      },
      todomobile: {
        testcases: [
          {
            end_line: 24,
            locator: 'collaboration.todomobile.TodoTest#testLoginSuccess',
            type: 'mobile',
            groups: [
              'Level1-Android'
            ],
            start_line: 18,
            name: 'Login todo mobile'
          }
        ],
        taas_metadata: {
          locator: [
            'collaboration.todomobile.**.*Test',
            'collaboration.todomobile.**.*Tests',
            'collaboration.todomobile.**.*TestCase',
            'collaboration.todomobile.**.*Tests'
          ],
          name: 'ToDo Mobile',
          testcases_count: 1
        }
      },
      distribution: {
        'Distribution setting': {
          taas_metadata: {
            locator: [
              'collaboration.distribution.testCases.ValidationTextBeIncludedTest',
              'collaboration.distribution.testCases.InviteTest',
              'collaboration.distribution.testCases.ValidationTextContainAllTest',
              'collaboration.distribution.testCases.ValidationTextContainAnyTest',
              'collaboration.distribution.testCases.ReuseTest',
              'collaboration.distribution.testCases.ValidationTextNotContainTest'
            ],
            name: 'Distribution setting',
            testcases_count: 6
          },
          testcases: [
            {
              end_line: 29,
              locator: 'collaboration.distribution.testCases.ValidationTextBeIncludedTest#exec',
              type: 'browser',
              groups: [
                'Level3'
              ],
              start_line: 27,
              name: 'text must be included in validation'
            },
            {
              end_line: 28,
              locator: 'collaboration.distribution.testCases.InviteTest#exec',
              type: 'browser',
              groups: [
                'Level3'
              ],
              start_line: 26,
              name: 'invite in distribution'
            },
            {
              end_line: 29,
              locator: 'collaboration.distribution.testCases.ValidationTextContainAllTest#exec',
              type: 'browser',
              groups: [
                'Level3'
              ],
              start_line: 27,
              name: 'text not contain validation'
            },
            {
              end_line: 29,
              locator: 'collaboration.distribution.testCases.ValidationTextContainAnyTest#exec',
              type: 'browser',
              groups: [
                'Level3'
              ],
              start_line: 27,
              name: 'text contains any validation'
            },
            {
              end_line: 28,
              locator: 'collaboration.distribution.testCases.ReuseTest#exec',
              type: 'browser',
              groups: [
                'Level3'
              ],
              start_line: 26,
              name: 'reuse in detail page'
            },
            {
              end_line: 29,
              locator: 'collaboration.distribution.testCases.ValidationTextNotContainTest#exec',
              type: 'browser',
              groups: [
                'Level3'
              ],
              start_line: 27,
              name: 'text contains all validation'
            }
          ]
        },
        testcases: [],
        taas_metadata: {
          locator: [
            'collaboration.distribution.**.*Test',
            'collaboration.distribution.**.*Tests',
            'collaboration.distribution.**.*TestCase',
            'collaboration.distribution.**.*Tests'
          ],
          name: 'Distribution',
          testcases_count: 6
        }
      },
      timelinemobile: {
        testcases: [
          {
            end_line: 56,
            locator: 'collaboration.timelinemobile.TimelineTest#testLoginFailed',
            type: 'mobile',
            groups: [
              'Level1-Android'
            ],
            start_line: 48,
            name: 'testLoginFailed'
          },
          {
            end_line: 36,
            locator: 'collaboration.timelinemobile.TimelineTest#testFirstStart',
            type: 'mobile',
            groups: [
              'Level1-Android'
            ],
            start_line: 33,
            name: 'Accept EULA and Login'
          },
          {
            end_line: 45,
            locator: 'collaboration.timelinemobile.TimelineTest#testLoginSuccess',
            type: 'mobile',
            groups: [
              'Level1-Android'
            ],
            start_line: 39,
            name: 'testLoginSuccess'
          },
          {
            end_line: 30,
            locator: 'collaboration.timelinemobile.TimelineTest#testPostAPhoto',
            type: 'mobile',
            groups: [
              'Level2-Android'
            ],
            start_line: 18,
            name: 'Post Photo Test'
          },
          {
            end_line: 24,
            locator: 'collaboration.timelinemobile.ios.TimelineTest#testLoginSuccess',
            type: 'ios',
            groups: [
              'Level1-iOS'
            ],
            start_line: 18,
            name: 'testLoginSuccess'
          },
          {
            end_line: 35,
            locator: 'collaboration.timelinemobile.ios.TimelineTest#testLoginFail',
            type: 'ios',
            groups: [
              'Level1-iOS'
            ],
            start_line: 27,
            name: 'testLoginFail'
          }
        ],
        taas_metadata: {
          locator: [
            'collaboration.timelinemobile.**.*Test',
            'collaboration.timelinemobile.**.*Tests',
            'collaboration.timelinemobile.**.*TestCase',
            'collaboration.timelinemobile.**.*Tests'
          ],
          name: 'Timeline Mobile',
          testcases_count: 6
        }
      },
      taas_metadata: {
        locator: [
          'collaboration.**.*Test',
          'collaboration.**.*Tests',
          'collaboration.**.*TestCase',
          'collaboration.**.*Tests'
        ],
        name: 'Enterprise Collaboration',
        testcases_count: 90
      },
      essapplication: {
        testcases: [],
        taas_metadata: {
          locator: [
            'collaboration.essapplication.**.*Test',
            'collaboration.essapplication.**.*Tests',
            'collaboration.essapplication.**.*TestCase',
            'collaboration.essapplication.**.*Tests'
          ],
          name: 'General Application',
          testcases_count: 5
        },
        'Application Management': {
          taas_metadata: {
            locator: [
              'collaboration.essapplication.testCases.MainFlowTest',
              'collaboration.essapplication.testCases.ServiceTimeOverTest',
              'collaboration.essapplication.testCases.ServiceDescriptionTest',
              'collaboration.essapplication.testCases.ServiceExpirationTest',
              'collaboration.essapplication.testCases.ServiceNotStartedTest'
            ],
            name: 'Application Management',
            testcases_count: 5
          },
          testcases: [
            {
              end_line: 29,
              locator: 'collaboration.essapplication.testCases.MainFlowTest#exec',
              type: 'browser',
              groups: [
                'Level5'
              ],
              start_line: 27,
              name: 'flow test'
            },
            {
              end_line: 29,
              locator: 'collaboration.essapplication.testCases.ServiceTimeOverTest#exec',
              type: 'browser',
              groups: [
                'Level3'
              ],
              start_line: 27,
              name: 'Service expiration_Expired'
            },
            {
              end_line: 25,
              locator: 'collaboration.essapplication.testCases.ServiceDescriptionTest#exec',
              type: 'browser',
              groups: [
                'Level3'
              ],
              start_line: 23,
              name: 'Service Description'
            },
            {
              end_line: 29,
              locator: 'collaboration.essapplication.testCases.ServiceExpirationTest#exec',
              type: 'browser',
              groups: [
                'Level3'
              ],
              start_line: 27,
              name: 'Service expiration'
            },
            {
              end_line: 30,
              locator: 'collaboration.essapplication.testCases.ServiceNotStartedTest#exec',
              type: 'browser',
              groups: [
                'Level3'
              ],
              start_line: 28,
              name: 'Service expiration_Not started'
            }
          ]
        }
      },
      ess: {
        'Data Filter & Sort': {
          taas_metadata: {
            locator: [
              'collaboration.ess.DataFilterAndSortTest'
            ],
            name: 'Data Filter & Sort',
            testcases_count: 2
          },
          testcases: [
            {
              end_line: 63,
              locator: 'collaboration.ess.DataFilterAndSortTest#testSort',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 39,
              name: 'Basic sort'
            },
            {
              end_line: 36,
              locator: 'collaboration.ess.DataFilterAndSortTest#testFilter',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 16,
              name: 'Basic filter'
            }
          ]
        },
        'Data Format': {
          taas_metadata: {
            locator: [
              'collaboration.ess.DataFormatTest'
            ],
            name: 'Data Format',
            testcases_count: 3
          },
          testcases: [
            {
              end_line: 32,
              locator: 'collaboration.ess.DataFormatTest#testFormatClear',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 29,
              name: 'Basic clear data format'
            },
            {
              end_line: 51,
              locator: 'collaboration.ess.DataFormatTest#testConditionalFormatCellData',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 35,
              name: 'Basic conditional format'
            },
            {
              end_line: 26,
              locator: 'collaboration.ess.DataFormatTest#testFormatCellData',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 18,
              name: 'Basic set data format'
            }
          ]
        },
        Chart: {
          taas_metadata: {
            locator: [
              'collaboration.ess.ChartTest'
            ],
            name: 'Chart',
            testcases_count: 1
          },
          testcases: [
            {
              end_line: 32,
              locator: 'collaboration.ess.ChartTest#testChart',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 22,
              name: 'Basic chart creating'
            }
          ]
        },
        Privilege: {
          taas_metadata: {
            locator: [
              'collaboration.ess.PrivilegeTest'
            ],
            name: 'Privilege',
            testcases_count: 4
          },
          testcases: [
            {
              end_line: 90,
              locator: 'collaboration.ess.PrivilegeTest#testShare',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 66,
              name: 'Basic share a copy'
            },
            {
              end_line: 63,
              locator: 'collaboration.ess.PrivilegeTest#testProtectRangeCustomize',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 43,
              name: 'Basic protect range'
            },
            {
              end_line: 40,
              locator: 'collaboration.ess.PrivilegeTest#testNoAccess',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 28,
              name: 'Basic no access of file'
            },
            {
              end_line: 139,
              locator: 'collaboration.ess.PrivilegeTest#testInvite',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 93,
              name: 'Basic invite to edit'
            }
          ]
        },
        Pivot: {
          taas_metadata: {
            locator: [
              'collaboration.ess.PivotTest'
            ],
            name: 'Pivot',
            testcases_count: 1
          },
          testcases: [
            {
              end_line: 83,
              locator: 'collaboration.ess.PivotTest#testPivotTable',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 18,
              name: 'Basic pivot table'
            }
          ]
        },
        'File Management': {
          taas_metadata: {
            locator: [
              'collaboration.ess.FileManagementTest'
            ],
            name: 'File Management',
            testcases_count: 12
          },
          testcases: [
            {
              end_line: 72,
              locator: 'collaboration.ess.FileManagementTest#testSheetChangeOrder',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 57,
              name: 'Basic change sheet order'
            },
            {
              end_line: 32,
              locator: 'collaboration.ess.FileManagementTest#createANewSpreadsheetAndRenameIt',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 28,
              name: 'Create a new spreadsheet and rename it to an UUID'
            },
            {
              end_line: 98,
              locator: 'collaboration.ess.FileManagementTest#testSheetCopySheet',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 86,
              name: 'Basic copy sheet'
            },
            {
              end_line: 25,
              locator: 'collaboration.ess.FileManagementTest#pageCanBeLoaded',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 23,
              name: 'Create a new ESS page'
            },
            {
              end_line: 134,
              locator: 'collaboration.ess.FileManagementTest#testEssFileCopyAsSpreadsheet',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 125,
              name: 'Basic save as a copy'
            },
            {
              end_line: 54,
              locator: 'collaboration.ess.FileManagementTest#testSheetCRUD',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 41,
              name: 'Basic sheet curd'
            },
            {
              end_line: 112,
              locator: 'collaboration.ess.FileManagementTest#testEssFileCrud',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 101,
              name: 'Basic move file to trash'
            },
            {
              end_line: 122,
              locator: 'collaboration.ess.FileManagementTest#testEssFileSaveAsTemplate',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 115,
              name: 'Basic save as template'
            },
            {
              end_line: 167,
              locator: 'collaboration.ess.FileManagementTest#testCopySheetToAnotherSpreadsheet',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 150,
              name: 'Basic copy sheet to another spreadsheet'
            },
            {
              end_line: 83,
              locator: 'collaboration.ess.FileManagementTest#testSheetChangeColor',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 75,
              name: 'Basic change sheet color'
            },
            {
              end_line: 146,
              locator: 'collaboration.ess.FileManagementTest#testEssFileAddFromTemplate',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 137,
              name: 'Basic create create from template'
            },
            {
              end_line: 38,
              locator: 'collaboration.ess.FileManagementTest#createANewSpreadsheetAndMoveItToTrash',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 35,
              name: 'Create a new spreadsheet and move it to trash'
            }
          ]
        },
        Formula: {
          taas_metadata: {
            locator: [
              'collaboration.ess.FormulaTest'
            ],
            name: 'Formula',
            testcases_count: 1
          },
          testcases: [
            {
              end_line: 26,
              locator: 'collaboration.ess.FormulaTest#testFormula',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 18,
              name: 'Basic formula'
            }
          ]
        },
        Print: {
          taas_metadata: {
            locator: [
              'collaboration.ess.PrintTest'
            ],
            name: 'Print',
            testcases_count: 2
          },
          testcases: [
            {
              end_line: 24,
              locator: 'collaboration.ess.PrintTest#testPrintOptions',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 18,
              name: 'Basic print options setting'
            },
            {
              end_line: 32,
              locator: 'collaboration.ess.PrintTest#testPrintInstantly',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 27,
              name: 'Basic print instantly'
            }
          ]
        },
        Image: {
          taas_metadata: {
            locator: [
              'collaboration.ess.ImageTest'
            ],
            name: 'Image',
            testcases_count: 1
          },
          testcases: [
            {
              end_line: 21,
              locator: 'collaboration.ess.ImageTest#testImage',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 16,
              name: 'Basic image uploading'
            }
          ]
        },
        History: {
          taas_metadata: {
            locator: [
              'collaboration.ess.HistoryTest'
            ],
            name: 'History',
            testcases_count: 1
          },
          testcases: [
            {
              end_line: 26,
              locator: 'collaboration.ess.HistoryTest#testEssFileHistoryManagement',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 16,
              name: 'Basic history'
            }
          ]
        },
        Edit: {
          taas_metadata: {
            locator: [
              'collaboration.ess.EditTest'
            ],
            name: 'Edit',
            testcases_count: 13
          },
          testcases: [
            {
              end_line: 397,
              locator: 'collaboration.ess.EditTest#testShortcutKeys',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 342,
              name: 'Basic shortcut key'
            },
            {
              end_line: 223,
              locator: 'collaboration.ess.EditTest#testSingleCellChangeBackgroundColor',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 216,
              name: 'Basic change cell background color'
            },
            {
              end_line: 62,
              locator: 'collaboration.ess.EditTest#testRowsOperation',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 34,
              name: 'Basic row operation'
            },
            {
              end_line: 206,
              locator: 'collaboration.ess.EditTest#testFrozen',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 181,
              name: 'Basic frozen'
            },
            {
              end_line: 213,
              locator: 'collaboration.ess.EditTest#testSingleCellInputAndDelete',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 209,
              name: 'Basic edit cell'
            },
            {
              end_line: 244,
              locator: 'collaboration.ess.EditTest#testSingleCellAddBorder',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 226,
              name: 'Basic change single cell border'
            },
            {
              end_line: 127,
              locator: 'collaboration.ess.EditTest#testUndoRedo',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 109,
              name: 'Basic undo/redo'
            },
            {
              end_line: 106,
              locator: 'collaboration.ess.EditTest#testAutoComplete',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 95,
              name: 'Basic autocomplete'
            },
            {
              end_line: 147,
              locator: 'collaboration.ess.EditTest#testCutCopyPaste',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 130,
              name: 'Basic copy/cut/paste'
            },
            {
              end_line: 339,
              locator: 'collaboration.ess.EditTest#testSingleCellChangeFontStyle',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 247,
              name: 'Basic change font style'
            },
            {
              end_line: 178,
              locator: 'collaboration.ess.EditTest#testMerge',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 150,
              name: 'Basic merge'
            },
            {
              end_line: 423,
              locator: 'collaboration.ess.EditTest#testSplitColumn',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 401,
              name: 'Basic split column'
            },
            {
              end_line: 92,
              locator: 'collaboration.ess.EditTest#testColsOperation',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 65,
              name: 'Basic column operation'
            }
          ]
        },
        testcases: [],
        taas_metadata: {
          locator: [
            'collaboration.ess.**.*Test',
            'collaboration.ess.**.*Tests',
            'collaboration.ess.**.*TestCase',
            'collaboration.ess.**.*Tests'
          ],
          name: 'ESS',
          testcases_count: 42
        },
        'Data Validation': {
          taas_metadata: {
            locator: [
              'collaboration.ess.DataValidationTest'
            ],
            name: 'Data Validation',
            testcases_count: 1
          },
          testcases: [
            {
              end_line: 38,
              locator: 'collaboration.ess.DataValidationTest#testValidation',
              type: 'browser',
              groups: [
                'Level2'
              ],
              start_line: 18,
              name: 'Basic validation'
            }
          ]
        }
      },
      projects: {
        testcases: [
          {
            end_line: 35,
            locator: 'collaboration.projects.ProjectsManageTest#createProject',
            type: 'browser',
            groups: [
              'Level2'
            ],
            start_line: 23,
            name: 'Create a new project'
          },
          {
            end_line: 68,
            locator: 'collaboration.projects.ProjectsManageTest#changeProjectDescription',
            type: 'browser',
            groups: [
              'Level2'
            ],
            start_line: 55,
            name: 'Change the description of a project'
          },
          {
            end_line: 81,
            locator: 'collaboration.projects.ProjectsManageTest#searchProject',
            type: 'browser',
            groups: [
              'Level2'
            ],
            start_line: 71,
            name: 'Search a project'
          },
          {
            end_line: 52,
            locator: 'collaboration.projects.ProjectsManageTest#changeProjectName',
            type: 'browser',
            groups: [
              'Level2'
            ],
            start_line: 38,
            name: 'Change the name of a project'
          },
          {
            end_line: 31,
            locator: 'collaboration.projects.ProjectsMemberTest#addAndRemoveMember',
            type: 'browser',
            groups: [
              'Level2'
            ],
            start_line: 19,
            name: 'Add and remove a member in a project'
          },
          {
            end_line: 27,
            locator: 'collaboration.projects.ProjectsLoginTest#reachProjects',
            type: 'browser',
            groups: [
              'Level1'
            ],
            start_line: 17,
            name: 'Login and navigate to Projects homepage'
          },
          {
            end_line: 53,
            locator: 'collaboration.projects.ProjectsFeedTest#editProjectFeed',
            type: 'browser',
            groups: [
              'Level2'
            ],
            start_line: 37,
            name: 'Edit a project feed'
          },
          {
            end_line: 34,
            locator: 'collaboration.projects.ProjectsFeedTest#addAndDeleteProjectFeed',
            type: 'browser',
            groups: [
              'Level2'
            ],
            start_line: 20,
            name: 'Add and delete a project feed'
          }
        ],
        taas_metadata: {
          locator: [
            'collaboration.projects.**.*Test',
            'collaboration.projects.**.*Tests',
            'collaboration.projects.**.*TestCase',
            'collaboration.projects.**.*Tests'
          ],
          name: 'Projects',
          testcases_count: 8
        }
      }
    },
    bt: {
      edp2: {
        testcases: [
          {
            end_line: 24,
            locator: 'bt.edp2.EDP2ApplicationManagerPageTest#launchSampleBatchTest',
            type: 'browser',
            start_line: 18,
            name: 'Launch Sample Batch Test'
          },
          {
            end_line: 32,
            locator: 'bt.edp2.EDP2ApplicationManagerPageTest#editSampleBatchTest',
            type: 'browser',
            start_line: 27,
            name: 'editSampleBatchTest'
          },
          {
            end_line: 40,
            locator: 'bt.edp2.EDP2ApplicationManagerPageTest#scheduleSampleBatchTest',
            type: 'browser',
            start_line: 35,
            name: 'scheduleSampleBatchTest'
          },
          {
            end_line: 27,
            locator: 'bt.edp2.EDP2JobManagerPageTest#terminateJobTest',
            type: 'browser',
            start_line: 18,
            name: 'Test Terminate Job'
          },
          {
            end_line: 46,
            locator: 'bt.edp2.EDP2JobManagerPageTest#jobDetailPageTest',
            type: 'browser',
            start_line: 40,
            name: 'Go To Job Test'
          },
          {
            end_line: 37,
            locator: 'bt.edp2.EDP2JobManagerPageTest#retryJobTest',
            type: 'browser',
            start_line: 30,
            name: 'Test Retry Job'
          },
          {
            end_line: 74,
            locator: 'bt.edp2.EDP2JobManagerPageTest#jobSearchTest',
            type: 'browser',
            start_line: 49,
            name: 'Test Job Search Function'
          }
        ],
        taas_metadata: {
          locator: [
            'bt.edp2.**.*Test',
            'bt.edp2.**.*Tests',
            'bt.edp2.**.*TestCase',
            'bt.edp2.**.*Tests'
          ],
          name: 'EDP2',
          testcases_count: 7
        }
      },
      ifx: {
        testcases: [
          {
            end_line: 28,
            locator: 'bt.ifx.InputSettingTest#openInputTest',
            type: 'browser',
            groups: [
              'Level1'
            ],
            start_line: 22,
            name: 'open existing input setting'
          },
          {
            end_line: 42,
            locator: 'bt.ifx.InputSettingTest#inputSettingTest',
            type: 'browser',
            groups: [
              'Level2',
              'Download'
            ],
            start_line: 31,
            name: 'Input Setting Test: A simple input interface setting test, go through the process, without much advanced features.'
          },
          {
            end_line: 32,
            locator: 'bt.ifx.OutputSettingTest#openOutputTest',
            type: 'browser',
            groups: [
              'Level1'
            ],
            start_line: 25,
            name: 'open existing output setting'
          },
          {
            end_line: 46,
            locator: 'bt.ifx.OutputSettingTest#outputSettingTest',
            type: 'browser',
            groups: [
              'Level2',
              'Download'
            ],
            start_line: 35,
            name: 'Output Setting Test: A simple output interface setting test, go through the process, without much advanced features.'
          },
          {
            end_line: 61,
            locator: 'bt.ifx.OutputSettingTest#outputSettingWithoutCheckResultTest',
            type: 'browser',
            groups: [
              'Level2'
            ],
            start_line: 49,
            name: 'Output Setting Test: create output interface and execute, not check result'
          },
          {
            end_line: 32,
            locator: 'bt.ifx.InterfaceTest#switchInterfaceList',
            type: 'browser',
            groups: [
              'Level1'
            ],
            start_line: 26,
            name: 'switch to output interface list, and then input'
          }
        ],
        taas_metadata: {
          locator: [
            'bt.ifx.**.*Test',
            'bt.ifx.**.*Tests',
            'bt.ifx.**.*TestCase',
            'bt.ifx.**.*Tests'
          ],
          name: 'IFX',
          testcases_count: 6
        }
      },
      taas_metadata: {
        locator: [
          'bt.**.*Test',
          'bt.**.*Tests',
          'bt.**.*TestCase',
          'bt.**.*Tests'
        ],
        name: 'BT',
        testcases_count: 13
      }
    },
    ac: {
      taas_metadata: {
        locator: [
          'ac.**.*Test',
          'ac.**.*Tests',
          'ac.**.*TestCase',
          'ac.**.*Tests'
        ],
        name: 'AC',
        testcases_count: 1
      },
      expensemobile: {
        testcases: [
          {
            end_line: 25,
            locator: 'ac.expensemobile.ExpenseTest#createTransportationRecord',
            type: 'mobile',
            groups: [
              'Level2-Android'
            ],
            start_line: 18,
            name: 'Create Transportation Record'
          }
        ],
        taas_metadata: {
          locator: [
            'ac.expensemobile.**.*Test',
            'ac.expensemobile.**.*Tests',
            'ac.expensemobile.**.*TestCase',
            'ac.expensemobile.**.*Tests'
          ],
          name: 'Expense Mobile',
          testcases_count: 1
        }
      }
    },
    qa: {
      taas_metadata: {
        locator: [
          'qa.**.*Test',
          'qa.**.*Tests',
          'qa.**.*TestCase',
          'qa.**.*Tests'
        ],
        name: 'Quality Assurance',
        testcases_count: 3
      },
      qe: {
        testcases: [
          {
            end_line: 29,
            locator: 'qa.qe.MultiBrowserSampleTest#HueLoginAndLogoutTest',
            type: 'browser',
            groups: [
              'Level1'
            ],
            start_line: 20,
            name: 'Login And Logout Test For HUE'
          }
        ],
        taas_metadata: {
          locator: [
            'qa.qe.**.*Test',
            'qa.qe.**.*Tests',
            'qa.qe.**.*TestCase',
            'qa.qe.**.*Tests'
          ],
          name: 'QE',
          testcases_count: 3
        },
        'API Test': {
          taas_metadata: {
            locator: [
              'qa.qe.APISampleTest'
            ],
            name: 'API Test',
            testcases_count: 2
          },
          testcases: [
            {
              end_line: 20,
              locator: 'qa.qe.APISampleTest#testGetTopic',
              type: 'api',
              start_line: 16,
              name: 'Test fetchALL topic response status'
            },
            {
              end_line: 29,
              locator: 'qa.qe.APISampleTest#testAuthClient',
              type: 'api',
              start_line: 23,
              name: 'Test Access token response status'
            }
          ]
        }
      }
    }
  }
}

const mockCode = `package qa.qe;

import io.restassured.RestAssured;
import org.testng.annotations.Test;
import taas.annotation.Module;
import taas.base.HueUserSessionAware;
import taas.base.TaasApiTestBase;

import static io.restassured.RestAssured.given;

@Module(name = "API Test")
public class APISampleTest extends TaasApiTestBase implements HueUserSessionAware {

    @Test(description = "Test fetchALL topic response status")
    public void testGetTopic() {
        // Use getBaseURI here to reference connection host.
        RestAssured.baseURI = getBaseURI();
        given().cookie(getSessionCookieName(), getSessionToken()).header(getCsrfTokenHeaderName(), getCsrfToken())
            .when().post("/announcement/hue/announcement/management/fetchAllTopics").then().statusCode(200);
    }

    @Test(description = "Test Access token response status")
    public void testAuthClient() throws InterruptedException {
        RestAssured.baseURI = getBaseURI();
        given().header("client-id", "testing")
            .header("client-secret", "6bW06IaV6KGo6qSN74CN8piBu+q7h+Gxi+KkruOEpOO2qOGhl+evkuiJm+Crvg==")
            .contentType("application/json").when().post("/auth/hue/v1/authentication/authenticateClient")
            .then().statusCode(200);
    }
}`

describe('utils/testcode.js', () => {
  // Test cases
  it('extractCodeFragment()', () => {
    const fn = utilsTestcode.extractCodeFragment
    const sourceCode = [
      'public class JavaExample {',
      '  public static void main(String[] args) {',
      '    int count = 7, num1 = 0, num2 = 1;',
      '    System.out.print("Fibonacci Series of "+count+" numbers:");',
      '    for (int i = 1; i <= count; ++i) {',
      '      System.out.print(num1+" ");',
      '      int sumOfPrevTwo = num1 + num2;',
      '      num1 = num2;',
      '      num2 = sumOfPrevTwo;',
      '    }',
      '  }',
      '}',
      ''
    ].join('\n')
    const targetCode = [
      '    for (int i = 1; i <= count; ++i) {',
      '      System.out.print(num1+" ");',
      '      int sumOfPrevTwo = num1 + num2;',
      '      num1 = num2;',
      '      num2 = sumOfPrevTwo;',
      '    }',
      ''
    ].join('\n')
    expect(fn(sourceCode, 5, 10)).to.equal(targetCode)
  })

  describe('findTestCaseByLocator()', () => {
    const fn = utilsTestcode.findTestCaseByLocator
    it('should return a test case when found a match test case', () => {
      const expectedOutput = {
        end_line: 20,
        locator: 'qa.qe.APISampleTest#testGetTopic',
        type: 'api',
        start_line: 16,
        name: 'Test fetchALL topic response status'
      }
      expect(fn('qa.qe.APISampleTest#testGetTopic', mockTestcases)).to.deep.equal(expectedOutput)
    })
    it('should return undefined when there are no matchs', () => {
      expect(fn('this.is.a.locator.that.should.not.locate.to.something#hahaha', mockTestcases)).to.equal(undefined)
    })
  })

  describe('getCodeWithRealStartEndLine()', () => {
    const fn = utilsTestcode.getCodeWithRealStartEndLine
    it('should return correct line numbers (expected endLine larger than actual one)', () => {
      const inputCode = {
        code: mockCode,
        startLine: 24,
        endLine: 28
      }
      const outputCode = {
        code: mockCode,
        startLine: 22,
        endLine: 29
      }
      expect(fn(inputCode)).to.deep.equal(outputCode)
    })

    it('should return correct line numbers (expected endLine equal to the actual one)', () => {
      const inputCode = {
        code: mockCode,
        startLine: 24,
        endLine: 29
      }
      const outputCode = {
        code: mockCode,
        startLine: 22,
        endLine: 29
      }
      expect(fn(inputCode)).to.deep.equal(outputCode)
    })
  })
})
