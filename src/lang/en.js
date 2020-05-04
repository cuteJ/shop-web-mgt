export default {
  index: {
    title: 'Manager system'
  },
  route: {
    dashboard: 'Dashboard',
    icons: 'Icons',
    page401: '401',
    page404: '404',
    errorLog: 'Error Log',
    theme: 'Theme',
    i18n: 'I18n',
    profile: 'Profile',
    systemManager: 'SystemManager',
    sysUserManager: 'SysUserManager',
    sysRoleManager: 'SysRoleManager',
    sysMenuManager: 'SysMenuManager',
    sysDicManager: 'SysDicManager',
    sysJobManager: 'sysJobManager',
    sysApiListManager: 'sysApiListManager',
    sysAuthorityManager: 'SysAuthorityManager',
    sysRegionManager: 'SysRegionManager',
    system: 'System',
    sysJobRunLogManager: 'SysJobRunLogManager',
    integrate: 'Integrate',
  },
  navbar: {
    logOut: 'Log Out',
    dashboard: 'Dashboard',
    screenfull: 'Screenfull',
    theme: 'Theme',
    size: 'Global Size',
    profile: 'Profile'
  },
  login: {
    title: 'Login Form',
    logIn: 'Log in',
    username: 'UserName',
    password: 'Password'
  },
  select: {
    defaultValue: 'select'
  },
  table: {
    id: 'ID',
    type: 'Type',
    date: 'Date',
    createdTime: 'createdTime',
    lastModifiedTime: 'lastModifiedTime',
    createdUser: 'createdUser',
    lastModifiedUser: 'lastModifiedUser',
    status: 'Status',
    actions: 'Actions',
    search: 'Search',
    add: 'Add',
    export: 'Export',
    import: 'Import',
    edit: 'Edit',
    delete: 'Delete',
    cancel: 'Cancel',
    confirm: 'Confirm',
    grant: 'Grant',
    batch: 'Batch',
    query: 'Query',
    reset: 'Reset',
    locked: 'Locked',
    unlocked: 'Unlocked',
    remark: 'Remark',
    detail: 'Detail',
    setting: 'Setting',
    submit: 'Submit',
    bind: 'Bind',
    user: 'User',
    role: 'Role',
    menu: 'Menu',
    authority: 'Authority',
    move: 'Move',
    start: 'Start',
    stop: 'Stop',
    pause: 'Pause',
    release: 'Release',
    logs: 'Logs',
    back: 'back',
    byOrder: 'ByOrder',
    success: 'Success',
    fail: 'Fail'
  },
  theme: {
    change: 'Change Theme'
  },
  tagsView: {
    refresh: 'Refresh',
    close: 'Close',
    closeOthers: 'Close Others',
    closeAll: 'Close All'
  },
  action: {
    required: 'Required'
  },
  utils: {
    request: {
      opt_success: 'Successful operation!',
      logout_confirm_text: 'You have been logged out, you can cancel to stay on this page, or log in again!',
      logout_confirm_title: 'OK sign out',
      logout_confirm_btn: 'Re-register',
      logout_confirm_cancel: 'Cancel'
    },
    clipboard: {
      tips: 'Click to copy',
      success: 'Copy successful',
      error: 'Copy failed'
    },
    validator: {
      phoneNumber: 'Please enter a valid phone number',
      username: 'Please enter alphanumeric',
      password: 'Please enter a password of not less than 6 digits',
    }
  },
  components: {
    langSelect:{
      message: 'Switch Language Success'
    },
    dyFilterInput: {
      placeholder: 'Please enter the query'
    },
    dySelect: {
      placeholder: 'Please choose'
    },
    sysCode: {
      placeholder: 'Please choose'
    }
  },
  views: {
    commons: {
      confirm: {
        remove_text: 'Are you sure you want to delete this record?',
        ok: 'Confirm to operate?',
        cancel: 'Operation canceled'
      },
      message: {
        single_selected: 'Please select a piece of data to operate',
        multi_selected: 'Please select at least one piece of data for operation'
      },
      codes: {
        yes: 'Yes',
        no: 'No'
      }
    },
    errorPage: {
      msg_404: 'Please check if the URL you entered is correct, please click the button below to return to the homepage or send an error report',
      msg_401: 'You do not have permission to go to this page',
      goHome: 'Go home'
    },
    login: {},
    profile: {
      tabMapOptions: {
        sysUserProfile: 'Personal information',
        resetPassword: 'Reset Password',
      },
      sysUserProfile: {
        formData: {
          username: 'Username',
          realName: 'RealName',
          phoneNo: 'PhoneNo',
          email: 'Email',
        }
      },
      resetPassword: {
        formData: {
          originalPassword: 'OriginalPassword',
          currentPassword: 'CurrentPassword'
        },
      }
    },
    system: {
      components: {
        authoritySelect: {
          message: 'Bind permissions',
          formData: {
            authorityName: "Authority name",
            shiroCode: "ShiroCode"
          },
        },
        menuMeta: {
          message: 'Meta',
          addItem: {
            title: 'Please enter a parameter name',
            inputErrorMessage: 'Please enter 1-10 alphanumeric characters or Chinese characters',
            dkError: 'Parameter already exists, please do not add it repeatedly!'
          }
        },
        menuSelect: {
          message: 'Bind menu',
        },
        roleSelect: {
          message: 'Bind role',
        }
      },
      sysApiListManager: {
        formData: {
          apiName: "ApiName",
          apiTag: "ApiTag",
          apiUrl: "ApiUrl",
          shiroCode: "ShiroCode"
        }
      },
      sysAuthorityManager: {
        formData: {
          authorityName: "AuthorityName",
          shiroCode: "ShiroCode"
        }
      },
      sysDicManager: {
        action: {
          h1: 'TypeCode manager',
          h2: 'ValCode manager'
        },
        formData: {
          typeName: 'TypeName',
          typeCode: 'TypeCode',
        },
        formDataDic: {
          valName: 'ValName',
          typeCode: 'TypeCode',
          valCode: 'ValCode',
        },
      },
      sysJobManager: {
        tabMapOptions: {
          jobDetailsManager: 'JobList',
          jobTriggerManager: 'Trigger',
          jobInstanceManager: 'JobInstance',
        },
        jobDetailsManager: {
          action: {
            addInstance: 'Create instance',
            triggerDySelect: 'Please select a trigger'
          },
          formData: {
            clazzPath: "ClassPath",
            description: "Description",
            jobName: "JobName",
            jobParams: "JobParams",
            jobId: 'JobId',
            triggerId: 'TriggerId',
            groupName: 'GroupName',
            instanceTimeRange: 'InstanceTimeRange',
          },
        },
        jobTriggerManager: {
          action: {},
          map: {
            MILLISECOND: 'Millisecond',
            SECOND: 'Second',
            MINUTE: 'Minute',
            HOUR: 'Hour',
            DAY: 'Day',
            WEEK: 'Week',
            MONTH: 'Month',
            YEAR: 'Wear',
            WEEK_2: 'Monday',
            WEEK_3: 'Tuesday',
            WEEK_4: 'Wednesday',
            WEEK_5: 'Thursday',
            WEEK_6: 'Friday',
            WEEK_7: 'Saturday',
            WEEK_1: 'Sunday',
          },
          formData: {
            cron: 'Cron',
            cron_1: 'Reference tutorial:',
            cron_2: '0 0 12 * * ? -- Triggered every day at 12',
            cron_3: 'More',
            interval: 'Interval',
            intervalUnit: 'IntervalUnit',
            repeatCount: 'RepeatCount',
            repeatCount_p: "Unfilled is not limited",
            triggerName: 'TriggerName',
            triggerType: 'TriggerType',
            daysOfWeek: 'DaysOfWeek',
            endTimeOfDay: 'EndTimeOfDay',
            startTimeOfDay: 'StartTimeOfDay',
            timeRangeOfDay: 'TimeRangeOfDay',
          },
        },
        jobInstanceManager: {
          action: {},
          message: {
            formOpenOpt: 'Confirm to operate?',
            handleRemove: 'Can\'t recover after release. Are you sure you want to release?'
          },
          formData: {
            clazzPath: 'ClassPath',
            groupName: 'GroupName',
            instanceId: 'InstanceId',
            instanceParams: 'InstanceParams',
            jobId: 'JobId',
            jobName: 'JobName',
            triggerId: 'TriggerId',
            triggerRule: 'TriggerRule',
            endTime: 'EndTime',
            startTime: 'StartTime',
            timeRangeOfDay: 'TimeRangeOfDay',
          },
        },
        sysJobRunLogManager: {
          formData: {
            result: 'Result'
          }
        }
      },
      sysMenuManager: {
        message: {
          h1: 'Menu directory',
          h2: 'Menu details',
          input_placeholder: 'Enter keywords to filter',
          bindAuthorities: 'Bind permissions',
          formOpen: 'Please select the parent menu',
        },
        action: {
          formOpenParams: 'Click to edit',
          append: 'Append',
          remove: 'Remove',
          add: 'PeerAdd',
          addChild: 'ChildAdd',
          child: 'Child',
          update: 'Update',
        },
        formData: {
          path: 'Path',
          component: 'Component',
          hidden: 'Hidden',
          meta: 'Meta',
          parentId: 'ParentId',
          redirect: 'Redirect',
        }
      },
      sysRegionManager: {
        message: {
          handleInit: 'Confirm initialization area data?'
        },
        action: {
          handleInit: 'Initialization data'
        },
        formData: {
          depth: 'Depth',
          depthName: 'DepthName',
          firstLetter: 'FirstLetter',
          jianPin: 'JianPin',
          name: 'Name',
          parentId: 'ParentId',
          pinYin: 'PinYin'
        }
      },
      sysRoleManager: {
        formData: {
          roleCode: 'RoleCode',
          roleName: 'RoleName',
        },
      },
      sysUserManager: {
        action: {
          handleStatus_confirm: 'Confirm operation',
          handleStatus_cancel: 'Operation canceled'
        },
        formData: {
          active: 'Active',
          username: 'Username',
          pwd: 'Password',
          realName: 'RealName',
          phoneNo: 'PhoneNo',
          email: 'Email',
          roleNames: 'RoleNames'
        },
      }
    }
  }
}
