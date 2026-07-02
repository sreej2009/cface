export const STAGE_CFG = {
  Untouched: { color: '#7A82A8', bg: 'rgba(90,96,128,0.15)', cls: 'b-untouched' },
  Cold:      { color: '#4D9EFF', bg: 'rgba(77,158,255,0.12)', cls: 'b-cold' },
  Warm:      { color: '#FF8C42', bg: 'rgba(255,140,66,0.12)', cls: 'b-warm' },
  Hot:       { color: '#FF4D6D', bg: 'rgba(255,77,109,0.15)', cls: 'b-hot' },
  Converted: { color: '#00D4AA', bg: 'rgba(0,212,170,0.12)', cls: 'b-converted' },
  Lost:      { color: '#FF7A9A', bg: 'rgba(255,77,109,0.1)',  cls: 'b-lost' },
};

export const SUBSTAGE_CFG = {
  Untouched: ['Fresh Lead', 'Not Called', 'Auto Assigned'],
  Cold:      ['Not Reachable', 'Wrong Number', 'Call Back Later', 'Not Interested'],
  Warm:      ['Interested', 'Callback Requested', 'Brochure Sent', 'Counselling Scheduled', 'Counselling Done'],
  Hot:       ['Application Started', 'Documents Pending', 'Fee Discussion', 'Seat Blocked', 'Admission Pending'],
  Converted: ['Fee Paid', 'Admission Confirmed', 'Enrolled'],
  Lost:      ['Not Interested', 'Joined Elsewhere', 'Financial Issues', 'Not Reachable', 'Postponed'],
};

export const SRC_CFG = {
  meta:   { cls: 'src-meta',   icon: 'Share2',        label: 'Meta Ads' },
  google: { cls: 'src-google', icon: 'Search',        label: 'Google' },
  lp:     { cls: 'src-lp',     icon: 'Globe',         label: 'Landing Page' },
  manual: { cls: 'src-manual', icon: 'Pencil',        label: 'Manual' },
};

export const ASSIGNEE_CFG = {
  'Priya S':     { initials: 'PS', color: '#6C47FF' },
  'Arjun K':     { initials: 'AK', color: '#00D4AA' },
  'Meera R':     { initials: 'MR', color: '#A78BFA' },
  'Auto Assign': { initials: 'PS', color: '#6C47FF' },
};

export const AVATAR_COLORS = ['#6C47FF','#FF4D6D','#4D9EFF','#00D4AA','#FF8C42','#A78BFA','#5A6080'];

export const INITIAL_LEADS = [
  { id:1, name:'Arun Kumar',     initials:'AK', avatarColor:'#6C47FF', phone:'+91 98765 43210', email:'arun@gmail.com',      stage:'Warm',      substage:'Counselling Scheduled', source:'meta',   campaign:'Medico Expo 2026',        assignee:'Priya S', score:72, actIcon:'Phone',         actLabel:'Call',       actTime:'2 hours ago',  created:'22 Jun 2026' },
  { id:2, name:'Divya Priya',    initials:'DP', avatarColor:'#FF4D6D', phone:'+91 87654 32109', email:'divya@yahoo.com',     stage:'Hot',       substage:'Fee Discussion',         source:'google', campaign:'MBBS Abroad 2026',        assignee:'Arjun K', score:88, actIcon:'MessageCircle', actLabel:'WhatsApp',   actTime:'30 min ago',   created:'22 Jun 2026' },
  { id:3, name:'Karthik Raj',    initials:'KR', avatarColor:'#4D9EFF', phone:'+91 76543 21098', email:'karthik@outlook.com', stage:'Cold',      substage:'Not Reachable',          source:'lp',     campaign:'KlickEdu MBBS · Chennai', assignee:'Meera R', score:34, actIcon:'Mail',          actLabel:'Email',      actTime:'1 day ago',    created:'21 Jun 2026' },
  { id:4, name:'Suresh Babu',    initials:'SB', avatarColor:'#5A6080', phone:'+91 65432 10987', email:'suresh@gmail.com',    stage:'Untouched', substage:'Fresh Lead',             source:'meta',   campaign:'Medico Expo 2026 · CBE',  assignee:'Priya S', score:10, actIcon:null,            actLabel:'No activity',actTime:'Never',        created:'22 Jun 2026' },
  { id:5, name:'Meenakshi R',    initials:'MK', avatarColor:'#00D4AA', phone:'+91 94321 09876', email:'meena@gmail.com',     stage:'Converted', substage:'Enrolled',               source:'manual', campaign:'Walk-in · Coimbatore',    assignee:'Arjun K', score:95, actIcon:'GraduationCap', actLabel:'Session',    actTime:'3 hours ago',  created:'20 Jun 2026' },
  { id:6, name:'Vijay Shankar',  initials:'VS', avatarColor:'#FF4D6D', phone:'+91 83210 98765', email:'vijay@hotmail.com',   stage:'Lost',      substage:'Joined Elsewhere',       source:'google', campaign:'Study Abroad CPC',        assignee:'Meera R', score:22, actIcon:'Phone',         actLabel:'Call',       actTime:'5 days ago',   created:'17 Jun 2026' },
  { id:7, name:'Anitha Lakshmi', initials:'AL', avatarColor:'#FF8C42', phone:'+91 72109 87654', email:'anitha@gmail.com',    stage:'Warm',      substage:'Brochure Sent',          source:'lp',     campaign:'KlickEdu MBBS · Chennai', assignee:'Priya S', score:61, actIcon:'MessageCircle', actLabel:'WhatsApp',   actTime:'4 hours ago',  created:'22 Jun 2026' },
];
