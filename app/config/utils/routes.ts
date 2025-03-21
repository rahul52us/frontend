
export const authentication = {
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password/:token",
  verifyEmail: "/verify-account/:token",
  createOrganisation2: "/create/company/:token",
  createOrganisationStep1: "/create/company",
};

const dashboardName = "dashboard";

export const dashboard = {
  home: `/${dashboardName}`,
  calender: `/${dashboardName}/calender`,
  testimonial: `/${dashboardName}/testimonial`,
  videos: `/${dashboardName}/videos`,
  class: `/${dashboardName}/class`,
  course: `/${dashboardName}/courses`,
  quiz: `/${dashboardName}/quiz`,
  verifyInvitation : `/${dashboardName}/:invitationType/verify-invitation/:token`,

  // Profile

  links : {
    salaryStructure : `/${dashboardName}/salaryStructure`,
    salarySlip:`/${dashboardName}/salary-slip`
  },
  profile : `/${dashboardName}/profile`,
  profileEditIndex: `/${dashboardName}/profile/edit/:id`,
  student: {
    index: `/${dashboardName}/students`,
    table: `/${dashboardName}/students/:type`,
    profile: `/${dashboardName}/students/class/:className/:profileTab`,
  },
  teacher: {
    index: `/${dashboardName}/teachers`,
  },
  staff: {
    index: `/${dashboardName}/staffs`,
  },
  tripManagement: {
    index: `/${dashboardName}/trip`,
    users : `/${dashboardName}/trip/users`,
    individual : `/${dashboardName}/trip/:tripId`,
  },
  Users: {
    index: `/${dashboardName}/Users`,
    details: `/${dashboardName}/Users/details`,
    new: `/${dashboardName}/Users/details/new`,
    edit: `/${dashboardName}/Users/details/edit/:id`,
    personalDetails:`/${dashboardName}/Users/personal-details`,
    personalDetailsUserChart:`/${dashboardName}/Users/personal-details/:id`
  },
  department: {
    index: `/${dashboardName}/department`,
    details: `/${dashboardName}/Users/details`,
    new: `/${dashboardName}/Users/details/new`,
    edit: `/${dashboardName}/Users/details/edit/:id`,
  },
  company: {
    index: `/${dashboardName}/company`,
    holidays: `/${dashboardName}/company/policy/holidays`,
  },
  request : {
    index : `/${dashboardName}/request`,
    leave : `/${dashboardName}/request/leave`,
    leaveAdd : `/${dashboardName}/request/leave/add`,
    leaveEdit : `/${dashboardName}/request/leave/edit/:requestId`,
    userList : `/${dashboardName}/request/users`,
    uniqueUser : `/${dashboardName}/request/users/:userId`,
    uniqueEdit : `/${dashboardName}/request/users/:userId/leave/edit/:requestId`,
  },
  attendence : {
    index : `/${dashboardName}/attendence`,
    leave : `/${dashboardName}/request/leave`,
    userList : `/${dashboardName}/attendence/users`,
    uniqueUser : `/${dashboardName}/attendence/users/:userId`
  },
  application:{
    project : `/${dashboardName}/project?page=1`
  },
  liberary: {
    books : {
      index : `/${dashboardName}/liberary/books`,
      category : {
        index : `/${dashboardName}/liberary/books/category`
      },
      users : `/${dashboardName}/liberay/books/users`
    },
    room: {
      index : `${dashboardName}/liberary/room`,
      users :  `${dashboardName}/liberary/room/users`
    }
  },
  // project
  project : {
    index : `/${dashboardName}/project`,
    individual : `/${dashboardName}/project/:projectId`,
    task : {
      index : `/${dashboardName}/project/:projectId/task`,
      create : `/${dashboardName}/:projectId/task/create`,
      edit:`/${dashboardName}/:projectId/task/edit/:taskId`
    }
  },

  blog : {
    index : `/${dashboardName}/blogs`,
    create : `/${dashboardName}/blogs/create`,
    edit : `${dashboardName}/blogs/edit/:blogTitle`
  },

};

export const main = {
  home: "/",
  about: "/about",
  project: "/project",
  changePassword: "/profile?&profileTab=change-password",
  contact: "/contact",
  courses: "/courses",
  testimonial: "/testimonial",
  product: "/product",
  video: "/videos",
  profile: "/profile",
  profileTab: "/profile/:profileTab",
  faq: "/faq",
  blog: "/blog",
  createBlog: "/blog/create",
  singleBlog: "/blog/:blogTitle",
  addingparaform: "/addingparaform",
  quizIndex: "/quiz",
  quizTitle: "/quiz/:quizTitle",
  quizQuestionIndex: "/quiz/:quizTitle/:categoryTitle",
  individualHomeCompany: "/:individualCompany",
  school:"/school"
};

export const privateMain = {
  createBlog: "/blog/create",
};

export const web = {
  index : "/:title",
  school : '/school',
  websiteCustomisation : {
    index : `/${dashboardName}/domain`,
    create : `/${dashboardName}/domain/create`,
    edit : `/${dashboardName}/domain/:domainName`
  }
}
