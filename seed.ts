import { db } from './src/lib/db';
import { hash } from 'bcryptjs';

async function seed() {
  // Create admin
  const hashedPassword = await hash('admin123', 10);
  await db.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: { username: 'admin', password: hashedPassword },
  });

  // Create profile
  await db.profile.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: 'Qahtan Al Saidi',
      title: 'Data Analyst',
      location: 'Riyadh, Saudi Arabia',
      email: 'saidi.qahtan@gmail.com',
      phone: '(050) 867-4052',
      linkedin: 'linkedin.com/in/qahtan-saidi/',
      summary: 'Data Analyst with a strong background in Business Information Technology, specializing in data cleaning, periodic reporting, and dashboard development. Experienced in using SQL, Excel, Python, and Power BI to improve operational performance and support data-driven decision-making. Committed to delivering accurate, actionable insights that drive growth for organizations in the Riyadh market.',
      aboutText: 'I am a results-driven Data Analyst with over 4 years of progressive experience in leveraging data to drive business decisions. My expertise spans across data analysis, dashboard development, and business intelligence, with hands-on proficiency in SQL, Python, Excel VBA, and Power BI.\n\nThroughout my career, I have worked across diverse industries including banking, e-commerce, and development organizations, consistently delivering insights that improved operational efficiency and strategic decision-making. From designing executive dashboards for senior management to automating complex data workflows, I bring a combination of technical skills and business acumen.\n\nCurrently based in Riyadh, Saudi Arabia, I am passionate about transforming raw data into compelling stories that empower organizations to make smarter, faster decisions.',
      resumeUrl: '/Qahtan_Al_Saidi_Data_Analyst_Resume.pdf',
    },
  });

  // Create experiences
  const experiences = [
    {
      company: 'Al-Qawa\'im Al-Oula (Chartered Accountants & Legal Reviewers)',
      position: 'Operations & Data Support Officer',
      location: 'Riyadh, Saudi Arabia',
      startDate: 'Sep 2025',
      endDate: 'Present',
      current: true,
      responsibilities: 'Optimized data collection and cleaning processes, reducing daily operational reporting time. Developed automated Excel VBA solutions to streamline routine data tasks and analytical workflows. Managed client data integrity and tracked contractual and financial cases to ensure reporting accuracy. Analyzed payment trends to prepare collection reports reviewed by management. Prepared professional quotations and processed approvals to support business development activities. Implemented electronic archiving of client files for organized data records. Processd invoices and financial data within Excel and billing systems for accurate tracking. Supported the audit team by preparing comprehensive datasets and documentation. Contributed to client acquisition strategies by tracking and analyzing prospect data.',
      order: 0,
    },
    {
      company: 'Al-Karimi Islamic Bank',
      position: 'Deputy Department Head & Data Analyst',
      location: 'Sana\'a, Yemen',
      startDate: 'Jan 2024',
      endDate: 'Jun 2025',
      current: false,
      responsibilities: 'Led data analysis initiatives to improve productivity tracking and professional reporting. Designed interactive dashboards using Power BI to display KPIs for senior management. Monitored individual productivity data to support performance improvement and data-driven accountability. Represented the bank at international and local forums, leveraging data to build strategic partnerships.',
      order: 1,
    },
    {
      company: 'Al-Karimi Islamic Bank',
      position: 'Organizations Specialist & Data Analyst',
      location: 'Sana\'a, Yemen',
      startDate: 'Apr 2023',
      endDate: 'Dec 2023',
      current: false,
      responsibilities: 'Managed financial project data and enhanced institutional relationships through analytical insights. Conducted data-gathering meetings with local organizations to assess financial needs. Delivered customized banking services based on client data analysis, contributing to improved client satisfaction. Implemented Excel VBA applications that improved routine data operations by 80%.',
      order: 2,
    },
    {
      company: 'Sky Liner',
      position: 'Technical Support & SEO Specialist',
      location: 'Sana\'a, Yemen',
      startDate: 'Jan 2022',
      endDate: 'Mar 2023',
      current: false,
      responsibilities: 'Provided data-driven technical support for e-commerce users. Resolved website data discrepancies in payments and orders. Improved website performance using SEO data analysis and keyword research. Collaborated with development teams for technical and analytical integration. Documented user interactions to identify e-commerce performance trends. Tested new features to ensure a seamless, data-informed user experience.',
      order: 3,
    },
    {
      company: 'OMD-Y (Ala Al-Majd Development Foundation)',
      position: 'WASH (Water, Sanitation & Shelter) Officer',
      location: 'Sana\'a, Yemen',
      startDate: 'Mar 2021',
      endDate: 'Aug 2021',
      current: false,
      responsibilities: 'Researched and prepared program proposals using data aligned with donor guidelines. Ensured project compliance through data monitoring and sanitation standards. Developed annual and monthly plans based on project data. Led emergency responses using data to identify water, sanitation, and shelter needs. Supervised field team activities and material distribution according to project requirements. Managed financial documentation for temporary labor payments. Prepared monthly progress reports based on field data.',
      order: 4,
    },
  ];

  for (const exp of experiences) {
    await db.experience.create({ data: exp });
  }

  // Create skills
  const skills = [
    { name: 'SQL', category: 'Data Analytics', level: 90, icon: 'Database', order: 0 },
    { name: 'Python', category: 'Data Analytics', level: 80, icon: 'Code', order: 1 },
    { name: 'Power BI', category: 'Data Analytics', level: 92, icon: 'BarChart3', order: 2 },
    { name: 'Excel', category: 'Data Analytics', level: 95, icon: 'Table', order: 3 },
    { name: 'Excel VBA', category: 'Data Analytics', level: 85, icon: 'FileSpreadsheet', order: 4 },
    { name: 'Google Sheets', category: 'Data Analytics', level: 88, icon: 'Sheet', order: 5 },
    { name: 'Pivot Tables', category: 'Data Analytics', level: 93, icon: 'PivotTable', order: 6 },
    { name: 'VLOOKUP / XLOOKUP', category: 'Data Analytics', level: 90, icon: 'Search', order: 7 },
    { name: 'Microsoft Office 365', category: 'Business Intelligence', level: 92, icon: 'Briefcase', order: 0 },
    { name: 'MySQL', category: 'Business Intelligence', level: 85, icon: 'Database', order: 1 },
    { name: 'Data Cleaning', category: 'Business Intelligence', level: 90, icon: 'Filter', order: 2 },
    { name: 'Dashboard Design', category: 'Business Intelligence', level: 88, icon: 'LayoutDashboard', order: 3 },
    { name: 'KPI Tracking', category: 'Business Intelligence', level: 87, icon: 'Target', order: 4 },
    { name: 'Analytical Thinking', category: 'Soft Skills', level: 92, icon: 'Brain', order: 0 },
    { name: 'Problem Solving', category: 'Soft Skills', level: 90, icon: 'Puzzle', order: 1 },
    { name: 'Attention to Detail', category: 'Soft Skills', level: 95, icon: 'Eye', order: 2 },
    { name: 'Time Management', category: 'Soft Skills', level: 88, icon: 'Clock', order: 3 },
    { name: 'Teamwork', category: 'Soft Skills', level: 90, icon: 'Users', order: 4 },
    { name: 'Presentation Skills', category: 'Soft Skills', level: 85, icon: 'Presentation', order: 5 },
  ];

  for (const skill of skills) {
    await db.skill.create({ data: skill });
  }

  // Create projects
  const projects = [
    {
      title: 'Sales Performance Dashboard',
      description: 'Interactive Power BI dashboard tracking real-time sales KPIs, regional performance, and revenue trends. Features drill-through capabilities and automated data refresh for executive decision-making.',
      technologies: 'Power BI, SQL, Excel, DAX',
      githubUrl: '',
      demoUrl: '',
      featured: true,
      order: 0,
    },
    {
      title: 'Customer Analytics Platform',
      description: 'Comprehensive customer analytics solution segmenting user behavior, churn prediction, and lifetime value analysis. Built with Python and SQL to drive targeted marketing strategies.',
      technologies: 'Python, SQL, Excel, Pandas',
      githubUrl: '',
      demoUrl: '',
      featured: true,
      order: 1,
    },
    {
      title: 'Financial KPI Dashboard',
      description: 'Executive financial dashboard monitoring key performance indicators including revenue, expenses, profit margins, and cash flow. Automated reporting with Excel VBA macros.',
      technologies: 'Excel, VBA, SQL, Power BI',
      githubUrl: '',
      demoUrl: '',
      featured: true,
      order: 2,
    },
    {
      title: 'Excel Automation Toolkit',
      description: 'Suite of VBA macros automating data cleaning, report generation, and file management tasks. Reduced manual processing time by 80% across multiple business units.',
      technologies: 'Excel VBA, Microsoft Office',
      githubUrl: '',
      demoUrl: '',
      featured: false,
      order: 3,
    },
    {
      title: 'SQL Reporting System',
      description: 'Automated SQL-based reporting system generating daily, weekly, and monthly operational reports. Includes stored procedures for complex data aggregations and trend analysis.',
      technologies: 'SQL, MySQL, Excel',
      githubUrl: '',
      demoUrl: '',
      featured: false,
      order: 4,
    },
    {
      title: 'Power BI Executive Dashboard',
      description: 'C-level executive dashboard consolidating data from multiple sources into a unified view. Features role-based access, real-time data connectivity, and mobile-responsive design.',
      technologies: 'Power BI, SQL, DAX, Power Query',
      githubUrl: '',
      demoUrl: '',
      featured: false,
      order: 5,
    },
  ];

  for (const project of projects) {
    await db.project.create({ data: project });
  }

  // Create certificates
  const certificates = [
    { title: 'Advanced Excel', issuer: 'Professional Certification', date: '2024', order: 0 },
    { title: 'Data Analysis with Power BI', issuer: 'Professional Certification', date: '2024', order: 1 },
    { title: 'Data Analysis with Python', issuer: 'Professional Certification', date: '2023', order: 2 },
    { title: 'SQL Database', issuer: 'Professional Certification', date: '2023', order: 3 },
    { title: 'Banking & Financial English', issuer: 'Professional Certification', date: '2023', order: 4 },
    { title: 'Higher Diploma in English Language', issuer: 'Academic Institution', date: '2022', order: 5 },
    { title: 'Accounting for Non-Accountants', issuer: 'Professional Certification', date: '2023', order: 6 },
  ];

  for (const cert of certificates) {
    await db.certificate.create({ data: cert });
  }

  console.log('✅ Seed data inserted successfully!');
}

seed()
  .catch(console.error)
  .finally(() => db.$disconnect());