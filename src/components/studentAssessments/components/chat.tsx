export const chat = [
  {
    req: "Hi! Ready to dive into Root Locus? It’s one of the coolest techniques in control systems!",
    res: "I’m ready, but I’ve heard it’s a bit tricky.",
  },
  {
    req: "It can feel tricky at first, but don’t worry. Think of Root Locus as a map showing how system poles move in the complex plane as you tweak a parameter, like gain. Let’s start simple!",
    res: "Sounds good. Where do we begin?",
  },
  {
    req: "Hi! Ready to dive into Root Locus? It’s one of the coolest techniques in control systems!",
    res: "So the poles are at 0, -2 and 4?",
  },
  {
    req: "Your doubt is from Lesson 2 of Root Locus. Let me know where exactly you’d like it to be resolved.",
    showResume: true,
    gotoText: "Root Locus",
  },
];

export const Teamchat = [
  {
    req: "Hi! Ready to dive into Root Locus? It’s one of the coolest techniques in control systems!",
    res: "I’m ready, but I’ve heard it’s a bit tricky.",
  },
  {
    req: "It can feel tricky at first, but don’t worry. Think of Root Locus as a map showing how system poles move in the complex plane as you tweak a parameter, like gain. Let’s start simple!",
    res: "Sounds good. Where do we begin?",
  },
  {
    req: "Your doubt is from Lesson 2 of Root Locus. Let me know where exactly you’d like it to be resolved.",
    showCompletion: true,
  },
];

export const discussions = [
  {
    agent: "CEO",
    content: "Strategic Alignment...",
    metric_changes: {
      revenue: {
        change: 10,
        reason:
          "Increased marketing efforts will likely lead to increased sales",
      },
      profit_margin: {
        change: -5,
        reason:
          "Higher marketing expenditure could reduce the profit margin in the short term",
      },
      customer_satisfaction: {
        change: 5,
        reason:
          "Better marketing communication could lead to increased customer satisfaction.",
      },
    },
  },
  {
    agent: "CMO",
    content: "Strategic Alignment...",
    metric_changes: {
      lead_generation: {
        change: 30,
        reason:
          "More comprehensive and targeted marketing campaigns will reach a larger audience, generating more leads.",
      },
      customer_acquisition_cost: {
        change: -20,
        reason:
          "More efficient marketing strategies and larger scale of operations will reduce the cost to acquire new customers.",
      },
      brand_awareness: {
        change: 25,
        reason:
          "Greater investment in advertising and promotion will increase our brand recognition and visibility.",
      },
    },
  },
  {
    agent: "COO",
    content: "1. Strategic Alignment...",
    metric_changes: {
      operational_efficiency: {
        change: -10,
        reason:
          "Increased workload may result in a slight drop in efficiency in the short term",
      },
      team_satisfaction: {
        change: -5,
        reason: "Additional pressure might affect team morale initially",
      },
      project_success_rate: {
        change: 15,
        reason:
          "More funds may result in more successful projects if resources are managed effectively",
      },
    },
  },
];

export const metricesData = {
  core: {
    revenue: 110,
    profit_margin: 10,
    customer_satisfaction: 85,
    employee_satisfaction: 75,
  },
  department: {
    operational_efficiency: 60,
    innovation: 65,
    team_satisfaction: 70,
    project_success_rate: 85,
  },
};
